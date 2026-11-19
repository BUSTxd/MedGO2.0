// Abdomen 3D: piezas que no salen tal cual de Z-Anatomy (las «op:» de piezas.mjs).
// Cada operación recibe `ctx` (fuente, una) y devuelve una malla en metros.
// Coordenadas del atlas: +X izquierda del cuerpo, +Y arriba, +Z anterior.

import * as G from './geometria.mjs';
import { MODELADOS, codoBiliar } from './modelados.mjs';

/** Vértices de `m` a menos de `r` de alguno de los puntos. */
const cerca = (m, puntos, r) => {
  const out = [];
  for (let i = 0; i < m.v.length / 3; i++) { const p = G.vert(m, i); if (puntos.some((q) => G.dist(p, q) < r)) out.push(i); }
  return out;
};

/**
 * Fracción de recorrido (0 en `inicio`, 1 en el vértice más lejano) a lo largo de
 * un tubo, por distancia geodésica sobre su superficie.
 */
function recorrido(m, inicio, r = 0.008) {
  const D = G.geodesica(m, cerca(m, inicio, r));
  let max = 0;
  for (const d of D) if (d < Infinity && d > max) max = d;
  return { D, max };
}

/** Parte un tubo por tramos de su recorrido: `cortes` = [[fracción hasta, nombre], …]. */
function tramos(m, inicio, cortes) {
  const { D, max } = recorrido(m, inicio);
  return G.partir(m, (t) => {
    const s = Math.min(D[m.f[t * 3]], D[m.f[t * 3 + 1]], D[m.f[t * 3 + 2]]) / max;
    return cortes.find(([hasta]) => s <= hasta)?.[1] ?? cortes.at(-1)[1];
  });
}

// ─── Intestino delgado ───────────────────────────────────────────────────────
// Z-Anatomy lo trae en una sola malla de 1,68 m desde el ángulo duodenoyeyunal
// hasta la válvula ileocecal. Medido el recorrido por geodésica (es monótono a lo
// largo de las asas, sin atajos entre ellas), los 2/5 proximales son yeyuno y los
// 3/5 distales, íleon: el yeyuno queda arriba y a la izquierda, el íleon abajo y a
// la derecha, como se describe.
const ANGULO_DUODENOYEYUNAL = [0.0218, 1.0852, 0.0388];
const intestino = (c) => c.una('intestino', () => tramos(c.fuente('Jejunum'), [ANGULO_DUODENOYEYUNAL], [[0.4, 'yeyuno'], [1, 'ileon']]));

// ─── Duodeno ─────────────────────────────────────────────────────────────────
// Recorrido desde el píloro (sus dos bordes abiertos). Medido el eje: la flexura
// superior cae al 25 %, la inferior al 62 % y el giro hacia arriba, a la izquierda
// de la aorta, al 79 %.
const PILORO = [[-0.0234, 1.1317, 0.0526], [-0.0138, 1.1311, 0.0442]];
const duodeno = (c) => c.una('duodeno', () => tramos(c.fuente('Duodenum'), PILORO, [[0.25, 1], [0.62, 2], [0.79, 3], [1, 4]]));

// ─── Páncreas ────────────────────────────────────────────────────────────────
// Se parte respecto de la vena mesentérica superior (medida su posición a cada
// altura): la cabeza a su derecha, el cuello delante de ella, el cuerpo a su
// izquierda hasta x = 5 cm y la cola desde ahí hasta el bazo. El proceso uncinado
// es lo de la cabeza que pasa por detrás de la vena por debajo de la escotadura
// pancreática (y < 1,103 m).
const EJE_VMS = [[1.08, -0.0124], [1.09, -0.0118], [1.11, -0.0046], [1.12, -0.0012], [1.13, -0.0006], [1.14, -0.003], [1.16, -0.004]];
const xVMS = (y) => {
  if (y <= EJE_VMS[0][0]) return EJE_VMS[0][1];
  for (let k = 1; k < EJE_VMS.length; k++) if (y <= EJE_VMS[k][0]) { const [y0, x0] = EJE_VMS[k - 1], [y1, x1] = EJE_VMS[k]; return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0); }
  return EJE_VMS.at(-1)[1];
};
const pancreas = (c) => c.una('pancreas', () => G.partir(c.fuente('Pancreas'), (_, p) => {
  const xs = xVMS(p[1]);
  if (p[1] < 1.103 && p[0] > -0.024) return 'uncinado';
  if (p[0] < xs - 0.01) return 'cabeza';
  if (p[0] < xs + 0.012) return 'cuello';
  if (p[0] < 0.05) return 'cuerpo';
  return 'cola';
}));

// ─── Segmento IV: IVa arriba, IVb (lóbulo cuadrado) abajo ────────────────────
// El plano transversal del hilio (a la altura de la bifurcación de la porta)
// separa el IVa del IVb; el IVb es el lóbulo cuadrado de la cara visceral, entre la
// fosa de la vesícula y la fisura del ligamento redondo.
const Y_HILIO = 1.178;
const segmentoIV = (c) => c.una('IV', () => G.partir(c.fuente('Left_medial_segment_of_liver_(IV)'), (_, p) => (p[1] < Y_HILIO ? 'IVb' : 'IVa')));

// ─── Vía biliar ──────────────────────────────────────────────────────────────
// El tubo de Z-Anatomy sale del cuello de la vesícula, sube hasta un codo y baja
// por detrás del duodeno y del páncreas hasta la 2.ª porción. El codo (su punto
// más alto) es donde se uniría el hepático común: antes es cístico, después colédoco.
const CUELLO_VESICULA = [-0.0302, 1.1574, 0.0392];
const biliar = (c) => c.una('biliar', () => {
  const m = c.fuente('Bile_duct');
  const { D } = recorrido(m, [CUELLO_VESICULA], 0.004);
  const dc = D[G.masCercano(m, codoBiliar(c)).i];
  return G.partir(m, (t) => (Math.max(D[m.f[t * 3]], D[m.f[t * 3 + 1]], D[m.f[t * 3 + 2]]) <= dc ? 'cistico' : 'coledoco'));
});

/** Solo la porción abdominal: se corta en el hiato esofágico del diafragma. */
const Y_HIATO = 1.235;

export const OPERACIONES = {
  'segmento-IVa': (c) => segmentoIV(c).IVa,
  'lobulo-cuadrado': (c) => segmentoIV(c).IVb,
  'pancreas-cabeza': (c) => pancreas(c).cabeza,
  'pancreas-uncinado': (c) => pancreas(c).uncinado,
  'pancreas-cuello': (c) => pancreas(c).cuello,
  'pancreas-cuerpo': (c) => pancreas(c).cuerpo,
  'pancreas-cola': (c) => pancreas(c).cola,
  'duodeno-1': (c) => duodeno(c)[1],
  'duodeno-2': (c) => duodeno(c)[2],
  'duodeno-3': (c) => duodeno(c)[3],
  'duodeno-4': (c) => duodeno(c)[4],
  yeyuno: (c) => intestino(c).yeyuno,
  ileon: (c) => intestino(c).ileon,
  esofago: (c) => G.partir(c.fuente('Oesophagus'), (_, p) => (p[1] < Y_HIATO ? 'si' : null)).si,
  cistico: (c) => biliar(c).cistico,
  coledoco: (c) => biliar(c).coledoco,
  'ureter-derecho': (c) => c.fuente('Ureterr'),
  'ureter-izquierdo': (c) => c.fuente('Ureterl'),
  cava: (c) => G.unir(c.fuente('Inferior_vena_cava_(abdominal_part)'), c.fuente('Inferior_vena_cava_(thoracic_part)')),
  ...MODELADOS,
};
