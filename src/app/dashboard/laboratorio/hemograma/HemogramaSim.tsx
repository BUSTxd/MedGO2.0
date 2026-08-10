'use client';
/**
 * Simulador de hemograma completo (CBC).
 *
 * Tres modos: explorar (un escenario), comparar (dos lado a lado) y quiz.
 * Los valores nunca se escriben a mano en la UI: salen de `calcularValores`,
 * que deriva índices y absolutos de los primarios del escenario.
 *
 * Accesibilidad: bajo/normal/alto se comunica con color + glifo + palabra.
 * Nunca solo con color (ver cabecera de hemograma.module.css).
 */
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ESCENARIOS,
  GRUPOS,
  PARAMETROS,
  PARAM_POR_ID,
  INFO,
  DISCLAIMER,
  GLOSARIO,
  calcularValores,
  estadoDe,
  rangoDe,
  posicionEnEscala,
  fueraDeEscala,
  formatear,
  patronesActivos,
  indiceNL,
  interpretarNL,
  nlInterpretable,
  acentoDe,
  esDeterminante,
  alteradosDeSerie,
  SERIES,
  GLIFO,
  PALABRA,
  type Escenario,
  type Estado,
  type Parametro,
  type Sexo,
  type Valores,
} from '@/lib/data/hemograma';
import QuizHemograma from './QuizHemograma';
import PanelParametro from './PanelParametro';
import s from '@/styles/hemograma.module.css';

type Modo = 'explorar' | 'comparar' | 'quiz';

const CLASE_VALOR: Record<Estado, string> = { bajo: s.vBajo, normal: s.vNormal, alto: s.vAlto };
const CLASE_ESTADO: Record<Estado, string> = { bajo: s.eBajo, normal: s.eNormal, alto: s.eAlto };
const CLASE_MARCA: Record<Estado, string> = { bajo: s.mBajo, normal: s.mNormal, alto: s.mAlto };

/* ─────────────────── Termómetro ─────────────────── */

function Termometro({ valor, p, sexo }: { valor: number; p: Parametro; sexo: Sexo }) {
  const r = rangoDe(p, sexo);
  const span = p.escala.max - p.escala.min;
  const pct = (n: number) => ((n - p.escala.min) / span) * 100;

  const izq = Math.max(0, pct(r.min));
  // Los parámetros cuyo normal es 0 (serie inmadura) tendrían una franja de
  // ancho cero e invisible: se le da un mínimo dibujable.
  const ancho = Math.max(1.5, Math.min(100 - izq, pct(r.max) - izq));
  const estado = estadoDe(valor, p, sexo);

  return (
    <div className={s.term}>
      <div className={s.termTrack}>
        <div className={s.termNormal} style={{ left: `${izq}%`, width: `${ancho}%` }} />
      </div>
      {/* Fuera del track: éste recorta con overflow:hidden y la aguja desborda
          a propósito por arriba y por abajo. */}
      <div
        className={`${s.termMarca} ${CLASE_MARCA[estado]}`}
        style={{ left: `${posicionEnEscala(valor, p) * 100}%` }}
      />
      {fueraDeEscala(valor, p) && <span className={s.termFuera}>fuera de escala</span>}
      <span className={s.termRango}>
        {p.ceroEsNormal ? 'normal: 0' : `${formatear(r.min, p)} – ${formatear(r.max, p)}`}
      </span>
    </div>
  );
}

/* ─────────────────── Fila ─────────────────── */

function Fila({
  p, valor, sexo, activo, clave, pulso, onClick,
}: {
  p: Parametro; valor: number; sexo: Sexo;
  activo: boolean; clave: boolean; pulso: boolean;
  onClick: () => void;
}) {
  const estado = estadoDe(valor, p, sexo);
  return (
    <button
      type="button"
      className={[
        s.fila,
        activo ? s.filaActiva : '',
        clave ? s.filaClave : '',
        clave && pulso ? s.filaPulso : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      aria-label={
        `${p.nombre}: ${formatear(valor, p)} ${p.unidad}, ${PALABRA[estado]}` +
        (clave ? '. Parámetro determinante de este caso' : '')
      }
    >
      <span className={s.filaNombre}>
        <span className={s.filaNombreTexto}>
          {p.nombre}
          {clave && <span className={s.chipClave}>clave</span>}
        </span>
        <span className={s.filaAbrev}>
          {p.abrev}
          {p.formula && <> · <span className={s.filaFormula}>{p.formula}</span></>}
        </span>
      </span>

      <span className={s.filaValorCol}>
        <span className={`${s.filaValor} ${CLASE_VALOR[estado]}`}>{formatear(valor, p)}</span>
        <span className={s.filaUnidad}>{p.unidad}</span>
      </span>

      <Termometro valor={valor} p={p} sexo={sexo} />

      <span className={s.estadoCol}>
        <span className={`${s.estado} ${CLASE_ESTADO[estado]}`}>
          <span aria-hidden>{GLIFO[estado]}</span>
          {PALABRA[estado]}
        </span>
      </span>
    </button>
  );
}

/* ─────────────────── Vistazo por serie ───────────────────
   Responde «¿qué serie está tocada?» antes de leer una sola fila. El color
   sale del estado del parámetro que representa la serie; si ese está normal
   pero hay otros alterados, se avisa en ámbar en vez de dar un falso «todo
   bien» en verde. */

function Vistazo({ valores, sexo }: { valores: Valores; sexo: Sexo }) {
  return (
    <div className={s.vistazo}>
      {SERIES.map((serie) => {
        const p = PARAM_POR_ID[serie.principal];
        const valor = valores[serie.principal];
        const estado = estadoDe(valor, p, sexo);
        const alterados = alteradosDeSerie(serie, valores, sexo);

        const color =
          estado === 'bajo' ? 'var(--hg-bajo)'
          : estado === 'alto' ? 'var(--hg-alto)'
          : alterados > 0 ? 'var(--hg-aviso)'
          : 'var(--hg-normal)';

        return (
          <div key={serie.id} className={s.serie} style={{ ['--serie-color' as string]: color }}>
            <p className={s.serieTitulo}>{serie.titulo}</p>
            <div className={s.serieCifra}>
              <span className={s.serieValor}>{formatear(valor, p)}</span>
              <span className={s.serieUnidad}>{p.unidad}</span>
              <span className={s.serieAbrev}>{p.abrev}</span>
            </div>
            <div className={s.serieEstado} style={{ color }}>
              <span aria-hidden>{GLIFO[estado]}</span>
              {PALABRA[estado]}
            </div>
            <p className={s.serieAlterados}>
              {alterados === 0
                ? `Los ${serie.miembros.length} parámetros en rango`
                : `${alterados} de ${serie.miembros.length} fuera de rango`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────── Comparar ─────────────────── */

function TablaComparar({ a, b, sexo }: { a: Escenario; b: Escenario; sexo: Sexo }) {
  const va = useMemo(() => calcularValores(a.valores), [a]);
  const vb = useMemo(() => calcularValores(b.valores), [b]);

  return (
    <div className={s.secciones}>
      {GRUPOS.map((g) => {
        const params = PARAMETROS.filter((p) => p.grupo === g.id);
        return (
          <section key={g.id} className={s.seccion}>
            <header className={s.seccionHead}>
              <h3 className={s.seccionTitulo}>{g.titulo}</h3>
              <span className={s.seccionDesc}>{g.desc}</span>
            </header>
            <div className={s.cmpHead}>
              <span>Parámetro</span>
              <span>{a.corto}</span>
              <span>{b.corto}</span>
            </div>
            {params.map((p) => {
              const ea = estadoDe(va[p.id], p, sexo);
              const eb = estadoDe(vb[p.id], p, sexo);
              const difiere = ea !== eb;
              const delta = vb[p.id] - va[p.id];
              return (
                <div key={p.id} className={`${s.cmpFila} ${difiere ? s.cmpDifiere : ''}`}>
                  <span className={s.filaNombre}>
                    <span className={s.filaNombreTexto}>{p.nombre}</span>
                    <span className={s.filaAbrev}>{p.abrev} · {p.unidad}</span>
                  </span>
                  <span className={s.cmpCelda}>
                    <span className={`${s.cmpValor} ${CLASE_VALOR[ea]}`}>{formatear(va[p.id], p)}</span>
                    <span aria-label={PALABRA[ea]} className={CLASE_VALOR[ea]}>{GLIFO[ea]}</span>
                  </span>
                  <span className={s.cmpCelda}>
                    <span className={`${s.cmpValor} ${CLASE_VALOR[eb]}`}>{formatear(vb[p.id], p)}</span>
                    <span aria-label={PALABRA[eb]} className={CLASE_VALOR[eb]}>{GLIFO[eb]}</span>
                    {Math.abs(delta) > 0.005 && (
                      <span className={s.cmpDelta}>
                        {delta > 0 ? '+' : ''}{formatear(delta, p)}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

/* ─────────────────── Principal ─────────────────── */

export default function HemogramaSim() {
  const [modo, setModo] = useState<Modo>('explorar');
  const [escenarioId, setEscenarioId] = useState('sano');
  const [comparaId, setComparaId] = useState('viral');
  const [sexo, setSexo] = useState<Sexo>('F');
  const [simple, setSimple] = useState(false);
  const [paramActivo, setParamActivo] = useState<string | null>(null);

  const escenario = ESCENARIOS.find((e) => e.id === escenarioId) ?? ESCENARIOS[0];
  const comparaB = ESCENARIOS.find((e) => e.id === comparaId) ?? ESCENARIOS[1];

  const valores: Valores = useMemo(() => calcularValores(escenario.valores), [escenario]);
  const patrones = useMemo(() => patronesActivos(valores, sexo), [valores, sexo]);
  const nl = useMemo(() => indiceNL(valores), [valores]);
  const nlInfo = useMemo(() => interpretarNL(nl, valores), [nl, valores]);

  const acento = acentoDe(escenario.id);

  const cerrarPanel = useCallback(() => setParamActivo(null), []);

  useEffect(() => {
    if (!paramActivo) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrarPanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paramActivo, cerrarPanel]);

  // Pulso de los determinantes al entrar a un escenario nuevo: la mirada
  // aterriza sola donde importa en vez de tener que buscarlos.
  const [pulso, setPulso] = useState(false);
  useEffect(() => {
    setPulso(true);
    const t = setTimeout(() => setPulso(false), 900);
    return () => clearTimeout(t);
  }, [escenarioId]);

  return (
    <div className={s.wrap} style={{ ['--caso' as string]: acento }}>
      {/* Disclaimer — siempre visible, en los tres modos */}
      <div className={s.disclaimer} role="note">
        <svg className={s.disclaimerIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2 1 21h22L12 2zm0 15h-1.5v-1.5H12V17zm0-3h-1.5V9H12v5z" />
        </svg>
        <span><strong>Aviso:</strong> {DISCLAIMER}</span>
      </div>

      {/* ── Controles ── */}
      <div className={s.controles}>
        <div className={s.filaControl}>
          <span className={s.etiquetaControl}>Modo</span>
          <div className={s.segmento} role="tablist">
            {(['explorar', 'comparar', 'quiz'] as Modo[]).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={modo === m}
                className={`${s.segBtn} ${modo === m ? s.segOn : ''}`}
                onClick={() => setModo(m)}
              >
                {m === 'explorar' ? 'Explorar' : m === 'comparar' ? 'Comparar' : 'Quiz'}
              </button>
            ))}
          </div>

          <span className={s.etiquetaControl}>Rangos</span>
          <div className={s.segmento}>
            {(['F', 'M'] as Sexo[]).map((x) => (
              <button
                key={x}
                type="button"
                aria-pressed={sexo === x}
                className={`${s.segBtn} ${sexo === x ? s.segOn : ''}`}
                onClick={() => setSexo(x)}
              >
                {x === 'F' ? 'Mujer' : 'Varón'}
              </button>
            ))}
          </div>

          {modo !== 'quiz' && (
            <button
              type="button"
              aria-pressed={simple}
              className={`${s.chip} ${simple ? s.chipOn : ''}`}
              onClick={() => setSimple((v) => !v)}
            >
              Explícamelo simple
            </button>
          )}
        </div>

        {modo !== 'quiz' && (
          <div className={s.filaControl}>
            <span className={s.etiquetaControl}>
              {modo === 'comparar' ? 'Escenario A' : 'Escenario'}
            </span>
            <div className={s.chips}>
              {ESCENARIOS.map((e) => {
                const on = escenarioId === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    aria-pressed={on}
                    className={`${s.chip} ${on ? s.chipOn : ''} ${e.sensible ? s.chipSensible : ''}`}
                    // Cada caso lleva su propio acento, así el color del chip ya
                    // anticipa el que teñirá sus parámetros determinantes.
                    style={on
                      ? { background: acentoDe(e.id), borderColor: acentoDe(e.id) }
                      : { ['--chip-hov' as string]: acentoDe(e.id) }}
                    onClick={() => setEscenarioId(e.id)}
                  >
                    {e.corto}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {modo === 'comparar' && (
          <div className={s.filaControl}>
            <span className={s.etiquetaControl}>Escenario B</span>
            <div className={s.chips}>
              {ESCENARIOS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={comparaId === e.id}
                  className={`${s.chip} ${comparaId === e.id ? s.chipOn : ''} ${e.sensible ? s.chipSensible : ''}`}
                  onClick={() => setComparaId(e.id)}
                >
                  {e.corto}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {modo === 'quiz' ? (
        <QuizHemograma sexo={sexo} />
      ) : (
        <>
          {/* ── Vistazo por serie ── */}
          {modo === 'explorar' && <Vistazo valores={valores} sexo={sexo} />}

          {/* ── Viñeta clínica ── */}
          <div className={s.vineta} style={{ borderLeftColor: acento }}>
            <h3 className={s.vinetaTitulo}>
              {escenario.nombre}
              {modo === 'comparar' && <> &nbsp;vs&nbsp; {comparaB.nombre}</>}
            </h3>
            <p className={s.vinetaTexto}>{escenario.vineta}</p>
            {modo === 'explorar' && (
              <ul className={s.vinetaClaves} style={{ ['--punto' as string]: acento }}>
                {escenario.claves.map((c) => <li key={c}>{c}</li>)}
              </ul>
            )}
            {modo === 'explorar' && escenario.id !== 'sano' && (
              <p className={s.leyendaClave}>
                <span className={s.chipClave}>clave</span>
                marca los parámetros que definen este patrón. Ojo: determinante no
                es lo mismo que alterado — en la deshidratación el VCM va marcado
                precisamente porque sale <strong>normal</strong>, y eso es lo que
                descarta una poliglobulia real.
              </p>
            )}
            {simple && (
              <div className={s.simpleBox}>
                <strong>En simple: </strong>{escenario.simple}
              </div>
            )}
            {escenario.sensible && (
              <div className={s.simpleBox} style={{ marginTop: 8 }}>
                <strong>Nota: </strong>
                este escenario es exclusivamente ilustrativo. Un hemograma nunca diagnostica
                una leucemia por sí solo: el diagnóstico exige frotis, aspirado de médula ósea,
                citometría de flujo y estudio citogenético.
              </div>
            )}
          </div>

          {modo === 'explorar' && (
            <>
              {/* ── Patrones combinados ── */}
              {patrones.length > 0 && (
                <div className={s.patrones}>
                  {patrones.map((pt) => (
                    <div
                      key={pt.id}
                      className={`${s.patron} ${
                        pt.gravedad === 'alerta' ? s.patronAlerta
                        : pt.gravedad === 'aviso' ? s.patronAviso : s.patronInfo
                      }`}
                    >
                      <span className={s.patronGlifo} aria-hidden>
                        {pt.gravedad === 'alerta' ? '▲' : pt.gravedad === 'aviso' ? '◆' : '●'}
                      </span>
                      <div>
                        <p className={s.patronTitulo}>{pt.titulo}</p>
                        <p className={s.patronDetalle}>{pt.detalle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Índice N/L ── */}
              <div className={s.nl}>
                <span className={s.nlLabel}>Índice neutrófilo / linfocito</span>
                <span className={s.nlValor}>
                  {nlInterpretable(valores) && Number.isFinite(nl) ? nl.toFixed(2) : '—'}
                </span>
                <span
                  className={`${s.nlTexto} ${
                    nlInfo.tono === 'alto' ? s.nlAlto : nlInfo.tono === 'bajo' ? s.nlBajo : s.nlNormal
                  }`}
                >
                  {nlInfo.texto}
                </span>
                <span className={s.nlNota}>
                  Se calcula con los absolutos: (segmentados + abastonados) ÷ linfocitos.
                  Orienta sobre el origen de una infección aguda mejor que el recuento total
                  de leucocitos — por debajo de 2 apunta a viral, por encima de 3 a bacteriano.
                </span>
              </div>
            </>
          )}

          {/* ── Reporte ── */}
          {modo === 'comparar' ? (
            <TablaComparar a={escenario} b={comparaB} sexo={sexo} />
          ) : (
            <div className={s.secciones}>
              {GRUPOS.map((g) => {
                const params = PARAMETROS.filter((p) => p.grupo === g.id);
                return (
                  <section key={g.id} className={s.seccion}>
                    <header className={s.seccionHead}>
                      <h3 className={s.seccionTitulo}>{g.titulo}</h3>
                      <span className={s.seccionDesc}>{g.desc}</span>
                    </header>
                    <div className={s.colHead}>
                      <span>Examen</span>
                      <span>Resultado</span>
                      <span>Rango de referencia</span>
                      <span>Estado</span>
                    </div>
                    {params.map((p) => (
                      <Fila
                        key={p.id}
                        p={p}
                        valor={valores[p.id]}
                        sexo={sexo}
                        activo={paramActivo === p.id}
                        clave={esDeterminante(escenario.id, p.id)}
                        pulso={pulso}
                        onClick={() => setParamActivo(p.id)}
                      />
                    ))}
                  </section>
                );
              })}
            </div>
          )}

          {/* ── Glosario ── */}
          <details className={s.glosario}>
            <summary className={s.glosarioSummary}>Glosario rápido</summary>
            <div className={s.glosarioGrid}>
              {GLOSARIO.map((t) => (
                <div key={t.termino} className={s.glosarioItem}>
                  <p className={s.glosarioTermino}>{t.termino}</p>
                  <p className={s.glosarioDef}>{t.definicion}</p>
                </div>
              ))}
            </div>
          </details>
        </>
      )}

      {/* ── Panel de detalle ── */}
      {paramActivo && PARAM_POR_ID[paramActivo] && INFO[paramActivo] && (
        <PanelParametro
          p={PARAM_POR_ID[paramActivo]}
          info={INFO[paramActivo]}
          valor={valores[paramActivo]}
          sexo={sexo}
          simple={simple}
          onClose={cerrarPanel}
        />
      )}
    </div>
  );
}
