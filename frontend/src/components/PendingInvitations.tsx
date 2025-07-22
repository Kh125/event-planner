'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { OrganizationInvitation } from '@/types';
import { Mail, Clock, User, MoreVertical, Copy, Trash2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface PendingInvitationsProps {
  invitations: OrganizationInvitation[];
  onResendInvitation: (invitationId: string) => void;
  onCancelInvitation: (invitationId: string) => void;
  onCopyInviteLink: (token: string) => void;
}

export function PendingInvitations({ 
  invitations, 
  onResendInvitation, 
  onCancelInvitation, 
  onCopyInviteLink 
}: PendingInvitationsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const formatTimeRemaining = (expiredAt: string) => {
    const now = new Date();
    const expiry = new Date(expiredAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Expires soon';
  };

  const getInvitationToCancel = () => {
    return invitations.find(inv => inv.id === showCancelDialog);
  };

  if (invitations.length === 0) {
    return (
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardContent className="py-12">
          <div className="text-center">
            <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No pending invitations</h3>
            <p className="text-slate-600">
              Invite team members to start collaborating on events together.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-slate-700" />
            <span>Pending Invitations</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
              {invitations.length}
            </span>
          </CardTitle>
          <CardDescription>
            Manage invitations sent to potential team members
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{invitation.email}</h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-slate-600">
                        Invited by {invitation.invited_by.full_name || invitation.invited_by.email}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        invitation.is_expired 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {formatTimeRemaining(invitation.expired_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Quick Actions */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyInviteLink(invitation.token)}
                    className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Link
                  </Button>

                  {/* More Actions Menu */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionMenuOpen(
                        actionMenuOpen === invitation.id ? null : invitation.id
                      )}
                      className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>

                    {actionMenuOpen === invitation.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onResendInvitation(invitation.id);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Resend Invitation</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowCancelDialog(invitation.id);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Cancel Invitation</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!showCancelDialog}
        onClose={() => setShowCancelDialog(null)}
        onConfirm={() => {
          if (showCancelDialog) {
            onCancelInvitation(showCancelDialog);
            setShowCancelDialog(null);
          }
        }}
        title="Cancel Invitation"
        description={`Are you sure you want to cancel the invitation for "${getInvitationToCancel()?.email}"? This action cannot be undone.`}
        confirmText="Cancel Invitation"
        cancelText="Keep Invitation"
        variant="destructive"
      />

      {/* Click outside to close menu */}
      {actionMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActionMenuOpen(null)}
        />
      )}
    </>
  );
}
