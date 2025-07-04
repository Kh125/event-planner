from django.urls import path
from apps.users.views.organization_view import CreateOrganizationView
from apps.users.views.organization_owner_auth_view import RegisterOrganizationOwnerView

urlpatterns = [
    path('org-owner/register/', RegisterOrganizationOwnerView.as_view(), name='register-org-owner'),
    path('organization/create/', CreateOrganizationView.as_view(), name='organization-create'),
]