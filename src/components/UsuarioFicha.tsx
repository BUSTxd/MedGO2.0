'use client';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ActividadUsuario, Etiqueta, EventoLegible } from '@/lib/actividad-usuario';
import styles from '@/styles/usuarioFicha.module.css';

type Filtro = 'todo' | 'material' | 'banqueos' | 'bloqueos' | 'paginas';

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todo', label: 'Todo' },
  { key: 'material', label: 'Clases y material' },
  { key: 'banqueos', label: 'Banqueos' },
  { key: 'bloqueos', label: 'Bloqueos' },
  { key: 'paginas', label: 'Páginas' },
];

const TZ = 'America/Lima';

function diaLima(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });
}

function tituloDia(dia: string): string {
  const hoy = diaLima(new Date().toISOString());
  const ayer = diaLima(new Date(Date.now() - 86_400_000).toISOString());
  if (dia === hoy) return 'Hoy';
  if (dia === ayer) return 'Ayer';
  return new Date(`${dia}T12:00:00`).toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function hora(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-PE', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
}

function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', { timeZone: TZ, day: 'numeric', month: 'short' });
}

function hace(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ayer' : `hace ${d} días`;
}

const VENTANA_MS = 10_000;

function tiemposPorRuta(eventos: EventoLegible[], cumple: (e: EventoLegible) => boolean): Map<string, number[]> {
  const m = new Map<string, number[]>();
  for (const e of eventos) {
    if (!e.path || !cumple(e)) continue;
    const t = m.get(e.path) ?? [];
    t.push(new Date(e.fecha).getTime());
    m.set(e.path, t);
  }
  return m;
}

function cerca(m: Map<string, number[]>, e: EventoLegible, t: number): boolean {
  return !!e.path && (m.get(e.path) ?? []).some((x) => Math.abs(x - t) < VENTANA_MS);
}

/**
 * Cada apertura de clase llega junto a su `pagina_vista`, y algunas clases
 * disparan el evento dos veces: sin esto la línea de tiempo sale duplicada.
 * Una clase con candado también «se abre» (se monta detrás del velo): ahí
 * manda el candado.
 */
function sinEcos(eventos: EventoLegible[]): EventoLegible[] {
  const acciones = tiemposPorRuta(eventos, (e) => e.evento !== 'pagina_vista');
  const candados = tiemposPorRuta(eventos, (e) => e.evento === 'contenido_bloqueado');
  const ultimo = new Map<string, number>();
  return eventos.filter((e) => {
    const t = new Date(e.fecha).getTime();
    if (e.evento === 'pagina_vista' && cerca(acciones, e, t)) return false;
    if (e.evento === 'clase_abierta' && cerca(candados, e, t)) return false;
    const key = `${e.evento}|${e.path}|${e.detalle ?? ''}`;
    const prev = ultimo.get(key);
    ultimo.set(key, t);
    return prev === undefined || Math.abs(prev - t) >= VENTANA_MS;
  });
}

function pasaFiltro(e: EventoLegible, f: Filtro): boolean {
  if (f === 'todo') return true;
  if (f === 'paginas') return e.evento === 'pagina_vista';
  if (f === 'banqueos') return e.evento === 'banco_iniciado' || e.evento === 'examen_completado';
  if (f === 'bloqueos') return e.evento === 'contenido_bloqueado' || e.evento === 'pago_abierto';
  return e.evento === 'clase_abierta' || e.evento === 'resumen_abierto' || e.evento === 'simulacion_abierta';
}

const ETIQUETA: Record<Etiqueta, { texto: string; clase: string }> = {
  gratis: { texto: 'Gratis', clase: styles.tagGratis },
  muestra: { texto: 'Muestra', clase: styles.tagMuestra },
  bloqueado: { texto: 'Sin acceso', clase: styles.tagBloqueado },
};

function claseEvento(evento: string): string {
  if (evento === 'contenido_bloqueado') return styles.dotBloqueo;
  if (evento === 'pago_abierto') return styles.dotPago;
  if (evento === 'examen_completado') return styles.dotExamen;
  if (evento === 'banco_iniciado') return styles.dotBanqueo;
  if (evento === 'pagina_vista') return styles.dotPagina;
  return styles.dotMaterial;
}

export default function UsuarioFicha({
  userId,
  email,
  nombre,
  onClose,
}: {
  userId: string;
  email: string;
  nombre: string | null;
  onClose: () => void;
}) {
  const [datos, setDatos] = useState<ActividadUsuario | null>(null);
  const [error, setError] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>('todo');

  useEffect(() => {
    let vivo = true;
    setDatos(null);
    setError(false);
    fetch(`/api/admin/actividad?user=${userId}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: ActividadUsuario) => { if (vivo) setDatos(d); })
      .catch(() => { if (vivo) setError(true); });
    return () => { vivo = false; };
  }, [userId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const eventos = useMemo(() => (datos ? sinEcos(datos.eventos) : []), [datos]);
  const visibles = useMemo(() => eventos.filter((e) => pasaFiltro(e, filtro)), [eventos, filtro]);
  const porDia = useMemo(() => {
    const grupos: { dia: string; items: EventoLegible[] }[] = [];
    for (const e of visibles) {
      const d = diaLima(e.fecha);
      const g = grupos[grupos.length - 1];
      if (g && g.dia === d) g.items.push(e);
      else grupos.push({ dia: d, items: [e] });
    }
    return grupos;
  }, [visibles]);

  const ultimo = eventos[0];
  const objetivo = datos?.cursos[0];
  const maxDias = Math.max(1, ...(datos?.cursos.map((c) => c.dias) ?? []));

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`Actividad de ${email}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.head}>
          <div className={styles.headText}>
            <h2 className={styles.nombre}>{nombre || email}</h2>
            {nombre && <p className={styles.email}>{email}</p>}
          </div>
          <a className={styles.descargar} href={`/api/admin/actividad?user=${userId}&formato=csv`} download>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7.59l2.3-2.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zM4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            CSV
          </a>
          <button type="button" className={styles.cerrar} onClick={onClose} aria-label="Cerrar">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.3 4.3a1 1 0 011.4 0L10 8.6l4.3-4.3a1 1 0 111.4 1.4L11.4 10l4.3 4.3a1 1 0 01-1.4 1.4L10 11.4l-4.3 4.3a1 1 0 01-1.4-1.4L8.6 10 4.3 5.7a1 1 0 010-1.4z" clipRule="evenodd" />
            </svg>
          </button>
        </header>

        {error && <p className={styles.estado}>No se pudo cargar la actividad.</p>}
        {!error && !datos && <p className={styles.estado}>Cargando actividad…</p>}

        {datos && (
          <div className={styles.body}>
            <dl className={styles.stats}>
              <div className={styles.stat}>
                <dt>Curso objetivo</dt>
                <dd>{objetivo ? objetivo.nombre : '—'}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Última actividad</dt>
                <dd>{ultimo ? hace(ultimo.fecha) : '—'}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Días activos</dt>
                <dd>{datos.diasActivos}</dd>
              </div>
              <div className={styles.stat}>
                <dt>Registros</dt>
                <dd>{datos.totalEventos}</dd>
              </div>
            </dl>

            {ultimo && (
              <p className={styles.ultimo}>
                Lo último: <strong>{ultimo.accion.toLowerCase()}</strong> {ultimo.lugar}
              </p>
            )}

            {datos.bloqueos.length > 0 && (
              <section className={styles.bloque}>
                <h3 className={styles.bloqueTitulo}>Quiso entrar sin plan</h3>
                <ul className={styles.bloqueos}>
                  {datos.bloqueos.map((b) => (
                    <li key={b.lugar} className={styles.bloqueoItem}>
                      <span className={styles.bloqueoLugar}>{b.lugar}</span>
                      <span className={styles.bloqueoNum}>
                        {b.veces} {b.veces === 1 ? 'vez' : 'veces'} · {fechaCorta(b.ultimo)}
                        {b.abrioPago && <span className={styles.bloqueoPago}>abrió el pago</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {datos.cursos.length > 0 && (
              <section className={styles.bloque}>
                <h3 className={styles.bloqueTitulo}>Cursos en los que estuvo</h3>
                <ol className={styles.cursos}>
                  {datos.cursos.map((c) => (
                    <li key={c.slug} className={styles.curso}>
                      <span className={styles.cursoNombre}>{c.nombre}</span>
                      <span className={styles.barra}>
                        <span style={{ width: `${(c.dias / maxDias) * 100}%` }} />
                      </span>
                      <span className={styles.cursoNum}>
                        {c.dias} {c.dias === 1 ? 'día' : 'días'} · {fechaCorta(c.ultimo)}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className={styles.bloque}>
              <div className={styles.timelineHead}>
                <h3 className={styles.bloqueTitulo}>Actividad</h3>
                <div className={styles.filtros}>
                  {FILTROS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFiltro(f.key)}
                      className={`${styles.filtro} ${filtro === f.key ? styles.filtroActivo : ''}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {porDia.length === 0 ? (
                <p className={styles.estado}>Sin registros.</p>
              ) : (
                porDia.map((g) => (
                  <div key={g.dia} className={styles.dia}>
                    <p className={styles.diaTitulo}>{tituloDia(g.dia)}</p>
                    <ul className={styles.eventos}>
                      {g.items.map((e, i) => (
                        <li key={`${e.fecha}-${i}`} className={styles.evento}>
                          <span className={styles.hora}>{hora(e.fecha)}</span>
                          <span className={`${styles.dot} ${claseEvento(e.evento)}`} />
                          <span className={styles.eventoTexto}>
                            <span className={styles.accion}>{e.accion}</span>{' '}
                            <span className={styles.lugar}>{e.lugar}</span>
                            {e.etiqueta && (
                              <span className={`${styles.tag} ${ETIQUETA[e.etiqueta].clase}`}>
                                {ETIQUETA[e.etiqueta].texto}
                              </span>
                            )}
                            {e.detalle && <span className={styles.detalle}>{e.detalle}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              {datos.truncado && (
                <p className={styles.nota}>Se muestran los 500 registros más recientes; el CSV trae todo.</p>
              )}
            </section>
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}
