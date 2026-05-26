import 'server-only';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ProfilePlan } from '@/lib/plans';

export const DEVICE_COOKIE = 'device_id';

const PLAN_DEVICE_LIMIT: Record<ProfilePlan, number> = {
  free:      Number.POSITIVE_INFINITY,
  interno:   3,
  residente: 3,
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

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

export async function assertDeviceAllowed(
  userId: string,
  deviceId: string | null,
  plan: ProfilePlan,
): Promise<AllowedResult> {
  const limit = PLAN_DEVICE_LIMIT[plan];
  const sessions = await listActiveSessions(userId);

  // Free: no hay límite.
  if (!Number.isFinite(limit)) return { allowed: true, sessions, limit };

  // Sin cookie de device aún: tratar como nuevo dispositivo.
  if (!deviceId) {
    return { allowed: sessions.length < limit, sessions, limit };
  }

  const known = sessions.some((s) => s.device_id === deviceId);
  if (known) return { allowed: true, sessions, limit };
  return { allowed: sessions.length < limit, sessions, limit };
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

  if (error) console.error('[sessions] touch', error);
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
