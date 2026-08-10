import { EMAILS_COLABORADORES } from '@/lib/data/aportes';

export const ADMIN_EMAIL = 'fernandnoob062.0@gmail.com';

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}

/**
 * Quienes aportan el material de los cursos. Ven el panel de avance y aportes
 * porque es el registro sobre el que se calcula el reparto —y donde marcan lo
 * que han subido—, pero no el panel de Admin ni el editor de Modelado.
 *
 * La lista sale del registro de colaboradores: el correo se declara una sola
 * vez, junto al nombre y al color de cada persona.
 */
const APORTES_EMAILS: ReadonlySet<string> = new Set(EMAILS_COLABORADORES);

export function canVerAportes(email: string | null | undefined): boolean {
  if (!email) return false;
  return isAdminEmail(email) || APORTES_EMAILS.has(email.toLowerCase());
}
