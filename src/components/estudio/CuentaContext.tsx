'use client';
import { createContext, useContext } from 'react';

/** Lo que el menú del avatar necesita saber de la cuenta (lo resuelve el servidor). */
export interface CuentaEstudio {
  nombre: string;
  correo: string;
  /** «Facultad · mensual», «Gratuito», «Acceso total»… */
  planLabel: string;
  planActivo: boolean;
  isAdmin: boolean;
  verAportes: boolean;
}

const VACIA: CuentaEstudio = { nombre: 'Tu cuenta', correo: '', planLabel: 'Gratuito', planActivo: false, isAdmin: false, verAportes: false };
const Contexto = createContext<CuentaEstudio>(VACIA);

export const CuentaProvider = Contexto.Provider;
export const useCuenta = () => useContext(Contexto);
