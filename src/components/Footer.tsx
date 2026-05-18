import styles from '@/styles/footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>Med<span>GO</span></div>
      <div className={styles.links}>
        <a href="#">Cursos</a>
        <a href="#">Precios</a>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Contacto</a>
        <a href="/terminos">Términos</a>
        <a href="/privacidad">Privacidad</a>
      </div>
      <div className={styles.copy}>© 2026 MedGO. Todos los derechos reservados.</div>
    </footer>
  );
}
