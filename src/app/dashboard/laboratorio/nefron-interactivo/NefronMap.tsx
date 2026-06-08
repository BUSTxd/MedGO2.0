'use client';
// Mapa completo del nefrón en SVG procedural. Cada segmento es clicable; una
// capa de "flujo" (dash animado) sugiere el trayecto del filtrado. No tiene
// estado propio: pinta la selección que recibe.

import type { SegmentId } from './engine/types';
import { NEFRON_VIEWBOX, CORTICO_MEDULLARY_Y, SEGMENT_GEOMS, SEGMENT_ORDER } from './engine/geometry';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import styles from '@/styles/nefronInteractivo.module.css';

interface Props {
  selectedId: SegmentId | null;
  hoverId: SegmentId | null;
  onSelect: (id: SegmentId) => void;
  onHover: (id: SegmentId | null) => void;
}

const V = NEFRON_VIEWBOX;

export default function NefronMap({ selectedId, hoverId, onSelect, onHover }: Props) {
  return (
    <svg
      viewBox={`0 0 ${V.w} ${V.h}`}
      className={styles.map}
      role="img"
      aria-label="Esquema interactivo del nefrón"
    >
      {/* Fondos: corteza arriba, médula abajo */}
      <rect x={0} y={0} width={V.w} height={CORTICO_MEDULLARY_Y} className={styles.zoneCortex} />
      <rect
        x={0}
        y={CORTICO_MEDULLARY_Y}
        width={V.w}
        height={V.h - CORTICO_MEDULLARY_Y}
        className={styles.zoneMedulla}
      />
      <line
        x1={0}
        y1={CORTICO_MEDULLARY_Y}
        x2={V.w}
        y2={CORTICO_MEDULLARY_Y}
        className={styles.corticoLine}
      />
      <text x={12} y={26} className={styles.zoneLabel}>Corteza</text>
      <text x={12} y={CORTICO_MEDULLARY_Y + 22} className={styles.zoneLabel}>Médula</text>

      {/* Segmentos */}
      {SEGMENT_ORDER.map((id) => {
        const geom = SEGMENT_GEOMS[id];
        const seg = SEGMENT_BY_ID[id];
        const isSel = selectedId === id;
        const isHover = hoverId === id;
        const lit = isSel || isHover;
        const common = {
          onClick: () => onSelect(id),
          onMouseEnter: () => onHover(id),
          onMouseLeave: () => onHover(null),
          className: styles.segHit,
          style: { cursor: 'pointer' as const },
        };

        if (geom.circle) {
          const c = geom.circle;
          return (
            <g key={id} {...common}>
              {/* Cápsula de Bowman */}
              <circle cx={c.cx} cy={c.cy} r={c.r + 8} className={styles.bowman} />
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={seg.color}
                opacity={lit ? 0.95 : 0.78}
                stroke={lit ? seg.color : 'transparent'}
                strokeWidth={3}
                style={{ filter: lit ? `drop-shadow(0 0 7px ${seg.color})` : undefined }}
              />
              {/* Glomérulo: espiral simple */}
              <path
                d={`M${c.cx - 16},${c.cy} q8,-12 16,0 q8,12 16,0`}
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={2.4}
                strokeLinecap="round"
              />
            </g>
          );
        }

        return (
          <g key={id} {...common}>
            {/* Trazo base del segmento */}
            <path
              d={geom.path}
              fill="none"
              stroke={seg.color}
              strokeWidth={lit ? 15 : 12}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={lit ? 1 : 0.82}
              style={{ filter: lit ? `drop-shadow(0 0 6px ${seg.color})` : undefined, transition: 'stroke-width 0.15s ease, opacity 0.15s ease' }}
            />
            {/* Lumen claro encima */}
            <path
              d={geom.path}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Flujo animado (dash) */}
            <path
              d={geom.path}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={3}
              strokeLinecap="round"
              className={styles.flow}
            />
          </g>
        );
      })}

      {/* Insignias numeradas (orden del filtrado) */}
      {SEGMENT_ORDER.map((id) => {
        const geom = SEGMENT_GEOMS[id];
        const seg = SEGMENT_BY_ID[id];
        const isSel = selectedId === id;
        return (
          <g
            key={`b-${id}`}
            onClick={() => onSelect(id)}
            onMouseEnter={() => onHover(id)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={geom.badge.x}
              cy={geom.badge.y}
              r={13}
              fill="#fff"
              stroke={seg.color}
              strokeWidth={isSel ? 4 : 2.5}
              style={{ filter: isSel ? `drop-shadow(0 0 6px ${seg.color})` : undefined }}
            />
            <text x={geom.badge.x} y={geom.badge.y + 4.5} className={styles.badgeText} fill={seg.color}>
              {geom.index}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
