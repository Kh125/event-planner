from django.urls import path
from apps.events.views.event_view import (
    CreateEventAPIView, 
    EventAnalyticsAPIView, 
    EventDetailAPIView, 
    EventListAPIView, 
    RegisterAttendeeAPIView
)
from apps.events.views.speaker_view import (
    CreateSpeakerAPIView,
    SpeakerListAPIView,
    SpeakerDetailAPIView
)
from apps.events.views.session_view import (
    CreateSessionAPIView,
    SessionListAPIView,
    SessionDetailAPIView
)

urlpatterns = [
     # Event endpoints
     path('', EventListAPIView.as_view(), name='event-list'),
     path('create/', CreateEventAPIView.as_view(), name='event-create'),
     path('<int:event_id>/', EventDetailAPIView.as_view(), name='event-detail'),
     path('<int:event_id>/analytics/', EventAnalyticsAPIView.as_view(), name='event-analytics'),
     
     # Attendee endpoints
     path('<int:event_id>/register/', RegisterAttendeeAPIView.as_view(), name='event-register'),
     
     # Speaker endpoints
     path('<int:event_id>/speakers/', CreateSpeakerAPIView.as_view(), name='speaker-create'),
     path('<int:event_id>/speakers/list/', SpeakerListAPIView.as_view(), name='speaker-list'),
     path('<int:event_id>/speakers/<int:speaker_id>/', SpeakerDetailAPIView.as_view(), name='speaker-detail'),
     
     # Session endpoints
     path('<int:event_id>/sessions/', CreateSessionAPIView.as_view(), name='session-create'),
     path('<int:event_id>/sessions/list/', SessionListAPIView.as_view(), name='session-list'),
     path('<int:event_id>/sessions/<int:session_id>/', SessionDetailAPIView.as_view(), name='session-detail'),
]