'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      console.log('Verifying email:', { email, verificationCode });
      
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verification_code: verificationCode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      console.log('Resending verification code for:', email);
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('Verification code sent! Please check your email.');
        setTimeLeft(300); // Reset timer
        setTimeout(() => setSuccess(''), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Resend error:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-600 h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Email</h1>
          <p className="text-slate-600 mt-2">
            We've sent a verification code to{' '}
            <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>

        {/* Verification Card */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              Please enter the 6-digit code from your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (error) setError('');
                  }}
                  className="text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Code expires in{' '}
                  <span className="font-medium text-slate-900">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Email'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resend Code */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">Didn't receive the code?</p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleResendCode}
                  disabled={resending || timeLeft > 240} // Can resend after 1 minute
                  className="w-full"
                >
                  {resending ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {timeLeft > 240 ? `Resend in ${formatTime(timeLeft - 240)}` : 'Resend Code'}
                    </>
                  )}
                </Button>

                <div className="text-xs text-slate-500 space-y-1">
                  <p>• Check your spam/junk folder</p>
                  <p>• Make sure {email} is correct</p>
                  <p>• Wait a few minutes for the email to arrive</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Wrong email address?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
