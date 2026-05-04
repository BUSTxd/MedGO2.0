'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/cursos.module.css';

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Cargando resumen…</div>,
});

// Loaded only when the user opens the fullscreen view
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

  // Single-PDF state (everOpened = keep viewer mounted after first open)
  const [open, setOpen]           = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  // Multi-PDF state
  const [pickerOpen, setPickerOpen]   = useState(false);
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [pdfOpen, setPdfOpen]         = useState(false);

  // Fullscreen state
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const selectedLabel = isMulti && selectedId
    ? resumenOpciones.find(o => o.id === selectedId)?.label ?? ''
    : '';

  // Which PDF the action bar / fullscreen should target
  const activeId = isMulti ? selectedId : claseId;
  // Show action bar whenever a PDF is currently visible inline
  const viewerVisible = isMulti
    ? Boolean(pdfOpen && selectedId)
    : open && everOpened;

  /* ── handlers ── */
  const handleCardClick = () => {
    if (!hasResumen) return;
    if (isMulti) {
      if (pdfOpen) {
        // Close PDF and reset so next click shows picker again
        setPdfOpen(false);
        setSelectedId(null);
      } else {
        setPickerOpen(true);
      }
    } else {
      if (!everOpened) setEverOpened(true);
      setOpen(o => !o);
    }
  };

  const handlePick = (id: string) => {
    setSelectedId(id);
    setPickerOpen(false);
    setPdfOpen(true);
  };

  /* ── card label ── */
  const cardLabel = () => {
    if (!hasResumen) return null;
    if (isMulti) {
      return pdfOpen
        ? `${selectedLabel} ▲`
        : 'Ver resumen ▼';
    }
    return open ? 'Cerrar ▲' : 'Ver resumen ▼';
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
              ? (open || pdfOpen) ? styles.studyCardOpen : styles.studyCardActive
              : styles.studyCardLocked
          }`}
          onClick={handleCardClick}
        >
          <div className={styles.studyCardIcon}>📄</div>
          <p className={styles.studyCardTitle}>Resumen de la Clase</p>
          <p className={styles.studyCardDesc}>Resumen completo del material visto</p>
          {hasResumen ? (
            <span className={styles.studyAvailable}>{cardLabel()}</span>
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

      {/* ── Action bar — aparece cuando el PDF inline está visible ── */}
      {viewerVisible && activeId && (
        <div className={styles.viewerActionBar}>
          <button
            className={styles.viewerActionBtn}
            onClick={() => setFullscreenOpen(true)}
          >
            <span className={styles.viewerActionBtnIcon}>⛶</span>
            Ver PDF completo
          </button>
        </div>
      )}

      {/* ── PDF viewer — single PDF (stays mounted after first open) ── */}
      {hasResumen && !isMulti && everOpened && (
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

      {/* ── PDF viewer — multi PDF (remounts on each selection) ── */}
      {hasResumen && isMulti && selectedId && pdfOpen && (
        <PdfViewer
          key={selectedId}
          claseId={selectedId}
          className={styles.pdfViewer}
          loadingClass={styles.pdfLoading}
          pageWrapClass={styles.pdfPageWrap}
        />
      )}

      {/* ── Fullscreen modal con zoom ── */}
      {fullscreenOpen && activeId && (
        <PdfFullscreenModal
          claseId={activeId}
          onClose={() => setFullscreenOpen(false)}
        />
      )}
    </div>
  );
}
