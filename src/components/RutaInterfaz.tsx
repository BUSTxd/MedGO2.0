'use client';
import { createContext, useContext } from 'react';

/**
 * Los runners (banqueo, tarjetas, solucionario) llevan rutas del dashboard
 * (`backHref`). Montados dentro de la interfaz de estudio, ésta les pasa cómo
 * traducirlas; en el dashboard no hay proveedor y la ruta queda igual.
 *
 * Los `<Link>` ya los reconduce la interfaz al vuelo; esto es para lo que navega
 * sin enlace (`router.push`) o se pinta por portal fuera de su panel.
 */
const Contexto = createContext<((href: string) => string) | null>(null);

export const RutaInterfazProvider = Contexto.Provider;

export function useRutaInterfaz(): (href: string) => string {
  const traducir = useContext(Contexto);
  return traducir ?? sinCambio;
}

const sinCambio = (href: string) => href;
