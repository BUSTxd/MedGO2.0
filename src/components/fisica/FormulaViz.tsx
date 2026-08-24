'use client';

import { useEffect, useRef } from 'react';
import type { VizId } from '@/lib/data/fisica-modulos/types';
import styles from '@/styles/formulaViva.module.css';

/**
 * Escena 2D de una fórmula viva.
 *
 * Cada dibujante recibe los MISMOS valores que el alumno está arrastrando en
 * las perillas, de modo que la fórmula, el número y el dibujo se mueven a la
 * vez. Es lo que separa «ver cambiar un número» de «entender qué significa el
 * número»: el vector F que se da la vuelta al cruzar el equilibrio, o la masa
 * que visiblemente tarda más en volver.
 *
 * El bucle de rAF va aquí y no en el padre para que arrastrar una perilla no
 * reinicie la animación (mismo motivo que `drawRef` en `useSimCanvas`).
 */

interface Ctx {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  /** Tiempo real acumulado, en segundos. */
  t: number;
  v: Record<string, number>;
  /** Resultado de la fórmula, ya calculado por el padre. */
  r: number;
  col: { acc: string; ink: string; muted: string; bg: string };
}

/**
 * Alto por defecto. Todos los dibujantes se centran en `h / 2`, así que subirlo
 * les da aire alrededor en vez de descolocarlos — es lo que permite que el
 * panel del modelo mande en el layout de dos columnas sin tocar ni un dibujo.
 */
const ALTO_BASE = 152;

export default function FormulaViz({
  viz,
  valores,
  resultado,
  acento,
  alto = ALTO_BASE,
}: {
  viz: VizId;
  valores: Record<string, number>;
  resultado: number;
  acento: string;
  alto?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const datos = useRef({ valores, resultado, viz });
  datos.current = { valores, resultado, viz };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let anchoCss = 0;
    const t0 = performance.now();

    const ajustar = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      anchoCss = rect.width;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(canvas);

    const frame = (ahora: number) => {
      if (anchoCss > 0) {
        const cs = getComputedStyle(canvas);
        ctx.clearRect(0, 0, anchoCss, alto);
        DIBUJANTES[datos.current.viz]({
          ctx,
          w: anchoCss,
          h: alto,
          t: (ahora - t0) / 1000,
          v: datos.current.valores,
          r: datos.current.resultado,
          col: {
            acc:   cs.getPropertyValue('--acc').trim() || '#5E9CD3',
            ink:   cs.getPropertyValue('--v-text').trim() || '#1a1a2e',
            muted: cs.getPropertyValue('--v-muted').trim() || '#718096',
            bg:    cs.getPropertyValue('--v-bg').trim() || '#ffffff',
          },
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [alto]);

  return <canvas ref={canvasRef} className={styles.vizCanvas} style={{ height: alto }} />;
}

/* ─── Utilidades ─────────────────────────────────────────────────────────── */

/**
 * Hex → rgba con alfa. Un token que no sea hex (los `--v-muted` del tema
 * oscuro ya vienen en rgba()) se devuelve tal cual: parsearlo daría
 * `rgba(NaN, NaN, NaN, a)` y el canvas descartaría el trazo en silencio.
 */
function rgba(color: string, a: number) {
  if (!color.startsWith('#')) return color;
  const h = color.slice(1);
  const n = parseInt(h.length === 3 ? h.split('').map((d) => d + d).join('') : h.slice(0, 6), 16);
  if (Number.isNaN(n)) return color;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function txt(
  c: Ctx,
  s: string,
  x: number,
  y: number,
  o: { color?: string; size?: number; peso?: number; align?: CanvasTextAlign } = {},
) {
  c.ctx.save();
  c.ctx.fillStyle = o.color ?? c.col.muted;
  c.ctx.font = `${o.peso ?? 600} ${o.size ?? 10.5}px var(--font-outfit), system-ui, sans-serif`;
  c.ctx.textAlign = o.align ?? 'left';
  c.ctx.textBaseline = 'middle';
  c.ctx.fillText(s, x, y);
  c.ctx.restore();
}

/** Resorte en zigzag entre dos puntos a la misma altura. */
function resorte(c: Ctx, x0: number, x1: number, y: number, color: string, amp = 11) {
  const { ctx } = c;
  const util = x1 - x0;
  const guia = Math.max(Math.abs(util) * 0.13, 5) * Math.sign(util || 1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x0 + guia, y);
  const n = 11;
  for (let i = 0; i <= n; i++) {
    const px = x0 + guia + ((util - 2 * guia) * i) / n;
    ctx.lineTo(px, y + (i % 2 === 0 ? -amp : amp));
  }
  ctx.lineTo(x1 - guia, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

function flecha(c: Ctx, x: number, y: number, dx: number, color: string, grosor = 3) {
  const { ctx } = c;
  if (Math.abs(dx) < 1) return;
  const dir = Math.sign(dx);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx - 7 * dir, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + dx, y);
  ctx.lineTo(x + dx - 9 * dir, y - 5.5);
  ctx.lineTo(x + dx - 9 * dir, y + 5.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Cota horizontal entre dos x, con sus topes. Mide una distancia sobre la
 *  escena para poder comparar dos longitudes a ojo. */
function regla(c: Ctx, x0: number, x1: number, y: number, color: string) {
  const { ctx } = c;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x0, y); ctx.lineTo(x1, y);
  ctx.moveTo(x0, y - 4.5); ctx.lineTo(x0, y + 4.5);
  ctx.moveTo(x1, y - 4.5); ctx.lineTo(x1, y + 4.5);
  ctx.stroke();
  ctx.restore();
}

function pared(c: Ctx, x: number, y: number, alto: number) {
  const { ctx } = c;
  ctx.save();
  ctx.strokeStyle = rgba(c.col.ink, 0.45);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x, y - alto / 2);
  ctx.lineTo(x, y + alto / 2);
  ctx.stroke();
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  for (let i = -alto / 2; i <= alto / 2 - 8; i += 9) {
    ctx.moveTo(x, y + i);
    ctx.lineTo(x - 9, y + i + 9);
  }
  ctx.stroke();
  ctx.restore();
}

function equilibrio(c: Ctx, x: number, y: number, alto: number) {
  const { ctx } = c;
  ctx.save();
  ctx.strokeStyle = rgba(c.col.ink, 0.26);
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, y - alto / 2);
  ctx.lineTo(x, y + alto / 2);
  ctx.stroke();
  ctx.restore();
}

/* ─── Dibujantes ─────────────────────────────────────────────────────────── */

const DIBUJANTES: Record<VizId, (c: Ctx) => void> = {
  /* F = −k·x — lo que hay que ver es que la flecha SIEMPRE apunta al
     equilibrio, y que se da la vuelta justo al cruzarlo. */
  'fuerza-resorte': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const cy = h / 2 - 6;
    const px = 26;
    const eqX = w * 0.52;
    const escala = Math.min((w * 0.38) / 0.4, 240);
    const bx = eqX + v.x * escala;
    const lado = 30;

    pared(c, px, cy, 74);
    equilibrio(c, eqX, cy, 62);
    txt(c, 'x = 0', eqX, cy - 40, { align: 'center', size: 9.5 });

    // Suelo
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.15);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, cy + 37);
    ctx.lineTo(w - 16, cy + 37);
    ctx.stroke();
    ctx.restore();

    resorte(c, px, bx - lado / 2, cy, col.acc, 10);

    ctx.save();
    ctx.fillStyle = col.acc;
    ctx.beginPath();
    ctx.roundRect(bx - lado / 2, cy - lado / 2, lado, lado, 7);
    ctx.fill();
    ctx.restore();

    // Desplazamiento x (bajo el bloque)
    if (Math.abs(v.x) > 0.005) {
      ctx.save();
      ctx.strokeStyle = rgba(col.ink, 0.4);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(eqX, cy + 26);
      ctx.lineTo(bx, cy + 26);
      ctx.stroke();
      ctx.restore();
      txt(c, `x = ${v.x > 0 ? '+' : ''}${v.x.toFixed(2)} m`, (eqX + bx) / 2, cy + 34, {
        align: 'center', size: 9.5, color: rgba(col.ink, 0.55),
      });
    }

    // El vector fuerza: longitud ∝ |F|, sentido SIEMPRE hacia el equilibrio
    const rojo = '#ef4444';
    const largoMax = w * 0.2;
    const largo = Math.min((Math.abs(r) / 48) * largoMax, largoMax) * -Math.sign(v.x || 1);
    if (Math.abs(v.x) > 0.005) {
      flecha(c, bx, cy - lado / 2 - 15, largo, rojo, 3.2);
      txt(c, `F = ${r.toFixed(1)} N`, bx + largo / 2, cy - lado / 2 - 30, {
        align: 'center', size: 10.5, peso: 800, color: rojo,
      });
    } else {
      txt(c, 'F = 0  ·  en equilibrio no hay fuerza', bx, cy - lado / 2 - 22, {
        align: 'center', size: 10.5, peso: 700, color: col.muted,
      });
    }

    txt(
      c,
      v.x > 0.005 ? 'x positivo → F apunta a la IZQUIERDA'
      : v.x < -0.005 ? 'x negativo → F apunta a la DERECHA'
      : 'arrastra x y mira cómo se da la vuelta la flecha',
      w / 2, h - 9,
      { align: 'center', size: 10, peso: 700, color: Math.abs(v.x) > 0.005 ? rojo : col.muted },
    );
  },

  /* T = 2π√(m/k) — el bloque oscila DE VERDAD al ritmo que marca la fórmula:
     el ciclo de la barra inferior dura exactamente T segundos. */
  'oscilador-resorte': (c) => {
    const { ctx, w, h, t, v, r, col } = c;
    const cy = h / 2 - 10;
    const px = 26;
    const om = 2 * Math.PI / r;         // el periodo calculado manda el ritmo
    const A = Math.min(w * 0.17, 74);
    const eqX = px + 104 + A;
    const fase = om * t;
    const bx = eqX + A * Math.cos(fase);
    // El tamaño del bloque insinúa la masa, para que se vea qué se cambió.
    const lado = 22 + Math.min(v.m, 5) * 4.4;

    pared(c, px, cy, 76);
    equilibrio(c, eqX, cy, 60);

    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.15);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, cy + 38);
    ctx.lineTo(w - 16, cy + 38);
    ctx.stroke();
    ctx.restore();

    // Un resorte más rígido se dibuja con más vueltas apretadas
    resorte(c, px, bx - lado / 2, cy, col.acc, 8 + Math.min(v.k / 40, 1) * 5);

    ctx.save();
    ctx.fillStyle = col.acc;
    ctx.shadowColor = rgba(col.acc, 0.4);
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(bx - lado / 2, cy - lado / 2, lado, lado, 6);
    ctx.fill();
    ctx.restore();
    txt(c, `${v.m.toFixed(1)} kg`, bx, cy, { align: 'center', size: 9.5, peso: 800, color: '#fff' });

    // Barra del ciclo: se llena en exactamente T segundos
    const bw = w - 52;
    const by = h - 22;
    const frac = ((t % r) / r);
    ctx.save();
    ctx.fillStyle = rgba(col.acc, 0.15);
    ctx.beginPath();
    ctx.roundRect(26, by, bw, 7, 3.5);
    ctx.fill();
    ctx.fillStyle = col.acc;
    ctx.beginPath();
    ctx.roundRect(26, by, Math.max(bw * frac, 7), 7, 3.5);
    ctx.fill();
    ctx.restore();
    txt(c, `una oscilación completa = ${r.toFixed(2)} s`, 26, by - 11, { size: 10, peso: 700, color: col.acc });
  },

  /* E = ½kA² — la parábola es el argumento: doblar A no dobla la energía. */
  'energia-resorte': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const g = { x: 46, y: 16, w: w - 66, h: h - 52 };

    // Ejes
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.22);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x, g.y + g.h);
    ctx.lineTo(g.x + g.w, g.y + g.h);
    ctx.stroke();
    ctx.restore();

    const Amax = 0.5;
    const Emax = 0.5 * v.k * Amax * Amax;

    // Parábola E(A) con la k actual
    ctx.save();
    ctx.strokeStyle = col.acc;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const a = (Amax * i) / 120;
      const e = 0.5 * v.k * a * a;
      const pxx = g.x + (a / Amax) * g.w;
      const pyy = g.y + g.h - (e / Emax) * g.h;
      if (i === 0) ctx.moveTo(pxx, pyy); else ctx.lineTo(pxx, pyy);
    }
    ctx.stroke();
    ctx.restore();

    // Punto actual + guías
    const ax = g.x + (v.A / Amax) * g.w;
    const ay = g.y + g.h - (r / Emax) * g.h;
    ctx.save();
    ctx.strokeStyle = rgba(col.acc, 0.4);
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax, g.y + g.h); ctx.lineTo(ax, ay);
    ctx.moveTo(g.x, ay);       ctx.lineTo(ax, ay);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = col.acc;
    ctx.shadowColor = rgba(col.acc, 0.6);
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ax, ay, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // La mitad de la amplitud, para que el ×4 sea visible sin calcular
    const aMitad = v.A / 2;
    const eMitad = 0.5 * v.k * aMitad * aMitad;
    const mx = g.x + (aMitad / Amax) * g.w;
    const my = g.y + g.h - (eMitad / Emax) * g.h;
    ctx.save();
    ctx.fillStyle = rgba(col.ink, 0.35);
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    txt(c, 'E (J)', 8, g.y + 6, { size: 9.5, peso: 700 });
    txt(c, 'A (m)', g.x + g.w, g.y + g.h + 13, { size: 9.5, peso: 700, align: 'right' });
    txt(c, r.toFixed(2), g.x - 5, ay, { size: 10, peso: 800, align: 'right', color: col.acc });
    txt(c, v.A.toFixed(2), ax, g.y + g.h + 13, { size: 10, peso: 800, align: 'center', color: col.acc });
    txt(c, `mitad de A → ${eMitad.toFixed(2)} J`, mx + 8, my - 10, {
      size: 9.5, peso: 700, color: rgba(col.ink, 0.5),
    });
    txt(c, 'la mitad de amplitud deja UNA CUARTA PARTE de energía', w / 2, h - 9, {
      align: 'center', size: 10, peso: 700, color: col.acc,
    });
  },

  /* T = 2π√(L/g) — el péndulo oscila al ritmo que marca la fórmula. */
  'pendulo-mini': (c) => {
    const { ctx, w, h, t, v, r, col } = c;
    const piv = { x: w / 2, y: 20 };
    const om = 2 * Math.PI / r;
    const th0 = 0.34;
    const th = th0 * Math.cos(om * t);
    const escala = Math.min((h - 62) / 3, 42);   // px por metro
    const largo = v.L * escala;
    const bx = piv.x + Math.sin(th) * largo;
    const by = piv.y + Math.cos(th) * largo;

    // Techo
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.32);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(piv.x - 46, piv.y);
    ctx.lineTo(piv.x + 46, piv.y);
    ctx.stroke();
    ctx.restore();

    // Arco recorrido
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.13);
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(piv.x, piv.y, largo, Math.PI / 2 - th0, Math.PI / 2 + th0);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.5);
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(piv.x, piv.y);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = col.acc;
    ctx.shadowColor = rgba(col.acc, 0.45);
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(bx, by, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cota de la longitud
    txt(c, `L = ${v.L.toFixed(2)} m`, piv.x + 54, piv.y + largo / 2, { size: 10, peso: 700 });
    txt(c, `g = ${v.g.toFixed(2)} m/s²`, 12, h - 30, { size: 10, peso: 700 });

    const bw = w - 52;
    const by2 = h - 18;
    const frac = ((t % r) / r);
    ctx.save();
    ctx.fillStyle = rgba(col.acc, 0.15);
    ctx.beginPath();
    ctx.roundRect(26, by2, bw, 6, 3);
    ctx.fill();
    ctx.fillStyle = col.acc;
    ctx.beginPath();
    ctx.roundRect(26, by2, Math.max(bw * frac, 6), 6, 3);
    ctx.fill();
    ctx.restore();
    txt(c, `ida y vuelta = ${r.toFixed(2)} s`, w - 26, by2 - 10, {
      size: 10, peso: 700, align: 'right', color: col.acc,
    });
  },

  /* v = λ·f — la onda avanza a la velocidad que sale de la fórmula, con λ
     medido sobre el propio dibujo. */
  'onda-mini': (c) => {
    const { ctx, w, h, t, v, r, col } = c;
    const m = 22;
    const cy = h / 2 - 4;
    const ancho = w - m * 2;
    const METROS = 10;
    const pxM = ancho / METROS;
    const k = (2 * Math.PI) / v.lambda;
    const om = 2 * Math.PI * v.f;

    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.14);
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(m, cy); ctx.lineTo(w - m, cy);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = col.acc;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 240; i++) {
      const xm = (METROS * i) / 240;
      const py = cy - 26 * Math.sin(k * xm - om * t);
      const px = m + xm * pxM;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // Una cresta marcada: se ve avanzar a v m/s
    const xCresta = (((v.lambda / 4) + (r * t)) % v.lambda + v.lambda) % v.lambda;
    for (let n = 0; n * v.lambda + xCresta < METROS; n++) {
      const xm = xCresta + n * v.lambda;
      const px = m + xm * pxM;
      ctx.save();
      ctx.fillStyle = col.acc;
      ctx.shadowColor = rgba(col.acc, 0.6);
      ctx.shadowBlur = 9;
      ctx.beginPath();
      ctx.arc(px, cy - 26, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Regla de λ entre dos crestas
    const x0 = m + xCresta * pxM;
    const x1 = x0 + v.lambda * pxM;
    if (x1 < w - m) {
      const ry = cy + 40;
      ctx.save();
      ctx.strokeStyle = col.acc;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x0, ry); ctx.lineTo(x1, ry);
      ctx.moveTo(x0, ry - 4); ctx.lineTo(x0, ry + 4);
      ctx.moveTo(x1, ry - 4); ctx.lineTo(x1, ry + 4);
      ctx.stroke();
      ctx.restore();
      txt(c, `λ = ${v.lambda.toFixed(1)} m`, (x0 + x1) / 2, ry + 12, {
        align: 'center', size: 10, peso: 800, color: col.acc,
      });
    }

    txt(c, `${v.f.toFixed(1)} crestas por segundo`, m, 14, { size: 10, peso: 700 });
    txt(c, `avanza ${r.toFixed(1)} m cada segundo`, w - m, 14, {
      size: 10, peso: 800, align: 'right', color: col.acc,
    });
  },

  /* f = v/d — resolución de la ecografía.
     Tres decisiones que sostienen este dibujo:
     · La escala es FIJA (campo de 2,2 mm), no 4·d. Con un campo proporcional a
       d la escena se autoescala y mover el control no cambia nada — que era
       justo lo único que había que enseñar. Con escala fija, al pedir detalles
       más finos se ve a la vez cómo los dos puntos se juntan y cómo la onda se
       aprieta. Ese apretarse ES la frecuencia subiendo.
     · La onda va como COMPRESIONES, no como sinusoide: el ultrasonido es
       longitudinal, y esta misma sección lo enseña dos bloques más arriba.
       Dibujarlo con crestas contradiría el texto de al lado.
     · Como f es la mínima, λ vale exactamente d. Eso no es una limitación sino
       lo que hay que ver: se dibujan las dos reglas (λ arriba, d abajo) para
       que se lea que UNA longitud de onda cabe justo entre los dos detalles —
       la condición λ ≤ d en el caso límite.
     El color del veredicto vive sólo en el badge: teñir los puntos sugería que
     se ven mejor o peor, cuando lo que dice es si esa sonda existe. */
  'resolucion-eco': (c) => {
    const { ctx, w, h, t, v, r, col } = c;
    const m = 26;
    const ancho = w - m * 2;
    const d = Math.max(v.d, 0.001);

    // Campo de visión fijo, un poco mayor que el d máximo (2 mm) para que el
    // caso extremo siga cabiendo entero.
    const FOV = 2.2;
    const pxMm = ancho / FOV;
    const dPx = d * pxMm;

    const clinico = r >= 2 && r <= 15;
    const marca = clinico ? '#2DC99A' : '#F5A623';

    // Las dos cotas quedan una encima de otra con los detalles en medio, así la
    // comparación λ ↔ d se lee sin recorrer la escena. El salto a los detalles
    // deja sitio a la etiqueta de λ, que si no roza los círculos.
    const yOnda = 38;
    const altoOnda = 42;
    const yReglaL = yOnda + altoOnda + 12;
    const yEstr = yReglaL + 38;
    const yReglaD = yEstr + 18;

    /* ── Haz longitudinal: una banda por compresión, separadas λ = d ────────
       Se dibuja una banda por ciclo (con d = 0,05 mm salen ~44, con d = 2 mm
       sale una), así que el coste no depende de la resolución de la pantalla
       sino del número de ciclos, que es pequeño. */
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(m, yOnda, ancho, altoOnda, 8);
    ctx.clip();
    ctx.fillStyle = rgba(col.ink, 0.05);
    ctx.fillRect(m, yOnda, ancho, altoOnda);

    const avance = ((0.35 * t) % d) * pxMm; // el pulso viaja hacia la derecha
    const anchoBanda = Math.max(dPx * 0.4, 1.1);
    const nBandas = Math.ceil(ancho / Math.max(dPx, 1)) + 2;
    ctx.fillStyle = rgba(col.acc, 0.55);
    for (let i = -1; i < nBandas; i++) {
      ctx.fillRect(m + i * dPx + avance, yOnda, anchoBanda, altoOnda);
    }
    ctx.restore();

    const cx = m + ancho / 2;

    // Cota de λ: la distancia entre dos compresiones consecutivas. Va CENTRADA
    // y no anclada a una banda, para quedar justo encima de la cota de d: dos
    // segmentos alineados verticalmente se comparan de un vistazo, mientras que
    // separados a lo ancho habría que medirlos con la vista. Y no puede seguir
    // a las bandas, que se desplazan con el pulso. Siempre cabe: λ = d ≤ 2 < FOV.
    regla(c, cx - dPx / 2, cx + dPx / 2, yReglaL, col.acc);
    txt(c, `λ = ${d.toFixed(3)} mm`, cx, yReglaL + 12, {
      align: 'center', size: 10, peso: 800, color: col.acc,
    });

    /* ── Los dos detalles que hay que distinguir, separados justo d ──────── */
    const xA = cx - dPx / 2;
    const xB = cx + dPx / 2;
    // El radio se encoge con la separación: si no, al pedir detalles finos los
    // dos círculos se solaparían y parecerían uno — contando una historia
    // falsa, porque a la frecuencia mínima SÍ se resuelven.
    const rad = Math.min(6.5, Math.max(dPx * 0.28, 2.2));
    [xA, xB].forEach((px) => {
      ctx.save();
      ctx.fillStyle = rgba(col.ink, 0.72);
      ctx.beginPath();
      ctx.arc(px, yEstr, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    regla(c, xA, xB, yReglaD, rgba(col.ink, 0.5));
    txt(c, `d = ${d.toFixed(3)} mm`, cx, yReglaD + 12, {
      align: 'center', size: 10, peso: 800,
    });

    txt(c, `tejido a ${v.v.toFixed(0)} m/s · campo de ${FOV.toFixed(1)} mm`, m, 14, {
      size: 10, peso: 700,
    });
    txt(c, clinico ? 'sonda real: 2–15 MHz' : 'fuera del rango clínico', w - m, 14, {
      size: 10, peso: 800, align: 'right', color: marca,
    });
  },

  /* β = 10·log(I/I₀) — dos reglas alineadas: arriba la intensidad en potencias
     de 10, abajo los decibelios. La correspondencia se ve sin calcular. */
  'db-mini': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const m = 26;
    const ancho = w - m * 2;
    const yI = 42;
    const yB = h - 42;
    const frac = Math.log10(Math.max(v.veces, 1)) / 14;

    // Regla de intensidad
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.2);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(m, yI); ctx.lineTo(w - m, yI);
    ctx.stroke();
    ctx.restore();
    for (let e = 0; e <= 14; e += 2) {
      const px = m + (e / 14) * ancho;
      ctx.save();
      ctx.strokeStyle = rgba(col.ink, 0.22);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, yI - 4); ctx.lineTo(px, yI + 4);
      ctx.stroke();
      ctx.restore();
      txt(c, e === 0 ? '1' : `10${sup(e)}`, px, yI - 13, { align: 'center', size: 9.5 });
    }
    txt(c, 'INTENSIDAD  I / I₀', m, 15, { size: 9.5, peso: 800 });

    // Regla de decibelios
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.2);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(m, yB); ctx.lineTo(w - m, yB);
    ctx.stroke();
    ctx.restore();
    for (let d = 0; d <= 140; d += 20) {
      const px = m + (d / 140) * ancho;
      ctx.save();
      ctx.strokeStyle = rgba(col.ink, 0.22);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, yB - 4); ctx.lineTo(px, yB + 4);
      ctx.stroke();
      ctx.restore();
      txt(c, `${d}`, px, yB + 13, { align: 'center', size: 9.5 });
    }
    txt(c, 'NIVEL  β (dB)', m, h - 12, { size: 9.5, peso: 800 });

    // El puente entre las dos: misma posición horizontal en ambas reglas
    const px = m + frac * ancho;
    ctx.save();
    ctx.strokeStyle = col.acc;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(px, yI); ctx.lineTo(px, yB);
    ctx.stroke();
    ctx.restore();

    [yI, yB].forEach((y) => {
      ctx.save();
      ctx.fillStyle = col.acc;
      ctx.shadowColor = rgba(col.acc, 0.6);
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, y, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    txt(c, `${r.toFixed(0)} dB`, px, (yI + yB) / 2, {
      align: 'center', size: 13, peso: 800, color: col.acc,
    });
    txt(c, 'un paso ×10 arriba  =  un paso +10 dB abajo', w / 2, (yI + yB) / 2 + 17, {
      align: 'center', size: 9.5, peso: 700, color: col.muted,
    });
  },

  /* ═══ C7 · Temperatura y calor ═══════════════════════════════════════════ */

  /* T_F = 9/5·T_C + 32 — una sola regla con las dos escalas, °C arriba y °F
     abajo, sobre las bandas clínicas reales. Dos termómetros separados
     obligarían a saltar la vista entre ellos para comprobar que 37 y 98,6 son
     el mismo punto; en una regla compartida eso se ve sin más. */
  'escala-mini': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const m = 30;
    const ancho = w - m * 2;
    const yB = h / 2 - 4;
    const altoB = 26;
    const T0 = 30;
    const T1 = 43;
    const aX = (tc: number) => m + ((tc - T0) / (T1 - T0)) * ancho;

    // Bandas clínicas: es lo que convierte una conversión de unidades en una
    // lectura útil — el número por sí solo no dice si hay que actuar.
    const bandas: { d: number; a: number; col: string; label: string }[] = [
      { d: 30,   a: 35,   col: '#5E9CD3', label: 'hipotermia' },
      { d: 35,   a: 36,   col: '#8FB8D8', label: '' },
      { d: 36,   a: 37.5, col: '#2DC99A', label: 'normal' },
      { d: 37.5, a: 38,   col: '#F5D423', label: 'febrícula' },
      { d: 38,   a: 40,   col: '#F5A623', label: 'fiebre' },
      { d: 40,   a: 43,   col: '#E85B4A', label: 'hipertermia' },
    ];

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(m, yB, ancho, altoB, 6);
    ctx.clip();
    bandas.forEach((b) => {
      ctx.fillStyle = rgba(b.col, 0.55);
      ctx.fillRect(aX(b.d), yB, aX(b.a) - aX(b.d), altoB);
    });
    ctx.restore();

    bandas.forEach((b) => {
      if (!b.label) return;
      txt(c, b.label, (aX(b.d) + aX(b.a)) / 2, yB + altoB + 13, {
        align: 'center', size: 9, peso: 700,
      });
    });

    // Escala °C arriba y °F abajo, con los ticks EN LOS MISMOS puntos.
    for (let tc = T0; tc <= T1; tc += 1) {
      const px = aX(tc);
      const mayor = tc % 2 === 0;
      ctx.save();
      ctx.strokeStyle = rgba(col.ink, mayor ? 0.4 : 0.18);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, yB - 3); ctx.lineTo(px, yB - (mayor ? 9 : 6));
      ctx.stroke();
      ctx.restore();
      if (mayor) {
        txt(c, `${tc}`, px, yB - 17, { align: 'center', size: 9 });
        txt(c, `${((9 / 5) * tc + 32).toFixed(0)}`, px, yB + altoB + 30, {
          align: 'center', size: 9, color: col.acc,
        });
      }
    }
    txt(c, '°C', m - 12, yB - 17, { align: 'right', size: 9.5, peso: 800 });
    txt(c, '°F', m - 12, yB + altoB + 30, {
      align: 'right', size: 9.5, peso: 800, color: col.acc,
    });

    // Marcador: el mismo punto leído en las dos escalas.
    const px = aX(Math.min(Math.max(v.tc, T0), T1));
    ctx.save();
    ctx.strokeStyle = col.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(px, yB - 11); ctx.lineTo(px, yB + altoB + 11);
    ctx.stroke();
    ctx.restore();

    const banda = bandas.find((b) => v.tc >= b.d && v.tc < b.a);
    txt(c, `${v.tc.toFixed(1)} °C  =  ${r.toFixed(1)} °F`, w / 2, 15, {
      align: 'center', size: 12, peso: 800,
    });
    if (banda?.label) {
      txt(c, banda.label.toUpperCase(), w / 2, h - 10, {
        align: 'center', size: 10.5, peso: 800, color: banda.col,
      });
    }
  },

  /* Q = m·c·ΔT — un depósito que hay que llenar. La referencia de abajo (lo que
     el metabolismo basal produce en ese tiempo) es lo que da escala al número:
     «243 kJ» no dice nada hasta que se sabe que son ~40 min de motor propio. */
  'calor-mini': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const m = 30;
    const ancho = w - m * 2;
    const yD = 62;
    const altoD = 40;
    const MAX = 1800; // kJ, tope del depósito dibujado
    const frac = Math.min(r / MAX, 1);

    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.25);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(m, yD, ancho, altoD, 8);
    ctx.stroke();
    ctx.clip();
    const g = ctx.createLinearGradient(m, 0, m + ancho, 0);
    g.addColorStop(0, rgba(col.acc, 0.35));
    g.addColorStop(1, rgba(col.acc, 0.85));
    ctx.fillStyle = g;
    ctx.fillRect(m, yD, ancho * frac, altoD);
    ctx.restore();

    txt(c, `${r.toFixed(0)} kJ`, m + 12, yD + altoD / 2, { size: 15, peso: 800 });
    txt(c, `${(r / 4.184).toFixed(0)} kcal`, m + ancho - 12, yD + altoD / 2, {
      align: 'right', size: 11, peso: 700, color: col.muted,
    });

    // Regla de referencia: metabolismo basal ≈ 100 W = 100 kJ cada 1000 s.
    const minutos = r / 100 / 60;
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.2);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(m, yD + altoD + 16); ctx.lineTo(m + ancho, yD + altoD + 16);
    ctx.stroke();
    ctx.restore();
    txt(c, `equivale a ${minutos.toFixed(0)} min de metabolismo basal (≈100 W)`,
      w / 2, yD + altoD + 30, { align: 'center', size: 10, peso: 700 });

    txt(c, `${v.m.toFixed(0)} kg  ·  ΔT = ${v.dt.toFixed(1)} °C  ·  c = 3470 J/(kg·°C)`,
      w / 2, 16, { align: 'center', size: 10.5, peso: 700 });
    txt(c, 'el cuerpo es casi agua: cuesta mucho moverle la temperatura',
      w / 2, h - 10, { align: 'center', size: 9.5, color: col.muted });
  },

  /* Q = m·L — curva de calentamiento del sudor sobre la piel.
     El eje X va en kJ con escala FIJA (0 → Q_MAX), no en fracciones del total.
     Repartir el ancho entre sensible y latente no funcionaba: el latente es ~58
     veces el sensible, así que la rampa se quedaba en el 4 % y la meseta se
     comía la gráfica, con la misma pinta para cualquier masa. Con escala fija la
     meseta mide lo que mide Q, y arrastrar la masa la alarga de verdad.
     La rampa de calentamiento sí va con un ancho fijo pequeño y se rotula como
     exagerada: a escala real serían 3 px y parecería que la curva arranca ya
     plana. Es un eje truncado, no un dibujo que miente. */
  'fase-mini': (c) => {
    const { ctx, w, h, v, r, col } = c;
    const m = 40;
    const ancho = w - m * 2;
    const yTop = 44;
    const yBot = h - 42;
    const Q_MAX = 3650;              // kJ — tope del eje, el máximo de la fórmula
    const pxKJ = ancho / Q_MAX;

    const yAlto = yTop + 10;         // 33 °C — temperatura de la piel
    const yBaja = yBot - 16;         // 25 °C — sudor recién salido

    // Ejes
    ctx.save();
    ctx.strokeStyle = rgba(col.ink, 0.22);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(m, yTop); ctx.lineTo(m, yBot); ctx.lineTo(m + ancho, yBot);
    ctx.stroke();
    ctx.restore();

    // Marcas de temperatura, para que la meseta signifique algo
    [[yAlto, '33'], [yBaja, '25']].forEach(([y, etq]) => {
      ctx.save();
      ctx.strokeStyle = rgba(col.ink, 0.16);
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(m, y as number); ctx.lineTo(m + ancho, y as number);
      ctx.stroke();
      ctx.restore();
      txt(c, etq as string, m - 7, y as number, { align: 'right', size: 9 });
    });
    txt(c, '°C', m - 7, yTop + 2, { align: 'right', size: 9, peso: 800 });
    txt(c, `calor aportado (kJ) →  máx ${Q_MAX}`, m + ancho, yBot + 15, {
      align: 'right', size: 9.5, peso: 700,
    });

    // Rampa (ancho fijo, exagerada) → meseta (a escala) → recalentamiento
    const RAMPA = ancho * 0.07;
    const x1 = m + RAMPA;
    const x2 = Math.min(x1 + r * pxKJ, m + ancho);
    const mesetaPx = x2 - x1;

    ctx.save();
    ctx.fillStyle = rgba(col.acc, 0.12);
    ctx.fillRect(x1, yAlto, mesetaPx, yBaja - yAlto);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = col.acc;
    ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(m, yBaja);
    ctx.lineTo(x1, yAlto);
    ctx.lineTo(x2, yAlto);
    // Sólo si queda sitio: si no, la meseta llega al borde y la curva acaba ahí.
    if (x2 < m + ancho - 4) ctx.lineTo(m + ancho, yAlto - 6);
    ctx.stroke();
    ctx.restore();

    // Cota de la meseta, DEBAJO de la línea (encima chocaba con el rótulo).
    if (mesetaPx > 26) {
      regla(c, x1, x2, yAlto + 14, col.acc);
      if (mesetaPx > 130) {
        txt(c, 'aquí la temperatura NO sube', (x1 + x2) / 2, yAlto + 30, {
          align: 'center', size: 10, peso: 700,
        });
      }
    }

    txt(c, `${v.magua.toFixed(2)} kg de sudor  ·  L = 2430 kJ/kg  ·  Q = ${r.toFixed(0)} kJ`,
      w / 2, 16, { align: 'center', size: 10.5, peso: 700 });
    txt(c, 'la rampa de calentamiento va exagerada: a escala serían 3 px',
      w / 2, h - 9, { align: 'center', size: 9, color: col.muted });
  },

  /* H = k·A·ΔT/L — la capa aislante, su gradiente y el flujo que la cruza.
     El espesor se dibuja a escala, así que al engordar la capa se ve a la vez
     ensancharse el gradiente y adelgazar las flechas: H va como 1/L. */
  'conduccion-mini': (c) => {
    const { ctx, w, h, t, v, r, col } = c;
    const m = 30;
    const ancho = w - m * 2;
    const yC = 44;
    const altoC = h - 92;
    const L_MAX = 40; // mm, tope de la escala de espesor
    const anchoCapa = Math.max((v.l / L_MAX) * (ancho * 0.55), 8);
    const xCapa = m + ancho * 0.26;

    // Interior (núcleo a 37 °C) y exterior (ambiente)
    ctx.save();
    ctx.fillStyle = rgba('#E85B4A', 0.5);
    ctx.fillRect(m, yC, xCapa - m, altoC);
    ctx.fillStyle = rgba('#5E9CD3', 0.42);
    ctx.fillRect(xCapa + anchoCapa, yC, m + ancho - (xCapa + anchoCapa), altoC);
    ctx.restore();
    txt(c, 'núcleo 37 °C', (m + xCapa) / 2, yC - 12, { align: 'center', size: 9.5, peso: 700 });
    txt(c, `ambiente ${(37 - v.dt).toFixed(0)} °C`,
      (xCapa + anchoCapa + m + ancho) / 2, yC - 12, { align: 'center', size: 9.5, peso: 700 });

    // La capa, con el gradiente térmico dibujado dentro.
    ctx.save();
    const g = ctx.createLinearGradient(xCapa, 0, xCapa + anchoCapa, 0);
    g.addColorStop(0, rgba('#E85B4A', 0.5));
    g.addColorStop(1, rgba('#5E9CD3', 0.42));
    ctx.fillStyle = g;
    ctx.fillRect(xCapa, yC, anchoCapa, altoC);
    ctx.strokeStyle = rgba(col.ink, 0.3);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(xCapa, yC, anchoCapa, altoC);
    ctx.restore();

    regla(c, xCapa, xCapa + anchoCapa, yC + altoC + 14, rgba(col.ink, 0.5));
    txt(c, `L = ${v.l.toFixed(0)} mm`, xCapa + anchoCapa / 2, yC + altoC + 27, {
      align: 'center', size: 10, peso: 800,
    });

    // Flujo: más flechas y más gruesas cuanto mayor es H.
    const nFlechas = Math.min(Math.max(Math.round(r / 60), 1), 6);
    for (let i = 0; i < nFlechas; i++) {
      const y = yC + (altoC * (i + 0.5)) / nFlechas;
      const desfase = ((t * 40) % 26) - 13;
      flecha(c, xCapa - 26 + desfase, y, anchoCapa + 46, rgba('#F5A623', 0.9), 2.6);
    }

    txt(c, `${r.toFixed(0)} W`, m + ancho, 16, {
      align: 'right', size: 15, peso: 800, color: '#F5A623',
    });
    txt(c, 'k grasa = 0,20 W/(m·°C)  ·  A = 1,8 m²', m, 16, { size: 9.5, peso: 700 });
    txt(c, r > 100 ? 'pierde más de lo que produce en reposo (~100 W)'
                   : 'por debajo de lo que produce en reposo (~100 W)',
      w / 2, h - 10, {
        align: 'center', size: 10, peso: 700,
        color: r > 100 ? '#E85B4A' : '#2DC99A',
      });
  },
};

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function sup(n: number) {
  return String(n).split('').map((d) => SUP[Number(d)] ?? d).join('');
}
