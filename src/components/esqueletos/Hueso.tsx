import type { CSSProperties } from 'react';
import e from '@/styles/esqueletos.module.css';

/** El bloque gris que ocupa el sitio de un texto, un badge o un ícono. */
export default function Hueso({
  w,
  h,
  r,
  mb,
  className,
  style,
  children,
}: {
  w?: number | string;
  h?: number | string;
  /** Radio; por defecto 8px. 999 para las píldoras, '50%' para los círculos. */
  r?: number | string;
  mb?: number;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={className ? `${e.hueso} ${className}` : e.hueso}
      style={{ width: w, height: h, borderRadius: r, marginBottom: mb, ...style }}
    >
      {children}
    </span>
  );
}

/** Envoltorio común: anuncia la carga al lector de pantalla y apaga el puntero. */
export function Esqueleto({ children }: { children: React.ReactNode }) {
  return (
    <div className={e.raiz} role="status" aria-busy="true" aria-label="Cargando">
      {children}
    </div>
  );
}
