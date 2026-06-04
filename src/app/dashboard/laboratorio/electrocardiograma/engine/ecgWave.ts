// Generación determinista de la onda EKG (derivación DII) por suma de gaussianas.
// Al ser determinista y evaluable en cualquier instante, permite el scrubbing
// manual: dado un tBeat se obtiene siempre la misma amplitud.

import type { BeatParams, WaveComponent } from './types';

/** Amplitud (mV) de una sola componente gaussiana en el instante t (ms). */
function gaussian(t: number, c: WaveComponent): number {
  const d = t - c.mu;
  return c.a * Math.exp(-(d * d) / (2 * c.sigma * c.sigma));
}

/**
 * Amplitud de la onda (mV) en un instante del latido.
 * @param tBeat ms relativos al inicio del latido [0, rr)
 */
export function sampleEcg(tBeat: number, beat: BeatParams): number {
  let y = 0;
  for (const w of beat.waves) y += gaussian(tBeat, w);
  return y;
}

/**
 * Parámetros de un latido sinusal normal en DII (60 bpm, RR = 1000 ms).
 * Posiciones y amplitudes elegidas para una morfología clínicamente creíble:
 *  - P  ~90 ms (despolarización auricular)
 *  - Q/R/S forman el QRS estrecho centrado en ~210 ms (PR ~150 ms, QRS ~85 ms)
 *  - T  ~400 ms (repolarización ventricular)
 */
export const NORMAL_SINUS_BEAT: BeatParams = {
  rr: 1000,
  prInterval: 160,
  qrsWidth: 90,
  waves: [
    { mu: 95, a: 0.16, sigma: 20 }, // P
    { mu: 188, a: -0.1, sigma: 7 }, // Q
    { mu: 210, a: 1.25, sigma: 9 }, // R
    { mu: 232, a: -0.28, sigma: 9 }, // S
    { mu: 400, a: 0.32, sigma: 42 }, // T
  ],
};

/**
 * Construye un latido a partir del base aplicando un factor de frecuencia.
 * El ancho de las ondas escala con sqrt(rr/rrBase) (criterio tipo ECGSYN),
 * de modo que a mayor FC las ondas se estrechan de forma natural.
 */
export function scaleBeat(base: BeatParams, rr: number): BeatParams {
  const k = Math.sqrt(rr / base.rr);
  return {
    rr,
    prInterval: base.prInterval,
    qrsWidth: base.qrsWidth,
    waves: base.waves.map((w) => ({ mu: w.mu, a: w.a, sigma: w.sigma * k })),
  };
}

const isP = (w: WaveComponent) => w.mu < 150;
const isT = (w: WaveComponent) => w.mu > 320;
const isQRS = (w: WaveComponent) => w.mu >= 150 && w.mu <= 320;

/** Latido con solo la onda P (despolarización auricular sin conducción al ventrículo). */
export function pOnlyBeat(base = NORMAL_SINUS_BEAT, rr = base.rr): BeatParams {
  return { ...base, rr, waves: base.waves.filter(isP).map((w) => ({ ...w })) };
}

/**
 * Desplaza el QRS y la T en `deltaPr` ms (PR más largo) manteniendo la P fija.
 * Usado en bloqueo AV de 1.er grado y Wenckebach.
 */
export function prolongPr(base: BeatParams, deltaPr: number, rr = base.rr): BeatParams {
  return {
    ...base,
    rr,
    prInterval: base.prInterval + deltaPr,
    waves: base.waves.map((w) => (isP(w) ? { ...w } : { ...w, mu: w.mu + deltaPr })),
  };
}

/**
 * Ensancha el QRS (bloqueos de rama / latidos ventriculares): separa y agranda
 * los componentes ventriculares y vuelve la T discordante (opuesta a la R).
 */
export function widenQrs(base: BeatParams, opts: { spread?: number; discordantT?: boolean } = {}): BeatParams {
  const spread = opts.spread ?? 1.7;
  const center = 210;
  return {
    ...base,
    qrsWidth: Math.round(base.qrsWidth * spread),
    waves: base.waves.map((w) => {
      if (isQRS(w)) {
        return { mu: center + (w.mu - center) * spread, a: w.a * 0.92, sigma: w.sigma * spread };
      }
      if (isT(w) && opts.discordantT) {
        return { ...w, a: -w.a * 1.1 };
      }
      return { ...w };
    }),
  };
}

/**
 * Latido de origen ventricular (extrasístole o escape): QRS ancho y anómalo SIN
 * onda P previa, con T discordante. `rr` define su duración.
 */
export function ventricularBeat(rr: number, amplitude = 1.4): BeatParams {
  return {
    rr,
    prInterval: 0,
    qrsWidth: 150,
    waves: [
      { mu: 195, a: -0.25, sigma: 16 },
      { mu: 225, a: amplitude, sigma: 18 },
      { mu: 265, a: -0.5, sigma: 22 },
      { mu: 400, a: -0.5, sigma: 55 }, // T discordante (negativa)
    ],
  };
}
