'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ProfilePlan } from '@/lib/plans';

export interface ClientPlanState {
  plan: ProfilePlan;
  isActive: boolean;
  expiresAt: string | null;
}

interface PlanContextValue extends ClientPlanState {
  refreshPlan: () => Promise<ClientPlanState>;
}

const PlanContext = createContext<PlanContextValue>({
  plan: 'free',
  isActive: false,
  expiresAt: null,
  refreshPlan: async () => ({ plan: 'free', isActive: false, expiresAt: null }),
});

interface ApiSubscription {
  plan_key?: string;
  status?: string;
  next_payment_date?: string | null;
}

function deriveClientState(sub: ApiSubscription | null): ClientPlanState {
  if (!sub || sub.status !== 'authorized') {
    return { plan: 'free', isActive: false, expiresAt: null };
  }
  const plan = (sub.plan_key === 'interno' || sub.plan_key === 'residente')
    ? sub.plan_key as ProfilePlan
    : 'free';
  const expiresAt = sub.next_payment_date ?? null;
  const isActive = plan !== 'free'
    && (expiresAt ? new Date(expiresAt).getTime() > Date.now() : false);
  return { plan, isActive, expiresAt };
}

export function PlanProvider({
  value,
  children,
}: {
  value: ClientPlanState;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ClientPlanState>(value);

  // El servidor manda la verdad: si re-renderiza con un planState distinto
  // (por ejemplo tras router.refresh() o revalidatePath), sincronizamos.
  useEffect(() => {
    setState(value);
  }, [value.plan, value.isActive, value.expiresAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshPlan = useCallback(async () => {
    try {
      const res = await fetch('/api/subscriptions/me', { cache: 'no-store' });
      if (!res.ok) return state;
      const json = await res.json();
      const next = deriveClientState(json.subscription ?? null);
      setState(next);
      return next;
    } catch {
      return state;
    }
  }, [state]);

  return (
    <PlanContext.Provider value={{ ...state, refreshPlan }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
