import { CORREO } from '@/lib/contacto';
import { PROVEEDOR } from '@/lib/proveedor';
import styles from '@/styles/footer.module.css';

/**
 * El pie de toda la web pública (portada y páginas legales), con el diseño de la
 * portada anterior. Lleva lo que piden la revisión de Creem (Términos,
 * Privacidad y el correo de soporte a la vista) e INDECOPI (Libro de
 * Reclamaciones).
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.fila}>
        <a href="/" className={styles.logo} aria-label="MedGO, inicio">Med<span>GO</span></a>
        <nav className={styles.links} aria-label="Enlaces del sitio">
          <a href="/#planes">Planes</a>
          <a href="/terminos">Términos y condiciones</a>
          <a href="/privacidad">Política de privacidad</a>
          <a href="/reembolsos">Política de reembolsos</a>
          <a href={`mailto:${CORREO}`}>{CORREO}</a>
        </nav>
        <a href="/libro-de-reclamaciones" className={styles.libro}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 8h7M9 11.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Libro de Reclamaciones
        </a>
      </div>
      <div className={styles.copy}>
        © 2026 {PROVEEDOR.nombreComercial} · {PROVEEDOR.titular}
        {PROVEEDOR.ruc && <> · RUC {PROVEEDOR.ruc}</>} · Todos los derechos reservados.
      </div>
    </footer>
  );
}
