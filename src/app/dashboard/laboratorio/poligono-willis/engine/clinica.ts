// Variantes anatómicas y síndromes clínicos del polígono de Willis.
// Las variantes cambian el calibre de los vasos del modelo (o añaden uno); los
// síndromes resaltan las arterias afectadas y, si es un aneurisma, marcan su
// saco. Lado «i» = izquierdo del paciente (a la derecha de la pantalla en la
// vista basal), «d» = derecho, «ambos» = los dos lados.

import type { ArteriaId } from './anatomia';
import type { Pt } from './geometria';

export type Lado = 'i' | 'd' | 'm';

// ── Variantes ────────────────────────────────────────────────────────────────

export type VarianteId =
  | 'completo' | 'pcom_hipo' | 'fetal' | 'a1_hipo' | 'acom_hipo'
  | 'vertebral_hipo' | 'trigeminal' | 'percheron';

export type ExtraId = 'trigeminal' | 'percheron';

export interface CambioVariante {
  arteria: ArteriaId;
  /** Sin lado: ambos lados (o la línea media). */
  lado?: 'i' | 'd';
  escala?: number;
  oculta?: boolean;
}

export interface Variante {
  id: VarianteId;
  nombre: string;
  frecuencia: string;
  desc: string;
  importancia: string;
  cambios: CambioVariante[];
  extra?: ExtraId;
}

export const VARIANTES: Record<VarianteId, Variante> = {
  completo: {
    id: 'completo',
    nombre: 'Polígono completo (clásico)',
    frecuencia: 'Menos de la mitad de las personas (≈ 30-50 % según la serie y según cuente o no los vasos hipoplásicos).',
    desc: 'Las nueve piezas del anillo están presentes y tienen un calibre parecido a ambos lados. Es el modelo de los libros, pero no la regla.',
    importancia: 'Un polígono completo permite compensar la oclusión lenta de una carótida o de una vertebral sin que haya infarto.',
    cambios: [],
  },
  pcom_hipo: {
    id: 'pcom_hipo',
    nombre: 'Comunicantes posteriores hipoplásicas',
    frecuencia: 'La variante más frecuente del polígono (uni o bilateral).',
    desc: 'Las comunicantes posteriores son hilos de menos de 1 mm: el sistema carotídeo y el vertebrobasilar quedan casi aislados.',
    importancia: 'Si se ocluye una carótida, la circulación posterior no puede ayudar; hay más riesgo de infartos en los territorios frontera.',
    cambios: [{ arteria: 'pcom', escala: 0.4 }],
  },
  fetal: {
    id: 'fetal',
    nombre: 'Cerebral posterior fetal (derecha)',
    frecuencia: '≈ 10-26 % (más a menudo unilateral).',
    desc: 'La comunicante posterior es más gruesa que la P1, que queda hipoplásica: la cerebral posterior se alimenta sobre todo de la carótida, como en el embrión.',
    importancia: 'Un émbolo de la carótida derecha puede infartar el lóbulo occipital derecho, y una oclusión de la basilar respeta ese territorio. Importa al planear una trombectomía o al ocluir una carótida.',
    cambios: [
      { arteria: 'pcom', lado: 'd', escala: 2.1 },
      { arteria: 'p1', lado: 'd', escala: 0.35 },
    ],
  },
  a1_hipo: {
    id: 'a1_hipo',
    nombre: 'A1 hipoplásica (izquierda)',
    frecuencia: '≈ 1-10 %.',
    desc: 'Una A1 muy fina: las dos A2 dependen de la A1 contraria a través de la comunicante anterior, que se engrosa.',
    importancia: 'El flujo cruzado aumenta los aneurismas de la comunicante anterior. Si se ocluye la A1 dominante, se infartan los territorios de ambas cerebrales anteriores.',
    cambios: [
      { arteria: 'a1', lado: 'i', escala: 0.3 },
      { arteria: 'acom', escala: 1.5 },
    ],
  },
  acom_hipo: {
    id: 'acom_hipo',
    nombre: 'Comunicante anterior hipoplásica',
    frecuencia: 'Poco frecuente.',
    desc: 'La comunicante anterior existe, pero es tan fina que no lleva flujo útil entre ambos lados.',
    importancia: 'Sin puente anterior, la oclusión de una carótida no se compensa desde el otro hemisferio; depende de la comunicante posterior y de la oftálmica.',
    cambios: [{ arteria: 'acom', escala: 0.35 }],
  },
  vertebral_hipo: {
    id: 'vertebral_hipo',
    nombre: 'Vertebral derecha hipoplásica',
    frecuencia: '≈ 2-10 %; la izquierda suele ser la dominante.',
    desc: 'Una vertebral de menos de 2 mm: la basilar se alimenta sobre todo de la contraria. A veces termina en la PICA.',
    importancia: 'Se asocia a más ictus de la circulación posterior y no debe confundirse con una estenosis o una disección en la ecografía o la angio-TC.',
    cambios: [{ arteria: 'vertebral', lado: 'd', escala: 0.45 }],
  },
  trigeminal: {
    id: 'trigeminal',
    nombre: 'Arteria trigeminal persistente',
    frecuencia: '≈ 0,1-0,6 %; es la anastomosis carótido-basilar fetal que más persiste.',
    desc: 'Une la carótida interna cavernosa con la basilar siguiendo el trayecto del nervio trigémino. En la angiografía lateral dibuja la «tau griega» (signo de Saltzman).',
    importancia: 'Se asocia a aneurismas y a otras anomalías vasculares, puede causar neuralgia del trigémino y deja pasar émbolos carotídeos al territorio posterior.',
    cambios: [],
    extra: 'trigeminal',
  },
  percheron: {
    id: 'percheron',
    nombre: 'Arteria de Percheron',
    frecuencia: '≈ 4-12 % en series anatómicas.',
    desc: 'Un solo tronco nacido de una P1 irriga los dos tálamos paramedianos y el mesencéfalo rostral, en lugar de talamoperforantes a cada lado.',
    importancia: 'Su oclusión infarta los dos tálamos paramedianos a la vez: somnolencia o coma, parálisis de la mirada vertical y amnesia.',
    cambios: [{ arteria: 'talamoperforantes', oculta: true }],
    extra: 'percheron',
  },
};

export const VARIANTE_LIST: Variante[] = Object.values(VARIANTES);

/** Escala y visibilidad de una pieza del modelo bajo una variante. */
export function efectoVariante(v: Variante | null, arteria: ArteriaId, lado: Lado): { escala: number; oculta: boolean; cambia: boolean } {
  let escala = 1;
  let oculta = false;
  let cambia = false;
  if (!v) return { escala, oculta, cambia };
  for (const c of v.cambios) {
    if (c.arteria !== arteria) continue;
    if (c.lado && lado !== 'm' && c.lado !== lado) continue;
    if (c.escala) escala *= c.escala;
    if (c.oculta) oculta = true;
    cambia = true;
  }
  return { escala, oculta, cambia };
}

// ── Síndromes ────────────────────────────────────────────────────────────────

export type SindromeId =
  | 'an_acom' | 'an_pcom' | 'an_acm' | 'an_basilar'
  | 'acm' | 'aca' | 'acp' | 'coroidea' | 'lacunar'
  | 'weber' | 'locked_in' | 'aica' | 'wallenberg' | 'dejerine';

export interface Sindrome {
  id: SindromeId;
  nombre: string;
  tipo: 'aneurisma' | 'isquemia';
  arterias: ArteriaId[];
  lado: 'i' | 'ambos';
  /** Centro y radio del saco aneurismático (lado izquierdo o línea media). */
  saco?: { centro: Pt; radio: number };
  /** Resalta también el III par (lo comprime). */
  nervio3?: boolean;
  frecuencia?: string;
  desc: string;
  clinica: string[];
  mecanismo: string;
  perla: string;
}

export const SINDROMES: Record<SindromeId, Sindrome> = {
  an_acom: {
    id: 'an_acom',
    nombre: 'Aneurisma de la comunicante anterior',
    tipo: 'aneurisma',
    arterias: ['acom', 'a1', 'a2'],
    lado: 'ambos',
    saco: { centro: [0.05, 3.02, -0.62], radio: 0.24 },
    frecuencia: '≈ 30-35 % de los aneurismas saculares: el más frecuente.',
    desc: 'Saco en la unión de la A1 con la comunicante anterior, que suele apuntar hacia delante y arriba.',
    clinica: [
      'Rotura: hemorragia subaracnoidea con cefalea súbita «en trueno», rigidez de nuca, vómitos y alteración de la conciencia',
      'Puede abrirse al giro recto o al ventrículo (hematoma frontal basal)',
      'Rara vez comprime el quiasma: defecto del campo visual',
      'Tras el sangrado o el clipaje: amnesia, confabulación y abulia',
    ],
    mecanismo: 'Las bifurcaciones tienen un defecto de la capa media y reciben el choque del flujo; el estrés es mayor si una A1 es hipoplásica.',
    perla: 'Los aneurismas saculares se asocian a poliquistosis renal autosómica dominante, Ehlers-Danlos, coartación de aorta, HTA y tabaco.',
  },
  an_pcom: {
    id: 'an_pcom',
    nombre: 'Aneurisma carótida-comunicante posterior',
    tipo: 'aneurisma',
    arterias: ['ica', 'pcom'],
    lado: 'i',
    saco: { centro: [1.8, 0.66, 0.58], radio: 0.3 },
    nervio3: true,
    frecuencia: '≈ 25 %: el segundo más frecuente.',
    desc: 'Saco en el origen de la comunicante posterior, que crece hacia atrás y abajo, justo donde corre el nervio oculomotor.',
    clinica: [
      'Parálisis del III del mismo lado CON midriasis: las fibras parasimpáticas van por fuera del nervio',
      'Ptosis, ojo desviado abajo y afuera, diplopía',
      'Cefalea retroorbitaria que puede anunciar la rotura',
      'Rotura: hemorragia subaracnoidea',
    ],
    mecanismo: 'Compresión directa del III par por el saco aneurismático.',
    perla: 'Parálisis del III con pupila dilatada: aneurisma. Con pupila respetada: isquemia del nervio (diabetes).',
  },
  an_acm: {
    id: 'an_acm',
    nombre: 'Aneurisma de la bifurcación de la cerebral media',
    tipo: 'aneurisma',
    arterias: ['m1', 'm2'],
    lado: 'i',
    saco: { centro: [5.2, 0.8, -0.38], radio: 0.24 },
    frecuencia: '≈ 20 %.',
    desc: 'Saco en la bifurcación de M1, en el limen de la ínsula, dentro de la cisura de Silvio.',
    clinica: [
      'Rotura: hemorragia subaracnoidea, a menudo con hematoma temporal o en la cisura de Silvio',
      'Si hay hematoma: hemiparesia contralateral y afasia (hemisferio dominante)',
      'Convulsiones',
    ],
    mecanismo: 'Estrés hemodinámico en la bifurcación terminal de M1.',
    perla: 'Hemorragia subaracnoidea con hematoma temporal: piensa primero en un aneurisma de la cerebral media.',
  },
  an_basilar: {
    id: 'an_basilar',
    nombre: 'Aneurisma de la punta de la basilar',
    tipo: 'aneurisma',
    arterias: ['basilar', 'p1'],
    lado: 'ambos',
    saco: { centro: [0, -1.18, 0.66], radio: 0.26 },
    frecuencia: 'La circulación posterior reúne ≈ 10 % de los aneurismas, y la punta de la basilar es su sitio más frecuente.',
    desc: 'Saco en la bifurcación terminal de la basilar, en la fosa interpeduncular, entre las dos P1.',
    clinica: [
      'Rotura: hemorragia subaracnoidea con peor pronóstico y mortalidad alta',
      'Puede comprimir el III par o el mesencéfalo',
      'Al tratarlo se pueden lesionar las talamoperforantes',
    ],
    mecanismo: 'El flujo de la basilar choca de frente contra el vértice de la bifurcación.',
    perla: 'Por su difícil acceso quirúrgico se tratan a menudo por vía endovascular (coils).',
  },
  acm: {
    id: 'acm',
    nombre: 'Infarto de la cerebral media',
    tipo: 'isquemia',
    arterias: ['m1', 'm2', 'lenticuloestriadas'],
    lado: 'i',
    desc: 'Oclusión de M1: se pierde la convexidad lateral y, por las lenticuloestriadas, los ganglios basales y la cápsula interna.',
    clinica: [
      'Hemiplejia y hemianestesia contralaterales de cara y brazo, más que de pierna',
      'Hemianopsia homónima contralateral',
      'Desviación de la mirada hacia el lado de la lesión',
      'Hemisferio dominante: afasia global',
      'Hemisferio no dominante: heminegligencia y anosognosia',
    ],
    mecanismo: 'Embolia cardiaca (fibrilación auricular) o arterioarterial desde la carótida. Es el territorio que más se infarta.',
    perla: 'La afasia localiza el hemisferio dominante, el izquierdo en casi todos los diestros.',
  },
  aca: {
    id: 'aca',
    nombre: 'Infarto de la cerebral anterior',
    tipo: 'isquemia',
    arterias: ['a2', 'heubner'],
    lado: 'i',
    desc: 'Oclusión de la cerebral anterior distal a la comunicante anterior: se pierde la cara medial del hemisferio.',
    clinica: [
      'Paresia y pérdida sensitiva contralaterales de predominio en la pierna',
      'Incontinencia urinaria',
      'Abulia, lentitud y reflejo de prensión',
      'Hemisferio dominante: afasia transcortical motora',
    ],
    mecanismo: 'Embolia o aterotrombosis; es el menos frecuente de los tres grandes territorios porque la comunicante anterior compensa.',
    perla: 'Pierna más que brazo: cerebral anterior.',
  },
  acp: {
    id: 'acp',
    nombre: 'Infarto de la cerebral posterior',
    tipo: 'isquemia',
    arterias: ['p2'],
    lado: 'i',
    desc: 'Oclusión de la cerebral posterior tras la comunicante posterior: lóbulo occipital, temporal inferomedial y tálamo posterior.',
    clinica: [
      'Hemianopsia homónima contralateral con respeto macular',
      'Hemisferio dominante con lesión del esplenio: alexia sin agrafia',
      'Trastornos de memoria (hipocampo)',
      'Talamogeniculadas: pérdida sensitiva y luego dolor contralateral (Dejerine-Roussy)',
      'Bilateral: ceguera cortical, a veces negada (síndrome de Anton)',
    ],
    mecanismo: 'Embolia por el sistema vertebrobasilar o, si la cerebral posterior es fetal, desde la carótida.',
    perla: 'El paciente lee mal pero escribe bien y no puede leer lo que escribió: alexia sin agrafia.',
  },
  coroidea: {
    id: 'coroidea',
    nombre: 'Síndrome de la coroidea anterior',
    tipo: 'isquemia',
    arterias: ['coroidea_ant'],
    lado: 'i',
    desc: 'Infarto del brazo posterior de la cápsula interna, la cintilla óptica y el geniculado lateral.',
    clinica: [
      'Hemiplejia contralateral',
      'Hemihipoestesia contralateral',
      'Hemianopsia homónima contralateral',
    ],
    mecanismo: 'Arteria fina y larga: enfermedad de pequeño vaso, embolia o lesión durante el clipaje de un aneurisma cercano.',
    perla: 'Hemiplejia, hemianestesia y hemianopsia sin afasia ni negligencia: piensa en la coroidea anterior.',
  },
  lacunar: {
    id: 'lacunar',
    nombre: 'Infarto lacunar',
    tipo: 'isquemia',
    arterias: ['lenticuloestriadas'],
    lado: 'i',
    desc: 'Infarto profundo de menos de 15 mm por oclusión de una perforante, aquí una lenticuloestriada.',
    clinica: [
      'Hemiparesia motora pura (brazo posterior de la cápsula interna)',
      'Otros cuadros lacunares: sensitivo puro (tálamo), sensitivo-motor, hemiparesia atáxica, disartria-mano torpe',
      'Sin afasia, negligencia ni hemianopsia: la corteza está indemne',
    ],
    mecanismo: 'Lipohialinosis y microateroma de las perforantes por HTA y diabetes.',
    perla: 'Déficit importante sin ningún signo cortical: laguna.',
  },
  weber: {
    id: 'weber',
    nombre: 'Síndrome de Weber',
    tipo: 'isquemia',
    arterias: ['p1', 'talamoperforantes'],
    lado: 'i',
    nervio3: true,
    desc: 'Infarto de la base del mesencéfalo por oclusión de las ramas paramedianas de la P1.',
    clinica: [
      'Parálisis del III del mismo lado: ptosis, midriasis, ojo abajo y afuera',
      'Hemiplejia contralateral, incluida la cara (pedúnculo cerebral)',
    ],
    mecanismo: 'Las ramas paramedianas de la P1 irrigan a la vez el fascículo del III y el pedúnculo cerebral.',
    perla: 'Pares craneales del lado de la lesión y vías largas del otro: lesión del tronco («síndrome alterno»).',
  },
  locked_in: {
    id: 'locked_in',
    nombre: 'Síndrome de enclaustramiento (locked-in)',
    tipo: 'isquemia',
    arterias: ['basilar', 'pontinas'],
    lado: 'ambos',
    desc: 'Infarto bilateral de la base de la protuberancia por trombosis de la basilar media.',
    clinica: [
      'Tetraplejia y anartria: se pierden las vías corticoespinal y corticobulbar de ambos lados',
      'Conciencia conservada: el tegmento y su formación reticular se respetan',
      'Solo conserva el parpadeo y la mirada vertical',
    ],
    mecanismo: 'Trombosis de la basilar media o de sus ramas paramedianas.',
    perla: 'No confundirlo con el coma: pídele que mire hacia arriba.',
  },
  aica: {
    id: 'aica',
    nombre: 'Síndrome pontino lateral inferior (AICA)',
    tipo: 'isquemia',
    arterias: ['aica', 'laberintica'],
    lado: 'i',
    desc: 'Infarto del tegmento lateral de la protuberancia caudal, del cerebelo anteroinferior y del oído interno.',
    clinica: [
      'Vértigo, nistagmo, hipoacusia y acúfenos del mismo lado (laberíntica)',
      'Parálisis facial periférica del mismo lado',
      'Pérdida termoalgésica en la cara del mismo lado y en el cuerpo del contrario',
      'Horner y ataxia del mismo lado',
    ],
    mecanismo: 'Oclusión de la AICA o de su origen en la basilar.',
    perla: 'Wallenberg con hipoacusia y parálisis facial: AICA, no PICA.',
  },
  wallenberg: {
    id: 'wallenberg',
    nombre: 'Síndrome de Wallenberg (bulbar lateral)',
    tipo: 'isquemia',
    arterias: ['vertebral', 'pica'],
    lado: 'i',
    desc: 'Infarto del bulbo lateral, más a menudo por oclusión de la vertebral intracraneal que de la propia PICA.',
    clinica: [
      'Vértigo, náuseas y nistagmo (núcleos vestibulares)',
      'Disfagia, disfonía y pérdida del reflejo nauseoso (núcleo ambiguo)',
      'Pérdida termoalgésica en la cara del mismo lado y en el cuerpo del contrario',
      'Horner del mismo lado (vía simpática descendente)',
      'Ataxia del mismo lado (pedúnculo cerebeloso inferior)',
      'Fuerza conservada: las pirámides son mediales',
    ],
    mecanismo: 'Aterotrombosis o disección de la vertebral, o embolia en la PICA.',
    perla: 'Si hay debilidad, ya no es bulbar lateral: busca el bulbo medial.',
  },
  dejerine: {
    id: 'dejerine',
    nombre: 'Síndrome bulbar medial (Dejerine)',
    tipo: 'isquemia',
    arterias: ['espinal_ant', 'vertebral'],
    lado: 'i',
    desc: 'Infarto paramediano del bulbo por oclusión de la espinal anterior o de las ramas paramedianas de la vertebral.',
    clinica: [
      'Hemiplejia contralateral que respeta la cara (pirámide)',
      'Pérdida de propiocepción y vibración contralateral (lemnisco medial)',
      'Lengua desviada hacia el lado de la lesión (XII)',
    ],
    mecanismo: 'Aterotrombosis de la vertebral distal o de la espinal anterior.',
    perla: 'Lengua hacia la lesión y hemiplejia del otro lado: bulbo medial.',
  },
};

export const SINDROME_LIST: Sindrome[] = Object.values(SINDROMES);

/** ¿La pieza (arteria, lado) está afectada por el síndrome? */
export function afectada(s: Sindrome | null, arteria: ArteriaId, lado: Lado): boolean {
  if (!s || !s.arterias.includes(arteria)) return false;
  return s.lado === 'ambos' || lado === 'm' || lado === s.lado;
}

// ── Lo esencial de variantes y síndromes (cabecera de sus fichas) ───────────

export interface EsencialVariante {
  /** Frecuencia corta para la lista y la cabecera. */
  frecuencia: string;
  cambia: string;
  importa: string;
  perla: string;
}

export const ESENCIAL_VARIANTE: Record<VarianteId, EsencialVariante> = {
  completo: { frecuencia: '≈ 30-50 %', cambia: 'Nada: las nueve piezas del anillo, de calibre parecido', importa: 'Compensa la oclusión lenta de una carótida o de una vertebral', perla: 'El polígono «de libro» es minoría.' },
  pcom_hipo: { frecuencia: 'La más frecuente', cambia: 'Comunicantes posteriores muy finas (< 1 mm)', importa: 'Los sistemas anterior y posterior quedan casi aislados', perla: 'Sin comunicante posterior útil, una oclusión carotídea no se compensa desde atrás.' },
  fetal: { frecuencia: '≈ 10-26 %', cambia: 'Comunicante posterior gruesa y P1 fina: la cerebral posterior depende de la carótida', importa: 'Un émbolo carotídeo puede infartar el occipital', perla: 'Infarto occipital con una carótida enferma: piensa en una cerebral posterior fetal.' },
  a1_hipo: { frecuencia: '≈ 1-10 %', cambia: 'Una A1 muy fina y la comunicante anterior engrosada', importa: 'Más aneurismas de la comunicante anterior', perla: 'Flujo cruzado por la comunicante anterior = más estrés = aneurisma.' },
  acom_hipo: { frecuencia: 'Poco frecuente', cambia: 'Comunicante anterior casi sin flujo', importa: 'No hay paso entre hemisferios', perla: 'La colateral queda en la comunicante posterior y la oftálmica.' },
  vertebral_hipo: { frecuencia: '≈ 2-10 %', cambia: 'Vertebral derecha de menos de 2 mm', importa: 'Más ictus posterior; se confunde con una estenosis', perla: 'La vertebral izquierda suele ser la dominante.' },
  trigeminal: { frecuencia: '≈ 0,1-0,6 %', cambia: 'Un puente entre la carótida cavernosa y la basilar', importa: 'Aneurismas, neuralgia del trigémino y émbolos al territorio posterior', perla: 'En la angiografía lateral dibuja la «tau griega».' },
  percheron: { frecuencia: '≈ 4-12 %', cambia: 'Un solo tronco irriga los dos tálamos paramedianos', importa: 'Una sola oclusión infarta ambos tálamos', perla: 'Infarto talámico bilateral y simétrico: arteria de Percheron.' },
};

export interface EsencialSindrome {
  lesiona: string;
  signo: string;
}

export const ESENCIAL_SINDROME: Record<SindromeId, EsencialSindrome> = {
  an_acom: { lesiona: 'Espacio subaracnoideo, al romperse', signo: 'Cefalea súbita «en trueno»' },
  an_pcom: { lesiona: 'III par, por compresión', signo: 'Ptosis + midriasis + ojo abajo y afuera' },
  an_acm: { lesiona: 'Cisura de Silvio y lóbulo temporal', signo: 'Hemorragia subaracnoidea con hematoma temporal' },
  an_basilar: { lesiona: 'Fosa interpeduncular y mesencéfalo', signo: 'Hemorragia grave; puede comprimir el III par' },
  acm: { lesiona: 'Convexidad lateral y ganglios basales', signo: 'Hemiplejia de cara y brazo + afasia o negligencia' },
  aca: { lesiona: 'Cara medial del hemisferio', signo: 'Paresia de la pierna + incontinencia' },
  acp: { lesiona: 'Lóbulo occipital y tálamo', signo: 'Hemianopsia con respeto macular' },
  coroidea: { lesiona: 'Cápsula interna posterior', signo: 'Hemiplejia + hemihipoestesia + hemianopsia' },
  lacunar: { lesiona: 'Cápsula interna (infarto < 15 mm)', signo: 'Hemiparesia motora pura, sin signos corticales' },
  weber: { lesiona: 'Base del mesencéfalo', signo: 'III par de un lado + hemiplejia del otro' },
  locked_in: { lesiona: 'Base de la protuberancia, a ambos lados', signo: 'Tetraplejia y anartria con conciencia intacta' },
  aica: { lesiona: 'Protuberancia lateral inferior y oído interno', signo: 'Como Wallenberg + hipoacusia y parálisis facial' },
  wallenberg: { lesiona: 'Bulbo lateral', signo: 'Disfagia, ronquera, Horner y sensibilidad cruzada' },
  dejerine: { lesiona: 'Bulbo medial', signo: 'Lengua hacia la lesión + hemiplejia del otro lado' },
};
