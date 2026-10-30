'use client';
// Láminas del capítulo 10 («Cómo se diagnostica»):
// · `pruebas`: sensibilidad y especificidad de los ANA, el anti-ADN de doble
//   cadena y el anti-Smith, en barras que crecen a la par de la voz.
// · `eular`: los criterios EULAR/ACR 2019 (entrada, regla y dominios) y el caso
//   que se suma en voz alta hasta 22 puntos, con «SOAP BRAIN MD» al final.

import { L } from '@/lib/data/lupus/colores';
import { clamp, easeBack, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

function Chip({ x, y, w, txt, k, clase = s.chip }: { x: number; y: number; w: number; txt: string; k: number; clase?: string }) {
  if (k <= 0.001) return null;
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(clamp(k))})`}>
      <rect x={-w / 2} y={-26} width={w} height={52} rx={26} className={clase} />
      <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>{txt}</text>
    </g>
  );
}

// ─── Sensibilidad y especificidad ─────────────────────────────────────────────

const FILAS = [
  { p: 'ana', n: 'ANA', sens: 0.97, esp: 0.3, y: 230 },
  { p: 'dsdna', n: 'Anti-ADN de doble cadena', sens: 0.6, esp: 0.95, y: 360 },
  { p: 'sm', n: 'Anti-Smith', sens: 0.25, esp: 0.98, y: 490 },
];
const X_S = 560, X_E = 1060, W = 420;

export function FondoPruebas({ t }: { t: T }) {
  const visibles = FILAS.filter((f) => v(t, f.p) > 0.001);
  if (!visibles.length) return null;
  return (
    <g>
      <text x={X_S + W / 2} y={150} textAnchor="middle" className={s.lEtiquetaMayus}>Sensibilidad</text>
      <text x={X_E + W / 2} y={150} textAnchor="middle" className={s.lEtiquetaMayus}>Especificidad</text>
      {FILAS.map((f) => {
        const k = v(t, f.p);
        if (k <= 0.001) return null;
        const ks = easeOut(v(t, `${f.p}S`)), ke = easeOut(v(t, `${f.p}E`));
        return (
          <g key={f.p} opacity={tramo(k, 0, 0.3)}>
            <text x={X_S - 30} y={f.y} dy="0.35em" textAnchor="end" className={s.tituloSeccionChico}>{f.n}</text>
            <rect x={X_S} y={f.y - 20} width={W} height={40} rx={20} className={s.rielEspectro} />
            <rect x={X_S} y={f.y - 20} width={W * f.sens * ks} height={40} rx={20} fill="#2F6FD0" />
            {ks > 0.6 && <text x={X_S + W * f.sens - 14} y={f.y} dy="0.35em" textAnchor={f.sens > 0.3 ? 'end' : 'start'} dx={f.sens > 0.3 ? 0 : 24} className={f.sens > 0.3 ? s.chipTxtBlanco : s.chipTxt}>{f.sens > 0.9 ? 'muy alta' : f.sens > 0.5 ? 'media' : 'baja'}</text>}
            <rect x={X_E} y={f.y - 20} width={W} height={40} rx={20} className={s.rielEspectro} />
            <rect x={X_E} y={f.y - 20} width={W * f.esp * ke} height={40} rx={20} fill={L.lupus} />
            {ke > 0.6 && <text x={X_E + W * f.esp - 14} y={f.y} dy="0.35em" textAnchor={f.esp > 0.4 ? 'end' : 'start'} dx={f.esp > 0.4 ? 0 : 24} className={f.esp > 0.4 ? s.chipTxtBlanco : s.chipTxt}>{f.esp > 0.9 ? 'muy alta' : 'baja'}</text>}
          </g>
        );
      })}
    </g>
  );
}

// ─── EULAR/ACR 2019 y el caso ─────────────────────────────────────────────────

const CLINICOS = ['Constitucional', 'Hematológico', 'Neuropsiquiátrico', 'Mucocutáneo', 'Serosas', 'Musculoesquelético', 'Renal'];
const INMUNO = ['Antifosfolípidos', 'Complemento', 'Anticuerpos específicos'];
const LETRAS: [string, string][] = [['S', 'Serositis'], ['O', 'Úlceras orales'], ['A', 'Artritis'], ['P', 'Fotosensibilidad'], ['B', 'Sangre'], ['R', 'Riñón'], ['A', 'ANA'], ['I', 'Inmunología'], ['N', 'Neurología'], ['M', 'Malar'], ['D', 'Discoide']];

export function FondoEular({ t }: { t: T }) {
  const ti = v(t, 'eularTit'), en = v(t, 'entrada'), re = v(t, 'regla'), cl = v(t, 'clinicos'), im = v(t, 'inmuno');
  const ca = v(t, 'caso'), ar = v(t, 'artritis'), mu = v(t, 'mucocutaneo'), co = v(t, 'complementoC'), ds = v(t, 'dsdnaC'), to = v(t, 'total'), so = v(t, 'soap');
  const puntos = Math.round(6 * ar + 2 * tramo(mu, 0, 0.4) * (1 - tramo(mu, 0.5, 1)) + 6 * tramo(mu, 0.5, 1) + 4 * co + 6 * ds);
  return (
    <g>
      {ti > 0.001 && <text x={800} y={120} textAnchor="middle" className={s.tituloSeccion} opacity={ti}>Criterios EULAR/ACR 2019</text>}
      <Chip x={800} y={210} w={460} txt="Entrada: ANA ≥ 1:80" k={en} clase={s.chipPista} />
      {re > 0.001 && (
        <g opacity={re}>
          <Chip x={420} y={310} w={420} txt="≥ 1 criterio clínico" k={1} />
          <Chip x={860} y={310} w={340} txt="≥ 10 puntos" k={1} clase={s.chipPista} />
          <Chip x={1260} y={310} w={420} txt="por dominio, el de más peso" k={1} />
        </g>
      )}
      {cl > 0.001 && (
        <g>
          <text x={430} y={410} textAnchor="middle" className={s.lEtiquetaMayus} opacity={cl}>Dominios clínicos</text>
          {CLINICOS.map((d, i) => {
            const k = tramo(cl, i * 0.1, 0.4 + i * 0.1);
            const x = 260 + (i % 2) * 340, y = 470 + Math.floor(i / 2) * 76;
            return k > 0 ? <Chip key={d} x={x} y={y} w={310} txt={d} k={k} /> : null;
          })}
        </g>
      )}
      {im > 0.001 && (
        <g>
          <text x={1170} y={410} textAnchor="middle" className={s.lEtiquetaMayus} opacity={im}>Dominios inmunológicos</text>
          {INMUNO.map((d, i) => {
            const k = tramo(im, i * 0.2, 0.5 + i * 0.2);
            return k > 0 ? <Chip key={d} x={1170} y={470 + i * 76} w={380} txt={d} k={k} clase={s.chipPista} /> : null;
          })}
        </g>
      )}

      {/* El caso */}
      {ca > 0.001 && (
        <g opacity={ca}>
          <rect x={100} y={130} width={620} height={110} rx={20} className={s.tarjeta} />
          <text x={130} y={178} className={s.tarjetaTitulo}>Mujer de 26 años</text>
          <text x={130} y={216} className={s.significado}>ANA 1:320 · entra</text>
          <rect x={1000} y={130} width={500} height={330} rx={24} className={s.tarjeta} />
          <text x={1250} y={190} textAnchor="middle" className={s.lEtiquetaMayus}>Puntos</text>
          <text x={1250} y={310} textAnchor="middle" className={s.puntaje} style={{ fill: puntos >= 10 ? L.lupus : undefined }}>{puntos}</text>
          <rect x={1040} y={370} width={420} height={26} rx={13} className={s.rielEspectro} />
          <rect x={1040} y={370} width={420 * Math.min(1, puntos / 22)} height={26} rx={13} fill={L.lupus} />
          <line x1={1040 + (420 * 10) / 22} y1={356} x2={1040 + (420 * 10) / 22} y2={410} className={s.lineaUmbral} />
          <text x={1040 + (420 * 10) / 22} y={436} textAnchor="middle" className={s.lSub}>10</text>
        </g>
      )}
      {[
        { k: ar, t: 'Artritis en las dos muñecas, rigidez matinal', pts: '+6' },
        { k: tramo(mu, 0, 0.5), t: 'Úlceras orales', pts: '2', tachar: tramo(mu, 0.5, 1) },
        { k: tramo(mu, 0.5, 1), t: 'Exantema malar (mismo dominio: cuenta solo este)', pts: '+6' },
        { k: co, t: 'C3 y C4 bajos', pts: '+4' },
        { k: ds, t: 'Anti-ADN de doble cadena', pts: '+6' },
      ].map((f, i) => f.k > 0.001 && (
        <g key={i} opacity={f.k} transform={`translate(${20 * (1 - easeOut(f.k))},0)`}>
          <text x={130} y={310 + i * 66} className={s.significado}>{f.t}</text>
          <text x={900} y={310 + i * 66} textAnchor="end" className={`${s.significado} ${s.textoLupus}`}>{f.pts}</text>
          {(f.tachar ?? 0) > 0.001 && <line x1={124} y1={300 + i * 66} x2={124 + 790 * easeOut(f.tachar!)} y2={300 + i * 66} className={s.tachado} />}
        </g>
      ))}
      <Chip x={1250} y={520} w={480} txt="≥ 10: clasifica como lupus" k={to} clase={s.chipPista} />
      {so > 0.001 && (
        <g>
          <text x={800} y={690} textAnchor="middle" className={s.lEtiquetaMayus} opacity={tramo(so, 0, 0.1)}>Para recordarlas: SOAP BRAIN MD</text>
          {LETRAS.map(([l, n], i) => {
            const k = tramo(so, 0.08 + i * 0.075, 0.2 + i * 0.075);
            if (k <= 0) return null;
            const grupo = i < 4 ? 0 : i < 9 ? 1 : 2;
            const x = 90 + i * 132 + grupo * 30;
            return (
              <g key={i} opacity={k} transform={`translate(${x},790) scale(${0.8 + 0.2 * easeBack(k)})`}>
                <rect x={-56} y={-50} width={112} height={100} rx={18} fill={[L.lupus, '#2F6FD0', '#7B4FC9'][grupo]} />
                <text y={-4} textAnchor="middle" className={s.letraSoap}>{l}</text>
                <text y={32} textAnchor="middle" className={s.letraSoapSub}>{n}</text>
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
}
