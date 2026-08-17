/**
 * Audita (y opcionalmente repara) un HTML "PDF reconstruido en capas":
 * un export que reconstruye un PDF como tres capas absolutas sobre una
 * página de tamaño fijo — figuras (z1), texto real (z2) y tinta (z3).
 *
 *   node scripts/audit-resumen-capas.mjs --dir "C:/.../Te8_Comunicacion_HTML_optimizado"
 *   node scripts/audit-resumen-capas.mjs --dir "..." --fix
 *
 * NO sube nada y NO toca el original. Con --fix escribe un `preview.html`
 * corregido junto al export, para revisarlo en el navegador antes de nada.
 *
 * Qué comprueba, y por qué cada cosa (todas se cazaron en un documento real):
 *
 *   1. EXTENSIONES  — convertir las figuras a AVIF por fuera no reescribe el
 *      HTML, que sigue pidiendo .webp/.png. Se cae el documento entero.
 *   2. ASPECTO      — las cajas llevan width/height fijos y las <img> van con
 *      object-fit:fill: si el AVIF no tiene el mismo aspecto que su caja, la
 *      figura sale estirada sin que nada lo avise.
 *   3. TINTA OPACA  — el resaltador se extrae como píxeles OPACOS en una capa
 *      con z-index mayor que el texto: tapa las letras. Es el fallo que más
 *      cuesta ver, porque parece "texto que no se extrajo".
 *   4. HUECOS       — franjas sin texto, sin figura y sin tinta: ahí sí puede
 *      haberse perdido contenido en la conversión.
 *   5. PORTABILIDAD — <script> y CSS global, que no sobreviven al inyectarse
 *      con dangerouslySetInnerHTML en el visor de MedGO.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const ALPHA_VISIBLE = 8;    // por debajo de esto la tinta no pinta nada
const ALPHA_OPACO   = 250;  // a partir de aquí tapa por completo lo que hay debajo
const DESVIO_MAX    = 2;    // % de desvío de aspecto que se tolera sin avisar
const HUECO_MIN     = 40;   // px de franja vacía que merecen sospecha

const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const key = a.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args[key] = true;
  else { args[key] = next; i++; }
}

const { dir, fix } = args;
if (!dir) {
  console.error('Falta --dir. Uso:\n  node scripts/audit-resumen-capas.mjs --dir <carpeta> [--fix]');
  process.exit(1);
}
if (!existsSync(dir)) { console.error(`No existe la carpeta: ${dir}`); process.exit(1); }

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const problemas = [];
const avisos = [];

// ─── localizar el HTML ───────────────────────────────────────────────────
const htmls = readdirSync(dir).filter(f => f.toLowerCase().endsWith('.html') && !/preview/i.test(f));
if (htmls.length !== 1) {
  console.error(`Esperaba 1 .html (sin contar preview), encontré ${htmls.length}: ${htmls.join(', ')}`);
  process.exit(1);
}
const htmlPath = join(dir, htmls[0]);
let html = readFileSync(htmlPath, 'utf8');

// ─── confirmar que es este formato y no otro ─────────────────────────────
// Un export de Notion va por /addresumenhtml; un pdf2htmlEX no sirve para
// nada. Esta skill es sólo para el de tres capas.
if (/pdf2htmlEX/i.test(html)) {
  console.error('\n✗ Es un export de pdf2htmlEX: el documento es una imagen rasterizada con texto invisible encima. No sirve.');
  process.exit(1);
}
/* El conversor tiene dos variantes con el mismo concepto y distinto
   vocabulario (ver la cabecera de upload-resumen-capas.mjs):

     A · «layers»   .page + .image-layer/.text-layer/.ink-layer · px ·
                    figuras en <figure data-image> · tinta raster con el
                    resaltador quemado dentro como píxeles opacos.
     B · «pdf-page» .pdf-page + .vector-bg/.pdf-image/.pdf-text/.vector-ink ·
                    **pt** · figuras en <img> · tinta y resaltador en SVG.

   Los cinco chequeos son los mismos; lo que cambia es de dónde se leen las
   medidas y dónde vive el resaltador.

   ⚠️ La familia se reconoce por la PÁGINA, igual que en el uploader — y el
   nombre de la página tampoco es fijo (`page`, `pdf-page`, `pdf-stage`). Este
   detector pedía además un vocabulario de texto concreto y rechazaba con «esto
   no es un PDF reconstruido en capas» documentos que el uploader sí publica,
   que es el mensaje que empuja a la skill equivocada. Si la página está pero
   el vocabulario no es ninguno de los catalogados, se audita igual: lo que no
   se pueda medir se dice, no se calla ni se inventa.

   `\b` NO sirve para buscar clases: el guion es un no-word char y `\bpage\b`
   casaría dentro de `class="page-wrapper"`. */
const claseSuelta = (c) => new RegExp(`class="[^"]*(?<![\\w-])${c}(?![\\w-])`);
const tieneClase = (c) => claseSuelta(c).test(html);

const CLASE_PAGINA = ['pdf-page', 'pdf-stage', 'page'].find(tieneClase);
const VARIANTE = CLASE_PAGINA === 'page' && tieneClase('image-layer') && tieneClase('text-layer') ? 'layers'
               : CLASE_PAGINA === 'pdf-page' && tieneClase('pdf-text') ? 'pdf-page'
               : CLASE_PAGINA ? 'estilo-propio'
               : null;
if (!VARIANTE) {
  console.error('\n✗ No encontré página de tamaño fijo (.page / .pdf-page / .pdf-stage): esto no es un PDF reconstruido en capas.');
  console.error('  Si es un export de Notion, la skill correcta es /addresumenhtml.');
  console.error('  Si no tiene página fija, es un documento de flujo: /addresumencapas lo explica.');
  process.exit(1);
}
if (VARIANTE === 'estilo-propio') {
  console.log(`\nⓘ Página «.${CLASE_PAGINA}» con vocabulario no catalogado: se audita lo que es común`);
  console.log('  (referencias, portabilidad y peso). El uploader lo publicará con su propio <style>.');
}

// Unidad en la que el documento anota TODAS sus coordenadas. Las cifras se
// comparan siempre entre sí (caja contra imagen, texto contra hueco), así que
// basta con leerlas en su propia unidad; sólo el aviso de ancho fijo, que se
// mide contra una pantalla real, necesita la conversión a px.
/* Las medidas viven en uno de dos sitios y en una de dos unidades, y NADA lo
   anuncia: unos exports las ponen literales en `.pdf-page` y otros dejan ahí
   `var(--page-w)` con el número en `:root` (que además puede cerrar con `}` en
   vez de `;`). Asumir un solo sitio dejaba el auditor diciendo «sin altura de
   página, no se puede comprobar» y saltándose la búsqueda de contenido
   perdido — un silencio que parece un documento raro y es un regex corto. */
const num = String.raw`[\d.]+`;

const mLit  = html.match(/\.pdf-page\s*\{[^}]*width:\s*([\d.]+)(pt|px);\s*height:\s*([\d.]+)(pt|px)/);
const mRaiz = html.match(/--page-w:\s*([\d.]+)(pt|px)?\s*;\s*--page-h:\s*([\d.]+)(pt|px)?\s*[;}]/);
const mPage = VARIANTE === 'layers' ? (mRaiz ?? mLit) : (mLit ?? mRaiz);
const U = mPage ? (mPage[2] ?? mPage[4] ?? 'px') : 'px';
const A_PX = U === 'pt' ? 4 / 3 : 1;
const PAGE_W = mPage ? +mPage[1] : null;
const PAGE_H = mPage ? +mPage[3] : null;

console.log(`\n═══ ${htmls[0]}  ·  ${kb(Buffer.byteLength(html, 'utf8'))}  ·  variante «${VARIANTE}» ═══`);
if (PAGE_W) console.log(`página: ${PAGE_W.toFixed(0)} × ${PAGE_H.toFixed(0)} ${U}`
  + (U === 'pt' ? `  (${(PAGE_W * A_PX).toFixed(0)} × ${(PAGE_H * A_PX).toFixed(0)} px)` : ''));

// ─── 1. extensiones referenciadas vs archivos en disco ───────────────────
// .svg incluido: en la variante «pdf-page» la tinta y el resaltador son SVG.
const RE_ASSET = /src="([^"]+\.(?:png|jpe?g|webp|avif|svg))"/gi;
const refs = [...html.matchAll(RE_ASSET)].map(m => m[1]);
const renombres = new Map(); // ref original → ref corregida
let faltantes = 0;

for (const ref of [...new Set(refs)]) {
  if (existsSync(join(dir, ref))) continue;
  // busca el mismo nombre base con otra extensión
  const base = ref.replace(/\.(png|jpe?g|webp|avif|svg)$/i, '');
  const alt = ['avif', 'webp', 'png', 'jpg', 'jpeg', 'svg']
    .map(e => `${base}.${e}`)
    .find(c => existsSync(join(dir, c)));
  if (alt) renombres.set(ref, alt);
  else { faltantes++; problemas.push(`falta el archivo ${ref} y no hay ninguna variante en disco`); }
}

console.log(`\n① Referencias  ${refs.length} figuras`);
if (renombres.size) {
  const de = [...new Set([...renombres.keys()].map(r => r.split('.').pop()))].join('/');
  const a  = [...new Set([...renombres.values()].map(r => r.split('.').pop()))].join('/');
  problemas.push(`${renombres.size} referencias apuntan a .${de} pero en disco son .${a} — el documento cargaría SIN imágenes`);
  console.log(`   ✗ ${renombres.size} rotas: .${de} → .${a}`);
} else if (!faltantes) {
  console.log('   ✓ todas resuelven');
}

// ─── 2. aspecto de cada figura contra su caja CSS ────────────────────────
// La caja lleva width/height del PDF; la imagen exportada puede traer otro
// encuadre. Con object-fit:fill eso deforma en silencio.
const cajas = [];
if (VARIANTE === 'layers') {
  const srcDe = new Map(
    [...html.matchAll(/data-image="([^"]+)"[\s\S]{0,400}?src="([^"]+)"/g)].map(m => [m[1], m[2]])
  );
  for (const c of html.matchAll(
    /data-image="([^"]+)"[^>]*style="left:[\d.]+px;top:[\d.]+px;width:([\d.]+)px;height:([\d.]+)px"/g
  )) {
    const ref = srcDe.get(c[1]);
    if (ref) cajas.push({ id: c[1], refOrig: ref, w: +c[2], h: +c[3] });
  }
} else {
  /* Dos formas y DOS unidades. La caja puede ir en la propia <img> o en el
     <figure> que la envuelve (y entonces el style va antes del src), y las
     coordenadas tanto en pt como en px — la unidad no se anuncia. Fijar `pt`
     hacía que no casara nada en un documento en px y el auditor informaba
     «0 cajas · ninguna se deforma», que se lee como un visto bueno cuando en
     realidad no midió nada. */
  for (const c of html.matchAll(
    /<figure class="pdf-image" style="left:[\d.]+(?:pt|px);top:[\d.]+(?:pt|px);width:([\d.]+)(?:pt|px);height:([\d.]+)(?:pt|px);?"[^>]*>\s*<img src="([^"]+)"/g
  )) {
    cajas.push({ id: c[3], refOrig: c[3], w: +c[1], h: +c[2] });
  }
  for (const c of html.matchAll(
    /<img class="pdf-image" src="([^"]+)"[^>]*style="left:[\d.]+(?:pt|px);top:[\d.]+(?:pt|px);width:([\d.]+)(?:pt|px);height:([\d.]+)(?:pt|px);?"/g
  )) {
    cajas.push({ id: c[1].split('/').pop(), refOrig: c[1], w: +c[2], h: +c[3] });
  }
}

console.log(`\n② Aspecto de las figuras  (${cajas.length} cajas)`);
const deformadas = [];
let pesoImgs = 0;

for (const c of cajas) {
  const ref = renombres.get(c.refOrig) ?? c.refOrig;
  const p = join(dir, ref);
  if (!existsSync(p)) continue;
  pesoImgs += statSync(p).size;

  const meta = await sharp(p).metadata();
  const aCaja = c.w / c.h;
  const aImg = meta.width / meta.height;
  const desvio = (aImg / aCaja - 1) * 100;
  if (Math.abs(desvio) > DESVIO_MAX) {
    // se corrige por el ancho: cambiar el alto empujaría la figura hacia
    // el texto de abajo, que está en una coordenada fija.
    const wOk = Math.round(c.h * aImg);
    deformadas.push({ id: c.id, ref, w: c.w, h: c.h, wOk, desvio, img: `${meta.width}×${meta.height}` });
  }
}

/* El peso de las imágenes se cuenta aparte de las cajas: en una variante no
   catalogada no hay cajas que medir, pero las figuras existen y su peso es el
   dato que decide si el documento es publicable. Antes salía «imágenes 0 KB»
   junto a 62 figuras que sí resolvían. */
for (const ref of new Set(refs.map(r => renombres.get(r) ?? r))) {
  const p = join(dir, ref);
  if (existsSync(p) && !cajas.some(c => (renombres.get(c.refOrig) ?? c.refOrig) === ref)) {
    pesoImgs += statSync(p).size;
  }
}

if (deformadas.length) {
  for (const d of deformadas) {
    problemas.push(`figura ${d.id} (${d.ref}) se deforma ${d.desvio.toFixed(1)}%: caja ${d.w}×${d.h}, imagen ${d.img} → ancho correcto ${d.wOk}`);
    console.log(`   ✗ ${d.id}  caja ${d.w}×${d.h}  ·  imagen ${d.img}  ·  ${d.desvio > 0 ? '+' : ''}${d.desvio.toFixed(1)}%  → ancho ${d.wOk}`);
  }
} else if (!cajas.length) {
  /* NUNCA un ✓ sin haber medido. Con 0 cajas el visto bueno se lee como «las
     figuras están bien» cuando en realidad no se comprobó ninguna — la trampa
     que ya se cobró una revisión en Te11. */
  console.log(`   — no se pudo medir ninguna caja${VARIANTE === 'estilo-propio' ? ' (vocabulario no catalogado)' : ''}: comprueba el aspecto a mano si alguna figura se ve estirada`);
} else {
  console.log('   ✓ ninguna se deforma');
}

/* Franjas verticales que ocupa el texto, como pares [inicio, fin].
   Las dos variantes escriben el `style` distinto: en «layers» el font-size va
   pegado al top, en «pdf-page» hay un font-family en medio y además existe el
   texto reconstruido sobre las figuras (.raster-text-rebuilt), que lleva un
   `width` intercalado. Un solo regex no cubre los tres casos. */
function lineasTexto() {
  // Igual que con las figuras: la unidad puede ser pt o px, y fijarla dejaba
  // el documento entero contado como «sin texto» → una franja vacía del 100 %.
  const fuentes = VARIANTE === 'layers'
    ? [/top:([\d.]+)px;font-size:([\d.]+)px/g]
    : [/top:([\d.]+)(?:pt|px);font-family:[^;]*;font-size:([\d.]+)(?:pt|px)/g,
       /top:([\d.]+)(?:pt|px);width:[\d.]+(?:pt|px);font-size:([\d.]+)(?:pt|px)/g,
       /top:([\d.]+)(?:pt|px);[^"]*?font-size:([\d.]+)(?:pt|px)/g];
  const out = [];
  for (const re of fuentes) {
    for (const m of html.matchAll(re)) out.push([+m[1], +m[1] + +m[2] * 1.2]);
  }
  return out;
}

// ─── 3. las capas de anotación ───────────────────────────────────────────
const inkRef0 = html.match(/class="ink"[^>]*src="([^"]+)"/)?.[1]
             ?? html.match(/class="vector-ink"[^>]*src="([^"]+)"/)?.[1]
             ?? html.match(/ink-layer[\s\S]{0,200}?src="([^"]+)"/)?.[1];
let inkRow = null, inkH = 0;

/* En la variante «pdf-page» el resaltador NO va quemado dentro de la tinta:
   viene en su propio SVG (.vector-bg), lo que permite auditarlo leyendo el
   archivo en vez de contando píxeles. El fallo es el mismo de siempre —el
   conversor lo saca como amarillo PURO y OPACO— pero aquí no llega a tapar
   nada, porque su capa queda por debajo del texto. Lo que sí hace un plano de
   color sólido es aplastar la letra que tiene encima, así que el visor lo
   atenúa con opacity + multiply en .vector-bg. */
if (VARIANTE === 'pdf-page') {
  const bgRef0 = html.match(/class="vector-bg"[^>]*src="([^"]+)"/)?.[1];
  console.log('\n③a Resaltador (capa aparte)');
  if (!bgRef0) {
    console.log('   — el documento no trae capa de resaltado');
  } else {
    const bgRef = renombres.get(bgRef0) ?? bgRef0;
    const p = join(dir, bgRef);
    if (!existsSync(p)) {
      problemas.push(`la capa de resaltado (${bgRef0}) no está en disco`);
      console.log(`   ✗ falta ${bgRef0}`);
    } else {
      pesoImgs += statSync(p).size;
      const svg = readFileSync(p, 'utf8');
      const marcas = [...svg.matchAll(/<rect\b[^>]*>/g)].map(m => m[0]);
      const opacas = marcas.filter(r => !/(fill|stop)-opacity=|opacity=/.test(r));
      console.log(`   ${bgRef}  ·  ${marcas.length} marcas  ·  ${kb(statSync(p).size)}`);
      if (opacas.length) {
        avisos.push(`${opacas.length} marcas de resaltado son de color OPACO: sin atenuar no parecen subrayado sino una banda que aplasta la letra (lo corrige .vector-bg en resumenHtml.module.css con opacity + mix-blend-mode:multiply)`);
        console.log(`   ⚠ ${opacas.length} marcas opacas — las atenúa el visor (.vector-bg: opacity + multiply)`);
      } else {
        console.log('   ✓ las marcas ya vienen translúcidas');
      }
    }
  }
}

console.log('\n③ Capa de tinta');
if (!inkRef0) {
  console.log('   — el documento no tiene capa de tinta');
} else {
  const inkRef = renombres.get(inkRef0) ?? inkRef0;
  const p = join(dir, inkRef);
  if (!existsSync(p)) {
    problemas.push(`la capa de tinta (${inkRef0}) no está en disco`);
    console.log(`   ✗ falta ${inkRef0}`);
  } else {
    pesoImgs += statSync(p).size;
    const { data, info } = await sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    inkH = info.height;

    // Sin alpha la capa sería un rectángulo blanco que tapa el documento.
    let nOpaco = 0, nTrans = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] >= ALPHA_OPACO) nOpaco++;
      else if (data[i] < ALPHA_VISIBLE) nTrans++;
    }
    const total = data.length / 4;
    const pctTrans = nTrans / total * 100;
    console.log(`   ${inkRef}  ${info.width}×${info.height}  ·  ${kb(statSync(p).size)}`);
    console.log(`   transparente ${pctTrans.toFixed(1)}%  ·  opaco ${(nOpaco / total * 100).toFixed(2)}%`);
    if (pctTrans < 50) {
      problemas.push('la capa de tinta perdió la transparencia (menos del 50% transparente): taparía el documento');
      console.log('   ✗ perdió el canal alpha');
    }

    // filas con tinta visible, para el mapa de huecos
    inkRow = new Uint8Array(info.height);
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] > ALPHA_VISIBLE) { inkRow[y] = 1; break; }
      }
    }

    // ¿hay tinta OPACA justo encima de líneas de texto?
    const opacoRow = new Uint8Array(info.height);
    const anchoRow = new Int32Array(info.height);
    for (let y = 0; y < info.height; y++) {
      let c = 0;
      for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] >= ALPHA_OPACO) c++;
      if (c > 3) { opacoRow[y] = 1; anchoRow[y] = c; }
    }
    let tapadas = 0, anchoMax = 0;
    for (const [a, b] of lineasTexto()) {
      for (let y = Math.round(a); y < Math.min(info.height, Math.round(b)); y++) {
        if (opacoRow[y] && anchoRow[y] > 100) { tapadas++; anchoMax = Math.max(anchoMax, anchoRow[y]); break; }
      }
    }
    // En «pdf-page» la tinta es SVG de trazos (rotulador rojo y negro) y el
    // resaltado vive aparte: que sea opaca es lo correcto, es una anotación
    // dibujada ENCIMA, no un subrayado. El chequeo sólo aplica a la variante
    // que quema el resaltador dentro de la tinta raster.
    const tieneMultiply = VARIANTE === 'pdf-page'
      || /ink-layer\s*\{[^}]*mix-blend-mode\s*:\s*multiply/.test(html);
    if (tapadas && !tieneMultiply) {
      problemas.push(`${tapadas} líneas de texto quedan TAPADAS por tinta opaca (trazo de hasta ${anchoMax}px) — falta mix-blend-mode:multiply en .ink-layer`);
      console.log(`   ✗ ${tapadas} líneas tapadas por resaltado opaco (hasta ${anchoMax}px de ancho)`);
    } else if (tieneMultiply && VARIANTE === 'layers') {
      console.log('   ✓ mix-blend-mode:multiply ya aplicado');
    } else if (VARIANTE === 'pdf-page') {
      console.log('   ✓ tinta vectorial: transparente por construcción, nítida a cualquier zoom');
    } else {
      console.log('   ✓ ninguna línea queda tapada');
    }
  }
}

// ─── 4. franjas sin nada: posible contenido perdido ──────────────────────
console.log('\n④ Contenido perdido');
const H = Math.round(PAGE_H ?? inkH);
if (!H) {
  console.log('   — sin altura de página, no se puede comprobar');
} else {
  const cover = new Uint8Array(H);
  const marca = (t, h) => { for (let y = Math.max(0, Math.round(t)); y < Math.min(H, Math.round(t + h)); y++) cover[y] = 1; };
  const reFig = VARIANTE === 'layers'
    ? /top:([\d.]+)px;width:[\d.]+px;height:([\d.]+)px/g
    : /top:([\d.]+)(?:pt|px);width:[\d.]+(?:pt|px);height:([\d.]+)(?:pt|px)/g;
  for (const m of html.matchAll(reFig)) marca(+m[1], +m[2]);
  for (const [a, b] of lineasTexto()) marca(a, b - a);
  // La tinta se rasteriza al tamaño de la página, así que sus filas están en
  // la misma escala que las coordenadas del documento.
  if (inkRow) for (let y = 0; y < Math.min(H, inkRow.length); y++) if (inkRow[y]) cover[y] = 1;

  const huecos = [];
  let ini = null;
  for (let y = 0; y < H; y++) {
    if (!cover[y]) { if (ini === null) ini = y; }
    else { if (ini !== null && y - ini > HUECO_MIN) huecos.push([ini, y - 1, y - ini]); ini = null; }
  }
  if (ini !== null && H - ini > HUECO_MIN) huecos.push([ini, H - 1, H - ini]);

  const px = huecos.reduce((s, x) => s + x[2], 0);
  if (huecos.length > 3 || px / H > 0.05) {
    avisos.push(`${huecos.length} franjas vacías (${(px / H * 100).toFixed(1)}% del alto): revisar si se perdió contenido`);
    console.log(`   ⚠ ${huecos.length} franjas vacías · ${(px / H * 100).toFixed(1)}% del alto`);
    for (const [a, b, h] of huecos.slice(0, 8)) console.log(`      y ${a}–${b}  (${h}px)`);
    console.log('      → recorta esas franjas de la capa de tinta antes de darlas por perdidas:');
    console.log('        muchas veces son esquemas escritos a mano, que sólo viven ahí.');
  } else {
    console.log(`   ✓ documento íntegro (${huecos.length} franjas, ${(px / H * 100).toFixed(1)}% en blanco)`);
  }
}

// ─── 5. portabilidad al visor de MedGO ───────────────────────────────────
console.log('\n⑤ Portabilidad al visor');
if (/<script/i.test(html)) {
  avisos.push('el HTML trae <script> — NO se ejecuta al inyectarse con dangerouslySetInnerHTML; el escalado hay que portarlo a React/CSS');
  console.log('   ⚠ trae <script> (el fit() de escalado) — no sobrevive a dangerouslySetInnerHTML');
}
if (/(^|\})\s*(html\s*,\s*body|body|\*)\s*\{/m.test(html)) {
  avisos.push('el <style> tiene reglas globales (html/body/*) — hay que namespacearlas bajo .sheet o pisarían el dashboard');
  console.log('   ⚠ CSS global (html/body/*) — namespacear bajo .sheet');
}
const anchoPx = PAGE_W ? PAGE_W * A_PX : null;
if (anchoPx && anchoPx > 900) {
  avisos.push(`página de ancho fijo ${anchoPx.toFixed(0)}px con texto en posición absoluta: NO reflowea; en móvil se escala a ~0.25× y queda ilegible`);
  console.log(`   ⚠ ancho fijo ${anchoPx.toFixed(0)}px — no reflowea, ilegible en móvil`);
}

// ─── peso ────────────────────────────────────────────────────────────────
const pesoHtml = Buffer.byteLength(html, 'utf8');
console.log(`\n⑥ Peso   html ${kb(pesoHtml)}  +  imágenes ${kb(pesoImgs)}  =  ${kb(pesoHtml + pesoImgs)}`);

// ─── --fix ───────────────────────────────────────────────────────────────
if (fix) {
  let out = html;
  for (const [de, a] of renombres) out = out.split(`src="${de}"`).join(`src="${a}"`);
  // contain en vez de fill: la red de seguridad para cualquier desvío de
  // aspecto, incluidos los que quedan por debajo del umbral de aviso.
  out = out.replace(/object-fit:fill/g, 'object-fit:contain');
  // el resaltador deja de pintar encima y pasa a comportarse como rotulador
  if (!/mix-blend-mode/.test(out)) {
    out = out.replace(/(\.ink-layer\s*\{)([^}]*)\}/, '$1$2;mix-blend-mode:multiply}');
  }
  // el export no es consistente con los decimales (2 en una variante, 3 en la
  // otra), así que se prueban ambas formas.
  for (const d of deformadas) {
    for (const n of [2, 3]) {
      out = out.replace(`width:${d.w.toFixed(n)}${U};height:${d.h.toFixed(n)}${U}`,
                        `width:${d.wOk.toFixed(n)}${U};height:${d.h.toFixed(n)}${U}`);
    }
  }
  const dest = join(dir, 'preview.html');
  writeFileSync(dest, out, 'utf8');
  console.log(`\n✓ preview corregido → ${dest}`);
  console.log('  ábrelo con:  npx http-server "' + dir + '" -p 8899 -c-1');
  console.log('  (file:// no sirve: el navegador bloquea la carga de las figuras)');
}

// ─── veredicto ───────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
if (problemas.length) {
  console.log(`✗ ${problemas.length} problema${problemas.length > 1 ? 's' : ''} que rompen el documento:`);
  problemas.forEach(p => console.log('   · ' + p));
}
if (avisos.length) {
  console.log(`⚠ ${avisos.length} aviso${avisos.length > 1 ? 's' : ''}:`);
  avisos.forEach(a => console.log('   · ' + a));
}
if (!problemas.length && !avisos.length) console.log('✓ sin hallazgos');
if (problemas.length && !fix) console.log('\n  Repite con --fix para generar un preview corregido.');
console.log('');
