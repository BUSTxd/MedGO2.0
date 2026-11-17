// Interior del tronco: núcleos de los pares craneales (por columna funcional),
// otros núcleos y las vías largas, como volúmenes en las mismas coordenadas
// que la superficie (forma.ts). Con ellos se dibujan en 3D, se pintan los
// cortes y se decide qué daña cada lesión clínica.
//
// Cada estructura se escribe del lado IZQUIERDO (x > 0) y se refleja. Las vías
// que se cruzan se escriben como corren por la mitad izquierda del tronco (el
// lemnisco medial izquierdo nace en los núcleos grácil y cuneiforme derechos).
// Posiciones contrastadas con Gray (fig. 696, 698, 701, 704 y 710) y Haines;
// son esquemáticas: la columna y el nivel son fieles, el tamaño no siempre.

import type { Primitiva, Vec } from './sdf.ts';

export type Columna = 'esg' | 'eve' | 'evg' | 'avg' | 'asg' | 'aes';

export const COLUMNAS: Record<Columna, { nombre: string; corto: string; color: string; desc: string }> = {
  esg: { nombre: 'Motor somático', corto: 'Motor somático', color: '#e03131', desc: 'Músculos de origen somítico: ojos (III, IV, VI) y lengua (XII).' },
  eve: { nombre: 'Motor branquial', corto: 'Motor branquial', color: '#f76707', desc: 'Músculos de los arcos faríngeos: masticación (V), mímica (VII), faringe y laringe (IX, X).' },
  evg: { nombre: 'Motor visceral', corto: 'Parasimpático', color: '#d9a400', desc: 'Parasimpático: pupila, glándulas, corazón y vísceras (III, VII, IX, X).' },
  avg: { nombre: 'Sensitivo visceral', corto: 'Sensitivo visceral', color: '#2f9e44', desc: 'Gusto y sensibilidad de las vísceras (núcleo solitario: VII, IX, X).' },
  asg: { nombre: 'Sensitivo somático', corto: 'Sensitivo somático', color: '#1c7ed6', desc: 'Tacto, dolor, temperatura y propiocepción de la cabeza (trigémino).' },
  aes: { nombre: 'Sensitivo especial', corto: 'Sensitivo especial', color: '#c2409a', desc: 'Audición y equilibrio (VIII).' },
};

export type ParId = 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'IX' | 'X' | 'XI' | 'XII';

export type TipoInterior = 'nucleo_par' | 'nucleo' | 'via' | 'fibras';

export interface Interior {
  id: string;
  nombre: string;
  tipo: TipoInterior;
  columna?: Columna;
  /** Pares a los que sirve (núcleos y fibras de un par). */
  pares?: ParId[];
  color: string;
  /** Nivel del tronco donde está. */
  nivel: string;
  funcion: string;
  lesion: string;
  perla?: string;
  /** Volumen del lado izquierdo (x > 0). */
  prims: Primitiva[];
  /** Está en la línea media (no se refleja). */
  impar?: boolean;
  /** Translúcido en 3D (volúmenes grandes que taparían lo demás). */
  velo?: boolean;
}

const elip = (id: string, c: Vec, r: Vec, giro?: Vec): Primitiva => ({ id, tipo: 'elipsoide', c, r, giro });
const tubo = (id: string, pts: Vec[], r: number | number[], extra: Partial<Extract<Primitiva, { tipo: 'tubo' }>> = {}): Primitiva => ({
  id, tipo: 'tubo', pts, r: Array.isArray(r) ? r : pts.map(() => r), ...extra,
});

const lista: Interior[] = [
  // ── Núcleos de los pares craneales ──
  {
    id: 'n_oculomotor', nombre: 'Núcleo del oculomotor', tipo: 'nucleo_par', columna: 'esg', pares: ['III'], color: COLUMNAS.esg.color,
    nivel: 'Mesencéfalo, a la altura del colículo superior, delante del acueducto.',
    funcion: 'Inerva el recto superior, inferior y medial, el oblicuo inferior y el elevador del párpado.',
    lesion: 'Ptosis y ojo «abajo y afuera». El subnúcleo del recto superior inerva el ojo contrario y el del elevador, los dos párpados.',
    perla: 'Una lesión nuclear da ptosis bilateral; una del nervio, solo del mismo lado.',
    prims: [elip('n_oculomotor', [0.1, 3.72, -0.36], [0.085, 0.27, 0.1])],
  },
  {
    id: 'n_edinger', nombre: 'Núcleo de Edinger-Westphal', tipo: 'nucleo_par', columna: 'evg', pares: ['III'], color: COLUMNAS.evg.color,
    nivel: 'Mesencéfalo, dorsomedial al núcleo del III.',
    funcion: 'Parasimpático del III: hace sinapsis en el ganglio ciliar y contrae la pupila (esfínter) y el músculo ciliar (acomodación).',
    lesion: 'Midriasis arreactiva del mismo lado.',
    perla: 'Sus fibras viajan por la periferia del III: una compresión (aneurisma) da midriasis primero; la isquemia del centro (diabetes) respeta la pupila.',
    prims: [elip('n_edinger', [0.05, 3.84, -0.45], [0.04, 0.16, 0.05])],
  },
  {
    id: 'n_troclear', nombre: 'Núcleo del troclear', tipo: 'nucleo_par', columna: 'esg', pares: ['IV'], color: COLUMNAS.esg.color,
    nivel: 'Mesencéfalo, a la altura del colículo inferior.',
    funcion: 'Inerva el oblicuo superior del ojo CONTRARIO: sus fibras se cruzan en el velo medular superior antes de salir.',
    lesion: 'Diplopía vertical al bajar escaleras o leer; la cabeza se inclina hacia el lado sano.',
    perla: 'El IV es el único par que se cruza y el único que sale por detrás.',
    prims: [elip('n_troclear', [0.1, 3.15, -0.38], [0.07, 0.1, 0.07])],
  },
  {
    id: 'n_mesencefalico_v', nombre: 'Núcleo mesencefálico del trigémino', tipo: 'nucleo_par', columna: 'asg', pares: ['V'], color: COLUMNAS.asg.color,
    nivel: 'Del puente alto al mesencéfalo, junto a la sustancia gris periacueductal.',
    funcion: 'Propiocepción de los músculos de la masticación; arco aferente del reflejo maseterino.',
    lesion: 'Altera el reflejo maseterino.',
    perla: 'Es el único lugar del SNC con cuerpos de primeras neuronas sensitivas (como si fuera un ganglio dentro del encéfalo).',
    prims: [tubo('n_mesencefalico_v', [[0.26, 2.2, -0.52], [0.27, 3.0, -0.6], [0.28, 3.9, -0.6]], 0.03)],
  },
  {
    id: 'n_principal_v', nombre: 'Núcleo sensitivo principal del trigémino', tipo: 'nucleo_par', columna: 'asg', pares: ['V'], color: COLUMNAS.asg.color,
    nivel: 'Puente medio, a la altura de la entrada del V.',
    funcion: 'Tacto fino y discriminativo de la cara; proyecta al tálamo (VPM) por el lemnisco trigeminal.',
    lesion: 'Pérdida del tacto fino de la hemicara.',
    prims: [elip('n_principal_v', [0.6, 1.55, -0.28], [0.12, 0.2, 0.12])],
  },
  {
    id: 'n_motor_v', nombre: 'Núcleo motor del trigémino', tipo: 'nucleo_par', columna: 'eve', pares: ['V'], color: COLUMNAS.eve.color,
    nivel: 'Puente medio, medial al núcleo sensitivo principal.',
    funcion: 'Músculos de la masticación (masetero, temporal, pterigoideos), milohioideo, vientre anterior del digástrico, tensores del tímpano y del velo.',
    lesion: 'Al abrir la boca, la mandíbula se desvía hacia el lado lesionado.',
    prims: [elip('n_motor_v', [0.42, 1.52, -0.22], [0.1, 0.18, 0.1])],
  },
  {
    id: 'n_espinal_v', nombre: 'Núcleo y tracto espinal del trigémino', tipo: 'nucleo_par', columna: 'asg', pares: ['V', 'VII', 'IX', 'X'], color: COLUMNAS.asg.color,
    nivel: 'Del puente a la médula cervical alta (C2-C3), en el borde dorsolateral.',
    funcion: 'Dolor y temperatura de la cara (también del oído, que llega por VII, IX y X).',
    lesion: 'Pérdida de dolor y temperatura en la hemicara del MISMO lado (Wallenberg).',
    perla: 'En Wallenberg: cara del mismo lado y cuerpo del lado contrario (el espinotalámico ya viene cruzado).',
    prims: [tubo('n_espinal_v', [[0.66, 1.4, -0.3], [0.68, 0.2, -0.32], [0.6, -1.3, -0.24], [0.5, -3.0, -0.2], [0.46, -4.35, -0.18]], 0.08)],
  },
  {
    id: 'n_abducens', nombre: 'Núcleo del abducens', tipo: 'nucleo_par', columna: 'esg', pares: ['VI'], color: COLUMNAS.esg.color,
    nivel: 'Puente bajo, bajo el colículo facial.',
    funcion: 'Motoneuronas del recto lateral e interneuronas que, por el FLM contrario, activan el recto medial del otro ojo: es el centro de la mirada horizontal.',
    lesion: 'Lesión del núcleo: parálisis de la mirada horizontal hacia ese lado (no solo del recto lateral).',
    perla: 'Nervio = no abduce un ojo; núcleo = ningún ojo mira hacia ese lado.',
    prims: [elip('n_abducens', [0.2, 1.05, -0.42], [0.08, 0.12, 0.07])],
  },
  {
    id: 'n_facial', nombre: 'Núcleo motor del facial', tipo: 'nucleo_par', columna: 'eve', pares: ['VII'], color: COLUMNAS.eve.color,
    nivel: 'Puente bajo, en el tegmento ventrolateral.',
    funcion: 'Músculos de la mímica, estapedio, estilohioideo y vientre posterior del digástrico.',
    lesion: 'Parálisis facial periférica: toda la hemicara del mismo lado (frente incluida).',
    perla: 'La parte del núcleo que mueve la frente recibe corteza de los dos lados: una lesión central respeta la frente.',
    prims: [elip('n_facial', [0.5, 0.78, -0.06], [0.1, 0.26, 0.1])],
  },
  {
    id: 'n_salivatorio_sup', nombre: 'Núcleo salivatorio superior', tipo: 'nucleo_par', columna: 'evg', pares: ['VII'], color: COLUMNAS.evg.color,
    nivel: 'Puente bajo, dorsal al núcleo del facial.',
    funcion: 'Parasimpático del VII (nervio intermedio): glándulas lagrimal, submandibular y sublingual.',
    lesion: 'Ojo y boca secos del mismo lado.',
    prims: [elip('n_salivatorio_sup', [0.36, 0.45, -0.26], [0.05, 0.07, 0.05])],
  },
  {
    id: 'n_vestibulares', nombre: 'Núcleos vestibulares', tipo: 'nucleo_par', columna: 'aes', pares: ['VIII'], color: COLUMNAS.aes.color,
    nivel: 'Bajo el área vestibular del suelo del IV ventrículo, entre puente y bulbo.',
    funcion: 'Equilibrio: conectan con el cerebelo, la médula (vestibuloespinales) y los núcleos oculomotores por el FLM (reflejo vestíbulo-ocular).',
    lesion: 'Vértigo, nistagmo, náuseas y lateropulsión hacia el lado lesionado.',
    prims: [elip('n_vestibulares', [0.62, 0.3, -0.42], [0.2, 0.55, 0.08])],
  },
  {
    id: 'n_cocleares', nombre: 'Núcleos cocleares', tipo: 'nucleo_par', columna: 'aes', pares: ['VIII'], color: COLUMNAS.aes.color,
    nivel: 'Unión bulboprotuberancial, sobre el pedúnculo cerebeloso inferior.',
    funcion: 'Primer relevo de la audición; desde aquí la vía sube por los dos lados.',
    lesion: 'Hipoacusia neurosensorial del mismo lado (la única lesión central que la produce unilateral).',
    prims: [elip('n_cocleares', [0.9, 0.12, -0.55], [0.1, 0.18, 0.1])],
  },
  {
    id: 'n_solitario', nombre: 'Núcleo del tracto solitario', tipo: 'nucleo_par', columna: 'avg', pares: ['VII', 'IX', 'X'], color: COLUMNAS.avg.color,
    nivel: 'Bulbo y puente bajo, dorsolateral.',
    funcion: 'Parte alta (gustativa): gusto de VII, IX y X. Parte baja: sensibilidad visceral (barorreceptores, quimiorreceptores, vísceras).',
    lesion: 'Pérdida del gusto del mismo lado y alteración de reflejos cardiorrespiratorios.',
    prims: [tubo('n_solitario', [[0.4, 0.6, -0.42], [0.34, -0.5, -0.42], [0.2, -1.45, -0.38]], 0.05)],
  },
  {
    id: 'n_dorsal_vago', nombre: 'Núcleo motor dorsal del vago', tipo: 'nucleo_par', columna: 'evg', pares: ['X'], color: COLUMNAS.evg.color,
    nivel: 'Bulbo, bajo el trígono del vago.',
    funcion: 'Parasimpático de corazón, pulmones y tubo digestivo hasta el ángulo esplénico del colon.',
    lesion: 'Alteraciones autonómicas (taquicardia, trastornos de la motilidad).',
    prims: [tubo('n_dorsal_vago', [[0.27, 0.1, -0.44], [0.24, -1.25, -0.4]], 0.05)],
  },
  {
    id: 'n_salivatorio_inf', nombre: 'Núcleo salivatorio inferior', tipo: 'nucleo_par', columna: 'evg', pares: ['IX'], color: COLUMNAS.evg.color,
    nivel: 'Bulbo alto.',
    funcion: 'Parasimpático del IX: glándula parótida (por el ganglio ótico).',
    lesion: 'Disminución de la saliva parotídea del mismo lado.',
    prims: [elip('n_salivatorio_inf', [0.36, 0.12, -0.3], [0.04, 0.06, 0.04])],
  },
  {
    id: 'n_ambiguo', nombre: 'Núcleo ambiguo', tipo: 'nucleo_par', columna: 'eve', pares: ['IX', 'X', 'XI'], color: COLUMNAS.eve.color,
    nivel: 'Bulbo, en la formación reticular ventrolateral.',
    funcion: 'Músculos de la faringe, laringe y paladar blando (IX y sobre todo X): deglución y fonación.',
    lesion: 'Disfagia, disfonía y úvula desviada hacia el lado SANO (Wallenberg).',
    perla: 'Úvula hacia el lado sano; lengua hacia el lado lesionado.',
    prims: [tubo('n_ambiguo', [[0.5, 0.2, -0.04], [0.48, -0.7, 0.0], [0.44, -1.6, 0.0]], 0.04)],
  },
  {
    id: 'n_hipogloso', nombre: 'Núcleo del hipogloso', tipo: 'nucleo_par', columna: 'esg', pares: ['XII'], color: COLUMNAS.esg.color,
    nivel: 'Bulbo, bajo el trígono del hipogloso, junto a la línea media.',
    funcion: 'Músculos intrínsecos y extrínsecos de la lengua (salvo el palatogloso).',
    lesion: 'Al sacarla, la lengua se desvía hacia el lado lesionado, con atrofia y fasciculaciones.',
    prims: [tubo('n_hipogloso', [[0.1, 0.1, -0.42], [0.1, -0.6, -0.42], [0.09, -1.35, -0.36]], 0.06)],
  },
  {
    id: 'n_accesorio', nombre: 'Núcleo espinal del accesorio', tipo: 'nucleo_par', columna: 'eve', pares: ['XI'], color: COLUMNAS.eve.color,
    nivel: 'Médula cervical alta (C1-C5), asta anterior.',
    funcion: 'Esternocleidomastoideo y trapecio.',
    lesion: 'Hombro caído y debilidad para girar la cabeza hacia el lado contrario.',
    perla: 'Su clasificación (somático o branquial) se discute; aquí se pinta como branquial.',
    prims: [tubo('n_accesorio', [[0.34, -2.75, 0.06], [0.36, -4.35, 0.06]], 0.05)],
  },

  // ── Otros núcleos ──
  {
    id: 'nucleo_rojo', nombre: 'Núcleo rojo', tipo: 'nucleo', color: '#c2495e',
    nivel: 'Tegmento del mesencéfalo, a la altura del colículo superior.',
    funcion: 'Recibe el pedúnculo cerebeloso superior (ya cruzado) y la corteza; origen del haz rubroespinal. Coordina el movimiento.',
    lesion: 'Temblor y ataxia del lado contrario (síndromes de Benedikt y Claude, con el III que lo atraviesa).',
    prims: [elip('nucleo_rojo', [0.22, 3.72, -0.02], [0.15, 0.24, 0.15])],
  },
  {
    id: 'sustancia_negra', nombre: 'Sustancia negra', tipo: 'nucleo', color: '#3f3a52',
    nivel: 'Mesencéfalo, entre el pie peduncular y el tegmento.',
    funcion: 'Porción compacta: neuronas dopaminérgicas (con neuromelanina) que proyectan al estriado. Porción reticulada: salida de los ganglios basales.',
    lesion: 'Su degeneración causa la enfermedad de Parkinson.',
    prims: [tubo('sustancia_negra', [[0.26, 2.75, 0.28], [0.5, 3.55, 0.3], [0.76, 4.35, 0.24]], [0.1, 0.13, 0.12], { aplanar: { eje: [0.3, 0, 1], f: 0.32 } })],
  },
  {
    id: 'sgpa', nombre: 'Sustancia gris periacueductal', tipo: 'nucleo', color: '#9aa0ab', impar: true, velo: true,
    nivel: 'Mesencéfalo, rodeando el acueducto.',
    funcion: 'Analgesia descendente (opioides endógenos), conducta defensiva y vocalización.',
    lesion: 'Su estimulación produce analgesia; participa en el síndrome de Parinaud cuando se comprime el techo.',
    prims: [tubo('sgpa', [[0, 2.8, -0.53], [0, 3.6, -0.55], [0, 4.6, -0.45]], [0.17, 0.2, 0.2])],
  },
  {
    id: 'locus_coeruleus_n', nombre: 'Locus coeruleus', tipo: 'nucleo', color: '#4c6ef5',
    nivel: 'Puente alto, bajo el suelo del IV ventrículo.',
    funcion: 'Principal fuente de noradrenalina del encéfalo: vigilia y atención.',
    lesion: 'Se pierde precozmente en Alzheimer y Parkinson.',
    prims: [tubo('locus_coeruleus_n', [[0.32, 1.9, -0.47], [0.33, 2.6, -0.5]], 0.045)],
  },
  {
    id: 'oliva_inferior', nombre: 'Núcleo olivar inferior', tipo: 'nucleo', color: '#c08457',
    nivel: 'Bulbo alto, dentro de la oliva.',
    funcion: 'Origen de las fibras trepadoras: cruzan y llegan al cerebelo contralateral por el pedúnculo inferior (aprendizaje motor).',
    lesion: 'Mioclonías del paladar si se interrumpe el triángulo de Guillain-Mollaret.',
    prims: [elip('oliva_inferior', [0.47, -0.95, 0.22], [0.13, 0.5, 0.15])],
  },
  {
    id: 'nucleos_pontinos', nombre: 'Núcleos pontinos', tipo: 'nucleo', color: '#c9a988', impar: true, velo: true,
    nivel: 'Porción basilar del puente.',
    funcion: 'Reciben la corteza (corticopontinas) y cruzan al cerebelo contralateral por el pedúnculo cerebeloso medio.',
    lesion: 'Ataxia (por desconexión corticocerebelosa).',
    prims: [elip('nucleos_pontinos', [0, 1.22, 0.55], [1.15, 0.9, 0.38])],
  },
  {
    id: 'n_gracil', nombre: 'Núcleo grácil', tipo: 'nucleo', color: '#4dabf7',
    nivel: 'Bulbo cerrado, en el tubérculo grácil.',
    funcion: 'Relevo del tacto fino, la vibración y la propiocepción del miembro inferior: sus axones cruzan y forman el lemnisco medial.',
    lesion: 'Ataxia sensitiva del miembro inferior del mismo lado.',
    prims: [elip('n_gracil', [0.12, -1.65, -0.36], [0.07, 0.3, 0.07])],
  },
  {
    id: 'n_cuneiforme', nombre: 'Núcleo cuneiforme', tipo: 'nucleo', color: '#4dabf7',
    nivel: 'Bulbo cerrado, en el tubérculo cuneiforme.',
    funcion: 'Relevo del tacto fino y la propiocepción del miembro superior hacia el lemnisco medial.',
    lesion: 'Ataxia sensitiva del miembro superior del mismo lado.',
    prims: [elip('n_cuneiforme', [0.34, -1.45, -0.34], [0.09, 0.3, 0.08])],
  },

  // ── Vías largas ──
  {
    id: 'v_corticoespinal', nombre: 'Vía corticoespinal', tipo: 'via', color: '#a61e4d',
    nivel: 'Pie peduncular → base del puente → pirámide → decusación.',
    funcion: 'Movimiento voluntario fino de las extremidades. Se cruza en la decusación de las pirámides.',
    lesion: 'Por encima de la decusación (todo el tronco): hemiparesia CONTRALATERAL con Babinski.',
    perla: 'En los síndromes alternos, la vía larga da el signo contralateral y el par craneal localiza el nivel.',
    prims: [tubo('v_corticoespinal', [
      [0.8, 4.85, 0.46], [0.62, 3.6, 0.5], [0.42, 2.55, 0.48], [0.36, 1.8, 0.5], [0.3, 0.5, 0.52],
      [0.22, -0.7, 0.44], [0.2, -2.2, 0.36], [-0.05, -2.62, 0.22], [-0.32, -2.95, 0.02], [-0.42, -3.6, -0.14], [-0.42, -4.38, -0.14],
    ], [0.085, 0.085, 0.08, 0.08, 0.08, 0.08, 0.08, 0.065, 0.065, 0.065, 0.065])],
  },
  {
    id: 'v_lemnisco_medial', nombre: 'Lemnisco medial', tipo: 'via', color: '#5c7cfa',
    nivel: 'Del bulbo cerrado al tálamo; rota de vertical (bulbo) a horizontal (puente).',
    funcion: 'Tacto fino, vibración y propiocepción del lado CONTRARIO del cuerpo (ya cruzado en el bulbo).',
    lesion: 'Pérdida de la sensibilidad profunda del hemicuerpo contralateral (Dejerine, Benedikt).',
    prims: [tubo('v_lemnisco_medial', [
      [-0.22, -1.7, -0.36], [-0.08, -1.6, -0.08], [0.06, -1.42, 0.12], [0.08, -0.6, 0.18], [0.12, 0.25, 0.08],
      [0.36, 1.2, -0.02], [0.48, 2.5, -0.1], [0.5, 3.45, -0.12], [0.66, 4.85, -0.4],
    ], 0.065, { aplanar: { eje: [1, 0, 0], f: 0.6 } })],
  },
  {
    id: 'v_espinotalamico', nombre: 'Haz espinotalámico (lemnisco espinal)', tipo: 'via', color: '#22b8cf',
    nivel: 'Lateral en todo el tronco, dorsal a la oliva en el bulbo.',
    funcion: 'Dolor y temperatura del lado CONTRARIO del cuerpo (se cruzó ya en la médula).',
    lesion: 'Pérdida de dolor y temperatura del hemicuerpo contralateral (Wallenberg, AICA).',
    prims: [tubo('v_espinotalamico', [
      [0.44, -4.38, 0.05], [0.5, -2.6, 0.02], [0.62, -1.2, -0.02], [0.72, 0.2, -0.14], [0.76, 1.6, -0.2],
      [0.66, 2.8, -0.38], [0.66, 3.6, -0.46], [0.72, 4.85, -0.46],
    ], 0.055)],
  },
  {
    id: 'v_flm', nombre: 'Fascículo longitudinal medial (FLM)', tipo: 'via', color: '#be4bdb',
    nivel: 'Junto a la línea media, bajo el suelo del IV ventrículo y el acueducto.',
    funcion: 'Une los núcleos vestibulares y el del VI con los del III y IV: coordina los movimientos conjugados de los ojos.',
    lesion: 'Oftalmoplejía internuclear: el ojo del lado lesionado no aduce al mirar al otro lado (esclerosis múltiple en jóvenes).',
    perla: 'Uno y medio (one-and-a-half): núcleo del VI + FLM del mismo lado.',
    prims: [tubo('v_flm', [[0.07, -2.4, -0.26], [0.07, -0.6, -0.36], [0.07, 1.0, -0.4], [0.07, 2.6, -0.42], [0.08, 3.9, -0.3]], 0.035)],
  },
  {
    id: 'v_pcs', nombre: 'Vía dentatorrubrotalámica (PCS)', tipo: 'via', color: '#94d82d',
    nivel: 'Pedúnculo cerebeloso superior → decusación en el mesencéfalo bajo → núcleo rojo y tálamo contralaterales.',
    funcion: 'Salida del cerebelo hacia el núcleo rojo y el tálamo (VL) del lado contrario.',
    lesion: 'Antes del cruce: ataxia del mismo lado. Después (núcleo rojo): temblor y ataxia del lado contrario.',
    prims: [tubo('v_pcs', [[0.7, 2.0, -0.78], [0.5, 2.6, -0.5], [0.2, 2.98, -0.24], [-0.1, 3.2, -0.12], [-0.22, 3.72, -0.02], [-0.45, 4.6, -0.3]], 0.05)],
  },
  {
    id: 'v_simpatica', nombre: 'Vía simpática descendente', tipo: 'via', color: '#f783ac',
    nivel: 'Del hipotálamo a la médula, por el tegmento lateral.',
    funcion: 'Control simpático del mismo lado: pupila (dilatador), párpado (músculo de Müller) y sudoración de la cara.',
    lesion: 'Síndrome de Horner del mismo lado: miosis, ptosis leve y anhidrosis.',
    prims: [tubo('v_simpatica', [[0.4, 4.85, 0.1], [0.46, 3.6, -0.22], [0.62, 1.4, -0.14], [0.6, -0.9, -0.08], [0.5, -2.8, -0.04], [0.48, -4.38, -0.04]], 0.032)],
  },

  // ── Fibras de los pares dentro del tronco (para la clínica) ──
  {
    id: 'f_oculomotor', nombre: 'Fibras del III dentro del mesencéfalo', tipo: 'fibras', pares: ['III'], color: '#e8590c',
    nivel: 'Del núcleo del III, atravesando el núcleo rojo, a la fosa interpeduncular.',
    funcion: 'Llevan la motricidad ocular y el parasimpático pupilar hacia la salida del nervio.',
    lesion: 'Paresia del III del mismo lado (Weber, Benedikt, Claude).',
    prims: [tubo('f_oculomotor', [[0.1, 3.68, -0.3], [0.17, 3.55, -0.05], [0.2, 3.38, 0.2], [0.22, 3.25, 0.42]], 0.035)],
  },
  {
    id: 'f_abducens', nombre: 'Fibras del VI dentro del puente', tipo: 'fibras', pares: ['VI'], color: '#1c7ed6',
    nivel: 'Del núcleo del VI, hacia delante, al surco bulboprotuberancial.',
    funcion: 'Motricidad del recto lateral.',
    lesion: 'El ojo no abduce (Millard-Gubler).',
    prims: [tubo('f_abducens', [[0.2, 1.0, -0.38], [0.23, 0.6, -0.05], [0.25, 0.25, 0.3], [0.25, 0.04, 0.55]], 0.03)],
  },
  {
    id: 'f_facial', nombre: 'Fibras del VII (rodilla interna)', tipo: 'fibras', pares: ['VII'], color: '#d6336c',
    nivel: 'Del núcleo del facial suben y rodean el núcleo del VI antes de salir.',
    funcion: 'Motricidad facial.',
    lesion: 'Parálisis facial periférica del mismo lado (Millard-Gubler, Foville).',
    prims: [tubo('f_facial', [[0.5, 0.86, -0.08], [0.32, 0.9, -0.36], [0.2, 1.16, -0.5], [0.3, 1.06, -0.42], [0.62, 0.55, -0.12], [0.9, 0.2, 0.02]], 0.03)],
  },
  {
    id: 'f_hipogloso', nombre: 'Fibras del XII dentro del bulbo', tipo: 'fibras', pares: ['XII'], color: '#1098ad',
    nivel: 'Del núcleo del XII, hacia delante, entre el lemnisco medial y la oliva, al surco preolivar.',
    funcion: 'Motricidad de la lengua.',
    lesion: 'Lengua desviada hacia el lado lesionado (Dejerine).',
    prims: [tubo('f_hipogloso', [[0.1, -0.6, -0.36], [0.2, -0.75, 0.0], [0.3, -0.9, 0.3], [0.36, -0.95, 0.45]], 0.03)],
  },
];

export const INTERIOR: Record<string, Interior> = Object.fromEntries(lista.map((x) => [x.id, x]));
export const INTERIOR_LIST = lista;

/** Grupos de la lista de la vista «Núcleos y vías». */
export const GRUPOS_INTERIOR: Array<{ id: string; nombre: string; filtro: (x: Interior) => boolean }> = [
  { id: 'pares', nombre: 'Núcleos de los pares craneales', filtro: (x) => x.tipo === 'nucleo_par' },
  { id: 'otros', nombre: 'Otros núcleos', filtro: (x) => x.tipo === 'nucleo' },
  { id: 'vias', nombre: 'Vías largas', filtro: (x) => x.tipo === 'via' },
];
