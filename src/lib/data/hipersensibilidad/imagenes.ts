// GENERADO por scripts/hipersensibilidad/subir-imagenes.mjs — no editar a mano.
// Recortes de las figuras 6-13 a 6-20 de Robbins (Patología humana, cap. 6),
// optimizados a AVIF por BUST y servidos desde el bucket público
// `laboratorio-img/hipersensibilidad/` (caché de un año: un recorte nuevo va
// con otro nombre). Medidas en px.

export const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/hipersensibilidad`;
export const EXT = 'avif';

export const IMAGENES: Record<string, { w: number; h: number }> = {
  alergeno: { w: 57, h: 55 }, // Grano de polen (alérgeno) — Robbins, fig. 6-14
  apc: { w: 163, h: 152 }, // Célula presentadora con antígeno de tejido — Robbins, fig. 6-18A
  celula_opsonizada: { w: 123, h: 112 }, // Célula opsonizada (C3b en la membrana) — Robbins, fig. 6-16A
  dendritica: { w: 160, h: 147 }, // Célula dendrítica con el alérgeno — Robbins, fig. 6-14
  fagocito: { w: 149, h: 149 }, // Fagocito con receptores Fc y de C3b — Robbins, fig. 6-16A
  fagocito_engullendo: { w: 151, h: 160 }, // Fagocito engullendo la célula — Robbins, fig. 6-16A
  lamina_dth: { w: 375, h: 524 }, // Hipersensibilidad retardada: manguito perivascular — Robbins, fig. 6-19A
  lamina_dth_cd4: { w: 333, h: 524 }, // Hipersensibilidad retardada: inmunoperoxidasa anti-CD4 — Robbins, fig. 6-19B
  lamina_granuloma: { w: 593, h: 387 }, // Inflamación granulomatosa en un ganglio — Robbins, fig. 6-20
  lamina_inmediata: { w: 329, h: 195 }, // Fase inmediata: mastocitos, edema y congestión — Robbins, fig. 6-13B
  lamina_tardia: { w: 327, h: 248 }, // Fase tardía: infiltrado rico en eosinófilos — Robbins, fig. 6-13C
  linfocito_b: { w: 157, h: 160 }, // Linfocito B con su BCR — Robbins, fig. 6-14
  macrofago: { w: 119, h: 116 }, // Macrófago — Robbins, fig. 6-18A
  mastocito: { w: 113, h: 114 }, // Mastocito (cuerpo, sin receptores) — Robbins, fig. 6-14
  mastocito_activo: { w: 123, h: 115 }, // Mastocito desgranulando (cuerpo) — Robbins, fig. 6-14
  neutrofilo: { w: 118, h: 113 }, // Neutrófilo — Robbins, fig. 6-18A
  plasmocito_ige: { w: 134, h: 107 }, // Célula plasmática secretora de IgE — Robbins, fig. 6-14
  t_cd4: { w: 130, h: 141 }, // Linfocito T CD4+ — Robbins, fig. 6-18A
  t_cd8: { w: 129, h: 146 }, // Linfocito T CD8+ citotóxico — Robbins, fig. 6-18B
  t_naive: { w: 117, h: 127 }, // Linfocito T CD4 naive — Robbins, fig. 6-14
  tejido_danado: { w: 202, h: 94 }, // Epitelio dañado — Robbins, fig. 6-18A
  tejido_sano: { w: 198, h: 89 }, // Epitelio sano — Robbins, fig. 6-18A
  terminal_nerviosa: { w: 304, h: 151 }, // Terminal nerviosa motora con vesículas de ACh — Robbins, fig. 6-16C
  th2: { w: 127, h: 132 }, // Linfocito Th2 — Robbins, fig. 6-14
  tirocito: { w: 113, h: 113 }, // Célula epitelial tiroidea — Robbins, fig. 6-16C
};

export const srcPropia = (id: string) => (IMAGENES[id] ? `${BASE}/${id}.${EXT}` : null);
