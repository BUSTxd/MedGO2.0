'use client';
import { useMemo, useState } from 'react';
import type { MJDrag } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import { useDragDrop } from '@/hooks/useDragDrop';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

type Chip = { id: string; termino: string };

export default function DragConnect({
  config,
  onComplete,
}: {
  config: MJDrag;
  onComplete: (r: MinijuegoResult) => void;
}) {
  const chips = useMemo<Chip[]>(
    () => shuffle(config.pares.map((p) => ({ id: p.id, termino: p.termino }))),
    [config],
  );
  const slots = useMemo(() => shuffle(config.pares.map((p) => ({ id: p.id, match: p.match }))), [config]);
  const chipById = useMemo(() => new Map(chips.map((c) => [c.id, c])), [chips]);

  // chipId → slotKey (par id del slot donde quedó colocado)
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [intentos, setIntentos] = useState(0);
  const [verificado, setVerificado] = useState(false);
  const [resuelto, setResuelto] = useState(false);

  const handleDrop = (item: Chip, slotKey: string | null) => {
    if (resuelto) return;
    setVerificado(false);
    setPlaced((prev) => {
      const next = { ...prev };
      if (slotKey) {
        // liberar cualquier chip que ya estuviera en ese slot
        for (const cid of Object.keys(next)) {
          if (next[cid] === slotKey) delete next[cid];
        }
        next[item.id] = slotKey;
      } else {
        delete next[item.id]; // devuelto al banco
      }
      return next;
    });
  };

  const { dragItem, ghost, target, picked, startDrag, tapItem, tapSlot } = useDragDrop<Chip>({
    onDrop: handleDrop,
    disabled: resuelto,
  });

  const chipEnSlot = (slotKey: string): Chip | null => {
    const cid = Object.keys(placed).find((c) => placed[c] === slotKey);
    return cid ? chipById.get(cid) ?? null : null;
  };
  const enBanco = chips.filter((c) => !placed[c.id]);

  const todosColocados = Object.keys(placed).length === config.pares.length;
  const correcto = config.pares.every((p) => placed[p.id] === p.id);

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

      {/* Banco de términos */}
      <div className={styles.dragBank} data-bank>
        {enBanco.length === 0 && <span className={styles.dragBankEmpty}>Todos colocados</span>}
        {enBanco.map((c) => (
          <button
            key={c.id}
            className={`${styles.dragChip} ${picked?.id === c.id ? styles.dragChipPicked : ''}`}
            onPointerDown={(e) => startDrag(e, c)}
            onClick={() => tapItem(c)}
          >
            {c.termino}
          </button>
        ))}
      </div>

      {/* Slots = definiciones/ejemplos */}
      <div className={styles.dragRows}>
        {slots.map((s) => {
          const chip = chipEnSlot(s.id);
          const bien = verificado && chip?.id === s.id;
          const mal = verificado && chip && chip.id !== s.id;
          return (
            <div key={s.id} className={styles.dragRow}>
              <div
                className={`${styles.dragSlot} ${target === s.id ? styles.dragSlotOver : ''} ${
                  chip ? styles.dragSlotFilled : ''
                } ${bien ? styles.dragSlotOk : ''} ${mal ? styles.dragSlotBad : ''}`}
                data-slot={s.id}
                onClick={() => tapSlot(s.id, chip)}
              >
                {chip ? (
                  <button
                    className={styles.dragChip}
                    onPointerDown={(e) => startDrag(e, chip)}
                  >
                    {chip.termino}
                  </button>
                ) : (
                  <span className={styles.dragSlotHint}>Suelta aquí</span>
                )}
              </div>
              <div className={styles.dragMatch}>{s.match}</div>
            </div>
          );
        })}
      </div>

      {!resuelto && (
        <button className={styles.mjCheckBtn} onClick={verificar} disabled={!todosColocados}>
          Verificar
        </button>
      )}
      {verificado && !correcto && !resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackBad}`}>
          Algunas conexiones no encajan (en rojo). Reacomódalas.
        </p>
      )}
      {resuelto && (
        <p className={`${styles.mjFeedback} ${styles.mjFeedbackOk}`}>
          ¡Todo conectado! {intentos === 1 ? '+50 XP' : '+25 XP'}
        </p>
      )}

      {/* Fantasma que sigue el puntero */}
      {dragItem && (
        <div className={styles.dragGhost} style={{ left: ghost.x, top: ghost.y }}>
          {dragItem.termino}
        </div>
      )}
    </div>
  );
}
