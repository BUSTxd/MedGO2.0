// Cortes transversales del tronco a los niveles clásicos del atlas. El corte
// se calcula con los mismos volúmenes del modelo: la silueta sale del campo de
// la superficie y cada núcleo o vía, del suyo. Devuelve una imagen RGBA (para
// la tapa del corte en 3D) y, por píxel, qué estructura hay (para tocarla).

import { crearCampo, reflejar, type Campo } from './sdf.ts';
import { campoTronco } from './forma.ts';
import { INTERIOR_LIST, type Interior } from './interior.ts';

export interface Nivel {
  id: string;
  nombre: string;
  corto: string;
  y: number;
  /** Qué hay que reconocer en este corte. */
  claves: string;
}

export const NIVELES: Nivel[] = [
  { id: 'mes_sup', nombre: 'Mesencéfalo superior', corto: 'Mes. sup.', y: 3.74, claves: 'Colículo superior, núcleo del III y Edinger-Westphal, núcleo rojo, sustancia negra y pie peduncular.' },
  { id: 'mes_inf', nombre: 'Mesencéfalo inferior', corto: 'Mes. inf.', y: 3.12, claves: 'Colículo inferior, núcleo del IV y la decusación de los pedúnculos cerebelosos superiores.' },
  { id: 'pue_sup', nombre: 'Puente medio', corto: 'Puente med.', y: 1.55, claves: 'Núcleos motor y sensitivo principal del V y su raíz; base del puente con los haces corticoespinales.' },
  { id: 'pue_inf', nombre: 'Puente inferior', corto: 'Puente inf.', y: 0.95, claves: 'Colículo facial: núcleo del VI y rodilla del VII; núcleo del facial; núcleos vestibulares.' },
  { id: 'bul_sup', nombre: 'Bulbo abierto (olivar)', corto: 'Bulbo olivar', y: -0.85, claves: 'Oliva inferior, núcleos del XII, dorsal del vago, solitario y ambiguo; pirámides y lemnisco medial.' },
  { id: 'bul_med', nombre: 'Bulbo cerrado: decusación sensitiva', corto: 'Dec. sensitiva', y: -1.55, claves: 'Núcleos grácil y cuneiforme; las fibras arcuatas internas cruzan y forman el lemnisco medial.' },
  { id: 'bul_inf', nombre: 'Bulbo bajo: decusación piramidal', corto: 'Dec. motora', y: -2.75, claves: 'Las fibras corticoespinales cruzan la línea media hacia el cordón lateral de la médula.' },
];

export const NIVEL: Record<string, Nivel> = Object.fromEntries(NIVELES.map((n) => [n.id, n]));

/** Ventana del corte en el plano (x, z), en cm. */
export const VENTANA = { x0: -2.0, x1: 2.0, z0: -1.55, z1: 1.45 };

export interface Corte {
  ancho: number;
  alto: number;
  rgba: Uint8ClampedArray;
  /** Índice en `ids` de lo que hay en cada píxel (0 = tejido sin nombre, -1 = fuera). */
  mapa: Int16Array;
  ids: Array<{ id: string; lado: 'i' | 'd' | 'm' }>;
  /** Centro de cada estructura presente (para los rótulos), en cm (x, z). */
  centros: Array<{ k: number; x: number; z: number; area: number }>;
}

interface Volumen { x: Interior; lado: 'i' | 'd' | 'm'; campo: Campo }

let cacheVol: Volumen[] | null = null;
let cacheTronco: Campo | null = null;

function volumenes(): Volumen[] {
  if (cacheVol) return cacheVol;
  const out: Volumen[] = [];
  for (const x of INTERIOR_LIST) {
    if (x.impar) { out.push({ x, lado: 'm', campo: crearCampo(x.prims, 0.05) }); continue; }
    out.push({ x, lado: 'i', campo: crearCampo(x.prims, 0.05) });
    out.push({ x, lado: 'd', campo: crearCampo(x.prims.map(reflejar), 0.05) });
  }
  // Se pintan en orden: núcleos grandes y difusos, luego núcleos, vías y fibras.
  const orden = (v: Volumen) => (v.x.velo ? 0 : v.x.tipo === 'nucleo' ? 1 : v.x.tipo === 'nucleo_par' ? 2 : v.x.tipo === 'via' ? 3 : 4);
  out.sort((a, b) => orden(a) - orden(b));
  cacheVol = out;
  return out;
}

const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

const BLANCA: [number, number, number] = [240, 231, 218];
const BLANCA_OSCURA: [number, number, number] = [222, 208, 192];

const cacheCortes = new Map<string, Corte>();

/** Imagen del corte a la altura y (resolución en píxeles por cm). La escena y la barra lateral comparten el resultado. */
export function calcularCorte(y: number, ppcm = 90): Corte {
  const clave = `${y}|${ppcm}`;
  const hecho = cacheCortes.get(clave);
  if (hecho) return hecho;
  const c = calcular(y, ppcm);
  cacheCortes.set(clave, c);
  return c;
}

function calcular(y: number, ppcm: number): Corte {
  const tronco = (cacheTronco ??= campoTronco());
  const vols = volumenes();
  const ancho = Math.round((VENTANA.x1 - VENTANA.x0) * ppcm);
  const alto = Math.round((VENTANA.z1 - VENTANA.z0) * ppcm);
  const rgba = new Uint8ClampedArray(ancho * alto * 4);
  const mapa = new Int16Array(ancho * alto).fill(-1);
  const ids: Corte['ids'] = [{ id: '', lado: 'm' }];
  const clave = new Map<string, number>();
  const sumas = new Map<number, { x: number; z: number; n: number }>();
  // Solo los volúmenes que llegan a esta altura.
  const aqui = vols.filter((v) => v.campo.limites.min[1] - 0.05 <= y && v.campo.limites.max[1] + 0.05 >= y);

  for (let j = 0; j < alto; j++) {
    // Fila 0 = arriba de la imagen = cara anterior (z alto): así el corte se
    // lee como en el atlas, con lo ventral abajo al mirarlo desde arriba.
    const z = VENTANA.z1 - (j + 0.5) / ppcm;
    for (let i = 0; i < ancho; i++) {
      const x = VENTANA.x0 + (i + 0.5) / ppcm;
      const d = tronco.d(x, y, z);
      if (d > 0) continue;
      const p = j * ancho + i;
      // Borde de la pieza un poco más oscuro (piamadre).
      let c: [number, number, number] = d > -0.025 ? BLANCA_OSCURA : BLANCA;
      let k = 0;
      for (const v of aqui) {
        if (v.campo.d(x, y, z) >= 0) continue;
        const nombre = `${v.x.id}|${v.lado}`;
        let n = clave.get(nombre);
        if (n === undefined) { n = ids.length; ids.push({ id: v.x.id, lado: v.lado }); clave.set(nombre, n); }
        k = n;
        const col = hex(v.x.color);
        const a = v.x.velo ? 0.35 : 0.92;
        c = [c[0] + (col[0] - c[0]) * a, c[1] + (col[1] - c[1]) * a, c[2] + (col[2] - c[2]) * a];
      }
      // Fila 0 de la textura = abajo en UV: se escribe invertida.
      const q = ((alto - 1 - j) * ancho + i) * 4;
      rgba[q] = c[0]; rgba[q + 1] = c[1]; rgba[q + 2] = c[2]; rgba[q + 3] = 255;
      mapa[(alto - 1 - j) * ancho + i] = k;
      if (k) {
        const s = sumas.get(k) ?? { x: 0, z: 0, n: 0 };
        s.x += x; s.z += z; s.n++;
        sumas.set(k, s);
      }
    }
  }
  const centros = [...sumas.entries()].map(([k, s]) => ({ k, x: s.x / s.n, z: s.z / s.n, area: s.n / (ppcm * ppcm) }));
  return { ancho, alto, rgba, mapa, ids, centros };
}
