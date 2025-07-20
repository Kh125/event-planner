'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigate = useCallback(async (path: string) => {
    setIsNavigating(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      router.push(path);
      // Reset loading state after navigation
      setTimeout(() => setIsNavigating(false), 100);
    }, 50);
  }, [router]);

  const replace = useCallback(async (path: string) => {
    setIsNavigating(true);
    
    setTimeout(() => {
      router.replace(path);
      setTimeout(() => setIsNavigating(false), 100);
    }, 50);
  }, [router]);

  const back = useCallback(() => {
    setIsNavigating(true);
    
    setTimeout(() => {
      router.back();
      setTimeout(() => setIsNavigating(false), 100);
    }, 50);
  }, [router]);

  return {
    navigate,
    replace,
    back,
    isNavigating,
  };
}
