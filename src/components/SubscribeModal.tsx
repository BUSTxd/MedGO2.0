'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { PLANS, type PlanKey } from '@/lib/plans';
import { usePlan } from './PlanProvider';
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
  const { refreshPlan } = usePlan();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  // El Brick no se monta hasta que el usuario acepta los T&C. Esto evita
  // re-montaje del Brick al cambiar customization y deja el gate explícito.
  const [tos, setTos] = useState(false);
  // Tema capturado al abrir el modal. No se actualiza si el usuario togglea
  // dark/light mientras el Brick está montado: cambiar `customization` haría
  // que el SDK re-monte el Brick y re-pida los recursos al servidor.
  const [themeIsDark, setThemeIsDark] = useState(false);

  useEffect(() => {
    if (!open) {
      setReady(false);
      setError(null);
      setReceipt(null);
      setTos(false);
      return;
    }
    setThemeIsDark(
      typeof document !== 'undefined' &&
      document.body.classList.contains('dark-mode'),
    );
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

  const plan = PLANS[planKey];

  const initialization = useMemo(
    () => ({ amount: plan.amount }),
    [plan.amount],
  );

  const customization = useMemo(
    () => ({
      visual: { style: { theme: themeIsDark ? ('dark' as const) : ('default' as const) } },
      paymentMethods: { maxInstallments: 1 },
    }),
    [themeIsDark],
  );

  const handleSubmit = useCallback(
    async (param: { token?: string; payer?: { email?: string } }) => {
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
          let msg: string;
          if (json?.error === 'already_subscribed') {
            const until = json?.expiresAt ? ` hasta el ${formatDate(json.expiresAt)}` : '';
            msg = `Ya tienes un plan activo${until}. Puedes gestionarlo desde Mi cuenta.`;
          } else {
            msg = json?.error || 'Error al procesar el pago.';
          }
          setError(msg);
          throw new Error(msg);
        }
        // Sincroniza el plan en el cliente (Provider) y los
        // Server Components actuales antes de mostrar el receipt;
        // así si el usuario cierra el modal sin clicar "Continuar"
        // ya tiene el plan nuevo aplicado en la página actual.
        await refreshPlan();
        router.refresh();
        if (json.receipt) {
          setReceipt(json.receipt as Receipt);
        } else {
          router.push(json.redirectTo || '/dashboard/home');
        }
      } catch (e) {
        setError((prev) => prev ?? (e instanceof Error ? e.message : 'Error inesperado'));
        throw e;
      }
    },
    [planKey, refreshPlan, router],
  );

  const handleError = useCallback((err: unknown) => {
    console.error('[CardPayment] error', err);
    setError('No se pudo procesar la tarjeta. Verifica los datos.');
  }, []);

  if (!open) return null;

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
            <p className={styles.subtitle}>
              {planKey === 'interno'
                ? 'Pago mensual. Compromiso mínimo de 3 meses.'
                : 'Pago anual. Cancela el próximo cobro cuando quieras.'}
            </p>

            <div className={styles.priceRow}>
              <span className={styles.priceMain}>S/ {plan.amount.toFixed(2)}</span>
              <span className={styles.priceUnit}>
                / {plan.durationDays === 30 ? 'mes' : 'año'}
              </span>
            </div>

            <div className={styles.tosRow}>
              <label className={styles.tosLabel}>
                <input
                  type="checkbox"
                  className={styles.tosCheckbox}
                  checked={tos}
                  onChange={(e) => setTos(e.target.checked)}
                />
                <span>
                  {planKey === 'interno' ? (
                    <>
                      Acepto los{' '}
                      <a
                        className={styles.tosLink}
                        href="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        términos y condiciones
                      </a>{' '}
                      y entiendo que el plan mensual tiene un compromiso mínimo de{' '}
                      <strong>3 meses</strong>. Después puedo cancelar cuando quiera.
                    </>
                  ) : (
                    <>
                      Acepto los{' '}
                      <a
                        className={styles.tosLink}
                        href="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        términos y condiciones
                      </a>
                      . Puedo cancelar el próximo cobro anual cuando quiera; no hay devoluciones del periodo en curso.
                    </>
                  )}
                </span>
              </label>
              {planKey === 'interno' && (
                <div className={styles.tosLockBanner}>
                  Compromiso mínimo: 3 meses
                </div>
              )}
            </div>

            <div className={styles.brickWrap}>
              {!ready && <div className={styles.spinner}>Cargando pasarela…</div>}
              {ready && !tos && (
                <div className={styles.brickPlaceholder}>
                  Marca el checkbox de arriba para mostrar el formulario de pago.
                </div>
              )}
              {ready && tos && (
                <CardPayment
                  initialization={initialization}
                  customization={customization}
                  onSubmit={handleSubmit}
                  onError={handleError}
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
              {planKey === 'interno' ? (
                <>
                  Tu plan mensual incluye un <strong>compromiso mínimo de 3 meses</strong>. Después podrás cancelar desde{' '}
                  <strong>Mi cuenta</strong> cuando quieras.
                </>
              ) : (
                <>
                  Puedes cancelar el próximo cobro anual en cualquier momento desde <strong>Mi cuenta</strong>.
                  No hay devoluciones del periodo en curso.
                </>
              )}
              {' '}Si no recibes el correo en unos minutos, revisa la carpeta de Spam o Promociones.
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
