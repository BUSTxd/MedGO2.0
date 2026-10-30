'use client';
// Piezas comunes de las láminas del laboratorio «Lupus»: utilidades de
// animación (los parámetros llegan del motor en 0–1) y los iconos de órganos y
// síntomas, en una caja de 100 × 100 centrada.

import type { ReactNode } from 'react';
import s from '@/styles/lupus.module.css';

export type T = Record<string, number>;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeBack = (t: number) => { const c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const v = (t: T, k: string) => t[k] ?? 0;
/** Trazo que se dibuja de 0 a 1 (con `pathLength={1}`). */
export const dibujar = (k: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - clamp(k) });

// ─── Iconos de órganos y síntomas (caja de 100 × 100 centrada) ────────────────

export type Icono = 'rinon' | 'corazon' | 'pulmon' | 'cerebro' | 'articulacion' | 'sangre' | 'piel' | 'fiebre' | 'cara' | 'orina';

export const COLOR_ICONO: Record<Icono, string> = {
  rinon: '#B5475A', corazon: '#E0526E', pulmon: '#E58AA2', cerebro: '#A07BD6', articulacion: '#D9881E',
  sangre: '#D33A44', piel: '#D99A7A', fiebre: '#E5484D', cara: '#E0526E', orina: '#D9B42E',
};

export function IconoOrgano({ i, x, y, k = 1, color }: { i: Icono; x: number; y: number; k?: number; color?: string }) {
  const c = color ?? COLOR_ICONO[i];
  let cuerpo: ReactNode;
  switch (i) {
    case 'rinon':
      cuerpo = (
        <g>
          <path d="M8,-42 C38,-46 48,-12 42,14 C36,40 10,48 -8,40 C-24,32 -16,14 -5,8 C5,2 5,-10 -7,-16 C-22,-24 -20,-38 8,-42 Z" fill={c} />
          <path d="M-5,8 C-14,4 -22,2 -32,4 M-7,-16 C-16,-14 -24,-16 -32,-20" className={s.icoLinea} />
        </g>
      );
      break;
    case 'corazon':
      cuerpo = (
        <g>
          <path d="M0,40 C-32,16 -48,-2 -42,-22 C-36,-40 -10,-42 0,-24 C10,-42 36,-40 42,-22 C48,-2 32,16 0,40 Z" fill={c} />
          <path d="M-20,-20 C-26,-12 -26,-2 -20,6" className={s.icoBrillo} />
        </g>
      );
      break;
    case 'pulmon':
      cuerpo = (
        <g>
          <path d="M-7,-34 L-7,12 C-7,32 -22,42 -36,38 C-48,34 -48,10 -42,-10 C-36,-28 -22,-38 -7,-34 Z" fill={c} />
          <path d="M7,-34 L7,12 C7,32 22,42 36,38 C48,34 48,10 42,-10 C36,-28 22,-38 7,-34 Z" fill={c} />
          <path d="M0,-46 L0,-14 M0,-14 L-14,-2 M0,-14 L14,-2" className={s.icoLinea} />
        </g>
      );
      break;
    case 'cerebro':
      cuerpo = (
        <g>
          <path d="M-42,2 C-46,-26 -22,-42 0,-38 C22,-42 46,-26 42,2 C46,24 24,38 0,34 C-24,38 -46,24 -42,2 Z" fill={c} />
          <path d="M0,-36 L0,32 M-30,-18 C-20,-12 -14,-22 -6,-14 M-34,8 C-24,2 -18,14 -8,6 M30,-18 C20,-12 14,-22 6,-14 M34,8 C24,2 18,14 8,6 M-20,24 C-14,18 -8,26 -4,20 M20,24 C14,18 8,26 4,20" className={s.icoLinea} />
        </g>
      );
      break;
    case 'articulacion':
      cuerpo = (
        <g>
          <rect x={-10} y={-48} width={20} height={38} rx={10} className={s.icoHueso} />
          <rect x={-10} y={10} width={20} height={38} rx={10} className={s.icoHueso} />
          <circle r={17} fill="none" stroke={c} strokeWidth={7} />
          <circle r={6} fill={c} />
        </g>
      );
      break;
    case 'sangre':
      cuerpo = (
        <g>
          <path d="M0,-42 C14,-20 32,-2 32,14 C32,32 17,42 0,42 C-17,42 -32,32 -32,14 C-32,-2 -14,-20 0,-42 Z" fill={c} />
          <ellipse cx={-10} cy={12} rx={6} ry={11} className={s.icoBrillo2} />
        </g>
      );
      break;
    case 'piel':
      cuerpo = (
        <g>
          <rect x={-40} y={-30} width={80} height={62} rx={10} fill="#F3D3C2" />
          <path d="M-40,-14 C-26,-22 -14,-6 0,-14 C14,-22 26,-6 40,-14 L40,-30 L-40,-30 Z" fill={c} />
          <path d="M-22,0 L-22,24 M0,-4 L0,26 M22,0 L22,24" stroke={c} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
        </g>
      );
      break;
    case 'fiebre':
      cuerpo = (
        <g>
          <rect x={-9} y={-44} width={18} height={62} rx={9} className={s.icoHueso} />
          <rect x={-4} y={-20} width={8} height={40} rx={4} fill={c} />
          <circle cy={28} r={16} fill={c} />
          <path d="M16,-34 L26,-34 M16,-22 L24,-22 M16,-10 L26,-10" className={s.icoLinea} />
        </g>
      );
      break;
    case 'cara':
      cuerpo = (
        <g>
          <circle r={40} fill="#F3D3C2" />
          <path d="M-3,-8 C-12,-14 -26,-12 -30,2 C-32,14 -20,18 -10,10 C-6,6 -3,0 -3,-8 Z M3,-8 C12,-14 26,-12 30,2 C32,14 20,18 10,10 C6,6 3,0 3,-8 Z" fill={c} opacity={0.75} />
          <circle cx={-14} cy={-16} r={3.5} className={s.icoOjo} />
          <circle cx={14} cy={-16} r={3.5} className={s.icoOjo} />
          <path d="M-12,22 Q0,30 12,22" className={s.icoLinea} />
        </g>
      );
      break;
    case 'orina':
      cuerpo = (
        <g>
          <path d="M0,-42 C14,-20 32,-2 32,14 C32,32 17,42 0,42 C-17,42 -32,32 -32,14 C-32,-2 -14,-20 0,-42 Z" fill={c} />
          {[[-10, 6, 7], [8, 0, 5], [4, 20, 8], [-12, 26, 4], [14, 16, 4]].map(([cx, cy, r], j) => <circle key={j} cx={cx} cy={cy} r={r} className={s.icoBurbuja} />)}
        </g>
      );
      break;
  }
  return <g transform={`translate(${x},${y}) scale(${k})`}>{cuerpo}</g>;
}

