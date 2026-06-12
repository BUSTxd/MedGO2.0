// VISTA DE PARED CELULAR — disposición HORIZONTAL (bandas horizontales):
// Luz arriba · membrana apical · células pegadas (foco + vecinas) con claudinas en las
// costuras · membrana basolateral · sangre abajo. Glifos con FORMA por mecanismo, flechas
// verticales, reacciones luminal/citosólica y gauges de pH en luz y sangre.
// Se carga de forma diferida (lazy) desde NefronCanvas: solo entra al bundle cuando el
// usuario está en esta disposición.

import type { CellDef, Mechanism, PhDir, SegmentDef, SegmentId, TransporterDef } from './engine/types';
import { paracellularTransporters, type Box } from './engine/cellLayout';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { transporterColor } from '@/lib/data/nefron/transporterColors';
import { flowDirectionV, transporterMechanism, type VFlow, type PhPair } from './engine/simulate';
import { phLabel } from './engine/phModel';
import styles from '@/styles/nefronInteractivo.module.css';

export interface CellSceneProps {
  seg: SegmentDef;
  cell: CellDef;
  box: Box;
  ph: PhPair;
  affected: Set<string>;
  affectedTag: string;
  onToggleTransporter: (id: string) => void;
  onFocusCell: (cellId: string) => void;
  onExit: () => void;
}

/** Nombre de la claudina/unión estrecha característica del segmento. */
function claudinName(segId: SegmentId): string {
  if (segId === 'tal') return 'claudina-16/19';
  if (segId === 'asa-desc') return 'claudina-2';
  if (segId === 'tcp') return 'claudina-2 (permeable)';
  return 'unión estrecha';
}

export default function CellSceneHorizontal({ seg, cell, box, ph, affected, affectedTag, onToggleTransporter, onFocusCell, onExit }: CellSceneProps) {
  const padX = 16;
  const x0 = box.x + padX;
  const x1 = box.x + box.w - padX;
  const innerW = x1 - x0;

  const titleH = 32;
  const lumenTop = box.y + titleH;
  const lumenH = 44;
  const apicalY = lumenTop + lumenH;
  const bloodBottom = box.y + box.h - 16;
  const bloodH = 44;
  const bloodTop = bloodBottom - bloodH;
  const basoY = bloodTop;
  const cellMidY = (apicalY + basoY) / 2;

  // Columnas: vecina izq · célula en foco (más ancha) · vecina der.
  const cells = seg.celulas;
  const fi = Math.max(0, cells.findIndex((c) => c.id === cell.id));
  const prev = cells.length > 1 ? cells[(fi - 1 + cells.length) % cells.length] : null;
  const next = cells.length > 1 ? cells[(fi + 1) % cells.length] : null;
  const wN = innerW * 0.23;
  const wF = innerW - 2 * wN;
  const xFocus0 = x0 + wN;
  const xFocus1 = xFocus0 + wF;

  type Col = { cell: CellDef; x: number; w: number; focus: boolean };
  const cols: Col[] = [
    { cell: prev ?? cell, x: x0, w: wN, focus: false },
    { cell, x: xFocus0, w: wF, focus: true },
    { cell: next ?? cell, x: xFocus1, w: wN, focus: false },
  ];

  // Transportadores de la célula en foco por membrana.
  const focusT = cell.transportadores
    .map((id) => TRANSPORTERS[id])
    .filter((t): t is TransporterDef => !!t);
  const apicalTs = focusT.filter((t) => t.membrana === 'apical');
  const basoTs = focusT.filter((t) => t.membrana === 'basolateral');
  const paras = paracellularTransporters(cell);

  const spread = (arr: TransporterDef[]) => {
    const inset = 28;
    const a = xFocus0 + inset;
    const b = xFocus1 - inset;
    return arr.map((t, i) => ({ t, cx: arr.length === 1 ? (a + b) / 2 : a + (b - a) * (i / (arr.length - 1)) }));
  };
  const apicalSlots = spread(apicalTs);
  const basoSlots = spread(basoTs);

  return (
    <g onClick={(e) => e.stopPropagation()}>
      {/* Panel de fondo */}
      <rect x={box.x - 10} y={box.y - 8} width={box.w + 20} height={box.h + 16} rx={14} className={styles.detailBackdrop} />

      {/* Título: segmento + célula en foco */}
      <text x={box.x + box.w / 2} y={box.y + 13} className={styles.detailTitle} fill={seg.color} textAnchor="middle">
        {seg.nombre}
      </text>
      <text x={box.x + box.w / 2} y={box.y + 25} className={styles.detailCellName} textAnchor="middle">
        {cell.nombre}
      </text>

      {/* Banda de LUZ (con tinte de pH) */}
      <rect x={x0} y={lumenTop} width={innerW} height={lumenH} rx={6} className={styles.wallLumenBand} />
      <rect x={x0} y={lumenTop} width={innerW} height={lumenH} rx={6} className={`${styles.wallPhTint} ${phTintClass(ph.lumen)}`} />
      <text x={x1 - 5} y={lumenTop + 11} textAnchor="end" className={styles.wallBandTag}>LUZ tubular</text>

      {/* Banda de SANGRE (con tinte de pH) */}
      <rect x={x0} y={bloodTop} width={innerW} height={bloodH} rx={6} className={styles.wallBloodBand} />
      <rect x={x0} y={bloodTop} width={innerW} height={bloodH} rx={6} className={`${styles.wallPhTint} ${phTintClass(ph.sangre)}`} />
      <text x={x1 - 5} y={bloodBottom - 4} textAnchor="end" className={styles.wallBandTag}>SANGRE / intersticio</text>

      {/* Cuerpos celulares (foco + vecinas), pegados entre sí. Las vecinas no llevan
          rótulo (solo el tooltip): la bioquímica que se estudia es la de la célula en foco. */}
      {cols.map((col, ci) => {
        const isClickableNeighbor = !col.focus && col.cell.id !== cell.id;
        return (
          <g
            key={`col-${ci}-${col.cell.id}`}
            style={{ cursor: isClickableNeighbor ? 'pointer' : 'default' }}
            onClick={isClickableNeighbor ? (e) => { e.stopPropagation(); onFocusCell(col.cell.id); } : undefined}
          >
            <title>{col.focus ? col.cell.nombre : `${col.cell.nombre} — toca para enfocarla`}</title>
            <rect
              x={col.x}
              y={apicalY}
              width={col.w}
              height={basoY - apicalY}
              className={col.focus ? styles.wallCellFocus : styles.wallCellNeighbor}
            />
            {/* Núcleo */}
            <ellipse cx={col.x + col.w / 2} cy={col.focus ? basoY - 18 : cellMidY} rx={col.focus ? 11 : 7} ry={col.focus ? 8 : 6} className={styles.wallNucleus} />
          </g>
        );
      })}

      {/* Membranas apical y basolateral de la célula en foco */}
      <line x1={xFocus0} y1={apicalY} x2={xFocus1} y2={apicalY} className={styles.wallMembrane} />
      <line x1={xFocus0} y1={basoY} x2={xFocus1} y2={basoY} className={styles.wallMembrane} />
      <text x={xFocus0 + 2} y={apicalY - 3} className={styles.wallMembLabel}>apical</text>
      <text x={xFocus0 + 2} y={basoY + 9} className={styles.wallMembLabel}>basolateral</text>

      {/* Borde en cepillo (microvellosidades) si corresponde */}
      {cell.bordeCepillo && <BrushBorder x0={xFocus0 + 3} x1={xFocus1 - 3} y={apicalY} />}

      {/* Claudinas en las costuras entre células (a la altura apical) */}
      <ClaudinSeam x={xFocus0} apicalY={apicalY} />
      <ClaudinSeam x={xFocus1} apicalY={apicalY} />
      <text x={(xFocus0 + xFocus1) / 2} y={apicalY - 13} textAnchor="middle" className={styles.wallClaudinLabel}>
        {claudinName(seg.id)}
      </text>

      {/* Vía paracelular (TAL): Ca²⁺/Mg²⁺ luz → sangre por la costura derecha */}
      {paras.length > 0 && (
        <ParacellularV
          x={xFocus1}
          yTop={lumenTop + lumenH / 2}
          yBot={bloodTop + bloodH / 2}
          transporters={paras}
          affected={affected}
          tag={affectedTag}
        />
      )}

      {/* Reacción luminal (p. ej. HCO₃⁻ → CO₂ en S1), sobre la célula en foco */}
      {cell.luminal?.map((rx, i) => {
        const cx = (xFocus0 + xFocus1) / 2;
        const cy = lumenTop + 16 + i * 15;
        return (
          <g key={`lx-${i}`}>
            <text x={cx} y={cy} textAnchor="middle" className={styles.rxLumen}>{rx.texto}</text>
            {rx.enzima && <text x={cx} y={cy + 9} textAnchor="middle" className={styles.rxLumenEnz}>{rx.enzima}</text>}
          </g>
        );
      })}

      {/* Reacción citosólica (p. ej. CA II), en el centro de la célula en foco */}
      {cell.intracelular?.map((rx, i) => {
        const cx = (xFocus0 + xFocus1) / 2;
        const total = cell.intracelular!.length;
        const cy = cellMidY - 6 + (i - (total - 1) / 2) * 20;
        return (
          <g key={`rx-${i}`}>
            <text x={cx} y={cy} textAnchor="middle" className={styles.rxText}>{rx.texto}</text>
            {rx.enzima && <text x={cx} y={cy + 9} textAnchor="middle" className={styles.rxEnzima}>{rx.enzima}</text>}
          </g>
        );
      })}

      {/* Glifos de transportador en las membranas (forma por mecanismo) */}
      {apicalSlots.map(({ t, cx }) => (
        <TransporterGlyphV key={t.id} t={t} cx={cx} my={apicalY} off={affected.has(t.id)} tag={affectedTag} onToggle={onToggleTransporter} />
      ))}
      {basoSlots.map(({ t, cx }) => (
        <TransporterGlyphV key={t.id} t={t} cx={cx} my={basoY} off={affected.has(t.id)} tag={affectedTag} onToggle={onToggleTransporter} />
      ))}

      {/* Gauges de pH en luz y sangre */}
      <PhGauge x={x0 + 3} y={lumenTop + lumenH / 2} label="pH luz" dir={ph.lumen} />
      <PhGauge x={x0 + 3} y={bloodTop + bloodH / 2} label="pH sangre" dir={ph.sangre} />

      {/* Botón cerrar (X) → vuelve al nefrón */}
      <g onClick={(e) => { e.stopPropagation(); onExit(); }} style={{ cursor: 'pointer' }} aria-label="Cerrar">
        <title>Cerrar (volver al nefrón)</title>
        <circle cx={box.x + box.w - 2} cy={box.y + 2} r={7} className={styles.closeBtn} />
        <path d={`M${box.x + box.w - 5},${box.y - 1} l6,6 M${box.x + box.w + 1},${box.y - 1} l-6,6`} className={styles.closeX} />
      </g>
    </g>
  );
}

/** Clase de tinte de pH para la banda (rojo ácido / azul básico / sin tinte). */
function phTintClass(dir: PhDir): string {
  if (dir === 'acido') return styles.wallPhAcido;
  if (dir === 'basico') return styles.wallPhBasico;
  return styles.wallPhNeutro;
}

/** Borde en cepillo: microvellosidades como pequeños picos en la membrana apical. */
function BrushBorder({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const n = Math.max(4, Math.floor((x1 - x0) / 8));
  const step = (x1 - x0) / n;
  const teeth: string[] = [];
  for (let i = 0; i < n; i++) {
    const xa = x0 + i * step;
    teeth.push(`M${xa},${y} L${xa + step / 2},${y - 6} L${xa + step},${y}`);
  }
  return <path d={teeth.join(' ')} fill="none" className={styles.wallBrush} />;
}

/** Nudo de claudina (unión estrecha) en una costura apical. */
function ClaudinSeam({ x, apicalY }: { x: number; apicalY: number }) {
  return (
    <g>
      <line x1={x} y1={apicalY - 9} x2={x} y2={apicalY + 9} className={styles.wallSeam} />
      <circle cx={x} cy={apicalY - 3} r={2.4} className={styles.wallClaudinKnot} />
      <circle cx={x} cy={apicalY + 3} r={2.4} className={styles.wallClaudinKnot} />
    </g>
  );
}

/** Vía paracelular vertical (luz → sangre) por la costura, con sus iones. */
function ParacellularV({
  x, yTop, yBot, transporters, affected, tag,
}: {
  x: number; yTop: number; yBot: number; transporters: TransporterDef[]; affected: Set<string>; tag: string;
}) {
  const ions = transporters.flatMap((t) => t.mueve.map((m) => ({ m, off: affected.has(t.id) })));
  const allOff = transporters.every((t) => affected.has(t.id));
  return (
    <g>
      {ions.map(({ m, off }, i) => {
        const ax = x + (i - (ions.length - 1) / 2) * 7;
        const sc = substanceColor(m.sustancia);
        return (
          <g key={i}>
            <line x1={ax} y1={yTop} x2={ax} y2={yBot - 4} stroke={sc} className={`${styles.arrowLine} ${off ? styles.arrowLineOff : ''}`} strokeDasharray="3 2" />
            <ArrowHeadV x={ax} y={yBot} dir="down" color={sc} off={off} />
            <text x={ax + 4} y={(yTop + yBot) / 2} className={`${styles.ionLabel} ${off ? styles.ionLabelOff : ''}`} fill={sc}>
              {substanceLabel(m.sustancia)}
            </text>
          </g>
        );
      })}
      {allOff && <text x={x} y={yTop - 4} textAnchor="middle" className={styles.wallClaudinLabel}>{tag}</text>}
    </g>
  );
}

/** Indicador de pH (pastilla) en la banda de luz o de sangre. */
function PhGauge({ x, y, label, dir }: { x: number; y: number; label: string; dir: PhDir }) {
  const cls = dir === 'acido' ? styles.phAcido : dir === 'basico' ? styles.phBasico : styles.phNeutro;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-9} width={108} height={18} rx={9} className={`${styles.phPill} ${cls}`} />
      <text x={7} y={3.5} className={styles.phPillText}>{`${label}: ${phLabel(dir)}`}</text>
    </g>
  );
}

// ─────────────────────────── TRANSPORTADOR (glifo con forma por mecanismo) ───────────────────────────

/** Punta de flecha vertical en (x,y) apuntando arriba o abajo. */
function ArrowHeadV({ x, y, dir, color, off }: { x: number; y: number; dir: VFlow; color: string; off: boolean }) {
  const d =
    dir === 'down'
      ? `M${x},${y} L${x - 2.8},${y - 3.8} L${x + 2.8},${y - 3.8} Z`
      : `M${x},${y} L${x - 2.8},${y + 3.8} L${x + 2.8},${y + 3.8} Z`;
  return <path d={d} fill={color} opacity={off ? 0.25 : 1} />;
}

// Media-anchura del cuerpo del glifo: ensanchada para que la SIGLA (nombre de la
// proteína) quepa DENTRO de la figura sin recortarse.
const GW = 20; // media-anchura del cuerpo
const GHH = 11; // media-altura del cuerpo

/** Silueta del transportador según su mecanismo (centrada en el origen). */
function GlyphShape({ mech, off, color, usaAtp }: { mech: Mechanism; off: boolean; color: string; usaAtp?: boolean }) {
  const cls = off ? styles.glyphBodyOff : styles.glyphBody;
  const stroke = off ? undefined : { stroke: color, strokeWidth: 1.8 };
  switch (mech) {
    case 'bomba':
      return (
        <>
          <rect x={-GW} y={-GHH} width={2 * GW} height={2 * GHH} rx={11} className={cls} style={stroke} />
          {usaAtp && <text x={GW - 5.5} y={-GHH + 6.5} className={styles.glyphAtp}>⚡</text>}
        </>
      );
    case 'canal':
      return <path d={`M${-GW},${-GHH} L${GW},${-GHH} L6,0 L${GW},${GHH} L${-GW},${GHH} L-6,0 Z`} className={cls} style={stroke} />;
    case 'facilitado':
      return <ellipse cx={0} cy={0} rx={GW} ry={GHH} className={cls} style={stroke} />;
    case 'receptor':
      return <path d="M0,11 L0,1 M0,1 L-7,-11 M0,1 L7,-11" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />;
    case 'simporte':
      return (
        <>
          <rect x={-GW} y={-GHH} width={2 * GW} height={2 * GHH} rx={4} className={cls} style={stroke} />
          <path d="M-7,3 L-7,-3 M-9,-0.6 L-7,-3 L-5,-0.6 M7,3 L7,-3 M5,-0.6 L7,-3 L9,-0.6" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'antiporte':
      return (
        <>
          <rect x={-GW} y={-GHH} width={2 * GW} height={2 * GHH} rx={4} className={cls} style={stroke} />
          <path d="M-7,-3 L-7,3 M-9,0.6 L-7,3 L-5,0.6 M7,3 L7,-3 M5,-0.6 L7,-3 L9,-0.6" fill="none" stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
}

interface TGProps {
  t: TransporterDef;
  cx: number;
  my: number;
  off: boolean;
  tag: string;
  onToggle: (id: string) => void;
}

function TransporterGlyphV({ t, cx, my, off, tag, onToggle }: TGProps) {
  const mech = transporterMechanism(t);
  const ions = t.receptor ? [] : t.mueve;
  const color = transporterColor(t.id);
  const AL = 15; // longitud de la flecha fuera del cuerpo
  const sigla = t.sigla.length > 12 ? t.sigla.slice(0, 11) + '…' : t.sigla;

  return (
    <g style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}>
      <title>{`${t.nombre} (${t.sigla}) — ${t.funcionBreve}${off ? ` · ${tag}` : ''}`}</title>

      {/* Flechas verticales + nombre de molécula */}
      {ions.map((m, i) => {
        const dir = flowDirectionV(t.membrana, m); // up | down
        const n = ions.length;
        const ax = n === 1 ? cx : cx - 6 + 12 * (i / Math.max(1, n - 1));
        const edge = dir === 'up' ? my - GHH : my + GHH;
        const tip = dir === 'up' ? edge - AL : edge + AL;
        const label = `${m.n && m.n > 1 ? `${m.n} ` : ''}${substanceLabel(m.sustancia)}`;
        const sc = substanceColor(m.sustancia);
        return (
          <g key={i}>
            <line x1={ax} y1={edge} x2={ax} y2={dir === 'up' ? tip + 4 : tip - 4} stroke={sc} className={`${styles.arrowLine} ${off ? styles.arrowLineOff : ''}`} />
            <ArrowHeadV x={ax} y={tip} dir={dir} color={sc} off={off} />
            <text x={ax + 3.5} y={dir === 'up' ? tip + 1 : tip + 1} className={`${styles.ionLabel} ${off ? styles.ionLabelOff : ''}`} fill={sc}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Cuerpo con forma por mecanismo + sigla DENTRO de la figura */}
      <g transform={`translate(${cx} ${my})`}>
        <GlyphShape mech={mech} off={off} color={color} usaAtp={t.usaAtp} />
        {mech !== 'receptor' && <text y={2.8} textAnchor="middle" className={styles.glyphSigla}>{sigla}</text>}
        {off && <text y={-GHH - 5} textAnchor="middle" className={styles.glyphOffTag}>{tag}</text>}
      </g>
    </g>
  );
}
