'use client';
// La animación de la tarjeta «Llévalo a la práctica»: un glóbulo rojo que se cubre de
// anticuerpos y un macrófago que lo devora, en bucle. Sin voz y con piezas del lab, sin
// datos de ningún capítulo. Con movimiento reducido o la pestaña oculta, se queda quieta.

import { useEffect, useState } from 'react';
import { useMovimientoReducido } from '../lupus/useReproductor';
import { C, En, Hematie, Macrofago, Plaqueta, clamp, lerp, tramo } from './Piezas';
import { HematieIg, PlaquetaIg } from './laminas/Comun';

const CICLO = 7000;
const suave = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function VistaPrevia() {
  const reducido = useMovimientoReducido();
  const [t, setT] = useState(0.5);

  useEffect(() => {
    if (reducido) return;
    let raf = 0, ultimo = 0;
    const tick = (ahora: number) => {
      raf = requestAnimationFrame(tick);
      // 30 fotogramas por segundo sobran para una miniatura.
      if (ahora - ultimo < 33 || document.hidden) return;
      ultimo = ahora;
      setT((ahora % CICLO) / CICLO);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducido]);

  const pega = tramo(t, 0.05, 0.3), va = suave(tramo(t, 0.32, 0.62)), come = suave(tramo(t, 0.62, 0.8));
  const fin = 1 - tramo(t, 0.9, 1);
  const x = lerp(420, 245, va), y = lerp(120, 158, va);
  const flota = Math.sin(t * Math.PI * 2);

  return (
    <svg viewBox="0 0 480 280" width="100%" height="100%" role="img" aria-label="Animación: un macrófago devora un glóbulo rojo marcado con anticuerpos">
      <En x={150} y={150} k={0.68 + 0.012 * come * Math.sin(t * 40)}><Macrofago /></En>
      <En o={(1 - tramo(come, 0.6, 1)) * clamp(fin + come)}>
        <En x={lerp(x, 170, come)} y={lerp(y, 150, come)} k={lerp(0.95, 0.45, come)}>
          {pega > 0 ? <HematieIg n={5} p={pega} /> : <Hematie />}
        </En>
      </En>
      <En x={410} y={225 + 8 * flota}><PlaquetaIg k={0.95} n={3} p={tramo(t, 0.2, 0.5)} /></En>
      <En x={320} y={50 - 6 * flota} o={0.55}><Plaqueta k={0.6} /></En>
      <circle cx={70} cy={45 + 5 * flota} r={9} fill={C.c3b[1]} opacity={0.75} />
    </svg>
  );
}
