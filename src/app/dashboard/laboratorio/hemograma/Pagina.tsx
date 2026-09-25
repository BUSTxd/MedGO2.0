'use client';
// Módulo de hemograma completo (CBC). Compartido por Hematología y Patología:
// se enlaza desde los dos paneles de `dashboard/laboratorio`.

import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import HemogramaSim from './HemogramaSim';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/medulaEspinal.module.css';

export default function HemogramaPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="hemograma" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Hematología · Patología</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>Hemograma completo</span>
        <h2 className={styles.h2}>Qué mide cada parámetro y cómo cambia en cada enfermedad</h2>
        <p className={styles.sub}>
          Recorre las tres series con los rangos de referencia de un reporte real. Pulsa cualquier
          fila para ver qué mide, por qué sube, por qué baja y su perla clínica; cambia de escenario
          para observar cómo se mueve el patrón completo.
          <em className={styles.disclaimer}>
            Los índices eritrocitarios y los recuentos absolutos se calculan a partir de los
            primarios, igual que en un analizador real.
          </em>
        </p>
      </div>

      <HemogramaSim />
    </div>
  );
}
