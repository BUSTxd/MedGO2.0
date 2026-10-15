'use client';
import { createContext, useContext } from 'react';

/**
 * Estado global de MedGO IA en el dashboard. `puedeUsar` es sólo la señal
 * de la interfaz (admin, o la IA ya lanzada): quien decide de verdad es
 * `api/ia/chat`, que comprueba sesión, plan y saldo en el servidor.
 */
export interface IAEstado {
  puedeUsar: boolean;
  /** Panel lateral del dashboard abierto. */
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const IAContext = createContext<IAEstado | null>(null);

export const IAProvider = IAContext.Provider;

/** `null` fuera del dashboard (el visor también se monta en otros sitios). */
export function useIA(): IAEstado | null {
  return useContext(IAContext);
}
