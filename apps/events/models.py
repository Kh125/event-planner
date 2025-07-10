from django.db import models
from django.utils.text import slugify
from timezone_field import TimeZoneField
from core.abstract_models import TimeStampModel

class EventStatus(models.TextChoices):
     DRAFT = 'draft', 'Draft'
     PUBLISHED = 'published', 'Published'
     ONGOING = 'ongoing', 'Ongoing'
     COMPLETED = 'completed', 'Completed'
     CANCELLED = 'cancelled', 'Cancelled'

class RegistrationType(models.TextChoices):
     OPEN = 'open', 'Open Registration'
     INVITATION_ONLY = 'invitation_only', 'Invitation Only'
     APPROVAL_REQUIRED = 'approval_required', 'Approval Required'

class Event(TimeStampModel):
     name = models.CharField(max_length=255)
     slug = models.SlugField(unique=True, blank=True)
     description = models.TextField()

     start_datetime = models.DateTimeField()
     end_datetime = models.DateTimeField()
     duration_days = models.PositiveIntegerField(default=0, help_text="Duration in days")
     duration_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Additional duration in hours (e.g., 1.5 for 1 hour 30 minutes)")
     capacity = models.PositiveIntegerField()
     
     venue_name = models.CharField(max_length=255)
     venue_address = models.TextField()

     timezone = TimeZoneField(default='UTC')
     
     # Event visibility and registration settings
     status = models.CharField(max_length=20, choices=EventStatus.choices, default=EventStatus.DRAFT)
     is_public = models.BooleanField(default=False, help_text="Whether event appears in public listings")
     registration_type = models.CharField(max_length=20, choices=RegistrationType.choices, default=RegistrationType.OPEN)
     registration_opens = models.DateTimeField(null=True, blank=True, help_text="When registration opens (optional)")
     registration_closes = models.DateTimeField(null=True, blank=True, help_text="When registration closes (optional)")
     requires_approval = models.BooleanField(default=False, help_text="Whether registrations need manual approval")

     # Organizer
     created_by = models.ForeignKey(
          'users.CustomUser',
          on_delete=models.SET_NULL,
          null=True,
          related_name='created_events'
     )
     
     def save(self, *args, **kwargs):
          if not self.slug:
               self.slug = slugify(self.name)
          
          # Auto-calculate duration from start_datetime and end_datetime if both are provided
          if self.start_datetime and self.end_datetime:
               duration = self.end_datetime - self.start_datetime
               total_hours = duration.total_seconds() / 3600  # Convert to hours
               
               # Calculate days and remaining hours
               self.duration_days = int(total_hours // 24)
               self.duration_hours = round(total_hours % 24, 2)
               
          # Auto-calculate end_datetime if not provided but duration is available
          elif self.start_datetime and not self.end_datetime and (self.duration_days > 0 or self.duration_hours > 0):
               from datetime import timedelta
               total_hours = float(self.duration_hours) + (self.duration_days * 24)
               self.end_datetime = self.start_datetime + timedelta(hours=total_hours)
               
          super().save(*args, **kwargs)

     @property
     def total_duration_hours(self):
          """Returns total duration in hours"""
          return float(self.duration_hours) + (self.duration_days * 24)

     @property
     def is_registration_open(self):
          """Check if registration is currently open"""
          from django.utils import timezone
          now = timezone.now()
          
          # Check if event has started
          if self.start_datetime <= now:
               return False
               
          # Check registration window
          if self.registration_opens and now < self.registration_opens:
               return False
               
          if self.registration_closes and now > self.registration_closes:
               return False
               
          return True

     @property
     def available_spots(self):
          """Get number of available spots"""
          confirmed_count = self.attendees.filter(status='confirmed').count()
          return max(0, self.capacity - confirmed_count)

     @property
     def is_full(self):
          """Check if event is at capacity"""
          return self.available_spots == 0

     def can_register(self):
          """Check if new registrations are allowed"""
          return (
               self.status == EventStatus.PUBLISHED and
               self.is_public and
               self.registration_type == RegistrationType.OPEN and
               self.is_registration_open and
               not self.is_full
          )

     def __str__(self):
          return self.name

class Speaker(TimeStampModel):
     full_name = models.CharField(max_length=100)
     title = models.CharField(max_length=100)
     company = models.CharField(max_length=100)
     bio = models.TextField()
     event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='speakers')

     def __str__(self):
          return self.full_name

class Session(TimeStampModel):
     event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='sessions')
     speaker = models.ForeignKey(Speaker, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')

     title = models.CharField(max_length=200)
     description = models.TextField(blank=True)
     start_time = models.DateTimeField()
     end_time = models.DateTimeField()
     duration_hours = models.DecimalField(max_digits=4, decimal_places=2, help_text="Duration in hours (e.g., 1.5 for 1 hour 30 minutes)")

     def save(self, *args, **kwargs):
          # Auto-calculate duration if not provided
          if self.start_time and self.end_time and not self.duration_hours:
               duration = self.end_time - self.start_time
               self.duration_hours = duration.total_seconds() / 3600  # Convert to hours
          super().save(*args, **kwargs)

     def __str__(self):
          return f"{self.title} ({self.start_time} - {self.end_time})"

class AttendeeStatus(models.TextChoices):
     PENDING = 'pending', 'Pending'
     CONFIRMED = 'confirmed', 'Confirmed'
     REJECTED = 'rejected', 'Rejected'
     WAITLISTED = 'waitlisted', 'Waitlisted'

class Attendee(TimeStampModel):
     event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
     email = models.EmailField()
     full_name = models.CharField(max_length=100)
     phone = models.CharField(max_length=20, blank=True)
     status = models.CharField(max_length=20, choices=AttendeeStatus.choices, default=AttendeeStatus.PENDING)
     
     # Optional user account (for future linking)
     user = models.ForeignKey('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='event_registrations')
     
     registered_at = models.DateTimeField(auto_now_add=True)
     confirmed_at = models.DateTimeField(null=True, blank=True)

     class Meta:
          unique_together = ['event', 'email']  # Prevent duplicate registrations
          
     def save(self, *args, **kwargs):
          # Auto-set confirmed_at when status changes to confirmed
          if self.status == AttendeeStatus.CONFIRMED and not self.confirmed_at:
               from django.utils import timezone
               self.confirmed_at = timezone.now()
          super().save(*args, **kwargs)

     def __str__(self):
          return f"{self.full_name} - {self.event.name} ({self.status})"
