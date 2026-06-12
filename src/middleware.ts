import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DEVICE_COOKIE = 'device_id';
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Asegura que existe una cookie persistente de device_id antes de cualquier otra lógica.
  // El device_id identifica al navegador a través de sesiones para limitar dispositivos
  // concurrentes en cuentas pagas.
  const existingDeviceId = request.cookies.get(DEVICE_COOKIE)?.value;
  if (!existingDeviceId) {
    const newId = crypto.randomUUID();
    request.cookies.set(DEVICE_COOKIE, newId);
    supabaseResponse = NextResponse.next({ request });
    supabaseResponse.cookies.set(DEVICE_COOKIE, newId, {
      httpOnly: true,
      sameSite: 'lax',
      secure:   true,
      maxAge:   DEVICE_COOKIE_MAX_AGE,
      path:     '/',
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const isDeviceLimit  = pathname.startsWith('/auth/device-limit');
  const isClearDevice  = pathname.startsWith('/auth/clear-device');
  // Rutas /auth que pueden visitarse con sesión activa (no rebotar a /dashboard).
  const isAuthEscape = isDeviceLimit || isClearDevice;

  // Rutas protegidas: redirige al login si no hay sesión.
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // /auth/device-limit requiere sesión (es la pantalla post-login de bloqueo).
  if (!user && isDeviceLimit) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // /dashboard exacto → /dashboard/home en el middleware (antes del render del layout),
  // evita el salto extra que causaba un flash de error al recién loguearse.
  if (user && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  // Si ya está logueado y va a otra ruta de /auth (login, signup), redirige al dashboard/home.
  // Excepción: device-limit y clear-device son válidas con sesión activa.
  if (user && pathname.startsWith('/auth') && !isAuthEscape) {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  return supabaseResponse;
}

export const config = {
  // `/dashboard` se declara explícito además de `/dashboard/:path*`: el matcher
  // con `:path*` no captura de forma fiable la ruta base exacta, y necesitamos
  // que el middleware corra en `/dashboard` para protegerla y redirigir a /home.
  matcher: ['/dashboard', '/dashboard/:path*', '/auth/:path*'],
};
