'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { LaboratorioClase, TemaLab } from '@/lib/data/fisica-modulos/types';
import Simulacion from './sims';
import IconoModulo from './IconoModulo';
import styles from '@/styles/moduloTeoria.module.css';

/* ───────────────────────────────────────────────────────────────────────────
   Laboratorio de una clase: menú de temas → vista de simulación.

   Es el recorrido corto, para las clases que aún no tienen el módulo completo
   de teoría. La diferencia con `ModuloTeoriaRunner` no es de envase sino de
   contrato: allí el orden manda (no se puede saltar a la simulación sin haber
   leído el razonamiento) y aquí NO hay orden — los temas son un menú y se
   entra por donde se quiera. Fingir un recorrido guiado sin el contenido que
   lo justifica sería peor que no tenerlo.

   Cuando una clase gane su `ModuloTeoria`, la ruta la mandará allí sola: este
   runner ni se entera.
   ─────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LabRunner({
  lab,
  volverHref,
}: {
  lab: LaboratorioClase;
  volverHref: string;
}) {
  const [abierto, setAbierto] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const tema = abierto !== null ? lab.temas[abierto] : null;
  const acento = tema?.acento ?? lab.temas[0].acento;

  // Entrar en un tema o volver al menú reencuadra arriba: sin esto se aterriza
  // a media simulación y parece que la página no reaccionó.
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [abierto]);

  return (
    <div className={styles.wrapper} style={{ ['--acc' as string]: acento }}>
      <div className={styles.container}>
        <div ref={topRef} />

        {tema ? (
          <button type="button" className={styles.backLink} onClick={() => setAbierto(null)}>
            ← Todos los temas de {lab.codigo}
          </button>
        ) : (
          <Link href={volverHref} className={styles.backLink}>
            ← Volver a la clase
          </Link>
        )}

        <AnimatePresence mode="wait">
          {tema === null ? (
            <Menu key="menu" lab={lab} onAbrir={setAbierto} />
          ) : (
            <VistaTema
              key={`tema-${abierto}`}
              tema={tema}
              indice={abierto as number}
              total={lab.temas.length}
              onSiguiente={
                (abierto as number) + 1 < lab.temas.length
                  ? () => setAbierto((abierto as number) + 1)
                  : undefined
              }
              onMenu={() => setAbierto(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ MENÚ DE TEMAS ═══════════════════════════════════════════════════════ */

function Menu({ lab, onAbrir }: { lab: LaboratorioClase; onAbrir: (i: number) => void }) {
  /** Simulaciones distintas: dos temas pueden compartir escena. */
  const simsUnicas = new Set(lab.temas.map((t) => t.sim)).size;

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
          Laboratorio virtual · {lab.codigo}
        </motion.span>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
        >
          {lab.titulo}
        </motion.h1>

        <motion.p
          className={styles.heroGancho}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
        >
          {lab.gancho}
        </motion.p>

        <motion.div
          className={styles.heroDatos}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.42, ease: EASE }}
        >
          <span className={styles.dato}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M9 3v6.5L4.2 18a2 2 0 0 0 1.7 3h12.2a2 2 0 0 0 1.7-3L15 9.5V3"
                stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
              <path d="M8 3h8M6.8 14h10.4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
            <span className={styles.datoTexto}>
              <strong>
                {simsUnicas} {simsUnicas === 1 ? 'simulación' : 'simulaciones'}
              </strong>
              con física resuelta en vivo
            </span>
          </span>

          <span className={styles.dato}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M8 6h8M12 6v12M9 18h6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              <path d="M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
            </svg>
            <span className={styles.datoTexto}>
              <strong>Panel de fórmulas</strong>
              elige cuál mirar y se resuelve con tus valores
            </span>
          </span>
        </motion.div>

        <motion.p
          className={styles.recorridoLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34 }}
        >
          Elige un tema
        </motion.p>

        <div className={styles.recorrido}>
          {lab.temas.map((tema, i) => (
            <motion.button
              key={tema.id}
              type="button"
              onClick={() => onAbrir(i)}
              className={styles.recorridoCard}
              style={{ ['--rc' as string]: tema.acento }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.09, duration: 0.45, ease: EASE }}
            >
              <span className={styles.recorridoTop}>
                <span className={styles.recorridoIconBox}>
                  <IconoModulo name={tema.icono} size={34} />
                </span>
                <span className={styles.recorridoNum}>{i + 1}</span>
              </span>

              <span className={styles.recorridoTitulo}>{tema.titulo}</span>
              <span className={styles.recorridoSub}>{tema.subtitulo}</span>

              <span className={styles.recorridoChips}>
                <span className={styles.recorridoChip}>simulación</span>
                <span className={styles.recorridoChip}>
                  {tema.retos.length} {tema.retos.length === 1 ? 'reto' : 'retos'}
                </span>
              </span>

              <span className={styles.recorridoIr}>
                Abrir el laboratorio
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ VISTA DE UN TEMA ════════════════════════════════════════════════════ */

function VistaTema({
  tema,
  indice,
  total,
  onSiguiente,
  onMenu,
}: {
  tema: TemaLab;
  indice: number;
  total: number;
  onSiguiente?: () => void;
  onMenu: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.36, ease: EASE }}
    >
      <div className={styles.secHead}>
        <span className={styles.secIconBox}>
          <IconoModulo name={tema.icono} size={26} />
        </span>
        <div>
          <h2 className={styles.secTitulo}>{tema.titulo}</h2>
          <p className={styles.secSub}>
            Tema {indice + 1} de {total} · {tema.subtitulo}
          </p>
        </div>
      </div>

      <div className={styles.objetivo}>
        <span className={styles.objetivoLabel}>Objetivo</span>
        <span>{tema.objetivo}</span>
      </div>

      <Simulacion id={tema.sim} acento={tema.acento} />

      <p className={styles.recorridoLabel} style={{ marginTop: 26 }}>
        Contesta estos moviendo los controles
      </p>
      <div className={styles.retos}>
        {tema.retos.map((reto, i) => (
          <Reto key={i} numero={i + 1} pregunta={reto.pregunta} pista={reto.pista} />
        ))}
      </div>

      <div className={styles.secFooter}>
        <button type="button" className={styles.ctaGhost} onClick={onMenu}>
          ← Todos los temas
        </button>
        {onSiguiente && (
          <button type="button" className={styles.cta} onClick={onSiguiente}>
            Siguiente tema
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  );
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
