from django.urls import path
from apps.events.views.attendee_invitation_view import (
    PublicInvitationVerifyAPIView,
    AcceptAttendeeInvitationAPIView,
    RejectAttendeeInvitationAPIView
)

app_name = 'attendee_invitations'

urlpatterns = [
    # Public invitation endpoints (no authentication required)
    path('verify/<uuid:token>/', PublicInvitationVerifyAPIView.as_view(), name='verify'),
    path('accept/', AcceptAttendeeInvitationAPIView.as_view(), name='accept'),
    path('reject/', RejectAttendeeInvitationAPIView.as_view(), name='reject'),
]
