'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { PLANES_NUEVOS, PLANS, planUnlocks, requisitoDe, type ProfilePlan, type PlanKey, type Requisito } from '@/lib/plans';
import { usePlan } from './PlanProvider';
import { trackEvent } from '@/lib/analytics';
import styles from '@/styles/lockedContent.module.css';

// El SDK de Mercado Pago es pesado: solo se descarga cuando se abre el modal,
// no al renderizar contenido bloqueado.
const SubscribeModal = dynamic(() => import('./SubscribeModal'), { ssr: false });
const ElegirPlan = dynamic(() => import('./planes/ElegirPlan'), { ssr: false });

/**
 * Dice a lo que va dentro si el contenido está tras el candado. Lo que se pinta
 * sin pasar por aquí es gratis para cualquiera: así el evento registra el
 * acceso tal como era en ese momento, con las reglas reales de cada página.
 */
const CandadoContext = createContext<false | 'abierto' | 'cerrado'>(false);

export function useDetrasDeCandado(): boolean {
  return !!useContext(CandadoContext);
}

/**
 * Detrás del candado y SIN el plan: lo que se pinta es el aperitivo difuminado.
 * Con el plan el material es suyo y se ve como cualquier otro (sin corona).
 */
export function useCandadoCerrado(): boolean {
  return useContext(CandadoContext) === 'cerrado';
}

interface PlanState {
  plan: ProfilePlan;
  isActive: boolean;
  allAccess?: boolean;
}

interface Props {
  /** El plan (legado) que ofrece la tarjeta. */
  requiredPlan: PlanKey;
  /** Lo que pide el contenido, si no basta con `requiredPlan` (un laboratorio es nivel completo). */
  requisito?: Requisito;
  planState: PlanState;
  isAuthed: boolean;
  /**
   * Si el contenido bloqueado se pinta detrás del velo como aperitivo.
   * En una clase sí (se intuye el material). En una sección entera **no**: un
   * laboratorio 3D montaría Three.js completo detrás del paywall, para que
   * nadie lo vea. Por defecto `true`, que es lo que hacen los cursos.
   */
  preview?: boolean;
  /** Título y texto de la tarjeta, cuando lo bloqueado no es una clase (p. ej. un banqueo). */
  titulo?: string;
  descripcion?: React.ReactNode;
  children: React.ReactNode;
}

export default function LockedContent({
  requiredPlan,
  requisito,
  planState,
  isAuthed,
  preview = true,
  titulo = 'Contenido bloqueado',
  descripcion,
  children,
}: Props) {
  const router = useRouter();
  const enEstudio = usePathname()?.startsWith('/estudio') ?? false;
  const clientPlan = usePlan();
  const [open, setOpen] = useState(false);

  // Server-rendered plan vs. plan vivo del Provider: basta con que UNO de los
  // dos habilite el contenido. Tras una compra exitosa, refreshPlan() actualiza
  // clientPlan al instante, sin esperar a que el Server Component re-renderice.
  // No se puede elegir "el más permisivo" comparando rangos: interno y ufbi
  // tienen el mismo rango en tramos distintos, y quedarse con uno de los dos
  // bloquearía contenido al que el otro sí da acceso.
  const pide = requisito ?? requiredPlan;
  const serverOk = planState.isActive && planUnlocks(planState.plan, pide);
  const clientOk = clientPlan.isActive && planUnlocks(clientPlan.plan, pide);
  const meetsRequirement = !!planState.allAccess || serverOk || clientOk;

  // Qué quiso abrir sin tener el plan: la ficha del admin lo lista aparte.
  const registrado = useRef(false);
  useEffect(() => {
    if (meetsRequirement || registrado.current) return;
    registrado.current = true;
    trackEvent('contenido_bloqueado', { plan: requiredPlan, origen: 'candado' });
  }, [meetsRequirement, requiredPlan]);

  // No desbloqueamos mientras el SubscribeModal está abierto: si el plan se
  // acaba de actualizar tras pagar, hay que mantener visible el receipt hasta
  // que el usuario lo cierre (clic en "Continuar" o en la X).
  if (meetsRequirement && !open) return <CandadoContext.Provider value="abierto">{children}</CandadoContext.Provider>;

  const plan = PLANS[requiredPlan];
  // Se ofrecen los planes nuevos (las tres tarjetas) en /estudio y en cuanto el legado
  // que pide el dashboard deja de venderse; si no, el legado de su tramo.
  const nuevos = enEstudio || !plan.aLaVenta;
  const desde = Math.min(...PLANES_NUEVOS.map((p) => p.amount));

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
    trackEvent('pago_abierto', { plan: requiredPlan, origen: 'candado' });
    setOpen(true);
  }

  return (
    <div className={`${styles.wrap} ${preview ? '' : styles.wrapSolo}`}>
      {preview && (
        <div className={styles.children} aria-hidden>
          <CandadoContext.Provider value="cerrado">{children}</CandadoContext.Provider>
        </div>
      )}

      <div className={styles.overlay}>
        <div className={styles.card}>
          <span className={styles.glow} aria-hidden />

          <div className={styles.lockIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>

          <h2 className={styles.title}>{titulo}</h2>
          <p className={styles.desc}>
            {descripcion ?? (nuevos ? (
              <>Elige un plan de MedGO para abrir esta clase y todo lo que estudias aquí.</>
            ) : (
              <>
                Suscríbete al plan <strong>{plan.label}</strong> para acceder a esta clase y al resto de{' '}
                {plan.track === 'basico'
                  ? 'los cursos del ciclo básico'
                  : 'los cursos de la Facultad de Medicina'}.
              </>
            ))}
          </p>

          {nuevos ? (
            <span className={styles.priceTag}>
              <span>Desde</span>
              <strong>S/ {desde.toFixed(2)}</strong>
              <span>/ mes</span>
            </span>
          ) : (
            <span className={styles.priceTag}>
              <strong>S/ {plan.amount.toFixed(2)}</strong>
              <span>/ {plan.durationDays === 30 ? 'mes' : 'año'}</span>
            </span>
          )}

          <div>
            <button className={styles.cta} onClick={handleClick}>
              {nuevos ? 'Ver los planes' : 'Desbloquear ahora'}
            </button>
          </div>

          {!nuevos && <a href="/#precios" className={styles.smallLink}>Ver todos los planes</a>}
        </div>
      </div>

      {nuevos
        ? open && <ElegirPlan requisito={requisitoDe(pide)} onClose={() => setOpen(false)} />
        : <SubscribeModal open={open} planKey={requiredPlan} onClose={() => setOpen(false)} />}
    </div>
  );
}
