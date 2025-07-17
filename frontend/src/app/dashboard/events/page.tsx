'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/components/EventCard';
import { Event } from '@/types';
import { Plus, Calendar, Users, Clock } from 'lucide-react';

// Sample events data
const events: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring talks from industry leaders.',
    date: '2024-03-15T09:00:00Z',
    location: 'San Francisco Convention Center',
    capacity: 500,
    registered: 245,
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    description: 'Watch emerging startups pitch their ideas to investors and industry experts.',
    date: '2024-02-28T18:00:00Z',
    location: 'Innovation Hub Downtown',
    capacity: 200,
    registered: 180,
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z'
  },
  {
    id: '3',
    title: 'Design Workshop',
    description: 'Hands-on workshop covering modern design principles and tools.',
    date: '2024-02-20T10:00:00Z',
    location: 'Creative Studio',
    capacity: 50,
    registered: 35,
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z'
  },
  {
    id: '4',
    title: 'Marketing Webinar',
    description: 'Learn the latest marketing strategies and techniques from industry experts.',
    date: '2024-01-20T14:00:00Z',
    location: 'Online',
    capacity: 100,
    registered: 100,
    status: 'completed',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T09:00:00Z'
  }
];

export default function EventsPage() {
  const handleRegister = (eventId: string) => {
    console.log('Register for event:', eventId);
  };

  const handleEdit = (eventId: string) => {
    console.log('Edit event:', eventId);
  };

  const handleDelete = (eventId: string) => {
    console.log('Delete event:', eventId);
  };

  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const completedEvents = events.filter(event => event.status === 'completed');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-600">Manage and organize your events</p>
          </div>
          <Button className="bg-slate-600 hover:bg-slate-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50/50 to-white border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50/50 to-white border-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {events.reduce((total, event) => total + event.registered, 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/50 to-white border-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled for the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegister={handleRegister}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Events</CardTitle>
              <CardDescription>Past events and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isAdmin={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
