'use client';

import { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Local copy of the worker — avoids CDN dependency and version mismatch
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props {
  claseId: string;
  className?: string;
  loadingClass?: string;
  pageWrapClass?: string;
}

export default function PdfViewer({ claseId, className, loadingClass, pageWrapClass }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const onLoadError = useCallback(() => {
    setError(true);
  }, []);

  if (error) {
    return (
      <div className={loadingClass} style={{ textAlign: 'center', padding: '40px' }}>
        No se pudo cargar el resumen. Intenta más tarde.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      // Disable right-click context menu
      onContextMenu={e => e.preventDefault()}
    >
      <Document
        file={`/api/resumen/${claseId}`}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={<div className={loadingClass}>Cargando resumen…</div>}
        noData={<div className={loadingClass}>Resumen no disponible.</div>}
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i + 1} className={pageWrapClass}>
            <Page
              pageNumber={i + 1}
              // Disable text layer → prevents copy-paste and text selection
              renderTextLayer={false}
              // Disable annotation layer → removes clickable links
              renderAnnotationLayer={false}
              width={containerRef.current ? containerRef.current.clientWidth - 48 : 760}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
