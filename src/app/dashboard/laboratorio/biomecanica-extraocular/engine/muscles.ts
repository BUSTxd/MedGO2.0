// Datos biomecánicos de los 6 músculos extraoculares del OJO IZQUIERDO (OI).
//
// Sistema de ejes cabeza-fijos (Three.js, mano derecha):
//   +X = temporal (izquierda del paciente) -X = nasal
//   +Y = superior                          -Y = inferior
//   +Z = anterior (eje visual en posición primaria; la córnea mira a +Z)
//
// Una ducción es una rotación del globo. Los EJES de rotación (regla de la mano
// derecha, ángulo positivo = contracción) que producen cada acción son:
//   Elevación  = rotar sobre (-1, 0, 0)      Depresión = (+1, 0, 0)
//   Aducción   = rotar sobre ( 0,-1, 0)      Abducción = ( 0,+1, 0)
//   Intorsión  = rotar sobre ( 0, 0,+1)      Extorsión = ( 0, 0,-1)
//
// El `axis` de cada músculo es el vector unitario resultante de componer su
// acción primaria + secundaria + terciaria con los pesos derivados de la
// geometría orbitaria (recto vertical: cos23°≈0.92 / sin23°≈0.39 repartido entre
// torsión y horizontal; oblicuos: plano funcional ≈51°). Verificado: rotar el
// globo sobre `axis` por un ángulo positivo reproduce exactamente la tabla de
// acciones de la especificación (ver verificación en el plan).

import * as THREE from 'three';

export type MuscleId = 'MR' | 'LR' | 'SR' | 'IR' | 'SO' | 'IO';

export interface Muscle {
  id: MuscleId;
  nombre: string;
  abrev: string;
  nervio: string;
  color: string;
  /** Eje de rotación unitario de la contracción (regla mano derecha, θ>0 = contrae). */
  axis: THREE.Vector3;
  /** Ángulo de ducción ilustrativo para el modo individual (rad). No fisiológico, didáctico. */
  maxAngle: number;
  /** Acciones para el panel (orden: primaria, secundaria, terciaria). */
  acciones: string[];
  /** Geometría para dibujar la malla (coords en unidades de escena; globo R≈1.2). */
  origen: THREE.Vector3;
  /** Inserción sobre la superficie del globo (cuelga del grupo que rota). */
  insercion: THREE.Vector3;
  /** Polea/tróclea intermedia (solo el oblicuo superior). */
  troclea?: THREE.Vector3;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const u = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize();

// Origen común de los rectos: anillo de Zinn en el ápex orbitario, posterior (-Z)
// y nasal (-X) respecto al centro del globo, a ~23° del eje visual.
const ZINN = v(-1.0, 0, -2.9);

export const MUSCLES: Record<MuscleId, Muscle> = {
  MR: {
    id: 'MR',
    nombre: 'Recto medial',
    abrev: 'MR',
    nervio: 'III par (división inferior)',
    color: '#3b9edd',
    axis: u(0, -1, 0), // aducción pura
    maxAngle: 0.62,
    acciones: ['Aducción'],
    origen: ZINN.clone(),
    insercion: v(-0.919, 0, 0.771),
  },
  LR: {
    id: 'LR',
    nombre: 'Recto lateral',
    abrev: 'LR',
    nervio: 'VI par (abducens)',
    color: '#2DC99A',
    axis: u(0, 1, 0), // abducción pura
    maxAngle: 0.62,
    acciones: ['Abducción'],
    origen: ZINN.clone(),
    insercion: v(0.919, 0, 0.771),
  },
  SR: {
    id: 'SR',
    nombre: 'Recto superior',
    abrev: 'SR',
    nervio: 'III par (división superior)',
    color: '#F5A623',
    // Elevación (-X, 0.92) + intorsión (+Z, 0.36) + aducción (-Y, 0.16)
    axis: u(-0.92, -0.16, 0.36),
    maxAngle: 0.55,
    acciones: ['Elevación', 'Intorsión', 'Aducción'],
    origen: ZINN.clone(),
    insercion: v(0, 0.919, 0.771),
  },
  IR: {
    id: 'IR',
    nombre: 'Recto inferior',
    abrev: 'IR',
    nervio: 'III par (división inferior)',
    color: '#E85B4A',
    // Depresión (+X, 0.92) + extorsión (-Z, 0.36) + aducción (-Y, 0.16)
    axis: u(0.92, -0.16, -0.36),
    maxAngle: 0.55,
    acciones: ['Depresión', 'Extorsión', 'Aducción'],
    origen: ZINN.clone(),
    insercion: v(0, -0.919, 0.771),
  },
  SO: {
    id: 'SO',
    nombre: 'Oblicuo superior',
    abrev: 'SO',
    nervio: 'IV par (troclear)',
    color: '#9b7bdf',
    // Intorsión (+Z, 0.84) + depresión (+X, 0.50) + abducción (+Y, 0.20)
    axis: u(0.5, 0.2, 0.84),
    maxAngle: 0.5,
    acciones: ['Intorsión', 'Depresión', 'Abducción'],
    origen: v(-1.0, 0.3, -2.9),
    troclea: v(-1.1, 1.5, 1.4), // polea anterosuperonasal
    insercion: v(0.659, 0.659, -0.755), // posterosuperotemporal, detrás del ecuador
  },
  IO: {
    id: 'IO',
    nombre: 'Oblicuo inferior',
    abrev: 'IO',
    nervio: 'III par (división inferior)',
    color: '#d65db1',
    // Extorsión (-Z, 0.84) + elevación (-X, 0.20) + abducción (+Y, 0.20)
    axis: u(-0.5, 0.2, -0.84),
    maxAngle: 0.5,
    acciones: ['Extorsión', 'Elevación', 'Abducción'],
    origen: v(-1.0, -1.4, 1.2), // suelo anteromedial de la órbita
    insercion: v(0.722, -0.602, -0.746), // posteroinferotemporal, detrás del ecuador
  },
};

export const MUSCLE_LIST: Muscle[] = ['MR', 'LR', 'SR', 'IR', 'SO', 'IO'].map(
  (id) => MUSCLES[id as MuscleId]
);
