'use client';
// Vista raíz del laboratorio «Hipersensibilidad».
//
//   portada (intro → capítulos) ──capítulo──▶ explorar ──siguiente──▶ …
//
// Una sola ruta; el estado va en la URL (`?parte=tipo-2&paso=3`).

import { useCallback, useEffect, useState } from 'react';
import type { ParteId } from '@/lib/data/hipersensibilidad/tipos';
import { PARTE_POR_ID, PARTES, siguienteParte } from '@/lib/hipersensibilidad/registro';
import Portada from './Portada';
import Explorar from './Explorar';
import { PanelTabla, type Destino } from './Ficha';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

type Vista = { v: 'portada'; sinIntro?: boolean } | { v: 'parte'; id: ParteId; paso: number; n: number };

function leerUrl(): Vista {
  if (typeof window === 'undefined') return { v: 'portada' };
  const q = new URLSearchParams(window.location.search);
  const id = q.get('parte') as ParteId | null;
  if (id && PARTE_POR_ID[id]) {
    const paso = Number(q.get('paso'));
    return { v: 'parte', id, paso: Number.isFinite(paso) && paso > 0 ? paso : 0, n: 0 };
  }
  return { v: 'portada' };
}

function escribirUrl(v: Vista) {
  const q = new URLSearchParams();
  if (v.v === 'parte') { q.set('parte', v.id); if (v.paso) q.set('paso', String(v.paso)); }
  const url = `${window.location.pathname}${q.size ? `?${q}` : ''}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
}

export default function HipersensibilidadLab() {
  const [vista, setVista] = useState<Vista>(leerUrl);
  const [tabla, setTabla] = useState(false);
  useEffect(() => { escribirUrl(vista); }, [vista]);

  const portada = useCallback(() => setVista({ v: 'portada', sinIntro: true }), []);
  const abrir = useCallback((id: ParteId, paso = 0) => setVista((v) => ({ v: 'parte', id, paso, n: (v.v === 'parte' ? v.n : 0) + 1 })), []);
  const irDestino = useCallback((d: Destino) => {
    setTabla(false);
    abrir(d.parte, Math.max(0, PARTE_POR_ID[d.parte].pasos.findIndex((p) => p.id === d.paso)));
  }, [abrir]);
  const onPaso = useCallback((i: number) => setVista((v) => (v.v === 'parte' && v.paso !== i ? { ...v, paso: i } : v)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || vista.v === 'portada') return;
      if (document.querySelector('[role="dialog"][data-bloquea-esc]')) return;
      portada();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vista.v, portada]);

  const panel = tabla && <PanelTabla onCerrar={() => setTabla(false)} onIr={irDestino} />;

  if (vista.v === 'portada') {
    return (
      <div className={c.lab}>
        <Portada sinIntro={vista.sinIntro} onParte={(id) => abrir(id)} onTabla={() => setTabla(true)} />
        {panel}
      </div>
    );
  }

  const parte = PARTE_POR_ID[vista.id];
  const sig = siguienteParte(vista.id);
  return (
    <div className={c.lab}>
      <header className={`${c.cabecera} ${s.cabeceraLinf}`}>
        <button type="button" className={c.btnVolver} onClick={portada} aria-label="Volver a los capítulos (Esc)">
          <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={c.cabeceraTitulo}>
          <h2>{parte.nombre}</h2>
          <p>{parte.tipo} · {parte.lugar} · {parte.pregunta}</p>
        </div>
        <nav className={s.selectorPartes} aria-label="Capítulo">
          {PARTES.map((p) => (
            <button key={p.id} type="button" className={p.id === parte.id ? s.parteActiva : ''} style={{ ['--parte' as string]: p.color }} aria-current={p.id === parte.id ? 'page' : undefined} onClick={() => abrir(p.id)} title={p.nombre}>
              <span>{p.numero}</span>{p.nombreCorto}
            </button>
          ))}
        </nav>
        <button type="button" className={c.btnFlot} onClick={() => setTabla(true)}>Tabla</button>
      </header>
      <div key={`${vista.id}-${vista.n}`} className={c.entrada}>
        <Explorar parte={parte} pasoInicial={vista.paso} onPaso={onPaso} onSiguiente={sig ? () => abrir(sig.id) : null} onVolver={portada} />
      </div>
      {panel}
    </div>
  );
}
