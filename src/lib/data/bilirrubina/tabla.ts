// La tabla resumen del laboratorio «Metabolismo de la bilirrubina»: el mapa final del capítulo 11
// (antes, dentro o después del hígado) y cada causa del lab en su sitio. Solo en el servidor
// (`contenidoDelLab` la manda con el plan). Repite lo que ya dicen los capítulos 8 a 11 y su
// guion (`docs/bilirrubina/GUION.md`): si se corrige uno, corregir el otro.

import 'server-only';
import type { TablaLab } from './tipos';

export const ICTERICIA: TablaLab = {
  titulo: 'El mapa de la ictericia',
  comparacion: {
    titulo: 'Qué cambia según dónde se atasca',
    columnas: ['Prehepática (antes)', 'Hepática (dentro)', 'Posthepática (después)'],
    filas: [
      {
        nombre: 'Bilirrubina en sangre',
        v: ['Indirecta (no conjugada) alta', 'Mixta', 'Directa (conjugada) alta'],
        clave: 'La directa es la conjugada: hidrosoluble, la única que puede salir por la orina.',
      },
      {
        nombre: 'Bilirrubina en orina',
        v: ['No hay', 'Puede haber coluria', 'Coluria'],
        clave: 'La no conjugada viaja pegada a la albúmina y no se filtra.',
      },
      {
        nombre: 'Urobilinógeno en orina',
        v: ['Alto', 'Normal o alto', 'Bajo o ausente'],
        clave: 'Lo fabrican las bacterias del colon: si la bilis no llega al intestino, desaparece.',
      },
      {
        nombre: 'Heces',
        v: ['Oscuras', 'Normales o algo claras', 'Acólicas'],
        clave: 'El marrón es la estercobilina; sin bilis en el intestino, las heces pierden el color.',
      },
      {
        nombre: 'Otras pistas',
        v: [['LDH alta', 'Haptoglobina baja'], ['Transaminasas altas'], ['Fosfatasa alcalina y GGT altas', 'Prurito']],
      },
      {
        nombre: 'Qué falla',
        v: ['Se rompe demasiado hemo: el hígado no da abasto', 'Fallan varias etapas a la vez', 'La bilis no fluye o refluye'],
      },
    ],
  },
  claves: {
    titulo: 'Cada causa, en su sitio',
    filas: [
      { nombre: 'Hemólisis (también la isoinmune por Rh)', donde: 'Antes · producir mucho', columna: 0, texto: 'Más hemo roto, más bilirrubina; LDH alta, haptoglobina baja, urobilinógeno alto.' },
      { nombre: 'Eritropoyesis ineficaz, hematoma grande', donde: 'Antes · producir mucho', columna: 0, texto: 'Más hemo que degradar sin hemólisis en la sangre.' },
      { nombre: 'Fármacos que bloquean OATP, insuficiencia cardíaca, cortocircuito portosistémico', donde: 'Dentro · captar poco', columna: 1, texto: 'Entra menos bilirrubina al hepatocito. Poco frecuente.' },
      { nombre: 'Síndrome de Gilbert', donde: 'Dentro · conjugar poco', columna: 1, texto: '5-10 % de la población; UGT1A1*28, un tercio de actividad; ictericia leve con ayuno, infección o estrés. No se trata.' },
      { nombre: 'Crigler-Najjar tipo I', donde: 'Dentro · conjugar poco', columna: 1, texto: 'Sin UGT1A1: ictericia intensa desde el nacimiento, riesgo de kernícterus; el fenobarbital no sirve.' },
      { nombre: 'Crigler-Najjar tipo II', donde: 'Dentro · conjugar poco', columna: 1, texto: 'Algo de UGT1A1; responde al fenobarbital.' },
      { nombre: 'Ictericia fisiológica del recién nacido', donde: 'Antes y dentro', columna: 1, texto: 'Después de las 24 h, pico del día 3 al 5. Antes de las 24 h nunca es fisiológica.' },
      { nombre: 'Dubin-Johnson', donde: 'Dentro · la bomba (MRP2)', columna: 1, texto: 'Conjugada alta, hígado negro; coproporfirina total normal con más del 80 % de isómero I. Benigno.' },
      { nombre: 'Rotor', donde: 'Dentro · conjugada', columna: 1, texto: 'Hígado de color normal; coproporfirina total 2 a 5 veces mayor. Benigno.' },
      { nombre: 'Daño hepatocelular (hepatitis, alcohol, tóxicos, sepsis)', donde: 'Dentro · patrón mixto', columna: 1, texto: 'Fallan captación, conjugación y excreción; suele predominar la conjugada; transaminasas muy altas.' },
      { nombre: 'Colestasis intrahepática', donde: 'Dentro · la bilis no fluye', columna: 1, texto: 'Estrógenos, anabólicos, amoxicilina con clavulánico, sepsis, embarazo, colangitis biliar primaria.' },
      { nombre: 'Cálculo en el colédoco, cáncer de la cabeza del páncreas, colangiocarcinoma', donde: 'Después · extrahepática', columna: 2, texto: 'Coluria, acolia y prurito. Vesícula palpable y no dolorosa en el cáncer de páncreas (Courvoisier).' },
      { nombre: 'Atresia biliar', donde: 'Después · conductos obliterados', columna: 2, texto: 'Primera causa de ictericia conjugada neonatal. Kasai antes de los 2 meses. Ictericia de más de 2 semanas: medir la directa.' },
    ],
  },
};
