'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
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
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Events</h1>
            <p className="text-slate-600 mt-3 text-lg">Manage and organize your events</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Events</p>
                <p className="text-3xl font-bold text-slate-900">{events.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Attendees</p>
                <p className="text-3xl font-bold text-slate-900">
                  {events.reduce((total, event) => total + event.registered, 0)}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Upcoming</p>
                <p className="text-3xl font-bold text-slate-900">{upcomingEvents.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Upcoming Events</h2>
            <p className="text-slate-600">Events scheduled for the future</p>
          </div>
          
          <div className="px-6 pb-6">
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
          </div>
        </div>

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Completed Events</h2>
              <p className="text-slate-600">Past events and their results</p>
            </div>
            
            <div className="px-6 pb-6">
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
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
