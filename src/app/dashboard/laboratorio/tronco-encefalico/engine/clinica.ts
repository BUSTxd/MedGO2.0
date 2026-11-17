// Síndromes del tronco del encéfalo: dónde está la lesión (un volumen en las
// coordenadas del modelo, del lado IZQUIERDO salvo los de línea media) y qué
// estructura explica cada signo.
//
// Regla de los síndromes alternos: el par craneal da el signo del MISMO lado y
// localiza el nivel; la vía larga da el signo del lado CONTRARIO.
// `npm run verificar:tronco` comprueba que cada estructura nombrada cae dentro
// de su lesión y avisa de las que la lesión toca sin estar en la lista.

import type { Primitiva } from './sdf.ts';

export type Lado = 'ipsi' | 'contra' | 'bilateral';

export interface Signo {
  /** Estructura (interior.ts o anatomia.ts) que lo explica. */
  id: string;
  signo: string;
  lado: Lado;
  /**
   * Qué copia de la estructura daña la lesión (izquierda por defecto). Las
   * fibras dentatorrubrales que pasan por el núcleo rojo izquierdo vienen del
   * cerebelo DERECHO: son la copia derecha de la vía.
   */
  copia?: 'i' | 'd';
}

export interface Sindrome {
  id: string;
  nombre: string;
  /** Nombre corto para la lista. */
  corto: string;
  nivel: 'Mesencéfalo' | 'Protuberancia' | 'Bulbo';
  /** Desde dónde se ve mejor la lesión. */
  vista: 'anterior' | 'lateral' | 'posterior';
  arteria: string;
  resumen: string;
  lesion: Primitiva[];
  /** Lesión de línea media (no tiene lado). */
  medial?: boolean;
  signos: Signo[];
  respeta: string;
  perla: string;
}

const elip = (c: [number, number, number], r: [number, number, number]): Primitiva => ({ id: 'lesion', tipo: 'elipsoide', c, r });

export const SINDROMES: Sindrome[] = [
  {
    id: 'weber', nombre: 'Síndrome de Weber', corto: 'Weber', nivel: 'Mesencéfalo', vista: 'anterior',
    arteria: 'Ramas paramedianas de la cerebral posterior (P1) o de la punta de la basilar.',
    resumen: 'Lesión de la base del mesencéfalo: pie peduncular con las fibras del III que lo cruzan.',
    lesion: [elip([0.36, 3.35, 0.36], [0.24, 0.36, 0.22])],
    signos: [
      { id: 'f_oculomotor', signo: 'Ptosis, ojo abajo y afuera, midriasis', lado: 'ipsi' },
      { id: 'v_corticoespinal', signo: 'Hemiparesia con Babinski', lado: 'contra' },
      { id: 'pedunculo_cerebral', signo: 'Parálisis facial central y de la lengua (corticonuclear)', lado: 'contra' },
    ],
    respeta: 'La sensibilidad: el lemnisco medial y el espinotalámico van por detrás, en el tegmento.',
    perla: 'III del mismo lado + hemiplejía del otro = Weber.',
  },
  {
    id: 'benedikt', nombre: 'Síndrome de Benedikt', corto: 'Benedikt', nivel: 'Mesencéfalo', vista: 'lateral',
    arteria: 'Ramas paramedianas de la cerebral posterior hacia el tegmento.',
    resumen: 'Lesión del tegmento del mesencéfalo: núcleo rojo, fibras del III y lemnisco medial.',
    lesion: [elip([0.3, 3.58, -0.02], [0.3, 0.36, 0.26])],
    signos: [
      { id: 'f_oculomotor', signo: 'Paresia del III', lado: 'ipsi' },
      { id: 'nucleo_rojo', signo: 'Temblor, ataxia y movimientos involuntarios', lado: 'contra' },
      { id: 'v_lemnisco_medial', signo: 'Pérdida del tacto fino y la propiocepción', lado: 'contra' },
    ],
    respeta: 'La fuerza, si la lesión no alcanza el pie peduncular (si lo alcanza, se suma hemiparesia).',
    perla: 'Benedikt = Weber «movido hacia atrás»: temblor en lugar de (o además de) hemiplejía.',
  },
  {
    id: 'claude', nombre: 'Síndrome de Claude', corto: 'Claude', nivel: 'Mesencéfalo', vista: 'lateral',
    arteria: 'Ramas paramedianas de la cerebral posterior (tegmento dorsomedial).',
    resumen: 'Lesión dorsal del tegmento: fibras del III y salida cruzada del cerebelo hacia el núcleo rojo.',
    lesion: [elip([0.16, 3.42, -0.14], [0.2, 0.32, 0.2])],
    signos: [
      { id: 'f_oculomotor', signo: 'Paresia del III', lado: 'ipsi' },
      { id: 'v_pcs', signo: 'Ataxia cerebelosa (fibras ya cruzadas)', lado: 'contra', copia: 'd' },
      { id: 'nucleo_rojo', signo: 'Temblor', lado: 'contra' },
    ],
    respeta: 'La fuerza y la sensibilidad, más ventrales y laterales.',
    perla: 'Claude = III + ataxia contralateral, sin hemiparesia.',
  },
  {
    id: 'parinaud', nombre: 'Síndrome de Parinaud (mesencefálico dorsal)', corto: 'Parinaud', nivel: 'Mesencéfalo', vista: 'posterior', medial: true,
    arteria: 'Suele ser compresivo: tumor de la región pineal o hidrocefalia; también infartos paramedianos altos.',
    resumen: 'Lesión del techo del mesencéfalo: región pretectal, comisura posterior y colículos superiores.',
    lesion: [elip([0, 3.86, -0.78], [0.5, 0.34, 0.28])],
    signos: [
      { id: 'coliculo_superior', signo: 'Parálisis de la mirada vertical, sobre todo hacia arriba', lado: 'bilateral' },
      { id: 'pineal', signo: 'Causa habitual: tumor de la pineal que comprime el techo', lado: 'bilateral' },
      { id: 'sgpa', signo: 'Pupilas con disociación luz-cerca; nistagmo de convergencia-retracción; retracción palpebral (Collier)', lado: 'bilateral' },
    ],
    respeta: 'La fuerza, la sensibilidad y la mirada horizontal.',
    perla: 'Mira hacia arriba, no puede; luz no, acomodación sí.',
  },
  {
    id: 'millard', nombre: 'Síndrome de Millard-Gubler', corto: 'Millard-Gubler', nivel: 'Protuberancia', vista: 'anterior',
    arteria: 'Ramas paramedianas de la basilar (puente caudal).',
    resumen: 'Lesión ventral del puente bajo: fibras del VI y del VII y vía corticoespinal.',
    lesion: [elip([0.46, 0.4, 0.2], [0.4, 0.36, 0.36])],
    signos: [
      { id: 'f_abducens', signo: 'El ojo no abduce (estrabismo convergente)', lado: 'ipsi' },
      { id: 'f_facial', signo: 'Parálisis facial periférica (frente incluida)', lado: 'ipsi' },
      { id: 'v_corticoespinal', signo: 'Hemiparesia', lado: 'contra' },
    ],
    respeta: 'La mirada conjugada (el núcleo del VI está más dorsal) y la sensibilidad.',
    perla: 'VI + VII del mismo lado + hemiplejía del otro = Millard-Gubler.',
  },
  {
    id: 'foville', nombre: 'Síndrome de Foville', corto: 'Foville', nivel: 'Protuberancia', vista: 'lateral',
    arteria: 'Ramas paramedianas y circunferenciales cortas de la basilar.',
    resumen: 'Lesión del puente bajo que incluye el NÚCLEO del VI (centro de la mirada horizontal), la rodilla del VII y, más ventral, la vía corticoespinal.',
    lesion: [elip([0.22, 0.85, -0.02], [0.24, 0.38, 0.58])],
    signos: [
      { id: 'n_abducens', signo: 'Parálisis de la mirada horizontal hacia el lado de la lesión', lado: 'ipsi' },
      { id: 'f_facial', signo: 'Parálisis facial periférica', lado: 'ipsi' },
      { id: 'v_corticoespinal', signo: 'Hemiparesia', lado: 'contra' },
    ],
    respeta: 'La mirada vertical (centros mesencefálicos).',
    perla: 'Núcleo del VI = ningún ojo mira hacia ese lado; nervio del VI = solo no abduce un ojo.',
  },
  {
    id: 'enclaustramiento', nombre: 'Síndrome de enclaustramiento (locked-in)', corto: 'Enclaustramiento', nivel: 'Protuberancia', vista: 'anterior', medial: true,
    arteria: 'Trombosis de la arteria basilar.',
    resumen: 'Infarto bilateral de la base del puente: vías corticoespinales y corticonucleares de los dos lados.',
    lesion: [elip([0, 1.2, 0.58], [0.95, 0.72, 0.34])],
    signos: [
      { id: 'v_corticoespinal', signo: 'Tetraplejía', lado: 'bilateral' },
      { id: 'nucleos_pontinos', signo: 'Anartria y disfagia (corticonucleares)', lado: 'bilateral' },
    ],
    respeta: 'La conciencia (formación reticular del tegmento), los movimientos verticales de los ojos y el parpadeo (mesencéfalo).',
    perla: 'Despierto, consciente y sin poder moverse: se comunica con los ojos (arriba y abajo).',
  },
  {
    id: 'aica', nombre: 'Síndrome pontino lateral inferior (AICA)', corto: 'AICA', nivel: 'Protuberancia', vista: 'lateral',
    arteria: 'Arteria cerebelosa anteroinferior (AICA).',
    resumen: 'Lesión lateral del puente bajo: núcleos del VII y VIII, trigémino espinal, espinotalámico, vía simpática y pedúnculo medio.',
    lesion: [elip([0.8, 0.32, -0.22], [0.3, 0.42, 0.36])],
    signos: [
      { id: 'n_facial', signo: 'Parálisis facial periférica', lado: 'ipsi' },
      { id: 'n_cocleares', signo: 'Hipoacusia y acúfenos', lado: 'ipsi' },
      { id: 'n_vestibulares', signo: 'Vértigo, náuseas y nistagmo', lado: 'ipsi' },
      { id: 'n_espinal_v', signo: 'Pérdida de dolor y temperatura en la cara', lado: 'ipsi' },
      { id: 'v_espinotalamico', signo: 'Pérdida de dolor y temperatura en el cuerpo', lado: 'contra' },
      { id: 'v_simpatica', signo: 'Síndrome de Horner', lado: 'ipsi' },
      { id: 'pcm', signo: 'Ataxia', lado: 'ipsi' },
    ],
    respeta: 'La fuerza y la deglución (núcleo ambiguo, más abajo).',
    perla: 'Se parece a Wallenberg, pero con facial e hipoacusia y sin disfagia.',
  },
  {
    id: 'wallenberg', nombre: 'Síndrome de Wallenberg (bulbar lateral)', corto: 'Wallenberg', nivel: 'Bulbo', vista: 'lateral',
    arteria: 'Arteria vertebral (lo más frecuente) o cerebelosa posteroinferior (PICA).',
    resumen: 'Lesión lateral del bulbo: trigémino espinal, espinotalámico, núcleo ambiguo, núcleos vestibulares, vía simpática y pedúnculo inferior.',
    lesion: [elip([0.56, -0.6, -0.2], [0.3, 0.62, 0.36])],
    signos: [
      { id: 'n_espinal_v', signo: 'Pérdida de dolor y temperatura en la cara', lado: 'ipsi' },
      { id: 'v_espinotalamico', signo: 'Pérdida de dolor y temperatura en el cuerpo', lado: 'contra' },
      { id: 'n_ambiguo', signo: 'Disfagia, disfonía, úvula hacia el lado sano', lado: 'ipsi' },
      { id: 'n_vestibulares', signo: 'Vértigo, náuseas y nistagmo', lado: 'ipsi' },
      { id: 'v_simpatica', signo: 'Síndrome de Horner', lado: 'ipsi' },
      { id: 'pci', signo: 'Ataxia', lado: 'ipsi' },
      { id: 'n_solitario', signo: 'Alteración del gusto e hipo', lado: 'ipsi' },
    ],
    respeta: 'La fuerza (pirámide), el tacto fino (lemnisco medial) y la lengua (XII): todo eso está en el bulbo medial.',
    perla: 'Cara de un lado, cuerpo del otro, sin debilidad: piensa en Wallenberg.',
  },
  {
    id: 'dejerine', nombre: 'Síndrome bulbar medial (Dejerine)', corto: 'Dejerine', nivel: 'Bulbo', vista: 'anterior',
    arteria: 'Arteria espinal anterior o ramas paramedianas de la vertebral.',
    resumen: 'Lesión medial del bulbo: pirámide, lemnisco medial y fibras del XII.',
    lesion: [elip([0.18, -0.9, 0.14], [0.17, 0.55, 0.38])],
    signos: [
      { id: 'f_hipogloso', signo: 'Lengua desviada hacia el lado de la lesión, con atrofia', lado: 'ipsi' },
      { id: 'v_corticoespinal', signo: 'Hemiparesia que respeta la cara', lado: 'contra' },
      { id: 'v_lemnisco_medial', signo: 'Pérdida del tacto fino y la propiocepción', lado: 'contra' },
    ],
    respeta: 'El dolor y la temperatura (espinotalámico lateral) y la cara (trigémino espinal, lateral).',
    perla: 'La lengua apunta a la lesión; el cuerpo débil está del otro lado.',
  },
];

export const SINDROME: Record<string, Sindrome> = Object.fromEntries(SINDROMES.map((s) => [s.id, s]));

export const LADO_TEXTO: Record<Lado, string> = {
  ipsi: 'mismo lado',
  contra: 'lado contrario',
  bilateral: 'bilateral',
};
