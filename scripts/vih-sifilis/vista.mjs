/**
 * Revisión SIN navegador de las láminas de «VIH y sífilis»
 * (CLAUDE.md: «render con react-dom/server, o Edge sin ventana para degradados y máscaras»).
 *
 *   node scripts/vih-sifilis/vista.mjs --caps 0,1 [--pasos 0,3] [--tema claro|oscuro|ambos]
 *        [--p 1] [--cero a,b] [--parcial a=0.5] [--reloj 2000] [--salida <carpeta>] [--por-hoja 4] [--ancho 800|1600] [--fotos <carpeta>]
 *
 * Pinta cada lámina con todos sus parámetros en `--p` (1 = estado final) dentro del mismo
 * lienzo de 1600 × 1000 (fondo y variables de color de claro u oscuro, y la variante de la
 * sífilis desde el capítulo 15, como en el lab) y deja hojas de contacto PNG (2 × 2 por
 * defecto, 800 × 500 por lámina) hechas con Edge sin ventana. No abre nada para nadie: solo
 * escribe imágenes. Límite honesto: la tipografía Outfit puede caer a una de respaldo y lo
 * animado (movimiento, voz) no se ve. Con `--p 0.5` se ve cómo va a medias.
 */

import { register } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('./cargador-tsx.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? d : process.argv[i + 1]; };
const caps = (arg('caps') ?? '0').split(',').map(Number);
const pasosPedidos = arg('pasos') ? arg('pasos').split(',').map(Number) : null;
const temas = arg('tema', 'ambos') === 'ambos' ? ['claro', 'oscuro'] : [arg('tema')];
const valorP = Number(arg('p', '1'));
// `--cero a,b`: esos parámetros en 0 (para ver una fase anterior de la lámina); `--parcial a=0.5,b=0.2`: valores sueltos.
const ceros = (arg('cero') ?? '').split(',').filter(Boolean);
const parciales = Object.fromEntries((arg('parcial') ?? '').split(',').filter(Boolean).map((kv) => { const [k, v] = kv.split('='); return [k, Number(v)]; }));
const valorDe = (n) => (ceros.includes(n) ? 0 : (n in parciales ? parciales[n] : valorP));
const reloj = Number(arg('reloj', '2000'));
const ancho = Number(arg('ancho', '800')); // ancho de cada lámina (1600 = tamaño real, de una en una)
const alto = Math.round(ancho * 0.625);
const cols = ancho >= 1200 ? 1 : 2;
const porHoja = Number(arg('por-hoja', ancho >= 1200 ? '1' : '4'));
const lab = arg('lab', 'vih-sifilis');
const salida = path.resolve(arg('salida', path.join(os.tmpdir(), 'vista-vih-sifilis')));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');

// Variables de color: las de `.lienzo` (claro) y `.dark-mode .lienzo` (oscuro) del CSS del lab, y las de
// la variante de la sífilis (`.lienzo.sifilis`) que se aplican encima desde el capítulo 15.
const cssLab = readFileSync(path.join(RAIZ, 'src/styles/vihSifilis.module.css'), 'utf8');
const vars = (bloque) => (bloque ?? '').split('\n').filter((l) => /^\s*--[\w-]+:/.test(l)).map((l) => l.trim()).join(' ');
const bloque = (re) => cssLab.match(re)?.[1];
const VARS = {
  claro: vars(bloque(/\.lienzo \{([\s\S]*?)\}/)),
  oscuro: vars(bloque(/:global\(\.dark-mode\) \.lienzo \{([\s\S]*?)\}/)),
  claroSif: vars(bloque(/\.lienzo\.sifilis \{([\s\S]*?)\}/)),
  oscuroSif: vars(bloque(/:global\(\.dark-mode\) \.lienzo\.sifilis \{([\s\S]*?)\}/)),
};
const variablesDe = (tema, cap) => `${tema === 'oscuro' ? VARS.oscuro : VARS.claro} ${cap >= 15 ? (tema === 'oscuro' ? VARS.oscuroSif : VARS.claroSif) : ''}`;

// Fotos: las láminas piden `<id>_<versión>.avif` al bucket de Supabase; aquí se leen de la carpeta local de fotos
// (`--fotos <carpeta>`, por defecto Descargasotos-vih-sifilis): primero la optimizada por BUST (`optimizadas/*.avif`) y, si
// aún no existe, la PNG sin comprimir que deja `preparar-fotos.mjs` en `para-optimizar/`.
const dirFotos = arg('fotos', 'C:/Users/BUST/Downloads/fotos-vih-sifilis');
const fotosLocales = (svg) => svg.replace(/href="[^"]*\/vih-sifilis\/fotos\/([a-z0-9-]+_v\d+)\.avif"/g, (m, nombre) => {
  for (const [sub, ext] of [['optimizadas', 'avif'], ['para-optimizar', 'png']]) {
    const f = path.join(dirFotos, sub, `${nombre}.${ext}`);
    if (existsSync(f)) return `href="${pathToFileURL(f).href}"`;
  }
  return m;
});

const celdas = []; // { cap, paso, svg }
for (const cap of caps) {
  const ruta = path.join(RAIZ, `src/app/dashboard/laboratorio/${lab}/laminas/c${cap}.tsx`);
  const { default: LAMINAS } = await import(pathToFileURL(ruta).href);
  LAMINAS.forEach((L, paso) => {
    if (pasosPedidos && !pasosPedidos.includes(paso)) return;
    let svg;
    try {
      // identifierPrefix: cada lámina tiene sus propios ids (useId), porque en una hoja de contacto comparten documento
      svg = renderToStaticMarkup(React.createElement(L, { p: valorDe, reloj }), { identifierPrefix: `v${cap}-${paso}-` });
      svg = fotosLocales(svg);
    } catch (e) {
      svg = `<text x="40" y="120" font-size="36" fill="#c00">ERROR c${cap}.${paso}: ${String(e.message).slice(0, 120).replace(/[<&]/g, '')}</text>`;
      console.error(`  ERROR c${cap}.${paso}: ${e.message}`);
    }
    celdas.push({ cap, paso, svg });
  });
}

// CSS de los módulos que usan las piezas (sus clases conservan el nombre). El hook del cargador corre en otro
// hilo, así que la lista va fija: los mismos que importan las `Piezas.tsx` de los labs de los que se reexporta.
const cssModulos = ['citopenias', 'vasculitis', 'gramnegativas', 'bilirrubina', 'vihSifilis'].map((n) => readFileSync(path.join(RAIZ, `src/styles/${n}.module.css`), 'utf8').replace(/:global\(([^)]*)\)/g, '$1')).join('\n');
const base = `
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Outfit', 'Segoe UI', Arial, sans-serif; background: #888; }
.hoja { display: grid; grid-template-columns: repeat(${cols}, ${ancho}px); grid-auto-rows: ${alto}px; gap: 0; width: ${cols * ancho}px; }
.celda { position: relative; width: ${ancho}px; height: ${alto}px; overflow: hidden; }
.etq { position: absolute; left: 8px; bottom: 6px; z-index: 5; font: 700 15px Arial, sans-serif; color: #fff; background: rgba(20,10,40,.7); padding: 2px 7px; border-radius: 4px; }
.celda .lienzo { position: absolute; inset: 0; }
`;

const hojas = [];
for (const tema of temas) {
  for (let i = 0; i < celdas.length; i += porHoja) {
    const lote = celdas.slice(i, i + porHoja);
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${cssModulos}\n${base}</style></head>
<body class="${tema === 'oscuro' ? 'dark-mode' : ''}"><div class="hoja">${lote.map((c) => `<div class="celda"><div class="lienzo" style="${variablesDe(tema, c.cap)} background: linear-gradient(165deg, var(--vs-fondo-a), var(--vs-fondo-b));"><svg class="svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;display:block;overflow:visible">${c.svg}</svg></div><span class="etq">c${c.cap}.${c.paso} · ${tema}</span></div>`).join('')}</div></body></html>`;
    const nombre = `${tema}-c${lote[0].cap}p${lote[0].paso}${ancho >= 1200 ? 'z' : ''}`;
    const archivoHtml = path.join(salida, `${nombre}.html`);
    const archivoPng = path.join(salida, `${nombre}.png`);
    writeFileSync(archivoHtml, html);
    const filas = Math.ceil(lote.length / cols);
    const perfil = path.join(salida, '.perfil-edge');
    const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${perfil}`, `--window-size=${cols * ancho},${filas * alto}`, '--virtual-time-budget=6000', `--screenshot=${archivoPng}`, pathToFileURL(archivoHtml).href], { encoding: 'utf8', timeout: 90000 });
    if (!existsSync(archivoPng)) { console.error(`  Edge no dejó ${nombre}.png`, r.stderr?.slice(0, 200)); continue; }
    rmSync(archivoHtml);
    hojas.push(archivoPng);
  }
}
try { rmSync(path.join(salida, '.perfil-edge'), { recursive: true, force: true }); } catch {}
console.log(`${celdas.length} láminas · ${hojas.length} hojas en ${salida}`);
for (const h of hojas) console.log(`  ${h}`);
