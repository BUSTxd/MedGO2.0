// Geometría del laboratorio: trazado de conectores entre actores (recortados
// al borde real de la molécula, no al del lienzo) y arcos del anillo.

import type { Caja } from './motor';

export type Punto = { x: number; y: number };

/** Punto donde el segmento centro→fuera sale de la caja (más `gap`). */
export function salidaDeCaja(c: Caja, hacia: Punto, gap = 10): Punto {
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const dx = hacia.x - cx, dy = hacia.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  // Las imágenes son redondeadas: se recorta contra la elipse inscrita, que
  // pega mejor al contorno que el rectángulo.
  const rx = c.w / 2 * 0.86, ry = c.h / 2 * 0.86;
  const k = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry));
  const n = Math.hypot(dx, dy);
  return { x: cx + dx * k + (dx / n) * gap, y: cy + dy * k + (dy / n) * gap };
}

function cruzaCaja(p0: Punto, c1: Punto, p1: Punto, caja: Caja): boolean {
  const m = 3;
  const x0 = caja.x + caja.w * 0.2, x1 = caja.x + caja.w * 0.8, y0 = caja.y + caja.h * 0.2, y1 = caja.y + caja.h * 0.8;
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c1.x + t * t * p1.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c1.y + t * t * p1.y;
    if (x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m) return true;
  }
  return false;
}

export type Trazo = {
  d: string;
  largo: number;
  ini: Punto;
  fin: Punto;
  medio: Punto;
  /** Ángulo (rad) de la tangente en el final. */
  angFin: number;
  ctrl: Punto;
  /** Punto del trazo a la fracción f (0–1). */
  en: (f: number) => Punto;
};

export function trazoEntre(a: Caja, b: Caja, curve: number | undefined, obstaculos: Caja[]): Trazo | null {
  const ca = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
  const cb = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
  const p0 = salidaDeCaja(a, cb);
  const p1 = salidaDeCaja(b, ca);
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  const L = Math.hypot(dx, dy);
  // Solapados (acoplados, secuestrados): no hay flecha que dibujar.
  if (L < 24 || (dx * (cb.x - ca.x) + dy * (cb.y - ca.y)) < 0) return null;
  const nx = -dy / L, ny = dx / L;
  const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
  let k = curve ?? 0.12;
  let c1 = { x: mx + nx * L * k, y: my + ny * L * k };
  if (curve === undefined && obstaculos.some((o) => cruzaCaja(p0, c1, p1, o))) {
    k = -k;
    c1 = { x: mx + nx * L * k, y: my + ny * L * k };
    if (obstaculos.some((o) => cruzaCaja(p0, c1, p1, o))) {
      k = 0.25 * Math.sign(k);
      c1 = { x: mx + nx * L * k, y: my + ny * L * k };
    }
  }
  const en = (t: number): Punto => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c1.x + t * t * p1.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c1.y + t * t * p1.y,
  });
  let largo = 0, prev = p0;
  for (let i = 1; i <= 16; i++) { const q = en(i / 16); largo += Math.hypot(q.x - prev.x, q.y - prev.y); prev = q; }
  return {
    d: `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} Q${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`,
    largo, ini: p0, fin: p1, medio: en(0.5), ctrl: c1,
    angFin: Math.atan2(p1.y - c1.y, p1.x - c1.x),
    en,
  };
}

/** Onda sinusoidal a lo largo de una recta (conector «daño» y radiación). */
export function ondaEntre(a: Punto, b: Punto, amp = 12, periodo = 38): string {
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const pasos = Math.max(8, Math.round(L / 6));
  let d = '';
  for (let i = 0; i <= pasos; i++) {
    const s = (i / pasos) * L;
    const o = Math.sin((s / periodo) * Math.PI * 2) * amp * Math.min(1, s / 40, (L - s) / 40 + 0.2);
    const x = a.x + ux * s + nx * o, y = a.y + uy * s + ny * o;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d;
}

// ─── Anillo ───────────────────────────────────────────────────────────────────

export const ANILLO = { cx: 400, cy: 400, R: 300, r: 222 };

/** Ángulo en grados desde las 12, horario → punto. */
export function polar(rho: number, grados: number): Punto {
  const t = ((grados - 90) * Math.PI) / 180;
  return { x: ANILLO.cx + rho * Math.cos(t), y: ANILLO.cy + rho * Math.sin(t) };
}

export function arcoAnular(a0: number, a1: number, R = ANILLO.R, r = ANILLO.r): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p0 = polar(R, a0), p1 = polar(R, a1), q1 = polar(r, a1), q0 = polar(r, a0);
  return `M${p0.x},${p0.y} A${R},${R} 0 ${large} 1 ${p1.x},${p1.y} L${q1.x},${q1.y} A${r},${r} 0 ${large} 0 ${q0.x},${q0.y} Z`;
}

export function arcoSimple(rho: number, a0: number, a1: number): string {
  const large = a1 - a0 > 180 ? 1 : 0;
  const p0 = polar(rho, a0), p1 = polar(rho, a1);
  return `M${p0.x},${p0.y} A${rho},${rho} 0 ${large} 1 ${p1.x},${p1.y}`;
}
