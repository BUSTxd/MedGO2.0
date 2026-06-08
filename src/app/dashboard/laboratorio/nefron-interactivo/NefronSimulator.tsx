'use client';
// Orquestador del simulador del nefrón. Mantiene la navegación (nefrón → segmento
// → célula), el modo simple/avanzado, el tema y el conjunto de transportadores
// desactivados, y compone el mapa, las vistas de zoom, los controles y el panel
// de consecuencias.

import { useEffect, useMemo, useState } from 'react';
import type { SegmentId } from './engine/types';
import { SEGMENT_BY_ID } from '@/lib/data/nefron/segments';
import { TRANSPORTERS } from '@/lib/data/nefron/transporters';
import { substanceColor, substanceLabel } from '@/lib/data/nefron/substances';
import { computeConsequence } from './engine/simulate';
import NefronMap from './NefronMap';
import SegmentView from './SegmentView';
import CellView from './CellView';
import ControlsPanel from './ControlsPanel';
import ConsequencePanel from './ConsequencePanel';
import styles from '@/styles/nefronInteractivo.module.css';

const PREFS_KEY = 'medgo:nefron:prefs';
const DARK_KEY = 'medgo-dark';

type View = 'nephron' | 'segment' | 'cell';

export default function NefronSimulator() {
  const [simple, setSimple] = useState(true);
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>('nephron');
  const [segId, setSegId] = useState<SegmentId | null>(null);
  const [cellId, setCellId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<SegmentId | null>(null);
  const [disabled, setDisabled] = useState<Set<string>>(new Set());

  // Restaura preferencias + tema.
  useEffect(() => {
    setDark(document.body.classList.contains('dark-mode'));
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.simple === 'boolean') setSimple(p.simple);
      }
    } catch {}
  }, []);

  const persist = (next: { simple: boolean }) => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {}
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.body.classList.toggle('dark-mode', next);
    try {
      localStorage.setItem(DARK_KEY, String(next));
    } catch {}
  };

  const setSimpleMode = (v: boolean) => {
    setSimple(v);
    persist({ simple: v });
    // Al volver a simple se regresa al nefrón completo.
    if (v) {
      setView('nephron');
      setCellId(null);
    }
  };

  const segment = segId ? SEGMENT_BY_ID[segId] : null;
  const cell = segment && cellId ? segment.celulas.find((c) => c.id === cellId) ?? null : null;

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
    setDisabled((prev) => {
      // Exclusividad en el MVP: una sola perturbación a la vez.
      if (prev.has(id)) return new Set();
      return new Set([id]);
    });
  };

  const result = useMemo(() => computeConsequence({ disabled }), [disabled]);
  const consTitle = result
    ? `Bloqueo: ${TRANSPORTERS[result.transporterId]?.sigla ?? ''}`
    : 'Estado basal';

  const backToNephron = () => {
    setView('nephron');
    setCellId(null);
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

      <div className={styles.simBody}>
        {/* ── ESCENARIO ── */}
        <div className={styles.stage}>
          {view === 'nephron' && (
            <NefronMap
              selectedId={segId}
              hoverId={hoverId}
              onSelect={handleSelectSegment}
              onHover={setHoverId}
            />
          )}
          {view === 'segment' && segment && (
            <SegmentView segment={segment} onSelectCell={handleSelectCell} />
          )}
          {view === 'cell' && segment && cell && (
            <CellView segment={segment} cell={cell} disabled={disabled} onToggle={toggleTransporter} />
          )}
        </div>

        {/* ── LADO ── */}
        <div className={styles.side}>
          <ControlsPanel
            simple={simple}
            onSimpleToggle={setSimpleMode}
            dark={dark}
            onDarkToggle={toggleDark}
            hasDisabled={disabled.size > 0}
            onReset={() => setDisabled(new Set())}
          />

          {/* Modo simple: resumen del segmento seleccionado */}
          {simple && (
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
                  secreta. Cambia a <strong>Avanzado</strong> para hacer zoom y bloquear transportadores.
                </p>
              )}
            </div>
          )}

          {/* Modo avanzado: panel de consecuencias */}
          {!simple && (
            <ConsequencePanel
              titulo={consTitle}
              consequence={result?.consequence ?? null}
              emptyHint={
                view === 'cell'
                  ? 'Bloquea un transportador (toca su insignia) para ver el efecto en sangre, orina y equilibrio ácido-base.'
                  : 'Entra a una célula y bloquea un transportador para simular su efecto en tiempo real.'
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
