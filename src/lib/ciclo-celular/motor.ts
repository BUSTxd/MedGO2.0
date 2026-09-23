// Motor de la escena del laboratorio del ciclo celular.
//
// La escena es una FUNCIÓN PURA del tiempo: `evaluar(paso, t)` parte del estado
// final del paso anterior (o de su `base`) y aplica cada acción con su progreso
// en `t`. De ahí salen gratis todas las exigencias del prompt original:
//   · «Anterior» y saltar en la línea de tiempo: se evalúa otro paso, no se
//     deshace nada;
//   · cancelar a mitad: basta con dejar de pedir fotogramas;
//   · velocidad 0,5×–2×: se escala el reloj, no las acciones;
//   · movimiento reducido: se evalúa directamente en t = fin.
//
// Compilar un paso lo recorre una vez con progreso 1: así cada acción guarda
// en su `memo` el estado de partida (de dónde sale un `move`, qué imagen tenía
// el ADN antes de transcribir…) y la evaluación por fotograma es solo
// interpolar.

import type { Accion, Compartimento, ConnectorType, Escenario, Lado, Paso } from '@/lib/data/ciclo-celular/tipos';
import { imagen } from '@/lib/data/ciclo-celular/familias';

export const ANCHO = 1600;
export const ALTO = 1000;
export const CELDA = 100;

// ─── Estado ───────────────────────────────────────────────────────────────────

export type Fosfato = { site: string; label?: string; op: number; dx: number; dy: number };

export type ActorSt = {
  key: string;
  img: string;
  /** Imagen de la que se sale en un fundido (`swap_image`, daño, transcripción). */
  imgPrev: string | null;
  mezcla: number;
  x: number;
  y: number;
  esc: number;
  rot: number;
  op: number;
  vis: boolean;
  estado: 'normal' | 'activo' | 'inhibido';
  halo: number;
  gris: number;
  candado: number;
  fosfatos: Fosfato[];
  /** Eslabones de ubiquitina (fraccionario mientras se añaden). */
  ubi: number;
  /** Acoplado: su posición es la del anfitrión + (dx, dy). */
  anclado: { host: string; dx: number; dy: number } | null;
  /** 0,85 cuando está secuestrado dentro de otro. */
  envuelto: number;
  /** Empujón efímero (inclinarse hacia el objetivo, sacudidas). */
  ex: number;
  ey: number;
  compartimento?: Compartimento;
  escalaDecl: number;
  /** Tira: ancho en celdas (0 = actor normal) e imagen que se repite. */
  tira: number;
  imgBase: string;
  /** Rótulo vigente si un `swap_image` lo cambió (si no, el declarado). */
  label?: string;
};

export type ConectorSt = {
  id: string;
  from: string;
  to: string;
  type: ConnectorType;
  label?: string;
  curve?: number;
  sign?: '+' | '−';
  prog: number;
  op: number;
};

export type NotaSt = { id: string; text: string; near: string; side: 'top' | 'right' | 'bottom' | 'left'; op: number; persist: boolean };

export type DesenlaceKind = 'fase_s' | 'mitosis' | 'detencion' | 'reparacion' | 'apoptosis' | 'senescencia' | 'reanuda';
export type DesenlaceSt = { id: string; kind: DesenlaceKind; x: number; y: number; op: number; texto?: string };

export type EfectoSt =
  | { tipo: 'destello'; p: number; x: number; y: number; r: number; color: string }
  | { tipo: 'chispas'; p: number; x: number; y: number }
  | { tipo: 'fragmentos'; p: number; x: number; y: number }
  | { tipo: 'onda'; p: number; x1: number; y1: number; x2: number; y2: number }
  | { tipo: 'arnm'; p: number; x1: number; y1: number; x2: number; y2: number }
  | { tipo: 'linea'; p: number; x1: number; y1: number; x2: number; y2: number; clase: 'degrada' | 'transloca' }
  /** Punto luminoso que recorre un conector (`f` = fracción del trazo). */
  | { tipo: 'punto'; p: number; via: string | null; x1: number; y1: number; x2: number; y2: number; f: number; color: string };

export type Caja = { x: number; y: number; w: number; h: number };

export type Escena = {
  actores: Record<string, ActorSt>;
  /** Orden de pintado (el último, delante). */
  orden: string[];
  conectores: ConectorSt[];
  notas: NotaSt[];
  desenlaces: DesenlaceSt[];
  efectos: EfectoSt[];
  camara: Caja;
  foco: { actors: string[]; k: number } | null;
  /** `sceneScale` del paso: escala TODOS los actores (y con ellos cajas,
   *  flechas y rótulos), nunca uno aislado. */
  escala: number;
};

export const CAMARA_TODO: Caja = { x: 0, y: 0, w: ANCHO, h: ALTO };

// ─── Utilidades ───────────────────────────────────────────────────────────────

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Tramo [a, b] del progreso, reescalado a 0–1. */
const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t: number) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const g = (v: number) => v * CELDA;

const COLOR_FOSFATO = '#FFD23F';
const COLOR_CIAN = '#22C3C9';

const IMG_DANO: Record<string, string> = { doble: 'adn_rotura_doble', simple: 'adn_cadena_simple', dimero: 'dimero_timina' };
const ADN_LISO = new Set(['adn_helice', 'gen_activo']);
const LIGASAS = new Set(['mdm2', 'e3_ligasa_scf', 'apc_c']);

export const DURACION: Record<string, number> = {
  appear: 450, enter: 800, move: 700, bind: 700, release: 600, phosphorylate: 650, dephosphorylate: 600,
  activate: 450, inhibit: 600, release_inhibition: 450, sequester: 900, translocate: 800, transcribe: 1400,
  ubiquitinate: 700, degrade: 1100, damage: 1000, pulse_signal: 500, swap_image: 400, split: 700, merge: 800,
  outcome: 900, camera: 700, highlight: 1200, note: 400, connect: 500, disconnect: 300, hide: 300,
};

export function duracionDe(a: Accion): number {
  if (a.tipo === 'wait') return a.ms;
  if (a.duration != null) return a.duration;
  if (a.tipo === 'feedback_loop') return 600 * Math.max(1, a.cycles);
  return DURACION[a.tipo] ?? 500;
}

function clonar(e: Escena): Escena {
  const actores: Record<string, ActorSt> = {};
  for (const k in e.actores) {
    const a = e.actores[k];
    actores[k] = { ...a, fosfatos: a.fosfatos.map((f) => ({ ...f })), anclado: a.anclado ? { ...a.anclado } : null };
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
    escala: e.escala,
  };
}

/** Medidas en el escenario del actor (sin animaciones de escala). */
export function medidas(a: ActorSt): { w: number; h: number } {
  if (a.tira) {
    const base = imagen(a.imgBase);
    return { w: a.tira * CELDA, h: Math.max(base.h, imagen(a.img).h * 0.8) * a.escalaDecl };
  }
  const img = imagen(a.img);
  return { w: img.w * a.escalaDecl, h: img.h * a.escalaDecl };
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

/** Caja del contenido visible del actor en el escenario. */
export function cajaActor(e: Escena, key: string): Caja {
  const a = e.actores[key];
  const p = posAbs(e, key);
  const { w, h } = a ? medidas(a) : { w: 100, h: 100 };
  const s = (a?.esc ?? 1) * (a?.envuelto ?? 1) * (e.escala ?? 1);
  return { x: p.x - (w * s) / 2, y: p.y - (h * s) / 2, w: w * s, h: h * s };
}

function alFrente(e: Escena, key: string) {
  const i = e.orden.indexOf(key);
  if (i !== -1) e.orden.splice(i, 1);
  e.orden.push(key);
}

/** Suelta a quienes estaban acoplados a `key` dejándolos donde están. */
function soltarHuespedes(e: Escena, key: string) {
  for (const k in e.actores) {
    const a = e.actores[k];
    if (a.anclado?.host === key) {
      const p = posAbs(e, k);
      a.x = p.x; a.y = p.y; a.anclado = null; a.envuelto = 1;
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
  const A = medidas(e.actores[actor]);
  const T = medidas(e.actores[target]);
  const k = 0.72;
  switch (lado) {
    case 'der': return { x: ((T.w + A.w) / 2) * k, y: 0 };
    case 'arriba': return { x: 0, y: -((T.h + A.h) / 2) * k };
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
  a.rot += 8 * fuerza * Math.sign(dx || 1);
}

/** Encuadre de cámara con el aspecto del escenario (16:10), centrado en la caja. */
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

// ─── Acciones ─────────────────────────────────────────────────────────────────

type Memo = Record<string, unknown>;

function aplicar(e: Escena, a: Accion, p: number, m: Memo) {
  const pe = easeOut(p);
  const pio = easeInOut(p);

  switch (a.tipo) {
    case 'appear': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.nuevo === undefined) m.nuevo = !A.vis;
      if (m.nuevo) {
        Object.assign(A, { estado: 'normal', halo: 0, gris: 0, candado: 0, fosfatos: [], ubi: 0, envuelto: 1, imgPrev: null, mezcla: 1 });
        alFrente(e, a.actor);
      }
      const d = 70;
      const off = { top: [0, -d], bottom: [0, d], left: [-d, 0], right: [d, 0] }[a.from as string] ?? [0, 0];
      A.vis = true;
      A.anclado = null;
      A.x = g(a.pos.col) + off[0] * (1 - pe);
      A.y = g(a.pos.row) + off[1] * (1 - pe);
      A.op = pe;
      A.esc = a.from === 'grow' ? lerp(0.4, 1, easeBack(p)) : lerp(0.7, 1, pe);
      return;
    }
    case 'enter': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.nuevo === undefined) m.nuevo = !A.vis;
      if (m.nuevo) alFrente(e, a.actor);
      const tx = g(a.to.col), ty = g(a.to.row);
      const sx = a.from === 'left' ? -160 : a.from === 'right' ? ANCHO + 160 : tx;
      const sy = a.from === 'top' ? -160 : a.from === 'bottom' ? ALTO + 160 : ty;
      Object.assign(A, { vis: true, op: 1, esc: 1, anclado: null, x: lerp(sx, tx, pio), y: lerp(sy, ty, pio) });
      return;
    }
    case 'move':
    case 'translocate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      const d = m.desde as { x: number; y: number };
      const tx = g(a.to.col), ty = g(a.to.row);
      A.anclado = null;
      A.x = lerp(d.x, tx, pio);
      A.y = lerp(d.y, ty, pio);
      if (a.tipo === 'translocate') {
        A.compartimento = a.compartment;
        if (p < 1) e.efectos.push({ tipo: 'linea', clase: 'transloca', p, x1: d.x, y1: d.y, x2: tx, y2: ty });
        const q = tramo(p, 0.4, 0.75);
        if (q > 0 && q < 1) e.efectos.push({ tipo: 'destello', p: q, x: (d.x + tx) / 2, y: (d.y + ty) / 2, r: 60, color: '#5B8CFF' });
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
      if (a.lado === 'encima' || m.frente === undefined) { m.frente = true; alFrente(e, a.actor); }
      if (p >= 1) {
        A.anclado = { host: a.target, dx: off.x, dy: off.y };
      } else {
        A.anclado = null;
        A.x = lerp(d.x, h.x + off.x, pio);
        A.y = lerp(d.y, h.y + off.y, pio);
      }
      const q = tramo(p, 0.72, 1);
      if (q > 0 && q < 1) {
        A.esc = 1 + 0.05 * Math.sin(Math.PI * q);
        e.efectos.push({ tipo: 'destello', p: q, x: h.x + off.x / 2, y: h.y + off.y / 2, r: 50, color: imagen(A.img).color });
      }
      return;
    }
    case 'release': {
      const A = e.actores[a.actor];
      const F = e.actores[a.from];
      if (!A || !F) return;
      if (!m.desde) {
        m.desde = posAbs(e, a.actor);
        m.fromPos = posAbs(e, a.from);
      }
      const d = m.desde as { x: number; y: number };
      const fp = m.fromPos as { x: number; y: number };
      // Si era el otro el acoplado (RB sobre E2F y se suelta E2F), se congela
      // al otro donde estaba.
      if (F.anclado?.host === a.actor) { F.anclado = null; F.x = fp.x; F.y = fp.y; F.envuelto = 1; }
      A.anclado = null;
      A.envuelto = 1;
      let tx: number, ty: number;
      if (a.to) { tx = g(a.to.col); ty = g(a.to.row); } else {
        const dx = d.x - fp.x, dy = d.y - fp.y, n = Math.hypot(dx, dy) || 1;
        tx = d.x + (dx ? (dx / n) * 90 : 90); ty = d.y + (dy / n) * 90;
      }
      const k = easeBack(p);
      A.x = lerp(d.x, tx, k);
      A.y = lerp(d.y, ty, k);
      // Si el que se suelta es una ubiquitina ligasa (MDM2 de p53), la cadena
      // que había puesto se cae: el sustrato deja de estar marcado.
      if (LIGASAS.has(A.img) && F.ubi > 0) {
        if (m.u0 === undefined) m.u0 = F.ubi;
        F.ubi = lerp(m.u0 as number, 0, pe);
      }
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
      f.dx = 0; f.dy = 0;
      if (a.kinase !== a.target) {
        ponerConector(e, { id: `fos:${a.kinase}>${a.target}`, from: a.kinase, to: a.target, type: 'fosforila', prog: easeOut(tramo(p, 0, 0.5)) });
      }
      const q = tramo(p, 0.35, 0.9);
      if (q > 0 && q < 1) {
        const c = cajaActor(e, a.target);
        const s = imagen(T.img).pSites[(Number(a.site.replace(/\D/g, '')) || 1) - 1] ?? [0.9, 0.35];
        e.efectos.push({ tipo: 'destello', p: q, x: c.x + s[0] * c.w, y: c.y + s[1] * c.h, r: 34, color: COLOR_FOSFATO });
      }
      return;
    }
    case 'dephosphorylate': {
      const T = e.actores[a.target];
      if (!T) return;
      const hacia = a.phosphatase ? posAbs(e, a.phosphatase) : null;
      const yo = posAbs(e, a.target);
      if (a.phosphatase) {
        inclinar(e, a.phosphatase, a.target, Math.sin(Math.PI * tramo(p, 0, 0.6)));
        ponerConector(e, { id: `desfos:${a.phosphatase}>${a.target}`, from: a.phosphatase, to: a.target, type: 'desfosforila', prog: easeOut(tramo(p, 0, 0.5)) });
      }
      const afectados = T.fosfatos.filter((f) => !a.site || f.site === a.site);
      const q = easeOut(tramo(p, 0.2, 0.9));
      for (const f of afectados) {
        f.op = 1 - q;
        if (hacia) { const dx = hacia.x - yo.x, dy = hacia.y - yo.y, n = Math.hypot(dx, dy) || 1; f.dx = (dx / n) * 40 * q; f.dy = (dy / n) * 40 * q; }
        else f.dy = -30 * q;
      }
      if (p >= 1) T.fosfatos = T.fosfatos.filter((f) => !afectados.includes(f));
      const r = tramo(p, 0.2, 0.8);
      if (r > 0 && r < 1) e.efectos.push({ tipo: 'destello', p: r, x: yo.x, y: yo.y - 30, r: 44, color: COLOR_CIAN });
      return;
    }
    case 'activate': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.h0 === undefined) { m.h0 = A.halo; m.g0 = A.gris; m.c0 = A.candado; }
      A.estado = 'activo';
      A.halo = lerp(m.h0 as number, 0.9, pe);
      A.gris = lerp(m.g0 as number, 0, pe);
      A.candado = lerp(m.c0 as number, 0, pe);
      A.esc = (A.esc || 1) * (1 + 0.06 * Math.sin(Math.PI * p));
      return;
    }
    case 'inhibit': {
      const T = e.actores[a.target];
      if (!T || !e.actores[a.inhibitor]) return;
      if (m.h0 === undefined) { m.h0 = T.halo; m.g0 = T.gris; m.c0 = T.candado; }
      if (a.conector !== false) {
        ponerConector(e, { id: `inh:${a.inhibitor}>${a.target}`, from: a.inhibitor, to: a.target, type: 'inhibe', prog: easeOut(tramo(p, 0, 0.6)) });
      }
      const q = easeOut(tramo(p, 0.4, 1));
      T.estado = 'inhibido';
      T.gris = lerp(m.g0 as number, 0.85, q);
      T.halo = lerp(m.h0 as number, 0, q);
      T.candado = lerp(m.c0 as number, 1, q);
      return;
    }
    case 'release_inhibition': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.g0 === undefined) { m.g0 = A.gris; m.c0 = A.candado; }
      A.gris = lerp(m.g0 as number, 0, pe);
      A.candado = lerp(m.c0 as number, 0, pe);
      if (p >= 1 && A.estado === 'inhibido') A.estado = 'normal';
      for (const c of e.conectores) if (c.type === 'inhibe' && c.to === a.actor) c.op = 1 - pe;
      if (p >= 1) e.conectores = e.conectores.filter((c) => !(c.type === 'inhibe' && c.to === a.actor));
      return;
    }
    case 'sequester': {
      const S = e.actores[a.actor], T = e.actores[a.target];
      if (!S || !T) return;
      if (!m.desde) { m.desde = posAbs(e, a.actor); m.tpos = posAbs(e, a.target); }
      const d = m.desde as { x: number; y: number };
      const tp = m.tpos as { x: number; y: number };
      const fin1 = a.to ? 0.5 : 1;
      const q1 = easeInOut(tramo(p, 0, fin1));
      S.anclado = null;
      S.x = lerp(d.x, tp.x, q1);
      S.y = lerp(d.y, tp.y + 6, q1);
      T.envuelto = lerp(1, 0.85, q1);
      if (m.frente === undefined) { m.frente = true; alFrente(e, a.target); }
      if (q1 >= 1 || p >= fin1) {
        T.anclado = { host: a.actor, dx: 0, dy: -6 };
        if (a.to) {
          const q2 = easeInOut(tramo(p, 0.5, 1));
          S.x = lerp(tp.x, g(a.to.col), q2);
          S.y = lerp(tp.y + 6, g(a.to.row), q2);
        }
      } else {
        T.anclado = null; T.x = tp.x; T.y = tp.y;
      }
      ponerConector(e, { id: `sec:${a.actor}>${a.target}`, from: a.actor, to: a.target, type: 'secuestra', prog: q1 });
      return;
    }
    case 'transcribe': {
      const G = e.actores[a.gene], P = e.actores[a.product];
      if (!G || !P || !e.actores[a.tf]) return;
      if (m.img0 === undefined) { m.img0 = G.img; m.nuevo = !P.vis; }
      const img0 = m.img0 as string;
      const gp = posAbs(e, a.gene);
      const tx = g(a.productPos.col), ty = g(a.productPos.row);
      const qIn = tramo(p, 0, 0.15), qOut = tramo(p, 0.85, 1);
      if (p < 1 && qOut === 0) { G.imgPrev = img0; G.img = 'gen_activo'; G.mezcla = qIn; }
      else if (p < 1) { G.imgPrev = 'gen_activo'; G.img = img0; G.mezcla = qOut; }
      else { G.img = img0; G.imgPrev = null; G.mezcla = 1; }
      const r = tramo(p, 0.1, 0.75);
      if (r > 0 && p < 1) e.efectos.push({ tipo: 'arnm', p: r, x1: gp.x, y1: gp.y, x2: tx, y2: ty });
      const s = tramo(p, 0.65, 1);
      if (s > 0) {
        if (m.nuevo) { alFrente(e, a.product); Object.assign(P, { estado: 'normal', halo: 0, gris: 0, candado: 0, fosfatos: [], ubi: 0, envuelto: 1 }); }
        Object.assign(P, { vis: true, anclado: null, x: tx, y: ty, op: easeOut(s), esc: lerp(0.4, 1, easeBack(s)) });
        ponerConector(e, { id: `tx:${a.gene}>${a.product}`, from: a.gene, to: a.product, type: 'transcribe', prog: easeOut(s) });
      }
      const tf = e.actores[a.tf];
      tf.esc = (tf.esc || 1) * (1 + 0.05 * Math.sin(Math.PI * tramo(p, 0, 0.3)));
      return;
    }
    case 'ubiquitinate': {
      const L = e.actores[a.ligase], T = e.actores[a.target];
      if (!L || !T) return;
      if (m.u0 === undefined) m.u0 = T.ubi;
      inclinar(e, a.ligase, a.target, Math.sin(Math.PI * tramo(p, 0, 0.8)));
      T.ubi = lerp(m.u0 as number, 4, tramo(p, 0.2, 1));
      ponerConector(e, { id: `ub:${a.ligase}>${a.target}`, from: a.ligase, to: a.target, type: 'degrada', prog: easeOut(tramo(p, 0, 0.5)) });
      return;
    }
    case 'degrade': {
      const T = e.actores[a.target];
      if (!T) return;
      if (!m.desde) {
        m.desde = posAbs(e, a.target);
        const prot = e.orden.find((k) => e.actores[k].vis && e.actores[k].img === 'proteasoma');
        m.prot = prot ?? null;
      }
      const d = m.desde as { x: number; y: number };
      const pk = m.prot as string | null;
      const pp = pk ? posAbs(e, pk) : { x: g(14), y: g(8.6) };
      const q = easeInOut(tramo(p, 0, 0.75));
      soltarHuespedes(e, a.target);
      T.anclado = null;
      T.x = lerp(d.x, pp.x, q);
      T.y = lerp(d.y, pp.y, q);
      T.esc = lerp(1, 0.2, q);
      T.op = 1 - tramo(p, 0.55, 0.8);
      if (p < 1) e.efectos.push({ tipo: 'linea', clase: 'degrada', p: tramo(p, 0, 0.3), x1: d.x, y1: d.y, x2: pp.x, y2: pp.y });
      const f = tramo(p, 0.75, 1);
      if (f > 0 && f < 1) {
        e.efectos.push({ tipo: 'fragmentos', p: f, x: pp.x, y: pp.y });
        if (pk) e.actores[pk].esc = 1 + 0.06 * Math.sin(Math.PI * f);
      }
      if (p >= 1) Object.assign(T, { vis: false, op: 0, esc: 1, ubi: 0, fosfatos: [], estado: 'normal', gris: 0, candado: 0, halo: 0 });
      return;
    }
    case 'hide': {
      const A = e.actores[a.actor];
      if (!A) return;
      A.op = 1 - pe;
      if (p >= 1) { soltarHuespedes(e, a.actor); A.vis = false; A.op = 0; }
      return;
    }
    case 'damage': {
      const D = e.actores[a.target];
      if (!D) return;
      if (m.img0 === undefined) {
        m.img0 = D.img;
        const fuente = a.agent === 'radiacion' ? e.orden.find((k) => e.actores[k].vis && e.actores[k].img === 'radiacion') : undefined;
        m.fuente = fuente ?? null;
      }
      const dp = posAbs(e, a.target);
      const fk = m.fuente as string | null;
      const fp = fk ? posAbs(e, fk) : { x: dp.x - 380, y: dp.y - 40 };
      const w = tramo(p, 0, 0.45);
      if (w > 0 && p < 1) e.efectos.push({ tipo: 'onda', p: w, x1: fp.x, y1: fp.y, x2: dp.x, y2: dp.y });
      if (fk) ponerConector(e, { id: `dano:${fk}>${a.target}`, from: fk, to: a.target, type: 'dano', prog: easeOut(w) });
      // Solo el ADN liso cambia de imagen; una horquilla detenida se queda
      // como está y el daño se lee en las chispas.
      const destino = IMG_DANO[a.kind];
      if (ADN_LISO.has(m.img0 as string) && destino) {
        const s = tramo(p, 0.45, 0.7);
        if (s > 0 && s < 1) { D.imgPrev = m.img0 as string; D.img = destino; D.mezcla = s; }
        else if (s >= 1) { D.img = destino; D.imgPrev = null; D.mezcla = 1; }
      }
      const k = tramo(p, 0.45, 0.8);
      if (k > 0 && k < 1) D.ex += 6 * Math.sin(k * Math.PI * 6) * (1 - k);
      const c = tramo(p, 0.45, 1);
      if (c > 0 && c < 1) e.efectos.push({ tipo: 'chispas', p: c, x: dp.x, y: dp.y });
      return;
    }
    case 'feedback_loop': {
      if (!e.actores[a.from] || !e.actores[a.to]) return;
      const id = `fb:${a.from}>${a.to}`;
      const n = Math.max(1, a.cycles);
      ponerConector(e, { id, from: a.from, to: a.to, type: 'retroalimentacion', sign: a.sign, prog: easeOut(tramo(p, 0, 0.5 / n)) });
      if (p < 1) {
        // Positivo: cada vuelta un 20 % más rápida.
        const pesos = Array.from({ length: n }, (_, i) => (a.sign === '+' ? Math.pow(0.8, i) : 1));
        const total = pesos.reduce((s, v) => s + v, 0);
        let acc = 0, f = 0;
        for (const w of pesos) { const fin = acc + w / total; if (p <= fin) { f = (p - acc) / (w / total); break; } acc = fin; }
        const x1 = posAbs(e, a.from), x2 = posAbs(e, a.to);
        e.efectos.push({ tipo: 'punto', p, via: id, x1: x1.x, y1: x1.y, x2: x2.x, y2: x2.y, f, color: a.sign === '+' ? '#3DDC97' : '#FF4D6D' });
      }
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
    case 'swap_image': {
      const A = e.actores[a.actor];
      if (!A) return;
      if (m.img0 === undefined) m.img0 = A.img;
      if (a.label && p >= 0.5) A.label = a.label;
      if (p >= 1) { A.img = a.img; A.imgPrev = null; A.mezcla = 1; }
      else { A.imgPrev = m.img0 as string; A.img = a.img; A.mezcla = pe; }
      return;
    }
    case 'split': {
      const C = e.actores[a.actor];
      if (!C) return;
      if (!m.desde) m.desde = posAbs(e, a.actor);
      const d = m.desde as { x: number; y: number };
      C.op = 1 - tramo(p, 0, 0.4);
      const q = easeInOut(tramo(p, 0.3, 1));
      for (const parte of a.into) {
        const P = e.actores[parte.actor];
        if (!P) continue;
        if (m[`n:${parte.actor}`] === undefined) m[`n:${parte.actor}`] = !P.vis;
        if (m[`n:${parte.actor}`]) { alFrente(e, parte.actor); Object.assign(P, { estado: 'normal', halo: 0, gris: 0, candado: 0, fosfatos: [], ubi: 0, envuelto: 1 }); }
        Object.assign(P, { vis: true, anclado: null, op: easeOut(tramo(p, 0.2, 0.5)), esc: 1, x: lerp(d.x, g(parte.pos.col), q), y: lerp(d.y, g(parte.pos.row), q) });
      }
      if (p >= 1 && !a.into.some((x) => x.actor === a.actor)) { soltarHuespedes(e, a.actor); C.vis = false; C.op = 0; }
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
        if (m.nuevo) { alFrente(e, a.into); Object.assign(I, { estado: 'normal', halo: 0, gris: 0, candado: 0, fosfatos: [], ubi: 0, envuelto: 1 }); }
        const s = tramo(p, 0.5, 1);
        Object.assign(I, { vis: s > 0 || I.vis, anclado: null, x: tx, y: ty, op: s > 0 ? easeOut(s) : I.op, esc: lerp(0.4, 1, easeBack(s)) });
      }
      return;
    }
    case 'outcome': {
      const x = g(a.pos?.col ?? 8), y = g(a.pos?.row ?? 9);
      const id = `out:${a.kind}:${Math.round(x)}:${Math.round(y)}`;
      // Un desenlace nuevo desplaza al que ocupaba su sitio.
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
    a.ex = 0; a.ey = 0; a.rot = 0; a.imgPrev = null; a.mezcla = 1;
    if (a.vis) { a.esc = 1; a.op = 1; }
    a.fosfatos = a.fosfatos.filter((f) => f.op > 0.01).map((f) => ({ ...f, op: 1, dx: 0, dy: 0 }));
    a.ubi = Math.round(a.ubi);
  }
  e.efectos = [];
  e.foco = null;
  e.notas = e.notas.filter((n) => n.persist).map((n) => ({ ...n, op: 1 }));
  e.conectores = e.conectores.filter((c) => c.op > 0.01).map((c) => ({ ...c, prog: 1, op: 1 }));
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
};

export type EscenarioCompilado = {
  escenario: Escenario;
  pasos: PasoCompilado[];
  /** Todos los conectores que llegan a dibujarse en la vía (para la prueba). */
  conectoresVia: ConectorSt[];
};

export function escenaVacia(esc: Escenario): Escena {
  const actores: Record<string, ActorSt> = {};
  for (const [key, d] of Object.entries(esc.actores)) {
    actores[key] = {
      key, img: d.img, imgPrev: null, mezcla: 1, x: ANCHO / 2, y: ALTO / 2, esc: 1, rot: 0, op: 0, vis: false,
      estado: 'normal', halo: 0, gris: 0, candado: 0, fosfatos: [], ubi: 0, anclado: null, envuelto: 1,
      ex: 0, ey: 0, compartimento: d.compartment, escalaDecl: d.escala ?? 1,
      tira: d.tira ?? 0, imgBase: d.img,
    };
  }
  return { actores, orden: [], conectores: [], notas: [], desenlaces: [], efectos: [], camara: { ...CAMARA_TODO }, foco: null, escala: 1 };
}

function correr(base: Escena, acciones: AccionCompilada[], t: number, escala: number): Escena {
  const e = clonar(base);
  e.escala = escala;
  for (const c of acciones) {
    if (t < c.at) break;
    const p = c.dur > 0 ? clamp((t - c.at) / c.dur) : 1;
    aplicar(e, c.a, p, c.m);
  }
  return e;
}

export function compilar(esc: Escenario): EscenarioCompilado {
  const pasos: PasoCompilado[] = [];
  const porId = new Map<string, PasoCompilado>();
  const vistos = new Map<string, ConectorSt>();
  let anterior = escenaVacia(esc);

  esc.pasos.forEach((paso, indice) => {
    const base = paso.base && porId.has(paso.base) ? porId.get(paso.base)!.final : anterior;
    const propias = [...paso.acciones];
    // Un paso que no mueve la cámara no hereda el zoom del anterior: vuelve
    // solo al plano general (si no, el estudiante lee la narración de un
    // paso mirando el detalle del otro).
    const zoomHeredado = base.camara.w !== CAMARA_TODO.w || base.camara.x !== 0 || base.camara.y !== 0;
    if (zoomHeredado && !propias.some((a) => a.tipo === 'camera')) propias.unshift({ at: 0, tipo: 'camera', box: 'all' });
    const acciones = propias
      .map((a) => ({ a, at: a.at, dur: duracionDe(a), m: {} as Memo }))
      .sort((x, y) => x.at - y.at);
    const duracion = acciones.reduce((mx, c) => Math.max(mx, c.at + c.dur), 0);
    // Una pasada con todo al 100 % llena los memos y da el estado final. Los
    // conectores se recogen en cada acción (antes de que un `disconnect` o
    // una degradación los retire).
    const e = clonar(base);
    e.escala = paso.sceneScale ?? 1;
    for (const c of acciones) {
      aplicar(e, c.a, 1, c.m);
      for (const cn of e.conectores) if (!vistos.has(cn.id)) vistos.set(cn.id, { ...cn, prog: 1, op: 1 });
    }
    const final = cerrar(e);
    const pc: PasoCompilado = { paso, indice, acciones, duracion, base, final };
    pasos.push(pc);
    porId.set(paso.id, pc);
    anterior = final;
  });

  return { escenario: esc, pasos, conectoresVia: [...vistos.values()] };
}

/** La escena del paso en el instante `t` (ms desde que empieza el paso). */
export function evaluar(pc: PasoCompilado, t: number): Escena {
  if (t >= pc.duracion) return pc.final;
  return correr(pc.base, pc.acciones, t, pc.paso.sceneScale ?? 1);
}
