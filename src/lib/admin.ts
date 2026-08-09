export const ADMIN_EMAIL = 'fernandnoob062.0@gmail.com';

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}

/**
 * Socias que aportan el material de los cursos. Ven el panel de avance y
 * aportes porque es el registro sobre el que se calcula el reparto y tienen que
 * poder auditarlo, pero no el panel de Admin ni el editor de Modelado.
 */
const APORTES_EMAILS: ReadonlySet<string> = new Set([
  'maria.guzman.z@upch.pe',
  'sofiacolchado12@gmail.com',
]);

export function canVerAportes(email: string | null | undefined): boolean {
  if (!email) return false;
  return isAdminEmail(email) || APORTES_EMAILS.has(email.toLowerCase());
}
