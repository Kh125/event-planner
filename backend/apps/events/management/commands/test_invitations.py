from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import json
import requests

from apps.events.models import Event, EventStatus, RegistrationType, AttendeeInvitation, AttendeeInvitationStatus
from apps.users.models import Role
from services.attendee.attendee_invitation_service import AttendeeInvitationService
from core.constants import ROLES

User = get_user_model()


class Command(BaseCommand):
     help = 'Test and demonstrate the attendee invitation process'

     def add_arguments(self, parser):
          parser.add_argument(
               '--create-test-data',
               action='store_true',
               help='Create test event and user data',
          )
          parser.add_argument(
               '--send-invitations',
               action='store_true',
               help='Send test invitations',
          )
          parser.add_argument(
               '--test-acceptance',
               action='store_true',
               help='Test invitation acceptance flow',
          )
          parser.add_argument(
               '--show-stats',
               action='store_true',
               help='Show invitation statistics',
          )
          parser.add_argument(
               '--test-api',
               action='store_true',
               help='Test API endpoints',
          )
          parser.add_argument(
               '--demo',
               action='store_true',
               help='Run complete demo (create data, send invitations, accept, show stats)',
          )
          parser.add_argument(
               '--clean',
               action='store_true',
               help='Clean up test data (attendees and invitations)',
          )

     def handle(self, *args, **options):
          self.stdout.write(
               self.style.SUCCESS('🎉 Testing Attendee Invitation Process')
          )
          
          if options['clean']:
               self.clean_test_data()
               return
          
          if options['demo']:
               self.stdout.write("\n🚀 Running complete demo...")
               self.clean_test_data()  # Clean first
               self.create_test_data()
               self.send_test_invitations()
               self.test_invitation_acceptance()
               self.test_api_endpoints()
               self.show_invitation_stats()
               return
          
          if options['create_test_data']:
               self.create_test_data()
          
          if options['send_invitations']:
               self.send_test_invitations()
          
          if options['test_acceptance']:
               self.test_invitation_acceptance()
          
          if options['test_api']:
               self.test_api_endpoints()
          
          if options['show_stats']:
               self.show_invitation_stats()
          
          if options['clean']:
               self.cleanup_test_data()

     def create_test_data(self):
          """Create test event and user data"""
          self.stdout.write("\n📝 Creating test data...")
          
          # Get or create role
          role, _ = Role.objects.get_or_create(
               name=ROLES.ORG_ADMIN,
               defaults={'label': 'Organization Admin'}
          )
          
          # Create or get test user
          user, created = User.objects.get_or_create(
               email='organizer@test.com',
               defaults={
                    'full_name': 'Event Organizer',
                    'is_active': True,
                    'role': role
               }
          )
          if created:
               user.set_password('testpass123')
               user.save()
               self.stdout.write(f"✅ Created organizer: {user.email}")
          else:
               self.stdout.write(f"✅ Using existing organizer: {user.email}")
          
          # Create test event
          event, created = Event.objects.get_or_create(
               name='Tech Conference 2025',
               defaults={
                    'description': 'A cutting-edge tech conference featuring the latest innovations.',
                    'start_datetime': timezone.now() + timedelta(days=30),
                    'end_datetime': timezone.now() + timedelta(days=31),
                    'capacity': 100,
                    'venue_name': 'Tech Center',
                    'venue_address': '123 Innovation Street, Tech City',
                    'status': EventStatus.PUBLISHED,
                    'is_public': True,
                    'registration_type': RegistrationType.INVITATION_ONLY,
                    'created_by': user
               }
          )
          if created:
               self.stdout.write(f"✅ Created event: {event.name}")
          else:
               # Update existing event to ensure the user is the creator
               event.created_by = user
               event.save()
               self.stdout.write(f"✅ Using existing event: {event.name} (updated creator)")
          
          self.test_event = event
          self.test_user = user

     def clean_test_data(self):
          """Clean up test data to avoid conflicts"""
          self.stdout.write("\n🧹 Cleaning up test data...")
          
          try:
               from apps.events.models import Attendee, AttendeeInvitation, Event
               
               # Get test event if it exists
               try:
                    event = Event.objects.get(name='Tech Conference 2025')
                    
                    # Clean up attendees
                    attendee_count = event.attendees.count()
                    if attendee_count > 0:
                         event.attendees.all().delete()
                         self.stdout.write(f"✅ Deleted {attendee_count} existing attendees")
                    
                    # Clean up invitations
                    invitation_count = event.invitations.count()
                    if invitation_count > 0:
                         event.invitations.all().delete()
                         self.stdout.write(f"✅ Deleted {invitation_count} existing invitations")
                    
                    self.stdout.write("✅ Data cleanup completed")
                    
               except Event.DoesNotExist:
                    self.stdout.write("✅ No test event found - nothing to clean")
                    
          except Exception as e:
               self.stdout.write(f"❌ Cleanup error: {str(e)}")

     def send_test_invitations(self):
          """Send test invitations"""
          if not hasattr(self, 'test_event'):
               # Try to get the test event and user
               try:
                    self.test_event = Event.objects.get(name='Tech Conference 2025')
                    self.test_user = User.objects.get(email='organizer@test.com')
               except (Event.DoesNotExist, User.DoesNotExist):
                    self.stdout.write(
                         self.style.ERROR("❌ No test event found. Run with --create-test-data first.")
                    )
                    return
          
          self.stdout.write("\n📧 Sending test invitations...")
          
          # Clear existing invitations for a clean test
          existing_count = AttendeeInvitation.objects.filter(event=self.test_event).count()
          if existing_count > 0:
               self.stdout.write(f"🧹 Clearing {existing_count} existing invitations...")
               AttendeeInvitation.objects.filter(event=self.test_event).delete()
          
          test_emails = [
               'attendee1@test.com',
               'attendee2@test.com',
               'vip@test.com',
               'speaker@test.com',
               'sponsor@test.com'
          ]
          
          # Create invitations directly for testing (bypassing service for now)
          created_count = 0
          for email in test_emails:
               try:
                    invitation = AttendeeInvitation.objects.create(
                         event=self.test_event,
                         email=email.lower(),
                         invited_by=self.test_user,
                         message='You are cordially invited to join our exclusive Tech Conference 2025!',
                         expires_at=timezone.now() + timedelta(days=7)
                    )
                    created_count += 1
                    self.stdout.write(f"✅ Created invitation for {email}")
               except Exception as e:
                    self.stdout.write(f"❌ Failed to create invitation for {email}: {str(e)}")
          
          self.stdout.write(f"\n🎉 Successfully created {created_count} invitations!")

     def test_invitation_acceptance(self):
          """Test the invitation acceptance flow"""
          self.stdout.write("\n🎯 Testing invitation acceptance...")
          
          # Get a pending invitation
          pending_invitation = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.PENDING
          ).first()
          
          if not pending_invitation:
               self.stdout.write(
                    self.style.WARNING("⚠️  No pending invitations found. Send some invitations first.")
               )
               return
          
          self.stdout.write(f"📝 Testing with invitation for: {pending_invitation.email}")
          self.stdout.write(f"🔗 Invitation token: {pending_invitation.token}")
          
          # Test invitation verification
          try:
               # Simulate verification
               invitation_detail = {
                    'token': str(pending_invitation.token),
                    'event_name': pending_invitation.event.name,
                    'event_description': pending_invitation.event.description,
                    'invited_by': pending_invitation.invited_by.full_name if pending_invitation.invited_by else 'System',
                    'message': pending_invitation.message,
                    'expires_at': pending_invitation.expires_at,
                    'is_expired': pending_invitation.is_expired(),
                    'can_accept': pending_invitation.can_accept()
               }
               
               self.stdout.write("✅ Invitation verification successful")
               self.stdout.write(f"   Event: {invitation_detail['event_name']}")
               self.stdout.write(f"   Invited by: {invitation_detail['invited_by']}")
               self.stdout.write(f"   Can accept: {invitation_detail['can_accept']}")
               
               # Test acceptance
               if invitation_detail['can_accept']:
                    attendee_data = {
                         'full_name': 'John Doe',
                         'phone': '+1234567890'
                    }
                    
                    result = AttendeeInvitationService.accept_invitation(
                         token=str(pending_invitation.token),
                         attendee_data=attendee_data
                    )
                    self.stdout.write("✅ Invitation accepted successfully")
                    self.stdout.write(f"   Attendee created: {result['full_name']}")
                    self.stdout.write(f"   Registration status: {result['status']}")
               
          except Exception as e:
               self.stdout.write(
                    self.style.ERROR(f"❌ Acceptance test failed: {str(e)}")
               )

     def show_invitation_stats(self):
          """Show invitation statistics"""
          self.stdout.write("\n📊 Invitation Statistics")
          self.stdout.write("=" * 50)
          
          # Overall stats
          total_invitations = AttendeeInvitation.objects.count()
          pending_invitations = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.PENDING
          ).count()
          accepted_invitations = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.ACCEPTED
          ).count()
          rejected_invitations = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.REJECTED
          ).count()
          expired_invitations = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.EXPIRED
          ).count()
          
          self.stdout.write(f"📈 Total Invitations: {total_invitations}")
          self.stdout.write(f"⏳ Pending: {pending_invitations}")
          self.stdout.write(f"✅ Accepted: {accepted_invitations}")
          self.stdout.write(f"❌ Rejected: {rejected_invitations}")
          self.stdout.write(f"⏰ Expired: {expired_invitations}")
          
          # Event-specific stats
          if hasattr(self, 'test_event'):
               event_invitations = self.test_event.invitations.all()
               self.stdout.write(f"\n🎪 Event: {self.test_event.name}")
               self.stdout.write(f"   Total invitations: {event_invitations.count()}")
               
               for invitation in event_invitations[:5]:  # Show first 5
                    status_emoji = {
                         'pending': '⏳',
                         'accepted': '✅', 
                         'rejected': '❌',
                         'expired': '⏰',
                         'cancelled': '🚫'
                    }.get(invitation.status, '❓')
                    
                    self.stdout.write(
                         f"   {status_emoji} {invitation.email} - {invitation.status}"
                    )
          
          # Public invitation URLs
          self.stdout.write("\n🔗 Public Invitation URLs")
          self.stdout.write("=" * 50)
          
          pending_invitations = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.PENDING
          )[:3]  # Show first 3
          
          if pending_invitations:
               base_url = "http://localhost:8000/api/attendee-invitations"
               for invitation in pending_invitations:
                    self.stdout.write(f"📧 {invitation.email}:")
                    self.stdout.write(f"   Verify: {base_url}/verify/{invitation.token}/")
                    self.stdout.write(f"   Accept: {base_url}/accept/ (POST with token)")
                    self.stdout.write(f"   Reject: {base_url}/reject/ (POST with token)")
          else:
               self.stdout.write("   No pending invitations found.")
          
          self.stdout.write(f"\n🎉 Invitation system is ready!")
          self.stdout.write(f"🌐 API Documentation: http://localhost:8000/api/schema/swagger-ui/")

     def test_api_endpoints(self):
          """Test API endpoints for invitation management"""
          self.stdout.write("\n🌐 Testing API endpoints...")
          
          base_url = "http://localhost:8000"
          
          # Get a pending invitation for testing
          pending_invitation = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.PENDING
          ).first()
          
          if not pending_invitation:
               self.stdout.write(
                    self.style.WARNING("⚠️  No pending invitations found for API testing.")
               )
               return
          
          token = str(pending_invitation.token)
          
          # Test 1: Verify invitation endpoint
          try:
               response = requests.get(f"{base_url}/api/attendee-invitations/verify/{token}/")
               if response.status_code == 200:
                    self.stdout.write("✅ Invitation verification API works")
                    data = response.json()
                    self.stdout.write(f"   Event: {data.get('event_name', 'N/A')}")
                    self.stdout.write(f"   Can accept: {data.get('can_accept', False)}")
               else:
                    self.stdout.write(f"❌ Verification API failed: {response.status_code}")
          except Exception as e:
               self.stdout.write(f"❌ Verification API error: {str(e)}")
          
          # Test 2: Accept invitation endpoint
          try:
               accept_payload = {
                    "token": token,
                    "attendee_data": {
                         "full_name": "API Test User",
                         "phone": "+1234567890"
                         # Note: email will come from invitation
                    }
               }
               
               response = requests.post(
                    f"{base_url}/api/attendee-invitations/accept/",
                    json=accept_payload,
                    headers={'Content-Type': 'application/json'}
               )
               
               if response.status_code in [200, 201]:  # Accept both OK and Created
                    self.stdout.write("✅ Invitation acceptance API works")
                    data = response.json()
                    if 'data' in data:  # Handle wrapped response
                         attendee_data = data['data']
                         self.stdout.write(f"   Attendee created: {attendee_data.get('full_name', 'N/A')}")
                         self.stdout.write(f"   Email: {attendee_data.get('email', 'N/A')}")
                         self.stdout.write(f"   Status: {attendee_data.get('status', 'N/A')}")
                    else:  # Handle direct response
                         self.stdout.write(f"   Attendee created: {data.get('full_name', 'N/A')}")
                         self.stdout.write(f"   Email: {data.get('email', 'N/A')}")
                         self.stdout.write(f"   Status: {data.get('status', 'N/A')}")
               elif response.status_code == 400:
                    self.stdout.write(f"⚠️  Acceptance API validation error: {response.json()}")
               else:
                    self.stdout.write(f"❌ Acceptance API failed: {response.status_code}")
                    try:
                         self.stdout.write(f"   Error: {response.json()}")
                    except:
                         self.stdout.write(f"   Raw response: {response.text}")
          except Exception as e:
               self.stdout.write(f"❌ Acceptance API error: {str(e)}")
          
          # Test 3: Try to accept same invitation again (should fail)
          try:
               response = requests.post(
                    f"{base_url}/api/attendee-invitations/accept/",
                    json=accept_payload,
                    headers={'Content-Type': 'application/json'}
               )
               
               if response.status_code == 400:
                    self.stdout.write("✅ Duplicate acceptance properly rejected")
               else:
                    self.stdout.write("⚠️  Duplicate acceptance not properly handled")
          except Exception as e:
               self.stdout.write(f"⚠️  Duplicate test error: {str(e)}")
          
          # Test 4: Test rejection endpoint with a new invitation
          new_invitation = AttendeeInvitation.objects.filter(
               status=AttendeeInvitationStatus.PENDING
          ).first()
          
          if new_invitation:
               try:
                    reject_payload = {
                         "token": str(new_invitation.token),
                         "reason": "API test rejection"
                    }
                    
                    response = requests.post(
                         f"{base_url}/api/attendee-invitations/reject/",
                         json=reject_payload,
                         headers={'Content-Type': 'application/json'}
                    )
                    
                    if response.status_code == 200:
                         self.stdout.write("✅ Invitation rejection API works")
                    else:
                         self.stdout.write(f"❌ Rejection API failed: {response.status_code}")
               except Exception as e:
                    self.stdout.write(f"❌ Rejection API error: {str(e)}")
          
          self.stdout.write("🔚 API testing completed")

     def run_complete_demo(self):
          """Run a complete demonstration of the invitation system"""
          self.stdout.write("\n🚀 Running Complete Invitation Demo")
          self.stdout.write("=" * 60)
          
          # Step 1: Create test data
          self.stdout.write("\n📋 Step 1: Setting up test environment...")
          self.create_test_data()
          
          # Step 2: Send invitations using the service (with email)
          self.stdout.write("\n📋 Step 2: Sending invitations via service...")
          self.demo_send_via_service()
          
          # Step 3: Show current stats
          self.stdout.write("\n📋 Step 3: Current invitation status...")
          self.show_invitation_stats()
          
          # Step 4: Test verification and acceptance
          self.stdout.write("\n📋 Step 4: Testing invitation acceptance...")
          self.test_invitation_acceptance()
          
          # Step 5: Final stats
          self.stdout.write("\n📋 Step 5: Final statistics...")
          self.show_invitation_stats()
          
          self.stdout.write("\n🎉 Demo completed successfully!")
          self.stdout.write("📚 Next steps:")
          self.stdout.write("   1. Integrate with frontend")
          self.stdout.write("   2. Add email templates")
          self.stdout.write("   3. Add invitation analytics")
          self.stdout.write("   4. Add bulk invitation upload")

     def demo_send_via_service(self):
          """Demonstrate sending invitations via the service (with proper email)"""
          if not hasattr(self, 'test_event'):
               self.stdout.write("❌ Test environment not set up")
               return
          
          # Clear existing invitations
          AttendeeInvitation.objects.filter(event=self.test_event).delete()
          
          test_emails = [
               'demo1@example.com',
               'demo2@example.com',
               'vip@example.com'
          ]
          
          invitation_data = {
               'emails': test_emails,
               'message': 'Welcome to Tech Conference 2025! This is a demonstration of our invitation system.',
               'is_vip': False,
               'bypass_capacity': False
          }
          
          try:
               result = AttendeeInvitationService.send_invitations(
                    event=self.test_event,
                    inviter=self.test_user,
                    validated_data=invitation_data
               )
               
               self.stdout.write(f"✅ Service sent {result['sent_count']} invitations")
               if result.get('errors'):
                    for error in result['errors']:
                         self.stdout.write(f"   ⚠️  {error}")
                         
          except Exception as e:
               self.stdout.write(f"❌ Service error: {str(e)}")
               # Fallback to direct creation
               self.stdout.write("   Falling back to direct invitation creation...")
               for email in test_emails:
                    AttendeeInvitation.objects.create(
                         event=self.test_event,
                         email=email.lower(),
                         invited_by=self.test_user,
                         message=invitation_data['message'],
                         expires_at=timezone.now() + timedelta(days=7)
                    )

     def cleanup_test_data(self):
          """Clean up test data (attendees and invitations)"""
          self.stdout.write("\n🧹 Cleaning up test data...")
          
          # Delete all test invitations
          deleted_invitations, _ = AttendeeInvitation.objects.filter(
               event__name='Tech Conference 2025'
          ).delete()
          self.stdout.write(f"✅ Deleted {deleted_invitations} test invitations")
          
          # Delete all test users (that are not superusers)
          deleted_users, _ = User.objects.filter(
               email='organizer@test.com'
          ).delete()
          self.stdout.write(f"✅ Deleted {deleted_users} test users")
          
          # Optionally, delete the test event
          try:
               event = Event.objects.get(name='Tech Conference 2025')
               event.delete()
               self.stdout.write(f"✅ Deleted test event: {event.name}")
          except Event.DoesNotExist:
               self.stdout.write("⚠️  Test event not found, skipping event deletion")
