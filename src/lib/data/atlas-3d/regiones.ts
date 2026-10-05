// Atlas 3D: regiones publicadas y vocabulario común (sistemas, zonas).
//
// Cada región es un paquete independiente en el bucket público
// `laboratorio-img/atlas-3d/<id>/<version>/` (manifiesto.json + geometria.bin.gz),
// sacado de BodyParts3D con `scripts/atlas-3d/extraer-region.mjs`. Todas
// comparten las coordenadas del mismo cuerpo: el visor puede cargar varias a
// la vez (`?region=a,b`) y encajan solas.
//
// Para publicar una región nueva: definirla en `scripts/atlas-3d/regiones.mjs`,
// extraer, subir con su versión y añadirla aquí.

export type Sistema = 'hueso' | 'musculo' | 'arteria' | 'vena' | 'nervio' | 'conectivo';
export type Lado = 'derecho' | 'izquierdo';

export interface RegionAtlas {
  id: string;
  nombre: string;
  /** Carpeta del bucket. Una geometría publicada no se pisa: se sube otra versión. */
  version: string;
  /** Zonas en que se divide, en orden de proximal a distal. */
  zonas: { id: string; nombre: string }[];
}

export const REGIONES: RegionAtlas[] = [
  {
    id: 'miembro-superior-derecho',
    nombre: 'Miembro superior derecho',
    // v2: + costillas 1.ª-6.ª con sus cartílagos (región pectoral).
    // v3: vasos supraescapulares sacados de la escápula; FJ2292 es la vena
    //     circunfleja humeral posterior (venía rotulada como arteria).
    // v4: + esqueleto axial donde se insertan sus músculos: occipital, C1-T12
    //     con sus discos, esternón, costillas 7.ª-9.ª; + platisma y mandíbula.
    version: 'v4',
    zonas: [
      { id: 'hombro', nombre: 'Hombro' },
      { id: 'brazo', nombre: 'Brazo' },
      { id: 'antebrazo', nombre: 'Antebrazo' },
      { id: 'mano', nombre: 'Mano' },
    ],
  },
  {
    id: 'miembro-inferior-derecho',
    nombre: 'Miembro inferior derecho',
    // Con T12-L5, sus discos y el sacro: ahí se insertan el psoas mayor, el
    // piriforme y el glúteo mayor.
    version: 'v1',
    zonas: [
      { id: 'pelvis', nombre: 'Pelvis y región glútea' },
      { id: 'muslo', nombre: 'Muslo' },
      { id: 'pierna', nombre: 'Rodilla y pierna' },
      { id: 'pie', nombre: 'Tobillo y pie' },
    ],
  },
];

export const REGION_POR_DEFECTO = REGIONES[0].id;

export function regionPorId(id: string): RegionAtlas | undefined {
  return REGIONES.find((r) => r.id === id);
}

/** `?region=a,b` → regiones conocidas, sin repetir; ninguna válida → la de por defecto. */
export function leerRegiones(param: string | string[] | undefined): string[] {
  const crudo = Array.isArray(param) ? param.join(',') : (param ?? '');
  const ids = [...new Set(crudo.split(',').map((s) => s.trim()))].filter((id) => regionPorId(id));
  return ids.length ? ids : [REGION_POR_DEFECTO];
}

export function urlRegion(r: RegionAtlas): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/atlas-3d/${r.id}/${r.version}`;
}

/** Colores anatómicos: no cambian con el tema. Orden = orden del panel. */
interface InfoSistema {
  id: Sistema;
  nombre: string;
  singular: string;
  color: string;
}

export const SISTEMAS: InfoSistema[] = [
  { id: 'hueso', nombre: 'Huesos', singular: 'Hueso', color: '#e4d9bb' },
  { id: 'musculo', nombre: 'Músculos', singular: 'Músculo', color: '#b2574b' },
  { id: 'arteria', nombre: 'Arterias', singular: 'Arteria', color: '#d0382e' },
  { id: 'vena', nombre: 'Venas', singular: 'Vena', color: '#3d6db3' },
  { id: 'nervio', nombre: 'Nervios', singular: 'Nervio', color: '#e2bd45' },
  { id: 'conectivo', nombre: 'Tejido conectivo', singular: 'Tejido conectivo', color: '#a9c6bb' },
];

export const SISTEMA = Object.fromEntries(SISTEMAS.map((s) => [s.id, s])) as Record<Sistema, InfoSistema>;

export const CREDITO = {
  texto: 'BodyParts3D © DBCLS · CC BY 4.0',
  url: 'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/',
  adaptacion: 'Geometría simplificada, recortada por región y rotulada en español.',
};
