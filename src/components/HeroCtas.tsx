'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function HeroCtas() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Link href={loggedIn ? '/dashboard/cursos' : '/auth/login'}>
        <button className="btn-primary">{loggedIn ? 'Entrar' : 'Iniciar Sesión'}</button>
      </Link>
      <a href="#cursos">
        <button className="btn-ghost">Explorar cursos →</button>
      </a>
    </>
  );
}
