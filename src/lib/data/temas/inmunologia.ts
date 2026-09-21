import type { ClaseRecomendada, TablaTemas } from './index';

// Literal autónomo a propósito: `ExamRunner` y el panel del home son componentes
// cliente, y importar el sílabo (o `silabos.ts`, que trae los 17) mandaría
// cientos de KB al navegador. `scripts/verificar-temas.mjs` compara estas
// entradas contra el sílabo real para que no se desincronicen.
const C = {
  t1:   { claseId: 't-1',   codigo: 'T1',    titulo: 'Generalidades del sistema inmune',                          conResumen: true },
  t2:   { claseId: 't-2',   codigo: 'T2',    titulo: 'Células del sistema inmune y lámina periférica',            conResumen: true, gratis: true },
  t3:   { claseId: 't-3',   codigo: 'T3',    titulo: 'Órganos linfoides primarios',                               conResumen: true },
  t4:   { claseId: 't-4',   codigo: 'T4',    titulo: 'Desarrollo de las células del sistema inmune',              conResumen: true },
  t5:   { claseId: 't-5',   codigo: 'T5',    titulo: 'Respuestas innatas moleculares',                            conResumen: true, gratis: true },
  t6:   { claseId: 't-6',   codigo: 'T6',    titulo: 'Respuestas innatas celulares',                              conResumen: true },
  t7:   { claseId: 't-7',   codigo: 'T7',    titulo: 'El sistema innato transfiere información al adaptativo',    conResumen: true },
  t8:   { claseId: 't-8',   codigo: 'T8',    titulo: 'Desarrollo, selección y activación de linfocitos T',        conResumen: true },
  t9:   { claseId: 't-9',   codigo: 'T9',    titulo: 'Respuesta humoral y linfocitos B',                          conResumen: true, gratis: true },
  t10:  { claseId: 't-10',  codigo: 'T10',   titulo: 'Órganos linfoides secundarios',                             conResumen: true },
  t11:  { claseId: 't-11',  codigo: 'T11',   titulo: 'Diferenciación de linfocitos T',                             conResumen: true },
  t12:  { claseId: 't-12',  codigo: 'T12',   titulo: 'Regulación de la respuesta inmune',                          conResumen: true },
  t13:  { claseId: 't-13',  codigo: 'T13',   titulo: 'Citometría de flujo (teoría)',                               conResumen: true },
  t14:  { claseId: 't-14',  codigo: 'T14',   titulo: 'Fallas del sistema inmune: inmunidad y cáncer',              conResumen: true },
  h1:   { claseId: 'h-1',   codigo: 'H1',    titulo: 'Timo y tejido linfoide asociado a mucosas',                  conResumen: true, gratis: true },
  h2:   { claseId: 'h-2',   codigo: 'H2',    titulo: 'Bazo y ganglios linfáticos',                                 conResumen: true },
  l1:   { claseId: 'l-1',   codigo: 'L1',    titulo: 'Inmunohematología aplicada',                                 conResumen: false },
  l2:   { claseId: 'l-2',   codigo: 'L2',    titulo: 'Citometría de flujo (FlowJo)',                               conResumen: false },
  sgp1: { claseId: 'sgp-1', codigo: 'SGP-1', titulo: 'Inflamación',                                                conResumen: true },
  sgp2: { claseId: 'sgp-2', codigo: 'SGP-2', titulo: 'Infección por micobacterias: tuberculosis latente',          conResumen: true },
  sgp3: { claseId: 'sgp-3', codigo: 'SGP-3', titulo: 'Autoinmunidad: artritis reumatoide y autoanticuerpos',       conResumen: true, gratis: true },
  sgp4: { claseId: 'sgp-4', codigo: 'SGP-4', titulo: 'Inmunidad y cáncer: melanoma y evasión inmune',              conResumen: true },
  tbl1: { claseId: 'tbl-1', codigo: 'TBL-1', titulo: 'Hemograma y reactantes de fase aguda',                       conResumen: true },
  tbl2: { claseId: 'tbl-2', codigo: 'TBL-2', titulo: 'Infecciones virales: VIH',                                   conResumen: true },
  tbl3: { claseId: 'tbl-3', codigo: 'TBL-3', titulo: 'Vacunas',                                                    conResumen: true, gratis: true },
} satisfies Record<string, ClaseRecomendada>;

export const temasInmunologia: TablaTemas = {
  'generalidades':       { label: 'Generalidades del sistema inmune',        clases: [C.t1] },
  'barreras':            { label: 'Barreras naturales',                      clases: [C.t1, C.t6] },
  'celulas-inmunes':     { label: 'Células del sistema inmune',              clases: [C.t2, C.t4] },
  'organos-primarios':   { label: 'Órganos linfoides primarios',             clases: [C.t3, C.h1] },
  'organos-secundarios': { label: 'Órganos linfoides secundarios',           clases: [C.t10, C.h2] },
  'mucosas':             { label: 'Inmunidad de mucosas y MALT',             clases: [C.h1, C.t10] },
  'innata-celular':      { label: 'Respuestas innatas celulares',            clases: [C.t6, C.t2] },
  'complemento':         { label: 'Sistema del complemento',                 clases: [C.t5] },
  'citocinas':           { label: 'Citocinas y quimiocinas',                 clases: [C.t5, C.t11] },
  'inflamacion':         { label: 'Inflamación',                             clases: [C.sgp1, C.t5] },
  'trafico':             { label: 'Tráfico y recirculación celular',         clases: [C.sgp1, C.t10] },
  'hemograma-rfa':       { label: 'Hemograma y reactantes de fase aguda',    clases: [C.tbl1, C.sgp1] },
  'hematologia':         { label: 'Serie roja y hemostasia',                 clases: [C.tbl1, C.l1] },
  'presentacion-mhc':    { label: 'MHC y presentación antigénica',           clases: [C.t7] },
  'coestimulacion':      { label: 'Coestimulación y activación T',           clases: [C.t7, C.t8] },
  'linfocitos-t':        { label: 'Desarrollo y selección de linfocitos T',  clases: [C.t8, C.t3] },
  'diferenciacion-t':    { label: 'Diferenciación y subtipos de linfocitos T', clases: [C.t11] },
  'linfocitos-b':        { label: 'Linfocitos B y respuesta humoral',        clases: [C.t9] },
  'anticuerpos':         { label: 'Anticuerpos e isotipos',                  clases: [C.t9] },
  'tolerancia':          { label: 'Tolerancia inmunológica',                 clases: [C.t12, C.t8] },
  'regulacion':          { label: 'Regulación de la respuesta inmune',       clases: [C.t12, C.t14] },
  'autoinmunidad':       { label: 'Autoinmunidad',                           clases: [C.sgp3, C.t12] },
  'vih':                 { label: 'VIH e inmunidad antiviral',               clases: [C.tbl2, C.t6] },
  'vacunas':             { label: 'Vacunas',                                 clases: [C.tbl3] },
  'tumoral':             { label: 'Inmunidad tumoral e inmunoterapia',       clases: [C.t14, C.sgp4] },

  // Sin clase propia en el sílabo: van a la más cercana. Cambiar este mapeo no
  // exige volver a subir ningún JSON, que es la razón de la indirección.
  'hipersensibilidad':   { label: 'Hipersensibilidad',                       clases: [C.sgp3, C.t12] },
  'inmunodeficiencias':  { label: 'Inmunodeficiencias',                      clases: [C.t14, C.t8] },
  'tecnicas':            { label: 'Técnicas inmunológicas',                  clases: [C.t13, C.l2, C.l1] },
};
