export const ADMIN_EMAIL = 'fernandnoob062.0@gmail.com';

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL;
}
