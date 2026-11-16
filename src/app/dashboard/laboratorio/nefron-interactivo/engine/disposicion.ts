// Disposición de la vista de pared: la luz arriba, la célula en foco con sus
// dos vecinas, la membrana basolateral, el intersticio y el capilar abajo.
// Todo sale de aquí (posiciones de los glifos y trayectos de cada ion) para
// que el SVG y la capa de partículas usen las mismas cuentas.

import { CELULAS } from '@/lib/data/nefron/celulas.ts';
import { TRANSPORTADORES } from '@/lib/data/nefron/transportadores.ts';
import type { CelulaId, Membrana, SustanciaId, TransportadorId } from '@/lib/data/nefron/tipos.ts';
import type { P } from './geometria.ts';

export interface Glifo {
  t: TransportadorId;
  membrana: Membrana;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Corriente {
  clave: string;
  t: TransportadorId | null;
  s: SustanciaId;
  /** Partículas por segundo con flujo basal. */
  ritmo: number;
  ruta: P[];
  duracion: number;
}

export interface Disposicion {
  W: number;
  H: number;
  estrecha: boolean;
  /** Tamaño base del texto (u del lienzo). */
  texto: number;
  apicalY: number;
  baseY: number;
  capilar: { y0: number; y1: number };
  foco: { x0: number; x1: number };
  vecinas: [{ x0: number; x1: number }, { x0: number; x1: number }];
  uniones: [number, number];
  nucleo: { cx: number; cy: number; rx: number; ry: number };
  mitocondrias: Array<{ x: number; y: number; ang: number }>;
  pliegues: number[];
  vellos: { xs: number[]; alto: number };
  glifos: Glifo[];
  corrientes: Corriente[];
  reacciones: Array<{ texto: string; enzima?: string; x: number; y: number; donde: 'luz' | 'citosol' }>;
}

const ALTO_CELULA = { plana: 120, cubica: 280, cilindrica: 340 } as const;

export function disponer(id: CelulaId, estrecha: boolean): Disposicion {
  const cel = CELULAS[id];
  const W = estrecha ? 760 : 1200;
  const H = estrecha ? 920 : 800;
  const texto = estrecha ? 22 : 16;
  const h = ALTO_CELULA[cel.forma];
  const capH = 130;
  const gap = 70;
  const apicalY = H - capH - gap - h - 20;
  const baseY = apicalY + h;
  const capilar = { y0: baseY + gap, y1: baseY + gap + capH };
  const foco = estrecha ? { x0: 96, x1: 664 } : { x0: 330, x1: 870 };
  const vecinas: Disposicion['vecinas'] = estrecha
    ? [{ x0: -40, x1: 88 }, { x0: 672, x1: 800 }]
    : [{ x0: -20, x1: 322 }, { x0: 878, x1: 1220 }];
  const uniones: [number, number] = [foco.x0 - 4, foco.x1 + 4];
  const span = foco.x1 - foco.x0;

  const plana = cel.forma === 'plana';
  const nucleo = plana
    ? { cx: foco.x0 + span * 0.5, cy: apicalY + h * 0.5, rx: 70, ry: 20 }
    : { cx: foco.x0 + span * 0.79, cy: apicalY + h * 0.44, rx: 50, ry: Math.min(40, h * 0.15) };

  // Mitocondrias junto a la base (donde está la bomba que las necesita).
  // Mitocondrias en fila, de pie entre los pliegues, justo encima de la base.
  const nMito = [0, 3, 6, 10][cel.mitocondrias];
  const mitocondrias: Disposicion['mitocondrias'] = [];
  for (let i = 0; i < nMito; i++) {
    const fx = (i + 0.5) / nMito;
    mitocondrias.push({ x: foco.x0 + 24 + fx * (span - 48), y: baseY - 52, ang: i % 2 ? 84 : 96 });
  }
  const pliegues: number[] = [];
  if (cel.pliegues) for (let x = foco.x0 + 30; x < foco.x1 - 20; x += 34) pliegues.push(x);

  const vellos = {
    xs: [] as number[],
    alto: cel.cepillo === 'denso' ? 40 : cel.cepillo === 'escaso' ? 18 : 0,
  };
  if (vellos.alto) for (let x = foco.x0 + 8; x < foco.x1 - 4; x += 11) vellos.xs.push(x);

  // ── Glifos ──
  const glifos: Glifo[] = [];
  // En una célula plana la luz y la base están a un palmo: el glifo de arriba
  // va a la izquierda y el de abajo a la derecha para que no se pisen.
  const fila = (lista: TransportadorId[], y: number, membrana: Membrana) => {
    const n = lista.length;
    const margen = estrecha ? 50 : 56;
    const util = span - 2 * margen;
    const solo = plana ? (membrana === 'apical' ? 0.22 : 0.78) : 0.5;
    lista.forEach((t, i) => {
      const x = foco.x0 + margen + (n === 1 ? util * solo : (i * util) / (n - 1));
      glifos.push({ t, membrana, x, y, w: 62, h: 44 });
    });
  };
  fila(cel.apical, apicalY, 'apical');
  fila(cel.basolateral, baseY, 'basolateral');
  cel.interior.forEach((t, i) => {
    glifos.push({
      t, membrana: 'interior',
      x: foco.x0 + 52 + i * 84,
      y: plana ? apicalY + h * 0.5 : apicalY + h * 0.42,
      w: 54, h: 40,
    });
  });

  // ── Corrientes: cada sustancia que mueve cada transportador ──
  const corrientes: Corriente[] = [];
  const dentroA = apicalY + Math.min(110, h * 0.45);
  const dentroB = baseY - Math.min(110, h * 0.45);
  for (const g of glifos) {
    if (g.membrana === 'interior') continue;
    const tr = TRANSPORTADORES[g.t];
    const k = tr.mueve.length;
    tr.mueve.forEach((m, j) => {
      const dx = (j - (k - 1) / 2) * 17;
      const x = g.x + dx;
      let ruta: P[];
      if (g.membrana === 'apical') {
        const fuera: P = [x, Math.max(24, apicalY - 170)];
        const a: P = [x, apicalY - 26];
        const b: P = [x, apicalY + 26];
        const dentro: P = [x + dx * 0.8, dentroA];
        ruta = m.hacia === 'adentro' ? [fuera, a, b, dentro] : [dentro, b, a, fuera];
      } else {
        const dentro: P = [x + dx * 0.8, dentroB];
        const a: P = [x, baseY - 24];
        const b: P = [x, baseY + 24];
        const sangre: P = [x, capilar.y0 + 46];
        ruta = m.hacia === 'afuera' ? [dentro, a, b, sangre] : [sangre, b, a, dentro];
      }
      corrientes.push({ clave: `${g.t}-${g.membrana}-${m.s}-${j}`, t: g.t, s: m.s, ritmo: 0.45 * (m.n ?? 1), ruta, duracion: 2.6 });
    });
  }
  // Vía paracelular: entre la célula en foco y sus vecinas.
  if (cel.paracelular) {
    const p = cel.paracelular;
    for (const ux of uniones) {
      p.sustancias.forEach((s, j) => {
        const arriba: P = [ux, Math.max(24, apicalY - 150)];
        const union: P = [ux, apicalY + 6];
        const abajo: P = [ux, baseY + 10];
        const sangre: P = [ux + (ux < W / 2 ? 14 : -14), capilar.y0 + 46];
        const ruta: P[] = p.sentido === 'reabsorbe' ? [arriba, union, abajo, sangre] : [sangre, abajo, union, arriba];
        corrientes.push({ clave: `para-${ux}-${s}-${j}`, t: null, s, ritmo: 0.22, ruta, duracion: 3.4 });
      });
    }
  }

  const reacciones: Disposicion['reacciones'] = [];
  let nLuz = 0;
  let nCit = 0;
  for (const r of cel.reacciones ?? []) {
    if (r.donde === 'luz') {
      reacciones.push({ ...r, x: foco.x0 + span / 2, y: Math.max(40, apicalY - 196 + nLuz * (texto + 10)), donde: 'luz' });
      nLuz++;
    } else {
      reacciones.push({ ...r, x: foco.x0 + span * 0.42, y: apicalY + h * (plana ? 0.5 : 0.36) + nCit * (texto * 2.1), donde: 'citosol' });
      nCit++;
    }
  }

  return {
    W, H, estrecha, texto, apicalY, baseY, capilar, foco, vecinas, uniones,
    nucleo, mitocondrias, pliegues, vellos, glifos, corrientes, reacciones,
  };
}
