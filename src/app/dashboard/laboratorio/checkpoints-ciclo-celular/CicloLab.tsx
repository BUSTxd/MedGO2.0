'use client';
// Vista raíz del laboratorio «Checkpoints del ciclo celular».
//
//   anillo ──marcador──▶ (zoom) ──▶ checkpoint(modo) ──Esc/volver──▶ anillo
//   checkpoint ──mini-mapa──▶ otro checkpoint (fundido, sin volver al anillo)
//
// Todo vive en una sola ruta; el estado se refleja en la URL (`?cp=g2m&modo=
// aprender`, `?cp=huso&paso=4`, `?vista=intro`) con `history.replaceState`,
// para poder compartir o volver a un punto exacto sin navegaciones de Next.

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CheckpointId } from '@/lib/data/ciclo-celular/tipos';
import { CHECKPOINT_POR_ID, INTRO, MARCADORES, compilado, siguienteCheckpoint } from '@/lib/ciclo-celular/registro';
import { leerProgreso, marcarExplorado, type Progreso } from '@/lib/ciclo-celular/progreso';
import Anillo from './Anillo';
import Explorar from './Explorar';
import Aprender from './Aprender';
import Prueba, { PruebaIntegrada } from './Prueba';
import type { Destino } from './Paneles';
import s from '@/styles/cicloCelular.module.css';

type Modo = 'explorar' | 'aprender' | 'prueba';
type Vista =
  | { v: 'anillo'; desde?: CheckpointId | null }
  | { v: 'intro' }
  | { v: 'integrada' }
  | { v: 'cp'; id: CheckpointId; modo: Modo; paso?: number; actor?: string | null; n: number };

const MODOS: { id: Modo; nombre: string }[] = [
  { id: 'explorar', nombre: 'Explorar' },
  { id: 'aprender', nombre: 'Aprender' },
  { id: 'prueba', nombre: 'Prueba' },
];

function leerUrl(): Vista {
  if (typeof window === 'undefined') return { v: 'anillo' };
  const q = new URLSearchParams(window.location.search);
  const vista = q.get('vista');
  if (vista === 'intro') return { v: 'intro' };
  if (vista === 'integrada') return { v: 'integrada' };
  const cp = q.get('cp') as CheckpointId | null;
  if (cp && CHECKPOINT_POR_ID[cp]) {
    const modo = (MODOS.some((m) => m.id === q.get('modo')) ? q.get('modo') : 'explorar') as Modo;
    const paso = Number(q.get('paso'));
    return { v: 'cp', id: cp, modo, paso: Number.isFinite(paso) && paso > 0 ? paso : 0, n: 0 };
  }
  return { v: 'anillo' };
}

function escribirUrl(v: Vista, paso?: number) {
  const q = new URLSearchParams();
  if (v.v === 'intro' || v.v === 'integrada') q.set('vista', v.v);
  if (v.v === 'cp') {
    q.set('cp', v.id);
    if (v.modo !== 'explorar') q.set('modo', v.modo);
    if (v.modo === 'explorar' && paso) q.set('paso', String(paso));
  }
  const url = `${window.location.pathname}${q.size ? `?${q}` : ''}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
}

export default function CicloLab() {
  const [vista, setVista] = useState<Vista>(leerUrl);
  const [progreso, setProgreso] = useState<Progreso>(() => leerProgreso());
  const refrescar = useCallback(() => setProgreso(leerProgreso()), []);

  useEffect(() => { escribirUrl(vista, vista.v === 'cp' ? vista.paso : undefined); }, [vista]);

  const volver = useCallback(() => {
    setVista((v) => ({ v: 'anillo', desde: v.v === 'cp' ? v.id : null }));
  }, []);

  // Esc vuelve al anillo desde cualquier vista.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || vista.v === 'anillo') return;
      if (document.querySelector('[role="dialog"][data-bloquea-esc]')) return;
      volver();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vista.v, volver]);

  const abrir = useCallback((id: CheckpointId, modo: Modo = 'explorar', paso = 0, actor: string | null = null) => {
    setVista((v) => ({ v: 'cp', id, modo, paso, actor, n: (v.v === 'cp' ? v.n : 0) + 1 }));
  }, []);

  const irDestino = useCallback((d: Destino) => {
    const cp = CHECKPOINT_POR_ID[d.cp];
    const i = Math.max(0, cp.pasos.findIndex((p) => p.id === d.paso));
    abrir(d.cp, 'explorar', i, d.actor);
  }, [abrir]);

  const verPaso = useCallback((id: CheckpointId, pasoId: string | null) => {
    const cp = CHECKPOINT_POR_ID[id];
    const i = pasoId ? Math.max(0, cp.pasos.findIndex((p) => p.id === pasoId)) : 0;
    const actor = pasoId ? cp.pasos[i]?.protagonistas[0] ?? null : null;
    abrir(id, 'explorar', i, actor);
  }, [abrir]);

  const onPaso = useCallback((i: number) => {
    setVista((v) => (v.v === 'cp' && v.paso !== i ? { ...v, paso: i } : v));
  }, []);

  if (vista.v === 'anillo') {
    return (
      <div className={s.lab}>
        <Link href="/dashboard/laboratorio" className={s.volverLab}>
          <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Laboratorio
        </Link>
        <Anillo
          key={`anillo-${vista.desde ?? ''}`}
          progreso={progreso}
          desde={vista.desde}
          onElegir={(id) => abrir(id)}
          onIntro={() => setVista({ v: 'intro' })}
          onIntegrada={() => setVista({ v: 'integrada' })}
        />
      </div>
    );
  }

  if (vista.v === 'intro') {
    return (
      <div className={s.lab}>
        <Cabecera titulo="Antes de empezar" subtitulo="El motor ciclina–CDK, los frenos y la alarma de daño" onVolver={volver} />
        <div className={s.entrada}>
          <Explorar
            escenario={INTRO}
            compilado={compilado(INTRO)}
            onVolver={volver}
            textoVolver="Ir al ciclo"
            onDestino={irDestino}
          />
        </div>
      </div>
    );
  }

  if (vista.v === 'integrada') {
    return (
      <div className={s.lab}>
        <Cabecera titulo="Prueba integrada" subtitulo="Los cinco checkpoints mezclados" onVolver={volver} />
        <div className={s.entrada}>
          <PruebaIntegrada onVer={verPaso} onProgreso={refrescar} />
        </div>
      </div>
    );
  }

  return <VistaCheckpoint vista={vista} progreso={progreso} abrir={abrir} volver={volver} irDestino={irDestino} verPaso={verPaso} onPaso={onPaso} refrescar={refrescar} />;
}

function Cabecera({ titulo, subtitulo, onVolver, children }: { titulo: string; subtitulo?: string; onVolver: () => void; children?: React.ReactNode }) {
  return (
    <header className={s.cabecera}>
      <button type="button" className={s.btnVolver} onClick={onVolver} aria-label="Volver al ciclo (Esc)">
        <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className={s.cabeceraTitulo}>
        <h2>{titulo}</h2>
        {subtitulo && <p>{subtitulo}</p>}
      </div>
      {children}
    </header>
  );
}

function VistaCheckpoint({ vista, progreso, abrir, volver, irDestino, verPaso, onPaso, refrescar }: {
  vista: Extract<Vista, { v: 'cp' }>;
  progreso: Progreso;
  abrir: (id: CheckpointId, modo?: Modo, paso?: number, actor?: string | null) => void;
  volver: () => void;
  irDestino: (d: Destino) => void;
  verPaso: (id: CheckpointId, pasoId: string | null) => void;
  onPaso: (i: number) => void;
  refrescar: () => void;
}) {
  const cp = CHECKPOINT_POR_ID[vista.id];
  const c = useMemo(() => compilado(cp), [cp]);
  const sig = siguienteCheckpoint(cp.id);
  const irSig = sig ? () => abrir(sig.id) : null;
  const onFinal = useCallback(() => { marcarExplorado(cp.id); refrescar(); }, [cp.id, refrescar]);

  return (
    <div className={s.lab}>
      <Cabecera titulo={cp.nombre} subtitulo={`Fase ${cp.fase} · ${cp.pregunta}`} onVolver={volver}>
        <div className={s.miniMapa}>
          <Anillo progreso={progreso} mini activo={cp.id} onElegir={(id) => id !== cp.id && abrir(id, vista.modo)} />
        </div>
        <nav className={s.modos} aria-label="Modo">
          {MODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={vista.modo === m.id ? s.modoActivo : ''}
              aria-current={vista.modo === m.id ? 'page' : undefined}
              onClick={() => abrir(cp.id, m.id)}
            >{m.nombre}</button>
          ))}
        </nav>
      </Cabecera>
      <div
        key={`${vista.id}-${vista.modo}-${vista.n}`}
        className={s.entrada}
        style={{ ['--origen' as string]: `${((MARCADORES[cp.id].angulo % 360) / 360) * 100}% 40%` }}
      >
        {vista.modo === 'explorar' && (
          <Explorar
            escenario={cp}
            compilado={c}
            pasoInicial={vista.paso ?? 0}
            actorInicial={vista.actor ?? null}
            onPaso={onPaso}
            onFinal={onFinal}
            onAprender={() => abrir(cp.id, 'aprender')}
            onSiguiente={irSig}
            onVolver={volver}
            onDestino={irDestino}
          />
        )}
        {vista.modo === 'aprender' && (
          <Aprender
            checkpoint={cp}
            compilado={c}
            onVerPaso={(pasoId) => verPaso(cp.id, pasoId)}
            onExplorar={() => abrir(cp.id, 'explorar')}
            onSiguiente={irSig}
            onProgreso={refrescar}
          />
        )}
        {vista.modo === 'prueba' && (
          <Prueba checkpoint={cp} compilado={c} onVer={verPaso} onProgreso={refrescar} onSiguiente={irSig} />
        )}
      </div>
    </div>
  );
}
