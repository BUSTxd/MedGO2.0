'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from '@/styles/finalCta.module.css';

export default function FinalCTA() {
  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <section id="empezar" className={styles.section}>
      <div className={`${styles.inner} reveal`}>
        <div className={styles.orb} aria-hidden />
        <span className="section-tag">Empezar ahora</span>
        <h2 className={styles.title}>
          Empieza tu próximo ciclo<br />
          <em style={{ fontStyle: 'normal', color: 'var(--blue)' }}>con un sílabo claro.</em>
        </h2>
        <p className={styles.sub}>
          Plan gratuito disponible. Sin tarjeta para empezar. Cancela cuando quieras.
        </p>

        <div className={styles.ctaWrap}>
          <Link href={loggedIn ? '/dashboard/cursos' : '/auth/login'}>
            <button className={styles.bigCta}>
              {loggedIn ? 'Ir a mis cursos →' : 'Crear mi cuenta →'}
            </button>
          </Link>
          <p className={styles.hint}>Te toma 30 segundos. Sin compromiso.</p>
        </div>
      </div>
    </section>
  );
}
