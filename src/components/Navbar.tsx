'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0];

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
        <Logo size={44} />
      </a>

      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <a href="#cursos" onClick={() => setMenuOpen(false)}>Cursos</a>
        <a href="#precios" onClick={() => setMenuOpen(false)}>Precios</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Sobre Nosotros</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>FAQ</a>
        <Link
          href={user ? '/dashboard/cursos' : '/auth/login'}
          className={styles.mobileLogin}
          onClick={() => setMenuOpen(false)}
        >
          <button className={styles.btnNav}>
            {user ? 'Entrar' : 'Iniciar Sesión'}
          </button>
        </Link>
      </div>

      <div className={styles.userArea}>
        {user && <span className={styles.nameChip}>{firstName}</span>}
        <Link href={user ? '/dashboard/cursos' : '/auth/login'} className={styles.desktopLogin}>
          <button className={styles.btnNav}>
            {user ? 'Entrar' : 'Iniciar Sesión'}
          </button>
        </Link>
      </div>

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
