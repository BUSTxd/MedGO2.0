'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { fetchExam, type ExamOption, type ExamQuestion, type Flashcard, type Muestra } from '@/lib/examen/payload';
import { dorsoDe, esCorrecta, flashcardsDe, prepararRonda } from '@/lib/tarjetas/motor';
import { shuffle } from '@/lib/utils/shuffle';
import { cursoDe, desglosarIntento, registrarIntento } from '@/lib/temas-flojos';
import { trackEvent } from '@/lib/analytics';
import Tarjeta, { type Fase } from './Tarjeta';
import { paloDe, type Palo } from './Palos';
import s from '@/styles/tarjetas.module.css';

/** Duraciones espejo de las del CSS. Si cambian allí, cambian aquí. */
const SALIDA_MS = 260;
const ENTRADA_MS = 620;
/** Lo que se tarda en voltear tras responder: da tiempo a leer el color. */
const VOLTEO_MS = 480;

const LETRAS = 'ABCDE';

/**
 * Cuánto se abre el abanico entre un naipe y el siguiente. Más de esto y el
 * texto de los naipes de los extremos queda demasiado torcido para leerlo.
 */
const PASO_ABANICO = 6;

type Modo = 'flash' | 'quiz';
type Paso = 'cargando' | 'error' | 'portada' | 'jugando' | 'resultado';

interface Respuesta { q: string; ok: boolean }

const IconoFlash = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 4h12a2 2 0 0 1 2 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const IconoQuiz = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1" fill="currentColor" />
  </svg>
);

const IconoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * La esquina de una carta: la letra y, debajo, su palo. Va dos veces —arriba a
 * la izquierda y abajo a la derecha del revés—, como en una baraja de verdad.
 */
const Indice = ({ letra, palo, pie = false }: { letra: string; palo: Palo; pie?: boolean }) => (
  <span className={`${s.naipeEsquina} ${pie ? s.naipeEsquinaPie : ''}`} aria-hidden={pie || undefined}>
    <span className={s.naipeLetra}>{letra}</span>
    <span className={s.naipePalo}><palo.Glifo /></span>
  </span>
);

/** «12 tarjetas» o, en muestra, «10 de 32 tarjetas». */
function cuenta(n: number, deTotal: number | undefined, uno: string, varios: string) {
  const de = deTotal !== undefined && deTotal > n ? ` de ${deTotal}` : '';
  return `${n}${de} ${(deTotal ?? n) === 1 ? uno : varios}`;
}

interface Props {
  examKey: string;
  titulo: string;
  backHref: string;
}

/**
 * Banqueo de repaso para clases magistrales y TBL. Dos modos sobre los MISMOS
 * datos: tarjeta de memoria (pregunta delante, respuesta detrás) y quiz de
 * alternativas. La corrección está en `motor.ts` y no se repite aquí.
 *
 * La tarjeta no se remonta entre preguntas: los naipes llevan `key` de
 * **posición**, así el nodo de cada hueco sobrevive y sólo le cambia el texto.
 */
export default function TarjetasRunner({ examKey, titulo, backHref }: Props) {
  const [paso, setPaso] = useState<Paso>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<ExamQuestion[]>([]);
  const [tarjetas, setTarjetas] = useState<Flashcard[]>([]);
  const [opciones, setOpciones] = useState<Record<string, ExamOption[]>>({});
  const [muestra, setMuestra] = useState<Muestra | null>(null);
  const [tituloBanco, setTituloBanco] = useState(titulo);

  const [modo, setModo] = useState<Modo>('quiz');
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState<Fase>('quieto');
  const [elegida, setElegida] = useState<string | null>(null);
  const [volteada, setVolteada] = useState(false);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [ronda, setRonda] = useState(0);
  const [reduce, setReduce] = useState(false);

  const timers = useRef<number[]>([]);

  const limpiarTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  const programar = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => () => limpiarTimers(), []);

  // El movimiento aquí no es adorno: el avance espera a que la tarjeta salga.
  // Sin animación no hay nada que esperar, y el cambio es inmediato.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let vivo = true;
    fetchExam(examKey)
      .then(({ payload, muestra: m }) => {
        if (!vivo) return;
        const { orden, opciones: ops } = prepararRonda(payload.questions);
        setPreguntas(orden);
        setTarjetas(shuffle(flashcardsDe(payload)));
        setOpciones(ops);
        setMuestra(m ?? null);
        setTituloBanco(payload.title || titulo);
        setPaso('portada');
      })
      .catch((e: Error) => {
        if (!vivo) return;
        setError(e.message);
        setPaso('error');
      });
    return () => { vivo = false; };
  }, [examKey, titulo]);

  // Cada modo recorre su propia baraja: el quiz, las preguntas; la memoria, las
  // tarjetas (que pueden no tener nada que ver con las preguntas).
  const lista: { id: string }[] = modo === 'flash' ? tarjetas : preguntas;
  const pregunta = modo === 'quiz' ? preguntas[idx] : undefined;
  const tarjeta = modo === 'flash' ? tarjetas[idx] : undefined;
  const total = lista.length;
  const aciertos = respuestas.filter(r => r.ok).length;
  const dorso = useMemo(() => (pregunta ? dorsoDe(pregunta) : null), [pregunta]);
  const naipes = pregunta ? (opciones[pregunta.id] ?? pregunta.options) : [];
  const paloFlash = paloDe(idx);
  const respondida = modo === 'quiz' ? elegida !== null : volteada;

  const empezar = (m: Modo) => {
    setModo(m);
    setPaso('jugando');
    setFase('entrando');
    programar(() => setFase('quieto'), ENTRADA_MS);
    trackEvent('banco_iniciado', { claseId: examKey, examKey });
  };

  const terminar = useCallback((finales: Respuesta[]) => {
    // Sólo el quiz alimenta el acumulado de temas flojos: el flashcard es
    // autoevaluación, y mezclar lo que uno cree saber con lo que ha demostrado
    // saber corrompería las recomendaciones del home.
    if (modo === 'quiz') {
      const curso = cursoDe(examKey);
      registrarIntento(curso, desglosarIntento(curso, finales, preguntas));
    }
    trackEvent('examen_completado', {
      examKey,
      score: finales.filter(r => r.ok).length,
      total: finales.length,
    });
    setPaso('resultado');
  }, [examKey, modo, preguntas]);

  /** Saca la tarjeta, cambia lo que muestra y la vuelve a meter. Mismo nodo. */
  const avanzar = useCallback((finales: Respuesta[]) => {
    if (fase !== 'quieto') return;
    // Si se avanza antes de que la tarjeta llegue a voltearse, ese temporizador
    // sigue vivo y volvería a poner `volteada` DESPUÉS del cambio de pregunta:
    // la siguiente saldría ya volteada al primer clic, sin color ni sacudida.
    limpiarTimers();

    const cambiar = () => {
      if (idx + 1 >= total) { terminar(finales); return; }
      setIdx(i => i + 1);
      setElegida(null);
      setVolteada(false);
      setFase('entrando');
      programar(() => setFase('quieto'), ENTRADA_MS);
    };

    if (reduce) { cambiar(); return; }
    setFase('saliendo');
    programar(cambiar, SALIDA_MS);
  }, [fase, idx, reduce, terminar, total]);

  const responderQuiz = (opcionId: string) => {
    if (elegida || fase !== 'quieto' || !pregunta) return;
    setElegida(opcionId);
    const ok = esCorrecta(pregunta, opcionId);
    setRespuestas(prev => [...prev, { q: pregunta.id, ok }]);
    // Primero el color y la sacudida; el volteo después, ya leído el veredicto.
    if (reduce) setVolteada(true);
    else programar(() => setVolteada(true), VOLTEO_MS);
  };

  const autoevaluar = (ok: boolean) => {
    if (!tarjeta) return;
    const finales = [...respuestas, { q: tarjeta.id, ok }];
    setRespuestas(finales);
    avanzar(finales);
  };

  const siguiente = () => avanzar(respuestas);

  const reiniciar = () => {
    limpiarTimers();
    const { orden, opciones: ops } = prepararRonda(preguntas);
    setPreguntas(orden);
    setTarjetas(t => shuffle(t));
    setOpciones(ops);
    setIdx(0);
    setElegida(null);
    setVolteada(false);
    setRespuestas([]);
    setRonda(r => r + 1);
    setPaso('jugando');
    setFase('entrando');
    programar(() => setFase('quieto'), ENTRADA_MS);
  };

  // Atajos: A–E eligen, espacio voltea la tarjeta de memoria, Enter avanza.
  useEffect(() => {
    if (paso !== 'jugando') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Enter' && respondida) { e.preventDefault(); siguiente(); return; }
      if (modo === 'flash') {
        if (e.key === ' ' && !volteada) { e.preventDefault(); setVolteada(true); }
        return;
      }
      const i = LETRAS.indexOf(e.key.toUpperCase());
      if (i >= 0 && i < naipes.length && !elegida) {
        e.preventDefault();
        responderQuiz(naipes[i].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (paso === 'cargando') return <div className={s.shell}><p className={s.aviso}>Cargando…</p></div>;

  if (paso === 'error') {
    return (
      <div className={s.shell}>
        <p className={s.aviso}>{error}</p>
        <div className={s.pie}><Link href={backHref} className={s.secundario}>Volver a la clase</Link></div>
      </div>
    );
  }

  const cabecera = (
    <div className={s.barra}>
      <Link href={backHref} className={s.volver}>← Volver a la clase</Link>
      <span className={s.barraTitulo}>{tituloBanco}</span>
      {paso === 'jugando' && <span className={s.contador}>{idx + 1} / {total}</span>}
    </div>
  );

  if (paso === 'portada') {
    return (
      <div className={s.shell}>
        {cabecera}
        <div className={s.portada}>
          <p className={s.portadaKicker}>Banqueo</p>
          <h1 className={s.portadaTitulo}>{tituloBanco}</h1>
          <p className={s.portadaSub}>
            {muestra && 'Estás viendo una muestra: el resto entra con la suscripción. '}
            Elige cómo repasar.
          </p>
          <div className={s.modos}>
            {tarjetas.length > 0 && (
              <button type="button" className={s.modo} onClick={() => empezar('flash')}>
                <span className={s.modoIcono}><IconoFlash /></span>
                <span className={s.modoTitulo}>Tarjetas</span>
                <span className={s.modoDesc}>
                  Pregunta delante, respuesta detrás. Para no olvidar lo de siempre, rápido.
                </span>
                <span className={s.modoCuenta}>
                  {cuenta(tarjetas.length, muestra?.flashTotal, 'tarjeta', 'tarjetas')}
                </span>
              </button>
            )}
            <button type="button" className={s.modo} onClick={() => empezar('quiz')}>
              <span className={s.modoIcono}><IconoQuiz /></span>
              <span className={s.modoTitulo}>Quiz</span>
              <span className={s.modoDesc}>
                Eliges alternativa y la tarjeta se voltea con la respuesta y el porqué.
              </span>
              <span className={s.modoCuenta}>
                {cuenta(preguntas.length, muestra?.total, 'pregunta', 'preguntas')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paso === 'resultado') {
    return (
      <div className={s.shell}>
        {cabecera}
        <div className={s.resultado}>
          <p className={s.resultadoCifra}>{aciertos}/{respuestas.length}</p>
          <p className={s.resultadoLabel}>
            {modo === 'quiz' ? 'respuestas correctas' : 'tarjetas que ya te sabías'}
          </p>
          <div className={s.resultadoAcciones}>
            <button type="button" className={s.siguiente} onClick={reiniciar}>Repasar otra vez</button>
            <Link href={backHref} className={s.secundario}>Volver a la clase</Link>
          </div>
        </div>
        {muestra && (
          <div className={s.pared}>
            <p className={s.paredTitulo}>
              Has visto {total} de {modo === 'flash' ? (muestra.flashTotal ?? total) : muestra.total}
            </p>
            <p className={s.paredTexto}>
              El resto del banqueo de esta clase entra con la suscripción, junto al resumen
              y al resto del curso.
            </p>
            <a href="/#precios" className={s.siguiente}>Ver los planes</a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={s.shell}>
      {cabecera}
      <div className={s.rastro} aria-hidden="true">
        {lista.map((q, i) => {
          const r = respuestas.find(x => x.q === q.id);
          const cls = i === idx ? s.segActual : r ? (r.ok ? s.segOk : s.segMal) : '';
          return <span key={q.id} className={`${s.seg} ${cls}`} />;
        })}
      </div>

      {modo === 'quiz' ? (
        <>
          <div className={`${s.pista} ${fase === 'entrando' ? s.pistaEntra : fase === 'saliendo' ? s.pistaSale : ''}`}>
            <p className={s.pistaNum}>Pregunta {idx + 1}</p>
            <p className={s.pistaTexto}>{pregunta?.stem}</p>
          </div>

          <div className={s.abanico}>
            {naipes.map((op, i) => {
              const esElegida = elegida === op.id;
              const ok = pregunta ? esCorrecta(pregunta, op.id) : false;
              // Simétrico respecto al centro de la mano: el del medio recto y
              // los de los extremos abiertos hacia fuera.
              const angulo = (i - (naipes.length - 1) / 2) * PASO_ABANICO;
              const palo = paloDe(i);
              const letra = LETRAS[i] ?? String(i + 1);
              return (
                <Tarjeta
                  /* `key` de POSICIÓN, no del id de la opción: es lo que hace
                     que el nodo de cada hueco sobreviva a la pregunta y no
                     haya que reconstruir cinco tarjetas en cada avance. */
                  key={i}
                  className={`${s.naipe} ${esElegida ? s.naipeElegido : ''}`}
                  fase={fase}
                  dir={1}
                  indice={i}
                  inclinacion={angulo}
                  tinte={palo.color}
                  volteada={esElegida && volteada}
                  estado={esElegida ? (ok ? 'ok' : 'mal') : null}
                  atenuada={elegida !== null && !esElegida}
                  disabled={elegida !== null}
                  onClick={() => responderQuiz(op.id)}
                  etiqueta={`Alternativa ${letra}, ${palo.nombre}`}
                  frente={
                    <>
                      <Indice letra={letra} palo={palo} />
                      <span className={s.naipeAgua} aria-hidden="true"><palo.Glifo /></span>
                      <span className={s.naipeTexto}>{op.text}</span>
                      <Indice letra={letra} palo={palo} pie />
                    </>
                  }
                  dorso={esElegida && (
                    <>
                      <span className={`${s.dorsoEtiqueta} ${ok ? s.dorsoOk : s.dorsoMal}`}>
                        <span className={s.marcaLate} aria-hidden="true">
                          {ok ? <IconoCheck /> : '✕'}
                        </span>
                        <span>{ok ? 'Correcta' : 'Incorrecta'}</span>
                      </span>
                      <span className={s.dorsoRespuesta}>{dorso?.respuesta}</span>
                      {dorso?.justificacion && (
                        <div className={s.dorsoJustificacion}>
                          <ReactMarkdown>{dorso.justificacion}</ReactMarkdown>
                        </div>
                      )}
                    </>
                  )}
                />
              );
            })}
          </div>

          {respondida && (
            <div className={s.pie}>
              <button type="button" className={s.siguiente} onClick={siguiente}>
                {idx + 1 >= total ? 'Ver resultado' : 'Siguiente'} →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={s.flashWrap}>
          <Tarjeta
            key="flash"
            className={s.flash}
            fase={fase}
            dir={1}
            /* Un palo distinto por tarjeta, para que se note que cambió. */
            tinte={paloFlash.color}
            volteada={volteada}
            onClick={volteada ? undefined : () => setVolteada(true)}
            etiqueta="Voltear la tarjeta"
            frente={
              <>
                <span className={s.naipeAgua} aria-hidden="true"><paloFlash.Glifo /></span>
                <span className={s.flashPregunta}>{tarjeta?.frente}</span>
                <span className={s.flashPista}>Toca la tarjeta para ver la respuesta</span>
              </>
            }
            dorso={
              <>
                <span className={s.flashRespuesta}>{tarjeta?.respuesta}</span>
                {tarjeta?.detalle && (
                  <div className={s.dorsoJustificacion}>
                    <ReactMarkdown>{tarjeta.detalle}</ReactMarkdown>
                  </div>
                )}
              </>
            }
          />

          {volteada && (
            <div className={s.autoeval} key={`autoeval-${ronda}-${idx}`}>
              <button type="button" className={`${s.autoevalBtn} ${s.autoevalNo}`} onClick={() => autoevaluar(false)}>
                No me la sabía
              </button>
              <button type="button" className={`${s.autoevalBtn} ${s.autoevalSi}`} onClick={() => autoevaluar(true)}>
                Me la sabía
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
