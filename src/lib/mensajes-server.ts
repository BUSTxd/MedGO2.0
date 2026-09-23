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
export const MAX_RESPUESTA = 500;

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
  // Responder cierra el hilo. Los mensajes son una cola y la tarjeta sólo
  // enseña el primero: uno respondido pero abierto tapaba a los que llegaran
  // después, que parecían no llegar hasta recargar.
  await db().from('mensajes').update({ cerrado_at: new Date().toISOString() })
    .eq('id', mensajeId).eq('user_id', userId).is('cerrado_at', null);
  await avisar(canalBuzonAdmin());
  return data as Respuesta;
}

/**
 * El mismo mensaje a todo el mundo. Un insert en lote (no uno por usuario) y
 * los avisos de Realtime en paralelo: si alguno falla, el mensaje ya está
 * guardado y lo verá al entrar.
 */
export async function difundir(titulo: string, cuerpo: string): Promise<number> {
  // `listUsers` pagina: sin recorrerlo entero, la difusión dejaría fuera a los
  // alumnos de la segunda página en cuanto pasen de `POR_PAGINA`, y en silencio.
  const POR_PAGINA = 1000;
  const auth = createAdminClient().auth.admin;
  const ids: string[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await auth.listUsers({ page, perPage: POR_PAGINA });
    if (error) throw new Error(`listUsers: ${error.message}`);
    ids.push(...data.users.map(u => u.id));
    if (data.users.length < POR_PAGINA) break;
  }
  if (ids.length === 0) return 0;

  const { data: filas, error: errInsert } = await db()
    .from('mensajes')
    .insert(ids.map(user_id => ({ user_id, titulo, cuerpo })))
    .select('user_id');
  if (errInsert) throw new Error(errInsert.message);

  // En tandas: un `httpSend` por alumno a la vez abriría tantas peticiones como
  // usuarios haya. El mensaje ya está guardado, así que un aviso perdido sólo
  // retrasa la tarjeta hasta que el alumno vuelva a cargar el dashboard.
  const destinos = (filas ?? []).map(f => (f as { user_id: string }).user_id);
  for (let i = 0; i < destinos.length; i += 25) {
    await Promise.allSettled(destinos.slice(i, i + 25).map(id => avisar(canalBuzon(id))));
  }
  await avisar(canalBuzonAdmin());
  return destinos.length;
}

/**
 * Vacía la bandeja para no acumular filas en Supabase. Las respuestas caen
 * solas: `mensajes_respuestas.mensaje_id` es `on delete cascade`.
 */
export async function borrarMensajes(modo: 'cerrados' | 'todos'): Promise<number> {
  const q = db().from('mensajes').delete({ count: 'exact' });
  // `delete` sin filtro no borra nada, así que «todos» necesita uno que se cumpla siempre.
  const { count, error } = modo === 'cerrados'
    ? await q.not('cerrado_at', 'is', null)
    : await q.neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw new Error(error.message);
  await avisar(canalBuzonAdmin());
  return count ?? 0;
}

/**
 * Bandeja del admin: los mensajes enviados con sus respuestas. La vista se
 * queda en los 200 últimos, pero la descarga previa a vaciar los pide todos:
 * exportar de menos antes de un borrado definitivo sería perder respuestas.
 */
export async function bandeja(completa = false): Promise<Mensaje[]> {
  const { data, error } = await db()
    .from('mensajes')
    .select(COLUMNAS)
    .order('created_at', { ascending: false })
    .limit(completa ? 10_000 : 200);
  if (error) throw new Error(error.message);
  return (data ?? []) as Mensaje[];
}

export async function marcarRespuestasLeidas() {
  await db().from('mensajes_respuestas').update({ leido_admin_at: new Date().toISOString() })
    .is('leido_admin_at', null);
  // El contador de la barra lateral también escucha este canal.
  await avisar(canalBuzonAdmin());
}

/** Respuestas que el admin aún no leyó: el contador de la barra lateral. */
export async function contarNuevas(): Promise<number> {
  const { count, error } = await db()
    .from('mensajes_respuestas')
    .select('id', { count: 'exact', head: true })
    .is('leido_admin_at', null);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// Controles (salvo tabulador y salto), C1, zero-width, overrides de dirección
// bidi y BOM. No hace falta escapar HTML: React escapa el texto al pintarlo y
// ningún visor de mensajes usa `dangerouslySetInnerHTML`; lo que sí cuela por
// ahí es texto que se LEE distinto de lo que es (bidi, invisibles).
const INVISIBLES = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F​-‍‪-‮⁦-⁩﻿]/g;

/** Texto de un formulario: saneado y dentro del límite, o null si no sirve. */
export function textoValido(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const t = v
    .normalize('NFC')
    .replace(INVISIBLES, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return t.length > 0 && t.length <= max ? t : null;
}

/**
 * Freno contra la ráfaga: 5 respuestas por minuto y alumno. Vive en la memoria
 * del proceso, así que en serverless cada instancia lleva su propia cuenta —
 * no es una cuota exacta, pero corta el bucle accidental sin gastar una tabla.
 */
const RAFAGA = new Map<string, number[]>();

export function pasaElFreno(userId: string, limite = 5, ventanaMs = 60_000): boolean {
  const ahora = Date.now();
  if (RAFAGA.size > 5_000) RAFAGA.clear(); // techo de memoria: el peor caso es un minuto de gracia
  const recientes = (RAFAGA.get(userId) ?? []).filter(t => ahora - t < ventanaMs);
  RAFAGA.set(userId, recientes);
  if (recientes.length >= limite) return false;
  recientes.push(ahora);
  return true;
}
