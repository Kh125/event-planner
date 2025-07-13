from datetime import timedelta
import uuid
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from apps.users.models import CustomUser
from core.abstract_models import TimeStampModel

class OrganizationType(models.TextChoices):
     COMPANY = 'company', 'Company'
     UNIVERSITY = 'university', 'University'
     NON_PROFIT = 'non_profit', 'Non-Profit'
     GOVERNMENT = 'government', 'Government'
     OTHER = 'other', 'Other'

class Organization(TimeStampModel):     
     name = models.CharField(max_length=100, unique=True)
     organization_type = models.CharField(max_length=50, choices=OrganizationType.choices, default=OrganizationType.OTHER)
     slug = models.SlugField(unique=True, blank=True)
     description = models.TextField(blank=True, null=True)
     logo = models.URLField(max_length=500, null=True, blank=True)
     contact_email = models.EmailField(blank=True, null=True)
     phone = models.CharField(max_length=20, blank=True, null=True)

     address = models.CharField(max_length=255, blank=True, null=True)
     city = models.CharField(max_length=100, blank=True, null=True)
     country = models.CharField(max_length=100, blank=True, null=True)
     
     # Social Links
     website = models.URLField(blank=True, null=True)
     facebook = models.URLField(blank=True, null=True)
     twitter = models.URLField(blank=True, null=True)
     linkedin = models.URLField(blank=True, null=True)
     instagram = models.URLField(blank=True, null=True)

     created_by = models.OneToOneField(
          'users.CustomUser',
          on_delete=models.SET_NULL,
          null=True,
          blank=True,
          related_name='created_organization'
     )

     def save(self, *args, **kwargs):
          if not self.slug:
               self.slug = slugify(self.name)
          super().save(*args, **kwargs)

     def __str__(self):
        return self.name

class OrganizationInvitation(TimeStampModel):
     organization = models.ForeignKey(
          Organization, 
          related_name="invitations",
          on_delete=models.CASCADE, 
          null=False, 
          blank=False
     )
     email = models.CharField(max_length=250, null=False, blank=False)
     invited_by = models.ForeignKey(
          CustomUser, 
          related_name="sent_invitations",
          on_delete=models.CASCADE, 
          null=False, 
          blank=False
     )
     token = models.UUIDField(default=uuid.uuid4, unique=True)
     expired_at = models.DateTimeField()
     is_invitation_accepted = models.BooleanField(default=False)
     accepted_at=models.DateTimeField(null=True, blank=True)
     accepted_by=models.ForeignKey(
          CustomUser, 
          related_name="accepted_invitations",
          on_delete=models.SET_NULL,
          null=True,
          blank=True
     )
     
     class Meta:
          unique_together = ['organization', 'email']
     
     def save(self, *args, **kwargs):
          if not self.expired_at:
               self.expired_at = timezone.now() + timedelta(days=7)
          
          super().save(*args, **kwargs)
     
     def is_expired(self):
          return timezone.now() > self.expired_at
     
     def is_valid(self):
          return not self.accepted_at and not self.is_expired()
     
     def __str__(self):
        return f"Invitation for {self.email} to {self.organization.name}"