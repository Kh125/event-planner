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
     
     def get_organization(self, request):
          try:
               return request.user.organization
          except Organization.DoesNotExist:
               raise NotFound("Organization not found")
     
     @extend_schema(
          summary="Send invitation to join organization",
          request=SendInvitationSerializer,
          responses={201: InvitationSerializer}
     )
     def post(self, request):
          """Send invitation to user to join organization"""
          organization = self.get_organization(request)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          serializer = SendInvitationSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          data = InvitationService.send_invitation(
               organization, request.user, serializer.validated_data
          )
          
          return self.success_response(
               message="Invitation sent successfully",
               data=data,
               status_code=201
          )
     
     @extend_schema(
          summary="List organization invitations",
          responses={200: InvitationSerializer(many=True)}
     )
     def get(self, request):
          """Get all invitations for organization"""
          organization = self.get_organization(request)
          
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
     
     def get_organization(self, request):
          try:
               return request.user.organization
          except Organization.DoesNotExist:
               raise NotFound("Organization not found")
     
     @extend_schema(
          summary="Cancel invitation",
          responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
     )
     def delete(self, request, invitation_id):
          """Cancel a pending invitation"""
          organization = self.get_organization(request)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          InvitationService.cancel_invitation(organization, request.user, invitation_id)
          
          return self.success_response("Invitation cancelled successfully")
     
     @extend_schema(
          summary="Resend invitation",
          responses={200: InvitationSerializer}
     )
     def post(self, request, invitation_id):
          """Resend invitation email"""
          organization = self.get_organization(request)
          
          # Check permission
          self.check_object_permissions(request, organization)
          
          data = InvitationService.resend_invitation(organization, request.user, invitation_id)
          
          return self.success_response("Invitation resent successfully", data)


@extend_schema(tags=["Public Invitations"])
class InvitationVerifyAPIView(CustomAPIView):
     permission_classes = []
     
     @extend_schema(
          summary="Verify invitation token",
          responses={200: {
               "type": "object",
               "properties": {
                    "email": {"type": "string"},
                    "organization_name": {"type": "string"},
                    "role_name": {"type": "string"},
                    "invited_by": {"type": "string"},
                    "expires_at": {"type": "string", "format": "date-time"}
               }
          }}
     )
     def get(self, request, token):
          """Verify invitation token and get details for registration"""
          data = InvitationService.verify_invitation_token(token)
          
          return self.success_response(
               message="Invitation verified successfully",
               data=data
          )

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
               message="Account created successfully! Welcome to the organization.",
               data=data,
               status_code=201
          )