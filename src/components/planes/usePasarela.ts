'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { Pasarela } from '@/lib/pasarela';

/**
 * La pasarela del visitante, compartida por las tarjetas de planes y el modal de
 * compra: sale del país (`/api/pago/pais`) y se puede cambiar a mano («¿No estás
 * en Perú?»). La elección manual se recuerda en la pestaña (sessionStorage).
 */
const CLAVE = 'medgo-pasarela';
let actual: Pasarela | null = null;
let pedida = false;
const oyentes = new Set<() => void>();

function fijar(p: Pasarela, manual: boolean) {
  actual = p;
  if (manual) {
    try { sessionStorage.setItem(CLAVE, p); } catch { /* sin almacenamiento: vale para esta página */ }
  }
  oyentes.forEach((f) => f());
}

function cargar() {
  if (pedida) return;
  pedida = true;
  try {
    const guardada = sessionStorage.getItem(CLAVE);
    if (guardada === 'mercadopago' || guardada === 'creem') { fijar(guardada, false); return; }
  } catch { /* sigue con el país */ }
  fetch('/api/pago/pais', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j: { pasarela?: Pasarela } | null) => fijar(j?.pasarela === 'creem' ? 'creem' : 'mercadopago', false))
    .catch(() => fijar('mercadopago', false));
}

const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

/** `null` mientras se averigua el país. */
export function usePasarela(): [Pasarela | null, (p: Pasarela) => void] {
  const p = useSyncExternalStore(suscribir, () => actual, () => null);
  useEffect(cargar, []);
  return [p, (nueva: Pasarela) => fijar(nueva, true)];
}
