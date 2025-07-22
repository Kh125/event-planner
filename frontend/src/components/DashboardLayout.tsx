'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole?: string[];
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar 
          className="fixed left-0 top-0 h-full z-30" 
          onCollapse={setSidebarCollapsed}
        />
        
        {/* Main content */}
        <div 
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <div className="flex flex-col h-full">
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
