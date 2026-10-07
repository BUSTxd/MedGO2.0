'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Vector3 } from 'three';
import { CREDITO, FALTA_EN_TODAS, SISTEMA, SISTEMAS, regionPorId, type Sistema } from '@/lib/data/atlas-3d/regiones';
import { REPASOS } from '@/lib/data/atlas-3d/repasos';
import { cargarFichas } from '@/lib/data/atlas-3d/fichas';
import type { Fichas } from '@/lib/data/atlas-3d/fichas/tipos';
import { cargarAtlas, type Atlas } from '@/lib/atlas-3d/cargar';
import Escena, { type PeticionCamara, type Transparencia, type Vista } from './Escena';
import FichaDetalle from './FichaDetalle';
import PanelRepaso, { type EstadoRepaso, type ModoRepaso, type Pregunta } from './PanelRepaso';
import s from '@/styles/atlas3d.module.css';

const VISTAS: { id: Vista; nombre: string }[] = [
  { id: 'anterior', nombre: 'Anterior' },
  { id: 'posterior', nombre: 'Posterior' },
  { id: 'lateral', nombre: 'Lateral' },
  { id: 'medial', nombre: 'Medial' },
];

const TRANSPARENCIAS: { id: Transparencia; nombre: string }[] = [
  { id: 'ninguna', nombre: 'Nada' },
  { id: 'musculos', nombre: 'Músculos' },
  { id: 'todo', nombre: 'Todo' },
];

const quitarTildes = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function barajar<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Estructura = piezas con el mismo nombre y lado (p. ej. las dos mallas del flexor superficial). */
interface Estructura {
  clave: string;
  nombre: string;
  nombreEn: string;
  sistema: Sistema;
  zona: string;
  tambien?: string[];
  ids: string[];
}

export default function Visor({ regiones }: { regiones: string[] }) {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const [empezado, setEmpezado] = useState(false);
  const empezar = useCallback(() => setEmpezado(true), []);

  useEffect(() => {
    const abort = new AbortController();
    setError(null);
    setProgreso(0);
    cargarAtlas(regiones, setProgreso, abort.signal)
      .then(setAtlas)
      .catch((e: unknown) => {
        if (!abort.signal.aborted) setError(e instanceof Error ? e.message : 'No se pudo cargar el modelo.');
      });
    return () => abort.abort();
  }, [regiones, intento]);

  // Liberar la memoria de la GPU al salir.
  useEffect(() => () => atlas?.piezas.forEach((p) => p.geometry.dispose()), [atlas]);

  if (error) {
    return (
      <div className={s.cargando} role="alert">
        <p>{error}</p>
        <button type="button" className={s.boton} onClick={() => setIntento((n) => n + 1)}>
          Reintentar
        </button>
      </div>
    );
  }
  if (!atlas) {
    return (
      <div className={s.cargando} aria-busy="true">
        <p>Descargando el modelo…</p>
        <div className={s.barra} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progreso * 100)}>
          <span style={{ width: `${progreso * 100}%` }} />
        </div>
      </div>
    );
  }
  return (
    <>
      <Explorador atlas={atlas} regiones={regiones} />
      {!empezado && <Aviso regiones={regiones} onEmpezar={empezar} />}
    </>
  );
}

/** Lo que falta, encima de todo (portal a <body>, también sobre la sidebar) con el modelo ya cargado detrás. */
function Aviso({ regiones, onEmpezar }: { regiones: string[]; onEmpezar: () => void }) {
  const lista = regiones.map(regionPorId).filter((r) => r !== undefined);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && onEmpezar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [onEmpezar]);
  return createPortal(
    <div className={s.avisoVelo}>
      <section className={s.aviso} role="dialog" aria-modal="true" aria-labelledby="aviso-atlas">
        <span className={s.avisoKicker}>Antes de empezar</span>
        <h2 id="aviso-atlas">Lo que este modelo aún no trae</h2>
        {lista.map((r) => (
          <div key={r.id} className={s.avisoRegion}>
            {lista.length > 1 && <h3>{r.nombre}</h3>}
            <ul>
              {r.faltan.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
        <p className={s.avisoNota}>{FALTA_EN_TODAS}</p>
        <button type="button" className={s.avisoBoton} onClick={onEmpezar} autoFocus>
          Empezar
        </button>
      </section>
    </div>,
    document.body,
  );
}

function Explorador({ atlas, regiones }: { atlas: Atlas; regiones: string[] }) {
  const { piezas } = atlas;
  const dosLados = useMemo(() => new Set(piezas.map((p) => p.lado)).size > 1, [piezas]);

  const estructuras = useMemo(() => {
    const m = new Map<string, Estructura>();
    for (const p of piezas) {
      const clave = `${p.nombre}|${p.lado}`;
      const e = m.get(clave);
      if (e) e.ids.push(p.id);
      else
        m.set(clave, {
          clave,
          nombre: dosLados ? `${p.nombre} (${p.lado === 'derecho' ? 'der.' : 'izq.'})` : p.nombre,
          nombreEn: p.nombreEn,
          sistema: p.sistema,
          zona: p.zona,
          tambien: p.tambien,
          ids: [p.id],
        });
    }
    return m;
  }, [piezas, dosLados]);
  const estructuraDe = useMemo(() => {
    const m = new Map<string, Estructura>();
    for (const e of estructuras.values()) for (const id of e.ids) m.set(id, e);
    return m;
  }, [estructuras]);

  const sistemasPresentes = useMemo(() => SISTEMAS.filter((x) => piezas.some((p) => p.sistema === x.id)), [piezas]);
  const cuenta = useMemo(() => {
    const c = {} as Record<Sistema, number>;
    for (const e of estructuras.values()) c[e.sistema] = (c[e.sistema] ?? 0) + 1;
    return c;
  }, [estructuras]);
  const zonas = useMemo(() => {
    const vistas = new Map<string, string>();
    for (const id of regiones) for (const z of regionPorId(id)?.zonas ?? []) vistas.set(z.id, z.nombre);
    return [...vistas].map(([id, nombre]) => ({ id, nombre }));
  }, [regiones]);
  const titulo = regiones.map((id) => regionPorId(id)?.nombre ?? id).join(' + ');

  // ─── Estado de la exploración ──────────────────────────────────────────────
  const [sistemas, setSistemas] = useState<Set<Sistema>>(
    () => new Set(sistemasPresentes.filter((x) => !x.apagado).map((x) => x.id)),
  );
  const [zona, setZona] = useState<string>('todo');
  const [ocultas, setOcultas] = useState<Set<string>>(() => new Set());
  /** Lo ocultado, en orden, para deshacer de una en una. */
  const [historial, setHistorial] = useState<Estructura[]>([]);
  const [aislado, setAislado] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [transparencia, setTransparencia] = useState<Transparencia>('ninguna');
  const [busqueda, setBusqueda] = useState('');

  // ─── Fichas (origen, inserción, inervación…): se bajan aparte ──────────────
  const [fichas, setFichas] = useState<Fichas | null>(null);
  useEffect(() => {
    let vivo = true;
    cargarFichas(regiones).then((f) => vivo && setFichas(f)).catch(() => {});
    return () => {
      vivo = false;
    };
  }, [regiones]);

  // ─── Repaso guiado (plexos) ────────────────────────────────────────────────
  const porEn = useMemo(() => {
    const m = new Map<string, Estructura>();
    for (const e of estructuras.values()) if (!m.has(e.nombreEn)) m.set(e.nombreEn, e);
    return m;
  }, [estructuras]);
  const idsDe = useCallback((ens: string[]) => new Set(ens.flatMap((en) => porEn.get(en)?.ids ?? [])), [porEn]);
  /** Solo los repasos cuyas piezas trae lo cargado. */
  const repasos = useMemo(() => REPASOS.filter((r) => r.pasos.every((p) => p.piezas.some((x) => porEn.has(x.en)))), [porEn]);
  const [repaso, setRepaso] = useState<EstadoRepaso | null>(null);
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const [marcador, setMarcador] = useState({ aciertos: 0, total: 0 });
  const def = repaso ? repasos.find((r) => r.id === repaso.id) ?? null : null;
  const paso = def && repaso ? def.pasos[repaso.paso] : null;
  const repasoIds = useMemo(() => {
    if (!def) return null;
    return { pool: idsDe(def.pasos.flatMap((p) => p.piezas.map((x) => x.en))), contexto: idsDe(def.contexto) };
  }, [def, idsDe]);
  const idsPaso = useMemo(() => (paso ? idsDe(paso.piezas.map((x) => x.en)) : null), [paso, idsDe]);

  const visibles = useMemo(() => {
    const v = new Set<string>();
    if (repasoIds) {
      repasoIds.pool.forEach((id) => v.add(id));
      repasoIds.contexto.forEach((id) => v.add(id));
      return v;
    }
    const aisladas = aislado ? estructuras.get(aislado)?.ids : null;
    for (const p of piezas) {
      if (aisladas) {
        if (aisladas.includes(p.id)) v.add(p.id);
        continue;
      }
      if (!sistemas.has(p.sistema) || ocultas.has(p.id)) continue;
      if (zona !== 'todo' && p.zona !== zona && !p.tambien?.includes(zona)) continue;
      v.add(p.id);
    }
    return v;
  }, [piezas, estructuras, sistemas, ocultas, zona, aislado, repasoIds]);

  const elegida = seleccion ? estructuras.get(seleccion) ?? null : null;
  // Resaltado: lo tocado; si no, en el repaso, las piezas del paso o la de la pregunta.
  const idsSeleccion = useMemo(() => {
    if (elegida) return new Set(elegida.ids.filter((id) => visibles.has(id)));
    if (repaso?.modo === 'recorrido' && idsPaso) return idsPaso;
    if (repaso?.modo === 'prueba' && pregunta) return idsDe([pregunta.en]);
    return new Set<string>();
  }, [elegida, visibles, repaso?.modo, idsPaso, pregunta, idsDe]);
  const rotulo = elegida && idsSeleccion.size
    ? elegida.nombre
    : repaso?.modo === 'prueba' && pregunta?.respuesta
      ? porEn.get(pregunta.en)?.nombre ?? null
      : null;
  const rotulos = useMemo(
    () =>
      repaso?.modo === 'recorrido' && paso && !elegida
        ? paso.piezas.map((x) => ({ texto: x.rotulo, ids: idsDe([x.en]), clave: `${repaso.id}|${repaso.paso}|${x.en}` }))
        : undefined,
    [repaso?.modo, repaso?.id, repaso?.paso, paso, elegida, idsDe],
  );

  // ─── Cámara ────────────────────────────────────────────────────────────────
  const [vista, setVista] = useState<Vista>('anterior');
  const [pedido, setPedido] = useState(0);
  const reducido = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const encuadrar = useCallback(() => setPedido((n) => n + 1), []);
  const camara: PeticionCamara = useMemo(() => {
    const min = new Vector3(Infinity, Infinity, Infinity);
    const max = new Vector3(-Infinity, -Infinity, -Infinity);
    // En el repaso se encuadra el paso (o todo el plexo en la prueba), no los huesos de contexto.
    const encuadre = repasoIds ? (repaso?.modo === 'recorrido' && idsPaso ? idsPaso : repasoIds.pool) : visibles;
    for (const p of piezas) {
      if (!encuadre.has(p.id)) continue;
      const g = p.geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      min.min(g.boundingBox!.min);
      max.max(g.boundingBox!.max);
    }
    if (!Number.isFinite(min.x)) return { vista, min: atlas.min, max: atlas.max, n: pedido };
    return { vista, min, max, n: pedido };
    // Solo se reencuadra cuando se pide (vista, zona, aislar, botón), no al ocultar una pieza.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, pedido, zona, aislado, piezas, atlas, repaso?.id, repaso?.paso, repaso?.modo]);

  // ─── Acciones ──────────────────────────────────────────────────────────────
  const enPrueba = repaso?.modo === 'prueba';
  const seleccionar = useCallback(
    (id: string | null) => {
      // En la prueba tocar una pieza no la nombra (sería la respuesta).
      if (!enPrueba) setSeleccion(id ? estructuraDe.get(id)?.clave ?? null : null);
    },
    [estructuraDe, enPrueba],
  );
  const enRepaso = repaso !== null;
  const aislar = useCallback((id: string) => {
    if (enRepaso) return;
    const clave = estructuraDe.get(id)?.clave ?? null;
    setAislado(clave);
    setSeleccion(clave);
  }, [estructuraDe, enRepaso]);

  /** Pieza al azar del plexo (no la anterior) con tres distractores, primero de su mismo paso. */
  const nuevaPregunta = useCallback((repasoId: string, anterior?: string) => {
    const r = repasos.find((x) => x.id === repasoId);
    if (!r) return;
    const pool = [...new Set(r.pasos.flatMap((p) => p.piezas.map((x) => x.en)))].filter(
      (en) => porEn.has(en) && !r.noPreguntar?.includes(en),
    );
    const candidatas = pool.filter((en) => en !== anterior);
    const en = candidatas[Math.floor(Math.random() * candidatas.length)];
    const hermanas = barajar(r.pasos.filter((p) => p.piezas.some((x) => x.en === en)).flatMap((p) => p.piezas.map((x) => x.en)));
    const nombre = (x: string) => porEn.get(x)!.nombre;
    const opciones = [en];
    for (const x of [...hermanas, ...barajar(pool)]) {
      if (opciones.length === 4) break;
      if (pool.includes(x) && !opciones.some((o) => nombre(o) === nombre(x))) opciones.push(x);
    }
    setPregunta({ en, opciones: barajar(opciones), respuesta: null });
  }, [repasos, porEn]);

  const empezarRepaso = (id: string) => {
    setRepaso({ id, modo: 'recorrido', paso: 0 });
    setSeleccion(null);
    setAislado(null);
    setBusqueda('');
    setPregunta(null);
    setMarcador({ aciertos: 0, total: 0 });
  };
  const salirRepaso = () => {
    setRepaso(null);
    setPregunta(null);
    setSeleccion(null);
  };
  const cambiarModo = (modo: ModoRepaso) => {
    if (!repaso || repaso.modo === modo) return;
    setRepaso({ ...repaso, modo });
    setSeleccion(null);
    if (modo === 'prueba') {
      setMarcador({ aciertos: 0, total: 0 });
      nuevaPregunta(repaso.id);
    } else setPregunta(null);
  };
  const irAPaso = (n: number) => {
    if (!repaso || !def || n < 0 || n >= def.pasos.length) return;
    setRepaso({ ...repaso, paso: n });
    setSeleccion(null);
  };
  const responder = (en: string) => {
    if (!pregunta || pregunta.respuesta) return;
    setPregunta({ ...pregunta, respuesta: en });
    setMarcador((m) => ({ aciertos: m.aciertos + (en === pregunta.en ? 1 : 0), total: m.total + 1 }));
  };

  /** Desde el buscador: si la estructura no está a la vista, se destapa. */
  const elegirDeLista = (e: Estructura) => {
    setSeleccion(e.clave);
    setBusqueda('');
    if (aislado && aislado !== e.clave) setAislado(null);
    setSistemas((prev) => (prev.has(e.sistema) ? prev : new Set(prev).add(e.sistema)));
    if (zona !== 'todo' && zona !== e.zona && !e.tambien?.includes(zona)) setZona('todo');
    setOcultas((prev) => {
      if (!e.ids.some((id) => prev.has(id))) return prev;
      const n = new Set(prev);
      e.ids.forEach((id) => n.delete(id));
      return n;
    });
  };

  const ocultarSeleccion = () => {
    if (!elegida) return;
    setOcultas((prev) => {
      const n = new Set(prev);
      elegida.ids.forEach((id) => n.add(id));
      return n;
    });
    setHistorial((h) => [...h, elegida]);
    if (aislado === elegida.clave) setAislado(null);
    setSeleccion(null);
  };

  /** Vuelve a mostrar la última estructura ocultada y la deja seleccionada. */
  const deshacer = useCallback(() => {
    const ultima = historial.at(-1);
    if (!ultima) return;
    setHistorial((h) => h.slice(0, -1));
    setOcultas((prev) => {
      const n = new Set(prev);
      ultima.ids.forEach((id) => n.delete(id));
      return n;
    });
    setSeleccion(ultima.clave);
  }, [historial]);

  const mostrarOcultas = () => {
    setOcultas(new Set());
    setHistorial([]);
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        deshacer();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [deshacer]);

  const alternarSistema = (id: Sistema) =>
    setSistemas((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const resultados = useMemo(() => {
    const q = quitarTildes(busqueda.trim());
    if (q.length < 2) return [];
    return [...estructuras.values()]
      .filter((e) => quitarTildes(e.nombre).includes(q) || e.nombreEn.toLowerCase().includes(q))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      .slice(0, 30);
  }, [busqueda, estructuras]);

  const nombreZona = (id: string) => zonas.find((z) => z.id === id)?.nombre ?? id;

  return (
    <div className={s.lab}>
      <div className={s.escenario}>
        <Escena
          piezas={piezas}
          visibles={visibles}
          seleccion={idsSeleccion}
          rotulo={rotulo}
          rotulos={rotulos}
          transparencia={transparencia}
          translucidas={repasoIds?.contexto}
          camara={camara}
          reducido={reducido}
          onSelect={seleccionar}
          onAislar={aislar}
        />
        <div className={s.vistas} role="group" aria-label="Vista">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={v.id === vista ? s.vistaActiva : s.vista}
              aria-pressed={v.id === vista}
              onClick={() => {
                setVista(v.id);
                encuadrar();
              }}
            >
              {v.nombre}
            </button>
          ))}
          <button type="button" className={s.vista} onClick={encuadrar} title="Volver a encuadrar lo visible">
            Encuadrar
          </button>
        </div>
        <div className={s.accionesEscena}>
          {aislado && !repaso && (
            <button
              type="button"
              className={s.salirAislado}
              onClick={() => {
                setAislado(null);
                encuadrar();
              }}
            >
              Mostrar todo
            </button>
          )}
          {historial.length > 0 && !repaso && (
            <button type="button" className={s.deshacer} onClick={deshacer} title="Deshacer (Ctrl+Z)">
              <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 14 4 9l5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Deshacer: {historial.at(-1)!.nombre}</span>
            </button>
          )}
        </div>
        <p className={s.ayuda}>Arrastra para girar · rueda o pellizca para acercar · toca una estructura · doble toque para aislarla</p>
      </div>

      <aside className={s.panel}>
        <header className={s.cabecera}>
          <span className={s.kicker}>Atlas 3D · Aparato Locomotor</span>
          <h1 className={s.titulo}>{titulo}</h1>
          <p className={s.meta}>{estructuras.size} estructuras</p>
        </header>

        {def && repaso && (
          <PanelRepaso
            repaso={def}
            estado={repaso}
            pregunta={pregunta}
            marcador={marcador}
            nombreDe={(en) => porEn.get(en)?.nombre ?? en}
            elegidaEn={elegida?.nombreEn ?? null}
            onPaso={irAPaso}
            onModo={cambiarModo}
            onElegir={(en) => {
              const e = porEn.get(en);
              if (e) setSeleccion(seleccion === e.clave ? null : e.clave);
            }}
            onResponder={responder}
            onSiguiente={() => nuevaPregunta(repaso.id, pregunta?.en)}
            onSalir={salirRepaso}
          />
        )}

        {!repaso && (
          <div className={s.buscador}>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar estructura…"
              aria-label="Buscar estructura"
            />
            {resultados.length > 0 && (
              <ul className={s.resultados}>
                {resultados.map((e) => (
                  <li key={e.clave}>
                    <button type="button" onClick={() => elegirDeLista(e)}>
                      <i style={{ background: SISTEMA[e.sistema].color }} />
                      <span>{e.nombre}</span>
                      <small>{nombreZona(e.zona)}</small>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {busqueda.trim().length >= 2 && resultados.length === 0 && <p className={s.vacio}>Sin resultados.</p>}
          </div>
        )}

        {elegida && (
          <section className={s.ficha} aria-live="polite">
            <span className={s.fichaSistema}>
              <i style={{ background: SISTEMA[elegida.sistema].color }} />
              {SISTEMA[elegida.sistema].singular} · {nombreZona(elegida.zona)}
            </span>
            <h2>{elegida.nombre}</h2>
            <p lang="en">{elegida.nombreEn}</p>
            <FichaDetalle ficha={fichas?.[elegida.nombreEn]} />
            <div className={s.acciones}>
              {repaso ? null : aislado === elegida.clave ? (
                <button type="button" className={s.boton} onClick={() => { setAislado(null); encuadrar(); }}>
                  Mostrar todo
                </button>
              ) : (
                <button type="button" className={s.boton} onClick={() => { setAislado(elegida.clave); encuadrar(); }}>
                  Aislar
                </button>
              )}
              {!repaso && (
                <button type="button" className={s.botonSec} onClick={ocultarSeleccion}>
                  Ocultar
                </button>
              )}
              <button type="button" className={s.botonSec} onClick={() => setSeleccion(null)}>
                Cerrar
              </button>
            </div>
          </section>
        )}

        {!repaso && repasos.length > 0 && (
          <section className={s.seccion}>
            <h3>Repasar</h3>
            <div className={s.repasos}>
              {repasos.map((r) => (
                <button key={r.id} type="button" className={s.repasoBoton} onClick={() => empezarRepaso(r.id)}>
                  <span>{r.nombre}</span>
                  <small>{r.pasos.length} pasos · prueba</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {!repaso && (
          <>
            <section className={s.seccion}>
              <h3>Sistemas</h3>
              <div className={s.sistemas}>
                {sistemasPresentes.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    className={sistemas.has(x.id) ? s.sistemaOn : s.sistema}
                    aria-pressed={sistemas.has(x.id)}
                    onClick={() => alternarSistema(x.id)}
                  >
                    <i style={{ background: x.color }} />
                    {x.nombre}
                    <small>{cuenta[x.id]}</small>
                  </button>
                ))}
              </div>
              {!sistemasPresentes.some((x) => x.id === 'nervio') && (
                <p className={s.nota}>Este modelo aún no incluye los nervios.</p>
              )}
            </section>
    
            <section className={s.seccion}>
              <h3>Zona</h3>
              <div className={s.zonas} role="group" aria-label="Zona">
                {[{ id: 'todo', nombre: 'Todo' }, ...zonas].map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    className={zona === z.id ? s.zonaActiva : s.zona}
                    aria-pressed={zona === z.id}
                    onClick={() => {
                      setZona(z.id);
                      setAislado(null);
                      encuadrar();
                    }}
                  >
                    {z.nombre}
                  </button>
                ))}
              </div>
            </section>
    
            <section className={s.seccion}>
              <h3>Translúcido</h3>
              <div className={s.zonas} role="group" aria-label="Translúcido">
                {TRANSPARENCIAS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={transparencia === t.id ? s.zonaActiva : s.zona}
                    aria-pressed={transparencia === t.id}
                    onClick={() => setTransparencia(t.id)}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>
              {ocultas.size > 0 && (
                <button type="button" className={s.botonSec} onClick={mostrarOcultas}>
                  Mostrar ocultas ({new Set([...ocultas].map((id) => estructuraDe.get(id)?.clave)).size})
                </button>
              )}
            </section>
          </>
        )}

        <footer className={s.credito}>
          Modelo: <a href={CREDITO.url} target="_blank" rel="noopener noreferrer">{CREDITO.texto}</a>. {CREDITO.adaptacion}
        </footer>
      </aside>
    </div>
  );
}

