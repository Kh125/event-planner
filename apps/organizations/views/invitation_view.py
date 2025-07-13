from rest_framework.exceptions import NotFound
from drf_spectacular.utils import extend_schema
from apps.organizations.models import Organization
from apps.organizations.serializers.invitation_serializer import (
    SendInvitationSerializer, InvitationSerializer, 
    AcceptInvitationSerializer
)
from apps.organizations.services.invitation_service import InvitationService
from core.middleware.permission import IsOrganizationOwner
from utils.view.custom_api_views import CustomAPIView

@extend_schema(tags=["Organization Invitations"])
class OrganizationInvitationAPIView(CustomAPIView):
     permission_classes = [IsOrganizationOwner]
     
     def get_organization(self, org_id):
          try:
               return Organization.objects.get(id=org_id)
          except Organization.DoesNotExist:
               raise NotFound("Organization not found")
     
     @extend_schema(
          summary="Send invitation to join organization",
          request=SendInvitationSerializer,
          responses={201: InvitationSerializer}
     )
     def post(self, request, org_id):
          """Send invitation to user to join organization"""
          organization = self.get_organization(org_id)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          serializer = SendInvitationSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          data = InvitationService.send_invitation(
               organization, request.user, serializer.validated_data
          )
          
          return self.success_response(
               "Invitation sent successfully",
               data,
               status_code=201
          )
     
     @extend_schema(
          summary="List organization invitations",
          responses={200: InvitationSerializer(many=True)}
     )
     def get(self, request, org_id):
          """Get all invitations for organization"""
          organization = self.get_organization(org_id)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          data = InvitationService.get_organization_invitations(organization, request.user)
          
          return self.success_response(
               "Invitations retrieved successfully",
               data
          )

@extend_schema(tags=["Organization Invitations"])
class InvitationManagementAPIView(CustomAPIView):
     permission_classes = [IsOrganizationOwner]
     
     def get_organization(self, org_id):
          try:
               return Organization.objects.get(id=org_id)
          except Organization.DoesNotExist:
               raise NotFound("Organization not found")
     
     @extend_schema(
          summary="Cancel invitation",
          responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
     )
     def delete(self, request, org_id, invitation_id):
          """Cancel a pending invitation"""
          organization = self.get_organization(org_id)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          InvitationService.cancel_invitation(organization, request.user, invitation_id)
          
          return self.success_response("Invitation cancelled successfully")
     
     @extend_schema(
          summary="Resend invitation",
          responses={200: InvitationSerializer}
     )
     def post(self, request, org_id, invitation_id):
          """Resend invitation email"""
          organization = self.get_organization(org_id)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          data = InvitationService.resend_invitation(organization, request.user, invitation_id)
          
          return self.success_response("Invitation resent successfully", data)

@extend_schema(tags=["Public Invitations"])
class AcceptInvitationAPIView(CustomAPIView):
     permission_classes = []  # Public endpoint
     
     @extend_schema(
          summary="Accept invitation and create account",
          request=AcceptInvitationSerializer,
          responses={201: {
               "type": "object",
               "properties": {
                    "id": {"type": "integer"},
                    "email": {"type": "string"},
                    "full_name": {"type": "string"},
                    "role": {"type": "string"},
                    "organization": {"type": "string"}
               }
          }}
     )
     def post(self, request):
          """Accept invitation and create user account"""
          serializer = AcceptInvitationSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          data = InvitationService.accept_invitation(serializer.validated_data)
          
          return self.success_response(
               "Account created successfully! Welcome to the organization.",
               data,
               status_code=201
          )