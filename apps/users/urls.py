from django.urls import path
from apps.users.views.auth_view import AdminRegisterAPIView, ForgetPasswordAPIView, LoginAPIView, MemberRegisterAPIView, OwnerRegisterView, ResendActivationAPIView, ResetPasswordAPIView, VerifyRegisteredUserAPIView
from apps.users.views.organization_view import CreateOrganizationView

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login-all-users'),
    path('register/owner', OwnerRegisterView.as_view(), name='register-org-owner'),
    path('register/admin', AdminRegisterAPIView.as_view(), name='register-org-admin'),
    path('register/member', MemberRegisterAPIView.as_view(), name='register-org-member'),
    path('verify-user-registration/', VerifyRegisteredUserAPIView.as_view(), name='verify-user-registeration'),
    path('resend-activation/', ResendActivationAPIView.as_view(), name='resend-activation'),
    path('forget-password/', ForgetPasswordAPIView.as_view(), name='forget-password'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='reset-password'),
    path('organization/create/', CreateOrganizationView.as_view(), name='organization-create'),
]