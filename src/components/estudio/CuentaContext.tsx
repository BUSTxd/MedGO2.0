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
  /** Respuestas de alumnos sin leer en la bandeja del admin (lo pone `EstudioShell`, en vivo). */
  respuestasNuevas?: number;
}

const VACIA: CuentaEstudio = { nombre: 'Tu cuenta', correo: '', planLabel: 'Gratuito', planActivo: false, isAdmin: false, verAportes: false };
const Contexto = createContext<CuentaEstudio>(VACIA);

export const CuentaProvider = Contexto.Provider;
export const useCuenta = () => useContext(Contexto);
