from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.organizations.models import Organization
from apps.users.models import CustomUser


class OrganizationService:
    """
    Service class for handling organization-related business logic
    """
    
    @staticmethod
    def create_organization(user: CustomUser, **validated_data) -> Organization:
        """
        Create a new organization for a user
        
        Args:
            user: The user creating the organization
            **validated_data: Validated organization data
            
        Returns:
            Organization: The created organization instance
            
        Raises:
            ValidationError: If user already has an organization
        """
        # Check if user already has an organization
        if Organization.objects.filter(created_by=user).exists():
            raise ValidationError("You already have an organization.")
        
        with transaction.atomic():
            # Create the organization
            organization = Organization.objects.create(
                created_by=user,
                **validated_data
            )
            
            # Set the user's organization (if needed)
            if not user.organization:
                user.organization = organization
                user.save(update_fields=['organization'])
            
            return organization
    
    @staticmethod
    def get_user_organization(user: CustomUser) -> Organization:
        """
        Get the organization created by the user
        
        Args:
            user: The user whose organization to retrieve
            
        Returns:
            Organization: The user's organization
            
        Raises:
            ValidationError: If user has no organization
        """
        try:
            return user.created_organization
        except Organization.DoesNotExist:
            raise ValidationError("User is not associated with any organization")
    
    @staticmethod
    def can_user_create_organization(user: CustomUser) -> bool:
        """
        Check if user can create an organization
        
        Args:
            user: The user to check
            
        Returns:
            bool: True if user can create organization, False otherwise
        """
        return not Organization.objects.filter(created_by=user).exists()
