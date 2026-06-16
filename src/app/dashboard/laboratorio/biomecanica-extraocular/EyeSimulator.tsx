'use client';
// Orquestador del simulador de biomecánica extraocular. Mantiene el modo
// (individual / grupo), el sub-modo de grupo (sinergias / posiciones cardinales)
// y la selección activa; de ahí deriva el cuaternión objetivo del globo, qué
// músculos se iluminan y cuáles se atenúan, y se lo pasa a la escena 3D.

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import ControlsPanel from './ControlsPanel';
import {
  IDENTITY,
  MUSCLES,
  SYNERGIES,
  CARDINALS,
  quatFromMuscle,
  quatFromSynergy,
  quatFromCardinal,
} from './engine/kinematics';
import type { MuscleId } from './engine/muscles';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/biomecanicaExtraocular.module.css';

const EyeScene = dynamic(() => import('./EyeScene'), {
  ssr: false,
  loading: () => <div className={base.loadingMsg}>Cargando escena 3D…</div>,
});

const PREFS_KEY = 'medgo:biomecanica:prefs';

export type Mode = 'individual' | 'grupo';
export type GrupoSub = 'sinergia' | 'cardinal';

export default function EyeSimulator() {
  const [mode, setMode] = useState<Mode>('individual');
  const [grupoSub, setGrupoSub] = useState<GrupoSub>('sinergia');
  const [activeMuscle, setActiveMuscle] = useState<MuscleId | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [cardinalId, setCardinalId] = useState<string | null>(null);

  // Restaura preferencias de modo (no la selección activa).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.mode === 'individual' || p.mode === 'grupo') setMode(p.mode);
        if (p.grupoSub === 'sinergia' || p.grupoSub === 'cardinal') setGrupoSub(p.grupoSub);
      }
    } catch {}
  }, []);

  const persist = (next: Partial<{ mode: Mode; grupoSub: GrupoSub }>) => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      const prev = raw ? JSON.parse(raw) : {};
      localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prev, ...next }));
    } catch {}
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    persist({ mode: m });
    setActiveMuscle(null);
    setGroupId(null);
    setCardinalId(null);
  };

  const switchSub = (s: GrupoSub) => {
    setGrupoSub(s);
    persist({ grupoSub: s });
    setGroupId(null);
    setCardinalId(null);
  };

  // Deriva objetivo + resaltados a partir del estado.
  const { targetQuat, activeMuscles, focusMuscles } = useMemo(() => {
    const empty = new Set<MuscleId>();

    if (mode === 'individual') {
      if (activeMuscle) {
        const m = MUSCLES[activeMuscle];
        return {
          targetQuat: quatFromMuscle(m, 1),
          activeMuscles: new Set<MuscleId>([activeMuscle]),
          focusMuscles: new Set<MuscleId>([activeMuscle]),
        };
      }
      return { targetQuat: IDENTITY.clone(), activeMuscles: empty, focusMuscles: null };
    }

    // mode === 'grupo'
    if (grupoSub === 'sinergia' && groupId) {
      const g = SYNERGIES.find((s) => s.id === groupId)!;
      const set = new Set<MuscleId>(g.members);
      return { targetQuat: quatFromSynergy(g), activeMuscles: set, focusMuscles: set };
    }
    if (grupoSub === 'cardinal' && cardinalId) {
      const c = CARDINALS.find((p) => p.id === cardinalId)!;
      const set = new Set<MuscleId>([c.muscle]);
      return { targetQuat: quatFromCardinal(c), activeMuscles: set, focusMuscles: set };
    }
    return { targetQuat: IDENTITY.clone(), activeMuscles: empty, focusMuscles: null };
  }, [mode, grupoSub, activeMuscle, groupId, cardinalId]);

  // Evita re-render de la escena por nueva identidad de Set en cada pase: usamos
  // refs estables solo cuando hace falta; aquí basta con pasar los memos.
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMuscleDown = (id: MuscleId) => {
    if (mode === 'individual') setActiveMuscle(id);
  };
  const handleMuscleUp = () => {
    if (mode === 'individual') setActiveMuscle(null);
  };

  return (
    <div className={styles.sim}>
      <div className={styles.stageWrap} ref={sceneRef}>
        <div className={styles.stage}>
          <EyeScene
            targetQuat={targetQuat}
            activeMuscles={activeMuscles}
            focusMuscles={focusMuscles}
            onMuscleDown={handleMuscleDown}
            onMuscleUp={handleMuscleUp}
          />

          {activeMuscles.size > 0 && (
            <div className={styles.muscleTag}>
              {[...activeMuscles].map((id) => {
                const m = MUSCLES[id];
                return (
                  <div className={styles.muscleTagRow} key={id}>
                    <span className={styles.muscleTagDot} style={{ background: m.color }} />
                    <span className={styles.muscleTagName}>
                      <strong>{m.abrev}</strong> · {m.nombre}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <span className={styles.zoomHint}>Arrastra para rotar · rueda para acercar</span>
        </div>

        <ControlsPanel
          mode={mode}
          grupoSub={grupoSub}
          activeMuscle={activeMuscle}
          groupId={groupId}
          cardinalId={cardinalId}
          onSwitchMode={switchMode}
          onSwitchSub={switchSub}
          onMuscleDown={(id) => setActiveMuscle(id)}
          onMuscleUp={() => setActiveMuscle(null)}
          onSelectGroup={(id) => setGroupId((cur) => (cur === id ? null : id))}
          onSelectCardinal={(id) => setCardinalId((cur) => (cur === id ? null : id))}
        />
      </div>
    </div>
  );
}
