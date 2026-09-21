import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';
import { canalBuzon, canalBuzonAdmin } from '@/lib/presencia';

/**
 * Mensajes del equipo a un alumno y sus respuestas. Las tablas tienen RLS sin
 * políticas: todo pasa por aquí con la service role key, y quien llama (la
 * route) ya comprobó si es el admin o el propio alumno.
 */

export const MAX_TITULO = 120;
export const MAX_CUERPO = 2000;

export interface Respuesta {
  id: string;
  cuerpo: string;
  created_at: string;
  leido_admin_at: string | null;
}

export interface Mensaje {
  id: string;
  user_id: string;
  titulo: string;
  cuerpo: string;
  created_at: string;
  visto_at: string | null;
  cerrado_at: string | null;
  respuestas: Respuesta[];
}

const db = () => createAdminClient() as unknown as SupabaseClient;

const COLUMNAS = 'id, user_id, titulo, cuerpo, created_at, visto_at, cerrado_at, respuestas:mensajes_respuestas(id, cuerpo, created_at, leido_admin_at)';

/**
 * Aviso sin contenido por Realtime. Si falla, el mensaje igual queda guardado:
 * el alumno lo verá la próxima vez que cargue el dashboard.
 */
async function avisar(canal: string) {
  try {
    await db().channel(canal).httpSend('nuevo', {});
  } catch (e) {
    console.error('[mensajes] aviso realtime', e);
  }
}

export async function enviarMensaje(userId: string, titulo: string, cuerpo: string): Promise<Mensaje> {
  const { data, error } = await db()
    .from('mensajes')
    .insert({ user_id: userId, titulo, cuerpo })
    .select(COLUMNAS)
    .single();
  if (error || !data) throw new Error(error?.message ?? 'insert vacío');
  // Al alumno, para que le aparezca; a la bandeja, para que lo liste ya.
  await Promise.all([avisar(canalBuzon(userId)), avisar(canalBuzonAdmin())]);
  return data as Mensaje;
}

/** Los que la tarjeta del alumno debe enseñar: sin cerrar, el más antiguo primero. */
export async function abiertosDe(userId: string): Promise<Mensaje[]> {
  const { data, error } = await db()
    .from('mensajes')
    .select(COLUMNAS)
    .eq('user_id', userId)
    .is('cerrado_at', null)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Mensaje[];
}

async function delAlumno(userId: string, mensajeId: string): Promise<boolean> {
  const { data } = await db().from('mensajes').select('id').eq('id', mensajeId).eq('user_id', userId).maybeSingle();
  return !!data;
}

export async function marcarVisto(userId: string, mensajeId: string) {
  await db().from('mensajes').update({ visto_at: new Date().toISOString() })
    .eq('id', mensajeId).eq('user_id', userId).is('visto_at', null);
  await avisar(canalBuzonAdmin());
}

export async function cerrar(userId: string, mensajeId: string) {
  await db().from('mensajes').update({ cerrado_at: new Date().toISOString() })
    .eq('id', mensajeId).eq('user_id', userId);
  await avisar(canalBuzonAdmin());
}

export async function responder(userId: string, mensajeId: string, cuerpo: string): Promise<Respuesta | null> {
  // El id viene del cliente: sin esta comprobación un alumno podría escribir
  // en el hilo de otro.
  if (!(await delAlumno(userId, mensajeId))) return null;
  const { data, error } = await db()
    .from('mensajes_respuestas')
    .insert({ mensaje_id: mensajeId, user_id: userId, cuerpo })
    .select('id, cuerpo, created_at, leido_admin_at')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'insert vacío');
  await avisar(canalBuzonAdmin());
  return data as Respuesta;
}

/** Bandeja del admin: todos los mensajes enviados, con sus respuestas. */
export async function bandeja(): Promise<Mensaje[]> {
  const { data, error } = await db()
    .from('mensajes')
    .select(COLUMNAS)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as Mensaje[];
}

export async function marcarRespuestasLeidas() {
  await db().from('mensajes_respuestas').update({ leido_admin_at: new Date().toISOString() })
    .is('leido_admin_at', null);
}

/** Texto de un formulario: recortado y dentro del límite, o null si no sirve. */
export function textoValido(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 && t.length <= max ? t : null;
}
