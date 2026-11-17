'use client';
// Resalta las palabras clave de una explicación (estructuras, núcleos, pares,
// síndromes…) para que se lea de un vistazo. Como máximo MAX_MARCAS por texto,
// primero las que también están en la respuesta. Igual que el de Polígono de
// Willis 3D, con el vocabulario del tronco.

import { Fragment, useMemo } from 'react';
import { ESTRUCTURAS } from '../engine/anatomia';
import { INTERIOR_LIST } from '../engine/interior';
import { NERVIOS } from '../engine/nervios';
import s from '@/styles/medulaPractica.module.css';

const MAX_MARCAS = 3;

const TERMINOS: string[] = (() => {
  const t = new Set<string>();
  const sinParentesis = (x: string) => x.toLowerCase().replace(/\s*\(.*\)$/, '');
  for (const e of Object.values(ESTRUCTURAS)) t.add(sinParentesis(e.nombre));
  for (const x of INTERIOR_LIST) t.add(sinParentesis(x.nombre));
  for (const n of NERVIOS) { t.add(n.nombre.toLowerCase()); t.add(`nervio ${n.nombre.toLowerCase()}`); }
  [
    // pares por número y estructuras en la forma en que se escriben
    'iii par', 'iv par', 'v par', 'vi par', 'vii par', 'viii par', 'ix par', 'x par', 'xi par', 'xii par',
    'núcleo rojo', 'sustancia negra', 'pedúnculo cerebral', 'pirámide', 'pirámides', 'oliva', 'olivas',
    'colículo facial', 'colículo superior', 'colículo inferior', 'fosa interpeduncular', 'fosa romboidea',
    'iv ventrículo', 'acueducto', 'lemnisco medial', 'espinotalámico', 'corticoespinal', 'flm',
    'fascículo longitudinal medial', 'núcleo ambiguo', 'núcleo solitario', 'surco preolivar', 'surco postolivar',
    'surco bulboprotuberancial', 'ángulo pontocerebeloso', 'decusación', 'mesencéfalo', 'protuberancia', 'puente',
    'bulbo', 'cerebelo', 'tálamo', 'agujero yugular', 'fisura orbitaria superior', 'conducto auditivo interno',
    // clínica
    'weber', 'benedikt', 'claude', 'parinaud', 'millard-gubler', 'foville', 'wallenberg', 'dejerine',
    'enclaustramiento', 'locked-in', 'síndrome de horner', 'horner', 'oftalmoplejía internuclear',
    'hemiparesia', 'hemiplejía', 'ptosis', 'midriasis', 'diplopía', 'disfagia', 'disfonía', 'ataxia',
    'temblor', 'vértigo', 'nistagmo', 'hipoacusia', 'parálisis facial periférica', 'parálisis facial central',
    'pica', 'aica', 'arteria basilar', 'arteria vertebral', 'cerebral posterior', 'espinal anterior',
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
