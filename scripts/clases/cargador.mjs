// Hook de módulos para `vista.mjs`, encima del de las láminas (`../gramnegativas/cargador-tsx.mjs`,
// que transpila el TSX y resuelve `@/`): da un hueco para lo que solo existe dentro de Next.
// Las vistas puras no lo usan al pintarse; solo hace falta que se puedan importar.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// Un módulo `data:` no resuelve nombres sueltos: React va por su ruta.
const REACT = pathToFileURL(createRequire(import.meta.url).resolve('react')).href;

const HUECOS = {
  'next/navigation': 'export const useRouter = () => ({ push() {} }); export const useParams = () => ({}); export const useSearchParams = () => new URLSearchParams(); export const usePathname = () => "/";',
  'next/link': `import React from "${REACT}"; export default function Link({ href, children, ...r }) { return React.createElement("a", { href, ...r }, children); }`,
  'server-only': 'export {};',
};

export async function resolve(especificador, contexto, siguiente) {
  if (Object.hasOwn(HUECOS, especificador)) {
    return { url: `data:text/javascript,${encodeURIComponent(HUECOS[especificador])}`, shortCircuit: true };
  }
  return siguiente(especificador, contexto);
}
