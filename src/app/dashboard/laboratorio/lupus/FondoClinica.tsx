'use client';
// Láminas del capítulo 7 (piel, mucosas, articulaciones y sistema nervioso). Sin
// fondo y sin tarjetas: cada dato es una imagen y el texto queda en segundo plano.
// Acero, vidrio y latón como en «La basura nuclear». Sin `filter`.
// · `sintomas`: batería que se agota, termómetro que sube, báscula que baja, y la
//   fatiga que no sale en ningún análisis.
// · `manos`: las manos con las articulaciones inflamadas, la radiografía comparada
//   y la desviación de Jaccoud; en «otras pistas», el cuero cabelludo, tres manos
//   con el Raynaud, las uñas y la urticaria.
// · `cutaneos`: tres lentes, cuánto del cuerpo toca cada forma y las dos cuñas
//   (cuanta más cicatriz, menos enfermedad sistémica).
// · `malar`: el retrato con el exantema; pliegue respetado frente a rosácea.
// · `boca`: la paciente abre la boca; la lupa muestra las úlceras del paladar.
// · `torso`: lupus subagudo (la cara, respetada) con sus lupas y sus marcadores.
// · `discoide`: la placa rotulada, la alopecia, los anticuerpos y la banda lúpica.
// · `neuro`: el cerebro con sus focos, el trazado y lo que hay que descartar.

import { memo, type ReactNode } from 'react';
import { DefsSg, Lente, Letrero, Sello } from './FondoDano2';
import { IgG } from './Celulas';
import { clamp, easeBack, easeInOut, easeOut, FlechaSuave, IconoOrgano, tramo, v, type T } from './laminas';
import { Retrato } from './Retrato';
import s from '@/styles/lupus.module.css';

const TAU = Math.PI * 2;
const hash = (i: number, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const f1 = (n: number) => n.toFixed(1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const halo = `${s.lSubChico} ${s.conHalo}`;
const rotulo = `${s.lEtiqueta} ${s.conHalo}`;
const subRotulo = `${s.lSub} ${s.conHalo}`;

/** Contorno cerrado y suave con `n` lóbulos irregulares. */
export function lobulos(r: number, n: number, amp: number, sem: number) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * TAU, q = 1 + amp * (hash(i, sem) - 0.5) * 2;
    return [Math.cos(a) * r * q, Math.sin(a) * r * q];
  });
  const medio = (i: number) => { const p = pts[i % n], o = pts[(i + 1) % n]; return [(p[0] + o[0]) / 2, (p[1] + o[1]) / 2]; };
  const ini = medio(n - 1);
  return `M${f1(ini[0])},${f1(ini[1])} ${pts.map((p, i) => { const m = medio(i); return `Q${f1(p[0])},${f1(p[1])} ${f1(m[0])},${f1(m[1])}`; }).join(' ')} Z`;
}

export const DefsPl = memo(function DefsPl() {
  const cuatro = (id: string, c: [string, string, string, string]) => (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={c[0]} /><stop offset="0.38" stopColor={c[1]} /><stop offset="0.72" stopColor={c[2]} /><stop offset="1" stopColor={c[3]} /></linearGradient>
  );
  return (
    <defs>
      {cuatro('pl-dedo', ['#D6A588', '#F8DCC8', '#F0CAB0', '#C49374'])}
      {cuatro('pl-torso', ['#D49F7E', '#F2CFB5', '#E6B89A', '#BD8669'])}
      {cuatro('pl-ray0', ['#D9D7D0', '#FCFBF7', '#ECEAE4', '#CBC9C2'])}
      {cuatro('pl-ray1', ['#3F5AA2', '#8EAAE6', '#6C88CE', '#37508F'])}
      {cuatro('pl-ray2', ['#B92648', '#F2748E', '#DE4F70', '#A82040'])}
      <linearGradient id="pl-dorso" x1="0" x2="1" y1="0" y2="0.3"><stop offset="0" stopColor="#D8A98D" /><stop offset="0.4" stopColor="#F7DAC5" /><stop offset="0.75" stopColor="#EFC8AD" /><stop offset="1" stopColor="#CB9A7C" /></linearGradient>
      <linearGradient id="pl-tela" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#D2DEE8" /><stop offset="1" stopColor="#8BA1B4" /></linearGradient>
      <linearGradient id="pl-una" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFF1EA" /><stop offset="1" stopColor="#F2C4B4" /></linearGradient>
      <radialGradient id="pl-infl"><stop offset="0" stopColor="#E0263C" stopOpacity="0.7" /><stop offset="0.55" stopColor="#E5484D" stopOpacity="0.38" /><stop offset="1" stopColor="#E5484D" stopOpacity="0" /></radialGradient>
      <radialGradient id="pl-placa" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stopColor="#2C3A52" /><stop offset="1" stopColor="#0C121E" /></radialGradient>
      <linearGradient id="pl-hueso" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#F4F7FA" /><stop offset="0.24" stopColor="#B6C2D0" /><stop offset="0.76" stopColor="#AEBBCA" /><stop offset="1" stopColor="#EDF2F6" /></linearGradient>
      <radialGradient id="pl-piel" cx="0.42" cy="0.36" r="0.8"><stop offset="0" stopColor="#FBE2CF" /><stop offset="1" stopColor="#E0B296" /></radialGradient>
      <linearGradient id="pl-paladar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F7AEB4" /><stop offset="1" stopColor="#DB6F82" /></linearGradient>
      <linearGradient id="pl-lengua" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F19AA4" /><stop offset="1" stopColor="#BE5469" /></linearGradient>
      <linearGradient id="pl-diente" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#FFFEF8" /><stop offset="1" stopColor="#E9DEC2" /></linearGradient>
      <radialGradient id="pl-sol" cx="0.42" cy="0.4" r="0.65"><stop offset="0" stopColor="#FFF6C8" /><stop offset="0.65" stopColor="#FFC93E" /><stop offset="1" stopColor="#F09A1C" /></radialGradient>
      <linearGradient id="pl-rayo" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFC93E" stopOpacity="0.5" /><stop offset="1" stopColor="#FFC93E" stopOpacity="0" /></linearGradient>
      <radialGradient id="pl-malar"><stop offset="0" stopColor="#D42650" stopOpacity="0.72" /><stop offset="0.68" stopColor="#E0386A" stopOpacity="0.46" /><stop offset="1" stopColor="#E0526E" stopOpacity="0" /></radialGradient>
      <radialGradient id="pl-eritema"><stop offset="0" stopColor="#E98094" /><stop offset="0.72" stopColor="#D8486A" /><stop offset="1" stopColor="#A82B4E" /></radialGradient>
      <linearGradient id="pl-mercurio" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#A81828" /><stop offset="0.42" stopColor="#F4606A" /><stop offset="1" stopColor="#9E1626" /></linearGradient>
      <linearGradient id="pl-if" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0A1A10" /><stop offset="0.5" stopColor="#0E1A12" /><stop offset="1" stopColor="#060D08" /></linearGradient>
      <linearGradient id="pl-silueta" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#AEB7C8" /><stop offset="1" stopColor="#7D879C" /></linearGradient>
      <linearGradient id="pl-cunaR" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#C2264A" /><stop offset="1" stopColor="#F08CA0" /></linearGradient>
      <linearGradient id="pl-cunaC" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#E8C8B4" /><stop offset="1" stopColor="#7A4A3C" /></linearGradient>
      <radialGradient id="pl-cuerpoB" cx="0.4" cy="0.3" r="0.85"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CBD3DE" /></radialGradient>
    </defs>
  );
});

const Base = () => <g><DefsSg /><DefsPl /></g>;

/** Nombre y aclaración, en segundo plano respecto a la imagen. */
export function Nota({ x, y, t, sub, k = 1, fin = 'middle', tam = 21 }: { x: number; y: number; t: string; sub?: string; k?: number; fin?: 'middle' | 'start' | 'end'; tam?: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0.3, 0.9)}>
      <text x={x} y={y} textAnchor={fin} className={rotulo} style={{ fontSize: tam }}>{t}</text>
      {sub && <text x={x} y={y + 25} textAnchor={fin} className={halo}>{sub}</text>}
    </g>
  );
}

const Entra = ({ k, x, y, children }: { k: number; x: number; y: number; children: ReactNode }) => k <= 0.001 ? null : (
  <g opacity={tramo(k, 0, 0.35)} transform={`translate(${x},${f1(y + (1 - easeOut(clamp(k))) * 26)}) scale(${(0.82 + 0.18 * easeBack(clamp(k))).toFixed(3)})`}>{children}</g>
);

/** Un objeto suelto que levita con su sombra en el suelo: sin aro ni disco detrás. */
export function Flotante({ x, y, k, rl, fase = 0, esc = 1.4, alto = 62, children }: { x: number; y: number; k: number; rl: number; fase?: number; esc?: number; alto?: number; children: ReactNode }) {
  if (k <= 0.001) return null;
  const q = clamp(k), sube = Math.sin(rl / 760 + fase) * 7;
  return (
    <g opacity={tramo(q, 0, 0.35)}>
      <ellipse cx={x} cy={y + alto + 10} rx={(34 + esc * 10) * (1 + sube * 0.012)} ry={6} className={s.sombraSuave} />
      <g transform={`translate(${x},${f1(y + sube + (1 - easeOut(q)) * 22)}) scale(${(esc * (0.72 + 0.28 * easeBack(q))).toFixed(3)})`}>{children}</g>
    </g>
  );
}

// ─── Paso 0 · lo que se nota primero ──────────────────────────────────────────

/** Batería de verdad: carcasa de acero, cinco celdas que se apagan una a una. */
function Bateria({ k, gasta, rl }: { k: number; gasta: number; rl: number }) {
  const nivel = 1 - 0.88 * easeInOut(gasta), celdas = nivel * 5, parpadea = gasta > 0.92 ? 0.55 + 0.45 * Math.sin(rl / 170) : 1;
  const color = nivel > 0.55 ? ['#7BE08E', '#27A85E'] : nivel > 0.28 ? ['#FFD56A', '#E0921E'] : ['#FF8A8A', '#D1293D'];
  return (
    <Entra k={k} x={290} y={340}>
      <g transform="scale(1.3)">
      <ellipse cx={0} cy={108} rx={140} ry={11} className={s.sombraSuave} />
      <rect x={-150} y={-84} width={276} height={168} rx={26} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.4} />
      <rect x={-136} y={-70} width={248} height={140} rx={16} fill="#1A2030" />
      <rect x={124} y={-36} width={30} height={72} rx={9} fill="url(#sg-laton)" stroke="#6E4C14" strokeWidth={1.1} />
      {[0, 1, 2, 3, 4].map((i) => {
        const q = clamp(celdas - i), x = -124 + i * 47;
        return (
          <g key={i}>
            <rect x={x} y={-58} width={40} height={116} rx={6} fill="#2A3144" />
            {q > 0.01 && <rect x={x} y={-58 + 116 * (1 - q)} width={40} height={116 * q} rx={6} fill={color[1]} opacity={i === 0 ? parpadea : 1} />}
            {q > 0.01 && <rect x={x + 5} y={-54 + 116 * (1 - q)} width={11} height={Math.max(0, 108 * q)} rx={5} fill={color[0]} opacity={(i === 0 ? parpadea : 1) * 0.8} />}
          </g>
        );
      })}
      <path d="M-120,-76 C-60,-82 40,-82 100,-76" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      {[0, 1, 2].map((j) => {
        const f = (rl / 2100 + j / 3) % 1;
        return <text key={j} x={70 + f * 70} y={-96 - f * 70} textAnchor="middle" className={s.conHalo} style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 18 + f * 26, fill: '#5B6BA8' }} opacity={tramo(gasta, 0.5, 0.9) * Math.sin(f * Math.PI)}>z</text>;
      })}
      </g>
    </Entra>
  );
}

/** Termómetro de vidrio: el mercurio sube y salen ondas de calor. */
function Termometro({ k, sube, rl }: { k: number; sube: number; rl: number }) {
  const y0 = 110, y1 = -150, n = lerp(y0, lerp(y0, y1, 0.74), easeInOut(sube)) + Math.sin(rl / 700) * 1.5;
  return (
    <Entra k={k} x={800} y={350}>
      <ellipse cx={0} cy={188} rx={60} ry={8} className={s.sombraSuave} />
      {[-1, 1].map((l) => [0, 1, 2].map((j) => {
        const f = (rl / 1700 + j / 3 + (l > 0 ? 0.16 : 0)) % 1;
        return <path key={`${l}${j}`} d="M0,0 c-11,-13 11,-24 0,-37 c-11,-13 11,-24 0,-37" fill="none" stroke="#F0584A" strokeWidth={5} strokeLinecap="round" opacity={tramo(sube, 0.25, 0.8) * Math.sin(f * Math.PI) * 0.8} transform={`translate(${l > 0 ? 112 + j * 16 : -(72 + j * 16)},${f1(60 - f * 80 - j * 22)})`} />;
      }))}
      <path d="M-25,-172 A25,25 0 0 1 25,-172 L25,92 A52,52 0 1 1 -25,92 Z" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={4} />
      <path d="M-25,-172 A25,25 0 0 1 25,-172 L25,92 A52,52 0 1 1 -25,92 Z" fill="#FFF" opacity={0.42} />
      <rect x={-10} y={f1(n)} width={20} height={Math.max(0, 118 - n)} fill="url(#pl-mercurio)" />
      <circle cy={f1(n)} r={10} fill="#F4606A" />
      <circle cy={132} r={38} fill="url(#pl-mercurio)" />
      <circle cx={-13} cy={118} r={9} fill="#FFF" opacity={0.65} />
      {Array.from({ length: 13 }, (_, i) => { const y = -160 + i * 21, g = i % 3 === 0; return <line key={i} x1={32} y1={y} x2={g ? 58 : 46} y2={y} stroke="#6E7789" strokeWidth={g ? 3.4 : 2.2} strokeLinecap="round" />; })}
      {([['39', -160], ['38', -97], ['37', -34], ['36', 29]] as const).map(([n2, y]) => <text key={n2} x={66} y={y} dy="0.35em" className={s.conHalo} style={{ fontFamily: 'var(--sans)', fontSize: 19, fontWeight: 700, fill: 'var(--texto-2)' }}>{n2}</text>)}
      <rect x={-20} y={-178} width={8} height={260} rx={4} fill="#FFF" opacity={0.85} />
      <path d="M-46,118 A48,48 0 0 1 -28,88" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
    </Entra>
  );
}

/** Báscula de baño vista de frente: la aguja retrocede y la flecha cae. */
function Bascula({ k, baja, rl }: { k: number; baja: number; rl: number }) {
  const ang = lerp(46, -48, easeInOut(baja)) + Math.sin(rl / 620) * 1.2;
  return (
    <Entra k={k} x={1300} y={350}>
      <ellipse cx={0} cy={176} rx={170} ry={12} className={s.sombraSuave} />
      <path d="M-158,-140 C-158,-168 -136,-180 -110,-180 H110 C136,-180 158,-168 158,-140 L170,136 C172,158 152,170 130,170 H-130 C-152,170 -172,158 -170,136 Z" fill="url(#pl-cuerpoB)" stroke="#6E7789" strokeWidth={2.4} />
      <path d="M-132,10 C-60,0 60,0 132,10 L142,132 C143,146 130,152 118,152 H-118 C-130,152 -143,146 -142,132 Z" fill="#3A4256" />
      <path d="M-120,26 H120 M-126,52 H126 M-130,78 H130 M-134,104 H134 M-136,130 H136" stroke="#5C6577" strokeWidth={2} opacity={0.7} />
      {/* Huellas sobre la alfombrilla */}
      {[-52, 52].map((x) => (
        <g key={x} transform={`translate(${x},82)`} fill="#E7ECF3" opacity={0.92}>
          <path d="M-16,-22 C-22,-6 -18,30 0,36 C18,30 22,-6 16,-22 C10,-34 -10,-34 -16,-22 Z" />
          {[-14, -7, 0, 7, 14].map((d, i) => <circle key={d} cx={d} cy={-40 + Math.abs(d) * 0.3} r={i === 2 ? 6 : 4.6} />)}
        </g>
      ))}
      {/* Esfera */}
      <circle cy={-82} r={86} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.2} />
      <circle cy={-82} r={74} fill="#FFFDF8" />
      <path d="M-58,-52 A65,65 0 0 1 58,-52" fill="none" stroke="#E6EAF0" strokeWidth={16} />
      <path d={`M${f1(Math.sin(-0.84) * 65)},${f1(-82 - Math.cos(-0.84) * 65)} A65,65 0 0 1 ${f1(Math.sin(-0.3) * 65)},${f1(-82 - Math.cos(-0.3) * 65)}`} fill="none" stroke="#E5484D" strokeWidth={16} opacity={tramo(baja, 0.5, 1) * 0.65} />
      {Array.from({ length: 19 }, (_, i) => { const a = ((-54 + i * 6) * Math.PI) / 180, g = i % 3 === 0; return <line key={i} x1={Math.sin(a) * (g ? 55 : 60)} y1={-82 - Math.cos(a) * (g ? 55 : 60)} x2={Math.sin(a) * 71} y2={-82 - Math.cos(a) * 71} stroke="#3A4256" strokeWidth={g ? 3 : 1.6} />; })}
      <text y={-44} textAnchor="middle" style={{ fontFamily: 'var(--sans)', fontSize: 19, fontWeight: 800, fill: '#5B6475' }}>kg</text>
      <g transform={`translate(0,-82) rotate(${f1(ang)})`}><path d="M-4,12 L0,-66 L4,12 Z" fill="#D1293D" stroke="#7A1420" strokeWidth={0.8} /></g>
      <circle cy={-82} r={9} fill="url(#sg-pomo)" stroke="#6E4C14" strokeWidth={1} />
      <path d="M-58,-114 A70,70 0 0 1 -26,-142" fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      <g transform={`translate(214,${f1(-24 + easeInOut(baja) * 74 + Math.abs(Math.sin(rl / 420)) * 5)})`} opacity={tramo(baja, 0.1, 0.5)}>
        <path d="M-10,-44 H10 V8 H24 L0,42 L-24,8 H-10 Z" fill="#E5484D" stroke="#FFF" strokeWidth={2.4} strokeLinejoin="round" />
      </g>
    </Entra>
  );
}

/** La fatiga: una persona agotada y un informe en el que todo sale normal. */
function FatigaOculta({ k, foco, rl }: { k: number; foco: number; rl: number }) {
  if (k <= 0.001) return null;
  const late = 1 + 0.03 * foco * Math.sin(rl / 300);
  return (
    <g opacity={tramo(k, 0, 0.4)}>
      <g transform={`translate(540,${f1(610 + (1 - easeOut(k)) * 20)}) scale(${(0.3 * late).toFixed(3)})`}>
        <Retrato id="fat" soloCabeza />
        {/* Párpados caídos */}
        {[-76, 76].map((x) => <path key={x} d={`M${x - 42},454 C${x - 20},432 ${x + 20},432 ${x + 42},454 L${x + 42},468 C${x + 20},478 ${x - 20},478 ${x - 42},468 Z`} fill="#E7B99B" stroke="#8E5A44" strokeWidth={3} />)}
        {[-76, 76].map((x) => <ellipse key={x} cx={x} cy={500} rx={46} ry={10} fill="#8E5A9A" opacity={0.28} />)}
      </g>
      {[0, 1, 2].map((j) => { const f = (rl / 2300 + j / 3) % 1; return <text key={j} x={620 + f * 56} y={650 - f * 62} className={s.conHalo} style={{ fontFamily: 'var(--sans)', fontWeight: 800, fontSize: 16 + f * 18, fill: '#5B6BA8' }} opacity={Math.sin(f * Math.PI)}>z</text>; })}
      <Nota x={540} y={884} t="De lo más frecuente" sub="e incapacitante" k={k} tam={24} />
      {/* Informe con todo normal */}
      <g transform={`translate(1000,${f1(752 + (1 - easeOut(k)) * 20)}) rotate(2)`}>
        <rect x={-92} y={-112} width={184} height={226} rx={12} fill="#7A5A3A" stroke="#4E3820" strokeWidth={1.4} />
        <rect x={-80} y={-100} width={160} height={204} rx={4} fill="#FFFEFA" stroke="#B9AE92" strokeWidth={1} />
        <rect x={-34} y={-122} width={68} height={24} rx={6} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1.2} />
        {[-70, -32, 6, 44, 82].map((y, i) => {
          const q = tramo(k, 0.3 + i * 0.1, 0.5 + i * 0.1);
          return (
            <g key={y} opacity={q}>
              <rect x={-66} y={y - 5} width={i % 2 ? 58 : 76} height={7} rx={3} fill="#AEB7C8" />
              <rect x={-66} y={y + 7} width={i % 2 ? 40 : 30} height={4} rx={2} fill="#D5DAE3" />
              <circle cx={52} cy={y + 2} r={13} fill="#1F9A6A" />
              <path d="M45,2 L50,8 L60,-5" transform={`translate(0,${y})`} fill="none" stroke="#FFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
      </g>
      <text x={776} y={760} textAnchor="middle" className={s.safSigno} style={{ fontSize: 66, fill: 'var(--texto-2)' }} opacity={tramo(k, 0.3, 0.8)}>≠</text>
      <Nota x={1000} y={906} t="No aparece en ningún análisis" k={k} tam={24} />
    </g>
  );
}

export function FondoSintomas({ t, reloj }: { t: T; reloj: number }) {
  const f1k = v(t, 'f1'), f2k = v(t, 'f2'), f3k = v(t, 'f3'), f4k = v(t, 'f4');
  return (
    <g>
      <Base />
      <Bateria k={f1k} gasta={v(t, 'f1b')} rl={reloj} />
      <Termometro k={f2k} sube={v(t, 'f2b')} rl={reloj} />
      <Bascula k={f3k} baja={v(t, 'f3b')} rl={reloj} />
      <Nota x={300} y={574} t="Fatiga" k={f1k} tam={28} />
      <Nota x={800} y={574} t="Fiebre" k={f2k} tam={28} />
      <Nota x={1300} y={574} t="Pérdida de peso" k={f3k} tam={28} />
      <FatigaOculta k={f4k} foco={v(t, 'f5')} rl={reloj} />
    </g>
  );
}

// ─── Paso 1 · manos ───────────────────────────────────────────────────────────

/** Dedos de una mano derecha vista por el dorso: [x base, largo, ángulo]. */
const DEDOS: [number, number, number][] = [[-78, 150, -8], [-30, 190, -2], [16, 205, 2], [60, 185, 6], [104, 120, 38]];

/** Dedo que se afina hacia la yema, con su uña, sus pliegues y su costado en sombra. */
function Dedo({ l, pulgar, punta }: { l: number; pulgar: boolean; punta?: { col: string; k: number } }) {
  const w0 = pulgar ? 22 : 20, w1 = pulgar ? 17 : 15, corte = pulgar ? 0.45 : 0.42;
  const contorno = `M${-w0},24 C${-w0},${-l * 0.4} ${-w1 - 1},${-l * 0.7} ${-w1},${-l + 18} C${-w1},${-l - 2} ${w1},${-l - 2} ${w1},${-l + 18} C${w1 + 1},${-l * 0.7} ${w0},${-l * 0.4} ${w0},24 C${w0},46 ${-w0},46 ${-w0},24 Z`;
  const yc = -l * corte, wc = w1 + (w0 - w1) * 0.72;
  return (
    <g>
      <path d={contorno} fill="url(#pl-dedo)" />
      {/* La parte distal del dedo cambia de color con una raya nítida */}
      {punta && punta.k > 0.001 && <path d={`M${-wc},${yc} C${-wc + 1},${-l * 0.7} ${-w1 - 1},${-l * 0.8} ${-w1},${-l + 18} C${-w1},${-l - 2} ${w1},${-l - 2} ${w1},${-l + 18} C${w1 + 1},${-l * 0.8} ${wc - 1},${-l * 0.7} ${wc},${yc} Q0,${yc + 8} ${-wc},${yc} Z`} fill={punta.col} opacity={punta.k} />}
      <path d={`M${-w0},2 C${-w0},${-l * 0.4} ${-w1 - 1},${-l * 0.7} ${-w1},${-l + 18} C${-w1},${-l - 2} ${w1},${-l - 2} ${w1},${-l + 18} C${w1 + 1},${-l * 0.7} ${w0},${-l * 0.4} ${w0},2`} fill="none" stroke="#A9765C" strokeWidth={1.5} />
      <path d={`M${-w1 * 0.25},-8 C${-w1 * 0.3},${-l * 0.4} ${-w1 * 0.3},${-l * 0.7} ${-w1 * 0.25},${-l + 34}`} fill="none" stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={0.24} />
      <path d={`M${-w1 + 3.4},${-l + 28} C${-w1 + 2},${-l + 4} ${w1 - 2},${-l + 4} ${w1 - 3.4},${-l + 28} C${w1 - 8},${-l + 33} ${-w1 + 8},${-l + 33} ${-w1 + 3.4},${-l + 28} Z`} fill="url(#pl-una)" stroke="#BE8E7A" strokeWidth={1.1} opacity={punta ? 0.72 : 1} />
      <path d={`M${-w1 + 7},${-l + 28} C${-w1 + 8},${-l + 21} ${w1 - 8},${-l + 21} ${w1 - 7},${-l + 28} C${w1 - 10},${-l + 31} ${-w1 + 10},${-l + 31} ${-w1 + 7},${-l + 28} Z`} fill="#FFF" opacity={0.55} />
      {(pulgar ? [0.45] : [0.42, 0.68]).map((f) => [-8, -3, 2, 7].map((d, j) => (
        <path key={`${f}-${j}`} d={`M${-12 + Math.abs(d) * 0.3},${-l * f + d} Q0,${-l * f + d - 4 + j} ${12 - Math.abs(d) * 0.3},${-l * f + d}`} fill="none" stroke="#B5846A" strokeWidth={1.2} strokeLinecap="round" opacity={0.65 - Math.abs(d) * 0.04} />
      )))}
    </g>
  );
}

const MANO_DORSO = 'M-98,6 C-104,60 -96,120 -66,176 C-60,196 -62,224 -66,300 L74,300 C70,224 68,196 74,176 C94,140 126,120 132,84 C130,62 116,42 108,10 C70,-16 -60,-16 -98,6 Z';

const DorsoFijo = memo(function DorsoFijo() {
  return (
    <g>
      <path d={MANO_DORSO} fill="url(#pl-dorso)" stroke="#A9765C" strokeWidth={1.5} />
      <path d="M-74,12 C-60,70 -30,130 -6,178 M-28,6 C-20,70 -12,130 -2,178 M16,6 C14,70 8,130 2,178 M60,8 C50,70 28,130 8,178" fill="none" stroke="#C3916F" strokeWidth={4} strokeLinecap="round" opacity={0.4} transform="translate(2,1)" />
      <path d="M-74,12 C-60,70 -30,130 -6,178 M-28,6 C-20,70 -12,130 -2,178 M16,6 C14,70 8,130 2,178 M60,8 C50,70 28,130 8,178" fill="none" stroke="#FFF1E4" strokeWidth={3} strokeLinecap="round" opacity={0.75} />
      <path d="M-46,52 C-34,84 -56,120 -30,150 M-30,150 C-14,170 -30,196 -24,240 M36,44 C28,76 52,104 30,136 C20,152 34,190 30,244 M-30,150 C-6,132 12,142 30,136" fill="none" stroke="#6E8CC0" strokeWidth={4.4} strokeLinecap="round" opacity={0.36} />
      {[-78, -30, 16, 60].map((x) => [10, 16, 22].map((r) => <path key={`${x}-${r}`} d={`M${x - r},6 Q${x},${6 - r * 0.8} ${x + r},6`} fill="none" stroke="#B5846A" strokeWidth={1.1} opacity={0.4} />))}
      <path d="M-60,212 Q6,222 72,212 M-60,226 Q6,236 72,226" fill="none" stroke="#B5846A" strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
      <path d="M-74,268 C-20,280 40,280 82,268 L90,332 L-82,332 Z" fill="url(#pl-tela)" stroke="#6E8496" strokeWidth={1.4} />
      <path d="M-72,276 C-20,288 40,288 80,276" fill="none" stroke="#6E8496" strokeWidth={1.4} strokeDasharray="5 4" opacity={0.7} />
      <path d="M-40,296 V330 M0,300 V332 M40,296 V330" fill="none" stroke="#6E8496" strokeWidth={1.4} opacity={0.35} />
    </g>
  );
});

function Mano({ cx, cy, espejo, artic, desvio, rl }: { cx: number; cy: number; espejo: boolean; artic: number; desvio: number; rl: number }) {
  const late = 1 + 0.08 * Math.sin(rl / 420);
  return (
    <g transform={`translate(${cx},${cy}) scale(${espejo ? -1 : 1},1)`}>
      <DorsoFijo />
      {DEDOS.map(([x, l, a], i) => {
        const pulgar = i === 4;
        return (
          <g key={i} transform={`translate(${x},${pulgar ? 60 : 0}) rotate(${f1(a + (pulgar ? 0 : desvio * 22))})`}>
            <Dedo l={l} pulgar={pulgar} />
            {artic > 0.01 && [0, pulgar ? 0.45 : 0.42].map((f, j) => (
              <g key={j} opacity={artic}>
                <circle cy={-l * f} r={31 * late} fill="url(#pl-infl)" />
                <circle cy={-l * f} r={16} fill="none" stroke="#D1293D" strokeWidth={2.4} opacity={0.8} />
              </g>
            ))}
          </g>
        );
      })}
      {artic > 0.01 && (
        <g opacity={artic}>
          <ellipse cx={4} cy={218} rx={92 * late} ry={40 * late} fill="url(#pl-infl)" />
          <ellipse cx={4} cy={218} rx={68} ry={20} fill="none" stroke="#D1293D" strokeWidth={2.4} opacity={0.8} />
        </g>
      )}
    </g>
  );
}

function Radiografia({ x, y, erosiva, titulo, sub, k }: { x: number; y: number; erosiva: boolean; titulo: string; sub: string; k: number }) {
  const ARRIBA = 'M-30,-150 L-26,-72 C-42,-50 -36,-24 0,-22 C36,-24 42,-50 26,-72 L30,-150 Z';
  const ABAJO = 'M-34,150 L-26,84 C-44,62 -46,36 -38,26 C-20,38 20,38 38,26 C46,36 44,62 26,84 L34,150 Z';
  const dy = erosiva ? 8 : 0;
  return (
    <g transform={`translate(${x},${y})`}>
      <ellipse cx={4} cy={166} rx={120} ry={7} className={s.sombraSuave} />
      <rect x={-138} y={-158} width={276} height={316} rx={20} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      <rect x={-130} y={-150} width={260} height={300} rx={14} fill="url(#pl-placa)" />
      <clipPath id={`pl-c-rx${erosiva ? 1 : 0}`}><rect x={-130} y={-150} width={260} height={300} rx={14} /></clipPath>
      <g clipPath={`url(#pl-c-rx${erosiva ? 1 : 0})`}>
        <ellipse cx={0} cy={0} rx={erosiva ? 92 : 70} ry={110} fill="#FFF" opacity={erosiva ? 0.11 : 0.06} />
        <g transform={`translate(0,${dy})`}>
          <path d={ARRIBA} fill="url(#pl-hueso)" stroke="#F4F7FA" strokeWidth={2.2} opacity={erosiva ? 0.86 : 1} />
          <path d="M-13,-150 L-11,-76 C-18,-54 -12,-40 0,-38 C12,-40 18,-54 11,-76 L13,-150 Z" fill="#54657E" opacity={0.75} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-20 + i * 5},-36 C${-22 + i * 5},-48 ${-16 + i * 4},-58 ${-10 + i * 2.5},-70`} fill="none" stroke="#DCE4EC" strokeWidth={1} opacity={0.5} />)}
        </g>
        <path d={ABAJO} fill="url(#pl-hueso)" stroke="#F4F7FA" strokeWidth={2.2} opacity={erosiva ? 0.86 : 1} />
        <path d="M-14,150 L-12,90 C-20,72 -22,56 -14,48 C-6,52 6,52 14,48 C22,56 20,72 12,90 L14,150 Z" fill="#54657E" opacity={0.75} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-20 + i * 5},42 C${-22 + i * 5},54 ${-16 + i * 4},64 ${-10 + i * 2.5},78`} fill="none" stroke="#DCE4EC" strokeWidth={1} opacity={0.5} />)}
        {erosiva && [[-33, -24 + dy, 0], [33, -28 + dy, 1], [-40, 36, 2], [40, 34, 3]].map(([ex, ey, j]) => (
          <path key={j} d={lobulos(13, 8, 0.2, j + 5)} transform={`translate(${ex},${ey})`} fill="#0F1624" stroke="#3A4A62" strokeWidth={1} />
        ))}
      </g>
      {erosiva
        ? <g opacity={tramo(k, 0.5, 1)}>
            <FlechaSuave a={{ x: 96, y: -70 }} c={{ x: 72, y: -50 }} b={{ x: 48, y: -26 }} color="#FF5A66" grosor={4} />
            <FlechaSuave a={{ x: -96, y: 80 }} c={{ x: -76, y: 62 }} b={{ x: -54, y: 42 }} color="#FF5A66" grosor={4} />
          </g>
        : <g transform="translate(92,-112)" opacity={tramo(k, 0.5, 1)}><circle r={16} fill="#1F9A6A" stroke="#FFF" strokeWidth={2.4} /><path d="M-7,0 L-2,6 L8,-6" fill="none" stroke="#FFF" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></g>}
      <text y={198} textAnchor="middle" className={rotulo}>{titulo}</text>
      <text y={228} textAnchor="middle" className={`${erosiva ? s.lEtiquetaRoja : s.lEtiquetaVerde} ${s.conHalo}`}>{sub}</text>
    </g>
  );
}

const IconoPerla = (
  <g>
    <path d="M-20,8 C-20,-12 20,-12 20,8 C12,16 -12,16 -20,8 Z" fill="#D8C8E8" stroke="#7B5AA0" strokeWidth={1.6} />
    <circle cy={0} r={11} fill="#FFF8EE" stroke="#BCA88A" strokeWidth={1} /><circle cx={-3.6} cy={-3.6} r={3} fill="#FFF" />
  </g>
);
const IconoVisto = <path d="M-12,1 L-3,10 L13,-10" fill="none" stroke="#FFF" strokeWidth={4.4} strokeLinecap="round" strokeLinejoin="round" />;

// ─── Paso 7 · otras pistas (sobre la lámina `manos`) ──────────────────────────

/** Una mano entera con el Raynaud: los dedos cambian de color hasta el nudillo medio. */
function ManoRaynaud({ x, y, q, col, k, rl }: { x: number; y: number; q: number; col: string; k: number; rl: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.4)} transform={`translate(${x},${f1(y + (1 - easeOut(k)) * 20)}) scale(${q})`}>
      <DorsoFijo />
      {DEDOS.map(([dx, l, a], i) => {
        const pulgar = i === 4;
        return (
          <g key={i} transform={`translate(${dx},${pulgar ? 60 : 0}) rotate(${a})`}>
            <Dedo l={l} pulgar={pulgar} punta={{ col, k: pulgar ? 0 : tramo(k, 0.3, 0.9) }} />
          </g>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => { const f = (rl / 2600 + i / 5) % 1; return col === 'url(#pl-ray0)' ? <path key={i} d="M-7,0 H7 M0,-7 V7 M-5,-5 L5,5 M-5,5 L5,-5" stroke="#7FB2E8" strokeWidth={2.2} strokeLinecap="round" transform={`translate(${-90 + i * 48},${f1(-250 + f * 170)})`} opacity={Math.sin(f * Math.PI) * k} /> : null; })}
    </g>
  );
}

/** Coronilla con el pelo que clarea y cabellos que caen, en una lente. */
function ArteCuero({ rl, k }: { rl: number; k: number }) {
  return (
    <g>
      <rect x={-240} y={-240} width={480} height={480} fill="url(#pl-piel)" />
      {Array.from({ length: 150 }, (_, i) => {
        const a = hash(i, 11) * TAU, r = Math.sqrt(hash(i, 12)) * 215, x = Math.cos(a) * r, y = Math.sin(a) * r;
        const denso = r > 95 || hash(i, 13) > 0.72;
        if (!denso) return null;
        return <path key={i} d={`M${f1(x)},${f1(y)} q${f1(x * 0.05)},${f1(y * 0.05 - 8)} ${f1(x * 0.16)},${f1(y * 0.16 - 14)}`} fill="none" stroke={i % 3 ? '#3A2820' : '#5E4232'} strokeWidth={2.4} strokeLinecap="round" />;
      })}
      {Array.from({ length: 16 }, (_, i) => { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 16) * 88; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={1.4} fill="#6E4A36" />; })}
      {[0, 1, 2, 3].map((i) => {
        const f = (rl / 2800 + i / 4) % 1, x = -110 + i * 72 + Math.sin(rl / 500 + i) * 10;
        return <path key={i} d="M0,0 c10,12 -8,22 2,36" transform={`translate(${f1(x)},${f1(-60 + f * 210)}) rotate(${i * 24 - 30})`} fill="none" stroke="#3A2820" strokeWidth={2.6} strokeLinecap="round" opacity={Math.sin(f * Math.PI) * k} />;
      })}
    </g>
  );
}

function ArteUnas() {
  return (
    <g>
      <rect x={-140} y={-140} width={280} height={280} fill="url(#pl-piel)" />
      <path d="M-82,140 L-82,-16 C-80,-92 80,-92 82,-16 L82,140 Z" fill="url(#pl-dedo)" stroke="#A9765C" strokeWidth={1.8} />
      <path d="M-62,140 L-62,20 C-60,-24 60,-24 62,20 L62,140 Z" fill="url(#pl-una)" stroke="#BE8E7A" strokeWidth={2} />
      <path d="M-40,140 V36 C-34,20 -14,14 -6,14" fill="none" stroke="#FFF" strokeWidth={7} strokeLinecap="round" opacity={0.7} />
      {Array.from({ length: 9 }, (_, i) => {
        const x = -54 + i * 13.5, h = 24 + hash(i, 4) * 24, w = 4 + hash(i, 5) * 3;
        return <path key={i} d={`M${f1(x - w)},${f1(14 - Math.abs(x) * 0.34)} C${f1(x - w - 4)},${f1(-h)} ${f1(x + w + 4)},${f1(-h)} ${f1(x + w)},${f1(14 - Math.abs(x) * 0.34)}`} fill="none" stroke="#C81E3C" strokeWidth={2.6} strokeLinecap="round" />;
      })}
    </g>
  );
}

function ArteUrticaria({ rl }: { rl: number }) {
  return (
    <g>
      <rect x={-140} y={-140} width={280} height={280} fill="url(#pl-piel)" />
      {[[-54, -48, 44, 3], [52, -36, 34, 4], [-20, 44, 36, 5], [64, 62, 26, 6], [-84, 38, 20, 7]].map(([x, y, r, sem], i) => {
        const q = 1 + 0.035 * Math.sin(rl / 700 + i);
        return (
          <g key={sem} transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}>
            <path d={lobulos(r * 1.24, 9, 0.16, sem)} fill="#E8667E" opacity={0.42} />
            <path d={lobulos(r, 9, 0.18, sem)} fill="#E8667E" />
            <path d={lobulos(r * 0.6, 8, 0.15, sem + 2)} fill="#FBE4DE" />
          </g>
        );
      })}
    </g>
  );
}

export function FondoManos({ t, reloj }: { t: T; reloj: number }) {
  const ma = v(t, 'mano'), ar = v(t, 'artic'), pe = v(t, 'perla'), co = v(t, 'comparar'), ja = v(t, 'jaccoud'), re = v(t, 'reduce'), rx = v(t, 'rx'), ry = v(t, 'raynaud');
  const o1 = v(t, 'ot1'), o3 = v(t, 'ot3'), o4 = v(t, 'ot4');
  const desvio = easeInOut(ja) * (1 - easeInOut(re));
  return (
    <g>
      <Base />
      {ma > 0.001 && (
        <g opacity={ma}>
          <Mano cx={300} cy={420} espejo={false} artic={ar} desvio={desvio} rl={reloj} />
          <Mano cx={720} cy={420} espejo artic={ar} desvio={0} rl={reloj} />
          {ar > 0.3 && (
            <g opacity={tramo(ar, 0.3, 1)}>
              <text x={510} y={140} textAnchor="middle" className={rotulo}>MCF · IFP · muñecas (y rodillas)</text>
              <text x={510} y={170} textAnchor="middle" className={subRotulo}>simétrica y distal</text>
            </g>
          )}
          {ja > 0.3 && (
            <g opacity={tramo(ja, 0.3, 0.7)}>
              <text x={300} y={830} textAnchor="middle" className={rotulo}>{re > 0.5 ? 'se reduce con la mano' : 'artropatía de Jaccoud'}</text>
              <text x={300} y={860} textAnchor="middle" className={subRotulo}>{re > 0.5 ? 'tendones y ligamentos, no hueso' : 'dedos desviados'}</text>
            </g>
          )}
          {re > 0.001 && <FlechaSuave a={{ x: 470, y: 232 }} c={{ x: 430, y: 178 }} b={{ x: 340, y: 192 }} k={tramo(re, 0, 0.6)} opacity={1 - tramo(re, 0.85, 1)} color="#1F9A6A" grosor={7} />}
        </g>
      )}
      <Letrero x={1290} y={130} w={360} txt="LA PERLA" k={pe} tono="morado" claro>{IconoPerla}</Letrero>
      {co > 0.001 && (
        <g opacity={co}>
          <Radiografia x={1140} y={420} erosiva titulo="Artritis reumatoide" sub="erosiva" k={co} />
          <Radiografia x={1440} y={420} erosiva={false} titulo="Lupus" sub="no erosiva" k={co} />
        </g>
      )}
      <Letrero x={1280} y={748} w={580} txt="EN LA RADIOGRAFÍA NO VERÁS EROSIONES" k={rx} tono="verde">{IconoVisto}</Letrero>

      {/* Otras pistas: cada una es una imagen */}
      <Lente id="pl-c-cuero2" x={230} y={350} r={190} k={o1}><ArteCuero rl={reloj} k={o1} /></Lente>
      <Nota x={230} y={606} t="Alopecia no cicatricial" sub="pelo frágil, se recupera" k={o1} tam={24} />
      {ry > 0.001 && (
        <g>
          <text x={1010} y={84} textAnchor="middle" className={rotulo} style={{ fontSize: 26 }} opacity={tramo(ry, 0, 0.3)}>Raynaud: con el frío</text>
          {[0, 1, 2].map((j) => {
            const k = clamp(ry * 3 - j), x = 670 + j * 340;
            return (
              <g key={j}>
                <ManoRaynaud x={x} y={270} q={0.66} col={['url(#pl-ray0)', 'url(#pl-ray1)', 'url(#pl-ray2)'][j]} k={k} rl={reloj} />
                <Nota x={x} y={530} t={['blanco', 'azul', 'rojo'][j]} k={k} tam={24} />
                {j < 2 && <FlechaSuave a={{ x: x + 112, y: 340 }} c={{ x: x + 170, y: 318 }} b={{ x: x + 226, y: 340 }} k={tramo(clamp(ry * 3 - j - 1), 0, 0.7)} color="#6E7789" grosor={6} />}
              </g>
            );
          })}
        </g>
      )}
      <Lente id="pl-c-una" x={760} y={760} r={120} k={o3}><ArteUnas /></Lente>
      <Nota x={926} y={748} t="Telangiectasias" sub="alrededor de las uñas" k={o3} fin="start" tam={24} />
      <Lente id="pl-c-urt" x={1260} y={760} r={120} k={o4}><ArteUrticaria rl={reloj} /></Lente>
      <Nota x={1426} y={760} t="Urticaria" k={o4} fin="start" tam={24} />
    </g>
  );
}

// ─── Paso 2 · tres formas de lupus cutáneo ────────────────────────────────────

/** Anillo del lupus subagudo: borde rojo y escamoso, centro claro. */
function Anillo({ r, sem }: { r: number; sem: number }) {
  const borde = lobulos(r, 11, 0.09, sem);
  return (
    <g>
      <path d={borde} fill="#E8B8A4" opacity={0.65} />
      <path d={borde} fill="none" stroke="#A82B4E" strokeWidth={r * 0.34} strokeLinejoin="round" />
      <path d={borde} fill="none" stroke="#DC5272" strokeWidth={r * 0.22} strokeLinejoin="round" />
      {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * TAU + sem; return <ellipse key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} rx={r * 0.1} ry={r * 0.045} fill="#FFF2E6" opacity={0.85} transform={`rotate(${f1((a * 180) / Math.PI)} ${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)})`} />; })}
    </g>
  );
}

function Placa({ r, ci, sem = 3 }: { r: number; ci: number; sem?: number }) {
  return (
    <g>
      <path d={lobulos(r * 1.14, 13, 0.07, sem)} fill="#6E3E2C" opacity={0.25 + 0.75 * ci} />
      <path d={lobulos(r, 13, 0.07, sem + 1)} fill="url(#pl-eritema)" />
      <path d={lobulos(r * 0.66 * Math.max(0.05, ci), 10, 0.1, sem + 2)} fill="#F8E9DF" stroke="#E0B8A6" strokeWidth={r * 0.012} />
      {ci > 0.2 && [-0.3, -0.05, 0.22].map((d) => <path key={d} d={`M${-r * 0.4},${r * d} Q0,${r * (d - 0.08)} ${r * 0.4},${r * (d + 0.03)}`} fill="none" stroke="#FFF" strokeWidth={r * 0.016} opacity={0.75 * ci} />)}
    </g>
  );
}

const ArteAgudo = (
  <g>
    <rect x={-150} y={-150} width={300} height={300} fill="url(#pl-piel)" />
    <path d="M-150,-84 C-90,-104 -40,-92 -8,-66 M-150,-94 C-90,-116 -40,-104 -8,-76" fill="none" stroke="#6E3A28" strokeWidth={3.4} opacity={0.35} />
    <ellipse cx={-48} cy={4} rx={112} ry={66} fill="url(#pl-malar)" transform="rotate(-10 -48 4)" />
    {Array.from({ length: 34 }, (_, i) => { const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 34); return <circle key={i} cx={-48 + Math.cos(a) * 88 * q} cy={4 + Math.sin(a) * 48 * q} r={1.8 + hash(i, 3) * 2} fill="#B81E48" opacity={0.42} />; })}
    <path d="M82,-150 C74,-76 70,-26 90,38 C100,62 120,70 150,62 L150,-150 Z" fill="#E8B99C" />
    <path d="M82,-150 C74,-76 70,-26 90,38 C100,62 120,70 150,62" fill="none" stroke="#A9765C" strokeWidth={2.4} opacity={0.65} />
    <path d="M64,62 C42,90 28,116 22,150" fill="none" stroke="#A9765C" strokeWidth={3} opacity={0.55} />
  </g>
);
const ArteSubagudo = (
  <g>
    <rect x={-150} y={-150} width={300} height={300} fill="url(#pl-piel)" />
    {[[-54, -40, 46, 2], [56, -54, 34, 5], [40, 50, 52, 8], [-66, 70, 30, 11]].map(([x, y, r, sem]) => <g key={sem} transform={`translate(${x},${y})`}><Anillo r={r} sem={sem} /></g>)}
  </g>
);
const ArteDiscoide = (
  <g>
    <rect x={-150} y={-150} width={300} height={300} fill="url(#pl-piel)" />
    <Placa r={92} ci={1} />
    {Array.from({ length: 18 }, (_, i) => { const a = i * 2.39996, q = 34 + Math.sqrt((i + 0.5) / 18) * 52; return <circle key={i} cx={Math.cos(a) * q} cy={Math.sin(a) * q} r={2.8} fill="#3E2418" />; })}
  </g>
);

/** Silueta con lo que toca cada forma: del cuerpo entero a una mancha en la piel. */
export function Silueta({ x, y, k, focos, piel, rl }: { x: number; y: number; k: number; focos: [number, number][]; piel: [number, number][]; rl: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.4)} transform={`translate(${x},${y})`}>
      <circle cy={-66} r={18} fill="url(#pl-silueta)" />
      <path d="M-30,-40 C-14,-48 14,-48 30,-40 C38,-36 42,-28 44,-16 L50,32 C51,40 40,42 38,34 L30,-2 L28,24 L32,92 C32,100 18,100 16,92 L6,36 H-6 L-16,92 C-18,100 -32,100 -32,92 L-28,24 L-30,-2 L-38,34 C-40,42 -51,40 -50,32 L-44,-16 C-42,-28 -38,-36 -30,-40 Z" fill="url(#pl-silueta)" />
      {piel.map(([px, py], i) => <circle key={i} cx={px} cy={py} r={5.4} fill="#D84E6C" stroke="#FFF" strokeWidth={1.2} />)}
      {focos.map(([fx, fy], i) => {
        const q = 0.65 + 0.35 * Math.sin(rl / 320 + i);
        return <g key={i} opacity={tramo(k, 0.25 + i * 0.1, 0.5 + i * 0.1)}><circle cx={fx} cy={fy} r={13 * q + 3} fill="#E5293F" opacity={0.3} /><circle cx={fx} cy={fy} r={6} fill="#E5293F" stroke="#FFF" strokeWidth={1.2} /></g>;
      })}
    </g>
  );
}

export function FondoCutaneos({ t, reloj }: { t: T; reloj: number }) {
  const c0 = v(t, 'c0'), c1 = v(t, 'c1'), c2 = v(t, 'c2'), c3 = v(t, 'c3'), c4 = v(t, 'c4'), c5 = v(t, 'c5');
  const fl = (i: number) => Math.sin(reloj / 800 + i * 2) * 3;
  const x0 = 200, x1 = 1400;
  return (
    <g>
      <Base />
      {c0 > 0.001 && (
        <g opacity={tramo(c0, 0, 0.5)}>
          <text x={800} y={62} textAnchor="middle" className={`${s.sgNum} ${s.conHalo}`} style={{ fontSize: 54, fill: '#C2385A' }}>85 %</text>
          <text x={800} y={92} textAnchor="middle" className={halo} style={{ fontSize: 20 }}>piel y mucosas</text>
        </g>
      )}
      <Lente id="pl-c1" x={300} y={232} r={112} k={c1} flota={fl(0)}>{ArteAgudo}</Lente>
      <Lente id="pl-c2" x={800} y={232} r={112} k={c2} flota={fl(1)}>{ArteSubagudo}</Lente>
      <Lente id="pl-c3" x={1300} y={232} r={112} k={c3} flota={fl(2)}>{ArteDiscoide}</Lente>
      <Nota x={300} y={410} t="Agudo" k={c1} tam={28} />
      <Nota x={800} y={410} t="Subagudo" k={c2} tam={28} />
      <Nota x={1300} y={410} t="Discoide" k={c3} tam={28} />
      {/* Cuánto del cuerpo toca cada forma */}
      <Silueta x={300} y={530} k={c4} focos={[[0, -70], [-10, -26], [12, -14], [-34, 22], [16, 74]]} piel={[[-9, -66], [9, -66]]} rl={reloj} />
      <Silueta x={800} y={530} k={c4} focos={[[12, -14]]} piel={[[-20, -26], [20, -26], [0, -36], [-42, 8], [42, 8]]} rl={reloj} />
      <Silueta x={1300} y={530} k={c4} focos={[]} piel={[[-9, -74]]} rl={reloj} />
      <Nota x={420} y={530} t="sistémico" k={c4} fin="start" />
      <Nota x={1180} y={530} t="localizado" k={c4} fin="end" />
      {/* Las dos cuñas: una crece mientras la otra se acaba */}
      <clipPath id="pl-c-r"><rect x={x0 - 10} y={660} width={(x1 - x0 + 20) * easeOut(c4)} height={70} /></clipPath>
      <path clipPath="url(#pl-c-r)" d={`M${x0},668 Q${x0 - 9},696 ${x0},724 L${x1},700 Q${x1 + 4},696 ${x1},692 Z`} fill="url(#pl-cunaR)" opacity={tramo(c4, 0, 0.2)} />
      <clipPath id="pl-c-c"><rect x={x1 + 10 - (x1 - x0 + 20) * easeOut(c5)} y={740} width={(x1 - x0 + 20) * easeOut(c5)} height={70} /></clipPath>
      <path clipPath="url(#pl-c-c)" d={`M${x0},772 Q${x0 - 4},776 ${x0},780 L${x1},804 Q${x1 + 9},776 ${x1},748 Z`} fill="url(#pl-cunaC)" opacity={tramo(c5, 0, 0.2)} />
      <Nota x={x0} y={650} t="Enfermedad sistémica" k={c4} fin="start" />
      <Nota x={x1} y={836} t="Cicatriz" k={c5} fin="end" />
      {c5 > 0.001 && <text x={800} y={896} textAnchor="middle" className={subRotulo} style={{ fontSize: 24 }} opacity={tramo(c5, 0.5, 1)}>Cuanto más cicatriza la lesión, menos probable la enfermedad sistémica</text>}
    </g>
  );
}

// ─── Paso 3 · el exantema en alas de mariposa ─────────────────────────────────

const ALA = 'M-18,516 C-44,492 -118,498 -146,538 C-156,566 -112,592 -72,584 C-48,578 -30,556 -18,534 Z';
const MOTAS: [number, number, number][] = Array.from({ length: 46 }, (_, i) => {
  const a = i * 2.39996, q = Math.sqrt((i + 0.5) / 46);
  return [-82 + Math.cos(a) * 58 * q, 542 + Math.sin(a) * 34 * q, 1.5 + hash(i, 6) * 2];
});

/** Cara en miniatura para comparar: el lupus respeta el pliegue; la rosácea lo cruza. */
function MiniCara({ rosacea }: { rosacea: boolean }) {
  return (
    <g>
      <path d="M0,-92 C50,-92 70,-50 70,-8 C70,44 36,92 0,92 C-36,92 -70,44 -70,-8 C-70,-50 -50,-92 0,-92 Z" fill="url(#pl-piel)" stroke="#A9765C" strokeWidth={1.6} />
      {rosacea
        ? <path d="M-58,-4 C-40,-18 -14,-14 0,-6 C14,-14 40,-18 58,-4 C60,20 34,44 0,48 C-34,44 -60,20 -58,-4 Z" fill="#D8486A" opacity={0.62} />
        : <g fill="#D8486A" opacity={0.7}><path d="M-8,-12 C-22,-22 -54,-18 -62,0 C-62,12 -44,18 -30,14 C-20,10 -12,0 -8,-12 Z" /><path d="M8,-12 C22,-22 54,-18 62,0 C62,12 44,18 30,14 C20,10 12,0 8,-12 Z" /><ellipse cy={-12} rx={8} ry={12} /></g>}
      {[-30, 30].map((x) => <g key={x}><ellipse cx={x} cy={-30} rx={10} ry={5.4} fill="#FFF" /><circle cx={x} cy={-30} r={4} fill="#4A2C20" /></g>)}
      <path d="M0,-26 C-2,-8 -8,4 -8,12 C-4,18 4,18 8,12" fill="none" stroke="#8E5A44" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M-14,24 C-22,36 -26,42 -28,50 M14,24 C22,36 26,42 28,50" fill="none" stroke={rosacea ? '#7A1E34' : '#FFF'} strokeWidth={rosacea ? 2.4 : 7} strokeLinecap="round" opacity={rosacea ? 0.8 : 0.9} />
      {!rosacea && <path d="M-14,24 C-22,36 -26,42 -28,50 M14,24 C22,36 26,42 28,50" fill="none" stroke="#8E5A44" strokeWidth={2} strokeLinecap="round" />}
      <path d="M-16,58 Q0,66 16,58" fill="none" stroke="#A85A58" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

const Marca = ({ x, y, ok, k }: { x: number; y: number; ok: boolean; k: number }) => (
  <g transform={`translate(${x},${y}) scale(${(0.6 + 0.4 * easeBack(clamp(k))).toFixed(3)})`} opacity={tramo(k, 0.2, 0.6)}>
    <circle r={20} fill={ok ? '#1F9A6A' : '#D1293D'} stroke="#FFF" strokeWidth={3} />
    {ok ? <path d="M-9,0 L-3,7 L10,-8" fill="none" stroke="#FFF" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /> : <path d="M-8,-8 L8,8 M8,-8 L-8,8" stroke="#FFF" strokeWidth={4} strokeLinecap="round" />}
  </g>
);

const ArteSinCicatriz = (
  <g>
    <path d={lobulos(40, 9, 0.08, 6)} fill="url(#pl-piel)" stroke="#C49374" strokeWidth={1.4} />
    {[[-14, -10, 6], [8, -14, 5], [16, 6, 6], [-6, 8, 7], [-20, 12, 4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#E0607C" opacity={0.3} />)}
    <g transform="translate(28,24)"><circle r={15} fill="#1F9A6A" stroke="#FFF" strokeWidth={2.6} /><path d="M-7,0 L-2,5 L7,-6" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></g>
  </g>
);
export const ArteAdn = (rl: number) => (
  <g>
    <path d={Array.from({ length: 2 }, (_, l) => `M-38,0 ${Array.from({ length: 4 }, (__, j) => `q9.5,${(j % 2 === l ? -1 : 1) * 22} 19,0`).join(' ')}`).join(' ')} fill="none" stroke="#2F6FD0" strokeWidth={4} strokeLinecap="round" />
    <IgG x={-14} y={-30} ang={180 + Math.sin(rl / 500) * 8} k={0.72} />
    <IgG x={18} y={32} ang={0 + Math.sin(rl / 520) * 8} k={0.72} />
  </g>
);

export function FondoMalar({ t, reloj }: { t: T; reloj: number }) {
  const ro = v(t, 'rostro'), er = v(t, 'eritema'), so = v(t, 'solM'), pl = v(t, 'pliegueM'), m1 = v(t, 'm1'), m2 = v(t, 'm2'), m3 = v(t, 'm3');
  const fl = (i: number) => Math.sin(reloj / 800 + i * 2) * 3;
  return (
    <g>
      <Base />
      {so > 0.001 && (
        <g opacity={so}>
          {[0, 1, 2, 3].map((j) => <path key={j} d={`M730,170 L${380 + j * 62},${460 + j * 44} L${444 + j * 62},${500 + j * 44} Z`} fill="url(#pl-rayo)" opacity={0.75 + 0.25 * Math.sin(reloj / 300 + j)} />)}
          <g transform="translate(730,160)">
            {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * TAU + reloj / 5000; return <line key={i} x1={Math.cos(a) * 52} y1={Math.sin(a) * 52} x2={Math.cos(a) * 74} y2={Math.sin(a) * 74} className={s.rayoSol} />; })}
            <circle r={44} fill="url(#pl-sol)" stroke="#E0A11E" strokeWidth={2} />
          </g>
          <Nota x={730} y={268} t="empeora con el sol" k={so} />
        </g>
      )}
      {ro > 0.001 && (
        <g transform="translate(430,0)">
          <g opacity={tramo(ro, 0.2, 0.9)}><Retrato id="malar" /></g>
          {er > 0.001 && (
            <g opacity={er}>
              {[1, -1].map((l) => (
                <g key={l} transform={`scale(${l},1)`}>
                  <path d={ALA} fill="url(#pl-malar)" />
                  {MOTAS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#B81E48" opacity={0.3} />)}
                </g>
              ))}
              <ellipse cx={0} cy={528} rx={22} ry={28} fill="url(#pl-malar)" />
            </g>
          )}
          {pl > 0.001 && [1, -1].map((l) => (
            <g key={l} transform={`scale(${l},1)`} opacity={pl}>
              <path d="M-36,598 C-52,618 -62,638 -66,660" fill="none" stroke="#FBE6D6" strokeWidth={13} strokeLinecap="round" opacity={0.75} />
              <path d="M-36,598 C-52,618 -62,638 -66,660" fill="none" stroke="#8E5A44" strokeWidth={2.4} strokeLinecap="round" opacity={0.8} />
            </g>
          ))}
        </g>
      )}
      {er > 0.5 && (
        <g opacity={tramo(er, 0.5, 1)}>
          <line x1={332} y1={536} x2={190} y2={468} className={s.guiaClara} />
          <text x={120} y={456} textAnchor="middle" className={rotulo}>eritema malar</text>
        </g>
      )}
      {/* 1 · Lo que se ve de cerca */}
      <Lente id="pl-m1" x={1010} y={170} r={104} k={m1} flota={fl(0)}>{ArteAgudo}</Lente>
      <Nota x={1140} y={158} t="Fijo, plano o algo elevado" sub="pómulos y puente de la nariz" k={m1} fin="start" tam={23} />
      {/* 2 · El pliegue: lupus frente a rosácea */}
      <Flotante x={1010} y={470} k={m2} rl={reloj} fase={1} esc={1.14} alto={106}><MiniCara rosacea={false} /></Flotante>
      <Flotante x={1280} y={470} k={tramo(m2, 0.2, 1)} rl={reloj} fase={2.4} esc={1.14} alto={106}><MiniCara rosacea /></Flotante>
      <Marca x={1090} y={392} ok k={m2} />
      <Marca x={1360} y={392} ok={false} k={tramo(m2, 0.3, 1)} />
      <Nota x={1010} y={622} t="Lupus: respeta el pliegue" k={m2} />
      <Nota x={1280} y={622} t="Rosácea: lo cruza" k={tramo(m2, 0.2, 1)} />
      {/* 3 · Lo que anuncia */}
      <Flotante x={960} y={778} k={m3} rl={reloj} fase={3}>{ArteSinCicatriz}</Flotante>
      <Nota x={960} y={868} t="no deja cicatriz" k={m3} tam={19} />
      <Flotante x={1170} y={778} k={tramo(m3, 0.15, 1)} rl={reloj} fase={4}>{ArteAdn(reloj)}</Flotante>
      <Nota x={1170} y={868} t="anti-ADNdc · anti-Sm" k={tramo(m3, 0.15, 1)} tam={19} />
      <Flotante x={1380} y={778} k={tramo(m3, 0.3, 1)} rl={reloj} fase={5}><IconoOrgano i="rinon" x={0} y={0} k={0.8} /></Flotante>
      <Nota x={1380} y={868} t="órganos internos" k={tramo(m3, 0.3, 1)} tam={19} />
    </g>
  );
}

// ─── Paso 4 · boca ────────────────────────────────────────────────────────────

const X_CARA = 310;

/** Los dientes de arriba vistos desde abajo: incisivos finos, muelas anchas. */
const ARCADA = Array.from({ length: 14 }, (_, i) => {
  const th = (0.035 + (i * 0.93) / 13) * Math.PI, cerca = Math.abs(i - 6.5);
  return {
    x: 198 * Math.cos(th), y: 112 - 322 * Math.sin(th),
    rot: (Math.atan2(322 * Math.cos(th), 198 * Math.sin(th)) * 180) / Math.PI,
    w: cerca < 1 ? 42 : cerca < 2 ? 36 : cerca < 3 ? 34 : cerca < 5 ? 40 : 52,
    h: cerca < 3 ? 30 : 42,
    muela: cerca >= 3,
  };
});

/** El paladar desde abajo, la vista de un atlas: la herradura de dientes, las
 *  rugosidades detrás de los incisivos, el rafe, y al fondo la úvula y la lengua. */
const PaladarFijo = memo(function PaladarFijo() {
  return (
    <g>
      <rect x={-260} y={-260} width={520} height={520} fill="#C65A6E" />
      {/* Fondo: garganta, lengua */}
      <ellipse cx={0} cy={186} rx={138} ry={70} fill="#34101A" />
      <ellipse cx={0} cy={290} rx={232} ry={84} fill="url(#pl-lengua)" stroke="#9E3E54" strokeWidth={1.6} />
      <path d="M0,214 V260" stroke="#A8455C" strokeWidth={5} strokeLinecap="round" opacity={0.55} />
      {/* Paladar blando y úvula */}
      <path d="M-192,44 C-176,128 -92,158 -32,126 C-16,118 16,118 32,126 C92,158 176,128 192,44 Z" fill="#E98D9A" stroke="#BE5D72" strokeWidth={1.6} />
      <path d="M-27,118 C-27,152 -13,186 0,190 C13,186 27,152 27,118 Z" fill="#F09AA6" stroke="#BE5D72" strokeWidth={1.6} />
      <ellipse cx={-8} cy={144} rx={5.4} ry={17} fill="#FFF" opacity={0.5} />
      {/* Paladar duro */}
      <path d="M-170,96 C-190,-20 -150,-172 0,-178 C150,-172 190,-20 170,96 C112,122 50,114 0,110 C-50,114 -112,122 -170,96 Z" fill="url(#pl-paladar)" />
      <path d="M0,-170 V104" stroke="#FCE0DC" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
      {[-1, 1].flatMap((l) => [0, 1, 2, 3].map((j) => <path key={`${l}${j}`} d={`M${l * 12},${-146 + j * 25} C${l * 44},${-160 + j * 26} ${l * 84},${-142 + j * 26} ${l * (118 + j * 6)},${-116 + j * 27}`} fill="none" stroke="#C25D74" strokeWidth={5} strokeLinecap="round" opacity={0.42} />))}
      <ellipse cx={-70} cy={40} rx={58} ry={30} fill="#FFF" opacity={0.14} transform="rotate(-24 -70 40)" />
      {/* Encía y dientes */}
      <path d="M-198,112 C-222,-34 -176,-212 0,-214 C176,-212 222,-34 198,112" fill="none" stroke="#F4A6B0" strokeWidth={56} strokeLinecap="round" />
      <path d="M-172,104 C-192,-22 -152,-182 0,-186 C152,-182 192,-22 172,104" fill="none" stroke="#C25D74" strokeWidth={2} opacity={0.55} />
      {ARCADA.map((d, i) => (
        <g key={i} transform={`translate(${f1(d.x)},${f1(d.y)}) rotate(${f1(d.rot)})`}>
          <rect x={-d.w / 2} y={-d.h / 2} width={d.w} height={d.h} rx={d.muela ? 11 : 8} fill="url(#pl-diente)" stroke="#B3A688" strokeWidth={1.3} />
          {d.muela
            ? <path d={`M${-d.w * 0.3},0 H${d.w * 0.3} M0,${-d.h * 0.28} V${d.h * 0.28}`} stroke="#CDBF9E" strokeWidth={2.2} strokeLinecap="round" />
            : <path d={`M${-d.w * 0.28},${-d.h * 0.2} H${d.w * 0.28}`} stroke="#FFF" strokeWidth={3} strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
});

const ZOOM_ULCERAS: [number, number, number][] = [[-78, -32, 27], [60, -74, 21], [92, 22, 16]];

function PaladarZoom({ ul, mi, rl }: { ul: number; mi: number; rl: number }) {
  return (
    <g>
      <PaladarFijo />
      {ZOOM_ULCERAS.map(([x, y, r], i) => {
        const q = easeOut(tramo(ul, i * 0.2, 0.6 + i * 0.2));
        return q > 0 ? (
          <g key={i} transform={`translate(${x},${y}) scale(${q.toFixed(3)})`}>
            <path d={lobulos(r * 1.8, 11, 0.08, i + 3)} fill="#E03A58" opacity={0.42} />
            <path d={lobulos(r * 1.22, 10, 0.09, i + 5)} fill="#B81E3A" />
            <path d={lobulos(r, 9, 0.11, i + 7)} fill="#FFF8DC" stroke="#D8B860" strokeWidth={1.4} />
            <path d={lobulos(r * 0.55, 7, 0.14, i + 9)} fill="#F2DC96" />
            {/* Al «mirar», cada úlcera se señala */}
            {mi > 0.001 && <circle r={r * 2.05 + Math.sin(rl / 260 + i) * 3} fill="none" stroke="#F2B21E" strokeWidth={4} opacity={mi * 0.9} />}
          </g>
        ) : null;
      })}
    </g>
  );
}

const ArteIndolora = (rl: number) => (
  <g>
    <circle r={56} fill="#FBE0CC" />
    <circle cx={-18} cy={-10} r={5} fill="#3A2820" /><circle cx={18} cy={-10} r={5} fill="#3A2820" />
    <path d="M-20,16 Q0,34 20,16" fill="none" stroke="#3A2820" strokeWidth={4.4} strokeLinecap="round" />
    <g transform={`translate(38,-34) scale(${(1 + 0.05 * Math.sin(rl / 400)).toFixed(3)})`}>
      <circle r={26} fill="#FFF" stroke="#D1293D" strokeWidth={4} />
      <path d="M4,-17 L-9,3 H0 L-4,17 L10,-4 H1 Z" fill="#F2B21E" stroke="#A8821A" strokeWidth={1} strokeLinejoin="round" />
      <path d="M-18,-18 L18,18" stroke="#D1293D" strokeWidth={4.4} strokeLinecap="round" />
    </g>
  </g>
);
const ArteOjo = (rl: number) => {
  const m = Math.sin(rl / 700) * 9;
  return (
    <g>
      <path d="M-58,0 C-30,-40 30,-40 58,0 C30,40 -30,40 -58,0 Z" fill="#FFF" stroke="#3A4256" strokeWidth={4} />
      <circle cx={m} r={23} fill="#2F7FB0" /><circle cx={m} r={11} fill="#10181F" /><circle cx={m - 7} cy={-8} r={5} fill="#FFF" />
      <path d="M-52,-24 L-62,-38 M0,-36 V-52 M52,-24 L62,-38" stroke="#3A4256" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

export function FondoBoca({ t, reloj }: { t: T; reloj: number }) {
  const bo = v(t, 'boca'), ul = v(t, 'ulceras'), mi = v(t, 'mira'), ind = v(t, 'ind'), bus = v(t, 'bus'), abr = v(t, 'abre');
  const lupa = tramo(ul, 0, 0.25), abierta = easeInOut(tramo(bo, 0.25, 1));
  return (
    <g>
      <Base />
      {bo > 0.001 && <g opacity={tramo(bo, 0, 0.3)} transform={`translate(${X_CARA},0)`}><Retrato id="bocaR" abre={abierta} /></g>}
      {/* De la boca a la lupa */}
      {lupa > 0.001 && (
        <g opacity={lupa}>
          <line x1={X_CARA + 66} y1={652} x2={630} y2={490} className={s.hiloLupa} />
          <circle cx={X_CARA} cy={676} r={72} className={s.anilloLupaL} />
        </g>
      )}
      <Lente id="pl-c-zoom" x={850} y={360} r={250} k={lupa} mango>
        <PaladarZoom ul={ul} mi={mi} rl={reloj} />
      </Lente>
      <Nota x={850} y={690} t="Úlceras en el paladar" k={tramo(ul, 0.2, 0.7)} tam={26} />
      {/* Indoloras y búscalas */}
      <Flotante x={1340} y={210} k={ind} rl={reloj} esc={1.34} alto={82}>{ArteIndolora(reloj)}</Flotante>
      <Nota x={1340} y={342} t="Indoloras" sub="no las menciona" k={ind} tam={26} />
      <Flotante x={1340} y={520} k={bus} rl={reloj} fase={2} esc={1.4} alto={76}>{ArteOjo(reloj)}</Flotante>
      <Nota x={1340} y={652} t="Búscalas" sub="mira el paladar" k={bus} tam={26} />
      {abr > 0.001 && <text x={1050} y={830} textAnchor="middle" className={rotulo} style={{ fontSize: 28 }} opacity={tramo(abr, 0, 0.5)}>Si no le abres la boca, no las vas a encontrar</text>}
    </g>
  );
}

// ─── Paso 5 · torso (lupus cutáneo subagudo) ──────────────────────────────────

const TorsoFijo = memo(function TorsoFijo() {
  return (
    <g>
      <path d="M478,600 C472,640 430,660 350,680 C250,704 176,746 150,824 C132,880 108,950 90,1040 L950,1040 C932,950 908,880 890,824 C864,746 790,704 690,680 C610,660 568,640 562,600 Z" fill="url(#pl-torso)" stroke="#A9765C" strokeWidth={1.4} />
      <path d="M478,630 C486,660 504,694 514,716 M562,630 C554,660 536,694 526,716" fill="none" stroke="#A9765C" strokeWidth={3.6} strokeLinecap="round" opacity={0.42} />
      <path d="M430,664 C380,674 320,690 270,706 M610,664 C660,674 720,690 770,706" fill="none" stroke="#A9765C" strokeWidth={2.4} strokeLinecap="round" opacity={0.32} />
      <path d="M498,716 C450,694 370,690 290,716 M542,716 C590,694 670,690 750,716" fill="none" stroke="#A9765C" strokeWidth={4} strokeLinecap="round" opacity={0.5} transform="translate(0,5)" />
      <path d="M498,716 C450,694 370,690 290,716 M542,716 C590,694 670,690 750,716" fill="none" stroke="#FFEADA" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
      <ellipse cx={520} cy={726} rx={20} ry={15} fill="#8E5A44" opacity={0.3} />
      <ellipse cx={230} cy={790} rx={66} ry={50} fill="#FFF3E6" opacity={0.25} transform="rotate(-34 230 790)" />
      <ellipse cx={810} cy={790} rx={60} ry={46} fill="#8E5A44" opacity={0.12} transform="rotate(34 810 790)" />
      <path d="M204,840 C214,890 222,950 224,1000 M836,840 C826,890 818,950 816,1000" fill="none" stroke="#A9765C" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
      {Array.from({ length: 44 }, (_, i) => <circle key={i} cx={210 + hash(i, 2) * 620} cy={720 + hash(i, 3) * 220} r={1 + hash(i, 4)} fill="#A9694E" opacity={0.28} />)}
      <path d="M224,936 C350,952 690,952 816,936 L846,1040 L194,1040 Z" fill="url(#pl-tela)" stroke="#6E8496" strokeWidth={1.4} />
      <path d="M224,936 C350,952 690,952 816,936" fill="none" stroke="#FFF" strokeWidth={2} opacity={0.7} />
      <path d="M340,950 C346,972 340,1000 330,1040 M520,954 C522,980 520,1010 516,1040 M700,950 C696,972 704,1000 712,1040" fill="none" stroke="#6E8496" strokeWidth={2.4} opacity={0.4} />
      <g transform="translate(520,119) scale(0.62)"><Retrato id="torso" peinado="recogido" soloCabeza /></g>
    </g>
  );
});
const ANILLOS: [number, number, number][] = [[470, 640, 22], [600, 700, 26], [300, 760, 30], [750, 780, 28], [420, 860, 34], [640, 880, 30], [210, 880, 26], [840, 900, 24], [530, 910, 22]];

const PlacaPsor = (
  <g>
    <path d={lobulos(88, 12, 0.12, 21)} fill="#D84E6C" stroke="#A82B4E" strokeWidth={2.4} />
    {Array.from({ length: 34 }, (_, j) => { const a = j * 2.39996, q = Math.sqrt((j + 0.5) / 34) * 72; return <ellipse key={j} cx={Math.cos(a) * q} cy={Math.sin(a) * q} rx={12} ry={5.4} fill="#F7F4EE" opacity={0.94} stroke="#CFC6B4" strokeWidth={0.7} transform={`rotate(${j * 40} ${f1(Math.cos(a) * q)} ${f1(Math.sin(a) * q)})`} />; })}
  </g>
);
const ArtePsoriasis = <g><rect x={-120} y={-120} width={240} height={240} fill="url(#pl-piel)" />{PlacaPsor}</g>;
const ArteAnillo = <g><rect x={-120} y={-120} width={240} height={240} fill="url(#pl-piel)" /><Anillo r={70} sem={4} /></g>;
const ArteRo = (rl: number) => (
  <g>
    <circle r={25} fill="#7B4FC9" stroke="#3E2478" strokeWidth={1.6} /><circle r={25} fill="url(#sg-bola)" />
    <text dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 19 }}>Ro</text>
    <IgG x={-32} y={-26} ang={128 + Math.sin(rl / 500) * 7} k={0.72} />
    <IgG x={32} y={-26} ang={232 - Math.sin(rl / 500) * 7} k={0.72} />
  </g>
);
const ArteHla = (
  <g>
    <path d="M-27,34 L-27,-12 Q-27,-30 -9,-30 L-9,34 M27,34 L27,-12 Q27,-30 9,-30 L9,34" fill="none" stroke="#2C8FD6" strokeWidth={11} strokeLinecap="round" />
    <path d="M-27,34 L-27,-12 Q-27,-30 -9,-30 L-9,34 M27,34 L27,-12 Q27,-30 9,-30 L9,34" fill="none" stroke="#7FC4F2" strokeWidth={4} strokeLinecap="round" />
    <text y={-1} textAnchor="middle" dy="0.36em" className={s.tarjTit} style={{ fontSize: 15 }}>DR3</text>
  </g>
);
function ArteInternoLeve({ rl }: { rl: number }) {
  return (
    <g>
      <IconoOrgano i="rinon" x={-6} y={-2} k={0.7} />
      <circle cx={26} cy={26} r={15} fill="#1F9A6A" stroke="#FFF" strokeWidth={2.4} opacity={0.85 + 0.15 * Math.sin(rl / 400)} />
      <path d="M26,18 V34 M19,27 L26,34 L33,27" fill="none" stroke="#FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function FondoTorso({ t, reloj }: { t: T; reloj: number }) {
  const to = v(t, 'torso'), so = v(t, 'sol'), an = v(t, 'anillos'), ps = v(t, 'psoriasis'), ca = v(t, 'cara');
  const s1 = v(t, 's1'), s2 = v(t, 's2'), s3 = v(t, 's3'), s4 = v(t, 's4'), s5 = v(t, 's5');
  const zona = (x: number, y: number, txt: string, px: number, py: number, k: number, fin: 'start' | 'end') => k > 0.001 && (
    <g opacity={k}>
      <line x1={fin === 'end' ? x + 6 : x - 6} y1={y - 6} x2={px} y2={py} className={s.guia} />
      <text x={x} y={y} textAnchor={fin} className={halo} style={{ fontSize: 19 }}>{txt}</text>
    </g>
  );
  return (
    <g>
      <Base />
      {so > 0.001 && (
        <g opacity={so}>
          {[0, 1, 2, 3, 4].map((j) => <path key={j} d={`M900,200 L${170 + j * 150},${760 + (j % 2) * 40} L${250 + j * 150},${790 + (j % 2) * 40} Z`} fill="url(#pl-rayo)" opacity={0.7 + 0.3 * Math.sin(reloj / 340 + j)} />)}
          <g transform="translate(900,200)">
            {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * TAU + reloj / 5000; return <line key={i} x1={Math.cos(a) * 54} y1={Math.sin(a) * 54} x2={Math.cos(a) * 76} y2={Math.sin(a) * 76} className={s.rayoSol} />; })}
            <circle r={46} fill="url(#pl-sol)" stroke="#E0A11E" strokeWidth={2} />
          </g>
        </g>
      )}
      <Nota x={1000} y={192} t="Fotosensibilidad extrema" k={s1} fin="start" tam={26} />
      {to > 0.001 && <g opacity={to}><TorsoFijo /></g>}
      {ANILLOS.map(([x, y, r], i) => {
        const k = easeOut(tramo(an, i * 0.08, 0.4 + i * 0.08));
        return k > 0 ? <g key={i} opacity={k} transform={`translate(${x},${y}) scale(${(0.6 + 0.4 * k).toFixed(3)})`}><Anillo r={r} sem={i + 2} /></g> : null;
      })}
      {[[350, 690], [700, 930], [860, 840]].map(([x, y], i) => {
        const k = tramo(ps, i * 0.2, 0.6 + i * 0.2);
        return k > 0 ? <g key={i} opacity={k} transform={`translate(${x},${y}) scale(0.5,0.36)`}>{PlacaPsor}</g> : null;
      })}
      {ca > 0.001 && (
        <g opacity={ca}>
          <ellipse cx={520} cy={405} rx={138} ry={190} className={s.caraLibre} />
          <text x={520} y={190} textAnchor="middle" className={`${s.lEtiquetaVerde} ${s.conHalo}`}>la cara, respetada</text>
        </g>
      )}
      {zona(260, 610, 'cuello', 480, 640, s3, 'end')}
      {zona(120, 690, 'hombros', 250, 716, tramo(s3, 0.15, 0.6), 'end')}
      {zona(60, 800, 'brazos', 180, 830, tramo(s3, 0.3, 0.75), 'end')}
      {s3 > 0.001 && <text x={530} y={806} textAnchor="middle" className={halo} style={{ fontSize: 19 }} opacity={tramo(s3, 0.45, 0.9)}>escote</text>}
      {/* Las dos lesiones, de cerca */}
      <Lente id="pl-t1" x={1130} y={400} r={106} k={s2} flota={Math.sin(reloj / 800) * 3}>{ArteAnillo}</Lente>
      <Nota x={1130} y={558} t="Anillos" k={s2} tam={23} />
      <Lente id="pl-t2" x={1410} y={400} r={106} k={ps} flota={Math.sin(reloj / 800 + 2) * 3}>{ArtePsoriasis}</Lente>
      <Nota x={1410} y={558} t="Tipo psoriasis" k={ps} tam={23} />
      {/* Lo que la acompaña */}
      <Flotante x={1050} y={688} k={s4} rl={reloj} fase={1} esc={1.2} alto={58}>{ArteSinCicatriz}</Flotante>
      <Nota x={1050} y={770} t="no cicatriza" k={s4} tam={18} />
      <Flotante x={1210} y={688} k={tramo(s4, 0.15, 1)} rl={reloj} fase={2} esc={1.2} alto={58}>{ArteRo(reloj)}</Flotante>
      <Nota x={1210} y={770} t="anti-Ro" k={tramo(s4, 0.15, 1)} tam={18} />
      <Flotante x={1370} y={688} k={tramo(s4, 0.3, 1)} rl={reloj} fase={3} esc={1.2} alto={58}>{ArteHla}</Flotante>
      <Nota x={1370} y={770} t="HLA-DR3" k={tramo(s4, 0.3, 1)} tam={18} />
      <Flotante x={1530} y={688} k={s5} rl={reloj} fase={4} esc={1.2} alto={58}><ArteInternoLeve rl={reloj} /></Flotante>
      <Nota x={1530} y={770} t="interno: leve" k={s5} tam={18} />
    </g>
  );
}

// ─── Paso 6 · discoide y banda lúpica ─────────────────────────────────────────

const PielLente = memo(function PielLente() {
  return (
    <g>
      <rect x={-250} y={-250} width={500} height={500} fill="url(#pl-piel)" />
      {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={-240 + hash(i, 2) * 480} cy={-240 + hash(i, 3) * 480} r={0.9 + hash(i, 4)} fill="#A9694E" opacity={0.4} />)}
      {Array.from({ length: 30 }, (_, i) => { const a = hash(i, 5) * TAU, r = 165 + hash(i, 6) * 70, x = Math.cos(a) * r, y = Math.sin(a) * r; return <path key={i} d={`M${f1(x)},${f1(y)} q3,-5 7,-9`} fill="none" stroke="#6E4A36" strokeWidth={1.3} strokeLinecap="round" opacity={0.6} />; })}
    </g>
  );
});

const PLACA_TAPONES = Array.from({ length: 30 }, (_, i) => { const a = i * 2.39996, r = Math.sqrt((i + 0.5) / 30) * 124; return [Math.cos(a) * r, Math.sin(a) * r]; });
const ESCAMAS = Array.from({ length: 22 }, (_, i) => { const a = i * 2.39996 + 0.4, r = 26 + Math.sqrt((i + 0.5) / 22) * 98; return { x: Math.cos(a) * r, y: Math.sin(a) * r, rot: i * 37, q: 0.7 + hash(i, 3) * 0.6, sem: i }; });

const Cuero = memo(function Cuero() {
  return (
    <g>
      <defs><clipPath id="pl-c-cuero"><ellipse rx={270} ry={94} /></clipPath></defs>
      <ellipse cx={4} cy={102} rx={230} ry={8} className={s.sombraSuave} />
      <ellipse rx={270} ry={94} fill="url(#pl-piel)" stroke="#B5846A" strokeWidth={1.4} />
      <g clipPath="url(#pl-c-cuero)">
        {Array.from({ length: 210 }, (_, i) => {
          const x = -262 + hash(i, 1) * 524, y = -86 + hash(i, 2) * 172;
          if (Math.hypot(x / 1.6, y) < 66) return null;
          return <path key={i} d={`M${f1(x)},${f1(y)} q${f1(2 + hash(i, 3) * 4)},-12 ${f1(5 + hash(i, 4) * 7)},-${(20 + hash(i, 5) * 8).toFixed(0)}`} fill="none" stroke={i % 3 ? '#33221B' : '#54392C'} strokeWidth={1.8} strokeLinecap="round" />;
        })}
        {Array.from({ length: 60 }, (_, i) => { const x = -240 + hash(i, 7) * 480, y = -80 + hash(i, 8) * 160; return Math.hypot(x / 1.6, y) < 66 ? null : <circle key={i} cx={x} cy={y} r={1.1} fill="#33221B" opacity={0.8} />; })}
      </g>
      <path d={lobulos(84, 11, 0.09, 12)} transform="scale(1.26,0.74)" fill="#F8E7DC" stroke="#D8A28E" strokeWidth={1.8} />
      <path d={lobulos(58, 9, 0.11, 14)} transform="scale(1.26,0.74)" fill="#FFF7F2" opacity={0.8} />
      <path d="M-58,-22 Q-14,-36 34,-24 M-48,6 Q2,-6 56,6 M-30,28 Q8,20 44,28" fill="none" stroke="#E3B9A8" strokeWidth={1.8} strokeLinecap="round" opacity={0.75} />
    </g>
  );
});

function BandaLupica({ k, rl }: { k: number; rl: number }) {
  if (k <= 0.001) return null;
  const onda = (x: number) => 26 * Math.sin((x + 250) / 32);
  const trazo = Array.from({ length: 67 }, (_, i) => { const x = -254 + i * 7.6; return `${i ? 'L' : 'M'}${f1(x)},${f1(onda(x))}`; }).join(' ');
  return (
    <g opacity={k} transform="translate(1250,790)">
      <ellipse cx={4} cy={112} rx={240} ry={7} className={s.sombraSuave} />
      <rect x={-278} y={-128} width={556} height={236} rx={22} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      <clipPath id="pl-c-if"><rect x={-268} y={-118} width={536} height={216} rx={14} /></clipPath>
      <g clipPath="url(#pl-c-if)">
        <rect x={-268} y={-118} width={536} height={216} fill="url(#pl-if)" />
        {Array.from({ length: 36 }, (_, i) => <ellipse key={i} cx={-262 + (i % 12) * 46 + ((Math.floor(i / 12) % 2) * 23)} cy={-104 + Math.floor(i / 12) * 28} rx={14} ry={9} fill="#2F6F46" opacity={0.28} />)}
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M-268,${48 + i * 9} C-120,${40 + i * 9} 80,${60 + i * 9} 268,${46 + i * 9}`} fill="none" stroke="#2F6F46" strokeWidth={1.4} opacity={0.32} />)}
        <path d={trazo} fill="none" stroke="#3DBE66" strokeWidth={22} strokeLinecap="round" opacity={0.22} />
        <path d={trazo} fill="none" stroke="#6FE08A" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
        {Array.from({ length: 90 }, (_, i) => { const x = -256 + i * 5.7, d = (hash(i, 3) - 0.5) * 11; return <circle key={i} cx={x} cy={f1(onda(x) + d)} r={1.5 + hash(i, 4) * 1.9} fill="#D8FFE0" opacity={0.65 + 0.35 * Math.sin(rl / 260 + i)} />; })}
      </g>
      <text x={-252} y={-82} className={s.etiquetaIf}>epidermis</text>
      <text x={-252} y={86} className={s.etiquetaIf}>dermis</text>
      {[['IgG', '#D9791E'], ['IgM', '#7B4FC9'], ['C3', '#2C8FD6']].map(([n, c], i) => (
        <g key={n} transform={`translate(${112 + i * 58},-86)`}><rect x={-26} y={-15} width={52} height={30} rx={15} fill={c} stroke="#FFF" strokeWidth={1.6} /><text dy="0.36em" textAnchor="middle" className={s.protChico} style={{ fontSize: 15 }}>{n}</text></g>
      ))}
      <text y={146} textAnchor="middle" className={rotulo}>Banda lúpica: IgG, IgM y C3</text>
      <text y={174} textAnchor="middle" className={subRotulo}>en la unión dermoepidérmica</text>
    </g>
  );
}

/** Tubo sin señal y diez personas: casi nadie progresa. */
function Progresa({ k, rl }: { k: number; rl: number }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={tramo(k, 0, 0.4)}>
      <g transform="translate(1000,210)">
        <ellipse cx={0} cy={106} rx={44} ry={6} className={s.sombraSuave} />
        <path d="M-27,-54 L-27,70 A27,21 0 0 0 27,70 L27,-54 Z" fill="#FBE6D6" opacity={0.65} />
        <path d="M-32,-92 L-32,70 A32,25 0 0 0 32,70 L32,-92" fill="url(#sg-vidrio)" stroke="#7D899C" strokeWidth={3} />
        <rect x={-39} y={-103} width={78} height={13} rx={5} fill="#9AA6B8" stroke="#5C6577" strokeWidth={1} />
        <path d="M-21,-82 V62" stroke="#FFF" strokeWidth={4} strokeLinecap="round" opacity={0.65} />
        <g transform={`translate(30,10) scale(${(1 + 0.04 * Math.sin(rl / 400)).toFixed(3)})`}>
          <circle r={25} fill="#FFF" stroke="#6E7789" strokeWidth={3} /><path d="M-11,0 H11" stroke="#3A4256" strokeWidth={5} strokeLinecap="round" />
        </g>
      </g>
      <Nota x={1000} y={356} t="Anticuerpos" sub="a menudo negativos" k={k} tam={22} />
      {Array.from({ length: 10 }, (_, i) => {
        const x = 1180 + (i % 5) * 72, y = 150 + Math.floor(i / 5) * 92, q = tramo(k, 0.2 + i * 0.05, 0.4 + i * 0.05), rojo = i === 0;
        return (
          <g key={i} opacity={q} transform={`translate(${x},${y}) scale(1.8)`} fill={rojo ? '#D1293D' : 'url(#pl-silueta)'}>
            <circle cy={-8} r={7.4} />
            <path d="M-11.6,14 C-11.6,1.4 -6,-.4 0,-.4 C6,-.4 11.6,1.4 11.6,14 Z" />
          </g>
        );
      })}
      <Nota x={1324} y={356} t="Solo 5 a 10 %" sub="progresa a lupus sistémico" k={k} tam={22} />
    </g>
  );
}

export function FondoDiscoide({ t, reloj }: { t: T; reloj: number }) {
  const pl = v(t, 'placa'), ci = v(t, 'cicatriz'), al = v(t, 'alopecia'), ba = v(t, 'banda'), d1 = v(t, 'd1'), d2 = v(t, 'd2'), d3 = v(t, 'd3');
  const cal = (y: number, txt: string, px: number, py: number, k: number) => k > 0.001 && (
    <g opacity={tramo(k, 0.2, 0.8)}>
      <line x1={680} y1={y - 6} x2={px} y2={py} className={s.guia} />
      <text x={688} y={y} className={rotulo} style={{ fontSize: 21 }}>{txt}</text>
    </g>
  );
  return (
    <g>
      <Base />
      <Lente id="pl-c-dis" x={350} y={330} r={224} k={pl}>
        <PielLente />
        <Placa r={146} ci={ci} sem={3} />
        <path d="M-126,-42 q14,8 8,22 t10,18 M108,-74 q-10,14 2,24 t-6,20 M70,112 q10,-14 24,-6 t16,-14 M-92,104 q12,-6 14,-22 t16,-8" fill="none" stroke="#B81E48" strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
        {PLACA_TAPONES.map(([x, y], i) => (
          <g key={i} transform={`translate(${f1(x)},${f1(y)})`}>
            <circle r={7} fill="#F4C9B8" opacity={0.65} />
            <circle r={4.2} fill="#3E2418" /><circle cx={-1.2} cy={-1.4} r={1.2} fill="#FFF" opacity={0.55} />
          </g>
        ))}
        {ESCAMAS.map((e) => (
          <g key={e.sem} transform={`translate(${f1(e.x)},${f1(e.y)}) rotate(${e.rot}) scale(${e.q.toFixed(2)})`} opacity={1 - ci * 0.45}>
            <path d={lobulos(14, 6, 0.26, e.sem + 4)} fill="#FBF6EA" stroke="#BFAE8E" strokeWidth={1} />
            <path d="M-7,-2 L6,-3 M-5,4 L4,3" stroke="#D8CBAE" strokeWidth={1} strokeLinecap="round" />
          </g>
        ))}
      </Lente>
      {cal(190, 'escama adherente', 440, 230, d1)}
      {cal(250, 'tapones foliculares', 462, 300, tramo(d1, 0.15, 1))}
      {cal(310, 'placa roja', 480, 350, tramo(d1, 0.3, 1))}
      {cal(370, 'atrofia y cicatriz', 390, 370, d2)}
      {cal(430, 'cambios de pigmento', 490, 440, tramo(d2, 0.2, 1))}
      {al > 0.001 && (
        <g opacity={al} transform="translate(350,790)">
          <Cuero />
          <text y={138} textAnchor="middle" className={rotulo} style={{ fontSize: 21 }}>Alopecia cicatricial: permanente</text>
        </g>
      )}
      <Progresa k={d3} rl={reloj} />
      <BandaLupica k={ba} rl={reloj} />
    </g>
  );
}

// ─── Paso 8 · el sistema nervioso ─────────────────────────────────────────────

const Cabeza = ({ children }: { children?: ReactNode }) => (
  <g>
    <path d="M-30,44 V24 C-44,14 -48,-8 -38,-26 C-26,-46 16,-48 30,-30 C38,-20 38,-10 36,-4 L44,12 C46,16 42,18 36,18 V28 C36,34 30,36 22,34 H10 V44 Z" fill="#F1CDB4" stroke="#A9765C" strokeWidth={1.8} strokeLinejoin="round" />
    {children}
  </g>
);
const ArteCefalea = (rl: number) => (
  <Cabeza>
    {[[-8, -18, -16], [12, -24, 14], [-24, -8, -40]].map(([x, y, a], i) => (
      <path key={i} d="M2,-13 L-6,1 H1 L-3,13 L8,-3 H1 Z" fill="#F2B21E" stroke="#A8821A" strokeWidth={0.9} strokeLinejoin="round" transform={`translate(${x},${y}) rotate(${a}) scale(${(1 + 0.16 * Math.sin(rl / 170 + i)).toFixed(3)})`} />
    ))}
  </Cabeza>
);
const ArteAnimo = (rl: number) => (
  <g>
    <circle r={32} cy={8} fill="#F1CDB4" stroke="#A9765C" strokeWidth={1.8} />
    <path d="M-16,0 q5,-5 10,0 M6,0 q5,-5 10,0" fill="none" stroke="#3A2820" strokeWidth={3} strokeLinecap="round" />
    <path d="M-12,24 Q0,12 12,24" fill="none" stroke="#3A2820" strokeWidth={3.4} strokeLinecap="round" />
    <path d="M-30,-24 C-38,-38 -14,-46 -6,-36 C4,-48 28,-42 26,-28 C38,-26 36,-12 26,-14 H-26 C-36,-14 -38,-24 -30,-24 Z" fill="#9AA6B8" stroke="#6E7789" strokeWidth={1.2} />
    {[-16, 2, 18].map((x, i) => { const f = (rl / 1000 + i / 3) % 1; return <line key={x} x1={x} y1={-10 + f * 16} x2={x - 2} y2={-4 + f * 16} stroke="#4F86D6" strokeWidth={2.6} strokeLinecap="round" opacity={1 - f} />; })}
  </g>
);
const ArteDelirio = (rl: number) => (
  <g transform={`rotate(${f1(rl / 16)})`}>
    <path d={Array.from({ length: 58 }, (_, i) => { const a = i * 0.34, r = 3 + i * 0.68; return `${i ? 'L' : 'M'}${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)}`; }).join(' ')} fill="none" stroke="#7B4FC9" strokeWidth={4} strokeLinecap="round" />
  </g>
);
const ArtePsicosis = (rl: number) => (
  <Cabeza>
    {[0, 1, 2].map((j) => { const f = (rl / 1500 + j / 3) % 1; return <path key={j} d="M-8,-6 C-16,-16 -2,-24 6,-18 C14,-24 24,-12 14,-6 C16,0 4,4 -2,-2 Z" fill="#FFF" stroke="#7B4FC9" strokeWidth={1.6} transform={`translate(${-18 + j * 20},${f1(-30 - f * 12)}) scale(${(0.5 + f * 0.3).toFixed(2)})`} opacity={Math.sin(f * Math.PI)} />; })}
    <circle cx={14} cy={-6} r={4} fill="#3A2820" />
  </Cabeza>
);
const ArteConvulsion = (rl: number) => (
  <path d="M-34,0 H-20 L-12,-30 L0,28 L10,-20 L18,10 H36" fill="none" stroke="#E5293F" strokeWidth={5.4} strokeLinecap="round" strokeLinejoin="round" transform={`scale(1,${(1 + 0.2 * Math.sin(rl / 90)).toFixed(3)})`} />
);
export const ArteVirus = (rl: number) => (
  <g transform={`rotate(${f1(rl / 60)})`}>
    {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * TAU; return <g key={i}><line x1={Math.cos(a) * 18} y1={Math.sin(a) * 18} x2={Math.cos(a) * 31} y2={Math.sin(a) * 31} stroke="#1F7A66" strokeWidth={3} /><circle cx={Math.cos(a) * 33} cy={Math.sin(a) * 33} r={4} fill="#E5484D" /></g>; })}
    <circle r={21} fill="#2CA99A" stroke="#14695F" strokeWidth={1.6} /><circle cx={-6} cy={-7} r={5.4} fill="#FFF" opacity={0.45} />
  </g>
);
const ArteMetabolico = (
  <g>
    <path d="M-14,-34 V-18 L-30,18 C-36,30 -28,36 -18,36 H18 C28,36 36,30 30,18 L14,-18 V-34 Z" fill="#F7F9FB" fillOpacity={0.75} stroke="#7D899C" strokeWidth={2.6} />
    <path d="M-23,8 C-10,2 8,14 23,8 L30,20 C34,30 26,34 18,34 H-18 C-26,34 -34,30 -30,20 Z" fill="#E8B21E" />
    <rect x={-18} y={-40} width={36} height={8} rx={3} fill="#9AA6B8" />
    <circle cx={-7} cy={22} r={3} fill="#FFF" opacity={0.8} /><circle cx={9} cy={18} r={2.2} fill="#FFF" opacity={0.8} />
  </g>
);
export const ArteCorticoide = (
  <g>
    <g transform="rotate(-32)">
      <rect x={-32} y={-14} width={64} height={28} rx={14} fill="#F7F9FB" stroke="#7D899C" strokeWidth={2} />
      <path d="M0,-14 H18 A14,14 0 0 1 18,14 H0 Z" fill="#E0526E" />
      <rect x={-24} y={-9} width={38} height={4} rx={2} fill="#FFF" opacity={0.75} />
    </g>
    <circle cx={18} cy={24} r={12} fill="#FFF" stroke="#7D899C" strokeWidth={2} /><path d="M9,24 H27" stroke="#7D899C" strokeWidth={2} />
  </g>
);

/** Trazado de un EEG: tranquilo hasta que llegan las convulsiones. */
function Trazado({ k, conv, rl }: { k: number; conv: number; rl: number }) {
  if (k <= 0.001) return null;
  const y = (x: number) => {
    const base = Math.sin(x / 7 + rl / 170) * 5 + Math.sin(x / 3.4 - rl / 90) * 2.5;
    const f = (x + rl / 7) % 62;
    return base - conv * (f < 6 ? 34 * (1 - f / 6) : f < 13 ? -20 * (1 - (f - 6) / 7) : 0);
  };
  const d = Array.from({ length: 121 }, (_, i) => { const x = i * 4.2; return `${i ? 'L' : 'M'}${f1(x)},${f1(y(x))}`; }).join(' ');
  return (
    <g opacity={k} transform="translate(148,842)">
      <rect x={-22} y={-54} width={548} height={108} rx={16} fill="url(#sg-acero)" stroke="#5C6577" strokeWidth={1} />
      <rect x={-14} y={-46} width={532} height={92} rx={10} fill="#0B1712" />
      {Array.from({ length: 21 }, (_, i) => <line key={i} x1={-14 + i * 26.6} y1={-46} x2={-14 + i * 26.6} y2={46} stroke="#1F4E3A" strokeWidth={1} opacity={0.6} />)}
      {[-23, 0, 23].map((yy) => <line key={yy} x1={-14} y1={yy} x2={518} y2={yy} stroke="#1F4E3A" strokeWidth={1} opacity={0.6} />)}
      <path d={d} fill="none" stroke={conv > 0.5 ? '#FF7A86' : '#6FE08A'} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  );
}

function ItemNeuro({ x, y, k, rl, fase, txt, esc = 1.5, children }: { x: number; y: number; k: number; rl: number; fase: number; txt: string; esc?: number; children: ReactNode }) {
  return (
    <g>
      <Flotante x={x} y={y} k={k} rl={rl} fase={fase} esc={esc} alto={68}>{children}</Flotante>
      <Nota x={x} y={y + 106} t={txt} k={k} tam={20} />
    </g>
  );
}

export function FondoNeuro({ t, reloj }: { t: T; reloj: number }) {
  const ce = v(t, 'cer'), n1 = v(t, 'ne1'), n2 = v(t, 'ne2'), n3 = v(t, 'ne3'), d1 = v(t, 'de1'), d2 = v(t, 'de2'), d3 = v(t, 'de3');
  const late = 0.5 + 0.5 * Math.sin(reloj / 300);
  const foco = (x: number, y: number, r: number, k: number, c: string) => k > 0.001 && <circle cx={x} cy={y} r={r * (0.9 + 0.1 * late)} fill={c} opacity={k * (0.45 + 0.3 * late)} />;
  const sube = Math.sin(reloj / 900) * 8;
  return (
    <g>
      <Base />
      <defs>
        <radialGradient id="pl-f1"><stop offset="0" stopColor="#7B4FC9" stopOpacity="0.85" /><stop offset="1" stopColor="#7B4FC9" stopOpacity="0" /></radialGradient>
        <radialGradient id="pl-f2"><stop offset="0" stopColor="#E0892E" stopOpacity="0.9" /><stop offset="1" stopColor="#E0892E" stopOpacity="0" /></radialGradient>
        <radialGradient id="pl-f3"><stop offset="0" stopColor="#E5293F" stopOpacity="0.9" /><stop offset="1" stopColor="#E5293F" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx={396} cy={668} rx={190 * (1 + sube * 0.006)} ry={12} className={s.sombraSuave} opacity={tramo(ce, 0, 0.4) * 0.7} />
      {ce > 0.001 && <g opacity={tramo(ce, 0, 0.4)} transform={`translate(396,${f1(376 + sube + (1 - easeOut(ce)) * 24)}) scale(${(0.88 + 0.12 * easeBack(clamp(ce))).toFixed(3)})`}>
        <IconoOrgano i="cerebro" x={0} y={-6} k={4.25} />
        {foco(-120, -70, 92, n1, 'url(#pl-f1)')}
        {foco(-20, 74, 82, n2, 'url(#pl-f2)')}
        {foco(60, -60, 108, n3, 'url(#pl-f3)')}
        {foco(-96, 24, 78, n3, 'url(#pl-f3)')}
        {n3 > 0.001 && [0, 1, 2].map((j) => { const f = (reloj / 900 + j / 3) % 1; return <circle key={j} cx={30} cy={-20} r={30 + f * 190} fill="none" stroke="#E5293F" strokeWidth={4} opacity={n3 * (1 - f) * 0.65} />; })}
        {n3 > 0.001 && Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * TAU + Math.floor(reloj / 170) * 1.3;
          return <path key={i} d={`M${f1(30 + Math.cos(a) * 40)},${f1(-20 + Math.sin(a) * 40)} l${f1(Math.cos(a + 0.5) * 22)},${f1(Math.sin(a + 0.5) * 22)} l${f1(Math.cos(a - 0.5) * 20)},${f1(Math.sin(a - 0.5) * 20)} l${f1(Math.cos(a + 0.4) * 18)},${f1(Math.sin(a + 0.4) * 18)}`} fill="none" stroke="#FFD54A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={n3 * 0.9} />;
        })}
      </g>}
      <text x={396} y={744} textAnchor="middle" className={rotulo} opacity={tramo(ce, 0.5, 1)}>Sistema nervioso</text>
      <Trazado k={ce} conv={easeOut(n3)} rl={reloj} />
      {/* De lo leve a lo grave, en imágenes */}
      <ItemNeuro x={880} y={120} k={n1} rl={reloj} fase={0} txt="cefalea">{ArteCefalea(reloj)}</ItemNeuro>
      <ItemNeuro x={1060} y={120} k={tramo(n1, 0.2, 1)} rl={reloj} fase={1.7} txt="ánimo">{ArteAnimo(reloj)}</ItemNeuro>
      <ItemNeuro x={880} y={372} k={n2} rl={reloj} fase={3.4} txt="delirio">{ArteDelirio(reloj)}</ItemNeuro>
      <ItemNeuro x={1060} y={372} k={tramo(n2, 0.2, 1)} rl={reloj} fase={5.1} txt="psicosis">{ArtePsicosis(reloj)}</ItemNeuro>
      <ItemNeuro x={1240} y={372} k={tramo(n2, 0.4, 1)} rl={reloj} fase={0.8} txt="convulsiones">{ArteConvulsion(reloj)}</ItemNeuro>
      <Sello x={1350} y={126} w={392} txt="EN LOS CRITERIOS" k={n3} sz={26} rot={-3} />
      <text x={1350} y={186} textAnchor="middle" className={subRotulo} opacity={tramo(n3, 0.5, 1)}>psicosis y convulsiones: de lo más grave</text>
      {/* Lo que hay que descartar */}
      {d1 > 0.001 && <text x={1120} y={628} textAnchor="middle" className={rotulo} style={{ fontSize: 26 }} opacity={tramo(d1, 0.2, 0.8)}>Antes de culpar al lupus, descarta</text>}
      <ItemNeuro x={880} y={758} k={d1} rl={reloj} fase={2.5} txt="infección" esc={1.9}>{ArteVirus(reloj)}</ItemNeuro>
      <ItemNeuro x={1120} y={758} k={d2} rl={reloj} fase={4.2} txt="trastorno metabólico">{ArteMetabolico}</ItemNeuro>
      <ItemNeuro x={1360} y={758} k={d3} rl={reloj} fase={6} txt="corticoides">{ArteCorticoide}</ItemNeuro>
    </g>
  );
}
