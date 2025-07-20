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
            "text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 active:scale-95",
            isCollapsed && "mx-auto"
          )}
        >
          <div className="transition-transform duration-300">
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </div>
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
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden transform hover:scale-105",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm scale-105" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 hover:shadow-sm",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Active state indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 rounded-r-full transition-all duration-200 animate-pulse-subtle" />
                  )}
                  
                  <item.icon 
                    size={18} 
                    className={cn(
                      "flex-shrink-0 transition-all duration-200 transform group-hover:scale-110",
                      isActive 
                        ? "text-blue-600" 
                        : "text-gray-500 group-hover:text-gray-700",
                      isCollapsed && "mx-auto"
                    )} 
                  />
                  
                  {!isCollapsed && (
                    <span className={cn(
                      "ml-3 transition-all duration-300 opacity-100 animate-slide-in",
                      isActive ? "font-semibold" : "font-medium"
                    )}>
                      {item.name}
                    </span>
                  )}
                  
                  {/* Hover effect */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg transform group-hover:scale-105",
                    isActive && "hidden"
                  )} />
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
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
          "group flex items-center transition-all duration-300 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-all duration-200 transform group-hover:scale-110">
            <span className="text-sm font-medium text-white">U</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 transition-all duration-300 opacity-100 animate-slide-in">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">User Name</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">user@example.com</p>
            </div>
          )}
          
          {/* Tooltip for collapsed user */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              User Name
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
