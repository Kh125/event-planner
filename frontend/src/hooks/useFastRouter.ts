'use client';

import { useRouter as useNextRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useFastRouter() {
  const router = useNextRouter();

  const push = useCallback((href: string) => {
    // Use native navigation for instant feel
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', href);
      router.push(href);
    }
  }, [router]);

  const replace = useCallback((href: string) => {
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', href);
      router.replace(href);
    }
  }, [router]);

  const back = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  }, []);

  return { 
    push, 
    replace, 
    back, 
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch
  };
}
