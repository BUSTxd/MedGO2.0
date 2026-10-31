/**
 * Arma los 5 banqueos por tema del Segundo examen de Epidemiología (Módulo II).
 *
 *   node scripts/epidemiologia-u2/ensamblar.mjs [--cobertura]
 *
 * Lee `data/epidemiologia-u2/banco/<tema>.json` (fuera de git: son respuestas) y
 * escribe `data/epidemiologia-u2/salida/parcial-2-<tema>.json`, lo que se sube con
 * `node scripts/upload-examen.mjs`. Cualquier error corta con código 1.
 *
 * Cada pregunta del banco:
 *   { id, origen: 'real' | 'nueva', ref?, datos?: string[], subtema, stem,
 *     options: [{ text, correct? }], explanation, reviewNote? }
 *
 * Orden de salida: se recorren los subtemas por turnos y, dentro de cada uno, se
 * alternan reales y nuevas, de modo que la mitad abierta (`muestra`) toque todos
 * los subtemas. El id de la pregunta no depende de la posición: reordenar no
 * rompe el historial de los alumnos.
 *
 * `--cobertura` exige además que cada dato de `digest.md` tenga pregunta, salvo
 * los listados en `datos-excluidos.json`.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATOS = join(RAIZ, 'data', 'epidemiologia-u2');
const SALIDA = join(DATOS, 'salida');

const TEMAS = {
  'mci-nino-joven': 'MCI: niño a joven',
  'mci-adulto-gestante': 'MCI: adulto y gestante',
  paifam: 'PAIFAM',
  'esn-generales': 'ESN: nutrición, vacunas, ocular',
  'esn-danos': 'ESN: ENT, TB, metaxénicas, SSR',
};

const errores = [];
const normalizar = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

/** Una explicación no puede citar letras: el runner baraja las alternativas. */
const CITA_LETRA = /\b(?:alternativa|opci[oó]n|inciso|respuesta)\s+[a-d]\b|(?:^|\s)[a-dA-D]\)/;

/** Subtemas por turnos; dentro de cada uno, real y nueva alternadas. */
function ordenar(preguntas) {
  const colas = new Map();
  for (const q of preguntas) {
    if (!colas.has(q.subtema)) colas.set(q.subtema, { real: [], nueva: [] });
    colas.get(q.subtema)[q.origen].push(q);
  }
  const turnos = [...colas.values()].map(({ real, nueva }) => {
    const mezcla = [];
    while (real.length || nueva.length) {
      if (real.length) mezcla.push(real.shift());
      if (nueva.length) mezcla.push(nueva.shift());
    }
    return mezcla;
  });
  const orden = [];
  while (turnos.some((t) => t.length)) for (const t of turnos) if (t.length) orden.push(t.shift());
  return orden;
}

const idsVistos = new Set();
const stemsVistos = new Map();
const datosUsados = new Set();
const resumen = [];
mkdirSync(SALIDA, { recursive: true });

for (const [tema, label] of Object.entries(TEMAS)) {
  const archivo = join(DATOS, 'banco', `${tema}.json`);
  if (!existsSync(archivo)) {
    errores.push(`${tema}: falta ${archivo}`);
    continue;
  }
  const banco = JSON.parse(readFileSync(archivo, 'utf8'));
  let larga = 0;
  let corta = 0;
  let nuevas = 0;
  let realesLarga = 0;
  let reales = 0;

  for (const q of banco) {
    const donde = `${tema}/${q.id}`;
    if (!q.id || idsVistos.has(q.id)) errores.push(`${donde}: id ausente o repetido`);
    idsVistos.add(q.id);
    if (q.origen !== 'real' && q.origen !== 'nueva') errores.push(`${donde}: origen inválido`);
    if (!q.subtema) errores.push(`${donde}: sin subtema`);
    if (!q.explanation?.trim()) errores.push(`${donde}: sin explicación`);
    if (CITA_LETRA.test(q.explanation ?? '')) errores.push(`${donde}: la explicación cita una letra`);
    if (q.image && !/^https:\/\//.test(q.image)) errores.push(`${donde}: imagen sin URL`);

    const clave = normalizar(q.stem ?? '');
    if (!clave) errores.push(`${donde}: sin enunciado`);
    if (stemsVistos.has(clave)) errores.push(`${donde}: mismo enunciado que ${stemsVistos.get(clave)}`);
    stemsVistos.set(clave, donde);

    const correctas = (q.options ?? []).filter((o) => o.correct === true);
    if (correctas.length !== 1) errores.push(`${donde}: ${correctas.length} correctas`);
    if ((q.options ?? []).length < 2) errores.push(`${donde}: menos de 2 alternativas`);
    if (new Set((q.options ?? []).map((o) => normalizar(o.text))).size !== (q.options ?? []).length) {
      errores.push(`${donde}: alternativas repetidas`);
    }
    for (const d of q.datos ?? []) datosUsados.add(d);

    if (correctas.length === 1) {
      const largos = q.options.map((o) => o.text.length);
      const n = correctas[0].text.length;
      const esLarga = n === Math.max(...largos);
      const esCorta = n === Math.min(...largos);
      if (q.origen === 'nueva') {
        nuevas++;
        if (esLarga) larga++;
        if (esCorta) corta++;
      } else {
        reales++;
        if (esLarga) realesLarga++;
      }
    }
  }

  const tope = Math.floor(nuevas / 10);
  if (larga > tope) errores.push(`${tema}: la correcta es la más larga en ${larga} de ${nuevas} nuevas (tope ${tope})`);
  if (corta > tope) errores.push(`${tema}: la correcta es la más corta en ${corta} de ${nuevas} nuevas (tope ${tope})`);

  const orden = ordenar(banco);
  const questions = orden.map((q) => ({
    id: q.id,
    stem: q.stem,
    options: q.options.map((o, i) => ({
      id: 'abcdefgh'[i],
      text: o.text,
      correct: o.correct === true,
    })),
    explanation: q.explanation,
    tema,
    subtema: q.subtema,
    ...(q.image ? { image: q.image } : {}),
    ...(q.reviewNote ? { reviewNote: q.reviewNote } : {}),
  }));
  const muestra = Math.ceil(questions.length / 2);
  const key = `epidemiologia/parcial-2-${tema}`;
  writeFileSync(
    join(SALIDA, `parcial-2-${tema}.json`),
    `${JSON.stringify({ version: 1, key, title: label, duration_min: questions.length, questions }, null, 2)}\n`,
  );
  resumen.push({ tema, reales, nuevas, total: questions.length, muestra, largaNuevas: larga, cortaNuevas: corta, realesLarga });
}

if (process.argv.includes('--cobertura')) {
  const digest = readFileSync(join(DATOS, 'digest.md'), 'utf8');
  const excluidosArchivo = join(DATOS, 'datos-excluidos.json');
  const excluidos = new Set(existsSync(excluidosArchivo) ? Object.keys(JSON.parse(readFileSync(excluidosArchivo, 'utf8'))) : []);
  const todos = [...digest.matchAll(/^\s*-\s*([a-z-]+\.\d+)\s*·/gm)].map((m) => m[1]);
  if (!todos.length) errores.push('digest.md: no se reconoció ningún dato');
  const faltan = todos.filter((d) => !datosUsados.has(d) && !excluidos.has(d));
  if (faltan.length) errores.push(`Datos sin pregunta (${faltan.length} de ${todos.length}): ${faltan.join(', ')}`);
  else console.log(`Cobertura: ${todos.length} datos, ${excluidos.size} excluidos a propósito.`);
}

console.table(resumen);
if (errores.length) {
  console.error(`\n${errores.length} errores:\n- ${errores.join('\n- ')}`);
  process.exit(1);
}
console.log('Sin errores. Salida en data/epidemiologia-u2/salida/');
