/**
 * Verifica el contenido del laboratorio «Hipersensibilidad».
 *
 *   npm run verificar:hipersensibilidad
 *
 * Caza lo que no rompe la compilación: actor usado antes de aparecer o ya
 * oculto, ficha o imagen que falta, conector o lupa inexistentes, posiciones
 * fuera del lienzo, parámetros de tejido que no existen en el fondo, filas de
 * la tabla que apuntan a un paso que no existe, narraciones largas. Además
 * compila cada capítulo con el motor (escritorio y teléfono) y comprueba que la
 * escena no da NaN y que la cámara no se sale. ERRORES → código 1.
 */

import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('./cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cargar = async (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);

const ARCHIVOS = ['sensibilizacion', 'fase-inmediata', 'fase-tardia', 'anafilaxia', 'tipo-2', 'tipo-3', 'tipo-4', 'integracion', 'intro'];
const partes = await Promise.all(ARCHIVOS.map(async (f) => (await cargar(`lib/data/hipersensibilidad/${f}.ts`)).default));
const FICHAS = (await cargar('lib/data/hipersensibilidad/fichas.ts')).default;
const { IMAGENES } = await cargar('lib/data/hipersensibilidad/imagenes.ts');
const { IMAGENES: IMG_LINF } = await cargar('lib/data/linfocitos/imagenes.ts');
const { TIPOS, ENFERMEDADES } = await cargar('lib/data/hipersensibilidad/tabla-tipos.ts');
const { ZONAS } = await cargar('lib/data/hipersensibilidad/zonas.ts');
const motor = await cargar('lib/hipersensibilidad/motor.ts');

const errores = [], avisos = [];
const err = (d, m) => errores.push(`${d}: ${m}`);
const aviso = (d, m) => avisos.push(`${d}: ${m}`);
const palabras = (t) => t.trim().split(/\s+/).filter(Boolean).length;

/** Parámetros que lee cada fondo (los de `zonas.ts`). */
const PARAMS = Object.fromEntries(Object.entries(ZONAS).map(([f, z]) => [f, new Set(Object.keys(z))]));

function analizar(a) {
  const usa = [], aparece = [], desaparece = [];
  switch (a.tipo) {
    case 'appear': aparece.push(a.actor); break;
    case 'move': case 'activate': case 'deactivate': case 'swap': case 'express': case 'unexpress': case 'degranular': usa.push(a.actor); break;
    case 'hide': case 'apoptosis': case 'lisis': usa.push(a.actor); desaparece.push(a.actor); break;
    case 'divide': usa.push(a.actor); desaparece.push(a.actor); aparece.push(...a.into); break;
    case 'bind': usa.push(a.actor, a.target); break;
    case 'release': usa.push(a.actor, a.from); break;
    case 'fagocitar': usa.push(a.actor, a.target); break;
    case 'secretar': usa.push(a.actor); if (typeof a.hacia === 'string') usa.push(a.hacia); break;
    case 'proceso': usa.push(a.cerca); break;
    case 'pulse_signal': case 'connect': usa.push(a.from, a.to); break;
    case 'note': usa.push(a.near); break;
    default: break;
  }
  if (a.tipo === 'degranular') usa.push(...(a.hacia ?? []));
  return { usa, aparece, desaparece };
}

for (const esc of partes) {
  const voz = esc.narracion;
  if (voz) {
    if (voz.marcas.length !== esc.pasos.length) err(esc.id, `la narración tiene ${voz.marcas.length} marcas y el capítulo ${esc.pasos.length} pasos`);
    if (voz.marcas.some((m, i) => i > 0 && m <= voz.marcas[i - 1])) err(esc.id, "las marcas de la narración no van en orden creciente");
  }
  for (const [k, d] of Object.entries(esc.actores)) {
    if (d.forma !== 'ancla' && !FICHAS[d.info ?? k]) err(esc.id, `el actor «${k}» no tiene ficha («${d.info ?? k}»)`);
    if (d.img && !IMAGENES[d.img] && !IMG_LINF[d.img]) err(esc.id, `el actor «${k}» usa la imagen «${d.img}», que no existe`);
  }
  const st = { vis: new Set(), con: new Set(), pro: new Set() };
  let fondo = esc.fondo;
  const ids = new Set();
  for (const p of esc.pasos) {
    const donde = `${esc.id} · ${p.id}`;
    if (ids.has(p.id)) err(donde, 'id de paso repetido');
    ids.add(p.id);
    if (palabras(p.texto) > 60) aviso(donde, `narración de ${palabras(p.texto)} palabras`);
    const procesosPaso = new Set();
    for (const a of [...p.acciones].sort((x, y) => x.at - y.at)) {
      const { usa, aparece, desaparece } = analizar(a);
      for (const k of [...usa, ...aparece]) if (!esc.actores[k]) err(donde, `«${a.tipo}» usa «${k}», que no está declarado`);
      for (const k of usa) if (esc.actores[k] && !st.vis.has(k)) err(donde, `«${a.tipo}» (at ${a.at}) usa «${k}» cuando no está visible`);
      const pos = a.pos ?? a.to ?? (a.hacia && typeof a.hacia === 'object' && !Array.isArray(a.hacia) ? a.hacia : null);
      for (const q of [pos, ...(a.tipo === 'divide' ? a.pos : [])].filter((x) => x && typeof x === 'object' && 'col' in x)) {
        if (q.col < 0 || q.col > 16 || q.row < 0 || q.row > 10) err(donde, `«${a.tipo}» fuera del lienzo (${q.col}, ${q.row})`);
      }
      if (a.tipo === 'fondo') fondo = a.fondo;
      if (a.tipo === 'tejido' && !PARAMS[fondo]?.has(a.param)) err(donde, `parámetro «${a.param}» que el fondo «${fondo}» no dibuja`);
      if (a.tipo === 'connect') st.con.add(a.id);
      if (a.tipo === 'disconnect') { if (!st.con.has(a.id)) err(donde, `«disconnect» de «${a.id}», que no existe`); st.con.delete(a.id); }
      if (a.tipo === 'proceso') { procesosPaso.add(a.id); if (a.persist) st.pro.add(a.id); if (a.datos.clase === 'lamina' && !IMAGENES[a.datos.img]) err(donde, `lámina «${a.datos.img}» sin imagen`); }
      if (a.tipo === 'cerrar_proceso') { if (!st.pro.has(a.id) && !procesosPaso.has(a.id)) err(donde, `«cerrar_proceso» de «${a.id}», que no está abierto`); st.pro.delete(a.id); }
      if (a.tipo === 'note' && palabras(a.text) > 12) aviso(donde, `nota de ${palabras(a.text)} palabras`);
      for (const k of desaparece) st.vis.delete(k);
      for (const k of aparece) st.vis.add(k);
    }
    for (const id of [...st.con]) { const c = p.acciones.find((x) => x.tipo === 'connect' && x.id === id); if (c && (!st.vis.has(c.from) || !st.vis.has(c.to))) st.con.delete(id); }
  }
}

const porId = Object.fromEntries(partes.map((p) => [p.id, p]));
for (const f of [...TIPOS, ...ENFERMEDADES]) {
  const d = f.destino;
  if (!porId[d.parte]?.pasos.some((p) => p.id === d.paso)) err('tabla', `«${f.nombre ?? f.tipo}» apunta a ${d.parte} · ${d.paso}, que no existe`);
}
const { VISTAZO } = await cargar('lib/data/hipersensibilidad/vistazo.ts');
if (!VISTAZO.length) err('vistazo', 'no hay ningún capítulo gratis');
for (const id of VISTAZO) if (!porId[id] || id === 'intro') err('vistazo', `«${id}» no es un capítulo`);
for (const [id, f] of Object.entries(FICHAS)) if (f.id !== id) err('fichas', `la ficha «${id}» lleva id «${f.id}»`);

// ─── Barrido con el motor ─────────────────────────────────────────────────────
const MODOS = [motor.MODO_ESCRITORIO, { asp: 0.5, movil: true }, { asp: 1.6, movil: true }];
let fotogramas = 0;
for (const esc of partes) {
  for (const modo of MODOS) {
    let c;
    try { c = motor.compilar(esc, modo); } catch (e) { err(esc.id, `el motor falla al compilar (${modo.movil ? `teléfono ${modo.asp}` : 'escritorio'}): ${e.message}`); continue; }
    for (const pc of c.pasos) {
      const donde = `${esc.id} · ${pc.paso.id} (${modo.movil ? `teléfono ${modo.asp}` : 'escritorio'})`;
      if (!modo.movil && pc.duracion > 14000) aviso(donde, `el paso dura ${(pc.duracion / 1000).toFixed(1)} s`);
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        const e = motor.evaluar(pc, pc.duracion * f);
        fotogramas++;
        const cam = e.camara;
        if (![cam.x, cam.y, cam.w, cam.h].every(Number.isFinite) || cam.w <= 0) { err(donde, `cámara inválida a ${f * 100} %`); break; }
        for (const [k, a] of Object.entries(e.actores)) {
          if (!a.vis) continue;
          const q = motor.posAbs(e, k);
          if (!Number.isFinite(q.x) || !Number.isFinite(q.y) || !Number.isFinite(a.esc)) { err(donde, `«${k}» con posición NaN a ${f * 100} %`); continue; }
          if (f === 1 && (q.x < -40 || q.x > motor.ANCHO + 40 || q.y < -40 || q.y > motor.ALTO + 40)) err(donde, `«${k}» termina fuera del lienzo (${q.x.toFixed(0)}, ${q.y.toFixed(0)})`);
        }
        for (const [p, v] of Object.entries(e.tejido)) if (!Number.isFinite(v)) err(donde, `tejido «${p}» = ${v}`);
      }
    }
  }
}

const total = partes.reduce((n, p) => n + p.pasos.length, 0);
console.log(`Hipersensibilidad · ${partes.length - 1} capítulos + intro · ${total} pasos · ${Object.keys(FICHAS).length} fichas · ${Object.keys(IMAGENES).length} recortes · ${fotogramas} fotogramas evaluados`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
