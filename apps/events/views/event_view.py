from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.events.models import Event
from apps.events.serializers.event_analytics_serializer import EventAnalyticsSerializer
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer, EventSerializer
from core.middleware.permission import AllUserPermission
from utils.view.custom_api_views import CustomAPIView
from rest_framework import status
from apps.events.models import Event

class EventListAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Event list fetched successfully"

     def get(self, request):
          queryset = Event.objects.all().order_by('-start_datetime')
          serializer = EventSerializer(queryset, many=True)
          return self.success_response(data=serializer.data)

class EventDetailAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Event detail fetched successfully"
     error_message = "Event not found"

     def get(self, request, event_id):
          event = get_object_or_404(Event, id=event_id)
          serializer = EventSerializer(event)
          return self.success_response(data=serializer.data)


class RegisterAttendeeAPIView(CustomAPIView):
     authentication_classes = []
     permission_classes = []
     success_message = "Registration successful"
     error_message = "Registration failed"

     def post(self, request, event_id):
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               return self.error_response(message="Event not found", status_code=status.HTTP_404_NOT_FOUND)

          serializer = AttendeeRegistrationSerializer(data=request.data)
          if serializer.is_valid():
               serializer.save(event=event)
               return self.success_response(data=serializer.data, status_code=status.HTTP_201_CREATED)
          return self.error_response(errors=serializer.errors)


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
