import type { AreaEncib } from './tipos';

export type { AreaEncib, Dificultad, Carga, PreguntaEncib, SubareaEncib, TemaEncib } from './tipos';

/**
 * Las 8 áreas de la tabla de especificaciones (idéntica en 2024, 2025 y 2026).
 * Son también los «cursos por disciplina» que ve quien no es de Cayetano.
 */
export interface AreaMeta {
  codigo: AreaEncib;
  slug: string;
  nombre: string;
  /** Preguntas que le asigna la tabla oficial, de 100. */
  peso: number;
  color: string;
  /** Una línea: qué abarca. */
  lema: string;
  /** Cómo se pregunta, según los cuadernillos 2024 y 2025. */
  huella: string;
}

export const AREAS: AreaMeta[] = [
  {
    codigo: 'ANA', slug: 'anatomia', nombre: 'Anatomía', peso: 16, color: '#e0624f',
    lema: 'Cabeza, cuello, neuroanatomía, tórax, abdomen y pelvis.',
    huella: 'El área más difícil del examen. La mitad de sus preguntas son de cabeza, cuello y neuroanatomía (pares craneales y vía visual todos los años); la pelvis aporta 3-4 por año y los miembros solo 1. Se pregunta como «lesión aquí → qué déficit» o «qué estructura se relaciona con cuál».',
  },
  {
    codigo: 'EMB', slug: 'embriologia', nombre: 'Embriología', peso: 7, color: '#e57fb0',
    lema: 'Desarrollo, placenta, embarazo múltiple y anomalías por sistema.',
    huella: 'Casi toda de memoria. Unas 5 de sus 7 preguntas son anomalías por sistema (respiratorio y cardiovascular todos los años) y siempre sale un teratógeno.',
  },
  {
    codigo: 'HIS', slug: 'histologia', nombre: 'Histología', peso: 9, color: '#8b5cf6',
    lema: 'Tejidos básicos, órganos, reproductor, sentidos y piel.',
    huella: '«Qué célula hace qué»: parietal, Sertoli, granulosa, neumocitos, osteoclasto. Pulmón, estómago e intestino, ovario y piel salieron en los tres años. Sin imágenes desde 2025.',
  },
  {
    codigo: 'BIO', slug: 'bioquimica', nombre: 'Bioquímica', peso: 9, color: '#2DC99A',
    lema: 'Biomoléculas, enzimas, señalización, bioenergética y metabolismo tisular.',
    huella: 'Sale menos de lo que pesa porque parte va disfrazada de fisiología o patología. Cuando aparece es enzima y vía: cadena respiratoria (los tres años), carnitina, lipólisis, HbS, efecto Warburg.',
  },
  {
    codigo: 'FIS', slug: 'fisiologia', nombre: 'Fisiología', peso: 16, color: '#3b9edd',
    lema: 'Cardiovascular, respiratoria, digestiva, renal, endocrina, nerviosa e integración.',
    huella: 'La segunda fuente de preguntas difíciles. Respiratoria con altura todos los años, renal y ácido-base, eje tiroideo, hígado y digestivo. Cardiovascular y locomotor casi no salen.',
  },
  {
    codigo: 'PAT', slug: 'patologia', nombre: 'Patología', peso: 16, color: '#c9a227',
    lema: 'Lesión celular, inflamación, hemodinámica, neoplasias y patología por órganos.',
    huella: 'El «pegamento» de los casos: se cruza con fisiología, micro y farmacología. Unas 5 preguntas de patología general por año y el resto una por órgano; se repiten hemato-linfoide, mama y cérvix, tiroiditis, artritis y piel maligna. Se pregunta describiendo la histología en palabras.',
  },
  {
    codigo: 'FAR', slug: 'farmacologia', nombre: 'Farmacología', peso: 16, color: '#5445d8',
    lema: 'Farmacología general, autónomo, sistemas y antimicrobianos.',
    huella: 'La más memorística. El 40 % es farmacología general y autónomo: colinérgicos, organofosforados, atropina, adrenérgicos en el shock y antídotos. Cada año sale un antidiabético, un antihipertensivo, un antituberculoso, un betalactámico y un anestésico general.',
  },
  {
    codigo: 'MIC', slug: 'microbiologia-parasitologia', nombre: 'Microbiología y parasitología', peso: 11, color: '#14a3a3',
    lema: 'Bacterias, hongos, virus, helmintos, protozoos y artrópodos.',
    huella: 'El reparto más estable del examen: uno de cada grupo de la lista cerrada de la tabla (3 bacterias, 1-2 hongos, 1-2 virus, 1 helminto, 2 protozoos, 1-2 artrópodos). Casi siempre se reconoce el agente por una palabra gatillo.',
  },
];

/** Por slug de la URL. Un `Map` y no un objeto: `__proto__` o `constructor`
 *  en la URL devolverían algo heredado en vez de nada. */
export const AREA_POR_SLUG: ReadonlyMap<string, AreaMeta> = new Map(AREAS.map((a) => [a.slug, a]));
export const AREA_POR_CODIGO = Object.fromEntries(AREAS.map((a) => [a.codigo, a])) as Record<AreaEncib, AreaMeta>;

/** Ficha del ENCIB 2026 (bases y tabla de especificaciones oficiales de ASPEFAM). */
export const ENCIB = {
  /** Fecha del examen, hora de Lima. */
  fecha: '2026-10-23',
  preguntas: 100,
  minutos: 120,
  alternativas: 4,
  organiza: 'ASPEFAM',
  modalidad: 'Presencial, en la sede que designe cada facultad',
  calificacion: 'Escala vigesimal, sin puntaje negativo',
  obligatorio: 'Obligatorio para quienes terminaron ciencias básicas en los dos últimos semestres; voluntario para el resto.',
  /** Rangos que anuncia la tabla. */
  dificultadAnunciada: { menor: '25-40 %', mediana: '40-60 %', mayor: '5-15 %' },
} as const;

/** Exámenes que se pueden elegir arriba en Cursos. Solo el ENCIB tiene página hoy. */
export interface ExamenDestino {
  slug: string;
  sigla: string;
  nombre: string;
  pais: string;
  href?: string;
  fecha?: string;
}

export const EXAMENES_DESTINO: ExamenDestino[] = [
  { slug: 'encib', sigla: 'ENCIB 2026', nombre: 'Examen Nacional de Ciencias Básicas', pais: 'Perú', href: '/dashboard/cursos/examen/encib', fecha: ENCIB.fecha },
  { slug: 'enam', sigla: 'ENAM', nombre: 'Examen Nacional de Medicina', pais: 'Perú' },
  { slug: 'residentado', sigla: 'Residentado', nombre: 'Concurso Nacional de Residentado Médico', pais: 'Perú' },
  { slug: 'enarm', sigla: 'ENARM', nombre: 'Examen Nacional para Aspirantes a Residencias Médicas', pais: 'México' },
  { slug: 'eunacom', sigla: 'EUNACOM', nombre: 'Examen Único Nacional de Conocimientos de Medicina', pais: 'Chile' },
  { slug: 'examen-unico', sigla: 'Examen Único', nombre: 'Examen Único de Residencias', pais: 'Argentina' },
];

/** Conceptos que salieron casi iguales en más de un año. */
export const REPETICIONES: { concepto: string; veces: string }[] = [
  { concepto: 'Etambutol → neuritis óptica con discromatopsia rojo-verde', veces: '2024 · 2025' },
  { concepto: 'Meningococcemia con púrpura petequial', veces: '2024 · 2025' },
  { concepto: 'Arteria meníngea media en el pterión → hematoma epidural', veces: '2024 · 2025' },
  { concepto: 'Paracetamol → NAPQI → N-acetilcisteína', veces: '2024 · 2025 (dos veces)' },
  { concepto: 'Aedes aegypti como vector', veces: '2024 · 2025' },
  { concepto: 'Espirometría con patrón obstructivo', veces: '2024 · 2025' },
  { concepto: 'Pilocarpina, atropina y organofosforados', veces: '2024 (×3) · 2025 (×2)' },
  { concepto: 'Defecto de la cadena respiratoria mitocondrial', veces: '2021 · 2024 · 2025' },
  { concepto: 'Acetazolamida en el mal de montaña', veces: '2021 · 2024' },
  { concepto: 'Gradiente alvéolo-arterial en la altura', veces: '2021 · 2025' },
  { concepto: 'Adrenalina en la anafilaxia', veces: '2021 · 2024' },
  { concepto: 'Osteoclasto: linaje monocito-macrófago', veces: '2021 · 2025' },
];

/** El subtema se repite y cambia la entidad por su «hermana». */
export const ROTACIONES: { tema: string; de: string; a: string }[] = [
  { tema: 'Tiroiditis', de: 'Riedel (2024)', a: 'De Quervain (2025)' },
  { tema: 'Linfomas', de: 'Hodgkin de predominio linfocítico (2024)', a: 'MALT (2025)' },
  { tema: 'Edema', de: 'Hidrostático por insuficiencia cardiaca (2024)', a: 'Oncótico por hipoalbuminemia (2025)' },
  { tema: 'Antidiabéticos', de: 'Gliflozinas (2024)', a: 'Insulina degludec (2025)' },
  { tema: 'Vasopresores', de: 'Adrenalina en anafilaxia (2024)', a: 'Noradrenalina en shock séptico (2025)' },
  { tema: 'Anestesia general', de: 'Etapas de Guedel (2024)', a: 'Hipertermia maligna (2025)' },
  { tema: 'Amebas', de: 'Naegleria fowleri (2024)', a: 'Entamoeba histolytica (2025)' },
  { tema: 'Ovario', de: 'Células de la granulosa (2024)', a: 'Cuerpo lúteo (2025)' },
  { tema: 'Ligamentos del útero', de: 'Redondo (2024)', a: 'Suspensorio del ovario (2025)' },
];
