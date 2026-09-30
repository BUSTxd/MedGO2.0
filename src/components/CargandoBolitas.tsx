import type { CSSProperties } from 'react';
import s from '@/styles/cargandoBolitas.module.css';

/**
 * Rueda de bolitas para lo que no tiene silueta que enseñar (un mapa, un
 * juego): ahí un esqueleto de tarjetas prometería una página que no llega.
 */
export default function CargandoBolitas({
  color,
  etiqueta = 'Cargando',
}: {
  /** Color de las bolitas; por defecto el azul del dashboard. */
  color?: string;
  etiqueta?: string;
}) {
  return (
    <div className={s.caja} role="status" aria-label={etiqueta}>
      <div className={s.rueda} style={color ? ({ '--bolita': color } as CSSProperties) : undefined}>
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className={s.bolita} style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}
