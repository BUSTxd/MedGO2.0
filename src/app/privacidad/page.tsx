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
        <p className={styles.lastUpdated}>Última actualización: 22 de mayo de 2026</p>

        <section className={styles.section}>
          <h2 className={styles.h2}>1. Responsable del tratamiento</h2>
          <p className={styles.p}>
            El responsable del tratamiento de tus datos personales es <strong>MedGO</strong>{' '}
            (medgoplus.com). Para cualquier consulta sobre esta política o sobre el manejo de
            tus datos puedes escribir a{' '}
            <a className={styles.link} href="mailto:soporte@medgoplus.com">
              soporte@medgoplus.com
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>2. Datos que recopilamos</h2>
          <p className={styles.p}>
            Al crear una cuenta y utilizar MedGO recopilamos:
          </p>
          <ul className={styles.list}>
            <li>Correo electrónico y nombre completo.</li>
            <li>Foto de perfil (solo si te registras con Google).</li>
            <li>Universidad y carrera, cuando las completas en tu perfil (para personalizar el sílabo).</li>
            <li>Progreso académico dentro de la plataforma: lecciones completadas, respuestas a quizzes, racha de estudio y tiempos de uso.</li>
            <li>Datos técnicos básicos: dirección IP, tipo de navegador, sistema operativo y zona horaria.</li>
            <li>Identificadores opacos de pago entregados por Mercado Pago (nunca datos de tu tarjeta).</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>3. Inicio de sesión con Google</h2>
          <p className={styles.p}>
            Si te registras o inicias sesión usando <strong>Google Sign-In</strong>, Google nos
            comparte únicamente tu <strong>nombre, correo electrónico y foto de perfil</strong>.
            MedGO <strong>no recibe tu contraseña</strong> de Google ni accede a tu Gmail,
            Drive, contactos ni a otros datos de tu cuenta de Google. Puedes revocar el acceso
            de MedGO en cualquier momento desde{' '}
            <a className={styles.link} href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">
              myaccount.google.com/permissions
            </a>
            .
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>4. Finalidades del tratamiento</h2>
          <p className={styles.p}>
            Usamos tus datos exclusivamente para:
          </p>
          <ul className={styles.list}>
            <li>Crear y mantener tu cuenta.</li>
            <li>Personalizar el contenido educativo y tu sílabo.</li>
            <li>Procesar suscripciones y pagos.</li>
            <li>Enviarte correos transaccionales (confirmación de pago, recordatorios de cobro, cambios en los términos).</li>
            <li>Mejorar la plataforma mediante métricas agregadas y anónimas de uso.</li>
            <li>Cumplir con obligaciones legales y contables.</li>
          </ul>
          <p className={styles.p}>
            <strong>No vendemos tus datos personales a terceros</strong> ni los compartimos con
            fines publicitarios.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>5. Procesador de pagos (Mercado Pago)</h2>
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
          <h2 className={styles.h2}>6. Almacenamiento y transferencia internacional (Supabase)</h2>
          <p className={styles.p}>
            Los datos personales y de progreso se almacenan en <strong>Supabase</strong>{' '}
            (servicio de base de datos en la nube). Los servidores están ubicados en la región{' '}
            <strong>São Paulo, Brasil</strong>, lo que implica una transferencia internacional
            de datos. Al usar MedGO el usuario autoriza dicha transferencia.
            Aplicamos políticas de <strong>Row Level Security</strong> a nivel de base de datos
            para que cada usuario solo pueda leer y escribir sus propios registros.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>7. Conservación de los datos</h2>
          <p className={styles.p}>
            Conservamos tus datos mientras tengas una cuenta activa en MedGO. Si solicitas la
            eliminación de tu cuenta, borramos tus datos personales y de progreso en un plazo
            máximo de <strong>30 días</strong>, salvo aquellos registros que debamos conservar
            por obligaciones legales, contables o tributarias (por ejemplo, comprobantes de
            pago durante el plazo legal exigido en Perú).
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>8. Cookies</h2>
          <p className={styles.p}>
            Usamos cookies estrictamente necesarias para mantener la sesión iniciada y
            preferencias visuales (modo claro/oscuro). <strong>No usamos cookies de publicidad
            de terceros</strong> ni rastreadores cross-site.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>9. Menores de edad</h2>
          <p className={styles.p}>
            MedGO está dirigido a estudiantes de medicina mayores de <strong>16 años</strong>.
            No recopilamos conscientemente datos de menores de esa edad. Si descubrimos que
            hemos recopilado datos de un menor sin consentimiento de sus padres o tutores,
            procederemos a eliminarlos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>10. Derechos del usuario</h2>
          <p className={styles.p}>
            Como titular de tus datos personales tienes derecho a <strong>acceder</strong>,
            <strong> rectificar</strong>, <strong>cancelar</strong>, <strong>oponerte</strong>{' '}
            al tratamiento y <strong>portabilidad</strong> de los mismos, conforme a la Ley
            N.° 29733 de Protección de Datos Personales del Perú. Para ejercer estos derechos
            escríbenos a{' '}
            <a className={styles.link} href="mailto:soporte@medgoplus.com">
              soporte@medgoplus.com
            </a>
            . Responderemos en un plazo máximo de <strong>20 días hábiles</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>11. Seguridad</h2>
          <p className={styles.p}>
            Aplicamos medidas técnicas y organizativas razonables para proteger tus datos:
            cifrado en tránsito (HTTPS/TLS), cifrado en reposo en la base de datos,
            autenticación de sesión basada en tokens firmados y políticas estrictas de acceso.
            Ningún sistema es 100 % seguro; si detectamos una brecha de seguridad que afecte
            tus datos, te notificaremos en un plazo razonable.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>12. Cambios en esta política</h2>
          <p className={styles.p}>
            Podemos actualizar esta política para reflejar cambios en la plataforma o en la
            normativa aplicable. La fecha de la última actualización se muestra al inicio de
            la página. Si los cambios son significativos, te notificaremos por correo
            electrónico antes de que entren en vigor.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.h2}>13. Contacto</h2>
          <p className={styles.p}>
            Para cualquier consulta sobre privacidad o ejercicio de derechos escribe a{' '}
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
