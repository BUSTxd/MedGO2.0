'use client';
// Contenido de la barra lateral: selector de modo simple/avanzado y secciones
// colapsables de fármacos y enfermedades. Va dentro del drawer lateral (el
// contenedor y el scroll los provee NefronSimulator).

import { useState } from 'react';
import type { SegmentId } from './engine/types';
import { DRUG_LIST } from '@/lib/data/nefron/drugs';
import { DISEASE_LIST } from '@/lib/data/nefron/diseases';
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

type SectionKey = 'farmacos' | 'enfermedades';

export default function ControlsPanel(p: ControlsProps) {
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    farmacos: false,
    enfermedades: false,
  });

  const toggleSection = (k: SectionKey) =>
    setSections((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className={styles.ctrlStack}>
      {/* Modo de vista */}
      <div className={styles.ctrlGroup}>
        <span className={styles.ctrlLabel}>Modo</span>
        <div className={styles.segmented}>
          <button
            className={`${styles.segBtn} ${p.simple ? styles.segBtnActive : ''}`}
            onClick={() => p.onSimpleToggle(true)}
          >
            Simple
          </button>
          <button
            className={`${styles.segBtn} ${!p.simple ? styles.segBtnActive : ''}`}
            onClick={() => p.onSimpleToggle(false)}
          >
            Avanzado
          </button>
        </div>
        <p className={styles.ctrlHint}>
          {p.simple
            ? 'Resumen por segmento. Toca un segmento para ver qué reabsorbe.'
            : 'Toca un segmento para hacer zoom, ver sus células y bloquear transportadores; o aplica un fármaco o enfermedad.'}
        </p>
      </div>

      {/* Reinicio de la perturbación activa */}
      {p.hasPerturbation && (
        <button className={styles.resetBtn} onClick={p.onReset}>
          ↺ Volver al estado basal
        </button>
      )}

      {/* Fármacos y enfermedades colapsables (solo en modo avanzado) */}
      {!p.simple && (
        <>
          <Collapsible
            title="Fármacos"
            count={DRUG_LIST.length}
            open={sections.farmacos}
            onToggle={() => toggleSection('farmacos')}
          >
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
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible
            title="Enfermedades"
            count={DISEASE_LIST.length}
            open={sections.enfermedades}
            onToggle={() => toggleSection('enfermedades')}
          >
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
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>
        </>
      )}
    </div>
  );
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
