// Registro del laboratorio «Hipersensibilidad»: los ocho capítulos en orden
// (cuatro del tipo I, uno por cada tipo restante y la integración) y la intro.
//
// Solo en el servidor: `page.tsx` decide con el plan qué capítulos manda
// (`contenidoDelLab`). Si un componente de cliente importara esto, los datos de
// pago irían en el JS que se baja cualquiera.

import 'server-only';
import sensibilizacion from '@/lib/data/hipersensibilidad/sensibilizacion';
import faseInmediata from '@/lib/data/hipersensibilidad/fase-inmediata';
import faseTardia from '@/lib/data/hipersensibilidad/fase-tardia';
import anafilaxia from '@/lib/data/hipersensibilidad/anafilaxia';
import tipo2 from '@/lib/data/hipersensibilidad/tipo-2';
import tipo3 from '@/lib/data/hipersensibilidad/tipo-3';
import tipo4 from '@/lib/data/hipersensibilidad/tipo-4';
import integracion from '@/lib/data/hipersensibilidad/integracion';
import intro from '@/lib/data/hipersensibilidad/intro';
import FICHAS from '@/lib/data/hipersensibilidad/fichas';
import { VISTAZO } from '@/lib/data/hipersensibilidad/vistazo';
import type { Escenario, Ficha, Parte } from '@/lib/data/hipersensibilidad/tipos';
import type { Contenido, ResumenParte } from './contenido';

const PARTES: Parte[] = [sensibilizacion, faseInmediata, faseTardia, anafilaxia, tipo2, tipo3, tipo4, integracion];

const resumir = (p: Parte): ResumenParte => ({
  id: p.id, numero: p.numero, nombre: p.nombre, nombreCorto: p.nombreCorto, tipo: p.tipo,
  lugar: p.lugar, color: p.color, pregunta: p.pregunta, nPasos: p.pasos.length, gratis: VISTAZO.includes(p.id),
});

export function contenidoDelLab(completo: boolean): Contenido {
  const partes = PARTES.filter((p) => completo || VISTAZO.includes(p.id));
  const fichas: Record<string, Ficha> = {};
  for (const esc of [intro as Escenario, ...partes]) {
    for (const [k, d] of Object.entries(esc.actores)) {
      const id = d.info ?? k;
      if (FICHAS[id]) fichas[id] = FICHAS[id];
    }
  }
  return { completo, intro, indice: PARTES.map(resumir), partes, fichas };
}
