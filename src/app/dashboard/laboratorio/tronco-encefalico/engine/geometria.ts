// Geometría three.js del lab: la malla del tronco y del cerebelo (desde el campo
// de distancias), los núcleos y vías, los pares craneales y la lesión clínica.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mallar, type Malla } from './malla.ts';
import { campoTronco, campoCerebelo, refinarTronco, CENTRO_FOLIAS } from './forma.ts';
import { reflejar, type Campo, type Primitiva, type Vec } from './sdf.ts';
import type { Interior } from './interior.ts';
import type { Nervio } from './nervios.ts';

export type Lado = 'i' | 'd' | 'm';

/** Malla del campo → BufferGeometry con normales, oclusión y etiqueta por vértice. */
function aGeometria(m: Malla): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(m.pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(m.nor, 3));
  g.setAttribute('ao', new THREE.BufferAttribute(m.ao, 1));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(m.ao.length * 3).fill(1), 3));
  g.setIndex(new THREE.BufferAttribute(m.idx, 1));
  g.userData.etq = m.etq;
  g.userData.etiquetas = m.etiquetas;
  g.computeBoundingSphere();
  return g;
}

export interface ModeloTronco {
  geo: THREE.BufferGeometry;
  campo: Campo;
}

let cacheTronco: { ligero: boolean; m: ModeloTronco } | null = null;

/** El tronco (≈ 1 s en escritorio; con `ligero`, vóxel más grande para teléfonos). */
export function modeloTronco(ligero: boolean): ModeloTronco {
  if (cacheTronco && cacheTronco.ligero === ligero) return cacheTronco.m;
  const campo = campoTronco();
  const geo = aGeometria(mallar(campo, { h: ligero ? 0.045 : 0.034, refinar: refinarTronco }));
  cacheTronco = { ligero, m: { geo, campo } };
  return cacheTronco.m;
}

let cacheCerebelo: { ligero: boolean; g: THREE.BufferGeometry } | null = null;

/**
 * Cerebelo con folias. Las folias y fisuras se ordenan alrededor de un eje
 * transversal junto al hilio (por donde entran los pedúnculos): por detrás se
 * ven como líneas horizontales, por arriba como líneas transversas y por el
 * lado convergen hacia el pedúnculo cerebeloso medio, como en la pieza.
 */
export function geometriaCerebelo(ligero: boolean): THREE.BufferGeometry {
  if (cacheCerebelo && cacheCerebelo.ligero === ligero) return cacheCerebelo.g;
  const m = mallar(campoCerebelo(), { h: ligero ? 0.07 : 0.05 });
  const [yc, zc] = CENTRO_FOLIAS;
  const n = m.ao.length;
  for (let i = 0; i < n; i++) {
    const x = m.pos[i * 3], y = m.pos[i * 3 + 1], z = m.pos[i * 3 + 2];
    // Ángulo alrededor del eje: 0 = hacia atrás, positivo hacia arriba. Hacia
    // los lados el eje se adelanta, así las folias se curvan y convergen en
    // el pedúnculo medio en vez de salir en abanico.
    const zcx = zc + 0.55 * Math.abs(x);
    const rho = Math.hypot(y - yc, z - zcx);
    const ang = Math.atan2(y - yc, -(z - zcx));
    const cerca = Math.min(1, Math.max(0, (rho - 0.9) / 0.9));
    // Folias: arcos concéntricos al eje (paralelos al borde del hemisferio).
    const fol = Math.sin(rho * 21 + 0.3 * Math.sin(x * 1.3)) * cerca;
    // Fisura horizontal (por detrás y a los lados) y primaria (cara superior).
    const fisura = (Math.exp(-((ang + 0.05) ** 2) / 0.0012) + 0.8 * Math.exp(-((ang - 0.95) ** 2) / 0.0012)) * cerca;
    const hundir = 0.026 * fol - 0.08 * fisura;
    for (let c = 0; c < 3; c++) m.pos[i * 3 + c] += m.nor[i * 3 + c] * hundir;
    m.ao[i] *= Math.max(0.2, 0.8 + 0.2 * (0.5 + 0.5 * fol) - 0.45 * fisura);
  }
  const g = aGeometria(m);
  g.computeVertexNormals();
  cacheCerebelo = { ligero, g };
  return g;
}

// ── Tubos y elipsoides (núcleos, vías, nervios, lesión) ─────────────────────

/** Tubo a lo largo de una curva suave, con radio variable y extremos redondeados. */
export function tuboVariable(pts: Vec[], radios: number[], lados = 10, aplanar?: { eje: Vec; f: number }): THREE.BufferGeometry {
  const v = pts.map((p) => new THREE.Vector3(...p));
  const curva = v.length > 2 ? new THREE.CatmullRomCurve3(v, false, 'centripetal') : new THREE.LineCurve3(v[0], v[1]);
  const largo = curva.getLength();
  const segs = Math.max(6, Math.round(largo * 28));
  const marcos = curva.computeFrenetFrames(segs, false);
  // Radio en cada punto de la curva: interpolado por longitud entre los puntos dados.
  const acum = [0];
  for (let i = 1; i < v.length; i++) acum.push(acum[i - 1] + v[i].distanceTo(v[i - 1]));
  const radioEn = (u: number) => {
    const s = u * acum[acum.length - 1];
    let i = 0;
    while (i < acum.length - 2 && acum[i + 1] < s) i++;
    const t = (s - acum[i]) / ((acum[i + 1] - acum[i]) || 1);
    return radios[i] + (radios[Math.min(i + 1, radios.length - 1)] - radios[i]) * Math.min(Math.max(t, 0), 1);
  };
  const eje = aplanar ? new THREE.Vector3(...aplanar.eje).normalize() : null;
  const pos: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  for (let s = 0; s <= segs; s++) {
    const u = s / segs;
    curva.getPointAt(u, p);
    const r = radioEn(u);
    for (let k = 0; k < lados; k++) {
      const a = (k / lados) * Math.PI * 2;
      nrm.copy(marcos.normals[s]).multiplyScalar(Math.cos(a)).addScaledVector(marcos.binormals[s], Math.sin(a));
      if (eje) {
        const c = nrm.dot(eje);
        nrm.addScaledVector(eje, c * (aplanar!.f - 1));
      }
      pos.push(p.x + nrm.x * r, p.y + nrm.y * r, p.z + nrm.z * r);
    }
  }
  for (let s = 0; s < segs; s++) {
    for (let k = 0; k < lados; k++) {
      const a = s * lados + k, b = s * lados + ((k + 1) % lados);
      idx.push(a, a + lados, b, b, a + lados, b + lados);
    }
  }
  // Tapas: un punto en cada extremo, algo salido, para redondear.
  for (const [s, dirSign] of [[0, -1], [segs, 1]] as const) {
    curva.getPointAt(s / segs, p);
    const t = curva.getTangentAt(s / segs).multiplyScalar(dirSign * radioEn(s / segs) * 0.6);
    const centro = pos.length / 3;
    pos.push(p.x + t.x, p.y + t.y, p.z + t.z);
    for (let k = 0; k < lados; k++) {
      const a = s * lados + k, b = s * lados + ((k + 1) % lados);
      if (dirSign < 0) idx.push(centro, b, a); else idx.push(centro, a, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function elipsoide(c: Vec, r: Vec, giro?: Vec, seg = 20): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7));
  g.scale(r[0], r[1], r[2]);
  if (giro) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(giro[0], giro[1], giro[2], 'XYZ')));
  g.translate(c[0], c[1], c[2]);
  return g;
}

/** Geometría de una lista de primitivas (solo elipsoides y tubos). */
export function geometriaPrimitivas(prims: Primitiva[], lados = 12): THREE.BufferGeometry {
  const partes: THREE.BufferGeometry[] = [];
  for (const p of prims) {
    if (p.tipo === 'elipsoide') partes.push(elipsoide(p.c, p.r, p.giro).toNonIndexed());
    else if (p.tipo === 'tubo') partes.push(tuboVariable(p.pts, p.r, lados, p.aplanar).toNonIndexed());
  }
  partes.forEach((g) => { g.deleteAttribute('uv'); });
  const unido = partes.length === 1 ? partes[0] : mergeGeometries(partes, false)!;
  unido.computeBoundingSphere();
  return unido;
}

/** Núcleo o vía de un lado. */
export function geometriaInterior(x: Interior, lado: Lado): THREE.BufferGeometry {
  return geometriaPrimitivas(lado === 'd' ? x.prims.map(reflejar) : x.prims, x.tipo === 'via' || x.tipo === 'fibras' ? 8 : 14);
}

/** Lleva un punto de dentro del tronco a su superficie, avanzando por `dir`. */
function aSuperficie(campo: Campo, desde: Vec, dir: Vec): Vec {
  const l = Math.hypot(...dir);
  if (!l) return desde;
  const d: Vec = [dir[0] / l, dir[1] / l, dir[2] / l];
  let t = 0;
  for (let i = 0; i < 200; i++) {
    const p: Vec = [desde[0] + d[0] * t, desde[1] + d[1] * t, desde[2] + d[2] * t];
    const v = campo.d(...p);
    if (v >= -0.005) return [p[0] - d[0] * 0.02, p[1] - d[1] * 0.02, p[2] - d[2] * 0.02];
    t += Math.max(0.005, -v * 0.8);
  }
  return desde;
}

/** Un par craneal de un lado: raicillas y tronco nervioso en una sola geometría. */
export function geometriaNervio(n: Nervio, lado: 'i' | 'd', campo: Campo): THREE.BufferGeometry {
  const s = lado === 'd' ? -1 : 1;
  const partes = n.raices.map((r) => {
    const inicio = aSuperficie(campo, r.desde, r.dir);
    const pts: Vec[] = [inicio, ...r.pts].map((p) => [p[0] * s, p[1], p[2]] as Vec);
    const radios = pts.map((_, i) => (i === 0 ? r.r * 0.85 : r.r));
    return tuboVariable(pts, radios, 8).toNonIndexed();
  });
  const g = mergeGeometries(partes, false)!;
  g.computeBoundingSphere();
  return g;
}

/** Punto medio del tronco nervioso (para el rótulo). */
export function puntaNervio(n: Nervio, lado: 'i' | 'd'): THREE.Vector3 {
  const ult = n.raices[n.raices.length - 1];
  const p = ult.pts[ult.pts.length - 1];
  return new THREE.Vector3(p[0] * (lado === 'd' ? -1 : 1), p[1], p[2]);
}

/** Centro aproximado de una estructura interior (para encuadrar y rotular). */
export function centroPrimitivas(prims: Primitiva[], lado: Lado): THREE.Vector3 {
  const c = new THREE.Vector3();
  let n = 0;
  for (const p of prims) {
    if (p.tipo === 'elipsoide') { c.add(new THREE.Vector3(...p.c)); n++; }
    else if (p.tipo === 'tubo') { for (const q of p.pts) { c.add(new THREE.Vector3(...q)); n++; } }
  }
  c.divideScalar(Math.max(n, 1));
  if (lado === 'd') c.x = -c.x;
  return c;
}
