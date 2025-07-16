from django.core.management.base import BaseCommand
from apps.notifications.models import NotificationTemplate, NotificationType, NotificationChannel


class Command(BaseCommand):
    help = 'Create default notification templates'

    def handle(self, *args, **options):
        templates_created = 0
        
        # Get all default template content from the notification service
        from services.notification.notification_service import NotificationService
        
        # Create templates for all notification types and channels
        for notification_type in NotificationType.choices:
            for channel in NotificationChannel.choices:
                type_value = notification_type[0]
                channel_value = channel[0]
                
                # Skip WebSocket templates for now (they'll be created when needed)
                if channel_value == NotificationChannel.WEBSOCKET:
                    continue
                
                template, created = NotificationTemplate.objects.get_or_create(
                    type=type_value,
                    channel=channel_value,
                    defaults=NotificationService._get_default_template_content(type_value, channel_value)
                )
                
                if created:
                    templates_created += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'Created template: {template.get_type_display()} - {template.get_channel_display()}'
                        )
                    )
                else:
                    self.stdout.write(
                        f'Template already exists: {template.get_type_display()} - {template.get_channel_display()}'
                    )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {templates_created} notification templates')
        )
