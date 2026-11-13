// Arma el banco de práctica del lab Médula Espinal 3D.
//
//   npm run practica:medula            valida y escribe data/medula-practica/banco.json
//   npm run practica:medula -- --subir además lo sube a examenes/neurologia/medula-practica.json
//
// La fuente (data/medula-practica/preguntas.mjs) lleva las respuestas y no va a
// git. Aquí no hay respuestas: solo se valida contra anatomy.ts, se mide el
// sesgo de largo de las alternativas (regla de CLAUDE.md: la correcta no puede
// ser la más larga ni la más corta en más de 1 de cada 10) y se barajan las
// alternativas con una semilla fija por id.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  LAMINA_GROUPS, TRACTS, LEVELS, tractPresentAt,
} from '../../../src/app/dashboard/laboratorio/medula-espinal/engine/anatomy.ts';

const RAIZ = path.resolve(import.meta.dirname, '../../..');
const FUENTE = path.join(RAIZ, 'data/medula-practica/preguntas.mjs');
const SALIDA = path.join(RAIZ, 'data/medula-practica/banco.json');
const CLAVE = 'neurologia/medula-practica';

const fuente = (await import(pathToFileURL(FUENTE).href)).default;
const errores = [];
const avisos = [];
const err = (id, m) => errores.push(`${id}: ${m}`);

const CATS = new Set(['corte', 'tractos', 'clinico']);
const TIPOS = new Set(['teorica', 'caso']);
const VISTAS = new Set(['laminas', 'tractos']);

/** Deja solo los ids válidos (y, si son tractos, presentes en el nivel). */
function limpiarObjetivo(p, obj, campo) {
  if (!obj) return null;
  if (obj.kind === 'lamina') {
    for (const id of obj.ids) if (!(id in LAMINA_GROUPS)) err(p.id, `${campo}: lámina desconocida «${id}»`);
    return obj;
  }
  if (obj.kind === 'tract') {
    const ids = [];
    for (const id of obj.ids) {
      if (!(id in TRACTS)) { err(p.id, `${campo}: tracto desconocido «${id}»`); continue; }
      if (tractPresentAt(id, p.nivel)) ids.push(id);
      else if (campo === 'objetivo' && !p.id.startsWith('ts-')) err(p.id, `${campo}: «${id}» no existe en el nivel ${p.nivel}`);
    }
    return ids.length ? { kind: 'tract', ids } : null;
  }
  err(p.id, `${campo}: tipo desconocido`);
  return null;
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
  if (!(p.nivel in LEVELS)) err(p.id, `nivel «${p.nivel}»`);
  if (!VISTAS.has(p.vista)) err(p.id, `vista «${p.vista}»`);
  if (p.tipo === 'caso' && !p.caso) err(p.id, 'caso clínico sin viñeta');
  if (p.tipo === 'teorica' && p.caso) err(p.id, 'teórica con viñeta');
  if (!p.enunciado?.trim() || !p.explicacion?.trim() || !p.origen?.trim()) err(p.id, 'falta enunciado, explicación u origen');

  const q = { ...p };
  if (p.resaltar) {
    q.resaltar = limpiarObjetivo(p, p.resaltar, 'resaltar');
    if (!q.resaltar) delete q.resaltar;
  }

  if (p.forma === 'senalar') {
    q.objetivo = limpiarObjetivo(p, p.objetivo, 'objetivo');
    if (!q.objetivo) { avisos.push(`${p.id}: el tracto no existe en ${p.nivel}; se omite`); continue; }
    const debe = q.objetivo.kind === 'lamina' ? 'laminas' : 'tractos';
    if (p.vista !== debe) err(p.id, `para señalar ${q.objetivo.kind === 'lamina' ? 'láminas' : 'tractos'} la vista debe ser «${debe}»`);
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
console.log('  por nivel:    ', cuenta((p) => p.nivel));
console.log(`Sesgo de largo: correcta más larga ${pct(masLarga.length)} · más corta ${pct(masCorta.length)}`);
for (const a of avisos) console.log(`  · ${a}`);
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
