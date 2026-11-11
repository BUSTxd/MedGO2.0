'use client';
// Laboratorio de Patología «Infecciones bacterianas por gramnegativas» (clase AI18):
// 10 capítulos narrados, de la barrera intestinal sana a la resistencia antimicrobiana. La voz es
// el reloj de la animación, con el mismo motor y el mismo reproductor de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/gramnegativas/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const GramnegativasLab = dynamic(() => import('./GramnegativasLab'), { ssr: false, loading: () => <Rueda /> });

export default function GramnegativasPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="gramnegativas" />
      <GramnegativasLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
