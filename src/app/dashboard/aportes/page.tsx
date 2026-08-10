import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { canVerAportes, isAdminEmail } from '@/lib/admin';
import { getTrackStats, getAportes, getLanzamiento } from '@/lib/aportes-stats';
import {
  getRegistroCursos,
  getRegistroLabs,
  getRegistroHistologia,
} from '@/lib/aportes-registro';
import { leerMarcas } from '@/lib/aportes-marcas-server';
import { COLABORADORES, COLABORADOR_KEYS, colaboradorDeEmail } from '@/lib/data/aportes';
import AportesPanel from '@/components/AportesPanel';
import RegistroAportes from '@/components/RegistroAportes';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Avance y aportes · MedGO',
};

export default async function AportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard/aportes');
  // Datos del acuerdo entre socios: admin y quienes aportan material.
  if (!canVerAportes(user.email)) notFound();

  const marcas = await leerMarcas();

  const personas = COLABORADOR_KEYS.map((key) => ({
    key,
    nombre: COLABORADORES[key].nombre,
    color: COLABORADORES[key].color,
    sinCuenta: !COLABORADORES[key].email,
  }));

  return (
    <AportesPanel
      lanzamiento={getLanzamiento()}
      tracks={getTrackStats()}
      aportes={getAportes(marcas)}
      registro={
        <RegistroAportes
          cursos={getRegistroCursos()}
          labs={getRegistroLabs()}
          histologia={getRegistroHistologia()}
          marcasIniciales={marcas}
          yo={colaboradorDeEmail(user.email)}
          esAdmin={isAdminEmail(user.email)}
          personas={personas}
        />
      }
    />
  );
}
