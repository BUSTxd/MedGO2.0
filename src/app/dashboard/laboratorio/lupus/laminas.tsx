'use client';
// Piezas comunes de las láminas del laboratorio «Lupus»: utilidades de
// animación (los parámetros llegan del motor en 0–1) y los iconos de órganos y
// síntomas, en una caja de 100 × 100 centrada.

import type { ReactNode } from 'react';
import { Organo, esPieza } from './Anatomia';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

export type T = Record<string, number>;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const tramo = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeBack = (t: number) => { const c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const v = (t: T, k: string) => t[k] ?? 0;
/** Trazo que se dibuja de 0 a 1 (con `pathLength={1}`). */
/** Contorno de un globo de texto centrado en (0,0). `cola` es hacia dónde apunta y
 *  `off` la corre a lo largo de su lado, para señalar justo a lo que habla. */
export type Cola = 'arriba' | 'abajo' | 'izq' | 'der' | null;
export function trazoGlobo(w: number, h: number, cola: Cola = null, off = 0, r = 20, n = 13, l = 16) {
  const a = w / 2, b = h / 2;
  return [
    `M${-a + r},${-b}`,
    cola === 'arriba' ? `H${off - n} L${off},${-b - l} L${off + n},${-b}` : '',
    `H${a - r} A${r},${r} 0 0 1 ${a},${-b + r}`,
    cola === 'der' ? `V${off - n} L${a + l},${off} L${a},${off + n}` : '',
    `V${b - r} A${r},${r} 0 0 1 ${a - r},${b}`,
    cola === 'abajo' ? `H${off + n} L${off},${b + l} L${off - n},${b}` : '',
    `H${-a + r} A${r},${r} 0 0 1 ${-a},${b - r}`,
    cola === 'izq' ? `V${off + n} L${-a - l},${off} L${-a},${off - n}` : '',
    `V${-b + r} A${r},${r} 0 0 1 ${-a + r},${-b} Z`,
  ].join(' ');
}

/** Globo de texto con sombra oscura: el mensaje de las láminas. Sin desenfoque: la
 *  sombra es el mismo trazo, corrido. Se ve igual en los dos temas. */
export function Globo({ x, y, w, h = 60, txt, k = 1, cola = null, off = 0, tono = 'normal', chico = false, icono, colorIcono }: {
  x: number; y: number; w: number; h?: number; txt: string; k?: number; cola?: Cola; off?: number;
  tono?: 'normal' | 'alerta' | 'calma'; chico?: boolean; icono?: ReactNode; colorIcono?: string;
}) {
  if (k <= 0.001) return null;
  const d = trazoGlobo(w, h, cola, off);
  const q = clamp(k);
  return (
    <g opacity={q} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(q)})`}>
      <path d={d} transform="translate(6,8)" className={s.globoSombra} />
      <path d={d} className={tono === 'alerta' ? s.globoAlerta : tono === 'calma' ? s.globoCalma : s.globoCuerpo} />
      <text x={icono ? 22 : 0} dy="0.35em" textAnchor="middle" className={`${chico ? s.globoTxtChico : s.globoTxt} ${tono === 'alerta' ? s.globoTxtAlerta : tono === 'calma' ? s.globoTxtCalma : ''}`}>{txt}</text>
      {icono && (
        <g transform={`translate(${-w / 2 + 12},0)`}>
          <circle r={34} fill={colorIcono ?? '#3A4256'} stroke="#FFF" strokeWidth={3.5} />
          {icono}
        </g>
      )}
    </g>
  );
}

type P = { x: number; y: number };
/** Flecha suave: una curva cuyo cuerpo engorda de la salida a la punta, que es
 *  redondeada. Es una forma rellena, no un trazo: por eso no se ve rígida. `k` es
 *  cuánto va dibujada, para que crezca desde su salida. */
export function FlechaSuave({ a, c, b, k = 1, color, grosor = 6.5, opacity = 1 }: { a: P; c: P; b: P; k?: number; color: string; grosor?: number; opacity?: number }) {
  if (k <= 0.001) return null;
  const en = (t: number): P => ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
  const L = Math.hypot(c.x - a.x, c.y - a.y) + Math.hypot(b.x - c.x, b.y - c.y);
  const tope = clamp(1 - 13 / Math.max(30, L)) * clamp(k);
  const izq: string[] = [], der: string[] = [];
  const N = 22;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * tope, p = en(t), e = 0.001;
    const q = en(Math.min(1, t + e)), o = en(Math.max(0, t - e));
    const dx = q.x - o.x, dy = q.y - o.y, m = Math.hypot(dx, dy) || 1;
    const w = (lerpFlecha(0.9, grosor, Math.pow(i / N, 0.75))) / 2;
    izq.push(`${(p.x - (dy / m) * w).toFixed(1)},${(p.y + (dx / m) * w).toFixed(1)}`);
    der.unshift(`${(p.x + (dy / m) * w).toFixed(1)},${(p.y - (dx / m) * w).toFixed(1)}`);
  }
  const fin = en(tope), casi = en(Math.max(0, tope - 0.02));
  const ang = (Math.atan2(fin.y - casi.y, fin.x - casi.x) * 180) / Math.PI;
  const h = clamp((k - 0.75) / 0.25);
  return (
    <g opacity={opacity}>
      <path d={`M${izq.join(' L')} L${der.join(' L')} Z`} fill={color} stroke={color} strokeWidth={0.8} strokeLinejoin="round" />
      {h > 0 && (
        <path d="M17,0 C11,2.5 4,7.5 -5,11.5 C-2.5,5 -2.5,-5 -5,-11.5 C4,-7.5 11,-2.5 17,0 Z" fill={color} stroke={color} strokeWidth={2.2} strokeLinejoin="round" transform={`translate(${fin.x.toFixed(1)},${fin.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${h.toFixed(3)})`} />
      )}
    </g>
  );
}
const lerpFlecha = (x: number, y: number, t: number) => x + (y - x) * t;

export const dibujar = (k: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - clamp(k) });

// ─── Iconos de órganos y síntomas (caja de 100 × 100 centrada) ────────────────

export type Icono = 'rinon' | 'corazon' | 'pulmon' | 'cerebro' | 'articulacion' | 'sangre' | 'piel' | 'fiebre' | 'cara' | 'orina';

export const COLOR_ICONO: Record<Icono, string> = {
  rinon: '#B5475A', corazon: '#E0526E', pulmon: '#E58AA2', cerebro: '#A07BD6', articulacion: '#D9881E',
  sangre: '#D33A44', piel: '#D99A7A', fiebre: '#E5484D', cara: '#E0526E', orina: '#D9B42E',
};

export function IconoOrgano({ i, x, y, k = 1, color }: { i: Icono; x: number; y: number; k?: number; color?: string }) {
  const c = color ?? COLOR_ICONO[i];
  if (esPieza(i)) return <g transform={`translate(${x},${y}) scale(${k})`}><Organo i={i} /></g>;
  let cuerpo: ReactNode;
  switch (i) {
    case 'piel':
      // Piel en corte: epidermis, dermis con un capilar y un folículo.
      cuerpo = (
        <g>
          <rect x={-44} y={-34} width={88} height={70} rx={9} fill="#EBC9B4" />
          <path d="M-44,-14 C-30,-10 -24,-18 -10,-14 C2,-10 10,-18 24,-14 C32,-12 38,-14 44,-16 L44,-34 L-44,-34 Z" fill="#F4DCCB" />
          <path d="M-44,-27 C-20,-30 20,-24 44,-28" fill="none" stroke="#D9B39C" strokeWidth={1.6} />
          <path d="M-44,-14 C-30,-10 -24,-18 -10,-14 C2,-10 10,-18 24,-14 C32,-12 38,-14 44,-16" fill="none" stroke={c} strokeWidth={2} />
          <path d="M-32,30 C-30,12 -22,4 -14,4 C-6,4 -4,16 -6,30" fill="none" stroke="#C25A52" strokeWidth={3} strokeLinecap="round" />
          <path d="M16,-34 L18,-46 M18,-16 C14,0 14,12 20,20 C26,14 26,0 22,-16" fill="none" stroke="#7A5240" strokeWidth={2.4} strokeLinecap="round" />
          <circle cx={20} cy={20} r={4.4} fill="#A87C64" />
          <rect x={-44} y={-34} width={88} height={70} rx={9} fill="none" stroke="#C9A08A" strokeWidth={1.4} />
        </g>
      );
      break;
    case 'fiebre':
      cuerpo = (
        <g>
          <path d="M-9,-36 A9,9 0 0 1 9,-36 L9,10 A17,17 0 1 1 -9,10 Z" fill="#F3F6F9" stroke="#8E9AAC" strokeWidth={2} />
          <rect x={-4} y={-22} width={8} height={40} rx={3} fill={c} />
          <circle cy={24} r={12.5} fill={c} />
          <circle cx={-4} cy={20} r={3.4} fill="#fff" opacity={0.55} />
          <path d="M-5,-34 L-5,4" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
          <path d="M14,-32 L24,-32 M14,-20 L21,-20 M14,-8 L24,-8 M14,4 L21,4" stroke="#6E7A8C" strokeWidth={2.2} strokeLinecap="round" />
        </g>
      );
      break;
    case 'cara':
      cuerpo = (
        <g clipPath="url(#an-c-disco)">
          <g transform="scale(0.17) translate(0,-500)">
            <Retrato id="ic" />
            <ellipse cx={-70} cy={548} rx={62} ry={36} fill="url(#lp-malar)" transform="rotate(-14 -70 548)" />
            <ellipse cx={70} cy={548} rx={62} ry={36} fill="url(#lp-malar)" transform="rotate(14 70 548)" />
            <ellipse cx={0} cy={530} rx={20} ry={24} fill="url(#lp-malar)" />
          </g>
        </g>
      );
      break;
    case 'orina':
      // Tubo de muestra con la orina y la espuma de la proteinuria.
      cuerpo = (
        <g>
          <path d="M-20,-34 L-20,28 A20,14 0 0 0 20,28 L20,-34" fill="#FBFCFD" fillOpacity={0.5} stroke="#8E9AAC" strokeWidth={2.2} />
          <path d="M-18,-10 L-18,28 A18,12 0 0 0 18,28 L18,-10 Z" fill={c} />
          <path d="M-10,-6 L-10,28" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.42} />
          {[[-13, -14, 6], [-3, -17, 7.5], [8, -15, 6.5], [14, -11, 4.6], [-8, -9, 5], [4, -9, 5.4]].map(([cx, cy, r], j) => <circle key={j} cx={cx} cy={cy} r={r} fill="#FFFDF4" stroke="#D9C78A" strokeWidth={0.9} />)}
          <rect x={-24} y={-40} width={48} height={8} rx={3} fill="#9AA6B8" />
        </g>
      );
      break;
  }
  return <g transform={`translate(${x},${y}) scale(${k})`}>{cuerpo}</g>;
}

