// La portada de cada laboratorio en el índice de /estudio y en la tarjeta del lector:
// un dibujo de lo que el laboratorio enseña, sin fondo, en el estilo de las referencias de
// BUST (vector plano saturado, sin contorno; cada forma con su luz arriba a la izquierda,
// su sombra en media luna abajo a la derecha y un brillo blanco). Cada dibujo lleva las
// partes que el alumno reconocería en un atlas (capas de un corte, orgánulos, ramas…).
// Todo es SVG en código: nada que subir ni cachear. Sin `filter`, sin degradados, sin
// recortes y sin ids, para que varias portadas convivan en la misma página. La clave es el
// slug del laboratorio (`claveDePortada`); uno sin portada cae en el icono del curso.

import type { ReactNode } from 'react';

type Tono = readonly [oscuro: string, medio: string, claro: string];

const C = {
  // Tonos joya: el medio guarda su croma con una luz media (nada de neón); la sombra gira
  // hacia el azul y la luz hacia el amarillo, como en la teoría del color.
  rojo: ['#911238', '#CE2233', '#EC7C74'],
  musculo: ['#711433', '#AB2637', '#E16560'],
  magenta: ['#7D1C6A', '#B53080', '#DF77A4'],
  rosa: ['#A8306A', '#DE5E89', '#ED97A5'],
  morado: ['#3F2272', '#773AA6', '#BD7BD5'],
  indigo: ['#1B1B65', '#31349B', '#7283CB'],
  azul: ['#15368A', '#2673C5', '#7BBDE0'],
  cian: ['#114F69', '#2298A5', '#60D7CF'],
  verde: ['#175E4B', '#2C9664', '#67CB8C'],
  amarillo: ['#B1590B', '#E9A620', '#F6E384'],
  naranja: ['#AA2A13', '#DF692A', '#F0BE89'],
  hueso: ['#C4A574', '#F3E6C4', '#FFFBEF'],
  vidrio: ['#88A1CE', '#CDDFEE', '#FFFFFF'],
  // Citoplasmas de los leucocitos
  lila: ['#AD8EC7', '#E3D0EC', '#FFFFFF'],
  celeste: ['#8197D5', '#CBDBF1', '#FFFFFF'],
  gris: ['#9F9FC1', '#DCDBEB', '#FFFFFF'],
  salmon: ['#E28A6F', '#F6D6C1', '#FFFFFF'],
  macrofago: ['#9584C2', '#D4C5E7', '#FFFFFF'],
  cerebelo: ['#843963', '#C65D87', '#E29DAF'],
} satisfies Record<string, Tono>;

const BLANCO = '#FFFFFF';
const rad = (a: number) => (a * Math.PI) / 180;
const polar = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];

/* ─────────────────────────── piezas ─────────────────────────── */

/** Esfera plana: sombra en media luna, cuerpo desplazado hacia la luz y brillo. */
function Bola({ x, y, r, c, brillo = true }: { x: number; y: number; r: number; c: Tono; brillo?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={c[0]} />
      <circle cx={x - r * 0.1} cy={y - r * 0.1} r={r * 0.84} fill={c[1]} />
      {brillo && <circle cx={x - r * 0.4} cy={y - r * 0.4} r={Math.min(4.2, Math.max(1.1, r * 0.17))} fill={BLANCO} opacity={0.85} />}
    </g>
  );
}

/** Sombra en el suelo: el dibujo flota. */
function Suelo({ x = 110, y = 123, rx = 58 }: { x?: number; y?: number; rx?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={4} fill="#1B2547" opacity={0.09} />;
}

/** Un trazo con volumen: borde oscuro, cuerpo medio y un hilo de luz. */
function Tubo({ d, w, c, luz = true }: { d: string; w: number; c: Tono; luz?: boolean }) {
  const comun = { d, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g>
      <path {...comun} stroke={c[0]} strokeWidth={w} />
      <path {...comun} stroke={c[1]} strokeWidth={w * 0.62} transform="translate(-0.5 -0.7)" />
      {luz && <path {...comun} stroke={c[2]} strokeWidth={Math.max(1, w * 0.16)} transform={`translate(${-w * 0.14} ${-w * 0.2})`} opacity={0.9} />}
    </g>
  );
}

/** Músculo: un tubo con sus estrías transversales. */
function Musculo({ d, w, c = C.musculo }: { d: string; w: number; c?: Tono }) {
  return (
    <g>
      <Tubo d={d} w={w} c={c} />
      <path d={d} fill="none" stroke={c[0]} strokeWidth={w * 0.55} strokeDasharray="1.1 3" opacity={0.35} />
    </g>
  );
}

/** Vientre muscular (forma de huso): relleno, sombra y estrías. */
function Vientre({ d, eje, c = C.musculo }: { d: string; eje: string; c?: Tono }) {
  return (
    <g>
      <path d={d} fill={c[0]} />
      <path d={d} fill={c[1]} transform="translate(-0.8 -1)" />
      <path d={eje} fill="none" stroke={c[0]} strokeWidth={6} strokeDasharray="1 2.8" opacity={0.32} />
      <path d={eje} fill="none" stroke={c[2]} strokeWidth={1.4} strokeLinecap="round" transform="translate(-2 -1.5)" opacity={0.8} />
    </g>
  );
}

/** Bastón redondeado (bacilo, receptor, cápsula). */
function Baston({ x, y, l, w, rot = 0, c, brillo = true }: { x: number; y: number; l: number; w: number; rot?: number; c: Tono; brillo?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-l / 2} y={-w / 2} width={l} height={w} rx={w / 2} fill={c[0]} />
      <rect x={-l / 2 + 0.8} y={-w / 2} width={l - 2.2} height={w * 0.8} rx={w * 0.4} fill={c[1]} />
      {brillo && <rect x={-l / 2 + w * 0.45} y={-w * 0.3} width={l * 0.36} height={Math.max(1.2, w * 0.15)} rx={w * 0.08} fill={BLANCO} opacity={0.75} />}
    </g>
  );
}

/** Glóbulo rojo: disco con su depresión central (oscura) y el borde de luz. */
function Hematie({ x, y, r, rot = 0, aplanado = 1 }: { x: number; y: number; r: number; rot?: number; aplanado?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 ${aplanado})`}>
      <circle r={r} fill={C.rojo[0]} />
      <circle cx={-r * 0.07} cy={-r * 0.07} r={r * 0.9} fill={C.rojo[1]} />
      <circle cx={r * 0.03} cy={r * 0.03} r={r * 0.5} fill={C.rojo[2]} />
      <circle cx={r * 0.1} cy={r * 0.1} r={r * 0.4} fill={C.rojo[0]} />
      <circle cx={-r * 0.55} cy={-r * 0.45} r={r * 0.12} fill={BLANCO} opacity={0.8} />
    </g>
  );
}

/** Anticuerpo en Y (las ramas apuntan hacia «arriba» antes de rotar). */
function Ac({ x, y, s = 1, rot = 0, c = C.amarillo }: { x: number; y: number; s?: number; rot?: number; c?: Tono }) {
  const d = 'M0 9 L0 1 M0 1 L-6 -7 M0 1 L6 -7';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={c[0]} strokeWidth={4.2} />
      <path d={d} stroke={c[1]} strokeWidth={2.4} transform="translate(-0.4 -0.4)" />
    </g>
  );
}

/** Anticuerpos clavados en el borde de una célula, mirando hacia fuera. */
function Coronados({ x, y, r, angulos, s = 1, c }: { x: number; y: number; r: number; angulos: number[]; s?: number; c?: Tono }) {
  return (
    <>
      {angulos.map((a) => {
        const [px, py] = polar(x, y, r + 8 * s, a);
        return <Ac key={a} x={px} y={py} rot={a + 90} s={s} c={c} />;
      })}
    </>
  );
}

/** Hueso largo: diáfisis con sus dos epífisis. */
function Hueso({ x1, y1, x2, y2, w }: { x1: number; y1: number; x2: number; y2: number; w: number }) {
  const d = `M${x1} ${y1} L${x2} ${y2}`;
  return (
    <g>
      <Tubo d={d} w={w} c={C.hueso} luz={false} />
      <Bola x={x1} y={y1} r={w * 0.72} c={C.hueso} brillo={false} />
      <Bola x={x2} y={y2} r={w * 0.72} c={C.hueso} brillo={false} />
      <path d={d} stroke={C.hueso[2]} strokeWidth={w * 0.16} strokeLinecap="round" transform={`translate(${-w * 0.12} ${-w * 0.16})`} />
    </g>
  );
}

/** Chincheta de «señala la estructura» (los exámenes de identificación). */
function Pin({ x, y, c = C.magenta, letra }: { x: number; y: number; c?: Tono; letra?: string }) {
  const d = 'M0 0 C-4 -8 -11 -13 -11 -21 A11 11 0 0 1 11 -21 C11 -13 4 -8 0 0Z';
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={d} fill={c[0]} />
      <path d={d} fill={c[1]} transform="translate(-1 -1.2) scale(.9)" />
      <circle cy={-21} r={6} fill={BLANCO} />
      {letra && <text y={-18.2} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={c[0]} fontFamily="Outfit, system-ui, sans-serif">{letra}</text>}
    </g>
  );
}

/** Zoom de verdad (lo que se ve en el microscopio): aro gris y campo claro. */
function Lente({ x, y, r, children }: { x: number; y: number; r: number; children: ReactNode }) {
  return (
    <g>
      <circle cx={x} cy={y + 2.5} r={r + 4} fill="#1B2547" opacity={0.08} />
      <circle cx={x} cy={y} r={r + 4} fill="#9AA9C2" />
      <circle cx={x - 0.6} cy={y - 0.8} r={r + 2.6} fill="#C9D3E3" />
      <circle cx={x} cy={y} r={r} fill="#FFF9F4" />
      {children}
      <path d={`M${x - r * 0.72} ${y - r * 0.38} A${r * 0.82} ${r * 0.82} 0 0 1 ${x - r * 0.2} ${y - r * 0.8}`} stroke={BLANCO} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

/** Flecha curva sencilla: el trazo y una punta que se le pasa a mano. */
function Flecha({ d, punta, c = C.cian }: { d: string; punta: string; c?: Tono }) {
  return (
    <g fill="none" stroke={c[0]} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
      <path d={punta} />
    </g>
  );
}

/** Arco de circunferencia. */
function arco(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => polar(cx, cy, r, a).map((n) => n.toFixed(2)).join(' ');
  return `M${p(a0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p(a1)}`;
}

/** Neutrófilo: citoplasma claro con gránulos y su núcleo en lóbulos. */
function Neutrofilo({ x, y, r, banda = false }: { x: number; y: number; r: number; banda?: boolean }) {
  const k = r / 20;
  const nucleo = banda
    ? `M${x - 9 * k} ${y - 6 * k} C${x - 12 * k} ${y + 8 * k} ${x + 10 * k} ${y + 10 * k} ${x + 9 * k} ${y - 6 * k}`
    : `M${x - 9 * k} ${y - 2 * k} Q${x - 4 * k} ${y - 10 * k} ${x + 1 * k} ${y - 5 * k} Q${x + 6 * k} ${y - 1 * k} ${x + 9 * k} ${y + 6 * k}`;
  return (
    <g>
      <Bola x={x} y={y} r={r} c={C.lila} brillo={false} />
      {[[-10, 7], [6, -12], [12, 10], [-3, 13], [-13, -7], [14, -2], [0, 2], [-6, -13]].map(([dx, dy], i) => (
        <circle key={i} cx={x + dx * k} cy={y + dy * k} r={1.2 * k} fill={C.rosa[1]} />
      ))}
      <Tubo d={nucleo} w={7.5 * k} c={C.morado} luz={false} />
      {!banda && (
        <>
          <circle cx={x - 9 * k} cy={y - 2 * k} r={4 * k} fill={C.morado[1]} />
          <circle cx={x + 1 * k} cy={y - 5 * k} r={4.2 * k} fill={C.morado[1]} />
          <circle cx={x + 9 * k} cy={y + 6 * k} r={4 * k} fill={C.morado[1]} />
        </>
      )}
      <circle cx={x - 2 * k} cy={y - 7 * k} r={1.2 * k} fill={BLANCO} opacity={0.8} />
    </g>
  );
}

/** Linfocito: núcleo redondo que casi llena la célula. */
function Linfocito({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <Bola x={x} y={y} r={r} c={C.celeste} brillo={false} />
      <Bola x={x + r * 0.08} y={y + r * 0.06} r={r * 0.78} c={C.indigo} />
      {[[0.2, 0.25], [-0.25, 0.2], [0.3, -0.15]].map(([a, b], i) => <circle key={i} cx={x + a * r} cy={y + b * r} r={r * 0.09} fill={C.indigo[0]} />)}
    </g>
  );
}

/** Monocito: núcleo arriñonado y vacuolas. */
function Monocito({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <Bola x={x} y={y} r={r} c={C.gris} brillo={false} />
      {[[-0.5, 0.45], [0.55, 0.35], [0.1, 0.6]].map(([a, b], i) => <circle key={i} cx={x + a * r} cy={y + b * r} r={r * 0.11} fill={BLANCO} />)}
      <ellipse cx={x - r * 0.02} cy={y - r * 0.1} rx={r * 0.6} ry={r * 0.44} fill={C.morado[0]} />
      <ellipse cx={x - r * 0.06} cy={y - r * 0.14} rx={r * 0.54} ry={r * 0.38} fill={C.morado[1]} />
      <circle cx={x + r * 0.18} cy={y + r * 0.26} r={r * 0.26} fill={C.gris[1]} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.08} fill={BLANCO} opacity={0.8} />
    </g>
  );
}

/** Eosinófilo: núcleo bilobulado y gránulos anaranjados. */
function Eosinofilo({ x, y, r }: { x: number; y: number; r: number }) {
  const g: [number, number][] = [[-0.6, 0.3], [-0.3, 0.6], [0.1, 0.55], [0.5, 0.4], [0.6, -0.1], [-0.6, -0.25], [-0.15, -0.6], [0.3, -0.55], [0, 0.25], [-0.35, 0.05], [0.35, 0.1]];
  return (
    <g>
      <Bola x={x} y={y} r={r} c={C.salmon} brillo={false} />
      {g.map(([a, b], i) => <circle key={i} cx={x + a * r} cy={y + b * r} r={r * 0.11} fill={C.naranja[1]} />)}
      <Tubo d={`M${x - r * 0.35} ${y - r * 0.1} Q${x} ${y + r * 0.2} ${x + r * 0.35} ${y - r * 0.1}`} w={r * 0.22} c={C.morado} luz={false} />
      <Bola x={x - r * 0.38} y={y - r * 0.12} r={r * 0.3} c={C.morado} />
      <Bola x={x + r * 0.38} y={y - r * 0.12} r={r * 0.3} c={C.morado} />
    </g>
  );
}

/** Plaqueta en reposo (disco con gránulos). */
function Plaqueta({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={7} ry={4.6} fill={C.morado[0]} />
      <ellipse cx={-0.6} cy={-0.6} rx={6} ry={3.8} fill={C.morado[2]} />
      {[[-2.5, -0.5], [1.5, 1], [2.8, -1.2], [-0.6, 1.5]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={0.9} fill={C.morado[0]} />)}
    </g>
  );
}

/** Plaqueta activada: con sus seudópodos. */
function PlaquetaActiva({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[10, 60, 115, 160, 215, 260, 310].map((a, i) => {
        const [px, py] = polar(0, 0, i % 2 ? 11 : 13, a);
        return <path key={a} d={`M0 0 L${px.toFixed(1)} ${py.toFixed(1)}`} stroke={C.morado[1]} strokeWidth={2.6} strokeLinecap="round" />;
      })}
      <Bola x={0} y={0} r={6.5} c={[C.morado[0], C.morado[2], BLANCO]} />
      {[[-1.5, 1.5], [2, 0.5], [0, -2]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={1} fill={C.morado[0]} />)}
    </g>
  );
}

/** Tubo de ensayo (vidrio, líquido, menisco y brillo). */
function TuboEnsayo({ x, y, rot = 0, liq, nivel = -4, ancho = 15, alto = 44 }: { x: number; y: number; rot?: number; liq: Tono; nivel?: number; ancho?: number; alto?: number }) {
  const a = ancho;
  const fondo = alto - a;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M${-a} ${-alto} H${a} V${fondo} A${a} ${a} 0 0 1 ${-a} ${fondo}Z`} fill={C.vidrio[1]} />
      <path d={`M${-a} ${nivel} H${a} V${fondo} A${a} ${a} 0 0 1 ${-a} ${fondo}Z`} fill={liq[1]} />
      <path d={`M${a * 0.2} ${nivel} H${a} V${fondo} A${a} ${a} 0 0 1 ${a * 0.13} ${fondo + a * 0.97} C${a * 0.66} ${fondo} ${a * 0.6} ${nivel + 20} ${a * 0.2} ${nivel}Z`} fill={liq[0]} opacity={0.55} />
      <ellipse cy={nivel} rx={a} ry={a * 0.24} fill={liq[2]} />
      <rect x={-a - 3} y={-alto - 6} width={2 * a + 6} height={8} rx={4} fill={C.vidrio[0]} />
      <rect x={-a * 0.65} y={-alto + 6} width={a * 0.32} height={alto + fondo - 10} rx={a * 0.16} fill={BLANCO} opacity={0.7} />
    </g>
  );
}

/* ─────────────────────────── portadas ─────────────────────────── */

const PORTADAS: Record<string, () => ReactNode> = {
  /* Estreptococos: cadena de cocos grampositivos (violeta) en una S suave, de dos en dos
     (cada par todavía unido por su tabique de división). La luz no gira con la cadena:
     siempre arriba a la izquierda. El tamaño cambia apenas para dar profundidad. */
  'atlas-microbiologia': () => {
    const P = [[20, 86], [74, 132], [136, 4], [202, 50]];
    const bez = (t: number): [number, number] => {
      const u = 1 - t;
      const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
      return [0, 1].map((j) => k.reduce((s, w, i) => s + w * P[i][j], 0)) as [number, number];
    };
    const m = Array.from({ length: 301 }, (_, i) => bez(i / 300));
    const acum = [0];
    for (let i = 1; i < m.length; i++) acum.push(acum[i - 1] + Math.hypot(m[i][0] - m[i - 1][0], m[i][1] - m[i - 1][1]));
    const en = (s: number) => {
      const i = Math.max(1, acum.findIndex((a) => a >= s));
      return { x: m[i][0], y: m[i][1], ang: (Math.atan2(m[i][1] - m[i - 1][1], m[i][0] - m[i - 1][0]) * 180) / Math.PI };
    };
    const L = acum[acum.length - 1];
    const R = 10.4;
    const pares: { a: ReturnType<typeof en>; b: ReturnType<typeof en>; r: number; n: number }[] = [];
    for (let n = 0, pos = R; ; n++) {
      const r = R * (0.92 + 0.1 * Math.sin(n * 0.9 + 0.4));
      if (pos + 1.6 * r + r > L) break;
      pares.push({ a: en(pos), b: en(pos + 1.6 * r), r, n });
      pos += 1.6 * r + 2.16 * r;
    }
    const f = (v: number) => v.toFixed(1);
    return (
      <>
        <Suelo rx={92} />
        {[...pares].sort((p, q) => p.r - q.r).map(({ a, b, r, n }) => {
          const [mx, my] = [(a.x + b.x) / 2, (a.y + b.y) / 2];
          const ang = rad(a.ang + 90);
          const [tx, ty] = [Math.cos(ang) * r * 0.5, Math.sin(ang) * r * 0.5];
          return (
            <g key={n}>
              {[a, b].map((c, i) => <circle key={i} cx={f(c.x)} cy={f(c.y)} r={f(r)} fill={C.morado[0]} />)}
              {[a, b].map((c, i) => <circle key={i} cx={f(c.x - r * 0.1)} cy={f(c.y - r * 0.12)} r={f(r * 0.86)} fill={C.morado[1]} />)}
              {[a, b].map((c, i) => <circle key={i} cx={f(c.x - r * 0.24)} cy={f(c.y - r * 0.28)} r={f(r * 0.5)} fill={C.morado[2]} opacity={0.32} />)}
              <path d={`M${f(mx - tx)} ${f(my - ty)} L${f(mx + tx)} ${f(my + ty)}`} stroke={C.morado[0]} strokeWidth={1.3} strokeLinecap="round" opacity={0.75} />
              {[a, b].map((c, i) => (
                <ellipse key={i} cx={f(c.x - r * 0.4)} cy={f(c.y - r * 0.44)} rx={f(r * 0.24)} ry={f(r * 0.14)} fill={BLANCO} opacity={0.88} transform={`rotate(-40 ${f(c.x - r * 0.4)} ${f(c.y - r * 0.44)})`} />
              ))}
            </g>
          );
        })}
      </>
    );
  },

  /* Tenia adulta enrollada: el extremo grávido en el centro de la espiral y el cuello que
     sale de ella hasta el escólex. Las proglótides crecen desde el cuello: inmaduras (solo
     los conductos excretores), maduras (testículos, ovario bilobulado y poro genital que
     alterna de lado) y grávidas (útero ramificado); el borde posterior de cada una monta
     sobre la siguiente. La lente amplía el escólex: rostelo con su doble corona de ganchos,
     cuatro ventosas y el cuello que empieza a segmentarse. */
  'atlas-parasitologia': () => {
    const cinta: Tono = ['#B9874A', '#F4DFB4', '#FFF8E6'];
    const [cx, cy] = [68, 66];
    const vueltas = 2.2;
    const thFin = rad(-60);
    const espiral = (t: number): [number, number] => {
      const th = thFin - (1 - t) * vueltas * 2 * Math.PI;
      const r = 16 + t * vueltas * 17;
      return [cx + Math.cos(th) * r * 1.18, cy + Math.sin(th) * r];
    };
    // De la punta (escólex) al centro: la entrada curva y luego la espiral hacia dentro.
    const [ex, ey] = espiral(1);
    const escolex: [number, number] = [140, 14];
    const control: [number, number] = [ex + 20, ey + 9];
    const ent = Array.from({ length: 41 }, (_, i) => {
      const u = i / 40;
      return [(1 - u) * (1 - u) * escolex[0] + 2 * (1 - u) * u * control[0] + u * u * ex, (1 - u) * (1 - u) * escolex[1] + 2 * (1 - u) * u * control[1] + u * u * ey] as [number, number];
    });
    const muestras = [...ent, ...Array.from({ length: 600 }, (_, i) => espiral(1 - (i + 1) / 600))];
    const acum = [0];
    for (let i = 1; i < muestras.length; i++) acum.push(acum[i - 1] + Math.hypot(muestras[i][0] - muestras[i - 1][0], muestras[i][1] - muestras[i - 1][1]));
    const L = acum[acum.length - 1];
    const en = (s: number) => {
      const i = Math.max(1, acum.findIndex((a) => a >= s));
      const [a, b] = [muestras[i - 1], muestras[i]];
      return { x: b[0], y: b[1], ang: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
    };
    const cuello = 9;
    const prog: { x: number; y: number; ang: number; l: number; w: number; s: number }[] = [];
    for (let pos = cuello; ;) {
      const s = pos / L;
      const l = 1.3 + 7.6 * s ** 1.6;
      const w = 2.4 + 15 * s ** 1.3;
      if (pos + l > L) break;
      prog.push({ ...en(pos + l / 2), l, w, s });
      pos += l;
    }
    const forma = (l: number, w: number) => `M${(-l / 2 - 1.2).toFixed(2)} ${(-w * 0.43).toFixed(2)} L${(l / 2).toFixed(2)} ${(-w / 2).toFixed(2)} Q${(l / 2 + 0.7).toFixed(2)} 0 ${(l / 2).toFixed(2)} ${(w / 2).toFixed(2)} L${(-l / 2 - 1.2).toFixed(2)} ${(w * 0.43).toFixed(2)}Z`;
    const LX = 184;
    const LY = 54;
    const ganchos = (r: number, paso: number, largo: number, desfase: number) =>
      Array.from({ length: Math.floor(220 / paso) + 1 }, (_, i) => -200 + desfase + i * paso).map((a) => {
        const [x1, y1] = polar(LX, LY - 16, r, a);
        const [x2, y2] = polar(LX, LY - 16, r + largo, a + 10);
        const [qx, qy] = polar(LX, LY - 16, r + largo * 0.9, a - 6);
        return <path key={`${r}-${a}`} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
      });
    return (
      <>
        <Suelo x={110} y={125} rx={96} />
        {/* Cuello */}
        <path d={`M${muestras.filter((_, i) => acum[i] <= cuello + 1).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`} stroke={cinta[0]} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        {/* Proglótides: de la última a la primera, para que cada borde posterior monte */}
        {prog.map((p, i) => ({ ...p, i })).reverse().map(({ x, y, ang, l, w, s, i }) => {
          const d = forma(l, w);
          const madura = s > 0.3 && s <= 0.68;
          const gravida = s > 0.68;
          const ramas = Math.max(3, Math.round(l / 1.3));
          const lado = i % 2 ? -1 : 1;
          return (
            <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})`}>
              <path d={d} fill={cinta[0]} />
              <path d={d} fill={cinta[1]} transform="translate(-0.25 -0.35) scale(.9 .84)" />
              {w > 5 && <path d={`M${-l / 2 + 0.4} ${-w * 0.31} H${l / 2 - 0.6} M${-l / 2 + 0.4} ${w * 0.31} H${l / 2 - 0.6}`} stroke={cinta[0]} strokeWidth={0.45} opacity={0.7} />}
              {madura && (
                <>
                  {[[-0.3, -0.18], [0.0, -0.22], [0.25, -0.16], [-0.18, 0.04], [0.12, 0.02], [-0.3, 0.2], [0.02, 0.22]].map(([a, b], j) => (
                    <circle key={j} cx={a * l} cy={b * w} r={Math.max(0.35, w * 0.035)} fill={C.amarillo[0]} opacity={0.75} />
                  ))}
                  <circle cx={l * 0.3} cy={-w * 0.08} r={Math.max(0.4, w * 0.06)} fill={C.rosa[1]} />
                  <circle cx={l * 0.3} cy={w * 0.08} r={Math.max(0.4, w * 0.06)} fill={C.rosa[1]} />
                  <path d={`M0 0 Q${l * 0.1} ${lado * w * 0.22} 0 ${lado * (w / 2 - 0.6)}`} stroke={C.rosa[0]} strokeWidth={0.45} fill="none" />
                  <circle cx={0} cy={lado * (w / 2 - 0.5)} r={0.6} fill={C.rosa[0]} />
                </>
              )}
              {gravida && (
                <g stroke={C.naranja[0]} strokeWidth={0.7} strokeLinecap="round" fill="none" opacity={0.75}>
                  <path d={`M${-l / 2 + 1.2} 0 H${l / 2 - 1.4}`} />
                  {Array.from({ length: ramas }, (_, j) => -l / 2 + 1.4 + (j * (l - 2.8)) / Math.max(1, ramas - 1)).map((bx) => (
                    <path key={bx} d={`M${bx.toFixed(2)} 0 Q${(bx + 0.9).toFixed(2)} ${(-w * 0.18).toFixed(2)} ${(bx + 0.3).toFixed(2)} ${(-w * 0.34).toFixed(2)} M${bx.toFixed(2)} 0 Q${(bx + 0.9).toFixed(2)} ${(w * 0.18).toFixed(2)} ${(bx + 0.3).toFixed(2)} ${(w * 0.34).toFixed(2)}`} />
                  ))}
                </g>
              )}
              {w > 4 && <path d={`M${-l / 2 + 0.5} ${-w * 0.36} H${l * 0.15}`} stroke={BLANCO} strokeWidth={Math.max(0.4, w * 0.05)} strokeLinecap="round" opacity={0.7} />}
            </g>
          );
        })}
        {/* Escólex en la cinta y la guía de la lente */}
        <path d={`M${escolex[0] + 5} ${escolex[1] + 4} L${LX - 34} ${LY + 8} M${escolex[0] + 6} ${escolex[1] - 3} L${LX - 22} ${LY - 28}`} stroke="#9AA9C2" strokeWidth={1.1} strokeLinecap="round" />
        <Bola x={escolex[0]} y={escolex[1]} r={3.6} c={cinta} brillo={false} />
        <circle cx={escolex[0]} cy={escolex[1]} r={7} fill="none" stroke="#9AA9C2" strokeWidth={1.3} />
        <Lente x={LX} y={LY} r={36}>
          <g transform={`rotate(32 ${LX} ${LY})`}>
            {/* Cuello que se estrecha y empieza a segmentarse */}
            <path d={`M${LX - 6} ${LY + 8} C${LX - 4} ${LY + 18} ${LX - 3.4} ${LY + 26} ${LX - 3.2} ${LY + 33} L${LX + 3.2} ${LY + 33} C${LX + 3.4} ${LY + 26} ${LX + 4} ${LY + 18} ${LX + 6} ${LY + 8}Z`} fill={cinta[0]} />
            <path d={`M${LX - 5} ${LY + 8} C${LX - 3.2} ${LY + 18} ${LX - 2.6} ${LY + 26} ${LX - 2.4} ${LY + 32} L${LX + 2} ${LY + 32} C${LX + 2.2} ${LY + 26} ${LX + 2.8} ${LY + 18} ${LX + 4.4} ${LY + 8}Z`} fill={cinta[1]} />
            {[25, 28.4, 31.2].map((dy) => <path key={dy} d={`M${LX - 3.6} ${LY + dy} H${LX + 3.6}`} stroke={cinta[0]} strokeWidth={0.8} />)}
            {/* Cabeza */}
            <path d={`M${LX - 13} ${LY - 4} C${LX - 14} ${LY - 17} ${LX + 14} ${LY - 17} ${LX + 13} ${LY - 4} C${LX + 12} ${LY + 7} ${LX + 6} ${LY + 11} ${LX} ${LY + 11} C${LX - 6} ${LY + 11} ${LX - 12} ${LY + 7} ${LX - 13} ${LY - 4}Z`} fill={cinta[0]} />
            <path d={`M${LX - 12} ${LY - 4.6} C${LX - 13} ${LY - 16} ${LX + 12.4} ${LY - 16} ${LX + 11.6} ${LY - 4.6} C${LX + 10.8} ${LY + 6} ${LX + 5.2} ${LY + 9.6} ${LX} ${LY + 9.6} C${LX - 5.4} ${LY + 9.6} ${LX - 11} ${LY + 6} ${LX - 12} ${LY - 4.6}Z`} fill={cinta[1]} />
            {/* Ventosas: dos de perfil en los flancos y una de frente */}
            {[-1, 1].map((k) => (
              <g key={k} transform={`translate(${LX + k * 11.4} ${LY - 2}) rotate(${k * 12})`}>
                <ellipse rx={3.2} ry={5.6} fill={cinta[0]} />
                <ellipse cx={k * 1.1} rx={1.6} ry={4.2} fill={C.naranja[0]} opacity={0.5} />
              </g>
            ))}
            <ellipse cx={LX + 1.5} cy={LY + 1} rx={5} ry={5.6} fill={cinta[0]} />
            <ellipse cx={LX + 1.1} cy={LY + 0.6} rx={4.1} ry={4.7} fill={cinta[2]} />
            <ellipse cx={LX + 1.8} cy={LY + 1.4} rx={2.5} ry={2.9} fill={C.naranja[0]} opacity={0.42} />
            {/* Rostelo con su doble corona de ganchos (quitinosos, pardos) */}
            <g stroke="#8A5A22" strokeWidth={0.95} strokeLinecap="round" fill="none">
              {ganchos(7, 18, 3.4, 0)}
              {ganchos(5.2, 18, 2.2, 9)}
            </g>
            <circle cx={LX} cy={LY - 16} r={5.4} fill={cinta[0]} />
            <circle cx={LX - 0.5} cy={LY - 16.5} r={4.3} fill={cinta[1]} />
            <path d={`M${LX - 9} ${LY - 8} C${LX - 8} ${LY - 12} ${LX - 5} ${LY - 14} ${LX - 2} ${LY - 14}`} stroke={BLANCO} strokeWidth={1.3} fill="none" strokeLinecap="round" opacity={0.8} />
          </g>
        </Lente>
      </>
    );
  },

  /* Tres esporas de hongos: una grande de pared doble, con verrugas que asoman del borde,
     gotas de lípido, núcleo y poro germinal; una equinulada y una que germina con su tubo
     tabicado. */
  'atlas-micologia': () => {
    const T = C.cian; // un solo tono: tres matices la volvían muy colorida
    const espora = (x: number, y: number, rx: number, ry: number, rot: number, c: Tono) => (
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <ellipse rx={rx} ry={ry} fill={c[0]} />
        <ellipse cx={-rx * 0.06} cy={-ry * 0.08} rx={rx * 0.88} ry={ry * 0.86} fill={c[1]} />
        <ellipse rx={rx * 0.7} ry={ry * 0.66} fill="none" stroke={c[2]} strokeWidth={0.8} opacity={0.75} />
        <circle cx={rx * 0.2} cy={ry * 0.15} r={Math.max(0.8, rx * 0.14)} fill={c[0]} opacity={0.45} />
        <ellipse cx={-rx * 0.42} cy={-ry * 0.42} rx={Math.max(1, rx * 0.16)} ry={Math.max(0.7, ry * 0.11)} fill={BLANCO} opacity={0.85} transform={`rotate(-30 ${-rx * 0.42} ${-ry * 0.42})`} />
      </g>
    );
    const verrugas = Array.from({ length: 26 }, (_, i) => i * (360 / 26));
    const espinas = Array.from({ length: 16 }, (_, i) => i * (360 / 16));
    return (
      <>
        <Suelo x={112} rx={88} />
        {/* Espora equinulada */}
        <g>
          {espinas.map((a) => {
            const [x1, y1] = polar(176, 36, 12.6, a);
            const [x2, y2] = polar(176, 36, 16.4, a);
            return <path key={a} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={T[0]} strokeWidth={1.7} strokeLinecap="round" />;
          })}
          {espora(176, 36, 13.4, 13.4, 0, T)}
        </g>
        {/* Espora que germina, con su tubo germinativo tabicado */}
        <Tubo d="M160 94 C168 86 176 96 184 101 C190 105 198 105 206 100" w={5.6} c={T} />
        <path d="M177 94.6 l-2.4 4.4 M195 102.6 l-0.6 4.8" stroke={T[0]} strokeWidth={1.2} strokeLinecap="round" />
        {espora(150, 96, 13, 10.4, 12, T)}
        {/* Espora grande */}
        <g transform="translate(78 62) rotate(-15) scale(1.22)">
          {verrugas.map((a) => (
            <circle key={a} cx={Math.cos(rad(a)) * 27.6} cy={Math.sin(rad(a)) * 17.6} r={1.9} fill={T[0]} />
          ))}
          <ellipse rx={28} ry={18} fill={T[0]} />
          <ellipse cx={-1} cy={-1.2} rx={26.4} ry={16.4} fill={T[1]} />
          <ellipse rx={23} ry={13.6} fill="none" stroke={T[2]} strokeWidth={1.1} opacity={0.75} />
          <ellipse cx={-2} cy={-2} rx={19} ry={10} fill={T[2]} opacity={0.3} />
          <ellipse cx={8} cy={2.4} rx={5} ry={4} fill={T[0]} opacity={0.45} />
          <circle cx={7.4} cy={2} r={1.4} fill={T[0]} opacity={0.6} />
          {[[-9, 3, 2.2], [-3, -4, 1.6], [-14, -3, 1.3], [2, 6, 1.2], [-6, 8, 1]].map(([a, b, r], i) => (
            <circle key={i} cx={a} cy={b} r={r} fill={T[2]} opacity={0.5} />
          ))}
          {/* Poro germinal */}
          <ellipse cx={26.6} cy={0} rx={2} ry={3.6} fill={T[2]} />
          <path d="M-20 -8 C-14 -13 -4 -15 6 -15" stroke={BLANCO} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
        </g>
      </>
    );
  },

  /* Tubo de sangre centrifugada (plasma, capa leucocitaria, hematíes) y frasco de orina,
     con lo que se reparte entre los dos: glucosa, proteína, iones. */
  'parametro-sangre-orina': () => {
    const hex = Array.from({ length: 6 }, (_, i) => polar(0, 0, 9, i * 60 - 90).map((n) => n.toFixed(1)).join(',')).join(' ');
    return (
      <>
        <Suelo rx={84} />
        {/* Sangre */}
        <g transform="translate(54 66) rotate(-6)">
          <path d="M-15 -40 H15 V34 A15 15 0 0 1 -15 34Z" fill={C.vidrio[1]} />
          <path d="M-15 8 H15 V34 A15 15 0 0 1 -15 34Z" fill={C.rojo[1]} />
          <path d="M3 8 H15 V34 A15 15 0 0 1 2 48.6 C10 38 9 22 3 8Z" fill={C.rojo[0]} opacity={0.6} />
          <rect x={-15} y={4} width={30} height={4.5} fill={BLANCO} />
          <rect x={-15} y={-22} width={30} height={26} fill={C.amarillo[2]} />
          <ellipse cy={-22} rx={15} ry={3.4} fill="#FFF5D2" />
          <rect x={-18} y={-58} width={36} height={20} rx={5} fill={C.rojo[0]} />
          <rect x={-18} y={-60} width={36} height={16} rx={5} fill={C.rojo[1]} />
          {[-11, -5.5, 0, 5.5, 11].map((x) => <path key={x} d={`M${x} -56 L${x} -47`} stroke={C.rojo[0]} strokeWidth={1.4} strokeLinecap="round" />)}
          <rect x={-15} y={-37} width={30} height={13} fill={BLANCO} opacity={0.95} />
          <path d="M-10 -33 H6 M-10 -28 H2" stroke={C.indigo[2]} strokeWidth={1.4} strokeLinecap="round" />
          <rect x={-10} y={-20} width={4} height={48} rx={2} fill={BLANCO} opacity={0.6} />
        </g>
        {/* Orina */}
        <g transform="translate(164 80)">
          <path d="M-26 -26 H26 L22 30 C21 36 18 38 14 38 H-14 C-18 38 -21 36 -22 30Z" fill={C.vidrio[1]} />
          <path d="M-24.4 -4 H24.4 L22 30 C21 36 18 38 14 38 H-14 C-18 38 -21 36 -22 30Z" fill={C.amarillo[1]} />
          <path d="M8 -4 H24.4 L22 30 C21 36 18 38 14 38 H6 C16 26 16 10 8 -4Z" fill={C.amarillo[0]} opacity={0.55} />
          <ellipse cy={-4} rx={24.4} ry={3.4} fill={C.amarillo[2]} />
          {[[-12, 10, 2.2], [-6, 22, 1.6], [10, 16, 1.8], [-14, 28, 1.4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={BLANCO} opacity={0.8} />)}
          {[0, 8, 16, 24].map((y) => <path key={y} d={`M-21 ${y} H-16`} stroke={C.indigo[2]} strokeWidth={1.2} strokeLinecap="round" opacity={0.8} />)}
          <rect x={-2} y={4} width={20} height={14} rx={2} fill={BLANCO} opacity={0.92} />
          <path d="M2 9 H14 M2 13.5 H10" stroke={C.indigo[2]} strokeWidth={1.3} strokeLinecap="round" />
          <rect x={-30} y={-38} width={60} height={13} rx={5} fill={C.azul[0]} />
          <rect x={-30} y={-40} width={60} height={10} rx={5} fill={C.azul[1]} />
          {[-20, -10, 0, 10, 20].map((x) => <path key={x} d={`M${x} -38 L${x} -31`} stroke={C.azul[0]} strokeWidth={1.4} strokeLinecap="round" />)}
          <rect x={-19} y={-20} width={4} height={44} rx={2} fill={BLANCO} opacity={0.6} />
        </g>
        {/* Lo que se reparte */}
        <g transform="translate(108 26)">
          <polygon points={hex} fill={C.verde[0]} transform="translate(.8 1)" />
          <polygon points={hex} fill={C.verde[1]} />
          <circle cx={0} cy={-9} r={2.4} fill={C.rojo[1]} />
          <circle cx={-3} cy={-3} r={1.6} fill={BLANCO} />
        </g>
        {[[98, 62, 5.4], [106, 57, 5], [110, 65, 5.6], [101, 70, 4.6], [114, 72, 4.2]].map(([x, y, r], i) => <Bola key={i} x={x} y={y} r={r} c={C.morado} brillo={i < 2} />)}
        <Bola x={128} y={44} r={4.4} c={C.azul} />
        <Bola x={92} y={44} r={3.6} c={C.cian} />
        <Bola x={124} y={92} r={3.8} c={C.naranja} />
        <Bola x={104} y={98} r={3.2} c={C.azul} />
      </>
    );
  },

  /* Nefrona entera por segmentos: arteriolas aferente y eferente, ovillo capilar en la
     cápsula de Bowman, túbulo proximal con su ribete en cepillo, asa delgada, rama gruesa,
     túbulo distal, colector y vasos rectos. */
  'nefron-interactivo': () => (
    <>
      <Suelo x={112} rx={92} />
      {/* Vasos rectos */}
      <path d="M86 72 L86 114 C86 118 88 120 90 120.5" fill="none" stroke={C.rojo[1]} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M90 120.5 C92 120 94 118 94 114 L94 72" fill="none" stroke={C.azul[1]} strokeWidth={2.4} strokeLinecap="round" />
      {/* Colector */}
      <Tubo d="M186 8 L186 124" w={14} c={C.azul} />
      {[78, 96, 112].map((y) => <path key={y} d={`M182 ${y - 3} L186 ${y + 1} L190 ${y - 3}`} fill="none" stroke={BLANCO} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />)}
      {/* Distal */}
      <Tubo d="M130 62 C130 46 146 42 152 54 C158 66 166 62 170 52 C172 46 176 44 186 46" w={8} c={C.cian} />
      {/* Rama gruesa ascendente */}
      <Tubo d="M130 106 L130 62" w={8} c={C.verde} />
      {/* Asa delgada */}
      <Tubo d="M108 72 L108 112 C108 122 130 122 130 106" w={5} c={C.naranja} />
      {/* Proximal con ribete en cepillo */}
      <Tubo d="M64 48 C78 28 92 60 104 42 C114 28 128 40 122 54 C118 62 108 60 108 72" w={11} c={C.amarillo} luz={false} />
      <path d="M64 48 C78 28 92 60 104 42 C114 28 128 40 122 54 C118 62 108 60 108 72" fill="none" stroke={C.amarillo[2]} strokeWidth={3} strokeDasharray="1.4 2.2" transform="translate(-.6 -1)" />
      {/* Arteriolas */}
      <Tubo d="M4 30 C14 30 22 34 30 38" w={7} c={C.rojo} />
      <Tubo d="M30 50 C22 56 14 62 6 62" w={5} c={C.rojo} />
      {/* Bowman y glomérulo */}
      <Bola x={46} y={44} r={22} c={C.cian} brillo={false} />
      <circle cx={48} cy={44} r={17} fill={C.hueso[2]} />
      {[[54, 36], [58, 46], [52, 54], [42, 34]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.2} fill={C.amarillo[1]} />)}
      <Tubo d="M30 40 C36 30 48 30 50 38 C52 46 42 48 40 42" w={4.6} c={C.rojo} />
      <Tubo d="M32 46 C40 56 52 56 54 48 C55 42 48 42 46 46" w={4.6} c={C.rojo} />
      <Tubo d="M40 36 C46 26 60 32 56 40" w={4.2} c={C.rojo} />
      <circle cx={34} cy={32} r={2.4} fill={BLANCO} opacity={0.9} />
    </>
  ),

  /* Corazón anatómico (aurícula derecha, ventrículos, aorta con sus tres ramas, tronco
     pulmonar, cava superior, coronarias) con el sistema de conducción encendido, y la
     tira de papel milimetrado con su trazo PQRST. */
  electrocardiograma: () => {
    const corazon: Tono = ['#8E1436', '#C42739', '#EC7C78'];
    const cuerpo = 'M42 58 C38 78 58 106 100 118 C112 102 122 80 116 58 C108 46 60 42 42 58Z';
    const conduccion = 'M50 44 C58 54 66 60 74 66 L80 76 M80 76 C76 90 82 104 96 112 M80 76 C92 86 102 96 106 110 M88 98 L82 104 M96 92 L104 90 M100 104 L108 100';
    const traza = 'M138 72 H146 Q150 64 154 72 H158 L160 76 L164 42 L168 86 L171 72 H180 Q186 60 192 72 H197 Q199 68 201 72 H208';
    return (
      <>
        <Suelo x={104} rx={88} />
        <Tubo d="M88 18 L86 4" w={5} c={C.rojo} />
        <Tubo d="M97 14 L97 2" w={5} c={C.rojo} />
        <Tubo d="M106 15 L110 4" w={5} c={C.rojo} />
        <Tubo d="M52 40 L52 6" w={12} c={C.azul} />
        <Tubo d="M80 52 C78 30 84 16 98 14 C110 12 116 22 116 38" w={13} c={C.rojo} />
        <path d={cuerpo} fill={corazon[0]} />
        <path d={cuerpo} fill={corazon[1]} transform="translate(78 80) scale(.94) translate(-79 -82)" />
        <ellipse cx={46} cy={56} rx={15} ry={17} fill={corazon[0]} />
        <ellipse cx={45} cy={54} rx={13} ry={15} fill={corazon[1]} />
        <ellipse cx={114} cy={56} rx={8} ry={6} fill={corazon[0]} transform="rotate(-20 114 56)" />
        <Tubo d="M96 60 C94 44 86 36 70 36" w={11} c={C.azul} />
        <g fill="none" stroke={corazon[2]} strokeWidth={2} strokeLinecap="round">
          <path d="M92 62 C96 78 98 96 100 114" />
          <path d="M94 74 C104 78 108 86 110 94" />
          <path d="M66 64 C56 74 58 92 72 104" />
        </g>
        <path d={conduccion} fill="none" stroke={C.amarillo[2]} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        <path d={conduccion} fill="none" stroke={C.amarillo[1]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <Bola x={50} y={44} r={4.2} c={C.amarillo} />
        <Bola x={74} y={66} r={3.6} c={C.amarillo} />
        <ellipse cx={58} cy={40} rx={5} ry={3} fill={BLANCO} opacity={0.75} transform="rotate(-30 58 40)" />
        {/* Papel del electrocardiograma */}
        <g transform="rotate(4 172 66)">
          <rect x={134} y={37} width={78} height={62} rx={5} fill="#F2C3CC" />
          <rect x={134} y={34} width={78} height={62} rx={5} fill="#FFF5F6" />
          {Array.from({ length: 19 }, (_, i) => 138 + i * 4).map((x, i) => (
            <path key={x} d={`M${x} 38 V92`} stroke={i % 5 === 0 ? '#F3A6B4' : '#FBD8DE'} strokeWidth={i % 5 === 0 ? 0.9 : 0.5} />
          ))}
          {Array.from({ length: 14 }, (_, i) => 40 + i * 4).map((y, i) => (
            <path key={y} d={`M137 ${y} H209`} stroke={i % 5 === 0 ? '#F3A6B4' : '#FBD8DE'} strokeWidth={i % 5 === 0 ? 0.9 : 0.5} />
          ))}
          <path d={traza} fill="none" stroke={C.indigo[0]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </>
    );
  },

  /* El extendido: la lámina con su rótulo, el portaobjetos que arrastra la gota, el
     frotis con su cuerpo y su borde en pluma, y el zoom de ese borde en el microscopio. */
  'frotis-sanguineo': () => (
    <>
      <Suelo x={100} rx={92} />
      <g transform="rotate(-6 100 84)">
        <rect x={10} y={72} width={164} height={40} rx={5} fill={C.vidrio[0]} />
        <rect x={10} y={68} width={164} height={38} rx={5} fill={C.vidrio[1]} />
        <rect x={16} y={73} width={32} height={28} rx={2.5} fill={BLANCO} />
        <path d="M21 80 H42 M21 86 H38 M21 92 H40" stroke={C.indigo[2]} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M60 74 H138 C152 74 160 80 160 87 C160 94 152 100 138 100 H60Z" fill={C.rosa[1]} />
        <path d="M60 74 H94 C102 74 102 100 94 100 H60Z" fill={C.rosa[0]} opacity={0.6} />
        <path d="M146 76 C154 80 156 86 152 94 M140 75 C148 80 150 88 145 98" fill="none" stroke={C.rosa[2]} strokeWidth={1.2} strokeLinecap="round" />
        {[[76, 80], [86, 92], [104, 80], [112, 92], [122, 84], [132, 95], [128, 78], [144, 86], [96, 86]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.8} fill={C.rojo[2]} />
        ))}
        <rect x={60} y={70} width={100} height={2.2} rx={1.1} fill={BLANCO} opacity={0.85} />
      </g>
      {/* Portaobjetos que extiende */}
      <g transform="translate(64 70) rotate(-32)">
        <rect x={-4.5} y={-62} width={9} height={64} rx={2} fill={C.vidrio[0]} />
        <rect x={-4.5} y={-62} width={7} height={62} rx={2} fill={C.vidrio[1]} />
        <rect x={-2.5} y={-56} width={2} height={50} rx={1} fill={BLANCO} opacity={0.8} />
      </g>
      <ellipse cx={62} cy={74} rx={7} ry={3} fill={C.rojo[1]} />
      {/* Zoom del borde en pluma */}
      <polygon points="150,80 152,52 196,62" fill="#9AA9C2" opacity={0.22} />
      <Lente x={176} y={38} r={30}>
        {[[-15, -12], [1, -19], [16, -10], [-20, 6], [18, 8], [-8, 19], [9, 19], [-12, -1]].map(([dx, dy], i) => (
          <Hematie key={i} x={176 + dx} y={38 + dy} r={5.6} rot={i * 40} />
        ))}
        <Neutrofilo x={180} y={41} r={9} />
        {[[166, 30], [190, 26], [170, 50]].map(([x, y], i) => <Plaqueta key={i} x={x} y={y} s={0.4} />)}
      </Lente>
    </>
  ),

  /* Tubo de tapa lila (EDTA) rotulado y las células que cuenta el hemograma: hematíes,
     neutrófilo, linfocito, monocito, eosinófilo y plaquetas. */
  hemograma: () => (
    <>
      <Suelo rx={94} />
      <g transform="translate(30 64) rotate(-4)">
        <path d="M-13 -40 H13 V36 A13 13 0 0 1 -13 36Z" fill={C.vidrio[1]} />
        <path d="M-13 -8 H13 V36 A13 13 0 0 1 -13 36Z" fill={C.rojo[1]} />
        <path d="M3 -8 H13 V36 A13 13 0 0 1 2 48.8 C9 38 9 20 3 -8Z" fill={C.rojo[0]} opacity={0.6} />
        <ellipse cy={-8} rx={13} ry={3} fill={C.rojo[2]} />
        <rect x={-16} y={-56} width={32} height={19} rx={5} fill={C.morado[0]} />
        <rect x={-16} y={-58} width={32} height={15} rx={5} fill={C.morado[1]} />
        <rect x={-11} y={-56} width={14} height={2.4} rx={1.2} fill={C.morado[2]} />
        <rect x={-13} y={-34} width={26} height={22} fill={BLANCO} opacity={0.95} />
        {[-10, -8, -5, -4, -1, 1, 3, 6, 7, 9].map((x, i) => <path key={i} d={`M${x} -31 V-21`} stroke={C.indigo[0]} strokeWidth={i % 3 ? 1 : 1.8} />)}
        <path d="M-10 -16 H6" stroke={C.indigo[2]} strokeWidth={1.3} strokeLinecap="round" />
        <rect x={-9} y={-6} width={3.6} height={38} rx={1.8} fill={BLANCO} opacity={0.6} />
      </g>
      <Hematie x={74} y={34} r={14} rot={-20} />
      <Hematie x={78} y={96} r={13} rot={20} aplanado={0.5} />
      <Hematie x={60} y={66} r={9} rot={10} aplanado={0.85} />
      <Neutrofilo x={112} y={60} r={17} />
      <Linfocito x={150} y={28} r={13} />
      <Monocito x={160} y={82} r={19} />
      <Eosinofilo x={200} y={44} r={14} />
      <Plaqueta x={136} y={50} />
      <Plaqueta x={122} y={100} s={0.9} />
      <Plaqueta x={200} y={102} />
      <Plaqueta x={190} y={74} s={0.8} />
    </>
  ),

  /* Ocho hematíes: normal, drepanocito, dianocito, esferocito, esquistocito, acantocito,
     dacriocito y uno con cuerpo de Howell-Jolly. */
  'morfologia-globulos-rojos': () => {
    const hoz = 'M-22 7 C-14 -16 14 -16 22 7 C12 -3 -12 -3 -22 7Z';
    const casco = 'M-17 5 C-17 -14 17 -14 17 5 C12 3 8 5 4 11 C0 5 -6 3 -10 7 C-13 7 -15 6 -17 5Z';
    const gota = 'M0 -20 C3 -12 15 -8 15 4 A15 15 0 0 1 -15 4 C-15 -8 -3 -12 0 -20Z';
    const X = [32, 84, 136, 188];
    return (
      <>
        <Suelo rx={96} />
        <Hematie x={X[0]} y={36} r={17} rot={-10} />
        <g transform={`translate(${X[1]} 40) rotate(-18)`}>
          <path d={hoz} fill={C.rojo[0]} transform="scale(1.1)" />
          <path d={hoz} fill={C.rojo[1]} transform="translate(-.8 -1.6)" />
          <path d="M-10 -8 C-4 -11 4 -11 10 -8" stroke={C.rojo[2]} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </g>
        <g transform={`translate(${X[2]} 36)`}>
          <circle r={17} fill={C.rojo[0]} />
          <circle cx={-1.4} cy={-1.4} r={15.4} fill={C.rojo[1]} />
          <circle r={10.5} fill={C.rojo[2]} />
          <circle r={5.6} fill={C.rojo[1]} />
          <circle cx={-1.5} cy={-1.5} r={1.8} fill={BLANCO} opacity={0.85} />
        </g>
        <Bola x={X[3]} y={36} r={14} c={C.rojo} />
        <g transform={`translate(${X[0]} 96)`}>
          <path d={casco} fill={C.rojo[0]} />
          <path d={casco} fill={C.rojo[1]} transform="translate(-.6 -1.2) scale(.9)" />
          <path d="M-9 -6 C-4 -9 4 -9 9 -6" stroke={C.rojo[2]} strokeWidth={2} fill="none" strokeLinecap="round" />
        </g>
        <g transform={`translate(${X[1]} 94)`}>
          {Array.from({ length: 10 }, (_, i) => {
            const a = i * 36 + (i % 3) * 8;
            const [px, py] = polar(0, 0, i % 2 ? 17 : 19, a);
            return <path key={i} d={`M0 0 L${px.toFixed(1)} ${py.toFixed(1)}`} stroke={C.rojo[0]} strokeWidth={4.4} strokeLinecap="round" />;
          })}
          <Bola x={0} y={0} r={14} c={C.rojo} />
        </g>
        <g transform={`translate(${X[2]} 96) rotate(30)`}>
          <path d={gota} fill={C.rojo[0]} />
          <path d={gota} fill={C.rojo[1]} transform="translate(-.6 -.8) scale(.9)" />
          <circle cx={0} cy={4} r={7} fill={C.rojo[2]} />
          <circle cx={0.6} cy={4.6} r={5.4} fill={C.rojo[0]} />
        </g>
        <Hematie x={X[3]} y={94} r={17} rot={15} />
        <Bola x={X[3] + 8} y={88} r={3.6} c={C.indigo} />
      </>
    );
  },

  /* Microscopio con todas sus piezas (base, foco, condensador, platina con la lámina,
     revólver con tres objetivos de color, cabezal binocular, tornillos) y lo que se ve
     en el campo: médula ósea con neutrófilo, cayado, mielocito, eritroblasto y linfocito. */
  'microscopio-hematologia': () => (
    <>
      <Suelo x={104} rx={94} />
      <Tubo d="M94 108 C102 90 106 70 96 50 C92 42 88 38 82 34" w={15} c={C.indigo} />
      <rect x={24} y={108} width={84} height={14} rx={7} fill={C.indigo[0]} />
      <rect x={24} y={106} width={82} height={12} rx={6} fill={C.indigo[1]} />
      <rect x={32} y={108} width={36} height={2.4} rx={1.2} fill={C.indigo[2]} />
      <circle cx={58} cy={100} r={9} fill={C.amarillo[2]} opacity={0.55} />
      <Bola x={58} y={100} r={5} c={C.amarillo} />
      <rect x={52} y={86} width={12} height={8} rx={2} fill={C.azul[0]} />
      <rect x={28} y={78} width={66} height={9} rx={3} fill={C.azul[0]} />
      <rect x={28} y={77} width={64} height={7} rx={3} fill={C.azul[1]} />
      <rect x={38} y={73.5} width={40} height={4} rx={1} fill={C.vidrio[0]} />
      <rect x={52} y={73.5} width={16} height={4} rx={1} fill={C.rosa[1]} />
      <path d="M34 76 L44 72 M86 76 L76 72" stroke={C.hueso[0]} strokeWidth={2} strokeLinecap="round" />
      {[[48, 12, C.rojo, 12], [58, 18, C.amarillo, 0], [68, 14, C.azul, -12]].map(([x, h, c, rot]) => (
        <g key={x as number} transform={`rotate(${rot} 58 52)`}>
          <rect x={(x as number) - 3} y={53} width={6} height={h as number} rx={1.5} fill={C.indigo[1]} />
          <rect x={(x as number) - 3} y={58} width={6} height={2.6} fill={(c as Tono)[1]} />
          <rect x={(x as number) - 2} y={52 + (h as number)} width={4} height={2.4} rx={1} fill={C.cian[0]} />
        </g>
      ))}
      <ellipse cx={58} cy={52} rx={15} ry={5} fill={C.azul[0]} />
      <ellipse cx={57} cy={51} rx={13} ry={3.6} fill={C.azul[1]} />
      <rect x={42} y={30} width={46} height={20} rx={6} fill={C.azul[0]} />
      <rect x={42} y={30} width={44} height={17} rx={6} fill={C.azul[1]} />
      <rect x={46} y={33} width={20} height={2.4} rx={1.2} fill={C.azul[2]} />
      <Tubo d="M56 32 L44 12" w={8} c={C.azul} />
      <Tubo d="M66 32 L56 10" w={8} c={C.azul} />
      <circle cx={43.5} cy={11} r={4.6} fill={C.indigo[0]} />
      <circle cx={55.5} cy={9} r={4.6} fill={C.indigo[0]} />
      <Bola x={100} y={72} r={9} c={C.amarillo} />
      <Bola x={100} y={72} r={4.4} c={C.naranja} brillo={false} />
      <Lente x={168} y={62} r={40}>
        <Hematie x={146} y={38} r={6} rot={20} />
        <Hematie x={198} y={46} r={5} rot={60} />
        <Hematie x={150} y={88} r={6} rot={-30} />
        <Hematie x={188} y={92} r={5.4} rot={0} />
        <Neutrofilo x={150} y={62} r={11} />
        <Neutrofilo x={192} y={68} r={10} banda />
        <g>
          <Bola x={172} y={38} r={12} c={C.salmon} brillo={false} />
          {[[-6, 6], [4, 7], [8, -2], [-2, 9], [6, 4]].map(([a, b], i) => <circle key={i} cx={172 + a} cy={38 + b} r={1.3} fill={C.magenta[1]} />)}
          <Bola x={168} y={36} r={6.5} c={C.morado} />
        </g>
        <g>
          <Bola x={170} y={92} r={9} c={['#3F55A8', '#8FA6E0', BLANCO]} brillo={false} />
          <Bola x={170} y={92} r={5.4} c={C.indigo} />
        </g>
        <Linfocito x={168} y={66} r={8} />
      </Lente>
    </>
  ),

  /* El coágulo: red de fibrina con sus hilos finos y entrecruzamientos, hematíes
     atrapados y plaquetas activadas con seudópodos. */
  'cascada-coagulacion': () => {
    const hilo = (d: string, k: number, w = 5.2) => (
      <g key={k} fill="none" strokeLinecap="round">
        <path d={d} stroke={C.amarillo[0]} strokeWidth={w} />
        <path d={d} stroke={C.amarillo[2]} strokeWidth={w * 0.5} transform="translate(-.4 -.6)" />
      </g>
    );
    const fino = ['M24 60 C60 64 90 40 120 30', 'M70 110 C90 90 130 92 160 70', 'M140 20 C150 50 170 60 200 60', 'M36 30 C48 50 52 80 44 108', 'M90 100 C120 110 160 108 196 96'];
    return (
      <>
        <Suelo rx={88} />
        {fino.map((d) => <path key={d} d={d} fill="none" stroke={C.hueso[0]} strokeWidth={1.4} strokeLinecap="round" />)}
        {['M14 40 C70 30 120 90 206 70', 'M30 108 C80 70 140 30 196 22', 'M50 12 C64 60 110 90 150 120', 'M180 10 C170 50 150 90 160 124'].map((d, i) => hilo(d, i))}
        <Hematie x={62} y={60} r={19} rot={-25} aplanado={0.9} />
        <Hematie x={134} y={46} r={16} rot={30} aplanado={0.72} />
        <Hematie x={110} y={92} r={15} />
        <Hematie x={176} y={88} r={13} rot={-40} aplanado={0.6} />
        <Hematie x={34} y={96} r={11} rot={40} aplanado={0.7} />
        {['M20 76 C80 92 140 76 200 100', 'M98 10 C96 50 118 80 176 112', 'M160 18 C150 56 100 76 40 92', 'M10 54 C40 40 60 20 90 16'].map((d, i) => hilo(d, i + 4, 4.4))}
        {[[93, 43], [128, 74], [70, 80], [155, 58], [118, 26], [52, 44]].map(([x, y], i) => <Bola key={i} x={x} y={y} r={2.6} c={C.amarillo} brillo={false} />)}
        <PlaquetaActiva x={88} y={24} />
        <PlaquetaActiva x={170} y={30} s={0.9} />
        <PlaquetaActiva x={146} y={106} s={0.85} />
        <PlaquetaActiva x={30} y={22} s={0.75} />
        <PlaquetaActiva x={200} y={70} s={0.7} />
      </>
    );
  },

  /* Polígono de Willis visto desde abajo: el anillo con sus comunicantes, las carótidas
     cortadas, cerebrales anteriores, medias (con sus ramas) y posteriores, basilar con sus
     ramas pontinas, cerebelosas superiores, AICA, vertebrales y PICA. */
  'poligono-willis': () => {
    const v = (d: string, w: number) => <Tubo d={d} w={w} c={C.rojo} />;
    const lado = (
      <g>
        {v('M102 34 C98 22 104 14 96 4', 6)}
        {v('M82 54 C68 50 60 58 48 54', 7)}
        {v('M48 54 C40 50 34 40 24 38', 4.6)}
        {v('M48 54 C40 58 30 58 18 64', 4.6)}
        {v('M60 56 C58 64 52 70 46 72', 3.2)}
        {v('M90 78 C78 86 66 84 56 92', 6)}
        {v('M56 92 C48 98 40 96 30 102', 4.2)}
        {v('M56 92 C52 100 50 108 42 114', 3.8)}
        {v('M108 88 C98 92 88 94 78 100', 4)}
        {v('M109 101 C100 104 92 108 84 112', 3.4)}
        {v('M110 95 L101 96', 2.4)}
        {v('M110 106 C106 112 100 116 96 126', 9)}
        {v('M101 116 C92 118 86 122 80 126', 3.2)}
      </g>
    );
    return (
      <>
        <Suelo rx={56} y={125} />
        {lado}
        <g transform="translate(220 0) scale(-1 1)">{lado}</g>
        {v('M110 84 C108 94 112 100 110 106', 10)}
        {v('M102 34 Q110 30 118 34 Q132 42 138 54 Q138 68 130 78 Q110 86 90 78 Q82 68 82 54 Q88 42 102 34Z', 7)}
        {[80, 140].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={56} rx={7.5} ry={6.5} fill={C.rojo[0]} />
            <ellipse cx={x} cy={56} rx={4} ry={3.4} fill={C.rosa[2]} />
          </g>
        ))}
      </>
    );
  },

  /* Tronco encefálico por delante: pedúnculos con los tubérculos mamilares, protuberancia
     con sus fibras y la basilar, bulbo con pirámides, olivas y decusación, el cerebelo
     asomando y los pares craneales que salen de cada nivel. */
  'tronco-encefalico': () => {
    const tronco = 'M78 8 C84 20 92 28 90 38 C68 40 64 68 88 72 C92 86 96 100 100 112 L101 126 L119 126 L120 112 C124 100 128 86 132 72 C156 68 152 40 130 38 C128 28 136 20 142 8 C130 6 118 14 110 26 C102 14 90 6 78 8Z';
    const atras = (
      <g>
        <Tubo d="M104 30 C98 34 92 34 84 30" w={3.6} c={C.amarillo} luz={false} />
        <Tubo d="M86 24 C80 22 74 24 64 20" w={2.4} c={C.amarillo} luz={false} />
        <Tubo d="M74 54 C64 52 56 54 44 50" w={6.5} c={C.amarillo} />
        <Tubo d="M84 72 C74 72 66 74 56 72" w={3.6} c={C.amarillo} luz={false} />
        <Tubo d="M84 77 C74 79 66 81 54 82" w={4.2} c={C.amarillo} luz={false} />
        <Tubo d="M92 86 C86 87 80 87 72 86" w={3} c={C.amarillo} luz={false} />
        <Tubo d="M93 91 C87 92 81 92 74 91" w={2.6} c={C.amarillo} luz={false} />
      </g>
    );
    return (
      <>
        <Suelo rx={56} y={126} />
        {[84, 136].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={102} rx={21} ry={14} fill={C.cerebelo[0]} />
            <ellipse cx={x - 1} cy={100.5} rx={19} ry={12} fill={C.cerebelo[1]} />
            {[96, 101, 106].map((y) => <path key={y} d={`M${x - 16} ${y} Q${x} ${y - 4} ${x + 16} ${y}`} stroke={C.cerebelo[0]} strokeWidth={1.2} fill="none" />)}
          </g>
        ))}
        {atras}
        <g transform="translate(220 0) scale(-1 1)">{atras}</g>
        <path d={tronco} fill={C.rosa[0]} />
        <path d={tronco} fill={C.rosa[1]} transform="translate(109 66) scale(.93) translate(-110 -68)" />
        <g fill="none" stroke={C.rosa[2]} strokeWidth={2} strokeLinecap="round" opacity={0.9}>
          <path d="M78 46 C96 42 124 42 142 46" />
          <path d="M76 55 C96 51 124 51 144 55" />
          <path d="M78 63 C96 60 124 60 142 63" />
        </g>
        <path d="M104 76 C102 88 102 100 104 110 M116 76 C118 88 118 100 116 110" stroke={C.rosa[2]} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
        <ellipse cx={94} cy={90} rx={4.6} ry={9} fill={C.rosa[2]} />
        <ellipse cx={126} cy={90} rx={4.6} ry={9} fill={C.rosa[2]} />
        <path d="M104 110 L116 118 M116 110 L104 118" stroke={C.rosa[0]} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M110 76 L110 124" stroke={C.rosa[0]} strokeWidth={2} strokeLinecap="round" />
        <Tubo d="M110 74 L110 40" w={5.4} c={C.rojo} />
        <Tubo d="M110 40 C104 36 98 36 90 38 M110 40 C116 36 122 36 130 38" w={3.4} c={C.rojo} luz={false} />
        <Tubo d="M110 74 C106 80 104 86 102 94 M110 74 C114 80 116 86 118 94" w={3.6} c={C.rojo} luz={false} />
        <Bola x={105} y={22} r={3.4} c={C.rosa} />
        <Bola x={115} y={22} r={3.4} c={C.rosa} />
        <circle cx={86} cy={16} r={2.4} fill={BLANCO} opacity={0.85} />
      </>
    );
  },

  /* El ojo con sus seis músculos: cuatro rectos, el oblicuo superior que pasa por la
     tróclea y el oblicuo inferior por debajo; iris con su collarete y vasos en la esclera. */
  'biomecanica-extraocular': () => (
    <>
      <Suelo x={112} rx={50} />
      <Musculo d="M30 30 C44 22 56 16 66 14" w={9} />
      <Musculo d="M48 114 C70 120 98 112 124 96" w={9} />
      <Musculo d="M112 34 C110 22 106 12 100 2" w={12} />
      <Musculo d="M112 98 C112 108 110 116 106 126" w={12} />
      <Musculo d="M144 66 C166 64 186 62 208 58" w={12} />
      <Musculo d="M80 66 C58 68 38 68 16 72" w={12} />
      <Tubo d="M70 14 C84 16 96 26 104 36" w={4} c={C.hueso} luz={false} />
      <circle cx={70} cy={14} r={5.4} fill="none" stroke={C.hueso[0]} strokeWidth={3.4} />
      <circle cx={69.4} cy={13.4} r={5.4} fill="none" stroke={C.hueso[1]} strokeWidth={1.6} />
      <Bola x={112} y={66} r={34} c={['#B9C8DE', '#F4F7FF', BLANCO]} brillo={false} />
      <g fill="none" stroke="#E2828E" strokeWidth={1.1} strokeLinecap="round">
        <path d="M84 56 C88 58 90 54 94 57 M86 80 C90 78 92 82 96 79" />
        <path d="M140 52 C136 55 138 58 134 60 M142 82 C138 80 137 84 133 82" />
      </g>
      <circle cx={122} cy={68} r={15} fill={C.azul[0]} />
      <circle cx={121} cy={67} r={13.4} fill={C.azul[1]} />
      {Array.from({ length: 18 }, (_, i) => {
        const [x1, y1] = polar(122, 68, 7.4, i * 20);
        const [x2, y2] = polar(122, 68, 13, i * 20);
        return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={C.azul[2]} strokeWidth={1} opacity={0.75} />;
      })}
      <circle cx={122} cy={68} r={8.6} fill="none" stroke={C.azul[0]} strokeWidth={1.2} />
      <circle cx={122} cy={68} r={6} fill={C.indigo[0]} />
      <circle cx={117} cy={63} r={3} fill={BLANCO} />
      <circle cx={127} cy={73} r={1.3} fill={BLANCO} opacity={0.8} />
      <path d="M86 42 C92 36 100 33 108 32" stroke={BLANCO} strokeWidth={3} fill="none" strokeLinecap="round" />
    </>
  ),

  /* Corte transversal: meninges, sustancia blanca con sus tractos (cordones posteriores,
     corticoespinal lateral y anterior, espinotalámico), sustancia gris en mariposa con la
     gelatinosa y las motoneuronas, conducto central, raíces con el ganglio y arterias. */
  'medula-espinal': () => {
    const gris = 'M110 54 C104 42 96 30 86 22 C79 26 84 42 93 53 C80 58 66 66 66 82 C72 94 88 88 100 76 L110 74 L120 76 C132 88 148 94 154 82 C154 66 140 58 127 53 C136 42 141 26 134 22 C124 30 116 42 110 54Z';
    const raices = (
      <g>
        <Tubo d="M28 42 C20 50 14 58 6 66" w={7} c={C.amarillo} />
        <Tubo d="M86 100 C64 102 40 78 28 44" w={4.4} c={C.amarillo} luz={false} />
        <Tubo d="M84 22 C66 16 52 22 38 30" w={5} c={C.amarillo} luz={false} />
        <Bola x={33} y={35} r={9} c={C.amarillo} />
        {[[30, 33], [35, 38], [36, 31]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.4} fill={C.amarillo[0]} />)}
      </g>
    );
    const tractos = (
      <g>
        <ellipse cx={66} cy={54} rx={8} ry={11} fill={C.naranja[2]} />
        <ellipse cx={64} cy={86} rx={7} ry={8} fill={C.verde[2]} />
        <ellipse cx={101} cy={100} rx={4.4} ry={5.4} fill={C.naranja[2]} />
        <Bola x={96} y={17} r={2.6} c={C.rojo} brillo={false} />
      </g>
    );
    return (
      <>
        <Suelo rx={64} />
        <ellipse cx={110} cy={62} rx={70} ry={54} fill="none" stroke={C.morado[2]} strokeWidth={3} />
        <ellipse cx={110} cy={62} rx={66} ry={50} fill="none" stroke={C.morado[2]} strokeWidth={1.1} strokeDasharray="3 3" opacity={0.8} />
        {raices}
        <g transform="translate(220 0) scale(-1 1)">{raices}</g>
        <ellipse cx={110} cy={62} rx={60} ry={46} fill={C.hueso[0]} />
        <ellipse cx={108} cy={60} rx={56} ry={42} fill={C.hueso[1]} />
        <path d="M100 18 C104 30 106 40 110 50 C114 40 116 30 120 18 C114 16 106 16 100 18Z" fill={C.azul[2]} />
        <path d="M110 18 L110 50 M104 19 C105 28 107 36 109 44 M116 19 C115 28 113 36 111 44" stroke={C.azul[1]} strokeWidth={0.9} fill="none" />
        {tractos}
        <g transform="translate(220 0) scale(-1 1)">{tractos}</g>
        <path d={gris} fill={C.magenta[0]} />
        <path d={gris} fill={C.rosa[1]} transform="translate(109 56) scale(.9) translate(-110 -57)" />
        <ellipse cx={86} cy={24} rx={5.6} ry={4} fill={C.rosa[2]} />
        <ellipse cx={134} cy={24} rx={5.6} ry={4} fill={C.rosa[2]} />
        {[[76, 80], [83, 84], [79, 74], [144, 80], [137, 84], [141, 74]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.9} fill={C.morado[0]} />)}
        <circle cx={110} cy={64} r={3.4} fill={C.indigo[1]} />
        <path d="M110 100 L110 107" stroke={C.hueso[0]} strokeWidth={4} strokeLinecap="round" />
        <Bola x={110} y={110} r={4} c={C.rojo} />
        <circle cx={78} cy={34} r={2.6} fill={BLANCO} opacity={0.9} />
      </>
    );
  },

  /* EVA 2 (ojo, oído, columna): vértebra vista desde arriba con cuerpo trabecular,
     pedículos, láminas, carillas articulares, transversas y espinosa; el oído interno
     (cóclea y conductos semicirculares) y dos chinchetas de identificación. */
  'eva-2': () => {
    const vertebra = 'M84 82 C80 70 80 60 84 54 L56 44 C48 42 48 34 56 34 L88 44 C94 40 100 38 104 36 L104 14 C104 7 116 7 116 14 L116 36 C120 38 126 40 132 44 L164 34 C172 34 172 42 164 44 L136 54 C140 60 140 70 136 82Z';
    const cuerpo = 'M64 98 C64 78 92 74 110 79 C128 74 156 78 156 98 C156 116 132 122 110 120 C88 122 64 116 64 98Z';
    const espiral = Array.from({ length: 60 }, (_, i) => {
      const t = (i / 59) * Math.PI * 5;
      const r = 15 - (i / 59) * 12;
      return `${i ? 'L' : 'M'}${(188 + r * Math.cos(t)).toFixed(1)} ${(96 + r * Math.sin(t)).toFixed(1)}`;
    }).join(' ');
    return (
      <>
        <Suelo x={116} rx={90} />
        <g transform="translate(-16 0)">
          <path d={vertebra} fill={C.hueso[0]} />
          <path d={vertebra} fill={C.hueso[1]} transform="translate(-1 -1.4)" />
          <path d="M110 47 C122 48 131 58 130 72 C126 77 94 77 90 72 C89 58 98 48 110 47Z" fill="#1B2547" opacity={0.2} />
          <ellipse cx={92} cy={46} rx={6.5} ry={4.5} fill={C.hueso[0]} />
          <ellipse cx={91} cy={45} rx={4.6} ry={3} fill={C.hueso[2]} />
          <ellipse cx={128} cy={46} rx={6.5} ry={4.5} fill={C.hueso[0]} />
          <ellipse cx={127} cy={45} rx={4.6} ry={3} fill={C.hueso[2]} />
          <path d="M107 16 L107 34" stroke={C.hueso[2]} strokeWidth={2} strokeLinecap="round" />
          <path d={cuerpo} fill={C.hueso[0]} />
          <path d={cuerpo} fill={C.hueso[1]} transform="translate(109 97) scale(.95) translate(-110 -98)" />
          <path d={cuerpo} fill={C.hueso[2]} transform="translate(109 98) scale(.8) translate(-110 -98)" />
          {[[84, 96], [94, 104], [104, 94], [114, 104], [124, 96], [134, 104], [100, 100], [120, 92], [88, 106], [130, 92], [110, 108], [140, 99]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.5} fill={C.hueso[0]} opacity={0.7} />
          ))}
          <path d="M78 90 C92 84 112 83 128 86" stroke={BLANCO} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
        {/* Oído interno */}
        <Tubo d="M176 84 C170 70 166 58 174 50 C182 44 190 52 186 62" w={4.2} c={C.morado} luz={false} />
        <Tubo d="M182 82 C186 68 196 58 204 64 C210 70 204 80 196 78" w={4.2} c={C.morado} luz={false} />
        <Tubo d="M178 80 C168 82 160 78 162 70 C164 64 172 66 174 72" w={4.2} c={C.morado} luz={false} />
        <Bola x={180} y={84} r={6.6} c={C.morado} brillo={false} />
        <Tubo d={espiral} w={5.4} c={C.rosa} />
        <Pin x={150} y={38} letra="A" />
        <Pin x={70} y={100} c={C.cian} letra="B" />
      </>
    );
  },

  /* EVA 3 (encéfalo): el hemisferio con sus surcos (central y lateral marcados) y la
     circunvolución precentral, el cerebelo con sus folias, el tronco y dos chinchetas. */
  'eva-3': () => {
    const cerebro = 'M46 70 C38 40 68 16 108 16 C148 14 180 34 180 62 C180 80 168 88 152 86 C142 96 118 96 108 88 C92 96 58 94 46 70Z';
    const surcos = [
      'M58 50 C66 44 74 46 82 40', 'M54 62 C64 58 72 60 80 56', 'M66 30 C72 36 80 34 88 30', 'M80 22 C84 30 90 30 96 26',
      'M106 18 C102 30 106 38 98 50', 'M134 20 C130 30 134 40 126 50 C122 56 124 62 118 66',
      'M148 30 C144 40 152 46 146 56', 'M162 42 C158 50 166 56 162 66', 'M174 56 C168 62 172 70 166 76',
      'M84 82 C100 78 120 80 140 76', 'M98 89 C110 87 126 87 142 83', 'M150 70 C156 74 160 72 166 78',
    ];
    return (
      <>
        <Suelo rx={66} />
        <Tubo d="M126 88 C126 100 124 110 122 124" w={14} c={C.rosa} luz={false} />
        <ellipse cx={127} cy={100} rx={9} ry={6} fill={C.rosa[0]} />
        <ellipse cx={152} cy={94} rx={26} ry={16} fill={C.cerebelo[0]} />
        <ellipse cx={150} cy={92} rx={23} ry={13.5} fill={C.cerebelo[1]} />
        <g fill="none" stroke={C.cerebelo[0]} strokeWidth={1.4} strokeLinecap="round">
          {[84, 89, 94, 99, 104].map((y) => <path key={y} d={`M${132 - (y - 94) * 0.4} ${y} C142 ${y - 4} 160 ${y - 4} ${172 - Math.abs(y - 94) * 0.3} ${y}`} />)}
        </g>
        <path d={cerebro} fill={C.rosa[0]} />
        <path d={cerebro} fill={C.rosa[1]} transform="translate(112 54) scale(.94) translate(-113 -56)" />
        <path d="M113 19 C109 30 113 38 106 48 C102 54 104 60 98 66" stroke={C.rosa[2]} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
        <g fill="none" stroke={C.rosa[0]} strokeWidth={2.4} strokeLinecap="round">
          {surcos.map((d) => <path key={d} d={d} />)}
        </g>
        <path d="M121 17 C117 28 121 36 113 46 C109 52 111 58 105 64" stroke={C.rosa[0]} strokeWidth={3.4} fill="none" strokeLinecap="round" />
        <path d="M72 74 C92 68 112 64 138 62" stroke={C.rosa[0]} strokeWidth={3.6} fill="none" strokeLinecap="round" />
        <path d="M60 46 C66 32 82 24 96 22" stroke={BLANCO} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.75} />
        <Pin x={118} y={44} c={C.cian} letra="A" />
        <Pin x={160} y={92} letra="B" />
      </>
    );
  },

  /* El ciclo celular: las cuatro fases en el aro con la célula de cada una (G1, S con el
     ADN que se copia, G2 más grande y M dividiéndose), los cinco puntos de control como
     señales de alto y, en el centro, el complejo ciclina–CDK. */
  'checkpoints-ciclo-celular': () => {
    const R = 42;
    const fases: [Tono, number, number][] = [[C.verde, -58, 78], [C.azul, 86, 196], [C.amarillo, 204, 244], [C.magenta, 252, 294]];
    const alto = (a: number) => {
      const [x, y] = polar(110, 64, R, a);
      const oct = Array.from({ length: 8 }, (_, i) => polar(0, 0, 7, i * 45 + 22.5).map((n) => n.toFixed(1)).join(',')).join(' ');
      return (
        <g key={a} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <polygon points={oct} fill={C.rojo[0]} transform="scale(1.15)" />
          <polygon points={oct} fill={C.rojo[1]} />
          <rect x={-4} y={-1.2} width={8} height={2.4} rx={1.2} fill={BLANCO} />
        </g>
      );
    };
    const celula = (a: number, r: number, hijo: ReactNode) => {
      const [x, y] = polar(110, 64, 24, a);
      return <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}><Bola x={0} y={0} r={r} c={C.lila} brillo={false} />{hijo}</g>;
    };
    const [px, py] = polar(110, 64, R, 298);
    return (
      <>
        <Suelo rx={54} />
        {fases.map(([c, a0, a1], i) => (
          <g key={i} fill="none" strokeLinecap="round">
            <path d={arco(110, 64, R, a0, a1)} stroke={c[0]} strokeWidth={12} />
            <path d={arco(110, 64, R, a0, a1)} stroke={c[1]} strokeWidth={7.4} transform="translate(-.5 -.7)" />
            <path d={arco(110, 64, R, a0 + 6, a1 - 6)} stroke={c[2]} strokeWidth={1.6} transform="translate(-1.2 -2)" opacity={0.8} />
          </g>
        ))}
        <path d="M-5 -7 L6 0 L-5 7" fill="none" stroke={C.magenta[0]} strokeWidth={4.2} strokeLinecap="round" strokeLinejoin="round" transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${298 + 90})`} />
        {celula(10, 8, <Bola x={0.5} y={0.5} r={3.6} c={C.amarillo} brillo={false} />)}
        {celula(140, 9.5, <><Bola x={0.5} y={0.5} r={5} c={C.amarillo} brillo={false} /><path d="M-3 -2 C-1 2 1 -2 3 2 M-3 2 C-1 -2 1 2 3 -2" stroke={C.azul[0]} strokeWidth={1} fill="none" /></>)}
        {celula(214, 11, <Bola x={0.5} y={0.5} r={6} c={C.amarillo} brillo={false} />)}
        {(() => {
          const [x, y] = polar(110, 64, 24, 286);
          return (
            <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <Bola x={-5.5} y={0} r={7} c={C.lila} brillo={false} />
              <Bola x={5.5} y={0} r={7} c={C.lila} brillo={false} />
              <path d="M-7 -3 L-4 3 M-4 -3 L-7 3 M4 -3 L7 3 M7 -3 L4 3" stroke={C.magenta[0]} strokeWidth={1.4} strokeLinecap="round" />
            </g>
          );
        })()}
        {[30, 82, 150, 248, 273].map(alto)}
        <Bola x={102} y={60} r={7.5} c={C.amarillo} />
        <Bola x={114} y={67} r={9.5} c={C.azul} />
        <circle cx={119} cy={63} r={1.8} fill={C.naranja[1]} />
      </>
    );
  },

  /* Las dos vías: a la izquierda la citocina, su receptor, las JAK que fosforilan y el
     dímero de STAT; a la derecha el TNF trimérico, su receptor, el IKK, el IκB que se va al
     proteasoma y el NF-κB libre. Las dos llegan por los poros al núcleo y se unen al ADN. */
  'vias-nfkb-jakstat': () => {
    const xs = Array.from({ length: 27 }, (_, i) => 16 + i * 7.25);
    const P = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={2.2} fill={C.naranja[1]} stroke={C.naranja[0]} strokeWidth={0.8} />;
    return (
      <>
        <Suelo x={110} rx={56} />
        {/* Membrana: bicapa */}
        <rect x={12} y={22} width={196} height={10} rx={5} fill={C.rosa[2]} opacity={0.75} />
        {xs.map((x) => (
          <g key={x}>
            <path d={`M${x - 1} 24 L${x - 1} 30 M${x + 1} 24 L${x + 1} 30`} stroke={C.rosa[0]} strokeWidth={0.7} opacity={0.6} />
            <circle cx={x} cy={21} r={3.3} fill={C.rosa[1]} />
            <circle cx={x} cy={33} r={3.3} fill={C.rosa[1]} />
            <circle cx={x - 1.1} cy={19.9} r={1} fill={BLANCO} opacity={0.75} />
          </g>
        ))}
        {/* JAK/STAT */}
        <Baston x={44} y={28} l={40} w={8} rot={90} c={C.azul} brillo={false} />
        <Baston x={56} y={28} l={40} w={8} rot={90} c={C.azul} brillo={false} />
        <Bola x={50} y={6} r={5.6} c={C.amarillo} />
        <Bola x={38} y={48} r={6} c={C.verde} />
        <Bola x={62} y={48} r={6} c={C.verde} />
        <P x={44} y={52} /><P x={56} y={52} />
        <Bola x={26} y={62} r={5.4} c={C.magenta} />
        <Bola x={52} y={74} r={5.4} c={C.magenta} />
        <Bola x={62} y={77} r={5.4} c={C.magenta} />
        <P x={48} y={69} /><P x={66} y={72} />
        <Flecha d="M30 56 C34 52 36 50 36 46" punta="M33 46 L36 45 L38 48" />
        <Flecha d="M64 86 C70 92 74 94 80 96" punta="M76 98 L80 96 L78 92" />
        {/* NF-κB */}
        {[[154, 8], [162, 8], [158, 14]].map(([x, y], i) => <Bola key={i} x={x} y={y} r={4.4} c={C.morado} brillo={i < 2} />)}
        {[150, 158, 166].map((x) => <Baston key={x} x={x} y={32} l={34} w={6.4} rot={90} c={C.cian} brillo={false} />)}
        <Bola x={152} y={56} r={5} c={C.verde} />
        <Bola x={162} y={56} r={5} c={C.verde} />
        <Bola x={157} y={64} r={5} c={C.verde} />
        <Bola x={182} y={74} r={6} c={C.indigo} />
        <Bola x={193} y={74} r={6} c={C.azul} />
        <Tubo d="M177 68 C182 61 193 61 198 68" w={5} c={C.naranja} luz={false} />
        <Flecha d="M166 64 C170 66 172 68 174 70" punta="M171 71 L174 70 L174 67" />
        {/* Proteasoma */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={196} y={88 + i * 5.4} width={16} height={5} rx={2.5} fill={i % 2 ? C.cian[0] : C.cian[1]} />
          </g>
        ))}
        {[[200, 82], [205, 84], [209, 81]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill={C.naranja[1]} />)}
        <Bola x={158} y={92} r={5} c={C.indigo} />
        <Bola x={167} y={92} r={5} c={C.azul} />
        <Flecha d="M156 98 C152 100 148 100 144 99" punta="M147 96 L144 99 L147 102" />
        {/* Núcleo */}
        <ellipse cx={110} cy={110} rx={52} ry={17} fill={C.amarillo[0]} />
        <ellipse cx={108} cy={108} rx={49} ry={15} fill={C.amarillo[1]} />
        {[78, 96, 124, 142].map((x) => <ellipse key={x} cx={x} cy={95.5} rx={3} ry={1.8} fill={C.naranja[0]} />)}
        <path d="M74 112 C80 104 86 120 92 112 C98 104 104 120 110 112 C116 104 122 120 128 112 C134 104 140 120 146 112" fill="none" stroke={C.azul[0]} strokeWidth={2} strokeLinecap="round" />
        <path d="M74 112 C80 120 86 104 92 112 C98 120 104 104 110 112 C116 120 122 104 128 112 C134 120 140 104 146 112" fill="none" stroke={C.azul[1]} strokeWidth={2} strokeLinecap="round" />
        <Bola x={95} y={106} r={4} c={C.magenta} brillo={false} />
        <Bola x={102} y={107} r={4} c={C.magenta} brillo={false} />
        <Bola x={124} y={106} r={4} c={C.indigo} brillo={false} />
        <Bola x={131} y={107} r={4} c={C.azul} brillo={false} />
        <circle cx={78} cy={103} r={2.2} fill={BLANCO} opacity={0.85} />
      </>
    );
  },

  /* Del progenitor a la plasmática: célula madre, pro-B reordenando V(D)J (y el ADN que
     se escinde), linfocito B virgen con su BCR y plasmática con núcleo en rueda de carro,
     halo de Golgi, retículo rugoso y los anticuerpos que secreta. */
  'maduracion-linfocitos': () => {
    const flecha = (x: number) => <Flecha d={`M${x} 56 C${x + 6} 48 ${x + 12} 48 ${x + 18} 56`} punta={`M${x + 13} 55 L${x + 18} 56 L${x + 19} 51`} />;
    return (
      <>
        <Suelo rx={96} />
        <Bola x={24} y={66} r={15} c={C.morado} />
        <Bola x={26} y={68} r={9} c={C.indigo} brillo={false} />
        <circle cx={28} cy={66} r={2.2} fill={C.indigo[2]} />
        {flecha(40)}
        <Bola x={76} y={66} r={13} c={C.celeste} brillo={false} />
        <Bola x={77} y={67} r={9} c={C.azul} />
        <g transform="translate(76 36)">
          <rect x={-16} y={-3} width={11} height={6} rx={3} fill={C.verde[1]} />
          <rect x={-4} y={-3} width={6} height={6} rx={3} fill={C.amarillo[1]} />
          <rect x={3} y={-3} width={7} height={6} rx={3} fill={C.magenta[1]} />
          <rect x={11} y={-3} width={7} height={6} rx={3} fill={C.azul[1]} />
          <circle cx={0} cy={-11} r={5} fill="none" stroke={C.indigo[2]} strokeWidth={1.4} strokeDasharray="2 1.6" />
        </g>
        {flecha(92)}
        <Linfocito x={128} y={66} r={15} />
        <Coronados x={128} y={66} r={15} angulos={[-150, -110, -70, -30, 10, 50, 130, 170]} s={0.62} c={C.cian} />
        {flecha(148)}
        <ellipse cx={188} cy={66} rx={23} ry={18} fill={C.magenta[0]} />
        <ellipse cx={186} cy={64} rx={20.5} ry={15.5} fill={C.magenta[1]} />
        <g fill="none" stroke={C.magenta[0]} strokeWidth={1.3} strokeLinecap="round">
          <path d="M172 56 C168 62 168 70 172 76" />
          <path d="M177 52 C172 60 172 72 177 80" />
          <path d="M168 60 C166 64 166 68 168 72" />
        </g>
        <circle cx={194} cy={66} r={11.5} fill={C.magenta[2]} opacity={0.75} />
        <Bola x={197} y={66} r={8} c={C.indigo} brillo={false} />
        {Array.from({ length: 6 }, (_, i) => polar(197, 66, 4.6, i * 60)).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.3} fill={C.indigo[2]} />)}
        <circle cx={197} cy={66} r={1.3} fill={C.indigo[2]} />
        <circle cx={176} cy={56} r={2.4} fill={BLANCO} opacity={0.9} />
        <Ac x={178} y={34} rot={-20} />
        <Ac x={204} y={34} rot={25} s={0.9} />
        <Ac x={208} y={98} rot={150} s={0.85} />
        <Ac x={180} y={100} rot={200} s={0.8} />
      </>
    );
  },

  /* Hipersensibilidad tipo I: el mastocito con su núcleo, sus gránulos y la IgE sobre el
     receptor; el alérgeno que une dos IgE y la desgranulación que suelta histamina y
     mediadores lipídicos. */
  hipersensibilidad: () => {
    const granulos: [number, number][] = [[-18, -8], [-8, -22], [8, -24], [20, -12], [-26, 6], [-14, 20], [2, 26], [18, 18], [26, 0], [-4, -10], [10, 6], [-24, -18], [30, -16], [-30, -4], [14, -2], [-2, 14]];
    const fuera: [number, number, number][] = [[132, 40, 4.4], [140, 56, 3.8], [136, 78, 4.6], [150, 66, 3.4], [128, 94, 3.6]];
    const histamina = [[158, 40], [176, 56], [162, 84], [186, 34], [194, 76], [174, 100], [204, 52]];
    return (
      <>
        <Suelo x={104} rx={84} />
        {histamina.map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${i * 50})`}>
            <path d="M0 0 L8 0" stroke={C.verde[0]} strokeWidth={1.8} strokeLinecap="round" />
            <Bola x={0} y={0} r={3.2} c={C.verde} brillo={false} />
            <Bola x={8} y={0} r={2.4} c={C.azul} brillo={false} />
          </g>
        ))}
        <path d="M180 110 C184 104 190 112 194 106 C198 100 204 108 208 102" fill="none" stroke={C.naranja[1]} strokeWidth={2.4} strokeLinecap="round" />
        <path d="M150 112 C154 106 160 114 164 108" fill="none" stroke={C.naranja[1]} strokeWidth={2.4} strokeLinecap="round" />
        {fuera.map(([x, y, r], i) => <Bola key={i} x={x} y={y} r={r} c={C.magenta} brillo={r > 3.8} />)}
        <g stroke={C.amarillo[1]} strokeWidth={2} strokeLinecap="round">
          <path d="M128 52 L136 48 M130 66 L140 68 M126 82 L134 88" />
        </g>
        <Bola x={84} y={68} r={42} c={C.morado} />
        <ellipse cx={80} cy={72} rx={14} ry={11} fill={C.indigo[1]} />
        <ellipse cx={78} cy={70} rx={12} ry={9} fill={C.indigo[2]} />
        {granulos.map(([dx, dy], i) => (
          <g key={i}>
            <circle cx={84 + dx} cy={68 + dy} r={4} fill={C.magenta[0]} />
            <circle cx={83.4 + dx} cy={67.4 + dy} r={3.2} fill={C.magenta[1]} />
            <circle cx={82.6 + dx} cy={66.6 + dy} r={0.9} fill={BLANCO} opacity={0.85} />
          </g>
        ))}
        <circle cx={124} cy={60} r={4.4} fill={C.magenta[1]} />
        <circle cx={123} cy={76} r={3.8} fill={C.magenta[1]} />
        <Coronados x={84} y={68} r={42} angulos={[-170, -145, -120, -95, -70, -45]} c={C.cian} />
        {(() => {
          const [x, y] = polar(84, 68, 60, -107.5);
          return (
            <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <path key={a} d="M0 0 L0 -9" stroke={C.verde[0]} strokeWidth={2.6} strokeLinecap="round" transform={`rotate(${a})`} />)}
              <Bola x={0} y={0} r={6.5} c={C.verde} />
            </g>
          );
        })()}
      </>
    );
  },

  /* Lupus: la célula apoptótica con sus vesículas y el núcleo roto, la cromatina que sale
     como collar de nucleosomas (ADN enrollado en histonas), los ANA que la reconocen, los
     inmunocomplejos que se forman y, arriba, la mariposa del eritema malar. */
  lupus: () => {
    const nucleosomas: [number, number][] = [[84, 48], [100, 52], [116, 64], [132, 56], [148, 46], [164, 54], [180, 50]];
    const alaSup = 'M108 60 C92 22 54 8 40 26 C30 42 52 62 106 66Z';
    const alaInf = 'M106 70 C72 70 52 90 62 106 C72 120 96 102 108 74Z';
    const mitad = (
      <g>
        <path d={alaSup} fill={C.magenta[0]} />
        <path d={alaSup} fill={C.magenta[1]} transform="translate(108 64) scale(.88) translate(-110 -66)" />
        <path d={alaInf} fill={C.morado[0]} />
        <path d={alaInf} fill={C.morado[1]} transform="translate(106 72) scale(.86) translate(-108 -74)" />
        <circle cx={64} cy={34} r={7} fill={C.rosa[2]} />
        <circle cx={80} cy={94} r={5} fill={C.morado[2]} />
      </g>
    );
    return (
      <>
        <Suelo rx={94} />
        {/* Célula apoptótica */}
        {[[-150, 6], [-100, 5], [-40, 5.5], [150, 6], [100, 5.5], [60, 4.6]].map(([a, r], i) => {
          const [x, y] = polar(44, 66, 30, a);
          return <Bola key={i} x={x} y={y} r={r} c={C.morado} brillo={false} />;
        })}
        <Bola x={44} y={66} r={30} c={C.morado} />
        {[[38, 60, 6], [50, 56, 5], [44, 72, 6.5], [32, 74, 4], [54, 70, 4.4]].map(([x, y, r], i) => <Bola key={i} x={x} y={y} r={r} c={C.indigo} brillo={i < 2} />)}
        {/* Cromatina: ADN y nucleosomas */}
        <path d="M68 58 C76 44 92 46 100 52 C108 58 110 68 116 64 C124 58 126 54 132 56 C140 58 142 44 148 46 C156 48 158 56 164 54 C170 52 174 48 180 50 C186 52 190 46 196 44" fill="none" stroke={C.azul[0]} strokeWidth={2.6} strokeLinecap="round" />
        {nucleosomas.map(([x, y], i) => (
          <g key={i}>
            <Bola x={x} y={y} r={5.4} c={C.magenta} brillo={false} />
            <circle cx={x} cy={y} r={6.2} fill="none" stroke={C.azul[1]} strokeWidth={1.6} strokeDasharray="7 3" />
            <circle cx={x - 2} cy={y - 2} r={1.2} fill={BLANCO} opacity={0.85} />
          </g>
        ))}
        {/* ANA */}
        <Ac x={100} y={66} />
        <Ac x={132} y={44} rot={180} />
        <Ac x={164} y={68} />
        <Ac x={116} y={78} s={0.9} />
        <Ac x={84} y={36} rot={180} s={0.9} />
        {/* Inmunocomplejos */}
        <g>
          {[[186, 84], [202, 92], [178, 104], [196, 108]].map(([x, y], i) => <Bola key={i} x={x} y={y} r={4.4} c={C.magenta} brillo={i === 0} />)}
          <Ac x={192} y={92} rot={-45} s={0.85} />
          <Ac x={186} y={98} rot={200} s={0.85} />
          <Ac x={198} y={100} rot={60} s={0.85} />
        </g>
        {/* Mariposa */}
        <g transform="translate(150 16) scale(.24) translate(-110 -64)">
          {mitad}
          <g transform="translate(220 0) scale(-1 1)">{mitad}</g>
          <Baston x={110} y={70} l={50} w={10} rot={90} c={C.indigo} brillo={false} />
        </g>
      </>
    );
  },

  /* Citopenias autoinmunes: el macrófago del bazo que atrapa un hematíe cubierto de IgG y
     C3b, el esferocito que queda, otro hematíe marcado y plaquetas con sus anticuerpos. */
  'citopenias-autoinmunes': () => (
    <>
      <Suelo x={104} rx={92} />
      <Bola x={58} y={72} r={40} c={C.macrofago} />
      {[[38, 58, 4], [72, 92, 3.2], [40, 90, 2.6], [76, 56, 2.4]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={BLANCO} opacity={0.85} />)}
      <Bola x={70} y={74} r={6} c={C.rojo} brillo={false} />
      <ellipse cx={46} cy={78} rx={15} ry={11} fill={C.indigo[1]} />
      <ellipse cx={45} cy={76} rx={13} ry={9} fill={C.indigo[2]} />
      <circle cx={54} cy={84} r={5} fill={C.macrofago[1]} />
      {/* Hematíe que se come */}
      <Coronados x={108} y={44} r={16} angulos={[-120, -70, -20, 30]} s={0.75} />
      <Hematie x={108} y={44} r={16} />
      {[[100, 34], [118, 40], [104, 54]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} fill={C.naranja[1]} />)}
      <path d="M84 40 C90 24 110 20 120 30 C108 28 98 32 94 44Z" fill={C.macrofago[0]} />
      <path d="M85 39 C91 25 108 22 117 30 C106 29 97 33 94 42Z" fill={C.macrofago[1]} />
      <path d="M92 60 C102 68 118 66 124 54 C114 60 102 60 96 54Z" fill={C.macrofago[0]} />
      <path d="M92 59 C102 66 117 64 122 55 C112 59 102 59 96 54Z" fill={C.macrofago[1]} />
      {/* Esferocito */}
      <Coronados x={162} y={28} r={11} angulos={[-160, -60, 20, 110]} s={0.6} />
      <Bola x={162} y={28} r={11} c={C.rojo} />
      {/* Hematíe marcado */}
      <Coronados x={150} y={90} r={15} angulos={[-140, -80, -20, 40, 100, 160]} s={0.7} />
      <Hematie x={150} y={90} r={15} />
      <circle cx={142} cy={84} r={1.8} fill={C.naranja[1]} />
      <circle cx={158} cy={96} r={1.8} fill={C.naranja[1]} />
      {/* Plaquetas */}
      {[[198, 56], [200, 104]].map(([x, y], i) => (
        <g key={i}>
          <Coronados x={x} y={y} r={6} angulos={[-100, 0, 100, 190]} s={0.55} />
          <Plaqueta x={x} y={y} s={1.2} />
        </g>
      ))}
    </>
  ),

  /* Vasculitis: corte de una arteria muscular con adventicia (fibroblastos y vasa vasorum),
     elástica externa, media con sus núcleos, elástica interna ondulada y rota, endotelio y
     luz con hematíes; en el sector roto, necrosis fibrinoide, polvo nuclear y neutrófilos,
     y afuera un neutrófilo con ANCA que suelta su red (NET). */
  'vasculitis-anca': () => {
    const CX = 84, CY = 64;
    const enSector = (a: number) => a > -75 && a < -5;
    const iel = Array.from({ length: 73 }, (_, i) => -5 + i * 5).filter((a) => a <= 285).map((a, i) => {
      const r = 27.5 + (i % 2 ? 1.4 : -1.4);
      const [x, y] = polar(CX, CY, r, a);
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
    return (
      <>
        <Suelo x={110} rx={90} />
        <Bola x={CX} y={CY} r={50} c={C.rosa} brillo={false} />
        {Array.from({ length: 12 }, (_, i) => i * 30 + 10).map((a) => {
          const [x, y] = polar(CX, CY, 45, a);
          return <Baston key={a} x={x} y={y} l={6} w={2.4} rot={a + 90} c={C.morado} brillo={false} />;
        })}
        {[60, 170, 240].map((a) => { const [x, y] = polar(CX, CY, 46, a); return <circle key={a} cx={x} cy={y} r={2.4} fill={C.rojo[1]} stroke={C.rojo[0]} strokeWidth={0.8} />; })}
        <circle cx={CX} cy={CY} r={41} fill="none" stroke={C.amarillo[1]} strokeWidth={1.8} />
        <circle cx={CX} cy={CY} r={40} fill={C.magenta[0]} />
        <circle cx={CX - 0.8} cy={CY - 0.8} r={38} fill={C.magenta[1]} />
        {Array.from({ length: 28 }, (_, i) => i * 13).filter((a) => !enSector(a > 180 ? a - 360 : a)).map((a, i) => {
          const [x, y] = polar(CX, CY, i % 2 ? 33 : 36.5, a);
          return <Baston key={a} x={x} y={y} l={6.4} w={2.2} rot={a + 90} c={C.indigo} brillo={false} />;
        })}
        <path d={iel} fill="none" stroke={C.amarillo[1]} strokeWidth={2.2} strokeLinejoin="round" />
        <circle cx={CX} cy={CY} r={25.5} fill={C.rosa[2]} />
        {[20, 100, 160, 220, 300].map((a) => { const [x, y] = polar(CX, CY, 24.5, a); return <ellipse key={a} cx={x} cy={y} rx={2.6} ry={1.2} fill={C.indigo[2]} transform={`rotate(${a + 90} ${x} ${y})`} />; })}
        <circle cx={CX} cy={CY} r={22.5} fill={C.rojo[0]} />
        <Hematie x={CX - 7} y={CY - 4} r={7} rot={20} aplanado={0.8} />
        <Hematie x={CX + 7} y={CY + 7} r={6.4} rot={-30} />
        <Hematie x={CX - 4} y={CY + 11} r={5} rot={60} aplanado={0.6} />
        {/* Necrosis fibrinoide */}
        <path d={`M${polar(CX, CY, 22, -72).join(' ')} A22 22 0 0 1 ${polar(CX, CY, 22, -8).join(' ')} L${polar(CX, CY, 44, -12).join(' ')} A44 44 0 0 0 ${polar(CX, CY, 44, -68).join(' ')}Z`} fill={C.magenta[2]} />
        {[[-60, 30], [-40, 26], [-24, 34], [-50, 38], [-30, 40], [-18, 28]].map(([a, r], i) => {
          const [x, y] = polar(CX, CY, r, a);
          return <circle key={i} cx={x} cy={y} r={1.3} fill={C.indigo[0]} />;
        })}
        {(() => { const [x, y] = polar(CX, CY, 33, -42); return <Neutrofilo x={x} y={y} r={8.5} />; })()}
        {/* NET y neutrófilo con ANCA */}
        <g fill="none" stroke={C.azul[2]} strokeWidth={1.2} strokeLinecap="round">
          <path d="M150 58 C140 54 136 46 126 42 M152 66 C142 66 136 60 128 60 M156 50 C150 40 142 34 134 30" />
        </g>
        <Neutrofilo x={168} y={60} r={18} />
        <Ac x={168} y={32} />
        <Ac x={194} y={50} rot={80} />
        <Ac x={190} y={80} rot={130} />
        <Ac x={156} y={88} rot={200} s={0.9} />
        <Ac x={204} y={24} rot={40} s={0.8} />
      </>
    );
  },

  /* Bacilo gramnegativo en corte: membrana externa con LPS (lípido A y antígeno O),
     periplasma, peptidoglucano fino, membrana interna, nucleoide, plásmidos y ribosomas;
     fimbrias y flagelos con su cuerpo basal. */
  gramnegativas: () => (
    <>
      <Suelo x={112} rx={92} />
      <g fill="none" strokeLinecap="round" stroke={C.rosa[0]} strokeWidth={2.4}>
        <path d="M44 74 C38 76 36 82 30 82 C20 82 18 70 8 70 C2 70 0 76 -4 76" />
        <path d="M48 52 C42 48 40 40 32 40 C22 40 20 30 12 28" />
        <path d="M50 92 C46 102 36 100 30 110 C26 116 18 114 14 120" />
      </g>
      <g transform="translate(112 66) rotate(-10)">
        {Array.from({ length: 15 }, (_, i) => -56 + i * 8).map((x, i) => (
          <g key={x}>
            <path d={`M${x} -26 L${x} -32`} stroke={C.verde[0]} strokeWidth={1.4} />
            <circle cx={x} cy={-33.6} r={1.7} fill={C.verde[1]} />
            <circle cx={x} cy={-37} r={1.5} fill={C.verde[1]} />
            {i % 3 === 0 && <path d={`M${x + 4} -26 L${x + 6} -40`} stroke={C.rosa[0]} strokeWidth={1.1} strokeLinecap="round" />}
            <path d={`M${x} 26 L${x} 32`} stroke={C.verde[0]} strokeWidth={1.4} />
            <circle cx={x} cy={33.6} r={1.7} fill={C.verde[1]} />
            <circle cx={x} cy={37} r={1.5} fill={C.verde[1]} />
            {i % 3 === 1 && <path d={`M${x + 4} 26 L${x + 6} 40`} stroke={C.rosa[0]} strokeWidth={1.1} strokeLinecap="round" />}
          </g>
        ))}
        <rect x={-70} y={-26} width={140} height={52} rx={26} fill={C.rosa[0]} />
        <rect x={-70} y={-26} width={138} height={50} rx={25} fill={C.rosa[1]} />
        <rect x={-67} y={-23} width={134} height={46} rx={23} fill={C.rosa[2]} />
        <rect x={-64.5} y={-20.5} width={129} height={41} rx={20.5} fill="none" stroke={C.amarillo[1]} strokeWidth={2} strokeDasharray="3 1.4" />
        <rect x={-62} y={-18} width={124} height={36} rx={18} fill={C.magenta[1]} />
        <rect x={-59.5} y={-15.5} width={119} height={31} rx={15.5} fill="#FBE3EC" />
        <path d="M-32 0 C-26 -10 -16 10 -10 0 C-4 -10 6 10 12 0 C18 -10 26 8 32 -2 C28 -8 18 6 10 -4 C2 -12 -8 8 -16 -2 C-22 -8 -28 6 -32 0Z" fill="none" stroke={C.indigo[1]} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx={42} cy={5} r={4.6} fill="none" stroke={C.magenta[0]} strokeWidth={1.6} />
        <circle cx={-46} cy={-5} r={3.4} fill="none" stroke={C.magenta[0]} strokeWidth={1.4} />
        {[[-50, 6], [-40, -8], [-24, 9], [-4, -10], [20, 9], [30, -9], [50, -4], [8, 10], [-14, -11], [40, 11]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.4} fill={C.indigo[2]} />
        ))}
        <circle cx={-64} cy={4} r={2.6} fill="none" stroke={C.magenta[0]} strokeWidth={1.2} />
        <rect x={-46} y={-24} width={50} height={2.2} rx={1.1} fill={BLANCO} opacity={0.75} />
      </g>
      <Baston x={196} y={108} l={30} w={13} rot={20} c={C.rosa} />
    </>
  ),

  /* Miembro superior: escápula, clavícula, húmero, radio y cúbito, carpo y los cinco
     radios de la mano; deltoides, bíceps con su tendón, tríceps, músculos del antebrazo,
     arteria braquial y nervio mediano. */
  'miembro-superior-derecho': () => {
    const base = Math.atan2(-0.4, 0.91) * (180 / Math.PI);
    const dedos = [-40, -18, -5, 8, 21].map((d, i) => {
      const a = base + d;
      const [ox, oy] = polar(180, 60, i === 0 ? 3 : 6, a + (i === 0 ? -90 : -30 + i * 14));
      const largos = i === 0 ? [11, 7, 5] : [13, 8, 6, 4.6];
      let [x, y] = [ox, oy];
      const segs = largos.map((l) => { const [nx, ny] = polar(x, y, l, a); const s = { x1: x, y1: y, x2: nx, y2: ny }; [x, y] = [nx, ny]; return s; });
      return segs;
    });
    return (
      <>
        <Suelo rx={94} />
        <path d="M24 14 L60 20 C56 36 48 52 36 66 C30 50 24 32 24 14Z" fill={C.hueso[0]} />
        <path d="M26 16 L57 21 C53 35 46 49 37 61 C32 48 27 31 26 16Z" fill={C.hueso[1]} />
        <Tubo d="M16 10 C30 6 44 12 60 10" w={6} c={C.hueso} luz={false} />
        <Vientre d="M50 34 C44 54 64 82 96 94 C86 72 70 50 50 34Z" eje="M54 42 C64 60 76 76 90 88" c={C.musculo} />
        <Hueso x1={58} y1={28} x2={100} y2={86} w={10} />
        <Hueso x1={104} y1={94} x2={172} y2={66} w={5.6} />
        <Hueso x1={100} y1={84} x2={170} y2={56} w={6.4} />
        {[[175, 52], [181, 54], [177, 60], [183, 61], [179, 66], [186, 66], [186, 56]].map(([x, y], i) => <Bola key={i} x={x} y={y} r={3.4} c={C.hueso} brillo={false} />)}
        {dedos.flat().map((s, i) => (
          <g key={i}>
            <path d={`M${s.x1.toFixed(1)} ${s.y1.toFixed(1)} L${s.x2.toFixed(1)} ${s.y2.toFixed(1)}`} stroke={C.hueso[0]} strokeWidth={3.6} strokeLinecap="round" />
            <circle cx={s.x2} cy={s.y2} r={1.9} fill={C.hueso[1]} />
          </g>
        ))}
        <Vientre d="M110 80 C130 64 150 56 166 54 C150 66 132 76 110 80Z" eje="M114 78 C132 68 148 61 162 57" c={C.rojo} />
        <Vientre d="M66 30 C88 34 104 56 100 78 C88 72 72 52 66 30Z" eje="M70 36 C82 46 92 58 96 70" c={C.rojo} />
        <path d="M99 76 L108 84" stroke={C.hueso[0]} strokeWidth={2.8} strokeLinecap="round" />
        <Bola x={56} y={24} r={10} c={C.hueso} brillo={false} />
        <Vientre d="M40 18 C50 6 70 12 74 30 C72 40 66 46 62 48 C58 40 50 30 40 18Z" eje="M46 18 C56 22 64 32 66 42" c={C.rojo} />
        <path d="M50 42 C66 60 82 78 98 90 C112 86 130 78 150 70" fill="none" stroke={C.rojo[0]} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M50 42 C66 60 82 78 98 90 C112 86 130 78 150 70" fill="none" stroke={C.rojo[2]} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M46 46 C62 64 78 82 96 95 C112 92 132 84 152 76" fill="none" stroke={C.amarillo[0]} strokeWidth={3} strokeLinecap="round" />
        <path d="M46 46 C62 64 78 82 96 95 C112 92 132 84 152 76" fill="none" stroke={C.amarillo[2]} strokeWidth={1.2} strokeLinecap="round" />
      </>
    );
  },

  /* Miembro inferior derecho visto de frente: hueso coxal (cresta ilíaca, espinas, pubis,
     isquion y agujero obturador), fémur con cabeza, cuello y trocánteres, rótula, tibia con
     su cara medial bajo la piel, peroné y pie; sartorio, recto femoral, vastos, aductores,
     tibial anterior y gemelo medial; ligamento inguinal, arteria y nervio femorales. La
     lente abre la rodilla: cóndilos con su cartílago, meniscos, cruzados y colaterales. */
  'miembro-inferior-derecho': () => {
    const coxal = 'M64 20 C62 14 68 9 78 8 C85 8 90 10 92 13 C91 17 91 20 93 23 C96 26 100 28 104 29 L104 38 C100 39 96 41 93 44 C91 47 86 47 85 44 C84 40 80 37 76 35 C72 32 69 29 67 25 C66 23 64 22 64 20Z';
    const pie = 'M70 117 C73 113 84 113 88 117 L104 121 C108 122 108 127 104 127 L74 127 C69 126 67 121 70 117Z';
    const lig: Tono = ['#9C98AC', '#E4E1EC', BLANCO];
    const cart: Tono = ['#7F9CB8', '#C9DAEA', BLANCO];
    const rayos = Array.from({ length: 5 }, (_, i) => ({ x1: 72 + i * 3, y1: 119, x2: 90 + i * 3.2, y2: 125.6 - i * 1.1, w: i === 4 ? 4 : 3 }));
    const tibia = 'M136 70 L188 70 C188 76 181 78 174 80 L172 96 L152 96 L150 80 C143 78 136 76 136 70Z';
    const femur = 'M154 26 L170 26 L174 47 L150 47Z';
    return (
      <>
        <Suelo x={104} y={126} rx={86} />
        {/* Huesos */}
        <path d={coxal} fill={C.hueso[0]} />
        <path d={coxal} fill={C.hueso[1]} transform="translate(84 27) scale(.94) translate(-84.6 -27.8)" />
        <path d="M68 15 C72 10 82 10 88 13 C88 18 86 21 83 23 C78 22 72 20 68 15Z" fill={C.hueso[0]} opacity={0.4} />
        <ellipse cx={92} cy={37} rx={4.6} ry={3.4} fill={C.hueso[0]} transform="rotate(-25 92 37)" />
        <ellipse cx={91.7} cy={37.6} rx={3.2} ry={2.2} fill="#1B2547" opacity={0.18} transform="rotate(-25 92 37)" />
        <Tubo d="M79 30 L70 35" w={6} c={C.hueso} luz={false} />
        <Bola x={79} y={29} r={5.6} c={C.hueso} />
        <Bola x={65.5} y={34} r={5} c={C.hueso} brillo={false} />
        <Tubo d="M69 36 L77 74" w={7.5} c={C.hueso} luz={false} />
        <Bola x={75.5} y={42} r={2.6} c={C.hueso} brillo={false} />
        <Bola x={73} y={76} r={5.2} c={C.hueso} brillo={false} />
        <Bola x={82} y={76} r={5.2} c={C.hueso} brillo={false} />
        <Bola x={69} y={84} r={3.2} c={C.hueso} brillo={false} />
        <Tubo d="M69 86 L72 115" w={2.8} c={C.hueso} luz={false} />
        <Tubo d="M71 82 L85 82" w={6} c={C.hueso} luz={false} />
        <Tubo d="M79 83 L80 114" w={7} c={C.hueso} luz={false} />
        <path d="M81.5 86 L82.6 112" stroke={C.hueso[2]} strokeWidth={1.4} strokeLinecap="round" />
        <Bola x={72} y={116} r={3.2} c={C.hueso} brillo={false} />
        <Bola x={83.5} y={115.5} r={3} c={C.hueso} brillo={false} />
        <path d={pie} fill={C.hueso[0]} />
        <path d={pie} fill={C.hueso[1]} transform="translate(-0.6 -0.8)" />
        {rayos.map((r, i) => (
          <g key={i}>
            <path d={`M${r.x1 + 6} ${r.y1 + 0.5} L${r.x2} ${r.y2}`} stroke={C.hueso[0]} strokeWidth={0.9} strokeLinecap="round" />
            <Bola x={r.x2 + 3} y={r.y2 - 0.4} r={r.w * 0.55} c={C.hueso} brillo={false} />
          </g>
        ))}
        <path d="M74 116 C78 114 84 115 87 117" stroke={C.hueso[2]} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        {/* Músculos */}
        <Vientre d="M100 36 C94 40 86 50 80 63 C85 59 92 53 97 47 C100 44 101 39 100 36Z" eje="M97 41 C92 47 87 54 82 60" c={C.musculo} />
        <Vientre d="M63 38 C57 50 61 64 72 73 C72 61 70 49 63 38Z" eje="M63 43 C62 53 65 63 70 70" c={C.musculo} />
        <Vientre d="M67 27 C62 40 66 58 77 68 C81 55 77 40 67 27Z" eje="M68 32 C69 44 72 56 76 64" c={C.rojo} />
        <Vientre d="M81 54 C89 58 89 68 81 73 C79 67 79 60 81 54Z" eje="M82 58 C85 62 85 66 82 70" c={C.musculo} />
        <path d="M77 74 L79 87" stroke={C.hueso[0]} strokeWidth={2.8} strokeLinecap="round" />
        <Bola x={77} y={72} r={4.2} c={C.hueso} />
        <Musculo d="M64 21 C68 36 78 52 85 68 C87 75 86 81 84 86" w={4.2} c={C.rojo} />
        <Vientre d="M72 86 C67 96 71 106 78 112 C78 102 76 92 72 86Z" eje="M72 90 C71 98 74 105 77 109" c={C.rojo} />
        <path d="M78 111 L84 120" stroke={C.hueso[0]} strokeWidth={1.8} strokeLinecap="round" />
        <Vientre d="M86 82 C93 88 93 99 86 107 C84 99 84 90 86 82Z" eje="M87 86 C89 92 89 98 87 103" c={C.musculo} />
        {/* Ligamento inguinal, arteria y nervio femorales */}
        <path d="M64 20 C74 26 88 29 100 30" stroke={C.hueso[0]} strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M64 20 C74 26 88 29 100 30" stroke={C.hueso[2]} strokeWidth={0.9} fill="none" strokeLinecap="round" />
        <path d="M84 28 C82 33 80 38 78 44 M83 31 C80 35 76 39 73 45 M83 33 C83 39 82 45 80 49" stroke={C.amarillo[0]} strokeWidth={1.7} fill="none" strokeLinecap="round" />
        <path d="M88 29 C88 39 85 50 81 62" stroke={C.rojo[0]} strokeWidth={2.8} fill="none" strokeLinecap="round" />
        <path d="M88 29 C88 39 85 50 81 62" stroke={C.rojo[2]} strokeWidth={1} fill="none" strokeLinecap="round" transform="translate(-0.5 -0.4)" />
        {/* Zoom a la rodilla */}
        <circle cx={78} cy={78} r={9.5} fill="none" stroke="#9AA9C2" strokeWidth={1.4} />
        <path d="M86 73 L126 42 M87 84 L128 86" stroke="#9AA9C2" strokeWidth={1.1} strokeLinecap="round" />
        <Lente x={162} y={62} r={40}>
          <path d={femur} fill={C.hueso[0]} />
          <path d={femur} fill={C.hueso[1]} transform="translate(-1 0) scale(1 1)" opacity={0.95} />
          <path d={tibia} fill={C.hueso[0]} />
          <path d={tibia} fill={C.hueso[1]} transform="translate(161 82) scale(.94) translate(-162 -83)" />
          <path d="M140 92 L137 84" stroke={C.hueso[0]} strokeWidth={4.4} strokeLinecap="round" />
          <Bola x={136.5} y={80} r={5.4} c={C.hueso} brillo={false} />
          <Bola x={150} y={56} r={11} c={C.hueso} brillo={false} />
          <Bola x={174} y={56} r={11} c={C.hueso} brillo={false} />
          <ellipse cx={162} cy={59} rx={3.6} ry={6} fill={C.hueso[0]} />
          <path d={arco(150, 56, 11.4, 25, 165)} stroke={cart[1]} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d={arco(174, 56, 11.4, 15, 155)} stroke={cart[1]} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d="M138 70 H186" stroke={cart[1]} strokeWidth={2} strokeLinecap="round" />
          {/* Meniscos */}
          <path d="M138 69.5 C141 64.5 156 64.5 159 69 L155 69.6 C151 67.6 146 67.6 142 70Z" fill={cart[0]} />
          <path d="M139.5 68.8 C142 65.6 154 65.6 157 68.4" stroke={cart[2]} strokeWidth={1} fill="none" strokeLinecap="round" />
          <path d="M165 69 C168 64.5 183 64.5 186 69.5 L182 70 C178 67.6 173 67.6 169 69.6Z" fill={cart[0]} />
          <path d="M167 68.4 C170 65.6 182 65.6 184.5 68.8" stroke={cart[2]} strokeWidth={1} fill="none" strokeLinecap="round" />
          {/* Cruzados y colaterales */}
          <Tubo d="M157 54 L166 70" w={4} c={lig} />
          <Tubo d="M168 53 L158 71" w={4} c={['#8B87A0', '#CFCADB', BLANCO]} />
          <Tubo d="M184 46 C188 58 188 72 183 86" w={4.2} c={lig} />
          <Tubo d="M140 47 C136 58 134 68 135 76" w={3.6} c={lig} />
        </Lente>
      </>
    );
  },

  /* Investigación: matraz graduado que burbujea y humea, gradilla con cuatro tubos de
     distinto contenido y una molécula. */
  investigacion: () => {
    const matraz = 'M58 18 H82 V50 L112 104 C116 112 110 120 102 120 H38 C30 120 24 112 28 104 L58 50Z';
    const liquido = 'M44 76 H96 L112 104 C116 112 110 120 102 120 H38 C30 120 24 112 28 104Z';
    return (
      <>
        <Suelo x={116} rx={92} y={124} />
        <path d={matraz} fill={C.vidrio[1]} />
        <path d={liquido} fill={C.cian[1]} />
        <path d="M80 76 H96 L112 104 C116 112 110 120 102 120 H88 C100 108 92 90 80 76Z" fill={C.cian[0]} opacity={0.6} />
        <ellipse cx={70} cy={76} rx={26} ry={4} fill={C.cian[2]} />
        {[84, 92, 100, 108].map((y) => <path key={y} d={`M${92 + (y - 76) * 0.55} ${y} h-6`} stroke={C.cian[0]} strokeWidth={1.2} strokeLinecap="round" />)}
        <rect x={54} y={12} width={32} height={9} rx={4.5} fill={C.vidrio[0]} />
        <rect x={62} y={26} width={5} height={36} rx={2.5} fill={BLANCO} opacity={0.75} />
        {[[60, 98, 4], [76, 106, 3], [72, 88, 2.6], [64, 40, 3], [74, 30, 2.4], [52, 108, 2.2]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={BLANCO} opacity={0.8} />
        ))}
        <path d="M64 8 C58 2 66 -2 60 -8 M76 8 C82 2 74 -2 80 -8" fill="none" stroke={C.cian[2]} strokeWidth={2.4} strokeLinecap="round" opacity={0.9} />
        <g transform="translate(0 4)">{/* Gradilla con tubos */}
        <rect x={126} y={110} width={84} height={9} rx={3} fill={C.indigo[0]} />
        <rect x={126} y={108} width={84} height={7} rx={3} fill={C.indigo[1]} />
        <rect x={130} y={72} width={5} height={40} fill={C.indigo[0]} />
        <rect x={201} y={72} width={5} height={40} fill={C.indigo[0]} />
        {[[144, C.rojo, -14], [160, C.verde, -4], [176, C.amarillo, -18], [192, C.morado, 0]].map(([x, c, n]) => (
          <TuboEnsayo key={x as number} x={x as number} y={80} liq={c as Tono} nivel={n as number} ancho={6} alto={34} />
        ))}
        <rect x={126} y={70} width={84} height={9} rx={3} fill={C.indigo[0]} />
        <rect x={126} y={68} width={84} height={7} rx={3} fill={C.indigo[1]} />
        <rect x={132} y={70} width={30} height={2} rx={1} fill={C.indigo[2]} />
        </g>
        {/* Molécula */}
        <g stroke={C.verde[2]} strokeWidth={5} strokeLinecap="round" opacity={0.75}>
          <path d="M178 20 L166 10 M178 20 L192 10 M178 20 L166 32 M178 20 L190 32" />
        </g>
        <Bola x={166} y={10} r={5.6} c={C.magenta} />
        <Bola x={192} y={10} r={5.6} c={C.magenta} />
        <Bola x={166} y={32} r={6} c={C.azul} />
        <Bola x={190} y={32} r={6} c={C.azul} />
        <Bola x={178} y={20} r={5.6} c={C.verde} />
      </>
    );
  },
};

const LAB = '/dashboard/laboratorio/';

/**
 * El nombre de la portada de un laboratorio: su slug, o la región en el atlas 3D (cada
 * región es una tarjeta distinta con el mismo visor). Null si no tiene portada.
 */
export function claveDePortada(href: string): string | null {
  if (href.endsWith('/investigacion')) return 'investigacion';
  if (!href.startsWith(LAB)) return null;
  const [ruta, query = ''] = href.slice(LAB.length).split('?');
  const clave = ruta === 'atlas-3d' ? new URLSearchParams(query).get('region') ?? '' : ruta;
  return clave in PORTADAS ? clave : null;
}

export default function PortadaLab({ clave, className }: { clave: string; className?: string }) {
  const dibujo = PORTADAS[clave];
  if (!dibujo) return null;
  return (
    <svg viewBox="0 0 220 130" className={className} aria-hidden="true" focusable="false">
      {dibujo()}
    </svg>
  );
}
