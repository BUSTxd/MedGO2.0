// Estructuras modeladas del miembro superior derecho (las lee modelar.mjs).
// Plexo cervical (ni Open3DModel, ni Z-Anatomy, ni BodyParts3D lo tienen) y
// nervio toracodorsal (el de Z-Anatomy sale a 12 mm del fascículo posterior de
// Open3DModel y atraviesa el redondo mayor y el subescapular).
//
// Coordenadas del atlas: metros, +Y arriba, +X izquierda del cuerpo, +Z delante.

// `ramas`: polilíneas de control. `radio` en metros. `libreInicio`/`libreFinal`
// (m de recorrido) quedan exentos: el inicio nace dentro de otra estructura
// (fascículo, agujero de conjunción) y el final entra en su músculo (`destino`).
const P = (x, y, z) => [x, y, z];

// Plexo cervical: las asas C1-C2, C2-C3 y C3-C4 van delante de las apófisis
// transversas, detrás del ECM. En este modelo el ECM tapa las transversas por
// delante y por fuera: entre ECM, vértebras y elevador de la escápula queda una
// franja libre de ~5 mm (z ≈ -0,005; mapa de cortes de 2 mm), y ahí van.
const F1 = P(-0.020, 1.551, -0.020), F2 = P(-0.018, 1.535, -0.017), F3 = P(-0.015, 1.518, -0.015), F4 = P(-0.015, 1.503, -0.015);
const A12 = P(-0.031, 1.530, -0.004), A23 = P(-0.029, 1.514, -0.003), A34 = P(-0.030, 1.498, -0.005);
// Punto de Erb: mitad del borde posterior del ECM (y 1,484: x -0,042, z -0,001).
// Los ramos llegan por detrás del ECM (z ≈ -0,011 a la altura de C4).
const ERB = P(-0.046, 1.487, -0.007);

export const ESTRUCTURAS = [
  {
    en: 'Cervical plexus (C1-C4 ventral rami)',
    radio: 0.0011,
    libreInicio: 0.009,
    ramas: [
      [F1, P(-0.031, 1.548, -0.010), P(-0.038, 1.538, -0.004), A12, A23, A34],
      [F2, P(-0.027, 1.533, -0.010), A12],
      [F3, P(-0.026, 1.515, -0.009), A23],
      [F4, P(-0.026, 1.500, -0.009), A34],
      // comunicante C4 → C5: se une a la raíz C5 de Open3DModel (y 1,475: -0,0284, -0,0096)
      [P(-0.027, 1.500, -0.009), P(-0.029, 1.490, -0.007), P(-0.0284, 1.4748, -0.0096)],
      // Troncos comunes hasta el punto de Erb (C2-C3 y C3-C4), por detrás del ECM: de
      // ahí sale el abanico de ramos superficiales. Si cada ramo hiciera su propio
      // camino desde las asas, los cuatro casi coinciden y se ven trenzados.
      [A23, P(-0.036, 1.506, -0.012), P(-0.042, 1.497, -0.012), ERB],
      [A34, P(-0.035, 1.493, -0.012), P(-0.041, 1.489, -0.011), ERB],
    ],
    uniones: [[4, 'fin', 'C5 root']],
  },
  {
    en: 'Lesser occipital nerve', // C2: sube por el borde posterior del ECM hasta detrás de la oreja
    radio: 0.0007,
    // borde posterior del ECM: y 1,52 (-0,046, -0,017) · 1,54 (-0,053, -0,028) · 1,56 (-0,055, -0,041)
    ramas: [[ERB, P(-0.049, 1.503, -0.013), P(-0.051, 1.522, -0.021), P(-0.058, 1.542, -0.032), P(-0.060, 1.562, -0.045), P(-0.062, 1.580, -0.056), P(-0.060, 1.598, -0.066)]],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)']],
  },
  {
    en: 'Great auricular nerve', // C2-C3: rodea el ECM y sube sobre su cara superficial hacia el lóbulo de la oreja
    radio: 0.0008,
    // cara lateral del ECM: y 1,50 (-0,046, 0,000) · 1,52 (-0,050, -0,005) · 1,54 (-0,055, -0,014) · 1,56 (-0,060, -0,020)
    ramas: [[ERB, P(-0.0495, 1.492, -0.003), P(-0.050, 1.502, 0.001), P(-0.054, 1.520, -0.003), P(-0.058, 1.540, -0.010), P(-0.063, 1.558, -0.015), P(-0.066, 1.572, -0.011)]],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)']],
  },
  {
    en: 'Transverse cervical nerve', // C2-C3: cruza la cara superficial del ECM hacia delante, bajo el platisma
    radio: 0.0007,
    // ECM a y 1,475: x -0,042…-0,022, z 0,0025…0,025
    ramas: [[ERB, P(-0.049, 1.482, 0.000), P(-0.047, 1.478, 0.010), P(-0.044, 1.476, 0.020), P(-0.036, 1.474, 0.030), P(-0.022, 1.472, 0.039), P(-0.008, 1.470, 0.047)]],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)']],
  },
  {
    en: 'Supraclavicular nerves', // C3-C4: medial, intermedio y lateral, por encima de la clavícula
    radio: 0.0007,
    ramas: [
      // el medial baja por fuera de la cabeza clavicular del ECM (y 1,44: lateral -0,046, 0,021) y cruza la clavícula por delante
      [ERB, P(-0.049, 1.470, 0.002), P(-0.050, 1.452, 0.014), P(-0.051, 1.435, 0.026), P(-0.049, 1.418, 0.044), P(-0.044, 1.402, 0.056), P(-0.038, 1.385, 0.068)],
      [ERB, P(-0.054, 1.464, -0.002), P(-0.066, 1.444, 0.008), P(-0.075, 1.428, 0.022), P(-0.080, 1.408, 0.040), P(-0.082, 1.388, 0.050)],
      [ERB, P(-0.060, 1.470, -0.012), P(-0.085, 1.450, -0.018), P(-0.110, 1.437, -0.022), P(-0.135, 1.430, -0.026), P(-0.155, 1.424, -0.030)],
    ],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)'], [1, 'inicio', 'Cervical plexus (C1-C4 ventral rami)'], [2, 'inicio', 'Cervical plexus (C1-C4 ventral rami)']],
  },
  {
    en: 'Muscular branches of cervical plexus to sternocleidomastoid', // C2-C3, por su cara profunda
    radio: 0.0006,
    destino: ['Sternocleidomastoid muscle'],
    libreFinal: 0.005,
    ramas: [[A23, P(-0.031, 1.512, -0.001), P(-0.0335, 1.510, 0.002), P(-0.036, 1.509, 0.004)]],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)']],
  },
  {
    en: 'Muscular branches of cervical plexus to trapezius', // C3-C4: bajan por fuera del tronco del XI y se le unen bajo el trapecio
    radio: 0.0006,
    // tronco del XI (publicado, con DESPLAZAR): y 1,48 (-0,036, -0,040) · 1,46 (-0,037, -0,055) · 1,445 (-0,0388, -0,0665)
    ramas: [[A34, P(-0.034, 1.492, -0.013), P(-0.039, 1.484, -0.025), P(-0.041, 1.472, -0.040), P(-0.042, 1.460, -0.053), P(-0.041, 1.450, -0.062), P(-0.0388, 1.4452, -0.0665)]],
    uniones: [[0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)'], [0, 'fin', 'Accessory nerve (XI)']],
  },
  {
    en: 'Phrenic nerve', // C3-C5: baja por delante del escaleno anterior (no está), entre arteria y vena subclavias, y por el mediastino hasta el diafragma
    radio: 0.0011,
    // El tronco nace DEL ramo de C4 (empieza dentro de su tubo y lo sigue unos
    // milímetros antes de bajar): si arrancara justo donde acaban el asa C3-C4 y
    // la raíz C4, que llegan por detrás de la transversa, se ve un tubo cortado
    // saliendo del hueso (lo vio BUST, v10). C3 y C5 se le unen en «Y».
    libreInicio: 0.004,
    ramas: [
      // tronco (C4): raíz C4 → asa C3-C4 → baja por delante del escaleno anterior
      [P(-0.026, 1.500, -0.009), A34, P(-0.033, 1.486, -0.003), P(-0.032, 1.472, -0.001), P(-0.029, 1.460, 0.003), P(-0.026, 1.446, 0.008), P(-0.023, 1.428, 0.011), P(-0.021, 1.405, 0.014), P(-0.025, 1.375, 0.020), P(-0.034, 1.340, 0.027), P(-0.042, 1.300, 0.031), P(-0.047, 1.260, 0.030), P(-0.049, 1.225, 0.024)],
      // contribución de C3: desde el asa C2-C3/C3-C4 (pasa por x -0,0295 a y 1,506)
      [P(-0.0295, 1.506, -0.004), P(-0.035, 1.494, -0.002), P(-0.0345, 1.483, -0.003), P(-0.033, 1.476, -0.002)],
      // contribución de C5: desde la raíz C5 de Open3DModel (y 1,47: -0,0307, -0,0093)
      [P(-0.0307, 1.4696, -0.0093), P(-0.031, 1.465, -0.004), P(-0.0295, 1.459, 0.002)],
    ],
    uniones: [
      [0, 'inicio', 'Cervical plexus (C1-C4 ventral rami)'],
      [1, 'inicio', 'Cervical plexus (C1-C4 ventral rami)'],
      [1, 'fin', 'Phrenic nerve'],
      [2, 'inicio', 'C5 root'],
      [2, 'fin', 'Phrenic nerve'],
    ],
  },
  {
    en: 'Thoracodorsal nerve', // del fascículo posterior, con la arteria toracodorsal, a la cara profunda del dorsal ancho
    radio: 0.0012,
    libreInicio: 0.005,
    destino: ['Latissimus dorsi'],
    libreFinal: 0.03,
    uniones: [[0, 'inicio', 'Posterior cord of brachial plexus']],
    ramas: [[P(-0.1214, 1.3797, -0.0146), P(-0.124, 1.372, -0.022), P(-0.130, 1.360, -0.030), P(-0.136, 1.345, -0.038), P(-0.138, 1.330, -0.047), P(-0.135, 1.318, -0.059), P(-0.130, 1.305, -0.070), P(-0.127, 1.290, -0.080), P(-0.128, 1.275, -0.080), P(-0.124, 1.258, -0.084), P(-0.116, 1.240, -0.087), P(-0.106, 1.225, -0.090)]],
  },
];
