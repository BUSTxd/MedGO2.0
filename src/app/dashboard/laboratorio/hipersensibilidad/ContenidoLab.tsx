'use client';
// El contenido que mandó el servidor (intro, índice, capítulos abiertos y sus
// fichas), al alcance de portada, fichas y tabla sin pasarlo de mano en mano.

import { createContext, useContext } from 'react';
import type { Contenido } from '@/lib/hipersensibilidad/contenido';

export const ContenidoLab = createContext<Contenido | null>(null);

export function useContenido(): Contenido {
  const c = useContext(ContenidoLab);
  if (!c) throw new Error('useContenido fuera de <ContenidoLab.Provider>');
  return c;
}
