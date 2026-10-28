import { redirect } from 'next/navigation';
import { SISTEMAS_BASICOS } from '@/lib/data/preclinicos/temario';

/** Preclínicos empieza por los principios generales. */
export default function PreclinicosPage() {
  redirect(`/estudio/preclinicos/${SISTEMAS_BASICOS[0].slug}`);
}
