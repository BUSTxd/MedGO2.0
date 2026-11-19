// Registro del laboratorio «VIH y sífilis».
//
// Solo en el servidor: `page.tsx` decide con el plan qué capítulos manda. Si un componente
// de cliente importara esto, los datos de pago y las URLs de su voz irían en el JS que se
// baja cualquiera.

import 'server-only';
import { CAPITULOS } from '@/lib/data/vih-sifilis/capitulos';
import { INDICE } from '@/lib/data/vih-sifilis/indice';
import { NARRACION } from '@/lib/data/vih-sifilis/narracion';
import { TABLAS } from '@/lib/data/vih-sifilis/tablas';
import { GRUPOS } from '@/lib/data/vih-sifilis/tablas-indice';
import { VISTAZO } from '@/lib/data/vih-sifilis/vistazo';
import type { Contenido, ResumenParte } from './contenido';

export function contenidoDelLab(completo: boolean): Contenido {
  const partes = CAPITULOS.filter((p) => completo || VISTAZO.includes(p.id));
  const indice: ResumenParte[] = INDICE.map((m) => ({
    ...m,
    nPasos: CAPITULOS[m.numero]?.pasos.length ?? 0,
    segundos: Math.round(NARRACION[m.numero]?.duracion ?? 0),
    gratis: VISTAZO.includes(m.id),
  }));
  // Las tablas condensan toda la clase: sin el plan solo sale la pestaña gratis (la del vistazo).
  const tablas = GRUPOS.map((g) => ({ ...g, ...(completo || g.gratis ? { tablas: TABLAS[g.id] } : {}) }));
  return { completo, indice, partes, tablas };
}
