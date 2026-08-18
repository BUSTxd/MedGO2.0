'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from './AuthProvider';
import HeartIcon from './icons/HeartIcon';
import MicroscopeIcon from './icons/MicroscopeIcon';
import type { PlanKey } from '@/lib/plans';
import styles from '@/styles/pricing.module.css';

// El SDK de Mercado Pago solo se carga al abrir el modal de suscripción.
const SubscribeModal = dynamic(() => import('./SubscribeModal'), { ssr: false });

interface PlanState {
  plan: 'free' | PlanKey;
  isActive: boolean;
  expiresAt: string | null;
}

type Feature = string | { text: string; disabled: boolean };

/** Los dos tramos de la carrera. El alumno elige el suyo antes de ver precios,
 *  para que nunca compare el de UFBI con el de la Facultad de Medicina: son
 *  contenidos distintos y ponerlos lado a lado sugiere una jerarquía falsa. */
type Track = 'basico' | 'medicina';

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
  badgeStyle?: 'popular' | 'annual' | 'discount';
  action: 'free' | PlanKey;
};

/** El estilo base `.badge` va siempre; esto solo repinta el fondo. */
const BADGE_CLASS: Record<NonNullable<PlanCard['badgeStyle']>, string> = {
  popular: '',
  annual: styles.badgeAnnual,
  discount: styles.badgeDiscount,
};

const TRACKS: { key: Track; label: string; sub: string }[] = [
  { key: 'basico',   label: '1.er año',      sub: 'Ciencias Básicas · UFBI' },
  { key: 'medicina', label: '2.º a 7.º año', sub: 'Facultad de Medicina' },
];

const FREE_CARD: PlanCard = {
  name: 'Gratuito',
  price: 'S/ 0',
  period: 'Para siempre',
  features: [
    'Cursos limitados',
    'Calculadora de promedio',
    'Lecciones básicas',
    'Quizzes de práctica',
    { text: 'Sílabo personalizado', disabled: true },
    { text: 'Acceso a todos los cursos', disabled: true },
    { text: 'Modelos 3D', disabled: true },
    { text: 'Resúmenes y trabajos', disabled: true },
  ],
  btnStyle: 'ghost',
  btnText: 'Empezar gratis',
  action: 'free',
};

const PLANS_BY_TRACK: Record<Track, PlanCard[]> = {
  basico: [
    FREE_CARD,
    {
      name: 'UFBI',
      price: 'S/ 19.70',
      period: '/ mes',
      priceSub: 'Los 6 cursos de tu ciclo',
      features: [
        'Biología Celular, Física y Química Orgánica',
        'Ciencias Sociales, Comunicación y Cultura Ambiental (beta)',
        'Sílabo personalizado',
        'Quizzes ilimitados (beta)',
        'Laboratorios y simulaciones',
      ],
      btnStyle: 'primary',
      btnText: 'Empezar ahora',
      featured: true,
      badge: 'Nuevo',
      badgeStyle: 'popular',
      action: 'ufbi',
    },
    {
      // Se anuncia mensualizado (igual que Residente) para que se compare
      // contra los S/ 19.70 de arriba sin hacer cuentas; el cobro real es el
      // del priceSub. S/ 189 = 80 % de 12 × 19.70 (236.40) y 189 / 12 = 15.75
      // exacto: el badge canta ese 20 %, así que tocar un precio obliga a
      // rehacer los otros dos y el importe de `PLANS` en `src/lib/plans.ts`.
      name: 'UFBI Anual',
      price: 'S/ 15.75',
      period: '/ mes',
      priceSub: 'S/ 189 al año (pago único)',
      features: [
        'Todo lo del plan UFBI',
        'Obtén un 20% de descuento',
        'Acceso anticipado a nuevo contenido',
        'Acceso anticipado a simulaciones',
        'Sin renovaciones mensuales',
      ],
      btnStyle: 'ghost',
      btnText: 'Suscribirme al año',
      badge: '20% de descuento',
      badgeStyle: 'discount',
      action: 'ufbi-anual',
    },
  ],
  medicina: [
    FREE_CARD,
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
        'Resúmenes y trabajos',
        'Modelos 3D',
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
        'Flashcards',
        'Acceso anticipado a simulaciones',
      ],
      btnStyle: 'ghost',
      btnText: 'Suscribirme al año',
      badge: 'Mejor precio anual',
      badgeStyle: 'annual',
      action: 'residente',
    },
  ],
};

export default function Pricing() {
  const router = useRouter();
  const { user } = useAuth();
  const authed = !!user;
  const [open, setOpen] = useState(false);
  const [activePlan, setActivePlan] = useState<PlanKey>('interno');
  const [planState, setPlanState] = useState<PlanState | null>(null);
  const [track, setTrack] = useState<Track>('medicina');

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
        const next = json.planState as PlanState;
        setPlanState(next);
        // Si ya paga un plan, abrimos su tramo para que vea el suyo marcado
        // como actual en vez del tramo por defecto.
        if (next.plan === 'ufbi' || next.plan === 'ufbi-anual') setTrack('basico');
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
    if (!authed) {
      router.push('/auth/login?next=' + encodeURIComponent('/#precios'));
      return;
    }
    if (planState?.isActive) return;
    setActivePlan(action);
    setOpen(true);
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
          Elige tu año. Cada tramo se cursa en una facultad distinta y tiene su propio plan.
        </p>

        {/* Switch día/noche: riel en píldora + perilla circular que viaja de un
            extremo al otro. El riel cambia de color y el ícono visible queda en
            el lado opuesto a la perilla, indicando el tramo activo. */}
        <div className={styles.trackToggle}>
          {/* Orden explícito, no un .map(): el switch va EN MEDIO de las dos
              etiquetas, y cada una queda del lado al que manda la perilla. */}
          <button
            type="button"
            aria-pressed={track === 'basico'}
            className={`${styles.trackSide} ${styles.trackSideLeft} ${
              track === 'basico' ? styles.trackSideActive : ''
            }`}
            onClick={() => setTrack('basico')}
          >
            <span className={styles.trackLabel}>{TRACKS[0].label}</span>
            <span className={styles.trackSub}>{TRACKS[0].sub}</span>
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={track === 'medicina'}
            aria-label="Cambiar de tramo: 1.er año o 2.º a 7.º año"
            className={styles.switch}
            data-track={track}
            onClick={() => setTrack((t) => (t === 'basico' ? 'medicina' : 'basico'))}
          >
            <span className={styles.switchIconLeft} aria-hidden>
              <HeartIcon size={17} white />
            </span>
            <span className={styles.switchIconRight} aria-hidden>
              <MicroscopeIcon size={17} />
            </span>
            <span className={styles.switchKnob} aria-hidden />
          </button>

          <button
            type="button"
            aria-pressed={track === 'medicina'}
            className={`${styles.trackSide} ${styles.trackSideRight} ${
              track === 'medicina' ? styles.trackSideActive : ''
            }`}
            onClick={() => setTrack('medicina')}
          >
            <span className={styles.trackLabel}>{TRACKS[1].label}</span>
            <span className={styles.trackSub}>{TRACKS[1].sub}</span>
          </button>
        </div>

        {/* key={track} fuerza el remontaje para que la animación de entrada de
            las tarjetas se reproduzca en cada cambio de tramo. */}
        <div key={track} data-track={track} className={styles.grid}>
          {PLANS_BY_TRACK[track].map((p, i) => {
            const isPremiumPlan = p.action !== 'free';
            const lockCtas = !!planState?.isActive && isPremiumPlan;
            const isCurrentPlan = lockCtas && planState?.plan === p.action;
            const lockedText = isCurrentPlan ? 'Tu plan actual' : 'Ya tienes plan activo';
            return (
              <div
                className={`${styles.card} ${p.featured ? styles.featured : ''}`}
                key={p.action}
                style={{ '--i': i } as React.CSSProperties}
              >
                {p.badge && (
                  <span
                    className={`${styles.badge} ${
                      p.badgeStyle ? BADGE_CLASS[p.badgeStyle] : ''
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
