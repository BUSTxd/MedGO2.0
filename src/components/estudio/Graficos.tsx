/* eslint-disable @next/next/no-img-element */

// En el prototipo los <text> pedían «Outfit» por nombre; aquí la fuente es la variable de next/font.
const FUENTE = { fontFamily: 'var(--font-estudio), sans-serif' };

export const norm = (v: string) => String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const CELULAS: [number, number, number][] = [[85, 60, 28], [163, 46, 25], [239, 57, 29], [317, 93, 31], [260, 148, 29], [147, 155, 30], [64, 147, 26], [191, 106, 28]];
const RUTA_NEURONA = 'M200 45v52l-45 28-39-28m84 0 47 28 38-28 M155 125l-15 47m107-47 15 47 M155 125h92 M200 97v70';

export function ArteLab({ kind }: { kind: string }) {
  if (kind === 'heart') return <img src="/assets/estudio/heart-anatomy.webp" alt="Ilustración anatómica del corazón" />;
  if (kind === 'brain') return (
    <svg viewBox="0 0 400 210" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        <ellipse cx="200" cy="110" rx="125" ry="78" stroke="#b8a4d1" strokeWidth="1" strokeDasharray="4 5" />
        <path d={RUTA_NEURONA} stroke="#a992c9" strokeWidth="12" />
        <path d={RUTA_NEURONA} stroke="#d7c9ea" strokeWidth="5" />
      </g>
      <g fill="#e6d9f2" stroke="#ad91c3" strokeWidth="2"><circle cx="200" cy="45" r="10" /><circle cx="116" cy="97" r="8" /><circle cx="285" cy="97" r="8" /><circle cx="140" cy="172" r="8" /><circle cx="262" cy="172" r="8" /></g>
    </svg>
  );
  if (kind === 'nephron') return (
    <svg viewBox="0 0 400 210" aria-hidden="true">
      <g fill="none" strokeLinecap="round">
        <path d="M135 55c-36-20-55 23-29 44 25 20 61-13 37-32-20-16-37 5-22 16" stroke="#d69b9c" strokeWidth="7" />
        <path d="M145 89c35-34 62 3 39 20s-31-7-17-13 31 9 28 29v49q0 18 19 18t18-18v-66q-3-27 22-27t16 32q-11 16 5 18t31-21v78" stroke="#b4c8ac" strokeWidth="10" />
        <path d="M80 43h34 M80 112h45" stroke="#abbed2" strokeWidth="7" />
      </g>
      <circle cx="126" cy="77" r="37" fill="none" stroke="#d7d9cb" strokeWidth="3" />
      <circle cx="126" cy="77" r="45" fill="none" stroke="#dae6e0" strokeDasharray="3 5" />
    </svg>
  );
  if (kind === 'ecg') return (
    <svg viewBox="0 0 400 210" aria-hidden="true">
      <g stroke="#c6dce8" strokeWidth=".5">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 30} 0v210 M0 ${i * 20}h400`} />)}</g>
      <path d="M0 115h54l10-9 9 9h19l7 13 11-78 11 113 12-48h31l16-17 16 17h33l9-9 10 9h15l8 13 11-78 11 113 13-48h30l16-17 17 17h45" fill="none" stroke="#79a1c0" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="110" cy="50" r="6" fill="#cee0ef" />
    </svg>
  );
  if (kind === 'cells') return (
    <svg viewBox="0 0 400 210" aria-hidden="true">
      <defs><radialGradient id="cell"><stop stopColor="#f5d1d7" /><stop offset=".6" stopColor="#daa0ad" /><stop offset="1" stopColor="#e4b5bf" /></radialGradient></defs>
      {CELULAS.map(([x, y, r]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r} ry={r * 0.75} fill="url(#cell)" opacity=".85" stroke="#dbabb7" />)}
      <circle cx="200" cy="112" r="20" fill="#a994be" />
      <path d="M188 105q17-20 24 2t-15 20" fill="#89709f" />
    </svg>
  );
  return (
    <svg viewBox="0 0 400 210" aria-hidden="true">
      <circle cx="200" cy="105" r="72" fill="none" stroke="#e0dbf0" strokeWidth="18" />
      <circle cx="200" cy="105" r="72" fill="none" stroke="#a394c9" strokeWidth="18" strokeDasharray="95 360" transform="rotate(-90 200 105)" />
      <circle cx="200" cy="105" r="72" fill="none" stroke="#b5bddc" strokeWidth="18" strokeDasharray="145 310" transform="rotate(-8 200 105)" />
      <circle cx="200" cy="105" r="72" fill="none" stroke="#accec9" strokeWidth="18" strokeDasharray="100 360" transform="rotate(115 200 105)" />
      <g style={FUENTE} fontSize="12" fill="#9b94b1" textAnchor="middle">
        <text x="200" y="100">CICLO</text><text x="200" y="117">CELULAR</text>
        <text x="290" y="57">G₁</text><text x="276" y="176">S</text><text x="118" y="165">G₂</text><text x="113" y="50">M</text>
      </g>
    </svg>
  );
}
