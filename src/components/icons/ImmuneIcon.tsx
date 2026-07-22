import type { CSSProperties } from 'react';

/**
 * Escudo/asterisco amarillo — mismo SVG usado en laboratorio virtual y cursos (Inmunología).
 * Reutilizable: tarjetas de histología.
 */
export default function ImmuneIcon({
  size = 22,
  white = false,
  className,
  style,
}: {
  size?: number;
  /** true = ícono blanco (para fondos de color) */
  white?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const c = white ? 'white' : '#c9a227';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <rect x="114" y="120" width="28" height="110" rx="14" fill={c} />
      <rect x="114" y="30" width="28" height="110" rx="14" transform="rotate(-45 128 120)" fill={c} />
      <rect x="114" y="30" width="28" height="110" rx="14" transform="rotate(45 128 120)" fill={c} />
      <circle cx="128" cy="120" r="8" fill={c} />
    </svg>
  );
}
