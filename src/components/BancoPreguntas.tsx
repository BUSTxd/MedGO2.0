'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@/lib/analytics';
import { shuffle } from '@/lib/utils/shuffle';
import type { BancoOpcion, BancoPregunta, BancoTema } from '@/lib/data/banco/types';
import s from '@/styles/bancoPreguntas.module.css';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Duración de la animación de salida. Vive aquí y se le pasa al CSS como
 * `--salida-ms`: si estuviera escrita en los dos sitios, cambiarla en uno
 * dejaría un parpadeo (el nodo se sustituye antes o después de que acabe).
 */
const SALIDA_MS = 170;

const MAX_INTENTOS = 20;
const intentosKey = (tandaId: string) => `medgo:attempts:${tandaId}`;

interface Intento {
  id: string;
  pre: number;
  post: number;
  total: number;
  finishedAt: string;
}

function leerIntentos(tandaId: string): Intento[] {
  try {
    const raw = localStorage.getItem(intentosKey(tandaId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { attempts?: Intento[] };
    return Array.isArray(parsed?.attempts) ? parsed.attempts : [];
  } catch {
    return [];
  }
}

function guardarIntento(tandaId: string, intento: Intento): Intento[] {
  const previos = leerIntentos(tandaId);
  const next = [intento, ...previos].slice(0, MAX_INTENTOS);
  try {
    localStorage.setItem(intentosKey(tandaId), JSON.stringify({ attempts: next }));
  } catch {
    /* modo privado o cuota llena: el intento se pierde, la sesión sigue */
  }
  return next;
}

/**
 * Baraja las alternativas evitando que salga la permutación identidad, para que
 * la correcta no caiga siempre en la letra en que fue escrita. Mismo criterio
 * que `shuffleOptionsAntiRepeat` en ExamRunner.
 */
function barajarOpciones(opciones: BancoOpcion[]): BancoOpcion[] {
  if (opciones.length < 2) return opciones.slice();
  let intento = shuffle(opciones);
  let tries = 0;
  while (tries < 8 && opciones.every((o, i) => intento[i].id === o.id)) {
    intento = shuffle(opciones);
    tries++;
  }
  return intento;
}

type Respuesta = { opcionId: string; ok: boolean };
type Paso = 'jugando' | 'bisagra' | 'resultado';

interface Props {
  tema: BancoTema;
  backHref?: string;
  backLabel?: string;
}

export default function BancoPreguntas({ tema, backHref, backLabel = 'Volver a la clase' }: Props) {
  const [tandaIdx, setTandaIdx] = useState(0);
  const [runId, setRunId] = useState(0);
  const [faseIdx, setFaseIdx] = useState(0);
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, Respuesta>>({});
  const [paso, setPaso] = useState<Paso>('jugando');
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd');
  const [saliendo, setSaliendo] = useState(false);
  const [historial, setHistorial] = useState<Intento[]>([]);
  const [reduce, setReduce] = useState(false);

  const salidaTimer = useRef<number | null>(null);

  const tanda = tema.tandas[tandaIdx];
  const fase = tanda.fases[faseIdx];
  const pregunta = fase.preguntas[preguntaIdx];
  const totalFase = fase.preguntas.length;
  const esUltimaFase = faseIdx === tanda.fases.length - 1;

  // ── Movimiento reducido ────────────────────────────────────────────────────
  // No es sólo cosmético: la máquina de estados avanza con un temporizador que
  // acompaña a la animación de salida. Con movimiento reducido no hay animación
  // que acompañar, así que el avance es inmediato.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => () => {
    if (salidaTimer.current !== null) window.clearTimeout(salidaTimer.current);
  }, []);

  // Orden barajado de las alternativas, congelado por tanda e intento: se vuelve
  // a mezclar al cambiar de tanda o al reintentar, nunca al re-renderizar.
  const opcionesPorPregunta = useMemo(() => {
    const mapa: Record<string, BancoOpcion[]> = {};
    for (const f of tanda.fases) {
      for (const q of f.preguntas) mapa[q.id] = barajarOpciones(q.opciones);
    }
    return mapa;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanda, runId]);

  const opciones = opcionesPorPregunta[pregunta.id] ?? pregunta.opciones;
  const respuesta = respuestas[pregunta.id] ?? null;

  // Imágenes de toda la tanda, para que la pregunta que lleva micrografía no
  // aparezca con un hueco mientras descarga.
  const imagenes = useMemo(
    () =>
      tanda.fases
        .flatMap(f => f.preguntas)
        .map(q => q.imagen)
        .filter((im): im is NonNullable<typeof im> => !!im),
    [tanda],
  );

  const preguntasDeFase = (i: number) => tanda.fases[i].preguntas;
  const aciertosDe = useCallback(
    (i: number) => preguntasDeFase(i).filter(q => respuestas[q.id]?.ok).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tanda, respuestas],
  );

  const respondidasFase = fase.preguntas.filter(q => respuestas[q.id]).length;
  const pct = Math.round((respondidasFase / totalFase) * 100);

  // ── Navegación ─────────────────────────────────────────────────────────────

  /** Ejecuta `fn` después de la animación de salida (o al instante si no la hay). */
  const conSalida = (direccion: 'fwd' | 'back', fn: () => void) => {
    if (saliendo) return;
    setDir(direccion);
    if (reduce) {
      fn();
      return;
    }
    setSaliendo(true);
    salidaTimer.current = window.setTimeout(() => {
      fn();
      setSaliendo(false);
      salidaTimer.current = null;
    }, SALIDA_MS);
  };

  const responder = (opcion: BancoOpcion) => {
    if (respuesta) return;
    setRespuestas(prev => ({
      ...prev,
      [pregunta.id]: { opcionId: opcion.id, ok: opcion.correcta === true },
    }));
  };

  const terminar = () => {
    const pre = aciertosDe(0);
    const post = tanda.fases.length > 1 ? aciertosDe(1) : 0;
    const total = tanda.fases.reduce((n, f) => n + f.preguntas.length, 0);
    setHistorial(
      guardarIntento(tanda.id, {
        id: `att-${Date.now()}`,
        pre,
        post,
        total,
        finishedAt: new Date().toISOString(),
      }),
    );
    trackEvent('examen_completado', {
      examKey: tanda.id,
      score: pre + post,
      total,
    });
    setPaso('resultado');
  };

  const siguiente = () => {
    if (preguntaIdx + 1 < totalFase) {
      conSalida('fwd', () => setPreguntaIdx(i => i + 1));
      return;
    }
    if (!esUltimaFase) {
      conSalida('fwd', () => setPaso('bisagra'));
      return;
    }
    conSalida('fwd', terminar);
  };

  const anterior = () => {
    if (preguntaIdx === 0) return;
    conSalida('back', () => setPreguntaIdx(i => i - 1));
  };

  const empezarSiguienteFase = () => {
    setFaseIdx(i => i + 1);
    setPreguntaIdx(0);
    setDir('fwd');
    setPaso('jugando');
  };

  const reiniciar = useCallback((idx: number) => {
    setTandaIdx(idx);
    setRunId(r => r + 1);
    setFaseIdx(0);
    setPreguntaIdx(0);
    setRespuestas({});
    setPaso('jugando');
    setDir('fwd');
    setSaliendo(false);
    if (salidaTimer.current !== null) {
      window.clearTimeout(salidaTimer.current);
      salidaTimer.current = null;
    }
  }, []);

  // Historial de la tanda activa. Se lee en efecto (localStorage no existe en
  // el servidor) y se refresca al cambiar de tanda.
  useEffect(() => {
    setHistorial(leerIntentos(tema.tandas[tandaIdx].id));
  }, [tema, tandaIdx]);

  useEffect(() => {
    trackEvent('banco_iniciado', { claseId: tema.claseId, examKey: tema.tandas[tandaIdx].id });
  }, [tema, tandaIdx]);

  // ── Piezas compartidas ─────────────────────────────────────────────────────

  const selector = tema.tandas.length > 1 && (
    <div className={s.selector}>
      <span className={s.selectorLabel}>Examen</span>
      <div className={s.selectorCuadros} role="group" aria-label="Elegir examen">
        {tema.tandas.map((t, i) => (
          <button
            key={t.id}
            type="button"
            className={`${s.selectorCuadro} ${i === tandaIdx ? s.selectorCuadroActivo : ''}`}
            aria-pressed={i === tandaIdx}
            aria-label={`Examen ${t.label}`}
            onClick={() => i !== tandaIdx && reiniciar(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );

  const cabecera = (
    <header className={s.cabecera}>
      <div>
        <span className={s.eyebrow}>Banco de preguntas</span>
        <p className={s.contador}>
          <strong>
            {fase.label} · Pregunta {preguntaIdx + 1}
          </strong>
          <span>de {totalFase}</span>
        </p>
      </div>

      <div className={s.progresoWrap}>
        <div
          className={s.progresoTrack}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Avance del ${fase.label.toLowerCase()}`}
        >
          <div className={s.progresoFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={s.progresoNum}>{pct}%</span>
      </div>
    </header>
  );

  // ── Vistas ─────────────────────────────────────────────────────────────────

  if (paso === 'bisagra') {
    const pre = aciertosDe(0);
    const totalPre = preguntasDeFase(0).length;
    return (
      <div className={s.shell} style={{ '--acc': tema.acento } as React.CSSProperties}>
        {backHref && (
          <Link href={backHref} className={s.backLink}>
            ← {backLabel}
          </Link>
        )}
        {selector}
        <section className={s.bisagra}>
          <span className={s.bisagraEyebrow}>{tanda.fases[0].label} completado</span>
          <p className={s.bisagraScore}>
            <strong>{pre}</strong>
            <span>de {totalPre}</span>
          </p>
          <p className={s.bisagraTexto}>
            Ahora el <strong>{tanda.fases[1].label.toLowerCase()}</strong>: las mismas{' '}
            {preguntasDeFase(1).length} preguntas de siempre, sobre lo que acabas de repasar.
          </p>
          <button type="button" className={s.btnPrimario} onClick={empezarSiguienteFase}>
            Empezar el {tanda.fases[1].label.toLowerCase()} →
          </button>
        </section>
      </div>
    );
  }

  if (paso === 'resultado') {
    const pre = aciertosDe(0);
    const post = tanda.fases.length > 1 ? aciertosDe(1) : 0;
    const total = tanda.fases.reduce((n, f) => n + f.preguntas.length, 0);
    const aciertos = pre + post;
    const porcentaje = Math.round((aciertos / total) * 100);
    const titulo =
      porcentaje >= 80
        ? '¡Excelente!'
        : porcentaje >= 60
          ? '¡Buen trabajo!'
          : porcentaje >= 40
            ? 'Vas por buen camino'
            : 'A repasar este tema';

    return (
      <div className={s.shell} style={{ '--acc': tema.acento } as React.CSSProperties}>
        {backHref && (
          <Link href={backHref} className={s.backLink}>
            ← {backLabel}
          </Link>
        )}
        {selector}
        <section className={s.resultado}>
          <div className={s.resultadoCirculo}>
            <span className={s.resultadoNum}>
              {aciertos}
              <em>/{total}</em>
            </span>
            <span className={s.resultadoPct}>{porcentaje}%</span>
          </div>

          <h2 className={s.resultadoTitulo}>{titulo}</h2>
          <p className={s.resultadoDesglose}>
            {tanda.fases.map((f, i) => (
              <span key={f.id} className={s.resultadoChip}>
                {f.label} <strong>{i === 0 ? pre : post}</strong>/{f.preguntas.length}
              </span>
            ))}
          </p>

          {historial.length > 1 && (
            <div className={s.historial}>
              <p className={s.historialTitulo}>Intentos anteriores</p>
              {historial.slice(0, 5).map(h => (
                <p key={h.id} className={s.historialFila}>
                  <span>
                    {new Date(h.finishedAt).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                  <span className={s.historialScore}>
                    {h.pre + h.post}/{h.total}
                  </span>
                </p>
              ))}
            </div>
          )}

          <div className={s.resultadoAcciones}>
            <button type="button" className={s.btnPrimario} onClick={() => reiniciar(tandaIdx)}>
              Repetir examen {tanda.label}
            </button>
            {backHref && (
              <Link href={backHref} className={s.btnFantasma}>
                {backLabel}
              </Link>
            )}
          </div>
        </section>
      </div>
    );
  }

  // paso === 'jugando'
  return (
    <div className={s.shell} style={{ '--acc': tema.acento } as React.CSSProperties}>
      {backHref && (
        <Link href={backHref} className={s.backLink}>
          ← {backLabel}
        </Link>
      )}
      {selector}
      {cabecera}

      {/* Capa de precarga: mismo `sizes` que la figura visible para que compartan
          entrada de caché de /_next/image. No usa display:none — con eso algunos
          navegadores no llegan a descargar. */}
      <div aria-hidden className={s.precarga}>
        {imagenes.map(im => (
          <Image
            key={im.src}
            src={im.src}
            alt=""
            width={im.w}
            height={im.h}
            sizes="(max-width: 700px) 100vw, 520px"
            loading="eager"
          />
        ))}
      </div>

      <div
        className={s.escena}
        style={{ '--salida-ms': `${SALIDA_MS}ms` } as React.CSSProperties}
      >
        <div
          key={`${tanda.id}-${fase.id}-${preguntaIdx}`}
          data-dir={dir}
          className={`${s.bloque} ${saliendo ? s.bloqueSaliendo : ''}`}
        >
          <article className={s.tarjeta}>
            <div className={s.numeroBox}>
              <span className={s.numeroLabel}>Pregunta</span>
              <span className={s.numero}>{String(preguntaIdx + 1).padStart(2, '0')}</span>
              <div className={s.numeroFilete} />
              <span className={s.numeroPie}>
                {respondidasFase}/{totalFase} respondidas
              </span>
            </div>

            <div className={s.contenido}>
              <div className={s.chips}>
                {[...(tema.etiquetas ?? []), ...(pregunta.etiquetas ?? [])].map((e, i) => (
                  <span key={e} className={`${s.chip} ${i === 0 ? s.chipPrincipal : ''}`}>
                    {e}
                  </span>
                ))}
              </div>

              <h1 className={s.enunciado}>{pregunta.enunciado}</h1>

              {pregunta.imagen && (
                <figure className={s.figura}>
                  <Image
                    src={pregunta.imagen.src}
                    alt={pregunta.imagen.alt}
                    width={pregunta.imagen.w}
                    height={pregunta.imagen.h}
                    sizes="(max-width: 700px) 100vw, 520px"
                    className={s.figuraImg}
                  />
                </figure>
              )}

              {!respuesta && (
                <p className={s.ayuda}>Selecciona una alternativa para ver la explicación.</p>
              )}
            </div>
          </article>

          <div className={s.opciones}>
            {opciones.map((o, i) => {
              const elegida = respuesta?.opcionId === o.id;
              const revelar = !!respuesta;
              const esCorrecta = o.correcta === true;
              const clase = !revelar
                ? ''
                : esCorrecta
                  ? s.opcionCorrecta
                  : elegida
                    ? s.opcionFallada
                    : s.opcionApagada;

              return (
                <label
                  key={o.id}
                  className={`${s.opcion} ${clase}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <input
                    type="radio"
                    name={`banco-${pregunta.id}`}
                    value={o.id}
                    checked={elegida}
                    disabled={revelar}
                    onChange={() => responder(o)}
                  />
                  <span className={s.opcionLetra}>{LETRAS[i]}</span>
                  <span className={s.opcionTexto}>{o.texto}</span>
                  <span className={s.opcionMarca} aria-hidden>
                    {revelar ? (esCorrecta ? '✓' : elegida ? '✕' : '') : ''}
                  </span>
                </label>
              );
            })}
          </div>

          {respuesta && (
            <section className={s.explicacion}>
              <p className={s.explicacionLabel}>
                <span className={respuesta.ok ? s.veredictoOk : s.veredictoMal}>
                  {respuesta.ok ? 'Correcto' : 'Incorrecto'}
                </span>
                Explicación
              </p>
              <div className={s.explicacionCuerpo}>
                <ReactMarkdown>{pregunta.explicacion}</ReactMarkdown>
              </div>
              {pregunta.matiz && (
                <p className={s.matiz}>
                  <strong>Matiz:</strong> {pregunta.matiz}
                </p>
              )}
            </section>
          )}
        </div>
      </div>

      <nav className={s.navegacion}>
        <button
          type="button"
          className={s.btnAnterior}
          onClick={anterior}
          disabled={preguntaIdx === 0}
        >
          ← <span>Anterior</span>
        </button>

        <div className={s.puntos} aria-hidden>
          {fase.preguntas.map((q: BancoPregunta, i) => {
            const r = respuestas[q.id];
            return (
              <span
                key={q.id}
                className={`${s.punto} ${i === preguntaIdx ? s.puntoActivo : ''} ${
                  r ? (r.ok ? s.puntoOk : s.puntoMal) : ''
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          className={s.btnSiguiente}
          onClick={siguiente}
          disabled={!respuesta}
        >
          <span>
            {preguntaIdx + 1 < totalFase
              ? 'Siguiente'
              : esUltimaFase
                ? 'Ver resultado'
                : `Terminar ${fase.label.toLowerCase()}`}
          </span>{' '}
          →
        </button>
      </nav>
    </div>
  );
}
