'use client';
import { useMemo, useState } from 'react';
import type { MJMapa } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

export default function MapaConceptual({
  config,
  onComplete,
}: {
  config: MJMapa;
  onComplete: (r: MinijuegoResult) => void;
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

  const todosLlenos = huecos.every((h) => asign[h.id]);
  const correcto = huecos.every((h) => asign[h.id] === config.solucion[h.id]);

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
    <div className={styles.mjWrap}>
      <h4 className={styles.mjTitle}>{config.titulo}</h4>
      <p className={styles.mjInstruction}>{config.instruccion}</p>

      <div className={styles.mapaNodos}>
        {config.nodos.map((n) => {
          if (!n.hueco) {
            return (
              <div key={n.id} className={styles.mapaNodoFijo}>
                {n.etiqueta}
              </div>
            );
          }
          const bien = verificado && asign[n.id] === config.solucion[n.id];
          const mal = verificado && asign[n.id] && asign[n.id] !== config.solucion[n.id];
          return (
            <select
              key={n.id}
              className={`${styles.mapaHueco} ${bien ? styles.mapaOk : ''} ${mal ? styles.mapaBad : ''}`}
              value={asign[n.id] ?? ''}
              onChange={(e) => set(n.id, e.target.value)}
              disabled={resuelto}
            >
              <option value="" disabled>
                Elige…
              </option>
              {banco.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          );
        })}
      </div>

      {!resuelto && (
        <button className={styles.mjCheckBtn} onClick={verificar} disabled={!todosLlenos}>
          Verificar mapa
        </button>
      )}
      {verificado && !correcto && !resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          Algunas casillas no encajan (en rojo). Ajusta e inténtalo de nuevo.
        </p>
      )}
      {resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
          ¡Mapa completo! {intentos === 1 ? '+50 XP' : '+25 XP'}
        </p>
      )}
    </div>
  );
}
