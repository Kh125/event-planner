from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.users.models import PasswordReset, VerifyRegisteredUser
from services.auth.auth_service import AuthenticationService

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
     password = serializers.CharField(write_only=True, min_length=6)

     class Meta:
          model = User
          fields = ['full_name', 'email', 'password']

class LoginSerializer(serializers.ModelSerializer):
     class Meta:
          model = User
          fields = ('email', 'password')
          extra_kwargs = {
               'email': { 'validators': [] },
               'password': { 'write_only': True }
          }

class VerifyRegistrationSerializer(serializers.ModelSerializer):
     token = serializers.CharField(
          write_only=True, 
          error_messages={
               'blank': "Token is required.",
               'invalid': "Please provide a valid token.",
          }
     )
     verification_code = serializers.CharField(
          write_only=True,
          error_messages={
               'blank': "Verification Code is required.",
               'invalid': "Please provide a valid verification code",
          }
     )

     class Meta:
          model = VerifyRegisteredUser
          fields = ('token', 'verification_code', 'expired_at')
          extra_kwargs = {
               'expired_at': { 'read_only': True }
          }

class ForgetPasswordSerializer(serializers.ModelSerializer):
     email = serializers.EmailField(
          error_messages={
               'blank': "Email field cannot be empty.",
               'invalid': "Please provide a valid email address.",
          }
     )

     class Meta:
          model = PasswordReset
          fields = ['email']

class ResetPasswordSerializer(serializers.ModelSerializer):
     password = serializers.CharField(write_only=True)
     
     token = serializers.CharField(
          write_only=True,
          required=False,
          error_messages={
               'blank': "Token is required to reset password.",
               'invalid': "Token is invalid.",
          }
     )

     class Meta:
          model = User
          fields = ('password', 'token')