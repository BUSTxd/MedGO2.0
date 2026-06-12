'use client';
// Barra lateral de controles: modo Simple/Avanzado, selectores colapsables de fármacos
// y enfermedades (arriba del todo) con su SITIO DE ACCIÓN (segmento + proteínas diana),
// leyenda de FORMAS (taxonomía de mecanismos) y leyenda de MOLÉCULAS. El contenedor y
// el scroll los provee NefronSimulator.

import { useState } from 'react';
import type { Mechanism, SegmentId } from './engine/types';
import { MECHANISM_LABEL, MECHANISM_ORDER } from './engine/simulate';
import { DRUG_LIST } from '@/lib/data/nefron/drugs';
import { DISEASE_LIST } from '@/lib/data/nefron/diseases';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import { SUBSTANCES, type Substance } from '@/lib/data/nefron/substances';
import styles from '@/styles/nefronInteractivo.module.css';

export interface ControlsProps {
  simple: boolean;
  onSimpleToggle: (v: boolean) => void;
  hasPerturbation: boolean;
  onReset: () => void;
  activeDrugId: string | null;
  activeDiseaseId: string | null;
  onSelectDrug: (id: string, segmentoId: SegmentId) => void;
  onSelectDisease: (id: string, segmentoId: SegmentId) => void;
}

type SectionKey = 'formas' | 'sustancias' | 'farmacos' | 'enfermedades';

const LEGEND_SUBS: Substance[] = [
  SUBSTANCES.na, SUBSTANCES.k, SUBSTANCES.cl, SUBSTANCES.hco3, SUBSTANCES.h,
  SUBSTANCES.ca, SUBSTANCES.mg, SUBSTANCES.agua, SUBSTANCES.glucosa, SUBSTANCES.urea,
  SUBSTANCES.aniorg, SUBSTANCES.catorg,
];

/** Lista de siglas diana a partir de los ids de transportador. */
function targetSiglas(ids: string[]): string {
  const s = ids.map((id) => TRANSPORTERS[id]?.sigla).filter(Boolean);
  return s.length ? s.join(' · ') : '—';
}

export default function ControlsPanel(p: ControlsProps) {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    formas: false,
    sustancias: false,
    farmacos: false,
    enfermedades: false,
  });

  const toggleSection = (k: SectionKey) => setSections((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className={styles.ctrlStack}>
      {/* Modo de vista */}
      <div className={styles.ctrlGroup}>
        <span className={styles.ctrlLabel}>Modo</span>
        <div className={styles.segmented}>
          <button className={`${styles.segBtn} ${p.simple ? styles.segBtnActive : ''}`} onClick={() => p.onSimpleToggle(true)}>
            Simple
          </button>
          <button className={`${styles.segBtn} ${!p.simple ? styles.segBtnActive : ''}`} onClick={() => p.onSimpleToggle(false)}>
            Avanzado
          </button>
        </div>
        <p className={styles.ctrlHint}>
          {p.simple
            ? 'Resumen por segmento. Toca un segmento para ver qué reabsorbe.'
            : 'Toca un segmento para hacer zoom, entra a una célula (chip o cuenta) y bloquea proteínas, o aplica un fármaco o enfermedad.'}
        </p>
      </div>

      {p.hasPerturbation && (
        <button className={styles.resetBtn} onClick={p.onReset}>↺ Volver al estado basal</button>
      )}

      {/* Leyendas y selectores (solo en modo avanzado) */}
      {!p.simple && (
        <>
          <Collapsible title="Fármacos" count={DRUG_LIST.length} open={sections.farmacos} onToggle={() => toggleSection('farmacos')}>
            <ul className={styles.pickList}>
              {DRUG_LIST.map((d) => (
                <li key={d.id}>
                  <button
                    className={`${styles.pickBtn} ${p.activeDrugId === d.id ? styles.pickBtnActive : ''}`}
                    onClick={() => p.onSelectDrug(d.id, d.segmentoId)}
                    aria-pressed={p.activeDrugId === d.id}
                  >
                    <span className={styles.pickName}>{d.nombre}</span>
                    <span className={styles.pickMeta}>{d.clase}</span>
                    <span className={styles.pickSite}>Sitio: {SEGMENT_BY_ID[d.segmentoId]?.corto} · {targetSiglas(d.objetivos)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="Enfermedades" count={DISEASE_LIST.length} open={sections.enfermedades} onToggle={() => toggleSection('enfermedades')}>
            <ul className={styles.pickList}>
              {DISEASE_LIST.map((e) => (
                <li key={e.id}>
                  <button
                    className={`${styles.pickBtn} ${p.activeDiseaseId === e.id ? styles.pickBtnActive : ''}`}
                    onClick={() => p.onSelectDisease(e.id, e.segmentoId)}
                    aria-pressed={p.activeDiseaseId === e.id}
                  >
                    <span className={styles.pickName}>{e.nombre}</span>
                    <span className={styles.pickMeta}>{e.grupo}</span>
                    <span className={styles.pickSite}>Sitio: {SEGMENT_BY_ID[e.segmentoId]?.corto} · {targetSiglas(e.objetivos)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="Formas (mecanismo)" open={sections.formas} onToggle={() => toggleSection('formas')}>
            <ul className={styles.shapeLegend}>
              {MECHANISM_ORDER.map((m) => (
                <li key={m} className={styles.shapeItem}>
                  <svg width={30} height={24} viewBox="-15 -12 30 24" aria-hidden>
                    <MiniShape mech={m} />
                  </svg>
                  <span>{MECHANISM_LABEL[m]}</span>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title="Moléculas" open={sections.sustancias} onToggle={() => toggleSection('sustancias')}>
            <ul className={styles.legend}>
              {LEGEND_SUBS.map((s) => (
                <li key={s.id} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: s.color }} />
                  {s.label}
                </li>
              ))}
            </ul>
          </Collapsible>
        </>
      )}
    </div>
  );
}

/** Mini-silueta del mecanismo para la leyenda de formas. */
function MiniShape({ mech }: { mech: Mechanism }) {
  const cls = styles.glyphBody;
  const stroke = { stroke: '#3b9edd', strokeWidth: 1.8 };
  switch (mech) {
    case 'bomba':
      return <rect x={-13} y={-10} width={26} height={20} rx={10} className={cls} style={stroke} />;
    case 'canal':
      return <path d="M-13,-10 L13,-10 L4,0 L13,10 L-13,10 L-4,0 Z" className={cls} style={stroke} />;
    case 'facilitado':
      return <ellipse cx={0} cy={0} rx={13} ry={10} className={cls} style={stroke} />;
    case 'receptor':
      return <path d="M0,10 L0,1 M0,1 L-7,-10 M0,1 L7,-10" fill="none" stroke="#3b9edd" strokeWidth={2.2} strokeLinecap="round" />;
    case 'simporte':
      return (
        <g>
          <rect x={-13} y={-10} width={26} height={20} rx={4} className={cls} style={stroke} />
          <path d="M-7,3 L-7,-3 M-9,-0.6 L-7,-3 L-5,-0.6 M7,3 L7,-3 M5,-0.6 L7,-3 L9,-0.6" fill="none" stroke="#3b9edd" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case 'antiporte':
      return (
        <g>
          <rect x={-13} y={-10} width={26} height={20} rx={4} className={cls} style={stroke} />
          <path d="M-7,-3 L-7,3 M-9,0.6 L-7,3 L-5,0.6 M7,3 L7,-3 M5,-0.6 L7,-3 L9,-0.6" fill="none" stroke="#3b9edd" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
  }
}

function Collapsible({
  title,
  count,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.collap} ${open ? styles.collapOpen : ''}`}>
      <button className={styles.collapHead} onClick={onToggle} aria-expanded={open}>
        <span className={styles.collapTitle}>
          {title}
          {typeof count === 'number' && <span className={styles.collapCount}>{count}</span>}
        </span>
        <span className={styles.collapChevron} aria-hidden>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className={styles.collapBody}>{children}</div>}
    </div>
  );
}
