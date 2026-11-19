// Fotos reales del laboratorio «VIH y sífilis» (histología y clínica): Wikimedia Commons, CDC PHIL (dominio público) o
// artículos de acceso abierto. Solo CC0, dominio público, CC BY y CC BY-SA, con su autor, su licencia y su fuente; el
// crédito («Foto: autor · licencia · origen») sale siempre pegado a la foto en la lámina.
// `origen` es lo que se cita después de la licencia (por defecto, Wikimedia Commons).
// Recortadas y reducidas con la regla «foto» de scripts/imagenes/tamano.mjs (~500 px) por
// `scripts/vih-sifilis/preparar-fotos.mjs` (el plan de recortes está en `scripts/vih-sifilis/fotos-plan.mjs`), pasadas a AVIF
// por BUST (medgo-imgflow) y subidas con `scripts/vih-sifilis/subir-fotos.mjs`.
// Una foto cambiada es una versión nueva (`v2`): el bucket las sirve con caché de un año.

export type FotoId =
  | 'adenopatia' | 'kaposi-piel' | 'kaposi-corte' | 'pneumocystis-gms'
  | 'treponema-campo-oscuro' | 'treponema-plata'
  | 'infiltrado-plasmocitos' | 'goma-corte'
  | 'chancro'
  | 'palmas' | 'condiloma-plano' | 'placas-mucosas' | 'alopecia';

export type Licencia = 'CC0' | 'Dominio público' | 'CC BY 2.0' | 'CC BY 3.0' | 'CC BY 4.0' | 'CC BY-SA 2.0' | 'CC BY-SA 3.0' | 'CC BY-SA 4.0';

export type Foto = { version: string; autor: string; licencia: Licencia; fuente: string; origen?: string };

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/vih-sifilis/fotos/`;
const COMMONS = 'https://commons.wikimedia.org/wiki/File:';

export const FOTOS: Record<FotoId, Foto> = {
  // Capítulo 8 · VIH aguda
  adenopatia: { version: 'v1', autor: 'Smith y Carroll', licencia: 'CC BY 3.0', fuente: `${COMMONS}Histopathology_of_reactive_follicular_hyperplasia.jpg` },
  // Capítulo 11 · Oportunistas
  'kaposi-piel': { version: 'v1', autor: 'NCI', licencia: 'Dominio público', origen: 'NCI Visuals Online', fuente: `${COMMONS}Kaposi%27s_Sarcoma.jpg` },
  'kaposi-corte': { version: 'v1', autor: 'SB Lucas', licencia: 'CC0', origen: 'Wellcome Collection', fuente: `${COMMONS}Skin_Kaposi_s_sarcoma_Wellcome_W0047317.jpg` },
  'pneumocystis-gms': { version: 'v1', autor: 'Yale Rosen', licencia: 'CC BY-SA 2.0', fuente: `${COMMONS}Pneumocystis_jiroveci_infection_granulomatous_Case_110_(3833998970).jpg` },
  // Capítulo 15 · Treponema pallidum
  'treponema-campo-oscuro': { version: 'v1', autor: 'CDC/C. W. Hubbard', licencia: 'Dominio público', origen: 'CDC PHIL', fuente: `${COMMONS}Treponema_pallidum_cropped.png` },
  'treponema-plata': { version: 'v1', autor: 'CDC', licencia: 'Dominio público', origen: 'CDC PHIL', fuente: `${COMMONS}Treponema_pallidum_01.png` },
  // Capítulo 16 · Cómo daña los vasos
  'infiltrado-plasmocitos': { version: 'v1', autor: 'Cruz et al.', licencia: 'CC0', origen: 'PLoS Negl. Trop. Dis. 2012', fuente: `${COMMONS}Micrograph_of_secondary_syphilis.jpg` },
  'goma-corte': { version: 'v1', autor: 'Yale Rosen', licencia: 'CC BY-SA 2.0', fuente: `${COMMONS}Syphilitic_gumma_Case_278_(9727666764).jpg` },
  // Capítulo 17 · El chancro
  chancro: { version: 'v1', autor: 'Mima et al.', licencia: 'CC BY 4.0', origen: 'Cureus 2024', fuente: 'https://doi.org/10.7759/cureus.72017' },
  // Capítulo 18 · Estadios
  palmas: { version: 'v1', autor: 'Pipitò et al.', licencia: 'CC BY 4.0', origen: 'Cureus 2023', fuente: 'https://doi.org/10.7759/cureus.49181' },
  'condiloma-plano': { version: 'v1', autor: 'Maharani et al.', licencia: 'CC BY 4.0', origen: 'Case Rep. Med. 2025', fuente: 'https://doi.org/10.1155/carm/8595258' },
  'placas-mucosas': { version: 'v1', autor: 'Rohban et al.', licencia: 'CC BY 4.0', origen: 'Cureus 2026', fuente: 'https://doi.org/10.7759/cureus.103185' },
  alopecia: { version: 'v1', autor: 'Pipitò et al.', licencia: 'CC BY 4.0', origen: 'Cureus 2023', fuente: 'https://doi.org/10.7759/cureus.49181' },
};

export const urlFoto = (id: FotoId) => `${BASE}${id}_${FOTOS[id].version}.avif`;
