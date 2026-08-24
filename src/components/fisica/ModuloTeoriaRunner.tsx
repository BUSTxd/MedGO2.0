'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { BloqueLogica, ModuloTeoria, Seccion } from '@/lib/data/fisica-modulos/types';
import Simulacion from './sims';
import IconoModulo from './IconoModulo';
import FormulaViva from './FormulaViva';
import ProblemaGuiado from './ProblemaGuiado';
import styles from '@/styles/moduloTeoria.module.css';

/* ───────────────────────────────────────────────────────────────────────────
   Recorrido del módulo.

   El orden es deliberado y NO se puede saltar hacia adelante: portada →
   (entender → simular → comprobar) × N → cierre. La simulación aparece
   DESPUÉS del razonamiento porque un alumno que llega a los sliders sin haber
   leído nada juega con ellos sin saber qué está mirando; y el chequeo va al
   final para que se responda con lo que se acaba de comprobar a mano.
   Hacia atrás sí se navega libre: repasar no rompe nada.
   ─────────────────────────────────────────────────────────────────────────── */

type Vista = { tipo: 'portada' } | { tipo: 'seccion'; i: number } | { tipo: 'cierre' };
type Fase = 'entender' | 'simular' | 'comprobar';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ModuloTeoriaRunner({
  modulo,
  volverHref,
}: {
  modulo: ModuloTeoria;
  volverHref: string;
}) {
  const [vista, setVista] = useState<Vista>({ tipo: 'portada' });
  const [fase, setFase] = useState<Fase>('entender');
  const [maxSeccion, setMaxSeccion] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const seccionActual: Seccion | null =
    vista.tipo === 'seccion' ? modulo.secciones[vista.i] : null;
  const acento = seccionActual?.acento ?? modulo.secciones[0].acento;

  // Cada cambio de fase o de sección reencuadra arriba: si no, se aterriza a
  // media simulación sin ver su cabecera y parece que la página no reaccionó.
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [vista, fase]);

  const irASeccion = (i: number) => {
    setVista({ tipo: 'seccion', i });
    setFase('entender');
    setMaxSeccion((m) => Math.max(m, i));
  };

  const avanzar = () => {
    if (vista.tipo !== 'seccion') return;
    if (fase === 'entender') { setFase('simular'); return; }
    if (fase === 'simular')  { setFase('comprobar'); return; }
    const siguiente = vista.i + 1;
    if (siguiente < modulo.secciones.length) irASeccion(siguiente);
    else setVista({ tipo: 'cierre' });
  };

  const retroceder = () => {
    if (vista.tipo !== 'seccion') return;
    if (fase === 'comprobar') { setFase('simular'); return; }
    if (fase === 'simular')   { setFase('entender'); return; }
    if (vista.i > 0) { setVista({ tipo: 'seccion', i: vista.i - 1 }); setFase('comprobar'); }
    else setVista({ tipo: 'portada' });
  };

  return (
    <div className={styles.wrapper} style={{ ['--acc' as string]: acento }}>
      <div className={styles.container}>
        <div ref={topRef} />

        <Link href={volverHref} className={styles.backLink}>
          ← Volver a la clase
        </Link>

        {vista.tipo !== 'portada' && (
          <nav className={styles.progressBar} aria-label="Secciones del módulo">
            {modulo.secciones.map((s, i) => {
              const activa = vista.tipo === 'seccion' && vista.i === i;
              const hecha = i < maxSeccion || vista.tipo === 'cierre';
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={i > maxSeccion}
                  onClick={() => irASeccion(i)}
                  style={{ ['--sc' as string]: s.acento }}
                  className={`${styles.progressStep} ${activa ? styles.progressStepActive : ''} ${
                    hecha && !activa ? styles.progressStepDone : ''
                  }`}
                >
                  <span className={styles.progressDot}>{hecha && !activa ? '✓' : i + 1}</span>
                  {s.titulo}
                </button>
              );
            })}
            <button
              type="button"
              disabled={maxSeccion < modulo.secciones.length - 1}
              onClick={() => setVista({ tipo: 'cierre' })}
              style={{ ['--sc' as string]: acento }}
              className={`${styles.progressStep} ${
                vista.tipo === 'cierre' ? styles.progressStepActive : ''
              }`}
            >
              <span className={styles.progressDot}>★</span>
              Repaso
            </button>
          </nav>
        )}

        <AnimatePresence mode="wait">
          {vista.tipo === 'portada' && (
            <Portada
              key="portada"
              modulo={modulo}
              onEmpezar={() => irASeccion(0)}
              onIrA={irASeccion}
            />
          )}

          {vista.tipo === 'seccion' && seccionActual && (
            <motion.div
              key={`sec-${vista.i}-${fase}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.36, ease: EASE }}
            >
              <VistaSeccion
                seccion={seccionActual}
                indice={vista.i}
                total={modulo.secciones.length}
                fase={fase}
                onAvanzar={avanzar}
                onRetroceder={retroceder}
              />
            </motion.div>
          )}

          {vista.tipo === 'cierre' && (
            <Cierre
              key="cierre"
              modulo={modulo}
              volverHref={volverHref}
              onRepasar={() => irASeccion(0)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ PORTADA ═════════════════════════════════════════════════════════════ */

function Portada({
  modulo,
  onEmpezar,
  onIrA,
}: {
  modulo: ModuloTeoria;
  onEmpezar: () => void;
  /** Las tarjetas del recorrido son un índice navegable, no adorno. */
  onIrA: (i: number) => void;
}) {
  /** Simulaciones distintas: un mismo `SimId` repetido en varias secciones
   *  cuenta una sola vez (C7 comparte una entre sus cuatro). */
  const simsUnicas = new Set(modulo.secciones.map((s) => s.sim)).size;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.hero}>
        <div className={styles.heroGlow} />

        <motion.span
          className={styles.heroKicker}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: EASE }}
        >
          Módulo interactivo · {modulo.codigo}
        </motion.span>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        >
          {modulo.titulo}
        </motion.h1>

        <motion.p
          className={styles.heroGancho}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
        >
          {modulo.gancho}
        </motion.p>

        {/* Fila de datos, sin cajas: son metadatos de la portada y encerrarlos
            en tarjetas les daba más peso visual del que les toca. */}
        <motion.div
          className={styles.heroDatos}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.42, ease: EASE }}
        >
          <span className={styles.dato}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.1" />
              <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
            <span className={styles.datoTexto}>
              <strong>{modulo.duracion} min</strong>
              de recorrido completo
            </span>
          </span>

          <span className={styles.dato}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 3v6.5L4.2 18a2 2 0 0 0 1.7 3h12.2a2 2 0 0 0 1.7-3L15 9.5V3"
                stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
              <path d="M8 3h8M6.8 14h10.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
            {/* Se cuentan las simulaciones DISTINTAS, no las secciones: C6 tiene
                una por tema, pero C7 comparte una sola entre las cuatro y decir
                «4 simulaciones · una por tema» sería falso. */}
            <span className={styles.datoTexto}>
              <strong>
                {simsUnicas} {simsUnicas === 1 ? 'simulación' : 'simulaciones'}
              </strong>
              {simsUnicas === modulo.secciones.length
                ? 'una por tema'
                : `para los ${modulo.secciones.length} temas`}
            </span>
          </span>

          <span className={styles.dato}>
            <span className={styles.datoTexto}>
              <strong className={styles.flujo}>
                {['Entiende', 'Juega', 'Comprueba'].map((paso) => (
                  <span key={paso} className={styles.flujoPaso}>{paso}</span>
                ))}
              </strong>
              el orden de cada sección
            </span>
          </span>
        </motion.div>

        <motion.p
          className={styles.recorridoLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34 }}
        >
          Lo que vas a recorrer
        </motion.p>

        <div className={styles.recorrido}>
          {modulo.secciones.map((s, i) => {
            // Cuántas fórmulas animadas trae la sección: es lo que de verdad
            // distingue una de otra, y se lee del propio contenido para que no
            // haya un número escrito a mano que se desincronice.
            const nFormulas = s.logica.filter((b) => b.tipo === 'formula').length;
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => onIrA(i)}
                className={styles.recorridoCard}
                style={{ ['--rc' as string]: s.acento }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.09, duration: 0.45, ease: EASE }}
              >
                <span className={styles.recorridoTop}>
                  <span className={styles.recorridoIconBox}>
                    <IconoModulo name={s.icono} size={34} />
                  </span>
                  <span className={styles.recorridoNum}>{i + 1}</span>
                </span>

                <span className={styles.recorridoTitulo}>{s.titulo}</span>
                <span className={styles.recorridoSub}>{s.subtitulo}</span>

                <span className={styles.recorridoChips}>
                  <span className={styles.recorridoChip}>
                    {nFormulas} {nFormulas === 1 ? 'fórmula' : 'fórmulas'}
                  </span>
                  <span className={styles.recorridoChip}>simulación</span>
                </span>

                <span className={styles.recorridoIr}>
                  Empezar aquí
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          type="button"
          className={styles.cta}
          onClick={onEmpezar}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + modulo.secciones.length * 0.09, duration: 0.4, ease: EASE }}
        >
          Empezar el recorrido
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══ SECCIÓN ═════════════════════════════════════════════════════════════ */

function VistaSeccion({
  seccion,
  indice,
  total,
  fase,
  onAvanzar,
  onRetroceder,
}: {
  seccion: Seccion;
  indice: number;
  total: number;
  fase: Fase;
  onAvanzar: () => void;
  onRetroceder: () => void;
}) {
  const [respondido, setRespondido] = useState<number | null>(null);
  // Lo que el problema guiado le manda a la simulación. Se guarda en estado y
  // no en una ref porque la sim tiene que re-renderizar para aplicarlo.
  const [preset, setPreset] = useState<Record<string, number> | undefined>();

  // Cambiar de sección debe limpiar la respuesta anterior, o la siguiente
  // pregunta aparece ya contestada.
  useEffect(() => { setRespondido(null); setPreset(undefined); }, [seccion.id]);

  const etiquetaFase =
    fase === 'entender' ? 'Entiende la lógica'
    : fase === 'simular' ? 'Ahora juega con ello'
    : 'Compruébalo';

  return (
    <div>
      <div className={styles.secHead}>
        <span className={styles.secIconBox}>
          <IconoModulo name={seccion.icono} size={26} />
        </span>
        <div>
          <h2 className={styles.secTitulo}>{seccion.titulo}</h2>
          <p className={styles.secSub}>
            Sección {indice + 1} de {total} · {seccion.subtitulo}
          </p>
        </div>
      </div>

      <div className={styles.objetivo}>
        <span className={styles.objetivoLabel}>Objetivo</span>
        <span>{seccion.objetivo}</span>
      </div>

      <div className={styles.faseHead}>
        <span className={styles.faseNum}>{fase === 'entender' ? '1' : fase === 'simular' ? '2' : '3'}</span>
        <span className={styles.faseTitulo}>{etiquetaFase}</span>
        <span className={styles.faseHint}>
          {fase === 'entender'
            ? 'Sin tocar nada todavía — primero el razonamiento'
            : fase === 'simular'
            ? 'Mueve los controles y contesta los retos mentalmente'
            : 'Una pregunta para cerrar'}
        </span>
      </div>

      {/* ── Fase 1: la lógica ── */}
      {fase === 'entender' && (
        <div className={styles.bloques}>
          {seccion.logica.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
            >
              <Bloque bloque={b} acento={seccion.acento} />
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Fase 2: pregunta → simulación → respuesta ── */}
      {fase === 'simular' && (
        <>
          {/* La sim va DENTRO del problema, entre el enunciado y la casilla de
              respuesta: el alumno debe llegar a la animación sabiendo ya qué
              está buscando. */}
          <ProblemaGuiado
            problema={seccion.problema}
            acento={seccion.acento}
            onLlevar={(p) => setPreset({ ...p })}
          >
            <Simulacion id={seccion.sim} acento={seccion.acento} preset={preset} />
          </ProblemaGuiado>

          <p className={styles.recorridoLabel} style={{ marginTop: 26 }}>
            Más cosas para probar en la simulación
          </p>
          <div className={styles.retos}>
            {seccion.retos.map((r, i) => (
              <Reto key={i} numero={i + 1} pregunta={r.pregunta} pista={r.pista} />
            ))}
          </div>
        </>
      )}

      {/* ── Fase 3: el chequeo ── */}
      {fase === 'comprobar' && (
        <div className={styles.chequeo}>
          <p className={styles.chequeoPregunta}>{seccion.chequeo.pregunta}</p>
          <div className={styles.chequeoOpciones}>
            {seccion.chequeo.opciones.map((o, i) => {
              const esCorrecta = i === seccion.chequeo.correcta;
              const elegida = respondido === i;
              const marcar =
                respondido === null
                  ? ''
                  : esCorrecta
                  ? styles.opcionCorrecta
                  : elegida
                  ? styles.opcionIncorrecta
                  : '';
              return (
                <button
                  key={i}
                  type="button"
                  disabled={respondido !== null}
                  className={`${styles.chequeoOpcion} ${marcar}`}
                  onClick={() => setRespondido(i)}
                >
                  <span className={styles.opcionLetra}>{'ABCD'[i]}</span>
                  {o}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {respondido !== null && (
              <motion.div
                className={styles.explicacion}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <span className={styles.explicacionLabel}>
                  {respondido === seccion.chequeo.correcta ? 'Correcto' : 'Por qué no'}
                </span>
                {seccion.chequeo.explicacion}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className={styles.secFooter}>
        <button type="button" className={styles.ctaGhost} onClick={onRetroceder}>
          ← Atrás
        </button>
        <button
          type="button"
          className={styles.cta}
          onClick={onAvanzar}
          disabled={fase === 'comprobar' && respondido === null}
          style={fase === 'comprobar' && respondido === null ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
        >
          {fase === 'entender'
            ? 'Ya lo entendí — a la simulación'
            : fase === 'simular'
            ? 'Comprobar lo que aprendí'
            : indice + 1 < total
            ? 'Siguiente sección'
            : 'Ver el repaso final'}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══ BLOQUES DE LÓGICA ═══════════════════════════════════════════════════ */

function Bloque({ bloque, acento }: { bloque: BloqueLogica; acento: string }) {
  switch (bloque.tipo) {
    // Declaración: sin caja. Es la afirmación de la que cuelga la sección, así
    // que va como un titular — filete de acento, antetítulo y texto grande.
    case 'idea':
      return (
        <section className={styles.bIdea}>
          <span className={styles.ideaFilete} />
          <p className={styles.ideaAnte}>{bloque.titulo}</p>
          <p className={styles.ideaTexto}>{bloque.texto}</p>
        </section>
      );

    // Anclaje a algo cotidiano: aparte del hilo principal, como una nota al
    // margen — sangrada, en cursiva y colgando de una guía punteada.
    case 'analogia':
      return (
        <section className={styles.bAnalogia}>
          <span className={styles.analogiaIcono}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <p className={styles.analogiaTitulo}>{bloque.titulo}</p>
            <p className={styles.analogiaTexto}>{bloque.texto}</p>
          </div>
        </section>
      );

    // Fórmula: la expresión respira sola entre dos reglas, y los términos van
    // como una tabla con separadores — no como cajitas apiladas.
    case 'formula':
      return (
        <section className={styles.bFormula}>
          <div className={styles.formulaMarco}>
            <p className={styles.formulaExpr}>{bloque.expresion}</p>
          </div>
          <dl className={styles.formulaPartes}>
            {bloque.partes.map((p) => (
              <div key={p.simbolo} className={styles.formulaParte}>
                <dt className={styles.formulaSimbolo}>{p.simbolo}</dt>
                <dd className={styles.formulaSignificado}>{p.significado}</dd>
                {p.unidad && <dd className={styles.formulaUnidad}>{p.unidad}</dd>}
              </div>
            ))}
          </dl>
          <p className={styles.formulaLectura}>{bloque.lectura}</p>
          {bloque.viva && <FormulaViva cfg={bloque.viva} acento={acento} />}
        </section>
      );

    // Cadena de razonamiento: línea de tiempo vertical. El hilo que une los
    // números es lo que dice «el orden importa».
    case 'pasos':
      return (
        <section className={styles.bPasos}>
          <p className={styles.bloqueRotulo}>{bloque.titulo}</p>
          <ol className={styles.pasos}>
            {bloque.pasos.map((p, i) => (
              <li key={i} className={styles.paso}>
                <span className={styles.pasoNum}>{i + 1}</span>
                <span className={styles.pasoTexto}>{p}</span>
              </li>
            ))}
          </ol>
        </section>
      );

    // Dos casos enfrentados: columnas separadas por una divisoria, sin cajas.
    case 'contraste':
      return (
        <section className={styles.bContraste}>
          <p className={styles.bloqueRotulo}>{bloque.titulo}</p>
          <div className={styles.contraste}>
            {[
              { lado: bloque.a, color: 'var(--acc)' },
              { lado: bloque.b, color: '#8A8AA8' },
            ].map(({ lado, color }) => (
              <div key={lado.titulo} className={styles.contrasteLado} style={{ ['--cl' as string]: color }}>
                <p className={styles.contrasteTitulo}>{lado.titulo}</p>
                <ul className={styles.contrasteItems}>
                  {lado.items.map((it) => (
                    <li key={it} className={styles.contrasteItem}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
            <span className={styles.contrasteVs}>vs</span>
          </div>
        </section>
      );

    // Advertencia. Sin caja ni fondo: la señal la dan el ícono, el rótulo y el
    // filete rojo — tres indicadores, así que el color no es el único (la guía
    // de accesibilidad lo marca como fallo grave) y el fondo era redundante.
    // Comparte silueta con `clinico` a propósito: los dos son apostillas al
    // margen del hilo principal, y sólo cambian de color y de ícono.
    case 'trampa':
      return (
        <section className={styles.bTrampa}>
          <p className={styles.trampaSello}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
              <path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            {bloque.titulo}
          </p>
          <p className={styles.trampaTexto}>{bloque.texto}</p>
        </section>
      );

    // Aplicación médica: sello colgando del borde y filete lateral, sin fondo.
    case 'clinico':
      return (
        <section className={styles.bClinico}>
          <span className={styles.clinicoSello}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-4.6-7-9.5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7 3.5C19 16.4 12 21 12 21Z"
                stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
            </svg>
            En la clínica
          </span>
          <p className={styles.clinicoTitulo}>{bloque.titulo}</p>
          <p className={styles.clinicoTexto}>{bloque.texto}</p>
        </section>
      );
  }
}

/* ═══ RETO ════════════════════════════════════════════════════════════════ */

function Reto({ numero, pregunta, pista }: { numero: number; pregunta: string; pista: string }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className={styles.reto}>
      <button type="button" className={styles.retoBtn} onClick={() => setAbierto((v) => !v)}>
        <span className={styles.retoIcon}>{numero}</span>
        {pregunta}
        <svg
          className={`${styles.retoChevron} ${abierto ? styles.retoChevronOpen : ''}`}
          width="15" height="15" viewBox="0 0 24 24" fill="none"
        >
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.p
            className={styles.retoPista}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            {pista}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══ CIERRE ══════════════════════════════════════════════════════════════ */

function Cierre({
  modulo,
  volverHref,
  onRepasar,
}: {
  modulo: ModuloTeoria;
  volverHref: string;
  onRepasar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div className={styles.secHead}>
        <span className={styles.secIconBox}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z"
              stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h2 className={styles.secTitulo}>Lo que te tienes que llevar</h2>
          <p className={styles.secSub}>
            Si puedes explicar estas {modulo.cierre.length} ideas, la clase está cubierta.
          </p>
        </div>
      </div>

      <div className={styles.cierreGrid}>
        {modulo.cierre.map((c, i) => (
          <motion.div
            key={c.titulo}
            className={styles.cierreCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.42, ease: EASE }}
          >
            <span className={styles.cierreNum}>{i + 1}</span>
            <p className={styles.cierreTitulo}>{c.titulo}</p>
            <p className={styles.cierreTexto}>{c.texto}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.secFooter}>
        <button type="button" className={styles.ctaGhost} onClick={onRepasar}>
          ← Repasar desde el principio
        </button>
        <Link href={volverHref} className={styles.cta}>
          Volver a la clase
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
