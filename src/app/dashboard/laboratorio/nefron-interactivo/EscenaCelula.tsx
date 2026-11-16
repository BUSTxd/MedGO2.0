'use client';
// Vista de pared (nivel célula): luz arriba, la célula en foco con sus dos
// vecinas, intersticio y capilar abajo. Estilo plano de docs/nefron/ESTILO.md:
// sin bordes, membrana magenta «abollada», núcleo ámbar, mitocondrias rojas y
// capilar granate con guiones. Las partículas y los glóbulos rojos van en el
// canvas de encima (Lienzo.tsx). Poco texto: «Luz», el vaso y las siglas.

import { memo, type KeyboardEvent, type MouseEvent } from 'react';
import { CELULAS } from '@/lib/data/nefron/celulas.ts';
import { CAPAS, type CapaId } from '@/lib/data/nefron/barrera.ts';
import type { CelulaId, TransportadorId } from '@/lib/data/nefron/tipos.ts';
import type { Disposicion } from './engine/disposicion';
import type { DisposicionBarrera } from './engine/barrera';
import { fx, type Factores, type Marca } from './engine/flujo';
import { BOKEH, brillo, sombra } from './engine/paleta';
import { Etiqueta, Glifo } from './Glifos';
import nf from '@/styles/nefron.module.css';

export type PiezaId = TransportadorId | CapaId;

export const COLOR_LUZ = '#0fa3b8';
export const COLOR_SANGRE = '#d81b4a';

/** Círculos tenues de fondo dentro de una caja. */
function Bokeh({ x0, y0, w, h, n = BOKEH.length }: { x0: number; y0: number; w: number; h: number; n?: number }) {
  return (
    <g fill="var(--nf-bokeh)">
      {BOKEH.slice(0, n).map(([x, y, r], i) => <circle key={i} cx={x0 + x * w} cy={y0 + y * h} r={r * 1400} />)}
    </g>
  );
}

/** Membrana «abollada»: una fila de semicírculos con su brillo, entre x0 y x1. */
function Membrana({ x0, x1, y, r = 8, op = 1 }: { x0: number; x1: number; y: number; r?: number; op?: number }) {
  const paso = r * 1.6;
  const xs: number[] = [];
  for (let x = x0 + r * 0.6; x <= x1 - r * 0.6; x += paso) xs.push(x);
  return (
    <g opacity={op}>
      <rect x={x0} y={y - r * 0.55} width={x1 - x0} height={r * 1.1} fill="var(--nf-membrana)" />
      {xs.map((x) => <circle key={x} cx={x} cy={y} r={r} fill="var(--nf-membrana)" />)}
      {xs.map((x) => <circle key={`b${x}`} cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.3} fill="var(--nf-membrana-brillo)" />)}
    </g>
  );
}

export const EscenaCelula = memo(function EscenaCelula({
  celula, d, factores, marcas, elegido, senalado, onElegir, onSenalar, onVecina,
}: {
  celula: CelulaId;
  d: Disposicion;
  factores: Factores;
  marcas: Map<string, Marca>;
  elegido: PiezaId | null;
  senalado: PiezaId | null;
  onElegir: (t: TransportadorId) => void;
  onSenalar: (t: TransportadorId | null) => void;
  onVecina: (c: CelulaId) => void;
}) {
  const cel = CELULAS[celula];
  const T = d.texto;
  const { foco, apicalY, baseY, capilar } = d;
  const alto = baseY - apicalY;
  const n = d.nucleo;
  const hs = Math.min(70, alto * 0.24);
  // Sombra en media luna al pie de la célula, con borde ondulado.
  const ondas = 6;
  const paso = (foco.x1 - foco.x0) / ondas;
  let sombraPie = `M${foco.x0} ${baseY}V${baseY - hs}`;
  for (let i = 0; i < ondas; i++) {
    const xa = foco.x0 + i * paso;
    sombraPie += `Q${xa + paso / 2} ${baseY - hs - (i % 2 ? 10 : -6)} ${xa + paso} ${baseY - hs}`;
  }
  sombraPie += `V${baseY}Z`;

  return (
    <g>
      {/* Luz del túbulo con círculos tenues */}
      <rect x={-900} y={-900} width={d.W + 1800} height={apicalY + 900} fill="var(--nf-luz-celula)" />
      <Bokeh x0={0} y0={0} w={d.W} h={Math.max(80, apicalY - 60)} n={10} />
      <Etiqueta x={d.W - 16} y={Math.max(T * 1.2, apicalY - T * 3.6)} texto="Luz del túbulo" tam={T * 0.86} color={COLOR_LUZ} ancla="end" />

      {/* Intersticio y capilar: luz granate y pared con guiones */}
      <rect x={-900} y={baseY} width={d.W + 1800} height={capilar.y0 - baseY} fill="var(--nf-intersticio)" />
      <rect x={-900} y={capilar.y0} width={d.W + 1800} height={d.H - capilar.y0 + 900} fill="var(--nf-capilar)" />
      <rect x={-900} y={capilar.y0} width={d.W + 1800} height={16} fill="var(--nf-capilar-pared)" />
      <path d={`M-900 ${capilar.y0 + 8}H${d.W + 900}`} stroke="#ff5a78" strokeWidth={4.5} strokeDasharray="20 12" strokeLinecap="round" />
      <Etiqueta x={d.W - 16} y={capilar.y1 - T * 1.1} texto={cel.vaso} tam={T * 0.86} color={COLOR_SANGRE} ancla="end" />

      {/* Vecinas: más apagadas; tocarlas cambia el foco */}
      {d.vecinas.map((v, i) => {
        const id = cel.vecinas[i];
        const vc = CELULAS[id];
        const xa = Math.max(-40, v.x0);
        const xb = Math.min(d.W + 40, v.x1);
        const pelo = vc.cepillo === 'denso' ? 40 : vc.cepillo === 'escaso' ? 18 : 0;
        return (
          <g key={i} className={nf.cuenta} onClick={(e) => { e.stopPropagation(); onVecina(id); }} role="button" aria-label={`Ver la ${vc.corto}`}>
            {pelo > 0 && Array.from({ length: Math.max(0, Math.floor((xb - xa) / 11)) }, (_, k) => (
              <rect key={k} x={xa + 4 + k * 11} y={apicalY - pelo} width={6} height={pelo + 4} rx={3} fill="var(--nf-membrana-vecina)" />
            ))}
            <rect x={i === 0 ? v.x0 - 900 : v.x0} y={apicalY} width={v.x1 - v.x0 + 900} height={alto} fill="var(--nf-citosol-vecina)" />
            <Membrana x0={xa} x1={xb} y={apicalY} r={7} op={0.75} />
            <Membrana x0={xa} x1={xb} y={baseY} r={7} op={0.75} />
          </g>
        );
      })}

      {/* Borde en cepillo */}
      {d.vellos.xs.map((x) => (
        <rect key={x} x={x - 3} y={apicalY - d.vellos.alto} width={6} height={d.vellos.alto + 4} rx={3} fill="var(--nf-membrana)" />
      ))}

      {/* Célula en foco */}
      <rect x={foco.x0} y={apicalY} width={foco.x1 - foco.x0} height={alto} fill="var(--nf-citosol)" />
      <path d={sombraPie} fill="var(--nf-citosol-sombra)" />
      {d.pliegues.map((x) => (
        <rect key={x} x={x - 3} y={baseY - alto * 0.28} width={6} height={alto * 0.28} rx={3} fill="var(--nf-membrana)" opacity={0.8} />
      ))}
      {d.mitocondrias.map((m, i) => (
        <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.ang})`}>
          <ellipse cx={0} cy={3} rx={24} ry={10} fill="var(--nf-mito-sombra)" />
          <ellipse rx={24} ry={10} fill="var(--nf-mito)" />
          <path d="M-15 1l5-5 5 9 5-9 5 9 5-5" fill="none" stroke="var(--nf-mito-cresta)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      {/* Núcleo ámbar con su brillo */}
      <ellipse cx={n.cx + 3} cy={n.cy + 5} rx={n.rx} ry={n.ry} fill="var(--nf-nucleo-sombra)" />
      <ellipse cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill="var(--nf-nucleo)" />
      <ellipse cx={n.cx - n.rx * 0.18} cy={n.cy - n.ry * 0.18} rx={n.rx * 0.62} ry={n.ry * 0.62} fill="var(--nf-nucleo-brillo)" />
      <ellipse cx={n.cx - n.rx * 0.32} cy={n.cy - n.ry * 0.34} rx={n.rx * 0.2} ry={n.ry * 0.2} fill="#fff8dc" />
      {/* Membranas: lados, luz y base */}
      <rect x={foco.x0 - 3} y={apicalY} width={6} height={alto} fill="var(--nf-membrana)" />
      <rect x={foco.x1 - 3} y={apicalY} width={6} height={alto} fill="var(--nf-membrana)" />
      <Membrana x0={foco.x0} x1={foco.x1} y={apicalY} />
      <Membrana x0={foco.x0} x1={foco.x1} y={baseY} />

      {/* Uniones estrechas */}
      {d.uniones.map((x) => (
        <g key={x} fill="#ffd23d">
          {[0, 1, 2].map((k) => <circle key={k} cx={x} cy={apicalY + 8 + k * 8} r={3.4} />)}
        </g>
      ))}

      {/* Reacciones: solo la ecuación */}
      {d.reacciones.map((r, i) => (
        <text key={i} x={r.x} y={r.y} textAnchor="middle" fontSize={T * 0.82} fontWeight={700}
          className={r.donde === 'citosol' ? nf.tCel : `${nf.t} ${nf.halo}`} strokeWidth={4}>
          {r.texto}
        </text>
      ))}
      {cel.senal && (
        <Etiqueta x={foco.x1 - 8} y={baseY + (capilar.y0 - baseY) / 2} texto="Señal → renina" tam={T * 0.74} color="#ff8a3d" ancla="end" punta />
      )}

      {/* Transportadores */}
      {d.glifos.map((g) => {
        const f = fx(factores, celula, g.t);
        // AQP2 sin ADH espera dentro de la célula, en vesículas.
        const enVesicula = g.t === 'aqp2' && g.membrana === 'apical';
        const baja = enVesicula ? (1 - Math.min(1, f)) * Math.min(96, alto * 0.42) : 0;
        const gg = baja ? { ...g, y: g.y + baja } : g;
        return (
          <g key={`${g.membrana}-${g.t}`}>
            {baja > 8 && (
              <circle cx={g.x} cy={g.y + baja} r={g.w / 2 + 16} fill="var(--nf-membrana)" opacity={Math.min(0.4, baja / 100)} />
            )}
            <Glifo
              g={gg}
              flujo={enVesicula ? 1 : f}
              marca={marcas.get(`${celula}|${g.t}`)}
              activo={elegido === g.t}
              senalado={senalado === g.t}
              texto={T}
              onElegir={onElegir}
              onSenalar={onSenalar}
            />
          </g>
        );
      })}
    </g>
  );
});

export const EscenaBarrera = memo(function EscenaBarrera({
  d, elegido, senalado, onElegir, onSenalar, tfg,
}: {
  d: DisposicionBarrera;
  elegido: PiezaId | null;
  senalado: PiezaId | null;
  onElegir: (c: CapaId) => void;
  onSenalar: (c: CapaId | null) => void;
  tfg: { pcg: number; pb: number; pic: number; tfg: number };
}) {
  const T = d.texto;
  const anillo = (id: CapaId) => (elegido === id ? 1 : senalado === id ? 0.6 : 0);
  const toca = (id: CapaId) => ({
    className: nf.cuenta,
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': CAPAS[id].nombre,
    onClick: (e: MouseEvent) => { e.stopPropagation(); onElegir(id); },
    onKeyDown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onElegir(id); } },
    onPointerEnter: () => onSenalar(id),
    onPointerLeave: () => onSenalar(null),
  });
  const neta = tfg.pcg - tfg.pb - tfg.pic;
  const cE = CAPAS.endotelio.color;
  const cM = CAPAS.mbg.color;
  const cP = CAPAS.podocito.color;
  const hE = d.endotelio.y1 - d.endotelio.y0;
  return (
    <g>
      {/* Capilar arriba (luz granate) y espacio de Bowman abajo */}
      <rect x={-900} y={-900} width={d.W + 1800} height={d.capilar.y1 + 900} fill="var(--nf-capilar)" />
      <Etiqueta x={d.W - 16} y={T * 1.4} texto="Capilar glomerular" tam={T * 0.86} color={COLOR_SANGRE} ancla="end" />
      <rect x={-900} y={d.capilar.y1} width={d.W + 1800} height={d.H - d.capilar.y1 + 900} fill="var(--nf-luz-celula)" />
      <Bokeh x0={0} y0={d.cuerpo.cy} w={d.W} h={d.H - d.cuerpo.cy} n={8} />

      {/* Endotelio con fenestras */}
      <g {...toca('endotelio')}>
        <rect x={-40} y={d.endotelio.y0 - 10} width={d.W + 80} height={hE + 20} fill="transparent" />
        {[-1, ...d.endotelio.fenestras.map((_, i) => i)].map((i) => {
          const x = i < 0 ? -40 : d.endotelio.fenestras[i] + 8;
          const sig = i < 0 ? d.endotelio.fenestras[0] - 8 : (d.endotelio.fenestras[i + 1] ?? d.W + 48) - 8;
          return (
            <g key={i}>
              <rect x={x} y={d.endotelio.y0 + 3} width={sig - x} height={hE} rx={8} fill={sombra(cE)} />
              <rect x={x} y={d.endotelio.y0} width={sig - x} height={hE} rx={8} fill={cE} />
              <rect x={x + 6} y={d.endotelio.y0 + 3} width={Math.max(0, sig - x - 12)} height={Math.max(2, hE * 0.18)} rx={2} fill={brillo(cE)} opacity={0.7} />
            </g>
          );
        })}
        {anillo('endotelio') > 0 && <rect x={2} y={d.endotelio.y0 - 6} width={d.W - 4} height={hE + 12} rx={12} fill="none" stroke="#ffffff" strokeWidth={4} opacity={anillo('endotelio')} />}
      </g>

      {/* Membrana basal con carga negativa */}
      <g {...toca('mbg')}>
        <rect x={-40} y={d.mbg.y0} width={d.W + 80} height={d.mbg.y1 - d.mbg.y0} fill={cM} opacity={0.55} />
        <rect x={-40} y={d.mbg.y0 + (d.mbg.y1 - d.mbg.y0) * 0.3} width={d.W + 80} height={(d.mbg.y1 - d.mbg.y0) * 0.4} fill={cM} opacity={0.75} />
        {Array.from({ length: Math.floor(d.W / 46) }, (_, k) => (
          <text key={k} x={30 + k * 46} y={(d.mbg.y0 + d.mbg.y1) / 2} dy="0.35em" textAnchor="middle" fontSize={T * 0.95} fontWeight={800} fill="#ffffff" opacity={0.9}>−</text>
        ))}
        {anillo('mbg') > 0 && <rect x={2} y={d.mbg.y0 - 3} width={d.W - 4} height={d.mbg.y1 - d.mbg.y0 + 6} rx={10} fill="none" stroke="#ffffff" strokeWidth={4} opacity={anillo('mbg')} />}
      </g>

      {/* Pies de los podocitos y diafragma de hendidura */}
      <g {...toca('podocito')}>
        <rect x={-40} y={d.pies.y0} width={d.W + 80} height={d.cuerpo.cy + d.cuerpo.ry - d.pies.y0} fill="transparent" />
        {d.pies.xs.map(([a, b], i) => {
          const xm = (a + b) / 2;
          return (
            <path key={`p${i}`} d={`M${xm} ${d.pies.y1 - 4}C${xm} ${d.pies.y1 + 40} ${(xm + d.cuerpo.cx) / 2} ${d.cuerpo.cy - d.cuerpo.ry - 20} ${d.cuerpo.cx + (xm - d.cuerpo.cx) * 0.3} ${d.cuerpo.cy - d.cuerpo.ry * 0.6}`}
              fill="none" stroke={sombra(cP)} strokeWidth={7} strokeLinecap="round" opacity={0.8} />
          );
        })}
        {d.pies.xs.map(([a, b], i) => (
          <g key={i}>
            <rect x={a} y={d.pies.y0 + 3} width={b - a} height={d.pies.y1 - d.pies.y0} rx={14} fill={sombra(cP)} />
            <rect x={a} y={d.pies.y0} width={b - a} height={d.pies.y1 - d.pies.y0} rx={14} fill={cP} />
            <ellipse cx={a + (b - a) * 0.3} cy={d.pies.y0 + 7} rx={(b - a) * 0.14} ry={3} fill="#ffffff" opacity={0.6} />
          </g>
        ))}
        {d.pies.hendiduras.map((x) => (
          <path key={x} d={`M${x - 6} ${d.pies.y0 + 6}H${x + 6}`} stroke="#ffd23d" strokeWidth={3.5} strokeLinecap="round" />
        ))}
        <ellipse cx={d.cuerpo.cx + 4} cy={d.cuerpo.cy + 6} rx={d.cuerpo.rx} ry={d.cuerpo.ry} fill={sombra(cP)} />
        <ellipse cx={d.cuerpo.cx} cy={d.cuerpo.cy} rx={d.cuerpo.rx} ry={d.cuerpo.ry} fill={cP} />
        <ellipse cx={d.cuerpo.cx + 22} cy={d.cuerpo.cy + 4} rx={d.cuerpo.rx * 0.38} ry={d.cuerpo.ry * 0.55} fill="var(--nf-nucleo-sombra)" />
        <ellipse cx={d.cuerpo.cx + 20} cy={d.cuerpo.cy} rx={d.cuerpo.rx * 0.38} ry={d.cuerpo.ry * 0.55} fill="var(--nf-nucleo)" />
        <ellipse cx={d.cuerpo.cx + 14} cy={d.cuerpo.cy - d.cuerpo.ry * 0.15} rx={d.cuerpo.rx * 0.16} ry={d.cuerpo.ry * 0.22} fill="var(--nf-nucleo-brillo)" />
        {anillo('podocito') > 0 && <rect x={2} y={d.pies.y0 - 4} width={d.W - 4} height={d.pies.y1 - d.pies.y0 + 8} rx={14} fill="none" stroke="#ffffff" strokeWidth={4} opacity={anillo('podocito')} />}
      </g>

      {/* Rótulos de las capas, a la derecha */}
      <Etiqueta x={d.W - 16} y={d.endotelio.y0 - T * 1.1} texto={CAPAS.endotelio.corto} tam={T * 0.74} color={sombra(cE)} ancla="end" />
      <Etiqueta x={d.W - 16} y={(d.mbg.y0 + d.mbg.y1) / 2} texto={CAPAS.mbg.corto} tam={T * 0.74} color={sombra(cM)} ancla="end" />
      <Etiqueta x={d.W - 16} y={d.pies.y1 + T * 1.3} texto={CAPAS.podocito.corto} tam={T * 0.74} color={sombra(cP)} ancla="end" />
      <Etiqueta x={16} y={d.cuerpo.cy + d.cuerpo.ry + T * 2.2} texto="Espacio de Bowman" tam={T * 0.86} color={COLOR_LUZ} />

      {/* Fuerzas de Starling: una sola línea */}
      <Etiqueta x={d.W - 16} y={d.H - T * 1.6} texto={`Presión neta ≈ ${neta} mmHg · TFG ≈ ${tfg.tfg} mL/min`} tam={T * 0.74} color="#4b2a8a" ancla="end" />
    </g>
  );
});
