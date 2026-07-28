import Link from 'next/link';
import type { Metadata } from 'next';
import TrackLabVisit from '@/components/TrackLabVisit';
import styles from '@/styles/frotisSim.module.css';

export const metadata: Metadata = {
  title: 'Frotis sanguíneo · Simulación | MedGO',
  description:
    'Simulación 3D paso a paso de la práctica de realización y tinción del frotis sanguíneo, morfología eritrocitaria y recuento plaquetario.',
};

const SIM_URL = '/simulaciones/frotis-sanguineo.html';

export default function FrotisSanguineoPage() {
  return (
    <div className={styles.wrapper}>
      <TrackLabVisit labId="frotis-sanguineo" />

      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>
          ← Laboratorio virtual
        </Link>
        <div className={styles.actions}>
          <span className={styles.counter}>Hematología · Práctica 1</span>
          <a
            className={styles.expand}
            href={SIM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir a pantalla completa ↗
          </a>
        </div>
      </div>

      <iframe
        className={styles.frame}
        src={SIM_URL}
        title="Simulación: realización y tinción del frotis sanguíneo"
        allow="fullscreen"
      />
    </div>
  );
}
