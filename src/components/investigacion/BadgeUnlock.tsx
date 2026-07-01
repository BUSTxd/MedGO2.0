'use client';
import { useEffect, useState } from 'react';
import { getInsignia } from '@/lib/investigacion/badges';
import Icono from './Icono';
import styles from '@/styles/investigacionGame.module.css';

export default function BadgeUnlock({ badgeId, onDone }: { badgeId: string; onDone: () => void }) {
  const insignia = getInsignia(badgeId);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSaliendo(true), 3200);
    const t2 = setTimeout(onDone, 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  if (!insignia) return null;

  return (
    <div className={`${styles.badgeToast} ${saliendo ? styles.badgeToastOut : ''}`}>
      <span className={styles.badgeToastEmoji}>
        <Icono name={insignia.icono} />
      </span>
      <div>
        <p className={styles.badgeToastTitulo}>¡Insignia desbloqueada!</p>
        <p className={styles.badgeToastNombre}>{insignia.nombre}</p>
      </div>
    </div>
  );
}
