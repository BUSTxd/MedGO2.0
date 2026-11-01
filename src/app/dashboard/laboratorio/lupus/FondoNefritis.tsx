'use client';
// Láminas del capítulo 9 («Nefritis lúpica»). Sin tarjetas: lo que se enseña se ve en
// la lámina y el texto va suelto, en segundo plano.
// · `capas`: el capilar del glomérulo en corte (endotelio fenestrado, membrana basal,
//   podocitos con pedicelos, mesangio) y una lente con la barrera por capas; los tres
//   sitios de depósito y, después, la inflamación.
// · `fullhouse`: cinco campos de inmunofluorescencia, la casa llena y la vía clásica.
// · `clases`: los seis glomérulos y un campo al microscopio que muestra cada clase;
//   a la derecha, las lentes y los conteos de cada una.
// · `clinicaN`: lo que se ve en el paciente: nefrítico, nefrótico y la tira de orina.

import { memo, type ReactNode } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { ComplejoRed, DibujoCelula, IgG, IgM } from './Celulas';
import { DefsPl, Flotante, lobulos, Nota } from './FondoClinica';
import { DefsSg, Lente, Letrero, Sello } from './FondoDano2';
import { ArteManometro, FlechaViva, Titulo } from './FondoOrganos';
import { clamp, easeBack, easeInOut, easeOut, FlechaSuave, IconoOrgano, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rotulo = `${s.lEtiqueta} ${s.conHalo}`;
const halo = `${s.lSubChico} ${s.conHalo}`;
const nube = (pts: [number, number][]) => pts.map(([x, y]) => `M${f1(x)},${f1(y)}h0`).join('');

export const DefsNe = memo(function DefsNe() {
  return (
    <defs>
      <radialGradient id="ne-luz" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stopColor="#FFF6DE" /><stop offset="0.75" stopColor="#FFE5BE" /><stop offset="1" stopColor="#F4B894" /></radialGradient>
      <radialGradient id="ne-mes" cx="0.4" cy="0.36" r="0.8"><stop offset="0" stopColor="#E9D6F4" /><stop offset="1" stopColor="#B795D6" /></radialGradient>
      <radialGradient id="ne-podo" cx="0.36" cy="0.3" r="0.85"><stop offset="0" stopColor="#B8EFD8" /><stop offset="1" stopColor="#3FA88C" /></radialGradient>
      <linearGradient id="ne-mbg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6A3CB0" /><stop offset="0.5" stopColor="#8A5AD0" /><stop offset="1" stopColor="#6A3CB0" /></linearGradient>
      <radialGradient id="ne-tuft" cx="0.42" cy="0.38" r="0.75"><stop offset="0" stopColor="#E7A9C9" /><stop offset="1" stopColor="#C477A8" /></radialGradient>
      <radialGradient id="ne-hial" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFC2DA" /><stop offset="0.6" stopColor="#EE5C96" /><stop offset="1" stopColor="#B81E62" /></radialGradient>
      <radialGradient id="ne-esc" cx="0.42" cy="0.38" r="0.8"><stop offset="0" stopColor="#E9DFE6" /><stop offset="1" stopColor="#B7A7B8" /></radialGradient>
      <radialGradient id="ne-campo" cx="0.5" cy="0.5" r="0.65"><stop offset="0" stopColor="#FBE3EA" /><stop offset="1" stopColor="#F2C2D2" /></radialGradient>
      <radialGradient id="ne-if" cx="0.5" cy="0.5" r="0.65"><stop offset="0" stopColor="#0C2016" /><stop offset="1" stopColor="#040B07" /></radialGradient>
      <linearGradient id="ne-orina" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#F2C33C" /><stop offset="0.5" stopColor="#FFE27A" /><stop offset="1" stopColor="#D69A1C" /></linearGradient>
      <linearGradient id="ne-orinaR" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#C9542E" /><stop offset="0.5" stopColor="#E8884E" /><stop offset="1" stopColor="#A83E22" /></linearGradient>
      <radialGradient id="ne-cic" cx="0.4" cy="0.34" r="0.85"><stop offset="0" stopColor="#B4928C" /><stop offset="1" stopColor="#6A4A48" /></radialGradient>
    </defs>
  );
});

const Base = () => <g><DefsSg /><DefsPl /><DefsNe /></g>;

// ─── Pasos 0 a 2 · el capilar en corte ────────────────────────────────────────

const C = { x: 470, y: 520, luz: 186, mbg: 222 };
const VECINO = { x: -70, y: 520 };

/** Pared de un capilar: endotelio con sus poros, las tres láminas de la membrana basal y los pedicelos. */
function Pared({ cx, cy, a0, a1 }: { cx: number; cy: number; a0: number; a1: number }) {
  const n = Math.round(((a1 - a0) * (C.mbg + 8)) / 15);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const a = a0 + (i / (n - 1)) * (a1 - a0), r = C.mbg + 6, cel = Math.floor(i / 9) % 2;
        return <rect key={i} x={-5.4} y={-11} width={10.8} height={22} rx={5} fill={cel ? '#52BE9E' : '#7AD4B4'} stroke="#23705E" strokeWidth={0.9} transform={`translate(${f1(cx + Math.cos(a) * r)},${f1(cy + Math.sin(a) * r)}) rotate(${f1((a * 180) / Math.PI + 90)})`} />;
      })}
      <circle cx={cx} cy={cy} r={C.luz + 18} fill="none" stroke="#D9BEEF" strokeWidth={30} />
      <circle cx={cx} cy={cy} r={C.luz + 18} fill="none" stroke="url(#ne-mbg)" strokeWidth={19} />
      <circle cx={cx} cy={cy} r={C.luz} fill="url(#ne-luz)" />
      <circle cx={cx} cy={cy} r={C.luz - 1} fill="none" stroke="#EE9C90" strokeWidth={8} strokeDasharray="15 5" />
      {[-2.5, -1.3, -0.3, 0.9, 2.1].map((a, i) => <g key={i} transform={`translate(${f1(cx + Math.cos(a) * (C.luz - 7))},${f1(cy + Math.sin(a) * (C.luz - 7))}) rotate(${f1((a * 180) / Math.PI + 90)})`}><ellipse rx={23} ry={9.4} fill="#F7BEB0" stroke="#C9766C" strokeWidth={1} /><ellipse rx={13} ry={5.6} fill="#6E3F9E" /></g>)}
    </g>
  );
}

const AsaFija = memo(function AsaFija() {
  return (
    <g>
      <rect x={-800} y={-800} width={3200} height={2600} className={s.espacioUrinario} />
      {/* Mesangio entre dos capilares */}
      <path d={lobulos(150, 12, 0.06, 4)} transform="translate(208,520) scale(0.72,1.34)" fill="url(#ne-mes)" stroke="#8E6AB4" strokeWidth={1.6} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${f1(120 + hash(i, 2) * 180)},${f1(350 + hash(i, 3) * 340)} q${f1((hash(i, 4) - 0.5) * 34)},${f1((hash(i, 5) - 0.5) * 20)} ${f1((hash(i, 6) - 0.5) * 46)},${f1(14 + hash(i, 7) * 26)}`} fill="none" stroke="#9C7CC0" strokeWidth={1.8} opacity={0.6} />)}
      {[[206, 462], [214, 586], [196, 524]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={i === 2 ? 15 : 22} ry={i === 2 ? 11 : 15} fill="#5E3A92" /><ellipse cx={x - 5} cy={y - 4} rx={5} ry={2.6} fill="#FFF" opacity={0.3} /></g>)}
      {/* Capilar vecino */}
      <Pared cx={VECINO.x} cy={VECINO.y} a0={0.64} a1={TAU - 0.64} />
      {[[-124, 452, 20], [-20, 472, -30], [-78, 590, 60], [20, 588, 10]].map(([x, y, a], i) => <use key={i} href="#sg-rbc" transform={`translate(${x},${y}) rotate(${a}) scale(1.28,0.92)`} />)}
      {/* Podocitos: cuerpo, prolongaciones primarias y sus pedicelos */}
      {[-0.82, 0, 0.82].map((a, j) => {
        const r0 = C.mbg + 112, x = C.x + Math.cos(a) * r0, y = C.y + Math.sin(a) * r0;
        return (
          <g key={j}>
            {[-0.27, -0.1, 0.1, 0.27].map((d, i) => {
              const b = a + d, xt = C.x + Math.cos(b) * (C.mbg + 15), yt = C.y + Math.sin(b) * (C.mbg + 15);
              return <path key={i} d={`M${f1(x)},${f1(y)} Q${f1(C.x + Math.cos(b) * (C.mbg + 60))},${f1(C.y + Math.sin(b) * (C.mbg + 60))} ${f1(xt)},${f1(yt)}`} fill="none" stroke="#3FA88C" strokeWidth={15} strokeLinecap="round" />;
            })}
            <path d={lobulos(58, 9, 0.08, j + 3)} transform={`translate(${f1(x)},${f1(y)}) rotate(${(a * 180) / Math.PI})`} fill="url(#ne-podo)" stroke="#23705E" strokeWidth={1.6} />
            <ellipse cx={x} cy={y} rx={28} ry={22} fill="#3E5EA8" />
            <circle cx={x - 7} cy={y - 6} r={5} fill="#17295E" />
            <ellipse cx={x - 22} cy={y - 26} rx={13} ry={6} fill="#FFF" opacity={0.42} />
          </g>
        );
      })}
      <Pared cx={C.x} cy={C.y} a0={-2.32} a1={2.32} />
    </g>
  );
});

/** Lo que corre por la luz y lo que se filtra hacia el espacio urinario. */
function Flujo({ reloj, filtra, leuco }: { reloj: number; filtra: number; leuco: number }) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const a = i * 1.05 + reloj / 9000 * (i % 2 ? 1 : -1), r = 42 + (i % 3) * 44, g = reloj / 1100 + i * 2;
        return <use key={i} href="#sg-rbc" transform={`translate(${f1(C.x + Math.cos(a) * r)},${f1(C.y + Math.sin(a) * r)}) rotate(${f1((g * 60) % 360)}) scale(1.28,${(1.28 * (0.5 + 0.5 * Math.abs(Math.cos(g)))).toFixed(2)})`} />;
      })}
      {leuco > 0.001 && [[-70, -70], [76, 34], [-24, 96]].map(([dx, dy], i) => <use key={i} href="#sg-leu" opacity={leuco} transform={`translate(${C.x + dx + Math.sin(reloj / 900 + i) * 5},${C.y + dy}) rotate(${f1(reloj / 40 + i * 50)}) scale(0.82)`} />)}
      {filtra > 0.001 && Array.from({ length: 14 }, (_, i) => {
        const f = (reloj / 2200 + i / 14) % 1, a = -1 + hash(i, 3) * 2, r = C.luz - 16 + f * 170;
        return <circle key={i} cx={f1(C.x + Math.cos(a) * r)} cy={f1(C.y + Math.sin(a) * r)} r={3.6} fill="#5FB2E6" opacity={filtra * Math.sin(f * Math.PI) * 0.85} />;
      })}
    </g>
  );
}

/** La barrera de filtración por capas: de arriba abajo, sangre → orina. */
const BarreraBase = memo(function BarreraBase({ gt }: { gt: number }) {
  const yP = -6 + gt;
  return (
    <g>
      <rect x={-240} y={yP + 40} width={480} height={220} fill="#FFF8D8" />
      {/* Prolongación del podocito, con su núcleo */}
      <path d={`M-240,${yP + 74} C-120,${yP + 56} 110,${yP + 58} 240,${yP + 72} V${yP + 118} C100,${yP + 130} -130,${yP + 128} -240,${yP + 114} Z`} fill="url(#ne-podo)" stroke="#23705E" strokeWidth={1.4} />
      {/* Membrana basal: lámina rara interna, densa y rara externa */}
      <rect x={-240} y={-66} width={480} height={60 + gt} fill="#DCC6EE" />
      <rect x={-240} y={-54} width={480} height={36 + gt} fill="url(#ne-mbg)" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-240,${-50 + i * (4 + gt * 0.1)} C-90,${-54 + i * (4 + gt * 0.1)} 90,${-46 + i * (4 + gt * 0.1)} 240,${-50 + i * (4 + gt * 0.1)}`} fill="none" stroke="#C7A8EE" strokeWidth={1} opacity={0.5} />)}
      {/* Luz: plasma y endotelio con sus poros */}
      <rect x={-240} y={-240} width={480} height={150} fill="url(#ne-luz)" />
      {Array.from({ length: 11 }, (_, i) => {
        const x = -240 + i * 48;
        return <rect key={i} x={x} y={-92} width={37} height={20} rx={7} fill="#F7BEB0" stroke="#C9766C" strokeWidth={1.1} />;
      })}
      <ellipse cx={-78} cy={-102} rx={52} ry={19} fill="#F7BEB0" stroke="#C9766C" strokeWidth={1.1} />
      <ellipse cx={-78} cy={-104} rx={30} ry={11} fill="#6E3F9E" />
      <circle cx={-88} cy={-107} r={3.4} fill="#32185E" />
      {/* Pedicelos con la hendidura y su diafragma */}
      {Array.from({ length: 11 }, (_, i) => {
        const x = -240 + i * 46;
        return (
          <g key={i}>
            <path d={`M${x + 4},${yP + 68} V${yP + 18} Q${x + 4},${yP + 3} ${x + 19},${yP + 3} Q${x + 34},${yP + 3} ${x + 34},${yP + 18} V${yP + 68} Z`} fill={i % 2 ? '#52BE9E' : '#7AD4B4'} stroke="#23705E" strokeWidth={1.2} />
            <path d={`M${x + 34},${yP + 16} H${x + 50}`} stroke="#23705E" strokeWidth={1.6} strokeDasharray="3 2" />
            <ellipse cx={x + 14} cy={yP + 16} rx={3.4} ry={7} fill="#FFF" opacity={0.42} />
          </g>
        );
      })}
    </g>
  );
});

const SUBENDO: [number, number, number][] = [[-160, -70, 20], [-44, -68, 24], [76, -70, 22], [172, -68, 18]];

function Barrera({ endo = 1, mbg = 1, podo = 1, sub = 0, epi = 0, gruesa = 0, fuga = 0, rl }: { endo?: number; mbg?: number; podo?: number; sub?: number; epi?: number; gruesa?: number; fuga?: number; rl: number }) {
  const gt = Math.round(gruesa * 36), yE = -2 + gt;
  return (
    <g>
      <BarreraBase gt={gt} />
      {/* Velos: cada capa aparece cuando la voz la nombra */}
      <rect x={-240} y={-96} width={480} height={30} fill="url(#ne-luz)" opacity={1 - endo} />
      <rect x={-240} y={-112} width={480} height={18} fill="url(#ne-luz)" opacity={1 - endo} />
      <rect x={-240} y={-66} width={480} height={60 + gt} fill="#FFF3DE" opacity={1 - mbg} />
      <rect x={-240} y={-6 + gt} width={480} height={150} fill="#FFF8D8" opacity={1 - podo} />
      {[[-150, -170, 0], [40, -152, 1], [150, -192, 2]].map(([x, y, i]) => <use key={i} href="#sg-rbc" transform={`translate(${f1(x + Math.sin(rl / 900 + i) * 12)},${y}) rotate(${i * 50}) scale(1.5,${(1.5 * (0.55 + 0.45 * Math.abs(Math.cos(rl / 1100 + i)))).toFixed(2)})`} />)}
      {Array.from({ length: 10 }, (_, i) => {
        const f = (rl / 2000 + i / 10) % 1, x = -218 + i * 48 + 6;
        return <circle key={i} cx={x} cy={f1(-100 + f * 250)} r={3} fill="#5FB2E6" opacity={podo * Math.sin(f * Math.PI) * 0.8} />;
      })}
      {/* Depósitos, con la misma forma que en la sangre */}
      {SUBENDO.map(([x, y, r], i) => {
        const q = easeOut(tramo(sub, i * 0.14, 0.5 + i * 0.14));
        return q > 0.01 ? <g key={i} transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}><ComplejoRed n={5} d={r * 2.4} /></g> : null;
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const q = easeOut(tramo(epi, i * 0.12, 0.5 + i * 0.12)), x = -172 + i * 92;
        return q > 0.01 ? <g key={i} transform={`translate(${x},${yE + 6}) scale(${q.toFixed(3)})`}><ComplejoRed n={5} d={44} /></g> : null;
      })}
      {fuga > 0.001 && Array.from({ length: 9 }, (_, i) => {
        const f = (rl / 1500 + i / 9) % 1, x = -180 + i * 45;
        return <circle key={i} cx={x + Math.sin(rl / 300 + i) * 3} cy={f1(-70 + f * 240)} r={6.4} fill="#F2B21E" stroke="#A8821A" strokeWidth={1} opacity={fuga * Math.sin(f * Math.PI)} />;
      })}
    </g>
  );
}

const ArteLeucoCompl = (rl: number) => (
  <g>
    <use href="#sg-leu" transform={`rotate(${f1(rl / 40)}) scale(1.2)`} />
    {[0, 1, 2].map((j) => { const f = (rl / 1300 + j / 3) % 1; return <circle key={j} cx={46 + f * 32} cy={-34 + j * 30} r={7 - f * 3} fill="#C0397A" stroke="#FFF" strokeWidth={1} opacity={1 - f} />; })}
  </g>
);
const ArteFiltroRoto = (rl: number) => (
  <g>
    <path d="M-62,-20 H62 V-6 H-62 Z" fill="url(#ne-mbg)" />
    {[-52, -24, 22, 50].map((x) => <path key={x} d={`M${x - 11},-6 V14 Q${x},26 ${x + 11},14 V-6 Z`} fill="#7AD4B4" stroke="#23705E" strokeWidth={1.2} />)}
    {[0, 1, 2, 3].map((j) => { const f = (rl / 1200 + j / 4) % 1; return <circle key={j} cx={-3 + Math.sin(j * 2) * 6} cy={-8 + f * 66} r={6} fill="#F2B21E" stroke="#A8821A" strokeWidth={1} opacity={1 - f * f} />; })}
  </g>
);
const ArteComplemento = (rl: number) => (
  <g>
    <g transform={`translate(-44,-6) rotate(${f1(Math.sin(rl / 600) * 8)})`}><DibujoCelula dibujo="c1q" d={72} color="#C0397A" /></g>
    <use href="#sg-leu" transform={`translate(38,10) rotate(${f1(rl / 40)}) scale(1.05)`} />
  </g>
);
const ArteLinfoIfn = (rl: number) => (
  <g>
    <g transform="translate(-38,6)"><DibujoCelula dibujo="linfocito" d={62} color="#5E9CD3" /></g>
    <g transform="translate(34,14)"><DibujoCelula dibujo="linfocito" d={54} color="#3FA88C" /></g>
    {[0, 1, 2].map((j) => { const f = (rl / 1500 + j / 3) % 1; return <path key={j} d="M0,-9 L8,-4.5 V4.5 L0,9 L-8,4.5 V-4.5 Z" fill="#E0892E" stroke="#FFF" strokeWidth={1.2} transform={`translate(${-10 + j * 16 + f * 14},${-34 - f * 26})`} opacity={1 - f} />; })}
  </g>
);

export function FondoCapas({ t, reloj }: { t: T; reloj: number }) {
  const me = v(t, 'mesangial'), se = v(t, 'subendotelial'), sp = v(t, 'subepitelial'), la = v(t, 'lado'), pr = v(t, 'pregunta');
  const inf = v(t, 'inflamaG'), es = v(t, 'esclerosisG'), cap = v(t, 'capilar'), en = v(t, 'endotelioL'), mb = v(t, 'mbgL'), po = v(t, 'podoL'), ms = v(t, 'mesangioL');
  const g1 = v(t, 'g1'), g2 = v(t, 'g2'), g3 = v(t, 'g3');
  const brillo = 0.55 + 0.45 * Math.sin(reloj / 260);
  return (
    <g>
      <Base />
      <AsaFija />
      {/* El mesangio se expande con la inflamación */}
      {inf > 0.001 && (
        <g opacity={inf}>
          {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={f1(150 + hash(i, 4) * 96)} cy={f1(390 + hash(i, 5) * 260)} rx={15} ry={10} fill="#5E3A92" />)}
          <circle cx={C.x} cy={C.y} r={C.luz + 18} fill="none" stroke="#6A3CB0" strokeWidth={30} opacity={0.75} />
          <circle cx={C.x} cy={C.y} r={C.luz + 40} fill="none" stroke="#E5484D" strokeWidth={10} opacity={0.14 + 0.1 * brillo} />
        </g>
      )}
      {es > 0.001 && <path d={lobulos(150, 12, 0.06, 4)} transform="translate(208,520) scale(0.72,1.34)" fill="url(#ne-esc)" opacity={es * 0.92} />}
      <Flujo reloj={reloj} filtra={po * (1 - inf)} leuco={inf} />
      {/* La capa que se nombra se enciende */}
      {en * (1 - mb) > 0.01 && <circle cx={C.x} cy={C.y} r={C.luz - 1} fill="none" stroke="#F2B21E" strokeWidth={12} opacity={(en * (1 - mb)) * brillo} />}
      {mb * (1 - po) > 0.01 && <circle cx={C.x} cy={C.y} r={C.luz + 18} fill="none" stroke="#F2B21E" strokeWidth={30} opacity={(mb * (1 - po)) * brillo * 0.7} />}
      {/* Depósitos */}
      {me > 0.001 && Array.from({ length: 12 }, (_, i) => {
        const k = easeOut(tramo(me, i * 0.05, 0.4 + i * 0.05)), a = i * 2.39996, q = Math.sqrt((i + 0.5) / 12);
        return k > 0.01 ? <path key={i} d={lobulos(11 + (i % 3) * 3, 7, 0.2, i + 2)} transform={`translate(${f1(202 + Math.cos(a) * 42 * q)},${f1(520 + Math.sin(a) * 120 * q)}) scale(${k.toFixed(3)})`} fill="#26347E" stroke="#111A4E" strokeWidth={1} /> : null;
      })}
      {se > 0.001 && Array.from({ length: 14 }, (_, i) => {
        const a = -1.2 + (i / 13) * 2.4, k = easeOut(tramo(se, i * 0.04, 0.4 + i * 0.04)), x = C.x + Math.cos(a) * (C.luz + 3), y = C.y + Math.sin(a) * (C.luz + 3);
        return k > 0.01 ? <path key={i} d={lobulos(12, 7, 0.16, i + 3)} transform={`translate(${f1(x)},${f1(y)}) rotate(${f1((a * 180) / Math.PI + 90)}) scale(${(1.2 * k).toFixed(3)},${(0.72 * k).toFixed(3)})`} fill="#26347E" stroke="#111A4E" strokeWidth={1} /> : null;
      })}
      {sp > 0.001 && Array.from({ length: 12 }, (_, i) => {
        const a = -1.14 + (i / 11) * 2.28, k = easeOut(tramo(sp, i * 0.04, 0.4 + i * 0.04)), x = C.x + Math.cos(a) * (C.mbg + 8), y = C.y + Math.sin(a) * (C.mbg + 8);
        return k > 0.01 ? <path key={i} d={lobulos(10, 7, 0.18, i + 5)} transform={`translate(${f1(x)},${f1(y)}) scale(${k.toFixed(3)})`} fill="#26347E" stroke="#111A4E" strokeWidth={1} /> : null;
      })}
      {/* Rótulos de la figura */}
      <g opacity={tramo(cap, 0, 0.6)}><text x={C.x} y={C.y + 8} textAnchor="middle" className={rotulo}>Luz del capilar</text></g>
      {ms > 0.001 && (
        <g opacity={ms}>
          <line x1={120} y1={266} x2={196} y2={420} className={s.guia} />
          <text x={110} y={254} textAnchor="middle" className={rotulo}>Mesangio</text>
        </g>
      )}
      <Titulo x={800} y={70} t="¿En qué capa se depositan los complejos?" k={pr} fin="middle" tam={32} color="#C2385A" />
      {me > 0.5 && <text x={190} y={786} textAnchor="middle" className={`${s.etiquetaDep} ${s.conHalo}`} opacity={tramo(me, 0.5, 1)}>mesangial</text>}
      {/* La lente: la barrera, capa por capa */}
      {en > 0.001 && (
        <g opacity={en}>
          <line x1={C.x + Math.cos(-0.45) * (C.mbg + 2)} y1={C.y + Math.sin(-0.45) * (C.mbg + 2)} x2={930} y2={392} className={s.hiloLupa} />
          <circle cx={C.x + Math.cos(-0.45) * (C.mbg - 16)} cy={C.y + Math.sin(-0.45) * (C.mbg - 16)} r={44} className={s.anilloLupaL} />
        </g>
      )}
      <Lente id="ne-barr" x={1150} y={400} r={215} k={en}>
        <Barrera endo={tramo(en, 0.2, 1)} mbg={mb} podo={po} sub={se} epi={sp} fuga={tramo(la, 0.5, 1)} rl={reloj} />
      </Lente>
      {en > 0.001 && [
        { y: 317, x0: 1348, t: 'Endotelio', sub: 'fenestrado', k: en },
        { y: 388, x0: 1364, t: 'Membrana basal', sub: 'glomerular', k: mb },
        { y: 462, x0: 1356, t: 'Podocito', sub: 'y sus pedicelos', k: po },
      ].map((r) => r.k > 0.001 && (
        <g key={r.y} opacity={tramo(r.k, 0.2, 0.8)}>
          <line x1={r.x0} y1={r.y} x2={1392} y2={r.y} className={s.guia} />
          <text x={1400} y={r.y + 3} className={rotulo} style={{ fontSize: 20 }}>{r.t}</text>
          <text x={1400} y={r.y + 25} className={halo}>{r.sub}</text>
        </g>
      ))}
      {/* Cómo se llaman los dos sitios de la barrera */}
      {se > 0.5 && (
        <g opacity={tramo(se, 0.5, 1) * tramo(en, 0.5, 1)}>
          <line x1={918} y1={322} x2={1024} y2={332} className={s.guia} />
          <text x={910} y={328} textAnchor="end" className={`${s.etiquetaDep} ${s.conHalo}`}>subendotelial</text>
        </g>
      )}
      {sp > 0.5 && (
        <g opacity={tramo(sp, 0.5, 1) * tramo(en, 0.5, 1)}>
          <line x1={918} y1={440} x2={1012} y2={408} className={s.guia} />
          <text x={910} y={446} textAnchor="end" className={`${s.etiquetaDep} ${s.conHalo}`}>subepitelial</text>
        </g>
      )}
      {/* Lado de la sangre y lado del podocito */}
      <Flotante x={1000} y={778} k={tramo(la, 0, 0.5) * tramo(en, 0.5, 1)} rl={reloj} esc={1} alto={52}>{ArteLeucoCompl(reloj)}</Flotante>
      <Nota x={1000} y={866} t="Lado de la sangre: inflaman" sub="llegan los leucocitos" k={tramo(la, 0, 0.5) * tramo(en, 0.5, 1)} tam={20} />
      <FlechaViva a={{ x: 1000, y: 722 }} c={{ x: 1006, y: 672 }} b={{ x: 1040, y: 628 }} k={tramo(la, 0.1, 0.5) * tramo(en, 0.5, 1)} rl={reloj} color="#C2385A" />
      <Flotante x={1330} y={778} k={tramo(la, 0.5, 1) * tramo(en, 0.5, 1)} rl={reloj} fase={2} esc={1.1} alto={62}>{ArteFiltroRoto(reloj)}</Flotante>
      <Nota x={1330} y={866} t="Lado del podocito: dañan el filtro" sub="proteinuria" k={tramo(la, 0.5, 1) * tramo(en, 0.5, 1)} tam={20} />
      <FlechaViva a={{ x: 1330, y: 722 }} c={{ x: 1324, y: 672 }} b={{ x: 1268, y: 618 }} k={tramo(la, 0.6, 1) * tramo(en, 0.5, 1)} rl={reloj} color="#2F6FD0" fase={0.4} />
      {/* Paso 2 · la glomerulonefritis */}
      <Flotante x={1070} y={190} k={g1} rl={reloj} esc={1.3} alto={66}>{ArteComplemento(reloj)}</Flotante>
      <Nota x={1202} y={150} t="Complemento y leucocitos" sub="más células · mesangio expandido" k={g1} fin="start" tam={25} />
      {g1 > 0.001 && <text x={1202} y={200} className={halo} opacity={tramo(g1, 0.3, 0.9)}>paredes y membrana basal engrosadas</text>}
      <Flotante x={1070} y={470} k={g2} rl={reloj} fase={2} esc={1.3} alto={64}>{ArteLinfoIfn(reloj)}</Flotante>
      <Nota x={1202} y={454} t="Linfocitos B y T, interferón I" sub="amplifican la inflamación en el riñón" k={g2} fin="start" tam={25} />
      {g3 > 0.001 && (
        <g opacity={tramo(g3, 0, 0.5)}>
          <g transform="translate(1070,760)"><GlomH r={72} f={FASE_ACTIVA} /></g>
          <FlechaViva a={{ x: 1154, y: 760 }} c={{ x: 1198, y: 748 }} b={{ x: 1240, y: 760 }} k={tramo(es, 0, 0.6)} rl={reloj} color="#6E7789" grosor={7} />
          <g transform="translate(1330,760)" opacity={tramo(es, 0.2, 0.9)}><GlomH r={72} f={FASE_ESCL} /></g>
          <Titulo x={1200} y={892} t="Glomerulonefritis" sub="después, túbulos e intersticio → esclerosis" k={g3} fin="middle" tam={28} color="#C2385A" />
        </g>
      )}
    </g>
  );
}

// ─── Paso 3 · inmunofluorescencia «full house» ────────────────────────────────

const IF_NOMBRES = ['IgG', 'IgA', 'IgM', 'C3', 'C1q'];

function granulos(sem: number, patron: 'full' | 'mes', R = 100) {
  const a: [number, number][] = [], b: [number, number][] = [];
  const asas = patron === 'full' ? 9 : 0;
  for (let i = 0; i < asas; i++) {
    const th = (i / 9) * TAU + sem * 0.3, cx = Math.cos(th) * R * 0.56, cy = Math.sin(th) * R * 0.56, ra = R * (0.2 + hash(i, sem) * 0.05);
    for (let j = 0; j < 15; j++) {
      const f = (j / 15) * TAU + hash(j, i + sem) * 0.3, q = ra * (0.92 + hash(j, sem + 2) * 0.16);
      (j % 3 ? a : b).push([cx + Math.cos(f) * q, cy + Math.sin(f) * q]);
    }
  }
  for (let i = 0; i < 26; i++) { const th = i * 2.39996 + sem, q = Math.sqrt((i + 0.5) / 26) * R * 0.32; (i % 3 ? a : b).push([Math.cos(th) * q, Math.sin(th) * q]); }
  return { a: nube(a), b: nube(b) };
}

const CampoIF = memo(function CampoIF({ sem, patron = 'full' }: { sem: number; patron?: 'full' | 'mes' }) {
  const { a, b } = granulos(sem, patron);
  return (
    <g>
      <rect x={-140} y={-140} width={280} height={280} fill="url(#ne-if)" />
      <path d={lobulos(100, 9, 0.05, sem)} fill="#16402A" opacity={0.75} />
      <path d={a} fill="none" stroke="#2EB864" strokeWidth={15} strokeLinecap="round" opacity={0.28} />
      <path d={a} fill="none" stroke="#7CF29A" strokeWidth={8.6} strokeLinecap="round" />
      <path d={b} fill="none" stroke="#D8FFE2" strokeWidth={5.6} strokeLinecap="round" />
    </g>
  );
});

const ArteIgA = <g><IgG x={-16} y={2} ang={-30} k={1.05} /><IgG x={16} y={2} ang={30} k={1.05} /><rect x={-9} y={22} width={18} height={7} rx={3.4} fill="#C0397A" /></g>;
const ArteC3 = (
  <g>
    <circle r={25} fill="#6A3EAE" /><circle r={25} fill="url(#sg-bola)" />
    <text dy="0.36em" textAnchor="middle" className={s.protTxt} style={{ fontSize: 19 }}>C3</text>
  </g>
);
const ICONOS_IF: ReactNode[] = [<IgG key="g" x={0} y={0} k={1.3} />, ArteIgA, <IgM key="m" x={0} y={0} k={0.54} />, ArteC3, <DibujoCelula key="q" dibujo="c1q" d={66} color="#C0397A" />];

function Casa({ n, rl }: { n: number; rl: number }) {
  const V = [[-52, -16], [0, -16], [52, -16], [-52, 40], [52, 40]];
  return (
    <g>
      <rect x={54} y={-104} width={26} height={60} fill="#8A4A3A" stroke="#5E2E22" strokeWidth={1.6} />
      <path d="M-104,-44 L0,-124 L104,-44 Z" fill="#B8433E" stroke="#6E1E22" strokeWidth={2} strokeLinejoin="round" />
      <path d="M-80,-46 L0,-108 L34,-82" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
      <rect x={-86} y={-46} width={172} height={136} fill="#F4E2C8" stroke="#9A7A52" strokeWidth={2} />
      {V.map(([x, y], i) => {
        const q = clamp(n - i), late = 0.85 + 0.15 * Math.sin(rl / 300 + i);
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            {q > 0.01 && <circle r={38} fill="#7CF29A" opacity={0.22 * q * late} />}
            <rect x={-19} y={-19} width={38} height={38} rx={3} fill={q > 0.5 ? '#7CF29A' : '#3A4256'} stroke="#5C6577" strokeWidth={2} />
            <path d="M0,-19 V19 M-19,0 H19" stroke="#5C6577" strokeWidth={2} />
          </g>
        );
      })}
      <rect x={-17} y={30} width={34} height={60} rx={3} fill="#7A4A30" stroke="#4E2C1A" strokeWidth={1.6} />
      <circle cx={9} cy={62} r={2.6} fill="#F2D388" />
    </g>
  );
}

const CADENA = [{ t: 'C1q', c: '#C0397A', r: 30 }, { t: 'C4', c: '#A0478F', r: 25 }, { t: 'C2', c: '#7E5AC2', r: 24 }, { t: 'C3', c: '#6A3EAE', r: 27 }];

export function FondoFullHouse({ t, reloj }: { t: T; reloj: number }) {
  const fh = v(t, 'fh'), vi = v(t, 'viaClasica'), pi = v(t, 'piensa');
  return (
    <g>
      <Base />
      <text x={800} y={64} textAnchor="middle" className={`${s.tituloSeccion} ${s.conHalo}`}>Inmunofluorescencia: «full house»</text>
      {IF_NOMBRES.map((n, i) => {
        const k = clamp(fh - i), x = 160 + i * 320;
        return (
          <g key={n}>
            <Lente id={`ne-if${i}`} x={x} y={228} r={122} k={k}>
              <g opacity={tramo(k, 0.1, 1)}><CampoIF sem={i + 2} /></g>
            </Lente>
            {k > 0.001 && (
              <g opacity={tramo(k, 0.2, 0.8)}>
                <g transform={`translate(${x - 44},${f1(424 + Math.sin(reloj / 800 + i) * 4)})`}>{ICONOS_IF[i]}</g>
                <text x={x + 10} y={434} className={`${s.tituloSeccion} ${s.conHalo}`} style={n === 'C1q' && vi > 0.5 ? { fill: L.lupus } : undefined}>{n}</text>
              </g>
            )}
          </g>
        );
      })}
      {/* La casa llena */}
      <g transform="translate(300,690) scale(1.06)" opacity={tramo(fh, 0.3, 1)}><Casa n={fh} rl={reloj} /></g>
      <Nota x={300} y={816} t="La casa llena" sub="todo positivo a la vez" k={tramo(fh, 3, 5)} tam={24} />
      {/* C1q, la vía clásica */}
      {vi > 0.001 && (
        <g opacity={tramo(vi, 0, 0.5)}>
          <circle cx={1440} cy={228} r={146} fill="none" stroke={L.lupus} strokeWidth={6} opacity={0.65 + 0.35 * Math.sin(reloj / 280)} />
          <FlechaViva a={{ x: 1440, y: 462 }} c={{ x: 1400, y: 530 }} b={{ x: 1240, y: 596 }} k={tramo(vi, 0.1, 0.8)} rl={reloj} color={L.lupus} />
          {CADENA.map((b, i) => {
            const x = 760 + i * 160, y = 660, q = easeBack(tramo(vi, 0.2 + i * 0.15, 0.5 + i * 0.15));
            return (
              <g key={b.t}>
                {i > 0 && <FlechaSuave a={{ x: x - 122, y }} c={{ x: x - 80, y: y - 12 }} b={{ x: x - b.r - 6, y }} k={tramo(vi, 0.25 + i * 0.15, 0.55 + i * 0.15)} color="#CE5C94" grosor={5} />}
                <g transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}>
                  <circle r={b.r} fill={b.c} /><circle r={b.r} fill="url(#sg-bola)" />
                  <text dy="0.36em" textAnchor="middle" className={s.protTxt} style={{ fontSize: 19 }}>{b.t}</text>
                </g>
              </g>
            );
          })}
          <Nota x={1000} y={740} t="C1q: la vía clásica" sub="la de los complejos inmunes" k={vi} tam={24} />
        </g>
      )}
      <Sello x={800} y={900} w={760} txt="TODO POSITIVO → PIENSA EN LUPUS" k={pi} sz={30} rot={-2} />
    </g>
  );
}

// ─── Pasos 4 a 8 · las seis clases ────────────────────────────────────────────

type Rasgos = { mes?: number; sub?: number; epi?: number; asas?: number; trombos?: number; semiluna?: number; escl?: number; gruesa?: number };
const CLAVES: (keyof Rasgos)[] = ['mes', 'sub', 'epi', 'asas', 'trombos', 'semiluna', 'escl', 'gruesa'];
const PRESET: Rasgos[] = [
  {},
  { mes: 1 },
  { mes: 1, sub: 0.55 },
  { mes: 1, sub: 1, asas: 0.7 },
  { epi: 1, gruesa: 1 },
  { escl: 1 },
];
const FASE_ACTIVA: Rasgos = { mes: 1, sub: 1, asas: 0.7 };
const FASE_ESCL: Rasgos = { escl: 1 };
const LAZOS = [
  ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * TAU + 0.2; return { x: Math.cos(a) * 0.53, y: Math.sin(a) * 0.53, r: 0.185 }; }),
  ...Array.from({ length: 4 }, (_, i) => { const a = (i / 4) * TAU + 0.8; return { x: Math.cos(a) * 0.3, y: Math.sin(a) * 0.3, r: 0.1 }; }),
];

/** El glomérulo en H&E: cápsula, espacio urinario, ovillo con sus asas, mesangio y núcleos. */
export const GlomH = memo(function GlomH({ r, f, det = false }: { r: number; f: Rasgos; det?: boolean }) {
  const escl = f.escl ?? 0, mes = f.mes ?? 0, sub = f.sub ?? 0, asas = f.asas ?? 0, tro = f.trombos ?? 0, semi = f.semiluna ?? 0, epi = f.epi ?? 0, gr = f.gruesa ?? 0;
  return (
    <g>
      <circle r={r} fill="#FBDDE4" stroke="#B85A7C" strokeWidth={r * (0.03 + 0.05 * escl)} />
      {det && Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * TAU; return <ellipse key={i} cx={f1(Math.cos(a) * r * 0.975)} cy={f1(Math.sin(a) * r * 0.975)} rx={r * 0.04} ry={r * 0.014} fill="#4E2E86" transform={`rotate(${f1((a * 180) / Math.PI + 90)} ${f1(Math.cos(a) * r * 0.975)} ${f1(Math.sin(a) * r * 0.975)})`} />; })}
      <circle r={r * 0.94} fill="#FFF7F0" />
      {/* Semiluna: células en el espacio de Bowman que aplastan el ovillo */}
      {semi > 0.001 && (
        <g opacity={semi}>
          <path d={`M${-r * 0.92},${-r * 0.18} A${r * 0.94},${r * 0.94} 0 0 1 ${r * 0.34},${-r * 0.88} C${r * 0.1},${-r * 0.62} ${-r * 0.6},${-r * 0.42} ${-r * 0.92},${-r * 0.18} Z`} fill="#EDA9BE" stroke="#A84A6E" strokeWidth={r * 0.012} />
          {det && Array.from({ length: 26 }, (_, i) => { const a = -2.9 + (i / 26) * 1.7, q = 0.72 + hash(i, 3) * 0.18; return <circle key={i} cx={f1(Math.cos(a) * r * q)} cy={f1(Math.sin(a) * r * q)} r={r * 0.024} fill="#3E2470" />; })}
        </g>
      )}
      {/* Ovillo */}
      <path d={lobulos(r * 0.82, 9, 0.05, 5)} fill="url(#ne-tuft)" stroke="#9E4C80" strokeWidth={r * 0.012} opacity={1 - escl * 0.6} />
      <g opacity={1 - escl * 0.96}>
        {LAZOS.map((p, i) => {
          const x = p.x * r, y = p.y * r, ra = p.r * r, alambre = i % 2 === 0 && i < 8 ? asas : 0, tiene = i % 3 === 0 && i < 8 ? tro : 0;
          const grueso = r * (0.014 + 0.024 * gr + 0.05 * alambre);
          return (
            <g key={i} transform={`translate(${f1(x)},${f1(y)})`}>
              <circle r={ra} fill="#FFF3EA" />
              {i % 2 === 0 && <ellipse cx={ra * 0.1} cy={ra * 0.05} rx={ra * 0.42} ry={ra * 0.3} fill="#D8423E" stroke="#7E1E22" strokeWidth={r * 0.004} transform={`rotate(${i * 30})`} />}
              {i % 3 === 1 && <ellipse cx={-ra * 0.3} cy={ra * 0.2} rx={ra * 0.34} ry={ra * 0.24} fill="#D8423E" stroke="#7E1E22" strokeWidth={r * 0.004} />}
              {/* Subendotelial: un anillo pegado por dentro; las células llenan la luz */}
              {sub > 0.01 && <circle r={ra * 0.84} fill="none" stroke="#E0528C" strokeWidth={r * 0.028} opacity={sub} strokeDasharray={`${f1(ra * 0.42)} ${f1(ra * 0.12)}`} />}
              {sub > 0.01 && [0, 1, 2].map((j) => <circle key={j} cx={Math.cos(j * 2.1 + i) * ra * 0.42} cy={Math.sin(j * 2.1 + i) * ra * 0.42} r={r * 0.02} fill="#3E2470" opacity={sub} />)}
              {/* Pared */}
              <circle r={ra} fill="none" stroke={alambre > 0.05 ? '#E0266E' : '#C45E88'} strokeWidth={grueso} />
              {alambre > 0.05 && <path d={`M${f1(-ra * 0.8)},${f1(-ra * 0.5)} A${f1(ra * 0.94)},${f1(ra * 0.94)} 0 0 1 ${f1(ra * 0.3)},${f1(-ra * 0.9)}`} fill="none" stroke="#FFF" strokeWidth={r * 0.012} strokeLinecap="round" opacity={alambre} />}
              {/* Trombo hialino */}
              {tiene > 0.01 && <g opacity={tiene}><circle r={ra * 0.78} fill="url(#ne-hial)" /><ellipse cx={-ra * 0.26} cy={-ra * 0.3} rx={ra * 0.22} ry={ra * 0.1} fill="#FFF" opacity={0.7} /></g>}
              {/* Subepitelial: gránulos por fuera */}
              {epi > 0.01 && Array.from({ length: 9 }, (_, j) => { const a = (j / 9) * TAU; return <circle key={j} cx={f1(Math.cos(a) * (ra + grueso / 2 + r * 0.01))} cy={f1(Math.sin(a) * (ra + grueso / 2 + r * 0.01))} r={r * 0.011} fill="#26347E" opacity={epi} />; })}
              {/* Núcleo endotelial */}
              <ellipse cx={ra * 0.74} cy={-ra * 0.42} rx={r * 0.022} ry={r * 0.01} fill="#4E2E86" transform={`rotate(60 ${f1(ra * 0.74)} ${f1(-ra * 0.42)})`} />
            </g>
          );
        })}
        {/* Mesangio */}
        <path d={lobulos(r * (0.14 + 0.1 * mes), 8, 0.14 + 0.08 * mes, 7)} fill="#CC92C8" stroke="#8E5A9E" strokeWidth={r * 0.008} />
        {Array.from({ length: 5 + Math.round(11 * mes) }, (_, i) => { const a = i * 2.39996, q = Math.sqrt((i + 0.5) / (5 + 11 * mes)) * r * (0.12 + 0.09 * mes); return <circle key={i} cx={f1(Math.cos(a) * q)} cy={f1(Math.sin(a) * q)} r={r * 0.02} fill="#3E2470" />; })}
        {/* Podocitos sobre el ovillo */}
        {det && Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * TAU + 0.2, q = r * 0.8; return <circle key={i} cx={f1(Math.cos(a) * q)} cy={f1(Math.sin(a) * q)} r={r * 0.024} fill="#3E2470" />; })}
      </g>
      {/* Necrosis fibrinoide, junto a la semiluna */}
      {semi > 0.001 && det && (
        <g opacity={semi} transform={`translate(${f1(-r * 0.34)},${f1(-r * 0.36)})`}>
          <path d={lobulos(r * 0.15, 9, 0.24, 4)} fill="#F2478A" stroke="#B81E62" strokeWidth={r * 0.006} />
          {Array.from({ length: 12 }, (_, i) => { const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 12) * r * 0.12; return <circle key={i} cx={f1(Math.cos(a) * q)} cy={f1(Math.sin(a) * q)} r={r * 0.008} fill="#2E2A78" />; })}
        </g>
      )}
      {/* Esclerosis: ovillo sólido, sin luces */}
      {escl > 0.001 && (
        <g opacity={escl}>
          <path d={lobulos(r * 0.8, 9, 0.05, 5)} fill="url(#ne-esc)" stroke="#8E7A90" strokeWidth={r * 0.012} />
          {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${f1(-r * 0.7 + (hash(i, 2) * r) / 3)},${f1(-r * 0.6 + i * r * 0.11)} C${f1(-r * 0.2)},${f1(-r * 0.66 + i * r * 0.12)} ${f1(r * 0.2)},${f1(-r * 0.54 + i * r * 0.11)} ${f1(r * 0.7 - (hash(i, 3) * r) / 3)},${f1(-r * 0.6 + i * r * 0.11)}`} fill="none" stroke="#A08E9E" strokeWidth={r * 0.01} opacity={0.65} />)}
          {[[-0.3, -0.2], [0.24, -0.34], [0.34, 0.2], [-0.16, 0.34], [0.02, 0.02]].map(([x, y], i) => <ellipse key={i} cx={x * r} cy={y * r} rx={r * 0.022} ry={r * 0.012} fill="#4E3E5A" />)}
        </g>
      )}
    </g>
  );
}, (a, b) => a.r === b.r && a.det === b.det && CLAVES.every((k) => (a.f[k] ?? 0) === (b.f[k] ?? 0)));

/** Un campo al microscopio: el glomérulo rodeado de túbulos. */
const CampoFijo = memo(function CampoFijo() {
  const T_: [number, number, number][] = Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * TAU + 0.15; return [Math.cos(a) * 308, Math.sin(a) * 308, 44 + hash(i, 5) * 22]; });
  return (
    <g>
      <rect x={-360} y={-360} width={720} height={720} fill="url(#ne-campo)" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${f1(-340 + hash(i, 2) * 680)},${f1(-340 + hash(i, 3) * 680)} q${f1((hash(i, 4) - 0.5) * 50)},${f1((hash(i, 5) - 0.5) * 50)} ${f1((hash(i, 6) - 0.5) * 80)},${f1((hash(i, 7) - 0.5) * 80)}`} fill="none" stroke="#E7A8BC" strokeWidth={2} opacity={0.7} />)}
      {T_.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${f1(x)},${f1(y)})`}>
          <circle r={r} fill="#EDA5BE" stroke="#B85A7C" strokeWidth={1.6} />
          <circle r={r * 0.42} fill="#FFF3F2" />
          {Array.from({ length: 10 }, (_, j) => { const a = (j / 10) * TAU; return <circle key={j} cx={f1(Math.cos(a) * r * 0.7)} cy={f1(Math.sin(a) * r * 0.7)} r={r * 0.095} fill="#4E2E86" />; })}
        </g>
      ))}
    </g>
  );
});

// ─── Las lentes de la derecha ─────────────────────────────────────────────────

/** Una sola asa, muy aumentada: la pared rígida y brillante. */
function ArteAsaAlambre({ k, rl }: { k: number; rl: number }) {
  const a = (rl / 900) % TAU;
  return (
    <g>
      <rect x={-130} y={-130} width={260} height={260} fill="#F4C2D2" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={f1(Math.cos(i * 2.4) * 96)} cy={f1(Math.sin(i * 2.4) * 96)} r={5} fill="#4E2E86" />)}
      <circle r={68} fill="#FFF3EA" />
      <ellipse cx={8} cy={8} rx={26} ry={18} fill="#D8423E" stroke="#7E1E22" strokeWidth={1} transform="rotate(30 8 8)" />
      <circle r={68} fill="none" stroke="#E0266E" strokeWidth={lerp(6, 26, k)} />
      <circle r={68} fill="none" stroke="#FFD2E4" strokeWidth={lerp(1, 6, k)} opacity={0.75} />
      <path d={`M${f1(Math.cos(a) * 68)},${f1(Math.sin(a) * 68)} A68,68 0 0 1 ${f1(Math.cos(a + 0.7) * 68)},${f1(Math.sin(a + 0.7) * 68)}`} fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={k * 0.9} />
    </g>
  );
}
function ArteTrombo({ k }: { k: number }) {
  return (
    <g>
      <rect x={-130} y={-130} width={260} height={260} fill="#F4C2D2" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={f1(Math.cos(i * 2.4 + 1) * 96)} cy={f1(Math.sin(i * 2.4 + 1) * 96)} r={5} fill="#4E2E86" />)}
      <circle r={70} fill="#FFF3EA" stroke="#C45E88" strokeWidth={6} />
      <g transform={`scale(${(0.2 + 0.8 * easeOut(k)).toFixed(3)})`} opacity={tramo(k, 0, 0.3)}>
        <circle r={60} fill="url(#ne-hial)" />
        <ellipse cx={-22} cy={-26} rx={18} ry={8} fill="#FFF" opacity={0.7} transform="rotate(-30 -22 -26)" />
        <path d="M-30,20 C-12,30 18,28 34,14" fill="none" stroke="#FFF" strokeWidth={2.4} opacity={0.4} />
      </g>
    </g>
  );
}
function ArteSemiluna({ k }: { k: number }) {
  return (
    <g>
      <rect x={-130} y={-130} width={260} height={260} fill="#FFF7F0" />
      <circle r={118} fill="none" stroke="#B85A7C" strokeWidth={10} />
      <g opacity={k}>
        <path d="M-108,-40 A116,116 0 0 1 86,-78 C44,-36 -46,-22 -108,-40 Z" fill="#EDA9BE" stroke="#A84A6E" strokeWidth={1.6} />
        {Array.from({ length: 22 }, (_, i) => { const a = -2.8 + (i / 22) * 1.9, q = 76 + hash(i, 4) * 32; return <circle key={i} cx={f1(Math.cos(a) * q)} cy={f1(Math.sin(a) * q)} r={5} fill="#3E2470" />; })}
      </g>
      <path d={lobulos(72, 8, 0.07, 3)} transform={`translate(10,${f1(lerp(6, 44, k))}) scale(1,${(lerp(1, 0.8, k)).toFixed(3)})`} fill="url(#ne-tuft)" stroke="#9E4C80" strokeWidth={1.4} />
      {[[-26, 34], [24, 28], [8, 72], [42, 68], [-20, 72]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={15} fill="#FFF3EA" stroke="#C45E88" strokeWidth={2} />)}
      <g opacity={k} transform="translate(-6,-10)">
        <path d={lobulos(24, 9, 0.26, 4)} fill="#F2478A" stroke="#B81E62" strokeWidth={1} />
        {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={f1(Math.cos(i * 2.4) * 16)} cy={f1(Math.sin(i * 2.4) * 12)} r={2.2} fill="#2E2A78" />)}
      </g>
    </g>
  );
}
/** La plata tiñe la membrana de negro: púas que salen entre los depósitos, que no se tiñen. */
function ArtePlata({ sp }: { sp: number }) {
  const q = easeOut(sp);
  return (
    <g>
      <rect x={-140} y={-140} width={280} height={280} fill="#E7DFC4" />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={f1(-130 + hash(i, 2) * 260)} cy={f1(-130 + hash(i, 3) * 90)} r={2.4} fill="#B9AE88" />)}
      <path d="M-140,26 C-60,20 60,30 140,22 V96 C60,102 -60,94 -140,100 Z" fill="#F3E3C6" />
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-124 + i * 31} cy={8} rx={12} ry={15} fill="#F7EFDA" stroke="#CFC39E" strokeWidth={1} opacity={tramo(sp, 0, 0.4)} />)}
      <path d="M-140,32 C-60,26 60,36 140,28" fill="none" stroke="#14110C" strokeWidth={15} />
      {Array.from({ length: 10 }, (_, i) => { const x = -139 + i * 31; return <path key={i} d={`M${x - 5},${30} L${x},${f1(30 - 44 * q)} L${x + 5},${30} Z`} fill="#14110C" />; })}
    </g>
  );
}
const ArteDropAmp = (rl: number) => (
  <g>
    <g transform={`translate(0,${f1(Math.abs(Math.sin(rl / 300)) * -5)})`}>
      <path d="M-8,-46 H8 V-20 H24 L0,8 L-24,-20 H-8 Z" fill="#D1293D" stroke="#FFF" strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  </g>
);

/** Tubo de orina: `espuma` para la proteinuria, `sangre` para la hematuria. */
export function TuboOrina({ espuma = 0, sangre = 0, rl, grasa = 0 }: { espuma?: number; sangre?: number; rl: number; grasa?: number }) {
  return (
    <g>
      <path d="M-30,-46 L-30,76 A30,23 0 0 0 30,76 L30,-46 Z" fill={sangre > 0.5 ? 'url(#ne-orinaR)' : 'url(#ne-orina)'} />
      {grasa > 0.01 && [[-14, 8], [10, 24], [-4, 46], [14, 62], [-16, 66]].map(([x, y], i) => <circle key={i} cx={x + Math.sin(rl / 500 + i) * 2} cy={y} r={5} fill="#FFF3B8" stroke="#D69A1C" strokeWidth={1} opacity={grasa} />)}
      {espuma > 0.01 && Array.from({ length: 16 }, (_, i) => { const x = -24 + (i % 6) * 9.6 + (Math.floor(i / 6) % 2) * 4, y = -48 - Math.floor(i / 6) * 11 + Math.sin(rl / 500 + i) * 1.5; return <g key={i} opacity={espuma}><circle cx={x} cy={y} r={7 + hash(i, 3) * 3} fill="#FFFDF2" stroke="#D9CFA8" strokeWidth={1} /><circle cx={x - 2} cy={y - 2.6} r={1.8} fill="#FFF" /></g>; })}
      <path d="M-35,-84 L-35,76 A35,27 0 0 0 35,76 L35,-84" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3.4} />
      <path d="M-23,-74 V70" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      <rect x={-42} y={-96} width={84} height={13} rx={5} fill="#9AA6B8" stroke="#5C6577" strokeWidth={1} />
    </g>
  );
}

/** Diez glomérulos en fila: los enfermos, encendidos. */
function FilaGlom({ x, y, n, k, rl, escl = false }: { x: number; y: number; n: number; k: number; rl: number; escl?: boolean }) {
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const q = tramo(k, i * 0.06, 0.2 + i * 0.06), mal = i < n && tramo(k, 0.3 + i * 0.05, 0.5 + i * 0.05) > 0.5;
        return (
          <g key={i} opacity={q} transform={`translate(${x + i * 72},${y}) scale(${(0.7 + 0.3 * easeBack(clamp(q))).toFixed(3)})`}>
            {mal && !escl && <circle r={37 + Math.sin(rl / 300 + i) * 2} fill="none" stroke="#E5293F" strokeWidth={4} opacity={0.75} />}
            <g opacity={mal ? 1 : 0.5}><GlomH r={30} f={mal ? (escl ? FASE_ESCL : FASE_ACTIVA) : PRESET[0]} /></g>
          </g>
        );
      })}
    </g>
  );
}

const IconoCheck = <path d="M-12,1 L-3,10 L13,-10" fill="none" stroke="#FFF" strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />;
const IconoAlerta = <g fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M0,-14 L14,11 H-14 Z" /><path d="M0,-4 V3 M0,7.5 V7.6" /></g>;
const IconoMeta = <g fill="none" stroke="#2F9A6A" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M-9,17 V-17" /><path d="M-9,-16 L13,-9 L-9,-1 Z" fill="#2F9A6A" /></g>;

const NUM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const XM = (i: number) => 150 + i * 260;
const CAMPO = { x: 370, y: 625, r: 330 };

const RinonCicatriz = (
  <g>
    <path d="M-16,-52 C18,-66 44,-40 44,-4 C44,34 18,62 -14,52 C-30,46 -16,22 -22,8 C-30,-8 -30,-44 -16,-52 Z" fill="url(#ne-cic)" stroke="#3E2A28" strokeWidth={1.8} />
    {[[16, -28, 8], [26, 6, 9], [10, 32, 7], [-4, -36, 6], [2, -6, 6]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#4E3432" opacity={0.65} />)}
    <path d="M-22,-4 C-40,-6 -56,-14 -70,-24 M-22,6 C-40,10 -56,18 -72,24" fill="none" stroke="#7D6260" strokeWidth={5} strokeLinecap="round" />
  </g>
);

export function FondoClases({ t, reloj }: { t: T; reloj: number }) {
  const fo = v(t, 'focoClase');
  const grande: Rasgos = {
    mes: v(t, 'gMes'), sub: v(t, 'gSub'), epi: v(t, 'gEpi'), asas: v(t, 'gAsas'),
    trombos: v(t, 'gTrombos'), semiluna: v(t, 'gSemiluna'), escl: v(t, 'gEscl'), gruesa: v(t, 'gGruesa'),
  };
  const sp = v(t, 'spikes'), gq = v(t, 'grande');
  const c1 = v(t, 'c1'), c1b = v(t, 'c1b'), c2 = v(t, 'c2'), c34 = v(t, 'c34'), c3 = v(t, 'c3'), c4 = v(t, 'c4'), c4b = v(t, 'c4b'), i1 = v(t, 'i1'), c5 = v(t, 'c5'), c5b = v(t, 'c5b'), c6 = v(t, 'c6'), c6b = v(t, 'c6b'), c6c = v(t, 'c6c');
  const fl = (i: number) => Math.sin(reloj / 800 + i * 2) * 3;
  const activo = Math.round(fo) - 1, kAct = clamp(1 - Math.abs(fo - Math.round(fo)) * 2);
  return (
    <g>
      <Base />
      {NUM.map((n, i) => {
        const k = v(t, `clase${i + 1}`);
        if (k <= 0.001) return null;
        const act = clamp(1 - Math.abs(fo - (i + 1)) * 1.4);
        return (
          <g key={n} opacity={k * (0.42 + 0.58 * act)} transform={`translate(${XM(i)},128) scale(${(0.86 + 0.14 * act).toFixed(3)})`}>
            {act > 0.05 && <circle r={84} fill="none" stroke={L.rinon} strokeWidth={5} opacity={act} />}
            <GlomH r={72} f={PRESET[i]} />
            <text x={0} y={108} textAnchor="middle" className={`${s.tituloSeccion} ${s.conHalo}`}>{n}</text>
          </g>
        );
      })}
      {/* Lo que une la clase activa con el campo */}
      {gq > 0.001 && activo >= 0 && activo < 6 && kAct > 0.05 && Math.abs(XM(activo) - CAMPO.x) > 0 && (
        <line x1={XM(activo)} y1={246} x2={lerp(XM(activo), CAMPO.x, 0.9)} y2={CAMPO.y - CAMPO.r + 2} className={s.hiloLupa} opacity={kAct * gq * 0.6} />
      )}
      <Lente id="ne-campo-l" x={CAMPO.x} y={CAMPO.y} r={CAMPO.r} k={gq}>
        <CampoFijo />
        <GlomH r={226} f={grande} det />
      </Lente>

      {/* Clase I */}
      <Lente id="ne-i" x={870} y={395} r={100} k={c1}><CampoIF sem={3} patron="mes" /></Lente>
      <Titulo x={990} y={350} t="Clase I · mesangial mínima" sub="a la luz, el glomérulo es normal" k={c1} tam={26} />
      {c1 > 0.001 && <text x={990} y={408} className={halo} style={{ fontSize: 19 }} opacity={tramo(c1, 0.3, 0.9)}>depósitos solo en IF o ME · asintomática</text>}
      <Letrero x={1190} y={468} w={410} txt="PRONÓSTICO EXCELENTE" k={c1b} tono="verde">{IconoCheck}</Letrero>
      {/* Clase II */}
      {c2 > 0.001 && (
        <g>
          <Lente id="ne-ii" x={870} y={730} r={100} k={c2}>
            <rect x={-130} y={-130} width={260} height={260} fill="#F4C2D2" />
            <g transform="scale(1.5)"><GlomH r={84} f={PRESET[1]} /></g>
          </Lente>
          <Titulo x={990} y={690} t="Clase II · mesangial proliferativa" sub="más células y matriz en el mesangio" k={c2} tam={26} />
          <text x={990} y={748} className={halo} style={{ fontSize: 19 }} opacity={tramo(c2, 0.3, 0.9)}>hematuria y proteinuria leves</text>
          <text x={990} y={790} className={`${s.lEtiquetaVerde} ${s.conHalo}`} style={{ fontSize: 21 }} opacity={v(t, 'c2b')}>también excelente pronóstico</text>
        </g>
      )}

      {/* Clases III y IV */}
      <Lente id="ne-34" x={870} y={420} r={106} k={c34} flota={fl(0)}><g transform="scale(0.58)"><Barrera sub={1} rl={reloj} /></g></Lente>
      <Titulo x={1000} y={400} t="Depósitos subendoteliales" sub="las clases graves" k={c34} tam={27} />
      <Titulo x={800} y={592} t="Clase III · focal" sub="" k={c3} tam={25} />
      {c3 > 0.001 && <text x={1040} y={592} className={`${s.lSub} ${s.conHalo}`} style={{ fontSize: 20 }} opacity={tramo(c3, 0.3, 0.9)}>menos del 50 % de los glomérulos</text>}
      <FilaGlom x={830} y={646} n={4} k={c3} rl={reloj} />
      <Titulo x={800} y={744} t="Clase IV · difusa" sub="" k={c4} tam={25} />
      {c4 > 0.001 && <text x={1040} y={744} className={`${s.lSub} ${s.conHalo}`} style={{ fontSize: 20 }} opacity={tramo(c4, 0.3, 0.9)}>50 % o más de los glomérulos</text>}
      <FilaGlom x={830} y={798} n={8} k={c4} rl={reloj} />
      <Letrero x={1180} y={900} w={720} txt="LA IV: LA MÁS FRECUENTE Y LA MÁS GRAVE" k={c4b} tono="rojo">{IconoAlerta}</Letrero>

      {/* Asas de alambre, trombos y semilunas */}
      <Lente id="ne-a" x={880} y={374} r={94} k={v(t, 'gAsas') * (1 - v(t, 'clase5') * 0.999)}><ArteAsaAlambre k={tramo(v(t, 'gAsas'), 0.2, 1)} rl={reloj} /></Lente>
      <Nota x={1000} y={362} t="Asas de alambre" sub="pared rígida y brillante" k={v(t, 'gAsas') * (1 - v(t, 'clase5'))} fin="start" tam={26} />
      <Lente id="ne-t" x={880} y={600} r={94} k={v(t, 'gTrombos') * (1 - v(t, 'clase5') * 0.999)}><ArteTrombo k={tramo(v(t, 'gTrombos'), 0.2, 1)} /></Lente>
      <Nota x={1000} y={588} t="Trombos hialinos" sub="el complejo llena la luz" k={v(t, 'gTrombos') * (1 - v(t, 'clase5'))} fin="start" tam={26} />
      <Lente id="ne-s" x={880} y={826} r={94} k={v(t, 'gSemiluna') * (1 - v(t, 'clase5') * 0.999)}><ArteSemiluna k={tramo(v(t, 'gSemiluna'), 0.2, 1)} /></Lente>
      <Nota x={1000} y={806} t="Necrosis fibrinoide y semilunas" sub="insuficiencia renal rápidamente progresiva" k={i1} fin="start" tam={26} />
      {i1 > 0.001 && <g opacity={tramo(i1, 0.2, 0.8)} transform={`translate(1480,${f1(800 + Math.sin(reloj / 800) * 3)})`}><IconoOrgano i="rinon" x={0} y={0} k={0.9} /><g transform="translate(66,30)">{ArteDropAmp(reloj)}</g></g>}

      {/* Clase V */}
      <Lente id="ne-v" x={880} y={410} r={118} k={c5} flota={fl(1)}><g transform="scale(0.62)"><Barrera epi={1} gruesa={v(t, 'gGruesa')} rl={reloj} /></g></Lente>
      <Titulo x={1024} y={380} t="Clase V · membranosa" sub="depósitos subepiteliales" k={c5} tam={28} />
      {c5 > 0.001 && <text x={1024} y={440} className={`${s.lSub} ${s.conHalo}`} style={{ fontSize: 20 }} opacity={tramo(c5, 0.3, 0.9)}>membranas engrosadas</text>}
      <Lente id="ne-pl" x={880} y={740} r={118} k={sp} flota={fl(2)}><ArtePlata sp={sp} /></Lente>
      <Nota x={1024} y={712} t="Con plata: «spikes»" sub="púas entre los depósitos" k={sp} fin="start" tam={26} />
      <Flotante x={1420} y={720} k={c5b} rl={reloj} esc={1.05} alto={92}><TuboOrina espuma={1} rl={reloj} /></Flotante>
      <Nota x={1420} y={846} t="Síndrome nefrótico" k={c5b} tam={25} />

      {/* Clase VI */}
      <Titulo x={800} y={350} t="Clase VI · esclerosis avanzada" sub="90 % o más de los glomérulos con esclerosis global" k={c6} tam={29} />
      <FilaGlom x={830} y={452} n={9} k={c6} rl={reloj} escl />
      {c6b > 0.001 && (
        <g opacity={tramo(c6b, 0, 0.5)}>
          <g transform={`translate(880,${f1(650 + fl(3))})`}><IconoOrgano i="rinon" x={0} y={0} k={1.2} /></g>
          <FlechaViva a={{ x: 960, y: 650 }} c={{ x: 1010, y: 636 }} b={{ x: 1056, y: 650 }} k={tramo(c6b, 0.1, 0.8)} rl={reloj} color="#6E7789" grosor={7} />
          <g transform={`translate(1130,${f1(650 + fl(4))})`} opacity={tramo(c6b, 0.3, 0.9)}>{RinonCicatriz}</g>
          <Nota x={1206} y={630} t="Enfermedad renal crónica" sub="daño irreversible:" k={c6b} fin="start" tam={25} />
          <text x={1206} y={680} className={halo} opacity={tramo(c6b, 0.4, 1)}>ya no hay mucho que tratar</text>
        </g>
      )}
      <Letrero x={1180} y={860} w={720} txt="EL OBJETIVO DEL SEGUIMIENTO: NO LLEGAR AQUÍ" k={c6c} tono="verde" claro>{IconoMeta}</Letrero>
    </g>
  );
}

// ─── Paso 9 · la clínica ──────────────────────────────────────────────────────

const ArteHematuria = (rl: number) => <TuboOrina sangre={1} rl={rl} />;
function HematieDismorfico({ x, y, r, sem }: { x: number; y: number; r: number; sem: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d={lobulos(r, 8, 0.26, sem)} fill="#E86A5E" stroke="#8E1E22" strokeWidth={1.3} />
      {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * TAU + sem; return <circle key={i} cx={f1(Math.cos(a) * r * 0.98)} cy={f1(Math.sin(a) * r * 0.98)} r={r * 0.2} fill="#E86A5E" stroke="#8E1E22" strokeWidth={1} />; })}
      <circle r={r * 0.44} fill="#F4B6A8" opacity={0.75} />
    </g>
  );
}
export const ArteSedimento = (
  <g>
    <rect x={-160} y={-160} width={320} height={320} fill="#FFF3C8" />
    <g transform="rotate(-16)">
      <rect x={-118} y={-30} width={236} height={60} rx={30} fill="#F2C2A4" stroke="#B8704E" strokeWidth={2.2} />
      {[-90, -56, -22, 12, 46, 84].flatMap((x, i) => [8, -9].map((y, j) => <ellipse key={`${i}${j}`} cx={x + j * 12} cy={y + (i % 2) * 2} rx={14} ry={10.4} fill="#D8423E" stroke="#7E1E22" strokeWidth={1} />))}
    </g>
    <HematieDismorfico x={-82} y={-92} r={20} sem={3} />
    <HematieDismorfico x={76} y={-94} r={17} sem={5} />
    <HematieDismorfico x={-70} y={92} r={17} sem={7} />
    <HematieDismorfico x={84} y={78} r={21} sem={9} />
  </g>
);
const ArteCreat = (rl: number) => (
  <g>
    <path d="M-20,-38 V-12 L-40,28 C-48,44 -38,50 -24,50 H24 C38,50 48,44 40,28 L20,-12 V-38 Z" fill="#F7F9FB" fillOpacity={0.8} stroke="#7D899C" strokeWidth={3} />
    <path d="M-30,16 C-14,8 14,22 30,16 L40,30 C44,44 36,48 24,48 H-24 C-36,48 -44,44 -40,30 Z" fill="#D9881E" />
    <rect x={-26} y={-48} width={52} height={11} rx={4} fill="#9AA6B8" />
    <text y={40} textAnchor="middle" className={s.protTxt} style={{ fontSize: 17 }}>Cr</text>
    <g transform={`translate(58,${f1(-6 - Math.abs(Math.sin(rl / 320)) * 8)})`}><path d="M0,-24 L18,2 H7 V24 H-7 V2 H-18 Z" fill="#E5484D" stroke="#FFF" strokeWidth={2} strokeLinejoin="round" /></g>
  </g>
);
/** Tobillo con la huella que deja el dedo. */
const ArteEdema = (
  <g>
    <path d="M-34,-62 C-44,-20 -52,10 -50,30 C-50,44 -36,50 -14,50 H54 C70,50 72,32 56,26 C40,20 34,8 30,-8 C28,-30 28,-46 30,-62 Z" fill="url(#pl-torso)" stroke="#A9765C" strokeWidth={1.8} />
    <path d="M-40,-14 C-20,-6 8,-8 26,-16" fill="none" stroke="#A9765C" strokeWidth={1.4} opacity={0.5} />
    <ellipse cx={-8} cy={-22} rx={14} ry={10} fill="#B9805E" />
    <ellipse cx={-8} cy={-24} rx={10} ry={6} fill="#8E5A44" opacity={0.55} />
    <path d="M-44,0 C-46,14 -46,24 -42,34" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
  </g>
);
const ArteAlbumina = (rl: number) => (
  <g>
    <rect x={-16} y={-54} width={32} height={108} rx={15} fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3} />
    {[0, 1].map((j) => <circle key={j} cy={38 - j * 22} r={10} fill="#F2B21E" stroke="#A8821A" strokeWidth={1} />)}
    <g transform={`translate(44,${f1(Math.abs(Math.sin(rl / 320)) * 7)})`}><path d="M0,22 L16,-2 H6 V-22 H-6 V-2 H-16 Z" fill="#2F6FD0" stroke="#FFF" strokeWidth={2} strokeLinejoin="round" /></g>
  </g>
);
const ArteLipidos = (rl: number) => (
  <g>
    {[[-22, 12, 22], [18, -10, 26], [22, 28, 15], [-22, -28, 13]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x},${f1(y + Math.sin(rl / 700 + i) * 3)})`}>
        <circle r={r} fill="url(#sg-gra)" stroke="#C99A3C" strokeWidth={1.4} />
        <ellipse cx={-r * 0.3} cy={-r * 0.36} rx={r * 0.3} ry={r * 0.13} fill="#FFF" opacity={0.65} />
      </g>
    ))}
  </g>
);

/** La tira reactiva que entra en el tubo y cambia de color. */
function Tira({ k, rl }: { k: number; rl: number }) {
  if (k <= 0.001) return null;
  const baja = easeInOut(tramo(k, 0, 0.5)), rea = tramo(k, 0.5, 1);
  const col = ['#F2B21E', '#2CA98C', '#E0526E', '#7E5AC2', '#D9881E'];
  return (
    <g opacity={tramo(k, 0, 0.2)}>
      <g transform={`translate(300,${f1(840 + Math.sin(rl / 900) * 2)})`}><TuboOrina rl={rl} /></g>
      <g transform={`translate(300,${f1(lerp(590, 720, baja))})`}>
        <rect x={-12} y={0} width={24} height={210} rx={3} fill="#FFFEFA" stroke="#9AA6B8" strokeWidth={1.4} />
        {col.map((c, i) => <rect key={i} x={-9} y={110 + i * 19} width={18} height={14} rx={2} fill={i < 3 ? c : '#EFEAD8'} opacity={i < 3 ? lerp(0.2, 1, rea) : 1} stroke="#B9AE92" strokeWidth={0.7} />)}
      </g>
    </g>
  );
}

const SILENTES: { t: string; arte: (rl: number) => ReactNode; esc: number }[] = [
  { t: 'proteinuria', arte: (rl) => <g transform="scale(0.72)"><TuboOrina espuma={1} rl={rl} /></g>, esc: 1 },
  { t: 'hematuria microscópica', arte: (rl) => <g transform="scale(0.72)">{ArteHematuria(rl)}</g>, esc: 1 },
  { t: 'cilindros', arte: () => <g transform="rotate(-16) scale(0.62)"><rect x={-90} y={-26} width={180} height={52} rx={26} fill="#F2C2A4" stroke="#B8704E" strokeWidth={2.4} />{[-60, -30, 0, 30, 60].map((x) => <ellipse key={x} cx={x} cy={0} rx={14} ry={11} fill="#D8423E" stroke="#7E1E22" strokeWidth={1} />)}</g>, esc: 1 },
  { t: 'edema', arte: () => <g transform="scale(0.92)">{ArteEdema}</g>, esc: 1 },
  { t: 'hipertensión', arte: (rl) => ArteManometro(rl, 1), esc: 1 },
  { t: 'creatinina que sube', arte: (rl) => <g transform="scale(0.86)">{ArteCreat(rl)}</g>, esc: 1 },
];

export function FondoClinicaN({ t, reloj }: { t: T; reloj: number }) {
  const k0 = v(t, 'k0'), nf = v(t, 'kNef'), no = v(t, 'kNeo'), ori = v(t, 'iOri'), ko = v(t, 'kOri');
  return (
    <g>
      <Base />
      <Titulo x={800} y={58} t="Puede ser silenciosa…" k={tramo(k0, 0, 0.1)} fin="middle" tam={30} />
      {SILENTES.map((it, i) => {
        const k = tramo(k0, 0.05 + i * 0.13, 0.2 + i * 0.13), x = 170 + i * 252;
        return (
          <g key={it.t}>
            <Flotante x={x} y={160} k={k} rl={reloj} fase={i * 1.3} esc={it.esc} alto={70}>{it.arte(reloj)}</Flotante>
            <Nota x={x} y={268} t={it.t} k={k} tam={19} />
          </g>
        );
      })}
      {/* Clases III y IV: nefrítico */}
      <Titulo x={400} y={342} t="Clases III y IV → nefrítico" k={nf} fin="middle" tam={30} color="#C2385A" />
      <Lente id="ne-sed" x={170} y={510} r={118} k={nf}>{ArteSedimento}</Lente>
      <Nota x={170} y={666} t="Hematuria dismórfica" sub="y cilindros eritrocitarios" k={nf} tam={20} />
      <Flotante x={430} y={500} k={tramo(nf, 0.3, 1)} rl={reloj} fase={1} esc={1.3} alto={66}>{ArteManometro(reloj, tramo(nf, 0.4, 1))}</Flotante>
      <Nota x={430} y={598} t="Hipertensión" k={tramo(nf, 0.3, 1)} tam={20} />
      <Flotante x={640} y={500} k={tramo(nf, 0.5, 1)} rl={reloj} fase={2} esc={1} alto={66}>{ArteCreat(reloj)}</Flotante>
      <Nota x={640} y={598} t="Azoemia" k={tramo(nf, 0.5, 1)} tam={20} />
      {/* Clase V: nefrótico */}
      <Titulo x={1180} y={342} t="Clase V → nefrótico" k={no} fin="middle" tam={30} color="#2F6FD0" />
      <Flotante x={880} y={490} k={no} rl={reloj} esc={1.1} alto={100}><TuboOrina espuma={1} grasa={1} rl={reloj} /></Flotante>
      <Nota x={880} y={634} t="Más de 3,5 g de proteína" sub="al día" k={no} tam={20} />
      <Flotante x={1120} y={490} k={tramo(no, 0.2, 1)} rl={reloj} fase={1} esc={1.2} alto={78}>{ArteAlbumina(reloj)}</Flotante>
      <Nota x={1120} y={608} t="Hipoalbuminemia" k={tramo(no, 0.2, 1)} tam={20} />
      <Flotante x={1320} y={490} k={tramo(no, 0.4, 1)} rl={reloj} fase={2} esc={1.2} alto={72}>{ArteEdema}</Flotante>
      <Nota x={1320} y={608} t="Edema" k={tramo(no, 0.4, 1)} tam={20} />
      <Flotante x={1500} y={490} k={tramo(no, 0.6, 1)} rl={reloj} fase={3} esc={1.2} alto={60}>{ArteLipidos(reloj)}</Flotante>
      <Nota x={1500} y={608} t="Hiperlipidemia" k={tramo(no, 0.6, 1)} tam={20} />
      {/* En cada control */}
      <Tira k={ori} rl={reloj} />
      <Titulo x={440} y={830} t="Examen de orina en cada control" sub="el riñón puede enfermar sin dar síntomas" k={ko} tam={36} color="#1F9A6A" />
    </g>
  );
}
