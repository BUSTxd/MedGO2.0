'use client';
// Modo Prueba: cuatro bloques sin ayudas (ordenar, ¿quién hace esto?, tipo de
// interacción, casos clínicos) y una revisión con «Ver en la vía». La prueba
// integrada reutiliza el bloque de opción múltiple.

import { useMemo, useState } from 'react';
import type { Checkpoint, CheckpointId, ConnectorType, QuizItem } from '@/lib/data/ciclo-celular/tipos';
import type { EscenarioCompilado } from '@/lib/ciclo-celular/motor';
import { imagen } from '@/lib/data/ciclo-celular/familias';
import { itemsIdentificar, itemsIntegrada, itemsInteraccion, itemsOrden, lis, TIPOS_INTERACCION, type ItemIdentificar, type ItemInteraccion } from '@/lib/ciclo-celular/prueba';
import { CHECKPOINTS, CHECKPOINT_POR_ID } from '@/lib/ciclo-celular/registro';
import { guardarPrueba } from '@/lib/ciclo-celular/progreso';
import INTEGRADA from '@/lib/data/ciclo-celular/integrada';
import Escena, { TextoSvg } from './Escena';
import { barajar, etiquetaTexto } from './texto';
import s from '@/styles/cicloCelular.module.css';

type Revision = { bloque: string; enunciado: string; tuya: string; correcta: string; explicacion?: string; cp?: CheckpointId; pasoId?: string | null; ok: boolean };
type Punto = { bloque: string; puntos: number; max: number };

const BLOQUES = ['Ordenar la secuencia', '¿Quién hace esto?', 'Tipo de interacción', 'Caso clínico y razonamiento'];
const LETRAS = ['a', 'b', 'c', 'd'];

// ─── Ordenar ──────────────────────────────────────────────────────────────────

function OrdenTask({ cp, onFin }: { cp: Checkpoint; onFin: (p: Punto, r: Revision[]) => void }) {
  const correctos = useMemo(() => itemsOrden(cp), [cp]);
  const [lista, setLista] = useState(() => {
    let b = barajar(correctos);
    if (b.every((x, i) => x.id === correctos[i].id) && b.length > 1) b = [...b.slice(1), b[0]];
    return b;
  });
  const [arr, setArr] = useState<number | null>(null);
  const mover = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= lista.length) return;
    const l = [...lista];
    [l[i], l[j]] = [l[j], l[i]];
    setLista(l);
  };
  const comprobar = () => {
    const pos = lista.map((p) => correctos.findIndex((c) => c.id === p.id));
    const n = lis(pos);
    const ok = n === correctos.length;
    onFin({ bloque: BLOQUES[0], puntos: n / correctos.length, max: 1 }, [{
      bloque: BLOQUES[0], enunciado: 'Ordena los pasos de la vía', ok,
      tuya: lista.map((p) => p.tarjeta).join(' → '),
      correcta: correctos.map((p) => p.tarjeta).join(' → '),
      explicacion: `Acertaste la posición relativa de ${n} de ${correctos.length} pasos.`,
      cp: cp.id,
    }]);
  };
  return (
    <div className={s.tarea}>
      <p className={s.tareaEnunciado}>Ordena estos pasos de la vía, del primero al último.</p>
      <ol className={s.ordenLista}>
        {lista.map((p, i) => (
          <li
            key={p.id}
            className={`${s.ordenItem} ${arr === i ? s.ordenArrastre : ''}`}
            draggable
            onDragStart={() => setArr(i)}
            onDragOver={(e) => { e.preventDefault(); if (arr !== null && arr !== i) { const l = [...lista]; const [x] = l.splice(arr, 1); l.splice(i, 0, x); setLista(l); setArr(i); } }}
            onDragEnd={() => setArr(null)}
          >
            <span className={s.ordenNum}>{i + 1}</span>
            <span className={s.ordenTxt}>{p.tarjeta}</span>
            <span className={s.ordenBtns}>
              <button type="button" className={s.btnIcono} onClick={() => mover(i, -1)} disabled={i === 0} aria-label={`Subir: ${p.tarjeta}`}>
                <svg viewBox="0 0 20 20" aria-hidden><path d="M5 12.5L10 7.5l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
              <button type="button" className={s.btnIcono} onClick={() => mover(i, 1)} disabled={i === lista.length - 1} aria-label={`Bajar: ${p.tarjeta}`}>
                <svg viewBox="0 0 20 20" aria-hidden><path d="M5 7.5L10 12.5l5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </span>
          </li>
        ))}
      </ol>
      <button type="button" className={s.btnPrim} onClick={comprobar}>Comprobar orden</button>
    </div>
  );
}

// ─── ¿Quién hace esto? ───────────────────────────────────────────────────────

function IdentificarTask({ cp, c, inmediato, onFin }: { cp: Checkpoint; c: EscenarioCompilado; inmediato: boolean; onFin: (p: Punto, r: Revision[]) => void }) {
  const items = useMemo(() => itemsIdentificar(cp, c), [cp, c]);
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Revision[]>([]);
  const [marca, setMarca] = useState<{ key: string; ok: boolean } | null>(null);
  if (!items.length) return <SinItems onFin={() => onFin({ bloque: BLOQUES[1], puntos: 0, max: 0 }, [])} />;
  const it: ItemIdentificar = items[i];
  const pc = c.pasos[it.paso];
  const L = (k: string) => etiquetaTexto(cp.actores[k]?.label ?? k);
  const avanzar = (r: Revision[]) => {
    setMarca(null);
    if (i + 1 < items.length) { setRes(r); setI(i + 1); }
    else onFin({ bloque: BLOQUES[1], puntos: r.filter((x) => x.ok).length, max: items.length }, r);
  };
  const tocar = (k: string) => {
    if (marca) return;
    const ok = L(k) === it.correcto;
    const r = [...res, { bloque: BLOQUES[1], enunciado: it.enunciado, tuya: L(k), correcta: it.correcto, ok, cp: cp.id, pasoId: it.pasoId }];
    if (inmediato) { setMarca({ key: k, ok }); setTimeout(() => avanzar(r), 1100); }
    else avanzar(r);
  };
  return (
    <div className={s.tarea}>
      <p className={s.tareaEnunciado}>{it.enunciado}</p>
      <p className={s.tareaAyuda}>{i + 1} de {items.length} · las etiquetas están ocultas</p>
      <div className={s.tareaEscena}>
        <Escena key={it.id} escenario={cp} escena={pc.final} ocultarEtiquetas onActor={tocar} seleccionado={marca?.key ?? null} camaraLibre={false} />
        {marca && <div className={`${s.aviso} ${marca.ok ? s.avisoOk : s.avisoMal} ${s.tareaMarca}`}>{marca.ok ? 'Correcto' : `Era: ${it.correcto}`}</div>}
      </div>
    </div>
  );
}

// ─── Tipo de interacción ─────────────────────────────────────────────────────

function Mini({ cp, k }: { cp: Checkpoint; k: string }) {
  const d = cp.actores[k];
  const img = imagen(d.img);
  return (
    <div className={s.interMini}>
      {img.src ? <img src={img.src} alt="" /> : <span className={s.fichaSinImg}>{d.img}</span>}
      <svg className={s.interNombre} viewBox="0 0 200 26" aria-label={etiquetaTexto(d.label)}><text x={100} y={18} textAnchor="middle"><TextoSvg texto={d.label} /></text></svg>
    </div>
  );
}

function InteraccionTask({ cp, c, inmediato, onFin }: { cp: Checkpoint; c: EscenarioCompilado; inmediato: boolean; onFin: (p: Punto, r: Revision[]) => void }) {
  const items = useMemo(() => itemsInteraccion(cp, c), [cp, c]);
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Revision[]>([]);
  const [marca, setMarca] = useState<{ t: ConnectorType; ok: boolean } | null>(null);
  if (!items.length) return <SinItems onFin={() => onFin({ bloque: BLOQUES[2], puntos: 0, max: 0 }, [])} />;
  const it: ItemInteraccion = items[i];
  const nombre = (t: ConnectorType) => TIPOS_INTERACCION.find((x) => x.tipo === t)?.nombre ?? t;
  const L = (k: string) => etiquetaTexto(cp.actores[k]?.label ?? k);
  const elegir = (t: ConnectorType) => {
    if (marca) return;
    const ok = t === it.correcto;
    const r = [...res, { bloque: BLOQUES[2], enunciado: `${L(it.from)} → ? → ${L(it.to)}`, tuya: nombre(t), correcta: nombre(it.correcto), ok, cp: cp.id, pasoId: it.pasoId }];
    const seguir = () => {
      setMarca(null);
      if (i + 1 < items.length) { setRes(r); setI(i + 1); }
      else onFin({ bloque: BLOQUES[2], puntos: r.filter((x) => x.ok).length, max: items.length }, r);
    };
    if (inmediato) { setMarca({ t, ok }); setTimeout(seguir, 1100); } else seguir();
  };
  return (
    <div className={s.tarea}>
      <p className={s.tareaEnunciado}>¿Qué hace la primera sobre la segunda?</p>
      <p className={s.tareaAyuda}>{i + 1} de {items.length}</p>
      <div className={s.inter}>
        <Mini cp={cp} k={it.from} />
        <svg viewBox="0 0 120 20" className={s.interFlecha} aria-hidden><line x1={4} y1={10} x2={116} y2={10} strokeDasharray="6 6" /></svg>
        <Mini cp={cp} k={it.to} />
      </div>
      <div className={s.opcionesInter}>
        {TIPOS_INTERACCION.map((t) => (
          <button
            key={t.tipo}
            type="button"
            className={`${s.opcion} ${marca && t.tipo === it.correcto ? s.opcionOk : ''} ${marca && !marca.ok && marca.t === t.tipo ? s.opcionMal : ''}`}
            onClick={() => elegir(t.tipo)}
          >{t.nombre}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Opción múltiple ─────────────────────────────────────────────────────────

function OpcionMultiple({ items, bloque, inmediato, onFin, cpDe }: {
  items: QuizItem[]; bloque: string; inmediato: boolean;
  onFin: (p: Punto, r: Revision[]) => void;
  cpDe: (q: QuizItem) => CheckpointId | undefined;
}) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<Revision[]>([]);
  const [marca, setMarca] = useState<number | null>(null);
  if (!items.length) return <SinItems onFin={() => onFin({ bloque, puntos: 0, max: 0 }, [])} />;
  const q = items[i];
  const elegir = (k: number) => {
    if (marca !== null) return;
    const ok = k === q.correcta;
    const r = [...res, { bloque, enunciado: q.enunciado, tuya: q.opciones[k], correcta: q.opciones[q.correcta], explicacion: q.explicacion, ok, cp: cpDe(q), pasoId: q.pasoRelacionado ?? null }];
    const seguir = () => {
      setMarca(null);
      if (i + 1 < items.length) { setRes(r); setI(i + 1); }
      else onFin({ bloque, puntos: r.filter((x) => x.ok).length, max: items.length }, r);
    };
    if (inmediato) { setMarca(k); setTimeout(seguir, 1600); } else seguir();
  };
  return (
    <div className={s.tarea}>
      <p className={s.tareaAyuda}>{i + 1} de {items.length}</p>
      <p className={s.tareaEnunciado}>{q.enunciado}</p>
      <div className={s.opciones}>
        {q.opciones.map((o, k) => (
          <button
            key={k}
            type="button"
            className={`${s.opcion} ${marca !== null && k === q.correcta ? s.opcionOk : ''} ${marca === k && k !== q.correcta ? s.opcionMal : ''}`}
            onClick={() => elegir(k)}
          >
            <span className={s.opcionLetra}>{LETRAS[k]}</span>{o}
          </button>
        ))}
      </div>
      {marca !== null && <p className={s.tareaExplicacion}>{q.explicacion}</p>}
    </div>
  );
}

function SinItems({ onFin }: { onFin: () => void }) {
  return (
    <div className={s.tarea}>
      <p className={s.tareaAyuda}>Este bloque no tiene ítems para esta vía.</p>
      <button type="button" className={s.btnPrim} onClick={onFin}>Continuar</button>
    </div>
  );
}

// ─── Resultado ───────────────────────────────────────────────────────────────

function Resultado({ puntos, revision, onRepetir, onVer, extra }: {
  puntos: Punto[]; revision: Revision[]; onRepetir: () => void;
  onVer: (cp: CheckpointId, pasoId: string | null) => void; extra?: React.ReactNode;
}) {
  const conMax = puntos.filter((p) => p.max > 0);
  const total = conMax.reduce((a, p) => a + p.puntos, 0);
  const max = conMax.reduce((a, p) => a + p.max, 0);
  const nota = max ? Math.round((total / max) * 100) : 0;
  const fallos = revision.filter((r) => !r.ok);
  return (
    <div className={s.resultadoPrueba}>
      <p className={s.nota}><strong>{nota}</strong><span>/100</span></p>
      <ul className={s.desglose}>
        {conMax.map((p) => (
          <li key={p.bloque}>
            <span>{p.bloque}</span>
            <span className={s.barra}><span style={{ width: `${(p.puntos / p.max) * 100}%` }} /></span>
            <span>{Math.round(p.puntos * 10) / 10}/{p.max}</span>
          </li>
        ))}
      </ul>
      {fallos.length > 0 && (
        <div className={s.revision}>
          <p className={s.fichaRotulo}>Revisión</p>
          {fallos.map((r, i) => (
            <div key={i} className={s.revisionItem}>
              <p className={s.revisionEnunciado}>{r.enunciado}</p>
              <p className={s.revisionTuya}>Tu respuesta: {r.tuya}</p>
              <p className={s.revisionOk}>Correcta: {r.correcta}</p>
              {r.explicacion && <p className={s.revisionExp}>{r.explicacion}</p>}
              {r.cp && <button type="button" className={s.chip} onClick={() => onVer(r.cp!, r.pasoId ?? null)}>Ver en la vía</button>}
            </div>
          ))}
        </div>
      )}
      <div className={s.resultadoBtns}>
        <button type="button" className={s.btnPrim} onClick={onRepetir}>Repetir prueba</button>
        {extra}
      </div>
    </div>
  );
}

function Progreso({ i, n, nombres }: { i: number; n: number; nombres: string[] }) {
  return (
    <div className={s.progresoPrueba} aria-label={`Bloque ${Math.min(i + 1, n)} de ${n}`}>
      {nombres.map((b, k) => <span key={b} className={k < i ? s.progHecho : k === i ? s.progActual : ''}>{b}</span>)}
    </div>
  );
}

// ─── Prueba de un checkpoint ─────────────────────────────────────────────────

export default function Prueba({ checkpoint: cp, compilado, onVer, onProgreso, onSiguiente }: {
  checkpoint: Checkpoint; compilado: EscenarioCompilado;
  onVer: (cp: CheckpointId, pasoId: string | null) => void; onProgreso: () => void; onSiguiente: (() => void) | null;
}) {
  const [ronda, setRonda] = useState(0);
  return <PruebaCp key={ronda} cp={cp} c={compilado} onVer={onVer} onProgreso={onProgreso} onSiguiente={onSiguiente} onRepetir={() => setRonda((r) => r + 1)} />;
}

function PruebaCp({ cp, c, onVer, onProgreso, onSiguiente, onRepetir }: {
  cp: Checkpoint; c: EscenarioCompilado; onVer: (cp: CheckpointId, pasoId: string | null) => void;
  onProgreso: () => void; onSiguiente: (() => void) | null; onRepetir: () => void;
}) {
  const [bloque, setBloque] = useState(0);
  const [inmediato, setInmediato] = useState(false);
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [revision, setRevision] = useState<Revision[]>([]);
  const preguntas = useMemo(() => [...cp.preguntas], [cp]);
  const terminar = (p: Punto, r: Revision[]) => {
    const ps = [...puntos, p];
    setPuntos(ps);
    setRevision((x) => [...x, ...r]);
    if (bloque === 3) {
      const con = ps.filter((x) => x.max > 0);
      const nota = Math.round((con.reduce((a, x) => a + x.puntos, 0) / Math.max(1, con.reduce((a, x) => a + x.max, 0))) * 100);
      guardarPrueba(cp.id, nota);
      onProgreso();
    }
    setBloque((b) => b + 1);
  };
  return (
    <div className={s.pruebaVista}>
      <div className={s.pruebaCab}>
        <Progreso i={bloque} n={4} nombres={BLOQUES} />
        {bloque < 4 && (
          <label className={s.interruptor}>
            <input type="checkbox" checked={inmediato} onChange={(e) => setInmediato(e.target.checked)} />
            <span>Corregir al momento</span>
          </label>
        )}
      </div>
      {bloque === 0 && <OrdenTask cp={cp} onFin={terminar} />}
      {bloque === 1 && <IdentificarTask cp={cp} c={c} inmediato={inmediato} onFin={terminar} />}
      {bloque === 2 && <InteraccionTask cp={cp} c={c} inmediato={inmediato} onFin={terminar} />}
      {bloque === 3 && <OpcionMultiple items={preguntas} bloque={BLOQUES[3]} inmediato={inmediato} onFin={terminar} cpDe={() => cp.id} />}
      {bloque >= 4 && (
        <Resultado
          puntos={puntos} revision={revision} onRepetir={onRepetir} onVer={onVer}
          extra={onSiguiente && <button type="button" className={s.btnSec} onClick={onSiguiente}>Siguiente checkpoint</button>}
        />
      )}
    </div>
  );
}

// ─── Prueba integrada ────────────────────────────────────────────────────────

export function PruebaIntegrada({ onVer, onProgreso }: { onVer: (cp: CheckpointId, pasoId: string | null) => void; onProgreso: () => void }) {
  const [ronda, setRonda] = useState(0);
  const items = useMemo(() => itemsIntegrada(CHECKPOINTS, INTEGRADA), [ronda]);
  const [fin, setFin] = useState<{ p: Punto; r: Revision[] } | null>(null);
  const [inmediato, setInmediato] = useState(false);
  const cpDe = (q: QuizItem & { origen?: string }) => {
    if (q.origen && q.origen in CHECKPOINT_POR_ID) return q.origen as CheckpointId;
    return q.checkpoints?.[0];
  };
  return (
    <div className={s.pruebaVista}>
      <div className={s.pruebaCab}>
        <div>
          <h3 className={s.pasoTitulo}>Prueba integrada</h3>
          <p className={s.tareaAyuda}>{items.length} preguntas de los cinco checkpoints, con preguntas puente que los cruzan.</p>
        </div>
        {!fin && (
          <label className={s.interruptor}>
            <input type="checkbox" checked={inmediato} onChange={(e) => setInmediato(e.target.checked)} />
            <span>Corregir al momento</span>
          </label>
        )}
      </div>
      {!fin ? (
        <OpcionMultiple
          key={ronda}
          items={items}
          bloque="Integrada"
          inmediato={inmediato}
          cpDe={cpDe}
          onFin={(p, r) => {
            setFin({ p, r });
            guardarPrueba('integrada', Math.round((p.puntos / Math.max(1, p.max)) * 100));
            onProgreso();
          }}
        />
      ) : (
        <Resultado puntos={[fin.p]} revision={fin.r} onRepetir={() => { setFin(null); setRonda((r) => r + 1); }} onVer={onVer} />
      )}
    </div>
  );
}
