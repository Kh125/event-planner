from rest_framework import serializers
from ..models import Organization

class OrganizationCreateSerializer(serializers.ModelSerializer):
     class Meta:
          model = Organization
          fields = [
               'name', 'slug', 'description', 'website', 'logo',
               'contact_email', 'phone', 'address', 'city', 'country'
          ]
          extra_kwargs = {
               'slug': {'required': False}
          }

     def create(self, validated_data):
          request = self.context['request']
          
          if Organization.objects.filter(created_by=request.user).exists():
               raise serializers.ValidationError("You already have an organization.")
          
          return Organization.objects.create(created_by=request.user, **validated_data)
