'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Mail, UserPlus, Calendar, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface InviteTeamMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (invitationData: InvitationData) => Promise<void>;
}

interface InvitationData {
  email: string;
  role: string;
  message?: string;
}

const ROLES = {
  ORG_ADMIN: 'org_admin',
  MEMBER: 'member'
} as const;

const ROLE_OPTIONS = [
  {
    value: ROLES.ORG_ADMIN,
    label: 'Organization Admin',
    description: 'Can manage events, team members, and organization settings'
  },
  {
    value: ROLES.MEMBER,
    label: 'Member',
    description: 'Can create and manage events'
  }
];

export function InviteTeamMemberModal({ isOpen, onClose, onInvite }: InviteTeamMemberProps) {
  const [formData, setFormData] = useState<InvitationData>({
    email: '',
    role: ROLES.MEMBER,
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onInvite(formData);
      handleClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', role: ROLES.MEMBER, message: '' });
    setErrors({});
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 bg-white border border-slate-200 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-slate-900">Invite Team Member</CardTitle>
                <CardDescription className="text-slate-600">
                  Send an invitation to join your organization
                </CardDescription>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'
                  }`}
                  placeholder="colleague@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {ROLE_OPTIONS.map((role) => (
                  <label
                    key={role.value}
                    className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.role === role.value
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-200"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-900">{role.label}</div>
                      <div className="text-xs text-slate-600 mt-1">{role.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Optional Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 resize-none"
                placeholder="Welcome to our team! We're excited to have you join us..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-slate-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Invitation Details</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    The invitation will be valid for 7 days. The recipient will receive an email with a link to join your organization.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
