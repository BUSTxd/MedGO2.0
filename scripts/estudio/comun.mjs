/**
 * Piezas que comparten el indexador (`indexar-curso.mjs`) y el verificador
 * (`verificar-catalogo.mjs`) del planificador de estudio. Corren con
 * `node --experimental-strip-types`, así que importan los `.ts` de datos
 * directamente; los que tienen imports con alias `@/` (silabos.ts,
 * resumen-html.ts) se leen como texto.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = path.join(RAIZ, 'src', 'lib', 'data');
const DIR_EXAMENES = path.join(RAIZ, 'scripts', 'examenes');

/** Donde vive el índice: bucket privado de JSON (el de `resumenes` sólo acepta PDF/HTML). */
export const BUCKET_INDICE = 'examenes';
export const rutaIndice = (curso) => `_indice/${curso}.json`;

// `pathToFileURL`, no la ruta a secas: en Windows `C:\…` se lee como el esquema «c:».
export const importar = (archivo) => import(pathToFileURL(archivo).href);

let cliente = null;
export function supabase() {
  if (cliente) return cliente;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? config.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? config.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY (ni en la shell ni en .env.local).');
    process.exit(1);
  }
  cliente = createClient(url, key, { auth: { persistSession: false } });
  return cliente;
}

/** slug de curso → archivo del sílabo, leído de `silabos.ts` (no se puede importar: usa alias). */
export function archivosDeSilabos() {
  const txt = readFileSync(path.join(DATA, 'silabos.ts'), 'utf8');
  const varAArchivo = new Map();
  for (const m of txt.matchAll(/import \{ semanas as (\w+) \}\s+from '@\/lib\/data\/(\w+)'/g)) varAArchivo.set(m[1], m[2]);
  const mapa = new Map();
  for (const m of txt.matchAll(/^\s+'([a-z0-9-]+)':\s+(\w+)\s+as unknown/gm)) {
    const archivo = varAArchivo.get(m[2]);
    if (archivo) mapa.set(m[1], path.join(DATA, `${archivo}.ts`));
  }
  return mapa;
}

/** Las semanas del sílabo de un curso (`semanas` del archivo). */
export async function cargarSilabo(curso) {
  const archivo = archivosDeSilabos().get(curso);
  if (!archivo) return null;
  const mod = await importar(archivo);
  return mod.semanas ?? Object.values(mod).find((v) => Array.isArray(v) && v[0]?.actividades) ?? null;
}

/** id de resumen HTML → ruta en el bucket `resumenes`, leído de `resumen-html.ts`. */
export function resumenesHtml() {
  const txt = readFileSync(path.join(RAIZ, 'src', 'lib', 'resumen-html.ts'), 'utf8');
  const desde = txt.indexOf('export const FILE_ALIAS');
  const alias = txt.slice(desde, txt.indexOf('\n};', desde));
  const mapa = new Map();
  for (const m of alias.matchAll(/'([^']+)':\s*'([^']+)'/g)) mapa.set(m[1], m[2]);
  return mapa;
}

/** La tabla de temas de un curso, o null si no tiene. */
export async function cargarTemas(curso) {
  const archivo = path.join(DATA, 'temas', `${curso}.ts`);
  if (!existsSync(archivo)) return null;
  const mod = await importar(archivo);
  return Object.values(mod).find((v) => v && typeof v === 'object' && !Array.isArray(v)) ?? null;
}

export async function cargarExamenesAcceso() {
  const mod = await importar(path.join(DATA, 'examenes-acceso.ts'));
  return mod.EXAMENES;
}

export const hash = (s) => createHash('sha1').update(s).digest('base64url').slice(0, 16);

export async function bajarResumen(rutaBucket) {
  const { data, error } = await supabase().storage.from('resumenes').download(`${rutaBucket}.html`);
  if (error || !data) return null;
  return data.text();
}

/**
 * El JSON de un banqueo: la copia versionada de `scripts/examenes/` si existe
 * (`curso/clave` → `curso-clave.json`) y si no, el bucket.
 */
export async function cargarPractica(key) {
  const local = path.join(DIR_EXAMENES, `${key.replace(/\//g, '-')}.json`);
  if (existsSync(local)) return JSON.parse(readFileSync(local, 'utf8'));
  const { data, error } = await supabase().storage.from('examenes').download(`${key}.json`);
  if (error || !data) return null;
  return JSON.parse(await data.text());
}

export async function bajarIndice(curso) {
  const { data, error } = await supabase().storage.from(BUCKET_INDICE).download(rutaIndice(curso));
  if (error || !data) return null;
  return JSON.parse(await data.text());
}

/** Las opciones de resumen de una actividad, con su formato resuelto. */
export function opcionesDeResumen(act) {
  const r = act.resumen;
  if (!r) return [];
  const base = r.formato ?? 'pdf';
  const ops = r.opciones?.length ? r.opciones : [{ id: act.id, label: 'Resumen' }];
  return ops.map((o) => ({ id: o.id, label: o.label ?? 'Resumen', formato: o.formato ?? base }));
}

/** Las claves de práctica de una actividad: banqueo (con sus grupos) y tarjetas. */
export function clavesDePractica(act) {
  const out = [];
  if (act.examen?.key) {
    for (const k of [act.examen.key, ...(act.examen.groups ?? [])]) {
      out.push({ key: k, tipo: 'examen', etiqueta: act.examen.labels?.[k] });
    }
  }
  if (act.tarjetas?.key) out.push({ key: act.tarjetas.key, tipo: 'tarjetas' });
  return out;
}
