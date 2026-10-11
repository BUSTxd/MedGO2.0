/**
 * Examen 3D de miembro superior: carga del banco, barajas fijas de 10 y avance
 * guardado en el navegador.
 */

import type { PlanKey } from '@/lib/plans';
import { RANGO_NIVEL, firmaDe, huella, nivelMayoritario, type NivelBaraja } from '@/lib/barajas';
import type { BancoMS, PreguntaMS } from './tipos';

export const CLAVE_BANCO = 'aparato-locomotor/practico-ms';
export const PREGUNTAS_POR_EXAMEN = 10;

/**
 * Una baraja tal como la describe el servidor a quien no tiene el plan: las
 * libres traen sus `ids` (sus preguntas vienen en el mismo banco recortado); las
 * demás, solo número y nivel, para pintarlas con candado.
 */
export interface IndiceBaraja { numero: number; firma: string; nivel: NivelBaraja; ids?: string[] }

/** Lo que hay detrás del candado, contado en el servidor (el cliente no lo ve). */
export interface PruebaGratis { plan: PlanKey; preguntas: number; estructuras: number; secciones: number }

export interface CargaBanco {
  banco: BancoMS;
  barajas: Baraja[];
  /** Solo sin plan: qué abre el plan que falta. */
  prueba: PruebaGratis | null;
}

/**
 * El banco va por la ruta de exámenes: las respuestas no viajan en el bundle. Con
 * el plan llega entero (URL firmada) y las barajas se arman aquí; sin él, el
 * servidor manda solo las preguntas de las barajas libres y el índice de todas.
 */
export async function cargarBanco(signal?: AbortSignal): Promise<CargaBanco> {
  const r = await fetch(`/api/examen/${CLAVE_BANCO}`, { signal });
  if (!r.ok) {
    if (r.status === 401) throw new Error('Necesitas iniciar sesión para hacer el examen.');
    if (r.status === 403) throw new Error('El examen es parte del plan Interno.');
    throw new Error('El examen no está disponible ahora.');
  }
  const res = (await r.json()) as
    | { url: string }
    | { payload: BancoPublicado; barajas: IndiceBaraja[]; prueba: PruebaGratis };
  if ('payload' in res) {
    const banco = hidratarBanco(res.payload);
    const porId = new Map(banco.preguntas.map((p) => [p.id, p]));
    const barajas = res.barajas.map((b): Baraja => ({
      numero: b.numero,
      firma: b.firma,
      nivel: b.nivel,
      preguntas: (b.ids ?? []).map((id) => porId.get(id)).filter((p): p is PreguntaMS => !!p),
      bloqueada: !b.ids,
    }));
    return { banco, barajas, prueba: res.prueba };
  }
  const j = await fetch(res.url, { signal });
  if (!j.ok) throw new Error('No se pudo descargar el examen.');
  const banco = hidratarBanco(await j.json());
  return { banco, barajas: armarBarajas(banco), prueba: null };
}

/**
 * Lo que el servidor entrega a quien no tiene el plan (`barajasLibres` en
 * `EXAMENES`): las barajas se arman con el banco ENTERO —así salen idénticas a
 * las de quien sí lo tiene— y del JSON solo se dejan las preguntas de las libres.
 */
export function recortarParaPrueba(publicado: BancoPublicado, libres: number[], plan: PlanKey) {
  const barajas = armarBarajas(hidratarBanco(publicado));
  const abiertas = barajas.filter((b) => libres.includes(b.numero));
  const ids = new Set(abiertas.flatMap((b) => b.preguntas.map((p) => p.id)));
  const { preguntas } = publicado;
  const estructuras = new Set(preguntas.map((p) => p.preguntaA.respuesta)).size;
  const secciones = new Set(preguntas.map(({ resumenRelacionado: r }) => `${r.claseId}|${r.opcion}|${r.seccion}`)).size;
  return {
    payload: { ...publicado, preguntas: publicado.preguntas.filter((p) => ids.has(p.id)) },
    barajas: barajas.map((b): IndiceBaraja => ({
      numero: b.numero,
      firma: b.firma,
      nivel: b.nivel,
      ...(libres.includes(b.numero) ? { ids: b.preguntas.map((p) => p.id) } : {}),
    })),
    prueba: { plan, preguntas: preguntas.length, estructuras, secciones } satisfies PruebaGratis,
  };
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
/** Nombre de la estructura (para no preguntar dos veces la misma en un examen). */
const estructuraDe = (p: PreguntaMS) => p.preguntaA.respuesta;

// ── Barajas: el banco partido en exámenes fijos de 10 ────────────────────────
export type { NivelBaraja };
const RANGO = RANGO_NIVEL;
/** También lo usan las tarjetas (`scripts/examen-ms/tarjetas.mjs` lo calca): las dos barajas ordenan igual. */
export const nivelDe = (p: Pick<PreguntaMS, 'origen' | 'probabilidad'>): NivelBaraja =>
  p.origen.startsWith('oficial') || p.probabilidad === 'salio' ? 'oficial' : p.probabilidad === 'posible' ? 'posible' : 'muy_probable';

export interface Baraja {
  numero: number;
  /** Huella de sus preguntas: si el banco cambia, la baraja deja de contar como hecha. */
  firma: string;
  nivel: NivelBaraja;
  /** Vacía si está bloqueada: sus preguntas no llegaron al navegador. */
  preguntas: PreguntaMS[];
  /** Sin el plan: se pinta con candado y abre la pasarela. */
  bloqueada?: boolean;
}

/**
 * Parte el banco en barajas fijas de 10, de lo más probable a lo menos: cada una
 * sale del nivel más alto que queda y solo baja al siguiente cuando ese se acaba.
 * Dentro del nivel, primero los huecos de la plantilla del examen real y luego el
 * resto; nunca dos preguntas de la misma estructura (salvo, si hace falta, en las
 * últimas, antes que dejar una baraja corta). Determinista: el mismo banco da
 * siempre las mismas barajas, así que se pueden marcar como hechas y repetir.
 */
export function armarBarajas(banco: BancoMS): Baraja[] {
  const quedan = [...banco.preguntas].sort(
    (a, b) => RANGO[nivelDe(a)] - RANGO[nivelDe(b)] || huella(a.id) - huella(b.id),
  );
  const barajas: Baraja[] = [];
  while (quedan.length) {
    const elegidas: PreguntaMS[] = [];
    const usadas = new Set<string>();
    const tomar = (p: PreguntaMS) => {
      elegidas.push(p);
      usadas.add(estructuraDe(p));
      quedan.splice(quedan.indexOf(p), 1);
    };
    const libre = (p: PreguntaMS, rango: number) => RANGO[nivelDe(p)] === rango && !usadas.has(estructuraDe(p));
    for (let rango = RANGO[nivelDe(quedan[0])]; rango <= RANGO.posible && elegidas.length < PREGUNTAS_POR_EXAMEN; rango++) {
      // Cada pregunta ya elegida ocupa un hueco (el más específico en el que encaja).
      const huecos = [...PLANTILLA];
      for (const p of elegidas) {
        const k = huecos.findIndex((h) => h.encaja(p));
        if (k >= 0) huecos.splice(k, 1);
      }
      for (const hueco of huecos) {
        if (elegidas.length >= PREGUNTAS_POR_EXAMEN) break;
        const p = quedan.find((x) => libre(x, rango) && hueco.encaja(x));
        if (p) tomar(p);
      }
      for (const p of [...quedan]) {
        if (elegidas.length >= PREGUNTAS_POR_EXAMEN) break;
        if (libre(p, rango)) tomar(p);
      }
    }
    while (elegidas.length < PREGUNTAS_POR_EXAMEN && quedan.length) tomar(quedan[0]);

    barajas.push({
      numero: barajas.length + 1,
      firma: firmaDe(elegidas.map((p) => p.id)),
      nivel: nivelMayoritario(elegidas.map(nivelDe)),
      preguntas: elegidas,
    });
  }
  return barajas;
}

// ── Avance (solo este navegador) ─────────────────────────────────────────────
const CLAVE_AVANCE = 'medgo:examen-ms:v1';
export interface Intento { fecha: string; puntos: number; total: number }
/** Último resultado de una baraja (por su `firma`). */
export interface ResultadoBaraja { puntos: number; total: number; fecha: string; veces: number }
export interface Avance { vistas: string[]; intentos: Intento[]; barajas: Record<string, ResultadoBaraja> }

export function leerAvance(): Avance {
  try {
    const a = JSON.parse(localStorage.getItem(CLAVE_AVANCE) ?? 'null') as Partial<Avance> | null;
    // Los avances de antes de las barajas no traen `barajas`.
    if (a && Array.isArray(a.vistas) && Array.isArray(a.intentos)) return { vistas: a.vistas, intentos: a.intentos, barajas: a.barajas ?? {} };
  } catch {}
  return { vistas: [], intentos: [], barajas: {} };
}

export function guardarIntento(baraja: Baraja, puntos: number, total: number): Avance {
  const a = leerAvance();
  const fecha = new Date().toISOString();
  const nuevo: Avance = {
    vistas: [...new Set([...a.vistas, ...baraja.preguntas.map((p) => p.id)])],
    intentos: [{ fecha, puntos, total }, ...a.intentos].slice(0, 20),
    barajas: { ...a.barajas, [baraja.firma]: { puntos, total, fecha, veces: (a.barajas[baraja.firma]?.veces ?? 0) + 1 } },
  };
  try { localStorage.setItem(CLAVE_AVANCE, JSON.stringify(nuevo)); } catch {}
  return nuevo;
}
