// Hook de módulos para `vista.mjs`: deja importar desde Node las láminas del laboratorio
// (TSX con el alias `@/`, imports sin extensión y CSS Modules) y pintarlas con react-dom/server.
//   · `@/…` → `src/…`; `./x` y `../x` sin extensión → `.tsx`, `.ts` o `/index`.
//   · `.ts` y `.tsx` se transpilan con TypeScript (JSX automático).
//   · `*.module.css` → un objeto cuyas claves son el propio nombre de la clase; la ruta de cada
//     archivo se anota en `globalThis.__CSS_MODULES__` para meter su CSS en la página de prueba.

import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');

function resolverRuta(base) {
  const intentos = [base, `${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')];
  for (const i of intentos) if (existsSync(i) && statSync(i).isFile()) return i;
  return null;
}

export async function resolve(especificador, contexto, siguiente) {
  // `next/dynamic` (lo usa `MuroPago`, de donde sale el candado de las tablas) no se resuelve fuera de
  // Next: un hueco vale, porque el muro de pago no se pinta en estas revisiones.
  if (especificador === 'next/dynamic') return { url: 'data:text/javascript,export default function dynamic() { return function Dinamico() { return null; }; }', shortCircuit: true };
  let base = null;
  if (especificador.startsWith('@/')) base = path.join(SRC, especificador.slice(2));
  else if ((especificador.startsWith('./') || especificador.startsWith('../')) && contexto.parentURL?.startsWith('file:')) base = path.resolve(path.dirname(fileURLToPath(contexto.parentURL)), especificador);
  if (base) {
    const ruta = resolverRuta(base);
    if (ruta) return { url: pathToFileURL(ruta).href, shortCircuit: true };
  }
  return siguiente(especificador, contexto);
}

export async function load(url, contexto, siguiente) {
  if (url.endsWith('.module.css')) {
    const ruta = fileURLToPath(url);
    (globalThis.__CSS_MODULES__ ??= new Set()).add(ruta);
    return { format: 'module', shortCircuit: true, source: 'export default new Proxy({}, { get: (_, k) => (typeof k === "string" ? k : undefined) });' };
  }
  if (/\.tsx?$/.test(url) && !url.includes('node_modules')) {
    const fuente = readFileSync(fileURLToPath(url), 'utf8');
    const salida = ts.transpileModule(fuente, {
      fileName: fileURLToPath(url),
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, isolatedModules: true },
    });
    return { format: 'module', shortCircuit: true, source: salida.outputText };
  }
  return siguiente(url, contexto);
}
