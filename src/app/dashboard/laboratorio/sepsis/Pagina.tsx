'use client';
// Laboratorio de Patología «Sepsis» (ACP13): 17 capítulos narrados, de dos pacientes a una
// pregunta. La voz es el reloj de la animación, con el mismo motor y el mismo reproductor
// de Lupus.

import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import type { Contenido } from '@/lib/sepsis/contenido';
import type { PlanKey } from '@/lib/plans';
import { Rueda } from '../lupus/Cargando';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

const SepsisLab = dynamic(() => import('./SepsisLab'), { ssr: false, loading: () => <Rueda /> });

export default function SepsisPage({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  return (
    <div className={`${c.wrapper} ${s.wrapper}`}>
      <TrackLabVisit labId="sepsis" />
      <SepsisLab contenido={contenido} plan={plan} prueba={prueba} />
    </div>
  );
}
