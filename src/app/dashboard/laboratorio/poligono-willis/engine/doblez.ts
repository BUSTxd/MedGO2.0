// «Vista de atlas» ↔ «Posición real».
//
// Los atlas (Gray 519, OpenStax) dibujan el tronco del encéfalo TUMBADO en el
// plano de la base, como si se hubiera doblado hacia atrás: así caben en una
// lámina el polígono y el sistema vertebrobasilar. En el cuerpo, el tronco
// baja por el clivus (≈ 60° respecto a la base del cerebro) hasta el agujero
// magno y la médula sigue vertical por el cuello. Este módulo convierte la
// geometría de atlas (el modelo se escribe así) en la real, con un parámetro
// t ∈ [0, 1] que se anima.
//
// El tronco se trata como una tira que se curva a lo largo de su eje (que en
// el atlas corre hacia −y): dos bisagras curvas, la del clivus y la de la
// unión bulbomedular. Cada punto conserva su distancia al eje («h», hacia
// ventral = +z en el atlas) y gira con el ángulo local. El cerebelo no se
// curva: se traslada y gira como un sólido hasta quedar detrás del tronco y
// bajo los occipitales; las ramas que llegan a él (SCA, AICA, PICA) mezclan
// los dos movimientos según lo lejos que estén del tronco.
//
// Ejes como en geometria.ts: +x izquierda, +y anterior, +z inferior.

import * as THREE from 'three';

/** Estado compartido de la animación (la escena lo avanza en useFrame). */
export const DOBLEZ = {
  /** Valor aplicado este fotograma (con suavizado). */
  actual: 0,
  /** Avance lineal 0-1 (antes del suavizado). */
  avance: 0,
  /** Hacia dónde va: 0 atlas, 1 real. */
  objetivo: 0,
};

const Y0 = -2.2;   // donde empieza a doblarse (bajo el mesencéfalo, sobre la protuberancia)
const Z0 = 0;      // eje de referencia del tronco en el atlas
const BISAGRAS: Array<{ desde: number; largo: number; angulo: number }> = [
  { desde: 0, largo: 2.6, angulo: THREE.MathUtils.degToRad(60) },   // clivus
  { desde: 8.0, largo: 1.6, angulo: THREE.MathUtils.degToRad(30) }, // unión bulbomedular → vertical
];

/** Posición del eje y ángulo acumulado a la distancia s (con ángulos × t). */
function ejeEn(s: number, t: number): { y: number; z: number; phi: number } {
  let y = Y0;
  let z = Z0;
  let phi = 0;
  let pos = 0; // s ya recorrido
  const tramoRecto = (len: number) => {
    y -= len * Math.cos(phi);
    z += len * Math.sin(phi);
    pos += len;
  };
  for (const b of BISAGRAS) {
    if (s <= b.desde) { tramoRecto(s - pos); return { y, z, phi }; }
    tramoRecto(b.desde - pos);
    const ang = b.angulo * t;
    const usado = Math.min(s - b.desde, b.largo);
    if (ang < 1e-5) {
      tramoRecto(usado);
    } else {
      const R = b.largo / ang;
      const a1 = phi + usado / R;
      // Integral de (−cos φ, sin φ) a lo largo del arco.
      y -= R * (Math.sin(a1) - Math.sin(phi));
      z += R * (Math.cos(phi) - Math.cos(a1));
      phi = a1;
      pos += usado;
    }
    if (s < b.desde + b.largo) return { y, z, phi };
  }
  tramoRecto(s - pos);
  return { y, z, phi };
}

/** Rota un vector en el plano y-z: lo que apuntaba a −y pasa a apuntar a +z. */
function rotar(v: THREE.Vector3, phi: number) {
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const y = v.y * c + v.z * s;
  const z = -v.y * s + v.z * c;
  v.y = y;
  v.z = z;
}

/** Doblez del tronco: punto y normal (si se pasa) en el estado t. */
export function doblarTronco(p: THREE.Vector3, t: number, n?: THREE.Vector3) {
  const s = Y0 - p.y;
  if (s <= 0 || t <= 0) return;
  const h = p.z - Z0;
  const e = ejeEn(s, t);
  p.y = e.y + h * Math.sin(e.phi);
  p.z = e.z + h * Math.cos(e.phi);
  if (n) rotar(n, e.phi);
}

// Cerebelo: centro en el atlas → centro real, en la fosa posterior: detrás
// del bulbo y la protuberancia (≈ 3 cm por detrás del IV ventrículo) y bajo
// los lóbulos occipitales, separado de ellos por la tienda. Gira 35°.
const CEREBELO_ATLAS = new THREE.Vector3(0, -10.8, 0.7);
const CEREBELO_REAL = new THREE.Vector3(0, -10.4, 2.6);
const GIRO_CEREBELO = THREE.MathUtils.degToRad(35);

export function moverCerebelo(p: THREE.Vector3, t: number, n?: THREE.Vector3) {
  if (t <= 0) return;
  const phi = GIRO_CEREBELO * t;
  p.sub(CEREBELO_ATLAS);
  rotar(p, phi);
  p.add(new THREE.Vector3().lerpVectors(CEREBELO_ATLAS, CEREBELO_REAL, t));
  if (n) rotar(n, phi);
}

export type ModoDoblez = 'fijo' | 'tronco' | 'cerebelo' | 'rama';

const ss = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** Peso «cerebelo» de una rama cerebelosa: 0 junto al tronco, 1 en su destino. */
export const pesoRama = (x: number) => ss(1.7, 3.0, Math.abs(x));

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const nA = new THREE.Vector3();
const nB = new THREE.Vector3();

/** Lleva un punto (y su normal) del atlas al estado t según el modo. */
export function deformar(p: THREE.Vector3, t: number, modo: ModoDoblez, n?: THREE.Vector3) {
  if (modo === 'fijo' || t <= 0) return;
  if (modo === 'tronco') { doblarTronco(p, t, n); return; }
  if (modo === 'cerebelo') { moverCerebelo(p, t, n); return; }
  const w = pesoRama(p.x);
  tmpA.copy(p); tmpB.copy(p);
  if (n) { nA.copy(n); nB.copy(n); }
  doblarTronco(tmpA, t, n ? nA : undefined);
  moverCerebelo(tmpB, t, n ? nB : undefined);
  p.lerpVectors(tmpA, tmpB, w);
  if (n) n.lerpVectors(nA, nB, w).normalize();
}

/** Aplica la deformación a una geometría a partir de sus posiciones de atlas. */
export function aplicarDoblez(
  geo: THREE.BufferGeometry,
  orig: { p: Float32Array; n: Float32Array | null },
  t: number,
  modo: ModoDoblez,
) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute | undefined;
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.set(orig.p[i * 3], orig.p[i * 3 + 1], orig.p[i * 3 + 2]);
    if (orig.n && nor) {
      n.set(orig.n[i * 3], orig.n[i * 3 + 1], orig.n[i * 3 + 2]);
      deformar(p, t, modo, n);
      nor.setXYZ(i, n.x, n.y, n.z);
    } else {
      deformar(p, t, modo);
    }
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  pos.needsUpdate = true;
  if (nor) nor.needsUpdate = true;
}
