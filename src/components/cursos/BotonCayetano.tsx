'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from '@/styles/cursosHubEscena.module.css';

const CLAVE = 'medgo-cayetano-pulsado';

/**
 * Cuadradito arriba a la derecha que lleva a los cursos de Cayetano. Mientras
 * nadie lo haya pulsado se sacude cada pocos segundos para hacerse notar; al
 * pulsarlo se queda quieto (se recuerda en este navegador). El texto sale al
 * pasar el mouse.
 */
export default function BotonCayetano({ deCayetano }: { deCayetano: boolean }) {
  // Quieto hasta leer el almacenamiento: así no se sacude un instante al volver.
  const [llamar, setLlamar] = useState(false);

  useEffect(() => {
    try {
      setLlamar(localStorage.getItem(CLAVE) !== '1');
    } catch {
      setLlamar(true);
    }
  }, []);

  const etiqueta = deCayetano ? 'Tus cursos de Cayetano' : '¿Estudias en Cayetano?';

  return (
    <Link
      href={deCayetano ? '/dashboard/cursos' : '/dashboard/cursos/cayetano'}
      className={`${s.cayetanoCuadro} ${llamar ? s.cayetanoLlama : ''}`}
      aria-label={etiqueta}
      onClick={() => {
        setLlamar(false);
        try { localStorage.setItem(CLAVE, '1'); } catch {}
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M6.5 11.2v4.3c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.3M21.5 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className={s.cayetanoEtiqueta}>{etiqueta}</span>
    </Link>
  );
}
