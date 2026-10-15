'use client';
// Texto que entra palabra por palabra: cada palabra pasa de desenfocada y un
// poco más abajo a nítida en su sitio, con un desfase corto entre palabras.
// Los términos clave (`claves`) se subrayan con un barrido cuando aparecen.
// Se reinicia al cambiar `id` (otro paso). Con movimiento reducido, entra todo
// de una vez.

import { Fragment } from 'react';
import s from '@/styles/linfocitos.module.css';

const normal = (t: string) => t.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[.,;:()«»"]/g, '');

export default function TextoAnimado({ id, texto, claves = [], retraso = 0, paso = 26, className }: {
  id: string;
  texto: string;
  claves?: string[];
  /** ms antes de la primera palabra. */
  retraso?: number;
  /** ms entre palabras. */
  paso?: number;
  className?: string;
}) {
  const palabras = texto.split(/(\s+)/);
  // Marca cada palabra que forma parte de una clave (claves de varias palabras incluidas).
  const enClave = new Array(palabras.length).fill(false);
  const soloPalabras = palabras.map((p, i) => ({ p, i })).filter((x) => x.p.trim());
  for (const cl of claves) {
    const partes = cl.split(/\s+/).map(normal);
    for (let k = 0; k + partes.length <= soloPalabras.length; k++) {
      if (partes.every((pt, j) => normal(soloPalabras[k + j].p) === pt)) {
        for (let j = 0; j < partes.length; j++) enClave[soloPalabras[k + j].i] = true;
      }
    }
  }
  let n = 0;
  return (
    <span key={id} className={`${s.textoAnimado} ${className ?? ''}`}>
      {palabras.map((p, i) => {
        if (!p.trim()) return <Fragment key={i}>{p}</Fragment>;
        const d = retraso + n++ * paso;
        return (
          <span key={i} className={`${s.palabra} ${enClave[i] ? s.clave : ''}`} style={{ animationDelay: `${d}ms`, ['--barrido' as string]: `${d + 260}ms` }}>
            {p}
          </span>
        );
      })}
    </span>
  );
}
