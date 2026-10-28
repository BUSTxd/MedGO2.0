import { CORREO } from '@/lib/contacto';
import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Med<span>GO</span></div>
      <div className={styles.links}>
        <a href="/">Inicio</a>
        <a href="/#planes">Planes</a>
        <a href={`mailto:${CORREO}`}>Contacto</a>
        <a href="/terminos">Términos</a>
        <a href="/privacidad">Privacidad</a>
        <a href="/reembolsos">Reembolsos</a>
      </div>
      <div className={styles.copy}>© 2026 MedGO. Todos los derechos reservados.</div>
    </footer>
  );
}
