'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/dashboardSidebar.module.css';

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const isActive = (href: string) =>
    href === '/dashboard/cursos'
      ? pathname.startsWith('/dashboard/cursos')
      : pathname === href;

  return (
    <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ''}`}>
      <Link href="/" className={styles.sidebarLogo}>
        <Logo size={52} />
      </Link>

      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
          <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className={styles.label}>Home</span>
        </Link>

        <Link href="/dashboard/cursos" className={`${styles.navItem} ${isActive('/dashboard/cursos') ? styles.active : ''}`}>
          <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h2a1 1 0 100-2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <span className={styles.label}>Qbank</span>
        </Link>

        <a href="/#contacto" className={styles.navItem}>
          <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span className={styles.label}>Contáctanos</span>
        </a>
      </nav>

      <div className={styles.sidebarToggle}>
        <button className={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
          <svg className={`${styles.navIcon} ${styles.toggleIcon} ${collapsed ? styles.toggleRotated : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.label}>{collapsed ? 'Mostrar' : 'Ocultar'}</span>
        </button>
      </div>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn} onClick={handleSignOut}>
          <svg className={styles.navIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.label}>SALIR</span>
        </button>
      </div>
    </aside>
  );
}
