/**
 * Genera `src/lib/data/hepatitis-virales/capitulos.ts` (los pasos de los 23 capítulos con el segundo
 * exacto de cada animación) a partir de tres cosas:
 *
 *   1. docs/hepatitis-virales/GUION.md  → `titulo` y `texto` corto de cada paso (tablas por capítulo).
 *   2. scripts/hepatitis-virales/tiempos/c<n>.mjs → qué animar y en qué palabra: por paso, una lista
 *      de `[parámetro, palabra clave | segundos, duración]`. El parámetro es el que su lámina
 *      (`laminas/c<n>.tsx`) lee con `p('nombre')`.
 *   3. palabras.json y narracion.json (de `palabras.py` y `preparar-narracion.mjs`) → los
 *      segundos de cada palabra y la duración de cada frase.
 *
 *   node scripts/hepatitis-virales/tiempos.mjs --dir <salida de preparar-narracion> [--caps 0,1,2]
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

const PASOS = [6, 6, 7, 8, 8, 8, 8, 6, 8, 8, 8, 7, 7, 7, 6, 8, 6, 7, 8, 7, 8, 7, 7];
const ANTES = 0.1; // la animación arranca un instante antes de la palabra
const RESUMENES = [
  'Los dos pacientes del ACP15 (hepatitis B con brote y carcinoma; hepatitis C con fibrosis y crioglobulinemia) y la pregunta que los une: por qué un virus que casi no mata al hepatocito destruye un hígado.',
  'Los cinco virus de la hepatitis: familia y genoma, vías de entrada, cuáles se cronifican, cuáles tienen vacuna, la carga mundial según la OMS y la situación en el Perú.',
  'Histología del hígado: lobulillo clásico, portal y acino de Rappaport, la tríada, las trabéculas, el sinusoide con su espacio de Disse, las células de Kupffer y estrelladas y la vía de la bilis.',
  'Fisiología del hígado: doble irrigación, zonación, ALT y AST, el ciclo glucosa-alanina, la fábrica de proteínas, los ácidos biliares y NTCP, la bilirrubina y la tolerancia inmunitaria.',
  'Patrones de lesión: balonización, apoptosis y cuerpos de Councilman, necrosis confluente y en puente, colestasis, hepatitis aguda y crónica, interfase, grado y estadio, y la falla hepática aguda.',
  'El hígado en el laboratorio: destrucción frente a función, ALT y AST con sus vidas medias, el cociente de De Ritis, la bilirrubina mixta, la ictericia, la coluria, el INR y la albúmina.',
  'Hepatitis A y E: la vía fecal-oral, el VHA cuasienvuelto, su serología e histología, los genotipos del VHE, sus manifestaciones extrahepáticas, el diagnóstico y la prevención.',
  'El virus de la hepatitis B: la partícula de Dane, los señuelos subvirales, el genoma circular parcialmente bicatenario con cuatro genes solapados, sus proteínas, el HBeAg y los genotipos.',
  'El ciclo del VHB: HSPG y NTCP, endocitosis, el poro nuclear, el cccDNA, HBx contra Smc5/6, el pgARN, la retrotranscripción dentro de la cápside y la salida con sus señuelos.',
  'Inmunopatogenia del VHB: un virus sigiloso, los CD8 que matan sin matar, CD4 y anticuerpos, la edad y la cronicidad, la tolerancia por HBeAg, el agotamiento y la pregunta guía.',
  'Serología del VHB: cada marcador, la curva de la infección aguda, el período de ventana, los patrones de vacunado, curado y crónico, el anti-HBc aislado, el HBsAg cuantitativo y el tamizaje.',
  'Historia natural: las cuatro fases de EASL 2017 y la fase HBsAg negativa, los mutantes precore, la histología con vidrio esmerilado y dónde estaba el paciente 1.',
  'El brote del paciente 1: reagudización y no hepatitis aguda, la citólisis, el cociente de De Ritis, la IgM débil, la bilirrubina, el INR, los gatillos y la línea de la falla hepática aguda.',
  'Del virus al cáncer sin cirrosis: la inflamación crónica, la integración del ADN viral, la mutagénesis insercional, HBx, la aflatoxina y TP53, y la célula con ventaja clonal.',
  'El carcinoma: la ecografía del nódulo de 2,8 cm, el realce arterial y el lavado, por qué se biopsió, las trabéculas gruesas, la reticulina y la vigilancia cada seis meses.',
  'Tratamiento del VHB: metas, análogos de nucleótidos y nucleósidos, su mecanismo con el entecavir corregido, TDF y TAF, el interferón y el brote, lo que logran, lo que no y a quién tratar.',
  'Prevenir y lo nuevo en el VHB: la vacuna, la transmisión madre-hijo, el riesgo con rituximab, el bepirovirsen, ARN de interferencia y moduladores de la cápside, y la meta de 2030.',
  'Hepatitis D: el viroide con envoltura prestada, HDAg corto y largo, no replica sin HBsAg para salir, coinfección y sobreinfección, el Amazonas, su histología y el bulevirtide.',
  'El VHC: virus envuelto de ARN, la lipoviropartícula, CD81 y SR-BI, IRES y miR-122, una poliproteína de diez piezas, la membranous web, las cuasiespecies y los genotipos.',
  'Cómo se esconde el VHC: los sensores TLR, RIG-I y MDA5, la tijera NS3/4A, las NK, la respuesta adaptativa, el agotamiento, HVR1 y por qué el 70 % se cronifica.',
  'Caso 2: anti-VHC y ARN, la prueba refleja, los números del paciente 2, la fibrosis por Kupffer, TGF-β y células estrelladas, la histología del VHC, METAVIR, la ecografía y la elastografía.',
  'Crioglobulinemia mixta: E2 y CD81 en el linfocito B, los tipos I, II y III, la precipitación con el frío, C4 bajo, la vasculitis, el riñón y los nervios, y otras manifestaciones.',
  'Tratamiento del VHC y cierre: el interferón de antes, los antivirales directos, sofosbuvir y velpatasvir, otras pautas, la respuesta virológica sostenida, las interacciones y los dos pacientes lado a lado.',
];

// ─── 1. GUION.md ────────────────────────────────────────────────────────────────
const MAX_PALABRAS = 55;
const guion = readFileSync(join(RAIZ, 'docs/hepatitis-virales/GUION.md'), 'utf8').replace(/\r\n/g, '\n');
/** Los nombres de la columna «Cita» de la tabla Fuentes: una fuente entre paréntesis empieza por uno de ellos (o por «§» o es «T»). */
const CITAS = (guion.split('\n## Fuentes')[1] ?? '').split('\n---')[0].split('\n')
  .map((l) => l.match(/^\| ([^|]+?) \| .+ \|$/)?.[1]).filter((c) => c && c !== 'Cita' && !/^-+$/.test(c));
const esFuente = (item) => {
  const s = item.trim();
  return s.startsWith('§') || s === 'T' || CITAS.some((c) => s === c || s.startsWith(c + ' ') || s.startsWith(c + ','));
};
/** La celda del guion como texto de pantalla: sin marcas, fuentes ni notas para el revisor. */
const limpia = (t) => {
  let r = t
    .replace(/\*\*[^*]*(?:revisar|por confirmar)[^*]*\*\*\.?/gi, '')
    .replace(/\s*`\[(?:N|!|ACP)\]`/g, '')
    .replace(/\s*\(([^()]*)\)/g, (todo, dentro) => (dentro.split(';').every(esFuente) ? '' : todo));
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
  const rutaSpec = join(RAIZ, 'scripts/hepatitis-virales/tiempos', `c${c}.mjs`);
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

const destino = join(RAIZ, 'src/lib/data/hepatitis-virales/capitulos.ts');
if (SOLO && existsSync(destino)) console.log('(--caps: los capítulos que no se piden quedan vacíos; corre sin --caps para el archivo completo)');
writeFileSync(destino, `// GENERADO por scripts/hepatitis-virales/tiempos.mjs — no editar a mano: cambia
// scripts/hepatitis-virales/tiempos/c<n>.mjs (qué se anima y en qué palabra) o docs/hepatitis-virales/GUION.md
// (título y texto de cada paso) y vuelve a correrlo.
//
// Capítulos del laboratorio «Hepatitis virales». Solo en el servidor (a través de
// \`src/lib/hepatitis-virales/registro.ts\`): los de pago, y la URL de su voz, no viajan sin el plan.
//
// LA VOZ ES EL RELOJ: cada paso dura lo que su frase, y cada \`tejido\` entra en la palabra
// que lo nombra (segundos desde el inicio del paso, sacados de las marcas por palabra
// del audio con faster-whisper). El nombre del parámetro lleva «capítulo.paso.» y lo lee
// la lámina de ese paso (\`laminas/c<capítulo>.tsx\`). Guion: docs/hepatitis-virales/GUION.md.

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
console.log(`escrito src/lib/data/hepatitis-virales/capitulos.ts · ${salida.filter(Boolean).length} capítulos · ${total} animaciones`);
