import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '@/styles/legal.module.css';

export const metadata: Metadata = {
  title: 'Política de Privacidad — MedGO',
  description: 'Cómo MedGO recopila, almacena y trata los datos personales de sus usuarios.',
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <h1 className={styles.pageTitle}>Política de Privacidad</h1>
        <p className={styles.lastUpdated}>Última actualización: 18 de mayo de 2026</p>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Datos que recopilamos</h2>
          <p className={styles.p}>
            Al crear una cuenta en MedGO recopilamos:
          </p>
          <ul className={styles.list}>
            <li>Correo electrónico y nombre.</li>
            <li>Universidad y carrera (para personalizar el sílabo).</li>
            <li>Progreso académico dentro de la plataforma (lecciones completadas, quizzes, tiempos).</li>
            <li>Datos técnicos básicos: dirección IP, tipo de navegador y sistema operativo.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Procesador de pagos (Mercado Pago)</h2>
          <p className={styles.p}>
            Los pagos se procesan a través de <strong>Mercado Pago</strong>. MedGO{' '}
            <strong>no almacena datos de tarjetas</strong>: los datos de tu tarjeta viajan
            directamente del navegador a Mercado Pago vía un componente seguro (Brick) y solo
            recibimos un identificador opaco del cobro. Para más información consulta la{' '}
            <a className={styles.link} href="https://www.mercadopago.com.pe/ayuda/politica-privacidad_2381" target="_blank" rel="noopener noreferrer">
              política de privacidad de Mercado Pago
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Almacenamiento (Supabase)</h2>
          <p className={styles.p}>
            Los datos personales y de progreso se almacenan en <strong>Supabase</strong>,
            servicio de base de datos en la nube. Aplicamos políticas de Row Level Security
            para que cada usuario solo pueda leer y escribir sus propios datos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Cookies</h2>
          <p className={styles.p}>
            Usamos cookies estrictamente necesarias para mantener la sesión iniciada y
            preferencias visuales (modo claro/oscuro). No usamos cookies de publicidad de
            terceros.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Derechos del usuario</h2>
          <p className={styles.p}>
            Como titular de tus datos personales tienes derecho a <strong>acceder</strong>,
            <strong> rectificar</strong>, <strong>cancelar</strong> y oponerte al tratamiento
            de los mismos. Para ejercer estos derechos escríbenos a{' '}
            <a className={styles.link} href="mailto:soporte@medgoplus.com">
              soporte@medgoplus.com
            </a>
            . La eliminación de la cuenta implica la eliminación de los datos asociados,
            salvo aquellos que debamos conservar por obligaciones legales o contables.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>6. Contacto</h2>
          <p className={styles.p}>
            Para cualquier consulta sobre privacidad escribe a{' '}
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
