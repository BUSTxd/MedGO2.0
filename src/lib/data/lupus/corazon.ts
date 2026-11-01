// Capítulo 8 — Corazón, serosas, bazo y pulmón. Libman-Sacks, aterosclerosis
// acelerada, serositis (pleuritis, pericarditis), arterias peniciliares en hojas
// de cebolla, enfermedad intersticial e hipertensión pulmonar; todo explicado por
// complejos inmunes y antifosfolípidos. Guion §8.

import type { Parte } from './tipos';
import { L } from './colores';
import { NARRACION } from './narracion';
import { fondo, p } from './acciones';

/** En el teléfono el encuadre automático recortaría la ilustración: se ve siempre entera. */
const ENTERA = { at: 0, duration: 1000, tipo: 'camera', box: 'all' } as const;

const corazon: Parte = {
  id: 'corazon',
  numero: 8,
  tipo: 'Daño',
  nombre: 'Corazón, serosas, bazo y pulmón',
  nombreCorto: 'Corazón y serosas',
  lugar: 'Corazón, serosas, bazo, pulmón',
  color: L.dano,
  pregunta: '¿Qué hallazgo del bazo es casi patognomónico?',
  resumen: 'Libman-Sacks, aterosclerosis acelerada, pleuritis y pericarditis, hojas de cebolla en el bazo, enfermedad intersticial e hipertensión pulmonar.',
  fondo: 'valva',
  narracion: NARRACION[8],
  actores: {},
  pasos: [
    {
      id: 'co-0',
      orden: 0,
      titulo: 'Libman-Sacks',
      texto: 'La endocarditis de Libman-Sacks: pequeñas vegetaciones verrugosas, de 1 a 3 mm, en las valvas mitral y aórtica. Son estériles (endocarditis verrugosa no bacteriana), pueden estar a ambos lados de la valva y, aunque casi nunca dan síntomas, pueden soltar émbolos, sobre todo con antifosfolípidos.',
      claves: ['Libman-Sacks', 'estériles', 'ambos lados', 'émbolos'],
      profundiza: 'Están hechas de fibrina, plaquetas, inmunocomplejos y células inflamatorias. A diferencia de la endocarditis infecciosa (vegetaciones grandes y destructivas en la línea de cierre) y de la trombótica no bacteriana del cáncer (en la línea de cierre, sin inflamación), las de Libman-Sacks pueden estar a ambos lados de la valva.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        p('corazon', 1, 300, 1200),
        p('valva', 1, 3600, 1400),
        p('v1', 1, 4200, 1000),
        p('vegetaciones', 1, 6700, 4500),
        p('esteril', 1, 12300, 900),
        p('v3', 1, 18300, 1000),
        p('embolo', 1, 22500, 3000),
      ],
    },
    {
      id: 'co-1',
      orden: 1,
      titulo: 'Aterosclerosis acelerada',
      texto: 'Una de las principales causas de muerte en el lupus de larga evolución: la aterosclerosis coronaria acelerada. Los inmunocomplejos y la inflamación crónica dañan el endotelio; se suman los corticoides, la hipertensión y la enfermedad renal. Un dolor torácico en una mujer joven con lupus no se descarta por la edad.',
      claves: ['aterosclerosis coronaria acelerada', 'endotelio', 'no se descarta por la edad'],
      profundiza: 'Una mujer de 35 a 44 años con lupus tiene hasta 50 veces más riesgo de infarto que una de su edad sin lupus. Por eso el control de la presión, los lípidos, el tabaco y la dosis acumulada de corticoides es parte del tratamiento.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        fondo('coronaria'),
        p('arteria', 1, 300, 1200),
        p('kAt', 1, 4000, 1000),
        p('placaAt', 1, 9500, 6500),
        p('c1', 1, 9500, 1000), p('c2', 1, 11600, 1000), p('c3', 1, 13000, 1000), p('c4', 1, 14400, 1000),
        p('muj', 1, 16800, 1200),
      ],
    },
    {
      id: 'co-2',
      orden: 2,
      titulo: 'Serositis',
      texto: 'Las serosas son un blanco frecuente de los complejos: pleura y pericardio (serositis). La pleuritis da dolor torácico que aumenta al respirar, con o sin derrame; la pericarditis, dolor que mejora al inclinarse hacia adelante, con o sin derrame. La pericarditis aguda vale 6 puntos en los criterios.',
      claves: ['serositis', 'pleuritis', 'pericarditis', '6 puntos'],
      profundiza: 'El derrame del lupus es un exudado con glucosa normal (a diferencia del de la artritis reumatoide, con glucosa muy baja), y a veces con ANA en el líquido. El taponamiento es raro.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        fondo('torax'),
        p('torax', 1, 300, 1200),
        p('tx1', 1, 4900, 1000),
        p('pleuraI', 1, 6700, 1200), p('derrameP', 1, 8200, 2000),
        p('tx2', 1, 6900, 1200),
        p('pericardio', 1, 11600, 1200), p('derrameC', 1, 13000, 2000),
        p('tx3', 1, 11800, 1200),
        p('tx4', 1, 16900, 1000),
        p('tx5', 1, 21100, 800),
      ],
    },
    {
      id: 'co-3',
      orden: 3,
      titulo: 'El bazo: hojas de cebolla',
      texto: 'Un hallazgo casi de libro: las arterias peniciliares del bazo sufren una hiperplasia concéntrica del músculo liso y de la íntima; en el corte se ven capas y capas alrededor de la luz, como una cebolla. Si te muestran esa imagen del bazo, la respuesta es lupus.',
      claves: ['arterias peniciliares', 'hiperplasia concéntrica', 'hojas de cebolla'],
      profundiza: 'Robbins la describe como una lesión característica del lupus. El bazo puede además estar aumentado de tamaño (esplenomegalia moderada) con hiperplasia folicular y abundantes células plasmáticas.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        fondo('cebolla'),
        p('bazo', 1, 300, 1200),
        p('b1', 1, 4100, 1200),
        p('capasBazo', 1, 4400, 9000),
        p('b2', 1, 13600, 1000),
        p('b3', 1, 16300, 1000),
      ],
    },
    {
      id: 'co-4',
      orden: 4,
      titulo: 'El pulmón',
      texto: 'Puede aparecer una enfermedad pulmonar intersticial (disnea progresiva, tos seca, menor difusión del oxígeno) y una hipertensión pulmonar, por enfermedad de los vasos, daño del pulmón o tromboembolias (antifosfolípidos), que lleva a insuficiencia del ventrículo derecho.',
      claves: ['intersticial', 'hipertensión pulmonar', 'ventrículo derecho'],
      profundiza: 'Otras formas pulmonares: la neumonitis lúpica aguda (rara y grave), la hemorragia alveolar difusa (muy grave, a menudo con nefritis) y el «síndrome del pulmón encogido» (debilidad del diafragma). Siempre hay que descartar antes una infección.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        fondo('pulmon'),
        p('pulmones', 1, 300, 1200),
        p('q1', 1, 2200, 1000),
        p('intersticio', 1, 2800, 3500),
        p('q2', 1, 10700, 1000),
        p('hp', 1, 11200, 2500),
        p('q3', 1, 19500, 1000),
      ],
    },
    {
      id: 'co-5',
      orden: 5,
      titulo: 'Dos mecanismos lo explican',
      texto: 'Casi todo se explica con los dos mecanismos anteriores: complejos inmunes que se depositan en serosas, válvulas y vasos, y antifosfolípidos que favorecen la trombosis. Y ahora, el órgano que más define el pronóstico del lupus: el riñón.',
      claves: ['complejos inmunes', 'antifosfolípidos', 'el riñón'],
      profundiza: 'Los dos mecanismos se combinan: un paciente con antifosfolípidos puede tener a la vez trombosis en la válvula (vegetaciones), en los vasos pulmonares y en los capilares del riñón (microangiopatía trombótica), además de nefritis por complejos.',
      protagonistas: [],
      encuadre: 'all',
      acciones: [
        ENTERA,
        fondo('mecanismos'),
        p('r1', 1, 1000, 1400),
        p('r2', 1, 5000, 1200),
        p('r3', 1, 12600, 1000),
        p('r4', 1, 16300, 800),
      ],
    },
  ],
};

export default corazon;
