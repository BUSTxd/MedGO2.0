// Registro del laboratorio «Vasculitis de vasos medianos y pequeños y ANCA».
//
// Solo en el servidor: `page.tsx` decide con el plan qué capítulos manda. Si un
// componente de cliente importara esto, los datos de pago y las URLs de su voz irían
// en el JS que se baja cualquiera.

import 'server-only';
import { CAPITULOS } from '@/lib/data/vasculitis/capitulos';
import { INDICE } from '@/lib/data/vasculitis/indice';
import { NARRACION } from '@/lib/data/vasculitis/narracion';
import { VISTAZO } from '@/lib/data/vasculitis/vistazo';
import type { Contenido, ResumenParte } from './contenido';

export function contenidoDelLab(completo: boolean): Contenido {
  const partes = CAPITULOS.filter((p) => completo || VISTAZO.includes(p.id));
  const indice: ResumenParte[] = INDICE.map((m) => ({
    ...m,
    nPasos: CAPITULOS[m.numero]?.pasos.length ?? 0,
    segundos: Math.round(NARRACION[m.numero]?.duracion ?? 0),
    gratis: VISTAZO.includes(m.id),
  }));
  return { completo, indice, partes };
}
