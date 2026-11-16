// Tubulopatías y trastornos hormonales que se ven en el nefrón. Cada uno
// apaga o enciende transportadores (`dianas`) o impone un nivel de hormona.

import type { Sindrome, SindromeId } from './tipos.ts';

const PROX: Sindrome['dianas'][number]['en'] = ['proximal-s1', 'proximal-s3'];

export const SINDROMES: Record<SindromeId, Sindrome> = {
  fanconi: {
    id: 'fanconi', nombre: 'Síndrome de Fanconi', corto: 'Fanconi', tipo: 'tubulopatia', celula: 'proximal-s1',
    dianas: [
      { t: 'sglt2', factor: 0.2 }, { t: 'sglt1', factor: 0.2 },
      { t: 'napi2a', factor: 0.2 }, { t: 'aa-na', factor: 0.2 },
      { t: 'nhe3', factor: 0.55, en: PROX }, { t: 'nbce1', factor: 0.45 },
      { t: 'nak', factor: 0.85, en: PROX },
    ],
    consecuencias: {
      orina: ['Glucosa ↑ con glucemia normal', 'Aminoácidos ↑', 'Fosfato ↑', 'HCO₃⁻ ↑', 'Ácido úrico y proteínas de bajo peso ↑'],
      sangre: ['Fosfato ↓', 'HCO₃⁻ ↓', 'K⁺ ↓', 'Ácido úrico ↓'],
      potasio: 'baja', acidoBase: 'acidosis', volumen: 'baja',
    },
    causas: ['Niños: cistinosis, Wilson, galactosemia, tirosinemia, Lowe', 'Adultos: mieloma múltiple (cadenas ligeras)', 'Fármacos: tenofovir, ifosfamida, cisplatino, aminoglucósidos, tetraciclinas caducadas', 'Metales pesados (plomo, cadmio)'],
    tratamiento: 'Tratar la causa; reponer HCO₃⁻ (o citrato), fosfato, K⁺ y vitamina D.',
    resumen: 'El proximal entero falla: todo lo que debía recuperar sigue por el túbulo y aparece en la orina.',
    esencial: {
      defecto: 'Disfunción global del túbulo proximal.',
      signo: 'Glucosuria con glucemia normal + fosfaturia + aminoaciduria + acidosis.',
      perla: 'En el adulto, piensa en mieloma o en tenofovir; en el niño, en cistinosis.',
    },
  },
  atr2: {
    id: 'atr2', nombre: 'Acidosis tubular renal tipo 2 (proximal)', corto: 'ATR tipo 2', tipo: 'tubulopatia', celula: 'proximal-s1',
    dianas: [
      { t: 'nbce1', factor: 0.3 },
      { t: 'nhe3', factor: 0.6, en: PROX },
      { t: 'ac2', factor: 0.7, en: PROX },
    ],
    consecuencias: {
      orina: ['HCO₃⁻ ↑ al principio', 'pH < 5,5 cuando el HCO₃⁻ plasmático ya bajó', 'K⁺ ↑'],
      sangre: ['HCO₃⁻ ↓ (≈ 12-20 mEq/L)', 'Cl⁻ ↑ (anión gap normal)', 'K⁺ ↓'],
      potasio: 'baja', acidoBase: 'acidosis', volumen: 'igual',
    },
    causas: ['Síndrome de Fanconi', 'Acetazolamida, topiramato', 'Mieloma múltiple', 'Mutaciones de NBCe1 (con alteraciones oculares)'],
    tratamiento: 'Dosis muy altas de álcali (citrato o HCO₃⁻) con K⁺: casi todo lo que se da se pierde por la orina.',
    resumen: 'El proximal recupera menos HCO₃⁻: se pierde hasta que el bicarbonato plasmático baja tanto que lo filtrado vuelve a caber. Entonces la orina se acidifica bien.',
    esencial: {
      defecto: 'Menos reabsorción proximal de HCO₃⁻ (umbral bajo).',
      signo: 'Acidosis con anión gap normal y orina que sí baja de pH 5,5.',
      imita: 'Acetazolamida',
      perla: 'A diferencia de la tipo 1, la distal funciona: con el HCO₃⁻ ya bajo, la orina se acidifica.',
    },
  },
  atr1: {
    id: 'atr1', nombre: 'Acidosis tubular renal tipo 1 (distal)', corto: 'ATR tipo 1', tipo: 'tubulopatia', celula: 'intercalada-a',
    dianas: [
      { t: 'hatpasa', factor: 0.12, en: ['intercalada-a'] },
      { t: 'hkatpasa', factor: 0.4 },
      { t: 'ae1', factor: 0.4 },
    ],
    consecuencias: {
      orina: ['pH > 5,5 siempre', 'NH₄⁺ ↓', 'Ca²⁺ ↑ y citrato ↓', 'K⁺ ↑'],
      sangre: ['HCO₃⁻ ↓ (puede ser < 10 mEq/L)', 'Cl⁻ ↑ (anión gap normal)', 'K⁺ ↓'],
      potasio: 'baja', acidoBase: 'acidosis', volumen: 'igual',
    },
    causas: ['Autoinmunes: Sjögren, lupus', 'Anfotericina B (el H⁺ se escapa de vuelta)', 'Litio, hipercalciuria, obstrucción', 'Mutaciones de la H⁺-ATPasa (con sordera) o de AE1'],
    tratamiento: 'Álcali en dosis moderadas (citrato potásico): corrige la acidosis y previene los cálculos.',
    resumen: 'La intercalada α no logra bombear H⁺ a la luz: no se excreta el ácido del día y la orina no se acidifica nunca.',
    esencial: {
      defecto: 'La intercalada α no secreta H⁺.',
      signo: 'Acidosis con orina de pH > 5,5, nefrocalcinosis y cálculos de fosfato de calcio.',
      perla: 'Orina alcalina + citrato bajo + hipercalciuria = cálculos y nefrocalcinosis.',
    },
  },
  atr4: {
    id: 'atr4', nombre: 'Acidosis tubular renal tipo 4 (hipoaldosteronismo)', corto: 'ATR tipo 4', tipo: 'hormonal', celula: 'principal',
    dianas: [
      { t: 'rhcg', factor: 0.4 },
    ],
    hormonas: { aldosterona: -1 },
    consecuencias: {
      orina: ['pH < 5,5 (se acidifica)', 'NH₄⁺ ↓', 'K⁺ ↓', 'Na⁺ ↑ leve'],
      sangre: ['K⁺ ↑ (lo que la define)', 'HCO₃⁻ ↓ leve', 'Cl⁻ ↑'],
      potasio: 'sube', acidoBase: 'acidosis', volumen: 'baja',
    },
    causas: ['Hipoaldosteronismo hiporreninémico (nefropatía diabética)', 'IECA, ARA-II, espironolactona, AINE, heparina', 'Trimetoprim, inhibidores de calcineurina', 'Insuficiencia suprarrenal', 'Resistencia a la aldosterona'],
    tratamiento: 'Bajar el K⁺ (dieta, suspender fármacos, diuréticos de asa); fludrocortisona si falta aldosterona.',
    resumen: 'Sin aldosterona (o sin respuesta a ella) el colector secreta poco K⁺ y H⁺. La hiperpotasemia frena además la amoniogénesis: se excreta poco ácido como NH₄⁺.',
    esencial: {
      defecto: 'Falta de aldosterona o resistencia a ella.',
      signo: 'Hiperpotasemia con acidosis leve y orina ácida.',
      imita: 'Espironolactona o amilorida',
      perla: 'Es la única ATR con hiperpotasemia; la más frecuente en el adulto (diabéticos).',
    },
  },
  bartter: {
    id: 'bartter', nombre: 'Síndrome de Bartter', corto: 'Bartter', tipo: 'tubulopatia', celula: 'gruesa',
    dianas: [
      { t: 'nkcc2', factor: 0.15 },
      { t: 'romk', factor: 0.5, en: ['gruesa'] },
      { t: 'clckb', factor: 0.5, en: ['gruesa'] },
    ],
    consecuencias: {
      orina: ['Na⁺ y Cl⁻ ↑', 'K⁺ ↑', 'Ca²⁺ ↑ (nefrocalcinosis)', 'Prostaglandinas ↑'],
      sangre: ['K⁺ ↓', 'HCO₃⁻ ↑', 'Renina y aldosterona ↑', 'Presión normal o baja'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'baja',
    },
    causas: ['Tipo 1: NKCC2', 'Tipo 2: ROMK', 'Tipo 3: ClC-Kb', 'Tipo 4: barttina (con sordera)', 'Tipo 5: CaSR activado'],
    tratamiento: 'K⁺ y Mg²⁺, AINE (indometacina, frenan las prostaglandinas), ahorradores de K⁺.',
    resumen: 'Falla la rama gruesa desde el nacimiento: es como tomar furosemida toda la vida.',
    esencial: {
      defecto: 'Transporte de NaCl en la rama gruesa (NKCC2, ROMK, ClC-Kb o barttina).',
      signo: 'Niño con hipopotasemia, alcalosis, hipercalciuria y presión normal.',
      imita: 'Furosemida',
      perla: 'Empieza antes de nacer: polihidramnios, prematuridad y retraso del crecimiento.',
    },
  },
  gitelman: {
    id: 'gitelman', nombre: 'Síndrome de Gitelman', corto: 'Gitelman', tipo: 'tubulopatia', celula: 'distal',
    dianas: [
      { t: 'ncc', factor: 0.1 },
      { t: 'trpm6', factor: 0.4 },
      { t: 'trpv5', factor: 1.3 },
    ],
    consecuencias: {
      orina: ['Na⁺ y Cl⁻ ↑', 'K⁺ ↑', 'Ca²⁺ ↓ (hipocalciuria)', 'Mg²⁺ ↑'],
      sangre: ['K⁺ ↓', 'Mg²⁺ ↓', 'HCO₃⁻ ↑', 'Renina y aldosterona ↑', 'Presión normal o baja'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'baja',
    },
    causas: ['Mutación de NCC (SLC12A3), autosómica recesiva'],
    tratamiento: 'Suplementos de Mg²⁺ y K⁺; ahorradores de K⁺.',
    resumen: 'Falla NCC en el distal: es como tomar una tiazida toda la vida. Suele descubrirse en un adolescente o un adulto con calambres.',
    esencial: {
      defecto: 'NCC del túbulo distal.',
      signo: 'Hipopotasemia, alcalosis e hipomagnesemia con calcio urinario bajo.',
      imita: 'Tiazida',
      perla: 'Para separarlo del Bartter, mira el calcio urinario: bajo en Gitelman, alto en Bartter.',
    },
  },
  liddle: {
    id: 'liddle', nombre: 'Síndrome de Liddle', corto: 'Liddle', tipo: 'tubulopatia', celula: 'principal',
    dianas: [
      { t: 'enac', factor: 2.5 },
      { t: 'romk', factor: 1.6, en: ['principal'] },
      { t: 'hatpasa', factor: 1.3, en: ['intercalada-a'] },
    ],
    hormonas: { aldosterona: -1 },
    consecuencias: {
      orina: ['Na⁺ ↓', 'K⁺ ↑'],
      sangre: ['Hipertensión desde joven', 'K⁺ ↓', 'HCO₃⁻ ↑', 'Renina y aldosterona ↓'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'sube',
    },
    causas: ['Mutación de las subunidades β o γ de ENaC (autosómica dominante): el canal no se retira de la membrana'],
    tratamiento: 'Amilorida o triamtereno; la espironolactona no sirve.',
    resumen: 'ENaC se queda en la membrana sin que nadie lo retire: reabsorbe Na⁺ sin parar, como si siempre hubiera aldosterona. El volumen sube y frena la renina.',
    esencial: {
      defecto: 'ENaC siempre activo (ganancia de función).',
      signo: 'Hipertensión con hipopotasemia, alcalosis y aldosterona baja.',
      imita: 'Hiperaldosteronismo, pero con aldosterona baja',
      perla: '«Pseudohiperaldosteronismo»: responde a amilorida, no a espironolactona.',
    },
  },
  'di-central': {
    id: 'di-central', nombre: 'Diabetes insípida central', corto: 'DI central', tipo: 'hormonal', celula: 'principal',
    dianas: [],
    hormonas: { adh: -1 },
    consecuencias: {
      orina: ['Volumen ↑↑ (3-20 L/día)', 'Osmolalidad < 300 (a menudo < 100)'],
      sangre: ['Na⁺ normal-alto (hipernatremia si no bebe)', 'Osmolalidad ↑'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'baja',
    },
    causas: ['Cirugía o trauma de la hipófisis', 'Tumores (craneofaringioma), metástasis', 'Histiocitosis, sarcoidosis', 'Idiopática (autoinmune)'],
    tratamiento: 'Desmopresina (análogo V2).',
    resumen: 'No se fabrica o no se libera ADH: AQP2 se queda en las vesículas y el colector deja pasar el líquido diluido del distal.',
    esencial: {
      defecto: 'Falta de ADH.',
      signo: 'Poliuria con orina diluida que se concentra con desmopresina.',
      perla: 'En la prueba de restricción hídrica la orina no se concentra; con desmopresina, sí (sube > 50 %).',
    },
  },
  'di-nefrogenica': {
    id: 'di-nefrogenica', nombre: 'Diabetes insípida nefrogénica', corto: 'DI nefrogénica', tipo: 'tubulopatia', celula: 'principal',
    dianas: [
      { t: 'v2r', factor: 0.1 },
      { t: 'aqp2', factor: 0.08 },
      { t: 'uta1', factor: 0.4 },
    ],
    hormonas: { adh: 1 },
    consecuencias: {
      orina: ['Volumen ↑↑', 'Osmolalidad < 300'],
      sangre: ['Na⁺ normal-alto', 'ADH alta'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'baja',
    },
    causas: ['Litio (entra por ENaC)', 'Hipercalcemia, hipopotasemia', 'Demeclociclina', 'Mutaciones de V2 (ligada al X) o de AQP2', 'Obstrucción, nefropatía falciforme'],
    tratamiento: 'Tiazidas (paradójico: bajan el volumen y aumentan la reabsorción proximal), amilorida si es por litio, poca sal y proteínas, AINE.',
    resumen: 'Hay ADH de sobra, pero el colector no responde: AQP2 no llega a la membrana.',
    esencial: {
      defecto: 'El colector no responde a la ADH (receptor V2 o AQP2).',
      signo: 'Poliuria diluida que NO se concentra con desmopresina.',
      perla: 'Las tiazidas la mejoran: con menos volumen, el proximal reabsorbe más y llega menos agua al colector.',
    },
  },
  siadh: {
    id: 'siadh', nombre: 'Secreción inadecuada de ADH (SIADH)', corto: 'SIADH', tipo: 'hormonal', celula: 'principal',
    dianas: [],
    hormonas: { adh: 1 },
    consecuencias: {
      orina: ['Osmolalidad > 100 (inapropiadamente concentrada)', 'Na⁺ > 40 mEq/L'],
      sangre: ['Na⁺ ↓ (hiponatremia)', 'Osmolalidad ↓', 'Ácido úrico ↓', 'Volumen normal'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'igual',
    },
    causas: ['Carcinoma microcítico de pulmón', 'Enfermedad del SNC (meningitis, hemorragia, trauma)', 'Neumonía', 'Fármacos: ISRS, carbamazepina, ciclofosfamida, vincristina', 'Dolor, náuseas, posoperatorio'],
    tratamiento: 'Restricción de agua; suero salino hipertónico si hay síntomas graves; tolvaptán o urea. Corregir despacio (≤ 8-10 mEq/L en 24 h).',
    resumen: 'La ADH no se apaga aunque el plasma esté diluido: el colector sigue reabsorbiendo agua libre y el sodio cae.',
    esencial: {
      defecto: 'ADH alta sin estímulo osmótico ni de volumen.',
      signo: 'Hiponatremia euvolémica con orina concentrada y Na⁺ urinario alto.',
      perla: 'Corregir rápido el Na⁺ causa mielinólisis pontina central: no más de ≈ 8-10 mEq/L en 24 h.',
    },
  },
  conn: {
    id: 'conn', nombre: 'Hiperaldosteronismo primario (Conn)', corto: 'Conn', tipo: 'hormonal', celula: 'principal',
    dianas: [],
    hormonas: { aldosterona: 1 },
    consecuencias: {
      orina: ['K⁺ ↑', 'H⁺ ↑', 'Na⁺ normal (escape)'],
      sangre: ['Hipertensión', 'K⁺ ↓ (no siempre)', 'HCO₃⁻ ↑', 'Renina ↓ y aldosterona ↑'],
      potasio: 'baja', acidoBase: 'alcalosis', volumen: 'sube',
    },
    causas: ['Hiperplasia suprarrenal bilateral (la más frecuente)', 'Adenoma productor de aldosterona', 'Hiperaldosteronismo remediable con glucocorticoides'],
    tratamiento: 'Adenoma: suprarrenalectomía. Hiperplasia: espironolactona o eplerenona.',
    resumen: 'La suprarrenal fabrica aldosterona sin que la pida la renina: la célula principal retiene Na⁺ y pierde K⁺ y H⁺.',
    esencial: {
      defecto: 'Aldosterona alta autónoma.',
      signo: 'Hipertensión con hipopotasemia, alcalosis y renina suprimida.',
      perla: 'No hay edema: el «escape» (ANP y natriuresis de presión) frena la retención de Na⁺.',
    },
  },
  'glucosuria-renal': {
    id: 'glucosuria-renal', nombre: 'Glucosuria renal familiar', corto: 'Glucosuria renal', tipo: 'tubulopatia', celula: 'proximal-s1',
    dianas: [
      { t: 'sglt2', factor: 0.15 },
    ],
    consecuencias: {
      orina: ['Glucosa ↑ con glucemia normal'],
      sangre: ['Glucemia normal'],
      potasio: 'igual', acidoBase: 'neutro', volumen: 'igual',
    },
    causas: ['Mutación de SGLT2 (SLC5A2)'],
    tratamiento: 'Ninguno: es benigna.',
    resumen: 'Solo falla SGLT2: se pierde glucosa sin otra alteración tubular.',
    esencial: {
      defecto: 'SGLT2 defectuoso.',
      signo: 'Glucosuria aislada con glucemia normal.',
      imita: 'Gliflozinas',
      perla: 'Es la «gliflozina natural» y no causa daño: una de las razones para pensar que bloquear SGLT2 era seguro.',
    },
  },
};

export const SINDROME_LIST = Object.values(SINDROMES);
