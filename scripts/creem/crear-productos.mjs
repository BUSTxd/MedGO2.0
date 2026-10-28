// Crea en Creem (merchant of record, pagos fuera del Perú) los tres planes de
// MedGO. Como Creem no tiene permanencia, Residente y Especialista se cobran
// por adelantado: un cobro al año y uno cada dos años (decisión de BUST,
// 2026-10-28). Los precios en soles (Mercado Pago) siguen en `PLANS`.
//
//   CREEM_API_KEY=... node scripts/creem/crear-productos.mjs [--dry]
//
// Una clave `creem_test_…` usa el entorno de prueba; cualquier otra, producción.
// La cabecera `Idempotency-Key` evita duplicados si se ejecuta dos veces.

const dry = process.argv.includes('--dry');
const key = process.env.CREEM_API_KEY;
if (!key) {
  console.error('Falta CREEM_API_KEY en el entorno.');
  process.exit(1);
}
const prueba = key.startsWith('creem_test_');
const BASE = prueba ? 'https://test-api.creem.io' : 'https://api.creem.io';

const COMUN = {
  currency: 'USD',
  billing_type: 'recurring',
  tax_mode: 'inclusive',
  tax_category: 'saas',
  default_success_url: 'https://www.medgoplus.com/estudio',
};

const INCLUYE_BASE = 'Preclínicos completos (resúmenes y banqueos), tu universidad como meta y tu plan de estudio hasta el examen.';
const INCLUYE_COMPLETO = 'Además: metas de examen (ENCIB y pronto USMLE Step 1), el laboratorio virtual y, muy pronto, MedGO IA.';

const PRODUCTOS = [
  {
    clave: 'visitante',
    env: 'CREEM_PRODUCT_VISITANTE_ID',
    body: {
      ...COMUN,
      name: 'MedGO Visitante',
      description: `Plan mensual, sin permanencia: se renueva cada mes hasta que canceles. ${INCLUYE_BASE}`,
      price: 1099,
      billing_period: 'every-month',
    },
  },
  {
    clave: 'residente-12',
    env: 'CREEM_PRODUCT_RESIDENTE_12_ID',
    body: {
      ...COMUN,
      name: 'MedGO Residente · 1 año',
      description: `Un año de MedGO pagado por adelantado; se renueva cada año hasta que canceles. ${INCLUYE_BASE} ${INCLUYE_COMPLETO}`,
      price: 9900,
      billing_period: 'every-year',
    },
  },
  {
    clave: 'especialista-24',
    env: 'CREEM_PRODUCT_ESPECIALISTA_24_ID',
    body: {
      ...COMUN,
      name: 'MedGO Especialista · 2 años',
      description: `Dos años de MedGO pagados por adelantado; se renueva cada dos años hasta que canceles. ${INCLUYE_BASE} ${INCLUYE_COMPLETO}`,
      price: 17900,
      billing_period: 'custom',
      recurring_interval: 'year',
      recurring_interval_count: 2,
    },
  },
];

console.log(`Creem ${prueba ? 'PRUEBA' : 'PRODUCCIÓN'} (${BASE})${dry ? ' · --dry' : ''}\n`);

const lineas = [];
for (const p of PRODUCTOS) {
  const precio = `US$ ${(p.body.price / 100).toFixed(2)}`;
  if (dry) {
    console.log(`+ ${p.clave}: «${p.body.name}» ${precio} (${p.body.billing_period}${p.body.recurring_interval_count ? ` ${p.body.recurring_interval_count} ${p.body.recurring_interval}` : ''})`);
    continue;
  }
  const res = await fetch(`${BASE}/v1/products`, {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
      'Idempotency-Key': `medgo-${p.clave}-usd-v1`,
    },
    body: JSON.stringify(p.body),
  });
  const texto = await res.text();
  if (!res.ok) {
    console.error(`✗ ${p.clave}: ${res.status} ${texto}`);
    process.exitCode = 1;
    continue;
  }
  const prod = JSON.parse(texto);
  console.log(`+ ${p.clave}: ${prod.id} «${prod.name}» ${precio} · ${prod.billing_period}`);
  lineas.push(`${p.env}=${prod.id}`);
}

if (lineas.length) console.log(`\nIDs (para la integración del checkout):\n${lineas.join('\n')}`);
