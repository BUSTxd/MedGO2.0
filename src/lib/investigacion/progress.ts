import type { ProgressState, NivelProgreso } from './types';
import { NIVELES } from './niveles';
import { XP } from './xp';

const STORAGE_KEY = 'medgo-investigacion-progress';
const VERSION = 1;

/** Estado inicial: el primer nivel desbloqueado, el resto bloqueado. */
export function defaultState(): ProgressState {
  const niveles: Record<string, NivelProgreso> = {};
  NIVELES.forEach((meta, i) => {
    niveles[meta.id] = {
      completado: false,
      desbloqueado: i === 0,
      xp: 0,
      pasosHechos: [],
    };
  });
  return { niveles, totalXP: 0, insignias: [], version: VERSION };
}

/** Rellena niveles nuevos que no existieran en un estado guardado antiguo. */
function reconcile(state: ProgressState): ProgressState {
  const base = defaultState();
  const niveles = { ...base.niveles };
  for (const id of Object.keys(niveles)) {
    if (state.niveles?.[id]) niveles[id] = { ...niveles[id], ...state.niveles[id] };
  }
  return {
    niveles,
    totalXP: state.totalXP ?? 0,
    insignias: Array.isArray(state.insignias) ? state.insignias : [],
    version: VERSION,
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProgressState;
      if (parsed && typeof parsed === 'object' && parsed.niveles) {
        return reconcile(parsed);
      }
    }
  } catch {}
  return defaultState();
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

/** Índice del nivel en el registro (para saber cuál es el siguiente). */
function nivelIndex(id: string): number {
  return NIVELES.findIndex((m) => m.id === id);
}

/**
 * Marca un nivel como completado (+XP de nivel), desbloquea el siguiente y
 * otorga "Investigador Completo" si ya están los 14. Devuelve el nuevo estado.
 */
export function completeLevel(state: ProgressState, id: string): ProgressState {
  const niveles = { ...state.niveles };
  const actual = niveles[id];
  if (!actual) return state;

  const yaEstaba = actual.completado;
  niveles[id] = { ...actual, completado: true, desbloqueado: true };

  // desbloquear siguiente
  const idx = nivelIndex(id);
  const sig = NIVELES[idx + 1];
  if (sig && niveles[sig.id]) {
    niveles[sig.id] = { ...niveles[sig.id], desbloqueado: true };
  }

  const insignias = [...state.insignias];
  const todosCompletos = NIVELES.every((m) => niveles[m.id]?.completado);
  if (todosCompletos && !insignias.includes('investigador-completo')) {
    insignias.push('investigador-completo');
  }

  const totalXP = state.totalXP + (yaEstaba ? 0 : XP.NIVEL);
  return { ...state, niveles, insignias, totalXP };
}

/** Suma XP al total global y al nivel indicado. */
export function addXP(state: ProgressState, id: string, amount: number): ProgressState {
  const niveles = { ...state.niveles };
  if (niveles[id]) niveles[id] = { ...niveles[id], xp: niveles[id].xp + amount };
  return { ...state, niveles, totalXP: state.totalXP + amount };
}

/** Registra un paso del flujo como hecho (idempotente). */
export function markStep(state: ProgressState, id: string, step: string): ProgressState {
  const niveles = { ...state.niveles };
  const actual = niveles[id];
  if (!actual) return state;
  if (actual.pasosHechos.includes(step)) return state;
  niveles[id] = { ...actual, pasosHechos: [...actual.pasosHechos, step] };
  return { ...state, niveles };
}

/** Otorga una insignia si no la tiene aún. */
export function awardBadge(state: ProgressState, badgeId: string): ProgressState {
  if (state.insignias.includes(badgeId)) return state;
  return { ...state, insignias: [...state.insignias, badgeId] };
}

export function isUnlocked(state: ProgressState, id: string): boolean {
  return !!state.niveles[id]?.desbloqueado;
}

export function resetProgress(): ProgressState {
  const fresh = defaultState();
  saveProgress(fresh);
  return fresh;
}
