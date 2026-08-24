'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SelectorPaleta, SimNota, type Reloj } from './SimShell';
import { CATALOGO, formatea, type CatalogoLab, type FormulaLab } from './formulas';
import type { SimId } from '@/lib/data/fisica-modulos/types';
import styles from '@/styles/fisicaSim.module.css';

/* ───────────────────────────────────────────────────────────────────────────
   Laboratorio virtual: la carcasa que comparten las cinco simulaciones.

   La escena queda a la IZQUIERDA y el panel de fórmulas a la DERECHA, con el
   mando —play/pausa, reinicio, velocidad y las perillas— en una franja discreta
   al pie. El orden no es estético: lo que se aprende aquí es que la fórmula y
   el dibujo son la misma cosa, y para eso tienen que verse a la vez. Apiladas
   (como estaban) el alumno leía la fórmula, bajaba a los sliders y ya no tenía
   la expresión delante mientras la movía.

   El panel se alimenta de DOS fuentes que se funden en una sola tabla:
   - `magnitudes`, valores derivados del estado de React (T, E, λ), que sólo
     cambian cuando alguien mueve una perilla;
   - `vivoRef`, magnitudes instantáneas que la escena escribe en cada frame
     (t, x, v). Éstas NO pueden pasar por estado de React: serían 60 renders
     por segundo del árbol entero. Se leen de la ref a ~11 Hz y sólo re-renderiza
     este panel, que son unas pocas decenas de nodos.
   ─────────────────────────────────────────────────────────────────────────── */

/** Cada cuánto se relee la ref de magnitudes instantáneas, en ms. */
const REFRESCO_VIVO = 90;

/* ─── Contexto del mando ──────────────────────────────────────────────────── */

interface MandoCtx {
  /** Última magnitud que el alumno tocó: se resalta dentro de la fórmula. */
  tocada: string | null;
  marcar: (id: string) => void;
}

const Mando = createContext<MandoCtx>({ tocada: null, marcar: () => {} });

/* ─── Carcasa ─────────────────────────────────────────────────────────────── */

export function LabShell({
  titulo,
  icono,
  acento,
  onAcento,
  sim,
  magnitudes,
  vivoRef,
  reloj,
  mando,
  nota,
  children,
}: {
  titulo: string;
  icono?: React.ReactNode;
  acento: string;
  onAcento: (c: string) => void;
  /** Con qué entrada del catálogo se llena el panel de fórmulas. */
  sim: SimId;
  /** Magnitudes derivadas del estado: cambian al mover una perilla. */
  magnitudes: Record<string, number>;
  /** Magnitudes instantáneas que la escena escribe en cada frame. */
  vivoRef?: React.MutableRefObject<Record<string, number>>;
  /** Sin reloj no se dibujan play/pausa/velocidad (escenas de estado estable). */
  reloj?: Reloj;
  /** Perillas y botones propios de la sim, dentro de la franja del mando. */
  mando: React.ReactNode;
  nota?: React.ReactNode;
  /** El `<canvas>` de la escena. */
  children: React.ReactNode;
}) {
  const [tocada, setTocada] = useState<string | null>(null);
  const borrar = useRef<ReturnType<typeof setTimeout> | null>(null);

  // El resaltado se apaga solo: es una señal de «esto es lo que acabas de
  // mover», no un estado permanente. Si se quedara encendido, al cabo de tres
  // perillas el alumno ya no sabría cuál mira.
  const marcar = useCallback((id: string) => {
    setTocada(id);
    if (borrar.current) clearTimeout(borrar.current);
    borrar.current = setTimeout(() => setTocada(null), 2600);
  }, []);

  useEffect(() => () => { if (borrar.current) clearTimeout(borrar.current); }, []);

  const ctx = useMemo<MandoCtx>(() => ({ tocada, marcar }), [tocada, marcar]);
  const catalogo = CATALOGO[sim];

  return (
    <Mando.Provider value={ctx}>
      <div className={styles.lab} style={{ ['--acc' as string]: acento }}>
        <div className={styles.labBar}>
          <span className={styles.labTitulo}>
            {icono}
            {titulo}
          </span>
          <span className={styles.labBarSpacer}>
            <SelectorPaleta valor={acento} onChange={onAcento} />
          </span>
        </div>

        <div className={styles.labGrid}>
          <div className={styles.labStage}>{children}</div>
          <PanelFormulas
            catalogo={catalogo}
            magnitudes={magnitudes}
            vivoRef={vivoRef}
            tocada={tocada}
          />
        </div>

        <div className={styles.labMando}>
          {reloj && <ControlesReloj reloj={reloj} />}
          <div className={styles.mandoPerillas}>{mando}</div>
        </div>

        {nota && <SimNota>{nota}</SimNota>}
      </div>
    </Mando.Provider>
  );
}

/* ─── Mando: reloj ────────────────────────────────────────────────────────── */

const VELOCIDADES = [0.5, 1, 2] as const;

function ControlesReloj({ reloj }: { reloj: Reloj }) {
  return (
    <div className={styles.reloj}>
      <button
        type="button"
        className={`${styles.relojBtn} ${styles.relojBtnPrimario}`}
        onClick={reloj.alternar}
        aria-label={reloj.corriendo ? 'Pausar' : 'Reanudar'}
        title={reloj.corriendo ? 'Pausar' : 'Reanudar'}
      >
        {reloj.corriendo ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="4" width="5" height="16" rx="1.4" />
            <rect x="14" y="4" width="5" height="16" rx="1.4" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4.5v15a1 1 0 0 0 1.54.84l11.2-7.5a1 1 0 0 0 0-1.68L8.54 3.66A1 1 0 0 0 7 4.5Z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        className={styles.relojBtn}
        onClick={reloj.reiniciar}
        aria-label="Reiniciar"
        title="Reiniciar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={styles.relojVel} role="group" aria-label="Velocidad de la simulación">
        {VELOCIDADES.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={reloj.velocidad === v}
            className={`${styles.relojVelBtn} ${
              reloj.velocidad === v ? styles.relojVelBtnActivo : ''
            }`}
            onClick={() => reloj.cambiarVelocidad(v)}
          >
            ×{String(v).replace('.', ',')}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Mando: perillas ─────────────────────────────────────────────────────── */

/**
 * Perilla del mando. Es un `<input type="range">` de verdad —no el `role=slider`
 * de `FormulaViva`— porque aquí la barra es fina y va en una franja apretada:
 * el arrastre posicional sobre una caja grande no tiene sentido a esta escala,
 * y el nativo da teclado y lector de pantalla sin escribirlos.
 *
 * `magnitud` es la clave del catálogo (`m`, `k`, `lambda`): al moverla, el
 * símbolo correspondiente se enciende dentro de la fórmula del panel. Ése es el
 * puente que ata el mando con el panel de fórmulas.
 */
export function LabSlider({
  label,
  magnitud,
  valor,
  display,
  min,
  max,
  paso,
  onChange,
}: {
  label: string;
  magnitud?: string;
  valor: number;
  display: string;
  min: number;
  max: number;
  paso: number;
  onChange: (v: number) => void;
}) {
  const { marcar } = useContext(Mando);
  return (
    <div className={styles.perilla}>
      <div className={styles.perillaHead}>
        <span className={styles.perillaLabel}>{label}</span>
        <span className={styles.perillaValor}>{display}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(e) => {
          if (magnitud) marcar(magnitud);
          onChange(parseFloat(e.target.value));
        }}
        aria-label={label}
      />
    </div>
  );
}

/** Fila de botones dentro del mando (modos, presets, interruptores). */
export function LabFila({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className={styles.mandoFila}>
      {label && <span className={styles.mandoFilaLabel}>{label}</span>}
      {children}
    </div>
  );
}

/* ─── Panel de fórmulas ───────────────────────────────────────────────────── */

function PanelFormulas({
  catalogo,
  magnitudes,
  vivoRef,
  tocada,
}: {
  catalogo: CatalogoLab;
  magnitudes: Record<string, number>;
  vivoRef?: React.MutableRefObject<Record<string, number>>;
  tocada: string | null;
}) {
  const [elegida, setElegida] = useState(catalogo.formulas[0].id);
  const vivo = useVivo(vivoRef);

  // Cambiar de sim reutiliza el componente: si la fórmula elegida no existe en
  // el catálogo nuevo, el detalle quedaría vacío.
  useEffect(() => {
    if (!catalogo.formulas.some((f) => f.id === elegida)) setElegida(catalogo.formulas[0].id);
  }, [catalogo, elegida]);

  const valores = useMemo(() => ({ ...magnitudes, ...vivo }), [magnitudes, vivo]);
  const formula =
    catalogo.formulas.find((f) => f.id === elegida) ?? catalogo.formulas[0];
  const metaSalida = catalogo.magnitudes[formula.salida];

  return (
    <aside className={styles.panel}>
      <p className={styles.panelRotulo}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M8 6h8M12 6v12M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Fórmulas del tema
      </p>

      <div className={styles.panelLista} role="tablist" aria-label="Fórmulas del tema">
        {catalogo.formulas.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={f.id === elegida}
            className={`${styles.panelItem} ${f.id === elegida ? styles.panelItemActivo : ''}`}
            onClick={() => setElegida(f.id)}
          >
            <span className={styles.panelItemNombre}>{f.nombre}</span>
            <span className={styles.panelItemExpr}>
              <Expresion formula={f} catalogo={catalogo} modo="simbolos" tocada={tocada} />
            </span>
          </button>
        ))}
      </div>

      <div className={styles.panelDetalle}>
        <p className={styles.panelDice}>{formula.dice}</p>

        <p className={styles.panelSustituida}>
          <Expresion formula={formula} catalogo={catalogo} modo="valores" valores={valores} tocada={tocada} />
        </p>

        <div className={styles.panelResultado}>
          <span className={styles.panelResultadoSimbolo}>{metaSalida?.simbolo ?? '='}</span>
          <span className={styles.panelResultadoValor}>
            {formatea(metaSalida, valores[formula.salida])}
            {metaSalida?.unidad && <span>{metaSalida.unidad}</span>}
          </span>
        </div>
      </div>

      <div className={styles.tablero}>
        {catalogo.tablero.map((id) => {
          const meta = catalogo.magnitudes[id];
          if (!meta) return null;
          return (
            <div
              key={id}
              className={`${styles.tableroCelda} ${
                id === formula.salida ? styles.tableroCeldaSalida : ''
              }`}
            >
              <span className={styles.tableroLabel}>
                <b>{meta.simbolo}</b> {meta.nombre}
              </span>
              <span className={styles.tableroValor}>
                {formatea(meta, valores[id])}
                {meta.unidad && <span>{meta.unidad}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/**
 * La expresión, pintada dos veces desde la MISMA plantilla: con símbolos en la
 * lista y con números en el detalle. Los huecos `{id}` se convierten en chips,
 * y el que corresponde a la perilla recién movida se enciende — que es la
 * conexión visual entre lo que el alumno toca abajo y lo que lee aquí.
 */
function Expresion({
  formula,
  catalogo,
  modo,
  valores,
  tocada,
}: {
  formula: FormulaLab;
  catalogo: CatalogoLab;
  modo: 'simbolos' | 'valores';
  valores?: Record<string, number>;
  tocada: string | null;
}) {
  const trozos = formula.plantilla.split(/(\{[A-Za-z0-9_]+\})/g);
  return (
    <>
      {trozos.map((trozo, i) => {
        const hueco = /^\{([A-Za-z0-9_]+)\}$/.exec(trozo);
        if (!hueco) return <span key={i}>{trozo}</span>;
        const id = hueco[1];
        const meta = catalogo.magnitudes[id];
        const texto =
          modo === 'simbolos' ? meta?.simbolo ?? id : formatea(meta, valores?.[id]);
        return (
          <span
            key={i}
            className={`${styles.simbolo} ${id === tocada ? styles.simboloTocado : ''}`}
          >
            {texto}
          </span>
        );
      })}
    </>
  );
}

/**
 * Lee las magnitudes instantáneas que la escena escribe en cada frame, a ~11 Hz
 * en vez de a 60: es la cadencia a la que un número de cinco cifras se sigue
 * leyendo. Si el objeto no cambió no se re-renderiza —una escena en pausa deja
 * de costar—, y la comparación es campo a campo porque la ref se reescribe
 * entera en cada frame y su identidad nunca sirve.
 */
function useVivo(vivoRef?: React.MutableRefObject<Record<string, number>>) {
  const [vivo, setVivo] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!vivoRef) return;
    const id = setInterval(() => {
      setVivo((previo) => {
        const actual = vivoRef.current;
        const clavesPrevias = Object.keys(previo);
        const igual =
          clavesPrevias.length === Object.keys(actual).length &&
          clavesPrevias.every((k) => previo[k] === actual[k]);
        return igual ? previo : { ...actual };
      });
    }, REFRESCO_VIVO);
    return () => clearInterval(id);
  }, [vivoRef]);

  return vivo;
}
