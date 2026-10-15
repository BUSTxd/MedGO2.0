import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getPlanStateDeContenido } from '@/lib/plans-server';
import { puedeVerResumen } from '@/lib/acceso-resumen';
import { existeResumenHtml } from '@/lib/resumen-html';
import { ACCION, ACCIONES, CONTEXTO, LIMITES, MODELO, type Accion } from '@/lib/ia/config';
import { clienteIA } from '@/lib/ia/cliente';
import { aCreditos, costoUsd, creditosMaximos, tokensDe } from '@/lib/ia/costos';
import { esFiguraDeResumen, figuraParaModelo, tokensDeFigura } from '@/lib/ia/figuras';
import { SISTEMA, bloqueResumen, pedido, rotulo } from '@/lib/ia/prompts';
import {
  accesoIA, conversacionDe, guardarRespuesta, guardarTurno, historial, leerSaldo,
  liquidar, reservar, respuestaGuardada,
} from '@/lib/ia/saldo';
import {
  buscarTramo, documentoDe, normalizar, recortar, tramoDeFigura, tramoPorRuta, urlCanonica,
} from '@/lib/ia/secciones';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * MedGO IA. Orden fijo, de lo barato a lo caro: validar → sesión y plan →
 * key configurada → acceso al resumen y armar el contexto EN EL SERVIDOR →
 * reservar créditos (atómico, en SQL) → llamar al modelo → cobrar lo real.
 *
 * El cliente nunca manda contexto: manda qué resumen, qué subrayó y la
 * pregunta; el servidor comprueba que lo subrayado esté en ese resumen. Así
 * la ruta no sirve como LLM gratis para textos ajenos al material.
 *
 * Respuesta: NDJSON, una línea por evento —
 *   {t:'meta', conversacionId} · {t:'delta', x} · {t:'fin', cobrado, saldo} · {t:'error', motivo}
 */

/** Sube si cambian las instrucciones: las respuestas guardadas con otras dejan de valer. */
const VERSION_PROMPT = 'v1';

interface Cuerpo {
  accion: Accion;
  claseId?: string;
  seleccion?: string;
  seccion?: string;
  figura?: string;
  pregunta?: string;
  conversacionId?: string;
}

function validar(b: unknown): Cuerpo | null {
  if (!b || typeof b !== 'object') return null;
  const o = b as Record<string, unknown>;
  const str = (v: unknown, max: number) => (v === undefined || v === null ? undefined : typeof v === 'string' && v.length <= max ? v : null);
  const accion = o.accion as Accion;
  if (!ACCIONES.includes(accion)) return null;
  const c: Cuerpo = {
    accion,
    claseId: str(o.claseId, 80) ?? undefined,
    seleccion: str(o.seleccion, LIMITES.seleccion) ?? undefined,
    seccion: str(o.seccion, 400) ?? undefined,
    figura: str(o.figura, 600) ?? undefined,
    pregunta: str(o.pregunta, LIMITES.pregunta) ?? undefined,
    conversacionId: str(o.conversacionId, 40) ?? undefined,
  };
  // Un campo de más largo no se recorta: se rechaza (str devuelve null).
  if ([o.claseId, o.seleccion, o.seccion, o.figura, o.pregunta, o.conversacionId]
    .some((v, i) => v != null && [c.claseId, c.seleccion, c.seccion, c.figura, c.pregunta, c.conversacionId][i] === undefined)) return null;
  if ((accion === 'definir' || accion === 'explicar') && !c.seleccion?.trim()) return null;
  if (c.figura) c.figura = urlCanonica(c.figura) ?? undefined;
  if (accion === 'figura' && !c.figura) return null;
  if (accion === 'libre' && !c.pregunta?.trim()) return null;
  if (accion !== 'libre' && !c.claseId) return null;
  if (c.conversacionId && !/^[0-9a-f-]{36}$/.test(c.conversacionId)) return null;
  return c;
}

const error = (motivo: string, status: number) => NextResponse.json({ error: motivo }, { status });

const STATUS_RESERVA: Record<string, number> = {
  saldo: 402, ocupado: 409, ritmo: 429, ritmo_dia: 429, tope_global: 503, invalido: 400, error: 500,
};

export async function POST(req: Request) {
  const cuerpo = validar(await req.json().catch(() => null));
  if (!cuerpo) return error('invalido', 400);

  const supabase = await createClient();
  const acceso = await accesoIA(supabase);
  if (!acceso.ok) return error(acceso.motivo, acceso.status);

  const ia = clienteIA();
  if (!ia) return error('no_configurada', 503);

  const { accion, claseId = null } = cuerpo;

  // ── Contexto ────────────────────────────────────────────────────────────
  let contexto: { titulo: string; ruta: string | null; texto: string } | null = null;
  let imagen: { data: string; ancho: number; alto: number } | null = null;
  let version = '';

  if (claseId) {
    if (!existeResumenHtml(claseId)) return error('resumen', 404);
    if (!puedeVerResumen(await getPlanStateDeContenido(supabase), claseId)) return error('resumen', 403);
    const doc = await documentoDe(claseId);
    if (!doc) return error('resumen', 404);
    version = doc.version;

    if (accion === 'definir' || accion === 'explicar') {
      const tramo = buscarTramo(doc, cuerpo.seleccion!, cuerpo.seccion);
      if (!tramo) return error('seleccion_ajena', 400);
      contexto = { titulo: doc.titulo, ruta: tramo.ruta, texto: recortar(tramo.texto, cuerpo.seleccion) };
    } else if (accion === 'figura') {
      const tramo = esFiguraDeResumen(cuerpo.figura!) ? tramoDeFigura(doc, cuerpo.figura!) : null;
      if (!tramo) return error('figura_ajena', 400);
      contexto = { titulo: doc.titulo, ruta: tramo.ruta, texto: recortar(tramo.texto) };
      try {
        imagen = await figuraParaModelo(cuerpo.figura!);
      } catch (e) {
        console.error('[ia] figura:', e);
        return error('figura', 502);
      }
    } else if (accion === 'resumir') {
      contexto = { titulo: doc.titulo, ruta: null, texto: doc.completo.slice(0, CONTEXTO.maxCharsDocumento) };
    } else {
      const tramo = cuerpo.seccion ? tramoPorRuta(doc, cuerpo.seccion) : null;
      contexto = tramo
        ? { titulo: doc.titulo, ruta: tramo.ruta, texto: recortar(tramo.texto) }
        : { titulo: doc.titulo, ruta: null, texto: doc.completo.slice(0, CONTEXTO.maxCharsLibre) };
    }
  }

  const datos = { seleccion: cuerpo.seleccion, pregunta: cuerpo.pregunta, ruta: contexto?.ruta };
  const textoPedido = pedido(accion, datos);
  const conversacionId = await conversacionDe(acceso.userId, cuerpo.conversacionId ?? null, claseId);
  // Solo el chat libre arrastra historial; las acciones sobre el resumen van solas
  // (más baratas, y así su respuesta sirve igual para el siguiente alumno).
  const previos = accion === 'libre' ? await historial(conversacionId) : [];

  // ── Respuesta ya guardada (se repite entre alumnos) ───────────────────────
  const clave = ACCION[accion].cacheable && claseId
    ? createHash('sha256').update([
        VERSION_PROMPT, MODELO, accion, claseId, version, contexto?.ruta ?? '',
        accion === 'figura' ? cuerpo.figura : normalizar(cuerpo.seleccion ?? ''),
      ].join('|')).digest('base64url')
    : null;
  const guardada = clave ? await respuestaGuardada(clave) : null;

  // ── Reserva ─────────────────────────────────────────────────────────────
  const tokensEntrada =
    tokensDe(SISTEMA.length + (contexto?.texto.length ?? 0) + textoPedido.length +
      previos.reduce((n, m) => n + m.contenido.length, 0)) +
    (imagen ? tokensDeFigura(imagen.ancho, imagen.alto) : 0);
  const maximo = guardada ? Math.max(1, Number(guardada.creditos)) : creditosMaximos(accion, tokensEntrada);

  const reserva = await reservar(acceso.userId, acceso.cuota, maximo, accion, claseId);
  if (!reserva.ok) {
    return NextResponse.json(
      { error: reserva.motivo, plan: reserva.plan, recarga: reserva.recarga },
      { status: STATUS_RESERVA[reserva.motivo] ?? 500 },
    );
  }

  const textoUsuario = rotulo(accion, datos);
  const codificar = new TextEncoder();
  let cerrado = false;

  const cuerpoStream = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      const enviar = (ev: object) => {
        if (cerrado) return;
        try { ctrl.enqueue(codificar.encode(JSON.stringify(ev) + '\n')); } catch { cerrado = true; }
      };
      let liquidado = false;
      let respuesta = '';
      enviar({ t: 'meta', conversacionId, accion });

      try {
        if (guardada) {
          respuesta = guardada.respuesta;
          enviar({ t: 'delta', x: respuesta });
          await liquidar(reserva.reserva, maximo, 0, null);
          liquidado = true;
          await guardarTurno(conversacionId, textoUsuario, respuesta);
          enviar({ t: 'fin', cobrado: maximo, guardada: true, saldo: await leerSaldo(acceso.userId, acceso.cuota) });
          return;
        }

        // Instrucciones fijas → resumen (con caché) → historial → pedido.
        const system: Anthropic.TextBlockParam[] = [{ type: 'text', text: SISTEMA }];
        if (contexto) system.push({ type: 'text', text: bloqueResumen(contexto.titulo, contexto.ruta, contexto.texto) });
        system[system.length - 1].cache_control = { type: 'ephemeral' };

        const contenidoUsuario: Anthropic.ContentBlockParam[] | string = imagen
          ? [
              { type: 'image', source: { type: 'base64', media_type: 'image/webp', data: imagen.data } },
              { type: 'text', text: textoPedido },
            ]
          : textoPedido;

        // Si el alumno cierra el panel se sigue leyendo hasta el final: así se
        // cobra lo que de verdad costó y la respuesta queda guardada.
        const stream = ia.messages.stream({
          model: MODELO,
          max_tokens: ACCION[accion].maxTokens,
          output_config: { effort: ACCION[accion].effort },
          system,
          messages: [
            ...previos.map((m) => ({ role: m.rol, content: m.contenido })),
            { role: 'user' as const, content: contenidoUsuario },
          ],
        });

        for await (const ev of stream) {
          if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
            respuesta += ev.delta.text;
            enviar({ t: 'delta', x: ev.delta.text });
          }
        }
        const final = await stream.finalMessage();
        const costo = costoUsd(final.usage);
        const cobrado = aCreditos(costo);
        await liquidar(reserva.reserva, cobrado, costo, final.usage);
        liquidado = true;

        if (final.stop_reason === 'refusal' || !respuesta.trim()) {
          enviar({ t: 'error', motivo: 'rechazo' });
          return;
        }
        if (final.stop_reason === 'max_tokens') {
          respuesta += '\n\n_(Respuesta recortada por longitud.)_';
          enviar({ t: 'delta', x: '\n\n_(Respuesta recortada por longitud.)_' });
        } else if (clave) {
          await guardarRespuesta(clave, respuesta, cobrado);
        }
        await guardarTurno(conversacionId, textoUsuario, respuesta);
        enviar({ t: 'fin', cobrado, saldo: await leerSaldo(acceso.userId, acceso.cuota) });
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError) {
          console.error('[ia] límite de Anthropic:', e.message);
          enviar({ t: 'error', motivo: 'ocupado_global' });
        } else if (e instanceof Anthropic.APIError) {
          console.error(`[ia] API ${e.status}:`, e.message);
          enviar({ t: 'error', motivo: 'modelo' });
        } else {
          console.error('[ia] error:', e);
          enviar({ t: 'error', motivo: 'modelo' });
        }
      } finally {
        // Un error antes de terminar no se cobra (se devuelve la reserva entera).
        if (!liquidado) await liquidar(reserva.reserva, 0, 0, null);
        if (!cerrado) { try { ctrl.close(); } catch {} }
      }
    },
    cancel() {
      cerrado = true;
    },
  });

  return new Response(cuerpoStream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
