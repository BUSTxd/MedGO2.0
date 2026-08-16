/**
 * Publica un resumen de tipo "PDF reconstruido en capas" (ver
 * /addresumencapas). Hermano de `upload-resumen-html.mjs`, que sólo sabe de
 * exports de Notion y aborta con este formato.
 *
 *   node scripts/upload-resumen-capas.mjs \
 *     --dir "C:/Users/BUST/Downloads/Te8_Comunicacion_HTML_optimizado" \
 *     --curso biologia-celular --id bcm-te-8 --slug te8-comunicacion-celular
 *
 * Hace, en este orden:
 *   1. aplica las correcciones del auditor (extensiones reales, aspecto de las
 *      figuras, object-fit, mix-blend-mode de la tinta) — aborta si el auditor
 *      encuentra algo que no sabe reparar;
 *   2. sube `assets/*` tal cual al bucket PÚBLICO `resumenes-img` (ya son AVIF:
 *      NO se recomprimen, sería una segunda pérdida sobre un formato lossy);
 *   3. reduce el documento a un fragmento con las tres capas y lo sube al
 *      bucket PRIVADO `resumenes`.
 *
 * Lo que NO hace (son cambios de código, quedan para el agente):
 *   - registrar el id en ALLOWED/FILE_ALIAS de la route de resumen-html
 *   - marcar la actividad en `src/lib/data/<curso>.ts`
 *
 * Flags: --dry (no sube, deja `<id>.preview.html`) · --force (re-sube y pisa).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { config } from './load-env.mjs';

const BUCKET_IMG  = 'resumenes-img';   // público
const BUCKET_HTML = 'resumenes';       // privado
const DESVIO_MAX  = 2;                 // % de aspecto tolerado sin corregir

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const key = a.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[key] = true;
  else { args[key] = next; i++; }
}

const { dir, curso, id, slug, dry, force } = args;
if (!dir || !curso || !id || !slug) {
  console.error('Faltan flags. Uso:\n  node scripts/upload-resumen-capas.mjs --dir <carpeta> --curso <slug-curso> --id <id> --slug <slug-doc> [--dry] [--force]');
  process.exit(1);
}
if (!existsSync(dir)) { console.error(`No existe la carpeta: ${dir}`); process.exit(1); }

const PREFIX = `${curso}/${slug}`;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

// ─── 1. localizar y validar el HTML ──────────────────────────────────────
const htmls = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html') && !/preview/i.test(f));
if (htmls.length !== 1) {
  console.error(`Esperaba 1 .html (sin contar preview), encontré ${htmls.length}: ${htmls.join(', ')}`);
  process.exit(1);
}
let html = readFileSync(join(dir, htmls[0]), 'utf8');
console.log(`\nHTML   : ${htmls[0]}  (${kb(Buffer.byteLength(html, 'utf8'))})`);

if (!/class="image-layer"/.test(html) || !/class="text-layer"/.test(html)) {
  console.error('✗ No es un PDF reconstruido en capas (faltan .image-layer / .text-layer).');
  console.error('  Si es un export de Notion, usa upload-resumen-html.mjs.');
  process.exit(1);
}

const mPage = html.match(/--page-w:\s*([\d.]+)px;\s*--page-h:\s*([\d.]+)px/);
if (!mPage) { console.error('✗ No encontré --page-w / --page-h.'); process.exit(1); }
const [PAGE_W, PAGE_H] = [mPage[1], mPage[2]];
console.log(`página : ${(+PAGE_W).toFixed(0)} × ${(+PAGE_H).toFixed(0)} px`);

// ─── 2. correcciones del auditor ─────────────────────────────────────────
// Se aplican SIEMPRE, aunque el HTML ya venga arreglado: son idempotentes y
// evitan depender de que alguien recuerde correr el auditor antes.
const refsRaw = [...new Set([...html.matchAll(/src="([^"]+\.(?:png|jpe?g|webp|avif))"/gi)].map(m => m[1]))];
const renombres = new Map();
for (const ref of refsRaw) {
  if (existsSync(join(dir, ref))) continue;
  const base = ref.replace(/\.(png|jpe?g|webp|avif)$/i, '');
  const alt = ['avif', 'webp', 'png', 'jpg', 'jpeg'].map(e => `${base}.${e}`).find(c => existsSync(join(dir, c)));
  if (!alt) { console.error(`✗ falta el archivo ${ref} y no hay variante en disco.`); process.exit(1); }
  renombres.set(ref, alt);
}
for (const [de, a] of renombres) html = html.split(`src="${de}"`).join(`src="${a}"`);
if (renombres.size) console.log(`✓ ${renombres.size} referencias reapuntadas a la extensión real`);

// aspecto: se corrige por el ancho — cambiar el alto empujaría la figura
// contra el texto de abajo, que está en coordenada fija.
const srcDe = new Map([...html.matchAll(/data-image="([^"]+)"[\s\S]{0,400}?src="([^"]+)"/g)].map(m => [m[1], m[2]]));
let corregidas = 0;
for (const c of [...html.matchAll(/data-image="([^"]+)"[^>]*style="left:([\d.]+)px;top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px"/g)]) {
  const [, idFig, , , w, h] = c;
  const ref = srcDe.get(idFig);
  if (!ref || !existsSync(join(dir, ref))) continue;
  const meta = await sharp(join(dir, ref)).metadata();
  const desvio = ((meta.width / meta.height) / (+w / +h) - 1) * 100;
  if (Math.abs(desvio) <= DESVIO_MAX) continue;
  const wOk = Math.round(+h * (meta.width / meta.height));
  html = html.replace(`width:${(+w).toFixed(3)}px;height:${(+h).toFixed(3)}px`,
                      `width:${wOk.toFixed(3)}px;height:${(+h).toFixed(3)}px`);
  console.log(`✓ figura ${idFig}: ancho ${w} → ${wOk}  (deformaba ${desvio.toFixed(1)}%)`);
  corregidas++;
}

// red de seguridad para los desvíos por debajo del umbral
html = html.replace(/object-fit:fill/g, 'object-fit:contain');

// el resaltador se extrae OPACO y tapa el texto; multiply lo devuelve a
// comportarse como rotulador. Se aplica en el CSS del módulo, pero también
// aquí por si el fragmento se abriera suelto.
const tieneMultiply = /mix-blend-mode/.test(html);

// ─── 3. Supabase ─────────────────────────────────────────────────────────
const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('Faltan credenciales en .env.local'); process.exit(1); }
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BASE_PUB = `${URL}/storage/v1/object/public/${BUCKET_IMG}`;

// ─── 4. subir los assets ─────────────────────────────────────────────────
// Ya son AVIF: se suben tal cual. Recomprimir un AVIF sería una segunda
// pérdida sobre un formato que ya es lossy.
const assets = [...new Set([...html.matchAll(/src="([^"]+\.(?:png|jpe?g|webp|avif))"/gi)].map(m => m[1]))];
let bytes = 0, subidas = 0;
const fallos = [];

console.log(`\nassets : ${assets.length}`);
for (const ref of assets) {
  const p = join(dir, ref);
  const buf = readFileSync(p);
  bytes += buf.length;
  const dest = `${PREFIX}/${ref.split('/').pop()}`;
  if (dry) { subidas++; continue; }
  const ext = ref.split('.').pop().toLowerCase();
  const mime = ext === 'avif' ? 'image/avif' : ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const { error } = await sb.storage.from(BUCKET_IMG).upload(dest, buf, {
    contentType: mime,
    cacheControl: '31536000, immutable',  // una figura no se reedita
    upsert: Boolean(force),
  });
  if (error) fallos.push(`${dest}: ${error.message}`);
  else subidas++;
  process.stdout.write(`\r  subidos: ${subidas}/${assets.length}`);
}
console.log(`\r  subidos: ${subidas}/${assets.length}   ${kb(bytes)}`);
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallos:`);
  fallos.slice(0, 10).forEach(f => console.error('   ' + f));
  if (!force) console.error('\n  Si lo estás actualizando, repite con --force.');
  process.exit(1);
}

// ─── 5. reducir a fragmento ──────────────────────────────────────────────
// Fuera <head>, el <style> global (html/body/* pisarían el dashboard: los
// estilos los pone resumenHtml.module.css) y el <script> del fit() (no se
// ejecuta con dangerouslySetInnerHTML; el escalado lo hace el visor en React).
const ini = html.indexOf('<article class="page"');
const fin = html.indexOf('</article>', ini);
if (ini === -1 || fin === -1) { console.error('✗ No encontré <article class="page">.'); process.exit(1); }
const page = html.slice(ini, fin + '</article>'.length);

// rutas locales → CDN público
let body = page.replace(/src="([^"]+\.(?:png|jpe?g|webp|avif))"/gi,
  (_, p) => `src="${BASE_PUB}/${PREFIX}/${p.split('/').pop()}"`);

// Carga diferida de las figuras. Dos exclusiones:
//  - la tinta: es UNA imagen que cubre el documento entero y hace falta desde
//    el primer scroll, así que diferirla sólo retrasaría lo inevitable;
//  - las que ya traen `loading`: el export suele ponerlo, y añadirlo otra vez
//    deja el atributo duplicado (el navegador se queda con el primero, pero
//    es markup sucio que además engaña al contar figuras diferidas).
body = body.replace(/<img (?!class="ink")(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async" ');

// el wrapper lleva las medidas de ESTE documento; el resto del estilo es
// común y vive en el CSS module.
const frag = `<div class="capas" style="--page-w:${PAGE_W}px;--page-h:${PAGE_H}px">`
           + `<div class="page-shell">${body}</div></div>`;

const quedan = (frag.match(/src="(?!https:\/\/)/g) || []).length;
if (quedan) { console.error(`✗ Quedaron ${quedan} rutas locales sin reapuntar.`); process.exit(1); }

console.log(`\nfragmento: ${kb(Buffer.byteLength(frag, 'utf8'))}  ·  ${assets.length} assets  ·  ${corregidas} figuras corregidas  ·  tinta ${tieneMultiply ? 'ya con' : 'sin'} multiply en el HTML (la pone el CSS)`);

// ─── 6. subir el fragmento ───────────────────────────────────────────────
const destHtml = `${curso}/${id}.html`;
if (dry) {
  const out = join(dir, `${id}.preview.html`);
  writeFileSync(out, frag, 'utf8');
  console.log(`\n[--dry] nada subido. Fragmento en ${out}`);
} else {
  const { error } = await sb.storage.from(BUCKET_HTML).upload(destHtml, Buffer.from(frag, 'utf8'), {
    contentType: 'text/html',
    cacheControl: '300',   // de la caché se encarga el ETag de la route
    upsert: Boolean(force),
  });
  if (error) {
    console.error(`✗ No se pudo subir el HTML: ${error.message}`);
    if (!force) console.error('  Si lo estás actualizando, repite con --force.');
    process.exit(1);
  }
  console.log(`\n✓ ${BUCKET_HTML}/${destHtml}`);
  console.log(`✓ ${BUCKET_IMG}/${PREFIX}/  (${subidas} assets)`);
}

console.log(`
Falta el código:

 1. src/app/api/resumen-html/[claseId]/route.ts
      ALLOWED     → añadir '${id}'
      FILE_ALIAS  → '${id}': '${curso}/${id}'

 2. src/lib/data/${curso}.ts — en la actividad:
      resumen: {
        tipo: 'pdf',
        formato: 'html',
        opciones: [{ id: '${id}', label: 'Resumen', formato: 'html' }],
      },

 3. La página del curso debe pasar resumenFormato y resumenTitulo.
`);
