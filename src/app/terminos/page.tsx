import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PLANS } from '@/lib/plans';
import { CORREO } from '@/lib/contacto';
import { PROVEEDOR } from '@/lib/proveedor';
import styles from '@/styles/legal.module.css';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — MedGO',
  description: 'Términos y condiciones de uso de MedGO, planes de suscripción y permanencia mínima.',
};

/** Solo los que se pueden comprar hoy, en el orden de sus tarjetas. */
const PLANES = Object.values(PLANS).filter((p) => p.aLaVenta).sort(
  (a, b) => (a.orden ?? 0) - (b.orden ?? 0) || a.durationDays - b.durationDays,
);
/** Los que se venden también con Creem (fuera del Perú), en dólares. */
const CON_CREEM = PLANES.filter((p) => p.creem);
const cadaCreem = (meses: number) => (meses === 1 ? 'Cada mes' : meses === 12 ? 'Cada año, por adelantado' : `Cada ${meses / 12} años, por adelantado`);
/** Los que llevan permanencia mínima, para la sección 7. */
const CON_COMPROMISO = PLANES.filter((p) => p.commitmentMonths);
const SIN_COMPROMISO = PLANES.filter((p) => !p.commitmentMonths);

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <div className={styles.hero}>
          <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
          <p className={styles.lastUpdated}>Última actualización: 28 de octubre de 2026</p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Definiciones</h2>
          <p className={styles.p}>
            <strong>MedGO</strong> es una plataforma educativa digital orientada a estudiantes
            de medicina, cuyo titular es <strong>{PROVEEDOR.titular}</strong>
            {PROVEEDOR.ruc && <> (RUC {PROVEEDOR.ruc})</>}. <strong>Usuario</strong> es toda persona que crea una cuenta en
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
                <th>Permanencia</th>
              </tr>
            </thead>
            <tbody>
              {/* Recorrido sobre el catálogo, no una lista escrita a mano: al
                  añadir un plan la tabla legal se actualiza sola. Un precio que
                  aquí diga otra cosa que el cobrado es un problema, no un typo. */}
              {PLANES.map((p) => (
                <tr key={p.key}>
                  <td>{p.label}</td>
                  <td>S/ {p.amount.toFixed(2)}</td>
                  <td>
                    {p.durationDays === 30
                      ? 'Mensual (cobro cada 30 días)'
                      : 'Anual (cobro cada 365 días)'}
                  </td>
                  <td>{p.commitmentMonths ? `${p.commitmentMonths} meses` : 'Sin permanencia'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.p}>
            Sin un plan activo el usuario solo puede ver el temario. Todos los planes dan acceso a
            Preclínicos y al contenido de la universidad del usuario;{' '}
            {PLANES.filter((p) => p.nivel === 'completo').map((p, i, l) => (
              <span key={p.key}>
                {i > 0 && (i === l.length - 1 ? ' y ' : ', ')}
                <strong>{p.label}</strong>
              </span>
            ))}{' '}
            dan acceso, además, a las metas de examen (como el ENCIB), al laboratorio virtual y a
            MedGO IA cuando esté disponible.
          </p>
          <p className={styles.p}>
            Quien contrató un plan anterior (UFBI, Interno o Residente anual) lo conserva con su
            precio, su acceso y sus condiciones mientras no lo cancele.
          </p>
          <p className={styles.p}>
            Los precios están expresados en soles peruanos (PEN) e incluyen los impuestos
            aplicables. En los pagos procesados por Creem, el importe, la moneda y los impuestos
            son los que se muestran en la página de pago antes de confirmar. MedGO puede actualizar
            precios con aviso previo de 30 días; los cambios no afectan suscripciones ya
            autorizadas hasta su renovación.
          </p>
          <p className={styles.p}>
            <strong>Quién procesa el pago.</strong> Los pagos en soles se procesan con{' '}
            <strong>Mercado Pago</strong>. Cuando el pago se procesa con <strong>Creem</strong> (por
            ejemplo, desde fuera del Perú), el pedido lo gestiona nuestro revendedor en línea{' '}
            <strong>Creem</strong> (Armitage Labs OÜ, Tallin, Estonia), que actúa como{' '}
            <em>merchant of record</em>: Creem es el vendedor de la suscripción, cobra, emite el
            comprobante, calcula y declara los impuestos del país del comprador, aparece en el
            extracto de la tarjeta y atiende los reembolsos que correspondan. En esas compras se
            aplican además los{' '}
            <a className={styles.link} href="https://www.creem.io/terms" target="_blank" rel="noopener noreferrer">
              términos de Creem
            </a>
            . El acceso al contenido y el soporte los presta MedGO.
          </p>
          {CON_CREEM.length > 0 && (
            <>
              <p className={styles.p}>
                Con Creem, los precios están en dólares estadounidenses (USD) e incluyen los
                impuestos. Como Creem no admite permanencia, los planes con permanencia se pagan
                por adelantado por todo su periodo:
              </p>
              <table className={styles.priceTable}>
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Precio (USD)</th>
                    <th>Cobro</th>
                  </tr>
                </thead>
                <tbody>
                  {CON_CREEM.map((p) => (
                    <tr key={p.key}>
                      <td>{p.label}</td>
                      <td>US$ {p.creem!.usd.toFixed(2)}</td>
                      <td>{cadaCreem(p.creem!.meses)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </section>

        <section className={styles.callout}>
          <h2 className={styles.h2}>7. Permanencia mínima</h2>
          <p className={styles.calloutBody}>
            En los pagos en soles con Mercado Pago, los planes con permanencia se cobran cada
            mes, y al contratarlos el usuario acepta un
            número mínimo de <strong>cobros mensuales consecutivos</strong>. El botón de
            &quot;Cancelar suscripción&quot; en Mi cuenta se habilitará al cumplirse ese número de
            meses, contados desde la fecha de la primera autorización del pago. Antes de esa fecha
            la suscripción no es cancelable a través de la plataforma. No existe devolución parcial
            ni total de los cobros realizados dentro de ese periodo. Cumplida la permanencia, la
            suscripción sigue cobrándose cada mes al mismo precio hasta que el usuario la cancele.
            En los pagos con Creem no hay cobros mensuales con permanencia: el periodo completo se
            paga por adelantado y se renueva al terminar, hasta que el usuario lo cancele.
          </p>
          <ul className={styles.calloutList}>
            {CON_COMPROMISO.map((p) => (
              <li key={p.key}>
                <strong>{p.label}</strong>: S/ {p.amount.toFixed(2)} × {p.commitmentMonths} ={' '}
                S/ {(p.amount * (p.commitmentMonths ?? 0)).toFixed(2)} durante el periodo de
                permanencia.
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>8. Planes sin permanencia</h2>
          <p className={styles.p}>
            {SIN_COMPROMISO.length > 1 ? 'Los planes' : 'El plan'}{' '}
            {SIN_COMPROMISO.map((p, i) => (
              <span key={p.key}>
                {i > 0 && (i === SIN_COMPROMISO.length - 1 ? ' y ' : ', ')}
                <strong>{p.label}</strong>
              </span>
            ))}{' '}
            {SIN_COMPROMISO.length > 1 ? 'son' : 'es'} <strong>cancelable{SIN_COMPROMISO.length > 1 ? 's' : ''} en
            cualquier momento</strong> desde Mi cuenta. La cancelación detiene la renovación, pero el
            usuario mantiene el acceso hasta el final del periodo pagado.{' '}
            <strong>No existen devoluciones del periodo en curso.</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>9. Sin reembolsos automáticos</h2>
          <p className={styles.p}>
            MedGO no procesa reembolsos automáticos sobre cobros ya realizados. La cancelación
            de una suscripción detiene los cobros futuros, pero el periodo en curso permanece
            activo hasta su vencimiento. Para reclamos o casos excepcionales el usuario puede
            escribir a soporte; los casos en que sí devolvemos el dinero están en la{' '}
            <a className={styles.link} href="/reembolsos">Política de reembolsos</a>.
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
            <a className={styles.link} href={`mailto:${CORREO}`}>
              {CORREO}
            </a>
            . La eliminación implica el borrado de sus datos personales y de progreso, salvo
            registros contables que MedGO esté obligado a conservar por ley. La eliminación
            de la cuenta no exime al usuario de los cobros pendientes derivados del permanencia
            mínima de su plan.
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
            Para reclamos y quejas está disponible el{' '}
            <a className={styles.link} href="/libro-de-reclamaciones">Libro de Reclamaciones</a>.
            Para consultas sobre estos términos escribe a{' '}
            <a className={styles.link} href={`mailto:${CORREO}`}>
              {CORREO}
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
