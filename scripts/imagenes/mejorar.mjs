/**
 * Mejora las imágenes de un export (Notion) antes de subir un resumen.
 *
 *   1. analizar  → calidad (calidad-imagenes.mjs) + logos, texto y cuadros
 *                  (analizar.py). Escribe plan.json y para-claude.jpg (mosaico de
 *                  las que tienen mucho texto, para que Claude decida).
 *   2. codex     → (en segundo plano) cada imagen con decision «codex» va a
 *                  Codex: dibujo → rediseño PNG sin fondo; foto → más resolución
 *                  si su nota es baja. Escribe codex/<nombre>.png y comparar.html.
 *   3. aplicar   → copia al export las aceptadas (mismo nombre), guardando los
 *                  originales en <salida>/originales/.
 *   4. comprimir → manda el export a la web medgo-imgflow (imgflow.mjs) y deja
 *                  su ZIP en Descargas, descomprimido en «<nombre> (imgflow)»:
 *                  ESA carpeta es la que se sube.
 *
 * Uso:
 *   node scripts/imagenes/mejorar.mjs analizar --dir "<export>" [--salida <carpeta>]
 *   node scripts/imagenes/mejorar.mjs codex    --salida <carpeta> [--paralelo 2] [--esfuerzo low] [--solo a.png,b.png]
 *   node scripts/imagenes/mejorar.mjs aplicar  --salida <carpeta> --dir "<export>" --aceptar todas|a.png,b.png
 *   node scripts/imagenes/mejorar.mjs comprimir --salida <carpeta> --dir "<export>"
 *
 * Nunca escribe en el export salvo en «aplicar». Codex gasta la cuenta de
 * ChatGPT de BUST, no tokens de Claude.
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname, basename, extname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import sharp from 'sharp';

const AQUI = dirname(fileURLToPath(import.meta.url));
import { anchoObjetivo, FONDO_FIGURAS, KERNEL } from './tamano.mjs';
const RAIZ = resolve(AQUI, '..', '..');

const [fase, ...resto] = process.argv.slice(2);
const args = {};
for (let i = 0; i < resto.length; i++) {
  if (!resto[i].startsWith('--')) continue;
  const next = resto[i + 1];
  if (!next || next.startsWith('--')) args[resto[i].slice(2)] = true;
  else { args[resto[i].slice(2)] = next; i++; }
}

const correr = (cmd, argv, opts = {}) => new Promise((ok, mal) => {
  const p = spawn(cmd, argv, { stdio: ['pipe', 'pipe', 'pipe'], ...opts });
  let out = '', err = '';
  p.stdout.on('data', (d) => { out += d; if (opts.eco) process.stdout.write(d); });
  p.stderr.on('data', (d) => { err += d; });
  if (opts.entrada) p.stdin.end(opts.entrada); else p.stdin.end();
  const t = opts.limite ? setTimeout(() => { p.kill(); }, opts.limite) : null;
  p.on('close', (code) => { if (t) clearTimeout(t); code === 0 ? ok(out) : mal(new Error(`${basename(cmd)} salió con ${code}: ${err.slice(-600)}`)); });
  p.on('error', mal);
});

const leerPlan = (s) => JSON.parse(readFileSync(join(s, 'plan.json'), 'utf8'));
const guardarPlan = (s, plan) => writeFileSync(join(s, 'plan.json'), JSON.stringify(plan, null, 2));

// ─── 1. analizar ─────────────────────────────────────────────────────────
async function analizar() {
  if (!args.dir || !existsSync(args.dir)) throw new Error('Falta --dir <carpeta del export>');
  const S = resolve(args.salida ?? join(tmpdir(), 'medgo-imagenes', new Date().toISOString().replace(/[:.]/g, '-')));
  mkdirSync(S, { recursive: true });
  console.log(`Salida: ${S}\n\n1/2 Calidad…`);
  await correr(process.execPath, [join(RAIZ, 'scripts', 'calidad-imagenes.mjs'), '--dir', args.dir, '--peores', '1', '--salida', join(S, 'calidad')]);
  console.log('2/2 Logos, texto y cuadros…');
  await correr('py', ['-3', '-I', join(AQUI, 'analizar.py'), args.dir, join(S, 'analisis'), join(RAIZ, 'data', 'logos')]);

  const calidad = JSON.parse(readFileSync(join(S, 'calidad', 'informe.json'), 'utf8')).medidas;
  const porNombre = new Map(calidad.map((c) => [resolve(c.ruta), c]));
  const analisis = JSON.parse(readFileSync(join(S, 'analisis', 'analisis.json'), 'utf8'));
  const imagenes = analisis.map((a) => {
    const c = porNombre.get(resolve(a.ruta)) ?? {};
    return {
      nombre: a.nombre, ruta: a.ruta, W: a.W, H: a.H,
      nota: c.nota ?? null, motivos: c.motivos ?? [],
      logo: a.logo ?? null, texto: a.texto, cuadro: a.cuadro, foto: a.foto,
      mucho_texto: a.mucho_texto,
      // Claude cambia «revisar» por «codigo» (lo rehace con HTML) o «codex»
      decision: a.mucho_texto ? 'revisar' : 'codex',
    };
  });
  const plan = { export: resolve(args.dir), salida: S, imagenes };
  guardarPlan(S, plan);

  // mosaico de las que tienen mucho texto, numeradas, para que Claude las mire
  const revisar = imagenes.filter((i) => i.decision === 'revisar');
  if (revisar.length) {
    const L = 360, cols = Math.min(4, revisar.length), filas = Math.ceil(revisar.length / cols);
    const piezas = await Promise.all(revisar.map(async (im, n) => {
      const mini = await sharp(im.logo?.limpio ?? im.ruta).flatten({ background: '#fff' })
        .resize(L - 8, L - 36, { fit: 'contain', background: '#fff' }).png().toBuffer();
      const rotulo = Buffer.from(`<svg width="${L}" height="28"><rect width="100%" height="100%" fill="#1a2557"/><text x="8" y="20" font-family="Arial" font-size="16" fill="#fff">${n + 1}. ${im.nombre.slice(0, 34)}</text></svg>`);
      return [{ input: rotulo, left: (n % cols) * L, top: Math.floor(n / cols) * L }, { input: mini, left: (n % cols) * L + 4, top: Math.floor(n / cols) * L + 32 }];
    }));
    await sharp({ create: { width: cols * L, height: filas * L, channels: 3, background: '#e6e6ee' } })
      .composite(piezas.flat()).jpeg({ quality: 70 }).toFile(join(S, 'para-claude.jpg'));
  }

  console.log(`\n${imagenes.length} imágenes · ${imagenes.filter((i) => i.logo).length} con logo · ${revisar.length} con mucho texto (para Claude) · ${imagenes.filter((i) => i.decision === 'codex').length} para Codex`);
  revisar.forEach((im, n) => console.log(`  ${n + 1}. ${im.nombre}${im.cuadro.es_cuadro ? '  [cuadro]' : ''}`));
  console.log(`\nPlan: ${join(S, 'plan.json')}${revisar.length ? `\nMosaico para Claude: ${join(S, 'para-claude.jpg')}` : ''}`);
}

// ─── 2. codex ────────────────────────────────────────────────────────────
function codexJs() {
  const js = join(process.env.APPDATA ?? '', 'npm', 'node_modules', '@openai', 'codex', 'bin', 'codex.js');
  if (!existsSync(js)) throw new Error(`No encuentro Codex CLI en ${js} (npm install -g @openai/codex)`);
  return js;
}

async function unaImagen(im, S, plantilla, esfuerzo) {
  const stem = basename(im.nombre, extname(im.nombre));
  const trabajo = join(S, 'codex', 'trabajo', stem);
  rmSync(trabajo, { recursive: true, force: true });
  mkdirSync(trabajo, { recursive: true });
  await sharp(im.logo?.limpio ?? im.ruta).png().toFile(join(trabajo, 'entrada.png'));
  // BUST (2026-11-04): las fotos y micrografías se mejoran siempre; la imagen debe ser la misma.
  const accionFoto = 'MÁS CALIDAD, con tu herramienta de edición de imágenes: la imagen debe ser LA MISMA, pero verse de mayor calidad (más nítida, con más resolución y sin ruido ni artefactos de compresión). No añadas, quites ni muevas ninguna estructura (células, gránulos, bordes, flechas, rótulos), no cambies colores, encuadre, composición ni fondo; no la rediseñes. Responde accion «resolucion».';
  const datos = `- tamaño ${im.W}×${im.H} px; nota de calidad ${im.nota ?? '—'}/100 (${im.motivos.join('; ') || 'sin problemas'})\n- ${im.foto.parece_foto ? 'por números parece foto' : 'por números parece dibujo'} (puede fallar con escaneos)`;
  const prompt = plantilla.replace('{{DATOS}}', datos).replace('{{ACCION_FOTO}}', accionFoto);
  const t0 = Date.now();
  await correr(process.execPath, [codexJs(), 'exec', '-C', trabajo, '--skip-git-repo-check', '-s', 'workspace-write',
    '-c', `model_reasoning_effort=${esfuerzo}`, '--output-schema', join(AQUI, 'respuesta.schema.json'),
    '-o', join(trabajo, 'respuesta.json'), '-i', join(trabajo, 'entrada.png')],
  { entrada: prompt, limite: 15 * 60 * 1000 });
  const resp = JSON.parse(readFileSync(join(trabajo, 'respuesta.json'), 'utf8'));
  const generado = join(trabajo, 'salida.png');
  let resultado = null;
  if (existsSync(generado)) {
    resultado = join(S, 'codex', `${stem}.png`);
    copyFileSync(generado, resultado);
  }
  return { ...resp, resultado, segundos: Math.round((Date.now() - t0) / 1000) };
}

async function codex() {
  const S = resolve(args.salida ?? '');
  if (!existsSync(join(S, 'plan.json'))) throw new Error('Falta --salida <carpeta> con plan.json (corre antes «analizar»)');
  const plan = leerPlan(S);
  const solo = args.solo ? String(args.solo).split(',').map((s) => s.trim()) : null;
  // --rehacer: con --solo, vuelve a pasar esas aunque ya tengan resultado
  if (args.rehacer && solo) for (const i of plan.imagenes) if (solo.includes(i.nombre)) delete i.codex;
  const pendientes = plan.imagenes.filter((i) => i.decision === 'codex' && !i.codex?.resultado && !i.codex?.accion
    && (!solo || solo.includes(i.nombre)));
  const revisar = plan.imagenes.filter((i) => i.decision === 'revisar');
  if (revisar.length) console.log(`Aviso: ${revisar.length} siguen en «revisar» y no van a Codex.`);
  const plantilla = readFileSync(join(AQUI, 'prompt-codex.md'), 'utf8');
  const paralelo = Number(args.paralelo ?? 2), esfuerzo = args.esfuerzo ?? 'low';
  console.log(`Codex: ${pendientes.length} imágenes, ${paralelo} a la vez, razonamiento ${esfuerzo}.`);
  let hechas = 0;
  const cola = [...pendientes];
  await Promise.all(Array.from({ length: paralelo }, async () => {
    for (let im; (im = cola.shift());) {
      try {
        im.codex = await unaImagen(im, S, plantilla, esfuerzo);
        console.log(`  ✓ ${++hechas}/${pendientes.length} ${im.nombre}: ${im.codex.tipo} → ${im.codex.accion} (${im.codex.segundos} s)`);
      } catch (e) {
        im.codex = { error: e.message };
        console.log(`  ✗ ${++hechas}/${pendientes.length} ${im.nombre}: ${e.message.split('\n')[0]}`);
      }
      guardarPlan(S, plan);                      // progreso: se puede reanudar
    }
  }));
  await hojaComparar(S, plan);
  const ok = plan.imagenes.filter((i) => i.codex?.resultado).length;
  console.log(`\nListo: ${ok} imágenes nuevas · comparar: ${join(S, 'comparar.html')}`);
}

async function hojaComparar(S, plan) {
  const url = (p) => pathToFileURL(p).href;
  const filas = plan.imagenes.filter((i) => i.codex || i.logo).map((im) => {
    const antes = im.ruta, despues = im.codex?.resultado ?? im.logo?.limpio;
    const que = im.codex?.error ? `error: ${im.codex.error.slice(0, 120)}` : im.codex ? `${im.codex.tipo} → ${im.codex.accion}: ${im.codex.nota}` : 'solo sin logo';
    const casilla = despues ? `<label class="ok"><input type="checkbox" data-nombre="${im.nombre}" checked> Aceptar</label>` : '';
    return `<section><h2>${im.nombre}</h2>${casilla}<p>${que}</p>${im.codex?.rotulos?.length ? `<p class="r">Rótulos: ${im.codex.rotulos.join(' · ')}</p>` : ''}
      <div class="par"><figure><img src="${url(antes)}"><figcaption>Antes</figcaption></figure>
      <figure>${despues ? `<img src="${url(despues)}">` : '<div class="nada">Sin cambios</div>'}<figcaption>Después</figcaption></figure></div></section>`;
  }).join('');
  writeFileSync(join(S, 'comparar.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Comparar imágenes</title>
<style>
  :root{--bg:#f4f4f8;--fg:#1a1a2e;--card:#fff;--hoja:#fff}
  :root.oscuro{--bg:#08061a;--fg:#f0eeff;--card:#16143a;--hoja:#0d0b28}
  body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}
  button{font:inherit;padding:6px 12px;border-radius:8px;border:0;background:#1a2557;color:#fff;cursor:pointer}
  section{background:var(--card);border-radius:12px;padding:12px 14px;margin:14px 0}
  h2{font-size:15px;margin:0 0 4px} p{margin:2px 0;opacity:.85} .r{font-size:12px;opacity:.7}
  .par{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:8px}
  figure{margin:0} img{width:100%;max-height:520px;object-fit:contain;background:var(--hoja);border-radius:8px}
  figcaption{font-size:12px;opacity:.7;margin-top:4px} .nada{padding:40px;text-align:center;opacity:.6}
  .ok{float:right;font-weight:600;cursor:pointer} .ok input{width:18px;height:18px;vertical-align:-3px}
  .barra{position:sticky;bottom:0;display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px 14px;margin:0 -16px -16px;background:var(--card);box-shadow:0 -4px 16px rgba(0,0,0,.18)}
  #aviso{opacity:.8}
</style>
<button onclick="document.documentElement.classList.toggle('oscuro')">Fondo claro / oscuro</button>
<p>El «después» sin fondo se ve sobre el color de la hoja del resumen: prueba los dos. Desmarca las
que no quieras y pulsa «Copiar lista para Claude»: pégala en el chat y Claude aplica solo esas.</p>${filas}
<div class="barra"><button id="copiar">Copiar lista para Claude</button><span id="aviso"></span></div>
<script>
  const casillas = [...document.querySelectorAll('input[data-nombre]')];
  const aviso = document.getElementById('aviso');
  const contar = () => { aviso.textContent = casillas.filter((c) => c.checked).length + ' de ' + casillas.length + ' aceptadas'; };
  casillas.forEach((c) => c.addEventListener('change', contar)); contar();
  document.getElementById('copiar').addEventListener('click', async () => {
    const si = casillas.filter((c) => c.checked).map((c) => c.dataset.nombre);
    const texto = 'Aplica estas imágenes (' + si.length + '): ' + (si.join(', ') || 'ninguna');
    try { await navigator.clipboard.writeText(texto); aviso.textContent = 'Copiado: pégalo en el chat de Claude.'; }
    catch { aviso.textContent = texto; }
  });
</script>`);
}

// ─── 3. aplicar ──────────────────────────────────────────────────────────
async function aplicar() {
  const S = resolve(args.salida ?? '');
  const plan = leerPlan(S);
  // escribir en el export exige nombrarlo: evita pisar otro export por un plan mal apuntado
  if (!args.dir || resolve(args.dir) !== plan.export) throw new Error(`«aplicar» escribe en ${plan.export}: confírmalo con --dir "${plan.export}"`);
  if (plan.imagenes.some((i) => !resolve(i.ruta).startsWith(plan.export))) throw new Error('Hay rutas del plan fuera del export: no aplico nada.');
  const lista = args.aceptar === 'todas' ? null : String(args.aceptar ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (lista !== null && !lista.length) throw new Error('Falta --aceptar todas|a.png,b.png');
  mkdirSync(join(S, 'originales'), { recursive: true });
  // líneas de texto de cada figura de Codex (entran en la regla de tamano.mjs)
  const lineas = new Map();
  const conCodex = plan.imagenes.filter((i) => i.codex?.resultado);
  if (conCodex.length) {
    const tmp = join(S, 'lineas');
    rmSync(tmp, { recursive: true, force: true });
    mkdirSync(join(tmp, 'img'), { recursive: true });
    for (const i of conCodex) copyFileSync(i.codex.resultado, join(tmp, 'img', i.nombre));
    await correr('py', ['-3', '-I', join(AQUI, 'analizar.py'), join(tmp, 'img'), join(tmp, 'an'), join(tmp, 'sin-logos')]);
    for (const a of JSON.parse(readFileSync(join(tmp, 'an', 'analisis.json'), 'utf8'))) lineas.set(a.nombre, a.texto?.lineas ?? 0);
  }
  let n = 0;
  for (const im of plan.imagenes) {
    const nuevo = im.codex?.resultado ?? im.logo?.limpio;
    if (!nuevo || (lista && !lista.includes(im.nombre) && !lista.includes(basename(im.nombre)))) continue;
    const destino = im.ruta, ext = extname(destino).toLowerCase();
    const copia = join(S, 'originales', im.nombre);
    mkdirSync(dirname(copia), { recursive: true });
    if (!existsSync(copia)) copyFileSync(destino, copia);
    // Codex devuelve 1500-2200 px (~2 MB en PNG): mandadas así, la web medgo-imgflow
    // las bajaba sólo hasta 700 KB y el resumen pesaba 4 veces más. El tamaño lo
    // decide tamano.mjs (la regla del ajuste a mano de BUST). Sin filtros: la mediana
    // ablandaba la letra.
    const mNuevo = await sharp(nuevo).metadata();
    const ancho = anchoObjetivo({ W: mNuevo.width, H: mNuevo.height, tipo: im.codex?.tipo ?? 'dibujo', lineas: lineas.get(im.nombre) ?? 0 });
    const escala = Math.min(1, ancho / mNuevo.width);
    // mismo nombre y extensión: el HTML del export lo referencia así
    let img = sharp(nuevo).resize(Math.round(mNuevo.width * escala), Math.round(mNuevo.height * escala), { kernel: KERNEL });
    // Fondo crema, el mismo papel de la figura ampliada (resumenHtml.module.css,
    // .lightboxImg). La transparencia era el 40 % del peso del AVIF (lo guarda como
    // un plano aparte, y la de GPT Image venía con ruido: «opaco» en 249-254 y una
    // neblina de 1-8 en el fondo). BUST eligió crema el 2026-11-05.
    img = img.flatten({ background: FONDO_FIGURAS });
    im.medidaFinal = `${Math.round(mNuevo.width * escala)}×${Math.round(mNuevo.height * escala)}`;
    if (ext === '.png') await img.png({ compressionLevel: 9 }).toFile(destino + '.tmp');
    else if (ext === '.webp') await img.webp({ quality: 92 }).toFile(destino + '.tmp');
    else await img.flatten({ background: '#fff' }).jpeg({ quality: 92 }).toFile(destino + '.tmp');
    copyFileSync(destino + '.tmp', destino); rmSync(destino + '.tmp');
    // un .avif al lado haría que upload-resumen-html.mjs subiera el viejo
    const avif = destino.slice(0, -ext.length) + '.avif';
    if (existsSync(avif)) { copyFileSync(avif, copia.slice(0, -ext.length) + '.avif'); rmSync(avif); }
    im.aplicada = true; n++;
  }
  guardarPlan(S, plan);
  console.log(`${n} imágenes reemplazadas en el export · originales en ${join(S, 'originales')}`);
}

// ─── 4. comprimir ────────────────────────────────────────────────────────
// Tras aprobar: el export se MANDA a la web medgo-imgflow de BUST (imgflow.mjs),
// que achica, convierte con Cloudinary y devuelve un ZIP a Descargas. Lo que se
// sube es esa carpeta, no el export. (Hasta el 2026-11-05 había un script que
// copiaba su lógica con sharp: salía un 9 % más pesado y BUST pidió usar su web.)
async function comprimir() {
  const S = resolve(args.salida ?? '');
  const plan = leerPlan(S);
  if (!args.dir || resolve(args.dir) !== plan.export) throw new Error(`«comprimir» lee ${plan.export}: confírmalo con --dir "${plan.export}"`);
  // Con la web tal cual (700 KB, su ajuste de siempre), como lo probó BUST.
  await correr(process.execPath, [join(AQUI, 'imgflow.mjs'), '--dir', plan.export], { eco: true });
}

const fases = { analizar, codex, aplicar, comprimir };
if (!fases[fase]) { console.error('Fase: analizar | codex | aplicar (ver cabecera del script)'); process.exit(1); }
await fases[fase]();
