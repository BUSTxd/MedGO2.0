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
    zona: zonaSuperior,
  },
  'miembro-inferior-derecho': {
    nombre: 'Miembro inferior derecho',
    /** Pelvis y región glútea, muslo, rodilla y pierna, tobillo y pie. */
    incluir(p) {
      if (CINTURA_PELVICA.has(p.id)) return true;
      if (FUERA_INFERIOR.has(p.id)) return false;
      const sistema = CORRECCIONES[p.id]?.sistema ?? p.system;
      if (!['skeletal', 'muscular', 'connective', 'arterial', 'venous'].includes(sistema)) return false;
      const [x, y] = centro(p);
      // Lo que cuelga del miembro superior derecho queda fuera (misma regla que allí).
      if (x < -0.145 && y > 0.7) return false;
      // Por fuera de x = −3,5 cm y por debajo de y = 0,9 m (de la cadera para
      // abajo): el suelo pélvico y los vasos del periné son más mediales (lo más
      // lateral, el coccígeo a −2,6 cm y la pudenda interna a −2,4 cm); lo más
      // medial del miembro, el grácil, a −4,1 cm. Los músculos de la cadera suben
      // hasta 1 m (glúteo medio a 0,95 m); la pared abdominal empieza en 1,08 m.
      if (x >= -0.035) return false;
      return y < (sistema === 'muscular' ? 1.0 : 0.9);
    },
    zona: zonaInferior,
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
 * Cintura pélvica y raíz del miembro inferior: lo que el rango espacial no
 * alcanza (línea media, o por encima de la cadera). La columna lumbar entra
 * porque en ella se insertan músculos del miembro: el psoas mayor nace de T12 a
 * L4 y de sus discos; el sacro da origen al piriforme y al glúteo mayor.
 * BodyParts3D no trae cóccix, psoas menor ni cuadrado lumbar.
 */
const CINTURA_PELVICA = new Set([
  // Huesos y discos
  'FJ3152', // coxal
  'FJ3393', // sacro
  'FJ3156', // T12
  'FJ3157', 'FJ3159', 'FJ3162', 'FJ3165', 'FJ3168', // L1-L5
  'FJ3211', // disco T12-L1
  'FJ3212', 'FJ3214', 'FJ3215', 'FJ3216', 'FJ3217', // discos L1-L2 … L5-S1
  // Músculos
  'FJ1431', // psoas mayor
  // Arterias
  'FJ3565', // ilíaca común
  'FJ3567', // ilíaca externa
  'FJ3569', // ilíaca interna (BodyParts3D no trae sus ramas glúteas ni la obturatriz)
  'FJ3614', // epigástrica superficial (rama de la femoral)
  // Venas
  'FJ3566', // ilíaca común
  'FJ3568', // ilíaca externa
  'FJ3570', 'FJ3571', 'FJ3572', 'FJ3607', 'FJ3608', 'FJ3609', // ilíaca interna (6 tramos)
  'FJ3616', // glútea superior
  'FJ3612', // obturatriz
  'FJ3603', // iliolumbar
  'FJ2178', // epigástrica superficial (desemboca en la safena mayor)
]);

/** Dentro del rango espacial del miembro inferior pero del suelo pélvico. */
const FUERA_INFERIOR = new Set([
  'FJ1465', 'FJ2553', // arco tendinoso del elevador del ano (dos copias)
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

  // ─── Miembro inferior ───
  // Clasificados como esqueleto; son músculos (los de la pierna).
  FJ1439: { sistema: 'muscular' }, // tibial anterior
  FJ1440: { sistema: 'muscular' }, // tibial posterior
  FJ1410: { sistema: 'muscular' }, // fibular largo
  FJ1409: { sistema: 'muscular' }, // fibular corto
  FJ1411: { sistema: 'muscular' }, // fibular tercero
  // Clasificado como tejido conectivo; es músculo.
  FJ1438: { sistema: 'muscular' }, // tensor de la fascia lata
  // Clasificado como esqueleto; es una fascia.
  FJ1423: { sistema: 'connective' }, // tracto iliotibial
  // Rótulos que no corresponden a su sitio; se identificaron por con qué vaso
  // se tocan (distancia mínima entre mallas):
  // «Perforating arteries» que nace de la femoral (1,4 mm, a 0,90 m) y da la
  // circunfleja femoral lateral (0,3 mm) y las perforantes de verdad, FJ2127
  // (0,4 mm). Corre junto a la vena femoral profunda. Es la femoral profunda.
  FJ2203: { nombreEn: 'Right deep femoral artery' },
  // «Calcaneal branches of posterior tibial artery» a la altura de la cadera
  // (0,84-0,91 m): sale de la circunfleja femoral lateral (0,3 mm) junto a su
  // rama descendente (0,0 mm) y sube por fuera, hacia el trocánter mayor.
  FJ2195: { nombreEn: 'Ascending branch of right lateral circumflex femoral artery' },
  // «Dorsal digital arteries» en la pierna (0,04-0,37 m): nace de la tibial
  // posterior (0,0 mm) bajo la poplítea y corre junto a la vena fibular.
  FJ2197: { nombreEn: 'Right fibular artery' },
  // «Dorsal metacarpal vein» en el dorso del pie.
  FJ2199: { nombreEn: 'Dorsal metatarsal vein' },
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
function zonaSuperior(p) {
  if (ZONA[p.id]) return ZONA[p.id];
  if (CINTURA_ESCAPULAR.has(p.id)) return 'hombro';
  const [, y] = centro(p);
  if (y > 1.3) return 'hombro';
  if (y > 1.11) return 'brazo';
  if (y > 0.885) return 'antebrazo';
  return 'mano';
}

/**
 * Zona dentro del miembro inferior, por la altura del centro de la pieza. Los
 * cortes: 0,84 m (bajo el cuadrado femoral y el obturador externo), 0,51 m
 * (sobre los vasos geniculares: la rodilla va con la pierna, como en el
 * sílabo) y 0,08 m (bajo el fibular tercero, que es de la pierna).
 */
function zonaInferior(p) {
  if (CINTURA_PELVICA.has(p.id)) return 'pelvis';
  const [, y] = centro(p);
  if (y > 0.84) return 'pelvis';
  if (y > 0.51) return 'muslo';
  if (y > 0.08) return 'pierna';
  return 'pie';
}
