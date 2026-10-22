import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { COOKIE_DESTINO, destinoSeguro } from '@/lib/destino';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // El login con Google no lleva `?next=` en el `redirectTo` (Supabase lo compara con su
  // lista de URLs permitidas y, si no casa, se iría a la Site URL): deja el destino en
  // una cookie corta antes de salir hacia Google, y aquí se lee.
  const deCookie = request.cookies.get(COOKIE_DESTINO)?.value;
  const next = destinoSeguro(searchParams.get('next') ?? (deCookie?.startsWith('%') ? decodeURIComponent(deCookie) : deCookie), origin);
  const errorDescription = searchParams.get('error_description');
  const conDestino = (url: string) => {
    const res = NextResponse.redirect(url);
    res.cookies.delete(COOKIE_DESTINO);
    return res;
  };

  if (errorDescription) {
    return conDestino(`${origin}/auth/login?error=${encodeURIComponent(errorDescription)}`);
  }

  if (!code) {
    return conDestino(`${origin}/auth/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return conDestino(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  return conDestino(`${origin}${next}`);
}
