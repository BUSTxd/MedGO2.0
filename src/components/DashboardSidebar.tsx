'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import MicroscopeIcon from './icons/MicroscopeIcon';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/dashboardSidebar.module.css';

const NAV = [
  {
    label: 'Home',
    href: '/dashboard/home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    label: 'Cursos',
    href: '/dashboard/cursos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235"/>
        <path stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" d="M8 7H16"/>
        <path stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" d="M8 10.5H13"/>
        <path stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" d="M13 16V19.5309C13 19.8065 13 19.9443 12.9051 20C12.8103 20.0557 12.6806 19.9941 12.4211 19.8708L11.1789 19.2808C11.0911 19.2391 11.0472 19.2182 11 19.2182C10.9528 19.2182 10.9089 19.2391 10.8211 19.2808L9.57889 19.8708C9.31943 19.9941 9.18971 20.0557 9.09485 20C9 19.9443 9 19.8065 9 19.5309V16.45"/>
        <path stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" d="M10 22C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8M14 22C16.8284 22 18.2426 22 19.1213 21.1213C20 20.2426 20 18.8284 20 16V12"/>
      </svg>
    ),
  },
  {
    label: 'Histología',
    href: '/dashboard/histologia',
    icon: <MicroscopeIcon size={20} />,
  },
  {
    label: 'Laboratorio virtual',
    href: '/dashboard/laboratorio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: 'Investigación',
    href: '/dashboard/investigacion',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M17,12v5m-4,0V15M3,15l2.83-2.83M8,7a3,3,0,1,0,3,3A3,3,0,0,0,8,7Z"
          stroke="currentColor" strokeOpacity="0.6"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        />
        <path
          d="M8,3H20a1,1,0,0,1,1,1V20a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V17"
          stroke="currentColor"
          strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: 'Contáctanos',
    href: '/dashboard/contacto',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    ),
  },
  {
    label: 'Mi cuenta',
    href: '/dashboard/cuenta',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  isAdmin?: boolean;
}

const ADMIN_ITEM = {
  label: 'Admin',
  href: '/dashboard/admin',
  icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 1l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V4l7-3zm0 5a2 2 0 100 4 2 2 0 000-4zm-3.5 8.5c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3v.5h-7v-.5z" clipRule="evenodd" />
    </svg>
  ),
};

export default function DashboardSidebar({ collapsed, onToggle, darkMode, onToggleDark, isAdmin = false }: Props) {
  const pathname = usePathname();

  const navItems = isAdmin ? [...NAV, ADMIN_ITEM] : NAV;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Hard nav: garantiza que el siguiente request lleve las cookies
    // limpias y que el árbol RSC + AuthProvider se reinicien.
    window.location.assign('/auth/login');
  };

  const isActive = (href: string) =>
    href === '/dashboard/cursos'
      ? pathname.startsWith('/dashboard/cursos')
      : pathname.startsWith(href);

  return (
    <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo → landing page */}
      <Link href="/" className={styles.sidebarLogo}>
        <Logo size={52} />
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Dark mode button — above toggle when collapsed */}
      {collapsed && (
        <div className={styles.darkBtnWrap}>
          <button
            className={`${styles.darkBtn} ${darkMode ? styles.darkBtnActive : ''}`}
            onClick={onToggleDark}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      )}

      <div className={styles.sidebarToggle}>
        <button className={styles.toggleBtn} onClick={onToggle}>
          <svg
            className={`${styles.navIcon} ${styles.toggleIcon} ${collapsed ? styles.toggleRotated : ''}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none"
          >
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
        {!collapsed && (
          <button
            className={`${styles.darkBtn} ${darkMode ? styles.darkBtnActive : ''}`}
            onClick={onToggleDark}
            title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        )}
      </div>
    </aside>
  );
}
