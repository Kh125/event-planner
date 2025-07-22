'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, MapPin, Phone, Calendar } from 'lucide-react';

export default function AttendeeRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    date_of_birth: '',
    city: '',
    country: '',
    interests: ''
  });

  const validateForm = () => {
    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Name, email, and password are required');
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
      // TODO: Replace with actual API call
      console.log('Attendee registration:', formData);
      
      const response = await fetch('/api/auth/register/attendee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          city: formData.city,
          country: formData.country,
          interests: formData.interests
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Join as Attendee</h1>
          <p className="text-slate-600 mt-2">Create your account to discover and attend amazing events</p>
        </div>

        {/* Registration Card */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Fill in your details to get started with event discovery
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="pl-10"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
                  Personal Details (Optional)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="New York"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">Interests & Preferences</Label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-slate-200 focus:border-slate-300 resize-none"
                    rows={3}
                    placeholder="Tell us about your interests (e.g., technology, music, sports, networking...)"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Terms and Privacy */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/legal/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/legal/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
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
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">Looking to create an organization?</p>
              <Link href="/auth/register/owner">
                <Button variant="outline" className="w-full">
                  Start Your Organization Instead
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
