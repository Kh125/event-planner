from rest_framework import serializers
from apps.organizations.models import OrganizationInvitation

class SendInvitationSerializer(serializers.ModelSerializer):
     email = serializers.EmailField()
     message = serializers.CharField(max_length=255, required=False, allow_blank=True)

     class Meta:
          model = OrganizationInvitation
          fields = ['email', 'message']

     def validate(self, attrs):
          return attrs

class InvitationSerializer(serializers.ModelSerializer):
     invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
     accepted_by_name = serializers.CharField(source='accepted_by.full_name', read_only=True, allow_null=True)
     
     class Meta:
          model = OrganizationInvitation
          fields = [
               'id', 'email', 'invited_by_name', 'token',
               'is_invitation_accepted',
               'expired_at', 'accepted_at', 'accepted_by_name'
          ]

class InvitationVerifySerializer(serializers.Serializer):
     token = serializers.UUIDField()

class AcceptInvitationSerializer(serializers.Serializer):
     token = serializers.UUIDField()
     full_name = serializers.CharField(max_length=255)
     password = serializers.CharField(max_length=255)
     confirm_password = serializers.CharField(max_length=255)
     
     def validate(self, attrs):
          if attrs['password'] != attrs['confirm_password']:
               raise serializers.ValidationError("Password not matched.")

          return attrs