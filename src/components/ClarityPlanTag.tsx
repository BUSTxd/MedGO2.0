'use client';

import { useEffect } from 'react';
import { usePlan } from './PlanProvider';

/**
 * Etiqueta la sesión de Clarity con el plan del usuario (`free` / `interno` /
 * `residente`). Vive DENTRO del árbol del dashboard porque usePlan() solo existe
 * bajo el PlanProvider (montado en DashboardWrapper) — en la landing pública no
 * hay plan que etiquetar.
 *
 * Con esta etiqueta, en el panel de Clarity se filtran heatmaps y grabaciones
 * por plan → comparar visualmente cómo interactúa un premium vs un free.
 *
 * Si Clarity no cargó (sin consentimiento o sin NEXT_PUBLIC_CLARITY_ID),
 * window.clarity nunca aparece y el intervalo se detiene solo: no-op silencioso.
 */
export default function ClarityPlanTag() {
  const { plan } = usePlan();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let tries = 0;
    const id = setInterval(() => {
      if (window.clarity) {
        window.clarity('set', 'plan', plan);
        clearInterval(id);
      } else if (++tries > 20) {
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
  }, [plan]);

  return null;
}
