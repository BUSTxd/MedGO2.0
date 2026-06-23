// Banco de preguntas de la EVA 2 (anatomía — identificación de estructuras).
//
// Cada pregunta tiene dos partes encadenadas:
//   • Pregunta A → nombrar la estructura señalada. Debe responderse correctamente
//     para desbloquear la Pregunta B (regla del examen).
//   • Pregunta B → detalle clínico/funcional. Se evalúa por "conceptos clave":
//     cada concepto se da por acertado si la respuesta del alumno contiene
//     alguno de sus sinónimos (comparación normalizada sin tildes ni puntuación).
//
// IMÁGENES: por ahora cada pregunta usa un recuadro placeholder. Para añadir la
// imagen real más adelante, basta con setear `image` a la URL pública
// (bucket `examenes-img`, p. ej. 'neurologia/eva2/oblicuo-superior.webp' servido
// como URL completa) — el componente la renderiza con next/image automáticamente.

/** Concepto evaluable: se acierta si la respuesta incluye alguno de `accept`. */
export type Concept = { label: string; accept: string[] };

export type Question = {
  id: string;
  region: string;            // etiqueta de zona (se muestra en el recuadro de imagen)
  image?: string;            // URL de la imagen anatómica (placeholder si falta)
  imageCaption?: string;     // descripción anatómica de la imagen
  imageCitation?: string;    // cita APA de la fuente
  promptA: string;
  /** Sinónimos aceptados para la Pregunta A (nombre de la estructura). */
  answerA: { label: string; accept: string[] };
  promptB: string;
  conceptsB: Concept[];
  /** Nº de conceptos necesarios para dar B por completa. Por defecto: todos. */
  needB?: number;
  /** Respuesta modelo de B (texto que se muestra tras verificar). */
  modelB: string;
};

export const QUESTIONS: Question[] = [
  {
    id: 'oblicuo-superior',
    region: 'Órbita · M. extraoculares',
    image: 'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/eva2/oblicuo-superior.avif',
    imageCaption: 'Vista superior, órbita derecha. El músculo recto superior ha sido retirado, exponiendo el contenido intraconal. 1: nervio frontal. 2: vena oftálmica superior. 3: nervio óptico. 4: músculo oblicuo superior. 5: músculo recto lateral. 6: ganglio ciliar. 6ʼ: nervios ciliares cortos. 7: nervio abducens. 8: arteria oftálmica. 9: músculo recto medial.',
    imageCitation: 'Garrido, A., Fornos, P., Frigerio, J., Neirreitter, A., & Armand Ugón, G. (s.f.). Guide to the Anatomical Dissection of the Orbit Through the Superior Approach and Its Correlation with Surgical Procedures.',
    promptA: 'Nombre de lo señalado',
    answerA: { label: 'Músculo oblicuo superior (mayor)', accept: ['oblicuo superior', 'oblicuo mayor'] },
    promptB: 'Indique su inervación y su función',
    conceptsB: [
      { label: 'Inervación: N. troclear (IV par / patético)', accept: ['troclear', 'patetico', 'iv par', 'nervio iv', 'par iv', 'cuarto par', '4 par'] },
      { label: 'Depresión', accept: ['depresion', 'deprime', 'abate', 'desciende'] },
      { label: 'Abducción', accept: ['abduccion', 'abduce'] },
      { label: 'Rotación medial (intorsión)', accept: ['rotacion medial', 'intorsion', 'rotacion interna'] },
    ],
    modelB: 'Inervación: nervio troclear (patético o IV par). Función: depresión, abducción y rotación medial (intorsión) del globo ocular.',
  },
  {
    id: 'vertebra-cervical',
    region: 'Columna vertebral',
    promptA: 'Nombre de lo señalado',
    answerA: { label: 'Vértebra cervical típica', accept: ['cervical'] },
    promptB: 'Indique 04 características propias',
    conceptsB: [
      { label: 'Cuerpo rectangular', accept: ['cuerpo rectangular', 'rectangular'] },
      { label: 'Apófisis unciformes (semilunares)', accept: ['unciforme', 'semilunar', 'uncus'] },
      { label: 'Apófisis transversa bituberosa', accept: ['bituberosa', 'bitubercular', 'dos tuberculos', 'tuberculo anterior y posterior'] },
      { label: 'Agujero transverso en la apófisis transversa', accept: ['agujero transverso', 'foramen transverso', 'transversario'] },
      { label: 'Apófisis espinosa bífida', accept: ['bifida', 'espinosa bifida'] },
      { label: 'Agujero vertebral triangular', accept: ['vertebral triangular', 'triangular'] },
    ],
    needB: 4,
    modelB: 'Cuerpo rectangular; apófisis unciformes (semilunares); apófisis transversa bituberosa con agujero transverso; apófisis espinosa bífida; agujero vertebral de forma triangular.',
  },
  {
    id: 'membrana-timpanica-1',
    region: 'Oído',
    promptA: 'Nombre la estructura señalada',
    answerA: { label: 'Membrana timpánica', accept: ['membrana timpanica', 'timpano', 'timpanica'] },
    promptB: 'Indique la inervación sensitiva de su cara medial y lateral',
    conceptsB: [
      { label: 'Cara medial: N. timpánico de Jacobson (IX)', accept: ['jacobson', 'timpanico', 'glosofaringeo', 'ix', '9 par'] },
      { label: 'Cara lateral: N. auriculotemporal (V3)', accept: ['auriculotemporal', 'v3', 'trigemino'] },
      { label: 'Cara lateral: N. vago (X)', accept: ['vago', 'x par', 'neumogastrico', 'arnold'] },
    ],
    modelB: 'Cara medial: nervio timpánico de Jacobson (rama del IX). Cara lateral: nervio auriculotemporal (V3) y rama auricular del nervio vago (X).',
  },
  {
    id: 'filum-terminal',
    region: 'Médula espinal',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Filum terminal', accept: ['filum terminal', 'filum', 'filamento terminal'] },
    promptB: 'Indique de qué está constituido',
    conceptsB: [
      { label: 'Prolongación de la piamadre espinal', accept: ['piamadre', 'pia madre', 'pia'] },
    ],
    modelB: 'Es una prolongación de la piamadre espinal.',
  },
  {
    id: 'papila-optica',
    region: 'Ojo · Retina',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Papila óptica (disco óptico)', accept: ['papila optica', 'papila', 'disco optico', 'punto ciego'] },
    promptB: 'Indique 2 características',
    conceptsB: [
      { label: 'Zona carente de receptores (solo axones que originan el n. óptico)', accept: ['carente de receptores', 'sin receptores', 'no hay fotorreceptores', 'solo axones', 'axones', 'nervio optico'] },
      { label: 'Por su centro pasan los vasos centrales de la retina', accept: ['vasos centrales', 'arteria central', 'vena central', 'vasos de la retina'] },
    ],
    needB: 2,
    modelB: 'Zona carente de receptores: solo contiene los axones que originan el nervio óptico. Por su centro pasan los vasos centrales de la retina.',
  },
  {
    id: 'oblicuo-inferior',
    region: 'Órbita · M. extraoculares',
    promptA: 'Nombre de lo señalado',
    answerA: { label: 'Músculo oblicuo inferior', accept: ['oblicuo inferior', 'oblicuo menor'] },
    promptB: 'Indique su inervación y su función',
    conceptsB: [
      { label: 'Inervación: rama inferior del III par (oculomotor)', accept: ['rama inferior', 'iii', 'oculomotor', 'motor ocular comun', 'tercer par', '3 par'] },
      { label: 'Elevación', accept: ['elevacion', 'eleva'] },
      { label: 'Abducción', accept: ['abduccion', 'abduce'] },
      { label: 'Rotación lateral (extorsión)', accept: ['rotacion lateral', 'extorsion', 'rotacion externa'] },
    ],
    modelB: 'Inervación: rama inferior del III nervio craneal (oculomotor). Función: elevación, abducción y rotación lateral (extorsión) del globo ocular.',
  },
  {
    id: 'vertebra-toracica',
    region: 'Columna vertebral',
    promptA: 'Nombre de lo señalado',
    answerA: { label: 'Vértebra torácica típica', accept: ['toracica', 'dorsal'] },
    promptB: 'Indique 04 características propias',
    conceptsB: [
      { label: 'Cuerpo triangular / cordiforme (en corazón)', accept: ['cuerpo triangular', 'corazon', 'cordiforme', 'triangular'] },
      { label: 'Cuerpo con carillas (fositas) costales', accept: ['carillas costales', 'fositas costales', 'semicarillas', 'fovea costal', 'carillas articulares'] },
      { label: 'Apófisis transversa con carilla costal', accept: ['carilla en la apofisis transversa', 'carilla costal transversa', 'transversa con carilla', 'carillas en la transversa'] },
      { label: 'Apófisis espinosa larga e inclinada (triangular)', accept: ['espinosa triangular', 'espinosa larga', 'inclinada', 'espinosa oblicua'] },
      { label: 'Agujero vertebral circular', accept: ['vertebral circular', 'circular', 'redondo'] },
    ],
    needB: 4,
    modelB: 'Cuerpo triangular/cordiforme con carillas (fositas) costales; apófisis transversa con carilla costal; apófisis espinosa larga e inclinada (triangular); agujero vertebral de forma circular.',
  },
  {
    id: 'trompa-eustaquio',
    region: 'Oído',
    promptA: 'Nombre la estructura señalada',
    answerA: { label: 'Trompa faringotimpánica (de Eustaquio)', accept: ['faringotimpanica', 'eustaquio', 'trompa auditiva', 'tuba auditiva'] },
    promptB: 'Indique las regiones que comunica',
    conceptsB: [
      { label: 'Nasofaringe', accept: ['nasofaringe', 'rinofaringe', 'faringe'] },
      { label: 'Oído medio', accept: ['oido medio', 'caja timpanica', 'caja del timpano'] },
    ],
    needB: 2,
    modelB: 'Comunica la nasofaringe con el oído medio.',
  },
  {
    id: 'cono-medular',
    region: 'Médula espinal',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Cono medular', accept: ['cono medular', 'conus medullaris', 'cono terminal'] },
    promptB: 'Indique el nivel de la columna vertebral en el que se encuentra',
    conceptsB: [
      { label: 'Disco intervertebral L1–L2', accept: ['l1 l2', 'l1l2', 'l1 y l2', 'entre l1 y l2', 'primera y segunda lumbar'] },
    ],
    modelB: 'A nivel del disco intervertebral L1–L2.',
  },
  {
    id: 'cristalino',
    region: 'Ojo · Cristalino',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Cristalino', accept: ['cristalino', 'lente'] },
    promptB: 'Indique 02 funciones',
    conceptsB: [
      { label: 'Enfocar objetos a diferentes distancias (acomodación)', accept: ['enfocar', 'acomodacion', 'diferentes distancias', 'enfoque'] },
      { label: 'Refractar la luz para enfocar la imagen sobre la retina', accept: ['refractar', 'refraccion', 'refracta', 'sobre la retina'] },
    ],
    needB: 2,
    modelB: 'Enfocar objetos a diferentes distancias (acomodación) y refractar la luz para enfocar la imagen sobre la retina.',
  },
  {
    id: 'recto-lateral',
    region: 'Órbita · M. extraoculares',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Músculo recto lateral', accept: ['recto lateral', 'recto externo'] },
    promptB: '¿Quién lo inerva?',
    conceptsB: [
      { label: 'N. abducens (VI par)', accept: ['abducens', 'abducente', 'vi par', 'par vi', 'nervio vi', 'motor ocular externo', 'sexto par', '6 par'] },
    ],
    modelB: 'El nervio abducens (VI par craneal).',
  },
  {
    id: 'esclerotica',
    region: 'Ojo · Esclerótica',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Esclerótica', accept: ['esclerotica', 'esclera'] },
    promptB: 'Indique su inervación sensitiva',
    conceptsB: [
      { label: 'V1 (oftálmico) por su rama nasociliar', accept: ['nasociliar', 'v1', 'oftalmico', 'nasal'] },
    ],
    modelB: 'V1 (nervio oftálmico) a través de su rama nasociliar.',
  },
  {
    id: 'iris',
    region: 'Ojo · Iris',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Iris', accept: ['iris'] },
    promptB: 'Indique los músculos que contiene',
    conceptsB: [
      { label: 'Esfínter de la pupila', accept: ['esfinter'] },
      { label: 'Dilatador de la pupila', accept: ['dilatador'] },
    ],
    needB: 2,
    modelB: 'El músculo esfínter de la pupila y el músculo dilatador de la pupila.',
  },
  {
    id: 'membrana-timpanica-2',
    region: 'Oído',
    promptA: 'Nombre de la estructura señalada',
    answerA: { label: 'Membrana timpánica', accept: ['membrana timpanica', 'timpano', 'timpanica'] },
    promptB: 'Indique la inervación de su cara lateral',
    conceptsB: [
      { label: 'N. auriculotemporal (V3)', accept: ['auriculotemporal', 'v3'] },
      { label: 'Rama auricular del N. vago (X)', accept: ['auricular del vago', 'rama auricular', 'vago', 'x par', 'arnold'] },
    ],
    needB: 2,
    modelB: 'Nervio auriculotemporal (V3) y rama auricular del nervio vago (X).',
  },
];
