from rest_framework import permissions
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import OwnerPermission
from services.organization.organization_response_service import OrganizationResponseService
from utils.view.custom_api_views import CustomAPIView
from ..serializers.organization_serializer import OrganizationCreateSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Organization"])
class CreateOrganizationView(CustomAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [OwnerPermission]

     def post(self, request):
          serializer = OrganizationCreateSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          # Create organization and get serialized data
          data = OrganizationResponseService.create_organization_response(
               user=request.user,
               validated_data=serializer.validated_data
          )
          
          return self.success_response(
               message="Organization created successfully",
               data=data
          )
     
class OrganizationInfoAPIView(CustomAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [OwnerPermission]
     success_message = "Organization information fetched successfully"

     def get(self, request):
          # Use response service to get organization and serialized data
          data = OrganizationResponseService.get_user_organization_response(request.user)
          return self.success_response(data=data)