'use client';
// Resalta las palabras clave de una explicación (tractos, láminas, núcleos,
// síndromes…) para que se lea de un vistazo. Como máximo MAX_MARCAS por texto,
// primero las que también están en la respuesta; si el término va seguido del
// lado («derecho», «contralateral»…), el lado entra en la marca.

import { Fragment, useMemo } from 'react';
import { TRACT_LIST } from '../engine/anatomy';
import s from '@/styles/medulaPractica.module.css';

const MAX_MARCAS = 3;

/** Términos del lab, en la forma en que aparecen en las explicaciones. */
const TERMINOS: string[] = (() => {
  const t = new Set<string>();
  for (const tr of TRACT_LIST) {
    const n = tr.name.toLowerCase();
    t.add(n);
    t.add(n.replace(/^fascículo /, ''));
  }
  [
    // cordones y vías
    'cordón posterior', 'cordones posteriores', 'cordón lateral', 'cordones laterales', 'cordón anterior',
    'vía corticoespinal', 'corticoespinal', 'espinotalámico', 'sistema anterolateral', 'lemnisco medial',
    'fibras espinoolivares', 'tracto de lissauer', 'decusación piramidal', 'comisura blanca anterior',
    // sustancia gris
    'sustancia gelatinosa', 'núcleo propio', 'columna de clarke', 'núcleo intermediolateral', 'intermediolateral',
    'núcleo de onuf', 'núcleo frénico', 'núcleo parasimpático sacro', 'asta anterior', 'asta posterior', 'asta lateral',
    'zona intermedia', 'comisura gris', 'canal central', 'células de renshaw', 'motoneuronas α', 'motoneuronas γ',
    'neurona motora superior', 'neurona motora inferior', 'ganglio de la raíz dorsal', 'raíz dorsal', 'raíz ventral',
    'lámina i', 'lámina ii', 'lámina iii', 'lámina iv', 'lámina v', 'lámina vi', 'lámina vii', 'lámina viii',
    'lámina ix', 'lámina x', 'láminas i y ii', 'láminas iii y iv', 'láminas v y vi',
    // vasos y clínica
    'arteria espinal anterior', 'arterias espinales posteriores', 'arteria de adamkiewicz',
    'brown-séquard', 'hemisección', 'siringomielia', 'mielosis funicular', 'degeneración combinada subaguda',
    'indemnidad sacra', 'shock medular', 'shock neurogénico', 'cola de caballo', 'cono medular', 'síndrome de horner',
    'disreflexia autonómica', 'ataxia sensitiva', 'romberg', 'signo de lhermitte', 'mielitis transversa',
    'espasticidad', 'babinski', 'fibra ia', 'órgano tendinoso',
    'cisterna lumbar', 'punción lumbar', 'saco dural', 'filum terminal', 'intumescencia cervical', 'intumescencia lumbosacra',
    'déficit de b12', 'vitamina b12', 'signo de lázaro', 'descarga simpática', 'sustancia blanca',
    'compresión medular', 'guillain-barré', 'arreflexia', 'nivel sensitivo', 'fibras sacras', 'segmentos sacros', 'raíz s1', 'hernia discal',
  ].forEach((x) => t.add(x));
  return [...t].sort((a, b) => b.length - a.length);
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
