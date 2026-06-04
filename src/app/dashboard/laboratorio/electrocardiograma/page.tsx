'use client';
// Página del simulador EKG. Restaura el último modo, lo carga de forma diferida
// (solo el modo principal al entrar; los demás al seleccionarse, cacheados) y
// monta el simulador. Reutiliza el layout estándar del laboratorio.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TrackLabVisit from '@/components/TrackLabVisit';
import { MODES, DEFAULT_MODE, loadMode } from './modes/registry';
import type { ModeDefinition } from './engine/types';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/electrocardiograma.module.css';

const MODE_KEY = 'medgo:ekg:mode';

const EkgSimulator = dynamic(() => import('./EkgSimulator'), {
  ssr: false,
  loading: () => <div className={base.loadingMsg}>Cargando simulador…</div>,
});

export default function ElectrocardiogramaPage() {
  const [modeId, setModeId] = useState(DEFAULT_MODE);
  const [mode, setMode] = useState<ModeDefinition | null>(null);

  // Restaura el último modo elegido (si está implementado).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved && MODES.some((m) => m.id === saved && m.ready)) setModeId(saved);
    } catch {
      /* noop */
    }
  }, []);

  // Carga diferida + cacheada del modo seleccionado.
  useEffect(() => {
    let alive = true;
    setMode(null);
    loadMode(modeId).then((m) => {
      if (alive) setMode(m);
    });
    return () => {
      alive = false;
    };
  }, [modeId]);

  const selectMode = (id: string) => {
    setModeId(id);
    try {
      localStorage.setItem(MODE_KEY, id);
    } catch {
      /* noop */
    }
  };

  return (
    <div className={base.examPage}>
      <TrackLabVisit labId="electrocardiograma" />

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={base.counter}>Cardiovascular · DII</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>EKG en movimiento</span>
        <h2 className={styles.h2}>Del impulso eléctrico a la onda</h2>
        <p className={styles.sub}>
          Observa cómo cada punto del sistema de conducción genera una parte del trazado. Reproduce,
          pausa y arrastra el cursor para recorrer el latido.
        </p>
      </div>

      {mode ? (
        <EkgSimulator mode={mode} modes={MODES} onSelectMode={selectMode} />
      ) : (
        <div className={base.loadingMsg}>Cargando modo…</div>
      )}
    </div>
  );
}
