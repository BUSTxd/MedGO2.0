// Datos del minijuego "Parámetro: Sangre vs Orina" (laboratorio Excretor).
// Cada parámetro lleva explicación SEPARADA de sangre y orina, más un bloque de
// mecanismo (transportadores → lumen/intersticio y segmento de nefrona). Estáticos:
// sin fetch, se incluyen en el bundle de la ruta.

export type Compartimento = 'sangre' | 'orina';

export type Parametro = {
  id: string;
  parametro: string;
  /** Abreviatura que se muestra entre (paréntesis) junto al nombre: "FEHCO3−", "BUN". */
  alias?: string;
  /** Texto de la carta de sangre (sin pistas que delaten el parámetro). */
  sangre: string;
  /** Texto de la carta de orina (sin pistas que delaten el parámetro). */
  orina: string;
  /** Qué significa alto/bajo en sangre. */
  explSangre: string;
  /** Qué significa alto/bajo en orina. */
  explOrina: string;
  /** Mecanismo: transportadores hacia lumen/intersticio + segmento de la nefrona. */
  mecanismo: string;
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
    explSangre:
      'Valor normal 135–145 mEq/L. Bajo (hiponatremia): casi siempre es un problema de exceso de agua, no de falta de sal — pensar en SIADH, insuficiencia cardíaca o pérdidas digestivas con reposición de agua. Alto (hipernatremia): falta agua libre — deshidratación o diabetes insípida.',
    explOrina:
      'Es la mejor pista de cómo "ve" el riñón el volumen. Na+ urinario <20 mEq/L = el riñón está reteniendo sodio con fuerza → hay hipovolemia y la aldosterona está activa. Na+ urinario >40 mEq/L = el riñón está perdiendo sodio → diuréticos, daño tubular o pérdida salina cerebral.',
    mecanismo:
      'El Na+ se reabsorbe a lo largo de toda la nefrona, pero el grueso (~65%) ocurre en el TÚBULO PROXIMAL (intercambiador NHE3 y cotransporte con glucosa/aminoácidos). En la rama ascendente gruesa entra por el NKCC2 (diana de la furosemida) y en el túbulo distal por el NCC (diana de las tiazidas). El ajuste fino lo hace el ENaC del colector bajo aldosterona. En todos los casos el Na+ es bombeado del lumen hacia el INTERSTICIO por la Na+/K+-ATPasa basolateral, que crea el gradiente que arrastra agua y otros solutos.',
  },
  {
    id: 'k',
    parametro: 'K+',
    sangre: '3.5–5.0 mEq/L',
    orina: '25–125 mEq/24 h',
    explSangre:
      'Valor normal 3.5–5.0 mEq/L. Bajo (hipopotasemia): diuréticos, vómitos/diarrea o desplazamiento al interior de la célula (alcalosis, insulina); da debilidad y arritmias. Alto (hiperpotasemia): insuficiencia renal, acidosis o hipoaldosteronismo; riesgo de arritmia grave.',
    explOrina:
      'Ayuda a localizar la causa de una hipopotasemia: si el K+ sigue saliendo alto en orina pese a estar bajo en sangre, la pérdida es RENAL (diuréticos, hiperaldosteronismo). Si la excreción urinaria es baja, el riñón está conservando bien y la pérdida es digestiva o por redistribución.',
    mecanismo:
      'El K+ filtrado se reabsorbe casi por completo en proximal y rama ascendente gruesa. Lo que regula el potasio del cuerpo es la SECRECIÓN hacia el lumen en el túbulo colector: las células principales bombean K+ al interior con la Na+/K+-ATPasa y lo dejan salir al lumen por los canales ROMK y BK. La aldosterona estimula esta secreción → por eso el hiperaldosteronismo y los diuréticos (que aumentan el flujo distal) producen kaliuresis e hipopotasemia.',
  },
  {
    id: 'cl',
    parametro: 'Cl−',
    sangre: '98–106 mEq/L',
    orina: '110–250 mEq/24 h',
    explSangre:
      'Valor normal 98–106 mEq/L. Baja en alcalosis metabólica y vómitos (se pierde HCl). Sube en la acidosis metabólica hiperclorémica y con exceso de suero salino. Suele moverse en paralelo al sodio.',
    explOrina:
      'Es la clave para clasificar una alcalosis metabólica: cloruro urinario BAJO (<20) = alcalosis "sensible a cloro" (vómitos, deshidratación) que responde a suero salino; cloruro urinario ALTO = alcalosis "resistente" (hiperaldosteronismo, diuréticos en uso).',
    mecanismo:
      'El Cl− sigue al Na+ para mantener la neutralidad eléctrica. Se reabsorbe por vía paracelular en el proximal, entra con el NKCC2 en la rama ascendente gruesa y con el NCC en el túbulo distal, pasando del lumen al INTERSTICIO. Su manejo está acoplado al del bicarbonato (intercambiador Cl−/HCO3−), lo que explica la relación inversa entre cloro y bicarbonato en los trastornos ácido-base.',
  },
  {
    id: 'mg',
    parametro: 'Mg2+',
    sangre: '1.7–2.4 mg/dL ≈ 1.4–2.0 mEq/L',
    orina: '72–120 mg/24 h',
    explSangre:
      'Valor normal 1.7–2.4 mg/dL. Bajo: pérdidas digestivas, alcoholismo, diuréticos o inhibidores de bomba de protones; produce calambres, arritmias y, de forma característica, hipopotasemia e hipocalcemia refractarias. Alto: casi siempre por insuficiencia renal o aporte excesivo.',
    explOrina:
      'Distingue el origen de una hipomagnesemia: si la eliminación urinaria de Mg2+ se mantiene alta pese al magnesio bajo en sangre, la pérdida es RENAL; si es baja, el riñón conserva bien y la pérdida es digestiva o por baja ingesta.',
    mecanismo:
      'A diferencia de otros iones, el Mg2+ se reabsorbe sobre todo en la RAMA ASCENDENTE GRUESA del asa de Henle, y lo hace por vía paracelular (entre las células) impulsado por el gradiente de voltaje positivo del lumen que genera el NKCC2. El ajuste final ocurre en el túbulo distal por el canal TRPM6 (vía transcelular hacia el intersticio). Como depende del NKCC2, los diuréticos de asa aumentan mucho su pérdida urinaria.',
  },
  {
    id: 'ca',
    parametro: 'Ca2+ total',
    sangre: '8.5–10.5 mg/dL',
    orina: '100–300 mg/24 h',
    explSangre:
      'Valor normal 8.5–10.5 mg/dL. Bajo: hipoparatiroidismo, déficit de vitamina D o hipoalbuminemia (ojo: corregir por albúmina). Alto: hiperparatiroidismo y neoplasias son las causas principales; da poliuria, estreñimiento y alteración del estado mental.',
    explOrina:
      'La calciuria (Ca2+ en orina) marca el riesgo de litiasis renal: cuanto más alta, mayor probabilidad de cálculos. También ayuda a diferenciar causas de hipercalcemia (p. ej. está baja en la hipercalcemia hipocalciúrica familiar).',
    mecanismo:
      'El Ca2+ se reabsorbe sobre todo de forma PASIVA y paracelular en el túbulo proximal y la rama ascendente gruesa, arrastrado junto al sodio y el agua. El ajuste fino y regulado por la PTH ocurre en el túbulo distal, por vía transcelular: entra del lumen por el canal TRPV5 y sale al INTERSTICIO por el intercambiador NCX y la Ca2+-ATPasa. La PTH aumenta esta reabsorción distal.',
  },
  {
    id: 'osm',
    parametro: 'Agua / Osmolalidad',
    sangre: '275–295 mOsm/kg',
    orina: '50–1200 mOsm/kg',
    explSangre:
      'Valor normal 275–295 mOsm/kg; refleja sobre todo al sodio. Alta = déficit de agua o hipernatremia. Baja = exceso de agua o hiponatremia. Es el estímulo principal que regula la sed y la liberación de ADH.',
    explOrina:
      'Muy variable según el estado de hidratación: ese amplio rango (50–1200) es justamente lo que demuestra que el riñón funciona. Orina diluida (baja) = no hay ADH (o no actúa) → se elimina agua libre. Orina concentrada (alta) = la ADH está actuando para retener agua. Comparar osmolalidad urinaria vs plasmática orienta el diagnóstico de hipo/hipernatremia.',
    mecanismo:
      'El agua se reabsorbe de forma OBLIGATORIA en el túbulo proximal y la rama descendente (siempre permeables, por las acuaporinas AQP1) siguiendo al sodio. La reabsorción REGULADA ocurre en el túbulo colector: la ADH (vasopresina) inserta acuaporinas AQP2 en la membrana luminal, permitiendo que el agua salga del lumen hacia el INTERSTICIO medular hipertónico → orina concentrada. Sin ADH, el colector es impermeable al agua → orina diluida.',
  },
  {
    id: 'urea',
    parametro: 'Urea',
    alias: 'BUN',
    sangre: '15–40 mg/dL',
    orina: '12–20 g/24 h',
    explSangre:
      'Urea 15–40 mg/dL (equivale a BUN 7–20 mg/dL). Refleja metabolismo proteico, hidratación y función renal. Alta: deshidratación, sangrado digestivo o catabolismo aumentado; en la insuficiencia prerrenal sube más que la creatinina (cociente BUN/creatinina >20). Baja: hepatopatía o baja ingesta de proteínas.',
    explOrina:
      'La excreción urinaria de urea depende de la ingesta proteica y de la capacidad de concentración renal. La urea no es solo un desecho: es pieza clave para concentrar la orina (ver mecanismo).',
    mecanismo:
      'La urea se filtra libremente y se reabsorbe de forma pasiva en el túbulo proximal. Lo importante es su RECICLAJE MEDULAR: en el túbulo colector medular interno, la ADH activa los transportadores UT-A1/A3, que dejan salir urea del lumen al INTERSTICIO medular. Allí aumenta la osmolalidad y ayuda a concentrar la orina; parte de esa urea reentra al asa de Henle, creando un ciclo que mantiene el gradiente medular.',
  },
  {
    id: 'hco3',
    parametro: 'HCO3−',
    alias: 'FEHCO3−',
    sangre: '22–28 mEq/L',
    orina: 'Bajo / casi ausente',
    explSangre:
      'Bicarbonato 22–28 mEq/L. Bajo: acidosis metabólica (o compensación de una alcalosis respiratoria). Alto: alcalosis metabólica (o compensación de una acidosis respiratoria). Es el componente "metabólico" del equilibrio ácido-base.',
    explOrina:
      'Normalmente la orina casi no tiene bicarbonato porque el riñón lo reabsorbe casi todo. Esto se mide con la fracción de excreción (FEHCO3−): <5% es normal. Una FEHCO3− >15% tras una carga de bicarbonato indica que el túbulo proximal no lo reabsorbe bien → acidosis tubular renal proximal (tipo 2).',
    mecanismo:
      'El ~85% del bicarbonato filtrado se reabsorbe en el TÚBULO PROXIMAL. No cruza directo: en el lumen, el intercambiador NHE3 secreta H+ que se une al HCO3− formando CO2 + H2O (gracias a la anhidrasa carbónica de borde en cepillo); el CO2 entra a la célula, se reconvierte en HCO3− y sale al INTERSTICIO por el cotransportador NBCe1. Por eso una orina sin bicarbonato es señal de un proximal sano.',
  },
  {
    id: 'creat',
    parametro: 'Creatinina',
    sangre: 'H: 0.7–1.3 mg/dL · M: 0.6–1.1 mg/dL',
    orina: '0.8–2.0 g/24 h',
    explSangre:
      'Marcador indirecto de función renal: cuando sube, el filtrado glomerular ha caído. Depende de la masa muscular (más alta en varones musculosos, más baja en ancianos o caquécticos), por lo que un valor "normal" puede ocultar daño renal en personas con poca masa.',
    explOrina:
      'La creatinina urinaria de 24 h sirve para validar la recolección (si es muy baja, la muestra está incompleta) y para calcular aclaramientos y cocientes (p. ej. proteína/creatinina). Es la base del cálculo del aclaramiento de creatinina.',
    mecanismo:
      'La creatinina es casi el marcador ideal del filtrado: se FILTRA libremente en el glomérulo y prácticamente NO se reabsorbe. Solo se le añade una pequeña SECRECIÓN tubular hacia el lumen (transportadores de cationes orgánicos OCT2 en el proximal), que hace que el aclaramiento de creatinina sobreestime un poco el filtrado glomerular real.',
  },
  {
    id: 'ph',
    parametro: 'pH',
    sangre: '7.35–7.45',
    orina: '4.5–8.0',
    explSangre:
      'Rango estrecho 7.35–7.45. Por debajo = acidemia; por encima = alcalemia. Junto con PCO2 y bicarbonato define el trastorno ácido-base. Pequeñas desviaciones ya tienen impacto clínico importante.',
    explOrina:
      'Rango amplio (4.5–8.0) según la carga ácida. Orina persistentemente alcalina pese a acidosis sistémica sugiere acidosis tubular renal distal (tipo 1) o infección por gérmenes ureasa-positivos (Proteus). Orina ácida es la respuesta normal del riñón ante una acidosis metabólica.',
    mecanismo:
      'El riñón acidifica la orina SECRETANDO H+ al lumen en el túbulo colector, a cargo de las células intercaladas tipo A mediante una H+-ATPasa (bomba de protones) y una H+/K+-ATPasa. Ese H+ se elimina tamponado por amonio (NH4+) y fosfato. Generar la orina ácida permite, a la vez, regenerar bicarbonato nuevo hacia el INTERSTICIO. Un fallo de esta bomba causa la ATR distal con orina inapropiadamente alcalina.',
  },
  {
    id: 'pco2',
    parametro: 'PCO2',
    sangre: '35–45 mmHg',
    orina: 'No aplica',
    explSangre:
      'PCO2 35–45 mmHg: es el componente RESPIRATORIO del equilibrio ácido-base. Alta = hipoventilación → acidosis respiratoria. Baja = hiperventilación → alcalosis respiratoria. También se mueve como compensación de trastornos metabólicos.',
    explOrina:
      'No se usa como parámetro urinario habitual (por eso "No aplica"): el CO2 es un gas que se regula por el pulmón, no por el túbulo renal.',
    mecanismo:
      'La PCO2 no tiene un manejo tubular como los solutos: se controla por la VENTILACIÓN pulmonar. El riñón actúa de forma indirecta y lenta sobre el equilibrio ácido-base ajustando la reabsorción de bicarbonato y la secreción de H+, pero no "transporta" CO2 en la nefrona.',
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
