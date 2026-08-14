'use client';
import { createContext, useContext } from 'react';

/**
 * El modo oscuro lo gobierna `DashboardWrapper`: es quien pone la clase
 * `dark-mode` en el <body> y quien lo persiste en localStorage('medgo-dark').
 *
 * Este contexto existe para que una vista a pantalla completa —que tapa la
 * sidebar y deja su botón fuera de alcance— pueda ofrecer el mismo interruptor
 * sin reimplementarlo. Duplicar ahí el `classList.toggle` + `setItem` dejaría
 * el estado de `DashboardWrapper` desfasado y la sidebar mostraría el ícono
 * contrario al tema real en cuanto se cerrara la vista.
 */
interface DarkModeValue {
  darkMode: boolean;
  toggleDark: () => void;
}

const DarkModeContext = createContext<DarkModeValue>({
  darkMode: false,
  toggleDark: () => {},
});

export function DarkModeProvider({
  darkMode,
  toggleDark,
  children,
}: DarkModeValue & { children: React.ReactNode }) {
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

/** Tema actual del panel y su interruptor, compartidos con la sidebar. */
export function useDarkMode() {
  return useContext(DarkModeContext);
}
