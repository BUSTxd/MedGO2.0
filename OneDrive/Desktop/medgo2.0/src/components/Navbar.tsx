'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import styles from '@/styles/navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
          ? 'linear-gradient(180deg, rgba(8,6,26,0.88) 0%, rgba(8,6,26,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(8,6,26,0.45) 0%, rgba(8,6,26,0.05) 100%)',
      }}
    >
      <a className={styles.logo} href="#">
        <Logo size={64} />
      </a>
      <div className={styles.links}>
        <a href="#cursos">Cursos</a>
        <a href="#precios">Precios</a>
        <a href="#nosotros">Sobre Nosotros</a>
        <a href="#contacto">FAQ</a>
      </div>
      <Link href="/auth/login">
        <button className={styles.btnNav}>Iniciar Sesión</button>
      </Link>
    </nav>
  );
}
