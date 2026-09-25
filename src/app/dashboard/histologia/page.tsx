import SeccionGate from '@/components/SeccionGate';
import Pagina from './Pagina';

// Server: decide el acceso ANTES de montar la página de cliente (ver SeccionGate).
export default function Page() {
  return (
    <SeccionGate required="interno">
      <Pagina />
    </SeccionGate>
  );
}
