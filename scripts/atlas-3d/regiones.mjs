// Regiones del atlas 3D: qué piezas de BodyParts3D entran en cada paquete.
//
// Todas las piezas salen del mismo cuerpo y conservan sus coordenadas, así que
// cualquier combinación de regiones encaja sin ajustes. Una pieza que caiga en
// dos regiones (p. ej. la clavícula en «cuello» y en «miembro superior») se
// descarga dos veces pero el visor la pinta una sola (deduplica por `id`).
//
// Coordenadas del atlas: metros, +Y arriba, +X = lado IZQUIERDO del cuerpo,
// +Z anterior. Las piezas con sufijo `M` son el espejo izquierdo de la derecha.

const centro = (p) => p.bounds[0].map((v, i) => (v + p.bounds[1][i]) / 2);

export const REGIONES = {
  'miembro-superior-derecho': {
    nombre: 'Miembro superior derecho',
    /** Hombro (cintura escapular), brazo, antebrazo y mano. */
    incluir(p) {
      const [x, y] = centro(p);
      // El brazo cuelga lejos del tronco: todo lo que cae por fuera de x = −14,5 cm
      // y por encima de la rodilla es miembro superior (lo más medial es el
      // coracobraquial, a −16 cm; lo más lateral del tronco, el tensor de la
      // fascia lata, a −14 cm).
      if (x < -0.145 && y > 0.7) return true;
      return CINTURA_ESCAPULAR.has(p.id);
    },
  },
};

/**
 * Cintura escapular y raíz del miembro: están pegadas al tronco, así que no las
 * separa la posición. Van por id, revisadas una a una.
 */
const CINTURA_ESCAPULAR = new Set([
  // Huesos
  'FJ3362', // clavícula
  'FJ3384', // escápula
  // Costillas de la región pectoral (bajo el pectoral mayor y el menor): 1.ª-6.ª
  // con sus cartílagos costales. Desde la 7.ª ya son pared abdominal alta.
  'FJ3334', 'FJ3333', // 1.ª costilla y cartílago
  'FJ3336', 'FJ3335', // 2.ª
  'FJ3338', 'FJ3337', // 3.ª
  'FJ3340', 'FJ3339', // 4.ª
  'FJ3342', 'FJ3341', // 5.ª
  'FJ3344', 'FJ3343', // 6.ª
  // Músculos toracoapendiculares y escapulares
  'FJ1446', 'FJ1447', 'FJ1464', // pectoral mayor (abdominal, clavicular, esternocostal)
  'FJ1456', // pectoral menor
  'FJ1459', // serrato anterior
  'FJ1460', // subclavio
  'FJ1520', 'FJ1521', 'FJ1554', // trapecio (ascendente, descendente, transversa)
  'FJ1532', // elevador de la escápula
  'FJ1536', 'FJ1537', // romboides mayor y menor
  'FJ1500', // infraespinoso
  'FJ1504', // subescapular
  'FJ1506', // supraespinoso
  'FJ1507', // redondo mayor
  // Arterias
  'FJ3579', // subclavia
  'FJ2268', // axilar
  'FJ2304', 'FJ2263', 'FJ2282', 'FJ2361', // toracoacromial: tronco y ramas
  'FJ1938', // torácica lateral
  'FJ2298', // subescapular
  'FJ2273', // circunfleja escapular
  'FJ2305', // toracodorsal
  'FJ2303', // supraescapular
  'FJ2284', // escapular dorsal
  'FJ2309', // cervical transversa
  // Venas
  'FJ3587', // subclavia
  'FJ2269', // axilar
  'FJ2285', // torácica lateral
  'FJ2299', // subescapular
  'FJ2274', // circunfleja escapular
  'FJ2306', // toracodorsal
  'FJ2302', // supraescapular
]);

/**
 * Errores del propio BodyParts3D que se corrigen al extraer. Solo lo que se
 * comprobó contra la posición de la pieza.
 */
export const CORRECCIONES = {
  // Rotulado «Left» pero está en la mano derecha (x = −0,28); su espejo FJ1469M
  // dice «Right» y está en la izquierda.
  FJ1469: { nombreEn: 'Right flexor pollicis brevis' },
  // Clasificados como esqueleto; son músculos.
  FJ1504: { sistema: 'muscular' },
  FJ1532: { sistema: 'muscular' },
  // Clasificado como «órgano de los sentidos»; es tejido conectivo.
  FJ1471: { sistema: 'connective' },
  // Hay dos «posterior circumflex humeral artery» en paralelo (3 mm de media) y
  // ninguna vena circunfleja posterior. Esta se une a la vena circunfleja
  // anterior (0,1 mm) y a la vena axilar (0,3 mm); la otra, FJ2291, a las
  // arterias axilar y circunfleja anterior. Es la vena.
  FJ2292: { nombreEn: 'Right posterior circumflex humeral vein', sistema: 'venous' },
};

/**
 * Vasos que BodyParts3D deja metidos dentro de un hueso → hueso del que se
 * sacan (`despegar.mjs`). Medido: arteria supraescapular 55 % dentro de la
 * escápula, vena 64 %.
 */
export const DESPEGAR = {
  FJ2303: 'FJ3384',
  FJ2302: 'FJ3384',
};

/** Piezas cuyo centro cae en otra zona que la que les da la anatomía. */
const ZONA = {
  FJ1488: 'brazo', // coracobraquial: su centro sube hasta la altura del hombro
  FJ1493: 'antebrazo', // extensor del índice: nace en el antebrazo, su centro baja a la mano
};

/** Zona dentro del miembro superior, por la altura del centro de la pieza. */
export function zonaDe(p) {
  if (ZONA[p.id]) return ZONA[p.id];
  if (CINTURA_ESCAPULAR.has(p.id)) return 'hombro';
  const [, y] = centro(p);
  if (y > 1.3) return 'hombro';
  if (y > 1.11) return 'brazo';
  if (y > 0.885) return 'antebrazo';
  return 'mano';
}
