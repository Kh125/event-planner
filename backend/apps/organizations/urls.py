from django.urls import path
from apps.organizations.views.organization_view import CreateOrganizationView, OrganizationInfoAPIView

urlpatterns = [
    path('create/', CreateOrganizationView.as_view(), name='organization-create'),
    path('details/', OrganizationInfoAPIView.as_view(), name='organization-details'),
]
