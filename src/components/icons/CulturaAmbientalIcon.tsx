import type { CSSProperties } from 'react';

/**
 * Flor — ícono de Cultura Ambiental y Desarrollo Sostenible.
 *
 * SVG original del usuario (`flower-svgrepo-com.svg`, viewBox 512), con los
 * paths transcritos tal cual. El archivo es monocromo (`fill:#000000`): aquí
 * los pétalos toman el celeste del prop `color` y la base/hojas un celeste más
 * oscuro, para que la flor no se lea como una mancha plana a 30px.
 *
 * El `viewBox` lleva margen añadido a propósito. Al revés que los otros íconos
 * del ciclo básico —que traían aire de sobra y hubo que recortarles el lienzo—
 * esta flor ocupa el alto completo de sus 512, así que a `size={30}` se veía
 * bastante más grande que sus vecinas. El margen la deja al ~87% de la caja,
 * que es el tamaño óptico del resto. Sirve para los dos usos a la vez, sin
 * tener que pasar un `size` distinto en cada sitio.
 *
 * Se usa en dos sitios:
 *   · tarjeta del curso en /dashboard/cursos  →  <CulturaAmbientalIcon />
 *   · cabecera del sílabo                     →  <CulturaAmbientalIcon size={160} className={styles.microPageIcon} />
 */

const DARK = '#2b7fb8';

export default function CulturaAmbientalIcon({
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
      viewBox="-40 -40 592 592"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {/* Pétalos y corola */}
      <path
        fill={color}
        d="M137.542,212.252c-8.77,12.118-14.043,26.836-14.043,42.895c0,40.566,32.858,73.449,73.432,73.449c24.335,0,45.692-11.913,59.06-30.127c13.386,18.214,34.75,30.127,59.052,30.127c40.608,0,73.441-32.883,73.441-73.449c0-16.058-5.274-30.776-14.027-42.895c29.279-9.658,50.513-36.881,50.513-69.385c0-40.566-32.85-73.433-73.433-73.433c-7.774,0-15.137,1.522-22.114,3.718C329.235,32.718,296.493,0,255.991,0c-40.475,0-73.259,32.718-73.416,73.153c-6.976-2.196-14.339-3.718-22.105-3.718c-40.592,0-73.441,32.866-73.441,73.433C87.029,175.371,108.263,202.594,137.542,212.252z M255.991,141.624c21.119,0,38.239,17.104,38.239,38.214c0,21.101-17.12,38.205-38.239,38.205c-21.101,0-38.238-17.104-38.238-38.205C217.754,158.728,234.891,141.624,255.991,141.624z"
      />

      {/* Hojas / base */}
      <path
        fill={DARK}
        d="M373.479,356.452c-48.053,0.33-90.602,23.389-117.61,58.904c-27.469-35.154-70.331-57.637-118.392-57.325c-10.589,0.074-20.905,1.259-30.859,3.439c0,0.856-0.05,1.704-0.041,2.576c0.551,82.251,67.674,148.502,149.942,147.951c82.269-0.552,148.511-67.682,147.96-149.942c-0.009-0.864-0.066-1.72-0.09-2.574C394.417,357.439,384.067,356.386,373.479,356.452z"
      />
    </svg>
  );
}
