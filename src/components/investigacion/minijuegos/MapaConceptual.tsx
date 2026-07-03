'use client';
import { Fragment, useMemo, useState } from 'react';
import type { MJMapa } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import { MJLiteStars, MJLiteHeader, MJLiteFooter } from './MJLiteChrome';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

/** Panel claro autocontenido (mismo lenguaje visual que orden/drag del nivel 2). */
export default function MapaConceptual({
  config,
  onComplete,
  onNext,
}: {
  config: MJMapa;
  onComplete: (r: MinijuegoResult) => void;
  onNext?: () => void;
}) {
  const banco = useMemo(() => shuffle(config.banco), [config]);
  const huecos = config.nodos.filter((n) => n.hueco);
  const [asign, setAsign] = useState<Record<string, string>>({});
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const set = (nodoId: string, valor: string) => {
    if (resuelto) return;
    setAsign((a) => ({ ...a, [nodoId]: valor }));
    setVerificado(false);
  };

  const llenos = huecos.filter((h) => asign[h.id]).length;
  const todosLlenos = llenos === huecos.length;
  const aciertos = huecos.filter((h) => asign[h.id] === config.solucion[h.id]).length;
  const correcto = aciertos === huecos.length;

  const verificar = () => {
    const n = intentos + 1;
    setIntentos(n);
    setVerificado(true);
    if (correcto) {
      setResuelto(true);
      onComplete({ intentos: n, sinErrores: n === 1 });
    }
  };

  return (
    <section className={styles.mjLite}>
      <MJLiteStars />

      <MJLiteHeader
        icono="mapa"
        titulo={config.titulo}
        sub={config.instruccion}
        badgeStrong={`${verificado ? aciertos : llenos} / ${huecos.length}`}
        badgeLabel={verificado ? 'Casillas correctas' : 'Casillas llenas'}
      />

      <div className={styles.mapaLiteFlow}>
        {config.nodos.map((n, i) => {
          const conector = i > 0 && <span className={styles.mapaLiteConn} aria-hidden="true" />;
          if (!n.hueco) {
            return (
              <Fragment key={n.id}>
                {conector}
                <div className={styles.mapaLiteNodoFijo}>{n.etiqueta}</div>
              </Fragment>
            );
          }
          const bien = verificado && asign[n.id] === config.solucion[n.id];
          const mal = verificado && asign[n.id] && asign[n.id] !== config.solucion[n.id];
          return (
            <Fragment key={n.id}>
              {conector}
              <div
                className={`${styles.mapaLiteHueco} ${bien ? styles.mapaLiteHuecoOk : ''} ${
                  mal ? styles.mapaLiteHuecoBad : ''
                }`}
              >
                <select
                  className={styles.mapaLiteSelect}
                  value={asign[n.id] ?? ''}
                  onChange={(e) => set(n.id, e.target.value)}
                  disabled={resuelto}
                >
                  <option value="" disabled>
                    Elige el concepto…
                  </option>
                  {banco.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </Fragment>
          );
        })}
      </div>

      {verificado && (
        <p className={`${styles.mjLiteAviso} ${resuelto ? styles.mjLiteAvisoOk : ''}`}>
          {resuelto
            ? `¡Mapa completo! ${intentos === 1 ? '+50 XP' : '+25 XP'}`
            : 'Algunas casillas no encajan (en rojo). Ajusta e inténtalo de nuevo.'}
        </p>
      )}

      <MJLiteFooter
        resuelto={resuelto}
        deshabilitado={!todosLlenos}
        onVerificar={verificar}
        onNext={onNext}
      />
    </section>
  );
}
