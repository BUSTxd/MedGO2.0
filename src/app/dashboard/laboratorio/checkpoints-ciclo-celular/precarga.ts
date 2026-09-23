// Precarga de las imágenes de un escenario: al pasar por un marcador del
// anillo empieza la descarga, y el zoom de entrada espera a que estén
// decodificadas (con tope: si tardan, se entra igual y el marcador de posición
// se sustituye cuando llegan).

import type { CheckpointId, Escenario } from '@/lib/data/ciclo-celular/tipos';
import { CHECKPOINT_POR_ID, INTRO } from '@/lib/ciclo-celular/registro';
import { imagen } from '@/lib/data/ciclo-celular/familias';

const promesas = new Map<string, Promise<void>>();

function cargarUna(src: string): Promise<void> {
  let p = promesas.get(src);
  if (!p) {
    p = new Promise<void>((ok) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.decode().then(ok, ok);
    });
    promesas.set(src, p);
  }
  return p;
}

function imagenesDe(esc: Escenario): string[] {
  const ids = new Set<string>();
  for (const d of Object.values(esc.actores)) ids.add(d.img);
  for (const p of esc.pasos) for (const a of p.acciones) if (a.tipo === 'swap_image') ids.add(a.img);
  // Las que el motor pone por su cuenta (transcripción, daño, desenlaces).
  ['gen_activo', 'adn_rotura_doble', 'adn_cadena_simple', 'dimero_timina', 'celula_normal', 'celula_apoptotica', 'celula_senescente', 'membrana_plasmatica'].forEach((i) => ids.add(i));
  return [...ids].map((i) => imagen(i).src).filter((x): x is string => !!x);
}

export function precargar(id: CheckpointId | 'intro', tope = 0): Promise<void> {
  const esc = id === 'intro' ? INTRO : CHECKPOINT_POR_ID[id];
  const todas = Promise.all(imagenesDe(esc).map(cargarUna)).then(() => undefined);
  if (!tope) return todas;
  return Promise.race([todas, new Promise<void>((ok) => setTimeout(ok, tope))]);
}
