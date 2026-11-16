// Revisión SIN navegador del lab «Nefrón interactivo» (CLAUDE.md: «render con
// react-dom/server, o Edge sin ventana para degradados y máscaras»).
//
//   npm run vista:nefron [-- --tema claro|oscuro|ambos] [--celulas proximal-s1,principal]
//        [--escenario basal|furosemida|adh-baja] [--salida <carpeta>]
//
// Pinta con Edge sin ventana: el nefrón entero, un acercamiento con las células
// sobre la pared y la vista de pared de cada célula (y la barrera glomerular),
// en claro y oscuro. El filtrado se dibuja con SVG en lugar del canvas; las
// partículas y la animación no se ven. No abre nada para nadie: solo escribe PNG.

import { register } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

register('../gramnegativas/cargador-tsx.mjs', import.meta.url);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const arg = (k, d = null) => { const i = process.argv.indexOf(`--${k}`); return i === -1 ? d : process.argv[i + 1]; };
const temas = arg('tema', 'ambos') === 'ambos' ? ['claro', 'oscuro'] : [arg('tema')];
const salida = path.resolve(arg('salida', path.join(os.tmpdir(), 'vista-nefron')));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!EDGE) { console.error('No encuentro Microsoft Edge.'); process.exit(1); }
mkdirSync(salida, { recursive: true });

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const L = '../../src/app/dashboard/laboratorio/nefron-interactivo';
const { NefronBase, CuentasTramo } = await import(`${L}/EscenaNefron.tsx`);
const { EscenaCelula, EscenaBarrera } = await import(`${L}/EscenaCelula.tsx`);
const { disponer } = await import(`${L}/engine/disposicion.ts`);
const { disponerBarrera } = await import(`${L}/engine/barrera.ts`);
const { calcularEstado, ESCENARIO_BASAL, HORMONAS_BASALES, colorOsm, marcasDe } = await import(`${L}/engine/flujo.ts`);
const { TRAMOS_GEO, TRAMOS, ANCHO, ALTO, polilinea } = await import(`${L}/engine/geometria.ts`);
const { CELULA_LIST } = await import('../../src/lib/data/nefron/celulas.ts');
const { SEGMENTOS } = await import('../../src/lib/data/nefron/segmentos.ts');
const { SUSTANCIAS } = await import('../../src/lib/data/nefron/sustancias.ts');
const { Etiqueta } = await import(`${L}/Glifos.tsx`);
const { ARTERIA } = await import(`${L}/EscenaNefron.tsx`);
const { sombra } = await import(`${L}/engine/paleta.ts`);
const { GLOMERULO } = await import(`${L}/engine/geometria.ts`);
const verRutas = process.argv.includes('--rutas');

const escenarios = {
  basal: ESCENARIO_BASAL,
  furosemida: { ...ESCENARIO_BASAL, farmaco: 'furosemida' },
  'adh-baja': { ...ESCENARIO_BASAL, hormonas: { ...HORMONAS_BASALES, adh: -1 } },
  'adh-alta': { ...ESCENARIO_BASAL, hormonas: { ...HORMONAS_BASALES, adh: 1 } },
};
const nombreEsc = arg('escenario', 'basal');
const escenario = escenarios[nombreEsc] ?? ESCENARIO_BASAL;
const estado = calcularEstado(escenario);
const vistaMarcas = escenario.farmaco ? 'farmacos' : 'otra';
const marcas = marcasDe(escenario, vistaMarcas);
const pedidas = arg('celulas') ? arg('celulas').split(',') : CELULA_LIST.map((c) => c.id);

// CSS del lab con el dark-mode del módulo (las clases conservan su nombre con el cargador).
const css = readFileSync(path.join(RAIZ, 'src/styles/nefron.module.css'), 'utf8').replace(/:global\(([^)]+)\)/g, '$1');
const h = React.createElement;
const nada = () => {};

/** El filtrado como en el canvas, pero en SVG. */
function filtrado() {
  const p = estado.perfil;
  const trozos = [];
  TRAMOS.forEach((id, i) => {
    const t = TRAMOS_GEO[id];
    const ms = t.muestras;
    for (let k = 0; k < ms.length - 1; k += 5) {
      const k2 = Math.min(ms.length - 1, k + 6);
      const u = (k + k2) / 2 / (ms.length - 1);
      const vol = p.vol[i] + (p.vol[i + 1] - p.vol[i]) * u;
      const o = p.osm[i] + (p.osm[i + 1] - p.osm[i]) * u;
      const w = t.luz * Math.min(0.9, Math.max(0.22, Math.sqrt(vol / 100) * 1.5));
      trozos.push(`<polyline points="${polilinea(ms.slice(k, k2 + 1))}" fill="none" stroke="${colorOsm(o, 0.62)}" stroke-width="${w.toFixed(2)}" stroke-linecap="round"/>`);
    }
  });
  return trozos.join('');
}

/** Una burbuja fija a una fracción u de la ruta, con su halo (como en el canvas). */
function burbujaSvg(ruta, u, s, r) {
  const L = [];
  let total = 0;
  for (let i = 1; i < ruta.length; i++) { const l = Math.hypot(ruta[i][0] - ruta[i - 1][0], ruta[i][1] - ruta[i - 1][1]); L.push(l); total += l; }
  let dd = u * total;
  let [x, y] = ruta[0];
  for (let i = 0; i < L.length; i++) {
    if (dd <= L[i]) { const k = dd / L[i]; x = ruta[i][0] + (ruta[i + 1][0] - ruta[i][0]) * k; y = ruta[i][1] + (ruta[i + 1][1] - ruta[i][1]) * k; break; }
    dd -= L[i];
  }
  const su = SUSTANCIAS[s];
  const fs = r * (su.simbolo.length > 4 ? 0.62 : su.simbolo.length > 3 ? 0.74 : 0.9);
  return `<circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="${su.color}" opacity="0.26"/><circle cx="${x}" cy="${y}" r="${r}" fill="${su.color}"/>`
    + `<text x="${x}" y="${y}" dy="0.35em" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${su.textoOscuro ? '#1c2233' : '#fff'}">${su.simbolo}</text>`;
}

/** Glóbulos rojos fijos en el capilar, como los del canvas (globuloRojo). */
function globulos(d) {
  const yc = (d.capilar.y0 + d.capilar.y1) / 2;
  let out = '';
  for (let k = 0; k < 9; k++) {
    const x = 40 + (k * d.W) / 9;
    const y = yc + ((k % 3) - 1) * 26 + (k % 2 ? 6 : -4);
    const r = 24;
    const m = k % 3 === 1;
    const c = m ? '#d6339b' : '#f0304f';
    const so = m ? '#8f1f72' : '#a8163a';
    const b = m ? '#f27cc4' : '#ff6f7f';
    if (k % 3 === 2) out += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.26}" fill="${c}" transform="rotate(28 ${x} ${y})"/>`;
    else {
      out += `<ellipse cx="${x + 2}" cy="${y + 3}" rx="${r}" ry="${r * 0.86}" fill="${so}"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.86}" fill="${c}"/>`
        + `<ellipse cx="${x}" cy="${y}" rx="${r * 0.62}" ry="${r * 0.52}" fill="${b}"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.4}" ry="${r * 0.34}" fill="${so}"/>`;
    }
  }
  return out;
}

const lienzos = [];
const base = renderToStaticMarkup(h('svg', { xmlns: 'http://www.w3.org/2000/svg' },
  h(NefronBase, { osmPunta: estado.perfil.osmPunta, vasos: true, cortical: true, gradiente: true, halos: [] })));
const interior = base.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
/** Etiquetas de los segmentos, como las de la capa de arriba del lienzo. */
const etiquetas = (fs) => renderToStaticMarkup(h('svg', null,
  ...TRAMOS.map((id) => h(Etiqueta, {
    key: id, x: TRAMOS_GEO[id].rotulo.p[0], y: TRAMOS_GEO[id].rotulo.p[1] - fs * 0.35, texto: SEGMENTOS[id].corto,
    tam: fs * 0.9, color: sombra(SEGMENTOS[id].color), ancla: TRAMOS_GEO[id].rotulo.ancla,
  })),
  h(Etiqueta, { key: 'g', x: GLOMERULO.c[0] - GLOMERULO.r - 10, y: GLOMERULO.c[1], texto: 'Glomérulo', tam: fs * 0.9, color: sombra(ARTERIA), ancla: 'end' }),
)).replace(/^<svg>/, '').replace(/<\/svg>$/, '');
lienzos.push({ nombre: 'nefron-entero', W: 1200, H: 1000, vb: `0 0 ${ANCHO} ${ALTO}`, svg: interior + filtrado() + etiquetas(13) });

// Acercamiento: rama gruesa y distal junto al glomérulo, con células.
const cuentas = ['proximal', 'gruesa', 'distal', 'conector', 'colector-cortical'].map((id) => renderToStaticMarkup(
  h('svg', null, h(CuentasTramo, { tramo: id, detalle: true, marcadas: '', elegida: null, onCuenta: nada, onSenalar: nada })),
).replace(/^<svg>/, '').replace(/<\/svg>$/, '')).join('');
lienzos.push({ nombre: 'zoom-celulas', W: 1200, H: 800, vb: '300 40 450 300', svg: interior + cuentas + filtrado() + etiquetas(13 / 2.7) });

for (const id of pedidas) {
  for (const estrecha of [false, true]) {
    let svg;
    let W; let H;
    if (id === 'barrera') {
      const d = disponerBarrera(estrecha);
      W = d.W; H = d.H;
      svg = renderToStaticMarkup(h('svg', null, h(EscenaBarrera, {
        d, elegido: 'mbg', senalado: null, onElegir: nada, onSenalar: nada, tfg: { pcg: 55, pb: 15, pic: 30, tfg: 125 },
      })));
    } else {
      const d = disponer(id, estrecha);
      W = d.W; H = d.H;
      svg = renderToStaticMarkup(h('svg', null, h(EscenaCelula, {
        celula: id, d, factores: estado.factores, marcas, elegido: d.glifos[0]?.t ?? null, senalado: null,
        onElegir: nada, onSenalar: nada, onVecina: nada,
      })));
      // Un fotograma fijo: glóbulos rojos y una burbuja por corriente. Con --rutas, los trayectos.
      const extra = verRutas
        ? d.corrientes.map((c) => `<polyline points="${c.ruta.map((q) => q.join(',')).join(' ')}" fill="none" stroke="#3b9edd" stroke-width="2" stroke-dasharray="6 6" opacity="0.6"/>`).join('')
        : globulos(d) + d.corrientes.map((c, i) => burbujaSvg(c.ruta, 0.2 + ((i * 0.37) % 0.6), c.s, d.estrecha ? 15 : 13)).join('');
      svg = svg.replace(/<\/svg>$/, extra + '</svg>');
    }
    lienzos.push({ nombre: `${id}${estrecha ? '-telefono' : ''}`, W, H, vb: `0 0 ${W} ${H}`, svg: svg.replace(/^<svg>/, '').replace(/<\/svg>$/, '') });
  }
}

const perfil = path.join(os.tmpdir(), `edge-vista-nefron-${process.pid}`);
const hechos = [];
for (const tema of temas) {
  for (const l of lienzos) {
    const ancho = l.W > l.H ? 1200 : 760;
    const alto = Math.round((ancho * l.H) / l.W);
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
${css}
html,body{margin:0;background:${tema === 'oscuro' ? '#0b0f1d' : '#eef2f8'};font-family:Outfit,system-ui,sans-serif}
.marco{position:relative;width:${ancho}px;height:${alto}px}
</style></head><body class="${tema === 'oscuro' ? 'dark-mode' : ''}"><div class="marco"><div class="lienzo"><svg class="svg" viewBox="${l.vb}" preserveAspectRatio="xMidYMid meet">${l.svg}</svg></div></div></body></html>`;
    const nombre = `${l.nombre}-${nombreEsc}-${tema}`;
    const archivoHtml = path.join(salida, `${nombre}.html`);
    const archivoPng = path.join(salida, `${nombre}.png`);
    writeFileSync(archivoHtml, html);
    const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${perfil}`, `--window-size=${ancho},${alto}`, '--virtual-time-budget=3000', `--screenshot=${archivoPng}`, pathToFileURL(archivoHtml).href], { encoding: 'utf8', timeout: 90000 });
    if (!existsSync(archivoPng)) { console.error(`✗ ${nombre}: Edge no escribió la captura`, r.stderr?.slice(0, 300)); continue; }
    rmSync(archivoHtml);
    hechos.push(archivoPng);
  }
}
try { rmSync(perfil, { recursive: true, force: true }); } catch { /* ignore */ }
console.log(`✓ ${hechos.length} capturas en ${salida}`);
