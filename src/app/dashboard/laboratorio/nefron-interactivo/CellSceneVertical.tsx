// VISTA DE PARED CELULAR — disposición VERTICAL (membranas verticales):
// luz a la izquierda · membrana apical · citoplasma · membrana basolateral · sangre a la
// derecha. Recuperada del último commit del proyecto (CellGlyph clásico) y envuelta como
// escena autocontenida para poder alternarla con la disposición horizontal.
// Se carga de forma diferida (lazy): solo entra al bundle cuando el usuario la activa.

import type { CellDef, SegmentDef, TransporterDef } from './engine/types';
import {
  cellBands,
  transporterSlots,
  paracellularTransporters,
  paracellularBox,
  type Box,
} from './engine/cellLayout';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { transporterColor } from '@/lib/data/nefron/transporterColors';
import { flowDirection, type FlowDir } from './engine/simulate';
import styles from '@/styles/nefronInteractivo.module.css';
import type { CellSceneProps } from './CellSceneHorizontal';

export default function CellSceneVertical({ seg, cell, box, affected, affectedTag, onToggleTransporter, onExit }: CellSceneProps) {
  // Caja interior donde se dibuja la célula (deja sitio para título y cierre).
  const col: Box = { x: box.x + 18, y: box.y + 36, w: box.w - 36, h: box.h - 54 };

  return (
    <g onClick={(e) => e.stopPropagation()}>
      <rect x={box.x - 10} y={box.y - 8} width={box.w + 20} height={box.h + 16} rx={14} className={styles.detailBackdrop} />
      <text x={box.x + box.w / 2} y={box.y + 13} className={styles.detailTitle} fill={seg.color} textAnchor="middle">
        {seg.nombre}
      </text>
      <text x={box.x + box.w / 2} y={box.y + 24} className={styles.detailCellName} textAnchor="middle">
        {cell.nombre}
      </text>

      <CellGlyph
        segment={seg}
        cell={cell}
        box={col}
        active
        affected={affected}
        affectedTag={affectedTag}
        onToggleTransporter={onToggleTransporter}
      />

      {/* Botón cerrar (X) → vuelve al nefrón */}
      <g onClick={(e) => { e.stopPropagation(); onExit(); }} style={{ cursor: 'pointer' }} aria-label="Cerrar">
        <title>Cerrar (volver al nefrón)</title>
        <circle cx={box.x + box.w - 2} cy={box.y + 2} r={7} className={styles.closeBtn} />
        <path d={`M${box.x + box.w - 5},${box.y - 1} l6,6 M${box.x + box.w + 1},${box.y - 1} l-6,6`} className={styles.closeX} />
      </g>
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
  onToggleTransporter: (id: string) => void;
}

function CellGlyph({ segment, cell, box, active, affected, affectedTag, onToggleTransporter }: CellGlyphProps) {
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

      {/* Marco de la célula en foco */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={6}
        fill="transparent"
        stroke={active ? segment.color : 'rgba(120,120,160,0.35)'}
        strokeWidth={active ? 1.6 : 0.8}
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
  const gw = 48; // ensanchado para que la sigla quepa dentro
  const gh = Math.max(16, ions.length * 9);
  const AL = 13; // longitud de la flecha fuera del glifo
  const color = transporterColor(t.id);

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
        const sc = substanceColor(m.sustancia);
        return (
          <g key={i}>
            <line
              x1={edge}
              y1={ay}
              x2={dir === 'right' ? tip - 4 : tip + 4}
              y2={ay}
              stroke={sc}
              className={`${styles.arrowLine} ${off ? styles.arrowLineOff : ''}`}
            />
            <ArrowHead x={tip} y={ay} dir={dir} color={sc} off={off} />
            <text
              x={dir === 'right' ? tip + 2 : tip - 2}
              y={ay - 2.4}
              textAnchor={dir === 'right' ? 'start' : 'end'}
              className={`${styles.ionLabel} ${off ? styles.ionLabelOff : ''}`}
              fill={sc}
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
        {t.sigla.length > 13 ? t.sigla.slice(0, 12) + '…' : t.sigla}
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
