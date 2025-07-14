from django.urls import path
from apps.notifications.views import (
    NotificationTestAPIView,
    NotificationListAPIView,
    NotificationTemplateListAPIView
)

app_name = 'notifications'

urlpatterns = [
    # Notification management
    path('', NotificationListAPIView.as_view(), name='notification-list'),
    path('test/', NotificationTestAPIView.as_view(), name='notification-test'),
    path('templates/', NotificationTemplateListAPIView.as_view(), name='template-list'),
]
