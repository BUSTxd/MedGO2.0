import type { ReactNode } from 'react';
import Link from 'next/link';
import type {
  AporteColaborador,
  Avance,
  CursoStats,
  EscritoTramo,
  Pendiente,
  SlotStats,
} from '@/lib/aportes-stats';
import RefrescoAlVolver from '@/components/RefrescoAlVolver';
import s from '@/styles/avance.module.css';
import styles from '@/styles/aportes.module.css';

interface Props {
  avance: Avance;
  aportes: AporteColaborador[];
  /** Registro interactivo de autoría; lo monta la página, que tiene la sesión. */
  registro: ReactNode;
  /** Hora de esta carga, ya formateada en hora de Lima. */
  actualizado: string;
}

const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);
const total = (slot: SlotStats) => slot.listo + slot.falta;

/**
 * Barra de avance invertida: el tramo que falta va en naranja y lo publicado
 * en un verde apagado. El ojo cae en el hueco, no en lo hecho.
 */
function Barra({ slot, grande }: { slot: SlotStats; grande?: boolean }) {
  const ancho = total(slot) === 0 ? 100 : (slot.listo / total(slot)) * 100;
  return (
    <span
      className={grande ? s.barraGrande : s.barra}
      role="img"
      aria-label={`${slot.listo} de ${total(slot)} publicadas, faltan ${slot.falta}`}
    >
      <span className={s.barraHecho} style={{ width: `${ancho}%` }} />
    </span>
  );
}

/** «3 magistrales · 2 laboratorios»: de qué está hecho el hueco, sin abrir la lista. */
function porTipo(pendientes: Pendiente[]): string {
  const cuenta = new Map<string, number>();
  for (const p of pendientes) cuenta.set(p.tipoLabel, (cuenta.get(p.tipoLabel) ?? 0) + 1);
  return [...cuenta.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    // «Magistral» → «magistral», pero las siglas (SGP, TBL, EFI Games) se quedan.
    .map(([tipo, n]) => `${n} ${/^[A-Z]{2}/.test(tipo) ? tipo : tipo.toLowerCase()}`)
    .join(' · ');
}

/** Cuántas de las que faltan ya tienen PDF: pasarlas a HTML cuesta menos que escribirlas. */
const enPdf = (pendientes: Pendiente[]) =>
  pendientes.filter((p) => p.faltaResumen && p.soloPdf).length;

function CursoEscrito({ curso, abierto }: { curso: CursoStats; abierto: boolean }) {
  const faltan = curso.pendientes.filter((p) => p.faltaResumen);
  const pdf = enPdf(faltan);
  return (
    <details className={s.curso} open={abierto}>
      <summary className={s.cursoSummary}>
        <span className={s.cursoFaltan}>
          <strong>{curso.resumen.falta}</strong>
          <span>{plural(curso.resumen.falta, 'falta', 'faltan')}</span>
        </span>
        <span className={s.cursoTexto}>
          <span className={s.cursoNombre}>{curso.nombre}</span>
          <span className={s.cursoTipos}>
            {pdf > 0 && (
              <span className={s.cursoPdf}>
                {pdf === faltan.length ? 'todas' : pdf} en PDF
              </span>
            )}
            {porTipo(faltan)}
          </span>
        </span>
        <span className={s.cursoAvance}>
          <Barra slot={curso.resumen} />
          <span className={s.cursoFrac}>
            {curso.resumen.listo}/{total(curso.resumen)}
          </span>
        </span>
        <span className={s.chevron} aria-hidden="true">
          ▾
        </span>
      </summary>

      <ul className={s.lista}>
        {faltan.map((p) => (
          <li key={p.id}>
            <Link href={p.href} className={s.item} prefetch={false}>
              {p.codigo && <span className={s.itemCodigo}>{p.codigo}</span>}
              <span className={s.itemTitulo}>{p.titulo}</span>
              {p.soloPdf && (
                <span className={s.itemPdf} title="Tiene resumen en PDF: falta pasarlo a HTML">
                  PDF
                </span>
              )}
              <span className={s.itemTipo}>{p.tipoLabel}</span>
              <span className={s.itemBloque}>{p.bloque}</span>
              <span className={s.itemIr} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

/** Lista de pendientes de un tramo. Lo completo se resume en una línea. */
function CursosDelTramo({ tramo, abiertos }: { tramo: EscritoTramo; abiertos: boolean }) {
  return (
    <>
      {tramo.sinSilabo.length > 0 && (
        <p className={s.sinSilabo}>
          <strong>Sin sílabo cargado:</strong>{' '}
          {tramo.sinSilabo.map((c) => c.nombre).join(', ')}. No se puede medir qué
          les falta hasta tener sus clases.
        </p>
      )}

      <div className={s.cursos}>
        {tramo.conFalta.map((c) => (
          <CursoEscrito key={c.slug} curso={c} abierto={abiertos} />
        ))}
      </div>

      {tramo.completos.length > 0 && (
        <p className={s.completos}>
          <span className={s.check} aria-hidden="true">
            ✓
          </span>
          Con todo el material escrito: {tramo.completos.map((c) => c.nombre).join(', ')}
        </p>
      )}
    </>
  );
}

/** El banqueo, en una franja: cuánto falta y, si se pide, dónde. */
function BanqueoCompacto({ banqueo }: { banqueo: Avance['banqueo'] }) {
  return (
    <section className={s.banqueo} aria-labelledby="titulo-banqueo">
      <div className={s.banqueoFila}>
        <h3 id="titulo-banqueo" className={s.banqueoTitulo}>
          Banqueo
        </h3>
        <Barra slot={banqueo.banqueo} />
        <span className={s.banqueoPct}>{banqueo.banqueo.cobertura}%</span>
        <span className={s.banqueoDatos}>
          <span className={s.banqueoDato}>
            <strong>{banqueo.examenes.falta}</strong>{' '}
            {plural(banqueo.examenes.falta, 'examen', 'exámenes')} sin banqueo
          </span>
          <span className={s.banqueoDato}>
            <strong>{banqueo.faltanClase}</strong>{' '}
            {plural(banqueo.faltanClase, 'clase', 'clases')} sin banqueo
          </span>
        </span>
      </div>

      {banqueo.cursos.length > 0 && (
        <details className={s.banqueoDetalle}>
          <summary className={s.banqueoSummary}>Ver por curso</summary>
          <ul className={s.banqueoLista}>
            {banqueo.cursos.map((c) => {
              const examenes = c.pendientes.filter((p) => p.esExamen && p.faltaBanqueo);
              const clases = c.banqueo.falta - examenes.length;
              return (
                <li key={c.slug} className={s.banqueoCurso}>
                  <span className={s.banqueoCursoNombre}>{c.nombre}</span>
                  <span className={s.banqueoCursoCuenta}>
                    {examenes.length > 0 &&
                      `${examenes.length} ${plural(examenes.length, 'examen', 'exámenes')}`}
                    {examenes.length > 0 && clases > 0 && ' · '}
                    {clases > 0 && `${clases} ${plural(clases, 'clase', 'clases')}`}
                  </span>
                  {examenes.length > 0 && (
                    <span className={s.banqueoExamenes}>
                      {examenes.map((p) => (
                        <Link key={p.id} href={p.href} prefetch={false} className={s.banqueoExamen}>
                          {p.codigo ?? p.examenLabel}
                        </Link>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </section>
  );
}

export default function AportesPanel({ avance, aportes, registro, actualizado }: Props) {
  const { facultad, ufbi, banqueo } = avance;
  const pdfFacultad = facultad.conFalta.reduce((n, c) => n + enPdf(c.pendientes), 0);
  const pdfUfbi = ufbi.conFalta.reduce((n, c) => n + enPdf(c.pendientes), 0);
  const activos = aportes.filter(
    (a) => a.resumenes > 0 || a.banqueos > 0 || a.laboratorios > 0 || a.histologia > 0,
  );

  return (
    <div className={s.wrapper}>
      <RefrescoAlVolver />

      <header className={s.cabecera}>
        <div>
          <h2 className={s.titulo}>Qué falta por escribir</h2>
          <p className={s.sub}>
            El resumen en HTML de cada clase de Cayetano; un PDF no cuenta. Se lee de
            los sílabos: al publicar el HTML, su clase sale sola de esta lista.
          </p>
        </div>
        <p className={s.actualizado}>
          <span className={s.vivo} aria-hidden="true" />
          Actualizado a las {actualizado}
        </p>
      </header>

      {/* ── Lo que manda: Facultad ── */}
      <section className={s.principal} aria-labelledby="titulo-facultad">
        <div className={s.hero}>
          <div className={s.heroNumero}>
            <strong>{facultad.resumen.falta}</strong>
            <span>
              {plural(facultad.resumen.falta, 'clase', 'clases')} sin HTML
            </span>
          </div>
          <div className={s.heroTexto}>
            <h3 id="titulo-facultad" className={s.heroTitulo}>
              {facultad.etiqueta}
            </h3>
            <p className={s.heroSub}>
              {facultad.resumen.listo} de {total(facultad.resumen)} clases ya tienen
              resumen en HTML ({facultad.resumen.cobertura} %)
              {pdfFacultad > 0 && (
                <>
                  {' '}
                  · <strong className={s.heroPdf}>{pdfFacultad}</strong> de las que
                  faltan ya están en PDF
                </>
              )}{' '}
              · {facultad.conFalta.length}{' '}
              {plural(facultad.conFalta.length, 'curso', 'cursos')} con pendientes, de
              menos a más
            </p>
            <Barra slot={facultad.resumen} grande />
          </div>
        </div>

        <CursosDelTramo tramo={facultad} abiertos />
      </section>

      {/* ── Segundo plano: UFBI ── */}
      <details className={s.secundario}>
        <summary className={s.secundarioSummary}>
          <span className={s.secundarioTitulo}>{ufbi.etiqueta}</span>
          <span className={s.secundarioDato}>
            <strong>{ufbi.resumen.falta}</strong>{' '}
            {plural(ufbi.resumen.falta, 'clase', 'clases')} sin HTML
            {pdfUfbi > 0 && ` (${pdfUfbi} en PDF)`} · {ufbi.resumen.cobertura} %
          </span>
          <span className={s.chevron} aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className={s.secundarioCuerpo}>
          <CursosDelTramo tramo={ufbi} abiertos={false} />
        </div>
      </details>

      <BanqueoCompacto banqueo={banqueo} />

      {/* ── Segundo plano: el reparto del equipo ── */}
      <details className={s.secundario}>
        <summary className={s.secundarioSummary}>
          <span className={s.secundarioTitulo}>Aportes del equipo</span>
          <span className={s.secundarioDato}>Quién subió qué y recuento por persona</span>
          <span className={s.chevron} aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className={s.secundarioCuerpo}>
          {registro}

          <h4 className={s.subtitulo}>Aportes por persona</h4>
          <p className={s.nota}>
            Manda lo marcado en el registro; un material firmado por dos cuenta la
            mitad para cada uno.
          </p>
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
                    <dd>
                      {a.banqueos}
                      {a.banqueosRecolectados > 0 && (
                        <span className={styles.recolectados}>
                          {' '}
                          · {a.banqueosRecolectados} PDF
                        </span>
                      )}
                    </dd>
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
                    <dt>Histología</dt>
                    <dd>{a.histologia}</dd>
                  </div>
                  <div>
                    <dt>Cursos con material</dt>
                    <dd>{a.cursosConMaterial}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </details>

      {/* ── Ayuda: qué cuenta y qué no ── */}
      <details className={s.secundario}>
        <summary className={s.secundarioSummary}>
          <span className={s.secundarioTitulo}>Cómo se cuenta</span>
          <span className={s.secundarioDato}>Qué entra en cada número</span>
          <span className={s.chevron} aria-hidden="true">
            ▾
          </span>
        </summary>
        <div className={s.secundarioCuerpo}>
          <ul className={styles.leyendaLista}>
            <li>
              <strong>Material escrito</strong>: la tarjeta Resumen de una clase,{' '}
              <strong>sólo si está en HTML</strong> (flujo, páginas, hojas o capas). Se
              exige en las clases con tema propio.
            </li>
            <li>
              <strong>Fuera del porcentaje</strong>: parciales, finales, PC y demás
              evaluaciones (también los portafolios), las entregas y los refuerzos
              (tipo «Repaso», o un título que empieza por «Repaso» o «Revisión
              general»), aunque tengan resumen.
            </li>
            <li>
              <strong>Resumen compartido</strong>: la práctica de anatomía o histología
              que el sílabo separa de su magistral muestra el resumen de esa magistral
              y cuenta como lista. El reparto vive al final de cada sílabo
              (<code>compartirResumenes</code>).
            </li>
            <li>
              <strong>PDF</strong>: la clase lo muestra al alumno, pero aquí sigue
              faltando; sale marcada «PDF» porque basta con pasarla a HTML. El crédito
              por persona del registro sí cuenta los PDF.
            </li>
            <li>
              <strong>Sin sílabo</strong>: un curso sin clases cargadas no cuenta como
              completo; sale aparte hasta tener su sílabo.
            </li>
            <li>
              <strong>Banqueo</strong>: banco de preguntas, tarjetas, solucionario o PDF
              de práctica. Se exige en las clases y en todas las evaluaciones; los
              exámenes cuentan aparte porque ahí es el único material posible.
            </li>
            <li>
              <strong>No cuenta</strong>: el video (material a futuro), los labs que no
              llevan banqueo y las actividades con invitación a colaborar, como los
              talleres científicos de Química Orgánica.
            </li>
            <li>
              <strong>Armado o recolectado</strong>: si un banqueo se hizo a mano o se
              consiguió en PDF no se deduce del sílabo; lo declara cada persona al
              marcar su círculo en el registro.
            </li>
          </ul>
          <p className={s.nota}>
            Mide unidades publicadas, no horas. La plataforma, la infraestructura y las
            redes se valoran aparte al negociar la parte fija.
          </p>
        </div>
      </details>
    </div>
  );
}
