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

/**
 * Cuentas exentas del compromiso mínimo de los planes mensuales
 * (`commitmentMonths`), es decir, que pueden cancelar su suscripción el mismo
 * día que la contratan.
 *
 * Son las cuentas con las que se prueba el flujo real de compra contra Mercado
 * Pago: sin la exención, cada prueba dejaría la suscripción atada tres meses y
 * no habría forma de volver a probar la cancelación. La cuenta de UPCH está
 * aquí y NO en `isAdminEmail` a propósito — eximir del compromiso no es motivo
 * para abrirle el panel de Admin, el editor de Modelado ni el `allAccess` de
 * plan, que es todo lo que cuelga de ser admin.
 *
 * Es una lista, no una regla: cada correo se añade a mano y a sabiendas.
 */
const EMAILS_SIN_COMPROMISO: ReadonlySet<string> = new Set([
  ADMIN_EMAIL,
  'fernand.durand@upch.pe',
]);

export function puedeCancelarSinCompromiso(
  email: string | null | undefined,
): boolean {
  return !!email && EMAILS_SIN_COMPROMISO.has(email.toLowerCase());
}
