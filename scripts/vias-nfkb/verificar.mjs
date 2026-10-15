/**
 * Verifica el contenido del laboratorio «Vías NF-κB y JAK/STAT».
 *
 *   npm run verificar:vias-nfkb
 *
 * Como el de «Checkpoints del ciclo celular»: casi nada de esto rompe la
 * compilación. Un actor usado antes de aparecer, un `disconnect` de un
 * conector que no existe, una pieza del modo estudio que toca un actor
 * invisible o una proteína sin ficha solo se ven al abrir el laboratorio.
 * Los ERRORES cortan con código 1; los avisos son descriptivos.
 */

import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('./cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATOS = path.join(RAIZ, 'src', 'lib', 'data', 'vias-nfkb');
const cargar = async (rel) => (await import(pathToFileURL(path.join(DATOS, rel)).href));

const clasica = (await cargar('clasica.ts')).default;
const alternativa = (await cargar('alternativa.ts')).default;
const jakstat = (await cargar('jakstat.ts')).default;
const { INTRO, ESTUDIO, PIEZAS } = await cargar('panorama.ts');
const PROTEINAS = (await cargar('proteinas.ts')).default;
const { ALTERACIONES } = await cargar('alteraciones.ts');

const errores = [];
const avisos = [];
const err = (donde, m) => errores.push(`${donde}: ${m}`);
const aviso = (donde, m) => avisos.push(`${donde}: ${m}`);
const palabras = (s) => s.trim().split(/\s+/).filter(Boolean).length;

/** Actores que una acción necesita visibles (y los que hace aparecer o desaparecer). */
function analizar(a) {
  const usa = [], aparece = [], desaparece = [];
  switch (a.tipo) {
    case 'appear': aparece.push(a.actor); break;
    case 'move': case 'translocate': case 'activate': case 'deactivate': case 'release_inhibition': case 'swap_label': case 'mutate': usa.push(a.actor); break;
    case 'hide': usa.push(a.actor); desaparece.push(a.actor); break;
    case 'bind': usa.push(a.actor, a.target); break;
    case 'release': usa.push(a.actor, a.from); break;
    case 'phosphorylate': usa.push(a.kinase, a.target); break;
    case 'dephosphorylate': usa.push(a.target); if (a.phosphatase) usa.push(a.phosphatase); break;
    case 'inhibit': usa.push(a.inhibitor, a.target); break;
    case 'transcribe': usa.push(a.tf, a.gene); aparece.push(a.product); break;
    case 'ubiquitinate': usa.push(a.ligase, a.target); break;
    case 'deubiquitinate': usa.push(a.enzyme, a.target); break;
    case 'degrade': usa.push(a.target); desaparece.push(a.target); break;
    case 'process': usa.push(a.target); desaparece.push(a.target); aparece.push(a.into); break;
    case 'pulse_signal': case 'connect': usa.push(a.from, a.to); break;
    case 'merge': usa.push(...a.actors.filter((k) => k !== a.into)); desaparece.push(...a.actors.filter((k) => k !== a.into)); aparece.push(a.into); break;
    case 'highlight': break;
    case 'note': usa.push(a.near); break;
    default: break;
  }
  return { usa, aparece, desaparece };
}

/** Recorre acciones sobre un estado {vis:Set, con:Set}. Muta el estado. */
function recorrer(donde, esc, acciones, st) {
  const orden = [...acciones].sort((x, y) => x.at - y.at);
  for (const a of orden) {
    const { usa, aparece, desaparece } = analizar(a);
    for (const k of [...usa, ...aparece]) if (!esc.actores[k]) err(donde, `«${a.tipo}» usa el actor «${k}», que no está declarado`);
    for (const k of usa) if (esc.actores[k] && !st.vis.has(k)) err(donde, `«${a.tipo}» (at ${a.at}) usa «${k}» cuando no está visible`);
    const p = a.pos ?? a.to ?? a.productPos ?? a.back;
    if (p && typeof p === 'object' && (p.col < 0 || p.col > 16 || p.row < 0 || p.row > 10)) err(donde, `«${a.tipo}» fuera de la rejilla 16×10 (${p.col}, ${p.row})`);
    if (a.tipo === 'note' && palabras(a.text) > 12) aviso(donde, `nota de ${palabras(a.text)} palabras: «${a.text}»`);
    if (a.tipo === 'connect') st.con.add(a.id);
    if (a.tipo === 'phosphorylate' && a.kinase !== a.target) st.con.add(`fos:${a.kinase}>${a.target}`);
    if (a.tipo === 'ubiquitinate' && a.ligase !== a.target) st.con.add(`ub:${a.ligase}>${a.target}`);
    if (a.tipo === 'inhibit' && a.conector !== false) st.con.add(`inh:${a.inhibitor}>${a.target}`);
    if (a.tipo === 'disconnect') {
      if (!st.con.has(a.id)) err(donde, `«disconnect» de «${a.id}», que no existe en ese momento`);
      st.con.delete(a.id);
    }
    for (const k of desaparece) st.vis.delete(k);
    for (const k of aparece) st.vis.add(k);
  }
}

const clonar = (st) => ({ vis: new Set(st.vis), con: new Set(st.con) });

function verificarEscenario(esc) {
  for (const [k, d] of Object.entries(esc.actores)) {
    const id = d.info ?? k;
    if (!PROTEINAS[id]) err(`${esc.id}`, `el actor «${k}» no tiene ficha (proteinas.ts: «${id}»)`);
    if (d.forma === 'imagen' && !d.img) err(`${esc.id}`, `el actor «${k}» es imagen pero no dice cuál`);
  }
  const finales = new Map();
  let anterior = { vis: new Set(), con: new Set() };
  const ids = new Set();
  for (const p of esc.pasos) {
    const donde = `${esc.id} · ${p.id}`;
    if (ids.has(p.id)) err(donde, 'id de paso repetido');
    ids.add(p.id);
    if (p.base && !finales.has(p.base)) err(donde, `base «${p.base}» no es un paso anterior`);
    const st = clonar(p.base && finales.has(p.base) ? finales.get(p.base) : anterior);
    recorrer(donde, esc, p.acciones, st);
    for (const k of p.protagonistas ?? []) if (!esc.actores[k]) err(donde, `protagonista «${k}» no declarado`);
    if (p.texto && palabras(p.texto) > 45) aviso(donde, `narración de ${palabras(p.texto)} palabras`);
    finales.set(p.id, st);
    anterior = st;
  }
  return finales;
}

for (const v of [clasica, alternativa, jakstat]) verificarEscenario(v);
verificarEscenario(INTRO);
const finEstudio = verificarEscenario(ESTUDIO).get('es-0');

// Piezas del modo estudio: fisiología en el orden de cada vía, luego Hodgkin.
const st = clonar(finEstudio);
for (const ronda of ['fisiologia', 'hodgkin']) {
  for (const p of PIEZAS.filter((x) => x.ronda === ronda)) {
    const donde = `estudio · ${p.id}`;
    if (p.hueco.col < 0 || p.hueco.col > 16 || p.hueco.row < 0 || p.hueco.row > 10) err(donde, 'hueco fuera de la rejilla');
    if (!p.ficha.label) err(donde, 'pieza sin rótulo');
    recorrer(donde, ESTUDIO, p.acciones, st);
  }
}
// En la ronda de Hodgkin dos huecos no pueden quedar encima uno de otro.
const hk = PIEZAS.filter((x) => x.ronda === 'hodgkin');
for (let i = 0; i < hk.length; i++) for (let j = i + 1; j < hk.length; j++) {
  const d = Math.hypot(hk[i].hueco.col - hk[j].hueco.col, hk[i].hueco.row - hk[j].hueco.row) * 100;
  if (d < 140) err('estudio', `los huecos de «${hk[i].id}» y «${hk[j].id}» están a ${Math.round(d)} u (mínimo 140)`);
}

const VIAS = { clasica, alternativa, jakstat };
for (const al of ALTERACIONES) {
  if (!VIAS[al.via].pasos.some((p) => p.id === al.paso)) err('alteraciones', `«${al.gen}» apunta al paso «${al.paso}», que no existe en ${al.via}`);
  if (!PROTEINAS[al.ficha]) err('alteraciones', `«${al.gen}» apunta a la ficha «${al.ficha}», que no existe`);
}

for (const [id, f] of Object.entries(PROTEINAS)) if (f.id !== id) err('proteinas', `la ficha «${id}» lleva id «${f.id}»`);

const total = [clasica, alternativa, jakstat].reduce((n, v) => n + v.pasos.length, 0);
console.log(`Vías NF-κB y JAK/STAT · ${total} pasos en 3 vías · ${INTRO.pasos.length} de intro · ${PIEZAS.length} piezas · ${Object.keys(PROTEINAS).length} fichas`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
