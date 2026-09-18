/**
 * Verifica el etiquetado por tema de los banqueos y la tabla tema→clases.
 *
 *   node --experimental-strip-types scripts/verificar-temas.mjs
 *   npm run verificar:temas
 *
 * Existe porque un `tema` mal tecleado no rompe nada: el examen funciona igual y
 * la pregunta desaparece del informe en silencio. Los errores cortan con código
 * 1; lo que sale bajo «Informe» es descriptivo, no un fallo.
 *
 * La tabla se importa con el stripping de tipos de Node (22.6+), así que se
 * carga `temas/<curso>.ts` directamente y NUNCA `temas/index.ts`: ese sí tiene
 * un import de valor sin extensión, que Node no resolvería.
 */

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_EXAMENES = path.join(RAIZ, 'scripts', 'examenes');

/** Cursos con taxonomía: archivo de temas + sílabo del que salen las clases. */
const CURSOS = [
  {
    slug: 'inmunologia',
    temas: path.join(RAIZ, 'src', 'lib', 'data', 'temas', 'inmunologia.ts'),
    silabo: path.join(RAIZ, 'src', 'lib', 'data', 'inmunologia.ts'),
    prefijoResumen: 'inm-',
  },
  {
    slug: 'epidemiologia',
    temas: path.join(RAIZ, 'src', 'lib', 'data', 'temas', 'epidemiologia.ts'),
    silabo: path.join(RAIZ, 'src', 'lib', 'data', 'epidemiologia.ts'),
    // Los ids de clase ya llevan el prefijo (`epi-t-2`) y el resumen usa el mismo.
    prefijoResumen: '',
  },
];

const errores = [];
const avisos = [];
const err = (m) => errores.push(m);
const avisa = (m) => avisos.push(m);

async function importar(archivo) {
  // `pathToFileURL`, no la ruta a secas: en Windows `C:\…` se interpreta como
  // el esquema de URL «c:» y el loader ESM lo rechaza.
  return import(pathToFileURL(archivo).href);
}

async function cargarTabla(archivo) {
  const mod = await importar(archivo);
  for (const valor of Object.values(mod)) {
    if (valor && typeof valor === 'object' && !Array.isArray(valor)) return valor;
  }
  return null;
}

/** Aplana las semanas del sílabo en un mapa id → actividad. */
async function cargarSilabo(archivo) {
  const mod = await importar(archivo);
  const mapa = new Map();
  for (const valor of Object.values(mod)) {
    if (!Array.isArray(valor)) continue;
    for (const semana of valor) {
      if (!semana || !Array.isArray(semana.actividades)) continue;
      for (const act of semana.actividades) mapa.set(act.id, act);
    }
  }
  return mapa;
}

function verificarTabla(curso, tabla, silabo) {
  for (const [temaId, tema] of Object.entries(tabla)) {
    const donde = `${curso.slug} · tema «${temaId}»`;

    if (!tema.label || !tema.label.trim()) err(`${donde}: sin label.`);
    if (curso.sinClases && Array.isArray(tema.clases) && tema.clases.length === 0) continue;
    if (!Array.isArray(tema.clases) || tema.clases.length === 0) {
      err(`${donde}: no tiene ninguna clase asignada; todo tema debe recomendar al menos una.`);
      continue;
    }

    for (const clase of tema.clases) {
      const act = silabo.get(clase.claseId);
      if (!act) {
        err(`${donde}: la clase «${clase.claseId}» no existe en el sílabo.`);
        continue;
      }
      if (act.codigo !== clase.codigo) {
        err(`${donde}: el código de «${clase.claseId}» es «${clase.codigo}» en la tabla y «${act.codigo}» en el sílabo.`);
      }

      const tieneResumen = !!act.resumen;
      if (clase.conResumen && !tieneResumen) {
        err(`${donde}: «${clase.claseId}» declara conResumen pero el sílabo no le da resumen (el enlace abriría un visor vacío).`);
      }
      if (!clase.conResumen && tieneResumen) {
        avisa(`${donde}: «${clase.claseId}» tiene resumen en el sílabo pero la tabla dice que no; la recomendación es peor de lo que podría.`);
      }

      if (!!clase.gratis !== !!act.gratis) {
        err(`${donde}: «${clase.claseId}» ${clase.gratis ? 'está marcada gratis en la tabla y no en el sílabo' : 'es gratis en el sílabo y la tabla no lo dice'}; el CTA de la recomendación saldría mal.`);
      }

      const opciones = act.resumen?.opciones ?? [];
      const esperado = `${curso.prefijoResumen}${clase.claseId}`;
      if (clase.conResumen && opciones.length > 0 && !opciones.some((o) => o.id === esperado)) {
        avisa(`${donde}: el resumen de «${clase.claseId}» no usa el id «${esperado}» (usa «${opciones.map((o) => o.id).join(', ')}»).`);
      }
    }
  }
}

async function verificarExamenes(curso, tabla) {
  const archivos = (await readdir(DIR_EXAMENES))
    .filter((f) => f.startsWith(`${curso.slug}-`) && f.endsWith('.json'))
    .sort();

  const porTema = new Map();
  const filas = [];

  for (const archivo of archivos) {
    const json = JSON.parse(await readFile(path.join(DIR_EXAMENES, archivo), 'utf8'));
    const preguntas = json.questions ?? [];
    let conTema = 0;

    for (const q of preguntas) {
      const donde = `${archivo} · ${q.id}`;

      if (q.variante && q.variante.tema !== undefined) {
        err(`${donde}: la variante declara «tema»; el tema vive sólo en la pregunta base.`);
      }
      if (q.tema === undefined) {
        err(`${donde}: sin «tema».`);
        continue;
      }
      if (typeof q.tema !== 'string') {
        err(`${donde}: «tema» debe ser un string, no ${Array.isArray(q.tema) ? 'un array' : typeof q.tema}.`);
        continue;
      }
      if (!tabla[q.tema]) {
        err(`${donde}: el tema «${q.tema}» no existe en la tabla de ${curso.slug}.`);
        continue;
      }

      conTema++;
      porTema.set(q.tema, (porTema.get(q.tema) ?? 0) + 1);
    }

    filas.push({ archivo, total: preguntas.length, conTema });
  }

  return { filas, porTema };
}

// ── main ─────────────────────────────────────────────────────────────────────

for (const curso of CURSOS) {
  const tabla = await cargarTabla(curso.temas);
  if (!tabla) {
    console.error(`No se pudo cargar la tabla de temas de ${curso.slug}.`);
    process.exit(1);
  }
  const silabo = await cargarSilabo(curso.silabo);

  console.log(`\nVerificando ${curso.slug}: ${Object.keys(tabla).length} temas, ${silabo.size} actividades en el sílabo.`);

  verificarTabla(curso, tabla, silabo);
  const { filas, porTema } = await verificarExamenes(curso, tabla);

  console.log('\n  Cobertura por examen');
  for (const f of filas) {
    const pct = f.total > 0 ? Math.round((f.conTema / f.total) * 100) : 0;
    console.log(`    ${f.archivo.padEnd(36)} ${String(f.conTema).padStart(3)}/${String(f.total).padEnd(3)} (${pct} %)`);
  }

  console.log('\n  Preguntas por tema');
  const orden = [...porTema.entries()].sort((a, b) => b[1] - a[1]);
  for (const [temaId, n] of orden) {
    console.log(`    ${String(n).padStart(4)}  ${temaId} — ${tabla[temaId].label}`);
  }

  for (const temaId of Object.keys(tabla)) {
    const n = porTema.get(temaId) ?? 0;
    if (n === 0) avisa(`${curso.slug}: el tema «${temaId}» no lo usa ninguna pregunta (vocabulario muerto).`);
    else if (n < 5) avisa(`${curso.slug}: el tema «${temaId}» sólo tiene ${n} pregunta(s); tardará en llegar al mínimo del panel del home.`);
    else if (n > 25) avisa(`${curso.slug}: el tema «${temaId}» acumula ${n} preguntas; puede estar haciendo de cajón de sastre.`);
  }
}

console.log('');
if (avisos.length) {
  console.log(`Avisos (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
  console.log('');
}

if (errores.length) {
  const muestra = errores.slice(0, 40);
  console.error(`ERRORES (${errores.length}):`);
  for (const e of muestra) console.error(`  ✕ ${e}`);
  if (errores.length > muestra.length) console.error(`  … y ${errores.length - muestra.length} más.`);
  process.exit(1);
}

console.log('✓ Sin errores.');
