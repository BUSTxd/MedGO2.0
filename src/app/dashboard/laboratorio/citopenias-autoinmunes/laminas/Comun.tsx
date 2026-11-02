'use client';
// Combinaciones que se repiten en las láminas: un glóbulo rojo marcado, una fila
// de diez, una cruz, una barra de nivel y un trozo de membrana.

import { memo, type ReactNode } from 'react';
import { C, En, Esfera, Hematie, IgG, Plaqueta, Txt, clamp, easeOut, enBorde, lerp, tramo } from '../Piezas';

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/** Posición de un viaje de A a B con progreso `q`. */
export const viaje = (a: [number, number], b: [number, number], q: number) => {
  const e = ease(clamp(q));
  return { x: lerp(a[0], b[0], e), y: lerp(a[1], b[1], e) };
};
export const FLECHA = 'var(--cit-flecha)';

/** Glóbulo rojo con `n` anticuerpos que se van pegando (`p`), con el Fc hacia afuera. */
export function HematieIg({ x = 0, y = 0, k = 1, n = 5, p = 1, o = 1, esfera = 0, c3b = 0, ang0 = -70 }: { x?: number; y?: number; k?: number; n?: number; p?: number; o?: number; esfera?: number; c3b?: number; ang0?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: n }, (_, i) => {
        const q = tramo(p, i / (n + 1), (i + 1) / (n + 1) + 0.25);
        if (q <= 0) return null;
        const b = enBorde(0, 0, 40 + 34 * (1 - easeOut(q)), ang0 + (i * 360) / n);
        return <IgG key={i} x={b.x} y={b.y} r={b.r} k={0.8} o={tramo(q, 0, 0.4)} />;
      })}
      <Hematie esfera={esfera} />
      {c3b > 0 && [40, 150, 265].map((a, i) => {
        const q = tramo(c3b, i * 0.2, 0.5 + i * 0.2);
        const b = enBorde(0, 0, 37, a);
        return q > 0 ? <En key={a} x={b.x} y={b.y} k={easeOut(q)}><Esfera R={11} /></En> : null;
      })}
    </En>
  );
}

/** Glóbulo rojo con esferas de C3b en la membrana. */
export function HematieC3b({ x = 0, y = 0, k = 1, c = 1, o = 1, r = 0 }: { x?: number; y?: number; k?: number; c?: number; o?: number; r?: number }) {
  return <En x={x} y={y} k={k} o={o} r={r}><HematieIg n={0} c3b={c} /></En>;
}

/** Plaqueta con anticuerpos en la membrana. */
export function PlaquetaIg({ x = 0, y = 0, k = 1, p = 1, o = 1, n = 4 }: { x?: number; y?: number; k?: number; p?: number; o?: number; n?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {Array.from({ length: n }, (_, i) => {
        const q = tramo(p, i / (n + 1), (i + 1) / (n + 1) + 0.25);
        if (q <= 0) return null;
        const b = enBorde(0, 0, 28 + 30 * (1 - easeOut(q)), -60 + (i * 360) / n);
        return <IgG key={i} x={b.x} y={b.y} r={b.r} k={0.72} o={tramo(q, 0, 0.4)} />;
      })}
      <Plaqueta />
    </En>
  );
}

/** Diez bolitas en dos filas, con las primeras `n` encendidas. Para «7 de cada 10». */
export function Diez({ x, y, n, p = 1, color = C.rojo, k = 1 }: { x: number; y: number; n: number; p?: number; color?: string[]; k?: number }) {
  return (
    <En x={x} y={y} k={k}>
      {Array.from({ length: 10 }, (_, i) => {
        const q = tramo(p, i * 0.06, 0.25 + i * 0.06);
        if (q <= 0) return null;
        const on = i < n;
        return (
          <En key={i} x={(i % 5) * 68 - 136} y={(i >= 5 ? 34 : -34)} k={0.55 + 0.45 * easeOut(q)} o={q}>
            <circle r={27} fill={on ? color[0] : '#9AA8B8'} />
            <circle cx={-2} cy={-2} r={23} fill={on ? color[1] : '#BAC6D2'} />
            <path d="M-14,-6 Q-10,-15 -1,-16" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={on ? 0.85 : 0.5} />
          </En>
        );
      })}
    </En>
  );
}

/** Cruz redondeada: «esto no sirve». */
export const Cruz = memo(function Cruz({ x = 0, y = 0, k = 1, p = 1 }: { x?: number; y?: number; k?: number; p?: number }) {
  if (p <= 0.002) return null;
  return (
    <En x={x} y={y} k={k * easeOut(clamp(p))} o={tramo(p, 0, 0.3)}>
      <rect x={-66} y={-11} width={132} height={22} rx={11} fill="#D61F3C" transform="rotate(45)" />
      <rect x={-66} y={-11} width={132} height={22} rx={11} fill="#F04A62" transform="rotate(-45)" />
    </En>
  );
});

/** Marca verde: «funciona». */
export const Visto = memo(function Visto({ x = 0, y = 0, k = 1, p = 1 }: { x?: number; y?: number; k?: number; p?: number }) {
  if (p <= 0.002) return null;
  return (
    <En x={x} y={y} k={k * easeOut(clamp(p))} o={tramo(p, 0, 0.3)}>
      <circle r={40} fill={C.verde[0]} /><circle cx={-2} cy={-3} r={35} fill={C.verde[1]} />
      <path d="M-17,1 L-4,15 L19,-12" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </En>
  );
});

/** Barra de nivel horizontal con su nombre. */
export function Barra({ x, y, w = 340, h = 40, val, color = C.rojo[1], txt, p = 1, valor }: { x: number; y: number; w?: number; h?: number; val: number; color?: string; txt?: string; p?: number; valor?: string }) {
  if (p <= 0.002) return null;
  return (
    <En x={x} y={y} o={tramo(p, 0, 0.5)}>
      {txt && <Txt x={0} y={-h / 2 - 22} txt={txt} t={27} ancla="start" />}
      <rect x={0} y={-h / 2} width={w} height={h} rx={h / 2} fill="#9AA8B8" opacity={0.28} />
      <rect x={0} y={-h / 2} width={Math.max(h, w * clamp(val) * clamp(p * 1.4))} height={h} rx={h / 2} fill={color} />
      <rect x={h * 0.4} y={-h / 2 + 7} width={Math.max(0, w * clamp(val) * clamp(p * 1.4) - h * 0.8)} height={6} rx={3} fill="#FFF" opacity={0.5} />
      {valor && <Txt x={w + 20} y={0} txt={valor} t={30} ancla="start" />}
    </En>
  );
}

/** Tramo de membrana del glóbulo rojo, plano. */
export const Membrana = memo(function Membrana({ x = 0, y = 0, w = 1400, h = 90 }: { x?: number; y?: number; w?: number; h?: number }) {
  return (
    <En x={x} y={y}>
      <rect x={-w / 2} y={0} width={w} height={h * 2.4} rx={28} fill={C.rojo[0]} />
      <rect x={-w / 2} y={7} width={w} height={h * 2.3} rx={24} fill={C.rojo[1]} />
      <rect x={-w / 2 + 40} y={22} width={w * 0.5} height={9} rx={4.5} fill={C.rojo[3]} opacity={0.75} />
    </En>
  );
});

/** Copo de nieve: el frío. */
export const Copo = memo(function Copo({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <rect x={-5} y={-58} width={10} height={58} rx={5} fill="#3F9BE8" />
          <path d="M0,-38 L-14,-52 M0,-38 L14,-52" stroke="#6FC3F5" strokeWidth={7} strokeLinecap="round" />
        </g>
      ))}
      <circle r={11} fill="#BFE6FB" />
    </En>
  );
});

/** Llama: lo que enciende. */
export const Llama = memo(function Llama({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d="M0,-74 C28,-38 58,-16 54,24 C50,60 24,76 0,76 C-26,76 -54,58 -54,22 C-54,-6 -32,-22 -24,-46 C-14,-34 -8,-24 -6,-14 C4,-30 6,-52 0,-74 Z" fill="#EE5A24" />
      <path d="M0,-16 C14,4 30,16 28,36 C26,58 12,66 0,66 C-14,66 -28,56 -28,36 C-28,20 -8,8 0,-16 Z" fill="#FFC02E" />
    </En>
  );
});

/** Batería con carga `val`: el cansancio. */
export function Bateria({ x = 0, y = 0, k = 1, o = 1, val = 1 }: { x?: number; y?: number; k?: number; o?: number; val?: number }) {
  const col = val > 0.5 ? C.verde[1] : val > 0.25 ? C.c3b[1] : C.rojo[1];
  return (
    <En x={x} y={y} k={k} o={o}>
      <rect x={-76} y={-38} width={144} height={76} rx={15} fill="#5B6C80" />
      <rect x={68} y={-16} width={13} height={32} rx={5} fill="#5B6C80" />
      <rect x={-66} y={-28} width={124} height={56} rx={8} fill="#EAF2F8" />
      <rect x={-61} y={-23} width={114 * clamp(val)} height={46} rx={5} fill={col} />
    </En>
  );
}

/** Vesícula con cálculos. */
export const Vesicula = memo(function Vesicula({ x = 0, y = 0, k = 1, o = 1 }: { x?: number; y?: number; k?: number; o?: number }) {
  const d = 'M-30,-74 C-14,-82 16,-82 26,-70 C48,-30 58,20 44,52 C28,84 -30,84 -46,50 C-60,18 -46,-40 -30,-74 Z';
  return (
    <En x={x} y={y} k={k} o={o}>
      <path d={d} fill="#2F7A3F" /><path d={d} fill="#5CB85C" transform="translate(-2,-2) scale(0.9)" />
      {[[-14, 28, 15], [14, 40, 12], [12, 8, 11], [-16, -4, 9]].map(([cx, cy, R], i) => <circle key={i} cx={cx} cy={cy} r={R} fill={i % 2 ? '#FFE18A' : '#F2B531'} />)}
    </En>
  );
});

/** Antígeno: una protuberancia con tallo sobre una membrana; apunta hacia −y. */
export function Antigeno({ x = 0, y = 0, k = 1, o = 1, color = C.verde, r = 0 }: { x?: number; y?: number; k?: number; o?: number; color?: string[]; r?: number }) {
  return (
    <En x={x} y={y} k={k} o={o} r={r}>
      <rect x={-5} y={-30} width={10} height={32} rx={5} fill={color[0]} />
      <circle cy={-38} r={17} fill={color[1]} />
      <circle cx={-5} cy={-43} r={5} fill={color[2]} />
    </En>
  );
}

/** Círculo real de zoom (una lente): solo para lo que de verdad se amplía. */
export function Lente({ x, y, R, id, children, o = 1 }: { x: number; y: number; R: number; id: string; children: ReactNode; o?: number }) {
  return (
    <En x={x} y={y} o={o}>
      <clipPath id={`lente-${id}`}><circle r={R} /></clipPath>
      <circle r={R + 12} fill="#2B3A52" />
      <circle r={R} fill="#F1F8FB" />
      <g clipPath={`url(#lente-${id})`}>{children}</g>
    </En>
  );
}

