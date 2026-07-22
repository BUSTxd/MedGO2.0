'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import styles from '@/styles/finalCta.module.css';

export default function FinalCTA() {
  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <section id="empezar" className={styles.section}>
      <div className={styles.band}>
        {/* facetas geométricas diagonales */}
        <span className={styles.facet1} aria-hidden />
        <span className={styles.facet2} aria-hidden />
        <span className={styles.facet3} aria-hidden />
        <span className={styles.glow} aria-hidden />

        <div className={styles.inner}>
          <h2 className={styles.title}>
            Empieza tu próximo ciclo<br />
            <em>con un sílabo claro.</em>
          </h2>
          <p className={styles.sub}>
            Plan gratuito disponible. Sin tarjeta para empezar. Cancela cuando quieras.
          </p>
          <p className={styles.trust}>
            Hecho por estudiantes de la UPCH — con todos los cursos de los primeros 3 años de Medicina.
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
      </div>
    </section>
  );
}
