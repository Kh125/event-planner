from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError, NotFound
from django.db import transaction
from apps.organizations.models import Organization, OrganizationInvitation
from apps.organizations.serializers.invitation_serializer import InvitationSerializer
from apps.users.models import CustomUser
from services.notification.notification_service import OrganizationNotificationService

class InvitationService:
     @staticmethod
     def send_invitation(organization: Organization, invited_user: CustomUser, validated_data: dict) -> dict:
          """
          Send invitation to join organization
          
          Args:
               organization: The organization to invite to
               user: Invited User
               validated_data: Email, role, and optional message
               
          Returns:
               dict: Invitation data
          """
          if organization.created_by != invited_user:
               raise PermissionDenied("Only organization owner can send invitations.")
          
          email = validated_data['email']
          
          existing_user = CustomUser.objects.filter(email=email).first()
          
          if existing_user:
               raise ValidationError("User is alredy register on the platform.")

          pending_invitation = organization.invitations.filter(
               email=email,
               is_invitation_accepted = False
          ).first()
          
          if pending_invitation and pending_invitation.is_valid():
               raise ValidationError("A pending invitation already exists for this email")

          with transaction.atomic():
               organization.invitations.filter(email=email, is_invitation_accepted=False).delete()
               
               invitation = OrganizationInvitation.objects.create(
                    organization=organization,
                    invited_by = invited_user,
                    email=email,
               )
               
               # Send invitation email using notification service
               OrganizationNotificationService.send_invitation_notification(invitation)
               
               serializer = InvitationSerializer(invitation)
               
               return serializer.data
     
     @staticmethod
     def get_organization_invitations(organization: Organization, user: CustomUser) -> list:
          """
          Get all invitations for an organization
          
          Args:
               organization: The organization
               user: The requesting user (must be owner)
               
          Returns:
               list: List of invitations
          """
          if organization.created_by != user:
               raise PermissionDenied("Only organization owner can view invitations")
          
          invitations = organization.invitations.select_related('invited_by').order_by('-created_at')
          serializer = InvitationSerializer(invitations, many=True)
          
          return serializer.data

     @staticmethod
     def cancel_invitation(organization: Organization, user: CustomUser, invitation_id: int) -> None:
          """
          Cancel a pending invitation
          
          Args:
               organization: The organization
               user: The requesting user (must be owner)
               invitation_id: ID of invitation to cancel
          """
          # Verify user is organization owner
          if organization.created_by != user:
               raise PermissionDenied("Only organization owner can cancel invitations")
          
          try:
               invitation = organization.invitations.get(id=invitation_id, is_invitation_accepted=False)
          except OrganizationInvitation.DoesNotExist:
               raise NotFound("Invitation not found or already accepted")
          
          invitation.delete()
     
     @staticmethod
     def verify_invitation_token(token: str) -> dict:
          """
          Verify an invitation token and return invitation details
          
          Args:
               token: The invitation token
               
          Returns:
               dict: Invitation details for registration form
          """
          try:
               invitation = OrganizationInvitation.objects.select_related(
                    'organization'
               ).get(token=token)
          except OrganizationInvitation.DoesNotExist:
               raise NotFound("Invalid invitation token")
          
          if not invitation.is_valid():
               if invitation.accepted:
                    raise ValidationError("This invitation has already been accepted")
               elif invitation.is_expired():
                    raise ValidationError("This invitation has expired")
          
          return {
               'email': invitation.email,
               'organization_name': invitation.organization.name,
               'invited_by': invitation.invited_by.full_name,
               'expired_at': invitation.expired_at
          }
     
     @staticmethod
     def accept_invitation(validated_data: dict) -> dict:
          """
          Accept an invitation and create user account
          
          Args:
               validated_data: Token, user details, and password
          Returns:
               dict: Created user data
          """
          token = validated_data['token']
          
          try:
               invitation: OrganizationInvitation = OrganizationInvitation.objects.select_related(
                    'organization'
               ).get(token=token)
          except OrganizationInvitation.DoesNotExist:
               raise NotFound("Invalid invitation token")
          
          if not invitation.is_valid():
               if invitation.is_invitation_accepted:
                    raise ValidationError("This invitation has already accepted.")
               elif invitation.is_expired():
                    raise ValidationError("This invitation has already expired.")
          
          existing_user = CustomUser.objects.filter(email=invitation.email).first()
          
          if existing_user:
               raise ValidationError("User with this email already exist on the app.")
          
          with transaction.atomic():
               user = CustomUser.objects.create_organization_admin(
                    organization = invitation.organization,
                    email = invitation.email, 
                    password = validated_data['password'],
                    full_name = validated_data['full_name'],
                    is_active = True,
               )
               
               invitation.is_invitation_accepted = True
               invitation.accepted_at = timezone.now()
               invitation.accepted_by = user
               
               invitation.save()
               
               # TODO: Send welcome email
               # send_welcome_email(user)
               
               return {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': user.role.name,
                    'organization': user.organization.name
               }
     
     @staticmethod
     def resend_invitation(organization: Organization, user: CustomUser, invitation_id: int) -> dict:
          """
          Resend an invitation email
          
          Args:
               organization: The organization
               user: The requesting user (must be owner)
               invitation_id: ID of invitation to resend
               
          Returns:
               dict: Updated invitation data
          """
          # Verify user is organization owner
          if organization.created_by != user:
               raise PermissionDenied("Only organization owner can resend invitations")
          
          try:
               invitation = organization.invitations.get(id=invitation_id, is_invitation_accepted=False)
          except OrganizationInvitation.DoesNotExist:
               raise NotFound("Invitation not found or already accepted")
          
          if invitation.is_expired():
               # Extend expiration
               from datetime import timedelta
               invitation.expires_at = timezone.now() + timedelta(days=7)
               invitation.save()
          
          # Send invitation email again using notification service
          OrganizationNotificationService.send_invitation_notification(invitation)
          
          serializer = InvitationSerializer(invitation)
          
          return serializer.data