// Fármacos que actúan sobre el nefrón (sobre todo diuréticos). Cada uno mapea a
// su(s) transportador(es) diana y reutiliza el motor de perturbaciones: al
// aplicarlo se resaltan las dianas y se rellena el panel de consecuencias.
// Contenido redactado con farmacología renal estándar (RANGO ORIENTATIVO —
// pendiente de revisión clínica). El motor (engine/simulate.ts) hace lookup por id.

import type { DrugDef } from '@/app/dashboard/laboratorio/nefron-interactivo/engine/types';

export const DRUGS: Record<string, DrugDef> = {
  'acetazolamida': {
    id: 'acetazolamida',
    nombre: 'Acetazolamida',
    clase: 'Inhibidor de la anhidrasa carbónica',
    segmentoId: 'tcp',
    objetivos: ['nhe3', 'nbce1'],
    efecto: 'inhibicion',
    mecanismo:
      'Inhibe la anhidrasa carbónica luminal y citosólica del túbulo proximal, frenando la recuperación de HCO₃⁻ acoplada al NHE3. Se pierde bicarbonato por la orina.',
    indicaciones: 'Glaucoma, mal de altura, alcalosis metabólica, algunas epilepsias.',
    ram: 'Acidosis metabólica hiperclorémica, hipokalemia, litiasis de fosfato cálcico, parestesias.',
    consecuencia: {
      resumen: 'Bicarbonaturia: se elimina HCO₃⁻ por la orina (efecto proximal, diurético débil).',
      sangre: '↓ HCO₃⁻ sérico (acidosis metabólica hiperclorémica).',
      orina: '↑ HCO₃⁻, ↑ Na⁺, ↑ K⁺; pH urinario alcalino.',
      acidoBase: 'acidosis-metabolica',
      potasio: 'Hipokalemia (más Na⁺ y HCO₃⁻ llegan al distal y arrastran K⁺).',
      otros: 'Diuresis autolimitada al agotarse el HCO₃⁻ filtrable.',
      clinica: 'Útil para corregir alcalosis metabólica; provoca un patrón tipo ATR proximal.',
    },
  },
  'furosemida': {
    id: 'furosemida',
    nombre: 'Furosemida / bumetanida',
    clase: 'Diurético de asa',
    segmentoId: 'tal',
    objetivos: ['nkcc2'],
    efecto: 'inhibicion',
    mecanismo:
      'Bloquea el NKCC2 en la rama ascendente gruesa: cae la reabsorción de Na⁺-K⁺-2Cl⁻ y se disipa el gradiente medular (menor capacidad de concentrar). Pierde el potencial luminal positivo → hipercalciuria.',
    indicaciones: 'Edema (insuficiencia cardíaca, cirrosis, síndrome nefrótico), hipertensión con ERC, hiperpotasemia, hipercalcemia.',
    ram: 'Hipovolemia, hipokalemia, alcalosis metabólica, hipomagnesemia, ototoxicidad, hiperuricemia.',
    consecuencia: {
      resumen: 'Natriuresis intensa (diurético potente) con hipercalciuria; perfil "tipo Bartter".',
      sangre: 'Hipovolemia, hipokalemia, hipomagnesemia, alcalosis metabólica por contracción.',
      orina: '↑↑ Na⁺, K⁺, Cl⁻, Ca²⁺ y Mg²⁺.',
      acidoBase: 'alcalosis-metabolica',
      potasio: 'Hipokalemia (más Na⁺ distal → secreción de K⁺).',
      otros: 'Hipercalciuria, hipomagnesemia, pérdida de capacidad de concentrar la orina.',
      clinica: 'A diferencia de las tiazidas, AUMENTA la calciuria (útil en hipercalcemia).',
    },
  },
  'tiazida': {
    id: 'tiazida',
    nombre: 'Tiazida (HCTZ / clortalidona)',
    clase: 'Diurético tiazídico',
    segmentoId: 'tcd',
    objetivos: ['ncc'],
    efecto: 'inhibicion',
    mecanismo:
      'Bloquea el NCC en el túbulo contorneado distal. Reduce la reabsorción de NaCl pero, de forma paradójica, AUMENTA la reabsorción de Ca²⁺ (hipocalciuria).',
    indicaciones: 'Hipertensión arterial, edemas leves, litiasis cálcica recurrente (por la hipocalciuria), diabetes insípida nefrogénica.',
    ram: 'Hipokalemia, hiponatremia, hipomagnesemia, alcalosis metabólica, hiperglucemia, hiperuricemia, hipercalcemia.',
    consecuencia: {
      resumen: 'Natriuresis moderada con HIPOcalciuria; perfil "tipo Gitelman".',
      sangre: 'Hipokalemia, hiponatremia, hipomagnesemia, alcalosis metabólica; ↑ Ca²⁺.',
      orina: '↑ Na⁺, Cl⁻, K⁺, Mg²⁺; ↓ Ca²⁺ (hipocalciuria).',
      acidoBase: 'alcalosis-metabolica',
      potasio: 'Hipokalemia (mayor llegada distal de Na⁺).',
      otros: 'Hipocalciuria (al revés que los diuréticos de asa): útil en litiasis cálcica.',
      clinica: 'La hiponatremia es un efecto adverso clásico, sobre todo en ancianas.',
    },
  },
  'espironolactona': {
    id: 'espironolactona',
    nombre: 'Espironolactona / eplerenona',
    clase: 'Antagonista del receptor mineralocorticoide',
    segmentoId: 'conector-cortical',
    objetivos: ['mr', 'enac', 'romk-ccd'],
    efecto: 'inhibicion',
    mecanismo:
      'Antagoniza el receptor mineralocorticoide en la célula principal: menos ENaC y Na⁺/K⁺-ATPasa → reabsorbe menos Na⁺ y secreta menos K⁺ y H⁺ (ahorrador de potasio).',
    indicaciones: 'Hiperaldosteronismo, insuficiencia cardíaca, cirrosis con ascitis, hipertensión resistente.',
    ram: 'Hiperpotasemia, acidosis metabólica, ginecomastia (espironolactona), AKI si hipovolemia.',
    consecuencia: {
      resumen: 'Diurético ahorrador de potasio: bloquea el efecto de la aldosterona.',
      sangre: 'Hiperkalemia, tendencia a acidosis metabólica.',
      orina: '↑ Na⁺; ↓ K⁺ y H⁺ urinarios.',
      acidoBase: 'acidosis-metabolica',
      potasio: 'Hiperkalemia (retiene K⁺).',
      otros: 'Efecto natriurético débil; potente para frenar la kaliuresis.',
      clinica: 'Vigilar el K⁺, sobre todo con IECA/ARA-II o en ERC.',
    },
  },
  'amilorida': {
    id: 'amilorida',
    nombre: 'Amilorida / triamtereno',
    clase: 'Diurético ahorrador de potasio (bloqueante de ENaC)',
    segmentoId: 'conector-cortical',
    objetivos: ['enac'],
    efecto: 'inhibicion',
    mecanismo:
      'Bloquea directamente el ENaC en la célula principal (sin pasar por el receptor de aldosterona). Cae la reabsorción de Na⁺ y, al perderse el voltaje luminal negativo, baja la secreción de K⁺ y H⁺.',
    indicaciones: 'Síndrome de Liddle, hipokalemia por otros diuréticos, hiperaldosteronismo (con tiazida).',
    ram: 'Hiperpotasemia, acidosis metabólica leve.',
    consecuencia: {
      resumen: 'Ahorrador de potasio que actúa directamente sobre el canal ENaC.',
      sangre: 'Hiperkalemia, tendencia a acidosis metabólica.',
      orina: '↑ Na⁺; ↓ K⁺ y H⁺.',
      acidoBase: 'acidosis-metabolica',
      potasio: 'Hiperkalemia.',
      otros: 'Es el tratamiento de elección del síndrome de Liddle.',
      clinica: 'A diferencia de la espironolactona, NO depende de la aldosterona.',
    },
  },
  'manitol': {
    id: 'manitol',
    nombre: 'Manitol',
    clase: 'Diurético osmótico',
    segmentoId: 'tcp',
    objetivos: [],
    efecto: 'osmotico',
    mecanismo:
      'Soluto filtrado y no reabsorbido: retiene agua en el lumen a lo largo de todo el túbulo (sobre todo TCP y asa descendente), arrastrando agua y, en menor medida, Na⁺.',
    indicaciones: 'Edema cerebral, hipertensión intracraneal, glaucoma agudo, profilaxis de AKI en algunos contextos.',
    ram: 'Expansión inicial del volumen (riesgo en IC), hiponatremia dilucional inicial, luego hipernatremia y deshidratación.',
    consecuencia: {
      resumen: 'Diuresis osmótica: el agua queda atrapada en el lumen en todo el nefrón.',
      sangre: 'Expansión transitoria del volumen; luego pérdida de agua libre (hipernatremia).',
      orina: '↑↑ volumen (agua), ↑ Na⁺ moderado.',
      acidoBase: 'sin-cambio',
      otros: 'No bloquea un transportador concreto: actúa por ósmosis en el lumen.',
      clinica: 'Pierde MÁS agua que sal → riesgo de hipernatremia si no se repone agua.',
    },
  },
};

export const DRUG_LIST: DrugDef[] = Object.values(DRUGS);
