import 'server-only';
import { PREGUNTAS } from '@/lib/data/encib/preguntas';
import { TEMARIO } from '@/lib/data/encib/temario';
import type { AreaEncib, Carga, Dificultad, PreguntaEncib } from '@/lib/data/encib';

/**
 * Cuentas sobre las 300 preguntas clasificadas. Todo se calcula en el servidor:
 * las páginas solo reciben los números, nunca la lista entera.
 */

export const ANIOS = [2021, 2024, 2025] as const;
export type Anio = (typeof ANIOS)[number];
/** 2024 y 2025 comparten temario y pesos con 2026: son el modelo del examen. */
export const ANIOS_VIGENTES: readonly Anio[] = [2024, 2025];

export const areaDe = (codigo: string) => codigo.slice(0, 3) as AreaEncib;

const de = (anios: readonly Anio[]) => PREGUNTAS.filter((q) => (anios as readonly number[]).includes(q.anio));

function contar<K extends string>(qs: PreguntaEncib[], clave: (q: PreguntaEncib) => K, claves: readonly K[]) {
  const r = Object.fromEntries(claves.map((k) => [k, 0])) as Record<K, number>;
  for (const q of qs) r[clave(q)] = (r[clave(q)] ?? 0) + 1;
  return r;
}

const DIFICULTADES = ['menor', 'mediana', 'mayor'] as const;
const CARGAS = ['memoria', 'aplicacion', 'integracion'] as const;

export function dificultad(anios: readonly Anio[], area?: AreaEncib): Record<Dificultad, number> {
  return contar(de(anios).filter((q) => !area || areaDe(q.codigo) === area), (q) => q.dificultad, DIFICULTADES);
}

export function carga(anios: readonly Anio[], area?: AreaEncib): Record<Carga, number> {
  return contar(de(anios).filter((q) => !area || areaDe(q.codigo) === area), (q) => q.carga, CARGAS);
}

export function formato(anio: Anio) {
  const qs = de([anio]);
  return {
    ...contar(qs, (q) => q.formato, ['caso', 'problema', 'directa'] as const),
    decorativo: qs.filter((q) => q.decorativo).length,
  };
}

export function preguntasDeArea(area: AreaEncib, anio: Anio) {
  return de([anio]).filter((q) => areaDe(q.codigo) === area).length;
}

/** Las preguntas de mayor dificultad de los años vigentes, con su concepto. */
export function preguntasDificiles() {
  return de(ANIOS_VIGENTES).filter((q) => q.dificultad === 'mayor');
}

/** Nombre del tema a partir de su código. */
const NOMBRE_TEMA = new Map(Object.values(TEMARIO).flatMap((subs) => subs.flatMap((s) => s.temas.map((t) => [t.codigo, t.nombre] as const))));
export const nombreTema = (codigo: string) => NOMBRE_TEMA.get(codigo) ?? codigo;

/** Temas (código) que salieron en los tres años. */
export function temasEnLosTres(): string[] {
  const por = (a: Anio) => new Set(de([a]).map((q) => q.codigo));
  const [x, y, z] = ANIOS.map(por);
  return [...x].filter((c) => y.has(c) && z.has(c)).sort();
}

/** Cuántos temas distintos tocó cada año. */
export const temasDistintos = (anio: Anio) => new Set(de([anio]).map((q) => q.codigo)).size;

export interface AparicionTema {
  anio: Anio;
  n: number;
  dificultad: Dificultad;
  concepto: string;
}

/** Para cada tema de un área: en qué preguntas salió, como tema principal. */
export function aparicionesDeArea(area: AreaEncib): Map<string, AparicionTema[]> {
  const m = new Map<string, AparicionTema[]>();
  for (const q of PREGUNTAS) {
    if (areaDe(q.codigo) !== area) continue;
    const lista = m.get(q.codigo) ?? [];
    lista.push({ anio: q.anio, n: q.n, dificultad: q.dificultad, concepto: q.concepto });
    m.set(q.codigo, lista);
  }
  return m;
}

/** Subáreas de un área ordenadas por cuántas preguntas recibieron en 2024 y 2025. */
export function subareasMasPreguntadas(area: AreaEncib) {
  return TEMARIO[area]
    .map((s) => ({
      codigo: s.codigo,
      nombre: s.nombre,
      preguntas: de(ANIOS_VIGENTES).filter((q) => q.codigo.startsWith(s.codigo + '.')).length,
    }))
    .sort((a, b) => b.preguntas - a.preguntas);
}
