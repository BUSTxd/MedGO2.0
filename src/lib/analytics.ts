/**
 * Eventos de actividad que registramos en Supabase (tabla analytics_events).
 * El backend (/api/track) tiene la misma whitelist; cualquier nombre fuera de
 * esta lista se rechaza.
 */
export type AnalyticsEvent =
  | 'pagina_vista'
  | 'clase_abierta'
  | 'banco_iniciado'
  | 'examen_completado'
  | 'resumen_abierto'
  | 'simulacion_abierta'
  | 'contenido_bloqueado'
  | 'pago_abierto';

/**
 * Registra la actividad del alumno dentro del dashboard. No depende del aviso
 * de cookies: es un dato de uso de la cuenta (declarado en /privacidad), no una
 * cookie. El aviso sigue gobernando Clarity, que sí es de terceros.
 *
 * `keepalive` evita perder el evento si dispara justo durante una navegación.
 * Fire-and-forget: nunca lanza ni bloquea la UI.
 */
export function trackEvent(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ event, props, path: window.location.pathname }),
    }).catch(() => {});
  } catch {}
}
