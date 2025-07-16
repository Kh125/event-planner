from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from apps.notifications.models import Notification, NotificationTemplate
from services.notification.notification_service import NotificationService, NotificationType
from utils.view.custom_api_views import CustomAPIView
from core.middleware.authentication import TokenAuthentication


@extend_schema(tags=["Notifications"])
class NotificationTestAPIView(CustomAPIView):
     """Test endpoint for notification system"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsAuthenticated]

     @extend_schema(
          summary="Test email notification",
          responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
     )
     def post(self, request):
          """Send a test email notification"""
          try:
               # Test context data
               context = {
                    'recipient_name': 'Test User',
                    'organization_name': 'Test Organization',
                    'role_name': 'Member',
                    'message': 'This is a test invitation.',
                    'invitation_url': 'https://example.com/accept',
                    'expires_at': 'July 21, 2025 at 02:00 PM',
                    'invited_by_name': 'Admin User'
               }
               
               # Send test notification
               notification = NotificationService.send_notification(
                    notification_type=NotificationType.ORGANIZATION_INVITATION_SENT,
                    recipient_email=request.user.email,
                    context=context,
                    recipient_user=request.user
               )
               
               return self.success_response(
                    message="Test email sent successfully",
                    data={
                         'notification_id': notification.id,
                         'status': notification.status,
                         'recipient_email': notification.recipient_email,
                         'subject': notification.subject
                    }
               )
               
          except Exception as e:
               return self.error_response(
                    message=f"Failed to send test email: {str(e)}",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
               )

@extend_schema(tags=["Notifications"])
class NotificationListAPIView(CustomAPIView):
     """List user notifications"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsAuthenticated]

     @extend_schema(
          summary="Get user notifications",
          responses={200: {"type": "array", "items": {"type": "object"}}}
     )
     def get(self, request):
          """Get notifications for the current user"""
          notifications = Notification.objects.filter(
               recipient_user=request.user
          ).order_by('-created_at')[:20]  # Last 20 notifications
          
          data = []
          for notification in notifications:
               data.append({
                    'id': notification.id,
                    'type': notification.get_type_display(),
                    'subject': notification.subject,
                    'message': notification.message[:100] + '...' if len(notification.message) > 100 else notification.message,
                    'status': notification.get_status_display(),
                    'sent_at': notification.sent_at,
                    'created_at': notification.created_at,
                    'event_name': notification.event.name if notification.event else None,
                    'organization_name': notification.organization.name if notification.organization else None
               })
          
          return self.success_response(
               message="Notifications retrieved successfully",
               data=data
          )


@extend_schema(tags=["Notifications"])
class NotificationTemplateListAPIView(CustomAPIView):
     """List notification templates (admin only)"""
     authentication_classes = [TokenAuthentication]

     @extend_schema(
          summary="Get notification templates",
          responses={200: {"type": "array", "items": {"type": "object"}}}
     )
     def get(self, request):
          """Get all notification templates"""
          templates = NotificationTemplate.objects.filter(is_active=True)
          
          data = []
          for template in templates:
               data.append({
                    'id': template.id,
                    'type': template.get_type_display(),
                    'channel': template.get_channel_display(),
                    'subject_template': template.subject_template,
                    'is_active': template.is_active,
                    'created_at': template.created_at
               })
          
          return self.success_response(
               message="Templates retrieved successfully",
               data=data
          )
