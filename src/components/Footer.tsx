import { CORREO } from '@/lib/contacto';
import { PROVEEDOR } from '@/lib/proveedor';
import styles from '@/styles/footer.module.css';

/**
 * El pie de toda la web pública (portada y páginas legales), con el diseño del
 * de la landing nueva: logo GO, lema y «Volver arriba». Suma la fila de enlaces
 * que piden la revisión de Creem (Términos, Privacidad, correo de soporte a la
 * vista) e INDECOPI (Libro de Reclamaciones).
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <a className={styles.brand} href="/" aria-label="MedGO, inicio"><span className={styles.brandMark} aria-hidden="true" /></a>
        <span>MedGO. Comprende las bases.</span>
        <a className={styles.arriba} href="#">Volver arriba ↗</a>
      </div>
      <nav className={styles.links} aria-label="Información legal y contacto">
        <a href="/#planes">Planes</a>
        <a href="/terminos">Términos y condiciones</a>
        <a href="/privacidad">Política de privacidad</a>
        <a href="/reembolsos">Política de reembolsos</a>
        <a href={`mailto:${CORREO}`}>{CORREO}</a>
        <a className={styles.libro} href="/libro-de-reclamaciones">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 8h7M9 11.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Libro de Reclamaciones
        </a>
      </nav>
      <div className={styles.bottom}>
        <span>
          © 2026 {PROVEEDOR.nombreComercial} · {PROVEEDOR.titular}
          {PROVEEDOR.ruc && <> · RUC {PROVEEDOR.ruc}</>}
        </span>
        <span>Aprende a tu ritmo, desde donde estés.</span>
      </div>
    </footer>
  );
}
