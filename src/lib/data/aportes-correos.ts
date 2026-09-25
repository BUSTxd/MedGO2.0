import 'server-only';
import { COLABORADOR_KEYS, type Colaborador } from './aportes';

/**
 * Correo con el que entra cada colaborador. Es lo que le deja marcar sus propios
 * aportes: sin correo, sus marcas sólo las puede poner el admin.
 *
 * Vive aparte de `COLABORADORES` y con `server-only` a propósito: `aportes.ts`
 * lo importan componentes de cliente (vía `acceso.ts`), y con los correos ahí
 * dentro acababan en el JS público de la landing — una lista de qué cuentas
 * tienen permisos, servida a cualquiera.
 */
const CORREOS: Partial<Record<Colaborador, string>> = {
  bust:     'fernandnoob062.0@gmail.com',
  sofia:    'sofiacolchado12@gmail.com',
  'ufbi-1': 'maria.guzman.z@upch.pe',
  'ufbi-2': 'fiorella.linan@upch.pe',
  tulio:    'tulio.montenegro@upch.pe',
};

/** Índice inverso correo → persona, para saber quién está marcando. */
const POR_EMAIL: ReadonlyMap<string, Colaborador> = new Map(
  COLABORADOR_KEYS.flatMap((key) => {
    const email = CORREOS[key];
    return email ? ([[email.toLowerCase(), key]] as [string, Colaborador][]) : [];
  }),
);

export function colaboradorDeEmail(email: string | null | undefined): Colaborador | null {
  if (!email) return null;
  return POR_EMAIL.get(email.toLowerCase()) ?? null;
}

/** ¿Tiene cuenta con la que marcar sus aportes? */
export function tieneCuenta(key: Colaborador): boolean {
  return !!CORREOS[key];
}

/** Correos del equipo. `admin.ts` los usa para abrir el panel de aportes. */
export const EMAILS_COLABORADORES: readonly string[] = [...POR_EMAIL.keys()];
