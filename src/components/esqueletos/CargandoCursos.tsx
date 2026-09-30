'use client';
import { usePathname } from 'next/navigation';
import { EsqueletoCursos, EsqueletoSilabo, EsqueletoClase } from './EsqueletoCursos';
import EsqueletoGenerico from './EsqueletoGenerico';

/**
 * El `loading` de todo lo que cuelga de `cursos/`: elige la silueta por la
 * profundidad de la ruta (rejilla → sílabo → clase).
 *
 * Lo reexportan `cursos/loading.tsx` **y el de cada curso**. El de cada curso
 * no es redundante: al ir del sílabo a una clase el tramo `cursos/<curso>` no
 * cambia, así que el `<Suspense>` de `cursos/loading.tsx` ya está pintado y
 * React, en vez de volver a enseñar su silueta, deja la página vieja quieta
 * hasta que llega la nueva — el clic parecía no hacer nada. Con un `loading`
 * en la carpeta del curso la frontera es nueva en cada salto sílabo ↔ clase.
 */
export default function CargandoCursos() {
  // /dashboard/cursos → 2 · /<curso> → 3 · /<curso>/<clase> → 4
  const nivel = usePathname().split('/').filter(Boolean).length;
  if (nivel <= 2) return <EsqueletoCursos />;
  if (nivel === 3) return <EsqueletoSilabo />;
  if (nivel === 4) return <EsqueletoClase />;
  return <EsqueletoGenerico />;
}
