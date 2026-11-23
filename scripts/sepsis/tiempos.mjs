/**
 * Genera `src/lib/data/sepsis/capitulos.ts` (los pasos de los 17 capítulos con el segundo
 * exacto de cada animación) a partir de tres cosas:
 *
 *   1. docs/sepsis/GUION.md  → `titulo` y `texto` corto de cada paso (tablas por capítulo).
 *   2. scripts/sepsis/tiempos/c<n>.mjs → qué animar y en qué palabra: por paso, una lista
 *      de `[parámetro, palabra clave | segundos, duración]`. El parámetro es el que su lámina
 *      (`laminas/c<n>.tsx`) lee con `p('nombre')`.
 *   3. palabras.json y narracion.json (de `palabras.py` y `preparar-narracion.mjs`) → los
 *      segundos de cada palabra y la duración de cada frase.
 *
 *   node scripts/sepsis/tiempos.mjs --dir <salida de preparar-narracion> [--caps 0,1,2]
 *
 * La voz es el reloj: cada animación entra en la palabra que la nombra y NUNCA termina después
 * de su frase (se recorta la duración). Palabra clave: sin tildes ni mayúsculas, por prefijo o a
 * una letra de distancia; `palabra#2` es la segunda vez que aparece; `dos palabras` busca esa
 * secuencia. Un número son segundos desde el inicio del paso. Si la palabra no está, se para
 * y se lista lo que Whisper oyó en ese paso (no se inventa un tiempo). Whisper escribe las
 * cifras en dígitos («39», «58») y las siglas como las oye («TLR», «NFκB»): la clave va como las
 * oyó. Si se regraba un audio, basta con volver a correr esto.
 *
 * El `texto` de cada paso es la celda del guion sin sus fuentes (§…, `[N]`, citas) y sin las
 * notas para revisar, y se recorta a unas 55 palabras (se ve bajo la lámina).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir');
if (!dir) { console.error('Uso: --dir <salida de preparar-narracion> [--caps 0,1,2]'); process.exit(1); }
const SOLO = arg('caps') ? arg('caps').split(',').map(Number) : null;

const PASOS = [5, 7, 7, 6, 8, 9, 8, 6, 7, 6, 6, 8, 8, 7, 6, 9, 8];
const ANTES = 0.1; // la animación arranca un instante antes de la palabra
const RESUMENES = [
  'Los dos pacientes del ACP13 (el joven con meningococcemia y la abuela con neumonía y SDRA) y la pregunta que los une: por qué fallan órganos que el microbio no tocó.',
  'Sepsis-3: disfunción orgánica por una respuesta desregulada del huésped, SOFA y qSOFA, bacteriemia frente a sepsis, choque séptico y disfunción multiorgánica.',
  'La defensa que deja de ser local: las tres fases (inflamación, daño endotelial y coagulopatía) y la inmunosupresión que convive con ellas.',
  'Choque cálido y choque frío: PAM = gasto por resistencia, el pulso saltón, la trampa de la piel caliente y el paso a la fase hipodinámica.',
  'PAMP y DAMP, los receptores TLR, el lípido A, LBP, CD14 y TLR4/MD-2, las vesículas de membrana externa y el meningococo con su escudo y su delator.',
  'De TLR4 al núcleo: MyD88, IRAK, TRAF6, TAK1, IKK, IκB y NF-κB; la segunda señal, el inflamasoma NLRP3, la caspasa-1 y la piroptosis.',
  'TNF-α, IL-1, IL-6, el complemento y C5a: fiebre, proteína C reactiva, médula ósea, anafilatoxinas y la tormenta de mensajeros.',
  'El glucocálix como alfombra, las dos tijeras (ADAM15 y Ang-2), la fuga por las uniones, el endotelio pegajoso, los tapones y el óxido nítrico desequilibrado.',
  'El equilibrio normal de la hemostasia: factor tisular, trombina, plaquetas, antitrombina, proteína C, TFPI, fibrinólisis y las pruebas TP y TTPa.',
  'La balanza se vuelca: factor tisular por todas partes, tres frenos que fallan, la fibrinólisis apagada y el círculo vicioso con la inflamación.',
  'El coágulo como trampa para microbios: NETs, plaquetas centinela, la red que también coagula, los microtrombos generalizados y las petequias del joven.',
  'La coagulación intravascular diseminada, el laboratorio del joven, de la petequia a la púrpura fulminante y la lesión de los órganos.',
  'La vasoplejía: óxido nítrico y GMPc, canales de potasio, vasopresina, catecolaminas que no alcanzan, la PAM del joven y la miocardiopatía séptica.',
  'La microcirculación desacoplada, la hipoxia citopática, el lactato con y sin oxígeno, el metabolismo de estrés y los números de los dos pacientes.',
  'El riñón y el cerebro: lesión renal séptica más allá del flujo, encefalopatía asociada a sepsis, sus causas y las secuelas.',
  'El alvéolo en el SDRA: neutrófilos, edema no cardiogénico, surfactante, hipoxemia, Berlín, PEEP y el daño alveolar difuso con sus membranas hialinas.',
  'Inmunoparálisis: apoptosis de linfocitos, HLA-DR bajo, agotamiento, neutrófilos torpes, el tubo con su biopelícula, Pseudomonas y los dos desenlaces.',
];

// ─── 1. GUION.md ────────────────────────────────────────────────────────────────
const MAX_PALABRAS = 55;
/** Fuentes y marcas del guion: (§…), (G), (T, J), (M, T), (G; S3), (L), (Ba)… */
const FUENTE = String.raw`(?:§|G\b|T\b|J\b|M\b|L\b|Ba\b|S3\b|ACP)`;
/** La celda del guion como texto de pantalla: sin marcas, fuentes ni notas para el revisor. */
const limpia = (t) => {
  let r = t
    .replace(/\*\*[^*]*(?:revisar|por confirmar)[^*]*\*\*\.?/gi, '')
    .replace(/\s*`\[(?:N|!|ACP)\]`/g, '')
    .replace(/\s*\([^()]*§[^()]*\)/g, '')
    .replace(new RegExp(String.raw`\s*\(${FUENTE}[^()]*\)`, 'g'), '')
    .replace(/\s*\([^()]*(?:por confirmar|revisar)[^()]*\)/gi, '');
  r = r.replace(/\*/g, '').replace(/\s+([.,;:])/g, '$1').replace(/\.{2,}/g, '.').replace(/\s+/g, ' ').trim();
  // Recorte por frases hasta MAX_PALABRAS (si la primera ya se pasa, se corta ahí).
  const frases = r.match(/[^.]+(?:\.|$)/g) ?? [r];
  let salida = '';
  for (const f of frases) {
    const candidato = (salida + f).trim();
    if (salida && candidato.split(/\s+/).length > MAX_PALABRAS) break;
    salida = candidato + ' ';
  }
  return salida.trim();
};
const guion = readFileSync(join(RAIZ, 'docs/sepsis/GUION.md'), 'utf8').replace(/\r\n/g, '\n');
const textos = []; // [cap][paso] = { titulo, texto }
let cap = -1;
for (const linea of guion.split('\n')) {
  const h = linea.match(/^## (\d+) · /);
  if (h) { cap = Number(h[1]); textos[cap] = []; continue; }
  if (/^## /.test(linea)) { cap = -1; continue; }
  if (cap < 0) continue;
  const f = linea.match(/^\| (\d+) \| (.+?) \| (.+) \|\s*$/);
  if (f) textos[cap][Number(f[1])] = { titulo: limpia(f[2]).replace(/\.$/, ''), texto: limpia(f[3]) };
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
  const rutaSpec = join(RAIZ, 'scripts/sepsis/tiempos', `c${c}.mjs`);
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

const destino = join(RAIZ, 'src/lib/data/sepsis/capitulos.ts');
if (SOLO && existsSync(destino)) console.log('(--caps: los capítulos que no se piden quedan vacíos; corre sin --caps para el archivo completo)');
writeFileSync(destino, `// GENERADO por scripts/sepsis/tiempos.mjs — no editar a mano: cambia
// scripts/sepsis/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/sepsis/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «Sepsis». Solo en el servidor (a través de
// \`src/lib/sepsis/registro.ts\`): los de pago, y la URL de su voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada \`tejido\` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (\`laminas/c<capítulo>.tsx\`). Guion: docs/sepsis/GUION.md.

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
console.log(`escrito src/lib/data/sepsis/capitulos.ts · ${salida.filter(Boolean).length} capítulos · ${total} animaciones`);
