'use client';

import { Header } from '@/components/Header';
import { EventCard } from '@/components/EventCard';
import { Event } from '@/types';

// Sample data for demonstration
const sampleEvents: Event[] = [
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
  }
];

export default function EventsPage() {
  const handleRegister = (eventId: string) => {
    console.log('Register for event:', eventId);
    // TODO: Implement registration logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
          <p className="text-gray-600">
            Discover and register for amazing events happening near you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
