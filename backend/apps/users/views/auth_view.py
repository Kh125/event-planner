
from drf_spectacular.utils import extend_schema
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from apps.users.serializers.auth_serializer import ForgetPasswordSerializer, RegisterSerializer, ResetPasswordSerializer, VerifyRegistrationSerializer
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import AllUserPermission
from core.constants import ROLES
from services.auth.auth_service import AuthenticationService
from utils.response import CustomResponse
from utils.view.custom_api_views import CustomAPIView

User = get_user_model()

@extend_schema(tags=["Organization Owner"])
class OwnerRegisterView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          serializer = RegisterSerializer(data=request.data)
          
          if serializer.is_valid():
               full_name, email, password = AuthenticationService.extract_registration_data(request.data)
               
               user = AuthenticationService.register_user_with_role(full_name=full_name, email=email, password=password, role=ROLES.ORG_OWNER)
          
               return Response(
                    CustomResponse.success(
                         "Organization owner registration successful.",
                         {
                              "email": user.email,
                              "role": user.role.name
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Authentication"])
class AdminRegisterAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          serializer = RegisterSerializer(data=request.data)
          
          if serializer.is_valid():
               full_name, email, password = AuthenticationService.extract_registration_data(request.data)
               
               user = AuthenticationService.register_user_with_role(full_name=full_name, email=email, password=password, role=ROLES.ORG_ADMIN)
          
               return Response(
                    CustomResponse.success(
                         "Organization admin registration successful",
                         {
                              "email": user.email,
                              "role": user.role.name
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Authentication"])
class MemberRegisterAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          serializer = RegisterSerializer(data=request.data)
          
          if serializer.is_valid():
               full_name, email, password = AuthenticationService.extract_registration_data(request.data)
               
               user = AuthenticationService.register_user_with_role(full_name=full_name, email=email, password=password, role=ROLES.MEMBER)
          
               return Response(
                    CustomResponse.success(
                         "Member registration successful.",
                         {
                              "email": user.email,
                              "role": user.role.name
                         }
                    ),
                    status=status.HTTP_201_CREATED
               )
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       
@extend_schema(tags=["Authentication"])
class LoginAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          data = request.data
          email = data.get('email', None)
          password = data.get('password', None)
          
          if not email and not password:
               raise ValidationError("Invalid email or password!")
          
          user = AuthenticationService.is_authenticated(email, password)
          
          result = AuthenticationService.generate_auth_tokens(user)

          response = Response(status=status.HTTP_200_OK)
          
          response.set_cookie(key='refresh_token', value=result['refresh_token'], httponly=True)
          
          response.data = CustomResponse.success("User is authenticated.", {
               'token': result['access_token']
          })
          
          return response

@extend_schema(tags=["Authentication"])
class VerifyRegisteredUserAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def get_extracted_data(self, request):
          data = request.data
          token = data.get('token', None)
          verification_code = data.get('verification_code', None)

          return token, verification_code
     
     def post(self, request):
          serializer = VerifyRegistrationSerializer(data=request.data)
          
          if serializer.is_valid():
               token, verification_code = self.get_extracted_data(request)
              
               # Verify register user
               AuthenticationService.verify_registered_user(token, verification_code)
               
               return Response(
                    CustomResponse.success("User verification successful."),
                    status=status.HTTP_200_OK
               )
               
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Authentication"])
class ResendActivationAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          """ Resend verification code to user when expired
          """
          token = request.data.get('token', None)
          
          if not token:
               return Response(CustomResponse.error('No token is found.'), status=status.HTTP_400_BAD_REQUEST)
          
          message = AuthenticationService.resend_activation_token(token)
          
          return Response(CustomResponse.success(message), status=status.HTTP_200_OK)

@extend_schema(tags=["Authentication"])
class ForgetPasswordAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def post(self, request):
          serializer = ForgetPasswordSerializer(data=request.data)
          
          if serializer.is_valid():
               email = request.data.get('email', None)
               
               AuthenticationService.create_password_reset_request(email)
               
               return Response(
                    CustomResponse.success('Password reset link has been sent to your email.'), 
                    status=status.HTTP_200_OK
               )
               
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Authentication"])
class ResetPasswordAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     
     def get_extracted_data(self, request):
          data = request.data
          password = data.get('password')
          token = data.pop('token', None)

          return password, token

     def post(self, request):
          serializer = ResetPasswordSerializer(data=request.data)
          
          if serializer.is_valid():
               password, token = self.get_extracted_data(request)
               
               AuthenticationService.perform_reset_password(password, token)
               
               return Response(
                    CustomResponse.success('Password has been reset successfully.'), 
                    status=status.HTTP_200_OK
               )
               
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=["Authentication"])
class UserInfoAPIView(CustomAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [AllUserPermission]

     def get(self, request):
          response = AuthenticationService.get_user_profile_info(request.user)
          
          return self.success_response(
               message="Username Information retrieved.",
               data=response,
               status_code=status.HTTP_200_OK
          )
