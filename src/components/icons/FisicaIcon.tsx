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
 * Se usa en tres sitios:
 *   · tarjeta del curso en /dashboard/cursos  →  <FisicaIcon />
 *   · cabecera del sílabo                     →  <FisicaIcon size={160} className={styles.microPageIcon} />
 *   · panel del laboratorio virtual           →  <FisicaIcon size={26} white />
 */

/** Tonos celestes compartidos por los íconos de los cursos del ciclo básico. */
const DARK  = '#2b7fb8';
const LIGHT = '#8fd0f5';
const GLOW  = '#eaf6fe';

export default function FisicaIcon({
  size = 22,
  color = '#3b9edd',
  white = false,
  className,
  style,
}: {
  size?: number;
  color?: string;
  /** Monocromo para fondos de color (la caja morada de `.labIconBox`), igual
   *  que hace `KidneyIcon`. El celeste se pierde sobre morado. */
  white?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const orbita   = white ? 'white' : color;
  const nucleo   = white ? 'white' : DARK;
  const brillo   = white ? 'rgba(84,69,216,0.30)' : GLOW;
  const electron = white ? 'rgba(255,255,255,0.55)' : LIGHT;

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
      <ellipse cx="256" cy="256" rx="132" ry="56" stroke={orbita} strokeWidth="14" />
      <ellipse cx="256" cy="256" rx="132" ry="56" transform="rotate(60 256 256)" stroke={orbita} strokeWidth="14" />
      <ellipse cx="256" cy="256" rx="132" ry="56" transform="rotate(-60 256 256)" stroke={orbita} strokeWidth="14" />

      {/* Núcleo */}
      <circle cx="256" cy="256" r="30" fill={nucleo} />
      <circle cx="246" cy="246" r="8" fill={brillo} opacity={white ? 1 : 0.75} />

      {/* Electrones */}
      <circle cx="388" cy="256" r="16" fill={electron} />
      <circle cx="190" cy="142" r="16" fill={electron} />
      <circle cx="190" cy="370" r="16" fill={electron} />
    </svg>
  );
}
