'use client';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlanProvider, type ClientPlanState } from '@/components/PlanProvider';
import { DarkModeProvider } from '@/components/DarkModeContext';
import { EsAdminProvider } from '@/components/EsAdminContext';
import CursorCelula from '@/components/CursorCelula';
import PaginaVistaTracker from '@/components/PaginaVistaTracker';
import { AnunciarPresencia } from '@/components/Presencia';
import BuzonUsuario from '@/components/BuzonUsuario';
import { AvisoRespuestas, useRespuestasNuevas } from '@/components/MensajesAdmin';
import { pingRacha } from '@/lib/racha';
import { CuentaProvider, type CuentaEstudio } from './CuentaContext';

// La mascota trae la hoja de estilos de la landing: baja aparte, cuando ya se pintó la interfaz.
const Grimi = dynamic(() => import('./Grimi'), { ssr: false });

/**
 * La parte invisible de `DashboardWrapper` (plan, admin, analítica, presencia,
 * buzón, racha, modo oscuro y aviso de respuestas del admin) para la interfaz
 * nueva, que pinta su propia cáscara.
 */
export default function EstudioShell({
  children, planState, isAdmin, presencia, buzon, canalAdmin, cuenta,
}: {
  children: React.ReactNode;
  planState: ClientPlanState;
  isAdmin: boolean;
  cuenta: CuentaEstudio;
  presencia?: string;
  buzon?: string;
  canalAdmin?: string;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  // Las respuestas sin leer del admin: el contador del menú de la cuenta y el aviso flotante.
  const respuestasNuevas = useRespuestasNuevas(canalAdmin);
  const avisoOculto = pathname.startsWith('/estudio/admin');
  const cuentaViva = useMemo(() => ({ ...cuenta, respuestasNuevas: respuestasNuevas ?? 0 }), [cuenta, respuestasNuevas]);

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
      {canalAdmin && <AvisoRespuestas nuevas={respuestasNuevas} ocultar={avisoOculto} href="/estudio/admin#mensajes" />}
      {/* En todas las páginas, laboratorios incluidos (BUST lo quiere siempre a la vista). */}
      <Grimi subir={!!canalAdmin && !!respuestasNuevas && !avisoOculto} sobreBarra={pathname.startsWith('/estudio/examenes')} />

      <CursorCelula />
      <DarkModeProvider darkMode={darkMode} toggleDark={toggleDark}>
        <EsAdminProvider value={isAdmin}>
          <CuentaProvider value={cuentaViva}>{children}</CuentaProvider>
        </EsAdminProvider>
      </DarkModeProvider>
    </PlanProvider>
  );
}
