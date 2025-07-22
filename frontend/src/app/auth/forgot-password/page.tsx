'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      console.log('Password reset requested for:', email);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600 h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Check Your Email</h1>
            <p className="text-slate-600 mt-2">
              We've sent a password reset link to{' '}
              <span className="font-medium text-slate-900">{email}</span>
            </p>
          </div>

          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Click the link in the email to reset your password. The link will expire in 15 minutes.
                </p>
                
                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Check your spam/junk folder if you don't see it</p>
                  <p>• The email may take a few minutes to arrive</p>
                  <p>• Make sure {email} is the correct email address</p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={() => setSent(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Try Different Email
                  </Button>
                  
                  <Link href="/auth/login">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800">
                      Back to Login
                    </Button>
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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-600 h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
          <p className="text-slate-600 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Reset Form */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">
              Enter the email address associated with your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
