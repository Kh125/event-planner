from django.urls import path
from apps.organizations.views.invitation_view import AcceptInvitationAPIView, InvitationManagementAPIView, InvitationVerifyAPIView, OrganizationInvitationAPIView
from apps.organizations.views.organization_view import CreateOrganizationView, OrganizationInfoAPIView

urlpatterns = [
    path('create/', CreateOrganizationView.as_view(), name='organization-create'),
    path('details/', OrganizationInfoAPIView.as_view(), name='organization-details'),
    
    #Invitation Management(Owner only)
    path('<int:org_id>/invitations/', OrganizationInvitationAPIView.as_view(), name='organization-invitations'),
    path('<int:org_id>/invitations/<int:invitation_id>/', InvitationManagementAPIView.as_view(), name='invitation-management'),
    
    # Public invitation endpoints
    path('invitations/verify/<str:token>/', InvitationVerifyAPIView.as_view(), name='verify-invitation'),
    path('invitations/accept/', AcceptInvitationAPIView.as_view(), name='accept-invitation'),
]
