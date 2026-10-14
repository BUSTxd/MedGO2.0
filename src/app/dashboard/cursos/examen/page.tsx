import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import EscenarioExamenes from '@/components/cursos/EscenarioExamenes';

/**
 * El escenario de los exámenes para una cuenta de Cayetano (le llega desde la
 * franja del ENCIB de su rejilla). Quien no es de Cayetano ya lo tiene como
 * portada de Cursos: se le manda allí para no tener la misma página en dos URL.
 */
export default async function ExamenesPage() {
  if (!esDeCayetano(await getUser())) redirect('/dashboard/cursos');
  return <EscenarioExamenes deCayetano />;
}
