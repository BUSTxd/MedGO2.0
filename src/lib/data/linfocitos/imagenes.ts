// GENERADO por scripts/linfocitos/subir-imagenes.mjs — no editar a mano.
// Ilustraciones de Servier Medical Art (smart.servier.com), CC BY-SA 3.0, vía
// Wikimedia Commons: recortadas con preparar-imagenes.mjs, optimizadas a AVIF
// por BUST y servidas desde el bucket público `laboratorio-img/linfocitos/`
// (caché de un año: un dibujo nuevo va con otro nombre). Medidas en px.

export const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/linfocitos`;
export const EXT = 'avif';

export const IMAGENES: Record<string, { w: number; h: number }> = {
  anticuerpo_2: { w: 72, h: 115 }, // Immunology and haematology - Antibody 3 -- Smart-Servier
  ganglio: { w: 420, h: 345 }, // Lymphatic system - Lymph node 2 -- Smart-Servier
  hsc: { w: 333, h: 333 }, // Cardiovascular system - Lymphopoiesis - Hematopoietic stem cell -- Smart-Servier
  linfocito_1: { w: 391, h: 363 }, // Cardiovascular system - Lymphocyte 1 -- Smart-Servier
  linfocito_2: { w: 404, h: 389 }, // Cardiovascular system - Lymphocyte 2 -- Smart-Servier
  mieloide: { w: 292, h: 280 }, // Cardiovascular system - Myelopoiesis - Myeloid stem cell -- Smart-Servier
  nk: { w: 253, h: 266 }, // Cardiovascular system - Lymphopoiesis - NK cell -- Smart-Servier
  pluripotente: { w: 327, h: 330 }, // Cardiovascular system - Lymphopoiesis - Pluripotent stem cell -- Smart-Servier
  progenitor_linfoide: { w: 282, h: 272 }, // Cardiovascular system - Lymphopoiesis - Lymphoid stem cell -- Smart-Servier
  timo: { w: 193, h: 295 }, // Glands - Thymus -- Smart-Servier
};

export const srcImagen = (id: string) => (IMAGENES[id] ? `${BASE}/${id}.${EXT}` : null);
