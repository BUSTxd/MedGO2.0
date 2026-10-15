/**
 * Verifica el contenido del laboratorio «Maduración de linfocitos».
 *
 *   npm run verificar:linfocitos
 *
 * Caza lo que no rompe la compilación: actor usado antes de aparecer, ficha o
 * imagen que falta, conector o lupa que no existen, posiciones fuera del
 * lienzo, narraciones demasiado largas. ERRORES → código 1.
 */

import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('../vias-nfkb/cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATOS = path.join(RAIZ, 'src', 'lib', 'data', 'linfocitos');
const cargar = async (rel) => (await import(pathToFileURL(path.join(DATOS, rel)).href));

const partes = await Promise.all(['medula.ts', 'linfocito-b.ts', 'timo.ts', 'centro-germinal.ts', 'neoplasias.ts', 'intro.ts'].map(async (f) => (await cargar(f)).default));
const FICHAS = (await cargar('fichas.ts')).default;
const { IMAGENES } = await cargar('imagenes.ts');
const { NEOPLASIAS } = await cargar('tabla-neoplasias.ts');

const errores = [], avisos = [];
const err = (d, m) => errores.push(`${d}: ${m}`);
const aviso = (d, m) => avisos.push(`${d}: ${m}`);
const palabras = (t) => t.trim().split(/\s+/).filter(Boolean).length;

function analizar(a) {
  const usa = [], aparece = [], desaparece = [];
  switch (a.tipo) {
    case 'appear': aparece.push(a.actor); break;
    case 'move': case 'activate': case 'deactivate': case 'swap': case 'anergia': case 'express': case 'unexpress': case 'marca': usa.push(a.actor); break;
    case 'hide': case 'apoptosis': usa.push(a.actor); desaparece.push(a.actor); break;
    case 'divide': usa.push(a.actor); desaparece.push(a.actor); aparece.push(...a.into); break;
    case 'bind': usa.push(a.actor, a.target); break;
    case 'release': usa.push(a.actor, a.from); break;
    case 'proceso': usa.push(a.cerca); break;
    case 'pulse_signal': case 'connect': usa.push(a.from, a.to); break;
    case 'note': usa.push(a.near); break;
    case 'highlight': break;
    default: break;
  }
  return { usa, aparece, desaparece };
}

for (const esc of partes) {
  for (const [k, d] of Object.entries(esc.actores)) {
    if (!FICHAS[d.info ?? k]) err(esc.id, `el actor «${k}» no tiene ficha («${d.info ?? k}»)`);
    if (d.img && !IMAGENES[d.img]) aviso(esc.id, `el actor «${k}» usa la imagen «${d.img}», que no está recortada: se dibuja con código`);
  }
  const st = { vis: new Set(), con: new Set(), pro: new Set() };
  for (const p of esc.pasos) {
    const donde = `${esc.id} · ${p.id}`;
    if (palabras(p.texto) > 55) aviso(donde, `narración de ${palabras(p.texto)} palabras`);
    const procesosPaso = new Set();
    for (const a of [...p.acciones].sort((x, y) => x.at - y.at)) {
      const { usa, aparece, desaparece } = analizar(a);
      for (const k of [...usa, ...aparece]) if (!esc.actores[k]) err(donde, `«${a.tipo}» usa «${k}», que no está declarado`);
      for (const k of usa) if (esc.actores[k] && !st.vis.has(k)) err(donde, `«${a.tipo}» (at ${a.at}) usa «${k}» cuando no está visible`);
      const pos = a.pos ?? a.to;
      for (const q of [pos, ...(a.tipo === 'divide' ? a.pos : [])].filter((x) => x && typeof x === 'object' && 'col' in x)) {
        if (q.col < 0 || q.col > 16 || q.row < 0 || q.row > 10) err(donde, `«${a.tipo}» fuera del lienzo (${q.col}, ${q.row})`);
      }
      if (a.tipo === 'connect') st.con.add(a.id);
      if (a.tipo === 'disconnect') { if (!st.con.has(a.id)) err(donde, `«disconnect» de «${a.id}», que no existe`); st.con.delete(a.id); }
      if (a.tipo === 'proceso') { procesosPaso.add(a.id); if (a.persist) st.pro.add(a.id); }
      if (a.tipo === 'cerrar_proceso') { if (!st.pro.has(a.id) && !procesosPaso.has(a.id)) err(donde, `«cerrar_proceso» de «${a.id}», que no está abierto`); st.pro.delete(a.id); }
      if (a.tipo === 'note' && palabras(a.text) > 12) aviso(donde, `nota de ${palabras(a.text)} palabras`);
      for (const k of desaparece) st.vis.delete(k);
      for (const k of aparece) st.vis.add(k);
    }
    // Los procesos no persistentes se cierran solos al cambiar de paso.
    for (const id of procesosPaso) if (!st.pro.has(id)) st.pro.delete(id);
    // Conectores con un extremo invisible desaparecen al cerrar el paso.
    for (const id of [...st.con]) { const c = p.acciones.find((x) => x.tipo === 'connect' && x.id === id); if (c && (!st.vis.has(c.from) || !st.vis.has(c.to))) st.con.delete(id); }
  }
}

const neo = partes.find((p) => p.id === 'neoplasias');
for (const n of NEOPLASIAS) if (!neo.pasos.some((p) => p.id === n.paso)) err('tabla-neoplasias', `«${n.nombre}» apunta a «${n.paso}», que no existe`);
for (const [id, f] of Object.entries(FICHAS)) if (f.id !== id) err('fichas', `la ficha «${id}» lleva id «${f.id}»`);

const total = partes.reduce((n, p) => n + p.pasos.length, 0);
console.log(`Maduración de linfocitos · ${partes.length - 1} partes + intro · ${total} pasos · ${Object.keys(FICHAS).length} fichas · ${Object.keys(IMAGENES).length} imágenes`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
