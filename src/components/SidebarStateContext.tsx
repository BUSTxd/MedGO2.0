'use client';
import { createContext, useContext } from 'react';

const SidebarStateContext = createContext<boolean>(false);

export function SidebarStateProvider({
  collapsed,
  children,
}: {
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarStateContext.Provider value={collapsed}>{children}</SidebarStateContext.Provider>
  );
}

/** `true` si la sidebar está retraída, en el mismo instante en que cambia (sin esperar animaciones). */
export function useSidebarCollapsed() {
  return useContext(SidebarStateContext);
}
