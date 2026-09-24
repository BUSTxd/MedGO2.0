/**
 * Valoración que el alumno da a cada pregunta del quiz: qué tan bien armada está.
 * Compartido por el runner (cliente), la route que la guarda y el panel de admin.
 */

export type Valoracion = 'rojo' | 'amarillo' | 'verde';

export const VALORACIONES: readonly Valoracion[] = ['rojo', 'amarillo', 'verde'];

/** Puntos de cada color para la nota de satisfacción (0-100). */
const PUNTOS: Record<Valoracion, number> = { rojo: 0, amarillo: 50, verde: 100 };

export function esValoracion(v: unknown): v is Valoracion {
  return typeof v === 'string' && (VALORACIONES as readonly string[]).includes(v);
}

export interface Conteo { rojo: number; amarillo: number; verde: number }

export function totalDe(c: Conteo): number {
  return c.rojo + c.amarillo + c.verde;
}

/** Satisfacción media 0-100, o null si aún nadie la valoró. */
export function satisfaccionDe(c: Conteo): number | null {
  const n = totalDe(c);
  if (!n) return null;
  return Math.round((c.rojo * PUNTOS.rojo + c.amarillo * PUNTOS.amarillo + c.verde * PUNTOS.verde) / n);
}

/** El semáforo de una nota: por debajo de 40 hay que reescribirla, de 70 para arriba está bien. */
export function semaforoDe(nota: number | null): Valoracion | null {
  if (nota === null) return null;
  return nota >= 70 ? 'verde' : nota >= 40 ? 'amarillo' : 'rojo';
}

export interface PreguntaValorada extends Conteo {
  id: string;
  /** Enunciado, recortado, para reconocer la pregunta en el panel. */
  enunciado: string;
  total: number;
  satisfaccion: number;
}

export interface ClaseValorada extends Conteo {
  key: string;
  titulo: string;
  total: number;
  satisfaccion: number;
  preguntas: PreguntaValorada[];
}

export interface ResumenValoraciones extends Conteo {
  clases: ClaseValorada[];
  total: number;
}
