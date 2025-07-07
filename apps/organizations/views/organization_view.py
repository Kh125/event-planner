from rest_framework import generics, permissions
from apps.organizations.models import Organization
from ..serializers.organization_serializer import OrganizationCreateSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Organization"])
class CreateOrganizationView(generics.CreateAPIView):
     queryset = Organization.objects.all()
     serializer_class = OrganizationCreateSerializer
     permission_classes = [permissions.IsAuthenticated]
