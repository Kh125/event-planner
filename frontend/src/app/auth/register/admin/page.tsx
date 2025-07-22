'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/services/authService';
import { Eye, EyeOff, Mail, Lock, User, Shield, Building, AlertTriangle } from 'lucide-react';

export default function AdminRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [inviteData, setInviteData] = useState<any>(null);
  const [validatingToken, setValidatingToken] = useState(true);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid invitation link. Admin registration requires a valid invitation.');
      setValidatingToken(false);
      return;
    }

    setInviteToken(token);
    validateInviteToken(token);
  }, [searchParams]);

  const validateInviteToken = async (token: string) => {
    try {
      // TODO: Replace with actual API call to validate token
      const response = await fetch(`/api/auth/validate-invite/${token}`);
      
      if (response.ok) {
        const data = await response.json();
        setInviteData(data);
        setFormData(prev => ({
          ...prev,
          email: data.email // Pre-fill email from invitation
        }));
        setValidatingToken(false);
      } else {
        setError('Invalid or expired invitation link.');
        setValidatingToken(false);
      }
    } catch (err) {
      setError('Failed to validate invitation. Please try again.');
      setValidatingToken(false);
    }
  };

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await AuthService.registerAdmin({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        invite_token: inviteToken
      });

      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
              <p className="text-slate-600">Validating invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!inviteData && !validatingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600 h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Invalid Invitation</h1>
            <p className="text-slate-600 mt-2">This invitation link is invalid or has expired</p>
          </div>

          <Card className="border border-red-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Admin registration is only available through valid invitation links.
                </p>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Link href="/auth/login">
                    <Button className="w-full">Go to Login</Button>
                  </Link>
                  <Link href="/auth/register/owner">
                    <Button variant="outline" className="w-full">Register as Organization Owner</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Registration</h1>
          <p className="text-slate-600 mt-2">Complete your admin account setup</p>
        </div>

        {/* Invitation Info */}
        {inviteData && (
          <Card className="border border-blue-200 bg-blue-50 shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Invitation to {inviteData.organization_name}
                  </h4>
                  <p className="text-xs text-blue-800 mt-1">
                    You've been invited by {inviteData.invited_by} to join as an admin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Card */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Complete Your Registration</CardTitle>
            <CardDescription>
              Create your admin account to start managing events
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-slate-50"
                    placeholder="john@company.com"
                    disabled={!!inviteData?.email} // Disable if pre-filled from invitation
                    required
                  />
                </div>
                {inviteData?.email && (
                  <p className="text-xs text-slate-500">This email was specified in your invitation</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Admin Role Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-slate-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Admin Permissions</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      As an admin, you'll be able to manage events, invite team members, and handle organization settings.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Link href="/auth/login">
                  <Button type="button" variant="outline">
                    Back to Login
                  </Button>
                </Link>
                
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            This registration is only available through a valid admin invitation.
          </p>
        </div>
      </div>
    </div>
  );
}
