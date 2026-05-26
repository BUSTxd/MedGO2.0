'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/deviceList.module.css';

export interface DeviceListItem {
  id: string;
  deviceLabel: string;
  meta: string;
  isCurrent: boolean;
}

export default function DeviceList({
  items,
  emptyText = 'No tienes sesiones activas.',
}: {
  items: DeviceListItem[];
  emptyText?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  const handleRevoke = async (sessionId: string) => {
    setError(null);
    setRevoking(sessionId);
    try {
      const res = await fetch('/api/sessions/revoke', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ sessionId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? 'No se pudo cerrar la sesión.');
      }
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado.');
      setRevoking(null);
    }
  };

  return (
    <>
      <div className={styles.list}>
        {items.map((it) => (
          <div
            key={it.id}
            className={`${styles.card} ${it.isCurrent ? styles.cardCurrent : ''}`}
          >
            <div className={styles.info}>
              <p className={styles.deviceName}>
                {it.deviceLabel}
                {it.isCurrent && <span className={styles.currentBadge}>Este dispositivo</span>}
              </p>
              <p className={styles.meta}>{it.meta}</p>
            </div>
            <button
              className={styles.revokeBtn}
              onClick={() => handleRevoke(it.id)}
              disabled={isPending || revoking === it.id}
            >
              {revoking === it.id ? 'Cerrando…' : 'Cerrar sesión'}
            </button>
          </div>
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}
