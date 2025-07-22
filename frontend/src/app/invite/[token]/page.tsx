'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganizationInvitation } from '@/types';
import { 
  CheckCircle, 
  XCircle, 
  Users, 
  Building, 
  Crown, 
  Shield, 
  User,
  Loader2,
  Mail
} from 'lucide-react';

interface InvitationDetails {
  id: string;
  email: string;
  role: string;
  token: string;
  is_expired: boolean;
  created_at: string;
  expired_at: string;
  invited_by: {
    id: string;
    email: string;
    full_name?: string;
  };
  organization: {
    id: string;
    name: string;
    description?: string;
  };
}

export default function InviteAcceptPage() {
  const params = useParams();
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    password: '',
    confirmPassword: ''
  });

  const token = params.token as string;

  useEffect(() => {
    if (token) {
      fetchInvitationDetails();
    }
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      console.log('Fetching invitation details for token:', token);
      
      // Mock invitation details
      const mockInvitation: InvitationDetails = {
        id: '1',
        email: 'newmember@example.com',
        role: 'MEMBER',
        token: token,
        is_expired: false,
        created_at: '2024-03-01T10:00:00Z',
        expired_at: '2024-03-08T10:00:00Z',
        invited_by: {
          id: '1',
          email: 'owner@example.com',
          full_name: 'John Doe'
        },
        organization: {
          id: '1',
          name: 'TechCorp Events',
          description: 'Leading event management company'
        }
      };

      setTimeout(() => {
        setInvitation(mockInvitation);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load invitation details');
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setAccepting(true);
      setError(null);
      
      // TODO: Replace with actual API call
      console.log('Accepting invitation:', {
        token,
        full_name: formData.full_name,
        password: formData.password
      });

      // Mock successful acceptance
      setTimeout(() => {
        router.push('/dashboard?invitation=accepted');
      }, 2000);
    } catch (err) {
      setError('Failed to accept invitation');
      setAccepting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ORG_OWNER':
        return <Crown className="h-5 w-5 text-yellow-600" />;
      case 'ORG_ADMIN':
        return <Shield className="h-5 w-5 text-blue-600" />;
      default:
        return <User className="h-5 w-5 text-slate-600" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Loading invitation...</h3>
              <p className="text-slate-600">Please wait while we verify your invitation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Invalid Invitation</h3>
              <p className="text-slate-600 mb-6">
                This invitation link is invalid or has expired.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) return null;

  if (invitation.is_expired || new Date(invitation.expired_at) < new Date()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Invitation Expired</h3>
              <p className="text-slate-600 mb-6">
                This invitation has expired. Please contact {invitation.invited_by.full_name || invitation.invited_by.email} for a new invitation.
              </p>
              <Button 
                onClick={() => router.push('/')}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Join {invitation.organization.name}</CardTitle>
          <CardDescription>
            You've been invited to join the team as a {getRoleLabel(invitation.role)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Invitation Details */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Organization</span>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-slate-900">{invitation.organization.name}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Role</span>
              <div className="flex items-center space-x-2">
                {getRoleIcon(invitation.role)}
                <span className="font-medium text-slate-900">{getRoleLabel(invitation.role)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Invited by</span>
              <span className="font-medium text-slate-900">
                {invitation.invited_by.full_name || invitation.invited_by.email}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Email</span>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-slate-900">{invitation.email}</span>
              </div>
            </div>
          </div>

          {/* Accept Form */}
          <form onSubmit={handleAcceptInvitation} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a secure password"
                required
                minLength={8}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1"
                disabled={accepting}
              >
                Decline
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={accepting}
              >
                {accepting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Invitation
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="text-xs text-slate-500 text-center">
            By accepting this invitation, you agree to join {invitation.organization.name} and 
            collaborate on their events and projects.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
