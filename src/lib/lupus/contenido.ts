// Lo que el servidor le pasa al laboratorio «Lupus» (según el plan, ver
// `contenidoDelLab` en ./registro.ts) y la compilación memoizada de cada
// capítulo. Sin datos de capítulos: este archivo sí llega al navegador.

import type { Escenario, Ficha, Parte } from '@/lib/data/lupus/tipos';
import type { MetaParte } from '@/lib/data/lupus/indice';
import { compilar, MODO_ESCRITORIO, type EscenarioCompilado, type Modo } from './motor';

/** Lo que se enseña de un capítulo aunque no esté abierto (portada, selector). */
export type ResumenParte = MetaParte & {
  nPasos: number;
  /** Duración de su voz (s). */
  segundos: number;
  /** Del vistazo gratis. */
  gratis: boolean;
  /** Ya está animado (los demás salen como «Pronto»). */
  listo: boolean;
};

export type Contenido = {
  /** Con el plan: todos los capítulos. */
  completo: boolean;
  /** Los 12 capítulos en orden, abiertos o no. */
  indice: ResumenParte[];
  /** Solo los capítulos abiertos (y animados), con sus pasos y su voz. */
  partes: Parte[];
  /** Solo las fichas de los actores de los capítulos abiertos. */
  fichas: Record<string, Ficha>;
};

const compilados = new Map<string, EscenarioCompilado>();
export function compilado(esc: Escenario, modo: Modo = MODO_ESCRITORIO): EscenarioCompilado {
  const clave = modo.movil ? `${esc.id}|${modo.asp}` : esc.id;
  let c = compilados.get(clave);
  if (!c) { c = compilar(esc, modo); compilados.set(clave, c); }
  return c;
}
