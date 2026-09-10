'use client';
// Piezas del modo aprender: selector de vías, marcador superior, bandeja de
// fichas, campo para escribir y cierre. La lógica (qué está revelado, qué se
// acepta) vive en `CascadaLab`; aquí sólo se pinta.

import { useEffect, useRef, useState } from 'react';
import { NODO_POR_ID, textoFicha, type Via } from '@/lib/data/coagulacion';
import type { GhostPos } from '@/hooks/useDragDrop';
import s from '@/styles/cascadaCoagulacion.module.css';

export type Dificultad = 'fichas' | 'escribir';
export type Progreso = Record<string, { hecha: boolean; mejor: number }>;

const zonaClase = (v: Via) => s[`z_${v.zona ?? 'regulacion'}`];
const etiquetaFicha = textoFicha;

// ─── Selector ─────────────────────────────────────────────────────────────────
export function SelectorVias({
  vias, progreso, dificultad, onDificultad, onElegir, onCerrar,
}: {
  vias: Via[];
  progreso: Progreso;
  dificultad: Dificultad;
  onDificultad: (d: Dificultad) => void;
  onElegir: (v: Via) => void;
  onCerrar: () => void;
}) {
  const hechas = vias.filter((v) => progreso[v.id]?.hecha).length;
  return (
    <div className={s.velo} data-ui>
      <div className={s.selector} role="dialog" aria-label="¿Qué vía quieres aprender?">
        <div className={s.selectorCab}>
          <div>
            <p className={s.selectorPregunta}>¿Qué vía quieres aprender?</p>
            <p className={s.selectorSub}>
              Verás sólo el comienzo; el siguiente factor aparece en blanco y tienes que completarlo.
              <span className={s.selectorCuenta}> {hechas} de {vias.length} completadas</span>
            </p>
          </div>
          <button type="button" className={s.btnIcono} onClick={onCerrar} aria-label="Volver a explorar">
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={s.viasGrid}>
          {vias.map((v, i) => {
            const pr = progreso[v.id];
            const semilla = NODO_POR_ID[v.semilla[0]];
            return (
              <button
                key={v.id}
                type="button"
                className={`${s.viaTile} ${zonaClase(v)} ${pr?.hecha ? s.viaHecha : ''}`}
                style={{ ['--i' as string]: i }}
                onClick={() => onElegir(v)}
              >
                <span className={s.viaNombre}>{v.nombre}</span>
                <span className={s.viaPrueba}>{v.prueba}</span>
                <span className={s.viaCadena} aria-hidden>
                  <span className={s.viaSemilla}>{semilla.label.length > 14 ? semilla.label.split(/[ ,]/)[0] : semilla.label}</span>
                  {v.pasos.map((p) => (
                    <span key={p.nodo} className={s.viaPunto} />
                  ))}
                </span>
                <span className={s.viaPie}>
                  {v.pasos.length} pasos
                  {pr?.hecha && (
                    <span className={s.viaCheck}>
                      <svg viewBox="0 0 16 16" aria-hidden>
                        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {pr.mejor === 0 ? 'sin errores' : `mejor: ${pr.mejor} ${pr.mejor === 1 ? 'error' : 'errores'}`}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className={s.dificultad}>
          <span className={s.dificultadRotulo}>Cómo completar</span>
          <div className={s.segmento} role="radiogroup" aria-label="Dificultad">
            {([
              ['fichas', 'Fichas', 'Arrastra una de cuatro opciones'],
              ['escribir', 'Escribir', 'Escribe el nombre del factor'],
            ] as const).map(([id, nombre, desc]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={dificultad === id}
                className={`${s.segBtn} ${dificultad === id ? s.segActivo : ''}`}
                onClick={() => onDificultad(id)}
                title={desc}
              >
                {nombre}
              </button>
            ))}
          </div>
          <span className={s.dificultadDesc}>
            {dificultad === 'fichas' ? 'Fácil · arrastra una de cuatro fichas' : 'Difícil · escribe el nombre (vale «9a», «trombina»…)'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Marcador superior ────────────────────────────────────────────────────────
export function HudAprender({
  via, paso, errores, terminado, onCambiar,
}: {
  via: Via;
  paso: number;
  errores: number;
  terminado: boolean;
  onCambiar: () => void;
}) {
  return (
    <div className={`${s.hud} ${zonaClase(via)}`} data-ui>
      <span className={s.hudNombre}>{via.nombre}</span>
      <span className={s.hudPasos} aria-label={`Paso ${Math.min(paso + 1, via.pasos.length)} de ${via.pasos.length}`}>
        {via.pasos.map((p, i) => (
          <span
            key={p.nodo}
            className={`${s.hudPunto} ${i < paso || terminado ? s.hudHecho : ''} ${i === paso && !terminado ? s.hudActual : ''}`}
          />
        ))}
      </span>
      <span className={`${s.hudErrores} ${errores ? s.hudConErrores : ''}`}>
        {errores} {errores === 1 ? 'error' : 'errores'}
      </span>
      <button type="button" className={s.hudBtn} onClick={onCambiar}>Cambiar vía</button>
    </div>
  );
}

// ─── Bandeja de fichas ────────────────────────────────────────────────────────
export interface Ficha {
  id: string;
}

export function BandejaFichas({
  via, pista, opciones, descartadas, picked, dragItem, ghost, mensaje, startDrag, tapItem,
}: {
  via: Via;
  pista: string;
  opciones: string[];
  descartadas: Set<string>;
  picked: Ficha | null;
  dragItem: Ficha | null;
  ghost: GhostPos;
  mensaje: { tipo: 'mal' | 'regalo'; texto: string; key: number } | null;
  startDrag: (e: React.PointerEvent, item: Ficha) => void;
  tapItem: (item: Ficha) => void;
}) {
  return (
    <>
      <div className={`${s.bandeja} ${zonaClase(via)}`} data-ui>
        <div className={s.bandejaTexto}>
          <span className={s.bandejaPregunta}>¿Qué va en el hueco?</span>
          <span className={s.bandejaPista}>{pista}</span>
        </div>
        <div className={s.fichas}>
          {opciones.map((id, i) => {
            const n = NODO_POR_ID[id];
            const fuera = descartadas.has(id);
            const arrastrada = dragItem?.id === id;
            return (
              <div
                key={id}
                role="button"
                tabIndex={fuera ? -1 : 0}
                aria-disabled={fuera}
                aria-pressed={picked?.id === id}
                className={[
                  s.ficha,
                  n.vitK ? s.fichaVitK : '',
                  n.tipo === 'cofactor' ? s.fichaCofactor : '',
                  fuera ? s.fichaFuera : '',
                  picked?.id === id ? s.fichaElegida : '',
                  arrastrada ? s.fichaArrastrada : '',
                ].filter(Boolean).join(' ')}
                style={{ ['--i' as string]: i }}
                onPointerDown={(e) => { if (!fuera) startDrag(e, { id }); }}
                onClick={() => { if (!fuera) tapItem({ id }); }}
                onKeyDown={(e) => {
                  if (!fuera && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tapItem({ id }); }
                }}
              >
                {etiquetaFicha(n)}
              </div>
            );
          })}
        </div>
        <p className={s.bandejaAyuda}>
          {picked ? 'Ahora toca el hueco «?» del lienzo' : 'Arrástrala al hueco, o tócala y luego toca el hueco'}
        </p>
        {mensaje && (
          <p key={mensaje.key} className={`${s.mensaje} ${mensaje.tipo === 'mal' ? s.mensajeMal : s.mensajeRegalo}`} role="status">
            {mensaje.texto}
          </p>
        )}
      </div>

      {dragItem && (
        <div className={`${s.ficha} ${s.fichaFantasma}`} style={{ left: ghost.x, top: ghost.y }} aria-hidden>
          {etiquetaFicha(NODO_POR_ID[dragItem.id])}
        </div>
      )}
    </>
  );
}

// ─── Escribir ─────────────────────────────────────────────────────────────────
export function CampoEscribir({
  via, pista, paso, mensaje, onComprobar,
}: {
  via: Via;
  pista: string;
  /** Cambia en cada paso: vacía el campo. */
  paso: number;
  mensaje: { tipo: 'mal' | 'regalo'; texto: string; key: number } | null;
  onComprobar: (txt: string) => void;
}) {
  const [txt, setTxt] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTxt('');
    input.current?.focus({ preventScroll: true });
  }, [paso]);

  // Tras un fallo, se selecciona lo escrito para reescribir de un tirón.
  useEffect(() => {
    if (mensaje?.tipo === 'mal') input.current?.select();
  }, [mensaje]);

  return (
    <form
      className={`${s.bandeja} ${zonaClase(via)}`}
      data-ui
      onSubmit={(e) => {
        e.preventDefault();
        if (txt.trim()) onComprobar(txt);
      }}
    >
      <div className={s.bandejaTexto}>
        <label className={s.bandejaPregunta} htmlFor="coag-respuesta">¿Qué va en el hueco?</label>
        <span className={s.bandejaPista}>{pista}</span>
      </div>
      <div className={s.escribir}>
        <input
          id="coag-respuesta"
          ref={input}
          className={s.escribirInput}
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
          placeholder="p. ej. XIa, trombina, 9a…"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button type="submit" className={s.btnPrimario} disabled={!txt.trim()}>Comprobar</button>
      </div>
      {mensaje && (
        <p key={mensaje.key} className={`${s.mensaje} ${mensaje.tipo === 'mal' ? s.mensajeMal : s.mensajeRegalo}`} role="status">
          {mensaje.texto}
        </p>
      )}
    </form>
  );
}

// ─── Cierre ───────────────────────────────────────────────────────────────────
export function CierreVia({
  via, errores, regalados, siguiente, onRepetir, onOtra, onSiguiente, onVerTodo,
}: {
  via: Via;
  errores: number;
  regalados: number;
  siguiente: Via | null;
  onRepetir: () => void;
  onOtra: () => void;
  onSiguiente: () => void;
  onVerTodo: () => void;
}) {
  const aciertos = via.pasos.length - regalados;
  return (
    <div className={`${s.cierre} ${zonaClase(via)}`} data-ui role="status">
      <div className={s.cierreCab}>
        <span className={s.cierreSello} aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className={s.cierreTitulo}>{via.nombre} completa</p>
          <p className={s.cierreDatos}>
            <span><b>{aciertos}</b> de {via.pasos.length} por tu cuenta</span>
            <span><b>{errores}</b> {errores === 1 ? 'error' : 'errores'}</span>
          </p>
        </div>
      </div>
      {via.mnemo && <p className={s.cierreMnemo}>{via.mnemo}</p>}
      <div className={s.cierreBotones}>
        {siguiente ? (
          <button type="button" className={s.btnPrimario} onClick={onSiguiente}>
            Siguiente: {siguiente.nombre}
          </button>
        ) : (
          <button type="button" className={s.btnPrimario} onClick={onVerTodo}>Ver la cascada completa</button>
        )}
        <button type="button" className={s.btnSecundario} onClick={onRepetir}>Repetir</button>
        <button type="button" className={s.btnSecundario} onClick={onOtra}>Otra vía</button>
      </div>
    </div>
  );
}
