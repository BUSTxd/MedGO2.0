'use client';
import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { PlanProvider, type ClientPlanState } from './PlanProvider';
import { RecentClassesProvider } from './RecentClassesProvider';
import { SidebarStateProvider } from './SidebarStateContext';
import { DarkModeProvider } from './DarkModeContext';
import { EsAdminProvider } from './EsAdminContext';
import CursorCelula from './CursorCelula';
import PaginaVistaTracker from './PaginaVistaTracker';
import { AnunciarPresencia } from './Presencia';
import BuzonUsuario from './BuzonUsuario';
import { IAProvider } from './ia/IAContext';
import BotonIA from './ia/BotonIA';
import PanelIA from './ia/PanelIA';
import { pingRacha } from '@/lib/racha';
import styles from '@/styles/dashboardLayout.module.css';

export default function DashboardWrapper({
  children,
  planState,
  isAdmin = false,
  verAportes = false,
  accesoFacultad = false,
  presencia,
  buzon,
  canalAdmin,
  iaAbierta = false,
}: {
  children: React.ReactNode;
  planState: ClientPlanState;
  isAdmin?: boolean;
  /** Acceso al panel de Aportes sin el resto de permisos de admin. */
  verAportes?: boolean;
  /** Plan de la Facultad: decide el candado de Investigación e Histología. */
  accesoFacultad?: boolean;
  /** Token opaco con el que se anuncia en línea (ver `src/lib/presencia.ts`). */
  presencia?: string;
  /** Mismo token, para el canal de mensajes del equipo (`BuzonUsuario`). */
  buzon?: string;
  /** Sólo el admin: canal de la bandeja, para el contador de la barra lateral. */
  canalAdmin?: string;
  /** MedGO IA ya lanzada para todos (`IA_ABIERTA`); si no, sólo el admin. */
  iaAbierta?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [iaAbierto, setIaAbierto] = useState(false);
  // Al abrir el panel de la IA la sidebar se contrae para dejarle sitio, y al
  // cerrarlo vuelve como estaba (si el alumno la tenía abierta).
  const sidebarAntesDeIA = useRef<boolean | null>(null);
  const abrirIA = useCallback(() => {
    setCollapsed((c) => {
      sidebarAntesDeIA.current = c;
      return true;
    });
    setIaAbierto(true);
  }, []);
  const cerrarIA = useCallback(() => {
    setIaAbierto(false);
    if (sidebarAntesDeIA.current === false) setCollapsed(false);
    sidebarAntesDeIA.current = null;
  }, []);
  const puedeUsarIA = isAdmin || iaAbierta;
  const ia = useMemo(
    () => ({ puedeUsar: puedeUsarIA, abierto: iaAbierto, abrir: abrirIA, cerrar: cerrarIA }),
    [puedeUsarIA, iaAbierto, abrirIA, cerrarIA],
  );
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    pingRacha();
    const saved = localStorage.getItem('medgo-dark');
    if (saved === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    if (window.innerWidth <= 600) {
      setCollapsed(true);
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
      <IAProvider value={ia}>
        {/* useSearchParams exige Suspense o el prerender del dashboard cae a cliente */}
        {!isAdmin && <Suspense fallback={null}><PaginaVistaTracker /></Suspense>}
        {presencia && <AnunciarPresencia token={presencia} />}
        {buzon && <BuzonUsuario token={buzon} />}
        <CursorCelula />
        <RecentClassesProvider>
          {/* data-shell: lo desenfoca la tarjeta de «Tu esfuerzo» (hijo a hijo,
              porque un filter aquí movería la sidebar fija al hacer scroll). */}
          <div className={styles.layout} data-shell>
            <DashboardSidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed((c) => !c)}
              darkMode={darkMode}
              onToggleDark={toggleDark}
              isAdmin={isAdmin}
              verAportes={verAportes}
              accesoFacultad={accesoFacultad}
              canalAdmin={canalAdmin}
            />
            {!collapsed && (
              <div
                className={styles.backdrop}
                onClick={() => setCollapsed(true)}
                aria-hidden="true"
              />
            )}
            <main className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''} ${iaAbierto ? styles.mainConPanel : ''}`}>
              <div className={styles.panel}>
                <SidebarStateProvider collapsed={collapsed}>
                  {/* Las vistas a pantalla completa tapan la sidebar: sin esto
                      su botón de tema queda inalcanzable mientras se lee. */}
                  <DarkModeProvider darkMode={darkMode} toggleDark={toggleDark}>
                    <EsAdminProvider value={isAdmin}>{children}</EsAdminProvider>
                  </DarkModeProvider>
                </SidebarStateProvider>
              </div>
            </main>
          </div>
          <BotonIA />
          <PanelIA modo="flotante" abierto={iaAbierto} puedeUsar={puedeUsarIA} onCerrar={cerrarIA} />
        </RecentClassesProvider>
      </IAProvider>
    </PlanProvider>
  );
}
