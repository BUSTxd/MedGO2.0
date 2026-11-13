// Geometría de la médula espinal completa (vista «Médula»), sin React.
//
// Eje Y vertical (Y+ craneal), Z+ dorsal, X lateral. El cordón es una
// superficie por anillos: cada anillo tiene la forma ovalada del corte de su
// nivel (semiancho = perfil de anatomy.ts, semialto = la proporción ry del
// corte calcado de Gray 666), con la fisura media anterior y el surco medio
// posterior como hendiduras reales. De cada segmento salen sus raicillas
// dorsales y ventrales, que se juntan en la raíz, el ganglio de la raíz dorsal
// y el nervio espinal; las lumbares, sacras y la coccígea bajan dentro del saco
// dural y forman la cauda equina.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { cordRadiusAt, CORD_TOP, CONUS_TIP, LEVELS, REGIONS, type LevelId } from './anatomy.ts';

/** Fin del saco dural (nivel de S2) y punta del filum terminal (cóccix). */
const SACO_FIN = -7.05;
export const COXIS = -7.75;

// ── Forma del cordón ─────────────────────────────────────────────────────────

/** Proporción alto/ancho del corte a cada altura (de los cortes calcados). */
const ASPECTO: Array<[number, number]> = [
  [CORD_TOP, 0.8],
  [4.1, LEVELS.cervical.corte.ry],
  [0.7, LEVELS.toracico.corte.ry],
  [-2.4, LEVELS.lumbar.corte.ry],
  [-4.0, LEVELS.sacro.corte.ry],
  [CONUS_TIP, 0.95],
];

function aspectoAt(y: number): number {
  if (y >= ASPECTO[0][0]) return ASPECTO[0][1];
  for (let i = 0; i < ASPECTO.length - 1; i++) {
    const [y0, a0] = ASPECTO[i];
    const [y1, a1] = ASPECTO[i + 1];
    if (y <= y0 && y >= y1) return a0 + ((a1 - a0) * (y0 - y)) / (y0 - y1);
  }
  return ASPECTO[ASPECTO.length - 1][1];
}

/** Ángulos (desde dorsal) de los surcos laterales donde entran y salen las raicillas. */
const SURCO_DORSAL = 0.62;
const SURCO_VENTRAL = Math.PI - 0.78;

const gauss = (d: number, w: number) => Math.exp(-(d / w) * (d / w));

/**
 * Punto de la superficie del cordón a la altura y y el ángulo θ (desde dorsal,
 * horario visto desde arriba hacia +X). Incluye fisura y surcos.
 */
function superficie(y: number, theta: number, extra = 0): THREE.Vector3 {
  const a = Math.max(cordRadiusAt(y), 0.012) + extra;
  const b = a * aspectoAt(y);
  // Superelipse suave (n ≈ 2,3): algo más «cuadrada» que una elipse.
  const s = Math.sin(theta);
  const c = Math.cos(theta);
  const n = 2.3;
  const r = 1 / Math.pow(Math.pow(Math.abs(s), n) + Math.pow(Math.abs(c), n), 1 / n);
  let x = a * r * s;
  let z = b * r * c;
  // Distancia angular a la línea media dorsal (0) y ventral (π).
  const t = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const dDor = Math.min(t, 2 * Math.PI - t);
  const dVen = Math.abs(t - Math.PI);
  const dSur = Math.min(Math.abs(dDor - SURCO_DORSAL), Math.abs(dVen - (Math.PI - SURCO_VENTRAL)));
  const hund =
    0.06 * gauss(dDor, 0.07)        // surco medio posterior
    + 0.24 * gauss(dVen, 0.06)      // fisura media anterior, profunda
    + 0.025 * gauss(dSur, 0.08);    // surcos posterolateral y anterolateral
  x *= 1 - hund;
  z *= 1 - hund;
  return new THREE.Vector3(x, y, z);
}

const ANILLO = 128;
const PASO_Y = 0.05;

/** Superficie del cordón: anillos de CORD_TOP al cono, con tapa arriba y punta abajo. */
export function geometriaCordon(): THREE.BufferGeometry {
  const pos: number[] = [];
  const thetas: number[] = []; // ángulo de cada vértice, para el color
  const idx: number[] = [];
  const ys: number[] = [];
  // Tapa craneal abovedada (el corte a la altura del foramen magno).
  const domo = [0.05, 0.035, 0.018];
  for (const d of domo) ys.push(CORD_TOP + d);
  for (let y = CORD_TOP; y > CONUS_TIP; y -= PASO_Y) ys.push(y);
  ys.push(CONUS_TIP);
  const nDomo = domo.length;

  ys.forEach((y, k) => {
    // En el domo el anillo se encoge hacia el centro.
    const encoge = k < nDomo ? Math.sqrt(1 - Math.pow((nDomo - k) / (nDomo + 0.6), 2)) : 1;
    for (let i = 0; i < ANILLO; i++) {
      const th = (i / ANILLO) * Math.PI * 2;
      const p = superficie(Math.min(y, CORD_TOP), th);
      pos.push(p.x * encoge, y, p.z * encoge);
      thetas.push(th);
    }
  });
  // Polo superior y punta del cono.
  const polo = pos.length / 3;
  pos.push(0, CORD_TOP + 0.06, 0); thetas.push(0);
  const punta = pos.length / 3;
  pos.push(0, CONUS_TIP - 0.03, 0); thetas.push(0);

  for (let k = 0; k < ys.length - 1; k++) {
    for (let i = 0; i < ANILLO; i++) {
      const a = k * ANILLO + i;
      const b = k * ANILLO + ((i + 1) % ANILLO);
      const c = (k + 1) * ANILLO + i;
      const d = (k + 1) * ANILLO + ((i + 1) % ANILLO);
      idx.push(a, c, b, b, c, d);
    }
  }
  for (let i = 0; i < ANILLO; i++) idx.push(polo, i, (i + 1) % ANILLO);
  const ult = (ys.length - 1) * ANILLO;
  for (let i = 0; i < ANILLO; i++) idx.push(punta, ult + ((i + 1) % ANILLO), ult + i);

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('theta', new THREE.Float32BufferAttribute(thetas, 1));
  g.setAttribute('color', new THREE.Float32BufferAttribute(new Array(pos.length).fill(1), 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Región (nivel) a la que pertenece una altura del cordón. */
export function regionEnY(y: number): LevelId | null {
  for (const r of REGIONS) if (y <= r.yHi + 0.06 && y >= r.yLo) return r.id;
  return null;
}

const COLOR_TEJIDO = new THREE.Color('#ead6c8');
const COLOR_LUZ = new THREE.Color('#ffe08a');

/** Tramo del cordón iluminado (por ejemplo, el que ocupa un núcleo). */
export interface Tramo { yHi: number; yLo: number }
const COLOR_VASO = new THREE.Color('#c98b84');

/**
 * Pinta el cordón: color de tejido con un leve moteado y vasos piales
 * longitudinales; la región elegida y la señalada se tiñen con su color.
 */
export function colorearCordon(
  g: THREE.BufferGeometry,
  elegida: LevelId | null,
  senalada: LevelId | null,
  luz: Tramo | null = null,
) {
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const th = g.getAttribute('theta') as THREE.BufferAttribute;
  const col = g.getAttribute('color') as THREE.BufferAttribute;
  const tintes = new Map<LevelId, THREE.Color>(REGIONS.map((r) => [r.id, new THREE.Color(r.color)]));
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = th.getX(i);
    c.copy(COLOR_TEJIDO);
    // Moteado suave y vasos piales que serpentean a lo largo.
    const mot = 1 + 0.035 * Math.sin(t * 7 + y * 3.1) * Math.cos(y * 9.7 + t * 2);
    c.multiplyScalar(mot);
    const vaso = Math.pow(Math.abs(Math.sin(t * 6 + 0.5 * Math.sin(y * 2.3))), 60);
    c.lerp(COLOR_VASO, 0.45 * vaso);
    // Tinte de la región, que se desvanece en sus bordes (sin corte duro).
    for (const r of REGIONS) {
      const peso = r.id === elegida ? 0.32 : r.id === senalada ? 0.18 : 0;
      if (!peso) continue;
      const borde = Math.min(y - r.yLo, r.yHi + 0.06 - y);
      const f = Math.min(Math.max((borde + 0.08) / 0.24, 0), 1);
      if (f > 0) c.lerp(tintes.get(r.id)!, peso * f * f * (3 - 2 * f));
    }
    // Tramo iluminado: tono cálido y más claro, con bordes suaves.
    if (luz) {
      const borde = Math.min(y - luz.yLo, luz.yHi - y);
      const f = Math.min(Math.max((borde + 0.05) / 0.3, 0), 1);
      if (f > 0) c.lerp(COLOR_LUZ, 0.38 * f * f * (3 - 2 * f));
    }
    col.setXYZ(i, c.r, c.g, c.b);
  }
  col.needsUpdate = true;
}

// ── Nervios espinales ────────────────────────────────────────────────────────

interface Segmento {
  nombre: string;
  /** Tramo del cordón que ocupa (y0 craneal, y1 caudal). */
  y0: number;
  y1: number;
  /** Altura del agujero por el que sale (más abajo cuanto más caudal). */
  salida: number;
  /** Grosor relativo (más gruesos en las intumescencias). */
  grosor: number;
  /** Posición lateral de su tramo descendente dentro del saco (cauda equina). */
  carril: number;
}

function segmentos(): Segmento[] {
  const out: Segmento[] = [];
  const tramo = (pref: string, n: number, yHi: number, yLo: number, desde = 1) => {
    const h = (yHi - yLo) / n;
    return Array.from({ length: n }, (_, i) => ({ nombre: `${pref}${i + desde}`, y0: yHi - h * i, y1: yHi - h * (i + 1) }));
  };
  const cerv = tramo('C', 8, 5.0, 3.0);
  const tor = tramo('T', 12, 3.0, -1.6);
  const lum = tramo('L', 5, -1.6, -3.4);
  const sac = [...tramo('S', 5, -3.4, -4.35), { nombre: 'Co', y0: -4.35, y1: -4.55 }];
  const SAL_L = [-4.45, -4.95, -5.45, -5.95, -6.4];
  const SAL_S = [-6.72, -6.95, -7.15, -7.32, -7.47, -7.62];
  cerv.forEach((s, i) => out.push({ ...s, salida: (s.y0 + s.y1) / 2 - 0.1 - i * 0.015, grosor: i >= 4 ? 1.2 : 1, carril: 0 }));
  tor.forEach((s, i) => out.push({ ...s, salida: 2.6 - i * 0.6, grosor: i === 0 ? 1.1 : 0.78, carril: 0 }));
  lum.forEach((s, i) => out.push({ ...s, salida: SAL_L[i], grosor: i >= 1 ? 1.2 : 1, carril: 0.86 - i * 0.03 }));
  sac.forEach((s, i) => out.push({ ...s, salida: SAL_S[i], grosor: i <= 2 ? 1.05 - i * 0.12 : 0.6, carril: 0.66 - i * 0.08 }));
  return out;
}

/** Alturas que ocupan los segmentos de `desde` a `hasta` (p. ej. 'C8' a 'L2'). */
export function tramoSegmentos(desde: string, hasta: string): Tramo | null {
  const segs = segmentos();
  const a = segs.find((x) => x.nombre === desde);
  const b = segs.find((x) => x.nombre === hasta);
  if (!a || !b) return null;
  return { yHi: Math.max(a.y0, b.y0), yLo: Math.min(a.y1, b.y1) };
}

/**
 * Funda fina sobre el tramo iluminado: con mezcla aditiva da el halo de luz.
 * Sigue la forma del cordón (fisura y surcos incluidos) un poco por fuera.
 */
export function geometriaTramo(t: Tramo): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const yHi = Math.min(t.yHi, CORD_TOP);
  const yLo = Math.max(t.yLo, CONUS_TIP + 0.05);
  const n = Math.max(2, Math.ceil((yHi - yLo) / PASO_Y));
  const M = 64;
  const col: number[] = [];
  const RAMPA = 0.3; // los extremos se apagan poco a poco
  for (let k = 0; k <= n; k++) {
    const y = yHi - ((yHi - yLo) * k) / n;
    const borde = Math.min(yHi - y, y - yLo);
    const f = Math.min(borde / RAMPA, 1);
    const luz = f * f * (3 - 2 * f);
    for (let i = 0; i < M; i++) {
      const p = superficie(y, (i / M) * Math.PI * 2, 0.035);
      pos.push(p.x, p.y, p.z);
      col.push(luz, luz, luz); // con mezcla aditiva, negro = sin luz
    }
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < M; i++) {
      const a = k * M + i;
      const b = k * M + ((i + 1) % M);
      idx.push(a, a + M, b, b, a + M, b + M);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function tubo(pts: THREE.Vector3[], radio: number, segs: number, lados = 6): THREE.BufferGeometry {
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  return new THREE.TubeGeometry(curva, segs, radio, lados, false);
}

/** Raicillas, raíces, ganglios, nervios y filum terminal, ya unidos por material. */
export function geometriaNervios(): { raices: THREE.BufferGeometry; ganglios: THREE.BufferGeometry } {
  const raices: THREE.BufferGeometry[] = [];
  const ganglios: THREE.BufferGeometry[] = [];

  for (const s of segmentos()) {
    const ym = (s.y0 + s.y1) / 2;
    const baja = ym - s.salida;
    const cauda = s.carril > 0; // lumbares, sacras y coccígea
    for (const lado of [-1, 1] as const) {
      const ang = (th: number) => (lado > 0 ? th : 2 * Math.PI - th);
      const xG = lado * 1.3;
      const G = new THREE.Vector3(xG, s.salida + 0.03, 0.1);          // ganglio
      const V = new THREE.Vector3(lado * 1.34, s.salida - 0.03, -0.07); // fin de la raíz ventral
      const g = s.grosor;

      for (const [theta, nRaicillas, zCarril, fin, radio] of [
        [SURCO_DORSAL, 4, 0.24, G, 0.03],
        [SURCO_VENTRAL, 3, -0.2, V, 0.026],
      ] as const) {
        // Punto donde convergen las raicillas, algo fuera del cordón.
        const C = superficie(ym - Math.min(baja, 0.4) * 0.12, ang(theta), 0.13);
        // Raicillas en abanico a lo largo del segmento.
        for (let k = 0; k < nRaicillas; k++) {
          const y = s.y0 + ((k + 0.5) / nRaicillas) * (s.y1 - s.y0);
          const P = superficie(y, ang(theta), -0.004);
          const M = superficie((y + C.y) / 2, ang(theta), 0.06);
          raices.push(tubo([P, M, C], 0.011 * g, 6, 5));
        }
        // Raíz: del punto de convergencia al ganglio (dorsal) o junto a él (ventral).
        const pts = [C];
        if (cauda) {
          const x = lado * (s.carril + (theta === SURCO_VENTRAL ? -0.05 : 0.04));
          pts.push(new THREE.Vector3(x, C.y - 0.25, zCarril * 0.8));
          pts.push(new THREE.Vector3(x, (C.y + fin.y) / 2, zCarril));
          pts.push(new THREE.Vector3(x, fin.y + 0.3, zCarril));
          pts.push(new THREE.Vector3(lado * 1.05, fin.y + 0.06, fin.z));
        } else if (baja > 0.6) {
          // Torácicas: bajan pegadas al cordón antes de salir.
          let rMax = 0;
          for (let y = s.salida; y <= ym; y += 0.1) rMax = Math.max(rMax, cordRadiusAt(y));
          const x = lado * (rMax + 0.16);
          pts.push(new THREE.Vector3(x, C.y - baja * 0.35, C.z * 0.8));
          pts.push(new THREE.Vector3(lado * 0.98, fin.y + 0.12, fin.z));
        } else {
          pts.push(C.clone().lerp(fin, 0.5).add(new THREE.Vector3(0, -0.04, 0)));
        }
        pts.push(fin);
        const largo = pts.reduce((acc, p, i) => (i ? acc + p.distanceTo(pts[i - 1]) : 0), 0);
        raices.push(tubo(pts, radio * g, Math.max(10, Math.round(largo * 14)), 7));
      }

      // Ganglio de la raíz dorsal: ovoide orientado hacia fuera.
      const gang = new THREE.SphereGeometry(1, 14, 10);
      gang.scale(0.095 * g, 0.06 * g, 0.065 * g);
      gang.translate(G.x, G.y, G.z);
      ganglios.push(gang);

      // Nervio espinal: nace donde se juntan raíz dorsal y ventral y sale.
      const N0 = new THREE.Vector3(lado * 1.36, s.salida - 0.01, 0.02);
      const N1 = new THREE.Vector3(lado * 1.6, s.salida - 0.07, -0.02);
      const N2 = new THREE.Vector3(lado * 1.92, s.salida - 0.2, -0.08);
      raices.push(tubo([N0, N1, N2], 0.05 * g, 10, 8));
    }
  }

  // Filum terminal: del vértice del cono al cóccix, con una leve ondulación.
  const filum: THREE.Vector3[] = [];
  for (let i = 0; i <= 12; i++) {
    const y = CONUS_TIP - 0.02 + ((COXIS - CONUS_TIP) * i) / 12;
    filum.push(new THREE.Vector3(0.015 * Math.sin(i * 1.3), y, 0.01 * Math.cos(i)));
  }
  raices.push(tubo(filum, 0.014, 40, 6));

  return { raices: mergeGeometries(raices)!, ganglios: mergeGeometries(ganglios)! };
}

// ── Arterias espinales ───────────────────────────────────────────────────────

/** Arteria espinal anterior (en la fisura) y las dos posteriores (surcos posterolaterales). */
export function geometriaArterias(): THREE.BufferGeometry {
  const lineas: THREE.BufferGeometry[] = [];
  const trazo = (theta: number, radio: number, extra: number, fase: number) => {
    const pts: THREE.Vector3[] = [];
    for (let y = CORD_TOP; y >= CONUS_TIP + 0.15; y -= 0.12) {
      const p = superficie(y, theta + 0.06 * Math.sin(y * 4.2 + fase) + 0.025 * Math.sin(y * 11 + fase * 2), extra);
      pts.push(p);
    }
    lineas.push(tubo(pts, radio, pts.length * 3, 6));
  };
  // La anterior va sobre la fisura (θ = π), apoyada en sus labios.
  const ant: THREE.Vector3[] = [];
  for (let y = CORD_TOP; y >= CONUS_TIP + 0.15; y -= 0.12) {
    const b = Math.max(cordRadiusAt(y), 0.02) * aspectoAt(y);
    ant.push(new THREE.Vector3(0.012 * Math.sin(y * 3), y, -(b + 0.012)));
  }
  lineas.push(tubo(ant, 0.02, ant.length * 3, 6));
  trazo(SURCO_DORSAL - 0.12, 0.008, 0.006, 0);
  trazo(2 * Math.PI - (SURCO_DORSAL - 0.12), 0.008, 0.006, 1.7);
  return mergeGeometries(lineas)!;
}

// ── Saco dural ───────────────────────────────────────────────────────────────

/** Perfil del saco dural (radio, y): del foramen magno a S2, donde se cierra. */
export function geometriaSaco(): THREE.BufferGeometry {
  const perfil: THREE.Vector2[] = [];
  perfil.push(new THREE.Vector2(0.92, CORD_TOP + 0.25));
  for (let y = CORD_TOP; y > -6.6; y -= 0.2) {
    perfil.push(new THREE.Vector2(Math.max(1.02, cordRadiusAt(y) + 0.3), y));
  }
  perfil.push(new THREE.Vector2(0.95, -6.7));
  perfil.push(new THREE.Vector2(0.7, -6.88));
  perfil.push(new THREE.Vector2(0.35, -7.0));
  perfil.push(new THREE.Vector2(0.02, SACO_FIN));
  const g = new THREE.LatheGeometry(perfil, 56);
  g.scale(1, 1, 0.82); // también ovalado
  return g;
}
