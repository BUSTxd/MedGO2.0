import 'server-only';
import { cache } from 'react';
import { createClient } from './supabase/server';
import { getUserPlanState, type PlanState } from './plans';

/**
 * Versión cacheada por request: layout, pages y components que la llamen
 * dentro del mismo render comparten una sola consulta a Supabase.
 */
export const getCachedPlanState = cache(async (): Promise<PlanState> => {
  const supabase = await createClient();
  return getUserPlanState(supabase);
});
