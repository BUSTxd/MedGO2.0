/** node scripts/verificar-examenes-estudio.mjs — conteos, filtros e identidades entre años. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();
// Carga módulos de datos TS con los mismos alias de Next, sin ejecutar servicios externos.
function cargar(nombre, desde = raiz) {
  if (nombre === 'server-only') return {};
  let archivo = nombre.startsWith('@/') ? path.join(raiz, 'src', nombre.slice(2)) : path.resolve(desde, nombre);
  if (!path.extname(archivo)) archivo = fs.existsSync(`${archivo}.ts`) ? `${archivo}.ts` : path.join(archivo, 'index.ts');
  if (cache.has(archivo)) return cache.get(archivo);
  const exports = {};
  cache.set(archivo, exports);
  const { outputText } = ts.transpileModule(fs.readFileSync(archivo, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  new Function('require', 'exports', outputText)((s) => cargar(s, path.dirname(archivo)), exports);
  return exports;
}

const { catalogoExamenes, sesionExamen } = cargar('@/lib/estudio/examenes');
const { combinarPreguntasEncib, claveSesionEncib, vistaPreguntasEncib } = cargar('@/lib/examen/encib-sesion');
const { alternarMateria } = cargar('@/lib/estudio/seleccion-examenes');
const { PREGUNTAS } = cargar('@/lib/data/encib/preguntas');
const catalogo = catalogoExamenes();
const temas = catalogo.areas.flatMap((a) => a.temas);
assert.equal(temas.reduce((n, t) => n + Object.values(t.porAnio).reduce((s, v) => s + v, 0), 0), 300);
assert.deepEqual(catalogo.anios, [2025, 2024, 2021]);
assert.equal(new Set(temas.map((t) => t.codigo)).size, temas.length);
for (const anio of catalogo.anios) {
  assert.equal(temas.reduce((n, t) => n + (t.porAnio[anio] ?? 0), 0), 100);
}

const grupos = catalogo.anios.map((anio) => {
  const archivo = path.join(raiz, 'data', 'encib', `${anio}.json`);
  const preguntas = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo, 'utf8')).questions
    : PREGUNTAS.filter((q) => q.anio === anio).map((q) => ({ id: `q${q.n}`, n: q.n, codigo: q.codigo, stem: 'Prueba', options: [] }));
  assert.equal(preguntas.length, 100);
  for (const q of preguntas) assert.equal(q.codigo, PREGUNTAS.find((p) => p.anio === anio && p.n === q.n)?.codigo);
  return { anio, preguntas };
});
const todas = combinarPreguntasEncib(grupos, []);
assert.equal(todas.length, 300);
assert.equal(new Set(todas.map((q) => q.id)).size, 300, 'Los ids de años distintos no pueden colisionar');
assert.equal(grupos[0].preguntas[0].id, 'q1', 'No mutar el banco original');
const idsOriginales = todas.map((q) => q.id);
const porCursos = vistaPreguntasEncib(todas, true, null, catalogo.areas);
assert.equal(porCursos.length, 300);
assert.deepEqual(new Set(porCursos.map((q) => q.id)), new Set(idsOriginales));
assert.deepEqual(todas.map((q) => q.id), idsOriginales, 'Agrupar no debe mutar el orden original');
const visitadas = new Set();
let anterior;
for (const q of porCursos) {
  const curso = q.codigo.split('-')[0];
  if (curso !== anterior) {
    assert.ok(!visitadas.has(curso), 'Las preguntas de cada curso deben quedar contiguas');
    visitadas.add(curso); anterior = curso;
  }
}
for (const a of catalogo.areas) {
  const filtradas = vistaPreguntasEncib(todas, true, a.codigo, catalogo.areas);
  assert.deepEqual(new Set(filtradas.map((q) => q.id)), new Set(todas.filter((q) => q.codigo.startsWith(`${a.codigo}-`)).map((q) => q.id)));
  assert.deepEqual(vistaPreguntasEncib(todas, false, a.codigo, catalogo.areas).map((q) => q.id), idsOriginales, 'Desactivar la separación debe restaurar todas');
}
const respondida = porCursos[30];
const respuestas = { [respondida.id]: respondida.options[0]?.id ?? 'a' };
assert.equal(respuestas[vistaPreguntasEncib(todas, false, null, catalogo.areas).find((q) => q.id === respondida.id).id], respuestas[respondida.id], 'Cambiar vista conserva identidad de respuesta');
for (const tema of temas) {
  for (const anio of ['todos', ...catalogo.anios.map(String)]) {
    const sesion = sesionExamen({ iniciar: '1', anios: anio, temas: tema.codigo }, catalogo);
    const esperadas = (anio === 'todos' ? catalogo.anios : [Number(anio)]).reduce((n, y) => n + (tema.porAnio[y] ?? 0), 0);
    if (!esperadas) { assert.equal(sesion, null); continue; }
    assert.ok(sesion);
    assert.equal(combinarPreguntasEncib(grupos.filter((g) => sesion.anios.includes(g.anio)), sesion.codigos).length, esperadas);
  }
}
for (const params of [
  {}, { iniciar: '1' }, { iniciar: '1', anios: '1900', temas: 'todos' },
  { iniciar: '1', anios: 'todos', temas: 'desconocido' }, { iniciar: '1', anios: 'todos', temas: '' },
  { iniciar: '1', anios: ['2025', '2024'], temas: 'todos' },
]) assert.equal(sesionExamen(params, catalogo), null);
assert.deepEqual(sesionExamen({ iniciar: '1', anios: 'todos', temas: 'todos' }, catalogo), { anios: catalogo.anios, codigos: [] });
const seleccion = temas.slice(0, 3).map((t) => t.codigo);
assert.equal(combinarPreguntasEncib(grupos, seleccion).length, temas.slice(0, 3).reduce((n, t) => n + Object.values(t.porAnio).reduce((s, v) => s + v, 0), 0));
assert.equal(claveSesionEncib({ anios: [2024, 2025], codigos: seleccion }), claveSesionEncib({ anios: [2025, 2024], codigos: [...seleccion].reverse() }));
assert.notEqual(claveSesionEncib({ anios: [2025], codigos: [] }), claveSesionEncib({ anios: [2025], codigos: seleccion }));
const anatomia = catalogo.areas.find((a) => a.codigo === 'ANA').temas.map((t) => t.codigo);
const fuera = temas.find((t) => !anatomia.includes(t.codigo)).codigo;
assert.deepEqual(alternarMateria([fuera, anatomia[0]], anatomia), [fuera, ...anatomia]);
assert.deepEqual(alternarMateria([fuera, ...anatomia], anatomia), [fuera]);
assert.equal(combinarPreguntasEncib(grupos, alternarMateria([], anatomia)).length, 35);
assert.equal(new Set(alternarMateria([anatomia[0]], anatomia)).size, anatomia.length);
for (const anio of catalogo.anios) {
  const codigos = catalogo.areas.find((a) => a.codigo === 'ANA').temas.filter((t) => t.porAnio[anio] > 0).map((t) => t.codigo);
  const elegidos = alternarMateria([], codigos);
  if (!codigos.length) {
    assert.equal(sesionExamen({ iniciar: '1', anios: String(anio), temas: '' }, catalogo), null);
    continue;
  }
  assert.ok(sesionExamen({ iniciar: '1', anios: String(anio), temas: elegidos.join(',') }, catalogo));
  assert.equal(combinarPreguntasEncib(grupos.filter((g) => g.anio === anio), elegidos).length, PREGUNTAS.filter((q) => q.anio === anio && q.codigo.startsWith('ANA-')).length);
}
console.log(`Exámenes: 300 preguntas, ${temas.length} temas, 3 años. Conteos, filtros, URLs inválidas, ids y selección de materias verificados.`);
