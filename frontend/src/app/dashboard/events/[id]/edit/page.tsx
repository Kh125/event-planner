'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Save, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const EventStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
} as const;

const RegistrationType = {
  OPEN: 'open',
  INVITATION_ONLY: 'invitation_only',
  APPROVAL_REQUIRED: 'approval_required'
} as const;

// Mock data - in real app this would come from API
const mockEventData = {
  '1': {
    name: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders.',
    start_datetime: '2024-06-15T09:00',
    end_datetime: '2024-06-17T18:00',
    capacity: '500',
    venue_name: 'San Francisco Convention Center',
    venue_address: '747 Howard St, San Francisco, CA 94103, USA',
    timezone: 'America/Los_Angeles',
    status: 'published',
    is_public: true,
    registration_type: 'open',
    registration_opens: '2024-03-01T00:00',
    registration_closes: '2024-06-10T23:59',
    requires_approval: false
  }
};

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_datetime: '',
    end_datetime: '',
    capacity: '',
    venue_name: '',
    venue_address: '',
    timezone: 'UTC',
    status: EventStatus.DRAFT,
    is_public: false,
    registration_type: RegistrationType.OPEN,
    registration_opens: '',
    registration_closes: '',
    requires_approval: false
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In real app, fetch event data from API
    const eventData = mockEventData[eventId as keyof typeof mockEventData];
    if (eventData) {
      setFormData({
        name: eventData.name,
        description: eventData.description,
        start_datetime: eventData.start_datetime,
        end_datetime: eventData.end_datetime,
        capacity: eventData.capacity,
        venue_name: eventData.venue_name,
        venue_address: eventData.venue_address,
        timezone: eventData.timezone,
        status: eventData.status as typeof EventStatus.DRAFT,
        is_public: eventData.is_public,
        registration_type: eventData.registration_type as typeof RegistrationType.OPEN,
        registration_opens: eventData.registration_opens,
        registration_closes: eventData.registration_closes,
        requires_approval: eventData.requires_approval
      });
    }
    setLoading(false);
  }, [eventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent, isDraft = true) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      status: isDraft ? EventStatus.DRAFT : EventStatus.PUBLISHED
    };
    console.log('Updating event:', finalData);
    // Here you would make the API call to update the event
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleBackToEvent = () => {
    router.push(`/dashboard/events/${eventId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading event data...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToEvent}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
              <p className="text-slate-600 mt-2">Update your event details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={(e) => handleSubmit(e, true)}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              onClick={(e) => handleSubmit(e, false)}
              className="bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Update & Publish
            </Button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-8">
          {/* Basic Information */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-slate-700" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Essential details about your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 resize-none"
                    placeholder="Describe your event..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-700" />
                <span>Date & Time</span>
              </CardTitle>
              <CardDescription>
                When your event will take place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="start_datetime"
                    value={formData.start_datetime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="end_datetime"
                    value={formData.end_datetime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Europe/Paris">Central European Time</option>
                  <option value="Asia/Tokyo">Japan Standard Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Capacity */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-slate-700" />
                <span>Location & Capacity</span>
              </CardTitle>
              <CardDescription>
                Where your event will be held and how many can attend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Venue Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                    placeholder="e.g., Convention Center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                    placeholder="Maximum attendees"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Venue Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="venue_address"
                  value={formData.venue_address}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200 resize-none"
                  placeholder="Enter the full venue address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Registration Settings */}
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-slate-700" />
                <span>Registration Settings</span>
              </CardTitle>
              <CardDescription>
                Control who can register and how
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Type
                  </label>
                  <select
                    name="registration_type"
                    value={formData.registration_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                  >
                    <option value={RegistrationType.OPEN}>Open Registration</option>
                    <option value={RegistrationType.INVITATION_ONLY}>Invitation Only</option>
                    <option value={RegistrationType.APPROVAL_REQUIRED}>Approval Required</option>
                  </select>
                </div>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-200 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-700">Public Event</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="requires_approval"
                      checked={formData.requires_approval}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-200 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-slate-700">Requires Approval</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Opens
                  </label>
                  <input
                    type="datetime-local"
                    name="registration_opens"
                    value={formData.registration_opens}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to open immediately</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Closes
                  </label>
                  <input
                    type="datetime-local"
                    name="registration_closes"
                    value={formData.registration_closes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-1">Leave empty to keep open until event starts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleCancel}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="outline" 
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Update & Publish
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
