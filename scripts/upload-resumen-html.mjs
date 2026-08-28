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
  // Sin imágenes es válido si es un apunte sólo de texto (Notion no las
  // exige); lo que se descarta es que no sea un export de Notion en
  // absoluto. La firma es la clase `page-title` del <h1> de portada.
  if (!/class="page-title"/.test(html)) {
    console.error('✗ El HTML no referencia ninguna imagen externa y no parece un export de Notion (sin "page-title"). Abortado.');
    process.exit(1);
  }
  console.log('figuras: 0 (documento sólo texto)\n');
}
const refs = [...new Set(imgTags.map(m => decodeURIComponent(m[1])))];
if (imgTags.length > 0) console.log(`figuras: ${imgTags.length} (${refs.length} únicas)\n`);

// ─── 3. Supabase ─────────────────────────────────────────────────────────
const URL = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}
const sb = createClient(URL, KEY, { auth: { persistSession: false } });
const BASE_PUB_ROOT = `${URL}/storage/v1/object/public/${BUCKET_IMG}`;

// ─── 4. convertir y subir las imágenes ───────────────────────────────────
// El HTML de Notion referencia siempre .png/.jpg/.webp, pero en el disco
// puede haber tanto ese original como una versión ya convertida a mano
// (p. ej. con imgto.xyz) guardada con el mismo nombre base y extensión
// .avif. Se prefiere el .avif si existe: es la compresión que el usuario ya
// eligió, y volver a pasarla por sharp sería una segunda pérdida de calidad
// sobre un formato que ya es lossy (igual que resavear un JPEG).
//
// Cuando la MISMA imagen aparece varias veces en la página de Notion, el
// export le da a cada instancia adicional un nombre de archivo distinto
// (mismo UUID base + sufijo " 1", " 2"…), aunque el contenido sea idéntico.
// Si BUST convirtió y guardó una sola copia (p. ej. sólo la " 1"), el resto
// de referencias del grupo no tienen archivo propio en disco. Se colapsan
// por UUID base: se resuelve UN solo archivo fuente por grupo y se sube UNA
// sola vez; todas las referencias del grupo apuntan al mismo destino. Sólo
// aplica a nombres con forma de UUID de Notion — "image 1", "image 2"… son
// nombres genéricos y SÍ son imágenes distintas, no se tocan.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const canonicalBase = (base) => {
  const m = base.match(/^(.+) (\d+)$/);
  return (m && UUID_RE.test(m[1])) ? m[1] : base;
};

const grupos = new Map(); // canonBase → refs[]
for (const ref of refs) {
  const base = ref.replace(/\.(png|jpe?g|webp|avif)$/i, '');
  const canon = canonicalBase(base);
  if (!grupos.has(canon)) grupos.set(canon, []);
  grupos.get(canon).push(ref);
}

let origBytes = 0, avifBytes = 0, subidas = 0, yaAvif = 0, colapsadas = 0;
const fallos = [];
const destDe = new Map(); // ref (decodificado) → dest en el bucket
const anchoDe = new Map(); // dest → ancho intrínseco en px

for (const [canon, miembros] of grupos) {
  const dest = `${PREFIX}/${nombreEnStorage(canon)}.avif`;
  for (const ref of miembros) destDe.set(ref, dest);
  if (miembros.length > 1) colapsadas += miembros.length - 1;

  // Busca el primer miembro del grupo cuyo archivo exista en disco (falta
  // el "canónico" cuando sólo se guardó una de las copias repetidas).
  let src = null, yaEsAvif = false;
  for (const ref of miembros) {
    const base = ref.replace(/\.(png|jpe?g|webp|avif)$/i, '');
    const srcAvif = join(dir, `${base}.avif`);
    const srcOriginal = join(dir, ref);
    if (existsSync(srcAvif)) { src = srcAvif; yaEsAvif = true; break; }
    if (existsSync(srcOriginal)) { src = srcOriginal; yaEsAvif = false; break; }
  }

  if (!src) { fallos.push(`falta el archivo ${miembros[0]}`); continue; }

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
  // El ancho real del archivo: hace falta cuando el documento no trae el
  // `width:NNNpx` inline de Notion (ver 5e).
  try { anchoDe.set(dest, (await sharp(buf).metadata()).width); } catch { /* no crítico */ }

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
  process.stdout.write(`\r  imágenes: ${subidas}/${grupos.size}`);
}

const nota = yaAvif ? `  (${yaAvif} ya eran .avif, sin recomprimir)` : '';
const notaColapso = colapsadas
  ? `  (${colapsadas} repetida${colapsadas > 1 ? 's' : ''} en la página, subida${colapsadas > 1 ? 's' : ''} una sola vez)`
  : '';
if (grupos.size) {
  console.log(`\r  imágenes: ${subidas}/${grupos.size}   ${mb(origBytes)} → ${mb(avifBytes)}  (-${(100 - avifBytes / origBytes * 100).toFixed(1)}%)${nota}${notaColapso}`);
}
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} fallos:`);
  fallos.slice(0, 10).forEach(f => console.error('   ' + f));
  if (!force) console.error('\n  Si el resumen ya existía y lo estás actualizando, repite con --force.');
  process.exit(1);
}

// ─── 5. transformar el HTML ──────────────────────────────────────────────
// Usa el destino ya resuelto por grupo (destDe): así las referencias
// repetidas de una misma imagen (sufijo " N" de Notion) apuntan todas a la
// URL del único archivo subido, en vez de recalcular un destino por cada
// nombre distinto.
const urlDe = (raw) => {
  const decoded = decodeURIComponent(raw);
  const dest = destDe.get(decoded)
    ?? `${PREFIX}/${nombreEnStorage(decoded.replace(/\.(png|jpe?g|webp|avif)$/i, ''))}.avif`;
  return `${BASE_PUB_ROOT}/${dest}`;
};

// 5a. sólo el cuerpo: fuera <head>, el CSS de Notion (claro-only y con su
//     tipografía) y el emoji/favicon de la página. El estilo lo pone MedGO.
const ini = html.indexOf('<div class="page-body">');
const fin = html.lastIndexOf('</div></article>');
let body;
if (ini !== -1 && fin !== -1) {
  body = html.slice(ini + '<div class="page-body">'.length, fin);
} else {
  // Un documento redactado con el vocabulario de Notion pero armado a mano
  // (los «INTEGRADO») no trae el envoltorio `page-body`: el contenido cuelga
  // directo del <article> de la página. Se toma ése, y se descartan aparte el
  // <header> y el <h1 class="page-title">, que en un export normal quedan
  // FUERA del page-body — el título ya lo pone la cabecera del visor, y
  // dejarlo dentro lo duplicaría.
  const art = html.match(/<article[^>]*>/);
  const finArt = html.lastIndexOf('</article>');
  if (!art || finArt === -1) {
    console.error('✗ No encontré <div class="page-body"> … </div></article> ni un <article>. ¿Es un export de Notion?');
    process.exit(1);
  }
  body = html.slice(art.index + art[0].length, finArt)
    .replace(/<header[\s\S]*?<\/header>/i, '')
    .replace(/^\s*<h1 class="page-title">[\s\S]*?<\/h1>/i, '');
}

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

// 5e-bis. Un documento redactado a mano con el vocabulario de Notion no trae
//     ese `width` inline, así que sus figuras se quedarían sin --w y el CSS
//     caería al fallback 100%: una captura pequeña estirada hasta el ancho del
//     texto, borrosa. Se les pone el ancho REAL del archivo (el `max-width:
//     100%` del visor sigue encogiendo las grandes), que es justo lo que hace
//     Notion cuando no se le fija un ancho a mano.
const anchoPorUrl = new Map(
  [...anchoDe].map(([dest, w]) => [`${BASE_PUB_ROOT}/${dest}`, w]),
);
body = body.replace(/<img((?:(?!\sstyle=)[^>])*?)src="([^"]+)"((?:(?!\sstyle=)[^>])*?)(\/?)>/g,
  (todo, pre, src, post, cierre) => {
    const w = anchoPorUrl.get(src);
    // El `/` de cierre se recoloca al final: dejarlo donde estaba pondría el
    // style después de la barra y el atributo se perdería.
    return w ? `<img${pre}src="${src}"${post} style="--w:${w}px"${cierre}>` : todo;
  });

// 5e-ter. Y sus <figure> vienen sin clase: `figure.image` es el selector por
//     el que el visor les da margen, borde, hover y clic para ampliar. Sólo
//     las que envuelven una imagen — un <figure> con una tabla no lo es.
body = body.replace(/<figure>(\s*<img[^>]*>)/g, '<figure class="image">$1');

// 5e-quater. Una tabla que hospeda un `.matiz` (la aclaración que sale al pasar
//     el cursor) renuncia a su scroll horizontal: el `overflow` del visor
//     recortaría el aviso contra el borde de la tabla. Se marca aquí, sobre el
//     documento, en vez de quitarle el scroll a TODAS las tablas — que es lo
//     que impide que una tabla ancha desborde el resumen.
body = body.replace(/<table([^>]*)>([\s\S]*?)<\/table>/g, (todo, attrs, dentro) => {
  if (!dentro.includes('class="matiz"')) return todo;
  return /class="/.test(attrs)
    ? `<table${attrs.replace(/class="/, 'class="matiz-host ')}>${dentro}</table>`
    : `<table${attrs} class="matiz-host">${dentro}</table>`;
});

// 5f. fuera lo que no aporta al render (los id son UUID de bloque de Notion,
//     puro peso). EXCEPCIÓN: los que son destino de un `href="#…"` del propio
//     documento — un apunte con índice al principio se quedaría con 18 enlaces
//     que no llevan a ninguna parte.
const anclas = new Set(
  [...body.matchAll(/href="#([^"]+)"/g)].map(m => decodeURIComponent(m[1])),
);
body = body
  .replace(/\sid="([^"]*)"/g, (todo, valor) => (anclas.has(valor) ? todo : ''))
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
