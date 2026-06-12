'use client';
// Orquestador del simulador del nefrón. Mantiene la navegación (nefrón → segmento
// → célula), el modo simple/avanzado y la perturbación activa (bloquear un
// transportador, aplicar un fármaco o activar una enfermedad), y compone el mapa,
// las vistas de zoom, los controles y el panel de consecuencias. El tema (claro/
// oscuro) lo controla la web de forma global; aquí solo se respeta, no se cambia.

import { useEffect, useMemo, useState } from 'react';
import type { Perturbation, SegmentId } from './engine/types';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import { DRUGS } from '@/lib/data/nefron/drugs';
import { DISEASES } from '@/lib/data/nefron/diseases';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { resolvePerturbation, PH_BASELINE } from './engine/simulate';
import NefronMap from './NefronMap';
import NefronCanvas, { type CellLayout } from './NefronCanvas';
import ControlsPanel from './ControlsPanel';
import ConsequencePanel from './ConsequencePanel';
import styles from '@/styles/nefronInteractivo.module.css';

const PREFS_KEY = 'medgo:nefron:prefs';

type View = 'nephron' | 'segment' | 'cell';

const EMPTY: Set<string> = new Set();

/** Célula del segmento que contiene el primer transportador diana (para abrirla). */
function findTargetCell(segmentoId: SegmentId, objetivos: string[]): string | null {
  const seg = SEGMENT_BY_ID[segmentoId];
  if (!seg) return null;
  for (const obj of objetivos) {
    const hit = seg.celulas.find((c) => c.transportadores.includes(obj));
    if (hit) return hit.id;
  }
  return null;
}

export default function NefronSimulator() {
  const [simple, setSimple] = useState(true);
  const [view, setView] = useState<View>('nephron');
  const [segId, setSegId] = useState<SegmentId | null>(null);
  const [cellId, setCellId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<SegmentId | null>(null);
  const [pert, setPert] = useState<Perturbation | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  // Disposición de la bioquímica celular. Por defecto 'horizontal' (luz arriba/sangre
  // abajo): es la única escena que entra al bundle al cargar; 'vertical' se descarga
  // recién cuando el usuario pulsa el switch.
  const [cellLayout, setCellLayout] = useState<CellLayout>('horizontal');

  // Restaura preferencias de vista (el tema lo gestiona la web globalmente).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.simple === 'boolean') setSimple(p.simple);
        if (p.cellLayout === 'horizontal' || p.cellLayout === 'vertical') setCellLayout(p.cellLayout);
      }
    } catch {}
  }, []);

  const persist = (next: Partial<{ simple: boolean; cellLayout: CellLayout }>) => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const prev = raw ? JSON.parse(raw) : {};
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prev, ...next }));
    } catch {}
  };

  const setLayout = (v: CellLayout) => {
    setCellLayout(v);
    persist({ cellLayout: v });
  };

  const setSimpleMode = (v: boolean) => {
    setSimple(v);
    persist({ simple: v });
    // Al volver a simple se regresa al nefrón completo y se limpian fármacos/enfermedades.
    if (v) {
      setView('nephron');
      setCellId(null);
      setPert(null);
    }
  };

  const segment = segId ? SEGMENT_BY_ID[segId] : null;
  const cell = segment && cellId ? segment.celulas.find((c) => c.id === cellId) ?? null : null;

  const resolved = useMemo(() => resolvePerturbation(pert), [pert]);
  const affected = resolved?.affected ?? EMPTY;

  const handleSelectSegment = (id: SegmentId) => {
    setSegId(id);
    if (simple) {
      setView('nephron'); // en simple solo resaltamos + mostramos resumen al lado
    } else {
      setView('segment');
      setCellId(null);
    }
  };

  const handleSelectCell = (cId: string) => {
    setCellId(cId);
    setView('cell');
  };

  const toggleTransporter = (id: string) => {
    // Exclusividad: si ya estaba bloqueado ese transportador, se libera.
    setPert((prev) =>
      prev && prev.kind === 'transportador' && prev.id === id ? null : { kind: 'transportador', id }
    );
  };

  const backToNephron = () => {
    setView('nephron');
    setCellId(null);
    setSegId(null);
    setHoverId(null);
  };

  // Aplica un fármaco o enfermedad y navega a su segmento diana (modo avanzado).
  const applyPerturbation = (p: Perturbation, segmentoDiana?: SegmentId) => {
    const same = pert && pert.kind === p.kind && pert.id === p.id;
    if (same) {
      // Deseleccionar: limpia la perturbación y vuelve al nefrón completo (no se
      // queda atrapado en la célula/segmento).
      setPert(null);
      backToNephron();
      return;
    }
    setPert(p);
    if (segmentoDiana) {
      setSegId(segmentoDiana);
      if (!simple) {
        // Si la perturbación tiene una célula diana clara, se abre directamente
        // esa célula (con los glifos diana resaltados); si no, la pared del segmento.
        const objetivos = p.kind === 'farmaco' ? DRUGS[p.id]?.objetivos : DISEASES[p.id]?.objetivos;
        const targetCell = objetivos ? findTargetCell(segmentoDiana, objetivos) : null;
        if (targetCell) {
          setCellId(targetCell);
          setView('cell');
        } else {
          setView('segment');
          setCellId(null);
        }
      }
    }
  };

  // Volver al estado basal: además de limpiar la perturbación, regresa al nefrón
  // completo para poder seguir navegando o elegir otra cosa.
  const clearPerturbation = () => {
    setPert(null);
    backToNephron();
  };
  const backToSegment = () => {
    setView('segment');
    setCellId(null);
  };

  return (
    <div className={styles.sim}>
      {/* Barra de navegación / breadcrumb */}
      <div className={styles.navBar}>
        {view === 'nephron' && <span className={styles.crumbCurrent}>Nefrón completo</span>}
        {view === 'segment' && segment && (
          <>
            <button className={styles.crumbBtn} onClick={backToNephron}>← Nefrón completo</button>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{segment.nombre}</span>
          </>
        )}
        {view === 'cell' && segment && cell && (
          <>
            <button className={styles.crumbBtn} onClick={backToNephron}>Nefrón</button>
            <span className={styles.crumbSep}>/</span>
            <button className={styles.crumbBtn} onClick={backToSegment}>← {segment.corto}</button>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{cell.nombre}</span>
          </>
        )}
      </div>

      {/* ── ESCENARIO (a todo el ancho) con barra lateral deslizante ── */}
      <div className={styles.stageWrap}>
        <div className={styles.stage}>
          {simple ? (
            <NefronMap
              selectedId={segId}
              hoverId={hoverId}
              onSelect={handleSelectSegment}
              onHover={setHoverId}
            />
          ) : (
            <NefronCanvas
              level={view}
              selectedSeg={segId}
              selectedCellId={cellId}
              hoverId={hoverId}
              affected={affected}
              affectedTag={resolved?.tag ?? 'Bloqueado'}
              ph={resolved?.ph ?? PH_BASELINE}
              cellLayout={cellLayout}
              onSelectSegment={handleSelectSegment}
              onHover={setHoverId}
              onSelectCell={handleSelectCell}
              onToggleTransporter={toggleTransporter}
              onExit={backToNephron}
            />
          )}

          {/* Selector de células: al estar en un segmento, entra a una célula sin
              tener que "cazar" una cuenta pequeña en el lienzo. */}
          {!simple && view === 'segment' && segment && segment.celulas.length > 0 && (
            <div className={styles.cellPicker}>
              <span className={styles.cellPickerLabel}>Células de {segment.corto}:</span>
              <div className={styles.cellPickerRow}>
                {segment.celulas.map((c) => (
                  <button
                    key={c.id}
                    className={styles.cellChip}
                    style={{ borderColor: segment.color }}
                    onClick={() => handleSelectCell(c.id)}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!simple && view !== 'cell' && (
            <span className={styles.zoomHint}>Rueda para acercar · arrastra para mover · toca un segmento o una célula</span>
          )}

          {/* Switch de disposición de la bioquímica celular (solo dentro de una célula).
              Cambia entre horizontal (luz arriba/sangre abajo) y vertical (luz izq/sangre
              der). La escena no activa se descarga recién al pulsar su botón. */}
          {!simple && view === 'cell' && (
            <div className={styles.layoutSwitch}>
              <span className={styles.layoutSwitchLabel}>Vista</span>
              <div className={styles.layoutSwitchBtns} role="group" aria-label="Disposición de la célula">
                <button
                  className={`${styles.layoutSwitchBtn} ${cellLayout === 'horizontal' ? styles.layoutSwitchBtnActive : ''}`}
                  onClick={() => setLayout('horizontal')}
                  aria-pressed={cellLayout === 'horizontal'}
                >
                  Horizontal
                </button>
                <button
                  className={`${styles.layoutSwitchBtn} ${cellLayout === 'vertical' ? styles.layoutSwitchBtnActive : ''}`}
                  onClick={() => setLayout('vertical')}
                  aria-pressed={cellLayout === 'vertical'}
                >
                  Vertical
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Barra lateral: empuja el lienzo al abrir; al cerrar se oculta y deja solo la viñeta */}
        <aside className={`${styles.drawer} ${panelOpen ? styles.drawerOpen : styles.drawerCollapsed}`}>
          <button
            className={styles.drawerTab}
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={panelOpen ? 'Ocultar panel' : 'Mostrar panel'}
            aria-expanded={panelOpen}
          >
            {panelOpen ? '›' : '‹'}
          </button>

          <div className={styles.drawerBody}>
            <ControlsPanel
              simple={simple}
              onSimpleToggle={setSimpleMode}
              hasPerturbation={pert !== null}
              onReset={clearPerturbation}
              activeDrugId={pert?.kind === 'farmaco' ? pert.id : null}
              activeDiseaseId={pert?.kind === 'enfermedad' ? pert.id : null}
              onSelectDrug={(id, seg) => applyPerturbation({ kind: 'farmaco', id }, seg)}
              onSelectDisease={(id, seg) => applyPerturbation({ kind: 'enfermedad', id }, seg)}
            />

            {/* Información contextual */}
            {simple ? (
              <div className={styles.simpleInfo}>
                {segment ? (
                  <>
                    <div className={styles.segHead}>
                      <span className={styles.segDot} style={{ background: segment.color }} />
                      <h3 className={styles.segName}>{segment.nombre}</h3>
                    </div>
                    <p className={styles.simpleSummary}>{segment.resumenSimple}</p>
                    <ul className={styles.reabsList}>
                      {segment.reabsorcion.map((r) => (
                        <li key={r.sustancia} className={styles.reabsItem}>
                          <span className={styles.reabsDot} style={{ background: substanceColor(r.sustancia) }} />
                          <span className={styles.reabsSust}>{substanceLabel(r.sustancia)}</span>
                          <span className={styles.reabsDet}>{r.detalle}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className={styles.consEmpty}>
                    Toca un segmento del nefrón (1–7) para ver, en lenguaje sencillo, qué reabsorbe o
                    secreta. Cambia a <strong>Avanzado</strong> para hacer zoom, bloquear transportadores
                    y simular fármacos y enfermedades.
                  </p>
                )}
              </div>
            ) : (
              <ConsequencePanel
                titulo={resolved?.titulo ?? 'Estado basal'}
                consequence={resolved?.consequence ?? null}
                ph={resolved?.ph}
                affected={resolved?.affected}
                segmentoNombre={resolved?.segmentoId ? SEGMENT_BY_ID[resolved.segmentoId]?.nombre : undefined}
                emptyHint={
                  view === 'cell'
                    ? 'Bloquea un transportador (toca su glifo), o elige un fármaco o una enfermedad, para ver el efecto en sangre, orina y equilibrio ácido-base.'
                    : 'Entra a una célula (toca un chip o una cuenta) y bloquea un transportador, o elige un fármaco o enfermedad, para simular su efecto.'
                }
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
