'use client';
// Orquestador del lab «Tronco encefálico 3D»: estado, escena y barra lateral,
// con la arquitectura de Médula Espinal 3D y Polígono de Willis 3D (modelo a
// toda altura, vista flotante arriba a la izquierda, ☰ arriba a la derecha y
// barra lateral de 420 px).
//
// La cara posterior: en el encéfalo entero el cerebelo la tapa por completo.
// En el cadáver se ve cortando los tres pedúnculos cerebelosos y levantando el
// cerebelo (con el techo del IV ventrículo): queda la fosa romboidea. Aquí se
// hace igual, sin perder la relación: el cerebelo se puede dejar en su sitio,
// volver de cristal o retirar (se aparta y deja las caras de corte de los
// pedúnculos a la vista).

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import ControlsPanel, { MODOS } from './ControlsPanel';
import { estructuraDe, esCorte, GRUPOS } from './engine/anatomia';
import { NERVIO } from './engine/nervios';
import { INTERIOR, COLUMNAS, type ParId } from './engine/interior';
import { SINDROME } from './engine/clinica';
import { NIVEL } from './engine/cortes';
import styles from '@/styles/medulaEspinal.module.css';
import ws from '@/styles/poligonoWillis.module.css';

const TroncoScene = dynamic(() => import('./TroncoScene'), {
  ssr: false,
  loading: () => (
    <div className={styles.stageEstado} role="status">
      <span className={styles.spinner} aria-hidden />
      Cargando modelo 3D…
    </div>
  ),
});

export type Modo = 'anatomia' | 'nervios' | 'nucleos' | 'cortes' | 'clinico';
export type EstadoCerebelo = 'retirado' | 'translucido' | 'sitio';
export type Vista = 'anterior' | 'lateral' | 'posterior' | 'superior';

/** Lo que se elige o se señala en el modelo o en la lista. */
export type Elegido =
  | { kind: 'estructura'; id: string }
  | { kind: 'nervio'; id: ParId; lado: 'i' | 'd' }
  | { kind: 'interior'; id: string; lado: 'i' | 'd' }
  | null;

const CLAVE = 'tronco-encefalico-prefs';
const MODOS_VALIDOS = new Set<Modo>(['anatomia', 'nervios', 'nucleos', 'cortes', 'clinico']);

function leerPrefs(): { modo: Modo; cerebelo: EstadoCerebelo } | null {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
    if (!p) return null;
    return {
      modo: MODOS_VALIDOS.has(p.modo) ? p.modo : 'anatomia',
      cerebelo: ['retirado', 'translucido', 'sitio'].includes(p.cerebelo) ? p.cerebelo : 'retirado',
    };
  } catch {
    return null;
  }
}
function guardarPrefs(modo: Modo, cerebelo: EstadoCerebelo) {
  try { localStorage.setItem(CLAVE, JSON.stringify({ modo, cerebelo })); } catch { /* sin almacenamiento */ }
}

function hayWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const LADO = { i: 'izquierdo', d: 'derecho' } as const;

/** Rótulo del lienzo: nombre y una línea de contexto. */
function rotuloDe(e: Elegido): { color: string; titulo: string; sub: string } | null {
  if (!e) return null;
  if (e.kind === 'estructura') {
    const est = estructuraDe(e.id);
    if (!est) return null;
    const g = GRUPOS.find((x) => x.id === est.grupo)!;
    return {
      color: g.color,
      titulo: est.nombre,
      sub: esCorte(e.id) ? 'Superficie de corte (disección)' : g.nombre,
    };
  }
  if (e.kind === 'nervio') {
    const n = NERVIO[e.id];
    return { color: n.color, titulo: `${n.id} · ${n.nombre}`, sub: `${n.tipo} · lado ${LADO[e.lado]}` };
  }
  const x = INTERIOR[e.id];
  if (!x) return null;
  const tipo = x.columna ? COLUMNAS[x.columna].nombre : x.tipo === 'via' ? 'Vía' : x.tipo === 'fibras' ? 'Fibras de un par' : 'Núcleo';
  return { color: x.color, titulo: x.nombre, sub: x.impar ? tipo : `${tipo} · lado ${LADO[e.lado]}` };
}

/** Selector de vista flotante arriba a la izquierda (como el atlas 3D). */
function VistasEscena({ modo, onModo }: { modo: Modo; onModo: (m: Modo) => void }) {
  return (
    <div className={styles.vistas} role="group" aria-label="Vista">
      {MODOS.map(({ key, label, desc }) => (
        <button
          key={key}
          type="button"
          title={desc}
          aria-pressed={modo === key}
          className={modo === key ? styles.vistaActiva : styles.vista}
          onClick={() => onModo(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const CEREBELO: Array<{ key: EstadoCerebelo; label: string; desc: string }> = [
  { key: 'retirado', label: 'Sin cerebelo', desc: 'Pedúnculos cortados: se ve la fosa romboidea (IV ventrículo)' },
  { key: 'translucido', label: 'Cristal', desc: 'El cerebelo transparente, en su sitio' },
  { key: 'sitio', label: 'Con cerebelo', desc: 'El cerebelo en su sitio: tapa la cara posterior' },
];

/** Menú ☰: restablecer la vista y etiquetas. */
function MenuVista({ etiquetas, onEtiquetas, onRestablecer }: { etiquetas: boolean; onEtiquetas: () => void; onRestablecer: () => void }) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (caja.current && !caja.current.contains(e.target as Node)) setAbierto(false); };
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierto(false); boton.current?.focus(); } };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => { document.removeEventListener('pointerdown', fuera); document.removeEventListener('keydown', tecla); };
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
          <button type="button" role="menuitem" className={styles.menuItem} onClick={() => { onRestablecer(); setAbierto(false); }}>
            <span className={styles.menuIcono} aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
                <path d="M4 4.5v4h4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" />
              </svg>
            </span>
            Restablecer vista
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked={etiquetas} className={styles.menuItem} onClick={onEtiquetas}>
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

export default function TroncoSimulator() {
  const [modo, setModo] = useState<Modo>('anatomia');
  const [cerebelo, setCerebelo] = useState<EstadoCerebelo>('retirado');
  const [vista, setVista] = useState<{ cual: Vista; n: number }>({ cual: 'anterior', n: 0 });
  const [elegido, setElegido] = useState<Elegido>(null);
  const [senalado, setSenalado] = useState<Elegido>(null);
  const [nivel, setNivel] = useState('pue_inf');
  const [sindrome, setSindrome] = useState<string | null>(null);
  const [signo, setSigno] = useState<string | null>(null);
  const [mostrarNervios, setMostrarNervios] = useState(true);
  const [mostrarVias, setMostrarVias] = useState(true);
  const [etiquetas, setEtiquetas] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [tactil, setTactil] = useState(false);
  const [oscuro, setOscuro] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const p = leerPrefs();
    if (p) {
      setModo(p.modo);
      setCerebelo(p.cerebelo);
      if (p.modo === 'nucleos') setVista({ cual: 'posterior', n: 1 });
    }
    setWebgl(hayWebGL());
    setTactil(window.matchMedia?.('(pointer: coarse)').matches ?? false);
    // El tema lo pone la app en <body>; se sigue en vivo para los colores del 3D.
    const leer = () => setOscuro(document.body.classList.contains('dark-mode'));
    leer();
    const obs = new MutationObserver(leer);
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const cambiarModo = useCallback((m: Modo) => {
    setModo(m);
    setElegido(null);
    setSenalado(null);
    setSigno(null);
    // Los núcleos se leen mejor por detrás, como en Gray 696: motores en la
    // línea media y sensitivos por fuera, bajo el suelo del IV ventrículo.
    if (m === 'nucleos') setVista((v) => ({ cual: 'posterior', n: v.n + 1 }));
    guardarPrefs(m, cerebelo);
  }, [cerebelo]);

  const cambiarCerebelo = useCallback((c: EstadoCerebelo) => {
    setCerebelo(c);
    guardarPrefs(modo, c);
    // Con el cerebelo puesto, lo de la cara posterior queda tapado.
    if (c === 'sitio' && elegido?.kind === 'estructura') {
      const est = estructuraDe(elegido.id);
      if (est && (est.grupo === 'ventriculo' || esCorte(elegido.id))) setElegido(null);
    }
  }, [modo, elegido]);

  const elegir = useCallback((e: Elegido) => {
    setElegido((prev) => (prev && e && prev.kind === e.kind && prev.id === e.id && ('lado' in prev ? prev.lado === (e as { lado?: string }).lado : true) ? null : e));
  }, []);

  /** Desde otra ficha: abre la de una estructura interior en la vista que la muestra. */
  const verInterior = useCallback((id: string) => {
    setModo('nucleos');
    setElegido({ kind: 'interior', id, lado: 'i' });
    guardarPrefs('nucleos', cerebelo);
  }, [cerebelo]);
  const verNervio = useCallback((id: ParId) => {
    setModo('nervios');
    setElegido({ kind: 'nervio', id, lado: 'i' });
    guardarPrefs('nervios', cerebelo);
  }, [cerebelo]);

  const sin = sindrome ? SINDROME[sindrome] : null;
  const onListo = useCallback(() => setListo(true), []);

  // Rótulo: lo señalado manda; si no, lo elegido; si no, el contexto de la vista.
  const rotulo = useMemo(() => {
    const r = rotuloDe(senalado) ?? rotuloDe(elegido);
    if (r) return r;
    if (modo === 'clinico' && sin) {
      return { color: '#7c5cd6', titulo: sin.nombre, sub: sin.medial ? 'Violeta: la lesión (línea media)' : 'Violeta: la lesión, del lado izquierdo' };
    }
    if (modo === 'cortes') {
      const n = NIVEL[nivel];
      return { color: '#3b9edd', titulo: n.nombre, sub: 'Toca una estructura del corte' };
    }
    return null;
  }, [senalado, elegido, modo, sin, nivel]);

  const anuncio = useMemo(() => {
    const partes = [`Vista ${MODOS.find((m) => m.key === modo)?.label ?? ''}`];
    const r = rotuloDe(elegido);
    if (r) partes.push(`seleccionado: ${r.titulo}`);
    if (modo === 'clinico' && sin) partes.push(`síndrome: ${sin.nombre}`);
    if (modo === 'cortes') partes.push(`corte: ${NIVEL[nivel].nombre}`);
    if (modo === 'anatomia' || modo === 'nervios') partes.push(`cerebelo: ${CEREBELO.find((c) => c.key === cerebelo)?.label}`);
    return partes.join(', ') + '.';
  }, [modo, elegido, sin, nivel, cerebelo]);

  const ayuda = tactil ? 'Arrastra para girar · pellizca para acercar' : 'Arrastra para girar · rueda para acercar';
  const conCerebelo = modo === 'anatomia' || modo === 'nervios';

  return (
    <div className={styles.lab}>
      <p className={styles.srOnly} aria-live="polite">{anuncio}</p>
      <div className={styles.escenario}>
        {webgl === false ? (
          <div className={styles.stageEstado} role="alert">
            <strong>Tu navegador no puede mostrar el modelo 3D.</strong>
            <span>Activa la aceleración por hardware o abre el laboratorio en Chrome, Edge o Firefox actualizados. Mientras tanto, las fichas del panel siguen disponibles.</span>
          </div>
        ) : (
          <>
            <TroncoScene
              modo={modo}
              cerebelo={cerebelo}
              vista={vista}
              elegido={elegido}
              senalado={senalado}
              nivel={nivel}
              sindrome={sin}
              signo={signo}
              mostrarNervios={mostrarNervios}
              mostrarVias={mostrarVias}
              etiquetas={etiquetas}
              ligero={tactil}
              oscuro={oscuro}
              onElegir={elegir}
              onSenalar={setSenalado}
              onDeseleccionar={() => setElegido(null)}
              onListo={onListo}
            />
            {!listo && (
              <div className={styles.stageEstado} role="status">
                <span className={styles.spinner} aria-hidden />
                Modelando el tronco…
              </div>
            )}
          </>
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
          onRestablecer={() => setVista((v) => ({ cual: modo === 'cortes' ? 'superior' : v.cual, n: v.n + 1 }))}
        />

        <VistasEscena modo={modo} onModo={cambiarModo} />

        {/* Cerebelo: abajo a la izquierda, como la postura de Willis. */}
        {conCerebelo && (
          <div className={ws.piso}>
            <div className={`${ws.postura} ${ws.enFila}`} role="group" aria-label="Cerebelo">
              {CEREBELO.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  title={c.desc}
                  aria-pressed={cerebelo === c.key}
                  className={cerebelo === c.key ? ws.posturaActiva : ws.posturaBtn}
                  onClick={() => cambiarCerebelo(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <span className={styles.zoomHint}>{ayuda}</span>
      </div>

      <ControlsPanel
        modo={modo}
        vista={vista.cual}
        onVista={(v) => setVista((x) => ({ cual: v, n: x.n + 1 }))}
        cerebelo={cerebelo}
        onCerebelo={cambiarCerebelo}
        elegido={elegido}
        onElegir={setElegido}
        onSenalar={setSenalado}
        nivel={nivel}
        onNivel={(n) => { setNivel(n); setElegido(null); }}
        sindrome={sindrome}
        onSindrome={(s) => {
          setSindrome(s);
          setSigno(null);
          // Gira hacia el lado desde el que mejor se ve la lesión.
          if (s) setVista((v) => ({ cual: SINDROME[s].vista, n: v.n + 1 }));
        }}
        onSigno={setSigno}
        mostrarNervios={mostrarNervios}
        onMostrarNervios={() => setMostrarNervios((v) => !v)}
        mostrarVias={mostrarVias}
        onMostrarVias={() => setMostrarVias((v) => !v)}
        onVerInterior={verInterior}
        onVerNervio={verNervio}
      />
    </div>
  );
}
