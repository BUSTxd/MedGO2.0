'use client';
// Capítulo 2 · La respuesta del huésped

import type { ReactNode } from 'react';
import type { Lamina } from '../Lienzo';
import { Bacilo, Balanza, Bandera, Barra, Capas, Cerebro, Chispa, Copo, Cruz, Endo, Fibrina, Flecha, Hematie, Il1, Il6, Llama, LineaTiempo, Macrofago, Neutrofilo, Plaqueta, Pulmones, Rinon, S, Sale, Tlr4, Tnf, Union, Vaso, easeOut, lerp, tramo } from '../Piezas';

/** Posición sobre un tramo recto que se repite (para lo que va por un vaso): u de 0 a 1. */
const corre = (reloj: number, i: number, n: number, periodo: number) => ((reloj / periodo + i / n) % 1);

// ─── 0 · Una defensa que debía quedarse en casa ──────────────────────────────
const DefensaLocal: Lamina = ({ p, reloj }) => {
  const inf = easeOut(p('inflama'));
  const celulas: [number, number][] = [[470, 520], [640, 470], [800, 520], [520, 700], [780, 700]];
  return (
    <g>
      <Capas x={800} y={660} w={1700} fondo={420} bandas={[[0, '#F9B8C8', 46], [70, '#F08AA8', 52], [90, '#C95A88', 58]]} sem={5} />
      <Vaso x={800} y={250} largo={1700} ancho={170} ang={0} reloj={reloj} flujo={10} o={tramo(p('inflama'), 0, 0.5)} />
      <Bandera x={1330} y={400} txt="vasos dilatados" color={S.il1[0]} p={p('inflama')} t={24} punta="no" />
      <g opacity={tramo(p('herida'), 0, 0.5)}>
        <path d="M620,610 L650,690 L700,610 L760,690 L800,610" fill="none" stroke="#7A1E3A" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[0, 1, 2].map((i) => <Bacilo key={i} x={640 + i * 70 + Math.sin(reloj / 400 + i) * 6} y={640 + (i % 2) * 36} k={0.5} r={-20 + i * 30} reloj={reloj} o={tramo(p('herida'), 0.1 + i * 0.1, 0.6 + i * 0.1)} />)}
      <Bandera x={720} y={780} txt="el microbio entra por una herida" color={S.menin[0]} p={p('herida')} t={24} punta="no" />
      {celulas.map(([cx, cy], i) => (
        <g key={i} opacity={tramo(inf, i * 0.1, i * 0.1 + 0.4)}>
          <Neutrofilo x={lerp(cx < 700 ? 330 : 1100, cx, inf) + Math.sin(reloj / 500 + i) * 5} y={lerp(250, cy, inf)} k={0.5} activo={inf} />
        </g>
      ))}
      <Sale p={p('calor')} x={1010} y={560} k={1.1}><Llama /></Sale>
      <Bandera x={1010} y={650} txt="calor" color={S.tnf[0]} p={p('calor')} t={26} punta="no" />
      <g opacity={tramo(p('rubor'), 0, 0.5)}><circle cx={720} cy={640} r={190 + 8 * Math.sin(reloj / 400)} fill={S.il1[1]} opacity={0.2} /></g>
      <Bandera x={420} y={420} txt="enrojecimiento" color={S.il1[0]} p={p('rubor')} t={26} punta="abajo" />
      <Sale p={p('pus')} x={880} y={650} k={1}>
        {[[0, 0, 26], [-26, 14, 18], [22, 20, 20], [4, -22, 16]].map(([dx, dy, r], i) => <circle key={i} cx={dx} cy={dy} r={r} fill="#FFE9A0" />)}
        <circle cx={-10} cy={-8} r={7} fill="#FFF" opacity={0.7} />
      </Sale>
      <Bandera x={880} y={730} txt="pus" color={S.lactato[0]} p={p('pus')} t={26} punta="no" />
      <g opacity={tramo(p('local'), 0, 0.5)}><circle cx={720} cy={640} r={250} fill="none" stroke={S.il6[1]} strokeWidth={7} strokeDasharray="4 18" strokeLinecap="round" transform={`rotate(${reloj / 40} 720 640)`} /></g>
      <Bandera x={1250} y={880} txt="una respuesta local y medida" color={S.il6[0]} p={p('elimina')} t={28} punta="no" />
      <Bandera x={420} y={880} txt="como un bombero: apaga el fuego y se queda en la cocina" color={S.tnf[0]} p={p('bombero')} t={26} punta="no" />
    </g>
  );
};

// ─── 1 · Desregulada ─────────────────────────────────────────────────────────
const Desregulada: Lamina = ({ p, reloj }) => {
  const gen = easeOut(p('generaliza'));
  const organos: [number, number, ReactNode, string][] = [
    [1180, 250, <Cerebro key="c" k={0.5} />, 'cerebro'],
    [1420, 560, <Rinon key="r" k={0.55} />, 'rinon'],
    [1180, 800, <Pulmones key="p" k={0.42} />, 'pulmon'],
  ];
  return (
    <g>
      <Bandera x={240} y={290} txt="el foco" color={S.menin[0]} p={p('bombero')} t={26} punta="abajo" />
      <Sale p={p('bombero')} x={240} y={560} k={0.9}><Llama /></Sale>
      <Bacilo x={190} y={640} k={0.45} reloj={reloj} o={tramo(p('bombero'), 0, 0.5)} /><Bacilo x={300} y={660} k={0.45} r={30} reloj={reloj} o={tramo(p('bombero'), 0, 0.5)} />
      <Vaso x={880} y={550} largo={1100} ancho={190} ang={0} reloj={reloj} flujo={12} o={tramo(p('generaliza'), 0, 0.4)} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const u = corre(reloj, i, 6, 4200);
        const forma = [<Tnf key="a" k={0.9} />, <Il1 key="b" k={1} />, <Il6 key="c" k={1} />][i % 3];
        return <g key={i} opacity={tramo(gen, 0, 0.4)} transform={`translate(${lerp(420, 1300, u)},${550 + Math.sin(u * 9 + i) * 30})`}>{i % 2 ? forma : <Neutrofilo k={0.38} />}</g>;
      })}
      <Bandera x={800} y={410} txt="se generaliza y se descoordina" color={S.il1[0]} p={p('descoordina')} t={28} punta="no" />
      {organos.map(([x, y, el, clave], i) => (
        <g key={clave}>
          <circle cx={x} cy={y} r={100 + 8 * Math.sin(reloj / 260 + i)} fill={S.il1[1]} opacity={0.22 * tramo(p('sanos'), i * 0.2, i * 0.2 + 0.5)} />
          <Sale p={p('sanos')} x={x} y={y}>{el}</Sale>
          <Flecha a={[1050, 550]} b={[x - 100, y + (y > 550 ? -40 : 40)]} c={[1120, y]} p={tramo(p('sanos'), i * 0.2, i * 0.2 + 0.7)} color={S.il1[1]} w={7} />
        </g>
      ))}
      <Bandera x={1300} y={930} txt="tejidos sanos, lejos de la infección" color={S.il1[0]} p={p('lejos')} t={28} punta="no" />
      <Bandera x={420} y={880} txt="no solo exagerada: descoordinada" color={S.il1[0]} p={p('desregulada')} t={30} punta="no" />
    </g>
  );
};

// ─── 2 · La prueba de que el daño es nuestro ─────────────────────────────────
const PruebaTlr4: Lamina = ({ p, reloj }) => {
  const col = (x: number, activo: boolean, titulo: string, lesion: number, muerte: number, q: number) => (
    <g>
      <Bandera x={x} y={95} txt={titulo} color={activo ? S.il1[0] : S.gluco[0]} p={q} t={30} punta="no" />
      <Sale p={q} x={x} y={330} k={1.2}><Tlr4 activo={activo ? 1 : 0} reloj={reloj} />{!activo && <g transform="translate(0,-80)"><Cruz k={1.2} /></g>}</Sale>
      <Barra x={x - 230} y={540} w={460} h={34} val={0.6} color={S.menin[1]} txt="bacterias en la sangre" valor="igual" p={Math.min(q, p('modelo'))} />
      <Barra x={x - 230} y={650} w={460} h={34} val={lesion} color={S.il1[1]} txt="lesión de los órganos" valor={activo ? 'alta' : 'menor'} p={Math.min(q, p('bajaron'))} />
      <Barra x={x - 230} y={760} w={460} h={34} val={muerte} color={S.il6[1]} txt="mortalidad" valor={activo ? 'alta' : 'menor'} p={Math.min(q, p('bajaron'))} />
    </g>
  );
  return (
    <g>
      {col(420, true, 'reconocimiento por TLR4 intacto', 0.88, 0.8, p('pregunta'))}
      {col(1180, false, 'reconocimiento por TLR4 alterado', 0.3, 0.26, p('alterado'))}
      <Bandera x={800} y={880} txt="experimento con Acinetobacter baumannii: no es un tratamiento" color={S.c5a[0]} p={p('experimento')} t={26} punta="no" />
      <Bandera x={800} y={950} txt="menos reconocimiento, menos daño" color={S.il6[0]} p={p('idea')} t={32} punta="no" />
    </g>
  );
};

// ─── 3 · Fase 1: inflamación ─────────────────────────────────────────────────
const TRAMOS = (a: number, b: number, c: number) => [
  { txt: 'fase 1 · minutos a horas · inflamación', color: '#E8541F', p: a },
  { txt: 'fase 2 · horas · endotelio', color: '#0C9E9A', p: b },
  { txt: 'fase 3 · horas a días · coagulación', color: '#2E78F2', p: c },
];

const Fase1: Lamina = ({ p, reloj }) => {
  const m = easeOut(p('mensajeros'));
  const salen = [<Tnf key="a" k={1} />, <Il1 key="b" k={1.1} />, <Il6 key="c" k={1.1} />, <Chispa key="d" tono={S.nfkb} reloj={reloj} k={1} />, <Chispa key="e" tono={S.c5a} n={5} reloj={reloj} k={1} fase={1} />, <Chispa key="f" tono={S.lps} n={6} reloj={reloj} k={1} fase={2} />];
  return (
    <g>
      <LineaTiempo x={800} y={110} w={1300} tramos={TRAMOS(1, 0.15, 0.15)} p={p('fase1')} t={24} />
      <Sale p={p('monocitos')} x={430} y={560} k={1.9}><Macrofago /></Sale>
      <Bandera x={430} y={760} txt="monocito" color={S.linfo[0]} p={p('monocitos')} t={26} punta="no" />
      {[[-120, -90], [110, -110], [-20, -150]].map(([dx, dy], i) => <Sale key={i} p={tramo(p('receptores'), i * 0.2, i * 0.2 + 0.5)} x={430 + dx * 1.4} y={560 + dy * 1.4} k={0.55} r={i * 40 - 40}><Tlr4 cola={false} activo={p('receptores')} reloj={reloj} /></Sale>)}
      <Bandera x={430} y={270} txt="receptores TLR" color={S.lps[0]} p={p('receptores')} t={26} punta="abajo" />
      {[[210, 350, 'PAMP'], [650, 350, 'DAMP']].map(([x, y, t], i) => (
        <g key={i} opacity={tramo(p('pamps'), i * 0.3, i * 0.3 + 0.5)}><Bola2 x={x as number} y={y as number} t={String(t)} /></g>
      ))}
      <Flecha a={[250, 380]} b={[330, 440]} p={tramo(p('pamps'), 0.2, 1)} color={S.lps[1]} w={7} />
      <Flecha a={[640, 380]} b={[560, 440]} p={tramo(p('pamps'), 0.4, 1)} color={S.lps[1]} w={7} />
      <Sale p={p('complemento')} x={760} y={800} k={0.8}><Chip2 t="complemento" color={S.c5a[0]} /></Sale>
      <Sale p={p('mastocitos')} x={960} y={800} k={0.8}><Chip2 t="mastocitos" color={S.tnf[0]} /></Sale>
      <Sale p={p('macrofagos')} x={1160} y={800} k={0.8}><Chip2 t="macrófagos" color={S.il6[0]} /></Sale>
      <Vaso x={1090} y={430} largo={1000} ancho={170} ang={-14} reloj={reloj} flujo={9} o={tramo(m, 0, 0.5)} />
      {salen.map((el, i) => {
        const u = corre(reloj, i, 6, 3600);
        return <g key={i} opacity={tramo(m, i * 0.1, i * 0.1 + 0.4)} transform={`translate(${lerp(640, 1480, u)},${lerp(520, 330, u) + Math.sin(u * 8 + i) * 10})`}>{el}</g>;
      })}
      <Bandera x={1130} y={250} txt="TNF-α · IL-1 · IL-6 · IL-8 · IL-12 · IL-18 · interferones" color={S.tnf[0]} p={p('tnf')} t={24} punta="no" />
      <Bandera x={1130} y={620} txt="los mensajeros salen a la sangre" color={S.tnf[0]} p={p('mensajeros')} t={26} punta="no" />
      <Bandera x={800} y={930} txt="la alarma suena en todo el cuerpo" color={S.il1[0]} p={p('alarma')} t={32} punta="no" />
    </g>
  );
};
const Bola2 = ({ x, y, t }: { x: number; y: number; t: string }) => (
  <g transform={`translate(${x},${y})`}><circle r={52} fill={S.lps[0]} /><circle cx={-3} cy={-3} r={47} fill={S.lps[1]} /><circle cx={-18} cy={-20} r={8} fill="#FFF" opacity={0.65} /><text y={9} textAnchor="middle" fontSize={26} fontWeight={800} fill="#FFF">{t}</text></g>
);
const Chip2 = ({ t, color }: { t: string; color: string }) => (
  <g><rect x={-110} y={-30} width={220} height={60} rx={30} fill={color} /><rect x={-104} y={-34} width={208} height={52} rx={26} fill={color} opacity={0.85} /><text y={9} textAnchor="middle" fontSize={26} fontWeight={800} fill="#FFF">{t}</text></g>
);

// ─── 4 · Fase 2: el endotelio ────────────────────────────────────────────────
const Fase2: Lamina = ({ p, reloj }) => {
  const dano = easeOut(p('azucares'));
  return (
    <g>
      <LineaTiempo x={800} y={110} w={1300} tramos={TRAMOS(1, p('horas'), 0.15)} p={1} t={24} />
      <Vaso x={800} y={400} largo={1700} ancho={300} ang={0} reloj={reloj} flujo={12} />
      {[0, 1, 2, 3].map((i) => <Endo key={i} x={290 + i * 340} y={620} w={290} h={80} gluco={1 - dano} activa={dano} sem={i + 1} />)}
      {[0, 1, 2].map((i) => <g key={i} opacity={tramo(p('permeable'), i * 0.2, i * 0.2 + 0.5)}><Union x={460 + i * 340} y={600} h={70} cierre={1 - tramo(p('permeable'), i * 0.2, i * 0.2 + 0.6)} /></g>)}
      <Bandera x={800} y={820} txt="el endotelio mantiene la sangre fluida y regula el tono" color={S.endo[0]} p={p('endotelio')} t={26} punta="no" />
      <Bandera x={410} y={890} txt="cae el glucocálix" color={S.gluco[0]} p={p('glucocalix')} t={28} punta="no" />
      <Bandera x={800} y={890} txt="se vuelve permeable" color={S.il1[0]} p={p('permeable')} t={28} punta="no" />
      <Bandera x={1200} y={890} txt="muestra moléculas procoagulantes" color={S.fibrina[0]} p={p('coagulacion')} t={26} punta="no" />
      <Fibrina x={1330} y={600} w={170} o={tramo(p('coagulacion'), 0, 0.5)} />
      <Bandera x={800} y={230} txt="fase 2: el vaso deja de ser un tubo pasivo" color={S.endo[0]} p={p('tubo')} t={32} punta="no" />
    </g>
  );
};

// ─── 5 · Fase 3: coagulopatía e inmunotrombosis ──────────────────────────────
const Fase3: Lamina = ({ p, reloj }) => {
  const t = easeOut(p('microtrombos'));
  return (
    <g>
      <LineaTiempo x={800} y={110} w={1300} tramos={TRAMOS(1, 1, p('fase3'))} p={1} t={24} />
      <Vaso x={800} y={480} largo={1700} ancho={330} ang={0} reloj={reloj} flujo={8}>
        {[[-330, 10], [-130, -40], [110, 20], [330, -10]].map(([cx, cy], i) => (
          <g key={i} opacity={tramo(t, i * 0.15, i * 0.15 + 0.5)}>
            <Fibrina x={cx} y={cy} w={190} rota={i * 20 - 30} />
            <Plaqueta x={cx - 40} y={cy - 22} k={0.5} /><Plaqueta x={cx + 30} y={cy + 24} k={0.5} />
            <Hematie x={cx + 56} y={cy - 26} k={0.42} />
          </g>
        ))}
      </Vaso>
      <Bandera x={800} y={780} txt="microtrombos que obstruyen los vasos pequeños" color={S.fibrina[0]} p={p('microtrombos')} t={28} punta="no" />
      <Bandera x={400} y={870} txt="se consumen plaquetas y factores" color={S.plaq[0]} p={p('plaquetas')} t={26} punta="no" />
      <Bandera x={1180} y={870} txt="inmunotrombosis" color={S.net[0]} p={p('inmunotrombosis')} t={30} punta="no" />
      <Bandera x={800} y={950} txt="un coágulo que nació para defender y que ahora tapa" color={S.il1[0]} p={p('tapa')} t={28} punta="no" />
      <Bandera x={800} y={250} txt="fase 3 · coagulopatía" color={S.il6[0]} p={p('coagulacion')} t={32} punta="no" />
    </g>
  );
};

// ─── 6 · Fuego y apagón a la vez ─────────────────────────────────────────────
const FuegoApagon: Lamina = ({ p, reloj }) => {
  const incl = 0.5 * Math.sin(reloj / 1500) + 0.25 * Math.sin(reloj / 560 + 1);
  return (
    <g>
      <Sale p={p('sorprendente')} x={800} y={440} k={1.25}>
        <Balanza x={0} y={0} inclina={incl} reloj={reloj} izq={<g transform="translate(0,-34)"><Llama /></g>} der={<g transform="translate(0,-30)"><Copo /></g>} />
      </Sale>
      <Bandera x={300} y={800} txt="la inflamación se incendia" color={S.il1[0]} p={p('incendia')} t={30} punta="no" />
      <Bandera x={1300} y={800} txt="la inmunosupresión se apaga" color={S.linfo[0]} p={p('apaga')} t={30} punta="no" />
      <Bandera x={800} y={95} txt="las dos coexisten desde el principio" color={S.il6[0]} p={p('coexisten')} t={34} punta="no" />
      <Bandera x={800} y={870} txt="cuál domina: el microbio, el foco y la reserva del paciente" color={S.il6[0]} p={p('domina')} t={26} punta="no" />
      <Bandera x={800} y={945} txt="difícil de entender y fácil de subestimar" color={S.il1[0]} p={p('entender')} t={30} punta="no" />
    </g>
  );
};

const LAMINAS: Lamina[] = [DefensaLocal, Desregulada, PruebaTlr4, Fase1, Fase2, Fase3, FuegoApagon];
export default LAMINAS;
