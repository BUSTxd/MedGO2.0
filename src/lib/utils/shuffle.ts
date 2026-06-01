/**
 * Mezcla aleatoria (Fisher–Yates) que devuelve una copia nueva sin mutar el
 * arreglo original. Reutilizable en minijuegos del laboratorio.
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
