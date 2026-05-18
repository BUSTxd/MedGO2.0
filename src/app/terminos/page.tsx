import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/legal.module.css';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — MedGO',
  description: 'Términos y condiciones de uso de MedGO, planes de suscripción y compromiso mínimo del plan Interno.',
};

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
        <p className={styles.lastUpdated}>Última actualización: 18 de mayo de 2026</p>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Definiciones</h2>
          <p className={styles.p}>
            <strong>MedGO</strong> es una plataforma educativa digital orientada a estudiantes
            de medicina. <strong>Usuario</strong> es toda persona que crea una cuenta en
            <span> </span>medgoplus.com. <strong>Suscripción</strong> es el pago recurrente que
            otorga acceso al contenido premium.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Servicio</h2>
          <p className={styles.p}>
            MedGO ofrece cursos, sílabos personalizados, quizzes, atlas visuales y seguimiento
            de progreso. El acceso a estas funciones depende del plan elegido por el usuario.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Planes y precios</h2>
          <table className={styles.priceTable}>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Precio</th>
                <th>Periodicidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gratuito</td>
                <td>S/ 0</td>
                <td>—</td>
              </tr>
              <tr>
                <td>Interno</td>
                <td>S/ 14.00</td>
                <td>Mensual (cobro cada 30 días)</td>
              </tr>
              <tr>
                <td>Residente</td>
                <td>S/ 142.80</td>
                <td>Anual (cobro cada 365 días)</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.p}>
            Los precios están expresados en soles peruanos (PEN) e incluyen los impuestos
            aplicables. MedGO puede actualizar precios con aviso previo de 30 días; los cambios
            no afectan suscripciones ya autorizadas hasta su renovación.
          </p>
        </section>

        <section className={styles.callout}>
          <h2 className={styles.h2}>4. Compromiso mínimo — Plan Interno (mensual)</h2>
          <p className={styles.calloutBody}>
            Al contratar el plan <strong>Interno</strong> el usuario acepta un compromiso
            mínimo de <strong>3 cobros mensuales consecutivos</strong> (S/ 14 × 3 = S/ 42).
            El botón de &quot;Cancelar suscripción&quot; en Mi cuenta se habilitará al cumplirse
            los 3 meses contados desde la fecha de la primera autorización del pago. Antes de
            esa fecha la suscripción no es cancelable a través de la plataforma. No existe
            devolución parcial ni total de los cobros realizados dentro de ese periodo.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Plan Residente (anual)</h2>
          <p className={styles.p}>
            El plan Residente es <strong>cancelable en cualquier momento</strong> desde Mi
            cuenta. La cancelación detiene la renovación anual pero el usuario mantiene acceso
            al contenido premium hasta el final del periodo pagado. <strong>No existen
            devoluciones del año en curso.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Sin reembolsos automáticos</h2>
          <p className={styles.p}>
            MedGO no procesa reembolsos automáticos sobre cobros ya realizados. La cancelación
            de una suscripción detiene los cobros futuros, pero el periodo en curso permanece
            activo hasta su vencimiento. Para reclamos o casos excepcionales el usuario puede
            escribir a soporte; cualquier devolución queda a discreción de MedGO y se evalúa
            caso por caso.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>7. Modificaciones</h2>
          <p className={styles.p}>
            MedGO puede modificar estos términos. Los cambios serán publicados en esta página
            con la fecha de actualización. El uso continuado de la plataforma tras la
            publicación implica la aceptación de los términos modificados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>8. Contacto</h2>
          <p className={styles.p}>
            Para consultas sobre estos términos escribe a{' '}
            <a className={styles.link} href="mailto:soporte@medgoplus.com">
              soporte@medgoplus.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
