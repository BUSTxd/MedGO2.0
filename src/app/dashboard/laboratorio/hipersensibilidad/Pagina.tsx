'use client';
// Laboratorio de Patología «Hipersensibilidad»: los tipos I a IV animados como
// fisiología (la vénula que se abre, el bronquio que se cierra, el complemento
// que perfora, el granuloma que se arma), con las células recortadas de Robbins.
// Interfaz de «Maduración de linfocitos», fondo blanco.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const HipersensibilidadLab = dynamic(() => import('./HipersensibilidadLab'), {
  ssr: false,
  loading: () => <div className={c.cargando} aria-busy="true" />,
});

export default function HipersensibilidadPage() {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="hipersensibilidad" />
      <HipersensibilidadLab />
    </div>
  );
}
