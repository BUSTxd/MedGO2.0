'use client';
import { useRouter } from 'next/navigation';
import type { RutaEstudio } from '@/lib/estudio/tipos';

/**
 * Las metas del selector «Tu meta». Preclínicos es la base (el temario
 * universal); las demás son las metas que se estudian encima: la universidad
 * del alumno (hoy, Cayetano) y los exámenes.
 */
export type Ruta = 'Preclínicos' | 'Cayetano' | 'ENCIB' | 'USMLE Step 1';

export const RUTAS: Ruta[] = ['Preclínicos', 'Cayetano', 'ENCIB', 'USMLE Step 1'];

/** Adónde lleva elegir una meta: `/estudio` abre el primer curso UPCH del alumno. Sin entrada, «Pronto». */
const ENTRADA: Partial<Record<Ruta, string>> = { 'Preclínicos': '/estudio/preclinicos', Cayetano: '/estudio', ENCIB: '/estudio/encib' };

/** La meta del selector según el segmento de la URL del curso abierto. */
export const RUTA_DE_SEGMENTO: Record<RutaEstudio, Ruta> = { upch: 'Cayetano', preclinicos: 'Preclínicos', encib: 'ENCIB' };

/** Cada meta en el selector: la que no tiene temario aún avisa «Pronto»; Cayetano sin cuenta de la UPCH, candado. */
export function opcionRuta(r: Ruta, rutas: Ruta[]) {
  if (!ENTRADA[r]) return { value: r, label: r, etiqueta: 'Pronto' };
  if (!rutas.includes(r)) return { value: r, label: r, etiqueta: 'Solo @upch.pe', bloqueada: true };
  return { value: r, label: r };
}

/** Cambia de meta si se puede; si no, un aviso. */
export function useCambiarRuta({ actual, rutas, toast }: { actual: Ruta; rutas: Ruta[]; toast: (msg: string) => void }) {
  const router = useRouter();
  return (r: Ruta) => {
    if (r === actual) return;
    const entrada = ENTRADA[r];
    if (!entrada) toast(`${r} llega pronto · Sigues en ${actual}`);
    else if (!rutas.includes(r)) toast('La meta Cayetano es para cuentas @upch.pe');
    else router.push(entrada);
  };
}
