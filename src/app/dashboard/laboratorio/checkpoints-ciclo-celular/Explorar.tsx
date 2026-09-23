'use client';
// Modo Explorar: la vía paso a paso con narración, «Profundizar», correlación
// clínica, línea de tiempo y cajón de proteínas. También sirve a la intro.

import { useEffect, useMemo, useState } from 'react';
import type { Escenario } from '@/lib/data/ciclo-celular/tipos';
import type { EfectoSt, EscenarioCompilado } from '@/lib/ciclo-celular/motor';
import { posAbs } from '@/lib/ciclo-celular/motor';
import Escena from './Escena';
import BarraTiempo from './BarraTiempo';
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
  const reproduciendo = rep.reproduciendo;
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

/** Narración compacta del pie: «Paso N de M · título» en una línea, el texto
 *  debajo y «Profundizar» como enlace al final del texto. Lo desplegado va en
 *  una caja de alto acotado con scroll propio: nunca le come alto a la escena. */
export function Narracion({ escenario, indice, oculta }: { escenario: Escenario; indice: number; oculta?: boolean }) {
  // Guarda el id del paso abierto: al cambiar de paso se pliega solo.
  const [abierto, setAbierto] = useState<string | null>(null);
  const p = escenario.pasos[indice];
  const max = Math.max(...escenario.pasos.map((x) => x.orden));
  if (oculta) return <div className={s.narracion} aria-live="polite"><p className={s.narracionTexto}>La narración aparece al completar la vía.</p></div>;
  const abiertoAqui = abierto === p.id;
  const hayMas = !!(p.profundiza || p.clinica);
  const idMas = `profundiza-${p.id}`;
  return (
    <div className={s.narracion} aria-live="polite">
      <h3 className={s.narracionCab}>
        <span className={s.narracionNum}>
          {p.orden === 0 ? 'Contexto' : `Paso ${String(p.orden).replace('.', ',')} de ${max}`}
          {p.secuencia && <span className={s.pasoSecuencia}> · {p.secuencia}</span>}
          {p.lateral && <span className={s.pasoLateral}> · {p.lateral}</span>}
        </span>
        <span className={s.narracionSep} aria-hidden> · </span>
        <span className={s.narracionTitulo}>{p.titulo}</span>
      </h3>
      <p className={s.narracionTexto}>
        {p.texto}
        {hayMas && (
          <>
            {' '}
            <button
              type="button"
              className={`${s.profundizaBtn} ${abiertoAqui ? s.profundizaAbierto : ''}`}
              aria-expanded={abiertoAqui}
              aria-controls={idMas}
              onClick={() => setAbierto(abiertoAqui ? null : p.id)}
            >
              Profundizar
              <svg viewBox="0 0 12 12" aria-hidden><path d="M3 4.5L6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>
        )}
      </p>
      {hayMas && abiertoAqui && (
        <div id={idMas} className={s.profundiza}>
          {p.profundiza && <p>{p.profundiza}</p>}
          {p.clinica && (
            <div className={s.clinica}>
              <p className={s.fichaRotulo}>Correlación clínica</p>
              <p>{p.clinica}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Leyenda plegada por defecto; se recuerda si el estudiante la deja abierta.
const CLAVE_LEYENDA = 'medgo-ciclo-leyenda';
function leerLeyenda(): boolean {
  try { return window.localStorage.getItem(CLAVE_LEYENDA) === '1'; } catch { return false; }
}

export default function Explorar({
  escenario, compilado, pasoInicial = 0, actorInicial = null, onPaso, onFinal, onAprender, onSiguiente, onVolver, onDestino, textoVolver = 'Volver al ciclo',
}: Props) {
  const rep = useReproductor(compilado, pasoInicial);
  const reducido = useMovimientoReducido();
  const [visto, setVisto] = useState<Set<number>>(() => new Set([pasoInicial]));
  const [ficha, setFicha] = useState<string | null>(actorInicial);
  const [lista, setLista] = useState(false);
  const [leyenda, setLeyenda] = useState(leerLeyenda);
  const [reset, setReset] = useState(0);
  const [repaso, setRepaso] = useState(-1);
  const total = compilado.pasos.length;
  const paso = escenario.pasos[rep.paso];
  const ultimo = rep.paso === total - 1 && rep.terminado;

  // Pasar por encima de un paso arrastrando la barra no cuenta como verlo:
  // se marca el paso donde se suelta.
  useEffect(() => {
    onPaso?.(rep.paso);
    if (rep.arrastrando) return;
    setVisto((v) => (v.has(rep.paso) ? v : new Set(v).add(rep.paso)));
  }, [rep.paso, rep.arrastrando, onPaso]);

  useEffect(() => { if (ultimo) onFinal?.(); }, [ultimo, onFinal]);

  useEffect(() => {
    try { window.localStorage.setItem(CLAVE_LEYENDA, leyenda ? '1' : '0'); } catch { /* sin almacenamiento: se queda en memoria */ }
  }, [leyenda]);

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
      // La barra de tiempo maneja sus propias flechas.
      if (el?.getAttribute?.('role') === 'slider') return;
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
    <div className={`${s.vista} ${s.vistaAncha}`}>
      {/* La escena ocupa todo el ancho; leyenda y ficha flotan encima sin
          robarle columnas a la rejilla. */}
      <div className={s.escenaZona}>
        <Escena
          escenario={escenario}
          escena={escena}
          resaltar={ficha ? [ficha] : null}
          seleccionado={ficha}
          onActor={(k) => setFicha((f) => (f === k ? null : k))}
          onInteraccion={() => { if (rep.reproduciendo) rep.pausar(); }}
          vistaReset={reset}
        >
          {paso.grafica === 'ciclinas' && <GraficaCiclinas />}
        </Escena>
        <div className={s.escenaBotones}>
          <button type="button" className={s.btnFlot} onClick={() => setReset((r) => r + 1)}>Encuadrar todo</button>
          <button type="button" className={s.btnFlot} onClick={() => setLista(true)}>Ver como lista</button>
        </div>

        {/* Leyenda retráctil: plegada es un chip; la misma cabecera la pliega. */}
        <div className={`${s.leyendaCaja} ${leyenda ? s.leyendaAbierta : ''}`}>
          <button
            type="button"
            className={s.leyendaCab}
            onClick={() => setLeyenda((v) => !v)}
            aria-expanded={leyenda}
            aria-controls="ciclo-leyenda"
            title={leyenda ? 'Plegar leyenda (L)' : 'Mostrar leyenda (L)'}
          >
            <svg viewBox="0 0 16 16" aria-hidden className={s.leyendaIcono}>
              <path d="M2 4.5h3M2 8h3M2 11.5h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M7.5 4.5h6.5M7.5 8h6.5M7.5 11.5h6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
            </svg>
            Leyenda
            <svg viewBox="0 0 12 12" aria-hidden className={s.leyendaChevron}><path d="M3 4.5L6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {leyenda && (
            <div id="ciclo-leyenda" className={s.leyendaCuerpo}>
              <Leyenda />
              <p className={s.leyendaAyuda}>Toca cualquier proteína para ver su ficha.</p>
            </div>
          )}
        </div>

        {ficha && (
          <div className={s.fichaPanel}>
            <FichaProteina
              escenario={escenario}
              actor={ficha}
              onCerrar={() => setFicha(null)}
              onIr={(d) => { setFicha(null); onDestino?.(d); }}
            />
          </div>
        )}

        {ultimo && (
          <div className={s.cierre} role="region" aria-label="Fin de la vía">
            {onAprender && <button type="button" className={s.btnPrim} onClick={onAprender}>Ponerme a prueba</button>}
            {siguienteCp && <button type="button" className={s.btnSec} onClick={siguienteCp}>Siguiente checkpoint</button>}
            <button type="button" className={s.btnSec} onClick={onVolver}>{textoVolver}</button>
          </div>
        )}
      </div>

      {/* Pie tipo reproductor: la barra de tiempo a todo el ancho y, debajo,
          los controles a la izquierda y la narración a la derecha. */}
      <div className={s.pie}>
        <BarraTiempo rep={rep} escenario={escenario} visto={visto} />
        <div className={s.pieFila}>
          <Controles rep={rep} total={total} />
          <Narracion escenario={escenario} indice={rep.paso} />
        </div>
      </div>

      {lista && <VistaLista escenario={escenario} onCerrar={() => setLista(false)} onIr={(i) => { setLista(false); rep.irA(i); }} />}
    </div>
  );
}
