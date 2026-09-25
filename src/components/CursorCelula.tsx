'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SPRITE_PUNTERO } from '@/lib/esfuerzo';
import styles from '@/styles/cursorCelula.module.css';

/**
 * Puntero del mouse con la célula madre (premio del panel «Tu esfuerzo»).
 *
 * Un `cursor: url()` no se anima y el navegador lo cambia por la mano sobre
 * enlaces y botones, así que la célula es una capa fija que sigue al mouse y el
 * cursor del sistema se oculta en toda la página mientras está activa.
 *
 * Recursos mínimos: sin la preferencia no se monta nada ni se baja la imagen;
 * con ella, la tira (~2 KB, immutable) se pide una vez y queda en caché para
 * todas las páginas y pestañas. Las otras pestañas se enteran por `storage`.
 */
const CLAVE = 'medgo-cursor-celula';
const EVENTO = 'medgo-cursor-celula';
// Punto activo: el centro de la célula dentro del fotograma de 32×32.
const HX = 16;
const HY = 14;
const INTERACTIVOS = 'a, button, [role="button"], input, select, textarea, label, summary';

function leer(): boolean {
  try { return localStorage.getItem(CLAVE) === '1'; } catch { return false; }
}

export function setCursorCelula(activo: boolean) {
  try {
    if (activo) localStorage.setItem(CLAVE, '1');
    else localStorage.removeItem(CLAVE);
  } catch {}
  // `storage` solo llega a las OTRAS pestañas: esta se avisa a sí misma.
  window.dispatchEvent(new Event(EVENTO));
}

export function useCursorCelula(): boolean {
  const [activo, setActivo] = useState(false);
  useEffect(() => {
    const sync = () => setActivo(leer());
    const onStorage = (e: StorageEvent) => { if (e.key === CLAVE) sync(); };
    sync();
    window.addEventListener(EVENTO, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENTO, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return activo;
}

/** Lo monta el shell del dashboard. Solo con mouse: en táctil no hay puntero. */
export default function CursorCelula() {
  const activo = useCursorCelula();
  const [conMouse, setConMouse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setConMouse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return activo && conMouse ? <PunteroAnimado /> : null;
}

function PunteroAnimado() {
  const ref = useRef<HTMLDivElement>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = 0, y = 0, raf = 0;
    const pintar = () => {
      raf = 0;
      el.style.transform = `translate3d(${x - HX}px, ${y - HY}px, 0)`;
    };
    const ocultarCelula = () => { el.dataset.visible = 'false'; };

    /**
     * Engancha el puntero a un documento: el de la página o el de un iframe del
     * mismo origen (las simulaciones de public/simulaciones/, como el frotis).
     * Los eventos dentro de un iframe no llegan a la página, así que sin esto la
     * célula se quedaba quieta en el borde y dentro volvía la flecha del sistema.
     * `origen` da la esquina del iframe en la página para traducir coordenadas.
     */
    const enganchar = (doc: Document, origen: () => { left: number; top: number }) => {
      const estilo = doc.createElement('style');
      estilo.textContent = '*, *::before, *::after { cursor: none !important; }';
      doc.head.appendChild(estilo);

      const mover = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') { ocultarCelula(); return; }
        const o = origen();
        x = o.left + e.clientX;
        y = o.top + e.clientY;
        el.dataset.visible = 'true';
        // Sin la mano del sistema, el aviso de «esto se puede pulsar» es la célula.
        el.dataset.sobre = (e.target as Element | null)?.closest?.(INTERACTIVOS) ? 'true' : 'false';
        if (!raf) raf = requestAnimationFrame(pintar);
      };
      const pulsar = () => { el.dataset.pulsado = 'true'; };
      const soltar = () => { el.dataset.pulsado = 'false'; };
      // Sin destino = el mouse salió de la ventana. Al cruzar entre la página y
      // un iframe el otro documento vuelve a mostrarla en su primer pointermove.
      const salir = (e: MouseEvent) => { if (!e.relatedTarget) ocultarCelula(); };

      doc.addEventListener('pointermove', mover, { passive: true });
      doc.addEventListener('pointerdown', pulsar, { passive: true });
      doc.addEventListener('pointerup', soltar, { passive: true });
      doc.addEventListener('mouseout', salir);
      return () => {
        doc.removeEventListener('pointermove', mover);
        doc.removeEventListener('pointerdown', pulsar);
        doc.removeEventListener('pointerup', soltar);
        doc.removeEventListener('mouseout', salir);
        estilo.remove();
      };
    };

    const soltarPagina = enganchar(document, () => ({ left: 0, top: 0 }));

    // Iframes: se enganchan en cada `load` (recargar o navegar dentro cambia su
    // documento). Uno de otro origen lanza al leer contentDocument: se ignora y
    // conserva su propio cursor.
    const iframes = new Map<HTMLIFrameElement, { onLoad: () => void; soltar?: () => void }>();
    const engancharIframe = (iframe: HTMLIFrameElement) => {
      const reg = iframes.get(iframe);
      reg?.soltar?.();
      if (reg) reg.soltar = undefined;
      let doc: Document | null = null;
      try { doc = iframe.contentDocument; } catch { return; }
      if (!doc?.head || doc.URL === 'about:blank') return;
      const soltar = enganchar(doc, () => {
        const r = iframe.getBoundingClientRect();
        return { left: r.left + iframe.clientLeft, top: r.top + iframe.clientTop };
      });
      const actual = iframes.get(iframe);
      if (actual) actual.soltar = soltar;
    };
    const vigilar = (iframe: HTMLIFrameElement) => {
      if (iframes.has(iframe)) return;
      const onLoad = () => engancharIframe(iframe);
      iframes.set(iframe, { onLoad });
      iframe.addEventListener('load', onLoad);
      engancharIframe(iframe);
    };
    const olvidar = (iframe: HTMLIFrameElement) => {
      const reg = iframes.get(iframe);
      if (!reg) return;
      iframe.removeEventListener('load', reg.onLoad);
      reg.soltar?.();
      iframes.delete(iframe);
    };
    document.querySelectorAll('iframe').forEach(vigilar);
    // Las páginas del dashboard se montan al navegar sin recargar: el iframe del
    // frotis aparece después de este efecto.
    const observador = new MutationObserver((cambios) => {
      for (const c of cambios) {
        c.addedNodes.forEach((n) => {
          if (n instanceof HTMLIFrameElement) vigilar(n);
          else if (n instanceof Element) n.querySelectorAll('iframe').forEach(vigilar);
        });
        c.removedNodes.forEach((n) => {
          if (n instanceof HTMLIFrameElement) olvidar(n);
          else if (n instanceof Element) n.querySelectorAll('iframe').forEach(olvidar);
        });
      }
    });
    observador.observe(document.body, { childList: true, subtree: true });

    // Pulsar dentro de un iframe le pasa el foco y dispara `blur` en la página:
    // eso no es irse de la ventana.
    const perderFoco = () => {
      if (document.activeElement?.tagName !== 'IFRAME') ocultarCelula();
    };
    window.addEventListener('blur', perderFoco);

    return () => {
      soltarPagina();
      observador.disconnect();
      [...iframes.keys()].forEach(olvidar);
      window.removeEventListener('blur', perderFoco);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [montado]);

  if (!montado) return null;
  // Portal a <body>: fuera de [data-shell], así la tarjeta no lo desenfoca.
  // Dos capas a propósito: la de fuera solo se desplaza y la de dentro solo
  // escala. Con las dos cosas en un mismo elemento, `scale` se aplica DESPUÉS
  // del translate del transform y multiplica también la distancia a la esquina:
  // al pasar por un botón la célula salía disparada lejos del click real.
  return createPortal(
    <div ref={ref} className={styles.puntero} data-visible="false" aria-hidden="true">
      <div className={styles.sprite} style={{ backgroundImage: `url('${SPRITE_PUNTERO}')` }} />
    </div>,
    document.body,
  );
}
