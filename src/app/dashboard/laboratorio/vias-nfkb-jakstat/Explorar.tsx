'use client';
// Modo Explorar: una vía paso a paso con narración, «Profundizar», correlación
// clínica, línea de tiempo y ficha de cada proteína. Igual que el del ciclo
// celular, más un selector para saltar entre la fisiología y las alteraciones
// del linfoma de Hodgkin clásico.

import { useEffect, useState } from 'react';
import type { Via } from '@/lib/data/vias-nfkb/tipos';
import type { EscenarioCompilado } from '@/lib/vias-nfkb/motor';
import { ROJO_ALTERACION } from '@/lib/data/vias-nfkb/colores';
import Escena from './Escena';
import BarraTiempo from './BarraTiempo';
import { FichaProteina, type Destino } from './Ficha';
import { useReproductor, VELOCIDADES } from './useReproductor';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

type Props = {
  via: Via;
  compilado: EscenarioCompilado;
  pasoInicial?: number;
  actorInicial?: string | null;
  onPaso?: (i: number) => void;
  onEstudio: () => void;
  onSiguiente: (() => void) | null;
  onVolver: () => void;
  onDestino: (d: Destino) => void;
};

function Controles({ rep, total }: { rep: ReturnType<typeof useReproductor>; total: number }) {
  return (
    <div className={c.controles}>
      <button type="button" className={c.btnIcono} onClick={rep.anterior} disabled={rep.paso === 0 && rep.t < 400} aria-label="Paso anterior" title="Anterior (←)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className={`${c.btnIcono} ${c.btnPlay}`} onClick={rep.alternar} aria-label={rep.reproduciendo ? 'Pausar' : 'Reproducir'} title="Reproducir / pausar (espacio)">
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
      <div className={c.velocidad} role="group" aria-label="Velocidad">
        {VELOCIDADES.map((v) => (
          <button key={v} type="button" className={rep.velocidad === v ? c.velActiva : ''} onClick={() => rep.setVelocidad(v)} aria-pressed={rep.velocidad === v}>
            {String(v).replace('.', ',')}×
          </button>
        ))}
      </div>
    </div>
  );
}

function Narracion({ via, indice }: { via: Via; indice: number }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const p = via.pasos[indice];
  const deSec = via.pasos.filter((x) => x.secuencia === p.secuencia);
  const n = deSec.indexOf(p);
  const lhc = p.secuencia?.startsWith('Linfoma');
  const abiertoAqui = abierto === p.id;
  const hayMas = !!(p.profundiza || p.clinica);
  return (
    <div className={c.narracion} aria-live="polite">
      <h3 className={c.narracionCab}>
        <span className={c.narracionNum}>
          {p.orden === 0 ? 'Contexto' : `Paso ${n + (deSec[0]?.orden === 0 ? 0 : 1)} de ${deSec.length - (deSec[0]?.orden === 0 ? 1 : 0)}`}
          <span className={c.pasoSecuencia} style={lhc ? { color: ROJO_ALTERACION } : undefined}> · {p.secuencia}</span>
        </span>
        <span className={c.narracionSep} aria-hidden> · </span>
        <span className={c.narracionTitulo}>{p.titulo}</span>
      </h3>
      <p className={c.narracionTexto}>
        {p.texto}
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

const LEYENDA: { clase: string; nombre: string }[] = [
  { clase: 'activa', nombre: 'Activa' },
  { clase: 'inhibe', nombre: 'Inhibe' },
  { clase: 'fosforila', nombre: 'Fosforila (P)' },
  { clase: 'degrada', nombre: 'Al proteasoma' },
  { clase: 'k63', nombre: 'Cadena K63 (señal)' },
  { clase: 'k48', nombre: 'Cadena K48 (degradación)' },
  { clase: 'alt', nombre: 'Alteración en el linfoma de Hodgkin' },
];

function Leyenda() {
  return (
    <ul className={s.leyenda}>
      {LEYENDA.map((l) => (
        <li key={l.clase}>
          <svg viewBox="0 0 44 16" className={c.leyendaMuestra} aria-hidden>
            {l.clase === 'activa' && <><line x1={2} y1={8} x2={34} y2={8} stroke="var(--fitc)" strokeWidth={3} /><path d="M42,8 L32,3 L34,8 L32,13 Z" fill="var(--fitc)" /></>}
            {l.clase === 'inhibe' && <><line x1={2} y1={8} x2={36} y2={8} stroke="var(--rodamina)" strokeWidth={3} /><line x1={38} y1={2} x2={38} y2={14} stroke="var(--rodamina)" strokeWidth={4} /></>}
            {l.clase === 'fosforila' && <><line x1={2} y1={8} x2={40} y2={8} stroke="var(--fosfato-trazo)" strokeWidth={2.5} strokeDasharray="5 4" /><circle cx={21} cy={8} r={6} fill="var(--fosfato)" /></>}
            {l.clase === 'degrada' && <line x1={2} y1={8} x2={40} y2={8} stroke="#8A97AB" strokeWidth={3} strokeDasharray="1.5 5" strokeLinecap="round" />}
            {(l.clase === 'k63' || l.clase === 'k48') && [8, 20, 32].map((x) => <circle key={x} cx={x} cy={8} r={5} fill="var(--ubiquitina)" stroke={l.clase === 'k63' ? 'var(--fitc)' : 'var(--ubiquitina)'} strokeWidth={2} />)}
            {l.clase === 'alt' && <text x={2} y={12} fontSize={11} fontStyle="italic" fontWeight={700} fill={ROJO_ALTERACION}>GEN</text>}
          </svg>
          {l.nombre}
        </li>
      ))}
    </ul>
  );
}

export default function Explorar({ via, compilado, pasoInicial = 0, actorInicial = null, onPaso, onEstudio, onSiguiente, onVolver, onDestino }: Props) {
  const rep = useReproductor(compilado, pasoInicial, { autoInicial: pasoInicial === 0 });
  const [visto, setVisto] = useState<Set<number>>(() => new Set([pasoInicial]));
  const [ficha, setFicha] = useState<string | null>(actorInicial);
  const [leyenda, setLeyenda] = useState(false);
  const [reset, setReset] = useState(0);
  const total = compilado.pasos.length;
  const ultimo = rep.paso === total - 1 && rep.terminado;
  const iHodgkin = via.pasos.findIndex((p) => p.secuencia?.startsWith('Linfoma'));
  const enHodgkin = rep.paso >= iHodgkin;
  const finFisiologia = rep.paso === iHodgkin - 1 && rep.terminado;

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
      else if (e.key === ' ' && el?.tagName !== 'BUTTON') { e.preventDefault(); rep.alternar(); }
      else if (e.key === 'r' || e.key === 'R') rep.reiniciar();
      else if (e.key === 'l' || e.key === 'L') setLeyenda((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rep]);

  return (
    <div className={`${c.vista} ${c.vistaAncha}`}>
      <div className={c.escenaZona}>
        <Escena
          escenario={via}
          escena={rep.escena}
          resaltar={ficha ? [ficha] : null}
          seleccionado={ficha}
          onActor={(k) => setFicha((f) => (f === k ? null : k))}
          onInteraccion={() => { if (rep.reproduciendo) rep.pausar(); }}
          vistaReset={reset}
        />
        <div className={c.escenaBotones}>
          <div className={s.secuencias} role="group" aria-label="Secuencia">
            <button type="button" className={!enHodgkin ? s.secActiva : ''} onClick={() => rep.irA(0)}>Fisiología</button>
            <button type="button" className={`${s.secLhc} ${enHodgkin ? s.secActiva : ''}`} onClick={() => rep.irA(iHodgkin)}>Linfoma de Hodgkin</button>
          </div>
          <button type="button" className={c.btnFlot} onClick={() => setReset((r) => r + 1)}>Encuadrar todo</button>
        </div>

        <div className={`${c.leyendaCaja} ${leyenda ? c.leyendaAbierta : ''}`}>
          <button type="button" className={c.leyendaCab} onClick={() => setLeyenda((v) => !v)} aria-expanded={leyenda} title={leyenda ? 'Plegar leyenda (L)' : 'Mostrar leyenda (L)'}>
            <svg viewBox="0 0 16 16" aria-hidden className={c.leyendaIcono}>
              <path d="M2 4.5h3M2 8h3M2 11.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.5 4.5h6.5M7.5 8h6.5M7.5 11.5h6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            </svg>
            Leyenda
            <svg viewBox="0 0 12 12" aria-hidden className={c.leyendaChevron}><path d="M3 4.5L6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {leyenda && (
            <div className={c.leyendaCuerpo}>
              <Leyenda />
              <p className={c.leyendaAyuda}>Toca cualquier proteína para ver su ficha.</p>
            </div>
          )}
        </div>

        {ficha && (
          <div className={c.fichaPanel}>
            <FichaProteina escenario={via} actor={ficha} viaActual={via.id} onCerrar={() => setFicha(null)} onIr={(d) => { setFicha(null); onDestino(d); }} />
          </div>
        )}

        {(ultimo || finFisiologia) && (
          <div className={c.cierre} role="region" aria-label="Fin de la secuencia">
            {finFisiologia && <button type="button" className={c.btnPrim} onClick={() => rep.irA(iHodgkin)}>Ver qué cambia en el linfoma de Hodgkin</button>}
            {ultimo && <button type="button" className={c.btnPrim} onClick={onEstudio}>Ponerme a prueba (arrastrar)</button>}
            {ultimo && onSiguiente && <button type="button" className={c.btnSec} onClick={onSiguiente}>Siguiente vía</button>}
            <button type="button" className={c.btnSec} onClick={onVolver}>Volver a las tres vías</button>
          </div>
        )}
      </div>

      <div className={c.pie}>
        <BarraTiempo rep={rep} escenario={via} visto={visto} />
        <div className={c.pieFila}>
          <Controles rep={rep} total={total} />
          <Narracion via={via} indice={rep.paso} />
        </div>
      </div>
    </div>
  );
}
