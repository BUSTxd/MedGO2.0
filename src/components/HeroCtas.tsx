'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function HeroCtas() {
  const { user } = useAuth();
  const loggedIn = !!user;

  return (
    <>
      <Link href={loggedIn ? '/dashboard/home' : '/auth/login'}>
        <button className="btn-primary">{loggedIn ? 'Entrar' : 'Iniciar Sesión'}</button>
      </Link>
      <a href="#cursos">
        <button className="btn-ghost">Explorar cursos →</button>
      </a>
    </>
  );
}
