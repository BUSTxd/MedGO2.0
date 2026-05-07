import crypto from 'node:crypto';

const MP_BASE = 'https://api.mercadopago.com';

function token(): string {
  const t = process.env.MP_ACCESS_TOKEN;
  if (!t) throw new Error('MP_ACCESS_TOKEN missing');
  return t;
}

async function mpFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${MP_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`MP ${res.status} ${path}: ${text}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export interface PreapprovalResponse {
  id: string;
  preapproval_plan_id: string;
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  payer_email?: string;
  next_payment_date?: string;
  auto_recurring?: {
    transaction_amount: number;
    currency_id: string;
    frequency: number;
    frequency_type: string;
  };
}

export function createPreapproval(body: {
  preapproval_plan_id: string;
  payer_email: string;
  card_token_id: string;
  status?: 'authorized' | 'pending';
}): Promise<PreapprovalResponse> {
  return mpFetch<PreapprovalResponse>('/preapproval', {
    method: 'POST',
    body: JSON.stringify({ status: 'authorized', ...body }),
  });
}

export function getPreapproval(id: string): Promise<PreapprovalResponse> {
  return mpFetch<PreapprovalResponse>(`/preapproval/${encodeURIComponent(id)}`);
}

/**
 * Validates Mercado Pago `x-signature` header.
 * Format: `ts=<timestamp>,v1=<hex hmac sha256>`
 * Manifest signed: `id:<dataId>;request-id:<xRequestId>;ts:<ts>;`
 *
 * In TEST without MP_WEBHOOK_SECRET set we accept and log a warning so the loop can be tested.
 */
export function verifyWebhookSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
}): { ok: boolean; reason?: string } {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'MP_WEBHOOK_SECRET missing in production' };
    }
    console.warn('[mp webhook] MP_WEBHOOK_SECRET not set — skipping signature check (TEST mode)');
    return { ok: true };
  }
  if (!opts.xSignature || !opts.xRequestId || !opts.dataId) {
    return { ok: false, reason: 'missing signature headers or data.id' };
  }
  const parts = Object.fromEntries(
    opts.xSignature.split(',').map((kv) => {
      const [k, v] = kv.trim().split('=');
      return [k, v] as const;
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return { ok: false, reason: 'malformed x-signature' };

  const manifest = `id:${opts.dataId};request-id:${opts.xRequestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(v1, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'hmac mismatch' };
  }
  return { ok: true };
}
