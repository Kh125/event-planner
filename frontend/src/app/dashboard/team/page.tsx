'use client';

import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users, Crown, Shield, User, Mail, MoreVertical, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    status: 'active',
    joinDate: '2024-01-20'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'Member',
    status: 'active',
    joinDate: '2024-02-01'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'Member',
    status: 'inactive',
    joinDate: '2024-02-10'
  }
];

const getRoleIcon = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return Crown;
    case 'manager':
      return Shield;
    default:
      return User;
  }
};

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'text-orange-700 bg-orange-50';
    case 'manager':
      return 'text-blue-700 bg-blue-50';
    default:
      return 'text-slate-700 bg-slate-50';
  }
};

export default function TeamPage() {
  const handleInviteMember = () => {
    console.log('Invite member');
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Remove member:', memberId);
  };

  const activeMembers = teamMembers.filter(member => member.status === 'active');
  const inactiveMembers = teamMembers.filter(member => member.status === 'inactive');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Team</h1>
            <p className="text-slate-600 mt-2">Manage your organization members and their roles</p>
          </div>
          <Button onClick={handleInviteMember} className="bg-slate-900 hover:bg-slate-800 text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Members</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{teamMembers.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Members</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{activeMembers.length}</div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
              <Crown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {teamMembers.filter(m => m.role.toLowerCase() === 'admin').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 pb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Team Members</h2>
            <p className="text-slate-600">Manage your team members and their permissions</p>
          </div>
          
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {teamMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                const roleColorClass = getRoleColor(member.role);
                
                return (
                  <div
                    key={member.id}
                    className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-white">
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        {member.status === 'active' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-slate-900 text-lg">{member.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleColorClass}`}>
                            <RoleIcon className="w-3 h-3 mr-1.5" />
                            {member.role}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1.5 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            <span className="font-medium">{member.email}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            <span className={`text-xs font-semibold ${
                              member.status === 'active' 
                                ? 'text-emerald-600' 
                                : 'text-slate-500'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-red-200 shadow-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
