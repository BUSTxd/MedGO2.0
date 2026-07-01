import type { ReactNode } from 'react';

/**
 * Ilustraciones decorativas del header de cada ficha (viewBox 120×104).
 * Monocromáticas: heredan `currentColor` del acento de la tarjeta y usan
 * opacidad para dar volumen. Registradas por clave (campo `ilustracion`).
 */

/** Grupo de personas estilizadas, reutilizado por varios embudos. */
function Personas() {
  const P = [
    { x: 42, y: 17 },
    { x: 60, y: 12 },
    { x: 78, y: 17 },
    { x: 51, y: 25 },
    { x: 69, y: 25 },
  ];
  return (
    <g fill="currentColor">
      {P.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.4" />
          <path d={`M${p.x - 5.2} ${p.y + 11} a5.2 5.2 0 0 1 10.4 0 z`} />
        </g>
      ))}
    </g>
  );
}

function Embudo({ conFiltro }: { conFiltro?: boolean }) {
  return (
    <svg viewBox="0 0 120 104" fill="none" aria-hidden="true">
      <Personas />
      {/* partículas cayendo al embudo */}
      <g fill="currentColor" opacity="0.55">
        <circle cx="48" cy="35" r="1.7" />
        <circle cx="60" cy="37" r="1.7" />
        <circle cx="72" cy="35" r="1.7" />
      </g>
      {/* cuerpo del embudo */}
      <path d="M28 42 L92 42 L67 64 L67 78 L53 78 L53 64 Z" fill="currentColor" opacity="0.9" />
      {/* brillo */}
      <path d="M34 45 L52 45 L44 56 Z" fill="#fff" opacity="0.28" />
      {/* gotas destiladas */}
      <g fill="currentColor">
        <circle cx="60" cy="86" r="3" opacity="0.85" />
        <circle cx="55" cy="94" r="2" opacity="0.6" />
        <circle cx="65" cy="95" r="2" opacity="0.6" />
      </g>
      {conFiltro && (
        <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 60 l3.4 3.4 L28 55" />
          <path d="M92 56 l7 7 M99 56 l-7 7" />
        </g>
      )}
    </svg>
  );
}

function Dados() {
  return (
    <svg viewBox="0 0 120 104" fill="none" aria-hidden="true">
      {/* curva gaussiana de fondo */}
      <path
        d="M8 84 C30 84 34 40 60 40 C86 40 90 84 112 84"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.45"
        fill="none"
      />
      <path d="M60 40 V84" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.4" />
      {/* dado trasero */}
      <g transform="rotate(-12 84 52)">
        <rect x="70" y="38" width="28" height="28" rx="6" fill="currentColor" opacity="0.55" />
        <g fill="#fff" opacity="0.9">
          <circle cx="78" cy="46" r="2.2" />
          <circle cx="90" cy="46" r="2.2" />
          <circle cx="78" cy="58" r="2.2" />
          <circle cx="90" cy="58" r="2.2" />
        </g>
      </g>
      {/* dado frontal */}
      <g transform="rotate(10 46 58)">
        <rect x="30" y="42" width="34" height="34" rx="7" fill="currentColor" opacity="0.92" />
        <g fill="#fff">
          <circle cx="39" cy="51" r="2.6" />
          <circle cx="47" cy="59" r="2.6" />
          <circle cx="55" cy="67" r="2.6" />
        </g>
      </g>
    </svg>
  );
}

const ILUSTRACIONES: Record<string, ReactNode> = {
  embudo: <Embudo />,
  embudoFiltro: <Embudo conFiltro />,
  dados: <Dados />,
};

export default function Ilustracion({ name, className }: { name: string; className?: string }) {
  const contenido = ILUSTRACIONES[name];
  if (!contenido) return null;
  return <div className={className}>{contenido}</div>;
}
