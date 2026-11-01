'use client';
// Capítulo 6 («El daño, 2: tipo II y antifosfolípidos»), con el nivel de «La
// basura nuclear»: un tejido entero con estructuras que se ven, instrumentos de
// acero, vidrio y latón, y lo que enseña pasa DENTRO de la lámina.
// · `CapaSangre` (lámina `h-sangre`): un vaso en corte longitudinal de borde a
//   borde: adventicia con colágeno, grasa, vasa vasorum y nervio; media con
//   fibras lisas; lámina elástica; endotelio; y la luz con plasma amarillo paja,
//   flujo laminar y hematíes que dan vueltas a tres profundidades. La hemólisis
//   tiñe el plasma. Encima: la lupa del antígeno, las tres muertes, la firma de
//   la hemólisis y los campos del microscopio.
// · `CapaAfl` (lámina `h-vaso`, pasos 4 y 5): el vaso del capítulo 5 se reutiliza
//   tal cual y esta capa pone la lupa sobre la membrana, la balanza, el tubo con
//   el cronómetro y la ecuación final.
// · `FondoSaf` (lámina `saf`): los 100 pacientes y los tres criterios.

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ARTERIA_FINA, Tubo, VENA_FINA } from './Anatomia';
import { ComplejoNuc, DibujoCelula, Eritrocito, IgG, Leucocito, PlaquetaDet } from './Celulas';
import { clamp, dibujar, easeBack, easeInOut, easeOut, FlechaSuave, IconoOrgano, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const deg = (r: number) => (r * 180) / Math.PI;
const halo = `${s.lSubChico} ${s.conHalo}`;
const huso = (l: number, h: number) => `M${-l},0 C${-l * 0.5},${-h} ${l * 0.5},${-h} ${l},0 C${l * 0.5},${h} ${-l * 0.5},${h} ${-l},0 Z`;

// ─── Degradados ───────────────────────────────────────────────────────────────

const clase = (id: string, a: string, b: string) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className={a} /><stop offset="1" className={b} /></linearGradient>;

export const DefsSg = memo(function DefsSg() {
  const tono = (id: string, a: string, b: string) => <linearGradient key={id} id={`sg-t-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>;
  return (
    <defs>
      {tono('rojo', '#8A1E3C', '#C2385A')}{tono('azul', '#2B3652', '#46577F')}{tono('verde', '#0F5F44', '#1F9A6A')}
      {tono('ambar', '#9A5A12', '#D9881E')}{tono('morado', '#4E2A86', '#7B4FC9')}{tono('cian', '#1F5F82', '#3B87AD')}
      <linearGradient id="sg-adv" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000"><stop offset="0" className={s.sgAdv1} /><stop offset="1" className={s.sgAdv2} /></linearGradient>
      {clase('sg-med', s.sgMed1, s.sgMed2)}{clase('sg-mus', s.sgMus1, s.sgMus2)}
      {clase('sg-end', s.sgEnd1, s.sgEnd2)}{clase('sg-int', s.sgInt1, s.sgInt2)}{clase('sg-per', s.sgPer1, s.sgPer2)}
      <linearGradient id="sg-plasma" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" className={s.sgP0} /><stop offset="0.05" className={s.sgP1} /><stop offset="0.22" className={s.sgP2} /><stop offset="0.5" className={s.sgP3} />
        <stop offset="0.78" className={s.sgP2} /><stop offset="0.95" className={s.sgP1} /><stop offset="1" className={s.sgP0} />
      </linearGradient>
      <linearGradient id="sg-saf" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="1000"><stop offset="0" className={s.safA} /><stop offset="1" className={s.safB} /></linearGradient>
      <radialGradient id="sg-gra" cx="0.38" cy="0.32" r="0.8"><stop offset="0" className={s.sgGra1} /><stop offset="1" className={s.sgGra2} /></radialGradient>
      <radialGradient id="sg-lente" cx="0.42" cy="0.36" r="0.8"><stop offset="0" className={s.sgLen1} /><stop offset="1" className={s.sgLen2} /></radialGradient>
      <linearGradient id="sg-acero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EEF1F6" /><stop offset="0.45" stopColor="#A9B2C2" /><stop offset="0.7" stopColor="#D5DAE3" /><stop offset="1" stopColor="#6E7789" /></linearGradient>
      <linearGradient id="sg-laton" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8A6420" /><stop offset="0.35" stopColor="#F2D388" /><stop offset="0.65" stopColor="#D0A44A" /><stop offset="1" stopColor="#7A5618" /></linearGradient>
      <radialGradient id="sg-pomo" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFF0C4" /><stop offset="0.5" stopColor="#D8AC52" /><stop offset="1" stopColor="#6E4C14" /></radialGradient>
      <radialGradient id="sg-bola" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFF" stopOpacity="0.6" /><stop offset="0.45" stopColor="#FFF" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.3" /></radialGradient>
      <radialGradient id="sg-hem" cx="0.4" cy="0.32" r="0.8"><stop offset="0" stopColor="#F0816F" /><stop offset="1" stopColor="#A82C28" /></radialGradient>
      <linearGradient id="sg-vidrio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF" stopOpacity="0.55" /><stop offset="0.28" stopColor="#FFF" stopOpacity="0.12" /><stop offset="0.8" stopColor="#8A93A6" stopOpacity="0.12" /><stop offset="1" stopColor="#5C6577" stopOpacity="0.4" /></linearGradient>
      <linearGradient id="sg-suero" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F7C63C" /><stop offset="0.5" stopColor="#FFDF70" /><stop offset="1" stopColor="#D69A1C" /></linearGradient>
      <linearGradient id="sg-plasmaTubo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#EDBE5E" /><stop offset="0.5" stopColor="#F9DF9A" /><stop offset="1" stopColor="#C8963A" /></linearGradient>
      <linearGradient id="sg-citop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4A9A4" /><stop offset="1" stopColor="#D66F7C" /></linearGradient>
      <radialGradient id="sg-bazo" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stopColor="#B0569A" /><stop offset="1" stopColor="#551C4A" /></radialGradient>
      <radialGradient id="sg-higado" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stopColor="#C8603F" /><stop offset="1" stopColor="#6A2518" /></radialGradient>
      <radialGradient id="sg-piel" cx="0.4" cy="0.34" r="0.85"><stop offset="0" stopColor="#F8DCC8" /><stop offset="1" stopColor="#DDAE90" /></radialGradient>
      <radialGradient id="sg-utero" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stopColor="#F6AFBB" /><stop offset="1" stopColor="#B84A68" /></radialGradient>
      <radialGradient id="sg-coag" cx="0.4" cy="0.34" r="0.8"><stop offset="0" stopColor="#A83040" /><stop offset="1" stopColor="#4E0F1E" /></radialGradient>
      <g id="sg-rbc"><Eritrocito r={20} /></g>
      <g id="sg-plq"><PlaquetaDet r={11} /></g>
      <g id="sg-leu"><Leucocito r={32} /></g>
    </defs>
  );
});

// ─── Piezas del lenguaje de «La basura nuclear» ───────────────────────────────

type Tono = 'rojo' | 'azul' | 'verde' | 'ambar' | 'morado' | 'cian';

/** Franja inclinada con medallón: el rótulo que sustituye a las tarjetas. */
export function Letrero({ x, y, w, txt, k, tono, claro = false, children }: { x: number; y: number; w: number; txt: string; k: number; tono: Tono; claro?: boolean; children?: ReactNode }) {
  if (k <= 0.001) return null;
  const e = easeOut(tramo(k, 0, 0.8)), W = w * e, x0 = -w / 2, h = 54;
  const franja = (dx: number, dy: number) => `M${x0 + 26 + dx},${-h / 2 + dy} H${x0 + 14 + W + dx} L${x0 + W + dx},${h / 2 + dy} H${x0 + 26 + dx} Z`;
  return (
    <g opacity={tramo(k, 0, 0.25)} transform={`translate(${x},${y})`}>
      <path d={franja(9, 8)} fill={`url(#sg-t-${tono})`} opacity={0.32} />
      <path d={franja(0, 0)} fill={`url(#sg-t-${tono})`} />
      <path d={`M${x0 + 40},${-h / 2 + 5} H${x0 + 10 + W}`} stroke="#FFF" strokeWidth={1.6} opacity={0.3} />
      <text x={x0 + 54 + (w - 54) / 2} dy="0.35em" textAnchor="middle" className={s.letreroTxt} opacity={tramo(k, 0.45, 1)}>{txt}</text>
      <g transform={`translate(${x0 + 26},0) scale(${0.6 + 0.4 * easeBack(tramo(k, 0, 0.6))})`}>
        <circle r={38} fill="#FFF" stroke={`url(#sg-t-${tono})`} strokeWidth={1.5} />
        <circle r={31} fill={claro ? '#FFF6F3' : `url(#sg-t-${tono})`} />
        {children}
      </g>
    </g>
  );
}

/** Sello de goma: contorno doble y letras espaciadas, ligeramente girado. */
export function Sello({ x, y, w, txt, k, rot = -4, sz = 21 }: { x: number; y: number; w: number; txt: string; k: number; rot?: number; sz?: number }) {
  if (k <= 0.001) return null;
  const h = sz * 1.9, e = easeOut(tramo(k, 0, 0.7));
  return (
    <g opacity={tramo(k, 0, 0.3)} transform={`translate(${x},${y}) rotate(${rot}) scale(${1.25 - 0.25 * e})`}>
      <rect x={-w / 2 + 3} y={-h / 2 + 4} width={w} height={h} className={s.sombraSuave} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} className={s.campoSello} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} className={s.selloRojo} />
      <rect x={-w / 2 + 5} y={-h / 2 + 5} width={w - 10} height={h - 10} className={s.selloRojoFino} />
      <text textAnchor="middle" dy="0.36em" className={s.selloTxt} style={{ fontSize: sz }}>{txt}</text>
    </g>
  );
}

/** Lente de acero: aro con doble filo, cristal con reflejo y lo que se ve dentro. */
export function Lente({ id, x, y, r, k, mango = false, flota = 0, children }: { id: string; x: number; y: number; r: number; k: number; mango?: boolean; flota?: number; children?: ReactNode }) {
  if (k <= 0.001) return null;
  const q = clamp(k);
  return (
    <g opacity={tramo(q, 0, 0.3)}>
      <ellipse cx={x + 4} cy={y + r + 26} rx={r * (0.84 - flota * 0.006)} ry={r * 0.075 + 2} className={s.sombraSuave} />
      <g transform={`translate(${x},${y + flota}) scale(${0.72 + 0.28 * easeBack(q)})`}>
        {mango && (
          <g transform="rotate(45)">
            <rect x={r + 8} y={-9} width={24} height={18} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.3} />
            <rect x={r + 30} y={-13} width={r * 0.42} height={26} rx={11} fill="#2F3648" stroke="#191D2A" strokeWidth={1.3} />
            <rect x={r + 36} y={-9} width={r * 0.34} height={5} rx={2.5} fill="#FFF" opacity={0.22} />
          </g>
        )}
        <clipPath id={id}><circle r={r} /></clipPath>
        <circle r={r} fill="url(#sg-lente)" />
        <g clipPath={`url(#${id})`}>{children}</g>
        <circle r={r + 7} fill="none" stroke="url(#sg-acero)" strokeWidth={13} />
        <circle r={r + 14} fill="none" stroke="#5C6577" strokeWidth={1.2} />
        <circle r={r} fill="none" stroke="#5C6577" strokeWidth={1.2} />
        <path d={`M${f1(-r * 0.8)},${f1(-r * 0.3)} A${f1(r * 0.86)},${f1(r * 0.86)} 0 0 1 ${f1(-r * 0.2)},${f1(-r * 0.82)}`} fill="none" stroke="#FFF" strokeWidth={Math.max(4, r * 0.06)} strokeLinecap="round" opacity={0.6} />
      </g>
    </g>
  );
}

const Sub = ({ x, y, lineas, k, tam }: { x: number; y: number; lineas: string[]; k: number; tam?: number }) => (
  <g opacity={tramo(k, 0.5, 1)}>
    {lineas.map((l, i) => <text key={i} x={x} y={y + i * 24} textAnchor="middle" className={halo} style={tam ? { fontSize: tam } : undefined}>{l}</text>)}
  </g>
);

const Bola = ({ x, y, r, c, txt }: { x: number; y: number; r: number; c: string; txt?: string }) => (
  <g transform={`translate(${f1(x)},${f1(y)})`}>
    <circle r={r} fill={c} /><circle r={r} fill="url(#sg-bola)" />
    {txt && <text dy="0.36em" textAnchor="middle" className={s.protChico}>{txt}</text>}
  </g>
);

const angIgG = (th: number) => deg(Math.atan2(-Math.cos(th), Math.sin(th)));

const IconoAlerta = (
  <g fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M0,-14 L14,11 H-14 Z" /><path d="M0,-4 V3 M0,7.5 V7.6" /></g>
);
const IconoBaja = <path d="M0,16 L15,-3 H6 V-15 H-6 V-3 H-15 Z" fill="#FFF" stroke="#FFF" strokeWidth={1.4} strokeLinejoin="round" />;

/** Plaqueta activada: forma de estrella, como se pega al trombo. */
function PlaquetaActiva({ x, y, r, rot }: { x: number; y: number; r: number; rot: number }) {
  const d = Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * TAU, q = i % 2 ? 0.48 : 0.9 + hash(i, 7) * 0.35; return `${i ? 'L' : 'M'}${f1(Math.cos(a) * r * q)},${f1(Math.sin(a) * r * q)}`; }).join(' ') + ' Z';
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(rot)})`}>
      <path d={d} fill="#B791E0" stroke="#5E3A93" strokeWidth={Math.max(0.9, r * 0.07)} strokeLinejoin="round" />
      {[[-0.18, -0.1], [0.14, 0.18], [0.2, -0.2], [-0.2, 0.2]].map(([a, b], j) => <circle key={j} cx={a * r} cy={b * r} r={Math.max(0.9, r * 0.08)} fill="#6A3FA0" />)}
    </g>
  );
}

// ─── El corte del vaso ────────────────────────────────────────────────────────

/** El borde de la luz, ondulado como una pared de verdad. */
const yA = (x: number) => 238 + 8 * Math.sin(x / 170 + 0.6);
const yB = (x: number) => 762 + 8 * Math.sin(x / 190 + 2.1);
/** Más ancho que la lámina: en una pantalla ancha, la pared y el plasma siguen como color liso. */
const XS = Array.from({ length: 81 }, (_, i) => -800 + i * 40);
const tira = (f: (x: number) => number) => XS.map((x) => `${x},${f(x).toFixed(1)}`);
export const banda = (f: (x: number) => number, g: (x: number) => number) => `M${tira(f).join(' L')} L${tira(g).reverse().join(' L')} Z`;

const LUZ = banda(yA, yB);
const DES = { intima: 20, media: 78 };

/** Colágeno, elastina, fibroblastos y grasa de la adventicia, entre `y0` e `y1`. */
function Adventicia({ y0, y1, sem, grasa, nervio, vena }: { y0: number; y1: number; sem: number; grasa: [number, number][]; nervio: [number, number]; vena: string[] }) {
  const alto = y1 - y0;
  return (
    <g>
      {Array.from({ length: 7 }, (_, j) => {
        const y = y0 + (j + 0.5) * (alto / 7), o = hash(j, sem) * 240;
        return <path key={j} d={`M-800,${y} L-30,${y} C${160 + o},${y - 14} ${360 + o},${y + 16} ${640 + o},${y} S${1180 + o},${y - 16} ${1320 + o},${y} S1640,${y + 12} 1660,${y} L2400,${y}`} className={s.sgColA} strokeWidth={9 + (j % 3) * 4} />;
      })}
      {Array.from({ length: 9 }, (_, j) => {
        const y = y0 + (j + 0.7) * (alto / 9), o = hash(j, sem + 3) * 300;
        return <path key={j} d={`M-800,${y} L-30,${y} C${200 + o},${y + 9} ${420 + o},${y - 12} ${700 + o},${y + 5} S1300,${y - 9} 1660,${y + 6} L2400,${y + 6}`} className={s.sgColB} strokeWidth={2.4} />;
      })}
      {Array.from({ length: 8 }, (_, j) => {
        const y = y0 + hash(j, sem + 5) * alto, o = hash(j, sem + 6) * 300;
        return <path key={j} d={`M-800,${y} L-30,${y} C${200 + o},${y + 12} ${420 + o},${y - 14} ${700 + o},${y + 4} S1300,${y - 10} 1660,${y + 8} L2400,${y + 8}`} className={s.sgEla} />;
      })}
      {/* Vasa vasorum: los vasos del propio vaso */}
      <g opacity={0.9}>
        <Tubo d={vena[0]} w={12} tono={VENA_FINA} />
        <Tubo d={vena[1]} w={9} tono={ARTERIA_FINA} />
        {vena.slice(2).map((d, j) => <Tubo key={j} d={d} w={4.6} tono={j % 2 ? VENA_FINA : ARTERIA_FINA} cap="round" />)}
      </g>
      {/* Lóbulos de grasa */}
      {grasa.map(([x, y], j) => (
        <g key={j} transform={`translate(${x},${y})`}>
          <circle r={25 + hash(j, sem + 9) * 7} fill="url(#sg-gra)" className={s.sgGraF} />
          <ellipse cx={13} cy={15} rx={6} ry={3} className={s.sgGraN} transform="rotate(-40 13 15)" />
          <ellipse cx={-8} cy={-11} rx={8} ry={3.6} fill="#FFF" opacity={0.5} transform="rotate(-30 -8 -11)" />
        </g>
      ))}
      {/* Fibroblastos */}
      {Array.from({ length: 16 }, (_, j) => {
        const x = hash(j, sem + 1) * 1600, y = y0 + 8 + hash(j, sem + 2) * (alto - 16), a = (hash(j, sem + 4) - 0.5) * 34;
        return (
          <g key={j} transform={`translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${a.toFixed(0)})`}>
            <path d={huso(34, 6.5)} className={s.sgFib} /><ellipse rx={9} ry={3.6} className={s.sgFibN} />
          </g>
        );
      })}
      {/* Un fascículo nervioso en corte */}
      <g transform={`translate(${nervio[0]},${nervio[1]})`}>
        <ellipse rx={44} ry={28} className={s.sgPeri} />
        {Array.from({ length: 13 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 13); return <circle key={j} cx={Math.cos(a) * 34 * q} cy={Math.sin(a) * 19 * q} r={4.8} className={s.sgAxon} />; })}
      </g>
    </g>
  );
}

const GRASA_ARR: [number, number][] = [[70, 36], [122, 28], [176, 42], [40, 86], [96, 82], [150, 92], [204, 90]];
const GRASA_ABA: [number, number][] = [[1500, 912], [1552, 906], [1450, 952], [1506, 962], [1562, 958], [1394, 926], [1608, 930]];

/** La pared se dibuja una vez: `sig` 1 hacia arriba de la luz, −1 hacia abajo. */
export function Pared({ f, sig, sem }: { f: (x: number) => number; sig: 1 | -1; sem: number }) {
  const d = (q: number) => (x: number) => f(x) - sig * q;
  const iel = Array.from({ length: 800 }, (_, i) => { const x = -800 + i * 4; return `${x},${(f(x) - sig * (DES.intima + 2.6 * Math.sin(x / 6.5))).toFixed(1)}`; }).join(' L');
  return (
    <g>
      <path d={banda(d(DES.intima), d(DES.media))} fill="url(#sg-med)" />
      {[0, 1, 2].map((fila) => Array.from({ length: 22 }, (_, i) => {
        const x = i * 80 - 40 + fila * 27 + hash(i, sem + fila) * 8, y = f(x) - sig * (32 + fila * 16), a = (hash(i, sem + fila + 8) - 0.5) * 16 - sig * 4;
        return (
          <g key={`${fila}-${i}`} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)})`}>
            <path d={huso(44, 7.6)} fill="url(#sg-mus)" className={s.sgMusF} />
            <ellipse rx={13} ry={3.1} className={s.sgMusN} />
            <ellipse cx={-3} cy={-1} rx={5} ry={0.9} fill="#FFF" opacity={0.28} />
          </g>
        );
      }))}
      <path d={`M${tira(d(DES.media)).join(' L')}`} className={s.sgEel} />
      <path d={banda(f, d(DES.intima))} fill="url(#sg-int)" />
      <path d={`M${iel}`} className={s.sgIelS} />
      <path d={`M${iel}`} className={s.sgIel} />
      {Array.from({ length: 24 }, (_, i) => {
        const x = i * 72 - 30 + hash(i, sem + 11) * 10, y = f(x) - sig * 6, a = deg(Math.atan((f(x + 4) - f(x - 4)) / 8));
        return (
          <g key={i} transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)})`}>
            <path d={huso(38, 7.4)} fill="url(#sg-end)" className={s.sgEndF} />
            <ellipse cx={hash(i, sem) * 8 - 4} cy={sig * 1.2} rx={12} ry={4.4} className={s.sgEndN} />
            <ellipse cx={hash(i, sem) * 8 - 8} cy={sig * 1.2 - 1.4} rx={4} ry={1} fill="#FFF" opacity={0.4} />
          </g>
        );
      })}
    </g>
  );
}

const TejidoCorte = memo(function TejidoCorte() {
  return (
    <g>
      <rect x={-800} y={-800} width={3200} height={2600} fill="url(#sg-adv)" />
      <Adventicia y0={0} y1={160} sem={21} grasa={GRASA_ARR} nervio={[1080, 44]} vena={[
        'M-800,138 L-20,138 C140,112 300,150 480,126 S780,84 950,112 S1280,146 1620,102 L2400,102',
        'M-800,122 L-20,122 C140,96 300,134 480,110 S780,68 950,96 S1280,130 1620,86 L2400,86',
        'M480,118 C500,130 512,146 530,164', 'M950,104 C934,128 930,142 918,166', 'M1280,116 C1296,132 1300,150 1310,170',
      ]} />
      <Adventicia y0={840} y1={1000} sem={37} grasa={GRASA_ABA} nervio={[400, 960]} vena={[
        'M-800,878 L-20,878 C160,906 340,868 520,896 S860,930 1040,898 S1340,862 1620,892 L2400,892',
        'M-800,894 L-20,894 C160,922 340,884 520,912 S860,946 1040,914 S1340,878 1620,908 L2400,908',
        'M520,892 C536,874 540,858 552,836', 'M1040,894 C1026,872 1022,856 1012,834',
      ]} />
      <Pared f={yA} sig={1} sem={51} />
      <Pared f={yB} sig={-1} sem={71} />
    </g>
  );
});

/** La luz: plasma, partículas fijas y la sombra de la pared. */
const LuzFija = memo(function LuzFija() {
  return (
    <g>
      <path d={LUZ} fill="url(#sg-plasma)" />
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={hash(i, 5) * 1600} cy={252 + hash(i, 6) * 496} r={1.2 + hash(i, 7) * 2} className={s.sgEspec} opacity={0.2 + hash(i, 8) * 0.35} />)}
    </g>
  );
});

/** Lo que corre por la luz da la vuelta aquí; se desvanece antes de volver al inicio. */
const X_FLUJO = -480, ANCHO_F = 2560, FUNDIDO = 180;
const enFlujo = (d: number) => X_FLUJO + (d % ANCHO_F);
const borde = (x: number) => tramo(x, X_FLUJO, X_FLUJO + FUNDIDO) * (1 - tramo(x, X_FLUJO + ANCHO_F - FUNDIDO, X_FLUJO + ANCHO_F));
/** Perfil laminar: el centro corre, junto a la pared casi no se mueve. */
const veloc = (y: number) => 0.012 + 0.06 * (1 - ((y - 500) / 262) ** 2);

function Flujo({ hem, quieto, reloj }: { hem: number; quieto: number; reloj: number }) {
  const opMed = lerp(1, 0.32, quieto), opLej = lerp(0.42, 0.22, quieto);
  return (
    <g>
      {/* Lejos: pequeños y lavados por el plasma */}
      {Array.from({ length: 30 }, (_, i) => {
        const y = 268 + hash(i, 31) * 464, x = enFlujo(i * 87 + reloj * veloc(y) * 0.5), q = 0.45 + hash(i, 32) * 0.2, g = reloj / 1500 + i * 1.3;
        return <use key={i} href="#sg-rbc" opacity={opLej * borde(x)} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(deg(g))}) scale(${q.toFixed(2)},${(q * (0.42 + 0.58 * Math.abs(Math.cos(g * 0.7)))).toFixed(2)})`} />;
      })}
      {/* Estelas del flujo */}
      {Array.from({ length: 16 }, (_, i) => {
        const y = 285 + hash(i, 33) * 430, x = enFlujo(i * 193 + reloj * veloc(y) * 1.5), l = 110 + hash(i, 34) * 160;
        return <g key={i} opacity={borde(x)}><path d={`M${f1(x)},${f1(y)} q${f1(l / 2)},${f1(-7 + hash(i, 35) * 14)} ${f1(l)},0`} className={s.sgEstela} /></g>;
      })}
      {hem > 0.01 && Array.from({ length: 16 }, (_, i) => {
        const y = 290 + hash(i, 41) * 420, x = enFlujo(i * 171 + reloj * veloc(y) * 0.8);
        return <path key={i} d={`M${f1(x)},${f1(y)} c26,-20 54,16 84,-2 s44,-10 66,6`} fill="none" stroke="#C4192E" strokeWidth={5 + hash(i, 42) * 5} strokeLinecap="round" opacity={hem * 0.17 * borde(x)} />;
      })}
      {/* Plaquetas */}
      {Array.from({ length: 16 }, (_, i) => {
        const y = 266 + hash(i, 12) * 468, x = enFlujo(i * 157 + reloj * veloc(y));
        return <use key={i} href="#sg-plq" opacity={opMed * 0.95 * borde(x)} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(reloj / 50 + i * 37)})`} />;
      })}
      {/* En medio: la sangre de verdad, cada disco girando sobre sí mismo. Al romperse,
          el hematíe se funde con su fantasma: no cambia de golpe. */}
      {Array.from({ length: 28 }, (_, i) => {
        const y = 268 + hash(i, 1) * 464, x = enFlujo(i * 97 + reloj * veloc(y) * 1.2), q = 0.82 + hash(i, 9) * 0.5, g = reloj / 900 + i * 2.1;
        const sy = 0.34 + 0.66 * Math.abs(Math.cos(g)), roto = tramo(hem * 0.55 - hash(i, 7), 0, 0.12), o = opMed * borde(x);
        return (
          <g key={i}>
            {roto > 0.001 && <ellipse cx={x} cy={y} rx={19 * q} ry={19 * q * sy} className={s.sgFantasma} opacity={o * roto} transform={`rotate(${f1(deg(g * 0.4))} ${f1(x)} ${f1(y)})`} />}
            {roto < 0.999 && <use href="#sg-rbc" opacity={o * (1 - roto)} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(deg(g * 0.4))}) scale(${q.toFixed(2)},${(q * sy).toFixed(2)})`} />}
          </g>
        );
      })}
      {/* Leucocitos que ruedan pegados al endotelio */}
      {[0, 1].map((i) => {
        const x = enFlujo(i * 1250 + 660 + reloj * 0.016), y = i ? yB(x) - 38 : yA(x) + 38;
        return <use key={i} href="#sg-leu" opacity={opMed * borde(x)} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1(reloj / 34)})`} />;
      })}
      {/* Cerca: dos discos grandes que cruzan por los bordes */}
      {[0, 1].map((i) => {
        const y = i ? 720 : 280, x = enFlujo(i * 1100 + reloj * 0.075), g = reloj / 1400 + i * 2;
        return <use key={i} href="#sg-rbc" opacity={opMed * 0.9 * borde(x)} transform={`translate(${f1(x)},${y}) rotate(${f1(deg(g * 0.3))}) scale(2.4,${(2.4 * (0.45 + 0.55 * Math.abs(Math.cos(g)))).toFixed(2)})`} />;
      })}
    </g>
  );
}

/** Los filos del corte, al estilo de un atlas: regla y banderín por capa. */
const CAPAS_V: [string, number, number, number][] = [['Adventicia', 10, 150, 90], ['Media', 160, 216, 188], ['Íntima · endotelio', 219, 240, 228], ['Luz · plasma', 248, 750, 310]];

function RotulosCapas({ k }: { k: number }) {
  if (k <= 0.001) return null;
  return (
    <g>
      {CAPAS_V.map(([txt, a, b, y], j) => {
        const q = tramo(k, j * 0.14, 0.42 + j * 0.14), w = txt.length * 9.6 + 28, fin = 1570;
        return q > 0.001 ? (
          <g key={txt} opacity={q}>
            <path d={`M1580,${a} H1590 V${b} H1580`} className={s.reglaCapa} {...dibujar(q)} />
            <g transform={`translate(${(1 - easeOut(q)) * 24},0)`}>
              <path d={`M${fin - w},${y - 14} H${fin - 8} L${fin},${y} L${fin - 8},${y + 14} H${fin - w} Z`} className={s.chipCapa} />
              <text x={fin - 14} y={y} dy="0.35em" textAnchor="end" className={s.etiquetaCapa} style={{ fontSize: 16 }}>{txt}</text>
            </g>
          </g>
        ) : null;
      })}
    </g>
  );
}

// ─── Paso 0 · tipo II: el anticuerpo sobre la célula ──────────────────────────

const IconoY = (
  <g>
    <circle r={13} cx={-10} cy={6} fill="#E0453F" stroke="#7E1618" strokeWidth={1.4} />
    <IgG x={10} y={2} ang={-70} k={0.62} />
  </g>
);

/** Membrana del hematíe: fosfolípidos en dos filas. */
const Bicapa = memo(function Bicapa({ y, w }: { y: number; w: number }) {
  const n = Math.round(w / 15);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = -w / 2 + i * 15 + 7;
        return (
          <g key={i}>
            <path d={`M${x - 2},${y + 5} v14 M${x + 2},${y + 5} v14 M${x - 2},${y + 42} v-14 M${x + 2},${y + 42} v-14`} stroke="#D89A50" strokeWidth={1.6} strokeLinecap="round" />
            <circle cx={x} cy={y} r={6} fill="#F1BF6E" stroke="#A8732C" strokeWidth={1} />
            <circle cx={x} cy={y + 47} r={6} fill="#F1BF6E" stroke="#A8732C" strokeWidth={1} />
            <circle cx={x - 1.6} cy={y - 1.8} r={1.5} fill="#FFF" opacity={0.7} />
          </g>
        );
      })}
    </g>
  );
});

/** Lo que dice la voz: el anticuerpo NO viaja en un complejo como en el capítulo 5. */
function NoViaja({ k, reloj }: { k: number; reloj: number }) {
  if (k <= 0.001) return null;
  const x = 860 + Math.sin(reloj / 900) * 12;
  return (
    <g opacity={k}>
      <g transform={`translate(${f1(x)},410)`}>
        <ComplejoNuc r={66} tipo="adn" />
        <path d="M-82,-82 L82,82" stroke="#E5484D" strokeWidth={11} strokeLinecap="round" {...dibujar(tramo(k, 0.3, 1))} />
      </g>
      <text x={x} y={530} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>no forma complejos que viajan</text>
    </g>
  );
}

/** La lupa sobre la membrana: el Fab agarra una proteína Rh. */
function ZoomAntigeno({ k, reloj }: { k: number; reloj: number }) {
  if (k <= 0.001) return null;
  const R = 132, cx = 590, cy = 462, baja = easeOut(tramo(k, 0.25, 0.9));
  return (
    <g>
      <g opacity={tramo(k, 0, 0.3)}>
        <line x1={358} y1={470} x2={cx - R - 10} y2={cy} className={s.hiloLupa} />
        <circle cx={341} cy={472} r={20} className={s.anilloLupaL} />
      </g>
      <Lente id="sg-z1" x={cx} y={cy} r={R} k={k} mango>
        <rect x={-R} y={46} width={R * 2} height={R} fill="#C92F33" />
        <rect x={-R} y={46} width={R * 2} height={R} fill="url(#sg-bola)" opacity={0.5} />
        <circle cx={-90} cy={112} r={26} fill="#E2524C" opacity={0.5} /><circle cx={70} cy={120} r={32} fill="#E2524C" opacity={0.45} />
        <Bicapa y={8} w={R * 2} />
        {/* Proteína Rh que atraviesa la membrana */}
        <g transform="translate(0,6)">
          <path d="M-26,-22 C-30,-6 -30,46 -26,60 H26 C30,46 30,-6 26,-22 C14,-32 -14,-32 -26,-22 Z" fill="#2CA99A" stroke="#14695F" strokeWidth={2} />
          {[-16, -5, 6, 17].map((x) => <path key={x} d={`M${x},-20 V56`} stroke="#14695F" strokeWidth={2} opacity={0.38} />)}
          <path d="M-20,-14 C-18,-22 -8,-26 -2,-26" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
        </g>
        <text x={0} y={30} textAnchor="middle" className={s.sgMini} style={{ fill: '#FFF', fontSize: 19 }}>Rh</text>
        {/* Un Fab agarra la proteína; el otro y la Fc quedan hacia el plasma */}
        <g transform={`translate(0,${f1(lerp(-190, -73, baja) + Math.sin(reloj / 480) * 2 * baja)})`}><IgG x={0} y={0} ang={138} k={2.2} /></g>
        <g opacity={tramo(k, 0.7, 1)}>
          <text x={-56} y={-52} textAnchor="middle" className={s.sgMini}>IgG</text>
          <line x1={-44} y1={-58} x2={-22} y2={-82} className={s.guia} />
        </g>
      </Lente>
      <g opacity={tramo(k, 0.55, 1)}>
        <text x={cx - 24} y={cy + R + 56} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>antígeno de su superficie</text>
        <text x={cx - 24} y={cy + R + 80} textAnchor="middle" className={halo}>IgG contra la proteína Rh</text>
      </g>
    </g>
  );
}

const BLANCOS = [
  { k: 'b1', x: 290, txt: 'ANEMIA HEMOLÍTICA', lineas: ['IgG «calientes»', 'contra las proteínas Rh'], tono: 'rojo' as Tono, d: 'eritrocito' as const },
  { k: 'b2', x: 800, txt: 'TROMBOCITOPENIA', lineas: ['contra la glicoproteína', 'IIb/IIIa de la plaqueta'], tono: 'morado' as Tono, d: 'plaqueta' as const },
  { k: 'b3', x: 1270, txt: 'LEUCOPENIA', lineas: ['contra antígenos del leucocito', 'muy frecuente en el lupus'], tono: 'azul' as Tono, d: 'leucocito' as const },
];

function Blancos({ t }: { t: T }) {
  return (
    <g>
      {BLANCOS.map((b) => (
        <g key={b.k}>
          <Letrero x={b.x} y={886} w={370} txt={b.txt} k={v(t, b.k)} tono={b.tono} claro><DibujoCelula dibujo={b.d} d={46} /></Letrero>
          <Sub x={b.x + 14} y={938} lineas={b.lineas} k={v(t, b.k)} />
        </g>
      ))}
    </g>
  );
}

// ─── Paso 1 · las tres muertes ────────────────────────────────────────────────

const ArteMac = (
  <g>
    {Array.from({ length: 8 }, (_, j) => { const a = (j / 8) * TAU; return <circle key={j} cx={Math.cos(a) * 17} cy={Math.sin(a) * 17} r={5.6} fill="#C0397A" stroke="#FFF" strokeWidth={1} />; })}
    <circle r={9} fill="#FFE9EE" stroke="#C0397A" strokeWidth={2} />
  </g>
);
const ArteMacro = (
  <g>
    <circle r={21} fill="#E8A06A" stroke="#9A5A2C" strokeWidth={2.2} />
    <circle cx={-5} cy={4} r={8} fill="#9A5A2C" opacity={0.8} />
    <path d="M-12,-22 L-12,-29 M-17,-34 L-12,-29 L-7,-34 M10,-22 L10,-29 M5,-34 L10,-29 L15,-34" fill="none" stroke="#6A3A14" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);
const ArteNk = (
  <g>
    <circle cx={-4} r={20} fill="#4F9FC2" stroke="#1F5F82" strokeWidth={2.2} />
    {[[-12, -7], [-2, 6], [-13, 8], [5, -7], [3, 0]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={3.4} fill="#F2CF74" stroke="#A8821A" strokeWidth={0.8} />)}
    <path d="M18,0 H30 M25,-6 L31,0 L25,6" fill="none" stroke="#1F5F82" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const MUERTES = [
  { k: 'm1', x: 290, txt: '1 · COMPLEMENTO', lineas: ['el MAC (C5b-9) perfora su membrana'], tono: 'rojo' as Tono, arte: ArteMac },
  { k: 'm2', x: 800, txt: '2 · MACRÓFAGO', lineas: ['receptor Fc: la engulle'], tono: 'ambar' as Tono, arte: ArteMacro },
  { k: 'm3', x: 1290, txt: '3 · CÉLULA NK', lineas: ['ADCC: perforina y granzimas'], tono: 'cian' as Tono, arte: ArteNk },
];

const POROS = [-2.05, -1.1, -0.1, 1.1, 1.75, 2.2, 3.0];
const IGG_LISIS = [-0.61, -2.53, -1.57, 0.52, 2.62];

/** Un hematíe al que el complemento le abre poros: se vacía y queda un fantasma. */
function Lisis({ k, est, reloj }: { k: number; est: number; reloj: number }) {
  if (est <= 0.001) return null;
  const x = 290, y = 500, r = 75;
  const vacia = easeInOut(tramo(k, 0.45, 1)), c1 = tramo(k, 0, 0.2), esc = 1 - 0.1 * vacia;
  return (
    <g opacity={tramo(est, 0, 0.7)} transform={`translate(${x},${y})`}>
      {/* La hemoglobina sale por los poros */}
      {k > 0.3 && POROS.flatMap((a, p) => Array.from({ length: 3 }, (_, j) => {
        const f = (reloj / 1050 + j / 3 + p * 0.17) % 1, d = r * esc + 6 + f * 88, cae = f * f * 16;
        return <circle key={`${p}-${j}`} cx={Math.cos(a) * d} cy={Math.sin(a) * d + cae} r={7.4 - f * 4.4} fill="url(#sg-hem)" opacity={tramo(k, 0.3, 0.42) * (1 - f) * (1 - tramo(k, 0.92, 1) * 0.7)} />;
      }))}
      <g transform={`scale(${esc.toFixed(3)})`}>
        <g opacity={1 - vacia}><Eritrocito r={r} /></g>
        {vacia > 0.01 && (
          <g opacity={vacia}>
            <path d={Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * TAU, q = 1 - 0.035 * Math.sin(i * 2.7) - 0.03 * hash(i, 3); return `${i ? 'L' : 'M'}${f1(Math.cos(a) * r * q)},${f1(Math.sin(a) * r * q)}`; }).join(' ') + ' Z'} className={s.sgFantasma} style={{ fillOpacity: 0.5, strokeDasharray: 'none', strokeWidth: 2.4 }} />
            <circle r={r * 0.5} fill="#F2B5AE" opacity={0.3} />
          </g>
        )}
        {/* Poros en la cara del disco y en el borde */}
        {[[-22, -18], [24, 8], [-10, 30]].map(([a, b], j) => {
          const q = easeBack(tramo(k, 0.15 + j * 0.08, 0.35 + j * 0.08));
          return q > 0.01 ? <g key={j} transform={`translate(${a},${b}) scale(${q.toFixed(2)})`}><circle r={12} fill="#7E2A6E" stroke="#3E1038" strokeWidth={1.4} /><circle r={5.6} fill="#2E0A22" /><circle cx={-3} cy={-6} r={2.4} fill="#FFF" opacity={0.5} /></g> : null;
        })}
        {POROS.map((a, j) => {
          const q = easeBack(tramo(k, 0.12 + j * 0.05, 0.32 + j * 0.05));
          return q > 0.01 ? <g key={j} transform={`rotate(${f1(deg(a) + 90)}) translate(0,${-r}) scale(${q.toFixed(2)})`}><rect x={-7} y={-9} width={14} height={18} rx={3} fill="#9A3A86" stroke="#4E1648" strokeWidth={1.3} /><rect x={-2.4} y={-9} width={4.8} height={18} fill="#2E0A22" /></g> : null;
        })}
      </g>
      {/* Los anticuerpos con C1q que arrancan la cascada */}
      {IGG_LISIS.map((a, j) => <IgG key={j} x={Math.cos(a) * (r + 18)} y={Math.sin(a) * (r + 18)} ang={angIgG(a)} k={0.88} />)}
      <g opacity={c1} transform={`translate(${f1(Math.cos(-0.61) * (r + 68))},${f1(Math.sin(-0.61) * (r + 68) - (1 - c1) * 20)}) rotate(${f1(angIgG(-0.61))})`}><DibujoCelula dibujo="c1q" d={54} color="#C0397A" /></g>
      <g opacity={tramo(k, 0.3, 0.5)}>
        <line x1={Math.cos(2.2) * r} y1={Math.sin(2.2) * r} x2={-112} y2={138} className={s.guia} />
        <text x={-112} y={158} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>poro MAC</text>
      </g>
      <g opacity={tramo(k, 0.82, 1)}>
        <text x={40} y={r + 54} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>queda un fantasma</text>
      </g>
    </g>
  );
}

const ArteBazo = (
  <g>
    <path d="M-27,-15 C-10,-32 24,-26 29,-4 C33,16 13,32 -11,27 C-25,24 -13,9 -20,3 C-27,-2 -35,-8 -27,-15 Z" fill="url(#sg-bazo)" stroke="#3E1236" strokeWidth={1.3} />
    <path d="M-16,14 L-7,10 M-22,-10 L-13,-7" stroke="#3E1236" strokeWidth={2} strokeLinecap="round" />
    <path d="M-8,-20 C2,-24 14,-20 20,-10" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.5} />
  </g>
);
const ArteHigado = (
  <g>
    <path d="M-37,-9 C-22,-29 20,-29 37,-18 C39,-7 22,11 4,20 C-9,26 -33,15 -37,-9 Z" fill="url(#sg-higado)" stroke="#4A180F" strokeWidth={1.3} />
    <path d="M6,-24 C2,-10 3,5 4,20" fill="none" stroke="#4A180F" strokeWidth={1.8} opacity={0.65} />
    <path d="M-26,-13 C-14,-21 -2,-23 0,-22" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
  </g>
);

export function Medallon({ x, y, r = 44, k, flota = 0, children }: { x: number; y: number; r?: number; k: number; flota?: number; children: ReactNode }) {
  if (k <= 0.001) return null;
  const q = clamp(k);
  return (
    <g opacity={Math.min(1, q * 2)}>
      <ellipse cx={x} cy={y + r + 16} rx={r * (0.8 - flota * 0.01)} ry={6} className={s.sombraSuave} />
      <g transform={`translate(${x},${y + flota}) scale(${0.5 + 0.5 * easeBack(q)})`}>
        <circle r={r + 6} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
        <circle r={r} fill="url(#sg-lente)" />
        {children}
        <path d={`M${f1(-r * 0.76)},${f1(-r * 0.3)} A${f1(r * 0.82)},${f1(r * 0.82)} 0 0 1 ${f1(-r * 0.2)},${f1(-r * 0.78)}`} fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
      </g>
    </g>
  );
}

/** Lo que deja la perforina de la NK: la membrana vacía, con sus poros. */
function FantasmaNk({ k }: { k: number }) {
  if (k <= 0.001) return null;
  const r = 55;
  return (
    <g opacity={k} transform="translate(1420,450)">
      <path d={Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * TAU, q = 1 - 0.04 * Math.sin(i * 2.7) - 0.03 * hash(i, 5); return `${i ? 'L' : 'M'}${f1(Math.cos(a) * r * q)},${f1(Math.sin(a) * r * q)}`; }).join(' ') + ' Z'} className={s.sgFantasma} style={{ fillOpacity: 0.5, strokeDasharray: 'none', strokeWidth: 2.2 }} />
      <circle r={r * 0.5} fill="#F2B5AE" opacity={0.3} />
      {[-2.5, -0.9, 0.3, 1.9].map((a, j) => <g key={j} transform={`rotate(${f1(deg(a) + 90)}) translate(0,${-r})`}><rect x={-5} y={-7} width={10} height={14} rx={2.4} fill="#3F86A8" stroke="#1F5F82" strokeWidth={1} /><rect x={-1.8} y={-7} width={3.6} height={14} fill="#143A52" /></g>)}
      <text y={r + 32} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>lisada</text>
    </g>
  );
}

function Muertes({ t, reloj }: { t: T; reloj: number }) {
  return (
    <g>
      <Lisis k={v(t, 'lis1')} est={v(t, 'est1')} reloj={reloj} />
      <FantasmaNk k={v(t, 'fan3')} />
      {MUERTES.map((m) => (
        <g key={m.k}>
          <Letrero x={m.x} y={86} w={m.k === 'm1' ? 370 : 340} txt={m.txt} k={v(t, m.k)} tono={m.tono} claro>{m.arte}</Letrero>
          <Sub x={m.x + 14} y={140} lineas={m.lineas} k={v(t, m.k)} />
        </g>
      ))}
      <Medallon x={640} y={676} r={36} k={v(t, 'baz')} flota={Math.sin(reloj / 650) * 3}>{ArteBazo}</Medallon>
      <text x={640} y={744} textAnchor="middle" className={halo} opacity={v(t, 'baz')}>bazo</text>
      <Medallon x={960} y={676} r={36} k={v(t, 'hig')} flota={Math.sin(reloj / 650 + 2) * 3}>{ArteHigado}</Medallon>
      <text x={960} y={744} textAnchor="middle" className={halo} opacity={v(t, 'hig')}>hígado</text>
      <Sello x={560} y={372} w={250} txt="OPSONIZADA" k={v(t, 'opso')} sz={26} rot={-5} />
      <text x={560} y={426} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} opacity={tramo(v(t, 'opso'), 0.5, 1)}>marcada para morir</text>
      <Letrero x={800} y={900} w={520} txt="TRES MANERAS DE MORIR" k={v(t, 'tTres')} tono="azul"><g transform="scale(0.9)">{IconoAlerta}</g></Letrero>
      <Letrero x={800} y={900} w={780} txt="SIEMPRE IGUAL: BAJA EL RECUENTO DE ESA CÉLULA" k={v(t, 'baja')} tono="rojo">{IconoBaja}</Letrero>
    </g>
  );
}

// ─── Paso 2 · la firma de la hemólisis: cinco lentes y un nivel ───────────────

function ArteCoombs({ rl }: { rl: number }) {
  const m = Math.sin(rl / 500) * 1.6;
  const C: [number, number][] = [[-38, -34], [34, -42], [-4, 8], [-52, 44], [46, 34]];
  const B: [number, number][] = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4]];
  return (
    <g>
      {B.map(([a, b], j) => {
        const mx = (C[a][0] + C[b][0]) / 2, my = (C[a][1] + C[b][1]) / 2;
        return <IgG key={j} x={mx} y={my} ang={deg(Math.atan2(C[b][1] - C[a][1], C[b][0] - C[a][0])) + 90} k={0.78} igm />;
      })}
      {C.map(([x, y], j) => <g key={j} transform={`translate(${f1(x + (j % 2 ? m : -m))},${f1(y)})`}><Eritrocito r={27} /></g>)}
      {C.flatMap(([x, y], j) => [0.6, 2.8, 4.6].map((a, n) => <IgG key={`${j}-${n}`} x={x + Math.cos(a + j) * 34} y={y + Math.sin(a + j) * 34} ang={angIgG(a + j)} k={0.44} />))}
    </g>
  );
}
function ArteRetic({ rl }: { rl: number }) {
  const f = (rl / 2600) % 1;
  const X: [number, number][] = [[-66, -44], [56, -56], [70, 40], [-52, 58], [8, 74]];
  return (
    <g>
      {X.map(([x, y], j) => <g key={j} transform={`translate(${x},${f1(y + Math.sin(rl / 700 + j) * 3)})`}><Eritrocito r={20} /></g>)}
      {/* Reticulocitos: grandes, azulados, con la red de ARN que da nombre */}
      {[[0, -6, 44], [lerp(-150, -62, easeOut(f)), 6 + Math.sin(rl / 400) * 4, 32]].map(([x, y, r], j) => (
        <g key={j} transform={`translate(${f1(x)},${f1(y)})`} opacity={j ? 1 - tramo(f, 0.85, 1) : 1}>
          <circle r={r} fill="#A99AE0" stroke="#4A3C8C" strokeWidth={2.2} />
          <circle r={r} fill="url(#sg-bola)" opacity={0.7} />
          <path d={Array.from({ length: 11 }, (_, i) => { const a = hash(i, 12 + j) * TAU, q = hash(i, 13) * 0.72 * r, b = a + 0.9 + hash(i, 14), w = hash(i, 15) * 0.8 * r; return `M${f1(Math.cos(a) * q)},${f1(Math.sin(a) * q)} Q${f1(Math.cos(a + 0.4) * r * 0.5)},${f1(Math.sin(a + 0.4) * r * 0.5)} ${f1(Math.cos(b) * w)},${f1(Math.sin(b) * w)}`; }).join(' ')} fill="none" stroke="#231C66" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}
function ArteLdh({ rl }: { rl: number }) {
  const sep = 8 + 5 * Math.sin(rl / 380);
  return (
    <g>
      {Array.from({ length: 12 }, (_, j) => {
        const f = (rl / 1900 + j / 12) % 1, a = (j / 12) * TAU + 0.4, d = 8 + f * 78;
        return (
          <g key={j} transform={`translate(${f1(Math.cos(a) * d)},${f1(Math.sin(a) * d * 1.1)}) rotate(${f1(f * 260 + j * 30)}) scale(${(0.6 + f * 0.5).toFixed(2)})`} opacity={1 - f ** 3}>
            {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([x, y], n) => <circle key={n} cx={x} cy={y} r={5.4} fill={n % 3 ? '#F2A31E' : '#D97B12'} stroke="#8A4A0E" strokeWidth={0.9} />)}
          </g>
        );
      })}
      <g transform={`translate(${f1(-sep)},0)`}>
        <path d="M-6,-58 C-42,-58 -66,-30 -66,0 C-66,30 -42,58 -6,58 L4,32 L-12,12 L6,-12 L-6,-32 Z" fill="url(#sg-hem)" stroke="#6E1616" strokeWidth={2} strokeLinejoin="round" />
        <path d="M-52,-20 C-46,-36 -34,-44 -22,-48" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
      </g>
      <g transform={`translate(${f1(sep)},0)`}>
        <path d="M6,-58 C42,-58 66,-30 66,0 C66,30 42,58 6,58 L-4,32 L12,12 L-6,-12 L6,-32 Z" fill="url(#sg-hem)" stroke="#6E1616" strokeWidth={2} strokeLinejoin="round" />
      </g>
    </g>
  );
}
function ArteBili({ rl, k }: { rl: number; k: number }) {
  const y0 = lerp(36, -20, easeOut(k)), ola = Math.sin(rl / 420) * 2.4;
  return (
    <g transform={`rotate(${f1(Math.sin(rl / 900) * 3)})`}>
      <path d={`M-22,${f1(y0 + ola)} q11,-5 22,0 t22,0 L22,44 A22,17 0 0 1 -22,44 Z`} fill="url(#sg-suero)" />
      {[0, 1, 2, 3].map((j) => { const f = (rl / 1500 + j / 4) % 1; return <circle key={j} cx={-10 + j * 7} cy={lerp(46, y0 + 6, f)} r={2 + (j % 2)} fill="#FFF" opacity={0.75 * (1 - f)} />; })}
      <path d="M-25,-66 L-25,44 A25,20 0 0 0 25,44 L25,-66" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3} />
      <rect x={-31} y={-76} width={62} height={12} rx={4.5} fill="#9AA6B8" stroke="#5C6577" strokeWidth={1} />
      <path d="M-15,-56 V36" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
    </g>
  );
}
/** Haptoglobina: una pinza que atrapa la hemoglobina; cada pareja se va y ya no vuelve. */
function ArteHapto({ rl, k }: { rl: number; k: number }) {
  const pinza = (ab: number) => (
    <g>
      <path d={`M-30,${-13 - ab} C-14,${-24 - ab} 6,${-22 - ab} 16,${-10 - ab} M-30,${13 + ab} C-14,${24 + ab} 6,${22 + ab} 16,${10 + ab}`} fill="none" stroke="#14695F" strokeWidth={13} strokeLinecap="round" />
      <path d={`M-30,${-13 - ab} C-14,${-24 - ab} 6,${-22 - ab} 16,${-10 - ab} M-30,${13 + ab} C-14,${24 + ab} 6,${22 + ab} 16,${10 + ab}`} fill="none" stroke="#2CB8A6" strokeWidth={8.4} strokeLinecap="round" />
      <circle cx={-32} cy={0} r={15} fill="#2CB8A6" stroke="#14695F" strokeWidth={2} />
      <circle cx={-37} cy={-5} r={4} fill="#FFF" opacity={0.5} />
    </g>
  );
  return (
    <g>
      {[[-58, -60], [46, -66], [-70, 56]].map(([x, y], j) => (
        <g key={j} transform={`translate(${x},${f1(y + Math.sin(rl / 600 + j) * 4)}) scale(0.68)`} opacity={1 - tramo(k, 0.3 + j * 0.18, 0.5 + j * 0.18)}>{pinza(4 + Math.sin(rl / 300 + j) * 3)}</g>
      ))}
      {[0, 1, 2].map((j) => {
        const f = (rl / 2400 + j / 3) % 1, x = lerp(-20, 130, f), y = lerp(-6, 50 - j * 50, f);
        return (
          <g key={j} transform={`translate(${f1(x)},${f1(y)})`} opacity={1 - tramo(f, 0.75, 1)}>
            {pinza(-1)}
            <circle cx={2} r={12} fill="url(#sg-hem)" stroke="#6E1616" strokeWidth={1.5} />
            <circle cx={-2} cy={-4} r={3} fill="#FFF" opacity={0.6} />
          </g>
        );
      })}
      {[[70, -30], [-10, 68], [78, 66], [-84, -6]].map(([x, y], j) => <circle key={j} cx={x + Math.sin(rl / 500 + j) * 3} cy={y} r={7} fill="url(#sg-hem)" stroke="#6E1616" strokeWidth={1} opacity={0.75} />)}
    </g>
  );
}

/** Nivel de vidrio: la franja verde es lo normal; el líquido sube o baja hasta su valor. */
function Nivel({ x, y, h, k, sube, c, rl }: { x: number; y: number; h: number; k: number; sube: boolean; c: string; rl: number }) {
  const n = lerp(0.48, sube ? 0.92 : 0.1, easeInOut(k)), alto = h * n + Math.sin(rl / 300) * 1.4;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-13} y={0} width={26} height={h} rx={13} fill="#FFF" fillOpacity={0.55} />
      <rect x={-13} y={h * 0.38} width={26} height={h * 0.22} fill="#1F9A6A" opacity={0.3} />
      <path d={`M-9,${f1(h - alto)} H9 V${h - 9} A9,9 0 0 1 -9,${h - 9} Z`} fill={c} />
      <rect x={-13} y={0} width={26} height={h} rx={13} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={2} />
      {Array.from({ length: 7 }, (_, j) => <line key={j} x1={13} y1={h * (j + 1) / 8} x2={j % 2 ? 19 : 23} y2={h * (j + 1) / 8} stroke="#6E7789" strokeWidth={1.5} />)}
      <rect x={-8.5} y={8} width={4.5} height={h - 16} rx={2.2} fill="#FFF" opacity={0.65} />
    </g>
  );
}

type Prueba = { k: string; x: number; titulo: string; palabra: string; sube: boolean; lineas: string[]; c: string; rec: [number, number]; arte: (rl: number, k: number) => ReactNode };
const PRUEBAS: Prueba[] = [
  { k: 'lab1', x: 168, titulo: 'COOMBS DIRECTO', palabra: 'POSITIVO', sube: true, lineas: ['anticuerpos pegados', 'al hematíe'], c: '#C2385A', rec: [0, 0.15], arte: (rl) => <ArteCoombs rl={rl} /> },
  { k: 'lab2', x: 476, titulo: 'RETICULOCITOS', palabra: 'SUBEN', sube: true, lineas: ['la médula', 'intenta compensar'], c: '#7B4FC9', rec: [0.15, 0.42], arte: (rl) => <ArteRetic rl={rl} /> },
  { k: 'lab3', x: 784, titulo: 'LDH', palabra: 'SUBE', sube: true, lineas: ['se están rompiendo', 'hematíes'], c: '#D9871E', rec: [0.42, 0.62], arte: (rl) => <ArteLdh rl={rl} /> },
  { k: 'lab4', x: 1092, titulo: 'BILIRRUBINA INDIRECTA', palabra: 'SUBE', sube: true, lineas: ['se están rompiendo', 'hematíes'], c: '#B8860B', rec: [0.62, 0.84], arte: (rl, k) => <ArteBili rl={rl} k={k} /> },
  { k: 'lab5', x: 1400, titulo: 'HAPTOGLOBINA', palabra: 'BAJA', sube: false, lineas: ['se gasta atrapando la', 'hemoglobina libre'], c: '#1F8F82', rec: [0.84, 0.999], arte: (rl, k) => <ArteHapto rl={rl} k={k} /> },
];

function PruebaLab({ p, k, todo, rec, rl, i }: { p: Prueba; k: number; todo: number; rec: number; rl: number; i: number }) {
  if (k <= 0.001) return null;
  const a = tramo(k, 0, 0.4), flota = Math.sin(rl / 750 + i * 1.7) * 4, lleno = tramo(k, 0.25, 1);
  const col = p.sube ? '#E5484D' : '#2F6FD0', foco = rec > p.rec[0] && rec < p.rec[1] ? 1 : 0;
  const ancho = p.palabra.length * 18, total = 32 + 10 + ancho, ini = -total / 2, wp = Math.min(290, p.titulo.length * 12.4 + 50);
  const R = 96, cy = 442;
  return (
    <g opacity={a} transform={`translate(${p.x},${lerp(36, 0, easeOut(a))})`}>
      {foco > 0 && <circle cx={0} cy={cy} r={R + 28} fill="none" stroke="#F2B21E" strokeWidth={8} opacity={0.75 + 0.25 * Math.sin(rl / 120)} />}
      {todo > 0.001 && <circle cx={0} cy={cy} r={R + 24} fill="none" stroke={L.lupus} strokeWidth={5} opacity={todo * (0.6 + 0.4 * Math.sin(rl / 240 + i))} />}
      <Lente id={`sg-lab${i}`} x={0} y={cy} r={R} k={1} flota={flota}>{p.arte(rl, lleno)}</Lente>
      <g transform="translate(0,302)">
        <path d={`M${-wp / 2 + 10},-19 H${wp / 2 + 10} L${wp / 2 - 10},19 H${-wp / 2 - 10} Z`} fill={p.c} />
        <path d={`M${-wp / 2 + 14},-13 H${wp / 2 + 6}`} stroke="#FFF" strokeWidth={1.6} opacity={0.35} />
        <text dy="0.35em" textAnchor="middle" className={s.sgPill} style={p.titulo.length > 16 ? { fontSize: 17 } : undefined}>{p.titulo}</text>
      </g>
      {p.k !== 'lab1' && <Nivel x={-R - 42} y={cy - 88} h={176} k={lleno} sube={p.sube} c={col} rl={rl} />}
      {p.k === 'lab1' && (
        <g transform={`translate(${-R + 4},${cy - R + 12}) scale(${0.7 + 0.3 * easeBack(lleno)})`} opacity={lleno}>
          <circle r={25} fill="#E5484D" stroke="#FFF" strokeWidth={3.6} />
          <path d="M-12,0 H12 M0,-12 V12" stroke="#FFF" strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
      <g transform="translate(0,600)" opacity={lleno}>
        <path d={p.sube ? 'M0,-19 L18,6 H7 V19 H-7 V6 H-18 Z' : 'M0,19 L18,-6 H7 V-19 H-7 V-6 H-18 Z'} fill={col} stroke="#FFF" strokeWidth={2} strokeLinejoin="round" transform={`translate(${ini + 18},${f1(Math.sin(rl / 300 + i) * 3 * (p.sube ? -1 : 1))})`} />
        <text x={ini + 44} dy="0.36em" className={`${s.pruebaPal} ${s.conHalo}`} style={{ fill: col }}>{p.palabra}</text>
      </g>
      {p.lineas.map((l, j) => <text key={j} y={646 + j * 24} textAnchor="middle" className={halo} style={{ fontSize: 19 }} opacity={tramo(k, 0.5, 0.9)}>{l}</text>)}
    </g>
  );
}

function Firma({ t, reloj }: { t: T; reloj: number }) {
  const todo = v(t, 'labTodo'), ah = v(t, 'ahai'), rec = v(t, 'rec');
  return (
    <g>
      <Letrero x={800} y={86} w={760} txt="ANEMIA HEMOLÍTICA AUTOINMUNE" k={ah} tono="rojo" claro><DibujoCelula dibujo="eritrocito" d={44} /></Letrero>
      <text x={800} y={142} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(ah, 0.5, 1) * tramo(v(t, 'lab1'), 0, 1)}>tienes que saber leer el laboratorio</text>
      <Sello x={800} y={892} w={700} txt="LA FIRMA DE LA HEMÓLISIS" k={todo} rot={-2.5} sz={36} />
      <text x={800} y={968} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(todo, 0.5, 1)}>y te la van a preguntar</text>
      {PRUEBAS.map((p, i) => <PruebaLab key={p.k} p={p} k={v(t, p.k)} todo={todo} rec={rec} rl={reloj} i={i} />)}
    </g>
  );
}

// ─── Paso 3 · conteos al microscopio y síntomas ───────────────────────────────

type TipoConteo = { id: string; x: number; titulo: string; n: number; celula: 'plaqueta' | 'linfocito'; d: number; v0: number; v1: number; unidad: string; sello: string; selloW: number; pk: string; lk: string; color?: string };
const CONTEOS: TipoConteo[] = [
  { id: 'sg-cpq', x: 188, titulo: 'PLAQUETAS POR CAMPO', n: 18, celula: 'plaqueta', d: 26, v0: 250, v1: 40, unidad: 'mil / µL', sello: '< 100 000 · CRITERIO', selloW: 292, pk: 'plaq', lk: 'plaqLow' },
  { id: 'sg-clf', x: 948, titulo: 'LINFOCITOS POR CAMPO', n: 10, celula: 'linfocito', d: 40, v0: 2800, v1: 800, unidad: '/ µL', sello: 'LINFOPENIA < 1 500', selloW: 266, pk: 'leuc', lk: 'leucLow', color: '#7C8AAE' },
];
const Y_C = 438, R_C = 120;

function Conteo({ c, t, rl }: { c: TipoConteo; t: T; rl: number }) {
  const k = v(t, c.pk), m = easeInOut(v(t, c.lk));
  if (k <= 0.001) return null;
  const keep = lerp(1, 0.2, m), valor = Math.round(lerp(c.v0, c.v1, m)), bajo = m > 0.55, tx = c.x + R_C + 38;
  return (
    <g>
      <Lente id={c.id} x={c.x} y={Y_C} r={R_C} k={k}>
        <rect x={-R_C} y={-R_C} width={R_C * 2} height={R_C * 2} fill="#FBDFE4" />
        {Array.from({ length: 7 }, (_, i) => { const a = i * 1.9, q = 0.3 + hash(i, 22) * 0.6; return <g key={i} transform={`translate(${f1(Math.cos(a) * R_C * q)},${f1(Math.sin(a) * R_C * q)}) scale(0.9)`} opacity={0.5}><use href="#sg-rbc" /></g>; })}
        {Array.from({ length: c.n }, (_, i) => {
          const a = i * 2.39996 + rl / 5200, q = Math.sqrt((i + 0.5) / c.n) * 0.8;
          const vivo = clamp(keep * c.n - i);
          if (vivo <= 0.02) return null;
          return (
            <g key={i} transform={`translate(${f1(Math.cos(a) * R_C * q + Math.sin(rl / 900 + i) * 3)},${f1(Math.sin(a) * R_C * q + Math.cos(rl / 800 + i) * 3)}) rotate(${i * 41}) scale(${(0.4 + 0.6 * vivo).toFixed(2)})`} opacity={vivo}>
              <DibujoCelula dibujo={c.celula} d={c.d} color={c.color} />
            </g>
          );
        })}
      </Lente>
      <g opacity={tramo(k, 0.3, 0.8)}>
        <text x={tx} y={Y_C - 56} className={`${s.lEtiquetaMayus} ${s.conHalo}`}>{c.titulo}</text>
        <text x={tx} y={Y_C + 8} className={`${s.sgNum} ${s.conHalo}`} style={{ fill: bajo ? '#E5484D' : 'var(--texto)' }}>{valor}</text>
        <text x={tx + String(valor).length * 35 + 12} y={Y_C + 8} className={halo} style={{ fontSize: 22 }}>{c.unidad}</text>
      </g>
      <Sello x={tx + c.selloW / 2 + 4} y={Y_C + 58} w={c.selloW} txt={c.sello} k={tramo(m, 0.55, 1)} sz={19} rot={-3} />
    </g>
  );
}

const ArtePetequias = (k: number) => (
  <g>
    <circle r={38} fill="url(#sg-piel)" />
    {Array.from({ length: 22 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 22) * 32, o = tramo(k, j / 30, j / 30 + 0.25); return <circle key={j} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={1.4 + hash(j, 2) * 1.8} fill="#B3142C" opacity={o} />; })}
    {[[-20, -12], [8, -24], [20, 12], [-8, 22]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={0.9} fill="#A0785E" opacity={0.7} />)}
  </g>
);
const ArteMoretones = (k: number) => (
  <g>
    <circle r={38} fill="url(#sg-piel)" />
    <g opacity={k} transform={`scale(${0.6 + 0.4 * k})`}>
      <path d="M-22,-5 C-25,-23 2,-27 13,-16 C31,-13 28,13 10,19 C-8,27 -28,14 -22,-5 Z" fill="#6A4AB8" opacity={0.9} />
      <path d="M-13,-3 C-14,-15 4,-17 11,-9 C20,-4 16,8 6,11 C-4,15 -16,8 -13,-3 Z" fill="#3E2A78" opacity={0.65} />
      <path d="M-22,-5 C-24,-12 -16,-20 -8,-21" fill="none" stroke="#C7B84A" strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      <path d="M14,17 C22,13 27,5 24,-3" fill="none" stroke="#8FA63E" strokeWidth={4} strokeLinecap="round" opacity={0.55} />
    </g>
  </g>
);
const ArteEncias = (k: number, rl: number) => (
  <g>
    <circle r={38} fill="#6E1C2C" />
    <path d="M-38,-34 H38 V-12 C26,-4 16,-12 8,-6 C2,-11 -2,-11 -8,-6 C-16,-12 -26,-4 -38,-12 Z" fill="#EE8596" />
    <path d="M-38,-34 H38 V-20 C20,-26 -20,-26 -38,-20 Z" fill="#F7A7B2" />
    {[-23, 0, 23].map((x, j) => (
      <g key={j}>
        <path d={`M${x - 11},-10 C${x - 12},-16 ${x + 12},-16 ${x + 11},-10 C${x + 13},8 ${x + 9},22 ${x + 4},22 C${x + 1},22 ${x + 1},14 ${x},14 C${x - 1},14 ${x - 1},22 ${x - 4},22 C${x - 9},22 ${x - 13},8 ${x - 11},-10 Z`} fill="#FFFCF2" stroke="#BCB6A2" strokeWidth={1} />
        <path d={`M${x - 6},-8 V8`} stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" opacity={0.8} />
      </g>
    ))}
    {[-12, 12].map((x, j) => { const f = (rl / 1300 + j * 0.5) % 1; return <path key={j} d="M0,-6 C-3,-1 -4.4,1.4 -4.4,3.4 A4.4,4.4 0 0 0 4.4,3.4 C4.4,1.4 3,-1 0,-6 Z" fill="#C0102A" transform={`translate(${x},${f1(-8 + f * 14)})`} opacity={k * (1 - f * 0.4)} />; })}
  </g>
);
/** Silueta de mujer: el mismo perfil que en el resto del laboratorio, pero con volumen. */
const ArteMujer = (
  <g>
    <circle r={38} fill="#F6E0D8" />
    <path d="M-26,38 C-26,12 -13,6 0,6 C13,6 26,12 26,38 Z" fill="#7B4FC9" />
    <path d="M-16,-4 C-22,-26 -8,-34 0,-34 C8,-34 22,-26 16,-4 C20,4 12,8 8,4 H-8 C-12,8 -20,4 -16,-4 Z" fill="#4A2C20" />
    <ellipse cy={-11} rx={11} ry={13.5} fill="#EFC4A6" />
    <path d="M-11,-15 C-6,-22 6,-22 11,-15 C7,-18 -6,-18 -11,-15 Z" fill="#4A2C20" />
    <rect x={-4} y={0} width={8} height={9} fill="#E4B292" />
  </g>
);

function Sintomas({ t, rl }: { t: T; rl: number }) {
  const fl = (i: number) => Math.sin(rl / 700 + i * 1.9) * 3;
  const S: [string, number, string, ReactNode][] = [
    ['Petequias', 150, 's1', ArtePetequias(tramo(v(t, 's1'), 0.2, 1))],
    ['Moretones', 320, 's2', ArteMoretones(tramo(v(t, 's2'), 0.2, 1))],
    ['Sangrado de encías', 500, 's3', ArteEncias(tramo(v(t, 's3'), 0.2, 1), rl)],
  ];
  const pm = v(t, 'pm'), pa = v(t, 'pa');
  return (
    <g>
      {S.map(([n, x, k, arte], i) => (
        <g key={k}>
          <Medallon x={x} y={646} r={40} k={v(t, k)} flota={fl(i)}>{arte}</Medallon>
          <text x={x} y={726} textAnchor="middle" className={halo} opacity={tramo(v(t, k), 0.3, 0.8)}>{n}</text>
        </g>
      ))}
      <Medallon x={1060} y={646} r={40} k={pm} flota={fl(3)}>{ArteMujer}</Medallon>
      <text x={1060} y={726} textAnchor="middle" className={halo} opacity={tramo(pm, 0.3, 0.8)}>mujer joven</text>
      <text x={1170} y={664} textAnchor="middle" className={`${s.safSigno} ${s.conHalo}`} style={{ fontSize: 44 }} opacity={tramo(pa, 0, 0.5)}>+</text>
      <Medallon x={1280} y={646} r={40} k={pa} flota={fl(4)}><IconoOrgano i="articulacion" x={0} y={0} k={0.72} /></Medallon>
      <text x={1280} y={726} textAnchor="middle" className={halo} opacity={tramo(pa, 0.3, 0.8)}>dolor articular</text>
    </g>
  );
}

function Rotulos({ t }: { t: T }) {
  const a = v(t, 'lTromb'), b = v(t, 'lLeuc'), c = v(t, 'lPerla');
  return (
    <g>
      <Letrero x={410} y={86} w={560} txt="TROMBOCITOPENIA AUTOINMUNE" k={a} tono="morado" claro><DibujoCelula dibujo="plaqueta" d={44} /></Letrero>
      <text x={424} y={142} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(a, 0.5, 1)}>sangra cuando es grave</text>
      <Letrero x={1180} y={86} w={420} txt="LEUCOPENIA" k={b} tono="azul" claro><DibujoCelula dibujo="leucocito" d={46} /></Letrero>
      <text x={1194} y={142} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(b, 0.5, 1)}>muy frecuente en el lupus</text>
      <Letrero x={800} y={888} w={1000} txt="PIENSA EN LUPUS ANTES QUE EN UNA INFECCIÓN VIRAL" k={c} tono="rojo"><g transform="scale(0.9)">{IconoAlerta}</g></Letrero>
      <text x={812} y={950} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(c, 0.5, 1)}>leucopenia o linfopenia + dolor articular en una mujer joven</text>
    </g>
  );
}

export function CapaSangre({ t, reloj }: { t: T; reloj: number }) {
  const hem = v(t, 'hemolisis');
  return (
    <g className={s.fondo}>
      <DefsSg />
      <TejidoCorte />
      <LuzFija />
      {hem > 0.001 && <path d={LUZ} fill="#D61F3A" opacity={0.32 * hem} />}
      <Flujo hem={hem} quieto={v(t, 'quieto')} reloj={reloj} />
      <RotulosCapas k={v(t, 'capas')} />
      <Letrero x={800} y={86} w={720} txt="HIPERSENSIBILIDAD TIPO II" k={v(t, 't2')} tono="ambar" claro>{IconoY}</Letrero>
      <text x={812} y={142} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(v(t, 't2'), 0.5, 1)}>el anticuerpo se pega directamente a la propia célula</text>
      <NoViaja k={v(t, 'noViaja')} reloj={reloj} />
      <ZoomAntigeno k={v(t, 'zoomAg')} reloj={reloj} />
      <Blancos t={t} />
      <Muertes t={t} reloj={reloj} />
      <Firma t={t} reloj={reloj} />
      {CONTEOS.map((c) => <Conteo key={c.id} c={c} t={t} rl={reloj} />)}
      <Sintomas t={t} rl={reloj} />
      <Rotulos t={t} />
    </g>
  );
}

// ─── Pasos 4 y 5 · antifosfolípidos sobre el vaso del capítulo 5 ──────────────

const V = { cx: 600, cy: 520, luz: 320 };

/** Lo que se ve de la pared: IgG agarradas a la β2-GPI, sobre el endotelio. */
function PuntosDePared({ k, rl }: { k: number; rl: number }) {
  if (k <= 0.001) return null;
  return (
    <g>
      {[-138, -112, -68, -42].map((g, i) => {
        const th = (g * Math.PI) / 180, q = easeOut(tramo(k, i * 0.1, 0.5 + i * 0.1)), R = 300;
        const Ry = lerp(R - 80, 268, q) + Math.sin(rl / 500 + i) * 2;
        return (
          <g key={g} opacity={tramo(k, i * 0.1, 0.3 + i * 0.1)}>
            <g transform={`translate(${f1(V.cx + Math.cos(th) * R)},${f1(V.cy + Math.sin(th) * R)}) rotate(${f1(g + 90)})`}>
              <ellipse rx={17} ry={11} fill="#8A4FCF" stroke="#4E2A86" strokeWidth={1.4} />
              <ellipse cx={-5} cy={-3} rx={6} ry={2.8} fill="#FFF" opacity={0.4} />
            </g>
            <IgG x={V.cx + Math.cos(th) * Ry} y={V.cy + Math.sin(th) * Ry} ang={deg(Math.atan2(Math.cos(th), -Math.sin(th)))} k={0.82} />
          </g>
        );
      })}
    </g>
  );
}

const Beta2 = ({ x, y, ang, cuentas = 5 }: { x: number; y: number; ang: number; cuentas?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${ang})`}>
    {Array.from({ length: cuentas }, (_, i) => {
      const yy = -i * 19, xx = Math.sin(i * 0.8) * 6;
      return <g key={i}><ellipse cx={xx} cy={yy} rx={11.5} ry={10.5} fill={i === cuentas - 1 ? '#C49BEF' : '#8A4FCF'} stroke="#4E2A86" strokeWidth={1.4} /><ellipse cx={xx - 3.6} cy={yy - 3.6} rx={3.8} ry={2} fill="#FFF" opacity={0.5} /></g>;
    })}
  </g>
);

/** La lupa sobre la membrana del endotelio: el blanco real y los frenos que se quedan fuera. */
function LupaMembrana({ a, b, rl }: { a: number; b: number; rl: number }) {
  if (a <= 0.001) return null;
  const R = 178, cx = V.cx, cy = 530, ent = easeOut(tramo(a, 0.2, 1));
  return (
    <g>
      <line x1={cx} y1={240} x2={cx} y2={cy - R - 14} className={s.hiloLupa} opacity={tramo(a, 0, 0.3)} />
      <circle cx={cx} cy={228} r={24} className={s.anilloLupaL} opacity={tramo(a, 0, 0.3)} />
      <Lente id="sg-z2" x={cx} y={cy} r={R} k={a}>
        <rect x={-R} y={78} width={R * 2} height={R} fill="url(#sg-citop)" />
        <Bicapa y={42} w={R * 2} />
        <g opacity={ent}>
          <Beta2 x={-30} y={34} ang={-6} />
          <Beta2 x={30} y={34} ang={6} />
          <g transform={`translate(0,${f1(lerp(-160, -56, ent) + Math.sin(rl / 480) * 2)})`}><IgG x={0} y={-30} ang={180} k={2.3} /></g>
        </g>
        {/* Los frenos que el anticuerpo deja fuera de juego */}
        {b > 0.001 && (
          <g opacity={tramo(b, 0, 0.35)}>
            <g transform={`translate(-112,${f1(-6 + Math.sin(rl / 620) * 3)})`}>
              <Bola x={0} y={0} r={27} c="#2CA99A" txt="PC" />
              <path d="M-26,-26 L26,26 M26,-26 L-26,26" stroke="#E5484D" strokeWidth={6.5} strokeLinecap="round" {...dibujar(tramo(b, 0.3, 0.8))} />
            </g>
            <g transform={`translate(114,${f1(-2 + Math.sin(rl / 620 + 2) * 3)})`}>
              {[[-18, 8], [0, -7], [18, 8]].map(([x, y], j) => <path key={j} d="M-13,-8 L0,-15 L13,-8 V8 L0,15 L-13,8 Z" transform={`translate(${x + (j - 1) * 8 * tramo(b, 0.4, 1)},${y})`} fill="#4F9FC2" stroke="#1F5F82" strokeWidth={1.5} />)}
              <path d="M-30,-26 L30,26 M30,-26 L-30,26" stroke="#E5484D" strokeWidth={6.5} strokeLinecap="round" {...dibujar(tramo(b, 0.45, 1))} />
            </g>
          </g>
        )}
        <g opacity={tramo(a, 0.6, 1)}>
          <text x={-76} y={-92} textAnchor="middle" className={s.sgMini}>anticuerpo</text>
          <line x1={-40} y1={-94} x2={-22} y2={-94} className={s.guia} />
          <text x={92} y={-114} textAnchor="middle" className={s.sgMini}>β2-glico-</text>
          <text x={92} y={-96} textAnchor="middle" className={s.sgMini}>proteína I</text>
          <line x1={72} y1={-86} x2={38} y2={-30} className={s.guia} />
          <text x={-112} y={-44} textAnchor="middle" className={s.sgMini} opacity={tramo(b, 0.3, 0.8)}>proteína C</text>
          <text x={114} y={-44} textAnchor="middle" className={s.sgMini} opacity={tramo(b, 0.3, 0.8)}>anexina V</text>
          <text x={0} y={126} textAnchor="middle" className={s.sgMini} style={{ fill: '#6A1E34' }}>endotelio</text>
        </g>
      </Lente>
      <text x={cx} y={cy + R + 44} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} opacity={tramo(a, 0.6, 1)} style={{ fontSize: 20 }}>{b > 0.5 ? 'Resistentes a las vías anticoagulantes' : 'El blanco real, sobre el fosfolípido'}</text>
    </g>
  );
}

function Plato({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g>
      {[-54, 54].map((dx) => <line key={dx} x1={x} y1={y} x2={x + dx} y2={y + 84} className={s.cadenaBalanza} />)}
      <g transform={`translate(${f1(x)},${f1(y + 84)})`}>
        {children}
        <path d="M-66,0 C-50,28 50,28 66,0 Z" fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1.2} />
        <ellipse rx={66} ry={6} fill="#F2D388" stroke="#6E4C14" strokeWidth={1} />
      </g>
    </g>
  );
}

/** La balanza de latón: los frenos pesan poco y la coagulación mucho. */
function Balanza({ k, rl }: { k: number; rl: number }) {
  if (k <= 0.001) return null;
  const e = easeInOut(tramo(k, 0.15, 1)), ang = 11 * e + Math.sin(rl / 900) * 0.7 * e, rad = (ang * Math.PI) / 180;
  const cx = 1330, cy = 560, B = 164, lx = cx - B * Math.cos(rad), ly = cy - B * Math.sin(rad), rx = cx + B * Math.cos(rad), ry = cy + B * Math.sin(rad), base = 806;
  return (
    <g opacity={tramo(k, 0, 0.25)}>
      <ellipse cx={cx} cy={base + 4} rx={94} ry={9} className={s.sombraSuave} />
      <path d={`M${cx - 82},${base} L${cx - 64},${base - 24} H${cx + 64} L${cx + 82},${base} Z`} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1.2} />
      <path d={`M${cx - 36},${base - 24} C${cx - 20},${base - 34} ${cx - 13},${base - 50} ${cx - 8},${base - 74} H${cx + 8} C${cx + 13},${base - 50} ${cx + 20},${base - 34} ${cx + 36},${base - 24} Z`} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
      <rect x={cx - 7} y={cy} width={14} height={base - cy - 70} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      {[cy + 66, cy + 120].map((y) => <rect key={y} x={cx - 11} y={y} width={22} height={7} rx={3} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={0.8} />)}
      <path d={`M${cx - 44},${cy - 22} A52,52 0 0 1 ${cx + 44},${cy - 22}`} className={s.escalaBalanza} />
      {[-30, -15, 0, 15, 30].map((a) => <line key={a} x1={cx + Math.sin((a * Math.PI) / 180) * 48} y1={cy + 8 - Math.cos((a * Math.PI) / 180) * 48} x2={cx + Math.sin((a * Math.PI) / 180) * 56} y2={cy + 8 - Math.cos((a * Math.PI) / 180) * 56} className={s.marcaBalanza} />)}
      <path d={`M${cx - 3},${cy} L${cx},${cy - 50} L${cx + 3},${cy} Z`} fill="#C2385A" transform={`rotate(${f1(ang * 2.6)} ${cx} ${cy})`} />
      <g transform={`rotate(${f1(ang)} ${cx} ${cy})`}>
        <path d={`M${cx - B - 6},${cy - 3} C${cx - 80},${cy - 6} ${cx - 30},${cy - 11} ${cx},${cy - 12} C${cx + 30},${cy - 11} ${cx + 80},${cy - 6} ${cx + B + 6},${cy - 3} V${cy + 3} C${cx + 80},${cy + 6} ${cx + 30},${cy + 11} ${cx},${cy + 12} C${cx - 30},${cy + 11} ${cx - 80},${cy + 6} ${cx - B - 6},${cy + 3} Z`} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.1} />
        <path d={`M${cx - B + 6},${cy - 1.5} L${cx + B - 6},${cy - 1.5}`} stroke="#FFF" strokeWidth={1.4} opacity={0.65} />
      </g>
      <Plato x={lx} y={ly}>
        <Bola x={-22} y={-13} r={13} c="#2CA99A" txt="PC" /><Bola x={16} y={-13} r={13} c="#4F9FC2" txt="AV" />
      </Plato>
      <Plato x={rx} y={ry}>
        {[[-34, -11, 0], [-11, -11, 40], [13, -11, 80], [36, -11, 110], [-23, -32, 120], [2, -32, 160], [26, -32, 30], [-9, -52, 70], [14, -52, 200]].map(([x, y, r], j) => <PlaquetaActiva key={j} x={x} y={y} r={15} rot={r} />)}
        <path d="M-44,-8 L-14,-58 M44,-8 L14,-58" stroke="#C0262E" strokeWidth={2} strokeLinecap="round" opacity={0.45} />
      </Plato>
      <circle cx={lx} cy={ly} r={6} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={0.8} />
      <circle cx={rx} cy={ry} r={6} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={0.8} />
      <circle cx={cx} cy={cy} r={12} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={1} />
      <circle cx={cx} cy={cy} r={4} fill="#6E4C14" />
      <text x={lx} y={ly + 124} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>frenos</text>
      <text x={rx} y={ry + 124} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>coagulación</text>
    </g>
  );
}

const ANTI = [
  { k: 'aflE1', y: 352, c: '#D9881E', sig: 'AL', nombre: 'Anticoagulante lúpico' },
  { k: 'aflE2', y: 402, c: '#C0397A', sig: 'aCL', nombre: 'Anticardiolipina' },
  { k: 'aflE3', y: 452, c: '#7B4FC9', sig: 'aβ2', nombre: 'Anti-β2-glicoproteína I' },
];

function Datos({ t, rl }: { t: T; rl: number }) {
  const d = v(t, 'aflD'), g = v(t, 'aflG');
  const C = 2 * Math.PI * 50, barre = easeOut(d);
  return (
    <g>
      <Letrero x={1340} y={72} w={440} txt="ANTIFOSFOLÍPIDOS" k={v(t, 'aflT')} tono="morado" claro><g transform="scale(1.1)"><IgG x={0} y={4} ang={0} k={0.8} /></g></Letrero>
      {d > 0.001 && (
        <g opacity={tramo(d, 0, 0.25)}>
          <circle cx={1176} cy={232} r={68} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
          <circle cx={1176} cy={232} r={62} fill="url(#sg-lente)" />
          <g transform="translate(1176,232) rotate(-90)">
            <circle r={50} fill="none" stroke="#9AA3B8" strokeOpacity={0.35} strokeWidth={17} />
            <circle r={50} fill="none" stroke="#F2B66B" strokeWidth={17} strokeDasharray={`${C * 0.4 * barre} ${C}`} />
            <circle r={50} fill="none" stroke="#E0892E" strokeWidth={17} strokeDasharray={`${C * 0.2 * barre} ${C}`} />
          </g>
          <text x={1264} y={232} className={`${s.sgNum} ${s.conHalo}`} style={{ fontSize: 50, fill: 'var(--texto)' }}>20 a 40 %</text>
          <text x={1264} y={266} className={halo} style={{ fontSize: 20 }}>de los pacientes con lupus</text>
        </g>
      )}
      {ANTI.map((a, i) => {
        const k = v(t, a.k);
        if (k <= 0.001) return null;
        return (
          <g key={a.k} opacity={tramo(k, 0, 0.4)} transform={`translate(${lerp(30, 0, easeOut(k))},${f1(Math.sin(rl / 700 + i * 2) * 2)})`}>
            <circle cx={1138} cy={a.y} r={22} fill={a.c} /><circle cx={1138} cy={a.y} r={22} fill="url(#sg-bola)" />
            <text x={1138} y={a.y} dy="0.36em" textAnchor="middle" className={s.protTxt}>{a.sig}</text>
            <IgG x={1186} y={a.y + 6} ang={0} k={0.55} />
            <text x={1214} y={a.y} dy="0.36em" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 22 }}>{a.nombre}</text>
          </g>
        );
      })}
      <Sello x={1330} y={892} w={500} txt="HIPERCOAGULABILIDAD" k={g} sz={30} rot={-2.5} />
    </g>
  );
}

/** Dentro del vaso: el endotelio se enciende y las plaquetas se pegan en estrella. */
function Activacion({ f, p, pl, rl }: { f: number; p: number; pl: number; rl: number }) {
  // El trombo crece desde la pared hacia la luz: fibrina, hematíes atrapados y plaquetas.
  const crece = easeOut(p), a0 = Math.PI - 0.4, a1 = Math.PI + 0.4, pared = V.luz + 4, N = 22;
  const px = (r: number, a: number) => V.cx + Math.cos(a) * r, py = (r: number, a: number) => V.cy + Math.sin(a) * r;
  const relieve = Array.from({ length: N + 1 }, (_, i) => {
    const q = i / N, a = a1 + (a0 - a1) * q, perfil = Math.sin(q * Math.PI) ** 0.42, lobulo = q < 0.06 || q > 0.94 ? 1 : 1 + 0.06 * Math.sin(i * 0.95);
    const r = pared - (30 + 118 * crece) * perfil * lobulo;
    return [px(r, a), py(r, a)];
  });
  const contorno = relieve.map(([x, y], i) => {
    if (!i) return `L${f1(x)},${f1(y)}`;
    const [x0, y0] = relieve[i - 1];
    return `Q${f1(x0)},${f1(y0)} ${f1((x0 + x) / 2)},${f1((y0 + y) / 2)}`;
  }).join(' ');
  const pico = pared - 30 - 118 * crece;
  return (
    <g>
      {f > 0.001 && <circle cx={V.cx} cy={V.cy} r={V.luz + 3} fill="none" stroke="#E5484D" strokeWidth={11} opacity={tramo(f, 0, 0.4) * (0.34 + 0.18 * Math.sin(rl / 260))} />}
      {p > 0.001 && (
        <g opacity={tramo(p, 0, 0.25)}>
          <path d={`M${f1(px(pared, a0))},${f1(py(pared, a0))} A${pared},${pared} 0 0 1 ${f1(px(pared, a1))},${f1(py(pared, a1))} ${contorno} L${f1(px(pared, a0))},${f1(py(pared, a0))} Z`} fill="url(#sg-coag)" stroke="#3E0A16" strokeWidth={1.4} strokeLinejoin="round" />
          {Array.from({ length: 7 }, (_, i) => { const a = a0 + 0.1 + (i / 6) * 0.64, r0 = pared - 8, r1 = lerp(pared - 16, pico + 22, 0.55 + 0.45 * Math.sin(((i + 0.5) / 7) * Math.PI)); return <path key={i} d={`M${f1(px(r0, a))},${f1(py(r0, a))} Q${f1(px((r0 + r1) / 2, a + 0.05))},${f1(py((r0 + r1) / 2, a + 0.05))} ${f1(px(r1, a - 0.02))},${f1(py(r1, a - 0.02))}`} fill="none" stroke="#F4A9B4" strokeWidth={2} strokeLinecap="round" opacity={0.55} />; })}
          {Array.from({ length: 6 }, (_, i) => { const a = Math.PI + (hash(i, 23) - 0.5) * 0.6, r = lerp(pared - 16, pico + 24, hash(i, 24)), q = 0.42 + hash(i, 25) * 0.18; return <use key={i} href="#sg-rbc" transform={`translate(${f1(px(r, a))},${f1(py(r, a))}) rotate(${i * 50}) scale(${q.toFixed(2)},${(q * 0.8).toFixed(2)})`} opacity={tramo(p, 0.2 + i * 0.1, 0.5 + i * 0.1)} />; })}
        </g>
      )}
      {p > 0.001 && Array.from({ length: 11 }, (_, i) => {
        const a = Math.PI + (hash(i, 19) - 0.5) * 0.62, r = V.luz - 18 - hash(i, 20) * 62, q = easeBack(tramo(p, i * 0.05, 0.45 + i * 0.05));
        return q > 0.01 ? <PlaquetaActiva key={i} x={V.cx + Math.cos(a) * r} y={V.cy + Math.sin(a) * r} r={15 * q} rot={rl / 60 + i * 30} /> : null;
      })}
      <g opacity={tramo(f, 0.2, 0.7)}>
        <text x={1010} y={232} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>endotelio</text>
        <text x={1010} y={256} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>activado</text>
        <FlechaSuave a={{ x: 980, y: 268 }} c={{ x: 918, y: 300 }} b={{ x: 872, y: 340 }} k={tramo(f, 0.3, 1)} color="#E5484D" grosor={5} />
      </g>
      <g opacity={tramo(pl, 0.2, 0.7)}>
        <text x={120} y={150} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>plaquetas</text>
        <text x={120} y={174} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 19 }}>activadas</text>
        <FlechaSuave a={{ x: 142, y: 188 }} c={{ x: 210, y: 300 }} b={{ x: 300, y: 440 }} k={tramo(pl, 0.3, 1)} color="#7B4FC9" grosor={5} />
      </g>
    </g>
  );
}

// ─── Paso 5 · el tubo y el cronómetro ─────────────────────────────────────────

function TuboEnsayo({ k, c, rl }: { k: number; c: number; rl: number }) {
  if (k <= 0.001) return null;
  const q = tramo(k, 0, 0.35), x = 1150, y = 400;
  // Una vuelta de la aguja: lo normal (verde) y lo que tarda de más con el anticuerpo (rojo).
  const barre = easeInOut(c), normal = 0.5 * TAU, ang = barre * 0.94 * TAU;
  const R = 86, cx = 1400, cy = 410;
  const sector = (a0: number, a1: number, r: number) => {
    const p = (a: number) => `${f1(Math.cos(a - Math.PI / 2) * r)},${f1(Math.sin(a - Math.PI / 2) * r)}`;
    return `M0,0 L${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
  };
  return (
    <g opacity={q}>
      {/* Gradilla de acero y el tubo con plasma y anticuerpos sobre el reactivo */}
      <ellipse cx={x} cy={y + 210} rx={108} ry={9} className={s.sombraSuave} />
      <rect x={x - 96} y={y + 186} width={192} height={18} rx={5} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      {[-82, 82].map((dx) => <rect key={dx} x={x + dx - 5} y={y + 50} width={10} height={140} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.8} />)}
      <rect x={x - 96} y={y + 42} width={192} height={14} rx={4} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      <path d={`M${x - 40},${y - 20} L${x - 40},${y + 150} A40,30 0 0 0 ${x + 40},${y + 150} L${x + 40},${y - 20} Z`} fill="url(#sg-plasmaTubo)" />
      {Array.from({ length: 11 }, (_, i) => {
        const yy = y + 2 + hash(i, 3) * 150 + Math.sin(rl / 600 + i) * 3, xx = x - 28 + hash(i, 4) * 56;
        return (
          <g key={i}>
            <circle cx={xx} cy={yy} r={8.4} fill="#F4A63A" stroke="#9A5E14" strokeWidth={1.2} />
            <circle cx={xx - 2.4} cy={yy - 2.6} r={2.4} fill="#FFF" opacity={0.7} />
            {i % 2 === 0 && <IgG x={xx + 4} y={yy - 18} ang={160} k={0.44} />}
          </g>
        );
      })}
      <path d={`M${x - 44},${y - 110} L${x - 44},${y + 150} A44,34 0 0 0 ${x + 44},${y + 150} L${x + 44},${y - 110}`} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3.4} />
      <rect x={x - 52} y={y - 124} width={104} height={15} rx={6} fill="#9AA6B8" stroke="#5C6577" strokeWidth={1} />
      <path d={`M${x - 29},${y - 96} V${y + 142}`} stroke="#FFF" strokeWidth={5.4} strokeLinecap="round" opacity={0.6} />
      <g opacity={tramo(k, 0.45, 1)}>
        <text x={x} y={y + 246} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>En el tubo</text>
        <text x={x} y={y + 270} textAnchor="middle" className={halo}>ocupa el fosfolípido del reactivo</text>
      </g>
      {/* Cronómetro de acero */}
      <g transform={`translate(${cx},${cy})`} opacity={tramo(k, 0.25, 0.7)}>
        <ellipse cx={3} cy={R + 28} rx={R * 0.8} ry={8} className={s.sombraSuave} />
        <rect x={-13} y={-R - 34} width={26} height={24} rx={4} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1} />
        <rect x={-7} y={-R - 18} width={14} height={14} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={0.8} />
        <circle r={R + 11} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.1} />
        <circle r={R} fill="url(#sg-lente)" />
        {ang > 0.01 && <path d={sector(0, Math.min(ang, normal), R - 5)} fill="#1F9A6A" opacity={0.35} />}
        {ang > normal && <path d={sector(normal, ang, R - 5)} fill="#E5484D" opacity={0.42} />}
        <text x={36} y={6} textAnchor="middle" className={s.sgMini} opacity={tramo(c, 0.3, 0.6)}>normal</text>
        <text x={-38} y={6} textAnchor="middle" className={s.sgMini} opacity={tramo(c, 0.65, 0.9)}>de más</text>
        {Array.from({ length: 12 }, (_, j) => { const a = (j / 12) * TAU; return <line key={j} x1={Math.cos(a) * (R - 12)} y1={Math.sin(a) * (R - 12)} x2={Math.cos(a) * (R - 3)} y2={Math.sin(a) * (R - 3)} stroke="#5C6577" strokeWidth={j % 3 ? 2 : 3.6} />; })}
        <g transform={`rotate(${f1(deg(ang))})`}>
          <path d={`M-3.5,14 L0,${-R + 14} L3.5,14 Z`} fill="#C2385A" stroke="#7A1E34" strokeWidth={0.9} />
        </g>
        <circle r={9} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={1} />
        <path d={`M${f1(-R * 0.76)},${f1(-R * 0.3)} A${f1(R * 0.82)},${f1(R * 0.82)} 0 0 1 ${f1(-R * 0.2)},${f1(-R * 0.78)}`} fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
      </g>
      <g opacity={tramo(c, 0.1, 0.5)}>
        <text x={cx} y={cy + R + 66} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>TTPa alargado</text>
        <text x={cx} y={cy + R + 90} textAnchor="middle" className={halo}>parece un anticoagulante</text>
      </g>
    </g>
  );
}

const ArteVasoTrombo = (
  <g>
    <rect x={-46} y={-20} width={92} height={40} rx={4} fill="#F7C9BA" />
    <rect x={-46} y={-20} width={92} height={7} fill="#C7506E" /><rect x={-46} y={13} width={92} height={7} fill="#C7506E" />
    <path d="M-20,-13 C-12,-8 -10,4 -18,13 H22 C14,5 16,-8 24,-13 Z" fill="url(#sg-coag)" />
    <path d="M-10,-8 L-2,6 M4,-10 L10,8 M14,-8 L16,2" stroke="#FF8FA8" strokeWidth={1.8} strokeLinecap="round" />
  </g>
);

function Ecuacion({ t, rl }: { t: T; rl: number }) {
  const a = v(t, 'eq1'), b = v(t, 'eq2'), c = v(t, 'eq3'), n = v(t, 'noSang');
  return (
    <g>
      <Medallon x={1120} y={850} r={40} k={a} flota={Math.sin(rl / 700) * 2}>
        <circle r={27} fill="#FFF" stroke="#5C6577" strokeWidth={3} />
        <path d={`M0,0 V-19 M0,0 L${f1(Math.sin(rl / 500) * 6 + 11)},5`} stroke={L.lupus} strokeWidth={4} strokeLinecap="round" />
      </Medallon>
      <text x={1120} y={928} textAnchor="middle" className={halo} opacity={tramo(a, 0.3, 0.8)}>TTPa largo</text>
      <text x={1198} y={866} textAnchor="middle" className={`${s.safSigno} ${s.conHalo}`} style={{ fontSize: 44 }} opacity={tramo(b, 0, 0.4)}>+</text>
      <Medallon x={1276} y={850} r={40} k={b} flota={Math.sin(rl / 700 + 1.5) * 2}><g transform="scale(0.8)">{ArteVasoTrombo}</g></Medallon>
      <text x={1276} y={928} textAnchor="middle" className={halo} opacity={tramo(b, 0.3, 0.8)}>trombosis</text>
      <FlechaSuave a={{ x: 1332, y: 850 }} c={{ x: 1344, y: 846 }} b={{ x: 1378, y: 850 }} k={tramo(c, 0, 0.5)} color={L.lupus} grosor={6} />
      <Sello x={1480} y={850} w={194} txt="ANTIFOSFOLÍPIDOS" k={tramo(c, 0.2, 1)} sz={15} rot={-3} />
      <g opacity={tramo(n, 0, 0.6)}>
        <g transform="translate(1420,926)">
          <path d="M0,-13 C-6,-3 -10,2 -10,7 A10,10 0 0 0 10,7 C10,2 6,-3 0,-13 Z" fill="#E5484D" />
          <path d="M-15,-9 L15,16" stroke="var(--texto)" strokeWidth={3.4} strokeLinecap="round" />
        </g>
        <text x={1444} y={934} className={halo}>no es un sangrado</text>
      </g>
    </g>
  );
}

export function CapaAfl({ t, reloj }: { t: T; reloj: number }) {
  return (
    <g>
      <DefsSg />
      <PuntosDePared k={v(t, 'aflF')} rl={reloj} />
      <Activacion f={v(t, 'aflF')} p={v(t, 'aflP')} pl={v(t, 'aflPL')} rl={reloj} />
      <LupaMembrana a={v(t, 'aflA')} b={v(t, 'aflB')} rl={reloj} />
      <Balanza k={v(t, 'aflC')} rl={reloj} />
      <Datos t={t} rl={reloj} />
      <TuboEnsayo k={v(t, 'tubo')} c={v(t, 'crono')} rl={reloj} />
      {v(t, 'cuerp') > 0.001 && (
        <g opacity={tramo(v(t, 'cuerp'), 0, 0.4)}>
          <text x={150} y={130} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Trombo en el vaso</text>
          <text x={150} y={156} textAnchor="middle" className={halo}>plaquetas + fibrina</text>
          <FlechaSuave a={{ x: 170, y: 170 }} c={{ x: 240, y: 290 }} b={{ x: 300, y: 440 }} k={tramo(v(t, 'cuerp'), 0.3, 1)} color={L.lupus} grosor={6} />
        </g>
      )}
      <Letrero x={1310} y={744} w={500} txt="EN EL CUERPO: TROMBOSIS" k={v(t, 'cuerpoL')} tono="rojo">{IconoAlerta}</Letrero>
      <Ecuacion t={t} rl={reloj} />
    </g>
  );
}

// ─── Paso 6 · el síndrome antifosfolipídico ───────────────────────────────────

/** Trombo en una vena con su válvula: rojo con líneas de Zahn y hematíes atrapados. */
export function ArteTrombosis({ rl }: { rl: number }) {
  const R = 74;
  return (
    <g>
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="#F4C9B4" />
      <path d={`M${-R},-46 C-30,-54 30,-40 ${R},-48 V48 C30,40 -30,54 ${-R},46 Z`} fill="#FFE9CE" />
      <path d={`M${-R},-46 C-30,-54 30,-40 ${R},-48`} fill="none" stroke="#B5486A" strokeWidth={13} />
      <path d={`M${-R},46 C-30,54 30,40 ${R},48`} fill="none" stroke="#B5486A" strokeWidth={13} />
      <path d={`M${-R},-53 C-30,-61 30,-47 ${R},-55 M${-R},53 C-30,61 30,47 ${R},55`} fill="none" stroke="#F6D7A8" strokeWidth={2.4} />
      {[0, 1, 2].map((j) => { const f = (rl / 1500 + j / 3) % 1; return <g key={j} transform={`translate(${f1(lerp(-90, -30, f))},${(j - 1) * 22}) scale(0.5)`} opacity={1 - f * f}><use href="#sg-rbc" /></g>; })}
      <path d="M-22,-46 C-34,-22 -30,22 -20,46 H56 C46,18 50,-22 60,-46 Z" fill="url(#sg-coag)" />
      {[-6, 8, 22, 36].map((x) => <path key={x} d={`M${x},-42 C${x - 10},-14 ${x - 10},14 ${x},42`} fill="none" stroke="#F4A9B4" strokeWidth={2} opacity={0.7} />)}
      {[[-4, -22], [20, 4], [30, -24], [8, 28], [38, 26]].map(([x, y], j) => <g key={j} transform={`translate(${x},${y}) scale(0.38)`}><use href="#sg-rbc" /></g>)}
    </g>
  );
}

export function ArteObstetrica({ rl }: { rl: number }) {
  return (
    <g transform="translate(0,4)">
      <path d="M-58,-44 C-64,-66 -30,-70 0,-62 C30,-70 64,-66 58,-44 C52,-6 26,26 14,46 V62 H-14 V46 C-26,26 -52,-6 -58,-44 Z" fill="url(#sg-utero)" stroke="#7E2A4A" strokeWidth={2} />
      <path d="M-42,-42 C-40,-14 -16,16 -6,32 H6 C16,16 40,-14 42,-42 C20,-52 -20,-52 -42,-42 Z" fill="#FBE0E4" stroke="#B85A78" strokeWidth={1.4} />
      {/* Placenta con infartos y saco que no prospera */}
      <path d="M-30,-42 C-14,-50 14,-50 30,-42 C22,-30 -22,-30 -30,-42 Z" fill="#A83048" />
      {[[-13, -40], [8, -41], [19, -38]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={4} fill="#3A0A18" />)}
      <circle cx={2} cy={-8} r={20} fill="#FFF3F6" stroke="#C47A94" strokeWidth={1.4} />
      <g transform={`rotate(${f1(Math.sin(rl / 900) * 3)} 2 -8)`}>
        <circle cx={-3} cy={-13} r={7} fill="#E9A07A" />
        <path d="M2,-8 C11,-7 12,3 5,5" fill="none" stroke="#E9A07A" strokeWidth={5} strokeLinecap="round" />
      </g>
      <path d="M-24,-30 L28,14" stroke="#E5484D" strokeWidth={5.6} strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

function ArtePersisten({ rl }: { rl: number }) {
  const tubo = (x: number) => (
    <g transform={`translate(${x},4)`}>
      <path d="M-13,-8 L-13,28 A13,10 0 0 0 13,28 L13,-8 Z" fill="#C0397A" />
      {[0, 1, 2].map((j) => <IgG key={j} x={-6 + j * 6} y={2 + j * 8} ang={j * 40} k={0.3} />)}
      <path d="M-14,-34 L-14,28 A14,11 0 0 0 14,28 L14,-34" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={2.2} />
      <rect x={-17} y={-40} width={34} height={8} rx={3} fill="#9AA6B8" />
    </g>
  );
  return (
    <g>
      {tubo(-44)}
      <path d="M-22,8 C-10,-2 2,-2 12,6" fill="none" stroke="#8E9AAC" strokeWidth={3} strokeLinecap="round" strokeDasharray="1 6" />
      {tubo(40)}
      <g transform={`translate(-3,-44) rotate(${f1(Math.sin(rl / 900) * 2)})`}>
        <rect x={-24} y={-20} width={48} height={40} rx={5} fill="#FFF" stroke="#5B6475" strokeWidth={1.8} />
        <rect x={-24} y={-20} width={48} height={12} rx={4} fill="#C2385A" />
        <text y={13} textAnchor="middle" className={s.tarjTit} style={{ fontSize: 15 }}>12 sem</text>
      </g>
    </g>
  );
}

const CRITERIOS = [
  { k: 'crit1', y: 244, arte: (rl: number) => <ArteTrombosis rl={rl} />, t: 'Trombosis', sub: 'venosa o arterial' },
  { k: 'crit2', y: 440, arte: (rl: number) => <ArteObstetrica rl={rl} />, t: 'Morbilidad obstétrica', sub: 'abortos del primer trimestre' },
  { k: 'crit3', y: 636, arte: (rl: number) => <ArtePersisten rl={rl} />, t: 'Anticuerpos que persisten', sub: 'en pruebas repetidas' },
];

function Signo({ x, y, k, txt }: { x: number; y: number; k: number; txt: string }) {
  if (k <= 0.001) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * easeBack(clamp(k))})`} opacity={tramo(k, 0, 0.4)}>
      <circle cx={3} cy={5} r={22} className={s.globoSombra} /><circle r={22} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} /><circle r={17} fill="#FFF" />
      <text dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 25 }}>{txt}</text>
    </g>
  );
}

const ArtePersona = ({ x, y, f, o }: { x: number; y: number; f: string; o: number }) => (
  <g opacity={o} fill={f} transform={`translate(${x},${y})`}>
    <circle cy={-8} r={7.4} />
    <path d="M-11.6,14 C-11.6,1.4 -6,-.4 0,-.4 C6,-.4 11.6,1.4 11.6,14 Z" />
    <ellipse cx={-2.4} cy={-10.4} rx={2.4} ry={1.4} fill="#FFF" opacity={0.45} />
  </g>
);

const EmbarazoIcono = (
  <g transform="scale(0.72)">
    <circle cy={-22} r={10.5} fill="#EFC4A6" />
    <path d="M-10,-26 C-11,-36 11,-36 10,-26 C7,-31 -7,-31 -10,-26 Z" fill="#4A2C20" />
    <path d="M-12,30 L-9,-8 C-8,-13 8,-13 10,-8 C14,-3 19,4 19,11 C19,18 13,21 9,21 L12,30 Z" fill="#7B4FC9" />
    <path d="M6,0 C12,2 15,8 14,12" fill="none" stroke="#FFF" strokeWidth={2} strokeLinecap="round" opacity={0.5} />
  </g>
);

const TejidoSaf = memo(function TejidoSaf() {
  return (
    <g>
      <rect x={-800} y={-800} width={3200} height={2600} fill="url(#sg-saf)" />
      <Adventicia y0={0} y1={1000} sem={91} grasa={[...GRASA_ARR, ...GRASA_ABA, [650, 980], [706, 972], [760, 986], [1570, 60], [1518, 40]]} nervio={[1450, 850]} vena={[
        'M-800,170 L-20,170 C200,120 420,190 640,150 S1060,86 1280,136 S1500,190 1620,150 L2400,150',
        'M-800,152 L-20,152 C200,102 420,172 640,132 S1060,68 1280,118 S1500,172 1620,132 L2400,132',
        'M-800,822 L-20,822 C220,860 420,800 660,842 S1100,900 1620,812 L2400,812',
        'M-800,840 L-20,840 C220,878 420,818 660,860 S1100,918 1620,830 L2400,830',
      ]} />
    </g>
  );
});

export function FondoSaf({ t, reloj }: { t: T; reloj: number }) {
  const pic = v(t, 'pic'), psaf = v(t, 'picSaf'), neq = v(t, 'neq'), ll = v(t, 'llave'), emb = v(t, 'emb'), pct = v(t, 'pct');
  const llave = easeOut(tramo(ll, 0, 0.6)), medalla = tramo(ll, 0.4, 1);
  return (
    <g>
      <DefsSg />
      <TejidoSaf />
      <Letrero x={500} y={84} w={340} txt="ANTICUERPOS" k={neq} tono="morado" claro><g transform="scale(1.1)"><IgG x={0} y={4} ang={0} k={0.8} /></g></Letrero>
      {neq > 0.001 && (
        <g transform={`translate(800,84) scale(${0.6 + 0.4 * easeBack(tramo(neq, 0.2, 0.8))}) rotate(${f1(Math.sin(reloj / 500) * 3)})`} opacity={tramo(neq, 0.2, 0.7)}>
          <circle cx={3} cy={6} r={44} className={s.globoSombra} /><circle r={44} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} /><circle r={36} fill="#FFF" />
          <text dy="0.36em" textAnchor="middle" className={s.tarjTit} style={{ fontSize: 58, fill: L.lupus }}>≠</text>
        </g>
      )}
      <Letrero x={1100} y={84} w={340} txt="SÍNDROME" k={tramo(neq, 0.2, 1)} tono="rojo">{IconoAlerta}</Letrero>
      {/* Número grande y 100 pacientes */}
      <g opacity={tramo(pct, 0, 0.4)} transform={`translate(0,${lerp(18, 0, easeOut(pct))})`}>
        <text x={330} y={232} textAnchor="middle" className={`${s.sgNum} ${s.conHalo}`} style={{ fontSize: 76, fill: L.lupus }}>5 a 10 %</text>
        <text x={330} y={268} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`} style={{ fontSize: 20 }}>desarrolla un síndrome antifosfolipídico</text>
      </g>
      <g>
        {Array.from({ length: 100 }, (_, i) => {
          const x = 138 + (i % 10) * 43, y = 316 + Math.floor(i / 10) * 44;
          const o = tramo(pic, (i / 100) * 0.6, (i / 100) * 0.6 + 0.4);
          const amb = i < 30 ? tramo(psaf, 0, 0.5) : 0, roj = i < 8 ? tramo(psaf, 0.5, 1) : 0;
          return (
            <g key={i}>
              <ArtePersona x={x} y={y} f="url(#sg-per)" o={o} />
              {amb > 0.01 && <ArtePersona x={x} y={y} f="#E0892E" o={amb * o} />}
              {roj > 0.01 && <ArtePersona x={x} y={y} f={L.lupus} o={roj * o} />}
            </g>
          );
        })}
        <g opacity={tramo(psaf, 0.2, 0.7)}>
          <circle cx={132} cy={762} r={7} fill={L.lupus} /><text x={148} y={768} className={halo}>con síndrome: 5 a 10 %</text>
          <circle cx={344} cy={762} r={7} fill="#E0892E" /><text x={360} y={768} className={halo}>con anticuerpos: 20 a 40 %</text>
        </g>
      </g>
      {CRITERIOS.map((c, i) => {
        const k = v(t, c.k);
        return (
          <g key={c.k}>
            <Lente id={`sg-saf${i}`} x={800} y={c.y} r={72} k={k} flota={Math.sin(reloj / 700 + i * 2) * 3}>{c.arte(reloj)}</Lente>
            <g opacity={tramo(k, 0.3, 0.8)}>
              <text x={900} y={c.y - 4} className={`${s.sgNombre} ${s.conHalo}`}>{c.t}</text>
              <text x={900} y={c.y + 26} className={halo} style={{ fontSize: 20 }}>{c.sub}</text>
            </g>
          </g>
        );
      })}
      <Signo x={800} y={342} k={v(t, 'crit2')} txt="o" />
      <Signo x={800} y={538} k={v(t, 'crit3')} txt="+" />
      {ll > 0.001 && (
        <g opacity={tramo(ll, 0, 0.3)}>
          <path d="M1262,180 C1296,180 1300,216 1300,250 L1300,390 C1300,420 1312,440 1334,440 C1312,440 1300,460 1300,490 L1300,630 C1300,664 1296,700 1262,700" fill="none" stroke={L.lupus} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - llave} />
          <g transform={`translate(1432,440) scale(${0.5 + 0.5 * easeBack(medalla)})`} opacity={medalla}>
            <circle cx={5} cy={8} r={86} className={s.globoSombra} />
            {Array.from({ length: 20 }, (_, j) => { const a = (j / 20) * TAU; return <circle key={j} cx={Math.cos(a) * 80} cy={Math.sin(a) * 80} r={12} fill="#8A1E3C" />; })}
            <circle r={80} fill="url(#sg-t-rojo)" />
            <circle r={66} fill="none" stroke="#FFF" strokeWidth={2} strokeDasharray="3 6" opacity={0.65} />
            <text dy="0.36em" textAnchor="middle" className={s.safGrande} style={{ fontSize: 50 }}>SAF</text>
          </g>
        </g>
      )}
      <Letrero x={800} y={898} w={940} txt="PLANEA UN EMBARAZO → SE BUSCAN ESTOS ANTICUERPOS" k={emb} tono="verde" claro>{EmbarazoIcono}</Letrero>
      <text x={812} y={960} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={tramo(emb, 0.6, 1)}>saberlo a tiempo cambia el pronóstico</text>
    </g>
  );
}
