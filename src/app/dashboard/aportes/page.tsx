import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdminEmail } from '@/lib/admin';
import { getTrackStats, getAportes, getLanzamiento } from '@/lib/aportes-stats';
import AportesPanel from '@/components/AportesPanel';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Avance y aportes · MedGO',
};

export default async function AportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=/dashboard/aportes');
  // Datos sensibles del acuerdo entre socios: solo admin.
  if (!isAdminEmail(user.email)) notFound();

  return (
    <AportesPanel
      lanzamiento={getLanzamiento()}
      tracks={getTrackStats()}
      aportes={getAportes()}
    />
  );
}
