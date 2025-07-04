from rest_framework import generics, permissions
from ..models import Organization
from ..serializers.organization_serializer import OrganizationCreateSerializer

class CreateOrganizationView(generics.CreateAPIView):
     queryset = Organization.objects.all()
     serializer_class = OrganizationCreateSerializer
     permission_classes = [permissions.IsAuthenticated]
