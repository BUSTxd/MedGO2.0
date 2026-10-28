import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CORREO } from '@/lib/contacto';
import styles from '@/styles/legal.module.css';

export const metadata: Metadata = {
  title: 'Política de Reembolsos — MedGO',
  description: 'Cómo cancelar una suscripción de MedGO y en qué casos devolvemos el dinero.',
};

export default function ReembolsosPage() {
  const correo = (
    <a className={styles.link} href={`mailto:${CORREO}`}>
      {CORREO}
    </a>
  );
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <div className={styles.hero}>
          <h1 className={styles.pageTitle}>Política de Reembolsos</h1>
          <p className={styles.lastUpdated}>Última actualización: 28 de octubre de 2026</p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Cancelar la suscripción</h2>
          <p className={styles.p}>
            Las suscripciones de MedGO se renuevan cada mes hasta que el usuario las cancela. Se
            cancelan desde <strong>Mi cuenta</strong>: el plan Visitante en cualquier momento, y
            los planes con permanencia (Residente y Especialista) una vez cumplido el número de
            meses indicado en los{' '}
            <a className={styles.link} href="/terminos">Términos y condiciones</a>. Al cancelar no
            se hacen más cobros y el acceso se mantiene hasta el final del periodo ya pagado.
          </p>
          <p className={styles.p}>
            Si pagaste con <strong>Creem</strong> (fuera del Perú), los planes Residente y
            Especialista se pagan por adelantado por uno o dos años y puedes cancelar la renovación
            en cualquier momento desde el enlace de gestión de la suscripción que Creem te envía por
            correo, o escribiéndonos. Al cancelar no se cobra el siguiente periodo y mantienes el
            acceso hasta que termine el que ya pagaste.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Cuándo devolvemos el dinero</h2>
          <p className={styles.p}>
            Los cobros de un periodo ya iniciado no se devuelven de forma automática, porque el
            acceso al contenido digital empieza en el momento del pago. Sí devolvemos el importe
            en estos casos:
          </p>
          <ul className={styles.list}>
            <li>Cobro duplicado del mismo periodo.</li>
            <li>Cobro hecho después de haber cancelado correctamente la suscripción.</li>
            <li>
              Un fallo técnico de MedGO que impidió usar el contenido pagado y que no pudimos
              resolver.
            </li>
            <li>Cuando la ley aplicable al comprador lo exija.</li>
          </ul>
          <p className={styles.p}>
            Cualquier otra solicitud se evalúa caso por caso.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Cómo pedir un reembolso</h2>
          <p className={styles.p}>
            Escribe a {correo} dentro de los <strong>14 días</strong> siguientes al cobro, desde
            el correo de tu cuenta, indicando la fecha y el importe del cobro. Respondemos en un
            plazo máximo de <strong>5 días hábiles</strong>.
          </p>
          <p className={styles.p}>
            El dinero vuelve al mismo medio de pago. Si pagaste con <strong>Mercado Pago</strong>,
            la devolución se hace por Mercado Pago. Si el pago lo procesó <strong>Creem</strong>,
            nuestro revendedor y <em>merchant of record</em>, el reembolso lo emite Creem. Según
            el banco, el abono puede tardar de 5 a 15 días hábiles en verse.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Consumidores de la Unión Europea y el Reino Unido</h2>
          <p className={styles.p}>
            El contenido de MedGO es digital y se entrega al instante. Al suscribirte pides
            acceder a él de inmediato y aceptas que, una vez iniciado el acceso, pierdes el derecho
            de desistimiento de 14 días. Esto no afecta a los casos del punto 2.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Contacto</h2>
          <p className={styles.p}>Para cualquier duda sobre cobros o reembolsos escribe a {correo}.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
