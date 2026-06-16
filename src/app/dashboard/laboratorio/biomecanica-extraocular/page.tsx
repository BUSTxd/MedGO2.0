'use client';
// Página del simulador "Biomecánica extraocular". Reutiliza el layout estándar del
// laboratorio y carga la escena 3D de forma diferida (solo en cliente), igual que
// el nefrón, para mantener three.js fuera del bundle del resto del dashboard.

import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import EyeSimulator from './EyeSimulator';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/biomecanicaExtraocular.module.css';

export default function BiomecanicaExtraocularPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="biomecanica-extraocular" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Neurología · Motilidad ocular</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Biomecánica extraocular</span>
        <h2 className={styles.h2}>Los 6 músculos del ojo derecho y su acción</h2>
        <p className={styles.sub}>
          Mantén presionado un músculo para verlo contraerse y mover el globo en su dirección real, o
          explora las sinergias y las posiciones cardinales del patrón en H.
          <em className={styles.disclaimer}> Modelo didáctico: las amplitudes son ilustrativas, no fisiológicas.</em>
        </p>
      </div>

      <EyeSimulator />
    </div>
  );
}
