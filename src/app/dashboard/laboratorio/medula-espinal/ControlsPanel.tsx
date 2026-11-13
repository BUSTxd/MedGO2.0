'use client';
// Panel contextual (a la derecha del lienzo, de su misma altura): arriba la
// ficha de lo elegido, siempre visible; debajo la lista de la vista activa, con
// su propio scroll. Vista y nivel viven en la barra de herramientas
// (BarraHerramientas), porque afectan a todo el lab.
// Diseño revisado con las heurísticas de Nielsen
// (auditorias-ux/nielsen-medula-espinal-2026-11-12.md): solo lo esencial.

import type { CSSProperties, ReactNode } from 'react';
import {
  LAMINA_GROUP_LIST, TRACT_LIST, TRACT_GROUPS, MENINGE_LIST, LEVEL_LIST, SYNDROME_LIST,
  LAMINA_GROUPS, TRACTS, SYNDROMES,
  tractPresentAt, tractLayersAt, rangoNucleo,
  type LevelId, type LaminaGroupId, type TractId, type MeningeId, type SyndromeId,
} from './engine/anatomy';
import type { Senalado } from './SpinalCordSimulator';
import styles from '@/styles/medulaEspinal.module.css';

export type ViewMode = 'completa' | 'corte' | 'tractos' | 'meninges' | 'clinico';

export const MODES: Array<{ key: ViewMode; label: string; desc: string }> = [
  { key: 'completa', label: 'Médula', desc: 'La médula entera: regiones, intumescencias y cono' },
  { key: 'corte', label: 'Corte', desc: 'Corte transversal y láminas de Rexed' },
  { key: 'tractos', label: 'Tractos', desc: 'Vías ascendentes y descendentes del nivel' },
  { key: 'meninges', label: 'Meninges', desc: 'Piamadre, aracnoides y duramadre' },
  { key: 'clinico', label: 'Clínico', desc: 'Síndromes medulares y lo que dañan' },
];

interface Props {
  mode: ViewMode;
  level: LevelId;
  /** El nivel se elige en la barra lateral (la vista flota sobre el modelo). */
  onSelectLevel: (l: LevelId) => void;
  selectedLamina: LaminaGroupId | null;
  selectedTract: TractId | null;
  selectedSyndrome: SyndromeId | null;
  meningesVisible: Record<MeningeId, boolean>;
  showAllLaminae: boolean;
  showDura: boolean;
  showRoots: boolean;
  onSwitchMode: (m: ViewMode) => void;
  /** Núcleo elegido en la ficha de la región (se ilumina su tramo). */
  selectedNucleo: string | null;
  onSelectNucleo: (n: string | null) => void;
  onSelectLamina: (id: LaminaGroupId | null) => void;
  onSelectTract: (id: TractId | null) => void;
  onSelectSyndrome: (id: SyndromeId | null) => void;
  onToggleMeninge: (id: MeningeId) => void;
  onToggleAllLaminae: () => void;
  onToggleDura: () => void;
  onToggleRoots: () => void;
  /** Señala en el modelo lo que está bajo el puntero en la lista. */
  onSenalar: (s: Senalado) => void;
}

const ROJO_DESC = '#E0322E';
const AZUL_ASC = '#2E86DE';

function Dot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className={styles.structureDot}
      style={{ background: color, width: size, height: size } as CSSProperties}
      aria-hidden
    />
  );
}

/** Fila con interruptor: toda la fila se puede pulsar. */
function Interruptor({ activo, onCambio, etiqueta, color, detalle }: {
  activo: boolean;
  onCambio: () => void;
  etiqueta: string;
  color?: string;
  detalle?: string;
}) {
  return (
    <button type="button" role="switch" aria-checked={activo} onClick={onCambio} className={styles.toggleRow}>
      <span className={styles.toggleLabel}>
        {color && <Dot color={color} />}
        <span className={styles.toggleTextos}>
          <span className={styles.structureName}>{etiqueta}</span>
          {detalle && <span className={styles.toggleDetalle}>{detalle}</span>}
        </span>
      </span>
      <span className={`${styles.toggleSwitch} ${activo ? styles.toggleOn : ''}`} aria-hidden />
    </button>
  );
}

/** Ficha de lo elegido. */
function Ficha({ color, titulo, sub, children }: { color?: string; titulo: string; sub?: string; children?: ReactNode }) {
  return (
    <div className={styles.info} role="region" aria-label={titulo}>
      <div className={styles.infoHead}>
        {color && <Dot color={color} size={12} />}
        <h3 className={styles.infoTitle}>{titulo}</h3>
      </div>
      {sub && <p className={styles.infoSub}>{sub}</p>}
      {children}
    </div>
  );
}

function Vacio({ children }: { children: ReactNode }) {
  return <p className={styles.infoEmpty}>{children}</p>;
}

function BotonLista({ activo, onClick, onEnter, onLeave, children, disabled }: {
  activo: boolean;
  onClick: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={activo}
      className={`${styles.structureBtn} ${activo ? styles.structureActive : ''}`}
      onClick={onClick}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
    </button>
  );
}

export default function ControlsPanel(props: Props) {
  const {
    mode, level, onSelectLevel, selectedLamina, selectedTract, selectedSyndrome,
    meningesVisible, showAllLaminae, showDura, showRoots,
    onSwitchMode, onSelectLamina, onSelectTract,
    onSelectSyndrome, onToggleMeninge, onToggleAllLaminae,
    onToggleDura, onToggleRoots, onSenalar, selectedNucleo, onSelectNucleo,
  } = props;

  const lvl = LEVEL_LIST.find((l) => l.id === level)!;
  const nivel = lvl.name.toLowerCase();

  let cabeza: ReactNode = null; // fila fija sobre la ficha (leyenda)
  let ficha: ReactNode = null;  // zona fija: lo elegido
  let lista: ReactNode = null;  // zona con scroll: opciones

  if (mode === 'completa') {
    ficha = (
      <Ficha titulo={`Región ${nivel} · ${lvl.segment}`}>
        <p className={styles.infoDesc}>{lvl.desc}</p>
        <span className={styles.grupoTitulo}>Núcleos · toca uno para verlo</span>
        <ul className={styles.nucleos}>
          {lvl.nuclei.map((n) => {
            const r = rangoNucleo(n);
            const activo = selectedNucleo === n.name;
            return (
              <li key={n.name}>
                <button
                  type="button"
                  aria-pressed={activo}
                  className={`${styles.nucleoBtn} ${activo ? styles.nucleoActivo : ''}`}
                  onClick={() => onSelectNucleo(activo ? null : n.name)}
                >
                  <span className={styles.nucleoCabeza}>
                    <span className={styles.nucleoLuz} aria-hidden />
                    <strong>{n.name}</strong>
                  </span>
                  <span className={styles.nucleoDesc}>{n.desc}</span>
                  {activo && r && <span className={styles.nucleoRango}>Iluminado en el modelo: {r[0]} a {r[1]}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button" className={styles.ctaBtn} onClick={() => onSwitchMode('corte')}>
          Ver su corte transversal →
        </button>
      </Ficha>
    );
    lista = (
      <>
        <span className={styles.grupoTitulo}>Mostrar en el modelo</span>
        <Interruptor activo={showDura} onCambio={onToggleDura} etiqueta="Saco dural" color="#7e8aa0" />
        <Interruptor activo={showRoots} onCambio={onToggleRoots} etiqueta="Raíces nerviosas" color="#9aa3b8" />
      </>
    );
  }

  if (mode === 'corte') {
    const g = selectedLamina ? LAMINA_GROUPS[selectedLamina] : null;
    ficha = g ? (
      <Ficha color={g.color} titulo={g.name} sub={g.summary}>
        <ul className={styles.infoLista}>
          {g.laminae.map((l) => (
            <li key={l.numeral}><strong>{l.numeral} · {l.name}.</strong> {l.fn}</li>
          ))}
        </ul>
      </Ficha>
    ) : (
      <Vacio>Toca una lámina en el modelo o en la lista.</Vacio>
    );
    lista = (
      <>
        <Interruptor activo={showAllLaminae} onCambio={onToggleAllLaminae} etiqueta="Colorear todas las láminas" />
        <div className={styles.structureList}>
          {LAMINA_GROUP_LIST.map((lg) => (
            <BotonLista
              key={lg.id}
              activo={selectedLamina === lg.id}
              onClick={() => onSelectLamina(selectedLamina === lg.id ? null : lg.id)}
              onEnter={() => onSenalar({ kind: 'lamina', id: lg.id })}
              onLeave={() => onSenalar(null)}
            >
              <Dot color={lg.color} />
              <span className={styles.structureName}>{lg.name}</span>
            </BotonLista>
          ))}
        </div>
      </>
    );
  }

  if (mode === 'tractos') {
    const t = selectedTract ? TRACTS[selectedTract] : null;
    const capas = t ? tractLayersAt(t.id, level).filter((l) => l !== '*') : [];
    const ausentes = TRACT_LIST.filter((x) => !tractPresentAt(x.id, level));
    cabeza = (
      <div className={styles.leyenda} aria-label="Leyenda de colores">
        <span className={styles.leyendaItem}><Dot color={ROJO_DESC} /> ↓ Descendente</span>
        <span className={styles.leyendaItem}><Dot color={AZUL_ASC} /> ↑ Ascendente</span>
      </div>
    );
    ficha = t ? (
      <Ficha color={t.color} titulo={t.name} sub={`${t.direction === 'ascendente' ? '↑ Ascendente' : '↓ Descendente'} · ${t.group}`}>
        <p className={styles.infoDesc}>{t.fn}</p>
        <p className={styles.infoDesc}>
          <strong>Somatotopía:</strong> {t.somatotopy}
          {capas.length > 0 && ' En el modelo, cada capa lleva su letra (S, L, T, C).'}
        </p>
      </Ficha>
    ) : (
      <Vacio>Toca un tracto en el modelo o en la lista.</Vacio>
    );
    lista = (
      <>
        {TRACT_GROUPS.map((group) => {
          const tractos = TRACT_LIST.filter((x) => x.group === group && tractPresentAt(x.id, level));
          if (tractos.length === 0) return null;
          return (
            <div key={group} className={styles.listSection}>
              <div className={styles.listTitle}>{group}</div>
              <div className={styles.structureList}>
                {tractos.map((x) => (
                  <BotonLista
                    key={x.id}
                    activo={selectedTract === x.id}
                    onClick={() => onSelectTract(selectedTract === x.id ? null : x.id)}
                    onEnter={() => onSenalar({ kind: 'tract', id: x.id })}
                    onLeave={() => onSenalar(null)}
                  >
                    <Dot color={x.color} />
                    <span className={styles.structureName}>{x.name}</span>
                    <span className={styles.structureDir} aria-label={x.direction}>
                      {x.direction === 'ascendente' ? '↑' : '↓'}
                    </span>
                  </BotonLista>
                ))}
              </div>
            </div>
          );
        })}
        {ausentes.length > 0 && (
          <p className={styles.notaPie}>
            No existen en el nivel {nivel}: {ausentes.map((x) => x.name.toLowerCase()).join(', ')}.
          </p>
        )}
      </>
    );
  }

  if (mode === 'meninges') {
    lista = (
      <>
        <span className={styles.grupoTitulo}>De dentro hacia fuera</span>
        {MENINGE_LIST.map((m) => (
          <Interruptor
            key={m.id}
            activo={meningesVisible[m.id]}
            onCambio={() => onToggleMeninge(m.id)}
            etiqueta={m.name}
            detalle={m.corto}
            color={m.color}
          />
        ))}
      </>
    );
  }

  if (mode === 'clinico') {
    const s = selectedSyndrome ? SYNDROMES[selectedSyndrome] : null;
    ficha = s ? (
      <Ficha titulo={s.name} sub={s.desc}>
        <p className={styles.infoDesc}><strong>Mecanismo:</strong> {s.mechanism}</p>
        <ul className={styles.chips} aria-label="Lo que daña">
          {s.tracts.filter((id) => tractPresentAt(id, level)).map((id) => (
            <li key={id} className={styles.chip}><Dot color={TRACTS[id].color} /> {TRACTS[id].name}</li>
          ))}
          {s.laminae.map((id) => (
            <li key={id} className={styles.chip}><Dot color={LAMINA_GROUPS[id].color} /> {LAMINA_GROUPS[id].name}</li>
          ))}
        </ul>
        {s.side === 'right' && (
          <p className={styles.infoNota}>Violeta = lado de la lesión (ipsilateral).</p>
        )}
      </Ficha>
    ) : (
      <Vacio>Elige un síndrome: el modelo resalta lo que daña.</Vacio>
    );
    lista = (
      <div className={styles.structureList}>
        {SYNDROME_LIST.map((x) => (
          <BotonLista
            key={x.id}
            activo={selectedSyndrome === x.id}
            onClick={() => onSelectSyndrome(selectedSyndrome === x.id ? null : x.id)}
          >
            <span className={styles.structureName}>{x.name}</span>
          </BotonLista>
        ))}
      </div>
    );
  }

  return (
    <aside className={styles.panel} aria-label={`Panel de ${MODES.find((m) => m.key === mode)?.label ?? ''}`}>
      {/* Nivel medular: arriba de la barra lateral, siempre visible */}
      <div className={styles.panelNivel}>
        <span className={styles.grupoTitulo} id="me-nivel">Nivel medular</span>
        <div className={styles.niveles} role="group" aria-labelledby="me-nivel">
          {LEVEL_LIST.map((l) => (
            <button
              key={l.id}
              type="button"
              title={`${l.name}, segmento ${l.segment}`}
              aria-pressed={level === l.id}
              className={level === l.id ? styles.nivelActivo : styles.nivel}
              onClick={() => onSelectLevel(l.id)}
            >
              <strong>{l.name}</strong>
              <span>{l.segment}</span>
            </button>
          ))}
        </div>
      </div>
      {cabeza && <div className={styles.panelCabeza}>{cabeza}</div>}
      {ficha && <div className={styles.panelFicha}>{ficha}</div>}
      {lista && <div className={styles.panelLista}>{lista}</div>}
    </aside>
  );
}
