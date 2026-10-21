import DashboardWrapper from '@/components/DashboardWrapper';
import { prepararSesionApp } from '@/lib/sesion-app';

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await prepararSesionApp();

  return (
    <DashboardWrapper
      planState={s.clientPlan}
      isAdmin={s.isAdmin}
      verAportes={s.verAportes}
      accesoFacultad={s.accesoFacultad}
      presencia={s.presencia}
      buzon={s.buzon}
      canalAdmin={s.canalAdmin}
      iaAbierta={s.iaAbierta}
    >
      {children}
    </DashboardWrapper>
  );
}
