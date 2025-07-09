from django.db import transaction
from django.utils.text import slugify
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from apps.events.models import Event
from apps.events.serializers.event_serializer import EventSerializer, EventCreateSerializer


class EventService:
     @staticmethod
     def create_event(user, validated_data: dict) -> dict:
          """
          Create a new event
          
          Args:
               user: The user creating the event
               validated_data: Validated event data
               
          Returns:
               dict: Serialized event data
               
          Raises:
               ValidationError: If event creation fails due to business rules
          """
          
          # Validate business rules
          EventService._validate_event_creation_rules(validated_data)
          
          with transaction.atomic():
               # Generate slug if not provided
               if not validated_data.get('slug'):
                    validated_data['slug'] = EventService._generate_unique_slug(validated_data['name'])
               
               # Create the event
               event = Event.objects.create(
                    created_by=user,
                    **validated_data
               )
               
               # Serialize and return the data
               serializer = EventCreateSerializer(event)
               return serializer.data

     @staticmethod
     def get_event_list_for_each_organization(user):
          try:
               events = Event.objects.filter(created_by__organization = user.organization)
               
               return EventSerializer(events, many=True).data
          except:
               raise ValidationError("Something went wrong in getting events list.")
     
     @staticmethod
     def get_event_details_by_id(event_id):
          try:
               event = get_object_or_404(Event, id=event_id)
               
               return EventSerializer(event).data
          except:
               raise ValidationError("Something went wrong in getting events details.")
          
     @staticmethod
     def _validate_event_creation_rules(validated_data: dict) -> None:
          """
          Validate business rules for event creation
          
          Args:
               validated_data: The event data to validate
               
          Raises:
               ValidationError: If any business rule is violated
          """
          from django.utils import timezone
          
          # Check if start date is in the future
          if validated_data['start_datetime'] <= timezone.now():
               raise ValidationError("Event start date must be in the future")
          
          # Check capacity is reasonable
          if validated_data['capacity'] <= 0:
               raise ValidationError("Event capacity must be greater than 0")
          
          if validated_data['capacity'] > 10000:
               raise ValidationError("Event capacity cannot exceed 10,000 attendees")
          
          # Check duration is reasonable - handle both duration fields and end_datetime
          duration_days = validated_data.get('duration_days', 0)
          duration_hours = validated_data.get('duration_hours', 0)
          start_datetime = validated_data.get('start_datetime')
          end_datetime = validated_data.get('end_datetime')
          
          # Calculate total duration in hours
          if end_datetime and start_datetime:
               # If both datetimes provided, calculate duration
               total_duration = (end_datetime - start_datetime).total_seconds() / 3600
          else:
               # Use provided duration fields
               total_duration = (duration_days * 24) + duration_hours
          
          # Validate minimum duration (at least 30 minutes)
          if total_duration < 0.5:
               raise ValidationError("Event duration must be at least 30 minutes")
          
          # Validate maximum duration (365 days = 8760 hours)
          if total_duration > 8760:
               raise ValidationError("Event duration cannot exceed 365 days")
     
     @staticmethod
     def _generate_unique_slug(name: str) -> str:
          """
          Generate a unique slug for the event
          
          Args:
               name: The event name
               
          Returns:
               str: A unique slug
          """
          base_slug = slugify(name)
          slug = base_slug
          counter = 1
          
          while Event.objects.filter(slug=slug).exists():
               slug = f"{base_slug}-{counter}"
               counter += 1
          
          return slug