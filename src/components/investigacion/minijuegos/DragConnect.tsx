'use client';
import { useMemo, useState } from 'react';
import type { MJDrag } from '@/lib/investigacion/types';
import { shuffle } from '@/lib/utils/shuffle';
import { useDragDrop } from '@/hooks/useDragDrop';
import Icono from '../Icono';
import OrbitaVerificacion from '../OrbitaVerificacion';
import styles from '@/styles/investigacionGame.module.css';
import type { MinijuegoResult } from './Minijuego';

type Chip = { id: string; termino: string };

/** Ícono + color de acento por defecto (fallback cíclico si el par no los define). */
const FILA_ESTILO = [
  { icon: 'balanza', color: '#2f6ef0' },
  { icon: 'cerebro', color: '#8b5cf6' },
  { icon: 'personas', color: '#10b981' },
  { icon: 'escudo', color: '#f59e0b' },
] as const;

export default function DragConnect({
  config,
  onComplete,
  onNext,
}: {
  config: MJDrag;
  onComplete: (r: MinijuegoResult) => void;
  onNext?: () => void;
}) {
  const chips = useMemo<Chip[]>(
    () => shuffle(config.pares.map((p) => ({ id: p.id, termino: p.termino }))),
    [config],
  );
  const slots = useMemo(() => shuffle(config.pares.map((p) => ({ id: p.id, match: p.match }))), [config]);
  const chipById = useMemo(() => new Map(chips.map((c) => [c.id, c])), [chips]);
  const metaById = useMemo(
    () => new Map(config.pares.map((p) => [p.id, { icono: p.icono, color: p.color }])),
    [config],
  );

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
        for (const cid of Object.keys(next)) {
          if (next[cid] === slotKey) delete next[cid];
        }
        next[item.id] = slotKey;
      } else {
        delete next[item.id];
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

  const colocados = Object.keys(placed).length;
  const total = config.pares.length;
  const todosColocados = colocados === total;
  const correcto = config.pares.every((p) => placed[p.id] === p.id);
  const aciertos = verificado ? config.pares.filter((p) => placed[p.id] === p.id).length : colocados;

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
    <section className={styles.mjDrag}>
      <span className={`${styles.mjDragStar} ${styles.mjDragStar1}`} aria-hidden="true" />
      <span className={`${styles.mjDragStar} ${styles.mjDragStar2}`} aria-hidden="true" />
      <span className={`${styles.mjDragStar} ${styles.mjDragStar3}`} aria-hidden="true" />

      {/* Cabecera */}
      <header className={styles.mjDragHead}>
        <div className={styles.mjDragOrbitaWrap}>
          <OrbitaVerificacion className={styles.mjDragOrbita} />
        </div>
        <div className={styles.mjDragHeadText}>
          <h4 className={styles.mjDragTitulo}>{config.titulo}</h4>
          <p className={styles.mjDragSub}>{config.instruccion}</p>
        </div>
        <div className={styles.mjDragBadge}>
          <span className={styles.mjDragBadgeStar}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.9 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
            </svg>
          </span>
          <span className={styles.mjDragBadgeTxt}>
            <strong>{aciertos} / {total}</strong>
            Correspondencias completadas
          </span>
        </div>
      </header>

      {/* Banco de términos arrastrables */}
      <div className={styles.mjDragBank} data-bank>
        {enBanco.length === 0 && <span className={styles.mjDragBankEmpty}>Todos colocados</span>}
        {enBanco.map((c) => (
          <div
            key={c.id}
            role="button"
            tabIndex={0}
            aria-label={c.termino}
            className={`${styles.mjDragChip} ${picked?.id === c.id ? styles.mjDragChipPicked : ''}`}
            onPointerDown={(e) => startDrag(e, c)}
            onClick={() => tapItem(c)}
          >
            <span className={styles.mjDragGrip} aria-hidden="true">
              <svg viewBox="0 0 16 24" width="11" height="17" fill="currentColor">
                <circle cx="5" cy="6" r="1.6" /><circle cx="11" cy="6" r="1.6" />
                <circle cx="5" cy="12" r="1.6" /><circle cx="11" cy="12" r="1.6" />
                <circle cx="5" cy="18" r="1.6" /><circle cx="11" cy="18" r="1.6" />
              </svg>
            </span>
            {c.termino}
          </div>
        ))}
      </div>

      {/* Filas: slot ← chip · tarjeta con ejemplo */}
      <div className={styles.mjDragRows}>
        {slots.map((s, i) => {
          const chip = chipEnSlot(s.id);
          const bien = verificado && chip?.id === s.id;
          const mal = verificado && chip && chip.id !== s.id;
          const fallback = FILA_ESTILO[i % FILA_ESTILO.length];
          const meta = metaById.get(s.id);
          const est = { icon: meta?.icono ?? fallback.icon, color: meta?.color ?? fallback.color };
          return (
            <div key={s.id} className={styles.mjDragRow} style={{ ['--row' as string]: est.color }}>
              <span className={styles.mjDragNum}>{i + 1}</span>

              <div
                className={`${styles.mjDragSlot} ${target === s.id ? styles.mjDragSlotOver : ''} ${
                  chip ? styles.mjDragSlotFilled : ''
                } ${bien ? styles.mjDragSlotOk : ''} ${mal ? styles.mjDragSlotBad : ''}`}
                data-slot={s.id}
                onClick={() => tapSlot(s.id, chip)}
              >
                {chip ? (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={chip.termino}
                    className={styles.mjDragChipIn}
                    onPointerDown={(e) => startDrag(e, chip)}
                  >
                    {chip.termino}
                  </div>
                ) : (
                  <span className={styles.mjDragSlotHint}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
                    </svg>
                    Suelta aquí
                  </span>
                )}
              </div>

              <span className={styles.mjDragConn} aria-hidden="true" />

              <div className={styles.mjDragCard}>
                <span className={styles.mjDragCardIcon}>
                  <Icono name={est.icon} />
                </span>
                <span className={styles.mjDragCardText}>{s.match}</span>
                <span className={styles.mjDragCardSpark} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 3l1.3 3.3L16.5 7l-2.6 1.8L14.5 12 12 9.9 9.5 12l.6-3.2L7.5 7l3.2-.7z" opacity="0.75" />
                    <circle cx="18.5" cy="15" r="1" />
                    <circle cx="6" cy="16" r="0.8" />
                  </svg>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {verificado && (
        <p className={`${styles.mjDragAviso} ${resuelto ? styles.mjDragAvisoOk : ''}`}>
          {resuelto
            ? `¡Todo conectado! ${intentos === 1 ? '+50 XP' : '+25 XP'}`
            : 'Algunas conexiones no encajan (en rojo). Reacomódalas.'}
        </p>
      )}

      {/* Footer */}
      <div className={styles.mjDragFooter}>
        <div className={styles.mjDragContinuarWrap}>
          <span className={styles.mjDragOrbitaLinea} aria-hidden="true" />
          <button
            className={`${styles.mjOrdenContinuar} ${resuelto ? styles.mjOrdenContinuarListo : ''}`}
            onClick={resuelto ? onNext : verificar}
            disabled={!resuelto && !todosColocados}
          >
            <span key={resuelto ? 'cont' : 'ver'} className={styles.mjOrdenBtnLabel}>
              {resuelto ? (
                <>
                  Continuar
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              ) : (
                'Verificar'
              )}
            </span>
          </button>
        </div>

        <div className={`${styles.bloqueChip} ${styles.bloqueChipXP}`}>
          <span className={styles.bloqueChipIcon}>
            <Icono name="estrellas" />
          </span>
          <span>
            <strong>+25 XP</strong>
            <br />
            al completar
          </span>
        </div>

        <div className={`${styles.bloqueChip} ${styles.bloqueChipMotiva} ${styles.mjDragMotiva}`}>
          <span className={styles.bloqueChipIcon}>
            <svg viewBox="0 0 512 512" width="22" height="22" fill="currentColor" aria-hidden="true">
              <path d="M384,449.963v-12.629c0-17.643-14.357-32-32-32h-15.104c-20.011-34.176-27.52-93.995-27.563-127.68 c3.349-6.059,6.549-11.712,9.216-16.32c17.557-30.379,44.096-99.072,44.096-133.333v-4.821c0-5.824-0.043-10.347-0.192-14.293 c0.085-0.619,0.192-1.728,0.192-2.219C362.645,47.851,314.795,0,255.979,0S149.312,47.851,149.312,106.667 c0,13.141,2.645,25.835,7.189,37.696c0.043,0.235-0.021,0.448,0.021,0.661l46.763,185.749 c-9.493,31.296-23.019,62.037-28.779,74.56H160c-17.643,0-32,14.357-32,32v12.629c-12.395,4.416-21.333,16.149-21.333,30.037 v21.333c0,5.888,4.779,10.667,10.667,10.667h277.333c5.888,0,10.667-4.779,10.667-10.667V480 C405.333,466.112,396.395,454.379,384,449.963z M277.333,128.021c2.603,0,5.035,0.64,7.36,1.493 c0.683,0.256,1.344,0.576,2.005,0.896c1.579,0.789,3.029,1.792,4.352,2.944c0.576,0.512,1.216,0.917,1.749,1.472 c3.584,3.819,5.888,8.875,5.888,14.528c0,11.755-9.557,21.333-21.333,21.333c-8.128-0.021-14.955-4.736-18.56-11.413 c-0.469-0.853-0.96-1.685-1.301-2.56c-0.853-2.325-1.493-4.757-1.493-7.36C256,137.6,265.557,128.021,277.333,128.021z M189.781,189.504c3.84,3.051,7.893,5.845,12.203,8.384c5.717,29.824,11.371,61.077,11.371,79.467c0,1.536-0.149,3.2-0.235,4.821 L189.781,189.504z M197.952,405.333c12.395-27.968,36.715-87.979,36.715-128c0-21.312-6.187-54.741-12.629-88.043 c0-0.021,0-0.021,0-0.043l-1.408-7.296c-1.579-8.128-3.307-17.088-4.949-25.984c-1.387-7.467-2.645-14.741-3.733-21.611 c-0.299-1.899-0.64-3.904-0.917-5.717c3.093,7.765,6.784,16.491,11.328,24.96c0.235,0.427,0.469,0.853,0.704,1.28 c2.155,3.883,4.523,7.637,7.147,11.243c0.235,0.32,0.448,0.661,0.704,0.981c8.832,11.819,20.651,21.077,37.056,23.765 c3.029,0.704,6.144,1.131,9.365,1.131c3.392,0,6.656-0.491,9.835-1.259c34.816-6.123,47.445-43.371,54.165-67.435V128 c0,27.136-23.061,91.2-42.219,124.373C285.141,276.565,256,326.933,256,373.333c0,5.888,4.779,10.667,10.667,10.667 s10.667-4.779,10.667-10.667c0-18.453,5.696-38.144,13.12-56.512c3.157,28.267,9.728,61.973,22.123,88.512H197.952z" />
            </svg>
          </span>
          <span>
            <strong>Vas muy bien</strong>
            <br />
            ¡Sigue así!
          </span>
        </div>
      </div>

      {/* Fantasma que sigue el puntero */}
      {dragItem && (
        <div className={styles.mjDragGhost} style={{ left: ghost.x, top: ghost.y }}>
          {dragItem.termino}
        </div>
      )}
    </section>
  );
}
