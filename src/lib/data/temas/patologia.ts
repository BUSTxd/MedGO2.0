import type { ClaseRecomendada, TablaTemas } from './index';

// Literal autónomo a propósito (ver `temas/inmunologia.ts`): el runner es
// cliente y el sílabo pesaría cientos de KB. `scripts/verificar-temas.mjs`
// compara estas entradas contra `src/lib/data/patologia.ts`.
//
// Solo la Unidad 2 (Parcial 2): el Parcial 1 aún no lleva `tema`. Las clases
// sin resumen propio abren el de la clase que cubre sus temas (C5 → TBL4,
// C6 → ACP8, AI9 → AI8, AI14 → ACP7), así que todas van con `conResumen`.
// Ninguna es `gratis`: los resúmenes de la unidad son de pago aunque el curso
// esté abierto, y así el carrusel del informe los pinta con candado.
const C = {
  ai8:  { claseId: 'pat-ai-8',  codigo: 'AI8',   titulo: 'Bases genéticas de la enfermedad',                       conResumen: true },
  ai9:  { claseId: 'pat-ai-9',  codigo: 'AI9',   titulo: 'Patrones de herencia y expresión de enfermedades genéticas', conResumen: true },
  acp5: { claseId: 'pat-acp-5', codigo: 'ACP5',  titulo: 'Predisposición genética al cáncer',                      conResumen: true },
  ai10: { claseId: 'pat-ai-10', codigo: 'AI10',  titulo: 'Introducción a las neoplasias',                          conResumen: true },
  ai11: { claseId: 'pat-ai-11', codigo: 'AI11',  titulo: 'Carcinogénesis y transformación tumoral',                conResumen: true },
  acp6: { claseId: 'pat-acp-6', codigo: 'ACP6',  titulo: 'VPH: de la infección a la neoplasia maligna',            conResumen: true },
  lab6: { claseId: 'pat-lab-6', codigo: 'Lab 6', titulo: 'Neoplasias benignas',                                    conResumen: true },
  lab7: { claseId: 'pat-lab-7', codigo: 'Lab 7', titulo: 'Neoplasias malignas',                                    conResumen: false },
  ai12: { claseId: 'pat-ai-12', codigo: 'AI12',  titulo: 'Características distintivas del cáncer',                 conResumen: true },
  ai13: { claseId: 'pat-ai-13', codigo: 'AI13',  titulo: 'Manifestaciones clínicas y evaluación de neoplasias',    conResumen: true },
  tbl3: { claseId: 'pat-tbl-3', codigo: 'TBL3',  titulo: 'Cáncer de mama',                                         conResumen: true },
  acp7: { claseId: 'pat-acp-7', codigo: 'ACP7',  titulo: 'Inflamación, inmunidad y cáncer: cáncer gástrico y de pulmón', conResumen: true },
  c5:   { claseId: 'pat-c-5',   codigo: 'C5',    titulo: 'Leucemias: conceptos y clasificación',                   conResumen: true },
  ai14: { claseId: 'pat-ai-14', codigo: 'AI14',  titulo: 'Inmunidad y cáncer: vigilancia, escape e inmunoterapia', conResumen: true },
  c6:   { claseId: 'pat-c-6',   codigo: 'C6',    titulo: 'Linfomas: conceptos y clasificación',                    conResumen: true },
  tbl4: { claseId: 'pat-tbl-4', codigo: 'TBL4',  titulo: 'Neoplasias hematológicas: leucemias agudas y crónicas',  conResumen: true },
  acp8: { claseId: 'pat-acp-8', codigo: 'ACP8',  titulo: 'Linfadenopatía persistente',                             conResumen: true },
} satisfies Record<string, ClaseRecomendada>;

// Orden = cuántas veces salió cada tema en los exámenes reales (de más a menos;
// genes del cáncer y carcinogénesis, 23 cada uno): la ruleta del modo por temas
// y el informe lo leen en este orden.
// `seccion`: comienzo de un título (h1-h4) del resumen, sacado de su índice
// (`data/patologia-u2/indice/<id>.json`, fuera de git).
export const temasPatologia: TablaTemas = {
  'genes-cancer':        { label: 'Oncogenes, supresores y reparación del ADN',  clases: [{ ...C.ai10, seccion: 'III. Bases moleculares' }, { ...C.acp5, seccion: 'Clases de genes del cáncer' }] },
  'carcinogenesis':      { label: 'Carcinógenos químicos y radiación',           clases: [{ ...C.ai11, seccion: 'II. Agentes carcinógenos' }] },
  'histopatologia':      { label: 'Histopatología de neoplasias',                clases: [C.lab6, C.lab7] },
  'leucemias':           { label: 'Leucemias agudas y crónicas',                 clases: [C.tbl4, C.c5] },
  'vph':                 { label: 'VPH y neoplasia cervical',                    clases: [C.acp6] },
  'neoplasia-conceptos': { label: 'Neoplasia: definición, nomenclatura y anaplasia', clases: [{ ...C.ai10, seccion: 'I. DEFINICIÓN DE CONCEPTOS' }] },
  'mama':                { label: 'Cáncer de mama',                              clases: [C.tbl3] },
  'linfomas':            { label: 'Linfomas',                                    clases: [C.acp8, C.c6] },
  'metastasis':          { label: 'Invasión, angiogénesis y metástasis',         clases: [{ ...C.ai12, seccion: '7) Invasión y metástasis' }] },
  'clinica-tumoral':     { label: 'Gradación, estadificación y paraneoplásicos', clases: [C.ai13] },
  'cancer-hereditario':  { label: 'Predisposición genética al cáncer',           clases: [C.acp5, { ...C.tbl3, seccion: 'Factores hereditarios' }] },
  'carcinogenesis-microbiana': { label: 'Virus oncogénicos y H. pylori',         clases: [{ ...C.ai11, seccion: 'C) Carcinogénesis microbiana' }, C.acp7] },
  'inmunidad-cancer':    { label: 'Inmunidad, inflamación y cáncer',             clases: [{ ...C.ai14, seccion: '8. Inmunidad y cáncer' }, { ...C.ai12, seccion: '8) Evasión de la respuesta inmunitaria' }] },
  'gastrico-pulmon':     { label: 'Cáncer gástrico y de pulmón',                 clases: [C.acp7] },
  'mutaciones':          { label: 'Mutaciones y trastornos genéticos',           clases: [{ ...C.ai8, seccion: 'MUTACIONES' }] },
  'mendelianos':         { label: 'Herencia mendeliana',                         clases: [{ ...C.ai9, seccion: 'TRASTORNOS MENDELIANOS' }, C.ai8] },
  'hallmarks':           { label: 'Características distintivas del cáncer',     clases: [C.ai12] },
  'herencia-no-clasica': { label: 'Herencia no clásica: trinucleótidos e impronta', clases: [{ ...C.ai9, seccion: 'TRASTORNOS MONOGÉNICOS DE HERENCIA NO CLÁSICA' }] },
  'cromosomicos':        { label: 'Trastornos cromosómicos',                     clases: [{ ...C.ai9, seccion: 'TRASTORNOS CROMOSÓMICOS' }] },
};
