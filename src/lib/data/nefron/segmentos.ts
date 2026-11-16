// Segmentos del nefrón, del glomérulo a la papila. Los porcentajes son de lo
// filtrado y son rangos orientativos (docs/nefron/CONTENIDO.md).

import type { Segmento, SegmentoId, TramoId } from './tipos.ts';

export const SEGMENTOS: Record<SegmentoId, Segmento> = {
  glomerulo: {
    id: 'glomerulo', nombre: 'Glomérulo y cápsula de Bowman', corto: 'Glomérulo', sigla: 'Glom',
    zona: 'Corteza', color: '#ef3a5d', agua: 'permeable',
    resumen: 'Un ovillo de capilares entre dos arteriolas. La presión de la sangre empuja plasma a través de la barrera hacia el espacio de Bowman: ≈ 125 mL/min, 180 L al día.',
    reabsorbe: [
      { s: 'agua', cuanto: 'Filtra ≈ 20 % del plasma que llega', como: 'Fracción de filtración = TFG / flujo plasmático renal' },
      { s: 'na', cuanto: 'Se filtra libremente', como: 'Iones y moléculas pequeñas pasan con el agua' },
      { s: 'glucosa', cuanto: 'Se filtra libremente', como: 'Su concentración en el filtrado es la del plasma' },
      { s: 'albumina', cuanto: 'Casi nada', como: 'Retenida por tamaño y carga negativa' },
    ],
    celulas: ['barrera'], secuencia: ['barrera'],
    esencial: {
      funcion: 'Filtra el plasma: agua y solutos pequeños pasan; células y proteínas no.',
      claves: [],
      siFalla: 'Cae la filtración (insuficiencia renal) o pasa proteína (síndrome nefrótico o nefrítico).',
      perla: 'La filtración depende de la presión en el capilar: la angiotensina II contrae la eferente y la sostiene; los AINE (aferente) y los IECA (eferente) la bajan.',
    },
    histologia: 'Capilares con endotelio fenestrado, membrana basal glomerular (colágeno IV, heparán sulfato) y podocitos con pies entrelazados. Entre los capilares, el mesangio. La cápsula de Bowman tiene una hoja parietal plana.',
    clinica: 'Proteinuria con cuerpos ovales grasos: síndrome nefrótico (cambios mínimos, membranosa, GEFS). Hematuria con cilindros eritrocitarios: síndrome nefrítico. La TFG se estima con la creatinina.',
  },
  proximal: {
    id: 'proximal', nombre: 'Túbulo contorneado proximal', corto: 'Proximal', sigla: 'TCP',
    zona: 'Corteza', color: '#ff8a3d', agua: 'permeable',
    resumen: 'El segmento de gran capacidad: recupera la mayor parte de lo útil y lo hace sin cambiar la osmolalidad del líquido (sigue en ≈ 300 mOsm/kg).',
    reabsorbe: [
      { s: 'na', cuanto: '≈ 65-70 % (con el recto)', como: 'NHE3 y cotransportes con Na⁺; sale por la Na⁺/K⁺-ATPasa' },
      { s: 'agua', cuanto: '≈ 65-70 %', como: 'AQP1 y entre las células, detrás del soluto' },
      { s: 'glucosa', cuanto: '≈ 90 %', como: 'SGLT2 y salida por GLUT2' },
      { s: 'aa', cuanto: '> 98 %', como: 'Cotransportes con Na⁺' },
      { s: 'hco3', cuanto: '≈ 80 %', como: 'NHE3 + anhidrasa carbónica + NBCe1' },
      { s: 'fosfato', cuanto: '≈ 80 %', como: 'NaPi-IIa (la PTH lo frena)' },
      { s: 'k', cuanto: '≈ 65 %', como: 'Entre las células, con el agua' },
      { s: 'ca', cuanto: '≈ 65 %', como: 'Entre las células, con el agua' },
      { s: 'urea', cuanto: '≈ 50 %', como: 'Difunde al concentrarse la luz' },
    ],
    celulas: ['proximal-s1'], secuencia: ['proximal-s1'],
    esencial: {
      funcion: 'Recupera ≈ 2/3 de la sal y el agua y casi toda la glucosa, los aminoácidos y el bicarbonato.',
      claves: ['sglt2', 'nhe3', 'napi2a', 'nak', 'nbce1', 'aqp1'],
      siFalla: 'Síndrome de Fanconi o acidosis tubular proximal (tipo 2).',
      perla: 'Aquí la reabsorción es isoosmótica: el líquido sale del proximal más escaso, pero igual de concentrado.',
    },
    histologia: 'Epitelio cúbico con borde en cepillo muy alto, citoplasma eosinófilo por las mitocondrias, luz estrecha y desordenada. Es el túbulo más abundante en un corte de corteza.',
    clinica: 'Fanconi (mieloma, cistinosis, tenofovir, ifosfamida), ATR tipo 2, glucosuria renal, cistinuria. Diana de las gliflozinas y la acetazolamida. Muy sensible a isquemia y tóxicos.',
  },
  recto: {
    id: 'recto', nombre: 'Túbulo proximal recto (S3)', corto: 'Proximal recto', sigla: 'S3',
    zona: 'Franja externa de la médula externa', color: '#ffb829', agua: 'permeable',
    resumen: 'La parte recta del proximal, que baja hacia la médula. Termina de recuperar la glucosa y secreta fármacos y toxinas.',
    reabsorbe: [
      { s: 'glucosa', cuanto: '≈ 10 % restante', como: 'SGLT1 (2 Na⁺ por glucosa)' },
      { s: 'agua', cuanto: 'Una parte menor', como: 'AQP1' },
      { s: 'aniones', cuanto: 'Secreta', como: 'OAT1 en la base y MRP4 en la luz' },
      { s: 'cationes', cuanto: 'Secreta', como: 'OCT2 en la base y MATE1 en la luz' },
    ],
    celulas: ['proximal-s3'], secuencia: ['proximal-s3'],
    esencial: {
      funcion: 'Recoge la última glucosa y secreta aniones y cationes orgánicos.',
      claves: ['sglt1', 'oat1', 'oct2', 'mate1', 'mrp4'],
      siFalla: 'Los fármacos que se eliminan por secreción se acumulan.',
      perla: 'La secreción explica que la penicilina, la furosemida o el PAH se eliminen mucho más rápido de lo que se filtran.',
    },
    histologia: 'Cúbico, con borde en cepillo más bajo y menos mitocondrias que S1. Recorre la franja externa de la médula externa.',
    clinica: 'Zona más dañada en la necrosis tubular aguda isquémica (mucha demanda, poco oxígeno). La cimetidina y el trimetoprim frenan aquí la secreción de creatinina.',
  },
  descendente: {
    id: 'descendente', nombre: 'Rama descendente delgada del asa de Henle', corto: 'Descendente delgada', sigla: 'DD',
    zona: 'Médula', color: '#33c4f0', agua: 'permeable',
    resumen: 'Baja hacia la papila y pierde agua hacia una médula cada vez más concentrada. La sal se queda dentro: el líquido se concentra.',
    reabsorbe: [
      { s: 'agua', cuanto: '≈ 15 %', como: 'AQP1, hacia el intersticio hipertónico' },
      { s: 'urea', cuanto: 'Entra a la luz', como: 'Reciclaje de urea desde el intersticio' },
    ],
    celulas: ['descendente'], secuencia: ['descendente'],
    esencial: {
      funcion: 'Saca agua: el líquido se concentra hasta igualar la médula.',
      claves: ['aqp1'],
      siFalla: 'Sin gradiente medular no se concentra la orina.',
      perla: 'Es permeable al agua y casi impermeable a la sal: lo contrario de la rama ascendente.',
    },
    histologia: 'Epitelio plano simple; se parece a un capilar, pero sin glóbulos rojos en la luz.',
    clinica: 'Cualquier cosa que lave el gradiente (diuresis osmótica, diuréticos de asa) le quita la fuerza para sacar agua.',
  },
  'ascendente-delgada': {
    id: 'ascendente-delgada', nombre: 'Rama ascendente delgada del asa de Henle', corto: 'Ascendente delgada', sigla: 'AD',
    zona: 'Médula interna', color: '#22d3b4', agua: 'impermeable',
    resumen: 'Sube desde la punta del asa. Impermeable al agua: el NaCl sale pasivamente y el líquido se va diluyendo.',
    reabsorbe: [
      { s: 'na', cuanto: 'Una parte del NaCl', como: 'ClC-K1 (Cl⁻) y entre las células (Na⁺), sin gastar ATP' },
    ],
    celulas: ['ascendente-delgada'], secuencia: ['ascendente-delgada'],
    esencial: {
      funcion: 'Saca NaCl sin agua de forma pasiva.',
      claves: ['clck1'],
      siFalla: 'Menos gradiente en la médula interna.',
      perla: 'Aquí se invierte la permeabilidad: desde la punta del asa, el agua ya no puede salir.',
    },
    histologia: 'Epitelio plano simple, solo en los nefrones yuxtamedulares de asa larga.',
    clinica: 'Rara vez se lesiona sola; participa en la concentración de la médula interna.',
  },
  gruesa: {
    id: 'gruesa', nombre: 'Rama ascendente gruesa del asa de Henle', corto: 'Rama gruesa', sigla: 'RAG',
    zona: 'Médula externa y corteza', color: '#3d6df2', agua: 'impermeable',
    resumen: 'El segmento diluyente: bombea NaCl al intersticio sin dejar salir agua. Así crea el gradiente de la médula y entrega un líquido diluido (≈ 100 mOsm/kg). Termina en la mácula densa.',
    reabsorbe: [
      { s: 'na', cuanto: '≈ 25 %', como: 'NKCC2 (sale por la Na⁺/K⁺-ATPasa y entre las células)' },
      { s: 'k', cuanto: '≈ 20-25 %', como: 'NKCC2, con parte reciclada por ROMK' },
      { s: 'ca', cuanto: '≈ 20-25 %', como: 'Entre las células, por la luz positiva' },
      { s: 'mg', cuanto: '≈ 60-70 %', como: 'Entre las células (claudinas 16 y 19)' },
      { s: 'hco3', cuanto: '≈ 10-15 %', como: 'NHE3' },
      { s: 'agua', cuanto: '0 %', como: 'Impermeable al agua' },
    ],
    celulas: ['gruesa', 'macula-densa'], secuencia: ['gruesa'],
    esencial: {
      funcion: 'Reabsorbe ≈ 25 % del NaCl sin agua: diluye el líquido y crea el gradiente medular.',
      claves: ['nkcc2', 'romk', 'clckb', 'nak'],
      siFalla: 'No se concentra ni se diluye la orina; se pierden K⁺, Ca²⁺ y Mg²⁺.',
      perla: 'Es el sitio de la furosemida, el diurético más potente, porque aquí se reabsorbe ≈ 1/4 del sodio.',
    },
    histologia: 'Cúbico bajo, sin borde en cepillo, con muchas mitocondrias y pliegues basales. Al final, junto al glomérulo, las células altas y apretadas de la mácula densa.',
    clinica: 'Bartter, diuréticos de asa. La hipercalcemia frena NKCC2 por el CaSR y da poliuria. Aquí se fabrica la proteína de Tamm-Horsfall (uromodulina), la matriz de los cilindros.',
  },
  distal: {
    id: 'distal', nombre: 'Túbulo contorneado distal', corto: 'Distal', sigla: 'TCD',
    zona: 'Corteza', color: '#21c46b', agua: 'impermeable',
    resumen: 'Sigue sacando NaCl sin agua (NCC), así que el líquido se diluye aún más. Es donde la PTH recupera calcio.',
    reabsorbe: [
      { s: 'na', cuanto: '≈ 5 %', como: 'NCC' },
      { s: 'ca', cuanto: '≈ 5-10 %', como: 'TRPV5 → calbindina → NCX1 y PMCA (la PTH lo aumenta)' },
      { s: 'mg', cuanto: '≈ 5-10 %', como: 'TRPM6' },
      { s: 'agua', cuanto: '0 %', como: 'Impermeable aun con ADH' },
    ],
    celulas: ['distal'], secuencia: ['distal'],
    esencial: {
      funcion: 'Reabsorbe ≈ 5 % del NaCl, ajusta el calcio (PTH) y el magnesio.',
      claves: ['ncc', 'trpv5', 'trpm6', 'ncx1'],
      siFalla: 'Hipopotasemia, alcalosis, hipomagnesemia e hipocalciuria (Gitelman).',
      perla: 'Las tiazidas actúan aquí: bajan el calcio urinario (útil en los cálculos de calcio) y dan hiponatremia más que los de asa.',
    },
    histologia: 'Cúbico, sin borde en cepillo, luz más amplia y limpia que el proximal; núcleos más juntos. Muchas mitocondrias.',
    clinica: 'Gitelman, tiazidas, pseudohipoaldosteronismo tipo 2 (Gordon, cinasas WNK: NCC hiperactivo con hipertensión e hiperpotasemia).',
  },
  conector: {
    id: 'conector', nombre: 'Túbulo conector', corto: 'Conector', sigla: 'TC',
    zona: 'Corteza', color: '#a3d633', agua: 'segun ADH',
    resumen: 'Une el distal con el colector. Sus células se parecen a las principales (ENaC, ROMK, AQP2), con intercaladas entre ellas.',
    reabsorbe: [
      { s: 'na', cuanto: '≈ 2 %', como: 'ENaC (aldosterona)' },
      { s: 'k', cuanto: 'Secreta', como: 'ROMK' },
      { s: 'ca', cuanto: 'Ajuste fino', como: 'TRPV5' },
      { s: 'agua', cuanto: 'Variable', como: 'AQP2 si hay ADH' },
    ],
    celulas: ['principal', 'intercalada-a', 'intercalada-b'],
    secuencia: ['principal', 'principal', 'intercalada-a', 'principal', 'intercalada-b'],
    esencial: {
      funcion: 'Empieza el ajuste fino: Na⁺ por aldosterona, K⁺ y agua por ADH.',
      claves: ['enac', 'romk', 'aqp2'],
      siFalla: 'Lo mismo que el colector cortical.',
      perla: 'Varios nefrones vacían su conector en un mismo colector.',
    },
    histologia: 'Transición entre el distal y el colector, con células del conector y células intercaladas.',
    clinica: 'Comparte las enfermedades del colector (Liddle, hipoaldosteronismo).',
  },
  'colector-cortical': {
    id: 'colector-cortical', nombre: 'Túbulo colector cortical', corto: 'Colector cortical', sigla: 'CCC',
    zona: 'Corteza', color: '#a65cf2', agua: 'segun ADH',
    resumen: 'Ajuste fino del sodio, el potasio, el ácido y el agua, según lo que pidan la aldosterona y la ADH.',
    reabsorbe: [
      { s: 'na', cuanto: '≈ 2-3 %', como: 'ENaC en la célula principal (aldosterona)' },
      { s: 'k', cuanto: 'Secreta (o reabsorbe si falta)', como: 'ROMK (principal) · H⁺/K⁺-ATPasa (intercalada α)' },
      { s: 'h', cuanto: 'Secreta', como: 'H⁺-ATPasa de la intercalada α' },
      { s: 'hco3', cuanto: 'Secreta si sobra', como: 'Pendrina de la intercalada β' },
      { s: 'agua', cuanto: 'Variable (0-10 %)', como: 'AQP2 con ADH' },
    ],
    celulas: ['principal', 'intercalada-a', 'intercalada-b'],
    secuencia: ['principal', 'principal', 'intercalada-a', 'principal', 'principal', 'intercalada-b'],
    esencial: {
      funcion: 'Decide cuánto Na⁺, K⁺, ácido y agua se queda, según aldosterona y ADH.',
      claves: ['enac', 'romk', 'aqp2', 'hatpasa', 'pendrina'],
      siFalla: 'Alteraciones del K⁺ y del ácido-base (hiperaldosteronismo, ATR 1 y 4, Liddle).',
      perla: 'Dos tercios de las células son principales y un tercio intercaladas: así se ven en un corte, claras y oscuras.',
    },
    histologia: 'Cúbico con límites celulares nítidos: células principales claras y células intercaladas más oscuras.',
    clinica: 'Liddle, hiperaldosteronismo primario, ATR tipo 1 y 4, diabetes insípida nefrogénica. Diana de amilorida y espironolactona.',
  },
  'colector-medular': {
    id: 'colector-medular', nombre: 'Túbulo colector medular', corto: 'Colector medular', sigla: 'CCM',
    zona: 'Médula, hasta la papila', color: '#7b3fe0', agua: 'segun ADH',
    resumen: 'Atraviesa la médula hasta la papila. Con ADH sale agua hacia el intersticio concentrado y la orina llega a ≈ 1200 mOsm/kg; sin ADH baja diluida.',
    reabsorbe: [
      { s: 'agua', cuanto: 'Variable (hasta ≈ 5 %)', como: 'AQP2 con ADH' },
      { s: 'urea', cuanto: 'Recicla a la médula', como: 'UT-A1 y UT-A3 con ADH' },
      { s: 'na', cuanto: '≈ 1 %', como: 'ENaC (el ANP lo frena)' },
      { s: 'h', cuanto: 'Secreta (médula externa)', como: 'Intercaladas α y NH₄⁺' },
    ],
    celulas: ['medular-interna', 'intercalada-a'],
    secuencia: ['medular-interna', 'medular-interna', 'medular-interna', 'intercalada-a'],
    esencial: {
      funcion: 'Concentración final de la orina y reciclaje de urea.',
      claves: ['aqp2', 'uta1', 'v2r', 'npra'],
      siFalla: 'Orina diluida con ADH alta (diabetes insípida nefrogénica).',
      perla: 'La orina final va de ≈ 50 a ≈ 1200 mOsm/kg: lo decide solo la ADH en este segmento.',
    },
    histologia: 'Cúbico que se vuelve cilíndrico hacia la papila; desemboca por los conductos papilares (de Bellini) en el cáliz menor.',
    clinica: 'Diabetes insípida nefrogénica (litio, hipercalcemia, hipopotasemia, mutaciones de V2 o AQP2). Necrosis papilar (AINE, diabetes, falciformes).',
  },
};

/** Los nueve tramos del túbulo en el orden del filtrado. */
export const TRAMOS: TramoId[] = [
  'proximal', 'recto', 'descendente', 'ascendente-delgada', 'gruesa',
  'distal', 'conector', 'colector-cortical', 'colector-medular',
];

export const SEGMENTO_ORDEN: SegmentoId[] = ['glomerulo', ...TRAMOS];
export const SEGMENTO_LIST = SEGMENTO_ORDEN.map((id) => SEGMENTOS[id]);
