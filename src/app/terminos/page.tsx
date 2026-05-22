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
        <div className={styles.hero}>
          <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
          <p className={styles.lastUpdated}>Última actualización: 22 de mayo de 2026</p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Definiciones</h2>
          <p className={styles.p}>
            <strong>MedGO</strong> es una plataforma educativa digital orientada a estudiantes
            de medicina. <strong>Usuario</strong> es toda persona que crea una cuenta en
            <span> </span>medgoplus.com. <strong>Suscripción</strong> es el pago recurrente que
            otorga acceso al contenido premium. Estos términos constituyen un contrato entre
            el usuario y MedGO; al crear una cuenta o usar la plataforma el usuario los acepta
            íntegramente.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Servicio</h2>
          <p className={styles.p}>
            MedGO ofrece cursos, sílabos personalizados, quizzes, atlas visuales y seguimiento
            de progreso. El acceso a estas funciones depende del plan elegido por el usuario.
            MedGO puede agregar, modificar o retirar contenido sin previo aviso, manteniendo
            la calidad general del servicio contratado.
          </p>
        </section>

        <section className={styles.callout}>
          <h2 className={styles.h2}>3. Aviso: contenido educativo, no consejo médico</h2>
          <p className={styles.calloutBody}>
            El contenido publicado en MedGO es <strong>material educativo</strong> dirigido a
            estudiantes de medicina y profesionales en formación. <strong>No constituye consejo
            médico</strong> para pacientes, no reemplaza la consulta con un médico colegiado y
            no debe usarse para autodiagnóstico ni para tomar decisiones clínicas sobre terceros.
            MedGO no se responsabiliza por el uso clínico que el usuario haga del contenido.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Cuenta y elegibilidad</h2>
          <p className={styles.p}>
            Para crear una cuenta el usuario debe tener al menos <strong>16 años</strong> (o
            la edad mínima exigida por la legislación de su país de residencia). El usuario es
            responsable de mantener la confidencialidad de su contraseña y de toda actividad
            realizada bajo su cuenta. Está prohibido compartir credenciales o ceder el acceso
            a terceros; MedGO puede suspender cuentas con uso anómalo o compartido.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Inicio de sesión con Google</h2>
          <p className={styles.p}>
            MedGO permite crear cuenta e iniciar sesión utilizando <strong>Google Sign-In</strong>.
            Al hacerlo el usuario autoriza a Google a compartir con MedGO su nombre, correo
            electrónico y foto de perfil. MedGO no recibe la contraseña de Google ni accede a
            otros datos de la cuenta del usuario. El usuario puede revocar este acceso en
            cualquier momento desde{' '}
            <a className={styles.link} href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
              su panel de Google
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Planes y precios</h2>
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
          <h2 className={styles.h2}>7. Compromiso mínimo — Plan Interno (mensual)</h2>
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
          <h2 className={styles.h2}>8. Plan Residente (anual)</h2>
          <p className={styles.p}>
            El plan Residente es <strong>cancelable en cualquier momento</strong> desde Mi
            cuenta. La cancelación detiene la renovación anual pero el usuario mantiene acceso
            al contenido premium hasta el final del periodo pagado. <strong>No existen
            devoluciones del año en curso.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>9. Sin reembolsos automáticos</h2>
          <p className={styles.p}>
            MedGO no procesa reembolsos automáticos sobre cobros ya realizados. La cancelación
            de una suscripción detiene los cobros futuros, pero el periodo en curso permanece
            activo hasta su vencimiento. Para reclamos o casos excepcionales el usuario puede
            escribir a soporte; cualquier devolución queda a discreción de MedGO y se evalúa
            caso por caso.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>10. Propiedad intelectual</h2>
          <p className={styles.p}>
            Todo el contenido publicado en MedGO —cursos, textos, ilustraciones, audios, vídeos,
            quizzes, sílabos y código fuente— es propiedad de MedGO o se utiliza bajo licencia.
            El usuario obtiene un <strong>derecho de uso personal, no transferible y no exclusivo</strong>{' '}
            para fines educativos individuales. Queda prohibido descargar, copiar, redistribuir,
            revender o subir el contenido a terceros sin autorización escrita de MedGO. El
            scraping automatizado y el uso del contenido para entrenar modelos de IA están
            expresamente prohibidos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>11. Conducta del usuario</h2>
          <p className={styles.p}>
            El usuario se compromete a no utilizar la plataforma para fines ilícitos, no
            intentar acceder a datos de otros usuarios, no realizar ingeniería inversa del
            código, y no interferir con el funcionamiento técnico del servicio. MedGO puede
            suspender o cancelar la cuenta de usuarios que incumplan estos puntos, sin
            derecho a devolución de los cobros ya realizados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>12. Limitación de responsabilidad</h2>
          <p className={styles.p}>
            El servicio se ofrece &quot;tal cual&quot;. MedGO no garantiza disponibilidad
            ininterrumpida del 100 % y no se responsabiliza por daños indirectos derivados
            del uso de la plataforma. La responsabilidad máxima de MedGO ante cualquier reclamo
            se limita al monto pagado por el usuario en los <strong>12 meses</strong> previos
            al hecho que lo motiva.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>13. Cancelación de cuenta por el usuario</h2>
          <p className={styles.p}>
            El usuario puede solicitar la eliminación de su cuenta escribiendo a{' '}
            <a className={styles.link} href="mailto:soporte@medgoplus.com">
              soporte@medgoplus.com
            </a>
            . La eliminación implica el borrado de sus datos personales y de progreso, salvo
            registros contables que MedGO esté obligado a conservar por ley. La eliminación
            de la cuenta no exime al usuario de los cobros pendientes derivados del compromiso
            mínimo del plan Interno.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>14. Modificaciones</h2>
          <p className={styles.p}>
            MedGO puede modificar estos términos. Los cambios serán publicados en esta página
            con la fecha de actualización. El uso continuado de la plataforma tras la
            publicación implica la aceptación de los términos modificados.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>15. Ley aplicable y jurisdicción</h2>
          <p className={styles.p}>
            Estos términos se rigen por las leyes de la <strong>República del Perú</strong>.
            Cualquier controversia derivada de su interpretación o aplicación será sometida a
            la jurisdicción de los tribunales del distrito judicial de Lima Centro, sin
            perjuicio de los derechos del consumidor reconocidos por INDECOPI.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>16. Contacto</h2>
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
