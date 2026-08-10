import type { CSSProperties } from 'react';

/**
 * Ícono del curso de Patología — PLACEHOLDER.
 *
 * ⚠️ Falta el SVG definitivo. Mientras tanto dibuja un marco punteado para que
 * el hueco se vea a propósito (tarjeta del curso + cabecera del sílabo) y no
 * parezca un ícono roto.
 *
 * ── PARA PONER EL SVG REAL ────────────────────────────────────────────────
 *  1. Reemplaza SOLO el contenido del bloque «PLACEHOLDER» de abajo por los
 *     `<path>` del SVG, y ajusta el `viewBox` al del archivo original.
 *  2. Usa `fill={color}` (o `stroke={color}`) en cada path para que el ícono
 *     tome el rojo del curso y se pueda reutilizar en otro tamaño/color.
 *  3. No hace falta tocar nada más: `cursos/page.tsx` y el sílabo ya lo montan.
 * ──────────────────────────────────────────────────────────────────────────
 */
export default function PatologiaIcon({
  size = 22,
  color = '#d44a4a',
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
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* ─── PLACEHOLDER — reemplazar por el SVG real ─────────────────────── */}
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        stroke={color}
        strokeWidth="1.6"
        strokeDasharray="3 3"
        opacity="0.55"
      />
      <circle cx="12" cy="12" r="3.2" fill={color} opacity="0.35" />
      {/* ─────────────────────────────────────────────────────────────────── */}
    </svg>
  );
}
