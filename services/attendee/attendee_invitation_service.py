from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from datetime import timedelta

from apps.events.models import Event, AttendeeInvitation, AttendeeInvitationStatus, Attendee, AttendeeStatus
from apps.events.serializers.attendee_invitation_serializer import (
    AttendeeInvitationSerializer, AttendeeInvitationStatsSerializer, PublicInvitationDetailSerializer
)
from apps.events.serializers.event_serializer import AttendeeSerializer
from services.notification.notification_service import EventNotificationService


class AttendeeInvitationService:
    """Service for handling attendee invitation logic"""
    
    @staticmethod
    def send_invitations(event: Event, inviter, validated_data: dict) -> dict:
        """
        Send invitations to multiple email addresses
        
        Args:
            event: The event to invite attendees to
            inviter: User sending the invitations
            validated_data: Validated invitation data including emails list
            
        Returns:
            dict: Summary of sent invitations
        """
        # Check permissions
        if not AttendeeInvitationService._can_send_invitations(event, inviter):
            raise PermissionDenied("You don't have permission to send invitations for this event.")
        
        emails = validated_data.pop('emails')
        sent_count = 0
        skipped_count = 0
        errors = []
        
        with transaction.atomic():
            for email in emails:
                try:
                    # Check if already invited or registered
                    if AttendeeInvitationService._is_already_invited_or_registered(event, email):
                        skipped_count += 1
                        errors.append(f"{email}: Already invited or registered")
                        continue
                    
                    # Create invitation
                    invitation = AttendeeInvitation.objects.create(
                        event=event,
                        email=email.lower(),
                        invited_by=inviter,
                        expires_at=timezone.now() + timedelta(days=7),  # 7 days to respond
                        **validated_data
                    )
                    
                    # Send invitation email
                    AttendeeInvitationService._send_invitation_email(invitation)
                    sent_count += 1
                    
                except Exception as e:
                    errors.append(f"{email}: {str(e)}")
                    skipped_count += 1
        
        return {
            'sent_count': sent_count,
            'skipped_count': skipped_count,
            'total_attempted': len(emails),
            'errors': errors
        }
    
    @staticmethod
    def get_event_invitations(event: Event, user) -> list:
        """Get all invitations for an event"""
        if not AttendeeInvitationService._can_manage_invitations(event, user):
            raise PermissionDenied("You don't have permission to view invitations for this event.")
        
        invitations = event.invitations.select_related('invited_by').order_by('-created_at')
        serializer = AttendeeInvitationSerializer(invitations, many=True)
        return serializer.data
    
    @staticmethod
    def verify_invitation(token: str) -> dict:
        """Verify invitation token and return invitation details"""
        try:
            invitation = AttendeeInvitation.objects.select_related(
                'event', 'invited_by', 'event__created_by__organization'
            ).get(token=token)
        except AttendeeInvitation.DoesNotExist:
            raise NotFound("Invitation not found.")
        
        if invitation.status != AttendeeInvitationStatus.PENDING:
            raise ValidationError(f"Invitation has already been {invitation.status}.")
        
        if invitation.is_expired():
            # Auto-mark as expired
            invitation.status = AttendeeInvitationStatus.EXPIRED
            invitation.save()
            raise ValidationError("Invitation has expired.")
        
        serializer = PublicInvitationDetailSerializer(invitation)
        return serializer.data
    
    @staticmethod
    def accept_invitation(token: str, attendee_data: dict) -> dict:
        """Accept an invitation and register as attendee"""
        try:
            invitation = AttendeeInvitation.objects.select_related('event').get(token=token)
        except AttendeeInvitation.DoesNotExist:
            raise NotFound("Invitation not found.")
        
        if not invitation.can_accept():
            raise ValidationError("Invitation cannot be accepted.")
        
        # Check if event is at capacity (unless invitation bypasses capacity)
        if not invitation.bypass_capacity and invitation.event.is_full:
            raise ValidationError("Event is at full capacity.")
        
        with transaction.atomic():
            # Create attendee
            attendee_status = AttendeeStatus.CONFIRMED if invitation.is_vip else AttendeeStatus.CONFIRMED
            
            # Remove email from attendee_data if present to avoid duplicate keyword argument
            attendee_data_clean = attendee_data.copy()
            attendee_data_clean.pop('email', None)  # Remove email if present
            
            attendee = Attendee.objects.create(
                event=invitation.event,
                email=invitation.email,
                status=attendee_status,
                **attendee_data_clean
            )
            
            # Update invitation
            invitation.status = AttendeeInvitationStatus.ACCEPTED
            invitation.responded_at = timezone.now()
            invitation.attendee = attendee
            invitation.save()
            
            # Send confirmation email
            EventNotificationService.send_attendee_registration_notification(
                attendee, invitation.event
            )
        
        serializer = AttendeeSerializer(attendee)
        return serializer.data
    
    @staticmethod
    def reject_invitation(token: str, reason: str = None) -> None:
        """Reject an invitation"""
        try:
            invitation = AttendeeInvitation.objects.get(token=token)
        except AttendeeInvitation.DoesNotExist:
            raise NotFound("Invitation not found.")
        
        if invitation.status != AttendeeInvitationStatus.PENDING:
            raise ValidationError(f"Invitation has already been {invitation.status}.")
        
        invitation.status = AttendeeInvitationStatus.REJECTED
        invitation.responded_at = timezone.now()
        invitation.save()
        
        # TODO: Optionally notify event organizer about rejection
    
    @staticmethod
    def cancel_invitation(event: Event, user, invitation_id: int) -> None:
        """Cancel a pending invitation"""
        if not AttendeeInvitationService._can_manage_invitations(event, user):
            raise PermissionDenied("You don't have permission to cancel invitations.")
        
        try:
            invitation = event.invitations.get(id=invitation_id, status=AttendeeInvitationStatus.PENDING)
        except AttendeeInvitation.DoesNotExist:
            raise NotFound("Invitation not found or already responded to.")
        
        invitation.status = AttendeeInvitationStatus.CANCELLED
        invitation.save()
    
    @staticmethod
    def resend_invitation(event: Event, user, invitation_id: int) -> dict:
        """Resend an invitation"""
        if not AttendeeInvitationService._can_manage_invitations(event, user):
            raise PermissionDenied("You don't have permission to resend invitations.")
        
        try:
            invitation = event.invitations.get(id=invitation_id, status=AttendeeInvitationStatus.PENDING)
        except AttendeeInvitation.DoesNotExist:
            raise NotFound("Invitation not found or already responded to.")
        
        # Extend expiration if needed
        if invitation.is_expired():
            invitation.expires_at = timezone.now() + timedelta(days=7)
            invitation.save()
        
        # Resend email
        AttendeeInvitationService._send_invitation_email(invitation)
        
        serializer = AttendeeInvitationSerializer(invitation)
        return serializer.data
    
    @staticmethod
    def get_invitation_stats(event: Event, user) -> dict:
        """Get invitation statistics for an event"""
        if not AttendeeInvitationService._can_manage_invitations(event, user):
            raise PermissionDenied("You don't have permission to view invitation stats.")
        
        invitations = event.invitations.all()
        total = invitations.count()
        
        if total == 0:
            return {
                'total_invitations': 0,
                'pending_invitations': 0,
                'accepted_invitations': 0,
                'rejected_invitations': 0,
                'expired_invitations': 0,
                'response_rate': 0.00
            }
        
        stats = {
            'total_invitations': total,
            'pending_invitations': invitations.filter(status=AttendeeInvitationStatus.PENDING).count(),
            'accepted_invitations': invitations.filter(status=AttendeeInvitationStatus.ACCEPTED).count(),
            'rejected_invitations': invitations.filter(status=AttendeeInvitationStatus.REJECTED).count(),
            'expired_invitations': invitations.filter(status=AttendeeInvitationStatus.EXPIRED).count(),
        }
        
        # Calculate response rate (accepted + rejected / total)
        responded = stats['accepted_invitations'] + stats['rejected_invitations']
        stats['response_rate'] = round((responded / total) * 100, 2) if total > 0 else 0.00
        
        return stats
    
    @staticmethod
    def _can_send_invitations(event: Event, user) -> bool:
        """Check if user can send invitations for event"""
        return (
            event.created_by == user or 
            (event.created_by and event.created_by.organization == user.organization)
        )
    
    @staticmethod
    def _can_manage_invitations(event: Event, user) -> bool:
        """Check if user can manage invitations for event"""
        return AttendeeInvitationService._can_send_invitations(event, user)
    
    @staticmethod
    def _is_already_invited_or_registered(event: Event, email: str) -> bool:
        """Check if email is already invited or registered for event"""
        return (
            event.invitations.filter(email=email.lower(), status=AttendeeInvitationStatus.PENDING).exists() or
            event.attendees.filter(email=email.lower()).exists()
        )
    
    @staticmethod
    def _send_invitation_email(invitation: AttendeeInvitation) -> None:
        """Send invitation email notification"""
        from django.conf import settings
        
        context = {
            'recipient_name': invitation.full_name or invitation.email.split('@')[0].title(),
            'inviter_name': invitation.invited_by.full_name if invitation.invited_by else 'Event Organizer',
            'event_name': invitation.event.name,
            'event_description': invitation.event.description,
            'event_date': invitation.event.start_datetime.strftime('%B %d, %Y'),
            'event_time': invitation.event.start_datetime.strftime('%I:%M %p'),
            'venue_name': invitation.event.venue_name,
            'venue_address': invitation.event.venue_address,
            'organization_name': 'Event Organization',  # Simplified for now
            'invitation_url': f"{settings.FRONTEND_BASE_URL}/invitations/attendee/accept?token={invitation.token}",
            'personal_message': invitation.message,
            'expires_at': invitation.expires_at.strftime('%B %d, %Y at %I:%M %p'),
            'is_vip': invitation.is_vip
        }
        
        from services.notification.notification_service import NotificationService, NotificationType
        
        NotificationService.send_notification(
            notification_type=NotificationType.ATTENDEE_INVITED,
            recipient_email=invitation.email,
            context=context,
            event=invitation.event
            # Note: Not passing invitation parameter as it's for OrganizationInvitation only
        )
