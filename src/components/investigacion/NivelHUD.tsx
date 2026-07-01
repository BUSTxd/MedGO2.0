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
      </div>

      <div className={styles.hudBarra}>
        <div className={styles.hudBarraFill} style={{ width: `${progresoPct}%` }} />
      </div>
      <div className={styles.hudSeccion}>{seccion}</div>
    </div>
  );
}
