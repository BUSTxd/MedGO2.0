'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ProfilePlan } from '@/lib/plans';
import styles from '@/styles/accountPage.module.css';

interface SubRow {
  id: string;
  plan_key: 'interno' | 'residente';
  status: 'pending' | 'authorized' | 'paused' | 'cancelled';
  amount: number;
  currency: string;
  next_payment_date: string | null;
  mp_preapproval_id: string;
  created_at: string;
}

interface Props {
  plan: ProfilePlan;
  planLabel: string;
  expiresAt: string | null;
  subscription: SubRow | null;
}

const formatDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function SubscriptionPanel({
  plan,
  planLabel,
  expiresAt,
  subscription,
}: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFree = plan === 'free';
  const isCancelled = subscription?.status === 'cancelled';
  const isActive = subscription?.status === 'authorized';
  const isInterno = subscription?.plan_key === 'interno';
  const isResidente = subscription?.plan_key === 'residente';
  const expiresLabel = formatDate(expiresAt);
  const nextPayment = formatDate(subscription?.next_payment_date ?? null);

  const unlockDate = isInterno && subscription
    ? (() => {
        const d = new Date(subscription.created_at);
        d.setMonth(d.getMonth() + 3);
        return d;
      })()
    : null;
  const isLocked = unlockDate ? unlockDate.getTime() > Date.now() : false;
  const unlockLabel = unlockDate ? formatDate(unlockDate.toISOString()) : null;

  const handleCancel = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/subscriptions/cancel', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) {
        if (json?.error === 'lock_period_active' && json?.unlockAt) {
          setError(
            `Tu plan mensual tiene un compromiso mínimo de 3 meses. Podrás cancelar a partir del ${formatDate(json.unlockAt)}.`,
          );
        } else if (json?.error === 'no_active_subscription') {
          setError('No tienes una suscripción activa.');
        } else {
          setError('No se pudo cancelar. Intenta de nuevo o contáctanos.');
        }
        setBusy(false);
        return;
      }
      setConfirmOpen(false);
      setBusy(false);
      router.refresh();
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
      setBusy(false);
    }
  };

  return (
    <>
      <section className={styles.card}>
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Suscripción</h2>
        </header>

        <div className={styles.planRow}>
          <div>
            <div className={styles.planLabel}>Plan {planLabel}</div>
            {!isFree && subscription && (
              <div className={styles.planMeta}>
                S/ {Number(subscription.amount).toFixed(2)}/{isResidente ? 'año' : 'mes'}
              </div>
            )}
          </div>

          <span className={`${styles.badge} ${
            isFree ? styles.badgeFree :
            isCancelled ? styles.badgeCancelled :
            isActive ? styles.badgeActive : styles.badgePending
          }`}>
            {isFree ? 'Gratuito' :
             isCancelled ? 'Cancelada' :
             isActive ? 'Activa' :
             subscription?.status ?? 'Sin estado'}
          </span>
        </div>

        {!isFree && expiresLabel && (
          <p className={styles.dateLine}>
            {isCancelled
              ? <>Tu acceso premium termina el <strong>{expiresLabel}</strong>.</>
              : <>Próximo cobro: <strong>{nextPayment ?? expiresLabel}</strong></>}
          </p>
        )}

        {isFree && (
          <p className={styles.dateLine}>
            No tienes una suscripción activa.{' '}
            <Link href="/#precios" className={styles.linkInline}>Ver planes</Link>
          </p>
        )}

        {!isFree && isActive && (
          <>
            <div className={styles.actionRow}>
              <button
                className={`${styles.cancelBtn} ${isLocked ? styles.cancelBtnDisabled : ''}`}
                onClick={() => { setError(null); setConfirmOpen(true); }}
                disabled={isLocked}
                aria-disabled={isLocked}
              >
                Cancelar suscripción
              </button>

              <span
                className={styles.helpIcon}
                tabIndex={0}
                aria-label={
                  isLocked
                    ? `Tu plan Interno tiene un compromiso mínimo de 3 meses. Podrás cancelar a partir del ${unlockLabel}.`
                    : `Mantienes acceso hasta ${expiresLabel ?? 'el final del periodo pagado'}. Después tu cuenta vuelve al plan gratuito.`
                }
              >
                ?
                <span className={styles.tooltip} role="tooltip">
                  {isLocked ? (
                    <>
                      Tu plan Interno tiene un compromiso mínimo de 3 meses. Podrás cancelar a partir del{' '}
                      <strong>{unlockLabel}</strong>.
                    </>
                  ) : (
                    <>
                      Al cancelar mantienes acceso hasta{' '}
                      {expiresLabel ? <strong>{expiresLabel}</strong> : 'el final del periodo pagado'}.
                      Después tu cuenta vuelve al plan gratuito.
                    </>
                  )}
                </span>
              </span>
            </div>

            {isLocked && (
              <p className={styles.lockNotice}>
                Cancelable desde el <strong>{unlockLabel}</strong>
              </p>
            )}
          </>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </section>

      {confirmOpen && (
        <div className={styles.modalBackdrop} onClick={() => !busy && setConfirmOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>¿Cancelar tu suscripción?</h3>
            <p className={styles.modalBody}>
              No se realizarán más cobros. Mantendrás acceso al contenido premium hasta{' '}
              <strong>{expiresLabel ?? 'el final del periodo pagado'}</strong>. Después tu cuenta volverá al plan gratuito.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.secondaryBtn}
                onClick={() => setConfirmOpen(false)}
                disabled={busy}
              >
                No, mantener
              </button>
              <button
                className={styles.confirmCancelBtn}
                onClick={handleCancel}
                disabled={busy}
              >
                {busy ? 'Cancelando…' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
