'use client';
import { useEffect, useId, useRef } from 'react';
import { c } from './estilos';

/**
 * DOT, la mascota de GO: una esfera blanca con gorro quirúrgico azul y dos ojos en
 * píldora que viven SOBRE la esfera (como el Grok Bot de xAI). La mirada es una
 * rotación de la esfera: cada ojo es un punto de su superficie que se proyecta en
 * el plano, y cerca del borde se aplasta hacia el centro (escorzo) hasta perderse
 * detrás. El gorro quirúrgico es un casquete de tela sobre la misma esfera y gira con
 * ella: tela abombada con trama y frunces, banda doblada con pespunte, dos costuras de
 * paneles y las cintas de la nuca, que asoman por detrás al girar. El brillo y la sombra
 * van pegados al gorro y giran con él. `detalle` elige cuánto se dibuja según el tamaño
 * (las figuras diminutas van simples y con menos puntos).
 *
 * Tres modos:
 *  - cursor (por defecto): sigue al puntero, parpadea solo, al quedarse quieto el
 *    puntero echa un vistazo alrededor, y el botón que la contiene la pone feliz.
 *  - `guion`: recorre un guion en bucle (puntos cardinales, parpadeos, una vuelta entera).
 *  - `mirada`: quieta, mirando a donde se le diga (siluetas de decoración).
 * `silueta` la pinta en contorno. Todo se para con `pausado`, movimiento reducido,
 * pestaña oculta o fuera de vista, y vuelve a la pose de reposo. Escribe directo en
 * el SVG (refs): animar no re-renderiza.
 */

type Mirada = { yaw: number; pitch: number };
type Paso =
  | { t: 'mirar'; yaw: number; pitch: number; ms: number }
  /** Una vuelta entera (360°) sobre su eje, con un saltito. */
  | { t: 'vuelta'; ms: number }
  | { t: 'pausa'; ms: number }
  | { t: 'parpadeo' }
  | { t: 'feliz'; ms: number };

const mirar = (yaw: number, pitch: number, ms: number): Paso => ({ t: 'mirar', yaw, pitch, ms });
const pausa = (ms: number): Paso => ({ t: 'pausa', ms });
const PARPADEO: Paso = { t: 'parpadeo' };

const GUIONES = {
  /** Los puntos cardinales con calma y, al final, una vuelta de 360° (amago, vuelta con saltito y asiento). */
  cardinal: [
    pausa(1400), mirar(0, 0.55, 650), pausa(900), PARPADEO, pausa(350),
    mirar(0.8, 0, 750), pausa(1000), mirar(0, -0.5, 700), pausa(900), PARPADEO,
    mirar(-0.8, 0, 850), pausa(1000), mirar(0, 0, 600), pausa(800),
    mirar(-0.3, 0.06, 420), pausa(120), { t: 'vuelta', ms: 1900 }, mirar(0.12, 0, 260), mirar(0, 0, 320), pausa(500), PARPADEO, pausa(1500),
  ],
  /** La silueta del final: mira más lejos (un ojo se pierde tras el borde) y parpadea. */
  silueta: [
    pausa(1600), mirar(-1.25, 0.3, 1000), pausa(1300), PARPADEO, pausa(500),
    mirar(1.25, 0.3, 1300), pausa(1300), mirar(0, 0.7, 900), pausa(1100), PARPADEO,
    mirar(0, -0.55, 900), pausa(1200), mirar(0, 0, 800), pausa(400), PARPADEO, pausa(1800),
  ],
} satisfies Record<string, Paso[]>;

/** Lo que hace la del cursor si el puntero se queda quieto un rato. */
const OCIOSO: Paso[] = [mirar(-0.7, 0.15, 520), pausa(700), mirar(0.7, 0.15, 700), pausa(700), PARPADEO, mirar(0, -0.06, 500)];

// ── Geometría (viewBox 0 0 120 120) ──
const CX = 60, CY = 63, R = 52;
const OJO = { ex: 0.25, ey: -0.1, w: 13, h: 29 };
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

/** Atributos de los dos ojos para una mirada, un párpado (1 abierto) y una alegría (1 = ojos ^ ^). */
function pose(m: Mirada, abierto: number, feliz: number) {
  const mm = { yaw: m.yaw, pitch: m.pitch + 0.2 * feliz };
  return [-1, 1].map((lado) => {
    const p = proyectar(mm, lado);
    const vis = visibilidad(p.z);
    return {
      ojo: `${base(p)} scale(1 ${n(Math.max(0.05, abierto))})`,
      ojoOp: n(abierto < 0.08 ? 0 : vis),
      arco: `${base(p)} scale(${n(Math.max(0.001, feliz))})`,
      arcoOp: n(feliz < 0.02 ? 0 : vis),
    };
  });
}

// ── El gorro quirúrgico: un casquete de tela sobre la esfera que gira con ella ──
// Su eje va inclinado 10° hacia la nuca, así que tapa más por detrás que por la frente.
// Todo en ángulo desde ese eje: el borde de la banda, el pliegue (arriba de la banda) y
// el pespunte. Cada capa es una esfera propia (`Casco`), con el centro subido por el eje:
// - la banda corta a la cabeza justo en su borde de abajo (ahí toca la piel, sin volar)
//   y se va separando hacia arriba hasta su grosor en el pliegue;
// - la tela, más abombada, nace EXACTAMENTE del pliegue de la banda —las dos esferas se
//   cortan en ese anillo—, así que arriba sobresale (el volumen) y abajo se funde con la
//   banda sin escalón ni hueco.
// Los ángulos de cada capa se miden desde SU centro.
const GRAD = Math.PI / 180;
const INCL = 10 * GRAD;
const EJE: V = [0, Math.cos(INCL), -Math.sin(INCL)];
const FRENTE: V = [0, Math.sin(INCL), Math.cos(INCL)];
type Casco = { h: number; r: number };
/** El borde de la banda y su pliegue, como ángulos desde el centro de la cabeza. */
const BORDE_CABEZA = 84 * GRAD, PLIEGUE_CABEZA = 73 * GRAD;
/** Cuánto sube el centro de la banda: con 0,17 el pliegue queda a un 3 % de la piel. */
const ALZA_BANDA = 0.17;
const BANDA: Casco = { h: ALZA_BANDA, r: Math.sqrt(1 + ALZA_BANDA ** 2 - 2 * ALZA_BANDA * Math.cos(BORDE_CABEZA)) };
/** Dónde corta la banda la dirección `th` (desde el centro de la cabeza): distancia y ángulo desde el centro de la banda. */
function sobreBanda(th: number) {
  const t = ALZA_BANDA * Math.cos(th) + Math.sqrt(BANDA.r ** 2 - (ALZA_BANDA * Math.sin(th)) ** 2);
  return { t, ang: Math.atan2(t * Math.sin(th), t * Math.cos(th) - ALZA_BANDA) };
}
const BORDE = Math.atan2(Math.sin(BORDE_CABEZA), Math.cos(BORDE_CABEZA) - ALZA_BANDA);
const PLIEGUE_B = sobreBanda(PLIEGUE_CABEZA);
const PLIEGUE = PLIEGUE_B.ang, PESPUNTE = sobreBanda(78.5 * GRAD).ang;
/** Cuánto sube el centro de la tela: más alto, más abombada por arriba. */
const ALZA_TELA = 0.1;
const RADIO_ANILLO = PLIEGUE_B.t * Math.sin(PLIEGUE_CABEZA), ALTURA_ANILLO = PLIEGUE_B.t * Math.cos(PLIEGUE_CABEZA) - ALZA_TELA;
const TELA: Casco = { h: ALZA_TELA, r: Math.hypot(RADIO_ANILLO, ALTURA_ANILLO) };
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
  fino: { borde: anillo(BORDE, 96), pliegue: anillo(PLIEGUE, 96), union: anillo(UNION, 96), pespunte: anillo(PESPUNTE, 96) },
  basto: { borde: anillo(BORDE, 40), pliegue: anillo(PLIEGUE, 40), union: anillo(UNION, 40), pespunte: [] as V[] },
};
/** Dónde da la luz en el gorro (arriba a la izquierda de la frente): gira con la cabeza, y con ella el brillo y la sombra. */
const LUZ = enGorro(40 * GRAD, -45 * GRAD);

/** Una costura de panel: de la frente a la nuca por la coronilla, en el plano a `x` del centro. */
const costura = (x: number) => {
  const r = Math.sqrt(1 - x * x);
  return Array.from({ length: 41 }, (_, k): V => {
    const a = -1.2 + (2.4 * k) / 40;
    return comb(x, [1, 0, 0], r * Math.cos(a), EJE, r * Math.sin(a), FRENTE);
  }).filter((p) => dot(p, EJE) >= Math.cos(UNION - 2 * GRAD));
};
/**
 * Las dos costuras de los paneles, a ±0,24 del centro. Cada una es una hendidura (la
 * línea oscura), su filo iluminado del lado de la luz y un pespunte paralelo.
 */
const COSTURAS = [-0.24, 0.24].map((x) => costura(x));
const COSTURAS_FILO = [-0.24, 0.24].map((x) => costura(x - 0.013));
const COSTURAS_PESPUNTE = [-0.24, 0.24].map((x) => costura(x + 0.032));

/**
 * Los frunces de la tela al juntarse con la banda: cada uno es un pliegue que sube desde
 * la unión y se afina hasta desaparecer, con una cara en sombra y otra con luz. Largos
 * distintos, para que no parezca una regla.
 */
const FRUNCES = Array.from({ length: 22 }, (_, k) => {
  const lam = (k * (360 / 22) + 6) * GRAD;
  const largo = (8 + ((k * 7) % 5) * 1.4) * GRAD;
  const pasos = 8;
  const centro: V[] = [], izq: V[] = [], der: V[] = [];
  for (let j = 0; j <= pasos; j++) {
    const u = j / pasos;
    const th = UNION - 0.6 * GRAD - u * largo;
    const l = lam + Math.sin(u * 2.6 + k) * 1.1 * GRAD; // un poco ondulado
    // Ancho abajo y lados cóncavos: un pliegue suave que se pierde en la tela, no un diente.
    const ancho = 3.4 * GRAD * Math.pow(1 - u, 1.7);
    centro.push(enGorro(th, l)); izq.push(enGorro(th, l - ancho)); der.push(enGorro(th, l + ancho));
  }
  return { sombra: [...izq, ...centro.slice().reverse()], luz: [...centro, ...der.slice().reverse()] };
});

/**
 * Las cintas atadas en la nuca. Cada cola sale de la nuca hacia atrás (eso gira con la
 * cabeza) y cae por gravedad (eso no): así, al girar de lado, las dos asoman por detrás
 * de la esfera, y nunca cuelgan por debajo de la cara. Por cola: el punto de control y la
 * punta, cada uno como [hacia atrás, en la cabeza] + [caída, en la escena].
 */
const NUDO = punto(enGorro(BORDE_CABEZA - 4 * GRAD, Math.PI), 1.03);
const COLAS: [V, number][][] = [-1, 1].map((lado) => [
  [[lado * 0.07, 0, -0.22], 0.2],
  [[lado * 0.13, 0, -0.42], 0.4],
]);

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
  const pasos = Math.max(2, Math.ceil(Math.abs(delta) / (5 * GRAD)));
  for (let j = 1; j < pasos; j++) {
    const a = a0 + (delta * j) / pasos;
    pts.push([Math.cos(a), Math.sin(a), 0]);
  }
  return `M${pts.map((p) => pantalla(en(c0, casco, p))).join('L')}Z`;
}

/** Una mancha pequeña de un casco (un frunce): sólo si está entera de frente, para que no se corte en el borde. */
function mancha(locales: V[], m: Mirada, casco: Casco) {
  const w = locales.map((p) => rotar(p, m));
  if (w.some((p) => p[2] < 0.04)) return '';
  const c0 = punto(rotar(EJE, m), casco.h);
  return `M${w.map((p) => pantalla(en(c0, casco, p))).join('L')}Z`;
}

const CORONA_REPOSO = en(punto(EJE, TELA.h), TELA, EJE);
/** Dónde cae el brillo con la cabeza de frente: a eso vuelve cuando el punto de luz se va detrás. */
const LUZ_FIJA = ((p: V) => [CX + R * p[0], CY - R * p[1]])(en(punto(EJE, TELA.h), TELA, LUZ));

/**
 * Todo lo que se dibuja del gorro para una mirada. Sin `detalle` (figuras pequeñas) sólo
 * salen banda, tela, pliegue, sombras, brillo y cintas, con anillos de menos puntos:
 * costuras, frunces, pespunte y trama no se distinguen a ese tamaño.
 */
function gorro(m: Mirada, detalle: boolean) {
  const an = detalle ? ANILLOS.fino : ANILLOS.basto;
  const c0 = punto(rotar(EJE, m), TELA.h);
  // El brillo sigue a un punto de la tela; cuando ese punto se va detrás (en la vuelta
  // entera), vuelve hacia donde está la luz, para no brillar a través de la cabeza.
  const luzW = rotar(LUZ, m), luz = en(c0, TELA, luzW);
  const peso = Math.min(1, Math.max(0, (luzW[2] + 0.1) / 0.5));
  const luzX = LUZ_FIJA[0] + (CX + R * luz[0] - LUZ_FIJA[0]) * peso;
  const luzY = LUZ_FIJA[1] + (CY - R * luz[1] - LUZ_FIJA[1]) * peso;
  // La trama de la tela se desliza con la coronilla, para que se vea girar con la cabeza.
  const corona = en(c0, TELA, rotar(EJE, m));
  const nudo = rotar(NUDO, m);
  // Con la nuca de frente (en la vuelta), las cintas pasan por delante de la cabeza.
  const delante = nudo[2] > 0;
  const colas = COLAS.map((cola) => {
    // Si la punta fuera a asomar por DEBAJO de la cara (mirando arriba, la nuca baja), la
    // cola se acorta hasta quedar detrás: por los lados sí asoma, por abajo parecerían patas.
    let largo = 1, b: V = nudo, e: V = nudo;
    for (; largo > 0.25; largo -= 0.1) {
      [b, e] = cola.map(([atras, caida]) => comb(1, nudo, largo, rotar(atras, m), -caida * largo, [0, 1, 0]));
      if (delante || Math.hypot(e[0], e[1]) < 0.97 || e[1] > 0 || Math.abs(e[0]) > 0.55 * -e[1]) break;
    }
    return `M${pantalla(nudo)}Q${pantalla(b)} ${pantalla(e)}`;
  }).join('');
  return {
    banda: casquete(BORDE, an.borde, m, BANDA),
    tela: casquete(UNION, an.union, m, TELA),
    borde: tramos(an.borde, m, BANDA, true),
    // La unión de la tela con la banda: una costura suave, no un corte.
    pliegue: tramos(an.union, m, TELA, true),
    pespunte: detalle ? tramos(an.pespunte, m, BANDA, true) : '',
    frunceSombra: detalle ? FRUNCES.map((f) => mancha(f.sombra, m, TELA)).join('') : '',
    frunceLuz: detalle ? FRUNCES.map((f) => mancha(f.luz, m, TELA)).join('') : '',
    costuras: detalle ? COSTURAS.map((c3) => tramos(c3, m, TELA, false)).join('') : '',
    costurasFilo: detalle ? COSTURAS_FILO.map((c3) => tramos(c3, m, TELA, false)).join('') : '',
    costurasPespunte: detalle ? COSTURAS_PESPUNTE.map((c3) => tramos(c3, m, TELA, false)).join('') : '',
    colas: delante ? '' : colas,
    colasDelante: delante ? colas : '',
    nudo: delante ? 'scale(0)' : `translate(${pantalla(nudo)})`,
    nudoDelante: delante ? `translate(${pantalla(nudo)})` : 'scale(0)',
    luz: [n(luzX), n(luzY)] as const,
    trama: `translate(${n(R * (corona[0] - CORONA_REPOSO[0]))} ${n(-R * (corona[1] - CORONA_REPOSO[1]))})`,
  };
}
type Gorro = ReturnType<typeof gorro>;
type Trazo = Exclude<keyof Gorro, 'nudo' | 'nudoDelante' | 'luz' | 'trama'>;
const TRAZOS: Trazo[] = ['banda', 'tela', 'borde', 'pliegue', 'pespunte', 'frunceSombra', 'frunceLuz', 'costuras', 'costurasFilo', 'costurasPespunte', 'colas', 'colasDelante'];
/**
 * Las piezas del gorro en el SVG. `brillo`, `brilloBanda` y `tejido` repiten la forma de
 * `tela`/`banda` con el degradado de luz o la trama; `luz` y `trama` son el degradado y el
 * patrón, que se mueven con la cabeza.
 */
type Capa = Partial<Record<Trazo | 'nudo' | 'nudoDelante' | 'brillo' | 'brilloBanda' | 'tejido' | 'luz' | 'trama', SVGElement | null>>;

function ponerGorro(capa: Capa, g: Gorro) {
  for (const k of TRAZOS) capa[k]?.setAttribute('d', g[k]);
  capa.nudo?.setAttribute('transform', g.nudo);
  capa.nudoDelante?.setAttribute('transform', g.nudoDelante);
  capa.brillo?.setAttribute('d', g.tela);
  capa.tejido?.setAttribute('d', g.tela);
  capa.brilloBanda?.setAttribute('d', g.banda);
  capa.luz?.setAttribute('cx', g.luz[0]);
  capa.luz?.setAttribute('cy', g.luz[1]);
  capa.trama?.setAttribute('patternTransform', g.trama);
}

const suave = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const rebote = (u: number) => 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2);

export default function Mascota({ pausado, cls, guion, mirada, silueta = false, detalle = 0 }: {
  pausado: boolean;
  cls: string;
  guion?: keyof typeof GUIONES;
  mirada?: Mirada;
  silueta?: boolean;
  /** 0: gorro simple (figuras diminutas) · 1: con costuras, frunces, pespunte y cintas · 2: además la trama de la tela (figuras grandes). */
  detalle?: 0 | 1 | 2;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const ojos = useRef<(SVGRectElement | null)[]>([]);
  const arcos = useRef<(SVGPathElement | null)[]>([]);
  const capa = useRef<Capa>({});
  const todo = useRef<SVGGElement>(null);
  const pausadoRef = useRef(pausado);
  const sincronizar = useRef<() => void>(() => {});
  const id = `dot-${useId().replace(/:/g, '')}`;
  const clip = `${id}-c`, luz = `${id}-l`, trama = `${id}-t`;
  const reposo = mirada ?? (guion ? REPOSO_GUION : REPOSO_CURSOR);
  const inicial = pose(reposo, 1, 0);
  const fino = !silueta && detalle >= 1, conTrama = fino && detalle === 2;
  const g0 = gorro(reposo, fino);
  /** Cada pieza del gorro, con su forma de reposo y su ref para animarla. */
  const pieza = (k: keyof Capa) => ({
    ref: (el: SVGElement | null) => { capa.current[k] = el; },
    ...(k === 'nudo' || k === 'nudoDelante' ? { transform: g0[k] }
      : k === 'luz' ? { cx: g0.luz[0], cy: g0.luz[1] }
        : k === 'trama' ? { patternTransform: g0.trama }
          : { d: k === 'brillo' || k === 'tejido' ? g0.tela : k === 'brilloBanda' ? g0.banda : g0[k] }),
  });

  useEffect(() => {
    const el = host.current;
    if (!el || mirada) return;
    const reducido = matchMedia('(prefers-reduced-motion: reduce)');
    const boton = el.closest('button');
    const reposoM = guion ? REPOSO_GUION : REPOSO_CURSOR;
    let frame = 0, visible = true, destruido = false, antes = 0;
    let temporizador = 0, ocio = 0;
    let actual = { ...reposoM }, objetivo = { ...reposoM };
    let parpado: null | { tipo: 'parpadeo' | 'feliz'; t0: number; ms: number } = null;
    // El guion en curso (el propio, o el vistazo de la del cursor) y su paso.
    let pasos: Paso[] | null = guion ? GUIONES[guion] : null;
    let i = 0, t0 = 0, desde = { ...actual };
    // El saltito de la vuelta entera (0 en el suelo, 1 en lo más alto).
    let salto = 0, saltoPintado = 0;
    const activo = () => !destruido && !pausadoRef.current && !reducido.matches && !document.hidden && visible;

    let ultima: Mirada | null = null;
    const pintar = (m: Mirada, abierto: number, feliz: number) => {
      // El gorro sólo cambia con la mirada: un parpadeo con la cabeza quieta no lo recalcula.
      if (!ultima || ultima.yaw !== m.yaw || ultima.pitch !== m.pitch) {
        ponerGorro(capa.current, gorro(m, fino));
        ultima = { ...m };
      }
      pose(m, abierto, feliz).forEach((p, k) => {
        ojos.current[k]?.setAttribute('transform', p.ojo);
        ojos.current[k]?.setAttribute('opacity', p.ojoOp);
        arcos.current[k]?.setAttribute('transform', p.arco);
        arcos.current[k]?.setAttribute('opacity', p.arcoOp);
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
      salto = 0;
      while (pasos) {
        const p = pasos[i];
        if (p.t === 'parpadeo' || p.t === 'feliz') {
          lanzar(p.t, p.t === 'feliz' ? p.ms : 180);
        } else {
          const u = Math.min(1, (ahora - t0) / p.ms);
          if (u < 1) {
            if (p.t === 'pausa') return desde;
            if (p.t === 'mirar') {
              const k = suave(u);
              return { yaw: desde.yaw + (p.yaw - desde.yaw) * k, pitch: desde.pitch + (p.pitch - desde.pitch) * k };
            }
            salto = Math.sin(Math.PI * u);
            return { yaw: desde.yaw + 2 * Math.PI * suave(u), pitch: desde.pitch };
          }
          if (p.t === 'mirar') desde = { yaw: p.yaw, pitch: p.pitch };
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
      const { a, f } = parpados(ahora);
      pintar(actual, a, f);
      if (salto !== saltoPintado) {
        todo.current?.setAttribute('transform', salto ? `translate(0 ${n(-7 * salto)})` : '');
        saltoPintado = salto;
      }
      const quieto = !pasos && !parpado && Math.abs(objetivo.yaw - actual.yaw) + Math.abs(objetivo.pitch - actual.pitch) < 0.002;
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
      salto = 0; saltoPintado = 0; todo.current?.removeAttribute('transform');
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
  }, [guion, mirada, fino]);

  useEffect(() => { pausadoRef.current = pausado; sincronizar.current(); }, [pausado]);

  const ojo = (k: number) => (
    <rect
      ref={(r) => { ojos.current[k] = r; }}
      x={-OJO.w / 2} y={-OJO.h / 2} width={OJO.w} height={OJO.h} rx={OJO.w / 2}
      transform={inicial[k].ojo} opacity={inicial[k].ojoOp}
      {...(silueta ? { fill: 'none', vectorEffect: 'non-scaling-stroke' } : { fill: 'var(--dot-ojo, #0e141b)' })}
    />
  );
  const arco = (k: number) => (
    <path
      ref={(r) => { arcos.current[k] = r; }}
      d="M-9 5Q0-11 9 5" fill="none" stroke={silueta ? 'currentColor' : 'var(--dot-ojo, #0e141b)'}
      strokeWidth={silueta ? undefined : 6.5} strokeLinecap="round"
      transform={inicial[k].arco} opacity={inicial[k].arcoOp}
      {...(silueta ? { vectorEffect: 'non-scaling-stroke' } : {})}
    />
  );

  return (
    <span ref={host} className={c(cls)} data-mascot="" aria-hidden="true">
      <svg className={c('dot-art')} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clip}><circle cx={CX} cy={CY} r={R} /></clipPath>
          {/* Brillo y sombra del gorro: el centro sigue a un punto de la tela, así giran con la cabeza. */}
          <radialGradient {...pieza('luz')} id={luz} gradientUnits="userSpaceOnUse" r="66">
            <stop offset="0" stopColor="#fff" stopOpacity=".5" />
            <stop offset=".42" stopColor="#fff" stopOpacity=".07" />
            <stop offset=".72" stopColor="#021d4a" stopOpacity=".12" />
            <stop offset="1" stopColor="#021d4a" stopOpacity=".42" />
          </radialGradient>
          {/* La trama de la tela, que se desliza con la coronilla */}
          {conTrama && (
            <pattern {...pieza('trama')} id={trama} patternUnits="userSpaceOnUse" width="2.6" height="2.6">
              <path d="M0 2.6L2.6 0" stroke="#fff" strokeOpacity=".16" strokeWidth=".5" />
              <path d="M0 0L2.6 2.6" stroke="#021d4a" strokeOpacity=".16" strokeWidth=".5" />
            </pattern>
          )}
        </defs>
        <g ref={todo}>
        {silueta ? (
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle cx={CX} cy={CY} r={R} vectorEffect="non-scaling-stroke" />
            <path {...pieza('borde')} vectorEffect="non-scaling-stroke" />
            <path {...pieza('pliegue')} vectorEffect="non-scaling-stroke" />
            <g clipPath={`url(#${clip})`}>{ojo(0)}{ojo(1)}{arco(0)}{arco(1)}</g>
          </g>
        ) : (
          <>
            {/* Las cintas van por detrás de la esfera: sólo asoman cuando gira de lado. Van en todos los tamaños. */}
            <path {...pieza('colas')} fill="none" stroke="#1c5fc9" strokeWidth="4.4" strokeLinecap="round" />
            <circle {...pieza('nudo')} r="3.6" fill="#164fae" />
            <circle cx={CX} cy={CY} r={R} fill="var(--dot-cuerpo, #f3f5f8)" />
            {/* La sombra que la banda deja sobre la cara */}
            <path {...pieza('borde')} fill="none" stroke="#0a2a5e" strokeOpacity=".22" strokeWidth="3.2" strokeLinecap="round" />
            <path {...pieza('banda')} fill="#2169d6" />
            {fino && <path {...pieza('pespunte')} fill="none" stroke="#d4e9ff" strokeOpacity=".9" strokeWidth=".8" strokeDasharray="1.9 1.5" strokeLinecap="round" />}
            <path {...pieza('brilloBanda')} fill={`url(#${luz})`} />
            <path {...pieza('tela')} fill="#2a7ae6" />
            {fino && (
              <>
                {conTrama && <path {...pieza('tejido')} fill={`url(#${trama})`} />}
                {/* Frunces: la cara en sombra y la cara con luz de cada pliegue */}
                <path {...pieza('frunceSombra')} fill="#0a3478" fillOpacity=".2" />
                <path {...pieza('frunceLuz')} fill="#dcecff" fillOpacity=".13" />
                {/* Costuras: la hendidura, su filo con luz y el pespunte de al lado */}
                <path {...pieza('costuras')} fill="none" stroke="#0f4699" strokeOpacity=".75" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path {...pieza('costurasFilo')} fill="none" stroke="#cfe5ff" strokeOpacity=".35" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" />
                <path {...pieza('costurasPespunte')} fill="none" stroke="#d4e9ff" strokeOpacity=".6" strokeWidth=".6" strokeDasharray="1.3 1.2" strokeLinecap="round" />
              </>
            )}
            <path {...pieza('pliegue')} fill="none" stroke="#13489a" strokeOpacity=".38" strokeWidth="1" strokeLinecap="round" />
            <path {...pieza('brillo')} fill={`url(#${luz})`} />
            {/* En la vuelta entera, con la nuca de frente, las cintas van por delante */}
            <path {...pieza('colasDelante')} fill="none" stroke="#1c5fc9" strokeWidth="4.4" strokeLinecap="round" />
            <circle {...pieza('nudoDelante')} r="3.6" fill="#164fae" />
            <g clipPath={`url(#${clip})`}>{ojo(0)}{ojo(1)}{arco(0)}{arco(1)}</g>
          </>
        )}
        </g>
      </svg>
    </span>
  );
}
