'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export function BotonMensaje({ email, onClick }: { email: string; onClick: () => void }) {
  return (
    <button type="button" className={s.boton} onClick={onClick} title={`Enviar un mensaje a ${email}`} aria-label={`Enviar un mensaje a ${email}`}>
      <IconoMensaje />
    </button>
  );
}

/** Ventana para escribir a un alumno. Le llega al instante si está conectado. */
export function EnviarMensaje({ a, onClose }: { a: Destinatario; onClose: () => void }) {
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'enviado' | 'error'>('editando');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const enviar = async () => {
    if (!titulo.trim() || !cuerpo.trim()) return;
    setEstado('enviando');
    const r = await fetch('/api/admin/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: a.id, titulo, cuerpo }),
    }).catch(() => null);
    setEstado(r?.ok ? 'enviado' : 'error');
  };

  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} role="dialog" aria-label={`Mensaje para ${a.email}`} onClick={e => e.stopPropagation()}>
        <button type="button" className={s.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        <p className={s.kicker}>Mensaje para</p>
        <p className={s.para}>{a.nombre ? `${a.nombre} · ` : ''}{a.email}</p>

        {estado === 'enviado' ? (
          <div className={s.hecho}>
            <p className={s.hechoTitulo}>Mensaje enviado</p>
            <p className={s.hechoTexto}>
              Si está conectada lo verá al instante; si no, la próxima vez que entre. Su respuesta llegará a la bandeja.
            </p>
            <button type="button" className={s.primario} onClick={onClose}>Listo</button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); void enviar(); }}>
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
                className={s.primario}
                disabled={!titulo.trim() || !cuerpo.trim() || estado === 'enviando'}
              >
                {estado === 'enviando' ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Lo enviado y lo que respondieron. Se refresca solo: el servidor avisa por
 * `canal` cada vez que un alumno responde.
 */
export function BandejaMensajes({ canal, emails }: { canal: string; emails: Map<string, string> }) {
  const [mensajes, setMensajes] = useState<Mensaje[] | null>(null);

  const cargar = useCallback(async () => {
    const r = await fetch('/api/admin/mensajes', { cache: 'no-store' }).catch(() => null);
    if (r?.ok) setMensajes(((await r.json()) as { mensajes: Mensaje[] }).mensajes);
  }, []);

  useEffect(() => {
    cargar();
    const ch = createClient().channel(canal).on('broadcast', { event: 'nuevo' }, () => { cargar(); }).subscribe();
    return () => { void ch.unsubscribe(); };
  }, [canal, cargar]);

  const nuevas = useMemo(
    () => (mensajes ?? []).reduce((n, m) => n + m.respuestas.filter(r => !r.leido_admin_at).length, 0),
    [mensajes],
  );

  const marcarLeidas = async () => {
    await fetch('/api/admin/mensajes', { method: 'PATCH' }).catch(() => null);
    cargar();
  };

  return (
    <section className={s.bandeja}>
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
        {nuevas > 0 && (
          <button type="button" className={s.secundario} onClick={marcarLeidas}>Marcar como leídas</button>
        )}
      </div>

      {mensajes === null ? (
        <p className={s.vacio}>Cargando…</p>
      ) : mensajes.length === 0 ? (
        <p className={s.vacio}>Aún no enviaste mensajes.</p>
      ) : (
        <ul className={s.hilos}>
          {mensajes.map(m => {
            const estado = m.cerrado_at ? 'Cerrado' : m.visto_at ? 'Visto' : 'Sin ver';
            return (
              <li key={m.id} className={s.hilo}>
                <div className={s.hiloHead}>
                  <span className={s.hiloPara}>{emails.get(m.user_id) ?? m.user_id}</span>
                  <span className={`${s.estado} ${m.visto_at ? s.estadoVisto : ''}`}>{estado}</span>
                  <span className={s.hiloFecha}>{fecha(m.created_at)}</span>
                </div>
                <p className={s.hiloTitulo}>{m.titulo}</p>
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
      )}
    </section>
  );
}
