// Fármacos que actúan en el nefrón. `dianas` cambia el flujo de sus
// transportadores en la animación (0,1 ≈ bloqueo casi completo).

import type { Farmaco, FarmacoId } from './tipos.ts';

const PROX: Farmaco['dianas'][number]['en'] = ['proximal-s1', 'proximal-s3'];

export const FARMACOS: Record<FarmacoId, Farmaco> = {
  acetazolamida: {
    id: 'acetazolamida', nombre: 'Acetazolamida', ejemplos: 'Acetazolamida, dorzolamida (colirio)',
    clase: 'Inhibidor de la anhidrasa carbónica', celula: 'proximal-s1',
    dianas: [
      { t: 'ac4', factor: 0.12 },
      { t: 'ac2', factor: 0.15, en: PROX },
      { t: 'nhe3', factor: 0.4, en: PROX },
      { t: 'nbce1', factor: 0.4 },
    ],
    consecuencias: {
      orina: ['HCO₃⁻ ↑ (orina alcalina)', 'Na⁺ y K⁺ ↑', 'Volumen ↑ leve y pasajero'],
      sangre: ['HCO₃⁻ ↓', 'Cl⁻ ↑', 'K⁺ ↓'],
      potasio: 'baja', acidoBase: 'acidosis', volumen: 'baja',
    },
    usos: ['Glaucoma', 'Mal de altura', 'Alcalosis metabólica', 'Hipertensión intracraneal idiopática'],
    adversos: ['Acidosis metabólica hiperclorémica', 'Hipopotasemia', 'Cálculos de fosfato de calcio', 'Parestesias', 'Encefalopatía en cirróticos (más NH₃)', 'Alergia cruzada con sulfas'],
    resumen: 'Sin anhidrasa carbónica, el H⁺ secretado no puede «desarmar» el HCO₃⁻ filtrado: el bicarbonato sigue por el túbulo y se pierde en la orina.',
    esencial: {
      mecanismo: 'Inhibe la anhidrasa carbónica del proximal (luminal y citosólica).',
      efecto: 'Bicarbonaturia: orina alcalina y acidosis metabólica hiperclorémica.',
      perla: 'Su diuresis se agota en 2-3 días: al bajar el HCO₃⁻ plasmático se filtra menos y ya no hay qué perder.',
    },
  },
  manitol: {
    id: 'manitol', nombre: 'Manitol', ejemplos: 'Manitol',
    clase: 'Diurético osmótico', celula: 'proximal-s1',
    dianas: [
      { t: 'aqp1', factor: 0.5 },
    ],
    lavado: 0.65,
    consecuencias: {
      orina: ['Volumen ↑↑ (agua)', 'Na⁺ ↑ moderado'],
      sangre: ['Osmolalidad ↑', 'Na⁺ primero ↓ (dilución) y luego ↑'],
      potasio: 'baja', acidoBase: 'neutro', volumen: 'sube',
    },
    usos: ['Hipertensión intracraneal', 'Glaucoma agudo', 'Prueba de función renal (oliguria)'],
    adversos: ['Edema agudo de pulmón (expande primero el volumen)', 'Deshidratación', 'Hipernatremia', 'Lesión renal con dosis altas'],
    resumen: 'Se filtra y no se reabsorbe: retiene agua en la luz donde el túbulo es permeable (proximal y descendente) y lava el gradiente medular.',
    esencial: {
      mecanismo: 'Soluto que se filtra y no se reabsorbe: retiene agua en la luz.',
      efecto: 'Diuresis acuosa abundante.',
      perla: 'Está contraindicado en la insuficiencia cardíaca y el edema pulmonar: primero saca agua de las células y expande el volumen.',
    },
  },
  furosemida: {
    id: 'furosemida', nombre: 'Furosemida', ejemplos: 'Furosemida, bumetanida, torasemida (ácido etacrínico sin sulfa)',
    clase: 'Diurético de asa', celula: 'gruesa',
    dianas: [
      { t: 'nkcc2', factor: 0.08 },
    ],
    consecuencias: {
      orina: ['Volumen ↑↑ isoosmótico', 'Na⁺ ↑↑ (hasta ≈ 20-25 % de lo filtrado)', 'K⁺ ↑', 'Ca²⁺ ↑', 'Mg²⁺ ↑'],
      sangre: ['K⁺ ↓', 'HCO₃⁻ ↑', 'Ca²⁺ y Mg²⁺ ↓', 'Ácido úrico ↑'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'baja',
    },
    usos: ['Edema (insuficiencia cardíaca, cirrosis, nefrótico)', 'Edema agudo de pulmón', 'Hipercalcemia (con suero salino)', 'Hiperpotasemia'],
    adversos: ['Hipopotasemia', 'Alcalosis metabólica', 'Ototoxicidad (sobre todo IV rápida o con aminoglucósidos)', 'Hipocalcemia e hipomagnesemia', 'Hiperuricemia (gota)', 'Alergia a sulfas', 'Nefritis intersticial'],
    resumen: 'Bloquea NKCC2: la rama gruesa deja de reabsorber ≈ 25 % del NaCl, se pierde la luz positiva (y con ella el Ca²⁺ y el Mg²⁺) y el gradiente medular se lava. La orina sale abundante e isoosmótica.',
    esencial: {
      mecanismo: 'Bloquea NKCC2 en la rama gruesa (llega a la luz por secreción proximal).',
      efecto: 'El diurético más potente: mucha orina isoosmótica, con pérdida de K⁺, Ca²⁺ y Mg²⁺.',
      perla: '«Los de asa pierden calcio»: sirven en la hipercalcemia; las tiazidas hacen lo contrario.',
    },
  },
  tiazida: {
    id: 'tiazida', nombre: 'Tiazidas', ejemplos: 'Hidroclorotiazida, clortalidona, indapamida',
    clase: 'Diurético tiazídico', celula: 'distal',
    dianas: [
      { t: 'ncc', factor: 0.1 },
      { t: 'trpv5', factor: 1.35 },
      { t: 'ncx1', factor: 1.3 },
    ],
    consecuencias: {
      orina: ['Na⁺ ↑ (≈ 5 % de lo filtrado)', 'K⁺ ↑', 'Ca²⁺ ↓', 'No pueden diluir al máximo'],
      sangre: ['Na⁺ ↓ (hiponatremia)', 'K⁺ ↓', 'HCO₃⁻ ↑', 'Ca²⁺ ↑ leve', 'Glucosa, ácido úrico y lípidos ↑'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'baja',
    },
    usos: ['Hipertensión arterial', 'Insuficiencia cardíaca leve', 'Cálculos de calcio con hipercalciuria', 'Diabetes insípida nefrogénica'],
    adversos: ['Hiponatremia', 'Hipopotasemia', 'Alcalosis metabólica', 'Hipercalcemia', 'Hiperglucemia', 'Hiperuricemia (gota)', 'Hiperlipidemia', 'Alergia a sulfas'],
    resumen: 'Bloquea NCC en el distal. La célula, con menos Na⁺, saca más Ca²⁺ por NCX1 y abre más TRPV5: el calcio urinario baja. Como el distal diluye, la tiazida impide diluir: hiponatremia.',
    esencial: {
      mecanismo: 'Bloquea NCC en el túbulo distal.',
      efecto: 'Natriuresis moderada con hipocalciuria e hiponatremia.',
      perla: 'Es la que más hiponatremia da, porque impide la dilución sin tocar la concentración (la ADH sigue funcionando).',
    },
  },
  amilorida: {
    id: 'amilorida', nombre: 'Amilorida', ejemplos: 'Amilorida, triamtereno',
    clase: 'Ahorrador de potasio (bloqueador de ENaC)', celula: 'principal',
    dianas: [
      { t: 'enac', factor: 0.1 },
      { t: 'romk', factor: 0.4, en: ['principal'] },
      { t: 'hatpasa', factor: 0.7, en: ['intercalada-a'] },
    ],
    consecuencias: {
      orina: ['Na⁺ ↑ leve', 'K⁺ ↓', 'H⁺ ↓'],
      sangre: ['K⁺ ↑', 'HCO₃⁻ ↓'],
      potasio: 'sube', acidoBase: 'acidosis', volumen: 'baja',
    },
    usos: ['Síndrome de Liddle', 'Diabetes insípida nefrogénica por litio', 'Junto a tiazidas o de asa para no perder K⁺'],
    adversos: ['Hiperpotasemia (cuidado con IECA, ARA-II e insuficiencia renal)', 'Acidosis metabólica', 'Cálculos (triamtereno)'],
    resumen: 'Tapa ENaC: entra menos Na⁺, la luz deja de ser negativa y la célula ya no tiene empuje para secretar K⁺ ni H⁺.',
    esencial: {
      mecanismo: 'Bloquea ENaC en la luz de la célula principal.',
      efecto: 'Natriuresis leve con retención de K⁺.',
      perla: 'Funciona aunque no haya aldosterona: por eso sirve en el Liddle, donde la espironolactona no hace nada.',
    },
  },
  espironolactona: {
    id: 'espironolactona', nombre: 'Espironolactona', ejemplos: 'Espironolactona, eplerenona, finerenona',
    clase: 'Antagonista mineralocorticoide (ahorrador de potasio)', celula: 'principal',
    dianas: [
      { t: 'mr', factor: 0.1 },
      { t: 'enac', factor: 0.35, en: ['principal'] },
      { t: 'romk', factor: 0.4, en: ['principal'] },
      { t: 'nak', factor: 0.7, en: ['principal'] },
      { t: 'hatpasa', factor: 0.65, en: ['intercalada-a'] },
    ],
    consecuencias: {
      orina: ['Na⁺ ↑ leve', 'K⁺ ↓'],
      sangre: ['K⁺ ↑', 'HCO₃⁻ ↓'],
      potasio: 'sube', acidoBase: 'acidosis', volumen: 'baja',
    },
    usos: ['Hiperaldosteronismo primario', 'Insuficiencia cardíaca con FE reducida (baja la mortalidad)', 'Ascitis por cirrosis (primera línea)', 'Hirsutismo y acné (antiandrogénico)'],
    adversos: ['Hiperpotasemia', 'Ginecomastia e impotencia (espironolactona, no eplerenona)', 'Irregularidad menstrual', 'Acidosis metabólica'],
    resumen: 'Ocupa el receptor mineralocorticoide sin activarlo: la aldosterona ya no aumenta ENaC, ROMK ni la bomba. Tarda días en notarse.',
    esencial: {
      mecanismo: 'Bloquea el receptor mineralocorticoide dentro de la célula principal.',
      efecto: 'Retiene K⁺ y pierde algo de Na⁺; depende de que haya aldosterona.',
      perla: 'La espironolactona también bloquea el receptor de andrógenos (ginecomastia); la eplerenona es selectiva.',
    },
  },
  gliflozina: {
    id: 'gliflozina', nombre: 'Gliflozinas', ejemplos: 'Empagliflozina, dapagliflozina, canagliflozina',
    clase: 'Inhibidor de SGLT2', celula: 'proximal-s1',
    dianas: [
      { t: 'sglt2', factor: 0.1 },
      { t: 'sglt1', factor: 1.4 },
    ],
    consecuencias: {
      orina: ['Glucosa ↑↑ (≈ 50-60 % de lo filtrado)', 'Na⁺ ↑ leve', 'Volumen ↑ leve'],
      sangre: ['Glucosa ↓', 'Peso y presión ↓', 'Cetonas ↑ (riesgo de cetoacidosis)'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'baja',
    },
    usos: ['Diabetes tipo 2', 'Insuficiencia cardíaca', 'Enfermedad renal crónica (con o sin diabetes)'],
    adversos: ['Infecciones genitales por hongos', 'Infecciones urinarias', 'Cetoacidosis euglucémica', 'Depleción de volumen'],
    resumen: 'Bloquea SGLT2: la glucosa sigue por el túbulo, SGLT1 recupera una parte y el resto sale en la orina. Llega más NaCl a la mácula densa, que contrae la aferente y baja la hiperfiltración.',
    esencial: {
      mecanismo: 'Bloquea SGLT2 en el túbulo proximal.',
      efecto: 'Glucosuria con natriuresis leve.',
      perla: 'Protegen el riñón por la mácula densa: más NaCl distal → contracción de la aferente → menos presión glomerular.',
    },
  },
  tolvaptan: {
    id: 'tolvaptan', nombre: 'Tolvaptán', ejemplos: 'Tolvaptán (oral), conivaptán (IV)',
    clase: 'Antagonista del receptor V2 (vaptán)', celula: 'principal',
    dianas: [
      { t: 'v2r', factor: 0.1 },
      { t: 'aqp2', factor: 0.12 },
      { t: 'uta1', factor: 0.35 },
    ],
    consecuencias: {
      orina: ['Volumen ↑ (agua libre)', 'Osmolalidad ↓↓', 'Sin pérdida de sal (acuaresis)'],
      sangre: ['Na⁺ ↑', 'Osmolalidad ↑'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'igual',
    },
    usos: ['Hiponatremia euvolémica o hipervolémica (SIADH, insuficiencia cardíaca)', 'Poliquistosis renal autosómica dominante (frena el crecimiento de los quistes)'],
    adversos: ['Corrección demasiado rápida del Na⁺ (desmielinización osmótica)', 'Sed y poliuria', 'Hepatotoxicidad (tolvaptán)'],
    resumen: 'Ocupa el receptor V2: la ADH ya no lleva AQP2 a la membrana. Se pierde agua sin sal y el sodio sérico sube.',
    esencial: {
      mecanismo: 'Bloquea el receptor V2 de la ADH.',
      efecto: 'Acuaresis: orina diluida, sin sal, y sube el Na⁺ sérico.',
      perla: 'El Na⁺ no debe subir más de ≈ 8-10 mEq/L en 24 h: por eso se empieza en el hospital.',
    },
  },
};

export const FARMACO_LIST = Object.values(FARMACOS);
