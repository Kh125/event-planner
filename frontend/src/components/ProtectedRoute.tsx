'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          router.push(fallbackPath);
          return;
        }

        const user = await AuthService.getCurrentUser();
        
        if (!user) {
          router.push(fallbackPath);
          return;
        }

        // Check role-based access if required
        if (requiredRole && requiredRole.length > 0) {
          if (!requiredRole.includes(user.role)) {
            router.push('/unauthorized');
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push(fallbackPath);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole, fallbackPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
