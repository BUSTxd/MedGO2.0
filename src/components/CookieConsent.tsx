'use client';

import { useConsent } from './ConsentProvider';
import styles from '@/styles/cookieConsent.module.css';

/**
 * Banner de consentimiento de cookies (Ley N° 29733 de Perú).
 * Solo aparece mientras el usuario no ha elegido (consent === 'unknown').
 *
 * Deja claro que las cookies NECESARIAS (sesión, dispositivo, preferencias)
 * siempre están activas porque sin ellas la plataforma no funciona, y que solo
 * las ANALÍTICAS (mapa de calor + estadísticas de uso) dependen de su permiso.
 */
export default function CookieConsent() {
  const { consent, accept, reject } = useConsent();

  if (consent !== 'unknown') return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.title}>🍪 Usamos cookies</p>
          <p className={styles.desc}>
            Las cookies <strong>necesarias</strong> siempre están activas porque la plataforma no
            funciona sin ellas. También usamos cookies de <strong>personalización</strong> para que la
            experiencia se adapte a ti y sea más cómoda. Puedes rechazarlas sin perder ninguna función.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.reject} onClick={reject}>
            Rechazar
          </button>
          <button type="button" className={styles.accept} onClick={accept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
