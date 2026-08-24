import type { SimId } from '@/lib/data/fisica-modulos/types';
import {
  PLANO, COLISION, ROTACIONAL, PALANCA, FLUIDOS, GAS,
  COULOMB, CAPACITOR, CIRCUITO, MAGNETICO, LENTE, FOTOELECTRICO,
} from './formulas-clases';

/* ───────────────────────────────────────────────────────────────────────────
   Catálogo de fórmulas del laboratorio.

   Es la mitad derecha de cada simulación: el alumno elige QUÉ fórmula quiere
   mirar y la ve resolverse con los valores que él mismo está moviendo. Por eso
   las fórmulas no son texto suelto sino PLANTILLAS con huecos —`{m}`, `{k}`—
   que se pintan dos veces: con los símbolos en la lista y con los números en
   el detalle. Una sola fuente para las dos vistas es lo que impide que la
   expresión y la sustitución se desincronicen al retocar una.

   ⚠️ Regla dura: cada fórmula tiene que ser EXACTAMENTE la que la simulación
   está resolviendo, con las mismas constantes. El valor que muestra el panel
   se calcula del estado real de la escena, no de la plantilla, así que una
   plantilla que no cuadre con el modelo se delataría sola — y sería justo el
   fallo que el laboratorio existe para evitar: una animación decorativa
   desconectada de los números.

   Todo va en unidades SI dentro de las plantillas, aunque el mando enseñe cm
   o mm: si la sustitución mezclara unidades, la aritmética que el alumno hace
   a mano para comprobar no le daría.
   ─────────────────────────────────────────────────────────────────────────── */

export interface MagnitudMeta {
  simbolo: string;
  nombre: string;
  unidad?: string;
  decimales?: number;
  /** Notación científica: intensidades acústicas, que van de 10⁻¹² a 10². */
  formato?: 'fijo' | 'exp';
}

export interface FormulaLab {
  id: string;
  /** Nombre corto para el botón de la lista. */
  nombre: string;
  /**
   * Expresión con huecos `{id}`. Se renderiza con símbolos en la lista y con
   * números en el detalle; el hueco es además lo que permite resaltar la
   * variable que el alumno acaba de mover.
   */
  plantilla: string;
  /** Magnitud que la fórmula despeja: es el resultado grande del panel. */
  salida: string;
  /** Qué te dice esta fórmula, en una línea. No repetir la fórmula en prosa. */
  dice: string;
}

export interface CatalogoLab {
  magnitudes: Record<string, MagnitudMeta>;
  formulas: FormulaLab[];
  /**
   * Magnitudes que se muestran siempre bajo el detalle, en vivo. Mezcla las
   * derivadas (T, E) con las instantáneas (x, v) a propósito: lo que enseña es
   * que unas se quedan quietas mientras las otras oscilan.
   */
  tablero: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   C6 · Movimiento periódico y ondas
   ═══════════════════════════════════════════════════════════════════════════ */

const RESORTE: CatalogoLab = {
  magnitudes: {
    m:    { simbolo: 'm', nombre: 'Masa',            unidad: 'kg',    decimales: 1 },
    k:    { simbolo: 'k', nombre: 'Constante',       unidad: 'N/m',   decimales: 0 },
    A:    { simbolo: 'A', nombre: 'Amplitud',        unidad: 'm',     decimales: 2 },
    T:    { simbolo: 'T', nombre: 'Periodo',         unidad: 's',     decimales: 2 },
    f:    { simbolo: 'f', nombre: 'Frecuencia',      unidad: 'Hz',    decimales: 2 },
    w:    { simbolo: 'ω', nombre: 'Pulsación',       unidad: 'rad/s', decimales: 2 },
    E:    { simbolo: 'E', nombre: 'Energía total',   unidad: 'J',     decimales: 2 },
    vmax: { simbolo: 'v', nombre: 'Velocidad máx.',  unidad: 'm/s',   decimales: 2 },
    t:    { simbolo: 't', nombre: 'Tiempo',          unidad: 's',     decimales: 1 },
    x:    { simbolo: 'x', nombre: 'Elongación',      unidad: 'm',     decimales: 3 },
    v:    { simbolo: 'v', nombre: 'Velocidad',       unidad: 'm/s',   decimales: 2 },
    F:    { simbolo: 'F', nombre: 'Fuerza',          unidad: 'N',     decimales: 2 },
    U:    { simbolo: 'U', nombre: 'E. potencial',    unidad: 'J',     decimales: 2 },
    K:    { simbolo: 'K', nombre: 'E. cinética',     unidad: 'J',     decimales: 2 },
  },
  formulas: [
    {
      id: 'hooke',
      nombre: 'Ley de Hooke',
      plantilla: 'F = − {k} · {x}',
      salida: 'F',
      dice: 'La fuerza apunta siempre al equilibrio: cambia de signo justo cuando la masa cruza el centro.',
    },
    {
      id: 'periodo',
      nombre: 'Periodo',
      plantilla: 'T = 2π · √( {m} / {k} )',
      salida: 'T',
      dice: 'Sólo entran la masa y la rigidez. La amplitud no aparece — por eso mover A no cambia el ritmo.',
    },
    {
      id: 'pulsacion',
      nombre: 'Pulsación',
      plantilla: 'ω = √( {k} / {m} )',
      salida: 'w',
      dice: 'La misma dependencia que T, pero al revés: más rígido o más ligero, más rápido oscila.',
    },
    {
      id: 'posicion',
      nombre: 'Posición x(t)',
      plantilla: 'x = {A} · cos( {w} · {t} )',
      salida: 'x',
      dice: 'La solución completa del movimiento: sabiendo A y ω, la posición de cualquier instante ya está decidida.',
    },
    {
      id: 'velocidad',
      nombre: 'Velocidad v(t)',
      plantilla: 'v = − {A} · {w} · sen( {w} · {t} )',
      salida: 'v',
      dice: 'Va un cuarto de ciclo por delante de x: es máxima al pasar por el equilibrio, cero en los extremos.',
    },
    {
      id: 'energia',
      nombre: 'Energía total',
      plantilla: 'E = ½ · {k} · {A}²',
      salida: 'E',
      dice: 'A entra al cuadrado: al doblar la amplitud la energía se multiplica por cuatro, no por dos.',
    },
    {
      id: 'potencial',
      nombre: 'Energía potencial',
      plantilla: 'U = ½ · {k} · {x}²',
      salida: 'U',
      dice: 'Lo que E no tiene guardado aquí está como cinética: mira las dos barras sumar siempre lo mismo.',
    },
  ],
  tablero: ['T', 'f', 'E', 'x', 'v', 'K'],
};

const PENDULO: CatalogoLab = {
  magnitudes: {
    L:    { simbolo: 'L',  nombre: 'Longitud',        unidad: 'm',     decimales: 2 },
    g:    { simbolo: 'g',  nombre: 'Gravedad',        unidad: 'm/s²',  decimales: 2 },
    th0:  { simbolo: 'θ₀', nombre: 'Ángulo inicial',  unidad: '°',     decimales: 0 },
    th0r: { simbolo: 'θ₀', nombre: 'Ángulo inicial',  unidad: 'rad',   decimales: 3 },
    Tf:   { simbolo: 'T',  nombre: 'T de la fórmula', unidad: 's',     decimales: 3 },
    T:    { simbolo: 'T',  nombre: 'T real',          unidad: 's',     decimales: 3 },
    err:  { simbolo: 'ε',  nombre: 'Error',           unidad: '%',     decimales: 2 },
    f:    { simbolo: 'f',  nombre: 'Frecuencia',      unidad: 'Hz',    decimales: 2 },
    vmax: { simbolo: 'v',  nombre: 'Velocidad máx.',  unidad: 'm/s',   decimales: 2 },
    t:    { simbolo: 't',  nombre: 'Tiempo',          unidad: 's',     decimales: 1 },
    th:   { simbolo: 'θ',  nombre: 'Ángulo',          unidad: '°',     decimales: 1 },
  },
  formulas: [
    {
      id: 'periodo',
      nombre: 'Periodo (aproximado)',
      plantilla: 'T = 2π · √( {L} / {g} )',
      salida: 'Tf',
      dice: 'La del examen. La masa no aparece: por eso los dos péndulos de la escena van al mismo paso.',
    },
    {
      id: 'exacto',
      nombre: 'Corrección por amplitud',
      plantilla: 'T_real ≈ {Tf} · ( 1 + {th0r}² / 16 )',
      salida: 'T',
      dice: 'El primer término que la aproximación de ángulo pequeño se deja fuera. A 60° ya pesa.',
    },
    {
      id: 'error',
      nombre: 'Error de la aproximación',
      plantilla: 'ε = ( {T} − {Tf} ) / {Tf} · 100',
      salida: 'err',
      dice: 'Sube el ángulo y mira cuándo cruza el 1 %: ahí deja de valer llamarlo armónico simple.',
    },
    {
      id: 'frecuencia',
      nombre: 'Frecuencia',
      plantilla: 'f = 1 / {T}',
      salida: 'f',
      dice: 'Periodo y frecuencia son la misma información al revés: segundos por ciclo, o ciclos por segundo.',
    },
    {
      id: 'angulo',
      nombre: 'Ángulo θ(t)',
      plantilla: 'θ = {th0} · cos( 2π · {t} / {T} )',
      salida: 'th',
      dice: 'Sólo vale mientras la aproximación aguante: con θ₀ grande la escena se adelanta a esta curva.',
    },
    {
      id: 'vmax',
      nombre: 'Velocidad máxima',
      plantilla: 'v = {th0r} · √( {g} · {L} )',
      salida: 'vmax',
      dice: 'Se alcanza en el punto más bajo, donde toda la energía potencial ya se volvió cinética.',
    },
  ],
  tablero: ['T', 'Tf', 'err', 'f', 'th'],
};

const ONDAS: CatalogoLab = {
  magnitudes: {
    v:      { simbolo: 'v', nombre: 'Velocidad del medio', unidad: 'm/s',   decimales: 2 },
    f:      { simbolo: 'f', nombre: 'Frecuencia',          unidad: 'Hz',    decimales: 2 },
    lambda: { simbolo: 'λ', nombre: 'Longitud de onda',    unidad: 'm',     decimales: 2 },
    T:      { simbolo: 'T', nombre: 'Periodo',             unidad: 's',     decimales: 2 },
    A:      { simbolo: 'A', nombre: 'Amplitud',            unidad: '',      decimales: 2 },
    k:      { simbolo: 'k', nombre: 'Número de onda',      unidad: 'rad/m', decimales: 2 },
    w:      { simbolo: 'ω', nombre: 'Pulsación',           unidad: 'rad/s', decimales: 2 },
    t:      { simbolo: 't', nombre: 'Tiempo',              unidad: 's',     decimales: 1 },
    y:      { simbolo: 'y', nombre: 'Desplazamiento',      unidad: '',      decimales: 2 },
  },
  formulas: [
    {
      id: 'velocidad',
      nombre: 'Ecuación de la onda',
      plantilla: 'v = {lambda} · {f}',
      salida: 'v',
      dice: 'La velocidad la pone el MEDIO, no la fuente. Subir f no acelera la onda: le acorta la longitud.',
    },
    {
      id: 'lambda',
      nombre: 'Longitud de onda',
      plantilla: 'λ = {v} / {f}',
      salida: 'lambda',
      dice: 'La misma ecuación despejada, que es como se usa: se conoce el medio y se elige la frecuencia.',
    },
    {
      id: 'periodo',
      nombre: 'Periodo',
      plantilla: 'T = 1 / {f}',
      salida: 'T',
      dice: 'Lo que tarda la partícula marcada en volver al mismo sitio, no lo que tarda la onda en cruzar.',
    },
    {
      id: 'numero',
      nombre: 'Número de onda',
      plantilla: 'k = 2π / {lambda}',
      salida: 'k',
      dice: 'Cuántos radianes de fase caben en un metro de medio. Es λ escrita en el idioma de los senos.',
    },
    {
      id: 'pulsacion',
      nombre: 'Pulsación',
      plantilla: 'ω = 2π · {f}',
      salida: 'w',
      dice: 'La versión angular de la frecuencia — la que entra dentro del seno.',
    },
    {
      id: 'onda',
      nombre: 'Onda viajera y(x,t)',
      plantilla: 'y = {A} · sen( {k}·x − {w}·{t} )',
      salida: 'y',
      dice: 'Toda la onda en una línea: fija x y tienes una oscilación; congela t y tienes una foto.',
    },
  ],
  tablero: ['lambda', 'T', 'k', 'w', 'y'],
};

const SONIDO: CatalogoLab = {
  magnitudes: {
    f:      { simbolo: 'f',  nombre: 'Frecuencia',         unidad: 'Hz',   decimales: 0 },
    db:     { simbolo: 'β',  nombre: 'Nivel sonoro',       unidad: 'dB',   decimales: 0 },
    I:      { simbolo: 'I',  nombre: 'Intensidad',         unidad: 'W/m²', formato: 'exp' },
    veces:  { simbolo: 'n',  nombre: 'Veces el umbral',    unidad: '×',    formato: 'exp' },
    lambda: { simbolo: 'λ',  nombre: 'λ en aire',          unidad: 'm',    decimales: 4 },
    dbEf:   { simbolo: 'β′', nombre: 'Nivel percibido',    unidad: 'dB',   decimales: 0 },
    // Greenwood da la posición NORMALIZADA (0–1) desde el ápice; la sim la
    // multiplica por los 35 mm de membrana basilar para que el número sea el
    // que aparece en la literatura de implantes cocleares.
    x:      { simbolo: 'x',  nombre: 'Desde el ápice',      unidad: 'mm',   decimales: 1 },
  },
  formulas: [
    {
      id: 'nivel',
      nombre: 'Nivel sonoro',
      plantilla: 'β = 10 · log₁₀( {I} / 10⁻¹² )',
      salida: 'db',
      dice: 'El decibelio comprime 14 órdenes de magnitud en 140 números. Por eso el oído los aguanta todos.',
    },
    {
      id: 'intensidad',
      nombre: 'Intensidad',
      plantilla: 'I = 10⁻¹² · 10^( {db} / 10 )',
      salida: 'I',
      dice: 'La misma relación despejada: +10 dB no es «un poco más», es diez veces más energía.',
    },
    {
      id: 'veces',
      nombre: 'Veces sobre el umbral',
      plantilla: 'n = 10^( {db} / 10 )',
      salida: 'veces',
      dice: 'Sube de 60 a 90 dB: la barra avanza un tercio y la intensidad se multiplica por mil.',
    },
    {
      id: 'lambda',
      nombre: 'Longitud de onda en aire',
      plantilla: 'λ = 343 / {f}',
      salida: 'lambda',
      dice: 'De aquí sale por qué la ecografía necesita megahercios: para ver un detalle, λ tiene que caber en él.',
    },
    {
      id: 'perdida',
      nombre: 'Pérdida auditiva',
      plantilla: 'β′ = {db} − pérdida( {f} )',
      salida: 'dbEf',
      dice: 'La presbiacusia empieza por la base de la cóclea: se van los agudos, y con ellos las consonantes.',
    },
  ],
  tablero: ['I', 'veces', 'lambda', 'x'],
};

/* ═══════════════════════════════════════════════════════════════════════════
   C7 · Temperatura y calor
   ═══════════════════════════════════════════════════════════════════════════ */

const TERMICO: CatalogoLab = {
  magnitudes: {
    Tamb:   { simbolo: 'T_a',   nombre: 'Ambiente',       unidad: '°C',   decimales: 0 },
    dT:     { simbolo: 'ΔT',    nombre: 'Salto térmico',  unidad: '°C',   decimales: 1 },
    L:      { simbolo: 'L',     nombre: 'Aislamiento',    unidad: 'mm',   decimales: 0 },
    Rcapa:  { simbolo: 'R_c',   nombre: 'R del aislante', unidad: '°C/W', decimales: 3 },
    Rext:   { simbolo: 'R_e',   nombre: 'R del aire',     unidad: '°C/W', decimales: 3 },
    Hseca:  { simbolo: 'H_s',   nombre: 'Pérdida seca',   unidad: 'W',    decimales: 0 },
    Hrad:   { simbolo: 'H_r',   nombre: 'Radiación',      unidad: 'W',    decimales: 0 },
    Hevap:  { simbolo: 'H_e',   nombre: 'Evaporación',    unidad: 'W',    decimales: 0 },
    sudor:  { simbolo: 'ṁ',     nombre: 'Sudoración',     unidad: 'L/h',  decimales: 2 },
    M:      { simbolo: 'M',     nombre: 'Metabolismo',    unidad: 'W',    decimales: 0 },
    bal:    { simbolo: 'ΔE',    nombre: 'Balance',        unidad: 'W',    decimales: 0 },
    deriva: { simbolo: 'ΔT/Δt', nombre: 'Deriva',         unidad: '°C/h', decimales: 2 },
  },
  formulas: [
    {
      id: 'salto',
      nombre: 'Salto térmico',
      plantilla: 'ΔT = 37 − {Tamb}',
      salida: 'dT',
      dice: 'El núcleo sigue a 37 °C pase lo que pase fuera: lo que cambia es cuánto cuesta sostenerlo.',
    },
    {
      id: 'resistencia',
      nombre: 'Resistencia del aislante',
      plantilla: 'R_c = ( {L} / 1000 ) / ( 0,20 · 1,8 )',
      salida: 'Rcapa',
      dice: 'Grasa y ropa, con k = 0,20 W/(m·°C) y 1,8 m² de superficie corporal.',
    },
    {
      id: 'conduccion',
      nombre: 'Pérdida seca',
      plantilla: 'H_s = {dT} / ( {Rcapa} + {Rext} )',
      salida: 'Hseca',
      dice: 'Dos resistencias en serie. Sin la del aire pegado a la piel saldrían 400 W: cuatro veces lo real.',
    },
    {
      id: 'radiacion',
      nombre: 'Reparto: radiación',
      plantilla: 'H_r = 0,59 · {Hseca}',
      salida: 'Hrad',
      dice: 'En reposo la radiación es la mayor vía de pérdida, por delante de la convección.',
    },
    {
      id: 'evaporacion',
      nombre: 'Evaporación',
      plantilla: 'H_e = 10 + ( {sudor} / 3600 ) · 2 430 000',
      salida: 'Hevap',
      dice: 'La única vía que no depende de ΔT: la que queda cuando el aire está tan caliente como la piel.',
    },
    {
      id: 'balance',
      nombre: 'Balance térmico',
      plantilla: 'ΔE = {M} − {Hseca} − {Hevap}',
      salida: 'bal',
      dice: 'Lo que el metabolismo produce menos lo que se va. Cero es termorregulación; el resto, fiebre o hipotermia.',
    },
    {
      id: 'deriva',
      nombre: 'Deriva de temperatura',
      plantilla: 'ΔT/Δt = {bal} · 3600 / ( 70 · 3470 )',
      salida: 'deriva',
      dice: 'Con 70 kg y c = 3470 J/(kg·°C), un desbalance de 100 W mueve el núcleo casi 1,5 °C por hora.',
    },
  ],
  tablero: ['dT', 'Hseca', 'Hevap', 'bal', 'deriva'],
};

/**
 * El registro completo. Al ser un `Record<SimId, …>`, añadir una clave a
 * `SimId` sin darle catálogo es un error de compilación — que es justo lo que
 * evita publicar una simulación con el panel de fórmulas vacío.
 */
export const CATALOGO: Record<SimId, CatalogoLab> = {
  // C6 · Movimiento periódico y ondas
  resorte: RESORTE,
  pendulo: PENDULO,
  ondas:   ONDAS,
  sonido:  SONIDO,
  // C7 · Temperatura y calor
  termico: TERMICO,
  // Una por clase del sílabo (`formulas-clases.ts`)
  plano:         PLANO,
  colision:      COLISION,
  rotacional:    ROTACIONAL,
  palanca:       PALANCA,
  fluidos:       FLUIDOS,
  gas:           GAS,
  coulomb:       COULOMB,
  capacitor:     CAPACITOR,
  circuito:      CIRCUITO,
  magnetico:     MAGNETICO,
  lente:         LENTE,
  fotoelectrico: FOTOELECTRICO,
};

/* ─── Formato ─────────────────────────────────────────────────────────────── */

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * `1.2e-8` → `1,2×10⁻⁸`. Escrito a mano porque `toExponential` da `e-8`, y aquí
 * la cifra es contenido de estudio y no un log de depuración. Mismo criterio
 * (y misma tabla de superíndices) que en `FormulaViva`.
 */
export function notacionCientifica(n: number): string {
  if (n === 0) return '0';
  const signo = n < 0 ? '−' : '';
  const abs = Math.abs(n);
  const exp = Math.floor(Math.log10(abs));
  const mant = abs / Math.pow(10, exp);
  const sup = String(Math.abs(exp))
    .split('')
    .map((d) => SUP[Number(d)] ?? d)
    .join('');
  const negExp = exp < 0 ? '⁻' : '';
  const mantTxt = mant < 1.05 ? '10' : `${mant.toFixed(1).replace('.', ',')}×10`;
  return `${signo}${mantTxt}${negExp}${sup}`;
}

/** Un número listo para leerse: coma decimal y notación científica si toca. */
export function formatea(meta: MagnitudMeta | undefined, valor: number | undefined): string {
  if (valor === undefined || !Number.isFinite(valor)) return '—';
  if (meta?.formato === 'exp') return notacionCientifica(valor);
  return valor.toFixed(meta?.decimales ?? 2).replace('.', ',');
}
