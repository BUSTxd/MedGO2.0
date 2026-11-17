// Arma el banco de práctica del lab Tronco encefálico 3D.
//
//   npm run practica:tronco            valida y escribe data/tronco-practica/banco.json
//   npm run practica:tronco -- --subir además lo sube a examenes/neurologia/tronco-practica.json
//
// Copia el de Polígono de Willis 3D. La fuente (data/tronco-practica/preguntas.mjs)
// lleva las respuestas y no va a git. Aquí se valida contra el modelo (cada id
// existe y se puede tocar en la vista de su pregunta; en un corte, la
// estructura aparece de verdad a ese nivel), se mide el sesgo de largo de las
// alternativas (regla de CLAUDE.md: la correcta no puede ser la más larga ni
// la más corta en más de 1 de cada 10) y se barajan con una semilla fija por id.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ESTRUCTURAS } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/anatomia.ts';
import { NERVIO } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/nervios.ts';
import { INTERIOR } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/interior.ts';
import { NIVEL, calcularCorte } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/cortes.ts';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const FUENTE = path.join(RAIZ, 'data/tronco-practica/preguntas.mjs');
const SALIDA = path.join(RAIZ, 'data/tronco-practica/banco.json');
const CLAVE = 'neurologia/tronco-practica';

const fuente = (await import(pathToFileURL(FUENTE).href)).default;
const errores = [];
const err = (id, m) => errores.push(`${id}: ${m}`);

const CATS = new Set(['superficie', 'pares', 'nucleos', 'clinico']);
const TIPOS = new Set(['teorica', 'caso']);
const VISTAS = new Set(['superficie', 'nervios', 'nucleos', 'corte']);
const MIRAR = new Set(['anterior', 'lateral', 'posterior']);
const DEL_CEREBELO = new Set(['hemisferio_cerebeloso', 'vermis', 'amigdala_cerebelosa', 'floculo']);

// Qué estructuras aparecen en cada corte (para no pedir tocar lo que no está).
const enCorte = new Map();
function presentes(nivel) {
  if (!enCorte.has(nivel)) enCorte.set(nivel, new Set(calcularCorte(NIVEL[nivel].y, 40).ids.map((x) => x.id).filter(Boolean)));
  return enCorte.get(nivel);
}

/** ¿Se puede tocar (o marcar) este id en la vista de la pregunta? */
function validarIds(p, ids, campo) {
  if (!Array.isArray(ids) || !ids.length) { err(p.id, `${campo}: vacío`); return; }
  for (const id of ids) {
    if (p.vista === 'superficie') {
      if (!ESTRUCTURAS[id]) err(p.id, `${campo}: estructura desconocida «${id}»`);
      else if (DEL_CEREBELO.has(id)) err(p.id, `${campo}: «${id}» es del cerebelo (en la práctica está retirado)`);
    } else if (p.vista === 'nervios') {
      if (!NERVIO[id]) err(p.id, `${campo}: par craneal desconocido «${id}»`);
    } else {
      const x = INTERIOR[id];
      if (!x) err(p.id, `${campo}: núcleo o vía desconocido «${id}»`);
      else if (x.tipo === 'fibras') err(p.id, `${campo}: «${id}» son fibras de un par (no se dibujan en esta vista)`);
      else if (p.vista === 'corte' && p.nivel && !presentes(p.nivel).has(id)) err(p.id, `${campo}: «${id}» no aparece en el corte ${p.nivel}`);
    }
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
  if (!VISTAS.has(p.vista)) err(p.id, `vista «${p.vista}»`);
  if (!MIRAR.has(p.mirar)) err(p.id, `mirar «${p.mirar}»`);
  if (p.vista === 'corte' && !NIVEL[p.nivel]) err(p.id, `nivel de corte «${p.nivel}»`);
  if (p.vista !== 'corte' && p.nivel) err(p.id, 'nivel sin vista de corte');
  if (p.tipo === 'caso' && !p.caso) err(p.id, 'caso clínico sin viñeta');
  if (p.tipo === 'teorica' && p.caso) err(p.id, 'teórica con viñeta');
  if (!p.enunciado?.trim() || !p.explicacion?.trim() || !p.origen?.trim()) err(p.id, 'falta enunciado, explicación u origen');
  if (p.resaltar) validarIds(p, p.resaltar, 'resaltar');

  const q = { ...p };
  if (p.forma === 'senalar') {
    validarIds(p, p.objetivo, 'objetivo');
  } else if (p.forma === 'opciones') {
    const o = p.opciones ?? [];
    if (o.length !== 4) err(p.id, `debe tener 4 alternativas (tiene ${o.length})`);
    if (new Set(o.map((x) => x.trim().toLowerCase())).size !== o.length) err(p.id, 'alternativas repetidas');
    if (p.correcta !== 0) err(p.id, 'en la fuente la correcta va primero (correcta: 0)');
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
  const otras = L.slice(1);
  if (otras.every((x) => L[0] > x)) masLarga.push(p.id);
  if (otras.every((x) => L[0] < x)) masCorta.push(p.id);
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
console.log('  por vista:    ', cuenta((p) => p.vista));
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
