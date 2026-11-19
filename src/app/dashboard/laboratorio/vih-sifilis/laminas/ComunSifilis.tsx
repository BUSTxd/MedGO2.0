'use client';
// Piezas que comparten las láminas de la sífilis (capítulos 15 a 20): lesiones de piel, exudado, dolor, mano y arteria en corte.

import type { ReactNode } from 'react';
import { P, Sale, clamp } from '../Piezas';

/** Una úlcera vista de frente: borde, fondo limpio y brillo. `dura` engruesa el borde (la base indurada del chancro). */
export const Ulcera = ({ x = 0, y = 0, k = 1, dura = 0, fondo = '#F9C9D2', o = 1 }: { x?: number; y?: number; k?: number; dura?: number; fondo?: string; o?: number }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <ellipse rx={120 + 16 * dura} ry={98 + 13 * dura} fill="#E04A6E" />
    <ellipse rx={98} ry={80} fill="#B5183F" />
    <ellipse cx={-3} cy={4} rx={80} ry={62} fill={fondo} />
    <path d="M-70,-30 Q-40,-60 6,-62" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
  </g>
);

/** Un parche de piel (sombra, tono y brillo) sobre el que se dibuja una lesión. */
export const Parche = ({ x, y, rx, ry, o = 1 }: { x: number; y: number; rx: number; ry: number; o?: number }) => (
  <g opacity={o}>
    <ellipse cx={x + 8} cy={y + 12} rx={rx} ry={ry} fill={P.sombra} />
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={P.piel2[0]} />
    <ellipse cx={x - 4} cy={y - 6} rx={rx - 12} ry={ry - 12} fill={P.piel2[1]} />
    <path d={`M${x - rx * 0.62},${y - ry * 0.46} Q${x - rx * 0.4},${y - ry * 0.8} ${x},${y - ry * 0.86}`} fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.22} />
  </g>
);

/** Una gota de exudado (amarilla, con brillo); sus hijos se dibujan dentro. */
export const Gota = ({ x, y, k = 1, o = 1, children }: { x: number; y: number; k?: number; o?: number; children?: ReactNode }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <path d="M0,-70 C34,-26 52,0 52,30 C52,60 28,80 0,80 C-28,80 -52,60 -52,30 C-52,0 -34,-26 0,-70 Z" fill="#E0A800" />
    <path d="M0,-64 C30,-24 46,0 46,28 C46,54 25,72 0,72 C-25,72 -46,54 -46,28 C-46,0 -30,-24 0,-64 Z" fill="#FFE27A" />
    <path d="M-30,10 Q-34,34 -20,52" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
    {children}
  </g>
);

/** El icono del dolor: un círculo rojo con un rayo blanco. */
export const Dolor = ({ x, y, p, k = 1 }: { x: number; y: number; p: number; k?: number }) => (
  <Sale p={p} x={x} y={y} k={k}>
    <circle cx={3} cy={4} r={28} fill={P.sombra} /><circle r={28} fill="#C0143C" /><circle cx={-1.5} cy={-1.5} r={25} fill="#F2456A" />
    <path d="M7,-17 L-9,3 L1,3 L-7,18 L11,-4 L1,-4 Z" fill="#FFF" />
  </Sale>
);

/** Una gota de sudor o de humedad, azul claro. */
export const Sudor = ({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <path d="M0,-18 C10,-5 15,3 15,10 C15,19 8,24 0,24 C-8,24 -15,19 -15,10 C-15,3 -10,-5 0,-18 Z" fill="#2FA8E0" />
    <path d="M0,-14 C8,-4 12,3 12,9 C12,16 6,20 0,20 C-6,20 -12,16 -12,9 C-12,3 -8,-4 0,-14 Z" fill="#7FD6F8" />
    <path d="M-6,6 Q-7,13 -2,16" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" opacity={0.8} />
  </g>
);

/** Una palma abierta, de frente; `puntos` 0-1 la llena de lesiones cobrizas. */
export const Palma = ({ x = 0, y = 0, k = 1, o = 1, puntos = 0, r = 0 }: { x?: number; y?: number; k?: number; o?: number; puntos?: number; r?: number }) => {
  const DEDOS: [number, number, number, number][] = [[-52, -62, 24, 88], [-18, -92, 24, 106], [18, -96, 24, 110], [52, -76, 24, 94]];
  const PTS: [number, number][] = [[-30, -10], [8, 14], [34, -18], [-6, -52], [-34, 30], [30, 38]];
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`} opacity={o}>
      <ellipse cx={8} cy={14} rx={86} ry={96} fill={P.sombra} />
      {DEDOS.map(([dx, dy, w, h], i) => <rect key={i} x={dx - w / 2} y={dy - h / 2} width={w} height={h} rx={w / 2} fill={P.piel2[0]} />)}
      <rect x={-72} y={-50} width={144} height={140} rx={58} fill={P.piel2[0]} />
      <path d="M-70,24 C-108,6 -114,-38 -94,-56 C-80,-44 -70,-20 -58,0 Z" fill={P.piel2[0]} />
      {DEDOS.map(([dx, dy, w, h], i) => <rect key={`a${i}`} x={dx - w / 2 + 2} y={dy - h / 2 + 2} width={w - 6} height={h - 8} rx={(w - 6) / 2} fill={P.piel2[1]} />)}
      <rect x={-66} y={-44} width={132} height={128} rx={54} fill={P.piel2[1]} />
      {PTS.map(([px, py], i) => <circle key={i} cx={px} cy={py} r={9 * clamp(puntos * 2 - i * 0.18)} fill="#B8602A" />)}
    </g>
  );
};

/** Una arteria pequeña en corte: pared, íntima y luz (`luz` 1: abierta; cerca de 0: casi cerrada). */
export const VasoCorte = ({ x = 0, y = 0, r = 60, luz = 1, o = 1 }: { x?: number; y?: number; r?: number; luz?: number; o?: number }) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <circle r={r} fill="#8A1030" /><circle r={r * 0.82} fill="#FF9AA0" />
    <circle r={Math.max(2, r * 0.64 * luz)} fill="#E5324C" />
    <circle cx={-r * 0.16} cy={-r * 0.16} r={Math.max(1, r * 0.2 * luz)} fill="#FF7A7F" opacity={0.8} />
  </g>
);

/** Grumos de floculación de una tarjeta de RPR (posiciones y radios sobre un círculo de 60). */
const GRUMOS_RPR: [number, number, number][] = [[-30, -20, 8], [-12, 12, 6], [18, -26, 9], [30, 8, 7], [-2, -4, 10], [-34, 30, 6], [26, 34, 8], [8, 28, 5], [-20, -40, 6], [38, -12, 6], [-42, 4, 5], [14, 4, 6]];

/** Una tarjeta de prueba no treponémica: un círculo blanco que se llena de grumos morados cuando flocula (`flocula` 0-1). */
export const TarjetaRpr = ({ x, y, r = 74, flocula = 1, o = 1 }: { x: number; y: number; r?: number; flocula?: number; o?: number }) => {
  const n = Math.round(GRUMOS_RPR.length * clamp(flocula));
  return (
    <g transform={`translate(${x},${y}) scale(${r / 74})`} opacity={o}>
      <circle cx={4} cy={6} r={74} fill={P.sombra} /><circle r={74} fill="#E4DAF8" /><circle r={60} fill="#FFF" />
      {GRUMOS_RPR.slice(0, n).map(([gx, gy, gr], i) => <circle key={i} cx={gx} cy={gy} r={gr} fill="#5A22A8" opacity={0.85} />)}
    </g>
  );
};
