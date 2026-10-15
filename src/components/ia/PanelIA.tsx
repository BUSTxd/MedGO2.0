'use client';
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import ReactMarkdown from 'react-markdown';
import { MENSAJE_ERROR, useChatIA, type PedidoIA } from './useChatIA';
import s from '@/styles/panelIA.module.css';

export interface ApiPanelIA {
  pedir: (p: PedidoIA) => void;
}

const fmt = (n: number) => n.toLocaleString('es-PE');

export const IconoIA = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9L12 3.5z" fill="currentColor" />
    <path d="M18.5 14.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8.8-1.9zM5.5 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4z" fill="currentColor" opacity=".65" />
  </svg>
);

const SUGERENCIAS = [
  '¿Cuál es la diferencia entre inmunidad innata y adaptativa?',
  'Explícame la cascada de la coagulación paso a paso',
  '¿Cómo se regula la filtración glomerular?',
];

/**
 * Panel de MedGO IA. Dos envases:
 *  - `flotante`: barra lateral derecha del dashboard (sigue el tema).
 *  - `embebido`: columna dentro del visor de resúmenes (oscuro siempre, como
 *    la cáscara del visor). Se queda montado aunque esté oculto para que el
 *    visor pueda mandarle pedidos (`api`) desde la burbuja o una figura.
 */
export default function PanelIA({
  modo,
  abierto,
  puedeUsar,
  claseId = null,
  onCerrar,
  api,
}: {
  modo: 'flotante' | 'embebido';
  abierto: boolean;
  puedeUsar: boolean;
  claseId?: string | null;
  onCerrar: () => void;
  api?: Ref<ApiPanelIA>;
}) {
  const chat = useChatIA(claseId);
  const { mensajes, info, enCurso, cargarInfo, pedir, nueva } = chat;
  const [texto, setTexto] = useState('');
  const lista = useRef<HTMLDivElement>(null);
  const cargado = useRef(false);

  useImperativeHandle(api, () => ({ pedir }), [pedir]);

  // El saldo se pide la primera vez que se abre, no al montar el dashboard.
  useEffect(() => {
    if (abierto && puedeUsar && !cargado.current) {
      cargado.current = true;
      cargarInfo();
    }
  }, [abierto, puedeUsar, cargarInfo]);

  useEffect(() => {
    const el = lista.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes]);

  const enviar = () => {
    const pregunta = texto.trim();
    if (!pregunta || enCurso) return;
    setTexto('');
    pedir({ accion: 'libre', pregunta });
  };

  const saldo = info?.saldo ? info.saldo.plan + info.saldo.recarga : null;
  const precio = info?.precios;
  const listo = puedeUsar && info?.disponible;

  return (
    <aside
      className={`${s.panel} ${modo === 'embebido' ? s.embebido : s.flotante} ${abierto ? s.abierto : ''}`}
      aria-label="MedGO IA"
      aria-hidden={!abierto}
      // Escribir aquí no debe disparar los atajos de la página (A–E del examen,
      // Ctrl+C/A del visor). Esc sí sube: cierra lo que esté abierto.
      onKeyDown={(e) => { if (e.key !== 'Escape') e.stopPropagation(); }}
      onCopy={(e) => e.stopPropagation()}
    >
      <header className={s.cabecera}>
        <span className={s.marca}><IconoIA size={18} /></span>
        <div className={s.titulo}>
          <strong>MedGO IA</strong>
          <span className={s.beta}>Beta</span>
        </div>
        {saldo !== null && (
          <span
            className={s.saldo}
            title={info?.saldo?.renueva ? `Tu cuota se renueva el ${new Date(info.saldo.renueva).toLocaleDateString('es-PE')}` : undefined}
          >
            {fmt(saldo)} <small>créditos</small>
          </span>
        )}
        {mensajes.length > 0 && (
          <button className={s.icono} onClick={nueva} disabled={enCurso} title="Nueva conversación" aria-label="Nueva conversación">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}
        <button className={s.icono} onClick={onCerrar} aria-label="Cerrar MedGO IA">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </header>

      <div className={s.lista} ref={lista}>
        {!puedeUsar ? (
          <div className={s.vacio}>
            <span className={s.vacioIcono}><IconoIA size={30} /></span>
            <p className={s.vacioTitulo}>Próximamente</p>
            <p>Estamos construyendo un tutor que te explica lo que subrayes en tus resúmenes, las figuras y cualquier duda de tu curso.</p>
          </div>
        ) : info === null ? (
          <p className={s.estado}>Cargando…</p>
        ) : !info.disponible ? (
          <div className={s.vacio}>
            <span className={s.vacioIcono}><IconoIA size={30} /></span>
            <p>{MENSAJE_ERROR[info.motivo ?? ''] ?? 'MedGO IA no está disponible.'}</p>
          </div>
        ) : mensajes.length === 0 ? (
          <div className={s.vacio}>
            <span className={s.vacioIcono}><IconoIA size={30} /></span>
            {info.configurada === false && (
              <p className={s.aviso}>Falta configurar la clave de la IA en el servidor: las consultas responderán «no configurada».</p>
            )}
            {claseId ? (
              <>
                <p className={s.vacioTitulo}>Pregúntale a tu resumen</p>
                <ul className={s.pasos}>
                  <li><b>Subraya</b> una palabra o frase y elige «¿Qué significa?» o «Explícame».</li>
                  <li><b>Toca una figura</b> y pulsa «Explícame esta figura».</li>
                  <li>O escribe tu duda abajo.</li>
                </ul>
                <button className={s.accion} onClick={() => pedir({ accion: 'resumir' })} disabled={enCurso}>
                  Resumir todo el resumen
                  {precio && <span>~{fmt(precio.resumir)} créditos</span>}
                </button>
              </>
            ) : (
              <>
                <p className={s.vacioTitulo}>¿Qué quieres entender hoy?</p>
                <div className={s.sugerencias}>
                  {SUGERENCIAS.map((q) => (
                    <button key={q} className={s.sugerencia} onClick={() => pedir({ accion: 'libre', pregunta: q })} disabled={enCurso}>
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={m.rol === 'user' ? s.usuario : s.respuesta}>
              {m.rol === 'user' ? (
                <>
                  {m.figura && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className={s.miniatura} src={m.figura} alt="" draggable={false} />
                  )}
                  <p>{m.texto}</p>
                </>
              ) : m.estado === 'error' ? (
                <p className={s.error}>{m.texto}</p>
              ) : m.estado === 'cargando' && !m.texto ? (
                <span className={s.pensando} aria-label="Pensando"><i /><i /><i /></span>
              ) : (
                <>
                  <div className={s.md}><ReactMarkdown>{m.texto}</ReactMarkdown></div>
                  {m.estado === 'listo' && m.cobrado !== undefined && (
                    <span className={s.costo}>−{fmt(m.cobrado)} créditos</span>
                  )}
                  {/* El resumen suele quedarse en la superficie: «A fondo» lo
                      explica desde el conocimiento de la IA, con lo subrayado de ancla. */}
                  {m.estado === 'listo' && m.origen?.seleccion &&
                    (m.origen.accion === 'definir' || m.origen.accion === 'explicar') && (
                    <button
                      className={s.chip}
                      onClick={() => pedir({ accion: 'profundizar', seleccion: m.origen!.seleccion, seccion: m.origen!.seccion })}
                      disabled={enCurso}
                    >
                      Más a fondo{precio ? ` · ~${fmt(precio.profundizar)}` : ''}
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {listo && (
        <form
          className={s.caja}
          onSubmit={(e) => { e.preventDefault(); enviar(); }}
        >
          {claseId && mensajes.length > 0 && (
            <button type="button" className={s.chip} onClick={() => pedir({ accion: 'resumir' })} disabled={enCurso}>
              Resumir todo{precio ? ` · ~${fmt(precio.resumir)}` : ''}
            </button>
          )}
          <div className={s.entrada}>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, 500))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
              }}
              placeholder={claseId ? 'Pregunta sobre este resumen…' : 'Escribe tu duda de medicina…'}
              rows={2}
              maxLength={500}
            />
            <button type="submit" className={s.enviar} disabled={!texto.trim() || enCurso} aria-label="Enviar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className={s.pie}>
            {precio ? `~${fmt(precio.libre)} créditos por pregunta · ` : ''}
            {texto.length > 400 ? `${texto.length}/500` : 'La IA puede equivocarse: contrasta con tu material.'}
          </p>
        </form>
      )}
    </aside>
  );
}
