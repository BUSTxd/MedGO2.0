'use client';
import { Suspense, useEffect, useState } from 'react';
import { PlanProvider, type ClientPlanState } from '@/components/PlanProvider';
import { DarkModeProvider } from '@/components/DarkModeContext';
import { EsAdminProvider } from '@/components/EsAdminContext';
import CursorCelula from '@/components/CursorCelula';
import PaginaVistaTracker from '@/components/PaginaVistaTracker';
import { AnunciarPresencia } from '@/components/Presencia';
import BuzonUsuario from '@/components/BuzonUsuario';
import { pingRacha } from '@/lib/racha';
import { CuentaProvider, type CuentaEstudio } from './CuentaContext';

/**
 * La parte invisible de `DashboardWrapper` (plan, admin, analítica, presencia,
 * buzón, racha y modo oscuro) para la interfaz nueva, que pinta su propia cáscara.
 */
export default function EstudioShell({
  children, planState, isAdmin, presencia, buzon, cuenta,
}: {
  children: React.ReactNode;
  planState: ClientPlanState;
  isAdmin: boolean;
  cuenta: CuentaEstudio;
  presencia?: string;
  buzon?: string;
}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    pingRacha();
    if (localStorage.getItem('medgo-dark') === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.body.classList.toggle('dark-mode', next);
      localStorage.setItem('medgo-dark', String(next));
      return next;
    });
  };

  return (
    <PlanProvider value={planState}>
      {!isAdmin && <Suspense fallback={null}><PaginaVistaTracker /></Suspense>}
      {presencia && <AnunciarPresencia token={presencia} />}
      {buzon && <BuzonUsuario token={buzon} />}
      <CursorCelula />
      <DarkModeProvider darkMode={darkMode} toggleDark={toggleDark}>
        <EsAdminProvider value={isAdmin}>
          <CuentaProvider value={cuenta}>{children}</CuentaProvider>
        </EsAdminProvider>
      </DarkModeProvider>
    </PlanProvider>
  );
}
