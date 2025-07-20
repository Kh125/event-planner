'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Building, 
  Users, 
  Settings, 
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
  const pathname = usePathname();
  
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
          <div className="flex items-center space-x-3 transition-opacity duration-300">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">EventPro</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 relative",
                    isActive 
                      ? "bg-gray-100 text-gray-900 font-medium" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Simple active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-gray-900 rounded-full" />
                  )}
                  
                  <item.icon 
                    size={18} 
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-gray-900" : "text-gray-500",
                      isCollapsed && "mx-auto"
                    )} 
                  />
                  
                  {!isCollapsed && (
                    <span className="ml-3">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* User section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center transition-colors duration-150",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">User Name</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
