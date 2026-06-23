'use client';
// Orquestador principal: gestiona el estado global del simulador y conecta
// el panel de controles (ControlsPanel) con la escena 3D (SpinalCordScene).

import { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ControlsPanel, { type ViewMode } from './ControlsPanel';
import { SYNDROMES, type LevelId, type LaminaGroupId, type TractId, type MeningeId, type SyndromeId } from './engine/anatomy';
import styles from '@/styles/medulaEspinal.module.css';

const SpinalCordScene = dynamic(() => import('./SpinalCordScene'), { ssr: false });

const STORAGE_KEY = 'medula-espinal-prefs';

function loadPrefs(): { mode: ViewMode; level: LevelId } {
  if (typeof window === 'undefined') return { mode: 'completa', level: 'cervical' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { mode: parsed.mode ?? 'completa', level: parsed.level ?? 'cervical' };
    }
  } catch { /* ignore */ }
  return { mode: 'completa', level: 'cervical' };
}

function savePrefs(mode: ViewMode, level: LevelId) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, level })); } catch { /* ignore */ }
}

export default function SpinalCordSimulator() {
  const init = useMemo(() => loadPrefs(), []);

  const [mode, setMode] = useState<ViewMode>(init.mode);
  const [level, setLevel] = useState<LevelId>(init.level);
  const [selectedLamina, setSelectedLamina] = useState<LaminaGroupId | null>(null);
  const [selectedTract, setSelectedTract] = useState<TractId | null>(null);
  const [selectedSyndrome, setSelectedSyndrome] = useState<SyndromeId | null>(null);
  const [showAllLaminae, setShowAllLaminae] = useState(false);
  const [showDura, setShowDura] = useState(false);
  const [showRoots, setShowRoots] = useState(true);
  const [meningesVisible, setMeningesVisible] = useState<Record<MeningeId, boolean>>({
    piamadre: true,
    aracnoides: true,
    duramadre: true,
  });

  // ── Callbacks ──
  const switchMode = useCallback((m: ViewMode) => {
    setMode(m);
    setSelectedLamina(null);
    setSelectedTract(null);
    setSelectedSyndrome(null);
    setShowAllLaminae(false);
    savePrefs(m, level);
  }, [level]);

  const selectLevel = useCallback((l: LevelId) => {
    setLevel(l);
    setSelectedTract(null);
    savePrefs(mode, l);
  }, [mode]);

  const toggleMeninge = useCallback((id: MeningeId) => {
    setMeningesVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAllLaminae = useCallback(() => {
    setShowAllLaminae((prev) => !prev);
    if (showAllLaminae) setSelectedLamina(null);
  }, [showAllLaminae]);

  // ── Derived scene state ──
  const syn = selectedSyndrome ? SYNDROMES[selectedSyndrome] : null;

  const highlightTracts = useMemo(() => {
    const s = new Set<TractId>();
    if (syn) syn.tracts.forEach((t) => s.add(t));
    return s;
  }, [syn]);

  const highlightLaminae = useMemo(() => {
    const s = new Set<LaminaGroupId>();
    if (syn) syn.laminae.forEach((l) => s.add(l));
    return s;
  }, [syn]);

  const highlightSide = syn?.side ?? null;

  // Decide what to show in the scene based on mode
  const showTracts = mode === 'tractos' || mode === 'clinico';
  const showLaminae = mode === 'corte' && (showAllLaminae || selectedLamina !== null);
  const showMeninges = mode === 'meninges';

  return (
    <div className={styles.sim}>
      <div className={styles.stageWrap}>
        <div className={styles.stage}>
          <SpinalCordScene
            mode={mode}
            level={level}
            showTracts={showTracts}
            showLaminae={showLaminae}
            selectedLamina={selectedLamina}
            selectedTract={selectedTract}
            highlightTracts={highlightTracts}
            highlightLaminae={highlightLaminae}
            highlightSide={highlightSide}
            meningesVisible={meningesVisible}
            showMeninges={showMeninges}
            showDura={showDura}
            showRoots={showRoots}
            onClickLamina={mode === 'corte' ? (id) => setSelectedLamina((prev) => prev === id ? null : id) : undefined}
            onClickTract={mode === 'tractos' ? (id) => setSelectedTract((prev) => prev === id ? null : id) : undefined}
            onSelectRegion={selectLevel}
          />
          <span className={styles.zoomHint}>
            {mode === 'completa' ? 'Clic en una región · ver nivel' : 'Scroll · zoom'}&emsp;|&emsp;Drag · rotar
          </span>
        </div>

        <ControlsPanel
          mode={mode}
          level={level}
          selectedLamina={selectedLamina}
          selectedTract={selectedTract}
          selectedSyndrome={selectedSyndrome}
          meningesVisible={meningesVisible}
          showAllLaminae={showAllLaminae}
          showDura={showDura}
          showRoots={showRoots}
          onSwitchMode={switchMode}
          onSelectLevel={selectLevel}
          onSelectLamina={(id) => setSelectedLamina(id)}
          onSelectTract={(id) => setSelectedTract(id)}
          onSelectSyndrome={(id) => setSelectedSyndrome((prev) => prev === id ? null : id)}
          onToggleMeninge={toggleMeninge}
          onToggleAllLaminae={toggleAllLaminae}
          onToggleDura={() => setShowDura((v) => !v)}
          onToggleRoots={() => setShowRoots((v) => !v)}
        />
      </div>
    </div>
  );
}
