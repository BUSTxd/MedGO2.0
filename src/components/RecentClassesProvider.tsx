'use client';
import { createContext, useCallback, useContext, useState } from 'react';

export interface RecentClass {
  id: string;
  courseSlug: string;
  title: string;
  openedAt: number;
}

interface RecentClassesContextValue {
  recent: RecentClass[];
  add: (item: Omit<RecentClass, 'openedAt'>) => void;
}

const RecentClassesContext = createContext<RecentClassesContextValue>({
  recent: [],
  add: () => {},
});

const MAX_ITEMS = 5;

export function RecentClassesProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<RecentClass[]>([]);

  const add = useCallback((item: Omit<RecentClass, 'openedAt'>) => {
    setRecent((prev) => {
      const filtered = prev.filter((c) => c.id !== item.id);
      const next: RecentClass = { ...item, openedAt: Date.now() };
      return [next, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return (
    <RecentClassesContext.Provider value={{ recent, add }}>
      {children}
    </RecentClassesContext.Provider>
  );
}

export function useRecentClasses() {
  return useContext(RecentClassesContext);
}
