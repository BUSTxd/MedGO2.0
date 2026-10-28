import { redirect } from 'next/navigation';
import { CURSOS_ENCIB } from '@/lib/data/encib/cursos';

/** La ruta ENCIB empieza por la primera materia de la franja. */
export default function EncibPage() {
  redirect(`/estudio/encib/${CURSOS_ENCIB[0].slug}`);
}
