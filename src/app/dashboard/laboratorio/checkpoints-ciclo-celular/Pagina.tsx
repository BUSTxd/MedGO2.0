'use client';
// Laboratorio de Patología «Checkpoints del ciclo celular»: el anillo del
// ciclo con sus cinco puntos de control; cada uno abre la vía molecular en
// modo explorar, aprender o prueba. Sin cabecera del dashboard: se entra
// directo al anillo, y la vuelta al laboratorio vive en su esquina.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import s from '@/styles/cicloCelular.module.css';

// Solo en cliente: progreso en localStorage, URL leída al montar y escena
// animada con requestAnimationFrame.
const CicloLab = dynamic(() => import('./CicloLab'), {
  ssr: false,
  loading: () => <div className={s.cargando} aria-busy="true" />,
});

export default function CheckpointsCicloCelularPage() {
  return (
    <div className={s.wrapper}>
      <TrackLabVisit labId="checkpoints-ciclo-celular" />
      <CicloLab />
    </div>
  );
}
