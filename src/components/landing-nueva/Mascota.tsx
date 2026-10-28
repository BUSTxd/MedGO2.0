'use client';
import { useEffect, useId, useRef } from 'react';
import { c } from './estilos';

/**
 * DOT, la mascota de GO: una esfera blanca con gorro quirúrgico azul noche y dos ojos
 * en píldora que viven SOBRE la esfera (como el Grok Bot de xAI). La mirada es una
 * rotación de la esfera: cada ojo es un punto de su superficie que se proyecta en
 * el plano, y cerca del borde se aplasta hacia el centro (escorzo) hasta perderse
 * detrás. El gorro es un casquete sobre la misma esfera y gira con ella: calado hasta
 * casi los ojos, con la banda ancha y un tono más clara y dos cintas de tela en la nuca,
 * de dos largos, que de frente asoman por los lados, se dan la vuelta (enseñan el revés)
 * y se quedan atrás con un vaivén cuando la cabeza se mueve. Los ojos van por delante
 * del gorro (un filo del color de la cara los separa de la banda) y la luz, muy tenue,
 * no gira con la cabeza. `detalle` elige cuántos puntos llevan los anillos del gorro.
 *
 * Tres modos:
 *  - cursor (por defecto): sigue al puntero, parpadea solo, al quedarse quieto el
 *    puntero echa un vistazo alrededor, y el botón que la contiene la pone feliz.
 *  - `guion`: recorre un guion en bucle (puntos cardinales, parpadeos, una vuelta entera).
 *  - `mirada`: quieta, mirando a donde se le diga (siluetas de decoración).
 * `silueta` la pinta en contorno. Todo se para con `pausado`, movimiento reducido,
 * pestaña oculta o fuera de vista, y vuelve a la pose de reposo. Escribe directo en
 * el SVG (refs): animar no re-renderiza.
 *
 * Las otras variantes del gorro (el detallado con malla y frunces y diez minimalistas)
 * se sacaron del proyecto; la copia está en `Descargas/variantes de dot`.
 */

type Mirada = { yaw: number; pitch: number };
type Paso =
  | { t: 'mirar'; yaw: number; pitch: number; ms: number }
  /** Una vuelta entera sobre su eje, hacia la izquierda (los ojos salen por ese borde y entran por el otro), hasta mirar a `yaw`/`pitch`. */
  | { t: 'vuelta'; yaw: number; pitch: number; ms: number }
  /** Un brinco en el sitio: se agacha, sube estirado y se aplasta al caer. */
  | { t: 'salto'; ms: number }
  | { t: 'pausa'; ms: number }
  | { t: 'parpadeo' }
  | { t: 'feliz'; ms: number };

const mirar = (yaw: number, pitch: number, ms: number): Paso => ({ t: 'mirar', yaw, pitch, ms });
const pausa = (ms: number): Paso => ({ t: 'pausa', ms });
const PARPADEO: Paso = { t: 'parpadeo' };

const GUIONES = {
  /**
   * El de «De encontrar tu clase» (empezó como calco del Grok Bot de x.ai y se le dio más
   * vida): parpadea a menudo (a veces dos seguidas), curiosea sobre todo arriba a la
   * izquierda, se alegra, da brinquitos y muy de vez en cuando una vuelta entera. Nunca
   * se queda quieto: encima del guion lleva una deriva lenta y una respiración (`VIVOS`),
   * y la mirada va con un muelle que llega con un pequeño rebote.
   */
  vivo: [
    mirar(0, 0, 900), pausa(1200), PARPADEO, pausa(1500), PARPADEO, pausa(220), PARPADEO, pausa(600),
    mirar(-0.55, 0.38, 1000), pausa(900), PARPADEO, pausa(1400), mirar(-0.4, 0.26, 1100), PARPADEO, mirar(-0.62, 0.42, 1200), pausa(1600),
    mirar(0, 0, 900), pausa(700), { t: 'salto', ms: 760 }, { t: 'feliz', ms: 1300 }, pausa(1700), PARPADEO, pausa(1000),
    mirar(-0.55, 0.4, 1000), mirar(-0.2, 0.32, 1200), PARPADEO, pausa(800), mirar(-0.58, 0.4, 1200), pausa(1800),
    mirar(0, 0, 1000), pausa(900), PARPADEO, pausa(1900), mirar(0.25, -0.1, 900), PARPADEO, pausa(220), PARPADEO, pausa(1500), mirar(0, 0, 800), pausa(900),
    mirar(0.35, 0.08, 900), mirar(0.8, 0.35, 900), PARPADEO, pausa(500), mirar(-0.3, -0.35, 1100), mirar(0, -0.65, 900), pausa(400),
    mirar(-0.5, 0.42, 1000), { t: 'vuelta', yaw: 0, pitch: 0, ms: 1900 }, { t: 'salto', ms: 640 }, { t: 'feliz', ms: 1200 }, pausa(1500), PARPADEO,
    mirar(-0.6, 0.45, 1000), pausa(1600), mirar(-0.35, 0.12, 1100), pausa(1400),
  ],
  /** La silueta del final: mira más lejos (un ojo se pierde tras el borde) y parpadea. */
  silueta: [
    pausa(1600), mirar(-1.25, 0.3, 1000), pausa(1300), PARPADEO, pausa(500),
    mirar(1.25, 0.3, 1300), pausa(1300), mirar(0, 0.7, 900), pausa(1100), PARPADEO,
    mirar(0, -0.55, 900), pausa(1200), mirar(0, 0, 800), pausa(400), PARPADEO, pausa(1800),
  ],
} satisfies Record<string, Paso[]>;

/** Los guiones que nunca se quedan quietos: deriva lenta de la mirada y respiración del cuerpo. */
const VIVOS = new Set<keyof typeof GUIONES>(['vivo']);
/** La deriva de la mirada (suma de senos lentos: nunca se repite igual) y la escala de la respiración, para el instante `s` (segundos). */
const derivaViva = (s: number): Mirada => ({
  yaw: 0.07 * Math.sin(0.83 * s) + 0.035 * Math.sin(1.71 * s + 1.3),
  pitch: 0.05 * Math.sin(0.67 * s + 0.4) + 0.03 * Math.sin(1.37 * s + 2.1),
});
const respiracion = (s: number) => 1 + 0.03 * Math.sin((2 * Math.PI * s) / 3.2);
/** El muelle de la mirada (por ms): rigidez y amortiguación; con ζ ≈ 0,5 llega con un rebote pequeño. */
const MUELLE = { k: 0.000144, c: 0.0126 };

/** Lo que hace la del cursor si el puntero se queda quieto un rato. */
const OCIOSO: Paso[] = [mirar(-0.7, 0.15, 520), pausa(700), mirar(0.7, 0.15, 700), pausa(700), PARPADEO, mirar(0, -0.06, 500)];

// ── Geometría (viewBox 0 0 120 120) ──
const CX = 60, CY = 63, R = 52;
const OJO = { ex: 0.25, ey: -0.1, w: 13, h: 29 };
/** El filo del color de la cara alrededor de cada ojo: lo separa de la banda, que llega casi a los ojos. */
const FILO_OJO = 2.2;
/** El cuerpo acompaña a la mirada: se desplaza un poco hacia donde mira, como el Grok Bot (en unidades del viewBox). */
const DERIVA = 5;
/** Cuánto inclina la cabeza hacia el lado al que mira (grados). */
const INCLINA = 6;
/**
 * Un brinco en `u` (0 a 1): se agacha (aplastado y ancho), sube estirado y al caer se
 * vuelve a aplastar. `alto` en unidades del viewBox; `sx`/`sy`, desde el pie de la esfera.
 */
function brinco(u: number) {
  const campana = (c: number, w: number) => Math.max(0, 1 - ((u - c) / w) ** 2);
  const aire = u > 0.18 && u < 0.82 ? Math.sin((Math.PI * (u - 0.18)) / 0.64) : 0;
  const aplasta = 0.08 * campana(0.09, 0.09) + 0.1 * campana(0.9, 0.1) - 0.05 * aire;
  return { alto: 9 * aire, sx: 1 + 0.8 * aplasta, sy: 1 - aplasta };
}
/**
 * El cuerpo entero: se desplaza un poco hacia donde mira, inclina la cabeza hacia ese
 * lado, respira (`escala`, desde el pie) y brinca (`salto`, de 0 a 1; −1 sin brinco).
 */
const cuerpo = (m: Mirada, escala = 1, salto = -1) => {
  const b = salto >= 0 ? brinco(salto) : { alto: 0, sx: 1, sy: 1 };
  const dx = DERIVA * Math.sin(m.yaw) * Math.cos(m.pitch), dy = -DERIVA * Math.sin(m.pitch) - b.alto;
  const giro = INCLINA * Math.sin(m.yaw) * Math.cos(m.pitch);
  return `translate(${n(dx)} ${n(dy)}) rotate(${n(giro)} ${CX} ${CY}) translate(${CX} ${CY + R}) scale(${(b.sx * escala).toFixed(4)} ${(b.sy * escala).toFixed(4)}) translate(${-CX} ${-(CY + R)})`;
};
const REPOSO_CURSOR: Mirada = { yaw: 0, pitch: -0.06 };
const REPOSO_GUION: Mirada = { yaw: 0, pitch: 0 };

type V = [number, number, number];

/** De la esfera (x derecha, y arriba, z hacia quien mira) a la escena: primero cabeceo, luego giro. */
function rotar([x, y, z]: V, m: Mirada): V {
  const y1 = y * Math.cos(m.pitch) + z * Math.sin(m.pitch);
  const z1 = -y * Math.sin(m.pitch) + z * Math.cos(m.pitch);
  return [x * Math.cos(m.yaw) + z1 * Math.sin(m.yaw), y1, -x * Math.sin(m.yaw) + z1 * Math.cos(m.yaw)];
}
/** La inversa de `rotar`. */
function desrotar([x, y, z]: V, m: Mirada): V {
  const x1 = x * Math.cos(m.yaw) - z * Math.sin(m.yaw);
  const z1 = x * Math.sin(m.yaw) + z * Math.cos(m.yaw);
  return [x1, y * Math.cos(m.pitch) - z1 * Math.sin(m.pitch), y * Math.sin(m.pitch) + z1 * Math.cos(m.pitch)];
}

/** Un ojo (lado −1 izquierdo, 1 derecho) con la esfera girada: dónde cae, hacia dónde se aplasta y cuánto. */
function proyectar(m: Mirada, lado: number) {
  const ex = lado * OJO.ex;
  const [x, y, z] = rotar([Math.sin(ex) * Math.cos(OJO.ey), Math.sin(OJO.ey), Math.cos(ex) * Math.cos(OJO.ey)], m);
  const X = CX + R * x, Y = CY - R * y;
  return { X, Y, ang: (Math.atan2(Y - CY, X - CX) * 180) / Math.PI, z };
}

const n = (v: number) => v.toFixed(2);
const base = (p: ReturnType<typeof proyectar>) =>
  `translate(${n(p.X)} ${n(p.Y)}) rotate(${n(p.ang)}) scale(${n(Math.max(0.001, p.z))} 1) rotate(${n(-p.ang)})`;
const visibilidad = (z: number) => Math.min(1, Math.max(0, z / 0.12));

/** Las esquinas de una píldora, en su plano: cuatro cuartos de círculo de 6 puntos. */
const CUARTOS = [0, 1, 2, 3].map((q) => Array.from({ length: 6 }, (_, k) => ((q + k / 5) * Math.PI) / 2));
/**
 * Un ojo dibujado SOBRE la esfera: la píldora (semiancho `a`, semialto `b`, en radios) se
 * pega a la superficie alrededor de su centro y se proyecta, así que al acercarse al borde
 * se curva y se estrecha como en el Grok Bot. Lo que pasa por detrás se aplasta contra el
 * contorno. Devuelve el trazo cerrado en el SVG.
 */
function pildora(lado: number, m: Mirada, a: number, b: number) {
  const ex = lado * OJO.ex, ce = Math.cos(OJO.ey), se = Math.sin(OJO.ey);
  const d: V = [Math.sin(ex) * ce, se, Math.cos(ex) * ce];
  const ux: V = [Math.cos(ex), 0, -Math.sin(ex)], uy: V = [-Math.sin(ex) * se, ce, -Math.cos(ex) * se];
  const r = Math.min(a, b);
  const centros = [[a - r, b - r], [-(a - r), b - r], [-(a - r), -(b - r)], [a - r, -(b - r)]];
  const pts = CUARTOS.flatMap((angulos, q) => angulos.map((t) => {
    const u = centros[q][0] + r * Math.cos(t), v = centros[q][1] + r * Math.sin(t);
    const p: V = [d[0] + u * ux[0] + v * uy[0], d[1] + u * ux[1] + v * uy[1], d[2] + u * ux[2] + v * uy[2]];
    const l = Math.hypot(...p);
    let [x, y, z] = rotar([p[0] / l, p[1] / l, p[2] / l], m);
    if (z < 0) { const h = Math.hypot(x, y) || 1; x /= h; y /= h; }
    return `${n(CX + R * x)} ${n(CY - R * y)}`;
  }));
  return `M${pts.join('L')}Z`;
}

/**
 * Atributos de los dos ojos para una mirada, un párpado (1 abierto) y una alegría (1 = ojos ^ ^).
 * Al parpadear el ojo no desaparece: se acorta hasta un círculo y acaba en una rayita más
 * ancha que el ojo, como el Grok Bot. `filo` es el contorno del color de la cara.
 */
function pose(m: Mirada, abierto: number, feliz: number) {
  const mm = { yaw: m.yaw, pitch: m.pitch + 0.2 * feliz };
  const a0 = OJO.w / 2 / R, b0 = OJO.h / 2 / R, filo = FILO_OJO / R;
  const a = a0 * (1 + 0.4 * (1 - abierto)), b = Math.max(0.45 * a0, b0 * abierto);
  return [-1, 1].map((lado) => {
    const p = proyectar(mm, lado);
    const vis = visibilidad(p.z);
    return {
      ojo: pildora(lado, mm, a, b),
      filo: pildora(lado, mm, a + filo, b + filo),
      // Feliz, los ojos dejan paso a los arcos ^ ^.
      ojoOp: n(feliz > 0.05 ? 0 : vis),
      arco: `${base(p)} scale(${n(Math.max(0.001, feliz))})`,
      arcoOp: n(feliz < 0.02 ? 0 : vis),
    };
  });
}

// ── El gorro quirúrgico: un casquete de tela sobre la esfera que gira con ella ──
// Su eje va inclinado 10° hacia la nuca, así que tapa más por detrás que por la frente.
// Todo en ángulo desde ese eje: el borde de la banda y su pliegue (arriba de la banda).
// Cada capa es una esfera propia (`Casco`):
// - la banda (centro subido por el eje) corta a la cabeza justo en su borde de abajo
//   (ahí toca la piel, sin volar) y se separa hacia arriba hasta su grosor en el pliegue;
// - la tela, concéntrica con la cabeza, nace EXACTAMENTE del pliegue de la banda —las dos
//   esferas se cortan en ese anillo—: se funde con la banda sin escalón ni hueco y el
//   gorro va al ras, así que el contorno de la figura es un círculo.
// Los ángulos de cada capa se miden desde SU centro.
const GRAD = Math.PI / 180;
const INCL = 10 * GRAD;
const EJE: V = [0, Math.cos(INCL), -Math.sin(INCL)];
const FRENTE: V = [0, Math.sin(INCL), Math.cos(INCL)];
type Casco = { h: number; r: number };
/** El borde de la banda y su pliegue, como ángulos desde el centro de la cabeza: calado, el borde llega casi a los ojos. */
const BORDE_CABEZA = 90 * GRAD, PLIEGUE_CABEZA = 74 * GRAD;
/** Cuánto sube el centro de la banda: lo justo para que el pliegue quede a un 1,7 % de la piel (al ras). */
const ALZA_BANDA = 0.017 / (Math.cos(PLIEGUE_CABEZA) - Math.cos(BORDE_CABEZA));
const BANDA: Casco = { h: ALZA_BANDA, r: Math.sqrt(1 + ALZA_BANDA ** 2 - 2 * ALZA_BANDA * Math.cos(BORDE_CABEZA)) };
/** Dónde corta la banda la dirección del pliegue (desde el centro de la cabeza). */
const T_PLIEGUE = ALZA_BANDA * Math.cos(PLIEGUE_CABEZA) + Math.sqrt(BANDA.r ** 2 - (ALZA_BANDA * Math.sin(PLIEGUE_CABEZA)) ** 2);
const RADIO_ANILLO = T_PLIEGUE * Math.sin(PLIEGUE_CABEZA), ALTURA_ANILLO = T_PLIEGUE * Math.cos(PLIEGUE_CABEZA);
const BORDE = Math.atan2(Math.sin(BORDE_CABEZA), Math.cos(BORDE_CABEZA) - ALZA_BANDA);
/** La franja de la banda sube 1,5° por debajo de la tela: si sólo se tocaran, el suavizado dejaría una raya clara entre las dos. */
const SOLAPE = Math.atan2(RADIO_ANILLO, ALTURA_ANILLO - ALZA_BANDA) - 1.5 * GRAD;
const TELA: Casco = { h: 0, r: Math.hypot(RADIO_ANILLO, ALTURA_ANILLO) };
/** El pliegue visto desde el centro de la tela: ahí la tela toca la banda. */
const UNION = Math.atan2(RADIO_ANILLO, ALTURA_ANILLO);

const comb = (a: number, u: V, b: number, w: V, c3: number, q: V): V =>
  [a * u[0] + b * w[0] + c3 * q[0], a * u[1] + b * w[1] + c3 * q[1], a * u[2] + b * w[2] + c3 * q[2]];
/** El punto del gorro a `th` del eje y longitud `lam` (0 = frente, +90° = derecha). */
const enGorro = (th: number, lam: number): V =>
  comb(Math.cos(th), EJE, Math.sin(th) * Math.cos(lam), FRENTE, Math.sin(th) * Math.sin(lam), [1, 0, 0]);
const punto = (eje: V, l: number): V => [eje[0] * l, eje[1] * l, eje[2] * l];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const anillo = (th: number, pasos: number) => Array.from({ length: pasos }, (_, k) => enGorro(th, (2 * Math.PI * k) / pasos));
/** Los anillos con 96 puntos para las figuras grandes y con 40 para las pequeñas (no se nota y cuesta menos). */
const ANILLOS = {
  fino: { borde: anillo(BORDE, 96), solape: anillo(SOLAPE, 96), union: anillo(UNION, 96) },
  basto: { borde: anillo(BORDE, 40), solape: anillo(SOLAPE, 40), union: anillo(UNION, 40) },
};

/** Los colores del gorro: la banda un tono más clara que la tela y el revés de las cintas, más oscuro. */
const COLOR = { tela: '#133169', banda: '#1d4287', tira: '#1d4287', reves: '#102859', pliegue: '#0b1d40' };

// ── Las cintas de la nuca ──
/** El nudo de la nuca, un poco por encima del borde de la banda. */
const NUDO = punto(enGorro(BORDE_CABEZA - 4 * GRAD, Math.PI), 1.03);
const RADIO_NUDO = 3.8;
/**
 * Las dos cintas (izquierda, derecha): de dos largos, con su `onda` (cuánto serpentean) y
 * su `giro` (medias vueltas a lo largo: en ellas enseñan el revés).
 */
type Cinta = { largo: number; grosor: number; onda: number; giro: number };
const CINTAS: [Cinta, Cinta] = [{ largo: 0.86, grosor: 5.2, onda: 0.04, giro: 1 }, { largo: 0.76, grosor: 5.2, onda: 0, giro: 0.7 }];
/** Muestras de la línea central de una cinta. */
const PASOS_CINTA = 14;
/**
 * La línea central de una cinta en la escena: sale de la nuca hacia su lado y un poco
 * hacia atrás (gira con la cabeza; así, de frente, asoman por los dos lados), serpentea
 * (`onda`), cuelga cada vez más por gravedad (eso no gira) y se queda atrás cuando la
 * cabeza se mueve (`vaiven`).
 */
function lineaCinta(nudo: V, m: Mirada, lado: number, largo: number, onda: number, vaiven: readonly [number, number]): V[] {
  return Array.from({ length: PASOS_CINTA + 1 }, (_, j): V => {
    const u = j / PASOS_CINTA;
    const w = rotar([lado * (1.22 * Math.pow(u, 0.62) + onda * Math.sin(1.6 * Math.PI * u)), 0.8 * onda * u * Math.sin(2 * Math.PI * u), -0.3 * Math.pow(u, 0.8)], m);
    const arrastre = u * u;
    return [nudo[0] + largo * w[0] + vaiven[0] * arrastre, nudo[1] + largo * (w[1] - 0.66 * Math.pow(u, 2.6)) + vaiven[1] * arrastre, nudo[2] + largo * w[2]];
  });
}

/**
 * La cinta en pantalla, como dos regiones: el anverso y los tramos en que se ha dado la
 * vuelta y enseña el revés. En cada media vuelta se estrecha (se ve de canto); nace
 * estrecha bajo el nudo y acaba con un corte en diagonal.
 */
function contornoCinta(linea: V[], cinta: Cinta) {
  const S = linea.map((p) => [CX + R * p[0], CY - R * p[1]]);
  const N = S.length - 1;
  let tx = 0, ty = 1;
  const pts = S.map((s, j) => {
    const a = S[Math.max(0, j - 1)], b = S[Math.min(N, j + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l > 1e-6) { tx = (b[0] - a[0]) / l; ty = (b[1] - a[1]) / l; }
    const u = j / N, vuelta = Math.cos(cinta.giro * Math.PI * u);
    const h = (cinta.grosor / 2) * Math.min(1, 0.45 + 3 * u) * Math.max(0.2, Math.abs(vuelta));
    return { x: s[0], y: s[1], tx, ty, h, reves: vuelta < 0 };
  });
  type P = (typeof pts)[number];
  /** Un punto a `f` del centro hacia la izquierda de la cinta y `g` hacia delante. */
  const en2 = (p: P, f: number, g: number) => `${n(p.x - p.ty * f + p.tx * g)} ${n(p.y + p.tx * f + p.ty * g)}`;
  // Se parte en tramos por la cara que enseña; dos tramos vecinos comparten la muestra del cambio.
  const cortes = [0];
  for (let j = 1; j < N; j++) if (pts[j].reves !== pts[j - 1].reves) cortes.push(j);
  cortes.push(N);
  let anverso = '', reves = '';
  for (let k = 0; k + 1 < cortes.length; k++) {
    const tramo = pts.slice(cortes[k], cortes[k + 1] + 1);
    const fin = pts[N];
    const corte = cortes[k + 1] === N ? [en2(fin, fin.h, fin.h * 0.75), en2(fin, -fin.h, -fin.h * 0.35)] : [];
    const d = `M${[...tramo.map((p) => en2(p, p.h, 0)), ...corte, ...tramo.reverse().map((p) => en2(p, -p.h, 0))].join('L')}Z`;
    if (pts[cortes[k]].reves) reves += d; else anverso += d;
  }
  return { anverso, reves };
}

/** Un punto de la escena (en radios de la cabeza) en el SVG. */
const pantalla = (p: V) => `${n(CX + R * p[0])} ${n(CY - R * p[1])}`;
/** Dónde queda en la escena la dirección `w` (ya girada) de un casco, cuyo centro girado es `c0`. */
const en = (c0: V, casco: Casco, w: V): V => comb(1, c0, casco.r, w, 0, w);

/** Los tramos de una línea de un casco que quedan de frente (normal hacia quien mira), como trazo. */
function tramos(locales: V[], m: Mirada, casco: Casco, cerrada: boolean) {
  const w = locales.map((p) => rotar(p, m));
  const c0 = punto(rotar(EJE, m), casco.h);
  const N = w.length;
  // Una línea cerrada se empieza a recorrer desde un punto oculto, para que cada tramo salga entero.
  const inicio = cerrada ? Math.max(0, w.findIndex((p) => p[2] <= 0)) : 0;
  let d = '', dentro = false;
  for (let k = 0; k <= (cerrada ? N : N - 1); k++) {
    const p = w[(inicio + k) % N];
    if (p[2] > 0) { d += `${dentro ? 'L' : 'M'}${pantalla(en(c0, casco, p))}`; dentro = true; } else dentro = false;
  }
  return d;
}

/**
 * La parte visible de un casco hasta `th` del eje, como región: el tramo del borde que
 * está de frente y, para cerrarla, el arco del contorno del casco que cae dentro del gorro.
 */
function casquete(th: number, ring: V[], m: Mirada, casco: Casco) {
  const w = ring.map((p) => rotar(p, m));
  const c0 = punto(rotar(EJE, m), casco.h);
  const N = w.length;
  const cos = Math.cos(th);
  const dentro = (a: number) => dot(desrotar([Math.cos(a), Math.sin(a), 0], m), EJE) >= cos;
  const s = w.findIndex((p, k) => p[2] > 0 && w[(k - 1 + N) % N][2] <= 0);
  if (s < 0) {
    if (w[0][2] > 0) return `M${w.map((p) => pantalla(en(c0, casco, p))).join('L')}Z`; // el borde entero de frente
    if (dot(desrotar([0, 0, 1], m), EJE) < cos) return '';
    const r = R * casco.r, cx = CX + R * c0[0], cy = CY - R * c0[1];
    return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`;
  }
  const limbo = (a: V, b: V): V => {
    const t = a[2] / (a[2] - b[2]);
    const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, l = Math.hypot(x, y) || 1;
    return [x / l, y / l, 0];
  };
  const pts: V[] = [limbo(w[(s - 1 + N) % N], w[s])];
  let k = s;
  while (w[k % N][2] > 0 && pts.length <= N) { pts.push(w[k % N]); k++; }
  pts.push(limbo(w[(k - 1) % N], w[k % N]));
  // Vuelta por el contorno, del final del borde a su comienzo, por el lado que cae dentro del gorro.
  const a0 = Math.atan2(pts[pts.length - 1][1], pts[pts.length - 1][0]);
  let a1 = Math.atan2(pts[0][1], pts[0][0]);
  let delta = a1 - a0;
  while (delta <= 0) delta += 2 * Math.PI; // sentido antihorario
  if (!dentro(a0 + delta / 2)) delta -= 2 * Math.PI; // el otro sentido
  a1 = a0 + delta;
  // El arco se muestrea en ángulos fijos (múltiplos de 5°), no repartidos entre sus extremos:
  // la banda resta dos casquetes cuyos contornos de arriba son el mismo arco, y sólo con los
  // mismos puntos se anulan del todo; con puntos distintos quedaba una tirita de la banda
  // rodeando el gorro por encima de la tela.
  const paso = 5 * GRAD, sentido = delta > 0 ? 1 : -1;
  for (let k = sentido > 0 ? Math.floor(a0 / paso) + 1 : Math.ceil(a0 / paso) - 1; sentido > 0 ? k * paso < a1 : k * paso > a1; k += sentido) {
    pts.push([Math.cos(k * paso), Math.sin(k * paso), 0]);
  }
  return `M${pts.map((p) => pantalla(en(c0, casco, p))).join('L')}Z`;
}

/**
 * La luz del gorro, muy tenue y quieta en la escena (arriba a la izquierda): el gorro gira
 * por debajo de ella, así que el brillo no sigue a la cabeza en las animaciones.
 */
const LUZ = ((p: V) => [CX + R * p[0], CY - R * p[1]])(enGorro(40 * GRAD, -45 * GRAD));

/** Todo lo que se dibuja del gorro para una mirada. `fino` usa anillos con más puntos (figuras grandes). */
function gorro(m: Mirada, fino: boolean, vaiven: readonly [number, number] = [0, 0]) {
  const an = fino ? ANILLOS.fino : ANILLOS.basto;
  const nudo = rotar(NUDO, m);
  // Con la nuca de frente (en la vuelta), las cintas pasan por delante de la cabeza.
  const delante = nudo[2] > 0;
  const cintas = CINTAS.map((cinta, k) => {
    // Si la cinta fuera a asomar por DEBAJO de la cara (mirando arriba, la nuca baja), se
    // acorta hasta quedar detrás: por los lados sí asoma, por abajo parecería una pata.
    const margen = cinta.grosor / (2 * R);
    const debajo = (p: V) => Math.hypot(p[0], p[1]) >= 0.97 - margen && p[1] <= 0 && Math.abs(p[0]) <= 0.85 * -p[1];
    let linea: V[] = [nudo, nudo, nudo];
    for (let largo = cinta.largo; largo > 0.25; largo -= 0.1) {
      linea = lineaCinta(nudo, m, 2 * k - 1, largo, cinta.onda, vaiven);
      if (delante || !linea.some(debajo)) break;
    }
    return contornoCinta(linea, cinta);
  });
  return {
    // La banda es sólo la franja del borde al pliegue (se pinta con evenodd): por encima del
    // pliegue su esfera asomaría sobre la tela como un filo alrededor de la cúpula.
    banda: casquete(BORDE, an.borde, m, BANDA) + casquete(SOLAPE, an.solape, m, BANDA),
    tela: casquete(UNION, an.union, m, TELA),
    borde: tramos(an.borde, m, BANDA, true),
    // La unión de la tela con la banda: una línea de sombra, el doblez.
    pliegue: tramos(an.union, m, TELA, true),
    cola0: delante ? '' : cintas[0].anverso,
    cola1: delante ? '' : cintas[1].anverso,
    cola0r: delante ? '' : cintas[0].reves,
    cola1r: delante ? '' : cintas[1].reves,
    colaDelante0: delante ? cintas[0].anverso : '',
    colaDelante1: delante ? cintas[1].anverso : '',
    colaDelante0r: delante ? cintas[0].reves : '',
    colaDelante1r: delante ? cintas[1].reves : '',
    nudo: delante ? 'scale(0)' : `translate(${pantalla(nudo)})`,
    nudoDelante: delante ? `translate(${pantalla(nudo)})` : 'scale(0)',
  };
}
type Gorro = ReturnType<typeof gorro>;
type Trazo = Exclude<keyof Gorro, 'nudo' | 'nudoDelante'>;
const TRAZOS: Trazo[] = ['banda', 'tela', 'borde', 'pliegue', 'cola0', 'cola1', 'cola0r', 'cola1r', 'colaDelante0', 'colaDelante1', 'colaDelante0r', 'colaDelante1r'];
/** Las piezas del gorro en el SVG. `brillo` y `brilloBanda` repiten la forma de `tela`/`banda` con la luz. */
type Capa = Partial<Record<Trazo | 'nudo' | 'nudoDelante' | 'brillo' | 'brilloBanda', SVGElement | null>>;

function ponerGorro(capa: Capa, g: Gorro) {
  for (const k of TRAZOS) capa[k]?.setAttribute('d', g[k]);
  capa.nudo?.setAttribute('transform', g.nudo);
  capa.nudoDelante?.setAttribute('transform', g.nudoDelante);
  capa.brillo?.setAttribute('d', g.tela);
  capa.brilloBanda?.setAttribute('d', g.banda);
}

const suave = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
/** Curva de 5.º grado: sale y llega con velocidad y aceleración cero, así el movimiento nunca pega un tirón. */
const fluido = (u: number) => u * u * u * (u * (6 * u - 15) + 10);
const rebote = (u: number) => 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2);

export default function Mascota({ pausado, cls, guion, mirada, silueta = false, detalle = 0 }: {
  pausado: boolean;
  cls: string;
  guion?: keyof typeof GUIONES;
  mirada?: Mirada;
  silueta?: boolean;
  /** 0: anillos del gorro con pocos puntos (figuras diminutas) · 1: con más puntos (figuras grandes). */
  detalle?: 0 | 1;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const ojos = useRef<(SVGPathElement | null)[]>([]);
  const arcos = useRef<(SVGPathElement | null)[]>([]);
  const capa = useRef<Capa>({});
  const todo = useRef<SVGGElement>(null);
  const pausadoRef = useRef(pausado);
  const sincronizar = useRef<() => void>(() => {});
  const id = `dot-${useId().replace(/:/g, '')}`;
  const clip = `${id}-c`, luz = `${id}-l`;
  const reposo = mirada ?? (guion ? REPOSO_GUION : REPOSO_CURSOR);
  const inicial = pose(reposo, 1, 0);
  const fino = !silueta && detalle >= 1;
  const g0 = gorro(reposo, fino);
  /** Cada pieza del gorro, con su forma de reposo y su ref para animarla. */
  const pieza = (k: keyof Capa) => ({
    ref: (el: SVGElement | null) => { capa.current[k] = el; },
    ...(k === 'nudo' || k === 'nudoDelante' ? { transform: g0[k] }
      : { d: k === 'brillo' ? g0.tela : k === 'brilloBanda' ? g0.banda : g0[k] }),
  });

  useEffect(() => {
    const el = host.current;
    if (!el || mirada) return;
    const reducido = matchMedia('(prefers-reduced-motion: reduce)');
    const boton = el.closest('button');
    const reposoM = guion ? REPOSO_GUION : REPOSO_CURSOR;
    const vivo = !!guion && VIVOS.has(guion);
    let frame = 0, visible = true, destruido = false, antes = 0;
    let temporizador = 0, ocio = 0;
    let actual = { ...reposoM }, objetivo = { ...reposoM };
    let parpado: null | { tipo: 'parpadeo' | 'feliz'; t0: number; ms: number } = null;
    // El guion en curso (el propio, o el vistazo de la del cursor) y su paso.
    let pasos: Paso[] | null = guion ? GUIONES[guion] : null;
    let i = 0, t0 = 0, desde = { ...actual };
    // El brinco en curso (−1 sin brinco) y el muelle que sigue a la mirada en los guiones vivos.
    let salto = -1;
    let muelle = { ...actual }, velMuelle = [0, 0], metaAntes: Mirada | null = null;
    const activo = () => !destruido && !pausadoRef.current && !reducido.matches && !document.hidden && visible;

    // Las cintas se quedan atrás cuando la nuca se mueve y vuelven con un vaivén: un
    // muelle amortiguado cuyo reposo es la velocidad del nudo, a la contra.
    const conVaiven = !silueta;
    let vaiven: [number, number] = [0, 0], velVaiven = [0, 0], nudoAntes: number[] | null = null;
    const mecer = (dt: number, m: Mirada) => {
      const p = rotar(NUDO, m), x = p[0], y = p[1];
      if (nudoAntes && dt > 0) {
        const v = [(x - nudoAntes[0]) / dt, (y - nudoAntes[1]) / dt];
        for (let falta = dt; falta > 0; falta -= 16) {
          const h = Math.min(16, falta);
          for (const k of [0, 1]) {
            velVaiven[k] += (0.00011 * (-26 * v[k] - vaiven[k]) - 0.0075 * velVaiven[k]) * h;
            vaiven[k] = Math.max(-0.3, Math.min(0.3, vaiven[k] + velVaiven[k] * h));
          }
        }
      }
      nudoAntes = [x, y];
    };
    const meciendo = () => conVaiven && Math.abs(vaiven[0]) + Math.abs(vaiven[1]) + 60 * (Math.abs(velVaiven[0]) + Math.abs(velVaiven[1])) > 0.001;

    let ultima: Mirada | null = null, vaivenPintado = [0, 0], cuerpoPintado = '';
    const pintar = (m: Mirada, abierto: number, feliz: number, escala = 1, salto = -1) => {
      // El gorro sólo cambia con la mirada (o con el vaivén): un parpadeo con la cabeza quieta no lo recalcula.
      if (!ultima || ultima.yaw !== m.yaw || ultima.pitch !== m.pitch || vaiven[0] !== vaivenPintado[0] || vaiven[1] !== vaivenPintado[1]) {
        ponerGorro(capa.current, gorro(m, fino, vaiven));
        ultima = { ...m };
        vaivenPintado = [...vaiven];
      }
      const forma = cuerpo(m, escala, salto);
      if (forma !== cuerpoPintado) { todo.current?.setAttribute('transform', forma); cuerpoPintado = forma; }
      // Cada ojo y cada arco van dos veces: el filo del color de la cara y, encima, el ojo.
      pose(m, abierto, feliz).forEach((p, k) => {
        ojos.current[2 * k]?.setAttribute('d', p.filo);
        ojos.current[2 * k + 1]?.setAttribute('d', p.ojo);
        for (const o of [ojos.current[2 * k], ojos.current[2 * k + 1]]) o?.setAttribute('opacity', p.ojoOp);
        for (const a of [arcos.current[2 * k], arcos.current[2 * k + 1]]) {
          a?.setAttribute('transform', p.arco);
          a?.setAttribute('opacity', p.arcoOp);
        }
      });
    };

    const parpados = (ahora: number) => {
      if (!parpado) return { a: 1, f: 0 };
      const e = ahora - parpado.t0, d = parpado.ms;
      if (e >= d) { parpado = null; return { a: 1, f: 0 }; }
      if (parpado.tipo === 'parpadeo') {
        const u = e / d;
        return { a: u < 0.42 ? 1 - suave(u / 0.42) : suave((u - 0.42) / 0.58), f: 0 };
      }
      const a = e < 100 ? 1 - e / 100 : e > d - 130 ? (e - (d - 130)) / 130 : 0;
      const f = e < 60 ? 0 : e < 260 ? rebote((e - 60) / 200) : e > d - 230 ? Math.max(0, 1 - (e - (d - 230)) / 100) : 1;
      return { a, f };
    };
    const lanzar = (tipo: 'parpadeo' | 'feliz', ms: number) => { parpado = { tipo, t0: performance.now(), ms }; };

    /** Avanza el guion hasta `ahora` y devuelve la mirada que toca. */
    const reproducir = (ahora: number): Mirada | null => {
      salto = -1;
      while (pasos) {
        const p = pasos[i];
        if (p.t === 'parpadeo' || p.t === 'feliz') {
          lanzar(p.t, p.t === 'feliz' ? p.ms : 180);
        } else {
          const u = Math.min(1, (ahora - t0) / p.ms);
          if (u < 1) {
            if (p.t === 'pausa') return desde;
            if (p.t === 'salto') { salto = u; return desde; }
            // Arranca y frena sin tirones (velocidad y aceleración nulas en los extremos).
            const k = fluido(u);
            const hasta = p.t === 'vuelta' ? p.yaw - 2 * Math.PI : p.yaw;
            return { yaw: desde.yaw + (hasta - desde.yaw) * k, pitch: desde.pitch + (p.pitch - desde.pitch) * k };
          }
          if (p.t === 'mirar' || p.t === 'vuelta') desde = { yaw: p.yaw, pitch: p.pitch };
          t0 += p.ms;
        }
        i += 1;
        if (i >= pasos.length) {
          if (guion) i = 0;
          else { pasos = null; return null; } // el vistazo terminó: vuelve al cursor
        }
      }
      return null;
    };

    const dibujar = (ahora: number) => {
      frame = 0;
      if (!activo()) return;
      const dt = Math.min(64, ahora - (antes || ahora));
      antes = ahora;
      const delGuion = reproducir(ahora);
      if (delGuion) actual = delGuion;
      else {
        const k = 1 - Math.exp(-dt / 110);
        actual = { yaw: actual.yaw + (objetivo.yaw - actual.yaw) * k, pitch: actual.pitch + (objetivo.pitch - actual.pitch) * k };
      }
      // Los guiones vivos nunca se quedan quietos: la deriva y la respiración van encima del
      // guion, y la mirada lo sigue con un muelle (llega con un pequeño rebote).
      const s = ahora / 1000;
      let vista = actual;
      if (vivo) {
        const d = derivaViva(s), meta = { yaw: actual.yaw + d.yaw, pitch: actual.pitch + d.pitch };
        // Al acabar una vuelta el guion salta 2π (la misma pose): el muelle salta con él.
        if (metaAntes && Math.abs(meta.yaw - metaAntes.yaw) > Math.PI) muelle.yaw += 2 * Math.PI * Math.round((meta.yaw - metaAntes.yaw) / (2 * Math.PI));
        metaAntes = meta;
        for (let falta = dt; falta > 0; falta -= 16) {
          const h = Math.min(16, falta);
          velMuelle[0] += (MUELLE.k * (meta.yaw - muelle.yaw) - MUELLE.c * velMuelle[0]) * h;
          velMuelle[1] += (MUELLE.k * (meta.pitch - muelle.pitch) - MUELLE.c * velMuelle[1]) * h;
          muelle = { yaw: muelle.yaw + velMuelle[0] * h, pitch: muelle.pitch + velMuelle[1] * h };
        }
        vista = muelle;
      }
      if (conVaiven) mecer(dt, vista);
      const { a, f } = parpados(ahora);
      pintar(vista, a, f, vivo ? respiracion(s) : 1, salto);
      const quieto = !pasos && !parpado && !meciendo() && Math.abs(objetivo.yaw - actual.yaw) + Math.abs(objetivo.pitch - actual.pitch) < 0.002;
      if (!quieto) frame = requestAnimationFrame(dibujar);
      else antes = 0;
    };
    function despertar() { if (!frame && activo()) frame = requestAnimationFrame(dibujar); }

    const planearOcio = () => {
      clearTimeout(ocio);
      if (guion || !activo()) return;
      ocio = window.setTimeout(() => {
        if (!activo()) return;
        pasos = OCIOSO; i = 0; t0 = performance.now(); desde = { ...actual };
        despertar();
      }, 7000);
    };
    const mover = (e: PointerEvent) => {
      if (guion || !activo() || e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      objetivo = { yaw: 0.85 * Math.tanh(dx / 380), pitch: Math.max(-0.6, Math.min(0.55, -0.65 * Math.tanh(dy / 320))) };
      if (pasos) { pasos = null; } // el puntero manda sobre el vistazo
      planearOcio();
      despertar();
    };
    const planearParpadeo = () => {
      clearTimeout(temporizador);
      if (guion || !activo()) return;
      temporizador = window.setTimeout(() => {
        if (!activo()) return;
        if (!parpado) {
          lanzar('parpadeo', 180); despertar();
          if (Math.random() < 0.2) window.setTimeout(() => { if (activo() && !parpado) { lanzar('parpadeo', 170); despertar(); } }, 260);
        }
        planearParpadeo();
      }, 2600 + Math.random() * 3600);
    };
    const alegrar = () => { if (activo()) { lanzar('feliz', 1350); despertar(); } };

    const sync = () => {
      clearTimeout(temporizador); clearTimeout(ocio); cancelAnimationFrame(frame); frame = 0; antes = 0;
      parpado = null;
      ultima = null; cuerpoPintado = ''; salto = -1;
      muelle = { ...reposoM }; velMuelle = [0, 0]; metaAntes = null;
      vaiven = [0, 0]; velVaiven = [0, 0]; nudoAntes = null;
      actual = { ...reposoM }; objetivo = { ...reposoM };
      pasos = guion ? GUIONES[guion] : null; i = 0; t0 = performance.now(); desde = { ...reposoM };
      pintar(reposoM, 1, 0);
      if (!activo()) return;
      if (guion) despertar();
      planearParpadeo(); planearOcio();
    };
    sincronizar.current = sync;

    const io = new IntersectionObserver((entradas) => { visible = entradas[0].isIntersecting; sync(); });
    io.observe(el);
    if (!guion) {
      window.addEventListener('pointermove', mover, { passive: true });
      window.addEventListener('pointerdown', mover, { passive: true });
    }
    document.addEventListener('visibilitychange', sync);
    reducido.addEventListener('change', sync);
    boton?.addEventListener('click', alegrar);
    return () => {
      destruido = true;
      io.disconnect();
      clearTimeout(temporizador); clearTimeout(ocio); cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerdown', mover);
      document.removeEventListener('visibilitychange', sync);
      reducido.removeEventListener('change', sync);
      boton?.removeEventListener('click', alegrar);
    };
  }, [guion, mirada, fino]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { pausadoRef.current = pausado; sincronizar.current(); }, [pausado]);

  /** Un ojo; con `filo`, su contorno del color de la cara, que va debajo y lo despega de la banda. */
  const ojo = (k: number, filo = false) => (
    <path
      ref={(r) => { ojos.current[2 * k + (filo ? 0 : 1)] = r; }}
      d={filo ? inicial[k].filo : inicial[k].ojo} opacity={inicial[k].ojoOp}
      {...(silueta ? { fill: 'none', vectorEffect: 'non-scaling-stroke' } : { fill: filo ? 'var(--dot-cuerpo, #f3f5f8)' : 'var(--dot-ojo, #0e141b)' })}
    />
  );
  const arco = (k: number, filo = false) => (
    <path
      ref={(r) => { arcos.current[2 * k + (filo ? 0 : 1)] = r; }}
      d="M-9 5Q0-11 9 5" fill="none" stroke={silueta ? 'currentColor' : filo ? 'var(--dot-cuerpo, #f3f5f8)' : 'var(--dot-ojo, #0e141b)'}
      strokeWidth={silueta ? undefined : 6.5 + (filo ? 2 * FILO_OJO : 0)} strokeLinecap="round"
      transform={inicial[k].arco} opacity={inicial[k].arcoOp}
      {...(silueta ? { vectorEffect: 'non-scaling-stroke' } : {})}
    />
  );
  /** Las dos cintas, por detrás de la esfera o (con la nuca de frente) por delante, cada una con su revés. */
  const cintas = (delante: boolean) => {
    const k0 = delante ? 'colaDelante0' : 'cola0', k1 = delante ? 'colaDelante1' : 'cola1';
    return (
      <g>
        <path {...pieza(k0)} fill={COLOR.tira} />
        <path {...pieza(`${k0}r` as const)} fill={COLOR.reves} />
        <path {...pieza(k1)} fill={COLOR.tira} />
        <path {...pieza(`${k1}r` as const)} fill={COLOR.reves} />
      </g>
    );
  };

  return (
    <span ref={host} className={c(cls)} data-mascot="" aria-hidden="true">
      <svg className={c('dot-art')} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clip}><circle cx={CX} cy={CY} r={R} /></clipPath>
          {/* La luz del gorro: casi nada, y quieta (no gira con la cabeza). */}
          <radialGradient id={luz} gradientUnits="userSpaceOnUse" cx={n(LUZ[0])} cy={n(LUZ[1])} r="66">
            <stop offset="0" stopColor="#fff" stopOpacity=".1" />
            <stop offset=".45" stopColor="#fff" stopOpacity=".02" />
            <stop offset=".75" stopColor="#021d4a" stopOpacity=".04" />
            <stop offset="1" stopColor="#021d4a" stopOpacity=".14" />
          </radialGradient>
        </defs>
        <g ref={todo} transform={cuerpo(reposo)}>
        {silueta ? (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx={CX} cy={CY} r={R} vectorEffect="non-scaling-stroke" />
            <path {...pieza('borde')} vectorEffect="non-scaling-stroke" />
            <path {...pieza('pliegue')} vectorEffect="non-scaling-stroke" />
            <g clipPath={`url(#${clip})`}>{ojo(0)}{ojo(1)}{arco(0)}{arco(1)}</g>
          </g>
        ) : (
          <>
            {/* Las cintas van por detrás de la esfera: de frente asoman por los lados. */}
            {cintas(false)}
            <circle {...pieza('nudo')} r={RADIO_NUDO} fill={COLOR.tira} />
            <circle cx={CX} cy={CY} r={R} fill="var(--dot-cuerpo, #f3f5f8)" />
            {/* La sombra que la banda deja sobre la cara */}
            <path {...pieza('borde')} fill="none" stroke="#0a2a5e" strokeOpacity=".22" strokeWidth="3.2" strokeLinecap="round" />
            <path {...pieza('banda')} fill={COLOR.banda} fillRule="evenodd" />
            <path {...pieza('brilloBanda')} fill={`url(#${luz})`} fillRule="evenodd" />
            <path {...pieza('tela')} fill={COLOR.tela} />
            <path {...pieza('pliegue')} fill="none" stroke={COLOR.pliegue} strokeOpacity=".85" strokeWidth="1.3" strokeLinecap="round" />
            <path {...pieza('brillo')} fill={`url(#${luz})`} />
            {/* En la vuelta entera, con la nuca de frente, las cintas van por delante */}
            {cintas(true)}
            <circle {...pieza('nudoDelante')} r={RADIO_NUDO} fill={COLOR.tira} />
            {/* Los ojos, por delante del gorro: primero su filo del color de la cara, luego el ojo. */}
            <g clipPath={`url(#${clip})`}>{ojo(0, true)}{ojo(1, true)}{arco(0, true)}{arco(1, true)}{ojo(0)}{ojo(1)}{arco(0)}{arco(1)}</g>
          </>
        )}
        </g>
      </svg>
    </span>
  );
}
