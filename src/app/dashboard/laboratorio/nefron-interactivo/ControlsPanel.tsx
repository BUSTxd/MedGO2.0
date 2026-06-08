'use client';
// Viñeta de controles (lateral en desktop, acordeón en móvil): modo simple /
// avanzado, tema, reinicio de transportadores y leyenda de sustancias.

import { useState } from 'react';
import { LEGEND_SUBSTANCES, SUBSTANCES } from '@/lib/data/nefron/substances';
import styles from '@/styles/nefronInteractivo.module.css';

export interface ControlsProps {
  simple: boolean;
  onSimpleToggle: (v: boolean) => void;
  dark: boolean;
  onDarkToggle: () => void;
  hasDisabled: boolean;
  onReset: () => void;
}

export default function ControlsPanel(p: ControlsProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`${styles.controls} ${open ? styles.controlsOpen : ''}`}>
      <button className={styles.controlsHead} onClick={() => setOpen((o) => !o)}>
        <span className={styles.controlsHeadTitle}>Controles</span>
        <span className={styles.controlsHeadChevron} aria-hidden>{open ? '▾' : '▸'}</span>
      </button>

      <div className={styles.controlsBody}>
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
              : 'Toca un segmento para hacer zoom, ver sus células y bloquear transportadores.'}
          </p>
        </div>

        {/* Acciones */}
        <div className={styles.ctrlGroup}>
          <Toggle label="Modo oscuro" on={p.dark} onClick={p.onDarkToggle} />
          {p.hasDisabled && (
            <button className={styles.resetBtn} onClick={p.onReset}>
              ↺ Reactivar todos los transportadores
            </button>
          )}
        </div>

        {/* Leyenda de sustancias */}
        <div className={styles.ctrlGroup}>
          <span className={styles.ctrlLabel}>Leyenda</span>
          <ul className={styles.legend}>
            {LEGEND_SUBSTANCES.map((id) => (
              <li key={id} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: SUBSTANCES[id].color }} />
                <span>{SUBSTANCES[id].label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function Toggle({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button className={styles.toggle} onClick={onClick} role="switch" aria-checked={on}>
      <span className={styles.toggleLabel}>{label}</span>
      <span className={`${styles.toggleTrack} ${on ? styles.toggleOn : ''}`}>
        <span className={styles.toggleThumb} />
      </span>
    </button>
  );
}
