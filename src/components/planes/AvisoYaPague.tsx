'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlan } from '../PlanProvider';
import styles from '@/styles/avisoYaPague.module.css';

export interface ResultadoRevision {
  ok: boolean;
  texto: string;
}

const LISTO = 'Encontramos tu pago: tu acceso ya está activo.';

/**
 * Pide al servidor que compruebe en Mercado Pago si la cuota ya se cobró
 * (`api/subscriptions/revisar`). La compartan Mi cuenta y los modales de pago.
 */
export function useRevisarPago(onListo?: () => void) {
  const router = useRouter();
  const { refreshPlan } = usePlan();
  const [revisando, setRevisando] = useState(false);
  const [revision, setRevision] = useState<ResultadoRevision | null>(null);

  const marcarListo = useCallback(async () => {
    setRevision({ ok: true, texto: LISTO });
    await refreshPlan();
    router.refresh();
    // Un momento para leer el mensaje antes de cerrar el modal.
    if (onListo) setTimeout(onListo, 1600);
  }, [refreshPlan, router, onListo]);

  const revisar = useCallback(async () => {
    setRevisando(true);
    setRevision(null);
    try {
      const res = await fetch('/api/subscriptions/revisar', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      const estado = json?.estado as string | undefined;
      if (estado === 'actualizado' || estado === 'activo') {
        await marcarListo();
      } else if (estado === 'sin_pago') {
        setRevision({ ok: false, texto: 'Mercado Pago todavía no registra tu pago. Si acabas de pagar, espera un minuto y vuelve a revisar.' });
      } else if (estado === 'espera' || res.status === 429) {
        setRevision({ ok: false, texto: 'Ya lo revisamos hace un momento. Espera unos segundos y vuelve a intentarlo.' });
      } else if (estado === 'sin_suscripcion') {
        setRevision({ ok: false, texto: 'No encontramos una suscripción de Mercado Pago activa en tu cuenta.' });
      } else {
        setRevision({ ok: false, texto: 'No pudimos consultar a Mercado Pago. Intenta de nuevo en unos minutos.' });
      }
    } catch {
      setRevision({ ok: false, texto: 'Error de conexión. Intenta de nuevo.' });
    }
    setRevisando(false);
  }, [marcarListo]);

  return { revisando, revision, revisar, marcarListo };
}

/** Línea de estado bajo el botón (Mi cuenta y modales). */
export function EstadoRevision({ revision }: { revision: ResultadoRevision | null }) {
  if (!revision) return null;
  return (
    <p className={`${styles.estado} ${revision.ok ? styles.ok : styles.mal}`} role="status">
      {revision.texto}
    </p>
  );
}

/**
 * «¿Ya pagaste tu cuota? Revisar mi pago» en los modales de pago.
 *
 * Solo aparece a quien tiene el plan vencido y una suscripción de Mercado Pago
 * viva: es justo quien, al ver el candado, podría creer que tiene que volver a
 * pagar. Al abrirse consulta `api/subscriptions/me`, que ya pasa por la
 * revisión al entrar: si eso lo arregló, lo dice sin que haga falta pulsar.
 */
export default function AvisoYaPague({ onListo, centrado = false }: { onListo?: () => void; centrado?: boolean }) {
  const { plan, isActive } = usePlan();
  const [visible, setVisible] = useState(false);
  const { revisando, revision, revisar, marcarListo } = useRevisarPago(onListo);

  useEffect(() => {
    if (plan === 'free' || isActive) return;
    let vivo = true;
    fetch('/api/subscriptions/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!vivo || !j?.subscription?.mp_preapproval_id) return;
        setVisible(true);
        if (j.planState?.isActive) void marcarListo();
      })
      .catch(() => {});
    return () => { vivo = false; };
    // marcarListo cambia con el router; basta con consultarlo al abrir.
  }, [plan, isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;
  return (
    <div className={`${styles.aviso} ${centrado ? styles.centrado : ''}`}>
      {!revision?.ok && (
        <span>
          ¿Ya pagaste tu cuota?{' '}
          <button type="button" className={styles.enlace} onClick={revisar} disabled={revisando}>
            {revisando ? 'Revisando…' : 'Revisar mi pago'}
          </button>
        </span>
      )}
      <EstadoRevision revision={revision} />
    </div>
  );
}
