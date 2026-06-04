// Modo 7 — Bloqueo de rama derecha (BRD).
// El impulso baja por el His y la rama izquierda; la rama derecha está
// bloqueada, así que el ventrículo derecho se activa tarde, célula a célula.
// QRS ancho con patrón rSR′ en V1 y S terminal ancha en V6.

import type { ModeDefinition, BeatParams } from '../engine/types';
import { NORMAL_SINUS_BEAT, widenQrs } from '../engine/ecgWave';
import { conduction } from '../engine/timeline';
import { scheduleBeats } from '../engine/scheduler';

const beat = widenQrs(NORMAL_SINUS_BEAT, { spread: 1.7 });

const phase = (t: number) =>
  conduction(t, {
    prEnd: 165,
    qrsEnd: 300,
    block: 'rbb',
  });

// Mini-derivaciones características.
const V1: BeatParams = {
  rr: 1000,
  prInterval: 160,
  qrsWidth: 140,
  waves: [
    { mu: 95, a: 0.12, sigma: 20 }, // P
    { mu: 182, a: 0.28, sigma: 9 }, // r
    { mu: 205, a: -0.3, sigma: 8 }, // s
    { mu: 250, a: 0.7, sigma: 14 }, // R′ (rSR′)
    { mu: 410, a: -0.2, sigma: 40 }, // T discordante
  ],
};
const V6: BeatParams = {
  rr: 1000,
  prInterval: 160,
  qrsWidth: 140,
  waves: [
    { mu: 95, a: 0.12, sigma: 20 },
    { mu: 200, a: 0.8, sigma: 12 }, // R
    { mu: 255, a: -0.45, sigma: 22 }, // S terminal ancha
    { mu: 410, a: 0.25, sigma: 42 },
  ],
};

const sched = scheduleBeats(Array.from({ length: 3 }, () => ({ rr: 1000, beat, phase })));

const mode: ModeDefinition = {
  id: 'brd',
  title: 'Bloqueo de rama derecha',
  keyMessage: 'El problema no está en el nodo AV, sino en la conducción intraventricular derecha (QRS ancho, rSR′ en V1).',
  ...sched,
  miniLeads: [
    { name: 'V1', beat: V1 },
    { name: 'V6', beat: V6 },
  ],
};

export default mode;
