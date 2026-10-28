// Imágenes del laboratorio: primero los recortes de Robbins propios
// (`src/lib/data/hipersensibilidad/imagenes.ts`) y, si no, las ilustraciones de
// Servier del laboratorio de linfocitos (NK, linfocitos, anticuerpos…).

import { createContext } from 'react';
import { IMAGENES as PROPIAS, srcPropia } from '@/lib/data/hipersensibilidad/imagenes';
import { IMAGENES as LINFOCITOS, srcImagen as srcLinfocitos } from '@/lib/data/linfocitos/imagenes';

export function medidasImagen(id: string): { w: number; h: number } | null {
  return PROPIAS[id] ?? LINFOCITOS[id] ?? null;
}

export function srcImagen(id: string): string | null {
  return srcPropia(id) ?? srcLinfocitos(id);
}

/** Rutas que sustituyen a las del bucket (id → src). La landing sirve sus tres recortes
 *  desde `public/` y así no pide nada al bucket del laboratorio. */
export const FuentesImagen = createContext<Record<string, string> | null>(null);

/** La ilustración es de Servier (crédito distinto). */
export const esServier = (id: string) => !PROPIAS[id] && !!LINFOCITOS[id];
