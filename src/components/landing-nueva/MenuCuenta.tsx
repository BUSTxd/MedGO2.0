'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { c } from './estilos';

/**
 * Con la sesión iniciada, el sitio de «Iniciar sesión» en la cabecera pasa a
 * «Mi cuenta»: abre un menú con el correo, Mi cuenta y Cerrar sesión.
 */
export default function MenuCuenta({ email }: { email: string | null }) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierto(false); };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  async function salir() {
    await createClient().auth.signOut();
    // Navegación completa: limpia las cookies en el servidor y reinicia el estado de sesión.
    window.location.assign('/');
  }

  return (
    <div ref={caja} className={c('cuenta-landing')}>
      <button
        type="button"
        className={c('header-secondary header-login')}
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((a) => !a)}
      >
        Mi cuenta <span aria-hidden="true">▾</span>
      </button>
      {abierto && (
        <div className={c('cuenta-landing-menu')} role="menu">
          {email && <p className={c('cuenta-landing-correo')}>{email}</p>}
          <Link href="/estudio/cuenta" role="menuitem" onClick={() => setAbierto(false)}>Mi cuenta</Link>
          <button type="button" role="menuitem" onClick={salir}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
