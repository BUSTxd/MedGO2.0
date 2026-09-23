'use client';
// Modo Aprendizaje: el estudiante reconstruye la vía eligiendo el siguiente
// paso de un mazo mezclado (con distractores). Cada acierto reproduce en el
// escenario exactamente la animación de ese paso en Explorar.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Checkpoint, CheckpointId } from '@/lib/data/ciclo-celular/tipos';
import type { EscenarioCompilado } from '@/lib/ciclo-celular/motor';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import { secuencias } from '@/lib/ciclo-celular/prueba';
import { guardarAprender, type Nivel } from '@/lib/ciclo-celular/progreso';
import Escena from './Escena';
import { Narracion } from './Explorar';
import { useReproductor } from './useReproductor';
import { barajar, etiquetaTexto } from './texto';
import s from '@/styles/cicloCelular.module.css';

type Carta = { id: string; tarjeta: string; falso?: string; protagonistas: string[] };

const NIVELES: { id: Nivel; nombre: string; desc: string }[] = [
  { id: 'guiado', nombre: 'Guiado', desc: 'Tarjetas con las proteínas que intervienen y pistas disponibles.' },
  { id: 'estandar', nombre: 'Estándar', desc: 'Solo el texto de cada paso; pistas disponibles.' },
  { id: 'examen', nombre: 'Examen', desc: 'Solo texto, sin pistas y sin narración hasta el final.' },
];

type Props = {
  checkpoint: Checkpoint;
  compilado: EscenarioCompilado;
  onVerPaso: (pasoId: string) => void;
  onExplorar: () => void;
  onSiguiente: (() => void) | null;
  onProgreso: () => void;
};

export default function Aprender(props: Props) {
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [ronda, setRonda] = useState(0);
  if (!nivel) {
    return (
      <div className={s.nivelSel}>
        <h3 className={s.pasoTitulo}>Construye la vía: {props.checkpoint.nombre}</h3>
        <p className={s.pasoTexto}>Elige en cada turno el siguiente paso fisiológico. Entre las tarjetas hay afirmaciones falsas.</p>
        <div className={s.nivelOpciones}>
          {NIVELES.map((n) => (
            <button key={n.id} type="button" className={s.nivelBtn} onClick={() => setNivel(n.id)}>
              <strong>{n.nombre}</strong>
              <span>{n.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  return <Partida key={ronda} {...props} nivel={nivel} onRepetir={() => setRonda((r) => r + 1)} onCambiarNivel={() => setNivel(null)} />;
}

function Partida({ checkpoint: cp, compilado, nivel, onVerPaso, onExplorar, onSiguiente, onRepetir, onCambiarNivel, onProgreso }: Props & { nivel: Nivel; onRepetir: () => void; onCambiarNivel: () => void }) {
  const secs = useMemo(() => secuencias(cp), [cp]);
  const indiceDe = useMemo(() => new Map(cp.pasos.map((p, i) => [p.id, i])), [cp]);
  const rep = useReproductor(compilado, 0);
  const [secIdx, setSecIdx] = useState(0);
  const [colocados, setColocados] = useState<string[]>([]);
  const [mazo, setMazo] = useState<Carta[]>(() => mazoDe(cp, secs, 0));
  const [sel, setSel] = useState<string | null>(null);
  const [errores, setErrores] = useState(0);
  const [racha, setRacha] = useState(0);
  const [pistas, setPistas] = useState(0);
  const [pista, setPista] = useState<0 | 1 | 2>(0);
  const [fallos, setFallos] = useState<string[]>([]);
  const [aviso, setAviso] = useState<{ tipo: 'ok' | 'orden' | 'falso'; texto: string; carta?: string } | null>(null);
  const [sacude, setSacude] = useState<string | null>(null);
  const [fin, setFin] = useState(false);
  const t0 = useRef(Date.now());
  const [ms, setMs] = useState(0);

  const sec = secs[secIdx];
  const hechosSec = sec ? sec.pasos.filter((p) => colocados.includes(p.id)).length : 0;
  const esperado = sec?.pasos[hechosSec] ?? null;
  const animando = !rep.terminado;

  function mazoDe(c: Checkpoint, ss: typeof secs, i: number): Carta[] {
    const sq = ss[i];
    if (!sq) return [];
    const reales: Carta[] = sq.pasos.map((p) => ({ id: p.id, tarjeta: p.tarjeta!, protagonistas: p.protagonistas }));
    const primera = ss[0]?.nombre ?? null;
    const dist = c.distractores
      .filter((d) => (ss.length === 1 ? true : (d.secuencia ?? primera) === sq.nombre))
      .map((d) => ({ id: d.id, tarjeta: d.tarjeta, falso: d.porQueEsFalso, protagonistas: [] }));
    return barajar([...reales, ...dist]);
  }

  const comprobar = (id: string) => {
    if (animando || fin || !esperado) return;
    const c = mazo.find((x) => x.id === id);
    if (!c) return;
    setSel(null);
    if (c.falso) {
      setErrores((e) => e + 1);
      setRacha((r) => r + 1);
      setFallos((f) => [...f, esperado.id]);
      setMazo((m) => m.filter((x) => x.id !== id));
      setAviso({ tipo: 'falso', texto: c.falso, carta: c.tarjeta });
      return;
    }
    if (c.id !== esperado.id) {
      setErrores((e) => e + 1);
      setRacha((r) => r + 1);
      setFallos((f) => [...f, esperado.id]);
      setSacude(id);
      setTimeout(() => setSacude(null), 380);
      setAviso({ tipo: 'orden', texto: 'Este paso ocurre más adelante: primero debe pasar algo que lo haga posible.' });
      return;
    }
    setRacha(0);
    setPista(0);
    setAviso({ tipo: 'ok', texto: '¡Correcto!' });
    setColocados((col) => [...col, id]);
    setMazo((m) => m.filter((x) => x.id !== id));
    rep.irA(indiceDe.get(id)!);
  };

  // Secuencia terminada → la siguiente (o fin) cuando acaba la animación.
  useEffect(() => {
    if (!sec || animando) return;
    if (hechosSec < sec.pasos.length) return;
    if (secIdx < secs.length - 1) {
      const i = secIdx + 1;
      setSecIdx(i);
      setMazo(mazoDe(cp, secs, i));
      setAviso({ tipo: 'ok', texto: `Ahora: ${secs[i].nombre ?? 'siguiente secuencia'}` });
    } else if (!fin) {
      const dur = Date.now() - t0.current;
      setMs(dur);
      setFin(true);
      const estrellas = errores === 0 && pistas === 0 ? 3 : errores <= 2 && pistas <= 1 ? 2 : 1;
      guardarAprender(cp.id as CheckpointId, nivel, { estrellas, errores, pistas, ms: dur });
      onProgreso();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hechosSec, animando, secIdx]);

  const pedirPista = () => {
    if (!esperado) return;
    setPistas((p) => p + 1);
    setPista((p) => (p === 0 ? 1 : 2));
  };

  const visibles = rep.escena.orden.filter((k) => rep.escena.actores[k].vis);
  const resaltarPista = pista >= 1 && esperado ? esperado.protagonistas.filter((k) => visibles.includes(k)) : null;
  const pistaTexto = pista >= 1 && esperado && resaltarPista && resaltarPista.length === 0
    ? `Fíjate en: ${esperado.protagonistas.map((k) => etiquetaTexto(cp.actores[k]?.label ?? k)).join(', ')}.`
    : null;
  const estrellas = errores === 0 && pistas === 0 ? 3 : errores <= 2 && pistas <= 1 ? 2 : 1;
  const ultimoColocado = colocados.length ? indiceDe.get(colocados[colocados.length - 1])! : 0;
  const puedePista = nivel !== 'examen' && racha >= 2 && !fin;

  // Teclado: flechas entre tarjetas, Enter elige.
  const cartasRef = useRef<HTMLDivElement>(null);
  const onKeyCartas = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const bs = [...(cartasRef.current?.querySelectorAll<HTMLButtonElement>('button[data-carta]') ?? [])];
    const i = bs.indexOf(document.activeElement as HTMLButtonElement);
    const j = e.key === 'ArrowDown' ? Math.min(bs.length - 1, i + 1) : Math.max(0, i - 1);
    bs[j]?.focus();
    e.preventDefault();
  };

  return (
    <div className={s.vista}>
      <div className={s.escenaZona}>
        <Escena escenario={cp} escena={rep.escena} resaltar={resaltarPista && resaltarPista.length ? resaltarPista : null} />
        {fin && (
          <div className={s.resultado} role="dialog" aria-label="Resultado">
            <div className={s.estrellas} aria-label={`${estrellas} de 3 estrellas`}>
              {[1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={i <= estrellas ? s.estrellaOn : s.estrellaOff} aria-hidden>
                  <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
                </svg>
              ))}
            </div>
            <h3 className={s.pasoTitulo}>Vía completa</h3>
            <p className={s.metricas}>
              {errores} {errores === 1 ? 'error' : 'errores'} · {pistas} {pistas === 1 ? 'pista' : 'pistas'} · {Math.round(ms / 1000)} s · nivel {NIVELES.find((n) => n.id === nivel)!.nombre.toLowerCase()}
            </p>
            {fallos.length > 0 && (
              <div className={s.fallos}>
                <p className={s.fichaRotulo}>Te equivocaste antes de estos pasos</p>
                {[...new Set(fallos)].map((id) => {
                  const p = cp.pasos.find((x) => x.id === id)!;
                  return <button key={id} type="button" className={s.chip} onClick={() => onVerPaso(id)}>{p.titulo}</button>;
                })}
              </div>
            )}
            <div className={s.resultadoBtns}>
              <button type="button" className={s.btnPrim} onClick={onRepetir}>Repetir</button>
              <button type="button" className={s.btnSec} onClick={onCambiarNivel}>Cambiar nivel</button>
              <button type="button" className={s.btnSec} onClick={onExplorar}>Ver en modo explorar</button>
              {onSiguiente && <button type="button" className={s.btnSec} onClick={onSiguiente}>Siguiente checkpoint</button>}
            </div>
          </div>
        )}
      </div>

      <div className={s.lateral}>
        <div className={s.mazo}>
          <div
            className={`${s.ranura} ${sel ? s.ranuraLista : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('text/plain'); if (id) comprobar(id); }}
          >
            <p className={s.lateralRotulo}>
              Siguiente paso{sec?.nombre ? ` · ${sec.nombre}` : ''}
              <span className={s.contador}> {colocados.length}/{secs.reduce((n, x) => n + x.pasos.length, 0)}</span>
            </p>
            {animando
              ? <p className={s.ranuraTxt}>Mira cómo ocurre…</p>
              : <p className={s.ranuraTxt}>{sel ? 'Pulsa «Comprobar»' : 'Arrastra aquí una tarjeta o selecciónala'}</p>}
            <div className={s.ranuraBtns}>
              <button type="button" className={s.btnPrim} disabled={!sel || animando || fin} onClick={() => sel && comprobar(sel)}>Comprobar</button>
              {puedePista && <button type="button" className={s.btnSec} onClick={pedirPista}>Pista{pista ? ' +' : ''}</button>}
            </div>
          </div>
          <div aria-live="assertive" className={s.avisoZona}>
            {aviso && (
              <div className={`${s.aviso} ${aviso.tipo === 'ok' ? s.avisoOk : s.avisoMal}`}>
                {aviso.tipo === 'falso' && <p className={s.avisoCarta}>Falso: «{aviso.carta}»</p>}
                <p>{aviso.texto}</p>
              </div>
            )}
            {pistaTexto && <div className={s.aviso}><p>{pistaTexto}</p></div>}
          </div>
          <div className={s.cartas} ref={cartasRef} onKeyDown={onKeyCartas}>
            {mazo.map((c) => (
              <button
                key={c.id}
                type="button"
                data-carta
                draggable={!animando}
                onDragStart={(e) => e.dataTransfer.setData('text/plain', c.id)}
                className={`${s.carta} ${sel === c.id ? s.cartaSel : ''} ${sacude === c.id ? s.sacudir : ''} ${pista === 2 && esperado?.id === c.id ? s.cartaPista : ''}`}
                onClick={() => setSel((x) => (x === c.id ? null : c.id))}
                onDoubleClick={() => comprobar(c.id)}
                aria-pressed={sel === c.id}
              >
                {nivel === 'guiado' && c.protagonistas.length > 0 && (
                  <span className={s.miniaturas} aria-hidden>
                    {c.protagonistas.slice(0, 4).map((k) => {
                      const src = imagen(cp.actores[k]?.img ?? '').src;
                      return src ? <img key={k} src={src} alt="" /> : null;
                    })}
                  </span>
                )}
                <span>{c.tarjeta}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.pie}>
        <Narracion escenario={cp} indice={ultimoColocado} oculta={nivel === 'examen' && !fin && colocados.length > 0} />
        <div className={s.pieDer}>
          <ol className={s.linea} aria-label="Pasos colocados">
            {secs.flatMap((x) => x.pasos).map((p) => (
              <li key={p.id}>
                <span className={`${s.puntoLinea} ${colocados.includes(p.id) ? s.puntoVisto : ''}`} title={colocados.includes(p.id) ? p.titulo : 'Pendiente'} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
