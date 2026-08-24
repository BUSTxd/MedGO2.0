'use client';

import dynamic from 'next/dynamic';
import type { SimId } from '@/lib/data/fisica-modulos/types';

/**
 * Registro de simulaciones del laboratorio de Física.
 *
 * Cada una se carga sólo cuando el alumno llega a su tema: son diecisiete
 * escenas con su propio bucle de rAF, y montarlas de entrada dejaría diecisiete
 * canvas invisibles dibujando a la vez. `ssr: false` porque todas tocan
 * `getComputedStyle` y `ResizeObserver` en el montaje.
 *
 * El tipo `Record<SimId, …>` obliga a que una clave nueva de `SimId` traiga su
 * componente: es el mismo cierre que aplica `CATALOGO` a las fórmulas, y entre
 * los dos hacen imposible publicar media simulación.
 */
type PropsSim = { acento: string; preset?: Record<string, number> };

const REGISTRO: Record<SimId, React.ComponentType<PropsSim>> = {
  // C6 · Movimiento periódico y ondas mecánicas
  resorte: dynamic(() => import('./SimResorte'), { ssr: false }),
  pendulo: dynamic(() => import('./SimPendulo'), { ssr: false }),
  ondas:   dynamic(() => import('./SimOndas'),   { ssr: false }),
  sonido:  dynamic(() => import('./SimSonido'),  { ssr: false }),
  // C7 · Temperatura y calor
  termico: dynamic(() => import('./SimTermico'), { ssr: false }),

  // Una por clase del sílabo
  plano:         dynamic(() => import('./SimPlano'),         { ssr: false }), // C1
  colision:      dynamic(() => import('./SimColision'),      { ssr: false }), // C2
  rotacional:    dynamic(() => import('./SimRotacional'),    { ssr: false }), // C3
  palanca:       dynamic(() => import('./SimPalanca'),       { ssr: false }), // C4
  fluidos:       dynamic(() => import('./SimFluidos'),       { ssr: false }), // C5
  gas:           dynamic(() => import('./SimGas'),           { ssr: false }), // C8
  coulomb:       dynamic(() => import('./SimCoulomb'),       { ssr: false }), // C9
  capacitor:     dynamic(() => import('./SimCapacitor'),     { ssr: false }), // C10
  circuito:      dynamic(() => import('./SimCircuito'),      { ssr: false }), // C11
  magnetico:     dynamic(() => import('./SimMagnetico'),     { ssr: false }), // C12
  lente:         dynamic(() => import('./SimLente'),         { ssr: false }), // C13
  fotoelectrico: dynamic(() => import('./SimFotoelectrico'), { ssr: false }), // C14
};

export default function Simulacion({
  id,
  acento,
  preset,
}: {
  id: SimId;
  acento: string;
  /** Valores con los que el problema guiado preconfigura la escena. */
  preset?: Record<string, number>;
}) {
  const Comp = REGISTRO[id];
  if (!Comp) return null;
  return <Comp acento={acento} preset={preset} />;
}
