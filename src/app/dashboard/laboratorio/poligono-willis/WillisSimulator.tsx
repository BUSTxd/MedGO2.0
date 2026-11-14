'use client';
// Orquestador del lab «Polígono de Willis 3D». Copia la arquitectura de Médula
// Espinal 3D (SpinalCordSimulator): el modelo ocupa toda la altura, las vistas
// flotan arriba a la izquierda, el menú ☰ arriba a la derecha, el rótulo de lo
// señalado bajo las vistas y la barra lateral de 420 px a la derecha.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ControlsPanel, { MODOS } from './ControlsPanel';
import {
  ARTERIAS, GRUPOS, TERRITORIOS, REFERENCIAS, ARTERIA_LIST,
  type ArteriaId, type SistemaId, type TerritorioId, type ReferenciaId,
} from './engine/anatomia';
import { VARIANTES, SINDROMES, type VarianteId, type SindromeId, type Lado } from './engine/clinica';
import styles from '@/styles/medulaEspinal.module.css';

const WillisScene = dynamic(() => import('./WillisScene'), {
  ssr: false,
  loading: () => (
    <div className={styles.stageEstado} role="status">
      <span className={styles.spinner} aria-hidden />
      Cargando modelo 3D…
    </div>
  ),
});

export type ModoWillis = 'arterias' | 'territorios' | 'variantes' | 'clinico';

/** Lo elegido o señalado en el modelo o en la lista. */
export type Elegido =
  | { kind: 'arteria'; id: ArteriaId; lado: Lado }
  | { kind: 'ref'; id: ReferenciaId }
  | null;

const STORAGE_KEY = 'poligono-willis-prefs';
const MODOS_VALIDOS = new Set<ModoWillis>(['arterias', 'territorios', 'variantes', 'clinico']);

function cargarModo(): ModoWillis | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return MODOS_VALIDOS.has(p.mode) ? p.mode as ModoWillis : null;
  } catch {
    return null;
  }
}

function guardarModo(mode: ModoWillis) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode })); } catch { /* ignore */ }
}

function hayWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function VistasEscena({ mode, onMode }: { mode: ModoWillis; onMode: (m: ModoWillis) => void }) {
  return (
    <div className={styles.vistas} role="group" aria-label="Vista">
      {MODOS.map(({ key, label, desc }) => (
        <button
          key={key}
          type="button"
          title={desc}
          aria-pressed={mode === key}
          className={mode === key ? styles.vistaActiva : styles.vista}
          onClick={() => onMode(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** Menú ☰ de la vista: restablecer la cámara y mostrar u ocultar etiquetas. */
function MenuVista({ etiquetas, onEtiquetas, onRestablecer, onEncefalo }: {
  etiquetas: boolean;
  onEtiquetas: () => void;
  onRestablecer: () => void;
  onEncefalo: () => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setAbierto(false); boton.current?.focus(); }
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <div className={styles.menuVista} ref={caja}>
      <button
        ref={boton}
        type="button"
        className={`${styles.menuBtn} ${abierto ? styles.menuBtnAbierto : ''}`}
        aria-label="Opciones de la vista"
        aria-haspopup="menu"
        aria-expanded={abierto}
        onClick={() => setAbierto((v) => !v)}
      >
        <span className={styles.menuRayas} aria-hidden><span /><span /><span /></span>
      </button>
      {abierto && (
        <div className={styles.menu} role="menu" aria-label="Opciones de la vista">
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => { onRestablecer(); setAbierto(false); }}
          >
            <span className={styles.menuIcono} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                <path d="M4 4.5v4h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </span>
            Restablecer vista
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={() => { onEncefalo(); setAbierto(false); }}
          >
            <span className={styles.menuIcono} aria-hidden>
              {/* Alejar: lupa con un signo menos */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.9" />
                <path d="M7.5 10.5h6M15.5 15.5 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
              </svg>
            </span>
            Ver el encéfalo entero
          </button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={etiquetas}
            className={styles.menuItem}
            onClick={onEtiquetas}
          >
            <span className={`${styles.menuCasilla} ${etiquetas ? styles.menuCasillaOn : ''}`} aria-hidden>
              {etiquetas && (
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            Etiquetas
          </button>
        </div>
      )}
    </div>
  );
}

export default function WillisSimulator() {
  const [mode, setMode] = useState<ModoWillis>('arterias');
  const [sistema, setSistema] = useState<SistemaId>('todo');
  const [elegido, setElegido] = useState<Elegido>(null);
  const [senalado, setSenalado] = useState<Elegido>(null);
  const [territorio, setTerritorio] = useState<TerritorioId | null>(null);
  const [variante, setVariante] = useState<VarianteId>('completo');
  const [sindrome, setSindrome] = useState<SindromeId | null>(null);
  const [refs, setRefs] = useState<Record<ReferenciaId, boolean>>({
    cerebro: true, tronco: true, optico: true, hipofisis: false, nervio3: true,
  });
  const [etiquetas, setEtiquetas] = useState(false);
  const [reinicio, setReinicio] = useState(0);
  const [encuadre, setEncuadre] = useState<'poligono' | 'encefalo'>('poligono');
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [tactil, setTactil] = useState(false);

  useEffect(() => {
    const m = cargarModo();
    if (m) setMode(m);
    setWebgl(hayWebGL());
    setTactil(window.matchMedia?.('(pointer: coarse)').matches ?? false);
  }, []);

  const cambiarModo = useCallback((m: ModoWillis) => {
    setMode(m);
    setSenalado(null);
    guardarModo(m);
  }, []);

  /** Clic en el modelo: alterna la selección; en Territorios elige su territorio. */
  const elegir = useCallback((e: Elegido) => {
    setElegido((prev) => {
      if (!e || !prev || prev.kind !== e.kind || prev.id !== e.id) return e;
      if (e.kind === 'arteria' && prev.kind === 'arteria' && prev.lado !== e.lado) return e;
      return null;
    });
    if (e?.kind === 'arteria' && mode === 'territorios') setTerritorio(ARTERIAS[e.id].territorio);
  }, [mode]);

  /** Desde la lista: la arteria del lado izquierdo (o la de línea media). */
  const elegirArteria = useCallback((id: ArteriaId) => {
    setElegido((prev) => (prev?.kind === 'arteria' && prev.id === id ? null
      : { kind: 'arteria', id, lado: ARTERIAS[id].par ? 'i' : 'm' }));
  }, []);

  const verArteria = useCallback((id: ArteriaId) => {
    setElegido({ kind: 'arteria', id, lado: ARTERIAS[id].par ? 'i' : 'm' });
    setSistema('todo');
    cambiarModo('arterias');
  }, [cambiarModo]);

  const verTerritorio = useCallback((id: TerritorioId) => {
    setTerritorio(id);
    setSistema('todo');
    cambiarModo('territorios');
  }, [cambiarModo]);

  const elegirSindrome = useCallback((id: SindromeId | null) => {
    setSindrome(id);
    if (id) setSistema('todo');
  }, []);

  const elegirVariante = useCallback((id: VarianteId) => {
    setVariante(id);
    setSistema('todo');
  }, []);

  // ── Rótulo del lienzo: lo señalado manda; si no, lo elegido o la vista ──
  const rotulo = useMemo(() => {
    const desde = senalado ?? elegido;
    if (desde?.kind === 'arteria') {
      const a = ARTERIAS[desde.id];
      const terr = TERRITORIOS[a.territorio];
      const lado = a.par ? (desde.lado === 'd' ? ' (derecha)' : ' (izquierda)') : '';
      const grupo = GRUPOS.find((g) => g.id === a.grupo)!.nombre;
      return {
        color: mode === 'territorios' ? terr.color : '#c0392b',
        titulo: `${a.nombre}${lado}`,
        sub: mode === 'territorios' ? `Territorio: ${terr.nombre}` : `${grupo} · calibre ${a.calibre}`,
      };
    }
    if (desde?.kind === 'ref') {
      const r = REFERENCIAS[desde.id];
      return { color: r.color, titulo: r.nombre, sub: 'Referencia anatómica · clic para su ficha' };
    }
    if (mode === 'clinico' && sindrome) {
      const s = SINDROMES[sindrome];
      const lado = s.lado === 'i' ? 'lado izquierdo del paciente' : 'ambos lados';
      return {
        color: '#7c5cd6',
        titulo: s.nombre,
        sub: s.saco ? `Saco en rojo; arterias afectadas en violeta (${lado})` : `Violeta: arterias afectadas (${lado})`,
      };
    }
    if (mode === 'variantes' && variante !== 'completo') {
      return { color: '#f2b631', titulo: VARIANTES[variante].nombre, sub: 'Ámbar: lo que cambia respecto al polígono clásico' };
    }
    if (mode === 'territorios' && territorio) {
      const t = TERRITORIOS[territorio];
      const n = ARTERIA_LIST.filter((a) => a.territorio === territorio).length;
      return { color: t.color, titulo: `Territorio: ${t.nombre}`, sub: `${n} arteria${n === 1 ? '' : 's'} resaltada${n === 1 ? '' : 's'}` };
    }
    return null;
  }, [senalado, elegido, mode, sindrome, variante, territorio]);

  // ── Anuncio para lector de pantalla ──
  const anuncio = useMemo(() => {
    const vista = MODOS.find((m) => m.key === mode)?.label ?? '';
    const partes = [`Vista ${vista}`];
    if (elegido?.kind === 'arteria') partes.push(`seleccionada: ${ARTERIAS[elegido.id].nombre}`);
    if (elegido?.kind === 'ref') partes.push(`seleccionado: ${REFERENCIAS[elegido.id].nombre}`);
    if (mode === 'territorios' && territorio) partes.push(`territorio: ${TERRITORIOS[territorio].nombre}`);
    if (mode === 'variantes') partes.push(`variante: ${VARIANTES[variante].nombre}`);
    if (mode === 'clinico' && sindrome) partes.push(`síndrome: ${SINDROMES[sindrome].nombre}`);
    return partes.join(', ') + '.';
  }, [mode, elegido, territorio, variante, sindrome]);

  const ayudaGestos = tactil
    ? 'Arrastra para girar · pellizca para acercar'
    : 'Arrastra para girar · rueda para acercar';

  return (
    <div className={styles.lab}>
      <p className={styles.srOnly} aria-live="polite">{anuncio}</p>
      <div className={styles.escenario}>
        {webgl === false ? (
          <div className={styles.stageEstado} role="alert">
            <strong>Tu navegador no puede mostrar el modelo 3D.</strong>
            <span>
              Activa la aceleración por hardware o abre el laboratorio en Chrome, Edge o Firefox actualizados.
              Mientras tanto, las fichas del panel siguen disponibles.
            </span>
          </div>
        ) : (
          <WillisScene
            mode={mode}
            sistema={sistema}
            elegido={elegido}
            senalado={senalado}
            territorio={territorio}
            variante={mode === 'variantes' ? VARIANTES[variante] : null}
            sindrome={mode === 'clinico' && sindrome ? SINDROMES[sindrome] : null}
            refs={refs}
            etiquetas={etiquetas}
            reinicio={reinicio}
            encuadre={encuadre}
            onElegir={elegir}
            onSenalar={setSenalado}
            onDeseleccionar={() => setElegido(null)}
          />
        )}

        {rotulo && (
          <div className={styles.structureTag} aria-hidden>
            <div className={styles.structureTagRow}>
              <span className={styles.structureTagDot} style={{ background: rotulo.color }} />
              <span className={styles.structureTagName}><strong>{rotulo.titulo}</strong></span>
            </div>
            <span className={styles.structureTagSub}>{rotulo.sub}</span>
          </div>
        )}

        <MenuVista
          etiquetas={etiquetas}
          onEtiquetas={() => setEtiquetas((v) => !v)}
          onRestablecer={() => { setEncuadre('poligono'); setReinicio((n) => n + 1); }}
          onEncefalo={() => {
            setEncuadre('encefalo');
            setRefs((r) => ({ ...r, cerebro: true }));
            setReinicio((n) => n + 1);
          }}
        />

        <VistasEscena mode={mode} onMode={cambiarModo} />

        <span className={styles.zoomHint}>{ayudaGestos}</span>
      </div>

      <ControlsPanel
        mode={mode}
        sistema={sistema}
        onSistema={setSistema}
        elegido={elegido}
        territorio={territorio}
        variante={variante}
        sindrome={sindrome}
        refs={refs}
        onElegirArteria={elegirArteria}
        onVerArteria={verArteria}
        onTerritorio={setTerritorio}
        onVerTerritorio={verTerritorio}
        onVariante={elegirVariante}
        onSindrome={elegirSindrome}
        onRef={(id) => setRefs((r) => ({ ...r, [id]: !r[id] }))}
        onSenalar={setSenalado}
      />
    </div>
  );
}
