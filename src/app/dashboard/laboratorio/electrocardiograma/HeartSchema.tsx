'use client';
// Esquema geométrico del corazón (4 cámaras + sistema de conducción) en SVG.
// Recibe el PhaseState del instante actual e ilumina las estructuras + el impulso.
// No tiene lógica temporal propia: solo pinta el estado que recibe.

import type { PhaseState, StructureId, ImpulseColor } from './engine/types';
import { CHAMBERS, NODES, VENTRICLE_CENTER, ECTOPIC, HEART_VIEWBOX } from './engine/heartGeometry';
import styles from '@/styles/electrocardiograma.module.css';

const COLORS: Record<ImpulseColor, string> = {
  yellow: '#FFD23F',
  blue: '#3b9edd',
  green: '#2DC99A',
  orange: '#F59E0B',
  red: '#E85B4A',
  gray: '#8b93a7',
};

interface Props {
  phase: PhaseState | null;
  showEctopic?: boolean;
}

export default function HeartSchema({ phase, showEctopic = false }: Props) {
  const active = phase?.active ?? {};

  // Estilo de una estructura: color + opacidad según su glow (0 si inactiva).
  function glowOf(id: StructureId): { color: string; glow: number } {
    const a = active[id];
    if (a) return { color: COLORS[a.color], glow: a.glow };
    return { color: COLORS.gray, glow: 0 };
  }

  // Trazo de una vía de conducción (línea) iluminada según glow.
  function pathStroke(id: StructureId, base = 'rgba(140,147,167,0.45)') {
    const { color, glow } = glowOf(id);
    return {
      stroke: glow > 0.02 ? color : base,
      strokeWidth: glow > 0.02 ? 4 + glow * 2 : 3,
      opacity: glow > 0.02 ? 0.5 + glow * 0.5 : 1,
      filter: glow > 0.4 ? `drop-shadow(0 0 ${4 + glow * 6}px ${color})` : undefined,
    };
  }

  // Relleno de una cámara iluminada.
  function chamberFill(id: StructureId) {
    const { color, glow } = glowOf(id);
    if (glow <= 0.02) return { fill: 'var(--ekg-chamber)', stroke: 'var(--ekg-chamber-stroke)' };
    return {
      fill: hexToRgba(color, 0.1 + glow * 0.22),
      stroke: hexToRgba(color, 0.5 + glow * 0.4),
    };
  }

  const imps = phase?.impulse ?? [];
  const impColor = COLORS[phase?.color ?? 'yellow'];

  return (
    <svg
      viewBox={`0 0 ${HEART_VIEWBOX.w} ${HEART_VIEWBOX.h}`}
      className={styles.heartSvg}
      role="img"
      aria-label="Esquema del sistema de conducción cardíaca"
    >
      {/* ── Imagen anatómica de fondo (guía para el estudiante) ── */}
      <image
        href="/laboratorio/electrocardiograma/corazon-anatomico.webp"
        x={0}
        y={0}
        width={HEART_VIEWBOX.w}
        height={HEART_VIEWBOX.h}
        preserveAspectRatio="xMidYMid meet"
        className={styles.heartAnatomy}
        aria-hidden="true"
      />

      {/* ── Cámaras ── */}
      {(['ra', 'la', 'rv', 'lv'] as const).map((id) => {
        const c = CHAMBERS[id];
        const st = chamberFill(id);
        return (
          <g key={id}>
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={c.rx}
              fill={st.fill}
              stroke={st.stroke}
              strokeWidth={2}
              style={{ transition: 'fill 0.08s linear, stroke 0.08s linear' }}
            />
            <text
              x={c.x + c.w / 2}
              y={c.y + (id === 'ra' || id === 'la' ? 26 : c.h - 14)}
              className={styles.chamberLabel}
            >
              {c.label}
            </text>
          </g>
        );
      })}

      {/* ── Vías de conducción ── */}
      {/* Aurículas: SA → AV */}
      <polyline
        points={`${NODES.sa.x},${NODES.sa.y} 178,140 ${NODES.av.x},${NODES.av.y}`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...pathStroke('ra')}
      />
      {/* His: AV → His → bifurcación */}
      <polyline
        points={`${NODES.av.x},${NODES.av.y} ${NODES.his.x},${NODES.his.y} ${NODES.fork.x},${NODES.fork.y}`}
        fill="none"
        strokeLinecap="round"
        {...pathStroke('his')}
      />
      {/* Rama derecha */}
      <line
        x1={NODES.fork.x}
        y1={NODES.fork.y}
        x2={NODES.rbbTip.x}
        y2={NODES.rbbTip.y}
        strokeLinecap="round"
        {...pathStroke('rbb')}
      />
      {/* Rama izquierda */}
      <line
        x1={NODES.fork.x}
        y1={NODES.fork.y}
        x2={NODES.lbbTip.x}
        y2={NODES.lbbTip.y}
        strokeLinecap="round"
        {...pathStroke('lbb')}
      />
      {/* Red de Purkinje: ramitas en la base de ambos ventrículos (por lado) */}
      <PurkinjeBranch tip={NODES.rbbTip} dir={-1} {...pathStroke('purkinjeR')} />
      <PurkinjeBranch tip={NODES.lbbTip} dir={1} {...pathStroke('purkinjeL')} />

      {/* ── Nodos ── */}
      <ConductionNode pos={NODES.sa} style={glowOf('sa')} r={11} label="NS" />
      <ConductionNode pos={NODES.av} style={glowOf('av')} r={11} label="AV" />

      {/* Glow de repolarización/despolarización en el centro de los ventrículos */}
      {(['rv', 'lv'] as const).map((id) => {
        const { color, glow } = glowOf(id);
        if (glow <= 0.02) return null;
        const ctr = VENTRICLE_CENTER[id];
        return (
          <circle
            key={`glow-${id}`}
            cx={ctr.x}
            cy={ctr.y}
            r={34}
            fill={hexToRgba(color, glow * 0.28)}
            style={{ filter: `blur(6px)` }}
          />
        );
      })}

      {/* ── Foco ectópico (solo modos de extrasístole) ── */}
      {showEctopic && (
        <circle
          cx={ECTOPIC.x}
          cy={ECTOPIC.y}
          r={9}
          fill={hexToRgba(COLORS.orange, 0.5)}
          stroke={COLORS.orange}
          strokeWidth={2}
        />
      )}

      {/* ── Impulso(s) eléctrico(s) — pueden ser dos al dividirse en las ramas ── */}
      {imps.map((imp, i) => (
        <g key={i}>
          <circle cx={imp.x} cy={imp.y} r={18} fill={hexToRgba(impColor, 0.18)} />
          <circle cx={imp.x} cy={imp.y} r={11} fill={hexToRgba(impColor, 0.35)} />
          <circle
            cx={imp.x}
            cy={imp.y}
            r={6}
            fill={impColor}
            style={{ filter: `drop-shadow(0 0 8px ${impColor})` }}
          />
        </g>
      ))}
    </svg>
  );
}

// Ramita de Purkinje: tres líneas cortas que se abren desde el extremo de la rama.
function PurkinjeBranch({
  tip,
  dir,
  ...stroke
}: { tip: { x: number; y: number }; dir: number } & React.SVGProps<SVGLineElement>) {
  const ends = [
    { x: tip.x + dir * 4, y: tip.y + 18 },
    { x: tip.x + dir * 18, y: tip.y + 14 },
    { x: tip.x - dir * 8, y: tip.y + 16 },
  ];
  return (
    <g>
      {ends.map((e, i) => (
        <line key={i} x1={tip.x} y1={tip.y} x2={e.x} y2={e.y} strokeLinecap="round" {...stroke} />
      ))}
    </g>
  );
}

function ConductionNode({
  pos,
  style,
  r,
  label,
}: {
  pos: { x: number; y: number };
  style: { color: string; glow: number };
  r: number;
  label: string;
}) {
  const lit = style.glow > 0.02;
  return (
    <g>
      {lit && (
        <circle cx={pos.x} cy={pos.y} r={r + 8} fill={hexToRgba(style.color, style.glow * 0.3)} />
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={r}
        fill={lit ? hexToRgba(style.color, 0.85) : 'rgba(140,147,167,0.3)'}
        stroke={lit ? style.color : 'rgba(140,147,167,0.6)'}
        strokeWidth={2}
        style={{
          transition: 'fill 0.08s linear',
          filter: lit && style.glow > 0.4 ? `drop-shadow(0 0 ${4 + style.glow * 5}px ${style.color})` : undefined,
        }}
      />
      <text x={pos.x} y={pos.y + 3.5} className={styles.nodeLabel}>
        {label}
      </text>
    </g>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
