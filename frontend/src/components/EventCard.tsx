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
    <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
          event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {event.status}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 mb-5 line-clamp-2">{event.description}</p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-slate-600">
          <div className="bg-blue-100 p-1.5 rounded-md mr-3">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
          </div>
          {formatDateTime(event.date)}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <div className="bg-emerald-100 p-1.5 rounded-md mr-3">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          {event.location}
        </div>
        <div className="flex items-center text-sm text-slate-600">
          <div className="bg-orange-100 p-1.5 rounded-md mr-3">
            <Users className="h-3.5 w-3.5 text-orange-600" />
          </div>
          {event.registered}/{event.capacity} registered
        </div>
      </div>
      
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        {isAdmin ? (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(event.id)}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm"
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete?.(event.id)}
              className="flex-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 shadow-sm"
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
            className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          >
            {isFullyBooked ? 'Fully Booked' : 
             !isUpcoming ? 'Registration Closed' : 'Register'}
          </Button>
        )}
      </div>
    </div>
  );
}
