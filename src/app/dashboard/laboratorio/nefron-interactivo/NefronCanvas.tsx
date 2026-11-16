'use client';
// Lienzo único del nefrón con zoom continuo (modo avanzado). Un solo <svg> con un
// grupo "world" cuyo transform de cámara (atributo SVG translate+scale, animado por
// transición CSS) vuela del nefrón completo a un segmento y, más adentro, a una
// célula con sus transportadores y los iones moviéndose en tiempo real. El usuario
// también puede hacer zoom libre con la rueda y desplazarse arrastrando.

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { SegmentDef, SegmentId } from './engine/types';
import {
  NEFRON_VIEWBOX,
  CORTICO_MEDULLARY_Y,
  SEGMENT_GEOMS,
  SEGMENT_ORDER,
} from './engine/geometry';
import {
  segmentDetailBox,
  cameraForBox,
  type Box,
  type Camera,
} from './engine/cellLayout';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import { type PhPair } from './engine/simulate';
import styles from '@/styles/nefronInteractivo.module.css';

// Escenas de la bioquímica celular cargadas de forma DIFERIDA: al arrancar la web solo
// entra al bundle la disposición activa; la otra se descarga recién cuando el usuario
// pulsa el switch vertical/horizontal.
const CellSceneHorizontal = lazy(() => import('./CellSceneHorizontal'));
const CellSceneVertical = lazy(() => import('./CellSceneVertical'));

/** Disposición de la vista de bioquímica celular. */
export type CellLayout = 'horizontal' | 'vertical';

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
  /** pH resuelto de luz/sangre (neutro/neutro en estado basal). */
  ph: PhPair;
  /** Disposición de la escena de bioquímica celular (horizontal | vertical). */
  cellLayout: CellLayout;
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

/** Caja de la vista de pared de UNA célula: centrada en el viewBox (encuadre fijo,
 * independiente de dónde esté el segmento, para que no quede descuadrado). */
function cellViewBox(): Box {
  const w = 360, h = 300;
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

        {/* Vista de bioquímica al ENTRAR en una célula. La disposición (horizontal:
            luz arriba/sangre abajo · vertical: luz izquierda/sangre derecha) se carga
            de forma diferida según el switch; el fallback es nulo porque ambas escenas
            son SVG y aparecen en cuanto su chunk termina de descargarse. */}
        {diagramMode && seg && selectedCell && (
          <Suspense fallback={null}>
            {p.cellLayout === 'vertical' ? (
              <CellSceneVertical
                seg={seg}
                cell={selectedCell}
                box={cellViewBox()}
                ph={p.ph}
                affected={p.affected}
                affectedTag={p.affectedTag}
                onToggleTransporter={p.onToggleTransporter}
                onFocusCell={p.onSelectCell}
                onExit={p.onExit}
              />
            ) : (
              <CellSceneHorizontal
                seg={seg}
                cell={selectedCell}
                box={cellViewBox()}
                ph={p.ph}
                affected={p.affected}
                affectedTag={p.affectedTag}
                onToggleTransporter={p.onToggleTransporter}
                onFocusCell={p.onSelectCell}
                onExit={p.onExit}
              />
            )}
          </Suspense>
        )}
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
