'use client';
import Link from 'next/link';
import styles from '@/styles/investigacionGame.module.css';

export default function NivelHUD({
  n,
  nombre,
  totalXP,
  progresoPct,
  seccion,
}: {
  n: number;
  nombre: string;
  totalXP: number;
  progresoPct: number;
  seccion: string;
}) {
  return (
    <div className={styles.hud}>
      <div className={styles.hudTop}>
        <Link href="/dashboard/investigacion" className={styles.hudBack}>
          ← Mapa
        </Link>
        <div className={styles.hudInfo}>
          <span className={styles.hudNivel}>Nivel {n}</span>
          <span className={styles.hudNombre}>{nombre}</span>
        </div>
        <div className={styles.hudXP}>
          <span className={styles.hudXPValor}>{totalXP}</span>
          <span className={styles.hudXPLabel}>XP</span>
        </div>
        <span className={styles.hudEstrella} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
          </svg>
        </span>
      </div>

      <div className={styles.hudBarra}>
        <div className={styles.hudBarraFill} style={{ width: `${progresoPct}%` }} />
      </div>
      <div className={styles.hudSeccion}>{seccion}</div>
    </div>
  );
}
