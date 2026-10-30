'use client';
// Muro de pago DENTRO del laboratorio: al tocar un capítulo que no es del
// vistazo gratis (en la portada, el selector, «Siguiente capítulo» o la tabla)
// sale esta tarjeta encima, sin salir del lab. «Suscribirme» monta el
// `SubscribeModal` de siempre; al pagar, su `router.refresh()` trae los
// capítulos y el lab abre el que se pidió (ver LupusLab).

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PLANS, type PlanKey } from '@/lib/plans';
import type { ResumenParte } from '@/lib/lupus/contenido';
import c from '@/styles/cicloCelular.module.css';
import h from '@/styles/hipersensibilidad.module.css';

// El SDK de Mercado Pago solo baja si alguien pulsa «Suscribirme».
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

export function Candado({ className }: { className?: string }) {
  return (
    <svg className={className ?? h.candado} viewBox="0 0 24 24" fill="none" aria-label="De pago" role="img">
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  parte: ResumenParte;
  plan: PlanKey;
  /** Capítulos de pago (para el «y N más»). */
  dePago: number;
  pagando: boolean;
  onPagar: (abierto: boolean) => void;
  onCerrar: () => void;
};

export default function MuroPago({ parte, plan, dePago, pagando, onPagar, onCerrar }: Props) {
  const [montado, setMontado] = useState(false);
  const etiqueta = PLANS[plan].label;
  return (
    <div className={c.velo} role="dialog" aria-label={`${parte.nombre}: capítulo de pago`} data-bloquea-esc onClick={(e) => { if (e.target === e.currentTarget && !pagando) onCerrar(); }}>
      <div className={h.muro} style={{ ['--parte' as string]: parte.color }}>
        <span className={h.muroIcono}><Candado className={h.muroCandado} /></span>
        <p className={h.muroKicker}>Capítulo {parte.numero} · {parte.tipo}</p>
        <h3 className={h.muroTitulo}>{parte.nombre}</h3>
        <p className={h.muroPregunta}>{parte.pregunta}</p>
        <p className={h.muroTexto}>
          El vistazo gratis abre «¿Qué es el lupus?» y «¿Por qué aparece?». Este capítulo
          {dePago > 1 ? ` y los otros ${dePago - 1}` : ''} se abren con el plan {etiqueta}: el mecanismo (basura nuclear,
          interferón, linfocitos), el daño órgano por órgano, el diagnóstico y el tratamiento, narrados y animados.
        </p>
        <div className={h.muroAcciones}>
          <button type="button" className={c.btnPrim} onClick={() => { setMontado(true); onPagar(true); }}>Suscribirme al plan {etiqueta}</button>
          <button type="button" className={c.btnSec} onClick={onCerrar}>Ahora no</button>
        </div>
      </div>
      {montado && <SubscribeModal open={pagando} planKey={plan} onClose={() => onPagar(false)} />}
    </div>
  );
}
