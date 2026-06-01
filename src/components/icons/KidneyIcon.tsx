import type { CSSProperties } from 'react';

/**
 * Riñón rojo — mismo SVG usado en el apartado de cursos (Excretor).
 * Reutilizable: panel del laboratorio y fondo decorativo del minijuego.
 */
export default function KidneyIcon({
  size = 22,
  white = false,
  className,
  style,
}: {
  size?: number;
  /** true = íconos blancos (para fondos de color, ej. labIconBox) */
  white?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const c1 = white ? 'white' : '#b83838';
  const c2 = white ? 'white' : '#d44a4a';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 511.985 511.985"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      <path fill={c1} d="M260.934,163.337l11,80.373c108.325-17.297,81.482,268.275,81.482,268.275h58.437C432.915,82.057,260.934,163.337,260.934,163.337z" />
      <path fill={c2} d="M299.121,224.897c0,0,4.125-8.765,3.719-21.296c0.406-12.53-3.719-21.312-3.719-21.312c61.67-15.562,61.67-203.167-63.857-180.371C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683C360.791,428.081,360.791,240.475,299.121,224.897z" />
      <g style={{ opacity: white ? 0.35 : 0.2 }}>
        <path fill="#FFFFFF" d="M256.607,405.284c-124.575-22.625-136.591-155.34-136.935-201.683c0.344-46.358,12.36-179.058,136.935-201.682c3.203-0.578,6.328-1.016,9.359-1.328c-9.25-1.062-19.468-0.718-30.702,1.328C110.688,24.543,98.689,157.243,98.345,203.601c0.344,46.343,12.343,179.058,136.918,201.683c11.234,2.047,21.453,2.391,30.702,1.328C262.934,406.3,259.809,405.862,256.607,405.284z" />
      </g>
    </svg>
  );
}
