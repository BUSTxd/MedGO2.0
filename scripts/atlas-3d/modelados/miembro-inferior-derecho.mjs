// Estructuras modeladas del miembro inferior derecho (las lee modelar.mjs).
// Los vasos de Open3DModel empiezan en la femoral: aquí van los de la pelvis
// (ilíacos común, externo e interno, glúteos, pudendos internos y obturadores),
// arteria y vena, empalmados a la femoral de Open3DModel.
//
// Referencias medidas en el modelo (metros; +X izquierda, +Z delante):
// - Arteria femoral: empieza en (-0,0507, 0,8627, 0,0432), radio 3,7 mm; la vena
//   justo por dentro, (-0,0440, 0,8597, 0,0436), radio 3,9 mm.
// - Borde medial del psoas: y 0,99 (-0,021, z 0,002) · 0,96 (-0,045, -0,001) ·
//   0,93 (-0,053, 0,008) · 0,90 (-0,057, 0,020) · 0,87 (-0,054, 0,028).
// - Frente del cuerpo de L4 a y 1,00: z 0,014 (bifurcación aórtica); de L5 a y 0,985: z 0,012.
// - Articulación sacroilíaca (lig. anterior): (-0,030, 0,947, -0,018).
// - Nervio glúteo superior: sale por encima del piriforme (y 0,911 a x -0,055/-0,065).
// - Nervio glúteo inferior: (-0,064, 0,891, -0,042), bajo el piriforme, hacia el glúteo mayor.
// - Nervio pudendo: (-0,044, 0,875, -0,056) → espina ciática (-0,050, 0,855, -0,057)
//   → conducto pudendo (-0,040, 0,825, -0,038) → periné.
// - Nervio obturador: (-0,050, 0,879, 0,009) → conducto obturador (-0,045, 0,855, 0,016).
// Cada vaso va junto a su nervio, a unos milímetros; las venas, junto a su arteria.

const P = (x, y, z) => [x, y, z];

// Las glúteas entran en los glúteos: su último tramo puede ir dentro del músculo.
const GLUTEOS = ['Gluteus maximus muscle', 'Gluteus medius muscle', 'Gluteus minimus muscle'];
// Los obturadores salen del conducto entre los dos obturadores y se reparten por el externo.
const OBTURADORES = ['Obturator externus', 'Obturator internus'];

// Arterias
const BIF_A = P(-0.033, 0.955, 0.004); // bifurcación de la ilíaca común, delante de la sacroilíaca
const DIV_POST = P(-0.035, 0.925, -0.014); // ilíaca interna: división posterior (glútea superior)
const DIV_ANT = P(-0.036, 0.905, -0.020); // división anterior (glútea inferior, pudenda, obturatriz)
const SGA_RAMAS = P(-0.075, 0.921, -0.039); // la glútea superior se abre en superficial y profunda
// Venas: por detrás y por dentro de su arteria
const BIF_V = P(-0.037, 0.948, -0.008);
const IIV_DIV = P(-0.030, 0.920, -0.026);
const IIV_ANT = P(-0.031, 0.905, -0.030);

export const ESTRUCTURAS = [
  // ── Arterias ──
  {
    en: 'Common iliac artery', // de la bifurcación aórtica (delante de L4) a delante de la sacroilíaca
    radio: 0.0045,
    ramas: [[P(0.006, 1.000, 0.024), P(-0.006, 0.988, 0.023), P(-0.019, 0.972, 0.016), BIF_A]],
  },
  {
    en: 'External iliac artery', // por el borde medial del psoas hasta la femoral
    radio: 0.0042,
    radioFinal: 0.0037,
    ramas: [[BIF_A, P(-0.044, 0.936, 0.011), P(-0.050, 0.912, 0.022), P(-0.051, 0.890, 0.032), P(-0.050, 0.874, 0.040), P(-0.0507, 0.8627, 0.0432)]],
    uniones: [[0, 'inicio', 'Common iliac artery'], [0, 'fin', 'Femoral artery']],
  },
  {
    en: 'Internal iliac artery', // baja a la pelvis por delante de la sacroilíaca hasta el borde de la escotadura ciática
    radio: 0.0035,
    radioFinal: 0.003,
    ramas: [[BIF_A, P(-0.033, 0.940, -0.006), DIV_POST, DIV_ANT]],
    uniones: [[0, 'inicio', 'Common iliac artery']],
  },
  {
    en: 'Superior gluteal artery', // división posterior: con el nervio glúteo superior, por encima del piriforme
    radio: 0.0022,
    radioRamas: 0.0015,
    destino: GLUTEOS,
    libreFinal: 0.045, // la rama profunda corre entre glúteo medio y menor: una interfaz de pocos milímetros
    ramas: [
      // tronco y rama profunda (entre glúteo medio y menor)
      [DIV_POST, P(-0.045, 0.927, -0.020), P(-0.055, 0.916, -0.026), P(-0.065, 0.916, -0.034), SGA_RAMAS, P(-0.085, 0.928, -0.038), P(-0.100, 0.940, -0.032), P(-0.115, 0.950, -0.028)],
      // rama superficial (al glúteo mayor)
      [SGA_RAMAS, P(-0.080, 0.926, -0.050), P(-0.085, 0.935, -0.062)],
    ],
    uniones: [[0, 'inicio', 'Internal iliac artery'], [1, 'inicio', 'Superior gluteal artery']],
  },
  {
    en: 'Inferior gluteal artery', // división anterior: por debajo del piriforme, con el nervio glúteo inferior, al glúteo mayor
    radio: 0.002,
    destino: GLUTEOS,
    libreFinal: 0.025,
    ramas: [[DIV_ANT, P(-0.045, 0.893, -0.034), P(-0.056, 0.884, -0.046), P(-0.066, 0.876, -0.060), P(-0.074, 0.866, -0.076), P(-0.080, 0.856, -0.090)]],
    uniones: [[0, 'inicio', 'Internal iliac artery']],
  },
  {
    en: 'Internal pudendal artery', // con el nervio pudendo: sale bajo el piriforme, rodea la espina ciática y va por el conducto pudendo al periné
    radio: 0.0016,
    ramas: [[DIV_ANT, P(-0.040, 0.890, -0.040), P(-0.044, 0.878, -0.052), P(-0.0455, 0.866, -0.0535), P(-0.047, 0.855, -0.054), P(-0.045, 0.845, -0.051), P(-0.042, 0.835, -0.043), P(-0.036, 0.826, -0.032), P(-0.027, 0.819, -0.018), P(-0.016, 0.815, -0.003)]],
    uniones: [[0, 'inicio', 'Internal iliac artery']],
  },
  {
    en: 'Obturator artery', // por la pared lateral de la pelvis, bajo el nervio obturador; en el conducto, el nervio arriba y los vasos debajo
    radio: 0.0013,
    destino: OBTURADORES,
    libreFinal: 0.012,
    entra: false, // siguen hacia el muslo
    ramas: [[DIV_ANT, P(-0.042, 0.895, -0.008), P(-0.046, 0.882, 0.003), P(-0.043, 0.868, 0.010), P(-0.043, 0.855, 0.012), P(-0.049, 0.838, 0.011)]],
    uniones: [[0, 'inicio', 'Internal iliac artery']],
  },
  // ── Venas ──
  {
    en: 'Common iliac vein', // de la vena femoral/ilíaca externa a su unión con la cava (delante de L5, a la derecha)
    radio: 0.0055,
    // Su punta queda a > radio del cuerpo de L5 (a 6 mm, con 5,5 de radio, se veía como una cinta aplanada).
    ramas: [[P(-0.014, 0.998, 0.023), P(-0.022, 0.981, 0.011), P(-0.030, 0.962, -0.002), BIF_V]],
  },
  {
    en: 'External iliac vein', // por dentro de la arteria, hasta la vena femoral
    radio: 0.005,
    radioFinal: 0.0039,
    ramas: [[BIF_V, P(-0.040, 0.932, 0.002), P(-0.043, 0.912, 0.012), P(-0.043, 0.892, 0.024), P(-0.042, 0.875, 0.035), P(-0.0440, 0.8597, 0.0436)]],
    uniones: [[0, 'inicio', 'Common iliac vein'], [0, 'fin', 'Femoral vein']],
  },
  {
    en: 'Internal iliac vein', // por detrás y por dentro de la arteria
    radio: 0.0042,
    radioFinal: 0.0036,
    ramas: [[BIF_V, P(-0.031, 0.935, -0.018), IIV_DIV, IIV_ANT]],
    uniones: [[0, 'inicio', 'Common iliac vein']],
  },
  {
    en: 'Superior gluteal veins',
    radio: 0.0024,
    destino: GLUTEOS,
    libreFinal: 0.045,
    ramas: [[IIV_DIV, P(-0.043, 0.921, -0.029), P(-0.055, 0.913, -0.031), P(-0.065, 0.918, -0.040), P(-0.075, 0.920, -0.045), P(-0.088, 0.925, -0.044), P(-0.100, 0.935, -0.040)]],
    uniones: [[0, 'inicio', 'Internal iliac vein']],
  },
  {
    en: 'Inferior gluteal veins',
    radio: 0.0022,
    destino: GLUTEOS,
    libreFinal: 0.025,
    ramas: [[IIV_ANT, P(-0.042, 0.892, -0.040), P(-0.054, 0.880, -0.053), P(-0.064, 0.871, -0.066), P(-0.071, 0.862, -0.080), P(-0.076, 0.852, -0.092)]],
    uniones: [[0, 'inicio', 'Internal iliac vein']],
  },
  {
    en: 'Internal pudendal vein', // al otro lado del nervio pudendo que la arteria
    radio: 0.0018,
    ramas: [[IIV_ANT, P(-0.037, 0.890, -0.046), P(-0.040, 0.876, -0.060), P(-0.043, 0.865, -0.061), P(-0.045, 0.855, -0.062), P(-0.044, 0.845, -0.060), P(-0.041, 0.835, -0.051), P(-0.035, 0.826, -0.040), P(-0.025, 0.819, -0.025), P(-0.013, 0.815, -0.009)]],
    uniones: [[0, 'inicio', 'Internal iliac vein']],
  },
  {
    en: 'Obturator vein',
    radio: 0.0015,
    destino: OBTURADORES,
    libreFinal: 0.012,
    entra: false, // siguen hacia el muslo
    ramas: [[IIV_ANT, P(-0.038, 0.897, -0.015), P(-0.042, 0.885, -0.002), P(-0.040, 0.871, 0.006), P(-0.036, 0.858, 0.008), P(-0.040, 0.843, 0.009)]],
    uniones: [[0, 'inicio', 'Internal iliac vein']],
  },
];
