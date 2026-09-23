'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import s from '@/styles/mensajesAdmin.module.css';

const MAX_TITULO = 120;
const MAX_CUERPO = 2000;

interface Respuesta { id: string; cuerpo: string; created_at: string; leido_admin_at: string | null }
interface Mensaje {
  id: string;
  user_id: string;
  titulo: string;
  cuerpo: string;
  created_at: string;
  visto_at: string | null;
  cerrado_at: string | null;
  respuestas: Respuesta[];
}

export interface Destinatario { id: string; email: string; nombre: string | null }

const fecha = (iso: string) =>
  new Date(iso).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });

export const IconoMensaje = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4V5.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 9h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * Respuestas sin leer, en vivo: el contador de «Admin» en la barra lateral, para
 * enterarse desde cualquier página del dashboard sin tener la bandeja abierta.
 */
export function useRespuestasNuevas(canal: string | undefined): number | null {
  // null hasta la primera respuesta del servidor: un 0 de arranque no es un dato.
  const [nuevas, setNuevas] = useState<number | null>(null);

  useEffect(() => {
    if (!canal) return;
    const contar = async () => {
      const r = await fetch('/api/admin/mensajes?cuenta=1', { cache: 'no-store' }).catch(() => null);
      if (r?.ok) setNuevas(((await r.json()) as { nuevas: number }).nuevas);
    };
    contar();
    // Única suscripción al canal de la bandeja: dos `channel()` con el mismo
    // nombre en un cliente chocan. La bandeja se entera por este evento.
    const ch = createClient().channel(canal).on('broadcast', { event: 'nuevo' }, () => {
      contar();
      window.dispatchEvent(new Event(EVENTO_BANDEJA));
    }).subscribe();
    return () => { void ch.unsubscribe(); };
  }, [canal]);

  return nuevas;
}

const EVENTO_BANDEJA = 'medgo:bandeja';

const CLAVE_DESCARTE = 'medgo-aviso-respuestas';

/**
 * Aviso flotante para el admin: «Tienes N respuestas nuevas». El contador de la
 * barra lateral puede quedar fuera de vista (la barra hace scroll en pantallas
 * bajas), así que esto es lo que de verdad avisa. Cerrarlo lo calla hasta que
 * llegue otra respuesta más.
 */
export function AvisoRespuestas({ nuevas, ocultar }: { nuevas: number | null; ocultar: boolean }) {
  const [descartadas, setDescartadas] = useState(0);
  const [destino, setDestino] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setDestino(document.body);
    try { setDescartadas(Number(sessionStorage.getItem(CLAVE_DESCARTE)) || 0); } catch { /* sin storage */ }
  }, []);

  // Tras leerlas, el contador baja: el descarte baja con él, o la siguiente
  // respuesta (que vuelve a sumar 1) quedaría callada.
  useEffect(() => {
    if (nuevas === null || nuevas >= descartadas) return;
    setDescartadas(nuevas);
    try { sessionStorage.setItem(CLAVE_DESCARTE, String(nuevas)); } catch { /* sin storage */ }
  }, [nuevas, descartadas]);

  if (!destino || ocultar || nuevas === null || nuevas <= descartadas) return null;

  const cerrar = () => {
    setDescartadas(nuevas);
    try { sessionStorage.setItem(CLAVE_DESCARTE, String(nuevas)); } catch { /* sin storage */ }
  };

  return createPortal(
    <div className={s.aviso} role="status">
      <span className={s.avisoIcono}><IconoMensaje /></span>
      <span className={s.avisoTexto}>
        Tienes <strong>{nuevas}</strong> {nuevas === 1 ? 'respuesta nueva' : 'respuestas nuevas'} en Mensajes
      </span>
      <a href="/dashboard/admin#mensajes" className={s.avisoVer} onClick={cerrar}>Ver</a>
      <button type="button" className={s.avisoCerrar} onClick={cerrar} aria-label="Cerrar aviso">✕</button>
    </div>,
    destino,
  );
}

export function BotonMensaje({ email, onClick }: { email: string; onClick: () => void }) {
  return (
    <button type="button" className={s.boton} onClick={onClick} title={`Enviar un mensaje a ${email}`} aria-label={`Enviar un mensaje a ${email}`}>
      <IconoMensaje />
    </button>
  );
}

/**
 * Ventana para escribir a un alumno, o a todos a la vez con `a="todos"`. Le
 * llega al instante a quien esté conectado. La difusión no se puede deshacer
 * (son N tarjetas ya repartidas), así que pasa por una confirmación aparte.
 */
export function EnviarMensaje({ a, onClose, cuantos }: { a: Destinatario | 'todos'; onClose: () => void; cuantos?: number }) {
  const difusion = a === 'todos';
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [estado, setEstado] = useState<'editando' | 'confirmando' | 'enviando' | 'enviado' | 'error'>('editando');
  const [enviados, setEnviados] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const listo = !!titulo.trim() && !!cuerpo.trim();

  const enviar = async () => {
    if (!listo) return;
    setEstado('enviando');
    const r = await fetch('/api/admin/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(difusion ? { a: 'todos', titulo, cuerpo } : { userId: a.id, titulo, cuerpo }),
    }).catch(() => null);
    if (!r?.ok) { setEstado('error'); return; }
    if (difusion) {
      const d = (await r.json().catch(() => null)) as { enviados?: number } | null;
      setEnviados(d?.enviados ?? 0);
    }
    setEstado('enviado');
  };

  // En difusión el submit no envía: abre la confirmación.
  const alEnviar = () => { if (difusion) setEstado('confirmando'); else void enviar(); };

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div
        className={s.modal}
        role="dialog"
        aria-label={difusion ? 'Mensaje para todos los alumnos' : `Mensaje para ${a.email}`}
        onClick={e => e.stopPropagation()}
      >
        <button type="button" className={s.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        <p className={`${s.kicker} ${difusion ? s.kickerDifusion : ''}`}>
          {difusion ? 'Mensaje para todos' : 'Mensaje para'}
        </p>
        <p className={s.para}>
          {difusion
            ? `Todos los alumnos${cuantos ? ` · ${cuantos}` : ''}`
            : `${a.nombre ? `${a.nombre} · ` : ''}${a.email}`}
        </p>

        {estado === 'enviado' ? (
          <div className={s.hecho}>
            <p className={s.hechoTitulo}>
              {difusion ? `Enviado a ${enviados} ${enviados === 1 ? 'alumno' : 'alumnos'}` : 'Mensaje enviado'}
            </p>
            <p className={s.hechoTexto}>
              {difusion
                ? 'Quien esté conectado lo verá al instante; el resto, la próxima vez que entre. Las respuestas llegarán a la bandeja.'
                : 'Si está conectada lo verá al instante; si no, la próxima vez que entre. Su respuesta llegará a la bandeja.'}
            </p>
            <button type="button" className={s.primario} onClick={onClose}>Listo</button>
          </div>
        ) : estado === 'confirmando' ? (
          <div className={s.confirmar}>
            <p className={s.confirmarAviso}>
              Esto le abrirá la tarjeta a <strong>{cuantos ? `los ${cuantos} alumnos` : 'todos los alumnos'}</strong> de
              golpe. No se puede deshacer ni retirar una vez enviado.
            </p>
            <div className={s.previo}>
              <p className={s.previoTitulo}>{titulo}</p>
              <p className={s.previoCuerpo}>{cuerpo}</p>
            </div>
            <div className={s.acciones}>
              <button type="button" className={s.secundario} onClick={() => setEstado('editando')}>Volver a editar</button>
              <button type="button" className={s.difusion} onClick={() => void enviar()}>Sí, enviar a todos</button>
            </div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); alEnviar(); }}>
            <label className={s.etiqueta}>
              Título
              <input
                className={s.campo}
                value={titulo}
                maxLength={MAX_TITULO}
                onChange={e => setTitulo(e.target.value)}
                autoFocus
              />
            </label>
            <label className={s.etiqueta}>
              Mensaje
              <textarea
                className={`${s.campo} ${s.area}`}
                value={cuerpo}
                maxLength={MAX_CUERPO}
                rows={7}
                onChange={e => setCuerpo(e.target.value)}
              />
              <span className={s.cuenta}>{cuerpo.length}/{MAX_CUERPO}</span>
            </label>
            {estado === 'error' && <p className={s.error}>No se pudo enviar. Inténtalo otra vez.</p>}
            <div className={s.acciones}>
              <button type="button" className={s.secundario} onClick={onClose}>Cancelar</button>
              <button
                type="submit"
                className={difusion ? s.difusion : s.primario}
                disabled={!listo || estado === 'enviando'}
              >
                {estado === 'enviando' ? 'Enviando…' : difusion ? 'Revisar y enviar a todos' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

export const IconoPapelera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6.5h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M6.5 6.5l.8 12.1a1.9 1.9 0 0 0 1.9 1.8h5.6a1.9 1.9 0 0 0 1.9-1.8l.8-12.1" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    <path d="M10.3 10.5v6M13.7 10.5v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IconoDescarga = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3.5v10.5m0 0 4.2-4.2M12 14l-4.2-4.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16.5v2.2A2.3 2.3 0 0 0 6.3 21h11.4a2.3 2.3 0 0 0 2.3-2.3v-2.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

/**
 * Una hoja de cálculo con la bandeja entera, para guardar las respuestas antes
 * de vaciar (una encuesta se tabula en Excel, no en esta lista).
 *
 * Separador `;` y BOM: es lo que Excel en español abre en columnas sin tener
 * que importar nada a mano, y sin el BOM se come las tildes.
 */
const celda = (v: string) => `"${v.replace(/"/g, '""')}"`;

async function descargarBandeja(emails: Map<string, string>): Promise<boolean> {
  // `?todo=1`: la vista se queda en 200 hilos y aquí no se puede exportar de menos.
  const r = await fetch('/api/admin/mensajes?todo=1', { cache: 'no-store' }).catch(() => null);
  if (!r?.ok) return false;
  const { mensajes } = (await r.json()) as { mensajes: Mensaje[] };

  const filas = [['Fecha', 'Alumno', 'Título', 'Mensaje', 'Estado', 'Fecha de la respuesta', 'Respuesta']];
  for (const m of mensajes) {
    const comun = [
      fecha(m.created_at),
      emails.get(m.user_id) ?? m.user_id,
      m.titulo,
      m.cuerpo,
      m.cerrado_at ? 'Cerrado' : m.visto_at ? 'Visto' : 'Sin ver',
    ];
    // Una fila por respuesta; sin respuestas, el hilo igual deja su fila.
    if (m.respuestas.length === 0) filas.push([...comun, '', '']);
    else for (const res of m.respuestas) filas.push([...comun, fecha(res.created_at), res.cuerpo]);
  }

  const csv = filas.map(f => f.map(celda).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `medgo-mensajes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

type ModoVaciado = 'cerrados' | 'todos';

/**
 * Confirmación de borrado. El espacio en Supabase es finito y la bandeja crece
 * sola, así que esto es mantenimiento normal — pero es definitivo, y vaciarlo
 * todo pide una segunda pulsación.
 */
function ModalVaciar(
  { emails, onClose, onHecho }:
  { emails: Map<string, string>; onClose: () => void; onHecho: (borrados: number, modo: ModoVaciado) => void },
) {
  const [seguro, setSeguro] = useState(false);
  const [ocupado, setOcupado] = useState<ModoVaciado | null>(null);
  const [error, setError] = useState(false);
  const [copia, setCopia] = useState<'no' | 'bajando' | 'hecha' | 'error'>('no');

  const descargar = async () => {
    setCopia('bajando');
    setCopia((await descargarBandeja(emails)) ? 'hecha' : 'error');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const borrar = async (modo: ModoVaciado) => {
    setOcupado(modo);
    setError(false);
    const r = await fetch('/api/admin/mensajes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modo }),
    }).catch(() => null);
    if (!r?.ok) { setError(true); setOcupado(null); return; }
    const d = (await r.json().catch(() => null)) as { borrados?: number } | null;
    onHecho(d?.borrados ?? 0, modo);
  };

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} role="dialog" aria-label="Vaciar la bandeja" onClick={e => e.stopPropagation()}>
        <button type="button" className={s.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        <p className={s.kicker}>Vaciar la bandeja</p>
        <p className={s.para}>Libera espacio en la base de datos</p>
        <p className={s.vaciarTexto}>
          Los mensajes borrados se van con sus respuestas y <strong>no se pueden recuperar</strong>.
        </p>

        <div className={`${s.opcion} ${s.opcionCopia}`}>
          <div>
            <p className={s.opcionTitulo}>Guardar una copia primero</p>
            <p className={s.opcionTexto}>
              {copia === 'hecha'
                ? 'Descargada. Ábrela para comprobar que están todas antes de borrar.'
                : copia === 'error'
                  ? 'No se pudo descargar. Inténtalo antes de borrar nada.'
                  : 'Hoja de cálculo con cada mensaje y su respuesta. Útil si esto era una encuesta.'}
            </p>
          </div>
          <button type="button" className={s.secundario} disabled={copia === 'bajando'} onClick={() => void descargar()}>
            <IconoDescarga />
            {copia === 'bajando' ? 'Preparando…' : copia === 'hecha' ? 'Descargar otra vez' : 'Descargar'}
          </button>
        </div>

        <div className={s.opcion}>
          <div>
            <p className={s.opcionTitulo}>Borrar los hilos cerrados</p>
            <p className={s.opcionTexto}>Los que el alumno ya cerró. Lo habitual: deja lo que sigue abierto.</p>
          </div>
          <button type="button" className={s.secundario} disabled={!!ocupado} onClick={() => void borrar('cerrados')}>
            {ocupado === 'cerrados' ? 'Borrando…' : 'Borrar'}
          </button>
        </div>

        <div className={`${s.opcion} ${s.opcionGrave}`}>
          <div>
            <p className={s.opcionTitulo}>Vaciar todo</p>
            <p className={s.opcionTexto}>Todos los mensajes y respuestas, incluidos los que están sin leer.</p>
          </div>
          <button
            type="button"
            className={s.peligro}
            disabled={!!ocupado}
            onClick={() => (seguro ? void borrar('todos') : setSeguro(true))}
          >
            {ocupado === 'todos' ? 'Borrando…' : seguro ? '¿Seguro? Sí, vaciar' : 'Vaciar todo'}
          </button>
        </div>

        {error && <p className={s.error}>No se pudo borrar. Inténtalo otra vez.</p>}
        <div className={s.acciones}>
          <button type="button" className={s.secundario} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Lo enviado y lo que respondieron. Se refresca solo: el servidor avisa por el
 * canal de la bandeja, que escucha la barra lateral (`useRespuestasNuevas`).
 */
export function BandejaMensajes({ emails }: { emails: Map<string, string> }) {
  const [mensajes, setMensajes] = useState<Mensaje[] | null>(null);
  const [vaciando, setVaciando] = useState(false);
  const [aTodos, setATodos] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [bajando, setBajando] = useState(false);

  const descargar = async () => {
    setBajando(true);
    const ok = await descargarBandeja(emails);
    setBajando(false);
    setAviso(ok ? 'Bandeja descargada.' : 'No se pudo descargar la bandeja.');
  };

  const cargar = useCallback(async () => {
    const r = await fetch('/api/admin/mensajes', { cache: 'no-store' }).catch(() => null);
    if (r?.ok) setMensajes(((await r.json()) as { mensajes: Mensaje[] }).mensajes);
  }, []);

  useEffect(() => {
    cargar();
    window.addEventListener(EVENTO_BANDEJA, cargar);
    return () => window.removeEventListener(EVENTO_BANDEJA, cargar);
  }, [cargar]);

  const nuevas = useMemo(
    () => (mensajes ?? []).reduce((n, m) => n + m.respuestas.filter(r => !r.leido_admin_at).length, 0),
    [mensajes],
  );

  // El desvanecido del borde sólo aparece si de verdad queda algo por ver: con
  // tres hilos la lista no llega al tope y un degradado ahí sería mentira.
  const listaRef = useRef<HTMLUListElement>(null);
  const [queda, setQueda] = useState(false);
  useEffect(() => {
    const el = listaRef.current;
    if (!el) { setQueda(false); return; }
    const medir = () => setQueda(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
    medir();
    el.addEventListener('scroll', medir, { passive: true });
    // Los hilos se despliegan con <details>, que cambia el alto sin re-render.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', medir); ro.disconnect(); };
  }, [mensajes]);

  const marcarLeidas = async () => {
    await fetch('/api/admin/mensajes', { method: 'PATCH' }).catch(() => null);
    cargar();
  };

  const trasVaciar = (borrados: number, modo: ModoVaciado) => {
    setVaciando(false);
    setAviso(
      borrados === 0
        ? modo === 'cerrados' ? 'No había hilos cerrados que borrar.' : 'La bandeja ya estaba vacía.'
        : `Se borraron ${borrados} ${borrados === 1 ? 'mensaje' : 'mensajes'}.`,
    );
    cargar();
  };

  return (
    <section id="mensajes" className={s.bandeja}>
      <div className={s.bandejaHead}>
        <div>
          <h2 className={s.bandejaTitulo}>
            Mensajes
            {nuevas > 0 && <span className={s.badge}>{nuevas} {nuevas === 1 ? 'respuesta nueva' : 'respuestas nuevas'}</span>}
          </h2>
          <p className={s.bandejaSub}>
            Lo que enviaste con el ícono junto a cada correo y lo que te respondieron. Se actualiza solo.
          </p>
        </div>
        <div className={s.bandejaBotones}>
          {nuevas > 0 && (
            <button type="button" className={s.secundario} onClick={marcarLeidas}>Marcar como leídas</button>
          )}
          <button type="button" className={s.secundario} onClick={() => setATodos(true)}>Escribir a todos</button>
          {!!mensajes?.length && (
            <>
              <button
                type="button"
                className={s.iconoBoton}
                onClick={() => void descargar()}
                disabled={bajando}
                title="Descargar la bandeja en una hoja de cálculo"
                aria-label="Descargar la bandeja en una hoja de cálculo"
              >
                <IconoDescarga />
              </button>
              <button
                type="button"
                className={`${s.iconoBoton} ${s.iconoPeligro}`}
                onClick={() => { setAviso(null); setVaciando(true); }}
                title="Vaciar la bandeja"
                aria-label="Vaciar la bandeja"
              >
                <IconoPapelera />
              </button>
            </>
          )}
        </div>
      </div>

      {aviso && <p className={s.hechoAviso} role="status">{aviso}</p>}

      {mensajes === null ? (
        <p className={s.vacio}>Cargando…</p>
      ) : mensajes.length === 0 ? (
        <p className={s.vacio}>Aún no enviaste mensajes.</p>
      ) : (
        <div className={`${s.hilosCaja} ${queda ? s.hayMas : ''}`}>
          <ul className={s.hilos} ref={listaRef}>
            {mensajes.map(m => {
              const estado = m.cerrado_at ? 'Cerrado' : m.visto_at ? 'Visto' : 'Sin ver';
              return (
                <li key={m.id} className={s.hilo}>
                  <div className={s.hiloHead}>
                    <span className={s.hiloPara}>{emails.get(m.user_id) ?? m.user_id}</span>
                    <span className={`${s.estado} ${m.visto_at ? s.estadoVisto : ''}`}>{estado}</span>
                    <span className={s.hiloFecha}>{fecha(m.created_at)}</span>
                  </div>
                  {/* Plegado: el título basta para ubicar el hilo; el texto se abre al pulsarlo. */}
                  <details className={s.desplegable}>
                    <summary className={s.hiloTitulo}>
                      <span className={s.flecha} aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {m.titulo}
                    </summary>
                    <p className={s.hiloCuerpo}>{m.cuerpo}</p>
                  </details>
                  {m.respuestas.length === 0 ? (
                    <p className={s.sinRespuesta}>Sin respuesta todavía.</p>
                  ) : (
                    m.respuestas.map(r => (
                      <div key={r.id} className={`${s.respuesta} ${!r.leido_admin_at ? s.respuestaNueva : ''}`}>
                        <span className={s.respuestaMeta}>
                          Respondió · {fecha(r.created_at)}{!r.leido_admin_at && ' · nueva'}
                        </span>
                        <p className={s.respuestaTexto}>{r.cuerpo}</p>
                      </div>
                    ))
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {vaciando && <ModalVaciar emails={emails} onClose={() => setVaciando(false)} onHecho={trasVaciar} />}
      {aTodos && <EnviarMensaje a="todos" cuantos={emails.size} onClose={() => setATodos(false)} />}
    </section>
  );
}
