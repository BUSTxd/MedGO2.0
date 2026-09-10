'use client';
// Laboratorio de Hematología «Vías de la coagulación». A propósito sin
// cabecera, kicker ni título: se entra directo al lienzo cuadriculado. La
// vuelta al laboratorio vive en la barra flotante del propio lienzo.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import s from '@/styles/cascadaCoagulacion.module.css';

// Sólo en cliente: posiciones y progreso salen de localStorage y el lienzo
// mide sus nodos al montar.
const CascadaLab = dynamic(() => import('./CascadaLab'), {
  ssr: false,
  loading: () => <div className={`${s.wrapper} ${s.cargando}`} aria-busy="true" />,
});

export default function CascadaCoagulacionPage() {
  return (
    <>
      <TrackLabVisit labId="cascada-coagulacion" />
      <CascadaLab />
    </>
  );
}
