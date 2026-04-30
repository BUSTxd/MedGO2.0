'use client';
import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import styles from '@/styles/dashboardLayout.module.css';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.layout}>
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
        <div className={styles.panel}>{children}</div>
      </main>
    </div>
  );
}
