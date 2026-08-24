import SeccionGate from '@/components/SeccionGate';

// El curso de Investigación pertenece a la Facultad. Cubre el mapa y los 14
// niveles (/investigacion/[nivel]).
export default function InvestigacionLayout({ children }: { children: React.ReactNode }) {
  return <SeccionGate required="interno">{children}</SeccionGate>;
}
