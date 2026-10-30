'use client';
// Lámina del capítulo 1 («¿Por qué aparece?»). Una cerradura con tres llaves
// (genes, hormonas, ambiente) que en el paso 0 está grande en el centro y desde
// el paso 1 queda a la izquierda (`panel`); cada llave asoma al empezar su
// apartado (0,5) y entra al terminarlo (1). A la derecha, lo de cada apartado:
// cromosoma 6 y gemelos, complemento temprano, balanza hormonal y cromosoma X,
// piel bajo la luz UV, el virus de Epstein-Barr, lo que tienen en común y el
// lupus por fármacos. Las células y moléculas (dendrítica, macrófago, C1q…) son
// actores del motor; aquí va lo demás.

import { memo } from 'react';
import { L } from '@/lib/data/lupus/colores';
import { clamp, dibujar, easeBack, easeInOut, easeOut, tramo, v, type T } from './laminas';
import s from '@/styles/lupus.module.css';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ─── Cerradura ────────────────────────────────────────────────────────────────

const COL_LLAVE = ['#7B4FC9', '#C2385A', '#D9881E'];
const NOMBRES = ['Genes', 'Hormonas', 'Ambiente'];
const FILAS = [-70, 10, 90];

function Llave({ c }: { c: string }) {
  return (
    <g>
      <circle r={18} fill="none" stroke={c} strokeWidth={9} />
      <rect x={16} y={-5} width={96} height={10} rx={3} fill={c} />
      <rect x={80} y={4} width={8} height={15} rx={2} fill={c} />
      <rect x={96} y={4} width={8} height={10} rx={2} fill={c} />
    </g>
  );
}

function Y({ x, y, ang, k, c }: { x: number; y: number; ang: number; k: number; c: string }) {
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(0)}) scale(${k.toFixed(2)})`}>
      <path d="M0,10 L0,0 M0,0 L-8,-10 M0,0 L8,-10" stroke={c} strokeWidth={4} strokeLinecap="round" fill="none" />
    </g>
  );
}

function Cerradura({ t }: { t: T }) {
  const ca = v(t, 'candado');
  if (ca <= 0.001) return null;
  const pa = easeInOut(v(t, 'panel'));
  const x = lerp(800, 215, pa), y = lerp(545, 520, pa), k = lerp(1.4, 0.9, pa);
  const ab = easeOut(v(t, 'abierta')), foco = v(t, 'foco'), an = v(t, 'anticuerpos');
  const llaves = [v(t, 'llave1'), v(t, 'llave2'), v(t, 'llave3')];
  const ni = v(t, 'ninguna'), tr = v(t, 'tresllaves');
  return (
    <g opacity={ca}>
      {/* Autoanticuerpos que salen al abrirse (solo con la cerradura grande) */}
      {an > 0.001 && an < 0.999 && Array.from({ length: 11 }, (_, i) => {
        const ang = (-170 + i * 16) * (Math.PI / 180);
        const q = easeOut(tramo(an, i * 0.03, 0.6 + i * 0.03));
        const r = 120 + 220 * q;
        return q > 0 ? <Y key={i} x={x + Math.cos(ang) * r} y={y - 200 * k + Math.sin(ang) * r * 0.75} ang={(ang * 180) / Math.PI + 90} k={2.4} c={L.ana} /> : null;
      })}
      <g transform={`translate(${x},${y}) scale(${k * (0.85 + 0.15 * easeBack(ca))})`}>
        {/* Las llaves van detrás del cuerpo: lo que entra queda tapado. */}
        {llaves.map((q, i) => {
          if (q <= 0.001) return null;
          // En espera, fuera del ojo de la cerradura; a la izquierda (panel), más cerca para no salirse del lienzo.
          const espera = lerp(-290, -205, pa);
          const lx = q <= 0.5 ? espera : lerp(espera, -150, easeInOut((q - 0.5) / 0.5));
          return <g key={i} opacity={Math.min(1, q * 2)} transform={`translate(${lx},${FILAS[i]})`}><Llave c={COL_LLAVE[i]} /></g>;
        })}
        <g transform={`translate(0 ${-38 * ab}) rotate(${-26 * ab} -70 -140)`}>
          <path d="M-70,-130 L-70,-190 A70,70 0 0 1 70,-190 L70,-130" className={s.candadoArco} />
        </g>
        <rect x={-112} y={-140} width={224} height={290} rx={30} className={s.candadoCuerpo} />
        {FILAS.map((fy, i) => {
          const h = clamp(1 - Math.abs(foco - (i + 1)));
          const dentro = llaves[i] >= 0.999;
          return (
            <g key={i}>
              {h > 0.001 && <rect x={-100} y={fy - 32} width={200} height={62} rx={14} fill={COL_LLAVE[i]} opacity={0.16 * h} />}
              <circle cx={-62} cy={fy - 6} r={11} className={s.ojoCerradura} />
              <path d={`M${-67},${fy} L${-57},${fy} L${-59},${fy + 18} L${-65},${fy + 18} Z`} className={s.ojoCerradura} />
              <text x={-34} y={fy} dy="0.35em" className={s.candadoTxt} style={dentro || h > 0.5 ? { fill: COL_LLAVE[i] } : undefined}>{NOMBRES[i]}</text>
            </g>
          );
        })}
      </g>
      {/* Rótulos del paso 0 (cerradura grande) */}
      {ni > 0.001 && (
        <g opacity={ni * (1 - tramo(an, 0.2, 0.5))} transform={`translate(800,850)`}>
          <rect x={-170} y={-28} width={340} height={56} rx={28} className={s.chip} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Ninguna basta sola</text>
        </g>
      )}
      {an > 0.3 && <text x={800} y={858} textAnchor="middle" className={`${s.significado} ${s.textoLupus}`} opacity={tramo(an, 0.3, 0.6) * (1 - pa)}>se pierde la tolerancia → autoanticuerpos</text>}
      {tr > 0.001 && (
        <g opacity={tr * (1 - pa)} transform={`translate(800,930) scale(${0.85 + 0.15 * easeBack(tr)})`}>
          <text textAnchor="middle" className={s.lSub}>una cerradura con tres llaves: genes · hormonas · ambiente</text>
        </g>
      )}
    </g>
  );
}

// ─── 1 · Genes ────────────────────────────────────────────────────────────────

const Cromosoma6 = memo(function Cromosoma6() {
  const bandas = [470, 500, 545, 640, 690, 740, 800, 860, 920];
  return (
    <g>
      <rect x={440} y={218} width={158} height={44} rx={22} className={s.cromosoma} />
      <rect x={606} y={218} width={374} height={44} rx={22} className={s.cromosoma} />
      {bandas.map((x) => <rect key={x} x={x} y={219} width={14} height={42} className={s.bandaCromosoma} />)}
      <rect x={516} y={216} width={40} height={48} rx={6} fill={L.mecanismo} />
      <text x={440} y={196} className={s.lEtiquetaMayus}>Cromosoma 6</text>
    </g>
  );
});

function Genes({ t }: { t: T }) {
  const hl = v(t, 'hla'), ge = v(t, 'gemelos'), ci = v(t, 'cien');
  const X0 = 1090, ESC = 4; // 100 % = 400 px
  return (
    <g>
      {hl > 0.001 && (
        <g opacity={tramo(hl, 0, 0.4)}>
          <Cromosoma6 />
          <line x1={536} y1={266} x2={536} y2={292} className={s.guia} />
          <text x={536} y={312} textAnchor="middle" className={s.lEtiqueta}>región HLA (MHC)</text>
          {hl > 0.5 && (
            <g opacity={tramo(hl, 0.5, 1)}>
              {['HLA-DR2', 'HLA-DR3'].map((n, i) => (
                <g key={n} transform={`translate(${520 + i * 180},${362}) scale(${0.85 + 0.15 * easeBack(tramo(hl, 0.5 + i * 0.15, 0.85 + i * 0.15))})`}>
                  <rect x={-78} y={-24} width={156} height={48} rx={24} fill={L.mecanismo} />
                  <text textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>{n}</text>
                </g>
              ))}
              <text x={880} y={370} className={s.lSub}>clase II</text>
            </g>
          )}
        </g>
      )}
      {ge > 0.001 && (
        <g opacity={ge}>
          <text x={X0} y={176} className={s.lEtiquetaMayus}>Riesgo compartido (concordancia)</text>
          <text x={X0} y={222} className={s.lEtiqueta}>Hermano</text>
          <rect x={X0} y={234} width={4 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} />
          <text x={X0 + 30} y={247} dy="0.35em" className={s.lSub}>≈ 2–5 %</text>
          <text x={X0} y={302} className={s.lEtiqueta}>Gemelo idéntico</text>
          <rect x={X0} y={314} width={50 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} opacity={0.35} />
          <rect x={X0} y={314} width={25 * ESC * easeOut(ge)} height={26} rx={6} fill={L.causas} />
          <text x={X0 + 50 * ESC + 14} y={327} dy="0.35em" className={s.lSub}>≈ 25–50 %</text>
          {ci > 0.001 && (
            <g opacity={ci}>
              <line x1={X0 + 100 * ESC} y1={200} x2={X0 + 100 * ESC} y2={350} className={s.lineaCien} />
              <text x={X0 + 100 * ESC} y={190} textAnchor="middle" className={s.lEtiqueta}>100 %</text>
              <text x={X0} y={396} className={s.lSub}>nunca llega al 100 %: los genes no lo son todo</text>
            </g>
          )}
        </g>
      )}
    </g>
  );
}

// ─── 2 · Complemento temprano ─────────────────────────────────────────────────

function Complemento({ t }: { t: T }) {
  const ti = v(t, 'tituloC'), du = v(t, 'duda'), pu = v(t, 'pues'), fa = v(t, 'faltan'), ri = v(t, 'riesgoC1q'), li = v(t, 'limpieza');
  return (
    <g>
      {ti > 0.001 && (
        <g opacity={ti}>
          <text x={690} y={176} textAnchor="middle" className={s.tituloSeccion}>Déficit de complemento temprano</text>
        </g>
      )}
      {du > 0.001 && (
        <g opacity={du} transform={`translate(${1275},${250}) scale(${0.85 + 0.15 * easeBack(du)})`}>
          <rect x={-270} y={-46} width={540} height={92} rx={30} className={s.burbuja} />
          <path d="M-270,10 L-310,26 L-262,30 Z" className={s.burbuja} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>¿Menos complemento = menos inflamación?</text>
          {pu > 0.001 && <line x1={-240} y1={0} x2={-240 + 480 * easeOut(pu)} y2={0} className={s.tachadoRojo} />}
        </g>
      )}
      {pu > 0.001 && (
        <g opacity={pu}>
          <text x={1275} y={340} textAnchor="middle" className={s.lEtiquetaVerde}>No: el complemento temprano LIMPIA</text>
        </g>
      )}
      {fa > 0.001 && (
        <g opacity={fa}>
          {[560, 690, 820].map((x, i) => {
            const q = easeOut(tramo(fa, i * 0.15, 0.55 + i * 0.15));
            return <path key={x} d={`M${x - 34 * q},${270 - 34 * q} L${x + 34 * q},${270 + 34 * q} M${x + 34 * q},${270 - 34 * q} L${x - 34 * q},${270 + 34 * q}`} className={s.cruz} />;
          })}
          <text x={690} y={345} textAnchor="middle" className={s.lEtiquetaRoja}>déficit genético</text>
        </g>
      )}
      {ri > 0.001 && (
        <g opacity={ri} transform={`translate(1275,430) scale(${0.85 + 0.15 * easeBack(ri)})`}>
          <rect x={-255} y={-30} width={510} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Déficit de C1q: más del 90 % hace lupus</text>
        </g>
      )}
      {li > 0.001 && (
        <g>
          <text x={1080} y={898} textAnchor="middle" className={s.lSub} opacity={tramo(li, 0, 0.5)}>¿Por qué un déficit de complemento da autoinmunidad?</text>
          <text x={1080} y={958} textAnchor="middle" className={s.respuesta} opacity={tramo(li, 0.5, 1)}>Por la limpieza.</text>
        </g>
      )}
    </g>
  );
}

// ─── 3 · Hormonas ─────────────────────────────────────────────────────────────

const BAL = { x: 1060, y: 400, l: 230 };

function CromosomaX({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-13} y={-62} width={26} height={124} rx={13} transform="rotate(-22)" className={s.cromosomaX} />
      <rect x={-13} y={-62} width={26} height={124} rx={13} transform="rotate(22)" className={s.cromosomaX} />
      <rect x={-13} y={-48} width={26} height={12} transform="rotate(-22)" fill="#E8B21E" />
    </g>
  );
}

function Hormonas({ t }: { t: T }) {
  const nu = v(t, 'nueve'), ba = v(t, 'balanza'), te = v(t, 'testo'), oj = v(t, 'ojo'), xx = v(t, 'xx');
  const ang = (-10 * easeInOut(ba) * Math.PI) / 180;
  const izq = { x: BAL.x - Math.cos(ang) * BAL.l, y: BAL.y - Math.sin(ang) * BAL.l };
  const der = { x: BAL.x + Math.cos(ang) * BAL.l, y: BAL.y + Math.sin(ang) * BAL.l };
  const plato = (p: { x: number; y: number }, bolas: number, col: string, k: number) => (
    <g>
      <line x1={p.x} y1={p.y} x2={p.x - 66} y2={p.y + 110} className={s.cadena} />
      <line x1={p.x} y1={p.y} x2={p.x + 66} y2={p.y + 110} className={s.cadena} />
      <path d={`M${p.x - 80},${p.y + 110} Q${p.x},${p.y + 150} ${p.x + 80},${p.y + 110} Z`} className={s.plato} />
      {Array.from({ length: bolas }, (_, i) => <circle key={i} cx={p.x - (bolas - 1) * 15 + i * 30} cy={p.y + 98} r={13 * k} fill={col} />)}
    </g>
  );
  return (
    <g>
      {nu > 0.001 && (
        <g>
          <text x={720} y={182} className={s.razonChica} opacity={tramo(nu, 0, 0.5)}><tspan style={{ fill: L.mujer }}>9</tspan><tspan className={s.razonSep}> : </tspan><tspan style={{ fill: L.varon }}>1</tspan></text>
          <text x={850} y={174} className={s.significado} opacity={tramo(nu, 0.5, 1)}>y empieza en la edad reproductiva</text>
        </g>
      )}
      {ba > 0.001 && (
        <g opacity={tramo(ba, 0, 0.4)}>
          <path d={`M${BAL.x - 70},655 L${BAL.x + 70},655 L${BAL.x + 30},630 L${BAL.x - 30},630 Z`} className={s.plato} />
          <line x1={BAL.x} y1={630} x2={BAL.x} y2={BAL.y} className={s.poste} />
          <line x1={izq.x} y1={izq.y} x2={der.x} y2={der.y} className={s.poste} />
          <circle cx={BAL.x} cy={BAL.y} r={10} className={s.pivote} />
          {plato(izq, 3, L.mujer, 1)}
          {plato(der, 1, L.varon, te)}
          <text x={izq.x} y={izq.y + 186} textAnchor="middle" className={s.significado}>Estrógenos</text>
          <text x={izq.x} y={izq.y + 218} textAnchor="middle" className={s.lSub}>más supervivencia y activación</text>
          <text x={izq.x} y={izq.y + 246} textAnchor="middle" className={s.lSub}>de los linfocitos B autorreactivos</text>
          {te > 0.001 && (
            <g opacity={te}>
              <text x={der.x} y={der.y + 186} textAnchor="middle" className={s.significado}>Testosterona</text>
              <text x={der.x} y={der.y + 218} textAnchor="middle" className={s.lSub}>relativamente supresora</text>
            </g>
          )}
        </g>
      )}
      {oj > 0.001 && (
        <g opacity={oj} transform="translate(900,820)">
          <rect x={-240} y={-28} width={480} height={56} rx={28} className={s.chip} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Pero las hormonas no lo explican todo</text>
        </g>
      )}
      {xx > 0.001 && (
        <g opacity={xx} transform={`translate(0,${20 * (1 - easeOut(xx))})`}>
          <CromosomaX x={1330} y={790} />
          <CromosomaX x={1440} y={790} />
          <text x={1385} y={896} textAnchor="middle" className={s.lEtiqueta}>genes inmunes del X (p. ej., TLR7)</text>
          <text x={1385} y={926} textAnchor="middle" className={s.lSub}>escapan a la inactivación → dosis doble</text>
        </g>
      )}
    </g>
  );
}

// ─── 4 · Luz ultravioleta ─────────────────────────────────────────────────────

const PIEL = { x0: 700, x1: 1560 };
type Cel = { x: number; y: number; w: number; h: number; apo: boolean };
const CELULAS_PIEL: Cel[] = (() => {
  const out: Cel[] = [];
  const fila = (y: number, w: number, h: number, apo: number[], off = 0) => {
    for (let x = PIEL.x0 + off, i = 0; x + w <= PIEL.x1 + 4; x += w + 4, i++) out.push({ x, y, w, h, apo: apo.includes(i) });
  };
  fila(528, 62, 22, [], 10);
  fila(556, 70, 56, [2, 6, 10], 0);
  fila(618, 70, 56, [4, 8], 34);
  fila(680, 48, 52, [], 4);
  return out;
})();

const PielFija = memo(function PielFija() {
  return (
    <g>
      <rect x={PIEL.x0} y={502} width={PIEL.x1 - PIEL.x0} height={22} rx={4} className={s.cornea} />
      <rect x={PIEL.x0} y={736} width={PIEL.x1 - PIEL.x0} height={90} className={s.dermis} />
      <line x1={PIEL.x0} y1={736} x2={PIEL.x1} y2={736} className={s.basal} />
      <text x={PIEL.x1} y={490} textAnchor="end" className={s.lEtiquetaMayus}>Epidermis</text>
      <text x={PIEL.x1 - 10} y={812} textAnchor="end" className={s.lEtiquetaMayus}>Dermis</text>
    </g>
  );
});

function Sol({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.cos(a) * r * 1.2} y1={Math.sin(a) * r * 1.2} x2={Math.cos(a) * r * 1.55} y2={Math.sin(a) * r * 1.55} className={s.rayoSol} />;
      })}
      <circle r={r} className={s.sol} />
    </g>
  );
}

function zigzag(x0: number, y0: number, x1: number, y1: number, n = 14, amp = 10): string {
  const dx = x1 - x0, dy = y1 - y0, L2 = Math.hypot(dx, dy), nx = -dy / L2, ny = dx / L2;
  return `M${x0},${y0} ` + Array.from({ length: n }, (_, i) => {
    const f = (i + 1) / n, o = i === n - 1 ? 0 : (i % 2 ? -amp : amp);
    return `L${(x0 + dx * f + nx * o).toFixed(1)},${(y0 + dy * f + ny * o).toFixed(1)}`;
  }).join(' ');
}

function Uv({ t }: { t: T }) {
  const so = v(t, 'sol'), ra = v(t, 'rayos'), ap = v(t, 'apoptosisUV'), an = v(t, 'antigenosUV'), pl = v(t, 'playa'), fp = v(t, 'fps');
  const destinos = [820, 980, 1140, 1300, 1450];
  const apos = CELULAS_PIEL.filter((c) => c.apo);
  return (
    <g>
      {so > 0.001 && (
        <g opacity={so}>
          <Sol x={540} y={240} r={52 * (0.8 + 0.2 * easeBack(so))} />
          <text x={540} y={350} textAnchor="middle" className={s.lEtiqueta}>Luz ultravioleta</text>
          <PielFija />
          {CELULAS_PIEL.map((c, i) => {
            const k = c.apo ? easeOut(ap) : 0;
            const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
            return (
              <g key={i} transform={`translate(${cx},${cy}) scale(${1 - 0.35 * k})`}>
                <rect x={-c.w / 2} y={-c.h / 2} width={c.w} height={c.h} rx={Math.min(14, c.h / 2)} className={k > 0.5 ? s.queratinocitoApo : s.queratinocito} />
                {c.h > 30 && (k < 0.5
                  ? <ellipse rx={c.w * 0.18} ry={c.h * 0.22} className={s.nucleoQueratinocito} />
                  : [[-8, -5], [6, -2], [-1, 8]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r={4.5} className={s.nucleoPicnotico} />))}
                {k > 0.2 && [0, 1, 2, 3, 4].map((j) => {
                  const a = (j / 5) * Math.PI * 2 + 0.5;
                  return <circle key={j} cx={Math.cos(a) * c.w * 0.55} cy={Math.sin(a) * c.h * 0.6} r={6 * tramo(k, 0.2 + j * 0.1, 0.7 + j * 0.06)} className={s.blebPiel} />;
                })}
              </g>
            );
          })}
        </g>
      )}
      {ra > 0.001 && destinos.map((x, i) => {
        const q = tramo(ra, i * 0.1, 0.6 + i * 0.1);
        return q > 0 ? <path key={x} d={zigzag(585, 285, x, 500, 18, 7)} className={s.rayoUv} opacity={1 - 0.7 * tramo(an, 0, 0.3)} {...dibujar(q)} /> : null;
      })}
      {ra > 0.5 && <text x={760} y={330} className={s.lEtiquetaUv} opacity={tramo(ra, 0.5, 1)}>UVB</text>}
      {an > 0.001 && (
        <g>
          {apos.flatMap((c, i) => [0, 1, 2].map((j) => {
            const q = easeOut(tramo(an, (i * 3 + j) * 0.025, 0.5 + (i * 3 + j) * 0.025));
            if (q <= 0) return null;
            const col = [L.adn, L.histona, L.rnp][j];
            return <circle key={`${i}-${j}`} cx={c.x + c.w / 2 + (j - 1) * 16} cy={c.y - 18 - 70 * q - j * 8} r={7} fill={col} opacity={Math.min(1, q * 2)} />;
          }))}
          <g opacity={tramo(an, 0.4, 0.8)} transform="translate(1130,404)">
            <rect x={-250} y={-26} width={500} height={52} rx={26} className={s.chip} />
            <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>ADN · nucleosomas · Ro al descubierto</text>
          </g>
        </g>
      )}
      {pl > 0.001 && (
        <g opacity={pl} transform="translate(1130,880)">
          <rect x={-330} y={-28} width={660} height={56} rx={28} className={s.chip} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Una tarde de playa → brote cutáneo y sistémico</text>
        </g>
      )}
      {fp > 0.001 && (
        <g opacity={fp} transform={`translate(1130,950) scale(${0.85 + 0.15 * easeBack(fp)})`}>
          <rect x={-330} y={-28} width={660} height={56} rx={28} className={s.chipVerde} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Protector solar FPS 50+: parte del tratamiento</text>
        </g>
      )}
    </g>
  );
}

// ─── 5 · Virus de Epstein-Barr ────────────────────────────────────────────────

function Virus({ x, y, r }: { x: number; y: number; r: number }) {
  const hex = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; return `${(Math.cos(a) * r * 0.62).toFixed(1)},${(Math.sin(a) * r * 0.62).toFixed(1)}`; }).join(' ');
  return (
    <g transform={`translate(${x},${y})`}>
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <g key={i}><line x1={Math.cos(a) * r} y1={Math.sin(a) * r} x2={Math.cos(a) * r * 1.18} y2={Math.sin(a) * r * 1.18} className={s.espiculaVirus} /><circle cx={Math.cos(a) * r * 1.2} cy={Math.sin(a) * r * 1.2} r={4.5} className={s.botonVirus} /></g>;
      })}
      <circle r={r} className={s.virusEnvoltura} />
      <polygon points={hex} className={s.virusCapside} />
      <path d={`M${-r * 0.3},${-r * 0.2} C${-r * 0.1},${-r * 0.45} ${r * 0.2},${-r * 0.1} ${0},${r * 0.05} C${-r * 0.2},${r * 0.2} ${r * 0.1},${r * 0.45} ${r * 0.3},${r * 0.2}`} className={s.adnVirus} />
    </g>
  );
}

function Ebv({ t }: { t: T }) {
  const vi = v(t, 'virus'), mi = v(t, 'mimetismo'), ep = v(t, 'epitopos');
  const cadena = (y: number, k0: number, paso: number) => Array.from({ length: 6 }, (_, j) => {
    const x = 800 + j * 113;
    const q = tramo(ep, k0 + j * paso, k0 + j * paso + 0.06);
    return (
      <g key={j}>
        <rect x={x} y={y} width={105} height={34} rx={17} className={s.segmento} />
        {q > 0 && <rect x={x} y={y} width={105} height={34} rx={17} fill={L.ana} opacity={q} />}
        {q > 0 && <Y x={x + 52} y={y - 18} ang={180} k={2 * (0.6 + 0.4 * easeBack(q))} c={L.ana} />}
      </g>
    );
  });
  return (
    <g>
      {vi > 0.001 && (
        <g opacity={vi}>
          <Virus x={520} y={320} r={78 * (0.85 + 0.15 * easeBack(vi))} />
          <text x={520} y={460} textAnchor="middle" className={s.lEtiqueta}>Virus de Epstein-Barr</text>
        </g>
      )}
      {mi > 0.001 && (
        <g opacity={mi}>
          <text x={1080} y={170} textAnchor="middle" className={s.tituloSeccion}>Mimetismo molecular</text>
          {[880, 1280].map((x) => <circle key={x} cx={x} cy={300} r={60} className={s.haloMimetismo} />)}
          <text x={880} y={226} textAnchor="middle" className={s.lSub}>del virus</text>
          <text x={1280} y={226} textAnchor="middle" className={s.lSub}>propia</text>
          <text x={1080} y={312} textAnchor="middle" className={s.parecido}>≈</text>
          <text x={1080} y={350} textAnchor="middle" className={s.lSub}>misma forma</text>
        </g>
      )}
      {ep > 0.001 && (
        <g opacity={tramo(ep, 0, 0.08)}>
          <text x={800} y={586} className={s.lEtiquetaMayus}>Propagación de epítopos</text>
          {cadena(650, 0, 0.09)}
          <text x={800} y={758} className={s.lSub} opacity={tramo(ep, 0.55, 0.62)}>…y a otras moléculas</text>
          <g opacity={tramo(ep, 0.55, 0.62)}>{cadena(820, 0.62, 0.06)}</g>
        </g>
      )}
    </g>
  );
}

// ─── 6 · Tabaco, sílice y lo que tienen en común ──────────────────────────────

function Cigarrillo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-30,-48 C-40,-62 -20,-70 -28,-86 M-10,-50 C-20,-64 0,-72 -8,-88" className={s.humo} />
      <rect x={-90} y={-14} width={150} height={28} rx={6} className={s.cigarroPapel} />
      <rect x={60} y={-14} width={34} height={28} rx={6} className={s.cigarroFiltro} />
      <rect x={-96} y={-14} width={10} height={28} rx={4} fill="#E5484D" />
    </g>
  );
}

function Silice({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M-50,-30 Q0,-70 50,-30" className={s.picoHierro} />
      <line x1={0} y1={-50} x2={0} y2={46} className={s.picoMango} />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-60 + ((i * 37) % 120)} cy={30 + ((i * 23) % 30)} r={2 + (i % 3)} className={s.polvo} />)}
    </g>
  );
}

const ICONOS_X = [560, 820, 1080, 1340];

function Comun({ t }: { t: T }) {
  const ta = v(t, 'tabaco'), si = v(t, 'silice'), co = v(t, 'comun'), ex = v(t, 'expuesto');
  if (ta <= 0.001) return null;
  const rotulos = [['Luz UV', ''], ['Epstein-Barr', ''], ['Tabaco', 'más riesgo e inflamación'], ['Sílice', 'minería, construcción']];
  return (
    <g>
      <g opacity={0.55 * ta}><Sol x={ICONOS_X[0]} y={290} r={34} /></g>
      <g opacity={0.55 * ta}><Virus x={ICONOS_X[1]} y={290} r={40} /></g>
      <g opacity={ta}><Cigarrillo x={ICONOS_X[2]} y={300} /></g>
      <g opacity={si}><Silice x={ICONOS_X[3]} y={290} /></g>
      {rotulos.map(([a, b], i) => {
        const op = i < 2 ? 0.7 * ta : i === 2 ? ta : si;
        return (
          <g key={a} opacity={op}>
            <text x={ICONOS_X[i]} y={392} textAnchor="middle" className={s.lEtiqueta}>{a}</text>
            {b && <text x={ICONOS_X[i]} y={420} textAnchor="middle" className={s.lSub}>{b}</text>}
          </g>
        );
      })}
      {co > 0.001 && (
        <g>
          {ICONOS_X.map((x, i) => <path key={x} d={`M${x},440 C${x},500 950,480 950,520`} className={s.flechaComun} {...dibujar(tramo(co, i * 0.08, 0.5 + i * 0.08))} />)}
          <g opacity={tramo(co, 0.4, 0.8)} transform="translate(950,566)">
            <rect x={-360} y={-38} width={720} height={76} rx={20} className={s.cajaComun} />
            <text textAnchor="middle" dy="0.35em" className={s.significado}>daño celular · muerte celular · activación inmune</text>
          </g>
        </g>
      )}
      {ex > 0.001 && (
        <g>
          {[740, 1160].map((x, i) => (
            <g key={x}>
              <path d={`M950,606 C950,650 ${x},640 ${x},690`} className={s.flechaComun} {...dibujar(tramo(ex, i * 0.15, 0.5 + i * 0.15))} />
              <g opacity={tramo(ex, 0.35 + i * 0.15, 0.7 + i * 0.15)} transform={`translate(${x},745)`}>
                <rect x={-190} y={-50} width={380} height={100} rx={20} className={s.cajaResultado} />
                <text y={-12} textAnchor="middle" dy="0.35em" className={s.chipTxt}>{i ? 'un sistema inmune más' : 'más material nuclear'}</text>
                <text y={20} textAnchor="middle" dy="0.35em" className={s.chipTxt}>{i ? 'dispuesto a verlo' : 'expuesto'}</text>
              </g>
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

// ─── 7 · Lupus por fármacos ───────────────────────────────────────────────────

function Frasco({ x, y, c, nombre, sub, k, tachado }: { x: number; y: number; c: string; nombre: string; sub: string; k: number; tachado: number }) {
  return (
    <g opacity={k * (1 - 0.6 * tachado)} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * easeBack(k)})`}>
      <rect x={-34} y={-92} width={68} height={32} rx={7} fill={c} />
      <rect x={-50} y={-62} width={100} height={128} rx={18} className={s.frasco} />
      <rect x={-50} y={-24} width={100} height={46} fill={c} opacity={0.18} />
      {[[-18, 30], [4, 40], [20, 28]].map(([px, py], i) => <ellipse key={i} cx={px} cy={py} rx={9} ry={6} fill={c} opacity={0.8} />)}
      <text y={104} textAnchor="middle" className={s.lEtiqueta}>{nombre}</text>
      <text y={132} textAnchor="middle" className={s.lSub}>{sub}</text>
      {tachado > 0.001 && <path d={`M${-58 * tachado},${-80 * tachado} L${58 * tachado},${60 * tachado}`} className={s.cruz} />}
    </g>
  );
}

const TRUCOS = [
  ['Anticuerpos antihistona', 'anti-ADNdc casi siempre negativo'],
  ['Casi nunca riñón ni SNC', 'artritis, serositis, fiebre'],
  ['Remite al suspenderlo', 'en semanas a meses'],
];

function Farmacos({ t }: { t: T }) {
  const ti = v(t, 'tituloF'), fr = v(t, 'frascos'), tr = v(t, 'trucos'), re = v(t, 'retira'), rc = v(t, 'receta');
  return (
    <g>
      {ti > 0.001 && (
        <g opacity={ti}>
          <text x={880} y={176} textAnchor="middle" className={s.tituloSeccion}>Lupus inducido por fármacos</text>
          <g transform="translate(1235,166)">
            <rect x={-56} y={-20} width={112} height={40} rx={20} fill={L.causas} />
            <text textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>examen</text>
          </g>
        </g>
      )}
      {fr > 0.001 && <Frasco x={520} y={420} c="#2F6FD0" nombre="Procainamida" sub="antiarrítmico" k={tramo(fr, 0, 0.5)} tachado={re} />}
      {fr > 0.5 && <Frasco x={730} y={420} c="#1F9A6A" nombre="Hidralazina" sub="antihipertensivo" k={tramo(fr, 0.5, 1)} tachado={re} />}
      {fr > 0.5 && (
        <g opacity={tramo(fr, 0.6, 1) * (1 - re)}>
          <path d="M640,590 C660,650 740,660 790,660" className={s.flechaComun} />
          <text x={600} y={716} textAnchor="middle" className={s.lSub}>alteran la regulación inmune</text>
        </g>
      )}
      {TRUCOS.map(([a, b], i) => {
        const k = clamp(tr - i);
        if (k <= 0.001) return null;
        const y = 400 + i * 120;
        const brilla = i === 2 ? re : 0;
        return (
          <g key={a} opacity={k} transform={`translate(${30 * (1 - easeOut(k))},0)`}>
            <rect x={1150} y={y - 48} width={410} height={96} rx={18} className={brilla > 0.5 ? s.tarjetaVerde : s.tarjeta} />
            <circle cx={1194} cy={y} r={20} fill={L.causas} />
            <text x={1194} y={y} textAnchor="middle" dy="0.35em" className={s.chipTxtBlanco}>{i + 1}</text>
            <text x={1230} y={y - 12} dy="0.35em" className={s.chipTxt}>{a}</text>
            <text x={1230} y={y + 18} dy="0.35em" className={s.lSubChico}>{b}</text>
          </g>
        );
      })}
      {rc > 0.001 && (
        <g opacity={rc} transform={`translate(880,900) scale(${0.85 + 0.15 * easeBack(rc)})`}>
          <rect x={-420} y={-30} width={840} height={60} rx={30} className={s.chipPista} />
          <text textAnchor="middle" dy="0.35em" className={s.chipTxt}>Lupus súbito en un señor mayor e hipertenso → revisa su receta</text>
        </g>
      )}
    </g>
  );
}

export default function FondoCausas({ t }: { t: T; reloj: number }) {
  return (
    <g>
      <Genes t={t} />
      <Complemento t={t} />
      <Hormonas t={t} />
      <Uv t={t} />
      <Ebv t={t} />
      <Comun t={t} />
      <Farmacos t={t} />
      <Cerradura t={t} />
    </g>
  );
}
