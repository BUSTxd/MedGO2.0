// Modo 4 — Bloqueo AV de 2.º grado, Mobitz I (Wenckebach).
// El PR se alarga progresivamente latido a latido hasta que una onda P no
// conduce (no hay QRS). Luego el ciclo se reinicia.

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT, prolongPr, pOnlyBeat } from '../engine/ecgWave';
import { conduction, blockedBeat } from '../engine/timeline';
import { scheduleBeats, type ScheduledBeat } from '../engine/scheduler';

// Ciclo 4:3 — tres latidos conducidos con PR creciente + una P bloqueada.
const DELTAS = [40, 120, 210];

const conducted: ScheduledBeat[] = DELTAS.map((delta) => {
  const prEnd = 175 + delta;
  return {
    rr: 1000,
    beat: prolongPr(NORMAL_SINUS_BEAT, delta),
    phase: (t: number) =>
      conduction(t, {
        prEnd,
        qrsEnd: prEnd + 64,
        avColor: delta >= 100 ? 'orange' : 'green',
        avMessage: 'El retraso AV crece en cada latido: el PR se alarga progresivamente.',
      }),
  };
});

const blocked: ScheduledBeat = {
  rr: 1000,
  beat: pOnlyBeat(),
  phase: (t: number) =>
    blockedBeat(t, 'av', 'La onda P queda bloqueada en el nodo AV tras el alargamiento progresivo: no conduce.'),
};

const sched = scheduleBeats([...conducted, blocked]);

const mode: ModeDefinition = {
  id: 'bav-2-mobitz-1',
  title: 'Bloqueo AV 2.º grado Mobitz I',
  keyMessage: 'PR progresivamente más largo hasta que una onda P se bloquea (Wenckebach).',
  ...sched,
};

export default mode;
