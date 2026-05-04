'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/cursos.module.css';

// Loaded only when the user opens the resumen
const PdfFullscreenModal = dynamic(() => import('./PdfFullscreenModal'), {
  ssr: false,
});

interface ResumenOpcion {
  id: string;
  label: string;
}

interface Props {
  claseId: string;
  hasResumen: boolean;
  resumenOpciones?: ResumenOpcion[];
}

export default function StudyMaterialSection({ claseId, hasResumen, resumenOpciones }: Props) {
  const isMulti = resumenOpciones && resumenOpciones.length > 1;

  const [pickerOpen, setPickerOpen]       = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedId, setSelectedId]       = useState<string | null>(null);

  // Which PDF the fullscreen modal targets
  const activeId = isMulti ? selectedId : claseId;

  const handleCardClick = () => {
    if (!hasResumen) return;
    if (isMulti) {
      setPickerOpen(true);
    } else {
      setFullscreenOpen(true);
    }
  };

  const handlePick = (id: string) => {
    setSelectedId(id);
    setPickerOpen(false);
    setFullscreenOpen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false);
    if (isMulti) {
      // Reset selection so next click reopens the picker
      setSelectedId(null);
    }
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

        {/* Resumen — abre directo en pantalla completa */}
        <div
          className={`${styles.studyCard} ${
            hasResumen ? styles.studyCardActive : styles.studyCardLocked
          }`}
          onClick={handleCardClick}
        >
          <div className={styles.studyCardIcon}>📄</div>
          <p className={styles.studyCardTitle}>Resumen de la Clase</p>
          <p className={styles.studyCardDesc}>Resumen completo del material visto</p>
          {hasResumen ? (
            <span className={styles.studyAvailable}>Ver resumen ⛶</span>
          ) : (
            <span className={styles.studyComingSoon}>Próximamente</span>
          )}
        </div>
      </div>

      {/* ── Picker modal (solo clases con opciones múltiples) ── */}
      {pickerOpen && isMulti && (
        <div className={styles.pickerOverlay} onClick={() => setPickerOpen(false)}>
          <div className={styles.pickerCard} onClick={e => e.stopPropagation()}>
            <button className={styles.pickerClose} onClick={() => setPickerOpen(false)}>✕</button>
            <p className={styles.pickerTitle}>¿Qué resumen quieres ver?</p>
            <div className={styles.pickerOptions}>
              {resumenOpciones.map(opcion => (
                <button
                  key={opcion.id}
                  className={styles.pickerOption}
                  onClick={() => handlePick(opcion.id)}
                >
                  <span className={styles.pickerOptionIcon}>📄</span>
                  {opcion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Fullscreen viewer con zoom (única instancia del PdfViewer) ── */}
      {fullscreenOpen && activeId && (
        <PdfFullscreenModal
          claseId={activeId}
          onClose={handleCloseFullscreen}
        />
      )}
    </div>
  );
}
