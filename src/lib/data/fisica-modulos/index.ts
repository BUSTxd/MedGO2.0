import type { LaboratorioClase, ModuloTeoria } from './types';
import { moduloC6 } from './fis-c-6';
import { moduloC7 } from './fis-c-7';
import { LABS, findLab } from './labs';

export type {
  ModuloTeoria, Seccion, BloqueLogica, SimId, Chequeo, Reto,
  LaboratorioClase, TemaLab,
} from './types';
export { LABS, findLab };

/**
 * Registro por `claseId` del sílabo. Añadir un módulo nuevo es crear su archivo
 * `fis-c-N.ts` y registrarlo aquí; ni la página ni el motor cambian.
 */
export const MODULOS: Record<string, ModuloTeoria> = {
  [moduloC6.claseId]: moduloC6,
  [moduloC7.claseId]: moduloC7,
};

export function findModulo(claseId: string): ModuloTeoria | null {
  return MODULOS[claseId] ?? null;
}

/**
 * Si la clase tiene material interactivo, del tipo que sea.
 *
 * El sílabo declara `modulo: true` y esta función es la que dice qué se abre:
 * el módulo completo si existe, y si no el laboratorio suelto. La página hace
 * la misma comprobación en el mismo orden — un módulo completo siempre manda
 * sobre el laboratorio, aunque la clase tenga los dos registrados.
 */
export function tieneModulo(claseId: string): boolean {
  return claseId in MODULOS || findLab(claseId) !== null;
}

/** Cuántas simulaciones distintas ofrece una clase, para rotular su tarjeta. */
export function simsDeClase(claseId: string): number {
  const modulo = MODULOS[claseId];
  if (modulo) return new Set(modulo.secciones.map((s) => s.sim)).size;
  const lab = findLab(claseId);
  if (lab) return new Set(lab.temas.map((t) => t.sim)).size;
  return 0;
}

/** Título de portada de lo que abre una clase, sea módulo o laboratorio. */
export function tituloInteractivo(claseId: string): string | null {
  const modulo = MODULOS[claseId];
  if (modulo) return modulo.titulo;
  const lab: LaboratorioClase | null = findLab(claseId);
  return lab ? lab.titulo : null;
}
