/**
 * Examen 3D de miembro superior: carga del banco, armado de cada examen y avance
 * guardado en el navegador.
 */

import type { BancoMS, PreguntaMS } from './tipos';

export const CLAVE_BANCO = 'aparato-locomotor/practico-ms';
export const PREGUNTAS_POR_EXAMEN = 10;

/** El banco va por la ruta de exámenes (plan + URL firmada): las respuestas no viajan en el bundle. */
export async function cargarBanco(signal?: AbortSignal): Promise<BancoMS> {
  const r = await fetch(`/api/examen/${CLAVE_BANCO}`, { signal });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Necesitas iniciar sesión para hacer el examen.');
    if (r.status === 403) throw new Error('El examen es parte del plan Interno.');
    throw new Error('El examen no está disponible ahora.');
  }
  const { url } = (await r.json()) as { url: string };
  const j = await fetch(url, { signal });
  if (!j.ok) throw new Error('No se pudo descargar el examen.');
  return hidratarBanco(await j.json());
}

/** Banco tal como se publica: lo del léxico va una sola vez (ver ensamblar-banco.mjs). */
export interface BancoPublicado extends Omit<BancoMS, 'preguntas'> {
  confusiones: Record<string, string[]>;
  preguntas: (Omit<PreguntaMS, 'preguntaA' | 'preguntaB'> & {
    preguntaA: { enunciado: string; respuesta: string; ref?: string; aceptadas?: string[]; noConfundir?: string[] };
    preguntaB: Omit<PreguntaMS['preguntaB'], 'respuestas'> & {
      respuestas: (Omit<PreguntaMS['preguntaB']['respuestas'][number], 'aceptadas'> & { aceptadas?: string[] })[];
    };
  })[];
}

/** Rellena cada pregunta con las formas del léxico de su estructura. */
export function hidratarBanco(b: BancoPublicado): BancoMS {
  const formas = (n: string) => b.formas[n] ?? [n];
  const confusiones = (n: string) => b.confusiones[n] ?? [];
  return {
    version: b.version,
    generado: b.generado,
    region: b.region,
    categorias: b.categorias,
    formas: b.formas,
    preguntas: b.preguntas.map((p) => ({
      ...p,
      preguntaA: {
        enunciado: p.preguntaA.enunciado,
        respuesta: p.preguntaA.respuesta,
        aceptadas: p.preguntaA.ref ? formas(p.preguntaA.ref) : p.preguntaA.aceptadas ?? [p.preguntaA.respuesta],
        noConfundir: p.preguntaA.ref ? confusiones(p.preguntaA.ref) : p.preguntaA.noConfundir ?? [],
      },
      preguntaB: {
        ...p.preguntaB,
        respuestas: p.preguntaB.respuestas.map((r) => ({
          ...r,
          aceptadas: r.ref ? [...new Set([...formas(r.ref), r.texto, ...(r.aceptadas ?? [])])] : r.aceptadas ?? [r.texto],
          noConfundir: r.ref ? confusiones(r.ref) : r.noConfundir,
        })),
      },
    })),
  };
}

// ── Plantilla: los 10 huecos del examen real (2025-A ↔ 2025-B) ──────────────
type Hueco = (p: PreguntaMS) => boolean;
const NERVIOS_MAYORES = /^ms-nervio-(axilar|musculocutaneo|mediano|cubital|radial)-/;
const PLANTILLA: { nombre: string; encaja: Hueco }[] = [
  { nombre: 'nervio mayor', encaja: (p) => NERVIOS_MAYORES.test(p.id) },
  { nombre: 'nervio', encaja: (p) => p.categoria === 'Nervios' },
  { nombre: 'accidente del hombro', encaja: (p) => p.tipoEstructura === 'accidente' && p.preguntaB.tipoB === 'inserciones_musculares' },
  { nombre: 'hueso de la mano', encaja: (p) => p.tipoEstructura === 'hueso' && p.preguntaB.tipoB === 'articulaciones' },
  { nombre: 'músculo del antebrazo', encaja: (p) => p.categoria === 'Músculos' && p.region === 'antebrazo' },
  { nombre: 'músculo de la mano', encaja: (p) => p.categoria === 'Músculos' && (p.region === 'mano' || p.region === 'muñeca') },
  { nombre: 'músculo de hombro o brazo', encaja: (p) => p.categoria === 'Músculos' && ['hombro', 'brazo', 'axila', 'codo'].includes(p.region) },
  { nombre: 'músculo', encaja: (p) => p.categoria === 'Músculos' },
  { nombre: 'vena', encaja: (p) => p.categoria === 'Venas' },
  { nombre: 'arteria', encaja: (p) => p.categoria === 'Arterias' },
];
const PESO = { salio: 3, muy_probable: 3, posible: 1 } as const;

/** Nombre de la estructura (para no preguntar dos veces la misma en un examen). */
const estructuraDe = (p: PreguntaMS) => p.preguntaA.respuesta;

/**
 * Arma un examen con la plantilla del real: en cada hueco, primero lo que aún no
 * se vio; entre eso, más peso a lo que salió o es muy probable. Nunca dos
 * preguntas de la misma estructura.
 */
export function armarExamen(banco: BancoMS, vistas: Set<string>, azar: () => number = Math.random): PreguntaMS[] {
  const elegidas: PreguntaMS[] = [];
  const usadas = new Set<string>();
  // Las preguntas de los exámenes reales (2025-A, 2025-B, 2024) salen primero: las
  // primeras barajas se arman con las que aún no se vieron (sin marcarlas como tales).
  const oficiales = banco.preguntas.filter((p) => p.origen.startsWith('oficial') && !vistas.has(p.id)).sort(() => azar() - 0.5);
  for (const p of oficiales) {
    if (elegidas.length >= PREGUNTAS_POR_EXAMEN) break;
    if (usadas.has(estructuraDe(p))) continue;
    elegidas.push(p);
    usadas.add(estructuraDe(p));
  }
  if (elegidas.length >= PREGUNTAS_POR_EXAMEN) return elegidas;
  const sortear = (lista: PreguntaMS[]) => {
    const total = lista.reduce((n, p) => n + PESO[p.probabilidad], 0);
    let r = azar() * total;
    for (const p of lista) { r -= PESO[p.probabilidad]; if (r <= 0) return p; }
    return lista.at(-1)!;
  };
  // Los huecos que ya cubre una oficial no se repiten.
  const cubiertos = new Set(PLANTILLA.filter((h) => elegidas.some((p) => h.encaja(p))).map((h) => h.nombre));
  for (const hueco of PLANTILLA) {
    if (elegidas.length >= PREGUNTAS_POR_EXAMEN) break;
    if (cubiertos.has(hueco.nombre)) continue;
    const libres = banco.preguntas.filter((p) => hueco.encaja(p) && !usadas.has(estructuraDe(p)));
    if (!libres.length) continue;
    const nuevas = libres.filter((p) => !vistas.has(p.id));
    const p = sortear(nuevas.length ? nuevas : libres);
    elegidas.push(p);
    usadas.add(estructuraDe(p));
  }
  // Si algún hueco quedó vacío, se completa con cualquiera aún no vista.
  for (const p of [...banco.preguntas].sort(() => azar() - 0.5)) {
    if (elegidas.length >= PREGUNTAS_POR_EXAMEN) break;
    if (!usadas.has(estructuraDe(p)) && !vistas.has(p.id)) { elegidas.push(p); usadas.add(estructuraDe(p)); }
  }
  // Orden del examen real: mezclado, sin agrupar por categoría.
  return elegidas.sort(() => azar() - 0.5);
}

// ── Avance (solo este navegador) ─────────────────────────────────────────────
const CLAVE_AVANCE = 'medgo:examen-ms:v1';
export interface Intento { fecha: string; puntos: number; total: number }
export interface Avance { vistas: string[]; intentos: Intento[] }

export function leerAvance(): Avance {
  try {
    const a = JSON.parse(localStorage.getItem(CLAVE_AVANCE) ?? 'null') as Avance | null;
    if (a && Array.isArray(a.vistas) && Array.isArray(a.intentos)) return a;
  } catch {}
  return { vistas: [], intentos: [] };
}

export function guardarIntento(ids: string[], puntos: number, total: number): Avance {
  const a = leerAvance();
  const nuevo: Avance = {
    vistas: [...new Set([...a.vistas, ...ids])],
    intentos: [{ fecha: new Date().toISOString(), puntos, total }, ...a.intentos].slice(0, 20),
  };
  try { localStorage.setItem(CLAVE_AVANCE, JSON.stringify(nuevo)); } catch {}
  return nuevo;
}
