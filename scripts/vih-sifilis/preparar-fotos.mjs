/**
 * Prepara las fotos del lab «VIH y sífilis» para que BUST las optimice a mano (medgo-imgflow → AVIF).
 *
 *   node scripts/vih-sifilis/preparar-fotos.mjs --salida <carpeta> [--solo id1,id2] [--hoja]
 *
 * Para cada foto de `fotos-plan.mjs`:
 *   1. baja el ORIGINAL (Wikimedia Commons o el bucket abierto de PubMed Central) a `<salida>/originales/`
 *      (se queda ahí: si ya está, no se vuelve a bajar);
 *   2. lo recorta (un cuadrado para las lentes, el rectángulo del marco para las demás);
 *   3. lo reduce con la regla «foto» de `scripts/imagenes/tamano.mjs` (lado corto ≈ 460 px, método `cubic`)
 *      y lo deja SIN COMPRIMIR en `<salida>/para-optimizar/<id>_<versión>.png`.
 * La compresión a AVIF es de BUST (medgo-imgflow): Claude manda, no comprime. Lo que BUST devuelva, con
 * el mismo nombre y extensión `.avif`, es lo que sube `subir-fotos.mjs`.
 *
 * `--sin-originales`: no pide los originales pequeños de Commons (se usa la miniatura estándar); útil mientras Wikimedia limite.
 *
 * También escribe `<salida>/CREDITOS.md` (autor, licencia y fuente de cada foto, leídos de
 * `src/lib/data/vih-sifilis/fotos.ts`) y, con `--hoja`, `<salida>/hoja.png`: todas las fotos tal como se
 * verán (lentes redondas y marcos), para revisarlas de un vistazo.
 *
 * Cliente de descarga genérico (sin datos de nadie): Wikimedia pide un User-Agent descriptivo y cortesía.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { KERNEL, anchoObjetivo } from '../imagenes/tamano.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? d : process.argv[i + 1]; };
const salida = arg('salida');
if (!salida) { console.error('Uso: --salida <carpeta> [--solo id1,id2] [--hoja]'); process.exit(1); }
const solo = arg('solo') ? new Set(arg('solo').split(',')) : null;
const UA = 'open-license-image-search/1.0';
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const { PLAN } = await import(pathToFileURL(path.join(RAIZ, 'scripts/vih-sifilis/fotos-plan.mjs')).href);
const { FOTOS } = await import(pathToFileURL(path.join(RAIZ, 'src/lib/data/vih-sifilis/fotos.ts')).href);

const dirOrig = path.join(salida, 'originales');
const dirOpt = path.join(salida, 'para-optimizar');
const dirAvif = path.join(salida, 'optimizadas');
for (const d of [dirOrig, dirOpt, dirAvif]) mkdirSync(d, { recursive: true });

/**
 * Wikimedia Commons limita con un 429 (`retry-after`) la descarga de ORIGINALES y de miniaturas de tamaños que no sean los
 * estándar. Por eso: el original solo se pide si es pequeño (hasta 1000 px), y si falla se cae a la miniatura estándar más
 * grande que sea menor que el original (500, 960, 1280 o 1920 px: de sobra, lo entregado mide ~500 px). Los originales
 * mayores de 1000 px van siempre por miniatura.
 */
const ESCALONES = [1920, 1280, 960, 500];

/** URL candidatas de partida de una foto del plan, de la mejor a la peor. */
function urlsDe(f) {
  if (f.pmc) return [`https://pmc-oa-opendata.s3.amazonaws.com/${f.pmc}.1/${f.archivo}`];
  const base = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f.commons.replace(/ /g, '_'))}`;
  const mini = ESCALONES.find((e) => e < f.orig[0]);
  const urls = [];
  if (f.orig[0] <= 1000 && !process.argv.includes('--sin-originales')) urls.push(base);
  if (mini) urls.push(`${base}?width=${mini}`);
  return urls.length ? urls : [base];
}

/** ¿Se bajó una miniatura (y no el original)? Para la extensión del archivo y para decirlo. */
const esMiniatura = (url) => /\?width=\d+$/.test(url);

async function bajar(urls, destino) {
  if (existsSync(destino)) return urls[0];
  for (let ronda = 0; ronda < 2; ronda++) {
    let espera = 0;
    for (const url of urls) {
      try {
        const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(90000) });
        if (r.ok) { writeFileSync(destino, Buffer.from(await r.arrayBuffer())); await dormir(3000); return url; }
        console.error(`  http ${r.status} ${url.slice(-70)}`);
        if (r.status === 429) espera = Math.max(espera, Math.min(Number(r.headers.get('retry-after') ?? 120), 700));
      } catch (e) { console.error(`  fallo ${e.name} ${url.slice(-70)}`); }
      await dormir(3000);
    }
    if (ronda === 0 && espera) { console.error(`  límite de peticiones: espero ${espera} s`); await dormir(espera * 1000 + 3000); }
  }
  throw new Error(`no se pudo bajar ${urls[0]}`);
}

/** Caja de recorte en píxeles a partir del plan: `recorte` [x, y, w, h] en fracciones, o `cuadrado` [cx, cy, escala] (el mayor cuadrado), o `marco` [cx, cy, escala] con la proporción w:h del marco. */
function caja(f, W, H) {
  if (f.recorte) { const [x, y, w, h] = f.recorte; return { left: Math.round(x * W), top: Math.round(y * H), width: Math.round(w * W), height: Math.round(h * H) }; }
  const [cx, cy, esc = 1] = f.cuadrado ?? f.marco ?? [0.5, 0.5, 1];
  const asp = f.marco ? f.w / f.h : 1;
  let ancho = Math.min(W, H * asp) * esc, alto = ancho / asp;
  if (alto > H) { alto = H; ancho = alto * asp; }
  const left = Math.min(W - ancho, Math.max(0, cx * W - ancho / 2)), top = Math.min(H - alto, Math.max(0, cy * H - alto / 2));
  return { left: Math.round(left), top: Math.round(top), width: Math.round(ancho), height: Math.round(alto) };
}

const hechas = [];
for (const f of PLAN) {
  if (solo && !solo.has(f.id)) continue;
  const meta = FOTOS[f.id];
  if (!meta) { console.error(`${f.id}: no está en fotos.ts`); process.exitCode = 1; continue; }
  const urls = urlsDe(f);
  let ext = path.extname(f.pmc ? f.archivo : f.commons).toLowerCase();
  if (/^\.tiff?$/.test(ext)) ext = '.jpg'; // la miniatura de un TIFF llega como JPEG
  const orig = path.join(dirOrig, `${f.id}${ext}`);
  const usada = await bajar(urls, orig);
  if (esMiniatura(usada)) console.log(`  (${f.id}: se usó la miniatura de Commons ${usada.split('=').pop()} px)`);
  const im = sharp(orig, { limitInputPixels: false });
  const { width: W, height: H } = await im.metadata();
  const c = caja(f, W, H);
  const ancho = anchoObjetivo({ W: c.width, H: c.height, tipo: 'foto' });
  const destino = path.join(dirOpt, `${f.id}_${meta.version}.png`);
  await sharp(orig, { limitInputPixels: false }).extract(c).resize({ width: ancho, kernel: KERNEL }).png().toFile(destino);
  const m = await sharp(destino).metadata();
  console.log(`${f.id.padEnd(24)} original ${W}x${H} → recorte ${c.width}x${c.height} → ${m.width}x${m.height}  (${meta.licencia}, ${meta.autor})`);
  hechas.push({ f, meta, W, H, c, m, destino });
}

// Créditos
const filas = hechas.map(({ f, meta, W, H, c, m }) => `| \`${f.id}_${meta.version}\` | ${f.tema} | cap. ${f.cap} · paso ${f.paso} | ${meta.autor} | ${meta.licencia} | ${meta.origen ?? 'Wikimedia Commons'} | ${meta.fuente} | ${W}×${H} → ${c.width}×${c.height} → ${m.width}×${m.height} |`);
writeFileSync(path.join(salida, 'CREDITOS.md'), `# Fotos del laboratorio «VIH y sífilis» · créditos

Todas con licencia libre (CC0, dominio público, CC BY o CC BY-SA). En pantalla cada foto lleva pegado su crédito
(«Foto: autor · licencia · origen»); estos datos viven en \`src/lib/data/vih-sifilis/fotos.ts\`.

| Archivo final | Qué es | Dónde sale | Autor | Licencia | Origen | Fuente | Original → recorte → entregada |
|---|---|---|---|---|---|---|---|
${filas.join('\n')}

- \`originales/\`: tal como se bajaron (sin tocar).
- \`para-optimizar/\`: recortadas y reducidas con la regla «foto» de \`scripts/imagenes/tamano.mjs\`, en PNG sin comprimir.
  Pásalas por medgo-imgflow y guarda el resultado como \`<mismo nombre>.avif\` en \`optimizadas/\`.
- Subida: \`node scripts/vih-sifilis/subir-fotos.mjs --dir <carpeta optimizadas>\` (versión nueva, nunca se pisa una).
`);

// LEEME
const chicas = hechas.filter((h) => h.m.width < 360).map((h) => `${h.f.id} (${h.m.width}×${h.m.height})`);
writeFileSync(path.join(salida, 'LEEME.txt'), `FOTOS DEL LABORATORIO «VIH Y SÍFILIS»
=====================================

Qué hay en esta carpeta
  originales/       lo que se bajó de cada fuente, sin tocar. De Wikimedia Commons llega como mucho a 1920 px de ancho
                    (la miniatura estándar más grande que permite; de sobra, porque lo entregado mide ~500 px).
  para-optimizar/   <id>_v1.png: cada foto ya recortada y reducida con la regla «foto» de scripts/imagenes/tamano.mjs
                    (lado corto ≈ 460 px, método cubic), SIN comprimir. Estas son las que van a medgo-imgflow.
  optimizadas/      (vacía) aquí van los <id>_v1.avif que salgan de medgo-imgflow, con el MISMO nombre.
  hoja.png          todas las fotos como se verán en el lab (lente redonda o marco): para mirarlas de un vistazo.
  CREDITOS.md       autor, licencia, fuente y capítulo/paso de cada foto.

Qué hacer
  1. Pasa cada PNG de para-optimizar/ por medgo-imgflow y guarda el resultado como <id>_v1.avif en optimizadas/.
  2. Para ver el lab con tus AVIF sin subir nada:  node scripts/vih-sifilis/vista.mjs --caps 18 --pasos 1,2,3,4
     (lee optimizadas/ y, si falta una foto, usa el PNG de para-optimizar/).
  3. Para subirlas (solo cuando lo ordenes):
       node --experimental-strip-types --no-warnings scripts/vih-sifilis/subir-fotos.mjs --dir <esta carpeta>/optimizadas --ver
     (comprueba nombres y versiones sin subir) y después el mismo comando sin --ver. Una foto cambiada es una versión
     nueva (_v2): el bucket las sirve con caché de un año y nunca se pisa una.

Ojo
  ${chicas.length ? `Las más pequeñas de origen son ${chicas.join(', ')}: la fuente libre no daba más. Se verán algo suaves; si encuentras una mejor, cámbiala por una versión nueva.` : 'Ninguna sale de una fuente demasiado pequeña.'}
  Todas son licencias libres (CC0, dominio público, CC BY o CC BY-SA) y en pantalla cada foto lleva su crédito pegado.
  Wikimedia limita las descargas con un 429; por eso se usan sus miniaturas estándar y no los originales completos.
`);

// Hoja de contacto: cada foto como se verá (lente redonda o marco con esquinas redondeadas)
if (process.argv.includes('--hoja')) {
  const W = 360, H = 330, COLS = 5, filasN = Math.ceil(hechas.length / COLS);
  const comps = [];
  for (const [k, h] of hechas.entries()) {
    const lente = h.f.forma === 'lente';
    const esc = lente ? 1 : Math.min(340 / h.f.w, 262 / h.f.h);
    const lado = 262, ancho = lente ? lado : Math.round(h.f.w * esc), alto = lente ? lado : Math.round(h.f.h * esc);
    const base = await sharp(h.destino).resize(ancho, alto, { fit: 'cover' }).png().toBuffer();
    const mascara = Buffer.from(lente ? `<svg width="${ancho}" height="${alto}"><circle cx="${ancho / 2}" cy="${alto / 2}" r="${ancho / 2}"/></svg>` : `<svg width="${ancho}" height="${alto}"><rect width="${ancho}" height="${alto}" rx="22"/></svg>`);
    const forma = await sharp(base).composite([{ input: mascara, blend: 'dest-in' }]).png().toBuffer();
    const nombre = Buffer.from(`<svg width="${W}" height="34"><text x="${W / 2}" y="24" font-size="19" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">${h.f.id}</text></svg>`);
    const celda = await sharp({ create: { width: W, height: H, channels: 3, background: '#2A2438' } })
      .composite([{ input: forma, left: Math.round((W - ancho) / 2), top: 8 + Math.round((lado - alto) / 2) }, { input: nombre, left: 0, top: H - 38 }]).png().toBuffer();
    comps.push({ input: celda, left: (k % COLS) * (W + 6), top: Math.floor(k / COLS) * (H + 6) });
  }
  await sharp({ create: { width: COLS * (W + 6), height: filasN * (H + 6), channels: 3, background: '#111' } }).composite(comps).png().toFile(path.join(salida, 'hoja.png'));
  console.log('hoja →', path.join(salida, 'hoja.png'));
}
console.log(`${hechas.length} fotos listas en ${dirOpt}`);
