/** A dónde entra quien inicia sesión sin pedir otra cosa: /estudio decide (la interfaz nueva para Cayetano, el dashboard para el resto). */
export const DESTINO_POR_DEFECTO = '/estudio';

/** Cookie corta con el `next` del login, para la vuelta de Google (ver `/auth/callback`). */
export const COOKIE_DESTINO = 'medgo-next';

/** Guarda el destino antes de salir hacia Google: 10 minutos, sólo para este sitio. */
export function recordarDestino(next: string) {
  document.cookie = `${COOKIE_DESTINO}=${encodeURIComponent(next)}; Path=/; Max-Age=600; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

/**
 * El `?next=` del login, validado: sólo rutas internas. `${origin}${next}` con
 * `next=@evil.com` o `.evil.com` sacaba al usuario a otro host justo después de
 * iniciar sesión. Tampoco vuelve a `/auth/…` (el login otra vez sería un bucle).
 *
 * La comparten el login (contraseña y registro), `/auth/callback` (Google) y el
 * middleware: los tres tienen que dejar pasar exactamente lo mismo.
 */
export function destinoSeguro(next: string | null | undefined, origin: string): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return DESTINO_POR_DEFECTO;
  }
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin || url.pathname.startsWith('/auth/')) return DESTINO_POR_DEFECTO;
    return url.pathname + url.search + url.hash;
  } catch {
    return DESTINO_POR_DEFECTO;
  }
}
