import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  cuotaCobrada,
  getPreapproval,
  mpBuscarCuotas,
  type PreapprovalResponse,
} from '@/lib/mercadopago';
import { PLANS, type PlanKey } from '@/lib/plans';

const DIA = 24 * 60 * 60 * 1000;

/**
 * Red de seguridad del webhook de Mercado Pago.
 *
 * El webhook sólo alarga `plan_expires_at` cuando la notificación que recibe ya
 * trae la cuota cobrada. Si MP avisa mientras el pago aún no está `approved`
 * (o el reintento de un cobro fallido se aprueba y no llega otro aviso), la
 * suscripción queda al día y el perfil vencido: le pasó a una alumna el
 * 2026-11-15 con el plan Interno.
 *
 * Escala: el cron no recorre a todos los suscriptores, solo a los vencidos con
 * suscripción viva (`suscripciones_mp_por_revisar`), de 4 en 4 y con un tope
 * de tiempo; quien tiene su periodo pagado por delante no cuesta nada.
 *
 * Esto relee cada suscripción de MP viva, busca su última cuota cobrada y, si
 * el acceso pagado llega más lejos que `plan_expires_at`, lo alarga. **Nunca
 * acorta un acceso**: quitarlo sigue siendo cosa del webhook (cancelación sin
 * cobros) o del vencimiento natural.
 */

export interface CambioReconciliado {
  userId: string;
  preapprovalId: string;
  planKey: string;
  antes: string | null;
  despues: string;
}

export interface ResultadoReconciliacion {
  revisadas: number;
  /** (cron) las que no dio tiempo a revisar antes de `hastaMs`. */
  pendientes: number;
  cambios: CambioReconciliado[];
  errores: { preapprovalId: string; error: string }[];
}

interface FilaSub {
  id: string;
  user_id: string;
  plan_key: string;
  status: string;
  next_payment_date: string | null;
  mp_preapproval_id: string;
  created_at: string;
}

/** Hasta cuándo da acceso lo cobrado, o null si no hay ninguna cuota cobrada. */
async function venceSegunCobros(pre: PreapprovalResponse, durationDays: number): Promise<number | null> {
  const cuotas = await mpBuscarCuotas(pre.id);
  let ultimo = NaN;
  for (const c of cuotas) {
    if (!cuotaCobrada(c)) continue;
    const t = Date.parse(c.debit_date ?? c.date_created ?? '');
    if (Number.isFinite(t) && !(t <= ultimo)) ultimo = t;
  }
  if (!Number.isFinite(ultimo)) return null;

  const porDuracion = ultimo + durationDays * DIA;
  // MP fija el próximo cobro en la fecha de ciclo (no en la del reintento):
  // se respeta si cae dentro del periodo pagado, con unos días de holgura.
  const npd = pre.next_payment_date ? Date.parse(pre.next_payment_date) : NaN;
  const npdCreible = Number.isFinite(npd) && npd > ultimo && npd <= ultimo + (durationDays + 5) * DIA;
  return npdCreible ? Math.max(porDuracion, npd) : porDuracion;
}

/** Cuántas suscripciones se revisan a la vez (MP aguanta de sobra; Supabase también). */
const CONCURRENCIA = 4;

/**
 * Las suscripciones a revisar: las de un alumno, o (cron) solo las que pueden
 * tener un cobro sin reflejar, según `suscripciones_mp_por_revisar` (0016).
 * Siempre la más reciente viva de cada alumno: una vieja que siga viva no
 * puede pisar la clave de una nueva.
 */
async function porRevisar(opts: { userId?: string; todas?: boolean }): Promise<FilaSub[]> {
  const admin = createAdminClient();
  if (!opts.userId) {
    const { data, error } = await admin.rpc('suscripciones_mp_por_revisar', { p_todas: !!opts.todas } as never);
    if (error) throw new Error(`suscripciones_mp_por_revisar: ${error.message}`);
    return (data ?? []) as FilaSub[];
  }
  const { data, error } = await admin
    .from('subscriptions')
    .select('id, user_id, plan_key, status, next_payment_date, mp_preapproval_id, created_at')
    .eq('proveedor', 'mercadopago')
    .not('mp_preapproval_id', 'is', null)
    .neq('status', 'cancelled')
    .eq('user_id', opts.userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .returns<FilaSub[]>();
  if (error) throw new Error(`subscriptions: ${error.message}`);
  return data ?? [];
}

/**
 * @param opts.userId  revisa solo a ese alumno (webhook, botón, al entrar).
 * @param opts.todas   (cron) todas las vivas, no solo las vencidas: auditoría.
 * @param opts.hastaMs (cron) no empieza ninguna revisión pasado este instante;
 *   lo que quede sale en `pendientes` y lo coge el día siguiente o la revisión
 *   al entrar. Así la función nunca muere a medias por el límite de Vercel.
 */
export async function reconciliarSuscripcionesMp(
  opts: { soloVer?: boolean; userId?: string; todas?: boolean; hastaMs?: number } = {},
): Promise<ResultadoReconciliacion> {
  const admin = createAdminClient();
  const ahora = Date.now();
  const ultimas = await porRevisar(opts);

  const res: ResultadoReconciliacion = { revisadas: 0, pendientes: 0, cambios: [], errores: [] };

  let siguiente = 0;
  const trabajador = async () => {
    while (siguiente < ultimas.length) {
      if (opts.hastaMs && Date.now() > opts.hastaMs) return;
      const s = ultimas[siguiente++];
      res.revisadas++;
      await revisarUna(s);
    }
  };

  const revisarUna = async (s: FilaSub) => {
    try {
      const plan = PLANS[s.plan_key as PlanKey];
      if (!plan) return;
      const pre = await getPreapproval(s.mp_preapproval_id);

      // La fila refleja lo que dice MP (por si también se perdió ese aviso).
      const npdMp = pre.next_payment_date ? new Date(pre.next_payment_date).toISOString() : null;
      // Se comparan instantes, no textos: la base devuelve «+00:00» y MP «Z».
      const npdFila = s.next_payment_date ? Date.parse(s.next_payment_date) : NaN;
      const filaCambia = pre.status !== s.status || (npdMp !== null && Date.parse(npdMp) !== npdFila);
      if (filaCambia && !opts.soloVer) {
        const upd: Record<string, unknown> = { status: pre.status };
        if (npdMp) upd.next_payment_date = npdMp;
        await (admin.from('subscriptions') as unknown as {
          update: (r: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<unknown> };
        }).update(upd).eq('id', s.id);
      }

      const vence = await venceSegunCobros(pre, plan.durationDays);
      if (vence === null || vence <= ahora) return;

      const { data: perfil } = await admin
        .from('profiles')
        .select('plan_expires_at')
        .eq('id', s.user_id)
        .maybeSingle<{ plan_expires_at: string | null }>();
      const actual = perfil?.plan_expires_at ? Date.parse(perfil.plan_expires_at) : 0;
      // Un minuto de margen: no reescribir por diferencias de redondeo.
      if (vence <= actual + 60_000) return;

      const despues = new Date(vence).toISOString();
      if (!opts.soloVer) {
        await (admin.from('profiles') as unknown as {
          update: (r: Record<string, unknown>) => { eq: (c: string, v: string) => Promise<unknown> };
        }).update({ plan: s.plan_key, plan_expires_at: despues }).eq('id', s.user_id);
      }
      res.cambios.push({
        userId: s.user_id,
        preapprovalId: s.mp_preapproval_id,
        planKey: s.plan_key,
        antes: perfil?.plan_expires_at ?? null,
        despues,
      });
    } catch (err) {
      res.errores.push({ preapprovalId: s.mp_preapproval_id, error: err instanceof Error ? err.message : String(err) });
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCIA, ultimas.length) }, trabajador));
  res.pendientes = ultimas.length - res.revisadas;
  return res;
}

/**
 * Lo mismo para un solo alumno, cuando entra con el plan vencido: así no pasa
 * hasta 24 h con candado esperando al cron diario. Barato y acotado:
 *  - una vez cada 10 min por alumno y por instancia (las APIs de contenido
 *    también leen el plan, y no deben llamar a MP en cada petición);
 *  - como mucho 4 s: si MP va lento, la página sigue y ya lo arreglará el cron.
 * Devuelve true si alargó el acceso (hay que releer el perfil).
 */
const ultimaRevision = new Map<string, number>();
const CADA_MS = 10 * 60 * 1000;
const TOPE_MS = 4000;

export async function reconciliarAlEntrar(userId: string): Promise<boolean> {
  const ahora = Date.now();
  if (ahora - (ultimaRevision.get(userId) ?? 0) < CADA_MS) return false;
  ultimaRevision.set(userId, ahora);
  if (ultimaRevision.size > 5000) ultimaRevision.clear();

  try {
    const res = await Promise.race([
      reconciliarSuscripcionesMp({ userId }),
      new Promise<null>((r) => setTimeout(() => r(null), TOPE_MS)),
    ]);
    if (res?.cambios.length) {
      console.warn('[suscripciones] acceso pagado sin reflejar, corregido al entrar:', JSON.stringify(res.cambios));
      return true;
    }
  } catch (err) {
    console.error('[suscripciones] revisión al entrar falló', err);
  }
  return false;
}
