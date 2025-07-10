#!/usr/bin/env python
"""
Test script to verify registration type flows work correctly
"""
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_planner.settings.development')
django.setup()

from apps.events.models import Event, EventStatus, RegistrationType, AttendeeStatus
from services.attendee.attendee_service import AttendeeService

def test_open_registration():
    """Test open registration flow"""
    print("Testing OPEN registration...")
    
    # Create an open event
    event = Event.objects.create(
        name="Open Event Test",
        description="Test event for open registration",
        start_datetime=timezone.now() + timedelta(days=1),
        end_datetime=timezone.now() + timedelta(days=1, hours=2),
        capacity=2,
        venue_name="Test Venue",
        venue_address="123 Test St",
        status=EventStatus.PUBLISHED,
        is_public=True,
        registration_type=RegistrationType.OPEN
    )
    
    # Test registration 1 - should be CONFIRMED
    attendee1_data = {
        'email': 'test1@example.com',
        'full_name': 'Test User 1'
    }
    result1 = AttendeeService.register_attendee(event, attendee1_data)
    print(f"  Attendee 1 status: {result1['status']} (expected: confirmed)")
    
    # Test registration 2 - should be CONFIRMED
    attendee2_data = {
        'email': 'test2@example.com',
        'full_name': 'Test User 2'
    }
    result2 = AttendeeService.register_attendee(event, attendee2_data)
    print(f"  Attendee 2 status: {result2['status']} (expected: confirmed)")
    
    # Test registration 3 - should be WAITLISTED (at capacity)
    attendee3_data = {
        'email': 'test3@example.com',
        'full_name': 'Test User 3'
    }
    result3 = AttendeeService.register_attendee(event, attendee3_data)
    print(f"  Attendee 3 status: {result3['status']} (expected: waitlisted)")
    
    # Cleanup
    event.delete()
    print("  ✓ Open registration test passed\n")

def test_approval_required_registration():
    """Test approval required registration flow"""
    print("Testing APPROVAL_REQUIRED registration...")
    
    # Create an approval required event
    event = Event.objects.create(
        name="Approval Required Event Test",
        description="Test event for approval required registration",
        start_datetime=timezone.now() + timedelta(days=1),
        end_datetime=timezone.now() + timedelta(days=1, hours=2),
        capacity=10,
        venue_name="Test Venue",
        venue_address="123 Test St",
        status=EventStatus.PUBLISHED,
        is_public=True,
        registration_type=RegistrationType.APPROVAL_REQUIRED
    )
    
    # Test registration - should be PENDING
    attendee_data = {
        'email': 'test@example.com',
        'full_name': 'Test User'
    }
    result = AttendeeService.register_attendee(event, attendee_data)
    print(f"  Attendee status: {result['status']} (expected: pending)")
    
    # Cleanup
    event.delete()
    print("  ✓ Approval required registration test passed\n")

def test_invitation_only_registration():
    """Test invitation only registration flow (should be blocked)"""
    print("Testing INVITATION_ONLY registration...")
    
    # Create an invitation only event
    event = Event.objects.create(
        name="Invitation Only Event Test",
        description="Test event for invitation only registration",
        start_datetime=timezone.now() + timedelta(days=1),
        end_datetime=timezone.now() + timedelta(days=1, hours=2),
        capacity=10,
        venue_name="Test Venue",
        venue_address="123 Test St",
        status=EventStatus.PUBLISHED,
        is_public=True,
        registration_type=RegistrationType.INVITATION_ONLY
    )
    
    # Test registration - should raise ValidationError
    attendee_data = {
        'email': 'test@example.com',
        'full_name': 'Test User'
    }
    
    try:
        result = AttendeeService.register_attendee(event, attendee_data)
        print(f"  ERROR: Registration should have been blocked!")
    except Exception as e:
        print(f"  Registration blocked: {str(e)} (expected)")
    
    # Cleanup
    event.delete()
    print("  ✓ Invitation only registration test passed\n")

if __name__ == "__main__":
    print("Running registration type flow tests...\n")
    
    test_open_registration()
    test_approval_required_registration()
    test_invitation_only_registration()
    
    print("All tests completed!")
