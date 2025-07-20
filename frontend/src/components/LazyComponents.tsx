'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Lazy load heavy components
const DashboardLayout = dynamic(() => 
  import('@/components/DashboardLayout').then(mod => ({ default: mod.DashboardLayout })),
  { 
    loading: () => <LoadingSpinner />,
    ssr: false 
  }
);

const ConfirmDialog = dynamic(() => 
  import('@/components/ui/confirm-dialog').then(mod => ({ default: mod.ConfirmDialog })),
  { 
    loading: () => null,
    ssr: false 
  }
);

export { DashboardLayout, ConfirmDialog };
