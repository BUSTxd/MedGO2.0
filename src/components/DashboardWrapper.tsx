'use client';
import { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { PlanProvider, type ClientPlanState } from './PlanProvider';
import { RecentClassesProvider } from './RecentClassesProvider';
import styles from '@/styles/dashboardLayout.module.css';

export default function DashboardWrapper({
  children,
  planState,
}: {
  children: React.ReactNode;
  planState: ClientPlanState;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medgo-dark');
    if (saved === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    if (window.innerWidth <= 600) {
      setCollapsed(true);
    }
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark-mode', next);
      localStorage.setItem('medgo-dark', String(next));
      return next;
    });
  };

  return (
    <PlanProvider value={planState}>
      <RecentClassesProvider>
        <div className={styles.layout}>
          <DashboardSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
            darkMode={darkMode}
            onToggleDark={toggleDark}
          />
          {!collapsed && (
            <div
              className={styles.backdrop}
              onClick={() => setCollapsed(true)}
              aria-hidden="true"
            />
          )}
          <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
            <div className={styles.panel}>{children}</div>
          </main>
        </div>
      </RecentClassesProvider>
    </PlanProvider>
  );
}
