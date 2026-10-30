/**
 * Verifica el contenido del laboratorio «Lupus».
 *
 *   npm run verificar:lupus
 *
 * Lo propio de este laboratorio: LA VOZ ES EL RELOJ. Cada capítulo con
 * narración debe tener una marca por paso, en orden, y NINGUNA acción puede
 * terminar después del final de la frase de su paso (si no, la animación se
 * pasaría de la voz, que es lo que pasó en Hipersensibilidad). Además caza lo
 * que no rompe la compilación (actor usado antes de aparecer o ya oculto,
 * ficha que falta, parámetro que la lámina no dibuja, posiciones fuera del
 * lienzo) y compila cada capítulo con el motor (escritorio y teléfono) buscando
 * NaN. ERRORES → código 1.
 */

import { register } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

register('./cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const cargar = async (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);

/** Capítulos animados (los mismos que `PARTES` en src/lib/lupus/registro.ts). */
const ARCHIVOS = ['que-es', 'causas', 'basura', 'interferon', 'linfocitos', 'tipo-3', 'tipo-2', 'piel', 'corazon', 'nefritis', 'diagnostico', 'tratamiento'];
const partes = await Promise.all(ARCHIVOS.map(async (f) => (await cargar(`lib/data/lupus/${f}.ts`)).default));
const FICHAS = (await cargar('lib/data/lupus/fichas.ts')).default;
const { INDICE } = await cargar('lib/data/lupus/indice.ts');
const { NARRACION } = await cargar('lib/data/lupus/narracion.ts');
const { PARAMETROS } = await cargar('lib/data/lupus/zonas.ts');
const { VISTAZO } = await cargar('lib/data/lupus/vistazo.ts');
const { IMAGENES } = await cargar('lib/data/hipersensibilidad/imagenes.ts');
const { IMAGENES: IMG_LINF } = await cargar('lib/data/linfocitos/imagenes.ts');
const motor = await cargar('lib/lupus/motor.ts');

const errores = [], avisos = [];
const err = (d, m) => errores.push(`${d}: ${m}`);
const aviso = (d, m) => avisos.push(`${d}: ${m}`);
const palabras = (t) => t.trim().split(/\s+/).filter(Boolean).length;

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

// Índice y narración: 12 capítulos, una voz por capítulo, numerados en orden.
if (INDICE.length !== NARRACION.length) err('indice', `${INDICE.length} capítulos en el índice y ${NARRACION.length} audios`);
INDICE.forEach((m, i) => { if (m.numero !== i) err('indice', `«${m.id}» lleva el número ${m.numero} en la posición ${i}`); });

for (const esc of partes) {
  const meta = INDICE.find((m) => m.id === esc.id);
  if (!meta) err(esc.id, 'no está en el índice');
  const voz = esc.narracion;
  if (!voz) err(esc.id, 'sin narración: en este laboratorio la voz marca la duración de cada paso');
  else {
    if (meta && voz !== NARRACION[meta.numero]) err(esc.id, `usa una narración que no es la del capítulo ${meta.numero}`);
    if (voz.marcas.length !== esc.pasos.length) err(esc.id, `la narración tiene ${voz.marcas.length} marcas y el capítulo ${esc.pasos.length} pasos`);
    if (voz.marcas[0] !== 0) err(esc.id, 'la primera marca debe ser 0');
    if (voz.marcas.some((m, i) => i > 0 && m <= voz.marcas[i - 1])) err(esc.id, 'las marcas no van en orden creciente');
    if (voz.marcas.at(-1) >= voz.duracion) err(esc.id, 'la última marca cae después del final del audio');
  }
  for (const [k, d] of Object.entries(esc.actores)) {
    if (!['ancla', 'caja', 'texto', 'icono'].includes(d.forma) && !FICHAS[d.info ?? k]) err(esc.id, `el actor «${k}» no tiene ficha («${d.info ?? k}»)`);
    if (d.img && !IMAGENES[d.img] && !IMG_LINF[d.img]) err(esc.id, `el actor «${k}» usa la imagen «${d.img}», que no existe`);
  }
  const durVoz = motor.duracionesVoz(esc);
  const st = { vis: new Set(), con: new Set(), pro: new Set() };
  let fondo = esc.fondo;
  const ids = new Set();
  esc.pasos.forEach((p, i) => {
    const donde = `${esc.id} · ${p.id}`;
    if (ids.has(p.id)) err(donde, 'id de paso repetido');
    ids.add(p.id);
    if (palabras(p.texto) > 60) aviso(donde, `texto en pantalla de ${palabras(p.texto)} palabras`);
    // La regla de la voz: nada se anima después de que termina su frase.
    const limite = durVoz?.[i];
    if (limite) {
      for (const a of p.acciones) {
        const fin = a.at + motor.duracionDe(a);
        if (fin > limite) err(donde, `«${a.tipo}» (at ${a.at}) termina a ${(fin / 1000).toFixed(2)} s y la frase del paso dura ${(limite / 1000).toFixed(2)} s`);
      }
      const ultima = Math.max(0, ...p.acciones.map((a) => a.at + motor.duracionDe(a)));
      if (limite - ultima > 9000) aviso(donde, `${((limite - ultima) / 1000).toFixed(1)} s de voz al final sin nada que se mueva`);
    }
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
      if (a.tipo === 'tejido' && !PARAMETROS[fondo]?.includes(a.param)) err(donde, `parámetro «${a.param}» que la lámina «${fondo}» no dibuja`);
      if (a.tipo === 'connect') st.con.add(a.id);
      if (a.tipo === 'disconnect') { if (!st.con.has(a.id)) err(donde, `«disconnect» de «${a.id}», que no existe`); st.con.delete(a.id); }
      if (a.tipo === 'proceso') { procesosPaso.add(a.id); if (a.persist) st.pro.add(a.id); }
      if (a.tipo === 'cerrar_proceso') { if (!st.pro.has(a.id) && !procesosPaso.has(a.id)) err(donde, `«cerrar_proceso» de «${a.id}», que no está abierto`); st.pro.delete(a.id); }
      if (a.tipo === 'note' && palabras(a.text) > 12) aviso(donde, `nota de ${palabras(a.text)} palabras`);
      for (const k of desaparece) st.vis.delete(k);
      for (const k of aparece) st.vis.add(k);
    }
    // Una lámina nueva sin retirar las células del paso anterior las dejaría encima.
    if (i > 0 && p.acciones.some((a) => a.tipo === 'fondo') && st.vis.size) {
      const nuevas = new Set(p.acciones.filter((a) => a.tipo === 'appear').map((a) => a.actor));
      const quedan = [...st.vis].filter((k) => !nuevas.has(k));
      if (quedan.length) aviso(donde, `cambia de lámina con ${quedan.join(', ')} todavía a la vista`);
    }
  });
}

for (const id of VISTAZO) if (!INDICE.some((m) => m.id === id)) err('vistazo', `«${id}» no es un capítulo`);
for (const [id, f] of Object.entries(FICHAS)) if (f.id !== id) err('fichas', `la ficha «${id}» lleva id «${f.id}»`);

// ─── Barrido con el motor ─────────────────────────────────────────────────────
const MODOS = [motor.MODO_ESCRITORIO, { asp: 0.5, movil: true }, { asp: 1.6, movil: true }];
let fotogramas = 0;
for (const esc of partes) {
  for (const modo of MODOS) {
    let c;
    try { c = motor.compilar(esc, modo); } catch (e) { err(esc.id, `el motor falla al compilar (${modo.movil ? `teléfono ${modo.asp}` : 'escritorio'}): ${e.message}`); continue; }
    const total = c.pasos.reduce((s, pc) => s + pc.duracion, 0) / 1000;
    if (!modo.movil && esc.narracion && Math.abs(total - esc.narracion.duracion) > 0.05) err(esc.id, `el capítulo dura ${total.toFixed(2)} s y su voz ${esc.narracion.duracion} s`);
    for (const pc of c.pasos) {
      const donde = `${esc.id} · ${pc.paso.id} (${modo.movil ? `teléfono ${modo.asp}` : 'escritorio'})`;
      for (const f of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
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
        for (const [p, v] of Object.entries(e.tejido)) if (!Number.isFinite(v)) err(donde, `parámetro «${p}» = ${v}`);
      }
    }
  }
}

const total = partes.reduce((n, p) => n + p.pasos.length, 0);
const min = partes.reduce((n, p) => n + (p.narracion?.duracion ?? 0), 0) / 60;
console.log(`Lupus · ${partes.length} de ${INDICE.length} capítulos animados · ${total} pasos · ${min.toFixed(1)} min de voz · ${Object.keys(FICHAS).length} fichas · ${fotogramas} fotogramas evaluados`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of errores) console.log(`  ERROR  ${e}`);
if (errores.length) { console.log(`\n${errores.length} error(es).`); process.exit(1); }
console.log(avisos.length ? `\nSin errores (${avisos.length} avisos).` : '\nSin errores.');
