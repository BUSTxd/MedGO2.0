'use client';
// Tejidos de «Hipersensibilidad» reutilizados en el laboratorio de lupus (el
// vaso con depósitos, necrosis fibrinoide, vasculitis y trombo; la sangre con
// hemólisis; el glomérulo), con lo que el lupus les añade encima:
// · `h-vaso`: el «termómetro» del complemento (C3, C4 y CH50 que caen con el
//   consumo y suben al mejorar) y el tubo de ensayo del anticoagulante lúpico.
// Los parámetros propios del tejido los dibuja el fondo de Hipersensibilidad.

import { FondoDe as FondoHipersensibilidad } from '../hipersensibilidad/Fondos';
import { L } from '@/lib/data/lupus/colores';
import { clamp, easeBack, easeOut, tramo, v, type T } from './laminas';
import h from '@/styles/hipersensibilidad.module.css';
import s from '@/styles/lupus.module.css';

function Termometro({ t }: { t: T }) {
  const co = v(t, 'consumo'), re = v(t, 'recupera'), te = v(t, 'termometro');
  if (co <= 0.001) return null;
  const nivel = clamp(1 - 0.68 * easeOut(co) + 0.6 * easeOut(re));
  const barras = [['C3', 0], ['C4', 1], ['CH50', 2]] as const;
  return (
    <g opacity={tramo(co, 0, 0.2)}>
      <text x={1330} y={250} textAnchor="middle" className={s.lEtiquetaMayus}>Complemento en sangre</text>
      {barras.map(([n, j]) => {
        const x = 1180 + j * 150, alto = 300 * clamp(nivel - j * 0.04);
        return (
          <g key={n}>
            <rect x={x} y={290} width={80} height={300} rx={14} className={s.rielEspectro} />
            <rect x={x} y={590 - alto} width={80} height={alto} rx={14} fill={nivel < 0.5 ? '#E5484D' : '#1F9A6A'} />
            <text x={x + 40} y={630} textAnchor="middle" className={s.lEtiqueta}>{n}</text>
          </g>
        );
      })}
      <text x={1330} y={680} textAnchor="middle" className={nivel < 0.5 ? s.lEtiquetaRoja : s.lEtiquetaVerde}>{nivel < 0.5 ? 'bajo: se consume' : 'vuelve a subir'}</text>
      {te > 0.001 && (
        <g opacity={Math.min(1, te * 2)} transform={`translate(1330,780) scale(${0.85 + 0.15 * easeBack(clamp(te * 2))})`}>
          <rect x={-250} y={-34} width={500} height={68} rx={34} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>{te > 0.5 ? 'Uno de los mejores termómetros' : 'Complemento bajo = lupus activo'}</text>
        </g>
      )}
    </g>
  );
}

function Tubo({ k }: { k: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k} transform="translate(1250,470)">
      <path d="M-40,-150 L-40,120 A40,40 0 0 0 40,120 L40,-150" className={s.tuboVidrio} />
      <path d={`M-36,${10} L-36,120 A36,36 0 0 0 36,120 L36,10 Z`} fill="#E8B21E" opacity={0.5} />
      <rect x={-50} y={-162} width={100} height={18} rx={6} className={s.tuboTapa} />
      <g transform="translate(160,-40)">
        <circle r={62} className={s.reloj} />
        <path d={`M0,0 L0,-46 M0,0 L${(Math.sin(easeOut(k) * Math.PI * 1.6) * 40).toFixed(1)},${(-Math.cos(easeOut(k) * Math.PI * 1.6) * 40).toFixed(1)}`} stroke={L.lupus} strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={80} y={190} textAnchor="middle" className={s.lEtiqueta}>En el tubo: alarga el TTPa</text>
      <text x={80} y={220} textAnchor="middle" className={s.lSub}>parece un anticoagulante</text>
    </g>
  );
}

export function FondoVasoLupus({ t, reloj }: { t: T; reloj: number }) {
  return (
    <g>
      <FondoHipersensibilidad f="vaso" t={t} reloj={reloj} />
      {/* El fondo de Hipersensibilidad rotula «Tejido · ganglio»: aquí es solo tejido. */}
      <rect x={1100} y={124} width={400} height={52} className={h.intersticio} />
      <text x={1300} y={160} textAnchor="middle" className={h.rotuloTejido}>Tejido</text>
      <Termometro t={t} />
      <Tubo k={v(t, 'tubo')} />
    </g>
  );
}

export function FondoSangreLupus({ t, reloj }: { t: T; reloj: number }) {
  return <FondoHipersensibilidad f="sangre" t={t} reloj={reloj} />;
}

export function FondoGlomeruloLupus({ t, reloj }: { t: T; reloj: number }) {
  return <FondoHipersensibilidad f="glomerulo" t={t} reloj={reloj} />;
}
