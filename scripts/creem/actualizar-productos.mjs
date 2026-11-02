// Edita en Creem los tres productos que ya existen para que cobren lo que dice
// `PLANS` (src/lib/plans.ts), sin crear productos ni cambiar sus IDs.
//
//   CREEM_API_KEY=... node --experimental-strip-types --no-warnings scripts/creem/actualizar-productos.mjs [--aplicar]
//
// Sin `--aplicar` solo muestra lo que cambiaría. Los IDs son los de producción;
// se pueden pisar con las variables `CREEM_PRODUCT_*_ID`. Según la documentación
// de Creem, cambiar `price` crea un precio por defecto nuevo.

import { PLANS, periodoDe } from '../../src/lib/plans.ts';

const aplicar = process.argv.includes('--aplicar');
const key = process.env.CREEM_API_KEY;
if (!key) {
  console.error('Falta CREEM_API_KEY en el entorno.');
  process.exit(1);
}
const BASE = key.startsWith('creem_test_') ? 'https://test-api.creem.io' : 'https://api.creem.io';

const IDS_PRODUCCION = {
  visitante: 'prod_2QSz5lDpuYuwLVsYGVdpS6',
  'residente-12': 'prod_7FWhkLkUYRaHY1DF6KVxGk',
  'especialista-24': 'prod_2HoV8g3rdXHQKkgTAjlQtm',
};

const INCLUYE = 'Incluye el temario de Preclínicos (resúmenes y práctica, en camino), tu universidad como meta, las metas de examen (ENCIB y pronto USMLE Step 1), el laboratorio virtual y, muy pronto, MedGO IA.';

/** El periodo como lo pide Creem. */
function periodoCreem(meses) {
  if (meses === 1) return { billing_period: 'every-month' };
  if (meses === 6) return { billing_period: 'every-six-months' };
  if (meses === 12) return { billing_period: 'every-year' };
  throw new Error(`Creem: ${meses} meses sin periodo conocido`);
}

async function creem(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'x-api-key': key, 'Content-Type': 'application/json' },
  });
  const texto = await res.text();
  if (!res.ok) throw new Error(`Creem ${res.status} ${path}: ${texto}`);
  return JSON.parse(texto);
}

console.log(`Creem ${BASE.includes('test') ? 'PRUEBA' : 'PRODUCCIÓN'}${aplicar ? '' : ' · sin --aplicar: no cambia nada'}\n`);

let fallos = 0;
for (const clave of Object.keys(IDS_PRODUCCION)) {
  const p = PLANS[clave];
  const id = process.env[p.creem.productoEnv] || IDS_PRODUCCION[clave];
  const cada = p.creem.meses;
  const cuerpo = {
    name: cada > 1 ? `MedGO ${p.label} · ${cada} meses` : `MedGO ${p.label}`,
    description: `${cada > 1 ? `Se paga por adelantado cada ${periodoDe(cada)}` : 'Plan mensual, sin permanencia'}; se renueva hasta que canceles. ${INCLUYE}`,
    price: Math.round(p.creem.usd * 100),
    ...periodoCreem(cada),
  };
  try {
    const actual = await creem(`/v1/products?product_id=${encodeURIComponent(id)}`);
    const de = `«${actual.name}» ${actual.price} centavos, ${actual.billing_period}`;
    const a = `«${cuerpo.name}» ${cuerpo.price} centavos, ${cuerpo.billing_period}${cuerpo.recurring_interval_count ? ` (${cuerpo.recurring_interval_count} meses)` : ''}`;
    if (!aplicar) {
      console.log(`~ ${clave} (${id}): ${de} → ${a}`);
      continue;
    }
    await creem(`/v1/products/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(cuerpo) });
    const leido = await creem(`/v1/products?product_id=${encodeURIComponent(id)}`);
    const ok = leido.price === cuerpo.price && leido.name === cuerpo.name;
    console.log(`${ok ? '✓' : '✗ NO QUEDÓ IGUAL:'} ${clave} (${id}): ${de} → «${leido.name}» ${leido.price} centavos, ${leido.billing_period}`);
    if (!ok) fallos++;
  } catch (err) {
    console.error(`✗ ${clave} (${id}): ${err.message}`);
    fallos++;
  }
}
console.log('\nDespués de aplicar, revisa en el panel de Creem que Ciclo cobre cada 6 meses.');
process.exit(fallos ? 1 : 0);
