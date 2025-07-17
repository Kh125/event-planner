'use client';

import { Event } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Button } from './ui/button';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  isAdmin?: boolean;
}

export function EventCard({ event, onRegister, onEdit, onDelete, isAdmin }: EventCardProps) {
  const isUpcoming = event.status === 'upcoming';
  const isFullyBooked = event.registered >= event.capacity;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          event.status === 'upcoming' ? 'bg-blue-50/80 text-blue-700 border-blue-200' :
          event.status === 'ongoing' ? 'bg-green-50/80 text-green-700 border-green-200' :
          'bg-gray-50/80 text-gray-700 border-gray-200'
        }`}>
          {event.status}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">📅</span>
          {formatDateTime(event.date)}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">📍</span>
          {event.location}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">👥</span>
          {event.registered}/{event.capacity} registered
        </div>
      </div>
      
      <div className="flex gap-2">
        {isAdmin ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(event.id)}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete?.(event.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onRegister?.(event.id)}
            disabled={!isUpcoming || isFullyBooked}
            className="w-full"
          >
            {isFullyBooked ? 'Fully Booked' : 
             !isUpcoming ? 'Registration Closed' : 'Register'}
          </Button>
        )}
      </div>
    </div>
  );
}
