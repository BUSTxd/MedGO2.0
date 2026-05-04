'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/cursos.module.css';

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
  loading: () => <div className={styles.pdfLoading}>Cargando resumen…</div>,
});

const ZOOM_LEVELS = [0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
const DEFAULT_ZOOM_INDEX = 1; // 1.0x

interface Props {
  claseId: string;
  onClose: () => void;
}

export default function PdfFullscreenModal({ claseId, onClose }: Props) {
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [baseWidth, setBaseWidth] = useState(0);

  const scale = ZOOM_LEVELS[zoomIndex];

  // Measure viewport for base width — capped at 1100px so the PDF doesn't
  // become absurdly wide on ultrawide monitors at 100%.
  useEffect(() => {
    const update = () => {
      setBaseWidth(Math.min(window.innerWidth - 80, 1100));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ESC closes the modal + lock body scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const zoomIn   = useCallback(() => setZoomIndex(i => Math.min(i + 1, ZOOM_LEVELS.length - 1)), []);
  const zoomOut  = useCallback(() => setZoomIndex(i => Math.max(i - 1, 0)), []);
  const zoomReset = useCallback(() => setZoomIndex(DEFAULT_ZOOM_INDEX), []);

  return (
    <div className={styles.fullscreenOverlay}>
      <div className={styles.fullscreenToolbar}>
        <div className={styles.fullscreenZoomGroup}>
          <button
            className={styles.fullscreenBtn}
            onClick={zoomOut}
            disabled={zoomIndex === 0}
            aria-label="Reducir zoom"
          >
            −
          </button>
          <button
            className={styles.fullscreenZoomReset}
            onClick={zoomReset}
            aria-label="Restablecer zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            className={styles.fullscreenBtn}
            onClick={zoomIn}
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="Ampliar zoom"
          >
            +
          </button>
        </div>

        <div className={styles.fullscreenSpacer} />

        <button
          className={styles.fullscreenClose}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      <div className={styles.fullscreenContent}>
        {baseWidth > 0 && (
          <PdfViewer
            claseId={claseId}
            widthOverride={baseWidth}
            scale={scale}
            className={styles.fullscreenPdfViewer}
            loadingClass={styles.pdfLoading}
            pageWrapClass={styles.fullscreenPageWrap}
          />
        )}
      </div>
    </div>
  );
}
