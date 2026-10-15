'use client';
// Laboratorio de Patología «Vías NF-κB y JAK/STAT»: las tres vías de la
// célula de Reed-Sternberg (Küppers, J Clin Invest 2012), animadas paso a
// paso, con las alteraciones del linfoma de Hodgkin clásico y un modo estudio
// de arrastrar. Misma interfaz que «Checkpoints del ciclo celular».

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

// Solo en cliente: URL leída al montar y escena animada con requestAnimationFrame.
const ViasLab = dynamic(() => import('./ViasLab'), {
  ssr: false,
  loading: () => <div className={c.cargando} aria-busy="true" />,
});

export default function ViasNfkbPage() {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="vias-nfkb-jakstat" />
      <ViasLab />
    </div>
  );
}
