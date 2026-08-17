'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

/**
 * `max-width` de un bloque del envase «páginas» → px reales.
 *
 * ⚠️ Viene en % de la hoja, y **`getComputedStyle` no lo resuelve**: para
 * `max-width` el valor resuelto sigue siendo el valor computado, o sea el
 * porcentaje. Leerlo de ahí devolvía `"84.38287%"`, que `parseFloat` convierte
 * en 84.38 — y tomarlo por píxeles aplastaba una frase entera de 670 px dentro
 * de 84 px: ilegible. Se lee del estilo inline y se resuelve a mano.
 */
const maxEnPx = (valor: string, pagina: number) => {
  if (!valor) return NaN;
  return valor.endsWith('%') ? (parseFloat(valor) / 100) * pagina : parseFloat(valor);
};

/* Qué cuenta como "figura de contenido" que el clic puede ampliar, por envase.
   Lista blanca a propósito: en el envase en capas la tinta y el resaltador
   también son <img> a página completa, y abrir una de ellas en el lightbox no
   tendría ningún sentido. El CSS del hover en `resumenHtml.module.css` sigue
   esta misma lista — si se añade un envase, hay que tocar los dos sitios. */
/* En «documento de flujo» vale cualquier <img>: ahí no existen las capas a
   página completa que obligan a la lista blanca en el envase en capas, y
   exigir `figure` dejaba mudas las imágenes que el export no envuelve (en Ta7,
   una de dos; en Ta10, dos de once). */
/* Las del envase en capas van acotadas a `.capas`, igual que en el CSS: sus
   nombres son genéricos y `.figure` es también el de las figuras de un
   documento de flujo. */
const FIGURAS = [
  '.capas img.pdf-image',
  '.capas .pdf-image img',
  '.capas .image-layer img',
  '.capas .figure img',
  '.capas img.asset',
  '.doc-flujo img',
  '.doc-paginas .figure img',
].join(', ');

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Última escala realmente escrita en el DOM (ver `fit()`).
  const aplicado = useRef<number | null>(null);

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
   * Y una tercera forma: «páginas auto-escaladas» (`.doc-paginas`), hojas de
   * proporción fija que se escalan solas por container query. Trae sus propias
   * hojas blancas con sombra, así que —como capas— no debe ir dentro de la
   * tarjeta de lectura del visor, que la enmarcaría por segunda vez.
   *
   * Es una bandera aparte de `esCapas` a propósito: comparte la hoja suelta,
   * pero **no** el escalado. Reutilizar `esCapas` habría metido este documento
   * en el `fit()`, que le buscaría una `.page` de altura fija que no tiene.
   */
  const esPaginas = html !== null && html.includes('class="doc-paginas"');
  const hojaSuelta = esCapas || esPaginas;

  /**
   * ⚠️ El objeto de `dangerouslySetInnerHTML` TIENE que ser estable.
   *
   * React no compara el string: en `updateProperties` recorre las props y
   * decide con `nextProp === lastProp`, una comparación **por referencia**.
   * Un `{{ __html: html }}` escrito en el JSX es un objeto nuevo en cada
   * render, así que la comparación siempre falla y React ejecuta
   * `domElement.innerHTML = html` otra vez — aunque el string sea idéntico.
   *
   * Eso **destruye y reconstruye el documento entero** en cada re-render del
   * visor (abrir una figura, cambiar de tema, tocar A+/A−). Y como el
   * escalado del envase "en capas" son estilos inline sobre esos nodos, la
   * `.page` nueva nace sin `transform` y el `.page-shell` sin `height`: la
   * página es `position:absolute` y no aporta altura, así que el contenedor
   * se queda en altura cero, el navegador **clampa el scroll a 0** y el
   * alumno vuelve al principio del resumen cada vez que amplía una imagen.
   *
   * Con el objeto memoizado React ni siquiera entra a `setProp`: el HTML se
   * escribe una sola vez, cuando `html` cambia de verdad.
   */
  const contenido = useMemo(() => ({ __html: html ?? '' }), [html]);

  /**
   * Ampliar una figura sin salir del documento. Cada envase las sirve
   * distinto, así que hay dos caminos:
   *
   *  - **Notion**: cada figura viene envuelta en <a href="…avif">, que por sí
   *    solo se llevaría al alumno a otra pestaña y le haría perder el punto de
   *    lectura. Se intercepta el enlace.
   *  - **Capas y «documento de flujo»**: las figuras son <img> sueltas, sin
   *    enlace. En capas llevan además el texto en posición absoluta por encima
   *    (los <span>, y en la variante «pdf-page» también los bloques
   *    reconstruidos sobre la propia figura), así que buscar por `e.target`
   *    fallaría en cuanto el clic cayera sobre una letra: se mira **toda la
   *    pila bajo el cursor** y se toma la primera figura que aparezca. En
   *    «documento de flujo» no hay nada encima y `e.target` bastaría, pero
   *    pasa por la misma vía para no tener dos comportamientos que mantener.
   *
   * El selector es una **lista blanca de figuras de contenido**, no `img` a
   * secas: las capas a página completa (tinta, resaltador) son <img> y jamás
   * deben abrirse como si fueran una figura. Al añadir un envase nuevo hay que
   * añadir aquí su forma de figura, o el clic no hará nada — que es justo lo
   * que le pasó al Taller 1 recién publicado.
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
        el instanceof HTMLImageElement && el.matches(FIGURAS));
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
      const escala = `scale(${s})`;
      const alto = `${H * s}px`;

      /* Si el escalado ya está puesto, NO se vuelve a escribir.
       *
       * El observer dispara `fit()` ante cualquier cambio de tamaño del shell,
       * y muchas veces lo que encuentra es el escalado intacto: entonces
       * reescribir `transform` y `height` con el MISMO valor sólo sirve para
       * invalidar el layout del documento entero —miles de nodos absolutos— y
       * arriesgarse a que el contenedor pierda el punto de lectura.
       *
       * Se compara contra `aplicado` (un ref, así sobrevive a los re-renders) y
       * **no** contra `page.style.transform`: el navegador re-serializa lo que
       * se le escribe —`scale(0.6404077217929812)` vuelve como
       * `scale(0.640408)`— y esa comparación sería siempre falsa, con lo que la
       * guarda no serviría de nada.
       *
       * Lo que sí se mira del DOM es si el escalado **sigue ahí**: en cuanto
       * `transform` o `height` vengan vacíos, los estilos se perdieron y hay
       * que re-aplicarlos aunque la escala no haya cambiado. Con el HTML
       * memoizado eso ya no debería pasar nunca; se deja como red de
       * seguridad, porque el modo de fallo es que el documento desaparezca. */
      if (aplicado.current === s && page.style.transform && shell.style.height) return;
      aplicado.current = s;

      const scroller = scrollerRef.current;
      const scrollPrevio = scroller?.scrollTop ?? 0;
      const altoPrevio = scroller?.scrollHeight ?? 0;

      page.style.transform = escala;
      shell.style.height = alto;
      // La página entera va escalada, así que un px de dentro no es un px en
      // pantalla. Los efectos que sí deben medirse en pantalla —la elevación y
      // la sombra del hover de una figura— se dividen por esto en el CSS; sin
      // ello se verían a la mitad, que es justo lo que las hacía parecer
      // distintas de las figuras de los resúmenes de Notion.
      page.style.setProperty('--fit', String(s));

      /* Cuando el escalado sí cambia (A+/A−, girar el móvil) el documento
       * crece o encoge y el scroll en píxeles deja de significar lo mismo: se
       * traslada en proporción para que el alumno siga viendo el mismo punto
       * del texto, en vez de aparecer en otro sitio del documento. */
      if (scroller && scrollPrevio > 0 && altoPrevio > 0) {
        const altoNuevo = scroller.scrollHeight;
        if (altoNuevo !== altoPrevio) {
          scroller.scrollTop = (scrollPrevio * altoNuevo) / altoPrevio;
        } else if (scroller.scrollTop !== scrollPrevio) {
          scroller.scrollTop = scrollPrevio;
        }
      }
    };

    const ro = new ResizeObserver(fit);
    ro.observe(shell);
    fit();
    return () => ro.disconnect();

    /* Aquí NO van `lightbox` ni `darkMode`.
     *
     * Estuvieron, y era un parche a otro problema: como el objeto de
     * `dangerouslySetInnerHTML` se recreaba en cada render, cualquier
     * re-render rehacía el documento inyectado y se llevaba por delante estos
     * estilos inline —dejando el shell a altura cero y el documento en
     * blanco—, así que el efecto tenía que volver a correr para repararlo.
     *
     * Con el HTML memoizado los nodos ya no se rehacen, de modo que el
     * escalado sólo depende de lo que de verdad lo cambia: el envase, el
     * documento y el zoom. Volver a meterlas haría correr el efecto —y
     * reenganchar el ResizeObserver— cada vez que se abre una figura, sin
     * nada que ganar. */
  }, [esCapas, html, sizeIndex]);

  /**
   * Envase «páginas auto-escaladas»: ajuste tipográfico.
   *
   * Este export reconstruye el PDF palabra a palabra, cada una en su
   * coordenada. El ancho que ocupa una palabra en Arial o Times NO es el que
   * medía en el PDF, así que el conversor guarda el ancho objetivo en
   * `--target-w` (en % de la página) y trae un `<script>` que estira o encoge
   * cada palabra con `scaleX` hasta cuadrarlo. Sin él las palabras largas se
   * montan sobre la siguiente y las cortas dejan huecos.
   *
   * Ese `<script>` no se ejecuta al inyectarse con `dangerouslySetInnerHTML`
   * —la misma razón por la que el `fit()` de capas vive aquí—, de modo que
   * está portado. Dos diferencias con el original, las dos por rendimiento
   * sobre ~1900 nodos: se mide en un solo pase (limpiar todos los transform →
   * leer todos los anchos → escribir todos), en vez de forzar un reflujo por
   * palabra; y el ancho de página se lee una vez por hoja.
   */
  useEffect(() => {
    if (!esPaginas) return;
    const sheet = sheetRef.current;
    const doc = sheet?.querySelector<HTMLElement>('.doc-paginas');
    if (!doc) return;

    let ultimoAncho = -1;
    let vivo = true;

    const ajustar = () => {
      const ancho = doc.clientWidth;
      // Escribir transforms no cambia el ancho del documento, así que no hay
      // bucle observer→ajuste→observer; la guarda evita el trabajo inútil.
      if (!ancho || ancho === ultimoAncho) return;
      ultimoAncho = ancho;

      const nodos = Array.from(doc.querySelectorAll<HTMLElement>('.word, .patch'));
      for (const el of nodos) el.style.transform = 'none';

      const anchoDe = new Map<Element, number>();
      const medidas = nodos.map((el) => {
        const hoja = el.closest('.pdf-page');
        if (hoja && !anchoDe.has(hoja)) anchoDe.set(hoja, hoja.getBoundingClientRect().width);
        const pagina = hoja ? anchoDe.get(hoja)! : 0;
        /* El ancho natural de un `.patch` NO se puede leer de su caja: su
           propio `max-width` la recorta, y como va en `nowrap` el texto se
           sale sin ensancharla. Medido así, un bloque que necesita 741 px
           dentro de 690 devuelve 690 —«ya cabe»— y se publica desbordado.
           `scrollWidth` sí da el ancho del contenido. (El export original
           tiene este fallo; las palabras no lo sufren porque no llevan tope.) */
        const caja = el.getBoundingClientRect().width;
        return {
          natural: Math.max(caja, el.scrollWidth),
          pagina,
          // El objetivo de un `.patch` (un bloque reescrito, no una palabra)
          // es su `max-width`, y sólo se encoge: nunca se estira.
          maxima: el.classList.contains('patch') ? maxEnPx(el.style.maxWidth, pagina) : NaN,
        };
      });

      nodos.forEach((el, i) => {
        const { natural, pagina, maxima } = medidas[i];
        if (!natural || !pagina) return;
        if (!Number.isNaN(maxima)) {
          if (natural > maxima && maxima > 0) {
            el.style.transformOrigin = 'left top';
            el.style.transform = `scaleX(${maxima / natural})`;
          }
          return;
        }
        const pct = parseFloat(getComputedStyle(el).getPropertyValue('--target-w'));
        if (!pct) return;
        const objetivo = (pct / 100) * pagina;
        // Los mismos topes que el export: fuera de ellos el conversor midió
        // mal y deformar la palabra se nota más que el desajuste.
        el.style.transform = `scaleX(${Math.max(0.55, Math.min(1.65, objetivo / natural))})`;
      });
    };

    // Las medidas dependen de la fuente ya cargada; con la de reserva saldrían
    // unos factores y con la definitiva otros.
    const arranque = document.fonts?.ready ?? Promise.resolve();
    arranque.then(() => {
      if (!vivo) return;
      ultimoAncho = -1;   // el ancho no cambió, las medidas sí: hay que rehacerlo
      ajustar();
    });

    const ro = new ResizeObserver(ajustar);
    ro.observe(doc);
    ajustar();
    return () => { vivo = false; ro.disconnect(); };
  }, [esPaginas, html]);

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

      <div className={styles.scroller} ref={scrollerRef}>
        {error ? (
          <p className={styles.status}>No se pudo cargar el resumen. Vuelve a intentarlo.</p>
        ) : html === null ? (
          <p className={styles.status}>Cargando resumen…</p>
        ) : (
          <article
            ref={sheetRef}
            className={`${styles.sheet} ${hojaSuelta ? styles.sheetCapas : ''}`}
            // String, no número: para una custom property React entrega el
            // valor tal cual, y un número suelto aquí es más frágil de leer
            // dentro del calc() que la escala.
            style={{ ['--s' as string]: String(SIZES[sizeIndex]) }}
            onClick={onSheetClick}
            dangerouslySetInnerHTML={contenido}
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
