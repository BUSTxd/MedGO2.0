'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import { shuffle } from '@/lib/utils/shuffle';
import {
  PARAMETROS,
  buildCartas,
  TOTAL_CELDAS,
  type Carta,
  type Compartimento,
} from '@/lib/data/sangreOrina';
import base from '@/styles/laboratorio.module.css';
import s from '@/styles/sangreOrina.module.css';

const slotKey = (paramId: string, comp: Compartimento) => `${paramId}-${comp}`;
const MOVE_THRESHOLD = 6; // px para distinguir tap de arrastre

type Slots = Record<string, Carta | null>;

const emptySlots = (): Slots => {
  const o: Slots = {};
  for (const p of PARAMETROS) {
    o[slotKey(p.id, 'sangre')] = null;
    o[slotKey(p.id, 'orina')] = null;
  }
  return o;
};

export default function SangreVsOrinaPage() {
  // `order` = orden barajado fijo de las 22 cartas (cambia solo al reiniciar).
  // El banco se DERIVA: order menos las cartas ya colocadas en slots. Así no hay
  // dos estados que sincronizar.
  const [order, setOrder] = useState<Carta[]>(() => shuffle(buildCartas()));
  const [slots, setSlots] = useState<Slots>(emptySlots);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // Estado de arrastre (solo cambia en down/up; el movimiento es DOM directo).
  const [dragCarta, setDragCarta] = useState<Carta | null>(null);
  const [target, setTarget] = useState<string | null>(null);

  const ghostRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<string | null>(null);
  const didDragRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const cartaRef = useRef<Carta | null>(null);
  const draggingRef = useRef(false);

  const cartaById = useMemo(() => {
    const m = new Map<string, Carta>();
    for (const c of buildCartas()) m.set(c.id, c);
    return m;
  }, []);

  const placedIds = useMemo(() => {
    const set = new Set<string>();
    for (const c of Object.values(slots)) if (c) set.add(c.id);
    return set;
  }, [slots]);

  const bank = useMemo(
    () => order.filter((c) => !placedIds.has(c.id)),
    [order, placedIds],
  );
  const placedCount = placedIds.size;
  const allPlaced = placedCount === TOTAL_CELDAS;

  // ─── Colocar una carta en un slot (reubica; la desplazada vuelve al banco sola) ───
  const placeInSlot = (cartaId: string, destKey: string) => {
    const carta = cartaById.get(cartaId);
    if (!carta) return;
    setChecked(false);
    setSlots((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (next[k]?.id === cartaId) next[k] = null;
      }
      next[destKey] = carta;
      return next;
    });
  };

  // ─── Devolver una carta de un slot al banco ───
  const returnToBank = (cartaId: string) => {
    setChecked(false);
    setSlots((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (next[k]?.id === cartaId) next[k] = null;
      }
      return next;
    });
  };

  // ─── Arrastre con Pointer Events ───
  const moveGhost = (x: number, y: number) => {
    const g = ghostRef.current;
    if (g) g.style.transform = `translate(${x - 85}px, ${y - 28}px) rotate(-3deg)`;
  };

  const onPointerMove = (e: PointerEvent) => {
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (!draggingRef.current) {
      if (Math.hypot(dx, dy) < MOVE_THRESHOLD) return;
      draggingRef.current = true;
      didDragRef.current = true;
      setDragCarta(cartaRef.current);
    }
    moveGhost(e.clientX, e.clientY);
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const slotEl = el?.closest('[data-slot]') as HTMLElement | null;
    const key = slotEl?.dataset.slot ?? null;
    if (key !== targetRef.current) {
      targetRef.current = key;
      setTarget(key);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    const carta = cartaRef.current;
    if (draggingRef.current && carta) {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const slotEl = el?.closest('[data-slot]') as HTMLElement | null;
      const key = slotEl?.dataset.slot;
      const overBank = !!el?.closest('[data-bank]');
      if (key) placeInSlot(carta.id, key);
      else if (overBank) returnToBank(carta.id);
      // si se suelta fuera, la carta se queda donde estaba
    }
    draggingRef.current = false;
    cartaRef.current = null;
    targetRef.current = null;
    setDragCarta(null);
    setTarget(null);
  };

  const startDrag = (e: React.PointerEvent, carta: Carta) => {
    if (checked) return;
    e.preventDefault();
    startRef.current = { x: e.clientX, y: e.clientY };
    cartaRef.current = carta;
    draggingRef.current = false;
    didDragRef.current = false;
    moveGhost(e.clientX, e.clientY);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // ─── Tap de respaldo ───
  const tapBankCarta = (carta: Carta) => {
    if (checked || didDragRef.current) return;
    setPicked((p) => (p === carta.id ? null : carta.id));
  };

  const tapSlot = (key: string) => {
    if (checked || didDragRef.current) return;
    if (picked) {
      placeInSlot(picked, key);
      setPicked(null);
    } else if (slots[key]) {
      returnToBank(slots[key]!.id);
    }
  };

  // ─── Verificar / Reiniciar ───
  const correctCount = useMemo(() => {
    let n = 0;
    for (const [key, carta] of Object.entries(slots)) {
      if (carta && carta.id === key) n++;
    }
    return n;
  }, [slots]);

  const verificar = () => {
    if (!allPlaced) return;
    setPicked(null);
    setChecked(true);
  };

  const reiniciar = () => {
    setSlots(emptySlots());
    setOrder(shuffle(buildCartas()));
    setPicked(null);
    setChecked(false);
  };

  // Limpieza por si se desmonta a mitad de un arrastre.
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCarta = (carta: Carta, inSlot: boolean) => {
    const isSangre = carta.comp === 'sangre';
    return (
      <div
        className={`${s.carta} ${isSangre ? s.cartaSangre : s.cartaOrina} ${
          picked === carta.id ? s.cartaPicked : ''
        }`}
        style={dragCarta?.id === carta.id ? { opacity: 0.35 } : undefined}
        onPointerDown={(e) => startDrag(e, carta)}
        onClick={() => {
          if (inSlot) return; // las cartas en slot se gestionan desde el slot
          tapBankCarta(carta);
        }}
        role="button"
        tabIndex={0}
        aria-label={`${isSangre ? 'Sangre' : 'Orina'}: ${carta.texto}`}
      >
        <span className={s.cartaTag}>
          <span
            className={s.cartaDot}
            style={{ background: isSangre ? '#E85B4A' : '#E6A700' }}
          />
          {isSangre ? 'Sangre' : 'Orina'}
        </span>
        {carta.texto}
      </div>
    );
  };

  const renderSlot = (paramId: string, comp: Compartimento) => {
    const key = slotKey(paramId, comp);
    const carta = slots[key];
    const isTarget = target === key;
    let stateClass = '';
    if (checked && carta) stateClass = carta.id === key ? s.slotOk : s.slotBad;
    return (
      <div
        data-slot={key}
        className={`${s.slot} ${isTarget ? s.slotTarget : ''} ${stateClass}`}
        onClick={() => tapSlot(key)}
        role="button"
        tabIndex={0}
        aria-label={`Soltar valor de ${comp} para ${paramId}`}
      >
        <span className={s.slotTag}>{comp === 'sangre' ? 'Sangre' : 'Orina'}</span>
        {carta ? (
          renderCarta(carta, true)
        ) : (
          <span className={s.slotEmptyHint}>Suelta aquí</span>
        )}
      </div>
    );
  };

  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="parametro-sangre-orina" />

      {/* Top bar */}
      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>
          {placedCount} / {TOTAL_CELDAS} colocadas
        </span>
      </div>

      <div className={s.wrap}>
        <h2 className={s.title}>Parámetro: Sangre vs Orina</h2>
        <p className={s.intro}>
          Arrastra cada valor normal hacia el parámetro y compartimento correcto. En móvil
          también puedes tocar una tarjeta y luego la celda destino.
        </p>

        {/* Progreso */}
        <div className={s.progress}>
          <div className={s.progressTrack}>
            <div
              className={s.progressFill}
              style={{ width: `${(placedCount / TOTAL_CELDAS) * 100}%` }}
            />
          </div>
          <span className={s.progressLabel}>
            {placedCount}/{TOTAL_CELDAS}
          </span>
        </div>

        {/* Tablero */}
        <div className={s.board}>
          <div className={s.tubes} aria-hidden>
            <div className={s.arteria} />
            <div className={s.conducto} />
          </div>

          <div className={s.head}>
            <span className={s.headCell}>Parámetro</span>
            <span className={`${s.headCell} ${s.headSangre}`}>Sangre / plasma</span>
            <span className={`${s.headCell} ${s.headOrina}`}>Orina</span>
          </div>

          {PARAMETROS.map((p) => (
            <div key={p.id} className={s.row}>
              <div className={s.param}>{p.parametro}</div>
              {renderSlot(p.id, 'sangre')}
              {renderSlot(p.id, 'orina')}
            </div>
          ))}
        </div>

        {/* Banco de tarjetas */}
        <p className={s.bankTitle}>Banco de valores</p>
        <div className={s.bank} data-bank>
          {bank.length === 0 ? (
            <span className={s.bankEmpty}>Todas las tarjetas están colocadas.</span>
          ) : (
            bank.map((c) => <div key={c.id}>{renderCarta(c, false)}</div>)
          )}
        </div>

        {/* Botonera */}
        <div className={s.actions}>
          <button
            className={`${base.navBtn} ${base.navBtnPrimary}`}
            onClick={verificar}
            disabled={!allPlaced || checked}
          >
            Verificar respuestas
          </button>
          <button className={base.navBtn} onClick={reiniciar}>
            Reiniciar
          </button>
        </div>

        {/* Resultado */}
        {checked && (
          <>
            <div className={s.score}>
              Puntaje: <span className={s.scoreNum}>{correctCount}</span> / {TOTAL_CELDAS}
            </div>

            <div className={s.explainList}>
              {PARAMETROS.map((p) => {
                const okS = slots[slotKey(p.id, 'sangre')]?.id === slotKey(p.id, 'sangre');
                const okO = slots[slotKey(p.id, 'orina')]?.id === slotKey(p.id, 'orina');
                const full = okS && okO;
                return (
                  <div key={p.id} className={s.explainItem}>
                    <div className={s.explainHead}>
                      <span className={s.explainParam}>{p.parametro}</span>
                      <span className={full ? s.badgeOk : s.badgeBad}>
                        {full ? '✓ Correcto' : '✗ Revisar'}
                      </span>
                    </div>
                    <p className={s.explainText}>{p.explicacion}</p>
                    {!full && (
                      <p className={s.hint}>
                        ⚠ Revisa si este valor corresponde a sangre o a orina.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Clon flotante durante el arrastre */}
      <div ref={ghostRef} className={s.ghost} aria-hidden>
        {dragCarta && (
          <div
            className={`${s.carta} ${
              dragCarta.comp === 'sangre' ? s.cartaSangre : s.cartaOrina
            }`}
          >
            <span className={s.cartaTag}>
              <span
                className={s.cartaDot}
                style={{ background: dragCarta.comp === 'sangre' ? '#E85B4A' : '#E6A700' }}
              />
              {dragCarta.comp === 'sangre' ? 'Sangre' : 'Orina'}
            </span>
            {dragCarta.texto}
          </div>
        )}
      </div>
    </div>
  );
}
