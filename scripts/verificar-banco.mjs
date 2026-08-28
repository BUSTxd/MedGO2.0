/**
 * Verifica la integridad de los bancos de preguntas (`src/lib/data/banco/`).
 *
 *   node --experimental-strip-types scripts/verificar-banco.mjs
 *   npm run verificar:banco
 *
 * Existe porque una clave mal tecleada no rompe nada: compila, renderiza y sólo
 * se descubre cuando un alumno estudia la respuesta equivocada. Los errores
 * cortan con código 1; lo que sale bajo «Informe» es descriptivo, no un fallo.
 *
 * Los datos se importan con el stripping de tipos de Node (22.6+). Por eso cada
 * archivo de tema debe poder cargarse SOLO: sus `import` de tipos van con
 * `import type` (se borran al cargar) y no puede tener imports de valores sin
 * extensión, que Node no resolvería.
 */

import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR_BANCO = path.join(RAIZ, 'src', 'lib', 'data', 'banco');
const PUBLIC = path.join(RAIZ, 'public');

const errores = [];
const avisos = [];
const err = (m) => errores.push(m);
const avisa = (m) => avisos.push(m);

/** Quita acentos, signos y espacios de más para comparar enunciados. */
const normalizar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

async function cargarTemas() {
  const archivos = (await readdir(DIR_BANCO)).filter(
    (f) => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts',
  );
  const temas = [];
  for (const archivo of archivos) {
    // `pathToFileURL`, no la ruta a secas: en Windows `C:\…` se interpreta como
    // el esquema de URL «c:» y el loader ESM lo rechaza.
    const mod = await import(pathToFileURL(path.join(DIR_BANCO, archivo)).href);
    for (const valor of Object.values(mod)) {
      if (valor && typeof valor === 'object' && Array.isArray(valor.tandas)) {
        temas.push({ archivo, tema: valor });
      }
    }
  }
  return temas;
}

function recorrer(tema) {
  const filas = [];
  for (const tanda of tema.tandas) {
    for (const fase of tanda.fases) {
      fase.preguntas.forEach((pregunta, i) => {
        filas.push({ tanda, fase, pregunta, pos: i + 1 });
      });
    }
  }
  return filas;
}

function verificarTema(archivo, tema) {
  const donde = `${archivo} · ${tema.id}`;
  const filas = recorrer(tema);

  if (filas.length === 0) err(`${donde}: no tiene ni una pregunta.`);

  // ── ids únicos ─────────────────────────────────────────────────────────────
  const vistos = new Map();
  for (const { pregunta, tanda, fase, pos } of filas) {
    const etiqueta = `tanda ${tanda.label} · ${fase.label} · Q${pos}`;
    if (vistos.has(pregunta.id)) {
      err(`${donde}: id duplicado «${pregunta.id}» (${vistos.get(pregunta.id)} y ${etiqueta}).`);
    } else {
      vistos.set(pregunta.id, etiqueta);
    }
  }

  // ── una y sólo una correcta, opciones y explicación ────────────────────────
  for (const { pregunta, tanda, fase, pos } of filas) {
    const donde2 = `${donde} · tanda ${tanda.label} · ${fase.label} · Q${pos} (${pregunta.id})`;
    const correctas = pregunta.opciones.filter((o) => o.correcta === true);

    if (correctas.length !== 1) {
      err(`${donde2}: tiene ${correctas.length} alternativas marcadas como correctas; debe haber 1.`);
    }
    if (pregunta.opciones.length !== 4) {
      avisa(`${donde2}: tiene ${pregunta.opciones.length} alternativas (lo normal son 4).`);
    }
    const idsOpcion = new Set(pregunta.opciones.map((o) => o.id));
    if (idsOpcion.size !== pregunta.opciones.length) {
      err(`${donde2}: ids de alternativa repetidos.`);
    }
    if (!pregunta.explicacion || pregunta.explicacion.trim().length < 40) {
      err(`${donde2}: explicación vacía o demasiado corta.`);
    }
    if (!pregunta.enunciado || !pregunta.enunciado.trim()) {
      err(`${donde2}: enunciado vacío.`);
    }
    if (pregunta.imagen) {
      const rel = pregunta.imagen.src.replace(/^\//, '');
      if (!existsSync(path.join(PUBLIC, rel))) {
        err(`${donde2}: la imagen «${pregunta.imagen.src}» no existe en public/.`);
      }
      if (!pregunta.imagen.alt || pregunta.imagen.alt.trim().length < 15) {
        avisa(`${donde2}: el alt de la imagen es muy escueto.`);
      }
    }
  }

  // ── preguntas repetidas entre exámenes: misma clave ────────────────────────
  // Seis de las veinte posiciones de ACP1 son la misma pregunta en dos exámenes.
  // Si alguien retoca una y no la otra, aquí salta.
  const porEnunciado = new Map();
  for (const { pregunta, tanda, fase, pos } of filas) {
    const clave = normalizar(pregunta.enunciado);
    const correcta = pregunta.opciones.find((o) => o.correcta === true);
    const entrada = {
      texto: correcta ? normalizar(correcta.texto) : '(ninguna)',
      crudo: correcta ? correcta.texto : '(ninguna)',
      etiqueta: `tanda ${tanda.label} · ${fase.label} · Q${pos}`,
    };
    if (!porEnunciado.has(clave)) porEnunciado.set(clave, []);
    porEnunciado.get(clave).push(entrada);
  }

  let repetidas = 0;
  for (const grupo of porEnunciado.values()) {
    if (grupo.length < 2) continue;
    repetidas += grupo.length;
    const distintas = new Set(grupo.map((g) => g.texto));
    if (distintas.size > 1) {
      err(
        `${donde}: la misma pregunta aparece en ${grupo.length} sitios con claves DISTINTAS —\n` +
          grupo.map((g) => `      ${g.etiqueta} → «${g.crudo}»`).join('\n'),
      );
    }
  }

  // ── Informe (descriptivo) ──────────────────────────────────────────────────
  const letras = ['A', 'B', 'C', 'D', 'E', 'F'];
  const reparto = {};
  let masLarga = 0;
  for (const { pregunta } of filas) {
    const idx = pregunta.opciones.findIndex((o) => o.correcta === true);
    if (idx >= 0) reparto[letras[idx]] = (reparto[letras[idx]] ?? 0) + 1;

    const largos = pregunta.opciones.map((o) => o.texto.length);
    const max = Math.max(...largos);
    if (idx >= 0 && largos[idx] === max && largos.filter((l) => l === max).length === 1) {
      masLarga++;
    }
  }

  const pctLarga = Math.round((masLarga / filas.length) * 100);
  console.log(`\n  ${tema.id} — ${filas.length} preguntas en ${tema.tandas.length} examen(es)`);
  console.log(`    posiciones repetidas entre exámenes : ${repetidas}`);
  console.log(
    `    clave por letra (antes de barajar)  : ${letras
      .filter((l) => reparto[l])
      .map((l) => `${l}=${reparto[l]}`)
      .join('  ')}`,
  );
  console.log(`    correcta = la alternativa más larga : ${masLarga}/${filas.length} (${pctLarga} %)`);
  if (pctLarga > 10) {
    console.log(
      '      ↳ por encima del 10 % que fija CLAUDE.md. En preguntas transcritas de un\n' +
        '        examen real es esperable y NO se corrige alargando distractores: eso\n' +
        '        las convertiría en otras preguntas. Queda medido, no arreglado.',
    );
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

const temas = await cargarTemas();

if (temas.length === 0) {
  console.error('No se encontró ningún tema en src/lib/data/banco/.');
  process.exit(1);
}

console.log(`Verificando ${temas.length} tema(s) de banco…`);
for (const { archivo, tema } of temas) verificarTema(archivo, tema);

console.log('');
if (avisos.length) {
  console.log(`Avisos (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
  console.log('');
}

if (errores.length) {
  console.error(`ERRORES (${errores.length}):`);
  for (const e of errores) console.error(`  ✕ ${e}`);
  process.exit(1);
}

console.log('✓ Sin errores.');
