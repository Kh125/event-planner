from django.urls import path
from apps.events.views.event_view import (
    CreateEventAPIView, 
    EventAnalyticsAPIView, 
    EventDetailAPIView, 
    EventListAPIView,
    EventUpdateStatusAPIView,
    EventManageAPIView
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
from apps.events.views.attendee_view import (
    AttendeeRegistrationAPIView,
    AttendeeListAPIView,
    AttendeeManagementAPIView,
    AttendeeStatsAPIView,
    AttendeeRegistrationLookupAPIView,
    AttendeeCancelRegistrationAPIView
)
from apps.events.views.public_event_view import (
    PublicEventListAPIView,
    PublicEventDetailAPIView,
    PublicEventScheduleAPIView,
    EventSearchAPIView
)

urlpatterns = [
    # Event management endpoints (authenticated)
    path('', EventListAPIView.as_view(), name='event-list'),
    path('create/', CreateEventAPIView.as_view(), name='event-create'),
    path('<int:event_id>/details/', EventDetailAPIView.as_view(), name='event-detail'),
    path('<int:event_id>/update-status/', EventUpdateStatusAPIView.as_view(), name='event-status'),
    path('<int:event_id>/analytics/', EventAnalyticsAPIView.as_view(), name='event-analytics'),
    path('<int:event_id>/', EventManageAPIView.as_view(), name='event-update'),

    # Public event discovery endpoints (no auth)
    path('public/', PublicEventListAPIView.as_view(), name='public-event-list'),
    path('public/<int:event_id>/', PublicEventDetailAPIView.as_view(), name='public-event-detail'),
    path('public/<int:event_id>/schedule/', PublicEventScheduleAPIView.as_view(), name='public-event-schedule'),
    path('search/', EventSearchAPIView.as_view(), name='event-search'),

    # Attendee endpoints
    path('<int:event_id>/register/', AttendeeRegistrationAPIView.as_view(), name='attendee-register'),
    path('<int:event_id>/attendees/', AttendeeListAPIView.as_view(), name='attendee-list'),
    path('<int:event_id>/attendees/<int:attendee_id>/', AttendeeManagementAPIView.as_view(), name='attendee-management'),
    path('<int:event_id>/attendees/stats/', AttendeeStatsAPIView.as_view(), name='attendee-stats'),
    path('<int:event_id>/registration-lookup/', AttendeeRegistrationLookupAPIView.as_view(), name='registration-lookup'),
    path('<int:event_id>/cancel-registration/', AttendeeCancelRegistrationAPIView.as_view(), name='cancel-registration'),

    # Speaker endpoints
    path('<int:event_id>/speakers/', CreateSpeakerAPIView.as_view(), name='speaker-create'),
    path('<int:event_id>/speakers/list/', SpeakerListAPIView.as_view(), name='speaker-list'),
    path('<int:event_id>/speakers/<int:speaker_id>/', SpeakerDetailAPIView.as_view(), name='speaker-detail'),

    # Session endpoints
    path('<int:event_id>/sessions/', CreateSessionAPIView.as_view(), name='session-create'),
    path('<int:event_id>/sessions/list/', SessionListAPIView.as_view(), name='session-list'),
    path('<int:event_id>/sessions/<int:session_id>/', SessionDetailAPIView.as_view(), name='session-detail'),
]