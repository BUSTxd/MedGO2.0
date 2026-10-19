// Lo que el servidor le pasa al laboratorio «Hipersensibilidad» (según el plan,
// ver `contenidoDelLab` en ./registro.ts) y la compilación memoizada de cada
// escenario. Sin datos de capítulos: este archivo sí llega al navegador.

import type { Escenario, Ficha, Parte } from '@/lib/data/hipersensibilidad/tipos';
import { compilar, MODO_ESCRITORIO, type EscenarioCompilado, type Modo } from './motor';

/** Lo que se enseña de un capítulo aunque no esté abierto (portada, selector, tabla). */
export type ResumenParte = Pick<Parte, 'id' | 'numero' | 'nombre' | 'nombreCorto' | 'tipo' | 'lugar' | 'color' | 'pregunta'> & {
  nPasos: number;
  /** Del vistazo gratis. */
  gratis: boolean;
};

export type Contenido = {
  /** Con el plan: todos los capítulos. */
  completo: boolean;
  intro: Escenario;
  /** Los ocho capítulos en orden, abiertos o no. */
  indice: ResumenParte[];
  /** Solo los capítulos abiertos, con sus pasos. */
  partes: Parte[];
  /** Solo las fichas de los actores de la intro y de los capítulos abiertos. */
  fichas: Record<string, Ficha>;
};

const compilados = new Map<string, EscenarioCompilado>();
export function compilado(esc: Escenario, modo: Modo = MODO_ESCRITORIO): EscenarioCompilado {
  const clave = modo.movil ? `${esc.id}|${modo.asp}` : esc.id;
  let c = compilados.get(clave);
  if (!c) { c = compilar(esc, modo); compilados.set(clave, c); }
  return c;
}
