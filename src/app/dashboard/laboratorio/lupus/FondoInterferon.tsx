'use client';
// Láminas del capítulo 3 («La firma del interferón»). También el capítulo 11
// reutiliza el endosoma (con `ph` y `bloqueo`).
//
// · `espacio`: el líquido entre las células, donde flota el ácido nucleico suelto
//   y las nucleasas se lo comen (`nucleasa`).
// · `endosoma`: el interior de una célula dendrítica plasmocitoide en corte, con
//   sus organelos: el endosoma ácido con TLR7 y TLR9 en la membrana, el complejo
//   que llega (caballo de Troya), MyD88 e IRF7 hasta el núcleo, el gen del IFN-α,
//   su ARNm y el interferón que sale.
// · `firma`: mapa de calor de genes estimulados por interferón (sanos frente a
//   pacientes con lupus) con un leucocito encendido al lado.
// · `red`: la NET que despliega el neutrófilo sobre el endotelio, con histonas,
//   proteínas de gránulos y bacterias atrapadas; arriba, las fases de la NETosis.
// · `circulo`: el fondo del círculo vicioso; cada paso gana su ilustración.

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ComplejoNuc, IgG } from './Celulas';
import { dibujar, easeBack, easeOut, Globo, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const DefsInterferon = memo(function DefsInterferon() {
  return (
    <defs>
      <linearGradient id="if-fondo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className={s.ifF1} /><stop offset="1" className={s.ifF2} /></linearGradient>
      <radialGradient id="if-cito" cx="0.5" cy="0.5" r="0.62"><stop offset="0" className={s.ifC1} /><stop offset="0.8" className={s.ifC2} /><stop offset="1" className={s.ifC3} /></radialGradient>
      <radialGradient id="if-lumen" cx="0.42" cy="0.38" r="0.75"><stop offset="0" className={s.ifL1} /><stop offset="1" className={s.ifL2} /></radialGradient>
      <radialGradient id="if-nucleo" cx="0.4" cy="0.34" r="0.78"><stop offset="0" className={s.ifN1} /><stop offset="1" className={s.ifN2} /></radialGradient>
      <radialGradient id="if-burbuja" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#D9C8F5" stopOpacity="0.75" /><stop offset="1" stopColor="#8E74C9" stopOpacity="0.4" /></radialGradient>
      <radialGradient id="if-burbuja2" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#C4E0F6" stopOpacity="0.75" /><stop offset="1" stopColor="#6E9CCF" stopOpacity="0.4" /></radialGradient>
      <radialGradient id="if-dnasa" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#7FE0C8" /><stop offset="1" stopColor="#14796A" /></radialGradient>
      <radialGradient id="if-myd" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFD08A" /><stop offset="1" stopColor="#C96A18" /></radialGradient>
      <radialGradient id="if-irf" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFB3A0" /><stop offset="1" stopColor="#B83A2A" /></radialGradient>
      <radialGradient id="if-ifn"><stop offset="0" stopColor="#FFB74A" stopOpacity="0.9" /><stop offset="1" stopColor="#E8622A" stopOpacity="0" /></radialGradient>
      <radialGradient id="if-troya"><stop offset="0.55" stopColor="#FFC93E" stopOpacity="0" /><stop offset="0.85" stopColor="#FFC93E" stopOpacity="0.55" /><stop offset="1" stopColor="#FFC93E" stopOpacity="0" /></radialGradient>
      <linearGradient id="if-tejido" x1="0" y1="0" x2="0" y2="1"><stop offset="0" className={s.ifT1} /><stop offset="1" className={s.ifT2} /></linearGradient>
      <linearGradient id="if-luzvaso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" className={s.ifV1} /><stop offset="1" className={s.ifV2} /></linearGradient>
      <radialGradient id="if-endo" cx="0.42" cy="0.3" r="0.85"><stop offset="0" stopColor="#F0B8C4" /><stop offset="1" stopColor="#B86A84" /></radialGradient>
      <radialGradient id="if-hem" cx="0.4" cy="0.32" r="0.8"><stop offset="0" stopColor="#F0816F" /><stop offset="1" stopColor="#A82C28" /></radialGradient>
      <linearGradient id="if-bacteria" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FD46E" /><stop offset="1" stopColor="#2C8A36" /></linearGradient>
      <radialGradient id="if-leuco" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#F3E8FF" /><stop offset="1" stopColor="#B9A0E6" /></radialGradient>
      <radialGradient id="if-brillo"><stop offset="0" stopColor="#FF9A4A" stopOpacity="0.55" /><stop offset="1" stopColor="#FF9A4A" stopOpacity="0" /></radialGradient>
      <radialGradient id="if-circulo"><stop offset="0" className={s.ifO1} /><stop offset="1" className={s.ifO2} /></radialGradient>
      <linearGradient id="if-escala" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#A81E34" /><stop offset="0.28" stopColor="#EE8B5B" /><stop offset="0.5" stopColor="#F7F3EA" /><stop offset="1" stopColor="#2F5EA8" />
      </linearGradient>
    </defs>
  );
});

// ─── Espacio entre las células ────────────────────────────────────────────────

const EspacioFijo = memo(function EspacioFijo() {
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={1080} fill="url(#if-fondo)" />
      {/* Fibras de la matriz, muy tenues */}
      {Array.from({ length: 12 }, (_, j) => {
        const y = 40 + j * 84, o = hash(j, 3) * 240;
        return <path key={j} d={`M-30,${y} C${240 + o},${y - 50} ${520 + o},${y + 60} ${860 + o},${y} S1400,${y - 40} 1640,${y + 24}`} className={s.ifFibra} strokeWidth={2 + (j % 3) * 2.5} />;
      })}
      {/* Células desenfocadas al fondo, hechas solo con degradado */}
      {[[130, 130, 120, 1], [1490, 140, 150, 0], [1330, 860, 130, 1], [130, 880, 150, 0], [760, 70, 90, 0], [640, 950, 100, 1], [1010, 500, 70, 1]].map(([x, y, r, c], j) => (
        <g key={j}>
          <circle cx={x} cy={y} r={r} fill={`url(#if-burbuja${c ? '' : '2'})`} className={s.ifDifuso} />
          <circle cx={x + r * 0.12} cy={y + r * 0.08} r={r * 0.44} fill={c ? '#6E52A8' : '#3F6AA8'} opacity={0.17} />
        </g>
      ))}
    </g>
  );
});

/** La nucleasa: una enzima que va mordiendo la hebra. */
function Nucleasa({ x, y, ang, boca, r = 22 }: { x: number; y: number; ang: number; boca: number; r?: number }) {
  const a = 0.18 + 0.5 * boca, cx = Math.cos(a) * r, cy = Math.sin(a) * r;
  return (
    <g transform={`translate(${f1(x)},${f1(y)}) rotate(${ang.toFixed(0)})`}>
      <path d={`M0,0 L${f1(cx)},${f1(-cy)} A${r},${r} 0 1 0 ${f1(cx)},${f1(cy)} Z`} fill="url(#if-dnasa)" stroke="#0E5E52" strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={-r * 0.26} cy={-r * 0.48} r={r * 0.14} fill="#FFF" opacity={0.7} />
    </g>
  );
}

function FragmentosSueltos({ cx, cy, k, reloj, c, sem }: { cx: number; cy: number; k: number; reloj: number; c: string; sem: number }) {
  return (
    <g opacity={k}>
      {Array.from({ length: 9 }, (_, j) => {
        const a = hash(j, sem) * TAU + reloj / 3800, d = 92 + ((reloj / 26 + hash(j, sem + 1) * 90) % 90);
        const op = 1 - (d - 92) / 90;
        return <path key={j} d="M-9,0 q4.5,-7 9,0 t9,0" transform={`translate(${f1(cx + Math.cos(a) * d)},${f1(cy + Math.sin(a) * d * 0.8)}) rotate(${(j * 47).toFixed(0)})`} fill="none" stroke={c} strokeWidth={3.2} strokeLinecap="round" opacity={op} />;
      })}
    </g>
  );
}

export function FondoEspacio({ t, reloj }: { t: T; reloj: number }) {
  const nu = v(t, 'nucleasa');
  const boca = 0.5 + 0.5 * Math.sin(reloj / 90);
  return (
    <g>
      <DefsInterferon />
      <EspacioFijo />
      {nu > 0.001 && (
        <g opacity={nu}>
          <FragmentosSueltos cx={360} cy={400} k={nu} reloj={reloj} c={L.adn} sem={2} />
          <FragmentosSueltos cx={320} cy={620} k={nu} reloj={reloj} c={L.rnp} sem={5} />
          {[0, 1, 2].map((j) => {
            const a = reloj / 1500 + (j / 3) * TAU, cx = 360 + Math.cos(a) * 112, cy = 400 + Math.sin(a) * 74;
            return <Nucleasa key={j} x={cx} y={cy} ang={(a * 180) / Math.PI + 180} boca={boca} />;
          })}
          {[0, 1].map((j) => {
            const a = -reloj / 1300 + j * Math.PI, cx = 320 + Math.cos(a) * 104, cy = 606 + Math.sin(a) * 52;
            return <Nucleasa key={j} x={cx} y={cy} ang={(a * 180) / Math.PI + 180} boca={1 - boca} />;
          })}
          <text x={530} y={420} className={`${s.lEtiqueta} ${s.conHalo}`}>nucleasas</text>
          <text x={530} y={448} className={`${s.lSubChico} ${s.conHalo}`}>lo cortan en minutos</text>
        </g>
      )}
    </g>
  );
}

// ─── Endosoma ─────────────────────────────────────────────────────────────────

const E = { cx: 560, cy: 520, rx: 250, ry: 180 };
const N = { cx: 1230, cy: 520, rx: 240, ry: 205 };

/** TLR en la membrana del endosoma: herradura de repeticiones hacia la luz, tramo
 *  que cruza la membrana y dominio TIR hacia el citoplasma. */
function Tlr({ ang, c, luz, k, on }: { ang: number; c: string; luz: string; k: number; on: number }) {
  const x = E.cx + Math.cos(ang) * E.rx, y = E.cy + Math.sin(ang) * E.ry;
  const rot = (Math.atan2(Math.sin(ang) * E.rx, Math.cos(ang) * E.ry) * 180) / Math.PI;
  const herradura = 'M-26,-17 C-50,-20 -56,20 -26,17';
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(0)})`} opacity={0.38 + 0.62 * k}>
      <path d={herradura} fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" />
      <path d={herradura} fill="none" stroke={luz} strokeWidth={8} strokeLinecap="butt" strokeDasharray="4 3.4" />
      <path d="M-26,-4 C-14,-3 -6,-2 12,-2 M-26,4 C-14,3 -6,2 12,2" stroke={c} strokeWidth={3.6} fill="none" strokeLinecap="round" />
      {on > 0.01 && <circle cx={25} r={19} fill="url(#if-brillo)" opacity={on} />}
      <circle cx={23} cy={-7} r={8.5} fill={c} stroke="#FFF" strokeWidth={1} />
      <circle cx={23} cy={7} r={8.5} fill={c} stroke="#FFF" strokeWidth={1} />
      <circle cx={20.5} cy={-9.5} r={2.3} fill="#FFF" opacity={0.65} />
      <circle cx={20.5} cy={4.5} r={2.3} fill="#FFF" opacity={0.65} />
    </g>
  );
}

function Mito({ x, y, a, l = 58 }: { x: number; y: number; a: number; l?: number }) {
  const h = l * 0.4, n = 7, paso = (l * 1.5) / n;
  const crestas = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${f1(-l * 0.75 + i * paso)},${f1((i % 2 ? 1 : -1) * h * 0.56)}`).join(' ');
  return (
    <g transform={`translate(${x},${y}) rotate(${a})`}>
      <ellipse rx={l} ry={h} className={s.mitocondria} />
      <ellipse rx={l * 0.86} ry={h * 0.7} className={s.mitoLuz} />
      <path d={crestas} className={s.crestas} />
    </g>
  );
}

const CelulaPdcFija = memo(function CelulaPdcFija() {
  const ribosomas = (x0: number, y0: number, n: number, sem: number) => Array.from({ length: n }, (_, j) => `M${f1(x0 + j * 15)},${f1(y0 + Math.sin(j * 0.55 + sem) * 7 + (j % 2 ? -5 : 5))}h0`).join('');
  const pliegue = (x: number, y: number, w: number, o: number) => `M${x},${y} C${x + w * 0.3},${y + o} ${x + w * 0.7},${y - o} ${x + w},${y}`;
  const poros = Array.from({ length: 22 }, (_, j) => {
    const a = (j / 22) * TAU + 0.1, x = N.cx + Math.cos(a) * (N.rx + 3), y = N.cy + Math.sin(a) * (N.ry + 3);
    return <g key={j} transform={`translate(${f1(x)},${f1(y)}) rotate(${((a * 180) / Math.PI).toFixed(0)})`}><rect x={-7} y={-5.5} width={14} height={11} rx={3} className={s.poroNuclear} /></g>;
  });
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={1080} fill="url(#if-fondo)" />
      {/* Citoplasma y membrana de la célula */}
      <ellipse cx={780} cy={520} rx={730} ry={470} fill="url(#if-cito)" />
      <ellipse cx={780} cy={520} rx={730} ry={470} className={s.membranaCelula} />
      <ellipse cx={780} cy={520} rx={721} ry={461} className={s.membranaCelulaIn} />
      {/* Retículo rugoso: la pDC es casi una célula plasmática */}
      {[0, 1, 2, 3, 4, 5].map((j) => (
        <g key={j}>
          <path d={pliegue(880 + j * 16, 186 + j * 21, 370 - j * 18, 28)} className={s.reticuloGrande} />
          <path d={ribosomas(884 + j * 16, 182 + j * 21, 23 - j, j)} className={s.ribosomas} />
        </g>
      ))}
      {[0, 1, 2, 3].map((j) => (
        <g key={j}>
          <path d={pliegue(930 + j * 12, 780 + j * 22, 340 - j * 18, 22)} className={s.reticuloGrande} />
          <path d={ribosomas(934 + j * 12, 776 + j * 22, 21 - j, j + 2)} className={s.ribosomas} />
        </g>
      ))}
      {/* Golgi: sacos curvos con sus vesículas */}
      <g transform="translate(810,772)">
        {[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M${-62 + j * 7},${-6 + j * 13} Q0,${-34 + j * 13} ${62 - j * 7},${-6 + j * 13}`} className={s.golgi} />)}
        {[[-74, -18], [76, -16], [-62, 20], [66, 24], [-30, -44], [28, -46]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={6} className={s.vesiculaGolgi} />)}
      </g>
      <Mito x={190} y={330} a={-28} /><Mito x={165} y={690} a={24} l={50} /><Mito x={440} y={855} a={8} l={54} /><Mito x={420} y={205} a={-8} l={52} /><Mito x={760} y={230} a={18} l={46} />
      {/* Vesículas y lisosomas sueltos */}
      {[[280, 830, 22], [640, 210, 18], [90, 520, 20], [870, 300, 16], [650, 880, 20]].map(([x, y, r], j) => (
        <g key={j}><circle cx={x} cy={y} r={r} className={s.lisosoma} /><circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.24} fill="#FFF" opacity={0.65} /></g>
      ))}
      {/* Núcleo: doble envoltura con poros, heterocromatina al borde, nucléolo */}
      <ellipse cx={N.cx} cy={N.cy} rx={N.rx + 7} ry={N.ry + 7} className={s.envolturaExt} />
      <ellipse cx={N.cx} cy={N.cy} rx={N.rx} ry={N.ry} fill="url(#if-nucleo)" className={s.envolturaIn} />
      {poros}
      <path d={Array.from({ length: 74 }, (_, j) => { const a = (j / 74) * TAU + hash(j, 2) * 0.1, q = 0.88 + hash(j, 3) * 0.08; return `M${f1(N.cx + Math.cos(a) * N.rx * q)},${f1(N.cy + Math.sin(a) * N.ry * q)}h0`; }).join('')} className={s.heterocromatina} />
      <path d={Array.from({ length: 26 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 26) * 0.74; return `M${f1(N.cx + Math.cos(a) * N.rx * q)},${f1(N.cy + Math.sin(a) * N.ry * q)}h0`; }).join('')} className={s.eucromatina} />
      {Array.from({ length: 10 }, (_, j) => { const y = N.cy - 150 + j * 32, o = hash(j, 7) * 60; return <path key={j} d={`M${N.cx - 170 + o},${y} C${N.cx - 70},${y - 26} ${N.cx + 50},${y + 26} ${N.cx + 170 - o},${y}`} className={s.fibraCromatina} />; })}
      <circle cx={N.cx + 96} cy={N.cy - 82} r={46} className={s.nucleolo2} />
      {Array.from({ length: 9 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 9) * 36; return <circle key={j} cx={N.cx + 96 + Math.cos(a) * q} cy={N.cy - 82 + Math.sin(a) * q} r={5} className={s.nucleoloGr} />; })}
      {/* Endosoma */}
      <ellipse cx={E.cx} cy={E.cy} rx={E.rx + 7} ry={E.ry + 7} className={s.endosomaMem} />
      <ellipse cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} fill="url(#if-lumen)" />
      <ellipse cx={E.cx} cy={E.cy} rx={E.rx + 3} ry={E.ry + 3} className={s.endosomaMemFina} />
      {/* Bombas de protones (acidifican) */}
      {[-0.45, 0.42].map((a, j) => {
        const x = E.cx + Math.cos(a) * E.rx, y = E.cy + Math.sin(a) * E.ry, r = (a * 180) / Math.PI;
        return <g key={j} transform={`translate(${f1(x)},${f1(y)}) rotate(${r.toFixed(0)})`}><rect x={-10} y={-13} width={26} height={26} rx={7} fill="#D9881E" stroke="#8A5A10" strokeWidth={1.2} /><rect x={-5} y={-8} width={8} height={16} rx={3} fill="#FFE2A8" opacity={0.75} /></g>;
      })}
      <text x={44} y={48} className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Interior de la célula dendrítica plasmocitoide</text>
      <text x={E.cx} y={E.cy - 94} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Endosoma</text>
      <text x={N.cx} y={N.cy - N.ry - 22} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Núcleo</text>
    </g>
  );
});

/** Cápside de un virus: las caras del icosaedro, en fantasma. */
function Virus({ x, y, r, op }: { x: number; y: number; r: number; op: number }) {
  const pts = [0, 60, 120, 180, 240, 300].map((a) => [Math.sin((a * Math.PI) / 180) * r, -Math.cos((a * Math.PI) / 180) * r]);
  const i = r * 0.46;
  const dentro = [[0, -i], [i * 0.87, i * 0.5], [-i * 0.87, i * 0.5]];
  return (
    <g transform={`translate(${x},${y})`} opacity={op}>
      {Array.from({ length: 12 }, (_, j) => { const a = (j / 12) * TAU; return <line key={j} x1={Math.cos(a) * r * 0.94} y1={Math.sin(a) * r * 0.94} x2={Math.cos(a) * r * 1.24} y2={Math.sin(a) * r * 1.24} className={s.espiculaVirusF} />; })}
      <polygon points={pts.map((p) => p.join(',')).join(' ')} className={s.virusFantasma} />
      <path d={`M${dentro[0]} L${dentro[1]} L${dentro[2]} Z ${pts.map((p, j) => `M${p} L${dentro[[0, 0, 1, 1, 2, 2][j]]}`).join(' ')} ${pts.map((p, j) => `M${p} L${dentro[[2, 0, 0, 1, 1, 2][j]]}`).join(' ')}`} className={s.virusCara} />
    </g>
  );
}

const CABALLO = (
  <g fill="#FFF">
    <path d="M-16,7 V-1 C-16,-5 -12,-6 -8,-6 H6 L10,-15 L8,-20 L13,-19 L20,-13 L18,-9 L13,-11 L12,-1 V7 H8 V1 H-10 V7 Z" />
    <rect x={-20} y={7} width={36} height={4} rx={1.5} />
    <circle cx={-13} cy={14} r={3.4} /><circle cx={9} cy={14} r={3.4} />
  </g>
);
const ESTRELLA = <path d="M0,-17 L4.6,-5.6 L16.6,-5 L7.2,2.4 L10.4,14 L0,7.4 L-10.4,14 L-7.2,2.4 L-16.6,-5 L-4.6,-5.6 Z" fill="#FFF" />;
const DENDRITICA = <g><path d="M0,0 L-20,-14 M0,0 L-6,-22 M0,0 L17,-16 M0,0 L22,6 M0,0 L6,21 M0,0 L-18,14" stroke="#FFF" strokeWidth={5} strokeLinecap="round" /><circle r={9} fill="#FFF" /><circle r={4} fill="#7B4FC9" /></g>;
const PLASMA = <g><circle cx={-6} r={14} fill="#FFF" /><circle cx={-9} cy={1} r={6} fill="#2F6FD0" /><path d="M13,12 V4 M13,4 L8,-3 M13,4 L18,-3 M18,-5 V-11 M18,-11 L14,-16 M18,-11 L22,-16" stroke="#FFF" strokeWidth={2.8} strokeLinecap="round" fill="none" /></g>;
const COMPLEJOS = <g transform="scale(0.5)"><path d="M-32,0 q8,-14 16,0 t16,0 t16,0 t16,0" stroke="#FFF" strokeWidth={5} fill="none" strokeLinecap="round" /><path d="M-18,-8 V-20 M-18,-20 L-26,-30 M-18,-20 L-10,-30 M14,8 V20 M14,20 L6,30 M14,20 L22,30" stroke="#FFF" strokeWidth={4.6} strokeLinecap="round" fill="none" /></g>;

/** El interferón: un haz de hélices con su resplandor. */
export function Ifn({ x, y, rot, op }: { x: number; y: number; rot: number; op: number }) {
  return (
    <g transform={`translate(${x.toFixed(0)},${y.toFixed(0)}) rotate(${rot})`} opacity={op}>
      <circle r={17} fill="url(#if-ifn)" />
      <rect x={-9} y={-3.4} width={18} height={6.8} rx={3.4} fill="#E8622A" transform="rotate(62)" />
      <rect x={-9} y={-3.4} width={18} height={6.8} rx={3.4} fill="#F58A3C" transform="rotate(-62)" />
      <rect x={-9} y={-3.4} width={18} height={6.8} rx={3.4} fill="#C2410C" />
    </g>
  );
}

export function FondoEndosoma({ t, reloj }: { t: T; reloj: number }) {
  const en = v(t, 'endo'), ce = v(t, 'complejoEndo'), t7 = v(t, 'tlr7'), t9 = v(t, 'tlr9'), vi = v(t, 'virus'), tr = v(t, 'troya');
  const se = v(t, 'senal'), ig = v(t, 'ifnGen'), is = v(t, 'ifnSale'), es = v(t, 'estrella'), ef = v(t, 'efectos');
  const ph = v(t, 'ph'), bl = v(t, 'bloqueo');
  const cx = lerp(80, E.cx - 20, easeOut(ce)), cy = lerp(300, E.cy, easeOut(ce));
  const x0 = E.cx + E.rx + 44, x1 = N.cx - N.rx - 4;
  const encendido = tr * (1 - bl);
  return (
    <g opacity={en}>
      <DefsInterferon />
      <CelulaPdcFija />
      {/* Protones sueltos en la luz, o su ausencia cuando sube el pH */}
      {Array.from({ length: 12 }, (_, j) => {
        const a = hash(j, 3) * TAU + reloj / 4000, q = 0.5 + hash(j, 4) * 0.38;
        return <text key={j} x={E.cx + Math.cos(a) * E.rx * q} y={E.cy + Math.sin(a) * E.ry * q} textAnchor="middle" dy="0.35em" className={s.protones} opacity={0.75 * (1 - ph)}>H⁺</text>;
      })}
      <text x={E.cx + 148} y={E.cy + 78} textAnchor="middle" className={`${s.lSub} ${s.conHalo}`} opacity={1 - ph}>pH ácido</text>
      {ph > 0.001 && (
        <g opacity={ph}>
          <ellipse cx={E.cx} cy={E.cy} rx={E.rx} ry={E.ry} className={s.endosomaAlcalino} />
          <text x={E.cx + 120} y={E.cy + 70} textAnchor="middle" className={s.lEtiqueta} style={{ fill: '#2F6FD0' }}>pH sube</text>
        </g>
      )}
      {[-2.6, -2.1, -1.6, -1.1].map((a, j) => <Tlr key={`7${j}`} ang={a} c="#C0396E" luz="#F4A8C4" k={t7} on={encendido} />)}
      {[1.1, 1.6, 2.1, 2.6].map((a, j) => <Tlr key={`9${j}`} ang={a} c="#2F6FD0" luz="#A8CCF4" k={t9} on={encendido} />)}
      {t7 > 0.001 && <g opacity={t7} transform={`scale(1)`}><text x={E.cx} y={E.cy - E.ry - 66} textAnchor="middle" className={`${s.etiquetaTlr7} ${s.conHalo}`}>TLR7 · ARN</text></g>}
      {t9 > 0.001 && <g opacity={t9}><text x={E.cx} y={E.cy + E.ry + 84} textAnchor="middle" className={`${s.etiquetaTlr9} ${s.conHalo}`}>TLR9 · ADN</text></g>}
      {ce > 0.001 && (
        <g opacity={Math.min(1, ce * 2)}>
          {ce < 0.98 && <circle cx={cx} cy={cy} r={92} className={s.vesiculaEntrada} />}
          {tr > 0.001 && <circle cx={cx} cy={cy} r={128 + 6 * Math.sin(reloj / 200)} fill="url(#if-troya)" opacity={tr} />}
          <g transform={`translate(${f1(cx)},${f1(cy)})`}><ComplejoNuc r={76} tipo="ambos" /></g>
        </g>
      )}
      {vi > 0.001 && (
        <g opacity={vi * (1 - tr * 0.6)}>
          <Virus x={E.cx + 148} y={E.cy - 52} r={36} op={1} />
          <text x={E.cx + 148} y={E.cy + 24} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>hechos para virus</text>
        </g>
      )}
      <Globo x={800} y={118} w={800} txt="Caballo de Troya: el anticuerpo mete el ácido nucleico propio" k={tr * (1 - es)} tono="alerta" icono={CABALLO} colorIcono="#8A5A2A" />
      {se > 0.001 && (
        <g>
          {/* MyD88 se junta en las colas de los TLR */}
          {[[0, 0, 14], [-15, -13, 11], [15, -14, 12], [-14, 15, 12], [14, 14, 11]].map(([x, y, r], j) => (
            <circle key={j} cx={x0 - 10 + x} cy={E.cy + y} r={r * easeBack(tramo(se, j * 0.08, 0.3 + j * 0.08))} fill="url(#if-myd)" stroke="#8A4A10" strokeWidth={1} />
          ))}
          <path d={`M${x0 + 10},${E.cy} C${x0 + 70},${E.cy - 70} ${x1 - 70},${N.cy - 70} ${x1},${N.cy}`} className={s.caminoSenal} {...dibujar(se)} />
          {Array.from({ length: 5 }, (_, j) => {
            const f = ((reloj / 1500 + j / 5) % 1) * se;
            const x = lerp(x0 + 10, x1, f), y = E.cy - 54 * Math.sin(Math.PI * f);
            return (
              <g key={j} transform={`translate(${f1(x)},${f1(y)})`} opacity={se}>
                <circle cx={-6} r={9} fill="url(#if-irf)" stroke="#7E2418" strokeWidth={0.9} /><circle cx={6} r={9} fill="url(#if-irf)" stroke="#7E2418" strokeWidth={0.9} />
                <circle cx={0} cy={-10} r={4.2} fill="#F2C230" stroke="#8A6A10" strokeWidth={0.7} />
              </g>
            );
          })}
          <g opacity={se}>
            <text x={x0 - 10} y={E.cy + 52} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>MyD88</text>
            <text x={(x0 + x1) / 2} y={E.cy - 88} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>IRF7</text>
          </g>
        </g>
      )}
      {ig > 0.001 && (
        <g opacity={ig}>
          {/* El gen: la doble hélice se abre y sale el mensajero */}
          <path d={Array.from({ length: 34 }, (_, j) => `${j ? 'L' : 'M'}${N.cx - 170 + j * 10.3},${f1(N.cy + 40 + Math.sin(j * 0.75) * 10)}`).join(' ')} className={s.adnLinea} />
          <path d={Array.from({ length: 34 }, (_, j) => `${j ? 'L' : 'M'}${N.cx - 170 + j * 10.3},${f1(N.cy + 40 - Math.sin(j * 0.75) * 10)}`).join(' ')} className={s.adnLinea2} />
          <rect x={N.cx - 58} y={N.cy + 22} width={116} height={36} rx={8} fill="#F2C230" stroke="#A8821A" strokeWidth={1.5} opacity={0.92} />
          <rect x={N.cx - 52} y={N.cy + 26} width={104} height={8} rx={4} fill="#FFF" opacity={0.5} />
          <circle cx={N.cx - 76} cy={N.cy + 30} r={11} fill="url(#if-irf)" stroke="#7E2418" strokeWidth={1} /><circle cx={N.cx - 90} cy={N.cy + 30} r={11} fill="url(#if-irf)" stroke="#7E2418" strokeWidth={1} />
          <text x={N.cx} y={N.cy + 94} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>gen del IFN-α</text>
          {is > 0.001 && <path d={`M${N.cx + 40},${N.cy + 22} C${N.cx + 100},${N.cy - 30} ${N.cx + 170},${N.cy + 90} ${N.cx + 230},${N.cy + 60}`} className={s.arnm} {...dibujar(tramo(is, 0, 0.45))} />}
        </g>
      )}
      {bl > 0.001 && (
        <g opacity={bl}>
          <path d={`M${E.cx + E.rx + 70},${E.cy - 80} l60,60 M${E.cx + E.rx + 130},${E.cy - 80} l-60,60`} className={s.cruz} />
          <text x={E.cx} y={E.cy + E.ry + 120} textAnchor="middle" className={`${s.lEtiquetaRoja} ${s.conHalo}`}>la señal de TLR7 y TLR9 se frena</text>
        </g>
      )}
      {is > 0.001 && Array.from({ length: Math.round(34 * (1 - 0.8 * bl)) }, (_, i) => {
        const q = tramo(is, hash(i, 2) * 0.5, hash(i, 2) * 0.5 + 0.5);
        if (q <= 0) return null;
        // Sale por los poros y se queda flotando arriba y a la derecha, fuera de la célula.
        const lado = i % 3 === 0;
        const tx = lado ? 1490 + hash(i, 3) * 100 : 800 + hash(i, 3) * 780, ty = lado ? 300 + hash(i, 4) * 480 : 30 + hash(i, 4) * 170;
        const e = easeOut(q), a = reloj / 900 + i;
        return <Ifn key={i} x={lerp(N.cx + 80, tx, e) + Math.cos(a) * 7 * e} y={lerp(N.cy - 120, ty, e) + Math.sin(a * 1.3) * 7 * e} rot={i * 40 + reloj / 40} op={tramo(q, 0, 0.12)} />;
      })}
      {is > 0.4 && <text x={1320} y={126} textAnchor="middle" className={`${s.significado} ${s.textoIfn} ${s.conHalo}`} opacity={tramo(is, 0.4, 0.8) * (1 - bl)}>IFN-α en cantidades enormes</text>}
      <Globo x={660} y={118} w={500} txt="La citocina estrella del lupus" k={es} tono="alerta" icono={ESTRELLA} colorIcono="#C2410C" />
      <Globo x={260} y={930} w={470} chico txt="Dendríticas maduran y presentan más" k={Math.min(1, ef)} icono={DENDRITICA} colorIcono="#7B4FC9" />
      <Globo x={790} y={930} w={530} chico txt="Linfocitos B → productores de anticuerpos" k={Math.min(1, Math.max(0, ef - 1))} icono={PLASMA} colorIcono="#2F6FD0" />
      <Globo x={1310} y={930} w={450} chico txt="Más anticuerpos… y más complejos" k={Math.min(1, Math.max(0, ef - 2))} tono="alerta" icono={COMPLEJOS} colorIcono="#C2385A" />
    </g>
  );
}

// ─── Firma ────────────────────────────────────────────────────────────────────

const GENES = ['IFI27', 'IFI44L', 'IFIT1', 'ISG15', 'MX1', 'OAS1', 'RSAD2', 'SIGLEC1'];
const HX = 470, HY = 240, CW = 62, CH = 50, GAP = 20;

/** Escala del mapa: azul = apagado, crema = medio, naranja y rojo = encendido. */
const RAMPA: [number, [number, number, number]][] = [[0, [47, 94, 168]], [0.5, [247, 243, 234]], [0.78, [238, 139, 91]], [1, [168, 30, 52]]];
function colorDe(k: number) {
  for (let i = 1; i < RAMPA.length; i++) {
    if (k <= RAMPA[i][0]) {
      const [a0, c0] = RAMPA[i - 1], [a1, c1] = RAMPA[i], q = (k - a0) / (a1 - a0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * q)).join(',')})`;
    }
  }
  return 'rgb(168,30,52)';
}

/** Árbol de agrupamiento sobre las columnas, como en un mapa de calor de verdad. */
const Arbol = memo(function Arbol({ x, n }: { x: number; n: number }) {
  const y = HY - 8;
  const col = (j: number) => x + j * CW + (CW - 2) / 2;
  let d = '';
  for (let j = 0; j < n - 1; j += 2) { const h = 14 + hash(j, 4) * 8; d += `M${col(j)},${y} V${y - h} H${col(j + 1)} V${y}`; d += `M${(col(j) + col(j + 1)) / 2},${y - h} V${y - 30}`; }
  d += `M${(col(0) + col(1)) / 2},${y - 30} H${(col(n - 2) + col(n - 1)) / 2}`;
  return <path d={d} className={s.arbolMapa} />;
});

const Leucocito = memo(function Leucocito() {
  return (
    <g>
      <path d="M-74,6 C-82,-40 -44,-82 2,-78 C46,-84 84,-42 76,6 C82,50 40,84 -2,78 C-46,84 -82,48 -74,6 Z" fill="url(#if-leuco)" stroke="#7B4FC9" strokeWidth={2.2} />
      <path d="M-30,-28 C-10,-48 30,-44 38,-14 C46,14 24,44 -6,42 C-36,40 -50,-6 -30,-28 Z" fill="#6E4FA0" />
      <path d="M-22,-22 C-8,-36 22,-34 28,-12" fill="none" stroke="#FFF" strokeWidth={3} opacity={0.3} strokeLinecap="round" />
      {[[-52, -38], [50, -46], [58, 36], [-54, 42], [8, 62], [-6, -62]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={4.5} fill="#9B7FD0" />)}
    </g>
  );
});

export function FondoFirma({ t, reloj }: { t: T; reloj: number }) {
  const fi = v(t, 'firma'), ti = v(t, 'firmaTit'), vi = v(t, 'viral'), an = v(t, 'anifro');
  const lupusX = HX + 4 * CW + GAP;
  const latido = 0.75 + 0.25 * Math.sin(reloj / 240);
  return (
    <g>
      <DefsInterferon />
      <rect x={-40} y={-40} width={1680} height={1080} fill="url(#if-fondo)" />
      <text x={800} y={110} textAnchor="middle" className={`${s.tituloSeccion} ${s.conHalo}`} opacity={0.4 + 0.6 * ti}>{ti > 0.5 ? 'La firma de interferón' : 'Genes encendidos en los leucocitos'}</text>
      {/* Grupos con su franja de color */}
      <rect x={HX} y={HY - 72} width={4 * CW - 2} height={26} rx={4} fill="#1F9A6A" />
      <text x={HX + 2 * CW - 1} y={HY - 59} dy="0.35em" textAnchor="middle" className={s.firmaGrupo}>Sanos</text>
      <rect x={lupusX} y={HY - 72} width={8 * CW - 2} height={26} rx={4} fill="#C2385A" />
      <text x={lupusX + 4 * CW - 1} y={HY - 59} dy="0.35em" textAnchor="middle" className={s.firmaGrupo}>Lupus</text>
      <Arbol x={HX} n={4} />
      <Arbol x={lupusX} n={8} />
      {GENES.map((g, r) => (
        <g key={g}>
          <text x={HX - 16} y={HY + r * CH + CH / 2} dy="0.35em" textAnchor="end" className={s.genTxt}>{g}</text>
          {Array.from({ length: 12 }, (_, c) => {
            const lupus = c >= 4;
            const base = lupus ? 0.62 + 0.38 * hash(r * 12 + c, 5) : 0.1 + 0.26 * hash(r * 12 + c, 6);
            const k = lupus ? tramo(fi, (c - 4) * 0.1, (c - 4) * 0.1 + 0.25) : 1;
            const val = lupus ? lerp(0.22, base, k) : base;
            return <rect key={c} x={HX + c * CW + (lupus ? GAP : 0)} y={HY + r * CH} width={CW - 2} height={CH - 2} rx={3} fill={colorDe(val)} />;
          })}
        </g>
      ))}
      {/* Escala */}
      <rect x={1252} y={HY} width={18} height={8 * CH - 2} rx={3} fill="url(#if-escala)" stroke="var(--linea)" strokeWidth={1} />
      <text x={1280} y={HY + 14} className={s.lSubChico}>encendido</text>
      <text x={1280} y={HY + 8 * CH - 6} className={s.lSubChico}>apagado</text>
      {/* El leucocito que se enciende */}
      <g transform="translate(200,420)">
        <circle r={150} fill="url(#if-brillo)" opacity={fi * latido} />
        {Array.from({ length: 10 }, (_, j) => {
          const a = (j / 10) * TAU + reloj / 3200, q = tramo(fi, j * 0.06, 0.5 + j * 0.06);
          return <line key={j} x1={Math.cos(a) * 92} y1={Math.sin(a) * 92} x2={Math.cos(a) * (92 + 26 * q)} y2={Math.sin(a) * (92 + 26 * q)} stroke="#E8622A" strokeWidth={4} strokeLinecap="round" opacity={q} />;
        })}
        <Leucocito />
        <text y={136} textAnchor="middle" className={`${s.lEtiqueta} ${s.conHalo}`}>Leucocito</text>
        <text y={162} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>de la sangre</text>
      </g>
      {/* El virus que no está */}
      {vi > 0.001 && (
        <g opacity={Math.min(1, vi * 2)}>
          <Virus x={1450} y={400} r={58} op={1 - 0.45 * tramo(vi, 0.5, 1)} />
          {vi > 0.5 && <path d="M1398,348 L1502,452 M1502,348 L1398,452" className={s.cruz} opacity={tramo(vi, 0.5, 1)} />}
          <text x={1450} y={498} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>{vi > 0.5 ? 'ningún virus' : '¿un virus?'}</text>
        </g>
      )}
      <Globo x={800} y={750} w={760} txt={vi > 0.5 ? 'Como si respondieran a una infección viral… que no existe' : 'Como si respondieran a una infección viral…'} k={Math.min(1, vi * 2)} />
      <Globo x={800} y={870} w={840} txt="Anifrolumab: bloquea el receptor del interferón I (capítulo 11)" k={an} tono="calma" icono={<path d="M-10,-13 V13 M10,-13 V13 M-15,0 H15" stroke="#FFF" strokeWidth={4.4} strokeLinecap="round" />} colorIcono="#1F9A6A" />
    </g>
  );
}

// ─── Red (NET) sobre el endotelio ─────────────────────────────────────────────

const RC = { x: 600, y: 430 };
const HEBRAS = Array.from({ length: 24 }, (_, i) => ({ a: (i / 24) * TAU + hash(i, 1) * 0.2, L: 240 + hash(i, 2) * 170, ond: hash(i, 3) }));

const EndotelioFijo = memo(function EndotelioFijo() {
  return (
    <g>
      <rect x={-40} y={-40} width={1680} height={880} fill="url(#if-tejido)" />
      {/* Tejido: colágeno y células en segundo plano */}
      {Array.from({ length: 9 }, (_, j) => {
        const y = 40 + j * 86, o = hash(j, 9) * 300;
        return <path key={j} d={`M-30,${y} C${220 + o},${y - 36} ${520 + o},${y + 44} ${840 + o},${y} S1400,${y - 30} 1640,${y + 20}`} className={s.ifFibra} strokeWidth={3 + (j % 3) * 3} />;
      })}
      {[[120, 150, 62], [1500, 660, 74], [160, 690, 56], [1060, 620, 48], [1470, 130, 54]].map(([x, y, r], j) => (
        <g key={j}><circle cx={x} cy={y} r={r} fill="url(#if-burbuja)" className={s.ifDifuso} /><circle cx={x} cy={y} r={r * 0.42} fill="#6E52A8" opacity={0.14} /></g>
      ))}
      {/* Luz del vaso, membrana basal y endotelio */}
      <rect x={-40} y={856} width={1680} height={200} fill="url(#if-luzvaso)" />
      <path d="M-40,820 C300,812 700,826 1000,818 S1500,824 1640,818" className={s.basalVaso} />
      {Array.from({ length: 17 }, (_, j) => (
        <g key={j}>
          <path d={`M${2 + j * 100},842 C${10 + j * 100},826 ${88 + j * 100},826 ${98 + j * 100},842 C${88 + j * 100},860 ${10 + j * 100},860 ${2 + j * 100},842 Z`} fill="url(#if-endo)" stroke="#8E4E68" strokeWidth={1.2} />
          <ellipse cx={50 + j * 100} cy={842} rx={21} ry={8} fill="#6E3858" opacity={0.8} />
          <ellipse cx={42 + j * 100} cy={833} rx={16} ry={2.4} fill="#FFF" opacity={0.35} />
        </g>
      ))}
      <text x={1560} y={806} textAnchor="end" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Endotelio</text>
    </g>
  );
});

const FASES = ['Núcleo en lóbulos', 'Se descondensa', 'Se rompe'];

function FasesNetosis({ k, reloj }: { k: number; reloj: number }) {
  const activa = Math.min(2, Math.floor(k * 3));
  return (
    <g opacity={tramo(k, 0, 0.1)}>
      {FASES.map((f, j) => {
        const x = 1040 + j * 210, y = 118, q = tramo(k, j / 3, j / 3 + 0.14);
        const on = j === activa;
        return (
          <g key={f} opacity={0.28 + 0.72 * q}>
            {j > 0 && <path d={`M${x - 150},${y} H${x - 72} m-9,-7 l9,7 l-9,7`} className={s.flechaFase} />}
            <circle cx={x} cy={y} r={60} className={on ? s.faseOn : s.faseAro} />
            <g transform={`translate(${x},${y})`}>
              {j < 2 && <circle r={46} fill="#F2E3F7" stroke="#A974BE" strokeWidth={2} />}
              {j === 0 && <path d="M-22,-8 C-30,-24 -6,-26 -6,-10 C-4,-22 18,-22 16,-6 C30,-6 28,16 12,12 C8,24 -14,22 -10,6 C-26,10 -32,-2 -22,-8 Z" fill="#6E3F96" />}
              {j === 1 && <g><circle r={30} fill="#D9C5EE" stroke="#7A5BB0" strokeWidth={1.6} />{Array.from({ length: 7 }, (_, n) => <path key={n} d={`M${-22 + n * 2},${-14 + n * 5} q10,-9 20,0 t20,0`} fill="none" stroke={L.adn} strokeWidth={2.4} strokeLinecap="round" />)}</g>}
              {j === 2 && <g>
                <path d="M-28,-36 A46,46 0 0 1 36,-28 M44,-12 A46,46 0 0 1 22,40 M-8,45 A46,46 0 0 1 -44,-12" fill="none" stroke="#A974BE" strokeWidth={2.4} />
                {Array.from({ length: 8 }, (_, n) => { const a = (n / 8) * TAU + reloj / 3000; return <path key={n} d={`M0,0 q${f1(Math.cos(a + 0.5) * 20)},${f1(Math.sin(a + 0.5) * 20)} ${f1(Math.cos(a) * 52)},${f1(Math.sin(a) * 52)}`} fill="none" stroke={L.adn} strokeWidth={2.4} strokeLinecap="round" />; })}
                {Array.from({ length: 8 }, (_, n) => { const a = (n / 8) * TAU + reloj / 3000; return <circle key={n} cx={Math.cos(a) * 38} cy={Math.sin(a) * 38} r={4} fill={L.histona} />; })}
              </g>}
            </g>
            <text x={x} y={y + 86} textAnchor="middle" className={`${s.lSubChico} ${s.conHalo}`}>{f}</text>
          </g>
        );
      })}
    </g>
  );
}

function Bacteria({ x, y, a, op, reloj, i }: { x: number; y: number; a: number; op: number; reloj: number; i: number }) {
  const m = Math.sin(reloj / 170 + i) * 5;
  return (
    <g transform={`translate(${x},${y}) rotate(${a})`} opacity={op}>
      <path d={`M24,0 q10,${f1(-6 + m)} 18,0 t16,0 M22,6 q9,${f1(5 - m)} 15,3`} fill="none" stroke="#2C8A36" strokeWidth={1.8} strokeLinecap="round" />
      <rect x={-26} y={-11} width={52} height={22} rx={11} fill="url(#if-bacteria)" stroke="#1E6A2A" strokeWidth={1.3} />
      <path d="M-8,-5 C-2,-8 8,-3 14,-5" fill="none" stroke="#1E6A2A" strokeWidth={1.2} opacity={0.6} />
      <rect x={-20} y={-7} width={26} height={4} rx={2} fill="#FFF" opacity={0.42} />
    </g>
  );
}

const ICONO_RED = {
  adn: <path d="M-14,-4 q7,-11 14,0 t14,0 M-14,5 q7,10 14,0 t14,0" fill="none" stroke="#FFF" strokeWidth={2.6} strokeLinecap="round" />,
  his: <g fill="#FFF"><circle cx={-6} cy={-6} r={6} /><circle cx={7} cy={-5} r={6} /><circle cx={-5} cy={7} r={6} /><circle cx={8} cy={7} r={6} /></g>,
  gra: <g fill="#FFF"><path d="M-3,-14 L4,-14 L11,0 L4,14 L-3,14 L-11,0 Z" /></g>,
};

export function FondoRed({ t, reloj }: { t: T; reloj: number }) {
  const re = v(t, 'red'), fa = v(t, 'fases'), pa = v(t, 'partes'), ba = v(t, 'bacterias'), au = v(t, 'autoag'), da = v(t, 'danoEndo'), pe = v(t, 'persisten'), pr = v(t, 'problema');
  // Las hebras y sus cuentas en un solo trazo por tipo: 24 hebras no cuestan 24 repintados.
  const hebras = re > 0.001 ? HEBRAS.map((h, i) => {
    const k = easeOut(tramo(re, i * 0.012, 0.6 + i * 0.012));
    const L2 = h.L * k * (h.a > 0.6 && h.a < 2.5 ? 1 + 0.6 * da : 1);
    // Las hebras llegan hasta el endotelio, sin atravesarlo.
    return Array.from({ length: 9 }, (_, n) => { const f = n / 8, ox = Math.sin(f * 7 + h.ond * 6) * 15; return [RC.x + Math.cos(h.a) * L2 * f - Math.sin(h.a) * ox, Math.min(832, RC.y + Math.sin(h.a) * L2 * f + Math.cos(h.a) * ox)]; });
  }) : [];
  const trazo = (pts: number[][]) => `M${pts.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' L')}`;
  const principal = hebras.map(trazo).join(' ');
  const cruces = hebras.map((h, i) => { const o = hebras[(i + 1) % hebras.length]; return [4, 6, 7].map((n) => { const a = h[n], b = o[n + (i % 2 ? 0 : -1)]; return `M${f1(a[0])},${f1(a[1])} Q${f1((a[0] + b[0]) / 2 + 6)},${f1((a[1] + b[1]) / 2 - 6)} ${f1(b[0])},${f1(b[1])}`; }).join(' '); }).join(' ');
  const puntos = (de: number, cada: number) => hebras.map((h) => h.slice(de).filter((_, n) => n % cada === 0).map(([x, y]) => `M${f1(x)},${f1(y)}h0`).join('')).join('');
  const brillos = hebras.map((h) => h.slice(2).filter((_, n) => n % 2 === 0).map(([x, y]) => `M${f1(x - 2)},${f1(y - 2.4)}h0`).join('')).join('');
  return (
    <g>
      <DefsInterferon />
      <EndotelioFijo />
      {Array.from({ length: 9 }, (_, i) => { const x = ((i * 190 + reloj * 0.07) % 1800) - 100; return (
        <g key={i} transform={`translate(${x.toFixed(0)},${930 + (i % 3) * 22}) rotate(${(i * 23) % 40 - 20})`}>
          <ellipse rx={30} ry={22} fill="url(#if-hem)" stroke="#7E1E1C" strokeWidth={1} />
          <ellipse rx={15} ry={10} fill="#C24B44" opacity={0.65} />
          <ellipse cx={-10} cy={-11} rx={9} ry={3.4} fill="#FFF" opacity={0.3} />
        </g>
      ); })}
      {da > 0.001 && Array.from({ length: 6 }, (_, j) => (
        <g key={j} opacity={da}>
          <ellipse cx={350 + j * 100} cy={842} rx={50} ry={19} className={s.endotelioDanado} />
          <path d={`M${312 + j * 100},830 l18,8 l-8,8 l22,6`} fill="none" stroke="#8A1E2C" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
      {re > 0.001 && (
        <g>
          <path d={cruces} className={s.netCruce} />
          <path d={principal} className={s.netBase} />
          <path d={principal} className={s.hebraNet} />
          <path d={puntos(3, 3)} className={s.netGranulo} />
          <path d={puntos(5, 3)} className={s.netMpo} />
          <path d={puntos(2, 2)} className={s.netHistona} />
          <path d={brillos} className={s.netBrillo} />
          {/* Lo que queda de la célula: membrana rota y restos del núcleo */}
          <g transform={`translate(${RC.x},${RC.y}) scale(${1 - 0.25 * re})`}>
            <circle r={58} fill="url(#if-burbuja)" />
            <path d="M-46,-34 A58,58 0 0 1 28,-50 M50,-28 A58,58 0 0 1 36,46 M-4,58 A58,58 0 0 1 -58,6" fill="none" stroke="#A974BE" strokeWidth={3.4} strokeLinecap="round" />
            <path d="M-20,-8 C-26,-22 -4,-24 -4,-10 C8,-18 20,-8 12,4 C22,14 4,24 -4,14 C-16,20 -28,6 -20,-8 Z" className={s.restoNeutrofilo} />
          </g>
        </g>
      )}
      <FasesNetosis k={fa} reloj={reloj} />
      {pa > 0.001 && (
        <g opacity={pa} transform={`translate(${(1 - easeOut(pa)) * 30},0)`}>
          {[
            ['ADN descondensado', L.adn, ICONO_RED.adn],
            ['histonas', L.histona, ICONO_RED.his],
            ['proteínas de gránulos (elastasa, MPO)', '#E0892E', ICONO_RED.gra],
          ].map(([txt, c, ic], j) => (
            <g key={txt as string} transform={`translate(1040,${262 + j * 44})`}>
              <circle r={19} fill={c as string} stroke="#FFF" strokeWidth={2} />
              <g transform="scale(0.8)">{ic as ReactNode}</g>
              <text x={30} dy="0.35em" className={`${s.lEtiqueta} ${s.conHalo}`}>{txt as string}</text>
            </g>
          ))}
        </g>
      )}
      {ba > 0.001 && [[420, 260], [760, 330], [520, 610], [800, 540]].map(([x, y], j) => <Bacteria key={j} x={x} y={y} a={j * 40} op={ba} reloj={reloj} i={j} />)}
      <Globo x={1240} y={480} w={560} txt="Hecha para atrapar bacterias…" k={ba * (1 - au)} />
      <Globo x={1240} y={480} w={620} txt="…en el lupus: otro paquete de autoantígeno" k={au} tono="alerta" />
      {da > 0.4 && <text x={600} y={790} textAnchor="middle" className={`${s.lEtiquetaRoja} ${s.conHalo}`} opacity={tramo(da, 0.4, 1)}>lesiona el endotelio</text>}
      <Globo x={800} y={112} w={860} txt="Normalmente las degrada la DNasa; en muchos pacientes persisten" k={pe * (1 - pr)} icono={<g transform="scale(0.7)"><path d="M-3,0 L14,-10 A17,17 0 1 0 14,10 Z" fill="#FFF" /><path d="M-20,-20 L20,20" stroke="#FFF" strokeWidth={4} strokeLinecap="round" /></g>} colorIcono="#14796A" />
      <Globo x={800} y={112} w={pr > 0.5 ? 620 : 380} txt={pr > 0.5 ? 'El sistema se alimenta a sí mismo' : '¿Ves el problema?'} k={Math.min(1, pr * 2)} tono="alerta" />
    </g>
  );
}

// ─── Círculo vicioso ──────────────────────────────────────────────────────────

const CENTRO = { x: 800, y: 480, rx: 500, ry: 310 };

/** Medallón con la ilustración de cada estación. */
export function Medalla({ x, y, k, c, children }: { x: number; y: number; k: number; c: string; children: ReactNode }) {
  if (k <= 0.001) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${0.5 + 0.5 * easeBack(k)})`} opacity={Math.min(1, k * 2)}>
      <circle cx={5} cy={7} r={50} className={s.globoSombra} />
      <circle r={50} fill="#FFF" stroke={c} strokeWidth={4} />
      {children}
    </g>
  );
}

export function FondoCirculo({ t, reloj }: { t: T; reloj: number }) {
  const anillo = `M${CENTRO.x - CENTRO.rx},${CENTRO.y} A${CENTRO.rx},${CENTRO.ry} 0 1 1 ${CENTRO.x + CENTRO.rx},${CENTRO.y} A${CENTRO.rx},${CENTRO.ry} 0 1 1 ${CENTRO.x - CENTRO.rx},${CENTRO.y}`;
  return (
    <g>
      <DefsInterferon />
      <rect x={-40} y={-40} width={1680} height={1080} fill="url(#if-fondo)" />
      <ellipse cx={800} cy={480} rx={760} ry={500} fill="url(#if-circulo)" />
      <path d={anillo} className={s.anilloVicioso} />
      <Medalla x={548} y={160} k={v(t, 'ic1')} c={L.complejo}><ComplejoNuc r={38} tipo="adn" /></Medalla>
      <Medalla x={1464} y={360} k={v(t, 'ic2')} c="#7B4FC9">
        <path d="M-6,-20 C-34,-24 -36,20 -6,20" fill="none" stroke="#C0396E" strokeWidth={10} strokeLinecap="round" />
        <path d="M-6,-20 C-34,-24 -36,20 -6,20" fill="none" stroke="#F4A8C4" strokeWidth={6} strokeDasharray="4 3" />
        <path d="M-6,-4 H16 M-6,4 H16" stroke="#C0396E" strokeWidth={3} />
        <circle cx={22} cy={-7} r={7} fill="#C0396E" /><circle cx={22} cy={7} r={7} fill="#C0396E" />
      </Medalla>
      <Medalla x={1356} y={740} k={v(t, 'ic3')} c="#C2410C">
        <g transform="scale(1.9)"><Ifn x={0} y={0} rot={reloj / 30} op={1} /></g>
      </Medalla>
      <Medalla x={224} y={740} k={v(t, 'ic4')} c="#2F6FD0">
        <g transform="translate(-14,-14) scale(0.72)"><path d="M0,0 L-20,-14 M0,0 L-6,-22 M0,0 L17,-16 M0,0 L22,6 M0,0 L6,21 M0,0 L-18,14" stroke="#7B4FC9" strokeWidth={5} strokeLinecap="round" /><circle r={10} fill="#7B4FC9" /></g>
        <g transform="translate(18,-10)"><circle r={13} fill="#BBD3EE" stroke="#4E7DB5" strokeWidth={1.2} /><circle cx={1} cy={1} r={8.4} fill="#3F6AA8" /></g>
        <g transform="translate(0,20)"><circle r={14} fill="#E9D3F0" stroke="#A974BE" strokeWidth={1.2} /><path d="M-7,-2 C-9,-8 -2,-8 -2,-3 C2,-8 8,-5 6,0 C9,5 2,8 -1,4 C-5,7 -9,2 -7,-2 Z" fill="#6E3F96" /></g>
      </Medalla>
      <Medalla x={126} y={360} k={v(t, 'ic5')} c={L.lupus}>
        <IgG x={-16} y={-4} ang={-16} k={1} />
        <IgG x={17} y={-8} ang={14} k={0.86} />
        <path d="M-26,27 q9,-11 17,0 t17,0 t17,0" fill="none" stroke={L.adn} strokeWidth={3.6} strokeLinecap="round" />
      </Medalla>
    </g>
  );
}
