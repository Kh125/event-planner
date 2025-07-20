'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface RouterCacheContextType {
  prefetchPage: (path: string) => void;
  isPageCached: (path: string) => boolean;
}

const RouterCacheContext = createContext<RouterCacheContextType>({
  prefetchPage: () => {},
  isPageCached: () => false,
});

export function RouterCacheProvider({ children }: { children: React.ReactNode }) {
  const [cachedPages, setCachedPages] = useState<Set<string>>(new Set());

  const prefetchPage = useCallback((path: string) => {
    setCachedPages(prev => new Set(prev).add(path));
  }, []);

  const isPageCached = useCallback((path: string) => {
    return cachedPages.has(path);
  }, [cachedPages]);

  return (
    <RouterCacheContext.Provider value={{ prefetchPage, isPageCached }}>
      {children}
    </RouterCacheContext.Provider>
  );
}

export const useRouterCache = () => useContext(RouterCacheContext);
