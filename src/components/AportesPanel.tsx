import type { TrackStats, AporteColaborador } from '@/lib/aportes-stats';
import styles from '@/styles/aportes.module.css';

interface Props {
  tracks: TrackStats[];
  aportes: AporteColaborador[];
}

const ACC: Record<string, string> = {
  basico:   '59, 158, 221',
  medicina: '139, 92, 246',
};

function Barra({ pct, acc }: { pct: number; acc: string }) {
  return (
    <div className={styles.barra}>
      <span
        className={styles.barraFill}
        style={{ width: `${pct}%`, background: `rgb(${acc})` }}
      />
    </div>
  );
}

export default function AportesPanel({ tracks, aportes }: Props) {
  const activos = aportes.filter(
    (a) => a.resumenes > 0 || a.banqueos > 0 || a.laboratorios > 0,
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Avance y aportes</h2>
      <p className={styles.sub}>
        Unidades realmente publicadas, leídas de los sílabos. Es la base para la
        parte variable del reparto: si algo no está aquí, no está en la web.
      </p>

      {/* ── Cobertura por tramo ── */}
      {tracks.map((t) => {
        const acc = ACC[t.track];
        return (
          <section key={t.track} className={styles.trackCard} style={{ ['--acc' as string]: acc }}>
            <header className={styles.trackHead}>
              <h3 className={styles.trackTitle}>{t.etiqueta}</h3>
              <span className={styles.trackMeta}>
                {t.cursos.length} cursos · {t.actividades} actividades · {t.laboratorios} labs
              </span>
            </header>

            <div className={styles.kpis}>
              <div className={styles.kpi}>
                <span className={styles.kpiNum}>{t.covResumen}%</span>
                <span className={styles.kpiLabel}>Resúmenes</span>
                <span className={styles.kpiFrac}>{t.resumenes} / {t.actividades}</span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiNum}>{t.covBanqueo}%</span>
                <span className={styles.kpiLabel}>Banqueo</span>
                <span className={styles.kpiFrac}>{t.banqueos} / {t.actividades}</span>
              </div>
            </div>

            <div className={styles.tablaWrap}>
              <table className={styles.tabla}>
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th className={styles.num}>Activ.</th>
                    <th className={styles.num}>Resúmenes</th>
                    <th className={styles.colBarra}>Cobertura</th>
                    <th className={styles.num}>Banqueo</th>
                    <th>Material de</th>
                  </tr>
                </thead>
                <tbody>
                  {t.cursos.map((c) => (
                    <tr key={c.slug} className={c.resumenes === 0 ? styles.vacio : ''}>
                      <td className={styles.cursoNombre}>{c.nombre}</td>
                      <td className={styles.num}>{c.actividades}</td>
                      <td className={styles.num}>{c.resumenes}</td>
                      <td className={styles.colBarra}>
                        <div className={styles.barraRow}>
                          <Barra pct={c.covResumen} acc={acc} />
                          <span className={styles.barraPct}>{c.covResumen}%</span>
                        </div>
                      </td>
                      <td className={styles.num}>{c.banqueos}</td>
                      <td className={styles.autores}>
                        {c.materialDe.map((m) => {
                          const p = aportes.find((a) => a.colaborador === m);
                          return (
                            <span
                              key={m}
                              className={styles.chip}
                              style={{
                                color: p?.color,
                                background: `${p?.color}1f`,
                              }}
                            >
                              {p?.nombre ?? m}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {/* ── Registro de aportes por persona ── */}
      <section className={styles.trackCard} style={{ ['--acc' as string]: '45, 201, 154' }}>
        <header className={styles.trackHead}>
          <h3 className={styles.trackTitle}>Aportes por persona</h3>
          <span className={styles.trackMeta}>
            Los resúmenes de un curso con varios autores se dividen en partes iguales
          </span>
        </header>

        <div className={styles.personas}>
          {activos.map((a) => (
            <article key={a.colaborador} className={styles.persona}>
              <span className={styles.personaDot} style={{ background: a.color }} />
              <div className={styles.personaHead}>
                <strong className={styles.personaNombre}>{a.nombre}</strong>
                <span className={styles.personaRol}>{a.rol}</span>
              </div>
              <dl className={styles.personaStats}>
                <div>
                  <dt>Resúmenes</dt>
                  <dd>{a.resumenes}</dd>
                </div>
                <div>
                  <dt>Banqueos</dt>
                  <dd>{a.banqueos}</dd>
                </div>
                <div>
                  <dt>Laboratorios</dt>
                  <dd>
                    {a.laboratorios}
                    {a.labsPesados > 0 && (
                      <span className={styles.pesados}> · {a.labsPesados} 3D</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Cursos con material</dt>
                  <dd>{a.cursosConMaterial}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <p className={styles.nota}>
        Este panel mide <strong>unidades publicadas</strong>, no horas ni esfuerzo.
        La plataforma, los costos de infraestructura y las redes no aparecen como
        unidades contables — hay que valorarlos aparte al negociar la parte fija.
      </p>
    </div>
  );
}
