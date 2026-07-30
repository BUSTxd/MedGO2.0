import type { CSSProperties } from 'react';

/**
 * Átomo — ícono de Física — Medicina.
 *
 * SVG original del usuario (`molecula_fisica_sin_fondo.svg`), recoloreado a la
 * paleta celeste del sitio. Sin degradados ni ids, para que puedan convivir
 * varios íconos en la misma página sin colisiones.
 *
 * El `viewBox` está recortado al bounding box real del dibujo: en el archivo
 * original (0 0 512 512) el átomo sólo ocupaba 287×260, así que se veía
 * pequeño frente al resto de íconos. Coordenadas de los paths sin tocar.
 *
 * Se usa en dos sitios:
 *   · tarjeta del curso en /dashboard/cursos  →  <FisicaIcon />
 *   · cabecera del sílabo                     →  <FisicaIcon size={160} className={styles.microPageIcon} />
 */

/** Tonos celestes compartidos por los íconos de los cursos del ciclo básico. */
const DARK  = '#2b7fb8';
const LIGHT = '#8fd0f5';
const GLOW  = '#eaf6fe';

export default function FisicaIcon({
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
      viewBox="110 106 300 300"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Órbitas */}
      <ellipse cx="256" cy="256" rx="132" ry="56" stroke={color} strokeWidth="14" />
      <ellipse cx="256" cy="256" rx="132" ry="56" transform="rotate(60 256 256)" stroke={color} strokeWidth="14" />
      <ellipse cx="256" cy="256" rx="132" ry="56" transform="rotate(-60 256 256)" stroke={color} strokeWidth="14" />

      {/* Núcleo */}
      <circle cx="256" cy="256" r="30" fill={DARK} />
      <circle cx="246" cy="246" r="8" fill={GLOW} opacity="0.75" />

      {/* Electrones */}
      <circle cx="388" cy="256" r="16" fill={LIGHT} />
      <circle cx="190" cy="142" r="16" fill={LIGHT} />
      <circle cx="190" cy="370" r="16" fill={LIGHT} />
    </svg>
  );
}
