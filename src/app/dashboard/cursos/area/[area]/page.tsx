import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AREAS, AREA_POR_SLUG } from '@/lib/data/encib';
import { TEMARIO } from '@/lib/data/encib/temario';
import { ANIOS_VIGENTES, aparicionesDeArea, carga, dificultad, preguntasDeArea } from '@/lib/encib/analisis';
import IconoArea from '@/components/IconoArea';
import hub from '@/styles/cursosHub.module.css';
import s from '@/styles/encib.module.css';

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = AREA_POR_SLUG.get((await params).area);
  return { title: a ? `${a.nombre} · MedGO` : 'MedGO' };
}

const DIF_CLASE = { menor: s.d1, mediana: s.d2, mayor: s.d3 } as const;
const DIF_TEXTO = { menor: 'Menor', mediana: 'Mediana', mayor: 'Mayor' } as const;

/**
 * Un área del ENCIB como curso: su temario oficial, tema por tema, marcando lo
 * que ya salió en los cuadernillos y qué se preguntó exactamente.
 */
export default async function AreaPage({ params }: Props) {
  const area = AREA_POR_SLUG.get((await params).area);
  if (!area) notFound();

  const subareas = TEMARIO[area.codigo];
  const apariciones = aparicionesDeArea(area.codigo);
  const d = dificultad(ANIOS_VIGENTES, area.codigo);
  const c = carga(ANIOS_VIGENTES, area.codigo);
  const nVig = d.menor + d.mediana + d.mayor;
  const nTemas = subareas.reduce((t, x) => t + x.temas.length, 0);
  const salieron = subareas.reduce((t, x) => t + x.temas.filter((tm) => apariciones.has(tm.codigo)).length, 0);

  return (
    <div className={s.pagina}>
      <Link href="/dashboard/cursos" className={hub.volver}>← Cursos</Link>

      <header className={s.areaCabecera}>
        <span className={s.areaCabeceraIcono} style={{ background: area.color }}>
          <IconoArea area={area.codigo} size={30} />
        </span>
        <div>
          <span className={s.kicker}>Ciencias básicas · ENCIB</span>
          <h1 className={s.titulo}>{area.nombre}</h1>
          <p className={s.subtitulo}>{area.lema}</p>
        </div>
      </header>

      <ul className={s.datos}>
        <li><strong>{area.peso}</strong> de 100 preguntas</li>
        <li><strong>{preguntasDeArea(area.codigo, 2024)}</strong> en 2024</li>
        <li><strong>{preguntasDeArea(area.codigo, 2025)}</strong> en 2025</li>
        <li><strong>{salieron}</strong> de {nTemas} temas ya salieron</li>
        <li><strong>{nVig ? Math.round((100 * d.menor) / nVig) : 0} %</strong> de dificultad menor</li>
        <li><strong>{nVig ? Math.round((100 * c.memoria) / nVig) : 0} %</strong> de memoria</li>
      </ul>

      <section className={s.seccion}>
        <h2 className={s.h2}>Cómo se pregunta</h2>
        <p className={s.lead}>{area.huella}</p>
      </section>

      <section className={s.seccion}>
        <h2 className={s.h2}>Temario oficial</h2>
        <p className={s.lead}>
          Todos los temas de la tabla de especificaciones. Los marcados ya salieron en un ENCIB: debajo está qué se preguntó
          exactamente y con qué dificultad.
        </p>
        <div className={s.leyenda}>
          <span><i className={s.d1} aria-hidden />Menor</span>
          <span><i className={s.d2} aria-hidden />Mediana</span>
          <span><i className={s.d3} aria-hidden />Mayor</span>
        </div>

        {subareas.map((sub) => {
          const nSub = sub.temas.reduce((t, tm) => t + (apariciones.get(tm.codigo)?.length ?? 0), 0);
          return (
            <div key={sub.codigo} className={s.subarea}>
              <div className={s.subareaCab}>
                <h3 className={s.subareaNombre}>{sub.nombre}</h3>
                <span className={s.subareaCuenta}>
                  {nSub ? `${nSub} ${nSub === 1 ? 'pregunta' : 'preguntas'}` : 'Aún no ha salido'}
                </span>
              </div>
              <ul className={s.temas}>
                {sub.temas.map((tm) => {
                  const ap = (apariciones.get(tm.codigo) ?? []).slice().sort((x, y) => y.anio - x.anio || x.n - y.n);
                  return (
                    <li key={tm.codigo} className={ap.length ? s.temaSalio : s.tema}>
                      <div className={s.temaCab}>
                        <span className={s.temaNombre}>{tm.nombre}</span>
                        {ap.length > 0 && (
                          <span className={s.temaVeces}>
                            {[...new Set(ap.map((x) => x.anio))].sort().join(' · ')}
                          </span>
                        )}
                      </div>
                      {ap.length > 0 && (
                        <ul className={s.conceptos}>
                          {ap.map((x) => (
                            <li key={`${x.anio}-${x.n}`}>
                              <i className={DIF_CLASE[x.dificultad]} title={`Dificultad ${DIF_TEXTO[x.dificultad].toLowerCase()}`} aria-label={`Dificultad ${DIF_TEXTO[x.dificultad].toLowerCase()}`} />
                              <span>{x.concepto}</span>
                              <em>{x.anio}</em>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <p className={s.fuente}>
        Temario de la tabla de especificaciones ENCIB 2026 (ASPEFAM). Preguntas de los cuadernillos oficiales 2021, 2024 y 2025
        clasificadas por MedGO; la dificultad es estimada. Pronto: el resumen de MedGO de cada tema, enlazado aquí.
      </p>
    </div>
  );
}
