'use client';
// Laboratorio de Patología «Maduración de linfocitos y origen de las
// neoplasias linfoides»: de la célula madre a la plasmática, con la
// recombinación V(D)J, la selección tímica, el centro germinal y el mapa de
// neoplasias. Fondo blanco; interfaz de «Checkpoints del ciclo celular».

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const LinfocitosLab = dynamic(() => import('./LinfocitosLab'), {
  ssr: false,
  loading: () => <div className={c.cargando} aria-busy="true" />,
});

export default function MaduracionLinfocitosPage() {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="maduracion-linfocitos" />
      <LinfocitosLab />
    </div>
  );
}
