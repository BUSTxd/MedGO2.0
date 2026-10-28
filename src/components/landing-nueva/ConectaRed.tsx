'use client';
// Marco de la red «segundo cerebro» en la tarjeta «Conecta»: reserva su sitio (sin saltos
// de maquetación) y baja la red y sus datos (`RedTemas` + `red-datos.ts`) sólo cuando la
// tarjeta está a punto de verse, como la animación de «Explora».

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import l from '@/styles/landingNueva.module.css';

const Red = dynamic(() => import('./RedTemas'), { ssr: false });

export default function ConectaRed({ parado }: { parado: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [montar, setMontar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cerca = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMontar(true); cerca.disconnect(); } }, { rootMargin: '300px' });
    cerca.observe(el);
    return () => cerca.disconnect();
  }, []);

  return (
    <div ref={ref} className={l.red} role="img" aria-label="Red de MedGO: cada curso con sus resúmenes, banqueos y laboratorios, unidos por los temas que comparten">
      {montar && <Red parado={parado} />}
      <ul className={l.redLeyenda} aria-hidden>
        <li><i className={l.leyCurso} />Curso</li>
        <li><i className={l.leyResumen} />Resumen</li>
        <li><i className={l.leyPregunta} />Banqueo</li>
        <li><i className={l.leyLab} />Laboratorio</li>
      </ul>
      <p className={l.redPista} aria-hidden>
        <span className={l.redPistaRaton}>Pasa el cursor por un nodo o arrástralo</span>
        <span className={l.redPistaTactil}>Toca un nodo o arrástralo</span>
      </p>
    </div>
  );
}
