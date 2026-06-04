// Modo 9 — Extrasístole ventricular (origen en ventrículo derecho).
// Un foco ectópico dispara un QRS ancho y prematuro, sin onda P previa. La
// activación se propaga de VD a VI (morfología tipo bloqueo de rama izquierda)
// y le sigue una pausa compensatoria. La onda T es discordante.

import type { ModeDefinition } from '../engine/types';
import { NORMAL_SINUS_BEAT, ventricularBeat } from '../engine/ecgWave';
import { sinusPhase, ventricularPhase } from '../engine/timeline';
import { scheduleBeats, type ScheduledBeat } from '../engine/scheduler';

const sinus: ScheduledBeat = { rr: 1000, beat: NORMAL_SINUS_BEAT, phase: sinusPhase };

const pvc: ScheduledBeat = {
  rr: 1600, // QRS prematuro (~225 ms) + pausa compensatoria
  beat: ventricularBeat(1600, 1.5),
  phase: (t: number) =>
    ventricularPhase(t, {
      qrsEnd: 300,
      ectopic: true,
      message: 'Extrasístole ventricular: nace en un foco del ventrículo derecho, sin onda P previa; QRS ancho y prematuro.',
    }),
  stops: [0, 225, 600],
};

// Ritmo sinusal con una extrasístole intercalada.
const sched = scheduleBeats([sinus, sinus, pvc, sinus]);

const mode: ModeDefinition = {
  id: 'ev',
  title: 'Extrasístole ventricular',
  keyMessage: 'QRS ancho y prematuro, sin P previa, seguido de pausa compensatoria.',
  ...sched,
  showEctopic: true,
};

export default mode;
