from django.db import models
from django.utils.text import slugify
from timezone_field import TimeZoneField
from core.abstract_models import TimeStampModel

class Event(TimeStampModel):
     name = models.CharField(max_length=255)
     slug = models.SlugField(unique=True, blank=True)
     description = models.TextField()

     start_datetime = models.DateTimeField()
     duration_days = models.PositiveIntegerField()
     capacity = models.PositiveIntegerField()
     
     venue_name = models.CharField(max_length=255)
     venue_address = models.TextField()

     timezone = TimeZoneField(default='UTC')

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
          super().save(*args, **kwargs)

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

     def __str__(self):
          return f"{self.title} ({self.start_time})"

class AttendeeStatus(models.TextChoices):
     CONFIRMED = 'confirmed', 'Confirmed'
     REJECTED = 'rejected', 'Rejected'
     WAITLISTED = 'waitlisted', 'Waitlisted'
     PENDING = 'pending', 'Pending'

class Attendee(TimeStampModel):
     event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='attendees')
     email = models.EmailField()
     full_name = models.CharField(max_length=100)
     status = models.CharField(max_length=20, choices=AttendeeStatus.choices, default=AttendeeStatus.PENDING)

     registered_at = models.DateTimeField(auto_now_add=True)

     def __str__(self):
          return f"{self.full_name} - {self.status}"
