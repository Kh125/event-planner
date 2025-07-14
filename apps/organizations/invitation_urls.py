from django.urls import path

from apps.organizations.views.invitation_view import AcceptInvitationAPIView, InvitationManagementAPIView, InvitationVerifyAPIView, OrganizationInvitationAPIView

urlpatterns = [
    #Invitation Management(Owner only)
    path('', OrganizationInvitationAPIView.as_view(), name='organization-invitations'),
    path('<int:invitation_id>/', InvitationManagementAPIView.as_view(), name='invitation-management'),
    
    # Public invitation endpoints
    path('verify/<str:token>/', InvitationVerifyAPIView.as_view(), name='verify-invitation'),
    path('accept/', AcceptInvitationAPIView.as_view(), name='accept-invitation'),
]