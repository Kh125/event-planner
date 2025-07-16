# Email Notification System Documentation

## Overview

The Event Planner application now includes a comprehensive notification system that handles email notifications for various events in the system. The system is designed to be extensible for future WebSocket notifications.

## Features

### ✅ **Implemented Features**

1. **Organization Invitations**
   - Send invitation emails when users are invited to organizations
   - Automatic email sending on invitation creation and resend

2. **Event Attendee Notifications**
   - Registration confirmation emails (pending/confirmed/waitlisted)
   - Status update notifications when attendee status changes
   - Event cancellation notifications to all confirmed attendees

3. **Event Reminders**
   - 24-hour advance reminders
   - 1-hour advance reminders
   - Management command for automated sending

4. **Template System**
   - Customizable email templates for all notification types
   - Django template engine support with context variables
   - Admin interface for template management

5. **Notification Tracking**
   - Complete audit trail of all sent notifications
   - Status tracking (pending, sent, failed, delivered)
   - Error logging and retry capability

### 🔮 **Future-Ready Features**

1. **WebSocket Support**
   - Framework ready for real-time notifications
   - Separate templates for WebSocket messages
   - Extensible for push notifications

## Architecture

### Models

- **`NotificationTemplate`**: Stores email/WebSocket templates
- **`Notification`**: Tracks individual notification instances
- **`NotificationType`**: Enum for different notification types
- **`NotificationChannel`**: Enum for delivery channels (email, WebSocket, SMS)
- **`NotificationStatus`**: Enum for tracking delivery status

### Services

- **`NotificationService`**: Core notification sending logic
- **`EventNotificationService`**: Event-specific notification helpers
- **`OrganizationNotificationService`**: Organization-specific notification helpers

## API Endpoints

### Notification Management
```
GET /api/notifications/                 # List user notifications
GET /api/notifications/templates/       # List notification templates (admin)
POST /api/notifications/test/           # Send test email (authenticated users)
```

### Integration Points
- **Organization Invitations**: Automatic emails on invite/resend
- **Event Registration**: Automatic emails on registration
- **Status Updates**: Automatic emails on status changes
- **Event Cancellation**: Automatic emails to all attendees

## Usage Examples

### 1. Manual Notification Sending

```python
from services.notification.notification_service import NotificationService, NotificationType

# Send a custom notification
notification = NotificationService.send_notification(
    notification_type=NotificationType.ATTENDEE_CONFIRMED,
    recipient_email='user@example.com',
    context={
        'attendee_name': 'John Doe',
        'event_name': 'Tech Conference 2025',
        'event_date': 'July 25, 2025',
        'event_time': '9:00 AM',
        'venue_name': 'Convention Center',
        'venue_address': '123 Main St',
        'organization_name': 'Tech Events Inc'
    },
    event=event_instance
)
```

### 2. Event Reminder Management Commands

```bash
# Send 24-hour reminders (dry run)
python manage.py send_event_reminders --reminder-type=24h --dry-run

# Send 1-hour reminders
python manage.py send_event_reminders --reminder-type=1h

# Create notification templates
python manage.py create_notification_templates
```

### 3. Event-Specific Notifications

```python
from services.notification.notification_service import EventNotificationService

# Send registration confirmation
EventNotificationService.send_attendee_registration_notification(attendee, event)

# Send status update
EventNotificationService.send_attendee_status_update_notification(attendee, event, old_status)

# Send cancellation to all attendees
EventNotificationService.send_event_cancellation_notification(event)
```

## Notification Types

### Organization Notifications
- `ORGANIZATION_INVITATION_SENT`: When someone is invited to join an organization
- `ORGANIZATION_INVITATION_ACCEPTED`: When invitation is accepted (future)
- `ORGANIZATION_INVITATION_REJECTED`: When invitation is rejected (future)

### Event Notifications
- `EVENT_CREATED`: When a new event is created (future)
- `EVENT_UPDATED`: When event details are updated (future)
- `EVENT_CANCELLED`: When an event is cancelled
- `EVENT_PUBLISHED`: When an event is published (future)

### Attendee Notifications
- `ATTENDEE_REGISTERED`: Initial registration confirmation
- `ATTENDEE_CONFIRMED`: When registration is approved
- `ATTENDEE_REJECTED`: When registration is rejected
- `ATTENDEE_WAITLISTED`: When added to waitlist
- `ATTENDEE_PROMOTED`: When promoted from waitlist (future)

### Event Reminders
- `EVENT_REMINDER_24H`: 24-hour advance reminder
- `EVENT_REMINDER_1H`: 1-hour advance reminder

## Template Variables

### Common Variables
- `recipient_name`: Name of the email recipient
- `organization_name`: Name of the organization
- `event_name`: Name of the event
- `event_date`: Formatted event date
- `event_time`: Formatted event time
- `venue_name`: Event venue name
- `venue_address`: Event venue address

### Invitation-Specific Variables
- `role_name`: Role being assigned
- `invitation_url`: Link to accept invitation
- `expires_at`: Invitation expiration date
- `invited_by_name`: Name of person sending invitation
- `message`: Custom invitation message

### Attendee-Specific Variables
- `attendee_name`: Name of the attendee
- `registration_status`: Current registration status
- `registration_url`: Link to registration details
- `old_status`: Previous status (for updates)
- `new_status`: New status (for updates)

## Configuration

### Email Settings
The system uses your existing email configuration in Django settings:
- `EMAIL_HOST`: SMTP server
- `EMAIL_PORT`: SMTP port
- `EMAIL_HOST_USER`: SMTP username
- `EMAIL_HOST_PASSWORD`: SMTP password
- `EMAIL_USE_TLS`: Use TLS encryption
- `EMAIL_FROM`: Default sender email

### Frontend Integration
Set `FRONTEND_BASE_URL` in settings for proper link generation:
```python
FRONTEND_BASE_URL = "https://yourdomain.com"  # Production
FRONTEND_BASE_URL = "http://localhost:3000"   # Development
```

## Monitoring and Debugging

### Admin Interface
- View all notifications in Django admin
- Monitor delivery status and error messages
- Manage notification templates
- Track notification history per user/event

### Database Queries
```python
# Check notification status
from apps.notifications.models import Notification

# Failed notifications
failed = Notification.objects.filter(status='failed')

# Recent notifications for an event
recent = Notification.objects.filter(event_id=123, created_at__gte=timezone.now() - timedelta(days=7))

# User notification history
user_notifications = Notification.objects.filter(recipient_user=user)
```

### Logging
All notification activities are logged with appropriate levels:
- `INFO`: Successful email sends
- `ERROR`: Failed email sends and template rendering errors
- `DEBUG`: Template rendering details (if DEBUG=True)

## Automation Setup

### Cron Jobs for Reminders
Set up cron jobs to automatically send event reminders:

```bash
# Send 24-hour reminders daily at 9 AM
0 9 * * * /path/to/python /path/to/manage.py send_event_reminders --reminder-type=24h

# Send 1-hour reminders every hour
0 * * * * /path/to/python /path/to/manage.py send_event_reminders --reminder-type=1h
```

### Celery Integration (Future)
For high-volume applications, consider integrating with Celery for asynchronous email sending:

```python
# Future implementation
@celery_app.task
def send_notification_async(notification_id):
    notification = Notification.objects.get(id=notification_id)
    # Send notification asynchronously
```

## Security Considerations

1. **Rate Limiting**: Consider implementing rate limiting for email sending
2. **Unsubscribe Links**: Add unsubscribe functionality for marketing emails
3. **Email Validation**: Validate email addresses before sending
4. **Template Sanitization**: Sanitize user input in custom templates
5. **Access Control**: Restrict template modification to authorized users

## Future Enhancements

1. **WebSocket Notifications**: Real-time in-app notifications
2. **SMS Support**: Text message notifications for urgent updates
3. **Push Notifications**: Mobile app push notifications
4. **Email Analytics**: Track open rates, click rates, bounces
5. **A/B Testing**: Test different email templates
6. **Internationalization**: Multi-language email templates
7. **Rich Templates**: HTML email templates with better styling
8. **Attachment Support**: Attach files to notifications (e.g., tickets, invoices)

## Testing

Test the notification system using the provided endpoints:

1. **Test Email**: POST `/api/notifications/test/` (requires authentication)
2. **View Templates**: GET `/api/notifications/templates/`
3. **Check History**: GET `/api/notifications/`

The system integrates seamlessly with your existing user authentication and event management workflows.
