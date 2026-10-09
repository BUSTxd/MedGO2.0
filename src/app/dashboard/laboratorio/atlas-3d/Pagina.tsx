'use client';
// Atlas 3D: regiones del cuerpo de BodyParts3D (huesos, músculos, vasos) para
// explorar por sistema y por zona. Las regiones y su vocabulario están en
// `src/lib/data/atlas-3d/regiones.ts`; la descarga, en `src/lib/atlas-3d/`.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import s from '@/styles/atlas3d.module.css';

// Solo en cliente: WebGL y DecompressionStream.
const Visor = dynamic(() => import('./Visor'), {
  ssr: false,
  loading: () => <div className={s.cargando} aria-busy="true">Preparando el visor…</div>,
});

export default function Atlas3DPage({ regiones, examen }: { regiones: string[]; examen: boolean }) {
  return (
    <div className={s.wrapper}>
      <TrackLabVisit labId="atlas-3d" />
      <Visor regiones={regiones} examen={examen} />
    </div>
  );
}
