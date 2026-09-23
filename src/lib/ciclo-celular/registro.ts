// Registro del laboratorio: los cinco checkpoints en el orden en que la célula
// los atraviesa, su marcador en el anillo y la compilación (memoizada) de cada
// escenario.

import restriccion from '@/lib/data/ciclo-celular/checkpoints/restriccion';
import g1sDano from '@/lib/data/ciclo-celular/checkpoints/g1s-dano';
import intraS from '@/lib/data/ciclo-celular/checkpoints/intra-s';
import g2m from '@/lib/data/ciclo-celular/checkpoints/g2m';
import huso from '@/lib/data/ciclo-celular/checkpoints/huso';
import intro from '@/lib/data/ciclo-celular/intro';
import type { Checkpoint, CheckpointId, Escenario } from '@/lib/data/ciclo-celular/tipos';
import { compilar, type EscenarioCompilado } from './motor';

export const CHECKPOINTS: Checkpoint[] = [restriccion, g1sDano, intraS, g2m, huso];
export const CHECKPOINT_POR_ID = Object.fromEntries(CHECKPOINTS.map((c) => [c.id, c])) as Record<CheckpointId, Checkpoint>;
export const INTRO: Escenario = intro;

export type FaseId = 'G1' | 'S' | 'G2' | 'M';

/** Fases del anillo (sección 5.1): grados desde las 12, sentido horario. */
export const FASES: { id: FaseId; desde: number; hasta: number; c0: string; c1: string; etiqueta: string }[] = [
  { id: 'G1', desde: 0, hasta: 162, c0: '#2FB7A6', c1: '#1E7F74', etiqueta: 'G₁' },
  { id: 'S', desde: 162, hasta: 270, c0: '#5B8CFF', c1: '#3659B8', etiqueta: 'S' },
  { id: 'G2', desde: 270, hasta: 330, c0: '#FFB547', c1: '#B87A1E', etiqueta: 'G₂' },
  { id: 'M', desde: 330, hasta: 360, c0: '#FF4D6D', c1: '#A8243D', etiqueta: 'M' },
];

/** Marcadores (sección 5.2). `fase` = arco en el que cae (color del borde). */
export const MARCADORES: Record<CheckpointId, { angulo: number; fase: FaseId; numero: number }> = {
  restriccion: { angulo: 128, fase: 'G1', numero: 1 },
  g1s_dano: { angulo: 162, fase: 'S', numero: 2 },
  intra_s: { angulo: 216, fase: 'S', numero: 3 },
  g2m: { angulo: 330, fase: 'M', numero: 4 },
  huso: { angulo: 347, fase: 'M', numero: 5 },
};

const compilados = new Map<string, EscenarioCompilado>();

export function compilado(esc: Escenario): EscenarioCompilado {
  let c = compilados.get(esc.id);
  if (!c) { c = compilar(esc); compilados.set(esc.id, c); }
  return c;
}

export function siguienteCheckpoint(id: CheckpointId): Checkpoint | null {
  const i = CHECKPOINTS.findIndex((c) => c.id === id);
  return CHECKPOINTS[i + 1] ?? null;
}
