from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from core.abstract_models import TimeStampModel
from core.constants import ROLES

class Role(TimeStampModel):
     name = models.CharField(max_length=50, unique=True)
     label = models.CharField(max_length=100, null=True, blank=True)

     def __str__(self):
          return self.name

class CustomQuerySet(models.QuerySet):
    def active(self):
        return self.filter(status=True)

class CustomUserManager(BaseUserManager):
     def create_user_with_role(self, email=None, password=None, full_name=None, role=None):
          if not role:
               raise ValueError("Role is required")

          if role == ROLES.ORG_OWNER:
               return self.create_organization_owner(email, password, full_name=full_name)
          elif role == ROLES.ORG_ADMIN:
               return self.create_organization_admin(email, password, full_name=full_name)
          elif role == ROLES.MEMBER:
               return self.create_member(email, password, full_name=full_name)
          else:
               raise ValueError("Invalid role")
       
     def create_user(self, email, password=None, **extra_fields):
          if not email:
               raise ValueError("Email must be provided")

          email = self.normalize_email(email)
          full_name = extra_fields.pop('full_name', '')
          role = extra_fields.pop('role', ROLES.MEMBER)
          organization = extra_fields.pop('organization', None)          

          user = self.model(
               email=email,
               role=role,
               organization=organization,
               full_name=full_name,
               **extra_fields
          )
          user.set_password(password)
          user.save()
          
          return user

     def create_organization_owner(self, email, password=None, **extra_fields):
          role_obj, created = Role.objects.get_or_create(name=ROLES.ORG_OWNER)
          
          extra_fields.setdefault('role', role_obj)
          extra_fields.setdefault('is_staff', True)
          extra_fields.setdefault('is_superuser', True)

          return self.create_user(email, password, **extra_fields)

     def create_organization_admin(self, email, password=None, **extra_fields):
          role_obj, created = Role.objects.get_or_create(name=ROLES.ORG_ADMIN)
          
          extra_fields.setdefault('role', role_obj)
          extra_fields.setdefault('is_staff', True)
          extra_fields.setdefault('is_superuser', False)

          return self.create_user(email, password, **extra_fields)
     
     def create_member(self, email, password=None, **extra_fields):
          role_obj, created = Role.objects.get_or_create(name=ROLES.MEMBER)
          
          extra_fields.setdefault('role', role_obj)

          return self.create_user(email, password, **extra_fields)

class CustomUser(TimeStampModel, AbstractBaseUser, PermissionsMixin):
     email = models.EmailField(unique=True)
     full_name = models.CharField(max_length=255, blank=True)
     role = models.ForeignKey(Role, on_delete=models.SET_NULL, related_name='users', null= True, blank=True)
     organization = models.ForeignKey(
          'organizations.Organization', on_delete=models.SET_NULL,
          null=True, blank=True,
          related_name='users'
     )
     is_active = models.BooleanField(default=False)
     
     is_staff = models.BooleanField(default=False)
     date_joined = models.DateTimeField(default=timezone.now)

     USERNAME_FIELD = 'email'
     REQUIRED_FIELDS = []

     objects = CustomUserManager()

     def __str__(self):
          return f"{self.email} ({self.role})"

class VerifyRegisteredUser(TimeStampModel):
    objects = CustomQuerySet.as_manager()

    email = models.CharField(max_length=255)
    token = models.CharField(max_length=255, unique=True)
    verification_code = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()

class PasswordReset(TimeStampModel):
    #Custom query set for filtering only active rows
    objects = CustomQuerySet.as_manager()

    email = models.EmailField()
    token = models.CharField(max_length=255, unique=True)
    expired_at = models.DateTimeField()