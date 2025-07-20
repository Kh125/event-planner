'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Building, TrendingUp, Plus } from 'lucide-react';

// Sample data
const stats = [
  {
    title: 'Total Events',
    value: '12',
    change: '+2 from last month',
    icon: Calendar,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Active Attendees',
    value: '1,234',
    change: '+15% from last month',
    icon: Users,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Organizations',
    value: '8',
    change: '+1 from last month',
    icon: Building,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '+2.1% from last month',
    icon: TrendingUp,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

const recentEvents = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    date: '2024-03-15',
    attendees: 245,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Design Workshop',
    date: '2024-02-28',
    attendees: 35,
    status: 'ongoing',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    date: '2024-02-20',
    attendees: 180,
    status: 'completed',
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-3 text-lg">Welcome back! Here's what's happening with your events.</p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-emerald-600 mt-1 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-full`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Recent Events</h2>
            <p className="text-slate-600">Your latest events and their performance</p>
          </div>
          
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {recentEvents.map((event, index) => (
                <div key={event.id} className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center space-x-5">
                    <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center ${
                      event.status === 'upcoming' ? 'bg-blue-100' :
                      event.status === 'ongoing' ? 'bg-emerald-100' :
                      'bg-slate-100'
                    }`}>
                      <Calendar className={`h-7 w-7 ${
                        event.status === 'upcoming' ? 'text-blue-600' :
                        event.status === 'ongoing' ? 'text-emerald-600' :
                        'text-slate-600'
                      }`} />
                      {event.status === 'ongoing' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">{event.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          event.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6">
                        <p className="text-sm text-slate-600 font-medium">{event.date}</p>
                        <div className="flex items-center space-x-1.5">
                          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          <p className="text-sm text-slate-600 font-medium">{event.attendees} attendees</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
