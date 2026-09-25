import { LabGate } from '@/components/SeccionGate';
import Pagina from './Pagina';

// Server: decide el acceso ANTES de montar la página de cliente (ver SeccionGate).
export default function Page() {
  return (
    <LabGate slug="eva-3">
      <Pagina />
    </LabGate>
  );
}
