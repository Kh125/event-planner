from rest_framework import serializers
from apps.events.models import Event

class EventAnalyticsSerializer(serializers.ModelSerializer):
     total_attendees = serializers.SerializerMethodField()
     confirmed_attendees = serializers.SerializerMethodField()
     waitlisted_attendees = serializers.SerializerMethodField()
     pending_attendees = serializers.SerializerMethodField()

     class Meta:
          model = Event
          fields = ['id', 'name', 'total_attendees', 'confirmed_attendees', 'waitlisted_attendees', 'pending_attendees']

     def get_total_attendees(self, obj):
          return obj.attendees.count()

     def get_confirmed_attendees(self, obj):
          return obj.attendees.filter(status='confirmed').count()

     def get_waitlisted_attendees(self, obj):
          return obj.attendees.filter(status='waitlisted').count()

     def get_pending_attendees(self, obj):
          return obj.attendees.filter(status='pending').count()
