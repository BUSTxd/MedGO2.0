/**
 * Publica el contenido de las clases: las «Notas» y los «Casos clínicos» de la
 * plantilla de /estudio. El contenido vive fuera de git (`data/clases/<curso>/<clase>.json`:
 * lleva respuestas y el repo es público); aquí se valida, se sube al bucket privado
 * `examenes` y se apunta en `src/lib/data/clases/registro.ts`, que sí va a git (solo
 * dice qué clase tiene qué). Formato y reglas: docs/clases/PLANTILLA.md.
 *
 *   node --experimental-strip-types --no-warnings scripts/clases/publicar.mjs patologia/pat-ai-17
 *   ...publicar.mjs --curso patologia          todas las de un curso
 *   ...publicar.mjs --todo                     todas
 *   (añadir --subir para subir; sin él solo valida y dice qué haría)
 *   ...publicar.mjs --retirar patologia/pat-ai-17   la quita del registro (el bucket no se toca)
 *   ...publicar.mjs --verificar                el registro contra el sílabo y el bucket
 *
 * Tras subir: commit del registro y deploy, o la clase no estrena sus pestañas.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { RAIZ, cargarSilabo, supabase } from '../estudio/comun.mjs';
import { prepararClase, validarClase } from './validar.mjs';

const DIR = path.join(RAIZ, 'data', 'clases');
const REGISTRO = path.join(RAIZ, 'src', 'lib', 'data', 'clases', 'registro.ts');
const BUCKET = 'examenes';

const args = process.argv.slice(2);
const bandera = (b) => args.includes(b);
const valorDe = (b) => { const i = args.indexOf(b); return i >= 0 ? args[i + 1] : undefined; };
const sueltos = args.filter((a, i) => !a.startsWith('--') && !['--curso', '--retirar'].includes(args[i - 1]));

// ── Registro ─────────────────────────────────────────────────────────────────

const CABECERA = `// GENERADO por scripts/clases/publicar.mjs: no se edita a mano. Qué clases tienen
// notas y casos en el bucket, sin su contenido (que es de pago y va fuera de git).
import type { RegistroClases } from './tipos.ts';

export const REGISTRO_CLASES: RegistroClases = `;

function leerRegistro() {
  const txt = readFileSync(REGISTRO, 'utf8');
  const desde = txt.indexOf('RegistroClases = ');
  if (desde < 0) throw new Error('registro.ts no tiene el formato que escribe este script');
  return JSON.parse(txt.slice(desde + 'RegistroClases = '.length).trim().replace(/;\s*$/, ''));
}

function escribirRegistro(reg) {
  const ordenado = Object.fromEntries(Object.keys(reg).sort((a, b) => a.localeCompare(b, 'es', { numeric: true })).map((k) => [k, reg[k]]));
  writeFileSync(REGISTRO, `${CABECERA}${JSON.stringify(ordenado, null, 2)};\n`);
}

// ── Contenido local ──────────────────────────────────────────────────────────

/** `curso/clase` de cada archivo de data/clases/. */
function clasesLocales(curso) {
  if (!existsSync(DIR)) return [];
  const cursos = curso ? [curso] : readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  return cursos.flatMap((c) => {
    const dir = path.join(DIR, c);
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => `${c}/${f.slice(0, -5)}`);
  });
}

const silabos = new Map();
async function actividad(curso, clase) {
  if (!silabos.has(curso)) silabos.set(curso, await cargarSilabo(curso));
  const semanas = silabos.get(curso);
  if (!semanas) return null;
  for (const s of semanas) for (const a of s.actividades) if (a.id === clase) return a;
  return null;
}

// ── Órdenes ──────────────────────────────────────────────────────────────────

async function verificar() {
  const reg = leerRegistro();
  let fallos = 0;
  for (const [k, e] of Object.entries(reg)) {
    const problemas = [];
    if (k !== `${e.curso}/${e.clase}`) problemas.push('la clave no casa con curso/clase');
    if (!(await actividad(e.curso, e.clase))) problemas.push('no está en el sílabo');
    const rutas = [...(e.notas ? [`${e.curso}/notas/${e.clase}.json`] : []), ...(e.casos ? [`${e.casos.key}.json`] : [])];
    for (const r of rutas) {
      const { data, error } = await supabase().storage.from(BUCKET).download(r);
      if (error || !data) problemas.push(`falta ${r} en el bucket`);
      else if (e.casos && r === `${e.casos.key}.json`) {
        const n = JSON.parse(await data.text()).questions?.length;
        if (n !== e.casos.total) problemas.push(`el registro dice ${e.casos.total} casos y el bucket tiene ${n}`);
      }
    }
    if (problemas.length) { fallos++; console.log(`✗ ${k}: ${problemas.join('; ')}`); }
    else console.log(`✓ ${k}${e.notas ? ' · notas' : ''}${e.casos ? ` · ${e.casos.total} casos (${e.casos.libre ? 'libres' : `muestra ${e.casos.muestra}`})` : ''}`);
  }
  console.log(`\n${Object.keys(reg).length} clases en el registro, ${fallos} con problemas.`);
  process.exit(fallos ? 1 : 0);
}

function retirar(clave) {
  const reg = leerRegistro();
  if (!reg[clave]) { console.error(`${clave} no está en el registro.`); process.exit(1); }
  delete reg[clave];
  escribirRegistro(reg);
  console.log(`${clave} fuera del registro. Commit y deploy para que desaparezca de /estudio.`);
}

async function publicar(claves, subir) {
  if (!claves.length) {
    console.error('Nada que publicar. Uso: publicar.mjs <curso>/<clase> | --curso <curso> | --todo [--subir]');
    process.exit(1);
  }
  const reg = leerRegistro();
  let malas = 0;
  for (const clave of claves) {
    const [curso, clase] = clave.split('/');
    const archivo = path.join(DIR, curso, `${clase}.json`);
    if (!existsSync(archivo)) { console.log(`✗ ${clave}: no existe ${path.relative(RAIZ, archivo)}`); malas++; continue; }
    let json;
    try { json = JSON.parse(readFileSync(archivo, 'utf8')); } catch (e) {
      console.log(`✗ ${clave}: JSON roto (${e.message})`); malas++; continue;
    }
    const act = await actividad(curso, clase);
    const { errores, avisos } = validarClase(json, { curso, clase, act });
    for (const a of avisos) console.log(`  aviso ${clave}: ${a}`);
    if (errores.length) {
      malas++;
      console.log(`✗ ${clave}:\n    ${errores.join('\n    ')}`);
      continue;
    }
    const { sube, entrada } = prepararClase(json, { curso, clase });
    const que = [entrada.notas && `notas (${json.notas.secciones.length} secciones)`, entrada.casos && `${entrada.casos.total} casos, ${entrada.casos.libre ? 'libres' : `muestra ${entrada.casos.muestra}`}`].filter(Boolean).join(' · ');
    if (!subir) { console.log(`✓ ${clave}: ${que} (sin subir: falta --subir)`); continue; }
    for (const { ruta, cuerpo } of sube) {
      const { error } = await supabase().storage.from(BUCKET).upload(ruta, JSON.stringify(cuerpo), { contentType: 'application/json', upsert: true });
      if (error) { console.error(`✗ ${clave}: no se pudo subir ${ruta}: ${error.message}`); process.exit(1); }
    }
    reg[clave] = entrada;
    console.log(`✓ ${clave}: ${que} · subido`);
  }
  if (subir) escribirRegistro(reg);
  console.log(malas ? `\n${malas} con errores: no se publicaron.` : subir ? '\nRegistro al día. Falta commit y deploy.' : '');
  process.exit(malas ? 1 : 0);
}

if (bandera('--verificar')) await verificar();
else if (bandera('--retirar')) retirar(valorDe('--retirar'));
else await publicar(bandera('--todo') ? clasesLocales() : valorDe('--curso') ? clasesLocales(valorDe('--curso')) : sueltos, bandera('--subir'));
