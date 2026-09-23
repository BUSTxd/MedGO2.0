'use client';
// Modo Explorar: la vía paso a paso con narración, «Profundizar», correlación
// clínica, línea de tiempo y cajón de proteínas. También sirve a la intro.

import { useEffect, useMemo, useState } from 'react';
import type { Escenario } from '@/lib/data/ciclo-celular/tipos';
import type { EfectoSt, EscenarioCompilado } from '@/lib/ciclo-celular/motor';
import { posAbs } from '@/lib/ciclo-celular/motor';
import Escena from './Escena';
import { FichaProteina, GraficaCiclinas, Leyenda, VistaLista, type Destino } from './Paneles';
import { useMovimientoReducido, useReproductor, VELOCIDADES } from './useReproductor';
import s from '@/styles/cicloCelular.module.css';

type Props = {
  escenario: Escenario;
  compilado: EscenarioCompilado;
  pasoInicial?: number;
  actorInicial?: string | null;
  onPaso?: (i: number) => void;
  onFinal?: () => void;
  onAprender?: () => void;
  onSiguiente?: (() => void) | null;
  onVolver: () => void;
  onDestino?: (d: Destino) => void;
  textoVolver?: string;
};

export function Controles({ rep, total }: { rep: ReturnType<typeof useReproductor>; total: number }) {
  const reproduciendo = rep.auto && !rep.pausado;
  return (
    <div className={s.controles}>
      <button type="button" className={s.btnIcono} onClick={rep.anterior} disabled={rep.paso === 0 && rep.t < 400} aria-label="Paso anterior" title="Anterior (←)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className={`${s.btnIcono} ${s.btnPlay}`} onClick={rep.alternar} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'} title="Reproducir / pausar (espacio)">
        {reproduciendo
          ? <svg viewBox="0 0 20 20" aria-hidden><rect x="5.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" /><rect x="11.5" y="4.5" width="3" height="11" rx="1" fill="currentColor" /></svg>
          : <svg viewBox="0 0 20 20" aria-hidden><path d="M7 4.5v11l9-5.5z" fill="currentColor" /></svg>}
      </button>
      <button type="button" className={s.btnIcono} onClick={rep.siguiente} disabled={rep.paso >= total - 1} aria-label="Siguiente paso" title="Siguiente (→)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M7.5 4.5L13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className={s.btnIcono} onClick={rep.reiniciar} aria-label="Reiniciar" title="Reiniciar (R)">
        <svg viewBox="0 0 20 20" aria-hidden><path d="M4.5 10a5.5 5.5 0 1 0 1.8-4.1M4.5 4v3.5H8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className={s.velocidad} role="group" aria-label="Velocidad">
        {VELOCIDADES.map((v) => (
          <button key={v} type="button" className={rep.velocidad === v ? s.velActiva : ''} onClick={() => rep.setVelocidad(v)} aria-pressed={rep.velocidad === v}>
            {String(v).replace('.', ',')}×
          </button>
        ))}
      </div>
    </div>
  );
}

export function Narracion({ escenario, indice, oculta }: { escenario: Escenario; indice: number; oculta?: boolean }) {
  const p = escenario.pasos[indice];
  const max = Math.max(...escenario.pasos.map((x) => x.orden));
  if (oculta) return <div className={s.narracion} aria-live="polite"><p className={s.pasoTexto}>La narración aparece al completar la vía.</p></div>;
  return (
    <div className={s.narracion} aria-live="polite">
      <p className={s.pasoNum}>
        {p.orden === 0 ? 'Contexto' : `Paso ${String(p.orden).replace('.', ',')} de ${max}`}
        {p.secuencia && <span className={s.pasoSecuencia}> · {p.secuencia}</span>}
        {p.lateral && <span className={s.pasoLateral}> · {p.lateral}</span>}
      </p>
      <h3 className={s.pasoTitulo}>{p.titulo}</h3>
      <p className={s.pasoTexto}>{p.texto}</p>
      <details className={s.profundiza} key={p.id}>
        <summary>Profundizar</summary>
        <p>{p.profundiza}</p>
        {p.clinica && (
          <div className={s.clinica}>
            <p className={s.fichaRotulo}>Correlación clínica</p>
            <p>{p.clinica}</p>
          </div>
        )}
      </details>
    </div>
  );
}

export default function Explorar({
  escenario, compilado, pasoInicial = 0, actorInicial = null, onPaso, onFinal, onAprender, onSiguiente, onVolver, onDestino, textoVolver = 'Volver al ciclo',
}: Props) {
  const rep = useReproductor(compilado, pasoInicial);
  const reducido = useMovimientoReducido();
  const [visto, setVisto] = useState<Set<number>>(() => new Set([pasoInicial]));
  const [ficha, setFicha] = useState<string | null>(actorInicial);
  const [lista, setLista] = useState(false);
  const [leyenda, setLeyenda] = useState(true);
  const [reset, setReset] = useState(0);
  const [repaso, setRepaso] = useState(-1);
  const total = compilado.pasos.length;
  const paso = escenario.pasos[rep.paso];
  const ultimo = rep.paso === total - 1 && rep.terminado;

  useEffect(() => {
    onPaso?.(rep.paso);
    setVisto((v) => (v.has(rep.paso) ? v : new Set(v).add(rep.paso)));
  }, [rep.paso, onPaso]);

  useEffect(() => { if (ultimo) onFinal?.(); }, [ultimo, onFinal]);

  // Cierre: un punto recorre, uno tras otro, los conectores de la vía entera.
  const nConectores = rep.escena.conectores.length;
  useEffect(() => {
    if (!ultimo || reducido) { setRepaso(-1); return; }
    let raf = 0;
    const t0 = performance.now();
    const fin = nConectores * 420;
    const loop = (now: number) => {
      const t = now - t0;
      if (t > fin) { setRepaso(-1); return; }
      setRepaso(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ultimo, reducido, nConectores]);

  const escena = useMemo(() => {
    if (repaso < 0) return rep.escena;
    const cs = rep.escena.conectores.filter((c) => c.type !== 'secuestra');
    const dur = 420;
    const i = Math.floor(repaso / dur);
    if (i >= cs.length) return rep.escena;
    const c = cs[i];
    const a = posAbs(rep.escena, c.from), b = posAbs(rep.escena, c.to);
    const ef: EfectoSt = { tipo: 'punto', p: 0.5, via: c.id, x1: a.x, y1: a.y, x2: b.x, y2: b.y, f: (repaso % dur) / dur, color: c.type === 'inhibe' ? '#FF4D6D' : '#3DDC97' };
    return { ...rep.escena, efectos: [ef] };
  }, [rep.escena, repaso]);

  // Teclado: ← → espacio R L (Esc lo maneja la vista raíz).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); rep.siguiente(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); rep.anterior(); }
      else if (e.key === ' ' && el?.tagName !== 'BUTTON' && el?.tagName !== 'SUMMARY') { e.preventDefault(); rep.alternar(); }
      else if (e.key === 'r' || e.key === 'R') rep.reiniciar();
      else if (e.key === 'l' || e.key === 'L') setLeyenda((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rep]);

  const siguienteCp = onSiguiente ?? null;

  return (
    <div className={s.vista}>
      <div className={s.escenaZona}>
        <Escena
          escenario={escenario}
          escena={escena}
          resaltar={ficha ? [ficha] : null}
          seleccionado={ficha}
          onActor={(k) => setFicha((f) => (f === k ? null : k))}
          onInteraccion={() => { if (rep.auto && !rep.pausado) rep.pausar(); }}
          vistaReset={reset}
        >
          {paso.grafica === 'ciclinas' && <GraficaCiclinas />}
        </Escena>
        <div className={s.escenaBotones}>
          <button type="button" className={s.btnFlot} onClick={() => setReset((r) => r + 1)}>Encuadrar todo</button>
          <button type="button" className={s.btnFlot} onClick={() => setLista(true)}>Ver como lista</button>
          <button type="button" className={`${s.btnFlot} ${s.soloTablet}`} onClick={() => setLeyenda((v) => !v)} aria-pressed={leyenda}>Leyenda</button>
        </div>
        {ultimo && (
          <div className={s.cierre} role="region" aria-label="Fin de la vía">
            {onAprender && <button type="button" className={s.btnPrim} onClick={onAprender}>Ponerme a prueba</button>}
            {siguienteCp && <button type="button" className={s.btnSec} onClick={siguienteCp}>Siguiente checkpoint</button>}
            <button type="button" className={s.btnSec} onClick={onVolver}>{textoVolver}</button>
          </div>
        )}
      </div>

      <div className={`${s.lateral} ${leyenda ? '' : s.lateralOculto}`}>
        {ficha ? (
          <FichaProteina
            escenario={escenario}
            actor={ficha}
            onCerrar={() => setFicha(null)}
            onIr={(d) => { setFicha(null); onDestino?.(d); }}
          />
        ) : (
          <>
            <Leyenda />
            <p className={s.lateralAyuda}>Toca cualquier proteína para ver su ficha.</p>
          </>
        )}
      </div>

      <div className={s.pie}>
        <Narracion escenario={escenario} indice={rep.paso} />
        <div className={s.pieDer}>
          <Controles rep={rep} total={total} />
          <ol className={s.linea} aria-label="Pasos">
            {escenario.pasos.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`${s.puntoLinea} ${visto.has(i) ? s.puntoVisto : ''} ${i === rep.paso ? s.puntoActual : ''} ${p.lateral ? s.puntoLateral : ''}`}
                  onClick={() => rep.irA(i)}
                  aria-label={`${p.orden === 0 ? 'Contexto' : `Paso ${p.orden}`}: ${p.titulo}`}
                  aria-current={i === rep.paso ? 'step' : undefined}
                  title={p.titulo}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      {lista && <VistaLista escenario={escenario} onCerrar={() => setLista(false)} onIr={(i) => { setLista(false); rep.irA(i); }} />}
    </div>
  );
}
