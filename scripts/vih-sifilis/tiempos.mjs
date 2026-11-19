/**
 * Genera `src/lib/data/vih-sifilis/capitulos.ts` (los pasos de los 21 capítulos con el
 * segundo exacto de cada animación) a partir de tres cosas:
 *
 *   1. docs/vih-sifilis/GUION.md  → `titulo` y `texto` corto de cada paso (tablas por capítulo).
 *   2. scripts/vih-sifilis/tiempos/c<n>.mjs → qué animar y en qué palabra: por paso, una lista
 *      de `[parámetro, palabra clave | segundos, duración]`. El parámetro es el que su lámina
 *      (`laminas/c<n>.tsx`) lee con `p('nombre')`.
 *   3. palabras.json y narracion.json (de `palabras.py` y `preparar-narracion.mjs`) → los
 *      segundos de cada palabra y la duración de cada frase.
 *
 *   node scripts/vih-sifilis/tiempos.mjs --dir <salida de preparar-narracion> [--caps 0,1,2]
 *
 * La voz es el reloj: cada animación entra en la palabra que la nombra y NUNCA termina después
 * de su frase (se recorta la duración). Palabra clave: sin tildes ni mayúsculas, por prefijo o a
 * una letra de distancia; `palabra#2` es la segunda vez que aparece; `dos palabras` busca esa
 * secuencia. Un número son segundos desde el inicio del paso. Si la palabra no está, se para
 * y se lista lo que Whisper oyó en ese paso (no se inventa un tiempo). Whisper escribe las
 * cifras en dígitos («CD4», «120») y las siglas deletreadas como siglas: la clave va como las
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

const PASOS = [6, 6, 6, 8, 7, 7, 9, 9, 9, 6, 8, 9, 9, 7, 7, 6, 7, 6, 8, 6, 6];
const ANTES = 0.1; // la animación arranca un instante antes de la palabra
const RESUMENES = [
  'Los dos pacientes del ACP14 (VIH agudo con fallo del tratamiento, y chancro con sífilis secundaria) y la puerta que comparten.',
  'Retrovirus y lentivirus, el salto desde los simios, grupos y subtipos, VIH-1 frente a VIH-2 y el linfocito CD4 como director de orquesta.',
  'El virión en capas: envoltura robada, espículas gp120 y gp41, matriz p17, cápside p24, ARN y tres enzimas.',
  'Nueve genes y quince proteínas: Gag, Pol y Env, Tat y Rev, y las accesorias contra los factores de restricción.',
  'CD4 más un correceptor: CCR5 y CXCR4, CCR5Δ32, DC-SIGN, macrófagos y microglía, y los CD4 de memoria del intestino.',
  'Los epitelios por donde entra el virus, las células de la lámina propia, las tres rutas para cruzar y el virus fundador.',
  'Las ocho estaciones del ciclo, de la unión a la maduración, cada una con su hueco para un fármaco, y una fábrica con errores.',
  'La alarma innata, los citotóxicos y los anticuerpos, y cinco formas de perder un CD4: efecto directo, espectadores, piroptosis, intestino y translocación.',
  'Del eclipse al sida: cada hallazgo del paciente 1, la seroconversión, la fase crónica y el reservorio, y los controladores.',
  'CD4 y carga viral, el tren hacia el precipicio, los estadios, lo que cambia con el tratamiento e indetectable es igual a intransmisible.',
  'Cinco generaciones de pruebas, el periodo ventana, el algoritmo actual, el lactante y el paciente 2.',
  'La escalera de CD4, la tuberculosis, el sarcoma de Kaposi, la neumonía por Pneumocystis del paciente 1, el VIH avanzado y el síndrome de reconstitución inmune.',
  'De la zidovudina al TLD, las guías de la OMS, el HHS y el MINSA, cada clase de fármaco en su hueco, y la PrEP y la PEP.',
  'Lenacapavir, inyectables de acción prolongada, menos fármacos por pastilla, anticuerpos neutralizantes y el sueño de la cura.',
  'Por qué sube la carga viral del paciente 1: adherencia, interacciones, resistencia y barrera genética, y qué se hace.',
  'Una espiroqueta sigilosa: sacacorchos, dos membranas sin LPS, TprK y cómo se transmite.',
  'Cómo ve el sistema inmunitario a la espiroqueta y cómo daña los vasos: TLR2, Th1, células plasmáticas, endarteritis y goma.',
  'El paciente 2 y su chancro: cómo se forma, por qué es duro, limpio e indoloro, cómo se confirma y con qué se confunde.',
  'Secundaria, latente, terciaria y congénita: la erupción, los condilomas lata, las placas, la alopecia, la goma, la aorta y la placenta.',
  'Pruebas no treponémicas y treponémicas, títulos, falsos resultados, algoritmos y cómo se sigue un tratamiento.',
  'Penicilina, una dosis o tres, alergia y embarazo, lo nuevo, la reacción de Jarisch-Herxheimer y el cierre: dos pacientes, una puerta.',
];

// ─── 1. GUION.md ────────────────────────────────────────────────────────────────
const MAX_PALABRAS = 55;
/** La celda del guion como texto de pantalla: sin marcas, fuentes ni notas para el revisor. */
const limpia = (t) => {
  let r = t
    .replace(/\*\*[^*]*(?:revisar|por confirmar)[^*]*\*\*\.?/gi, '')
    .replace(/\s*`\[(?:N|!|ACP)\]`/g, '')
    .replace(/\s*\([^()]*§[^()]*\)/g, '')
    .replace(/\s*\([^()]*(?:por confirmar|revisar)[^()]*\)/gi, '');
  // Una cita al final: (T), (Sharp 2011, Faria 2014), (OMS, CDC), (HHS-OI)…
  r = r.replace(/\s*\((?=[^()]*(?:\b(?:19|20)\d\d\b|\bT\b|\b(?:OMS|HHS|CDC|NTS|MINSA)\b))[^()]*\)\s*\.?\s*$/g, '.');
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
const guion = readFileSync(join(RAIZ, 'docs/vih-sifilis/GUION.md'), 'utf8').replace(/\r\n/g, '\n');
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
  const rutaSpec = join(RAIZ, 'scripts/vih-sifilis/tiempos', `c${c}.mjs`);
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

const destino = join(RAIZ, 'src/lib/data/vih-sifilis/capitulos.ts');
if (SOLO && existsSync(destino)) console.log('(--caps: los capítulos que no se piden quedan vacíos; corre sin --caps para el archivo completo)');
writeFileSync(destino, `// GENERADO por scripts/vih-sifilis/tiempos.mjs — no editar a mano: cambia
// scripts/vih-sifilis/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/vih-sifilis/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «VIH y sífilis». Solo en el servidor (a través de
// \`src/lib/vih-sifilis/registro.ts\`): los de pago, y la URL de su voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada \`tejido\` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (\`laminas/c<capítulo>.tsx\`). Guion: docs/vih-sifilis/GUION.md.

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
console.log(`escrito src/lib/data/vih-sifilis/capitulos.ts · ${salida.filter(Boolean).length} capítulos · ${total} animaciones`);
