'use client';

import { Fragment, useMemo } from 'react';
import type { FlujoExplicacion as Flujo, TipoPasoFlujo } from '@/lib/examen/payload';
import styles from '@/styles/flujoExplicacion.module.css';

const ROTULO_TIPO: Record<TipoPasoFlujo, string> = {
  causa: 'Causa',
  mecanismo: 'Mecanismo',
  efecto: 'Efecto',
  clinica: 'Clínica',
  clave: 'Respuesta',
};

/**
 * Capas del flujo: cada paso va una fila por debajo del más bajo de los que
 * apuntan a él (camino más largo desde una raíz). Así dos causas que convergen
 * quedan lado a lado encima de su efecto. Un enlace que cerrara un ciclo se
 * ignora para el cálculo: el dato lo escribe un agente y no debe tumbar la hoja.
 */
function capasDe(flujo: Flujo): string[][] {
  const ids = flujo.pasos.map(p => p.id);
  const entrantes = new Map(ids.map(id => [id, [] as string[]]));
  for (const [de, a] of flujo.enlaces) {
    if (entrantes.has(a) && entrantes.has(de) && de !== a) entrantes.get(a)!.push(de);
  }
  const nivel = new Map<string, number>();
  const visitando = new Set<string>();
  const calcular = (id: string): number => {
    if (nivel.has(id)) return nivel.get(id)!;
    if (visitando.has(id)) return 0;
    visitando.add(id);
    const n = Math.max(-1, ...entrantes.get(id)!.map(calcular)) + 1;
    visitando.delete(id);
    nivel.set(id, n);
    return n;
  };
  ids.forEach(calcular);
  const capas: string[][] = [];
  for (const id of ids) (capas[nivel.get(id)!] ??= []).push(id);
  return capas.filter(Boolean);
}

/**
 * Esquema del razonamiento fisiopatológico de una pregunta de nivel 2-3: los
 * pasos se encienden de arriba abajo después de la explicación escrita, y el
 * que coincide con la respuesta (`tipo: 'clave'`) se resalta. Es solo lectura:
 * el texto sale del mismo JSON que el modo suelto y el modo por temas.
 */
export default function FlujoExplicacion({ flujo }: { flujo: Flujo }) {
  const capas = useMemo(() => capasDe(flujo), [flujo]);
  const paso = useMemo(() => new Map(flujo.pasos.map(p => [p.id, p])), [flujo]);

  // Rótulos de los enlaces que bajan de una capa a la siguiente: se escriben
  // sobre la flecha que las une (casi siempre hay uno solo).
  const rotulosEntre = (i: number) => {
    const arriba = new Set(capas[i]);
    const abajo = new Set(capas[i + 1]);
    return flujo.enlaces
      .filter(([de, a, r]) => r && arriba.has(de) && abajo.has(a))
      .map(([, , r]) => r as string);
  };

  let orden = 0;
  return (
    <figure className={styles.flujo} aria-label={`Esquema: ${flujo.titulo}`}>
      <figcaption className={styles.titulo}>
        <span className={styles.tituloIcono} aria-hidden>
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
            <circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="18" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="6" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8.2 7.2 15.8 10.8M8.2 16.8l7.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        {flujo.titulo}
      </figcaption>

      <div className={styles.capas}>
        {capas.map((capa, i) => {
          const rotulos = i < capas.length - 1 ? rotulosEntre(i) : [];
          return (
            <Fragment key={capa.join()}>
              <div className={styles.capa}>
                {capa.map(id => {
                  const p = paso.get(id)!;
                  const tipo = (p.tipo in ROTULO_TIPO ? p.tipo : 'mecanismo') as TipoPasoFlujo;
                  return (
                    <div
                      key={id}
                      className={`${styles.paso} ${styles[tipo]}`}
                      style={{ '--orden': orden++ } as React.CSSProperties}
                    >
                      <span className={styles.pasoTipo}>{ROTULO_TIPO[tipo]}</span>
                      <span className={styles.pasoTexto}>{p.texto}</span>
                    </div>
                  );
                })}
              </div>
              {i < capas.length - 1 && (
                <div
                  className={styles.flecha}
                  style={{ '--orden': orden - 0.5 } as React.CSSProperties}
                  aria-hidden
                >
                  <svg viewBox="0 0 12 22" width="12" height="22">
                    <path d="M6 1v17M1.5 13.5 6 19l4.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {rotulos.length > 0 && <span className={styles.flechaRotulo}>{rotulos.join(' · ')}</span>}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </figure>
  );
}
