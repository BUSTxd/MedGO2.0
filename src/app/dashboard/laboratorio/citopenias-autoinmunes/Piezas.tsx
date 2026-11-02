'use client';
// Piezas del laboratorio «Citopenias autoinmunes», en el estilo que pidió BUST
// (infografía plana): cada objeto son capas planas de 2 o 3 tonos del mismo color,
// sin contorno y sin `filter`, con toques de luz blancos y gruesos. Los rótulos son
// rectángulos de color sólido con texto blanco. Todo se dibuja en un lienzo de
// 1600 × 1000; los colores son saturados y valen en los dos temas.

import { createContext, memo, useContext, type ReactNode } from 'react';
import s from '@/styles/citopenias.module.css';

export type T = Record<string, number>;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeBack = (t: number) => { const c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const hash = (i: number, sem = 0) => { const x = Math.sin(i * 127.1 + sem * 311.7) * 43758.5453; return x - Math.floor(x); };

export const C = {
  rojo: ['#B51D3B', '#E5324C', '#FF7A7F', '#FFC2BE'],
  plaq: ['#5B3CC4', '#8460E8', '#B39BFF', '#EBD8FF'],
  igg: ['#174BB8', '#2E78F2', '#7DB2FF'],
  igm: ['#07808F', '#10BCC4', '#6DEBE2'],
  c3b: ['#E98A0C', '#FFC02E', '#FFE78F'],
  c1: ['#D9560F', '#FF8A2B', '#FFC58A'],
  mac: ['#2A2F9E', '#4553E0', '#8E9BFF'],
  verde: ['#11804F', '#23B26C', '#7BE3A4'],
  lila: ['#6B5AA8', '#9C8BD6', '#CFC4F2'],
  ambar: ['#B8741A', '#E5A32E', '#F7D683'],
  bazo: ['#8E2352', '#BF3B6F', '#E6749A', '#F6B2C6'],
  higado: ['#7E2A1E', '#A8432E', '#CC6A4E', '#E9A689'],
  piel: ['#D99C7A', '#F0BE9B', '#F9D8BE'],
  hueso: ['#D8C39A', '#F2E4C4', '#FBF4E2'],
};

// ─── Utilidades de dibujo ─────────────────────────────────────────────────────

/** Coloca a los hijos en (x, y), con giro `r`, escala `k` y opacidad `o`. */
export function En({ x = 0, y = 0, r = 0, k = 1, o = 1, children }: { x?: number; y?: number; r?: number; k?: number; o?: number; children: ReactNode }) {
  if (o <= 0.002 || k <= 0.002) return null;
  return <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})${r ? ` rotate(${r.toFixed(1)})` : ''}${k !== 1 ? ` scale(${k.toFixed(3)})` : ''}`} opacity={o < 1 ? o : undefined}>{children}</g>;
}

/** Aparece creciendo desde 0, con un rebote breve. */
export function Sale({ p, x = 0, y = 0, r = 0, k = 1, children }: { p: number; x?: number; y?: number; r?: number; k?: number; children: ReactNode }) {
  if (p <= 0.002) return null;
  return <En x={x} y={y} r={r} k={k * (0.55 + 0.45 * easeBack(clamp(p)))} o={tramo(p, 0, 0.45)}>{children}</En>;
}

/** Curva cerrada y suave por puntos (radios por ángulo). `amp` y `sem`: lo orgánica que sale. */
export function blob(n: number, rad: number, amp: number, sem: number, fr = 1): string {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, r = rad * (1 + amp * (hash(i, sem) - 0.5) * 2);
    return [Math.cos(a) * r * fr, Math.sin(a) * r];
  });
  let d = '';
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    d += i === 0 ? `M${mx.toFixed(1)},${my.toFixed(1)}` : ` Q${x1.toFixed(1)},${y1.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
  }
  const [x0, y0] = pts[0], [x1, y1] = pts[1];
  return `${d} Q${x0.toFixed(1)},${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)},${((y0 + y1) / 2).toFixed(1)} Z`;
}

/** Punto de la membrana de un círculo y giro para que una pieza con su eje +y mire hacia afuera. */
export const enBorde = (cx: number, cy: number, R: number, ang: number) => {
  const a = (ang * Math.PI) / 180;
  return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, r: ang - 90 };
};

/** Flecha redondeada y gruesa; `p` es cuánto va dibujada. */
export function Flecha({ a, b, c, p = 1, color = '#3D5A80', w = 9, cabeza = true }: { a: [number, number]; b: [number, number]; c?: [number, number]; p?: number; color?: string; w?: number; cabeza?: boolean }) {
  if (p <= 0.003) return null;
  const q = clamp(p);
  const cc = c ?? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const en = (t: number) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * cc[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * cc[1] + t * t * b[1]];
  const n = 18;
  let d = `M${a[0]},${a[1]}`;
  for (let i = 1; i <= n; i++) { const [x, y] = en((i / n) * q); d += ` L${x.toFixed(1)},${y.toFixed(1)}`; }
  const [xf, yf] = en(q), [xp, yp] = en(Math.max(0, q - 0.03));
  const ang = (Math.atan2(yf - yp, xf - xp) * 180) / Math.PI;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      {cabeza && <path d={`M${w * 2.4},0 L${-w * 0.8},${-w * 1.7} Q${-w * 0.1},0 ${-w * 0.8},${w * 1.7} Z`} fill={color} stroke={color} strokeWidth={w * 0.3} strokeLinejoin="round" transform={`translate(${xf.toFixed(1)},${yf.toFixed(1)}) rotate(${ang.toFixed(1)})`} />}
    </g>
  );
}

// ─── Rótulos ──────────────────────────────────────────────────────────────────

/** En teléfono vertical el lienzo se ve pequeño: los textos crecen con este factor. */
export const TxCtx = createContext(1);

/** Rótulo de la referencia: rectángulo de color sólido con texto blanco en negrita. */
export function Rotulo({ x, y, txt, color = '#2E78F2', p = 1, t = 30, sobre, colorSobre }: { x: number; y: number; txt: string; color?: string; p?: number; t?: number; sobre?: string; colorSobre?: string }) {
  const tx = useContext(TxCtx);
  if (p <= 0.002) return null;
  const w = txt.length * t * 0.575 + t * 1.3, h = t * 1.85;
  // Con la letra más grande del teléfono, que no se salga del lienzo.
  const media = (w * tx) / 2 + 8;
  const xx = media * 2 < 1600 ? Math.min(1600 - media, Math.max(media, x)) : 800;
  return (
    <En x={xx} y={y} k={tx * (0.86 + 0.14 * easeBack(clamp(p)))} o={tramo(p, 0, 0.5)}>
      {sobre && <text y={-h / 2 - 12} textAnchor="middle" className={s.sobre} style={{ fill: colorSobre ?? color, fontSize: t * 0.8 }}>{sobre}</text>}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={color} />
      <text dy="0.35em" textAnchor="middle" className={s.rotulo} style={{ fontSize: t }}>{txt}</text>
    </En>
  );
}

/** Texto suelto sin caja: palabra de apoyo o cifra grande. */
export function Txt({ x, y, txt, t = 30, color, p = 1, fuerte = true, ancla = 'middle' }: { x: number; y: number; txt: string; t?: number; color?: string; p?: number; fuerte?: boolean; ancla?: 'start' | 'middle' | 'end' }) {
  const tx = useContext(TxCtx);
  if (p <= 0.002) return null;
  const media = (txt.length * t * 0.27 * tx) + 8;
  const xx = ancla === 'middle' && media * 2 < 1600 ? Math.min(1600 - media, Math.max(media, x)) : x;
  return (
    <En x={xx} y={y} k={tx} o={tramo(p, 0, 0.6)}>
      <text dy="0.35em" textAnchor={ancla} className={fuerte ? s.txtFuerte : s.txt} style={{ fontSize: t, fill: color }}>{txt}</text>
    </En>
  );
}

// ─── Moléculas ────────────────────────────────────────────────────────────────

/** Anticuerpo en Y. Los Fab tocan en (0,0) y el Fc se va hacia +y. */
export const IgG = memo(function IgG({ x = 0, y = 0, r = 0, k = 1, o = 1, tono = C.igg }: { x?: number; y?: number; r?: number; k?: number; o?: number; tono?: string[] }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <rect x={-6.5} y={18} width={13} height={25} rx={6} fill={tono[0]} />
      <rect x={-6.5} y={-6} width={13} height={29} rx={6.5} fill={tono[1]} transform="translate(0,21) rotate(-33) translate(0,-21)" />
      <rect x={-6.5} y={-6} width={13} height={29} rx={6.5} fill={tono[1]} transform="translate(0,21) rotate(33) translate(0,-21)" />
      <rect x={-2.8} y={0} width={5.6} height={15} rx={2.8} fill={tono[2]} transform="translate(0,21) rotate(-33) translate(0,-21)" />
      <circle cy={21} r={6.4} fill={tono[2]} />
    </En>
  );
});

/** IgM pentamérica: cinco brazos en estrella, en turquesa. */
export const IgM = memo(function IgM({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <rect x={-5.5} y={-34} width={11} height={34} rx={5.5} fill={C.igm[0]} />
          <rect x={-5} y={-54} width={10} height={28} rx={5} fill={C.igm[1]} transform="translate(0,-34) rotate(-30) translate(0,34)" />
          <rect x={-5} y={-54} width={10} height={28} rx={5} fill={C.igm[1]} transform="translate(0,-34) rotate(30) translate(0,34)" />
        </g>
      ))}
      <circle r={11} fill={C.igm[2]} />
      <circle cx={-3} cy={-3} r={4} fill="#FFF" opacity={0.75} />
    </En>
  );
});

export const Esfera = memo(function Esfera({ x = 0, y = 0, R = 12, tono = C.c3b, o = 1 }: { x?: number; y?: number; R?: number; tono?: string[]; o?: number }) {
  return (
    <En x={x} y={y} o={o}>
      <circle r={R} fill={tono[0]} />
      <circle cx={-R * 0.1} cy={-R * 0.1} r={R * 0.82} fill={tono[1]} />
      <circle cx={-R * 0.32} cy={-R * 0.32} r={R * 0.28} fill={tono[2]} />
    </En>
  );
});

/** Complejo de ataque a la membrana: un barril azul, visto de lado. */
export const MAC = memo(function MAC({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <rect x={-17} y={-22} width={34} height={44} rx={7} fill={C.mac[0]} />
      {[-11, -3.6, 3.6, 11].map((d) => <rect key={d} x={d - 2.6} y={-20} width={5.2} height={40} rx={2.6} fill={C.mac[1]} />)}
      <ellipse cy={-21} rx={16} ry={6} fill={C.mac[2]} />
      <ellipse cy={-21} rx={8} ry={3} fill={C.mac[0]} />
    </En>
  );
});

/** C1, con sus seis cabezas en ramillete. */
export const C1 = memo(function C1({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {[-48, -29, -10, 10, 29, 48].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <rect x={-2.4} y={-26} width={4.8} height={26} rx={2.4} fill={C.c1[0]} />
          <circle cy={-30} r={6.5} fill={C.c1[1]} />
          <circle cx={-1.5} cy={-31.5} r={2.2} fill={C.c1[2]} />
        </g>
      ))}
      <circle r={7} fill={C.c1[0]} />
    </En>
  );
});

// ─── Células de la sangre ─────────────────────────────────────────────────────

/** Glóbulo rojo visto de frente. `esfera`: 0 disco bicóncavo → 1 esferocito. */
export const Hematie = memo(function Hematie({ x = 0, y = 0, r = 0, k = 1, o = 1, esfera = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; esfera?: number }) {
  const e = clamp(esfera);
  const kk = lerp(1, 0.8, e);
  return (
    <En x={x} y={y} r={r} k={k * kk} o={o}>
      <ellipse rx={46} ry={44} fill={C.rojo[0]} />
      <ellipse cx={-1} cy={-2} rx={41} ry={39} fill={C.rojo[1]} />
      {e < 0.98 && <ellipse cx={1} cy={2} rx={22 * (1 - e)} ry={20 * (1 - e)} fill={C.rojo[2]} />}
      {e < 0.98 && <ellipse cx={3} cy={4} rx={13 * (1 - e)} ry={11 * (1 - e)} fill={C.rojo[3]} opacity={0.8} />}
      <path d="M-30,-13 Q-23,-29 -5,-31" fill="none" stroke="#FFF" strokeWidth={6.5} strokeLinecap="round" opacity={0.85} />
      {e > 0.02 && <circle cx={-14} cy={-14} r={9 * e} fill={C.rojo[2]} />}
    </En>
  );
});

/** Glóbulo rojo que estalla: `p` de 0 a 1. */
export function HematieRoto({ x = 0, y = 0, k = 1, p }: { x?: number; y?: number; k?: number; p: number }) {
  if (p <= 0) return <Hematie x={x} y={y} k={k} />;
  const q = easeOut(clamp(p));
  return (
    <En x={x} y={y} k={k}>
      <En k={1 + 0.15 * tramo(p, 0, 0.4)} o={1 - tramo(p, 0.3, 0.7)}><Hematie /></En>
      {p > 0.3 && Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2 + hash(i, 3), d = 30 + 40 * q * (0.5 + hash(i, 5) * 0.8);
        return <path key={i} d="M-11,-6 Q0,-13 11,-5 Q7,6 -3,8 Q-11,4 -11,-6Z" fill={i % 2 ? C.rojo[1] : C.rojo[2]} transform={`translate(${(Math.cos(a) * d).toFixed(1)},${(Math.sin(a) * d).toFixed(1)}) rotate(${(i * 47).toFixed(0)})`} opacity={1 - tramo(p, 0.75, 1) * 0.6} />;
      })}
    </En>
  );
}

/** Plaqueta. `gp`: glicoproteínas de la membrana. `gal` 0–1: ha perdido el ácido siálico. */
export const Plaqueta = memo(function Plaqueta({ x = 0, y = 0, r = 0, k = 1, o = 1, gp = false, gal = 0 }: { x?: number; y?: number; r?: number; k?: number; o?: number; gp?: boolean; gal?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      {gp && [20, 92, 164, 236, 308].map((a) => (
        <g key={a} transform={`rotate(${a}) translate(0,-33)`}>
          <rect x={-2.6} y={-12} width={5.2} height={14} rx={2.6} fill={C.plaq[0]} />
          <circle cy={-15} r={4.5} fill={gal > 0.5 ? C.c3b[1] : C.verde[1]} />
        </g>
      ))}
      <path d={PLAQ[0]} fill={C.plaq[0]} />
      <path d={PLAQ[1]} fill={C.plaq[1]} />
      <circle cx={-9} cy={3} r={6} fill={C.plaq[3]} /><circle cx={9} cy={8} r={4.5} fill={C.plaq[2]} /><circle cx={6} cy={-8} r={5} fill={C.plaq[3]} opacity={0.8} /><circle cx={-3} cy={13} r={3.2} fill={C.plaq[2]} />
      <path d="M-18,-10 Q-11,-20 2,-21" fill="none" stroke="#FFF" strokeWidth={4.5} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});
const PLAQ = [blob(9, 32, 0.12, 2), blob(9, 28, 0.12, 2)];

// ─── Células del sistema inmune ───────────────────────────────────────────────

const TONOS_L: Record<string, string[]> = {
  t: ['#127CB5', '#3FB6E8', '#A3E3F7', '#0B5F8F'],
  b: ['#1B3FA8', '#2F66DC', '#7FA7F5', '#14307F'],
  treg: ['#11804F', '#23B26C', '#9CEBBB', '#0B5E3A'],
  th17: ['#C2410C', '#F97316', '#FFC48A', '#94320A'],
  th1: ['#A21F6D', '#DB3A97', '#F7A8D2', '#7B1650'],
  cd8: ['#6D28D9', '#9358F0', '#CDB4FF', '#4C1D95'],
  tfh: ['#0E7490', '#14A7BF', '#8EEBF2', '#0A5468'],
  gris: ['#6E7686', '#8D95A5', '#C8CDD6', '#555C6A'],
};

/** Linfocito: esfera de anillos, como las de la referencia. */
export const Linfocito = memo(function Linfocito({ x = 0, y = 0, k = 1, o = 1, tono = 't' }: { x?: number; y?: number; k?: number; o?: number; tono?: keyof typeof TONOS_L }) {
  const c = TONOS_L[tono];
  return (
    <En x={x} y={y} k={k} o={o}>
      <circle r={58} fill={c[0]} />
      <circle cx={-3} cy={-3} r={52} fill={c[1]} />
      <circle cx={4} cy={5} r={36} fill={c[3]} />
      <circle cx={2} cy={2} r={30} fill={c[0]} />
      <circle cx={-6} cy={-7} r={13} fill={c[1]} opacity={0.75} />
      <path d="M-38,-18 Q-28,-38 -8,-42" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
      <circle cx={-44} cy={3} r={3.5} fill="#FFF" opacity={0.7} />
      {tono === 'cd8' && <><circle cx={34} cy={-26} r={7} fill={C.c3b[1]} /><circle cx={40} cy={-4} r={6} fill={C.c1[1]} /><circle cx={26} cy={35} r={6.5} fill={C.c3b[1]} /></>}
    </En>
  );
});

/** Célula plasmática: núcleo excéntrico y arcos de retículo. */
export const Plasmatica = memo(function Plasmatica({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <ellipse rx={82} ry={60} fill={C.lila[0]} />
      <ellipse cx={-3} cy={-3} rx={76} ry={54} fill={C.lila[1]} />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${12 + i * 13},-38 Q${44 + i * 13},0 ${12 + i * 13},38`} fill="none" stroke={C.lila[2]} strokeWidth={6} strokeLinecap="round" opacity={0.9} />)}
      <circle cx={-28} cy={2} r={35} fill="#4A3D84" />
      <circle cx={-31} cy={-2} r={27} fill="#6452A8" />
      <circle cx={-38} cy={-10} r={9} fill="#9C8BD6" />
      <path d="M-62,-30 Q-46,-46 -24,-48" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

const MACRO = {
  atras: 'M-112,-30 C-170,-74 -196,-120 -152,-132 C-112,-142 -82,-92 -50,-90 C-28,-146 16,-190 52,-162 C84,-138 42,-96 62,-74 C108,-104 174,-100 176,-58 C178,-22 118,-20 104,12 C152,44 186,104 148,126 C112,146 84,84 44,84 C30,132 -12,180 -50,156 C-82,136 -52,92 -76,66 C-120,94 -182,92 -184,54 C-186,18 -124,14 -112,-30 Z',
  frente: 'M-100,-34 C-146,-70 -172,-108 -140,-116 C-108,-122 -78,-76 -48,-74 C-26,-126 12,-170 42,-146 C68,-126 30,-88 54,-62 C100,-88 158,-86 160,-54 C160,-26 104,-24 92,12 C136,42 168,94 138,110 C108,126 80,70 40,70 C26,114 -10,160 -42,140 C-68,122 -42,84 -70,54 C-112,80 -168,78 -170,50 C-172,22 -112,16 -100,-34 Z',
};

/** Macrófago: seudópodos curvos, silueta oscura detrás y clara delante, zona inferior
 *  turquesa, orgánulos en círculos, núcleo violeta con brillo. Como la ameba de la referencia. */
export const Macrofago = memo(function Macrofago({ x = 0, y = 0, r = 0, k = 1, o = 1 }: { x?: number; y?: number; r?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} r={r} k={k} o={o}>
      <path d={MACRO.atras} fill="#135FAE" />
      <path d={MACRO.frente} fill="#6FD9F0" />
      <path d="M-158,48 C-120,44 -96,28 -80,14 C-30,44 34,44 88,12 C130,42 166,92 138,110 C108,126 80,70 40,70 C26,114 -10,160 -42,140 C-68,122 -42,84 -70,54 C-112,80 -168,78 -170,50 Z" fill="#23BDB6" />
      {[[-48, -22, 15, '#3F86C8'], [58, -34, 11, '#5AA9DD'], [-120, 44, 9, '#E7FBFF'], [30, 44, 13, '#1B8FA8'], [-16, 92, 10, '#E7FBFF'], [104, 74, 8, '#1B8FA8'], [8, -92, 10, '#3F86C8'], [-112, -90, 7, '#E7FBFF'], [122, -54, 7, '#E7FBFF'], [-84, 8, 8, '#5AA9DD'], [66, 16, 7, '#E7FBFF']].map(([cx, cy, R, c], i) => <circle key={i} cx={cx as number} cy={cy as number} r={R as number} fill={c as string} opacity={0.9} />)}
      <circle cx={2} cy={-6} r={40} fill="#6A2BD9" />
      <circle cx={-2} cy={-10} r={34} fill="#8B46F0" />
      <ellipse cx={-14} cy={-24} rx={14} ry={9} fill="#D9B8FF" opacity={0.9} transform="rotate(-20 -14 -24)" />
      <path d="M12,-136 Q34,-150 44,-132" fill="none" stroke="#FFF" strokeWidth={11} strokeLinecap="round" />
      <path d="M-148,-98 Q-138,-110 -126,-102" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.9} />
      <path d="M116,-72 Q136,-80 146,-64" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.9} />
    </En>
  );
});

/** Receptor Fc gamma: copa sobre un tallo; apunta hacia −y. */
export const FcR = memo(function FcR({ x = 0, y = 0, r = 0, k = 1, color = '#F2546B' }: { x?: number; y?: number; r?: number; k?: number; color?: string }) {
  return (
    <En x={x} y={y} r={r} k={k}>
      <rect x={-3.5} y={-16} width={7} height={18} rx={3.5} fill={color} />
      <path d="M-11,-27 L-11,-18 Q0,-11 11,-18 L11,-27" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </En>
  );
});

const FOLICULAR = blob(16, 70, 0.32, 9);
/** Célula dendrítica folicular: estrella gris. */
export const Folicular = memo(function Folicular({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * 360 + hash(i, 2) * 14; return <rect key={i} x={-5} y={-92 - hash(i, 3) * 18} width={10} height={60} rx={5} fill="#6E7686" transform={`rotate(${a.toFixed(0)})`} />; })}
      <path d={FOLICULAR} fill="#8D95A5" />
      <circle cx={2} cy={2} r={32} fill="#555C6A" />
      <circle cx={-6} cy={-6} r={18} fill="#6E7686" />
      <path d="M-46,-26 Q-34,-48 -12,-52" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    </En>
  );
});

const MEK = [blob(14, 150, 0.1, 6), blob(14, 138, 0.1, 6)];
/** Megacariocito: gigante, con el núcleo en lóbulos y prolongaciones de plaquetas.
 *  `prolong`: largo de las proplaquetas (0–1). */
export const Megacariocito = memo(function Megacariocito({ x = 0, y = 0, k = 1, o = 1, prolong = 1 }: { x?: number; y?: number; k?: number; o?: number; prolong?: number }) {
  const q = clamp(prolong);
  const brazos = [[-145, 62], [-98, 80], [-30, 70], [28, 88], [150, 66]];
  return (
    <En x={x} y={y} k={k} o={o}>
      {brazos.map(([a, l], i) => (
        <g key={i} transform={`rotate(${a})`}>
          <path d={`M-16,-130 Q${i % 2 ? 22 : -22},${-130 - l * q * 0.9} 0,${-140 - l * q * 1.3} Q${i % 2 ? 34 : -6},${-130 - l * q * 0.9} 16,-130 Z`} fill={C.plaq[1]} />
          {q > 0.25 && <circle cy={-146 - l * q * 1.3} r={13 * q} fill={C.plaq[2]} />}
          {q > 0.4 && <circle cy={-110 - l * q} cx={i % 2 ? 7 : -3} r={8 * q} fill={C.plaq[2]} />}
        </g>
      ))}
      <path d={MEK[0]} fill={C.plaq[0]} />
      <path d={MEK[1]} fill={C.plaq[1]} />
      {Array.from({ length: 34 }, (_, i) => {
        const a = hash(i, 8) * Math.PI * 2, d = 62 + hash(i, 9) * 66;
        return <circle key={i} cx={(Math.cos(a) * d).toFixed(1)} cy={(Math.sin(a) * d).toFixed(1)} r={2.5 + hash(i, 7) * 3.5} fill={i % 3 ? C.plaq[2] : C.plaq[3]} />;
      })}
      {[[-28, -22, 36], [24, -30, 34], [38, 18, 33], [-8, 32, 37], [-40, 22, 28]].map(([cx, cy, R], i) => <circle key={i} cx={cx} cy={cy} r={R} fill="#3F2A96" />)}
      {[[-30, -25, 26], [22, -33, 24], [36, 15, 23], [-10, 28, 27], [-42, 18, 18]].map(([cx, cy, R], i) => <circle key={i} cx={cx} cy={cy} r={R} fill="#5B3CC4" />)}
      <ellipse cx={-38} cy={-34} rx={11} ry={7} fill={C.plaq[2]} transform="rotate(-25 -38 -34)" />
      <path d="M-112,-66 Q-92,-98 -62,-112" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

/** Hepatocito hexagonal con su núcleo. */
export const Hepatocito = memo(function Hepatocito({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-120,0 L-60,-104 L60,-104 L120,0 L60,104 L-60,104 Z" fill={C.ambar[0]} stroke={C.ambar[0]} strokeWidth={16} strokeLinejoin="round" />
      <path d="M-104,-4 L-54,-92 L54,-92 L104,-4 L54,90 L-54,90 Z" fill={C.ambar[1]} stroke={C.ambar[1]} strokeWidth={10} strokeLinejoin="round" />
      {[[-62, -48, 8], [68, 34, 9], [-58, 54, 7], [60, -54, 7], [12, 72, 6], [-82, 4, 5]].map(([cx, cy, R], i) => <circle key={i} cx={cx} cy={cy} r={R} fill={C.ambar[2]} />)}
      <circle r={44} fill="#6A2BD9" /><circle cx={-3} cy={-3} r={37} fill="#8B46F0" />
      <ellipse cx={-14} cy={-17} rx={13} ry={8} fill="#D9B8FF" transform="rotate(-20 -14 -17)" />
      <path d="M-74,-74 L-44,-84" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

// ─── Órganos ──────────────────────────────────────────────────────────────────

const BAZO = 'M-250,-30 C-250,-190 -70,-280 100,-240 C250,-205 300,-70 250,70 C210,190 90,260 -30,235 C-150,210 -130,100 -180,60 C-220,35 -250,20 -250,-30 Z';
/** Bazo: capas planas y un hilio con arteria (roja) y vena (azul). Sin el corte: `corte = false`. */
export const Bazo = memo(function Bazo({ x = 0, y = 0, k = 1, o = 1, r = 0, corte = true }: { x?: number; y?: number; k?: number; o?: number; r?: number; corte?: boolean }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={BAZO} fill={C.bazo[0]} />
      <path d={BAZO} fill={C.bazo[1]} transform="translate(-4,-6) scale(0.965)" />
      {corte ? (
        <>
          <path d={BAZO} fill={C.bazo[2]} transform="translate(8,-6) scale(0.84)" />
          <path d={BAZO} fill={C.bazo[3]} transform="translate(12,-8) scale(0.72)" opacity={0.75} />
        </>
      ) : (
        <>
          <path d={BAZO} fill={C.bazo[2]} transform="translate(-30,-40) scale(0.62)" opacity={0.7} />
          <path d="M-190,-90 C-160,-170 -80,-214 10,-218" fill="none" stroke="#FFF" strokeWidth={15} strokeLinecap="round" opacity={0.75} />
        </>
      )}
    </En>
  );
});

const HIGADO = 'M-300,-60 C-250,-190 -50,-215 120,-180 C240,-155 330,-130 330,-70 C330,10 190,70 80,110 C-10,145 -140,190 -205,135 C-280,75 -335,0 -300,-60 Z';
export const Higado = memo(function Higado({ x = 0, y = 0, k = 1, o = 1, corte = true }: { x?: number; y?: number; k?: number; o?: number; corte?: boolean }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={HIGADO} fill={C.higado[0]} />
      <path d={HIGADO} fill={C.higado[1]} transform="translate(-4,-6) scale(0.965)" />
      {corte
        ? <path d={HIGADO} fill={C.higado[3]} transform="translate(-4,-8) scale(0.84)" opacity={0.85} />
        : <path d="M90,-178 C60,-90 40,-20 66,100" fill="none" stroke={C.higado[0]} strokeWidth={8} strokeLinecap="round" />}
      {!corte && <path d="M-268,-70 C-220,-155 -90,-186 30,-170" fill="none" stroke="#FFF" strokeWidth={15} strokeLinecap="round" opacity={0.6} />}
    </En>
  );
});

/** Médula ósea: hueso en corte longitudinal, con tejido rojo dentro. */
export const Medula = memo(function Medula({ x = 0, y = 0, k = 1, o = 1, w = 760, h = 330 }: { x?: number; y?: number; k?: number; o?: number; w?: number; h?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={C.hueso[0]} />
      <rect x={-w / 2 + 6} y={-h / 2 + 6} width={w - 12} height={h - 20} rx={h / 2 - 8} fill={C.hueso[1]} />
      <rect x={-w / 2 + 52} y={-h / 2 + 50} width={w - 104} height={h - 100} rx={(h - 100) / 2} fill="#C93A52" />
      <rect x={-w / 2 + 58} y={-h / 2 + 54} width={w - 116} height={h - 112} rx={(h - 112) / 2} fill="#EC6275" />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={-w / 2 + 110 + hash(i, 4) * (w - 220)} cy={-h / 2 + 88 + hash(i, 5) * (h - 176)} r={7 + hash(i, 6) * 12} fill={i % 3 ? '#F58C95' : '#FFD9A8'} opacity={0.75} />)}
      <path d={`M${-w / 2 + 70},${-h / 2 + 22} H${w / 2 - 110}`} stroke={C.hueso[2]} strokeWidth={10} strokeLinecap="round" />
    </En>
  );
});

/** Vaso en corte a lo largo. Los hijos se pintan dentro de la luz. */
export function Vaso({ x = 0, y = 0, w = 1200, h = 300, o = 1, children, reloj = 0, flujo = 0 }: { x?: number; y?: number; w?: number; h?: number; o?: number; children?: ReactNode; reloj?: number; flujo?: number }) {
  const pared = 30;
  return (
    <En x={x} y={y} o={o}>
      <rect x={-w / 2} y={-h / 2 - pared} width={w} height={h + pared * 2} rx={pared} fill="#E98C94" />
      {Array.from({ length: Math.floor(w / 112) }, (_, i) => <ellipse key={i} cx={-w / 2 + 56 + i * 112} cy={-h / 2 - pared / 2} rx={50} ry={pared / 2 - 2} fill="#F7B4B4" />)}
      {Array.from({ length: Math.floor(w / 112) }, (_, i) => <ellipse key={i} cx={-w / 2 + 56 + i * 112} cy={h / 2 + pared / 2} rx={50} ry={pared / 2 - 2} fill="#F7B4B4" />)}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#D85F6B" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.24} fill="#C9505E" />
      <rect x={-w / 2} y={h / 2 - h * 0.14} width={w} height={h * 0.14} fill="#E67A82" />
      {flujo > 0 && Array.from({ length: flujo }, (_, i) => {
        const X = ((hash(i, 11) * w + reloj * (0.05 + hash(i, 12) * 0.03)) % w) - w / 2;
        return <Hematie key={i} x={X} y={(hash(i, 13) - 0.5) * (h - 90)} r={hash(i, 14) * 90} k={0.52 + hash(i, 15) * 0.14} o={tramo(Math.min(X + w / 2, w / 2 - X), 0, 50)} />;
      })}
      {children}
    </En>
  );
}

// ─── Personas ─────────────────────────────────────────────────────────────────

const mezcla = (a: string, b: string, t: number) => {
  const h = (c: string, i: number) => parseInt(c.slice(i, i + 2), 16);
  const q = (i: number) => Math.round(lerp(h(a, i), h(b, i), t)).toString(16).padStart(2, '0');
  return `#${q(1)}${q(3)}${q(5)}`;
};

/** Busto. `palidez`: de sano a pálido, también en los labios. */
export function Persona({ x = 0, y = 0, k = 1, o = 1, quien, palidez = 0 }: { x?: number; y?: number; k?: number; o?: number; quien: 'mujer' | 'hombre'; palidez?: number }) {
  const p = clamp(palidez);
  const piel = mezcla('#EDB592', '#EFE0CF', p), sombra = mezcla('#D18F6D', '#D7C3AE', p), luz = mezcla('#F8D2B5', '#F8EFE3', p), labio = mezcla('#C4574F', '#C9A9A0', p);
  const mujer = quien === 'mujer';
  const pelo = mujer ? ['#6E6470', '#8E8590', '#B7B0B8'] : ['#B9BCC4', '#D7D9DE', '#F1F2F4'];
  const ropa = mujer ? ['#0F7F88', '#16A7AD', '#5FD6D3'] : ['#274B94', '#3568C4', '#7EA5EA'];
  return (
    <En x={x} y={y} k={k} o={o}>
      {mujer && <path d="M-126,-96 C-146,-224 -66,-296 8,-294 C96,-292 148,-214 128,-88 C126,-40 136,10 152,40 L-152,40 C-134,4 -124,-44 -126,-96 Z" fill={pelo[0]} />}
      <path d="M-226,330 C-226,196 -136,142 -64,120 L64,120 C136,142 226,196 226,330 Z" fill={ropa[1]} />
      <path d="M-226,330 C-226,250 -196,204 -158,172 C-146,230 -138,280 -136,330 Z" fill={ropa[0]} />
      <path d="M226,330 C226,250 196,204 158,172 C146,230 138,280 136,330 Z" fill={ropa[0]} />
      <path d="M-58,44 L-62,122 C-34,172 34,172 62,122 L58,44 Z" fill={sombra} />
      <path d="M-62,122 C-34,172 34,172 62,122 L78,130 C42,190 -42,190 -78,130 Z" fill={ropa[2]} />
      <circle cx={-98} cy={-34} r={22} fill={sombra} /><circle cx={98} cy={-34} r={22} fill={sombra} />
      <path d="M-100,-80 C-104,-194 -48,-236 2,-236 C54,-236 106,-194 100,-80 C100,10 62,80 2,84 C-58,80 -100,10 -100,-80 Z" fill={piel} />
      <path d="M100,-80 C100,10 62,80 2,84 C38,62 70,8 66,-80 C64,-130 50,-180 30,-226 C74,-210 104,-160 100,-80 Z" fill={sombra} opacity={0.6} />
      <ellipse cx={-52} cy={-6} rx={26} ry={17} fill={luz} opacity={0.8} />
      {/* ojos */}
      {[-40, 40].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={-52} rx={17} ry={10.5} fill="#FFF" />
          <circle cx={cx + 1} cy={-51} r={8.5} fill="#44352E" /><circle cx={cx + 3.5} cy={-54} r={2.8} fill="#FFF" />
          <path d={`M${cx - 18},-54 Q${cx},-68 ${cx + 18},-54`} fill="none" stroke={sombra} strokeWidth={6} strokeLinecap="round" />
          <path d={`M${cx - 22},-80 Q${cx},-92 ${cx + 22},-80`} fill="none" stroke={pelo[0]} strokeWidth={8} strokeLinecap="round" />
          <path d={`M${cx - 14},-38 Q${cx},-32 ${cx + 14},-38`} fill="none" stroke={sombra} strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
        </g>
      ))}
      <path d="M-4,-44 C-10,-14 -18,0 -14,8 C-8,16 8,16 14,8" fill="none" stroke={sombra} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-30,38 Q2,24 32,38 Q2,58 -30,38 Z" fill={labio} />
      {!mujer && <path d="M-46,30 Q-20,12 2,20 Q24,12 48,30 Q24,28 2,28 Q-20,28 -46,30 Z" fill={pelo[1]} />}
      {!mujer && <path d="M-34,60 Q2,72 36,60" fill="none" stroke={sombra} strokeWidth={4} strokeLinecap="round" opacity={0.5} />}
      {/* pelo, delante */}
      {mujer
        ? <>
            <path d="M-106,-92 C-112,-208 -52,-252 8,-250 C70,-250 118,-200 108,-92 C92,-130 72,-168 36,-188 C2,-152 -62,-136 -106,-92 Z" fill={pelo[1]} />
            <path d="M-72,-178 C-48,-214 -8,-230 34,-226" fill="none" stroke={pelo[2]} strokeWidth={11} strokeLinecap="round" />
          </>
        : <>
            <path d="M-106,-60 C-118,-120 -106,-150 -84,-168 C-86,-130 -92,-100 -92,-66 Z" fill={pelo[1]} />
            <path d="M106,-60 C118,-120 106,-150 84,-168 C86,-130 92,-100 92,-66 Z" fill={pelo[1]} />
            <path d="M-56,-212 C-26,-230 28,-232 58,-212" fill="none" stroke={luz} strokeWidth={11} strokeLinecap="round" opacity={0.8} />
          </>}
    </En>
  );
}

/** Pierna con petequias: `n` puntos rojos que van saliendo (`p`). */
export function Pierna({ x = 0, y = 0, k = 1, o = 1, p = 0 }: { x?: number; y?: number; k?: number; o?: number; p?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-74,-280 C-92,-120 -82,10 -62,120 C-60,150 -66,186 -74,212 C-92,240 -130,250 -150,268 C-164,286 -146,298 -118,298 L50,298 C66,298 72,282 68,262 C60,216 58,170 62,120 C92,10 98,-120 84,-280 Z" fill={C.piel[1]} />
      <path d="M84,-280 C98,-120 92,10 62,120 C58,170 60,216 68,262 C72,282 66,298 50,298 L18,298 C34,250 26,180 34,120 C60,10 60,-120 50,-280 Z" fill={C.piel[0]} />
      <path d="M-46,-250 C-58,-120 -52,-30 -36,60" fill="none" stroke={C.piel[2]} strokeWidth={15} strokeLinecap="round" />
      {Array.from({ length: 62 }, (_, i) => {
        const yy = -250 + hash(i, 21) * 460, ancho = yy < 120 ? 66 : 42;
        const q = tramo(p, i / 75, i / 75 + 0.1);
        return q > 0 ? <circle key={i} cx={(hash(i, 22) - 0.45) * ancho * 2} cy={yy} r={(2.8 + hash(i, 23) * 3.6) * q} fill={i % 4 ? '#C21F3A' : '#8C1228'} /> : null;
      })}
    </En>
  );
}

/** Mano abierta: `azul` 0–1 tiñe de la punta de los dedos hacia la palma. */
export function Mano({ x = 0, y = 0, k = 1, o = 1, azul = 0 }: { x?: number; y?: number; k?: number; o?: number; azul?: number }) {
  const q = clamp(azul);
  const dedos = [[-92, -210, -11, 200], [-30, -250, -3, 248], [34, -240, 3, 236], [96, -198, 11, 192]];
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M-128,-40 C-142,60 -120,180 -80,290 L100,290 C130,190 150,70 138,-40 Z" fill={C.piel[1]} />
      <path d="M138,-40 C150,70 130,190 100,290 L60,290 C94,170 106,60 100,-40 Z" fill={C.piel[0]} />
      <path d="M-128,70 C-200,20 -252,-54 -226,-78 C-200,-96 -156,-30 -112,6 Z" fill={C.piel[0]} />
      {dedos.map(([cx, top, rot, L], i) => (
        <g key={i} transform={`rotate(${rot} ${cx} -40)`}>
          <rect x={cx - 29} y={top} width={58} height={L + 8} rx={28} fill={C.piel[1]} />
          <rect x={cx + 8} y={top + 10} width={21} height={L - 16} rx={10} fill={C.piel[0]} />
          <rect x={cx - 29} y={top} width={58} height={L * 0.68} rx={28} fill="#3E6FC9" opacity={q * 0.55} />
          <rect x={cx - 29} y={top} width={58} height={L * 0.36} rx={28} fill="#2F4FB0" opacity={q * 0.78} />
          <rect x={cx - 17} y={top + 8} width={34} height={44} rx={15} fill={mezcla('#FBDCCB', '#A9BCEA', q)} />
          <rect x={cx - 22} y={top + L * 0.45} width={38} height={5} rx={2.5} fill={C.piel[0]} opacity={0.7} />
        </g>
      ))}
    </En>
  );
}

// ─── Objetos ──────────────────────────────────────────────────────────────────

/** Termómetro. `val`: 0 (4 °C) → 1 (37 °C). */
export function Termometro({ x = 0, y = 0, k = 1, o = 1, val = 0.5 }: { x?: number; y?: number; k?: number; o?: number; val?: number }) {
  const v = clamp(val);
  const col = mezcla('#2F8DE8', '#EB3B4F', v);
  const H = 460, h = 40 + v * (H - 70);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-36} y={-H} width={72} height={H + 30} rx={36} fill="#C9DCEA" />
      <circle cy={38} r={68} fill="#C9DCEA" />
      <rect x={-19} y={-H + 18} width={38} height={H} rx={19} fill="#F4FAFF" />
      <rect x={-19} y={-h} width={38} height={h + 30} rx={19} fill={col} />
      <circle cy={38} r={48} fill={col} />
      <circle cx={-15} cy={22} r={11} fill="#FFF" opacity={0.65} />
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((m) => <rect key={m} x={36} y={-40 - m * (H - 70)} width={22} height={6} rx={3} fill="#7F93A8" />)}
      <rect x={-12} y={-H + 26} width={7} height={H - 96} rx={3.5} fill="#FFF" opacity={0.8} />
    </En>
  );
}

/** Tubo de orina: `oscuro` 0–1. */
export function TuboOrina({ x = 0, y = 0, k = 1, o = 1, oscuro = 0 }: { x?: number; y?: number; k?: number; o?: number; oscuro?: number }) {
  const c1 = mezcla('#F7CE55', '#4A1B12', clamp(oscuro)), c2 = mezcla('#FBE186', '#6E2A1C', clamp(oscuro));
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-46} y={-170} width={92} height={330} rx={40} fill="#D6E7F2" />
      <rect x={-37} y={-96} width={74} height={248} rx={32} fill={c1} />
      <rect x={-37} y={-96} width={74} height={22} rx={10} fill={c2} />
      <rect x={-26} y={-150} width={11} height={280} rx={5.5} fill="#FFF" opacity={0.65} />
      <rect x={-58} y={-188} width={116} height={32} rx={9} fill="#7F93A8" />
      <rect x={-58} y={-188} width={116} height={12} rx={6} fill="#A9BAC9" />
    </En>
  );
}

const CORAZON = 'M0,110 C-40,70 -120,20 -120,-50 C-120,-100 -80,-120 -48,-112 C-26,-106 -8,-90 0,-72 C8,-90 26,-106 48,-112 C80,-120 120,-100 120,-50 C120,20 40,70 0,110 Z';
export const Corazon = memo(function Corazon({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-34} y={-146} width={28} height={50} rx={12} fill="#2F66DC" />
      <rect x={6} y={-160} width={32} height={66} rx={14} fill="#D9344F" />
      <path d={CORAZON} fill="#A81E3A" />
      <path d={CORAZON} fill="#DC3A52" transform="translate(-3,-4) scale(0.93)" />
      <path d="M-14,-76 C4,-30 -22,10 2,88" fill="none" stroke="#A81E3A" strokeWidth={7} strokeLinecap="round" />
      <path d="M-92,-46 Q-82,-84 -48,-90" fill="none" stroke="#FFF" strokeWidth={11} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

const CEREBRO = blob(18, 120, 0.09, 4, 1.22);
/** Cerebro; `sangra` 0–1 dibuja una mancha oscura. */
export function Cerebro({ x = 0, y = 0, k = 1, o = 1, sangra = 0 }: { x?: number; y?: number; k?: number; o?: number; sangra?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={CEREBRO} fill="#D8748C" />
      <path d={CEREBRO} fill="#F09CAC" transform="translate(-4,-5) scale(0.92)" />
      {[[-92, -38, -30], [-42, -74, 20], [22, -80, -18], [84, -44, 26], [-64, 16, 30], [4, 0, -24], [66, 28, 18], [-14, 60, 8]].map(([cx, cy, r], i) => <path key={i} d="M-34,0 Q-16,-20 0,-2 Q16,18 34,0" fill="none" stroke="#C95C78" strokeWidth={8} strokeLinecap="round" transform={`translate(${cx},${cy}) rotate(${r})`} />)}
      {sangra > 0.01 && <path d={blob(9, 34 * sangra, 0.2, 5)} fill="#7A0F24" transform="translate(50,-30)" />}
      {sangra > 0.01 && <circle cx={42} cy={-38} r={8 * sangra} fill="#B51D3B" />}
    </En>
  );
}

/** Ganglio linfático, para las causas de la forma caliente. */
export const Ganglio = memo(function Ganglio({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <ellipse rx={84} ry={62} fill="#2F7A67" /><ellipse cx={-3} cy={-3} rx={77} ry={55} fill="#4CAF92" />
      {[[-40, -14], [0, -26], [38, -8], [-16, 18], [26, 24]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={17} fill="#8BDCC2" />)}
      <path d="M-58,-22 Q-46,-40 -22,-44" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

/** Micoplasma: célula sin pared, en forma de pera. */
export const Micoplasma = memo(function Micoplasma({ x = 0, y = 0, k = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; o?: number; r?: number }) {
  const d = 'M-70,0 C-70,-40 -30,-52 8,-44 C40,-38 68,-22 104,-8 C114,-2 112,8 102,10 C68,20 40,40 4,46 C-34,52 -70,40 -70,0 Z';
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <path d={d} fill="#12804B" /><path d={d} fill="#2BB56E" transform="translate(-2,-3) scale(0.9)" />
      {[[-30, -10, 10], [-4, 14, 8], [22, -8, 6], [-38, 18, 6]].map(([cx, cy, R], i) => <circle key={i} cx={cx} cy={cy} r={R} fill="#9BEBB9" />)}
      <path d="M-52,-20 Q-40,-36 -18,-38" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
    </En>
  );
});

/** Virus con espículas, como los de la primera referencia. */
export const Virus = memo(function Virus({ x = 0, y = 0, k = 1, o = 1, tono = C.bazo }: { x?: number; y?: number; k?: number; o?: number; tono?: string[] }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} transform={`rotate(${(i / 14) * 360})`}>
          <rect x={-5} y={-74} width={10} height={24} rx={4} fill="#0F9DA8" />
          <circle cy={-78} r={9} fill={i % 2 ? '#5FE0D8' : '#2BC3C4'} />
        </g>
      ))}
      <circle r={56} fill={tono[0]} /><circle cx={-3} cy={-3} r={49} fill={tono[1]} />
      {[[-18, -22], [14, -28], [-30, 10], [0, 2], [28, 8], [-10, 32], [22, 34]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={7.5} fill="#5FE0D8" />)}
    </En>
  );
});

export const Pastilla = memo(function Pastilla({ x = 0, y = 0, k = 1, o = 1, r = 0, color = C.igm }: { x?: number; y?: number; k?: number; o?: number; r?: number; color?: string[] }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-52} y={-26} width={104} height={52} rx={26} fill={color[0]} />
      <path d="M-52,0 A26,26 0 0 1 -26,-26 H0 V22 H-26 A26,26 0 0 1 -52,0 Z" fill={color[1]} />
      <path d="M0,-22 H26 A22,22 0 0 1 48,0 A22,22 0 0 1 26,22 H0 Z" fill="#F3F6FA" />
      <path d="M-36,-10 Q-30,-16 -18,-16" fill="none" stroke="#FFF" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
    </En>
  );
});

export const Frasco = memo(function Frasco({ x = 0, y = 0, k = 1, o = 1, tono = C.ambar, r = 0 }: { x?: number; y?: number; k?: number; o?: number; tono?: string[]; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-48} y={-78} width={96} height={158} rx={18} fill={tono[0]} />
      <rect x={-41} y={-68} width={82} height={138} rx={14} fill={tono[1]} />
      <rect x={-30} y={-108} width={60} height={34} rx={8} fill="#E9EEF3" />
      <rect x={-30} y={-108} width={60} height={13} rx={6} fill="#FFF" />
      <rect x={-41} y={-18} width={82} height={52} fill="#FFF" opacity={0.9} />
      <rect x={-30} y={-6} width={60} height={7} rx={3.5} fill={tono[0]} /><rect x={-30} y={10} width={38} height={6} rx={3} fill={tono[1]} />
      <rect x={-30} y={-58} width={9} height={30} rx={4.5} fill="#FFF" opacity={0.6} />
    </En>
  );
});

export const Jeringa = memo(function Jeringa({ x = 0, y = 0, k = 1, o = 1, r = 0, liquido = '#FFC02E' }: { x?: number; y?: number; k?: number; o?: number; r?: number; liquido?: string }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-3} y={-132} width={6} height={62} rx={3} fill="#AAB6C3" />
      <rect x={-12} y={-82} width={24} height={16} rx={4} fill="#7F93A8" />
      <rect x={-30} y={-68} width={60} height={156} rx={8} fill="#DCEBF5" />
      <rect x={-24} y={-40} width={48} height={120} rx={5} fill={liquido} />
      <rect x={-20} y={-58} width={9} height={130} rx={4.5} fill="#FFF" opacity={0.65} />
      <rect x={-42} y={86} width={84} height={13} rx={6} fill="#7F93A8" />
      <rect x={-11} y={96} width={22} height={38} rx={3} fill="#A9BAC9" />
      <rect x={-25} y={132} width={50} height={11} rx={5} fill="#7F93A8" />
    </En>
  );
});

export const BolsaSangre = memo(function BolsaSangre({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-8} y={-166} width={16} height={36} rx={5} fill="#7F93A8" />
      <path d="M-86,-122 C-92,-136 -80,-142 -66,-142 L66,-142 C80,-142 92,-136 86,-122 L92,90 C92,118 70,136 44,136 L-44,136 C-70,136 -92,118 -92,90 Z" fill="#DCE9F2" />
      <path d="M-74,-74 L74,-74 L78,86 C78,108 60,122 40,122 L-40,122 C-60,122 -78,108 -78,86 Z" fill="#B51D3B" />
      <path d="M-74,-74 L74,-74 L75,-50 Q0,-30 -75,-50 Z" fill="#E5324C" />
      <rect x={-44} y={-20} width={88} height={70} rx={6} fill="#FFF" opacity={0.92} />
      <rect x={-30} y={-6} width={60} height={9} rx={4.5} fill="#E5324C" /><rect x={-30} y={14} width={38} height={7} rx={3.5} fill="#A9BAC9" />
      <rect x={-6} y={136} width={12} height={46} rx={5} fill="#B51D3B" />
      <path d="M-68,-122 L-62,70" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    </En>
  );
});

export const Guantes = memo(function Guantes({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  const d = 'M-62,84 L-68,-6 C-104,-20 -110,-56 -88,-60 C-74,-62 -62,-40 -50,-30 C-48,-60 -40,-92 -22,-92 C-4,-92 2,-64 8,-50 C22,-64 50,-84 66,-68 C76,-54 66,-14 52,8 L56,84 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={d} fill="#B23A52" /><path d={d} fill="#E5546B" transform="translate(-2,-3) scale(0.94)" />
      <rect x={-70} y={62} width={134} height={36} rx={9} fill="#F7C948" /><rect x={-70} y={62} width={134} height={13} rx={6} fill="#FFE18A" />
      <path d="M-42,-22 Q-34,-58 -24,-74" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.65} />
    </En>
  );
});

/** Tarjeta de gel del Coombs: columnas IgG, IgA, IgM, C3c, C3d y control. `pos` lleva cuánto se queda arriba cada una. */
export function TarjetaGel({ x = 0, y = 0, k = 1, o = 1, pos, marca }: { x?: number; y?: number; k?: number; o?: number; pos: number[]; marca?: string[] }) {
  const cols = marca ?? ['IgG', 'IgA', 'IgM', 'C3c', 'C3d', 'ctl'];
  const tx = useContext(TxCtx);
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-262} y={-208} width={524} height={420} rx={14} fill="#BFD3E2" />
      <rect x={-254} y={-202} width={508} height={402} rx={11} fill="#F4F9FC" />
      {cols.map((c, i) => {
        const X = -210 + i * 84, q = clamp(pos[i] ?? 0);
        return (
          <g key={c} transform={`translate(${X},0)`}>
            <path d="M-30,-182 H30 L22,-126 V32 Q22,62 0,66 Q-22,62 -22,32 V-126 Z" fill="#DCEBF5" />
            <path d="M-17,-108 H17 V30 Q17,54 0,58 Q-17,54 -17,30 Z" fill="#EFF6D4" />
            <ellipse cy={lerp(46, -94, q)} rx={lerp(13, 16, q)} ry={lerp(10, 9, q)} fill={C.rojo[1]} />
            {q > 0.3 && <ellipse cy={-94 + 22} rx={8} ry={12} fill={C.rojo[2]} opacity={q * 0.6} />}
            <rect x={-27} y={-182} width={8} height={38} rx={4} fill="#FFF" />
            <text y={118} textAnchor="middle" className={s.gelTxt} style={{ fontSize: 26 * Math.min(tx, 1.3) }}>{c}</text>
          </g>
        );
      })}
    </En>
  );
}

/** Campo de microscopio redondeado: sí es un zoom, por eso lleva círculo. */
export function Frotis({ x = 0, y = 0, R = 220, o = 1, tipo, id }: { x?: number; y?: number; R?: number; o?: number; tipo: 'esferocitos' | 'aglutinados' | 'plaquetas'; id: string }) {
  const piezas: ReactNode[] = [];
  if (tipo === 'esferocitos') {
    for (let i = 0; i < 26; i++) {
      const a = hash(i, 31) * Math.PI * 2, d = Math.sqrt(hash(i, 32)) * (R - 24);
      piezas.push(<Hematie key={i} x={Math.cos(a) * d} y={Math.sin(a) * d} k={0.5 * R / 220} r={i * 31} esfera={i % 2 ? 1 : 0} />);
    }
  } else if (tipo === 'aglutinados') {
    [[-90, -70], [80, -96], [0, 40], [-110, 90], [110, 90]].forEach(([cx, cy], c) => {
      for (let i = 0; i < 9; i++) {
        const a = hash(i + c * 20, 41) * Math.PI * 2, d = hash(i + c * 20, 42) * 40;
        piezas.push(<Hematie key={`${c}-${i}`} x={(cx + Math.cos(a) * d) * R / 220} y={(cy + Math.sin(a) * d) * R / 220} k={0.42 * R / 220} r={i * 40} />);
      }
    });
  } else {
    for (let i = 0; i < 26; i++) {
      const a = hash(i, 51) * Math.PI * 2, d = Math.sqrt(hash(i, 52)) * (R - 24);
      piezas.push(<Hematie key={i} x={Math.cos(a) * d} y={Math.sin(a) * d} k={0.5 * R / 220} r={i * 31} />);
    }
  }
  return (
    <En x={x} y={y} o={o}>
      <clipPath id={`frotis-${id}`}><circle r={R} /></clipPath>
      <circle r={R + 14} fill="#2B3A52" />
      <circle r={R} fill="#FBF3EE" />
      <g clipPath={`url(#frotis-${id})`}>{piezas}</g>
    </En>
  );
}

/** Puntos de una señal soluble que viajan de A a B: `p` es el avance del chorro. */
export function Chorro({ a, b, p, n = 12, color = C.c3b[1], R = 7, abanico = 40, sem = 1 }: { a: [number, number]; b: [number, number]; p: number; n?: number; color?: string; R?: number; abanico?: number; sem?: number }) {
  if (p <= 0.002) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const q = clamp(p * 1.5 - (i / n) * 0.5);
        if (q <= 0) return null;
        const f = easeOut(q), off = (hash(i, sem) - 0.5) * abanico * Math.sin(Math.PI * Math.min(1, q));
        // Al llegar se desvanece: lo que importa es el chorro, no un montón al final.
        return <circle key={i} cx={(lerp(a[0], b[0], f) + off).toFixed(1)} cy={(lerp(a[1], b[1], f) + (hash(i, sem + 1) - 0.5) * abanico).toFixed(1)} r={R * (0.7 + hash(i, sem + 2) * 0.5)} fill={color} opacity={1 - tramo(q, 0.82, 1)} />;
      })}
    </g>
  );
}
