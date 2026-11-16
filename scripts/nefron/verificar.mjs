// Verificador del lab «Nefrón interactivo» (sin navegador).
//
//   npm run verificar:nefron [-- --perfiles]
//
// Comprueba que los datos casen entre sí (todo transportador de una célula
// existe, toda diana de fármaco, hormona o síndrome existe y está en alguna
// célula, toda ficha tiene su `esencial`), que la geometría quede dentro del
// lienzo y que el modelo del filtrado dé cifras dentro de rangos fisiológicos
// en los escenarios clave. Con --perfiles imprime la tabla de cada escenario.

import { register } from 'node:module';

register('../gramnegativas/cargador-tsx.mjs', import.meta.url);

const { CELULAS, CELULA_LIST } = await import('../../src/lib/data/nefron/celulas.ts');
const { TRANSPORTADORES, TRANSPORTADOR_LIST } = await import('../../src/lib/data/nefron/transportadores.ts');
const { SEGMENTOS, SEGMENTO_LIST, TRAMOS } = await import('../../src/lib/data/nefron/segmentos.ts');
const { HORMONA_LIST } = await import('../../src/lib/data/nefron/hormonas.ts');
const { FARMACO_LIST, FARMACOS } = await import('../../src/lib/data/nefron/farmacos.ts');
const { SINDROME_LIST, SINDROMES } = await import('../../src/lib/data/nefron/clinico.ts');
const { SUSTANCIAS } = await import('../../src/lib/data/nefron/sustancias.ts');
const { calcularEstado, ESCENARIO_BASAL, HORMONAS_BASALES } = await import('../../src/app/dashboard/laboratorio/nefron-interactivo/engine/flujo.ts');
const { TRAMOS_GEO, CUENTAS, RUTA, ANCHO, ALTO, cuentaDe } = await import('../../src/app/dashboard/laboratorio/nefron-interactivo/engine/geometria.ts');
const { disponer } = await import('../../src/app/dashboard/laboratorio/nefron-interactivo/engine/disposicion.ts');

const errores = [];
const err = (m) => errores.push(m);

// ── Datos ──
const enAlguna = new Set();
for (const c of CELULA_LIST) {
  for (const t of [...c.apical, ...c.basolateral, ...c.interior]) {
    if (!TRANSPORTADORES[t]) err(`Célula ${c.id}: transportador «${t}» no existe`);
    enAlguna.add(t);
  }
  if (!SEGMENTOS[c.segmento]) err(`Célula ${c.id}: segmento «${c.segmento}» no existe`);
  for (const v of c.vecinas) if (!CELULAS[v]) err(`Célula ${c.id}: vecina «${v}» no existe`);
  for (const s of c.paracelular?.sustancias ?? []) if (!SUSTANCIAS[s]) err(`Célula ${c.id}: sustancia «${s}»`);
  if (!c.esencial?.funcion || !c.esencial?.perla) err(`Célula ${c.id}: falta esencial`);
}
for (const t of TRANSPORTADOR_LIST) {
  if (!enAlguna.has(t.id)) err(`Transportador ${t.id} no está en ninguna célula`);
  for (const m of t.mueve) if (!SUSTANCIAS[m.s]) err(`Transportador ${t.id}: sustancia «${m.s}»`);
  if (!t.esencial?.hace || !t.esencial?.siFalla || !t.esencial?.perla) err(`Transportador ${t.id}: falta esencial`);
  for (const f of t.farmacos ?? []) if (!FARMACOS[f]) err(`Transportador ${t.id}: fármaco «${f}»`);
  for (const s of t.sindromes ?? []) if (!SINDROMES[s]) err(`Transportador ${t.id}: síndrome «${s}»`);
}
for (const s of SEGMENTO_LIST) {
  for (const c of [...s.celulas, ...s.secuencia]) if (!CELULAS[c]) err(`Segmento ${s.id}: célula «${c}»`);
  for (const t of s.esencial.claves) if (!TRANSPORTADORES[t]) err(`Segmento ${s.id}: clave «${t}»`);
  for (const r of s.reabsorbe) if (!SUSTANCIAS[r.s]) err(`Segmento ${s.id}: sustancia «${r.s}»`);
}
const comprobarEfectos = (de, lista) => {
  for (const e of lista) {
    if (!TRANSPORTADORES[e.t]) { err(`${de}: diana «${e.t}» no existe`); continue; }
    const celulas = CELULA_LIST.filter((c) => [...c.apical, ...c.basolateral, ...c.interior].includes(e.t)
      && (!e.en || e.en.includes(c.id)));
    if (!celulas.length) err(`${de}: «${e.t}» no está en ninguna de las células indicadas`);
    for (const c of e.en ?? []) if (!CELULAS[c]) err(`${de}: célula «${c}»`);
  }
};
for (const h of HORMONA_LIST) comprobarEfectos(`Hormona ${h.id}`, h.efectos);
for (const f of FARMACO_LIST) {
  comprobarEfectos(`Fármaco ${f.id}`, f.dianas);
  if (!CELULAS[f.celula]) err(`Fármaco ${f.id}: célula «${f.celula}»`);
}
for (const s of SINDROME_LIST) {
  comprobarEfectos(`Síndrome ${s.id}`, s.dianas);
  if (!CELULAS[s.celula]) err(`Síndrome ${s.id}: célula «${s.celula}»`);
}

// ── Geometría ──
const dentro = ([x, y], m = 0) => x >= -m && x <= ANCHO + m && y >= -m && y <= ALTO + m;
for (const id of TRAMOS) {
  for (const m of TRAMOS_GEO[id].muestras) if (!dentro(m.p)) { err(`Tramo ${id} sale del lienzo en ${m.p}`); break; }
  if (!CUENTAS[id].length) err(`Tramo ${id} sin células`);
}
for (const c of CELULA_LIST) if (c.id !== 'barrera' && !cuentaDe(c.id)) err(`Célula ${c.id}: ninguna cuenta en la pared`);
for (const c of CELULA_LIST) {
  for (const estrecha of [false, true]) {
    const d = disponer(c.id, estrecha);
    for (const g of d.glifos) if (g.x < 0 || g.x > d.W || g.y < 0 || g.y > d.H) err(`Célula ${c.id}: glifo ${g.t} fuera (${estrecha ? 'estrecha' : 'ancha'})`);
    for (const k of d.corrientes) for (const p of k.ruta) if (p[1] < 0 || p[1] > d.H) err(`Célula ${c.id}: corriente ${k.clave} fuera`);
    if (d.apicalY < 120) err(`Célula ${c.id}: poca luz (${d.apicalY})`);
  }
}

// ── Modelo del filtrado ──
const esc = (cambios) => ({ ...ESCENARIO_BASAL, ...cambios, hormonas: { ...HORMONAS_BASALES, ...(cambios.hormonas ?? {}) } });
const casos = [
  ['Basal', esc({}), { ml: [0.6, 2], osm: [450, 800] }],
  ['ADH alta', esc({ hormonas: { adh: 1 } }), { ml: [0.3, 0.8], osm: [1000, 1250] }],
  ['ADH suprimida', esc({ hormonas: { adh: -1 } }), { ml: [8, 18], osm: [50, 120] }],
  ['Furosemida', esc({ farmaco: 'furosemida' }), { ml: [6, 25], osm: [200, 380], na: [0.12, 0.3], ca: [0.1, 1] }],
  ['Tiazida', esc({ farmaco: 'tiazida' }), { ml: [1, 4], na: [0.03, 0.09], caMax: 0.01 }],
  ['Gliflozina', esc({ farmaco: 'gliflozina' }), { glu: [0.3, 0.65] }],
  ['Acetazolamida', esc({ farmaco: 'acetazolamida' }), { hco3: [0.25, 0.7] }],
  ['Amilorida', esc({ farmaco: 'amilorida' }), { kMax: 0.15 }],
  ['Manitol', esc({ farmaco: 'manitol' }), { ml: [3, 30] }],
  ['Fanconi', esc({ sindrome: 'fanconi' }), { glu: [0.4, 1], hco3: [0.15, 1] }],
  ['DI central', esc({ sindrome: 'di-central' }), { ml: [8, 18], osm: [50, 120] }],
  ['DI nefrogénica', esc({ sindrome: 'di-nefrogenica' }), { ml: [4, 18], osm: [50, 180] }],
  ['SIADH', esc({ sindrome: 'siadh' }), { osm: [1000, 1250] }],
  ['Conn', esc({ sindrome: 'conn' }), { kMin: 0.2 }],
  ['Gitelman', esc({ sindrome: 'gitelman' }), { caMax: 0.01 }],
  ['Bartter', esc({ sindrome: 'bartter' }), { ca: [0.08, 1] }],
];
const filas = [];
for (const [nombre, e, rango] of casos) {
  const { perfil } = calcularEstado(e);
  const o = perfil.orina;
  const fila = {
    caso: nombre,
    'mL/min': o.mlMin.toFixed(2),
    mOsm: Math.round(o.osm),
    punta: Math.round(perfil.osmPunta),
    'FE Na': (o.fe.na * 100).toFixed(1) + ' %',
    'FE K': (o.fe.k * 100).toFixed(0) + ' %',
    'FE Ca': (o.fe.ca * 100).toFixed(1) + ' %',
    'FE glu': (o.fe.glucosa * 100).toFixed(0) + ' %',
    'FE HCO₃': (o.fe.hco3 * 100).toFixed(0) + ' %',
  };
  filas.push(fila);
  const fuera = (v, [a, b]) => v < a || v > b;
  if (rango.ml && fuera(o.mlMin, rango.ml)) err(`${nombre}: orina ${o.mlMin.toFixed(2)} mL/min fuera de ${rango.ml}`);
  if (rango.osm && fuera(o.osm, rango.osm)) err(`${nombre}: ${Math.round(o.osm)} mOsm/kg fuera de ${rango.osm}`);
  if (rango.na && fuera(o.fe.na, rango.na)) err(`${nombre}: FE Na ${o.fe.na.toFixed(3)} fuera de ${rango.na}`);
  if (rango.ca && fuera(o.fe.ca, rango.ca)) err(`${nombre}: FE Ca ${o.fe.ca.toFixed(3)} fuera de ${rango.ca}`);
  if (rango.caMax !== undefined && o.fe.ca > rango.caMax) err(`${nombre}: FE Ca ${o.fe.ca.toFixed(3)} > ${rango.caMax}`);
  if (rango.glu && fuera(o.fe.glucosa, rango.glu)) err(`${nombre}: FE glucosa ${o.fe.glucosa.toFixed(2)} fuera de ${rango.glu}`);
  if (rango.hco3 && fuera(o.fe.hco3, rango.hco3)) err(`${nombre}: FE HCO₃ ${o.fe.hco3.toFixed(2)} fuera de ${rango.hco3}`);
  if (rango.kMax !== undefined && o.fe.k > rango.kMax) err(`${nombre}: FE K ${o.fe.k.toFixed(2)} > ${rango.kMax}`);
  if (rango.kMin !== undefined && o.fe.k < rango.kMin) err(`${nombre}: FE K ${o.fe.k.toFixed(2)} < ${rango.kMin}`);
  for (const k of Object.keys(perfil.rem)) {
    if (perfil.rem[k].some((v) => !Number.isFinite(v))) err(`${nombre}: ${k} no finito`);
  }
}
const basal = calcularEstado(ESCENARIO_BASAL).perfil;
if (process.argv.includes('--perfiles')) {
  console.table(filas);
  console.log('Basal, por nodo: vol', basal.vol.map((v) => v.toFixed(1)).join(' '), '| osm', basal.osm.map((v) => Math.round(v)).join(' '));
  console.log(`Ruta: ${Math.round(RUTA.largo)} u, ${RUTA.muestras.length} muestras; células: ${TRAMOS.map((t) => CUENTAS[t].length).reduce((a, b) => a + b, 0)}`);
}

if (errores.length) {
  console.error(`✗ ${errores.length} problema(s):`);
  for (const e of errores) console.error('  · ' + e);
  process.exit(1);
}
console.log(`✓ Nefrón: ${CELULA_LIST.length} células, ${TRANSPORTADOR_LIST.length} transportadores, ${FARMACO_LIST.length} fármacos, ${SINDROME_LIST.length} síndromes; ${casos.length} escenarios en rango.`);
