from rest_framework import serializers
from apps.organizations.models import Organization

class OrganizationCreateSerializer(serializers.ModelSerializer):
     class Meta:
          model = Organization
          fields = [
               'id', 'name', 'slug', 'organization_type', 'description', 'website', 'logo',
               'contact_email', 'phone', 'address', 'city', 'country', 'created_at', 'updated_at'
          ]
          extra_kwargs = {
               'slug': {'required': False},
               'id': {'read_only': True},
               'created_at': {'read_only': True},
               'updated_at': {'read_only': True}
          }