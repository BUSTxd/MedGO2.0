'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchExam, type ExamOption, type ExamQuestion, type Flashcard, type Muestra } from '@/lib/examen/payload';
import { dorsoDe, esCorrecta, flashcardsDe, prepararRonda } from '@/lib/tarjetas/motor';
import { shuffle } from '@/lib/utils/shuffle';
import { cursoDe, desglosarIntento, registrarIntento } from '@/lib/temas-flojos';
import { trackEvent } from '@/lib/analytics';
import { partirEnBarajas, type BarajaDe } from '@/lib/barajas';
import RejillaBarajas from '@/components/examen/RejillaBarajas';
import Tarjeta, { type Fase } from './Tarjeta';
import ValoracionPregunta from './ValoracionPregunta';
import type { Valoracion } from '@/lib/valoraciones';
import { paloDe, type Palo } from './Palos';
import s from '@/styles/tarjetas.module.css';

// El visor sólo baja si alguien abre el resumen desde una tarjeta.
const HtmlFullscreenModal = dynamic(() => import('@/components/HtmlFullscreenModal'), { ssr: false });

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
type Paso = 'cargando' | 'error' | 'portada' | 'barajas' | 'jugando' | 'resultado';

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

// Barajas grandes (el examen 3D de miembro superior, 420) se parten en barajas
// fijas (`partirEnBarajas`), de lo que salió en los exámenes reales a lo menos
// probable. Cada una recuerda su último resultado en este navegador, por firma.
interface ResultadoBaraja { sabidas: number; total: number; fecha: string; veces: number }
const claveBarajas = (examKey: string) => `medgo:tarjetas-barajas:${examKey}`;

function leerBarajas(examKey: string): Record<string, ResultadoBaraja> {
  try {
    const r = JSON.parse(localStorage.getItem(claveBarajas(examKey)) ?? '{}') as Record<string, ResultadoBaraja> | null;
    return r && typeof r === 'object' ? r : {};
  } catch {
    return {};
  }
}

function guardarBaraja(examKey: string, firma: string, sabidas: number, total: number): Record<string, ResultadoBaraja> {
  const todas = leerBarajas(examKey);
  const nuevo = { ...todas, [firma]: { sabidas, total, fecha: new Date().toISOString(), veces: (todas[firma]?.veces ?? 0) + 1 } };
  try {
    localStorage.setItem(claveBarajas(examKey), JSON.stringify(nuevo));
  } catch { /* sin almacenamiento la baraja se juega igual, sólo que sin cheque */ }
  return nuevo;
}

/** «12 tarjetas» o, en muestra, «10 de 32 tarjetas». */
function cuenta(n: number, deTotal: number | undefined, uno: string, varios: string) {
  const de = deTotal !== undefined && deTotal > n ? ` de ${deTotal}` : '';
  return `${n}${de} ${(deTotal ?? n) === 1 ? uno : varios}`;
}

interface Props {
  examKey: string;
  titulo: string;
  backHref: string;
  /** Resumen HTML de la clase; `abierto` = el usuario puede leerlo. */
  resumen?: { id: string; abierto: boolean };
  /**
   * Para tarjetas que traen su propio `resumen` (una baraja que cruza varias
   * clases): id del resumen → si el usuario puede leerlo.
   */
  resumenes?: Record<string, boolean>;
  /**
   * Tamaño de baraja: la baraja grande se parte en barajas fijas de este tamaño,
   * de lo que salió a lo menos probable, con un panel para elegirlas y ver cuáles
   * faltan. Sin esto, la baraja entera.
   */
  barajas?: number;
}

const IconoLibro = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

/** Tres cartas apiladas: abre el panel de barajas. */
const IconoBarajas = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="7" y="3.5" width="12" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 7.5v11A2.5 2.5 0 0 0 7.5 21H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconoCandado = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Banqueo de repaso para clases magistrales y TBL. Dos modos sobre los MISMOS
 * datos: tarjeta de memoria (pregunta delante, respuesta detrás) y quiz de
 * alternativas. La corrección está en `motor.ts` y no se repite aquí.
 *
 * La tarjeta no se remonta entre preguntas: los naipes llevan `key` de
 * **posición**, así el nodo de cada hueco sobrevive y sólo le cambia el texto.
 */
export default function TarjetasRunner({ examKey, titulo, backHref, resumen, resumenes, barajas }: Props) {
  // Encima de la baraja, no navegando a la clase: así no se pierde el avance.
  const [leyendo, setLeyendo] = useState<{ id: string; seccion: string } | null>(null);
  const [paso, setPaso] = useState<Paso>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [preguntas, setPreguntas] = useState<ExamQuestion[]>([]);
  /** La baraja completa; `tarjetas` es la baraja en curso (la misma, sin `barajas`). */
  const [todas, setTodas] = useState<Flashcard[]>([]);
  /** Con `barajas`: la que se juega y el último resultado de cada una. */
  const [mazo, setMazo] = useState<BarajaDe<Flashcard> | null>(null);
  const [hechas, setHechas] = useState<Record<string, ResultadoBaraja>>({});
  const mazos = useMemo(() => (barajas ? partirEnBarajas(todas, barajas) : []), [todas, barajas]);
  /** La primera sin hacer a partir de `desde` (y si no, desde el principio). */
  const pendienteDesde = (desde: number) =>
    mazos.find(m => m.numero > desde && !hechas[m.firma]) ?? mazos.find(m => !hechas[m.firma]) ?? null;
  const [tarjetas, setTarjetas] = useState<Flashcard[]>([]);
  const [opciones, setOpciones] = useState<Record<string, ExamOption[]>>({});
  const [muestra, setMuestra] = useState<Muestra | null>(null);
  const [tituloBanco, setTituloBanco] = useState(titulo);

  const [modo, setModo] = useState<Modo>('quiz');
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState<Fase>('quieto');
  const [elegida, setElegida] = useState<string | null>(null);
  const [volteada, setVolteada] = useState(false);
  // En memoria la tarjeta va y viene: `vista` recuerda que ya se vio el dorso,
  // para no esconder la autoevaluación al volver a la pregunta.
  const [vista, setVista] = useState(false);
  // Un clic mientras la tarjeta entra no la voltea de golpe: se guarda y se
  // cumple al terminar la entrada, sin cortarla.
  const volteoPendiente = useRef(false);
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [reduce, setReduce] = useState(false);

  // Qué tal está armada cada pregunta, según el alumno. Sin valorarla no se avanza.
  const [valoraciones, setValoraciones] = useState<Record<string, Valoracion>>({});
  const [intentosSinValorar, setIntentosSinValorar] = useState(0);

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
        const baraja = flashcardsDe(payload);
        setTodas(baraja);
        if (barajas) {
          const av = leerBarajas(examKey);
          const ms = partirEnBarajas(baraja, barajas);
          const primera = ms.find(m => !av[m.firma]) ?? ms[0];
          setHechas(av);
          setMazo(primera ?? null);
          setTarjetas(primera ? shuffle(primera.items) : []);
        } else {
          setTarjetas(shuffle(baraja));
        }
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
  }, [examKey, titulo, barajas]);

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
  const respondida = modo === 'quiz' ? elegida !== null : vista;

  /** De qué parte del resumen sale lo que se acaba de ver. Fuera del naipe: el naipe ya es un <button>. */
  const enlaceResumen = (seccion?: string, propio?: string) => {
    // La tarjeta puede traer su resumen (baraja de varias clases); si no, el de la clase.
    const destino = propio ? { id: propio, abierto: resumenes?.[propio] ?? false } : resumen;
    if (!destino || !seccion) return null;
    if (!destino.abierto) {
      return (
        <span className={`${s.irResumen} ${s.irResumenCerrado}`}>
          <IconoCandado /> El resumen entra con la suscripción
        </span>
      );
    }
    return (
      <button
        type="button"
        className={s.irResumen}
        onClick={() => {
          setLeyendo({ id: destino.id, seccion });
          trackEvent('resumen_abierto', { claseId: destino.id, origen: modo === 'quiz' ? 'quiz' : 'tarjeta' });
        }}
      >
        <IconoLibro /> Ver esto en el resumen
      </button>
    );
  };

  const voltear = () => {
    if (fase === 'entrando') { volteoPendiente.current = true; return; }
    if (fase !== 'quieto') return;
    setVolteada(v => !v);
    setVista(true);
  };

  useEffect(() => {
    if (fase !== 'quieto' || !volteoPendiente.current) return;
    volteoPendiente.current = false;
    setVolteada(true);
    setVista(true);
  }, [fase]);

  const empezar = (m: Modo) => {
    setModo(m);
    setPaso('jugando');
    setFase('entrando');
    programar(() => setFase('quieto'), ENTRADA_MS);
    trackEvent('banco_iniciado', { claseId: examKey, examKey, modo: m === 'flash' ? 'tarjetas' : 'quiz' });
  };

  const terminar = useCallback((finales: Respuesta[]) => {
    // Sólo el quiz alimenta el acumulado de temas flojos: el flashcard es
    // autoevaluación, y mezclar lo que uno cree saber con lo que ha demostrado
    // saber corrompería las recomendaciones del home.
    if (modo === 'quiz') {
      const curso = cursoDe(examKey);
      registrarIntento(curso, desglosarIntento(curso, finales, preguntas));
    }
    if (modo === 'flash' && barajas && mazo) {
      setHechas(guardarBaraja(examKey, mazo.firma, finales.filter(r => r.ok).length, finales.length));
    }
    trackEvent('examen_completado', {
      examKey,
      modo: modo === 'flash' ? 'tarjetas' : 'quiz',
      ...(mazo && modo === 'flash' ? { baraja: mazo.numero } : {}),
      score: finales.filter(r => r.ok).length,
      total: finales.length,
    });
    setPaso('resultado');
  }, [examKey, modo, preguntas, barajas, mazo]);

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
      setVista(false);
      setIntentosSinValorar(0);
      volteoPendiente.current = false;
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

  const valorar = (v: Valoracion) => {
    if (!pregunta) return;
    setValoraciones(prev => ({ ...prev, [pregunta.id]: v }));
    setIntentosSinValorar(0);
    // Sin red no se le retiene: la marca ya está puesta y el envío se reintenta una vez.
    const cuerpo = JSON.stringify({ examKey, questionId: pregunta.id, rating: v });
    const enviar = () => fetch('/api/valoracion-pregunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo,
      keepalive: true,
    }).then(r => { if (!r.ok && r.status >= 500) throw new Error('reintenta'); });
    enviar().catch(() => window.setTimeout(() => { enviar().catch(() => {}); }, 2500));
  };

  const sinValorar = modo === 'quiz' && !!pregunta && !valoraciones[pregunta.id];

  const siguiente = () => {
    if (sinValorar) { setIntentosSinValorar(n => n + 1); return; }
    avanzar(respuestas);
  };

  /** `otra`: se juega esa baraja (en memoria) en vez de repetir la misma. */
  const reiniciar = (otra?: BarajaDe<Flashcard>) => {
    limpiarTimers();
    const { orden, opciones: ops } = prepararRonda(preguntas);
    setPreguntas(orden);
    if (otra) {
      setMazo(otra);
      setModo('flash');
      setTarjetas(shuffle(otra.items));
      trackEvent('banco_iniciado', { claseId: examKey, examKey, modo: 'tarjetas', baraja: otra.numero });
    } else {
      setTarjetas(t => shuffle(t));
    }
    setOpciones(ops);
    setIdx(0);
    setElegida(null);
    setVolteada(false);
    setVista(false);
    volteoPendiente.current = false;
    setRespuestas([]);
    setIntentosSinValorar(0);
    setPaso('jugando');
    setFase('entrando');
    programar(() => setFase('quieto'), ENTRADA_MS);
  };

  // Atajos: A–E eligen, espacio voltea la tarjeta de memoria, Enter avanza.
  useEffect(() => {
    // Con el resumen abierto, las teclas son del visor.
    if (paso !== 'jugando' || leyendo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // Enter sobre un color de la valoración lo elige el propio botón: no cuenta como «seguir».
      const enValoracion = e.target instanceof Element && !!e.target.closest('[data-valora]');
      if (e.key === 'Enter' && respondida && !enValoracion) { e.preventDefault(); siguiente(); return; }
      if (modo === 'quiz' && elegida && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        valorar((['rojo', 'amarillo', 'verde'] as const)[Number(e.key) - 1]);
        return;
      }
      if (modo === 'flash') {
        if (e.key === ' ') { e.preventDefault(); voltear(); }
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
      {paso === 'jugando' && <span className={s.contador}>{mazo && modo === 'flash' ? `Baraja ${mazo.numero} · ` : ''}{idx + 1} / {total}</span>}
      {mazos.length > 0 && paso !== 'barajas' && (
        <button type="button" className={`${s.verBarajas} ${paso === 'jugando' ? '' : s.verBarajasSolo}`} onClick={() => setPaso('barajas')}>
          <IconoBarajas /> Barajas <span className={s.verBarajasCuenta}>{mazos.filter(m => hechas[m.firma]).length}/{mazos.length}</span>
        </button>
      )}
    </div>
  );

  // Con `barajas`: el panel para elegir una y ver cuáles faltan.
  if (paso === 'barajas') {
    const hechasN = mazos.filter(m => hechas[m.firma]).length;
    const sugerida = pendienteDesde(0);
    return (
      <div className={s.shell}>
        {cabecera}
        <div className={s.panelBarajas}>
          <p className={s.portadaKicker}>Banqueo</p>
          <h1 className={s.portadaTitulo}>Barajas de {barajas}</h1>
          <p className={s.portadaSub}>
            La 1 es la más probable (lo que salió en 2025-A, 2025-B y 2024) y cada una lo es
            un poco menos que la anterior. Has hecho <strong>{hechasN} de {mazos.length}</strong>;
            toca una hecha para repetirla.
          </p>
          <RejillaBarajas
            items={mazos.map(m => {
              const r = hechas[m.firma];
              return { firma: m.firma, numero: m.numero, nivel: m.nivel, nota: r ? `${r.sabidas}/${r.total}` : null };
            })}
            sugerida={sugerida?.firma}
            pie={`${barajas} tarj.`}
            porNivel={false}
            onElegir={item => reiniciar(mazos.find(m => m.firma === item.firma))}
          />
          <div className={s.panelBarajasPie}>
            {sugerida && (
              <button type="button" className={s.siguiente} onClick={() => reiniciar(sugerida)}>
                {hechasN ? `Seguir con la baraja ${sugerida.numero}` : `Empezar la baraja ${sugerida.numero}`}
              </button>
            )}
            <button type="button" className={s.secundario} onClick={() => setPaso('portada')}>Volver</button>
          </div>
        </div>
      </div>
    );
  }

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
                  {mazo
                    ? `Baraja ${mazo.numero} · ${cuenta(tarjetas.length, undefined, 'tarjeta', 'tarjetas')}`
                    : cuenta(tarjetas.length, muestra?.flashTotal, 'tarjeta', 'tarjetas')}
                </span>
              </button>
            )}
            <button
              type="button"
              className={s.modo}
              onClick={() => empezar('quiz')}
              disabled={preguntas.length === 0}
            >
              <span className={s.modoIcono}><IconoQuiz /></span>
              <span className={s.modoTitulo}>Quiz</span>
              <span className={s.modoDesc}>
                Eliges alternativa y la tarjeta se voltea con la respuesta y el porqué.
              </span>
              <span className={s.modoCuenta}>
                {preguntas.length === 0
                  ? 'Próximamente'
                  : cuenta(preguntas.length, muestra?.total, 'pregunta', 'preguntas')}
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
            {modo === 'quiz' ? 'respuestas correctas' : mazo ? `tarjetas que ya te sabías · baraja ${mazo.numero}` : 'tarjetas que ya te sabías'}
          </p>
          <div className={s.resultadoAcciones}>
            {mazo && modo === 'flash' ? (
              <>
                {(() => {
                  const sig = pendienteDesde(mazo.numero);
                  return sig && <button type="button" className={s.siguiente} onClick={() => reiniciar(sig)}>Siguiente baraja ({sig.numero})</button>;
                })()}
                <button type="button" className={s.secundario} onClick={() => reiniciar()}>Repetir esta baraja</button>
                <button type="button" className={s.secundario} onClick={() => setPaso('barajas')}>Ver todas las barajas</button>
              </>
            ) : (
              <button type="button" className={s.siguiente} onClick={() => reiniciar()}>Repasar otra vez</button>
            )}
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
                      {/* Al fallar, el reverso enseña la buena: sin el rótulo,
                          leída bajo «Incorrecta» parecía que era la equivocada. */}
                      <span className={s.dorsoRespuesta}>
                        {!ok && <span className={s.dorsoCorrecta}>Correcta: </span>}
                        {dorso?.respuesta}
                      </span>
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

          {respondida && enlaceResumen(pregunta?.seccion)}

          {respondida && (
            <div className={`${s.pie} ${s.pieQuiz}`}>
              <ValoracionPregunta
                valor={pregunta ? (valoraciones[pregunta.id] ?? null) : null}
                onElegir={valorar}
                intentos={intentosSinValorar}
              />
              <button
                type="button"
                className={`${s.siguiente} ${sinValorar ? s.siguienteBloqueado : ''}`}
                aria-disabled={sinValorar}
                onClick={siguiente}
              >
                {idx + 1 >= total ? 'Ver resultado' : 'Siguiente'} →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className={s.flashWrap}>
          <div className={s.flashCentro}>
          <Tarjeta
            key="flash"
            className={s.flash}
            fase={fase}
            dir={1}
            /* Un palo distinto por tarjeta, para que se note que cambió. */
            tinte={paloFlash.color}
            volteada={volteada}
            onClick={voltear}
            etiqueta={volteada ? 'Volver a la pregunta' : 'Ver la respuesta'}
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
                <span className={s.flashPista}>Toca para volver a la pregunta</span>
              </>
            }
          />

          {/* Siempre montado y fuera del flujo: si apareciera al voltear y
              ocupara sitio, la columna centrada subiría la tarjeta en pleno giro. */}
          <div className={`${s.flashPie} ${vista ? s.flashPieVisible : ''}`}>
            {enlaceResumen(tarjeta?.seccion, tarjeta?.resumen)}

            <div className={s.autoeval}>
              <button type="button" className={`${s.autoevalBtn} ${s.autoevalNo}`} onClick={() => autoevaluar(false)}>
                No me la sabía
              </button>
              <button type="button" className={`${s.autoevalBtn} ${s.autoevalSi}`} onClick={() => autoevaluar(true)}>
                Me la sabía
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {leyendo && (
        <HtmlFullscreenModal
          claseId={leyendo.id}
          titulo={tituloBanco}
          seccion={leyendo.seccion}
          onClose={() => setLeyendo(null)}
        />
      )}
    </div>
  );
}
