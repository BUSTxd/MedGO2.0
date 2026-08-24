import SeccionGate from '@/components/SeccionGate';

// Los 7 atlas son de cursos de la Facultad; ninguno del ciclo básico. El gate
// va en el layout para cubrir también /histologia/[curso] sin tocar las páginas.
export default function HistologiaLayout({ children }: { children: React.ReactNode }) {
  return <SeccionGate required="interno">{children}</SeccionGate>;
}
