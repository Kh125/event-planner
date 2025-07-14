from django.template import Template, Context
from django.utils import timezone
from django.conf import settings
from typing import Dict, Any
import logging
from apps.notifications.models import (
    Notification, NotificationTemplate, NotificationType, 
    NotificationChannel, NotificationStatus
)
from services.mail.mail_service import MailService

logger = logging.getLogger(__name__)


class NotificationService:
     """
     Unified notification service that handles email notifications now
     and can be extended for WebSocket notifications later
     """
     
     @staticmethod
     def send_notification(
          notification_type: str,
          recipient_email: str,
          context: Dict[str, Any],
          recipient_user=None,
          event=None,
          organization=None,
          invitation=None,
          channel: str = NotificationChannel.EMAIL
     ) -> Notification:
          """
          Send a notification through the specified channel
          
          Args:
               notification_type: Type of notification from NotificationType
               recipient_email: Email address of the recipient
               context: Context data for template rendering
               recipient_user: User object (optional)
               event: Related event (optional)
               organization: Related organization (optional)
               invitation: Related invitation (optional)
               channel: Notification channel (default: email)
               
          Returns:
               Notification: Created notification instance
          """
          try:
               # Get or create template
               template = NotificationService._get_template(notification_type, channel)
               
               # Render content
               subject, message = NotificationService._render_content(
                    template, context, notification_type, channel
               )
               
               # Create notification record
               notification = Notification.objects.create(
                    type=notification_type,
                    channel=channel,
                    recipient_email=recipient_email,
                    recipient_user=recipient_user,
                    subject=subject,
                    message=message,
                    event=event,
                    organization=organization,
                    invitation=invitation,
                    metadata=context
               )
               
               # Send notification based on channel
               if channel == NotificationChannel.EMAIL:
                    NotificationService._send_email_notification(notification)
               elif channel == NotificationChannel.WEBSOCKET:
                    # Future WebSocket implementation
                    NotificationService._send_websocket_notification(notification)
               
               return notification
               
          except Exception as e:
               logger.error(f"Failed to send notification {notification_type}: {str(e)}")
               # Create failed notification record
               notification = Notification.objects.create(
                    type=notification_type,
                    channel=channel,
                    recipient_email=recipient_email,
                    recipient_user=recipient_user,
                    subject="Failed to generate",
                    message="Failed to generate",
                    status=NotificationStatus.FAILED,
                    error_message=str(e),
                    event=event,
                    organization=organization,
                    invitation=invitation,
                    metadata=context
               )
               return notification
     
     @staticmethod
     def _get_template(notification_type: str, channel: str) -> NotificationTemplate:
          """Get or create notification template"""
          template, created = NotificationTemplate.objects.get_or_create(
               type=notification_type,
               channel=channel,
               defaults=NotificationService._get_default_template_content(notification_type, channel)
          )
          return template
     
     @staticmethod
     def _render_content(template: NotificationTemplate, context: Dict[str, Any], 
                         notification_type: str, channel: str) -> tuple:
          """Render notification content using templates"""
          try:
               if channel == NotificationChannel.EMAIL:
                    subject_template = Template(template.subject_template)
                    body_template = Template(template.body_template)
                    
                    django_context = Context(context)
                    subject = subject_template.render(django_context)
                    message = body_template.render(django_context)
                    
                    return subject, message
                    
               elif channel == NotificationChannel.WEBSOCKET:
                    title_template = Template(template.title_template)
                    message_template = Template(template.message_template)
                    
                    django_context = Context(context)
                    title = title_template.render(django_context)
                    message = message_template.render(django_context)
                    
                    return title, message
                    
          except Exception as e:
               logger.error(f"Template rendering failed for {notification_type}: {str(e)}")
               # Fallback to basic content
               return NotificationService._get_fallback_content(notification_type, context)
     
     @staticmethod
     def _send_email_notification(notification: Notification) -> None:
          """Send email notification using existing MailService"""
          try:
               MailService._send_mail(
                    subject=notification.subject,
                    message=notification.message,
                    recipient_list=[notification.recipient_email]
               )
               
               # Update notification status
               notification.status = NotificationStatus.SENT
               notification.sent_at = timezone.now()
               notification.save(update_fields=['status', 'sent_at'])
               
               logger.info(f"Email sent successfully to {notification.recipient_email}")
               
          except Exception as e:
               logger.error(f"Failed to send email to {notification.recipient_email}: {str(e)}")
               notification.status = NotificationStatus.FAILED
               notification.error_message = str(e)
               notification.save(update_fields=['status', 'error_message'])
     
     @staticmethod
     def _send_websocket_notification(notification: Notification) -> None:
          """Send WebSocket notification (placeholder for future implementation)"""
          # TODO: Implement WebSocket notification
          logger.info(f"WebSocket notification queued for {notification.recipient_email}")
          notification.status = NotificationStatus.PENDING  # Keep as pending for now
          notification.save(update_fields=['status'])
     
     @staticmethod
     def _get_default_template_content(notification_type: str, channel: str) -> dict:
          """Get default template content for notification types"""
          
          templates = {
               # Organization Invitations
               NotificationType.ORGANIZATION_INVITATION_SENT: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Invitation to join {{ organization_name }}',
                         'body_template': '''
                              Dear {{ recipient_name }},

                              You have been invited to join {{ organization_name }} as a {{ role_name }}.

                              {{ message }}

                              To accept this invitation and create your account, please click the link below:
                              {{ invitation_url }}

                              This invitation will expire on {{ expires_at }}.

                              If you did not expect this invitation, please ignore this email.

                              Best regards,
                              {{ invited_by_name }}
                              {{ organization_name }}
                              '''.strip()}},
               
               # Event Notifications  
               NotificationType.EVENT_CREATED: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'New Event Created: {{ event_name }}',
                         'body_template': '''
                              Hello {{ organization_name }} Team,

                              A new event has been created:

                              Event: {{ event_name }}
                              Date: {{ event_date }}
                              Venue: {{ venue_name }}
                              Created by: {{ creator_name }}

                              {{ event_description }}

                              Event Details: {{ event_url }}

                              Best regards,
                              EVP Team
                                                  '''.strip()
                                             }
                                        },
               
               # Event Cancelled
               NotificationType.EVENT_CANCELLED: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Event Cancelled: {{ event_name }}',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              We regret to inform you that the following event has been cancelled:

                              Event: {{ event_name }}
                              Originally scheduled: {{ event_date }}
                              Venue: {{ venue_name }}

                              {{ cancellation_reason }}

                              We apologize for any inconvenience this may cause.

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}},
               
               # Attendee Notifications
               NotificationType.ATTENDEE_REGISTERED: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Registration Confirmed: {{ event_name }}',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              Thank you for registering for {{ event_name }}.

                              Event Details:
                              - Date: {{ event_date }}
                              - Time: {{ event_time }}
                              - Venue: {{ venue_name }}
                              - Address: {{ venue_address }}

                              {% if registration_status == "confirmed" %}
                              Your registration is confirmed! We look forward to seeing you at the event.
                              {% elif registration_status == "pending" %}
                              Your registration is pending approval. You will receive another email once your registration is confirmed.
                              {% elif registration_status == "waitlisted" %}
                              You have been added to the waitlist. We'll notify you if a spot becomes available.
                              {% endif %}

                              Registration Details: {{ registration_url }}

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}},
               
               # Attendee Confirmation
               NotificationType.ATTENDEE_CONFIRMED: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Registration Approved: {{ event_name }}',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              Great news! Your registration for {{ event_name }} has been approved.

                              Event Details:
                              - Date: {{ event_date }}
                              - Time: {{ event_time }}
                              - Venue: {{ venue_name }}
                              - Address: {{ venue_address }}

                              We look forward to seeing you at the event!

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}},
               
               # Attendee Waitlisted
               NotificationType.ATTENDEE_WAITLISTED: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Added to Waitlist: {{ event_name }}',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              You have been added to the waitlist for {{ event_name }}.

                              We'll notify you immediately if a spot becomes available.

                              Event Details:
                              - Date: {{ event_date }}
                              - Time: {{ event_time }}
                              - Venue: {{ venue_name }}

                              Thank you for your interest!

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}},
               
               # Event Reminder 24 Hour
               NotificationType.EVENT_REMINDER_24H: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Reminder: {{ event_name }} tomorrow',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              This is a friendly reminder that you're registered for {{ event_name }} tomorrow.

                              Event Details:
                              - Date: {{ event_date }}
                              - Time: {{ event_time }}
                              - Venue: {{ venue_name }}
                              - Address: {{ venue_address }}

                              We look forward to seeing you there!

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}},
               
               # Event Reminder 1 Hour
               NotificationType.EVENT_REMINDER_1H: {
                    NotificationChannel.EMAIL: {
                         'subject_template': 'Starting Soon: {{ event_name }} in 1 hour',
                         'body_template': '''
                              Dear {{ attendee_name }},

                              {{ event_name }} is starting in 1 hour!

                              Event Details:
                              - Time: {{ event_time }}
                              - Venue: {{ venue_name }}
                              - Address: {{ venue_address }}

                              Please make sure to arrive on time. We're excited to see you there!

                              Best regards,
                              {{ organization_name }}
                              '''.strip()}}
          }
          
          # Return the template for the specific type and channel, or default empty template
          return templates.get(notification_type, {}).get(channel, {
               'subject_template': 'Notification',
               'body_template': 'You have a new notification.',
               'title_template': 'Notification',
               'message_template': 'You have a new notification.'
          })
     
     @staticmethod
     def _get_fallback_content(notification_type: str, context: Dict[str, Any]) -> tuple:
          """Get fallback content when template rendering fails"""
          subject = f"Notification: {notification_type.replace('_', ' ').title()}"
          message = f"You have a new notification of type: {notification_type}"
          return subject, message


# Convenience methods for specific notification types
class EventNotificationService:
     """Event-specific notification helpers"""
     
     @staticmethod
     def send_attendee_registration_notification(attendee, event):
          """Send registration confirmation to attendee"""
          context = {
               'attendee_name': attendee.full_name,
               'event_name': event.name,
               'event_date': event.start_datetime.strftime('%B %d, %Y'),
               'event_time': event.start_datetime.strftime('%I:%M %p'),
               'venue_name': event.venue_name,
               'venue_address': event.venue_address,
               'registration_status': attendee.status,
               'organization_name': event.created_by.organization.name if event.created_by and event.created_by.organization else 'Event Organizer',
               'registration_url': f"{settings.FRONTEND_BASE_URL}/events/{event.slug}"
          }
          
          return NotificationService.send_notification(
               notification_type=NotificationType.ATTENDEE_REGISTERED,
               recipient_email=attendee.email,
               context=context,
               recipient_user=attendee.user,
               event=event
          )
     
     @staticmethod
     def send_attendee_status_update_notification(attendee, event, old_status):
          """Send status update notification to attendee"""
          # Determine notification type based on new status
          notification_type_map = {
               'confirmed': NotificationType.ATTENDEE_CONFIRMED,
               'rejected': NotificationType.ATTENDEE_REJECTED,
               'waitlisted': NotificationType.ATTENDEE_WAITLISTED,
          }
          
          notification_type = notification_type_map.get(attendee.status)
          if not notification_type:
               return None
               
          context = {
               'attendee_name': attendee.full_name,
               'event_name': event.name,
               'event_date': event.start_datetime.strftime('%B %d, %Y'),
               'event_time': event.start_datetime.strftime('%I:%M %p'),
               'venue_name': event.venue_name,
               'venue_address': event.venue_address,
               'organization_name': event.created_by.organization.name if event.created_by and event.created_by.organization else 'Event Organizer',
               'old_status': old_status,
               'new_status': attendee.status
          }
          
          return NotificationService.send_notification(
               notification_type=notification_type,
               recipient_email=attendee.email,
               context=context,
               recipient_user=attendee.user,
               event=event
          )
     
     @staticmethod
     def send_event_cancellation_notification(event, attendees_queryset=None):
          """Send cancellation notification to all confirmed attendees"""
          if attendees_queryset is None:
               attendees_queryset = event.attendees.filter(status='confirmed')
          
          notifications = []
          for attendee in attendees_queryset:
               context = {
                    'attendee_name': attendee.full_name,
                    'event_name': event.name,
                    'event_date': event.start_datetime.strftime('%B %d, %Y'),
                    'venue_name': event.venue_name,
                    'organization_name': event.created_by.organization.name if event.created_by and event.created_by.organization else 'Event Organizer',
                    'cancellation_reason': 'The event has been cancelled by the organizer.'
               }
               
               notification = NotificationService.send_notification(
                    notification_type=NotificationType.EVENT_CANCELLED,
                    recipient_email=attendee.email,
                    context=context,
                    recipient_user=attendee.user,
                    event=event
               )
               notifications.append(notification)
          
          return notifications


class OrganizationNotificationService:
     """Organization-specific notification helpers"""
     
     @staticmethod
     def send_invitation_notification(invitation):
          """Send invitation email to invited user"""
          invitation_url = f"{settings.FRONTEND_BASE_URL}/invitations/accept?token={invitation.token}"
          
          context = {
               'recipient_name': invitation.email.split('@')[0].title(),  # Use email prefix as name
               'organization_name': invitation.organization.name,
               'role_name': 'Member',  # Default role, can be enhanced later
               'message': getattr(invitation, 'message', 'You have been invited to join our organization.'),
               'invitation_url': invitation_url,
               'expires_at': invitation.expired_at.strftime('%B %d, %Y at %I:%M %p'),
               'invited_by_name': invitation.invited_by.full_name if invitation.invited_by else 'Organization Admin'
          }
          
          return NotificationService.send_notification(
               notification_type=NotificationType.ORGANIZATION_INVITATION_SENT,
               recipient_email=invitation.email,
               context=context,
               organization=invitation.organization,
               invitation=invitation
          )
