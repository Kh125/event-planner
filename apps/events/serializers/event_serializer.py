from rest_framework import serializers
from django.utils import timezone
from ..models import Event, Speaker, Session, Attendee

class SpeakerSerializer(serializers.ModelSerializer):
     class Meta:
          model = Speaker
          fields = ['id', 'full_name', 'title', 'company', 'bio']

class SessionSerializer(serializers.ModelSerializer):
     speaker = SpeakerSerializer()

     class Meta:
          model = Session
          fields = ['id', 'title', 'description', 'start_time', 'end_time', 'duration_hours', 'speaker']

class EventCreateSerializer(serializers.ModelSerializer):
     class Meta:
          model = Event
          fields = [
               'id', 'name', 'slug', 'description', 'start_datetime', 'end_datetime', 
               'duration_days', 'duration_hours', 'capacity', 'venue_name', 'venue_address', 
               'created_at', 'updated_at'
          ]
          extra_kwargs = {
               'id': {'read_only': True},
               'slug': {'required': False},
               'end_datetime': {'required': False},
               'created_at': {'read_only': True},
               'updated_at': {'read_only': True}
          }

     def validate_name(self, value):
          """Validate event name"""
          if not value or len(value.strip()) < 3:
               raise serializers.ValidationError("Event name must be at least 3 characters long.")
          return value.strip()

     def validate_description(self, value):
          """Validate event description"""
          if not value or len(value.strip()) < 10:
               raise serializers.ValidationError("Event description must be at least 10 characters long.")
          return value.strip()

     def validate_venue_name(self, value):
          """Validate venue name"""
          if not value or len(value.strip()) < 2:
               raise serializers.ValidationError("Venue name must be at least 2 characters long.")
          return value.strip()

     def validate_venue_address(self, value):
          """Validate venue address"""
          if not value or len(value.strip()) < 5:
               raise serializers.ValidationError("Venue address must be at least 5 characters long.")
          return value.strip()

     def validate(self, attrs):
          """Validate event duration and datetime fields"""
          start_datetime = attrs.get('start_datetime')
          end_datetime = attrs.get('end_datetime')
          duration_days = attrs.get('duration_days', 0)
          duration_hours = attrs.get('duration_hours', 0)
          
          # If both start and end datetime are provided, validate end is after start
          if start_datetime and end_datetime:
               if end_datetime <= start_datetime:
                    raise serializers.ValidationError("End datetime must be after start datetime")
               
          # Start Datetime provided scenario
          elif start_datetime and not end_datetime:
               if duration_days == 0 and duration_hours == 0:
                    raise serializers.ValidationError("When end_datetime is not provided, you must specify duration_days and/or duration_hours")
               
          # If neither start nor end datetime, require both
          elif not start_datetime:
               raise serializers.ValidationError("start_datetime is required")
          
          # Validate duration values
          if duration_days < 0:
               raise serializers.ValidationError("Duration days cannot be negative")
          if duration_hours < 0:
               raise serializers.ValidationError("Duration hours cannot be negative")
          
          return attrs

class EventSerializer(serializers.ModelSerializer):
     speakers = SpeakerSerializer(many=True, read_only=True)
     sessions = SessionSerializer(many=True, read_only=True)

     class Meta:
          model = Event
          fields = [
               'id', 'name', 'slug', 'description',
               'start_datetime', 'end_datetime', 'duration_days', 'duration_hours', 'capacity',
               'venue_name', 'venue_address',
               'speakers', 'sessions', 'created_at', 'updated_at'
          ]

class AttendeeSerializer(serializers.ModelSerializer):
     class Meta:
          model = Attendee
          fields = ['id', 'event', 'full_name', 'email', 'status', 'registered_at']
          read_only_fields = ['status', 'registered_at']

class AttendeeRegistrationSerializer(serializers.ModelSerializer):
     class Meta:
          model = Attendee
          fields = ['id', 'full_name', 'email', 'status', 'registered_at']
          read_only_fields = ['id', 'status', 'registered_at']

     def validate_email(self, value):
          """Validate email format and basic checks"""
          if not value:
               raise serializers.ValidationError("Email is required.")
          return value.lower()

     def validate_full_name(self, value):
          """Validate full name"""
          if not value or len(value.strip()) < 2:
               raise serializers.ValidationError("Full name must be at least 2 characters long.")
          return value.strip()

class SpeakerCreateSerializer(serializers.ModelSerializer):
     class Meta:
          model = Speaker
          fields = ['id', 'full_name', 'title', 'company', 'bio']
          
     def validate_full_name(self, value):
          if not value or len(value.strip()) < 2:
               raise serializers.ValidationError("Speaker name must be at least 2 characters long.")
          return value.strip()

class SessionCreateSerializer(serializers.ModelSerializer):
     speaker_id = serializers.IntegerField(required=False)
     
     class Meta:
          model = Session
          fields = ['title', 'description', 'start_time', 'end_time', 'duration_hours', 'speaker_id']
          extra_kwargs = {
               'duration_hours': {'required': False},  # Will be auto-calculated if not provided
          }
          
     def validate_title(self, value):
          if not value or len(value.strip()) < 3:
               raise serializers.ValidationError("Session title must be at least 3 characters long.")
          return value.strip()
     
     def validate(self, attrs):
          """Validate start_time and end_time"""
          start_time = attrs.get('start_time')
          end_time = attrs.get('end_time')
          
          if start_time and end_time:
               if end_time <= start_time:
                    raise serializers.ValidationError("End time must be after start time.")
               
               # Calculate duration if not provided
               if not attrs.get('duration_hours'):
                    duration = end_time - start_time
                    attrs['duration_hours'] = duration.total_seconds() / 3600
          
          return attrs

class SessionDetailsSerializer(serializers.ModelSerializer):
     speaker = SpeakerSerializer(read_only=True)
     
     class Meta:
          model = Session
          fields = ['id', 'title', 'description', 'start_time', 'end_time', 'duration_hours', 'speaker']