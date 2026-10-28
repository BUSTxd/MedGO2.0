'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { planUnlocks, type PlanKey, type Requisito } from '@/lib/plans';
import { ofertasPara } from './oferta';
import { usePasarela } from './usePasarela';
import { CREEM_COBROS_ACTIVOS } from '@/lib/pasarela';
import styles from './elegirPlan.module.css';

// El SDK de Mercado Pago sólo baja si alguien elige un plan que ya está a la venta.
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

/**
 * Los tres planes como en SanarFlix: Residente primero y destacado («MÁS
 * ELEGIDO»), Especialista al medio y Visitante al final, apagado. Con
 * `requisito`, el plan que no abre lo que el alumno quiso ver sale
 * deshabilitado («No incluye esto»).
 *
 * Mientras un plan no esté a la venta (`aLaVenta`, cuando existan sus planes en
 * Mercado Pago), elegirlo solo avisa de que los pagos llegan pronto.
 */
export default function ElegirPlan({ requisito, onClose }: { requisito?: Requisito; onClose: () => void }) {
  const [comprar, setComprar] = useState<PlanKey | null>(null);
  const [elegida] = usePasarela();
  const pasarela = CREEM_COBROS_ACTIVOS ? elegida : 'mercadopago';
  const [pronto, setPronto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  // Esc cierra (sin que la tecla llegue a la interfaz de detrás) y el foco entra al diálogo.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || comprar) return;
      e.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener('keydown', tecla, true);
    return () => window.removeEventListener('keydown', tecla, true);
  }, [comprar, onClose]);
  useEffect(() => { caja.current?.querySelector<HTMLElement>('button:not(:disabled)')?.focus(); }, []);

  const elegir = (key: PlanKey, aLaVenta: boolean) => {
    if (aLaVenta) setComprar(key);
    else setPronto(true);
  };

  if (comprar) return <SubscribeModal open planKey={comprar} onClose={() => { setComprar(null); onClose(); }} />;

  return createPortal(
    <div className={styles.velo} onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={caja} className={styles.caja} role="dialog" aria-modal="true" aria-labelledby="elegir-plan-titulo">
        <button type="button" className={styles.cerrar} aria-label="Cerrar" onClick={onClose}>×</button>
        <h2 id="elegir-plan-titulo" className={styles.titulo}>Elige tu plan</h2>
        <p className={styles.sub}>Todo MedGO se abre con un plan. Cuanto más tiempo te quedas, menos pagas al mes.</p>
        <div className={styles.rejilla}>
          {ofertasPara(pasarela ?? 'mercadopago').map((o) => {
            const p = o.plan;
            const noAbre = !!requisito && !planUnlocks(p.key, requisito);
            return (
              <article
                key={p.key}
                className={`${styles.tarjeta} ${p.destacado ? styles.destacada : ''} ${p.nivel === 'base' ? styles.apagada : ''}`}
                aria-labelledby={`plan-${p.key}`}
              >
                {p.destacado && <span className={styles.cinta}>{p.destacado}</span>}
                <h3 id={`plan-${p.key}`} className={styles.nombre}>{p.label}</h3>
                <p className={styles.acceso}>{o.acceso} <span>({o.tipo})</span></p>
                <p className={styles.precio}><strong>{o.moneda} {o.importe}</strong><span>/{o.periodo}</span></p>
                <p className={styles.cobro}>{o.cobro}</p>
                <ul className={styles.lista}>
                  {o.incluye.map((i) => (
                    <li key={i.texto} className={i.incluido ? undefined : styles.noIncluye}>
                      <span aria-hidden="true">{i.incluido ? '✓' : '–'}</span>
                      {i.texto}{!i.incluido && <span className={styles.oculto}> (no incluido)</span>}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={styles.boton}
                  disabled={noAbre}
                  onClick={() => elegir(p.key, p.aLaVenta)}
                >
                  {noAbre ? 'No incluye esto' : 'Empieza ahora'}
                </button>
              </article>
            );
          })}
        </div>
        <p className={styles.pie} role="status">
          {pronto
            ? 'Muy pronto: estamos activando los pagos de los planes nuevos. Te avisaremos.'
            : <>Pago seguro con {pasarela === 'creem' ? 'Creem' : 'Mercado Pago'}. Al suscribirte aceptas los <Link href="/terminos">Términos y condiciones</Link>.</>}
        </p>
      </div>
    </div>,
    document.body,
  );
}
