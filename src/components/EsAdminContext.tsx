'use client';
import { createContext, useContext } from 'react';

/**
 * `isAdmin` calculado en el servidor (dashboard/layout.tsx), para que una página
 * de cliente pueda mostrar herramientas de prueba sin importar `lib/admin` (que
 * metería los correos en el bundle). Es señal, no cerradura: lo que protege de
 * verdad sigue en cada ruta de API.
 */
const EsAdminContext = createContext(false);

export const EsAdminProvider = EsAdminContext.Provider;

export function useEsAdmin(): boolean {
  return useContext(EsAdminContext);
}
