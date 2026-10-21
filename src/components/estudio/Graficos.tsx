/* eslint-disable @next/next/no-img-element */
import { cx, Icono } from './Icono';
import type { CursoMuestra, LeccionMuestra } from '@/lib/estudio/muestra';

// En el prototipo los <text> pedían «Outfit» por nombre; aquí la fuente es la variable de next/font.
const FUENTE = { fontFamily: 'var(--font-estudio), sans-serif' };

export const norm = (v: string) => String(v).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function DiagramaConceptual({ tipo }: { tipo: 'heart' | 'brain' | 'nephron' }) {
  if (tipo === 'heart') return (
    <svg viewBox="0 0 650 205" role="img" aria-label="Esquema conceptual: mediastino superior e inferior, este último dividido en anterior, medio y posterior">
      <defs><linearGradient id="nodeGrad" x2="1" y2="1"><stop stopColor="#f2f0ff" /><stop offset="1" stopColor="#e8e8fc" /></linearGradient></defs>
      <g fill="none" stroke="#b6b5da" strokeWidth="1.4"><path d="M325 57v22H166v18 M325 79h159v18 M484 132v21H353v17 M484 153v17 M484 153h131v17" /></g>
      <g fill="url(#nodeGrad)" stroke="#c7c0ed"><rect x="245" y="17" width="160" height="41" rx="8" /><rect x="95" y="97" width="142" height="35" rx="7" /><rect x="413" y="97" width="142" height="35" rx="7" /></g>
      <g fill="#f7f8fd" stroke="#d9deef"><rect x="296" y="170" width="114" height="30" rx="6" /><rect x="427" y="170" width="114" height="30" rx="6" /><rect x="558" y="170" width="90" height="30" rx="6" /></g>
      <g fill="#7e79a9" style={FUENTE} textAnchor="middle" fontSize="13">
        <text x="325" y="43" fill="#6c5bba" fontWeight="500">Mediastino</text><text x="166" y="119">Superior</text><text x="484" y="119">Inferior</text>
        <text x="353" y="190" fontSize="11">Anterior</text><text x="484" y="190" fontSize="11">Medio</text><text x="603" y="190" fontSize="11">Posterior</text>
      </g>
    </svg>
  );
  if (tipo === 'brain') return (
    <svg viewBox="0 0 650 205" role="img" aria-label="Mapa conceptual de organización nerviosa">
      <g fill="none" stroke="#c7c0e6" strokeWidth="1.5"><path d="M325 59v32H150v26 M325 91h175v26" /></g>
      <g fill="#eeeafa" stroke="#d2c9e9"><rect x="232" y="20" width="186" height="40" rx="8" /><rect x="65" y="117" width="170" height="44" rx="8" /><rect x="415" y="117" width="170" height="44" rx="8" /></g>
      <g fill="#81739f" style={FUENTE} textAnchor="middle" fontSize="13"><text x="325" y="46">Sistema nervioso</text><text x="150" y="144">Sistema central</text><text x="500" y="144">Sistema periférico</text></g>
    </svg>
  );
  return (
    <svg viewBox="0 0 650 205" role="img" aria-label="Mapa conceptual de los procesos renales">
      <path d="M135 105H515" stroke="#acccc9" strokeWidth="2" strokeDasharray="6 6" />
      <g fill="#ecf8f5" stroke="#c4ded9"><rect x="25" y="75" width="155" height="60" rx="10" /><rect x="247" y="75" width="155" height="60" rx="10" /><rect x="470" y="75" width="155" height="60" rx="10" /></g>
      <g style={FUENTE} textAnchor="middle" fontSize="13" fill="#668f89"><text x="102" y="110">Filtración</text><text x="325" y="110">Reabsorción</text><text x="548" y="110">Secreción</text></g>
      <g fill="#a9cbc3"><circle cx="211" cy="105" r="5" /><circle cx="435" cy="105" r="5" /></g>
    </svg>
  );
}

export function DiagramaResumen({ c, l }: { c: CursoMuestra; l: LeccionMuestra }) {
  if (norm(l.title).includes('mediastino')) return <DiagramaConceptual tipo="heart" />;
  return (
    <div className={cx('concept-map')}>
      <div className={cx('concept-root')}>
        <Icono n={c.icon === 'brain' ? 'brain' : c.icon === 'kidney' ? 'flask' : 'heart'} />
        <span>{l.kicker || c.shortName || c.name}</span>
      </div>
      <div className={cx('concept-branches')}>
        {l.summary.sections.map((s, i) => (
          <div key={s.id}><span className={cx('concept-step')}>0{i + 1}</span><strong>{s.title}</strong></div>
        ))}
      </div>
    </div>
  );
}

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
