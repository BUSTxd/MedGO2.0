// Pares craneales III a XII: dónde emergen del tronco, qué núcleos los forman y
// qué pasa si se lesionan, con el trayecto de su porción inicial (≈ 1,5 cm).
//
// Cada raíz se describe por un punto de arranque DENTRO del tronco y su
// recorrido fuera; al construir la geometría, el arranque se lleva hasta la
// superficie real del modelo, así que las raíces siempre nacen pegadas a ella.
// Lado izquierdo (x > 0); el derecho se refleja.

import type { Vec } from './sdf.ts';
import type { Columna, ParId } from './interior.ts';

export interface Raiz {
  /** Punto dentro del tronco y dirección en la que se busca la superficie. */
  desde: Vec;
  dir: Vec;
  /** Recorrido fuera del tronco (sin el punto de salida, que se calcula). */
  pts: Vec[];
  r: number;
}

export interface Nervio {
  id: ParId;
  nombre: string;
  tipo: 'Motor' | 'Sensitivo' | 'Mixto';
  color: string;
  emerge: string;
  /** Agujero de salida del cráneo. */
  sale: string;
  componentes: Columna[];
  /** Núcleos (ids de interior.ts) y fibras intraaxiales. */
  nucleos: string[];
  funcion: string;
  lesion: string;
  perla: string;
  raices: Raiz[];
  /** Grosor relativo del tronco nervioso. */
}

/** Raicillas en abanico que se juntan en un punto y siguen como un solo nervio. */
function abanico(alturas: number[], x: number, z: number, dir: Vec, junta: Vec, resto: Vec[], rRaicilla: number, rNervio: number): Raiz[] {
  const out: Raiz[] = alturas.map((y) => ({ desde: [x, y, z], dir, pts: [junta], r: rRaicilla }));
  out.push({ desde: junta, dir: [0, 0, 0], pts: resto, r: rNervio });
  return out;
}

export const NERVIOS: Nervio[] = [
  {
    id: 'III', nombre: 'Oculomotor', tipo: 'Motor', color: '#e8590c',
    emerge: 'Cara medial del pedúnculo cerebral, en la fosa interpeduncular (mesencéfalo).',
    sale: 'Fisura orbitaria superior (por dentro del anillo tendinoso).',
    componentes: ['esg', 'evg'],
    nucleos: ['n_oculomotor', 'n_edinger', 'f_oculomotor'],
    funcion: 'Mueve el ojo (rectos superior, inferior y medial, oblicuo inferior), eleva el párpado y contrae la pupila y el músculo ciliar.',
    lesion: 'Ptosis, ojo «abajo y afuera» y midriasis arreactiva del mismo lado; diplopía.',
    perla: 'Pupila afectada = compresión (aneurisma de la comunicante posterior, herniación del uncus). Pupila respetada = isquemia (diabetes).',
    raices: abanico([3.18, 3.26, 3.34], 0.24, 0.3, [0, 0, 1], [0.32, 3.24, 0.8], [[0.5, 3.45, 1.35], [0.74, 3.75, 1.9]], 0.035, 0.085),
  },
  {
    id: 'IV', nombre: 'Troclear', tipo: 'Motor', color: '#f59f00',
    emerge: 'Cara POSTERIOR, justo debajo del colículo inferior, a cada lado del frenillo del velo medular superior.',
    sale: 'Fisura orbitaria superior (por fuera del anillo tendinoso).',
    componentes: ['esg'],
    nucleos: ['n_troclear'],
    funcion: 'Oblicuo superior del ojo contrario a su núcleo: deprime el ojo en aducción y lo rota hacia dentro (intorsión).',
    lesion: 'Diplopía vertical que empeora al bajar escaleras o leer; inclinación de la cabeza hacia el lado sano.',
    perla: 'El más delgado y el de trayecto intracraneal más largo: el más vulnerable en los traumatismos craneales.',
    raices: [{ desde: [0.14, 2.78, -0.5], dir: [0, 0, -1], pts: [[0.42, 2.76, -0.92], [0.92, 2.8, -0.92], [1.34, 2.88, -0.4], [1.52, 3.0, 0.3], [1.5, 3.15, 1.05]], r: 0.032 }],
  },
  {
    id: 'V', nombre: 'Trigémino', tipo: 'Mixto', color: '#2f9e44',
    emerge: 'Cara lateral del puente, en su unión con el pedúnculo cerebeloso medio: raíz sensitiva gruesa y motora fina.',
    sale: 'V1 fisura orbitaria superior · V2 agujero redondo · V3 agujero oval.',
    componentes: ['asg', 'eve'],
    nucleos: ['n_mesencefalico_v', 'n_principal_v', 'n_espinal_v', 'n_motor_v'],
    funcion: 'Sensibilidad de la cara, la córnea, la boca y los dientes; músculos de la masticación.',
    lesion: 'Anestesia de la hemicara, reflejo corneal abolido (aferencia) y mandíbula desviada hacia el lado lesionado.',
    perla: 'Reflejo corneal: aferente V1, eferente VII.',
    raices: [
      { desde: [1.15, 1.5, 0.2], dir: [1, 0, 0.3], pts: [[1.78, 1.58, 0.5], [2.25, 1.68, 0.9], [2.62, 1.78, 1.3]], r: 0.16 },
      { desde: [1.12, 1.72, 0.22], dir: [1, 0, 0.3], pts: [[1.74, 1.78, 0.58], [2.2, 1.86, 0.98], [2.56, 1.94, 1.36]], r: 0.055 },
    ],
  },
  {
    id: 'VI', nombre: 'Abducens', tipo: 'Motor', color: '#1c7ed6',
    emerge: 'Surco bulboprotuberancial, por encima de la pirámide, cerca de la línea media.',
    sale: 'Fisura orbitaria superior; antes cruza el seno cavernoso por dentro.',
    componentes: ['esg'],
    nucleos: ['n_abducens', 'f_abducens'],
    funcion: 'Recto lateral: abduce el ojo.',
    lesion: 'Estrabismo convergente y diplopía horizontal que empeora al mirar hacia el lado lesionado.',
    perla: 'Asciende un largo trecho por el clivus: se lesiona en la hipertensión intracraneal sin valor localizador.',
    raices: [{ desde: [0.25, 0.02, 0.35], dir: [0, 0, 1], pts: [[0.3, 0.28, 0.98], [0.38, 0.95, 1.42], [0.45, 1.75, 1.78]], r: 0.05 }],
  },
  {
    id: 'VII', nombre: 'Facial', tipo: 'Mixto', color: '#d6336c',
    emerge: 'Ángulo pontocerebeloso, en el surco bulboprotuberancial, medial al VIII (con el nervio intermedio entre ambos).',
    sale: 'Conducto auditivo interno → canal facial → agujero estilomastoideo.',
    componentes: ['eve', 'evg', 'avg', 'asg'],
    nucleos: ['n_facial', 'n_salivatorio_sup', 'n_solitario', 'f_facial'],
    funcion: 'Mímica y estapedio; lágrimas y saliva (submandibular, sublingual); gusto de los 2/3 anteriores de la lengua.',
    lesion: 'Parálisis facial periférica de toda la hemicara, hiperacusia, ojo seco y pérdida del gusto anterior.',
    perla: 'Central (cortical): respeta la frente. Periférica (núcleo o nervio): la incluye.',
    raices: [
      { desde: [0.88, 0.18, -0.02], dir: [1, 0, 0.35], pts: [[1.45, 0.3, 0.38], [1.95, 0.4, 0.72], [2.38, 0.45, 1.0]], r: 0.07 },
      { desde: [0.84, 0.15, -0.1], dir: [1, 0, 0.3], pts: [[1.5, 0.26, 0.3], [1.98, 0.36, 0.64], [2.4, 0.41, 0.92]], r: 0.025 },
    ],
  },
  {
    id: 'VIII', nombre: 'Vestibulococlear', tipo: 'Sensitivo', color: '#7048e8',
    emerge: 'Ángulo pontocerebeloso, lateral al facial.',
    sale: 'Conducto auditivo interno (no sale del cráneo: termina en el oído interno).',
    componentes: ['aes'],
    nucleos: ['n_vestibulares', 'n_cocleares'],
    funcion: 'Audición (porción coclear) y equilibrio (porción vestibular).',
    lesion: 'Hipoacusia neurosensorial, acúfenos, vértigo y nistagmo.',
    perla: 'El schwannoma vestibular nace en el ángulo pontocerebeloso y comprime VIII, luego VII y V (reflejo corneal).',
    raices: [{ desde: [0.84, 0.12, -0.22], dir: [1, 0, 0.1], pts: [[1.55, 0.22, 0.22], [2.0, 0.3, 0.56], [2.42, 0.35, 0.82]], r: 0.095 }],
  },
  {
    id: 'IX', nombre: 'Glosofaríngeo', tipo: 'Mixto', color: '#0ca678',
    emerge: 'Surco postolivar (retroolivar), la raicilla más alta de la serie IX-X-XI.',
    sale: 'Agujero yugular.',
    componentes: ['eve', 'evg', 'avg', 'asg'],
    nucleos: ['n_ambiguo', 'n_salivatorio_inf', 'n_solitario', 'n_espinal_v'],
    funcion: 'Sensibilidad y gusto del 1/3 posterior de la lengua y la faringe; seno y cuerpo carotídeo; parótida; estilofaríngeo.',
    lesion: 'Reflejo nauseoso disminuido (rama aferente) y pérdida del gusto posterior.',
    perla: 'Reflejo nauseoso: aferente IX, eferente X.',
    raices: abanico([-0.22, -0.32, -0.42], 0.66, -0.06, [1, 0, 0.2], [1.22, -0.32, 0.2], [[1.75, -0.36, 0.44], [2.2, -0.45, 0.6]], 0.022, 0.05),
  },
  {
    id: 'X', nombre: 'Vago', tipo: 'Mixto', color: '#c2255c',
    emerge: 'Surco postolivar, por debajo del IX, con varias raicillas.',
    sale: 'Agujero yugular.',
    componentes: ['eve', 'evg', 'avg', 'asg'],
    nucleos: ['n_ambiguo', 'n_dorsal_vago', 'n_solitario', 'n_espinal_v'],
    funcion: 'Faringe, laringe y paladar (deglución y voz); parasimpático de corazón, pulmones y tubo digestivo; sensibilidad visceral.',
    lesion: 'Disfagia, disfonía, úvula desviada hacia el lado sano y paladar caído del lado lesionado.',
    perla: 'El recurrente laríngeo izquierdo rodea el cayado aórtico: se lesiona en la cirugía y en tumores del mediastino.',
    raices: abanico([-0.55, -0.68, -0.81, -0.94, -1.07, -1.2], 0.68, -0.06, [1, 0, 0.2], [1.25, -0.82, 0.18], [[1.75, -0.86, 0.44], [2.24, -0.95, 0.6]], 0.024, 0.07),
  },
  {
    id: 'XI', nombre: 'Accesorio', tipo: 'Motor', color: '#5c940d',
    emerge: 'Raíz craneal: surco postolivar bajo el X. Raíz espinal: cara lateral de la médula C1-C5, que sube por el foramen magno.',
    sale: 'Agujero yugular.',
    componentes: ['eve'],
    nucleos: ['n_accesorio', 'n_ambiguo'],
    funcion: 'Esternocleidomastoideo y trapecio (raíz espinal); la craneal se une al vago.',
    lesion: 'Hombro caído, escápula alada leve y debilidad al girar la cabeza hacia el lado contrario.',
    perla: 'El ECM derecho gira la cabeza hacia la izquierda.',
    raices: [
      ...abanico([-1.36, -1.5, -1.64], 0.52, -0.04, [1, 0, 0.2], [1.26, -1.16, 0.18], [[1.76, -1.08, 0.44], [2.25, -1.08, 0.6]], 0.02, 0.055),
      { desde: [0.5, -4.3, -0.04], dir: [1, 0, 0], pts: [[0.62, -3.2, -0.04], [0.74, -2.0, 0.02], [0.98, -1.45, 0.1], [1.26, -1.16, 0.18]], r: 0.045 },
      ...[-3.95, -3.45, -2.95, -2.5].map((y): Raiz => ({ desde: [0.5, y, -0.06], dir: [1, 0, 0], pts: [[0.63 + (y + 4.3) * 0.08, y + 0.18, -0.04]], r: 0.016 })),
    ],
  },
  {
    id: 'XII', nombre: 'Hipogloso', tipo: 'Motor', color: '#1098ad',
    emerge: 'Surco preolivar (entre la pirámide y la oliva), en una fila de raicillas.',
    sale: 'Conducto del hipogloso (condíleo anterior).',
    componentes: ['esg'],
    nucleos: ['n_hipogloso', 'f_hipogloso'],
    funcion: 'Músculos de la lengua (salvo el palatogloso, del X).',
    lesion: 'Al sacarla, la lengua se desvía hacia el lado lesionado; atrofia y fasciculaciones.',
    perla: 'La lengua «apunta» a la lesión de la motoneurona inferior.',
    raices: abanico([-0.45, -0.66, -0.87, -1.08, -1.29, -1.5], 0.36, 0.36, [0.4, 0, 1], [0.78, -1.32, 0.98], [[1.08, -1.62, 1.3], [1.36, -1.95, 1.6]], 0.022, 0.06),
  },
];

export const NERVIO: Record<ParId, Nervio> = Object.fromEntries(NERVIOS.map((n) => [n.id, n])) as Record<ParId, Nervio>;
