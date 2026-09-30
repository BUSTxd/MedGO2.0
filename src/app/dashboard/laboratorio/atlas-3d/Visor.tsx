'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { CREDITO, SISTEMA, SISTEMAS, regionPorId, type Sistema } from '@/lib/data/atlas-3d/regiones';
import { cargarAtlas, type Atlas } from '@/lib/atlas-3d/cargar';
import Escena, { type PeticionCamara, type Transparencia, type Vista } from './Escena';
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

/** Estructura = piezas con el mismo nombre y lado (p. ej. las dos mallas del flexor superficial). */
interface Estructura {
  clave: string;
  nombre: string;
  nombreEn: string;
  sistema: Sistema;
  zona: string;
  ids: string[];
}

export default function Visor({ regiones }: { regiones: string[] }) {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

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
  return <Explorador atlas={atlas} regiones={regiones} />;
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
  const [sistemas, setSistemas] = useState<Set<Sistema>>(() => new Set(sistemasPresentes.map((x) => x.id)));
  const [zona, setZona] = useState<string>('todo');
  const [ocultas, setOcultas] = useState<Set<string>>(() => new Set());
  const [aislado, setAislado] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [transparencia, setTransparencia] = useState<Transparencia>('ninguna');
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    const v = new Set<string>();
    const aisladas = aislado ? estructuras.get(aislado)?.ids : null;
    for (const p of piezas) {
      if (aisladas) {
        if (aisladas.includes(p.id)) v.add(p.id);
        continue;
      }
      if (!sistemas.has(p.sistema) || ocultas.has(p.id)) continue;
      if (zona !== 'todo' && p.zona !== zona) continue;
      v.add(p.id);
    }
    return v;
  }, [piezas, estructuras, sistemas, ocultas, zona, aislado]);

  const elegida = seleccion ? estructuras.get(seleccion) ?? null : null;
  const idsSeleccion = useMemo(() => new Set(elegida?.ids.filter((id) => visibles.has(id)) ?? []), [elegida, visibles]);

  // ─── Cámara ────────────────────────────────────────────────────────────────
  const [vista, setVista] = useState<Vista>('anterior');
  const [pedido, setPedido] = useState(0);
  const reducido = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const encuadrar = useCallback(() => setPedido((n) => n + 1), []);
  const camara: PeticionCamara = useMemo(() => {
    const min = new Vector3(Infinity, Infinity, Infinity);
    const max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (const p of piezas) {
      if (!visibles.has(p.id)) continue;
      const g = p.geometry;
      if (!g.boundingBox) g.computeBoundingBox();
      min.min(g.boundingBox!.min);
      max.max(g.boundingBox!.max);
    }
    if (!Number.isFinite(min.x)) return { vista, min: atlas.min, max: atlas.max, n: pedido };
    return { vista, min, max, n: pedido };
    // Solo se reencuadra cuando se pide (vista, zona, aislar, botón), no al ocultar una pieza.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista, pedido, zona, aislado, piezas, atlas]);

  // ─── Acciones ──────────────────────────────────────────────────────────────
  const seleccionar = useCallback((id: string | null) => setSeleccion(id ? estructuraDe.get(id)?.clave ?? null : null), [estructuraDe]);
  const aislar = useCallback((id: string) => {
    const clave = estructuraDe.get(id)?.clave ?? null;
    setAislado(clave);
    setSeleccion(clave);
  }, [estructuraDe]);

  /** Desde el buscador: si la estructura no está a la vista, se destapa. */
  const elegirDeLista = (e: Estructura) => {
    setSeleccion(e.clave);
    setBusqueda('');
    if (aislado && aislado !== e.clave) setAislado(null);
    setSistemas((prev) => (prev.has(e.sistema) ? prev : new Set(prev).add(e.sistema)));
    if (zona !== 'todo' && zona !== e.zona) setZona('todo');
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
    if (aislado === elegida.clave) setAislado(null);
    setSeleccion(null);
  };

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
          rotulo={elegida && idsSeleccion.size ? elegida.nombre : null}
          transparencia={transparencia}
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
        {aislado && (
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
        <p className={s.ayuda}>Arrastra para girar · rueda o pellizca para acercar · toca una estructura · doble toque para aislarla</p>
      </div>

      <aside className={s.panel}>
        <header className={s.cabecera}>
          <span className={s.kicker}>Atlas 3D · Aparato Locomotor</span>
          <h1 className={s.titulo}>{titulo}</h1>
          <p className={s.meta}>{estructuras.size} estructuras</p>
        </header>

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

        {elegida && (
          <section className={s.ficha} aria-live="polite">
            <span className={s.fichaSistema}>
              <i style={{ background: SISTEMA[elegida.sistema].color }} />
              {SISTEMA[elegida.sistema].singular} · {nombreZona(elegida.zona)}
            </span>
            <h2>{elegida.nombre}</h2>
            <p lang="en">{elegida.nombreEn}</p>
            <div className={s.acciones}>
              {aislado === elegida.clave ? (
                <button type="button" className={s.boton} onClick={() => { setAislado(null); encuadrar(); }}>
                  Mostrar todo
                </button>
              ) : (
                <button type="button" className={s.boton} onClick={() => { setAislado(elegida.clave); encuadrar(); }}>
                  Aislar
                </button>
              )}
              <button type="button" className={s.botonSec} onClick={ocultarSeleccion}>
                Ocultar
              </button>
              <button type="button" className={s.botonSec} onClick={() => setSeleccion(null)}>
                Cerrar
              </button>
            </div>
          </section>
        )}

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
            <button type="button" className={s.botonSec} onClick={() => setOcultas(new Set())}>
              Mostrar ocultas ({new Set([...ocultas].map((id) => estructuraDe.get(id)?.clave)).size})
            </button>
          )}
        </section>

        <footer className={s.credito}>
          Modelo: <a href={CREDITO.url} target="_blank" rel="noopener noreferrer">{CREDITO.texto}</a>. {CREDITO.adaptacion}
        </footer>
      </aside>
    </div>
  );
}

