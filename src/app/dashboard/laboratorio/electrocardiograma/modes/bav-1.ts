// Modo 3 — Bloqueo AV de primer grado.
// Cada P conduce, pero el retraso nodal AV está prolongado: PR >200 ms,
// constante. La conducción se retrasa, no se bloquea.

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT, prolongPr } from '../engine/ecgWave';
import { conduction } from '../engine/timeline';
import { scheduleBeats } from '../engine/scheduler';

const DELTA = 120; // PR ~ 280 ms
const beat = prolongPr(NORMAL_SINUS_BEAT, DELTA);
const prEnd = 175 + DELTA;
const qrsEnd = prEnd + 64;

const phase = (t: number) =>
  conduction(t, {
    prEnd,
    qrsEnd,
    avColor: 'orange',
    avMessage: 'Retraso AV prolongado (PR >200 ms): la conducción se retrasa, pero no se bloquea.',
  });

const sched = scheduleBeats(
  Array.from({ length: 3 }, () => ({ rr: 1000, beat, phase })),
);

const mode: ModeDefinition = {
  id: 'bav-1',
  title: 'Bloqueo AV de primer grado',
  keyMessage: 'El bloqueo AV de primer grado no bloquea: retrasa la conducción (PR largo y constante).',
  ...sched,
};

export default mode;
