from rest_framework import status
from apps.events.models import Event
from apps.events.serializers.event_analytics_serializer import EventAnalyticsSerializer
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer, EventCreateSerializer, EventUpdateSerializer
from services.event.event_service import EventService
from services.attendee.attendee_service import AttendeeService
from utils.view.custom_api_views import CustomAPIView
from core.middleware.authentication import TokenAuthentication
from core.middleware.permission import CanCreateEvents, OwnerOrAdminPermission
from drf_spectacular.utils import extend_schema

@extend_schema(tags=["Events"])
class CreateEventAPIView(CustomAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [CanCreateEvents]

     def post(self, request):
          serializer = EventCreateSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          
          # Use service to create event
          data = EventService.create_event(
               user=request.user,
               validated_data=serializer.validated_data
          )
          
          return self.success_response(
               message="Event created successfully",
               data=data,
               status_code=status.HTTP_201_CREATED
          )

class EventListAPIView(CustomAPIView):
     authentication_classes = [TokenAuthentication]
     permission_classes = [OwnerOrAdminPermission]
     success_message = "Event list fetched successfully"

     def get(self, request):
          events = EventService.get_event_list_for_each_organization(request.user)
          
          return self.success_response(data=events)

class EventDetailAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Event detail fetched successfully"
     error_message = "Event not found"

     def get(self, request, event_id):
          event = EventService.get_event_details_by_id(event_id)
          
          return self.success_response(data=event)


class RegisterAttendeeAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Registration successful"
     error_message = "Registration failed"

     def post(self, request, event_id):
          serializer = AttendeeRegistrationSerializer(data=request.data)
          
          serializer.is_valid(raise_exception=True)
          
          # Use service to register attendee
          data = AttendeeService.register_attendee_for_event(
               event_id=event_id,
               attendee_data=serializer.validated_data
          )
          
          return self.success_response(
               data=data, 
               status_code=status.HTTP_201_CREATED
          )


class EventAnalyticsAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Analytics fetched successfully"
     error_message = "Failed to fetch analytics"

     def get(self, request, event_id):
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               return self.error_response(message="Event not found", status_code=status.HTTP_404_NOT_FOUND)

          serializer = EventAnalyticsSerializer(event)
          
          return self.success_response(data=serializer.data)

@extend_schema(tags=["Events"])
class EventUpdateStatusAPIView(CustomAPIView):
     """Event status management (organizers only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [OwnerOrAdminPermission]

     def patch(self, request, event_id):
          """Update event status and visibility"""
          from apps.events.serializers.event_serializer import EventStatusSerializer
          from django.shortcuts import get_object_or_404
          
          # Get event and check ownership
          event = get_object_or_404(Event, id=event_id)
          
          if event.created_by.organization != request.user.organization:
               return self.error_response(
                    message="You don't have permission to modify this event",
                    status_code=status.HTTP_403_FORBIDDEN
               )
          
          serializer = EventStatusSerializer(event, data=request.data, partial=True)
          serializer.is_valid(raise_exception=True)
          serializer.save()
          
          return self.success_response(
               message="Event status updated successfully",
               data=serializer.data
          )

@extend_schema(tags=["Events"])
class EventManageAPIView(CustomAPIView):
     """Event update management (organizers only)"""
     authentication_classes = [TokenAuthentication]
     permission_classes = [OwnerOrAdminPermission]

     def put(self, request, event_id):
          """Update event details"""
          from django.shortcuts import get_object_or_404
          
          # Get event and check ownership
          event = get_object_or_404(Event, id=event_id)
          
          if event.created_by.organization != request.user.organization:
               return self.error_response(
                    message="You don't have permission to modify this event",
                    status_code=status.HTTP_403_FORBIDDEN
               )

          # Todo: TO fix EventUpdateSerializer
          serializer = EventUpdateSerializer(event, data=request.data, partial=True)
          serializer.is_valid(raise_exception=True)
          serializer.save()
          
          return self.success_response(
               message="Event updated successfully",
               data=serializer.data
          )

     def delete(self, request, event_id):
          """Cancel/Delete event"""
          from django.shortcuts import get_object_or_404
          from apps.events.models import EventStatus
          
          # Get event and check ownership
          event = get_object_or_404(Event, id=event_id)
          
          if event.created_by.organization != request.user.organization:
               return self.error_response(
                    message="You don't have permission to modify this event",
                    status_code=status.HTTP_403_FORBIDDEN
               )
          
          # Instead of deleting, mark as cancelled
          event.status = EventStatus.CANCELLED
          event.is_public = False
          event.save()
          
          # TODO: Send cancellation emails to attendees
          
          return self.success_response(
               message="Event cancelled successfully"
          )
