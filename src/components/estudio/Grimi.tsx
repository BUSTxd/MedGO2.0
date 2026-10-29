'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Mascota, { type OrdenMascota } from '@/components/landing-nueva/Mascota';
import { ASISTENTE } from '@/components/landing-nueva/datos';
import type { ChatIA, AccionIA } from '@/components/ia/useChatIA';
import s from '@/styles/estudio/grimi.module.css';

/**
 * GRIMI, la mascota de la landing, abajo a la derecha de la interfaz de estudio: la cara
 * de MedGO IA. Es la misma `Mascota` en modo cursor, con ratos libres (de vez en cuando
 * hace lo suyo en vez de seguir al puntero).
 *
 * Su globo tiene dos vistas:
 *  - saludo: al pulsarlo saluda un rato a su aire y el texto sale letra a letra, con
 *    pausas en las comas y los puntos, como si lo dijera (asiente y late mientras habla);
 *  - respuesta: con `chat` (lo provee `GrimiIA`; hoy sólo el admin), lo que se le pidió
 *    desde el lector. Mientras piensa mira hacia arriba; la respuesta llega a trozos y la
 *    va «diciendo»; al acabar se alegra.
 * El globo entra y sale con animación.
 */

const SALUDO = `¡Hola! Soy ${ASISTENTE}, la IA de MedGO.`;
const EN_CAMINO = 'Todavía estoy aprendiendo. Muy pronto te explicaré tus resúmenes, sus figuras y cada mecanismo, y te ayudaré a armar tu ruta de estudio.';
const COMO_USARME = 'Subraya cualquier frase de tu resumen y elige «¿Qué significa?», «Explícame» o «A fondo»: yo te lo explico. En una figura ampliada, «Explícame esta figura».';

/** Lo que tarda en «decir» cada letra: una pausa tras la coma y otra más larga tras el punto. */
const pausaTras = (letra: string) => (letra === ',' ? 150 : '.!?:'.includes(letra) ? 340 : letra === '\n' ? 260 : 24);

const ACCION: Partial<Record<AccionIA, string>> = {
  definir: 'Definición', explicar: 'Explicación', profundizar: 'A fondo', figura: 'Figura', resumir: 'Resumen',
};

type Fase = 'cerrado' | 'abierto' | 'saliendo';

export default function Grimi({ subir = false, sobreBarra = false, chat = null, llamada = 0, voz = false }: {
  /** El aviso de respuestas del admin ocupa la esquina: GRIMI sube encima. */
  subir?: boolean;
  /** Exámenes en el teléfono: hay una barra fija abajo. */
  sobreBarra?: boolean;
  /** La conversación con la IA; `null` = sin IA (sólo saluda). */
  chat?: ChatIA | null;
  /** Cada pedido nuevo desde el lector la sube: GRIMI abre su globo con la respuesta. */
  llamada?: number;
  /** Suena una voz grabada (narración de un laboratorio): pone cara de hablar. */
  voz?: boolean;
}) {
  const [fase, setFase] = useState<Fase>('cerrado');
  const [vista, setVista] = useState<'saludo' | 'respuesta'>('saludo');
  const [letras, setLetras] = useState(0);
  const [orden, setOrden] = useState<OrdenMascota>({ n: 0, tipo: 'saludo' });
  const caja = useRef<HTMLDivElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ordenar = (tipo: OrdenMascota['tipo']) => setOrden((o) => ({ n: o.n + 1, tipo }));

  // Con IA, cómo usarlo; sin ella, que viene en camino.
  const texto = `${SALUDO}\n${chat ? COMO_USARME : EN_CAMINO}`;
  const mensajes = chat?.mensajes ?? [];
  const respuesta = mensajes.at(-1)?.rol === 'assistant' ? mensajes.at(-1) : undefined;
  const pregunta = respuesta ? mensajes.at(-2) : undefined;

  const cerrar = useCallback(() => {
    ordenar('adios');
    setFase(reducido() ? 'cerrado' : 'saliendo');
  }, []);
  const abrir = () => {
    if (respuesta) { setVista('respuesta'); ordenar('listo'); }
    else { setVista('saludo'); ordenar('saludo'); setLetras(reducido() ? texto.length : 0); }
    setFase('abierto');
  };

  // Un pedido desde el lector: abre en la respuesta y se pone a pensar.
  useEffect(() => {
    if (!llamada) return;
    setVista('respuesta');
    setFase('abierto');
    ordenar('pensar');
  }, [llamada]);

  // Terminó de responder: se alegra.
  const enCurso = !!chat?.enCurso;
  const antes = useRef(enCurso);
  useEffect(() => {
    if (antes.current && !enCurso && respuesta?.estado === 'listo') ordenar('listo');
    antes.current = enCurso;
  }, [enCurso, respuesta?.estado]);

  // El saludo sale letra a letra, como si lo dijera.
  useEffect(() => {
    if (fase !== 'abierto' || vista !== 'saludo' || letras >= texto.length) return;
    const t = window.setTimeout(() => setLetras((n) => n + 1), letras ? pausaTras(texto[letras - 1]) : 380);
    return () => clearTimeout(t);
  }, [fase, vista, letras, texto]);

  // La respuesta sigue bajando mientras llega, salvo que se haya subido a releer.
  const largo = respuesta?.texto.length ?? 0;
  useEffect(() => {
    const el = cuerpo.current;
    if (!el || !enCurso) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) el.scrollTop = el.scrollHeight;
  }, [largo, enCurso]);

  useEffect(() => {
    if (fase !== 'abierto') return;
    const fuera = (e: PointerEvent) => { if (!caja.current?.contains(e.target as Node)) cerrar(); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [fase, cerrar]);

  const diciendoSaludo = fase === 'abierto' && vista === 'saludo' && letras < texto.length;
  const diciendoRespuesta = enCurso && largo > 0;
  const hablando = diciendoSaludo || diciendoRespuesta || voz;
  // Cada letra re-renderiza el globo: la mascota sólo cuando cambia lo que se le pide.
  const mascota = useMemo(
    // Con la voz de un laboratorio mira al frente y solo habla: nada de vueltas ni de seguir al puntero.
    () => <Mascota pausado={false} cls={s.mascota} detalle={1} ratos orden={orden} hablando={hablando} alFrente={voz} />,
    [orden, hablando, voz],
  );

  // Lo ya dicho en tinta y el resto invisible: el globo tiene su tamaño final desde el principio.
  const parte = (desde: number, t: string) => {
    const dichas = Math.max(0, Math.min(t.length, letras - desde));
    return (<>{t.slice(0, dichas)}<span className={s.porDecir}>{t.slice(dichas)}</span></>);
  };
  const [saludoTxt, restoTxt] = texto.split('\n');
  const origen = respuesta?.origen;
  const costo = respuesta?.estado === 'listo' && respuesta.cobrado !== undefined
    ? (respuesta.guardada ? 'Ya estaba respondida: gratis' : `≈ US$ ${(respuesta.cobrado / 100_000).toFixed(4)}`)
    : null;

  return (
    <div ref={caja} className={`${s.caja} ${subir ? s.subir : ''} ${sobreBarra ? s.sobreBarra : ''}`}>
      {fase !== 'cerrado' && (
        <div
          className={`${s.globo} ${vista === 'respuesta' ? s.globoAncho : ''} ${fase === 'saliendo' ? s.globoSale : ''}`}
          onAnimationEnd={(e) => { if (e.target === e.currentTarget && fase === 'saliendo') setFase('cerrado'); }}
        >
          <div className={s.cabecera}>
            <span className={s.nombre}>{ASISTENTE}</span>
            <span className={s.chip}>
              {vista === 'respuesta' && origen ? ACCION[origen.accion] ?? 'IA' : chat ? 'IA de MedGO' : 'IA · en camino'}
            </span>
            <button type="button" className={s.cerrar} onClick={cerrar} aria-label="Cerrar">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>

          {vista === 'saludo' || !respuesta ? (
            <>
              <div aria-hidden="true">
                <p className={s.saludo}>{parte(0, saludoTxt)}</p>
                <p className={s.mensaje}>{parte(saludoTxt.length + 1, restoTxt)}</p>
              </div>
              <p className={s.soloLector} role="status">{fase === 'abierto' ? `${saludoTxt} ${restoTxt}` : ''}</p>
            </>
          ) : (
            <>
              {pregunta && origen?.seleccion && <blockquote className={s.cita}>{origen.seleccion}</blockquote>}
              {pregunta && !origen?.seleccion && <p className={s.cita}>{pregunta.texto}</p>}
              <div ref={cuerpo} className={s.respuesta} aria-live="polite">
                {respuesta.estado === 'error' ? (
                  <p className={s.error}>{respuesta.texto}</p>
                ) : respuesta.texto ? (
                  <div className={s.md}><ReactMarkdown>{respuesta.texto}</ReactMarkdown></div>
                ) : (
                  <p className={s.pensando}>Pensando<span>.</span><span>.</span><span>.</span></p>
                )}
              </div>
              {respuesta.estado === 'listo' && (
                <div className={s.pie}>
                  {origen?.seleccion && (origen.accion === 'definir' || origen.accion === 'explicar') && (
                    <button
                      type="button"
                      className={s.masFondo}
                      onClick={() => {
                        ordenar('pensar');
                        chat?.pedir({ accion: 'profundizar', seleccion: origen.seleccion, seccion: origen.seccion, claseId: origen.claseId });
                      }}
                      disabled={enCurso}
                    >
                      Más a fondo
                    </button>
                  )}
                  {costo && <span className={s.costo}>{costo}</span>}
                </div>
              )}
            </>
          )}
        </div>
      )}
      <button
        type="button"
        className={s.boton}
        onClick={() => (fase === 'abierto' ? cerrar() : abrir())}
        aria-expanded={fase === 'abierto'}
        aria-label={`${ASISTENTE}, la IA de MedGO`}
      >
        {mascota}
      </button>
    </div>
  );
}
