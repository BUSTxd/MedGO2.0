'use client';
// Vista raíz del laboratorio «Vías NF-κB y JAK/STAT».
//
//   portada (intro → esquema de las tres vías) ──vía──▶ explorar ──▶ estudio
//
// Una sola ruta; el estado va en la URL (`?via=clasica&paso=3`,
// `?vista=estudio`) con `history.replaceState`, como en el ciclo celular.

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ViaId } from '@/lib/data/vias-nfkb/tipos';
import { compilado, siguienteVia, VIA_POR_ID, VIAS } from '@/lib/vias-nfkb/registro';
import Portada from './Portada';
import Explorar from './Explorar';
import Estudio from './Estudio';
import { Inventario, type Destino } from './Ficha';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

type Vista =
  | { v: 'portada'; sinIntro?: boolean }
  | { v: 'via'; id: ViaId; paso: number; actor?: string | null; n: number }
  | { v: 'estudio'; desde?: ViaId | null };

function leerUrl(): Vista {
  if (typeof window === 'undefined') return { v: 'portada' };
  const q = new URLSearchParams(window.location.search);
  if (q.get('vista') === 'estudio') return { v: 'estudio' };
  const via = q.get('via') as ViaId | null;
  if (via && VIA_POR_ID[via]) {
    const paso = Number(q.get('paso'));
    return { v: 'via', id: via, paso: Number.isFinite(paso) && paso > 0 ? paso : 0, n: 0 };
  }
  return { v: 'portada' };
}

function escribirUrl(v: Vista) {
  const q = new URLSearchParams();
  if (v.v === 'estudio') q.set('vista', 'estudio');
  if (v.v === 'via') { q.set('via', v.id); if (v.paso) q.set('paso', String(v.paso)); }
  const url = `${window.location.pathname}${q.size ? `?${q}` : ''}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
}

export default function ViasLab() {
  const [vista, setVista] = useState<Vista>(leerUrl);
  const [inventario, setInventario] = useState(false);

  useEffect(() => { escribirUrl(vista); }, [vista]);

  const portada = useCallback(() => setVista({ v: 'portada', sinIntro: true }), []);
  const abrir = useCallback((id: ViaId, paso = 0, actor: string | null = null) => {
    setVista((v) => ({ v: 'via', id, paso, actor, n: (v.v === 'via' ? v.n : 0) + 1 }));
  }, []);
  const irDestino = useCallback((d: Destino) => {
    setInventario(false);
    const via = VIA_POR_ID[d.via];
    abrir(d.via, Math.max(0, via.pasos.findIndex((p) => p.id === d.paso)), d.actor ?? null);
  }, [abrir]);
  const onPaso = useCallback((i: number) => setVista((v) => (v.v === 'via' && v.paso !== i ? { ...v, paso: i } : v)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || vista.v === 'portada') return;
      if (document.querySelector('[role="dialog"][data-bloquea-esc]')) return;
      portada();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vista.v, portada]);

  const inv = inventario && <Inventario onCerrar={() => setInventario(false)} onIr={irDestino} />;

  if (vista.v === 'portada') {
    return (
      <div className={c.lab}>
        <Portada sinIntro={vista.sinIntro} onVia={(id) => abrir(id)} onEstudio={() => setVista({ v: 'estudio' })} onInventario={() => setInventario(true)} onDestino={irDestino} />
        {inv}
      </div>
    );
  }

  const viaActiva = vista.v === 'via' ? vista.id : vista.desde ?? null;

  return (
    <div className={c.lab}>
      <header className={c.cabecera}>
        <button type="button" className={c.btnVolver} onClick={portada} aria-label="Volver a las tres vías (Esc)">
          <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={c.cabeceraTitulo}>
          <h2>{vista.v === 'via' ? VIA_POR_ID[vista.id].nombre : 'Modo estudio'}</h2>
          <p>{vista.v === 'via' ? VIA_POR_ID[vista.id].pregunta : 'Las tres vías a la vez: arrastra cada pieza a su sitio'}</p>
        </div>
        <nav className={s.selectorVias} aria-label="Vía">
          {VIAS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={vista.v === 'via' && vista.id === v.id ? s.viaActiva : ''}
              style={{ ['--via' as string]: v.color }}
              aria-current={vista.v === 'via' && vista.id === v.id ? 'page' : undefined}
              onClick={() => abrir(v.id)}
            >{v.nombreCorto}</button>
          ))}
        </nav>
        <nav className={c.modos} aria-label="Modo">
          <button type="button" className={vista.v === 'via' ? c.modoActivo : ''} onClick={() => abrir(viaActiva ?? 'clasica')}>Explorar</button>
          <button type="button" className={vista.v === 'estudio' ? c.modoActivo : ''} onClick={() => setVista({ v: 'estudio', desde: viaActiva })}>Estudio</button>
        </nav>
        <button type="button" className={c.btnFlot} onClick={() => setInventario(true)}>Proteínas</button>
      </header>
      <div key={vista.v === 'via' ? `${vista.id}-${vista.n}` : 'estudio'} className={c.entrada}>
        {vista.v === 'via'
          ? <VistaVia vista={vista} onPaso={onPaso} abrir={abrir} portada={portada} irDestino={irDestino} onEstudio={() => setVista({ v: 'estudio', desde: vista.id })} />
          : <Estudio viaInicial={vista.desde} onExplorar={(id) => abrir(id)} />}
      </div>
      {inv}
    </div>
  );
}

function VistaVia({ vista, onPaso, abrir, portada, irDestino, onEstudio }: {
  vista: Extract<Vista, { v: 'via' }>;
  onPaso: (i: number) => void;
  abrir: (id: ViaId) => void;
  portada: () => void;
  irDestino: (d: Destino) => void;
  onEstudio: () => void;
}) {
  const via = VIA_POR_ID[vista.id];
  const cmp = useMemo(() => compilado(via), [via]);
  const sig = siguienteVia(via.id);
  return (
    <Explorar
      via={via}
      compilado={cmp}
      pasoInicial={vista.paso}
      actorInicial={vista.actor ?? null}
      onPaso={onPaso}
      onEstudio={onEstudio}
      onSiguiente={sig ? () => abrir(sig.id) : null}
      onVolver={portada}
      onDestino={irDestino}
    />
  );
}
