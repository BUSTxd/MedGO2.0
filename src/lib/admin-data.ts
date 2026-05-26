import { createAdminClient } from '@/lib/supabase/admin';
import { countActiveDevicesByUser } from '@/lib/sessions';

export type AdminPlan = 'free' | 'interno' | 'residente';
export type AdminSubStatus = 'pending' | 'authorized' | 'paused' | 'cancelled';

export interface AdminRow {
  id: string;
  email: string;
  fullName: string | null;
  plan: AdminPlan;
  planExpiresAt: string | null;
  lastVisitDate: string | null;
  currentStreak: number;
  subStatus: AdminSubStatus | null;
  nextPaymentDate: string | null;
  subAmount: number | null;
  deviceCount: number;
}

export interface AdminKpis {
  totalUsers: number;
  activosTotal: number;
  mrrSoles: number;
  activosHoy: number;
  proximosAVencer: number;
}

export interface AdminData {
  rows: AdminRow[];
  kpis: AdminKpis;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  plan: AdminPlan | null;
  plan_expires_at: string | null;
  last_visit_date: string | null;
  current_streak: number | null;
}

interface SubRow {
  user_id: string;
  status: AdminSubStatus;
  next_payment_date: string | null;
  amount: number | null;
  created_at: string;
}

function todayLima(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export async function loadAdminData(): Promise<AdminData> {
  const admin = createAdminClient();

  const [authRes, profilesRes, subsRes, deviceCounts] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('profiles').select('id, full_name, plan, plan_expires_at, last_visit_date, current_streak'),
    admin
      .from('subscriptions')
      .select('user_id, status, next_payment_date, amount, created_at')
      .order('created_at', { ascending: false }),
    countActiveDevicesByUser(),
  ]);

  if (authRes.error) throw new Error(`admin.listUsers: ${authRes.error.message}`);
  if (profilesRes.error) throw new Error(`profiles: ${profilesRes.error.message}`);
  if (subsRes.error) throw new Error(`subscriptions: ${subsRes.error.message}`);

  const emails = new Map<string, string>();
  for (const u of authRes.data.users) {
    if (u.email) emails.set(u.id, u.email);
  }

  const profiles = (profilesRes.data ?? []) as ProfileRow[];
  const subs = (subsRes.data ?? []) as SubRow[];

  // Más reciente por user_id (ya viene ordenado desc).
  const latestSub = new Map<string, SubRow>();
  for (const s of subs) {
    if (!latestSub.has(s.user_id)) latestSub.set(s.user_id, s);
  }

  const today = todayLima();
  const rows: AdminRow[] = profiles.map((p) => {
    const sub = latestSub.get(p.id);
    return {
      id: p.id,
      email: emails.get(p.id) ?? '—',
      fullName: p.full_name,
      plan: (p.plan ?? 'free') as AdminPlan,
      planExpiresAt: p.plan_expires_at,
      lastVisitDate: p.last_visit_date,
      currentStreak: p.current_streak ?? 0,
      subStatus: sub?.status ?? null,
      nextPaymentDate: sub?.next_payment_date ?? null,
      subAmount: sub?.amount ?? null,
      deviceCount: deviceCounts.get(p.id) ?? 0,
    };
  });

  const activos = rows.filter((r) => r.subStatus === 'authorized');
  const activosHoy = rows.filter((r) => r.lastVisitDate === today).length;
  const proximosAVencer = activos.filter((r) => {
    const d = daysUntil(r.nextPaymentDate);
    return d !== null && d >= 0 && d <= 7;
  }).length;
  const mrrSoles = activos.reduce((sum, r) => sum + (r.subAmount ?? 14), 0);

  return {
    rows,
    kpis: {
      totalUsers: rows.length,
      activosTotal: activos.length,
      mrrSoles,
      activosHoy,
      proximosAVencer,
    },
  };
}
