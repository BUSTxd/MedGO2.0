import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { CURSOS_ENCIB, CURSO_POR_SLUG, SLUG_VIEJO } from '@/lib/data/encib/cursos';
import { TEMARIO_OFICIAL } from '@/lib/data/encib/temario-oficial';
import { aparicionesPorTema, nombreTema } from '@/lib/encib/analisis';
import { getUser } from '@/lib/supabase/get-user';
import { esDeCayetano } from '@/lib/admin';
import hub from '@/styles/cursosHub.module.css';
import s from '@/styles/cursoEncib.module.css';

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return CURSOS_ENCIB.map((c) => ({ area: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = CURSO_POR_SLUG.get((await params).area);
  return { title: c ? `${c.nombre} · MedGO` : 'MedGO' };
}

/**
 * Un curso de ciencias básicas: el temario del ENCIB 2026 en orden, tema por
 * tema, y debajo de cada uno, en viñetas, lo que ya se preguntó. Nada más.
 */
export default async function CursoEncibPage({ params }: Props) {
  const slug = (await params).area;
  if (SLUG_VIEJO[slug]) redirect(`/dashboard/cursos/area/${SLUG_VIEJO[slug]}`);
  const curso = CURSO_POR_SLUG.get(slug);
  if (!curso) notFound();

  // Se vuelve al escenario de exámenes: para Cayetano vive en `cursos/examen`.
  const volver = esDeCayetano(await getUser()) ? '/dashboard/cursos/examen' : '/dashboard/cursos';
  const apariciones = aparicionesPorTema();

  return (
    <div className={s.pagina} style={{ ['--ac' as string]: curso.color }}>
      <Link href={volver} className={hub.volver}>← Cursos</Link>

      <header className={s.cabecera}>
        <Image
          src={`/assets/cursos/materia-${curso.slug}_v6.avif`}
          alt=""
          width={64}
          height={64}
          unoptimized
          className={s.icono}
        />
        <div>
          <h1 className={s.titulo}>{curso.nombre}</h1>
          <p className={s.sub}>Temario ENCIB 2026</p>
        </div>
      </header>

      <ol className={s.bloques}>
        {curso.bloques.map((b, i) => (
          <li key={b.nombre} className={s.bloque}>
            <h2 className={s.bloqueNombre}>
              <span className={s.num}>{i + 1}</span>
              {b.nombre}
            </h2>
            <ol className={s.temas}>
              {b.temas.map((codigo, j) => {
                const salio = (apariciones.get(codigo) ?? [])
                  .slice()
                  .sort((x, y) => y.anio - x.anio || x.n - y.n);
                return (
                  <li key={codigo} className={s.tema}>
                    <span className={s.temaNum}>{i + 1}.{j + 1}</span>
                    <div>
                      <p className={s.temaTexto}>{TEMARIO_OFICIAL[codigo] ?? nombreTema(codigo)}</p>
                      {salio.length > 0 && (
                        <ul className={s.salio}>
                          {salio.map((x) => (
                            <li key={`${x.anio}-${x.n}`}>
                              {x.concepto} <span className={s.anio}>{x.anio}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
