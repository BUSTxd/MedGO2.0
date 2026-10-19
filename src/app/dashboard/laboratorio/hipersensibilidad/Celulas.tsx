'use client';
// Células que el laboratorio «Hipersensibilidad» dibuja con código, en el estilo
// de las ilustraciones de Robbins que lo acompañan (membrana con reborde, un
// brillo arriba a la izquierda, citoplasma en degradado, núcleo con cromatina):
//   · eosinófilo: núcleo bilobulado y gránulos rojos-anaranjados grandes;
//   · basófilo: gránulos azul-violeta que tapan el núcleo;
//   · ILC2: linfocito innato sin receptor reordenado, con vesículas de IL-5/IL-13;
//   · plaqueta: disco con gránulos;
//   · célula epitelioide: macrófago alargado de citoplasma rosado y núcleo en suela;
//   · gigante de Langhans: núcleos en herradura en la periferia;
//   · linfocito genérico (si falta la ilustración), del color del actor.
// Más el anticuerpo (Y: IgE, IgG; IgM pentamérica) y el inmunocomplejo, que el
// motor orienta al unirse.

import type { Dibujo, Isotipo } from '@/lib/data/hipersensibilidad/tipos';
import { COLOR_AB, H } from '@/lib/data/hipersensibilidad/colores';
import { DibujoCelula as DibujoLinfocitos } from '../maduracion-linfocitos/Celulas';
import type { Dibujo as DibujoL } from '@/lib/data/linfocitos/tipos';

const RAD: [string, string, string][] = [
  ['hs-eosCito', '#FDEBE6', '#F2B6A6'],
  ['hs-eosNuc', '#7C6BC0', '#4A3A8C'],
  ['hs-basoCito', '#EDE9FA', '#C5BDEB'],
  ['hs-ilcCito', '#F3EEFC', '#CBBDEB'],
  ['hs-ilcNuc', '#8670C6', '#4B3B86'],
  ['hs-plaq', '#FBEFC9', '#E5C25E'],
  ['hs-epit', '#FBE6EE', '#EBB1C6'],
  ['hs-epitNuc', '#C9A0D8', '#8E5FA8'],
  ['hs-linf', '#FFFFFF', '#E0E4EC'],
];

export function DefsPropias() {
  return (
    <>
      {RAD.map(([id, c0, c1]) => (
        <radialGradient key={id} id={id} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
      ))}
    </>
  );
}

function puntos(n: number, rx: number, ry: number, desfase = 0): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const a = i * 2.39996 + desfase;
    return [Math.cos(a) * rx * Math.sqrt(t) * 0.92, Math.sin(a) * ry * Math.sqrt(t) * 0.92];
  });
}

function Reflejo({ r }: { r: number }) {
  return <path d={`M${(-r * 0.78).toFixed(1)},${(-r * 0.18).toFixed(1)} A${r * 0.86},${r * 0.86} 0 0 1 ${(-r * 0.2).toFixed(1)},${(-r * 0.82).toFixed(1)}`} fill="none" stroke="#fff" strokeWidth={Math.max(2.5, r * 0.06)} strokeLinecap="round" opacity={0.6} />;
}

/** Contorno ondulado de leucocito (como los de Robbins). */
function ondulado(r: number, n = 22, amp = 0.035): string {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const k = 1 + (i % 2 ? amp : -amp);
    return `${(Math.cos(a) * r * k).toFixed(1)},${(Math.sin(a) * r * k).toFixed(1)}`;
  });
  return `M${pts.join(' L')} Z`;
}

/** Gránulos que quedan según `vacio` (0 = todos, 1 = ninguno): se van primero los de la periferia. */
function Granulos({ n, r, color, borde, rg, vacio = 0, desfase = 0 }: { n: number; r: number; color: string; borde?: string; rg: number; vacio?: number; desfase?: number }) {
  const pts = puntos(n, r, r, desfase);
  const quedan = Math.round(n * (1 - vacio * 0.85));
  return <g>{pts.slice(0, quedan).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={rg * (0.75 + (i % 3) * 0.18)} fill={color} stroke={borde} strokeWidth={borde ? 0.8 : 0} />)}</g>;
}

function Eosinofilo({ r, vacio }: { r: number; vacio: number }) {
  return (
    <g>
      <path d={ondulado(r)} fill="url(#hs-eosCito)" stroke="#C2554A" strokeWidth={2.4} />
      <Granulos n={46} r={r * 0.86} color="#E8603F" borde="#B13A26" rg={r * 0.07} vacio={vacio} />
      {/* Núcleo bilobulado («en antifaz») */}
      {[-1, 1].map((k) => <ellipse key={k} cx={k * r * 0.3} cy={-r * 0.04} rx={r * 0.27} ry={r * 0.33} fill="url(#hs-eosNuc)" stroke="#33236B" strokeWidth={1.4} transform={`rotate(${k * 18} ${k * r * 0.3} 0)`} />)}
      <path d={`M${-r * 0.06},${-r * 0.02} Q0,${r * 0.08} ${r * 0.06},${-r * 0.02}`} stroke="#4A3A8C" strokeWidth={r * 0.07} fill="none" strokeLinecap="round" />
      <Reflejo r={r} />
    </g>
  );
}

function Basofilo({ r, vacio }: { r: number; vacio: number }) {
  return (
    <g>
      <path d={ondulado(r)} fill="url(#hs-basoCito)" stroke="#5B4CB0" strokeWidth={2.4} />
      <path d={`M${-r * 0.5},${-r * 0.1} C${-r * 0.5},${-r * 0.55} ${r * 0.1},${-r * 0.6} ${r * 0.2},${-r * 0.25} C${r * 0.55},${-r * 0.3} ${r * 0.6},${r * 0.3} ${r * 0.2},${r * 0.35} C${0},${r * 0.6} ${-r * 0.5},${r * 0.4} ${-r * 0.5},${-r * 0.1} Z`} fill="#A99BD8" stroke="#5B4CB0" strokeWidth={1.4} />
      <Granulos n={38} r={r * 0.82} color="#3F2E8C" rg={r * 0.075} vacio={vacio} desfase={0.7} />
      <Reflejo r={r} />
    </g>
  );
}

function Ilc2({ r }: { r: number }) {
  const nr = r * 0.66;
  return (
    <g>
      <circle r={r} fill="url(#hs-ilcCito)" stroke="#7A5EB2" strokeWidth={2.4} />
      <circle r={nr} cx={-r * 0.04} fill="url(#hs-ilcNuc)" stroke="#33236B" strokeWidth={1.4} />
      {puntos(18, nr * 0.8, nr * 0.8).map(([x, y], i) => <circle key={i} cx={x - r * 0.04} cy={y} r={2.2} fill="#2E2066" opacity={0.55} />)}
      {/* Vesículas de IL-5 / IL-13 */}
      {[[0.72, 0.3], [0.6, 0.58], [0.76, -0.2]].map(([x, y], i) => <circle key={i} cx={x * r} cy={y * r} r={r * 0.08} fill="#FBD3DE" stroke="#D9567E" strokeWidth={1.2} />)}
      <Reflejo r={r} />
    </g>
  );
}

function Plaqueta({ r }: { r: number }) {
  return (
    <g>
      <ellipse rx={r} ry={r * 0.62} fill="url(#hs-plaq)" stroke="#B48A1E" strokeWidth={1.6} />
      {puntos(7, r * 0.6, r * 0.34).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r * 0.11} fill="#9C6E12" opacity={0.6} />)}
    </g>
  );
}

function Epitelioide({ r }: { r: number }) {
  const rx = r, ry = r * 0.62;
  return (
    <g>
      <path d={`M${-rx},0 C${-rx},${-ry * 1.1} ${rx * 0.4},${-ry * 1.2} ${rx},${-ry * 0.2} C${rx * 1.05},${ry * 0.6} ${-rx * 0.2},${ry * 1.2} ${-rx},0 Z`} fill="url(#hs-epit)" stroke="#B4507E" strokeWidth={2} />
      {/* Núcleo alargado, pálido, «en suela de zapato» */}
      <path d={`M${-rx * 0.45},${-ry * 0.05} C${-rx * 0.45},${-ry * 0.42} ${rx * 0.4},${-ry * 0.45} ${rx * 0.42},${-ry * 0.08} C${rx * 0.3},${ry * 0.05} ${rx * 0.3},${ry * 0.18} ${rx * 0.4},${ry * 0.28} C${rx * 0.2},${ry * 0.5} ${-rx * 0.45},${ry * 0.38} ${-rx * 0.45},${-ry * 0.05} Z`} fill="url(#hs-epitNuc)" stroke="#6E3E88" strokeWidth={1.2} />
      {puntos(10, rx * 0.3, ry * 0.25).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill="#5A2E72" opacity={0.6} />)}
    </g>
  );
}

function Gigante({ r }: { r: number }) {
  // Núcleos en herradura (Langhans), citoplasma eosinófilo abundante.
  const nucleos = Array.from({ length: 14 }, (_, i) => -Math.PI * 0.95 + (i / 13) * Math.PI * 1.9);
  return (
    <g>
      <path d={`M${-r},${-r * 0.1} C${-r * 1.02},${-r * 0.75} ${-r * 0.3},${-r * 1.02} ${r * 0.3},${-r * 0.92} C${r * 0.95},${-r * 0.8} ${r * 1.05},${-r * 0.1} ${r * 0.92},${r * 0.4} C${r * 0.75},${r * 0.95} ${-r * 0.2},${r * 1.02} ${-r * 0.65},${r * 0.78} C${-r * 0.98},${r * 0.55} ${-r * 1.02},${r * 0.3} ${-r},${-r * 0.1} Z`} fill="url(#hs-epit)" stroke="#B4507E" strokeWidth={2.4} />
      {nucleos.map((a, i) => <ellipse key={i} cx={Math.cos(a + Math.PI / 2) * r * 0.72} cy={Math.sin(a + Math.PI / 2) * r * 0.66} rx={r * 0.1} ry={r * 0.065} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a + Math.PI / 2) * r * 0.72} ${Math.sin(a + Math.PI / 2) * r * 0.66})`} fill="url(#hs-epitNuc)" stroke="#6E3E88" strokeWidth={1} />)}
      <Reflejo r={r * 0.95} />
    </g>
  );
}

function Linfocito({ r, color }: { r: number; color: string }) {
  return (
    <g>
      <circle r={r} fill="url(#hs-linf)" stroke={color} strokeWidth={2.4} />
      <circle r={r * 0.74} cx={-r * 0.04} fill={color} opacity={0.75} />
      {puntos(16, r * 0.6, r * 0.6).map(([x, y], i) => <circle key={i} cx={x - r * 0.04} cy={y} r={2} fill="#1B1F2A" opacity={0.25} />)}
      <Reflejo r={r} />
    </g>
  );
}

const PROPIOS = new Set(['eosinofilo', 'basofilo', 'ilc2', 'plaqueta', 'gigante', 'epitelioide', 'linfocito']);

export function DibujoCelula({ dibujo, d, color = H.th2, vacio = 0 }: { dibujo: Dibujo; d: number; color?: string; vacio?: number }) {
  const r = d / 2;
  if (!PROPIOS.has(dibujo)) return <DibujoLinfocitos dibujo={dibujo as DibujoL} d={d} />;
  switch (dibujo) {
    case 'eosinofilo': return <Eosinofilo r={r} vacio={vacio} />;
    case 'basofilo': return <Basofilo r={r} vacio={vacio} />;
    case 'ilc2': return <Ilc2 r={r} />;
    case 'plaqueta': return <Plaqueta r={r} />;
    case 'epitelioide': return <Epitelioide r={r} />;
    case 'gigante': return <Gigante r={r} />;
    case 'linfocito': return <Linfocito r={r} color={color} />;
  }
  return null;
}

// ─── Anticuerpos e inmunocomplejos ────────────────────────────────────────────

/** Anticuerpo en Y con el Fc hacia +y (abajo) y los Fab arriba, de alto `d`. */
export function Anticuerpo({ ab, d, color }: { ab: Isotipo; d: number; color?: string }) {
  const col = color ?? COLOR_AB[ab];
  const h = d / 2;
  const w = Math.max(3, d * 0.11);
  if (ab === 'IgM') {
    // Pentámero: cinco Y unidas por el Fc (con la cadena J).
    return (
      <g>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * 360 - 90;
          return (
            <g key={i} transform={`rotate(${a + 90})`}>
              <path d={`M0,${-h * 0.18} L0,${-h * 0.62} M0,${-h * 0.62} L${-h * 0.2},${-h} M0,${-h * 0.62} L${h * 0.2},${-h}`} stroke={col} strokeWidth={w * 0.8} strokeLinecap="round" fill="none" />
            </g>
          );
        })}
        <circle r={h * 0.2} fill={col} />
      </g>
    );
  }
  return (
    <g>
      {/* Fc (dos cadenas pesadas) y los dos Fab, con la cadena ligera más clara. */}
      <path d={`M${-w * 0.35},${h} L${-w * 0.35},${-h * 0.05} M${w * 0.35},${h} L${w * 0.35},${-h * 0.05}`} stroke={col} strokeWidth={w * 0.62} strokeLinecap="round" />
      <path d={`M${-w * 0.35},${-h * 0.05} L${-h * 0.62},${-h} M${w * 0.35},${-h * 0.05} L${h * 0.62},${-h}`} stroke={col} strokeWidth={w * 0.62} strokeLinecap="round" />
      <path d={`M${-w * 0.95},${-h * 0.02} L${-h * 0.78},${-h * 0.82} M${w * 0.95},${-h * 0.02} L${h * 0.78},${-h * 0.82}`} stroke={col} strokeWidth={w * 0.48} strokeLinecap="round" opacity={0.55} />
    </g>
  );
}

/** Inmunocomplejo: red de anticuerpos (azul marino) unidos a antígenos (verde). */
export function Complejo({ n, d }: { n: number; d: number }) {
  const r = d / 2;
  const nodos = Array.from({ length: Math.max(2, n) }, (_, i) => {
    const a = i * 2.39996;
    const k = Math.sqrt((i + 0.5) / Math.max(2, n)) * r * 0.78;
    return { x: Math.cos(a) * k, y: Math.sin(a) * k };
  });
  return (
    <g>
      {nodos.map((p, i) => {
        const q = nodos[(i + 1) % nodos.length];
        const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
        const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
        const L = Math.hypot(q.x - p.x, q.y - p.y);
        return (
          <g key={i} transform={`translate(${mx},${my}) rotate(${ang})`}>
            <path d={`M${-L / 2},0 L${-L * 0.1},0 M${-L * 0.1},0 L${L / 2},${-L * 0.18} M${-L * 0.1},0 L${L / 2},${L * 0.18}`} stroke={H.complejo} strokeWidth={Math.max(3, r * 0.1)} strokeLinecap="round" fill="none" />
          </g>
        );
      })}
      {nodos.map((p, i) => <circle key={`a${i}`} cx={p.x} cy={p.y} r={Math.max(4, r * 0.13)} fill={H.antigeno} stroke="#2E7D2A" strokeWidth={1.2} />)}
    </g>
  );
}
