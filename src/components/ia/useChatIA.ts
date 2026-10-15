'use client';
import { useCallback, useRef, useState } from 'react';

/**
 * Estado de una conversación con MedGO IA. Lo usan el panel del dashboard y
 * el del visor de resúmenes (cada uno con su propia conversación).
 *
 * El cliente no manda contexto ni historial: sólo la acción, el resumen, lo
 * subrayado y el id de la conversación. Todo lo demás lo arma el servidor
 * (`api/ia/chat`), que es también quien cobra.
 */

export type AccionIA = 'definir' | 'explicar' | 'profundizar' | 'figura' | 'resumir' | 'libre';

export interface PedidoIA {
  accion: AccionIA;
  seleccion?: string;
  seccion?: string;
  figura?: string;
  pregunta?: string;
}

export interface MensajeIA {
  id: number;
  rol: 'user' | 'assistant';
  texto: string;
  estado?: 'cargando' | 'error' | 'listo';
  cobrado?: number;
  guardada?: boolean;
  /** Miniatura de la figura que se preguntó. */
  figura?: string;
  /** En una respuesta: el pedido que la originó (para ofrecer «Más a fondo»). */
  origen?: PedidoIA;
}

export interface SaldoIA {
  plan: number;
  recarga: number;
  cuota: number;
  renueva: string | null;
}

export interface InfoIA {
  disponible: boolean;
  motivo?: string;
  configurada?: boolean;
  saldo?: SaldoIA;
  precios?: Record<AccionIA, number>;
}

/** Lo que ve el alumno para cada motivo que devuelve el servidor. */
export const MENSAJE_ERROR: Record<string, string> = {
  sesion: 'Inicia sesión para usar MedGO IA.',
  proximamente: 'MedGO IA está en desarrollo. ¡Muy pronto!',
  plan: 'MedGO IA es parte de los planes de pago.',
  no_configurada: 'La IA todavía no está configurada en el servidor.',
  saldo: 'No te quedan créditos suficientes para esta consulta.',
  ocupado: 'Espera a que termine la respuesta anterior.',
  ritmo: 'Vas muy rápido: espera un minuto y vuelve a intentarlo.',
  ritmo_dia: 'Llegaste al límite de consultas de hoy. Mañana se reinicia.',
  tope_global: 'MedGO IA está en pausa por hoy. Vuelve mañana.',
  ocupado_global: 'MedGO IA está muy solicitada ahora. Inténtalo en un momento; no se te cobró.',
  seleccion_ajena: 'Ese texto no está en este resumen.',
  figura_ajena: 'Esa figura no es de este resumen.',
  figura: 'No se pudo leer la figura. Inténtalo de nuevo.',
  resumen: 'No tienes acceso a este resumen.',
  invalido: 'La consulta no es válida (¿demasiado larga?).',
  rechazo: 'No puedo responder a eso. Prueba a preguntarlo de otra forma.',
  modelo: 'La IA no respondió. Inténtalo de nuevo; no se te cobró.',
  red: 'Se cortó la conexión. Inténtalo de nuevo.',
};

const mensajeDe = (motivo?: string) => MENSAJE_ERROR[motivo ?? ''] ?? 'Algo salió mal. Inténtalo de nuevo.';

function rotulo(p: PedidoIA): string {
  switch (p.accion) {
    case 'definir': return `¿Qué significa «${p.seleccion?.trim()}»?`;
    case 'explicar': return `Explícame: «${p.seleccion?.trim()}»`;
    case 'profundizar': return `A fondo: «${p.seleccion?.trim()}»`;
    case 'figura': return 'Explícame esta figura';
    case 'resumir': return 'Resume todo el resumen';
    case 'libre': return p.pregunta?.trim() ?? '';
  }
}

let siguienteId = 1;

export function useChatIA(claseId: string | null) {
  const [mensajes, setMensajes] = useState<MensajeIA[]>([]);
  const [info, setInfo] = useState<InfoIA | null>(null);
  const [enCurso, setEnCurso] = useState(false);
  const enCursoRef = useRef(false);
  const conversacion = useRef<string | null>(null);

  const cargarInfo = useCallback(async () => {
    try {
      const r = await fetch('/api/ia/saldo', { cache: 'no-store' });
      setInfo(await r.json());
    } catch {
      setInfo({ disponible: false, motivo: 'red' });
    }
  }, []);

  const actualizar = (id: number, cambio: (m: MensajeIA) => MensajeIA) =>
    setMensajes((ms) => ms.map((m) => (m.id === id ? cambio(m) : m)));

  const pedir = useCallback(async (p: PedidoIA) => {
    if (enCursoRef.current) return;
    enCursoRef.current = true;
    setEnCurso(true);

    const idRespuesta = siguienteId + 1;
    siguienteId += 2;
    setMensajes((ms) => [
      ...ms,
      { id: idRespuesta - 1, rol: 'user', texto: rotulo(p), figura: p.figura },
      { id: idRespuesta, rol: 'assistant', texto: '', estado: 'cargando', origen: p },
    ]);
    const fallar = (motivo?: string) =>
      actualizar(idRespuesta, (m) => ({ ...m, estado: 'error', texto: mensajeDe(motivo) }));

    try {
      const r = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...p,
          claseId: claseId ?? undefined,
          conversacionId: conversacion.current ?? undefined,
        }),
      });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}));
        fallar(j.error);
        if (j.error === 'saldo' && typeof j.plan === 'number') {
          setInfo((i) => (i?.saldo ? { ...i, saldo: { ...i.saldo, plan: j.plan, recarga: j.recarga ?? 0 } } : i));
        }
        return;
      }

      const lector = r.body.getReader();
      const decod = new TextDecoder();
      let resto = '';
      let terminado = false;
      for (;;) {
        const { value, done } = await lector.read();
        if (done) break;
        resto += decod.decode(value, { stream: true });
        const lineas = resto.split('\n');
        resto = lineas.pop() ?? '';
        for (const linea of lineas) {
          if (!linea.trim()) continue;
          const ev = JSON.parse(linea);
          if (ev.t === 'meta') conversacion.current = ev.conversacionId;
          else if (ev.t === 'delta') actualizar(idRespuesta, (m) => ({ ...m, texto: m.texto + ev.x }));
          else if (ev.t === 'fin') {
            terminado = true;
            actualizar(idRespuesta, (m) => ({ ...m, estado: 'listo', cobrado: ev.cobrado, guardada: ev.guardada }));
            if (ev.saldo) setInfo((i) => (i ? { ...i, saldo: ev.saldo } : i));
          } else if (ev.t === 'error') {
            terminado = true;
            fallar(ev.motivo);
          }
        }
      }
      if (!terminado) fallar('red');
    } catch {
      fallar('red');
    } finally {
      enCursoRef.current = false;
      setEnCurso(false);
    }
  }, [claseId]);

  const nueva = useCallback(() => {
    if (enCursoRef.current) return;
    conversacion.current = null;
    setMensajes([]);
  }, []);

  return { mensajes, info, enCurso, cargarInfo, pedir, nueva };
}

export type ChatIA = ReturnType<typeof useChatIA>;
