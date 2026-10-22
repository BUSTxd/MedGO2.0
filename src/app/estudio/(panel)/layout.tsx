import MarcoLab from '@/components/estudio/MarcoLab';

/** Páginas del dashboard que la interfaz sirve en su panel sin ser de ninguna pestaña (Mi cuenta, Aportes, Admin, Modelado). */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <MarcoLab pagina={null}>{children}</MarcoLab>;
}
