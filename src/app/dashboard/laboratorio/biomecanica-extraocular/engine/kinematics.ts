// Cinemática del globo ocular con cuaterniones.
//
// La orientación del globo es un THREE.Quaternion; la posición primaria es la
// identidad. El modo individual rota sobre el eje de un músculo; el modo grupo
// produce una ducción "pura" (sinergia) o lleva el ojo a una posición cardinal
// del patrón en H. La escena interpola el cuaternión actual hacia el objetivo
// con un amortiguado exponencial (frame-rate independiente).

import * as THREE from 'three';
import { MUSCLES, MUSCLE_LIST, type Muscle, type MuscleId } from './muscles';

const IDENTITY = new THREE.Quaternion();

/** Objetivo cuando se mantiene presionado un músculo (t∈[0,1] = grado de contracción). */
export function quatFromMuscle(muscle: Muscle, t: number): THREE.Quaternion {
  return new THREE.Quaternion().setFromAxisAngle(muscle.axis, muscle.maxAngle * t);
}

/** Interpola `current` hacia `target` con amortiguado exponencial. Muta `current`. */
export function dampQuaternion(
  current: THREE.Quaternion,
  target: THREE.Quaternion,
  lambda: number,
  dt: number
): void {
  const alpha = 1 - Math.exp(-lambda * dt);
  current.slerp(target, alpha);
}

// ── Grupos: sinergias (vector puro) ──────────────────────────────────────────
// Cada par agonista+sinergista cancela sus acciones secundarias y deja una
// ducción pura sobre un eje cardinal.

export interface SynergyGroup {
  id: string;
  label: string;
  members: MuscleId[];
  axis: THREE.Vector3; // eje de la ducción pura resultante
  angle: number;
  descripcion: string;
}

const ax = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const SYNERGIES: SynergyGroup[] = [
  { id: 'elevacion', label: 'Elevación', members: ['SR', 'IO'], axis: ax(-1, 0, 0), angle: 0.5,
    descripcion: 'SR + IO: la aducción/intorsión del SR cancela la abducción/extorsión del IO → elevación pura.' },
  { id: 'depresion', label: 'Depresión', members: ['IR', 'SO'], axis: ax(1, 0, 0), angle: 0.5,
    descripcion: 'IR + SO: la aducción/extorsión del IR cancela la abducción/intorsión del SO → depresión pura.' },
  { id: 'aduccion', label: 'Aducción', members: ['MR'], axis: ax(0, -1, 0), angle: 0.55,
    descripcion: 'MR: aductor puro en el plano horizontal.' },
  { id: 'abduccion', label: 'Abducción', members: ['LR'], axis: ax(0, 1, 0), angle: 0.55,
    descripcion: 'LR: abductor puro en el plano horizontal.' },
  { id: 'intorsion', label: 'Intorsión', members: ['SR', 'SO'], axis: ax(0, 0, 1), angle: 0.5,
    descripcion: 'SR + SO: sus componentes verticales (elevación/depresión) se cancelan → intorsión pura.' },
  { id: 'extorsion', label: 'Extorsión', members: ['IR', 'IO'], axis: ax(0, 0, -1), angle: 0.5,
    descripcion: 'IR + IO: sus componentes verticales se cancelan → extorsión pura.' },
];

export function quatFromSynergy(group: SynergyGroup): THREE.Quaternion {
  return new THREE.Quaternion().setFromAxisAngle(group.axis, group.angle);
}

// ── Grupos: posiciones cardinales (patrón en H / campos de acción) ───────────
// El ojo va a la mirada diagnóstica. En las posiciones OBLICUAS se contrae más de
// un músculo: el `muscle` diagnóstico (recto/oblicuo vertical que se evalúa ahí,
// porque queda alineado como elevador/depresor puro) MÁS el recto horizontal
// `coactive` que abduce/aduce el ojo para llevarlo a esa mirada. En las dos
// posiciones puramente horizontales solo actúa el recto horizontal.

export interface CardinalPosition {
  id: string;
  label: string;
  /** Músculo que se EVALÚA (aislado) en este campo de acción. */
  muscle: MuscleId;
  /** Recto horizontal co-agonista que posiciona el ojo (solo posiciones oblicuas). */
  coactive?: MuscleId;
  /** Frase didáctica del rol del co-agonista. */
  coactiveRol?: string;
  yaw: number; // + = abducción (sobre +Y)
  pitch: number; // + = elevación (sobre -X)
}

export const CARDINALS: CardinalPosition[] = [
  { id: 'up-out', label: 'Arriba y afuera', muscle: 'SR', coactive: 'LR', coactiveRol: 'abduce el ojo para alinear el SR', yaw: 0.5, pitch: 0.5 },
  { id: 'up-in', label: 'Arriba y adentro', muscle: 'IO', coactive: 'MR', coactiveRol: 'aduce el ojo, mirada en la que el IO eleva', yaw: -0.5, pitch: 0.5 },
  { id: 'out', label: 'Afuera', muscle: 'LR', yaw: 0.62, pitch: 0 },
  { id: 'in', label: 'Adentro', muscle: 'MR', yaw: -0.62, pitch: 0 },
  { id: 'down-out', label: 'Abajo y afuera', muscle: 'IR', coactive: 'LR', coactiveRol: 'abduce el ojo para alinear el IR', yaw: 0.5, pitch: -0.5 },
  { id: 'down-in', label: 'Abajo y adentro', muscle: 'SO', coactive: 'MR', coactiveRol: 'aduce el ojo, mirada en la que el SO deprime', yaw: -0.5, pitch: -0.5 },
];

const Y_AXIS = new THREE.Vector3(0, 1, 0);
const NEG_X_AXIS = new THREE.Vector3(-1, 0, 0);

export function quatFromCardinal(pos: CardinalPosition): THREE.Quaternion {
  const qYaw = new THREE.Quaternion().setFromAxisAngle(Y_AXIS, pos.yaw);
  const qPitch = new THREE.Quaternion().setFromAxisAngle(NEG_X_AXIS, pos.pitch);
  return qYaw.multiply(qPitch);
}

export { IDENTITY, MUSCLES, MUSCLE_LIST };
