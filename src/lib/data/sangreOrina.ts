// Datos del minijuego "Parámetro: Sangre vs Orina" (laboratorio Excretor).
// Valores normales y explicaciones educativas (qué significa bajo/alto, sobre
// todo en orina). Estáticos: sin fetch, se incluyen en el bundle de la ruta.

export type Compartimento = 'sangre' | 'orina';

export type Parametro = {
  id: string;
  parametro: string;
  sangre: string;
  orina: string;
  explicacion: string;
};

/** Una tarjeta arrastrable: conoce su parámetro y compartimento correctos. */
export type Carta = {
  /** id único de la carta (`${paramId}-${comp}`). */
  id: string;
  paramId: string;
  comp: Compartimento;
  texto: string;
};

export const PARAMETROS: Parametro[] = [
  {
    id: 'na',
    parametro: 'Na+',
    sangre: '135–145 mEq/L',
    orina: '<20 mEq/L · >40 mEq/L',
    explicacion:
      'El sodio sérico normal es 135–145 mEq/L. Si está bajo puede sugerir hiponatremia por exceso de agua, pérdidas digestivas, renales o alteraciones hormonales. Si está alto puede indicar deshidratación o pérdida de agua libre. En orina, Na+ <20 mEq/L sugiere que el riñón retiene sodio, como en hipovolemia o activación del sistema renina-angiotensina-aldosterona. Na+ >40 mEq/L sugiere pérdida renal de sodio, diuréticos o alteración tubular.',
  },
  {
    id: 'k',
    parametro: 'K+',
    sangre: '3.5–5.0 mEq/L',
    orina: '25–125 mEq/24 h',
    explicacion:
      'El potasio sérico normal es 3.5–5.0 mEq/L. Si está bajo puede sugerir pérdidas renales, digestivas o efecto de diuréticos. Si está alto puede relacionarse con insuficiencia renal, acidosis, hipoaldosteronismo o liberación celular. En orina, una excreción elevada de K+ sugiere pérdida renal; una excreción baja puede indicar que el riñón intenta conservar potasio.',
  },
  {
    id: 'cl',
    parametro: 'Cl−',
    sangre: '98–106 mEq/L',
    orina: '110–250 mEq/24 h',
    explicacion:
      'El cloro sérico normal es 98–106 mEq/L. Puede bajar en alcalosis metabólica, vómitos o pérdidas digestivas. Puede subir en acidosis metabólica hiperclorémica o exceso de solución salina. En orina ayuda a diferenciar causas de alcalosis metabólica: cloro urinario bajo sugiere pérdidas extrarrenales; cloro urinario alto sugiere pérdida renal o uso de diuréticos.',
  },
  {
    id: 'mg',
    parametro: 'Mg2+',
    sangre: '1.7–2.4 mg/dL ≈ 1.4–2.0 mEq/L',
    orina: '72–120 mg/24 h',
    explicacion:
      'El magnesio sérico normal es 1.7–2.4 mg/dL. Si está bajo puede causar debilidad, calambres o arritmias y puede asociarse a pérdidas renales o digestivas. Si está alto puede observarse en insuficiencia renal o exceso de aporte. En orina, una eliminación alta sugiere pérdida renal de magnesio.',
  },
  {
    id: 'ca',
    parametro: 'Ca2+ total',
    sangre: '8.5–10.5 mg/dL',
    orina: '100–300 mg/24 h',
    explicacion:
      'El calcio total normal en sangre es 8.5–10.5 mg/dL. Si está bajo puede asociarse a hipoparatiroidismo, déficit de vitamina D o hipoalbuminemia. Si está alto puede sugerir hiperparatiroidismo, neoplasias o exceso de vitamina D. En orina, una calciuria elevada aumenta el riesgo de litiasis renal.',
  },
  {
    id: 'osm',
    parametro: 'Agua / Osmolalidad',
    sangre: '275–295 mOsm/kg',
    orina: '50–1200 mOsm/kg',
    explicacion:
      'La osmolalidad plasmática normal es 275–295 mOsm/kg. Si está elevada suele indicar déficit de agua o hipernatremia; si está baja puede relacionarse con exceso de agua o hiponatremia. La osmolalidad urinaria es muy variable: valores bajos indican orina diluida; valores altos indican orina concentrada, usualmente por acción de la ADH.',
  },
  {
    id: 'urea',
    parametro: 'Urea',
    sangre: '15–40 mg/dL (BUN 7–20 mg/dL)',
    orina: '12–20 g/24 h',
    explicacion:
      'La urea sanguínea refleja metabolismo proteico, hidratación y función renal. Si está alta puede sugerir deshidratación, aumento del catabolismo proteico o deterioro renal. Si está baja puede verse en hepatopatía o baja ingesta proteica. En orina, la excreción de urea se relaciona con ingesta proteica y capacidad renal de eliminación.',
  },
  {
    id: 'hco3',
    parametro: 'HCO3−',
    sangre: '22–28 mEq/L',
    orina: 'Bajo / casi ausente (FEHCO3− <5%)',
    explicacion:
      'El bicarbonato sérico normal es 22–28 mEq/L. Si está bajo indica acidosis metabólica o compensación de alcalosis respiratoria. Si está alto sugiere alcalosis metabólica o compensación de acidosis respiratoria. En orina normalmente es bajo o casi ausente porque el riñón reabsorbe casi todo el bicarbonato filtrado. Una FEHCO3− <5% se considera baja o normal; valores elevados, especialmente >15% tras carga de bicarbonato, sugieren pérdida proximal de bicarbonato, como en acidosis tubular renal proximal.',
  },
  {
    id: 'creat',
    parametro: 'Creatinina',
    sangre: 'H: 0.7–1.3 mg/dL · M: 0.6–1.1 mg/dL',
    orina: '0.8–2.0 g/24 h',
    explicacion:
      'La creatinina sérica se usa como marcador indirecto de función renal. Si está elevada puede sugerir reducción del filtrado glomerular, aunque depende de masa muscular y otros factores. En orina de 24 horas, valores bajos pueden indicar recolección incompleta o baja masa muscular; valores altos pueden relacionarse con mayor masa muscular.',
  },
  {
    id: 'ph',
    parametro: 'pH',
    sangre: '7.35–7.45',
    orina: '4.5–8.0',
    explicacion:
      'El pH sanguíneo normal es 7.35–7.45. Si baja hay acidemia; si sube hay alcalemia. El pH urinario normal varía entre 4.5 y 8.0. Una orina persistentemente alcalina puede verse en infecciones por bacterias ureasa positivas o acidosis tubular renal distal. Una orina ácida puede ser respuesta normal ante acidosis metabólica.',
  },
  {
    id: 'pco2',
    parametro: 'PCO2',
    sangre: '35–45 mmHg',
    orina: 'No aplica',
    explicacion:
      'La PCO2 sanguínea normal es 35–45 mmHg y refleja el componente respiratorio del equilibrio ácido-base. Si está elevada sugiere hipoventilación o acidosis respiratoria. Si está baja sugiere hiperventilación o alcalosis respiratoria. En orina no se usa como parámetro habitual, por eso se coloca como "No aplica".',
  },
];

/** Construye las 22 cartas (sangre + orina por parámetro) sin mezclar. */
export function buildCartas(): Carta[] {
  const cartas: Carta[] = [];
  for (const p of PARAMETROS) {
    cartas.push({ id: `${p.id}-sangre`, paramId: p.id, comp: 'sangre', texto: p.sangre });
    cartas.push({ id: `${p.id}-orina`, paramId: p.id, comp: 'orina', texto: p.orina });
  }
  return cartas;
}

export const TOTAL_CELDAS = PARAMETROS.length * 2;
