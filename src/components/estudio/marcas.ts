'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Lo que el alumno marca en la interfaz (guardadas, estudiadas, visitadas, tamaño
 * de letra). Vive en este navegador hasta que el progreso pase a Supabase; así
 * sobrevive a cambiar de curso (que vuelve a montar la interfaz) y a recargar.
 */
const CLAVE = 'medgo-estudio-marcas-v1';

export interface Guardada { title: string; curso: string; cursoNombre: string }

interface Persistido {
  saved: Record<string, Guardada>;
  completed: string[];
  visited: string[];
  fontSize: number;
}

export interface Marcas {
  saved: Record<string, Guardada>;
  completed: Set<string>;
  visited: Set<string>;
  fontSize: number;
  visitar: (id: string) => void;
  alternarGuardada: (id: string, g: Guardada) => boolean;
  alternarEstudiada: (id: string) => void;
  setFontSize: (fn: (n: number) => number) => void;
}

const VACIO: Persistido = { saved: {}, completed: [], visited: [], fontSize: 16 };

function leer(): Persistido {
  try {
    const raw = localStorage.getItem(CLAVE);
    return raw ? { ...VACIO, ...JSON.parse(raw) } : VACIO;
  } catch {
    return VACIO;
  }
}

export function useMarcas(): Marcas {
  const [p, setP] = useState<Persistido>(VACIO);
  const [cargado, setCargado] = useState(false);
  useEffect(() => { setP(leer()); setCargado(true); }, []);
  useEffect(() => {
    if (!cargado) return;
    try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* sin almacenamiento: queda en memoria */ }
  }, [p, cargado]);

  const visitar = useCallback((id: string) => {
    setP((x) => (x.visited.includes(id) ? x : { ...x, visited: [...x.visited, id] }));
  }, []);
  /** Devuelve si queda guardada, según el estado que ve este render. */
  const alternarGuardada = useCallback((id: string, g: Guardada) => {
    const guardar = !p.saved[id];
    setP((x) => {
      const saved = { ...x.saved };
      if (guardar) saved[id] = g; else delete saved[id];
      return { ...x, saved };
    });
    return guardar;
  }, [p.saved]);
  const alternarEstudiada = useCallback((id: string) => {
    setP((x) => ({ ...x, completed: x.completed.includes(id) ? x.completed.filter((c) => c !== id) : [...x.completed, id] }));
  }, []);
  const setFontSize = useCallback((fn: (n: number) => number) => setP((x) => ({ ...x, fontSize: fn(x.fontSize) })), []);

  // Mismo Set mientras no cambie la lista: hay efectos que dependen de ellos.
  const completed = useMemo(() => new Set(p.completed), [p.completed]);
  const visited = useMemo(() => new Set(p.visited), [p.visited]);

  return {
    saved: p.saved,
    completed,
    visited,
    fontSize: p.fontSize,
    visitar, alternarGuardada, alternarEstudiada, setFontSize,
  };
}
