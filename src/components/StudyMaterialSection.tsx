'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/cursos.module.css';

// PdfViewer (+ its ~2MB worker) only gets imported once the user clicks
const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Cargando resumen…</div>,
});

interface Props {
  claseId: string;
  hasResumen: boolean;
}

export default function StudyMaterialSection({ claseId, hasResumen }: Props) {
  const [open, setOpen]     = useState(false);
  // Once true, the viewer stays mounted — toggling only shows/hides via CSS
  const [everOpened, setEverOpened] = useState(false);

  const toggle = () => {
    if (!everOpened) setEverOpened(true);
    setOpen(o => !o);
  };

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

        {/* Resumen — clickeable si hay PDF */}
        <div
          className={`${styles.studyCard} ${
            hasResumen
              ? open ? styles.studyCardOpen : styles.studyCardActive
              : styles.studyCardLocked
          }`}
          onClick={hasResumen ? toggle : undefined}
        >
          <div className={styles.studyCardIcon}>📄</div>
          <p className={styles.studyCardTitle}>Resumen de la Clase</p>
          <p className={styles.studyCardDesc}>Resumen completo del material visto</p>
          {hasResumen ? (
            <span className={styles.studyAvailable}>
              {open ? 'Cerrar ▲' : 'Ver resumen ▼'}
            </span>
          ) : (
            <span className={styles.studyComingSoon}>Próximamente</span>
          )}
        </div>
      </div>

      {/*
        Una vez abierto por primera vez (everOpened), el viewer queda montado
        en el DOM. Cerrar solo lo oculta con CSS — no hay re-fetch ni re-render.
      */}
      {/* visibility+height en vez de display:none — preserva el contenido de los <canvas> */}
      {hasResumen && everOpened && (
        <div style={open
          ? { visibility: 'visible', height: 'auto', overflow: 'visible' }
          : { visibility: 'hidden', height: 0, overflow: 'hidden' }
        }>
          <PdfViewer
            claseId={claseId}
            className={styles.pdfViewer}
            loadingClass={styles.pdfLoading}
            pageWrapClass={styles.pdfPageWrap}
          />
        </div>
      )}
    </div>
  );
}
