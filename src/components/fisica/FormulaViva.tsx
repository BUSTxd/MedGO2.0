'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CalculoId, FormulaVivaCfg, VariableViva } from '@/lib/data/fisica-modulos/types';
import FormulaViz from './FormulaViz';
import styles from '@/styles/formulaViva.module.css';

/**
 * Fórmula manipulable: el alumno arrastra cada símbolo y ve el resultado
 * recalcularse en vivo, además de la expresión con los números sustituidos.
 *
 * Va en la fase «entender» y no en la simulación a propósito: aquí se aísla
 * UNA dependencia (¿de qué depende T?) sin el ruido de una escena animada.
 */

/**
 * Registro de cálculos. Vive en el cliente y se referencia por clave desde el
 * archivo de datos — una función no sobrevive al paso de Server a Client
 * Component.
 */
/**
 * Alto de la escena en el layout de dos columnas.
 *
 * Sólo un poco más que los 152 px del apilado antiguo, y no el doble: los
 * dibujantes escalan con el ANCHO (`escala = (w * 0.38) / 0.4`) y se limitan a
 * centrarse en `h / 2`, así que subir el alto no agranda el modelo — sólo le
 * mete aire vacío. Lo que de verdad lo hace grande es que su columna sea la
 * ancha del grid.
 */
const ALTO_MODELO = 190;

const CALCULOS: Record<CalculoId, (v: Record<string, number>) => number> = {
  'fuerza-resorte':   (v) => -v.k * v.x,
  'periodo-resorte':  (v) => 2 * Math.PI * Math.sqrt(v.m / v.k),
  'energia-resorte':  (v) => 0.5 * v.k * v.A * v.A,
  'periodo-pendulo':  (v) => 2 * Math.PI * Math.sqrt(v.L / v.g),
  'velocidad-onda':   (v) => v.lambda * v.f,
  /**
   * Frecuencia mínima para resolver un detalle de tamaño `d`: hace falta que la
   * longitud de onda quepa en él (λ ≤ d), y de v = λf sale f = v / d.
   *
   * `d` entra en MILÍMETROS y el resultado sale en MEGAHERCIOS — así el alumno
   * mueve el control en la unidad en la que se enuncian los detalles anatómicos
   * y lee la respuesta en la que vienen rotuladas las sondas de ecografía, sin
   * un 6 160 000 Hz por medio. De ahí el /1000 (mm→m) y el /1e6 (Hz→MHz), que
   * juntos son exactamente dividir entre 1000.
   */
  'frecuencia-resolucion': (v) => v.v / (v.d * 1000),
  'nivel-db':         (v) => 10 * Math.log10(v.veces),

  /* ─── C7 · Temperatura y calor ─────────────────────────────────────────────
     Las constantes fisiológicas van escritas aquí y no como variable del
     alumno: son propiedades del tejido, no cosas que él elija. Cada una está
     citada en el bloque de lógica de su sección. */

  /** °C → °F. La que se usa de verdad al leer literatura o un termómetro. */
  'escala-fahrenheit': (v) => (9 / 5) * v.tc + 32,

  /**
   * Calor sensible Q = m·c·ΔT, en kJ. `c` del cuerpo humano = 3470 J/(kg·°C):
   * más bajo que el del agua pura (4186) porque no somos sólo agua.
   */
  'calor-sensible': (v) => (v.m * 3470 * v.dt) / 1000,

  /**
   * Calor latente Q = m·L, en kJ. L de vaporización del sudor a temperatura de
   * piel ≈ 2430 kJ/kg — el sudor se evapora a ~33 °C, no a 100 °C, así que no
   * vale el 2260 de la tabla del agua hirviendo.
   */
  'calor-latente': (v) => v.magua * 2430,

  /**
   * Conducción H = k·A·ΔT/L, en W. k de la grasa subcutánea = 0,20 W/(m·°C) y
   * A = 1,8 m² de superficie corporal. El espesor entra en MILÍMETROS, que es
   * como se mide un pliegue cutáneo, de ahí el /1000.
   */
  'conduccion': (v) => (0.2 * 1.8 * v.dt) / (v.l / 1000),
};

export default function FormulaViva({ cfg, acento }: { cfg: FormulaVivaCfg; acento: string }) {
  const [valores, setValores] = useState<Record<string, number>>(() =>
    Object.fromEntries(cfg.variables.map((v) => [v.id, v.inicial])),
  );

  // Cambiar de sección reutiliza el componente: hay que resembrar los valores
  // o la fórmula de la sección nueva aparece con los números de la anterior.
  useEffect(() => {
    setValores(Object.fromEntries(cfg.variables.map((v) => [v.id, v.inicial])));
  }, [cfg]);

  const resultado = CALCULOS[cfg.calculo](valores);
  const { min, max, decimales = 2 } = cfg.resultado;
  const fraccion = Math.min(Math.max((resultado - min) / (max - min), 0), 1);

  // En escala log el valor crudo puede tener 15 cifras: dentro de la expresión
  // sustituida eso desborda la línea, así que ahí va en notación científica.
  const fmt = (v: VariableViva) =>
    v.escala === 'log' && valores[v.id] >= 1000
      ? notacionCientifica(valores[v.id])
      : valores[v.id].toFixed(v.decimales ?? 1);

  // Expresión con los números dentro: `{m}` → 1.0, `{=}` → el resultado.
  const sustituida = cfg.variables
    .reduce((s, v) => s.replaceAll(`{${v.id}}`, fmt(v)), cfg.sustituida)
    .replaceAll('{=}', resultado.toFixed(decimales));

  return (
    <div className={styles.viva} style={{ ['--acc' as string]: acento }}>
      <div className={styles.vivaHead}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M8 6h8M12 6v12M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 12h3M18 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Arrastra las barras y mira la escena
      </div>

      {/* Dos columnas: el MODELO manda a la izquierda y a su derecha va lo que
          lo gobierna — primero la fórmula con los números dentro, después las
          perillas que los mueven. El orden del DOM es el orden visual, así que
          el tabulador recorre la columna derecha de arriba abajo. Bajo 900px el
          grid colapsa a una sola columna y queda el apilado de siempre. */}
      <div className={styles.vivaGrid}>
        <div className={styles.vivaModelo}>
          <FormulaViz
            viz={cfg.viz}
            valores={valores}
            resultado={resultado}
            acento={acento}
            alto={ALTO_MODELO}
          />
        </div>

        <div className={styles.vivaPanel}>
          <p className={styles.sustituida}>{sustituida}</p>

          <div className={styles.resultadoCaja}>
            <div className={styles.resultadoFila}>
              <span className={styles.resultadoSimbolo}>{cfg.resultado.simbolo}</span>
              <span className={styles.resultadoValor}>
                {resultado.toFixed(decimales)}
                <span>{cfg.resultado.unidad}</span>
              </span>
            </div>
            <div className={styles.resultadoBarra}>
              <div className={styles.resultadoRelleno} style={{ width: `${fraccion * 100}%` }} />
            </div>
          </div>

          <div className={styles.perillas}>
            {cfg.variables.map((v) => (
              <Perilla
                key={v.id}
                variable={v}
                valor={valores[v.id]}
                onChange={(nuevo) => setValores((s) => ({ ...s, [v.id]: nuevo }))}
              />
            ))}
          </div>
        </div>
      </div>

      <p className={styles.observa}>{cfg.observa}</p>
    </div>
  );
}

const SUPERINDICES = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * `1.2e+8` → `1,2×10⁸`. Se escribe a mano porque `toExponential` da la forma
 * con `e+` y aquí la cifra es contenido de estudio, no un log de depuración.
 */
function notacionCientifica(n: number): string {
  const exp = Math.floor(Math.log10(n));
  const mant = n / Math.pow(10, exp);
  const sup = String(exp)
    .split('')
    .map((d) => SUPERINDICES[Number(d)] ?? d)
    .join('');
  const mantTxt = mant < 1.05 ? '10' : `${mant.toFixed(1).replace('.', ',')}×10`;
  return `${mantTxt}${sup}`;
}

/**
 * Barra grande de control. Es un `<div role="slider">` y no un `<input range>`
 * ni un `<button>`: el elemento entero es la superficie de arrastre, y un
 * botón nativo interferiría con el gesto (misma razón por la que `useDragDrop`
 * lo evita en los minijuegos de Investigación). Teclado y lector de pantalla
 * quedan cubiertos por el rol y las flechas.
 *
 * El arrastre es POSICIONAL, no relativo: donde tocas, ahí salta el valor. Con
 * una barra a ancho completo es lo que se espera —el relleno indica dónde
 * estás—, mientras que el desplazamiento relativo sólo tiene sentido en un
 * control pequeño que no representa su propio rango.
 */
function Perilla({
  variable: v,
  valor,
  onChange,
}: {
  variable: VariableViva;
  valor: number;
  onChange: (v: number) => void;
}) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const log = v.escala === 'log';
  // En escala log se opera sobre el exponente: así un rango de 10⁰ a 10¹⁴
  // reparte sus órdenes de magnitud a lo largo de la barra en vez de dejar el
  // 99 % del recorrido para el último salto.
  const aCrudo = useCallback((real: number) => (log ? Math.log10(real) : real), [log]);
  const aReal  = useCallback((crudo: number) => (log ? Math.pow(10, crudo) : crudo), [log]);

  const minC = aCrudo(v.min);
  const maxC = aCrudo(v.max);

  const aplicar = useCallback(
    (crudo: number) => {
      const acotado = Math.min(Math.max(crudo, minC), maxC);
      const real = aReal(acotado);
      // El paso se aplica sobre el valor real, no sobre el crudo: en log el
      // exponente no tiene una granularidad que le sirva al alumno.
      const cuantizado = log ? real : Math.round(real / v.paso) * v.paso;
      onChange(parseFloat(cuantizado.toPrecision(12)));
    },
    [minC, maxC, aReal, log, v.paso, onChange],
  );

  const desdeX = useCallback(
    (clientX: number) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const frac = (clientX - rect.left) / rect.width;
      aplicar(minC + frac * (maxC - minC));
    },
    [aplicar, minC, maxC],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    ref.current?.setPointerCapture(e.pointerId);
    setArrastrando(true);
    desdeX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (arrastrando) desdeX(e.clientX);
  };

  const soltar = (e: React.PointerEvent<HTMLDivElement>) => {
    ref.current?.releasePointerCapture(e.pointerId);
    setArrastrando(false);
  };

  const porTeclado = (e: React.KeyboardEvent) => {
    const salto = (maxC - minC) / 40;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   { e.preventDefault(); aplicar(aCrudo(valor) + salto); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown') { e.preventDefault(); aplicar(aCrudo(valor) - salto); }
    if (e.key === 'Home') { e.preventDefault(); aplicar(minC); }
    if (e.key === 'End')  { e.preventDefault(); aplicar(maxC); }
  };

  const fraccion = Math.min(Math.max((aCrudo(valor) - minC) / (maxC - minC), 0), 1);
  const fmtExtremo = (n: number) =>
    log && n >= 1000 ? notacionCientifica(n) : n.toFixed(v.decimales ?? 1);
  const mostrado = log && valor >= 1000
    ? notacionCientifica(valor)
    : valor.toFixed(v.decimales ?? 1);

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={v.simbolo}
      aria-valuenow={valor}
      aria-valuemin={v.min}
      aria-valuemax={v.max}
      aria-valuetext={`${mostrado} ${v.unidad ?? ''}`.trim()}
      className={`${styles.barra} ${arrastrando ? styles.barraActiva : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={soltar}
      onPointerCancel={soltar}
      onKeyDown={porTeclado}
    >
      <span className={styles.barraRelleno} style={{ width: `${fraccion * 100}%` }} />
      <span className={styles.barraTirador} style={{ left: `${fraccion * 100}%` }} />

      <span className={styles.barraContenido}>
        <span className={styles.barraSimbolo}>{v.simbolo}</span>
        <span className={styles.barraValor}>
          {mostrado}
          {v.unidad && <span className={styles.barraUnidad}>{v.unidad}</span>}
        </span>
      </span>

      <span className={styles.barraExtremos}>
        <span>{fmtExtremo(v.min)}</span>
        <span>{fmtExtremo(v.max)}</span>
      </span>
    </div>
  );
}
