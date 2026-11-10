// Fotos de histología del laboratorio de Vasculitis: Wikimedia Commons o artículos de acceso abierto, solo CC BY y CC BY-SA.
// `origen` es la publicación que se cita en el crédito (por defecto, Wikimedia Commons).
// Recortadas, reducidas con la regla «foto» de scripts/imagenes/tamano.mjs (~500 px) y pasadas a AVIF por la web
// medgo-imgflow; se suben con `scripts/vasculitis/subir-fotos.mjs`.
// Una foto cambiada es una versión nueva (`_v2`): el bucket las sirve con caché de un año.

export type FotoId = 'leucocitoclastica' | 'gpa-pulmon' | 'gpa-granuloma' | 'gepa-vaso' | 'gepa-eosinofilos' | 'semiluna-pas' | 'c-anca' | 'p-anca' | 'hemosiderofagos' | 'pan-fibrinoide' | 'if-igg' | 'pulmon-goodpasture' | 'anca-gn-fibrinoide' | 'if-granular';

export type Foto = { version: string; autor: string; licencia: 'CC BY 2.0' | 'CC BY 4.0' | 'CC BY-SA 2.0' | 'CC BY-SA 3.0' | 'CC BY-SA 4.0'; fuente: string; origen?: string };

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/vasculitis/fotos/`;
const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

export const FOTOS: Record<FotoId, Foto> = {
  leucocitoclastica: { version: 'v2', autor: 'Ed Uthman', licencia: 'CC BY 2.0', fuente: `${COMMONS}Leukocytoclastic_Vasculitis,_H%26E_(13895924000).jpg` },
  'gpa-pulmon': { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Wegener%27s_granulomatosis_-_intermed_mag.jpg` },
  'gpa-granuloma': { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Wegener%27s_granulomatosis_-b-_high_mag.jpg` },
  'gepa-vaso': { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Churg-Strauss_syndrome_-_high_mag.jpg` },
  'gepa-eosinofilos': { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Churg-Strauss_syndrome_-_very_high_mag.jpg` },
  'semiluna-pas': { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Crescentic_glomerulonephritis_-_high_mag.jpg` },
  'c-anca': { version: 'v3', autor: 'Simon Caulton', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}C_ANCA.jpg` },
  'p-anca': { version: 'v3', autor: 'Simon Caulton', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}P_ANCA.jpg` },
  hemosiderofagos: { version: 'v2', autor: 'Nephron', licencia: 'CC BY-SA 3.0', fuente: `${COMMONS}Pulmonary_haemorrhage_-_very_high_mag.jpg` },
  'pan-fibrinoide': { version: 'v1', autor: 'Berardi et al.', licencia: 'CC BY 4.0', fuente: `${COMMONS}Cutaneous_polyarteritis_nodosa_histopathology.jpg` },
  'if-igg': { version: 'v1', autor: 'Adel.stoyanova', licencia: 'CC BY-SA 4.0', fuente: `${COMMONS}Immunofluorescence_staining_for_IgG_along_glomerular_capillary_loops.png` },
  'pulmon-goodpasture': { version: 'v1', autor: 'Yale Rosen', licencia: 'CC BY-SA 2.0', fuente: `${COMMONS}Goodpasture_syndrome_(4857742833).jpg` },
  'anca-gn-fibrinoide': { version: 'v1', autor: 'Xue et al.', licencia: 'CC BY 4.0', fuente: `${COMMONS}Fibrinoid_necrosis.jpg` },
  'if-granular': { version: 'v1', autor: 'Zhu et al.', licencia: 'CC BY 4.0', origen: 'Front. Immunol. 2026', fuente: 'https://doi.org/10.3389/fimmu.2026.1808435' },
};

export const urlFoto = (id: FotoId) => `${BASE}${id}_${FOTOS[id].version}.avif`;
