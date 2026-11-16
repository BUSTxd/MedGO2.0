// Estado fisiológico del nefrón como función pura del escenario (hormonas +
// fármaco o síndrome). No es una simulación numérica: es un balance simple de
// agua y soluto por tramo, ajustado para que el estado basal dé ≈ 1,2 mL/min
// de orina a ≈ 600 mOsm/kg y que cada fármaco o síndrome mueva el perfil en la
// dirección correcta (docs/nefron/CONTENIDO.md, «Supuesto»).
//
// Nodos del perfil: 0 = inicio del proximal (filtrado recién hecho) y k = final
// del tramo k-ésimo de TRAMOS (1 = final del proximal … 9 = orina).

import { CELULAS, CELULA_LIST } from '@/lib/data/nefron/celulas.ts';
import { HORMONAS, HORMONA_LIST } from '@/lib/data/nefron/hormonas.ts';
import { FARMACOS } from '@/lib/data/nefron/farmacos.ts';
import { SINDROMES } from '@/lib/data/nefron/clinico.ts';
import { SUSTANCIAS_FLUJO } from '@/lib/data/nefron/sustancias.ts';
import type {
  CelulaId, Efecto, FarmacoId, HormonaId, NivelHormona, SindromeId, SustanciaId, TransportadorId,
} from '@/lib/data/nefron/tipos.ts';

export const NODOS = 10;
/** Tasa de filtración glomerular de referencia (mL/min). */
export const TFG = 125;

export interface Escenario {
  hormonas: Record<HormonaId, NivelHormona>;
  farmaco: FarmacoId | null;
  sindrome: SindromeId | null;
}

export const HORMONAS_BASALES: Record<HormonaId, NivelHormona> = {
  adh: 0, aldosterona: 0, angiotensina: 0, pth: 0, anp: 0,
};

export const ESCENARIO_BASAL: Escenario = { hormonas: HORMONAS_BASALES, farmaco: null, sindrome: null };

/** Flujo relativo de cada transportador en cada célula (1 = basal). */
export type Factores = Record<CelulaId, Partial<Record<TransportadorId, number>>>;

export type SustanciaFlujo = (typeof SUSTANCIAS_FLUJO)[number];

export interface Orina {
  /** Ritmo de orina en mL/min. */
  mlMin: number;
  osm: number;
  /** Fracción excretada de lo filtrado (0-1). */
  fe: Record<SustanciaFlujo, number>;
}

export interface Perfil {
  /** Volumen que queda, en % de lo filtrado. */
  vol: number[];
  /** Osmolalidad del líquido tubular (mOsm/kg). */
  osm: number[];
  /** Fracción que queda de cada sustancia (1 = todo lo filtrado). */
  rem: Record<SustanciaFlujo, number[]>;
  /** Osmolalidad de la punta del asa = máxima de la médula. */
  osmPunta: number;
  orina: Orina;
}

export interface Estado {
  niveles: Record<HormonaId, NivelHormona>;
  factores: Factores;
  perfil: Perfil;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const c01 = (v: number) => clamp(v, 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Niveles de hormona efectivos: el síndrome activo impone los suyos. */
export function nivelesEfectivos(e: Escenario): Record<HormonaId, NivelHormona> {
  const s = e.sindrome ? SINDROMES[e.sindrome] : null;
  return { ...e.hormonas, ...(s?.hormonas ?? {}) };
}

function aplica(ef: { en?: CelulaId[] }, cel: CelulaId) {
  return !ef.en || ef.en.includes(cel);
}

/** Producto de todos los efectos sobre cada transportador de cada célula. */
export function calcularFactores(e: Escenario): Factores {
  const niveles = nivelesEfectivos(e);
  const dianas: Efecto[] = [
    ...(e.farmaco ? FARMACOS[e.farmaco].dianas : []),
    ...(e.sindrome ? SINDROMES[e.sindrome].dianas : []),
  ];
  const out = {} as Factores;
  for (const cel of CELULA_LIST) {
    const fila: Partial<Record<TransportadorId, number>> = {};
    for (const t of [...cel.apical, ...cel.basolateral, ...cel.interior]) {
      let f = 1;
      for (const h of HORMONA_LIST) {
        for (const ef of h.efectos) {
          if (ef.t === t && aplica(ef, cel.id)) f *= ef.factor[niveles[h.id] + 1];
        }
      }
      for (const d of dianas) if (d.t === t && aplica(d, cel.id)) f *= d.factor;
      fila[t] = clamp(f, 0, 3);
    }
    out[cel.id] = fila;
  }
  return out;
}

/** Flujo de un transportador en una célula (1 si la célula no lo tiene). */
export function fx(F: Factores, cel: CelulaId, t: TransportadorId): number {
  return F[cel]?.[t] ?? 1;
}

/** Perfil del líquido tubular a lo largo del nefrón. */
export function calcularPerfil(F: Factores, niveles: Record<HormonaId, NivelHormona>, lavado = 1): Perfil {
  const f = (cel: CelulaId, t: TransportadorId) => fx(F, cel, t);

  // ── Proximal: reabsorción isoosmótica ──
  // Cuánto trabaja el proximal (ponderado: NHE3 y la bomba mueven casi todo el Na⁺).
  const pf = c01(
    0.35 * Math.min(1, f('proximal-s1', 'nhe3')) + 0.25 * Math.min(1, f('proximal-s1', 'nak'))
    + 0.15 * Math.min(1, f('proximal-s1', 'nbce1')) + 0.1 * Math.min(1, f('proximal-s1', 'sglt2'))
    + 0.05 * Math.min(1, f('proximal-s1', 'napi2a')) + 0.1 * Math.min(1, f('proximal-s1', 'aa-na')),
  );
  const reabAgua = 0.67 * Math.min(pf, c01(f('proximal-s1', 'aqp1')));
  const vol = new Array<number>(NODOS).fill(0);
  const osm = new Array<number>(NODOS).fill(300);
  vol[0] = 100;
  vol[1] = 100 * (1 - reabAgua * 0.85);
  vol[2] = 100 * (1 - reabAgua);

  // ── Asa: el gradiente lo crea NKCC2 y lo completa la urea (ADH) ──
  const adh = niveles.adh;
  const gMax = adh === -1 ? 650 : adh === 1 ? 1200 : 1050;
  const nk = c01(f('gruesa', 'nkcc2'));
  // La ADH estimula NKCC2 para cargar la médula, pero no cambia cuánta sal se pierde.
  const nkSal = c01(f('gruesa', 'nkcc2') / [0.85, 1, 1.15][adh + 1]);
  const ur = c01(f('medular-interna', 'uta1'));
  const g = nk * (0.7 + 0.3 * ur) * lavado;
  const osmPunta = 300 + (gMax - 300) * g;
  const aqD = c01(f('descendente', 'aqp1'));
  vol[3] = vol[2] * Math.pow(300 / osmPunta, 0.6 * aqD);
  osm[3] = lerp(300 * vol[2] / vol[3], osmPunta, aqD);
  const clk = c01(f('ascendente-delgada', 'clck1'));
  vol[4] = vol[3];
  osm[4] = osm[3] - (osm[3] - 300) * 0.55 * clk;
  vol[5] = vol[4];
  osm[5] = osm[4] - (osm[4] - 100) * nkSal;

  // ── Distal: diluye un poco más ──
  const ncc = c01(f('distal', 'ncc'));
  vol[6] = vol[5];
  osm[6] = Math.max(50, osm[5] - 30 * ncc);
  const s6 = vol[6] * osm[6];
  const s6ref = 1150; // soluto que llega al conector en el estado basal

  // ── Conector y colectores: la ADH decide el agua ──
  const a2 = c01(f('principal', 'aqp2'));
  const a2m = c01(f('medular-interna', 'aqp2'));
  const en = clamp(f('principal', 'enac'), 0, 1.6);
  const keep = 1 - 0.5 * Math.min(en, 1) - 0.15 * Math.max(0, en - 1);
  // El exceso de soluto que llega (diuréticos proximales o de asa) se recupera solo en parte.
  const sale = (frac: number) => {
    const base = Math.min(s6, s6ref);
    const exceso = Math.max(0, s6 - s6ref);
    return base * (1 - (1 - keep) * frac) + exceso * (1 - 0.7 * frac);
  };
  const osmCort = 50 + 250 * a2;
  osm[7] = lerp(osm[6], osmCort, 0.5);
  vol[7] = Math.min(vol[6], sale(0.45) / osm[7]);
  osm[8] = osmCort;
  vol[8] = Math.min(vol[7], sale(0.75) / osm[8]);
  osm[9] = 50 + (osmPunta - 50) * a2m;
  vol[9] = Math.min(vol[8], sale(1) / osm[9]);
  // Si el colector no puede sacar agua, la orina no puede salir más concentrada que lo que entra.
  for (const k of [7, 8, 9]) if (vol[k] >= vol[k - 1] - 1e-9) osm[k] = Math.min(osm[k], osm[k - 1]);

  // ── Sustancias ──
  const rem = {} as Record<SustanciaFlujo, number[]>;
  const serie = (vals: number[], min = 0) => {
    const out = vals.map((v) => clamp(v, min, 1.2));
    return out;
  };

  rem.agua = vol.map((v) => v / 100);

  const enc = clamp(f('principal', 'enac'), 0, 1.6);
  {
    const r = new Array<number>(NODOS);
    r[0] = 1;
    r[1] = 1 - 0.57 * pf;
    r[2] = 1 - 0.67 * pf;
    r[3] = r[2];
    r[4] = r[3] - 0.03 * clk;
    // Lo que llega de más se reabsorbe en parte río abajo (balance glomerulotubular).
    r[5] = r[4] - (0.22 + 0.6 * Math.max(0, r[4] - 0.3)) * nkSal;
    r[6] = r[5] - (0.05 + 0.3 * Math.max(0, r[5] - 0.08)) * ncc;
    r[7] = r[6] - 0.012 * enc;
    r[8] = r[7] - 0.01 * enc;
    r[9] = r[8] - 0.004 * c01(f('medular-interna', 'enac'));
    for (let k = 1; k < NODOS; k++) r[k] = Math.max(0.002, r[k]);
    rem.na = serie(r);
  }
  {
    const r = new Array<number>(NODOS);
    const fd = Math.sqrt(clamp(vol[6] / 16, 0.5, 2.2));
    const rk = clamp(f('principal', 'romk'), 0, 2);
    const sec = 0.08 * rk * fd * (0.4 + 0.6 * Math.min(enc, 1.6));
    r[0] = 1;
    r[1] = 1 - 0.55 * pf;
    r[2] = 1 - 0.65 * pf;
    r[3] = r[2] + 0.05;
    r[4] = r[3];
    r[5] = r[4] - (0.25 + 0.5 * Math.max(0, r[4] - 0.4)) * nkSal;
    r[6] = r[5];
    r[7] = r[6] + sec * 0.4;
    r[8] = r[7] + sec * 0.6 - 0.02 * c01(f('intercalada-a', 'hkatpasa'));
    r[9] = r[8] - 0.01;
    for (let k = 1; k < NODOS; k++) r[k] = Math.max(0.01, r[k]);
    rem.k = serie(r);
  }
  {
    const fh = Math.min(c01(f('proximal-s1', 'nhe3')), c01(f('proximal-s1', 'nbce1')), Math.sqrt(c01(f('proximal-s1', 'ac4'))));
    const ha = c01(f('intercalada-a', 'hatpasa'));
    const pe = c01(f('intercalada-b', 'pendrina'));
    const r = new Array<number>(NODOS);
    r[0] = 1;
    r[1] = 1 - 0.75 * fh;
    r[2] = r[1] - 0.05 * fh;
    r[3] = r[2];
    r[4] = r[3];
    r[5] = r[4] - 0.15 * c01(f('gruesa', 'nhe3'));
    r[6] = r[5];
    r[7] = Math.max(0, r[6] - 0.02 * ha) + 0.002 * pe;
    r[8] = Math.max(0, r[7] - 0.03 * ha) + 0.003 * pe;
    r[9] = Math.max(0, r[8] - 0.01 * ha);
    rem.hco3 = serie(r);
  }
  {
    const s2 = c01(f('proximal-s1', 'sglt2'));
    const s1 = clamp(f('proximal-s3', 'sglt1'), 0, 1.5);
    const r1 = 1 - 0.9 * s2;
    const cap = 0.12 * s1 * (1 + 2 * c01((r1 - 0.1) / 0.9));
    const r2 = Math.max(0.002, r1 - Math.min(r1 * 0.98, cap));
    rem.glucosa = serie([1, r1, r2, r2, r2, r2, r2, r2, r2, r2]);
  }
  {
    const a = c01(f('proximal-s1', 'aa-na'));
    const r1 = 1 - 0.95 * a;
    const r2 = r1 * (1 - 0.9 * a);
    rem.aa = serie([1, r1, r2, r2, r2, r2, r2, r2, r2, r2]);
  }
  {
    const p = clamp(f('proximal-s1', 'napi2a'), 0, 1.3);
    const r1 = Math.max(0.03, 1 - 0.68 * p);
    const r2 = Math.max(0.02, r1 - 0.1 * p);
    const r6 = Math.max(0.02, r2 - 0.02);
    rem.fosfato = serie([1, r1, r2, r2, r2, r2, r6, r6, r6, r6]);
  }
  {
    const tv = clamp(f('distal', 'trpv5'), 0, 1.6);
    const r = new Array<number>(NODOS);
    r[0] = 1;
    r[1] = 1 - 0.55 * pf;
    r[2] = 1 - 0.65 * pf;
    r[3] = r[2];
    r[4] = r[3];
    r[5] = r[4] - (0.22 + 0.6 * Math.max(0, r[4] - 0.35)) * nkSal;
    r[6] = r[5] - (0.08 + 0.2 * Math.max(0, r[5] - 0.13)) * tv;
    r[7] = r[6] - 0.02 * tv;
    r[8] = r[7];
    r[9] = r[8];
    for (let k = 1; k < NODOS; k++) r[k] = Math.max(0.003, r[k]);
    rem.ca = serie(r);
  }
  {
    const r = new Array<number>(NODOS);
    r[0] = 1;
    r[1] = 1 - 0.15 * pf;
    r[2] = 1 - 0.2 * pf;
    r[3] = r[2];
    r[4] = r[3];
    r[5] = r[4] - (0.65 + 0.5 * Math.max(0, r[4] - 0.8)) * nkSal;
    r[6] = r[5] - 0.1 * c01(f('distal', 'trpm6'));
    r[7] = r[6];
    r[8] = r[7];
    r[9] = r[8];
    for (let k = 1; k < NODOS; k++) r[k] = Math.max(0.01, r[k]);
    rem.mg = serie(r);
  }
  {
    const r = new Array<number>(NODOS);
    r[0] = 1;
    r[1] = 1 - 0.4 * pf;
    r[2] = 1 - 0.5 * pf;
    r[3] = r[2] + 0.3 * ur;
    r[4] = r[3] + 0.2 * ur;
    r[5] = r[4];
    r[6] = r[5];
    r[7] = r[6];
    r[8] = r[7];
    r[9] = Math.max(0.15, r[8] - 0.6 * ur);
    rem.urea = serie(r);
  }

  const fe = {} as Record<SustanciaFlujo, number>;
  for (const s of SUSTANCIAS_FLUJO) fe[s] = rem[s][NODOS - 1];

  return {
    vol, osm, rem, osmPunta,
    orina: { mlMin: (vol[NODOS - 1] / 100) * TFG, osm: osm[NODOS - 1], fe },
  };
}

export function calcularEstado(e: Escenario): Estado {
  const niveles = nivelesEfectivos(e);
  const factores = calcularFactores(e);
  const lavado = e.farmaco ? FARMACOS[e.farmaco].lavado ?? 1 : 1;
  return { niveles, factores, perfil: calcularPerfil(factores, niveles, lavado) };
}

/** Mezcla dos estados (t = 0 → a, t = 1 → b) para que los cambios se vean llegar. */
export function mezclarEstado(a: Estado, b: Estado, t: number): Estado {
  if (t >= 1) return b;
  if (t <= 0) return a;
  const factores = {} as Factores;
  for (const cel of Object.keys(b.factores) as CelulaId[]) {
    const fila: Partial<Record<TransportadorId, number>> = {};
    for (const k of Object.keys(b.factores[cel]) as TransportadorId[]) {
      fila[k] = lerp(a.factores[cel]?.[k] ?? 1, b.factores[cel][k] ?? 1, t);
    }
    factores[cel] = fila;
  }
  const pa = a.perfil;
  const pb = b.perfil;
  const mez = (x: number[], y: number[]) => x.map((v, i) => lerp(v, y[i], t));
  const rem = {} as Record<SustanciaFlujo, number[]>;
  const fe = {} as Record<SustanciaFlujo, number>;
  for (const s of SUSTANCIAS_FLUJO) {
    rem[s] = mez(pa.rem[s], pb.rem[s]);
    fe[s] = rem[s][NODOS - 1];
  }
  const vol = mez(pa.vol, pb.vol);
  const osm = mez(pa.osm, pb.osm);
  return {
    niveles: b.niveles,
    factores,
    perfil: {
      vol, osm, rem,
      osmPunta: lerp(pa.osmPunta, pb.osmPunta, t),
      orina: { mlMin: (vol[NODOS - 1] / 100) * TFG, osm: osm[NODOS - 1], fe },
    },
  };
}

/** Cómo marcar un transportador en la vista según el escenario y la vista activa. */
export type Marca = 'bloqueado' | 'activado' | 'afectado' | 'hormona';

export function marcasDe(e: Escenario, vista: 'hormonas' | 'farmacos' | 'clinico' | 'otra'): Map<string, Marca> {
  const m = new Map<string, Marca>();
  const clave = (cel: CelulaId, t: TransportadorId) => `${cel}|${t}`;
  const poner = (ef: Efecto, marca: (f: number) => Marca) => {
    for (const cel of CELULA_LIST) {
      const tiene = [...cel.apical, ...cel.basolateral, ...cel.interior].includes(ef.t);
      if (tiene && aplica(ef, cel.id)) m.set(clave(cel.id, ef.t), marca(ef.factor));
    }
  };
  if (vista === 'farmacos' && e.farmaco) {
    for (const d of FARMACOS[e.farmaco].dianas) poner(d, (f) => (f < 1 ? 'bloqueado' : 'activado'));
  }
  if (vista === 'clinico' && e.sindrome) {
    for (const d of SINDROMES[e.sindrome].dianas) poner(d, () => 'afectado');
  }
  // Las hormonas que no están en su nivel basal se marcan en cualquier vista.
  const niveles = nivelesEfectivos(e);
  for (const h of HORMONA_LIST) {
    if (niveles[h.id] === 0) continue;
    for (const ef of h.efectos) {
      const f = ef.factor[niveles[h.id] + 1];
      if (Math.abs(f - 1) < 0.05) continue;
      for (const cel of CELULA_LIST) {
        const tiene = [...cel.apical, ...cel.basolateral, ...cel.interior].includes(ef.t);
        const k = clave(cel.id, ef.t);
        if (tiene && aplica(ef, cel.id) && !m.has(k)) m.set(k, vista === 'clinico' && e.sindrome ? 'afectado' : 'hormona');
      }
    }
  }
  return m;
}

/** Células con algún transportador marcado. */
export function celulasMarcadas(m: Map<string, Marca>): Set<CelulaId> {
  const s = new Set<CelulaId>();
  for (const k of m.keys()) s.add(k.split('|')[0] as CelulaId);
  return s;
}

/** Osmolalidad del intersticio a una profundidad (0 = unión corticomedular, 1 = papila). */
export function osmIntersticio(prof: number, osmPunta: number) {
  return 300 + (osmPunta - 300) * c01(prof);
}

/** Color del líquido según su osmolalidad: celeste (diluido) → verde menta (300) → amarillo → rojo anaranjado (concentrado). */
export function colorOsm(o: number, alfa = 1): string {
  const stops: Array<[number, [number, number, number]]> = [
    [50, [71, 200, 255]],
    [300, [92, 236, 170]],
    [700, [255, 214, 74]],
    [1200, [255, 96, 70]],
  ];
  let i = 0;
  while (i < stops.length - 2 && o > stops[i + 1][0]) i++;
  const [o0, c0] = stops[i];
  const [o1, c1] = stops[i + 1];
  const t = c01((o - o0) / (o1 - o0));
  const r = Math.round(lerp(c0[0], c1[0], t));
  const g = Math.round(lerp(c0[1], c1[1], t));
  const b = Math.round(lerp(c0[2], c1[2], t));
  return `rgba(${r},${g},${b},${alfa})`;
}

export { CELULAS, HORMONAS };
export type { SustanciaId };
