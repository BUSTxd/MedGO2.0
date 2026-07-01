'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { NivelMeta, NivelContenido, FlowStep, MinijuegoConfig } from '@/lib/investigacion/types';
import { FLOW_ORDER } from '@/lib/investigacion/types';
import { COLOR_BANDA, XP, xpPorMinijuego } from '@/lib/investigacion/xp';
import { NIVELES } from '@/lib/investigacion/niveles';
import { useInvestigacionProgress } from '@/hooks/useInvestigacionProgress';
import NivelHUD from './NivelHUD';
import IntroNivel from './IntroNivel';
import BloqueView from './BloqueView';
import Minijuego, { type MinijuegoResult } from './minijuegos/Minijuego';
import BossChallenge, { type BossResult } from './minijuegos/BossChallenge';
import Celebracion from './Celebracion';
import XPFloat, { type XPToast } from './XPFloat';
import BadgeUnlock from './BadgeUnlock';
import styles from '@/styles/investigacionGame.module.css';

const SECCION_LABEL: Record<FlowStep, string> = {
  intro: 'Introducción',
  bloque1: 'Bloque 1 · Teoría',
  minijuegoA: 'Minijuego A',
  bloque2: 'Bloque 2 · Teoría',
  minijuegoB: 'Minijuego B',
  bloqueFinal: 'Bloque final',
  boss: 'Boss challenge',
  completado: 'Completado',
};

const LIMITE_VELOCISTA_MS = 10 * 60 * 1000;

function bumpPerfectDrags(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const k = 'medgo-inv-perfect-drags';
    const v = Number(localStorage.getItem(k) ?? '0') + 1;
    localStorage.setItem(k, String(v));
    return v;
  } catch {
    return 0;
  }
}

export default function NivelRunner({
  meta,
  contenido,
}: {
  meta: NivelMeta;
  contenido: NivelContenido;
}) {
  const { state, hydrated, completeLevel, addXP, markStep, awardBadge } = useInvestigacionProgress();
  const [step, setStep] = useState<FlowStep>('intro');
  const [xpToasts, setXpToasts] = useState<XPToast[]>([]);
  const [badgeQueue, setBadgeQueue] = useState<string[]>([]);
  const [insigniasNivel, setInsigniasNivel] = useState<string[]>([]);

  const startRef = useRef<number>(Date.now());
  const errorFreeRef = useRef(true);
  const toastId = useRef(0);
  const acento = COLOR_BANDA[meta.banda] ?? '#3B82F6';

  const idx = FLOW_ORDER.indexOf(step);
  const progresoPct = Math.round((idx / (FLOW_ORDER.length - 1)) * 100);

  const siguienteId = useMemo(() => {
    const i = NIVELES.findIndex((m) => m.id === meta.id);
    const sig = NIVELES[i + 1];
    return sig && sig.disponible ? sig.id : null;
  }, [meta.id]);

  const pushXP = useCallback((amount: number) => {
    toastId.current += 1;
    const t = { id: toastId.current, amount };
    setXpToasts((prev) => [...prev, t]);
  }, []);

  const removeXP = useCallback((id: number) => {
    setXpToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const otorgar = useCallback(
    (badgeId: string) => {
      if (state.insignias.includes(badgeId) || insigniasNivel.includes(badgeId)) {
        if (!insigniasNivel.includes(badgeId)) setInsigniasNivel((l) => [...l, badgeId]);
        return;
      }
      awardBadge(badgeId);
      setBadgeQueue((q) => [...q, badgeId]);
      setInsigniasNivel((l) => [...l, badgeId]);
    },
    [awardBadge, state.insignias, insigniasNivel],
  );

  /** Otorga XP de un paso una sola vez (idempotente vía pasosHechos). */
  const grantStepXP = useCallback(
    (stepKey: string, amount: number) => {
      const yaHecho = state.niveles[meta.id]?.pasosHechos.includes(stepKey);
      if (!yaHecho) {
        addXP(meta.id, amount);
        markStep(meta.id, stepKey);
        pushXP(amount);
      }
    },
    [state.niveles, meta.id, addXP, markStep, pushXP],
  );

  const onBloque = (stepKey: FlowStep, next: FlowStep) => {
    grantStepXP(stepKey, XP.BLOQUE);
    setStep(next);
  };

  const onMinijuego = (
    stepKey: 'minijuegoA' | 'minijuegoB',
    config: MinijuegoConfig,
    result: MinijuegoResult,
  ) => {
    // No auto-avanza: otorga XP y deja ver la explicación; el usuario pulsa "Continuar".
    grantStepXP(stepKey, xpPorMinijuego(result.intentos));
    if (!result.sinErrores) errorFreeRef.current = false;
    // Insignias por tipo de minijuego
    if (result.sinErrores && config.tipo === 'error') otorgar('ojo-clinico');
    if (result.sinErrores && config.tipo === 'drag') {
      const total = bumpPerfectDrags();
      if (total >= 3) otorgar('conector');
    }
  };

  const onBoss = (result: BossResult) => {
    grantStepXP('boss', XP.BOSS);
    if (!result.sinErrores) errorFreeRef.current = false;

    // Cierre del nivel
    completeLevel(meta.id);

    const elapsed = Date.now() - startRef.current;
    if (elapsed < LIMITE_VELOCISTA_MS) otorgar('velocista');
    if (errorFreeRef.current) otorgar('precision-total');
    // Insignia "Estadístico": dominar el nivel de errores Tipo I y II sin fallar.
    if (meta.id === 'tema-04' && errorFreeRef.current) otorgar('estadistico');

    setStep('completado');
  };

  if (!hydrated) return <div className={styles.cargando}>Cargando nivel…</div>;

  const nivelXP = state.niveles[meta.id]?.xp ?? 0;

  return (
    <div className={styles.runner} style={{ ['--acento' as string]: acento } as React.CSSProperties}>
      <Destellos />

      {step !== 'intro' && step !== 'completado' && (
        <NivelHUD
          n={meta.n}
          nombre={meta.nombre}
          totalXP={state.totalXP}
          progresoPct={progresoPct}
          seccion={SECCION_LABEL[step]}
        />
      )}

      <div className={styles.runnerBody}>
        {step === 'intro' && (
          <IntroNivel
            intro={contenido.intro}
            onStart={() => {
              startRef.current = Date.now();
              setStep('bloque1');
            }}
          />
        )}

        {step === 'bloque1' && (
          <BloqueView bloque={contenido.bloque1} onDone={() => onBloque('bloque1', 'minijuegoA')} />
        )}

        {step === 'minijuegoA' &&
          (contenido.minijuegoA.tipo === 'orden' ? (
            <Minijuego
              config={contenido.minijuegoA}
              onComplete={(r) => onMinijuego('minijuegoA', contenido.minijuegoA, r)}
              onNext={() => setStep('bloque2')}
            />
          ) : (
            <div className={styles.retoPanel}>
              <Minijuego
                config={contenido.minijuegoA}
                onComplete={(r) => onMinijuego('minijuegoA', contenido.minijuegoA, r)}
              />
              <ContinuarReto onNext={() => setStep('bloque2')} listo={mjHecho(state, meta.id, 'minijuegoA')} />
            </div>
          ))}

        {step === 'bloque2' && (
          <BloqueView bloque={contenido.bloque2} onDone={() => onBloque('bloque2', 'minijuegoB')} />
        )}

        {step === 'minijuegoB' &&
          (contenido.minijuegoB.tipo === 'orden' ? (
            <Minijuego
              config={contenido.minijuegoB}
              onComplete={(r) => onMinijuego('minijuegoB', contenido.minijuegoB, r)}
              onNext={() => setStep('bloqueFinal')}
            />
          ) : (
            <div className={styles.retoPanel}>
              <Minijuego
                config={contenido.minijuegoB}
                onComplete={(r) => onMinijuego('minijuegoB', contenido.minijuegoB, r)}
              />
              <ContinuarReto onNext={() => setStep('bloqueFinal')} listo={mjHecho(state, meta.id, 'minijuegoB')} />
            </div>
          ))}

        {step === 'bloqueFinal' && (
          <BloqueView bloque={contenido.bloqueFinal} onDone={() => onBloque('bloqueFinal', 'boss')} />
        )}

        {step === 'boss' && (
          <div className={styles.retoPanel}>
            <BossChallenge config={contenido.boss} onComplete={onBoss} />
          </div>
        )}

        {step === 'completado' && (
          <Celebracion
            cierre={contenido.cierre}
            xpNivel={nivelXP + XP.NIVEL}
            insignias={insigniasNivel}
            siguienteId={siguienteId}
          />
        )}
      </div>

      {/* Toasts de XP */}
      <div className={styles.xpLayer}>
        {xpToasts.map((t) => (
          <XPFloat key={t.id} toast={t} onDone={removeXP} />
        ))}
      </div>

      {/* Toasts de insignias (uno a la vez) */}
      {badgeQueue.length > 0 && (
        <BadgeUnlock
          badgeId={badgeQueue[0]}
          onDone={() => setBadgeQueue((q) => q.slice(1))}
        />
      )}
    </div>
  );
}

/** Fondo decorativo: olas suaves + campo de destellos (estrellas de 4 puntas). */
function Destellos() {
  const stars = [
    { x: 500, y: 60, s: 1.1 }, { x: 940, y: 40, s: 0.8 }, { x: 300, y: 150, s: 0.7 },
    { x: 1060, y: 190, s: 0.9 }, { x: 120, y: 260, s: 0.8 }, { x: 660, y: 120, s: 0.6 },
    { x: 40, y: 430, s: 0.7 }, { x: 1080, y: 470, s: 1 }, { x: 250, y: 560, s: 0.7 },
    { x: 900, y: 600, s: 0.8 }, { x: 560, y: 640, s: 0.6 }, { x: 1000, y: 90, s: 0.6 },
  ];
  return (
    <svg className={styles.runnerDeco} viewBox="0 0 1120 700" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* olas suaves */}
      <g className={styles.runnerOlas} fill="none" strokeLinecap="round">
        <path d="M-40 250 C 180 190, 360 300, 600 245 S 980 170, 1160 255" strokeWidth="2.5" opacity="0.5" />
        <path d="M-40 300 C 220 240, 430 350, 660 290 S 1010 220, 1160 300" strokeWidth="1.8" opacity="0.32" />
        <path d="M-40 560 C 200 500, 420 610, 660 550 S 1010 480, 1160 560" strokeWidth="2.2" opacity="0.4" />
      </g>
      {/* blobs difusos */}
      <g fill="currentColor" opacity="0.06">
        <ellipse cx="120" cy="120" rx="140" ry="90" />
        <ellipse cx="1010" cy="540" rx="150" ry="100" />
      </g>
      {/* estrellas */}
      {stars.map((st, i) => (
        <path
          key={i}
          d="M10 0C11 6 14 9 20 10C14 11 11 14 10 20C9 14 6 11 0 10C6 9 9 6 10 0Z"
          fill="currentColor"
          transform={`translate(${st.x - 10 * st.s} ${st.y - 10 * st.s}) scale(${st.s})`}
          opacity={0.35 + (i % 3) * 0.12}
        />
      ))}
    </svg>
  );
}

function mjHecho(
  state: ReturnType<typeof useInvestigacionProgress>['state'],
  nivelId: string,
  stepKey: string,
): boolean {
  return !!state.niveles[nivelId]?.pasosHechos.includes(stepKey);
}

/** Botón "Continuar" que aparece cuando el minijuego ya fue resuelto. */
function ContinuarReto({ onNext, listo }: { onNext: () => void; listo: boolean }) {
  if (!listo) return null;
  return (
    <button className={styles.retoContinuar} onClick={onNext}>
      Continuar →
    </button>
  );
}
