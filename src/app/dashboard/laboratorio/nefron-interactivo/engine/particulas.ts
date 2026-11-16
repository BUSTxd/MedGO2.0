// Partículas de las dos escenas, dibujadas en un <canvas> encima del SVG.
//
// · Nefrón: un juego fijo de partículas recorre la ruta del filtrado a
//   velocidad constante. Su posición es función pura del reloj de la escena
//   (pausa y velocidad salen solas). Cada una lleva un umbral θ: se ve mientras
//   θ < fracción que queda de su sustancia; al cruzarlo se va de la luz hacia el
//   intersticio (reabsorción) o entra desde él (secreción).
// · Célula: emisores por corriente (transportador × sustancia) con un ritmo
//   proporcional al flujo; cada partícula hace su trayecto y se apaga.

import { SUSTANCIAS } from '@/lib/data/nefron/sustancias.ts';
import type { SustanciaId } from '@/lib/data/nefron/tipos.ts';
import { RUTA, enRuta, type P } from './geometria.ts';
import { NODOS, type Perfil, type SustanciaFlujo } from './flujo.ts';
import type { Corriente } from './disposicion.ts';

function aleatorio(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ParticulaRuta {
  s: SustanciaFlujo;
  theta: number;
  fase: number;
  lat: number;
}

const PESOS: Array<[SustanciaFlujo, number]> = [
  ['agua', 130], ['na', 64], ['urea', 30], ['k', 26], ['glucosa', 34],
  ['aa', 20], ['hco3', 26], ['fosfato', 16], ['ca', 20], ['mg', 16],
];

export const PARTICULAS_RUTA: ParticulaRuta[] = (() => {
  const r = aleatorio(20261115);
  const out: ParticulaRuta[] = [];
  for (const [s, n] of PESOS) {
    for (let i = 0; i < n; i++) {
      // El umbral no cae nunca en 0 exacto: así lo que no se reabsorbe nada sigue hasta el final.
      out.push({ s, theta: 0.004 + r() * 0.995, fase: r(), lat: (r() - 0.5) * 0.62 });
    }
  }
  return out;
})();

/** Velocidad del filtrado en la animación (u del lienzo por segundo, a 1×). */
export const VELOCIDAD_RUTA = 125;
const DERIVA = 26;

function remEn(perfil: Perfil, s: SustanciaFlujo, tramo: number, u: number) {
  const r = perfil.rem[s];
  const a = r[Math.min(tramo, NODOS - 1)];
  const b = r[Math.min(tramo + 1, NODOS - 1)];
  return a + (b - a) * u;
}

export interface Dibujo { x: number; y: number; alfa: number }

/** Dónde está la partícula `p` en el instante `t` (o null si ya no está en la luz). */
export function enLaRuta(p: ParticulaRuta, t: number, perfil: Perfil): Dibujo | null {
  const L = RUTA.largo;
  const s = (((t * VELOCIDAD_RUTA) / L + p.fase) % 1) * L;
  const r = enRuta(s);
  const largoTramo = RUTA.cortes[r.tramo + 1] - RUTA.cortes[r.tramo];
  const ahora = remEn(perfil, p.s, r.tramo, r.u);
  const inicio = remEn(perfil, p.s, r.tramo, 0);
  const fin = remEn(perfil, p.s, r.tramo, 1);
  const visible = p.theta < ahora;
  const base: P = [r.p[0] + r.n[0] * p.lat * r.luz, r.p[1] + r.n[1] * p.lat * r.luz];
  const lado = p.lat >= 0 ? 1 : -1;
  if (visible) {
    // ¿Entró en este tramo (secreción)? Llega desde el intersticio.
    if (p.theta >= inicio && fin !== inicio) {
      const uc = (p.theta - inicio) / (fin - inicio);
      const d = (r.u - uc) * largoTramo;
      if (d >= 0 && d < DERIVA) {
        const k = 1 - d / DERIVA;
        const off = lado * (r.luz / 2 + k * 18);
        return { x: r.p[0] + r.n[0] * off, y: r.p[1] + r.n[1] * off, alfa: 1 - k * 0.8 };
      }
    }
    return { x: base[0], y: base[1], alfa: 1 };
  }
  // No está: si salió hace poco en este tramo, se la ve cruzando la pared.
  if (p.theta < inicio && fin !== inicio) {
    const uc = (p.theta - inicio) / (fin - inicio);
    const d = (r.u - uc) * largoTramo;
    if (d >= 0 && d < DERIVA) {
      const k = d / DERIVA;
      const off = lado * (Math.abs(p.lat) * r.luz + k * (r.luz / 2 + 18));
      return { x: r.p[0] + r.n[0] * off, y: r.p[1] + r.n[1] * off, alfa: 1 - k };
    }
  }
  return null;
}

/** Burbuja de una sustancia; con texto si el radio en pantalla lo permite. */
export function burbuja(
  ctx: CanvasRenderingContext2D, x: number, y: number, r: number, s: SustanciaId, alfa: number, texto: boolean,
) {
  const su = SUSTANCIAS[s];
  // Estilo de la referencia: halo tenue, cuerpo lleno y un brillo blanco.
  ctx.fillStyle = su.color;
  ctx.globalAlpha = alfa * 0.26;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alfa;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  if (!texto) {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = alfa * 0.8;
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alfa;
  }
  if (texto) {
    ctx.fillStyle = su.textoOscuro ? '#1c2233' : '#ffffff';
    const largo = su.simbolo.length;
    ctx.font = `700 ${r * (largo > 4 ? 0.62 : largo > 3 ? 0.74 : 0.9)}px Outfit, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(su.simbolo, x, y + r * 0.04);
  }
  ctx.globalAlpha = 1;
}

/** Glóbulo rojo de la referencia: rosquilla roja o magenta; uno de cada tres, de canto. */
export function globuloRojo(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, k: number) {
  const magenta = k % 3 === 1;
  const cuerpo = magenta ? '#d6339b' : '#f0304f';
  const sombraC = magenta ? '#8f1f72' : '#a8163a';
  const borde = magenta ? '#f27cc4' : '#ff6f7f';
  ctx.globalAlpha = 1;
  if (k % 3 === 2) {
    // De canto: una elipse fina, inclinada.
    ctx.fillStyle = sombraC;
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 2, r, r * 0.28, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = cuerpo;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.26, 0.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.fillStyle = sombraC;
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 3, r, r * 0.86, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = cuerpo;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.86, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = borde;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.62, r * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = sombraC;
  ctx.beginPath();
  ctx.ellipse(x + r * 0.06, y + r * 0.06, r * 0.4, r * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Punto de una polilínea a una fracción u de su largo. */
export function enPolilinea(ruta: P[], u: number): P {
  const largos: number[] = [];
  let total = 0;
  for (let i = 1; i < ruta.length; i++) {
    const l = Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]);
    largos.push(l);
    total += l;
  }
  let d = Math.min(1, Math.max(0, u)) * total;
  for (let i = 0; i < largos.length; i++) {
    if (d <= largos[i] || i === largos.length - 1) {
      const t = largos[i] ? d / largos[i] : 0;
      return [ruta[i][0] + (ruta[i + 1][0] - ruta[i][0]) * t, ruta[i][1] + (ruta[i + 1][1] - ruta[i][1]) * t];
    }
    d -= largos[i];
  }
  return ruta[ruta.length - 1];
}

/**
 * Emisores de la vista de célula. Guardan la edad de cada partícula viva; el
 * reloj solo avanza con `avanzar`, así que la pausa congela la escena tal cual.
 */
export class Emisores {
  private vivos = new Map<string, { acc: number; edades: number[] }>();

  avanzar(corrientes: Corriente[], dt: number, flujo: (c: Corriente) => number) {
    const vistos = new Set<string>();
    for (const c of corrientes) {
      vistos.add(c.clave);
      let e = this.vivos.get(c.clave);
      if (!e) {
        // Arranca con la corriente ya en marcha, no vacía.
        const r = c.ritmo * flujo(c);
        const edades: number[] = [];
        if (r > 0.01) for (let a = 0; a < c.duracion; a += 1 / r) edades.push(a + 0.0001);
        e = { acc: 0, edades };
        this.vivos.set(c.clave, e);
      }
      for (let i = 0; i < e.edades.length; i++) e.edades[i] += dt;
      e.edades = e.edades.filter((a) => a < c.duracion);
      e.acc += dt * c.ritmo * flujo(c);
      while (e.acc >= 1) {
        e.acc -= 1;
        e.edades.push(e.acc / Math.max(0.001, c.ritmo * flujo(c)));
      }
    }
    for (const k of [...this.vivos.keys()]) if (!vistos.has(k)) this.vivos.delete(k);
  }

  /** Recorre las partículas vivas: corriente, posición y opacidad. */
  cada(corrientes: Corriente[], fn: (c: Corriente, p: P, alfa: number) => void) {
    for (const c of corrientes) {
      const e = this.vivos.get(c.clave);
      if (!e) continue;
      for (const a of e.edades) {
        const u = a / c.duracion;
        const alfa = u < 0.12 ? u / 0.12 : u > 0.82 ? Math.max(0, (1 - u) / 0.18) : 1;
        fn(c, enPolilinea(c.ruta, u), alfa);
      }
    }
  }

  vaciar() { this.vivos.clear(); }
}
