// Modo 1 — Ritmo sinusal normal.
// Cada onda P conduce a un QRS estrecho con PR constante (120-200 ms).

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT } from '../engine/ecgWave';
import { sinusPhase } from '../engine/timeline';
import { scheduleBeats } from '../engine/scheduler';

const sched = scheduleBeats(
  Array.from({ length: 4 }, () => ({
    rr: NORMAL_SINUS_BEAT.rr,
    beat: NORMAL_SINUS_BEAT,
    phase: sinusPhase,
  })),
);

const mode: ModeDefinition = {
  id: 'ritmo-sinusal',
  title: 'Ritmo sinusal normal',
  keyMessage: 'En ritmo sinusal normal, cada onda P conduce a un QRS estrecho.',
  ...sched,
};

export default mode;
