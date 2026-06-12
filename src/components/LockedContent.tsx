'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { PLANS, planRank, type ProfilePlan, type PlanKey } from '@/lib/plans';
import { usePlan } from './PlanProvider';
import styles from '@/styles/lockedContent.module.css';

// El SDK de Mercado Pago es pesado: solo se descarga cuando se abre el modal,
// no al renderizar contenido bloqueado.
const SubscribeModal = dynamic(() => import('./SubscribeModal'), { ssr: false });

interface PlanState {
  plan: ProfilePlan;
  isActive: boolean;
}

interface Props {
  requiredPlan: PlanKey;
  planState: PlanState;
  isAuthed: boolean;
  children: React.ReactNode;
}

export default function LockedContent({ requiredPlan, planState, isAuthed, children }: Props) {
  const router = useRouter();
  const clientPlan = usePlan();
  const [open, setOpen] = useState(false);

  // Server-rendered plan vs. plan vivo del Provider: usamos el más permisivo.
  // Tras una compra exitosa, refreshPlan() actualiza clientPlan al instante,
  // sin esperar a que el Server Component se re-renderice.
  const effectivePlan: ProfilePlan =
    planRank(clientPlan.plan) > planRank(planState.plan) ? clientPlan.plan : planState.plan;
  const effectiveActive = planState.isActive || clientPlan.isActive;

  const meetsRequirement =
    effectiveActive && planRank(effectivePlan) >= planRank(requiredPlan);

  // No desbloqueamos mientras el SubscribeModal está abierto: si el plan se
  // acaba de actualizar tras pagar, hay que mantener visible el receipt hasta
  // que el usuario lo cierre (clic en "Continuar" o en la X).
  if (meetsRequirement && !open) return <>{children}</>;

  const plan = PLANS[requiredPlan];

  async function handleClick() {
    if (!isAuthed) {
      // Double-check on click in case session changed.
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login?next=' + encodeURIComponent(window.location.pathname));
        return;
      }
    }
    setOpen(true);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.children} aria-hidden>{children}</div>

      <div className={styles.overlay}>
        <div className={styles.card}>
          <span className={styles.glow} aria-hidden />

          <div className={styles.lockIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>

          <h2 className={styles.title}>Contenido bloqueado</h2>
          <p className={styles.desc}>
            Suscríbete al plan <strong>{plan.label}</strong> para acceder a esta clase y al resto de Microbiología.
          </p>

          <span className={styles.priceTag}>
            <strong>S/ {plan.amount.toFixed(2)}</strong>
            <span>/ {plan.durationDays === 30 ? 'mes' : 'año'}</span>
          </span>

          <div>
            <button className={styles.cta} onClick={handleClick}>
              Desbloquear ahora
            </button>
          </div>

          <a href="/#precios" className={styles.smallLink}>Ver todos los planes</a>
        </div>
      </div>

      <SubscribeModal open={open} planKey={requiredPlan} onClose={() => setOpen(false)} />
    </div>
  );
}
