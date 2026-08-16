'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const sheetRef = useRef<HTMLElement>(null);

  /**
   * Un resumen puede venir en dos envases (ver CLAUDE.md): el flujo de un
   * export de Notion, que reflowea, o un **PDF reconstruido en capas**, que
   * es una página de tamaño fijo con el texto en posición absoluta.
   *
   * Se decide sobre el string, no con estado: si no, el primer frame se
   * pintaría con los estilos del envase equivocado.
   */
  const esCapas = html !== null && html.includes('class="capas"');

  /**
   * Ampliar una figura sin salir del documento. Los dos envases la sirven
   * distinto, así que hay dos caminos:
   *
   *  - **Notion**: cada figura viene envuelta en <a href="…avif">, que por sí
   *    solo se llevaría al alumno a otra pestaña y le haría perder el punto de
   *    lectura. Se intercepta el enlace.
   *  - **Capas**: las figuras son <img> sueltas, sin enlace, y encima llevan
   *    el texto en posición absoluta (los <span>, y en la variante «pdf-page»
   *    también los bloques reconstruidos sobre la propia figura). Buscar por
   *    `e.target` fallaría en cuanto el clic cayera sobre una letra, así que
   *    se mira **toda la pila bajo el cursor** y se toma la primera figura que
   *    aparezca. Las capas a página completa (tinta y resaltador) no casan el
   *    selector, de modo que nunca se abren como si fueran una figura.
   *
   * Sólo el clic simple: con ctrl/cmd/shift o botón central se respeta el
   * gesto del navegador de abrir en pestaña nueva, que ahí sí es intencional.
   */
  const onSheetClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const href = (e.target as HTMLElement).closest?.('a')?.getAttribute('href');
    if (href?.endsWith('.avif')) {
      e.preventDefault();
      setLightbox(href);
      return;
    }

    // El texto de este envase es real y seleccionable: si el alumno acaba de
    // seleccionar algo, el clic que cierra la selección no debe abrir nada.
    if (window.getSelection()?.toString()) return;

    const figura = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((el): el is HTMLImageElement =>
        el instanceof HTMLImageElement && el.matches('img.pdf-image, .pdf-image img, .image-layer img'));
    if (!figura?.src) return;
    e.preventDefault();
    setLightbox(figura.src);
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

  // Con el lightbox abierto, Esc cierra sólo la figura: cerrar el resumen
  // entero perdería el punto de lectura que el alumno acaba de dejar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightbox) setLightbox(null);
      else onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, lightbox]);

  /**
   * Escalado del envase "en capas".
   *
   * El export trae un <script> que hace esto mismo, pero el HTML se inyecta
   * con dangerouslySetInnerHTML y **los <script> así insertados no se
   * ejecutan**: sin esto la página quedaría clavada a su ancho original
   * (~1500 px) desbordando el visor.
   *
   * La escala multiplica el ajuste al contenedor por SIZES[sizeIndex], así
   * que A−/A+ funcionan como un zoom real —imprescindible en móvil, donde el
   * ajuste deja la letra muy pequeña— y el desbordamiento lo absorbe el
   * `overflow:auto` de .page-shell.
   */
  useEffect(() => {
    if (!esCapas) return;
    const sheet = sheetRef.current;
    const capas = sheet?.querySelector<HTMLElement>('.capas');
    const shell = sheet?.querySelector<HTMLElement>('.page-shell');
    const page  = sheet?.querySelector<HTMLElement>('.page');
    if (!capas || !shell || !page) return;

    const cs = getComputedStyle(capas);
    const W = parseFloat(cs.getPropertyValue('--page-w'));
    const H = parseFloat(cs.getPropertyValue('--page-h'));
    if (!W || !H) return;

    // Ajustar la altura del shell vuelve a disparar el observer; sin esta
    // guarda el par (fit → resize → fit) se realimenta en bucle.
    let ultimoAncho = -1;
    const fit = () => {
      const ancho = shell.clientWidth;
      if (ancho === ultimoAncho) return;
      ultimoAncho = ancho;
      const s = (ancho / W) * SIZES[sizeIndex];
      page.style.transform = `scale(${s})`;
      shell.style.height = `${H * s}px`;
      // La página entera va escalada, así que un px de dentro no es un px en
      // pantalla. Los efectos que sí deben medirse en pantalla —la elevación y
      // la sombra del hover de una figura— se dividen por esto en el CSS; sin
      // ello se verían a la mitad, que es justo lo que las hacía parecer
      // distintas de las figuras de los resúmenes de Notion.
      page.style.setProperty('--fit', String(s));
    };

    const ro = new ResizeObserver(fit);
    ro.observe(shell);
    fit();
    return () => ro.disconnect();

    /* `darkMode` y `lightbox` entran a propósito aunque no se usen dentro.
     *
     * Todo el escalado son **estilos inline sobre nodos del HTML inyectado**,
     * y esos nodos no los controla React: si un re-render vuelve a escribir el
     * `dangerouslySetInnerHTML`, la `.page` nueva nace sin `transform` y el
     * `.page-shell` nuevo sin `height`. Como la página es `position:absolute`
     * no aporta altura a su contenedor, así que el shell se queda en **altura
     * cero y el documento desaparece por completo** — no descolocado, en
     * blanco. Y el ResizeObserver seguía observando el nodo viejo, ya
     * desconectado, de modo que `fit()` no volvía a correr nunca: el documento
     * no se recuperaba ni redimensionando la ventana.
     *
     * Cambiar el tema desde la barra del visor es exactamente ese caso, porque
     * `darkMode` viene de un contexto y re-renderiza el modal entero. Con la
     * dependencia aquí, el efecto vuelve a buscar los nodos (`querySelector`
     * los toma frescos), reengancha el observer y re-aplica el escalado. */
  }, [esCapas, html, sizeIndex, lightbox, darkMode]);

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
            ref={sheetRef}
            className={`${styles.sheet} ${esCapas ? styles.sheetCapas : ''}`}
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
