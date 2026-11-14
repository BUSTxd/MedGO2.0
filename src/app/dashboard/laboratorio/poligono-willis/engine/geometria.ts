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
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { deformar, type ModoDoblez } from './doblez';
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
  /**
   * Tramos del cuello, del lado izquierdo, que solo se ven en «Posición real»
   * (coordenadas finales). Los de la carótida son fijos al cráneo; los de la
   * vertebral se doblan con el tronco.
   */
  cuello?: Tramo[];
  /** Tramos del cuello de línea media (espinal anterior por la médula). */
  cuelloMedios?: Tramo[];
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
    // Cervical (vertical, desde el bulbo carotídeo) → codo al entrar en el
    // conducto carotídeo → petrosa horizontal hasta el agujero rasgado, donde
    // empieza el tramo de arriba. Así pasa de vertical a horizontal.
    cuello: [{ pts: [[3.55, -1.6, 12.6], [3.55, -1.85, 10.0], [3.5, -2.0, 7.0], [3.5, -2.05, 4.6], [3.35, -2.0, 3.75], [2.95, -1.6, 3.4], [2.5, -1.0, 3.2]], r0: 0.3, r1: 0.24 }],
    etiqueta: 0.14,
  },
  carotida_comun: {
    tramos: [],
    // Común (desde abajo) hasta la bifurcación a la altura de C3-C4, y muñón
    // de la carótida externa, anteromedial a la interna.
    cuello: [
      { pts: [[3.2, -0.6, 20.5], [3.45, -1.2, 16.0], [3.55, -1.6, 12.6]], r0: 0.34, r1: 0.32 },
      { pts: [[3.55, -1.6, 12.6], [3.35, -0.9, 11.2], [3.1, -0.3, 9.0], [3.2, 0.2, 6.8]], r0: 0.2, r1: 0.15 },
    ],
    etiqueta: 0.4,
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
    // V3: sale del agujero transverso del atlas, rodea por detrás su masa
    // lateral (el asa) y entra por el agujero magno; V2: sube por los agujeros
    // transversos de C6 a C1; V1: desde la subclavia. Se dobla con el tronco.
    cuello: [{ pts: [[1.35, -9.85, 2.85], [2.0, -10.4, 2.3], [3.0, -10.9, 1.3], [4.1, -11.4, 1.7], [4.6, -11.9, 2.8], [4.2, -12.6, 3.4], [3.6, -13.6, 3.6], [3.5, -17, 3.6], [3.4, -24, 3.6], [3.7, -26.5, 3.2], [4.8, -27.6, 2.6]], r0: 0.18, r1: 0.19 }],
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
    cuelloMedios: [{ pts: [[0, -10.4, 2.56], [0, -13, 2.56], [0, -27.3, 2.56]], r0: 0.035 }],
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
  /** Solo se ve en «Posición real». */
  cuello: boolean;
  /** Cómo se mueve al pasar del atlas a la posición real. */
  modo: ModoDoblez;
}

/** La ACP va al cerebro (no se dobla); las cerebelosas siguen al cerebelo. */
function modoDe(id: ArteriaId, cuello: boolean): ModoDoblez {
  if (id === 'p2' || id === 'carotida_comun' || (cuello && id === 'ica')) return 'fijo';
  if (id === 'sca' || id === 'aica' || id === 'pica') return 'rama';
  return 'tronco';
}

const izquierdaYDerecha = (id: ArteriaId, tramos: Tramo[], cuello: boolean): Pieza[] => [
  { arteria: id, lado: 'i', tramos, cuello, modo: modoDe(id, cuello) },
  { arteria: id, lado: 'd', tramos: tramos.map((tr) => ({ ...tr, pts: tr.pts.map(espejo) })), cuello, modo: modoDe(id, cuello) },
];

export const PIEZAS: Pieza[] = (Object.keys(TRAZADOS) as ArteriaId[]).flatMap((id) => {
  const t = TRAZADOS[id];
  const out: Pieza[] = [];
  if (t.tramos.length) out.push(...izquierdaYDerecha(id, t.final ? t.tramos : t.tramos.map(estirarTramo), false));
  if (t.medios?.length) out.push({ arteria: id, lado: 'm', tramos: t.medios.map(estirarTramo), cuello: false, modo: modoDe(id, false) });
  if (t.cuello?.length) out.push(...izquierdaYDerecha(id, t.cuello, true));
  if (t.cuelloMedios?.length) out.push({ arteria: id, lado: 'm', tramos: t.cuelloMedios, cuello: true, modo: modoDe(id, true) });
  return out;
});

/** ¿La arteria solo existe en el cuello (se ve únicamente en «Posición real»)? */
export const soloCuello = (id: ArteriaId) => !TRAZADOS[id].tramos.length && !TRAZADOS[id].medios?.length;

/** Punto donde se ancla la etiqueta de una arteria en el lado pedido y la postura t. */
export function anclaEtiqueta(id: ArteriaId, lado: Lado, t = 0): THREE.Vector3 {
  const tr = TRAZADOS[id];
  const deCuello = soloCuello(id);
  const tramo = tr.tramos[0] ?? tr.medios?.[0] ?? tr.cuello![0];
  const pts = tr.final || deCuello ? tramo.pts : tramo.pts.map(estirar);
  const p = curva(pts).getPointAt(Math.min(1, Math.max(0, tr.etiqueta)));
  if (lado === 'd' && (tr.tramos.length || deCuello)) p.x = -p.x;
  deformar(p, t, modoDe(id, deCuello));
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
  // Occipital: el temporal sube en rampa hacia atrás, apoyado en la tienda
  // del cerebelo (sin escalón: una pared vertical se vería como una lámina).
  piso += (-1.7 - piso) * ss(-4.0, -12.5, y);
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
  const crudo = new THREE.BufferGeometry();
  crudo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  crudo.setIndex(idx);
  // Suelda la costura y los polos (vértices repetidos) para que las normales
  // no dejen una línea marcada en la silueta.
  const geo = mergeVertices(crudo, 1e-4);
  crudo.dispose();
  geo.computeVertexNormals();
  return geo;
}

// ── Territorios, surcos y circunvoluciones (atributos por vértice) ──
//
// Cada vértice del cerebro lleva tres atributos, en bytes normalizados:
//   terr   (vec3): peso de la cerebral anterior, media y posterior (solo se
//                  pinta en la vista Territorios; en las demás es rosado)
//   surco  (float): cercanía a un surco principal (Silvio, central,
//                   parietooccipital, interhemisférica): línea oscura
//   giro   (float): campo cuyas curvas de nivel cero dibujan circunvoluciones
// Los límites siguen la anatomía de superficie: la cisura de Silvio sube de
// delante hacia atrás desde el polo temporal; el surco central baja desde el
// vértice, algo por detrás de la mitad, hasta casi tocar Silvio; el surco
// parietooccipital separa el occipital en la cara medial. Territorios: la
// cerebral anterior lleva la cara medial y una franja de ≈ 2 cm del borde
// superior; la posterior, el occipital y la cara inferior del temporal; la
// media, el resto de la convexidad.

/** Altura (z) de la cisura de Silvio en la cara lateral, según y. */
const silvioZ = (y: number) => -1.2 - Math.max(0, 2.2 - y) * 0.5;
/** Posición (y) del surco central según la altura z. */
const centralY = (z: number) => Math.min(2.8, -1.0 + (z + 15.5) * 0.32);

// Dibujo de circunvoluciones: un campo ondulado (suma de ondas en varias
// direcciones, con la posición algo retorcida) cuyas curvas de nivel cero
// parecen surcos. Se calcula UNA vez por vértice al crear la malla; el
// sombreador solo dibuja la línea donde el valor interpolado pasa por cero
// (antes se calculaba ruido simplex en cada píxel de cada fotograma).
const ONDAS: Array<[number, number, number, number, number, number]> = [
  // dirección (x, y, z), frecuencia (rad/u: un giro mide ≈ 2-3 u ≈ 1-1,5 cm), fase, peso
  [0.62, 0.71, -0.33, 2.3, 1.3, 1],
  [-0.48, 0.35, 0.80, 2.55, 0.4, 1],
  [0.20, -0.88, 0.43, 2.1, 2.1, 1],
  [0.83, 0.12, 0.55, 2.9, 0.7, 0.7],
  [-0.30, -0.52, -0.80, 2.7, 1.9, 0.7],
];
function giros(x: number, y: number, z: number): number {
  // Retorcer el espacio para que los surcos serpenteen en vez de formar rejilla.
  const wx = x + 0.75 * Math.sin(0.9 * y + 0.5) + 0.35 * Math.sin(1.7 * z + 2.2);
  const wy = y + 0.75 * Math.sin(0.85 * z + 1.7) + 0.35 * Math.sin(1.6 * x + 0.9);
  const wz = z + 0.75 * Math.sin(0.95 * x + 2.9) + 0.35 * Math.sin(1.8 * y + 1.4);
  let s = 0;
  let w = 0;
  for (const [dx, dy, dz, f, fase, peso] of ONDAS) {
    s += peso * Math.sin(f * (dx * wx + dy * wy + dz * wz) + fase);
    w += peso;
  }
  return s / w;
}

const aByte = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
const aByteConSigno = (v: number) => Math.round(Math.min(1, Math.max(-1, v)) * 127);

function atributosCerebro(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  const n = pos.count;
  // En bytes normalizados (0-255 → 0-1): la cuarta parte de memoria que en
  // decimales, y la tarjeta gráfica los lee igual.
  const ter = new Uint8Array(n * 3);
  const sur = new Uint8Array(n);
  const gir = new Int8Array(n);
  const gs = (d: number, w: number) => Math.exp(-((d / w) ** 2));
  for (let i = 0; i < n; i++) {
    const ax = Math.abs(pos.getX(i));
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Orientación de la superficie: los surcos de la convexidad (Silvio,
    // central) solo se dibujan donde la cara mira hacia fuera o hacia arriba,
    // no en la cara basal.
    const lateral = ss(0.45, 0.75, Math.abs(nor.getX(i)));
    const noBasal = ss(0.35, 0.05, nor.getZ(i));
    // Territorios
    const medial = ss(1.7, 0.7, ax);
    const anteriorPO = ss(-10.4, -8.8, y); // por delante del surco parietooccipital
    const franja = ss(4.6, 3.4, ax) * ss(-11.2, -12.6, z) * anteriorPO;
    const aca = Math.min(1, Math.max(medial * anteriorPO, franja));
    // Cara inferomedial del temporal (fusiforme, parahipocampal) y occipital.
    const basalPost = Math.max(ss(0.6, 1.6, z) * ss(1.5, -0.5, y) * ss(6.5, 4.8, ax), ss(-10.4, -12.0, y));
    const acp = Math.min(1, Math.max(medial * (1 - anteriorPO), basalPost)) * (1 - aca);
    ter.set([aca, Math.max(0, 1 - aca - acp), acp].map(aByte), i * 3);
    // Surcos principales
    const silvio = gs(z - silvioZ(y), 0.28) * ss(3.2, 4.6, ax) * ss(4.2, 2.6, y) * ss(-8.6, -7.0, y) * lateral;
    const central = gs(y - centralY(z), 0.3) * ss(1.0, 2.2, ax) * ss(-0.4, -1.6, z - silvioZ(y)) * noBasal;
    const po = gs(y + 10.3, 0.32) * ss(2.4, 0.8, ax);
    // Cisura interhemisférica: a lo largo de toda la línea media.
    const fisura = Math.abs(nor.getX(i)) > 0.98 ? 0 : 0.6 * gs(ax - RENDIJA, 0.55);
    sur[i] = aByte(Math.max(silvio, central, po, fisura));
    // La cara medial plana (abanico de triángulos largos) no lleva dibujo:
    // interpolado sobre ella saldría en rayas.
    gir[i] = Math.abs(nor.getX(i)) > 0.98 ? 127 : aByteConSigno(giros(pos.getX(i), y, z));
  }
  geo.setAttribute('terr', new THREE.BufferAttribute(ter, 3, true));
  geo.setAttribute('surco', new THREE.BufferAttribute(sur, 1, true));
  geo.setAttribute('giro', new THREE.BufferAttribute(gir, 1, true));
}

/** Hemisferios cerebrales con lóbulos, territorios y surcos principales. */
//
// Cada hemisferio es la mitad exacta de UN mismo encéfalo (superelipsoide
// centrada en la línea media), cerrada por una cara medial plana: los dos
// quedan pegados como en la pieza real. La separación se sugiere con el borde
// medial redondeado (la cisura interhemisférica se ve como un surco a lo largo
// de toda la línea media) y una rendija de 0,3 mm entre las caras mediales.

const CEREBRO_C: Pt = [0, -0.4, -6.4];
const CEREBRO_R: Pt = [12.55, 15.1, 9.2];
const CEREBRO_E = 0.82;
const RENDIJA = 0.03;

/** Deforma un punto del medio encéfalo (x ≥ 0) y lo lleva a su lado. */
function formaHemisferio(p: THREE.Vector3, lado: 1 | -1) {
  let ax = p.x;
  // Contorno basal: frontal más estrecho, máximo ancho en la región
  // temporoparietal y occipital algo más estrecho.
  ax *= 0.8 + 0.2 * Math.exp(-(((p.y + 3) / 9) ** 2)) - 0.06 * ss(-8, -15, p.y);
  // Cara basal: se apoya en su piso.
  p.z = smin(p.z, pisoHemisferio(ax, p.y), 0.9);
  // Polo temporal y cisura de Silvio: el temporal se separa del frontal.
  const silvio = Math.exp(-((p.y - 2.0) ** 2) / 1.2) * ss(3.0, 6.5, ax) * ss(-4.0, 0.5, p.z);
  ax -= 1.7 * silvio;
  // Borde medial redondeado: cerca de la línea media la superficie se retira
  // hacia el centro, y así se dibuja la cisura interhemisférica.
  const borde = 0.55 * (1 - ss(0, 1.1, ax)) ** 2;
  const dy = p.y - CEREBRO_C[1];
  const dz = p.z - CEREBRO_C[2];
  const d = Math.hypot(dy, dz) || 1;
  p.y -= (dy / d) * borde;
  p.z -= (dz / d) * borde;
  p.x = lado * (ax + RENDIJA);
}

/** Medio encéfalo con su cara medial plana. */
function hemisferio(lado: 1 | -1, seg: number, anillos: number): THREE.BufferGeometry {
  const [cx, cy, cz] = CEREBRO_C;
  const [rx, ry, rz] = CEREBRO_R;
  const pos: number[] = [];
  const idx: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= anillos; i++) {
    const v = -Math.PI / 2 + (i / anillos) * Math.PI;          // de inferior a superior
    for (let j = 0; j <= seg; j++) {
      const u = -Math.PI / 2 + (j / seg) * Math.PI;             // solo la mitad x ≥ 0
      p.set(
        cx + rx * spow(Math.cos(v), CEREBRO_E) * spow(Math.cos(u), CEREBRO_E),
        cy + ry * spow(Math.cos(v), CEREBRO_E) * spow(Math.sin(u), CEREBRO_E),
        cz - rz * spow(Math.sin(v), CEREBRO_E),
      );
      formaHemisferio(p, lado);
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
  const crudo = new THREE.BufferGeometry();
  crudo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  crudo.setIndex(idx);
  // La mitad no da la vuelta en u, así que no hay costura que soldar.
  const exterior = crudo;
  exterior.computeVertexNormals();

  // Cara medial: abanico desde su centro hasta el contorno (columna anterior
  // de abajo arriba y posterior de arriba abajo). Lleva vértices propios con
  // la normal plana, para que de frente sea casi invisible y de canto dibuje
  // la línea de la cisura.
  const contorno: number[] = [];
  for (let i = 0; i <= anillos; i++) contorno.push(i * (seg + 1) + seg);
  for (let i = anillos; i >= 0; i--) contorno.push(i * (seg + 1));
  const cPos: number[] = [lado * RENDIJA, cy, cz + rz * 0.25];
  for (const k of contorno) cPos.push(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]);
  const cIdx: number[] = [];
  // El contorno empieza y acaba en el mismo polo: el abanico queda cerrado.
  for (let k = 1; k < contorno.length; k++) cIdx.push(0, k, k + 1);
  const cara = new THREE.BufferGeometry();
  cara.setAttribute('position', new THREE.Float32BufferAttribute(cPos, 3));
  cara.setAttribute('normal', new THREE.Float32BufferAttribute(cPos.map((_, i) => (i % 3 === 0 ? lado : 0)), 3));
  cara.setIndex(cIdx);

  const geo = mergeGeometries([exterior, cara], false)!;
  exterior.dispose();
  cara.dispose();
  return geo;
}

/** «ligero» en teléfonos: menos de la mitad de vértices, la silueta casi no cambia. */
export function geometriaCerebro(ligero = false): THREE.BufferGeometry {
  const [seg, anillos] = ligero ? [56, 64] : [84, 96];
  const partes = [hemisferio(1, seg, anillos), hemisferio(-1, seg, anillos)];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((g) => g.dispose());
  atributosCerebro(unido);
  return unido;
}

/** Cerebelo: dos hemisferios y el vermis, bajo la tienda y detrás del tronco. */
export function geometriaCerebelo(): THREE.BufferGeometry {
  const partes = [
    // ≈ 10 cm de ancho y 5 de largo; el bulbo queda en la vallécula, entre ambos.
    superelipsoide([4.6, -10.8, 0.7], [4.2, 4.1, 2.5], 0.9, undefined, 72, 48),
    superelipsoide([-4.6, -10.8, 0.7], [4.2, 4.1, 2.5], 0.9, undefined, 72, 48),
    superelipsoide([0, -11.3, -0.4], [1.6, 3.4, 2.0], 0.9, undefined, 44, 32),
  ];
  const unido = mergeGeometries(partes, false)!;
  partes.forEach((g) => g.dispose());
  const pos = unido.attributes.position as THREE.BufferAttribute;
  const n = pos.count;
  // Folias: arcos concéntricos alrededor del centro del cerebelo, algo ondulados.
  const gir = new Int8Array(n);
  for (let i = 0; i < n; i++) {
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const d = Math.hypot(y + 10.8, z - 0.7);
    gir[i] = aByteConSigno(Math.sin(d * 5.4 + 0.9 * giros(pos.getX(i), y, z)));
  }
  unido.setAttribute('terr', new THREE.BufferAttribute(new Uint8Array(n * 3), 3, true));
  unido.setAttribute('surco', new THREE.BufferAttribute(new Uint8Array(n), 1, true));
  unido.setAttribute('giro', new THREE.BufferAttribute(gir, 1, true));
  return unido;
}

/** Médula espinal cervical (solo en «Posición real»): sigue al bulbo hacia el cuello. */
export function geometriaMedula(): THREE.BufferGeometry {
  const ANILLO = 40;
  const ARRIBA = -10.3;
  const ABAJO = -27.5;
  const PASO = 0.12;
  const filas = Math.round((ARRIBA - ABAJO) / PASO) + 1;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let f = 0; f < filas; f++) {
    const y = ARRIBA - f * PASO;
    // Intumescencia cervical (C5-T1) hacia el final del tramo.
    const rx = 0.6 + 0.12 * Math.exp(-(((y + 21) / 3.5) ** 2));
    const rz = 0.5;
    for (let j = 0; j < ANILLO; j++) {
      const th = (j / ANILLO) * Math.PI * 2;
      const fisura = 1 - 0.12 * Math.exp(-((Math.min(th, Math.PI * 2 - th) / 0.12) ** 2));
      pos.push(rx * Math.sin(th) * fisura, y, 2.0 + rz * Math.cos(th) * fisura);
    }
  }
  for (let f = 0; f < filas - 1; f++) {
    for (let j = 0; j < ANILLO; j++) {
      const a = f * ANILLO + j;
      const b = f * ANILLO + ((j + 1) % ANILLO);
      idx.push(a, a + ANILLO, b, b, a + ANILLO, b + ANILLO);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/** Encuadre: centro del conjunto y semiextensiones (alto, ancho). */
export const CENTRO: Pt = [0, -2.9, 0.6];
export const SEMI_ALTO = 8.7;
export const SEMI_ANCHO = 6.4;
/** Encuadre del encéfalo entero (silueta): ≈ 165 × 135 mm. */
export const CENTRO_ENCEFALO: Pt = [0, -0.6, -2];
export const SEMI_ALTO_ENCEFALO = 17.2;
export const SEMI_ANCHO_ENCEFALO = 13.8;
/**
 * Encuadres de la «Posición real»: vista anterolateral izquierda, algo desde
 * abajo, con lo superior hacia arriba en la pantalla (−z). La altura se mide
 * en z (de la base del cerebro al cuello) y el ancho, sobre todo, en y.
 */
export const CENTRO_REAL: Pt = [0, -2.5, 7.5];
export const SEMI_ALTO_REAL = 13.5;
export const SEMI_ANCHO_REAL = 10;
export const CENTRO_REAL_ENCEFALO: Pt = [0, -1, 3];
export const SEMI_ALTO_REAL_ENCEFALO = 18;
export const SEMI_ANCHO_REAL_ENCEFALO = 17;
