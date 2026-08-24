'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Problema } from '@/lib/data/fisica-modulos/types';
import styles from '@/styles/formulaViva.module.css';

/**
 * Problema tipo examen resuelto CON la simulación.
 *
 * El orden importa y es el que pidió BUST: primero la PREGUNTA, después la
 * animación, y sólo al final la casilla de respuesta. Así el alumno entra a la
 * simulación sabiendo qué está buscando —se guía por ella— en vez de jugar sin
 * rumbo y leer el enunciado después. Por eso la sim se recibe como `children`
 * y se renderiza en medio del componente: el estado del problema (respuesta,
 * intentos, resolución) tiene que ser común a las dos mitades.
 *
 * La resolución paso a paso sólo se ofrece después de intentarlo — darla antes
 * convierte el ejercicio en un texto que se lee.
 */
export default function ProblemaGuiado({
  problema,
  acento,
  onLlevar,
  children,
}: {
  problema: Problema;
  acento: string;
  onLlevar: (preset: Record<string, number>) => void;
  /** La simulación, que va intercalada entre la pregunta y la respuesta. */
  children: React.ReactNode;
}) {
  const [valor, setValor] = useState('');
  const [veredicto, setVeredicto] = useState<'bien' | 'mal' | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [verPasos, setVerPasos] = useState(false);
  const [llevado, setLlevado] = useState(false);

  // Cambiar de sección reutiliza el componente: sin esto el problema siguiente
  // aparecería ya respondido y con la resolución abierta.
  useEffect(() => {
    setValor('');
    setVeredicto(null);
    setIntentos(0);
    setVerPasos(false);
    setLlevado(false);
  }, [problema]);

  const comprobar = () => {
    const n = parseFloat(valor.replace(',', '.'));
    if (Number.isNaN(n)) return;
    const { valor: esperado, tolerancia } = problema.respuesta;
    const ok = Math.abs(n - esperado) <= Math.abs(esperado) * tolerancia;
    setVeredicto(ok ? 'bien' : 'mal');
    setIntentos((i) => i + 1);
    if (ok) setVerPasos(true);
  };

  return (
    <div className={styles.problema} style={{ ['--acc' as string]: acento }}>
      {/* ── 1. La pregunta, antes de ver nada ── */}
      <span className={styles.problemaKicker}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M5 3h14v18l-7-4-7 4V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        Problema
      </span>

      <p className={styles.problemaEnunciado}>{problema.enunciado}</p>

      <div className={styles.problemaDatos}>
        {problema.datos.map((d) => (
          <span key={d.label} className={styles.dato}>
            <span className={styles.datoLabel}>{d.label}</span>
            <span className={styles.datoValor}>{d.valor}</span>
          </span>
        ))}
      </div>

      <p className={styles.problemaPregunta}>{problema.pregunta}</p>

      {problema.preset && (
        <button
          type="button"
          className={`${styles.llevar} ${llevado ? styles.llevarHecho : ''}`}
          onClick={() => { onLlevar(problema.preset!); setLlevado(true); }}
        >
          {llevado ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Simulación puesta en este caso — está justo debajo
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Montar la simulación con estos datos
            </>
          )}
        </button>
      )}

      {/* ── 2. La animación, ya con la pregunta en la cabeza ── */}
      <div className={styles.simuladorHueco}>{children}</div>

      {/* ── 3. Y ahora sí, la respuesta ── */}
      <p className={styles.respuestaLabel}>
        Con lo que acabas de ver, responde:
      </p>

      <div className={styles.respuestaFila}>
        <input
          type="text"
          inputMode="decimal"
          className={styles.respuestaInput}
          placeholder="Tu respuesta"
          value={valor}
          onChange={(e) => { setValor(e.target.value); setVeredicto(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') comprobar(); }}
          aria-label="Tu respuesta"
        />
        <span className={styles.respuestaUnidad}>{problema.respuesta.unidad}</span>
        <button
          type="button"
          className={styles.comprobar}
          onClick={comprobar}
          disabled={valor.trim() === ''}
        >
          Comprobar
        </button>
        {intentos > 0 && !verPasos && (
          <button type="button" className={styles.verPasos} onClick={() => setVerPasos(true)}>
            Ver la resolución
          </button>
        )}
      </div>

      <AnimatePresence>
        {veredicto && (
          <motion.div
            key={veredicto + intentos}
            className={`${styles.veredicto} ${
              veredicto === 'bien' ? styles.veredictoBien : styles.veredictoMal
            }`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            {veredicto === 'bien' ? (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="2.4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  Correcto: {problema.respuesta.valor} {problema.respuesta.unidad}. Abajo tienes
                  por qué sale eso.
                </span>
              </>
            ) : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2.4"
                    strokeLinecap="round" />
                </svg>
                <span>
                  Todavía no. Sube a la simulación de aquí arriba, móntala con los datos del
                  enunciado y compara tu número con sus lecturas — ahí suele verse dónde se torció.
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verPasos && (
          <motion.div
            className={styles.pasosCaja}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={styles.pasosTitulo}>Cómo se resuelve</p>
            {problema.pasos.map((p, i) => (
              <div key={i} className={styles.pasoItem}>
                <span className={styles.pasoBolita}>{i + 1}</span>
                <span>{p}</span>
              </div>
            ))}
            <p className={styles.comprueba}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>{problema.comprueba}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
