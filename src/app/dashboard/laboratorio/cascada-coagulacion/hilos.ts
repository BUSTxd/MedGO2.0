// Geometría y física de los hilos del lienzo. Funciones puras: `CascadaLab`
// las llama desde su bucle de animación y escribe el resultado directo en el
// DOM (atributo `d`), sin pasar por el estado de React.

export interface Pt {
  x: number;
  y: number;
}

export interface Caja {
  x: number; // centro
  y: number;
  w: number;
  h: number;
}

/** Estado físico de un hilo: su punto de control es una masa con resorte. */
export interface Muelle {
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  /** Largo en la lámina original: por debajo de él el hilo cuelga, por encima se tensa. */
  reposo: number;
  vivo: boolean;
}

/**
 * Punto del borde de `c` en la dirección de `hacia`, separado `margen` px.
 * Así la flecha nace y muere en el contorno del nodo, no en su centro.
 */
export function bordeHacia(c: Caja, hacia: Pt, margen = 0): Pt {
  const dx = hacia.x - c.x;
  const dy = hacia.y - c.y;
  if (dx === 0 && dy === 0) return { x: c.x, y: c.y };
  const hw = c.w / 2 + margen;
  const hh = c.h / 2 + margen;
  const tx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const ty = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  // Si el punto de control cae dentro de la caja, el borde está más lejos que él:
  // devolvemos el borde igualmente (t > 1 es válido, es sólo una dirección).
  return { x: c.x + dx * t, y: c.y + dy * t };
}

/** Punto de una bézier cuadrática. */
export function bezier(p0: Pt, c: Pt, p2: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p2.y,
  };
}

/**
 * Hacia dónde reposa el punto de control. En reposo (largo ≥ reposo) el hilo
 * va recto; si acercas sus extremos, la holgura lo hace combar hacia «abajo»
 * —la normal que apunta al suelo—, como un hilo de verdad.
 */
export function objetivoControl(a: Pt, b: Pt, reposo: number): Pt {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const largo = Math.hypot(dx, dy) || 1;
  // Zona muerta de unos px: el recorte en el borde de los nodos mueve los
  // extremos un poco respecto a la lámina, y sin ella todos los hilos
  // arrancarían con una comba mínima.
  const holgura = reposo - largo - 10;
  if (holgura <= 0) return { x: mx, y: my };
  const comba = Math.min(holgura * 0.5, 110);
  // Normal unitaria; la que apunta hacia abajo (y+). En un hilo casi vertical
  // se elige la de la derecha para que la comba no se pierda a lo largo de él.
  let nx = -dy / largo;
  let ny = dx / largo;
  if (ny < 0 || (Math.abs(ny) < 0.15 && nx < 0)) {
    nx = -nx;
    ny = -ny;
  }
  return { x: mx + nx * comba, y: my + ny * comba };
}

const RIGIDEZ = 0.14;
const AMORTIGUA = 0.8;

/**
 * Un paso del resorte. Devuelve `true` mientras siga moviéndose. Con
 * `sinRebote` (prefers-reduced-motion) va directo al objetivo.
 */
export function pasoMuelle(m: Muelle, obj: Pt, sinRebote: boolean): boolean {
  if (!m.vivo || sinRebote) {
    m.cx = obj.x;
    m.cy = obj.y;
    m.vx = 0;
    m.vy = 0;
    m.vivo = true;
    return false;
  }
  m.vx = (m.vx + (obj.x - m.cx) * RIGIDEZ) * AMORTIGUA;
  m.vy = (m.vy + (obj.y - m.cy) * RIGIDEZ) * AMORTIGUA;
  m.cx += m.vx;
  m.cy += m.vy;
  const quieto =
    Math.abs(m.vx) < 0.04 && Math.abs(m.vy) < 0.04 &&
    Math.abs(obj.x - m.cx) < 0.08 && Math.abs(obj.y - m.cy) < 0.08;
  if (quieto) {
    m.cx = obj.x;
    m.cy = obj.y;
    m.vx = 0;
    m.vy = 0;
  }
  return !quieto;
}

/** Grosor según el estiramiento: estirado adelgaza, destensado engorda un poco. */
export function grosor(base: number, largo: number, reposo: number): number {
  const s = largo / Math.max(reposo, 30);
  return base * Math.min(1.25, Math.max(0.55, 1 / Math.sqrt(s)));
}

export function trazo(p0: Pt, c: Pt, p2: Pt): string {
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}Q${c.x.toFixed(1)} ${c.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}
