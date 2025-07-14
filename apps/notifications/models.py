from enum import Enum
from django.db import models
from core.abstract_models import TimeStampModel


class NotificationType(models.TextChoices):
     # Organization invitations
     ORGANIZATION_INVITATION_SENT = 'org_invitation_sent', 'Organization Invitation Sent'
     ORGANIZATION_INVITATION_ACCEPTED = 'org_invitation_accepted', 'Organization Invitation Accepted'
     ORGANIZATION_INVITATION_REJECTED = 'org_invitation_rejected', 'Organization Invitation Rejected'
     
     # Event notifications
     EVENT_CREATED = 'event_created', 'Event Created'
     EVENT_UPDATED = 'event_updated', 'Event Updated'
     EVENT_CANCELLED = 'event_cancelled', 'Event Cancelled'
     EVENT_PUBLISHED = 'event_published', 'Event Published'
     
     # Attendee notifications
     ATTENDEE_REGISTERED = 'attendee_registered', 'Attendee Registered'
     ATTENDEE_CONFIRMED = 'attendee_confirmed', 'Registration Confirmed'
     ATTENDEE_REJECTED = 'attendee_rejected', 'Registration Rejected'
     ATTENDEE_WAITLISTED = 'attendee_waitlisted', 'Added to Waitlist'
     ATTENDEE_PROMOTED = 'attendee_promoted', 'Promoted from Waitlist'
     
     # Event reminders
     EVENT_REMINDER_24H = 'event_reminder_24h', 'Event Reminder (24 hours)'
     EVENT_REMINDER_1H = 'event_reminder_1h', 'Event Reminder (1 hour)'


class NotificationChannel(models.TextChoices):
     EMAIL = 'email', 'Email'
     WEBSOCKET = 'websocket', 'WebSocket'
     SMS = 'sms', 'SMS'  # For future use


class NotificationStatus(models.TextChoices):
     PENDING = 'pending', 'Pending'
     SENT = 'sent', 'Sent'
     FAILED = 'failed', 'Failed'
     DELIVERED = 'delivered', 'Delivered'


class NotificationTemplate(TimeStampModel):
     """Template for different notification types"""
     type = models.CharField(max_length=50, choices=NotificationType.choices)
     channel = models.CharField(max_length=20, choices=NotificationChannel.choices)
     
     # Email specific fields
     subject_template = models.CharField(max_length=255, blank=True)
     body_template = models.TextField(blank=True)
     
     # WebSocket specific fields (for future use)
     title_template = models.CharField(max_length=255, blank=True)
     message_template = models.TextField(blank=True)
     
     is_active = models.BooleanField(default=True)
     
     class Meta:
          unique_together = ['type', 'channel']
     
     def __str__(self):
          return f"{self.get_type_display()} - {self.get_channel_display()}"


class Notification(TimeStampModel):
     """Individual notification instance"""
     type = models.CharField(max_length=50, choices=NotificationType.choices)
     channel = models.CharField(max_length=20, choices=NotificationChannel.choices)
     
     # Recipients
     recipient_email = models.EmailField()
     recipient_user = models.ForeignKey(
          'users.CustomUser',
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='notifications'
     )
     
     # Content
     subject = models.CharField(max_length=255, blank=True)
     message = models.TextField()
     
     # Related objects (for context)
     event = models.ForeignKey(
          'events.Event',
          on_delete=models.CASCADE,
          null=True,
          blank=True,
          related_name='notifications'
     )
     organization = models.ForeignKey(
          'organizations.Organization',
          on_delete=models.CASCADE,
          null=True,
          blank=True,
          related_name='notifications'
     )
     invitation = models.ForeignKey(
          'organizations.OrganizationInvitation',
          on_delete=models.CASCADE,
          null=True,
          blank=True,
          related_name='notifications'
     )
     
     # Status tracking
     status = models.CharField(max_length=20, choices=NotificationStatus.choices, default=NotificationStatus.PENDING)
     sent_at = models.DateTimeField(null=True, blank=True)
     delivered_at = models.DateTimeField(null=True, blank=True)
     error_message = models.TextField(blank=True)
     
     # Metadata
     metadata = models.JSONField(default=dict, blank=True)  # For additional context data
     
     class Meta:
          ordering = ['-created_at']
          indexes = [
               models.Index(fields=['type', 'status']),
               models.Index(fields=['recipient_email', 'created_at']),
               models.Index(fields=['event', 'type']),
          ]
     
     def __str__(self):
          return f"{self.get_type_display()} to {self.recipient_email}"
