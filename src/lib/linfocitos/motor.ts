// Motor de la escena del laboratorio «Maduración de linfocitos».
//
// Misma base que los motores del ciclo celular y de las vías NF-κB: la escena
// es una FUNCIÓN PURA del tiempo (`evaluar(paso, t)` parte del final del paso
// anterior y aplica cada acción con su progreso), así que retroceder, saltar o
// cambiar de velocidad es volver a evaluar.
//
// Lo propio: los actores son células con estado celular (dividiéndose, en
// apoptosis, anérgicas), con marcadores en la membrana (BCR, TCR, CD…), y la
// escena lleva «procesos» (la lupa con la recombinación V(D)J, la
// hipermutación, el cambio de clase, una translocación…) cuyo progreso `p`
// dibuja un componente propio en `Procesos.tsx`.

import type { Accion, ActorDecl, ConnectorType, DatosProceso, DesenlaceKind, Dibujo, Escenario, Forma, Lado, Marcador, Paso } from '@/lib/data/linfocitos/tipos';

export const ANCHO = 1600;
export const ALTO = 1000;
export const CELDA = 100;

// ─── Estado ───────────────────────────────────────────────────────────────────

export type MarcadorSt = Marcador & { op: number };

export type ActorSt = {
  key: string;
  forma: Forma;
  img?: string;
  dibujo?: Dibujo;
  /** Imagen/dibujo de la que se sale en un `swap` (fundido). */
  prev: { img?: string; dibujo?: Dibujo } | null;
  mezcla: number;
  color: string;
  d: number;
  label: string;
  sub?: string;
  x: number;
  y: number;
  esc: number;
  rot: number;
  op: number;
  vis: boolean;
  halo: number;
  gris: number;
  /** 0–1 mientras se estrangula en una mitosis (el surco). */
  surco: number;
  /** 0–1 durante la apoptosis (encoge, burbujas, fragmentos). */
  apoptosis: number;
  marcadores: MarcadorSt[];
  /** Rótulos rojos de neoplasia (una etapa puede originar varias). */
  marcas: { texto: string; sub?: string; op: number }[];
  anclado: { host: string; dx: number; dy: number } | null;
  ex: number;
  ey: number;
};

export type ConectorSt = { id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number; prog: number; op: number };
// `saliendo`: lo dejó a la vista el paso anterior; el paso actual lo desvanece
// en vez de borrarlo de golpe (acción interna `despedir`).
export type NotaSt = { id: string; text: string; near: string; side: 'top' | 'right' | 'bottom' | 'left'; op: number; persist: boolean; saliendo?: boolean };
export type DesenlaceSt = { id: string; kind: DesenlaceKind; x: number; y: number; op: number; texto: string; saliendo?: boolean };
export type ProcesoSt = { id: string; cerca: string; lado: Lado; datos: DatosProceso; p: number; op: number; persist: boolean; saliendo?: boolean };

export type EfectoSt =
  | { tipo: 'destello'; p: number; x: number; y: number; r: number; color: string }
  | { tipo: 'fragmentos'; p: number; x: number; y: number; r: number }
  | { tipo: 'punto'; p: number; via: string | null; x1: number; y1: number; x2: number; y2: number; f: number; color: string };

export type Caja = { x: number; y: number; w: number; h: number };

export type Escena = {
  actores: Record<string, ActorSt>;
  orden: string[];
  conectores: ConectorSt[];
  notas: NotaSt[];
  desenlaces: DesenlaceSt[];
  procesos: ProcesoSt[];
  efectos: EfectoSt[];
  camara: Caja;
  foco: { actors: string[]; k: number } | null;
  /** Pantalla estrecha y vertical (teléfono): la lupa se abre encima o debajo
   *  de la célula en vez de al lado. Lo fija la compilación. */
  lupaV?: boolean;
  /** Escala de los rótulos (nombres, notas, desenlaces): en un teléfono la
   *  escena se ve más pequeña y el texto crece para seguir leyéndose. */
  tx?: number;
};

/** Para qué pantalla se compila: proporción de la zona de la escena y si es un
 *  teléfono. En escritorio, 16:10 y el encuadre de siempre. */
export type Modo = { asp: number; movil: boolean };
export const MODO_ESCRITORIO: Modo = { asp: ANCHO / ALTO, movil: false };

export const CAMARA_TODO: Caja = { x: 0, y: 0, w: ANCHO, h: ALTO };

// ─── Utilidades ───────────────────────────────────────────────────────────────

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeBack = (t: number) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const g = (v: number) => v * CELDA;

export function diametroDecl(d: ActorDecl): number {
  if (d.d) return d.d;
  switch (d.forma) {
    case 'celula': return 150;
    case 'dibujo': return 150;
    case 'proteina': return 70;
    case 'molecula': return 34;
    case 'organo': return 220;
  }
}

export const DURACION: Record<string, number> = {
  appear: 500, move: 900, bind: 700, release: 600, activate: 450, deactivate: 450, hide: 400, swap: 700,
  divide: 1400, apoptosis: 1500, anergia: 800, express: 500, unexpress: 400, proceso: 3600, cerrar_proceso: 400,
  marca: 600, pulse_signal: 700, outcome: 800, camera: 800, highlight: 1400, note: 400, connect: 500, disconnect: 300,
};

export function duracionDe(a: Accion): number {
  if (a.tipo === 'wait') return a.ms;
  if (a.duration != null) return a.duration;
  return DURACION[a.tipo] ?? 500;
}

function clonar(e: Escena): Escena {
  const actores: Record<string, ActorSt> = {};
  for (const k in e.actores) {
    const a = e.actores[k];
    actores[k] = { ...a, marcadores: a.marcadores.map((m) => ({ ...m })), anclado: a.anclado ? { ...a.anclado } : null, marcas: a.marcas.map((x) => ({ ...x })), prev: a.prev ? { ...a.prev } : null };
  }
  return {
    actores,
    orden: [...e.orden],
    conectores: e.conectores.map((c) => ({ ...c })),
    notas: e.notas.map((n) => ({ ...n })),
    desenlaces: e.desenlaces.map((d) => ({ ...d })),
    procesos: e.procesos.map((p) => ({ ...p })),
    efectos: [],
    camara: { ...e.camara },
    foco: null,
    lupaV: e.lupaV,
    tx: e.tx,
  };
}

export function posAbs(e: Escena, key: string, prof = 0): { x: number; y: number } {
  const a = e.actores[key];
  if (!a) return { x: ANCHO / 2, y: ALTO / 2 };
  if (a.anclado && prof < 6 && e.actores[a.anclado.host]) {
    const h = posAbs(e, a.anclado.host, prof + 1);
    return { x: h.x + a.anclado.dx, y: h.y + a.anclado.dy };
  }
  return { x: a.x, y: a.y };
}

export function cajaActor(e: Escena, key: string): Caja {
  const a = e.actores[key];
  const p = posAbs(e, key);
  const d = (a?.d ?? 100) * (a?.esc ?? 1);
  return { x: p.x - d / 2, y: p.y - d / 2, w: d, h: d };
}

function alFrente(e: Escena, key: string) {
  const i = e.orden.indexOf(key);
  if (i !== -1) e.orden.splice(i, 1);
  e.orden.push(key);
}

function soltarHuespedes(e: Escena, key: string) {
  for (const k in e.actores) {
    const a = e.actores[k];
    if (a.anclado?.host === key) { const p = posAbs(e, k); a.x = p.x; a.y = p.y; a.anclado = null; }
  }
}

function ponerConector(e: Escena, c: Omit<ConectorSt, 'op'> & { op?: number }) {
  const i = e.conectores.findIndex((x) => x.id === c.id);
  const nuevo: ConectorSt = { op: 1, ...c };
  if (i === -1) e.conectores.push(nuevo); else e.conectores[i] = { ...e.conectores[i], ...nuevo };
}

function encuadre(b: { col: number; row: number; w: number; h: number }, asp = ANCHO / ALTO): Caja {
  let w = g(b.w), h = g(b.h);
  if (w / h > asp) h = w / asp; else w = h * asp;
  // En un teléfono vertical la caja puede pasar del alto del lienzo (lo de
  // fuera es blanco); en escritorio, nunca.
  if (asp >= ANCHO / ALTO) { w = Math.min(w, ANCHO); h = Math.min(h, ALTO); }
  else if (w > ANCHO) { w = ANCHO; h = w / asp; }
  const cx = g(b.col) + g(b.w) / 2, cy = g(b.row) + g(b.h) / 2;
  // La cámara no se sale del lienzo: lo de fuera es blanco vacío.
  const x = Math.min(Math.max(0, cx - w / 2), ANCHO - w);
  const y = h > ALTO ? (ALTO - h) / 2 : Math.min(Math.max(0, cy - h / 2), ALTO - h);
  return { x, y, w, h };
}

// ─── Lupa (geometría compartida con la escena) ───────────────────────────────

export const LUPA_W = 580;
export const LUPA_H = 262;

export function posLupa(pr: Pick<ProcesoSt, 'cerca' | 'lado'>, e: Escena): { x: number; y: number } {
  const a = e.actores[pr.cerca];
  const p = posAbs(e, pr.cerca);
  const d = a?.d ?? 120;
  // Con receptores en la membrana, sus rótulos asoman ~50 u: la lupa se aparta.
  const sep = a?.marcadores.length ? 105 : 50;
  let lado = pr.lado;
  // Teléfono vertical: al lado no cabe; debajo si hay sitio, si no, encima.
  if (e.lupaV && (lado === 'der' || lado === 'izq')) lado = p.y + d / 2 + 90 + LUPA_H <= ALTO - 12 ? 'abajo' : 'arriba';
  let x = p.x + d / 2 + sep, y = p.y - LUPA_H / 2;
  if (lado === 'izq') x = p.x - d / 2 - sep - LUPA_W;
  if (lado === 'abajo') { const k = e.tx ?? 1; x = p.x - LUPA_W / 2; y = p.y + d / 2 + (70 + (a?.marcas.length ?? 0) * 42 + (e.lupaV && a?.sub ? 22 : 0)) * k; }
  if (lado === 'arriba') { x = p.x - LUPA_W / 2; y = p.y - d / 2 - (e.lupaV && a?.marcadores.length ? 75 : 50) - LUPA_H; }
  return { x: Math.max(12, Math.min(ANCHO - LUPA_W - 12, x)), y: Math.max(12, Math.min(ALTO - LUPA_H - 12, y)) };
}

// ─── Encuadre automático ─────────────────────────────────────────────────────
// En un paso sin cámara propia, la cámara se acerca a lo que pasa: las células
// visibles al empezar y al terminar (con sus rótulos y marcas), las lupas y los
// desenlaces. Con el lienzo entero a la vista, en una pantalla de portátil las
// células salían diminutas.

type Rect = { x0: number; y0: number; x1: number; y1: number };

function contenido(e: Escena, r: Rect | null, solo?: Set<string>): Rect | null {
  let out = r;
  const sumar = (x0: number, y0: number, x1: number, y1: number) => {
    out = out ? { x0: Math.min(out.x0, x0), y0: Math.min(out.y0, y0), x1: Math.max(out.x1, x1), y1: Math.max(out.y1, y1) } : { x0, y0, x1, y1 };
  };
  for (const k of e.orden) {
    const a = e.actores[k];
    if (!a?.vis || (solo && !solo.has(k))) continue;
    const p = posAbs(e, k);
    const tx = e.tx ?? 1;
    const media = Math.max(a.d / 2 + (a.marcadores.length ? 55 : 15), a.label.length * 5.4 * tx, (a.sub?.length ?? 0) * 4.2 * tx);
    const abajo = a.d / 2 + (34 + (a.sub ? 20 : 0) + a.marcas.length * 42) * tx + (a.marcadores.length ? 30 : 0);
    sumar(p.x - media, p.y - a.d / 2 - (a.marcadores.length ? 55 : 15), p.x + media, p.y + abajo);
  }
  for (const pr of e.procesos) { if (pr.saliendo) continue; const q = posLupa(pr, e); sumar(q.x, q.y, q.x + LUPA_W, q.y + LUPA_H); }
  for (const d of e.desenlaces) { if (d.saliendo) continue; const k = e.tx ?? 1, w = Math.max(280, d.texto.length * 11 + 80) * k; sumar(d.x - w / 2, d.y - 32 * k, d.x + w / 2, d.y + 32 * k); }
  return out;
}

/** Actores que el paso toca (los que aparecen, se mueven, se dividen, abren
 *  lupa, reciben una nota…): en el teléfono la cámara se acerca solo a ellos. */
function actoresDelPaso(paso: Paso): Set<string> {
  const k = new Set<string>();
  for (const a of paso.acciones) {
    const x = a as Record<string, unknown>;
    for (const campo of ['actor', 'target', 'cerca', 'near']) if (typeof x[campo] === 'string') k.add(x[campo] as string);
    if (a.tipo === 'divide') a.into.forEach((i) => k.add(i));
    if (a.tipo === 'release') k.add(a.from);
    if (a.tipo === 'connect' || a.tipo === 'pulse_signal') { k.add(a.from); k.add(a.to); }
    if (a.tipo === 'highlight') a.actors.forEach((i) => k.add(i));
  }
  paso.protagonistas.forEach((i) => k.add(i));
  return k;
}

function encuadreAuto(base: Escena, final: Escena, lupas: Escena[], paso: Paso, modo: Modo): { col: number; row: number; w: number; h: number } | 'all' {
  // planoGeneral: el paso mira el conjunto (también en el teléfono).
  const cerca = modo.movil && !paso.planoGeneral;
  const solo = cerca ? actoresDelPaso(paso) : undefined;
  // En el teléfono, solo dónde acaba la acción: las células que llegan de lejos
  // entran en cuadro durante el paso.
  let r = contenido(final, cerca ? null : contenido(base, null), solo);
  for (const e of lupas) r = contenido(e, r, solo);
  if (!r && solo) return encuadreAuto(base, final, lupas, paso, { ...modo, movil: false });
  if (!r) return 'all';
  const pad = modo.movil ? 30 : 50;
  let { x0, y0, x1, y1 } = { x0: r.x0 - pad, y0: r.y0 - pad, x1: r.x1 + pad, y1: r.y1 + pad };
  // Nunca más cerca que esto: el órgano tiene que seguir leyéndose.
  const minW = modo.movil ? 560 : 820, minH = modo.movil ? 420 : 520;
  if (x1 - x0 < minW) { const c = (x0 + x1) / 2; x0 = c - minW / 2; x1 = c + minW / 2; }
  if (y1 - y0 < minH) { const c = (y0 + y1) / 2; y0 = c - minH / 2; y1 = c + minH / 2; }
  if (!modo.movil && x1 - x0 > ANCHO * 0.9 && y1 - y0 > ALTO * 0.9) return 'all';
  return { col: x0 / CELDA, row: y0 / CELDA, w: (x1 - x0) / CELDA, h: (y1 - y0) / CELDA };
}

function reiniciar(A: ActorSt) {
  Object.assign(A, { halo: 0, gris: 0, surco: 0, apoptosis: 0, marcas: [], prev: null, mezcla: 1, esc: 1 });
}

// ─── Acciones ─────────────────────────────────────────────────────────────────

type Memo = Record<string, unknown>;

function aplicar(e: Escena, a: Accion, p: number, m: Memo) {
  const pe = easeOut(p);
  const pio = easeInOut(p);

  switch (a.tipo) {
    case 'appear': {
      const pos = (e.lupaV && a.posV) || a.pos;
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.nuevo === undefined) m.nuevo = !A.vis;
      if (m.nuevo) { reiniciar(A); alFrente(e, a.actor); }
      const dd = 90;
      const off = { top: [0, -dd], bottom: [0, dd], left: [-dd, 0], right: [dd, 0] }[a.from as string] ?? [0, 0];
      Object.assign(A, { vis: true, anclado: null, x: g(pos.col) + off[0] * (1 - pe), y: g(pos.row) + off[1] * (1 - pe), op: pe });
      A.esc = a.from === 'grow' ? lerp(0.3, 1, easeBack(p)) : lerp(0.8, 1, pe);
      return;
    }
    case 'move': {
      const to = (e.lupaV && a.toV) || a.to;
      const A = e.actores[a.actor];
      if (!A) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      const d = m.desde as { x: number; y: number };
      A.anclado = null;
      A.x = lerp(d.x, g(to.col), pio);
      A.y = lerp(d.y, g(to.row), pio);
      // Una célula que migra se estira un poco en la dirección del movimiento.
      A.rot = 0;
      A.esc = 1 + 0.04 * Math.sin(Math.PI * p);
      return;
    }
    case 'bind': {
      const A = e.actores[a.actor], T = e.actores[a.target];
      if (!A || !T) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      if (!m.off) {
        if (a.offset) m.off = { x: g(a.offset.col), y: g(a.offset.row) };
        else {
          const r = (A.d + T.d) / 2 * 0.9;
          m.off = { izq: { x: -r, y: 0 }, der: { x: r, y: 0 }, arriba: { x: 0, y: -r }, abajo: { x: 0, y: r } }[a.lado ?? 'izq'];
        }
      }
      const d = m.desde as { x: number; y: number }, off = m.off as { x: number; y: number };
      const h = posAbs(e, a.target);
      if (m.frente === undefined) { m.frente = true; alFrente(e, a.actor); }
      if (p >= 1) A.anclado = { host: a.target, dx: off.x, dy: off.y };
      else { A.anclado = null; A.x = lerp(d.x, h.x + off.x, pio); A.y = lerp(d.y, h.y + off.y, pio); }
      const q = tramo(p, 0.75, 1);
      if (q > 0 && q < 1) e.efectos.push({ tipo: 'destello', p: q, x: h.x + off.x / 2, y: h.y + off.y / 2, r: 40, color: A.color });
      return;
    }
    case 'release': {
      const A = e.actores[a.actor];
      if (!A || !e.actores[a.from]) return;
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.fp = posAbs(e, a.from); }
      const d = m.desde as { x: number; y: number }, fp = m.fp as { x: number; y: number };
      A.anclado = null;
      let tx: number, ty: number;
      if (a.to) { tx = g(a.to.col); ty = g(a.to.row); } else { const dx = d.x - fp.x, dy = d.y - fp.y, n = Math.hypot(dx, dy) || 1; tx = d.x + (dx / n) * 90; ty = d.y + (dy / n) * 90; }
      A.x = lerp(d.x, tx, easeBack(p)); A.y = lerp(d.y, ty, easeBack(p));
      return;
    }
    case 'activate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.h0 === undefined) m.h0 = A.halo;
      A.halo = lerp(m.h0 as number, 0.9, pe);
      A.esc = (A.esc || 1) * (1 + 0.06 * Math.sin(Math.PI * p));
      return;
    }
    case 'deactivate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.h0 === undefined) m.h0 = A.halo;
      A.halo = lerp(m.h0 as number, 0, pe);
      return;
    }
    case 'hide': {
      const A = e.actores[a.actor];
      if (!A) return;
      A.op = 1 - pe;
      if (p >= 1) { soltarHuespedes(e, a.actor); A.vis = false; A.op = 0; }
      return;
    }
    case 'swap': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.img0 === undefined) { m.img0 = A.img; m.dib0 = A.dibujo; m.d0 = A.d; }
      const cambiaImagen = (a.img && a.img !== m.img0) || (a.dibujo && a.dibujo !== m.dib0);
      if (cambiaImagen) {
        A.prev = p < 1 ? { img: m.img0 as string | undefined, dibujo: m.dib0 as Dibujo | undefined } : null;
        if (a.img) { A.img = a.img; if (!a.dibujo) A.dibujo = undefined; }
        if (a.dibujo) { A.dibujo = a.dibujo; if (!a.img) A.img = undefined; }
        A.mezcla = p < 1 ? pe : 1;
        if (a.img && !a.dibujo) A.forma = 'celula';
        if (a.dibujo && !a.img) A.forma = 'dibujo';
      }
      if (a.d) A.d = lerp(m.d0 as number, a.d, pio);
      if (p >= 0.5) { if (a.label) A.label = a.label; if (a.sub !== undefined) A.sub = a.sub; }
      A.esc = (A.esc || 1) * (1 + 0.07 * Math.sin(Math.PI * p));
      const q = tramo(p, 0.2, 0.8);
      if (q > 0 && q < 1) { const c = posAbs(e, a.actor); e.efectos.push({ tipo: 'destello', p: q, x: c.x, y: c.y, r: A.d * 0.6, color: A.color }); }
      return;
    }
    case 'divide': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      const d = m.desde as { x: number; y: number };
      // 0–0.45: la célula se estrangula; 0.45–1: las hijas se separan.
      A.surco = easeInOut(tramo(p, 0, 0.45));
      A.esc = 1 + 0.08 * tramo(p, 0, 0.45);
      A.op = 1 - tramo(p, 0.4, 0.5);
      if (p >= 0.5 && A.vis) { soltarHuespedes(e, a.actor); A.vis = false; A.op = 0; A.surco = 0; }
      const q = easeInOut(tramo(p, 0.42, 1));
      a.into.forEach((k, i) => {
        const H = e.actores[k];
        if (!H) return;
        if (m[`n${i}`] === undefined) { m[`n${i}`] = !H.vis; }
        if (p < 0.42) return;
        if (m[`n${i}`]) { reiniciar(H); alFrente(e, k); H.marcadores = A.marcadores.map((mk) => ({ ...mk })); }
        const t = ((e.lupaV && a.posV) || a.pos)[i];
        const lado = i === 0 ? -1 : 1;
        Object.assign(H, { vis: true, anclado: null, op: easeOut(tramo(p, 0.42, 0.55)), esc: lerp(0.78, 1, q), x: lerp(d.x + lado * A.d * 0.18, g(t.col), q), y: lerp(d.y, g(t.row), q) });
      });
      const f = tramo(p, 0.35, 0.6);
      if (f > 0 && f < 1) e.efectos.push({ tipo: 'destello', p: f, x: d.x, y: d.y, r: A.d * 0.55, color: '#3DDC97' });
      return;
    }
    case 'apoptosis': {
      const A = e.actores[a.actor];
      if (!A) return;
      const c = posAbs(e, a.actor);
      A.apoptosis = tramo(p, 0, 0.75);
      A.gris = lerp(0, 0.6, tramo(p, 0, 0.5));
      A.esc = lerp(1, 0.55, easeInOut(tramo(p, 0.1, 0.8)));
      A.op = 1 - tramo(p, 0.7, 1);
      const f = tramo(p, 0.6, 1);
      if (f > 0 && f < 1) e.efectos.push({ tipo: 'fragmentos', p: f, x: c.x, y: c.y, r: A.d * 0.4 });
      if (p >= 1) { soltarHuespedes(e, a.actor); A.vis = false; A.op = 0; A.apoptosis = 0; A.gris = 0; }
      return;
    }
    case 'anergia': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.g0 === undefined) { m.g0 = A.gris; m.h0 = A.halo; }
      A.gris = lerp(m.g0 as number, 0.8, pe);
      A.halo = lerp(m.h0 as number, 0, pe);
      return;
    }
    case 'express': {
      const A = e.actores[a.actor];
      if (!A) return;
      let mk = A.marcadores.find((x) => x.id === a.marcador.id);
      if (!mk) { mk = { ...a.marcador, op: 0 }; A.marcadores.push(mk); }
      Object.assign(mk, a.marcador, { op: easeBack(p) });
      return;
    }
    case 'unexpress': {
      const A = e.actores[a.actor];
      if (!A) return;
      const mk = A.marcadores.find((x) => x.id === a.id);
      if (mk) mk.op = 1 - pe;
      if (p >= 1) A.marcadores = A.marcadores.filter((x) => x.id !== a.id);
      return;
    }
    case 'proceso': {
      if (!e.actores[a.cerca]) return;
      const i = e.procesos.findIndex((x) => x.id === a.id);
      const st: ProcesoSt = { id: a.id, cerca: a.cerca, lado: a.lado ?? 'der', datos: a.datos, p, op: easeOut(tramo(p, 0, 0.08)), persist: !!a.persist };
      if (i === -1) e.procesos.push(st); else e.procesos[i] = st;
      return;
    }
    case 'cerrar_proceso': {
      const pr = e.procesos.find((x) => x.id === a.id);
      if (pr) pr.op = 1 - pe;
      if (p >= 1) e.procesos = e.procesos.filter((x) => x.id !== a.id);
      return;
    }
    case 'marca': {
      const A = e.actores[a.actor];
      if (!A) return;
      let mc = A.marcas.find((x) => x.texto === a.texto);
      if (!mc) { mc = { texto: a.texto, sub: a.sub, op: 0 }; A.marcas.push(mc); }
      mc.op = pe;
      const q = tramo(p, 0, 0.7);
      if (q > 0 && q < 1) { const c = posAbs(e, a.actor); e.efectos.push({ tipo: 'destello', p: q, x: c.x, y: c.y, r: A.d * 0.7, color: '#E5484D' }); }
      return;
    }
    case 'pulse_signal': {
      if (!e.actores[a.from] || !e.actores[a.to] || p >= 1) return;
      const c = e.conectores.find((x) => (x.from === a.from && x.to === a.to) || (x.from === a.to && x.to === a.from));
      const inv = c && c.from !== a.from;
      const x1 = posAbs(e, a.from), x2 = posAbs(e, a.to);
      e.efectos.push({ tipo: 'punto', p, via: c?.id ?? null, x1: x1.x, y1: x1.y, x2: x2.x, y2: x2.y, f: inv ? 1 - p : p, color: '#3DDC97' });
      return;
    }
    case 'outcome': {
      const x = g(a.pos?.col ?? 8), y = g(a.pos?.row ?? 9);
      const id = `out:${a.kind}:${Math.round(x)}:${Math.round(y)}`;
      e.desenlaces = e.desenlaces.filter((d) => d.id === id || Math.hypot(d.x - x, d.y - y) > 150);
      const i = e.desenlaces.findIndex((d) => d.id === id);
      const nuevo: DesenlaceSt = { id, kind: a.kind, x, y, op: pe, texto: a.texto };
      if (i === -1) e.desenlaces.push(nuevo); else e.desenlaces[i] = nuevo;
      return;
    }
    case 'camera': {
      if (!m.desde) m.desde = { ...e.camara };
      const d = m.desde as Caja;
      const asp = (m.asp as number | undefined) ?? ANCHO / ALTO;
      const b = a.box === 'all' ? (m.asp ? encuadre({ col: 0, row: 0, w: ANCHO / CELDA, h: ALTO / CELDA }, asp) : CAMARA_TODO) : encuadre(a.box, asp);
      e.camara = { x: lerp(d.x, b.x, pio), y: lerp(d.y, b.y, pio), w: lerp(d.w, b.w, pio), h: lerp(d.h, b.h, pio) };
      return;
    }
    case 'highlight': {
      const k = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
      e.foco = p >= 1 ? null : { actors: a.actors, k: clamp(k) };
      return;
    }
    case 'note': {
      const id = `nota:${a.near}:${a.text}`;
      const i = e.notas.findIndex((n) => n.id === id);
      const n: NotaSt = { id, text: a.text, near: a.near, side: a.side ?? 'top', op: pe, persist: !!a.persist };
      if (i === -1) e.notas.push(n); else e.notas[i] = n;
      return;
    }
    case 'connect': {
      if (!e.actores[a.from] || !e.actores[a.to]) return;
      ponerConector(e, { id: a.id, from: a.from, to: a.to, type: a.type, label: a.label, curve: a.curve, prog: pe });
      return;
    }
    case 'disconnect': {
      const c = e.conectores.find((x) => x.id === a.id);
      if (c) c.op = 1 - pe;
      if (p >= 1) e.conectores = e.conectores.filter((x) => x.id !== a.id);
      return;
    }
    case 'despedir': {
      for (const n of e.notas) if (n.saliendo) n.op = 1 - pe;
      for (const pr of e.procesos) if (pr.saliendo) pr.op = 1 - pe;
      for (const d of e.desenlaces) if (d.saliendo) d.op = 1 - pe;
      if (p >= 1) {
        e.notas = e.notas.filter((n) => !n.saliendo);
        e.procesos = e.procesos.filter((pr) => !pr.saliendo);
        e.desenlaces = e.desenlaces.filter((d) => !d.saliendo);
      }
      return;
    }
    case 'wait':
      return;
  }
}

function cerrar(e: Escena): Escena {
  for (const k in e.actores) {
    const a = e.actores[k];
    a.ex = 0; a.ey = 0; a.rot = 0; a.prev = null; a.mezcla = 1; a.surco = 0;
    if (a.vis) { a.esc = 1; a.op = 1; }
    a.marcadores = a.marcadores.filter((mk) => mk.op > 0.01).map((mk) => ({ ...mk, op: 1 }));
    a.marcas = a.marcas.map((x) => ({ ...x, op: 1 }));
  }
  e.efectos = [];
  e.foco = null;
  // Lo que no persiste no se borra aquí: queda «saliendo» y el paso siguiente
  // lo desvanece. Así una lupa o un aviso no desaparecen de golpe.
  e.notas = e.notas.filter((n) => !n.saliendo && n.op > 0.01).map((n) => ({ ...n, op: 1, saliendo: !n.persist }));
  e.conectores = e.conectores.filter((c) => c.op > 0.01 && e.actores[c.from]?.vis && e.actores[c.to]?.vis).map((c) => ({ ...c, prog: 1, op: 1 }));
  e.desenlaces = e.desenlaces.filter((d) => !d.saliendo && d.op > 0.01).map((d) => ({ ...d, op: 1, saliendo: true }));
  // La lupa se cierra al cambiar de paso salvo `persist` (queda en su fotograma final).
  e.procesos = e.procesos.filter((pr) => !pr.saliendo && pr.op > 0.01).map((pr) => ({ ...pr, p: 1, op: 1, saliendo: !pr.persist }));
  return e;
}

// ─── Compilación ──────────────────────────────────────────────────────────────

export type AccionCompilada = { a: Accion; at: number; dur: number; m: Memo };
export type PasoCompilado = { paso: Paso; indice: number; acciones: AccionCompilada[]; duracion: number; base: Escena; final: Escena };
export type EscenarioCompilado = { escenario: Escenario; pasos: PasoCompilado[] };

export function escenaVacia(esc: Escenario, modo: Modo = MODO_ESCRITORIO): Escena {
  const actores: Record<string, ActorSt> = {};
  for (const [key, d] of Object.entries(esc.actores)) {
    actores[key] = {
      key, forma: d.forma, img: d.img, dibujo: d.dibujo, prev: null, mezcla: 1, color: d.color ?? '#7FA7D9', d: diametroDecl(d),
      label: d.label, sub: d.sub, x: ANCHO / 2, y: ALTO / 2, esc: 1, rot: 0, op: 0, vis: false, halo: 0, gris: 0, surco: 0,
      apoptosis: 0, marcadores: [], marcas: [], anclado: null, ex: 0, ey: 0,
    };
  }
  const camara = modo.movil ? encuadre({ col: 0, row: 0, w: ANCHO / CELDA, h: ALTO / CELDA }, modo.asp) : { ...CAMARA_TODO };
  const lupaV = modo.movil && modo.asp < 1.1;
  return { actores, orden: [], conectores: [], notas: [], desenlaces: [], procesos: [], efectos: [], camara, foco: null, lupaV, tx: modo.movil ? (lupaV ? 1.35 : 1.2) : 1 };
}

function correr(base: Escena, acciones: AccionCompilada[], t: number): Escena {
  const e = clonar(base);
  for (const c of acciones) {
    if (t < c.at) break;
    aplicar(e, c.a, c.dur > 0 ? clamp((t - c.at) / c.dur) : 1, c.m);
  }
  return e;
}

export function compilarPaso(base: Escena, paso: Paso, indice: number, auto = true, modo: Modo = MODO_ESCRITORIO): PasoCompilado {
  const propias = [...paso.acciones];
  if (!propias.some((a) => a.tipo === 'camera')) {
    if (auto) {
      // Pasada de prueba para saber qué ocupa el paso (y dónde caen sus lupas,
      // que se cierran al terminar: se miden a media animación).
      const prueba = propias.map((a) => ({ a, at: a.at, dur: duracionDe(a), m: {} as Memo })).sort((x, y) => x.at - y.at);
      const fin = prueba.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
      const medio = correr(base, prueba.map((c) => ({ ...c, m: {} })), fin * 0.6);
      const e = clonar(base);
      for (const c of prueba) aplicar(e, c.a, 1, c.m);
      // En el teléfono la cámara mira solo a dónde acaba la acción: si llegara
      // antes que las células que viajan, las dejaría cortadas en el borde.
      // Se desplaza a la par que ellas.
      const viaje = modo.movil ? prueba.filter((c) => c.a.tipo === 'move' || c.a.tipo === 'release' || c.a.tipo === 'bind').reduce((mx, c) => Math.max(mx, c.at + c.dur), 0) : 0;
      propias.unshift({ at: 0, duration: Math.min(2600, Math.max(900, viaje)), tipo: 'camera', box: encuadreAuto(base, e, [medio], paso, modo) });
    } else {
      const zoom = base.camara.w !== CAMARA_TODO.w || base.camara.x !== 0 || base.camara.y !== 0;
      if (zoom) propias.unshift({ at: 0, tipo: 'camera', box: 'all' });
    }
  }
  if (base.notas.some((n) => n.saliendo) || base.procesos.some((p) => p.saliendo) || base.desenlaces.some((d) => d.saliendo)) {
    propias.unshift({ at: 0, duration: 700, tipo: 'despedir' });
  }
  // El memo de cada cámara lleva la proporción de la pantalla para la que se compila.
  const acciones = propias.map((a) => ({ a, at: a.at, dur: duracionDe(a), m: (a.tipo === 'camera' && modo.movil ? { asp: modo.asp } : {}) as Memo })).sort((x, y) => x.at - y.at);
  const duracion = acciones.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
  const e = clonar(base);
  for (const c of acciones) aplicar(e, c.a, 1, c.m);
  return { paso, indice, acciones, duracion, base, final: cerrar(e) };
}

export function compilar(esc: Escenario, modo: Modo = MODO_ESCRITORIO): EscenarioCompilado {
  const pasos: PasoCompilado[] = [];
  let anterior = escenaVacia(esc, modo);
  esc.pasos.forEach((paso, i) => { const pc = compilarPaso(anterior, paso, i, true, modo); pasos.push(pc); anterior = pc.final; });
  return { escenario: esc, pasos };
}

export function evaluar(pc: PasoCompilado, t: number): Escena {
  if (t >= pc.duracion) return pc.final;
  return correr(pc.base, pc.acciones, t);
}
