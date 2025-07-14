from rest_framework import serializers
from apps.events.models import AttendeeInvitation, Event
from apps.events.serializers.event_serializer import AttendeeRegistrationSerializer


class SendAttendeeInvitationSerializer(serializers.ModelSerializer):
    """Serializer for sending attendee invitations"""
    emails = serializers.ListField(
        child=serializers.EmailField(),
        write_only=True,
        help_text="List of email addresses to invite"
    )
    
    class Meta:
        model = AttendeeInvitation
        fields = ['emails', 'message', 'is_vip', 'bypass_capacity']
        extra_kwargs = {
            'message': {'required': False},
            'is_vip': {'required': False},
            'bypass_capacity': {'required': False}
        }
    
    def validate_emails(self, value):
        """Validate email list"""
        if not value:
            raise serializers.ValidationError("At least one email address is required.")
        
        if len(value) > 100:  # Prevent abuse
            raise serializers.ValidationError("Cannot send more than 100 invitations at once.")
        
        # Remove duplicates while preserving order
        unique_emails = []
        seen = set()
        for email in value:
            email_lower = email.lower()
            if email_lower not in seen:
                seen.add(email_lower)
                unique_emails.append(email)
        
        return unique_emails


class AttendeeInvitationSerializer(serializers.ModelSerializer):
    """Serializer for attendee invitation details"""
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
    event_name = serializers.CharField(source='event.name', read_only=True)
    event_date = serializers.DateTimeField(source='event.start_datetime', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)
    can_accept = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = AttendeeInvitation
        fields = [
            'id', 'email', 'full_name', 'token', 'message', 'status',
            'expires_at', 'responded_at', 'is_vip', 'bypass_capacity',
            'invited_by_name', 'event_name', 'event_date',
            'is_expired', 'is_valid', 'can_accept', 'created_at'
        ]
        read_only_fields = [
            'id', 'token', 'status', 'responded_at', 'created_at'
        ]


class AttendeeInvitationAcceptanceSerializer(serializers.Serializer):
    """Serializer for attendee data when accepting invitations (without email)"""
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_full_name(self, value):
        """Validate full name"""
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")
        return value.strip()
    
    def validate_phone(self, value):
        """Validate phone number if provided"""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Please provide a valid phone number.")
        return value.strip() if value else value


class AcceptAttendeeInvitationSerializer(serializers.Serializer):
    """Serializer for accepting attendee invitations"""
    token = serializers.UUIDField()
    attendee_data = AttendeeInvitationAcceptanceSerializer()
    
    def validate_token(self, value):
        """Validate invitation token"""
        try:
            invitation = AttendeeInvitation.objects.get(token=value)
        except AttendeeInvitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation token.")
        
        if not invitation.can_accept():
            if invitation.status != 'pending':
                raise serializers.ValidationError(f"Invitation has already been {invitation.status}.")
            elif invitation.is_expired():
                raise serializers.ValidationError("Invitation has expired.")
            else:
                raise serializers.ValidationError("Invitation cannot be accepted at this time.")
        
        return value


class RejectAttendeeInvitationSerializer(serializers.Serializer):
    """Serializer for rejecting attendee invitations"""
    token = serializers.UUIDField()
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True)
    
    def validate_token(self, value):
        """Validate invitation token"""
        try:
            invitation = AttendeeInvitation.objects.get(token=value)
        except AttendeeInvitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation token.")
        
        if invitation.status != 'pending':
            raise serializers.ValidationError(f"Invitation has already been {invitation.status}.")
        
        if invitation.is_expired():
            raise serializers.ValidationError("Invitation has expired.")
        
        return value


class AttendeeInvitationStatsSerializer(serializers.Serializer):
    """Serializer for invitation statistics"""
    total_invitations = serializers.IntegerField()
    pending_invitations = serializers.IntegerField()
    accepted_invitations = serializers.IntegerField()
    rejected_invitations = serializers.IntegerField()
    expired_invitations = serializers.IntegerField()
    response_rate = serializers.DecimalField(max_digits=5, decimal_places=2)


class PublicInvitationDetailSerializer(serializers.ModelSerializer):
    """Serializer for public invitation details (for verification)"""
    event_name = serializers.CharField(source='event.name', read_only=True)
    event_description = serializers.CharField(source='event.description', read_only=True)
    event_date = serializers.DateTimeField(source='event.start_datetime', read_only=True)
    event_venue = serializers.CharField(source='event.venue_name', read_only=True)
    event_address = serializers.CharField(source='event.venue_address', read_only=True)
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)
    organization_name = serializers.CharField(source='event.created_by.organization.name', read_only=True)
    
    class Meta:
        model = AttendeeInvitation
        fields = [
            'email', 'full_name', 'message', 'is_vip', 'expires_at',
            'event_name', 'event_description', 'event_date', 'event_venue', 'event_address',
            'invited_by_name', 'organization_name'
        ]
