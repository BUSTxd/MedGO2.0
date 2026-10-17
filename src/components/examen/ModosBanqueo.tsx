'use client';

import { useState, type ComponentProps } from 'react';
import dynamic from 'next/dynamic';
import ExamRunner from '../ExamRunner';
import RuletaTemas, { type TemaRuleta } from './RuletaTemas';
import { usePlan } from '../PlanProvider';
import { planUnlocks } from '@/lib/plans';
import styles from '@/styles/modosBanqueo.module.css';

const SubscribeModal = dynamic(() => import('../SubscribeModal'), { ssr: false });

type RunnerProps = ComponentProps<typeof ExamRunner>;

interface Props {
  /** El runner del modo suelto, tal cual lo arma `ExamenDeCurso`. */
  runner: RunnerProps;
  /** Banqueo con TODAS las preguntas: el modo por temas lo filtra por `tema`. */
  claveTemas: string;
  /** Temas en orden de prioridad, con sus cifras (`*-conteo.ts`). */
  temas: TemaRuleta[];
}

/**
 * Dos maneras de hacer el mismo banqueo: «Suelto» (los módulos, como siempre) y
 * «Por temas» (ruleta → solo las preguntas de un tema, de todos los módulos).
 * Las dos leen el mismo texto, las mismas explicaciones y los mismos flujos: el
 * agregado sale del mismo origen que los módulos (`ensamblar.mjs`).
 */
export default function ModosBanqueo({ runner, claveTemas, temas }: Props) {
  const [modo, setModo] = useState<'suelto' | 'temas'>('suelto');
  const [tema, setTema] = useState<TemaRuleta | null>(null);
  const [pagar, setPagar] = useState(false);

  // Mismo criterio que el runner: plan del servidor o plan vivo tras pagar.
  const planVivo = usePlan();
  const s = runner.suscripcion;
  const acceso = !s
    || !!s.estado.allAccess
    || (s.estado.isActive && planUnlocks(s.estado.plan, s.plan))
    || (planVivo.isActive && planUnlocks(planVivo.plan, s.plan));

  const cambiar = (m: 'suelto' | 'temas') => {
    setModo(m);
    setTema(null);
  };

  return (
    <div className={styles.modos}>
      <div className={styles.selector} role="tablist" aria-label="Modo del banqueo">
        <button type="button" role="tab" aria-selected={modo === 'suelto'}
          className={modo === 'suelto' ? styles.opcionActiva : styles.opcion} onClick={() => cambiar('suelto')}>
          Suelto
        </button>
        <button type="button" role="tab" aria-selected={modo === 'temas'}
          className={modo === 'temas' ? styles.opcionActiva : styles.opcion} onClick={() => cambiar('temas')}>
          Por temas
        </button>
      </div>

      {modo === 'suelto' && <ExamRunner {...runner} />}

      {modo === 'temas' && !tema && (
        <RuletaTemas temas={temas} acceso={acceso} onEmpezar={setTema} onPagar={() => setPagar(true)} />
      )}

      {modo === 'temas' && tema && (
        <>
          <button type="button" className={styles.cambiarTema} onClick={() => setTema(null)}>
            ← Volver a la ruleta
          </button>
          <ExamRunner
            key={tema.id}
            {...runner}
            examKey={claveTemas}
            groupKeys={undefined}
            groupLabels={undefined}
            groupHints={undefined}
            fallbackTitle={`Por temas · ${tema.label}`}
            filtroTema={tema.id}
            suscripcion={s ? { ...s, etapasDePago: undefined } : undefined}
          />
        </>
      )}

      {pagar && s && <SubscribeModal open planKey={s.plan} onClose={() => setPagar(false)} />}
    </div>
  );
}
