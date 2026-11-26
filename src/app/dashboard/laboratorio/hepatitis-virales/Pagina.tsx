'use client';
// Laboratorio de Patología «Hepatitis virales» (ACP15): 23 capítulos narrados, de dos pacientes a un
// órgano. La voz es el reloj de la animación, con el mismo motor y el mismo reproductor
// de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/hepatitis-virales/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const HepatitisLab = dynamic(() => import('./HepatitisLab'), { ssr: false, loading: () => <Rueda /> });

export default function HepatitisPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="hepatitis-virales" />
      <HepatitisLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
