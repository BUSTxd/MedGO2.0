import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import CursosCayetano from '@/components/CursosCayetano';
import EscenarioExamenes from '@/components/cursos/EscenarioExamenes';

/**
 * Cursos depende de quién entra: una cuenta de Cayetano ve sus cursos por
 * tramos, como siempre (`CursosCayetano`, con la franja del ENCIB que lleva a
 * `cursos/examen`); el resto, directamente el escenario de los exámenes.
 */
export default async function CursosPage() {
  const user = await getUser();
  if (esDeCayetano(user)) return <CursosCayetano />;
  return <EscenarioExamenes deCayetano={false} />;
}
