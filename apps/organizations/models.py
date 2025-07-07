from django.db import models
from django.utils.text import slugify
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

     created_by = models.ForeignKey(
          'users.CustomUser',
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