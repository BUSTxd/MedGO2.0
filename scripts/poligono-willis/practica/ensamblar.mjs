// Arma el banco de práctica del lab Polígono de Willis 3D.
//
//   npm run practica:willis            valida y escribe data/willis-practica/banco.json
//   npm run practica:willis -- --subir además lo sube a examenes/neurologia/willis-practica.json
//
// Copia el de Médula Espinal 3D. La fuente (data/willis-practica/preguntas.mjs)
// lleva las respuestas y no va a git. Aquí se valida contra engine/anatomia.ts,
// se mide el sesgo de largo de las alternativas (regla de CLAUDE.md: la
// correcta no puede ser la más larga ni la más corta en más de 1 de cada 10) y
// se barajan las alternativas con una semilla fija por id.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ARTERIAS } from '../../../src/app/dashboard/laboratorio/poligono-willis/engine/anatomia.ts';

const RAIZ = path.resolve(import.meta.dirname, '../../..');
const FUENTE = path.join(RAIZ, 'data/willis-practica/preguntas.mjs');
const SALIDA = path.join(RAIZ, 'data/willis-practica/banco.json');
const CLAVE = 'neurologia/willis-practica';

/** Arterias que solo se ven en «Posición real» (el cuello). */
const SOLO_CUELLO = new Set(['carotida_comun']);

const fuente = (await import(pathToFileURL(FUENTE).href)).default;
const errores = [];
const err = (id, m) => errores.push(`${id}: ${m}`);

const CATS = new Set(['anatomia', 'territorios', 'clinico']);
const TIPOS = new Set(['teorica', 'caso']);
const POSTURAS = new Set(['atlas', 'real']);

function validarArterias(p, ids, campo) {
  if (!Array.isArray(ids) || !ids.length) { err(p.id, `${campo}: vacío`); return; }
  for (const id of ids) {
    if (!(id in ARTERIAS)) err(p.id, `${campo}: arteria desconocida «${id}»`);
    if (SOLO_CUELLO.has(id) && p.postura !== 'real') err(p.id, `${campo}: «${id}» solo se ve en postura «real»`);
  }
}

// Semilla fija por id → barajado estable entre ensamblados.
function semilla(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const ids = new Set();
const banco = [];
for (const p of fuente) {
  if (ids.has(p.id)) err(p.id, 'id repetido');
  ids.add(p.id);
  if (!CATS.has(p.categoria)) err(p.id, `categoría «${p.categoria}»`);
  if (!TIPOS.has(p.tipo)) err(p.id, `tipo «${p.tipo}»`);
  if (!POSTURAS.has(p.postura)) err(p.id, `postura «${p.postura}»`);
  if (p.tipo === 'caso' && !p.caso) err(p.id, 'caso clínico sin viñeta');
  if (p.tipo === 'teorica' && p.caso) err(p.id, 'teórica con viñeta');
  if (!p.enunciado?.trim() || !p.explicacion?.trim() || !p.origen?.trim()) err(p.id, 'falta enunciado, explicación u origen');
  if (p.resaltar) validarArterias(p, p.resaltar, 'resaltar');

  const q = { ...p };
  if (p.forma === 'senalar') {
    validarArterias(p, p.objetivo, 'objetivo');
  } else if (p.forma === 'opciones') {
    const o = p.opciones ?? [];
    if (o.length !== 4) err(p.id, `debe tener 4 alternativas (tiene ${o.length})`);
    if (new Set(o.map((x) => x.trim().toLowerCase())).size !== o.length) err(p.id, 'alternativas repetidas');
    if (p.correcta !== 0) err(p.id, 'en la fuente la correcta va primero (correcta: 0)');
    // Barajado estable: la correcta cambia de lugar.
    const rnd = semilla(p.id);
    const orden = o.map((_, i) => i);
    for (let i = orden.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    q.opciones = orden.map((i) => o[i]);
    q.correcta = orden.indexOf(0);
  } else {
    err(p.id, `forma «${p.forma}»`);
  }
  banco.push(q);
}

// ── Sesgo de largo (solo alternativas) ───────────────────────────────────────
const conOpciones = fuente.filter((p) => p.forma === 'opciones');
const largo = (s) => s.trim().length;
const masLarga = [];
const masCorta = [];
for (const p of conOpciones) {
  const L = p.opciones.map(largo);
  const c = L[0];
  const otras = L.slice(1);
  if (otras.every((x) => c > x)) masLarga.push(p.id);
  if (otras.every((x) => c < x)) masCorta.push(p.id);
}
const n = conOpciones.length;
const pct = (k) => `${k}/${n} (${((100 * k) / n).toFixed(0)} %)`;
if (masLarga.length > n / 10) err('sesgo', `la correcta es la más larga en ${pct(masLarga.length)}: ${masLarga.join(', ')}`);
if (masCorta.length > n / 10) err('sesgo', `la correcta es la más corta en ${pct(masCorta.length)}: ${masCorta.join(', ')}`);

// ── Resumen ──────────────────────────────────────────────────────────────────
const cuenta = (f) => banco.reduce((m, p) => ((m[f(p)] = (m[f(p)] ?? 0) + 1), m), {});
console.log(`Preguntas: ${banco.length}`);
console.log('  por categoría:', cuenta((p) => p.categoria));
console.log('  por tipo:     ', cuenta((p) => p.tipo));
console.log('  por forma:    ', cuenta((p) => p.forma));
console.log('  por postura:  ', cuenta((p) => p.postura));
console.log('  por origen:   ', cuenta((p) => (p.origen === 'propia' ? 'propia' : p.origen.split(' ')[0])));
console.log(`Sesgo de largo: correcta más larga ${pct(masLarga.length)} · más corta ${pct(masCorta.length)}`);
if (errores.length) {
  console.error(`\n✗ ${errores.length} errores:`);
  for (const e of errores) console.error(`  ${e}`);
  process.exit(1);
}

fs.writeFileSync(SALIDA, JSON.stringify({ version: 1, generado: new Date().toISOString(), preguntas: banco }, null, 1));
console.log(`\n✓ ${path.relative(RAIZ, SALIDA)}`);

if (process.argv.includes('--subir')) {
  const r = spawnSync(process.execPath, [path.join(RAIZ, 'scripts/upload-examen.mjs'), SALIDA, `${CLAVE}.json`], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
