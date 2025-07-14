# Attendee Invitation System - Documentation

## Overview
The attendee invitation system allows event organizers to send personalized invitations to specific people for their events. This is particularly useful for invitation-only events, VIP attendees, or controlled registration scenarios.

## Features Implemented

### ✅ Core Models
- **AttendeeInvitation**: Main invitation model with status tracking, expiration, and VIP options
- **AttendeeInvitationStatus**: Status choices (pending, accepted, rejected, expired, cancelled)
- Integration with existing **Event** and **Attendee** models

### ✅ Service Layer
- **AttendeeInvitationService**: Handles all invitation business logic
  - Send invitations to multiple emails
  - Verify invitation tokens
  - Accept/reject invitations
  - Permission checking
  - Email notifications

### ✅ API Endpoints

#### Organizer Endpoints (Authenticated)
- `POST /api/events/{event_id}/invitations/` - Send invitations
- `GET /api/events/{event_id}/invitations/` - List event invitations
- `GET /api/events/{event_id}/invitations/{invitation_id}/` - Manage specific invitation
- `GET /api/events/{event_id}/invitations/stats/` - Invitation statistics

#### Public Endpoints (No Authentication)
- `GET /api/attendee-invitations/verify/{token}/` - Verify invitation
- `POST /api/attendee-invitations/accept/` - Accept invitation
- `POST /api/attendee-invitations/reject/` - Reject invitation

### ✅ Notification Integration
- Email notifications when invitations are sent
- Uses existing notification system
- Template support for customized messages

### ✅ Security & Validation
- UUID tokens for secure invitation links
- Expiration handling (7 days default)
- Permission checks (only event creators can send invitations)
- Duplicate prevention
- Capacity bypass options for VIP invitations

## API Usage Examples

### 1. Send Invitations
```bash
POST /api/events/1/invitations/
Authorization: Bearer {token}
Content-Type: application/json

{
  "emails": ["user1@example.com", "user2@example.com"],
  "message": "You're invited to our exclusive tech conference!",
  "is_vip": false,
  "bypass_capacity": false
}
```

### 2. Verify Invitation
```bash
GET /api/attendee-invitations/verify/f76c8706-edb0-440b-80a6-bf3ae649b578/
```

Response:
```json
{
  "token": "f76c8706-edb0-440b-80a6-bf3ae649b578",
  "event_name": "Tech Conference 2025",
  "event_description": "A cutting-edge tech conference...",
  "invited_by": "Event Organizer",
  "message": "You're invited to our exclusive tech conference!",
  "expires_at": "2025-07-22T17:52:26Z",
  "can_accept": true,
  "is_expired": false
}
```

### 3. Accept Invitation
```bash
POST /api/attendee-invitations/accept/
Content-Type: application/json

{
  "token": "f76c8706-edb0-440b-80a6-bf3ae649b578",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

### 4. Get Invitation Statistics
```bash
GET /api/events/1/invitations/stats/
Authorization: Bearer {token}
```

Response:
```json
{
  "total_sent": 10,
  "pending": 3,
  "accepted": 6,
  "rejected": 1,
  "expired": 0,
  "acceptance_rate": 60.0
}
```

## Database Schema

### AttendeeInvitation Model
- `id`: Primary key
- `event`: Foreign key to Event
- `email`: Invitee email address
- `full_name`: Optional invitee name
- `invited_by`: Foreign key to User (inviter)
- `token`: UUID for secure access
- `message`: Personal message from inviter
- `status`: Current invitation status
- `expires_at`: Expiration timestamp
- `responded_at`: Response timestamp
- `attendee`: Link to created Attendee (after acceptance)
- `is_vip`: VIP invitation flag
- `bypass_capacity`: Capacity bypass flag
- `created_at`/`updated_at`: Timestamps

### Indexes
- `token` (for fast lookup)
- `event, status` (for filtering)
- `email, status` (for user queries)

## Testing

### Management Command
Run comprehensive tests with:
```bash
python manage.py test_invitations --demo
```

This includes:
1. Test data creation
2. Invitation sending
3. Email notifications
4. Acceptance flow
5. Statistics reporting

### Manual Testing URLs
Based on the demo, you can test these URLs:
- Verify: `http://localhost:8000/api/attendee-invitations/verify/{token}/`
- API Documentation: `http://localhost:8000/api/schema/swagger-ui/`

## Implementation Status

### ✅ Completed
- [x] Models and migrations
- [x] Service layer with business logic
- [x] API endpoints (organizer + public)
- [x] Email notifications
- [x] Security and validation
- [x] Comprehensive testing
- [x] Documentation

### 🔄 Next Steps
1. **Frontend Integration**
   - React components for invitation management
   - Public invitation acceptance page
   - Dashboard for invitation analytics

2. **Enhanced Features**
   - Bulk invitation upload (CSV)
   - Custom email templates
   - Invitation reminders
   - Real-time notifications (WebSocket)

3. **Admin Interface**
   - Django admin integration
   - Invitation management tools
   - Bulk actions

4. **Analytics & Reporting**
   - Invitation success metrics
   - Event-specific reports
   - Export capabilities

## Error Handling

The system handles various error scenarios:
- Invalid or expired tokens
- Duplicate invitations
- Capacity limits (unless bypassed)
- Permission denials
- Email delivery failures

## Security Considerations

- UUID tokens prevent brute force attacks
- Expiration prevents indefinite access
- Permission checks ensure only authorized users can send invitations
- Input validation prevents malicious data
- Rate limiting should be considered for production

## Performance Notes

- Database indexes for fast queries
- Bulk invitation sending
- Efficient permission checking
- Minimal email template processing

The attendee invitation system is now fully functional and ready for production use!
