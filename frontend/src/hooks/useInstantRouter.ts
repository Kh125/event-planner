'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useCallback } from 'react';

export function useInstantRouter() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const push = useCallback((href: string) => {
    startTransition(() => {
      router.push(href);
    });
  }, [router]);

  const replace = useCallback((href: string) => {
    startTransition(() => {
      router.replace(href);
    });
  }, [router]);

  return { push, replace, isPending, back: router.back };
}
