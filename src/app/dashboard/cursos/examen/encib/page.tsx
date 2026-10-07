import Link from 'next/link';
import type { Metadata } from 'next';
import { AREAS, AREA_POR_CODIGO, ENCIB, REPETICIONES, ROTACIONES, type Carga, type Dificultad } from '@/lib/data/encib';
import {
  ANIOS, ANIOS_VIGENTES, areaDe, carga, dificultad, formato, nombreTema,
  preguntasDeArea, preguntasDificiles, temasDistintos, temasEnLosTres,
} from '@/lib/encib/analisis';
import { diasHasta, fechaLarga } from '@/lib/encib/fechas';
import hub from '@/styles/cursosHub.module.css';
import s from '@/styles/encib.module.css';

export const metadata: Metadata = { title: 'ENCIB 2026 · MedGO' };

const DIF: { k: Dificultad; label: string; clase: string }[] = [
  { k: 'menor', label: 'Menor', clase: s.d1 },
  { k: 'mediana', label: 'Mediana', clase: s.d2 },
  { k: 'mayor', label: 'Mayor', clase: s.d3 },
];
const CARGA: { k: Carga; label: string; clase: string }[] = [
  { k: 'memoria', label: 'Memoria', clase: s.c1 },
  { k: 'aplicacion', label: 'Aplicar un concepto', clase: s.c2 },
  { k: 'integracion', label: 'Integrar 2+ áreas', clase: s.c3 },
];

const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);

/** Barra apilada de 100 % con su leyenda numérica debajo: el número va en tinta,
 *  nunca dentro del segmento de color. */
function Apilada<K extends string>({ datos, tramos, titulo }: {
  datos: Record<K, number>;
  tramos: { k: K; label: string; clase: string }[];
  titulo: string;
}) {
  const total = tramos.reduce((t, x) => t + datos[x.k], 0);
  return (
    <div className={s.apilada}>
      <div className={s.apiladaTitulo}>{titulo}</div>
      <div className={s.apiladaBarra} role="img" aria-label={`${titulo}: ${tramos.map((x) => `${x.label} ${pct(datos[x.k], total)} %`).join(', ')}`}>
        {tramos.map((x) =>
          datos[x.k] ? (
            <span key={x.k} className={x.clase} style={{ flexGrow: datos[x.k] }} title={`${x.label}: ${datos[x.k]} de ${total} (${pct(datos[x.k], total)} %)`} />
          ) : null,
        )}
      </div>
      <div className={s.apiladaCifras}>
        {tramos.map((x) => (
          <span key={x.k}><strong>{pct(datos[x.k], total)} %</strong> {x.label.toLowerCase()}</span>
        ))}
      </div>
    </div>
  );
}

function Leyenda({ tramos }: { tramos: { k: string; label: string; clase: string }[] }) {
  return (
    <div className={s.leyenda}>
      {tramos.map((x) => (
        <span key={x.k}><i className={x.clase} aria-hidden />{x.label}</span>
      ))}
    </div>
  );
}

export default function EncibPage() {
  const dias = diasHasta(ENCIB.fecha);
  const segundos = Math.round((ENCIB.minutos * 60) / ENCIB.preguntas);

  // Áreas ordenadas de la más difícil a la más fácil (menos «menor» primero).
  const porArea = AREAS.map((a) => {
    const d = dificultad(ANIOS_VIGENTES, a.codigo);
    const n = d.menor + d.mediana + d.mayor;
    return { a, d, n, facil: n ? d.menor / n : 1 };
  }).sort((x, y) => x.facil - y.facil);

  const dificiles = preguntasDificiles();
  const enLosTres = temasEnLosTres();
  const vig = ANIOS_VIGENTES.map((y) => ({ y, d: dificultad([y]) }));
  const maxArea = Math.max(...AREAS.flatMap((a) => [a.peso, ...ANIOS_VIGENTES.map((y) => preguntasDeArea(a.codigo, y))]));

  return (
    <div className={s.pagina}>
      <Link href="/dashboard/cursos" className={hub.volver}>← Cursos</Link>

      {/* ── Cabecera ── */}
      <header className={s.hero}>
        <div className={s.heroTexto}>
          <span className={s.kicker}>Perú · {ENCIB.organiza}</span>
          <h1 className={s.titulo}>ENCIB 2026</h1>
          <p className={s.subtitulo}>Examen Nacional de Ciencias Básicas</p>
          <p className={s.heroNota}>{ENCIB.obligatorio}</p>
        </div>
        <div className={s.cuenta}>
          {dias > 0 ? (
            <>
              <span className={s.cuentaNumero}>{dias}</span>
              <span className={s.cuentaTexto}>{dias === 1 ? 'día' : 'días'} para el {fechaLarga(ENCIB.fecha)}</span>
            </>
          ) : (
            <span className={s.cuentaTexto}>{dias === 0 ? 'Es hoy' : `Se rindió el ${fechaLarga(ENCIB.fecha)}`}</span>
          )}
        </div>
      </header>

      <ul className={s.datos}>
        <li><strong>{ENCIB.preguntas}</strong> preguntas</li>
        <li><strong>{ENCIB.minutos / 60} h</strong> en total</li>
        <li><strong>{segundos} s</strong> por pregunta</li>
        <li><strong>{ENCIB.alternativas}</strong> alternativas</li>
        <li><strong>Sin</strong> puntaje negativo</li>
        <li><strong>0-20</strong> escala vigesimal</li>
      </ul>

      <aside className={s.pronto}>
        <strong>Banqueo ENCIB, muy pronto.</strong> Las 300 preguntas oficiales (2021, 2024 y 2025) para resolver aquí,
        con informe de tus temas flojos al terminar.
      </aside>

      {/* ── Peso por área ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Cuánto pesa cada área</h2>
        <p className={s.lead}>
          La tabla oficial reparte las 100 preguntas por área y no ha cambiado desde 2024: el temario 2026 es el de 2025 con otra portada.
          Así salieron de verdad:
        </p>
        <div className={s.leyenda}>
          <span><i className={s.serieTabla} aria-hidden />Tabla oficial</span>
          <span><i className={s.serie2024} aria-hidden />2024</span>
          <span><i className={s.serie2025} aria-hidden />2025</span>
        </div>
        <div className={s.pesos}>
          {AREAS.map((a) => {
            const series = [
              { k: 'Tabla oficial', v: a.peso, c: s.serieTabla },
              ...ANIOS_VIGENTES.map((y) => ({ k: String(y), v: preguntasDeArea(a.codigo, y), c: y === 2024 ? s.serie2024 : s.serie2025 })),
            ];
            return (
              <Link key={a.slug} href={`/dashboard/cursos/area/${a.slug}`} className={s.pesoFila}>
                <span className={s.pesoNombre}>
                  <i style={{ background: a.color }} aria-hidden />
                  {a.nombre}
                </span>
                <span className={s.pesoBarras}>
                  {series.map((x) => (
                    <span key={x.k} className={s.pesoBarra} title={`${a.nombre} · ${x.k}: ${x.v} preguntas`}>
                      <span className={x.c} style={{ width: `${(x.v / maxArea) * 100}%` }} />
                      <em>{x.v}</em>
                    </span>
                  ))}
                </span>
              </Link>
            );
          })}
        </div>
        <p className={s.nota}>Cada pregunta se cuenta en su área principal; una pregunta integrada toca además otras.</p>
      </section>

      {/* ── Dificultad ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Qué tan difícil es de verdad</h2>
        <p className={s.lead}>
          La tabla anuncia {ENCIB.dificultadAnunciada.menor} de preguntas fáciles, {ENCIB.dificultadAnunciada.mediana} medianas
          y {ENCIB.dificultadAnunciada.mayor} difíciles. En los dos últimos exámenes, <strong>7 de cada 10 fueron de dificultad menor</strong>:
          con lo esencial bien sabido se aprueba.
        </p>
        <Leyenda tramos={DIF} />
        {vig.map(({ y, d }) => <Apilada key={y} titulo={`ENCIB ${y}`} datos={d} tramos={DIF} />)}
        <Apilada titulo="Piloto 2021" datos={dificultad([2021])} tramos={DIF} />
      </section>

      {/* ── Dónde están las difíciles ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Dónde están las difíciles</h2>
        <p className={s.lead}>
          No se reparten igual. Anatomía y Fisiología concentran las de mayor dificultad; Microbiología, Histología,
          Embriología y Bioquímica no tuvieron ninguna en 2024 ni en 2025.
        </p>
        <Leyenda tramos={DIF} />
        <div className={s.areasDif}>
          {porArea.map(({ a, d, n }) => (
            <Link key={a.slug} href={`/dashboard/cursos/area/${a.slug}`} className={s.areaDif}>
              <span className={s.areaDifNombre}>{a.nombre}</span>
              <span className={s.apiladaBarra} role="img" aria-label={`${a.nombre}: ${DIF.map((x) => `${x.label} ${d[x.k]}`).join(', ')}`}>
                {DIF.map((x) => (d[x.k] ? <span key={x.k} className={x.clase} style={{ flexGrow: d[x.k] }} title={`${x.label}: ${d[x.k]} de ${n}`} /> : null))}
              </span>
              <span className={s.areaDifCifra}>{pct(d.menor, n)} % fáciles</span>
            </Link>
          ))}
        </div>

        <h3 className={s.h3}>Las {dificiles.length} preguntas difíciles de 2024 y 2025</h3>
        <ul className={s.lista}>
          {dificiles.map((q) => {
            const a = AREA_POR_CODIGO[areaDe(q.codigo)];
            return (
              <li key={`${q.anio}-${q.n}`}>
                <span className={s.chip} style={{ borderColor: a.color }}>{a.nombre}</span>
                <span className={s.listaTexto}>{q.concepto}</span>
                <span className={s.listaAnio}>{q.anio} · {q.n}</span>
              </li>
            );
          })}
        </ul>
        <p className={s.nota}>
          Casi todas exigen descartar la respuesta refleja (la altitud, Kaposi, el factor intrínseco), encadenar tres pasos
          o saber qué fibra va por dónde.
        </p>
      </section>

      {/* ── Memoria o razonamiento ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>¿Memoria o razonamiento?</h2>
        <p className={s.lead}>
          El examen nacional se volvió más memorístico que el piloto: solo 8 preguntas por año obligan a unir dos áreas.
          Farmacología es la más de memoria; Anatomía, la que más integra.
        </p>
        <Leyenda tramos={CARGA} />
        {[...ANIOS_VIGENTES, 2021 as const].map((y) => (
          <Apilada key={y} titulo={y === 2021 ? 'Piloto 2021' : `ENCIB ${y}`} datos={carga([y])} tramos={CARGA} />
        ))}
      </section>

      {/* ── Qué se repite ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Qué se repite</h2>
        <p className={s.lead}>
          Cada examen toca entre {temasDistintos(2024)} y {temasDistintos(2025)} de los 337 temas de la tabla, pero hay un núcleo que vuelve.
        </p>

        <h3 className={s.h3}>Casi iguales de un año a otro</h3>
        <ul className={s.lista}>
          {REPETICIONES.map((r) => (
            <li key={r.concepto}>
              <span className={s.listaTexto}>{r.concepto}</span>
              <span className={s.listaAnio}>{r.veces}</span>
            </li>
          ))}
        </ul>

        <h3 className={s.h3}>El tema se queda, la entidad cambia por su «hermana»</h3>
        <div className={s.rotaciones}>
          {ROTACIONES.map((r) => (
            <div key={r.tema} className={s.rotacion}>
              <span className={s.rotacionTema}>{r.tema}</span>
              <span>{r.de}</span>
              <span className={s.rotacionFlecha} aria-hidden>↓</span>
              <span>{r.a}</span>
            </div>
          ))}
        </div>
        <p className={s.nota}>Estudiar el grupo completo cubre la rotación.</p>

        <h3 className={s.h3}>Temas que salieron en los tres años</h3>
        <div className={s.chips}>
          {enLosTres.map((c) => {
            const a = AREA_POR_CODIGO[areaDe(c)];
            return (
              <span key={c} className={s.chip} style={{ borderColor: a.color }} title={a.nombre}>
                {nombreTema(c)}
              </span>
            );
          })}
        </div>
      </section>

      {/* ── Formato ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Cómo son las preguntas</h2>
        <div className={s.tabla} role="table" aria-label="Formato de las preguntas por año">
          <div role="row" className={s.tablaCab}>
            <span role="columnheader">Año</span>
            <span role="columnheader">Caso clínico</span>
            <span role="columnheader">Problema</span>
            <span role="columnheader">Directa</span>
            <span role="columnheader">Caso que sobra</span>
          </div>
          {[...ANIOS].reverse().map((y) => {
            const f = formato(y);
            return (
              <div role="row" key={y} className={s.tablaFila}>
                <span role="cell">{y === 2021 ? '2021 (piloto)' : y}</span>
                <span role="cell">{f.caso}</span>
                <span role="cell">{f.problema}</span>
                <span role="cell">{f.directa}</span>
                <span role="cell">{f.decorativo}</span>
              </div>
            );
          })}
        </div>
        <p className={s.nota}>
          La tabla promete 30 % de preguntas tipo problema y en 2024-2025 salieron 2 por año. En casi un tercio, el caso
          ya nombra la enfermedad y se responde sin leerlo. Desde 2025 no hay imágenes: la histología se describe en palabras.
        </p>
      </section>

      {/* ── Estrategia ── */}
      <section className={s.seccion}>
        <h2 className={s.h2}>Cómo prepararlo</h2>
        <ol className={s.pasos}>
          <li><strong>Asegura los puntos de memoria.</strong> Microbiología (uno de cada grupo de la lista), farmacología del autónomo y antídotos, «qué célula hace qué» en Histología y anomalías con teratógenos en Embriología. Son casi todo dificultad menor.</li>
          <li><strong>Gana donde se separan los puntajes.</strong> Neuroanatomía (pares craneales y vía visual), pelvis, fisiología respiratoria con altura, digestiva y renal.</li>
          <li><strong>No te quedes en lo que casi no sale.</strong> Miembros, fisiología cardiovascular y del locomotor: una pregunta o ninguna por año.</li>
          <li><strong>En el examen:</strong> {segundos} segundos por pregunta, ninguna en blanco (no resta) y lee primero la pregunta del final: el caso suele nombrar la entidad.</li>
        </ol>
      </section>

      <p className={s.fuente}>
        Análisis de MedGO sobre los cuadernillos y tablas de especificaciones oficiales de ASPEFAM (2021, 2024, 2025 y 2026).
        La dificultad es una estimación: ASPEFAM no publica el porcentaje de acierto por pregunta.
      </p>
    </div>
  );
}
