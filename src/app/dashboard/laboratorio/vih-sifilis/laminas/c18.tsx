'use client';
// Capítulo 18 · Secundaria, latente, terciaria y congénita

import type { Lamina } from '../Lienzo';
import { Bandera, Bazo, Caracol, Cerebro, Cruz, Cuerpo, Flecha, FotoCuadro, Granuloma, Higado, Hombre, Jeringa, Nodo, P, Punto, Reloj, Sale, Signo, Trazo, Treponema, Txt, TXV, Visto, easeOut, hash, lerp, tramo, useFotoCargada } from '../Piezas';
import { Palma, Parche, Sudor, VasoCorte } from './ComunSifilis';

/** Un feto de perfil (cabeza, cuerpo encogido y pierna), en tonos de piel. */
const Feto = ({ x, y, k = 1, o = 1 }: { x: number; y: number; k?: number; o?: number }) => (
  <g transform={`translate(${x},${y}) scale(${k})`} opacity={o}>
    <ellipse cx={14} cy={36} rx={44} ry={52} fill={P.piel2[0]} /><ellipse cx={10} cy={32} rx={40} ry={48} fill={P.piel2[1]} />
    <circle cx={-12} cy={-30} r={32} fill={P.piel2[0]} /><circle cx={-14} cy={-32} r={29} fill={P.piel2[2]} />
    <path d="M-30,-30 q7,-6 13,0 M-8,-30 q7,-6 13,0" fill="none" stroke="#5A22A8" strokeWidth={3} strokeLinecap="round" />
    <ellipse cx={-34} cy={70} rx={30} ry={16} fill={P.piel2[1]} />
  </g>
);

/** Un hueso con sus cuatro extremos. */
const Hueso = ({ x, y, k = 1, r = -30, o = 1 }: { x: number; y: number; k?: number; r?: number; o?: number }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${k})`} opacity={o}>
    <rect x={-48} y={-10} width={96} height={20} rx={10} fill="#F4EEDF" />
    {[[-52, -12], [-52, 12], [52, -12], [52, 12]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={15} fill="#F4EEDF" />)}
    <rect x={-40} y={-6} width={80} height={5} rx={2.5} fill="#FFF" opacity={0.7} />
  </g>
);

/** Grumos de floculación de una tarjeta de RPR (posiciones y radios sobre un círculo de 60). */
const GRUMOS: [number, number, number][] = [[-30, -20, 8], [-12, 12, 6], [18, -26, 9], [30, 8, 7], [-2, -4, 10], [-34, 30, 6], [26, 34, 8], [8, 28, 5], [-20, -40, 6], [38, -12, 6], [-42, 4, 5], [14, 4, 6]];

// ─── 0 · El paciente 2, tres meses después ───────────────────────────────────
const TresMeses: Lamina = ({ p }) => (
  <g>
    <Txt x={800} y={70} txt="tres meses después" t={42} p={p('tres')} color={TXV.violeta} />
    <Txt x={800} y={116} txt="paciente 2" t={28} p={p('paciente')} />
    <Cuerpo x={330} y={585} k={0.88}>
      <Punto x={0} y={-318} p={p('cabello')} />
      <Punto x={0} y={-240} p={p('boca')} />
      <Nodo x={-36} y={-192} p={p('cuello')} k={1.5} /><Nodo x={36} y={-192} p={p('cuello')} k={1.5} />
      <Nodo x={-92} y={-112} p={p('axilas')} k={1.5} /><Nodo x={92} y={-112} p={p('axilas')} k={1.5} />
      <Nodo x={-38} y={70} p={p('ingles')} k={1.5} /><Nodo x={38} y={70} p={p('ingles')} k={1.5} />
      {[[-42, -110], [30, -95], [-26, -50], [44, -32], [-40, 0], [20, 20]].map(([x, y], i) => <Punto key={i} x={x} y={y} color="#D9822B" p={tramo(p('papulas'), i * 0.1, i * 0.1 + 0.4)} />)}
      <Punto x={-148} y={24} color="#D9822B" p={p('palmas')} /><Punto x={148} y={24} color="#D9822B" p={p('palmas')} />
      <Punto x={-62} y={314} color="#D9822B" p={p('plantas')} /><Punto x={62} y={314} color="#D9822B" p={p('plantas')} />
    </Cuerpo>
    {/* lo que cuenta el paciente y lo que se ve */}
    <Txt x={700} y={186} txt="la úlcera desapareció" t={26} ancla="start" p={p('desaparecio')} color={TXV.verde} />
    <Cruz x={668} y={238} k={0.5} p={p('acudio')} />
    <Txt x={700} y={238} txt="no acudió a los controles" t={26} ancla="start" p={p('acudio')} />
    <Txt x={700} y={290} txt="malestar general" t={26} ancla="start" p={p('malestar')} />
    <Nodo x={668} y={352} p={p('ganglios')} k={1.1} />
    <Txt x={700} y={352} txt="ganglios aumentados" t={26} ancla="start" p={p('ganglios')} />
    <Txt x={740} y={392} txt="en el cuello" t={22} ancla="start" p={p('cuello')} />
    <Txt x={740} y={424} txt="las axilas" t={22} ancla="start" p={p('axilas')} />
    <Txt x={740} y={456} txt="y las ingles" t={22} ancla="start" p={p('ingles')} />
    <Punto x={668} y={520} color="#D9822B" p={p('manchas')} />
    <Txt x={700} y={520} txt="manchas y pápulas cobrizas" t={26} ancla="start" p={p('manchas')} color={TXV.ambar} />
    <Txt x={740} y={560} txt="en el tronco" t={22} ancla="start" p={p('tronco')} />
    <Txt x={740} y={592} txt="las palmas" t={22} ancla="start" p={p('palmas')} />
    <Txt x={740} y={624} txt="y las plantas" t={22} ancla="start" p={p('plantas')} />
    <Punto x={668} y={690} p={p('placas')} />
    <Txt x={700} y={690} txt="placas blancas en la boca" t={26} ancla="start" p={p('placas')} />
    <Punto x={668} y={748} p={p('perdida')} />
    <Txt x={700} y={748} txt="pérdida de cabello" t={26} ancla="start" p={p('perdida')} />
    {/* la serología sube */}
    <Bandera x={1330} y={190} txt="RPR" color={P.copa[0]} p={p('rpr')} t={32} punta="abajo" />
    <Sale p={p('inicio')} x={1170} y={420}>
      <circle cx={4} cy={6} r={74} fill={P.sombra} /><circle r={74} fill="#E4DAF8" /><circle r={60} fill="#FFF" />
      {GRUMOS.slice(0, 4).map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5A22A8" opacity={0.85} />)}
    </Sale>
    <Txt x={1170} y={530} txt="inicial · 1:32" t={26} p={p('inicio')} />
    <Sale p={p('n128')} x={1455} y={420}>
      <circle cx={5} cy={7} r={88} fill={P.sombra} /><circle r={88} fill="#E4DAF8" /><circle r={72} fill="#FFF" />
      {GRUMOS.map(([x, y, r], i) => <circle key={i} cx={x * 1.3} cy={y * 1.3} r={r * 1.2} fill="#5A22A8" opacity={0.85} />)}
    </Sale>
    <Txt x={1455} y={548} txt="ahora · 1:128" t={28} p={p('n128')} color={TXV.sangre} />
    <Txt x={1315} y={425} txt="×4" t={52} p={p('cuatro')} color={TXV.ambar} />
    <Flecha a={[1170, 330]} b={[1440, 320]} c={[1310, 230]} p={p('cuatro')} color={P.espiga[1]} w={9} />
    <Bandera x={1330} y={720} txt="sífilis" color={P.esp[0]} p={p('sifilis')} t={34} punta="no" />
    <Txt x={1330} y={810} txt="secundaria" t={60} p={p('secundaria')} color={TXV.violeta} />
  </g>
);

// ─── 1 · La erupción ─────────────────────────────────────────────────────────
const LaErupcion: Lamina = ({ p, reloj }) => {
  const hayFoto = useFotoCargada('palmas');
  const dif = easeOut(p('diseminaron'));
  const luz = 1 - 0.5 * easeOut(p('permeables'));
  const flat = 1 - tramo(p('eleva'), 0, 0.5);
  const flatC = 1 - tramo(p('descama'), 0, 0.5);
  const DOMO = (cx: number) => `M${cx - 210},548 L${cx - 210},524 Q${cx - 210},504 ${cx - 160},504 C${cx - 110},408 ${cx + 110},408 ${cx + 160},504 Q${cx + 210},504 ${cx + 210},524 L${cx + 210},548 Z`;
  return (
    <g>
      <Txt x={800} y={62} txt="la erupción" t={44} p={p('erupcion')} color={TXV.violeta} />
      {/* cuando llega «palmas y plantas», el dibujo se apaga y se ve la foto real */}
      <g opacity={1 - (hayFoto ? 0.82 : 0) * tramo(p('palmas'), 0, 0.6)}>
      {/* la sangre las lleva */}
      <g opacity={tramo(p('espiroquetas'), 0, 0.4)}>
        <rect x={110} y={130} width={1380} height={124} rx={62} fill="#6A0F2E" />
        <rect x={110} y={142} width={1380} height={100} rx={50} fill="#8A1030" />
        {[190, 410, 650, 890, 1130, 1370].map((x, i) => <ellipse key={x} cx={x + Math.sin(reloj / 900 + i) * 6} cy={192 + (i % 2 ? 22 : -22)} rx={26} ry={15} fill="#E5324C" />)}
      </g>
      {Array.from({ length: 6 }, (_, i) => <Treponema key={i} x={250 + i * 220 + 160 * dif} y={192 + (i % 2 ? -24 : 24)} w={96} amp={9} vueltas={3} grosor={7} r={hash(i, 3) * 40 - 20} reloj={reloj + i * 200} o={easeOut(tramo(p('espiroquetas'), i * 0.1, i * 0.1 + 0.4))} />)}
      <Txt x={330} y={292} txt="se diseminan por la sangre" t={24} p={p('sangre')} />
      <Flecha a={[800, 258]} b={[800, 400]} p={p('llegaron')} color={P.esp[1]} w={9} />
      {/* la piel, en corte: tres momentos de la lesión */}
      {[330, 800, 1270].map((cx) => <rect key={cx} x={cx - 210} y={540} width={420} height={170} rx={16} fill={P.piel[1]} opacity={tramo(p('dermis'), 0, 0.4)} />)}
      <rect x={120} y={502} width={420} height={46} rx={14} fill="#F7C9D8" opacity={tramo(p('dermis'), 0, 0.4)} />
      <rect x={120} y={502} width={420} height={46} rx={14} fill="#E5324C" opacity={0.62 * tramo(p('macula'), 0, 0.5)} />
      <rect x={590} y={502} width={420} height={46} rx={14} fill="#F7C9D8" opacity={tramo(p('dermis'), 0, 0.4) * flat} />
      <path d={DOMO(800)} fill="#F7C9D8" opacity={tramo(p('eleva'), 0, 0.5)} />
      <rect x={1060} y={502} width={420} height={46} rx={14} fill="#F7C9D8" opacity={tramo(p('dermis'), 0, 0.4) * flatC} />
      <path d={DOMO(1270)} fill="#F7C9D8" opacity={tramo(p('descama'), 0, 0.5)} />
      <path d={DOMO(1270)} fill="#B8602A" opacity={0.5 * tramo(p('cobriso'), 0, 0.5)} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1170 + i * 48} y={420 + (i % 2 ? 10 : 0) - 14 * easeOut(p('descama'))} width={34} height={10} rx={5} fill="#FFF" opacity={0.9 * tramo(p('descama'), 0.3, 0.8)} transform={`rotate(${(i - 2) * 9} ${1187 + i * 48} 430)`} />)}
      {/* vasos, inflamación perivascular, fuga */}
      {[330, 800, 1270].map((cx, s) => (
        <g key={cx}>
          <VasoCorte x={cx} y={630} r={34} luz={luz} o={tramo(p('vasos'), 0, 0.4)} />
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={cx + Math.cos(i * 1.05 + s) * 58} cy={630 + Math.sin(i * 1.05 + s) * 52} r={9} fill="#7B1470" opacity={tramo(p('inflamacion'), i * 0.1, i * 0.1 + 0.4)} />)}
          {[0, 1, 2].map((i) => <Sudor key={i} x={cx - 110 + i * 110} y={680} k={0.5} o={tramo(p('permeables'), i * 0.15, i * 0.15 + 0.4)} />)}
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={650 + i * 60} cy={560 + (i % 2) * 22} r={9} fill="#7B1470" opacity={tramo(p('infiltrado'), i * 0.08, i * 0.08 + 0.4)} />)}
      {[0, 1, 2, 3].map((i) => <Sudor key={i} x={700 + i * 70} y={520} k={0.55} o={tramo(p('edema'), i * 0.1, i * 0.1 + 0.4)} />)}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={1130 + (i % 4) * 90} cy={570 + Math.floor(i / 4) * 52} r={6} fill="#B8602A" opacity={tramo(p('pigmento'), i * 0.06, i * 0.06 + 0.4)} />)}
      <Txt x={330} y={770} txt="mácula: roja y plana" t={24} p={p('macula')} />
      <Txt x={800} y={770} txt="pápula: más infiltrado y edema" t={24} p={p('papula')} />
      <Txt x={1270} y={770} txt="descamación fina" t={24} p={p('descama')} />
      <Txt x={1270} y={800} txt="color cobrizo: pigmento de microhemorragias" t={22} p={p('pigmento')} color={TXV.ambar} />
      {/* no pica, es simétrica y generalizada, y afecta palmas y plantas */}
      <g opacity={tramo(p('pica'), 0, 0.4)}>
        {[0, 1, 2].map((i) => <path key={i} d={`M${290 + i * 26},850 l10,-22 l10,22 l10,-22`} fill="none" stroke="#C0143C" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />)}
      </g>
      <Cruz x={330} y={845} k={1.3} p={p('pica')} />
      <Txt x={330} y={942} txt="no pica" t={28} p={p('pica')} />
      <line x1={800} y1={820} x2={800} y2={895} stroke="#7A5AC8" strokeWidth={4} strokeDasharray="10 8" opacity={tramo(p('simetrica'), 0, 0.5)} />
      {[[-34, 0], [-62, 22]].map(([dx, dy], i) => <circle key={i} cx={800 + dx} cy={840 + dy} r={9} fill="#D9822B" opacity={tramo(p('simetrica'), 0, 0.5)} />)}
      {[[34, 0], [62, 22]].map(([dx, dy], i) => <circle key={i} cx={800 + dx} cy={840 + dy} r={9} fill="#D9822B" opacity={tramo(p('simetrica'), 0.2, 0.7)} />)}
      {[[-90, -6], [-98, 30], [90, -6], [98, 30], [-12, 60], [14, 60]].map(([dx, dy], i) => <circle key={i} cx={800 + dx} cy={840 + dy} r={8} fill="#D9822B" opacity={tramo(p('generalizada'), i * 0.1, i * 0.1 + 0.4)} />)}
      <Txt x={715} y={942} txt="simétrica" t={26} p={p('simetrica')} />
      <Txt x={890} y={942} txt="y generalizada" t={26} p={p('generalizada')} />
      <Palma x={1210} y={888} k={0.34} puntos={easeOut(p('palmas'))} o={tramo(p('palmas'), 0, 0.4)} />
      <g transform="translate(1340,891)" opacity={tramo(p('plantas'), 0, 0.4)}>
        <ellipse cx={4} cy={8} rx={32} ry={52} fill={P.sombra} /><ellipse rx={32} ry={52} fill={P.piel2[1]} />
        {[-20, -8, 5, 17, 27].map((x, i) => <circle key={i} cx={x} cy={-58 + Math.abs(x) * 0.22} r={9 - i * 0.6} fill={P.piel2[1]} />)}
        {[[-8, -10], [10, 14], [-4, 30], [12, -22]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6 * easeOut(p('plantas'))} fill="#B8602A" />)}
      </g>
      <Txt x={1210} y={942} txt="palmas" t={26} p={p('palmas')} />
      <Txt x={1340} y={942} txt="y plantas" t={26} p={p('plantas')} />
      <Txt x={800} y={980} txt="la separa de muchas erupciones virales o alérgicas" t={22} p={p('virales')} color={TXV.ambar} />
      </g>
      <FotoCuadro x={800} y={500} w={560} h={420} foto="palmas" o={p('palmas')} credito="dentro" />
    </g>
  );
};

// ─── 2 · Condilomas lata ─────────────────────────────────────────────────────
const CondilomasLata: Lamina = ({ p, reloj }) => {
  const prol = easeOut(p('proliferan'));
  const luz = 1 - 0.78 * easeOut(p('endarteritis'));
  const CEL: [number, number][] = [[800, 610], [905, 634], [1010, 604], [1115, 640], [1220, 606], [1325, 632], [1430, 604], [850, 705], [1050, 715], [1280, 712]];
  return (
    <g>
      <Txt x={800} y={66} txt="condilomas lata" t={44} p={p('condilomas')} color={TXV.violeta} />
      <g transform="translate(0,-70)">
      {/* las zonas húmedas, calientes y con roce */}
      <Txt x={250} y={345} txt="una espiroqueta se deposita" t={22} p={p('espiroqueta')} />
      <Cuerpo x={250} y={570} k={0.55} o={tramo(p('zonas'), 0, 0.4)}>
        <circle cx={0} cy={74} r={78} fill="#FF8A1E" opacity={0.6 * tramo(p('calientes'), 0, 0.5)} />
      </Cuerpo>
      <Sudor x={196} y={655} o={tramo(p('humedas'), 0, 0.5)} /><Sudor x={304} y={655} o={tramo(p('humedas'), 0.2, 0.7)} /><Sudor x={250} y={690} k={1.2} o={tramo(p('humedas'), 0.4, 0.9)} />
      <Flecha a={[190, 722]} b={[236, 722]} p={p('roce')} color="#C0143C" w={7} /><Flecha a={[310, 722]} b={[264, 722]} p={p('roce')} color="#C0143C" w={7} />
      <Txt x={250} y={790} txt="húmedas, calientes y con roce" t={22} p={p('humedas')} />
      {[['genitales', 'genitales', 440], ['periné', 'perime', 495], ['región perianal', 'perianal', 550], ['ingles', 'ingles', 605]].map(([txt, , y], i) => (
        <g key={i} opacity={[tramo(p('genitales'), 0, 0.4), tramo(p('perime'), 0, 0.4), tramo(p('perianal'), 0, 0.4), tramo(p('ingles'), 0, 0.4)][i]}>
          <Trazo pts={[[400, y as number], [300, 600 + (i - 1.5) * 8]]} p={1} color="#7A5AC8" w={4} />
          <Bandera x={400} y={y as number} txt={txt as string} color={P.sangre[0]} p={1} t={22} punta="izq" ancla="izq" />
        </g>
      ))}
      {/* la lesión, en corte */}
      <g opacity={tramo(p('inflamacion'), 0, 0.4)}>
        <rect x={740} y={570} width={760} height={220} rx={16} fill={P.piel[1]} />
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={764 + i * 90} y={560} width={52} height={30 + 82 * prol} rx={26} fill="#F2A8C0" opacity={tramo(p('keratinocitos'), 0, 0.4)} />)}
      <rect x={740} y={500} width={760} height={74} rx={16} fill="#F7C9D8" opacity={tramo(p('inflamacion'), 0, 0.4) * (1 - tramo(p('eleva'), 0, 0.5))} />
      <path d="M740,574 L740,522 Q740,500 800,500 C900,430 1340,430 1440,500 Q1500,500 1500,522 L1500,574 Z" fill="#F7C9D8" opacity={tramo(p('eleva'), 0, 0.5)} />
      <path d="M770,506 C900,438 1340,438 1470,506 L1470,476 C1340,408 900,408 770,476 Z" fill="#BFC2C6" opacity={tramo(p('maceran'), 0, 0.5)} />
      <path d="M800,460 C900,410 1340,410 1440,460" fill="none" stroke="#FFF" strokeWidth={8} strokeLinecap="round" opacity={0.6 * tramo(p('exudado'), 0, 0.5)} />
      {CEL.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#7B1470" opacity={tramo(p('inflamacion'), (i / 10) * 0.5, (i / 10) * 0.5 + 0.4)} />)}
      {[[860, 640], [1000, 656], [1190, 646], [1340, 640]].map(([x, y], i) => <Sudor key={i} x={x} y={y} k={0.6} o={tramo(p('edema'), i * 0.1, i * 0.1 + 0.4)} />)}
      <VasoCorte x={1120} y={735} r={42} luz={luz} o={tramo(p('endarteritis'), 0, 0.4)} />
      {[900, 1010, 1120, 1230, 1340].map((x, i) => <Treponema key={x} x={x} y={452 - Math.abs(x - 1120) * 0.06} w={74} amp={7} vueltas={3} grosor={6} r={hash(i, 2) * 30 - 15} reloj={reloj + i * 230} o={easeOut(tramo(p('muchisimas'), i * 0.12, i * 0.12 + 0.4))} />)}
      <Txt x={1120} y={392} txt="se eleva como pápula o placa" t={24} p={p('papula')} />
      <Txt x={880} y={835} txt="inflamación y edema" t={22} p={p('edema')} />
      <Txt x={1120} y={835} txt="endarteritis" t={22} p={p('endarteritis')} />
      <Txt x={1350} y={835} txt="queratinocitos proliferan" t={22} p={p('keratinocitos')} />
      <Txt x={1000} y={888} txt="humedad y fricción maceran" t={22} p={p('maceran')} />
      <Txt x={1330} y={888} txt="exudado grisáceo" t={22} p={p('exudado')} />
      <Txt x={1000} y={945} txt="muchísimas espiroquetas" t={26} p={p('muchisimas')} color={TXV.esp} />
      <Txt x={1330} y={945} txt="muy contagiosos" t={30} p={p('contagiosos')} color={TXV.sangre} />
      </g>
      <FotoCuadro x={760} y={215} w={260} h={195} foto="condiloma-plano" o={p('condilomas')} credito={[760, 340]} />
    </g>
  );
};

// ─── 3 · Placas mucosas ──────────────────────────────────────────────────────
const PlacasMucosas: Lamina = ({ p, reloj }) => {
  const MOJ = '#EFE8DC';
  const jun = easeOut(p('juntan'));
  return (
    <g>
      <Txt x={800} y={62} txt="placas mucosas" t={44} p={p('placas')} color={TXV.violeta} />
      {/* la boca, abierta */}
      <g opacity={tramo(p('boca'), 0, 0.4)} transform="translate(520,500)">
        <ellipse cx={8} cy={12} rx={330} ry={210} fill={P.sombra} />
        <ellipse rx={330} ry={210} fill="#C0284A" /><ellipse rx={314} ry={196} fill="#E5324C" />
        <ellipse rx={250} ry={146} fill="#5A0F2E" />
        <ellipse cy={-62} rx={200} ry={66} fill="#F29FB5" />
        <ellipse cx={-130} cy={10} rx={44} ry={60} fill="#D6486B" /><ellipse cx={130} cy={10} rx={44} ry={60} fill="#D6486B" />
        <path d="M-16,-46 Q0,-4 16,-46 Z" fill="#D6486B" />
        <ellipse cy={80} rx={170} ry={62} fill="#F0759A" /><ellipse cx={-8} cy={72} rx={150} ry={50} fill="#F79AB8" />
        <path d="M0,44 L0,104" stroke="#E0648A" strokeWidth={6} strokeLinecap="round" />
        <path d="M-210,-100 Q0,-146 210,-100" fill="none" stroke="#FFF" strokeWidth={9} strokeLinecap="round" opacity={0.2} />
      </g>
      <g transform="translate(520,500)">
        <ellipse cx={0} cy={-72} rx={74} ry={24} fill={MOJ} opacity={tramo(p('paladar'), 0, 0.5)} />
        <ellipse cx={-44} cy={82} rx={66} ry={24} fill={MOJ} opacity={tramo(p('lengua'), 0, 0.5)} />
        <ellipse cx={62} cy={92} rx={44} ry={18} fill={MOJ} opacity={tramo(p('lengua'), 0.2, 0.7)} />
        <ellipse cx={-120} cy={172} rx={72} ry={14} fill={MOJ} opacity={tramo(p('labios'), 0, 0.5)} />
        <ellipse cx={116} cy={-172} rx={62} ry={12} fill={MOJ} opacity={tramo(p('labios'), 0.2, 0.7)} />
        <ellipse cx={-214} cy={24} rx={26} ry={52} fill={MOJ} opacity={tramo(p('mejillas'), 0, 0.5)} />
        <ellipse cx={214} cy={24} rx={26} ry={52} fill={MOJ} opacity={tramo(p('mejillas'), 0.2, 0.7)} />
        <ellipse cx={-130} cy={10} rx={28} ry={38} fill={MOJ} opacity={tramo(p('amigdalas'), 0, 0.5)} />
        <ellipse cx={130} cy={10} rx={28} ry={38} fill={MOJ} opacity={tramo(p('amigdalas'), 0.2, 0.7)} />
      </g>
      <Trazo pts={[[520, 276], [520, 424]]} p={easeOut(p('paladar'))} color="#7A5AC8" w={4} />
      <Txt x={520} y={254} txt="paladar" t={24} p={p('paladar')} />
      <Trazo pts={[[200, 500], [304, 524]]} p={easeOut(p('mejillas'))} color="#7A5AC8" w={4} />
      <Txt x={140} y={496} txt="mejillas" t={24} p={p('mejillas')} />
      <Trazo pts={[[400, 746], [400, 676]]} p={easeOut(p('labios'))} color="#7A5AC8" w={4} />
      <Txt x={400} y={770} txt="labios" t={24} p={p('labios')} />
      <Trazo pts={[[520, 770], [520, 590]]} p={easeOut(p('lengua'))} color="#7A5AC8" w={4} />
      <Txt x={520} y={794} txt="lengua" t={24} p={p('lengua')} />
      <Trazo pts={[[780, 760], [650, 520]]} p={easeOut(p('amigdalas'))} color="#7A5AC8" w={4} />
      <Txt x={780} y={784} txt="amígdalas" t={24} p={p('amigdalas')} />
      <Txt x={520} y={880} txt="grises, blanquecinas o rosadas, brillantes" t={22} p={p('brillante')} color={TXV.ambar} />
      {/* el corte: una erosión cubierta por una seudomembrana */}
      <rect x={940} y={360} width={560} height={120} rx={14} fill={P.piel[1]} opacity={tramo(p('erosion'), 0, 0.4)} />
      <rect x={940} y={330} width={560} height={40} rx={14} fill="#F7C9D8" opacity={tramo(p('erosion'), 0, 0.4)} />
      <ellipse cx={1220} cy={346} rx={150} ry={36} fill="#FDE9F0" opacity={tramo(p('erosion'), 0, 0.5)} />
      <path d="M1070,340 C1100,262 1340,262 1370,340 Z" fill="#F4EEDF" opacity={tramo(p('pseudo'), 0, 0.5)} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <path key={i} d={`M${1110 + i * 32},${328 - (i % 3) * 8} l26,-${22 + (i % 2) * 8}`} stroke="#FFF" strokeWidth={5} strokeLinecap="round" opacity={tramo(p('fibrina'), i * 0.08, i * 0.08 + 0.4)} />)}
      {[[1140, 318], [1200, 296], [1260, 312], [1320, 300], [1180, 330], [1290, 332]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={8} fill="#7B1470" opacity={tramo(p('celulas'), i * 0.08, i * 0.08 + 0.4)} />)}
      {[[1160, 306], [1230, 322], [1300, 318], [1350, 332], [1120, 334]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill="#8A8794" opacity={tramo(p('restos'), i * 0.08, i * 0.08 + 0.4)} />)}
      <Txt x={1220} y={515} txt="erosión" t={26} p={p('erosion')} color={TXV.sangre} />
      <Txt x={1220} y={553} txt="cubierta por una seudomembrana" t={24} p={p('pseudo')} />
      <Txt x={1220} y={589} txt="de fibrina" t={24} p={p('fibrina')} />
      <Txt x={1220} y={625} txt="células inflamatorias" t={24} p={p('celulas')} />
      <Txt x={1220} y={661} txt="y restos celulares" t={24} p={p('restos')} />
      <Txt x={1220} y={707} txt="de ahí el color blanco" t={26} p={p('blanco')} color={TXV.ambar} />
      {/* varias placas se juntan: huella de caracol */}
      {[0, 1, 2].map((i) => <circle key={i} cx={lerp(930 + i * 52, 990, jun * 0.6)} cy={850 + (i % 2 ? 8 : -8)} r={26} fill={MOJ} opacity={tramo(p('juntan'), 0, 0.4)} />)}
      <Txt x={990} y={915} txt="varias placas se juntan" t={22} p={p('juntan')} />
      <Trazo pts={[[1080, 850], [1130, 810], [1190, 880], [1250, 820], [1300, 880], [1340, 850]]} p={easeOut(p('alargadas'))} color="#F2A8C0" w={24} />
      <Txt x={1210} y={945} txt="úlceras alargadas" t={22} p={p('alargadas')} />
      <Trazo pts={[[1080, 850], [1130, 810], [1190, 880], [1250, 820], [1300, 880], [1340, 850]]} p={easeOut(p('rastro'))} color="#FFF" w={8} />
      <Sale p={p('caracol')} x={1420} y={850}><Caracol k={0.5} reloj={reloj} /></Sale>
      <Txt x={1420} y={950} txt="«huella de caracol»" t={26} p={p('caracol')} color={TXV.violeta} />
      <FotoCuadro x={1260} y={170} w={240} h={160} foto="placas-mucosas" o={p('placas')} credito="arriba" />
    </g>
  );
};

// ─── 4 · Alopecia ────────────────────────────────────────────────────────────
const Alopecia: Lamina = ({ p, reloj }) => {
  const hayFoto = useFotoCargada('alopecia');
  const R = 130, C = 2 * Math.PI * R;
  const grados = lerp(24, 190, easeOut(p('ciclo'))) + lerp(0, 92, easeOut(p('antes')));
  const bx = 1130 + R * Math.sin((grados * Math.PI) / 180), by = 290 - R * Math.cos((grados * Math.PI) / 180);
  const luzC = 1 - 0.7 * easeOut(p('vasculitis'));
  const pelo = 0.62 * easeOut(p('difusa'));
  const crece = easeOut(p('revierte'));
  const fino = 16 - 8 * easeOut(p('adelgazan'));
  return (
    <g>
      <Txt x={800} y={62} txt="la alopecia de la sífilis" t={42} p={p('cabello')} color={TXV.violeta} />
      {/* el folículo, en corte */}
      <Txt x={390} y={175} txt="las espiroquetas llegan al folículo" t={22} p={p('llegan')} />
      <rect x={100} y={330} width={560} height={36} rx={14} fill="#F7C9D8" opacity={tramo(p('foliculo'), 0, 0.4)} />
      <rect x={100} y={366} width={560} height={430} rx={14} fill={P.piel[1]} opacity={tramo(p('foliculo'), 0, 0.4)} />
      <g opacity={tramo(p('foliculo'), 0, 0.4)}>
        <rect x={342} y={340} width={76} height={340} rx={38} fill="#F2A8C0" />
        <circle cx={380} cy={690} r={64} fill="#F7C9D8" /><circle cx={380} cy={712} r={26} fill="#E5324C" />
        <rect x={380 - fino / 2} y={250} width={fino} height={430} rx={fino / 2} fill="var(--vs-pelo)" />
      </g>
      <Trazo pts={[[560, 440], [420, 440]]} p={easeOut(p('foliculo'))} color="#7A5AC8" w={4} />
      <Bandera x={560} y={440} txt="folículo piloso" color={P.hla[0]} p={p('foliculo')} t={24} punta="izq" ancla="izq" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={380 + (i % 2 ? 1 : -1) * (58 + (i % 3) * 14)} cy={395 + Math.floor(i / 2) * 46} r={9} fill="#7B1470" opacity={tramo(p('infiltrado'), (i / 12) * 0.5, (i / 12) * 0.5 + 0.4)} />)}
      {[[300, 718], [460, 718], [380, 790]].map(([x, y], i) => (
        <g key={i}>
          <VasoCorte x={x} y={y} r={24} luz={luzC} o={tramo(p('capilares'), i * 0.12, i * 0.12 + 0.4)} />
          <circle cx={x} cy={y} r={29} fill="none" stroke="#FFD23F" strokeWidth={6} opacity={easeOut(p('vasculitis'))} />
        </g>
      ))}
      {[0, 1, 2].map((i) => <Treponema key={i} x={lerp(640, 470, easeOut(p('llegan'))) + i * 14} y={470 + i * 56} w={72} amp={7} vueltas={3} grosor={6} r={-10 + i * 8} reloj={reloj + i * 240} o={tramo(p('espiroquetas'), i * 0.1, i * 0.1 + 0.4)} />)}
      <Txt x={390} y={835} txt="infiltrado perifolicular" t={24} p={p('infiltrado')} />
      <Txt x={390} y={878} txt="vasculitis de los capilares del bulbo" t={22} p={p('vasculitis')} color={TXV.ambar} />
      <Txt x={390} y={920} txt="que lo irrigan" t={22} p={p('irrigan')} />
      {/* el ciclo del cabello se detiene */}
      <circle cx={1130} cy={290} r={R} fill="none" stroke="#B7AEDB" strokeWidth={46} opacity={0.35 * tramo(p('ciclo'), 0, 0.4)} />
      {[[0, 0.6, '#2FD79A'], [0.6, 0.1, '#FFB62B'], [0.7, 0.3, '#E5324C']].map(([ini, lon, col], i) => (
        <circle key={i} cx={1130} cy={290} r={R} fill="none" stroke={col as string} strokeWidth={46} strokeDasharray={`${C * (lon as number) - 3} ${C}`} strokeDashoffset={-C * (ini as number)} transform="rotate(-90 1130 290)" opacity={tramo(p('fases'), i * 0.2, i * 0.2 + 0.5)} />
      ))}
      <g opacity={tramo(p('ciclo'), 0, 0.4)}><circle cx={bx} cy={by} r={21} fill="#2A1A5A" /><circle cx={bx} cy={by} r={15} fill="#FFF" /></g>
      <Cruz x={1130} y={290} k={1.3} p={p('detiene')} />
      <Txt x={1130} y={120} txt="el ciclo del cabello se detiene" t={24} p={p('detiene')} />
      <Txt x={1130} y={472} txt="los pelos pasan antes de tiempo al reposo" t={22} p={p('antes')} />
      <Txt x={1290} y={352} txt="anágena · crece" t={22} ancla="start" p={p('fases')} color={TXV.verde} />
      <Txt x={920} y={412} txt="catágena" t={22} ancla="end" p={p('fases')} color={TXV.ambar} />
      <Txt x={920} y={170} txt="telógena · reposo" t={22} ancla="end" p={p('reposo')} color={TXV.sangre} />
      {/* los pelos se adelgazan y caen, de forma difusa */}
      {/* la foto real sustituye al paciente dibujado; si no carga, se queda el dibujo con sus pelos que caen */}
      <FotoCuadro x={880} y={690} w={210} h={284} foto="alopecia" o={p('adelgazan')} credito={[880, 884]} fallback={<>
      <Sale p={p('adelgazan')} x={880} y={745}><Hombre k={0.42} pelon={pelo} /></Sale>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const u = easeOut(tramo(p('caen'), i * 0.1, i * 0.1 + 0.7));
        const x = i < 3 ? 735 + i * 30 : 965 + (i - 3) * 30;
        return <path key={i} d="M0,0 q9,14 0,30" fill="none" stroke="var(--vs-pelo)" strokeWidth={4} strokeLinecap="round" transform={`translate(${x},${660 + u * 230}) rotate(${(i % 3 - 1) * 20})`} opacity={tramo(p('caen'), i * 0.1, i * 0.1 + 0.2) * (1 - 0.7 * u)} />;
      })}
      </>} />
      <Txt x={880} y={912} txt="a veces en parches: «apolillada»" t={20} p={hayFoto ? p('difusa') : 0} color={TXV.ambar} />
      <Txt x={700} y={945} txt="se adelgazan" t={22} p={p('adelgazan')} />
      <Txt x={830} y={945} txt="y caen" t={22} p={p('caen')} />
      <Txt x={950} y={945} txt="de forma difusa" t={22} p={p('difusa')} />
      {/* no es cicatricial: el folículo sobrevive y revierte */}
      <g transform="translate(1190,745)" opacity={tramo(p('foliculo2'), 0, 0.4)}>
        <rect x={-14} y={-60} width={28} height={92} rx={14} fill="#F2A8C0" /><circle cy={40} r={26} fill="#F7C9D8" /><circle cy={48} r={11} fill="#E5324C" />
        <rect x={-3} y={-86} width={6} height={118} rx={3} fill="var(--vs-pelo)" />
      </g>
      <Visto x={1236} y={690} k={0.9} p={p('foliculo2')} />
      <Parche x={1330} y={750} rx={52} ry={40} o={tramo(p('cicatriz'), 0, 0.4)} />
      <path d="M1304,740 L1356,760" stroke="#C0143C" strokeWidth={6} strokeLinecap="round" opacity={tramo(p('cicatriz'), 0, 0.4)} />
      <Cruz x={1330} y={750} k={1.1} p={p('cicatriz')} />
      <g transform="translate(1470,745)" opacity={tramo(p('revierte'), 0, 0.4)}>
        <rect x={-14} y={-20} width={28} height={52} rx={14} fill="#F2A8C0" /><circle cy={40} r={26} fill="#F7C9D8" /><circle cy={48} r={11} fill="#E5324C" />
        <rect x={-3} y={-20 - 80 * crece} width={6} height={52 + 80 * crece} rx={3} fill="var(--vs-pelo)" />
      </g>
      <Txt x={1190} y={832} txt="el folículo" t={20} p={p('foliculo2')} /><Txt x={1190} y={858} txt="sobrevive" t={20} p={p('foliculo2')} />
      <Txt x={1330} y={832} txt="no deja" t={20} p={p('cicatriz')} /><Txt x={1330} y={858} txt="cicatriz" t={20} p={p('cicatriz')} />
      <Txt x={1470} y={832} txt="revierte con" t={20} p={p('revierte')} color={TXV.verde} /><Txt x={1470} y={858} txt="tratamiento" t={20} p={p('revierte')} color={TXV.verde} />
      <Txt x={1330} y={893} txt="puede confundirse con otras alopecias" t={22} p={p('confundir')} />
      <Txt x={1330} y={930} txt="efluvio telógeno, androgenética, areata, tiña" t={18} p={p('alopecias')} color={TXV.ambar} />
      <Txt x={1330} y={966} txt="por eso se piden pruebas" t={22} p={p('pruebas')} color={TXV.violeta} />
    </g>
  );
};

// ─── 5 · La secundaria se apaga, la latente se esconde ───────────────────────
const Latente: Lamina = ({ p, reloj }) => {
  const apaga = 1 - easeOut(p('resuelven'));
  const MARCAS: [number, number][] = [[-42, -110], [30, -95], [-26, -50], [44, -32], [-40, 0], [20, 20]];
  const ESP: [number, number][] = [[-30, -60], [26, -40], [-10, 10], [30, 40], [-34, 100], [24, 150]];
  return (
    <g>
      <Txt x={800} y={62} txt="la secundaria se apaga…" t={40} p={p('secundaria')} color={TXV.violeta} />
      {/* se resuelve sola, pero la infección sigue */}
      <Cuerpo x={250} y={330} k={0.46}>
        {MARCAS.map(([x, y], i) => <Punto key={i} x={x} y={y} color="#D9822B" p={apaga * tramo(p('lesiones'), 0, 0.4)} />)}
        {ESP.map(([x, y], i) => <Treponema key={i} x={x} y={y} w={70} amp={7} vueltas={3} grosor={9} r={hash(i, 3) * 180} reloj={reloj + i * 200} o={easeOut(tramo(p('infeccion'), i * 0.08, i * 0.08 + 0.4))} />)}
      </Cuerpo>
      <Txt x={250} y={520} txt="las lesiones se resuelven solas" t={22} p={p('resuelven')} />
      <Txt x={250} y={552} txt="en semanas" t={22} p={p('semanas')} />
      <Txt x={250} y={600} txt="pero la infección sigue" t={26} p={p('sigue')} color={TXV.sangre} />
      {/* la latente: sin síntomas, con serología reactiva */}
      <Bandera x={800} y={165} txt="fase latente" color={P.copa[0]} p={p('latente')} t={34} punta="abajo" />
      <Cuerpo x={800} y={365} k={0.46} o={tramo(p('latente'), 0, 0.5)}>
        {ESP.map(([x, y], i) => <Treponema key={i} x={x} y={y} w={70} amp={7} vueltas={3} grosor={9} r={hash(i, 5) * 180} reloj={reloj + i * 260} />)}
      </Cuerpo>
      <Txt x={800} y={550} txt="sin síntomas" t={26} p={p('sintomas')} color={TXV.verde} />
      <Sale p={p('reactiva')} x={1090} y={330}>
        <circle cx={4} cy={6} r={74} fill={P.sombra} /><circle r={74} fill="#E4DAF8" /><circle r={60} fill="#FFF" />
        {GRUMOS.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#5A22A8" opacity={0.85} />)}
      </Sale>
      <Signo x={1158} y={268} k={0.8} p={p('reactiva')} />
      <Txt x={1090} y={440} txt="serología reactiva" t={24} p={p('serologia')} />
      {/* temprana o tardía; puede durar meses, años o toda la vida */}
      <rect x={140} y={690} width={420} height={44} rx={22} fill="#2FD79A" opacity={tramo(p('temprana'), 0, 0.5)} />
      <rect x={560} y={690} width={540} height={44} rx={22} fill="#FFB62B" opacity={tramo(p('tardia'), 0, 0.5)} />
      <path d="M1130,712 L1450,712" stroke="#E5324C" strokeWidth={14} strokeLinecap="round" strokeDasharray="30 18" opacity={tramo(p('durar'), 0, 0.5)} />
      <path d="M1440,690 L1480,712 L1440,734 Z" fill="#E5324C" opacity={tramo(p('durar'), 0, 0.5)} />
      <Txt x={350} y={650} txt="temprana" t={28} p={p('temprana')} color={TXV.verde} />
      <Txt x={350} y={775} txt="menos de un año" t={24} p={p('menos')} />
      <Txt x={830} y={650} txt="tardía" t={28} p={p('tardia')} color={TXV.ambar} />
      <Txt x={830} y={775} txt="más de un año, o no se sabe cuánto" t={24} p={p('tiempo')} />
      <Txt x={1290} y={650} txt="puede durar" t={26} p={p('durar')} />
      <Txt x={1170} y={768} txt="meses" t={24} p={p('meses')} />
      <Txt x={1290} y={768} txt="años" t={24} p={p('anos')} />
      <Txt x={1410} y={768} txt="toda la vida" t={24} p={p('vida')} color={TXV.sangre} />
      {/* en cualquier etapa puede alcanzar ojos, oídos o sistema nervioso */}
      <Txt x={800} y={850} txt="en cualquier etapa puede alcanzar…" t={26} p={p('cualquier')} />
      <Sale p={p('ojos')} x={560} y={920}>
        <path d="M-58,0 Q0,-50 58,0 Q0,50 -58,0 Z" fill="#FFF" /><circle r={25} fill="#16B9BE" /><circle r={11} fill="#1A0B3A" /><circle cx={-7} cy={-8} r={4.5} fill="#FFF" />
      </Sale>
      <Sale p={p('oidos')} x={800} y={920}>
        <path d="M-8,-46 C-48,-46 -52,-6 -34,18 C-26,30 -34,44 -14,48 C10,52 28,34 26,8 C24,-24 12,-46 -8,-46 Z" fill={P.piel2[1]} />
        <path d="M-6,-26 C-26,-26 -26,0 -12,12" fill="none" stroke={P.piel2[0]} strokeWidth={7} strokeLinecap="round" />
      </Sale>
      <Sale p={p('nervioso')} x={1040} y={918}><Cerebro k={0.3} /></Sale>
      <Txt x={560} y={978} txt="ojos" t={22} p={p('ojos')} />
      <Txt x={800} y={978} txt="oídos" t={22} p={p('oidos')} />
      <Txt x={1040} y={978} txt="sistema nervioso" t={22} p={p('nervioso')} />
    </g>
  );
};

// ─── 6 · Terciaria ───────────────────────────────────────────────────────────
const Terciaria: Lamina = ({ p }) => {
  const aneu = easeOut(p('aneurismas'));
  return (
    <g>
      <Txt x={800} y={58} txt="después de años, sin tratamiento…" t={32} p={p('anos')} color={TXV.violeta} />
      <Txt x={800} y={98} txt="una parte de los pacientes" t={24} p={p('parte')} />
      <Txt x={800} y={146} txt="llega a la sífilis terciaria" t={36} p={p('terciaria')} color={TXV.sangre} />
      <Txt x={800} y={186} txt="con tres caras" t={24} p={p('caras')} color={TXV.ambar} />
      <Bandera x={270} y={240} txt="goma" color={P.sangre[0]} p={p('goma')} t={32} punta="abajo" />
      <Bandera x={800} y={240} txt="cardiovascular" color={P.hla[0]} p={p('cardiovascular')} t={32} punta="abajo" />
      <Bandera x={1330} y={240} txt="neurosífilis" color={P.cd4[0]} p={p('neurosifilis')} t={32} punta="abajo" />
      {/* la goma */}
      <Granuloma x={270} y={470} k={0.8} p={tramo(p('goma'), 0, 0.6)} necrosis={easeOut(p('necrotico'))} />
      <Txt x={270} y={690} txt="lesión granulomatosa y destructiva" t={22} p={p('granulomatosa')} />
      <Txt x={270} y={724} txt="centro necrótico" t={22} p={p('necrotico')} color={TXV.ambar} />
      <Txt x={270} y={758} txt="tiende a ulcerarse" t={22} p={p('ulcerarse')} />
      <Parche x={140} y={850} rx={46} ry={34} o={tramo(p('piel'), 0, 0.4)} />
      <Hueso x={270} y={850} o={tramo(p('hueso'), 0, 0.4)} />
      <Sale p={p('higado')} x={400} y={850}><Higado k={0.28} /></Sale>
      <Txt x={140} y={925} txt="piel" t={22} p={p('piel')} />
      <Txt x={270} y={925} txt="hueso" t={22} p={p('hueso')} />
      <Txt x={400} y={925} txt="hígado" t={22} p={p('higado')} />
      {/* la aorta */}
      <path d="M800,740 L800,480 Q800,390 880,390 L930,390" fill="none" stroke="#8A1030" strokeWidth={74} strokeLinecap="round" opacity={tramo(p('cardiovascular'), 0, 0.5)} />
      <path d="M800,740 L800,480 Q800,390 880,390 L930,390" fill="none" stroke="#E5324C" strokeWidth={46} strokeLinecap="round" opacity={tramo(p('cardiovascular'), 0, 0.5)} />
      <circle cx={800} cy={560} r={38 + 40 * aneu} fill="#B5183F" opacity={tramo(p('aneurismas'), 0, 0.4)} />
      <circle cx={800} cy={560} r={20 + 26 * aneu} fill="#E5324C" opacity={tramo(p('aneurismas'), 0, 0.4)} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={800 + Math.cos(i * 0.8) * 50} cy={470 + i * 30} r={8} fill="#7B1470" opacity={tramo(p('hortitis'), i * 0.08, i * 0.08 + 0.4)} />)}
      <path d="M766,420 L766,520 M834,430 L834,520" stroke="#FFD23F" strokeWidth={5} strokeDasharray="10 9" strokeLinecap="round" opacity={tramo(p('debilita'), 0, 0.5)} />
      <path d="M764,742 Q780,774 798,762 M836,742 Q820,774 802,762" fill="none" stroke="#FFB62B" strokeWidth={9} strokeLinecap="round" opacity={tramo(p('valvula'), 0, 0.5)} />
      <Flecha a={[800, 690]} b={[800, 790]} p={p('fallo')} color="#FF3B3B" w={9} />
      <Txt x={910} y={330} txt="aortitis" t={24} ancla="start" p={p('hortitis')} color={TXV.sangre} />
      <Txt x={910} y={470} txt="aorta ascendente" t={22} ancla="start" p={p('ascendente')} />
      <Txt x={910} y={520} txt="aneurisma" t={24} ancla="start" p={p('aneurismas')} color={TXV.sangre} />
      <Txt x={910} y={568} txt="pared debilitada" t={22} ancla="start" p={p('debilita')} color={TXV.ambar} />
      <Txt x={800} y={850} txt="insuficiencia de la válvula aórtica" t={24} p={p('valvula')} />
      {/* el sistema nervioso */}
      <ellipse cx={1330} cy={430} rx={150} ry={124} fill="none" stroke="#FFB62B" strokeWidth={9} strokeDasharray="22 12" opacity={tramo(p('meningitis'), 0, 0.5)} />
      <Sale p={p('neurosifilis')} x={1330} y={430}><Cerebro k={0.8} /></Sale>
      <ellipse cx={1330} cy={430} rx={120} ry={100} fill="#5A5A6A" opacity={0.4 * easeOut(p('demencia'))} />
      <Txt x={1330} y={590} txt="meningitis" t={24} p={p('meningitis')} color={TXV.ambar} />
      <Txt x={1330} y={626} txt="demencia" t={24} p={p('demencia')} />
      <Sale p={p('perdida')} x={1250} y={750}>
        <circle r={64} fill="#F7C9D8" /><path d="M-6,-30 C-44,-50 -50,-6 -30,10 C-46,34 -22,50 -6,34 Z M6,-30 C44,-50 50,-6 30,10 C46,34 22,50 6,34 Z" fill="#E07A9E" />
        <ellipse cx={-26} cy={-50} rx={14} ry={11} fill="#5A22A8" opacity={0.9} /><ellipse cx={26} cy={-50} rx={14} ry={11} fill="#5A22A8" opacity={0.9} />
      </Sale>
      <Txt x={1250} y={842} txt="tabes dorsal" t={24} p={p('perdida')} color={TXV.violeta} />
      <Txt x={1250} y={878} txt="sin sensibilidad profunda" t={20} p={p('sensibilidad')} />
      <Sale p={p('marcha')} x={1440} y={750}>
        <ellipse cx={-34} cy={14} rx={20} ry={40} fill={P.piel2[0]} /><ellipse cx={34} cy={-14} rx={20} ry={40} fill={P.piel2[0]} />
        <path d="M-60,70 L-20,40 L20,70 L60,40" fill="none" stroke="#7A5AC8" strokeWidth={5} strokeDasharray="8 8" strokeLinecap="round" />
      </Sale>
      <Txt x={1440} y={842} txt="marcha inestable" t={24} p={p('marcha')} />
    </g>
  );
};

// ─── 7 · Congénita ───────────────────────────────────────────────────────────
const Congenita: Lamina = ({ p, reloj }) => (
  <g>
    <Txt x={800} y={62} txt="sífilis congénita" t={44} p={p('infectada')} color={TXV.violeta} />
    {/* la espiroqueta cruza la placenta */}
    <Txt x={400} y={150} txt="madre infectada y embarazada" t={24} p={p('embarazada')} />
    <g transform="translate(400,400)" opacity={tramo(p('embarazada'), 0, 0.5)}>
      <ellipse cx={8} cy={12} rx={262} ry={212} fill={P.sombra} />
      <ellipse rx={262} ry={212} fill="#F2A8C0" /><ellipse rx={240} ry={190} fill="#BFEAF5" />
      <path d="M-236,-120 C-290,-50 -290,70 -236,140 L-196,120 C-236,60 -236,-60 -196,-100 Z" fill="#B5183F" />
      <path d="M-210,10 C-150,80 -100,-10 -40,40" fill="none" stroke="#E98FA3" strokeWidth={16} strokeLinecap="round" />
      <Feto x={40} y={-20} k={1.8} />
    </g>
    {[0, 1, 2].map((i) => <Treponema key={i} x={lerp(110, 330, easeOut(tramo(p('cruza'), i * 0.12, i * 0.12 + 0.7)))} y={340 + i * 60} w={80} amp={8} vueltas={3} grosor={7} reloj={reloj + i * 250} o={tramo(p('hispiroqueta'), i * 0.1, i * 0.1 + 0.4)} />)}
    <Trazo pts={[[170, 238], [168, 330]]} p={easeOut(p('placenta'))} color="#7A5AC8" w={4} />
    <Txt x={170} y={216} txt="placenta" t={24} p={p('placenta')} color={TXV.sangre} />
    <Txt x={400} y={650} txt="la espiroqueta cruza la placenta" t={26} p={p('cruza')} color={TXV.esp} />
    <Txt x={400} y={690} txt="en cualquier etapa" t={22} p={p('cualquier')} />
    <Txt x={400} y={728} txt="más riesgo cuanto más reciente la infección" t={22} p={p('reciente')} color={TXV.ambar} />
    {/* lo que puede causar */}
    <Txt x={1200} y={150} txt="puede causar" t={30} p={p('causar')} color={TXV.violeta} />
    <Feto x={980} y={265} k={0.55} o={tramo(p('aborto'), 0, 0.4)} />
    <Flecha a={[1050, 230]} b={[1050, 300]} p={p('aborto')} color="#C0143C" w={8} />
    <Txt x={1000} y={352} txt="aborto" t={24} p={p('aborto')} />
    <Feto x={1200} y={265} k={0.55} o={tramo(p('fetal'), 0, 0.4)} />
    <Cruz x={1230} y={270} k={1.1} p={p('fetal')} />
    <Txt x={1200} y={352} txt="muerte fetal" t={24} p={p('fetal')} />
    <Sale p={p('prematuro')} x={1420} y={265}><Reloj k={0.55} ang={lerp(0, 300, p('prematuro'))} /></Sale>
    <Txt x={1420} y={352} txt="parto prematuro" t={24} p={p('prematuro')} />
    {/* el recién nacido */}
    <Bandera x={1000} y={432} txt="recién nacido" color={P.esp[0]} p={p('nacido')} t={28} punta="abajo" />
    <g opacity={tramo(p('nacido'), 0, 0.5)}>
      <ellipse cx={1000} cy={654} rx={64} ry={52} fill={P.piel2[0]} /><ellipse cx={998} cy={650} rx={60} ry={48} fill={P.piel2[1]} />
      <circle cx={1000} cy={548} r={58} fill={P.piel2[0]} /><circle cx={998} cy={546} r={54} fill={P.piel2[2]} />
      <circle cx={980} cy={540} r={5} fill="#5A22A8" /><circle cx={1018} cy={540} r={5} fill="#5A22A8" />
    </g>
    <Sudor x={1000} y={582} o={tramo(p('rimitis'), 0, 0.5)} />
    {[[-28, 8], [10, -6], [30, 20], [-6, 26], [-34, -14]].map(([dx, dy], i) => <circle key={i} cx={1000 + dx} cy={654 + dy} r={7} fill="#B8602A" opacity={tramo(p('erupcion'), i * 0.1, i * 0.1 + 0.4)} />)}
    <Sudor x={1150} y={505} k={0.8} o={tramo(p('rimitis'), 0, 0.5)} />
    <Txt x={1182} y={505} txt="rinitis" t={22} ancla="start" p={p('rimitis')} />
    <circle cx={1150} cy={555} r={9} fill="#B8602A" opacity={tramo(p('erupcion'), 0, 0.5)} />
    <Txt x={1182} y={555} txt="erupción" t={22} ancla="start" p={p('erupcion')} />
    <Sale p={p('grandes')} x={1138} y={605}><Higado k={0.1} /></Sale>
    <Sale p={p('grandes')} x={1186} y={605}><Bazo k={0.1} /></Sale>
    <Txt x={1222} y={605} txt="hígado y bazo grandes" t={22} ancla="start" p={p('grandes')} />
    <Hueso x={1150} y={655} k={0.38} o={tramo(p('huesos'), 0, 0.5)} />
    <Txt x={1190} y={655} txt="lesiones de los huesos" t={22} ancla="start" p={p('huesos')} />
    {/* secuelas tardías */}
    <Txt x={400} y={800} txt="sin tratamiento, secuelas tardías" t={26} p={p('secuelas')} color={TXV.violeta} />
    <g transform="translate(170,880)" opacity={tramo(p('dientes'), 0, 0.5)}>
      {[-44, 0, 44].map((x, i) => (
        <g key={i}>
          <path d={`M${x - 20},-32 L${x + 20},-32 L${x + 20},8 Q${x + 20},36 ${x},36 Q${x - 20},36 ${x - 20},8 Z`} fill="#FFF" />
          <ellipse cx={x} cy={34} rx={9} ry={6} fill="#B7AEDB" />
        </g>
      ))}
    </g>
    <g transform="translate(400,880)" opacity={tramo(p('keratitis'), 0, 0.5)}>
      <path d="M-58,0 Q0,-50 58,0 Q0,50 -58,0 Z" fill="#FFF" /><circle r={25} fill="#16B9BE" /><circle r={11} fill="#1A0B3A" />
      <ellipse rx={30} ry={30} fill="#DDEFF7" opacity={0.75} />
    </g>
    <g transform="translate(630,880)" opacity={tramo(p('sordera'), 0, 0.5)}>
      <path d="M-8,-46 C-48,-46 -52,-6 -34,18 C-26,30 -34,44 -14,48 C10,52 28,34 26,8 C24,-24 12,-46 -8,-46 Z" fill={P.piel2[1]} />
      <path d="M-6,-26 C-26,-26 -26,0 -12,12" fill="none" stroke={P.piel2[0]} strokeWidth={7} strokeLinecap="round" />
    </g>
    <Cruz x={630} y={885} k={1.1} p={p('sordera')} />
    <Txt x={170} y={950} txt="dientes de Hutchinson" t={20} p={p('dientes')} />
    <Txt x={400} y={950} txt="queratitis intersticial" t={20} p={p('keratitis')} />
    <Txt x={630} y={950} txt="sordera" t={20} p={p('sordera')} />
    {/* se previene */}
    <Txt x={1250} y={790} txt="se previene con tamizaje" t={26} p={p('tamisaje')} color={TXV.verde} />
    <Txt x={1250} y={828} txt="en el embarazo" t={26} p={p('embarazo')} color={TXV.verde} />
    <Txt x={1250} y={876} txt="tratamiento aceptable:" t={24} p={p('aceptable')} />
    <Sale p={p('penicilina')} x={1150} y={942}><Jeringa k={0.45} r={-30} /></Sale>
    <Txt x={1215} y={942} txt="penicilina" t={44} ancla="start" p={p('penicilina')} color={TXV.verde} />
  </g>
);

const LAMINAS: Lamina[] = [TresMeses, LaErupcion, CondilomasLata, PlacasMucosas, Alopecia, Latente, Terciaria, Congenita];
export default LAMINAS;
