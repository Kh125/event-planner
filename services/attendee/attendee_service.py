from django.db import transaction
from rest_framework.exceptions import ValidationError, NotFound
from apps.events.models import Event, Attendee
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer


class AttendeeService:
     """
     Service class for handling attendee-related business logic
     """
     
     @staticmethod
     def register_attendee_for_event(event_id: int, attendee_data: dict) -> dict:
          """
          Register an attendee for an event
          
          Args:
               event_id: The ID of the event to register for
               attendee_data: Validated attendee registration data
               
          Returns:
               dict: Serialized attendee data
               
          Raises:
               NotFound: If event doesn't exist
               ValidationError: If registration fails due to business rules
          """
          # Get the event
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          # Business rule validations
          AttendeeService._validate_event_registration_rules(event, attendee_data.get('email'))
          
          # Determine attendee status based on capacity
          status = AttendeeService._determine_attendee_status(event)
          
          with transaction.atomic():
               # Create attendee registration
               attendee = Attendee.objects.create(
                    event=event,
                    full_name=attendee_data['full_name'],
                    email=attendee_data['email'],
                    status=status
               )
               
               # Serialize and return the data
               serializer = AttendeeRegistrationSerializer(attendee)
               
               return serializer.data
     
     @staticmethod
     def _validate_event_registration_rules(event: Event, email: str) -> None:
          """
          Validate business rules for event registration
          
          Args:
               event: The event to check
               email: The attendee's email
               
          Raises:
               ValidationError: If any business rule is violated
          """
          from django.utils import timezone
          
          # Check if event has already started
          if event.start_datetime < timezone.now():
               raise ValidationError("Event has already started or ended.")
          
          # Check if attendee already registered
          if AttendeeService._is_attendee_already_registered(event, email):
               raise ValidationError("Attendee is already registered for this event")
     
     @staticmethod
     def _determine_attendee_status(event: Event) -> str:
          """
          Determine the status for a new attendee based on event capacity
          
          Args:
               event: The event to check
               
          Returns:
               str: The status for the new attendee ('confirmed' or 'waitlisted')
          """
          confirmed_count = event.attendees.filter(status='confirmed').count()
          
          if confirmed_count >= event.capacity:
               return 'waitlisted'
          else:
               return 'confirmed'
     
     @staticmethod
     def _is_event_at_capacity(event: Event) -> bool:
          """
          Check if event is at full capacity
          
          Args:
               event: The event to check
               
          Returns:
               bool: True if at capacity, False otherwise
          """
          confirmed_attendees = event.attendees.filter(status='confirmed').count()
          
          return confirmed_attendees >= event.capacity
     
     @staticmethod
     def _is_attendee_already_registered(event: Event, email: str) -> bool:
          """
          Check if attendee is already registered for the event
          
          Args:
               event: The event to check
               email: The attendee's email
               
          Returns:
               bool: True if already registered, False otherwise
          """
          return event.attendees.filter(email=email).exists()
     
     @staticmethod
     def get_event_attendees(event_id: int) -> list:
          """
          Get all attendees for an event
          
          Args:
               event_id: The ID of the event
               
          Returns:
               list: List of attendee data
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          attendees = event.attendees.all()
          
          serializer = AttendeeRegistrationSerializer(attendees, many=True)
          
          return serializer.data
     
     @staticmethod
     def update_attendee_status(event_id: int, attendee_id: int, status: str) -> dict:
          """
          Update attendee status (confirm, reject, waitlist)
          
          Args:
               event_id: The ID of the event
               attendee_id: The ID of the attendee
               status: New status for the attendee
               
          Returns:
               dict: Updated attendee data
               
          Raises:
               NotFound: If event or attendee doesn't exist
               ValidationError: If status is invalid
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          try:
               attendee = event.attendees.get(id=attendee_id)
          except Attendee.DoesNotExist:
               raise NotFound("Attendee not found")
          
          # Validate status
          valid_statuses = ['confirmed', 'rejected', 'waitlisted', 'pending']
          
          if status not in valid_statuses:
               raise ValidationError(f"Invalid status. Must be one of: {valid_statuses}")
          
          attendee.status = status
          attendee.save(update_fields=['status'])
          
          serializer = AttendeeRegistrationSerializer(attendee)
          
          return serializer.data