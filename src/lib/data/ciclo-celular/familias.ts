// Familias, colores y escalas de las imágenes del laboratorio del ciclo
// celular. Única puerta de entrada a una imagen: `imagen(id)` — ningún
// componente escribe rutas a mano. Un id sin recorte (hoy `orc`) devuelve un
// descriptor de marcador de posición con el mismo tamaño que tendría.

import { IMAGENES_CRUDAS } from './imagenes';

export type Familia =
  | 'ciclina_d' | 'ciclina_e' | 'ciclina_a' | 'ciclina_b' | 'cdk' | 'mitogeno' | 'tf' | 'p53'
  | 'freno' | 'dano' | 'fosfatasa' | 'reparacion' | 'replicacion' | 'mitosis' | 'degradacion'
  | 'apoptosis' | 'estructura' | 'celula';

export const FAMILIAS: Record<Familia, { nombre: string; color: string }> = {
  ciclina_d:   { nombre: 'Ciclina D', color: '#2FB7A6' },
  ciclina_e:   { nombre: 'Ciclina E', color: '#FF7A66' },
  ciclina_a:   { nombre: 'Ciclina A', color: '#F2C94C' },
  ciclina_b:   { nombre: 'Ciclina B', color: '#9B6DFF' },
  cdk:         { nombre: 'CDK', color: '#6D8BB5' },
  mitogeno:    { nombre: 'Señal mitogénica', color: '#56C271' },
  tf:          { nombre: 'Factores de transcripción', color: '#3DDC97' },
  p53:         { nombre: 'p53', color: '#FF6B3D' },
  freno:       { nombre: 'Inhibidores y frenos', color: '#F2728C' },
  dano:        { nombre: 'Sensores y cinasas de daño', color: '#FF9F1C' },
  fosfatasa:   { nombre: 'Fosfatasas', color: '#22C3C9' },
  reparacion:  { nombre: 'Reparación', color: '#B48CE0' },
  replicacion: { nombre: 'Replicación', color: '#4FB3A9' },
  mitosis:     { nombre: 'Mitosis y SAC', color: '#E8B931' },
  degradacion: { nombre: 'Degradación', color: '#8E7CC3' },
  apoptosis:   { nombre: 'Apoptosis', color: '#E0474C' },
  estructura:  { nombre: 'Estructuras', color: '#7FA7D9' },
  celula:      { nombre: 'Células', color: '#C9D3E0' },
};

const MIEMBROS: Record<Familia, string[]> = {
  ciclina_d: ['ciclina_d'], ciclina_e: ['ciclina_e'], ciclina_a: ['ciclina_a'], ciclina_b: ['ciclina_b'],
  cdk: ['cdk4_6', 'cdk2', 'cdk1'],
  mitogeno: ['factor_crecimiento', 'receptor_rtk', 'ras_gtp', 'cascada_mapk', 'pi3k', 'akt', 'gsk3b'],
  tf: ['myc_max', 'e2f_dp1'],
  p53: ['p53_monomero', 'p53_tetramero'],
  freno: ['rb', 'p16', 'p21', 'p27', 'p14arf', 'mdm2', 'wee1', 'myt1', 'proteina_14_3_3', 'geminina', 'securina', 'hdac'],
  dano: ['mrn', 'atm', 'atr_atrip', 'rpa', 'chk1', 'chk2', 'clamp_911', 'topbp1', 'claspina'],
  fosfatasa: ['cdc25', 'wip1'],
  reparacion: ['gadd45', 'brca1', 'brca2', 'rad51_filamento'],
  replicacion: ['mcm_helicasa', 'cdc6', 'cdt1', 'ddk', 'horquilla_replicacion', 'orc'],
  mitosis: ['plk1', 'aurora_a', 'bora', 'aurora_b', 'mps1', 'knl1', 'bub1_bub3', 'mad1_mad2', 'mad2_abierta', 'mad2_cerrada', 'cdc20', 'mcc', 'separasa', 'trip13_p31'],
  degradacion: ['proteasoma', 'e3_ligasa_scf', 'ubiquitina', 'apc_c'],
  apoptosis: ['bax', 'puma_noxa', 'fas', 'mitocondria_citocromo_c'],
  estructura: ['adn_helice', 'gen_activo', 'adn_rotura_doble', 'adn_cadena_simple', 'dimero_timina', 'radiacion', 'membrana_plasmatica', 'cromatidas_cohesina', 'cinetocoro_sin_unir', 'cinetocoro_unido', 'microtubulo'],
  celula: ['celula_normal', 'celula_apoptotica', 'celula_senescente'],
};

const FAMILIA_DE: Record<string, Familia> = {};
for (const [f, ids] of Object.entries(MIEMBROS) as [Familia, string[]][]) for (const id of ids) FAMILIA_DE[id] = f;

// Escala relativa (sección 6.3): una CDK nunca puede verse más pequeña que p21.
// El número es el LADO MAYOR de la imagen en unidades del escenario (1600 × 1000).
const PEQUENA = ['p16', 'p21', 'p27', 'p14arf', 'geminina', 'securina', 'bora', 'ubiquitina', 'gadd45', 'ras_gtp', 'factor_crecimiento'];
const GRANDE = ['rb', 'e2f_dp1', 'myc_max', 'atm', 'atr_atrip', 'mrn', 'brca1', 'brca2', 'apc_c', 'mcc', 'separasa', 'e3_ligasa_scf', 'proteina_14_3_3', 'p53_tetramero', 'trip13_p31', 'orc'];
const ESTRUCTURA = ['horquilla_replicacion', 'cromatidas_cohesina', 'cinetocoro_sin_unir', 'cinetocoro_unido', 'rad51_filamento', 'mcm_helicasa', 'receptor_rtk', 'adn_helice', 'gen_activo', 'adn_rotura_doble', 'adn_cadena_simple', 'dimero_timina', 'radiacion', 'membrana_plasmatica', 'microtubulo'];
const CELULA = ['celula_normal', 'celula_apoptotica', 'celula_senescente', 'mitocondria_citocromo_c'];

export function tamanoDe(id: string): number {
  if (id === 'proteasoma') return 170;
  if (CELULA.includes(id)) return 260;
  if (ESTRUCTURA.includes(id)) return 240;
  if (GRANDE.includes(id)) return 190;
  if (PEQUENA.includes(id)) return 110;
  return 150;
}

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/ciclo-celular`;

export type Imagen = {
  id: string;
  /** null = sin recorte: se pinta el marcador de posición. */
  src: string | null;
  familia: Familia;
  color: string;
  /** Medidas en unidades del escenario (lado mayor = tamaño de su tipo). */
  w: number;
  h: number;
  /** Sitios de fosforilación normalizados 0–1 sobre la imagen. */
  pSites: [number, number][];
};

const cache = new Map<string, Imagen>();

export function imagen(id: string): Imagen {
  const hit = cache.get(id);
  if (hit) return hit;
  const cruda = IMAGENES_CRUDAS[id];
  const familia = FAMILIA_DE[id] ?? 'estructura';
  const lado = tamanoDe(id);
  let img: Imagen;
  if (cruda) {
    const k = lado / Math.max(cruda.w, cruda.h);
    img = { id, src: `${BASE}/${id}.avif`, familia, color: FAMILIAS[familia].color, w: cruda.w * k, h: cruda.h * k, pSites: cruda.pSites };
  } else {
    if (typeof window !== 'undefined') console.warn(`[ciclo-celular] sin imagen para «${id}»: marcador de posición`);
    img = { id, src: null, familia, color: FAMILIAS[familia].color, w: lado, h: lado * 0.8, pSites: [[0.3, 0.1], [0.5, 0.05], [0.7, 0.1]] };
  }
  cache.set(id, img);
  return img;
}

/** Sitio de fosforilación `p1…p4` → punto normalizado. p4 cae a la derecha. */
export function sitio(img: Imagen, site: string): [number, number] {
  const n = Number(site.replace(/\D/g, '')) || 1;
  const s = img.pSites;
  if (n <= s.length) return s[n - 1];
  return [0.9, 0.35];
}
