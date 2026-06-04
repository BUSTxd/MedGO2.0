// Modo 5 — Bloqueo AV de 2.º grado, Mobitz II.
// El PR es constante en los latidos conducidos, pero de pronto una onda P no
// conduce. El bloqueo es infranodal (His-Purkinje).

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT, pOnlyBeat } from '../engine/ecgWave';
import { conduction, blockedBeat } from '../engine/timeline';
import { scheduleBeats, type ScheduledBeat } from '../engine/scheduler';

const conducted: ScheduledBeat = {
  rr: 1000,
  beat: NORMAL_SINUS_BEAT,
  phase: (t: number) =>
    conduction(t, { avMessage: 'PR constante: la conducción es normal en este latido.' }),
};

const blocked: ScheduledBeat = {
  rr: 1000,
  beat: pOnlyBeat(),
  phase: (t: number) =>
    blockedBeat(t, 'his', 'Caída súbita: la P no conduce por bloqueo infranodal (His-Purkinje), sin alargamiento previo del PR.'),
};

// Patrón 3:1 — tres conducidos, una P bloqueada.
const sched = scheduleBeats([conducted, conducted, conducted, blocked]);

const mode: ModeDefinition = {
  id: 'bav-2-mobitz-2',
  title: 'Bloqueo AV 2.º grado Mobitz II',
  keyMessage: 'PR constante con caída súbita del QRS: bloqueo infranodal probable.',
  ...sched,
};

export default mode;
