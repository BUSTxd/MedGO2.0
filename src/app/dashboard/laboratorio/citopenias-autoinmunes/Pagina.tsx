'use client';
// Laboratorio de Patología «Citopenias autoinmunes» (clase AI17): 10 capítulos narrados
// sobre anemia hemolítica autoinmune y púrpura trombocitopénica inmune. La voz es el
// reloj de la animación, con el mismo motor y el mismo reproductor de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/citopenias/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const CitopeniasLab = dynamic(() => import('./CitopeniasLab'), { ssr: false, loading: () => <Rueda /> });

export default function CitopeniasPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="citopenias-autoinmunes" />
      <CitopeniasLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
