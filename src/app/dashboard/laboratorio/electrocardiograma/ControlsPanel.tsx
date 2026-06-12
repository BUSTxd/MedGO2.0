'use client';
// Viñeta única de controles educativos. Agrupa TODO en una sola tarjeta
// (lateral en desktop, acordeón inferior en móvil): selector de modo, transporte,
// velocidad, paso a paso, pausa en AV, toggles de etiquetas/explicación/grid/tema
// y la leyenda de colores. No hay botones dispersos por la pantalla.

import { useState } from 'react';
import type { ModeMeta } from './engine/types';
import styles from '@/styles/electrocardiograma.module.css';

const SPEEDS = [0.25, 0.5, 1, 1.5];
const ZOOMS = [1, 1.5, 2];

const LEGEND: { color: string; label: string }[] = [
  { color: '#3b9edd', label: 'Nodo sinusal / activación auricular' },
  { color: '#2DC99A', label: 'Nodo AV / conducción nodal' },
  { color: '#FFD23F', label: 'Impulso eléctrico normal' },
  { color: '#F59E0B', label: 'Foco ectópico' },
  { color: '#E85B4A', label: 'Bloqueo / no conduce' },
  { color: '#8b93a7', label: 'Vía inactiva' },
];

export interface ControlsProps {
  modes: ModeMeta[];
  currentMode: string;
  onSelectMode: (id: string) => void;
  playing: boolean;
  onPlayToggle: () => void;
  onReset: () => void;
  speed: number;
  onSpeed: (s: number) => void;
  vZoom: number;
  onVZoom: (v: number) => void;
  hZoom: number;
  onHZoom: (v: number) => void;
  stepMode: boolean;
  onStepToggle: () => void;
  onStep: (dir: 1 | -1) => void;
  pauseAtAv: boolean;
  onPauseAtAvToggle: () => void;
  labels: boolean;
  onLabelsToggle: () => void;
  explanation: boolean;
  onExplanationToggle: () => void;
  grid: boolean;
  onGridToggle: () => void;
  dark: boolean;
  onDarkToggle: () => void;
}

export default function ControlsPanel(p: ControlsProps) {
  const [open, setOpen] = useState(false); // acordeón móvil
  const [modeOpen, setModeOpen] = useState(false);
  const current = p.modes.find((m) => m.id === p.currentMode);

  return (
    <aside className={`${styles.controls} ${open ? styles.controlsOpen : ''}`}>
      {/* Cabecera (en móvil actúa como botón de acordeón) */}
      <button className={styles.controlsHead} onClick={() => setOpen((o) => !o)}>
        <span className={styles.controlsHeadTitle}>Controles</span>
        <span className={styles.controlsHeadChevron} aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>

      <div className={styles.controlsBody}>
        {/* ── Selector de modo ── */}
        <div className={styles.ctrlGroup}>
          <span className={styles.ctrlLabel}>Modo</span>
          <div className={styles.modeSelect}>
            <button className={styles.modeSelectBtn} onClick={() => setModeOpen((o) => !o)}>
              <span>{current?.title ?? 'Selecciona un modo'}</span>
              <span aria-hidden>▾</span>
            </button>
            {modeOpen && (
              <ul className={styles.modeMenu}>
                {p.modes.map((m) => (
                  <li key={m.id}>
                    <button
                      className={`${styles.modeMenuItem} ${m.id === p.currentMode ? styles.modeMenuItemActive : ''}`}
                      disabled={!m.ready}
                      onClick={() => {
                        if (!m.ready) return;
                        p.onSelectMode(m.id);
                        setModeOpen(false);
                      }}
                    >
                      <span className={styles.modeDot} style={{ background: m.color }} />
                      <span className={styles.modeMenuText}>
                        {m.title}
                        {!m.ready && <em className={styles.soon}>Próximamente</em>}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Transporte ── */}
        <div className={styles.ctrlGroup}>
          <div className={styles.transport}>
            <button className={styles.btnPrimary} onClick={p.onPlayToggle}>
              {p.playing ? '❚❚ Pausar' : '▶ Reproducir'}
            </button>
            <button className={styles.btnGhost} onClick={p.onReset} title="Reiniciar">
              ↺
            </button>
          </div>
          {p.stepMode && (
            <div className={styles.stepNav}>
              <button className={styles.btnGhost} onClick={() => p.onStep(-1)}>
                ◀ Anterior
              </button>
              <button className={styles.btnGhost} onClick={() => p.onStep(1)}>
                Siguiente ▶
              </button>
            </div>
          )}
        </div>

        {/* ── Velocidad ── */}
        <div className={styles.ctrlGroup}>
          <span className={styles.ctrlLabel}>Velocidad</span>
          <div className={styles.speedRow}>
            {SPEEDS.map((s) => (
              <button
                key={s}
                className={`${styles.speedBtn} ${p.speed === s ? styles.speedBtnActive : ''}`}
                onClick={() => p.onSpeed(s)}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* ── Ampliar trazado (zoom vertical y horizontal del latido) ── */}
        <div className={styles.ctrlGroup}>
          <span className={styles.ctrlLabel}>Ampliar trazado</span>
          <div className={styles.zoomRow}>
            <span className={styles.zoomAxis}>Alto</span>
            {ZOOMS.map((z) => (
              <button
                key={`v-${z}`}
                className={`${styles.speedBtn} ${p.vZoom === z ? styles.speedBtnActive : ''}`}
                onClick={() => p.onVZoom(z)}
              >
                {z}×
              </button>
            ))}
          </div>
          <div className={styles.zoomRow}>
            <span className={styles.zoomAxis}>Ancho</span>
            {ZOOMS.map((z) => (
              <button
                key={`h-${z}`}
                className={`${styles.speedBtn} ${p.hZoom === z ? styles.speedBtnActive : ''}`}
                onClick={() => p.onHZoom(z)}
              >
                {z}×
              </button>
            ))}
          </div>
        </div>

        {/* ── Toggles ── */}
        <div className={styles.ctrlGroup}>
          <Toggle label="Vista paso a paso" on={p.stepMode} onClick={p.onStepToggle} />
          <Toggle label="Pausar en nodo AV" on={p.pauseAtAv} onClick={p.onPauseAtAvToggle} />
          <Toggle label="Mostrar etiquetas" on={p.labels} onClick={p.onLabelsToggle} />
          <Toggle label="Mostrar explicación" on={p.explanation} onClick={p.onExplanationToggle} />
          <Toggle label="Cuadrícula EKG" on={p.grid} onClick={p.onGridToggle} />
          <Toggle label="Modo oscuro" on={p.dark} onClick={p.onDarkToggle} />
        </div>

        {/* ── Leyenda de colores ── */}
        <div className={styles.ctrlGroup}>
          <span className={styles.ctrlLabel}>Leyenda</span>
          <ul className={styles.legend}>
            {LEGEND.map((l) => (
              <li key={l.label} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: l.color }} />
                <span>{l.label}</span>
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
