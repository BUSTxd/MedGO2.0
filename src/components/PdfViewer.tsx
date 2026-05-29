'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Local copy of the worker — avoids CDN dependency and version mismatch
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// pdfjs v5 moved JPEG2000 decoding to WASM (openjpeg.wasm). Without it, images
// compressed as JPX (typical output of PDF compressors like Smallpdf/ILovePDF)
// render blank. cMaps + standardFontDataUrl prevent missing-font issues with
// PDFs exported from Canva/Acrobat. Defined outside the component so the
// reference is stable and the Document doesn't reload on every render.
const PDF_OPTIONS = {
  cMapUrl: '/pdfjs/cmaps/',
  cMapPacked: true,
  standardFontDataUrl: '/pdfjs/standard_fonts/',
  wasmUrl: '/pdfjs/wasm/',
};

// Force min DPR=2 so canvases stay crisp under browser/OS zoom on non-Retina
// displays (Windows laptops default DPR=1 → blurry on pinch zoom).
const RENDER_DPR =
  typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2;

interface Props {
  claseId: string;
  className?: string;
  loadingClass?: string;
  pageWrapClass?: string;
  /** Override the auto-measured width. When set, the component skips container measuring. */
  widthOverride?: number;
  /** Multiplier applied to the page width (for zoom). Default 1. */
  scale?: number;
}

// Margen de seguridad: si la signed URL caduca en menos de 15 min, la
// consideramos vencida y pedimos una nueva. Evita un edge case donde la URL
// expira durante la lectura del PDF.
const EXPIRY_BUFFER_MS = 15 * 60 * 1000;

interface SignedUrlEntry { url: string; expiresAt: number }

// Bump del prefijo invalida URLs en sessionStorage cuando re-subimos PDFs a un
// nuevo path (ej. .v2.pdf). Sin esto, usuarios con sesión activa seguirían
// recibiendo la URL vieja que apunta al archivo roto.
const cacheKey = (claseId: string) => `resumen-url-v2-${claseId}`;

const readCache = (claseId: string): SignedUrlEntry | null => {
  try {
    const raw = sessionStorage.getItem(cacheKey(claseId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SignedUrlEntry;
    if (!parsed.url || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt - Date.now() < EXPIRY_BUFFER_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (claseId: string, entry: SignedUrlEntry) => {
  try { sessionStorage.setItem(cacheKey(claseId), JSON.stringify(entry)); } catch {}
};

export default function PdfViewer({
  claseId,
  className,
  loadingClass,
  pageWrapClass,
  widthOverride,
  scale = 1,
}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resuelve la URL del PDF: primero sessionStorage (si esta vigente), si no
  // pide una signed URL al backend. La signed URL apunta directo al CDN de
  // Supabase, asi react-pdf descarga sin pasar por Vercel.
  useEffect(() => {
    let cancelled = false;
    const cached = readCache(claseId);
    if (cached) {
      setPdfUrl(cached.url);
      return;
    }
    fetch(`/api/resumen/${claseId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: SignedUrlEntry) => {
        if (cancelled) return;
        if (data?.url && typeof data.expiresAt === 'number') {
          writeCache(claseId, data);
          setPdfUrl(data.url);
        } else {
          setError(true);
        }
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [claseId]);

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

  if (!pdfUrl) {
    return <div className={loadingClass}>Cargando resumen…</div>;
  }

  const baseWidth = widthOverride
    ?? (containerRef.current ? containerRef.current.clientWidth - 48 : 760);
  const pageWidth = baseWidth * scale;

  return (
    <div
      ref={containerRef}
      className={className}
      // Disable right-click context menu
      onContextMenu={e => e.preventDefault()}
    >
      <Document
        file={pdfUrl}
        options={PDF_OPTIONS}
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
              width={pageWidth}
              devicePixelRatio={RENDER_DPR}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
