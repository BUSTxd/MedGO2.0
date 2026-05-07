'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { PLANS, type PlanKey } from '@/lib/plans';
import styles from '@/styles/subscribeModal.module.css';

let mpInited = false;

interface Receipt {
  mpPreapprovalId: string;
  planLabel: string;
  amount: number;
  currency: string;
  nextPaymentDate: string;
  payerEmail: string;
}

interface Props {
  open: boolean;
  planKey: PlanKey;
  onClose: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const shortRef = (id: string) => id.slice(-8);

export default function SubscribeModal({ open, planKey, onClose }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    if (!open) {
      setReady(false);
      setError(null);
      setReceipt(null);
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
    const onKey = (e: KeyboardEvent) => {
      // Block Escape while showing receipt — user must click "Continuar"
      if (e.key === 'Escape' && !receipt) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, receipt]);

  if (!open) return null;

  const plan = PLANS[planKey];

  const handleContinue = () => {
    router.push('/dashboard/home');
    router.refresh();
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => { if (!receipt) onClose(); }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {!receipt && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
        )}

        {!receipt && (
          <>
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
              {ready && (
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
                      if (json.receipt) {
                        setReceipt(json.receipt as Receipt);
                      } else {
                        router.push(json.redirectTo || '/dashboard/home');
                        router.refresh();
                      }
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
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {process.env.NODE_ENV !== 'production' && (
              <p className={styles.testHint}>
                Modo prueba: tarjeta APRO <code>5031 7557 3453 0604</code>, CVV <code>123</code>, vencimiento 11/30, nombre <code>APRO</code>, DNI <code>12345678</code>.
              </p>
            )}
          </>
        )}

        {receipt && (
          <div className={styles.receipt}>
            <div className={styles.receiptCheck} aria-hidden="true">
              <svg viewBox="0 0 52 52" width="52" height="52">
                <circle cx="26" cy="26" r="24" fill="none" stroke="#10b981" strokeWidth="2" />
                <path d="M14 27l8 8 16-18" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h3 className={styles.receiptTitle}>Suscripción activada</h3>
            <p className={styles.receiptSub}>
              Te enviamos el comprobante a <strong>{receipt.payerEmail}</strong>
            </p>

            <dl className={styles.receiptDetails}>
              <div className={styles.receiptRow}>
                <dt>Plan</dt>
                <dd>{receipt.planLabel}</dd>
              </div>
              <div className={styles.receiptRow}>
                <dt>Cobrado</dt>
                <dd>S/ {receipt.amount.toFixed(2)}</dd>
              </div>
              <div className={styles.receiptRow}>
                <dt>Próximo cobro</dt>
                <dd>{formatDate(receipt.nextPaymentDate)}</dd>
              </div>
              <div className={styles.receiptRow}>
                <dt>Referencia</dt>
                <dd className={styles.receiptRef}>…{shortRef(receipt.mpPreapprovalId)}</dd>
              </div>
            </dl>

            <p className={styles.receiptNote}>
              Puedes cancelar tu suscripción en cualquier momento desde <strong>Mi cuenta</strong>.
              Si no recibes el correo en unos minutos, revisa la carpeta de Spam o Promociones.
            </p>

            <button className={styles.continueBtn} onClick={handleContinue}>
              Continuar al panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
