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

/**
 * Fast path para el layout — solo devuelve si el dispositivo está permitido.
 * Cachea los device_id activos por usuario durante 1h (server-side, no manipulable
 * desde el cliente). Se invalida automáticamente en revokeSession y touchSession.
 */
export async function isDeviceAllowed(
  userId: string,
  deviceId: string | null,
  plan: ProfilePlan,
): Promise<boolean> {
  const limit = PLAN_DEVICE_LIMIT[plan];
  if (!Number.isFinite(limit)) return true; // free: skip query
  if (!deviceId) return false; // sin cookie: tratar como nuevo device, count=0 → si limit >=1, allowed

  const deviceIds = await unstable_cache(
    async () => {
      const sessions = await listActiveSessions(userId);
      return sessions.map((s) => s.device_id);
    },
    ['active-device-ids', userId],
    { revalidate: VERIFY_TTL_SECONDS, tags: [sessionsTag(userId)] },
  )();

  if (deviceIds.includes(deviceId)) return true;
  return deviceIds.length < limit;
}

export async function touchSession(params: {
  userId: string;
  deviceId: string;
  userAgent: string | null;
  ip: string | null;
}): Promise<void> {
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  const sessionRow = {
    user_id:    params.userId,
    device_id:  params.deviceId,
    user_agent: params.userAgent,
    ip:         params.ip,
    last_seen:  nowIso,
    revoked_at: null,
  };

  const { error } = await (admin.from('user_sessions') as unknown as {
    upsert: (row: Record<string, unknown>, opts: { onConflict: string }) => Promise<{ error: unknown }>;
  }).upsert(sessionRow, { onConflict: 'user_id,device_id' });

  if (error) {
    console.error('[sessions] touch', error);
    return;
  }
  // Invalida cache de isDeviceAllowed: si fue insert (nuevo device) o update
  // de revoked_at→null, el set de devices activos cambió.
  revalidateTag(sessionsTag(params.userId), { expire: 0 });
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
  // Invalida cache: el siguiente isDeviceAllowed verá el set actualizado.
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
