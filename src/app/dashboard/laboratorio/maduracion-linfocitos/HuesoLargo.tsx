// Hueso largo abierto, dibujado con código al estilo de las ilustraciones de
// Servier que lo acompañan en la intro (timo, ganglio): contorno oscuro,
// degradados suaves y un brillo. La epífisis superior está abierta y muestra
// el hueso esponjoso con la MÉDULA ROJA entre sus trabéculas (donde nacen los
// linfocitos); la diáfisis, el hueso compacto y la cavidad medular con médula
// amarilla. Se dibuja en una caja de `d` × `d`, inclinado.

const CONTORNO =
  'M-28,-70 C-30,-95 -70,-100 -66,-125 C-62,-150 -30,-158 -10,-142 C0,-150 10,-150 18,-144 ' +
  'C40,-160 72,-146 66,-120 C62,-98 30,-92 28,-70 L28,70 C30,92 62,98 66,120 C72,146 40,160 18,144 ' +
  'C10,150 0,150 -10,142 C-30,158 -62,150 -66,125 C-70,100 -30,95 -28,70 Z';

const VENTANA_EPIFISIS = 'M-52,-117 C-50,-139 -17,-146 0,-133 C20,-147 53,-137 51,-115 C49,-95 25,-88 0,-91 C-26,-88 -54,-96 -52,-117 Z';
const VENTANA_DIAFISIS = 'M-15,-62 C-6,-66 6,-66 15,-62 L15,46 C6,50 -6,50 -15,46 Z';

/** Trabéculas del hueso esponjoso: una red de puntales entre nudos fijos. */
const NUDOS: [number, number][] = [
  [-44, -118], [-30, -132], [-12, -126], [6, -136], [26, -132], [42, -120], [-38, -102], [-20, -110], [0, -114],
  [18, -112], [36, -104], [-26, -94], [-6, -98], [14, -96], [30, -92],
];
const PUNTALES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [0, 6], [1, 7], [2, 7], [2, 8], [3, 8], [4, 9], [5, 10], [6, 7], [7, 8], [8, 9],
  [9, 10], [6, 11], [7, 11], [8, 12], [9, 13], [10, 14], [11, 12], [12, 13], [13, 14],
];

/** Inclinación del hueso (grados, sentido horario negativo). */
const GIRO = 28;

/** Un punto del hueso (sin girar) llevado al marco de los rótulos (sin giro). */
function girar(x: number, y: number) {
  const a = (-GIRO * Math.PI) / 180;
  return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) };
}

export default function HuesoLargo({ d }: { d: number }) {
  const k = d / 330;
  return (
    <g transform={`scale(${k.toFixed(3)}) rotate(${-GIRO})`}>
      <defs>
        <linearGradient id="hl-hueso" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FFF8EA" />
          <stop offset="55%" stopColor="#F1E0C2" />
          <stop offset="100%" stopColor="#D9BD92" />
        </linearGradient>
        <radialGradient id="hl-roja" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F07B78" />
          <stop offset="100%" stopColor="#C2413F" />
        </radialGradient>
        <linearGradient id="hl-amarilla" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FBE7A6" />
          <stop offset="100%" stopColor="#EBC966" />
        </linearGradient>
        <clipPath id="hl-clip-epi"><path d={VENTANA_EPIFISIS} /></clipPath>
        <clipPath id="hl-clip-dia"><path d={VENTANA_DIAFISIS} /></clipPath>
      </defs>

      {/* Hueso: periostio (contorno) y superficie */}
      <path d={CONTORNO} fill="url(#hl-hueso)" stroke="#6E5338" strokeWidth={3} strokeLinejoin="round" />
      {/* Brillo a lo largo de la diáfisis */}
      <path d="M-20,-66 L-20,66" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
      <path d="M-46,118 C-50,132 -36,142 -22,138" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.5} />

      {/* Epífisis abierta: hueso esponjoso con médula roja */}
      <path d={VENTANA_EPIFISIS} fill="url(#hl-roja)" />
      <g clipPath="url(#hl-clip-epi)">
        {PUNTALES.map(([a, b], i) => (
          <line key={i} x1={NUDOS[a][0]} y1={NUDOS[a][1]} x2={NUDOS[b][0]} y2={NUDOS[b][1]} stroke="#F5E6C8" strokeWidth={4.5} strokeLinecap="round" />
        ))}
        {NUDOS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.2} fill="#F5E6C8" />)}
        {[[-36, -110], [-16, -120], [10, -124], [28, -112], [-4, -104], [20, -100], [-28, -100], [36, -116]].map(([x, y], i) => (
          <circle key={`c${i}`} cx={x + 4} cy={y + 3} r={2.4} fill="#FFD1CF" opacity={0.9} />
        ))}
      </g>
      <path d={VENTANA_EPIFISIS} fill="none" stroke="#B89464" strokeWidth={3.5} />

      {/* Diáfisis abierta: hueso compacto y cavidad medular con médula amarilla */}
      <path d={VENTANA_DIAFISIS} fill="url(#hl-amarilla)" />
      <g clipPath="url(#hl-clip-dia)">
        {[-50, -30, -10, 10, 30].map((y) => <ellipse key={y} cx={(y % 20 === 0 ? -4 : 5)} cy={y} rx={5} ry={7} fill="#F8DE8A" stroke="#E2B94F" strokeWidth={1} />)}
      </g>
      <path d={VENTANA_DIAFISIS} fill="none" stroke="#B89464" strokeWidth={3} />
      {[-22, -25].map((x) => <path key={x} d={`M${x},-56 L${x},44`} stroke="#D2B285" strokeWidth={1.4} />)}
      {[22, 25].map((x) => <path key={x} d={`M${x},-56 L${x},44`} stroke="#C7A473" strokeWidth={1.4} />)}

      {/* Arteria nutricia */}
      <path d="M56,12 C44,8 36,4 28,6" fill="none" stroke="#C93A3A" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M28,6 C22,7 18,10 15,12" fill="none" stroke="#C93A3A" strokeWidth={2.5} strokeLinecap="round" />

      {/* Rótulos pequeños dentro del dibujo */}
      {/* Los rótulos van derechos (se deshace el giro) y su línea termina en un
          punto del propio dibujo, pasado por el mismo giro: si no, apuntan al aire. */}
      <g transform={`rotate(${GIRO})`}>
        {(() => {
          const roja = girar(30, -118);   // borde derecho de la médula roja
          const amarilla = girar(8, -6);  // dentro de la cavidad medular
          return (
            <>
              <text x={96} y={-168} fontSize={17} fontWeight={700} fill="#B23A38">médula roja</text>
              <line x1={94} y1={-172} x2={roja.x} y2={roja.y} stroke="#B23A38" strokeWidth={1.5} />
              <circle cx={roja.x} cy={roja.y} r={3} fill="#B23A38" />
              <text x={84} y={-2} fontSize={17} fontWeight={700} fill="#A07A1E">médula amarilla</text>
              <line x1={81} y1={-6} x2={amarilla.x} y2={amarilla.y} stroke="#A07A1E" strokeWidth={1.5} />
              <circle cx={amarilla.x} cy={amarilla.y} r={3} fill="#A07A1E" />
            </>
          );
        })()}
      </g>
    </g>
  );
}
