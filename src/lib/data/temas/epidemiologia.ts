import type { TablaTemas } from './index';

// Sin clases a propósito, por ahora: el informe de fin de banqueo dice en qué
// tema y en qué tipo de pregunta (`subtema`) se falló, pero todavía no
// recomienda qué clase del sílabo repasar. Cuando se mapee, cada tema recibe
// sus `clases` como en `inmunologia.ts` y `verificar-temas.mjs` deja de
// tratar el curso como `sinClases`.
export const temasEpidemiologia: TablaTemas = {
  'sistema-salud':      { label: 'Sistema de salud',                           clases: [] },
  'ris':                { label: 'Redes Integradas de Salud (RIS)',            clases: [] },
  'categorias':         { label: 'Categorías de los establecimientos de salud', clases: [] },
  'upss':               { label: 'Unidades Productoras de Servicios (UPSS)',   clases: [] },
  'referencia':         { label: 'Referencia y contrarreferencia',             clases: [] },
  'cartera':            { label: 'Cartera de servicios',                       clases: [] },
  'modalidades-oferta': { label: 'Modalidades de oferta',                      clases: [] },
};
