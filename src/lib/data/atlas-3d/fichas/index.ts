// Fichas por región, cada una en su propio trozo de JS: el visor solo baja las
// de las regiones que carga, y después del modelo (no lo retrasan).
// Una pieza compartida (T12-L5, sacro) está en las dos; gana la primera región.

import type { Fichas } from './tipos';

const CARGAS: Record<string, () => Promise<{ FICHAS: Fichas }>> = {
  'miembro-superior-derecho': () => import('./miembro-superior-derecho'),
  'miembro-inferior-derecho': () => import('./miembro-inferior-derecho'),
};

export async function cargarFichas(regiones: string[]): Promise<Fichas> {
  const partes = await Promise.all(regiones.map((r) => CARGAS[r]?.().then((m) => m.FICHAS) ?? Promise.resolve({})));
  return Object.assign({}, ...partes.reverse());
}
