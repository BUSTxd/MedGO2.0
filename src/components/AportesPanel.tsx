import type {
  TrackStats,
  AporteColaborador,
  CursoStats,
  Lanzamiento,
  Pendiente,
  SlotStats,
} from '@/lib/aportes-stats';
import styles from '@/styles/aportes.module.css';

interface Props {
  lanzamiento: Lanzamiento;
  tracks: TrackStats[];
  aportes: AporteColaborador[];
}

const ACC: Record<string, string> = {
  basico:   '59, 158, 221',
  medicina: '139, 92, 246',
};

/** Cuántas actividades pendientes se listan antes de resumir el resto. */
const MAX_PENDIENTES = 24;

/**
 * Avance sobre lo exigible: el relleno es lo publicado y el resto el hueco. Las
 * tarjetas que no aplican (evaluaciones, labs sin banqueo) quedan fuera del
 * total, así el porcentaje no castiga lo que nunca debía existir.
 */
function Barra({ slot, acc }: { slot: SlotStats; acc: string }) {
  const total = slot.listo + slot.falta;
  const ancho = total === 0 ? 100 : (slot.listo / total) * 100;
  return (
    <div className={styles.barra}>
      <span
        className={styles.barraFill}
        style={{ width: `${ancho}%`, background: `rgb(${acc})` }}
      />
    </div>
  );
}

/**
 * Un bloque de pendientes. Se separan por lo que falta, no por unidad del
 * sílabo: en un curso al 0% todas las filas dirían lo mismo y el listado
 * dejaría de informar.
 */
function GrupoPendientes({
  titulo,
  descripcion,
  items,
  tono,
}: {
  titulo: string;
  descripcion: string;
  items: Pendiente[];
  tono: 'bloqueante' | 'deseable';
}) {
  if (items.length === 0) return null;
  const visibles = items.slice(0, MAX_PENDIENTES);
  const ocultos = items.length - visibles.length;

  return (
    <div className={styles.grupo}>
      <p className={tono === 'bloqueante' ? styles.grupoBloq : styles.grupoDes}>
        {titulo}
        <span className={styles.grupoCount}>{items.length}</span>
        <span className={styles.grupoDesc}>{descripcion}</span>
      </p>
      <ul className={styles.lista}>
        {visibles.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.codigo && <span className={styles.itemCodigo}>{p.codigo}</span>}
            <span className={styles.itemTitulo}>{p.titulo}</span>
            <span className={styles.itemBloque}>{p.bloque}</span>
            <span className={styles.itemChips}>
              {tono === 'bloqueante' ? (
                <>
                  <span className={styles.faltaResumen}>{p.faltaResumen}</span>
                  {p.faltaBanqueo && (
                    <span className={styles.faltaBanqueo}>{p.faltaBanqueo}</span>
                  )}
                </>
              ) : (
                <span className={styles.faltaBanqueo}>{p.faltaBanqueo}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {ocultos > 0 && (
        <p className={styles.masItems}>
          y {ocultos} actividad{ocultos === 1 ? '' : 'es'} más en la misma situación
        </p>
      )}
    </div>
  );
}

function CursoCard({
  curso,
  aportes,
  acc,
  orden,
}: {
  curso: CursoStats;
  aportes: AporteColaborador[];
  acc: string;
  orden?: number;
}) {
  const { resumen, banqueo } = curso;
  const completo = resumen.falta === 0;
  const sinEscrito = curso.pendientes.filter((p) => p.faltaResumen);
  const soloBanqueo = curso.pendientes.filter((p) => !p.faltaResumen && p.faltaBanqueo);

  return (
    <details className={styles.curso} style={{ ['--acc' as string]: acc }}>
      <summary className={styles.cursoSummary}>
        {orden !== undefined && <span className={styles.rank}>{orden}</span>}
        <span className={styles.cursoNombre}>{curso.nombre}</span>

        <span className={styles.cursoBarraCell}>
          <Barra slot={resumen} acc={acc} />
        </span>
        <span className={styles.cursoPct}>{resumen.cobertura}%</span>

        <span className={completo ? styles.estadoOk : styles.estadoFalta}>
          {completo ? 'Completo' : `faltan ${resumen.falta}`}
        </span>

        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className={styles.cursoBody}>
        <div className={styles.miniKpis}>
          <div className={styles.miniKpi}>
            <span className={styles.miniKpiLabel}>Material escrito</span>
            <span className={styles.miniKpiNum}>
              {resumen.listo}
              <span className={styles.miniKpiDe}> / {resumen.listo + resumen.falta}</span>
            </span>
          </div>
          <div className={styles.miniKpi}>
            <span className={styles.miniKpiLabel}>Banqueo</span>
            <span className={styles.miniKpiNum}>
              {banqueo.listo}
              <span className={styles.miniKpiDe}> / {banqueo.listo + banqueo.falta}</span>
            </span>
          </div>
          <div className={styles.miniKpi}>
            <span className={styles.miniKpiLabel}>Simulaciones</span>
            <span className={styles.miniKpiNum}>{curso.simulaciones}</span>
          </div>
          <div className={styles.miniKpi}>
            <span className={styles.miniKpiLabel}>No aplica</span>
            <span className={styles.miniKpiNum}>{resumen.noAplica}</span>
          </div>
          {curso.invitaciones > 0 && (
            <div className={styles.miniKpi}>
              <span className={styles.miniKpiLabel}>Invitación</span>
              <span className={styles.miniKpiNum}>{curso.invitaciones}</span>
            </div>
          )}
        </div>

        {curso.materialDe.length > 0 && (
          <p className={styles.autoresLinea}>
            <span className={styles.autoresLabel}>Material de</span>
            {curso.materialDe.map((m) => {
              const p = aportes.find((a) => a.colaborador === m);
              return (
                <span
                  key={m}
                  className={styles.chip}
                  style={{ color: p?.color, background: `${p?.color}1f` }}
                >
                  {p?.nombre ?? m}
                </span>
              );
            })}
          </p>
        )}

        {curso.pendientes.length === 0 ? (
          <p className={styles.todoListo}>
            Todo el material exigible de este curso está publicado.
          </p>
        ) : (
          <div className={styles.pendientes}>
            <GrupoPendientes
              titulo="Sin material escrito"
              descripcion="bloquea el lanzamiento"
              items={sinEscrito}
              tono="bloqueante"
            />
            <GrupoPendientes
              titulo="Sólo falta el banqueo"
              descripcion="el resumen ya está publicado"
              items={soloBanqueo}
              tono="deseable"
            />
          </div>
        )}
      </div>
    </details>
  );
}

export default function AportesPanel({ lanzamiento, tracks, aportes }: Props) {
  const activos = aportes.filter(
    (a) => a.resumenes > 0 || a.banqueos > 0 || a.laboratorios > 0,
  );

  const totalPrioritarios = lanzamiento.resumen.listo + lanzamiento.resumen.falta;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Avance y aportes</h2>
      <p className={styles.sub}>
        Se lee de los sílabos en cada carga: al añadir un resumen, un banqueo o
        una simulación a un curso, este panel lo refleja solo. Si algo no aparece
        aquí, no está en la web.
      </p>

      {/* ── Titular: qué falta para lanzar ── */}
      <section className={styles.lanzamiento}>
        <header className={styles.lanzHead}>
          <div>
            <h3 className={styles.lanzTitulo}>Listo para lanzar</h3>
            <p className={styles.lanzSub}>
              Sólo los {lanzamiento.cursos.length} cursos prioritarios. El mínimo
              indispensable es el material escrito (Resumen o Database); el
              banqueo suma pero no bloquea, y el video queda para después.
            </p>
          </div>
          <div className={styles.lanzNumeros}>
            <span className={styles.lanzPct}>{lanzamiento.resumen.cobertura}%</span>
            <span className={styles.lanzFrac}>
              {lanzamiento.resumen.listo} / {totalPrioritarios} actividades
            </span>
          </div>
        </header>

        <Barra slot={lanzamiento.resumen} acc="45, 201, 154" />

        <div className={styles.lanzKpis}>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>{lanzamiento.faltanResumen}</span>
            <span className={styles.lanzKpiLabel}>Sin material escrito</span>
          </div>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>
              {lanzamiento.cursosListos} / {lanzamiento.cursos.length}
            </span>
            <span className={styles.lanzKpiLabel}>Cursos completos</span>
          </div>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>{lanzamiento.banqueo.cobertura}%</span>
            <span className={styles.lanzKpiLabel}>
              Banqueo · {lanzamiento.banqueo.listo} de{' '}
              {lanzamiento.banqueo.listo + lanzamiento.banqueo.falta}
            </span>
          </div>
        </div>

        <div className={styles.prioridadLista}>
          {lanzamiento.cursos.map((c, i) => (
            <CursoCard
              key={c.slug}
              curso={c}
              aportes={aportes}
              acc={ACC[c.track]}
              orden={i + 1}
            />
          ))}
        </div>
      </section>

      {/* ── Cobertura completa por tramo ── */}
      {tracks.map((t) => {
        const acc = ACC[t.track];
        const resto = t.cursos.filter((c) => c.prioridad === null);
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
                <span className={styles.kpiNum}>{t.resumen.cobertura}%</span>
                <span className={styles.kpiLabel}>Material escrito</span>
                <span className={styles.kpiFrac}>
                  {t.resumen.listo} / {t.resumen.listo + t.resumen.falta} exigibles
                </span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiNum}>{t.banqueo.cobertura}%</span>
                <span className={styles.kpiLabel}>Banqueo</span>
                <span className={styles.kpiFrac}>
                  {t.banqueo.listo} / {t.banqueo.listo + t.banqueo.falta} exigibles
                </span>
              </div>
            </div>

            {resto.length > 0 && (
              <>
                <p className={styles.restoLabel}>
                  Cursos que no bloquean el lanzamiento
                </p>
                <div className={styles.prioridadLista}>
                  {resto.map((c) => (
                    <CursoCard key={c.slug} curso={c} aportes={aportes} acc={acc} />
                  ))}
                </div>
              </>
            )}
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

      {/* ── Leyenda: qué cuenta y qué no ── */}
      <div className={styles.leyenda}>
        <p className={styles.leyendaTitulo}>Cómo se cuenta</p>
        <ul className={styles.leyendaLista}>
          <li>
            <strong>Material escrito</strong> — la tarjeta Resumen, o Database en las
            prácticas dirigidas de Química Orgánica. Es el mínimo para lanzar.
          </li>
          <li>
            <strong>Banqueo</strong> — banco de preguntas o solucionario paso a paso
            (Propuestos en las clases C1–C4 de Física). Suma, pero no todas las
            clases lo van a tener.
          </li>
          <li>
            <strong>Video / Simulación</strong> — material a futuro. Las simulaciones
            publicadas se cuentan aparte; los videos que faltan nunca bajan el
            porcentaje.
          </li>
          <li>
            <strong>No aplica</strong> — exámenes y prácticas calificadas (no son
            contenido) y laboratorios sin banqueo. Salen del denominador; si igual
            reciben material, se suman como listos.
          </li>
          <li>
            <strong>Invitación</strong> — actividades sin material propio y sin
            planes de tenerlo, como los talleres científicos de Química Orgánica:
            muestran la mascota y los contactos para que alguien lo aporte. No son
            un hueco pendiente.
          </li>
        </ul>
        <p className={styles.nota}>
          Este panel mide <strong>unidades publicadas</strong>, no horas ni esfuerzo.
          La plataforma, los costos de infraestructura y las redes no aparecen como
          unidades contables — hay que valorarlos aparte al negociar la parte fija.
        </p>
      </div>
    </div>
  );
}
