from django.db import transaction
from rest_framework.exceptions import ValidationError, NotFound
from apps.events.models import Event, Session, Speaker
from apps.events.serializers.event_serializer import SessionCreateSerializer, SessionDetailsSerializer


class SessionService:
     """
     Service class for handling session-related business logic
     """
     
     @staticmethod
     def create_session(event: Event, validated_data: dict) -> dict:
          """
          Create a new session for an event
          
          Args:
               event: The event object (passed from view)
               validated_data: Validated session data
               
          Returns:
               dict: Serialized session data
               
          Raises:
               ValidationError: If session creation fails
          """
          # Business rule validations
          SessionService._validate_session_creation_rules(event, validated_data)
          
          with transaction.atomic():
               # Handle speaker assignment
               speaker = None
               speaker_id = validated_data.pop('speaker_id', None)
               
               if speaker_id:
                    try:
                         count = event.speakers.count()
                         speaker = event.speakers.get(id=speaker_id)
                    except Speaker.DoesNotExist:
                         raise ValidationError("Speaker not found for this event")
               
               # Create session
               session = Session.objects.create(
                    event=event,
                    speaker=speaker,
                    **validated_data
               )
               
               # Serialize and return the data
               serializer = SessionDetailsSerializer(session)
               return serializer.data
     
     @staticmethod
     def get_event_sessions(event_id: int) -> list:
          """
          Get all sessions for an event
          
          Args:
               event_id: The ID of the event
               
          Returns:
               list: List of session data
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          sessions = event.sessions.select_related('speaker').all()
          serializer = SessionDetailsSerializer(sessions, many=True)
          
          return serializer.data
     
     @staticmethod
     def get_event_session_by_id(event_id: int, session_id: int) -> list:
          """
          Get a session details for an event by session_id
          
          Args:
               event_id: The ID of the event
               session_id: The ID of the session
               
          Returns:
               list: Session detail data
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          sessions = event.sessions.get(id=session_id)
          
          serializer = SessionDetailsSerializer(sessions)
          
          return serializer.data
     
     @staticmethod
     def update_session(event: Event, session_id: int, validated_data: dict) -> dict:
          """
          Update an existing session
          
          Args:
               event: The event object (passed from view)
               session_id: The ID of the session
               validated_data: Validated session data
               
          Returns:
               dict: Updated session data
               
          Raises:
               NotFound: If session doesn't exist
               ValidationError: If update fails
          """
          try:
               session = event.sessions.get(id=session_id)
          except Session.DoesNotExist:
               raise NotFound("Session not found")
          
          # Handle speaker assignment
          speaker_id = validated_data.pop('speaker_id', None)
          if speaker_id:
               try:
                    speaker = event.speakers.get(id=speaker_id)
                    session.speaker = speaker
               except Speaker.DoesNotExist:
                    raise ValidationError("Speaker not found for this event")
          
          # Update session
          for attr, value in validated_data.items():
               setattr(session, attr, value)
          
          session.save()
          
          serializer = SessionDetailsSerializer(session)
          return serializer.data
     
     @staticmethod
     def delete_session(event: Event, session_id: int) -> None:
          """
          Delete a session
          
          Args:
               event: The event object (passed from view)
               session_id: The ID of the session
               
          Raises:
               NotFound: If session doesn't exist
          """
          try:
               session = event.sessions.get(id=session_id)
          except Session.DoesNotExist:
               raise NotFound("Session not found")
          
          session.delete()
     
     @staticmethod
     def _validate_session_creation_rules(event: Event, validated_data: dict) -> None:
          """
          Validate business rules for session creation
          
          Args:
               event: The event to check
               validated_data: The session data to validate
               
          Raises:
               ValidationError: If any business rule is violated
          """
          from django.utils import timezone
          
          # Check if session time is within event duration
          session_start = validated_data.get('start_time')
          session_end = validated_data.get('end_time')
          event_start = event.start_datetime
          event_end = event.end_datetime or (event_start + timezone.timedelta(days=event.duration_days, hours=float(event.duration_hours)))
          
          if session_start < event_start or session_start > event_end:
               raise ValidationError("Session must be scheduled within the event duration")
               
          if session_end and session_end > event_end:
               raise ValidationError("Session end time must be within the event duration")
          
          # Check for overlapping sessions (more robust)
          session_end = validated_data.get('end_time')
          if not session_end:
               # Default to 1 hour if no end time specified
               session_end = session_start + timezone.timedelta(hours=1)
          
          overlapping_sessions = event.sessions.filter(
               start_time__lt=session_end,  # Existing session starts before new session ends
               end_time__gt=session_start   # Existing session ends after new session starts
          )
          
          if overlapping_sessions.exists():
               raise ValidationError("Another session is already scheduled at this time")
          
          # Check maximum sessions per event
          if event.sessions.count() >= 100:
               raise ValidationError("Event cannot have more than 100 sessions")
