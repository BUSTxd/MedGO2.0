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

/**
 * Una causa de valor alto o bajo, con su explicación.
 *
 * El `mecanismo` es POR QUÉ esa causa mueve ESE parámetro, no una descripción
 * de la enfermedad: la misma causa explica cosas distintas según dónde se lea.
 * Los corticoides suben los segmentados por desmarginación y a la vez bajan
 * eosinófilos y linfocitos por apoptosis, así que sus textos no se comparten
 * entre parámetros aunque el rótulo de la causa se repita.
 */
export interface Causa {
  /** Rótulo corto, el que se ve en la lista. Único dentro de su lista. */
  causa: string;
  /** Fisiopatología: por qué ese parámetro se mueve en esa dirección. */
  mecanismo: string;
  /** Qué acompaña al hallazgo en el resto del hemograma o cómo confirmarlo. */
  pista: string;
}

export interface InfoParametro {
  /** Qué mide y por qué importa. */
  queMide: string;
  /** Traducción a lenguaje no técnico (botón «explícamelo simple»). */
  simple: string;
  alto: Causa[];
  bajo: Causa[];
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
    alto: [
      {
        causa: 'Deshidratación (parece alto porque hay menos plasma)',
        mecanismo: 'No hay ni un hematíe más: lo que se pierde es agua del plasma. Como el recuento se expresa por microlitro de sangre, al encoger el denominador la cifra sube sola. Se llama poliglobulia relativa o hemoconcentración.',
        pista: 'RBC, Hb y Hto suben los tres en el mismo porcentaje y con VCM normal; suele acompañarse de urea y creatinina elevadas, y todo se normaliza al rehidratar.',
      },
      {
        causa: 'Vivir en altura (Cusco, Puno, Junín)',
        mecanismo: 'La presión barométrica baja reduce la presión parcial de oxígeno inspirado. El riñón detecta la hipoxia por la vía del factor HIF y secreta más eritropoyetina, que expande de verdad la masa eritrocitaria.',
        pista: 'Es una poliglobulia real y adaptativa, con VCM normal y sin trombocitosis. Los rangos de referencia deben ajustarse a la altitud: por encima de 2 500 m estos valores son lo esperado.',
      },
      {
        causa: 'Tabaquismo crónico',
        mecanismo: 'El monóxido de carbono del humo se une a la hemoglobina con 200 veces más afinidad que el oxígeno y forma carboxihemoglobina, que no transporta oxígeno y además desplaza la curva de disociación a la izquierda. El resultado es hipoxia tisular funcional que estimula la eritropoyetina.',
        pista: 'Poliglobulia leve o moderada en alguien con Hb alta sin causa aparente; revierte en semanas o meses tras dejar de fumar.',
      },
      {
        causa: 'Policitemia vera',
        mecanismo: 'Neoplasia mieloproliferativa por mutación JAK2 V617F: el receptor de eritropoyetina queda activado de forma constitutiva y el clon prolifera sin necesitar la señal hormonal.',
        pista: 'La eritropoyetina sérica está BAJA, y eso la separa de todas las poliglobulias secundarias. Suele añadir trombocitosis, leucocitosis, esplenomegalia y prurito tras la ducha caliente.',
      },
      {
        causa: 'Enfermedad pulmonar crónica',
        mecanismo: 'La hipoxemia sostenida por alteración del intercambio gaseoso mantiene alta la eritropoyetina renal, igual que la altura pero por causa pulmonar.',
        pista: 'Poliglobulia secundaria con eritropoyetina normal o alta, hipoxemia en la gasometría y sin esplenomegalia.',
      },
    ],
    bajo: [
      {
        causa: 'Anemia de cualquier causa',
        mecanismo: 'Es el resultado final común de tres mecanismos distintos: la médula produce poco, se pierden hematíes por sangrado o se destruyen antes de tiempo. El RBC baja en los tres, pero por sí solo no distingue cuál ocurrió.',
        pista: 'La que define anemia es la hemoglobina, no el recuento. El VCM y el RDW son los que orientan al tipo, y los reticulocitos separan producción baja de pérdida o destrucción.',
      },
      {
        causa: 'Sangrado agudo o crónico',
        mecanismo: 'Se pierden hematíes enteros junto con su plasma. En el sangrado agudo el recuento tarda horas en caer porque se pierden los dos a la vez; en el crónico se agota primero el depósito de hierro y luego cae la producción.',
        pista: 'Agudo: Hto engañosamente normal las primeras horas y caída al reponer volumen. Crónico: patrón ferropénico con VCM bajo, RDW alto y a menudo trombocitosis reactiva.',
      },
      {
        causa: 'Déficit de hierro, B12 o folato',
        mecanismo: 'Sin hierro no se sintetiza el grupo hemo; sin B12 ni folato no se replica el ADN del eritroblasto. En ambos casos la médula termina entregando menos hematíes viables, aunque por vías opuestas.',
        pista: 'El VCM separa las dos familias: bajo en la ferropenia, alto en el déficit de B12 o folato. En el segundo caso aparecen además neutrófilos hipersegmentados.',
      },
      {
        causa: 'Enfermedad renal crónica (falta eritropoyetina)',
        mecanismo: 'Cerca del 90 % de la eritropoyetina la fabrican las células intersticiales peritubulares del riñón. Al perderse parénquima funcionante desaparece la señal que mantiene viva la eritropoyesis.',
        pista: 'Anemia normocítica y normocrómica, proporcional a la caída de la filtración glomerular, con creatinina alta. Responde a eritropoyetina recombinante.',
      },
      {
        causa: 'Hemólisis',
        mecanismo: 'Los hematíes se destruyen antes de cumplir sus 120 días, dentro del vaso o capturados por el bazo, a un ritmo que la médula no alcanza a compensar aunque multiplique su producción.',
        pista: 'Reticulocitos altos, LDH y bilirrubina indirecta elevadas y haptoglobina baja. Ese cuarteto es lo que confirma que la causa es destrucción y no falta de producción.',
      },
    ],
    dato: 'En el Perú, la altura cambia los rangos: a más de 2 500 m se aceptan valores más altos como normales. Un hemograma de Cusco no se lee con la tabla de Lima.',
  },
  hb: {
    queMide: 'La cantidad de hemoglobina por decilitro de sangre. Es el parámetro que define la anemia — no el recuento de hematíes.',
    simple: 'Cuánto oxígeno puede cargar tu sangre. Si está baja, te cansas y te falta el aire.',
    alto: [
      {
        causa: 'Deshidratación',
        mecanismo: 'La hemoglobina total del cuerpo no cambia; se concentra porque el plasma en el que está disuelta la sangre disminuyó. Es un falso aumento por reducción del volumen plasmático.',
        pista: 'Sube en paralelo con el hematocrito manteniendo la relación Hto ≈ 3 × Hb, y se corrige por completo con la hidratación.',
      },
      {
        causa: 'Vivir en altura',
        mecanismo: 'La hipoxia hipobárica crónica activa la eritropoyetina y aumenta de verdad la masa de hemoglobina circulante, que es la adaptación que permite seguir entregando oxígeno con menos presión disponible.',
        pista: 'Aumento real y estable, sin síntomas. Se usan tablas de referencia corregidas por altitud; en Puno o Cerro de Pasco una Hb de 17 g/dL en mujer puede ser normal.',
      },
      {
        causa: 'Policitemia vera',
        mecanismo: 'La proliferación clonal por JAK2 aumenta la masa eritrocitaria sin control hormonal, y con ella la hemoglobina total.',
        pista: 'Hb muy alta (a menudo > 16,5 g/dL en mujer o > 18,5 en varón) con eritropoyetina baja. La hiperviscosidad da cefalea, acúfenos y riesgo trombótico.',
      },
      {
        causa: 'EPOC / hipoxia crónica',
        mecanismo: 'La hipoxemia mantenida es un estímulo continuo para la eritropoyetina; el cuerpo compensa la mala oxigenación fabricando más transportador.',
        pista: 'Poliglobulia secundaria en un paciente con disnea crónica y saturación baja. Corregir la hipoxemia con oxigenoterapia baja la hemoglobina.',
      },
    ],
    bajo: [
      {
        causa: 'Ferropenia (la causa más común del mundo)',
        mecanismo: 'El hierro es el átomo que fija el oxígeno en el centro del grupo hemo. Sin depósitos, cada eritroblasto sintetiza menos hemoglobina y hace divisiones extra antes de madurar, así que las células salen pequeñas y pálidas.',
        pista: 'Ferritina baja es el marcador más precoz. El VCM cae, el RDW sube antes que el VCM y suele haber trombocitosis reactiva acompañando.',
      },
      {
        causa: 'Sangrado',
        mecanismo: 'Se pierde hemoglobina ya formada. Si la pérdida es lenta y repetida, además se vacían los depósitos de hierro y se suma un componente carencial.',
        pista: 'En adultos obliga a buscar el origen: digestivo alto o bajo en varones y posmenopáusicas, y pérdidas menstruales en mujeres en edad fértil.',
      },
      {
        causa: 'Déficit de B12 o folato',
        mecanismo: 'Ambos son cofactores de la síntesis de ADN. Sin ellos el núcleo del eritroblasto madura más lento que el citoplasma, muchas células mueren dentro de la propia médula (eritropoyesis inefectiva) y llegan pocas a la sangre.',
        pista: 'Anemia con VCM alto, neutrófilos hipersegmentados y LDH elevada. En el déficit de B12 pueden aparecer parestesias y alteración de la sensibilidad profunda.',
      },
      {
        causa: 'Enfermedad crónica o renal',
        mecanismo: 'En la inflamación crónica la hepcidina secuestra el hierro en los macrófagos y frena su absorción intestinal; en la enfermedad renal falta directamente la eritropoyetina. En ambas hay hierro o señal insuficientes pese a que la médula esté sana.',
        pista: 'Anemia normocítica y leve, con ferritina normal o alta pero saturación de transferrina baja. Es la segunda anemia más frecuente después de la ferropénica.',
      },
      {
        causa: 'Talasemia y otras hemoglobinopatías',
        mecanismo: 'Es un defecto genético en la síntesis de las cadenas de globina, no en el hierro. Las cadenas sobrantes precipitan y dañan al eritrocito, que se destruye precozmente.',
        pista: 'Microcitosis desproporcionada para el grado de anemia, con RDW normal y ferritina normal o alta. Se confirma con electroforesis de hemoglobina.',
      },
    ],
    dato: 'La OMS define anemia con Hb < 12 g/dL en mujeres y < 13 g/dL en varones. La anemia es un signo, nunca un diagnóstico: siempre hay que buscar la causa.',
  },
  hto: {
    queMide: 'Qué porcentaje del volumen de sangre ocupan los hematíes. Si centrifugas sangre, es la fracción roja del tubo.',
    simple: 'Qué tan "espesa" está la sangre por los glóbulos rojos.',
    alto: [
      {
        causa: 'Deshidratación (hemoconcentración)',
        mecanismo: 'El hematocrito es una fracción: masa de hematíes sobre volumen total de sangre. Al perder plasma se reduce el denominador y la fracción sube aunque el número de hematíes sea exactamente el mismo.',
        pista: 'Es el parámetro que más rápido responde a la reposición de líquidos; si baja varios puntos tras hidratar, la causa era la concentración.',
      },
      {
        causa: 'Altura',
        mecanismo: 'La eritropoyetina elevada por la hipoxia crónica aumenta la masa eritrocitaria real, así que la fracción roja del tubo crece de verdad.',
        pista: 'Hematocritos de 50 % o más pueden ser normales en residentes de gran altitud; interpretarlos con tabla de nivel del mar lleva a diagnosticar poliglobulias inexistentes.',
      },
      {
        causa: 'Fuga de plasma — clásico en dengue',
        mecanismo: 'La infección aumenta la permeabilidad del endotelio y el plasma escapa al tercer espacio. La sangre que queda en el vaso está concentrada: el hematocrito sube mientras el paciente se hipovolemiza.',
        pista: 'Es el signo de alarma central del dengue grave: hemoconcentración (subida del Hto ≥ 20 %) junto con caída rápida de las plaquetas, derrame pleural o ascitis.',
      },
      {
        causa: 'Policitemia',
        mecanismo: 'La expansión clonal o secundaria de la masa eritrocitaria aumenta directamente el volumen ocupado por los hematíes.',
        pista: 'Hto sostenido por encima de 48 % en mujer o 49 % en varón. La hiperviscosidad resultante es lo que da el riesgo trombótico.',
      },
    ],
    bajo: [
      {
        causa: 'Anemia',
        mecanismo: 'Menos hematíes o hematíes más pequeños ocupan menos volumen dentro del mismo total de sangre, así que la fracción roja se reduce.',
        pista: 'Cae en paralelo con la hemoglobina manteniendo la regla Hto ≈ 3 × Hb; si esa proporción se rompe, sospechar error de la muestra.',
      },
      {
        causa: 'Sangrado',
        mecanismo: 'La pérdida saca hematíes y plasma en la misma proporción, así que el hematocrito no cambia de inmediato. Sólo cae cuando el plasma se repone —espontáneamente o con sueros— y diluye lo que quedó.',
        pista: 'Un hematocrito normal en las primeras horas de una hemorragia aguda no descarta nada: hay que repetirlo tras la reposición de volumen.',
      },
      {
        causa: 'Sobrehidratación o exceso de sueros',
        mecanismo: 'Es el espejo de la deshidratación: aumenta el volumen plasmático sin tocar la masa eritrocitaria, y la fracción roja baja por dilución. Se llama pseudoanemia dilucional.',
        pista: 'Hb y Hto bajos con VCM y morfología normales en un paciente con balance hídrico positivo, edemas o embarazo avanzado.',
      },
    ],
    dato: 'Regla rápida: el hematocrito es aproximadamente 3 × la hemoglobina. Si esa relación no cuadra, sospecha error de muestra.',
  },
  vcm: {
    queMide: 'El tamaño promedio de un glóbulo rojo. Es el parámetro que clasifica las anemias en microcíticas, normocíticas y macrocíticas.',
    simple: 'Si tus glóbulos rojos son chicos, normales o grandes.',
    alto: [
      {
        causa: 'Déficit de B12 o folato (megaloblástica)',
        mecanismo: 'B12 y folato son cofactores de la síntesis de timidina y por tanto del ADN. Sin ellos el núcleo del eritroblasto madura más lento que el citoplasma: la célula hace menos divisiones de las que debía y sale grande, con el citoplasma ya maduro y el núcleo todavía inmaduro.',
        pista: 'VCM típicamente > 100 y a menudo > 110 fL, neutrófilos hipersegmentados con más de 5 lóbulos y, por hematopoyesis inefectiva, a veces pancitopenia leve con LDH alta.',
      },
      {
        causa: 'Alcoholismo',
        mecanismo: 'El etanol y su metabolito el acetaldehído son tóxicos directos para el precursor eritroide y alteran el metabolismo del folato. La macrocitosis aparece incluso sin anemia y sin déficit vitamínico demostrable.',
        pista: 'VCM entre 100 y 110 fL con hemoglobina normal, sin hipersegmentación de neutrófilos. Suele acompañarse de GGT alta y relación AST/ALT mayor de 2.',
      },
      {
        causa: 'Hipotiroidismo',
        mecanismo: 'Las hormonas tiroideas estimulan la eritropoyesis y regulan el metabolismo celular; al faltar, la maduración del eritroblasto se enlentece y salen células algo más grandes.',
        pista: 'Macrocitosis leve, rara vez por encima de 110 fL, con TSH alta. Se normaliza al reponer levotiroxina.',
      },
      {
        causa: 'Enfermedad hepática',
        mecanismo: 'El hígado dañado altera el metabolismo de los lípidos y aumenta el depósito de colesterol y fosfolípidos en la membrana del hematíe, que gana superficie y volumen sin ser megaloblástico.',
        pista: 'Macrocitosis con dianocitos (células en diana) en el frotis y sin hipersegmentación. Es macrocitosis no megaloblástica.',
      },
      {
        causa: 'Reticulocitosis marcada',
        mecanismo: 'El reticulocito es entre un 20 y un 30 % más grande que el hematíe maduro. Cuando la médula responde a una hemólisis o a un sangrado lanzando muchos a la vez, el promedio de la población se desplaza hacia arriba.',
        pista: 'VCM sólo ligeramente alto, con reticulocitos elevados y policromatofilia en el frotis. Es un efecto de la respuesta medular, no una enfermedad del tamaño celular.',
      },
    ],
    bajo: [
      {
        causa: 'Ferropenia',
        mecanismo: 'Sin hierro el eritroblasto no llena su citoplasma de hemoglobina. Como la señal para dejar de dividirse depende de alcanzar cierta concentración de hemoglobina, la célula hace divisiones adicionales y termina siendo más pequeña.',
        pista: 'VCM bajo con RDW alto (población desigual) y ferritina baja. La microcitosis aparece después que la caída de la ferritina y del RDW.',
      },
      {
        causa: 'Talasemia',
        mecanismo: 'Falta una de las cadenas de globina por defecto genético, así que se ensambla menos hemoglobina por célula aunque el hierro sobre. El resultado es microcitosis intensa desde el nacimiento.',
        pista: 'VCM muy bajo desproporcionado para una anemia leve, con RDW normal y recuento de hematíes normal o alto. El índice de Mentzer (VCM ÷ RBC) por debajo de 13 apunta a talasemia.',
      },
      {
        causa: 'Anemia de enfermedad crónica (a veces)',
        mecanismo: 'La hepcidina inducida por la inflamación bloquea la ferroportina y atrapa el hierro dentro de los macrófagos. Si el proceso se prolonga, la falta funcional de hierro termina reduciendo el tamaño celular.',
        pista: 'Suele ser normocítica y sólo se vuelve microcítica en fases avanzadas. Se separa de la ferropenia porque la ferritina está normal o alta.',
      },
      {
        causa: 'Intoxicación por plomo',
        mecanismo: 'El plomo inhibe dos enzimas de la vía del hemo, la ALA-deshidratasa y la ferroquelatasa, así que el hierro no logra insertarse en la protoporfirina y la síntesis de hemoglobina se detiene.',
        pista: 'Microcitosis con punteado basófilo en el frotis, muy característico. Buscar exposición ocupacional o ambiental y medir plumbemia.',
      },
    ],
    dato: 'Es la primera bifurcación del algoritmo de anemias: con el VCM en la mano ya descartaste dos tercios de las causas.',
  },
  hcm: {
    queMide: 'Cuánta hemoglobina lleva en promedio cada glóbulo rojo, en picogramos. Suele moverse junto al VCM.',
    simple: 'Cuánto oxígeno carga cada camión individual.',
    alto: [
      {
        causa: 'Anemia macrocítica (células grandes cargan más)',
        mecanismo: 'La HCM es hemoglobina total dividida entre número de hematíes. Si las células son más grandes, cada una contiene más hemoglobina en términos absolutos, aunque su concentración interna sea normal.',
        pista: 'HCM alta con CHCM normal: eso confirma que la célula es grande, no que esté sobrecargada de hemoglobina. Se mueve siempre en el mismo sentido que el VCM.',
      },
      {
        causa: 'Falsamente alto si hay lipemia o hemólisis en el tubo',
        mecanismo: 'El analizador mide hemoglobina por absorbancia. Los lípidos del plasma y la hemoglobina libre de los hematíes rotos en el tubo absorben luz igual, así que el equipo sobreestima la hemoglobina y reparte ese exceso entre los hematíes contados.',
        pista: 'HCM y CHCM altas a la vez con VCM normal, en una muestra con suero lechoso o rosado. Se resuelve repitiendo la extracción, no tratando al paciente.',
      },
    ],
    bajo: [
      {
        causa: 'Ferropenia',
        mecanismo: 'Sin hierro no se sintetiza hemo, así que cada hematíe se llena menos. La HCM baja es la traducción numérica de la hipocromía que se ve en el microscopio.',
        pista: 'HCM baja junto con VCM bajo y RDW alto. En el frotis, el centro pálido del hematíe ocupa más de un tercio de su diámetro.',
      },
      {
        causa: 'Talasemia',
        mecanismo: 'La cadena de globina que falta impide ensamblar la molécula completa de hemoglobina, así que la célula carga menos aunque el hierro esté disponible de sobra.',
        pista: 'HCM muy baja, a menudo por debajo de 26 pg, con hematíes numerosos y RDW normal. Sospechar sobre todo si el hierro y la ferritina son normales.',
      },
      {
        causa: 'Anemias hipocrómicas en general',
        mecanismo: 'Cualquier defecto en la síntesis del hemo o de la globina reduce la carga de hemoglobina por célula: intoxicación por plomo, anemia sideroblástica o enfermedad crónica avanzada comparten ese final común.',
        pista: 'Ante HCM baja con ferritina normal o alta hay que salir de la ferropenia y pensar en talasemia, sideroblástica o plomo.',
      },
    ],
    dato: 'HCM baja e "hipocromía" son lo mismo visto desde dos lados: el número y el frotis. En la lámina se ve el centro pálido del hematíe más grande de lo normal.',
  },
  chcm: {
    queMide: 'La concentración de hemoglobina dentro del hematíe. A diferencia de la HCM, no depende del tamaño de la célula.',
    simple: 'Qué tan "lleno" está cada glóbulo rojo, sin importar si es grande o chico.',
    alto: [
      {
        causa: 'Esferocitosis hereditaria (casi el único que la sube de verdad)',
        mecanismo: 'El defecto en las proteínas del citoesqueleto (espectrina, anquirina, banda 3) hace que la célula pierda membrana en cada paso por el bazo. Conserva su hemoglobina pero en menos volumen, así que la concentración interna aumenta.',
        pista: 'CHCM > 36 g/dL con esferocitos en el frotis, reticulocitos altos y bilirrubina indirecta elevada. Se confirma con citometría de unión a eosina-5-maleimida o fragilidad osmótica.',
      },
      {
        causa: 'Deshidratación celular',
        mecanismo: 'Cuando el hematíe pierde agua y potasio —como en la xerocitosis hereditaria o en la drepanocitosis— su hemoglobina queda concentrada en menos volumen citoplasmático.',
        pista: 'CHCM alta con VCM normal o bajo. En la drepanocitosis esa deshidratación es justamente lo que favorece la polimerización de la HbS.',
      },
      {
        causa: 'Artefacto por hemólisis de la muestra',
        mecanismo: 'Los hematíes rotos en el tubo liberan su hemoglobina al plasma. El analizador la sigue midiendo como hemoglobina total pero ya no cuenta esas células, de modo que la concentración calculada sale inflada.',
        pista: 'Es la causa más frecuente de una CHCM > 37 g/dL en la práctica diaria. Antes de estudiar una esferocitosis, mirar si el plasma está rosado y repetir la muestra.',
      },
    ],
    bajo: [
      {
        causa: 'Ferropenia',
        mecanismo: 'La célula no logra alcanzar la concentración normal de hemoglobina por falta de hierro, y como el defecto de llenado supera a la reducción de tamaño, la concentración interna también cae.',
        pista: 'Es el único parámetro de los tres índices que confirma hipocromía verdadera. Suele bajar más tarde que el VCM en la evolución de la ferropenia.',
      },
      {
        causa: 'Talasemia',
        mecanismo: 'El desequilibrio entre cadenas de globina limita la cantidad de hemoglobina ensamblada, y aunque la célula también encoge, el llenado queda proporcionalmente más bajo.',
        pista: 'CHCM en el límite bajo o discretamente reducida, con microcitosis mucho más llamativa. La CHCM suele estar menos alterada que en la ferropenia.',
      },
      {
        causa: 'Anemia sideroblástica',
        mecanismo: 'El hierro llega al eritroblasto pero no puede incorporarse a la protoporfirina, así que se acumula en las mitocondrias perinucleares en vez de formar hemoglobina.',
        pista: 'Sideroblastos en anillo en el aspirado medular, con ferritina y saturación de transferrina altas pese a la hipocromía. Puede ser congénita, por alcohol, isoniazida o mielodisplasia.',
      },
    ],
    dato: 'Una CHCM > 36 g/dL casi siempre es esferocitosis o un error de la muestra. Es de los pocos parámetros con una lista corta de causas.',
  },
  rdwSd: {
    queMide: 'El ancho de la curva de distribución de tamaños, medido en femtolitros. Es una medida directa de cuán dispares son los hematíes entre sí.',
    simple: 'Qué tan distintos son de tamaño tus glóbulos rojos, medido en unidades absolutas.',
    alto: [
      {
        causa: 'Anisocitosis marcada',
        mecanismo: 'El RDW-SD mide el ancho del histograma de volúmenes al 20 % de su altura. Si conviven hematíes de tamaños muy distintos, la campana se ensancha y el valor sube.',
        pista: 'Se corresponde con lo que se ve en el frotis: hematíes de calibres claramente desiguales. Es un hallazgo descriptivo, no un diagnóstico.',
      },
      {
        causa: 'Mezcla de poblaciones (por ejemplo tras transfundir)',
        mecanismo: 'La sangre transfundida aporta hematíes de otro donante, con su propio tamaño medio, que conviven con los del receptor. El histograma se vuelve bimodal y el ancho medido se dispara.',
        pista: 'RDW alto con VCM que no encaja con ninguna anemia concreta, en alguien transfundido recientemente. Deja de ser útil para clasificar la anemia de base.',
      },
      {
        causa: 'Anemias carenciales en tratamiento',
        mecanismo: 'Al reponer hierro, B12 o folato, la médula empieza a fabricar hematíes de tamaño normal mientras todavía circulan los antiguos, anómalos. Durante semanas coexisten dos poblaciones.',
        pista: 'Es un signo de buena respuesta, no de empeoramiento: el RDW sube primero, luego se normaliza el VCM y por último la hemoglobina.',
      },
    ],
    bajo: [
      {
        causa: 'Población muy uniforme — poco frecuente y rara vez significativo',
        mecanismo: 'Un RDW-SD bajo sólo indica que todos los hematíes tienen prácticamente el mismo volumen. Ningún proceso patológico se caracteriza por homogeneizar la población.',
        pista: 'No tiene utilidad diagnóstica por sí solo. Si va con microcitosis, apoya más talasemia que ferropenia, pero se usa el RDW-CV para esa comparación.',
      },
    ],
    dato: 'El RDW-SD es menos sensible al VCM promedio que el CV, por eso muchos laboratorios reportan los dos.',
  },
  rdwCv: {
    queMide: 'La misma dispersión de tamaños pero como coeficiente de variación (%). Es el que se usa en los algoritmos clínicos.',
    simple: 'Si todos tus glóbulos rojos se parecen entre sí o hay de todos los tamaños.',
    alto: [
      {
        causa: 'Ferropenia (sube ANTES que caiga la hemoglobina)',
        mecanismo: 'Al agotarse el hierro, la médula no cambia de golpe: sigue circulando la población antigua de tamaño normal mientras empieza a fabricar hematíes pequeños. Esa convivencia ensancha la distribución antes de que ningún promedio se altere.',
        pista: 'Es el primer índice del hemograma que se mueve en la ferropenia, incluso con Hb y VCM todavía normales. Un RDW alto aislado justifica pedir ferritina.',
      },
      {
        causa: 'Déficit de B12 o folato',
        mecanismo: 'La eritropoyesis megaloblástica produce células de tamaños muy irregulares, y en la médula muchas mueren antes de salir, lo que deja una población superviviente muy heterogénea.',
        pista: 'RDW alto con VCM alto. En el frotis se acompaña de macroovalocitos y neutrófilos hipersegmentados.',
      },
      {
        causa: 'Anemias mixtas',
        mecanismo: 'Cuando coinciden ferropenia y déficit de B12, o ferropenia sobre enfermedad crónica, coexisten hematíes pequeños y grandes. Los promedios se cancelan entre sí y el VCM puede salir engañosamente normal.',
        pista: 'VCM normal con RDW alto es la firma de la anemia mixta: obliga a pedir el perfil de hierro y las vitaminas aunque el tamaño medio no llame la atención.',
      },
      {
        causa: 'Respuesta a tratamiento con hierro',
        mecanismo: 'La nueva cohorte de hematíes bien hemoglobinizados sale a circular junto a los microcíticos previos, y esa doble población ensancha temporalmente el histograma.',
        pista: 'Subida transitoria del RDW a las 1-2 semanas de iniciar el hierro, junto con reticulocitosis. Es la confirmación de que el tratamiento está funcionando.',
      },
    ],
    bajo: [
      {
        causa: 'Talasemia menor: microcitosis pero población uniforme',
        mecanismo: 'El defecto es genético y afecta por igual a todos los hematíes desde siempre, así que todos salen igual de pequeños. No hay dos poblaciones conviviendo como en una carencia adquirida.',
        pista: 'Ese contraste es la clave práctica: VCM bajo con RDW normal apunta a talasemia; VCM bajo con RDW alto apunta a ferropenia.',
      },
    ],
    dato: 'Es la clave para separar ferropenia de talasemia: las dos dan VCM bajo, pero la ferropenia sube el RDW y la talasemia lo deja normal.',
  },
  plaquetas: {
    queMide: 'Cuántas plaquetas circulan por microlitro. Son fragmentos de megacariocitos y forman el tapón inicial cuando se rompe un vaso.',
    simple: 'Los "parches" que tapan las heridas por dentro. Pocas, sangras; muchas, se pueden formar coágulos.',
    alto: [
      {
        causa: 'Trombocitosis reactiva por ferropenia, infección o inflamación',
        mecanismo: 'La interleucina-6 liberada en la inflamación estimula la producción hepática de trombopoyetina, que empuja a los megacariocitos a fabricar más plaquetas. En la ferropenia se suma un estímulo cruzado sobre el precursor megacariocítico.',
        pista: 'Explica el 80-90 % de las trombocitosis. Es proporcional a la causa, no da trombosis por sí sola y se normaliza al tratar el proceso de fondo.',
      },
      {
        causa: 'Post-esplenectomía',
        mecanismo: 'El bazo retiene normalmente alrededor de un tercio de la masa plaquetaria circulante. Sin bazo, ese pool se vuelca a la sangre y el recuento sube de forma permanente.',
        pista: 'Trombocitosis estable de por vida, acompañada de cuerpos de Howell-Jolly en los hematíes, que confirman la asplenia.',
      },
      {
        causa: 'Trombocitemia esencial',
        mecanismo: 'Neoplasia mieloproliferativa clonal, la mayoría por mutación de JAK2, CALR o MPL, en la que el megacariocito prolifera sin depender de la trombopoyetina.',
        pista: 'Plaquetas sostenidas por encima de 450 000 sin causa reactiva, a menudo > 1 000 000, con plaquetas gigantes en el frotis. A diferencia de la reactiva, sí produce trombosis y también sangrado.',
      },
    ],
    bajo: [
      {
        causa: 'Dengue y otras virosis',
        mecanismo: 'El virus suprime directamente el megacariocito en la médula y además induce anticuerpos que destruyen plaquetas en la periferia; la activación endotelial las consume.',
        pista: 'Caída progresiva desde el día 3 al 7, coincidiendo con la defervescencia. Vigilar la plaquetopenia junto con el hematocrito: si las plaquetas caen y el Hto sube, hay fuga de plasma.',
      },
      {
        causa: 'PTI (púrpura trombocitopénica inmune)',
        mecanismo: 'Autoanticuerpos contra glucoproteínas de la membrana plaquetaria (GPIIb/IIIa) marcan a las plaquetas para su destrucción en el bazo, y además frenan al megacariocito.',
        pista: 'Trombocitopenia aislada con el resto del hemograma normal, en alguien sin síntomas sistémicos. Es diagnóstico de exclusión; el VPM suele estar alto.',
      },
      {
        causa: 'Leucemia e infiltración medular',
        mecanismo: 'El clon maligno ocupa físicamente el espacio de la médula y desplaza a los megacariocitos normales, así que se fabrican menos plaquetas.',
        pista: 'La trombocitopenia casi nunca va sola: se acompaña de anemia y de leucocitos alterados, y pueden verse blastos en el frotis.',
      },
      {
        causa: 'Hiperesplenismo',
        mecanismo: 'El bazo agrandado —por hipertensión portal, infecciones o infiltración— secuestra un porcentaje mucho mayor del pool plaquetario, que queda atrapado fuera de la circulación.',
        pista: 'Trombocitopenia moderada con esplenomegalia palpable y a menudo pancitopenia leve. La médula está normal o incluso hiperplásica.',
      },
      {
        causa: 'Fármacos (heparina, quinina)',
        mecanismo: 'Algunos fármacos actúan como haptenos y generan anticuerpos que destruyen plaquetas. En la trombocitopenia inducida por heparina el anticuerpo va contra el complejo heparina-factor 4 plaquetario y, paradójicamente, activa las plaquetas.',
        pista: 'La trombocitopenia por heparina aparece a los 5-10 días y produce TROMBOSIS, no sangrado: es la excepción que hay que reconocer y obliga a suspender la heparina de inmediato.',
      },
    ],
    dato: 'Por debajo de 50 000 hay riesgo de sangrado con traumatismos; por debajo de 20 000, riesgo de sangrado espontáneo. En dengue es el parámetro que se sigue día a día.',
  },
  vpm: {
    queMide: 'El tamaño promedio de las plaquetas. Las plaquetas jóvenes son más grandes, así que informa sobre la producción medular.',
    simple: 'Si tus plaquetas son nuevas y grandes o viejas y chicas.',
    alto: [
      {
        causa: 'Destrucción periférica: la médula compensa lanzando plaquetas jóvenes',
        mecanismo: 'Cuando las plaquetas se destruyen fuera de la médula, el megacariocito acelera su producción y libera plaquetas recién formadas, que son más grandes y más ricas en gránulos que las maduras.',
        pista: 'VPM alto con plaquetas bajas indica que la médula responde bien; el problema está en la periferia, no en la fábrica.',
      },
      {
        causa: 'PTI',
        mecanismo: 'La destrucción inmune acelerada obliga a una producción compensadora rápida, así que la población circulante está enriquecida en plaquetas jóvenes de gran tamaño.',
        pista: 'Plaquetas grandes en el frotis con recuento bajo. Su presencia apoya el diagnóstico frente a una trombocitopenia por falla medular.',
      },
      {
        causa: 'Síndrome de Bernard-Soulier',
        mecanismo: 'Defecto congénito del complejo GPIb-IX-V, el receptor del factor de von Willebrand. Las plaquetas se forman anormalmente grandes y no se adhieren bien al subendotelio.',
        pista: 'Macrotrombocitopenia congénita con sangrado mucocutáneo desde la infancia y tiempo de sangría prolongado pese a un recuento sólo moderadamente bajo.',
      },
    ],
    bajo: [
      {
        causa: 'Falla de producción medular',
        mecanismo: 'Si el megacariocito está dañado o ausente, no hay recambio: las plaquetas que circulan son las viejas y pequeñas que quedan, sin aporte de formas jóvenes grandes.',
        pista: 'VPM bajo con plaquetas bajas apunta a que la fábrica falla. Es la combinación opuesta a la de la destrucción periférica y orienta a estudiar la médula.',
      },
      {
        causa: 'Aplasia',
        mecanismo: 'La médula pierde sus células madre hematopoyéticas y se sustituye por grasa, así que desaparece la megacariopoyesis junto con las otras dos series.',
        pista: 'Pancitopenia con reticulocitos bajos y sin esplenomegalia. El diagnóstico exige biopsia de médula ósea, no aspirado.',
      },
      {
        causa: 'Quimioterapia',
        mecanismo: 'Los citostáticos matan a las células en división, incluido el megacariocito. Como la plaqueta vive de 7 a 10 días, el nadir del recuento llega alrededor de los 7-14 días del ciclo.',
        pista: 'Trombocitopenia predecible por el calendario del ciclo, acompañada de neutropenia. Se recupera sola antes del siguiente ciclo si la médula no está agotada.',
      },
    ],
    dato: 'Un VPM alto con plaquetas bajas apunta a destrucción periférica; un VPM bajo con plaquetas bajas apunta a que la médula no las está fabricando.',
  },
  leucocitos: {
    queMide: 'El total de glóbulos blancos. Por sí solo dice poco: lo informativo es el diferencial, o sea qué tipo de leucocito subió o bajó.',
    simple: 'El tamaño total de tu ejército de defensa.',
    alto: [
      {
        causa: 'Infección bacteriana',
        mecanismo: 'Las citocinas de la respuesta aguda (G-CSF, IL-1, TNF) movilizan la reserva medular de neutrófilos y aceleran su producción. Todo el aumento se explica por la serie neutrofílica.',
        pista: 'Leucocitosis a expensas de segmentados y abastonados, con desviación izquierda. Un índice neutrófilo/linfocito por encima de 3 refuerza el origen bacteriano.',
      },
      {
        causa: 'Inflamación, estrés, corticoides',
        mecanismo: 'Los corticoides y las catecolaminas desprenden a los neutrófilos adheridos al endotelio (desmarginación) y frenan su salida a los tejidos. No se fabrican más: se cuentan más porque están todos en el torrente.',
        pista: 'Leucocitosis en horas, sin fiebre ni foco, con linfopenia y eosinopenia acompañantes. Es un patrón muy típico del paciente que recibe corticoides.',
      },
      {
        causa: 'Leucemias',
        mecanismo: 'Un clon maligno prolifera de forma autónoma en la médula y vuelca sus células a la sangre, sean blastos en las agudas o formas maduras y precursores en las crónicas.',
        pista: 'Cifras muy altas, a menudo por encima de 50 000, con células anómalas en el frotis. En la leucemia aguda hay hiato leucémico: blastos y maduros, sin las formas intermedias.',
      },
      {
        causa: 'Ejercicio intenso o embarazo (leve)',
        mecanismo: 'El ejercicio provoca desmarginación aguda por catecolaminas y aumento del gasto cardíaco; en el embarazo el estado inflamatorio fisiológico y el cortisol elevado mantienen una neutrofilia leve sostenida.',
        pista: 'Leucocitosis moderada, sin desviación izquierda ni células inmaduras, en una persona asintomática. En el embarazo son normales cifras de hasta 15 000/µL.',
      },
    ],
    bajo: [
      {
        causa: 'Infecciones virales (dengue, influenza)',
        mecanismo: 'Los virus inhiben directamente los precursores medulares y redistribuyen los linfocitos hacia los tejidos linfoides, mientras el interferón frena la salida de neutrófilos.',
        pista: 'Leucopenia con linfocitosis relativa y a veces linfocitos atípicos. En dengue la leucopenia precede a la caída de plaquetas.',
      },
      {
        causa: 'Quimioterapia y fármacos',
        mecanismo: 'Los citostáticos destruyen los progenitores en división. Como el neutrófilo circulante vive apenas de 6 a 12 horas, el recuento cae en cuanto se corta el suministro medular.',
        pista: 'Nadir predecible entre los días 7 y 14 del ciclo. La fiebre en ese momento es una urgencia oncológica: neutropenia febril.',
      },
      {
        causa: 'Aplasia medular',
        mecanismo: 'La médula pierde sus células madre, muchas veces por un ataque autoinmune mediado por linfocitos T, y deja de producir las tres series.',
        pista: 'Pancitopenia con reticulocitos bajos y sin células anómalas en sangre. La biopsia muestra una médula vacía sustituida por grasa.',
      },
      {
        causa: 'Hiperesplenismo',
        mecanismo: 'El bazo agrandado secuestra y destruye leucocitos, principalmente neutrófilos, retirándolos de la circulación aunque la producción sea normal.',
        pista: 'Leucopenia moderada con esplenomegalia y, casi siempre, trombocitopenia acompañante. La médula está normal o hiperplásica.',
      },
      {
        causa: 'Sepsis grave (mal pronóstico)',
        mecanismo: 'El consumo periférico masivo supera la capacidad de producción y la propia toxina bacteriana deprime la médula. La reserva se agota.',
        pista: 'Leucopenia en un séptico es peor señal que la leucocitosis: forma parte de los criterios de gravedad y se asocia a mayor mortalidad.',
      },
    ],
    dato: 'Un leucocito total normal puede esconder una infección grave: si los segmentados suben y los linfocitos bajan en la misma proporción, el total no se mueve.',
  },
  blastos: {
    queMide: 'Células madre hematopoyéticas inmaduras. En sangre periférica su valor normal es cero: no deberían salir de la médula.',
    simple: 'Células "bebé" que nunca deberían estar en tu sangre.',
    alto: [
      {
        causa: 'Leucemia aguda',
        mecanismo: 'Una mutación bloquea la maduración del progenitor, que sigue dividiéndose sin diferenciarse. La médula se llena de blastos que desbordan al espacio vascular y desplazan a las series normales.',
        pista: 'Más del 20 % de blastos en sangre o médula define leucemia aguda según la OMS. Se acompaña de anemia y trombocitopenia, y en el frotis hay hiato leucémico: blastos y células maduras, sin formas intermedias.',
      },
      {
        causa: 'Crisis blástica de leucemia mieloide crónica',
        mecanismo: 'El clon con cromosoma Filadelfia acumula mutaciones adicionales y pierde la capacidad de madurar, así que una leucemia crónica de años se transforma en una aguda.',
        pista: 'Paciente ya conocido con LMC que pasa de leucocitosis con toda la serie madurativa a más de 20 % de blastos, con anemia y esplenomegalia crecientes.',
      },
      {
        causa: 'Síndromes mielodisplásicos',
        mecanismo: 'El clon displásico madura mal y de forma inefectiva: muchas células mueren dentro de la médula y algunos blastos escapan a la sangre sin llegar al umbral de leucemia aguda.',
        pista: 'Citopenias con blastos por debajo del 20 % y displasia en el frotis (neutrófilos hipogranulares, anomalía de Pelger-Huët adquirida). El porcentaje de blastos es lo que marca el pronóstico.',
      },
    ],
    bajo: [
      {
        causa: 'Cero es lo normal',
        mecanismo: 'El blasto vive confinado en la médula ósea porque expresa moléculas de anclaje al estroma (CXCR4, VLA-4) que sólo pierde al madurar. Que no haya ninguno en sangre significa que esa barrera funciona.',
        pista: 'No existe un valor bajo patológico: cero es el resultado deseable. Un solo blasto en el frotis ya obliga a revisar la lámina con un hematólogo.',
      },
    ],
    dato: 'Más de 20 % de blastos en sangre o médula define leucemia aguda según la OMS. Un solo blasto en el frotis obliga a revisar la lámina con un hematólogo.',
  },
  promielocitos: {
    queMide: 'Precursor mieloide inmaduro, un escalón por delante del blasto. No debería aparecer en sangre periférica.',
    simple: 'Otra célula inmadura que solo debería estar dentro del hueso.',
    alto: [
      {
        causa: 'Leucemia promielocítica aguda (LPA, M3)',
        mecanismo: 'La translocación t(15;17) fusiona los genes PML y RARα y bloquea la maduración justo en el estadio de promielocito. Sus gránulos, cargados de factor tisular, se vuelcan a la sangre y desencadenan coagulación intravascular diseminada.',
        pista: 'Promielocitos hipergranulares con bastones de Auer múltiples, junto a fibrinógeno bajo, dímero D alto y sangrado. Es una urgencia: el ácido transretinoico se inicia ante la sospecha, sin esperar la confirmación genética.',
      },
      {
        causa: 'Reacción leucemoide intensa',
        mecanismo: 'Ante una infección o inflamación extremas, la médula vacía toda su reserva y libera precursores cada vez más inmaduros, incluidos promielocitos, sin que exista clon maligno.',
        pista: 'Toda la serie madurativa presente y en proporción decreciente, sin hiato leucémico, con fosfatasa alcalina leucocitaria alta y foco infeccioso identificable.',
      },
      {
        causa: 'Desviación izquierda extrema',
        mecanismo: 'Es el grado máximo del mismo fenómeno: la demanda periférica es tan alta que la médula exporta células que aún no han terminado de madurar.',
        pista: 'Aparece junto a mielocitos y metamielocitos, nunca sola. Si el paciente está séptico, es un marcador de gravedad más que un dato hematológico.',
      },
    ],
    bajo: [
      {
        causa: 'Cero es lo normal',
        mecanismo: 'El promielocito es una célula estrictamente medular; sólo abandona el hueso cuando la demanda o un clon maligno rompen el control de la salida.',
        pista: 'Su ausencia en sangre es lo esperable en cualquier persona sana; no hay ninguna condición que se defina por tener "pocos".',
      },
    ],
    dato: 'La leucemia promielocítica aguda es una urgencia hematológica por su riesgo de coagulación intravascular diseminada, pero es la de mejor pronóstico si se trata a tiempo.',
  },
  mielocitos: {
    queMide: 'Precursor mieloide intermedio. Su aparición en sangre indica que la médula está expulsando células antes de tiempo.',
    simple: 'Célula "adolescente" que salió antes de estar lista.',
    alto: [
      {
        causa: 'Infección bacteriana grave',
        mecanismo: 'El G-CSF liberado en la infección acelera la salida de la reserva medular. Cuando el compartimento de neutrófilos maduros y abastonados se agota, empiezan a salir mielocitos.',
        pista: 'Aparecen junto a abastonados y metamielocitos, con vacuolización y granulaciones tóxicas en los neutrófilos. Su presencia indica que la infección es seria.',
      },
      {
        causa: 'Reacción leucemoide',
        mecanismo: 'Es la respuesta medular llevada al extremo, con leucocitosis que imita a una leucemia pero conserva la maduración ordenada y no es clonal.',
        pista: 'Leucocitos por encima de 50 000 con toda la serie presente, fosfatasa alcalina leucocitaria ALTA y causa desencadenante clara. En la LMC esa fosfatasa está baja.',
      },
      {
        causa: 'Leucemia mieloide crónica',
        mecanismo: 'El gen de fusión BCR-ABL1 del cromosoma Filadelfia crea una tirosina cinasa siempre activa que expande el clon mieloide. A diferencia de las agudas, aquí las células sí maduran, y por eso salen todos los estadios a la vez.',
        pista: 'El frotis muestra el espectro completo con dos picos, en mielocitos y en segmentados, junto con basofilia y eosinofilia. La basofilia persistente es la pista que más orienta.',
      },
      {
        causa: 'Mielofibrosis',
        mecanismo: 'La fibrosis reticulínica desestructura la médula y obliga a la hematopoyesis a desplazarse al bazo y al hígado. Esa hematopoyesis extramedular vierte a la sangre precursores sin control.',
        pista: 'Cuadro leucoeritroblástico: precursores mieloides junto con eritroblastos nucleados y hematíes en lágrima (dacriocitos), con esplenomegalia marcada.',
      },
    ],
    bajo: [
      {
        causa: 'Cero es lo normal',
        mecanismo: 'Los mielocitos maduran dentro del hueso y sólo salen cuando la barrera medular se ve superada por la demanda o desestructurada por una enfermedad.',
        pista: 'Cero es el valor esperable; cualquier cifra por encima de cero es el hallazgo que hay que explicar.',
      },
    ],
    dato: 'Mielocitos + metamielocitos + abastonados juntos son lo que el clínico llama "desviación izquierda": la médula vaciando su reserva.',
  },
  metamielocitos: {
    queMide: 'Último precursor antes del abastonado. En sangre periférica su valor normal también es cero.',
    simple: 'Célula casi lista, pero todavía no debería andar circulando.',
    alto: [
      {
        causa: 'Infección bacteriana severa',
        mecanismo: 'Es el escalón que sale justo después de agotarse los abastonados: la demanda de neutrófilos supera lo que la reserva madura puede cubrir y la médula exporta el estadio anterior.',
        pista: 'Su presencia marca una desviación izquierda más profunda que la de los abastonados solos y suele acompañarse de granulaciones tóxicas.',
      },
      {
        causa: 'Sepsis',
        mecanismo: 'La liberación masiva y sostenida de citocinas mantiene el estímulo sobre la médula mientras el consumo periférico es continuo, así que la exportación de precursores no se detiene.',
        pista: 'Puede coexistir con leucopenia si la médula ya está agotada: esa combinación de leucocitos bajos con formas inmaduras es un signo de mal pronóstico.',
      },
      {
        causa: 'Reacción leucemoide',
        mecanismo: 'La respuesta reactiva extrema arrastra a la sangre toda la escalera madurativa, incluidos los metamielocitos, sin que exista proliferación clonal.',
        pista: 'Se distingue de la LMC por la fosfatasa alcalina leucocitaria alta, la ausencia de basofilia y la presencia de un foco desencadenante.',
      },
      {
        causa: 'Trastornos mieloproliferativos',
        mecanismo: 'La proliferación clonal de la serie mieloide vierte de forma continua células en distintos grados de maduración, ya sea desde la médula o desde focos extramedulares.',
        pista: 'Cuadro persistente en el tiempo, sin infección que lo explique, con esplenomegalia. Obliga a estudiar JAK2, BCR-ABL1, CALR o MPL.',
      },
    ],
    bajo: [
      {
        causa: 'Cero es lo normal',
        mecanismo: 'Como todos los precursores, el metamielocito permanece anclado al estroma medular hasta terminar su maduración.',
        pista: 'No hay valor bajo patológico. Lo que se interpreta es su aparición, no su ausencia.',
      },
    ],
    dato: 'Si ves metamielocitos y mielocitos pero NO blastos, piensa primero en infección grave antes que en leucemia.',
  },
  abastonados: {
    queMide: 'Neutrófilos jóvenes, con el núcleo todavía en forma de bastón sin segmentar. Son la reserva que la médula suelta primero cuando hay demanda.',
    simple: 'Soldados recién reclutados que salen al campo antes de terminar el entrenamiento.',
    alto: [
      {
        causa: 'Infección bacteriana aguda (desviación izquierda)',
        mecanismo: 'La médula guarda un depósito de neutrófilos casi maduros equivalente a varios días de producción. Ante una infección, el G-CSF lo vacía en horas y con él salen los abastonados, que normalmente esperarían a segmentarse.',
        pista: 'Es el hallazgo más precoz de infección bacteriana en el hemograma: puede aparecer incluso antes de que suba el recuento total de leucocitos.',
      },
      {
        causa: 'Sepsis',
        mecanismo: 'El consumo periférico continuo mantiene vaciada la reserva, así que la proporción de formas jóvenes en circulación se mantiene alta mientras dure el proceso.',
        pista: 'Un índice de abastonados sobre neutrófilos totales por encima de 0,2 se asocia a infección bacteriana grave, sobre todo en neonatos.',
      },
      {
        causa: 'Inflamación aguda',
        mecanismo: 'Cualquier proceso que libere IL-1, IL-6 y TNF —pancreatitis, quemaduras, infarto, vasculitis— estimula la granulopoyesis igual que una infección, aunque no haya bacterias.',
        pista: 'Desviación izquierda sin foco infeccioso ni fiebre alta, con proteína C reactiva elevada. No siempre significa infección.',
      },
      {
        causa: 'Post-quirúrgico',
        mecanismo: 'El trauma quirúrgico combina daño tisular, respuesta de estrés con cortisol y catecolaminas, y liberación de citocinas: los tres estimulan la salida de neutrófilos jóvenes.',
        pista: 'Aparece en las primeras 24-48 horas y cede sola. Sólo preocupa si en vez de bajar se acentúa hacia el tercer o cuarto día, lo que sugiere infección de la herida.',
      },
    ],
    bajo: [
      {
        causa: 'Tener 0 % no es una enfermedad: es lo habitual en una persona sana',
        mecanismo: 'En reposo la médula libera casi exclusivamente neutrófilos ya segmentados, así que lo esperable es no encontrar abastonados o encontrar muy pocos.',
        pista: 'El reporte imprime un mínimo de 3 % por convención, pero ese límite inferior no tiene significado clínico. Lo que se interpreta en este parámetro es siempre el techo.',
      },
    ],
    dato: 'El reporte de referencia imprime [3-5] %, pero un hemograma sano puede traer 0 % de abastonados sin ningún problema. Lo que importa es el techo: por encima de 5-10 % hay desviación izquierda.',
  },
  segmentados: {
    queMide: 'Neutrófilos maduros, con el núcleo ya segmentado en lóbulos. Son la primera línea contra bacterias y hongos.',
    simple: 'Los soldados veteranos que atacan bacterias.',
    alto: [
      {
        causa: 'Infección bacteriana',
        mecanismo: 'El neutrófilo es la célula que fagocita y destruye bacterias extracelulares. Las citocinas de la infección lo movilizan desde la reserva medular y desde el endotelio, y aceleran su producción.',
        pista: 'Neutrofilia con desviación izquierda y granulaciones tóxicas, cuerpos de Döhle o vacuolas en el citoplasma. Esos tres signos morfológicos apuntan a infección bacteriana activa.',
      },
      {
        causa: 'Inflamación y necrosis tisular',
        mecanismo: 'El tejido necrótico libera patrones moleculares de daño (DAMPs) que activan la misma vía de citocinas que una bacteria, y reclutan neutrófilos para limpiar los restos.',
        pista: 'Neutrofilia tras infarto de miocardio, quemadura, pancreatitis o cirugía, sin fiebre séptica ni foco. Es la razón por la que un hemograma no distingue solo infección de inflamación estéril.',
      },
      {
        causa: 'Corticoides, estrés, ejercicio',
        mecanismo: 'Cerca de la mitad de los neutrófilos del torrente están pegados al endotelio y no se cuentan. Los corticoides y las catecolaminas los desprenden y además bloquean su salida a los tejidos, así que se acumulan en el compartimento circulante.',
        pista: 'Neutrofilia en horas sin desviación izquierda ni granulaciones tóxicas, acompañada de linfopenia y eosinopenia. Ese trío es la firma del efecto corticoide.',
      },
      {
        causa: 'Tabaquismo',
        mecanismo: 'La irritación crónica de la vía aérea mantiene una inflamación de bajo grado que estimula la granulopoyesis de forma permanente.',
        pista: 'Neutrofilia leve y estable en un fumador asintomático, sin desviación izquierda. Es una de las causas más frecuentes de leucocitosis crónica inexplicada.',
      },
    ],
    bajo: [
      {
        causa: 'Infección viral',
        mecanismo: 'El interferón de tipo I frena la liberación medular de neutrófilos y favorece su marginación al endotelio, mientras la respuesta se desplaza hacia los linfocitos.',
        pista: 'Neutropenia leve y transitoria con linfocitosis relativa, en un cuadro viral típico. Se recupera sola al ceder la infección.',
      },
      {
        causa: 'Quimioterapia',
        mecanismo: 'Los citostáticos eliminan el progenitor granulocítico en división. Como el neutrófilo circulante dura menos de un día, en cuanto se corta la producción el recuento se desploma.',
        pista: 'Nadir entre los días 7 y 14. Por debajo de 500/µL hay neutropenia severa: cualquier fiebre en ese momento es neutropenia febril y exige antibiótico inmediato.',
      },
      {
        causa: 'Agranulocitosis por fármacos',
        mecanismo: 'Reacción idiosincrásica, a menudo inmune, contra el precursor granulocítico o el propio neutrófilo. Metamizol, metimazol, clozapina y sulfonamidas son los implicados clásicos.',
        pista: 'Neutropenia profunda y aislada, con hemoglobina y plaquetas normales, en alguien que empezó un fármaco nuevo. Se resuelve al suspenderlo; hay que sospecharla ante odinofagia y fiebre.',
      },
      {
        causa: 'Déficit de B12 o folato',
        mecanismo: 'La síntesis de ADN alterada afecta a las tres series, no sólo a la roja. La granulopoyesis se vuelve inefectiva y muchos precursores mueren dentro de la médula.',
        pista: 'Neutropenia leve dentro de una pancitopenia, con VCM alto y neutrófilos hipersegmentados. Los hipersegmentados aparecen antes que la neutropenia.',
      },
    ],
    dato: 'Neutrófilos con más de 5 lóbulos ("hipersegmentados") son un signo clásico de déficit de B12 o folato, y aparecen antes de que el VCM suba.',
  },
  eosinofilos: {
    queMide: 'Leucocitos especializados en parásitos multicelulares y en la respuesta alérgica. Sus gránulos son tóxicos para los helmintos.',
    simple: 'Los que se activan cuando tienes alergia o parásitos.',
    alto: [
      {
        causa: 'Alergias: rinitis, asma, dermatitis',
        mecanismo: 'La respuesta Th2 libera IL-5, el factor de crecimiento específico del eosinófilo, junto con IL-4 e IL-13. La IL-5 aumenta su producción medular, prolonga su vida y lo recluta al tejido inflamado.',
        pista: 'Eosinofilia leve, en general entre 500 y 1 500/µL, con IgE alta y clínica atópica. Rara vez supera los 1 500 en alergia simple.',
      },
      {
        causa: 'Parasitosis por helmintos',
        mecanismo: 'Los gusanos son demasiado grandes para fagocitarse. El eosinófilo se adhiere a su superficie y descarga proteína básica mayor y proteína catiónica, que la perforan. La respuesta Th2 con IL-5 dispara su producción.',
        pista: 'Sólo los helmintos tisulares dan eosinofilia; los protozoos como Giardia o amebas NO la producen. En el Perú, ante eosinofilia hay que descartar estrongiloidiasis, fasciolasis, toxocariasis e hidatidosis.',
      },
      {
        causa: 'Fármacos',
        mecanismo: 'Reacción de hipersensibilidad mediada por linfocitos T que liberan IL-5. Puede ser asintomática o formar parte de un síndrome DRESS con exantema y daño de órgano.',
        pista: 'Es una de las causas más frecuentes de eosinofilia en el hospital. Si aparece con exantema, fiebre y transaminasas altas, pensar en DRESS y suspender el fármaco.',
      },
      {
        causa: 'Síndrome hipereosinofílico',
        mecanismo: 'Proliferación clonal o idiopática de eosinófilos, a veces por reordenamiento de PDGFRA. Los gránulos liberados dañan directamente el endocardio, el pulmón y el nervio periférico.',
        pista: 'Eosinófilos por encima de 1 500/µL mantenidos más de 6 meses con daño de órgano. Es lo que obliga a estudiar médula y descartar clonalidad.',
      },
      {
        causa: 'Insuficiencia suprarrenal',
        mecanismo: 'El cortisol normalmente suprime los eosinófilos. Al faltar, desaparece ese freno fisiológico y su número sube.',
        pista: 'Eosinofilia leve junto con hiponatremia, hiperpotasemia e hipotensión. Es una pista poco conocida pero muy sugerente de enfermedad de Addison.',
      },
    ],
    bajo: [
      {
        causa: 'Corticoides',
        mecanismo: 'Los glucocorticoides inducen apoptosis del eosinófilo y bloquean su salida de la médula. El efecto es tan rápido y constante que se usaba como prueba funcional suprarrenal.',
        pista: 'Eosinopenia casi absoluta en horas, junto con neutrofilia y linfopenia. No requiere ninguna acción.',
      },
      {
        causa: 'Infección bacteriana aguda',
        mecanismo: 'El cortisol endógeno del estrés agudo y la migración de los eosinófilos a los tejidos vacían el compartimento circulante durante la fase aguda.',
        pista: 'La eosinopenia acompaña a la neutrofilia en la infección bacteriana y se ha propuesto como marcador precoz de sepsis. Se recupera en la convalecencia.',
      },
      {
        causa: 'Estrés — tener pocos no es patológico',
        mecanismo: 'Cualquier situación con cortisol elevado reduce los eosinófilos. Además, su valor normal ya está tan cerca de cero que el límite inferior carece de significado.',
        pista: 'Un 0 % de eosinófilos en una persona sana no se investiga. En este parámetro sólo se interpreta el valor alto.',
      },
    ],
    dato: 'Regla mnemotécnica de las causas: alergia, asma, parásitos, fármacos y neoplasias. En el Perú, ante eosinofilia siempre hay que descartar parasitosis intestinal.',
  },
  basofilos: {
    queMide: 'Los leucocitos menos abundantes. Liberan histamina y heparina; participan en la reacción alérgica inmediata.',
    simple: 'Los más raros de todos: sueltan histamina y te hacen picar.',
    alto: [
      {
        causa: 'Leucemia mieloide crónica (dato muy sugerente)',
        mecanismo: 'El basófilo pertenece a la serie mieloide, así que el clon BCR-ABL1 lo expande junto con los neutrófilos. La basofilia es proliferación clonal, no respuesta alérgica.',
        pista: 'Es el hallazgo que más orienta en una leucocitosis por lo demás inespecífica. Su aumento progresivo anuncia la fase acelerada de la enfermedad.',
      },
      {
        causa: 'Reacciones alérgicas',
        mecanismo: 'El basófilo tiene receptores de alta afinidad para la IgE; al entrecruzarse degranula y libera histamina. En la inflamación alérgica sostenida aumenta también su producción.',
        pista: 'Basofilia muy leve y poco fiable de medir. Sólo tiene valor acompañando a la clínica, nunca aislada.',
      },
      {
        causa: 'Hipotiroidismo',
        mecanismo: 'La falta de hormona tiroidea reduce la degradación de los basófilos y altera el metabolismo de la histamina, lo que eleva discretamente su recuento.',
        pista: 'Basofilia mínima, sin relevancia clínica propia. Es una asociación descrita, no un criterio diagnóstico.',
      },
      {
        causa: 'Trastornos mieloproliferativos',
        mecanismo: 'En la policitemia vera, la trombocitemia esencial y la mielofibrosis el clon afecta a toda la serie mieloide, de la que el basófilo forma parte.',
        pista: 'Basofilia persistente junto a otra citosis (hematíes o plaquetas) obliga a estudiar JAK2, y a descartar antes BCR-ABL1.',
      },
    ],
    bajo: [
      {
        causa: 'Casi imposible de detectar porque su valor normal ya es cercano a cero',
        mecanismo: 'Los basófilos representan menos del 1 % de los leucocitos. Con un diferencial de 100 células, la diferencia entre "normal" y "bajo" cae dentro del error de conteo.',
        pista: 'La basopenia no se informa ni se investiga. Este parámetro sólo se lee hacia arriba.',
      },
    ],
    dato: 'La basofilia persistente es una de las pocas pistas de leucemia mieloide crónica en un hemograma que por lo demás parece solo "leucocitosis".',
  },
  monocitos: {
    queMide: 'Precursores circulantes de los macrófagos. Salen a los tejidos, fagocitan y presentan antígenos a los linfocitos.',
    simple: 'Los "basureros" que se comen restos y microbios, y avisan al resto del sistema.',
    alto: [
      {
        causa: 'Infecciones crónicas: tuberculosis, brucelosis',
        mecanismo: 'Los patógenos intracelulares sobreviven dentro de los fagocitos, así que la defensa depende de la inmunidad celular: el macrófago activado por interferón gamma forma granulomas. Eso mantiene una demanda continua de monocitos.',
        pista: 'Monocitosis mantenida en el tiempo, sin leucocitosis llamativa, en un paciente con fiebre prolongada o pérdida de peso. En el Perú obliga a descartar tuberculosis.',
      },
      {
        causa: 'Fase de recuperación de una infección',
        mecanismo: 'Una vez controlada la infección, los monocitos acuden a retirar neutrófilos apoptóticos y restos celulares, y a iniciar la reparación del tejido.',
        pista: 'Aparece después del pico neutrofílico, junto con la mejoría clínica. Se llama monocitosis de recuperación y es buena señal.',
      },
      {
        causa: 'Enfermedades autoinmunes',
        mecanismo: 'La inflamación crónica mediada por complejos inmunes mantiene activado el sistema mononuclear fagocítico, que se encarga de retirarlos.',
        pista: 'Monocitosis leve en lupus, artritis reumatoide o enfermedad inflamatoria intestinal, acompañando a otros marcadores de actividad.',
      },
      {
        causa: 'Leucemia mielomonocítica',
        mecanismo: 'Neoplasia clonal con rasgos mielodisplásicos y mieloproliferativos a la vez, en la que el precursor monocítico prolifera de forma autónoma.',
        pista: 'Monocitosis absoluta persistente por encima de 1 000/µL durante más de 3 meses, con displasia en el frotis, en un adulto mayor. Es el criterio que define la LMMC.',
      },
    ],
    bajo: [
      {
        causa: 'Aplasia medular',
        mecanismo: 'Al desaparecer el progenitor mieloide común se pierde también la monopoyesis, dentro de una falla global de la médula.',
        pista: 'La monocitopenia forma parte de la pancitopenia; nunca aparece sola. Su presencia refuerza la sospecha de falla medular.',
      },
      {
        causa: 'Corticoides',
        mecanismo: 'Los glucocorticoides reducen la salida de monocitos desde la médula y aceleran su marginación, igual que hacen con linfocitos y eosinófilos.',
        pista: 'Monocitopenia transitoria tras una dosis alta, sin ninguna consecuencia clínica.',
      },
      {
        causa: 'Tricoleucemia',
        mecanismo: 'La leucemia de células peludas infiltra la médula y produce, de forma muy característica, una monocitopenia casi absoluta junto con pancitopenia.',
        pista: 'Es un dato casi patognomónico: pancitopenia con esplenomegalia grande, sin adenopatías y con monocitos prácticamente ausentes.',
      },
    ],
    dato: 'La monocitosis en la convalecencia se llama "monocitosis de recuperación" y es buena señal: significa que la infección está cediendo.',
  },
  linfocitos: {
    queMide: 'Linfocitos B y T: la inmunidad específica. Producen anticuerpos y memoria inmunológica.',
    simple: 'La memoria del sistema inmune: recuerdan a los virus que ya viste.',
    alto: [
      {
        causa: 'Infecciones virales',
        mecanismo: 'La defensa antiviral depende del linfocito T citotóxico, que prolifera clonalmente al reconocer el antígeno. A la vez, los neutrófilos bajan, así que la proporción de linfocitos sube por partida doble.',
        pista: 'Distinguir linfocitosis relativa (porcentaje alto con absoluto normal) de la absoluta. En virosis suele ser relativa y transitoria.',
      },
      {
        causa: 'Mononucleosis infecciosa',
        mecanismo: 'El virus de Epstein-Barr infecta al linfocito B a través de CD21. Los linfocitos T CD8 responden proliferando de forma masiva: las células grandes y atípicas que se ven no son las infectadas, sino los T que las atacan.',
        pista: 'Linfocitos atípicos de Downey por encima del 10 %, con fiebre, faringitis y adenopatías. Anticuerpos heterófilos positivos. Evitar amoxicilina: provoca exantema.',
      },
      {
        causa: 'Tos ferina',
        mecanismo: 'La toxina pertussis bloquea los receptores de quimiocinas que hacen que los linfocitos salgan de la sangre hacia los ganglios. Quedan atrapados en la circulación en vez de multiplicarse.',
        pista: 'Linfocitosis absoluta muy alta, a veces por encima de 20 000/µL, con linfocitos de aspecto maduro y normal en un lactante con tos paroxística. La magnitud se correlaciona con la gravedad.',
      },
      {
        causa: 'Leucemia linfática crónica',
        mecanismo: 'Acumulación clonal de linfocitos B maduros pero incompetentes, que no mueren por apoptosis. Se van sumando en sangre, médula y ganglios.',
        pista: 'Linfocitosis absoluta mantenida por encima de 5 000/µL en un adulto mayor, con sombras de Gumprecht en el frotis. Se confirma con citometría de flujo.',
      },
      {
        causa: 'Tuberculosis',
        mecanismo: 'La respuesta inmune celular sostenida frente al bacilo mantiene activada la proliferación de linfocitos T durante la evolución crónica de la enfermedad.',
        pista: 'Linfocitosis discreta acompañando a monocitosis; la relación monocito/linfocito alterada se describió clásicamente como marcador de actividad tuberculosa.',
      },
    ],
    bajo: [
      {
        causa: 'VIH',
        mecanismo: 'El virus infecta y destruye a los linfocitos T CD4, que son los que coordinan toda la respuesta inmune. Su número cae de forma progresiva a lo largo de años.',
        pista: 'Linfopenia mantenida por debajo de 1 000/µL sin otra explicación obliga a solicitar serología para VIH. Fue precisamente la pista con la que se describió el sida.',
      },
      {
        causa: 'Corticoides',
        mecanismo: 'Los glucocorticoides inducen apoptosis directa del linfocito y lo redistribuyen hacia los órganos linfoides, retirándolo de la circulación.',
        pista: 'Linfopenia junto con neutrofilia y eosinopenia, en horas. Es reversible al retirar el fármaco y no implica inmunodepresión si el tratamiento es corto.',
      },
      {
        causa: 'Sepsis grave',
        mecanismo: 'La sepsis induce apoptosis masiva de linfocitos T y B, un fenómeno central en la inmunoparálisis que sigue a la fase inflamatoria inicial.',
        pista: 'La linfopenia persistente en un séptico se asocia a peor pronóstico y a infecciones secundarias. Un índice neutrófilo/linfocito muy alto refleja lo mismo.',
      },
      {
        causa: 'Quimioterapia y radioterapia',
        mecanismo: 'El linfocito es de las células más radiosensibles del organismo, y los citostáticos eliminan sus precursores en división.',
        pista: 'Linfopenia prolongada, que puede tardar meses en recuperarse tras terminar el tratamiento, con riesgo de infecciones oportunistas.',
      },
      {
        causa: 'Desnutrición',
        mecanismo: 'La falta de proteínas y micronutrientes atrofia el timo y los tejidos linfoides, y limita la proliferación celular, que exige un alto gasto metabólico.',
        pista: 'El recuento total de linfocitos se usa como marcador nutricional: por debajo de 1 200/µL sugiere desnutrición moderada y por debajo de 800/µL, severa.',
      },
    ],
    dato: 'En niños pequeños el predominio normal es linfocitario, al revés que en adultos. Un hemograma pediátrico con 60 % de linfocitos puede ser perfectamente normal.',
  },
  abastonadosAbs: {
    queMide: 'El número real de abastonados por microlitro, no su proporción.',
    simple: 'Cuántos soldados novatos hay de verdad, no el porcentaje.',
    alto: [
      {
        causa: 'Infección bacteriana aguda',
        mecanismo: 'El vaciamiento de la reserva medular por G-CSF lanza a la sangre neutrófilos no segmentados. El valor absoluto mide cuántos son realmente, sin depender de cuántos leucocitos totales haya.',
        pista: 'Es más fiable que el porcentaje: un 10 % sobre 3 000 leucocitos son sólo 300/µL, mientras que el mismo 10 % sobre 25 000 son 2 500/µL.',
      },
      {
        causa: 'Sepsis',
        mecanismo: 'El consumo periférico sostenido mantiene la exportación de formas jóvenes mientras la médula intenta seguir el ritmo.',
        pista: 'El índice de abastonados sobre neutrófilos totales por encima de 0,2 es un criterio clásico de sepsis, sobre todo en el recién nacido.',
      },
    ],
    bajo: [
      {
        causa: 'Cero o casi cero es lo normal',
        mecanismo: 'En reposo la médula exporta neutrófilos ya segmentados, así que en sangre apenas circulan formas en banda.',
        pista: 'No hay valor bajo patológico. Este parámetro se lee sólo hacia arriba.',
      },
    ],
    dato: 'El valor absoluto evita el engaño del porcentaje: 10 % de abastonados sobre 3 000 leucocitos es mucho menos grave que 10 % sobre 25 000.',
  },
  segmentadosAbs: {
    queMide: 'El número real de neutrófilos maduros por microlitro. Es el que define neutropenia y su gravedad.',
    simple: 'Cuántos soldados veteranos tienes de verdad.',
    alto: [
      {
        causa: 'Infección bacteriana',
        mecanismo: 'La movilización de la reserva medular y el aumento de la granulopoyesis elevan el número real de neutrófilos circulantes, que es lo que mide este parámetro.',
        pista: 'Neutrofilia absoluta por encima de 7 500/µL. Es más informativa que el porcentaje, que puede parecer alto sólo porque bajaron los linfocitos.',
      },
      {
        causa: 'Inflamación',
        mecanismo: 'El daño tisular estéril libera las mismas citocinas que una infección y recluta neutrófilos con igual eficacia.',
        pista: 'Neutrofilia absoluta con proteína C reactiva alta pero sin foco infeccioso. No basta para indicar antibiótico.',
      },
      {
        causa: 'Corticoides',
        mecanismo: 'La desmarginación desde el endotelio y el bloqueo de la salida a los tejidos aumentan el número contado en el torrente, sin que la producción cambie.',
        pista: 'Neutrofilia absoluta sin desviación izquierda y con linfopenia asociada. No refleja infección: si el paciente recibe corticoides, este dato pierde valor diagnóstico.',
      },
    ],
    bajo: [
      {
        causa: 'Neutropenia por quimioterapia',
        mecanismo: 'Los citostáticos eliminan el precursor granulocítico, y como el neutrófilo circulante vive horas, el recuento absoluto cae rápidamente al agotarse el suministro.',
        pista: 'Es el parámetro que decide la conducta: por debajo de 1 000/µL hay riesgo, por debajo de 500/µL neutropenia severa, y con fiebre exige antibiótico de amplio espectro sin esperar cultivos.',
      },
      {
        causa: 'Agranulocitosis',
        mecanismo: 'Destrucción inmune o tóxica del precursor granulocítico por un fármaco, con desaparición casi total de la serie en pocos días.',
        pista: 'Neutrófilos por debajo de 500/µL con hemoglobina y plaquetas normales. Buscar metamizol, metimazol, clozapina o sulfonamidas y suspenderlos de inmediato.',
      },
      {
        causa: 'Infección viral',
        mecanismo: 'El interferón frena la liberación medular y aumenta la marginación, así que baja el número de neutrófilos realmente circulantes.',
        pista: 'Neutropenia leve, en general por encima de 1 000/µL, transitoria y sin repercusión clínica.',
      },
    ],
    dato: 'Por debajo de 500/µL hay neutropenia severa y riesgo de infección grave: es el umbral que obliga a aislamiento y antibiótico ante cualquier fiebre.',
  },
  eosinofilosAbs: {
    queMide: 'El número real de eosinófilos por microlitro. Es el criterio formal de eosinofilia, no el porcentaje.',
    simple: 'Cuántas células de alergia/parásitos hay realmente.',
    alto: [
      {
        causa: 'Parasitosis',
        mecanismo: 'La respuesta Th2 frente a helmintos tisulares libera IL-5, que multiplica la producción medular de eosinófilos y prolonga su supervivencia.',
        pista: 'Suele dar las cifras absolutas más altas. En el Perú obliga a descartar Strongyloides, Fasciola, Toxocara e hidatidosis según la procedencia.',
      },
      {
        causa: 'Alergia',
        mecanismo: 'La inflamación alérgica crónica mantiene niveles elevados de IL-5 y recluta eosinófilos a la mucosa respiratoria o a la piel.',
        pista: 'Eosinofilia leve, entre 500 y 1 500/µL. Si supera los 1 500 de forma mantenida, la alergia sola ya no lo explica.',
      },
      {
        causa: 'Fármacos',
        mecanismo: 'Hipersensibilidad mediada por linfocitos T que producen IL-5 frente al fármaco o sus metabolitos.',
        pista: 'Es la causa más frecuente de eosinofilia en pacientes hospitalizados. Revisar toda la lista de medicamentos antes de pedir estudios complejos.',
      },
      {
        causa: 'Neoplasias',
        mecanismo: 'Puede ser clonal, cuando el propio eosinófilo forma parte del tumor, o paraneoplásica, cuando el tumor secreta IL-5 o GM-CSF.',
        pista: 'Eosinofilia persistente sin causa alérgica ni parasitaria en un adulto obliga a descartar linfoma de Hodgkin, leucemias y tumores sólidos.',
      },
    ],
    bajo: [
      {
        causa: 'Corticoides — no tiene relevancia clínica',
        mecanismo: 'Los glucocorticoides inducen apoptosis del eosinófilo y bloquean su salida medular, y llevan el recuento prácticamente a cero.',
        pista: 'La eosinopenia no se investiga ni se trata. En este parámetro sólo se interpreta el valor alto.',
      },
    ],
    dato: 'La eosinofilia se define por el absoluto: leve 500-1 500, moderada 1 500-5 000 y severa por encima de 5 000/µL.',
  },
  basofilosAbs: {
    queMide: 'El número real de basófilos por microlitro.',
    simple: 'Cuántos basófilos hay de verdad.',
    alto: [
      {
        causa: 'Leucemia mieloide crónica',
        mecanismo: 'El clon BCR-ABL1 expande toda la serie mieloide, y el basófilo forma parte de ella. Su aumento es proliferación clonal, no respuesta a un alérgeno.',
        pista: 'La basofilia absoluta es uno de los hallazgos más orientadores hacia LMC, y su progresión marca el paso a fase acelerada.',
      },
      {
        causa: 'Trastornos mieloproliferativos',
        mecanismo: 'En la policitemia vera, la mielofibrosis y la trombocitemia esencial el clon mieloide incluye al precursor basófilo.',
        pista: 'Basofilia absoluta persistente junto a poliglobulia o trombocitosis: estudiar JAK2 tras descartar BCR-ABL1.',
      },
    ],
    bajo: [
      {
        causa: 'Sin relevancia clínica',
        mecanismo: 'El basófilo representa menos del 1 % de los leucocitos, así que su límite inferior normal ya está prácticamente en cero.',
        pista: 'La basopenia no tiene significado diagnóstico ni se informa como hallazgo.',
      },
    ],
    dato: 'Es el leucocito menos abundante: representa menos del 1 % del total, así que su porcentaje es muy poco fiable y el absoluto manda.',
  },
  monocitosAbs: {
    queMide: 'El número real de monocitos por microlitro. Define monocitosis por encima de 1 000/µL.',
    simple: 'Cuántos "basureros" hay realmente.',
    alto: [
      {
        causa: 'Tuberculosis',
        mecanismo: 'El bacilo sobrevive dentro del macrófago, así que la defensa depende de la inmunidad celular y de la formación de granulomas. Eso mantiene una demanda continua de monocitos que la médula cubre aumentando su producción.',
        pista: 'Monocitosis absoluta sostenida en un paciente con fiebre prolongada, tos o pérdida de peso. En contexto peruano es una de las primeras causas a descartar.',
      },
      {
        causa: 'Infección crónica',
        mecanismo: 'Brucelosis, endocarditis subaguda o infecciones fúngicas profundas mantienen activado el sistema mononuclear fagocítico durante semanas.',
        pista: 'Monocitosis estable en el tiempo, a diferencia de la neutrofilia que fluctúa con los picos febriles.',
      },
      {
        causa: 'Recuperación de infección',
        mecanismo: 'Terminada la fase aguda, los monocitos acuden a retirar neutrófilos apoptóticos y detritos, y a coordinar la reparación tisular.',
        pista: 'Aparece después del pico neutrofílico y coincide con la mejoría clínica. Es un hallazgo tranquilizador.',
      },
      {
        causa: 'Leucemia mielomonocítica crónica',
        mecanismo: 'Neoplasia clonal mixta mielodisplásica y mieloproliferativa en la que el precursor monocítico prolifera de forma autónoma.',
        pista: 'Monocitosis absoluta > 1 000/µL que además supera el 10 % de los leucocitos y persiste más de 3 meses, en un adulto mayor con displasia en el frotis.',
      },
    ],
    bajo: [
      {
        causa: 'Aplasia',
        mecanismo: 'La pérdida de los progenitores hematopoyéticos suprime también la monopoyesis, dentro de una falla global de la médula.',
        pista: 'Forma parte de la pancitopenia; su presencia refuerza que el problema es de producción y no periférico.',
      },
      {
        causa: 'Corticoides',
        mecanismo: 'Los glucocorticoides reducen la liberación medular de monocitos y aumentan su marginación.',
        pista: 'Monocitopenia transitoria y sin consecuencias, que acompaña a la neutrofilia y la linfopenia del efecto corticoide.',
      },
    ],
    dato: 'Una monocitosis absoluta persistente por encima de 1 000/µL en un adulto mayor obliga a descartar leucemia mielomonocítica crónica.',
  },
  linfocitosAbs: {
    queMide: 'El número real de linfocitos por microlitro. Es el que se usa para definir linfocitosis y linfopenia.',
    simple: 'Cuántas células de memoria inmune tienes de verdad.',
    alto: [
      {
        causa: 'Mononucleosis',
        mecanismo: 'La expansión clonal de linfocitos T CD8 que atacan a los linfocitos B infectados por el virus de Epstein-Barr eleva el recuento absoluto de forma marcada.',
        pista: 'Linfocitosis absoluta con más de 10 % de linfocitos atípicos, fiebre, faringitis y adenopatías en un adolescente o adulto joven.',
      },
      {
        causa: 'Tos ferina',
        mecanismo: 'La toxina pertussis bloquea los receptores de quimiocinas que permiten al linfocito salir de la sangre hacia los ganglios, de modo que se acumula en la circulación sin proliferar.',
        pista: 'Cifras absolutas muy altas en un lactante con tos paroxística y linfocitos de morfología normal. La magnitud de la linfocitosis se correlaciona con la gravedad.',
      },
      {
        causa: 'Leucemia linfática crónica',
        mecanismo: 'Acumulación progresiva de un clon de linfocitos B maduros que han perdido la capacidad de morir por apoptosis.',
        pista: 'Linfocitosis absoluta > 5 000/µL mantenida en un adulto mayor, con sombras de Gumprecht en el frotis. La citometría de flujo confirma la clonalidad.',
      },
      {
        causa: 'Infecciones virales',
        mecanismo: 'La proliferación de linfocitos T citotóxicos específicos frente al virus aumenta el número real de linfocitos circulantes.',
        pista: 'A diferencia de la linfocitosis relativa (que sólo refleja la caída de los neutrófilos), aquí sube el absoluto. Es transitoria y se resuelve con la infección.',
      },
    ],
    bajo: [
      {
        causa: 'VIH',
        mecanismo: 'La destrucción progresiva de los linfocitos T CD4 por el virus reduce el recuento total de linfocitos a lo largo de años.',
        pista: 'Linfopenia absoluta < 1 000/µL sin otra causa obliga a solicitar serología. El recuento de CD4 por citometría es el que estadifica la enfermedad.',
      },
      {
        causa: 'Corticoides',
        mecanismo: 'Inducen apoptosis del linfocito y lo redistribuyen a los órganos linfoides, retirándolo de la sangre en cuestión de horas.',
        pista: 'Linfopenia acompañada de neutrofilia y eosinopenia. Reversible al suspender el fármaco.',
      },
      {
        causa: 'Sepsis',
        mecanismo: 'La sepsis provoca apoptosis masiva de linfocitos T y B, el mecanismo central de la inmunoparálisis que sigue a la fase inflamatoria.',
        pista: 'La linfopenia persistente se asocia a mayor mortalidad e infecciones secundarias, y se refleja también en un índice neutrófilo/linfocito muy elevado.',
      },
      {
        causa: 'Desnutrición',
        mecanismo: 'El déficit proteico-calórico atrofia el timo y los tejidos linfoides y limita la proliferación celular, que tiene un coste metabólico alto.',
        pista: 'Se usa como marcador nutricional: menos de 1 200/µL sugiere desnutrición moderada y menos de 800/µL, severa.',
      },
    ],
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
