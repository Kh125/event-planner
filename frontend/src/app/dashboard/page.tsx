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
                <div key={event.id} className="group flex items-center justify-between p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 rounded-xl transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.status === 'upcoming' ? 'bg-blue-50' :
                      event.status === 'ongoing' ? 'bg-emerald-50' :
                      'bg-slate-50'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        event.status === 'upcoming' ? 'text-blue-600' :
                        event.status === 'ongoing' ? 'text-emerald-600' :
                        'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="font-medium text-slate-900">{event.title}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          event.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                          event.status === 'ongoing' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-slate-50 text-slate-700'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm text-slate-600">{event.date}</p>
                        <span className="text-xs text-slate-400">{event.attendees} attendees</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm transition-all duration-200"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
