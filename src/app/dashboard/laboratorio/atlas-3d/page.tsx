import { LabGate } from '@/components/SeccionGate';
import { leerRegiones } from '@/lib/data/atlas-3d/regiones';
import Pagina from './Pagina';

// Server: decide el acceso ANTES de montar la página de cliente (ver SeccionGate).
export default async function Page({ searchParams }: { searchParams: Promise<{ region?: string | string[] }> }) {
  const { region } = await searchParams;
  return (
    <LabGate slug="atlas-3d">
      <Pagina regiones={leerRegiones(region)} />
    </LabGate>
  );
}
