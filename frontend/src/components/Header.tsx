'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AuthService } from '@/services/authService';
import { User, LogOut, Settings, Building, ChevronDown } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = AuthService.getStoredUser();
    setUser(storedUser);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setShowUserMenu(false);
    window.location.href = '/';
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">EventPro</h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Pricing</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">About</a>
            <Link href="/events" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
              Browse Events
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {getUserInitials(user.full_name || user.email)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.role?.replace('_', ' ').toLowerCase()}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.full_name || user.email}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.organization && (
                        <p className="text-xs text-gray-400 mt-1">
                          <Building className="inline h-3 w-3 mr-1" />
                          {user.organization.name}
                        </p>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link href="/auth/register/attendee">
                    <Button size="sm" className="text-sm bg-blue-600 hover:bg-blue-700">
                      Join as Attendee
                    </Button>
                  </Link>
                  <Link href="/auth/register/owner">
                    <Button size="sm" className="text-sm bg-slate-900 hover:bg-slate-800">
                      Register as Owner
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
