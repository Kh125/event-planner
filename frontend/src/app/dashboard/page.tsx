'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Building, TrendingUp, Plus } from 'lucide-react';

// Sample data
const stats = [
  {
    title: 'Total Events',
    value: '12',
    change: '+2 from last month',
    icon: Calendar,
    color: 'text-blue-600',
  },
  {
    title: 'Active Attendees',
    value: '1,234',
    change: '+15% from last month',
    icon: Users,
    color: 'text-green-600',
  },
  {
    title: 'Organizations',
    value: '8',
    change: '+1 from last month',
    icon: Building,
    color: 'text-purple-600',
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '+2.1% from last month',
    icon: TrendingUp,
    color: 'text-emerald-600',
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
          </div>
          <Button className="bg-slate-600 hover:bg-slate-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className={`${
              index === 0 ? 'bg-gradient-to-br from-blue-50/50 to-white border-blue-100' :
              index === 1 ? 'bg-gradient-to-br from-green-50/50 to-white border-green-100' :
              index === 2 ? 'bg-gradient-to-br from-purple-50/50 to-white border-purple-100' :
              'bg-gradient-to-br from-orange-50/50 to-white border-orange-100'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Your latest events and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div key={event.id} className={`flex items-center justify-between p-4 rounded-lg ${
                  index % 3 === 0 ? 'bg-gradient-to-r from-blue-50/50 to-white border border-blue-100' :
                  index % 3 === 1 ? 'bg-gradient-to-r from-green-50/50 to-white border border-green-100' :
                  'bg-gradient-to-r from-purple-50/50 to-white border border-purple-100'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      index % 3 === 0 ? 'bg-blue-100' :
                      index % 3 === 1 ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        index % 3 === 0 ? 'text-blue-600' :
                        index % 3 === 1 ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{event.attendees} attendees</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
