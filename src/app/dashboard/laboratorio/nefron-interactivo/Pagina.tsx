'use client';
// Página del simulador "Nefrón INTERACTIVO". Reutiliza el layout estándar del
// laboratorio y carga el simulador de forma diferida (solo en cliente).

import Link from 'next/link';
import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import KidneyIcon from '@/components/icons/KidneyIcon';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/nefronInteractivo.module.css';

const NefronSimulator = dynamic(() => import('./NefronSimulator'), {
  ssr: false,
  loading: () => <div className={base.loadingMsg}>Cargando simulador…</div>,
});

export default function NefronInteractivoPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="nefron-interactivo" />
      <KidneyIcon className={styles.bgIcon} />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Excretor · Nefrón</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Nefrón interactivo</span>
        <h2 className={styles.h2}>Del filtrado a la orina, segmento por segmento</h2>
        <p className={styles.sub}>
          Recorre el nefrón, haz zoom hasta la célula y sus transportadores, y bloquéalos para ver en
          tiempo real qué cambia en sangre, orina y equilibrio ácido-base.
          <em className={styles.disclaimer}> Valores y porcentajes son rangos orientativos educativos.</em>
        </p>
      </div>

      <NefronSimulator />
    </div>
  );
}
