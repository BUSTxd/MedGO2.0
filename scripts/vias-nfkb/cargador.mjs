// Hook de resolución para `verificar.mjs`: los datos del laboratorio importan
// módulos hermanos sin extensión (`./colores`), como pide TypeScript, y Node
// en modo ESM exige la extensión. Se le añade `.ts` a los relativos.

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(especificador, contexto, siguiente) {
  if ((especificador.startsWith('./') || especificador.startsWith('../')) && !/\.[cm]?[jt]s$/.test(especificador) && contexto.parentURL) {
    const url = new URL(`${especificador}.ts`, contexto.parentURL);
    if (existsSync(fileURLToPath(url))) return siguiente(url.href, contexto);
  }
  return siguiente(especificador, contexto);
}
