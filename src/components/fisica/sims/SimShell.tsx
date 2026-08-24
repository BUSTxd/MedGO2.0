'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/styles/fisicaSim.module.css';

/* ───────────────────────────────────────────────────────────────────────────
   Piezas compartidas por las simulaciones del laboratorio de Física: el bucle
   de dibujo con su reloj, los controles sueltos y las utilidades de canvas. La
   carcasa (rejilla escena | fórmulas y mando) vive en `LabShell.tsx`.

   El canvas se redimensiona al contenedor y se dibuja con un bucle de rAF que
   entrega tiempo SIMULADO, no el reloj de pared: pausar congela `t` en vez de
   dejar que siga corriendo por detrás, y así al reanudar la oscilación no da
   un salto. El `dt` se recorta a 50 ms para que volver a una pestaña que
   estuvo en segundo plano no dispare la simulación hacia adelante.
   ─────────────────────────────────────────────────────────────────────────── */

export interface CanvasCtx {
  ctx: CanvasRenderingContext2D;
  /** Ancho/alto en px CSS (no en px de dispositivo: el DPR ya está aplicado). */
  w: number;
  h: number;
  /** Tiempo simulado acumulado, en segundos. */
  t: number;
  /** Paleta resuelta desde los tokens CSS del módulo (respeta light/dark). */
  paleta: Paleta;
}

export interface Paleta {
  acento: string;
  stage: string;
  grid: string;
  ink: string;
  muted: string;
  surface: string;
}

/**
 * Reloj de una simulación. Vive DENTRO del hook del canvas y no en cada sim
 * porque el mando del laboratorio es el mismo en las cinco: play/pausa,
 * reinicio y velocidad. Tenerlo aquí es lo que evita repetir tres `useState`
 * y tres manejadores por archivo, y garantiza que «reiniciar» ponga a cero el
 * tiempo simulado y el estado propio de la escena a la vez.
 */
export interface Reloj {
  corriendo: boolean;
  /** Multiplicador del tiempo simulado: 0.5, 1 o 2. */
  velocidad: number;
  alternar: () => void;
  reanudar: () => void;
  reiniciar: () => void;
  cambiarVelocidad: (v: number) => void;
}

/**
 * Bucle de dibujo. `draw` se re-lee de una ref en cada frame, así que puede
 * cerrar sobre estado fresco sin reiniciar el bucle (el patrón de `onDropRef`
 * en `useDragDrop`: si el efecto dependiera de `draw`, cada render mataría y
 * recrearía la animación y la sim daría un tirón en cada movimiento de slider).
 *
 * `onReiniciar` es para las escenas que integran de verdad (péndulo) o guardan
 * rastro (ondas): poner `t` a cero no les basta, tienen que resembrar su
 * propio estado o al reanudar seguirían donde iban.
 */
export function useSimCanvas(
  draw: (c: CanvasCtx) => void,
  opts: { alto: number; onReiniciar?: () => void },
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  const tRef = useRef(0);

  const [corriendo, setCorriendo] = useState(true);
  const [velocidad, setVelocidad] = useState(1);

  const corriendoRef = useRef(corriendo);
  const velocidadRef = useRef(velocidad);
  const onReiniciarRef = useRef(opts.onReiniciar);

  drawRef.current = draw;
  corriendoRef.current = corriendo;
  velocidadRef.current = velocidad;
  onReiniciarRef.current = opts.onReiniciar;

  const reloj = useMemo<Reloj>(
    () => ({
      corriendo,
      velocidad,
      alternar: () => setCorriendo((v) => !v),
      reanudar: () => setCorriendo(true),
      reiniciar: () => {
        tRef.current = 0;
        onReiniciarRef.current?.();
        setCorriendo(true);
      },
      cambiarVelocidad: setVelocidad,
    }),
    [corriendo, velocidad],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let ultimo = performance.now();
    let anchoCss = 0;

    // Los colores salen de los tokens CSS del propio nodo, de modo que el
    // canvas cambia con el tema sin que la paleta esté escrita dos veces.
    const leerPaleta = (): Paleta => {
      const cs = getComputedStyle(canvas);
      return {
        acento:  cs.getPropertyValue('--acc').trim()      || '#5E9CD3',
        stage:   cs.getPropertyValue('--s-stage').trim()  || '#f4f6fb',
        grid:    cs.getPropertyValue('--s-grid').trim()   || 'rgba(26,26,46,.07)',
        ink:     cs.getPropertyValue('--s-ink').trim()    || '#1a1a2e',
        muted:   cs.getPropertyValue('--s-muted').trim()  || '#718096',
        surface: cs.getPropertyValue('--s-bg').trim()     || '#ffffff',
      };
    };

    const ajustar = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      anchoCss = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(opts.alto * dpr);
      canvas.style.height = `${opts.alto}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(canvas);

    const frame = (ahora: number) => {
      const dt = Math.min((ahora - ultimo) / 1000, 0.05);
      ultimo = ahora;
      if (corriendoRef.current) tRef.current += dt * velocidadRef.current;

      if (anchoCss > 0) {
        ctx.clearRect(0, 0, anchoCss, opts.alto);
        drawRef.current({
          ctx,
          w: anchoCss,
          h: opts.alto,
          t: tRef.current,
          paleta: leerPaleta(),
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [opts.alto]);

  return { canvasRef, reloj };
}

export function Btn({
  children,
  activo,
  onClick,
}: {
  children: React.ReactNode;
  activo?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${activo ? styles.btnActivo : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  valor,
  opciones,
  onChange,
}: {
  valor: T;
  opciones: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.segmented}>
      {opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`${styles.segmentedBtn} ${valor === o.id ? styles.segmentedBtnActivo : ''}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SimNota({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.simNota}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/**
 * Selector de paleta. BUST lo pidió explícitamente («que pueda jugar con los
 * colores»): cambia el acento de la sim en caliente, y como el canvas lee
 * `--acc` en cada frame, el dibujo se tiñe solo.
 */
export const PALETAS = [
  { id: 'azul',    color: '#5E9CD3' },
  { id: 'violeta', color: '#9B8EF8' },
  { id: 'verde',   color: '#2DC99A' },
  { id: 'ambar',   color: '#F5A623' },
  { id: 'rosa',    color: '#F471B5' },
] as const;

export function SelectorPaleta({
  valor,
  onChange,
}: {
  valor: string;
  onChange: (color: string) => void;
}) {
  return (
    <span className={styles.paleta} role="group" aria-label="Color de la simulación">
      {PALETAS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-label={`Color ${p.id}`}
          aria-pressed={valor === p.color}
          className={`${styles.paletaSwatch} ${valor === p.color ? styles.paletaSwatchActivo : ''}`}
          style={{ ['--sw' as string]: p.color }}
          onClick={() => onChange(p.color)}
        />
      ))}
    </span>
  );
}

/** Hook de acento local a una sim, sembrado con el color de su sección. */
export function useAcento(inicial: string) {
  const [acento, setAcento] = useState(inicial);
  useEffect(() => { setAcento(inicial); }, [inicial]);
  return [acento, setAcento] as const;
}

/* ─── Utilidades de dibujo ───────────────────────────────────────────────── */

export function rejilla(c: CanvasCtx, paso = 28) {
  const { ctx, w, h, paleta } = c;
  ctx.save();
  ctx.strokeStyle = paleta.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = paso; x < w; x += paso) {
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, h);
  }
  for (let y = paso; y < h; y += paso) {
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(w, Math.round(y) + 0.5);
  }
  ctx.stroke();
  ctx.restore();
}

export function texto(
  c: CanvasCtx,
  s: string,
  x: number,
  y: number,
  opts: { color?: string; size?: number; peso?: number; align?: CanvasTextAlign } = {},
) {
  const { ctx, paleta } = c;
  ctx.save();
  ctx.fillStyle = opts.color ?? paleta.muted;
  ctx.font = `${opts.peso ?? 600} ${opts.size ?? 11}px var(--font-outfit), system-ui, sans-serif`;
  ctx.textAlign = opts.align ?? 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
  ctx.restore();
}

/** Convierte un hex a rgba con alfa — para halos y rastros sobre el canvas. */
export function alfa(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Vector con punta y rótulo. Lo comparten las escenas que enseñan un diagrama
 * de cuerpo libre (plano inclinado, palanca, Coulomb, Lorentz): dibujar la
 * flecha a mano en cada una acababa dando cuatro puntas de tamaños distintos
 * en el mismo módulo.
 *
 * Un vector por debajo de `minimo` píxeles no se dibuja: a esa escala la punta
 * es más grande que el cuerpo y el resultado no parece una flecha corta, sino
 * un borrón. Devolver sin pintar es más honesto que pintar algo ilegible.
 */
export function vector(
  c: CanvasCtx,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: string,
  label?: string,
  opts: { grosor?: number; punta?: number; minimo?: number; discontinuo?: boolean } = {},
) {
  const { ctx } = c;
  const largo = Math.hypot(dx, dy);
  const minimo = opts.minimo ?? 9;
  if (largo < minimo) return;

  const grosor = opts.grosor ?? 2.4;
  const punta = opts.punta ?? 8;
  const ux = dx / largo;
  const uy = dy / largo;
  const fin = { x: x + dx, y: y + dy };
  const base = { x: fin.x - ux * punta, y: fin.y - uy * punta };

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = 'round';
  if (opts.discontinuo) ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(base.x, base.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(fin.x, fin.y);
  ctx.lineTo(base.x - uy * punta * 0.42, base.y + ux * punta * 0.42);
  ctx.lineTo(base.x + uy * punta * 0.42, base.y - ux * punta * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (label) {
    // El rótulo se aparta en perpendicular al vector para no quedar encima de
    // la punta ni del cuerpo de la flecha.
    texto(c, label, fin.x + ux * 11 - uy * 9, fin.y + uy * 11 + ux * 9, {
      align: 'center', size: 11, peso: 800, color,
    });
  }
}
