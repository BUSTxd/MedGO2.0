'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Consent = 'unknown' | 'granted' | 'denied';

/** Clave en localStorage. Reutilizada por trackEvent() y ClarityScript. */
export const CONSENT_KEY = 'medgo-consent';

interface ConsentContextValue {
  consent: Consent;
  accept: () => void;
  reject: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  consent: 'unknown',
  accept: () => {},
  reject: () => {},
});

/**
 * Estado global del consentimiento de cookies analíticas. Distingue:
 *  - cookies NECESARIAS (sesión Supabase, device_id, medgo-dark): siempre activas,
 *    no pasan por aquí.
 *  - cookies OPCIONALES (Microsoft Clarity + registro de eventos en /api/track):
 *    solo se activan si consent === 'granted'.
 *
 * Arranca en 'unknown' para evitar mismatch de hidratación; tras montar lee la
 * elección guardada (mismo patrón que `medgo-dark` en DashboardWrapper).
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>('unknown');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved === 'granted' || saved === 'denied') setConsent(saved);
    } catch {}
  }, []);

  const accept = useCallback(() => {
    try { localStorage.setItem(CONSENT_KEY, 'granted'); } catch {}
    setConsent('granted');
  }, []);

  const reject = useCallback(() => {
    try { localStorage.setItem(CONSENT_KEY, 'denied'); } catch {}
    setConsent('denied');
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, accept, reject }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
