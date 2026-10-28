/**
 * Verifica que el catálogo del planificador esté en orden en cada curso que lo
 * ofrece (`CURSOS_CON_PLAN` de `src/lib/estudio/indice.ts`):
 *
 *   npm run verificar:catalogo            (o --curso inmunologia)
 *
 * Errores (cortan con código 1):
 *  - el índice del bucket no existe o quedó viejo: un resumen cambió, el sílabo
 *    tiene una clase o un resumen que el índice no conoce, o la tabla de temas
 *    tiene un tema que el índice no;
 *  - un tema apunta a un subtítulo (`secciones`) que ya no existe (se renombró);
 *  - un `banqueo`/`tarjetas` propio de un tema no está en `EXAMENES` o no está en el bucket.
 * Informe (no corta): temas sin práctica propia ni preguntas, sin subtítulos, etc.
 *
 * La lista de pasos al añadir material está en CLAUDE.md («Planificador y catálogo por tema»).
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  RAIZ, bajarIndice, bajarResumen, cargarExamenesAcceso, cargarPractica, cargarSilabo, cargarTemas,
  clavesDePractica, hash, opcionesDeResumen, resumenesHtml,
} from './comun.mjs';

const args = process.argv.slice(2);
const SOLO = args.includes('--curso') ? args[args.indexOf('--curso') + 1] : null;

function cursosConPlan() {
  const txt = readFileSync(path.join(RAIZ, 'src', 'lib', 'estudio', 'indice.ts'), 'utf8');
  const m = txt.match(/CURSOS_CON_PLAN = new Set\(\[([^\]]*)\]\)/);
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
}

const errores = [];
const avisos = [];
const err = (c, m) => errores.push(`${c}: ${m}`);
const avisa = (c, m) => avisos.push(`${c}: ${m}`);

const EXAMENES = await cargarExamenesAcceso();
const htmls = resumenesHtml();
const cursos = SOLO ? [SOLO] : cursosConPlan();
if (!cursos.length) { console.error('No hay cursos en CURSOS_CON_PLAN.'); process.exit(1); }

for (const curso of cursos) {
  console.log(`\n${curso}`);
  const indice = await bajarIndice(curso);
  if (!indice) { err(curso, 'no hay índice en el bucket: corre scripts/estudio/indexar-curso.mjs --curso ' + curso); continue; }
  const semanas = await cargarSilabo(curso);
  const tabla = (await cargarTemas(curso)) ?? {};
  const clasesIdx = new Map(indice.clases.map((c) => [c.id, c]));
  const secciones = new Set(indice.clases.flatMap((c) => c.resumenes.flatMap((r) => r.secciones.map((s) => s.id))));
  console.log(`  índice del ${indice.generado.slice(0, 10)} · ${indice.clases.length} clases · ${secciones.size} subtítulos · ${Object.keys(indice.temas).length} temas`);

  // 1. El índice conoce todo lo del sílabo y está al día con cada resumen.
  let revisados = 0;
  for (const semana of semanas ?? []) {
    for (const act of semana.actividades ?? []) {
      const k = clasesIdx.get(act.id);
      if (!k) { err(curso, `la clase «${act.id}» del sílabo no está en el índice (índice viejo)`); continue; }
      for (const op of opcionesDeResumen(act)) {
        const r = k.resumenes.find((x) => x.id === op.id);
        if (!r) { err(curso, `el resumen «${op.id}» de ${act.id} no está en el índice (índice viejo)`); continue; }
        if (op.formato !== 'html' || !r.hash) continue;
        const html = await bajarResumen(htmls.get(op.id) ?? '');
        revisados++;
        if (html && hash(html) !== r.hash) err(curso, `el resumen «${op.id}» cambió desde que se indexó (índice viejo)`);
      }
      for (const { key } of clavesDePractica(act)) {
        if (!k.practica.some((p) => p.key === key)) err(curso, `el banqueo «${key}» de ${act.id} no está en el índice (índice viejo)`);
      }
    }
  }
  console.log(`  ${revisados} resúmenes comparados con el bucket`);

  // 2. La tabla de temas y lo que cuelga de ella.
  const sinPractica = [];
  const sinSecciones = [];
  for (const [id, t] of Object.entries(tabla)) {
    if (!indice.temas[id]) err(curso, `el tema «${id}» de la tabla no está en el índice (índice viejo)`);
    for (const s of t.secciones ?? []) {
      if (!secciones.has(s)) err(curso, `el tema «${id}» apunta al subtítulo «${s}», que no existe (¿se renombró?)`);
    }
    for (const campo of ['banqueo', 'tarjetas']) {
      const key = t[campo];
      if (!key) continue;
      if (!EXAMENES[key]) err(curso, `el ${campo} «${key}» del tema «${id}» no está en EXAMENES (src/lib/data/examenes-acceso.ts)`);
      if (!(await cargarPractica(key))) err(curso, `el ${campo} «${key}» del tema «${id}» no está ni en scripts/examenes/ ni en el bucket`);
    }
    const it = indice.temas[id];
    if (it && !t.banqueo && !t.tarjetas && it.preguntas === 0) sinPractica.push(id);
    if (it && !it.secciones.length) sinSecciones.push(id);
  }
  const propios = Object.values(tabla).filter((t) => t.banqueo || t.tarjetas).length;
  console.log(`  ${propios} de ${Object.keys(tabla).length} temas con banqueo o tarjetas propios (el resto usa el quiz de la clase filtrado por tema)`);
  if (sinPractica.length) avisa(curso, `temas sin ninguna pregunta: ${sinPractica.join(', ')}`);
  if (sinSecciones.length) avisa(curso, `temas sin subtítulos (el plan leerá la clase entera): ${sinSecciones.join(', ')}`);
  const trozos = indice.clases.flatMap((c) => c.resumenes.filter((r) => r.calidad === 'trozos').map((r) => r.id));
  if (trozos.length) avisa(curso, `resúmenes sin subtítulos (se leen por partes): ${trozos.join(', ')}`);
}

console.log('');
if (avisos.length) {
  console.log(`Informe (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
  console.log('');
}
if (errores.length) {
  console.error(`ERRORES (${errores.length}):`);
  for (const e of errores.slice(0, 40)) console.error(`  ✕ ${e}`);
  if (errores.some((e) => e.includes('índice viejo'))) console.error('\n  → Vuelve a indexar: node --experimental-strip-types --no-warnings scripts/estudio/indexar-curso.mjs --curso <curso>');
  process.exit(1);
}
console.log('✓ Catálogo en orden.');
