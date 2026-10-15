// Registro del laboratorio «Maduración de linfocitos»: las cinco partes en el
// orden de la maduración, la intro y la compilación memoizada (una por parte y
// por forma de pantalla: en un teléfono la cámara se encuadra de otra manera).

import medula from '@/lib/data/linfocitos/medula';
import linfocitoB from '@/lib/data/linfocitos/linfocito-b';
import timo from '@/lib/data/linfocitos/timo';
import centroGerminal from '@/lib/data/linfocitos/centro-germinal';
import neoplasias from '@/lib/data/linfocitos/neoplasias';
import intro from '@/lib/data/linfocitos/intro';
import type { Escenario, Parte, ParteId } from '@/lib/data/linfocitos/tipos';
import { compilar, MODO_ESCRITORIO, type EscenarioCompilado, type Modo } from './motor';

export const PARTES: Parte[] = [medula, linfocitoB, timo, centroGerminal, neoplasias];
export const PARTE_POR_ID = Object.fromEntries(PARTES.map((p) => [p.id, p])) as Record<ParteId, Parte>;
export const INTRO: Escenario = intro;

const compilados = new Map<string, EscenarioCompilado>();
export function compilado(esc: Escenario, modo: Modo = MODO_ESCRITORIO): EscenarioCompilado {
  const clave = modo.movil ? `${esc.id}|${modo.asp}` : esc.id;
  let c = compilados.get(clave);
  if (!c) { c = compilar(esc, modo); compilados.set(clave, c); }
  return c;
}

export function siguienteParte(id: ParteId): Parte | null {
  return PARTES[PARTES.findIndex((p) => p.id === id) + 1] ?? null;
}
