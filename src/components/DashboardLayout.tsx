import DashboardSidebar from './DashboardSidebar';
import styles from '@/styles/dashboardLayout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <DashboardSidebar />
      <main className={styles.main}>
        <div className={styles.panel}>
          {children}
        </div>
      </main>
    </div>
  );
}
