from rest_framework import status
from rest_framework.exceptions import NotFound
from drf_spectacular.utils import extend_schema

from apps.events.models import Event, AttendeeInvitation
from apps.events.serializers.attendee_invitation_serializer import (
    SendAttendeeInvitationSerializer, AttendeeInvitationSerializer,
    AcceptAttendeeInvitationSerializer, RejectAttendeeInvitationSerializer,
    AttendeeInvitationStatsSerializer, PublicInvitationDetailSerializer
)
from services.attendee.attendee_invitation_service import AttendeeInvitationService
from utils.view.custom_api_views import CustomAPIView
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsEventCreatorOrOrgAdmin
from django.shortcuts import get_object_or_404


@extend_schema(tags=["Attendee Invitations"])
class AttendeeInvitationAPIView(CustomAPIView):
    """Manage attendee invitations for events"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]
    
    @extend_schema(
        summary="Send attendee invitations",
        request=SendAttendeeInvitationSerializer,
        responses={201: {"type": "object"}}
    )
    def post(self, request, event_id):
        """Send invitations to attendees for an event"""
        event = get_object_or_404(Event, id=event_id)
        
        serializer = SendAttendeeInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = AttendeeInvitationService.send_invitations(
            event=event,
            inviter=request.user,
            validated_data=serializer.validated_data
        )
        
        return self.success_response(
            message=f"Successfully sent {result['sent_count']} invitations out of {result['total_attempted']} attempted.",
            data=result,
            status_code=status.HTTP_201_CREATED
        )
    
    @extend_schema(
        summary="List event invitations",
        responses={200: AttendeeInvitationSerializer(many=True)}
    )
    def get(self, request, event_id):
        """Get all invitations for an event"""
        event = get_object_or_404(Event, id=event_id)
        
        data = AttendeeInvitationService.get_event_invitations(event, request.user)
        
        return self.success_response(
            message="Invitations retrieved successfully",
            data=data
        )


@extend_schema(tags=["Attendee Invitations"])
class AttendeeInvitationManagementAPIView(CustomAPIView):
    """Manage individual attendee invitations"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]
    
    @extend_schema(
        summary="Cancel invitation",
        responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
    )
    def delete(self, request, event_id, invitation_id):
        """Cancel a pending invitation"""
        event = get_object_or_404(Event, id=event_id)
        
        AttendeeInvitationService.cancel_invitation(event, request.user, invitation_id)
        
        return self.success_response("Invitation cancelled successfully")
    
    @extend_schema(
        summary="Resend invitation",
        responses={200: AttendeeInvitationSerializer}
    )
    def post(self, request, event_id, invitation_id):
        """Resend an invitation"""
        event = get_object_or_404(Event, id=event_id)
        
        data = AttendeeInvitationService.resend_invitation(event, request.user, invitation_id)
        
        return self.success_response(
            message="Invitation resent successfully",
            data=data
        )


@extend_schema(tags=["Attendee Invitations"])
class AttendeeInvitationStatsAPIView(CustomAPIView):
    """Get invitation statistics for an event"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsEventCreatorOrOrgAdmin]
    
    @extend_schema(
        summary="Get invitation statistics",
        responses={200: AttendeeInvitationStatsSerializer}
    )
    def get(self, request, event_id):
        """Get invitation statistics for an event"""
        event = get_object_or_404(Event, id=event_id)
        
        data = AttendeeInvitationService.get_invitation_stats(event, request.user)
        
        return self.success_response(
            message="Invitation statistics retrieved successfully",
            data=data
        )


@extend_schema(tags=["Public Attendee Invitations"])
class PublicInvitationVerifyAPIView(CustomAPIView):
    """Verify attendee invitation token"""
    authentication_classes = []
    permission_classes = []
    
    @extend_schema(
        summary="Verify invitation token",
        responses={200: PublicInvitationDetailSerializer}
    )
    def get(self, request, token):
        """Verify invitation token and get details"""
        data = AttendeeInvitationService.verify_invitation(token)
        
        return self.success_response(
            message="Invitation verified successfully",
            data=data
        )


@extend_schema(tags=["Public Attendee Invitations"])
class AcceptAttendeeInvitationAPIView(CustomAPIView):
    """Accept attendee invitation"""
    authentication_classes = []
    permission_classes = []
    
    @extend_schema(
        summary="Accept attendee invitation",
        request=AcceptAttendeeInvitationSerializer,
        responses={201: {"type": "object"}}
    )
    def post(self, request):
        """Accept an attendee invitation"""
        serializer = AcceptAttendeeInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        attendee_data = serializer.validated_data['attendee_data']
        
        data = AttendeeInvitationService.accept_invitation(token, attendee_data)
        
        return self.success_response(
            message="Invitation accepted successfully! Welcome to the event.",
            data=data,
            status_code=status.HTTP_201_CREATED
        )


@extend_schema(tags=["Public Attendee Invitations"])
class RejectAttendeeInvitationAPIView(CustomAPIView):
    """Reject attendee invitation"""
    authentication_classes = []
    permission_classes = []
    
    @extend_schema(
        summary="Reject attendee invitation",
        request=RejectAttendeeInvitationSerializer,
        responses={200: {"type": "object", "properties": {"message": {"type": "string"}}}}
    )
    def post(self, request):
        """Reject an attendee invitation"""
        serializer = RejectAttendeeInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        reason = serializer.validated_data.get('reason', '')
        
        AttendeeInvitationService.reject_invitation(token, reason)
        
        return self.success_response(
            message="Invitation declined. Thank you for your response."
        )
