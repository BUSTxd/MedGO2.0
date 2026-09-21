import 'server-only';
import { createHmac } from 'node:crypto';

/**
 * El nombre con el que un usuario se anuncia en el canal de presencia. El canal
 * es público (cualquier sesión puede escucharlo), así que no viaja el id real:
 * viaja un HMAC que sólo el servidor sabe calcular. Quien escuche ve cuántos
 * hay en línea, pero no quiénes; el panel de admin recibe el token de cada fila
 * ya calculado y los cruza.
 */
export function tokenDePresencia(userId: string): string {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  return createHmac('sha256', clave).update(`medgo-presencia:${userId}`).digest('hex').slice(0, 32);
}
