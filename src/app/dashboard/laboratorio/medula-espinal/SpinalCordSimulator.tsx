'use client';
// Orquestador principal: gestiona el estado global del simulador y conecta
// el panel de controles (ControlsPanel) con la escena 3D (SpinalCordScene).
// Diseño revisado con las heurísticas de Nielsen
// (auditorias-ux/nielsen-medula-espinal-2026-11-12.md): rótulo de lo señalado
// sobre el lienzo, «Restablecer vista», estados de carga y sin WebGL, y anuncios
// para lector de pantalla.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ControlsPanel, { MODES, type ViewMode } from './ControlsPanel';
import { tramoSegmentos } from './engine/cordon';
import { usePractica } from './practica/usePractica';
import TarjetaPractica from './practica/TarjetaPractica';
import PanelPractica from './practica/PanelPractica';
import {
  SYNDROMES, LAMINA_GROUPS, TRACTS, LEVELS, REGIONS, rangoNucleo,
  type LevelId, type LaminaGroupId, type TractId, type MeningeId, type SyndromeId,
} from './engine/anatomy';
import styles from '@/styles/medulaEspinal.module.css';
import pstyles from '@/styles/medulaPractica.module.css';

const SpinalCordScene = dynamic(() => import('./SpinalCordScene'), {
  ssr: false,
  loading: () => (
    <div className={styles.stageEstado} role="status">
      <span className={styles.spinner} aria-hidden />
      Cargando modelo 3D…
    </div>
  ),
});

const STORAGE_KEY = 'medula-espinal-prefs';
const MODOS_VALIDOS = new Set<ViewMode>(['completa', 'corte', 'tractos', 'meninges', 'clinico']);

function loadPrefs(): { mode: ViewMode; level: LevelId } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    const mode = MODOS_VALIDOS.has(p.mode) ? p.mode as ViewMode : 'completa';
    const level = (p.level in LEVELS ? p.level : 'cervical') as LevelId;
    return { mode, level };
  } catch {
    return null;
  }
}

function savePrefs(mode: ViewMode, level: LevelId) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, level })); } catch { /* ignore */ }
}

/** Lo que el puntero señala en el modelo o en la lista. */
export type Senalado =
  | { kind: 'lamina'; id: LaminaGroupId }
  | { kind: 'tract'; id: TractId }
  | { kind: 'region'; id: LevelId }
  | null;

/**
 * Selector de vista flotante arriba a la izquierda del modelo, como las vistas
 * del atlas 3D. En la práctica ninguna queda marcada: tocar una sale de ella.
 */
function VistasEscena({ mode, onMode, practicando }: {
  mode: ViewMode;
  onMode: (m: ViewMode) => void;
  practicando: boolean;
}) {
  return (
    <div className={styles.vistas} role="group" aria-label="Vista">
      {MODES.map(({ key, label, desc }) => {
        const activa = !practicando && mode === key;
        return (
          <button
            key={key}
            type="button"
            title={desc}
            aria-pressed={activa}
            className={activa ? styles.vistaActiva : styles.vista}
            onClick={() => onMode(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Menú de la vista (☰ en la esquina del lienzo): restablecer la cámara y
 * mostrar u ocultar las etiquetas. Se cierra con Esc o con un clic fuera.
 */
function MenuVista({ etiquetas, onEtiquetas, onRestablecer }: {
  etiquetas: boolean;
  onEtiquetas: () => void;
  onRestablecer: () => void;
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
              {/* Volver a centrar: flecha circular de trazo fino */}
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

function hayWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function SpinalCordSimulator() {
  // El servidor pinta los valores por defecto; las preferencias se leen al
  // montar para no desajustar la hidratación.
  const [mode, setMode] = useState<ViewMode>('completa');
  const [level, setLevel] = useState<LevelId>('cervical');
  const [selectedLamina, setSelectedLamina] = useState<LaminaGroupId | null>(null);
  const [selectedTract, setSelectedTract] = useState<TractId | null>(null);
  const [selectedSyndrome, setSelectedSyndrome] = useState<SyndromeId | null>(null);
  const [showAllLaminae, setShowAllLaminae] = useState(false);
  const [showDura, setShowDura] = useState(false);
  const [showRoots, setShowRoots] = useState(true);
  // Las etiquetas empiezan apagadas: se encienden desde el menú ☰ si se quieren.
  const [showEtiquetas, setShowEtiquetas] = useState(false);
  const [meningesVisible, setMeningesVisible] = useState<Record<MeningeId, boolean>>({
    piamadre: true,
    aracnoides: true,
    duramadre: true,
  });
  const [senalado, setSenalado] = useState<Senalado>(null);
  const [selectedNucleo, setSelectedNucleo] = useState<string | null>(null);
  const [reinicio, setReinicio] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [tactil, setTactil] = useState(false);
  const [reducido, setReducido] = useState(false);
  const [practicando, setPracticando] = useState(false);
  const pr = usePractica(practicando, reducido);

  useEffect(() => {
    const p = loadPrefs();
    if (p) { setMode(p.mode); setLevel(p.level); }
    setWebgl(hayWebGL());
    setTactil(window.matchMedia?.('(pointer: coarse)').matches ?? false);
    setReducido(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  }, []);

  const entrarPractica = useCallback(() => {
    setSelectedLamina(null);
    setSelectedTract(null);
    setSelectedSyndrome(null);
    setSelectedNucleo(null);
    setSenalado(null);
    setPracticando(true);
    setReinicio((n) => n + 1);
  }, []);
  const salirPractica = useCallback(() => {
    setPracticando(false);
    setSenalado(null);
    setReinicio((n) => n + 1);
  }, []);

  // ── Callbacks ──
  const switchMode = useCallback((m: ViewMode) => {
    setMode(m);
    setSelectedLamina(null);
    setSelectedTract(null);
    setSelectedSyndrome(null);
    setShowAllLaminae(false);
    setSenalado(null);
    setSelectedNucleo(null);
    savePrefs(m, level);
  }, [level]);

  const selectLevel = useCallback((l: LevelId) => {
    setLevel(l);
    setSelectedTract(null);
    setSenalado(null);
    setSelectedNucleo(null);
    savePrefs(mode, l);
  }, [mode]);

  const toggleMeninge = useCallback((id: MeningeId) => {
    setMeningesVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAllLaminae = useCallback(() => {
    setShowAllLaminae((prev) => !prev);
    if (showAllLaminae) setSelectedLamina(null);
  }, [showAllLaminae]);

  const deseleccionar = useCallback(() => {
    setSelectedLamina(null);
    setSelectedTract(null);
  }, []);

  // ── Derived scene state ──
  const syn = selectedSyndrome ? SYNDROMES[selectedSyndrome] : null;

  const highlightTracts = useMemo(() => {
    const s = new Set<TractId>();
    if (syn) syn.tracts.forEach((t) => s.add(t));
    return s;
  }, [syn]);

  const highlightLaminae = useMemo(() => {
    const s = new Set<LaminaGroupId>();
    if (syn) syn.laminae.forEach((l) => s.add(l));
    return s;
  }, [syn]);

  const highlightSide = syn?.side ?? null;

  // Núcleo elegido en la ficha de la región → tramo de médula que se ilumina.
  const nucleo = selectedNucleo ? LEVELS[level].nuclei.find((n) => n.name === selectedNucleo) ?? null : null;
  const rango = nucleo ? rangoNucleo(nucleo) : null;
  const claveLuz = mode === 'completa' && rango ? `${rango[0]}|${rango[1]}` : null;
  const luz = useMemo(() => {
    if (!claveLuz) return null;
    const [desde, hasta] = claveLuz.split('|');
    return tramoSegmentos(desde, hasta);
  }, [claveLuz]);

  const showTracts = mode === 'tractos' || mode === 'clinico';
  const showLaminae = mode === 'corte' && (showAllLaminae || selectedLamina !== null);
  const showMeninges = mode === 'meninges';

  // ── Rótulo del lienzo: lo señalado manda; si no, lo elegido ──
  const rotulo = useMemo(() => {
    if (practicando) return null; // el nombre delataría la respuesta
    const desde: Senalado = senalado
      ?? (selectedTract ? { kind: 'tract', id: selectedTract }
        : selectedLamina ? { kind: 'lamina', id: selectedLamina }
          : null);
    if (desde?.kind === 'lamina') {
      const g = LAMINA_GROUPS[desde.id];
      return { color: g.color, titulo: g.name, sub: g.laminae.map((l) => l.name).join(' · ') };
    }
    if (desde?.kind === 'tract') {
      const t = TRACTS[desde.id];
      return {
        color: t.color,
        titulo: t.name,
        sub: `${t.direction === 'ascendente' ? '↑ Ascendente' : '↓ Descendente'} · ${t.group}`,
      };
    }
    if (desde?.kind === 'region') {
      const r = REGIONS.find((x) => x.id === desde.id)!;
      return { color: r.color, titulo: `Región ${r.label.toLowerCase()} · ${r.segments}`, sub: r.feature ?? 'Clic para ver su corte' };
    }
    if (mode === 'completa' && nucleo && rango) {
      return { color: '#f2b631', titulo: nucleo.name, sub: `Tramo iluminado: ${rango[0]} a ${rango[1]}` };
    }
    if (mode === 'clinico' && syn) {
      const lado = syn.side === 'right' ? 'Sombreado violeta: lado de la lesión'
        : syn.side === 'center' ? 'Mancha violeta: lesión central'
          : 'Daño del centro hacia la periferia';
      return { color: '#7c5cd6', titulo: syn.name, sub: lado };
    }
    return null;
  }, [practicando, senalado, selectedTract, selectedLamina, mode, syn, nucleo, rango]);

  // ── Anuncio para lector de pantalla ──
  const anuncio = useMemo(() => {
    const vista = MODES.find((m) => m.key === mode)?.label ?? '';
    const partes = [`Vista ${vista}`, `nivel ${LEVELS[level].name}`];
    if (selectedLamina) partes.push(`seleccionado: ${LAMINA_GROUPS[selectedLamina].name}`);
    if (selectedTract) partes.push(`seleccionado: ${TRACTS[selectedTract].name}`);
    if (syn) partes.push(`síndrome: ${syn.name}`);
    if (nucleo && rango) partes.push(`iluminado: ${nucleo.name}, de ${rango[0]} a ${rango[1]}`);
    return partes.join(', ') + '.';
  }, [mode, level, selectedLamina, selectedTract, syn, nucleo, rango]);

  // En la práctica, la escena la decide la pregunta en curso.
  const esc = practicando ? pr.escena : null;
  const vistaPr = esc?.vista ?? 'laminas';
  const escMode: ViewMode = practicando ? (vistaPr === 'tractos' ? 'tractos' : 'corte') : mode;
  const escLevel: LevelId = esc?.nivel ?? level;
  const sinMarcas = useMemo(() => ({ ok: new Set<string>(), mal: new Set<string>() }), []);
  const vacioT = useMemo(() => new Set<TractId>(), []);
  const vacioL = useMemo(() => new Set<LaminaGroupId>(), []);

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
            <SpinalCordScene
              mode={escMode}
              level={escLevel}
              showTracts={practicando ? vistaPr === 'tractos' : showTracts}
              showLaminae={practicando ? false : showLaminae}
              selectedLamina={practicando ? null : selectedLamina}
              selectedTract={practicando ? null : selectedTract}
              highlightTracts={practicando ? vacioT : highlightTracts}
              highlightLaminae={practicando ? vacioL : highlightLaminae}
              highlightSide={practicando ? null : highlightSide}
              practica={practicando ? esc ?? sinMarcas : null}
              senalado={senalado}
              meningesVisible={meningesVisible}
              showMeninges={showMeninges}
              showDura={showDura}
              showRoots={showRoots}
              showEtiquetas={showEtiquetas}
              reinicio={reinicio}
              luz={luz}
              onClickLamina={practicando
                ? (esc?.interactivo && vistaPr === 'laminas' ? pr.responderSenalar : undefined)
                : mode === 'corte' ? (id) => setSelectedLamina((prev) => prev === id ? null : id) : undefined}
              onClickTract={practicando
                ? (esc?.interactivo && vistaPr === 'tractos' ? pr.responderSenalar : undefined)
                : mode === 'tractos' ? (id) => setSelectedTract((prev) => prev === id ? null : id) : undefined}
              onSenalar={setSenalado}
              onSelectRegion={selectLevel}
              onDeseleccionar={deseleccionar}
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

          {practicando && pr.fase === 'jugando' && <TarjetaPractica pr={pr} />}

          {/* Al entrar: el mismo mazo barajándose que el examen del miembro superior */}
          {practicando && pr.fase === 'cargando' && (
            <div className={pstyles.veloCarga}>
              <div className={pstyles.cargando} role="status" aria-live="polite">
                <div className={pstyles.cargandoMazo} aria-hidden>
                  <span /><span /><span />
                </div>
                <p>Preparando tu práctica…</p>
              </div>
            </div>
          )}

          {/* Practicar: mismo diseño que «Iniciar examen» del atlas 3D, con un
              sacudón cada pocos segundos para que se note. En la práctica, el
              mismo sitio sirve para salir. */}
          <button
            type="button"
            className={`${styles.practicarBtn} ${practicando ? styles.practicarSalir : styles.practicarAviso}`}
            onClick={practicando ? salirPractica : entrarPractica}
            title={practicando ? 'Volver al modelo' : 'Preguntas de corte, tractos y casos clínicos'}
          >
            {!practicando && (
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 4h6M10 4v3M14 4v3M6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="m9 14 2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {practicando ? 'Salir' : 'Practicar'}
          </button>

          <MenuVista
            etiquetas={showEtiquetas}
            onEtiquetas={() => setShowEtiquetas((v) => !v)}
            onRestablecer={() => setReinicio((n) => n + 1)}
          />

          <VistasEscena
            mode={mode}
            practicando={practicando}
            onMode={(m) => { if (practicando) salirPractica(); switchMode(m); }}
          />

          <span className={styles.zoomHint}>{ayudaGestos}</span>
        </div>

        {practicando ? (
          <PanelPractica pr={pr} onSalir={salirPractica} />
        ) : (
        <ControlsPanel
          mode={mode}
          level={level}
          onSelectLevel={selectLevel}
          selectedLamina={selectedLamina}
          selectedTract={selectedTract}
          selectedSyndrome={selectedSyndrome}
          meningesVisible={meningesVisible}
          showAllLaminae={showAllLaminae}
          showDura={showDura}
          showRoots={showRoots}
          onSwitchMode={switchMode}
          selectedNucleo={selectedNucleo}
          onSelectNucleo={setSelectedNucleo}
          onSelectLamina={(id) => setSelectedLamina(id)}
          onSelectTract={(id) => setSelectedTract(id)}
          onSelectSyndrome={(id) => setSelectedSyndrome((prev) => prev === id ? null : id)}
          onToggleMeninge={toggleMeninge}
          onToggleAllLaminae={toggleAllLaminae}
          onToggleDura={() => setShowDura((v) => !v)}
          onToggleRoots={() => setShowRoots((v) => !v)}
          onSenalar={setSenalado}
        />
        )}
    </div>
  );
}
