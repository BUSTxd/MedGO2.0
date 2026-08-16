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
const esCapas = /class="image-layer"/.test(html) && /class="text-layer"/.test(html);
if (!esCapas) {
  console.error('\n✗ No encontré .image-layer + .text-layer. Esto no es un PDF reconstruido en capas.');
  console.error('  Si es un export de Notion, la skill correcta es /addresumenhtml.');
  process.exit(1);
}

const mPage = html.match(/--page-w:\s*([\d.]+)px;\s*--page-h:\s*([\d.]+)px/);
const PAGE_W = mPage ? +mPage[1] : null;
const PAGE_H = mPage ? +mPage[2] : null;

console.log(`\n═══ ${htmls[0]}  ·  ${kb(Buffer.byteLength(html, 'utf8'))} ═══`);
if (PAGE_W) console.log(`página: ${PAGE_W.toFixed(0)} × ${PAGE_H.toFixed(0)} px`);

// ─── 1. extensiones referenciadas vs archivos en disco ───────────────────
const refs = [...html.matchAll(/src="([^"]+\.(?:png|jpe?g|webp|avif))"/gi)].map(m => m[1]);
const renombres = new Map(); // ref original → ref corregida
let faltantes = 0;

for (const ref of [...new Set(refs)]) {
  if (existsSync(join(dir, ref))) continue;
  // busca el mismo nombre base con otra extensión
  const base = ref.replace(/\.(png|jpe?g|webp|avif)$/i, '');
  const alt = ['avif', 'webp', 'png', 'jpg', 'jpeg']
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
const cajas = [...html.matchAll(
  /data-image="([^"]+)"[^>]*style="left:([\d.]+)px;top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px"/g
)];
const srcDe = new Map(
  [...html.matchAll(/data-image="([^"]+)"[\s\S]{0,400}?src="([^"]+)"/g)].map(m => [m[1], m[2]])
);

console.log(`\n② Aspecto de las figuras  (${cajas.length} cajas)`);
const deformadas = [];
let pesoImgs = 0;

for (const c of cajas) {
  const [, id, , , w, h] = c;
  const refOrig = srcDe.get(id);
  if (!refOrig) continue;
  const ref = renombres.get(refOrig) ?? refOrig;
  const p = join(dir, ref);
  if (!existsSync(p)) continue;
  pesoImgs += statSync(p).size;

  const meta = await sharp(p).metadata();
  const aCaja = +w / +h;
  const aImg = meta.width / meta.height;
  const desvio = (aImg / aCaja - 1) * 100;
  if (Math.abs(desvio) > DESVIO_MAX) {
    // se corrige por el ancho: cambiar el alto empujaría la figura hacia
    // el texto de abajo, que está en una coordenada fija.
    const wOk = Math.round(+h * aImg);
    deformadas.push({ id, ref, w: +w, h: +h, wOk, desvio, img: `${meta.width}×${meta.height}` });
  }
}

if (deformadas.length) {
  for (const d of deformadas) {
    problemas.push(`figura ${d.id} (${d.ref}) se deforma ${d.desvio.toFixed(1)}%: caja ${d.w}×${d.h}, imagen ${d.img} → ancho correcto ${d.wOk}`);
    console.log(`   ✗ ${d.id}  caja ${d.w}×${d.h}  ·  imagen ${d.img}  ·  ${d.desvio > 0 ? '+' : ''}${d.desvio.toFixed(1)}%  → ancho ${d.wOk}`);
  }
} else {
  console.log('   ✓ ninguna se deforma');
}

// ─── 3. la capa de tinta ─────────────────────────────────────────────────
const inkRef0 = html.match(/class="ink"[^>]*src="([^"]+)"/)?.[1]
             ?? html.match(/ink-layer[\s\S]{0,200}?src="([^"]+)"/)?.[1];
let inkRow = null, inkH = 0;

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
    const lineas = [...html.matchAll(/top:([\d.]+)px;font-size:([\d.]+)px/g)]
      .map(m => [+m[1], +m[1] + +m[2] * 1.2]);
    let tapadas = 0, anchoMax = 0;
    for (const [a, b] of lineas) {
      for (let y = Math.round(a); y < Math.min(info.height, Math.round(b)); y++) {
        if (opacoRow[y] && anchoRow[y] > 100) { tapadas++; anchoMax = Math.max(anchoMax, anchoRow[y]); break; }
      }
    }
    const tieneMultiply = /ink-layer\s*\{[^}]*mix-blend-mode\s*:\s*multiply/.test(html);
    if (tapadas && !tieneMultiply) {
      problemas.push(`${tapadas} líneas de texto quedan TAPADAS por tinta opaca (trazo de hasta ${anchoMax}px) — falta mix-blend-mode:multiply en .ink-layer`);
      console.log(`   ✗ ${tapadas} líneas tapadas por resaltado opaco (hasta ${anchoMax}px de ancho)`);
    } else if (tieneMultiply) {
      console.log('   ✓ mix-blend-mode:multiply ya aplicado');
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
  for (const m of html.matchAll(/top:([\d.]+)px;width:([\d.]+)px;height:([\d.]+)px/g)) marca(+m[1], +m[3]);
  for (const m of html.matchAll(/top:([\d.]+)px;font-size:([\d.]+)px/g)) marca(+m[1], +m[2] * 1.2);
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
const anchoFijo = PAGE_W && PAGE_W > 900;
if (anchoFijo) {
  avisos.push(`página de ancho fijo ${PAGE_W.toFixed(0)}px con texto en posición absoluta: NO reflowea; en móvil se escala a ~0.25× y queda ilegible`);
  console.log(`   ⚠ ancho fijo ${PAGE_W.toFixed(0)}px — no reflowea, ilegible en móvil`);
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
  for (const d of deformadas) {
    out = out.replace(`width:${d.w.toFixed(3)}px;height:${d.h.toFixed(3)}px`,
                      `width:${d.wOk.toFixed(3)}px;height:${d.h.toFixed(3)}px`);
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
