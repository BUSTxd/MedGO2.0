import type { CSSProperties } from 'react';

/**
 * Globo con tres personas — ícono de Ciencias Sociales en el Contexto Actual.
 *
 * SVG original del usuario (`ciencias_sociales.svg`), recoloreado a la paleta
 * celeste del sitio. El degradado del globo se sustituyó por un tono plano
 * para no necesitar `<defs>` con ids (que colisionarían al renderizar varios
 * íconos en la misma página). Las tres figuras conservan tonos distintos
 * —dentro del mismo celeste— para seguir distinguiéndose.
 *
 * El `viewBox` está recortado al bounding box real del dibujo: en el archivo
 * original (0 0 512 512) el grupo sólo ocupaba 396×337 y además quedaba
 * descentrado hacia abajo. Coordenadas de los paths sin tocar.
 *
 * Se usa en dos sitios:
 *   · tarjeta del curso en /dashboard/cursos  →  <CienciasSocialesIcon />
 *   · cabecera del sílabo                     →  <CienciasSocialesIcon size={160} className={styles.microPageIcon} />
 */

const DARK   = '#2b7fb8';
const MEDIUM = '#5cb3e6';
const LIGHT  = '#8fd0f5';
const GLOW   = '#eaf6fe';

export default function CienciasSocialesIcon({
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
      viewBox="52 90 408 408"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Globo central */}
      <circle cx="256" cy="224" r="92" fill={LIGHT} />
      <circle cx="256" cy="224" r="92" stroke={DARK} strokeWidth="14" />
      <path d="M164 224H348" stroke={GLOW} strokeWidth="12" strokeLinecap="round" />
      <path d="M256 132C226 158 210 190 210 224C210 258 226 290 256 316" stroke={GLOW} strokeWidth="12" strokeLinecap="round" />
      <path d="M256 132C286 158 302 190 302 224C302 258 286 290 256 316" stroke={GLOW} strokeWidth="12" strokeLinecap="round" />
      <path d="M181 174C204 188 229 194 256 194C283 194 308 188 331 174" stroke={GLOW} strokeWidth="10" strokeLinecap="round" />
      <path d="M181 274C204 260 229 254 256 254C283 254 308 260 331 274" stroke={GLOW} strokeWidth="10" strokeLinecap="round" />

      {/* Persona izquierda */}
      <circle cx="132" cy="282" r="38" fill={LIGHT} stroke={DARK} strokeWidth="12" />
      <path d="M64 410C70 350 95 324 132 324C169 324 194 350 200 410" fill={LIGHT} stroke={DARK} strokeWidth="12" strokeLinejoin="round" />

      {/* Persona derecha */}
      <circle cx="380" cy="282" r="38" fill={MEDIUM} stroke={DARK} strokeWidth="12" />
      <path d="M312 410C318 350 343 324 380 324C417 324 442 350 448 410" fill={MEDIUM} stroke={DARK} strokeWidth="12" strokeLinejoin="round" />

      {/* Persona frontal */}
      <circle cx="256" cy="338" r="42" fill={color} stroke={DARK} strokeWidth="12" />
      <path d="M174 456C181 386 211 356 256 356C301 356 331 386 338 456" fill={color} stroke={DARK} strokeWidth="12" strokeLinejoin="round" />

      {/* Conexiones */}
      <path d="M164 304L210 330" stroke={DARK} strokeWidth="12" strokeLinecap="round" />
      <path d="M348 304L302 330" stroke={DARK} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}
