'use client';
// Tarjeta de la pregunta, sobre el lienzo. Entra volteándose en el centro; en
// las de señalar se acomoda a un lado para dejar ver el corte, y al corregir
// se queda a un lado con la explicación mientras el modelo marca la respuesta.
// El paso del centro al lado viaja (FLIP): se mide dónde estaba y dónde queda,
// y la tarjeta se desliza y se encoge hasta su sitio en vez de saltar.

import { useEffect, useLayoutEffect, useRef } from 'react';
import { LAMINA_GROUPS, LEVELS, TRACTS, type LaminaGroupId, type TractId } from '../engine/anatomy';
import { CATEGORIAS_MP } from '@/lib/medula-practica/tipos';
import type { Practica } from './usePractica';
import s from '@/styles/medulaPractica.module.css';

const LETRAS = ['A', 'B', 'C', 'D'];
const VIAJE_MS = 620;
const CURVA = 'cubic-bezier(0.22, 0.9, 0.24, 1)';

function nombre(id: string): string {
  if (id in LAMINA_GROUPS) return LAMINA_GROUPS[id as LaminaGroupId].name;
  if (id in TRACTS) return TRACTS[id as TractId].name;
  return id;
}

export default function TarjetaPractica({ pr }: { pr: Practica }) {
  const { actual: p, paso, respuesta, i, ronda } = pr;
  const seguir = useRef<HTMLButtonElement>(null);
  const pos = useRef<HTMLDivElement>(null);
  /** Dónde estaba la tarjeta en el render anterior (y de qué pregunta y lado). */
  const antes = useRef<{ rect: DOMRect; id: string; lado: boolean } | null>(null);
  const lado = !!p && (paso === 'corregida' || (paso === 'responder' && p.forma === 'senalar'));

  // FLIP: si la misma pregunta cambia de sitio, se anima desde donde estaba.
  useLayoutEffect(() => {
    const el = pos.current;
    if (!el || !p) { antes.current = null; return; }
    const ahora = el.getBoundingClientRect();
    const prev = antes.current;
    antes.current = { rect: ahora, id: p.id, lado };
    if (!prev || prev.id !== p.id || prev.lado === lado) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const dx = prev.rect.left - ahora.left;
    const dy = prev.rect.top - ahora.top;
    const k = prev.rect.width / Math.max(ahora.width, 1);
    el.style.transformOrigin = 'top left';
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`;
    void el.offsetWidth; // fija el punto de partida antes de animar
    el.style.transition = `transform ${VIAJE_MS}ms ${CURVA}`;
    el.style.transform = '';
    const fin = window.setTimeout(() => {
      el.style.transition = '';
      el.style.transformOrigin = '';
      antes.current = { rect: el.getBoundingClientRect(), id: p.id, lado };
    }, VIAJE_MS + 40);
    return () => window.clearTimeout(fin);
  }, [p, lado, paso]);

  // Al corregir, el foco va a «Siguiente» sin desplazar la tarjeta.
  useEffect(() => {
    if (paso === 'corregida') seguir.current?.focus({ preventScroll: true });
  }, [paso]);

  // Teclado: 1-4 o A-D para responder; Enter o → para seguir.
  useEffect(() => {
    if (!p) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (paso === 'responder' && p.forma === 'opciones') {
        const k = e.key.toLowerCase();
        const n = '1234'.indexOf(k) >= 0 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
        if (n >= 0 && n < p.opciones.length) { e.preventDefault(); pr.responderOpcion(n); }
      } else if (paso === 'corregida' && (e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault();
        pr.siguiente();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [p, paso, pr]);

  if (!p) return null;

  const cat = CATEGORIAS_MP.find((c) => c.id === p.categoria)?.label ?? '';
  const nivel = LEVELS[p.nivel];
  const total = ronda.length;
  const ultima = i + 1 >= total;
  const corregida = paso === 'corregida' && !!respuesta;
  const respuestaTxt = p.forma === 'senalar'
    ? p.objetivo.ids.map(nombre).join(' o ')
    : `${LETRAS[p.correcta]}. ${p.opciones[p.correcta]}`;
  // ¿Hay algo marcado en el corte para mirar al corregir?
  const marcaEnModelo = p.forma === 'senalar' || !!p.resaltar;

  return (
    <div className={s.capa}>
      {/* Velo mientras se leen las alternativas: el modelo queda detrás */}
      {p.forma === 'opciones' && !lado && <div className={s.velo} aria-hidden />}

      <div ref={pos} className={`${s.pos} ${lado ? s.posLado : s.posCentro}`}>
        <article
          key={p.id}
          className={`${s.tarjeta} ${paso === 'volteo' ? s.volteo : ''}`}
          aria-live="polite"
          aria-label={`Pregunta ${i + 1} de ${total}`}
        >
          {/* ── Dónde estoy: pregunta, avance y corte ── */}
          <header className={s.cabeza}>
            <div className={s.cabezaFila}>
              <span className={s.progresoTxt}>Pregunta <strong>{i + 1}</strong> de {total}</span>
              <span className={s.nivelChip} title="Nivel del corte que ves en el modelo">
                <IconoCorte />Corte {nivel.name.toLowerCase()} · {nivel.segment}
              </span>
            </div>
            <div className={s.progreso} aria-hidden>
              <span style={{ width: `${((i + (corregida ? 1 : 0.5)) / total) * 100}%` }} />
            </div>
            <div className={s.etiquetas}>
              <span className={s.chip}>{cat}</span>
              <span className={`${s.chip} ${p.tipo === 'caso' ? s.chipCaso : ''}`}>{p.tipo === 'caso' ? 'Caso clínico' : 'Teórica'}</span>
              <span className={s.tarea}>{p.forma === 'senalar' ? 'Señala en el corte' : 'Elige una alternativa'}</span>
            </div>
          </header>

          {p.caso && (
            <div className={s.caso}>
              <span className={s.casoTitulo}>Caso</span>
              <p>{p.caso}</p>
            </div>
          )}
          <h3 className={s.enunciado}>{p.enunciado}</h3>

          {/* Señalar: qué hacer mientras se espera el toque */}
          {p.forma === 'senalar' && !corregida && (
            <p className={s.toca}>
              <span className={s.tocaPunto} aria-hidden />
              Toca {p.objetivo.kind === 'lamina' ? 'la zona de la sustancia gris' : 'el tracto'} en el corte
            </p>
          )}

          {/* Alternativas */}
          {p.forma === 'opciones' && (
            <ol className={s.opciones}>
              {p.opciones.map((o, k) => {
                const esOk = corregida && k === p.correcta;
                const esMal = corregida && respuesta?.elegida === k && !respuesta.ok;
                return (
                  <li key={k}>
                    <button
                      type="button"
                      className={`${s.opcion} ${esOk ? s.opcionOk : ''} ${esMal ? s.opcionMal : ''} ${corregida && !esOk && !esMal ? s.opcionApagada : ''}`}
                      disabled={paso !== 'responder'}
                      onClick={() => pr.responderOpcion(k)}
                    >
                      <span className={s.letra}>{esOk ? <IconoCheck /> : esMal ? <IconoCruz /> : LETRAS[k]}</span>
                      <span>{o}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}

          {/* ── Corrección: veredicto, respuesta, dónde mirarla y por qué ── */}
          {corregida && respuesta && (
            <div className={s.correccion}>
              <div className={`${s.veredicto} ${respuesta.ok ? s.veredictoOk : s.veredictoMal}`}>
                <span className={s.veredictoIcono}>{respuesta.ok ? <IconoCheck /> : <IconoCruz />}</span>
                <strong>{respuesta.ok ? '¡Correcto!' : 'Incorrecto'}</strong>
              </div>

              <ul className={s.respuestas}>
                {!respuesta.ok && p.forma === 'senalar' && respuesta.tocado && (
                  <li><span className={s.puntoMal} aria-hidden />Tocaste <strong>{nombre(respuesta.tocado)}</strong></li>
                )}
                {!respuesta.ok && p.forma === 'opciones' && respuesta.elegida !== undefined && (
                  <li><span className={s.puntoMal} aria-hidden />Elegiste <strong>{LETRAS[respuesta.elegida]}. {p.opciones[respuesta.elegida]}</strong></li>
                )}
                <li><span className={s.puntoOk} aria-hidden />Respuesta: <strong>{respuestaTxt}</strong></li>
              </ul>

              {marcaEnModelo && (
                <p className={s.enModelo}>
                  <IconoOjo />
                  Mírala en el corte: en verde{!respuesta.ok && p.forma === 'senalar' ? ', y lo que tocaste en rojo' : ''}.
                </p>
              )}

              <div className={s.porque}>
                <span className={s.porqueTitulo}>¿Por qué?</span>
                <p>{p.explicacion}</p>
              </div>

              <footer className={s.pieTarjeta}>
                {p.origen !== 'propia' ? <span className={s.origen}>Basada en {p.origen}</span> : <span />}
                <button ref={seguir} type="button" className={s.siguiente} onClick={pr.siguiente}>
                  {ultima ? 'Ver resultados' : 'Siguiente'}
                  <kbd className={s.tecla} aria-hidden>Enter</kbd>
                </button>
              </footer>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

// ── Íconos (trazo fino y redondeado, en el color del texto) ─────────────────
function IconoCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCruz() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function IconoOjo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconoCorte() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      {/* Corte medular: el contorno y la H de la sustancia gris */}
      <ellipse cx="12" cy="12" rx="9.5" ry="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7.5v9M15 7.5v9M9 12h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
