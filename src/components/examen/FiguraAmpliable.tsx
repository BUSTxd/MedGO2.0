'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import type { ExamQuestion } from '@/lib/examen/payload';
import styles from '@/styles/examRunner.module.css';

/**
 * Figuras de una pregunta y su visor a pantalla completa (zoom, arrastre), fuera
 * del ExamRunner para que otros motores (el juego del ENCIB) los usen sin
 * cargar el runner entero.
 */

export function IconoLupa() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="2" />
      <path d="M15.8 15.8 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8.6v4.8M8.6 11h4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconoCerrar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Visor de imagen a pantalla completa ──────────────────────────────────── */

export interface Ampliada {
  src: string;
  alt: string;
  w: number;
  h: number;
}

const ESC_MIN = 1;
const ESC_MAX = 5;

/**
 * Lightbox de las micrografías. Va por **portal a `<body>`**: el examen vive
 * dentro de `.microPage`, que lleva `overflow: hidden`, y montarlo ahí dentro
 * dejaría el visor recortado por la caja del panel.
 *
 * La cáscara es oscura en los dos temas, igual que el visor de PDF: lo que se
 * mira es una micrografía, y un marco claro alrededor le roba contraste.
 */
export function VisorImagen({ img, onClose }: { img: Ampliada; onClose: () => void }) {
  const [destino, setDestino] = useState<HTMLElement | null>(null);
  const [escala, setEscala] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [arrastrando, setArrastrando] = useState(false);
  const capaRef = useRef<HTMLDivElement>(null);
  const escalaRef = useRef(1);
  const gestoRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => { setDestino(document.body); }, []);

  const aplicarEscala = useCallback((n: number) => {
    const v = Math.min(ESC_MAX, Math.max(ESC_MIN, n));
    escalaRef.current = v;
    setEscala(v);
    // A tamaño natural la imagen vuelve al centro: si no, quedaría desplazada
    // fuera del cuadro sin forma de recuperarla salvo volviendo a ampliar.
    if (v === 1) setPos({ x: 0, y: 0 });
  }, []);

  // Esc cierra · +/− amplían · el scroll de la página se bloquea mientras dure.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key === '+' || e.key === '=') aplicarEscala(escalaRef.current * 1.25);
      if (e.key === '-' || e.key === '_') aplicarEscala(escalaRef.current / 1.25);
      if (e.key === '0') aplicarEscala(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, aplicarEscala]);

  // La rueda se registra a mano con `passive: false`: React adjunta `onWheel`
  // al root como pasivo y ahí `preventDefault()` no surte efecto.
  useEffect(() => {
    const el = capaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      aplicarEscala(escalaRef.current * (e.deltaY > 0 ? 0.88 : 1.14));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [aplicarEscala]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (escalaRef.current <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    gestoRef.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    setArrastrando(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gestoRef.current;
    if (!g) return;
    setPos({ x: g.x + (e.clientX - g.px), y: g.y + (e.clientY - g.py) });
  };

  const soltar = () => {
    gestoRef.current = null;
    setArrastrando(false);
  };

  if (!destino) return null;

  const visor = (
    <div
      className={styles.lbCapa}
      ref={capaRef}
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.lbBarra}>
        <div className={styles.lbZoom}>
          <button
            type="button"
            className={styles.lbBtn}
            onClick={() => aplicarEscala(escala / 1.25)}
            disabled={escala <= ESC_MIN}
            aria-label="Reducir"
          >
            −
          </button>
          <button
            type="button"
            className={styles.lbPct}
            onClick={() => aplicarEscala(1)}
            aria-label="Tamaño original"
          >
            {Math.round(escala * 100)}%
          </button>
          <button
            type="button"
            className={styles.lbBtn}
            onClick={() => aplicarEscala(escala * 1.25)}
            disabled={escala >= ESC_MAX}
            aria-label="Ampliar"
          >
            +
          </button>
        </div>
        <button type="button" className={styles.lbCerrar} onClick={onClose} aria-label="Cerrar imagen">
          <IconoCerrar />
        </button>
      </div>

      <div
        className={`${styles.lbLienzo} ${escala > 1 ? styles.lbLienzoMovible : ''} ${arrastrando ? styles.lbLienzoArrastrando : ''}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${escala})` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onDoubleClick={() => aplicarEscala(escala > 1 ? 1 : 2)}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          sizes="96vw"
          className={styles.lbImg}
          priority
          draggable={false}
        />
      </div>

      <p className={styles.lbPie}>
        Rueda o <kbd>+</kbd> <kbd>−</kbd> para acercar · doble clic alterna · arrastra para mover ·{' '}
        <kbd>Esc</kbd> cierra
      </p>
    </div>
  );

  return createPortal(visor, destino);
}

/** `sizes` de una figura sola (a todo el bloque) y de las que van de a dos por fila. */
export const SIZES_UNA = '(max-width: 600px) 100vw, 620px';
export const SIZES_PAR = '(max-width: 600px) 100vw, 310px';
/** Ficha de una alternativa con imagen: tres por fila, dos en móvil. */
export const SIZES_OPCION = '(max-width: 600px) 50vw, 210px';

/**
 * Alto máximo de una figura muy vertical. A todo el ancho, una molécula de MHC
 * de 457×1000 mediría 1360 px y dejaría las alternativas a dos pantallas; con
 * el tope, la figura se estrecha en vez de estirarse. Las demás no cambian.
 */
const ALTO_MAX_FIGURA = 480;

/** Todas las imágenes del enunciado, en orden: `image` primero y luego `extraImages`. */
export function figurasDe(q: ExamQuestion): Ampliada[] {
  if (!q.image) return [];
  return [
    { src: q.image, alt: q.imageAlt ?? 'Imagen de la pregunta', w: q.imageW ?? 1000, h: q.imageH ?? 750 },
    ...(q.extraImages ?? []).map((x, i) => ({
      src: x.src,
      alt: x.alt ?? `Imagen ${i + 2} de la pregunta`,
      w: x.w ?? 1000,
      h: x.h ?? 750,
    })),
  ];
}

/** Las láminas de la explicación, en orden: `explanationImage` y luego las extra. */
export function figurasExplicacionDe(q: ExamQuestion): Ampliada[] {
  if (!q.explanationImage) return [];
  return [
    { src: q.explanationImage, alt: q.explanationImageAlt ?? 'Imagen de referencia', w: 800, h: 600 },
    ...(q.explanationExtraImages ?? []).map((x, i) => ({
      src: x.src,
      alt: x.alt ?? `Imagen de referencia ${i + 2}`,
      w: x.w ?? 800,
      h: x.h ?? 600,
    })),
  ];
}

/** Figura ampliable: la imagen es el botón, con su chip «Ampliar» en la esquina. */
export function FiguraAmpliable({
  src,
  alt,
  w,
  h,
  onAmpliar,
  variante = 'pregunta',
  sizes = SIZES_UNA,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  onAmpliar: (img: Ampliada) => void;
  variante?: 'pregunta' | 'explicacion';
  sizes?: string;
}) {
  // Sólo las MUY verticales: por debajo de 1,4 hay figuras con texto (la tabla
  // del QuantiFERON, 1040×1132) que al estrecharse se volverían ilegibles.
  const vertical = h > w * 1.4;
  return (
    <button
      type="button"
      className={`${styles.figura} ${variante === 'explicacion' ? styles.figuraExplicacion : ''} ${vertical ? styles.figuraVertical : ''}`}
      style={vertical ? { maxWidth: Math.round((ALTO_MAX_FIGURA * w) / h) } : undefined}
      onClick={() => onAmpliar({ src, alt, w, h })}
      aria-label="Ampliar imagen"
    >
      {/* next/image: srcset + AVIF/WebP redimensionado al ancho real del
          dispositivo (vía `sizes`), para que el móvil no descargue la
          micrografía a tamaño completo. */}
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        className={styles.figuraImg}
      />
      <span className={styles.figuraChip}>
        <IconoLupa />
        Ampliar
      </span>
    </button>
  );
}
