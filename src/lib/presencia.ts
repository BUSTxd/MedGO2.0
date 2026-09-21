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

/**
 * Canal por el que el servidor avisa a un alumno de que tiene un mensaje nuevo.
 * Usa el mismo token opaco: el aviso no lleva contenido (el cliente lo pide
 * luego a /api/mensajes con su sesión), así que escucharlo no filtra nada.
 */
export const canalBuzon = (userId: string) => `buzon-${tokenDePresencia(userId)}`;

/** Canal por el que el panel admin se entera de una respuesta nueva. */
export const canalBuzonAdmin = () => `buzon-admin-${tokenDePresencia('buzon-admin')}`;
