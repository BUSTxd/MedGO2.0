import Link from 'next/link';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import { labEsGratis } from '@/lib/acceso';
import { AREAS, AREA_POR_CODIGO, EXAMENES_DESTINO, type AreaEncib } from '@/lib/data/encib';
import { diasHasta, fechaLarga } from '@/lib/encib/fechas';
import Pasarela from '@/components/Pasarela';
import IconoArea from '@/components/IconoArea';
import CursosCayetano from '@/components/CursosCayetano';
import styles from '@/styles/cursos.module.css';
import hub from '@/styles/cursosHub.module.css';

/**
 * Laboratorios que salen en la pasarela, cada uno con el área del ENCIB a la
 * que más aporta. Son los mismos de `/dashboard/laboratorio`; aquí solo se
 * anuncian, el candado sigue siendo el `LabGate` de cada uno.
 */
const LABS: { slug: string; nombre: string; desc: string; area: AreaEncib }[] = [
  { slug: 'atlas-3d', nombre: 'Atlas 3D', desc: 'Miembros superior e inferior con nervios, vasos y ligamentos.', area: 'ANA' },
  { slug: 'cascada-coagulacion', nombre: 'Vías de la coagulación', desc: 'La cascada como lienzo: explora y arma cada vía.', area: 'FIS' },
  { slug: 'electrocardiograma', nombre: 'Simulador EKG', desc: 'Del impulso eléctrico a la onda en DII.', area: 'FIS' },
  { slug: 'nefron-interactivo', nombre: 'Nefrón interactivo', desc: 'Transportadores segmento por segmento, y qué pasa al bloquearlos.', area: 'FIS' },
  { slug: 'checkpoints-ciclo-celular', nombre: 'Checkpoints del ciclo celular', desc: 'Las cinco vías de control, animadas paso a paso.', area: 'PAT' },
  { slug: 'hemograma', nombre: 'Hemograma completo', desc: 'Los 24 parámetros y qué los sube o los baja.', area: 'PAT' },
  { slug: 'frotis-sanguineo', nombre: 'Frotis sanguíneo', desc: 'Del extendido a la morfología, en 3D.', area: 'HIS' },
  { slug: 'atlas-microbiologia', nombre: 'Atlas de microbiología', desc: 'Bacterias patógenas frecuentes al microscopio.', area: 'MIC' },
  { slug: 'atlas-parasitologia', nombre: 'Atlas de parasitología', desc: 'Parásitos de importancia clínica.', area: 'MIC' },
  { slug: 'atlas-micologia', nombre: 'Atlas de micología', desc: 'Hongos clínicos: identifícalos o escribe su nombre.', area: 'MIC' },
  { slug: 'poligono-willis', nombre: 'Polígono de Willis', desc: 'Irrigación cerebral y sus territorios.', area: 'ANA' },
  { slug: 'tronco-encefalico', nombre: 'Tronco encefálico', desc: 'Núcleos, vías y pares craneales.', area: 'ANA' },
];

function CuentaAtras({ fecha }: { fecha: string }) {
  const dias = diasHasta(fecha);
  if (dias < 0) return <span className={hub.examenCuenta}>Se rindió el {fechaLarga(fecha)}</span>;
  if (dias === 0) return <span className={hub.examenCuenta}><strong>Es hoy</strong></span>;
  return (
    <span className={hub.examenCuenta}>
      <strong>{dias}</strong> {dias === 1 ? 'día' : 'días'} · {fechaLarga(fecha)}
    </span>
  );
}

/**
 * Cursos depende de quién entra: una cuenta de Cayetano ve sus cursos por
 * tramos, como siempre (`CursosCayetano`); el resto, los exámenes y las
 * disciplinas del ENCIB.
 */
export default async function CursosPage() {
  const user = await getUser();
  if (esDeCayetano(user)) return <CursosCayetano />;

  return (
    <>
      <header className={hub.cabecera}>
        <div>
          <h2 className={styles.qbankTitle}>Cursos</h2>
          <p className={styles.qbankSub}>Elige para qué te preparas o estudia por disciplina.</p>
        </div>
        <Link href="/dashboard/cursos/cayetano" className={hub.cayetano}>
          <span className={hub.cayetanoIcono} aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
              <path d="M7 11.5V16c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4.5M21 9.5V14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </span>
          <span className={hub.cayetanoTexto}>
            <strong>¿Estudias en Cayetano?</strong>
            <span>Tus sílabos, clase por clase</span>
          </span>
          <svg className={hub.cayetanoFlecha} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </header>

      <section className={hub.bloque}>
        <h3 className={hub.bloqueTitulo}>¿Para qué te preparas?</h3>
        <Pasarela etiqueta="Exámenes">
          {EXAMENES_DESTINO.map((ex) =>
            ex.href ? (
              <Link key={ex.slug} href={ex.href} className={`${hub.examen} ${hub.examenActivo}`}>
                <span className={hub.examenPais}>{ex.pais}</span>
                <span className={hub.examenSigla}>{ex.sigla}</span>
                <span className={hub.examenNombre}>{ex.nombre}</span>
                {ex.fecha && <CuentaAtras fecha={ex.fecha} />}
                <span className={hub.examenPie}>300 preguntas oficiales analizadas →</span>
              </Link>
            ) : (
              <div key={ex.slug} className={hub.examen} aria-disabled>
                <span className={hub.examenPais}>{ex.pais}</span>
                <span className={hub.examenSigla}>{ex.sigla}</span>
                <span className={hub.examenNombre}>{ex.nombre}</span>
                <span className={styles.qComingSoon}>Próximamente</span>
              </div>
            ),
          )}
        </Pasarela>
      </section>

      <section className={hub.bloque}>
        <h3 className={hub.bloqueTitulo}>Ciencias básicas</h3>
        <p className={hub.bloqueNota}>Las 8 áreas del ENCIB, con su temario y lo que de verdad se pregunta.</p>
        <Pasarela etiqueta="Ciencias básicas">
          {AREAS.map((a) => (
            <Link key={a.slug} href={`/dashboard/cursos/area/${a.slug}`} className={hub.area}>
              <span className={hub.areaIcono} style={{ background: a.color }}>
                <IconoArea area={a.codigo} />
              </span>
              <span className={hub.areaNombre}>{a.nombre}</span>
              <span className={hub.areaLema}>{a.lema}</span>
              <span className={hub.areaPeso}>
                <span className={hub.areaPesoBarra} aria-hidden>
                  <span style={{ width: `${(a.peso / 16) * 100}%`, background: a.color }} />
                </span>
                {a.peso} de 100 en el ENCIB
              </span>
            </Link>
          ))}
        </Pasarela>
      </section>

      <section className={hub.bloque}>
        <h3 className={hub.bloqueTitulo}>Laboratorios</h3>
        <Pasarela etiqueta="Laboratorios">
          {LABS.map((l) => {
            const area = AREA_POR_CODIGO[l.area];
            return (
              <Link key={l.slug} href={`/dashboard/laboratorio/${l.slug}`} className={hub.lab}>
                <span className={hub.labArea}>
                  <span className={hub.labPunto} style={{ background: area.color }} aria-hidden />
                  {area.nombre}
                  {labEsGratis(l.slug) && <span className={hub.labGratis}>Gratis</span>}
                </span>
                <span className={hub.labNombre}>{l.nombre}</span>
                <span className={hub.labDesc}>{l.desc}</span>
              </Link>
            );
          })}
          <Link href="/dashboard/laboratorio" className={`${hub.lab} ${hub.labTodos}`}>
            Ver todos los laboratorios →
          </Link>
        </Pasarela>
      </section>
    </>
  );
}
