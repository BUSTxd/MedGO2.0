// Funciones de conducción: dado el tiempo dentro de un latido devuelven el
// PhaseState (segmento EKG + estructuras iluminadas + impulso). Las mismas
// piezas sirven para la conducción normal y para las patologías, variando
// parámetros (PR, ancho del QRS, rama bloqueada, origen del impulso).

import type { PhaseState, ImpulseColor } from './types';
import { NODES, VENTRICLE_CENTER, ECTOPIC, lerpPath } from './heartGeometry';

export const SINUS_BOUNDS = {
  pStart: 55,
  pEnd: 150,
  prSegEnd: 188,
  qrsEnd: 252,
  stEnd: 320,
  tEnd: 480,
} as const;

function norm(t: number, a: number, b: number): number {
  if (b <= a) return 0;
  return Math.max(0, Math.min(1, (t - a) / (b - a)));
}

const ATRIA_PATH = [NODES.sa, { x: 178, y: 140 }, NODES.av];
const VENTRICLE_PATH = [NODES.av, NODES.his, NODES.fork, { x: 200, y: 284 }];
const ECTOPIC_PATH = [ECTOPIC, { x: 175, y: 280 }, { x: 240, y: 280 }];

const PSTART = 55;
const PEND = 150;

function atriaPhase(tBeat: number): PhaseState {
  const f = norm(tBeat, PSTART, PEND);
  return {
    segment: 'P',
    ekgLabel: 'Onda P',
    explanation: 'Despolarización auricular: el impulso nace en el nodo sinusal y activa ambas aurículas.',
    color: 'blue',
    active: {
      sa: { color: 'blue', glow: 1 - f * 0.4 },
      ra: { color: 'blue', glow: 0.85 },
      la: { color: 'blue', glow: 0.55 + f * 0.3 },
    },
    impulse: lerpPath(ATRIA_PATH, f),
  };
}

export interface ConductionOpts {
  /** Fin del retraso AV / inicio del QRS (ms). Subir = PR más largo. */
  prEnd?: number;
  /** Fin del QRS (ms). Subir = QRS más ancho. */
  qrsEnd?: number;
  /** Color del nodo AV durante el retraso (verde normal, naranja = retraso marcado). */
  avColor?: ImpulseColor;
  /** Mensaje del retraso AV. */
  avMessage?: string;
  /** Rama bloqueada (QRS ancho). */
  block?: 'rbb' | 'lbb';
}

/** Conducción auriculoventricular (normal o con PR/QRS/rama alterados). */
export function conduction(tBeat: number, opts: ConductionOpts = {}): PhaseState {
  const prEnd = opts.prEnd ?? SINUS_BOUNDS.prSegEnd;
  const qrsEnd = opts.qrsEnd ?? SINUS_BOUNDS.qrsEnd;
  const stEnd = qrsEnd + 68;
  const tEnd = stEnd + 160;

  if (tBeat >= PSTART && tBeat < PEND) return atriaPhase(tBeat);

  // Retraso nodal AV (segmento PR)
  if (tBeat >= PEND && tBeat < prEnd) {
    const col = opts.avColor ?? 'green';
    return {
      segment: 'PRseg',
      ekgLabel: 'Segmento PR',
      explanation: opts.avMessage ?? 'Retraso nodal AV: permite el llenado ventricular antes de la contracción.',
      color: col,
      active: { av: { color: col, glow: 1 } },
      impulse: NODES.av,
    };
  }

  // QRS
  if (tBeat >= prEnd && tBeat < qrsEnd) {
    const f = norm(tBeat, prEnd, qrsEnd);
    if (opts.block) {
      const good = opts.block === 'rbb' ? 'lbb' : 'rbb';
      const lateV = opts.block === 'rbb' ? 'rv' : 'lv';
      const earlyV = opts.block === 'rbb' ? 'lv' : 'rv';
      const side = opts.block === 'rbb' ? 'derecha' : 'izquierda';
      const lateName = opts.block === 'rbb' ? 'derecho' : 'izquierdo';
      return {
        segment: 'QRS',
        ekgLabel: 'QRS ancho',
        explanation: `Bloqueo de rama ${side}: el ventrículo ${lateName} se activa tarde, célula a célula. El QRS se ensancha.`,
        color: 'yellow',
        active: {
          his: { color: 'yellow', glow: 1 },
          [good]: { color: 'yellow', glow: Math.min(1, f * 1.6) },
          [opts.block]: { color: 'red', glow: 1 },
          [earlyV]: { color: 'yellow', glow: Math.max(0, f - 0.2) },
          [lateV]: { color: 'yellow', glow: Math.max(0, f - 0.55) },
          purkinje: { color: 'yellow', glow: Math.max(0, f * 1.2 - 0.3) },
        },
        impulse: lerpPath(VENTRICLE_PATH, f),
      };
    }
    return {
      segment: 'QRS',
      ekgLabel: 'Complejo QRS',
      explanation: 'Despolarización ventricular: conducción rápida por His, ramas y Purkinje. QRS estrecho.',
      color: 'yellow',
      active: {
        his: { color: 'yellow', glow: 1 },
        rbb: { color: 'yellow', glow: Math.min(1, f * 1.6) },
        lbb: { color: 'yellow', glow: Math.min(1, f * 1.6) },
        purkinje: { color: 'yellow', glow: Math.max(0, f * 1.4 - 0.4) },
        rv: { color: 'yellow', glow: Math.max(0, f - 0.3) },
        lv: { color: 'yellow', glow: Math.max(0, f - 0.3) },
      },
      impulse: lerpPath(VENTRICLE_PATH, f),
    };
  }

  if (tBeat >= qrsEnd && tBeat < stEnd) {
    return {
      segment: 'ST',
      ekgLabel: 'Segmento ST',
      explanation: 'Ventrículos completamente despolarizados: fase inicial de la repolarización.',
      color: 'yellow',
      active: { rv: { color: 'yellow', glow: 0.4 }, lv: { color: 'yellow', glow: 0.4 } },
      impulse: null,
    };
  }

  if (tBeat >= stEnd && tBeat < tEnd) {
    const fade = Math.sin(norm(tBeat, stEnd, tEnd) * Math.PI);
    return {
      segment: 'T',
      ekgLabel: 'Onda T',
      explanation: 'Repolarización ventricular: los ventrículos recuperan su estado de reposo.',
      color: 'yellow',
      active: { rv: { color: 'yellow', glow: fade * 0.6 }, lv: { color: 'yellow', glow: fade * 0.6 } },
      impulse: null,
    };
  }

  return restPhase(tBeat);
}

/** Conducción sinusal normal. */
export function sinusPhase(tBeat: number): PhaseState {
  return conduction(tBeat);
}

/**
 * Latido cuya onda P NO conduce: el impulso llega a la zona de bloqueo y se
 * detiene (rojo). No hay QRS.
 * @param site 'av' (nodal) o 'his' (infranodal)
 */
export function blockedBeat(tBeat: number, site: 'av' | 'his', message: string): PhaseState {
  if (tBeat >= PSTART && tBeat < PEND) return atriaPhase(tBeat);
  if (tBeat >= PEND && tBeat < 210) {
    const node = site === 'av' ? 'av' : 'his';
    return {
      segment: 'PRseg',
      ekgLabel: 'P bloqueada',
      explanation: message,
      color: 'red',
      active: {
        av: { color: site === 'av' ? 'red' : 'green', glow: 1 },
        ...(site === 'his' ? { his: { color: 'red' as const, glow: 1 } } : {}),
        [node]: { color: 'red', glow: 1 },
      },
      impulse: site === 'av' ? NODES.av : NODES.his,
    };
  }
  return {
    segment: 'RR',
    ekgLabel: 'Sin QRS',
    explanation: message,
    color: 'red',
    active: {},
    impulse: null,
  };
}

/**
 * Latido de origen ventricular (extrasístole o escape): el impulso nace en un
 * foco fuera del nodo sinusal, sin onda P previa, y se propaga por el miocardio.
 */
export function ventricularPhase(
  tBeat: number,
  opts: { qrsEnd?: number; message: string; ectopic?: boolean },
): PhaseState {
  const qrsEnd = opts.qrsEnd ?? 320;
  const stEnd = qrsEnd + 60;
  const tEnd = stEnd + 180;
  const focusColor: ImpulseColor = opts.ectopic ? 'orange' : 'yellow';

  if (tBeat < qrsEnd) {
    const f = norm(tBeat, 0, qrsEnd);
    return {
      segment: 'QRS',
      ekgLabel: 'QRS ventricular',
      explanation: opts.message,
      color: focusColor,
      active: {
        ectopic: opts.ectopic ? { color: 'orange', glow: 1 - f * 0.3 } : undefined,
        rv: { color: focusColor, glow: Math.min(1, 0.4 + f) },
        lv: { color: focusColor, glow: Math.max(0, f - 0.25) },
        purkinje: { color: focusColor, glow: f * 0.6 },
      },
      impulse: lerpPath(ECTOPIC_PATH, f),
    };
  }
  if (tBeat < stEnd) {
    return {
      segment: 'ST',
      ekgLabel: 'Segmento ST',
      explanation: opts.message,
      color: focusColor,
      active: { rv: { color: focusColor, glow: 0.35 }, lv: { color: focusColor, glow: 0.35 } },
      impulse: null,
    };
  }
  if (tBeat < tEnd) {
    const fade = Math.sin(norm(tBeat, stEnd, tEnd) * Math.PI);
    return {
      segment: 'T',
      ekgLabel: 'Onda T discordante',
      explanation: 'Repolarización anómala: la onda T es opuesta al QRS (discordante).',
      color: focusColor,
      active: { rv: { color: focusColor, glow: fade * 0.5 }, lv: { color: focusColor, glow: fade * 0.5 } },
      impulse: null,
    };
  }
  return restPhase(tBeat);
}

/** Estado de reposo (diástole / intervalo RR). */
export function restPhase(tBeat: number): PhaseState {
  return {
    segment: tBeat < PSTART ? 'baseline' : 'RR',
    ekgLabel: 'Intervalo RR',
    explanation: 'Reposo eléctrico entre latidos. El intervalo RR define la frecuencia cardíaca.',
    color: 'gray',
    active: {},
    impulse: null,
  };
}

/** Solo actividad auricular (para disociación AV: ondas P del nodo sinusal). */
export function atriaOnlyPhase(tBeat: number): PhaseState {
  if (tBeat >= PSTART && tBeat < PEND) {
    const p = atriaPhase(tBeat);
    return { ...p, ekgLabel: 'Onda P (aurículas)', explanation: 'Las aurículas se despolarizan a su propio ritmo, independientes de los ventrículos.' };
  }
  return restPhase(tBeat);
}

export { VENTRICLE_CENTER };
