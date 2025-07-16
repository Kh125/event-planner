from django.db import transaction
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from apps.events.models import Event, Speaker
from apps.events.serializers.event_serializer import SpeakerCreateSerializer


class SpeakerService:
     """
     Service class for handling speaker-related business logic
     """
     
     @staticmethod
     def create_speaker(event: Event, validated_data: dict) -> dict:
          """
          Create a new speaker for an event
          
          Args:
               event: The event object (passed from view)
               validated_data: Validated speaker data
               
          Returns:
               dict: Serialized speaker data
               
          Raises:
               ValidationError: If speaker creation fails
          """
          # Business rule validations
          SpeakerService._validate_speaker_creation_rules(event, validated_data)
          
          with transaction.atomic():
               # Create speaker
               speaker = Speaker.objects.create(
                    event=event,
                    **validated_data
               )
               
               # Serialize and return the data
               serializer = SpeakerCreateSerializer(speaker)
               return serializer.data
     
     @staticmethod
     def get_event_speakers(event_id: int) -> list:
          """
          Get all speakers for an event
          
          Args:
               event_id: The ID of the event
               
          Returns:
               list: List of speaker data
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          speakers = event.speakers.all()
          serializer = SpeakerCreateSerializer(speakers, many=True)
          return serializer.data
     
     @staticmethod
     def get_event_speaker_details(event_id: int, speaker_id: int) -> list:
          """
          Get speaker details for an event
          
          Args:
               speaker_id: The ID of the event
               
          Returns:
               speaker: Details of speaker data
               
          Raises:
               NotFound: If event doesn't exist
          """
          try:
               event = Event.objects.get(id=event_id)
          except Event.DoesNotExist:
               raise NotFound("Event not found")
          
          speaker = event.speakers.get(id=speaker_id)
          serializer = SpeakerCreateSerializer(speaker)
          
          return serializer.data
     
     @staticmethod
     def update_speaker(event: Event, speaker_id: int, validated_data: dict) -> dict:
          """
          Update an existing speaker (supports partial updates)
          
          Args:
               event: The event object (passed from view)
               speaker_id: The ID of the speaker
               validated_data: Validated speaker data
               
          Returns:
               dict: Updated speaker data
               
          Raises:
               NotFound: If speaker doesn't exist
               ValidationError: If validation fails
          """
          try:
               speaker = event.speakers.get(id=speaker_id)
          except Speaker.DoesNotExist:
               raise NotFound("Speaker not found")
          
          # Validate business rules for updates
          SpeakerService._validate_speaker_update_rules(event, speaker, validated_data)
          
          # Update only provided fields
          for attr, value in validated_data.items():
               if hasattr(speaker, attr):
                    setattr(speaker, attr, value)
          
          speaker.save()
          
          serializer = SpeakerCreateSerializer(speaker)
          return serializer.data
     
     @staticmethod
     def delete_speaker(event: Event, speaker_id: int) -> None:
          """
          Delete a speaker
          
          Args:
               event: The event object (passed from view)
               speaker_id: The ID of the speaker
               
          Raises:
               NotFound: If speaker doesn't exist
          """
          try:
               speaker = event.speakers.get(id=speaker_id)
          except Speaker.DoesNotExist:
               raise NotFound("Speaker not found")
          
          speaker.delete()
     
     @staticmethod
     def _validate_speaker_creation_rules(event: Event, validated_data: dict) -> None:
          """
          Validate business rules for speaker creation
          
          Args:
               event: The event to check
               validated_data: The speaker data to validate
               
          Raises:
               ValidationError: If any business rule is violated
          """
          # Check if speaker with same name already exists for this event
          if event.speakers.filter(full_name=validated_data['full_name']).exists():
               raise ValidationError("A speaker with this name already exists for this event")
          
          # Check maximum speakers per event (business rule)
          if event.speakers.count() >= 50:
               raise ValidationError("Event cannot have more than 50 speakers")
     
     @staticmethod
     def _validate_speaker_update_rules(event: Event, speaker: Speaker, validated_data: dict) -> None:
          """
          Validate business rules for speaker updates
          
          Args:
               event: The event to check
               speaker: The speaker being updated
               validated_data: The speaker data to validate
               
          Raises:
               ValidationError: If any business rule is violated
          """
          # Check if updating full_name and another speaker with same name already exists
          if 'full_name' in validated_data:
               existing_speaker = event.speakers.filter(
                    full_name=validated_data['full_name']
               ).exclude(id=speaker.id).first()
               
               if existing_speaker:
                    raise ValidationError("A speaker with this name already exists for this event")
