from django.conf import settings
from django.core.mail import send_mail as django_send_mail
from utils.token.jwt import TokenUtil
from apps.users.models import VerifyRegisteredUser
from core.middleware.exception_handler import CustomAPIException

class MailService:
     @staticmethod
     def verify_user_registration(email):
          """ Generate User verification code and verification token to validate the correct user.
               Expired time limit can be set and default is 60 seconds.
          """
          verification_code = TokenUtil.generate_verification_code()
          token = TokenUtil.generate_encoded_token(value=email)
          expired_at = TokenUtil.generate_expiration_time(300) # 5 Minutes
          
          VerifyRegisteredUser.objects.create(email=email, token=token, verification_code=verification_code, expired_at=expired_at)
          
          # Send Mail to user
          from utils.user.custom_mail_types import send_verification_email
          send_verification_email(email, token, verification_code)
          
          return token

     @staticmethod
     def send_password_reset_email(email, token):
          reset_url = f"{settings.FRONTEND_BASE_URL}/auth/reset-password?token={token}"

          from utils.user.custom_mail_types import send_password_reset_email
          send_password_reset_email(email, reset_url)

     @staticmethod
     def send_password_reset_success_email(email):
          from utils.user.custom_mail_types import send_password_reset_success_email
          send_password_reset_success_email(email)
     
     @staticmethod
     def _send_mail(subject, message, recipient_list):
          """ Sending email with no template design using django 
          email backend.
          Args:
          subject 
          message
          recipient_list
          """
          try:
               django_send_mail(
                    subject,
                    message,
                    from_email=settings.EMAIL_FROM,
                    recipient_list=recipient_list
               )
          except Exception as e:
               print(f"Error sending mail {str(e)}")
               raise CustomAPIException(detail="Error Sending Email")