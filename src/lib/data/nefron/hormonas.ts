// Hormonas que regulan el nefrón. Cada efecto multiplica el flujo de un
// transportador según el nivel: [suprimida, basal, alta]. Son factores
// orientativos para la animación, no medidas.

import type { Hormona, HormonaId } from './tipos.ts';

export const HORMONAS: Record<HormonaId, Hormona> = {
  adh: {
    id: 'adh', sigla: 'ADH', nombre: 'Hormona antidiurética (vasopresina)', color: '#3b9edd',
    origen: 'Hipotálamo (núcleos supraóptico y paraventricular); se libera desde la neurohipófisis.',
    estimulo: 'Subida de la osmolalidad del plasma (≈ 1-2 %) y, con más fuerza, la caída del volumen o de la presión. También náuseas, dolor, cirugía y algunos fármacos.',
    receptor: 'V2 en la membrana basolateral (AMPc).',
    celulas: ['principal', 'medular-interna', 'gruesa'],
    efectos: [
      { t: 'aqp2', factor: [0.05, 0.6, 1] },
      { t: 'v2r', factor: [0.1, 0.6, 1] },
      { t: 'uta1', factor: [0.2, 0.6, 1] },
      { t: 'uta3', factor: [0.3, 0.7, 1] },
      { t: 'nkcc2', factor: [0.85, 1, 1.15], en: ['gruesa'] },
    ],
    resumen: 'Abre la puerta del agua en el colector: lleva AQP2 a la membrana apical. También aumenta el reciclaje de urea y el trabajo de NKCC2, así que crece el gradiente medular.',
    esencial: {
      efecto: 'Más AQP2 en la membrana: se reabsorbe agua libre y la orina se concentra.',
      siSobra: 'SIADH: orina concentrada e hiponatremia con volumen normal.',
      siFalta: 'Diabetes insípida central: mucha orina diluida y sed.',
      perla: 'La desmopresina distingue las dos diabetes insípidas: corrige la central y no la nefrogénica.',
    },
    mecanismo: 'ADH → receptor V2 → proteína Gs → AMPc → PKA → fosforila AQP2 → las vesículas se funden con la membrana apical (minutos). A largo plazo aumenta la síntesis de AQP2. Por V1 contrae los vasos.',
  },
  aldosterona: {
    id: 'aldosterona', sigla: 'Aldo', nombre: 'Aldosterona', color: '#d97706',
    origen: 'Zona glomerular de la corteza suprarrenal.',
    estimulo: 'Angiotensina II (volumen bajo) y potasio alto. En menor medida, ACTH.',
    receptor: 'Receptor mineralocorticoide, dentro de la célula (nuclear).',
    celulas: ['principal', 'intercalada-a'],
    efectos: [
      { t: 'mr', factor: [0.1, 0.6, 1] },
      { t: 'enac', factor: [0.3, 1, 1.8], en: ['principal'] },
      { t: 'romk', factor: [0.45, 1, 1.6], en: ['principal'] },
      { t: 'nak', factor: [0.7, 1, 1.3], en: ['principal'] },
      { t: 'hatpasa', factor: [0.6, 1, 1.3], en: ['intercalada-a'] },
    ],
    resumen: 'Tarda horas porque cambia qué genes se leen: más ENaC y más Na⁺/K⁺-ATPasa en la célula principal. Retiene Na⁺ y pierde K⁺ y H⁺.',
    esencial: {
      efecto: 'Retiene Na⁺ y secreta K⁺ y H⁺ en el colector.',
      siSobra: 'Hipertensión, hipopotasemia y alcalosis metabólica (Conn).',
      siFalta: 'Hiperpotasemia con acidosis metabólica (ATR tipo 4) y pérdida de sal.',
      perla: 'El potasio alto la estimula directamente: por eso protege del K⁺ aunque el volumen esté bien.',
    },
    mecanismo: 'Aldosterona → receptor mineralocorticoide → núcleo → SGK1, que frena a Nedd4-2 (la ubiquitina ligasa que retira ENaC). Resultado: más ENaC, ROMK y Na⁺/K⁺-ATPasa. La 11β-HSD2 convierte el cortisol en cortisona para que no ocupe el receptor.',
  },
  angiotensina: {
    id: 'angiotensina', sigla: 'Ang II', nombre: 'Angiotensina II', color: '#c2410c',
    origen: 'Renina (células yuxtaglomerulares) corta el angiotensinógeno; la ECA, sobre todo en el pulmón, da la angiotensina II.',
    estimulo: 'Caída de la presión en la arteriola aferente, menos NaCl en la mácula densa y simpático (β1).',
    receptor: 'AT1 (proteína Gq).',
    celulas: ['proximal-s1', 'proximal-s3', 'distal'],
    efectos: [
      { t: 'nhe3', factor: [0.8, 1, 1.35], en: ['proximal-s1', 'proximal-s3'] },
      { t: 'ncc', factor: [0.8, 1, 1.2] },
    ],
    resumen: 'Defiende el volumen: contrae la arteriola eferente (sostiene la filtración), activa NHE3 en el proximal y NCC en el distal, y libera aldosterona y ADH.',
    esencial: {
      efecto: 'Más reabsorción proximal de Na⁺ y HCO₃⁻; contrae la eferente.',
      siSobra: 'Hipertensión; alcalosis de contracción.',
      siFalta: 'Con IECA o ARA-II, la filtración cae si el riñón depende de la eferente (estenosis bilateral de la arteria renal).',
      perla: 'Al contraer la eferente sube la fracción de filtración: los IECA la bajan y protegen al glomérulo de la hiperfiltración (diabetes).',
    },
    mecanismo: 'AT1 → Gq → más NHE3 apical y Na⁺/K⁺-ATPasa en el proximal. En el glomérulo contrae más la eferente que la aferente. Estimula la sed, la ADH y la aldosterona.',
  },
  pth: {
    id: 'pth', sigla: 'PTH', nombre: 'Hormona paratiroidea', color: '#7c8a1a',
    origen: 'Glándulas paratiroides.',
    estimulo: 'Calcio sérico bajo (lo detecta el CaSR de la paratiroides) y fosfato alto.',
    receptor: 'PTH1R en la membrana basolateral (AMPc).',
    celulas: ['proximal-s1', 'distal'],
    efectos: [
      { t: 'pth1r', factor: [0.1, 0.6, 1] },
      { t: 'napi2a', factor: [1.25, 1, 0.4] },
      { t: 'trpv5', factor: [0.6, 1, 1.5] },
    ],
    resumen: 'Retiene calcio y pierde fosfato: en el proximal retira NaPi-IIa (fosfaturia) y en el distal abre TRPV5. Además activa la 1α-hidroxilasa (calcitriol).',
    esencial: {
      efecto: 'Más Ca²⁺ reabsorbido en el distal y fosfaturia en el proximal.',
      siSobra: 'Hipercalcemia con hipofosfatemia (hiperparatiroidismo primario).',
      siFalta: 'Hipocalcemia con hiperfosfatemia.',
      perla: 'También frena NHE3 en el proximal: el hiperparatiroidismo puede dar una acidosis hiperclorémica leve.',
    },
    mecanismo: 'PTH1R → AMPc y PKC. Proximal: endocitosis de NaPi-IIa, frena NHE3 y activa la 1α-hidroxilasa (CYP27B1). Distal y conector: más TRPV5 y calbindina.',
  },
  anp: {
    id: 'anp', sigla: 'ANP', nombre: 'Péptido natriurético auricular', color: '#22a06b',
    origen: 'Miocitos de las aurículas (el BNP, de los ventrículos).',
    estimulo: 'Distensión de la aurícula por exceso de volumen.',
    receptor: 'NPR-A (guanilato ciclasa, GMPc).',
    celulas: ['medular-interna'],
    efectos: [
      { t: 'npra', factor: [0.1, 0.6, 1] },
      { t: 'enac', factor: [1.1, 1, 0.55], en: ['medular-interna'] },
    ],
    resumen: 'La contra del sistema renina-angiotensina-aldosterona: dilata la aferente (más filtración), cierra los canales de Na⁺ del colector medular y frena renina, aldosterona y ADH.',
    esencial: {
      efecto: 'Natriuresis: más filtración y menos reabsorción final de Na⁺.',
      siSobra: 'Natriuresis y algo de hipotensión.',
      siFalta: 'Más retención de sal.',
      perla: 'Explica el «escape» de la aldosterona: en el Conn no hay edema porque la natriuresis por ANP y por presión compensa.',
    },
    mecanismo: 'NPR-A → GMPc → cierra canales de Na⁺ en el colector medular. Dilata la aferente y contrae la eferente: sube la filtración. Inhibe la renina y la aldosterona.',
  },
};

export const HORMONA_LIST = Object.values(HORMONAS);
