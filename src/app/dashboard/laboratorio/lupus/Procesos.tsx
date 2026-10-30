'use client';
// Lupas del laboratorio «Lupus». Por ahora solo la lista de tarjetas, que tiene
// la misma forma que la de «Hipersensibilidad» y se pinta con su componente.
// Las lupas propias (endosoma con TLR7/9, NETosis, capas del glomérulo…) se
// añaden aquí cuando lleguen sus capítulos.

import type { ReactNode } from 'react';
import type { DatosProceso } from '@/lib/data/lupus/tipos';
import type { DatosProceso as DatosHiper } from '@/lib/data/hipersensibilidad/tipos';
import ProcesoHiper from '../hipersensibilidad/Procesos';

export default function Proceso({ datos, p }: { datos: DatosProceso; p: number }): ReactNode {
  return <ProcesoHiper datos={datos as DatosHiper} p={p} />;
}
