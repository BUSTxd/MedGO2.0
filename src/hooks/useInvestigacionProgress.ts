'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProgressState } from '@/lib/investigacion/types';
import {
  loadProgress,
  saveProgress,
  defaultState,
  completeLevel as _completeLevel,
  addXP as _addXP,
  markStep as _markStep,
  awardBadge as _awardBadge,
} from '@/lib/investigacion/progress';

/**
 * Estado de progreso del sistema de Investigación con persistencia en
 * localStorage. Sigue el patrón de AnatExam: hidrata en useEffect con un flag
 * y solo persiste después de hidratar (evita pisar lo guardado en el 1er render).
 */
export function useInvestigacionProgress() {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveProgress(state);
  }, [state, hydrated]);

  // Reflejar cambios hechos en otras pestañas / tras volver al mapa.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'medgo-investigacion-progress') setState(loadProgress());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const completeLevel = useCallback((id: string) => setState((s) => _completeLevel(s, id)), []);
  const addXP = useCallback((id: string, amount: number) => setState((s) => _addXP(s, id, amount)), []);
  const markStep = useCallback((id: string, step: string) => setState((s) => _markStep(s, id, step)), []);
  const awardBadge = useCallback((badgeId: string) => setState((s) => _awardBadge(s, badgeId)), []);

  const isUnlocked = useCallback((id: string) => !!state.niveles[id]?.desbloqueado, [state]);

  return { state, hydrated, completeLevel, addXP, markStep, awardBadge, isUnlocked };
}

/**
 * Detecta insignias recién agregadas comparando el array previo con el actual,
 * para disparar el toast de BadgeUnlock una sola vez.
 */
export function useNewBadges(insignias: string[]): string[] {
  const prev = useRef<string[] | null>(null);
  const [nuevas, setNuevas] = useState<string[]>([]);
  useEffect(() => {
    if (prev.current === null) {
      prev.current = insignias;
      return;
    }
    const added = insignias.filter((b) => !prev.current!.includes(b));
    prev.current = insignias;
    if (added.length) setNuevas(added);
  }, [insignias]);
  return nuevas;
}
