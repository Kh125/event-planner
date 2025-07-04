from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

class Role(models.TextChoices):
     ORG_OWNER = 'org_owner', 'Organization Owner'
     ORG_ADMIN = 'org_admin', 'Organization Admin'
     MEMBER = 'member', 'Member'

class CustomUserManager(BaseUserManager):
     def create_user(self, email, password=None, **extra_fields):
          if not email:
               raise ValueError("Email must be provided")

          email = self.normalize_email(email)
          full_name = extra_fields.pop('full_name', '')
          role = extra_fields.pop('role', Role.MEMBER)
          organization = extra_fields.get('organization', None)

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

     def create_superuser(self, email, password=None, **extra_fields):
          extra_fields.setdefault('role', Role.ORG_OWNER)
          extra_fields.setdefault('is_staff', True)
          extra_fields.setdefault('is_superuser', True)

          return self.create_user(email, password, **extra_fields)


class Organization(models.Model):
     name = models.CharField(max_length=100, unique=True)
     slug = models.SlugField(unique=True, blank=True)
     
     description = models.TextField(blank=True, null=True)
     website = models.URLField(blank=True, null=True)
     logo = models.URLField(max_length=500, null=True, blank=True)
     contact_email = models.EmailField(blank=True, null=True)
     phone = models.CharField(max_length=20, blank=True, null=True)

     address = models.CharField(max_length=255, blank=True, null=True)
     city = models.CharField(max_length=100, blank=True, null=True)
     country = models.CharField(max_length=100, blank=True, null=True)

     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     created_by = models.ForeignKey(
          'CustomUser',
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='created_organizations'
     )

     def save(self, *args, **kwargs):
          if not self.slug:
               self.slug = slugify(self.name)
          super().save(*args, **kwargs)

     def __str__(self):
        return self.name


class CustomUser(AbstractBaseUser, PermissionsMixin):
     email = models.EmailField(unique=True)
     full_name = models.CharField(max_length=255, blank=True)

     role = models.CharField(
          max_length=20,
          choices=Role.choices,
          default=Role.MEMBER
     )

     organization = models.ForeignKey(
          Organization, on_delete=models.SET_NULL,
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
