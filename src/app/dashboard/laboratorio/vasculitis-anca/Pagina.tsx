'use client';
// Laboratorio de Patología «Vasculitis de vasos medianos y pequeños y ANCA» (clase ACP 11):
// 10 capítulos narrados, del endotelio sano a la glomerulonefritis pauciinmune. La voz es
// el reloj de la animación, con el mismo motor y el mismo reproductor de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/vasculitis/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const VasculitisLab = dynamic(() => import('./VasculitisLab'), { ssr: false, loading: () => <Rueda /> });

export default function VasculitisPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="vasculitis-anca" />
      <VasculitisLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
