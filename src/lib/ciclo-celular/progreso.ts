// Progreso del laboratorio en localStorage. Todo va envuelto en try/catch: el
// laboratorio funciona igual si el almacenamiento falla (modo privado, datos
// del sitio bloqueados); solo no recuerda.

import type { CheckpointId } from '@/lib/data/ciclo-celular/tipos';

export type Nivel = 'guiado' | 'estandar' | 'examen';
export type ResultadoAprender = { estrellas: number; errores: number; pistas: number; ms: number };

export type Progreso = {
  explorado: Partial<Record<CheckpointId, boolean>>;
  aprender: Partial<Record<CheckpointId, Partial<Record<Nivel, ResultadoAprender>>>>;
  prueba: Partial<Record<CheckpointId | 'integrada', number>>;
};

const CLAVE = 'medgo-ciclo-celular-v1';
const VACIO: Progreso = { explorado: {}, aprender: {}, prueba: {} };

export function leerProgreso(): Progreso {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return structuredClone(VACIO);
    const p = JSON.parse(raw) as Partial<Progreso>;
    return { explorado: p.explorado ?? {}, aprender: p.aprender ?? {}, prueba: p.prueba ?? {} };
  } catch {
    return structuredClone(VACIO);
  }
}

function guardar(p: Progreso) {
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* sin almacenamiento */ }
}

export function marcarExplorado(id: CheckpointId): Progreso {
  const p = leerProgreso();
  p.explorado[id] = true;
  guardar(p);
  return p;
}

/** Guarda el resultado si mejora al anterior (más estrellas; a igualdad, menos errores). */
export function guardarAprender(id: CheckpointId, nivel: Nivel, r: ResultadoAprender): Progreso {
  const p = leerProgreso();
  const previo = p.aprender[id]?.[nivel];
  const mejor = !previo || r.estrellas > previo.estrellas || (r.estrellas === previo.estrellas && r.errores < previo.errores);
  if (mejor) p.aprender[id] = { ...p.aprender[id], [nivel]: r };
  guardar(p);
  return p;
}

export function guardarPrueba(id: CheckpointId | 'integrada', puntaje: number): Progreso {
  const p = leerProgreso();
  if ((p.prueba[id] ?? -1) < puntaje) p.prueba[id] = puntaje;
  guardar(p);
  return p;
}

/** Completado = aprendizaje terminado al menos en nivel estándar. */
export function completado(p: Progreso, id: CheckpointId): boolean {
  const a = p.aprender[id];
  return !!(a?.estandar || a?.examen);
}
