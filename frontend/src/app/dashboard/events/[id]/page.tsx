'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  Shield, 
  ArrowLeft, 
  Edit, 
  Share2, 
  Download,
  UserCheck,
  UserX,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock3,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data - in real app this would come from API
const eventData = {
  id: '1',
  name: 'Tech Conference 2024',
  slug: 'tech-conference-2024',
  description: 'Join us for the biggest tech conference of the year! Connect with industry leaders, learn about cutting-edge technologies, and network with fellow developers and entrepreneurs. This three-day event will feature keynote speakers, workshops, and networking sessions.',
  start_datetime: '2024-06-15T09:00:00',
  end_datetime: '2024-06-17T18:00:00',
  duration_days: 3,
  duration_hours: 0,
  capacity: 500,
  venue_name: 'San Francisco Convention Center',
  venue_address: '747 Howard St, San Francisco, CA 94103, USA',
  timezone: 'America/Los_Angeles',
  status: 'published',
  is_public: true,
  registration_type: 'open',
  registration_opens: '2024-03-01T00:00:00',
  registration_closes: '2024-06-10T23:59:59',
  requires_approval: false,
  created_by: 'John Doe',
  created_at: '2024-02-15T10:30:00'
};

const attendeeStats = {
  total_registered: 342,
  confirmed: 298,
  pending: 32,
  rejected: 12,
  available_spots: 158
};

const recentAttendees = [
  {
    id: '1',
    full_name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'confirmed',
    registered_at: '2024-03-20T14:30:00'
  },
  {
    id: '2',
    full_name: 'Mike Chen',
    email: 'mike@example.com',
    status: 'pending',
    registered_at: '2024-03-20T13:15:00'
  },
  {
    id: '3',
    full_name: 'Emily Davis',
    email: 'emily@example.com',
    status: 'confirmed',
    registered_at: '2024-03-20T11:45:00'
  },
  {
    id: '4',
    full_name: 'Alex Rodriguez',
    email: 'alex@example.com',
    status: 'rejected',
    registered_at: '2024-03-20T10:20:00'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case 'pending':
      return <Clock3 className="h-4 w-4 text-orange-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-slate-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-700';
    case 'pending':
      return 'bg-orange-50 text-orange-700';
    case 'rejected':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-slate-50 text-slate-700';
  }
};

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function EventDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleEditEvent = () => {
    // Navigate to edit page (you can create this later)
    console.log('Edit event');
  };

  const handleShareEvent = () => {
    console.log('Share event');
  };

  const handleDownloadAttendees = () => {
    console.log('Download attendees list');
  };

  const handleBackToEvents = () => {
    router.push('/dashboard/events');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToEvents}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{eventData.name}</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  eventData.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-700'
                }`}>
                  {eventData.status}
                </span>
              </div>
              <p className="text-slate-600">Event details and management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={handleShareEvent}
              className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              onClick={handleEditEvent}
              className="bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 transition-all duration-200"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'attendees', label: 'Attendees' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Information */}
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Event Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{eventData.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Start Date</p>
                          <p className="text-slate-600">{formatDateTime(eventData.start_datetime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Duration</p>
                          <p className="text-slate-600">{eventData.duration_days} days</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Capacity</p>
                          <p className="text-slate-600">{eventData.capacity} attendees</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">End Date</p>
                          <p className="text-slate-600">{formatDateTime(eventData.end_datetime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Venue</p>
                          <p className="text-slate-600">{eventData.venue_name}</p>
                          <p className="text-slate-500 text-sm">{eventData.venue_address}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Globe className="h-5 w-5 text-slate-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-slate-900">Visibility</p>
                          <p className="text-slate-600">{eventData.is_public ? 'Public Event' : 'Private Event'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Registration Stats */}
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Registration Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">{attendeeStats.total_registered}</p>
                      <p className="text-sm text-slate-600">Total Registered</p>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-900">{attendeeStats.confirmed}</p>
                      <p className="text-sm text-emerald-600">Confirmed</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-900">{attendeeStats.pending}</p>
                      <p className="text-sm text-orange-600">Pending</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-900">{attendeeStats.available_spots}</p>
                      <p className="text-sm text-blue-600">Available</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(attendeeStats.total_registered / eventData.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 text-center">
                      {Math.round((attendeeStats.total_registered / eventData.capacity) * 100)}% Full
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
                    onClick={handleDownloadAttendees}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Attendee List
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Invitations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Event Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'attendees' && (
          <div className="space-y-6">
            {/* Attendee Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Event Attendees</h2>
              <div className="flex items-center space-x-3">              <Button 
                variant="outline" 
                onClick={handleDownloadAttendees}
                className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:scale-105 transition-all duration-200"
              >
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white hover:scale-105 transition-all duration-200">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Attendee
              </Button>
              </div>
            </div>

            {/* Recent Attendees */}
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Recent Registrations</CardTitle>
                <CardDescription>Latest people who registered for your event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {attendee.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <p className="font-medium text-slate-900">{attendee.full_name}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(attendee.status)}`}>
                              {getStatusIcon(attendee.status)}
                              <span className="ml-1">{attendee.status}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-sm text-slate-600">{attendee.email}</p>
                            <span className="text-xs text-slate-400">
                              {formatDateTime(attendee.registered_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {attendee.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-emerald-600 hover:bg-emerald-50 border-emerald-200 hover:scale-105 transition-all duration-200">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200 hover:scale-105 transition-all duration-200">
                              <UserX className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Event Settings</h2>
            
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle>Registration Settings</CardTitle>
                <CardDescription>Control how people can register for your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Registration Type
                    </label>
                    <p className="text-slate-900 capitalize">{eventData.registration_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Event Visibility
                    </label>
                    <p className="text-slate-900">{eventData.is_public ? 'Public' : 'Private'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Registration Opens
                    </label>
                    <p className="text-slate-900">{formatDateTime(eventData.registration_opens)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Registration Closes
                    </label>
                    <p className="text-slate-900">{formatDateTime(eventData.registration_closes)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
