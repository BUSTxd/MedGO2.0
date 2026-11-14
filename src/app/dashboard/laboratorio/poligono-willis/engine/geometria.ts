// Geometría del polígono de Willis y de sus referencias, sin React.
//
// Sistema de coordenadas pensado para la vista basal de los atlas (el encéfalo
// visto desde abajo, con el frontal arriba de la pantalla):
//   +X = IZQUIERDA del paciente (a la derecha de la pantalla en la vista basal)
//   +Y = anterior (arriba en la pantalla)
//   +Z = inferior (hacia quien mira la base del cráneo)
// Así la terna izquierda-anterior-inferior es dextrógira y la imagen no sale
// espejada: en la vista basal la derecha del paciente queda a la izquierda.
//
// Unidad ≈ 5-6 mm. El anillo está inclinado como en el cadáver: la comunicante
// anterior queda más alta (z negativa) que el ápex de la basilar, y el sistema
// vertebrobasilar baja hacia el agujero magno (z positiva) apoyado en el
// tronco del encéfalo. Los vasos pares se trazan solo del lado izquierdo
// (x > 0) y el derecho se obtiene espejando x.
//
// Radios: r = 0,055 × diámetro en mm, con un mínimo visible para las
// perforantes; conserva el orden de calibres (ACI > basilar > vertebral > M1 >
// A1 ≈ P1 > ...).

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ArteriaId } from './anatomia';
import type { ExtraId, Lado } from './clinica';

export type Pt = [number, number, number];

export interface Tramo {
  pts: Pt[];
  /** Radio al inicio y al final (se afina de forma lineal). */
  r0: number;
  r1?: number;
}

export interface Trazado {
  /** Tramos del lado izquierdo (se espejan si la arteria es par). */
  tramos: Tramo[];
  /** Tramos de línea media (se dibujan una sola vez, lado «m»). */
  medios?: Tramo[];
  /** Dónde va la etiqueta: fracción del primer tramo (o del primer medio). */
  etiqueta: number;
  /**
   * Trazado escrito ya en las coordenadas finales (no pasa por estirarY):
   * las arterias que salen del tronco hacia el cerebro y el cerebelo, cuyo
   * destino no se alarga con la basilar.
   */
  final?: boolean;
}

const espejo = (p: Pt): Pt => [-p[0], p[1], p[2]];

// Los trazados se escribieron con una basilar corta. Gray 519 (y la anatomía:
// basilar ≈ 25-30 mm, A1 ≈ 13 mm) la muestra casi tan larga como alto es el
// anillo, así que todo lo que queda bajo el ápex se estira al construir: el
// tramo de la basilar ×1,5 y lo de debajo de la unión vertebrobasilar baja
// lo mismo que creció la basilar.
const Y_APEX = -1.45;
const Y_VB = -4.55;
const ESTIRA = 1.5;
export function estirarY(y: number): number {
  if (y >= Y_APEX) return y;
  if (y >= Y_VB) return Y_APEX + (y - Y_APEX) * ESTIRA;
  return y + (Y_VB - Y_APEX) * (ESTIRA - 1);
}
const estirar = (p: Pt): Pt => [p[0], estirarY(p[1]), p[2]];
const estirarTramo = (t: Tramo): Tramo => ({ ...t, pts: t.pts.map(estirar) });
const suma = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ── Nodos compartidos: las anastomosis caen exactamente en el mismo punto ──
const BIF: Pt = [2.0, 1.0, 0.15];        // bifurcación terminal de la carótida
const A1_ACOA: Pt = [0.35, 2.75, -0.3];  // unión A1-comunicante anterior
const P1_P2: Pt = [1.25, -1.15, 0.68];   // unión P1-comunicante posterior (P1 casi horizontal, como en Gray 519)
const APEX: Pt = [0, -1.45, 0.95];       // ápex de la basilar
const VB: Pt = [0, -4.55, 1.3];          // unión vertebrobasilar
const M1_FIN: Pt = [4.9, 0.8, -0.45];    // limen de la ínsula

/** Perforantes cortas: nacen en `o` y suben (z negativa) con una leve curva. */
function perforantes(origenes: Pt[], d1: Pt, d2: Pt, r = 0.026): Tramo[] {
  return origenes.map((o) => ({ pts: [o, suma(o, d1), suma(o, d2)], r0: r, r1: r * 0.8 }));
}

export const TRAZADOS: Record<ArteriaId, Trazado> = {
  ica: {
    // Petrosa → cavernosa (sifón) → clinoidea → supraclinoidea hasta la bifurcación.
    tramos: [{ pts: [[2.5, -1.0, 3.2], [2.15, -0.2, 2.55], [2.2, 1.0, 2.3], [2.35, 1.75, 1.65], [2.25, 1.5, 0.85], BIF], r0: 0.24, r1: 0.21 }],
    etiqueta: 0.14,
  },
  oftalmica: {
    tramos: [{ pts: [[2.3, 1.68, 1.32], [2.0, 2.4, 1.25], [1.85, 3.3, 1.15], [1.95, 4.3, 1.05]], r0: 0.07, r1: 0.05 }],
    etiqueta: 0.85,
  },
  pcom: {
    tramos: [{ pts: [[1.98, 0.95, 0.2], [1.8, 0.25, 0.35], [1.5, -0.5, 0.52], P1_P2], r0: 0.068, r1: 0.064 }],
    etiqueta: 0.5,
  },
  coroidea_ant: {
    tramos: [{ pts: [[2.05, 1.05, 0.3], [2.4, 0.5, 0.25], [2.75, -0.2, 0.05], [3.0, -0.9, -0.25], [3.1, -1.6, -0.6]], r0: 0.05, r1: 0.04 }],
    etiqueta: 0.8,
  },
  a1: {
    tramos: [{ pts: [BIF, [1.5, 1.7, -0.05], [0.9, 2.35, -0.2], A1_ACOA], r0: 0.125, r1: 0.11 }],
    etiqueta: 0.5,
  },
  acom: {
    tramos: [],
    medios: [{ pts: [A1_ACOA, [0, 2.8, -0.32], espejo(A1_ACOA)], r0: 0.085 }],
    etiqueta: 0.5,
  },
  a2: {
    tramos: [{ pts: [A1_ACOA, [0.32, 3.3, -0.55], [0.28, 4.0, -1.1], [0.25, 4.6, -1.9], [0.22, 4.95, -2.85]], r0: 0.11, r1: 0.09 }],
    etiqueta: 0.75,
  },
  heubner: {
    tramos: [{ pts: [[0.33, 3.05, -0.44], [0.8, 2.9, -0.62], [1.4, 2.35, -0.72], [1.95, 1.7, -0.78], [2.3, 1.25, -0.95]], r0: 0.044, r1: 0.038 }],
    etiqueta: 0.8,
  },
  anteromediales: {
    tramos: perforantes([[0.17, 2.79, -0.33], [0.62, 2.56, -0.26]], [0.04, -0.2, -0.5], [0.08, -0.4, -1.0]),
    etiqueta: 1,
  },
  m1: {
    tramos: [{ pts: [BIF, [2.7, 1.15, 0.05], [3.5, 1.2, -0.05], [4.3, 1.05, -0.2], M1_FIN], r0: 0.155, r1: 0.14 }],
    etiqueta: 0.45,
  },
  m2: {
    // Tronco superior e inferior desde el limen de la ínsula.
    tramos: [
      { pts: [M1_FIN, [5.35, 1.15, -1.0], [5.6, 1.5, -1.8], [5.7, 1.85, -2.75]], r0: 0.105, r1: 0.075 },
      { pts: [M1_FIN, [5.4, 0.3, -0.9], [5.7, -0.2, -1.6], [5.8, -0.65, -2.45]], r0: 0.1, r1: 0.07 },
    ],
    etiqueta: 0.75,
  },
  lenticuloestriadas: {
    tramos: [
      ...perforantes([[3.7, 1.18, -0.08], [3.1, 1.18, 0.0], [2.45, 1.1, 0.08]], [0.02, 0.04, -0.5], [-0.14, 0.12, -1.05]),
      ...perforantes([[2.8, 1.16, 0.04], [3.4, 1.2, -0.04]], [0.03, 0.02, -0.55], [0.12, 0.05, -1.1]),
    ],
    etiqueta: 1,
  },
  p1: {
    tramos: [{ pts: [APEX, [0.55, -1.38, 0.9], [1.0, -1.25, 0.78], P1_P2], r0: 0.115, r1: 0.11 }],
    etiqueta: 0.55,
  },
  p2: {
    // P2 rodea el pedúnculo cerebral pegada a él (cisterna ambiens), P3 pasa
    // por detrás del mesencéfalo (cisterna cuadrigémina) y P4 corre hacia atrás
    // por encima de la tienda del cerebelo hasta la cara medial del occipital,
    // donde se abre en calcarina y parietooccipital (Gray 516, angio-RM).
    tramos: [
      { pts: [P1_P2, [1.7, -1.45, 0.5], [1.95, -2.05, 0.1], [1.85, -2.75, -0.55], [1.4, -3.4, -1.3], [0.95, -5.0, -2.0], [0.65, -8.0, -2.6], [0.55, -11.3, -3.0], [0.65, -13.6, -3.2]], r0: 0.11, r1: 0.055 },
      // Parietooccipital, desde P4.
      { pts: [[0.8, -6.6, -2.35], [0.7, -8.3, -4.2], [0.6, -9.6, -6.2]], r0: 0.06, r1: 0.045 },
    ],
    etiqueta: 0.12,
    final: true,
  },
  talamoperforantes: {
    tramos: perforantes([[0.18, -1.43, 0.94], [0.45, -1.37, 0.9]], [-0.04, 0.2, -0.5], [-0.1, 0.45, -1.1]),
    etiqueta: 1,
  },
  basilar: {
    tramos: [],
    medios: [{ pts: [VB, [0.04, -3.8, 1.15], [0, -3.0, 1.05], [0.03, -2.2, 1.0], APEX], r0: 0.195, r1: 0.18 }],
    etiqueta: 0.45,
  },
  pontinas: {
    tramos: [-3.4, -2.5, -3.95, -2.95].map((y) => {
      const z = 1.0 + (-2.5 - y) * 0.11;
      return { pts: [[0.15, y, z], [0.5, y, z - 0.05], [0.85, y - 0.05, z - 0.25]] as Pt[], r0: 0.028, r1: 0.022 };
    }),
    etiqueta: 1,
  },
  sca: {
    // Rodea la unión mesencéfalo-protuberancia bajo el III par y sube a la
    // cara superior del cerebelo, bajo la tienda.
    tramos: [{ pts: [[0.12, -2.05, 1.0], [0.7, -2.15, 0.98], [1.45, -2.35, 0.8], [2.0, -2.9, 0.4], [2.3, -3.7, -0.25], [2.55, -5.0, -1.1], [2.9, -6.7, -1.6], [3.2, -8.5, -1.3]], r0: 0.072, r1: 0.055 }],
    etiqueta: 0.3,
    final: true,
  },
  aica: {
    tramos: [{ pts: [[0.12, -4.1, 1.25], [0.8, -4.25, 1.25], [1.5, -4.35, 1.05], [2.1, -4.15, 0.75], [2.6, -4.4, 0.5], [3.0, -5.0, 0.25], [3.3, -5.5, 0.4]], r0: 0.058, r1: 0.048 }],
    etiqueta: 0.55,
  },
  laberintica: {
    tramos: [{ pts: [[2.1, -4.15, 0.75], [2.5, -3.85, 1.0], [2.9, -3.6, 1.15]], r0: 0.03, r1: 0.026 }],
    etiqueta: 1,
  },
  vertebral: {
    tramos: [{ pts: [[1.35, -8.3, 2.85], [1.25, -7.4, 2.55], [0.95, -6.4, 2.15], [0.5, -5.3, 1.65], VB], r0: 0.185, r1: 0.18 }],
    etiqueta: 0.3,
  },
  pica: {
    // Rodea el bulbo, hace el asa caudal junto a la amígdala cerebelosa y sale
    // a la cara inferior (suboccipital) del hemisferio cerebeloso.
    tramos: [{ pts: [[1.0, -8.15, 2.22], [1.55, -8.65, 1.95], [1.75, -9.3, 1.3], [1.4, -9.7, 0.6], [1.75, -10.1, 1.45], [2.6, -10.45, 2.95], [3.6, -11.2, 3.2], [4.6, -12.2, 3.2]], r0: 0.08, r1: 0.055 }],
    etiqueta: 0.75,
    final: true,
  },
  espinal_ant: {
    tramos: [{ pts: [[0.6, -5.55, 1.78], [0.3, -6.0, 1.9], [0, -6.5, 1.98]], r0: 0.035 }],
    medios: [{ pts: [[0, -6.5, 1.98], [0, -7.6, 2.22], [0, -8.85, 2.56]], r0: 0.04, r1: 0.035 }],
    etiqueta: 1,
  },
};

/** Vasos que solo existen en una variante (lado «m»: se dibujan tal cual). */
const EXTRAS_CRUDOS: Record<ExtraId, { nombre: string; tramos: Tramo[] }> = {
  trigeminal: {
    nombre: 'Arteria trigeminal persistente',
    tramos: [{ pts: [[2.15, -0.2, 2.55], [1.7, -1.2, 2.3], [1.0, -2.3, 1.7], [0.12, -2.95, 1.12]], r0: 0.1, r1: 0.09 }],
  },
  percheron: {
    nombre: 'Arteria de Percheron',
    tramos: [
      // Tronco único desde la P1 izquierda por la fosa interpeduncular; luego
      // se abre hacia los dos tálamos.
      { pts: [[0.5, -1.37, 0.9], [0.32, -0.95, 0.6], [0.05, -0.5, 0.2]], r0: 0.065, r1: 0.058 },
      { pts: [[0.05, -0.5, 0.2], [0.3, -0.35, -0.2], [0.5, -0.25, -0.7]], r0: 0.048, r1: 0.036 },
      { pts: [[0.05, -0.5, 0.2], [-0.22, -0.35, -0.2], [-0.45, -0.25, -0.7]], r0: 0.048, r1: 0.036 },
    ],
  },
};

export const EXTRAS: Record<ExtraId, { nombre: string; tramos: Tramo[] }> = {
  trigeminal: { ...EXTRAS_CRUDOS.trigeminal, tramos: EXTRAS_CRUDOS.trigeminal.tramos.map(estirarTramo) },
  percheron: { ...EXTRAS_CRUDOS.percheron, tramos: EXTRAS_CRUDOS.percheron.tramos.map(estirarTramo) },
};

// ── Construcción de tubos ────────────────────────────────────────────────────

function curva(pts: Pt[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'catmullrom', 0.5);
}

/**
 * Tubo que se afina de r0 a r1, con una esfera en cada extremo para que las
 * uniones entre vasos no dejen huecos. Parte de un TubeGeometry de radio 1 y
 * reescala cada anillo sobre su centro (getPointAt, el mismo que usa three).
 */
function tubo(t: Tramo, escala = 1): THREE.BufferGeometry {
  const c = curva(t.pts);
  const r0 = t.r0 * escala;
  const r1 = (t.r1 ?? t.r0) * escala;
  const largo = c.getLength();
  const segs = Math.max(12, Math.ceil(largo * 26));
  const radial = r0 > 0.06 ? 16 : 9;
  const geo = new THREE.TubeGeometry(c, segs, 1, radial, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const centro = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    c.getPointAt(u, centro);
    const r = r0 + (r1 - r0) * u;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      pos.setXYZ(k, centro.x + nor.getX(k) * r, centro.y + nor.getY(k) * r, centro.z + nor.getZ(k) * r);
    }
  }
  pos.needsUpdate = true;
  const partes: THREE.BufferGeometry[] = [geo];
  const ini = c.getPointAt(0);
  const fin = c.getPointAt(1);
  partes.push(new THREE.SphereGeometry(r0, radial, Math.max(6, radial / 2 + 2)).translate(ini.x, ini.y, ini.z));
  partes.push(new THREE.SphereGeometry(r1, radial, Math.max(6, radial / 2 + 2)).translate(fin.x, fin.y, fin.z));
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((p) => p.dispose());
  return unido;
}

export function geometriaTramos(tramos: Tramo[], escala = 1): THREE.BufferGeometry {
  const partes = tramos.map((t) => tubo(t, escala));
  if (partes.length === 1) return partes[0];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((p) => p.dispose());
  return unido;
}

/** Piezas del modelo: una por arteria y lado (i, d) más la de línea media (m). */
export interface Pieza {
  arteria: ArteriaId;
  lado: Lado;
  tramos: Tramo[];
}

export const PIEZAS: Pieza[] = (Object.keys(TRAZADOS) as ArteriaId[]).flatMap((id) => {
  const t = TRAZADOS[id];
  const out: Pieza[] = [];
  if (t.tramos.length) {
    const izq = t.final ? t.tramos : t.tramos.map(estirarTramo);
    out.push({ arteria: id, lado: 'i', tramos: izq });
    out.push({ arteria: id, lado: 'd', tramos: izq.map((tr) => ({ ...tr, pts: tr.pts.map(espejo) })) });
  }
  if (t.medios?.length) out.push({ arteria: id, lado: 'm', tramos: t.medios.map(estirarTramo) });
  return out;
});

/** Punto donde se ancla la etiqueta de una arteria en el lado pedido. */
export function anclaEtiqueta(id: ArteriaId, lado: Lado): THREE.Vector3 {
  const t = TRAZADOS[id];
  const tramo = t.tramos[0] ?? t.medios![0];
  const p = curva(t.final ? tramo.pts : tramo.pts.map(estirar)).getPointAt(Math.min(1, Math.max(0, t.etiqueta)));
  if (lado === 'd' && t.tramos.length) p.x = -p.x;
  return p;
}

// ── Referencias anatómicas ───────────────────────────────────────────────────

function interpolar(tabla: Array<[number, number]>, y: number): number {
  if (y >= tabla[0][0]) return tabla[0][1];
  for (let i = 0; i < tabla.length - 1; i++) {
    const [y0, v0] = tabla[i];
    const [y1, v1] = tabla[i + 1];
    if (y <= y0 && y >= y1) {
      const u = (y0 - y) / (y0 - y1);
      const s = u * u * (3 - 2 * u); // suave entre puntos
      return v0 + (v1 - v0) * s;
    }
  }
  return tabla[tabla.length - 1][1];
}

// Perfil del tronco del encéfalo (y → semiancho, semialto, centro en z).
const TR_RX: Array<[number, number]> = [[-0.45, 1.5], [-1.0, 1.45], [-1.9, 1.25], [-2.35, 1.62], [-3.2, 1.8], [-4.1, 1.6], [-4.5, 1.0], [-5.5, 1.0], [-7.0, 0.78], [-8.9, 0.6]];
const TR_RZ: Array<[number, number]> = [[-0.45, 0.72], [-1.0, 0.8], [-1.9, 0.8], [-2.35, 1.02], [-3.2, 1.15], [-4.1, 1.05], [-4.5, 0.76], [-5.5, 0.8], [-7.0, 0.62], [-8.9, 0.55]];
const TR_ZC: Array<[number, number]> = [[-0.45, -0.2], [-2.0, -0.25], [-3.2, -0.25], [-4.3, -0.05], [-5.5, 0.65], [-7.0, 1.3], [-8.9, 1.95]];
const TR_ARRIBA = -0.45;
const TR_ABAJO = -8.9;

/**
 * Tronco del encéfalo como superficie por anillos: pedúnculos con fosa
 * interpeduncular, protuberancia abombada con su surco basilar y bulbo con la
 * fisura media anterior y las olivas. θ = 0 es la cara ventral (+z).
 */
export function geometriaTronco(): THREE.BufferGeometry {
  const ANILLO = 72;
  const PASO = 0.06;
  const filas = Math.round((TR_ARRIBA - TR_ABAJO) / PASO) + 1;
  const pos: number[] = [];
  const idx: number[] = [];
  const gauss = (d: number, w: number) => Math.exp(-(d / w) * (d / w));
  for (let f = 0; f < filas; f++) {
    const y = TR_ARRIBA - f * PASO;
    const rx = interpolar(TR_RX, y);
    const rz = interpolar(TR_RZ, y);
    const zc = interpolar(TR_ZC, y);
    const esMes = y > -2.0 ? Math.min(1, (y + 2.0) / 0.6) : 0;           // fosa interpeduncular
    const esPuente = y < -2.3 && y > -4.4 ? 1 : 0;                         // surco basilar
    const esBulbo = y < -4.6 ? 1 : 0;                                      // fisura y olivas
    for (let j = 0; j < ANILLO; j++) {
      const th = (j / ANILLO) * Math.PI * 2;
      const dVen = Math.min(th, Math.PI * 2 - th);
      let hund = 0.3 * esMes * gauss(dVen, 0.35) + 0.07 * esPuente * gauss(dVen, 0.2) + 0.12 * esBulbo * gauss(dVen, 0.07);
      // Olivas: relieve a cada lado del bulbo alto.
      const oliva = y < -4.8 && y > -6.4 ? 0.07 * gauss(Math.abs(dVen - 0.95), 0.22) * Math.sin(((y + 4.8) / -1.6) * Math.PI) : 0;
      hund -= oliva;
      const r = 1 - hund;
      pos.push(rx * Math.sin(th) * r, y, zc + rz * Math.cos(th) * r);
    }
  }
  for (let f = 0; f < filas - 1; f++) {
    for (let j = 0; j < ANILLO; j++) {
      const a = f * ANILLO + j;
      const b = f * ANILLO + ((j + 1) % ANILLO);
      const c = a + ANILLO;
      const d = b + ANILLO;
      idx.push(a, c, b, b, c, d);
    }
  }
  // Tapas arriba y abajo (abanico desde el centro del anillo).
  for (const [f, invertir] of [[0, true], [filas - 1, false]] as Array<[number, boolean]>) {
    const y = TR_ARRIBA - f * PASO;
    const centro = pos.length / 3;
    pos.push(0, y, interpolar(TR_ZC, y));
    for (let j = 0; j < ANILLO; j++) {
      const a = f * ANILLO + j;
      const b = f * ANILLO + ((j + 1) % ANILLO);
      if (invertir) idx.push(centro, b, a); else idx.push(centro, a, b);
    }
  }
  for (let k = 1; k < pos.length; k += 3) pos[k] = estirarY(pos[k]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Nervios ópticos, quiasma y cintillas ópticas. */
export function geometriaOptico(): THREE.BufferGeometry {
  const nervio: Tramo = { pts: [[1.6, 4.0, 0.78], [1.05, 3.15, 0.66], [0.45, 2.35, 0.55], [0, 2.05, 0.5]], r0: 0.12, r1: 0.115 };
  const cintilla: Tramo = { pts: [[0, 2.05, 0.5], [0.55, 1.6, 0.4], [1.3, 0.9, 0.2], [1.95, 0.0, -0.15], [2.4, -0.8, -0.45]], r0: 0.11, r1: 0.085 };
  const tramos = [nervio, cintilla, { ...nervio, pts: nervio.pts.map(espejo) }, { ...cintilla, pts: cintilla.pts.map(espejo) }];
  const partes = tramos.map((t) => tubo(t));
  // Cuerpo del quiasma: un rombo aplanado en la línea media.
  partes.push(new THREE.SphereGeometry(0.34, 20, 12).scale(1, 0.62, 0.4).translate(0, 2.05, 0.5));
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((p) => p.dispose());
  return unido;
}

/** Tallo hipofisario, hipófisis y cuerpos mamilares. */
export function geometriaHipofisis(): THREE.BufferGeometry {
  const partes = [
    tubo({ pts: [[0, 1.55, 0.38], [0, 1.65, 0.85], [0, 1.75, 1.3]], r0: 0.09, r1: 0.07 }),
    new THREE.SphereGeometry(1, 24, 16).scale(0.4, 0.32, 0.26).translate(0, 1.8, 1.6),
    new THREE.SphereGeometry(0.17, 16, 12).translate(0.28, 0.05, 0.08),
    new THREE.SphereGeometry(0.17, 16, 12).translate(-0.28, 0.05, 0.08),
  ];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((p) => p.dispose());
  return unido;
}

/** Nervio oculomotor de un lado, entre la cerebral posterior y la cerebelosa superior. */
export function geometriaOculomotor(lado: 'i' | 'd'): THREE.BufferGeometry {
  const t: Tramo = { pts: [[0.35, -1.65, 0.8], [0.85, -1.55, 0.95], [1.35, -0.95, 0.98], [1.75, -0.15, 0.98], [2.0, 0.6, 1.18], [1.85, 1.2, 1.75]], r0: 0.055, r1: 0.05 };
  const s = estirarTramo(t);
  return geometriaTramos([lado === 'i' ? s : { ...s, pts: s.pts.map(espejo) }]);
}

// ── Silueta del cerebro y del cerebelo ───────────────────────────────────────
//
// A la escala del modelo (1 u ≈ 5,4 mm, sale de la A1 de 13 mm y la M1 de
// 16 mm): encéfalo de ≈ 165 × 135 mm, polo frontal ≈ 65 mm por delante de la
// comunicante anterior y polo occipital por detrás del cerebelo. La cara basal
// se modela con un «piso» (la z más inferior que puede tener cada punto): la
// cara orbitaria del frontal queda alta, el lóbulo temporal baja a la fosa
// media y el occipital se apoya en la tienda, por encima del cerebelo. El
// polígono queda por fuera, en la cisterna, como en el cadáver.

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
function smin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
const spow = (v: number, e: number) => Math.sign(v) * Math.pow(Math.abs(v), e);

/** z más inferior del hemisferio en (|x|, y). */
function pisoHemisferio(ax: number, y: number): number {
  const frontal = -0.75;                                   // cara orbitaria
  const temporal = 0.15 + 2.55 * ss(1.9, 4.2, ax);         // uncus medial → fosa media
  let piso = frontal + (temporal - frontal) * ss(4.2, 0.9, y);
  // Occipital: sobre la tienda, por encima del cerebelo.
  piso += (-2.5 - piso) * ss(-6.0, -9.4, y);
  return piso;
}

/** Superelipsoide muestreada en una malla UV, con una deformación por punto. */
function superelipsoide(
  c: Pt, r: Pt, e: number,
  deformar?: (p: THREE.Vector3) => void,
  seg = 72, anillos = 48,
): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= anillos; i++) {
    const v = -Math.PI / 2 + (i / anillos) * Math.PI;        // de inferior a superior
    for (let j = 0; j <= seg; j++) {
      const u = -Math.PI + (j / seg) * Math.PI * 2;
      p.set(
        c[0] + r[0] * spow(Math.cos(v), e) * spow(Math.cos(u), e),
        c[1] + r[1] * spow(Math.cos(v), e) * spow(Math.sin(u), e),
        c[2] - r[2] * spow(Math.sin(v), e),                  // v = -π/2 → z inferior (+)
      );
      deformar?.(p);
      pos.push(p.x, p.y, p.z);
    }
  }
  for (let i = 0; i < anillos; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * (seg + 1) + j;
      const b = a + seg + 1;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Hemisferios cerebrales: silueta translúcida. */
export function geometriaCerebro(): THREE.BufferGeometry {
  const hemi = (lado: 1 | -1) => superelipsoide(
    [lado * 6.35, -0.4, -6.4], [6.2, 15.1, 9.2], 0.82,
    (p) => {
      let ax = Math.abs(p.x);
      // Contorno basal: frontal más estrecho, máximo ancho en la región
      // temporoparietal y occipital algo más estrecho.
      const ancho = 0.8 + 0.2 * Math.exp(-(((p.y + 3) / 9) ** 2)) - 0.06 * ss(-8, -15, p.y);
      ax = 0.35 + Math.max(0, ax - 0.35) * ancho;
      // Cara medial plana (cisura interhemisférica).
      if (ax < 0.35) ax = 0.35 - (0.35 - ax) * 0.15;
      p.x = lado * ax;
      // Cara basal: se apoya en su piso.
      p.z = smin(p.z, pisoHemisferio(Math.abs(p.x), p.y), 0.9);
      // Polo temporal y cisura de Silvio: el temporal se separa del frontal.
      const silvio = Math.exp(-((p.y - 2.0) ** 2) / 1.2) * ss(3.0, 6.5, ax) * ss(-4.0, 0.5, p.z);
      p.x -= lado * 1.7 * silvio;
    },
  );
  const partes = [hemi(1), hemi(-1)];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((g) => g.dispose());
  return unido;
}

/** Cerebelo: dos hemisferios y el vermis, bajo la tienda y detrás del tronco. */
export function geometriaCerebelo(): THREE.BufferGeometry {
  const partes = [
    // ≈ 10 cm de ancho y 5 de largo; el bulbo queda en la vallécula, entre ambos.
    superelipsoide([4.6, -10.8, 0.7], [4.2, 4.1, 2.5], 0.9, undefined, 56, 36),
    superelipsoide([-4.6, -10.8, 0.7], [4.2, 4.1, 2.5], 0.9, undefined, 56, 36),
    superelipsoide([0, -11.3, -0.4], [1.6, 3.4, 2.0], 0.9, undefined, 40, 28),
  ];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((g) => g.dispose());
  return unido;
}

/** Encuadre: centro del conjunto y semiextensiones (alto, ancho). */
export const CENTRO: Pt = [0, -2.9, 0.6];
export const SEMI_ALTO = 8.7;
export const SEMI_ANCHO = 6.4;
/** Encuadre del encéfalo entero (silueta): ≈ 165 × 135 mm. */
export const CENTRO_ENCEFALO: Pt = [0, -0.6, -2];
export const SEMI_ALTO_ENCEFALO = 17.2;
export const SEMI_ANCHO_ENCEFALO = 13.8;
