/**
 * Publica un resumen en HTML a partir de un export de Notion.
 *
 *   node scripts/upload-resumen-html.mjs \
 *     --dir "C:/Users/BUST/Downloads/anatomia de la boca y faringe" \
 *     --curso digestivo --id dig-clase-2 --slug anatomia-boca-faringe
 *
 * Hace tres cosas, en este orden:
 *   1. convierte a AVIF cada PNG que el HTML referencia y lo sube al bucket
 *      PÚBLICO `resumenes-img` (ahí está el peso: ~95 % menos que en PNG).
 *      Si junto al PNG ya existe un .avif con el mismo nombre (convertido a
 *      mano, p. ej. con imgto.xyz), se sube ESE tal cual — sin recomprimir.
 *   2. reescribe el HTML a un fragmento de cuerpo apuntando a esas URLs;
 *   3. sube el fragmento al bucket PRIVADO `resumenes`, junto a los PDFs.
 *
 * Lo que NO hace (queda para el agente, son cambios de código):
 *   - registrar el id en ALLOWED/FILE_ALIAS de
 *     `src/app/api/resumen-html/[claseId]/route.ts`
 *   - marcar la actividad en `src/lib/data/<curso>.ts`
 *
 * Flags: --dry (no sube nada, sólo informa) · --force (re-sube y pisa).
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { config } from './load-env.mjs';

const BUCKET_IMG  = 'resumenes-img';   // público
const BUCKET_HTML = 'resumenes';       // privado
const AVIF_QUALITY = 62;

// ─── argumentos ──────────────────────────────────────────────────────────
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
  console.error('Faltan flags. Uso:\n  node scripts/upload-resumen-html.mjs --dir <carpeta> --curso <slug-curso> --id <id-resumen> --slug <slug-doc> [--dry] [--force]');
  process.exit(1);
}
if (!existsSync(dir)) {
  console.error(`No existe la carpeta: ${dir}`);
  process.exit(1);
}

const PREFIX  = `${curso}/${slug}`;
const kb      = (n) => `${(n / 1024).toFixed(0)} KB`;
const mb      = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
const nombreEnStorage = (base) => base.replace(/\s+/g, '-');

// ─── 1. localizar el HTML ────────────────────────────────────────────────
const htmls = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html'));
if (htmls.length !== 1) {
  console.error(`Esperaba exactamente 1 .html en la carpeta, encontré ${htmls.length}: ${htmls.join(', ')}`);
  process.exit(1);
}
const htmlPath = join(dir, htmls[0]);
let html = readFileSync(htmlPath, 'utf8');
const bytesOriginal = Buffer.byteLength(html, 'utf8');

console.log(`\nHTML   : ${htmls[0]}  (${kb(bytesOriginal)})`);

// ─── 2. rechazar exports rasterizados ────────────────────────────────────
// pdf2htmlEX convierte el PDF en UNA imagen gigante con una capa de texto
// invisible encima: no tiene texto real, no reflowea y se ve peor que el PDF.
// Publicar eso sería un retroceso, así que se corta aquí.
if (/pdf2htmlEX/i.test(html)) {
  console.error(`
✗ Esto es un export de pdf2htmlEX, no sirve.
  El documento entero es una sola imagen rasterizada con el texto "pintado"
  encima: no es seleccionable, no reflowea y pierde nitidez al ampliar.
  Hace falta el documento ORIGINAL (la página de Notion), no el PDF convertido.`);
  process.exit(1);
}

const imgTags = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)];
if (imgTags.length === 0) {
  console.error('✗ El HTML no referencia ninguna imagen externa. ¿Seguro que es un export de Notion?');
  process.exit(1);
}
const refs = [...new Set(imgTags.map(m => decodeURIComponent(m[1])))];
console.log(`figuras: ${imgTags.length} (${refs.length} únicas)\n`);

// ─── 3. Supabase ─────────────────────────────────────────────────────────
const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BASE_PUB = `${URL}/storage/v1/object/public/${BUCKET_IMG}/${PREFIX}`;

// ─── 4. convertir y subir las imágenes ───────────────────────────────────
// El HTML de Notion referencia siempre .png/.jpg/.webp, pero en el disco
// puede haber tanto ese original como una versión ya convertida a mano
// (p. ej. con imgto.xyz) guardada con el mismo nombre base y extensión
// .avif. Se prefiere el .avif si existe: es la compresión que el usuario ya
// eligió, y volver a pasarla por sharp sería una segunda pérdida de calidad
// sobre un formato que ya es lossy (igual que resavear un JPEG).
let origBytes = 0, avifBytes = 0, subidas = 0, yaAvif = 0;
const fallos = [];

for (const ref of refs) {
  const base = ref.replace(/\.(png|jpe?g|webp|avif)$/i, '');
  const dest = `${PREFIX}/${nombreEnStorage(base)}.avif`;

  const srcOriginal = join(dir, ref);
  const srcAvif = join(dir, `${base}.avif`);
  const yaEsAvif = existsSync(srcAvif);
  const src = yaEsAvif ? srcAvif : srcOriginal;

  if (!existsSync(src)) { fallos.push(`falta el archivo ${ref}`); continue; }

  origBytes += statSync(src).size;

  let buf;
  if (yaEsAvif) {
    // Ya convertida por fuera (imgto.xyz u otra herramienta): se sube tal
    // cual, sin pasar por sharp.
    buf = readFileSync(src);
    yaAvif++;
  } else {
    // Sin resize: el ancho de cada figura ya lo fijó Notion y el visor lo
    // escala con CSS. Redimensionar aquí desalinearía el documento.
    buf = await sharp(src).avif({ quality: AVIF_QUALITY }).toBuffer();
  }
  avifBytes += buf.length;

  if (dry) { subidas++; continue; }

  // cacheControl vía supabase-js (no como header suelto: por REST crudo el
  // header se ignora y el objeto queda en `no-cache`). Immutable porque una
  // figura nunca se reedita — si cambia, cambia el nombre.
  const { error } = await sb.storage.from(BUCKET_IMG).upload(dest, buf, {
    contentType: 'image/avif',
    cacheControl: '31536000, immutable',
    upsert: Boolean(force),
  });
  if (error) fallos.push(`${dest}: ${error.message}`);
  else subidas++;
  process.stdout.write(`\r  imágenes: ${subidas}/${refs.length}`);
}

const nota = yaAvif ? `  (${yaAvif} ya eran .avif, sin recomprimir)` : '';
console.log(`\r  imágenes: ${subidas}/${refs.length}   ${mb(origBytes)} → ${mb(avifBytes)}  (-${(100 - avifBytes / origBytes * 100).toFixed(1)}%)${nota}`);
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallos:`);
  fallos.slice(0, 10).forEach(f => console.error('   ' + f));
  if (!force) console.error('\n  Si el resumen ya existía y lo estás actualizando, repite con --force.');
  process.exit(1);
}

// ─── 5. transformar el HTML ──────────────────────────────────────────────
const urlDe = (raw) =>
  `${BASE_PUB}/${nombreEnStorage(decodeURIComponent(raw).replace(/\.(png|jpe?g|webp|avif)$/i, ''))}.avif`;

// 5a. sólo el cuerpo: fuera <head>, el CSS de Notion (claro-only y con su
//     tipografía) y el emoji/favicon de la página. El estilo lo pone MedGO.
const ini = html.indexOf('<div class="page-body">');
const fin = html.lastIndexOf('</div></article>');
if (ini === -1 || fin === -1) {
  console.error('✗ No encontré <div class="page-body"> … </div></article>. ¿Es un export de Notion?');
  process.exit(1);
}
let body = html.slice(ini + '<div class="page-body">'.length, fin);

// 5b. imágenes → CDN público (href del enlace y src de la figura)
body = body.replace(/href="([^"]+\.(?:png|jpe?g|webp))"/gi, (_, p) => `href="${urlDe(p)}"`);
body = body.replace(/src="([^"]+\.(?:png|jpe?g|webp))"/gi, (_, p) => `src="${urlDe(p)}"`);

// 5c. el enlace queda de fallback: el visor intercepta el clic y abre el
//     lightbox, pero ctrl+clic sigue abriendo en pestaña nueva
body = body.replace(/<a href="(https:\/\/[^"]+\.avif)"/g,
  '<a target="_blank" rel="noopener noreferrer" href="$1"');

// 5d. carga diferida: decenas de figuras no pueden pedirse todas de golpe
body = body.replace(/<img /g, '<img loading="lazy" decoding="async" ');

// 5e. el ancho de Notion pasa de `width:NNNpx` a la variable --w, para que el
//     control de tamaño del visor escale figura y texto a la vez. Con width
//     fijo el zoom movía sólo la letra y en un documento de figuras parecía
//     que no hacía nada.
body = body.replace(/(<img[^>]*?)style="width:([\d.]+)px"/g, '$1style="--w:$2px"');

// 5f. fuera lo que no aporta al render (los id son UUID de bloque de Notion y
//     no hay anclas internas que los usen)
body = body
  .replace(/\sid="[^"]*"/g, '')
  .replace(/\sdata-notion-[a-z-]+="[^"]*"/g, '')
  .replace(/\sdir="(auto|ltr)"/g, '')
  .replace(/\sclass=""/g, '');

const bytesFragmento = Buffer.byteLength(body, 'utf8');
const pngSueltos = (body.match(/\.(png|jpe?g|webp)"/gi) || []).length;
if (pngSueltos) {
  console.error(`✗ Quedaron ${pngSueltos} referencias sin convertir. Abortado.`);
  process.exit(1);
}

console.log(`\nfragmento: ${kb(bytesOriginal)} → ${kb(bytesFragmento)}  ·  ${(body.match(/style="--w:/g) || []).length} figuras escalables`);

// ─── 6. subir el fragmento ───────────────────────────────────────────────
const destHtml = `${curso}/${id}.html`;

if (dry) {
  // Junto al export, no en el repo: es un artefacto de revisión, no código.
  const out = join(dir, `${id}.preview.html`);
  writeFileSync(out, body, 'utf8');
  console.log(`\n[--dry] nada subido. Fragmento guardado en ${out}`);
} else {
  // Sin cache larga: un resumen se reedita y el path no cambia. De la caché
  // se encarga el ETag de /api/resumen-html.
  const { error } = await sb.storage.from(BUCKET_HTML).upload(destHtml, Buffer.from(body, 'utf8'), {
    contentType: 'text/html',
    cacheControl: '300',
    upsert: Boolean(force),
  });
  if (error) {
    console.error(`✗ No se pudo subir el HTML: ${error.message}`);
    if (!force) console.error('  Si lo estás actualizando, repite con --force.');
    process.exit(1);
  }
  console.log(`\n✓ ${BUCKET_HTML}/${destHtml}`);
  console.log(`✓ ${BUCKET_IMG}/${PREFIX}/  (${subidas} figuras)`);
}

// ─── 7. qué falta ────────────────────────────────────────────────────────
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

 3. Comprobar que src/app/dashboard/cursos/${curso}/[id]/page.tsx pasa
    resumenFormato={act.resumen?.formato} y resumenTitulo={act.titulo}
    a <StudyMaterialSection>.
`);
