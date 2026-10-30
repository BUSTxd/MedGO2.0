'use client';
// Laboratorio de Patología «Lupus eritematoso sistémico»: 12 capítulos narrados
// (la voz es el reloj de la animación), del núcleo propio que queda a la vista
// al riñón, el diagnóstico y el tratamiento. Interfaz de «Hipersensibilidad».

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/lupus/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from './Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const LupusLab = dynamic(() => import('./LupusLab'), {
  ssr: false,
  loading: () => <Rueda />,
});

export default function LupusPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="lupus" />
      <LupusLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
