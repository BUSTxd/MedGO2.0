// Registro del laboratorio «Hipersensibilidad»: los ocho capítulos en orden
// (cuatro del tipo I, uno por cada tipo restante y la integración), la intro y
// la compilación memoizada (una por capítulo y por forma de pantalla).

import sensibilizacion from '@/lib/data/hipersensibilidad/sensibilizacion';
import faseInmediata from '@/lib/data/hipersensibilidad/fase-inmediata';
import faseTardia from '@/lib/data/hipersensibilidad/fase-tardia';
import anafilaxia from '@/lib/data/hipersensibilidad/anafilaxia';
import tipo2 from '@/lib/data/hipersensibilidad/tipo-2';
import tipo3 from '@/lib/data/hipersensibilidad/tipo-3';
import tipo4 from '@/lib/data/hipersensibilidad/tipo-4';
import integracion from '@/lib/data/hipersensibilidad/integracion';
import intro from '@/lib/data/hipersensibilidad/intro';
import type { Escenario, Parte, ParteId } from '@/lib/data/hipersensibilidad/tipos';
import { compilar, MODO_ESCRITORIO, type EscenarioCompilado, type Modo } from './motor';

export const PARTES: Parte[] = [sensibilizacion, faseInmediata, faseTardia, anafilaxia, tipo2, tipo3, tipo4, integracion];
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
