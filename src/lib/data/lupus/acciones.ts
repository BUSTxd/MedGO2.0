// Atajos para escribir los capítulos del laboratorio «Lupus» sin repetir la
// forma de cada acción. Todo en ms desde el inicio del paso y en celdas del
// lienzo (100 u). Solo construyen objetos de datos: no hay lógica aquí.

import type { Accion, ActorDecl, ConnectorType, Fondo, Lado, Marcador, ParamTejido, Pos } from './tipos';

const pos = (col: number, row: number): Pos => ({ col, row });

/** Anima un parámetro de la lámina hasta `a`. */
export const p = (param: ParamTejido, a: number, at: number, duration = 900, ease?: 'lineal'): Accion => ({ at, duration, tipo: 'tejido', param, a, ...(ease ? { ease } : {}) });
/** Lleva varios parámetros a 0 (lo que dejó el paso anterior). */
export const apagar = (at: number, ...ps: ParamTejido[]): Accion[] => ps.map((x) => p(x, 0, at, 600));
/** Oculta varios actores. */
export const ocultar = (at: number, ...ks: string[]): Accion[] => ks.map((actor) => ({ at, duration: 600, tipo: 'hide', actor }));
export const fondo = (f: Fondo, at = 0): Accion => ({ at, duration: 1000, tipo: 'fondo', fondo: f });

export const ver = (actor: string, col: number, row: number, at: number, from: 'fade' | 'top' | 'left' | 'right' | 'bottom' | 'grow' = 'grow', duration = 700): Accion =>
  ({ at, duration, tipo: 'appear', actor, pos: pos(col, row), from });
export const mover = (actor: string, col: number, row: number, at: number, duration = 1400): Accion => ({ at, duration, tipo: 'move', actor, to: pos(col, row) });
export const pegar = (actor: string, target: string, at: number, ang: number, extra: { apunta?: 'fc' | 'fab'; dist?: number; duration?: number } = {}): Accion =>
  ({ at, duration: extra.duration ?? 800, tipo: 'bind', actor, target, ang, ...(extra.apunta ? { apunta: extra.apunta } : {}), ...(extra.dist ? { dist: extra.dist } : {}) });
export const soltar = (actor: string, from: string, at: number, col?: number, row?: number): Accion => ({ at, duration: 600, tipo: 'release', actor, from, ...(col !== undefined ? { to: pos(col, row!) } : {}) });
export const encender = (actor: string, at: number, duration = 900): Accion => ({ at, duration, tipo: 'activate', actor });
export const apagarActor = (actor: string, at: number, duration = 700): Accion => ({ at, duration, tipo: 'deactivate', actor });
export const nota = (text: string, near: string, at: number, side: 'top' | 'right' | 'bottom' | 'left' = 'top'): Accion => ({ at, tipo: 'note', text, near, side });
export const une = (id: string, from: string, to: string, at: number, type: ConnectorType = 'activa', label?: string, curve?: number): Accion =>
  ({ at, duration: 700, tipo: 'connect', id, from, to, type, ...(label ? { label } : {}), ...(curve !== undefined ? { curve } : {}) });
export const separa = (id: string, at: number): Accion => ({ at, duration: 400, tipo: 'disconnect', id });
export const pulso = (from: string, to: string, at: number, duration = 900): Accion => ({ at, duration, tipo: 'pulse_signal', from, to });
export const expresa = (actor: string, at: number, marcador: Marcador): Accion => ({ at, duration: 500, tipo: 'express', actor, marcador });
export const cambia = (actor: string, at: number, cambio: { img?: string; dibujo?: Extract<Accion, { tipo: 'swap' }>['dibujo']; label?: string; sub?: string; d?: number }, duration = 900): Accion =>
  ({ at, duration, tipo: 'swap', actor, ...cambio });
export const segrega = (actor: string, at: number, kind: Extract<Accion, { tipo: 'secretar' }>['kind'], hacia?: string | [number, number], label?: string, duration = 2000, n?: number): Accion =>
  ({ at, duration, tipo: 'secretar', actor, kind, ...(hacia ? { hacia: typeof hacia === 'string' ? hacia : pos(hacia[0], hacia[1]) } : {}), ...(label ? { label } : {}), ...(n ? { n } : {}) });
export const come = (actor: string, target: string, at: number, duration = 2200): Accion => ({ at, duration, tipo: 'fagocitar', actor, target });
export const muere = (actor: string, at: number, duration = 1500): Accion => ({ at, duration, tipo: 'apoptosis', actor });
export const lisa = (actor: string, at: number, duration = 1500): Accion => ({ at, duration, tipo: 'lisis', actor });
export const divide = (actor: string, into: [string, string], at: number, a: [number, number], b: [number, number], duration = 1400): Accion =>
  ({ at, duration, tipo: 'divide', actor, into, pos: [pos(a[0], a[1]), pos(b[0], b[1])] });
export const desgrana = (actor: string, at: number, kind: Extract<Accion, { tipo: 'degranular' }>['kind'], hacia?: string[], duration = 1800): Accion =>
  ({ at, duration, tipo: 'degranular', actor, ...(kind ? { kind } : {}), ...(hacia ? { hacia } : {}) });
export const desenlace = (texto: string, at: number, kind: 'sobrevive' | 'muere' | 'sale' | 'lesion' | 'alivio' = 'lesion', col = 8, row = 9.4): Accion =>
  ({ at, duration: 800, tipo: 'outcome', kind, pos: pos(col, row), texto });
export const lupa = (id: string, cerca: string, at: number, titulo: string, items: { nombre: string; color: string; detalle: string }[], lado: Lado = 'der', duration = 4000): Accion =>
  ({ at, duration, tipo: 'proceso', id, cerca, lado, datos: { clase: 'lista', titulo, items } });

// ─── Declaraciones de actores ─────────────────────────────────────────────────

export const caja = (label: string, sub = '', color = '#5B6475', w = 420, h = 96): ActorDecl => ({ forma: 'caja', label, sub, color, w, h });
/** Caja medida para su texto: sin relleno de sobra y con la letra más grande. */
export const cajaJusta = (label: string, sub = '', color = '#5B6475'): ActorDecl => {
  const lineas = sub.split('\n').filter(Boolean);
  const w = Math.max(label.length * 14.4, ...lineas.map((l) => l.length * 10.8)) + 48;
  return { forma: 'caja', label, sub, color, ajusta: true, w: Math.round(w), h: lineas.length ? 40 + lineas.length * 26 : 60 };
};
export const texto = (label: string, d = 34, color = 'var(--texto)', sub?: string): ActorDecl => ({ forma: 'texto', label, d, color, ...(sub ? { sub } : {}) });
export const icono = (icono: string, label: string, d = 100): ActorDecl => ({ forma: 'icono', icono, label, d });
