from apps.organizations.serializers.organization_serializer import OrganizationCreateSerializer
from services.organization.organization_service import OrganizationService


class OrganizationResponseService:
     """
     Service class for handling organization response formatting
     """
     
     @staticmethod
     def create_organization_response(user, validated_data):
          """
          Create organization and return serialized response data
          
          Args:
               user: The user creating the organization
               validated_data: Validated organization data
               
          Returns:
               dict: Serialized organization data
          """
          organization = OrganizationService.create_organization(user, **validated_data)
          serializer = OrganizationCreateSerializer(organization)
          return serializer.data
     
     @staticmethod
     def get_user_organization_response(user):
          """
          Get user organization and return serialized response data
          
          Args:
               user: The user whose organization to retrieve
               
          Returns:
               dict: Serialized organization data
          """
          organization = OrganizationService.get_user_organization(user)
          
          serializer = OrganizationCreateSerializer(organization)
          
          return serializer.data
