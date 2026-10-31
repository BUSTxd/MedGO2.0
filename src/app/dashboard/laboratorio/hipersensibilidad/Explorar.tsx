'use client';
// Modo Explorar de un capítulo: el reproductor de maduración (barra de
// capítulos, velocidad, teclado) con la narración en texto animado y la
// ficha de cada célula al tocarla. Copia de «Maduración de linfocitos».

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Parte } from '@/lib/data/hipersensibilidad/tipos';
import { compilado as compilar } from '@/lib/hipersensibilidad/contenido';
import Escena from './Escena';
import BarraTiempo from './BarraTiempo';
import TextoAnimado from '../maduracion-linfocitos/TextoAnimado';
import { FichaActor } from './Ficha';
import { useReproductor, VELOCIDADES } from './useReproductor';
import { useVoz } from './useVoz';
import ControlVoz from './ControlVoz';
import { useModo } from '../maduracion-linfocitos/useModo';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';

type Props = {
  parte: Parte;
  pasoInicial?: number;
  onPaso?: (i: number) => void;
  onSiguiente: (() => void) | null;
  onVolver: () => void;
};

type Voz = ReturnType<typeof useVoz>;

export function Controles({ rep, total, voz }: { rep: ReturnType<typeof useReproductor>; total: number; voz?: Voz }) {
  return (
    <div className={c.controles}>
      <button type="button" className={c.btnIcono} onClick={rep.anterior} disabled={rep.paso === 0 && rep.t < 400} aria-label="Paso anterior" title="Anterior (←)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className={`${c.btnIcono} ${c.btnPlay}`} onClick={() => { if (!rep.reproduciendo) voz?.desbloquear(); rep.alternar(); }} aria-label={rep.reproduciendo ? 'Pausar' : 'Reproducir'} title="Reproducir / pausar (espacio)">
        {rep.reproduciendo
          ? <svg viewBox="0 0 20 20" aria-hidden><rect x="5.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" /><rect x="11.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" /></svg>
          : <svg viewBox="0 0 20 20" aria-hidden><path d="M7 4.5v11l9-5.5z" fill="currentColor" /></svg>}
      </button>
      <button type="button" className={c.btnIcono} onClick={rep.siguiente} disabled={rep.paso >= total - 1} aria-label="Siguiente paso" title="Siguiente (→)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M7.5 4.5L13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className={c.btnIcono} onClick={rep.reiniciar} aria-label="Reiniciar" title="Reiniciar (R)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1M4.5 4v3.5H8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {voz?.hay && <ControlVoz voz={voz} />}
      <div className={c.velocidad} role="group" aria-label="Velocidad">
        {VELOCIDADES.map((v) => (
          <button key={v} type="button" className={rep.velocidad === v ? c.velActiva : ''} onClick={() => rep.setVelocidad(v)} aria-pressed={rep.velocidad === v}>{String(v).replace('.', ',')}×</button>
        ))}
      </div>
    </div>
  );
}

function Narracion({ parte, indice }: { parte: Parte; indice: number }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const p = parte.pasos[indice];
  const max = Math.max(...parte.pasos.map((x) => x.orden));
  const abiertoAqui = abierto === p.id;
  const hayMas = !!(p.profundiza || p.clinica);
  return (
    <div className={c.narracion} aria-live="polite">
      <h3 className={c.narracionCab}>
        <span className={c.narracionNum}>{p.orden === 0 ? 'Inicio' : `Paso ${p.orden} de ${max}`}</span>
        <span className={c.narracionSep} aria-hidden> · </span>
        <span className={c.narracionTitulo}><TextoAnimado id={`t-${p.id}`} texto={p.titulo} paso={40} /></span>
      </h3>
      <p className={c.narracionTexto}>
        <TextoAnimado id={p.id} texto={p.texto} claves={p.claves} retraso={180} />
        {hayMas && (
          <>
            {' '}
            <button type="button" className={`${c.profundizaBtn} ${abiertoAqui ? c.profundizaAbierto : ''}`} aria-expanded={abiertoAqui} onClick={() => setAbierto(abiertoAqui ? null : p.id)}>
              Profundizar
              <svg viewBox="0 0 12 12" aria-hidden><path d="M3 4.5L6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>
        )}
      </p>
      {hayMas && abiertoAqui && (
        <div className={c.profundiza}>
          {p.profundiza && <p>{p.profundiza}</p>}
          {p.clinica && (
            <div className={c.clinica}>
              <p className={c.fichaRotulo}>Correlación clínica</p>
              <p>{p.clinica}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Explorar({ parte, pasoInicial = 0, onPaso, onSiguiente, onVolver }: Props) {
  const zona = useRef<HTMLDivElement>(null);
  const modo = useModo(zona);
  const compilado = useMemo(() => compilar(parte, modo), [parte, modo]);
  const rep = useReproductor(compilado, pasoInicial, { autoInicial: pasoInicial === 0 });
  const voz = useVoz(parte.narracion, rep);
  const [visto, setVisto] = useState<Set<number>>(() => new Set([pasoInicial]));
  const [ficha, setFicha] = useState<string | null>(null);
  const [reset, setReset] = useState(0);
  const total = compilado.pasos.length;
  const ultimo = rep.paso === total - 1 && rep.terminado;

  useEffect(() => {
    onPaso?.(rep.paso);
    if (rep.arrastrando) return;
    setVisto((v) => (v.has(rep.paso) ? v : new Set(v).add(rep.paso)));
  }, [rep.paso, rep.arrastrando, onPaso]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (el?.getAttribute?.('role') === 'slider') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); rep.siguiente(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); rep.anterior(); }
      else if (e.key === ' ' && el?.tagName !== 'BUTTON') { e.preventDefault(); if (!rep.reproduciendo) voz.desbloquear(); rep.alternar(); }
      else if (e.key === 'r' || e.key === 'R') rep.reiniciar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rep, voz]);

  return (
    <div className={`${c.vista} ${c.vistaAncha}`}>
      <div ref={zona} className={`${c.escenaZona} ${s.escenaLinf}`}>
        <Escena
          escenario={parte}
          escena={rep.escena}
          resaltar={ficha ? [ficha] : null}
          seleccionado={ficha}
          onActor={(k) => setFicha((f) => (f === k ? null : k))}
          onInteraccion={() => { if (rep.reproduciendo) rep.pausar(); }}
          vistaReset={reset}
        />
        <div className={c.escenaBotones}>
          <button type="button" className={`${c.btnFlot} ${s.btnEncuadrar}`} onClick={() => setReset((r) => r + 1)}>Encuadrar todo</button>
        </div>
        {ficha && (
          <div className={c.fichaPanel}>
            <FichaActor escenario={parte} actor={ficha} onCerrar={() => setFicha(null)} />
          </div>
        )}
        {voz.bloqueada && !rep.reproduciendo && (
          <div className={c.cierre} role="region" aria-label="Empezar con voz">
            <button type="button" className={c.btnPrim} onClick={() => { voz.desbloquear(); rep.alternar(); }}>▶ Reproducir con voz</button>
          </div>
        )}
        {ultimo && (
          <div className={c.cierre} role="region" aria-label="Fin del capítulo">
            {onSiguiente && <button type="button" className={c.btnPrim} onClick={onSiguiente}>Siguiente capítulo</button>}
            <button type="button" className={c.btnSec} onClick={onVolver}>Volver a los capítulos</button>
          </div>
        )}
        <p className={`${s.credito} ${h.credito}`}>Células y microfotografías: Robbins, Patología humana (cap. 6) · Servier Medical Art (CC BY-SA 3.0)</p>
      </div>
      <div className={c.pie}>
        <BarraTiempo rep={rep} escenario={parte} visto={visto} />
        <div className={c.pieFila}>
          <Controles rep={rep} total={total} voz={voz} />
          <Narracion parte={parte} indice={rep.paso} />
        </div>
      </div>
    </div>
  );
}
