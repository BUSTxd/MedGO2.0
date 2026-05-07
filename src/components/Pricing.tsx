'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import SubscribeModal from './SubscribeModal';
import type { PlanKey } from '@/lib/plans';
import styles from '@/styles/pricing.module.css';

type Feature = string | { text: string; disabled: boolean };

type PlanCard = {
  name: string;
  price: string;
  period: string;
  features: Feature[];
  btnStyle: 'primary' | 'ghost';
  btnText: string;
  featured?: boolean;
  badge?: string;
  action: 'free' | 'interno' | 'soon';
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
    action: 'interno',
  },
  {
    name: 'Residente',
    price: 'S/ 11.90',
    period: '/ 1 año · Ahorra 15%',
    features: [
      'Todo lo de Estudiante',
      'Exámenes simulacro',
      'Flashcards AI',
      'Descarga offline',
      'Comunidad exclusiva',
    ],
    btnStyle: 'ghost',
    btnText: 'Elegir Pro',
    action: 'soon',
  },
];

export default function Pricing() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<PlanKey>('interno');
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handlePlanClick(action: PlanCard['action']) {
    if (action === 'soon') {
      setComingSoon(true);
      setTimeout(() => setComingSoon(false), 2400);
      return;
    }
    if (action === 'free') {
      router.push(authed ? '/dashboard/home' : '/auth/login?signup=1');
      return;
    }
    if (action === 'interno') {
      if (!authed) {
        router.push('/auth/login?next=' + encodeURIComponent('/#precios'));
        return;
      }
      setActivePlan('interno');
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
        <p className="section-sub">Sin contratos largos. Cancela cuando quieras.</p>
        <div className={styles.grid}>
          {plans.map((p, i) => (
            <div className={`${styles.card} ${p.featured ? styles.featured : ''}`} key={i}>
              {p.badge && <span className={styles.badge}>{p.badge}</span>}
              <div className={styles.planName}>{p.name}</div>
              <div className={styles.price}>
                {p.price} <span>{p.period}</span>
              </div>
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
                  p.btnStyle === 'primary' ? styles.btnPrimary : styles.btnGhost
                }`}
                onClick={() => handlePlanClick(p.action)}
              >
                {p.action === 'soon' && comingSoon ? 'Próximamente · 2026' : p.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      <SubscribeModal open={open} planKey={activePlan} onClose={() => setOpen(false)} />
    </section>
  );
}
