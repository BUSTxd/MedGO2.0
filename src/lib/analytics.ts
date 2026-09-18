/**
 * Eventos de actividad que registramos en Supabase (tabla analytics_events).
 * El backend (/api/track) tiene la misma whitelist; cualquier nombre fuera de
 * esta lista se rechaza.
 */
export type AnalyticsEvent =
  | 'pagina_vista'
  | 'pagina_salida'
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
 *
 * `path` sustituye a la ruta actual (la salida de una página se manda cuando la
 * URL ya es la siguiente). `beacon` usa sendBeacon, lo único que el navegador
 * garantiza entregar mientras la pestaña se oculta o se cierra.
 */
export function trackEvent(
  event: AnalyticsEvent,
  props: Record<string, unknown> = {},
  opts: { path?: string; beacon?: boolean } = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    const body = JSON.stringify({ event, props, path: opts.path ?? window.location.pathname });
    if (opts.beacon && navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body,
    }).catch(() => {});
  } catch {}
}
