/**
 * Comprueba la narración de un lab contra su guion (fase 5 de docs/labs/ESTRUCTURA-GUION.md)
 * y escribe la tabla «Resumen» de NARRACION-ELEVENLABS.md.
 *
 *   node scripts/labs/comprobar-narracion.mjs <carpeta-de-docs> [--escribir]
 *   node scripts/labs/comprobar-narracion.mjs vasculitis-ic --escribir
 *
 * Comprueba: mismos capítulos y pasos en GUION.md y en la narración; etiquetas permitidas
 * (las de voz-lab/emociones-drama.json), al menos 3 distintas por paso y ninguna repetida
 * en el mismo paso; sin [grave] ni [tense]; sin cifras ni símbolos que la voz lea mal
 * (dígitos, %, °, /); largo de cada paso (aviso > 600 caracteres, el tope de «Escuchar en
 * vivo»). Mide los bytes que se envían a Fish con «Mejorar emociones» y el coste.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const [carpeta, ...flags] = process.argv.slice(2);
if (!carpeta) { console.error('Uso: node scripts/labs/comprobar-narracion.mjs <carpeta-de-docs> [--escribir]'); process.exit(1); }
const escribir = flags.includes('--escribir');

const fGuion = join(ROOT, 'docs', carpeta, 'GUION.md');
const fNarr = join(ROOT, 'docs', carpeta, 'NARRACION-ELEVENLABS.md');
const fEmo = join(homedir(), 'herramientas', 'voz-lab', 'emociones-drama.json');
const emociones = existsSync(fEmo) ? JSON.parse(readFileSync(fEmo, 'utf8')) : null;
if (!emociones) console.warn(`Aviso: no encontré ${fEmo}; no puedo medir los bytes enviados ni validar etiquetas contra él.`);

const CPS = 16.6;            // caracteres por segundo de voz (Sepsis, VIH, Hepatitis)
const PRECIO_PROMO = 10, PRECIO = 50; // US$ por millón de bytes, Drama 3

// --- guion: pasos por capítulo (filas «| n | ... |» bajo cada «## N · ») ---
const guion = readFileSync(fGuion, 'utf8');
const pasosGuion = new Map();
let cap = null;
for (const l of guion.split('\n')) {
  const h = l.match(/^## (\d+) · /);
  if (h) { cap = +h[1]; pasosGuion.set(cap, 0); continue; }
  if (/^## /.test(l)) { cap = null; continue; }
  if (cap !== null && /^\| \d+ \|/.test(l)) pasosGuion.set(cap, pasosGuion.get(cap) + 1);
}

// --- narración: bloques ---
const narr = readFileSync(fNarr, 'utf8');
const re = /\*\*Bloque (\w+) — pasos (\d+)[^\n]*?`([\w-]+)\.mp3`\*\*\s*\n+```text\n([\s\S]*?)```/g;
const bloques = [];
for (const m of narr.matchAll(re)) {
  const pasos = m[4].split(/\[long pause\]/i).map((t) => t.trim()).filter(Boolean);
  bloques.push({ id: m[1], desde: +m[2], pasos });
}

const errores = [], avisos = [];
const permitidas = new Set(emociones ? Object.keys(emociones).filter((k) => k !== 'long pause') : []);
const enviado = (t) => (emociones ? t.replace(/\[([^\]]+)\]/g, (todo, tag) => { const d = emociones[tag.trim().toLowerCase()]; return d ? `[${d}]` : todo; }) : t);

// pasos por capítulo en la narración (bloque «3A», «3B» → capítulo 3)
const pasosNarr = new Map();
const filas = [];
for (const b of bloques) {
  const c = +b.id.match(/^\d+/)[0];
  pasosNarr.set(c, (pasosNarr.get(c) ?? 0) + b.pasos.length);
  let car = 0, pal = 0, bytes = 0;
  b.pasos.forEach((p, i) => {
    const donde = `bloque ${b.id}, paso ${b.desde + i}`;
    const tags = [...p.matchAll(/\[([^\]]+)\]/g)].map((x) => x[1].trim().toLowerCase());
    for (const t of tags) {
      if (t === 'grave' || t === 'tense') errores.push(`${donde}: etiqueta prohibida [${t}]`);
      else if (emociones && !permitidas.has(t)) errores.push(`${donde}: etiqueta desconocida [${t}]`);
    }
    if (new Set(tags).size < 3) errores.push(`${donde}: solo ${new Set(tags).size} etiquetas distintas (mínimo 3)`);
    if (new Set(tags).size !== tags.length) errores.push(`${donde}: etiqueta repetida en el mismo paso`);
    const limpio = p.replace(/\[[^\]]+\]/g, '');
    const raros = limpio.match(/[0-9%°/]/g);
    if (raros) errores.push(`${donde}: cifras o símbolos que la voz lee mal: ${[...new Set(raros)].join(' ')}`);
    if (p.length > 600) avisos.push(`${donde}: ${p.length} caracteres (> 600, «Escuchar en vivo» lo recorta)`);
    car += limpio.trim().length;
    pal += limpio.trim().split(/\s+/).length;
    bytes += Buffer.byteLength(enviado(p));
  });
  const min = (car / CPS + b.pasos.length) / 60;
  filas.push({ id: b.id, pasos: b.pasos.length, pal, car, bytes, min });
}

const caps = new Set([...pasosGuion.keys(), ...pasosNarr.keys()]);
for (const c of [...caps].sort((a, b) => a - b)) {
  const g = pasosGuion.get(c) ?? 0, n = pasosNarr.get(c) ?? 0;
  if (g !== n) errores.push(`capítulo ${c}: ${g} pasos en el guion y ${n} en la narración`);
}

const tot = filas.reduce((a, f) => ({ pasos: a.pasos + f.pasos, pal: a.pal + f.pal, car: a.car + f.car, bytes: a.bytes + f.bytes, min: a.min + f.min }), { pasos: 0, pal: 0, car: 0, bytes: 0, min: 0 });
const tabla = [
  '| Bloque | Pasos | Palabras | Caracteres | Bytes | ≈ min |',
  '|---|---|---|---|---|---|',
  ...filas.map((f) => `| ${f.id} | ${f.pasos} | ${f.pal} | ${f.car} | ${f.bytes} | ${f.min.toFixed(1)} |`),
  `| **Total** | **${tot.pasos}** | **${tot.pal}** | **${tot.car}** | **${tot.bytes}** | **${tot.min.toFixed(1)}** |`,
  '',
  `Duración: **≈ ${tot.min.toFixed(1)} min**, estimada a ${String(CPS).replace('.', ',')} caracteres por segundo de voz más 1 s de pausa entre pasos. La real la dará el audio.`,
  '',
  `Coste con Drama 3: **US$ ${(tot.bytes / 1e6 * PRECIO_PROMO).toFixed(2)}** con la promoción (US$ ${PRECIO_PROMO} por millón de bytes, hasta el 30-11-2026) y US$ ${(tot.bytes / 1e6 * PRECIO).toFixed(2)} después (US$ ${PRECIO}). «Bytes» es lo que Voz Lab manda a Fish con «Mejorar emociones».`,
].join('\n');

console.log(tabla, '\n');
console.log(`Capítulos: ${caps.size} · pasos en el guion: ${[...pasosGuion.values()].reduce((a, b) => a + b, 0)} · en la narración: ${tot.pasos}`);
for (const a of avisos) console.log('AVISO ', a);
for (const e of errores) console.log('ERROR ', e);
if (!errores.length) console.log('Sin errores.');

if (escribir) {
  const nuevo = narr.replace(/## Resumen\n[\s\S]*?\n---\n/, `## Resumen\n\n${tabla}\n\n---\n`);
  if (nuevo === narr) console.log('No encontré la sección «## Resumen … ---» para escribir la tabla.');
  else { writeFileSync(fNarr, nuevo); console.log('Tabla «Resumen» escrita en la narración.'); }
}
process.exit(errores.length ? 1 : 0);
