import type { CSSProperties } from 'react';

/**
 * Anillo bencénico con cadena lateral — ícono de Química Orgánica.
 *
 * SVG original del usuario (`quimica_organica_simple.svg`), recoloreado a la
 * paleta celeste del sitio.
 *
 * El `viewBox` está recortado al bounding box real del dibujo: en el archivo
 * original (0 0 512 512) el anillo con su cadena sólo ocupaba 328×252, así que
 * se veía pequeño frente al resto de íconos. Coordenadas de los paths sin tocar.
 *
 * Se usa en dos sitios:
 *   · tarjeta del curso en /dashboard/cursos  →  <QuimicaOrganicaIcon />
 *   · cabecera del sílabo                     →  <QuimicaOrganicaIcon size={160} className={styles.microPageIcon} />
 */

const DARK  = '#2b7fb8';
const LIGHT = '#8fd0f5';

export default function QuimicaOrganicaIcon({
  size = 22,
  color = '#3b9edd',
  className,
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="138 58 340 340"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Anillo hexagonal */}
      <path d="M256 116L354 172V284L256 340L158 284V172L256 116Z" stroke={color} strokeWidth="18" strokeLinejoin="round" />

      {/* Dobles enlaces internos estilizados */}
      <path d="M242 145L323 191" stroke={LIGHT} strokeWidth="10" strokeLinecap="round" />
      <path d="M323 265L242 311" stroke={LIGHT} strokeWidth="10" strokeLinecap="round" />
      <path d="M189 265L189 191" stroke={LIGHT} strokeWidth="10" strokeLinecap="round" />

      {/* Cadena lateral */}
      <path d="M354 228H416" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M416 228L458 190" stroke={color} strokeWidth="18" strokeLinecap="round" />
      <path d="M416 228L458 266" stroke={color} strokeWidth="18" strokeLinecap="round" />

      {/* Átomos */}
      <circle cx="256" cy="116" r="14" fill={DARK} />
      <circle cx="354" cy="172" r="14" fill={DARK} />
      <circle cx="354" cy="284" r="14" fill={DARK} />
      <circle cx="256" cy="340" r="14" fill={DARK} />
      <circle cx="158" cy="284" r="14" fill={DARK} />
      <circle cx="158" cy="172" r="14" fill={DARK} />

      <circle cx="416" cy="228" r="14" fill={DARK} />
      <circle cx="458" cy="190" r="14" fill={LIGHT} />
      <circle cx="458" cy="266" r="14" fill={LIGHT} />
    </svg>
  );
}
