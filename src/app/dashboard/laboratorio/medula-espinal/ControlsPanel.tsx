'use client';
// Panel de controles lateral: selector de modo, nivel vertebral,
// listas de estructuras y panel de información.

import type { CSSProperties } from 'react';
import {
  LAMINA_GROUP_LIST, TRACT_LIST, TRACT_GROUPS, MENINGE_LIST, LEVEL_LIST, SYNDROME_LIST,
  LAMINA_GROUPS, TRACTS, MENINGES, SYNDROMES,
  tractPresentAt, tractLayersAt,
  type LevelId, type LaminaGroupId, type TractId, type MeningeId, type SyndromeId,
} from './engine/anatomy';
import styles from '@/styles/medulaEspinal.module.css';

export type ViewMode = 'completa' | 'corte' | 'tractos' | 'meninges' | 'clinico';

interface Props {
  mode: ViewMode;
  level: LevelId;
  selectedLamina: LaminaGroupId | null;
  selectedTract: TractId | null;
  selectedSyndrome: SyndromeId | null;
  meningesVisible: Record<MeningeId, boolean>;
  showAllLaminae: boolean;
  showDura: boolean;
  showRoots: boolean;
  onSwitchMode: (m: ViewMode) => void;
  onSelectLevel: (l: LevelId) => void;
  onSelectLamina: (id: LaminaGroupId | null) => void;
  onSelectTract: (id: TractId | null) => void;
  onSelectSyndrome: (id: SyndromeId | null) => void;
  onToggleMeninge: (id: MeningeId) => void;
  onToggleAllLaminae: () => void;
  onToggleDura: () => void;
  onToggleRoots: () => void;
}

const MODES: Array<{ key: ViewMode; label: string }> = [
  { key: 'completa', label: 'Médula' },
  { key: 'corte', label: 'Corte' },
  { key: 'tractos', label: 'Tractos' },
  { key: 'meninges', label: 'Meninges' },
  { key: 'clinico', label: 'Clínico' },
];

function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className={styles.structureDot}
      style={{ background: color, width: size, height: size } as CSSProperties}
    />
  );
}

export default function ControlsPanel(props: Props) {
  const {
    mode, level, selectedLamina, selectedTract, selectedSyndrome,
    meningesVisible, showAllLaminae, showDura, showRoots,
    onSwitchMode, onSelectLevel, onSelectLamina, onSelectTract,
    onSelectSyndrome, onToggleMeninge, onToggleAllLaminae,
    onToggleDura, onToggleRoots,
  } = props;

  const lvl = LEVEL_LIST.find((l) => l.id === level)!;

  return (
    <div className={styles.panel}>
      {/* ── Selector de modo ── */}
      <div className={styles.segmented}>
        {MODES.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.segBtnSm} ${mode === key ? styles.segActive : ''}`}
            onClick={() => onSwitchMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Selector de nivel vertebral ── */}
      <div className={styles.levelGrid}>
        {LEVEL_LIST.map((l) => (
          <button
            key={l.id}
            className={`${styles.levelBtn} ${level === l.id ? styles.levelActive : ''}`}
            onClick={() => onSelectLevel(l.id)}
          >
            <span className={styles.levelName}>{l.name}</span>
            <span className={styles.levelSeg}>{l.segment}</span>
          </button>
        ))}
      </div>

      {/* ── Info del nivel ── */}
      <p className={styles.hint}>{lvl.shape} · {lvl.desc}</p>

      {/* ── Contenido por modo ── */}

      {mode === 'completa' && (
        <>
          <p className={styles.hint}>
            Cordón completo: dos intumescencias, cono medular y cauda equina.
            Selecciona una región (arriba o en el modelo) para ver sus núcleos.
          </p>

          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <Dot color="#7e8aa0" />
              <span className={styles.structureName}>Saco dural (cisterna lumbar)</span>
            </div>
            <button
              className={`${styles.toggleSwitch} ${showDura ? styles.toggleOn : ''}`}
              onClick={onToggleDura}
              aria-label="Toggle saco dural"
            />
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleLabel}>
              <Dot color="#9aa3b8" />
              <span className={styles.structureName}>Raíces nerviosas</span>
            </div>
            <button
              className={`${styles.toggleSwitch} ${showRoots ? styles.toggleOn : ''}`}
              onClick={onToggleRoots}
              aria-label="Toggle raíces"
            />
          </div>

          <div className={styles.info}>
            <div className={styles.infoTitle}>Nivel {lvl.name} · {lvl.segment}</div>
            <div className={styles.infoDesc}>{lvl.desc}</div>
            {lvl.nuclei.map((n) => (
              <div key={n.name} className={styles.infoDesc} style={{ marginTop: 6 }}>
                <strong>{n.name}</strong><br />{n.desc}
              </div>
            ))}
            <div className={styles.infoDesc} style={{ fontStyle: 'italic', marginTop: 6 }}>
              {lvl.whiteNote}
            </div>
            <button
              className={styles.segBtnSm}
              style={{ width: '100%', marginTop: 10 }}
              onClick={() => onSwitchMode('corte')}
            >
              Ver corte transversal →
            </button>
          </div>
        </>
      )}

      {mode === 'corte' && (
        <>
          <button
            className={`${styles.segBtnSm} ${showAllLaminae ? styles.segActive : ''}`}
            style={{ width: '100%', marginBottom: 6 }}
            onClick={onToggleAllLaminae}
          >
            {showAllLaminae ? '✦ Todas las láminas' : 'Mostrar todas las láminas'}
          </button>

          <div className={styles.structureList}>
            {LAMINA_GROUP_LIST.map((g) => (
              <button
                key={g.id}
                className={`${styles.structureBtn} ${selectedLamina === g.id ? styles.structureActive : ''}`}
                onClick={() => onSelectLamina(selectedLamina === g.id ? null : g.id)}
              >
                <Dot color={g.color} />
                <span className={styles.structureName}>{g.name}</span>
              </button>
            ))}
          </div>

          {selectedLamina && (() => {
            const g = LAMINA_GROUPS[selectedLamina];
            return (
              <div className={styles.info}>
                <div className={styles.infoTitle}>{g.name}</div>
                {g.laminae.map((l) => (
                  <div key={l.numeral} className={styles.infoDesc}>
                    <strong>Lámina {l.numeral} — {l.name}</strong><br />
                    {l.fn}
                  </div>
                ))}
                <div className={styles.infoDesc} style={{ fontStyle: 'italic', marginTop: 6 }}>
                  {g.summary}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {mode === 'tractos' && (
        <>
          <p className={styles.hint}>
            Rojo = descendente (motor) · Azul = ascendente (sensitivo). Sólo se muestran
            los tractos presentes en el nivel {lvl.name}.
          </p>

          {TRACT_GROUPS.map((group) => {
            const tractos = TRACT_LIST.filter((t) => t.group === group);
            return (
              <div key={group} className={styles.listSection}>
                <div className={styles.listTitle}>{group}</div>
                <div className={styles.structureList}>
                  {tractos.map((t) => {
                    const present = tractPresentAt(t.id, level);
                    return (
                      <button
                        key={t.id}
                        className={`${styles.structureBtn} ${selectedTract === t.id ? styles.structureActive : ''}`}
                        style={present ? undefined : { opacity: 0.32, pointerEvents: 'none' } as CSSProperties}
                        onClick={() => onSelectTract(selectedTract === t.id ? null : t.id)}
                      >
                        <Dot color={t.color} />
                        <span className={styles.structureName}>{t.name}</span>
                        <span className={styles.structureDir}>
                          {present ? (t.direction === 'ascendente' ? '↑' : '↓') : '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {selectedTract && (() => {
            const t = TRACTS[selectedTract];
            const layers = tractLayersAt(t.id, level).filter((l) => l !== '*');
            return (
              <div className={styles.info}>
                <div className={styles.infoTitle}>{t.name}</div>
                <div className={styles.infoDesc}>{t.fn}</div>
                <div className={styles.infoDesc}>
                  <strong>Somatotopía:</strong> {t.somatotopy}
                </div>
                {layers.length > 0 && (
                  <div className={styles.infoDesc}>
                    <strong>Capas en {lvl.name}:</strong> {layers.join(' · ')}
                  </div>
                )}
                <div className={styles.infoDesc} style={{ fontStyle: 'italic' }}>
                  {t.direction === 'ascendente' ? '↑ Ascendente · aferente' : '↓ Descendente · eferente'} · {t.group}
                </div>
              </div>
            );
          })()}
        </>
      )}

      {mode === 'meninges' && (
        <>
          <p className={styles.hint}>Activa o desactiva cada capa meníngea.</p>

          {MENINGE_LIST.map((m) => (
            <div key={m.id} className={styles.toggleRow}>
              <div className={styles.toggleLabel}>
                <Dot color={m.color} />
                <span className={styles.structureName}>{m.name}</span>
              </div>
              <button
                className={`${styles.toggleSwitch} ${meningesVisible[m.id] ? styles.toggleOn : ''}`}
                onClick={() => onToggleMeninge(m.id)}
                aria-label={`Toggle ${m.name}`}
              />
            </div>
          ))}

          {(() => {
            const active = MENINGE_LIST.find((m) => meningesVisible[m.id]);
            return active ? (
              <div className={styles.info}>
                <div className={styles.infoTitle}>{active.name}</div>
                <div className={styles.infoDesc}>{active.desc}</div>
              </div>
            ) : (
              <div className={styles.infoEmpty}>Activa una capa para ver su descripción.</div>
            );
          })()}
        </>
      )}

      {mode === 'clinico' && (
        <>
          <p className={styles.hint}>Selecciona un síndrome para visualizar las zonas afectadas.</p>

          <div className={styles.syndromeGrid}>
            {SYNDROME_LIST.map((s) => (
              <button
                key={s.id}
                className={`${styles.structureBtn} ${selectedSyndrome === s.id ? styles.structureActive : ''}`}
                onClick={() => onSelectSyndrome(selectedSyndrome === s.id ? null : s.id)}
              >
                <span className={styles.structureName}>{s.name}</span>
              </button>
            ))}
          </div>

          {selectedSyndrome && (() => {
            const s = SYNDROMES[selectedSyndrome];
            return (
              <div className={styles.info}>
                <div className={styles.infoTitle}>{s.name}</div>
                <div className={styles.infoDesc}><strong>Causa:</strong> {s.cause}</div>
                <div className={styles.infoDesc}><strong>Mecanismo:</strong> {s.mechanism}</div>
                <div className={styles.infoDesc} style={{ fontWeight: 600, marginTop: 6 }}>{s.desc}</div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
