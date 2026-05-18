'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import SubscribeModal from './SubscribeModal';
import type { PlanKey } from '@/lib/plans';
import styles from '@/styles/pricing.module.css';

interface PlanState {
  plan: 'free' | 'interno' | 'residente';
  isActive: boolean;
  expiresAt: string | null;
}

type Feature = string | { text: string; disabled: boolean };

type PlanCard = {
  name: string;
  price: string;
  period: string;
  priceSub?: string;
  features: Feature[];
  btnStyle: 'primary' | 'ghost';
  btnText: string;
  featured?: boolean;
  badge?: string;
  badgeStyle?: 'popular' | 'annual';
  action: 'free' | 'interno' | 'residente';
};

const plans: PlanCard[] = [
  {
    name: 'Gratuito',
    price: 'S/ 0',
    period: 'Para siempre',
    features: [
      '1 curso activo',
      'Lecciones básicas',
      'Quizzes de práctica',
      { text: 'Sílabo personalizado', disabled: true },
      { text: 'Acceso a todos los cursos', disabled: true },
    ],
    btnStyle: 'ghost',
    btnText: 'Empezar gratis',
    action: 'free',
  },
  {
    name: 'Interno',
    price: 'S/ 14',
    period: '/ mes',
    features: [
      'Todos los cursos',
      'Sílabo personalizado',
      'Quizzes ilimitados',
      'Seguimiento de progreso',
      'Soporte prioritario',
    ],
    btnStyle: 'primary',
    btnText: 'Empezar ahora',
    featured: true,
    badge: 'Popular',
    badgeStyle: 'popular',
    action: 'interno',
  },
  {
    name: 'Residente',
    price: 'S/ 11.90',
    period: '/ mes',
    priceSub: 'S/ 142.80 al año (pago único)',
    features: [
      'Todo lo del plan Interno',
      'Bloqueo de precio por 12 meses',
      'Exámenes simulacro',
      'Flashcards AI',
      'Comunidad exclusiva',
    ],
    btnStyle: 'ghost',
    btnText: 'Suscribirme al año',
    badge: 'Mejor precio anual',
    badgeStyle: 'annual',
    action: 'residente',
  },
];

export default function Pricing() {
  const router = useRouter();
  const { user } = useAuth();
  const authed = !!user;
  const [open, setOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<PlanKey>('interno');
  const [planState, setPlanState] = useState<PlanState | null>(null);

  useEffect(() => {
    if (!authed) {
      setPlanState(null);
      return;
    }
    let cancelled = false;
    fetch('/api/subscriptions/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json?.planState) return;
        setPlanState(json.planState as PlanState);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [authed]);

  async function handlePlanClick(action: PlanCard['action']) {
    if (action === 'free') {
      router.push(authed ? '/dashboard/home' : '/auth/login?signup=1');
      return;
    }
    if (action === 'interno' || action === 'residente') {
      if (!authed) {
        router.push('/auth/login?next=' + encodeURIComponent('/#precios'));
        return;
      }
      if (planState?.isActive) return;
      setActivePlan(action);
      setOpen(true);
    }
  }

  return (
    <section id="precios" className={styles.section}>
      <div className="section-inner reveal">
        <span className="section-tag">Planes y Precios</span>
        <h2 className="section-title">
          Invierte en tu
          <br />
          <em style={{ fontStyle: 'normal', color: 'var(--orange)' }}>
            carrera médica.
          </em>
        </h2>
        <p className="section-sub">
          Empieza por el mes. Cambia al anual cuando estés convencido.
        </p>
        <div className={styles.grid}>
          {plans.map((p, i) => {
            const isPremiumPlan = p.action === 'interno' || p.action === 'residente';
            const lockCtas = !!planState?.isActive && isPremiumPlan;
            const isCurrentPlan = lockCtas && planState?.plan === p.action;
            const lockedText = isCurrentPlan ? 'Tu plan actual' : 'Ya tienes plan activo';
            return (
              <div className={`${styles.card} ${p.featured ? styles.featured : ''}`} key={i}>
                {p.badge && (
                  <span
                    className={`${styles.badge} ${
                      p.badgeStyle === 'annual' ? styles.badgeAnnual : ''
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
                <div className={styles.planName}>{p.name}</div>
                <div className={styles.price}>
                  {p.price} <span>{p.period}</span>
                </div>
                {p.priceSub && <div className={styles.priceSub}>{p.priceSub}</div>}
                <ul className={styles.features}>
                  {p.features.map((f, j) => {
                    const disabled = typeof f !== 'string' && f.disabled;
                    const text = typeof f === 'string' ? f : f.text;
                    return (
                      <li key={j} className={disabled ? styles.disabled : ''}>
                        {text}
                      </li>
                    );
                  })}
                </ul>
                <button
                  className={`${styles.btn} ${
                    lockCtas
                      ? styles.btnDisabled
                      : p.btnStyle === 'primary'
                        ? styles.btnPrimary
                        : styles.btnGhost
                  }`}
                  onClick={() => handlePlanClick(p.action)}
                  disabled={lockCtas}
                  aria-disabled={lockCtas}
                >
                  {lockCtas ? lockedText : p.btnText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <SubscribeModal open={open} planKey={activePlan} onClose={() => setOpen(false)} />
    </section>
  );
}
