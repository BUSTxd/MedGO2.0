import 'server-only';
import type { User } from '@supabase/supabase-js';
import { EMAILS_COLABORADORES } from '@/lib/data/aportes-correos';

export const ADMIN_EMAIL = 'fernandnoob062.0@gmail.com';

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}

/**
 * Cuentas con todo el contenido abierto (los dos tramos), sin pagar y sin ser
 * admin: reciben el `allAccess` del plan pero NO el panel de Admin ni Modelado.
 * Un plan normal no sirve para esto: ninguno abre UFBI y Facultad a la vez.
 * Es una lista, no una regla: cada correo se añade a mano y a sabiendas.
 */
const EMAILS_ACCESO_TOTAL: ReadonlySet<string> = new Set([
  'sofiacolchado12@gmail.com',
]);

export function tieneAccesoTotal(email: string | null | undefined): boolean {
  return !!email && EMAILS_ACCESO_TOTAL.has(email.toLowerCase());
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
 * Hasta aquí MedGO era solo de Cayetano: toda cuenta creada antes de este
 * instante es de la UPCH, aunque se registrara con Gmail. Desde el corte, quien
 * quiera los sílabos tiene que registrarse con su correo `@upch.pe`.
 */
const CORTE_CAYETANO = Date.parse('2026-10-08T00:00:00-05:00');

/**
 * Puede ver lo que es de Cayetano (los sílabos y el panel por tramos de
 * `cursos/cayetano`):
 *  - toda cuenta creada antes de `CORTE_CAYETANO`, sea cual sea su correo;
 *  - desde el corte, solo si entró con **Google** con un correo `@upch.pe`;
 *  - siempre el admin, las cuentas de acceso total y quienes aportan material.
 *
 * Por qué Google y no el correo de la cuenta: el registro con contraseña no
 * comprueba que el correo sea de quien lo escribe (Supabase lo autoconfirma),
 * así que cualquiera podría registrarse como `alumno@upch.pe`. Google sí lo
 * comprueba: su identidad trae el correo verificado por la universidad.
 *
 * La cerradura es `middleware.ts`, que rebota cualquier ruta de un curso de
 * Cayetano antes de que la página llegue a renderizarse.
 */
export function esDeCayetano(
  user: Pick<User, 'email' | 'created_at' | 'identities'> | null | undefined,
): boolean {
  if (!user) return false;
  if (Date.parse(user.created_at) < CORTE_CAYETANO) return true;
  const upchPorGoogle = (user.identities ?? []).some(
    (i) =>
      i.provider === 'google' &&
      i.identity_data?.email_verified === true &&
      String(i.identity_data?.email ?? '').toLowerCase().endsWith('@upch.pe'),
  );
  if (upchPorGoogle) return true;
  const e = user.email?.toLowerCase();
  return !!e && (isAdminEmail(e) || tieneAccesoTotal(e) || APORTES_EMAILS.has(e));
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
