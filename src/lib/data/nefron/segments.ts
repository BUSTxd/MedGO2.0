// Segmentos del nefrón: resumen para el MODO SIMPLE, reabsorción por sustancia,
// descripción del zoom de segmento y células (con sus transportadores) para el
// zoom celular. Los porcentajes son RANGOS ORIENTATIVOS educativos.

import type { SegmentDef } from '@/app/dashboard/laboratorio/nefron-interactivo/engine/types';

export const SEGMENTS: SegmentDef[] = [
  {
    id: 'glomerulo',
    nombre: 'Glomérulo',
    corto: 'Glomérulo',
    zona: 'glomerulo',
    permeableAgua: 'si',
    color: '#ef4444',
    resumenSimple: 'Filtra el plasma: pasan agua y solutos pequeños; quedan retenidas las proteínas y células.',
    reabsorcion: [
      { sustancia: 'agua', detalle: 'Ultrafiltración (~180 L/día)' },
      { sustancia: 'na', detalle: 'Se filtra libremente' },
      { sustancia: 'glucosa', detalle: 'Se filtra libremente' },
    ],
    descripcion:
      'La barrera de filtración (endotelio fenestrado · membrana basal glomerular · podocitos con diafragma de filtración) deja pasar agua y solutos pequeños hacia el espacio de Bowman, restringiendo proteínas y células. El balance de fuerzas de Starling (presión hidrostática capilar vs. presión oncótica) y el tono de las arteriolas aferente/eferente determinan la tasa de filtración glomerular.',
    celulas: [
      {
        id: 'barrera',
        nombre: 'Barrera de filtración',
        descripcion: 'Endotelio fenestrado, membrana basal y podocitos. Su daño produce proteinuria.',
        morfologia: 'plana',
        transportadores: [],
      },
    ],
  },
  {
    id: 'tcp',
    nombre: 'Túbulo contorneado proximal',
    corto: 'Proximal (TCP)',
    subsegmentos: ['S1', 'S2', 'S3'],
    zona: 'corteza',
    permeableAgua: 'si',
    color: '#f59e0b',
    resumenSimple: 'Reabsorbe la mayor parte de Na⁺, agua, HCO₃⁻, glucosa y aminoácidos.',
    reabsorcion: [
      { sustancia: 'na', detalle: '65–70% (NHE3, Na⁺/K⁺-ATPasa)' },
      { sustancia: 'agua', detalle: '65–70% (AQP1, isosmótica)' },
      { sustancia: 'hco3', detalle: '80–90% (NHE3 + anhidrasa carbónica)' },
      { sustancia: 'glucosa', detalle: '~100% (SGLT2 / SGLT1)' },
      { sustancia: 'aa', detalle: 'Casi total' },
      { sustancia: 'fosfato', detalle: 'NaPi-IIa (regulado por PTH)' },
      { sustancia: 'cl', detalle: '~60–70%, sobre todo paracelular' },
    ],
    descripcion:
      'Segmento de alta capacidad de reabsorción, muy dependiente de la Na⁺/K⁺-ATPasa basolateral. Recupera la mayoría del Na⁺, agua, bicarbonato, glucosa, aminoácidos y fosfato; secreta H⁺ (NHE3) y participa en la amoniogénesis y en la secreción de ácidos/bases orgánicas. Se divide en S1, S2 y S3 (S3 es el más vulnerable a la isquemia).',
    celulas: [
      {
        id: 'tcp-s1',
        nombre: 'S1 — proximal inicial',
        descripcion: 'Máxima capacidad reabsortiva. RECUPERACIÓN DE HCO₃⁻: el H⁺ secretado por NHE3 se une al HCO₃⁻ filtrado en la luz → la anhidrasa carbónica luminal (CA IV) lo convierte en CO₂ + H₂O; el CO₂ entra a la célula, la CA II citosólica regenera H⁺ + HCO₃⁻; el H⁺ se recicla por NHE3 y el HCO₃⁻ sale a sangre por NBCe1.',
        morfologia: 'cuboidal',
        bordeCepillo: true,
        transportadores: ['nhe3', 'sglt2', 'napi', 'aqp1-tcp', 'nak-tcp', 'nbce1', 'glut2'],
        luminal: [{ texto: 'H⁺ + HCO₃⁻ → CO₂ + H₂O', enzima: 'anhidrasa carbónica IV' }],
        intracelular: [{ texto: 'CO₂ + H₂O → H⁺ + HCO₃⁻', enzima: 'anhidrasa carbónica II' }],
      },
      {
        id: 'tcp-s2',
        nombre: 'S2 — proximal medio',
        descripcion: 'Sigue reabsorbiendo Na⁺, agua y HCO₃⁻ (NHE3, AQP1, NBCe1), pero cobra protagonismo la SECRECIÓN de aniones (OAT1/3 → OAT4) y cationes (OCT2 → MATE1) orgánicos, fármacos y toxinas hacia el lumen.',
        morfologia: 'cuboidal',
        bordeCepillo: true,
        transportadores: ['nhe3', 'aqp1-tcp', 'nak-tcp', 'nbce1', 'glut2', 'oat3', 'oat4', 'oct2', 'mate1'],
      },
      {
        id: 'tcp-s3',
        nombre: 'S3 — proximal recto',
        descripcion: 'Menos borde en cepillo; recupera la glucosa restante con SGLT1 (alta afinidad). Zona vulnerable a isquemia/toxicidad (necrosis tubular aguda).',
        morfologia: 'cuboidal',
        bordeCepillo: true,
        transportadores: ['sglt1', 'nhe3', 'aqp1-tcp', 'nak-tcp', 'glut2'],
      },
    ],
  },
  {
    id: 'asa-desc',
    nombre: 'Asa descendente delgada',
    corto: 'Asa descendente',
    zona: 'medula',
    permeableAgua: 'si',
    color: '#38bdf8',
    resumenSimple: 'Sale agua hacia la médula; casi no reabsorbe sal.',
    reabsorcion: [
      { sustancia: 'agua', detalle: '10–15% (AQP1, hacia el intersticio)' },
    ],
    descripcion:
      'Muy permeable al agua e impermeable al NaCl. El agua abandona el lumen siguiendo el gradiente corticomedular hipertónico, concentrando el líquido tubular. Es uno de los brazos del multiplicador contracorriente. La urea entra al lumen (UT-A2) en la médula.',
    celulas: [
      {
        id: 'asa-desc-cell',
        nombre: 'Célula del asa descendente',
        descripcion: 'Epitelio delgado con AQP1; mínimo transporte activo de NaCl.',
        morfologia: 'plana',
        transportadores: ['aqp1-asa'],
      },
    ],
  },
  {
    id: 'asa-asc-delgada',
    nombre: 'Asa ascendente delgada',
    corto: 'Asc. delgada',
    zona: 'medula',
    permeableAgua: 'no',
    color: '#2dd4bf',
    resumenSimple: 'Sale NaCl pasivo al intersticio; impermeable al agua. Empieza a diluir el filtrado.',
    reabsorcion: [
      { sustancia: 'na', detalle: 'Salida pasiva (sin agua)' },
      { sustancia: 'cl', detalle: 'Salida pasiva' },
    ],
    descripcion:
      'Impermeable al agua; permite la salida PASIVA de NaCl hacia el intersticio medular hipertónico (sobre todo en nefronas yuxtamedulares). Es uno de los brazos del multiplicador contracorriente y empieza a diluir el líquido tubular antes de la rama gruesa.',
    celulas: [
      {
        id: 'asa-asc-cell',
        nombre: 'Célula delgada ascendente',
        descripcion: 'Epitelio plano impermeable al agua; salida pasiva de NaCl, sin transporte activo.',
        morfologia: 'plana',
        transportadores: ['nacl-pas'],
      },
    ],
  },
  {
    id: 'tal',
    nombre: 'Asa ascendente gruesa (TAL)',
    corto: 'Asa gruesa (TAL)',
    zona: 'medula',
    permeableAgua: 'no',
    color: '#22c55e',
    resumenSimple: 'Reabsorbe Na⁺, K⁺ y Cl⁻; impermeable al agua (segmento diluyente).',
    reabsorcion: [
      { sustancia: 'na', detalle: '20–25% (NKCC2)' },
      { sustancia: 'cl', detalle: '20–25% (NKCC2)' },
      { sustancia: 'k', detalle: 'Reabsorbe; ROMK recicla al lumen' },
      { sustancia: 'mg', detalle: '60–70% (paracelular)' },
      { sustancia: 'ca', detalle: '20–25% (paracelular)' },
    ],
    descripcion:
      'Reabsorbe Na⁺-K⁺-2Cl⁻ por NKCC2 sin agua (genera el segmento diluyente y la hipertonicidad medular). El reciclaje de K⁺ por ROMK crea un potencial luminal positivo que impulsa la reabsorción paracelular de Ca²⁺ y Mg²⁺. Es el sitio de acción de los diuréticos de asa y del síndrome de Bartter.',
    celulas: [
      {
        id: 'tal-cell',
        nombre: 'Célula de la TAL',
        descripcion: 'Apical: NKCC2 + ROMK. Basolateral: Na⁺/K⁺-ATPasa + ClC-Kb. Vía paracelular para Ca²⁺/Mg²⁺.',
        morfologia: 'cuboidal',
        transportadores: ['nkcc2', 'romk-tal', 'paracel-tal', 'nak-tal', 'clckb-tal'],
      },
    ],
  },
  {
    id: 'tcd',
    nombre: 'Túbulo contorneado distal (TCD)',
    corto: 'Distal (TCD)',
    subsegmentos: ['TCD temprano', 'TCD tardío / conector'],
    zona: 'corteza',
    permeableAgua: 'no',
    color: '#a855f7',
    resumenSimple: 'Reabsorbe NaCl, Ca²⁺ y Mg²⁺; impermeable al agua sin ADH.',
    reabsorcion: [
      { sustancia: 'na', detalle: '5–7% (NCC)' },
      { sustancia: 'cl', detalle: '~5% (NCC)' },
      { sustancia: 'ca', detalle: '8–10% (TRPV5, regulado por PTH)' },
      { sustancia: 'mg', detalle: '5–10% (TRPM6, ajuste final)' },
    ],
    descripcion:
      'Reabsorbe NaCl por NCC (blanco de las tiazidas) y ajusta el calcio (TRPV5 → calbindina → NCX1/Ca²⁺-ATPasa) y el magnesio (TRPM6). Baja permeabilidad al agua. Su disfunción genética es el síndrome de Gitelman. El TCD tardío transiciona hacia células principales e intercaladas.',
    celulas: [
      {
        id: 'tcd-cell',
        nombre: 'Célula del TCD',
        descripcion: 'Apical: NCC, TRPV5, TRPM6. Basolateral: Na⁺/K⁺-ATPasa, NCX1 y Ca²⁺-ATPasa.',
        morfologia: 'cuboidal',
        transportadores: ['ncc', 'trpv5', 'trpm6', 'nak-tcd', 'ncx1'],
      },
    ],
  },
  {
    id: 'conector-cortical',
    nombre: 'Túbulo conector / colector cortical',
    corto: 'Colector cortical',
    subsegmentos: ['Célula principal', 'Intercalada α', 'Intercalada β'],
    zona: 'corteza',
    permeableAgua: 'adh',
    color: '#3b82f6',
    resumenSimple: 'Regula Na⁺, K⁺, H⁺ y agua según aldosterona y ADH; ajuste fino ácido-base.',
    reabsorcion: [
      { sustancia: 'na', detalle: '2–5% (ENaC, regulado por aldosterona)' },
      { sustancia: 'k', detalle: 'Secreción (ROMK, BK)' },
      { sustancia: 'h', detalle: 'Secreción (H⁺-ATPasa, célula α)' },
      { sustancia: 'hco3', detalle: 'Secreción en alcalosis (pendrina, célula β)' },
      { sustancia: 'agua', detalle: 'Variable (AQP2, según ADH)' },
    ],
    descripcion:
      'Sitio del ajuste final. La célula principal reabsorbe Na⁺ (ENaC) y secreta K⁺ (ROMK/BK) bajo control de la aldosterona, y reabsorbe agua (AQP2) bajo ADH. La célula intercalada α secreta H⁺ (H⁺-ATPasa, H⁺/K⁺-ATPasa) generando nuevo HCO₃⁻; la β secreta HCO₃⁻ (pendrina). Aquí actúan espironolactona, amilorida, Liddle, hiperaldosteronismo y la ATR tipo 1 y tipo 4.',
    celulas: [
      {
        id: 'principal',
        nombre: 'Célula principal',
        descripcion: 'ENaC + ROMK + BK apicales, Na⁺/K⁺-ATPasa basolateral, AQP2 (ADH) con salida por AQP3/4 y receptor mineralocorticoide.',
        morfologia: 'cuboidal',
        transportadores: ['enac', 'romk-ccd', 'bk', 'aqp2-ccd', 'nak-ccd', 'aqp34', 'mr'],
      },
      {
        id: 'intercalada-alfa',
        nombre: 'Célula intercalada α',
        descripcion: 'Secreta H⁺ (H⁺-ATPasa y H⁺/K⁺-ATPasa) y genera HCO₃⁻ nuevo que sale a sangre por AE1. Falla en la ATR tipo 1.',
        morfologia: 'cuboidal',
        transportadores: ['h-atpasa', 'hk-atpasa', 'ae1'],
        intracelular: [{ texto: 'CO₂ + H₂O → H⁺ + HCO₃⁻', enzima: 'anhidrasa carbónica II' }],
      },
      {
        id: 'intercalada-beta',
        nombre: 'Célula intercalada β',
        descripcion: 'Imagen especular de la α: secreta HCO₃⁻ al lumen por pendrina (reabsorbe Cl⁻) y expulsa H⁺ a sangre por la H⁺-ATPasa basolateral.',
        morfologia: 'cuboidal',
        transportadores: ['pendrina', 'hatpasa-baso'],
        intracelular: [{ texto: 'CO₂ + H₂O → H⁺ + HCO₃⁻', enzima: 'anhidrasa carbónica II' }],
      },
    ],
  },
  {
    id: 'medular-interno',
    nombre: 'Colector medular interno',
    corto: 'Colector medular',
    zona: 'medula',
    permeableAgua: 'adh',
    color: '#6366f1',
    resumenSimple: 'Concentra la orina al máximo con ADH; reabsorbe urea y agua.',
    reabsorcion: [
      { sustancia: 'agua', detalle: 'Muy variable (AQP2, según ADH)' },
      { sustancia: 'urea', detalle: 'Aumenta con ADH (UT-A1/UT-A3)' },
    ],
    descripcion:
      'Donde el intersticio es máximamente hipertónico se concentra la orina (hasta ~1200 mOsm/kg). La ADH inserta AQP2 (agua) y aumenta UT-A1/UT-A3 (reabsorción de urea, que recicla y mantiene el gradiente medular). Su disfunción se manifiesta como diabetes insípida nefrogénica o defectos de concentración; el exceso de ADH, como SIADH.',
    celulas: [
      {
        id: 'medular-cell',
        nombre: 'Célula del colector medular',
        descripcion: 'AQP2 apical (ADH) + UT-A1 para urea; salida basolateral por AQP3/AQP4 (agua) y UT-A3 (urea), que recicla y mantiene el gradiente medular.',
        morfologia: 'cilindrica',
        transportadores: ['aqp2-med', 'uta1', 'aqp34', 'uta3'],
      },
    ],
  },
  {
    id: 'yuxtaglomerular',
    nombre: 'Aparato yuxtaglomerular',
    corto: 'Yuxtaglomerular',
    subsegmentos: ['Mácula densa', 'Células yuxtaglomerulares', 'Mesangiales extraglomerulares'],
    zona: 'corteza',
    permeableAgua: 'no',
    color: '#f43f5e',
    resumenSimple: 'Sensor de NaCl y presión: regula la TFG (retroalimentación túbulo-glomerular) y libera renina (RAAS).',
    reabsorcion: [
      { sustancia: 'na', detalle: 'Sensado por la mácula densa (NKCC2)' },
    ],
    descripcion:
      'En el polo vascular del glomérulo. La MÁCULA DENSA (células del final de la TAL) detecta el NaCl luminal por NKCC2: si llega poco NaCl, señaliza a las CÉLULAS YUXTAGLOMERULARES de la arteriola aferente para liberar RENINA (→ angiotensina II → aldosterona) y dilatar la aferente; si llega mucho, contrae la aferente (retroalimentación túbulo-glomerular). Las células mesangiales extraglomerulares transmiten la señal.',
    celulas: [
      {
        id: 'macula-densa',
        nombre: 'Mácula densa',
        descripcion: 'Sensor de NaCl luminal vía NKCC2; ajusta la TFG y la liberación de renina.',
        morfologia: 'cilindrica',
        transportadores: ['nkcc2'],
      },
      {
        id: 'yg-cell',
        nombre: 'Células yuxtaglomerulares',
        descripcion: 'Músculo liso modificado de la arteriola aferente; secretan renina.',
        transportadores: [],
        intracelular: [{ texto: 'Renina → angiotensina I', enzima: 'estímulo: ↓NaCl · ↓presión · β1' }],
      },
      {
        id: 'mesangial-eg',
        nombre: 'Mesangiales extraglomerulares',
        descripcion: 'Transmiten la señal entre la mácula densa y la arteriola aferente.',
        transportadores: [],
      },
    ],
  },
  {
    id: 'vasa-recta',
    nombre: 'Vasa recta',
    corto: 'Vasa recta',
    zona: 'medula',
    permeableAgua: 'si',
    color: '#fb7185',
    resumenSimple: 'Vasos en horquilla que irrigan la médula sin lavar el gradiente (intercambio contracorriente).',
    reabsorcion: [
      { sustancia: 'agua', detalle: 'Intercambio pasivo (AQP1)' },
      { sustancia: 'urea', detalle: 'Recicla en la médula' },
    ],
    descripcion:
      'Capilares largos en horquilla, paralelos al asa de Henle. Funcionan como intercambiador por contracorriente: el agua y los solutos se intercambian entre las ramas descendente y ascendente, irrigando la médula SIN disipar el gradiente hipertónico. El endotelio fenestrado expresa AQP1.',
    celulas: [
      {
        id: 'vr-endotelio',
        nombre: 'Endotelio de vasa recta',
        descripcion: 'Endotelio fenestrado con AQP1; intercambio pasivo de agua y solutos.',
        morfologia: 'plana',
        transportadores: ['aqp1-asa'],
      },
      {
        id: 'vr-pericito',
        nombre: 'Pericitos / intersticiales',
        descripcion: 'Regulan el flujo medular y dan sostén al intersticio.',
        transportadores: [],
      },
    ],
  },
];

export const SEGMENT_BY_ID = Object.fromEntries(SEGMENTS.map((s) => [s.id, s])) as Record<
  string,
  SegmentDef
>;
