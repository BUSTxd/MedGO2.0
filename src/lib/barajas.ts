/**
 * Barajas: un banco partido en tandas fijas, de lo más probable a lo menos. Lo
 * comparten el examen 3D de miembro superior (barajas de 10, con la plantilla
 * del examen real: `armarBarajas` en `examen-ms/sesion.ts`) y sus tarjetas de
 * memoria (barajas de 30: `partirEnBarajas`). Deterministas: el mismo banco da
 * siempre las mismas barajas, así que se pueden marcar como hechas y repetir.
 */

/** Lo que salió en un examen real (2025-A, 2025-B, 2024) va primero; luego lo muy probable. */
export type NivelBaraja = 'oficial' | 'muy_probable' | 'posible';
export const RANGO_NIVEL: Record<NivelBaraja, number> = { oficial: 0, muy_probable: 1, posible: 2 };
export const NIVELES_BARAJA: { nivel: NivelBaraja; titulo: string }[] = [
  { nivel: 'oficial', titulo: 'Salieron en exámenes reales' },
  { nivel: 'muy_probable', titulo: 'Muy probables' },
  { nivel: 'posible', titulo: 'Posibles' },
];

/** FNV-1a: mezcla estable (la misma en cada navegador) sin depender del orden del JSON. */
export function huella(t: string): number {
  let h = 0x811c9dc5;
  for (let k = 0; k < t.length; k++) h = Math.imul(h ^ t.charCodeAt(k), 0x01000193);
  return h >>> 0;
}

/** Huella de las preguntas de una baraja: si el banco cambia, la baraja deja de contar como hecha. */
export const firmaDe = (ids: string[]) => huella([...ids].sort().join('|')).toString(36);

/** El nivel que más se repite (a igualdad, el más alto). */
export function nivelMayoritario(niveles: NivelBaraja[]): NivelBaraja {
  const cuenta = (n: NivelBaraja) => niveles.filter((x) => x === n).length;
  return (['oficial', 'muy_probable', 'posible'] as const).reduce((m, n) => (cuenta(n) > cuenta(m) ? n : m));
}

export interface BarajaDe<T> { numero: number; firma: string; nivel: NivelBaraja; items: T[] }

/**
 * Parte en tandas de `tam`: primero lo que salió en los exámenes reales, luego
 * lo muy probable y lo posible; dentro de cada nivel, mezclado por la huella del
 * id (estable). Sin `nivel`, cuenta como posible.
 */
export function partirEnBarajas<T extends { id: string; nivel?: NivelBaraja }>(items: T[], tam: number): BarajaDe<T>[] {
  const rango = (x: T) => RANGO_NIVEL[x.nivel ?? 'posible'];
  const orden = [...items].sort((a, b) => rango(a) - rango(b) || huella(a.id) - huella(b.id));
  const barajas: BarajaDe<T>[] = [];
  for (let i = 0; i < orden.length; i += tam) {
    const tanda = orden.slice(i, i + tam);
    barajas.push({
      numero: barajas.length + 1,
      firma: firmaDe(tanda.map((x) => x.id)),
      nivel: nivelMayoritario(tanda.map((x) => x.nivel ?? 'posible')),
      items: tanda,
    });
  }
  return barajas;
}
