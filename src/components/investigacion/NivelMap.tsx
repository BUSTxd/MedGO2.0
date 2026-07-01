'use client';
import Link from 'next/link';
import { NIVELES } from '@/lib/investigacion/niveles';
import { INSIGNIAS } from '@/lib/investigacion/badges';
import { useInvestigacionProgress } from '@/hooks/useInvestigacionProgress';
import SavePointNode, { type EstadoNodo } from './SavePointNode';
import Icono from './Icono';
import styles from '@/styles/investigacion.module.css';

const Y_SPACING = 132;
const Y_START = 76;
const AMPLITUD = 30; // % de desplazamiento horizontal del serpenteo

function xPct(i: number): number {
  return 50 + AMPLITUD * Math.sin(i * 0.72);
}

export default function NivelMap() {
  const { state, hydrated } = useInvestigacionProgress();

  const nodos = NIVELES.map((meta, i) => {
    const p = state.niveles[meta.id];
    const estado: EstadoNodo = p?.completado
      ? 'completado'
      : p?.desbloqueado
        ? 'desbloqueado'
        : 'bloqueado';
    return { meta, i, estado, x: xPct(i), y: Y_START + i * Y_SPACING };
  });

  const alturaTotal = Y_START + NIVELES.length * Y_SPACING;

  // Path del camino a través de los centros de los nodos.
  const pathD = nodos
    .map((nd, idx) => `${idx === 0 ? 'M' : 'L'} ${nd.x} ${nd.y}`)
    .join(' ');

  const insigniasObtenidas = hydrated ? state.insignias : [];

  return (
    <div className={styles.mapaScreen}>
      {/* Resumen de progreso */}
      <div className={styles.mapaResumen}>
        <div className={styles.mapaXP}>
          <span className={styles.mapaXPValor}>{hydrated ? state.totalXP : 0}</span>
          <span className={styles.mapaXPLabel}>XP totales</span>
        </div>
        <div className={styles.mapaInsignias}>
          {INSIGNIAS.map((ins) => {
            const tiene = insigniasObtenidas.includes(ins.id);
            return (
              <span
                key={ins.id}
                className={`${styles.mapaInsignia} ${tiene ? styles.mapaInsigniaOn : ''}`}
                title={`${ins.nombre} — ${ins.descripcion}`}
              >
                <Icono name={ins.icono} />
              </span>
            );
          })}
        </div>
      </div>

      {/* Camino serpenteante */}
      <div className={styles.mapaCamino} style={{ height: alturaTotal }}>
        <svg
          className={styles.mapaPath}
          viewBox={`0 0 100 ${alturaTotal}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={pathD}
            fill="none"
            stroke="var(--inv-teal, #2CA9BC)"
            strokeWidth="3"
            strokeDasharray="2 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity="0.55"
          />
        </svg>

        {nodos.map((nd) => {
          const abrible = nd.meta.disponible && nd.estado !== 'bloqueado';
          const nodo = (
            <SavePointNode n={nd.meta.n} estado={nd.estado} nombre={nd.meta.nombre} />
          );
          return (
            <div
              key={nd.meta.id}
              className={styles.mapaNodoPos}
              style={{ left: `${nd.x}%`, top: nd.y }}
            >
              {abrible ? (
                <Link href={`/dashboard/investigacion/${nd.meta.id}`} className={styles.mapaNodoLink}>
                  {nodo}
                </Link>
              ) : (
                <div
                  className={styles.mapaNodoLocked}
                  title={nd.meta.disponible ? 'Completa el nivel anterior' : 'Próximamente'}
                >
                  {nodo}
                  {!nd.meta.disponible && <span className={styles.mapaProx}>Próximamente</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
