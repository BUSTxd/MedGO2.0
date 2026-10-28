'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PLANS, type PlanKey } from '@/lib/plans';
import { ofertaDe } from './oferta';
import styles from '@/styles/subscribeModal.module.css';

/**
 * Compra con Creem (fuera del Perú): resumen en dólares, el aviso de que Creem
 * cobra como merchant of record (lo exigen sus términos, cl. 3.7) y el salto a
 * su checkout. El plan lo activa el webhook (`api/webhooks/creem`) al volver.
 */
export default function PagoCreem({
  open,
  planKey,
  onClose,
  onCambiar,
}: {
  open: boolean;
  planKey: PlanKey;
  onClose: () => void;
  onCambiar: () => void;
}) {
  const [tos, setTos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', tecla);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', tecla);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const plan = PLANS[planKey];
  const o = ofertaDe(plan, 'creem');
  const cada = plan.creem?.meses ?? 1;

  async function pagar() {
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, volverA: window.location.pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
        window.location.assign(`/auth/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!res.ok || !json.url) {
        setError(
          json.error === 'already_subscribed'
            ? 'Ya tienes un plan activo. Puedes verlo en Mi cuenta.'
            : json.error === 'creem_no_configurado'
              ? 'El pago en dólares aún no está disponible. Escríbenos a contacto@medgoplus.com.'
              : 'No pudimos abrir el pago. Inténtalo otra vez en un momento.',
        );
        setEnviando(false);
        return;
      }
      window.location.assign(json.url);
    } catch {
      setError('No pudimos abrir el pago. Revisa tu conexión.');
      setEnviando(false);
    }
  }

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
        <h3 className={styles.title}>Suscribirme al plan {plan.label}</h3>
        <p className={styles.subtitle}>
          {cada > 1
            ? `Pago por adelantado de ${cada === 12 ? '1 año' : '2 años'}. Cancela la renovación cuando quieras.`
            : 'Pago mensual. Cancela cuando quieras.'}
        </p>
        <button type="button" className={styles.cambiar} onClick={onCambiar}>
          ¿Prefieres pagar en soles? Hazlo con Mercado Pago
        </button>

        <div className={styles.priceRow}>
          <span className={styles.priceMain}>US$ {o.importe}</span>
          <span className={styles.priceUnit}>/ {o.periodo}</span>
        </div>
        {cada > 1 && <p className={styles.subtitle}>{o.cobro}</p>}

        <div className={styles.tosRow}>
          <label className={styles.tosLabel}>
            <input type="checkbox" className={styles.tosCheckbox} checked={tos} onChange={(e) => setTos(e.target.checked)} />
            <span>
              Acepto los{' '}
              <a className={styles.tosLink} href="/terminos" target="_blank" rel="noopener noreferrer">términos y condiciones</a>
              {' '}y la{' '}
              <a className={styles.tosLink} href="/reembolsos" target="_blank" rel="noopener noreferrer">política de reembolsos</a>.
              El pago lo procesa <strong>Creem</strong> como <em>merchant of record</em>: Creem es el
              vendedor, cobra los impuestos de tu país y aparece en el extracto de tu tarjeta.
            </span>
          </label>
        </div>

        <button type="button" className={styles.continueBtn} disabled={!tos || enviando} onClick={pagar}>
          {enviando ? 'Abriendo el pago seguro…' : `Continuar al pago · US$ ${o.importe}`}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>,
    document.body,
  );
}
