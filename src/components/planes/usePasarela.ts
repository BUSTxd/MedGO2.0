'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { Pasarela, Zona } from '@/lib/pasarela';

/**
 * La pasarela del visitante, compartida por las tarjetas de planes y el modal de
 * compra: sale del país (`/api/pago/pais`) y se puede cambiar a mano («¿No estás
 * en Perú?»). La elección manual se recuerda en la pestaña (sessionStorage).
 *
 * La zona de precios de Creem (`general` o `europa`) sale siempre del país, aunque
 * la pasarela se haya elegido a mano: es la misma que decide el servidor al cobrar.
 */
const CLAVE = 'medgo-pasarela';
let actual: Pasarela | null = null;
let zona: Zona = 'general';
let pedida = false;
const oyentes = new Set<() => void>();
const avisar = () => oyentes.forEach((f) => f());

function fijar(p: Pasarela, manual: boolean) {
  actual = p;
  if (manual) {
    try { sessionStorage.setItem(CLAVE, p); } catch { /* sin almacenamiento: vale para esta página */ }
  }
  avisar();
}

function cargar() {
  if (pedida) return;
  pedida = true;
  let guardada: Pasarela | null = null;
  try {
    const g = sessionStorage.getItem(CLAVE);
    if (g === 'mercadopago' || g === 'creem') guardada = g;
  } catch { /* sigue con el país */ }
  if (guardada) fijar(guardada, false);
  fetch('/api/pago/pais', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((j: { pasarela?: Pasarela; zona?: Zona } | null) => {
      zona = j?.zona === 'europa' ? 'europa' : 'general';
      if (guardada) avisar();
      else fijar(j?.pasarela === 'creem' ? 'creem' : 'mercadopago', false);
    })
    .catch(() => { if (!guardada) fijar('mercadopago', false); });
}

const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

/** `null` mientras se averigua el país. El tercer valor es la zona de precios de Creem. */
export function usePasarela(): [Pasarela | null, (p: Pasarela) => void, Zona] {
  const p = useSyncExternalStore(suscribir, () => actual, () => null);
  const z = useSyncExternalStore(suscribir, () => zona, () => 'general' as Zona);
  useEffect(cargar, []);
  return [p, (nueva: Pasarela) => fijar(nueva, true), z];
}
