'use client';

import dynamic from 'next/dynamic';
import styles from '@/styles/cursos.module.css';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

interface Props {
  claseId: string;
  hasResumen: boolean;
}

export default function StudyMaterialSection({ claseId, hasResumen }: Props) {
  return (
    <div className={styles.studySection}>
      <p className={styles.studyLabel}>Material de Estudio</p>

      <div className={styles.studyGrid}>
        {/* Video resumen — siempre bloqueado */}
        <div className={`${styles.studyCard} ${styles.studyCardLocked}`}>
          <div className={styles.studyCardIcon}>▶</div>
          <p className={styles.studyCardTitle}>Video Resumen</p>
          <p className={styles.studyCardDesc}>Repaso en video del tema de la clase</p>
          <span className={styles.studyComingSoon}>Próximamente</span>
        </div>

        {/* QBank — siempre bloqueado */}
        <div className={`${styles.studyCard} ${styles.studyCardLocked}`}>
          <div className={styles.studyCardIcon}>◈</div>
          <p className={styles.studyCardTitle}>QBank del Tema</p>
          <p className={styles.studyCardDesc}>Preguntas de práctica tipo examen</p>
          <span className={styles.studyComingSoon}>Próximamente</span>
        </div>

        {/* Resumen — activo solo si hay PDF */}
        <div className={`${styles.studyCard} ${hasResumen ? styles.studyCardActive : styles.studyCardLocked}`}>
          <div className={styles.studyCardIcon}>📄</div>
          <p className={styles.studyCardTitle}>Resumen de la Clase</p>
          <p className={styles.studyCardDesc}>Resumen completo del material visto</p>
          {hasResumen
            ? <span className={styles.studyAvailable}>Disponible</span>
            : <span className={styles.studyComingSoon}>Próximamente</span>
          }
        </div>
      </div>

      {/* PDF viewer — solo si esta clase tiene resumen */}
      {hasResumen && (
        <PdfViewer
          claseId={claseId}
          className={styles.pdfViewer}
          loadingClass={styles.pdfLoading}
          pageWrapClass={styles.pdfPageWrap}
        />
      )}
    </div>
  );
}
