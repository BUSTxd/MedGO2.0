/**
 * Verifica el contenido del laboratorio «Checkpoints del ciclo celular».
 *
 *   node --experimental-strip-types --no-warnings scripts/ciclo-celular/verificar.mjs
 *   npm run verificar:ciclo
 *
 * Existe porque casi nada de esto rompe la compilación: un actor usado antes
 * de aparecer, un paso fuera de la rejilla o una alternativa correcta que
 * siempre es la más larga se ven solo al abrir el laboratorio (o nunca).
 * Los ERRORES cortan con código 1; los avisos son descriptivos.
 *
 * Carga cada archivo de datos directamente (solo tienen `import type`, que el
 * stripping de Node borra).
 */

import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATOS = path.join(RAIZ, 'src', 'lib', 'data', 'ciclo-celular');
const cargar = async (rel) => (await import(pathToFileURL(path.join(DATOS, rel)).href));

const { IMAGENES_CRUDAS } = await cargar('imagenes.ts');
const errores = [];
const avisos = [];
const err = (donde, m) => errores.push(`${donde}: ${m}`);
const aviso = (donde, m) => avisos.push(`${donde}: ${m}`);

const palabras = (s) => s.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
const SITIOS = new Set(['p1', 'p2', 'p3', 'p4']);

/** Qué claves de actor mira cada acción, y qué hace con la visibilidad. */
function refs(a) {
  switch (a.tipo) {
    case 'appear': case 'enter': return { crea: [a.actor], usa: [] };
    case 'move': case 'activate': case 'release_inhibition': case 'swap_image': return { usa: [a.actor] };
    case 'hide': return { usa: [a.actor], quita: [a.actor] };
    case 'bind': return { usa: [a.actor, a.target] };
    case 'release': return { usa: [a.actor, a.from] };
    case 'phosphorylate': return { usa: [a.kinase, a.target] };
    case 'dephosphorylate': return { usa: [a.target, ...(a.phosphatase ? [a.phosphatase] : [])] };
    case 'inhibit': return { usa: [a.inhibitor, a.target] };
    case 'sequester': return { usa: [a.actor, a.target] };
    case 'translocate': return { usa: [a.actor] };
    case 'transcribe': return { usa: [a.tf, a.gene], crea: [a.product] };
    case 'ubiquitinate': return { usa: [a.ligase, a.target] };
    case 'degrade': return { usa: [a.target], quita: [a.target] };
    case 'damage': return { usa: [a.target] };
    case 'feedback_loop': case 'pulse_signal': case 'connect': return { usa: [a.from, a.to] };
    case 'split': return { usa: [a.actor], quita: [a.actor], crea: a.into.map((i) => i.actor) };
    case 'merge': return { usa: a.actors, quita: a.actors.filter((x) => x !== a.into), crea: [a.into] };
    case 'note': return { usa: [a.near] };
    case 'highlight': return { usa: a.actors };
    default: return { usa: [] };
  }
}

function posiciones(a) {
  const out = [];
  for (const k of ['pos', 'to', 'productPos']) if (a[k] && typeof a[k] === 'object') out.push(a[k]);
  if (a.tipo === 'split') out.push(...a.into.map((i) => i.pos));
  return out;
}

function verificarEscenario(esc, archivo, esCheckpoint) {
  const donde = archivo;
  for (const [k, d] of Object.entries(esc.actores)) {
    if (!IMAGENES_CRUDAS[d.img]) aviso(donde, `actor «${k}» usa la imagen «${d.img}», que no existe → marcador de posición`);
  }
  const ids = new Set();
  const visiblesFin = new Map(); // paso.id → Set de visibles al terminar
  let previo = new Set();
  const conectores = new Map();

  esc.pasos.forEach((p, i) => {
    const dp = `${donde} · ${p.id}`;
    if (ids.has(p.id)) err(dp, 'id de paso repetido');
    ids.add(p.id);
    if (!p.texto || !p.profundiza) err(dp, 'falta texto o profundiza');
    if (esCheckpoint && p.orden !== 0 && !p.tarjeta) err(dp, 'paso sin tarjeta (solo el paso 0 puede no llevarla)');
    if (p.tarjeta && palabras(p.tarjeta) > 18) aviso(dp, `tarjeta de ${palabras(p.tarjeta)} palabras (máx. 18)`);
    for (const k of p.protagonistas) if (!esc.actores[k]) err(dp, `protagonista «${k}» no declarado`);

    let vis;
    if (p.base) {
      if (!visiblesFin.has(p.base)) err(dp, `base «${p.base}» no es un paso anterior`);
      vis = new Set(visiblesFin.get(p.base) ?? []);
    } else vis = new Set(previo);

    // Eventos simultáneos: más de 3 acciones con el mismo `at`.
    const porAt = new Map();
    for (const a of p.acciones) porAt.set(a.at, (porAt.get(a.at) ?? 0) + 1);
    for (const [at, n] of porAt) if (n > 3) err(dp, `${n} acciones simultáneas en at=${at} (máx. 3)`);

    const ordenadas = [...p.acciones].sort((x, y) => x.at - y.at);
    for (const a of ordenadas) {
      const da = `${dp} · ${a.tipo}@${a.at}`;
      const r = refs(a);
      for (const k of [...(r.usa ?? []), ...(r.crea ?? [])]) {
        if (!esc.actores[k]) err(da, `actor «${k}» no declarado`);
      }
      for (const k of r.usa ?? []) if (esc.actores[k] && !vis.has(k)) err(da, `usa «${k}» antes de que aparezca (o después de ocultarse)`);
      for (const pos of posiciones(a)) {
        if (!(pos.col >= 0 && pos.col <= 16 && pos.row >= 0 && pos.row <= 10)) err(da, `posición fuera de la rejilla (${pos.col}, ${pos.row})`);
      }
      if (a.tipo === 'phosphorylate' && !SITIOS.has(a.site)) err(da, `sitio «${a.site}» (usar p1…p4)`);
      if (a.tipo === 'swap_image' && !IMAGENES_CRUDAS[a.img]) aviso(da, `imagen «${a.img}» inexistente`);
      if (a.tipo === 'note' && palabras(a.text) > 12) aviso(da, `nota de ${palabras(a.text)} palabras (máx. 12)`);
      if (a.tipo === 'connect') conectores.set(a.id, true);
      if (a.tipo === 'disconnect' && !conectores.has(a.id)) err(da, `desconecta «${a.id}», que nunca se conectó`);
      if (a.tipo === 'degrade' && ![...vis].some((k) => esc.actores[k]?.img === 'proteasoma')) aviso(da, 'no hay proteasoma visible: irá a (14, 8.6)');
      for (const k of r.crea ?? []) vis.add(k);
      for (const k of r.quita ?? []) vis.delete(k);
    }
    visiblesFin.set(p.id, vis);
    previo = vis;
  });
}

function verificarPreguntas(lista, donde) {
  let masLarga = 0, masCorta = 0;
  for (const q of lista) {
    const dq = `${donde} · ${q.id}`;
    if (q.opciones.length !== 4) err(dq, 'no tiene 4 opciones');
    if (!(q.correcta >= 0 && q.correcta <= 3)) err(dq, 'correcta fuera de 0–3');
    if (new Set(q.opciones).size !== 4) err(dq, 'opciones repetidas');
    if (!q.explicacion) err(dq, 'sin explicación');
    const lon = q.opciones.map((o) => o.length);
    const c = lon[q.correcta];
    if (c === Math.max(...lon) && lon.filter((l) => l === c).length === 1) masLarga++;
    if (c === Math.min(...lon) && lon.filter((l) => l === c).length === 1) masCorta++;
  }
  return { masLarga, masCorta, n: lista.length };
}

// ─── Checkpoints ─────────────────────────────────────────────────────────────
const ARCHIVOS = {
  restriccion: 'checkpoints/restriccion.ts',
  g1s_dano: 'checkpoints/g1s-dano.ts',
  intra_s: 'checkpoints/intra-s.ts',
  g2m: 'checkpoints/g2m.ts',
  huso: 'checkpoints/huso.ts',
};

let sesgo = { masLarga: 0, masCorta: 0, n: 0 };
const suma = (s) => { sesgo.masLarga += s.masLarga; sesgo.masCorta += s.masCorta; sesgo.n += s.n; };

for (const [id, rel] of Object.entries(ARCHIVOS)) {
  if (!existsSync(path.join(DATOS, rel))) { aviso(rel, 'todavía no existe'); continue; }
  const cp = (await cargar(rel)).default;
  if (cp.id !== id) err(rel, `id «${cp.id}» ≠ «${id}»`);
  verificarEscenario(cp, rel, true);
  if (cp.distractores.length < 2) err(rel, 'menos de 2 distractores');
  for (const d of cp.distractores) if (!d.porQueEsFalso) err(`${rel} · ${d.id}`, 'distractor sin porQueEsFalso');
  if (cp.preguntas.length < 4) err(rel, `solo ${cp.preguntas.length} preguntas en el banco (mín. 4)`);
  const pasos = new Set(cp.pasos.map((p) => p.id));
  for (const q of cp.preguntas) if (q.pasoRelacionado && !pasos.has(q.pasoRelacionado)) err(`${rel} · ${q.id}`, `pasoRelacionado «${q.pasoRelacionado}» no existe`);
  suma(verificarPreguntas(cp.preguntas, rel));
}

if (existsSync(path.join(DATOS, 'intro.ts'))) verificarEscenario((await cargar('intro.ts')).default, 'intro.ts', false);
else aviso('intro.ts', 'todavía no existe');

if (existsSync(path.join(DATOS, 'integrada.ts'))) suma(verificarPreguntas((await cargar('integrada.ts')).default, 'integrada.ts'));
else aviso('integrada.ts', 'todavía no existe');

if (existsSync(path.join(DATOS, 'proteinas.ts'))) {
  const prot = (await cargar('proteinas.ts')).default;
  for (const id of Object.keys(IMAGENES_CRUDAS)) if (!prot[id]) aviso('proteinas.ts', `sin ficha para «${id}»`);
  for (const [id, p] of Object.entries(prot)) if (p.id !== id) err(`proteinas.ts · ${id}`, `id interno «${p.id}» distinto`);
} else aviso('proteinas.ts', 'todavía no existe');

// Regla del proyecto: la correcta no puede ser la más larga en más de 1 de
// cada 10 preguntas, ni la más corta sistemáticamente.
if (sesgo.n) {
  const tope = Math.ceil(sesgo.n / 10);
  const linea = `correcta = la más larga en ${sesgo.masLarga}/${sesgo.n}, la más corta en ${sesgo.masCorta}/${sesgo.n} (tope ${tope})`;
  if (sesgo.masLarga > tope || sesgo.masCorta > tope) err('sesgo de longitud', linea);
  else console.log(`Sesgo de longitud OK: ${linea}`);
}

if (avisos.length) console.log(`\nAvisos (${avisos.length}):\n  ` + avisos.join('\n  '));
if (errores.length) {
  console.log(`\nERRORES (${errores.length}):\n  ` + errores.join('\n  '));
  process.exit(1);
}
console.log('\nSin errores.');
