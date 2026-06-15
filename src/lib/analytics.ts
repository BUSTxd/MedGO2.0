import { CONSENT_KEY } from '@/components/ConsentProvider';

/**
 * Eventos clave curados que registramos en Supabase (tabla analytics_events).
 * El backend (/api/track) tiene la misma whitelist; cualquier nombre fuera de
 * esta lista se rechaza.
 */
export type AnalyticsEvent =
  | 'clase_abierta'
  | 'banco_iniciado'
  | 'examen_completado'
  | 'resumen_abierto';

/**
 * Registra un evento de comportamiento. NO hace nada si el usuario no dio
 * consentimiento analítico (localStorage['medgo-consent'] !== 'granted').
 *
 * Usa `keepalive` para que el evento no se pierda si dispara justo durante una
 * navegación. Es fire-and-forget: nunca lanza ni bloquea la UI.
 */
export function trackEvent(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== 'granted') return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ event, props, path: window.location.pathname }),
    }).catch(() => {});
  } catch {}
}
