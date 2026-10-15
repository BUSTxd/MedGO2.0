'use client';
// Células dibujadas con código para el laboratorio «Maduración de linfocitos»,
// en el estilo de las ilustraciones de Servier que las acompañan: membrana con
// reborde oscuro y un brillo, citoplasma con degradado, organelos y núcleo con
// cromatina y nucléolo. Cada una dibuja lo que la reconoce en un corte:
//   · plasmocito: núcleo excéntrico en rueda de carreta, halo del Golgi,
//     retículo rugoso concéntrico, vesículas de secreción;
//   · centroblasto: núcleo vesicular grande con nucléolos contra la membrana;
//   · centrocito: núcleo hendido de cromatina densa;
//   · Tfh: linfocito con microvellosidades, CD40L y vesículas de IL-21;
//   · FDC: dendritas largas y ramificadas cargadas de inmunocomplejos, binucleada;
//   · cTEC: prolongaciones anchas con queratina y desmosomas, núcleo con
//     nucléolo y timocitos acunados entre sus brazos;
//   · mTEC: queratina, cuerpos de AIRE en el núcleo, antígenos de tejidos en MHC;
//   · dendrítica: velos, núcleo arriñonado, MHC II en las puntas, endosomas;
//   · macrófago de cuerpo tingible: cuerpos apoptóticos fagocitados, vacuolas;
//   · estroma (CAR) y osteoblastos sobre su osteoide.
// Los degradados se definen una vez (`DefsCelulas`) en el <svg> de la escena.

import type { ReactNode } from 'react';
import type { Dibujo } from '@/lib/data/linfocitos/tipos';
import HuesoLargo from './HuesoLargo';
import s from '@/styles/linfocitos.module.css';

// ─── Degradados compartidos ───────────────────────────────────────────────────

const RAD: [string, string, string][] = [
  ['lf-plasmaCito', '#E4DCFA', '#A08BDB'],
  ['lf-plasmaNuc', '#8466C7', '#47308A'],
  ['lf-gcCito', '#FFF4E2', '#EFC383'],
  ['lf-gcNuc', '#FBEBD3', '#DDAE6C'],
  ['lf-ccCito', '#FFF8EE', '#F1D3A6'],
  ['lf-ccNuc', '#C08949', '#7B4B1D'],
  ['lf-tfhCito', '#E8F8EF', '#A4D9BA'],
  ['lf-tfhNuc', '#6E9C86', '#2F5C49'],
  ['lf-epiC', '#F5F0FC', '#C9B7E8'],
  ['lf-epiCNuc', '#EEE7FA', '#B3A0DA'],
  ['lf-epiM', '#FDF1F7', '#E8B3CE'],
  ['lf-epiMNuc', '#F7E3EE', '#CC86AC'],
  ['lf-dc', '#FFF6E8', '#F0C589'],
  ['lf-dcNuc', '#EBC48F', '#AE7631'],
  ['lf-fdc', '#FDF6E2', '#E3CB86'],
  ['lf-fdcNuc', '#F3E5BF', '#C4A35A'],
  ['lf-macro', '#FAF1EA', '#DCBBA7'],
  ['lf-macroNuc', '#C9A08C', '#8C624E'],
  ['lf-estroma', '#F7F8FB', '#D0D7E1'],
  ['lf-estromaNuc', '#C2CAD6', '#7C8797'],
  ['lf-osteo', '#E8E1F6', '#A898D6'],
  ['lf-osteoNuc', '#7D6AB8', '#4B3B86'],
  ['lf-timocito', '#F1EEF9', '#C9C0E3'],
  ['lf-lipido', '#FFFFFF', '#F3E2B4'],
];

export function DefsCelulas() {
  return (
    <>
      {RAD.map(([id, c0, c1]) => (
        <radialGradient key={id} id={id} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
      ))}
      <radialGradient id="lf-brillo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff" stopOpacity={0.85} />
        <stop offset="100%" stopColor="#fff" stopOpacity={0} />
      </radialGradient>
    </>
  );
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

/** Puntos repartidos dentro de una elipse (ángulo áureo: sin azar, sin parpadeo). */
function puntos(n: number, rx: number, ry: number, desfase = 0): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const a = i * 2.39996 + desfase;
    return [Math.cos(a) * rx * Math.sqrt(t) * 0.92, Math.sin(a) * ry * Math.sqrt(t) * 0.92];
  });
}

/** Prolongación que se afina: polígono a lo largo de una curva cuadrática. */
function rama(ang: number, largo: number, w0: number, curva = 0.25, x0 = 0, y0 = 0): string {
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const nx = -uy, ny = ux;
  const fin = { x: x0 + ux * largo, y: y0 + uy * largo };
  const ctrl = { x: x0 + ux * largo * 0.5 + nx * largo * curva, y: y0 + uy * largo * 0.5 + ny * largo * curva };
  const N = 10;
  const izq: string[] = [], der: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const px = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * ctrl.x + t * t * fin.x;
    const py = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * ctrl.y + t * t * fin.y;
    const dx = 2 * (1 - t) * (ctrl.x - x0) + 2 * t * (fin.x - ctrl.x);
    const dy = 2 * (1 - t) * (ctrl.y - y0) + 2 * t * (fin.y - ctrl.y);
    const dl = Math.hypot(dx, dy) || 1;
    const w = w0 * (1 - t * 0.85);
    izq.push(`${(px - (dy / dl) * w).toFixed(1)},${(py + (dx / dl) * w).toFixed(1)}`);
    der.unshift(`${(px + (dy / dl) * w).toFixed(1)},${(py - (dx / dl) * w).toFixed(1)}`);
  }
  return `M${izq.join(' L')} L${der.join(' L')} Z`;
}

/** Punto a lo largo de esa misma curva (para colgar cosas de una rama). */
function enRama(ang: number, largo: number, curva: number, t: number, x0 = 0, y0 = 0) {
  const ux = Math.cos(ang), uy = Math.sin(ang);
  const fin = { x: x0 + ux * largo, y: y0 + uy * largo };
  const ctrl = { x: x0 + ux * largo * 0.5 - uy * largo * curva, y: y0 + uy * largo * 0.5 + ux * largo * curva };
  return { x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * ctrl.x + t * t * fin.x, y: (1 - t) ** 2 * y0 + 2 * (1 - t) * t * ctrl.y + t * t * fin.y };
}

function Brillo({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="url(#lf-brillo)" />;
}

/** Arco de luz en el borde superior izquierdo de la membrana. */
function Reflejo({ r, rx, ry }: { r?: number; rx?: number; ry?: number }) {
  const a = rx ?? r ?? 0, b = ry ?? r ?? 0;
  return <path d={`M${(-a * 0.78).toFixed(1)},${(-b * 0.18).toFixed(1)} A${a * 0.86},${b * 0.86} 0 0 1 ${(-a * 0.2).toFixed(1)},${(-b * 0.82).toFixed(1)}`} fill="none" stroke="#fff" strokeWidth={Math.max(2.5, a * 0.06)} strokeLinecap="round" opacity={0.6} />;
}

function Cromatina({ n, rx, ry, color, r: rr, op = 0.75, desfase = 0 }: { n: number; rx: number; ry: number; color: string; r: number; op?: number; desfase?: number }) {
  return <g opacity={op}>{puntos(n, rx, ry, desfase).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={rr * (0.7 + (i % 3) * 0.25)} fill={color} />)}</g>;
}

// ─── Células ──────────────────────────────────────────────────────────────────

function Plasmocito({ r }: { r: number }) {
  const ry = r * 0.8;
  const nx = -r * 0.44, nr = r * 0.34;
  return (
    <g>
      <ellipse rx={r} ry={ry} fill="url(#lf-plasmaCito)" stroke="#5B4699" strokeWidth={2.6} />
      {/* Retículo endoplásmico rugoso: cisternas concéntricas con ribosomas */}
      {[0.62, 0.76, 0.9, 1.04, 1.18].map((k, i) => {
        const R = nr + r * (k - 0.34);
        const a0 = -0.95, a1 = 0.95;
        const p0 = { x: nx + Math.cos(a0) * R, y: Math.sin(a0) * R * 0.92 }, p1 = { x: nx + Math.cos(a1) * R, y: Math.sin(a1) * R * 0.92 };
        return (
          <g key={k}>
            <path d={`M${p0.x.toFixed(1)},${p0.y.toFixed(1)} A${R.toFixed(1)},${(R * 0.92).toFixed(1)} 0 0 1 ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`} fill="none" stroke="#8670C6" strokeWidth={2.2} opacity={0.75} />
            {Array.from({ length: 7 }, (_, j) => { const a = a0 + ((j + 0.5) / 7) * (a1 - a0) + (i % 2) * 0.06; return <circle key={j} cx={nx + Math.cos(a) * (R + 3)} cy={Math.sin(a) * (R + 3) * 0.92} r={1.3} fill="#5B4699" opacity={0.7} />; })}
          </g>
        );
      })}
      {/* Vesículas de secreción junto a la membrana */}
      {[[0.78, -0.25], [0.82, 0.18], [0.62, 0.5], [0.66, -0.55], [0.88, -0.02]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * ry} r={r * 0.05} fill="#F1ECFD" stroke="#9580D3" strokeWidth={1.2} />)}
      {/* Halo perinuclear: el aparato de Golgi */}
      <ellipse cx={-r * 0.02} cy={-r * 0.02} rx={r * 0.2} ry={r * 0.32} fill="#F4F0FD" />
      {[-0.12, 0, 0.12].map((dy, i) => <path key={i} d={`M${(-r * 0.07).toFixed(1)},${((dy - 0.12) * r).toFixed(1)} q${(r * 0.12).toFixed(1)},${(r * 0.12).toFixed(1)} 0,${(r * 0.24).toFixed(1)}`} fill="none" stroke="#B4A3E2" strokeWidth={2} strokeLinecap="round" />)}
      {/* Núcleo excéntrico en rueda de carreta */}
      <circle cx={nx} cy={0} r={nr} fill="url(#lf-plasmaNuc)" stroke="#33206B" strokeWidth={1.6} />
      {Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * Math.PI * 2; return <rect key={i} x={nx + Math.cos(a) * nr * 0.68 - nr * 0.12} y={Math.sin(a) * nr * 0.68 - nr * 0.09} width={nr * 0.24} height={nr * 0.18} rx={nr * 0.08} fill="#28155A" transform={`rotate(${(a * 180) / Math.PI} ${nx + Math.cos(a) * nr * 0.68} ${Math.sin(a) * nr * 0.68})`} />; })}
      <circle cx={nx} cy={0} r={nr * 0.16} fill="#28155A" />
      <Reflejo rx={r} ry={ry} />
      <Brillo x={-r * 0.55} y={-ry * 0.55} rx={r * 0.12} ry={r * 0.08} />
    </g>
  );
}

function Centroblasto({ r }: { r: number }) {
  const nr = r * 0.78;
  return (
    <g>
      <circle r={r} fill="url(#lf-gcCito)" stroke="#B07730" strokeWidth={2.6} />
      {puntos(18, r * 0.95, r * 0.95, 0.4).filter(([x, y]) => Math.hypot(x, y) > nr * 1.02).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.4} fill="#B07730" opacity={0.55} />)}
      <circle r={nr} fill="url(#lf-gcNuc)" stroke="#A46C26" strokeWidth={1.8} />
      <Cromatina n={46} rx={nr} ry={nr} color="#C08A45" r={1.6} op={0.55} />
      {/* Nucléolos pegados a la membrana nuclear */}
      {[[-0.62, -0.32], [0.6, 0.3], [0.08, -0.7]].map(([x, y], i) => (
        <g key={i}><circle cx={x * nr} cy={y * nr} r={nr * 0.13} fill="#8A4F15" /><circle cx={x * nr - nr * 0.03} cy={y * nr - nr * 0.03} r={nr * 0.05} fill="#C88D4E" /></g>
      ))}
      <Reflejo r={r} />
      <Brillo x={-r * 0.5} y={-r * 0.55} rx={r * 0.13} ry={r * 0.09} />
    </g>
  );
}

function Centrocito({ r }: { r: number }) {
  const n = r * 0.66;
  const hendido = `M${-n},${-n * 0.05} C${-n},${-n * 0.95} ${n * 0.75},${-n * 1.02} ${n * 0.98},${-n * 0.12} L${n * 0.18},${n * 0.04} L${n * 0.92},${n * 0.22} C${n * 0.7},${n} ${-n * 0.85},${n} ${-n},${-n * 0.05} Z`;
  return (
    <g>
      <circle r={r} fill="url(#lf-ccCito)" stroke="#B07730" strokeWidth={2.6} />
      <path d={hendido} fill="url(#lf-ccNuc)" stroke="#5E3812" strokeWidth={1.6} strokeLinejoin="round" />
      <Cromatina n={30} rx={n * 0.85} ry={n * 0.75} color="#4A2A0C" r={2} op={0.6} desfase={1.1} />
      <path d={`M${n * 0.95},${-n * 0.1} L${n * 0.2},${n * 0.04} L${n * 0.9},${n * 0.2}`} fill="none" stroke="#FFF1DE" strokeWidth={2.2} strokeLinejoin="round" />
      <Reflejo r={r} />
      <Brillo x={-r * 0.5} y={-r * 0.55} rx={r * 0.13} ry={r * 0.09} />
    </g>
  );
}

function Tfh({ r }: { r: number }) {
  const nr = r * 0.66;
  return (
    <g>
      {/* Microvellosidades */}
      {Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * r * 1.02} cy={Math.sin(a) * r * 1.02} rx={4} ry={2.6} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * r * 1.02} ${Math.sin(a) * r * 1.02})`} fill="#A4D9BA" stroke="#2F7A57" strokeWidth={1} />; })}
      <circle r={r} fill="url(#lf-tfhCito)" stroke="#2F7A57" strokeWidth={2.6} />
      <path d={`M${-nr},0 C${-nr},${-nr * 1.05} ${nr},${-nr * 1.05} ${nr},${-nr * 0.1} C${nr * 0.8},${-nr * 0.02} ${nr * 0.8},${nr * 0.22} ${nr},${nr * 0.3} C${nr * 0.85},${nr * 1.05} ${-nr},${nr * 1.05} ${-nr},0 Z`} fill="url(#lf-tfhNuc)" stroke="#1F4536" strokeWidth={1.6} />
      <Cromatina n={26} rx={nr * 0.85} ry={nr * 0.85} color="#173628" r={2.4} op={0.55} />
      {/* CD40L (trímeros) en la membrana y vesículas de IL-21 */}
      {[-0.6, 0.35, 1.9].map((a, i) => (
        <g key={i} transform={`translate(${Math.cos(a) * r * 1.12},${Math.sin(a) * r * 1.12})`}>
          {[[-3.5, 2], [3.5, 2], [0, -3.5]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={3.4} fill="#1F9A6A" />)}
        </g>
      ))}
      {[[0.72, 0.38], [0.62, 0.58], [-0.7, 0.52]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={r * 0.07} fill="#F6CB9C" stroke="#D9881E" strokeWidth={1.2} />)}
      <Reflejo r={r} />
      <Brillo x={-r * 0.5} y={-r * 0.55} rx={r * 0.13} ry={r * 0.09} />
    </g>
  );
}

function Fdc({ r }: { r: number }) {
  const ramas = [0.2, 1.25, 2.2, 3.1, 4.0, 5.1];
  return (
    <g>
      {ramas.map((a, i) => {
        const largo = r * (0.95 + (i % 2) * 0.12);
        const c = i % 2 ? 0.18 : -0.16;
        const sec = [0.55, 0.78].map((t, j) => ({ p: enRama(a, largo, c, t), a: a + (j ? -0.7 : 0.75) }));
        return (
          <g key={i}>
            <path d={rama(a, largo, r * 0.1, c)} fill="url(#lf-fdc)" stroke="#9C7B2E" strokeWidth={1.6} strokeLinejoin="round" />
            {sec.map((q, j) => <path key={j} d={rama(q.a, r * 0.32, r * 0.045, 0.2, q.p.x, q.p.y)} fill="url(#lf-fdc)" stroke="#9C7B2E" strokeWidth={1.3} />)}
            {/* Inmunocomplejos (icosomas) colgando de la dendrita */}
            {[0.38, 0.62, 0.86].map((t, j) => { const q = enRama(a, largo, c, t); return <g key={j}><circle cx={q.x} cy={q.y} r={4.6} fill="#F1C27A" stroke="#B9782A" strokeWidth={1.2} /><path d={`M${q.x},${q.y - 4} l0,-5 m0,0 l-3,-4 m3,4 l3,-4`} stroke="#8A4FCF" strokeWidth={1.4} fill="none" strokeLinecap="round" /></g>; })}
          </g>
        );
      })}
      <ellipse rx={r * 0.38} ry={r * 0.3} fill="url(#lf-fdc)" stroke="#9C7B2E" strokeWidth={2.2} />
      {/* Binucleada, de cromatina pálida */}
      {[-1, 1].map((k) => (
        <g key={k}><ellipse cx={k * r * 0.13} cy={0} rx={r * 0.13} ry={r * 0.17} fill="url(#lf-fdcNuc)" stroke="#8A6A24" strokeWidth={1.2} /><circle cx={k * r * 0.13} cy={-r * 0.03} r={r * 0.03} fill="#8A6A24" /></g>
      ))}
      <Brillo x={-r * 0.18} y={-r * 0.16} rx={r * 0.08} ry={r * 0.05} />
    </g>
  );
}

function Car({ r }: { r: number }) {
  const ramas = [0.1, 0.85, 1.7, 2.45, 3.2, 3.95, 4.75, 5.5];
  return (
    <g>
      {ramas.map((a, i) => {
        const largo = r * (0.95 + (i % 3) * 0.07);
        const c = i % 2 ? 0.22 : -0.2;
        const q = enRama(a, largo, c, 0.6);
        return (
          <g key={i}>
            <path d={rama(a, largo, r * 0.06, c)} fill="url(#lf-estroma)" stroke="#7C8797" strokeWidth={1.3} />
            <path d={rama(a + (i % 2 ? 0.8 : -0.8), r * 0.3, r * 0.03, 0.2, q.x, q.y)} fill="url(#lf-estroma)" stroke="#7C8797" strokeWidth={1.1} />
            {/* CXCL12 que se secreta a lo largo de la prolongación */}
            {[0.42, 0.8].map((t, j) => { const p = enRama(a, largo, c, t); return <circle key={j} cx={p.x + 8} cy={p.y - 6} r={3} fill="#2CA9BC" opacity={0.8} />; })}
          </g>
        );
      })}
      <ellipse rx={r * 0.3} ry={r * 0.22} fill="url(#lf-estroma)" stroke="#7C8797" strokeWidth={2} />
      <ellipse rx={r * 0.2} ry={r * 0.11} fill="url(#lf-estromaNuc)" />
      <Cromatina n={10} rx={r * 0.17} ry={r * 0.09} color="#5B6475" r={1.4} op={0.6} />
    </g>
  );
}

function Ctec({ r }: { r: number }) {
  const brazos = [-0.4, 0.85, 2.1, 3.25, 4.45];
  const timocitos: [number, number][] = [[0.6, 0.25], [-0.15, 0.7], [-0.68, -0.15], [0.12, -0.66]];
  return (
    <g>
      {brazos.map((a, i) => {
        const largo = r * 1.0, c = i % 2 ? 0.14 : -0.12;
        return (
          <g key={i}>
            <path d={rama(a, largo, r * 0.17, c)} fill="url(#lf-epiC)" stroke="#7A5EB2" strokeWidth={1.8} strokeLinejoin="round" />
            {/* Filamentos de queratina dentro del brazo */}
            {[-0.04, 0.04].map((d, j) => { const p0 = enRama(a + d, largo * 0.95, c, 0.15), p1 = enRama(a + d, largo * 0.95, c, 0.8); return <line key={j} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#A891D6" strokeWidth={1.2} opacity={0.8} />; })}
            {/* Desmosoma en la punta */}
            {(() => { const p = enRama(a, largo, c, 1); return <rect x={p.x - 4} y={p.y - 1.8} width={8} height={3.6} rx={1.5} fill="#5B4699" transform={`rotate(${(a * 180) / Math.PI + 90} ${p.x} ${p.y})`} />; })()}
          </g>
        );
      })}
      {/* Timocitos acunados entre los brazos */}
      {timocitos.map(([x, y], i) => (
        <g key={i} transform={`translate(${x * r},${y * r})`}>
          <circle r={r * 0.15} fill="url(#lf-timocito)" stroke="#8A7CB8" strokeWidth={1.3} />
          <circle r={r * 0.11} cx={r * 0.01} fill="#7B6AAE" />
          <circle r={r * 0.03} cx={-r * 0.04} cy={-r * 0.04} fill="#fff" opacity={0.6} />
        </g>
      ))}
      <ellipse rx={r * 0.36} ry={r * 0.3} fill="url(#lf-epiC)" stroke="#7A5EB2" strokeWidth={2.2} />
      <ellipse rx={r * 0.22} ry={r * 0.16} fill="url(#lf-epiCNuc)" stroke="#8E78C2" strokeWidth={1.3} />
      <Cromatina n={14} rx={r * 0.18} ry={r * 0.12} color="#8E78C2" r={1.3} op={0.6} />
      <circle cx={r * 0.04} cy={-r * 0.02} r={r * 0.045} fill="#5B4699" />
      <Brillo x={-r * 0.16} y={-r * 0.14} rx={r * 0.08} ry={r * 0.05} />
    </g>
  );
}

function Mtec({ r }: { r: number }) {
  const cuerpo = `M${-r},${-r * 0.05} C${-r * 0.98},${-r * 0.72} ${-r * 0.35},${-r * 1.02} ${r * 0.22},${-r * 0.92} C${r * 0.86},${-r * 0.8} ${r * 1.02},${-r * 0.2} ${r * 0.92},${r * 0.32} C${r * 0.8},${r * 0.9} ${r * 0.1},${r * 1.02} ${-r * 0.45},${r * 0.86} C${-r * 0.9},${r * 0.72} ${-r * 1.02},${r * 0.4} ${-r},${-r * 0.05} Z`;
  const antigenos: { ang: number; forma: ReactNode }[] = [
    { ang: -2.2, forma: <path d="M0,-6 L5.2,-3 L5.2,3 L0,6 L-5.2,3 L-5.2,-3 Z" fill="#E0702A" /> },
    { ang: -1.2, forma: <path d="M0,-6 L6,5 L-6,5 Z" fill="#2F6FD0" /> },
    { ang: -0.2, forma: <rect x={-5} y={-5} width={10} height={10} rx={2} fill="#1F9A6A" /> },
    { ang: 0.8, forma: <path d="M0,-6.5 L6.5,0 L0,6.5 L-6.5,0 Z" fill="#8A4FCF" /> },
    { ang: 2.6, forma: <circle r={5.5} fill="#C2410C" /> },
  ];
  return (
    <g>
      <path d={cuerpo} fill="url(#lf-epiM)" stroke="#A84D7F" strokeWidth={2.6} />
      {/* Haces de queratina */}
      {[-0.55, -0.2, 0.2, 0.55].map((y, i) => <path key={i} d={`M${-r * 0.82},${y * r} C${-r * 0.3},${(y - 0.22) * r} ${r * 0.3},${(y + 0.22) * r} ${r * 0.8},${(y - 0.05) * r}`} fill="none" stroke="#D99ABA" strokeWidth={1.4} opacity={0.75} />)}
      {/* Antígenos de otros tejidos presentados en MHC */}
      {antigenos.map((g, i) => {
        const x = Math.cos(g.ang) * r * 0.98, y = Math.sin(g.ang) * r * 0.9;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${(g.ang * 180) / Math.PI + 90})`}>
            <path d="M-8,-4 L-8,8 Q0,14 8,8 L8,-4" fill="none" stroke="#C9792A" strokeWidth={3.2} strokeLinecap="round" />
            <g transform="translate(0,-4)">{g.forma}</g>
          </g>
        );
      })}
      <ellipse cx={-r * 0.05} cy={r * 0.02} rx={r * 0.38} ry={r * 0.3} fill="url(#lf-epiMNuc)" stroke="#A84D7F" strokeWidth={1.4} />
      <Cromatina n={14} rx={r * 0.32} ry={r * 0.24} color="#B06A90" r={1.5} op={0.55} />
      {/* Cuerpos nucleares de AIRE */}
      {puntos(7, r * 0.27, r * 0.2, 0.9).map(([x, y], i) => <circle key={i} cx={x - r * 0.05} cy={y + r * 0.02} r={3.2} fill="#E53E8C" stroke="#fff" strokeWidth={1} />)}
      <Reflejo r={r * 0.95} />
      <Brillo x={-r * 0.5} y={-r * 0.5} rx={r * 0.12} ry={r * 0.08} />
    </g>
  );
}

function Dendritica({ r }: { r: number }) {
  const velos = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2 + 0.25);
  return (
    <g>
      {velos.map((a, i) => {
        const largo = r * (0.82 + (i % 3) * 0.1), c = i % 2 ? 0.28 : -0.24;
        const p = enRama(a, largo, c, 1);
        return (
          <g key={i}>
            <path d={rama(a, largo, r * 0.13, c)} fill="url(#lf-dc)" stroke="#A8732E" strokeWidth={1.6} strokeLinejoin="round" />
            {/* MHC II en la punta del velo */}
            <path d="M-5,-3 L-5,5 Q0,9 5,5 L5,-3" transform={`translate(${p.x},${p.y}) rotate(${(a * 180) / Math.PI + 90})`} fill="none" stroke="#A9502A" strokeWidth={2.6} strokeLinecap="round" />
          </g>
        );
      })}
      <circle r={r * 0.42} fill="url(#lf-dc)" stroke="#A8732E" strokeWidth={2.2} />
      {/* Núcleo arriñonado y endosomas */}
      <path d={`M${-r * 0.24},${-r * 0.02} C${-r * 0.26},${-r * 0.24} ${r * 0.18},${-r * 0.28} ${r * 0.24},${-r * 0.06} C${r * 0.12},${-r * 0.02} ${r * 0.12},${r * 0.08} ${r * 0.22},${r * 0.12} C${r * 0.14},${r * 0.3} ${-r * 0.24},${r * 0.24} ${-r * 0.24},${-r * 0.02} Z`} fill="url(#lf-dcNuc)" stroke="#8A5A1E" strokeWidth={1.3} />
      <Cromatina n={10} rx={r * 0.18} ry={r * 0.14} color="#7A4A12" r={1.4} op={0.6} />
      {[[0.22, 0.26], [-0.28, 0.22], [0.3, -0.18], [-0.12, -0.32]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={r * 0.04} fill="#FBE3C2" stroke="#C98B3A" strokeWidth={1} />)}
      <Brillo x={-r * 0.2} y={-r * 0.22} rx={r * 0.1} ry={r * 0.06} />
    </g>
  );
}

function Macrofago({ r }: { r: number }) {
  const cuerpo = `M${-r},${-r * 0.08} C${-r * 1.02},${-r * 0.62} ${-r * 0.55},${-r * 0.82} ${-r * 0.3},${-r * 0.7} C${-r * 0.1},${-r * 1.05} ${r * 0.5},${-r * 0.98} ${r * 0.72},${-r * 0.6} C${r * 1.12},${-r * 0.42} ${r * 1.05},${r * 0.2} ${r * 0.85},${r * 0.45} C${r * 0.7},${r * 0.98} ${r * 0.05},${r * 1.0} ${-r * 0.3},${r * 0.82} C${-r * 0.7},${r * 0.95} ${-r * 1.08},${r * 0.5} ${-r},${-r * 0.08} Z`;
  return (
    <g>
      <path d={cuerpo} fill="url(#lf-macro)" stroke="#8C624E" strokeWidth={2.6} />
      {/* Vacuolas y lisosomas */}
      {[[0.5, -0.45, 0.09], [0.62, 0.15, 0.07], [-0.55, 0.45, 0.08], [-0.15, -0.62, 0.06]].map(([x, y, k], i) => <circle key={i} cx={x * r} cy={y * r} r={k * r} fill="#FFFAF6" stroke="#C9A595" strokeWidth={1.2} />)}
      {puntos(12, r * 0.8, r * 0.7, 2).map(([x, y], i) => <circle key={`l${i}`} cx={x} cy={y} r={2.2} fill="#B07A5C" opacity={0.6} />)}
      {/* Cuerpos apoptóticos fagocitados (los «cuerpos tingibles») */}
      {[[0.22, -0.18, 0.15], [0.42, 0.42, 0.12], [-0.05, 0.4, 0.1], [0.55, -0.05, 0.08]].map(([x, y, k], i) => (
        <g key={`a${i}`}><circle cx={x * r} cy={y * r} r={k * r * 1.45} fill="#FFF4EE" stroke="#D2B0A0" strokeWidth={1} /><circle cx={x * r} cy={y * r} r={k * r} fill="#3E2E4C" /><circle cx={x * r - k * r * 0.3} cy={y * r - k * r * 0.3} r={k * r * 0.25} fill="#7A6890" /></g>
      ))}
      <path d={`M${-r * 0.62},${-r * 0.2} C${-r * 0.64},${-r * 0.45} ${-r * 0.2},${-r * 0.5} ${-r * 0.14},${-r * 0.26} C${-r * 0.24},${-r * 0.2} ${-r * 0.22},${-r * 0.08} ${-r * 0.14},${-r * 0.02} C${-r * 0.2},${r * 0.14} ${-r * 0.6},${r * 0.1} ${-r * 0.62},${-r * 0.2} Z`} fill="url(#lf-macroNuc)" stroke="#6E4836" strokeWidth={1.3} />
      <Cromatina n={12} rx={r * 0.18} ry={r * 0.12} color="#5E3A2A" r={1.6} op={0.55} />
      <Reflejo r={r * 0.92} />
    </g>
  );
}

function Osteoblastos({ r }: { r: number }) {
  return (
    <g>
      {/* Hueso con laminillas y la capa de osteoide recién depositada */}
      <rect x={-r * 1.12} y={-r * 0.12} width={r * 2.24} height={r * 0.32} rx={6} fill="#FBF6EE" stroke="#B8946A" strokeWidth={1.5} />
      {[0.0, 0.08].map((y) => <line key={y} x1={-r * 1.05} y1={y * r} x2={r * 1.05} y2={y * r} stroke="#E4D3BA" strokeWidth={1.2} />)}
      <rect x={-r * 1.1} y={-r * 0.24} width={r * 2.2} height={r * 0.13} rx={4} fill="#F4D7DD" stroke="#D9A3AE" strokeWidth={1} />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={-r * 1.02 + i * r * 0.135} y1={-r * 0.22} x2={-r * 0.98 + i * r * 0.135} y2={-r * 0.13} stroke="#D29AA6" strokeWidth={1} />)}
      {[-0.75, -0.25, 0.25, 0.75].map((x) => (
        <g key={x} transform={`translate(${x * r},${-r * 0.52})`}>
          <rect x={-r * 0.22} y={-r * 0.26} width={r * 0.44} height={r * 0.52} rx={r * 0.1} fill="url(#lf-osteo)" stroke="#6E5BAF" strokeWidth={1.6} />
          <ellipse cy={r * 0.12} rx={r * 0.1} ry={r * 0.07} fill="#F3EFFB" />
          <ellipse cy={-r * 0.1} rx={r * 0.11} ry={r * 0.1} fill="url(#lf-osteoNuc)" />
          <circle cx={-r * 0.02} cy={-r * 0.12} r={r * 0.025} fill="#2E2066" />
        </g>
      ))}
    </g>
  );
}

export function DibujoCelula({ dibujo, d }: { dibujo: Dibujo; d: number }) {
  const r = d / 2;
  switch (dibujo) {
    case 'plasmocito': return <Plasmocito r={r} />;
    case 'centroblasto': return <Centroblasto r={r} />;
    case 'centrocito': return <Centrocito r={r} />;
    case 'tfh': return <Tfh r={r} />;
    case 'fdc': return <Fdc r={r} />;
    case 'car': return <Car r={r} />;
    case 'ctec': return <Ctec r={r} />;
    case 'mtec': return <Mtec r={r} />;
    case 'dendritica': return <Dendritica r={r} />;
    case 'macrofago': return <Macrofago r={r} />;
    case 'osteoblasto': return <Osteoblastos r={r} />;
    case 'hueso': return <HuesoLargo d={d} />;
    case 'eritrocito': return <g><ellipse rx={r} ry={r * 0.65} className={s.eritro} /><ellipse rx={r * 0.45} ry={r * 0.22} className={s.eritroCentro} /></g>;
  }
}
