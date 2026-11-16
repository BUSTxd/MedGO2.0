'use client';
// Glifos de la vista de pared: la forma dice el mecanismo (bomba, canal,
// simportador, antiportador, uniportador, receptor, enzima) y el relleno el
// color de lo que mueve. Estilo plano de docs/nefron/ESTILO.md: sin bordes,
// sombra en media luna y brillo. Hacia dónde va cada ion lo dicen las burbujas.

import { memo } from 'react';
import { SUSTANCIAS } from '@/lib/data/nefron/sustancias.ts';
import { TRANSPORTADORES } from '@/lib/data/nefron/transportadores.ts';
import type { Mecanismo, TransportadorId } from '@/lib/data/nefron/tipos.ts';
import type { Glifo as GlifoDisp } from './engine/disposicion';
import type { Marca } from './engine/flujo';
import { sombra } from './engine/paleta';
import nf from '@/styles/nefron.module.css';

export const COLOR_MARCA: Record<Marca, string> = {
  bloqueado: '#d8453a',
  activado: '#22a06b',
  afectado: '#7c5cd6',
  hormona: '#e0a100',
};

/** Color del glifo: el propio del transportador o el de lo que lo distingue. El
 *  Na⁺ va en casi todos, así que manda la otra sustancia (SGLT2 naranja por la
 *  glucosa, NHE3 rojo por el H⁺, la bomba violeta por el K⁺…), y
 *  lo que solo mueve Na⁺ (el ENaC) queda amarillo. */
export function colorTransportador(t: TransportadorId) {
  const tr = TRANSPORTADORES[t];
  if (tr.color) return tr.color;
  const otra = [...tr.mueve].reverse().find((m) => m.s !== 'na');
  const s = otra?.s ?? tr.mueve[0]?.s;
  return s ? SUSTANCIAS[s].color : '#8592a6';
}

/** Silueta del mecanismo centrada en (0, 0), de w × h, en estilo plano:
 *  sombra en media luna debajo, la forma llena y un brillo arriba. Sin bordes. */
export function Silueta({ m, w, h, color, plano = false }: { m: Mecanismo; w: number; h: number; color: string; plano?: boolean }) {
  const os = plano ? 0 : Math.max(3, h * 0.1);
  const so = sombra(color);
  const forma = (fill: string, dy = 0) => {
    switch (m) {
      case 'bomba':
        return <rect x={-w / 2} y={-h / 2 + dy} width={w} height={h} rx={h / 2} fill={fill} />;
      case 'canal':
        return <ellipse cx={0} cy={dy} rx={w / 2} ry={h / 2} fill={fill} />;
      case 'uniportador':
        return <ellipse cx={0} cy={dy} rx={w * 0.42} ry={h / 2} fill={fill} />;
      case 'receptor':
        return (
          <g fill="none" stroke={fill} strokeWidth={Math.max(5, w * 0.13)} strokeLinecap="round" transform={dy ? 'translate(0 ' + dy + ')' : undefined}>
            <path d={`M0 ${-h * 0.05}V${-h / 2}`} />
            <path d={`M0 ${-h * 0.05}C${-w * 0.05} ${h * 0.2} ${-w * 0.3} ${h * 0.2} ${-w * 0.34} ${h / 2}`} />
            <path d={`M0 ${-h * 0.05}C${w * 0.05} ${h * 0.2} ${w * 0.3} ${h * 0.2} ${w * 0.34} ${h / 2}`} />
          </g>
        );
      case 'enzima': {
        const r = Math.min(w, h) / 2;
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          return `${(Math.cos(a) * r * 1.15).toFixed(1)},${(Math.sin(a) * r + dy).toFixed(1)}`;
        }).join(' ');
        return <polygon points={pts} fill={fill} strokeLinejoin="round" stroke={fill} strokeWidth={4} />;
      }
      default:
        return <rect x={-w / 2} y={-h / 2 + dy} width={w} height={h} rx={h * 0.32} fill={fill} />;
    }
  };
  return (
    <g>
      {os > 0 && forma(so, os)}
      {forma(color)}
      {m === 'canal' && (
        <>
          <ellipse cx={0} cy={h * 0.04} rx={w * 0.27} ry={h * 0.2} fill="#1d0b3e" />
          <ellipse cx={0} cy={h * 0.12} rx={w * 0.19} ry={h * 0.09} fill={so} />
        </>
      )}
      {m !== 'receptor' && !plano && (
        <ellipse cx={-w * 0.27} cy={-h * 0.24} rx={Math.max(3, w * 0.09)} ry={Math.max(2, h * 0.08)} fill="#ffffff" opacity={0.75} />
      )}
    </g>
  );
}

export const Glifo = memo(function Glifo({
  g, flujo, marca, activo, senalado, texto, onElegir, onSenalar, atenuado = false,
}: {
  g: GlifoDisp;
  flujo: number;
  marca?: Marca;
  activo: boolean;
  senalado: boolean;
  texto: number;
  atenuado?: boolean;
  onElegir?: (t: TransportadorId) => void;
  onSenalar?: (t: TransportadorId | null) => void;
}) {
  const tr = TRANSPORTADORES[g.t];
  const color = colorTransportador(g.t);
  const recepcion = tr.mecanismo === 'receptor';
  // Receptor basolateral: la «copa» mira a la sangre (abajo).
  const giro = recepcion && g.membrana === 'basolateral' ? 180 : 0;
  const op = atenuado ? 0.35 : Math.min(1, 0.45 + 0.55 * Math.min(1, flujo));
  // La sigla va debajo del glifo: dentro de la célula si es apical, en el intersticio si es basolateral.
  const ySigla = g.h / 2 + texto * 1.15;
  const anillo = activo || senalado || marca;
  return (
    <g
      transform={`translate(${g.x} ${g.y})`}
      className={nf.cuenta}
      role="button"
      tabIndex={onElegir ? 0 : -1}
      aria-label={`${tr.sigla}: ${tr.nombre}`}
      onClick={(e) => { e.stopPropagation(); onElegir?.(g.t); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onElegir?.(g.t); } }}
      onPointerEnter={() => onSenalar?.(g.t)}
      onPointerLeave={() => onSenalar?.(null)}
    >
      {/* Área de toque generosa */}
      <rect x={-g.w / 2 - 10} y={-g.h / 2 - 12} width={g.w + 20} height={g.h + texto * 1.7 + 16} fill="transparent" />
      {anillo && (
        <rect
          x={-g.w / 2 - 9} y={-g.h / 2 - 9} width={g.w + 18} height={g.h + 20} rx={(g.h + 18) / 2.4}
          fill="none"
          stroke={activo ? '#ffffff' : marca ? COLOR_MARCA[marca] : '#ffffff'}
          strokeWidth={activo ? 4.5 : 3.5}
          strokeDasharray={!activo && marca === 'afectado' ? '7 5' : undefined}
          opacity={senalado && !activo && !marca ? 0.6 : 1}
        />
      )}
      <g opacity={op} transform={giro ? `rotate(${giro})` : undefined}>
        <Silueta m={tr.mecanismo} w={g.w} h={g.h} color={color} />
      </g>
      <g opacity={op}>
        {tr.mecanismo === 'bomba' && (
          <g transform={`translate(${g.w / 2 - 4} ${g.membrana === 'basolateral' ? -g.h / 2 + 2 : g.h / 2 - 2})`}>
            <circle r={10.5} fill="#ffd23d" />
            <text textAnchor="middle" dy="0.35em" fontSize={7.5} fontWeight={800} fill="#3a2a00">ATP</text>
          </g>
        )}
        {tr.mecanismo === 'enzima' && (
          <text textAnchor="middle" dy="0.35em" fontSize={11} fontWeight={800} fill="#ffffff">AC</text>
        )}
      </g>
      {marca === 'bloqueado' && (
        <g stroke={COLOR_MARCA.bloqueado} strokeWidth={6} strokeLinecap="round">
          <path d={`M${-g.w * 0.34} ${-g.h * 0.38}L${g.w * 0.34} ${g.h * 0.38}`} />
          <path d={`M${g.w * 0.34} ${-g.h * 0.38}L${-g.w * 0.34} ${g.h * 0.38}`} />
        </g>
      )}
      <text
        y={ySigla}
        textAnchor="middle"
        fontSize={texto * 0.82}
        fontWeight={700}
        className={nf.tSigla}
        strokeWidth={4}
        opacity={atenuado ? 0.5 : 1}
      >
        {tr.sigla}
      </text>
    </g>
  );
});

/** Rótulo de la referencia: rectángulo de color sólido con texto blanco; con
 *  `punta`, banderita con punta a la derecha. Ancho estimado para Outfit. */
export function Etiqueta({ x, y, texto, tam, color, ancla = 'start', punta = false }: {
  x: number; y: number; texto: string; tam: number; color: string; ancla?: 'start' | 'middle' | 'end'; punta?: boolean;
}) {
  const pad = tam * 0.5;
  const w = [...texto].length * tam * 0.55 + pad * 2;
  const h = tam * 1.5;
  const pw = punta ? h * 0.34 : 0;
  const x0 = ancla === 'start' ? x : ancla === 'end' ? x - w - pw : x - (w + pw) / 2;
  return (
    <g pointerEvents="none">
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={tam * 0.14} fill={color} />
      {punta && <path d={`M${x0 + w - 0.5} ${y - h / 2}l${pw} ${h / 2}l${-pw} ${h / 2}z`} fill={color} />}
      <text x={x0 + w / 2} y={y} dy="0.36em" textAnchor="middle" fontSize={tam} fontWeight={700} fill="#ffffff" className={nf.tEtiqueta}>
        {texto}
      </text>
    </g>
  );
}

/** Mini glifo para la leyenda de formas de la barra lateral. */
export function MiniGlifo({ m }: { m: Mecanismo }) {
  return (
    <svg width="34" height="26" viewBox="-20 -14 40 30" aria-hidden>
      <g transform={m === 'receptor' ? 'rotate(180)' : undefined}>
        <Silueta m={m} w={30} h={20} color="#9b5cf0" />
      </g>
    </svg>
  );
}
