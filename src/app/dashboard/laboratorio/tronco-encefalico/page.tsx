'use client';
// Lab «Tronco encefálico»: visor comparativo de pantalla partida (cadáver vs maqueta 3D).
// Reutiliza el layout estándar del laboratorio; toda la lógica vive en TroncoViewer.

import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import TroncoViewer from './TroncoViewer';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/troncoEncefalico.module.css';

export default function TroncoEncefalicoPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="tronco-encefalico" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Neurología · Tronco encefálico</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Tronco encefálico</span>
        <h2 className={styles.h2}>Cadáver vs. maqueta 3D</h2>
        <p className={styles.sub}>
          Compara las vistas reales del tronco encefálico en el cadáver (izquierda) con la maqueta 3D
          rotatoria (derecha). Usa las flechas para cambiar de vista o rotar la maqueta, y colapsa
          cualquiera de los paneles para estudiar a pantalla completa la imagen que prefieras.
        </p>
      </div>

      <TroncoViewer />
    </div>
  );
}
