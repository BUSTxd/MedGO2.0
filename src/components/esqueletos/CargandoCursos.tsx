'use client';
import { usePathname } from 'next/navigation';
import { EsqueletoCursos, EsqueletoSilabo, EsqueletoClase } from './EsqueletoCursos';
import EsqueletoGenerico from './EsqueletoGenerico';

/** Lo que cuelga de `cursos/` sin ser un curso de Cayetano. */
const NO_SILABO = new Set(['cayetano', 'area', 'examen']);

/**
 * El `loading` de todo lo que cuelga de `cursos/`: elige la silueta por la
 * ruta (rejilla → sílabo → clase).
 *
 * En `/dashboard/cursos` va la rejilla de Cayetano aunque quien entra de fuera
 * vea exámenes y disciplinas: el cliente no sabe de qué cuenta es, y hasta el
 * corte de `esDeCayetano` todas eran de Cayetano.
 *
 * Lo reexportan `cursos/loading.tsx` **y el de cada curso**. El de cada curso
 * no es redundante: al ir del sílabo a una clase el tramo `cursos/<curso>` no
 * cambia, así que el `<Suspense>` de `cursos/loading.tsx` ya está pintado y
 * React, en vez de volver a enseñar su silueta, deja la página vieja quieta
 * hasta que llega la nueva — el clic parecía no hacer nada. Con un `loading`
 * en la carpeta del curso la frontera es nueva en cada salto sílabo ↔ clase.
 * Por lo mismo `area/` lleva el suyo (de una disciplina a otra).
 */
export default function CargandoCursos() {
  // /dashboard/cursos → 2 · /<curso> → 3 · /<curso>/<clase> → 4
  const tramos = usePathname().split('/').filter(Boolean);
  const nivel = tramos.length;
  if (nivel <= 2) return <EsqueletoCursos />;
  if (NO_SILABO.has(tramos[2])) return <EsqueletoGenerico />;
  if (nivel === 3) return <EsqueletoSilabo />;
  if (nivel === 4) return <EsqueletoClase />;
  return <EsqueletoGenerico />;
}
