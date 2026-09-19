import type { ClaseRecomendada, TablaTemas } from './index';

// Literal autónomo a propósito (ver `inmunologia.ts`): `verificar-temas.mjs`
// lo compara contra el sílabo. Las tres teorías con resumen son `premium` en el
// sílabo, así que aquí van sin `gratis`: el carrusel las pinta con candado.
const C = {
  t2: { claseId: 'epi-t-2', codigo: 'T2', titulo: 'Sistema Nacional de Salud y Redes Integradas de Salud', conResumen: true },
  t3: { claseId: 'epi-t-3', codigo: 'T3', titulo: 'Niveles de atención de salud',                          conResumen: true },
  t4: { claseId: 'epi-t-4', codigo: 'T4', titulo: 'Cartera de servicios de salud y prioridades globales',   conResumen: true },
} satisfies Record<string, ClaseRecomendada>;

// `seccion`: comienzo del título (h1-h4) del resumen donde se trata el tema.
// Si se reescribe un resumen y cambia ese título, el visor abre arriba sin más.
export const temasEpidemiologia: TablaTemas = {
  'sistema-salud':      { label: 'Sistema de salud',                           clases: [{ ...C.t2, seccion: 'Conceptos impor' }] },
  'ris':                { label: 'Redes Integradas de Salud (RIS)',            clases: [{ ...C.t2, seccion: 'Red Integrada de Salud' }] },
  'categorias':         { label: 'Categorías de los establecimientos de salud', clases: [{ ...C.t3, seccion: 'I. Categoría de los establecimientos' }] },
  'upss':               { label: 'Unidades Productoras de Servicios (UPSS)',   clases: [{ ...C.t3, seccion: 'Unidad productora de servicios' }] },
  'referencia':         { label: 'Referencia y contrarreferencia',             clases: [{ ...C.t3, seccion: 'III. Proceso de Referencia' }] },
  'cartera':            { label: 'Cartera de servicios',                       clases: [{ ...C.t4, seccion: 'I. Cartera de servicios' }] },
  'modalidades-oferta': { label: 'Modalidades de oferta',                      clases: [{ ...C.t4, seccion: 'II. Modalidades de oferta' }] },
};
