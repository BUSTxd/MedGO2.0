'use client';
/**
 * Reconocimiento de morfologías eritrocitarias.
 *
 * Panel izquierdo: una microfotografía a la vez (recorte de la lámina, sin su
 * rótulo) y un campo donde el alumno escribe el nombre. Panel derecho: la
 * lámina de referencia etiquetada, de consulta libre mientras responde.
 *
 * El fallo NO revela la respuesta — se puede reintentar cuantas veces haga
 * falta; «Ver respuesta» está para rendirse a propósito, y lo que se rinde no
 * suma acierto.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  MORFOLOGIAS,
  FICHAS_SIN_FOTO,
  ESQUEMA_ESTUDIO,
  GUIA_IMG,
  RUTA_IMG,
  evaluar,
} from '@/lib/data/morfologia-gr';
import { shuffle } from '@/lib/utils/shuffle';
import FichaMorfologia from './FichaMorfologia';
import s from '@/styles/morfologiaGr.module.css';

/** Cómo quedó resuelta una lámina. `null` = todavía sin resolver. */
type Resultado = 'acierto' | 'revelado';
/** Respuesta al último envío, para el aviso bajo el campo. */
type Aviso = null | 'fallo' | 'casi' | 'vacio';

const TOTAL = MORFOLOGIAS.length;

export default function MorfologiaQuiz() {
  // El barajado no puede ocurrir en el render inicial: este componente también
  // se renderiza en el servidor y un orden aleatorio distinto en cliente
  // rompería la hidratación. Se baraja al montar.
  const [orden, setOrden] = useState<number[]>(() => MORFOLOGIAS.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [texto, setTexto] = useState('');
  const [aviso, setAviso] = useState<Aviso>(null);
  const [resueltas, setResueltas] = useState<Record<string, Resultado>>({});
  const [fallos, setFallos] = useState(0);
  const [guiaAbierta, setGuiaAbierta] = useState(false);
  const [guiaZoom, setGuiaZoom] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setOrden(shuffle(MORFOLOGIAS.map((_, i) => i))), []);

  const actual = MORFOLOGIAS[orden[pos]];
  const resultado = resueltas[actual.id] ?? null;
  const aciertos = useMemo(
    () => Object.values(resueltas).filter((r) => r === 'acierto').length,
    [resueltas],
  );

  const ir = useCallback((delta: number) => {
    setPos((p) => (p + delta + TOTAL) % TOTAL);
    setTexto('');
    setAviso(null);
  }, []);

  const barajar = useCallback(() => {
    setOrden(shuffle(MORFOLOGIAS.map((_, i) => i)));
    setPos(0);
    setTexto('');
    setAviso(null);
  }, []);

  const comprobar = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (resultado) return;
      if (!texto.trim()) {
        setAviso('vacio');
        return;
      }
      const veredicto = evaluar(texto, actual);
      if (veredicto === 'correcto') {
        setResueltas((r) => ({ ...r, [actual.id]: 'acierto' }));
        setAviso(null);
        return;
      }
      // «casi» = se parece a la correcta, pero también a otra morfología
      // distinta (macrocito/microcito). No se da por buena ni se dice cuál es.
      setAviso(veredicto === 'casi' ? 'casi' : 'fallo');
      setFallos((f) => f + 1);
    },
    [actual, resultado, texto],
  );

  const rendirse = useCallback(() => {
    setResueltas((r) => ({ ...r, [actual.id]: 'revelado' }));
    setAviso(null);
  }, [actual]);

  const reiniciar = useCallback(() => {
    setResueltas({});
    setFallos(0);
    barajar();
  }, [barajar]);

  // Foco en el campo al cambiar de lámina, para poder escribir sin usar el ratón.
  useEffect(() => {
    if (!resultado) inputRef.current?.focus();
  }, [pos, resultado]);

  // Esc cierra la guía. Al cerrarla se suelta también el zoom, para que la
  // próxima vez se abra encajada en el panel y no a medio scroll.
  useEffect(() => {
    if (!guiaAbierta) {
      setGuiaZoom(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuiaAbierta(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [guiaAbierta]);

  return (
    <div className={s.cuaderno}>
      {/* ─────────────── Columna del ejercicio ─────────────── */}
      <section className={s.quizCol}>
        <header className={s.marcador}>
          <span className={s.marcadorLamina}>
            Lámina <strong>{pos + 1}</strong> de {TOTAL}
          </span>
          <span className={s.marcadorCifras}>
            <span className={s.mAcierto}>{aciertos} acertadas</span>
            <span className={s.mFallo}>{fallos} intentos fallidos</span>
          </span>
          <span className={s.marcadorBotones}>
            <button type="button" className={s.btnGhost} onClick={barajar}>
              Barajar
            </button>
            <button type="button" className={s.btnGhost} onClick={reiniciar}>
              Reiniciar
            </button>
          </span>
        </header>

        <div className={s.visor}>
          <button
            type="button"
            className={s.navBtn}
            onClick={() => ir(-1)}
            aria-label="Lámina anterior"
          >
            ‹
          </button>

          <figure className={s.porta}>
            <Image
              src={`${RUTA_IMG}/${actual.id}.webp`}
              alt={
                resultado
                  ? `Microfotografía: ${actual.nombre}`
                  : 'Microfotografía de un eritrocito por identificar'
              }
              width={420}
              height={420}
              sizes="(max-width: 700px) 90vw, 380px"
              className={s.portaImg}
              priority={pos === 0}
            />
            <figcaption className={s.portaPie}>
              {resultado ? actual.nombre : 'Frotis de sangre periférica · tinción de Wright'}
            </figcaption>
          </figure>

          <button
            type="button"
            className={s.navBtn}
            onClick={() => ir(1)}
            aria-label="Lámina siguiente"
          >
            ›
          </button>
        </div>

        {/* ── Campo de respuesta ── */}
        {!resultado ? (
          <form className={s.respuesta} onSubmit={comprobar}>
            <label className={s.respuestaLabel} htmlFor="respuesta-morfologia">
              ¿Qué morfología es?
            </label>
            <div className={s.respuestaFila}>
              <input
                id="respuesta-morfologia"
                ref={inputRef}
                className={s.input}
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value);
                  setAviso(null);
                }}
                placeholder="Escribe el nombre…"
                autoComplete="off"
                spellCheck={false}
              />
              <button type="submit" className={s.btn}>
                Comprobar
              </button>
            </div>

            <div className={s.avisoZona} aria-live="polite">
              {aviso === 'fallo' && (
                <p className={s.avisoMal}>
                  No es esa. Fíjate otra vez en la forma, el color y lo que hay dentro
                  de la célula, y vuelve a intentarlo.
                </p>
              )}
              {aviso === 'casi' && (
                <p className={s.avisoCasi}>
                  Casi. Lo que escribiste se parece a dos morfologías distintas — afina
                  el nombre.
                </p>
              )}
              {aviso === 'vacio' && (
                <p className={s.avisoMal}>Escribe un nombre antes de comprobar.</p>
              )}
            </div>

            {aviso && aviso !== 'vacio' && (
              <button type="button" className={s.btnRendirse} onClick={rendirse}>
                Ver respuesta
              </button>
            )}
          </form>
        ) : (
          <div className={s.resuelto}>
            <p className={resultado === 'acierto' ? s.selloOk : s.selloRevelado}>
              {resultado === 'acierto' ? 'Correcto' : 'Respuesta revelada'}
              <strong>{actual.nombre}</strong>
            </p>

            {actual.ficha ? (
              <FichaMorfologia nombre={actual.nombre} clase={actual.clase} ficha={actual.ficha} />
            ) : (
              /* Las 6 morfologías de la lámina que el material no desarrolla.
                 Se dice tal cual en vez de rellenar con datos de otra fuente. */
              <div className={s.sinFicha}>
                <p className={s.sinFichaTitulo}>Sin ficha en el material de referencia</p>
                <p className={s.sinFichaTexto}>
                  El nombre es correcto, pero el documento de alteraciones e inclusiones
                  eritrocitarias no desarrolla esta morfología, así que aquí no hay
                  explicación que mostrar. Consúltala en la lámina de referencia de la
                  derecha.
                </p>
              </div>
            )}

            <button type="button" className={s.btn} onClick={() => ir(1)}>
              Siguiente lámina
            </button>
          </div>
        )}

        {/* ── Material del documento que no tiene microfotografía ── */}
        <details className={s.extras}>
          <summary className={s.extrasSummary}>
            Dos fichas más del material, sin foto en la lámina
          </summary>
          <p className={s.extrasNota}>
            El documento explica también estas dos, que no aparecen entre las 19
            microfotografías. Están fuera del ejercicio; se incluyen para no perder
            contenido del material.
          </p>
          {FICHAS_SIN_FOTO.map((f) => (
            <FichaMorfologia key={f.nombre} nombre={f.nombre} clase={f.clase} ficha={f.ficha} />
          ))}
          <p className={s.esquema}>{ESQUEMA_ESTUDIO}</p>
        </details>
      </section>

      {/* ─────────────── Guía de referencia ───────────────
          Viñeta pegada al borde derecho: abre y cierra el panel. Vive fuera
          del flujo del ejercicio para que no le robe ancho a la lámina. */}
      <button
        type="button"
        className={`${s.pestana} ${guiaAbierta ? s.pestanaAbierta : ''}`}
        onClick={() => setGuiaAbierta((v) => !v)}
        aria-expanded={guiaAbierta}
        aria-controls="guia-referencia"
      >
        <span className={s.pestanaTexto}>Guía</span>
      </button>

      {/* El panel se monta siempre: si apareciera y desapareciera del DOM no
          habría transición de salida al cerrarlo. */}
      <div
        className={`${s.velo} ${guiaAbierta ? s.veloOn : ''}`}
        onClick={() => setGuiaAbierta(false)}
        aria-hidden
      />
      <aside
        id="guia-referencia"
        className={`${s.drawer} ${guiaAbierta ? s.drawerOn : ''}`}
        aria-label="Guía de referencia de morfologías"
        aria-hidden={!guiaAbierta}
      >
        <div className={s.drawerScroll}>
          {/* Solo la imagen. Un clic alterna entre encajarla en el panel y
              verla a tamaño natural, para leer los rótulos pequeños. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GUIA_IMG}
            alt="Lámina de referencia con las 19 morfologías eritrocitarias etiquetadas"
            className={guiaZoom ? s.drawerImgZoom : s.drawerImg}
            onClick={() => setGuiaZoom((z) => !z)}
          />
        </div>
      </aside>
    </div>
  );
}
