/**
 * Hemograma completo (CBC) — datos del módulo educativo.
 *
 * La estructura, la nomenclatura y los rangos siguen el formato de reporte
 * peruano (el mismo del informe de referencia): secciones Hematíes / Plaquetas
 * / Leucocitos / diferencial porcentual / diferencial absoluto, con
 * «Abastonados» y «Segmentados» en vez de «neutrófilos en banda/segmentados»,
 * RDW separado en SD y CV, y la serie inmadura (blastos → metamielocitos)
 * explícita, que es lo que permite mostrar desviación izquierda y hiato
 * leucémico.
 *
 * ── Valores derivados, no escritos a mano ─────────────────────────────────
 * VCM, HCM, CHCM y los absolutos del diferencial se CALCULAN desde los
 * primarios (RBC, Hb, Hto, leucocitos, %). Verificado contra el reporte real:
 *   VCM  = Hto/RBC × 10  → 40.0/4.31 × 10 = 92.8
 *   HCM  = Hb /RBC × 10  → 14.0/4.31 × 10 = 32.5
 *   CHCM = Hb /Hto × 100 → 14.0/40.0 ×100 = 35.0
 * Así ningún escenario puede tener un VCM que contradiga su Hto y su RBC.
 *
 * ── Sobre los rangos ──────────────────────────────────────────────────────
 * Se respetan los del reporte salvo en tres casos donde su límite INFERIOR
 * marcaría como patológico un valor sano: abastonados [3-5], eosinófilos
 * [2-4] y eosinófilos absolutos [0.05-0.44]. Tener 0 % de abastonados o de
 * eosinófilos no es una enfermedad — lo que importa clínicamente es el techo.
 * En esos tres el mínimo se baja a 0 y el parámetro lo explica en su ficha.
 */

export type Grupo = 'hematies' | 'plaquetas' | 'leucocitos' | 'difPct' | 'difAbs';
export type Sexo = 'F' | 'M';
export type Estado = 'bajo' | 'normal' | 'alto';

export interface Rango {
  min: number;
  max: number;
}

export interface InfoParametro {
  /** Qué mide y por qué importa. */
  queMide: string;
  /** Traducción a lenguaje no técnico (botón «explícamelo simple»). */
  simple: string;
  alto: string[];
  bajo: string[];
  /** Dato curioso o perla clínica. */
  dato: string;
}

export interface Parametro {
  id: string;
  nombre: string;
  abrev: string;
  unidad: string;
  grupo: Grupo;
  decimales: number;
  /** Rango de referencia. Si cambia por sexo se usan rangoF / rangoM. */
  rango: Rango;
  rangoF?: Rango;
  rangoM?: Rango;
  /** Dominio del termómetro. Fijo por parámetro para que la franja normal
   *  no cambie de sitio al cambiar de escenario (si no, comparar es inútil). */
  escala: Rango;
  /** Calculado desde otros parámetros; la ficha muestra la fórmula. */
  formula?: string;
  /** Serie inmadura: normal es 0; cualquier valor > 0 es un hallazgo. */
  ceroEsNormal?: boolean;
  opcional?: boolean;
}

/* ────────────────────────────────────────────────────────────────────────
   SERIE ROJA
   ──────────────────────────────────────────────────────────────────────── */

export const PARAMETROS: Parametro[] = [
  {
    id: 'rbc',
    nombre: 'Recuento de Hematíes',
    abrev: 'RBC',
    unidad: '10⁶/µL',
    grupo: 'hematies',
    decimales: 2,
    rango: { min: 4.1, max: 5.1 },
    rangoF: { min: 4.1, max: 5.1 },
    rangoM: { min: 4.5, max: 5.9 },
    escala: { min: 2, max: 7 },
  },
  {
    id: 'hb',
    nombre: 'Hemoglobina',
    abrev: 'Hb',
    unidad: 'g/dL',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 12.3, max: 15.5 },
    rangoF: { min: 12.3, max: 15.5 },
    rangoM: { min: 13.5, max: 17.5 },
    escala: { min: 5, max: 20 },
  },
  {
    id: 'hto',
    nombre: 'Hematocrito',
    abrev: 'Hto',
    unidad: '%',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 36, max: 46 },
    rangoF: { min: 36, max: 46 },
    rangoM: { min: 41, max: 53 },
    escala: { min: 15, max: 60 },
  },
  {
    id: 'vcm',
    nombre: 'Volumen Corpuscular Medio',
    abrev: 'VCM',
    unidad: 'fL',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 80, max: 96 },
    escala: { min: 55, max: 125 },
    formula: 'Hto ÷ RBC × 10',
  },
  {
    id: 'hcm',
    nombre: 'Hemoglobina Corpuscular Media',
    abrev: 'HCM',
    unidad: 'pg',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 28, max: 33 },
    escala: { min: 15, max: 40 },
    formula: 'Hb ÷ RBC × 10',
  },
  {
    id: 'chcm',
    nombre: 'Concentración de Hemoglobina Corpuscular',
    abrev: 'CHCM',
    unidad: 'g/dL',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 33, max: 36 },
    escala: { min: 25, max: 40 },
    formula: 'Hb ÷ Hto × 100',
  },
  {
    id: 'rdwSd',
    nombre: 'Índice de Distribución Eritrocitaria (SD)',
    abrev: 'RDW-SD',
    unidad: 'fL',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 35, max: 74 },
    escala: { min: 30, max: 85 },
  },
  {
    id: 'rdwCv',
    nombre: 'Índice de Distribución Eritrocitaria (CV)',
    abrev: 'RDW-CV',
    unidad: '%',
    grupo: 'hematies',
    decimales: 1,
    rango: { min: 11, max: 16 },
    escala: { min: 10, max: 25 },
  },

  /* ── PLAQUETAS ── */
  {
    id: 'plaquetas',
    nombre: 'Recuento de Plaquetas',
    abrev: 'PLT',
    unidad: '10³/µL',
    grupo: 'plaquetas',
    decimales: 0,
    rango: { min: 154, max: 386 },
    escala: { min: 0, max: 600 },
  },
  {
    id: 'vpm',
    nombre: 'Volumen Plaquetario Medio',
    abrev: 'VPM',
    unidad: 'fL',
    grupo: 'plaquetas',
    decimales: 1,
    rango: { min: 6.5, max: 11 },
    escala: { min: 5, max: 14 },
    opcional: true,
  },

  /* ── LEUCOCITOS ── */
  {
    id: 'leucocitos',
    nombre: 'Recuento de Leucocitos',
    abrev: 'WBC',
    unidad: '10³/µL',
    grupo: 'leucocitos',
    decimales: 2,
    rango: { min: 4.4, max: 11.3 },
    escala: { min: 0, max: 25 },
  },

  /* ── DIFERENCIAL PORCENTUAL ── */
  {
    id: 'blastos',
    nombre: 'Blastos',
    abrev: 'Blastos',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 0, max: 0 },
    escala: { min: 0, max: 100 },
    ceroEsNormal: true,
  },
  {
    id: 'promielocitos',
    nombre: 'Promielocitos',
    abrev: 'Promiel.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 0, max: 0 },
    escala: { min: 0, max: 20 },
    ceroEsNormal: true,
  },
  {
    id: 'mielocitos',
    nombre: 'Mielocitos',
    abrev: 'Miel.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 0, max: 0 },
    escala: { min: 0, max: 20 },
    ceroEsNormal: true,
  },
  {
    id: 'metamielocitos',
    nombre: 'Metamielocitos',
    abrev: 'Metamiel.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 0, max: 0 },
    escala: { min: 0, max: 20 },
    ceroEsNormal: true,
  },
  {
    id: 'abastonados',
    nombre: 'Abastonados',
    abrev: 'Abast.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    // El reporte imprime [3-5]; se usa 0 como piso porque 0 % de abastonados
    // no es patológico (ver cabecera del archivo).
    rango: { min: 0, max: 5 },
    escala: { min: 0, max: 20 },
  },
  {
    id: 'segmentados',
    nombre: 'Segmentados',
    abrev: 'Seg.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 50, max: 70 },
    escala: { min: 0, max: 100 },
  },
  {
    id: 'eosinofilos',
    nombre: 'Eosinófilos',
    abrev: 'Eos.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 0, max: 5 },
    escala: { min: 0, max: 40 },
  },
  {
    id: 'basofilos',
    nombre: 'Basófilos',
    abrev: 'Bas.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 1,
    rango: { min: 0, max: 1 },
    escala: { min: 0, max: 5 },
  },
  {
    id: 'monocitos',
    nombre: 'Monocitos',
    abrev: 'Mono.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 2, max: 8 },
    escala: { min: 0, max: 20 },
  },
  {
    id: 'linfocitos',
    nombre: 'Linfocitos',
    abrev: 'Linf.',
    unidad: '%',
    grupo: 'difPct',
    decimales: 0,
    rango: { min: 25, max: 40 },
    escala: { min: 0, max: 100 },
  },

  /* ── DIFERENCIAL ABSOLUTO (derivado: % × WBC ÷ 100) ── */
  {
    id: 'abastonadosAbs',
    nombre: 'Abastonados',
    abrev: 'Abast. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 0, max: 0.55 },
    escala: { min: 0, max: 3 },
    formula: '% Abastonados × WBC ÷ 100',
  },
  {
    id: 'segmentadosAbs',
    nombre: 'Segmentados',
    abrev: 'Seg. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 1.8, max: 7.7 },
    escala: { min: 0, max: 20 },
    formula: '% Segmentados × WBC ÷ 100',
  },
  {
    id: 'eosinofilosAbs',
    nombre: 'Eosinófilos',
    abrev: 'Eos. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 0, max: 0.5 },
    escala: { min: 0, max: 5 },
    formula: '% Eosinófilos × WBC ÷ 100',
  },
  {
    id: 'basofilosAbs',
    nombre: 'Basófilos',
    abrev: 'Bas. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 0, max: 0.22 },
    escala: { min: 0, max: 1 },
    formula: '% Basófilos × WBC ÷ 100',
  },
  {
    id: 'monocitosAbs',
    nombre: 'Monocitos',
    abrev: 'Mono. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 0.09, max: 1.21 },
    escala: { min: 0, max: 3 },
    formula: '% Monocitos × WBC ÷ 100',
  },
  {
    id: 'linfocitosAbs',
    nombre: 'Linfocitos',
    abrev: 'Linf. #',
    unidad: '10³/µL',
    grupo: 'difAbs',
    decimales: 2,
    rango: { min: 0.81, max: 4.62 },
    escala: { min: 0, max: 15 },
    formula: '% Linfocitos × WBC ÷ 100',
  },
];

export const PARAM_POR_ID: Record<string, Parametro> = Object.fromEntries(
  PARAMETROS.map((p) => [p.id, p]),
);

export const GRUPOS: { id: Grupo; titulo: string; desc: string }[] = [
  { id: 'hematies',   titulo: 'Hematíes',  desc: 'Serie roja: transporte de oxígeno' },
  { id: 'leucocitos', titulo: 'Leucocitos', desc: 'Serie blanca: defensa' },
  { id: 'difPct',     titulo: 'Recuento diferencial porcentual', desc: 'Qué proporción de los leucocitos es cada tipo' },
  { id: 'difAbs',     titulo: 'Recuento diferencial absoluto',   desc: 'Cuántas células hay de verdad — es el que decide' },
  { id: 'plaquetas',  titulo: 'Plaquetas', desc: 'Hemostasia: taponan el vaso roto' },
];

/* ────────────────────────────────────────────────────────────────────────
   FICHAS EDUCATIVAS
   ──────────────────────────────────────────────────────────────────────── */

export const INFO: Record<string, InfoParametro> = {
  rbc: {
    queMide: 'Cuántos glóbulos rojos hay por microlitro de sangre. Es el recuento en bruto: no dice si son grandes, pequeños o si llevan poca hemoglobina.',
    simple: 'El número de "camiones" que reparten oxígeno por tu cuerpo.',
    alto: ['Deshidratación (parece alto porque hay menos plasma)', 'Vivir en altura (Cusco, Puno, Junín)', 'Tabaquismo crónico', 'Policitemia vera', 'Enfermedad pulmonar crónica'],
    bajo: ['Anemia de cualquier causa', 'Sangrado agudo o crónico', 'Déficit de hierro, B12 o folato', 'Enfermedad renal crónica (falta eritropoyetina)', 'Hemólisis'],
    dato: 'En el Perú, la altura cambia los rangos: a más de 2 500 m se aceptan valores más altos como normales. Un hemograma de Cusco no se lee con la tabla de Lima.',
  },
  hb: {
    queMide: 'La cantidad de hemoglobina por decilitro de sangre. Es el parámetro que define la anemia — no el recuento de hematíes.',
    simple: 'Cuánto oxígeno puede cargar tu sangre. Si está baja, te cansas y te falta el aire.',
    alto: ['Deshidratación', 'Vivir en altura', 'Policitemia vera', 'EPOC / hipoxia crónica'],
    bajo: ['Ferropenia (la causa más común del mundo)', 'Sangrado', 'Déficit de B12 o folato', 'Enfermedad crónica o renal', 'Talasemia y otras hemoglobinopatías'],
    dato: 'La OMS define anemia con Hb < 12 g/dL en mujeres y < 13 g/dL en varones. La anemia es un signo, nunca un diagnóstico: siempre hay que buscar la causa.',
  },
  hto: {
    queMide: 'Qué porcentaje del volumen de sangre ocupan los hematíes. Si centrifugas sangre, es la fracción roja del tubo.',
    simple: 'Qué tan "espesa" está la sangre por los glóbulos rojos.',
    alto: ['Deshidratación (hemoconcentración)', 'Altura', 'Fuga de plasma — clásico en dengue', 'Policitemia'],
    bajo: ['Anemia', 'Sangrado', 'Sobrehidratación o exceso de sueros'],
    dato: 'Regla rápida: el hematocrito es aproximadamente 3 × la hemoglobina. Si esa relación no cuadra, sospecha error de muestra.',
  },
  vcm: {
    queMide: 'El tamaño promedio de un glóbulo rojo. Es el parámetro que clasifica las anemias en microcíticas, normocíticas y macrocíticas.',
    simple: 'Si tus glóbulos rojos son chicos, normales o grandes.',
    alto: ['Déficit de B12 o folato (megaloblástica)', 'Alcoholismo', 'Hipotiroidismo', 'Enfermedad hepática', 'Reticulocitosis marcada'],
    bajo: ['Ferropenia', 'Talasemia', 'Anemia de enfermedad crónica (a veces)', 'Intoxicación por plomo'],
    dato: 'Es la primera bifurcación del algoritmo de anemias: con el VCM en la mano ya descartaste dos tercios de las causas.',
  },
  hcm: {
    queMide: 'Cuánta hemoglobina lleva en promedio cada glóbulo rojo, en picogramos. Suele moverse junto al VCM.',
    simple: 'Cuánto oxígeno carga cada camión individual.',
    alto: ['Anemia macrocítica (células grandes cargan más)', 'Falsamente alto si hay lipemia o hemólisis en el tubo'],
    bajo: ['Ferropenia', 'Talasemia', 'Anemias hipocrómicas en general'],
    dato: 'HCM baja e "hipocromía" son lo mismo visto desde dos lados: el número y el frotis. En la lámina se ve el centro pálido del hematíe más grande de lo normal.',
  },
  chcm: {
    queMide: 'La concentración de hemoglobina dentro del hematíe. A diferencia de la HCM, no depende del tamaño de la célula.',
    simple: 'Qué tan "lleno" está cada glóbulo rojo, sin importar si es grande o chico.',
    alto: ['Esferocitosis hereditaria (casi el único que la sube de verdad)', 'Deshidratación celular', 'Artefacto por hemólisis de la muestra'],
    bajo: ['Ferropenia', 'Talasemia', 'Anemia sideroblástica'],
    dato: 'Una CHCM > 36 g/dL casi siempre es esferocitosis o un error de la muestra. Es de los pocos parámetros con una lista corta de causas.',
  },
  rdwSd: {
    queMide: 'El ancho de la curva de distribución de tamaños, medido en femtolitros. Es una medida directa de cuán dispares son los hematíes entre sí.',
    simple: 'Qué tan distintos son de tamaño tus glóbulos rojos, medido en unidades absolutas.',
    alto: ['Anisocitosis marcada', 'Mezcla de poblaciones (por ejemplo tras transfundir)', 'Anemias carenciales en tratamiento'],
    bajo: ['Población muy uniforme — poco frecuente y rara vez significativo'],
    dato: 'El RDW-SD es menos sensible al VCM promedio que el CV, por eso muchos laboratorios reportan los dos.',
  },
  rdwCv: {
    queMide: 'La misma dispersión de tamaños pero como coeficiente de variación (%). Es el que se usa en los algoritmos clínicos.',
    simple: 'Si todos tus glóbulos rojos se parecen entre sí o hay de todos los tamaños.',
    alto: ['Ferropenia (sube ANTES que caiga la hemoglobina)', 'Déficit de B12 o folato', 'Anemias mixtas', 'Respuesta a tratamiento con hierro'],
    bajo: ['Talasemia menor: microcitosis pero población uniforme'],
    dato: 'Es la clave para separar ferropenia de talasemia: las dos dan VCM bajo, pero la ferropenia sube el RDW y la talasemia lo deja normal.',
  },
  plaquetas: {
    queMide: 'Cuántas plaquetas circulan por microlitro. Son fragmentos de megacariocitos y forman el tapón inicial cuando se rompe un vaso.',
    simple: 'Los "parches" que tapan las heridas por dentro. Pocas, sangras; muchas, se pueden formar coágulos.',
    alto: ['Trombocitosis reactiva por ferropenia, infección o inflamación', 'Post-esplenectomía', 'Trombocitemia esencial'],
    bajo: ['Dengue y otras virosis', 'PTI (púrpura trombocitopénica inmune)', 'Leucemia e infiltración medular', 'Hiperesplenismo', 'Fármacos (heparina, quinina)'],
    dato: 'Por debajo de 50 000 hay riesgo de sangrado con traumatismos; por debajo de 20 000, riesgo de sangrado espontáneo. En dengue es el parámetro que se sigue día a día.',
  },
  vpm: {
    queMide: 'El tamaño promedio de las plaquetas. Las plaquetas jóvenes son más grandes, así que informa sobre la producción medular.',
    simple: 'Si tus plaquetas son nuevas y grandes o viejas y chicas.',
    alto: ['Destrucción periférica: la médula compensa lanzando plaquetas jóvenes', 'PTI', 'Síndrome de Bernard-Soulier'],
    bajo: ['Falla de producción medular', 'Aplasia', 'Quimioterapia'],
    dato: 'Un VPM alto con plaquetas bajas apunta a destrucción periférica; un VPM bajo con plaquetas bajas apunta a que la médula no las está fabricando.',
  },
  leucocitos: {
    queMide: 'El total de glóbulos blancos. Por sí solo dice poco: lo informativo es el diferencial, o sea qué tipo de leucocito subió o bajó.',
    simple: 'El tamaño total de tu ejército de defensa.',
    alto: ['Infección bacteriana', 'Inflamación, estrés, corticoides', 'Leucemias', 'Ejercicio intenso o embarazo (leve)'],
    bajo: ['Infecciones virales (dengue, influenza)', 'Quimioterapia y fármacos', 'Aplasia medular', 'Hiperesplenismo', 'Sepsis grave (mal pronóstico)'],
    dato: 'Un leucocito total normal puede esconder una infección grave: si los segmentados suben y los linfocitos bajan en la misma proporción, el total no se mueve.',
  },
  blastos: {
    queMide: 'Células madre hematopoyéticas inmaduras. En sangre periférica su valor normal es cero: no deberían salir de la médula.',
    simple: 'Células "bebé" que nunca deberían estar en tu sangre.',
    alto: ['Leucemia aguda', 'Crisis blástica de leucemia mieloide crónica', 'Síndromes mielodisplásicos'],
    bajo: ['Cero es lo normal'],
    dato: 'Más de 20 % de blastos en sangre o médula define leucemia aguda según la OMS. Un solo blasto en el frotis obliga a revisar la lámina con un hematólogo.',
  },
  promielocitos: {
    queMide: 'Precursor mieloide inmaduro, un escalón por delante del blasto. No debería aparecer en sangre periférica.',
    simple: 'Otra célula inmadura que solo debería estar dentro del hueso.',
    alto: ['Leucemia promielocítica aguda (LPA, M3)', 'Reacción leucemoide intensa', 'Desviación izquierda extrema'],
    bajo: ['Cero es lo normal'],
    dato: 'La leucemia promielocítica aguda es una urgencia hematológica por su riesgo de coagulación intravascular diseminada, pero es la de mejor pronóstico si se trata a tiempo.',
  },
  mielocitos: {
    queMide: 'Precursor mieloide intermedio. Su aparición en sangre indica que la médula está expulsando células antes de tiempo.',
    simple: 'Célula "adolescente" que salió antes de estar lista.',
    alto: ['Infección bacteriana grave', 'Reacción leucemoide', 'Leucemia mieloide crónica', 'Mielofibrosis'],
    bajo: ['Cero es lo normal'],
    dato: 'Mielocitos + metamielocitos + abastonados juntos son lo que el clínico llama "desviación izquierda": la médula vaciando su reserva.',
  },
  metamielocitos: {
    queMide: 'Último precursor antes del abastonado. En sangre periférica su valor normal también es cero.',
    simple: 'Célula casi lista, pero todavía no debería andar circulando.',
    alto: ['Infección bacteriana severa', 'Sepsis', 'Reacción leucemoide', 'Trastornos mieloproliferativos'],
    bajo: ['Cero es lo normal'],
    dato: 'Si ves metamielocitos y mielocitos pero NO blastos, piensa primero en infección grave antes que en leucemia.',
  },
  abastonados: {
    queMide: 'Neutrófilos jóvenes, con el núcleo todavía en forma de bastón sin segmentar. Son la reserva que la médula suelta primero cuando hay demanda.',
    simple: 'Soldados recién reclutados que salen al campo antes de terminar el entrenamiento.',
    alto: ['Infección bacteriana aguda (desviación izquierda)', 'Sepsis', 'Inflamación aguda', 'Post-quirúrgico'],
    bajo: ['Tener 0 % no es una enfermedad: es lo habitual en una persona sana'],
    dato: 'El reporte de referencia imprime [3-5] %, pero un hemograma sano puede traer 0 % de abastonados sin ningún problema. Lo que importa es el techo: por encima de 5-10 % hay desviación izquierda.',
  },
  segmentados: {
    queMide: 'Neutrófilos maduros, con el núcleo ya segmentado en lóbulos. Son la primera línea contra bacterias y hongos.',
    simple: 'Los soldados veteranos que atacan bacterias.',
    alto: ['Infección bacteriana', 'Inflamación y necrosis tisular', 'Corticoides, estrés, ejercicio', 'Tabaquismo'],
    bajo: ['Infección viral', 'Quimioterapia', 'Agranulocitosis por fármacos', 'Déficit de B12 o folato'],
    dato: 'Neutrófilos con más de 5 lóbulos ("hipersegmentados") son un signo clásico de déficit de B12 o folato, y aparecen antes de que el VCM suba.',
  },
  eosinofilos: {
    queMide: 'Leucocitos especializados en parásitos multicelulares y en la respuesta alérgica. Sus gránulos son tóxicos para los helmintos.',
    simple: 'Los que se activan cuando tienes alergia o parásitos.',
    alto: ['Alergias: rinitis, asma, dermatitis', 'Parasitosis por helmintos', 'Fármacos', 'Síndrome hipereosinofílico', 'Insuficiencia suprarrenal'],
    bajo: ['Corticoides', 'Infección bacteriana aguda', 'Estrés — tener pocos no es patológico'],
    dato: 'Regla mnemotécnica de las causas: alergia, asma, parásitos, fármacos y neoplasias. En el Perú, ante eosinofilia siempre hay que descartar parasitosis intestinal.',
  },
  basofilos: {
    queMide: 'Los leucocitos menos abundantes. Liberan histamina y heparina; participan en la reacción alérgica inmediata.',
    simple: 'Los más raros de todos: sueltan histamina y te hacen picar.',
    alto: ['Leucemia mieloide crónica (dato muy sugerente)', 'Reacciones alérgicas', 'Hipotiroidismo', 'Trastornos mieloproliferativos'],
    bajo: ['Casi imposible de detectar porque su valor normal ya es cercano a cero'],
    dato: 'La basofilia persistente es una de las pocas pistas de leucemia mieloide crónica en un hemograma que por lo demás parece solo "leucocitosis".',
  },
  monocitos: {
    queMide: 'Precursores circulantes de los macrófagos. Salen a los tejidos, fagocitan y presentan antígenos a los linfocitos.',
    simple: 'Los "basureros" que se comen restos y microbios, y avisan al resto del sistema.',
    alto: ['Infecciones crónicas: tuberculosis, brucelosis', 'Fase de recuperación de una infección', 'Enfermedades autoinmunes', 'Leucemia mielomonocítica'],
    bajo: ['Aplasia medular', 'Corticoides', 'Tricoleucemia'],
    dato: 'La monocitosis en la convalecencia se llama "monocitosis de recuperación" y es buena señal: significa que la infección está cediendo.',
  },
  linfocitos: {
    queMide: 'Linfocitos B y T: la inmunidad específica. Producen anticuerpos y memoria inmunológica.',
    simple: 'La memoria del sistema inmune: recuerdan a los virus que ya viste.',
    alto: ['Infecciones virales', 'Mononucleosis infecciosa', 'Tos ferina', 'Leucemia linfática crónica', 'Tuberculosis'],
    bajo: ['VIH', 'Corticoides', 'Sepsis grave', 'Quimioterapia y radioterapia', 'Desnutrición'],
    dato: 'En niños pequeños el predominio normal es linfocitario, al revés que en adultos. Un hemograma pediátrico con 60 % de linfocitos puede ser perfectamente normal.',
  },
  abastonadosAbs: {
    queMide: 'El número real de abastonados por microlitro, no su proporción.',
    simple: 'Cuántos soldados novatos hay de verdad, no el porcentaje.',
    alto: ['Infección bacteriana aguda', 'Sepsis'],
    bajo: ['Cero o casi cero es lo normal'],
    dato: 'El valor absoluto evita el engaño del porcentaje: 10 % de abastonados sobre 3 000 leucocitos es mucho menos grave que 10 % sobre 25 000.',
  },
  segmentadosAbs: {
    queMide: 'El número real de neutrófilos maduros por microlitro. Es el que define neutropenia y su gravedad.',
    simple: 'Cuántos soldados veteranos tienes de verdad.',
    alto: ['Infección bacteriana', 'Inflamación', 'Corticoides'],
    bajo: ['Neutropenia por quimioterapia', 'Agranulocitosis', 'Infección viral'],
    dato: 'Por debajo de 500/µL hay neutropenia severa y riesgo de infección grave: es el umbral que obliga a aislamiento y antibiótico ante cualquier fiebre.',
  },
  eosinofilosAbs: {
    queMide: 'El número real de eosinófilos por microlitro. Es el criterio formal de eosinofilia, no el porcentaje.',
    simple: 'Cuántas células de alergia/parásitos hay realmente.',
    alto: ['Parasitosis', 'Alergia', 'Fármacos', 'Neoplasias'],
    bajo: ['Corticoides — no tiene relevancia clínica'],
    dato: 'La eosinofilia se define por el absoluto: leve 500-1 500, moderada 1 500-5 000 y severa por encima de 5 000/µL.',
  },
  basofilosAbs: {
    queMide: 'El número real de basófilos por microlitro.',
    simple: 'Cuántos basófilos hay de verdad.',
    alto: ['Leucemia mieloide crónica', 'Trastornos mieloproliferativos'],
    bajo: ['Sin relevancia clínica'],
    dato: 'Es el leucocito menos abundante: representa menos del 1 % del total, así que su porcentaje es muy poco fiable y el absoluto manda.',
  },
  monocitosAbs: {
    queMide: 'El número real de monocitos por microlitro. Define monocitosis por encima de 1 000/µL.',
    simple: 'Cuántos "basureros" hay realmente.',
    alto: ['Tuberculosis', 'Infección crónica', 'Recuperación de infección', 'Leucemia mielomonocítica crónica'],
    bajo: ['Aplasia', 'Corticoides'],
    dato: 'Una monocitosis absoluta persistente por encima de 1 000/µL en un adulto mayor obliga a descartar leucemia mielomonocítica crónica.',
  },
  linfocitosAbs: {
    queMide: 'El número real de linfocitos por microlitro. Es el que se usa para definir linfocitosis y linfopenia.',
    simple: 'Cuántas células de memoria inmune tienes de verdad.',
    alto: ['Mononucleosis', 'Tos ferina', 'Leucemia linfática crónica', 'Infecciones virales'],
    bajo: ['VIH', 'Corticoides', 'Sepsis', 'Desnutrición'],
    dato: 'Una linfopenia por debajo de 1 000/µL mantenida obliga a descartar VIH. Fue de hecho la pista con la que se describió el sida en 1981.',
  },
};

/* ────────────────────────────────────────────────────────────────────────
   ESCENARIOS
   ──────────────────────────────────────────────────────────────────────── */

export interface ValoresBase {
  rbc: number;
  hb: number;
  hto: number;
  rdwSd: number;
  rdwCv: number;
  plaquetas: number;
  vpm: number;
  leucocitos: number;
  /** Diferencial en %. Debe sumar 100. */
  blastos: number;
  promielocitos: number;
  mielocitos: number;
  metamielocitos: number;
  abastonados: number;
  segmentados: number;
  eosinofilos: number;
  basofilos: number;
  monocitos: number;
  linfocitos: number;
}

export interface Escenario {
  id: string;
  nombre: string;
  /** Etiqueta corta para chips y comparación. */
  corto: string;
  /** Viñeta clínica de una línea. */
  vineta: string;
  /** Qué buscar en este hemograma (lenguaje técnico). */
  claves: string[];
  /** Traducción llana para el botón «explícamelo simple». */
  simple: string;
  /** Requiere disclaimer reforzado. */
  sensible?: boolean;
  valores: ValoresBase;
}

export const ESCENARIOS: Escenario[] = [
  {
    id: 'sano',
    nombre: 'Persona sana',
    corto: 'Sano',
    vineta: 'Mujer de 28 años, chequeo anual, sin síntomas.',
    claves: [
      'Las tres series dentro de rango',
      'Predominio de segmentados sobre linfocitos, como corresponde a un adulto',
      'Sin formas inmaduras en sangre periférica',
    ],
    simple: 'Todo está donde debería estar. Este es el punto de comparación para el resto de escenarios.',
    valores: {
      rbc: 4.31, hb: 14.0, hto: 40.0, rdwSd: 44.3, rdwCv: 13.0,
      plaquetas: 341, vpm: 9.2, leucocitos: 7.27,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 3, segmentados: 58, eosinofilos: 2, basofilos: 0.5,
      monocitos: 6, linfocitos: 30.5,
    },
  },
  {
    id: 'viral',
    nombre: 'Infección viral leve (resfriado)',
    corto: 'Viral',
    vineta: 'Varón de 22 años, 3 días de rinorrea, odinofagia y febrícula.',
    claves: [
      'Leucocitos normales o discretamente bajos — NO hay leucocitosis',
      'Linfocitosis relativa: los linfocitos pasan a ser mayoría',
      'Neutropenia relativa, sin desviación izquierda',
      'Índice neutrófilo/linfocito bajo (< 2)',
    ],
    simple: 'Un virus no dispara el número total de defensas; cambia quién manda. Aquí los linfocitos —los que pelean contra virus— se vuelven mayoría.',
    valores: {
      rbc: 4.35, hb: 13.8, hto: 40.5, rdwSd: 44.0, rdwCv: 13.0,
      plaquetas: 260, vpm: 9.5, leucocitos: 5.2,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 1, segmentados: 38, eosinofilos: 2, basofilos: 0.5,
      monocitos: 8, linfocitos: 50.5,
    },
  },
  {
    id: 'bacteriana',
    nombre: 'Infección bacteriana',
    corto: 'Bacteriana',
    vineta: 'Mujer de 45 años, fiebre alta, tos productiva y dolor pleurítico.',
    claves: [
      'Leucocitosis marcada (18 500/µL)',
      'Neutrofilia con desviación izquierda: abastonados 12 % y metamielocitos presentes',
      'Linfopenia relativa',
      'Índice N/L muy alto (> 10)',
      'Trombocitosis reactiva',
    ],
    simple: 'Una bacteria sí dispara el total de defensas. La médula manda todo lo que tiene, incluso soldados a medio entrenar (los abastonados).',
    valores: {
      rbc: 4.40, hb: 13.5, hto: 39.5, rdwSd: 44.5, rdwCv: 13.2,
      plaquetas: 420, vpm: 9.0, leucocitos: 18.5,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 1,
      abastonados: 12, segmentados: 74, eosinofilos: 0, basofilos: 0,
      monocitos: 6, linfocitos: 7,
    },
  },
  {
    id: 'ferropenica',
    nombre: 'Anemia ferropénica',
    corto: 'Ferropénica',
    vineta: 'Mujer de 34 años, cansancio de meses, menstruaciones abundantes.',
    claves: [
      'Anemia con Hb 8.2 g/dL',
      'VCM bajo (microcítica) y HCM baja (hipocrómica)',
      'RDW alto: población muy dispar de tamaños',
      'Trombocitosis reactiva, típica de la ferropenia',
    ],
    simple: 'Falta hierro, así que la fábrica produce glóbulos rojos chicos y pálidos. Como los va haciendo peor con el tiempo, quedan de todos los tamaños mezclados.',
    valores: {
      rbc: 4.10, hb: 8.2, hto: 27.0, rdwSd: 58.0, rdwCv: 18.5,
      plaquetas: 465, vpm: 8.8, leucocitos: 6.8,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 3, segmentados: 58, eosinofilos: 2, basofilos: 0.5,
      monocitos: 6, linfocitos: 30.5,
    },
  },
  {
    id: 'megaloblastica',
    nombre: 'Anemia megaloblástica (B12 / folato)',
    corto: 'Megaloblást.',
    vineta: 'Varón de 62 años, vegetariano estricto, parestesias en pies y anemia.',
    claves: [
      'VCM muy alto (macrocítica)',
      'RDW alto',
      'Pancitopenia leve: también bajan leucocitos y plaquetas',
      'En el frotis: neutrófilos hipersegmentados (no se ven en el número)',
    ],
    simple: 'Sin B12 o folato la célula no puede terminar de dividirse, así que crece de más y sale gigante. Y como falla toda la médula, bajan también las otras series.',
    valores: {
      rbc: 2.80, hb: 9.5, hto: 30.0, rdwSd: 68.0, rdwCv: 19.0,
      plaquetas: 135, vpm: 10.5, leucocitos: 3.6,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 2, segmentados: 55, eosinofilos: 2, basofilos: 0.5,
      monocitos: 7, linfocitos: 33.5,
    },
  },
  {
    id: 'alergia',
    nombre: 'Alergia (rinitis / asma)',
    corto: 'Alergia',
    vineta: 'Adolescente de 16 años, estornudos, prurito nasal y sibilancias estacionales.',
    claves: [
      'Eosinofilia: 15 % y absoluto por encima de 1 000/µL',
      'Basófilos en el límite alto',
      'Serie roja y plaquetas intactas',
      'Leucocitos totales apenas elevados',
    ],
    simple: 'La alergia despierta un tipo concreto de defensa: los eosinófilos. El resto del hemograma no se entera.',
    valores: {
      rbc: 4.50, hb: 13.9, hto: 41.0, rdwSd: 43.0, rdwCv: 12.8,
      plaquetas: 290, vpm: 9.3, leucocitos: 8.9,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 2, segmentados: 45, eosinofilos: 15, basofilos: 1.5,
      monocitos: 6, linfocitos: 30.5,
    },
  },
  {
    id: 'mononucleosis',
    nombre: 'Mononucleosis infecciosa',
    corto: 'Mononucl.',
    vineta: 'Estudiante de 19 años, fiebre prolongada, faringitis, adenopatías y esplenomegalia.',
    claves: [
      'Linfocitosis marcada: 69 % y absoluto > 11 000/µL',
      'Leucocitosis a expensas de linfocitos, no de neutrófilos',
      'Trombocitopenia leve',
      'En el frotis: linfocitos atípicos de Downey (no aparecen como número)',
    ],
    simple: 'El virus de Epstein-Barr multiplica los linfocitos. Sube el total de blancos, pero por la vía viral, no la bacteriana.',
    valores: {
      rbc: 4.40, hb: 13.6, hto: 40.0, rdwSd: 44.0, rdwCv: 13.0,
      plaquetas: 145, vpm: 10.0, leucocitos: 16.5,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 1, segmentados: 20, eosinofilos: 1, basofilos: 0.5,
      monocitos: 8, linfocitos: 69.5,
    },
  },
  {
    id: 'deshidratacion',
    nombre: 'Deshidratación',
    corto: 'Deshidrat.',
    vineta: 'Varón de 30 años, 2 días de diarrea, mucosas secas y oliguria.',
    claves: [
      'RBC, Hb y Hto altos por hemoconcentración',
      'VCM, HCM y CHCM NORMALES: las células no cambiaron, cambió el plasma',
      'Leucocitosis leve por desmarginación',
      'Todo se corrige al hidratar',
    ],
    simple: 'No tienes más glóbulos rojos: tienes menos agua. Es la misma cantidad de células en menos líquido, así que la concentración sale alta.',
    valores: {
      rbc: 5.60, hb: 17.2, hto: 51.0, rdwSd: 44.0, rdwCv: 13.0,
      plaquetas: 410, vpm: 9.4, leucocitos: 11.8,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 3, segmentados: 62, eosinofilos: 2, basofilos: 0.5,
      monocitos: 6, linfocitos: 26.5,
    },
  },
  {
    id: 'dengue',
    nombre: 'Dengue',
    corto: 'Dengue',
    vineta: 'Varón de 27 años en Iquitos, 5 días de fiebre, mialgias y exantema.',
    claves: [
      'Trombocitopenia marcada (45 000/µL) — el parámetro que se sigue día a día',
      'Leucopenia (2 800/µL)',
      'Hematocrito alto por fuga plasmática, no por deshidratación',
      'Linfocitosis relativa y monocitosis',
    ],
    simple: 'La tríada del dengue: pocas plaquetas, pocos glóbulos blancos y la sangre "espesa" porque el plasma se está escapando de los vasos.',
    valores: {
      rbc: 5.10, hb: 15.8, hto: 47.0, rdwSd: 44.0, rdwCv: 13.1,
      plaquetas: 45, vpm: 11.5, leucocitos: 2.8,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 2, segmentados: 40, eosinofilos: 0, basofilos: 0.5,
      monocitos: 10, linfocitos: 47.5,
    },
  },
  {
    id: 'parasitosis',
    nombre: 'Infección parasitaria (helmintos)',
    corto: 'Parásitos',
    vineta: 'Niño de 9 años de zona rural, dolor abdominal, prurito anal y anemia.',
    claves: [
      'Eosinofilia marcada: 32 % con absoluto > 4 000/µL',
      'Anemia leve normocítica por pérdida crónica',
      'Leucocitosis moderada a expensas de eosinófilos',
    ],
    simple: 'Los eosinófilos son la defensa específica contra gusanos. Cuando se disparan tanto, el parásito es la primera sospecha.',
    valores: {
      rbc: 4.15, hb: 11.5, hto: 35.0, rdwSd: 47.0, rdwCv: 14.5,
      plaquetas: 320, vpm: 9.1, leucocitos: 13.5,
      blastos: 0, promielocitos: 0, mielocitos: 0, metamielocitos: 0,
      abastonados: 2, segmentados: 38, eosinofilos: 32, basofilos: 1,
      monocitos: 6, linfocitos: 21,
    },
  },
  {
    id: 'leucemia',
    nombre: 'Leucemia aguda',
    corto: 'Leucemia',
    vineta: 'Varón de 24 años, astenia, fiebre, equimosis y adenopatías de 3 semanas.',
    sensible: true,
    claves: [
      'Blastos 72 % en sangre periférica — normal es 0 %',
      'Hiato leucémico: muchos blastos y casi ninguna forma intermedia',
      'Anemia y trombocitopenia severas por ocupación medular',
      'Leucocitosis extrema (62 000/µL)',
    ],
    simple: 'La médula se llenó de células inmaduras que no sirven para defender y además desplazan a las demás. Por eso hay anemia y sangrado a la vez.',
    valores: {
      rbc: 2.60, hb: 7.8, hto: 23.0, rdwSd: 52.0, rdwCv: 16.5,
      plaquetas: 28, vpm: 8.5, leucocitos: 62.0,
      blastos: 72, promielocitos: 2, mielocitos: 1, metamielocitos: 0,
      abastonados: 1, segmentados: 12, eosinofilos: 0, basofilos: 0,
      monocitos: 3, linfocitos: 9,
    },
  },
];

export const ESCENARIO_POR_ID: Record<string, Escenario> = Object.fromEntries(
  ESCENARIOS.map((e) => [e.id, e]),
);

/* ────────────────────────────────────────────────────────────────────────
   CAPA PEDAGÓGICA: qué mirar en cada caso
   Va aparte de los valores clínicos a propósito — es la respuesta a «dónde
   pongo los ojos», no «cuánto vale». Tenerla en una tabla junta permite
   auditarla de un vistazo en vez de perseguirla por 11 objetos.
   ──────────────────────────────────────────────────────────────────────── */

/** Acento por escenario. Tiñe los parámetros determinantes de ese caso. */
export const ACENTO: Record<string, string> = {
  sano:           '#0f9d76',
  viral:          '#3b9edd',
  bacteriana:     '#e8734a',
  ferropenica:    '#d97706',
  megaloblastica: '#8b5cf6',
  alergia:        '#10b981',
  mononucleosis:  '#ec4899',
  deshidratacion: '#06b6d4',
  dengue:         '#dc2626',
  parasitosis:    '#65a30d',
  leucemia:       '#6366f1',
};

/**
 * Parámetros que DEFINEN cada patrón — los que un clínico mira primero.
 *
 * Ojo: determinante ≠ alterado. En deshidratación el VCM entra en la lista
 * justamente porque está NORMAL: es lo que demuestra que no hay más hematíes
 * sino menos plasma. Por eso el destaque es independiente del estado.
 */
export const DETERMINANTES: Record<string, string[]> = {
  sano: [],
  viral: ['leucocitos', 'linfocitos', 'segmentados', 'linfocitosAbs'],
  bacteriana: ['leucocitos', 'segmentados', 'abastonados', 'metamielocitos', 'segmentadosAbs'],
  ferropenica: ['hb', 'vcm', 'hcm', 'rdwCv', 'plaquetas'],
  megaloblastica: ['vcm', 'hb', 'rbc', 'leucocitos', 'plaquetas'],
  alergia: ['eosinofilos', 'eosinofilosAbs', 'basofilos'],
  mononucleosis: ['linfocitos', 'linfocitosAbs', 'leucocitos', 'plaquetas'],
  // El VCM normal es el hallazgo clave: descarta que sea poliglobulia real.
  deshidratacion: ['hto', 'hb', 'rbc', 'vcm', 'chcm'],
  dengue: ['plaquetas', 'leucocitos', 'hto'],
  parasitosis: ['eosinofilos', 'eosinofilosAbs', 'hb', 'leucocitos'],
  leucemia: ['blastos', 'promielocitos', 'hb', 'plaquetas', 'leucocitos'],
};

export const acentoDe = (id: string) => ACENTO[id] ?? '#8b5cf6';
export const esDeterminante = (escenarioId: string, paramId: string) =>
  (DETERMINANTES[escenarioId] ?? []).includes(paramId);

/* ── Resumen por serie, para el vistazo de cabecera ── */

export interface ResumenSerie {
  id: 'roja' | 'blanca' | 'plaquetas';
  titulo: string;
  /** Parámetro que representa la serie en el vistazo rápido. */
  principal: string;
  /** Todos los que se cuentan para «N alterados». */
  miembros: string[];
}

export const SERIES: ResumenSerie[] = [
  {
    id: 'roja',
    titulo: 'Serie roja',
    principal: 'hb',
    miembros: ['rbc', 'hb', 'hto', 'vcm', 'hcm', 'chcm', 'rdwSd', 'rdwCv'],
  },
  {
    id: 'blanca',
    titulo: 'Serie blanca',
    principal: 'leucocitos',
    miembros: [
      'leucocitos', 'blastos', 'promielocitos', 'mielocitos', 'metamielocitos',
      'abastonados', 'segmentados', 'eosinofilos', 'basofilos', 'monocitos', 'linfocitos',
    ],
  },
  {
    id: 'plaquetas',
    titulo: 'Plaquetas',
    principal: 'plaquetas',
    miembros: ['plaquetas', 'vpm'],
  },
];

/* ────────────────────────────────────────────────────────────────────────
   CÁLCULO
   ──────────────────────────────────────────────────────────────────────── */

export type Valores = Record<string, number>;

/** Redondea a los decimales que declara el parámetro. */
const round = (n: number, d: number) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

/**
 * Expande los primarios de un escenario a los 28 parámetros del reporte,
 * derivando índices eritrocitarios y absolutos del diferencial.
 */
export function calcularValores(base: ValoresBase): Valores {
  const v: Valores = {
    rbc: base.rbc,
    hb: base.hb,
    hto: base.hto,
    rdwSd: base.rdwSd,
    rdwCv: base.rdwCv,
    plaquetas: base.plaquetas,
    vpm: base.vpm,
    leucocitos: base.leucocitos,
    blastos: base.blastos,
    promielocitos: base.promielocitos,
    mielocitos: base.mielocitos,
    metamielocitos: base.metamielocitos,
    abastonados: base.abastonados,
    segmentados: base.segmentados,
    eosinofilos: base.eosinofilos,
    basofilos: base.basofilos,
    monocitos: base.monocitos,
    linfocitos: base.linfocitos,
  };

  // Índices eritrocitarios — verificados contra el reporte de referencia.
  v.vcm = round((base.hto / base.rbc) * 10, 1);
  v.hcm = round((base.hb / base.rbc) * 10, 1);
  v.chcm = round((base.hb / base.hto) * 100, 1);

  // Absolutos del diferencial: % × WBC ÷ 100.
  const abs = (pct: number) => round((pct * base.leucocitos) / 100, 2);
  v.abastonadosAbs = abs(base.abastonados);
  v.segmentadosAbs = abs(base.segmentados);
  v.eosinofilosAbs = abs(base.eosinofilos);
  v.basofilosAbs = abs(base.basofilos);
  v.monocitosAbs = abs(base.monocitos);
  v.linfocitosAbs = abs(base.linfocitos);

  return v;
}

/** Rango efectivo del parámetro para el sexo elegido. */
export function rangoDe(p: Parametro, sexo: Sexo): Rango {
  if (sexo === 'M' && p.rangoM) return p.rangoM;
  if (sexo === 'F' && p.rangoF) return p.rangoF;
  return p.rango;
}

/**
 * Presentación del estado. El glifo y la palabra son el segundo y tercer canal
 * además del color: sin ellos un daltónico rojo-verde no podría leer la tabla.
 */
export const GLIFO: Record<Estado, string> = { bajo: '▼', normal: '●', alto: '▲' };
export const PALABRA: Record<Estado, string> = { bajo: 'Bajo', normal: 'Normal', alto: 'Alto' };

export function estadoDe(valor: number, p: Parametro, sexo: Sexo): Estado {
  const r = rangoDe(p, sexo);
  if (p.ceroEsNormal) return valor > 0 ? 'alto' : 'normal';
  if (valor < r.min) return 'bajo';
  if (valor > r.max) return 'alto';
  return 'normal';
}

/**
 * Cuántos parámetros de una serie están fuera de rango. Alimenta el vistazo
 * de cabecera: permite ver que «la serie roja está tocada» sin leer 8 filas.
 */
export function alteradosDeSerie(serie: ResumenSerie, v: Valores, sexo: Sexo): number {
  return serie.miembros.filter((id) => {
    const p = PARAM_POR_ID[id];
    return p && estadoDe(v[id], p, sexo) !== 'normal';
  }).length;
}

/** Posición 0-1 del valor dentro de la escala del termómetro (clampada). */
export function posicionEnEscala(valor: number, p: Parametro): number {
  const { min, max } = p.escala;
  return Math.min(1, Math.max(0, (valor - min) / (max - min)));
}

/** ¿El valor se salió de la escala dibujable? */
export function fueraDeEscala(valor: number, p: Parametro): boolean {
  return valor > p.escala.max || valor < p.escala.min;
}

export const formatear = (valor: number, p: Parametro) => valor.toFixed(p.decimales);

/**
 * Índice neutrófilo/linfocito. Separa infección viral de bacteriana mejor que
 * el recuento total de leucocitos. Usa los absolutos, no los porcentajes.
 */
export function indiceNL(v: Valores): number {
  const neutros = (v.segmentadosAbs ?? 0) + (v.abastonadosAbs ?? 0);
  const linfos = v.linfocitosAbs ?? 0;
  if (linfos <= 0) return Infinity;
  return round(neutros / linfos, 2);
}

/**
 * El índice N/L solo orienta ante sospecha de infección aguda. Con blastos
 * circulantes no significa nada: la proporción está distorsionada por una
 * población clonal, y leer «sugiere viral» en una leucemia sería peligroso.
 */
export function nlInterpretable(v: Valores): boolean {
  return (v.blastos ?? 0) === 0;
}

export function interpretarNL(
  nl: number,
  v?: Valores,
): { texto: string; tono: 'bajo' | 'normal' | 'alto' } {
  if (v && !nlInterpretable(v)) {
    return { texto: 'No interpretable: hay blastos circulantes', tono: 'alto' };
  }
  if (!Number.isFinite(nl)) return { texto: 'No calculable (sin linfocitos)', tono: 'alto' };
  if (nl < 2) return { texto: 'Compatible con origen viral', tono: 'bajo' };
  if (nl <= 3) return { texto: 'Rango normal', tono: 'normal' };
  return { texto: 'Compatible con origen bacteriano o inflamación', tono: 'alto' };
}

/* ────────────────────────────────────────────────────────────────────────
   PATRONES COMBINADOS
   Lo que un clínico ve de un vistazo y ningún parámetro suelto dice.
   ──────────────────────────────────────────────────────────────────────── */

export interface Patron {
  id: string;
  titulo: string;
  detalle: string;
  gravedad: 'info' | 'aviso' | 'alerta';
  test: (v: Valores, sexo: Sexo) => boolean;
}

const bajo = (v: Valores, id: string, sexo: Sexo) => estadoDe(v[id], PARAM_POR_ID[id], sexo) === 'bajo';
const alto = (v: Valores, id: string, sexo: Sexo) => estadoDe(v[id], PARAM_POR_ID[id], sexo) === 'alto';

export const PATRONES: Patron[] = [
  {
    id: 'blastos',
    titulo: 'Blastos en sangre periférica',
    detalle: 'Hay células inmaduras circulando, algo que no ocurre en una persona sana. Obliga a revisar el frotis y derivar a hematología con urgencia.',
    gravedad: 'alerta',
    test: (v) => v.blastos > 0,
  },
  {
    id: 'ferropenica',
    titulo: 'Patrón sugerente de anemia ferropénica',
    detalle: 'Hemoglobina baja + VCM bajo + RDW alto. La microcitosis con anisocitosis marcada apunta a déficit de hierro; confirmar con ferritina.',
    gravedad: 'aviso',
    test: (v, s) => bajo(v, 'hb', s) && bajo(v, 'vcm', s) && alto(v, 'rdwCv', s),
  },
  {
    id: 'talasemia',
    titulo: 'Microcitosis con RDW normal',
    detalle: 'VCM bajo pero población uniforme. A diferencia de la ferropenia, sugiere talasemia menor: pedir electroforesis de hemoglobina.',
    gravedad: 'info',
    test: (v, s) => bajo(v, 'vcm', s) && !alto(v, 'rdwCv', s),
  },
  {
    id: 'megaloblastica',
    titulo: 'Patrón sugerente de anemia megaloblástica',
    detalle: 'Anemia con VCM alto. Buscar déficit de B12 o folato y revisar el frotis en busca de neutrófilos hipersegmentados.',
    gravedad: 'aviso',
    test: (v, s) => bajo(v, 'hb', s) && alto(v, 'vcm', s),
  },
  {
    id: 'hiato',
    titulo: 'Hiato leucémico',
    detalle: 'Muchos blastos y casi ninguna forma intermedia. Es lo que separa una leucemia aguda de una reacción leucemoide, donde sí aparecen todos los escalones de maduración.',
    gravedad: 'alerta',
    test: (v) => v.blastos > 20 && v.mielocitos + v.metamielocitos + v.promielocitos < 10,
  },
  {
    id: 'desviacion',
    titulo: 'Desviación izquierda',
    detalle: 'Abastonados por encima de 5 % o presencia de metamielocitos y mielocitos. La médula está liberando su reserva: típico de infección bacteriana aguda.',
    // Con blastos no se llama desviación izquierda sino hiato leucémico, que
    // tiene su propio patrón: mostrar los dos a la vez daría una lectura falsa.
    test: (v) => v.blastos === 0 && (v.abastonados > 5 || v.metamielocitos > 0 || v.mielocitos > 0),
    gravedad: 'aviso',
  },
  {
    id: 'bacteriana',
    titulo: 'Patrón sugerente de infección bacteriana',
    detalle: 'Leucocitosis con neutrofilia e índice N/L elevado. Se acompaña con frecuencia de trombocitosis reactiva.',
    gravedad: 'aviso',
    test: (v, s) => alto(v, 'leucocitos', s) && alto(v, 'segmentados', s) && indiceNL(v) > 3,
  },
  {
    id: 'viral',
    titulo: 'Patrón sugerente de infección viral',
    detalle: 'Leucocitos normales o bajos con linfocitosis relativa e índice N/L bajo. No hay desviación izquierda.',
    gravedad: 'info',
    test: (v, s) => !alto(v, 'leucocitos', s) && alto(v, 'linfocitos', s) && indiceNL(v) < 2,
  },
  {
    id: 'dengue',
    titulo: 'Patrón compatible con dengue',
    detalle: 'Trombocitopenia + leucopenia + hematocrito elevado. En zona endémica esta tríada obliga a descartar dengue y vigilar signos de alarma.',
    gravedad: 'alerta',
    test: (v, s) => v.plaquetas < 100 && bajo(v, 'leucocitos', s) && alto(v, 'hto', s),
  },
  {
    id: 'eosinofilia',
    titulo: 'Eosinofilia',
    detalle: 'Eosinófilos absolutos por encima de 500/µL. Las causas frecuentes son alergia, parasitosis y fármacos; en el Perú se descarta parasitosis primero.',
    gravedad: 'info',
    test: (v) => v.eosinofilosAbs > 0.5,
  },
  {
    id: 'linfocitosis',
    titulo: 'Linfocitosis absoluta marcada',
    detalle: 'Linfocitos absolutos muy elevados. En un adulto joven con fiebre y adenopatías sugiere mononucleosis; revisar el frotis buscando linfocitos atípicos.',
    gravedad: 'info',
    // Con blastos el absoluto de linfocitos es un artefacto del clon: sale alto
    // sin que haya linfocitosis real.
    test: (v) => v.blastos === 0 && v.linfocitosAbs > 5,
  },
  {
    id: 'hemoconcentracion',
    titulo: 'Hemoconcentración con índices normales',
    detalle: 'Hematocrito alto pero VCM, HCM y CHCM normales. No hay más glóbulos rojos: hay menos plasma. Reevaluar tras hidratar.',
    gravedad: 'info',
    test: (v, s) => alto(v, 'hto', s) && !alto(v, 'vcm', s) && !alto(v, 'chcm', s),
  },
  {
    id: 'trombocitopenia',
    titulo: 'Trombocitopenia significativa',
    detalle: 'Plaquetas por debajo de 100 000/µL. Bajo 50 000 hay riesgo de sangrado con traumatismos; bajo 20 000, riesgo de sangrado espontáneo.',
    gravedad: 'alerta',
    test: (v) => v.plaquetas < 100,
  },
  {
    id: 'neutropenia',
    titulo: 'Neutropenia',
    detalle: 'Neutrófilos absolutos bajos. Por debajo de 500/µL la neutropenia es severa y cualquier fiebre se maneja como urgencia infecciosa.',
    gravedad: 'alerta',
    test: (v) => v.segmentadosAbs + v.abastonadosAbs < 1.5,
  },
  {
    id: 'pancitopenia',
    titulo: 'Pancitopenia',
    detalle: 'Las tres series están bajas a la vez. Sugiere falla medular, infiltración o déficit severo de B12/folato.',
    gravedad: 'alerta',
    test: (v, s) => bajo(v, 'hb', s) && bajo(v, 'leucocitos', s) && bajo(v, 'plaquetas', s),
  },
];

export function patronesActivos(v: Valores, sexo: Sexo): Patron[] {
  return PATRONES.filter((p) => {
    try {
      return p.test(v, sexo);
    } catch {
      return false;
    }
  });
}

/* ────────────────────────────────────────────────────────────────────────
   GLOSARIO
   ──────────────────────────────────────────────────────────────────────── */

export interface TerminoGlosario {
  termino: string;
  definicion: string;
}

export const GLOSARIO: TerminoGlosario[] = [
  { termino: 'Anemia',            definicion: 'Hemoglobina por debajo del rango normal. Es un signo, no un diagnóstico: siempre hay que buscar la causa.' },
  { termino: 'Anisocitosis',      definicion: 'Glóbulos rojos de tamaños muy dispares. Se mide con el RDW.' },
  { termino: 'Desviación izquierda', definicion: 'Aparición de neutrófilos inmaduros (abastonados, metamielocitos, mielocitos) en sangre. La médula está liberando su reserva.' },
  { termino: 'Eosinofilia',       definicion: 'Eosinófilos absolutos por encima de 500/µL. Alergia, parásitos, fármacos o neoplasias.' },
  { termino: 'Hiato leucémico',   definicion: 'Muchos blastos y casi ninguna forma intermedia. Distingue la leucemia aguda de una reacción leucemoide, donde sí hay todos los escalones.' },
  { termino: 'Hipocromía',        definicion: 'Glóbulos rojos pálidos por poca hemoglobina. Se traduce en HCM y CHCM bajas.' },
  { termino: 'Leucocitosis',      definicion: 'Leucocitos totales por encima del rango normal.' },
  { termino: 'Leucopenia',        definicion: 'Leucocitos totales por debajo del rango normal.' },
  { termino: 'Linfocitosis',      definicion: 'Aumento de linfocitos. Puede ser relativa (sube el %) o absoluta (sube el número real). La que cuenta es la absoluta.' },
  { termino: 'Linfopenia',        definicion: 'Descenso de linfocitos. Por debajo de 1 000/µL de forma mantenida obliga a descartar VIH.' },
  { termino: 'Macrocitosis',      definicion: 'VCM alto: glóbulos rojos grandes. Déficit de B12/folato, alcohol, hipotiroidismo.' },
  { termino: 'Microcitosis',      definicion: 'VCM bajo: glóbulos rojos pequeños. Ferropenia y talasemia son las causas principales.' },
  { termino: 'Monocitosis',       definicion: 'Monocitos absolutos por encima de 1 000/µL. Infecciones crónicas como la tuberculosis, o recuperación de una infección.' },
  { termino: 'Neutrofilia',       definicion: 'Aumento de neutrófilos. Infección bacteriana, inflamación, corticoides o estrés.' },
  { termino: 'Neutropenia',       definicion: 'Neutrófilos absolutos bajos. Por debajo de 500/µL es severa y hay riesgo de infección grave.' },
  { termino: 'Pancitopenia',      definicion: 'Descenso simultáneo de las tres series. Sugiere falla medular o infiltración.' },
  { termino: 'Poliglobulia',      definicion: 'Exceso de glóbulos rojos. Puede ser real (policitemia, altura) o aparente (deshidratación).' },
  { termino: 'Reacción leucemoide', definicion: 'Leucocitosis extrema (> 50 000) por una infección, no por leucemia. A diferencia de esta, conserva todos los escalones de maduración.' },
  { termino: 'Trombocitopenia',   definicion: 'Plaquetas bajas. Riesgo de sangrado, proporcional a cuánto bajen.' },
  { termino: 'Trombocitosis',     definicion: 'Plaquetas altas. Casi siempre reactiva: ferropenia, infección o inflamación.' },
];

export const DISCLAIMER =
  'Esta herramienta es educativa y no reemplaza el diagnóstico de un profesional de la salud. ' +
  'Los valores son de referencia general y pueden variar según laboratorio, edad y sexo.';
