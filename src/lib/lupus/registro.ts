// Registro del laboratorio «Lupus»: los capítulos ya animados, en orden.
//
// Solo en el servidor: `page.tsx` decide con el plan qué capítulos manda
// (`contenidoDelLab`). Si un componente de cliente importara esto, los datos de
// pago (y las URLs de su voz) irían en el JS que se baja cualquiera.

import 'server-only';
import queEs from '@/lib/data/lupus/que-es';
import causas from '@/lib/data/lupus/causas';
import basura from '@/lib/data/lupus/basura';
import interferon from '@/lib/data/lupus/interferon';
import linfocitos from '@/lib/data/lupus/linfocitos';
import tipo3 from '@/lib/data/lupus/tipo-3';
import tipo2 from '@/lib/data/lupus/tipo-2';
import piel from '@/lib/data/lupus/piel';
import corazon from '@/lib/data/lupus/corazon';
import nefritis from '@/lib/data/lupus/nefritis';
import diagnostico from '@/lib/data/lupus/diagnostico';
import tratamiento from '@/lib/data/lupus/tratamiento';
import FICHAS from '@/lib/data/lupus/fichas';
import { INDICE } from '@/lib/data/lupus/indice';
import { NARRACION } from '@/lib/data/lupus/narracion';
import { VISTAZO } from '@/lib/data/lupus/vistazo';
import type { Ficha, Parte } from '@/lib/data/lupus/tipos';
import type { Contenido, ResumenParte } from './contenido';

/** Capítulos animados. Uno nuevo se añade aquí y sale solo en portada y selector. */
const PARTES: Parte[] = [queEs, causas, basura, interferon, linfocitos, tipo3, tipo2, piel, corazon, nefritis, diagnostico, tratamiento];

export function contenidoDelLab(completo: boolean): Contenido {
  const partes = PARTES.filter((p) => completo || VISTAZO.includes(p.id));
  const fichas: Record<string, Ficha> = {};
  for (const esc of partes) {
    for (const [k, d] of Object.entries(esc.actores)) {
      const id = d.info ?? k;
      if (FICHAS[id]) fichas[id] = FICHAS[id];
    }
  }
  const indice: ResumenParte[] = INDICE.map((m) => {
    const p = PARTES.find((x) => x.id === m.id);
    return {
      ...m,
      nPasos: p?.pasos.length ?? 0,
      segundos: Math.round(NARRACION[m.numero]?.duracion ?? 0),
      gratis: VISTAZO.includes(m.id),
      listo: !!p,
    };
  });
  return { completo, indice, partes, fichas };
}
