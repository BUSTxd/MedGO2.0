import { LabGate } from '@/components/SeccionGate';
import { leerRegiones } from '@/lib/data/atlas-3d/regiones';
import Pagina from './Pagina';

// Server: decide el acceso ANTES de montar la página de cliente (ver SeccionGate).
// `?examen=1` abre directo en el examen práctico (enlace desde la Evaluación 1 del sílabo).
export default async function Page({ searchParams }: { searchParams: Promise<{ region?: string | string[]; examen?: string }> }) {
  const { region, examen } = await searchParams;
  return (
    <LabGate slug="atlas-3d">
      <Pagina regiones={leerRegiones(region)} examen={examen === '1'} />
    </LabGate>
  );
}
