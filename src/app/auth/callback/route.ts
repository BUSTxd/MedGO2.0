import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Sólo rutas internas: `${origin}${next}` con `next=@evil.com` o `.evil.com`
 * sacaba al usuario a otro host justo después de iniciar sesión.
 */
function destinoSeguro(next: string | null, origin: string): string {
  const porDefecto = '/dashboard/home';
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return porDefecto;
  }
  try {
    const url = new URL(next, origin);
    return url.origin === origin ? url.pathname + url.search + url.hash : porDefecto;
  } catch {
    return porDefecto;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = destinoSeguro(searchParams.get('next'), origin);
  const errorDescription = searchParams.get('error_description');

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(errorDescription)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
