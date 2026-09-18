import type { ClaseRecomendada, TablaTemas } from './index';

// Literal autónomo a propósito (ver `inmunologia.ts`): `verificar-temas.mjs`
// lo compara contra el sílabo. Las tres teorías con resumen son `premium` en el
// sílabo, así que aquí van sin `gratis`: el carrusel las pinta con candado.
const C = {
  t2: { claseId: 'epi-t-2', codigo: 'T2', titulo: 'Sistema Nacional de Salud y Redes Integradas de Salud', conResumen: true },
  t3: { claseId: 'epi-t-3', codigo: 'T3', titulo: 'Niveles de atención de salud',                          conResumen: true },
  t4: { claseId: 'epi-t-4', codigo: 'T4', titulo: 'Cartera de servicios de salud y prioridades globales',   conResumen: true },
} satisfies Record<string, ClaseRecomendada>;

export const temasEpidemiologia: TablaTemas = {
  'sistema-salud':      { label: 'Sistema de salud',                           clases: [C.t2] },
  'ris':                { label: 'Redes Integradas de Salud (RIS)',            clases: [C.t2] },
  'categorias':         { label: 'Categorías de los establecimientos de salud', clases: [C.t3] },
  'upss':               { label: 'Unidades Productoras de Servicios (UPSS)',   clases: [C.t3] },
  'referencia':         { label: 'Referencia y contrarreferencia',             clases: [C.t3] },
  'cartera':            { label: 'Cartera de servicios',                       clases: [C.t4] },
  'modalidades-oferta': { label: 'Modalidades de oferta',                      clases: [C.t4] },
};
