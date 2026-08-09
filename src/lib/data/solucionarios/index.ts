import type { Solucionario } from './types';
import { qorPd1 } from './qor-pd-1';
import { qorPd2 } from './qor-pd-2';
import { qorPd3 } from './qor-pd-3';
import { qorPd4 } from './qor-pd-4';
import { qorPd5 } from './qor-pd-5';
import { qorPd6 } from './qor-pd-6';
import { qorPd7 } from './qor-pd-7';
import { qorPd8 } from './qor-pd-8';

export type { Solucionario, PasoSolucion, Bloque, EsquemaId } from './types';

/**
 * Registro de solucionarios por id de actividad. Para añadir uno nuevo basta
 * crear su archivo de contenido y registrarlo aquí — no se toca el runner.
 */
export const SOLUCIONARIOS: Record<string, Solucionario> = {
  'qor-pd-1': qorPd1,
  'qor-pd-2': qorPd2,
  'qor-pd-3': qorPd3,
  'qor-pd-4': qorPd4,
  'qor-pd-5': qorPd5,
  'qor-pd-6': qorPd6,
  'qor-pd-7': qorPd7,
  'qor-pd-8': qorPd8,
};

export function findSolucionario(id: string): Solucionario | null {
  return SOLUCIONARIOS[id] ?? null;
}
