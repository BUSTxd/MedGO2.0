'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

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
        <Logo size={91} />
      </a>

      <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        <a href="#cursos" onClick={() => setMenuOpen(false)}>Cursos</a>
        <a href="#precios" onClick={() => setMenuOpen(false)}>Precios</a>
        <a href="#nosotros" onClick={() => setMenuOpen(false)}>Sobre Nosotros</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>FAQ</a>
        <Link href="/auth/login" className={styles.mobileLogin} onClick={() => setMenuOpen(false)}>
          <button className={styles.btnNav}>Iniciar Sesión</button>
        </Link>
      </div>

      <Link href="/auth/login" className={styles.desktopLogin}>
        <button className={styles.btnNav}>Iniciar Sesión</button>
      </Link>

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
