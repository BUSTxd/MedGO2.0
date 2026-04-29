'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const supabase = useRef(createClient());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    supabase.current.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.current.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!dropOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropOpen]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0];

  const handleSignOut = async () => {
    await supabase.current.auth.signOut();
    setDropOpen(false);
  };

  return (
    <nav
      className={styles.nav}
      style={{
        background: scrolled
          ? 'linear-gradient(180deg, rgba(8,6,26,0.95) 0%, rgba(8,6,26,0.9) 100%)'
          : 'linear-gradient(180deg, rgba(8,6,26,0.45) 0%, rgba(8,6,26,0.05) 100%)',
      }}
    >
      <a className={styles.logo} href="#">
        <Logo size={40} />
      </a>

      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <a href="#cursos" onClick={() => setMenuOpen(false)}>Cursos</a>
        <a href="#precios" onClick={() => setMenuOpen(false)}>Precios</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Sobre Nosotros</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>FAQ</a>
        <div className={styles.mobileLogin} onClick={() => setMenuOpen(false)}>
          {user ? (
            <button className={styles.btnNav} onClick={handleSignOut}>Cerrar sesión</button>
          ) : (
            <Link href="/auth/login">
              <button className={styles.btnNav}>Iniciar Sesión</button>
            </Link>
          )}
        </div>
      </div>

      {/* Desktop right side */}
      {user ? (
        <div className={styles.userMenu} ref={dropRef}>
          <button
            className={styles.userMenuBtn}
            onClick={() => setDropOpen((o) => !o)}
          >
            {firstName}
            <span className={styles.chevron}>{dropOpen ? '▴' : '▾'}</span>
          </button>
          {dropOpen && (
            <div className={styles.dropdown}>
              <Link href="/dashboard/cursos" onClick={() => setDropOpen(false)}>
                <button className={styles.dropdownItem}>Ir al dashboard</button>
              </Link>
              <button className={`${styles.dropdownItem} ${styles.dropdownDanger}`} onClick={handleSignOut}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/login" className={styles.desktopLogin}>
          <button className={styles.btnNav}>Iniciar Sesión</button>
        </Link>
      )}

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className={menuOpen ? styles.bar1Open : ''} />
        <span className={menuOpen ? styles.bar2Open : ''} />
        <span className={menuOpen ? styles.bar3Open : ''} />
      </button>
    </nav>
  );
}
