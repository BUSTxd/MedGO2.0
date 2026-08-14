'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDarkMode } from './DarkModeContext';
import styles from '@/styles/resumenHtml.module.css';

/* Mismos íconos que el botón de tema de la sidebar (DashboardSidebar.tsx):
   el interruptor es el mismo, así que debe verse igual en los dos sitios. */
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/**
 * Visor a pantalla completa de un resumen en **HTML** (no PDF).
 *
 * Mismo gesto que `PdfFullscreenModal` —portal a <body>, Esc cierra, la clase
 * global `pdf-fullscreen-active` esconde la sidebar— pero el contenido es un
 * fragmento HTML real, así que:
 *
 *  - el control no es un zoom de imagen sino el **cuerpo de letra**: al
 *    cambiarlo el texto reflowea de verdad, que es justamente lo que un PDF
 *    no puede hacer;
 *  - no se cachea en sessionStorage. La signed URL de un PDF es un string
 *    corto y cabe de sobra; esto son ~100 KB por resumen y llenaría la cuota.
 *    De eso se encarga el ETag que manda la API: el navegador revalida y
 *    recibe un 304 vacío mientras el resumen no cambie.
 *
 * El HTML se inyecta con dangerouslySetInnerHTML: lo genera el transformador
 * a partir de un export de Notion y sólo la service role key puede escribir en
 * el bucket, así que la superficie de confianza es la misma que la del PDF.
 */

const SIZES = [0.9, 1, 1.15, 1.32];
const DEFAULT_SIZE = 1; // índice de 1.0x

interface Props {
  claseId: string;
  titulo?: string;
  onClose: () => void;
}

export default function HtmlFullscreenModal({ claseId, titulo, onClose }: Props) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [sizeIndex, setSizeIndex] = useState(DEFAULT_SIZE);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { darkMode, toggleDark } = useDarkMode();

  /**
   * Cada figura de Notion viene envuelta en <a href="…avif">, que por sí solo
   * se llevaría al alumno a otra pestaña y le haría perder el punto de lectura.
   * Se intercepta el clic y se abre la figura aquí mismo, sobre el documento.
   *
   * Sólo el clic simple: con ctrl/cmd/shift o botón central se respeta el
   * gesto del navegador de abrir en pestaña nueva, que ahí sí es intencional.
   */
  const onSheetClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const link = (e.target as HTMLElement).closest?.('a');
    const href = link?.getAttribute('href');
    if (!href || !href.endsWith('.avif')) return;
    e.preventDefault();
    setLightbox(href);
  }, []);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Descarga del fragmento. `ignore` evita pisar el estado si el alumno
  // cierra el modal antes de que llegue la respuesta.
  useEffect(() => {
    let ignore = false;
    setHtml(null);
    setError(false);

    fetch(`/api/resumen-html/${claseId}`)
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then(text => { if (!ignore) setHtml(text); })
      .catch(() => { if (!ignore) setError(true); });

    return () => { ignore = true; };
  }, [claseId]);

  // Esc cierra + bloquea el scroll del fondo + esconde la sidebar.
  // Con el lightbox abierto, Esc cierra sólo la figura: cerrar el resumen
  // entero perdería el punto de lectura que el alumno acaba de dejar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightbox) setLightbox(null);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pdf-fullscreen-active');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('pdf-fullscreen-active');
    };
  }, [onClose, lightbox]);

  const bigger  = useCallback(() => setSizeIndex(i => Math.min(i + 1, SIZES.length - 1)), []);
  const smaller = useCallback(() => setSizeIndex(i => Math.max(i - 1, 0)), []);
  const reset   = useCallback(() => setSizeIndex(DEFAULT_SIZE), []);

  if (!portalTarget) return null;

  const overlay = (
    <div className={styles.overlay}>
      <div className={styles.toolbar}>
        <p className={styles.title}>{titulo ?? 'Resumen'}</p>

        <div className={styles.spacer} />

        <div className={styles.sizeGroup}>
          <button
            className={`${styles.sizeBtn} ${styles.sizeSm}`}
            onClick={smaller}
            disabled={sizeIndex === 0}
            aria-label="Reducir el tamaño del texto"
          >
            A
          </button>
          <button
            className={`${styles.sizeBtn} ${styles.sizeReset}`}
            onClick={reset}
            aria-label="Restablecer el tamaño del texto"
          >
            {Math.round(SIZES[sizeIndex] * 100)}%
          </button>
          <button
            className={`${styles.sizeBtn} ${styles.sizeLg}`}
            onClick={bigger}
            disabled={sizeIndex === SIZES.length - 1}
            aria-label="Aumentar el tamaño del texto"
          >
            A
          </button>
        </div>

        <button
          className={`${styles.themeBtn} ${darkMode ? styles.themeBtnActive : ''}`}
          onClick={toggleDark}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <button className={styles.close} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className={styles.scroller}>
        {error ? (
          <p className={styles.status}>No se pudo cargar el resumen. Vuelve a intentarlo.</p>
        ) : html === null ? (
          <p className={styles.status}>Cargando resumen…</p>
        ) : (
          <article
            className={styles.sheet}
            // String, no número: para una custom property React entrega el
            // valor tal cual, y un número suelto aquí es más frágil de leer
            // dentro del calc() que la escala.
            style={{ ['--s' as string]: String(SIZES[sizeIndex]) }}
            onClick={onSheetClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {/* ── Figura ampliada ── */}
      {lightbox && (
        <div
          className={styles.lightbox}
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Figura ampliada"
        >
          <button
            className={styles.lightboxClose}
            onClick={() => setLightbox(null)}
            aria-label="Cerrar la figura"
          >
            ✕
          </button>
          {/* Misma URL que la figura del documento: ya está en caché del
              navegador (immutable), así que se pinta sin volver a descargarla.
              next/image no aplica: el HTML es contenido remoto inyectado. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.lightboxImg} src={lightbox} alt="" />
          <span className={styles.lightboxHint}>Haz clic fuera o pulsa Esc para cerrar</span>
        </div>
      )}
    </div>
  );

  return createPortal(overlay, portalTarget);
}
