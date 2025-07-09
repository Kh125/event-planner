from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.organizations.models import Organization


@receiver(post_save, sender=Organization)
def set_creator_organization(sender, instance, created, **kwargs):
     """
     Update organiation field automatically on org creation
     """
     if created and instance.created_by:
          # Set user's organization on creation
          creator = instance.created_by
          
          if creator.organization != instance:
               creator.organization = instance
               creator.save(update_fields=['organization'])
