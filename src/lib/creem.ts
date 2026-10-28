import 'server-only';
import crypto from 'node:crypto';

/**
 * Creem (merchant of record): checkout de los pagos de fuera del Perú.
 * Llamadas REST directas, como con Mercado Pago (`lib/mercadopago.ts`). Una
 * clave `creem_test_…` usa el sandbox; cualquier otra, producción.
 */

function clave(): string {
  const k = process.env.CREEM_API_KEY;
  if (!k) throw new Error('CREEM_API_KEY missing');
  return k;
}

const base = () => (clave().startsWith('creem_test_') ? 'https://test-api.creem.io' : 'https://api.creem.io');

export class CreemError extends Error {
  readonly status: number;
  constructor(status: number, path: string, body: string) {
    super(`Creem ${status} ${path}: ${body}`);
    this.name = 'CreemError';
    this.status = status;
  }
}

async function creemFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: { 'x-api-key': clave(), 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) throw new CreemError(res.status, path, text);
  return (text ? JSON.parse(text) : {}) as T;
}

export type EstadoCreem = 'active' | 'trialing' | 'scheduled_cancel' | 'past_due' | 'unpaid' | 'paused' | 'canceled';

export interface SuscripcionCreem {
  id: string;
  status: EstadoCreem;
  product: string | { id: string };
  customer: string | { id: string; email?: string };
  current_period_end_date?: string | null;
  canceled_at?: string | null;
  metadata?: Record<string, string> | null;
}

export const idDe = (x: string | { id: string } | null | undefined) => (typeof x === 'string' ? x : x?.id ?? null);

export function crearCheckout(body: {
  product_id: string;
  request_id: string;
  customer: { email: string };
  success_url: string;
  metadata: Record<string, string>;
}): Promise<{ id: string; checkout_url: string }> {
  return creemFetch('/v1/checkouts', { method: 'POST', body: JSON.stringify(body) });
}

export function getSuscripcion(id: string): Promise<SuscripcionCreem> {
  return creemFetch(`/v1/subscriptions?subscription_id=${encodeURIComponent(id)}`);
}

/** Cancela la renovación: el alumno conserva el periodo que ya pagó. */
export function cancelarSuscripcion(id: string): Promise<SuscripcionCreem> {
  return creemFetch(`/v1/subscriptions/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ mode: 'scheduled', onExecute: 'cancel' }),
  });
}

/**
 * Nuestro estado (`subscriptions.status`) a partir del de Creem. `scheduled_cancel`
 * es «cancelada pero con acceso hasta fin de periodo», igual que cuando se
 * cancela un plan de Mercado Pago.
 */
export function estadoPropio(s: EstadoCreem): 'authorized' | 'paused' | 'cancelled' {
  if (s === 'active' || s === 'trialing') return 'authorized';
  if (s === 'past_due' || s === 'unpaid' || s === 'paused') return 'paused';
  return 'cancelled';
}

/** Firma `creem-signature`: HMAC-SHA256 en hex del cuerpo crudo con el secreto del webhook. */
export function firmaValida(cuerpo: string, firma: string | null): { ok: boolean; motivo?: string } {
  const secreto = process.env.CREEM_WEBHOOK_SECRET;
  if (!secreto) {
    if (process.env.NODE_ENV === 'production') return { ok: false, motivo: 'CREEM_WEBHOOK_SECRET missing in production' };
    console.warn('[creem webhook] sin CREEM_WEBHOOK_SECRET: no se comprueba la firma (desarrollo)');
    return { ok: true };
  }
  if (!firma) return { ok: false, motivo: 'sin cabecera creem-signature' };
  const esperada = crypto.createHmac('sha256', secreto).update(cuerpo).digest('hex');
  const a = Buffer.from(esperada, 'hex');
  const b = Buffer.from(firma.trim(), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? { ok: true } : { ok: false, motivo: 'firma distinta' };
}
