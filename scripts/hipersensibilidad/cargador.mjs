// Hook de resolución para `verificar.mjs`: los datos y el motor importan
// módulos sin extensión (`./colores`) y con el alias `@/` (→ `src/`), como pide
// TypeScript; Node en modo ESM no entiende ninguno de los dos.

import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');

export async function resolve(especificador, contexto, siguiente) {
  let url = null;
  if (especificador.startsWith('@/')) url = pathToFileURL(path.join(SRC, especificador.slice(2)));
  else if ((especificador.startsWith('./') || especificador.startsWith('../')) && contexto.parentURL) url = new URL(especificador, contexto.parentURL);
  if (url && !/\.[cm]?[jt]s$/.test(url.pathname)) {
    const ts = new URL(`${url.href}.ts`);
    if (existsSync(fileURLToPath(ts))) return siguiente(ts.href, contexto);
  }
  if (url) return siguiente(url.href, contexto);
  return siguiente(especificador, contexto);
}
