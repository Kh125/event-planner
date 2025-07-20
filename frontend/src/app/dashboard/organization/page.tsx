'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Building, Users, Calendar, Settings, TrendingUp } from 'lucide-react';

export default function OrganizationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Organization</h1>
            <p className="text-slate-600 mt-3 text-lg">Manage your organization settings and information</p>
          </div>
          <Button variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Organization Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Organization Information</h2>
            <p className="text-slate-600">Basic information about your organization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">
                Organization Name
              </label>
              <p className="text-xl font-bold text-slate-900">Tech Events Inc.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">
                Industry
              </label>
              <p className="text-xl text-slate-900">Technology & Events</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">
                Location
              </label>
              <p className="text-xl text-slate-900">San Francisco, CA</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500 uppercase tracking-wide">
                Founded
              </label>
              <p className="text-xl text-slate-900">2020</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Members</p>
                <p className="text-3xl font-bold text-slate-900">24</p>
                <p className="text-sm text-emerald-600 mt-1 font-medium">+3 from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Events Hosted</p>
                <p className="text-3xl font-bold text-slate-900">156</p>
                <p className="text-sm text-emerald-600 mt-1 font-medium">+12 from last month</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-slate-900">98.5%</p>
                <p className="text-sm text-emerald-600 mt-1 font-medium">+2.1% from last month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Recent Activity</h2>
            <p className="text-slate-600">Latest organizational updates and changes</p>
          </div>
          
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div className="group flex items-center space-x-4 p-5 bg-slate-50/50 rounded-xl hover:bg-slate-100/70 transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">New team member added</p>
                  <p className="text-sm text-slate-600 mt-1">Sarah Johnson joined as Event Coordinator</p>
                  <p className="text-xs text-slate-500 mt-2">2 hours ago</p>
                </div>
              </div>

              <div className="group flex items-center space-x-4 p-5 bg-slate-50/50 rounded-xl hover:bg-slate-100/70 transition-all duration-200">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Event published</p>
                  <p className="text-sm text-slate-600 mt-1">Tech Conference 2024 is now live</p>
                  <p className="text-xs text-slate-500 mt-2">1 day ago</p>
                </div>
              </div>

              <div className="group flex items-center space-x-4 p-5 bg-slate-50/50 rounded-xl hover:bg-slate-100/70 transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Organization settings updated</p>
                  <p className="text-sm text-slate-600 mt-1">Updated organization profile information</p>
                  <p className="text-xs text-slate-500 mt-2">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
