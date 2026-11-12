/**
 * Revisión SIN navegador de la plantilla de una clase: pinta sus «Notas» y sus
 * «Casos clínicos» (portada y un caso ya respondido) desde el JSON local
 * (`data/clases/<curso>/<clase>.json`), con react-dom/server y Edge sin ventana.
 *
 *   node scripts/clases/vista.mjs patologia/pat-ai-17 [--tema claro|oscuro|ambos] [--ancho 1280]
 *        [--alto 2200] [--caso 0] [--salida <carpeta>] [--archivo <otro.json>]
 *
 * `--archivo` pinta un borrador que aún no está en data/clases/ (la clave da el nombre).
 *
 * No abre nada para nadie: solo escribe PNG. Límite honesto: la fuente puede caer a una
 * de respaldo, y lo que depende de clics, scroll o animación no se ve.
 */

import { register } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// El último registrado responde primero: los huecos de Next, y luego el TSX y el alias `@/`.
register('../gramnegativas/cargador-tsx.mjs', import.meta.url);
register('./cargador.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? d : process.argv[i + 1]; };
const clave = process.argv.slice(2).find((a, i, t) => !a.startsWith('--') && !(t[i - 1] ?? '').startsWith('--'));
if (!clave?.includes('/')) { console.error('Uso: node scripts/clases/vista.mjs <curso>/<clase> [--tema ambos]'); process.exit(1); }
const temas = arg('tema', 'ambos') === 'ambos' ? ['claro', 'oscuro'] : [arg('tema')];
const ancho = Number(arg('ancho', '1280'));
const alto = Number(arg('alto', '2200'));
const nCaso = Number(arg('caso', '0'));
const salida = path.resolve(arg('salida', path.join(os.tmpdir(), 'vista-clases')));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const [curso, clase] = clave.split('/');
const json = JSON.parse(readFileSync(arg('archivo') ?? path.join(RAIZ, 'data', 'clases', curso, `${clase}.json`), 'utf8'));

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const cargar = (rel) => import(pathToFileURL(path.join(RAIZ, 'src', rel)).href);
const { VistaNotas } = await cargar('components/estudio/Notas.tsx');
const { VistaInicio, VistaCaso, leerBanco, ordenDe } = await cargar('components/estudio/CasosClinicos.tsx');
const h = React.createElement;

const css = readFileSync(path.join(RAIZ, 'src/styles/estudio/estudio.module.css'), 'utf8').replace(/:global\(([^)]*)\)/g, '$1');

/** Las vistas a pintar: cada una con su envoltorio de /estudio. */
const vistas = [];
if (json.notas) {
  const n = json.notas;
  const toc = n.secciones.map((s, i) => `<button class="${i === 0 ? 'active' : ''}">${s.titulo}</button>`).join('');
  // La barra de pestañas va encima, como en /estudio (fuera de la zona: en oscuro sigue clara).
  const barra = `<div class="study-toolbar"><div class="study-tabs"><button class="study-tab">Resumen</button><button class="study-tab">Práctica</button><button class="study-tab active">Notas</button></div></div>`;
  vistas.push({
    nombre: 'notas',
    html: `${barra}<div class="reading-layout notas-zona"><div class="article-scroller"><article class="article notas">
      <div class="article-topline"><div class="breadcrumb">${curso}<span>/</span><span>${clase}</span></div></div>
      ${renderToStaticMarkup(h(VistaNotas, { nota: n }))}</article></div>
      <aside class="reading-aside"><div class="eyebrow">En estas notas</div><nav class="toc">${toc}</nav></aside></div>`,
  });
}
if (json.casos) {
  const c = json.casos;
  const banco = leerBanco({ titulo: c.titulo, entrada: c.entrada, bloques: c.bloques, questions: c.preguntas });
  const envolver = (marcado) => `<div class="practice-wrap casos"><div class="casos-inner">${marcado}</div></div>`;
  vistas.push({ nombre: 'casos-portada', html: envolver(renderToStaticMarkup(h(VistaInicio, { banco, muestra: null, onEmpezar: () => {} }))) });
  const caso = banco.casos[Math.min(nCaso, banco.casos.length - 1)];
  const orden = ordenDe(caso.id, 1, caso.opciones.length);
  // Respondido con una que falla (o la correcta si no hay otra): se ven los «por qué» y el camino.
  const elegida = caso.opciones.findIndex((o) => !o.correcta);
  vistas.push({
    nombre: `casos-${caso.id}`,
    html: envolver(renderToStaticMarkup(h(VistaCaso, {
      caso, bloques: banco.bloques, lab: '/estudio/laboratorio/x', n: 0, ronda: banco.casos, respuestas: { [caso.id]: elegida }, orden,
      onResponder: () => {}, onSiguiente: () => {}, onSaltar: () => {}, onSalir: () => {},
    }))),
  });
}

const hechas = [];
for (const v of vistas) {
  for (const tema of temas) {
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${css}
* { box-sizing: border-box; }
html, body { margin: 0; font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; }
.wrapper { --font-estudio: 'Outfit'; width: ${ancho}px; min-height: 100vh; }
.study-area { overflow: visible; }
.reading-layout { min-height: 100vh; }
.article-scroller, .reading-aside, .practice-wrap { overflow: visible !important; height: auto !important; }
</style></head>
<body class="${tema === 'oscuro' ? 'dark-mode' : ''}"><div class="wrapper" data-palette="pearl"><section class="study-area">${v.html}</section></div></body></html>`;
    const nombre = `${curso}-${clase}-${v.nombre}-${tema}-${ancho}`;
    const archivoHtml = path.join(salida, `${nombre}.html`);
    const archivoPng = path.join(salida, `${nombre}.png`);
    writeFileSync(archivoHtml, html);
    const perfil = path.join(salida, '.perfil-edge');
    const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${perfil}`, `--window-size=${ancho},${alto}`, '--virtual-time-budget=6000', `--screenshot=${archivoPng}`, pathToFileURL(archivoHtml).href], { encoding: 'utf8', timeout: 90000 });
    if (!existsSync(archivoPng)) { console.error(`  Edge no dejó ${nombre}.png`, r.stderr?.slice(0, 200)); continue; }
    rmSync(archivoHtml);
    hechas.push(archivoPng);
  }
}
try { rmSync(path.join(salida, '.perfil-edge'), { recursive: true, force: true }); } catch {}
console.log(`${hechas.length} imágenes en ${salida}`);
for (const f of hechas) console.log(`  ${f}`);
