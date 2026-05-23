'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
const STORAGE_KEY = 'medgo_recent_classes';

export function RecentClassesProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<RecentClass[]>([]);

  // Hidratacion desde localStorage despues del mount para evitar mismatch SSR.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setRecent(parsed.slice(0, MAX_ITEMS));
    } catch {}
  }, []);

  const add = useCallback((item: Omit<RecentClass, 'openedAt'>) => {
    setRecent((prev) => {
      const filtered = prev.filter((c) => c.id !== item.id);
      const next: RecentClass = { ...item, openedAt: Date.now() };
      const updated = [next, ...filtered].slice(0, MAX_ITEMS);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
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
