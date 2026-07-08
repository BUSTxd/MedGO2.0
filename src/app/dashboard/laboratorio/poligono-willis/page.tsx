'use client';
// Página del modelo «Polígono de Willis 3D». Reutiliza el layout estándar del
// laboratorio; el visor 3D se carga de forma diferida (solo en cliente).

import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import WillisViewer from './WillisViewer';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/poligonoWillis.module.css';

export default function PoligonoWillisPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="poligono-willis" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Neurología · Polígono de Willis</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Polígono de Willis 3D</span>
        <h2 className={styles.h2}>Vascularización de la base del encéfalo</h2>
        <p className={styles.sub}>
          Red arterial completa de la base del encéfalo: el polígono de Willis más las arterias que
          nacen de él o lo alimentan. Rota el modelo para reconocer la disposición espacial del anillo,
          las ramas anteriores, las perforantes centrales y el sistema vertebrobasilar.
          <em className={styles.disclaimer}> Modelo didáctico tipo atlas: las proporciones son representativas, no métricas exactas.</em>
        </p>
      </div>

      <WillisViewer />
    </div>
  );
}
