'use client';
import { createContext, useContext } from 'react';

/**
 * Para que GRIMI ponga cara de hablar mientras suena una voz grabada (la narración de
 * un laboratorio). Módulo aparte de `GrimiIA` a propósito: lo importa el laboratorio,
 * que también vive en `/dashboard`, y no debe arrastrar la IA ni la mascota.
 * Fuera de `/estudio` no hay proveedor y `useGrimiVoz()` da `null`.
 */
export const GrimiVozContext = createContext<((hablando: boolean) => void) | null>(null);

export function useGrimiVoz() {
  return useContext(GrimiVozContext);
}
