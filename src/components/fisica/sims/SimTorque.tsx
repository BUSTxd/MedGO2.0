'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C3 · Torque sobre una barra con punto de apoyo.
 *
 * Es el diagrama clásico del examen —barra rígida, apoyo en B, una fuerza en
 * cada extremo— pero VIVO: la barra gira de verdad cuando los dos torques no se
 * empatan, y se queda quieta cuando sí. Ver caer el lado que gana es lo que
 * convierte «Στ = 0» en algo que se puede comprobar en vez de creer.
 *
 * Tres decisiones del modelo, ninguna decorativa:
 *
 * 1. **θ se mide respecto a la BARRA**, como en el enunciado. Eso hace que el
 *    torque de F₂ no cambie al inclinarse (F₂ gira con la barra), mientras que
 *    el de F₁ —vertical, fija en el espacio, como cualquier peso— pierde brazo
 *    con el coseno. Que una cambie y la otra no es justo lo que hay que ver.
 * 2. **El peso de la barra se cuenta siempre.** Con `masa = 0` la barra es la
 *    ideal del enunciado y no puede acelerar (I = 0): entonces no gira, y el
 *    veredicto dice hacia dónde lo haría. Despreciar el peso para los torques
 *    pero usar la masa para la inercia sería el número mentiroso de siempre.
 * 3. El eje lleva un **rozamiento viscoso** declarado (`ROCE`). Sin él, el caso
 *    en el que la barra encuentra su equilibrio inclinada —τ₁ ∝ cos φ decreciente
 *    hasta empatar con τ₂— oscilaría para siempre alrededor de ese ángulo.
 */

/** Claves de `preset`: `f1`, `f2`, `theta` (grados), `d1`, `d2`, `masa`. */

const G = 9.81;
/**
 * Tope mecánico del apoyo (≈19,5°). Es el ángulo, no un adorno: el encuadre
 * tiene que reservar lo que suben y bajan los extremos, así que subirlo encoge
 * la barra en pantalla. A 0,34 rad la barra más desfavorable sigue midiendo
 * 223 px, y queda sitio para el caso que hay que ver — F₁ por encima del
 * equilibrio se frena sola en ~18°, sin llegar al tope.
 */
const ANG_MAX = 0.34;
/** Rozamiento del eje, s⁻¹. */
const ROCE = 1.6;
/** Por debajo de esto la barra es ideal: sin masa no hay aceleración angular. */
const I_MIN = 1e-4;

const MARGEN = { izq: 48, der: 60, sup: 24 };
/** Altura del punto de apoyo en el canvas. */
const BY = 142;
/** Donde arranca la balanza de torques. */
const BANDA = 300;
/** Píxeles de la flecha de fuerza más larga. */
const LARGO_F = 66;
const LERP = 0.18;

const COLOR = {
  f1: '#2DC99A',
  f2: '#9B8EF8',
  peso: '#F5A623',
  ok: '#2DC99A',
};

/**
 * Topes del mando. Los comparten las perillas, el arrastre y los presets: si
 * cada uno tuviera los suyos, el dibujo dejaría de coincidir con el mando justo
 * en los valores que lo rompen.
 */
const LIM = {
  f1:    [0, 1200] as const,
  f2:    [0, 800] as const,
  theta: [0, 90] as const,
  d1:    [0.1, 1] as const,
  d2:    [0.2, 1.6] as const,
  masa:  [0, 8] as const,
};
const clamp = (v: number, [lo, hi]: readonly [number, number]) =>
  Math.min(hi, Math.max(lo, v));

/** Paso de cada perilla. El arrastre usa el mismo, ver `ajusta`. */
const PASO = { f1: 1, f2: 1, theta: 1, d1: 0.01, d2: 0.01 };

/**
 * Lleva un valor arrastrado al mismo paso y a los mismos topes que su perilla.
 *
 * El paso NO es cosmético. El `<input type="range">` redondea lo que enseña,
 * pero el estado se quedaba con el valor continuo del gesto: arrastrando F₂ salía
 * θ = 54,4°, la perilla decía «54°» y el panel sustituía «800 · sen 54» para dar
 * 651 N — un alumno que rehiciera esa cuenta a mano obtendría 647. La regla del
 * catálogo es que la sustitución que se ve dé el resultado que se ve, así que el
 * arrastre tiene que aterrizar en valores que la perilla pueda representar.
 */
const ajusta = (v: number, paso: number, lim: readonly [number, number]) =>
  clamp(Math.round(v / paso) * paso, lim);

type Asa = 'f1' | 'f2' | 'a' | 'c';

interface Geo {
  px: number;
  escF: number;
  bx: number;
  by: number;
  /** Unitario de la barra, de B hacia C, en coordenadas de pantalla. */
  ux: number;
  uy: number;
  /** Normal de la barra hacia el lado de las fuerzas (abajo con φ = 0). */
  nx: number;
  ny: number;
  ax: number;
  ay: number;
  cx: number;
  cy: number;
  f1x: number;
  f1y: number;
  f2x: number;
  f2y: number;
}

export default function SimTorque({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [f1, setF1] = useState(500);      // N, vertical hacia abajo en A
  const [f2, setF2] = useState(400);      // N, a θ de la barra en C
  const [theta, setTheta] = useState(30); // grados, respecto a la barra
  const [d1, setD1] = useState(0.4);      // m, de A al apoyo
  const [d2, setD2] = useState(1.3);      // m, del apoyo a C
  const [masa, setMasa] = useState(1.2);  // kg, masa de la barra

  /* ─── Lo que el panel lee del estado ──────────────────────────────────── */
  const rad = (theta * Math.PI) / 180;
  const f2perp = f2 * Math.sin(rad);
  const f2par = f2 * Math.cos(rad);
  const largo = d1 + d2;
  /** Centro de masa medido desde el apoyo; positivo = a la derecha. */
  const xcm = largo / 2 - d1;
  const peso = masa * G;
  /** Torque horario de F₂. No depende del ángulo: θ va referido a la barra. */
  const tau2 = f2perp * d2;
  /** Torque del peso propio con la barra horizontal (horario si el cm cae a la derecha). */
  const tauW0 = peso * xcm;
  /** Steiner: la barra gira por B, no por su centro. */
  const inercia = masa * ((largo * largo) / 12 + xcm * xcm);
  const f1eq = (tau2 + tauW0) / d1;

  const est = useRef({ f1, f2, rad, d1, d2, largo, xcm, peso, tau2, tauW0, inercia });
  est.current = { f1, f2, rad, d1, d2, largo, xcm, peso, tau2, tauW0, inercia };

  const vivo = useRef<Record<string, number>>({});
  /** Inclinación de la barra (rad, antihorario) y su velocidad. */
  const giro = useRef({ ang: 0, om: 0, tPrev: 0, tope: false });
  /** Escala suavizada: sin lerp, inclinarse daría un salto de zoom. */
  const camRef = useRef<{ px: number; escF: number } | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const hoverRef = useRef<Asa | null>(null);
  const dragRef = useRef<
    | null
    | {
        asa: Asa;
        x0: number; y0: number;
        f10: number; f20: number; th0: number; d10: number; d20: number;
        px0: number; escF0: number;
        ux0: number; uy0: number; nx0: number; ny0: number;
        origenX: number; origenY: number;
      }
  >(null);

  const reiniciarGiro = () => { giro.current = { ang: 0, om: 0, tPrev: 0, tope: false }; };

  /* ─── Escena ──────────────────────────────────────────────────────────── */

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, t, paleta } = c;
    const e = est.current;

    /* Integración. Con el gesto activo la barra se congela: el asa que se
       arrastra no puede irse moviendo sola bajo el puntero. */
    let dt = t - giro.current.tPrev;
    giro.current.tPrev = t;
    const ang = giro.current.ang;
    const cosA = Math.cos(ang);
    const sinA = Math.sin(ang);

    const tau1 = e.f1 * e.d1 * cosA;
    const tauW = e.tauW0 * cosA;
    const tauNet = tau1 - e.tau2 - tauW;
    const ideal = e.inercia < I_MIN;
    const alphaT = ideal ? 0 : tauNet / e.inercia;

    if (dt > 0 && !dragRef.current && !ideal) {
      dt = Math.min(dt, 0.05);
      giro.current.om = (giro.current.om + alphaT * dt) * Math.exp(-ROCE * dt);
      giro.current.ang += giro.current.om * dt;
      if (giro.current.ang > ANG_MAX) { giro.current.ang = ANG_MAX; giro.current.om = 0; }
      if (giro.current.ang < -ANG_MAX) { giro.current.ang = -ANG_MAX; giro.current.om = 0; }
      giro.current.tope = Math.abs(giro.current.ang) >= ANG_MAX - 1e-3;
    } else if (ideal) {
      // Sin masa no hay quien acelere: la barra se queda donde el enunciado la
      // pone, y el desequilibrio se lee en la balanza de abajo.
      giro.current.ang += (0 - giro.current.ang) * 0.12;
      giro.current.om = 0;
      giro.current.tope = false;
    }

    rejilla(c, 28);

    /* ─── Encuadre ──────────────────────────────────────────────────────────
       Dos pasos, como en la lente: primero cuánto cabe de ancho, y después
       cuánto sube y cuánto baja cada extremo al inclinarse. Se toma el menor,
       porque una barra rígida no puede tener dos escalas. */
    const util = Math.max(w - MARGEN.izq - MARGEN.der, 160);
    const absC = Math.abs(cosA);
    const absS = Math.abs(sinA);
    const pxAncho = util / Math.max(e.largo * absC, 0.05);
    // Con φ > 0 baja A y sube C; con φ < 0, al revés.
    const sube = absS * (ang > 0 ? e.d2 : e.d1);
    const baja = absS * (ang > 0 ? e.d1 : e.d2);
    const dispArriba = BY - MARGEN.sup - 34;   // hueco de las cotas
    const dispAbajo = BANDA - BY - 84;         // hueco de las flechas
    const pxSube = sube > 1e-4 ? dispArriba / sube : Number.POSITIVE_INFINITY;
    const pxBaja = baja > 1e-4 ? dispAbajo / baja : Number.POSITIVE_INFINITY;
    const pxObjetivo = Math.min(pxAncho, pxSube, pxBaja);

    /* Las flechas se miden en píxeles, no en metros: la más grande de la escena
       marca el largo y las demás quedan a escala entre ellas. */
    const fMax = Math.max(e.f1, e.f2, e.peso, 60);
    const escObjetivo = LARGO_F / fMax;

    /* El suavizado sólo puede ir por detrás CRECIENDO. Encoger tiene que ser
       inmediato: mientras la barra cae, el ángulo cambia en cada frame y un lerp
       rezagado dejaría la escala en un valor mayor del que cabe — justo en los
       frames de la caída, que son los que se miran. Como la entrada del encuadre
       (el ángulo) sí es continua, el recorte no se nota. */
    const cam = camRef.current;
    const px = cam ? Math.min(cam.px + (pxObjetivo - cam.px) * LERP, pxObjetivo) : pxObjetivo;
    const escF = cam
      ? Math.min(cam.escF + (escObjetivo - cam.escF) * LERP, escObjetivo)
      : escObjetivo;
    camRef.current = { px, escF };

    const anchoBarra = e.largo * absC * px;
    const bx = MARGEN.izq + (util - anchoBarra) / 2 + e.d1 * absC * px;
    const by = BY;

    // Unitario de la barra (de B hacia C) y su normal, en pantalla.
    const ux = cosA;
    const uy = -sinA;
    const nx = -uy;
    const ny = ux;

    const ax = bx - e.d1 * ux * px;
    const ay = by - e.d1 * uy * px;
    const cx = bx + e.d2 * ux * px;
    const cy = by + e.d2 * uy * px;

    /* ─── Apoyo ─────────────────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.62);
    ctx.beginPath();
    ctx.roundRect(bx - 7, by + 5, 14, 21, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(bx - 27, by + 24, 54, 7, 3);
    ctx.fill();
    ctx.strokeStyle = alfa(paleta.ink, 0.34);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const sx = bx - 26 + i * 9;
      ctx.moveTo(sx, by + 31);
      ctx.lineTo(sx - 7, by + 40);
    }
    ctx.stroke();
    ctx.restore();

    /* ─── Barra ─────────────────────────────────────────────────────────── */
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-ang);

    const izq = -e.d1 * px;
    const der = e.d2 * px;
    const grad = ctx.createLinearGradient(0, -7, 0, 7);
    grad.addColorStop(0, alfa(paleta.acento, 0.95));
    grad.addColorStop(1, alfa(paleta.acento, 0.62));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(izq, -7, der - izq, 14, 4);
    ctx.fill();
    ctx.strokeStyle = alfa(paleta.acento, 0.9);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    /* Cotas, pegadas a la barra: son distancias medidas SOBRE ella, así que
       giran con ella. Sueltas en horizontal mentirían al inclinarse. */
    const yCota = -30;
    ctx.strokeStyle = alfa(paleta.ink, 0.5);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ([izq, 0, der] as const).forEach((x) => {
      ctx.moveTo(x, yCota - 6);
      ctx.lineTo(x, -10);
    });
    ctx.moveTo(izq, yCota);
    ctx.lineTo(der, yCota);
    ctx.stroke();
    ([[izq, 1], [0, -1], [0, 1], [der, -1]] as const).forEach(([x, dir]) => {
      ctx.beginPath();
      ctx.moveTo(x, yCota);
      ctx.lineTo(x + dir * 7, yCota - 3.2);
      ctx.lineTo(x + dir * 7, yCota + 3.2);
      ctx.closePath();
      ctx.fillStyle = alfa(paleta.ink, 0.5);
      ctx.fill();
    });

    ctx.font = '700 10.5px var(--font-outfit), system-ui, sans-serif';
    ([
      [izq / 2, Math.abs(izq), `${Math.round(e.d1 * 100)} cm`],
      [der / 2, der, `${Math.round(e.d2 * 100)} cm`],
    ] as const).forEach(([x, tramo, rot]) => {
      // Un tramo corto no tiene sitio para su rótulo entre las dos marcas: en vez
      // de dejarlo pisando la línea (y tapando la marca de B con su fondo), se
      // sube por encima de la cota, donde no hay nada.
      const ancho = ctx.measureText(rot).width;
      const cabe = tramo > ancho + 18;
      const y = cabe ? yCota : yCota - 15;
      if (cabe) {
        ctx.save();
        ctx.fillStyle = paleta.stage;
        ctx.fillRect(x - ancho / 2 - 4, y - 8, ancho + 8, 16);
        ctx.restore();
      }
      texto(c, rot, x, y, { align: 'center', size: 10.5, peso: 700, color: paleta.ink });
    });

    /* Los tres rótulos van ENCIMA de la barra, en la franja libre entre ella y
       la cota: debajo está todo el diagrama de fuerzas (F₁ cuelga de A, la
       descomposición de F₂ rodea C y el apoyo ocupa B). */
    ([['A', izq, -15], ['B', 0, 14], ['C', der, 17]] as const).forEach(([rot, x, dx]) => {
      texto(c, rot, x + dx, -17, { align: 'center', size: 12.5, peso: 800, color: paleta.ink });
    });

    // Centro de masa: sólo tiene sentido enseñarlo si su peso cuenta.
    if (e.peso > 0.5) {
      ctx.save();
      ctx.strokeStyle = alfa(COLOR.peso, 0.9);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(e.xcm * px + 0, 0, 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    /* ─── Fuerzas ───────────────────────────────────────────────────────── */
    const largoF1 = e.f1 * escF;
    const f1x = ax;
    const f1y = ay + largoF1;
    const asaF1 = hoverRef.current === 'f1' || dragRef.current?.asa === 'f1';
    vector(c, ax, ay, 0, largoF1, COLOR.f1, `F₁ = ${Math.round(e.f1)} N`, {
      grosor: asaF1 ? 3.4 : 2.6,
    });

    /* F₂: la descomposición es el corazón del tema. La componente perpendicular
       gira; la paralela apunta al eje y no gira nada — se dibuja punteada y
       atenuada para que se vea que está y que no cuenta. */
    const dirX = -Math.cos(e.rad) * ux + Math.sin(e.rad) * nx;
    const dirY = -Math.cos(e.rad) * uy + Math.sin(e.rad) * ny;
    const largoF2 = e.f2 * escF;
    const f2x = cx + dirX * largoF2;
    const f2y = cy + dirY * largoF2;
    const asaF2 = hoverRef.current === 'f2' || dragRef.current?.asa === 'f2';

    const lPerp = f2perp * escF;
    const lPar = f2par * escF;
    /* Rectángulo de descomposición: sin él, las dos componentes son dos flechas
       sueltas y no se ve que F₂ sea su suma. Se cierra con trazo fino hasta la
       punta de F₂, que es la diagonal. */
    if (lPerp > 6 && lPar > 6) {
      ctx.save();
      ctx.strokeStyle = alfa(COLOR.f2, 0.4);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx + nx * lPerp, cy + ny * lPerp);
      ctx.lineTo(cx + dirX * largoF2, cy + dirY * largoF2);
      ctx.moveTo(cx - ux * lPar, cy - uy * lPar);
      ctx.lineTo(cx + dirX * largoF2, cy + dirY * largoF2);
      ctx.stroke();
      ctx.restore();
    }
    if (lPerp > 6) {
      vector(c, cx, cy, nx * lPerp, ny * lPerp, alfa(COLOR.f2, 0.95), undefined, { grosor: 3.2 });
      // El rótulo sólo cuando hay descomposición que enseñar: con θ = 90° la
      // perpendicular ES F₂, y los dos rótulos se apilaban sobre la misma flecha
      // diciendo el mismo número.
      if (lPar > 10) {
        // Apartado en perpendicular a su PROPIA flecha: en línea con ella caía
        // justo sobre la punta y sobre el arco del ángulo.
        rotuloBorde(c, `F₂⊥ = ${Math.round(f2perp)} N`,
          cx + nx * lPerp + ux * 14, cy + ny * lPerp + uy * 14 + 12,
          { size: 10, peso: 800, color: COLOR.f2 });
      }
    }
    if (lPar > 6) {
      vector(c, cx, cy, -ux * lPar, -uy * lPar, alfa(paleta.ink, 0.42), undefined, {
        grosor: 1.8, discontinuo: true, punta: 6,
      });
      // Sólo el símbolo: alrededor de C conviven ya la cota, el rótulo del
       // punto, el arco del ángulo y tres flechas. El «no gira» lo explican el
       // trazo punteado, la nota de abajo y el panel de fórmulas.
      texto(c, 'F₂∥', cx - ux * lPar * 0.5 - nx * 13, cy - uy * lPar * 0.5 - ny * 13, {
        align: 'center', size: 9.5, peso: 800,
      });
    }
    vector(c, cx, cy, dirX * largoF2, dirY * largoF2, COLOR.f2, `F₂ = ${Math.round(e.f2)} N`, {
      grosor: asaF2 ? 3.4 : 2.6,
    });

    /* Arco del ángulo, entre la barra y F₂. El barrido se calcula NORMALIZADO a
       ±π: con la barra inclinada los dos extremos caen a lados opuestos de ±π y
       un `min`/`max` de los ángulos crudos dibuja el arco largo — 330° donde
       tiene que haber 30°. */
    if (largoF2 > 22) {
      const a0 = Math.atan2(-uy, -ux);
      let d = Math.atan2(dirY, dirX) - a0;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      ctx.save();
      ctx.strokeStyle = alfa(paleta.ink, 0.55);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, a0, a0 + d, d < 0);
      ctx.stroke();
      ctx.restore();
      const am = a0 + d / 2;
      texto(c, `${Math.round(theta)}°`, cx + Math.cos(am) * 38, cy + Math.sin(am) * 38, {
        align: 'center', size: 10.5, peso: 800, color: paleta.ink,
      });
    }

    if (e.peso > 0.5) {
      const wx = bx + e.xcm * ux * px;
      const wy = by + e.xcm * uy * px;
      vector(c, wx, wy, 0, e.peso * escF, COLOR.peso, `W = ${e.peso.toFixed(0)} N`, { grosor: 2 });
    }

    /* ─── Los dos torques, como giros alrededor del apoyo ─────────────────
       Van bajo la barra y a los lados del apoyo, que es la única franja de la
       escena que está libre: arriba están las cotas y en el centro el pivote. */
    const antihorario = tau1 + Math.max(-tauW, 0);
    const horario = e.tau2 + Math.max(tauW, 0);
    const maxTau = Math.max(antihorario, horario, 1);
    // Ángulo de la barra en coordenadas de canvas: los arcos arrancan pegados a
    // ella y barren hacia abajo, así que nunca la cruzan por mucho que se incline.
    const angCanvas = -ang;
    arcoTorque(c, bx, by, antihorario / maxTau, false, COLOR.f1, angCanvas);
    arcoTorque(c, bx, by, horario / maxTau, true, COLOR.f2, angCanvas);

    /* ─── Balanza de torques ────────────────────────────────────────────── */
    const bw = Math.min(w - 90, 420);
    const bxx = (w - bw) / 2;
    const byy = BANDA + 16;
    const suma = antihorario + horario;
    const frac = suma > 1e-6 ? antihorario / suma : 0.5;

    texto(c, 'Balance de torques respecto a B', w / 2, BANDA, {
      align: 'center', size: 10.5, peso: 800, color: paleta.ink,
    });

    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.08);
    ctx.beginPath();
    ctx.roundRect(bxx, byy, bw, 22, 11);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(bxx, byy, bw, 22, 11);
    ctx.clip();
    ctx.fillStyle = alfa(COLOR.f1, 0.8);
    ctx.fillRect(bxx, byy, bw * frac, 22);
    ctx.fillStyle = alfa(COLOR.f2, 0.8);
    ctx.fillRect(bxx + bw * frac, byy, bw * (1 - frac), 22);
    ctx.restore();
    ctx.strokeStyle = alfa(paleta.ink, 0.45);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(bxx + bw / 2, byy - 5);
    ctx.lineTo(bxx + bw / 2, byy + 27);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    texto(c, `↺ ${antihorario.toFixed(1)} N·m`, bxx, byy + 34, {
      size: 10.5, peso: 800, color: COLOR.f1,
    });
    texto(c, `${horario.toFixed(1)} N·m ↻`, bxx + bw, byy + 34, {
      align: 'right', size: 10.5, peso: 800, color: COLOR.f2,
    });

    /* Umbral de «equilibrio». No puede ser cero exacto: F₁ va en pasos de 1 N,
       así que el mejor ajuste posible deja hasta medio newton por el brazo. El
       umbral es justo eso, con un suelo para que con fuerzas pequeñas no acabe
       llamando equilibrio a un desbalance apreciable. */
    const holgura = Math.max(0.25, e.d1 * PASO.f1 * 0.6);
    const enEquilibrio = Math.abs(tauNet) < holgura;
    const veredicto = ideal
      ? `Barra ideal (sin masa): Στ = ${tauNet.toFixed(1)} N·m, pero no hay inercia que acelerar`
      : enEquilibrio
        ? 'EQUILIBRIO · Στ = 0 · la barra se queda donde está'
        : tauNet > 0
          ? `↺ A baja y C sube · Στ = +${tauNet.toFixed(1)} N·m`
          : `↻ C baja y A sube · Στ = ${tauNet.toFixed(1)} N·m`;
    texto(c, veredicto, w / 2, byy + 56, {
      align: 'center',
      size: 11.5,
      peso: 800,
      color: ideal ? paleta.muted : enEquilibrio ? COLOR.ok : paleta.ink,
    });
    if (giro.current.tope) {
      texto(c, 'apoyada en el tope', w / 2, byy + 72, {
        align: 'center', size: 9.5, peso: 700,
      });
    }

    geoRef.current = {
      px, escF, bx, by, ux, uy, nx, ny, ax, ay, cx, cy, f1x, f1y, f2x, f2y,
    };
    vivo.current = {
      tau1,
      tauW,
      tauNet,
      alphaT,
      om: giro.current.om,
      angDeg: (giro.current.ang * 180) / Math.PI,
    };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 400, onReiniciar: reiniciarGiro });

  /* ─── Arrastre ────────────────────────────────────────────────────────── */

  const asaEn = useCallback((x: number, y: number): Asa | null => {
    const g = geoRef.current;
    if (!g) return null;
    // Las puntas primero: son el gesto fino, y caen cerca de los extremos.
    if (Math.hypot(x - g.f1x, y - g.f1y) < 17) return 'f1';
    if (Math.hypot(x - g.f2x, y - g.f2y) < 17) return 'f2';
    if (Math.hypot(x - g.ax, y - g.ay) < 16) return 'a';
    if (Math.hypot(x - g.cx, y - g.cy) < 16) return 'c';
    return null;
  }, []);

  const puntero = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };

  const onDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = puntero(ev);
    const asa = asaEn(x, y);
    if (!asa) return;
    const g = geoRef.current!;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    // Escala, origen y orientación congelados: con los del frame en curso el
    // gesto se realimentaría (muevo → el encuadre se reajusta → parece que
    // moví más). Y la barra se congela mientras dure, o el asa huiría sola.
    dragRef.current = {
      asa, x0: x, y0: y,
      f10: f1, f20: f2, th0: theta, d10: d1, d20: d2,
      px0: g.px, escF0: g.escF,
      ux0: g.ux, uy0: g.uy, nx0: g.nx, ny0: g.ny,
      origenX: asa === 'f2' ? g.cx : g.ax,
      origenY: asa === 'f2' ? g.cy : g.ay,
    };
    hoverRef.current = asa;
    ev.currentTarget.style.cursor = 'grabbing';
  };

  const onMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = puntero(ev);
    const d = dragRef.current;

    if (!d) {
      const asa = asaEn(x, y);
      hoverRef.current = asa;
      ev.currentTarget.style.cursor = asa ? 'grab' : 'default';
      return;
    }

    if (d.asa === 'f1') {
      setF1(ajusta((y - d.origenY) / d.escF0, PASO.f1, LIM.f1));
      return;
    }
    if (d.asa === 'f2') {
      // El vector del puntero desde C, leído en los ejes de la barra: el módulo
      // da F₂ y la inclinación respecto a la barra da θ, las dos a la vez.
      const vx = x - d.origenX;
      const vy = y - d.origenY;
      const along = -(vx * d.ux0 + vy * d.uy0); // positivo hacia B
      const perp = vx * d.nx0 + vy * d.ny0;     // positivo hacia el lado de F₂
      setF2(ajusta(Math.hypot(along, perp) / d.escF0, PASO.f2, LIM.f2));
      setTheta(ajusta(
        (Math.atan2(Math.max(perp, 0), Math.max(along, 1e-4)) * 180) / Math.PI,
        PASO.theta,
        LIM.theta,
      ));
      return;
    }
    // A y C se mueven a lo largo de la barra, no en horizontal: con la barra
    // inclinada, el desplazamiento útil es la proyección sobre su eje.
    const s = ((x - d.x0) * d.ux0 + (y - d.y0) * d.uy0) / d.px0;
    if (d.asa === 'a') setD1(ajusta(d.d10 - s, PASO.d1, LIM.d1));
    else setD2(ajusta(d.d20 + s, PASO.d2, LIM.d2));
  };

  const soltar = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      try { ev.currentTarget.releasePointerCapture(ev.pointerId); } catch { /* ya soltado */ }
      dragRef.current = null;
    }
    const { x, y } = puntero(ev);
    const asa = asaEn(x, y);
    hoverRef.current = asa;
    ev.currentTarget.style.cursor = asa ? 'grab' : 'default';
  };

  const onLeave = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) return;
    hoverRef.current = null;
    ev.currentTarget.style.cursor = 'default';
  };

  /* ─── Presets ─────────────────────────────────────────────────────────── */

  const equilibrar = () => {
    setF1(ajusta(f1eq, PASO.f1, LIM.f1));
    reiniciarGiro();
    reloj.reanudar();
  };

  const enunciado = () => {
    setF2(400);
    setTheta(30);
    setD1(0.4);
    setD2(1.3);
    setMasa(0);   // el enunciado desprecia el peso de la barra
    setF1(400);   // el valor que hay que corregir hasta equilibrar
    reiniciarGiro();
    reloj.reanudar();
  };

  // Los presets del sílabo pasan por los mismos topes que el mando: un valor de
  // un archivo de datos rompe el dibujo igual que uno arrastrado con el ratón.
  useEffect(() => {
    if (!preset) return;
    if (preset.f1 !== undefined) setF1(clamp(preset.f1, LIM.f1));
    if (preset.f2 !== undefined) setF2(clamp(preset.f2, LIM.f2));
    if (preset.theta !== undefined) setTheta(clamp(preset.theta, LIM.theta));
    if (preset.d1 !== undefined) setD1(clamp(preset.d1, LIM.d1));
    if (preset.d2 !== undefined) setD2(clamp(preset.d2, LIM.d2));
    if (preset.masa !== undefined) setMasa(clamp(preset.masa, LIM.masa));
    reiniciarGiro();
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Torque: la barra y su punto de apoyo"
      acento={acento}
      onAcento={setAcento}
      sim="torque"
      reloj={reloj}
      magnitudes={{
        F1: f1, F2: f2, theta, d1, d2, m: masa, W: peso,
        F2perp: f2perp, F2par: f2par, xcm, L: largo, I: inercia,
        tau2, tauW0, f1eq,
      }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 11h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 14l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Fuerza  F₁" magnitud="F1" valor={f1} display={`${Math.round(f1)} N`}
            min={LIM.f1[0]} max={LIM.f1[1]} paso={PASO.f1} onChange={setF1} />
          <LabSlider label="Fuerza  F₂" magnitud="F2" valor={f2} display={`${Math.round(f2)} N`}
            min={LIM.f2[0]} max={LIM.f2[1]} paso={PASO.f2} onChange={setF2} />
          <LabSlider label="Ángulo  θ" magnitud="theta" valor={theta} display={`${Math.round(theta)}°`}
            min={LIM.theta[0]} max={LIM.theta[1]} paso={PASO.theta} onChange={setTheta} />
          <LabSlider label="Brazo  A→B" magnitud="d1" valor={d1} display={`${Math.round(d1 * 100)} cm`}
            min={LIM.d1[0]} max={LIM.d1[1]} paso={PASO.d1} onChange={setD1} />
          <LabSlider label="Brazo  B→C" magnitud="d2" valor={d2} display={`${Math.round(d2 * 100)} cm`}
            min={LIM.d2[0]} max={LIM.d2[1]} paso={PASO.d2} onChange={setD2} />
          <LabSlider label="Masa de la barra" magnitud="m" valor={masa}
            display={masa === 0 ? 'ideal' : `${masa.toFixed(1)} kg`}
            min={LIM.masa[0]} max={LIM.masa[1]} paso={0.1} onChange={setMasa} />

          <LabFila label="Casos">
            <Btn onClick={enunciado}>Enunciado del problema</Btn>
            <Btn onClick={equilibrar}>Equilibrar F₁</Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Arrastra las puntas de las flechas o los extremos <strong>A</strong> y <strong>C</strong>
          {' '}directamente sobre el dibujo. Fíjate en algo que sorprende: al inclinarse la barra,
          el torque de <strong>F₂</strong> no cambia —θ se mide respecto a la barra, así que gira
          con ella— mientras que el de <strong>F₁</strong>, que es vertical, pierde brazo con el
          coseno.
        </>
      }
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={onLeave}
      />
    </LabShell>
  );
}

/**
 * Rótulo que se voltea al otro lado del punto cuando no le cabe a la derecha.
 * Hace falta porque el extremo C está SIEMPRE pegado al borde —la barra se
 * encuadra al ancho útil—, así que un rótulo suyo alineado a la izquierda se
 * sale del canvas en todos los casos, no en un caso raro.
 */
function rotuloBorde(
  c: CanvasCtx,
  s: string,
  x: number,
  y: number,
  opts: { size: number; peso: number; color: string },
) {
  const { ctx, w } = c;
  ctx.save();
  ctx.font = `${opts.peso} ${opts.size}px var(--font-outfit), system-ui, sans-serif`;
  const ancho = ctx.measureText(s).width;
  ctx.restore();
  if (x + ancho + 6 <= w) {
    texto(c, s, x, y, { ...opts, align: 'left' });
  } else {
    texto(c, s, Math.min(x - 22, w - 6), y, { ...opts, align: 'right' });
  }
}

/**
 * Radios de los arcos de torque: fuera de la base del apoyo (27 px) y distintos
 * entre sí, porque con la barra muy inclinada los dos extremos se acercan y a un
 * mismo radio acabarían tocándose.
 */
const R_ARCO = { anti: 44, hor: 58 };

/**
 * Flecha curva alrededor del apoyo: es lo que traduce «260 N·m» a un sentido de
 * giro. El grosor y el barrido van con la fracción del torque mayor, de modo que
 * los dos arcos se comparan entre sí de un vistazo sin leer un número.
 *
 * Cada uno arranca PEGADO A LA BARRA —no en la horizontal— y barre hacia abajo:
 * anclarlos al eje horizontal hacía que la barra inclinada los atravesara, y un
 * arco cortado por la barra parece salir de ella en vez de rodear el apoyo.
 */
function arcoTorque(
  c: CanvasCtx,
  cx: number,
  cy: number,
  frac: number,
  horario: boolean,
  color: string,
  angBarra: number,
) {
  if (frac < 0.05) return;
  const { ctx } = c;
  const r = horario ? R_ARCO.hor : R_ARCO.anti;
  // En canvas el ángulo crece en sentido horario visual (la y va hacia abajo).
  /* 0,30 rad de separación son 13 px al radio menor: justo lo que hace falta
     para librar el semigrosor de la barra. Con 0,16 el arco arrancaba tocándola
     y parecía nacer de ella. Y con el barrido topado en 1,01 rad los dos arcos
     tampoco llegan a encontrarse por debajo. */
  const barrido = Math.min(frac, 1) * 0.85 + 0.16;
  const inicio = horario ? angBarra + 0.3 : angBarra + Math.PI - 0.3;
  const fin = horario ? inicio + barrido : inicio - barrido;

  ctx.save();
  ctx.strokeStyle = alfa(color, 0.7);
  ctx.lineWidth = 2 + frac * 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.min(inicio, fin), Math.max(inicio, fin));
  ctx.stroke();

  // Punta en el extremo que marca hacia dónde gira.
  ctx.translate(cx + Math.cos(fin) * r, cy + Math.sin(fin) * r);
  ctx.rotate(fin + (horario ? Math.PI / 2 : -Math.PI / 2));
  ctx.fillStyle = alfa(color, 0.85);
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-3, 4.6);
  ctx.lineTo(-3, -4.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
