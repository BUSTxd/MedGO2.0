// Motor de la escena del laboratorio «Lupus eritematoso sistémico».
//
// Copia del motor de «Hipersensibilidad» (la escena es una FUNCIÓN PURA del
// tiempo: `evaluar(paso, t)` parte del final del paso anterior y aplica cada
// acción con su progreso; `tejido` anima los parámetros de la lámina de fondo),
// con un cambio de fondo: LA VOZ ES EL RELOJ. Si el capítulo trae narración, cada
// paso dura lo que su frase en el audio (`marcas[i + 1] − marcas[i]`, el último
// hasta el final del audio), no lo que duran sus acciones; el verificador
// (`npm run verificar:lupus`) exige que ninguna acción se pase de ese margen.
// Así la animación y la voz no se desfasan: en Hipersensibilidad la animación se
// hizo antes que la voz y en el tipo II acababa 25 s después que ella.

import type { Accion, ActorDecl, ConnectorType, DatosProceso, DesenlaceKind, Dibujo, Escenario, Fondo, Forma, Isotipo, Lado, Marcador, Paso, Particula } from '@/lib/data/lupus/tipos';
import { ZONAS } from '@/lib/data/lupus/zonas';

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
  prev: { img?: string; dibujo?: Dibujo } | null;
  mezcla: number;
  color: string;
  d: number;
  label: string;
  sub?: string;
  ab?: Isotipo;
  n?: number;
  x: number;
  y: number;
  esc: number;
  /** Giro (grados). Un anticuerpo anclado gira con `anclado.rot`. */
  rot: number;
  op: number;
  vis: boolean;
  halo: number;
  gris: number;
  surco: number;
  apoptosis: number;
  /** 0–1: gránulos vaciados (desgranulación). */
  granulos: number;
  /** 0–1: poros del MAC → hinchazón → rotura. */
  lisis: number;
  /** 1 = dentro de un fagosoma. */
  fago: number;
  marcadores: MarcadorSt[];
  /** Caja: ancho y alto; icono: cuál. */
  ajusta?: boolean; w?: number;
  h?: number;
  icono?: string;
  anclado: { host: string; dx: number; dy: number; rot?: number } | null;
  ex: number;
  ey: number;
};

export type ConectorSt = { id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number; prog: number; op: number };
export type NotaSt = { id: string; text: string; near: string; side: 'top' | 'right' | 'bottom' | 'left'; op: number; persist: boolean; saliendo?: boolean };
export type DesenlaceSt = { id: string; kind: DesenlaceKind; x: number; y: number; op: number; texto: string; saliendo?: boolean };
export type ProcesoSt = { id: string; cerca: string; lado: Lado; datos: DatosProceso; p: number; op: number; persist: boolean; saliendo?: boolean };

export type EfectoSt =
  | { tipo: 'destello'; p: number; x: number; y: number; r: number; color: string }
  | { tipo: 'fragmentos'; p: number; x: number; y: number; r: number }
  | { tipo: 'punto'; p: number; via: string | null; x1: number; y1: number; x2: number; y2: number; f: number; color: string }
  /** Chorro: `n` partículas de `kind` que salen de (x1, y1) a radio `r` hacia
   *  (x2, y2), o en abanico si no hay destino. `semilla` las distingue. */
  | { tipo: 'particulas'; p: number; kind: Particula; n: number; x1: number; y1: number; r: number; x2?: number; y2?: number; semilla: number; label?: string }
  /** Seudópodos del fagocito abrazando a (x, y). */
  | { tipo: 'seudopodos'; p: number; x: number; y: number; r: number; ang: number; color: string };

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
  fondo: Fondo;
  /** Fondo del que se sale en un cambio (fundido) y cuánto va. */
  fondoPrev: Fondo | null;
  fondoMezcla: number;
  tejido: Record<string, number>;
  /** ms acumulados de la parte (movimiento de fondo). */
  reloj: number;
  lupaV?: boolean;
  tx?: number;
};

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
    case 'celula': return 140;
    case 'dibujo': return 140;
    case 'proteina': return 70;
    case 'molecula': return 34;
    case 'anticuerpo': return 46;
    case 'complejo': return 70;
    case 'ancla': return 10;
    case 'caja': return d.h ?? 90;
    case 'texto': return 44;
    case 'icono': return 90;
  }
}

export const DURACION: Record<string, number> = {
  appear: 500, move: 900, bind: 700, release: 600, activate: 450, deactivate: 450, hide: 400, swap: 700,
  divide: 1400, apoptosis: 1500, express: 500, unexpress: 400, proceso: 3600, cerrar_proceso: 400,
  degranular: 1800, secretar: 1600, fagocitar: 2200, lisis: 1700, tejido: 1400, fondo: 1000,
  pulse_signal: 700, outcome: 800, camera: 800, highlight: 1400, note: 400, connect: 500, disconnect: 300,
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
    actores[k] = { ...a, marcadores: a.marcadores.map((m) => ({ ...m })), anclado: a.anclado ? { ...a.anclado } : null, prev: a.prev ? { ...a.prev } : null };
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
    fondo: e.fondo,
    fondoPrev: e.fondoPrev,
    fondoMezcla: e.fondoMezcla,
    tejido: { ...e.tejido },
    reloj: e.reloj,
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

/** Giro con el que se pinta el actor (el del anclaje si lo tiene). */
export function rotAbs(e: Escena, key: string): number {
  const a = e.actores[key];
  return a?.anclado?.rot ?? a?.rot ?? 0;
}

export function cajaActor(e: Escena, key: string): Caja {
  const a = e.actores[key];
  const p = posAbs(e, key);
  if (a?.forma === 'caja' && a.w && a.h) { const w = a.w * a.esc, h = a.h * a.esc; return { x: p.x - w / 2, y: p.y - h / 2, w, h }; }
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
    if (a.anclado?.host === key) { const p = posAbs(e, k); a.rot = a.anclado.rot ?? a.rot; a.x = p.x; a.y = p.y; a.anclado = null; }
  }
}

/** Oculta también lo que va pegado al actor (anticuerpos sobre una célula que se lisa). */
function ocultarHuespedes(e: Escena, key: string, op: number) {
  for (const k in e.actores) {
    const a = e.actores[k];
    if (a.anclado?.host === key && a.vis) { a.op = Math.min(a.op, op); if (op <= 0) { a.vis = false; a.anclado = null; } }
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
  if (asp >= ANCHO / ALTO) { w = Math.min(w, ANCHO); h = Math.min(h, ALTO); }
  else if (w > ANCHO) { w = ANCHO; h = w / asp; }
  const cx = g(b.col) + g(b.w) / 2, cy = g(b.row) + g(b.h) / 2;
  const x = Math.min(Math.max(0, cx - w / 2), ANCHO - w);
  const y = h > ALTO ? (ALTO - h) / 2 : Math.min(Math.max(0, cy - h / 2), ALTO - h);
  return { x, y, w, h };
}

// ─── Lupa ─────────────────────────────────────────────────────────────────────

export const LUPA_W = 580;
export const LUPA_H = 262;

export function posLupa(pr: Pick<ProcesoSt, 'cerca' | 'lado'>, e: Escena): { x: number; y: number } {
  const a = e.actores[pr.cerca];
  const p = posAbs(e, pr.cerca);
  const d = a?.d ?? 120;
  const sep = a?.marcadores.length ? 95 : 50;
  let lado = pr.lado;
  if (e.lupaV && (lado === 'der' || lado === 'izq')) lado = p.y + d / 2 + 90 + LUPA_H <= ALTO - 12 ? 'abajo' : 'arriba';
  let x = p.x + d / 2 + sep, y = p.y - LUPA_H / 2;
  if (lado === 'izq') x = p.x - d / 2 - sep - LUPA_W;
  if (lado === 'abajo') { const k = e.tx ?? 1; x = p.x - LUPA_W / 2; y = p.y + d / 2 + (70 + (e.lupaV && a?.sub ? 22 : 0)) * k; }
  if (lado === 'arriba') { x = p.x - LUPA_W / 2; y = p.y - d / 2 - (e.lupaV && a?.marcadores.length ? 75 : 50) - LUPA_H; }
  return { x: Math.max(12, Math.min(ANCHO - LUPA_W - 12, x)), y: Math.max(12, Math.min(ALTO - LUPA_H - 12, y)) };
}

// ─── Encuadre automático ─────────────────────────────────────────────────────
// La cámara se acerca a lo que pasa: células visibles al empezar y al terminar,
// lupas, desenlaces y, si el paso anima el tejido, la zona de ese tejido.

type Rect = { x0: number; y0: number; x1: number; y1: number };

function contenido(e: Escena, r: Rect | null, solo?: Set<string>): Rect | null {
  let out = r;
  const sumar = (x0: number, y0: number, x1: number, y1: number) => {
    out = out ? { x0: Math.min(out.x0, x0), y0: Math.min(out.y0, y0), x1: Math.max(out.x1, x1), y1: Math.max(out.y1, y1) } : { x0, y0, x1, y1 };
  };
  for (const k of e.orden) {
    const a = e.actores[k];
    if (!a?.vis || a.forma === 'ancla' || (solo && !solo.has(k))) continue;
    const p = posAbs(e, k);
    const tx = e.tx ?? 1;
    const etiqueta = a.forma === 'anticuerpo' ? 0 : a.label.length * 5.4 * tx;
    const media = Math.max(a.d / 2 + (a.marcadores.length ? 50 : 15), etiqueta, (a.sub?.length ?? 0) * 4.2 * tx);
    const abajo = a.d / 2 + (a.forma === 'anticuerpo' ? 10 : (34 + (a.sub ? 20 : 0)) * tx) + (a.marcadores.length ? 30 : 0);
    sumar(p.x - media, p.y - a.d / 2 - (a.marcadores.length ? 50 : 15), p.x + media, p.y + abajo);
  }
  for (const pr of e.procesos) { if (pr.saliendo) continue; const q = posLupa(pr, e); sumar(q.x, q.y, q.x + LUPA_W, q.y + LUPA_H); }
  for (const d of e.desenlaces) { if (d.saliendo) continue; const k = e.tx ?? 1, w = Math.max(280, d.texto.length * 11 + 80) * k; sumar(d.x - w / 2, d.y - 32 * k, d.x + w / 2, d.y + 32 * k); }
  return out;
}

function actoresDelPaso(paso: Paso): Set<string> {
  const k = new Set<string>();
  for (const a of paso.acciones) {
    const x = a as Record<string, unknown>;
    for (const campo of ['actor', 'target', 'cerca', 'near']) if (typeof x[campo] === 'string') k.add(x[campo] as string);
    if (a.tipo === 'divide') a.into.forEach((i) => k.add(i));
    if (a.tipo === 'release') k.add(a.from);
    if (a.tipo === 'connect' || a.tipo === 'pulse_signal') { k.add(a.from); k.add(a.to); }
    if (a.tipo === 'highlight') a.actors.forEach((i) => k.add(i));
    if (a.tipo === 'secretar' && typeof a.hacia === 'string') k.add(a.hacia);
  }
  paso.protagonistas.forEach((i) => k.add(i));
  return k;
}

/** Zonas del tejido que el paso anima (en el fondo que tendrá cuando lo anime). */
function zonasDelPaso(base: Escena, paso: Paso): Rect[] {
  let fondo = base.fondo;
  const out: Rect[] = [];
  for (const a of [...paso.acciones].sort((x, y) => x.at - y.at)) {
    if (a.tipo === 'fondo') fondo = a.fondo;
    if (a.tipo === 'tejido') { const z = ZONAS[fondo]?.[a.param]; if (z) out.push(z); }
  }
  return out;
}

function encuadreAuto(base: Escena, final: Escena, lupas: Escena[], paso: Paso, modo: Modo): { col: number; row: number; w: number; h: number } | 'all' {
  const cerca = modo.movil && !paso.planoGeneral;
  const solo = cerca ? actoresDelPaso(paso) : undefined;
  // Si el paso cambia de tejido, lo de antes no cuenta.
  const cambia = paso.acciones.some((a) => a.tipo === 'fondo');
  let r = contenido(final, cerca || cambia ? null : contenido(base, null), solo);
  for (const e of lupas) r = contenido(e, r, solo);
  for (const z of zonasDelPaso(base, paso)) r = r ? { x0: Math.min(r.x0, z.x0), y0: Math.min(r.y0, z.y0), x1: Math.max(r.x1, z.x1), y1: Math.max(r.y1, z.y1) } : { ...z };
  if (!r && solo) return encuadreAuto(base, final, lupas, paso, { ...modo, movil: false });
  if (!r) return 'all';
  const pad = modo.movil ? 30 : 50;
  let { x0, y0, x1, y1 } = { x0: r.x0 - pad, y0: r.y0 - pad, x1: r.x1 + pad, y1: r.y1 + pad };
  const minW = modo.movil ? 560 : 900, minH = modo.movil ? 420 : 560;
  if (x1 - x0 < minW) { const c = (x0 + x1) / 2; x0 = c - minW / 2; x1 = c + minW / 2; }
  if (y1 - y0 < minH) { const c = (y0 + y1) / 2; y0 = c - minH / 2; y1 = c + minH / 2; }
  if (!modo.movil && x1 - x0 > ANCHO * 0.85 && y1 - y0 > ALTO * 0.85) return 'all';
  return { col: x0 / CELDA, row: y0 / CELDA, w: (x1 - x0) / CELDA, h: (y1 - y0) / CELDA };
}

function reiniciar(A: ActorSt) {
  Object.assign(A, { halo: 0, gris: 0, surco: 0, apoptosis: 0, granulos: 0, lisis: 0, fago: 0, prev: null, mezcla: 1, esc: 1 });
}

/** Pseudoazar estable: el mismo índice da siempre el mismo número (0–1). */
export function hash(i: number, s = 0): number {
  const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Acciones ─────────────────────────────────────────────────────────────────

type Memo = Record<string, unknown>;

function destinoDe(e: Escena, hacia: string | { col: number; row: number } | undefined): { x: number; y: number } | null {
  if (!hacia) return null;
  if (typeof hacia === 'string') return e.actores[hacia]?.vis ? posAbs(e, hacia) : null;
  return { x: g(hacia.col), y: g(hacia.row) };
}

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
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.rot = rotAbs(e, a.actor); }
      const d = m.desde as { x: number; y: number };
      A.anclado = null;
      A.rot = m.rot as number;
      A.x = lerp(d.x, g(to.col), pio);
      A.y = lerp(d.y, g(to.row), pio);
      A.esc = 1 + 0.04 * Math.sin(Math.PI * p);
      return;
    }
    case 'bind': {
      const A = e.actores[a.actor], T = e.actores[a.target];
      if (!A || !T) return;
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.rot0 = rotAbs(e, a.actor); }
      if (!m.off) {
        if (a.offset) m.off = { x: g(a.offset.col), y: g(a.offset.row) };
        else if (a.ang !== undefined) {
          const rad = (a.ang * Math.PI) / 180;
          // Un anticuerpo se queda con el extremo que toca justo en la membrana.
          const r = a.dist ?? (T.d / 2 * 0.94 + (A.forma === 'anticuerpo' ? A.d * 0.5 : A.d / 2 * 0.85));
          m.off = { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
        } else {
          const r = (A.d + T.d) / 2 * 0.9;
          m.off = { izq: { x: -r, y: 0 }, der: { x: r, y: 0 }, arriba: { x: 0, y: -r }, abajo: { x: 0, y: r } }[a.lado ?? 'izq'];
        }
        // El anticuerpo se dibuja con el Fc hacia +y: girarlo para que el Fc
        // (o los Fab) miren al centro de la célula.
        const o = m.off as { x: number; y: number };
        const haciaCentro = (Math.atan2(-o.y, -o.x) * 180) / Math.PI;
        m.rot = A.forma === 'anticuerpo' ? haciaCentro - 90 + (a.apunta === 'fab' ? 180 : 0) : (m.rot0 as number);
      }
      const d = m.desde as { x: number; y: number }, off = m.off as { x: number; y: number };
      const h = posAbs(e, a.target);
      if (m.frente === undefined) { m.frente = true; alFrente(e, a.actor); }
      const rot = lerp(m.rot0 as number, m.rot as number, pio);
      if (p >= 1) A.anclado = { host: a.target, dx: off.x, dy: off.y, rot: m.rot as number };
      else { A.anclado = null; A.rot = rot; A.x = lerp(d.x, h.x + off.x, pio); A.y = lerp(d.y, h.y + off.y, pio); }
      const q = tramo(p, 0.75, 1);
      if (q > 0 && q < 1) e.efectos.push({ tipo: 'destello', p: q, x: h.x + off.x * 0.8, y: h.y + off.y * 0.8, r: 28, color: A.color });
      return;
    }
    case 'release': {
      const A = e.actores[a.actor];
      if (!A || !e.actores[a.from]) return;
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.fp = posAbs(e, a.from); m.rot = rotAbs(e, a.actor); }
      const d = m.desde as { x: number; y: number }, fp = m.fp as { x: number; y: number };
      A.anclado = null;
      A.rot = m.rot as number;
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
      ocultarHuespedes(e, a.actor, 1 - pe);
      if (p >= 1) { A.vis = false; A.op = 0; A.anclado = null; }
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
        if (a.img) A.forma = 'celula';
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
      ocultarHuespedes(e, a.actor, 1 - tramo(p, 0.6, 1));
      const f = tramo(p, 0.6, 1);
      if (f > 0 && f < 1) e.efectos.push({ tipo: 'fragmentos', p: f, x: c.x, y: c.y, r: A.d * 0.4 });
      if (p >= 1) { A.vis = false; A.op = 0; A.apoptosis = 0; A.gris = 0; A.anclado = null; }
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
    case 'degranular': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.g0 === undefined) m.g0 = A.granulos;
      A.granulos = lerp(m.g0 as number, 1, easeOut(tramo(p, 0, 0.7)));
      A.esc = (A.esc || 1) * (1 + 0.05 * Math.sin(Math.PI * Math.min(1, p * 2)));
      if (p >= 1) return;
      const c = posAbs(e, a.actor);
      const destinos = (a.hacia ?? []).map((h) => destinoDe(e, h)).filter((x): x is { x: number; y: number } => !!x);
      if (!destinos.length) e.efectos.push({ tipo: 'particulas', p, kind: a.kind ?? 'histamina', n: 26, x1: c.x, y1: c.y, r: A.d / 2, semilla: 1 });
      destinos.forEach((dst, i) => e.efectos.push({ tipo: 'particulas', p, kind: a.kind ?? 'histamina', n: 14, x1: c.x, y1: c.y, r: A.d / 2, x2: dst.x, y2: dst.y, semilla: 3 + i }));
      return;
    }
    case 'secretar': {
      const A = e.actores[a.actor];
      if (!A || p >= 1) return;
      const c = posAbs(e, a.actor);
      const dst = destinoDe(e, a.hacia);
      e.efectos.push({ tipo: 'particulas', p, kind: a.kind, n: a.n ?? 14, x1: c.x, y1: c.y, r: A.forma === 'ancla' ? 6 : A.d / 2, x2: dst?.x, y2: dst?.y, semilla: a.at + a.kind.length, label: a.label });
      return;
    }
    case 'fagocitar': {
      const F = e.actores[a.actor], T = e.actores[a.target];
      if (!F || !T) return;
      if (!m.desde) { m.desde = posAbs(e, a.target); m.d0 = T.d; }
      const d = m.desde as { x: number; y: number };
      const f = posAbs(e, a.actor);
      const ang = Math.atan2(d.y - f.y, d.x - f.x);
      // 0–0.35: se acerca hasta tocar · 0.35–0.75: los seudópodos lo rodean ·
      // 0.75–1: entra y queda en el fagosoma.
      const borde = { x: f.x + Math.cos(ang) * (F.d / 2 + T.d * 0.32), y: f.y + Math.sin(ang) * (F.d / 2 + T.d * 0.32) };
      const dentro = { x: f.x + Math.cos(ang) * F.d * 0.12, y: f.y + Math.sin(ang) * F.d * 0.12 };
      const q1 = easeInOut(tramo(p, 0, 0.35)), q3 = easeInOut(tramo(p, 0.75, 1));
      if (m.frente === undefined) { m.frente = true; alFrente(e, a.target); }
      T.anclado = null;
      T.x = lerp(lerp(d.x, borde.x, q1), dentro.x, q3);
      T.y = lerp(lerp(d.y, borde.y, q1), dentro.y, q3);
      T.esc = lerp(1, 0.55, q3);
      T.fago = q3;
      const s = tramo(p, 0.3, 0.85);
      if (s > 0 && s < 1) e.efectos.push({ tipo: 'seudopodos', p: s, x: lerp(borde.x, dentro.x, q3), y: lerp(borde.y, dentro.y, q3), r: (T.d / 2) * lerp(1, 0.6, q3), ang: (ang * 180) / Math.PI, color: F.color });
      if (p >= 1) { T.anclado = { host: a.actor, dx: dentro.x - f.x, dy: dentro.y - f.y }; T.fago = 1; }
      return;
    }
    case 'lisis': {
      const A = e.actores[a.actor];
      if (!A) return;
      const c = posAbs(e, a.actor);
      A.lisis = tramo(p, 0, 0.8);
      A.esc = lerp(1, 1.16, easeInOut(tramo(p, 0.2, 0.8)));
      A.op = 1 - tramo(p, 0.8, 1);
      ocultarHuespedes(e, a.actor, 1 - tramo(p, 0.75, 1));
      const f = tramo(p, 0.78, 1);
      if (f > 0 && f < 1) {
        e.efectos.push({ tipo: 'fragmentos', p: f, x: c.x, y: c.y, r: A.d * 0.45 });
        e.efectos.push({ tipo: 'particulas', p: f, kind: A.dibujo === 'eritrocito' ? 'hemoglobina' : 'plasma', n: 22, x1: c.x, y1: c.y, r: A.d * 0.4, semilla: 9 });
      }
      if (p >= 1) { A.vis = false; A.op = 0; A.lisis = 0; A.anclado = null; }
      return;
    }
    case 'tejido': {
      if (m.v0 === undefined) m.v0 = e.tejido[a.param] ?? 0;
      e.tejido[a.param] = lerp(m.v0 as number, a.a, a.ease === 'lineal' ? p : pio);
      return;
    }
    case 'fondo': {
      if (m.f0 === undefined) m.f0 = e.fondo;
      if (m.f0 === a.fondo) return;
      e.fondo = a.fondo;
      e.fondoPrev = p < 1 ? (m.f0 as Fondo) : null;
      e.fondoMezcla = p < 1 ? pio : 1;
      // Los parámetros del tejido viejo no pasan al nuevo.
      if (p >= 0.5) e.tejido = {};
      return;
    }
    case 'proceso': {
      if (!e.actores[a.cerca]) return;
      const i = e.procesos.findIndex((x) => x.id === a.id);
      // Una lupa que sigue abierta del paso anterior (`persist`) no se apaga y
      // vuelve a encender: continúa con la etapa siguiente en el mismo sitio.
      const sigue = i !== -1 && !e.procesos[i].saliendo;
      const st: ProcesoSt = { id: a.id, cerca: a.cerca, lado: a.lado ?? 'der', datos: a.datos, p, op: sigue ? 1 : easeOut(tramo(p, 0, 0.08)), persist: !!a.persist };
      if (i === -1) e.procesos.push(st); else e.procesos[i] = st;
      return;
    }
    case 'cerrar_proceso': {
      const pr = e.procesos.find((x) => x.id === a.id);
      if (pr) pr.op = 1 - pe;
      if (p >= 1) e.procesos = e.procesos.filter((x) => x.id !== a.id);
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

function cerrar(e: Escena, duracion: number): Escena {
  for (const k in e.actores) {
    const a = e.actores[k];
    a.ex = 0; a.ey = 0; a.prev = null; a.mezcla = 1; a.surco = 0; a.lisis = 0;
    if (a.vis) { a.esc = a.fago ? 0.55 : 1; a.op = 1; }
    a.marcadores = a.marcadores.filter((mk) => mk.op > 0.01).map((mk) => ({ ...mk, op: 1 }));
  }
  e.efectos = [];
  e.foco = null;
  e.fondoPrev = null;
  e.fondoMezcla = 1;
  e.reloj += duracion;
  e.notas = e.notas.filter((n) => !n.saliendo && n.op > 0.01).map((n) => ({ ...n, op: 1, saliendo: !n.persist }));
  e.conectores = e.conectores.filter((c) => c.op > 0.01 && e.actores[c.from]?.vis && e.actores[c.to]?.vis).map((c) => ({ ...c, prog: 1, op: 1 }));
  e.desenlaces = e.desenlaces.filter((d) => !d.saliendo && d.op > 0.01).map((d) => ({ ...d, op: 1, saliendo: true }));
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
      label: d.label, sub: d.sub, ab: d.ab, n: d.n, x: ANCHO / 2, y: ALTO / 2, esc: 1, rot: 0, op: 0, vis: false, halo: 0, gris: 0, surco: 0,
      apoptosis: 0, granulos: 0, lisis: 0, fago: 0, marcadores: [], anclado: null, ex: 0, ey: 0,
      ...(d.forma === 'caja' ? { w: d.w ?? 300, h: d.h ?? 90, ajusta: d.ajusta } : {}), icono: d.icono,
    };
  }
  const camara = modo.movil ? encuadre({ col: 0, row: 0, w: ANCHO / CELDA, h: ALTO / CELDA }, modo.asp) : { ...CAMARA_TODO };
  const lupaV = modo.movil && modo.asp < 1.1;
  return {
    actores, orden: [], conectores: [], notas: [], desenlaces: [], procesos: [], efectos: [], camara, foco: null,
    fondo: esc.fondo, fondoPrev: null, fondoMezcla: 1, tejido: {}, reloj: 0,
    lupaV, tx: modo.movil ? (lupaV ? 1.35 : 1.2) : 1,
  };
}

function correr(base: Escena, acciones: AccionCompilada[], t: number): Escena {
  const e = clonar(base);
  e.reloj = base.reloj + t;
  for (const c of acciones) {
    if (t < c.at) break;
    aplicar(e, c.a, c.dur > 0 ? clamp((t - c.at) / c.dur) : 1, c.m);
  }
  return e;
}

/** Duración de cada paso según la voz (ms), o `null` si el capítulo no la trae. */
export function duracionesVoz(esc: Escenario): number[] | null {
  const n = esc.narracion;
  if (!n) return null;
  return esc.pasos.map((_, i) => Math.round(((n.marcas[i + 1] ?? n.duracion) - n.marcas[i]) * 1000));
}

/** `voz`: lo que dura la frase del paso (ms); manda sobre lo que duran sus acciones. */
export function compilarPaso(base: Escena, paso: Paso, indice: number, auto = true, modo: Modo = MODO_ESCRITORIO, voz?: number): PasoCompilado {
  const propias = [...paso.acciones];
  if (!propias.some((a) => a.tipo === 'camera')) {
    if (paso.encuadre && !modo.movil) {
      propias.unshift({ at: 0, duration: 1000, tipo: 'camera', box: paso.encuadre });
    } else if (auto) {
      const prueba = propias.map((a) => ({ a, at: a.at, dur: duracionDe(a), m: {} as Memo })).sort((x, y) => x.at - y.at);
      const fin = prueba.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
      const medio = correr(base, prueba.map((c) => ({ ...c, m: {} })), fin * 0.6);
      const e = clonar(base);
      for (const c of prueba) aplicar(e, c.a, 1, c.m);
      const viaje = modo.movil ? prueba.filter((c) => c.a.tipo === 'move' || c.a.tipo === 'release' || c.a.tipo === 'bind').reduce((mx, c) => Math.max(mx, c.at + c.dur), 0) : 0;
      propias.unshift({ at: 0, duration: Math.min(2600, Math.max(1000, viaje)), tipo: 'camera', box: encuadreAuto(base, e, [medio], paso, modo) });
    } else {
      const zoom = base.camara.w !== CAMARA_TODO.w || base.camara.x !== 0 || base.camara.y !== 0;
      if (zoom) propias.unshift({ at: 0, tipo: 'camera', box: 'all' });
    }
  }
  if (base.notas.some((n) => n.saliendo) || base.procesos.some((p) => p.saliendo) || base.desenlaces.some((d) => d.saliendo)) {
    propias.unshift({ at: 0, duration: 700, tipo: 'despedir' });
  }
  const acciones = propias.map((a) => ({ a, at: a.at, dur: duracionDe(a), m: (a.tipo === 'camera' && modo.movil ? { asp: modo.asp } : {}) as Memo })).sort((x, y) => x.at - y.at);
  const duracion = voz ?? acciones.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
  const e = clonar(base);
  for (const c of acciones) aplicar(e, c.a, 1, c.m);
  return { paso, indice, acciones, duracion, base, final: cerrar(e, duracion) };
}

export function compilar(esc: Escenario, modo: Modo = MODO_ESCRITORIO): EscenarioCompilado {
  const pasos: PasoCompilado[] = [];
  let anterior = escenaVacia(esc, modo);
  const voz = duracionesVoz(esc);
  esc.pasos.forEach((paso, i) => { const pc = compilarPaso(anterior, paso, i, true, modo, voz?.[i]); pasos.push(pc); anterior = pc.final; });
  return { escenario: esc, pasos };
}

export function evaluar(pc: PasoCompilado, t: number): Escena {
  if (t >= pc.duracion) return pc.final;
  return correr(pc.base, pc.acciones, t);
}
