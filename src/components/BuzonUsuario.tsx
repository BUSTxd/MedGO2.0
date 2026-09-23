'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import s from '@/styles/buzon.module.css';

interface Respuesta { id: string; cuerpo: string; created_at: string }
interface Mensaje {
  id: string;
  titulo: string;
  cuerpo: string;
  created_at: string;
  visto_at: string | null;
  respuestas: Respuesta[];
}

const MAX = 500;
const ACUSE_MS = 1600;

const post = (body: Record<string, unknown>) =>
  fetch('/api/mensajes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

/**
 * Mensajes del equipo al alumno. Llegan en vivo (el servidor avisa por su canal
 * de Realtime y aquí se piden a /api/mensajes), así que no hace falta recargar
 * ni se pierde lo que el alumno esté haciendo: la tarjeta flota por encima, en
 * `position: fixed`, sin empujar nada de la página.
 */
export default function BuzonUsuario({ token }: { token: string }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [acuse, setAcuse] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destino, setDestino] = useState<HTMLElement | null>(null);
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const vistos = useRef(new Set<string>());
  // Ya contestados en esta sesión: el servidor los cierra al responder, pero si
  // una recarga se cruza con el acuse no deben reaparecer.
  const contestados = useRef(new Set<string>());

  const cargar = useCallback(async () => {
    try {
      const r = await fetch('/api/mensajes', { cache: 'no-store' });
      if (!r.ok) return;
      const { mensajes: m } = (await r.json()) as { mensajes: Mensaje[] };
      setMensajes(m.filter(x => !contestados.current.has(x.id)));
    } catch { /* sin red: se reintenta con el próximo aviso o al volver a cargar */ }
  }, []);

  useEffect(() => { setDestino(document.body); }, []);

  useEffect(() => {
    cargar();
    const canal = createClient()
      .channel(`buzon-${token}`)
      .on('broadcast', { event: 'nuevo' }, () => { cargar(); })
      .subscribe();
    return () => { void canal.unsubscribe(); };
  }, [token, cargar]);

  // El socket se cae con la pestaña en segundo plano o al perder la red, y el
  // aviso de ese rato no vuelve: al reaparecer se vuelve a preguntar.
  useEffect(() => {
    const alVolver = () => { if (document.visibilityState === 'visible') cargar(); };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('online', cargar);
    return () => {
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('online', cargar);
    };
  }, [cargar]);

  // Sin contestar primero y, dentro de cada grupo, el más reciente: un mensaje
  // viejo abierto no puede tapar al que acaba de llegar.
  const cola = useMemo(() => {
    const peso = (m: Mensaje) => (m.respuestas.length > 0 ? 1 : 0);
    return [...mensajes].sort(
      (a, b) => peso(a) - peso(b) || b.created_at.localeCompare(a.created_at),
    );
  }, [mensajes]);

  const actual = cola[0];

  // La primera vez que se muestra, queda registrado para la bandeja del admin.
  useEffect(() => {
    if (!actual || actual.visto_at || vistos.current.has(actual.id)) return;
    vistos.current.add(actual.id);
    void post({ id: actual.id, accion: 'visto' });
  }, [actual]);

  // Al cambiar de mensaje, el borrador del anterior no se arrastra.
  useEffect(() => { setTexto(''); setError(null); }, [actual?.id]);

  // El acuse se retira solo y deja paso al siguiente de la cola.
  useEffect(() => {
    if (!acuse) return;
    const t = setTimeout(() => setAcuse(false), ACUSE_MS);
    return () => clearTimeout(t);
  }, [acuse]);

  // Las teclas escritas aquí no pueden llegar a los atajos de la página de
  // detrás (A–E y Enter contestan el banqueo). Los runners escuchan en
  // `document`/`window`, así que se corta en el propio nodo, antes de subir.
  useEffect(() => {
    const el = tarjetaRef.current;
    if (!el) return;
    const cortar = (e: KeyboardEvent) => e.stopPropagation();
    el.addEventListener('keydown', cortar);
    return () => el.removeEventListener('keydown', cortar);
  }, [actual?.id, acuse]);

  if (!destino || (!actual && !acuse)) return null;

  if (acuse) {
    return createPortal(
      <div ref={tarjetaRef} className={s.tarjeta} role="status">
        <p className={s.kicker}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          Mensaje del equipo MedGO
        </p>
        <p className={s.gracias}>¡Gracias! Tu respuesta ya nos llegó.</p>
      </div>,
      destino,
    );
  }

  const cerrar = () => {
    setMensajes(m => m.filter(x => x.id !== actual.id));
    setTexto('');
    setError(null);
    void post({ id: actual.id, accion: 'cerrar' });
  };

  const enviar = async () => {
    const cuerpo = texto.trim();
    if (!cuerpo || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await post({ id: actual.id, accion: 'responder', cuerpo });
      if (r.status === 429) {
        setError('Espera un momento antes de enviar otra respuesta.');
        return;
      }
      if (!r.ok) throw new Error();
      // El servidor cierra el mensaje al responder: una respuesta por mensaje.
      contestados.current.add(actual.id);
      setMensajes(m => m.filter(x => x.id !== actual.id));
      setTexto('');
      setAcuse(true);
    } catch {
      setError('No se pudo enviar. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const respondido = actual.respuestas.length > 0;
  const cerca = texto.length > MAX * 0.85;

  return createPortal(
    <div ref={tarjetaRef} className={s.tarjeta} role="dialog" aria-labelledby={`buzon-${actual.id}`}>
      <button type="button" className={s.cerrar} onClick={cerrar} aria-label="Cerrar mensaje">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <p className={s.kicker}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        Mensaje del equipo MedGO
        {cola.length > 1 && <span className={s.cola}>1 de {cola.length}</span>}
      </p>
      <h2 id={`buzon-${actual.id}`} className={s.titulo}>{actual.titulo}</h2>
      <p className={s.cuerpo}>{actual.cuerpo}</p>

      {actual.respuestas.map(r => (
        <p key={r.id} className={s.propia}>
          <span className={s.propiaEtiqueta}>Tu respuesta</span>
          {r.cuerpo}
        </p>
      ))}

      {respondido ? (
        <>
          <p className={s.gracias}>¡Gracias! Tu respuesta ya nos llegó.</p>
          <div className={s.acciones}>
            <button type="button" className={s.secundario} onClick={cerrar}>Cerrar</button>
          </div>
        </>
      ) : (
        <form
          className={s.form}
          onSubmit={e => { e.preventDefault(); void enviar(); }}
        >
          <textarea
            className={s.campo}
            value={texto}
            onChange={e => setTexto(e.target.value.slice(0, MAX))}
            placeholder="Escribe aquí tu opinión…"
            rows={3}
            readOnly={enviando}
            aria-label="Tu respuesta"
          />
          <p className={`${s.cuenta} ${cerca ? s.cuentaTope : ''}`}>{texto.length}/{MAX}</p>
          {error && <p className={s.error}>{error}</p>}
          <div className={s.acciones}>
            <button type="button" className={s.secundario} onClick={cerrar}>Ahora no</button>
            <button type="submit" className={s.enviar} disabled={!texto.trim() || enviando}>
              {enviando ? 'Enviando…' : 'Enviar'}
            </button>
          </div>
        </form>
      )}
    </div>,
    destino,
  );
}
