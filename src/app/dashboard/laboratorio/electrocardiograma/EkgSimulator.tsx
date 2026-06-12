'use client';
// Orquestador del simulador. Mantiene la ÚNICA variable de tiempo compartida (t,
// en tiempo global de la ventana) de la que dependen el corazón y el trazado: al
// reproducir avanza con rAF, al pausar se congela, y al arrastrar el cursor del
// EKG se fija manualmente. Así ambos paneles muestran siempre el mismo instante.

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { ModeDefinition, ModeMeta, EkgPrefs } from './engine/types';
import HeartSchema from './HeartSchema';
import EkgTrace from './EkgTrace';
import ControlsPanel from './ControlsPanel';
import MiniLeads from './MiniLeads';
import styles from '@/styles/electrocardiograma.module.css';

const PREFS_KEY = 'medgo:ekg:prefs';

function loadPrefs(): EkgPrefs {
  const fallback: EkgPrefs = { speed: 1, grid: true, labels: true, explanation: true, ampScale: 1, timeScale: 1 };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<EkgPrefs>) };
  } catch {
    return fallback;
  }
}

interface Props {
  mode: ModeDefinition;
  modes: ModeMeta[];
  onSelectMode: (id: string) => void;
}

export default function EkgSimulator({ mode, modes, onSelectMode }: Props) {
  const windowMs = mode.windowMs;

  // Tiempo compartido: tRef es la fuente; tState fuerza el render sincronizado.
  const tRef = useRef(0);
  const [tState, setTState] = useState(0);

  const [playing, setPlaying] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [pauseAtAv, setPauseAtAv] = useState(false);

  const [prefs, setPrefs] = useState<EkgPrefs>({ speed: 1, grid: true, labels: true, explanation: true, ampScale: 1, timeScale: 1 });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
    setDark(document.body.classList.contains('dark-mode'));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* noop */
    }
  }, [prefs]);

  // Al cambiar de modo, reinicia el recorrido.
  useEffect(() => {
    tRef.current = 0;
    setTState(0);
    setPlaying(false);
  }, [mode]);

  const speedRef = useRef(prefs.speed);
  const pauseAtAvRef = useRef(pauseAtAv);
  speedRef.current = prefs.speed;
  pauseAtAvRef.current = pauseAtAv;

  const setT = useCallback((v: number) => {
    tRef.current = v;
    setTState(v);
  }, []);

  // ── Loop de reproducción ──
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) * speedRef.current;
      last = now;
      let next = tRef.current + dt;
      if (next >= windowMs) next -= windowMs;

      // Pausa automática al llegar al nodo AV (entrada al segmento PR).
      if (pauseAtAvRef.current) {
        const prevSeg = mode.phaseAt(tRef.current).segment;
        const nextSeg = mode.phaseAt(next).segment;
        if (nextSeg === 'PRseg' && prevSeg !== 'PRseg') {
          tRef.current = next;
          setTState(next);
          setPlaying(false);
          return;
        }
      }

      tRef.current = next;
      setTState(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, windowMs, mode]);

  // Estado fisiológico derivado del instante actual.
  const phase = useMemo(() => mode.phaseAt(tState), [mode, tState]);

  // ── Acciones ──
  const onReset = () => {
    setPlaying(false);
    setT(0);
  };
  const onScrub = (v: number) => setT(Math.max(0, Math.min(windowMs, v)));

  const onStep = (dir: 1 | -1) => {
    setPlaying(false);
    const stops = mode.stepStops;
    if (stops.length === 0) return;
    const cur = tRef.current;
    if (dir === 1) {
      const nb = stops.find((s) => s > cur + 0.5);
      setT(nb !== undefined ? nb : stops[0]);
    } else {
      const prev = [...stops].reverse().find((s) => s < cur - 0.5);
      setT(prev !== undefined ? prev : stops[stops.length - 1]);
    }
  };

  const onDarkToggle = () => {
    setDark((d) => {
      const next = !d;
      document.body.classList.toggle('dark-mode', next);
      try {
        localStorage.setItem('medgo-dark', String(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const patch = (p: Partial<EkgPrefs>) => setPrefs((prev) => ({ ...prev, ...p }));

  return (
    <>
      <div className={styles.simWrap}>
        <div className={styles.mainCol}>
          <div className={styles.heartArea}>
            <HeartSchema phase={phase} showEctopic={mode.showEctopic} />
          </div>

          <div
            className={styles.traceArea}
            style={{ '--ampScale': prefs.ampScale } as CSSProperties}
          >
            <EkgTrace
              sampleAt={mode.sampleAt}
              t={tState}
              windowMs={windowMs}
              phase={phase}
              showGrid={prefs.grid}
              showLabels={prefs.labels}
              paused={!playing}
              dark={dark}
              ampScale={prefs.ampScale}
              timeScale={prefs.timeScale}
              onScrub={onScrub}
            />
          </div>

          {mode.miniLeads && <MiniLeads leads={mode.miniLeads} dark={dark} />}

          {prefs.explanation && (
            <div className={styles.explainCard}>
              <p className={styles.explainKey}>{mode.keyMessage}</p>
              <p className={styles.explainPhase}>
                <span className={styles.explainTag}>{phase.ekgLabel}</span>
                {phase.explanation}
              </p>
            </div>
          )}
        </div>

        <ControlsPanel
          modes={modes}
          currentMode={mode.id}
          onSelectMode={onSelectMode}
          playing={playing}
          onPlayToggle={() => setPlaying((p) => !p)}
          onReset={onReset}
          speed={prefs.speed}
          onSpeed={(s) => patch({ speed: s })}
          vZoom={prefs.ampScale}
          onVZoom={(v) => patch({ ampScale: v })}
          hZoom={prefs.timeScale}
          onHZoom={(v) => patch({ timeScale: v })}
          stepMode={stepMode}
          onStepToggle={() => {
            setStepMode((s) => !s);
            setPlaying(false);
          }}
          onStep={onStep}
          pauseAtAv={pauseAtAv}
          onPauseAtAvToggle={() => setPauseAtAv((v) => !v)}
          labels={prefs.labels}
          onLabelsToggle={() => patch({ labels: !prefs.labels })}
          explanation={prefs.explanation}
          onExplanationToggle={() => patch({ explanation: !prefs.explanation })}
          grid={prefs.grid}
          onGridToggle={() => patch({ grid: !prefs.grid })}
          dark={dark}
          onDarkToggle={onDarkToggle}
        />
      </div>

      <p className={styles.disclaimer}>
        Simulador educativo. No reemplaza la interpretación clínica profesional del electrocardiograma.
      </p>
    </>
  );
}
