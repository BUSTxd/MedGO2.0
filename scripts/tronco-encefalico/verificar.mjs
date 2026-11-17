// Verifica el lab «Tronco encefálico 3D» sin navegador.
//
//   npm run verificar:tronco
//
// 1. Clínica: cada estructura interior que explica un signo cae dentro de la
//    lesión de su síndrome; avisa (sin fallar) de las que la lesión toca sin
//    estar en la lista.
// 2. Nervios: cada raíz nace en la superficie del modelo y su recorrido sale
//    del tronco.
// 3. Superficie: toda zona etiquetada de la malla tiene ficha.
// 4. Interior: cada núcleo cae dentro del tronco; cada corte muestra algo.

import { crearCampo, reflejar } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/sdf.ts';
import { campoTronco, refinarTronco } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/forma.ts';
import { mallar } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/malla.ts';
import { INTERIOR, INTERIOR_LIST } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/interior.ts';
import { NERVIOS } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/nervios.ts';
import { SINDROMES } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/clinica.ts';
import { ESTRUCTURAS, estructuraDe } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/anatomia.ts';
import { NIVELES, calcularCorte } from '../../src/app/dashboard/laboratorio/tronco-encefalico/engine/cortes.ts';

let fallos = 0;
const fallo = (m) => { fallos++; console.log(`  ✗ ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);
const aviso = (m) => console.log(`  · ${m}`);

const tronco = campoTronco();

// Volúmenes interiores de cada lado.
const vol = new Map();
for (const x of INTERIOR_LIST) {
  vol.set(`${x.id}|i`, crearCampo(x.prims, 0.05));
  if (!x.impar) vol.set(`${x.id}|d`, crearCampo(x.prims.map(reflejar), 0.05));
}

/** Puntos de la rejilla dentro de la lesión (cada 0,03 cm). */
function puntosLesion(s) {
  const c = crearCampo(s.lesion, 0.02);
  const { min, max } = c.limites;
  const pts = [];
  for (let x = min[0]; x <= max[0]; x += 0.03)
    for (let y = min[1]; y <= max[1]; y += 0.03)
      for (let z = min[2]; z <= max[2]; z += 0.03)
        if (c.d(x, y, z) < 0) pts.push([x, y, z]);
  return pts;
}

console.log('\n1. Síndromes');
for (const s of SINDROMES) {
  const pts = puntosLesion(s);
  const lados = s.medial ? ['i', 'd'] : ['i'];
  const tocadas = new Map();
  for (const [clave, campo] of vol) {
    const [id, lado] = clave.split('|');
    const copias = new Set(s.signos.filter((g) => g.id === id).map((g) => g.copia ?? 'i'));
    if (!lados.includes(lado) && !copias.has(lado) && !INTERIOR[id].impar) continue;
    let n = 0;
    for (const p of pts) if (campo.d(...p) < 0) n++;
    if (n) tocadas.set(id, Math.max(tocadas.get(id) ?? 0, n));
  }
  const errores = [];
  for (const g of s.signos) {
    if (!INTERIOR[g.id]) {
      if (!ESTRUCTURAS[g.id]) errores.push(`«${g.id}» no existe`);
      continue; // estructura de superficie: no tiene volumen interior
    }
    const copia = s.medial ? null : (g.copia ?? 'i');
    const campo = copia ? vol.get(`${g.id}|${INTERIOR[g.id].impar ? 'i' : copia}`) : null;
    const alcanza = campo ? pts.some((p) => campo.d(...p) < 0) : tocadas.has(g.id);
    if (!alcanza) errores.push(`la lesión no alcanza ${g.id}${copia === 'd' ? ' (copia derecha)' : ''}`);
  }
  if (errores.length) errores.forEach((e) => fallo(`${s.corto}: ${e}`));
  else ok(`${s.corto}: ${s.signos.length} signos, todos dentro de la lesión`);
  const nombradas = new Set(s.signos.map((g) => g.id));
  const extra = [...tocadas.keys()].filter((id) => !nombradas.has(id) && !INTERIOR[id].velo);
  if (extra.length) aviso(`${s.corto} también toca: ${extra.join(', ')}`);
}

console.log('\n2. Pares craneales');
for (const n of NERVIOS) {
  const errores = [];
  for (const r of n.raices) {
    if (!r.dir.some((v) => v !== 0)) continue; // continuación de otra raíz
    if (tronco.d(...r.desde) >= 0) errores.push(`arranque fuera del tronco ${JSON.stringify(r.desde)}`);
    const fin = r.pts[r.pts.length - 1];
    if (tronco.d(...fin) <= 0) errores.push(`termina dentro del tronco ${JSON.stringify(fin)}`);
  }
  if (errores.length) errores.forEach((e) => fallo(`${n.id}: ${e}`));
  else ok(`${n.id} ${n.nombre}: ${n.raices.length} raíces`);
}

console.log('\n3. Superficie');
const t0 = performance.now();
const m = mallar(tronco, { h: 0.045, refinar: refinarTronco, ao: false });
const sinFicha = m.etiquetas.filter((e) => !estructuraDe(e));
if (sinFicha.length) fallo(`zonas sin ficha: ${sinFicha.join(', ')}`);
else ok(`${m.etiquetas.length} zonas, todas con ficha (${(m.pos.length / 3).toLocaleString('es')} vértices, ${(performance.now() - t0).toFixed(0)} ms)`);
const sinZona = Object.keys(ESTRUCTURAS).filter((id) => !m.etiquetas.some((e) => estructuraDe(e)?.id === id));
const delCerebelo = new Set(['hemisferio_cerebeloso', 'vermis', 'amigdala_cerebelosa', 'floculo']);
const huerfanas = sinZona.filter((id) => !delCerebelo.has(id));
if (huerfanas.length) fallo(`fichas sin zona en el modelo: ${huerfanas.join(', ')}`);

console.log('\n4. Interior y cortes');
for (const x of INTERIOR_LIST) {
  const p = x.prims[0];
  const c = p.tipo === 'elipsoide' ? p.c : p.pts[Math.floor(p.pts.length / 2)];
  // La sustancia gris periacueductal rodea el acueducto: se mira un poco al lado.
  const prueba = [c, [c[0] + 0.12, c[1], c[2]]];
  if (prueba.every((q) => tronco.d(...q) > 0)) fallo(`${x.id}: su centro cae fuera del tronco ${JSON.stringify(c)}`);
}
for (const n of NIVELES) {
  const c = calcularCorte(n.y, 40);
  const ids = new Set(c.ids.filter((x) => x.id).map((x) => x.id));
  if (ids.size < 4) fallo(`${n.nombre}: solo ${ids.size} estructuras`);
  else ok(`${n.nombre}: ${ids.size} estructuras`);
}

console.log(fallos ? `\n${fallos} fallo(s).` : '\nTodo en orden.');
process.exit(fallos ? 1 : 0);
