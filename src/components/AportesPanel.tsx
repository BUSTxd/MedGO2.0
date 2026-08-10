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

/** Verde del banqueo: la métrica que manda, con el mismo color en todo el panel. */
const ACC_BANQUEO = '45, 201, 154';

/** Cuántas actividades pendientes se listan antes de resumir el resto. */
const MAX_PENDIENTES = 24;

const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);

/**
 * Avance sobre lo exigible: el relleno es lo publicado y el resto el hueco. Las
 * tarjetas que no aplican (entregables, labs sin banqueo) quedan fuera del
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

/** Barra con su nombre, su porcentaje y la fracción cruda al lado. */
function BarraFila({
  etiqueta,
  slot,
  acc,
  fuerte,
}: {
  etiqueta: string;
  slot: SlotStats;
  acc: string;
  fuerte?: boolean;
}) {
  return (
    <div className={fuerte ? styles.filaFuerte : styles.fila}>
      <span className={styles.filaTag}>{etiqueta}</span>
      <Barra slot={slot} acc={acc} />
      <span className={styles.filaPct}>{slot.cobertura}%</span>
      <span className={styles.filaFrac}>
        {slot.listo}/{slot.listo + slot.falta}
      </span>
    </div>
  );
}

type Tono = 'examen' | 'bloqueante' | 'deseable';

const CLASE_GRUPO: Record<Tono, string> = {
  examen:     styles.grupoExamen,
  bloqueante: styles.grupoBloq,
  deseable:   styles.grupoDes,
};

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
  tono: Tono;
}) {
  if (items.length === 0) return null;
  const visibles = items.slice(0, MAX_PENDIENTES);
  const ocultos = items.length - visibles.length;

  return (
    <div className={styles.grupo}>
      <p className={CLASE_GRUPO[tono]}>
        {titulo}
        <span className={styles.grupoCount}>{items.length}</span>
        <span className={styles.grupoDesc}>{descripcion}</span>
      </p>
      <ul className={styles.lista}>
        {visibles.map((p) => (
          <li key={p.id} className={styles.item}>
            {p.codigo && <span className={styles.itemCodigo}>{p.codigo}</span>}
            <span className={styles.itemTitulo}>{p.titulo}</span>
            {/* En un examen importa más de qué evaluación se trata que en qué
                semana cae: «Examen final» ordena la lista, «Semana 14» no. */}
            {tono === 'examen' ? (
              <span className={styles.itemCategoria}>{p.examenLabel}</span>
            ) : (
              <span className={styles.itemBloque}>{p.bloque}</span>
            )}
            <span className={styles.itemChips}>
              {tono === 'examen' && (
                <span className={styles.faltaExamen}>{p.faltaBanqueo}</span>
              )}
              {tono === 'bloqueante' && (
                <>
                  <span className={styles.faltaResumen}>{p.faltaResumen}</span>
                  {p.faltaBanqueo && (
                    <span className={styles.faltaBanqueo}>{p.faltaBanqueo}</span>
                  )}
                </>
              )}
              {tono === 'deseable' && (
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
  const { resumen, banqueo, examenes } = curso;
  const completo = resumen.falta === 0 && banqueo.falta === 0;

  // Un examen nunca pide resumen (no es contenido), así que los tres grupos no
  // se solapan: examen sin banqueo · clase sin material escrito · clase a la
  // que sólo le falta el banqueo.
  const examenesSinBanqueo = curso.pendientes.filter((p) => p.esExamen && p.faltaBanqueo);
  const sinEscrito = curso.pendientes.filter((p) => p.faltaResumen);
  const soloBanqueo = curso.pendientes.filter(
    (p) => !p.esExamen && !p.faltaResumen && p.faltaBanqueo,
  );

  // El chip nombra el hueco más caro que le queda al curso, no una sola métrica.
  const estado = completo
    ? { texto: 'Completo', clase: styles.estadoOk }
    : examenes.falta > 0
      ? {
          texto: `${examenes.falta} ${plural(examenes.falta, 'examen', 'exámenes')}`,
          clase: styles.estadoExamen,
        }
      : resumen.falta > 0
        ? { texto: `faltan ${resumen.falta}`, clase: styles.estadoFalta }
        : {
            texto: `${banqueo.falta} ${plural(banqueo.falta, 'banqueo', 'banqueos')}`,
            clase: styles.estadoFalta,
          };

  return (
    <details className={styles.curso} style={{ ['--acc' as string]: acc }}>
      <summary className={styles.cursoSummary}>
        {orden !== undefined && <span className={styles.rank}>{orden}</span>}
        <span className={styles.cursoNombre}>{curso.nombre}</span>

        <span className={styles.cursoBarras}>
          <BarraFila etiqueta="Banqueo" slot={banqueo} acc={ACC_BANQUEO} fuerte />
          <BarraFila etiqueta="Escrito" slot={resumen} acc={acc} />
        </span>

        <span className={estado.clase}>{estado.texto}</span>

        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className={styles.cursoBody}>
        <div className={styles.miniKpis}>
          <div className={styles.miniKpiFuerte}>
            <span className={styles.miniKpiLabel}>Banqueo</span>
            <span className={styles.miniKpiNum}>
              {banqueo.listo}
              <span className={styles.miniKpiDe}> / {banqueo.listo + banqueo.falta}</span>
            </span>
          </div>
          <div className={examenes.falta > 0 ? styles.miniKpiAlerta : styles.miniKpiFuerte}>
            <span className={styles.miniKpiLabel}>Exámenes con banqueo</span>
            <span className={styles.miniKpiNum}>
              {examenes.listo}
              <span className={styles.miniKpiDe}> / {examenes.listo + examenes.falta}</span>
            </span>
          </div>
          <div className={styles.miniKpi}>
            <span className={styles.miniKpiLabel}>Material escrito</span>
            <span className={styles.miniKpiNum}>
              {resumen.listo}
              <span className={styles.miniKpiDe}> / {resumen.listo + resumen.falta}</span>
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
              titulo="Exámenes sin banqueo"
              descripcion="lo que el alumno busca para prepararlos; no hay resumen que lo sustituya"
              items={examenesSinBanqueo}
              tono="examen"
            />
            <GrupoPendientes
              titulo="Sin material escrito"
              descripcion="la clase no sirve sin él"
              items={sinEscrito}
              tono="bloqueante"
            />
            <GrupoPendientes
              titulo="Clases sin banqueo"
              descripcion="el material escrito ya está publicado"
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

  const totalBanqueo = lanzamiento.banqueo.listo + lanzamiento.banqueo.falta;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Avance y aportes</h2>
      <p className={styles.sub}>
        Se lee de los sílabos en cada carga: al añadir un banqueo, un resumen o
        una simulación a un curso, este panel lo refleja solo. Si algo no aparece
        aquí, no está en la web.
      </p>

      {/* ── Titular: qué falta para lanzar ── */}
      <section className={styles.lanzamiento}>
        <header className={styles.lanzHead}>
          <div>
            <h3 className={styles.lanzTitulo}>Listo para lanzar</h3>
            <p className={styles.lanzSub}>
              Sólo los {lanzamiento.cursos.length} cursos prioritarios. Cuentan
              dos cosas: el <strong>banqueo</strong> —exámenes, parciales,
              finales y PCs resueltos, lo que el alumno viene a buscar— y el{' '}
              <strong>material escrito</strong> (la tarjeta Resumen). El video
              queda para después y nunca baja el porcentaje.
            </p>
          </div>
          <div className={styles.lanzNumeros}>
            <span className={styles.lanzPct}>{lanzamiento.banqueo.cobertura}%</span>
            <span className={styles.lanzFrac}>
              banqueo · {lanzamiento.banqueo.listo} / {totalBanqueo} actividades
            </span>
          </div>
        </header>

        <div className={styles.lanzBarras}>
          <BarraFila
            etiqueta="Banqueo"
            slot={lanzamiento.banqueo}
            acc={ACC_BANQUEO}
            fuerte
          />
          <BarraFila
            etiqueta="Material escrito"
            slot={lanzamiento.resumen}
            acc="59, 158, 221"
          />
        </div>

        <div className={styles.lanzKpis}>
          <div
            className={
              lanzamiento.faltanExamen > 0 ? styles.lanzKpiAlerta : styles.lanzKpi
            }
          >
            <span className={styles.lanzKpiNum}>{lanzamiento.faltanExamen}</span>
            <span className={styles.lanzKpiLabel}>
              Exámenes sin banqueo · de{' '}
              {lanzamiento.examenes.listo + lanzamiento.examenes.falta}
            </span>
          </div>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>{lanzamiento.faltanBanqueoClase}</span>
            <span className={styles.lanzKpiLabel}>Clases sin banqueo</span>
          </div>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>{lanzamiento.faltanResumen}</span>
            <span className={styles.lanzKpiLabel}>Sin material escrito</span>
          </div>
          <div className={styles.lanzKpi}>
            <span className={styles.lanzKpiNum}>
              {lanzamiento.cursosListos} / {lanzamiento.cursos.length}
            </span>
            <span className={styles.lanzKpiLabel}>
              Cursos completos · {lanzamiento.cursosConEscrito} con todo el escrito
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
                <span className={styles.kpiNum}>{t.banqueo.cobertura}%</span>
                <span className={styles.kpiLabel}>Banqueo</span>
                <span className={styles.kpiFrac}>
                  {t.banqueo.listo} / {t.banqueo.listo + t.banqueo.falta} exigibles
                </span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiNum}>{t.examenes.cobertura}%</span>
                <span className={styles.kpiLabel}>Exámenes con banqueo</span>
                <span className={styles.kpiFrac}>
                  {t.examenes.listo} / {t.examenes.listo + t.examenes.falta} evaluaciones
                </span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiNum}>{t.resumen.cobertura}%</span>
                <span className={styles.kpiLabel}>Material escrito</span>
                <span className={styles.kpiFrac}>
                  {t.resumen.listo} / {t.resumen.listo + t.resumen.falta} exigibles
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
            <strong>Banqueo</strong> — banco de preguntas, solucionario paso a paso o
            PDF de práctica: los propuestos de las clases teóricas de Física, las PCs
            de años anteriores de Química Orgánica. Es la métrica que manda: se exige
            en todas las clases y en todas las evaluaciones.
          </li>
          <li>
            <strong>Exámenes con banqueo</strong> — el banqueo de las evaluaciones que
            el alumno rinde: exámenes, parciales, finales, prácticas calificadas,
            sustitutorios y pasos. Se cuenta aparte porque ahí el banqueo es el único
            material posible —un examen no lleva resumen— y es justo lo que se busca
            para prepararlo.
          </li>
          <li>
            <strong>Material escrito</strong> — la tarjeta Resumen. Se exige en las
            clases, no en las evaluaciones.
          </li>
          <li>
            <strong>Video / Simulación</strong> — material a futuro. Las simulaciones
            publicadas se cuentan aparte; los videos que faltan nunca bajan el
            porcentaje.
          </li>
          <li>
            <strong>No aplica</strong> — el material escrito de las evaluaciones (no son
            contenido), el banqueo de los laboratorios que no lo llevan y las entregas
            de trabajos, que no se banquean. Salen del denominador; si igual reciben
            material, se suman como listos.
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
