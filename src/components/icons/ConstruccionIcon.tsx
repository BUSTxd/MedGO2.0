import type { CSSProperties } from 'react';

/**
 * Excavadora — marca un curso que aún se está armando («In built (alpha)»).
 *
 * Transcripción exacta de `excavadora_construccion_simple.svg` (referencia del
 * usuario): mismos paths, mismas coordenadas, mismo `stroke-width` y mismos
 * remates. Lo único que cambia es el `stroke`, que pasa de `#111111` fijo a
 * `currentColor`, para que el contenedor decida el color en claro y oscuro sin
 * duplicar el dibujo.
 *
 * El `viewBox` SÍ cambia, y no es cosmético. El original es `0 0 512 512`, pero
 * el dibujo vive en x 82→458 e y 153→448: descentrado y colgando hacia abajo.
 * Centrar esa caja centra el lienzo, no la excavadora, que quedaba pegada al
 * borde inferior del panel. Aquí el lienzo va recortado a su bounding box real
 * —los extremos de arriba más los 9px que sobresale el trazo de 18— con 6 de
 * margen: `67 138 406 325`. De paso deja de ser cuadrado (406×325), así que a
 * un ancho dado ocupa un 20% menos de alto y cabe dentro de la tarjeta.
 *
 * No va dentro de la tarjeta en reposo: aparece sólo al pasar el cursor,
 * grande y centrada sobre el panel (`.qAlphaArt` en `cursos.module.css`).
 */
export default function ConstruccionIcon({
  size = 160,
  className,
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={(size * 325) / 406}
      viewBox="67 138 406 325"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Orugas */}
        <rect x="82" y="374" width="254" height="74" rx="37" />
        <line x1="128" y1="411" x2="290" y2="411" />

        {/* Base */}
        <path d="M128 374h170l-20-60H153z" />

        {/* Cabina */}
        <path d="M165 314v-111h93l54 111z" />
        <path d="M195 203v111" />
        <path d="M204 232h44l30 64h-74z" />

        {/* Brazo */}
        <path d="M258 224l84-71 44 29-74 118" />
        <path d="M386 182l44 74" />

        {/* Cazo */}
        <path d="M430 256l28 5-9 68-72 16 26-40z" />
      </g>
    </svg>
  );
}
