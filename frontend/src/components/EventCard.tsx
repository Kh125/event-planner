'use client';

import { Event } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Button } from './ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

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
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
          event.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
          event.status === 'ongoing' ? 'bg-green-50 text-green-700 border-green-200' :
          'bg-gray-50 text-gray-700 border-gray-200'
        }`}>
          {event.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDateTime(event.date)}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2" />
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
