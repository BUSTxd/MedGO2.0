/**
 * Revisa que cada palabra clave de `tiempos/c<n>.mjs` haya caído en la palabra que se quería.
 *
 *   node scripts/sepsis/revisar-claves.mjs --dir <salida de preparar-narracion>
 *
 * `tiempos.mjs` empareja la clave con lo que oyó Whisper de forma liberal (`coincide`): la clave puede
 * ser PREFIJO de la palabra, estar a una letra de distancia, o (si tiene 7 o más letras) coincidir en sus
 * primeras letras. Por eso una clave puede caer en una palabra ANTERIOR parecida y la animación sale
 * en otro momento: «ulcera» en «ulceras», «sifilis» en «sifilitico», «embarazo» en «embarazada»,
 * «negativa» en «negativos», «treponema» en «treponemicas», «alergia» en «alergico», «aprobada» en
 * «aprobado», «resiste» en «resistencia». El arreglo es pedir la repetición correcta: «ulcera#2».
 *
 * Este script avisa de dos cosas:
 *   1. SOSPECHOSO: la clave casó solo de forma aproximada y hay, más adelante en el mismo paso, una palabra
 *      exactamente igual (casi seguro quería esa).
 *   2. COINCIDENCIA: dos parámetros distintos de un paso arrancan en el mismo instante (suelen ser dos claves
 *      casadas con la misma palabra). Lee `capitulos.ts`, así que hay que correr antes `tiempos.mjs`.
 *
 * Sale con código 1 si encuentra algo.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? null : process.argv[i + 1]; };
const dir = arg('dir');
if (!dir) { console.error('Uso: --dir <salida de preparar-narracion>'); process.exit(1); }

const palabras = JSON.parse(readFileSync(join(dir, 'palabras.json'), 'utf8'));
const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};
// Misma regla que `coincide` de tiempos.mjs.
const coincide = (palabra, clave) => {
  if (palabra === clave) return true;
  if (clave.length >= 4 && palabra.startsWith(clave)) return true;
  if (clave.length >= 5 && lev(palabra, clave) <= 1) return true;
  if (clave.length >= 7 && palabra.length >= clave.length && lev(palabra.slice(0, clave.length), clave) <= 1) return true;
  return false;
};

let problemas = 0, aproximadas = 0;

// 1. Claves aproximadas con una exacta más adelante.
for (let c = 0; c <= 16; c++) {
  const ruta = join(RAIZ, 'scripts/sepsis/tiempos', `c${c}.mjs`);
  if (!existsSync(ruta)) continue;
  const spec = (await import(pathToFileURL(ruta).href)).default;
  const pc = palabras.find((x) => x.cap === c);
  if (!pc) continue;
  spec.forEach((paso, i) => {
    const lista = pc.pasos[i] ?? [];
    const ns = lista.map(([w]) => norm(w));
    for (const [nombre, clave] of paso) {
      if (typeof clave === 'number') continue;
      const m = String(clave).match(/^(.*?)(?:#(\d+))?$/);
      const veces = Number(m[2] ?? 1);
      const claves = m[1].trim().split(/\s+/).map(norm).filter(Boolean);
      let hallado = 0, idx = -1;
      for (let k = 0; k + claves.length <= ns.length; k++) {
        if (claves.every((q, j) => coincide(ns[k + j], q)) && ++hallado === veces) { idx = k; break; }
      }
      if (idx < 0) continue;
      if (claves.every((q, j) => ns[idx + j] === q)) continue;
      aproximadas++;
      const mas = ns.findIndex((w, k) => k > idx && claves.length === 1 && w === claves[0]);
      if (mas >= 0) {
        problemas++;
        console.log(`SOSPECHOSO c${c}.${i} «${nombre}» (clave «${clave}») casó con «${lista[idx][0]}»@${lista[idx][1]}, pero hay «${lista[mas][0]}»@${lista[mas][1]}: prueba «${claves[0]}#2»`);
      }
    }
  });
}

// 2. Dos parámetros distintos del mismo paso que arrancan a la vez.
const generado = readFileSync(join(RAIZ, 'src/lib/data/sepsis/capitulos.ts'), 'utf8');
for (const linea of generado.split('\n')) {
  const m = linea.match(/paso\((\d+), (\d+), "([^"]*)"/);
  if (!m) continue;
  const anim = [...linea.matchAll(/\["([a-z0-9_]+)", *([0-9.]+), *([0-9.]+)\]/g)].map((x) => ({ n: x[1], at: +x[2] }));
  const por = new Map();
  for (const a of anim) { if (!por.has(a.at)) por.set(a.at, []); por.get(a.at).push(a.n); }
  for (const [at, ns] of por) if (ns.length > 1) { problemas++; console.log(`COINCIDENCIA c${m[1]}.${m[2]} «${m[3]}» @${at}s → ${ns.join(', ')}`); }
}

console.log(`claves aproximadas: ${aproximadas} · problemas: ${problemas}`);
process.exit(problemas ? 1 : 0);
