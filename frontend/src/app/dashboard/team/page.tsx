'use client';

import { useState, useTransition } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { InviteTeamMemberModal } from '@/components/InviteTeamMemberModal';
import { PendingInvitations } from '@/components/PendingInvitations';
import { TeamMember, OrganizationInvitation } from '@/types';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Shield, 
  User, 
  MoreVertical, 
  Settings,
  Mail,
  Trash2,
  CheckCircle
} from 'lucide-react';

// Mock data - replace with actual API calls
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'owner@example.com',
    full_name: 'John Doe',
    role: 'ORG_OWNER',
    joined_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'admin@example.com',
    full_name: 'Jane Smith',
    role: 'ORG_ADMIN',
    joined_at: '2024-02-01T10:00:00Z'
  },
  {
    id: '3',
    email: 'member@example.com',
    full_name: 'Mike Wilson',
    role: 'MEMBER',
    joined_at: '2024-02-15T10:00:00Z'
  }
];

const mockInvitations: OrganizationInvitation[] = [
  {
    id: '1',
    email: 'pending@example.com',
    role: 'MEMBER',
    token: 'abc123xyz',
    is_expired: false,
    created_at: '2024-03-01T10:00:00Z',
    expired_at: '2024-03-08T10:00:00Z',
    invited_by: {
      id: '1',
      email: 'owner@example.com',
      full_name: 'John Doe'
    }
  }
];

export default function TeamPage() {
  const [isPending, startTransition] = useTransition();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [invitations, setInvitations] = useState(mockInvitations);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ORG_OWNER':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'ORG_ADMIN':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-slate-600" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ORG_OWNER':
        return 'Owner';
      case 'ORG_ADMIN':
        return 'Admin';
      default:
        return 'Member';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ORG_OWNER':
        return 'bg-yellow-100 text-yellow-700';
      case 'ORG_ADMIN':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const formatJoinDate = (joinedAt: string) => {
    return new Date(joinedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInviteTeamMember = async (invitationData: { email: string; role: string; message?: string }) => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call
        console.log('Inviting team member:', invitationData);
        
        // Mock successful invitation
        const newInvitation: OrganizationInvitation = {
          id: Date.now().toString(),
          email: invitationData.email,
          role: invitationData.role,
          token: Math.random().toString(36).substring(7),
          is_expired: false,
          created_at: new Date().toISOString(),
          expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          invited_by: {
            id: '1',
            email: 'owner@example.com',
            full_name: 'John Doe'
          }
        };

        setInvitations(prev => [...prev, newInvitation]);
        setShowInviteModal(false);
      } catch (error) {
        console.error('Failed to invite team member:', error);
      }
    });
  };

  const handleRemoveTeamMember = async (memberId: string) => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call
        console.log('Removing team member:', memberId);
        setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('Failed to remove team member:', error);
      }
    });
  };

  const handleResendInvitation = async (invitationId: string) => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call
        console.log('Resending invitation:', invitationId);
      } catch (error) {
        console.error('Failed to resend invitation:', error);
      }
    });
  };

  const handleCancelInvitation = async (invitationId: string) => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call
        console.log('Canceling invitation:', invitationId);
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      } catch (error) {
        console.error('Failed to cancel invitation:', error);
      }
    });
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    // TODO: Show toast notification
    console.log('Invite link copied to clipboard');
  };

  const getMemberToRemove = () => {
    return teamMembers.find(member => member.id === showRemoveDialog);
  };

  const adminCount = teamMembers.filter(m => m.role === 'ORG_ADMIN' || m.role === 'ORG_OWNER').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Team</h1>
            <p className="text-slate-600 mt-2">Manage your organization members and invitations</p>
          </div>
          <Button 
            onClick={() => setShowInviteModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Members</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{teamMembers.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Invites</CardTitle>
              <Mail className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{invitations.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{adminCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-slate-700" />
              <span>Team Members</span>
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                {teamMembers.length}
              </span>
            </CardTitle>
            <CardDescription>
              Current members of your organization
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {(member.full_name || member.email).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-1 ring-white"></div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">
                          {member.full_name || member.email}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(member.role)}`}>
                          {getRoleLabel(member.role)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-slate-600">{member.email}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          Joined {formatJoinDate(member.joined_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {member.role !== 'ORG_OWNER' && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActionMenuOpen(
                          actionMenuOpen === member.id ? null : member.id
                        )}
                        className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>

                      {actionMenuOpen === member.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                // TODO: Implement change role
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <Settings className="h-3 w-3" />
                              <span>Change Role</span>
                            </button>
                            <button
                              onClick={() => {
                                // TODO: Implement send message
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                            >
                              <Mail className="h-3 w-3" />
                              <span>Send Message</span>
                            </button>
                            <button
                              onClick={() => {
                                setShowRemoveDialog(member.id);
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove Member</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invitations */}
        <PendingInvitations
          invitations={invitations}
          onResendInvitation={handleResendInvitation}
          onCancelInvitation={handleCancelInvitation}
          onCopyInviteLink={handleCopyInviteLink}
        />

        {/* Invite Team Member Modal */}
        <InviteTeamMemberModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteTeamMember}
        />

        {/* Remove Member Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!showRemoveDialog}
          onClose={() => setShowRemoveDialog(null)}
          onConfirm={() => {
            if (showRemoveDialog) {
              handleRemoveTeamMember(showRemoveDialog);
              setShowRemoveDialog(null);
            }
          }}
          title="Remove Team Member"
          description={`Are you sure you want to remove "${getMemberToRemove()?.full_name || getMemberToRemove()?.email}" from your organization? This action cannot be undone.`}
          confirmText="Remove Member"
          cancelText="Cancel"
          variant="destructive"
        />

        {/* Click outside to close menu */}
        {actionMenuOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setActionMenuOpen(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
