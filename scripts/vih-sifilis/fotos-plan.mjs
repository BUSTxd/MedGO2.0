/**
 * Plan de las fotos del lab «VIH y sífilis»: de dónde sale cada una y cómo se recorta.
 * Lo lee `preparar-fotos.mjs`. El autor, la licencia y la fuente que se citan en pantalla NO van aquí: están en
 * `src/lib/data/vih-sifilis/fotos.ts` (una sola fuente de verdad); `verificar.mjs` comprueba que este plan y ese
 * archivo hablan de las mismas fotos.
 *
 * Origen:  `commons`  → nombre del archivo en Wikimedia Commons (`orig`: [ancho, alto] del original);
 *          `pmc` + `archivo` → figura de un artículo de acceso abierto de PubMed Central (bucket abierto de PMC).
 * Recorte (fracciones del original; todas las cajas se miran con `preparar-fotos.mjs --hoja`):
 *          `recorte: [x, y, w, h]`  caja exacta (para sacar un panel de una figura compuesta);
 *          `cuadrado: [cx, cy, escala]`  el mayor cuadrado centrado en (cx, cy) (para las lentes redondas);
 *          `marco: [cx, cy, escala]` + `w`/`h`  la proporción del marco rectangular de la lámina.
 * forma:   `lente` (zoom de verdad: se ve dentro de una lente redonda) o `cuadro` (una lesión, una pieza entera).
 * `cap`/`paso`: dónde sale en el lab (solo para los créditos).
 */

export const PLAN = [
  // ─── Capítulo 8 · VIH aguda ───
  { id: 'adenopatia', tema: 'Ganglio reactivo: hiperplasia folicular (H&E)', cap: 8, paso: 3, forma: 'lente', commons: 'Histopathology of reactive follicular hyperplasia.jpg', orig: [1512, 1196], cuadrado: [0.5, 0.5, 1] },
  // ─── Capítulo 11 · Oportunistas ───
  { id: 'kaposi-piel', tema: 'Sarcoma de Kaposi: manchas y nódulos violáceos en la piel (paciente con sida)', cap: 11, paso: 2, forma: 'lente', commons: "Kaposi's Sarcoma.jpg", orig: [2700, 1800], cuadrado: [0.5, 0.5, 1] },
  { id: 'kaposi-corte', tema: 'Sarcoma de Kaposi en la piel, a gran aumento: hendiduras vasculares entre el colágeno (H&E)', cap: 11, paso: 2, forma: 'lente', commons: 'Skin Kaposi s sarcoma Wellcome W0047317.jpg', orig: [5180, 3372], cuadrado: [0.5, 0.5, 1] },
  { id: 'pneumocystis-gms', tema: 'Pneumocystis jirovecii: quistes con plata metenamina (GMS)', cap: 11, paso: 3, forma: 'lente', commons: 'Pneumocystis jiroveci infection granulomatous Case 110 (3833998970).jpg', orig: [1002, 666], cuadrado: [0.45, 0.5, 1] },
  // ─── Capítulo 15 · Treponema pallidum ───
  { id: 'treponema-campo-oscuro', tema: 'T. pallidum en campo oscuro', cap: 15, paso: 0, forma: 'lente', commons: 'Treponema pallidum cropped.png', orig: [1000, 750], cuadrado: [0.5, 0.5, 1] },
  { id: 'treponema-plata', tema: 'T. pallidum con tinción de plata', cap: 15, paso: 0, forma: 'lente', commons: 'Treponema pallidum 01.png', orig: [734, 497], cuadrado: [0.5, 0.5, 1] },
  // ─── Capítulo 16 · Cómo daña los vasos ───
  { id: 'infiltrado-plasmocitos', tema: 'Infiltrado con células plasmáticas (H&E)', cap: 16, paso: 3, forma: 'lente', commons: 'Micrograph of secondary syphilis.jpg', orig: [986, 716], recorte: [0.56, 0.0, 0.36, 0.5] },
  { id: 'goma-corte', tema: 'Goma sifilítica (H&E)', cap: 16, paso: 6, forma: 'lente', commons: 'Syphilitic gumma Case 278 (9727666764).jpg', orig: [2560, 1920], cuadrado: [0.5, 0.5, 1] },
  // ─── Capítulo 17 · El chancro ───
  { id: 'chancro', tema: 'Chancro: úlcera única, redonda, de borde nítido y fondo limpio', cap: 17, paso: 2, forma: 'cuadro', w: 400, h: 300, pmc: 'PMC11578620', archivo: 'cureus-0016-00000072017-i03.jpg', recorte: [0.26, 0.288, 0.507, 0.506] },
  // ─── Capítulo 18 · Estadios ───
  { id: 'palmas', tema: 'Exantema papuloso de las palmas', cap: 18, paso: 1, forma: 'cuadro', w: 320, h: 240, pmc: 'PMC10734655', archivo: 'cureus-0015-00000049181-i02.jpg', recorte: [0, 0, 1, 1] },
  { id: 'condiloma-plano', tema: 'Condilomas lata perianales', cap: 18, paso: 2, forma: 'cuadro', w: 320, h: 240, pmc: 'PMC12490915', archivo: 'CRIM2025-8595258.001.jpg', recorte: [0.225, 0.757, 0.565, 0.215] },
  { id: 'placas-mucosas', tema: 'Placas mucosas en la lengua', cap: 18, paso: 3, forma: 'cuadro', w: 300, h: 200, pmc: 'PMC12972797', archivo: 'cureus-0018-00000103185-i01.jpg', recorte: [0.047, 0.015, 0.285, 0.25] },
  { id: 'alopecia', tema: 'Alopecia sifilítica en parches («apolillada»)', cap: 18, paso: 4, forma: 'cuadro', w: 270, h: 366, pmc: 'PMC10734655', archivo: 'cureus-0015-00000049181-i01.jpg', recorte: [0.045, 0.04, 0.445, 0.575] },
];
