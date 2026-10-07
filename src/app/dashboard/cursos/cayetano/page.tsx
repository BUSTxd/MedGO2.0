import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import hub from '@/styles/cursosHub.module.css';

/**
 * Adonde el proxy manda a quien no es de Cayetano cuando intenta abrir un
 * sílabo: se le explica por qué, sin la lista de cursos (es la malla de la
 * universidad). Una cuenta de Cayetano ya tiene sus cursos en Cursos.
 */
export default async function SoloCayetanoPage() {
  if (esDeCayetano(await getUser())) redirect('/dashboard/cursos');

  return (
    <>
      <Link href="/dashboard/cursos" className={hub.volver}>← Cursos</Link>
      <div className={hub.soloCayetano}>
        <span className={hub.soloCayetanoIcono} aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7 11.5V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.5M21 9.5V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        <h2 className={hub.soloCayetanoTitulo}>Los cursos de Cayetano son para cuentas @upch.pe</h2>
        <p className={hub.soloCayetanoTexto}>
          Aquí están los sílabos de la Universidad Peruana Cayetano Heredia, clase por clase. Para verlos,
          entra con tu correo institucional <strong>@upch.pe</strong> usando «Continuar con Google».
        </p>
        <p className={hub.soloCayetanoTexto}>
          Si estudias en otra universidad, prepárate por examen o por disciplina desde Cursos.
        </p>
        <Link href="/dashboard/cursos" className={hub.soloCayetanoBoton}>Ir a Cursos</Link>
      </div>
    </>
  );
}
