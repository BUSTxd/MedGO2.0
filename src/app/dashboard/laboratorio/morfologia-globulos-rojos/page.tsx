import type { Metadata } from 'next';
import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import MorfologiaQuiz from './MorfologiaQuiz';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/medulaEspinal.module.css';
import mg from '@/styles/morfologiaGr.module.css';

export const metadata: Metadata = {
  title: 'Morfología de glóbulos rojos | MedGO',
  description:
    'Reconoce las 19 morfologías eritrocitarias del frotis a partir de microfotografías reales, con la lámina de referencia siempre a la vista.',
};

export default function MorfologiaGlobulosRojosPage() {
  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="morfologia-globulos-rojos" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Hematología · Patología</span>
      </div>

      {/* Mismo eje que el ejercicio: ambos centrados y con el mismo ancho. */}
      <div className={`${styles.intro} ${mg.encabezado}`}>
        <span className={styles.kicker}>Morfología de glóbulos rojos</span>
        <h2 className={styles.h2}>Reconoce la célula antes de leer su nombre</h2>
      </div>

      <MorfologiaQuiz />
    </div>
  );
}
