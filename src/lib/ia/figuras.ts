import 'server-only';
import sharp from 'sharp';
import { CONTEXTO } from './config';

/**
 * Las figuras de los resúmenes están en AVIF en el bucket público
 * `resumenes-img`, y la API de Claude sólo acepta JPEG/PNG/GIF/WEBP: se
 * bajan, se reducen a `CONTEXTO.ladoFigura` (más píxeles = más tokens, sin
 * ganar nada) y se pasan a WEBP en base64.
 *
 * Sólo se aceptan URLs de ese bucket de este proyecto: la ruta comprueba
 * además que la figura esté en el resumen abierto.
 */

export function esFiguraDeResumen(url: string): boolean {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return false;
  try {
    const u = new URL(url);
    return u.origin === new URL(base).origin && u.pathname.startsWith('/storage/v1/object/public/resumenes-img/');
  } catch {
    return false;
  }
}

const memoria = new Map<string, { data: string; ancho: number; alto: number }>();

export async function figuraParaModelo(url: string) {
  const previa = memoria.get(url);
  if (previa) return previa;

  const r = await fetch(url);
  if (!r.ok) throw new Error(`figura ${r.status}`);
  const bruto = Buffer.from(await r.arrayBuffer());
  if (bruto.length > 15 * 1024 * 1024) throw new Error('figura demasiado grande');

  const { data, info } = await sharp(bruto)
    .resize({ width: CONTEXTO.ladoFigura, height: CONTEXTO.ladoFigura, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const fuera = { data: data.toString('base64'), ancho: info.width, alto: info.height };
  if (memoria.size > 40) memoria.delete(memoria.keys().next().value!);
  memoria.set(url, fuera);
  return fuera;
}

/** Tokens que costará la imagen (≈ ancho × alto / 750). */
export function tokensDeFigura(ancho: number, alto: number): number {
  return Math.ceil((ancho * alto) / 750);
}
