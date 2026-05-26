import 'server-only';
import { cookies } from 'next/headers';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ProfilePlan } from '@/lib/plans';

export const DEVICE_COOKIE = 'device_id';

const PLAN_DEVICE_LIMIT: Record<ProfilePlan, number> = {
  free:      Number.POSITIVE_INFINITY,
  interno:   3,
  residente: 3,
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const VERIFY_TTL_SECONDS = 60 * 60; // 1h — limit check cache
const TOUCH_DEBOUNCE_MS = 5 * 60 * 1000; // 5 min — evita writes en cada navegación

function sessionsTag(userId: string): string {
  return `user-sessions:${userId}`;
}

export interface ActiveSession {
  id: string;
  device_id: string;
  user_agent: string | null;
  ip: string | null;
  last_seen: string;
  created_at: string;
}

function thirtyDaysAgoIso(): string {
  return new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
}

export async function getDeviceId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(DEVICE_COOKIE)?.value ?? null;
}

export async function listActiveSessions(userId: string): Promise<ActiveSession[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('user_sessions')
    .select('id, device_id, user_agent, ip, last_seen, created_at')
    .eq('user_id', userId)
    .is('revoked_at', null)
    .gt('last_seen', thirtyDaysAgoIso())
    .order('last_seen', { ascending: false });

  if (error) {
    console.error('[sessions] listActiveSessions', error.message);
    return [];
  }
  return (data ?? []) as ActiveSession[];
}

export interface AllowedResult {
  allowed: boolean;
  sessions: ActiveSession[];
  limit: number;
}

/**
 * Versión completa con sesiones — uso en /auth/device-limit y otras pantallas
 * que muestran la lista al usuario. NO cacheada: necesita datos frescos.
 */
export async function assertDeviceAllowed(
  userId: string,
  deviceId: string | null,
  plan: ProfilePlan,
): Promise<AllowedResult> {
  const limit = PLAN_DEVICE_LIMIT[plan];

  // Free: skip query por completo.
  if (!Number.isFinite(limit)) return { allowed: true, sessions: [], limit };

  const sessions = await listActiveSessions(userId);

  if (!deviceId) {
    return { allowed: sessions.length < limit, sessions, limit };
  }

  const known = sessions.some((s) => s.device_id === deviceId);
  if (known) return { allowed: true, sessions, limit };
  return { allowed: sessions.length < limit, sessions, limit };
}

export type DeviceCheck =
  | { kind: 'allowed' }                    // device ya está activo, nada que hacer
  | { kind: 'allowed_new' }                // hay espacio, falta registrar este device
  | { kind: 'revoked' }                    // device fue revocado explícitamente → kick
  | { kind: 'limit_exceeded' };            // sin espacio → /auth/device-limit

interface DeviceSets {
  active:  string[];
  revoked: string[];
}

async function getDeviceSets(userId: string): Promise<DeviceSets> {
  return unstable_cache(
    async (): Promise<DeviceSets> => {
      const admin = createAdminClient();
      const { data, error } = await admin
        .from('user_sessions')
        .select('device_id, revoked_at')
        .eq('user_id', userId)
        .gt('last_seen', thirtyDaysAgoIso());

      if (error || !data) return { active: [], revoked: [] };

      const active:  string[] = [];
      const revoked: string[] = [];
      for (const row of data as { device_id: string; revoked_at: string | null }[]) {
        if (row.revoked_at) revoked.push(row.device_id);
        else                active.push(row.device_id);
      }
      return { active, revoked };
    },
    ['device-sets', userId],
    { revalidate: VERIFY_TTL_SECONDS, tags: [sessionsTag(userId)] },
  )();
}

/**
 * Fast path para el layout — clasifica el device en 4 estados.
 * Cachea las listas (active + revoked) por usuario durante 1h, invalidadas en
 * revokeSession y touchSession.
 */
export async function checkDevice(
  userId:   string,
  deviceId: string | null,
  plan:     ProfilePlan,
): Promise<DeviceCheck> {
  const limit = PLAN_DEVICE_LIMIT[plan];
  if (!Number.isFinite(limit)) return { kind: 'allowed' }; // free: skip
  if (!deviceId) return { kind: 'limit_exceeded' };        // sin cookie: forzar UI

  const { active, revoked } = await getDeviceSets(userId);

  if (revoked.includes(deviceId)) return { kind: 'revoked' };
  if (active.includes(deviceId))  return { kind: 'allowed' };
  if (active.length < limit)      return { kind: 'allowed_new' };
  return { kind: 'limit_exceeded' };
}

export type TouchResult = 'registered' | 'refreshed' | 'noop' | 'revoked';

/**
 * Registra/actualiza la sesión del dispositivo respetando revoked_at.
 * - Si la fila existe y está revocada: devuelve 'revoked' y NO la resucita.
 * - Si no existe: hace INSERT.
 * - Si existe y está activa: hace UPDATE solo si last_seen > 5min (debounce).
 */
export async function touchSession(params: {
  userId:    string;
  deviceId:  string;
  userAgent: string | null;
  ip:        string | null;
}): Promise<TouchResult> {
  const admin = createAdminClient();

  const { data: existingRaw, error: selErr } = await admin
    .from('user_sessions')
    .select('id, revoked_at, last_seen')
    .eq('user_id',   params.userId)
    .eq('device_id', params.deviceId)
    .maybeSingle();

  if (selErr) {
    console.error('[sessions] touch select', selErr.message);
    return 'noop';
  }

  const existing = existingRaw as { id: string; revoked_at: string | null; last_seen: string } | null;

  if (existing?.revoked_at) return 'revoked';

  const nowIso = new Date().toISOString();

  if (!existing) {
    const insertable = admin.from('user_sessions') as unknown as {
      insert: (row: Record<string, unknown>) => Promise<{ error: unknown }>;
    };
    const { error: insErr } = await insertable.insert({
      user_id:    params.userId,
      device_id:  params.deviceId,
      user_agent: params.userAgent,
      ip:         params.ip,
      last_seen:  nowIso,
    });
    if (insErr) {
      console.error('[sessions] touch insert', insErr);
      return 'noop';
    }
    revalidateTag(sessionsTag(params.userId), { expire: 0 });
    return 'registered';
  }

  // Debounce: si vimos al device hace menos de 5min, no escribimos.
  const lastSeenMs = new Date(existing.last_seen).getTime();
  if (Date.now() - lastSeenMs < TOUCH_DEBOUNCE_MS) return 'noop';

  const updatable = admin.from('user_sessions') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => Promise<{ error: unknown }>;
    };
  };
  const { error: updErr } = await updatable
    .update({ last_seen: nowIso, user_agent: params.userAgent, ip: params.ip })
    .eq('id', existing.id);
  if (updErr) {
    console.error('[sessions] touch update', updErr);
    return 'noop';
  }
  return 'refreshed';
}

export async function revokeSession(userId: string, sessionId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { error } = await (admin.from('user_sessions') as unknown as {
    update: (row: Record<string, unknown>) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: string) => Promise<{ error: unknown }>;
      };
    };
  })
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) {
    console.error('[sessions] revoke', error);
    return false;
  }
  // Invalida cache: el siguiente checkDevice verá el set actualizado y el
  // dispositivo revocado caerá en kind='revoked'.
  revalidateTag(sessionsTag(userId), { expire: 0 });
  return true;
}

export async function countActiveDevicesByUser(): Promise<Map<string, number>> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('user_sessions')
    .select('user_id')
    .is('revoked_at', null)
    .gt('last_seen', thirtyDaysAgoIso());

  const map = new Map<string, number>();
  if (error || !data) return map;
  for (const row of data as { user_id: string }[]) {
    map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
  }
  return map;
}

/** Parsea un user-agent en algo legible: "Chrome on Windows". */
export function parseUserAgent(ua: string | null): string {
  if (!ua) return 'Dispositivo desconocido';
  const browser =
    /Edg\//.test(ua) ? 'Edge' :
    /OPR\//.test(ua) ? 'Opera' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Firefox\//.test(ua) ? 'Firefox' :
    /Safari\//.test(ua) ? 'Safari' : 'Navegador';
  const os =
    /Windows/.test(ua) ? 'Windows' :
    /Android/.test(ua) ? 'Android' :
    /iPhone|iPad|iOS/.test(ua) ? 'iOS' :
    /Mac OS X|Macintosh/.test(ua) ? 'macOS' :
    /Linux/.test(ua) ? 'Linux' : 'sistema desconocido';
  return `${browser} en ${os}`;
}
