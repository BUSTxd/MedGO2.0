// Modo 8 — Bloqueo de rama izquierda (BRI).
// La rama izquierda está bloqueada: el ventrículo derecho se activa primero y la
// activación cruza lentamente al izquierdo. QRS ancho, R ancha y mellada en V6,
// QS profundo en V1, con repolarización discordante.

import type { ModeDefinition, BeatParams } from '../engine/types';
import { NORMAL_SINUS_BEAT, widenQrs } from '../engine/ecgWave';
import { conduction } from '../engine/timeline';
import { scheduleBeats } from '../engine/scheduler';

const beat = widenQrs(NORMAL_SINUS_BEAT, { spread: 1.9, discordantT: true });

const phase = (t: number) =>
  conduction(t, {
    prEnd: 165,
    qrsEnd: 310,
    block: 'lbb',
  });

const V1: BeatParams = {
  rr: 1000,
  prInterval: 160,
  qrsWidth: 150,
  waves: [
    { mu: 95, a: 0.12, sigma: 20 },
    { mu: 220, a: -1.0, sigma: 30 }, // QS profundo y ancho
    { mu: 420, a: 0.25, sigma: 45 }, // T discordante (positiva)
  ],
};
const V6: BeatParams = {
  rr: 1000,
  prInterval: 160,
  qrsWidth: 150,
  waves: [
    { mu: 95, a: 0.12, sigma: 20 },
    { mu: 205, a: 0.95, sigma: 18 }, // R ancha
    { mu: 250, a: 0.6, sigma: 16 }, // muesca (mellada)
    { mu: 420, a: -0.3, sigma: 45 }, // T discordante (negativa)
  ],
};

const sched = scheduleBeats(Array.from({ length: 3 }, () => ({ rr: 1000, beat, phase })));

const mode: ModeDefinition = {
  id: 'bri',
  title: 'Bloqueo de rama izquierda',
  keyMessage: 'La activación del ventrículo izquierdo se retrasa: el QRS se ensancha (R ancha y mellada en V6).',
  ...sched,
  miniLeads: [
    { name: 'V1', beat: V1 },
    { name: 'V6', beat: V6 },
  ],
};

export default mode;
