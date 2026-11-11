/**
 * Genera `src/lib/data/gramnegativas/capitulos.ts` (los pasos de los 10 capítulos con el
 * segundo exacto de cada animación) a partir de tres cosas:
 *
 *   1. docs/gramnegativas/GUION.md  → `titulo` y `texto` corto de cada paso (tablas por capítulo).
 *   2. scripts/gramnegativas/tiempos/c<n>.mjs → qué animar y en qué palabra: por paso, una lista
 *      de `[parámetro, palabra clave | segundos, duración]`. El parámetro es el que su lámina
 *      (`laminas/c<n>.tsx`) lee con `p('nombre')`.
 *   3. palabras.json y narracion.json (de `palabras.py` y `preparar-narracion.mjs`) → los
 *      segundos de cada palabra y la duración de cada frase.
 *
 *   node scripts/gramnegativas/tiempos.mjs --dir <salida de preparar-narracion> [--caps 0,1,2]
 *
 * La voz es el reloj: cada animación entra en la palabra que la nombra y NUNCA termina después
 * de su frase (se recorta la duración). Palabra clave: sin tildes ni mayúsculas, por prefijo o a
 * una letra de distancia; `palabra#2` es la segunda vez que aparece; `dos palabras` busca esa
 * secuencia. Un número son segundos desde el inicio del paso. Si la palabra no está, se para
 * y se lista lo que Whisper oyó en ese paso (no se inventa un tiempo).
 * Si se regraba un audio, basta con volver a correr esto.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir');
if (!dir) { console.error('Uso: --dir <salida de preparar-narracion> [--caps 0,1,2]'); process.exit(1); }
const SOLO = arg('caps') ? arg('caps').split(',').map(Number) : null;

const PASOS = [4, 7, 9, 8, 8, 10, 11, 6, 19, 12];
const ANTES = 0.1; // la animación arranca un instante antes de la palabra
const RESUMENES = [
  'Una paciente con leucemia y un paciente en ventilación mecánica: dos historias distintas con la misma pregunta, cómo llega una bacteria a la sangre.',
  'Quién es vulnerable, de dónde vienen las gramnegativas, las tres fases de una bacteriemia y las cuatro puertas de entrada.',
  'El moco, la microbiota y el epitelio sanos, y cómo la disbiosis y los patógenos los deshacen.',
  'Las cinco uniones entre enterocitos, las dos rutas de cruce y las cuatro formas de romper una unión.',
  'Cómo invaden Salmonella, Shigella y otras bacterias, y cómo muere o se expulsa el enterocito.',
  'Endotoxina y exotoxinas: qué son, cómo actúan, en qué se diferencian y qué fármacos las alcanzan.',
  'Una barrera rota deja pasar bacterias y toxinas: bacteriemia, daño a distancia, sepsis y sus criterios.',
  'El epitelio se renueva cada pocos días: células madre, regeneración y cómo los patógenos y los fármacos interfieren.',
  'Escherichia coli, Klebsiella, Pseudomonas y Acinetobacter: cuatro estrategias distintas y los fármacos que las enfrentan.',
  'Patógenos entéricos lado a lado, mecanismos de resistencia, modelos experimentales y el regreso a los dos pacientes.',
];

// ─── 1. GUION.md ────────────────────────────────────────────────────────────────
const limpia = (t) => t
  .replace(/\s*`\[[CF]\]`/g, '')
  .replace(/\s*\(§[^)]*\)/g, '')
  .replace(/\*/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const guion = readFileSync(join(RAIZ, 'docs/gramnegativas/GUION.md'), 'utf8');
const textos = []; // [cap][paso] = { titulo, texto }
let cap = -1;
for (const linea of guion.split('\n')) {
  const h = linea.match(/^## (\d+) · /);
  if (h) { cap = Number(h[1]); textos[cap] = []; continue; }
  if (cap < 0 || /^## Para revisar/.test(linea)) continue;
  const f = linea.match(/^\| (\d+) \| (.+?) \| (.+) \|\s*$/);
  if (f) textos[cap][Number(f[1])] = { titulo: limpia(f[2]), texto: limpia(f[3]) };
}
for (let c = 0; c < PASOS.length; c++) {
  const n = (textos[c] ?? []).filter(Boolean).length;
  if (n !== PASOS[c]) { console.error(`GUION.md: el capítulo ${c} tiene ${n} pasos y se esperaban ${PASOS[c]}`); process.exit(1); }
}

// ─── 2 y 3. Tiempos ─────────────────────────────────────────────────────────────
const narracion = JSON.parse(readFileSync(join(dir, 'narracion.json'), 'utf8'));
const palabras = JSON.parse(readFileSync(join(dir, 'palabras.json'), 'utf8'));
const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};
const coincide = (palabra, clave) => {
  if (palabra === clave) return true;
  if (clave.length >= 4 && palabra.startsWith(clave)) return true;
  if (clave.length >= 5 && lev(palabra, clave) <= 1) return true;
  if (clave.length >= 7 && palabra.length >= clave.length && lev(palabra.slice(0, clave.length), clave) <= 1) return true;
  return false;
};

const errores = [], avisos = [];
function segundoDe(cap, paso, clave, lista) {
  if (typeof clave === 'number') return clave;
  const m = String(clave).match(/^(.*?)(?:#(\d+))?$/);
  const veces = Number(m[2] ?? 1);
  const claves = m[1].trim().split(/\s+/).map(norm).filter(Boolean);
  const ns = lista.map(([p]) => norm(p));
  let hallado = 0;
  for (let i = 0; i + claves.length <= ns.length; i++) {
    if (claves.every((k, j) => coincide(ns[i + j], k)) && ++hallado === veces) return lista[i][1];
  }
  return null;
}

const salida = [];
for (let c = 0; c < PASOS.length; c++) {
  if (SOLO && !SOLO.includes(c)) { salida.push(null); continue; }
  const rutaSpec = join(RAIZ, 'scripts/gramnegativas/tiempos', `c${c}.mjs`);
  const spec = existsSync(rutaSpec) ? (await import(pathToFileURL(rutaSpec).href)).default : null;
  const nar = narracion.find((n) => n.cap === c);
  const pal = palabras.find((p) => p.cap === c);
  if (!nar || !pal) { console.error(`falta el capítulo ${c} en narracion.json o palabras.json`); process.exit(1); }
  if (spec && spec.length !== PASOS[c]) { console.error(`tiempos/c${c}.mjs tiene ${spec.length} pasos y se esperaban ${PASOS[c]}`); process.exit(1); }
  const pasos = [];
  for (let i = 0; i < PASOS[c]; i++) {
    const limite = (i + 1 < nar.marcas.length ? nar.marcas[i + 1] : nar.duracion) - nar.marcas[i];
    const lista = pal.pasos[i] ?? [];
    const entradas = [];
    for (const [nombre, clave, dur] of (spec?.[i] ?? [])) {
      const t = segundoDe(c, i, clave, lista);
      if (t === null) { errores.push(`${c}.${i} «${nombre}»: no encuentro «${clave}». Whisper oyó: ${lista.map(([p, s]) => `${p}@${s}`).join(' ')}`); continue; }
      const at = Math.max(0, t - ANTES);
      const d = Math.min(dur, limite - at - 0.05);
      if (d < 0.2) avisos.push(`${c}.${i} «${nombre}»: queda solo ${Math.max(0, d).toFixed(2)} s antes de que acabe la frase`);
      entradas.push([nombre, +at.toFixed(2), +Math.max(0.1, d).toFixed(2)]);
    }
    pasos.push({ ...textos[c][i], entradas });
  }
  salida.push(pasos);
}

for (const a of avisos) console.log(`  aviso  ${a}`);
if (errores.length) { for (const e of errores) console.error(`  ERROR  ${e}`); console.error(`\n${errores.length} palabra(s) sin encontrar.`); process.exit(1); }

// ─── Escribir capitulos.ts ──────────────────────────────────────────────────────
const q = (s) => JSON.stringify(s);
const cuerpo = salida.map((pasos, c) => {
  if (!pasos) return `  parte(${c}, [], ${q(RESUMENES[c])}),`;
  const filas = pasos.map((p, i) => `    paso(${c}, ${i}, ${q(p.titulo)}, ${q(p.texto)}, [${p.entradas.map(([n, at, d]) => `[${q(n)}, ${at}, ${d}]`).join(', ')}]),`);
  return `  parte(${c}, [\n${filas.join('\n')}\n  ], ${q(RESUMENES[c])}),`;
}).join('\n');

const destino = join(RAIZ, 'src/lib/data/gramnegativas/capitulos.ts');
if (SOLO && existsSync(destino)) console.log('(--caps: los capítulos que no se piden quedan vacíos; corre sin --caps para el archivo completo)');
writeFileSync(destino, `// GENERADO por scripts/gramnegativas/tiempos.mjs — no editar a mano: cambia
// scripts/gramnegativas/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/gramnegativas/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «Infecciones bacterianas por gramnegativas». Solo en el
// servidor (a través de \`src/lib/gramnegativas/registro.ts\`): los de pago, y la URL de su
// voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada \`tejido\` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (\`laminas/c<capítulo>.tsx\`). Guion: docs/gramnegativas/GUION.md.

import type { Accion, Paso } from '@/lib/data/lupus/tipos';
import { NARRACION } from './narracion';
import { INDICE } from './indice';
import type { Parte } from './tipos';

type Entrada = [nombre: string, segundo: number, duracion: number];

function acciones(cap: number, paso: number, e: Entrada[]): Accion[] {
  return e.map(([n, at, d]) => ({ at: Math.round(at * 1000), duration: Math.round(d * 1000), tipo: 'tejido', param: \`\${cap}.\${paso}.\${n}\`, a: 1 }));
}

function paso(cap: number, i: number, titulo: string, texto: string, e: Entrada[]): Paso {
  return { id: \`c\${cap}-\${i}\`, orden: i, titulo, texto, profundiza: '', protagonistas: [], encuadre: 'all', acciones: acciones(cap, i, e) };
}

function parte(cap: number, pasos: Paso[], resumen: string): Parte {
  const m = INDICE[cap];
  return { ...m, resumen, fondo: 'blanco', actores: {}, narracion: NARRACION[cap], pasos };
}

export const CAPITULOS: Parte[] = [
${cuerpo}
];
`);
const total = salida.reduce((n, p) => n + (p ? p.reduce((m, x) => m + x.entradas.length, 0) : 0), 0);
console.log(`escrito src/lib/data/gramnegativas/capitulos.ts · ${salida.filter(Boolean).length} capítulos · ${total} animaciones`);
