'use client';
// Atlas 3D: regiones del cuerpo de BodyParts3D (huesos, músculos, vasos) para
// explorar por sistema y por zona. Las regiones y su vocabulario están en
// `src/lib/data/atlas-3d/regiones.ts`; la descarga, en `src/lib/atlas-3d/`.

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import s from '@/styles/atlas3d.module.css';

// Solo en cliente: WebGL y DecompressionStream.
const Visor = dynamic(() => import('./Visor'), {
  ssr: false,
  loading: () => <div className={s.cargando} aria-busy="true">Preparando el visor…</div>,
});

export default function Atlas3DPage({ regiones, examen, soloExamen = false }: {
  regiones: string[];
  examen: boolean;
  /** Prueba gratis sin plan: solo el examen, sin salida al atlas libre. */
  soloExamen?: boolean;
}) {
  // Un `router.refresh()` (al pagar) trae un arreglo nuevo con las mismas
  // regiones: sin esto el Visor volvería a descargar el modelo.
  const clave = regiones.join(',');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const estables = useMemo(() => regiones, [clave]);
  return (
    <div className={s.wrapper}>
      <TrackLabVisit labId="atlas-3d" />
      <Visor regiones={estables} examen={examen} soloExamen={soloExamen} />
    </div>
  );
}
