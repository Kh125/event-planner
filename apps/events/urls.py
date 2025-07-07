from django.urls import path
from apps.events.views.event_view import EventAnalyticsAPIView, EventDetailAPIView, EventListAPIView, RegisterAttendeeAPIView

urlpatterns = [
     path('', EventListAPIView.as_view(), name='event-list'),
     path('<int:event_id>/register/', RegisterAttendeeAPIView.as_view(), name='event-register'),
     path('<int:event_id>/analytics/', EventAnalyticsAPIView.as_view(), name='event-analytics'),
     path('<int:event_id>/', EventDetailAPIView.as_view(), name='event-detail'),
]