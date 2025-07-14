from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from apps.events.models import Event, EventStatus
from services.notification.notification_service import EventNotificationService, NotificationType


class Command(BaseCommand):
     help = 'Send event reminder notifications'

     def add_arguments(self, parser):
          parser.add_argument(
               '--reminder-type',
               type=str,
               choices=['24h', '1h'],
               default='24h',
               help='Type of reminder to send (24h or 1h before event)'
          )
          parser.add_argument(
               '--dry-run',
               action='store_true',
               help='Run without actually sending emails'
          )

     def handle(self, *args, **options):
          reminder_type = options['reminder_type']
          dry_run = options['dry_run']
          
          now = timezone.now()
          
          if reminder_type == '24h':
               # Events starting in 24 hours
               target_time = now + timedelta(hours=24)
               time_window = timedelta(hours=1)  # 1-hour window around 24h mark
               notification_type = NotificationType.EVENT_REMINDER_24H
               reminder_label = "24-hour"
          else:  # 1h
               # Events starting in 1 hour
               target_time = now + timedelta(hours=1)
               time_window = timedelta(minutes=15)  # 15-minute window around 1h mark
               notification_type = NotificationType.EVENT_REMINDER_1H
               reminder_label = "1-hour"

          # Find events that need reminders
          events_needing_reminders = Event.objects.filter(
               status=EventStatus.PUBLISHED,
               start_datetime__gte=target_time - time_window,
               start_datetime__lte=target_time + time_window
          ).select_related('created_by', 'created_by__organization')

          self.stdout.write(f"Found {events_needing_reminders.count()} events needing {reminder_label} reminders")

          reminders_sent = 0
          for event in events_needing_reminders:
               # Get confirmed attendees
               confirmed_attendees = event.attendees.filter(status='confirmed')
               
               self.stdout.write(f"Processing event: {event.name} ({confirmed_attendees.count()} attendees)")
               
               if dry_run:
                    self.stdout.write(f"  [DRY RUN] Would send {reminder_label} reminders to {confirmed_attendees.count()} attendees")
                    continue
               
               # Send reminders to each confirmed attendee
               for attendee in confirmed_attendees:
                    try:
                         # Check if reminder already sent (to avoid duplicates)
                         from apps.notifications.models import Notification
                         already_sent = Notification.objects.filter(
                         type=notification_type,
                         event=event,
                         recipient_email=attendee.email,
                         status__in=['sent', 'delivered']
                         ).exists()
                         
                         if already_sent:
                              self.stdout.write(f"  Skipping {attendee.email} - reminder already sent")
                              continue
                         
                         # Prepare context
                         context = {
                         'attendee_name': attendee.full_name,
                         'event_name': event.name,
                         'event_date': event.start_datetime.strftime('%B %d, %Y'),
                         'event_time': event.start_datetime.strftime('%I:%M %p'),
                         'venue_name': event.venue_name,
                         'venue_address': event.venue_address,
                         'organization_name': event.created_by.organization.name if event.created_by and event.created_by.organization else 'Event Organizer',
                         'reminder_type': reminder_label
                         }
                         
                         # Send reminder notification
                         from services.notification.notification_service import NotificationService
                         notification = NotificationService.send_notification(
                         notification_type=notification_type,
                         recipient_email=attendee.email,
                         context=context,
                         recipient_user=attendee.user,
                         event=event
                         )
                         
                         if notification.status == 'sent':
                              reminders_sent += 1
                              self.stdout.write(f"  ✓ Sent {reminder_label} reminder to {attendee.email}")
                         else:
                              self.stdout.write(f"  ✗ Failed to send reminder to {attendee.email}: {notification.error_message}")
                         
                    except Exception as e:
                         self.stdout.write(f"  ✗ Error sending reminder to {attendee.email}: {str(e)}")

          if dry_run:
               self.stdout.write(
                    self.style.WARNING(f'DRY RUN COMPLETE - No emails sent')
               )
          else:
               self.stdout.write(
                    self.style.SUCCESS(f'Successfully sent {reminders_sent} {reminder_label} reminders')
               )
