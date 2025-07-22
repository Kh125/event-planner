import { TeamMember, OrganizationInvitation } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface InviteRequest {
  email: string;
  role: string;
}

export interface AcceptInvitationRequest {
  token: string;
  full_name: string;
  password: string;
}

export class TeamService {
  static async getTeamMembers(organizationId: string): Promise<TeamMember[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/members/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }

  static async inviteTeamMember(organizationId: string, data: InviteRequest): Promise<OrganizationInvitation> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/invitations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to invite team member');
      }

      return response.json();
    } catch (error) {
      console.error('Error inviting team member:', error);
      throw error;
    }
  }

  static async getPendingInvitations(organizationId: string): Promise<OrganizationInvitation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${organizationId}/invitations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending invitations');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
      throw error;
    }
  }

  static async resendInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${invitationId}/resend/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  }

  static async cancelInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${invitationId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
      throw error;
    }
  }

  static async removeTeamMember(memberId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      throw error;
    }
  }

  static async getInvitationDetails(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/${token}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invitation details');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching invitation details:', error);
      throw error;
    }
  }

  static async acceptInvitation(data: AcceptInvitationRequest): Promise<{ user: any; token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/invitations/accept/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept invitation');
      }

      return response.json();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  static async updateMemberRole(memberId: string, role: string): Promise<TeamMember> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update member role');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }
}
