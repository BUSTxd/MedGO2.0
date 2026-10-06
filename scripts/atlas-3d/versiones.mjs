// Versiones del atlas en el bucket: lista y borra las que ya no se usan.
//
//   node scripts/atlas-3d/versiones.mjs                    → lista región, versión y tamaños
//   node scripts/atlas-3d/versiones.mjs --borrar-viejas     → borra todo lo que no sea la
//                                                            versión de src/lib/data/atlas-3d/regiones.ts
//
// Borrar solo cuando el deploy de Vercel que usa la versión nueva esté en
// `success` (gh api repos/{owner}/{repo}/commits/<sha>/statuses): hasta entonces
// la web en producción sigue pidiendo la anterior.

import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from '../load-env.mjs';

dns.setDefaultResultOrder('ipv4first'); // por IPv6 el CDN de Supabase corta la conexión en esta máquina

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const BORRAR = process.argv.includes('--borrar-viejas');
const BUCKET = 'laboratorio-img';
const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const B = supabase.storage.from(BUCKET);

const { data: regiones, error } = await B.list('atlas-3d');
if (error) throw new Error(error.message);

// Versión en uso de cada región, leída del código: el primer `version: 'vN'`
// después de su `id: '<región>'` (buscar por el nombre exacto: las zonas también llevan `id`).
const ts = fs.readFileSync(path.join(AQUI, '../../src/lib/data/atlas-3d/regiones.ts'), 'utf8');
const enUso = new Map();
for (const { name: region } of regiones) {
  const i = ts.indexOf(`id: '${region}'`);
  const v = i < 0 ? null : ts.slice(i).match(/version: '(v\d+)'/)?.[1];
  if (!v) throw new Error(`${region} está en el bucket pero no en regiones.ts: no borro nada`);
  enUso.set(region, v);
}
const viejas = [];
for (const { name: region } of regiones) {
  const { data: versiones } = await B.list(`atlas-3d/${region}`);
  for (const { name: v } of versiones ?? []) {
    const { data: archivos } = await B.list(`atlas-3d/${region}/${v}`);
    const kb = (archivos ?? []).reduce((s, a) => s + (a.metadata?.size ?? 0), 0) / 1024;
    const usada = enUso.get(region) === v;
    console.log(`${usada ? '●' : '○'} ${region}/${v}  ${kb.toFixed(0)} kB${usada ? '  (en uso)' : ''}`);
    if (!usada) viejas.push(...(archivos ?? []).map((a) => `atlas-3d/${region}/${v}/${a.name}`));
  }
}

if (BORRAR && viejas.length) {
  const { error: e } = await B.remove(viejas);
  if (e) throw new Error(e.message);
  console.log(`✗ borrados ${viejas.length} archivos de versiones viejas`);
} else if (viejas.length) {
  console.log(`(${viejas.length} archivos de versiones viejas; --borrar-viejas los borra)`);
}
