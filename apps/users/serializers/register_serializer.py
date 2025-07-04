from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Role

User = get_user_model()

class RegisterOrganizationOwnerSerializer(serializers.ModelSerializer):
     password = serializers.CharField(write_only=True, min_length=6)

     class Meta:
          model = User
          fields = ['email', 'full_name', 'password']

     def create(self, validated_data):
          role = Role.ORG_OWNER
          
          user = User.objects.create_superuser(
               email=validated_data['email'],
               full_name=validated_data.get('full_name', ''),
               password=validated_data['password'],
               role=role
          )
          
          return user
