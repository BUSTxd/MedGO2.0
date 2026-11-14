'use client';
// Resalta las palabras clave de una explicación (arterias, territorios,
// síndromes…) para que se lea de un vistazo. Como máximo MAX_MARCAS por texto,
// primero las que también están en la respuesta. Igual que el de Médula
// Espinal 3D, con el vocabulario de Willis.

import { Fragment, useMemo } from 'react';
import { ARTERIA_LIST } from '../engine/anatomia';
import s from '@/styles/medulaPractica.module.css';

const MAX_MARCAS = 3;

const TERMINOS: string[] = (() => {
  const t = new Set<string>();
  for (const a of ARTERIA_LIST) {
    t.add(a.nombre.toLowerCase());
    t.add(a.nombre.toLowerCase().replace(/^arterias? /, ''));
  }
  [
    // arterias y segmentos en la forma en que se escriben en las explicaciones
    'carótida interna', 'carótida externa', 'carótida común', 'cerebral anterior', 'cerebral media',
    'cerebral posterior', 'comunicante anterior', 'comunicante posterior', 'coroidea anterior', 'oftálmica',
    'basilar', 'vertebral', 'vertebrales', 'cerebelosa superior', 'cerebelosa anteroinferior',
    'cerebelosa posteroinferior', 'espinal anterior', 'laberíntica', 'recurrente de heubner',
    'lenticuloestriadas', 'talamoperforantes', 'arteria central de la retina', 'arteria de percheron',
    'trigeminal persistente', 'subclavia', 'arco aórtico', 'tronco braquiocefálico', 'seno cavernoso',
    'sifón carotídeo', 'polígono de willis', 'agujero magno',
    // territorios y estructuras
    'cápsula interna', 'ganglios basales', 'putamen', 'tálamo', 'lóbulo occipital', 'corteza visual',
    'cara medial', 'convexidad', 'bulbo lateral', 'bulbo medial', 'protuberancia', 'mesencéfalo', 'cerebelo',
    'oído interno', 'retina', 'hipocampo', 'área de broca', 'área de wernicke', 'lobulillo paracentral',
    'tercer par', 'iii par', 'nervio oculomotor',
    // clínica
    'hemorragia subaracnoidea', 'aneurisma', 'aneurismas', 'wallenberg', 'weber', 'locked-in', 'enclaustramiento',
    'dejerine', 'amaurosis fugax', 'midriasis', 'ptosis', 'hemianopsia', 'respeto macular', 'afasia',
    'heminegligencia', 'hemiplejia', 'infarto lacunar', 'lacunar', 'síndrome de horner', 'alexia sin agrafia',
    'robo de la subclavia', 'disección', 'cpa fetal', 'acp fetal', 'hipoplásica', 'hipoplasia',
  ].forEach((x) => t.add(x));
  return [...t].filter((x) => x.length > 2).sort((a, b) => b.length - a.length);
})();

const escapar = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LADO = '(?:\\s+(?:derech[oa]s?|izquierd[oa]s?|homolateral(?:es)?|ipsilateral(?:es)?|contralateral(?:es)?|del lado opuesto|del mismo lado))?';
const PATRON = new RegExp(`(?<![\\p{L}\\p{N}])(?:${TERMINOS.map(escapar).join('|')})${LADO}(?![\\p{L}\\p{N}])`, 'giu');

interface Trozo { texto: string; marca: boolean }

export function trocear(texto: string, prioridad = ''): Trozo[] {
  const pri = prioridad.toLowerCase();
  const halladas: Array<{ i: number; f: number; base: string }> = [];
  const vistos = new Set<string>();
  for (const m of texto.matchAll(PATRON)) {
    const base = m[0].toLowerCase().replace(new RegExp(`${LADO}$`, 'iu'), '');
    if (vistos.has(base)) continue; // cada término, una sola vez
    vistos.add(base);
    halladas.push({ i: m.index ?? 0, f: (m.index ?? 0) + m[0].length, base });
  }
  // Primero los que también nombra la respuesta; luego, por orden de aparición.
  const elegidas = [...halladas]
    .sort((a, b) => Number(pri.includes(b.base)) - Number(pri.includes(a.base)) || a.i - b.i)
    .slice(0, MAX_MARCAS)
    .sort((a, b) => a.i - b.i);
  const out: Trozo[] = [];
  let k = 0;
  for (const h of elegidas) {
    if (h.i > k) out.push({ texto: texto.slice(k, h.i), marca: false });
    out.push({ texto: texto.slice(h.i, h.f), marca: true });
    k = h.f;
  }
  if (k < texto.length) out.push({ texto: texto.slice(k), marca: false });
  return out;
}

export default function Resaltado({ texto, prioridad }: { texto: string; prioridad?: string }) {
  const trozos = useMemo(() => trocear(texto, prioridad), [texto, prioridad]);
  return (
    <>
      {trozos.map((t, i) => (t.marca
        ? <mark key={i} className={s.clave}>{t.texto}</mark>
        : <Fragment key={i}>{t.texto}</Fragment>))}
    </>
  );
}
