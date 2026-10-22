import MarcoLab from '@/components/estudio/MarcoLab';

/** Cada laboratorio (reexportado del dashboard) dentro de la barra y el panel de la interfaz. */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <MarcoLab>{children}</MarcoLab>;
}
