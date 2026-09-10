'use client';
// Un nodo del lienzo. La posición NO la pone React en cada frame: el elemento
// exterior recibe su `transform` inicial aquí y el bucle de `CascadaLab` lo
// reescribe al arrastrar. Lo visual (entrada, pop, sacudida, atenuado) va en el
// cuerpo interior, para que esas animaciones no pisen el `transform` de la
// posición.

import { memo } from 'react';
import type { Aviso, Nodo } from '@/lib/data/coagulacion';
import s from '@/styles/cascadaCoagulacion.module.css';

export type EstadoNodo = 'on' | 'blank' | 'off';

interface Props {
  nodo: Nodo;
  estado: EstadoNodo;
  x: number;
  y: number;
  /** Orden de entrada (cascada de aparición). */
  orden: number;
  /** Atenuado porque otro nodo tiene el foco. */
  tenue: boolean;
  /** Dentro de la cadena resaltada. */
  enCadena: boolean;
  /** Recién revelado en el modo aprender: hace el pop. */
  recien: boolean;
  /** Clave que cambia en cada fallo, para repetir la sacudida. */
  sacudida: number;
  /** Hueco resaltado porque una ficha pasa por encima. */
  objetivo: boolean;
  /** Hueco que acepta fichas (modo fácil). */
  huecoFichas: boolean;
  aviso?: Aviso;
  avisoVisto: boolean;
  registrar: (id: string, el: HTMLDivElement | null) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, id: string) => void;
  onFoco: (id: string | null) => void;
  onHueco: () => void;
  onAviso: (a: Aviso, el: HTMLElement, fijar: boolean) => void;
  onAvisoFuera: () => void;
}

function MallaGlifo() {
  // Fibras cruzadas: la malla de fibrina de la lámina, en trazo.
  return (
    <svg className={s.glifo} viewBox="0 0 44 26" aria-hidden>
      <path d="M2 20C10 6 18 22 26 8S38 18 42 6" />
      <path d="M2 8c9 12 16-2 24 10s12 2 16 4" />
      <path d="M6 24C14 14 22 26 30 14s8-8 12-10" />
      <path d="M4 14h36" strokeDasharray="2 3" />
    </svg>
  );
}

function FragmentosGlifo() {
  return (
    <svg className={s.glifo} viewBox="0 0 44 26" aria-hidden>
      <path d="M3 18l7-6" />
      <path d="M14 8l6 5" />
      <path d="M23 19l6-7" />
      <path d="M33 9l7 4" />
      <path d="M9 22l4 2" />
      <path d="M30 22l5-1" />
    </svg>
  );
}

function NodoFactor({
  nodo, estado, x, y, orden, tenue, enCadena, recien, sacudida, objetivo, huecoFichas,
  aviso, avisoVisto, registrar, onPointerDown, onFoco, onHueco, onAviso, onAvisoFuera,
}: Props) {
  const hueco = estado === 'blank';
  const clases = [
    s.nodo,
    s[`t_${nodo.tipo}`],
    nodo.vitK ? s.vitK : '',
    estado === 'off' ? s.oculto : '',
    hueco ? s.esHueco : '',
    tenue ? s.tenue : '',
    enCadena ? s.enCadena : '',
    recien ? s.recien : '',
    objetivo ? s.objetivo : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={(el) => registrar(nodo.id, el)}
      data-nodo={nodo.id}
      {...(hueco && huecoFichas ? { 'data-slot': 'hueco' } : {})}
      className={clases}
      style={{
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        ['--i' as string]: orden,
      }}
      aria-hidden={estado === 'off'}
      onPointerDown={(e) => {
        if (hueco) return;
        onPointerDown(e, nodo.id);
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse' && estado === 'on') onFoco(nodo.id);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') onFoco(null);
      }}
      onClick={hueco ? onHueco : undefined}
    >
      {/* `key` con la sacudida: remonta el cuerpo y repite la animación en cada fallo. */}
      <div key={hueco ? `h${sacudida}` : 'n'} className={`${s.cuerpo} ${hueco && sacudida ? s.sacude : ''}`}>
        {hueco ? (
          <span className={s.huecoMarca} aria-label="Factor por completar">?</span>
        ) : nodo.tipo === 'caja' ? (
          <>
            <span className={s.cajaTitulo}>{nodo.label}</span>
            <ul className={s.cajaLista}>
              {nodo.items?.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </>
        ) : (
          <>
            {nodo.tipo === 'producto' && (nodo.id === 'malla' ? <MallaGlifo /> : <FragmentosGlifo />)}
            <span className={s.lab}>{nodo.label}</span>
            {nodo.sub && <span className={s.sub}>{nodo.sub}</span>}
            {nodo.calcio && (
              <span className={s.calcio} title="Requiere Ca²⁺ y fosfolípidos">*</span>
            )}
          </>
        )}
      </div>

      {aviso && estado === 'on' && (
        <button
          type="button"
          data-aviso
          className={`${s.baliza} ${avisoVisto ? s.balizaVista : ''}`}
          aria-label={`${aviso.titulo}: ${aviso.corto}`}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') onAviso(aviso, e.currentTarget, false);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') onAvisoFuera();
          }}
          onFocus={(e) => onAviso(aviso, e.currentTarget, false)}
          onBlur={onAvisoFuera}
          onClick={(e) => {
            e.stopPropagation();
            onAviso(aviso, e.currentTarget, true);
          }}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <circle cx="8" cy="4.2" r="1.3" fill="currentColor" />
            <path d="M8 7.2v5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default memo(NodoFactor);
