'use client';
// Lienzo único del nefrón con zoom continuo (modo avanzado). Un solo <svg> con un
// grupo "world" cuyo transform de cámara (atributo SVG translate+scale, animado por
// transición CSS) vuela del nefrón completo a un segmento y, más adentro, a una
// célula con sus transportadores y los iones moviéndose en tiempo real. El usuario
// también puede hacer zoom libre con la rueda y desplazarse arrastrando.

import { useEffect, useRef, useState } from 'react';
import type { CellDef, SegmentDef, SegmentId, TransporterDef } from './engine/types';
import {
  NEFRON_VIEWBOX,
  CORTICO_MEDULLARY_Y,
  SEGMENT_GEOMS,
  SEGMENT_ORDER,
} from './engine/geometry';
import {
  segmentDetailBox,
  transporterSlots,
  cellBands,
  cameraForBox,
  paracellularTransporters,
  paracellularBox,
  type Box,
  type Camera,
} from './engine/cellLayout';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { transporterColor } from '@/lib/data/nefron/transporterColors';
import { flowDirection, type FlowDir } from './engine/simulate';
import styles from '@/styles/nefronInteractivo.module.css';

export type CanvasLevel = 'nephron' | 'segment' | 'cell';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Segmento cuya insignia está más cerca del punto (world) dado. */
function nearestSegment(wx: number, wy: number): SegmentId {
  let best: SegmentId = SEGMENT_ORDER[0];
  let bestD = Infinity;
  for (const id of SEGMENT_ORDER) {
    const b = SEGMENT_GEOMS[id].badge;
    const d = (b.x - wx) ** 2 + (b.y - wy) ** 2;
    if (d < bestD) {
      bestD = d;
      best = id;
    }
  }
  return best;
}

interface Props {
  level: CanvasLevel;
  selectedSeg: SegmentId | null;
  selectedCellId: string | null;
  hoverId: SegmentId | null;
  affected: Set<string>;
  affectedTag: string;
  onSelectSegment: (id: SegmentId) => void;
  onHover: (id: SegmentId | null) => void;
  onSelectCell: (cellId: string) => void;
  onToggleTransporter: (id: string) => void;
  /** Volver al nefrón completo (clic en el fondo, X de la célula, etc.). */
  onExit: () => void;
}

const V = NEFRON_VIEWBOX;
const K_MIN = 1;
const K_MAX = 7;
// Umbrales de zoom semántico: al acercar sobre el nefrón completo, las células
// del segmento bajo el centro de la vista aparecen progresivamente. Rampa ancha
// para que la aparición se sienta continua (no un "salto").
const REVEAL_K0 = 1.45;
const REVEAL_K1 = 2.9;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

// Pared celular: las células se dibujan como una cadena de "cuentas" a lo largo del
// trayecto del túbulo (su contorno), no como un cuadro aparte. Cada cuenta es una
// célula del epitelio; las zonas (p. ej. S1/S2/S3) se reparten a lo largo del path.
const BEAD_SPACING = 19; // separación entre células a lo largo de la pared
const TUBE_W = 24; // grosor de la pared (a través del tubo)

interface Bead {
  x: number;
  y: number;
  angle: number; // grados, tangente al path
  cellIdx: number; // índice de la célula (zona) a la que pertenece
}

/** Muestrea un path del túbulo en una cadena de células (cuentas). */
function sampleWall(pathEl: SVGPathElement, nCells: number): Bead[] {
  const total = pathEl.getTotalLength();
  if (!total) return [];
  const n = Math.max(3, Math.round(total / BEAD_SPACING));
  const beads: Bead[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const len = t * total;
    const pt = pathEl.getPointAtLength(len);
    const a = pathEl.getPointAtLength(Math.max(0, len - 1.2));
    const b = pathEl.getPointAtLength(Math.min(total, len + 1.2));
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const cellIdx = Math.min(nCells - 1, Math.floor(t * nCells));
    beads.push({ x: pt.x, y: pt.y, angle, cellIdx });
  }
  return beads;
}

/** Caja contenedora de una cadena de cuentas (para volar la cámara al segmento). */
function bboxOfBeads(beads: Bead[]): Box {
  const xs = beads.map((b) => b.x);
  const ys = beads.map((b) => b.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  return { x: minX - TUBE_W, y: minY - TUBE_W, w: maxX - minX + 2 * TUBE_W, h: maxY - minY + 2 * TUBE_W };
}

/** Caja del diagrama detallado de UNA célula: centrada en el viewBox (encuadre fijo,
 * independiente de dónde esté el segmento, para que no quede descuadrado). */
function cellViewBox(): Box {
  const w = 320, h = 264;
  return { x: (V.w - w) / 2, y: (V.h - h) / 2, w, h };
}

export default function NefronCanvas(p: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [reduce, setReduce] = useState(false);
  const [cam, setCam] = useState<Camera>({ k: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);
  const drag = useRef<{ x: number; y: number; camX: number; camY: number } | null>(null);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(m.matches);
    const fn = () => setReduce(m.matches);
    m.addEventListener?.('change', fn);
    return () => m.removeEventListener?.('change', fn);
  }, []);

  // Pared celular muestreada de cada path del túbulo (una sola vez tras montar).
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [walls, setWalls] = useState<Record<string, Bead[]>>({});
  const [hoverCellId, setHoverCellId] = useState<string | null>(null);

  useEffect(() => {
    const next: Record<string, Bead[]> = {};
    for (const id of SEGMENT_ORDER) {
      const el = pathRefs.current[id];
      if (el) next[id] = sampleWall(el, SEGMENT_BY_ID[id].celulas.length);
    }
    setWalls(next);
  }, []);

  // Segmento en foco: si estamos navegando (segmento/célula) es el seleccionado;
  // en la vista de nefrón completo, al acercar con la rueda es el que queda bajo
  // el centro de la vista (zoom semántico).
  const centerWx = (V.w / 2 - cam.x) / cam.k;
  const centerWy = (V.h / 2 - cam.y) / cam.k;
  const focusSegId: SegmentId | null =
    p.level !== 'nephron'
      ? p.selectedSeg
      : cam.k > REVEAL_K0
        ? nearestSegment(centerWx, centerWy)
        : null;
  const seg = focusSegId ? SEGMENT_BY_ID[focusSegId] : null;

  // Opacidad con la que emerge la pared celular: total al navegar; rampa suave por
  // zoom en la vista de nefrón (las células aparecen a lo largo del contorno).
  const cellsOpacity =
    p.level !== 'nephron' ? 1 : smoothstep(clamp01((cam.k - REVEAL_K0) / (REVEAL_K1 - REVEAL_K0)));
  const diagramMode = p.level === 'cell';
  const selectedCell = seg && p.selectedCellId ? seg.celulas.find((c) => c.id === p.selectedCellId) ?? null : null;

  // Vuelo de cámara: al segmento → caja de su pared; a la célula → caja del diagrama.
  useEffect(() => {
    if (p.level === 'nephron') {
      setAnimate(true);
      setCam(cameraForBox(null));
      return;
    }
    let target: Box | null = null;
    if (p.level === 'segment' && seg) {
      const w = walls[seg.id];
      target = w && w.length ? bboxOfBeads(w) : segmentDetailBox(seg);
    } else if (p.level === 'cell' && seg) {
      target = cellViewBox();
    }
    setAnimate(true);
    setCam(cameraForBox(target));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.level, p.selectedSeg, p.selectedCellId]);

  // Entrar a una célula desde el revelado por zoom: asegura primero el segmento.
  const enterCell = (segmentId: SegmentId, cellId: string) => {
    if (p.selectedSeg !== segmentId) p.onSelectSegment(segmentId);
    p.onSelectCell(cellId);
  };

  // Zoom con la rueda mediante listener nativo NO pasivo, para poder cancelar el
  // scroll de la página mientras el cursor está sobre el lienzo.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const vbx = ((e.clientX - r.left) / r.width) * V.w;
      const vby = ((e.clientY - r.top) / r.height) * V.h;
      const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      setAnimate(false);
      setCam((prev) => {
        const k2 = Math.min(K_MAX, Math.max(K_MIN, prev.k * factor));
        const wx = (vbx - prev.x) / prev.k;
        const wy = (vby - prev.y) / prev.k;
        return { k: k2, x: vbx - k2 * wx, y: vby - k2 * wy };
      });
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // NO usamos setPointerCapture: en Chromium la captura hace que el evento `click`
    // se dispare sobre la <svg> y no sobre la célula/cuenta, impidiendo entrar a ella.
    drag.current = { x: e.clientX, y: e.clientY, camX: cam.x, camY: cam.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    // Captura el arrastre en una variable local: si endDrag pone drag.current a
    // null antes de que el updater de setCam corra, no se intenta leer de null.
    const d = drag.current;
    if (!d) return;
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const dx = ((e.clientX - d.x) / r.width) * V.w;
    const dy = ((e.clientY - d.y) / r.height) * V.h;
    setAnimate(false);
    setCam((c) => ({ k: c.k, x: d.camX + dx, y: d.camY + dy }));
  };
  const endDrag = () => {
    drag.current = null;
  };

  const worldTransform = `translate(${cam.x} ${cam.y}) scale(${cam.k})`;
  const moved = useRef(false);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${V.w} ${V.h}`}
      className={styles.canvas}
      role="img"
      aria-label="Nefrón interactivo con zoom"
      onPointerDown={(e) => { moved.current = false; onPointerDown(e); }}
      onPointerMove={(e) => {
        // Solo cuenta como arrastre si el puntero se mueve > 5px (evita que un clic
        // con micro-temblor cancele la selección de célula/segmento).
        if (drag.current && Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 5) {
          moved.current = true;
        }
        onPointerMove(e);
      }}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      style={{ touchAction: 'none', cursor: drag.current ? 'grabbing' : 'grab' }}
    >
      <g
        transform={worldTransform}
        style={{ transition: animate && !reduce ? 'transform 0.6s cubic-bezier(0.5,0.1,0.25,1)' : 'none' }}
        onClick={() => { if (!moved.current && p.level !== 'nephron') p.onExit(); }}
      >
        {/* Zonas corteza / médula (muy extendidas para que el color llene todo el
            lienzo a cualquier nivel de zoom; clic en ellas = salir al nefrón). */}
        <rect x={-4000} y={-4000} width={8000} height={4000 + CORTICO_MEDULLARY_Y} className={styles.zoneCortex} />
        <rect
          x={-4000}
          y={CORTICO_MEDULLARY_Y}
          width={8000}
          height={4000}
          className={styles.zoneMedulla}
        />
        <line x1={-4000} y1={CORTICO_MEDULLARY_Y} x2={4000} y2={CORTICO_MEDULLARY_Y} className={styles.corticoLine} />
        {cellsOpacity < 0.4 && !diagramMode && (
          <>
            <text x={12} y={26} className={styles.zoneLabel}>Corteza</text>
            <text x={12} y={CORTICO_MEDULLARY_Y + 22} className={styles.zoneLabel}>Médula</text>
          </>
        )}

        {/* Túbulo: cada segmento es un tubo; el segmento en foco se atenúa a medida
            que su pared celular emerge (las células se dibujan sobre su contorno). */}
        {SEGMENT_ORDER.map((id) => {
          const geom = SEGMENT_GEOMS[id];
          const s = SEGMENT_BY_ID[id];
          const lit = p.selectedSeg === id || p.hoverId === id;
          const isFocus = id === focusSegId;
          const common = {
            onClick: (e: React.MouseEvent) => { e.stopPropagation(); if (!moved.current) p.onSelectSegment(id); },
            onMouseEnter: () => p.onHover(id),
            onMouseLeave: () => p.onHover(null),
            // En modo célula los tubos están ocultos: desactiva sus eventos para que
            // el clic (incluido a través del minimapa) no caiga en un tubo invisible.
            style: { cursor: 'pointer' as const, pointerEvents: (diagramMode ? 'none' : 'auto') as 'none' | 'auto' },
          };
          if (geom.circle) {
            const c = geom.circle;
            const op = diagramMode ? 0 : 1;
            return (
              <g key={id} {...common} style={{ ...common.style, opacity: op, transition: 'opacity 0.25s ease' }}>
                <circle cx={c.cx} cy={c.cy} r={c.r + 8} className={styles.bowman} />
                <circle
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  fill={s.color}
                  opacity={lit ? 0.95 : 0.78}
                  stroke={lit ? s.color : 'transparent'}
                  strokeWidth={3}
                  style={{ filter: lit ? `drop-shadow(0 0 7px ${s.color})` : undefined }}
                />
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
          const tubeOpacity = diagramMode ? 0 : isFocus ? 1 - 0.85 * cellsOpacity : 1;
          return (
            <g key={id} {...common} style={{ ...common.style, opacity: tubeOpacity, transition: 'opacity 0.2s ease' }}>
              <path
                ref={(el) => { pathRefs.current[id] = el; }}
                d={geom.path}
                fill="none"
                stroke={s.color}
                strokeWidth={lit ? 15 : 12}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={lit ? 1 : 0.82}
                style={{ filter: lit ? `drop-shadow(0 0 6px ${s.color})` : undefined, transition: 'stroke-width 0.15s ease' }}
              />
              <path d={geom.path} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={4} strokeLinecap="round" />
              {cellsOpacity < 0.05 && !diagramMode && (
                <path d={geom.path} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={3} strokeLinecap="round" className={styles.flow} />
              )}
            </g>
          );
        })}

        {/* Pared celular del segmento en foco: las células aparecen sobre el contorno */}
        {!diagramMode && seg && cellsOpacity > 0.02 && walls[seg.id]?.length > 0 && (
          <CellWall
            seg={seg}
            beads={walls[seg.id]}
            opacity={cellsOpacity}
            affected={p.affected}
            hoverCellId={hoverCellId}
            onHoverCell={setHoverCellId}
            onEnter={(cellId) => { if (!moved.current) enterCell(seg.id, cellId); }}
          />
        )}

        {/* Insignias numeradas (se desvanecen al empezar a acercar) */}
        {!diagramMode && cellsOpacity < 0.6 &&
          SEGMENT_ORDER.map((id) => {
            const geom = SEGMENT_GEOMS[id];
            const s = SEGMENT_BY_ID[id];
            const isSel = p.selectedSeg === id;
            return (
              <g
                key={`b-${id}`}
                onClick={(e) => { e.stopPropagation(); if (!moved.current) p.onSelectSegment(id); }}
                onMouseEnter={() => p.onHover(id)}
                onMouseLeave={() => p.onHover(null)}
                style={{ cursor: 'pointer', opacity: clamp01(1 - cellsOpacity / 0.6), transition: 'opacity 0.2s ease' }}
              >
                <circle cx={geom.badge.x} cy={geom.badge.y} r={13} fill="#fff" stroke={s.color} strokeWidth={isSel ? 4 : 2.5} />
                <text x={geom.badge.x} y={geom.badge.y + 4.5} className={styles.badgeText} fill={s.color}>
                  {geom.index ?? geom.marker}
                </text>
              </g>
            );
          })}

        {/* Diagrama detallado al ENTRAR en una célula (paso "ver mejor esa célula") */}
        {diagramMode && seg && selectedCell && (() => {
          const cvBox = cellViewBox();
          const col = { x: cvBox.x + 18, y: cvBox.y + 36, w: cvBox.w - 36, h: cvBox.h - 54 };
          return (
            <g onClick={(e) => e.stopPropagation()}>
              <rect
                x={cvBox.x - 10}
                y={cvBox.y - 8}
                width={cvBox.w + 20}
                height={cvBox.h + 16}
                rx={14}
                className={styles.detailBackdrop}
              />
              <text x={cvBox.x + cvBox.w / 2} y={cvBox.y + 13} className={styles.detailTitle} fill={seg.color} textAnchor="middle">
                {seg.nombre}
              </text>
              <text x={cvBox.x + cvBox.w / 2} y={cvBox.y + 24} className={styles.detailCellName} textAnchor="middle">
                {selectedCell.nombre}
              </text>
              <CellGlyph
                segment={seg}
                cell={selectedCell}
                box={col}
                active
                affected={p.affected}
                affectedTag={p.affectedTag}
                onSelectCell={() => {}}
                onToggleTransporter={p.onToggleTransporter}
              />
              {/* Botón cerrar (X) → vuelve al nefrón */}
              <g
                onClick={(e) => { e.stopPropagation(); p.onExit(); }}
                style={{ cursor: 'pointer' }}
                aria-label="Cerrar"
              >
                <title>Cerrar (volver al nefrón)</title>
                <circle cx={cvBox.x + cvBox.w - 2} cy={cvBox.y + 2} r={7} className={styles.closeBtn} />
                <path
                  d={`M${cvBox.x + cvBox.w - 5},${cvBox.y - 1} l6,6 M${cvBox.x + cvBox.w + 1},${cvBox.y - 1} l-6,6`}
                  className={styles.closeX}
                />
              </g>
            </g>
          );
        })()}
      </g>

      {/* Localizador fijo: en qué parte del nefrón está esta célula (fuera de la cámara) */}
      {diagramMode && seg && <NephronLocator segId={seg.id} color={seg.color} />}
    </svg>
  );
}

// ─────────────────────────── LOCALIZADOR (mini-nefrón fijo) ───────────────────────────

function NephronLocator({ segId, color }: { segId: SegmentId; color: string }) {
  return (
    <g aria-hidden style={{ pointerEvents: 'none' }}>
      <rect x={8} y={8} width={104} height={112} rx={10} className={styles.locatorBg} />
      <text x={60} y={22} className={styles.locatorTitle}>EN EL NEFRÓN</text>
      <g transform="translate(16 28) scale(0.17)">
        {SEGMENT_ORDER.map((id) => {
          const geom = SEGMENT_GEOMS[id];
          const on = id === segId;
          const c = on ? color : '#c3c7d6';
          if (geom.circle) {
            return (
              <circle
                key={id}
                cx={geom.circle.cx}
                cy={geom.circle.cy}
                r={geom.circle.r}
                fill={c}
                opacity={on ? 1 : 0.5}
              />
            );
          }
          return (
            <path
              key={id}
              d={geom.path}
              fill="none"
              stroke={c}
              strokeWidth={on ? 26 : 15}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={on ? 1 : 0.45}
              style={{ filter: on ? `drop-shadow(0 0 10px ${color})` : undefined }}
            />
          );
        })}
      </g>
    </g>
  );
}

// ─────────────────────────── PARED CELULAR (células sobre el contorno) ───────────────────────────

interface CellWallProps {
  seg: SegmentDef;
  beads: Bead[];
  opacity: number;
  affected: Set<string>;
  hoverCellId: string | null;
  onHoverCell: (id: string | null) => void;
  onEnter: (cellId: string) => void;
}

function CellWall({ seg, beads, opacity, affected, hoverCellId, onHoverCell, onEnter }: CellWallProps) {
  const half = BEAD_SPACING * 0.5;
  // ¿Alguna célula de este segmento tiene un transportador afectado? (para resaltarla)
  const cellAffected = (cell: SegmentDef['celulas'][number]) =>
    cell.transportadores.some((t) => affected.has(t));

  return (
    <g style={{ opacity, transition: 'opacity 0.25s ease' }}>
      {beads.map((b, i) => {
        const cell = seg.celulas[b.cellIdx];
        if (!cell) return null;
        const lit = hoverCellId === cell.id;
        const aff = cellAffected(cell);
        return (
          <g
            key={i}
            transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}
            style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onEnter(cell.id); }}
            onMouseEnter={() => onHoverCell(cell.id)}
            onMouseLeave={() => onHoverCell(null)}
          >
            <title>{cell.nombre} — toca para ver sus transportadores</title>
            <rect
              x={-half}
              y={-TUBE_W / 2}
              width={BEAD_SPACING}
              height={TUBE_W}
              rx={4}
              fill={aff ? '#E85B4A' : seg.color}
              fillOpacity={lit ? 0.4 : aff ? 0.3 : 0.22}
              stroke={aff ? '#E85B4A' : seg.color}
              strokeOpacity={0.95}
              strokeWidth={lit ? 1.8 : 1.2}
            />
            {/* Luz del túbulo (línea blanca a lo largo del eje) */}
            <rect x={-half} y={-1.4} width={BEAD_SPACING} height={2.8} fill="#ffffff" opacity={0.5} />
          </g>
        );
      })}

      {/* Rótulo de cada zona/célula (una vez, en su cuenta central). Se desplaza
          PERPENDICULAR a la pared (según el ángulo del tubo), no siempre hacia
          arriba: así cada nombre queda al costado de SU propia célula y no se
          encABALgan en los segmentos verticales (p. ej. el túbulo colector, donde
          antes el rótulo β flotaba arriba, lejos de su célula). */}
      {seg.celulas.map((cell, ci) => {
        const zb = beads.filter((b) => b.cellIdx === ci);
        if (!zb.length) return null;
        const mid = zb[Math.floor(zb.length / 2)];
        const rad = ((mid.angle - 90) * Math.PI) / 180; // normal a la pared
        const nx = Math.cos(rad);
        const ny = Math.sin(rad);
        const dist = TUBE_W / 2 + 7;
        const anchor = nx > 0.4 ? 'start' : nx < -0.4 ? 'end' : 'middle';
        return (
          <text
            key={cell.id}
            x={mid.x + nx * dist}
            y={mid.y + ny * dist}
            textAnchor={anchor}
            dominantBaseline="middle"
            className={styles.wallZoneLabel}
            fill={seg.color}
          >
            {cell.nombre}
          </text>
        );
      })}
    </g>
  );
}

// ─────────────────────────── CÉLULA (plantilla genérica) ───────────────────────────

interface CellGlyphProps {
  segment: SegmentDef;
  cell: CellDef;
  box: Box;
  active: boolean;
  affected: Set<string>;
  affectedTag: string;
  onSelectCell: (id: string) => void;
  onToggleTransporter: (id: string) => void;
}

function CellGlyph({ segment, cell, box, active, affected, affectedTag, onSelectCell, onToggleTransporter }: CellGlyphProps) {
  const bands = cellBands(box);
  const slots = transporterSlots(cell, box);
  const paras = paracellularTransporters(cell);

  return (
    <g>
      {/* Bandas de compartimento */}
      <rect x={bands.lumen.x} y={box.y} width={bands.lumen.w} height={box.h} className={styles.bandLumenSvg} rx={3} />
      <rect x={bands.cito.x} y={box.y} width={bands.cito.w} height={box.h} className={styles.bandCytoSvg} />
      <rect x={bands.inters.x} y={box.y} width={bands.inters.w} height={box.h} className={styles.bandBloodSvg} rx={3} />

      {/* Membranas apical y basolateral */}
      <line x1={bands.apicalX} y1={box.y} x2={bands.apicalX} y2={box.y + box.h} className={styles.membraneSvg} />
      <line x1={bands.basoX} y1={box.y} x2={bands.basoX} y2={box.y + box.h} className={styles.membraneSvg} />

      {/* Marco clicable (zoom a la célula) */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={6}
        fill="transparent"
        stroke={active ? segment.color : 'rgba(120,120,160,0.35)'}
        strokeWidth={active ? 1.6 : 0.8}
        style={{ cursor: 'pointer' }}
        onClick={() => onSelectCell(cell.id)}
      />

      {/* Etiquetas de compartimento */}
      <text x={bands.lumen.x + bands.lumen.w / 2} y={box.y - 3} className={styles.bandTagSvg}>luz</text>
      <text x={bands.inters.x + bands.inters.w / 2} y={box.y - 3} className={styles.bandTagSvg}>sangre</text>

      {/* Reacciones / enzimas dentro del citoplasma (p. ej. anhidrasa carbónica) */}
      {cell.intracelular?.map((rx, i) => {
        const cx = (bands.apicalX + bands.basoX) / 2;
        const total = cell.intracelular!.length;
        const cy = box.y + box.h / 2 + (i - (total - 1) / 2) * 18;
        return (
          <g key={`rx-${i}`}>
            <text x={cx} y={cy} className={styles.rxText}>{rx.texto}</text>
            {rx.enzima && <text x={cx} y={cy + 6.5} className={styles.rxEnzima}>{rx.enzima}</text>}
          </g>
        );
      })}

      {/* Reacciones en la LUZ tubular (p. ej. anhidrasa carbónica luminal en S1) */}
      {cell.luminal?.map((rx, i) => {
        const cx = bands.lumen.x + bands.lumen.w / 2;
        const total = cell.luminal!.length;
        const cy = box.y + box.h / 2 + (i - (total - 1) / 2) * 14;
        return (
          <g key={`lx-${i}`}>
            <text x={cx} y={cy} className={styles.rxLumen}>{rx.texto}</text>
            {rx.enzima && <text x={cx} y={cy + 5} className={styles.rxLumenEnz}>{rx.enzima}</text>}
          </g>
        );
      })}

      {/* Franja paracelular (claudinas) entre células: Ca²⁺/Mg²⁺ luz → sangre */}
      {paras.length > 0 && (
        <ParacellularBand box={box} transporters={paras} affected={affected} affectedTag={affectedTag} />
      )}

      {/* Transportadores con flechas estáticas y nombres de molécula */}
      {slots.map((slot) => (
        <TransporterGlyph
          key={slot.t.id}
          t={slot.t}
          x={slot.x}
          y={slot.y}
          off={affected.has(slot.t.id)}
          tag={affectedTag}
          onToggle={onToggleTransporter}
        />
      ))}

      {/* Nombre de la célula */}
      <text x={box.x + box.w / 2} y={box.y + box.h + 11} className={styles.cellNameSvg}>
        {cell.nombre}
      </text>
    </g>
  );
}

// ─────────────────────────── FRANJA PARACELULAR (claudinas) ───────────────────────────

function ParacellularBand({
  box,
  transporters,
  affected,
  affectedTag,
}: {
  box: Box;
  transporters: TransporterDef[];
  affected: Set<string>;
  affectedTag: string;
}) {
  const pb = paracellularBox(box);
  const cy = pb.y + pb.h / 2;
  // Iones (Ca²⁺/Mg²⁺) que cruzan por la vía paracelular (siempre luz → sangre).
  const ions = transporters.flatMap((t) => t.mueve.map((m) => ({ m, off: affected.has(t.id) })));
  const off = transporters.every((t) => affected.has(t.id));
  const x0 = pb.x + 4;
  const x1 = pb.x + pb.w - 4;

  return (
    <g>
      <rect x={pb.x} y={pb.y} width={pb.w} height={pb.h} rx={4} className={styles.paracelRegion} />
      {ions.map(({ m, off: ioff }, i) => {
        const ay = cy + (i - (ions.length - 1) / 2) * 6;
        return (
          <g key={i}>
            <line
              x1={x0}
              y1={ay}
              x2={x1 - 5}
              y2={ay}
              stroke={substanceColor(m.sustancia)}
              className={`${styles.arrowLine} ${ioff ? styles.arrowLineOff : ''}`}
            />
            <ArrowHead x={x1} y={ay} dir="right" color={substanceColor(m.sustancia)} off={ioff} />
            <text
              x={(x0 + x1) / 2}
              y={ay - 2.4}
              className={`${styles.ionLabel} ${ioff ? styles.ionLabelOff : ''}`}
              fill={substanceColor(m.sustancia)}
            >
              {substanceLabel(m.sustancia)}
            </text>
          </g>
        );
      })}
      <text x={pb.x + pb.w / 2} y={pb.y - 1.5} className={styles.claudinLabel}>
        claudina-16/19{off ? ` · ${affectedTag}` : ''}
      </text>
    </g>
  );
}

// ─────────────────────────── TRANSPORTADOR (glifo + flechas estáticas) ───────────────────────────

interface TGProps {
  t: TransporterDef;
  x: number;
  y: number;
  off: boolean;
  tag: string;
  onToggle: (id: string) => void;
}

/** Punta de flecha triangular estática en (x,y) apuntando a izquierda o derecha. */
function ArrowHead({ x, y, dir, color, off }: { x: number; y: number; dir: FlowDir; color: string; off: boolean }) {
  const d =
    dir === 'right'
      ? `M${x},${y} L${x - 3.6},${y - 2.2} L${x - 3.6},${y + 2.2} Z`
      : `M${x},${y} L${x + 3.6},${y - 2.2} L${x + 3.6},${y + 2.2} Z`;
  return <path d={d} fill={color} opacity={off ? 0.25 : 1} />;
}

function TransporterGlyph({ t, x, y, off, tag, onToggle }: TGProps) {
  const ions = t.receptor ? [] : t.mueve;
  const gw = 42;
  const gh = Math.max(15, ions.length * 9);
  const AL = 13; // longitud de la flecha fuera del glifo
  const color = transporterColor(t.id); // color característico del transportador

  return (
    <g style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}>
      <title>{`${t.nombre} (${t.sigla}) — ${t.funcionBreve}${off ? ` · ${tag}` : ''}`}</title>

      {/* Flechas + nombre de molécula, una por ion, a los lados del glifo */}
      {ions.map((m, i) => {
        const dir = flowDirection(t.membrana, m);
        const ay = ions.length === 1 ? y : y - gh / 2 + (i + 0.5) * (gh / ions.length);
        const edge = dir === 'right' ? x + gw / 2 : x - gw / 2;
        const tip = dir === 'right' ? edge + AL : edge - AL;
        const label = `${m.n && m.n > 1 ? `${m.n} ` : ''}${substanceLabel(m.sustancia)}`;
        const color = substanceColor(m.sustancia);
        return (
          <g key={i}>
            <line
              x1={edge}
              y1={ay}
              x2={dir === 'right' ? tip - 4 : tip + 4}
              y2={ay}
              stroke={color}
              className={`${styles.arrowLine} ${off ? styles.arrowLineOff : ''}`}
            />
            <ArrowHead x={tip} y={ay} dir={dir} color={color} off={off} />
            <text
              x={dir === 'right' ? tip + 2 : tip - 2}
              y={ay - 2.4}
              textAnchor={dir === 'right' ? 'start' : 'end'}
              className={`${styles.ionLabel} ${off ? styles.ionLabelOff : ''}`}
              fill={color}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Cuerpo del transportador sobre la membrana (borde = color característico) */}
      <rect
        x={x - gw / 2}
        y={y - gh / 2}
        width={gw}
        height={gh}
        rx={5}
        className={off ? styles.transGlyphOff : styles.transGlyph}
        style={off ? undefined : { stroke: color, strokeWidth: 1.7 }}
      />
      <text x={x} y={y + 2.2} className={styles.transSiglaSvg}>
        {t.sigla.length > 11 ? t.sigla.slice(0, 10) + '…' : t.sigla}
      </text>
      {t.usaAtp && <text x={x + gw / 2 - 4} y={y - gh / 2 + 5} className={styles.atpSvg}>⚡</text>}

      {off && (
        <text x={x} y={y - gh / 2 - 3} className={styles.offTagSvg}>
          {tag}
        </text>
      )}
    </g>
  );
}
