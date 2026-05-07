'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { PLANS, type PlanKey } from '@/lib/plans';
import styles from '@/styles/subscribeModal.module.css';

let mpInited = false;

interface Props {
  open: boolean;
  planKey: PlanKey;
  onClose: () => void;
}

export default function SubscribeModal({ open, planKey, onClose }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setReady(false);
      setError(null);
      setSuccess(false);
      return;
    }
    const pk = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
    if (!pk) {
      setError('Falta NEXT_PUBLIC_MP_PUBLIC_KEY en el entorno.');
      return;
    }
    if (!mpInited) {
      initMercadoPago(pk, { locale: 'es-PE' });
      mpInited = true;
    }
    const t = setTimeout(() => setReady(true), 30);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const plan = PLANS[planKey];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>

        <h3 className={styles.title}>Suscribirme al plan {plan.label}</h3>
        <p className={styles.subtitle}>Pago recurrente. Cancela cuando quieras.</p>

        <div className={styles.priceRow}>
          <span className={styles.priceMain}>S/ {plan.amount.toFixed(2)}</span>
          <span className={styles.priceUnit}>
            / {plan.durationDays === 30 ? 'mes' : 'año'}
          </span>
        </div>

        <div className={styles.brickWrap}>
          {!ready && <div className={styles.spinner}>Cargando pasarela…</div>}
          {ready && !success && (
            <CardPayment
              initialization={{ amount: plan.amount }}
              customization={{
                visual: { style: { theme: 'dark' } },
                paymentMethods: { maxInstallments: 1 },
              }}
              onSubmit={async (param) => {
                setError(null);
                try {
                  const res = await fetch('/api/subscriptions/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      cardTokenId: param.token,
                      planKey,
                      payerEmail: param.payer?.email,
                    }),
                  });
                  const json = await res.json();
                  if (!res.ok) {
                    const msg = json?.error === 'already_subscribed'
                      ? 'Ya tienes una suscripción activa.'
                      : json?.error || 'Error al procesar el pago.';
                    setError(msg);
                    throw new Error(msg);
                  }
                  setSuccess(true);
                  setTimeout(() => {
                    router.push(json.redirectTo || '/dashboard/home');
                    router.refresh();
                  }, 1200);
                } catch (e) {
                  if (!error) setError(e instanceof Error ? e.message : 'Error inesperado');
                  throw e;
                }
              }}
              onError={(err) => {
                console.error('[CardPayment] error', err);
                setError('No se pudo procesar la tarjeta. Verifica los datos.');
              }}
            />
          )}
          {success && (
            <div className={styles.success}>
              ¡Suscripción activada! Redirigiendo…
            </div>
          )}
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {process.env.NODE_ENV !== 'production' && (
          <p className={styles.testHint}>
            Modo prueba: tarjeta APRO <code>5031 7557 3453 0604</code>, CVV <code>123</code>, vencimiento 11/30, nombre <code>APRO</code>, DNI <code>12345678</code>.
          </p>
        )}
      </div>
    </div>
  );
}
