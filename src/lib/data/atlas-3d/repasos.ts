// Repasos guiados del atlas 3D: un recorrido paso a paso por un conjunto de
// piezas (cada paso resalta las suyas con un rótulo corto y explica qué son) y
// una prueba que resalta una pieza y pide reconocerla. Las piezas van por
// `nombreEn` (el nombre inglés del manifiesto), así que un repaso solo sale si
// la región cargada trae sus piezas.

export interface PiezaRepaso {
  en: string;
  /** Rótulo corto que se clava en la pieza durante el paso. */
  rotulo: string;
}

export interface PasoRepaso {
  titulo: string;
  texto: string;
  piezas: PiezaRepaso[];
}

export interface Repaso {
  id: string;
  nombre: string;
  /** Piezas de referencia, translúcidas (huesos, arteria, músculo de al lado). */
  contexto: string[];
  pasos: PasoRepaso[];
  /** Piezas que salen en el recorrido pero no son del plexo: no se preguntan. */
  noPreguntar?: string[];
}

export const REPASOS: Repaso[] = [
  {
    id: 'plexo-braquial',
    nombre: 'Plexo braquial',
    contexto: [
      'Cervical vertebra (C4)', 'Cervical vertebra (C5)', 'Cervical vertebra (C6)', 'Cervical vertebra (C7)',
      'Thoracic vertebra (T1)', 'Thoracic vertebra (T2)', 'Rib (1st)', 'Clavicle', 'Scapula', 'Humerus',
      'Subclavian artery', 'Axillary artery',
    ],
    pasos: [
      {
        titulo: 'Raíces',
        texto:
          'Ramos anteriores de C5 a T1. Salen por los agujeros de conjunción y pasan entre los escalenos anterior y medio (no están en el modelo). A veces se suma C4 (plexo prefijado) o T2 (posfijado).',
        piezas: [
          { en: 'C5 root', rotulo: 'C5' },
          { en: 'C6 root', rotulo: 'C6' },
          { en: 'C7 root', rotulo: 'C7' },
          { en: 'C8 root', rotulo: 'C8' },
          { en: 'T1 root', rotulo: 'T1' },
        ],
      },
      {
        titulo: 'Troncos',
        texto:
          'En el triángulo posterior del cuello las raíces se juntan en tres troncos: superior (C5 + C6), medio (C7, que sigue solo) e inferior (C8 + T1, que va sobre la 1.ª costilla, detrás de la arteria subclavia).',
        piezas: [
          { en: 'Superior trunk of brachial plexus', rotulo: 'Tronco superior (C5–C6)' },
          { en: 'Middle trunk of brachial plexus', rotulo: 'Tronco medio (C7)' },
          { en: 'Inferior trunk of brachial plexus', rotulo: 'Tronco inferior (C8–T1)' },
        ],
      },
      {
        titulo: 'Divisiones anteriores',
        texto:
          'Detrás de la clavícula cada tronco se parte en una división anterior y una posterior. Las anteriores van a los compartimentos flexores (anteriores) del miembro.',
        piezas: [
          { en: 'Anterior division of superior trunk of brachial plexus', rotulo: 'Ant. del superior' },
          { en: 'Anterior division of middle trunk of brachial plexus', rotulo: 'Ant. del medio' },
          { en: 'Anterior division of inferior trunk of brachial plexus', rotulo: 'Ant. del inferior' },
        ],
      },
      {
        titulo: 'Divisiones posteriores',
        texto: 'Las tres divisiones posteriores van a los compartimentos extensores (posteriores) y se juntan todas en el fascículo posterior.',
        piezas: [
          { en: 'Posterior division of superior trunk of brachial plexus', rotulo: 'Post. del superior' },
          { en: 'Posterior division of middle trunk of brachial plexus', rotulo: 'Post. del medio' },
          { en: 'Posterior division of inferior trunk of brachial plexus', rotulo: 'Post. del inferior' },
        ],
      },
      {
        titulo: 'Fascículos',
        texto:
          'En la axila, detrás del pectoral menor, las divisiones forman tres fascículos, nombrados por su posición respecto a la 2.ª porción de la arteria axilar. Lateral: divisiones anteriores del superior y del medio (C5–C7). Medial: división anterior del inferior (C8–T1). Posterior: las tres divisiones posteriores (C5–T1).',
        piezas: [
          { en: 'Lateral cord of brachial plexus', rotulo: 'Fascículo lateral (C5–C7)' },
          { en: 'Medial cord of brachial plexus', rotulo: 'Fascículo medial (C8–T1)' },
          { en: 'Posterior cord of brachial plexus', rotulo: 'Fascículo posterior (C5–T1)' },
        ],
      },
      {
        titulo: 'Ramos de las raíces',
        texto:
          'Escapular dorsal (C5): romboides y elevador de la escápula. Torácico largo, de Bell (C5–C7): serrato anterior; baja por la pared medial de la axila y su lesión da la escápula alada.',
        piezas: [
          { en: 'Dorsal scapular nerve', rotulo: 'Escapular dorsal (C5)' },
          { en: 'Long thoracic nerve', rotulo: 'Torácico largo (C5–C7)' },
        ],
      },
      {
        titulo: 'Ramos del tronco superior',
        texto:
          'Supraescapular (C5–C6): pasa por la escotadura escapular, bajo el ligamento transverso superior, e inerva el supraespinoso y el infraespinoso. Nervio del subclavio (C5–C6): músculo subclavio.',
        piezas: [
          { en: 'Suprascapular nerve', rotulo: 'Supraescapular (C5–C6)' },
          { en: 'Subclavian nerve', rotulo: 'N. del subclavio (C5–C6)' },
        ],
      },
      {
        titulo: 'Ramos del fascículo lateral',
        texto:
          'Pectoral lateral (C5–C7): pectoral mayor. Musculocutáneo (C5–C7): perfora el coracobraquial, inerva coracobraquial, bíceps y braquial, y sigue como cutáneo lateral del antebrazo. Raíz lateral del mediano.',
        piezas: [
          { en: 'Lateral pectoral nerve', rotulo: 'Pectoral lateral' },
          { en: 'Musculocutaneus nerve', rotulo: 'Musculocutáneo' },
          { en: 'Lateral root of median nerve', rotulo: 'Raíz lateral del mediano' },
        ],
      },
      {
        titulo: 'Ramos del fascículo medial',
        texto:
          'Pectoral medial (C8–T1): pectoral menor y mayor. Cutáneo medial del brazo y cutáneo medial del antebrazo (C8–T1): piel de la cara medial. Cubital (C7–T1). Raíz medial del mediano.',
        piezas: [
          { en: 'Medial pectoral nerve', rotulo: 'Pectoral medial' },
          { en: 'Medial brachial cutaneous nerve', rotulo: 'Cutáneo medial del brazo' },
          { en: 'Medial antebrachial cutaneous nerve', rotulo: 'Cutáneo medial del antebrazo' },
          { en: 'Ulnar nerve', rotulo: 'Cubital' },
          { en: 'Medial root of median nerve', rotulo: 'Raíz medial del mediano' },
        ],
      },
      {
        titulo: 'Ramos del fascículo posterior',
        texto:
          'Subescapular superior (C5–C6): subescapular. Toracodorsal (C6–C8): dorsal ancho. Subescapular inferior (C5–C6): subescapular y redondo mayor. Axilar (C5–C6): sale por el espacio cuadrangular, deltoides y redondo menor. Radial (C5–T1): extensores del brazo y del antebrazo.',
        piezas: [
          { en: 'Upper subscapular nerve', rotulo: 'Subescapular superior' },
          { en: 'Thoracodorsal nerve', rotulo: 'Toracodorsal' },
          { en: 'Lower subscapular nerve', rotulo: 'Subescapular inferior' },
          { en: 'Axillary nerve - superior lateral br cutaneous nerve', rotulo: 'Axilar' },
          { en: 'Radial nerve', rotulo: 'Radial' },
        ],
      },
      {
        titulo: 'La «M» y el mediano',
        texto:
          'Delante de la arteria axilar, el musculocutáneo, las dos raíces del mediano y el cubital dibujan una «M». Las raíces lateral y medial se unen y forman el nervio mediano (C6–T1).',
        piezas: [
          { en: 'Musculocutaneus nerve', rotulo: 'Musculocutáneo' },
          { en: 'Lateral root of median nerve', rotulo: 'Raíz lateral' },
          { en: 'Median nerve', rotulo: 'Mediano' },
          { en: 'Medial root of median nerve', rotulo: 'Raíz medial' },
          { en: 'Ulnar nerve', rotulo: 'Cubital' },
        ],
      },
      {
        titulo: 'Los cinco ramos terminales',
        texto:
          'Musculocutáneo y mediano (fascículo lateral), cubital y mediano (medial), axilar y radial (posterior). Entre ellos se reparten todos los músculos del brazo, el antebrazo y la mano.',
        piezas: [
          { en: 'Musculocutaneus nerve', rotulo: 'Musculocutáneo' },
          { en: 'Axillary nerve - superior lateral br cutaneous nerve', rotulo: 'Axilar' },
          { en: 'Radial nerve', rotulo: 'Radial' },
          { en: 'Median nerve', rotulo: 'Mediano' },
          { en: 'Ulnar nerve', rotulo: 'Cubital' },
        ],
      },
    ],
  },
  {
    id: 'plexo-cervical',
    nombre: 'Plexo cervical',
    contexto: [
      'Atlas (C1)', 'Axis (C2)', 'Cervical vertebra (C3)', 'Cervical vertebra (C4)', 'Cervical vertebra (C5)',
      'Cervical vertebra (C6)', 'Clavicle', 'Sternocleidomastoid muscle',
    ],
    noPreguntar: ['Accessory nerve (XI)', 'C5 root'],
    pasos: [
      {
        titulo: 'Ramos anteriores C1–C4',
        texto:
          'El plexo cervical lo forman los ramos anteriores de C1 a C4. Salen junto a las apófisis transversas, por delante del elevador de la escápula y del escaleno medio, cubiertos por el esternocleidomastoideo.',
        piezas: [
          { en: 'Ventral ramus of C1 (cervical plexus)', rotulo: 'C1' },
          { en: 'Ventral ramus of C2 (cervical plexus)', rotulo: 'C2' },
          { en: 'Ventral ramus of C3 (cervical plexus)', rotulo: 'C3' },
          { en: 'Ventral ramus of C4 (cervical plexus)', rotulo: 'C4' },
        ],
      },
      {
        titulo: 'Asas',
        texto:
          'Cada ramo se une al siguiente formando asas delante de las apófisis transversas: C1 con C2 (donde se encuentran sus dos ramos), C2–C3 y C3–C4. El asa cervical (C1–C3, a los infrahioideos) no está en el modelo.',
        piezas: [
          { en: 'Loop between C2 and C3 (cervical plexus)', rotulo: 'Asa C2–C3' },
          { en: 'Loop between C3 and C4 (cervical plexus)', rotulo: 'Asa C3–C4' },
        ],
      },
      {
        titulo: 'Punto nervioso del cuello',
        texto:
          'Los ramos cutáneos salen juntos por la mitad del borde posterior del esternocleidomastoideo: el punto nervioso (también llamado punto de Erb; no confundir con la unión C5–C6 del plexo braquial, que lleva el mismo nombre). Aquí se infiltra la anestesia del plexo cervical superficial.',
        piezas: [
          { en: 'Common trunk of C2-C3 cutaneous branches (cervical plexus)', rotulo: 'Tronco C2–C3' },
          { en: 'Common trunk of C3-C4 cutaneous branches (cervical plexus)', rotulo: 'Tronco C3–C4' },
        ],
      },
      {
        titulo: 'Ramos cutáneos',
        texto:
          'Occipital menor (C2): piel detrás de la oreja. Auricular mayor (C2–C3): oreja, región parotídea y ángulo de la mandíbula. Cervical transverso (C2–C3): piel de la cara anterior del cuello. Supraclaviculares mediales, intermedios y laterales (C3–C4): piel sobre la clavícula, el hombro y el tórax hasta la 2.ª costilla.',
        piezas: [
          { en: 'Lesser occipital nerve', rotulo: 'Occipital menor (C2)' },
          { en: 'Great auricular nerve', rotulo: 'Auricular mayor (C2–C3)' },
          { en: 'Transverse cervical nerve', rotulo: 'Cervical transverso (C2–C3)' },
          { en: 'Medial supraclavicular nerves', rotulo: 'Supraclav. mediales' },
          { en: 'Intermediate supraclavicular nerves', rotulo: 'Supraclav. intermedios' },
          { en: 'Lateral supraclavicular nerves', rotulo: 'Supraclav. laterales' },
        ],
      },
      {
        titulo: 'Ramos musculares',
        texto:
          'Al esternocleidomastoideo (C2–C3) y al trapecio (C3–C4), que se unen al nervio accesorio (XI). El motor de los dos músculos es el XI; los ramos cervicales llevan sobre todo propiocepción.',
        piezas: [
          { en: 'Muscular branches of cervical plexus to sternocleidomastoid', rotulo: 'Al ECM (C2–C3)' },
          { en: 'Muscular branches of cervical plexus to trapezius', rotulo: 'Al trapecio (C3–C4)' },
          { en: 'Accessory nerve (XI)', rotulo: 'Accesorio (XI), no es del plexo' },
        ],
      },
      {
        titulo: 'Nervio frénico',
        texto:
          'C3, C4 y C5 (sobre todo C4). Baja por delante del escaleno anterior, pasa entre la arteria y la vena subclavias y entra al tórax. Es el único motor del diafragma y sensitivo del pericardio, la pleura mediastínica y la diafragmática: por eso el dolor del diafragma se refiere al hombro (C4).',
        piezas: [{ en: 'Phrenic nerve', rotulo: 'Frénico (C3–C5)' }],
      },
      {
        titulo: 'Comunicante con el plexo braquial',
        texto: 'Un ramo de C4 se une a la raíz C5: el plexo cervical y el braquial quedan conectados (en el plexo prefijado, C4 aporta más).',
        piezas: [
          { en: 'Communicating branch between C4 and C5 (cervical plexus)', rotulo: 'Comunicante C4–C5' },
          { en: 'C5 root', rotulo: 'Raíz C5 (plexo braquial)' },
        ],
      },
    ],
  },
];
