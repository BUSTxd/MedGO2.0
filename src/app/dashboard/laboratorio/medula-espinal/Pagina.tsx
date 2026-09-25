'use client';
// Página del simulador «Médula Espinal 3D». Reutiliza el layout estándar del
// laboratorio y carga la escena 3D de forma diferida (solo en cliente), igual que
// el módulo extraocular, para mantener three.js fuera del bundle del dashboard.

import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import SpinalCordSimulator from './SpinalCordSimulator';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/medulaEspinal.module.css';

export default function MedulaEspinalPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="medula-espinal" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Neurología · Médula Espinal</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Médula Espinal 3D</span>
        <h2 className={styles.h2}>Arquitectura segmentaria, láminas de Rexed y tractos</h2>
        <p className={styles.sub}>
          Explora la médula espinal en corte transversal: identifica las láminas de Rexed, los tractos de sustancia blanca
          y las meninges. Compara los niveles cervical, torácico, lumbar y sacro.
          <em className={styles.disclaimer}> Modelo didáctico: las proporciones son representativas, no histológicas.</em>
        </p>
      </div>

      <SpinalCordSimulator />
    </div>
  );
}
