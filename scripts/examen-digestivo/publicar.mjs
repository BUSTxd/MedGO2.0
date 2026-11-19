/**
 * Examen práctico 3D de abdomen (Evaluación práctica 2 de Aparato Digestivo):
 * valida el banco y lo sube al bucket privado `examenes`.
 *
 *   node scripts/examen-digestivo/publicar.mjs [--subir]
 *
 * Fuente: data/examen-digestivo/preguntas.mjs (FUERA DE GIT: lleva la clave de
 * los exámenes reales). Comprueba, con el mismo corrector y la misma hidratación
 * que el navegador:
 * - que cada estructura señalada exista en el modelo (el manifiesto de la región
 *   `abdomen`, scripts/atlas-3d/salida/abdomen/manifiesto.json);
 * - que toda forma aceptada de la A pase y todo `noConfundir` falle;
 * - que cada respuesta B se reconozca escrita sola, que todas juntas den 1 y que
 *   con la A mal den 0;
 * - los casos de `DEBEN_VALER` (la clave tal cual se escribió) y `DEBEN_FALLAR`.
 * Deja data/examen-digestivo/banco.publicar.json y, con --subir, lo sube a
 * `examenes/digestivo/practico-abdomen.json` (clave de `EXAMENES`).
 */

import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..', '..');
const CLAVE = 'digestivo/practico-abdomen';
const FUENTE = path.join(RAIZ, 'data', 'examen-digestivo', 'preguntas.mjs');
const SALIDA = path.join(RAIZ, 'data', 'examen-digestivo', 'banco.publicar.json');
const MANIFIESTO = path.join(RAIZ, 'scripts', 'atlas-3d', 'salida', 'abdomen', 'manifiesto.json');

// Node importa TypeScript, pero no entiende el alias «@/» de Next ni las rutas sin extensión.
const src = pathToFileURL(path.join(RAIZ, 'src') + path.sep).href;
register('data:text/javascript,' + encodeURIComponent(`
  export async function resolve(s, c, n) {
    if (s.startsWith('@/')) return n(new URL(s.slice(2) + '.ts', ${JSON.stringify(src)}).href, c);
    if (s.startsWith('.') && !/\\.[a-z]+$/.test(s) && c.parentURL?.endsWith('.ts')) return n(s + '.ts', c);
    return n(s, c);
  }`));
const { indexarFormas, corregirA, corregirB } = await import(pathToFileURL(path.join(RAIZ, 'src', 'lib', 'examen-ms', 'corregir.ts')).href);
const { hidratarBanco, armarBarajas } = await import(pathToFileURL(path.join(RAIZ, 'src', 'lib', 'examen-ms', 'sesion.ts')).href);

if (!fs.existsSync(FUENTE)) throw new Error(`Falta la fuente (fuera de git): ${path.relative(RAIZ, FUENTE)}`);
const { BANCO, DEBEN_VALER = [], DEBEN_FALLAR = [] } = await import(pathToFileURL(FUENTE).href);
const publicado = { ...BANCO, generado: new Date().toISOString().slice(0, 10) };

const fallos = [];
const falla = (t) => fallos.push(t);

// ── El modelo trae lo que se señala ──────────────────────────────────────────
if (!fs.existsSync(MANIFIESTO)) throw new Error('Falta el manifiesto del abdomen: corre scripts/atlas-3d/abdomen/ (fuente → construir → empaquetar)');
const enModelo = new Set(JSON.parse(fs.readFileSync(MANIFIESTO, 'utf8')).piezas.map((p) => p.nombreEn));
for (const p of publicado.preguntas) for (const en of p.objetivo.en) if (!enModelo.has(en)) falla(`${p.id}: «${en}» no está en el modelo`);

// ── Estructura del banco ─────────────────────────────────────────────────────
const ids = new Set();
for (const p of publicado.preguntas) {
  if (ids.has(p.id)) falla(`${p.id}: id repetido`);
  ids.add(p.id);
  if (!publicado.categorias.includes(p.categoria)) falla(`${p.id}: categoría «${p.categoria}» fuera de la lista`);
  if (p.preguntaA.ref && !publicado.formas[p.preguntaA.ref]) falla(`${p.id}: la A apunta a «${p.preguntaA.ref}», que no está en el léxico`);
  for (const r of p.preguntaB.respuestas) if (r.ref && !publicado.formas[r.ref]) falla(`${p.id}: la B apunta a «${r.ref}», que no está en el léxico`);
  if (!p.preguntaB.todas && p.preguntaB.pide > p.preguntaB.respuestas.length) falla(`${p.id}: pide ${p.preguntaB.pide} y solo hay ${p.preguntaB.respuestas.length}`);
}
for (const b of publicado.barajas) for (const id of b.ids) if (!ids.has(id)) falla(`baraja ${b.numero}: ${id} no existe`);
if (publicado.barajas.flatMap((b) => b.ids).length !== publicado.preguntas.length) falla('hay preguntas fuera de las barajas (o repetidas)');

// ── Corrector: lo mismo que recibe el navegador ──────────────────────────────
const banco = hidratarBanco(publicado);
const indice = indexarFormas(banco.formas);
const porId = new Map(banco.preguntas.map((p) => [p.id, p]));
let comprobaciones = 0;
for (const p of banco.preguntas) {
  for (const f of p.preguntaA.aceptadas) { comprobaciones++; if (corregirA(f, p, indice).veredicto !== 'bien') falla(`${p.id} A: «${f}» no pasa`); }
  for (const f of p.preguntaA.noConfundir) { comprobaciones++; if (corregirA(f, p, indice).veredicto !== 'mal') falla(`${p.id} A: «${f}» (noConfundir) pasa`); }
  const b = p.preguntaB;
  b.respuestas.forEach((r, i) => {
    for (const f of [r.texto, ...r.aceptadas]) {
      comprobaciones++;
      const c = corregirB(f, p, true, indice);
      if (c.incorrectas.length || c.acertadas.length !== 1) falla(`${p.id} B: «${f}» no se reconoce como una respuesta (${JSON.stringify(c.incorrectas)})`);
      else if (c.acertadas[0].indice !== i) falla(`${p.id} B: «${f}» se cuenta como «${b.respuestas[c.acertadas[0].indice].texto}»`);
    }
  });
  comprobaciones++;
  const todas = corregirB(b.respuestas.map((r) => r.texto).join(', '), p, true, indice);
  if (todas.puntaje !== 1 || todas.incorrectas.length) falla(`${p.id} B: todas juntas dan ${todas.puntaje} (incorrectas ${JSON.stringify(todas.incorrectas)})`);
  comprobaciones++;
  if (corregirB(b.respuestas.map((r) => r.texto).join(', '), p, false, indice).puntaje !== 0) falla(`${p.id} B: con la A mal no da 0`);
}
for (const [id, texto] of DEBEN_VALER) {
  comprobaciones++;
  const c = corregirB(texto, porId.get(id), true, indice);
  if (c.puntaje !== 1) falla(`${id} B: «${texto}» debía valer (acierta ${c.acertadas.length}/${c.necesarias}, incorrectas ${JSON.stringify(c.incorrectas)})`);
}
for (const [id, texto] of DEBEN_FALLAR) {
  comprobaciones++;
  if (corregirB(texto, porId.get(id), true, indice).puntaje !== 0) falla(`${id} B: «${texto}» debía fallar`);
}

// Las barajas salen las del banco, en su orden.
const barajas = armarBarajas(banco);
if (barajas.length !== publicado.barajas.length || barajas.some((b, k) => b.preguntas.length !== publicado.barajas[k].ids.length)) falla('armarBarajas no respeta las barajas fijas');

console.log(`${comprobaciones} comprobaciones · ${fallos.length} fallos`);
if (fallos.length) {
  for (const f of fallos) console.log('  ✗', f);
  process.exit(1);
}
fs.writeFileSync(SALIDA, JSON.stringify(publicado));
console.log(`✓ ${publicado.preguntas.length} preguntas en ${barajas.length} barajas → ${path.relative(RAIZ, SALIDA)} (${(fs.statSync(SALIDA).size / 1e3).toFixed(1)} kB)`);
for (const b of barajas) console.log(`  ${b.numero}. ${b.nombre}: ${b.preguntas.map((p) => p.preguntaA.respuesta).join(' · ')}`);

if (process.argv.includes('--subir')) {
  const { createClient } = await import('@supabase/supabase-js');
  const { config } = await import(pathToFileURL(path.join(RAIZ, 'scripts', 'load-env.mjs')).href);
  const sb = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { error } = await sb.storage.from('examenes').upload(`${CLAVE}.json`, fs.readFileSync(SALIDA), { contentType: 'application/json', upsert: true });
  if (error) throw new Error(`No se pudo subir: ${error.message}`);
  console.log(`✓ subido a examenes/${CLAVE}.json`);
}
