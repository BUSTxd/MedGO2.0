'use client';
// Piezas con detalle fisiológico del laboratorio de Vasculitis: la célula endotelial con
// sus orgánulos, el glucocáliz, las uniones, la membrana basal, el pericito, y las
// moléculas que el guion nombra (NO, prostaciclina, trombomodulina, antitrombina, t-PA,
// factor de von Willebrand, selectinas, ICAM/VCAM, TNF…), cada una con una forma
// reconocible. Mismo estilo que `Piezas.tsx`: planas, sin contorno, sombra y brillo.

import type { ReactNode } from 'react';
import { En, blob, clamp, easeOut, hash, lerp, tramo } from '../citopenias-autoinmunes/Piezas';
import { Hematie, V } from './Piezas';

const hex = (c: string, i: number) => parseInt(c.slice(i, i + 2), 16);
/** Mezcla dos colores #RRGGBB. */
export const mezcla = (a: string, b: string, t: number) => {
  const q = (i: number) => Math.round(lerp(hex(a, i), hex(b, i), clamp(t))).toString(16).padStart(2, '0');
  return `#${q(1)}${q(3)}${q(5)}`;
};

/** Punto de la cúpula (media elipse) de una célula de ancho w y alto h, a la altura x local. */
export const cupula = (w: number, h: number, x: number) => -h * Math.sqrt(Math.max(0, 1 - (2 * x / w) ** 2));

// ─── Pared ────────────────────────────────────────────────────────────────────

/** Célula endotelial de canto: cúpula con núcleo (cromatina y nucléolo), mitocondrias,
 *  retículo, cavéolas y, si `wp`, cuerpos de Weibel-Palade. Base en y = 0.
 *  `activa` la enrojece; `muere` la encoge con burbujas (apoptosis); `gluco` su glucocáliz. */
export function Endo({ x = 0, y = 0, w = 220, h = 70, o = 1, r = 0, activa = 0, muere = 0, wp = 0, gluco = 0, sem = 1 }: { x?: number; y?: number; w?: number; h?: number; o?: number; r?: number; activa?: number; muere?: number; wp?: number; gluco?: number; sem?: number }) {
  const a = clamp(activa), m = clamp(muere);
  const c0 = mezcla(mezcla('#D9304C', '#C2185A', a), '#8E7A86', m * 0.7);
  const c1 = mezcla(mezcla('#FF7480', '#FF4F86', a), '#C9B5BF', m * 0.7);
  const W = w * (1 - 0.3 * m), H = h * (1 - 0.15 * m);
  const domo = (ww: number, hh: number) => `M${-ww / 2},0 A${ww / 2},${hh} 0 0 1 ${ww / 2},0 Z`;
  return (
    <En x={x} y={y} o={o} r={r}>
      {gluco > 0.01 && Array.from({ length: Math.max(5, Math.round(W / 18)) }, (_, i) => {
        const nG = Math.max(5, Math.round(W / 18));
        const th = Math.PI * (1.08 + (i / (nG - 1)) * 0.84);
        const px = (W / 2) * Math.cos(th), py = H * Math.sin(th);
        const nx = Math.cos(th) * 0.5, ny = -1;
        const L = (24 + hash(i, sem + 3) * 22) * tramo(gluco, (i / nG) * 0.5, (i / nG) * 0.5 + 0.5);
        if (L < 1) return null;
        const ex = px + nx * L, ey = py + ny * L;
        return (
          <g key={i}>
            <path d={`M${px},${py} Q${px + nx * L * 0.5 + (hash(i, sem) - 0.5) * 10},${py + ny * L * 0.5} ${ex},${ey}`} fill="none" stroke="#2FAF7E" strokeWidth={3} strokeLinecap="round" />
            {[0.4, 0.7, 1].map((f, j) => <circle key={j} cx={px + nx * L * f} cy={py + ny * L * f} r={j === 2 ? 4.5 : 3.5} fill={j % 2 ? '#2CB6A8' : '#7BE3A4'} />)}
          </g>
        );
      })}
      <path d={domo(W, H)} fill={c0} />
      <path d={domo(W - 10, H - 7)} fill={c1} transform="translate(-3,-3)" />
      {Array.from({ length: 7 }, (_, i) => { const xx = -W * 0.4 + i * W * 0.133; return <circle key={i} cx={xx} cy={cupula(W - 10, H - 7, xx) + 6} r={3.4} fill={c0} opacity={0.6} />; })}
      <rect x={-W * 0.36} y={-H * 0.34} width={W * 0.11} height={9} rx={4.5} fill="#C2305A" />
      <path d={`M${-W * 0.35},${-H * 0.34 + 4.5} l${W * 0.09},0`} stroke="#FF9AAE" strokeWidth={2} strokeDasharray="3 3" />
      <rect x={W * 0.25} y={-H * 0.3} width={W * 0.1} height={9} rx={4.5} fill="#C2305A" />
      <path d={`M${-W * 0.24},${-H * 0.6} q${W * 0.05},-8 ${W * 0.1},0 M${W * 0.14},${-H * 0.6} q${W * 0.05},-8 ${W * 0.1},0`} fill="none" stroke="#C2305A" strokeWidth={2.6} strokeLinecap="round" opacity={0.8} />
      <ellipse cx={0} cy={-H * 0.4} rx={W * 0.19} ry={H * 0.27} fill="#6B1238" />
      <ellipse cx={-W * 0.01} cy={-H * 0.42} rx={W * 0.16} ry={H * 0.22} fill={mezcla('#93285A', '#B83F7A', a)} />
      {[[-0.07, -0.42], [0.05, -0.36], [0.08, -0.48], [-0.02, -0.3]].map(([fx, fy], i) => <circle key={i} cx={W * fx} cy={H * fy} r={2.6} fill="#4A0A26" />)}
      <circle cx={-W * 0.04} cy={-H * 0.46} r={4.2} fill="#3A0620" />
      {wp > 0.01 && [-0.3, 0.32, 0.18].map((fx, i) => <WP key={i} x={W * fx} y={-H * 0.55} k={0.42} o={tramo(wp, i * 0.2, 0.5 + i * 0.2)} r={-10 + i * 12} />)}
      {m > 0.01 && Array.from({ length: 5 }, (_, i) => { const xx = (-0.32 + i * 0.16) * W; return <circle key={i} cx={xx} cy={cupula(W, H, xx) - 5 * m} r={7 * m} fill={c1} />; })}
      <path d={`M${-W * 0.36},${cupula(W, H, -W * 0.36) + 8} Q${-W * 0.26},${-H * 0.92} ${-W * 0.06},${-H * 0.94}`} fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    </En>
  );
}

/** Unión entre dos células: dientes alternos (uniones estrechas y cadherina VE).
 *  `cierre` 0 → abierta, 1 → cerrada como una cremallera. */
export function Union({ x, y, h = 50, cierre = 1, o = 1 }: { x: number; y: number; h?: number; cierre?: number; o?: number }) {
  const s = (1 - clamp(cierre)) * 12;
  return (
    <En x={x} y={y} o={o}>
      {Array.from({ length: 4 }, (_, j) => (
        <g key={j}>
          <rect x={-12 - s} y={-h * 0.2 - j * 12} width={14} height={6} rx={3} fill="#5A1E9E" />
          <rect x={-2 + s} y={-h * 0.2 - j * 12 - 6} width={14} height={6} rx={3} fill="#E0338A" />
        </g>
      ))}
    </En>
  );
}

/** Membrana basal: banda con la malla de colágeno IV y laminina. `p` la despliega. */
export function Basal({ x0, x1, y, p = 1, h = 22, color = '#E7A93A' }: { x0: number; x1: number; y: number; p?: number; h?: number; color?: string }) {
  if (p <= 0.002) return null;
  const w = (x1 - x0) * easeOut(clamp(p));
  const n = Math.floor(w / 26);
  return (
    <g>
      <rect x={x0} y={y} width={w} height={h} rx={h / 2} fill={color} />
      <path d={Array.from({ length: n }, (_, i) => `${i ? 'L' : 'M'}${x0 + i * 26},${y + (i % 2 ? h * 0.25 : h * 0.75)}`).join(' ')} fill="none" stroke="#B86A0A" strokeWidth={2.4} opacity={0.7} />
      <path d={Array.from({ length: n }, (_, i) => `${i ? 'L' : 'M'}${x0 + i * 26 + 13},${y + (i % 2 ? h * 0.75 : h * 0.25)}`).join(' ')} fill="none" stroke="#FFE08A" strokeWidth={2} opacity={0.8} />
    </g>
  );
}

/** Intersticio bajo la pared: tejido claro con fibras de colágeno. */
export function Intersticio({ y, alto = 1000, sem = 2, o = 1, x0 = -200, x1 = 1800 }: { y: number; alto?: number; sem?: number; o?: number; x0?: number; x1?: number }) {
  return (
    <g opacity={o}>
      <rect x={x0} y={y} width={x1 - x0} height={alto - y + 200} fill="#F6CFE0" opacity={0.55} />
      {Array.from({ length: 7 }, (_, i) => {
        const yy = y + 40 + i * ((alto - y - 40) / 7), xx = x0 + hash(i, sem) * Math.min(300, (x1 - x0) * 0.2), L = x1 - xx;
        return <path key={i} d={`M${xx},${yy} C${xx + L * 0.27},${yy - 30} ${xx + L * 0.53},${yy + 40} ${x1},${yy}`} fill="none" stroke="#F2C98A" strokeWidth={7} strokeLinecap="round" opacity={0.55} />;
      })}
    </g>
  );
}

/** Luz del vaso: banda granate con glóbulos rojos que fluyen. */
export function Luz({ y0, y1, reloj = 0, n = 9, o = 1 }: { y0: number; y1: number; reloj?: number; n?: number; o?: number }) {
  return (
    <g opacity={o}>
      <rect x={-200} y={y0} width={2000} height={y1 - y0} fill={V.pared[1]} />
      <rect x={-200} y={y0} width={2000} height={(y1 - y0) * 0.22} fill={V.pared[0]} opacity={0.5} />
      {Array.from({ length: n }, (_, i) => <Hematie key={i} x={((hash(i, 21) * 1900 + reloj * (0.07 + hash(i, 22) * 0.03)) % 1900) - 150} y={y0 + 40 + hash(i, 23) * (y1 - y0 - 140)} k={0.7} lado={0.8} r={hash(i, 24) * 30 - 15} />)}
    </g>
  );
}

/** Pericito: célula alargada con prolongaciones que abrazan el capilar. */
export function Pericito({ x, y, w = 520, p = 1 }: { x: number; y: number; w?: number; p?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  const L = (w / 2) * q;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.3)}>
      <path d={`M${-L},-6 C${-L * 0.5},10 ${-60},18 0,18 C60,18 ${L * 0.5},10 ${L},-6 L${L},6 C${L * 0.5},28 60,40 0,40 C-60,40 ${-L * 0.5},28 ${-L},6 Z`} fill="#6A3BC8" />
      <ellipse cx={0} cy={26} rx={70} ry={24} fill="#7A45E6" />
      <ellipse cx={-4} cy={22} rx={60} ry={18} fill="#9C6BF0" />
      <ellipse cx={0} cy={25} rx={30} ry={11} fill="#3B1A80" /><circle cx={-6} cy={22} r={4} fill="#B79BFF" />
    </En>
  );
}

// ─── Moléculas ────────────────────────────────────────────────────────────────

/** Óxido nítrico: N azul y O rojo unidos. */
export function NO({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}><circle cx={-6} r={9} fill="#2F6FD8" /><circle cx={7} r={8} fill="#F2546B" /><circle cx={-9} cy={-3} r={2.6} fill="#CFE0FF" /></En>;
}

/** Prostaciclina: anillo con dos colas. */
export function PGI2({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-14,-10 L-6,-16 L4,-12 L4,-2 L-8,2 Z" fill="#0FA3A0" />
      <path d="M4,-12 L22,-18 M4,-2 L20,8 L32,4" fill="none" stroke="#16B9BE" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={22} cy={-18} r={3.5} fill="#7FEDE8" /><circle cx={32} cy={4} r={3.5} fill="#7FEDE8" />
    </En>
  );
}

/** Enzima con forma de «boca» (trombina, plasmina): `abre` 0–1. */
export function Enzima({ x = 0, y = 0, k = 1, o = 1, r = 0, tono = V.c5a, abre = 0.5 }: { x?: number; y?: number; k?: number; o?: number; r?: number; tono?: string[]; abre?: number }) {
  const a = 18 + 26 * clamp(abre);
  const arco = (R: number) => `M0,0 L${R * Math.cos((a * Math.PI) / 180)},${-R * Math.sin((a * Math.PI) / 180)} A${R},${R} 0 1 0 ${R * Math.cos((a * Math.PI) / 180)},${R * Math.sin((a * Math.PI) / 180)} Z`;
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={arco(22)} fill={tono[0]} />
      <path d={arco(18)} fill={tono[1]} transform="translate(-2,-2)" />
      <circle cx={-8} cy={-9} r={3.5} fill={tono[2]} />
    </En>
  );
}

/** Proteína de membrana en tallo con dominios en cuentas (ICAM-1, VCAM-1, trombomodulina).
 *  Sale de la membrana hacia −y; `p` la despliega. */
export function Tallo({ x = 0, y = 0, n = 5, color = '#3FB6E8', claro = '#A3E3F7', p = 1, r = 0, k = 1 }: { x?: number; y?: number; n?: number; color?: string; claro?: string; p?: number; r?: number; k?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return (
    <En x={x} y={y} r={r} k={k}>
      <rect x={-2.5} y={-6} width={5} height={12} rx={2.5} fill={color} />
      {Array.from({ length: n }, (_, i) => <g key={i} opacity={tramo(p, i / n * 0.6, i / n * 0.6 + 0.4)}><ellipse cx={i % 2 ? 2 : -2} cy={-12 - i * 13 * q} rx={7} ry={7.5} fill={color} /><circle cx={(i % 2 ? 2 : -2) - 2} cy={-14 - i * 13 * q} r={2.4} fill={claro} /></g>)}
    </En>
  );
}

/** Selectina: tallo con cabeza de lectina (P-selectina verde, E-selectina turquesa). */
export function Selectina({ x = 0, y = 0, color = '#23B26C', p = 1, r = 0, k = 1 }: { x?: number; y?: number; color?: string; p?: number; r?: number; k?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return (
    <En x={x} y={y} r={r} k={k} o={tramo(p, 0, 0.3)}>
      <path d={`M0,0 C-4,${-10 * q} 4,${-20 * q} 0,${-30 * q}`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
      {[0.35, 0.65].map((f) => <circle key={f} cx={0} cy={-30 * q * f} r={4} fill={color} />)}
      <path d={`M-9,${-30 * q - 2} A9,9 0 1 1 9,${-30 * q - 2} Z`} fill={color} />
      <circle cx={-3} cy={-30 * q - 7} r={2.6} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Factor de von Willebrand: multímero en cadena que se despliega (`largo` 0–1). */
export function VWF({ x = 0, y = 0, largo = 1, r = 0, sem = 1 }: { x?: number; y?: number; largo?: number; r?: number; sem?: number }) {
  if (largo <= 0.002) return null;
  const n = Math.max(1, Math.round(14 * clamp(largo)));
  const pts = Array.from({ length: n }, (_, i) => [Math.sin(i * 0.8 + sem) * 10, -i * 16] as const);
  return (
    <En x={x} y={y} r={r}>
      <path d={pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a},${b}`).join(' ')} fill="none" stroke="#C99300" strokeWidth={3} />
      {pts.map(([a, b], i) => <g key={i}><circle cx={a} cy={b} r={6} fill={i % 3 ? '#FFD23F' : '#F5A623'} /><circle cx={a - 2} cy={b - 2} r={2} fill="#FFF7C2" /></g>)}
    </En>
  );
}

/** Cuerpo de Weibel-Palade: bastón con túbulos de vWF y P-selectina en su membrana. */
export function WP({ x = 0, y = 0, k = 1, o = 1, r = 0, abre = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number; abre?: number }) {
  const a = clamp(abre);
  return (
    <En x={x} y={y} k={k} o={o * (1 - 0.8 * tramo(a, 0.6, 1))} r={r}>
      <rect x={-40 * (1 - 0.4 * a)} y={-12} width={80 * (1 - 0.4 * a)} height={24} rx={12} fill="#4B1FA0" />
      {[-6, 0, 6].map((d) => <path key={d} d={`M${-30 * (1 - 0.4 * a)},${d} L${30 * (1 - 0.4 * a)},${d}`} stroke="#FFD23F" strokeWidth={2.4} strokeLinecap="round" opacity={0.9} />)}
      {[-26, 0, 26].map((d) => <circle key={d} cx={d * (1 - 0.4 * a)} cy={-14} r={4} fill="#3BE35C" />)}
    </En>
  );
}

/** Receptor de siete hélices (H1 de histamina, PAR de trombina) en la membrana. `on` lo enciende. */
export function Receptor7({ x = 0, y = 0, on = 0, k = 1 }: { x?: number; y?: number; on?: number; k?: number }) {
  const c = mezcla('#9C8BD6', '#FFB21E', on);
  return (
    <En x={x} y={y} k={k}>
      <path d="M-24,4 C-24,-22 -16,-22 -16,4 C-16,22 -8,22 -8,-4 C-8,-22 0,-22 0,4 C0,22 8,22 8,-4 C8,-22 16,-22 16,4 C16,22 24,22 24,-4" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />
      {on > 0.01 && <circle cx={0} cy={-26} r={30 * on} fill="#FFD23F" opacity={0.25 * on} />}
    </En>
  );
}

/** Histamina: anillo de imidazol con su cola. */
export function Histamina({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d="M-10,-9 L0,-15 L10,-9 L7,3 L-7,3 Z" fill="#F5A623" />
      <path d="M7,3 L14,14 L24,12" fill="none" stroke="#F5A623" strokeWidth={4} strokeLinecap="round" />
      <circle cx={24} cy={12} r={4} fill="#2F6FD8" /><circle cx={-3} cy={-8} r={2.6} fill="#FFE7A0" />
    </En>
  );
}

/** TNF: trímero de tres cuñas. */
export function Tnf({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      {[0, 120, 240].map((a) => <path key={a} d="M0,0 L-9,-20 Q0,-26 9,-20 Z" fill={a ? '#E5324C' : '#B51D3B'} transform={`rotate(${a})`} />)}
      <circle r={4} fill="#FFC2BE" />
    </En>
  );
}

/** IL-1: glóbulo en trébol. */
export function Il1({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}>{[0, 120, 240].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8} cy={Math.sin((a * Math.PI) / 180) * 8} r={9} fill={a ? '#FF8A2B' : '#D9560F'} />)}<circle cx={-3} cy={-3} r={3} fill="#FFC58A" /></En>;
}

/** NF-κB: dímero p65–p50. */
export function Nfkb({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return <En x={x} y={y} k={k} o={o}><ellipse cx={-9} rx={11} ry={8} fill="#2CB6A8" /><ellipse cx={9} rx={11} ry={8} fill="#0A7F86" /><circle cx={-12} cy={-3} r={2.6} fill="#B7F5EE" /></En>;
}

/** Factor tisular: proteína de membrana de dos dominios. */
export function FT({ x = 0, y = 0, p = 1, k = 1 }: { x?: number; y?: number; p?: number; k?: number }) {
  if (p <= 0.002) return null;
  const q = easeOut(clamp(p));
  return <En x={x} y={y} k={k} o={tramo(p, 0, 0.3)}><rect x={-3} y={-14 * q} width={6} height={14 * q} fill="#C46A00" /><ellipse cx={0} cy={-20 * q} rx={9} ry={7} fill="#FF9F1C" /><ellipse cx={7} cy={-30 * q} rx={8} ry={6} fill="#FFB84D" /></En>;
}

/** Plaqueta activada: estrella con seudópodos. */
export function PlaqAct({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return <En x={x} y={y} k={k} o={o} r={r}><path d={PLAQ_ACT[0]} fill="#5B3CC4" /><path d={PLAQ_ACT[1]} fill="#8460E8" /><circle cx={-6} cy={2} r={5} fill="#EBD8FF" /><circle cx={6} cy={-4} r={4} fill="#B39BFF" /></En>;
}
const PLAQ_ACT = [blob(14, 30, 0.5, 9), blob(14, 25, 0.5, 9)];

/** Fibrina: haz de hebras amarillas; `rota` las parte en trozos. */
export function Fibrina({ x = 0, y = 0, w = 300, rota = 0, o = 1 }: { x?: number; y?: number; w?: number; rota?: number; o?: number }) {
  const q = clamp(rota);
  return (
    <En x={x} y={y} o={o}>
      {Array.from({ length: 5 }, (_, i) => Array.from({ length: 4 }, (_, j) => {
        const x0 = -w / 2 + j * (w / 4), dx = (hash(i * 4 + j, 3) - 0.5) * 40 * q, dy = (hash(i * 4 + j, 4) - 0.5) * 50 * q;
        return <path key={`${i}${j}`} d={`M${x0 + dx},${-30 + i * 15 + dy} l${w / 4 - 8 * q * 2},${(i % 2 ? 8 : -8)}`} stroke={i % 2 ? '#FFD23F' : '#F5B800'} strokeWidth={5} strokeLinecap="round" opacity={1 - 0.4 * q} />;
      }))}
    </En>
  );
}

const huso = (rx: number, ry: number) => `M${-rx},0 Q${-rx * 0.4},${-ry * 1.3} 0,${-ry} Q${rx * 0.4},${-ry * 1.3} ${rx},0 Q${rx * 0.4},${ry * 1.3} 0,${ry} Q${-rx * 0.4},${ry * 1.3} ${-rx},0 Z`;

/** Célula muscular lisa: huso; `relaja` la alarga y afina. */
export function Liso({ x = 0, y = 0, relaja = 0, r = 0 }: { x?: number; y?: number; relaja?: number; r?: number }) {
  const q = clamp(relaja);
  return (
    <En x={x} y={y} r={r}>
      <path d={huso(lerp(76, 98, q), lerp(24, 16, q))} fill="#B2416F" />
      <path d={huso(lerp(70, 92, q), lerp(19, 12, q))} fill="#DA6E9C" transform="translate(-3,-3)" />
      <ellipse rx={lerp(24, 32, q)} ry={lerp(7, 5, q)} fill="#7A1F4E" />
      <path d={`M${-lerp(46, 62, q)},-6 Q0,${-lerp(16, 11, q)} ${lerp(30, 40, q)},-8`} fill="none" stroke="#F5B3CF" strokeWidth={3} strokeLinecap="round" />
    </En>
  );
}

/** Cadena de azúcar (heparán sulfato) sobre la membrana, hacia −y. */
export function Heparan({ x = 0, y = 0, p = 1, n = 6 }: { x?: number; y?: number; p?: number; n?: number }) {
  if (p <= 0.002) return null;
  return (
    <En x={x} y={y}>
      {Array.from({ length: n }, (_, i) => <g key={i} opacity={tramo(p, i / n * 0.6, i / n * 0.6 + 0.4)}><rect x={(i % 2 ? 2 : -10)} y={-16 - i * 13} width={10} height={10} rx={3} fill={i % 2 ? '#E0338A' : '#F07BB4'} transform={`rotate(45 ${(i % 2 ? 7 : -5)} ${-11 - i * 13})`} /></g>)}
    </En>
  );
}

/** Antitrombina: media luna azul que abraza a la trombina. */
export function Antitrombina({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  return <En x={x} y={y} k={k} o={o} r={r}><path d="M-26,-6 A26,26 0 1 0 26,-6 L16,-6 A16,16 0 1 1 -16,-6 Z" fill="#2F6FD8" /><path d="M-22,0 A22,22 0 0 0 -4,20" fill="none" stroke="#7DB2FF" strokeWidth={4} strokeLinecap="round" /></En>;
}

/** Tijera enzimática (t-PA): dos hojas. `corta` las cierra. */
export function Tijera({ x = 0, y = 0, k = 1, o = 1, corta = 0, color = '#0C9E9A' }: { x?: number; y?: number; k?: number; o?: number; corta?: number; color?: string }) {
  const a = lerp(28, 4, clamp(corta));
  return (
    <En x={x} y={y} k={k} o={o}>
      {[-1, 1].map((s) => <g key={s} transform={`rotate(${s * a})`}><path d="M0,0 L34,-5 Q38,0 34,5 Z" fill={color} /><circle cx={-10} cy={s * 4} r={7} fill="none" stroke={color} strokeWidth={4} /></g>)}
      <circle r={3.5} fill="#FFF" />
    </En>
  );
}

/** Etiqueta mínima: chip de color con texto blanco (sin punta), para nombrar una molécula. */
export function Chip({ x, y, txt, color, p = 1, t = 20 }: { x: number; y: number; txt: string; color: string; p?: number; t?: number }) {
  if (p <= 0.002) return null;
  const w = txt.length * t * 0.56 + t * 0.9, h = t * 1.6;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.5)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} />
      <text dy="0.35em" textAnchor="middle" fill="#FFF" style={{ fontSize: t, fontWeight: 700 }}>{txt}</text>
    </En>
  );
}

/** Partícula que viaja de a a b con un pequeño vaivén. */
export function Viaja({ a, b, q, children, onda = 14, sem = 1 }: { a: [number, number]; b: [number, number]; q: number; children: ReactNode; onda?: number; sem?: number }) {
  if (q <= 0.002) return null;
  const e = easeOut(clamp(q));
  return <En x={lerp(a[0], b[0], e) + Math.sin(e * 6 + sem) * onda * (1 - e)} y={lerp(a[1], b[1], e)} o={tramo(q, 0, 0.15)}>{children}</En>;
}
