'use client';
// Volumen de la voz grabada, común a los laboratorios con narración (lo usa cada
// `useVoz`). Lo que suena es `ganancia × nivel²`: la ganancia es de los fundidos
// (0 entre frases, 1 hablando) y el nivel es del alumno, así que mover la barra a
// mitad de un fundido, o con la voz callada, no hace sonar nada que no toque. El
// cuadrado es porque el oído no es lineal: con `nivel` a secas, media barra sonaría
// casi igual que la barra entera.

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const CLAVE = 'medgo-voz-volumen';

export function useVolumen(audio: RefObject<HTMLAudioElement | null>) {
  const [volumen, setVolumen] = useState(1);
  // En iOS el volumen es de solo lectura (manda el botón del teléfono): sin barra.
  const [ajustable, setAjustable] = useState(true);
  const nivel = useRef(1);
  // El último nivel que no era cero: al que vuelve el altavoz.
  const ultimo = useRef(1);
  const ganancia = useRef(1);

  useEffect(() => {
    const prueba = new Audio();
    prueba.volume = 0.5;
    if (prueba.volume !== 0.5) setAjustable(false);
    try {
      const guardado = parseFloat(localStorage.getItem(CLAVE) ?? '');
      if (guardado > 0 && guardado <= 1) {
        nivel.current = ultimo.current = guardado;
        setVolumen(guardado);
      }
    } catch { /* sin almacenamiento */ }
  }, []);

  const aplicar = useCallback((a: HTMLAudioElement, g: number) => {
    ganancia.current = g;
    a.volume = g * nivel.current * nivel.current;
  }, []);

  const cambiar = useCallback((v: number) => {
    nivel.current = v;
    setVolumen(v);
    // El cero no se guarda: recargar la página no debe dejar la voz muda sin aviso.
    if (v > 0) {
      ultimo.current = v;
      try { localStorage.setItem(CLAVE, String(v)); } catch { /* sin almacenamiento */ }
    }
    if (audio.current) aplicar(audio.current, ganancia.current);
  }, [audio, aplicar]);

  /** Con la barra en cero, devuelve el último volumen. Dice si había algo que devolver. */
  const restaurar = useCallback(() => {
    if (nivel.current > 0) return false;
    cambiar(ultimo.current);
    return true;
  }, [cambiar]);

  return { volumen, ajustable, ganancia, aplicar, cambiar, restaurar };
}
