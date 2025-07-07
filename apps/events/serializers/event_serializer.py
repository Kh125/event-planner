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
          fields = ['id', 'title', 'description', 'start_time', 'speaker']

class EventSerializer(serializers.ModelSerializer):
     speakers = SpeakerSerializer(many=True, read_only=True)
     sessions = SessionSerializer(many=True, read_only=True)

     class Meta:
          model = Event
          fields = [
               'id', 'name', 'slug', 'description',
               'start_datetime', 'duration_days', 'capacity',
               'venue_name', 'venue_address', 'timezone',
               'speakers', 'sessions',
          ]

class AttendeeSerializer(serializers.ModelSerializer):
     class Meta:
          model = Attendee
          fields = ['id', 'event', 'full_name', 'email', 'status', 'registered_at']
          read_only_fields = ['status', 'registered_at']

class AttendeeRegistrationSerializer(serializers.ModelSerializer):
     class Meta:
          model = Attendee
          fields = ['event', 'full_name', 'email']

     def validate(self, attrs):
          event = attrs.get('event')

          if event.start_datetime < timezone.now():
               raise serializers.ValidationError("Event has already started or ended.")

          return attrs

     def create(self, validated_data):
          event = validated_data['event']
          confirmed_count = event.attendees.filter(status='confirmed').count()

          if confirmed_count >= event.capacity:
               status = 'waitlisted'
          else:
               status = 'confirmed'

          attendee = Attendee.objects.create(
               full_name=validated_data['full_name'],
               email=validated_data['email'],
               event=event,
               status=status
          )
          return attendee
