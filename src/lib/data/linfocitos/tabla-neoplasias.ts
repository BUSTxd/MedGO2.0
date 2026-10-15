// Tabla de neoplasias linfoides por célula de origen (panel «Neoplasias»).
// Guion §Parte 5. `paso` apunta al paso de la parte 5 donde se anima.

import type { Neoplasia } from './tipos';

export const NEOPLASIAS: Neoplasia[] = [
  { nombre: 'Leucemia/linfoma linfoblástico B', origen: 'Pro-B / pre-B (médula ósea)', parte: 'linfocito-b', inmunofenotipo: 'TdT+ CD34+ CD10+ CD19+', genetica: 'Hiperdiploidía, t(12;21) ETV6-RUNX1, t(9;22) BCR-ABL1', clinica: 'Niños; fallo medular, dolor óseo', paso: 'neo-1' },
  { nombre: 'Leucemia/linfoma linfoblástico T', origen: 'Timocito', parte: 'timo', inmunofenotipo: 'TdT+ CD3 citoplasmático, CD1a±', genetica: 'NOTCH1 activado (>50 %)', clinica: 'Varón adolescente, masa mediastínica', paso: 'neo-2' },
  { nombre: 'Linfoma de células del manto', origen: 'B naive de la zona del manto', parte: 'centro-germinal', inmunofenotipo: 'CD5+ CD23− ciclina D1+ SOX11+', genetica: 't(11;14) CCND1-IGH', clinica: 'Varón mayor, adenopatías, médula, tubo digestivo', paso: 'neo-4' },
  { nombre: 'Linfoma folicular', origen: 'Centrocito', parte: 'centro-germinal', inmunofenotipo: 'CD10+ BCL6+ BCL2+', genetica: 't(14;18) IGH-BCL2', clinica: 'Indolente; puede transformarse en LDCGB', paso: 'neo-5' },
  { nombre: 'Linfoma de Burkitt', origen: 'Centroblasto', parte: 'centro-germinal', inmunofenotipo: 'CD10+ BCL6+ BCL2− Ki-67 ≈100 %', genetica: 't(8;14) MYC-IGH (o 2;8, 8;22)', clinica: 'Cielo estrellado; endémico (VEB, mandíbula), esporádico (abdomen), VIH', paso: 'neo-6' },
  { nombre: 'Linfoma difuso de células B grandes', origen: 'Centro germinal o B activado', parte: 'centro-germinal', inmunofenotipo: 'CD20+; CG: CD10/BCL6; ABC: MUM1', genetica: 'BCL6 (3q27), hipermutación aberrante; ABC: MYD88 L265P, CD79B', clinica: 'El LNH más frecuente del adulto; masa de crecimiento rápido', paso: 'neo-6' },
  { nombre: 'Linfoma de Hodgkin clásico', origen: 'B del centro germinal con BCR inutilizado', parte: 'centro-germinal', inmunofenotipo: 'CD30+ CD15+ CD45− PAX5 débil', genetica: 'NF-κB y JAK/STAT activados; 9p24.1; VEB en ≈40 %', clinica: 'Adultos jóvenes, adenopatía cervical, síntomas B', paso: 'neo-7' },
  { nombre: 'Linfoma de zona marginal (MALT)', origen: 'B de zona marginal (posgerminal)', parte: 'centro-germinal', inmunofenotipo: 'CD20+ CD5− CD10−', genetica: 't(11;18) API2-MALT1', clinica: 'H. pylori, Sjögren, Hashimoto', paso: 'neo-8' },
  { nombre: 'Leucemia linfocítica crónica / linfoma linfocítico', origen: 'B maduro CD5+ (naive o memoria)', parte: 'centro-germinal', inmunofenotipo: 'CD5+ CD23+ CD20 débil', genetica: 'del(13q14) (miR-15/16); del(17p) TP53, de mal pronóstico', clinica: 'La leucemia más frecuente del adulto mayor; células en mancha', paso: 'neo-8' },
  { nombre: 'Mieloma múltiple', origen: 'Célula plasmática', parte: 'centro-germinal', inmunofenotipo: 'CD138+ CD38++ CD20− CD56+', genetica: 't(11;14), t(4;14) FGFR3/NSD2, del(17p)', clinica: 'CRAB: hipercalcemia, insuficiencia renal, anemia, lesiones líticas; pico M', paso: 'neo-8' },
  { nombre: 'Micosis fungoide / síndrome de Sézary', origen: 'T CD4 cutáneo', parte: 'timo', inmunofenotipo: 'CD4+ CD7−', genetica: 'Compleja', clinica: 'Placas cutáneas, eritrodermia, células de Sézary', paso: 'neo-9' },
  { nombre: 'Leucemia/linfoma T del adulto', origen: 'T CD4 periférico', parte: 'timo', inmunofenotipo: 'CD4+ CD25+', genetica: 'HTLV-1 (Tax activa NF-κB)', clinica: 'Endémico en el sur de Japón, el Caribe y el Perú; hipercalcemia, lesiones cutáneas', paso: 'neo-9' },
  { nombre: 'Linfoma anaplásico de células grandes', origen: 'T periférico', parte: 'timo', inmunofenotipo: 'CD30+ ALK±', genetica: 't(2;5) NPM-ALK', clinica: 'Niños y jóvenes (ALK+, mejor pronóstico)', paso: 'neo-9' },
  { nombre: 'Linfoma NK/T extranodal tipo nasal', origen: 'Célula NK (o T citotóxico)', parte: 'medula', inmunofenotipo: 'CD56+ CD3 citoplasmático+', genetica: 'VEB positivo', clinica: 'Destructivo de la línea media facial; Asia y Latinoamérica', paso: 'neo-9' },
];
