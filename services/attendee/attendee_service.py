from django.db import transaction
from rest_framework.exceptions import ValidationError, NotFound
from apps.events.models import Event, Attendee, AttendeeStatus
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer, AttendeeSerializer, AttendeeStatusUpdateSerializer


class AttendeeService:
     """
     Service class for handling attendee-related business logic
     """
     
     @staticmethod
     def register_attendee(event: Event, validated_data: dict) -> dict:
          """
          Register a new attendee for an event (guest registration)
          
          Args:
               event: The event object (passed from view)
               validated_data: Validated attendee data
               
          Returns:
               dict: Serialized attendee data
               
          Raises:
               ValidationError: If registration fails
          """
          # Business rule validations
          AttendeeService._validate_attendee_registration_rules(event, validated_data)
          
          with transaction.atomic():
               # Check if already registered
               existing_attendee = event.attendees.filter(email=validated_data['email']).first()
               if existing_attendee:
                    raise ValidationError("This email is already registered for this event")
               
               # Create attendee
               attendee = Attendee.objects.create(
                    event=event,
                    **validated_data
               )
               
               # TODO: Send confirmation email
               
               # Serialize and return the data
               serializer = AttendeeSerializer(attendee)
               return serializer.data
               
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
               list: List of attendee
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          attendees = event.attendees.all().order_by('-registered_at')
          
          serializer = AttendeeSerializer(attendees, many=True)
          
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
     
     @staticmethod
     def update_attendee_status(event: Event, attendee_id: int, validated_data: dict) -> dict:
          """
          Update attendee status (for organizers)
          
          Args:
               event: The event object (passed from view)
               attendee_id: The ID of the attendee
               validated_data: Validated status data
               
          Returns:
               dict: Updated attendee data
               
          Raises:
               NotFound: If attendee doesn't exist
          """
          try:
               attendee = event.attendees.get(id=attendee_id)
          except Attendee.DoesNotExist:
               raise NotFound("Attendee not found")
          
          # Update status
          attendee.status = validated_data['status']
          attendee.save()
          
          # TODO: Send status update email to attendee
          
          serializer = AttendeeSerializer(attendee)
          return serializer.data
     
     @staticmethod
     def cancel_registration(event: Event, email: str) -> None:
          """
          Cancel attendee registration
          
          Args:
               event: The event object
               email: Email of the attendee to cancel
               
          Raises:
               NotFound: If attendee doesn't exist
          """
          try:
               attendee = event.attendees.get(email=email)
          except Attendee.DoesNotExist:
               raise NotFound("Registration not found")
          
          attendee.delete()
          
          # TODO: Send cancellation confirmation email
     
     @staticmethod
     def get_attendee_by_email(event: Event, email: str) -> dict:
          """
          Get attendee details by email
          
          Args:
               event: The event object
               email: Email of the attendee
               
          Returns:
               dict: Attendee data
               
          Raises:
               NotFound: If attendee doesn't exist
          """
          try:
               attendee = event.attendees.get(email=email)
          except Attendee.DoesNotExist:
               raise NotFound("Registration not found")
          
          serializer = AttendeeSerializer(attendee)
          return serializer.data
     
     @staticmethod
     def get_registration_stats(event: Event) -> dict:
          """
          Get registration statistics for an event
          
          Args:
               event: The event object
               
          Returns:
               dict: Registration statistics
          """
          total_registrations = event.attendees.count()
          confirmed = event.attendees.filter(status=AttendeeStatus.CONFIRMED).count()
          pending = event.attendees.filter(status=AttendeeStatus.PENDING).count()
          rejected = event.attendees.filter(status=AttendeeStatus.REJECTED).count()
          waitlisted = event.attendees.filter(status=AttendeeStatus.WAITLISTED).count()
          
          return {
               'total_registrations': total_registrations,
               'confirmed': confirmed,
               'pending': pending,
               'rejected': rejected,
               'waitlisted': waitlisted,
               'capacity': event.capacity,
               'available_spots': max(0, event.capacity - confirmed) if event.capacity else None
          }
     
     @staticmethod
     def _validate_attendee_registration_rules(event: Event, validated_data: dict) -> None:
          """
          Validate business rules for attendee registration
          
          Args:
               event: The event to check
               validated_data: The attendee data to validate
               
          Raises:
               ValidationError: If any business rule is violated
          """
          from django.utils import timezone
          
          # Check if event registration is still open
          if event.start_datetime <= timezone.now():
               raise ValidationError("Registration is closed - event has already started")
          
          # Check if event is at capacity (only count confirmed attendees)
          confirmed_count = event.attendees.filter(status=AttendeeStatus.CONFIRMED).count()
          if confirmed_count >= event.capacity:
               raise ValidationError("Event is at full capacity")
          
          # Validate email format more strictly if needed
          email = validated_data.get('email', '')
          if not email or '@' not in email:
               raise ValidationError("Please provide a valid email address")