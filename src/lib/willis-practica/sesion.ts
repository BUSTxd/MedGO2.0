/**
 * Práctica del lab Polígono de Willis 3D: carga del banco, rondas de 10 y avance
 * guardado en el navegador. Igual que la de Médula Espinal 3D: el banco va por
 * la ruta de exámenes (requisito del lab) y las respuestas no viajan en el bundle.
 */

import { CLAVE_PRACTICA, type BancoWP, type CategoriaWP, type PreguntaWP, type TipoWP } from './tipos';

export const PREGUNTAS_POR_RONDA = 10;
const CLAVE_AVANCE = 'medgo:willis-practica:v1';

let cache: BancoWP | null = null;

export async function cargarBanco(signal?: AbortSignal): Promise<BancoWP> {
  if (cache) return cache;
  const r = await fetch(`/api/examen/${CLAVE_PRACTICA}`, { signal });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Necesitas iniciar sesión para practicar.');
    if (r.status === 403) throw new Error('La práctica es parte del plan que abre este laboratorio.');
    throw new Error('La práctica no está disponible ahora.');
  }
  const { url } = (await r.json()) as { url: string };
  const j = await fetch(url, { signal });
  if (!j.ok) throw new Error('No se pudo descargar la práctica.');
  cache = (await j.json()) as BancoWP;
  return cache;
}

// ── Avance (navegador) ───────────────────────────────────────────────────────

export interface Avance {
  /** Último resultado de cada pregunta respondida (true = acierto). */
  resultados: Record<string, boolean>;
}

export function leerAvance(): Avance {
  try {
    const raw = localStorage.getItem(CLAVE_AVANCE);
    if (raw) {
      const a = JSON.parse(raw) as Avance;
      if (a && typeof a.resultados === 'object') return a;
    }
  } catch { /* sin almacenamiento */ }
  return { resultados: {} };
}

export function guardarResultado(id: string, ok: boolean): Avance {
  const a = leerAvance();
  a.resultados[id] = ok;
  try { localStorage.setItem(CLAVE_AVANCE, JSON.stringify(a)); } catch { /* sin almacenamiento */ }
  return a;
}

// ── Rondas ───────────────────────────────────────────────────────────────────

export interface Filtro { categorias: CategoriaWP[]; tipos: TipoWP[] }

export function filtrar(banco: BancoWP, f: Filtro): PreguntaWP[] {
  return banco.preguntas.filter((p) => f.categorias.includes(p.categoria) && f.tipos.includes(p.tipo));
}

function barajar<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Pregunta lista para jugar: alternativas en un orden nuevo cada ronda. */
export function prepararPregunta(p: PreguntaWP): PreguntaWP {
  if (p.forma !== 'opciones') return p;
  const orden = barajar(p.opciones.map((_, i) => i));
  return { ...p, opciones: orden.map((i) => p.opciones[i]), correcta: orden.indexOf(p.correcta) };
}

/**
 * Ronda de hasta 10: primero las nunca respondidas, luego las falladas y al
 * final las acertadas, cada grupo al azar. `soloFalladas` repasa los errores.
 */
export function armarRonda(pool: PreguntaWP[], avance: Avance, soloFalladas = false): PreguntaWP[] {
  const r = avance.resultados;
  const nuevas = barajar(pool.filter((p) => !(p.id in r)));
  const falladas = barajar(pool.filter((p) => r[p.id] === false));
  const acertadas = barajar(pool.filter((p) => r[p.id] === true));
  const orden = soloFalladas ? falladas : [...nuevas, ...falladas, ...acertadas];
  return barajar(orden.slice(0, PREGUNTAS_POR_RONDA)).map(prepararPregunta);
}

/** Cuántas hay, cuántas se respondieron y cuántas se acertaron (último intento). */
export function progreso(pool: PreguntaWP[], avance: Avance) {
  let vistas = 0;
  let aciertos = 0;
  for (const p of pool) {
    if (p.id in avance.resultados) {
      vistas++;
      if (avance.resultados[p.id]) aciertos++;
    }
  }
  return { total: pool.length, vistas, aciertos, falladas: vistas - aciertos };
}
