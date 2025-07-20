'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Building, 
  Users, 
  Settings, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Organization', href: '/dashboard/organization', icon: Building },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ className, onCollapse }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };
  
  return (
    <div className={cn(
      "relative bg-white border-r border-gray-200 text-gray-900 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">EventPro</h1>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">E</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">U</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">User Name</p>
              <p className="text-xs text-gray-400">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
