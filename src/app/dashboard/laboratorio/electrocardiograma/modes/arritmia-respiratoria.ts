// Modo 2 — Arritmia sinusal respiratoria.
// Morfología normal; el intervalo RR se acorta en inspiración y se alarga en
// espiración. Solo cambia la distancia entre QRS, no su forma.

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT } from '../engine/ecgWave';
import { sinusPhase } from '../engine/timeline';
import { scheduleBeats } from '../engine/scheduler';

// Un ciclo respiratorio completo: acelera (inspiración) y frena (espiración).
const RRS = [1150, 1040, 900, 770, 720, 780, 920, 1060];

const sched = scheduleBeats(
  RRS.map((rr) => ({ rr, beat: NORMAL_SINUS_BEAT, phase: sinusPhase })),
);

const mode: ModeDefinition = {
  id: 'arritmia-respiratoria',
  title: 'Arritmia sinusal respiratoria',
  keyMessage: 'La morfología es normal; lo que cambia es el intervalo RR con la respiración.',
  ...sched,
};

export default mode;
