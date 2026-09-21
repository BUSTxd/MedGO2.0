'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import s from '@/styles/buzon.module.css';

interface Respuesta { id: string; cuerpo: string; created_at: string }
interface Mensaje {
  id: string;
  titulo: string;
  cuerpo: string;
  visto_at: string | null;
  respuestas: Respuesta[];
}

const MAX = 2000;

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
  const [error, setError] = useState<string | null>(null);
  const [destino, setDestino] = useState<HTMLElement | null>(null);
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const vistos = useRef(new Set<string>());

  const cargar = useCallback(async () => {
    try {
      const r = await fetch('/api/mensajes', { cache: 'no-store' });
      if (!r.ok) return;
      const { mensajes: m } = (await r.json()) as { mensajes: Mensaje[] };
      setMensajes(m);
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

  const actual = mensajes[0];

  // La primera vez que se muestra, queda registrado para la bandeja del admin.
  useEffect(() => {
    if (!actual || actual.visto_at || vistos.current.has(actual.id)) return;
    vistos.current.add(actual.id);
    void post({ id: actual.id, accion: 'visto' });
  }, [actual]);

  // Las teclas escritas aquí no pueden llegar a los atajos de la página de
  // detrás (A–E y Enter contestan el banqueo). Los runners escuchan en
  // `document`/`window`, así que se corta en el propio nodo, antes de subir.
  useEffect(() => {
    const el = tarjetaRef.current;
    if (!el) return;
    const cortar = (e: KeyboardEvent) => e.stopPropagation();
    el.addEventListener('keydown', cortar);
    return () => el.removeEventListener('keydown', cortar);
  }, [actual?.id]);

  if (!actual || !destino) return null;

  const cerrar = () => {
    setMensajes(m => m.slice(1));
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
      if (!r.ok) throw new Error();
      const { respuesta } = (await r.json()) as { respuesta: Respuesta };
      setMensajes(m => m.map(x => (x.id === actual.id ? { ...x, respuestas: [...x.respuestas, respuesta] } : x)));
      setTexto('');
    } catch {
      setError('No se pudo enviar. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  const respondido = actual.respuestas.length > 0;

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
      </p>
      <h2 id={`buzon-${actual.id}`} className={s.titulo}>{actual.titulo}</h2>
      <p className={s.cuerpo}>{actual.cuerpo}</p>

      {actual.respuestas.map(r => (
        <p key={r.id} className={s.propia}>
          <span className={s.propiaEtiqueta}>Tu respuesta</span>
          {r.cuerpo}
        </p>
      ))}

      {respondido && <p className={s.gracias}>¡Gracias! Tu respuesta ya nos llegó.</p>}

      <form
        className={s.form}
        onSubmit={e => { e.preventDefault(); void enviar(); }}
      >
        <textarea
          className={s.campo}
          value={texto}
          onChange={e => setTexto(e.target.value.slice(0, MAX))}
          placeholder={respondido ? '¿Algo más que quieras contarnos?' : 'Escribe aquí tu opinión…'}
          rows={3}
          aria-label="Tu respuesta"
        />
        {error && <p className={s.error}>{error}</p>}
        <div className={s.acciones}>
          <button type="button" className={s.secundario} onClick={cerrar}>
            {respondido ? 'Cerrar' : 'Ahora no'}
          </button>
          <button type="submit" className={s.enviar} disabled={!texto.trim() || enviando}>
            {enviando ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>,
    destino,
  );
}
