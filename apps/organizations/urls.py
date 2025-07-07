from django.urls import path
from apps.organizations.views.organization_view import CreateOrganizationView

urlpatterns = [
    path('create/', CreateOrganizationView.as_view(), name='organization-create'),
]
