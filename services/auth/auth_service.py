from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import ValidationError
from django.db import transaction
from apps.users.models import PasswordReset, VerifyRegisteredUser
from core.constants import ROLE_LIST, ROLES
from services.auth.password_service import PasswordService
from services.auth.role_service import RoleService
from services.mail.mail_service import MailService
from utils.token.jwt import TokenUtil

User = get_user_model()

class AuthenticationService:
     @staticmethod
     def is_authenticated(email, password):
          try:
               user = User.objects.get(email=email)
          except User.DoesNotExist:
               raise ValidationError("Invalid email or password")

          if not check_password(password, user.password):
               raise ValidationError("Invalid email or password!")
          
          if not user.is_active:
               raise ValidationError("User is not verified yet!")

          return user
     
     @staticmethod
     def register_user_with_role(full_name, email, password, role):
          # Make sure all default roles are created.
          RoleService.ensure_default_roles()
          
          if role not in ROLE_LIST:
               raise ValidationError("Invalid role type.")
          
          with transaction.atomic():
               user = User.objects.create_user_with_role(email=email, password=password, full_name=full_name, role=role)

               # Create verification code, token, and send mail to verify the user
               MailService.verify_user_registration(user.email)

               return user
     
     @staticmethod
     def verify_registered_user(token, verification_code):
          verify_request = VerifyRegisteredUser.objects.active().filter(token=token).first()

          if not verify_request:
               raise ValidationError("Token is invalid.")
          elif TokenUtil.is_expired(verify_request.expired_at):
               raise ValidationError("Token is expired.")

          if verify_request.verification_code == verification_code:
               user = User.objects.get(email=verify_request.email)
               user.is_active = True
               user.save()
               print("Registered user is verified.")

               # soft delete the verify request
               verify_request.status = False
               verify_request.save()
               
               return user
          else:
               raise ValidationError("Verification code is invalid.")
     
     @staticmethod
     def resend_activation_token(token):
          verify_request = VerifyRegisteredUser.objects.active().filter(token=token).first()
          
          if not verify_request:
               raise ValidationError('Token is invalid.')
          
          if TokenUtil.is_expired(verify_request.expired_at):
               with transaction.atomic():
                    email = TokenUtil.decode_user_token(token)
                    verify_request.expired_at = TokenUtil.generate_expiration_time(60)
                    verify_request.verification_code = TokenUtil.generate_verification_code()
                    verify_request.save()
                    
                    from utils.user.custom_mail_types import send_verification_email
                    send_verification_email(email, token, verify_request.verification_code)
               return 'Verification code is sent back to user.'
          else:
               return 'Token is still valid.'

     @staticmethod
     def create_password_reset_request(email):
          # Check if the email already exists in the database
          if not User.objects.filter(email=email).exists():
               raise ValidationError("User with this email does not exist.")

          reset_request = PasswordReset.objects.active().filter(email=email).first()

          if reset_request and not TokenUtil.is_expired(reset_request.expired_at):
               raise ValidationError("A password reset request has already been sent.")

          with transaction.atomic():
               if reset_request:
                    reset_token = PasswordService.regenerate_password_reset(email, reset_request)
               else:
                    reset_token = PasswordService.create_password_reset(email)

               try:
                    MailService.send_password_reset_email(email, reset_token)
               except Exception as e:
                    raise ValidationError("Failed to send reset email. Please try again later.")
               
               return reset_token
     
     @staticmethod
     def perform_reset_password(password, token):
          # Decode email from token
          email = TokenUtil.decode_user_token(token)
          
          reset_request = PasswordReset.objects.active().filter(email=email, token=token).first()

          if not reset_request:
               raise ValidationError("Password reset request is invalid or already used.")

          if TokenUtil.is_expired(reset_request.expired_at):
               raise ValidationError("Password reset request has expired.")

          try:
               user = User.objects.get(email=email)
          except User.DoesNotExist:
               raise ValueError("User with the provided email does not exist.")
          
          with transaction.atomic():
               user.set_password(password)
               user.save()

               # soft delete the password reset request
               reset_request.status = False
               reset_request.save()

               try:
                    MailService.send_password_reset_success_email(email)
               except Exception:
                    raise ValidationError("Error sending password reset success mail.")
               
               print("Password reset successful.")
               
               # It use in nowhere just to avoid the code continuing
               return token

     
     @staticmethod
     def generate_auth_tokens(user):
          access_token = TokenUtil.generate_access_token(user.pk, user.role.name, 300)
          refresh_token = TokenUtil.generate_refresh_token(user.pk, user.role.name)
          
          return {
               'access_token': access_token,
               'refresh_token': refresh_token
          }

     @staticmethod
     def extract_registration_data(data):
          full_name = data.get('full_name', None)
          email = data.get('email', None)
          password = data.get('password', None)
          
          return full_name, email, password