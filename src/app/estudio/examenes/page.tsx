import type { Metadata } from 'next';
import { prepararSesionApp } from '@/lib/sesion-app';
import { catalogoExamenes, sesionExamen } from '@/lib/estudio/examenes';
import MarcoLab from '@/components/estudio/MarcoLab';
import ExamenesEstudio from '@/components/estudio/ExamenesEstudio';

export const metadata: Metadata = { title: 'Exámenes · MedGO' };

export default async function ExamenesPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [s, params] = await Promise.all([prepararSesionApp(), searchParams]);
  const catalogo = catalogoExamenes();
  return (
    <MarcoLab pagina="exams">
      <ExamenesEstudio catalogo={catalogo} sesion={sesionExamen(params, catalogo)}
        planState={{ plan: s.planState.plan, isActive: s.planState.isActive, allAccess: s.planState.allAccess }}
        isAuthed={!!s.user} />
    </MarcoLab>
  );
}
