'use client';
// Laboratorio de Patología «VIH y sífilis» (ACP14): 21 capítulos narrados, de dos pacientes
// a una misma puerta. La voz es el reloj de la animación, con el mismo motor y el mismo
// reproductor de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/vih-sifilis/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const VihSifilisLab = dynamic(() => import('./VihSifilisLab'), { ssr: false, loading: () => <Rueda /> });

export default function VihSifilisPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="vih-sifilis" />
      <VihSifilisLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
