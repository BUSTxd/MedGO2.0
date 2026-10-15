// Motor de la escena del laboratorio «Vías NF-κB y JAK/STAT».
//
// Calcado del motor del ciclo celular (`src/lib/ciclo-celular/motor.ts`): la
// escena es una FUNCIÓN PURA del tiempo. `evaluar(paso, t)` parte del estado
// final del paso anterior (o de su `base`) y aplica cada acción con su
// progreso; retroceder, saltar o cambiar de velocidad es volver a evaluar.
// Compilar un paso lo recorre una vez al 100 % para llenar el `memo` de cada
// acción (de dónde sale un `move`, qué cadena tenía antes…).
//
// Diferencias con el del ciclo: los actores no son imágenes sino formas
// dibujadas (sus medidas salen de la declaración, no de un recorte), hay dos
// tipos de cadena de ubiquitina (K63 de señal, K48 de degradación) y tres
// acciones propias: `deubiquitinate` (A20, CYLD), `process` (p100 → p52) y
// `mutate` (alteraciones del linfoma de Hodgkin).

import type { Accion, ActorDecl, Cadena, ConnectorType, DesenlaceKind, Escenario, Forma, Lado, Paso } from '@/lib/data/vias-nfkb/tipos';
import { imagen } from '@/lib/data/ciclo-celular/familias';

export const ANCHO = 1600;
export const ALTO = 1000;
export const CELDA = 100;

// ─── Estado ───────────────────────────────────────────────────────────────────

export type Fosfato = { site: string; label?: string; op: number; dx: number; dy: number };
export type Mutacion = { gene: string; efecto: 'perdida' | 'ganancia'; pct?: string; op: number };

export type ActorSt = {
  key: string;
  forma: Forma;
  color: string;
  img?: string;
  /** Medidas en el escenario (sin animaciones de escala). */
  w: number;
  h: number;
  pSites: [number, number][];
  x: number;
  y: number;
  esc: number;
  rot: number;
  op: number;
  vis: boolean;
  estado: 'normal' | 'activo' | 'inhibido';
  halo: number;
  gris: number;
  fosfatos: Fosfato[];
  /** Eslabones de ubiquitina (fraccionario mientras se añaden o se quitan). */
  ubi: number;
  cadena: Cadena | null;
  mut: Mutacion | null;
  anclado: { host: string; dx: number; dy: number } | null;
  ex: number;
  ey: number;
  label: string;
  /** Color vigente si un `swap_label` lo cambió. */
  colorAlt?: string;
};

export type ConectorSt = { id: string; from: string; to: string; type: ConnectorType; label?: string; curve?: number; prog: number; op: number };
export type NotaSt = { id: string; text: string; near: string; side: 'top' | 'right' | 'bottom' | 'left'; op: number; persist: boolean };
export type DesenlaceSt = { id: string; kind: DesenlaceKind; x: number; y: number; op: number; texto?: string };

export type EfectoSt =
  | { tipo: 'destello'; p: number; x: number; y: number; r: number; color: string }
  | { tipo: 'fragmentos'; p: number; x: number; y: number }
  | { tipo: 'arnm'; p: number; x1: number; y1: number; x2: number; y2: number }
  | { tipo: 'linea'; p: number; x1: number; y1: number; x2: number; y2: number; clase: 'degrada' | 'transloca' }
  | { tipo: 'punto'; p: number; via: string | null; x1: number; y1: number; x2: number; y2: number; f: number; color: string };

export type Caja = { x: number; y: number; w: number; h: number };

export type Escena = {
  actores: Record<string, ActorSt>;
  orden: string[];
  conectores: ConectorSt[];
  notas: NotaSt[];
  desenlaces: DesenlaceSt[];
  efectos: EfectoSt[];
  camara: Caja;
  foco: { actors: string[]; k: number } | null;
};

export const CAMARA_TODO: Caja = { x: 0, y: 0, w: ANCHO, h: ALTO };

// ─── Utilidades ───────────────────────────────────────────────────────────────

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t: number) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const g = (v: number) => v * CELDA;

const COLOR_FOSFATO = '#FFD23F';

/** Ancho aproximado de un rótulo (Outfit semibold) para que la elipse lo abrace. */
export function anchoTexto(label: string, fs: number): number {
  const limpio = label.replace(/<\/?(sup|sub)>/g, '');
  return limpio.length * fs * 0.56;
}

/** Medidas por defecto de cada forma (`k` = escala de texto del escenario). */
export function medidasDecl(d: ActorDecl, k = 1): { w: number; h: number } {
  if (d.w && d.h) return { w: d.w, h: d.h };
  switch (d.forma) {
    case 'proteina': return { w: d.w ?? Math.max(112 * k, anchoTexto(d.label, 24 * k) + 40 * k), h: d.h ?? 62 * k };
    case 'receptor': return { w: d.w ?? 36 * k, h: d.h ?? 118 * k };
    case 'multipaso': return { w: d.w ?? 96 * k, h: d.h ?? 112 * k };
    case 'ligando': return { w: d.w ?? 66 * k, h: d.h ?? 58 * k };
    case 'citocina': return { w: d.w ?? 46 * k, h: d.h ?? 46 * k };
    case 'imagen': { const im = imagen(d.img ?? 'proteasoma'); const f = (d.w ?? im.w) / im.w; return { w: im.w * f, h: im.h * f }; }
    case 'adn': return { w: (d.tira ?? 6) * CELDA, h: d.h ?? 56 };
    case 'producto': return { w: d.w ?? anchoTexto(d.label, 19 * k) + 34 * k, h: d.h ?? 42 * k };
    case 'celula': return { w: d.w ?? 150 * k, h: d.h ?? 150 * k };
  }
}

function sitiosPorDefecto(f: Forma): [number, number][] {
  if (f === 'receptor') return [[0.5, 0.74], [0.5, 0.9], [0.5, 0.6]];
  return [[0.28, 0.06], [0.5, -0.02], [0.72, 0.06]];
}

/** Altura de la envoltura nuclear (arco) en x, para el destello del poro. */
export function nucleoY(top: number, x: number): number {
  const u = (x - ANCHO / 2) / (ANCHO / 2);
  return g(top) + 70 * u * u;
}

export const DURACION: Record<string, number> = {
  appear: 450, move: 700, bind: 700, release: 600, phosphorylate: 650, dephosphorylate: 600,
  activate: 450, deactivate: 450, inhibit: 600, release_inhibition: 450, translocate: 900, transcribe: 1400,
  ubiquitinate: 900, deubiquitinate: 900, degrade: 1100, process: 2000, mutate: 700, pulse_signal: 600,
  swap_label: 400, merge: 800, outcome: 900, camera: 700, highlight: 1200, note: 400, connect: 500,
  disconnect: 300, hide: 350,
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
    actores[k] = { ...a, fosfatos: a.fosfatos.map((f) => ({ ...f })), anclado: a.anclado ? { ...a.anclado } : null, mut: a.mut ? { ...a.mut } : null };
  }
  return {
    actores,
    orden: [...e.orden],
    conectores: e.conectores.map((c) => ({ ...c })),
    notas: e.notas.map((n) => ({ ...n })),
    desenlaces: e.desenlaces.map((d) => ({ ...d })),
    efectos: [],
    camara: { ...e.camara },
    foco: null,
  };
}

/** Posición absoluta, resolviendo acoplamientos (con tope contra ciclos). */
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
  const w = a?.w ?? 100, h = a?.h ?? 100;
  const s = a?.esc ?? 1;
  return { x: p.x - (w * s) / 2, y: p.y - (h * s) / 2, w: w * s, h: h * s };
}

function alFrente(e: Escena, key: string) {
  const i = e.orden.indexOf(key);
  if (i !== -1) e.orden.splice(i, 1);
  e.orden.push(key);
}

function soltarHuespedes(e: Escena, key: string) {
  for (const k in e.actores) {
    const a = e.actores[k];
    if (a.anclado?.host === key) {
      const p = posAbs(e, k);
      a.x = p.x; a.y = p.y; a.anclado = null;
    }
  }
}

function ponerConector(e: Escena, c: Omit<ConectorSt, 'op'> & { op?: number }) {
  const i = e.conectores.findIndex((x) => x.id === c.id);
  const nuevo: ConectorSt = { op: 1, ...c };
  if (i === -1) e.conectores.push(nuevo);
  else e.conectores[i] = { ...e.conectores[i], ...nuevo };
}

function offsetBind(e: Escena, actor: string, target: string, lado: Lado = 'izq', offset?: { col: number; row: number }) {
  if (offset) return { x: g(offset.col), y: g(offset.row) };
  const A = e.actores[actor], T = e.actores[target];
  // Las elipses de la figura se tocan casi de canto: se solapan poco.
  const k = 0.94;
  switch (lado) {
    case 'der': return { x: ((T.w + A.w) / 2) * k, y: 0 };
    // Un ligando sobre su receptor deja hueco para el nombre del receptor.
    case 'arriba': return { x: 0, y: -((T.h + A.h) / 2) * k - (T.forma === 'receptor' ? 24 : 0) };
    case 'abajo': return { x: 0, y: ((T.h + A.h) / 2) * k };
    case 'encima': return { x: 0, y: -T.h * 0.15 };
    default: return { x: -((T.w + A.w) / 2) * k, y: 0 };
  }
}

function inclinar(e: Escena, de: string, hacia: string, fuerza: number) {
  if (de === hacia) return;
  const a = e.actores[de];
  const p = posAbs(e, de), q = posAbs(e, hacia);
  const dx = q.x - p.x, dy = q.y - p.y;
  const d = Math.hypot(dx, dy) || 1;
  a.ex += (dx / d) * 12 * fuerza;
  a.ey += (dy / d) * 12 * fuerza;
  a.rot += 6 * fuerza * Math.sign(dx || 1);
}

function encuadre(b: { col: number; row: number; w: number; h: number }): Caja {
  let w = g(b.w), h = g(b.h);
  const asp = ANCHO / ALTO;
  if (w / h > asp) h = w / asp; else w = h * asp;
  const cx = g(b.col) + g(b.w) / 2, cy = g(b.row) + g(b.h) / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

function buscarConector(e: Escena, from: string, to: string): ConectorSt | null {
  return e.conectores.find((c) => c.from === from && c.to === to)
    ?? e.conectores.find((c) => c.from === to && c.to === from)
    ?? null;
}

function proteasoma(e: Escena): string | null {
  return e.orden.find((k) => e.actores[k].vis && e.actores[k].img === 'proteasoma') ?? null;
}

function reiniciarEstado(A: ActorSt) {
  Object.assign(A, { estado: 'normal', halo: 0, gris: 0, fosfatos: [], ubi: 0, cadena: null });
}

// ─── Acciones ─────────────────────────────────────────────────────────────────

type Memo = Record<string, unknown>;

function aplicar(e: Escena, a: Accion, p: number, m: Memo, topNucleo: number) {
  const pe = easeOut(p);
  const pio = easeInOut(p);

  switch (a.tipo) {
    case 'appear': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.nuevo === undefined) m.nuevo = !A.vis;
      if (m.nuevo) { reiniciarEstado(A); A.mut = null; alFrente(e, a.actor); }
      const d = 80;
      const off = { top: [0, -d], bottom: [0, d], left: [-d, 0], right: [d, 0] }[a.from as string] ?? [0, 0];
      A.vis = true;
      A.anclado = null;
      A.x = g(a.pos.col) + off[0] * (1 - pe);
      A.y = g(a.pos.row) + off[1] * (1 - pe);
      A.op = pe;
      A.esc = a.from === 'grow' ? lerp(0.4, 1, easeBack(p)) : lerp(0.75, 1, pe);
      return;
    }
    case 'move':
    case 'translocate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      const d = m.desde as { x: number; y: number };
      const tx = g(a.to.col), ty = g(a.to.row);
      // Los huéspedes viajan con su anfitrión: solo se mueve el anfitrión.
      A.anclado = null;
      A.x = lerp(d.x, tx, pio);
      A.y = lerp(d.y, ty, pio);
      if (a.tipo === 'translocate') {
        if (p < 1) e.efectos.push({ tipo: 'linea', clase: 'transloca', p, x1: d.x, y1: d.y, x2: tx, y2: ty });
        // Destello en el poro: donde la trayectoria cruza la envoltura.
        const xm = lerp(d.x, tx, 0.5);
        const q = tramo(p, 0.35, 0.75);
        if (q > 0 && q < 1) e.efectos.push({ tipo: 'destello', p: q, x: xm, y: nucleoY(topNucleo, xm), r: 46, color: '#5B8CFF' });
      }
      return;
    }
    case 'bind': {
      const A = e.actores[a.actor];
      if (!A || !e.actores[a.target]) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      if (!m.off) m.off = offsetBind(e, a.actor, a.target, a.lado, a.offset);
      const d = m.desde as { x: number; y: number };
      const off = m.off as { x: number; y: number };
      const h = posAbs(e, a.target);
      if (m.frente === undefined) { m.frente = true; alFrente(e, a.actor); }
      if (p >= 1) A.anclado = { host: a.target, dx: off.x, dy: off.y };
      else {
        A.anclado = null;
        A.x = lerp(d.x, h.x + off.x, pio);
        A.y = lerp(d.y, h.y + off.y, pio);
      }
      const q = tramo(p, 0.72, 1);
      if (q > 0 && q < 1) {
        A.esc = 1 + 0.05 * Math.sin(Math.PI * q);
        e.efectos.push({ tipo: 'destello', p: q, x: h.x + off.x / 2, y: h.y + off.y / 2, r: 44, color: A.color });
      }
      return;
    }
    case 'release': {
      const A = e.actores[a.actor];
      const F = e.actores[a.from];
      if (!A || !F) return;
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.fromPos = posAbs(e, a.from); }
      const d = m.desde as { x: number; y: number };
      const fp = m.fromPos as { x: number; y: number };
      if (F.anclado?.host === a.actor) { F.anclado = null; F.x = fp.x; F.y = fp.y; }
      A.anclado = null;
      let tx: number, ty: number;
      if (a.to) { tx = g(a.to.col); ty = g(a.to.row); } else {
        const dx = d.x - fp.x, dy = d.y - fp.y, n = Math.hypot(dx, dy) || 1;
        tx = d.x + (dx / n) * 90; ty = d.y + (dy / n) * 90;
      }
      const k = easeBack(p);
      A.x = lerp(d.x, tx, k);
      A.y = lerp(d.y, ty, k);
      return;
    }
    case 'phosphorylate': {
      const K = e.actores[a.kinase], T = e.actores[a.target];
      if (!K || !T) return;
      inclinar(e, a.kinase, a.target, Math.sin(Math.PI * tramo(p, 0, 0.7)));
      let f = T.fosfatos.find((x) => x.site === a.site);
      if (!f) { f = { site: a.site, label: a.label, op: 0, dx: 0, dy: 0 }; T.fosfatos.push(f); }
      f.label = a.label ?? f.label;
      f.op = easeOut(tramo(p, 0.35, 0.65));
      if (a.kinase !== a.target) {
        ponerConector(e, { id: `fos:${a.kinase}>${a.target}`, from: a.kinase, to: a.target, type: 'fosforila', prog: easeOut(tramo(p, 0, 0.5)) });
      }
      const q = tramo(p, 0.35, 0.9);
      if (q > 0 && q < 1) {
        const c = cajaActor(e, a.target);
        const s = T.pSites[(Number(a.site.replace(/\D/g, '')) || 1) - 1] ?? [0.9, 0.35];
        e.efectos.push({ tipo: 'destello', p: q, x: c.x + s[0] * c.w, y: c.y + s[1] * c.h, r: 30, color: COLOR_FOSFATO });
      }
      return;
    }
    case 'dephosphorylate': {
      const T = e.actores[a.target];
      if (!T) return;
      const yo = posAbs(e, a.target);
      if (a.phosphatase && e.actores[a.phosphatase]) inclinar(e, a.phosphatase, a.target, Math.sin(Math.PI * tramo(p, 0, 0.6)));
      const q = easeOut(tramo(p, 0.2, 0.9));
      for (const f of T.fosfatos) { f.op = 1 - q; f.dy = -30 * q; }
      if (p >= 1) T.fosfatos = [];
      const r = tramo(p, 0.2, 0.8);
      if (r > 0 && r < 1) e.efectos.push({ tipo: 'destello', p: r, x: yo.x, y: yo.y - 30, r: 40, color: '#22C3C9' });
      return;
    }
    case 'activate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.h0 === undefined) { m.h0 = A.halo; m.g0 = A.gris; }
      A.estado = 'activo';
      A.halo = lerp(m.h0 as number, 0.9, pe);
      A.gris = lerp(m.g0 as number, 0, pe);
      A.esc = (A.esc || 1) * (1 + 0.06 * Math.sin(Math.PI * p));
      return;
    }
    case 'deactivate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.h0 === undefined) m.h0 = A.halo;
      A.halo = lerp(m.h0 as number, 0, pe);
      if (p >= 1) A.estado = 'normal';
      return;
    }
    case 'inhibit': {
      const T = e.actores[a.target];
      if (!T || !e.actores[a.inhibitor]) return;
      if (m.h0 === undefined) { m.h0 = T.halo; m.g0 = T.gris; }
      if (a.conector !== false) {
        ponerConector(e, { id: `inh:${a.inhibitor}>${a.target}`, from: a.inhibitor, to: a.target, type: 'inhibe', prog: easeOut(tramo(p, 0, 0.6)) });
      }
      const q = easeOut(tramo(p, 0.4, 1));
      T.estado = 'inhibido';
      T.gris = lerp(m.g0 as number, 0.75, q);
      T.halo = lerp(m.h0 as number, 0, q);
      return;
    }
    case 'release_inhibition': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.g0 === undefined) m.g0 = A.gris;
      A.gris = lerp(m.g0 as number, 0, pe);
      if (p >= 1 && A.estado === 'inhibido') A.estado = 'normal';
      for (const c of e.conectores) if (c.type === 'inhibe' && c.to === a.actor) c.op = 1 - pe;
      if (p >= 1) e.conectores = e.conectores.filter((c) => !(c.type === 'inhibe' && c.to === a.actor));
      return;
    }
    case 'transcribe': {
      const G = e.actores[a.gene], P = e.actores[a.product];
      if (!G || !P || !e.actores[a.tf]) return;
      if (m.nuevo === undefined) m.nuevo = !P.vis;
      const tfp = posAbs(e, a.tf);
      const tx = g(a.productPos.col), ty = g(a.productPos.row);
      const r = tramo(p, 0.05, 0.7);
      if (r > 0 && p < 1) e.efectos.push({ tipo: 'arnm', p: r, x1: tfp.x + 60, y1: tfp.y + 20, x2: tx, y2: ty });
      const s = tramo(p, 0.6, 1);
      if (s > 0) {
        if (m.nuevo) { alFrente(e, a.product); reiniciarEstado(P); P.mut = null; }
        Object.assign(P, { vis: true, anclado: null, x: tx, y: ty, op: easeOut(s), esc: lerp(0.4, 1, easeBack(s)) });
      }
      const tf = e.actores[a.tf];
      tf.esc = (tf.esc || 1) * (1 + 0.05 * Math.sin(Math.PI * tramo(p, 0, 0.3)));
      const q = tramo(p, 0, 0.3);
      if (q > 0 && q < 1) e.efectos.push({ tipo: 'destello', p: q, x: tfp.x, y: tfp.y + 30, r: 60, color: '#B48CE0' });
      return;
    }
    case 'ubiquitinate': {
      const L = e.actores[a.ligase], T = e.actores[a.target];
      if (!L || !T) return;
      if (m.u0 === undefined) m.u0 = T.cadena === a.chain ? T.ubi : 0;
      inclinar(e, a.ligase, a.target, Math.sin(Math.PI * tramo(p, 0, 0.8)));
      T.cadena = a.chain;
      T.ubi = lerp(m.u0 as number, 4, tramo(p, 0.2, 1));
      if (a.ligase !== a.target) {
        ponerConector(e, { id: `ub:${a.ligase}>${a.target}`, from: a.ligase, to: a.target, type: a.chain === 'K48' ? 'degrada' : 'activa', prog: easeOut(tramo(p, 0, 0.5)) });
      }
      return;
    }
    case 'deubiquitinate': {
      const D = e.actores[a.enzyme], T = e.actores[a.target];
      if (!D || !T) return;
      if (m.u0 === undefined) m.u0 = T.ubi;
      inclinar(e, a.enzyme, a.target, Math.sin(Math.PI * tramo(p, 0, 0.8)));
      // Una enzima rota (mutación con pérdida) se inclina pero no quita nada.
      if (D.mut?.efecto === 'perdida') return;
      T.ubi = lerp(m.u0 as number, 0, tramo(p, 0.25, 1));
      if (p >= 1) T.cadena = null;
      const q = tramo(p, 0.25, 0.9);
      if (q > 0 && q < 1) {
        const c = cajaActor(e, a.target);
        e.efectos.push({ tipo: 'destello', p: q, x: c.x + c.w * 0.82, y: c.y - 10, r: 34, color: '#9D7BEA' });
      }
      return;
    }
    case 'degrade': {
      const T = e.actores[a.target];
      if (!T) return;
      if (!m.desde) { m.desde = posAbs(e, a.target); m.prot = proteasoma(e); }
      const d = m.desde as { x: number; y: number };
      const pk = m.prot as string | null;
      const pp = pk ? posAbs(e, pk) : { x: g(14), y: g(6) };
      const q = easeInOut(tramo(p, 0, 0.75));
      soltarHuespedes(e, a.target);
      T.anclado = null;
      T.x = lerp(d.x, pp.x, q);
      T.y = lerp(d.y, pp.y, q);
      T.esc = lerp(1, 0.25, q);
      T.op = 1 - tramo(p, 0.55, 0.8);
      if (p < 1) e.efectos.push({ tipo: 'linea', clase: 'degrada', p: tramo(p, 0, 0.3), x1: d.x, y1: d.y, x2: pp.x, y2: pp.y });
      const f = tramo(p, 0.75, 1);
      if (f > 0 && f < 1) {
        e.efectos.push({ tipo: 'fragmentos', p: f, x: pp.x, y: pp.y });
        if (pk) e.actores[pk].esc = 1 + 0.06 * Math.sin(Math.PI * f);
      }
      if (p >= 1) Object.assign(T, { vis: false, op: 0, esc: 1, ubi: 0, cadena: null, fosfatos: [], estado: 'normal', gris: 0, halo: 0 });
      return;
    }
    case 'process': {
      // p100 viaja al proteasoma, se corta su cola (fragmentos) y vuelve como p52.
      const T = e.actores[a.target], I = e.actores[a.into];
      if (!T || !I) return;
      if (!m.desde) { m.desde = posAbs(e, a.target); m.prot = proteasoma(e); }
      const d = m.desde as { x: number; y: number };
      const pk = m.prot as string | null;
      const pp = pk ? posAbs(e, pk) : { x: g(14), y: g(6) };
      const bx = g(a.back.col), by = g(a.back.row);
      const ida = easeInOut(tramo(p, 0, 0.4));
      if (p < 0.5) {
        soltarHuespedes(e, a.target);
        T.anclado = null;
        T.x = lerp(d.x, pp.x - 40, ida);
        T.y = lerp(d.y, pp.y, ida);
        T.esc = lerp(1, 0.7, ida);
        T.op = 1 - tramo(p, 0.4, 0.5);
        if (p < 0.4) e.efectos.push({ tipo: 'linea', clase: 'degrada', p: tramo(p, 0, 0.15), x1: d.x, y1: d.y, x2: pp.x, y2: pp.y });
      } else if (T.vis) {
        Object.assign(T, { vis: false, op: 0, esc: 1, ubi: 0, cadena: null, fosfatos: [], estado: 'normal', halo: 0 });
      }
      const f = tramo(p, 0.42, 0.62);
      if (f > 0 && f < 1) {
        e.efectos.push({ tipo: 'fragmentos', p: f, x: pp.x, y: pp.y });
        if (pk) e.actores[pk].esc = 1 + 0.06 * Math.sin(Math.PI * f);
      }
      const v = tramo(p, 0.5, 1);
      if (v > 0) {
        if (m.nuevo === undefined) { m.nuevo = !I.vis; alFrente(e, a.into); }
        if (m.nuevo) { reiniciarEstado(I); I.mut = null; }
        const q = easeInOut(v);
        Object.assign(I, { vis: true, anclado: null, op: easeOut(tramo(v, 0, 0.3)), esc: lerp(0.7, 1, q), x: lerp(pp.x - 40, bx, q), y: lerp(pp.y, by, q) });
      }
      return;
    }
    case 'hide': {
      const A = e.actores[a.actor];
      if (!A) return;
      A.op = 1 - pe;
      if (p >= 1) { soltarHuespedes(e, a.actor); A.vis = false; A.op = 0; }
      return;
    }
    case 'mutate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.g0 === undefined) { m.g0 = A.gris; m.h0 = A.halo; }
      A.mut = { gene: a.gene, efecto: a.efecto, pct: a.pct, op: pe };
      if (a.efecto === 'perdida') {
        A.gris = lerp(m.g0 as number, 0.85, pe);
        A.halo = lerp(m.h0 as number, 0, pe);
        A.ex += 5 * Math.sin(tramo(p, 0.4, 1) * Math.PI * 6) * (1 - tramo(p, 0.4, 1));
      } else {
        A.esc = (A.esc || 1) * (1 + 0.08 * Math.sin(Math.PI * tramo(p, 0.3, 1)));
      }
      const q = tramo(p, 0.2, 0.8);
      if (q > 0 && q < 1) { const c = posAbs(e, a.actor); e.efectos.push({ tipo: 'destello', p: q, x: c.x, y: c.y, r: 70, color: '#E5484D' }); }
      return;
    }
    case 'pulse_signal': {
      if (!e.actores[a.from] || !e.actores[a.to] || p >= 1) return;
      const c = buscarConector(e, a.from, a.to);
      const inv = c && c.from !== a.from;
      const x1 = posAbs(e, a.from), x2 = posAbs(e, a.to);
      e.efectos.push({ tipo: 'punto', p, via: c?.id ?? null, x1: x1.x, y1: x1.y, x2: x2.x, y2: x2.y, f: inv ? 1 - p : p, color: '#3DDC97' });
      return;
    }
    case 'swap_label': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (p >= 0.5) { A.label = a.label; if (a.color) A.colorAlt = a.color; }
      A.esc = (A.esc || 1) * (1 + 0.08 * Math.sin(Math.PI * p));
      return;
    }
    case 'merge': {
      const I = e.actores[a.into];
      if (!I) return;
      const tx = g(a.pos.col), ty = g(a.pos.row);
      const q = easeInOut(tramo(p, 0, 0.6));
      for (const k of a.actors) {
        const A = e.actores[k];
        if (!A) continue;
        const clave = `d:${k}`;
        if (!m[clave]) m[clave] = posAbs(e, k);
        const d = m[clave] as { x: number; y: number };
        A.anclado = null;
        A.x = lerp(d.x, tx, q);
        A.y = lerp(d.y, ty, q);
        if (k !== a.into) {
          A.op = 1 - tramo(p, 0.5, 0.8);
          if (p >= 1) { soltarHuespedes(e, k); A.vis = false; A.op = 0; }
        }
      }
      if (!a.actors.includes(a.into)) {
        if (m.nuevo === undefined) m.nuevo = !I.vis;
        if (m.nuevo) { alFrente(e, a.into); reiniciarEstado(I); }
        const s = tramo(p, 0.5, 1);
        Object.assign(I, { vis: s > 0 || I.vis, anclado: null, x: tx, y: ty, op: s > 0 ? easeOut(s) : I.op, esc: lerp(0.4, 1, easeBack(s)) });
      }
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
      const b = a.box === 'all' ? CAMARA_TODO : encuadre(a.box);
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
    case 'wait':
      return;
  }
}

/** Limpia lo efímero al cerrar un paso: el estado final es la base del siguiente. */
function cerrar(e: Escena): Escena {
  for (const k in e.actores) {
    const a = e.actores[k];
    a.ex = 0; a.ey = 0; a.rot = 0;
    if (a.vis) { a.esc = 1; a.op = 1; }
    a.fosfatos = a.fosfatos.filter((f) => f.op > 0.01).map((f) => ({ ...f, op: 1, dx: 0, dy: 0 }));
    a.ubi = Math.round(a.ubi);
    if (a.ubi === 0) a.cadena = null;
    if (a.mut) a.mut = { ...a.mut, op: 1 };
  }
  e.efectos = [];
  e.foco = null;
  e.notas = e.notas.filter((n) => n.persist).map((n) => ({ ...n, op: 1 }));
  // Un conector cuyo extremo ya no se ve desaparece con él.
  e.conectores = e.conectores
    .filter((c) => c.op > 0.01 && e.actores[c.from]?.vis && e.actores[c.to]?.vis)
    .map((c) => ({ ...c, prog: 1, op: 1 }));
  e.desenlaces = e.desenlaces.map((d) => ({ ...d, op: 1 }));
  return e;
}

// ─── Compilación ──────────────────────────────────────────────────────────────

export type AccionCompilada = { a: Accion; at: number; dur: number; m: Memo };

export type PasoCompilado = {
  paso: Paso;
  indice: number;
  acciones: AccionCompilada[];
  duracion: number;
  base: Escena;
  final: Escena;
  topNucleo: number;
};

export type EscenarioCompilado = {
  escenario: Escenario;
  pasos: PasoCompilado[];
};

export function escenaVacia(esc: Escenario): Escena {
  const actores: Record<string, ActorSt> = {};
  const k = esc.texto ?? 1;
  for (const [key, d] of Object.entries(esc.actores)) {
    const { w, h } = medidasDecl(d, k);
    actores[key] = {
      key, forma: d.forma, color: d.color ?? '#B9C3D3', img: d.img, w, h,
      pSites: d.pSites ?? sitiosPorDefecto(d.forma),
      x: ANCHO / 2, y: ALTO / 2, esc: 1, rot: 0, op: 0, vis: false,
      estado: 'normal', halo: 0, gris: 0, fosfatos: [], ubi: 0, cadena: null, mut: null,
      anclado: null, ex: 0, ey: 0, label: d.label,
    };
  }
  return { actores, orden: [], conectores: [], notas: [], desenlaces: [], efectos: [], camara: { ...CAMARA_TODO }, foco: null };
}

function correr(base: Escena, acciones: AccionCompilada[], t: number, top: number): Escena {
  const e = clonar(base);
  for (const c of acciones) {
    if (t < c.at) break;
    const p = c.dur > 0 ? clamp((t - c.at) / c.dur) : 1;
    aplicar(e, c.a, p, c.m, top);
  }
  return e;
}

/** Compila un paso suelto sobre una escena base (también lo usa el modo estudio,
 *  donde el orden de los pasos lo decide el estudiante). */
export function compilarPaso(base: Escena, paso: Paso, indice: number, topNucleo: number, conCamara = true): PasoCompilado {
  const propias = conCamara ? [...paso.acciones] : paso.acciones.filter((a) => a.tipo !== 'camera');
  const zoomHeredado = base.camara.w !== CAMARA_TODO.w || base.camara.x !== 0 || base.camara.y !== 0;
  if (zoomHeredado && !propias.some((a) => a.tipo === 'camera')) propias.unshift({ at: 0, tipo: 'camera', box: 'all' });
  const acciones = propias
    .map((a) => ({ a, at: a.at, dur: duracionDe(a), m: {} as Memo }))
    .sort((x, y) => x.at - y.at);
  const duracion = acciones.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
  const e = clonar(base);
  for (const c of acciones) aplicar(e, c.a, 1, c.m, topNucleo);
  return { paso, indice, acciones, duracion, base, final: cerrar(e), topNucleo };
}

export function compilar(esc: Escenario): EscenarioCompilado {
  const pasos: PasoCompilado[] = [];
  const porId = new Map<string, PasoCompilado>();
  let anterior = escenaVacia(esc);
  esc.pasos.forEach((paso, indice) => {
    const base = paso.base && porId.has(paso.base) ? porId.get(paso.base)!.final : anterior;
    const pc = compilarPaso(base, paso, indice, esc.compartimentos.nucleo);
    pasos.push(pc);
    porId.set(paso.id, pc);
    anterior = pc.final;
  });
  return { escenario: esc, pasos };
}

export function evaluar(pc: PasoCompilado, t: number): Escena {
  if (t >= pc.duracion) return pc.final;
  return correr(pc.base, pc.acciones, t, pc.topNucleo);
}
