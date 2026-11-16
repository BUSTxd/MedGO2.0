'use client';
// Laboratorio de Digestivo «Metabolismo de la bilirrubina» (TBL 2): 12 capítulos
// narrados, del hemo al mapa final de la ictericia. La voz es
// el reloj de la animación, con el mismo motor y el mismo reproductor de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/bilirrubina/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const BilirrubinaLab = dynamic(() => import('./BilirrubinaLab'), { ssr: false, loading: () => <Rueda /> });

export default function BilirrubinaPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="bilirrubina" />
      <BilirrubinaLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
