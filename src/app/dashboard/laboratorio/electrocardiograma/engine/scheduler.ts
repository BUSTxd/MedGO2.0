// Planificador de latidos. Un modo se describe como una secuencia de latidos
// (cada uno con su duración, morfología y conducción). A partir de ella se
// derivan sampleAt/phaseAt en TIEMPO GLOBAL y el windowMs (suma de duraciones,
// para que el wrap sea continuo). Así cada latido puede diferir del anterior:
// PR creciente, P bloqueada, extrasístole prematura, etc.

import type { BeatParams, PhaseState } from './types';
import { sampleEcg } from './ecgWave';

export interface ScheduledBeat {
  /** Duración de este latido dentro de la ventana (ms). */
  rr: number;
  /** Morfología para el trazado. */
  beat: BeatParams;
  /** Conducción (estado fisiológico) en función del tiempo dentro del latido. */
  phase: (tInBeat: number) => PhaseState;
  /** Offsets (ms, relativos al inicio del latido) de interés para "paso a paso". */
  stops?: number[];
}

const DEFAULT_STOPS = [0, 55, 150, 210, 400];

export interface ScheduledMode {
  windowMs: number;
  sampleAt: (t: number) => number;
  phaseAt: (t: number) => PhaseState;
  stepStops: number[];
}

export function scheduleBeats(beats: ScheduledBeat[]): ScheduledMode {
  const starts: number[] = [];
  let acc = 0;
  for (const b of beats) {
    starts.push(acc);
    acc += b.rr;
  }
  const windowMs = acc;

  const wrap = (t: number) => ((t % windowMs) + windowMs) % windowMs;
  const indexAt = (t: number) => {
    let i = 0;
    for (let k = 0; k < beats.length; k++) {
      if (starts[k] <= t) i = k;
      else break;
    }
    return i;
  };

  const sampleAt = (t: number) => {
    const tt = wrap(t);
    const i = indexAt(tt);
    return sampleEcg(tt - starts[i], beats[i].beat);
  };

  const phaseAt = (t: number) => {
    const tt = wrap(t);
    const i = indexAt(tt);
    return beats[i].phase(tt - starts[i]);
  };

  const stepStops: number[] = [];
  beats.forEach((b, i) => {
    for (const s of b.stops ?? DEFAULT_STOPS) {
      const g = starts[i] + s;
      if (g < windowMs) stepStops.push(g);
    }
  });
  stepStops.sort((a, b) => a - b);

  return { windowMs, sampleAt, phaseAt, stepStops };
}
