// Modo 6 — Bloqueo AV completo (tercer grado).
// Dos marcapasos independientes: las aurículas (nodo sinusal) y los ventrículos
// (escape) laten cada uno a su ritmo, sin relación PR. Barrera roja en el AV.

import type { ModeDefinition, PhaseState } from '../engine/types';
import { pOnlyBeat, ventricularBeat, sampleEcg } from '../engine/ecgWave';
import { ventricularPhase, atriaOnlyPhase, restPhase } from '../engine/timeline';

const RR_P = 800; // aurículas ~75/min
const RR_V = 1600; // escape ventricular ~37/min
const WINDOW = 4800; // múltiplo de ambos → wrap continuo

const P_BEAT = pOnlyBeat();
const V_BEAT = ventricularBeat(RR_V);

const wrap = (t: number) => ((t % WINDOW) + WINDOW) % WINDOW;

// La onda es la SUMA de dos trenes independientes (P y QRS de escape).
const sampleAt = (t: number) => {
  const tt = wrap(t);
  return sampleEcg(tt % RR_P, P_BEAT) + sampleEcg(tt % RR_V, V_BEAT);
};

const phaseAt = (t: number): PhaseState => {
  const tt = wrap(t);
  const tV = tt % RR_V;
  const tP = tt % RR_P;

  // El QRS de escape (y su repolarización) dominan cuando están activos.
  if (tV < 540) {
    return ventricularPhase(tV, {
      qrsEnd: 280,
      message: 'Ritmo de escape ventricular: QRS ancho y lento, independiente de las aurículas.',
      ectopic: false,
    });
  }
  // Si no, mostrar la actividad auricular con la barrera AV bloqueada.
  if (tP >= 55 && tP < 150) {
    const ph = atriaOnlyPhase(tP);
    return {
      ...ph,
      color: 'blue',
      ekgLabel: 'Onda P (disociada)',
      explanation: 'Las aurículas laten por su cuenta; el impulso no cruza el nodo AV bloqueado.',
      active: { ...ph.active, av: { color: 'red', glow: 1 } },
    };
  }
  return restPhase(tP);
};

const stepStops: number[] = [];
for (let s = 0; s < WINDOW; s += RR_P) stepStops.push(s);
for (let s = 0; s < WINDOW; s += RR_V) stepStops.push(s + 60);
stepStops.sort((a, b) => a - b);

const mode: ModeDefinition = {
  id: 'bav-completo',
  title: 'Bloqueo AV completo',
  keyMessage: 'Aurículas y ventrículos laten por separado: no hay relación PR (disociación AV).',
  windowMs: WINDOW,
  sampleAt,
  phaseAt,
  stepStops,
};

export default mode;
