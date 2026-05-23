'use client';
import { useEffect } from 'react';

interface Props {
  /** Identificador único del laboratorio (slug de la página). */
  labId: string;
}

const COUNT_KEY = 'medgo_lab_visits';

/**
 * Incrementa el contador global de "exámenes" (visitas a laboratorio).
 * Para evitar inflar el contador con reloads/F5, solo se incrementa una vez
 * por sesión y por lab — usamos sessionStorage como flag.
 */
export default function TrackLabVisit({ labId }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sessionKey = `medgo_lab_seen_${labId}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      const current = Number(localStorage.getItem(COUNT_KEY) ?? '0');
      const next = Number.isFinite(current) ? current + 1 : 1;
      localStorage.setItem(COUNT_KEY, String(next));
      sessionStorage.setItem(sessionKey, '1');
    } catch {}
  }, [labId]);

  return null;
}
