// Contenido anatómico del lab «Polígono de Willis 3D», sin React ni three.js.
// Cada arteria es UNA ficha aunque sea par (derecha e izquierda comparten
// texto); su trazado 3D vive en geometria.ts y su clínica de síndromes y
// variantes en clinica.ts.
//
// El contenido es conocimiento anatómico y clínico estándar escrito sin un
// libro abierto al lado. Verificado contra fuentes (2026-11-14): la disposición
// del polígono contra Gray's Anatomy 1918, fig. 519 (dominio público); las
// cifras de aneurismas (ACoA 30 %, PCoA 25 %, ACM 20 %, posterior ≈ 10 %,
// eMedicine), polígono completo (≈ 30-50 %, series de angio-RM y angio-TC),
// ACP fetal (≈ 10-26 %), Percheron (4-12 %) y trigeminal persistente
// (0,1-0,6 %, Radiopaedia). El resto de frecuencias, sin verificar.

export type ArteriaId =
  | 'carotida_comun' | 'ica' | 'oftalmica' | 'pcom' | 'coroidea_ant'
  | 'a1' | 'acom' | 'a2' | 'heubner' | 'anteromediales'
  | 'm1' | 'm2' | 'lenticuloestriadas'
  | 'p1' | 'p2' | 'talamoperforantes'
  | 'basilar' | 'pontinas' | 'sca' | 'aica' | 'laberintica'
  | 'vertebral' | 'pica' | 'espinal_ant';

export type GrupoId = 'anillo' | 'carotideo' | 'vertebrobasilar' | 'perforantes';
export type SistemaId = 'todo' | 'anterior' | 'posterior' | 'anillo';
export type TerritorioId = 'aca' | 'acm' | 'acp' | 'coroidea' | 'vb' | 'ojo' | 'conexion';
export type ReferenciaId = 'cerebro' | 'tronco' | 'optico' | 'hipofisis' | 'nervio3';

export interface Arteria {
  id: ArteriaId;
  nombre: string;
  /** Rótulo corto para la etiqueta sobre el modelo. */
  corto: string;
  grupo: GrupoId;
  sistema: 'anterior' | 'posterior';
  territorio: TerritorioId;
  /** Par (derecha e izquierda) o de línea media. */
  par: boolean;
  resumen: string;
  origen: string;
  trayecto: string;
  ramas: string[];
  irriga: string;
  clinica: string;
  perla: string;
  calibre: string;
}

export const GRUPOS: Array<{ id: GrupoId; nombre: string }> = [
  { id: 'anillo', nombre: 'Anillo del polígono' },
  { id: 'carotideo', nombre: 'Sistema carotídeo (anterior)' },
  { id: 'vertebrobasilar', nombre: 'Sistema vertebrobasilar (posterior)' },
  { id: 'perforantes', nombre: 'Perforantes' },
];

export const SISTEMAS: Array<{ id: SistemaId; nombre: string; sub: string; desc: string }> = [
  { id: 'todo', nombre: 'Todo', sub: '24 arterias', desc: 'Todas las arterias del modelo' },
  { id: 'anterior', nombre: 'Anterior', sub: 'carotídeo', desc: 'Carótidas internas y sus ramas' },
  { id: 'posterior', nombre: 'Posterior', sub: 'vertebrobasilar', desc: 'Vertebrales, basilar y sus ramas' },
  { id: 'anillo', nombre: 'Anillo', sub: '9 vasos', desc: 'Solo el polígono: ACI terminal, A1, ACoA, PCoA y P1' },
];

export const ARTERIAS: Record<ArteriaId, Arteria> = {
  // ═══════════════ ANILLO ═══════════════
  ica: {
    id: 'ica',
    nombre: 'Arteria carótida interna',
    corto: 'ACI',
    grupo: 'anillo',
    sistema: 'anterior',
    territorio: 'conexion',
    par: true,
    resumen: 'Rama terminal de la carótida común. Las dos carótidas internas llevan cerca del 70-80 % del flujo cerebral; su porción terminal es el polo lateral del polígono.',
    origen: 'Bifurcación de la carótida común, a la altura del borde superior del cartílago tiroides (C3-C4).',
    trayecto: 'Sube sin ramas por el cuello, entra por el conducto carotídeo del temporal (porción petrosa), cruza sobre el agujero rasgado, recorre el seno cavernoso con el VI par a su lado formando el sifón carotídeo, perfora la duramadre medial a la apófisis clinoides anterior y, ya en el espacio subaracnoideo, se divide lateral al quiasma en cerebral anterior y cerebral media. Segmentos de Bouthillier: C1 cervical, C2 petroso, C3 lacerum, C4 cavernoso, C5 clinoideo, C6 oftálmico y C7 comunicante.',
    ramas: [
      'Tronco meningohipofisario e inferolateral (C4, en el seno cavernoso)',
      'Oftálmica (C6)',
      'Hipofisarias superiores (C6)',
      'Comunicante posterior (C7)',
      'Coroidea anterior (C7)',
      'Terminales: cerebral anterior y cerebral media',
    ],
    irriga: 'Por sus ramas: el ojo, la hipófisis, la mayor parte de los hemisferios (territorios de la cerebral anterior y la media) y, por la coroidea anterior, estructuras profundas como la cápsula interna.',
    clinica: 'La estenosis aterosclerótica del bulbo carotídeo produce AIT e infartos embólicos, y amaurosis fugax cuando el émbolo va a la oftálmica. La oclusión aguda da un infarto de la cerebral media, a veces con la anterior. En el seno cavernoso: fístula carótido-cavernosa (exoftalmos pulsátil, soplo orbitario, quemosis) y aneurismas que comprimen los pares III, IV, V1, V2 y VI. La disección cervical cursa con dolor cervical o facial y síndrome de Horner ipsilateral.',
    perla: 'Amaurosis fugax (una «cortina» que baja sobre un ojo y se va en minutos): piensa en un émbolo carotídeo que entra en la oftálmica.',
    calibre: '≈ 4-5 mm',
  },
  a1: {
    id: 'a1',
    nombre: 'Cerebral anterior, segmento A1',
    corto: 'A1',
    grupo: 'anillo',
    sistema: 'anterior',
    territorio: 'aca',
    par: true,
    resumen: 'Tramo horizontal (precomunicante) de la cerebral anterior, de la carótida a la comunicante anterior. Forma el borde anterolateral del polígono.',
    origen: 'Bifurcación terminal de la carótida interna, lateral al quiasma óptico.',
    trayecto: 'Va hacia medial y adelante, por encima del nervio óptico o del quiasma, hasta la cisura interhemisférica, donde se une con la comunicante anterior. Mide unos 13-14 mm.',
    ramas: [
      'Perforantes mediales (lenticuloestriadas mediales) hacia la sustancia perforada anterior',
      'Ramas al quiasma, al nervio óptico y al hipotálamo anterior',
    ],
    irriga: 'Quiasma, hipotálamo anterior y, por sus perforantes, parte de la cabeza del caudado y del brazo anterior de la cápsula interna.',
    clinica: 'La A1 hipoplásica obliga a la A1 contraria a irrigar las dos A2 a través de la comunicante anterior. Ese flujo cruzado aumenta el estrés en la unión A1-ACoA y explica que en estos pacientes haya más aneurismas de la comunicante anterior.',
    perla: 'La A1 pasa POR ENCIMA del nervio óptico: un aneurisma de la región puede dar defectos del campo visual.',
    calibre: '≈ 2-2,5 mm',
  },
  acom: {
    id: 'acom',
    nombre: 'Arteria comunicante anterior',
    corto: 'ACoA',
    grupo: 'anillo',
    sistema: 'anterior',
    territorio: 'conexion',
    par: false,
    resumen: 'Puente corto entre las dos cerebrales anteriores. Cierra el polígono por delante y conecta las dos carótidas.',
    origen: 'Une las dos A1 en la cisura interhemisférica.',
    trayecto: 'Transversal, por encima del quiasma óptico o algo por delante de él. Mide unos 3-4 mm y su forma varía mucho: puede ser doble, fenestrada o en red.',
    ramas: [
      'Perforantes (2-4) hacia la lámina terminal, el hipotálamo anterior y el quiasma',
      'Subcallosa (o hipotalámica): fórnix, septum pellucidum y cíngulo anterior',
    ],
    irriga: 'Lámina terminal, hipotálamo anterior, columnas del fórnix, septum pellucidum y la parte anterior del cuerpo calloso, por sus perforantes.',
    clinica: 'Es el sitio más frecuente de aneurismas saculares (≈ 30-35 %). Su rotura produce una hemorragia subaracnoidea, a veces con hematoma en el giro recto o abierta al ventrículo. Tras el sangrado o el clipaje puede quedar un síndrome amnésico con confabulación y cambios de conducta, por lesión de las perforantes al prosencéfalo basal y al fórnix.',
    perla: 'Es la primera vía colateral: si una carótida se ocluye lentamente, la contraria irriga ese hemisferio a través de la ACoA.',
    calibre: '≈ 1,5 mm',
  },
  pcom: {
    id: 'pcom',
    nombre: 'Arteria comunicante posterior',
    corto: 'PCoA',
    grupo: 'anillo',
    sistema: 'anterior',
    territorio: 'conexion',
    par: true,
    resumen: 'Une, a cada lado, el sistema carotídeo con el vertebrobasilar. Forma el borde lateral del polígono.',
    origen: 'Cara posterior de la carótida interna supraclinoidea (segmento comunicante, C7).',
    trayecto: 'Va hacia atrás y medial, por encima y medial al nervio oculomotor, hasta unirse a la cerebral posterior en la unión P1-P2. Mide unos 12-14 mm.',
    ramas: [
      'Perforantes talámicas anteriores, entre ellas la tuberotalámica (polar)',
      'Ramas al hipotálamo, al tuber cinereum y al quiasma',
      'Ramas a la parte anterior del brazo posterior de la cápsula interna',
    ],
    irriga: 'Tálamo anterior, hipotálamo posterior, subtálamo y parte del brazo posterior de la cápsula interna, por sus perforantes.',
    clinica: 'La unión carótida-comunicante posterior es el segundo sitio más frecuente de aneurismas (≈ 25 %). Al crecer comprime el III par: ptosis, ojo desviado abajo y afuera y midriasis, porque las fibras pupilares van por la periferia del nervio. Su oclusión aislada casi no da clínica si el resto del polígono funciona.',
    perla: 'Parálisis del III con pupila dilatada y cefalea: aneurisma de la comunicante posterior hasta demostrar lo contrario. Si la pupila se respeta, piensa en isquemia del nervio (diabetes).',
    calibre: '≈ 1-1,5 mm (muy variable)',
  },
  p1: {
    id: 'p1',
    nombre: 'Cerebral posterior, segmento P1',
    corto: 'P1',
    grupo: 'anillo',
    sistema: 'posterior',
    territorio: 'acp',
    par: true,
    resumen: 'Tramo precomunicante de la cerebral posterior, del ápex de la basilar a la comunicante posterior. Cierra el polígono por detrás.',
    origen: 'Bifurcación terminal de la basilar, en la fosa interpeduncular.',
    trayecto: 'Va hacia lateral, por encima del nervio oculomotor (que sale entre la P1 y la cerebelosa superior), hasta recibir la comunicante posterior. Mide unos 7-8 mm.',
    ramas: [
      'Talamoperforantes posteriores (paramedianas)',
      'Ramas mesencefálicas paramedianas',
      'Coroidea posterior medial (a veces)',
    ],
    irriga: 'Mesencéfalo paramediano (núcleos del III, núcleo rojo, parte medial del pedúnculo cerebral) y tálamo paramediano.',
    clinica: 'La oclusión de sus ramas paramedianas da síndromes mesencefálicos: Weber (III ipsilateral y hemiplejia contralateral), Claude (III y ataxia contralateral) o Benedikt (III con temblor y movimientos involuntarios contralaterales por lesión del núcleo rojo).',
    perla: 'El III par sale entre la cerebral posterior y la cerebelosa superior: un aneurisma de la punta de la basilar o de la P1 también puede comprimirlo.',
    calibre: '≈ 2 mm',
  },

  // ═══════════════ SISTEMA CAROTÍDEO ═══════════════
  carotida_comun: {
    id: 'carotida_comun',
    nombre: 'Carótida común y bifurcación carotídea',
    corto: 'Carótida común',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'conexion',
    par: true,
    resumen: 'Tronco del cuello que se divide en carótida interna (encéfalo y ojo) y externa (cara y cuello). Se ve en «Posición real».',
    origen: 'Derecha: del tronco braquiocefálico, detrás de la articulación esternoclavicular. Izquierda: directamente del arco aórtico.',
    trayecto: 'Sube vertical por la vaina carotídea, con la vena yugular interna por fuera y el nervio vago por detrás, sin dar ramas, hasta el borde superior del cartílago tiroides (C3-C4), donde se bifurca. La carótida interna sigue vertical hasta la base del cráneo, entra en el conducto carotídeo y se dobla casi en ángulo recto (porción petrosa, horizontal); vuelve a curvarse en el seno cavernoso (sifón) y sube junto al quiasma: así pasa de vertical a quedar bajo el cerebro.',
    ramas: [
      'Carótida interna: no da ninguna rama en el cuello',
      'Carótida externa: tiroidea superior, faríngea ascendente, lingual, facial, occipital, auricular posterior, maxilar y temporal superficial',
      'En la bifurcación: seno carotídeo (barorreceptor, inervado por el IX par) y cuerpo carotídeo (quimiorreceptor)',
    ],
    irriga: 'Por la carótida interna, la mayor parte del encéfalo y el ojo; por la externa, la cara, el cuero cabelludo, la lengua, la faringe, la tiroides y las meninges (meníngea media).',
    clinica: 'La bifurcación es el sitio típico de la placa aterosclerótica: soplo carotídeo, AIT, amaurosis fugax e ictus de la cerebral media. Una estenosis sintomática de 70 % o más se trata con endarterectomía o stent. Masajear el seno carotídeo produce bradicardia: sirve para cortar algunas taquicardias supraventriculares y es peligroso si hay hipersensibilidad del seno.',
    perla: 'Si da ramas en el cuello, es la carótida externa: la interna no da ninguna hasta entrar al cráneo.',
    calibre: '≈ 6-8 mm',
  },
  oftalmica: {
    id: 'oftalmica',
    nombre: 'Arteria oftálmica',
    corto: 'Oftálmica',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'ojo',
    par: true,
    resumen: 'Primera rama intradural de la carótida interna. Irriga el ojo y el contenido de la órbita.',
    origen: 'Cara anteromedial de la carótida interna al salir del seno cavernoso (segmento oftálmico, C6), bajo la apófisis clinoides anterior.',
    trayecto: 'Entra en la órbita por el conducto óptico, por debajo y lateral al nervio óptico, y luego lo cruza (casi siempre por encima) hacia medial.',
    ramas: [
      'Central de la retina: la más importante, irriga la retina interna',
      'Ciliares posteriores: coroides y cabeza del nervio óptico',
      'Lagrimal',
      'Supraorbitaria y supratroclear',
      'Etmoidales anterior y posterior',
      'Musculares',
    ],
    irriga: 'Retina, nervio óptico, globo ocular, músculos extraoculares, glándula lagrimal, frente, párpados y parte de la mucosa nasal.',
    clinica: 'La oclusión de la arteria central de la retina produce una pérdida visual monocular súbita e indolora, con la retina pálida y una mancha rojo cereza en la mácula. La amaurosis fugax es su forma transitoria. En la arteritis de células gigantes, la isquemia de las ciliares posteriores causa neuropatía óptica isquémica anterior.',
    perla: 'Se anastomosa con ramas de la carótida externa (facial, maxilar, temporal superficial): vía colateral cuando se ocluye la carótida interna.',
    calibre: '≈ 1-1,5 mm',
  },
  coroidea_ant: {
    id: 'coroidea_ant',
    nombre: 'Arteria coroidea anterior',
    corto: 'Coroidea ant.',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'coroidea',
    par: true,
    resumen: 'Rama fina y larga de la carótida interna para estructuras profundas y para el plexo coroideo del asta temporal.',
    origen: 'Carótida interna supraclinoidea, 2-5 mm distal al origen de la comunicante posterior.',
    trayecto: 'Va hacia atrás y lateral siguiendo la cintilla óptica, rodea el pedúnculo cerebral y entra en el asta temporal del ventrículo lateral por la fisura coroidea.',
    ramas: [
      'Cisternales: cintilla óptica, pedúnculo cerebral, uncus',
      'Capsulotalámicas',
      'Plexales: plexo coroideo del asta temporal',
    ],
    irriga: 'Dos tercios inferiores del brazo posterior de la cápsula interna y su parte retrolenticular, cintilla óptica, parte del cuerpo geniculado lateral, globo pálido interno, cola del caudado, uncus, amígdala, hipocampo anterior y plexo coroideo.',
    clinica: 'Síndrome de la coroidea anterior: hemiplejia, hemihipoestesia y hemianopsia homónima contralaterales. La misma tríada la puede dar una lesión extensa de la cápsula interna posterior.',
    perla: 'Es fina y larga: se compromete en infartos de pequeño vaso y es la arteria que más preocupa al clipar aneurismas de la carótida supraclinoidea.',
    calibre: '≈ 0,5-1 mm',
  },
  a2: {
    id: 'a2',
    nombre: 'Cerebral anterior, segmentos A2 a A5',
    corto: 'A2',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'aca',
    par: true,
    resumen: 'Continuación poscomunicante de la cerebral anterior en la cisura interhemisférica. Irriga la cara medial del hemisferio.',
    origen: 'Unión de la A1 con la comunicante anterior.',
    trayecto: 'Sube por delante de la lámina terminal (A2), rodea la rodilla del cuerpo calloso (A3) y corre hacia atrás sobre él (A4-A5) como arteria pericallosa; la callosomarginal va por el surco del cíngulo.',
    ramas: [
      'Recurrente de Heubner (en la A2 proximal o la unión A1-A2)',
      'Orbitofrontal medial y frontopolar',
      'Pericallosa',
      'Callosomarginal',
      'Paracentral',
      'Precúneas (parietales internas)',
    ],
    irriga: 'Cara medial de los lóbulos frontal y parietal hasta el surco parietooccipital, una franja de 2 cm de la convexidad superior, el giro recto y los cuatro quintos anteriores del cuerpo calloso.',
    clinica: 'Infarto de la cerebral anterior: debilidad y pérdida sensitiva contralaterales de predominio en la PIERNA (lobulillo paracentral), incontinencia urinaria, abulia, reflejo de prensión y, en el hemisferio dominante, afasia transcortical motora. Si ambas A2 dependen de una sola arteria (ACA ácigos), un solo trombo da paraparesia y mutismo acinético.',
    perla: 'Pierna más que brazo: cerebral anterior. Cara y brazo más que pierna: cerebral media.',
    calibre: '≈ 2 mm',
  },
  heubner: {
    id: 'heubner',
    nombre: 'Arteria recurrente de Heubner',
    corto: 'Heubner',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'aca',
    par: true,
    resumen: 'Perforante larga que vuelve hacia atrás sobre la A1. Es la mayor de las estriadas mediales.',
    origen: 'Casi siempre de la A2 proximal o de la unión A1-A2, a pocos milímetros de la comunicante anterior.',
    trayecto: '«Recurre»: corre hacia atrás y lateral, paralela y por encima de la A1, hasta penetrar en la sustancia perforada anterior. Mide unos 20-25 mm.',
    ramas: [
      'Estriadas a la cabeza del núcleo caudado',
      'Ramas al putamen y globo pálido anteriores',
      'Ramas al brazo anterior y la rodilla de la cápsula interna',
    ],
    irriga: 'Cabeza del núcleo caudado, tercio anterior del putamen, parte anterior del globo pálido y brazo anterior de la cápsula interna.',
    clinica: 'Su lesión, por infarto o durante el clipaje de un aneurisma de la comunicante anterior, causa debilidad contralateral de la cara y el brazo de predominio proximal y disartria; en el hemisferio dominante, alteraciones del lenguaje.',
    perla: 'Es la arteria que el neurocirujano busca y protege al clipar un aneurisma de la comunicante anterior.',
    calibre: '≈ 0,8 mm',
  },
  m1: {
    id: 'm1',
    nombre: 'Cerebral media, segmento M1',
    corto: 'M1',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'acm',
    par: true,
    resumen: 'La mayor rama terminal de la carótida interna. Su segmento M1 (esfenoidal) corre hacia lateral, hacia la cisura de Silvio.',
    origen: 'Bifurcación de la carótida interna, lateral al quiasma.',
    trayecto: 'Discurre hacia lateral por debajo de la sustancia perforada anterior, paralela al ala menor del esfenoides, hasta el limen de la ínsula, donde en la mayoría se bifurca (a veces se trifurca) en troncos M2.',
    ramas: [
      'Lenticuloestriadas laterales (6-12)',
      'Temporal anterior y polar temporal',
      'Orbitofrontal lateral (a veces)',
      'Troncos superior e inferior (M2)',
    ],
    irriga: 'Por sus perforantes: putamen, globo pálido lateral, parte de la cabeza y el cuerpo del caudado, parte superior de la cápsula interna y corona radiada. Por sus ramas distales, toda la convexidad lateral.',
    clinica: 'La oclusión de M1 produce hemiplejia y hemianestesia contralaterales de cara y brazo más que pierna, hemianopsia homónima y desviación de la mirada hacia el lado de la lesión. En el hemisferio dominante, afasia global; en el no dominante, heminegligencia y anosognosia. Si el infarto es extenso, el edema puede herniar el encéfalo («infarto maligno de la ACM»).',
    perla: 'En la TC sin contraste, la «cerebral media hiperdensa» es el trombo dentro de M1.',
    calibre: '≈ 2,5-3 mm',
  },
  m2: {
    id: 'm2',
    nombre: 'Cerebral media, segmentos M2 a M4',
    corto: 'M2',
    grupo: 'carotideo',
    sistema: 'anterior',
    territorio: 'acm',
    par: true,
    resumen: 'Troncos superior e inferior de la cerebral media: recorren la ínsula, salen por la cisura de Silvio y cubren la convexidad.',
    origen: 'Bifurcación de M1 en el limen de la ínsula.',
    trayecto: 'Suben sobre la ínsula (M2), giran en el surco circular hacia los opérculos (M3) y salen a la superficie lateral del hemisferio (M4).',
    ramas: [
      'Tronco superior: orbitofrontal, prefrontal, precentral, central (rolándica) y parietal anterior',
      'Tronco inferior: temporales media y posterior, temporooccipital, angular y parietal posterior',
    ],
    irriga: 'Casi toda la convexidad lateral: corteza motora y sensitiva de la cara y el brazo, áreas de Broca (frontal inferior) y de Wernicke (temporal superior posterior), giros angular y supramarginal, ínsula y radiaciones ópticas.',
    clinica: 'Tronco superior: hemiparesia de cara y brazo, con afasia de Broca (no fluente, comprende) en el hemisferio dominante. Tronco inferior: afasia de Wernicke (fluente, no comprende) o, en el no dominante, heminegligencia y apraxia; cuadrantanopsia superior contralateral por el asa de Meyer.',
    perla: 'Broca: habla poco y con esfuerzo, pero entiende. Wernicke: habla mucho y sin sentido, y no entiende.',
    calibre: '≈ 1,5-2 mm',
  },

  // ═══════════════ SISTEMA VERTEBROBASILAR ═══════════════
  vertebral: {
    id: 'vertebral',
    nombre: 'Arteria vertebral (segmento V4)',
    corto: 'Vertebral',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'Primera rama de la subclavia. Sube por los agujeros transversos y entra en el cráneo por el agujero magno; las dos forman la basilar.',
    origen: 'Primera rama de la arteria subclavia.',
    trayecto: 'V1: de la subclavia al agujero transverso de C6. V2: por los agujeros transversos de C6 a C1. V3: rodea el arco posterior del atlas. V4: perfora la duramadre, entra por el agujero magno, va por delante y a un lado del bulbo y se une a la contraria en el surco bulboprotuberancial.',
    ramas: [
      'Meníngeas (en el agujero magno)',
      'Espinal posterior (o desde la PICA)',
      'Espinal anterior',
      'Cerebelosa posteroinferior (PICA)',
      'Ramas bulbares directas',
    ],
    irriga: 'Bulbo (medial y lateral), cara inferior del cerebelo y los segmentos altos de la médula espinal.',
    clinica: 'Su oclusión intracraneal, como la de la PICA, da el síndrome bulbar lateral de Wallenberg. La disección (traumatismo o manipulación cervical) produce dolor cervical u occipital y un ictus posterior. En el robo de la subclavia, una estenosis proximal de la subclavia invierte el flujo de la vertebral al mover el brazo: mareo, síncope y pulso radial débil.',
    perla: 'Son asimétricas: la izquierda suele ser la dominante, y una vertebral hipoplásica puede terminar en la PICA sin llegar a la basilar.',
    calibre: '≈ 3-4 mm',
  },
  pica: {
    id: 'pica',
    nombre: 'Arteria cerebelosa posteroinferior (PICA)',
    corto: 'PICA',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'La rama más grande de la vertebral y la más tortuosa de las cerebelosas.',
    origen: 'Vertebral intracraneal, 1-2 cm antes de formar la basilar (a veces extradural).',
    trayecto: 'Rodea el bulbo por su cara lateral entre las raicillas de los pares IX, X y XI, forma un asa caudal y otra craneal junto a la amígdala cerebelosa y termina en la cara inferior del cerebelo y del vermis.',
    ramas: [
      'Bulbares laterales',
      'Coroidea del IV ventrículo',
      'Vermiana inferior',
      'Hemisféricas inferiores (amigdalohemisféricas)',
      'Espinal posterior (a veces)',
    ],
    irriga: 'Bulbo lateral (núcleo ambiguo, espinotalámico, núcleo espinal del trigémino, núcleos vestibulares, vía simpática descendente, pedúnculo cerebeloso inferior), cara inferior del cerebelo y del vermis y plexo coroideo del IV ventrículo.',
    clinica: 'Síndrome de Wallenberg: vértigo, náuseas y nistagmo; disfagia, disfonía y pérdida del reflejo nauseoso (núcleo ambiguo); pérdida termoalgésica en la cara del mismo lado y en el cuerpo del lado contrario; Horner y ataxia ipsilaterales. La fuerza se conserva porque las pirámides son mediales.',
    perla: 'Disfagia, ronquera, Horner y sensibilidad «cruzada» (cara de un lado, cuerpo del otro) = bulbo lateral.',
    calibre: '≈ 1,5 mm',
  },
  espinal_ant: {
    id: 'espinal_ant',
    nombre: 'Arteria espinal anterior',
    corto: 'Espinal ant.',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'Nace de dos raíces, una de cada vertebral, que se unen en la línea media y bajan por la fisura media anterior.',
    origen: 'Ramas mediales de ambas vertebrales, cerca de la unión vertebrobasilar.',
    trayecto: 'Las dos raíces convergen sobre la cara anterior del bulbo y descienden como un solo vaso por la fisura media anterior de toda la médula, reforzado por arterias radiculomedulares (la mayor, la de Adamkiewicz, entre T9 y L2).',
    ramas: [
      'Bulbares paramedianas',
      'Surcocomisurales (a la médula)',
    ],
    irriga: 'Bulbo paramediano (pirámide, lemnisco medial, núcleo del XII) y los dos tercios anteriores de la médula espinal.',
    clinica: 'Síndrome bulbar medial (Dejerine): hemiplejia contralateral (pirámide), pérdida de la propiocepción y la vibración contralaterales (lemnisco medial) y lengua desviada hacia el lado de la lesión (XII). En la médula, el síndrome de la arteria espinal anterior: paraplejia y pérdida termoalgésica por debajo de la lesión con los cordones posteriores respetados.',
    perla: 'Lengua que se desvía hacia la lesión más hemiplejia del otro lado = bulbo medial.',
    calibre: '≈ 0,5 mm',
  },
  basilar: {
    id: 'basilar',
    nombre: 'Arteria basilar',
    corto: 'Basilar',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: false,
    resumen: 'Tronco de línea media formado por la unión de ambas vertebrales. Corre por el surco basilar de la protuberancia, apoyada en el clivus.',
    origen: 'Unión de las dos vertebrales en el surco bulboprotuberancial.',
    trayecto: 'Sube por la cara ventral de la protuberancia hasta la fosa interpeduncular, donde termina dividiéndose en las dos cerebrales posteriores. Mide unos 25-30 mm.',
    ramas: [
      'Pontinas paramedianas y circunferenciales cortas',
      'Cerebelosa anteroinferior (AICA)',
      'Laberíntica (a veces directa)',
      'Cerebelosa superior (SCA)',
      'Terminales: cerebrales posteriores',
    ],
    irriga: 'Protuberancia, buena parte del cerebelo, el oído interno y, por sus ramas terminales, el mesencéfalo, el tálamo posterior y los lóbulos occipitales.',
    clinica: 'La trombosis de la basilar es grave y fluctuante: vértigo, diplopía, disartria, tetraparesia y coma. La oclusión de su porción media infarta la base de la protuberancia y da el síndrome de enclaustramiento (locked-in). La oclusión de la punta da el síndrome del «top de la basilar»: alteración de la conciencia, de la mirada vertical y ceguera cortical.',
    perla: 'En el locked-in el paciente está consciente y se comunica con el parpadeo y la mirada vertical, porque el mesencéfalo está indemne.',
    calibre: '≈ 3-4 mm',
  },
  aica: {
    id: 'aica',
    nombre: 'Arteria cerebelosa anteroinferior (AICA)',
    corto: 'AICA',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'Rama del tercio inferior de la basilar hacia el ángulo pontocerebeloso.',
    origen: 'Tercio inferior de la basilar.',
    trayecto: 'Va hacia lateral y atrás sobre la protuberancia, se relaciona con los pares VI, VII y VIII y suele formar un asa en el meato acústico interno.',
    ramas: [
      'Laberíntica (auditiva interna), en la mayoría',
      'Perforantes recurrentes a la protuberancia',
      'Subarcuata',
      'Ramas al flóculo y a la cara anteroinferior del cerebelo',
    ],
    irriga: 'Cara anteroinferior del cerebelo, flóculo, pedúnculo cerebeloso medio, tegmento lateral de la protuberancia caudal y, por la laberíntica, el oído interno.',
    clinica: 'Síndrome pontino lateral inferior: vértigo, nistagmo, hipoacusia y acúfenos ipsilaterales (laberíntica), parálisis facial periférica ipsilateral, pérdida termoalgésica en la cara del mismo lado y en el cuerpo del contrario, Horner y ataxia ipsilaterales.',
    perla: 'Se parece a Wallenberg, pero con hipoacusia y parálisis facial: eso apunta a la AICA y no a la PICA.',
    calibre: '≈ 1 mm',
  },
  laberintica: {
    id: 'laberintica',
    nombre: 'Arteria laberíntica (auditiva interna)',
    corto: 'Laberíntica',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'Arteria terminal del oído interno.',
    origen: 'Casi siempre de la AICA; a veces directamente de la basilar.',
    trayecto: 'Acompaña a los nervios facial y vestibulococlear por el meato acústico interno.',
    ramas: [
      'Vestibular anterior',
      'Coclear común (vestibulococlear y coclear propia)',
    ],
    irriga: 'Cóclea, vestíbulo y conductos semicirculares.',
    clinica: 'Es terminal: su oclusión produce hipoacusia neurosensorial súbita y vértigo intenso del mismo lado. Puede ser el primer signo de un ictus de la AICA o de la basilar.',
    perla: 'Hipoacusia súbita con vértigo en un paciente con factores de riesgo vascular: descartar isquemia de la AICA antes de culpar al oído.',
    calibre: '≈ 0,2-0,3 mm',
  },
  sca: {
    id: 'sca',
    nombre: 'Arteria cerebelosa superior (SCA)',
    corto: 'SCA',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'La última rama de la basilar antes de bifurcarse. Irriga la cara superior del cerebelo.',
    origen: 'Basilar, justo por debajo de su bifurcación en cerebrales posteriores.',
    trayecto: 'Rodea el mesencéfalo por debajo de la tienda del cerebelo, separada de la cerebral posterior por el nervio oculomotor (y luego el troclear), hasta la cara superior del cerebelo.',
    ramas: [
      'Perforantes al mesencéfalo y al pedúnculo cerebeloso superior',
      'Hemisféricas superiores',
      'Vermianas superiores',
    ],
    irriga: 'Cara superior del cerebelo y del vermis, núcleos cerebelosos profundos (dentado), pedúnculo cerebeloso superior y tegmento lateral de la protuberancia rostral.',
    clinica: 'Infarto de la SCA: ataxia de las extremidades del mismo lado, disartria y vértigo; puede asociar Horner ipsilateral y pérdida termoalgésica contralateral.',
    perla: 'Un asa de la SCA que comprime la raíz del trigémino es la causa vascular más común de neuralgia del trigémino (se trata con descompresión microvascular).',
    calibre: '≈ 1-1,5 mm',
  },
  p2: {
    id: 'p2',
    nombre: 'Cerebral posterior, segmentos P2 a P4',
    corto: 'ACP',
    grupo: 'vertebrobasilar',
    sistema: 'posterior',
    territorio: 'acp',
    par: true,
    resumen: 'Tras recibir la comunicante posterior, la cerebral posterior rodea el mesencéfalo y llega al temporal inferomedial y al lóbulo occipital.',
    origen: 'Unión con la comunicante posterior (fin de P1).',
    trayecto: 'Rodea el pedúnculo cerebral por la cisterna ambiens (P2), paralela a la cintilla óptica y por encima de la tienda; en la cisterna cuadrigémina (P3) se dirige hacia atrás y termina en la cara medial del occipital (P4), donde se divide en calcarina y parietooccipital.',
    ramas: [
      'Talamogeniculadas (tálamo lateral y cuerpos geniculados)',
      'Coroideas posteriores medial y lateral',
      'Temporales inferiores (anterior, media y posterior)',
      'Calcarina (corteza visual primaria)',
      'Parietooccipital',
      'Esplenial (rodete del cuerpo calloso)',
    ],
    irriga: 'Lóbulo occipital con la corteza visual (área 17), cara inferomedial del lóbulo temporal (incluida parte del hipocampo), esplenio del cuerpo calloso, tálamo posterior (pulvinar) y cuerpos geniculados.',
    clinica: 'Infarto de la cerebral posterior: hemianopsia homónima contralateral con respeto macular (el polo occipital recibe también ramas de la cerebral media). En el hemisferio dominante con lesión del esplenio: alexia sin agrafia. Bilateral: ceguera cortical, a veces negada por el paciente (síndrome de Anton). Talamogeniculadas: síndrome de Dejerine-Roussy (pérdida sensitiva y luego dolor talámico contralateral).',
    perla: 'Hemianopsia con respeto macular: cerebral posterior. Cuadrantanopsia superior: asa de Meyer, en el temporal (cerebral media).',
    calibre: '≈ 2 mm, afinándose hacia distal',
  },

  // ═══════════════ PERFORANTES ═══════════════
  anteromediales: {
    id: 'anteromediales',
    nombre: 'Perforantes anteromediales',
    corto: 'Anteromediales',
    grupo: 'perforantes',
    sistema: 'anterior',
    territorio: 'aca',
    par: true,
    resumen: 'Perforantes finas que nacen de la comunicante anterior y de la A1 y entran por la sustancia perforada anterior y la lámina terminal.',
    origen: 'A1 y comunicante anterior.',
    trayecto: 'Ascienden por la sustancia perforada anterior y la lámina terminal hacia el hipotálamo.',
    ramas: [
      'Hipotalámicas anteriores',
      'Ramas al quiasma y a la lámina terminal',
      'Subcallosa (desde la comunicante anterior)',
    ],
    irriga: 'Hipotálamo anterior (área preóptica, núcleos supraóptico y paraventricular), quiasma, septum pellucidum y columnas del fórnix.',
    clinica: 'Su compromiso por vasoespasmo tras una hemorragia subaracnoidea o durante el clipaje causa amnesia anterógrada, confabulación, cambios de conducta y trastornos del sodio (diabetes insípida o SIADH).',
    perla: 'Buena parte del «síndrome de la comunicante anterior» tras la hemorragia sale de estas perforantes.',
    calibre: '< 0,5 mm',
  },
  lenticuloestriadas: {
    id: 'lenticuloestriadas',
    nombre: 'Arterias lenticuloestriadas',
    corto: 'Lenticuloestriadas',
    grupo: 'perforantes',
    sistema: 'anterior',
    territorio: 'acm',
    par: true,
    resumen: 'Perforantes finas que nacen en ángulo recto de la M1 y suben a los ganglios basales: las clásicas «arterias del ictus».',
    origen: 'Cara superior de la M1 (a veces de la M2 proximal).',
    trayecto: 'Penetran por la sustancia perforada anterior y ascienden en abanico a través del núcleo lenticular.',
    ramas: [
      'Mediales: globo pálido y cápsula interna',
      'Laterales: putamen, caudado y corona radiada',
    ],
    irriga: 'Putamen, globo pálido lateral, cuerpo del caudado, parte superior del brazo posterior de la cápsula interna y corona radiada.',
    clinica: 'Son terminales, finas y reciben de golpe la presión de la M1. Con la HTA crónica sufren lipohialinosis (infartos lacunares: hemiparesia motora pura, disartria-mano torpe) y forman microaneurismas de Charcot-Bouchard, cuya rotura causa la hemorragia hipertensiva típica del putamen.',
    perla: 'Hematoma en el putamen de un hipertenso: lenticuloestriada rota.',
    calibre: '≈ 0,1-0,5 mm',
  },
  talamoperforantes: {
    id: 'talamoperforantes',
    nombre: 'Arterias talamoperforantes',
    corto: 'Talamoperforantes',
    grupo: 'perforantes',
    sistema: 'posterior',
    territorio: 'acp',
    par: true,
    resumen: 'Perforantes posteromediales que nacen de la P1 y del ápex de la basilar y entran por la sustancia perforada posterior.',
    origen: 'P1 y ápex de la basilar.',
    trayecto: 'Ascienden por la fosa interpeduncular y la sustancia perforada posterior hacia el mesencéfalo y el tálamo.',
    ramas: [
      'Talámicas paramedianas',
      'Mesencefálicas paramedianas',
    ],
    irriga: 'Tálamo medial (núcleo dorsomedial e intralaminares), región subtalámica y mesencéfalo rostral (núcleos del III, formación reticular).',
    clinica: 'Infarto talámico paramediano: somnolencia o coma, parálisis de la mirada vertical y trastornos de memoria. Si todas nacen de un tronco único (arteria de Percheron), una sola oclusión infarta los dos tálamos.',
    perla: 'Infarto talámico bilateral y simétrico en la RM: piensa en la arteria de Percheron (ver Variantes).',
    calibre: '< 0,5 mm',
  },
  pontinas: {
    id: 'pontinas',
    nombre: 'Arterias pontinas',
    corto: 'Pontinas',
    grupo: 'perforantes',
    sistema: 'posterior',
    territorio: 'vb',
    par: true,
    resumen: 'Ramas cortas de la basilar que perforan la protuberancia.',
    origen: 'Todo el tronco de la basilar, a ambos lados.',
    trayecto: 'Las paramedianas penetran junto a la línea media; las circunferenciales cortas rodean la cara ventrolateral antes de entrar.',
    ramas: [
      'Paramedianas',
      'Circunferenciales cortas',
    ],
    irriga: 'Base de la protuberancia (fibras corticoespinales y corticobulbares, núcleos pontinos) y tegmento medial (lemnisco medial, núcleo del VI, fascículo longitudinal medial).',
    clinica: 'Infartos lacunares pontinos en hipertensos (hemiparesia motora pura, disartria-mano torpe, hemiparesia atáxica). Síndrome pontino medial: hemiplejia contralateral, pérdida de propiocepción contralateral y parálisis del VI ipsilateral.',
    perla: 'Paramedianas: medial y motor. Circunferenciales largas (AICA, SCA): lateral, sensitivo y cerebelo.',
    calibre: '< 0,5 mm',
  },
};

export const ARTERIA_LIST: Arteria[] = Object.values(ARTERIAS);

export function enSistema(a: Arteria, s: SistemaId): boolean {
  if (s === 'todo') return true;
  if (s === 'anillo') return a.grupo === 'anillo';
  return a.sistema === s;
}

// ── Territorios de irrigación (vista «Territorios») ──────────────────────────

export interface Territorio {
  id: TerritorioId;
  nombre: string;
  color: string;
  resumen: string;
  areas: string[];
  deficit: string;
}

export const TERRITORIOS: Record<TerritorioId, Territorio> = {
  aca: {
    id: 'aca',
    nombre: 'Cerebral anterior',
    color: '#3b82f6',
    resumen: 'Cara medial del hemisferio, de la frente al surco parietooccipital.',
    areas: [
      'Cara medial de los lóbulos frontal y parietal',
      'Franja parasagital de la convexidad (≈ 2 cm)',
      'Lobulillo paracentral: motor y sensitivo de la pierna y el pie, control cortical de la micción',
      'Cuatro quintos anteriores del cuerpo calloso y cíngulo',
      'Giro recto y orbitario medial',
      'Por Heubner: cabeza del caudado, putamen anterior y brazo anterior de la cápsula interna',
    ],
    deficit: 'Paresia e hipoestesia contralaterales de predominio en la pierna, incontinencia urinaria, abulia, reflejos de liberación frontal y, en el hemisferio dominante, afasia transcortical motora.',
  },
  acm: {
    id: 'acm',
    nombre: 'Cerebral media',
    color: '#16a34a',
    resumen: 'La convexidad lateral y los ganglios basales: el territorio más grande y el que más se infarta.',
    areas: [
      'Convexidad lateral de los lóbulos frontal, parietal y temporal',
      'Corteza motora y sensitiva de la cara y el brazo',
      'Áreas de Broca y de Wernicke (hemisferio dominante)',
      'Ínsula y opérculos',
      'Radiaciones ópticas (asa de Meyer)',
      'Por las lenticuloestriadas: putamen, globo pálido lateral, caudado, cápsula interna superior y corona radiada',
    ],
    deficit: 'Hemiparesia e hipoestesia contralaterales de cara y brazo, hemianopsia homónima, desviación de la mirada hacia la lesión y afasia (dominante) o heminegligencia (no dominante).',
  },
  acp: {
    id: 'acp',
    nombre: 'Cerebral posterior',
    color: '#8b5cf6',
    resumen: 'Lóbulo occipital, temporal inferomedial, tálamo y mesencéfalo.',
    areas: [
      'Lóbulo occipital y corteza visual primaria (cisura calcarina)',
      'Cara inferomedial del lóbulo temporal y parte del hipocampo',
      'Esplenio del cuerpo calloso',
      'Tálamo (paramediano, posterior y pulvinar) y cuerpos geniculados',
      'Mesencéfalo paramediano',
    ],
    deficit: 'Hemianopsia homónima contralateral con respeto macular, alexia sin agrafia (dominante), trastornos de memoria y síndrome talámico.',
  },
  coroidea: {
    id: 'coroidea',
    nombre: 'Coroidea anterior',
    color: '#ec4899',
    resumen: 'Un territorio pequeño y profundo, pero estratégico: la vía motora, la sensitiva y la visual pasan por él.',
    areas: [
      'Dos tercios inferiores del brazo posterior de la cápsula interna y segmento retrolenticular',
      'Cintilla óptica y parte del cuerpo geniculado lateral',
      'Globo pálido interno y cola del caudado',
      'Uncus, amígdala e hipocampo anterior',
      'Plexo coroideo del asta temporal',
    ],
    deficit: 'Hemiplejia, hemihipoestesia y hemianopsia homónima contralaterales.',
  },
  vb: {
    id: 'vb',
    nombre: 'Vertebrobasilar: tronco y cerebelo',
    color: '#f59e0b',
    resumen: 'Bulbo, protuberancia, mesencéfalo caudal, cerebelo y oído interno.',
    areas: [
      'Bulbo: medial (espinal anterior) y lateral (vertebral y PICA)',
      'Protuberancia: pontinas y AICA',
      'Cerebelo: cara inferior (PICA), anteroinferior (AICA) y superior (SCA)',
      'Oído interno (laberíntica)',
      'Médula cervical alta (espinales)',
    ],
    deficit: 'Signos «cruzados» (pares craneales del lado de la lesión y vías largas del otro), vértigo, diplopía, disartria, disfagia, ataxia y alteración de la conciencia.',
  },
  ojo: {
    id: 'ojo',
    nombre: 'Ocular (oftálmica)',
    color: '#06b6d4',
    resumen: 'El ojo y la órbita: la única parte del sistema carotídeo que se ve directamente, en el fondo de ojo.',
    areas: [
      'Retina interna (arteria central de la retina)',
      'Coroides y cabeza del nervio óptico (ciliares posteriores)',
      'Músculos extraoculares y glándula lagrimal',
      'Frente, párpados y mucosa nasal (anastomosis con la carótida externa)',
    ],
    deficit: 'Pérdida visual monocular ipsilateral, transitoria (amaurosis fugax) o permanente.',
  },
  conexion: {
    id: 'conexion',
    nombre: 'Troncos y comunicantes',
    color: '#94a3b8',
    resumen: 'Llevan y reparten el flujo; casi no tienen territorio cortical propio.',
    areas: [
      'Carótida interna terminal y comunicantes anterior y posterior',
      'Su función principal es la circulación colateral entre lados y entre sistemas',
      'Sus perforantes cortas irrigan quiasma, hipotálamo y tálamo anterior',
    ],
    deficit: 'La oclusión aislada de una comunicante suele pasar inadvertida si el polígono compensa; la oclusión de la carótida da un infarto de la cerebral media, a veces con la anterior.',
  },
};

export const TERRITORIO_LIST: Territorio[] = Object.values(TERRITORIOS);

// ── Referencias anatómicas (estructuras vecinas, se pueden ocultar) ──────────

export interface Referencia {
  id: ReferenciaId;
  nombre: string;
  color: string;
  desc: string;
}

export const REFERENCIAS: Record<ReferenciaId, Referencia> = {
  cerebro: {
    id: 'cerebro',
    nombre: 'Silueta del cerebro y el cerebelo',
    color: '#d9a79a',
    desc: 'Contorno translúcido del encéfalo a la misma escala que las arterias: el polígono es pequeño y se esconde en la base, en la cisterna supraselar, entre los lóbulos frontales, los temporales y el tronco. La cerebral media se mete en la cisura de Silvio, la cerebral anterior sube entre los hemisferios y la cerebral posterior va por encima del cerebelo hacia el occipital. Aléjate con la rueda para verlo entero.',
  },
  tronco: {
    id: 'tronco',
    nombre: 'Tronco del encéfalo',
    color: '#d9b8aa',
    desc: 'Mesencéfalo (pedúnculos cerebrales y fosa interpeduncular), protuberancia y bulbo. La basilar descansa en el surco basilar de la protuberancia y las vertebrales sobre la cara anterior del bulbo; las perforantes entran en él.',
  },
  optico: {
    id: 'optico',
    nombre: 'Nervios ópticos, quiasma y cintillas',
    color: '#efe2cc',
    desc: 'El polígono rodea el quiasma: las A1 pasan por encima de los nervios ópticos y la carótida queda a un lado del quiasma. Un aneurisma de la comunicante anterior o de la carótida supraclinoidea puede comprimirlos y dar defectos del campo visual.',
  },
  hipofisis: {
    id: 'hipofisis',
    nombre: 'Tallo hipofisario, hipófisis y cuerpos mamilares',
    color: '#e6b8a2',
    desc: 'El tallo hipofisario y el tuber cinereum quedan dentro del polígono; los cuerpos mamilares, detrás, entre las comunicantes posteriores. La hipófisis recibe las hipofisarias superiores (carótida supraclinoidea) y las inferiores (porción cavernosa).',
  },
  nervio3: {
    id: 'nervio3',
    nombre: 'Nervio oculomotor (III par)',
    color: '#f3e7c4',
    desc: 'Sale de la fosa interpeduncular, pasa entre la cerebral posterior y la cerebelosa superior y corre por debajo y a un lado de la comunicante posterior hacia el seno cavernoso. Por eso un aneurisma de la unión carótida-comunicante posterior lo comprime: ptosis, midriasis y ojo «abajo y afuera».',
  },
};

export const REFERENCIA_LIST: Referencia[] = Object.values(REFERENCIAS);
