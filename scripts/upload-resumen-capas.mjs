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

/* El conversor tiene DOS variantes. Comparten la idea (página de tamaño fijo,
   capas absolutas, texto real) pero no el vocabulario, así que hay que
   distinguirlas antes de tocar nada:

     A · «layers»   .page + .image-layer/.text-layer/.ink-layer, todo en px,
                    figuras en <figure data-image>, tinta raster (AVIF) con el
                    resaltador quemado dentro como píxeles opacos.
     B · «pdf-page» .pdf-page + .vector-bg/.pdf-image/.pdf-text/.vector-ink,
                    todo en **pt**, figuras en <img> directo, tinta en **SVG**
                    y el resaltador en un SVG aparte (marks-bg).

   B es mejor documento: la tinta es vectorial (nítida a cualquier zoom) y el
   resaltador, al venir separado, se puede volver translúcido sin tocar la
   tinta. Lo hace el CSS del visor, no este script: el asset se sube tal cual. */
const VARIANTE = /class="image-layer"/.test(html) && /class="text-layer"/.test(html) ? 'layers'
               : /class="pdf-page"/.test(html)   && /class="pdf-text"/.test(html)   ? 'pdf-page'
               : null;
if (!VARIANTE) {
  console.error('✗ No es un PDF reconstruido en capas (ni .image-layer/.text-layer ni .pdf-page/.pdf-text).');
  console.error('  Si es un export de Notion, usa upload-resumen-html.mjs.');
  process.exit(1);
}

/* La página se declara en px en la variante A y en pt en la B. El wrapper del
   fragmento SIEMPRE va en px porque el visor hace `parseFloat` sobre la custom
   property y la compara con `clientWidth`, que está en px: dejar "1245.612pt"
   ahí daría una escala 4/3 veces menor sin que nada avise.
   Los hijos se quedan en pt — 1245.612pt son exactamente 1660.816px, así que
   caen en su sitio dentro de la caja sin reescribir cientos de coordenadas. */
const PT_A_PX = 4 / 3;
let PAGE_W, PAGE_H;
if (VARIANTE === 'layers') {
  const m = html.match(/--page-w:\s*([\d.]+)px;\s*--page-h:\s*([\d.]+)px/);
  if (!m) { console.error('✗ No encontré --page-w / --page-h.'); process.exit(1); }
  [, PAGE_W, PAGE_H] = m;
} else {
  const m = html.match(/\.pdf-page\s*\{[^}]*width:\s*([\d.]+)pt;\s*height:\s*([\d.]+)pt/);
  if (!m) { console.error('✗ No encontré el width/height de .pdf-page.'); process.exit(1); }
  PAGE_W = (+m[1] * PT_A_PX).toFixed(3);
  PAGE_H = (+m[2] * PT_A_PX).toFixed(3);
}
console.log(`variante: ${VARIANTE}`);
console.log(`página : ${(+PAGE_W).toFixed(0)} × ${(+PAGE_H).toFixed(0)} px`);

// ─── 2. correcciones del auditor ─────────────────────────────────────────
// Se aplican SIEMPRE, aunque el HTML ya venga arreglado: son idempotentes y
// evitan depender de que alguien recuerde correr el auditor antes.
// .svg incluido: en la variante «pdf-page» la tinta y el resaltador son SVG,
// y dejarlos fuera subiría el documento sin sus anotaciones.
const RE_ASSET = /src="([^"]+\.(?:png|jpe?g|webp|avif|svg))"/gi;
const refsRaw = [...new Set([...html.matchAll(RE_ASSET)].map(m => m[1]))];
const renombres = new Map();
for (const ref of refsRaw) {
  if (existsSync(join(dir, ref))) continue;
  const base = ref.replace(/\.(png|jpe?g|webp|avif|svg)$/i, '');
  const alt = ['avif', 'webp', 'png', 'jpg', 'jpeg', 'svg'].map(e => `${base}.${e}`).find(c => existsSync(join(dir, c)));
  if (!alt) { console.error(`✗ falta el archivo ${ref} y no hay variante en disco.`); process.exit(1); }
  renombres.set(ref, alt);
}
for (const [de, a] of renombres) html = html.split(`src="${de}"`).join(`src="${a}"`);
if (renombres.size) console.log(`✓ ${renombres.size} referencias reapuntadas a la extensión real`);

// aspecto: se corrige por el ancho — cambiar el alto empujaría la figura
// contra el texto de abajo, que está en coordenada fija.
//
// Las dos variantes anotan la caja distinto, así que primero se normaliza a
// una lista { ref, w, h, u (unidad), literal } y a partir de ahí el criterio
// es el mismo.
const cajas = [];
if (VARIANTE === 'layers') {
  const srcDe = new Map([...html.matchAll(/data-image="([^"]+)"[\s\S]{0,400}?src="([^"]+)"/g)].map(m => [m[1], m[2]]));
  for (const c of html.matchAll(/data-image="([^"]+)"[^>]*style="left:([\d.]+)px;top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px"/g)) {
    const ref = srcDe.get(c[1]);
    if (ref) cajas.push({ id: c[1], ref, w: +c[4], h: +c[5], u: 'px' });
  }
} else {
  // en pt y con la <img> llevando su propia caja: no hay data-image al que
  // referirse, así que el id para el log es el propio archivo.
  for (const c of html.matchAll(/<img class="pdf-image" src="([^"]+)"[^>]*style="left:[\d.]+pt;top:[\d.]+pt;width:([\d.]+)pt;height:([\d.]+)pt;?"/g)) {
    cajas.push({ id: c[1].split('/').pop(), ref: c[1], w: +c[2], h: +c[3], u: 'pt' });
  }
}

let corregidas = 0;
for (const c of cajas) {
  const ref = renombres.get(c.ref) ?? c.ref;
  if (!existsSync(join(dir, ref))) continue;
  const meta = await sharp(join(dir, ref)).metadata();
  const desvio = ((meta.width / meta.height) / (c.w / c.h) - 1) * 100;
  if (Math.abs(desvio) <= DESVIO_MAX) continue;
  const wOk = Math.round(c.h * (meta.width / meta.height));
  html = html.replace(`width:${c.w.toFixed(2)}${c.u};height:${c.h.toFixed(2)}${c.u}`,
                      `width:${wOk.toFixed(2)}${c.u};height:${c.h.toFixed(2)}${c.u}`);
  html = html.replace(`width:${c.w.toFixed(3)}${c.u};height:${c.h.toFixed(3)}${c.u}`,
                      `width:${wOk.toFixed(3)}${c.u};height:${c.h.toFixed(3)}${c.u}`);
  console.log(`✓ figura ${c.id}: ancho ${c.w} → ${wOk}${c.u}  (deformaba ${desvio.toFixed(1)}%)`);
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
const assets = [...new Set([...html.matchAll(RE_ASSET)].map(m => m[1]))];
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
  const mime = ext === 'avif' ? 'image/avif' : ext === 'png' ? 'image/png'
             : ext === 'webp' ? 'image/webp' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
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
const [TAG, ABRE] = VARIANTE === 'layers'
  ? ['article', '<article class="page"']
  : ['section', '<section class="pdf-page"'];
const ini = html.indexOf(ABRE);
const fin = html.indexOf(`</${TAG}>`, ini);
if (ini === -1 || fin === -1) { console.error(`✗ No encontré ${ABRE}>.`); process.exit(1); }
let page = html.slice(ini, fin + `</${TAG}>`.length);

// El visor localiza la página por la clase `.page` para escalarla; la variante
// «pdf-page» no la trae, así que se le añade sin quitarle la suya (de la que
// cuelgan los estilos propios de esa variante en el CSS module).
if (VARIANTE === 'pdf-page') page = page.replace('class="pdf-page"', 'class="page pdf-page"');

// rutas locales → CDN público
let body = page.replace(RE_ASSET, (_, p) => `src="${BASE_PUB}/${PREFIX}/${p.split('/').pop()}"`);

// Carga diferida de las figuras. Dos exclusiones:
//  - las capas a página completa (tinta y resaltador): cubren el documento
//    entero y hacen falta desde el primer scroll, así que diferirlas sólo
//    retrasaría lo inevitable;
//  - las que ya traen `loading`: el export suele ponerlo, y añadirlo otra vez
//    deja el atributo duplicado (el navegador se queda con el primero, pero
//    es markup sucio que además engaña al contar figuras diferidas).
body = body.replace(/<img (?!class="(?:ink|vector-ink|vector-bg)")(?![^>]*\bloading=)/g,
                    '<img loading="lazy" decoding="async" ');

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
