'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const CANAL = 'en-linea';

/**
 * Anuncia al usuario en el canal de presencia mientras mira el dashboard. Con la
 * pestaña oculta se retira: «activo» es tener la web delante, no una pestaña
 * olvidada. Al cerrar, Realtime lo da por ido cuando el socket deja de latir.
 */
export function AnunciarPresencia({ token }: { token: string }) {
  useEffect(() => {
    const canal = createClient().channel(CANAL, { config: { presence: { key: token } } });
    let unido = false;

    const sincronizar = () => {
      if (!unido) return;
      if (document.visibilityState === 'visible') void canal.track({});
      else void canal.untrack();
    };

    canal.subscribe((estado) => {
      unido = estado === 'SUBSCRIBED';
      sincronizar();
    });
    document.addEventListener('visibilitychange', sincronizar);

    return () => {
      document.removeEventListener('visibilitychange', sincronizar);
      void canal.unsubscribe();
    };
  }, [token]);

  return null;
}

/** Los tokens que están en línea ahora mismo; se actualiza en vivo. */
export function useEnLinea(): Set<string> {
  const [enLinea, setEnLinea] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const canal = createClient().channel(CANAL);
    canal
      .on('presence', { event: 'sync' }, () => setEnLinea(new Set(Object.keys(canal.presenceState()))))
      .subscribe();
    return () => { void canal.unsubscribe(); };
  }, []);

  return enLinea;
}
