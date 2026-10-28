'use client';
// Marco de la animación de hipersensibilidad en la tarjeta «Explora»: reserva su sitio
// (sin saltos de maquetación), baja el motor y los tejidos sólo cuando la tarjeta está a
// punto de verse y la deja en pausa en cuanto sale de pantalla o se pulsa «Pausar».

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import l from '@/styles/landingNueva.module.css';

const Animacion = dynamic(() => import('./AnimacionHipersensibilidad'), { ssr: false });

export default function ExploraHipersensibilidad({ parado }: { parado: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [montar, setMontar] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Se monta con margen (que ya esté lista al llegar) y corre sólo con ≥ 25 % a la vista.
    const cerca = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMontar(true); cerca.disconnect(); } }, { rootMargin: '300px' });
    const vista = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    cerca.observe(el);
    vista.observe(el);
    return () => { cerca.disconnect(); vista.disconnect(); };
  }, []);

  return (
    <div ref={ref} className={l.hipMarco} role="img" aria-label="Animación del laboratorio de hipersensibilidad: el alérgeno une dos IgE, el mastocito desgranula y la vénula se dilata">
      {montar && <Animacion activa={visible && !parado} />}
    </div>
  );
}
