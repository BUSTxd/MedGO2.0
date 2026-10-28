'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './avisoPagoCreem.module.css';

/**
 * Al volver del checkout de Creem (`?pago=creem`) el plan lo activa el webhook,
 * que puede tardar unos segundos. Mientras tanto avisa y pregunta cada 3 s; en
 * cuanto el plan está activo, refresca la página (ya desbloqueada).
 */
export default function AvisoPagoCreem() {
  const router = useRouter();
  const [estado, setEstado] = useState<'esperando' | 'listo' | 'tarde' | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('pago') !== 'creem') return;
    url.searchParams.delete('pago');
    window.history.replaceState(null, '', url.toString());
    setEstado('esperando');

    let vueltas = 0;
    const t = setInterval(async () => {
      vueltas++;
      try {
        const r = await fetch('/api/subscriptions/me', { cache: 'no-store' });
        const j = r.ok ? await r.json() : null;
        if (j?.planState?.isActive) {
          clearInterval(t);
          setEstado('listo');
          router.refresh();
          setTimeout(() => setEstado(null), 6000);
          return;
        }
      } catch { /* sigue intentando */ }
      if (vueltas >= 20) { clearInterval(t); setEstado('tarde'); }
    }, 3000);
    return () => clearInterval(t);
  }, [router]);

  if (!estado) return null;
  return createPortal(
    <div className={styles.aviso} role="status">
      {estado === 'esperando' && <>Confirmando tu pago con Creem… En unos segundos se abre tu plan.</>}
      {estado === 'listo' && <>¡Listo! Tu plan ya está activo.</>}
      {estado === 'tarde' && (
        <>La confirmación está tardando. Recarga la página en un minuto; si sigue igual, escríbenos a contacto@medgoplus.com.</>
      )}
      {estado !== 'esperando' && (
        <button type="button" className={styles.cerrar} onClick={() => setEstado(null)} aria-label="Cerrar">×</button>
      )}
    </div>,
    document.body,
  );
}
