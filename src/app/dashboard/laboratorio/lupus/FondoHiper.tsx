'use client';
// Tejidos de «Hipersensibilidad» reutilizados en el laboratorio de lupus (el
// vaso con depósitos, necrosis fibrinoide, vasculitis y trombo; la sangre con
// hemólisis; el glomérulo), con lo que el lupus les añade encima:
// · `h-vaso`: color y profundidad sobre el tejido y la luz, y las ilustraciones del
//   capítulo 5: la vía clásica paso a paso (C1q, C4 y C2, convertasa, C3), los
//   termómetros del complemento (C3, C4 y CH50 que caen con el consumo y suben al
//   mejorar), la lupa de la fagocitosis frustrada y la necrosis fibrinoide en H&E.
//   Y el tubo de ensayo del anticoagulante lúpico (capítulo 6).
// Los parámetros propios del tejido los dibuja el fondo de Hipersensibilidad.

import { memo, type ReactNode } from 'react';
import { FondoDe as FondoHipersensibilidad } from '../hipersensibilidad/Fondos';
import { L } from '@/lib/data/lupus/colores';
import { ComplejoNuc, DibujoCelula, IgG } from './Celulas';
import { Medalla } from './FondoInterferon';
import { clamp, easeBack, easeOut, FlechaSuave, Globo, tramo, v, type T } from './laminas';
import h from '@/styles/hipersensibilidad.module.css';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const V = { cx: 600, cy: 520, luz: 320, adv: 425 };

const DefsVaso = memo(function DefsVaso() {
  return (
    <defs>
      <linearGradient id="h5-tinte" x1="0" y1="0" x2="1" y2="1"><stop offset="0" className={s.h5T1} /><stop offset="1" className={s.h5T2} /></linearGradient>
      <radialGradient id="h5-luz" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stopColor="#C2385A" stopOpacity="0" /><stop offset="1" stopColor="#A81E34" stopOpacity="0.34" /></radialGradient>
      <radialGradient id="h5-bola" cx="0.36" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFF" stopOpacity="0.6" /><stop offset="0.45" stopColor="#FFF" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.3" /></radialGradient>
      <radialGradient id="h5-hem" cx="0.4" cy="0.32" r="0.8"><stop offset="0" stopColor="#F0816F" /><stop offset="1" stopColor="#A82C28" /></radialGradient>
      <linearGradient id="h5-acero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EEF1F6" /><stop offset="0.45" stopColor="#A9B2C2" /><stop offset="0.7" stopColor="#D5DAE3" /><stop offset="1" stopColor="#6E7789" /></linearGradient>
      <linearGradient id="h5-vidrio" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF" stopOpacity="0.5" /><stop offset="0.3" stopColor="#FFF" stopOpacity="0.1" /><stop offset="1" stopColor="#8A93A6" stopOpacity="0.28" /></linearGradient>
      <radialGradient id="h5-lente" cx="0.42" cy="0.36" r="0.75"><stop offset="0" className={s.h5L1} /><stop offset="1" className={s.h5L2} /></radialGradient>
      <radialGradient id="h5-neu" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stopColor="#F4E2F7" /><stop offset="1" stopColor="#BE93CC" /></radialGradient>
      <linearGradient id="h5-pared" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#E98FA8" /><stop offset="1" stopColor="#B85A78" /></linearGradient>
      <radialGradient id="h5-eosina" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#F9DCE6" /><stop offset="1" stopColor="#EFB6C8" /></radialGradient>
      <linearGradient id="h5-fibrina" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F2478A" /><stop offset="0.5" stopColor="#E0266E" /><stop offset="1" stopColor="#F86AA0" /></linearGradient>
    </defs>
  );
});

/** Color del tejido (con un hueco para el vaso) y profundidad en la luz. */
const ColorVaso = memo(function ColorVaso() {
  return (
    <g>
      <path d={`M-800,-800 H2400 V1800 H-800 Z M${V.cx - V.adv},${V.cy} A${V.adv},${V.adv} 0 1 0 ${V.cx + V.adv},${V.cy} A${V.adv},${V.adv} 0 1 0 ${V.cx - V.adv},${V.cy} Z`} fill="url(#h5-tinte)" fillRule="evenodd" opacity={0.62} />
      <text x={V.cx} y={V.cy - V.adv - 24} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Arteriola (corte transversal)</text>
      <text x={V.cx + V.adv + 20} y={130} className={`${s.lSubChico} ${s.conHalo}`}>Media</text>
      <text x={V.cx + V.adv + 20} y={156} className={`${s.lSubChico} ${s.conHalo}`}>Íntima · endotelio</text>
      <circle cx={V.cx} cy={V.cy} r={V.luz} fill="url(#h5-luz)" />
    </g>
  );
});

/** Hematíes con volumen y plaquetas que pasan por la luz. */
function Sangre({ reloj }: { reloj: number }) {
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => {
        const a = hash(i, 2) * TAU + reloj / (9000 + i * 900) * (i % 2 ? 1 : -1), r = 60 + hash(i, 3) * 200;
        return (
          <g key={i} transform={`translate(${f1(V.cx + Math.cos(a) * r)},${f1(V.cy + Math.sin(a) * r)}) rotate(${(i * 53 + reloj / 90).toFixed(0)})`}>
            <ellipse rx={20} ry={14} fill="url(#h5-hem)" stroke="#7E1E1C" strokeWidth={0.7} />
            <ellipse rx={9} ry={6} fill="#C24B44" opacity={0.65} />
            <ellipse cx={-7} cy={-7} rx={6} ry={2} fill="#FFF" opacity={0.32} />
          </g>
        );
      })}
      {Array.from({ length: 7 }, (_, i) => {
        const a = hash(i, 8) * TAU - reloj / 11000, r = 80 + hash(i, 9) * 200;
        return <ellipse key={i} cx={V.cx + Math.cos(a) * r} cy={V.cy + Math.sin(a) * r} rx={6.5} ry={3.4} fill="#F2CF74" stroke="#A8821A" strokeWidth={0.7} transform={`rotate(${i * 40} ${V.cx + Math.cos(a) * r} ${V.cy + Math.sin(a) * r})`} />;
      })}
    </g>
  );
}

// ─── Piezas de la cascada ─────────────────────────────────────────────────────

function Prot({ x, y, r, c, txt, chico = false }: { x: number; y: number; r: number; c: string; txt: string; chico?: boolean }) {
  return (
    <g transform={`translate(${f1(x)},${f1(y)})`}>
      <circle r={r} fill={c} />
      <circle r={r} fill="url(#h5-bola)" />
      <text dy="0.36em" textAnchor="middle" className={chico ? s.protChico : s.protTxt}>{txt}</text>
    </g>
  );
}

function Rotulo({ x, y, t, sub, k }: { x: number; y: number; t: string; sub?: string; k: number }) {
  return (
    <g opacity={k} transform={`translate(${x + (1 - easeOut(k)) * 18},${y})`}>
      <text y={sub ? -6 : 7} className={`${s.pasoCascada} ${s.conHalo}`}>{t}</text>
      {sub && <text y={20} className={`${s.pasoCascadaSub} ${s.conHalo}`}>{sub}</text>}
    </g>
  );
}

function Cascada({ a, b, c, d, br, reloj }: { a: number; b: number; c: number; d: number; br: number; reloj: number }) {
  if (a <= 0.001) return null;
  const Y = [262, 392, 514, 640], X0 = -150;
  const late = 1 + 0.05 * br * Math.sin(reloj / 180);
  const corteB = easeOut(tramo(b, 0.35, 1)), parteC3 = easeOut(tramo(d, 0.35, 1));
  return (
    <g transform="translate(1330,0)">
      <text x={46} y={156} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Vía clásica del complemento</text>
      {/* 1 · C1q sobre las Fc */}
      <g opacity={tramo(a, 0, 0.3)}>
        <rect x={X0 - 70} y={Y[0] + 36} width={140} height={13} rx={6.5} fill="#B85A78" stroke="#7E2A4A" strokeWidth={1} />
        <IgG x={X0 - 22} y={Y[0] + 12} ang={180} k={0.9} />
        <IgG x={X0 + 22} y={Y[0] + 12} ang={180} k={0.9} />
        <g transform={`translate(${X0},${Y[0] - 44 + (1 - easeBack(a)) * -26}) rotate(180) scale(${late})`}><DibujoCelula dibujo="c1q" d={78} color="#C0397A" /></g>
      </g>
      <Rotulo x={-68} y={Y[0]} t="C1q reconoce la Fc" sub="de las IgG del depósito" k={a} />
      <FlechaSuave a={{ x: X0, y: Y[0] + 54 }} c={{ x: X0 - 44, y: (Y[0] + Y[1]) / 2 + 8 }} b={{ x: X0 - 8, y: Y[1] - 36 }} k={tramo(b, 0, 0.3)} color="#CE5C94" grosor={5.5} />
      {/* 2 · C4 y C2 se cortan */}
      {b > 0.001 && (
        <g opacity={tramo(b, 0, 0.3)}>
          <Prot x={X0 - 38 - corteB * 6} y={Y[1]} r={27} c="#A0478F" txt={corteB > 0.5 ? 'C4b' : 'C4'} />
          <Prot x={X0 - 10 + corteB * 10 - 28} y={Y[1] - 12 - corteB * 26} r={lerp(1, 12, corteB)} c="#D98AC4" txt={corteB > 0.5 ? 'a' : ''} chico />
          <Prot x={X0 + 38 + corteB * 6} y={Y[1]} r={24} c="#7E5AC2" txt={corteB > 0.5 ? 'C2a' : 'C2'} />
          <Prot x={X0 + 62} y={Y[1] - 10 - corteB * 26} r={lerp(1, 11, corteB)} c="#B7A0E6" txt={corteB > 0.5 ? 'b' : ''} chico />
        </g>
      )}
      <Rotulo x={-68} y={Y[1]} t="C4 y C2 se cortan" sub="C1 activo es la tijera" k={tramo(b, 0, 0.5)} />
      <FlechaSuave a={{ x: X0 - 8, y: Y[1] + 32 }} c={{ x: X0 + 30, y: (Y[1] + Y[2]) / 2 }} b={{ x: X0 + 2, y: Y[2] - 36 }} k={tramo(c, 0, 0.3)} color="#CE5C94" grosor={5.5} />
      {/* 3 · La convertasa */}
      {c > 0.001 && (
        <g opacity={tramo(c, 0, 0.3)} transform={`translate(${X0},${Y[2]}) scale(${(0.7 + 0.3 * easeBack(c)) * late})`}>
          <circle r={38} fill="url(#h5-bola)" opacity={0} />
          <Prot x={-20} y={0} r={30} c="#A0478F" txt="C4b" />
          <Prot x={24} y={0} r={27} c="#7E5AC2" txt="C2a" />
          <path d="M42,-8 L52,-3 L52,3 L42,8" fill="none" stroke="#FFF" strokeWidth={2} />
        </g>
      )}
      <Rotulo x={-68} y={Y[2]} t="Convertasa C4b2a" sub="la enzima que parte C3" k={tramo(c, 0, 0.5)} />
      <FlechaSuave a={{ x: X0 + 2, y: Y[2] + 34 }} c={{ x: X0 - 34, y: (Y[2] + Y[3]) / 2 + 2 }} b={{ x: X0 - 24, y: Y[3] - 36 }} k={tramo(d, 0, 0.3)} color="#CE5C94" grosor={5.5} />
      {/* 4 · C3 se parte en cascada */}
      {d > 0.001 && (
        <g opacity={tramo(d, 0, 0.3)}>
          <Prot x={X0 - 30 - parteC3 * 22} y={Y[3]} r={30} c="#6A3EAE" txt={parteC3 > 0.5 ? 'C3b' : 'C3'} />
          {parteC3 > 0.05 && <Prot x={X0 + 18 + parteC3 * 30} y={Y[3] - parteC3 * 22} r={13} c="#E58AA0" txt="a" chico />}
          {Array.from({ length: 5 }, (_, j) => { const q = tramo(parteC3, j * 0.1, 0.5 + j * 0.1); return q > 0 ? <path key={j} d="M0,-6 L6,5 L-6,5 Z" fill="#8A4FCF" transform={`translate(${X0 - 92 - j * 18},${Y[3] - 22 + j * 11}) rotate(${j * 40})`} opacity={q} /> : null; })}
        </g>
      )}
      <Rotulo x={-68} y={Y[3]} t="C3 se parte" sub="C3b se pega · C3a se va" k={tramo(d, 0, 0.5)} />
    </g>
  );
}

// ─── Termómetros del complemento ──────────────────────────────────────────────

/** Rojo si está bajo, verde si está bien; el color lo da el nivel, no un salto. */
function colorNivel(n: number) {
  const q = clamp((n - 0.28) / 0.5);
  const c0 = [210, 56, 72], c1 = [31, 154, 106];
  return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * q)).join(',')})`;
}

function TermometroVidrio({ x, nivel, n, id }: { x: number; nivel: number; n: string; id: number }) {
  const y0 = 308, y1 = 610, alto = (y1 - y0) * clamp(nivel), col = colorNivel(nivel);
  return (
    <g>
      <rect x={x - 20} y={y0 - 10} width={40} height={y1 - y0 + 30} rx={20} className={s.termoVidrio} />
      <circle cx={x} cy={y1 + 28} r={36} className={s.termoVidrio} />
      <rect x={x - 11} y={y1 - alto} width={22} height={alto + 26} rx={6} fill={col} />
      <circle cx={x} cy={y1 + 28} r={28} fill={col} />
      <circle cx={x} cy={y1 + 28} r={28} fill="url(#h5-bola)" />
      {/* Graduación y franja de lo normal */}
      <rect x={x - 20} y={y0 - 2} width={40} height={(y1 - y0) * 0.22} fill="#1F9A6A" opacity={0.13} />
      {Array.from({ length: 11 }, (_, j) => <line key={j} x1={x + 20} y1={y0 + j * ((y1 - y0) / 10)} x2={x + (j % 5 ? 28 : 36)} y2={y0 + j * ((y1 - y0) / 10)} className={s.termoMarca} />)}
      <rect x={x - 15} y={y0} width={6} height={y1 - y0} rx={3} fill="#FFF" opacity={0.55} />
      <text x={x} y={y1 + 92} textAnchor="middle" className={`${s.termoNombre} ${s.conHalo}`} data-i={id}>{n}</text>
    </g>
  );
}

function Termometro({ t }: { t: T }) {
  const co = v(t, 'consumo'), re = v(t, 'recupera'), te = v(t, 'termometro');
  if (co <= 0.001) return null;
  const e = easeOut(co), r = easeOut(re);
  const niveles: [string, number][] = [['C3', 1 - 0.62 * e + 0.58 * r], ['C4', 1 - 0.78 * e + 0.72 * r], ['CH50', 1 - 0.68 * e + 0.62 * r]];
  const medio = niveles[0][1];
  return (
    <g opacity={tramo(co, 0, 0.2)}>
      <text x={1320} y={246} textAnchor="middle" className={`${s.lEtiquetaMayus} ${s.conHalo}`}>Complemento en sangre</text>
      {niveles.map(([n, q], j) => <TermometroVidrio key={n} x={1170 + j * 150} nivel={q} n={n} id={j} />)}
      <text x={1514} y={336} className={`${s.lSubChico} ${s.conHalo}`}>normal</text>
      <Globo x={1320} y={764} w={320} h={52} chico txt={medio < 0.6 ? 'Bajo: se consume' : 'Vuelve a subir'} tono={medio < 0.6 ? 'alerta' : 'calma'} />
      <Globo x={1320} y={846} w={470} h={56} chico txt={te > 0.5 ? 'Uno de los mejores termómetros' : 'Complemento bajo = lupus activo'} k={Math.min(1, te * 2)} />
    </g>
  );
}

// ─── Lupas ────────────────────────────────────────────────────────────────────

function Lente({ cx, cy, r, id, k, children }: { cx: number; cy: number; r: number; id: string; k: number; children: ReactNode }) {
  return (
    <g opacity={tramo(k, 0, 0.3)} transform={`translate(${cx},${cy}) scale(${0.8 + 0.2 * easeBack(k)})`}>
      <clipPath id={id}><circle r={r} /></clipPath>
      <circle cx={6} cy={9} r={r + 14} className={s.globoSombra} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle r={r + 6} fill="none" stroke="url(#h5-acero)" strokeWidth={13} />
      <path d={`M${-r * 0.8},${-r * 0.32} A${r * 0.86},${r * 0.86} 0 0 1 ${-r * 0.22},${-r * 0.83}`} fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.5} />
    </g>
  );
}

/** El neutrófilo aplastado contra el depósito: no puede cerrar el fagosoma. */
function Frustrada({ k, vu, reloj }: { k: number; vu: number; reloj: number }) {
  if (k <= 0.001) return null;
  const R = 172, suelo = 70, brazo = 34 + 8 * Math.sin(reloj / 340);
  return (
    <g>
      <Lente cx={1330} cy={520} r={R} id="h5-c1" k={k}>
        <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#h5-lente)" />
        {/* Pared del vaso, que se deshace cuando caen las enzimas */}
        <rect x={-R} y={suelo} width={R * 2} height={R} fill="url(#h5-pared)" />
        {Array.from({ length: 7 }, (_, j) => <ellipse key={j} cx={-R + 30 + j * 52} cy={suelo + 28 + (j % 2) * 26} rx={22} ry={5} fill="#8E3F5E" opacity={0.5} />)}
        {vu > 0.01 && Array.from({ length: 9 }, (_, j) => { const q = tramo(vu, 0.3 + j * 0.04, 0.7 + j * 0.04); return q > 0 ? <ellipse key={j} cx={-110 + j * 28} cy={suelo + 6 + (j % 3) * 7} rx={15 * q} ry={8 * q} fill="#F2478A" opacity={0.85} /> : null; })}
        <path d={`M${-R},${suelo} H${R}`} stroke="#7E2A4A" strokeWidth={3} />
        {/* Complejos pegados a la pared */}
        {[-108, -54, 0, 54, 108].map((x) => <IgG key={x} x={x} y={suelo - 22} ang={180} k={0.82} />)}
        {[-132, -80, -26, 26, 80, 132].map((x) => <circle key={x} cx={x} cy={suelo - 3} r={7} fill={L.adn} stroke="#173A7A" strokeWidth={0.8} />)}
        {/* Neutrófilo extendido, con los seudópodos que intentan cerrarse y no pueden */}
        <path d={`M${-150},${suelo - 44} C${-150},${suelo - 92} ${-112},${-124} 0,${-126} C${112},${-124} ${150},${suelo - 92} ${150},${suelo - 44} C${130},${suelo - brazo - 18} ${100},${suelo - 66} 0,${suelo - 68} C${-100},${suelo - 66} ${-130},${suelo - brazo - 18} ${-150},${suelo - 44} Z`} fill="url(#h5-neu)" stroke="#8E5AA6" strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M-58,-58 C-72,-82 -30,-92 -20,-72 C-8,-96 34,-86 28,-62 C50,-66 58,-38 34,-34 C14,-26 -14,-30 -24,-40 C-44,-34 -60,-44 -58,-58 Z" fill="#6E3F96" />
        {Array.from({ length: 22 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 22); return <circle key={j} cx={Math.cos(a) * 112 * q} cy={-48 + Math.sin(a) * 58 * q} r={3} fill={j % 2 ? '#C77CA8' : '#E0892E'} opacity={0.9} />; })}
        {/* Lo que vuelca sobre la pared */}
        {vu > 0.01 && Array.from({ length: 26 }, (_, j) => {
          const f = (reloj / 1100 + hash(j, 3)) % 1, x = -120 + hash(j, 4) * 240, y = suelo - 56 + f * 66;
          return j % 2
            ? <circle key={j} cx={x} cy={y} r={3.6} fill="#8C624E" opacity={vu * (1 - f * 0.6)} />
            : <path key={j} d="M0,-6 L1.6,-1.6 L6,0 L1.6,1.6 L0,6 L-1.6,1.6 L-6,0 L-1.6,-1.6 Z" fill="#E8B21E" transform={`translate(${f1(x)},${f1(y)})`} opacity={vu * (1 - f * 0.6)} />;
        })}
      </Lente>
      <text x={1330} y={738} textAnchor="middle" className={`${s.pasoCascada} ${s.conHalo}`} opacity={k}>{vu > 0.5 ? 'Enzimas y ROS, sobre la pared' : 'No puede cerrar el fagosoma'}</text>
    </g>
  );
}

/** La necrosis fibrinoide al microscopio: la pared, rosa intenso y vidriosa. */
const CorteHne = memo(function CorteHne() {
  const R = 180;
  return (
    <g>
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#h5-eosina)" />
      {Array.from({ length: 9 }, (_, j) => <path key={j} d={`M${-R},${-140 + j * 36} C-80,${-160 + j * 36} 60,${-120 + j * 36} ${R},${-142 + j * 36}`} fill="none" stroke="#E9A6BC" strokeWidth={3} opacity={0.7} />)}
      {/* Pared necrosada */}
      <ellipse rx={118} ry={106} fill="url(#h5-fibrina)" />
      <path d="M-104,-20 C-92,-66 -44,-92 6,-92" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.42} />
      <path d="M92,44 C74,74 38,92 2,92" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.3} />
      {/* Luz con hematíes */}
      <ellipse cx={4} cy={2} rx={52} ry={42} fill="#FBEFF0" stroke="#B22060" strokeWidth={1.5} />
      {[[-18, -8], [14, -14], [22, 14], [-12, 16], [2, 2]].map(([x, y], j) => <ellipse key={j} cx={x} cy={y} rx={10} ry={7} fill="#D94A44" transform={`rotate(${j * 40} ${x} ${y})`} />)}
      {/* Polvo nuclear (cariorrexis) y neutrófilos */}
      <path d={Array.from({ length: 70 }, (_, j) => { const a = hash(j, 2) * TAU, r = 70 + hash(j, 3) * 90; return `M${f1(Math.cos(a) * r * 1.08)},${f1(Math.sin(a) * r)}h0`; }).join('')} fill="none" stroke="#2E2A78" strokeWidth={4.6} strokeLinecap="round" opacity={0.8} />
      {[[-136, -44], [-128, 62], [134, -72], [132, 74], [-54, 140], [70, -146]].map(([x, y], j) => (
        <g key={j} transform={`translate(${x},${y}) rotate(${j * 30})`}>
          <circle r={16} fill="#F4C8D8" />
          <path d="M-8,-3 C-10,-9 -2,-10 -1,-5 C2,-10 9,-7 7,-1 C10,3 3,8 0,4 C-4,7 -10,2 -8,-3 Z" fill="#2E2A78" />
        </g>
      ))}
    </g>
  );
});

// ─── Medallas ─────────────────────────────────────────────────────────────────

function Medallas({ t }: { t: T }) {
  return (
    <g>
      <Medalla x={1118} y={320} k={v(t, 'md1')} c={L.adn}><ComplejoNuc r={38} tipo="adn" /></Medalla>
      <Medalla x={1118} y={480} k={v(t, 'md2')} c={L.rnp}>
        {Array.from({ length: 7 }, (_, j) => { const a = (j / 7) * TAU; return <circle key={j} cx={Math.cos(a) * 15} cy={Math.sin(a) * 15} r={6.5} fill="#2CA9BC" stroke="#FFF" strokeWidth={0.8} />; })}
        <IgG x={-22} y={-24} ang={140} k={0.62} /><IgG x={24} y={-22} ang={218} k={0.62} /><IgG x={0} y={34} ang={0} k={0.62} />
      </Medalla>
      <Medalla x={1532} y={220} k={v(t, 'sm1')} c={L.complejo}><ComplejoNuc r={36} tipo="adn" /></Medalla>
      <Medalla x={1532} y={390} k={v(t, 'sm2')} c="#C0397A">
        <Prot x={-12} y={-10} r={17} c="#6A3EAE" txt="C3" chico />
        <path d="M6,12 L24,28 M24,14 L6,30" stroke="#E5484D" strokeWidth={4.4} strokeLinecap="round" />
        <path d="M-30,24 H-8 M-14,18 L-8,24 L-14,30" stroke="#E5484D" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Medalla>
      <Medalla x={1532} y={560} k={v(t, 'sm3')} c="#B67AC7">
        <circle r={32} fill="url(#h5-neu)" stroke="#8E5AA6" strokeWidth={1.4} />
        <path d="M-16,-4 C-22,-16 -6,-18 -4,-7 C2,-17 16,-13 12,-2 C22,3 15,18 5,12 C2,21 -13,18 -10,8 C-20,9 -22,-1 -16,-4 Z" fill="#6E3F96" />
        {[[-26, -24], [28, -22], [32, 20], [-28, 26]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={4} fill="#E8B21E" />)}
      </Medalla>
      <Medalla x={1532} y={730} k={v(t, 'sm4')} c="#D24E80">
        <path d="M-38,-14 C-14,-24 14,-4 38,-14 V18 C14,28 -14,8 -38,18 Z" fill="url(#h5-fibrina)" />
        <path d="M-20,2 l10,-7 l6,9 l10,-8 l8,8" fill="none" stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Medalla>
    </g>
  );
}

function Tubo({ k }: { k: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k} transform="translate(1250,470)">
      <path d="M-40,-150 L-40,120 A40,40 0 0 0 40,120 L40,-150" className={s.tuboVidrio} />
      <path d={`M-36,${10} L-36,120 A36,36 0 0 0 36,120 L36,10 Z`} fill="#E8B21E" opacity={0.5} />
      <rect x={-50} y={-162} width={100} height={18} rx={6} className={s.tuboTapa} />
      <g transform="translate(160,-40)">
        <circle r={62} className={s.reloj} />
        <path d={`M0,0 L0,-46 M0,0 L${(Math.sin(easeOut(k) * Math.PI * 1.6) * 40).toFixed(1)},${(-Math.cos(easeOut(k) * Math.PI * 1.6) * 40).toFixed(1)}`} stroke={L.lupus} strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={80} y={190} textAnchor="middle" className={s.lEtiqueta}>En el tubo: alarga el TTPa</text>
      <text x={80} y={220} textAnchor="middle" className={s.lSub}>parece un anticoagulante</text>
    </g>
  );
}

export function FondoVasoLupus({ t, reloj }: { t: T; reloj: number }) {
  const qu = v(t, 'quimio'), hne = v(t, 'hne');
  return (
    <g>
      <DefsVaso />
      <FondoHipersensibilidad f="vaso" t={t} reloj={reloj} />
      {/* El fondo de Hipersensibilidad rotula «Tejido · ganglio»: aquí es solo tejido. */}
      <rect x={1100} y={124} width={400} height={52} className={h.intersticio} />
      <ColorVaso />
      <Sangre reloj={reloj} />
      {/* C3a y C5a: el rastro químico que siguen los neutrófilos */}
      {qu > 0.001 && [0, 1, 2, 3].map((j) => {
        const f = (reloj / 2200 + j / 4) % 1;
        return <path key={j} d={`M${300 + f * 460},${250 - f * 60} A${280 + f * 440},${280 + f * 440} 0 0 1 ${300 + f * 460},${790 + f * 60}`} className={s.quimioOnda} opacity={qu * (1 - f) * 0.8} />;
      })}
      <Termometro t={t} />
      <Cascada a={v(t, 'cas1')} b={v(t, 'cas2')} c={v(t, 'cas3')} d={v(t, 'cas4')} br={v(t, 'casBrillo')} reloj={reloj} />
      <Frustrada k={v(t, 'frus')} vu={v(t, 'vuelca')} reloj={reloj} />
      {hne > 0.001 && (
        <g>
          <Lente cx={1330} cy={560} r={180} id="h5-c2" k={hne}><CorteHne /></Lente>
          <text x={1330} y={782} textAnchor="middle" className={`${s.pasoCascadaSub} ${s.conHalo}`} opacity={hne}>Al microscopio: pared rosa intenso, polvo nuclear</text>
        </g>
      )}
      <Medallas t={t} />
      <Tubo k={v(t, 'tubo')} />
    </g>
  );
}

export function FondoSangreLupus({ t, reloj }: { t: T; reloj: number }) {
  return <FondoHipersensibilidad f="sangre" t={t} reloj={reloj} />;
}

export function FondoGlomeruloLupus({ t, reloj }: { t: T; reloj: number }) {
  return <FondoHipersensibilidad f="glomerulo" t={t} reloj={reloj} />;
}
