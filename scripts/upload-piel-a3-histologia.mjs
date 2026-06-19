/**
 * Práctica de Histología: Piel — Paso corto del GRUPO A3 (Neurología).
 *
 * Es el "Grupo A3" del examen Piel (ph03): 5 preguntas con micrografía, tomadas
 * del banqueo de Histología de Piel (grupo A3).
 *
 * 1) Re-encoda las 5 micrografías (.webp recortadas, ya con la flecha verde) a
 *    WEBP q82, máx 1200px de ancho, y las sube al bucket PÚBLICO "examenes-img"
 *    bajo neurologia/piel-a3/.
 * 2) Arma el JSON (5 preguntas) con las URLs públicas + dimensiones reales.
 * 3) Sube el JSON al bucket PRIVADO "examenes" como
 *    neurologia/piel-histologia-a3.json
 *
 * Run: node scripts/upload-piel-a3-histologia.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import sharp from 'sharp';
import { config } from './load-env.mjs';

const URL_ = config.NEXT_PUBLIC_SUPABASE_URL;
const KEY  = config.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, { auth: { persistSession: false } });
const IMG_BUCKET = 'examenes-img';
const EXAM_BUCKET = 'examenes';
const DL = 'C:\\Users\\BUST\\Downloads\\';
const MAX_W = 1200;

// id lógico → [archivo local, ruta remota .webp]
const IMAGES = {
  folp:    [DL + 'histopielV2-1.webp',       'neurologia/piel-a3/foliculo-piloso-zona-queratogena.webp'],
  basal:   [DL + 'histopielV2-2.webp',       'neurologia/piel-a3/estrato-basal-epidermis.webp'],
  vre:     [DL + 'histopielV2-3.webp',       'neurologia/piel-a3/vaina-radicular-externa.webp'],
  melano:  [DL + 'histopielV2-4.webp',       'neurologia/piel-a3/melanocito-capa-basal.webp'],
  ecrina:  [DL + 'histopielV2-5.webp',       'neurologia/piel-a3/conducto-glandula-sudoripara-ecrina.webp'],
  estratos:[DL + 'epidermisestratos.webp',        'neurologia/piel-a3/epidermis-estratos.webp'],
  vreRef:  [DL + 'vaina radicular externa (1).avif', 'neurologia/piel-a3/vaina-radicular-externa-ref.webp'],
};

// ── Subida de imágenes (resize → webp → upload), devolviendo url + dims ──
async function uploadImage(local, remote) {
  const src = readFileSync(local);
  const pipeline = sharp(src).resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 82 });
  const buf = await pipeline.toBuffer();
  const meta = await sharp(buf).metadata();
  const { error } = await supabase.storage.from(IMG_BUCKET).upload(remote, buf, {
    contentType: 'image/webp',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`upload ${remote}: ${error.message}`);
  const { data } = supabase.storage.from(IMG_BUCKET).getPublicUrl(remote);
  console.log(`. ${remote}  ${meta.width}x${meta.height}  (${(buf.length / 1024).toFixed(0)} KB)`);
  return { url: data.publicUrl, w: meta.width, h: meta.height };
}

const img = {};
for (const [id, [local, remote]] of Object.entries(IMAGES)) {
  img[id] = await uploadImage(local, remote);
}

// ── Construcción del examen (5 preguntas) ──
const opt = (id, text, correct = false) => ({ id, text, correct });

const exam = {
  version: 1,
  key: 'neurologia/piel-histologia-a3',
  title: 'Histología de la Piel — Paso corto (Grupo A3)',
  duration_min: null,
  questions: [
    {
      id: 'a3-q1',
      stem: '¿Cuál es la función principal asociada a esta región señalada por las flechas verdes?',
      image: img.folp.url,
      imageAlt: 'Folículo piloso en corte longitudinal: zona queratógena, con el córtex del tallo a la izquierda y la vaina radicular externa a la derecha; flechas verdes señalando la región (H&E).',
      imageW: img.folp.w,
      imageH: img.folp.h,
      options: [
        opt('a', 'Regular la contracción del músculo erector del pelo para facilitar la piloerección.'),
        opt('b', 'Señalar la zona donde el tallo piloso y la vaina radicular interna completan su queratinización, consolidando la estructura del pelo.', true),
        opt('c', 'Delimitar el punto donde desemboca la glándula sebácea y se inicia la lubricación holocrina del tallo piloso.'),
        opt('d', 'Marcar el sitio donde las células matriciales proliferativas dejan de dividirse y comienzan la melanogénesis activa.'),
      ],
      explanation:
        'Las flechas señalan la **zona queratógena del folículo piloso**: la región donde el **tallo piloso** (córtex, a la izquierda) y la **vaina radicular interna** completan su **queratinización**, consolidando la estructura del pelo. No corresponde al músculo erector del pelo, ni a la desembocadura de la glándula sebácea, ni a la matriz proliferativa del bulbo (donde aún hay división celular y melanogénesis).',
      tags: ['Folículo piloso', 'Zona queratógena', 'Queratinización'],
    },
    {
      id: 'a3-q2',
      stem: '¿Cuál es la función principal asociada a este estrato?',
      image: img.basal.url,
      imageAlt: 'Epidermis con la flecha señalando el estrato granuloso, entre el estrato espinoso y el córneo (H&E).',
      imageW: img.basal.w,
      imageH: img.basal.h,
      options: [
        opt('a', 'Detectar estímulos táctiles finos de baja frecuencia mediante terminaciones nerviosas especializadas.'),
        opt('b', 'Generar nuevas células epidérmicas por mitosis activa.'),
        opt('c', 'Producir melanina y transferirla a los queratinocitos suprayacentes.'),
        opt('d', 'Iniciar la queratinización terminal y contribuir a la formación de la barrera epidérmica impermeable.', true),
      ],
      explanation:
        'El **estrato granuloso** es la última capa metabólicamente activa de la epidermis y recibe su nombre por los **gránulos de queratohialina** visibles en sus células. Estos gránulos contienen proteínas como la **filagrina** y la **loricrina** que organizan la queratina y forman el **sobre cornificado**, dándole resistencia a la célula. Además, liberan **lípidos** al espacio extracelular que actúan como un cemento impermeable entre las células. En esta capa las células pierden su núcleo y organelos, mueren de forma programada y se convierten en **corneocitos**, que forman el estrato córneo y constituyen la **barrera protectora final** de la piel.',
      explanationImage: img.estratos.url,
      explanationImageAlt: 'Esquema de los estratos de la epidermis: basal, espinoso, granuloso, córneo y dermis (H&E).',
      tags: ['Epidermis', 'Estrato granuloso', 'Queratinización', 'Barrera epidérmica'],
    },
    {
      id: 'a3-q3',
      stem: '¿Cuál es la función principal de la estructura señalada?',
      image: img.vre.url,
      imageAlt: 'Corte transversal de folículo piloso con la flecha señalando la vaina radicular externa, de células claras (H&E).',
      imageW: img.vre.w,
      imageH: img.vre.h,
      options: [
        opt('a', 'Contribuir al soporte epitelial del folículo piloso y ser reservorio de células madre.', true),
        opt('b', 'Producir melanina y transferirla directamente al tallo piloso en crecimiento.'),
        opt('c', 'Formar la cutícula y la corteza del pelo mediante queratinización dura y tricohialina.'),
      ],
      explanation:
        'La flecha señala la **vaina radicular externa (VRE)**: la capa epitelial más periférica del folículo, continua con el estrato basal de la epidermis. Su función es **dar soporte epitelial al folículo piloso y servir de reservorio de células madre** (zona del bulge), claves para la regeneración del folículo y la reepitelización. No produce melanina (eso lo hacen los melanocitos del bulbo) ni forma la cutícula/corteza del pelo (eso ocurre en el tallo).',
      explanationImage: img.vreRef.url,
      explanationImageAlt: 'Corte transversal de folículo piloso señalando la vaina radicular externa (H&E).',
      tags: ['Folículo piloso', 'Vaina radicular externa', 'Células madre'],
    },
    {
      id: 'a3-q4',
      stem: '¿Cuál es la función principal de estas células en relación con las células vecinas?',
      image: img.melano.url,
      imageAlt: 'Estrato basal de la epidermis con la flecha señalando un melanocito, de citoplasma claro, entre queratinocitos pigmentados (H&E).',
      imageW: img.melano.w,
      imageH: img.melano.h,
      options: [
        opt('a', 'Formar uniones desmosómicas abundantes para aumentar la cohesión entre células epidérmicas.'),
        opt('b', 'Producir queratina para reforzar la barrera mecánica de la epidermis.'),
        opt('c', 'Fagocitar restos celulares y microorganismos presentes en el estrato córneo.'),
        opt('d', 'Sintetizar melanina y transferir melanosomas a queratinocitos para contribuir a la fotoprotección nuclear.', true),
      ],
      explanation:
        'La flecha señala un **melanocito** del estrato basal. Su función principal en relación con las células vecinas es **sintetizar melanina y transferir los melanosomas a los queratinocitos**, donde el pigmento se dispone como un capuchón sobre el núcleo para la **fotoprotección** del ADN frente a la radiación UV. Las uniones desmosómicas y la producción de queratina son propias de los queratinocitos, y la fagocitosis del estrato córneo no es su rol.',
      tags: ['Melanocito', 'Melanina', 'Fotoprotección'],
    },
    {
      id: 'a3-q5',
      stem: '¿Cuál es su función principal?',
      image: img.ecrina.url,
      imageAlt: 'Dermis con la flecha señalando el conducto excretor de una glándula sudorípara ecrina, de doble capa cúbica (H&E).',
      imageW: img.ecrina.w,
      imageH: img.ecrina.h,
      options: [
        opt('a', 'Contraerse para expulsar el producto secretor desde el adenómero glandular.'),
        opt('b', 'Producir la porción acuosa del sudor mediante secreción merocrina.'),
        opt('c', 'Reabsorber parte de los iones del sudor y conducirlo hacia la superficie epidérmica.', true),
        opt('d', 'Secretar lípidos por mecanismo holocrino para formar el sebo cutáneo.'),
      ],
      explanation:
        'La flecha señala el **conducto excretor de la glándula sudorípara ecrina** (doble capa de células cúbicas). Su función principal es **reabsorber parte de los iones (Na⁺) del sudor y conducirlo hacia la superficie epidérmica**, contribuyendo a un sudor hipotónico. La contracción para expulsar la secreción corresponde a las células mioepiteliales del adenómero; la producción de la porción acuosa, al ovillo secretor; y la secreción holocrina de lípidos, a la glándula sebácea.',
      tags: ['Glándula sudorípara ecrina', 'Conducto excretor', 'Reabsorción de iones'],
    },
  ],
};

// ── Validación rápida: exactamente una correcta por pregunta ──
for (const q of exam.questions) {
  const n = q.options.filter(o => o.correct).length;
  if (n !== 1) { console.error(`Pregunta ${q.id}: ${n} opciones correctas (debe ser 1)`); process.exit(1); }
}

// ── Subida del JSON al bucket privado ──
const remoteJson = 'neurologia/piel-histologia-a3.json';
const body = Buffer.from(JSON.stringify(exam, null, 2), 'utf8');
const { error: upErr } = await supabase.storage.from(EXAM_BUCKET).upload(remoteJson, body, {
  contentType: 'application/json',
  upsert: true,
  cacheControl: 'no-cache',
});
if (upErr) { console.error('upload json:', upErr.message); process.exit(1); }

console.log(`\nExamen subido: ${EXAM_BUCKET}/${remoteJson} (${exam.questions.length} preguntas, ${(body.length / 1024).toFixed(1)} KB)`);
