import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PROVEEDOR } from '@/lib/proveedor';
import { PLAZO_RESPUESTA } from '@/lib/libro-reclamaciones';
import styles from '@/styles/legal.module.css';
import FormularioReclamo from './FormularioReclamo';

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones — MedGO',
  description: 'Libro de Reclamaciones virtual de MedGO, conforme al Código de Protección y Defensa del Consumidor.',
};

export default function LibroReclamacionesPage() {
  return (
    <>
      <Navbar />
      <main className={styles.wrap}>
        <div className={styles.hero}>
          <h1 className={styles.pageTitle}>Libro de Reclamaciones</h1>
          <p className={styles.lastUpdated}>Hoja de reclamación virtual</p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.h2}>Proveedor</h2>
          <p className={styles.p}>
            <strong>{PROVEEDOR.nombreComercial}</strong> ({PROVEEDOR.web}) · Titular:{' '}
            {PROVEEDOR.titular}
            {PROVEEDOR.ruc && <> · RUC {PROVEEDOR.ruc}</>}
          </p>
          <p className={styles.p}>
            Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, MedGO
            cuenta con un Libro de Reclamaciones virtual a tu disposición. Responderemos a tu
            correo en un plazo máximo de <strong>{PLAZO_RESPUESTA} días hábiles</strong>. La
            formulación del reclamo no impide acudir a otras vías de solución de controversias ni
            es requisito previo para interponer una denuncia ante el INDECOPI.
          </p>
        </section>

        <FormularioReclamo />
      </main>
      <Footer />
    </>
  );
}
