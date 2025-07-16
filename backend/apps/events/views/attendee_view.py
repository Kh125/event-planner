from rest_framework import status
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import IsEventCreatorOrOrgAdmin
from services.attendee.attendee_service import AttendeeService
from utils.view.custom_api_views import CustomAPIView
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer, AttendeeStatusUpdateSerializer
from apps.events.models import Event
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema


@extend_schema(tags=["Attendees"])
class AttendeeRegistrationAPIView(CustomAPIView):
     """Public endpoint for attendee registration (no authentication required)"""
     authentication_classes = []
     permission_classes = []

     def post(self, request, event_id):
          """Register for an event as a guest"""
          # Get the event (public access)
          event = get_object_or_404(Event, id=event_id)
          
          serializer = AttendeeRegistrationSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          # Use service to register attendee
          data = AttendeeService.register_attendee(
               event=event,
               validated_data=serializer.validated_data
          )
          
          return self.success_response(
               message="Registration successful! You will receive a confirmation email shortly.",
               data=data,
               status_code=status.HTTP_201_CREATED
          )


@extend_schema(tags=["Attendees"])
class AttendeeListAPIView(CustomAPIView):
     """Attendee list management (organizers only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsEventCreatorOrOrgAdmin]

     def get(self, request, event_id):
          """Get all attendees for an event"""
          # Retrieve attendees
          data = AttendeeService.get_event_attendees(event_id=event_id)
          
          return self.success_response(
               message="Attendees retrieved successfully",
               data=data
          )


@extend_schema(tags=["Attendees"])
class AttendeeManagementAPIView(CustomAPIView):
     """Attendee status management (organizers only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsEventCreatorOrOrgAdmin]

     def patch(self, request, event_id, attendee_id):
          """Update attendee status"""
          serializer = AttendeeStatusUpdateSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          # Use service to update attendee status
          data = AttendeeService.update_attendee_status(
               event=request.event,
               attendee_id=attendee_id,
               validated_data=serializer.validated_data
          )
          
          return self.success_response(
               message="Attendee status updated successfully",
               data=data
          )

     def delete(self, request, event_id, attendee_id):
          """Remove attendee from event"""
          # Get attendee first to get email for service call
          from apps.events.models import Attendee
          try:
               attendee = request.event.attendees.get(id=attendee_id)
               email = attendee.email
          except Attendee.DoesNotExist:
               return self.error_response(
                    message="Attendee not found",
                    status_code=status.HTTP_404_NOT_FOUND
               )
          
          # Use service to cancel registration
          AttendeeService.cancel_registration(
               event=request.event,
               email=email
          )
          
          return self.success_response(
               message="Attendee removed successfully"
          )


@extend_schema(tags=["Attendees"])
class AttendeeStatsAPIView(CustomAPIView):
     """Attendee statistics (organizers only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [IsEventCreatorOrOrgAdmin]

     def get(self, request, event_id):
          """Get registration statistics for an event"""
          # Use service to get stats
          data = AttendeeService.get_registration_stats(event=request.event)
          
          return self.success_response(
               message="Registration statistics retrieved successfully",
               data=data
          )


@extend_schema(tags=["Attendees"])
class AttendeeRegistrationLookupAPIView(CustomAPIView):
     """Public endpoint to check registration status"""
     authentication_classes = []
     permission_classes = []

     def get(self, request, event_id):
          """Check registration status by email"""
          email = request.query_params.get('email')
          
          if not email:
               return self.error_response(
                    message="Email is required to check the status.",
                    status_code=status.HTTP_400_BAD_REQUEST
               )
          
          # Get the event (public access)
          event = get_object_or_404(Event, id=event_id)
          
          try:
               # Use service to get attendee details
               data = AttendeeService.get_attendee_by_email(event=event, email=email)
               return self.success_response(
                    message="Registration found",
                    data=data
               )
          except Exception:
               return self.error_response(
                    message="Registration not found",
                    status_code=status.HTTP_404_NOT_FOUND
               )


@extend_schema(tags=["Attendees"]) 
class AttendeeCancelRegistrationAPIView(CustomAPIView):
     """Public endpoint for attendees to cancel their own registration"""
     authentication_classes = []
     permission_classes = []

     def delete(self, request, event_id):
          """Cancel registration by email"""
          email = request.data.get('email')
          
          if not email:
               return self.error_response(
                    message="Email is required",
                    status_code=status.HTTP_400_BAD_REQUEST
               )
          
          # Get the event (public access)
          event = get_object_or_404(Event, id=event_id)
         
          # Cancel registration
          AttendeeService.cancel_registration(event=event, email=email)
          
          return self.success_response(
               message="Registration cancelled successfully"
          )
