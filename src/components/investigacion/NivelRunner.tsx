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

        {step === 'minijuegoA' && (
          <div className={styles.retoPanel}>
            <Minijuego
              config={contenido.minijuegoA}
              onComplete={(r) => onMinijuego('minijuegoA', contenido.minijuegoA, r)}
            />
            <ContinuarReto onNext={() => setStep('bloque2')} listo={mjHecho(state, meta.id, 'minijuegoA')} />
          </div>
        )}

        {step === 'bloque2' && (
          <BloqueView bloque={contenido.bloque2} onDone={() => onBloque('bloque2', 'minijuegoB')} />
        )}

        {step === 'minijuegoB' && (
          <div className={styles.retoPanel}>
            <Minijuego
              config={contenido.minijuegoB}
              onComplete={(r) => onMinijuego('minijuegoB', contenido.minijuegoB, r)}
            />
            <ContinuarReto onNext={() => setStep('bloqueFinal')} listo={mjHecho(state, meta.id, 'minijuegoB')} />
          </div>
        )}

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
