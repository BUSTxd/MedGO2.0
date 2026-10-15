'use client';
// Modo estudio: las tres vías en el mismo lienzo. En cada vía brilla el hueco
// del siguiente paso; el estudiante arrastra la pieza correcta desde la
// bandeja (o la toca y luego toca el hueco). Al acertar se reproduce la
// animación de esa pieza y el panel explica qué pasó; al fallar, por qué no.
//
// El orden en que avanzan las vías lo decide el estudiante, así que aquí no
// hay una lista fija de pasos: cada pieza se compila sobre el estado que dejó
// la anterior (`compilarPaso`) y su final pasa a ser la nueva base.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Paso, Pieza, ViaId } from '@/lib/data/vias-nfkb/tipos';
import { ESTUDIO, NUCLEO, PIEZAS } from '@/lib/data/vias-nfkb/panorama';
import { COLOR_VIA, ROJO_ALTERACION } from '@/lib/data/vias-nfkb/colores';
import PROTEINAS from '@/lib/data/vias-nfkb/proteinas';
import { CELDA, compilarPaso, evaluar, type Escena as EscenaSt, type PasoCompilado } from '@/lib/vias-nfkb/motor';
import { compilado, VIAS } from '@/lib/vias-nfkb/registro';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import Escena, { NOMBRE_VIA } from './Escena';
import { FichaProteina } from './Ficha';
import { useMovimientoReducido } from './useReproductor';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

type Ronda = 'fisiologia' | 'hodgkin';

/** «Vía clásica de NF-κB» → «vía clásica de NF-κB» (sin tocar las siglas). */
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

const pasoDe = (p: Pieza): Paso => ({ id: p.id, orden: 1, titulo: p.titulo, texto: p.explica, profundiza: '', protagonistas: [], acciones: p.acciones });

function aplicarTodas(base: EscenaSt, piezas: Pieza[]): EscenaSt {
  return piezas.reduce((e, p, i) => compilarPaso(e, pasoDe(p), i, NUCLEO, false).final, base);
}

/** Baraja estable (misma mezcla en cada render de la misma ronda). */
function barajar<T>(xs: T[], semilla: number): T[] {
  const a = [...xs];
  let x = semilla;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Ficha({ p, arrastrando }: { p: Pieza; arrastrando?: boolean }) {
  const f = p.ficha;
  const src = f.forma === 'imagen' ? imagen(f.img ?? 'proteasoma').src : null;
  return (
    <span className={`${s.pieza} ${f.forma === 'alteracion' ? s.piezaAlt : ''} ${arrastrando ? s.piezaFlotando : ''}`} style={{ ['--col' as string]: f.color }}>
      {f.forma === 'alteracion'
        ? <span className={s.piezaGen}>{f.label}</span>
        : (
          <>
            <span className={s.piezaIcono} aria-hidden>
              {src ? <img src={src} alt="" /> : f.forma === 'ligando'
                ? <svg viewBox="0 0 24 24"><g fill={f.color} stroke="rgba(0,0,0,.3)"><circle cx={8} cy={15} r={5} /><circle cx={16} cy={15} r={5} /><circle cx={12} cy={8} r={5} /></g></svg>
                : f.forma === 'citocina'
                  ? <svg viewBox="0 0 24 24"><circle cx={12} cy={12} r={8} fill={f.color} stroke="rgba(0,0,0,.3)" /></svg>
                  : <svg viewBox="0 0 24 24"><ellipse cx={12} cy={12} rx={11} ry={7} fill={f.color} stroke="rgba(0,0,0,.3)" /></svg>}
            </span>
            <span>{f.label}</span>
          </>
        )}
    </span>
  );
}

export default function Estudio({ viaInicial, onExplorar }: { viaInicial?: ViaId | null; onExplorar: (v: ViaId) => void }) {
  const reducido = useMovimientoReducido();
  const inicio = useMemo(() => compilado(ESTUDIO).pasos[0].final, []);
  const fisio = useMemo(() => PIEZAS.filter((p) => p.ronda === 'fisiologia'), []);
  const [ronda, setRonda] = useState<Ronda>('fisiologia');
  const [base, setBase] = useState<EscenaSt>(inicio);
  const [colocadas, setColocadas] = useState<string[]>([]);
  const [anim, setAnim] = useState<{ pc: PasoCompilado; t: number } | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; x0: number; y0: number; movido: boolean; sobre: string | null } | null>(null);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'mal'; titulo: string; texto: string; via?: ViaId } | null>(null);
  const [sacude, setSacude] = useState<string | null>(null);
  const [errores, setErrores] = useState(0);
  const [ficha, setFicha] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const piezasRonda = useMemo(() => PIEZAS.filter((p) => p.ronda === ronda), [ronda]);
  const pendientes = piezasRonda.filter((p) => !colocadas.includes(p.id));
  const bandeja = useMemo(() => barajar(piezasRonda, ronda === 'fisiologia' ? 7 : 11), [piezasRonda, ronda]).filter((p) => !colocadas.includes(p.id));
  // Fisiología: un hueco por vía (el siguiente en orden). Hodgkin: todos a la vez.
  const huecos = useMemo(() => {
    if (ronda === 'hodgkin') return pendientes;
    const out: Pieza[] = [];
    for (const v of VIAS) { const sig = pendientes.find((p) => p.via === v.id); if (sig) out.push(sig); }
    return out;
  }, [ronda, pendientes]);
  const fin = pendientes.length === 0 && !anim;

  const cambiarRonda = useCallback((r: Ronda) => {
    setRonda(r);
    setColocadas([]);
    setAnim(null);
    setAviso(null);
    setErrores(0);
    setSel(null);
    setBase(r === 'fisiologia' ? inicio : aplicarTodas(inicio, fisio));
  }, [inicio, fisio]);

  // Reloj de la animación de la pieza colocada.
  useEffect(() => {
    if (!anim) return;
    if (reducido) { setBase(anim.pc.final); setAnim(null); return; }
    let raf = 0, prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - prev); prev = now;
      setAnim((a) => {
        if (!a) return a;
        const t = a.t + dt;
        if (t >= a.pc.duracion) { setBase(a.pc.final); return null; }
        return { ...a, t };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anim?.pc, reducido]); // eslint-disable-line react-hooks/exhaustive-deps

  const escena = anim ? evaluar(anim.pc, anim.t) : base;

  const comprobar = useCallback((piezaId: string, huecoId: string) => {
    if (anim) return;
    const pieza = PIEZAS.find((p) => p.id === piezaId)!;
    const hueco = PIEZAS.find((p) => p.id === huecoId)!;
    setSel(null);
    if (pieza.id === hueco.id) {
      setColocadas((cs) => [...cs, pieza.id]);
      setAnim({ pc: compilarPaso(base, pasoDe(pieza), 0, NUCLEO, false), t: 0 });
      setAviso({ tipo: 'ok', titulo: pieza.titulo, texto: pieza.explica, via: pieza.via });
      return;
    }
    setErrores((e) => e + 1);
    setSacude(pieza.id);
    setTimeout(() => setSacude(null), 380);
    let texto: string;
    if (ronda === 'hodgkin') {
      const mut = pieza.acciones.find((a) => a.tipo === 'mutate');
      const decl = mut && 'actor' in mut ? ESTUDIO.actores[mut.actor] : undefined;
      const quien = decl ? PROTEINAS[decl.info ?? '']?.nombre : undefined;
      texto = `Esa alteración no va aquí${quien ? `: afecta a ${quien}` : ''}. Busca en la figura dónde actúa esa proteína.`;
    } else if (pieza.via !== hueco.via) {
      texto = `«${pieza.ficha.label}» no es de la ${minuscula(NOMBRE_VIA[hueco.via])}: pertenece a la ${minuscula(NOMBRE_VIA[pieza.via])}.`;
    } else {
      texto = `Todavía no: «${pieza.ficha.label}» actúa más adelante en esta vía. ¿Qué tiene que pasar antes?`;
    }
    setAviso({ tipo: 'mal', titulo: 'No va aquí', texto });
  }, [anim, base, ronda]);

  // ─── Arrastre ───────────────────────────────────────────────────────────────

  const huecoBajo = useCallback((x: number, y: number): string | null => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = new DOMPoint(x, y).matrixTransform(ctm.inverse());
    let mejor: { id: string; d: number } | null = null;
    for (const h of huecos) {
      const d = Math.hypot(pt.x - h.hueco.col * CELDA, pt.y - h.hueco.row * CELDA);
      if (d < 85 && (!mejor || d < mejor.d)) mejor = { id: h.id, d };
    }
    return mejor?.id ?? null;
  }, [huecos]);

  useEffect(() => {
    if (!drag) return;
    const mover = (e: PointerEvent) => setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY, movido: d.movido || Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 6, sobre: huecoBajo(e.clientX, e.clientY) } : d));
    const soltar = (e: PointerEvent) => {
      const h = huecoBajo(e.clientX, e.clientY);
      const id = drag.id;
      setDrag(null);
      if (h) { setSel(null); comprobar(id, h); }
    };
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar, { once: true });
    return () => { window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', soltar); };
  }, [drag?.id, huecoBajo, comprobar]); // eslint-disable-line react-hooks/exhaustive-deps

  const empezar = (e: React.PointerEvent, id: string) => {
    if (anim || e.button !== 0) return;
    e.preventDefault();
    setDrag({ id, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, movido: false, sobre: null });
  };

  const progreso = (v: ViaId) => {
    const de = piezasRonda.filter((p) => p.via === v);
    return { hechas: de.filter((p) => colocadas.includes(p.id)).length, total: de.length };
  };

  const huecosSvg = (
    <g>
      {huecos.map((h) => {
        const x = h.hueco.col * CELDA, y = h.hueco.row * CELDA;
        const alt = h.ronda === 'hodgkin';
        const activo = drag?.sobre === h.id;
        const color = alt ? ROJO_ALTERACION : COLOR_VIA[h.via];
        return (
          <g
            key={h.id}
            transform={`translate(${x},${y})`}
            className={`${s.hueco} ${activo ? s.huecoActivo : ''}`}
            onClick={() => sel && comprobar(sel, h.id)}
            role={sel ? 'button' : undefined}
            aria-label={sel ? `Colocar aquí (${NOMBRE_VIA[h.via]})` : undefined}
          >
            <ellipse rx={alt ? 70 : 62} ry={alt || h.hueco.row < 1.2 ? 24 : 32} fill={color} fillOpacity={activo ? 0.28 : 0.1} stroke={color} strokeWidth={3} strokeDasharray="8 7" className={s.huecoPulso} />
            <text textAnchor="middle" dy="0.36em" className={s.huecoTxt} fill={color}>?</text>
          </g>
        );
      })}
    </g>
  );

  const piezaDrag = drag ? PIEZAS.find((p) => p.id === drag.id) : null;

  return (
    <div className={c.vista}>
      <div className={c.escenaZona}>
        <Escena
          escenario={ESTUDIO}
          escena={escena}
          svgRef={svgRef}
          fondo={huecosSvg}
          camaraLibre={false}
          seleccionado={ficha}
          onActor={(k) => setFicha((f) => (f === k ? null : k))}
        />
        {ficha && (
          <div className={c.fichaPanel}>
            <FichaProteina escenario={ESTUDIO} actor={ficha} onCerrar={() => setFicha(null)} />
          </div>
        )}
        {fin && (
          <div className={c.resultado} role="dialog" aria-label="Ronda completa">
            <h3 className={c.pasoTitulo}>{ronda === 'fisiologia' ? '¡Las tres vías completas!' : '¡Todas las alteraciones en su sitio!'}</h3>
            <p className={c.metricas}>{errores} {errores === 1 ? 'pieza mal colocada' : 'piezas mal colocadas'}</p>
            <div className={c.resultadoBtns}>
              {ronda === 'fisiologia'
                ? <button type="button" className={c.btnPrim} onClick={() => cambiarRonda('hodgkin')}>Siguiente: linfoma de Hodgkin</button>
                : <button type="button" className={c.btnPrim} onClick={() => cambiarRonda('fisiologia')}>Empezar de nuevo</button>}
              <button type="button" className={c.btnSec} onClick={() => cambiarRonda(ronda)}>Repetir esta ronda</button>
              {viaInicial && <button type="button" className={c.btnSec} onClick={() => onExplorar(viaInicial)}>Volver a explorar</button>}
            </div>
          </div>
        )}
      </div>

      <div className={c.lateral}>
        <div className={s.rondas} role="group" aria-label="Ronda">
          <button type="button" className={ronda === 'fisiologia' ? s.rondaActiva : ''} onClick={() => ronda !== 'fisiologia' && cambiarRonda('fisiologia')}>Las vías</button>
          <button type="button" className={`${s.rondaLhc} ${ronda === 'hodgkin' ? s.rondaActiva : ''}`} onClick={() => ronda !== 'hodgkin' && cambiarRonda('hodgkin')}>Linfoma de Hodgkin</button>
        </div>
        <p className={s.estudioAyuda}>
          {ronda === 'fisiologia'
            ? 'Arrastra cada pieza al hueco que brilla en su vía, en orden. También puedes tocar la pieza y luego el hueco.'
            : 'Arrastra cada alteración (en rojo, como en la figura) al lugar de la vía donde actúa.'}
        </p>
        <div className={s.progresoVias}>
          {VIAS.map((v) => {
            const pr = progreso(v.id);
            if (!pr.total) return null;
            return (
              <div key={v.id} className={s.progresoVia}>
                <span style={{ color: v.color }}>{v.nombreCorto}</span>
                <span className={c.barra}><span style={{ width: `${(pr.hechas / pr.total) * 100}%`, background: v.color }} /></span>
                <span className={s.progresoNum}>{pr.hechas}/{pr.total}</span>
              </div>
            );
          })}
        </div>

        <div aria-live="polite" className={c.avisoZona}>
          {aviso
            ? (
              <div className={`${c.aviso} ${aviso.tipo === 'ok' ? c.avisoOk : c.avisoMal}`}>
                <p className={s.avisoTitulo}>{aviso.titulo}</p>
                <p>{aviso.texto}</p>
                {aviso.tipo === 'ok' && aviso.via && (
                  <button type="button" className={s.avisoEnlace} onClick={() => onExplorar(aviso.via!)}>Verlo paso a paso en Explorar</button>
                )}
              </div>
            )
            : <div className={c.aviso}><p>{anim ? 'Mira cómo ocurre…' : 'Empieza por la membrana: ¿qué llega primero a cada receptor?'}</p></div>}
        </div>

        <p className={c.lateralRotulo}>Piezas <span className={c.contador}>{bandeja.length}</span></p>
        <div className={s.bandeja}>
          {bandeja.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${s.piezaBtn} ${sel === p.id ? s.piezaSel : ''} ${sacude === p.id ? c.sacudir : ''} ${drag?.id === p.id ? s.piezaOrigen : ''}`}
              onPointerDown={(e) => empezar(e, p.id)}
              onClick={() => setSel((x) => (x === p.id ? null : p.id))}
              aria-pressed={sel === p.id}
              disabled={!!anim}
            >
              <Ficha p={p} />
            </button>
          ))}
        </div>
      </div>

      {piezaDrag && drag?.movido && typeof document !== 'undefined' && createPortal(
        <div className={s.arrastre} style={{ left: drag.x, top: drag.y }} aria-hidden>
          <Ficha p={piezaDrag} arrastrando />
        </div>,
        document.body,
      )}
    </div>
  );
}
