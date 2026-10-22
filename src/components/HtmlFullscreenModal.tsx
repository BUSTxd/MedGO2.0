'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

const bloquear = (e: React.SyntheticEvent) => e.preventDefault();
import { useDarkMode } from './DarkModeContext';
import { useIA } from './ia/IAContext';
import PanelIA, { IconoIA, type ApiPanelIA } from './ia/PanelIA';
import BurbujaSeleccion from './ia/BurbujaSeleccion';
import DocumentoResumen from './resumen/DocumentoResumen';
import type { PedidoIA } from './ia/useChatIA';
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
  /**
   * Dónde abrir: comienzo de un título (h1-h4) o de una celda de tabla. Admite
   * ruta con «›» (`GENÉTICAS › Ejemplos`). Sin él, desde arriba.
   */
  seccion?: string;
  /**
   * Con `seccion`, enseña SOLO esa sección (desde una pregunta del banqueo) y
   * una barra para ir cargando la que la contiene, hasta el resumen entero.
   */
  soloSeccion?: boolean;
  onClose: () => void;
}

export default function HtmlFullscreenModal({ claseId, titulo, seccion, soloSeccion, onClose }: Props) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [sizeIndex, setSizeIndex] = useState(DEFAULT_SIZE);
  const { darkMode, toggleDark } = useDarkMode();
  const sheetRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  /* MedGO IA. El «modo IA» abre la selección del texto (sólo entonces) y la
     columna del panel; el chat vive dentro de `PanelIA` y se le habla por
     `iaRef`, para que una respuesta en curso no re-renderice este visor.
     Copiar sigue bloqueado igual que siempre (onCopy, teclas, impresión). */
  const ia = useIA();
  const [modoIA, setModoIA] = useState(false);
  const iaRef = useRef<ApiPanelIA>(null);
  const pedirIA = useCallback((p: PedidoIA) => {
    setModoIA(true);
    iaRef.current?.pedir(p);
  }, []);
  const alternarIA = useCallback(() => {
    setModoIA((m) => {
      if (m) window.getSelection()?.removeAllRanges();
      return !m;
    });
  }, []);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  /* Bloquear el scroll del fondo y esconder la sidebar dura lo que dura el
     visor, así que va en un efecto **sin dependencias**. Estaba junto al
     listener de Esc, que sí depende de `lightbox`, y eso hacía que abrir o
     cerrar una figura quitara y volviera a poner la clase global del <body>:
     un reflow del dashboard entero por cada clic en una imagen, además de
     otra ocasión para que el navegador se dejara capas sin repintar. */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('pdf-fullscreen-active');
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.classList.remove('pdf-fullscreen-active');
    };
  }, []);

  const [ampliar, setAmpliar] = useState(0);
  const [recortado, setRecortado] = useState(false);
  const conRecorte = useCallback((r: boolean) => setRecortado(r), []);
  // Esc cierra el resumen. Con una figura ampliada la cierra sólo a ella
  // `DocumentoResumen`, que intercepta la tecla antes de que llegue aquí.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Copiar, seleccionar todo, guardar, imprimir, ver código: fuera.
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 's', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return;
      }
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const bigger  = useCallback(() => setSizeIndex(i => Math.min(i + 1, SIZES.length - 1)), []);
  const smaller = useCallback(() => setSizeIndex(i => Math.max(i - 1, 0)), []);
  const reset   = useCallback(() => setSizeIndex(DEFAULT_SIZE), []);

  if (!portalTarget) return null;

  const overlay = (
    <div
      className={`${styles.overlay} ${modoIA ? styles.modoIA : ''}`}
      onCopy={bloquear}
      onCut={bloquear}
      onContextMenu={bloquear}
      onDragStart={bloquear}
    >
      <div className={styles.toolbar}>
        <p className={styles.title}>{titulo ?? 'Resumen'}</p>

        <div className={styles.spacer} />

        {ia && (
          <button
            className={`${styles.iaBtn} ${modoIA ? styles.iaBtnActivo : ''}`}
            onClick={ia.puedeUsar ? alternarIA : undefined}
            aria-disabled={!ia.puedeUsar}
            aria-pressed={modoIA}
            title={ia.puedeUsar
              ? (modoIA ? 'Cerrar MedGO IA' : 'Subraya y pregúntale a la IA')
              : 'MedGO IA — próximamente'}
          >
            <IconoIA size={16} />
            <span>IA</span>
            {!ia.puedeUsar && <small>Pronto</small>}
          </button>
        )}

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

      <div className={styles.cuerpo}>
        <div className={styles.scroller} ref={scrollerRef}>
          <DocumentoResumen
            claseId={claseId}
            escala={SIZES[sizeIndex]}
            scrollerRef={scrollerRef}
            sheetRef={sheetRef}
            seccion={seccion}
            soloSeccion={soloSeccion}
            ampliar={ampliar}
            onRecortado={conRecorte}
            estadoClass={styles.status}
            onFiguraIA={ia?.puedeUsar ? (figura) => pedirIA({ accion: 'figura', figura }) : undefined}
            iconoFiguraIA={<IconoIA size={16} />}
          />
          {soloSeccion && recortado && (
            <div className={styles.recorteBarra}>
              <span className={styles.recorteTexto}>Estás viendo solo la parte que responde la pregunta.</span>
              <div className={styles.recorteBotones}>
                <button type="button" className={styles.recorteBoton} onClick={() => setAmpliar((a) => a + 1)}>
                  Cargar más
                </button>
                <button type="button" className={styles.recorteBotonSec} onClick={() => setAmpliar(99)}>
                  Ver el resumen completo
                </button>
              </div>
            </div>
          )}
        </div>

        {ia?.puedeUsar && (
          <PanelIA
            modo="embebido"
            abierto={modoIA}
            puedeUsar
            claseId={claseId}
            onCerrar={alternarIA}
            api={iaRef}
          />
        )}
      </div>

      {ia?.puedeUsar && <BurbujaSeleccion sheetRef={sheetRef} activo={modoIA} onPedir={pedirIA} />}

    </div>
  );

  return createPortal(overlay, portalTarget);
}
