'use client';
// Capítulo 20 · Caso 2: diagnóstico y fibrosis
//
// Dos pruebas, dos preguntas (anti-VHC y ARN) y la prueba refleja; los números del paciente 2 con sus rangos; del virus a la cicatriz (estrés
// oxidativo, señales de peligro, Kupffer, TGF-β), la célula estrellada que despierta y fabrica colágeno; la histología del VHC por el ocular;
// la escala METAVIR de F0 a F4; y las dos formas de medir sin biopsia: la ecografía y la elastografía con su escala en kilopascales.

import type { Lamina } from '../Lienzo';
import { Maquina, Tira } from '../../vih-sifilis/Piezas';
import { Anticuerpo, Busto, Etiqueta, Flecha, Globo, Higado, Sale, Sello, Sombra, TXH, TuboEnsayo, Txt, VirionC, H, clamp, easeBack, easeOut, hash, lerp, onda, tramo } from '../Piezas';
import { Colageno, Estrellada, Hepatocito, Kupffer, Triada } from '../Higado';
import { BarraLab, Eco, Ocular } from '../Clinica';
import { Fact, Gente, Luz, Tacha, Visto } from '../Extras';

type P2 = [number, number];

// ─── 0 · Dos pruebas, dos preguntas ─────────────────────────────────────────
const DosPruebas: Lamina = ({ p, reloj }) => {
  const pregunta = p('pregunta'), pruebas = p('pruebas'), preguntas = p('preguntas'), anticuerpos = p('anticuerpos'), contacto = p('contacto'), nodistinguen = p('nodistinguen'), actual = p('actual'), curada = p('curada'), arn = p('arn'), pcr = p('pcr'), ahora = p('ahora'), reactivo = p('reactivo'), detectable = p('detectable'), define = p('define'), hepc = p('hepc');
  return (
    <g>
      <Globo x={560} y={85} txt="¿cómo se diagnostica la hepatitis C?" t={32} p={pregunta} colaX={0} />
      <Etiqueta x={1250} y={95} txt="dos pruebas, dos preguntas" color="#8A4FE8" p={Math.max(pruebas, preguntas)} t={30} punta="no" />
      {/* la primera pregunta: ¿hubo contacto alguna vez? */}
      <Sale p={anticuerpos} x={250} y={470} k={1.1}><TuboEnsayo color="#A8DC1E" nivel={0.7} reloj={reloj} /></Sale>
      {[0, 1, 2].map((i) => <Anticuerpo key={i} x={165 + i * 85} y={380 + 12 * onda(reloj, 1500, i)} k={1.0} o={tramo(anticuerpos, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={250} y={225} txt="anticuerpos anti-VHC" color="#6A9A00" p={anticuerpos} t={26} punta="no" />
      <Txt x={250} y={710} txt="¿hubo contacto alguna vez?" t={26} p={contacto} color={TXH.ac} />
      {/* la segunda: ¿hay virus replicando ahora? */}
      <Sale p={arn} x={950} y={470} k={1.1}><TuboEnsayo color="#14B870" nivel={0.7} reloj={reloj} /></Sale>
      {[0, 1, 2, 3].map((i) => <VirionC key={i} x={895 + (i % 2) * 90 + 10 * Math.sin(reloj / 700 + i)} y={370 + Math.floor(i / 2) * 70 + 8 * Math.sin(reloj / 600 + i)} k={0.28} reloj={reloj} fase={i} o={tramo(arn, i * 0.15, i * 0.15 + 0.4)} />)}
      <Etiqueta x={950} y={225} txt="ARN del virus, por PCR" color="#0B7A4A" p={Math.max(arn, pcr)} t={26} punta="no" />
      <Txt x={950} y={710} txt="¿hay virus replicando ahora?" t={26} p={Math.max(ahora, pcr * 0.5)} color={TXH.c} />
      {/* los anticuerpos no distinguen una infección actual de una curada */}
      <Sombra><Sale p={actual} x={540} y={430} k={0.26}><Busto quien="p1" reloj={reloj} fase={0.3} /></Sale></Sombra>
      <Sombra><Sale p={curada} x={680} y={430} k={0.26}><Busto quien="p2" reloj={reloj} fase={1.1} sonrisa={1} /></Sale></Sombra>
      {[0, 1, 2].map((i) => <VirionC key={i} x={500 + i * 40} y={330 + 6 * Math.sin(reloj / 500 + i)} k={0.2} reloj={reloj} o={tramo(actual, i * 0.15, i * 0.15 + 0.4)} />)}
      <Visto x={700} y={335} k={0.8} p={curada} />
      <Txt x={540} y={520} txt="actual" t={24} p={actual} color={TXH.c} /><Txt x={680} y={520} txt="curada" t={24} p={curada} color={TXH.c} />
      <Txt x={610} y={580} txt="no distinguen una de otra" t={24} p={nodistinguen} color={TXH.sangre} />
      {/* anticuerpo reactivo + ARN detectable = hepatitis C actual */}
      <Luz x={330} y={830} on={reactivo} col="#A8DC1E" signo="+" q={reactivo} reloj={reloj} /><Txt x={330} y={920} txt="anticuerpo reactivo" t={24} p={reactivo} color={TXH.ac} />
      <Txt x={540} y={830} txt="+" t={60} p={Math.max(reactivo, detectable)} color={TXH.gris} />
      <Luz x={750} y={830} on={detectable} col="#14B870" signo="+" q={detectable} reloj={reloj} /><Txt x={750} y={920} txt="ARN detectable" t={24} p={detectable} color={TXH.c} />
      <Txt x={950} y={830} txt="=" t={60} p={define} color={TXH.gris} />
      <Etiqueta x={1250} y={830} txt="hepatitis C actual" color="#0B7A4A" p={Math.max(define * 0.6, hepc)} t={36} punta="no" />
    </g>
  );
};

// ─── 1 · La prueba refleja ──────────────────────────────────────────────────
const Refleja: Lamina = ({ p, reloj }) => {
  const reactivo = p('reactivo'), pide = p('pide'), arn = p('arn'), muestra = p('muestra'), refleja = p('refleja'), core = p('core'), arn2 = p('arn2'), punto = p('punto'), cdc = p('cdc'), oms = p('oms'), tamizar = p('tamizar'), adulto = p('adulto'), vez = p('vez'), diagnostica = p('diagnostica'), busca = p('busca');
  return (
    <g>
      <Sale p={reactivo} x={190} y={400} k={0.85}><TuboEnsayo color="#E3203F" nivel={0.75} reloj={reloj} /></Sale>
      <Txt x={190} y={610} txt="la misma muestra" t={24} p={muestra} color={TXH.sangre} />
      <Tira x={520} y={390} k={0.75} o={tramo(reactivo, 0, 0.4)} pads={['#A8DC1E', '#E04AB0', '#FFC81E']} />
      <Luz x={520} y={610} on={reactivo} col="#A8DC1E" signo="+" q={reactivo} reloj={reloj} /><Txt x={520} y={690} txt="anti-VHC reactivo" t={24} p={reactivo} color={TXH.ac} />
      <Flecha a={[640, 400]} b={[760, 400]} p={tramo(pide, 0, 1)} color="#8A4FE8" w={10} /><Txt x={700} y={350} txt="se pide enseguida" t={22} p={pide} color={TXH.d} />
      <Maquina x={920} y={400} k={1.1} o={tramo(arn, 0, 0.4)} encendida={arn} golpe={0} />
      <Etiqueta x={920} y={540} txt="ARN" color="#0B7A4A" p={arn} t={28} punta="no" />
      <Txt x={1330} y={400} txt="es la prueba refleja" t={34} p={refleja} color={TXH.hep} />
      <Flecha a={[1060, 400]} b={[1120, 400]} p={tramo(refleja, 0, 1)} color="#14B870" w={8} />
      {/* antígeno core y ARN en el punto de atención */}
      <g opacity={tramo(punto, 0, 0.4)} transform="translate(330,770)"><rect x={-70} y={-50} width={140} height={110} rx={22} fill="#000" opacity={0.14} transform="translate(5,8)" /><rect x={-70} y={-50} width={140} height={110} rx={22} fill="#4F7FF0" /><rect x={-52} y={-34} width={104} height={50} rx={10} fill="#E8F2FF" /><circle cx={0} cy={36} r={9} fill="#E3203F" /></g>
      <Etiqueta x={330} y={880} txt="en el punto de atención" color="#2F55E0" p={punto} t={24} punta="no" />
      <Txt x={640} y={750} txt="también se usan el antígeno core" t={24} p={core} color={TXH.b} /><Txt x={640} y={795} txt="y el ARN" t={24} p={arn2} color={TXH.c} />
      {/* los CDC y la OMS recomiendan tamizar a todo adulto al menos una vez */}
      <Sale p={cdc} x={1000} y={700}><Sello ok /></Sale><Etiqueta x={1000} y={790} txt="CDC" color="#1E4FC0" p={cdc} t={26} punta="no" />
      <Sale p={oms} x={1180} y={700}><Sello ok /></Sale><Etiqueta x={1180} y={790} txt="OMS" color="#0A7F78" p={oms} t={26} punta="no" />
      <Txt x={1390} y={720} txt="tamizar a todo adulto" t={26} p={tamizar} color={TXH.hep} />
      {Array.from({ length: 8 }, (_, i) => <Gente key={i} x={1060 + i * 62} y={880} col="#1FA85A" k={0.55} o={tramo(adulto, i / 10, i / 10 + 0.3)} />)}
      <Txt x={1300} y={950} txt="al menos una vez" t={24} p={vez} color={TXH.c} />
      <Txt x={640} y={920} txt="se diagnostica más cuando se busca" t={30} p={Math.max(diagnostica, busca)} color={TXH.hep} />
    </g>
  );
};

// ─── 2 · Los números del paciente 2 ─────────────────────────────────────────
const Numeros: Lamina = ({ p, reloj }) => {
  const paciente = p('paciente'), alt = p('alt'), ast = p('ast'), cociente = p('cociente'), ritis = p('ritis'), dano = p('dano'), cirrosis = p('cirrosis'), bili = p('bili'), albumina = p('albumina'), inr = p('inr'), normales = p('normales'), higado = p('higado'), trabaja = p('trabaja'), descarta = p('descarta'), fibrosis = p('fibrosis'), hbsag = p('hbsag'), negativo = p('negativo'), anticuerpos = p('anticuerpos'), reactivos = p('reactivos'), arn = p('arn'), valor = p('valor'), herido = p('herido');
  return (
    <g>
      <Sombra><Sale p={paciente} x={170} y={420} k={0.5}><Busto quien="p2" reloj={reloj} fase={1.5} /></Sale></Sombra>
      <Etiqueta x={170} y={600} txt="paciente 2" color="#6E4AD8" p={paciente} t={28} punta="no" />
      <BarraLab x={430} y={560} w={84} alto={300} val={94} max={160} norm={40} color="#F2848C" oscuro="#B83A52" p={alt} nombre="ALT" valor="94" t={28} />
      <BarraLab x={570} y={560} w={84} alto={300} val={73} max={160} norm={40} color="#F2848C" oscuro="#B83A52" p={ast} nombre="AST" valor="73" t={28} />
      <Txt x={500} y={190} txt="cociente AST/ALT" t={26} p={cociente} color={TXH.gris} /><Etiqueta x={500} y={250} txt="0,78" color="#B83A52" p={ritis} t={38} punta="no" />
      <Txt x={500} y={650} txt="daño hepatocelular" t={24} p={dano} color={TXH.sangre} /><Txt x={500} y={692} txt="sin cirrosis avanzada" t={24} p={cirrosis} color={TXH.sangre} />
      <BarraLab x={800} y={560} w={84} alto={300} val={0.8} max={3} norm={1.2} color="#FFC81E" oscuro="#C79A00" p={bili} nombre="bilirrubina" valor="normal" t={26} />
      <BarraLab x={950} y={560} w={84} alto={300} val={4.1} max={6} norm={3.5} color="#6EC8F5" oscuro="#2A7FB0" p={albumina} nombre="albúmina" valor="normal" t={26} />
      <BarraLab x={1100} y={560} w={84} alto={300} val={1.0} max={2.2} norm={1.1} color="#F0495F" oscuro="#A8203A" p={inr} nombre="INR" valor="normal" t={26} />
      <Etiqueta x={950} y={190} txt="normales" color="#1FA85A" p={normales} t={32} punta="no" />
      <Txt x={950} y={650} txt="un hígado que aún trabaja" t={26} p={Math.max(higado, trabaja)} color={TXH.c} /><Txt x={950} y={695} txt="y eso no descarta fibrosis" t={26} p={Math.max(descarta, fibrosis)} color={TXH.hep} />
      {/* HBsAg negativo, anti-VHC reactivo y ARN de 1,6 × 10⁶ */}
      <Luz x={300} y={850} on={Math.max(hbsag, negativo)} col="#9C92A8" signo="−" q={Math.max(hbsag, negativo)} reloj={reloj} /><Txt x={300} y={935} txt="HBsAg negativo" t={24} p={Math.max(hbsag, negativo)} color={TXH.gris} />
      <Luz x={700} y={850} on={Math.max(anticuerpos, reactivos)} col="#A8DC1E" signo="+" q={Math.max(anticuerpos, reactivos)} reloj={reloj} /><Txt x={700} y={935} txt="anti-VHC reactivo" t={24} p={Math.max(anticuerpos, reactivos)} color={TXH.ac} />
      <Luz x={1100} y={850} on={arn} col="#14B870" signo="+" q={arn} reloj={reloj} /><Txt x={1100} y={935} txt="ARN" t={24} p={arn} color={TXH.c} />
      <Etiqueta x={1380} y={850} txt="1,6 × 10⁶ UI/mL" color="#0B7A4A" p={valor} t={30} punta="no" />
      <Txt x={1380} y={935} txt="un hígado que trabaja, pero herido" t={24} p={herido} color={TXH.hep} />
    </g>
  );
};

// ─── 3 · Del virus a la cicatriz ────────────────────────────────────────────
const Cicatriz: Lamina = ({ p, reloj }) => {
  const persistente = p('persistente'), estres = p('estres'), dano = p('dano'), lesionados = p('lesionados'), senales = p('senales'), peligro = p('peligro'), activan = p('activan'), kupffer = p('kupffer'), tgf = p('tgf'), mediador = p('mediador'), fibrosis = p('fibrosis'), pdgf = p('pdgf'), tnf = p('tnf'), il1b = p('il1b'), cicatriz = p('cicatriz'), aviso = p('aviso');
  const flota = (i: number, n: number) => ((reloj / 1500 + i / n) % 1);
  return (
    <g>
      <Hepatocito x={280} y={470} k={1.7} reloj={reloj} sem={12} infecta={H.c} brillo={1} apop={0.55 * easeOut(Math.max(dano, lesionados))} />
      <Txt x={280} y={650} txt="infección persistente" t={26} p={persistente} color={TXH.c} />
      {[0, 1, 2, 3, 4].map((i) => { const a = (i / 5) * 6.283 + reloj / 700; return <g key={i} transform={`translate(${280 + Math.cos(a) * 190},${470 + Math.sin(a) * 160})`} opacity={tramo(estres, 0, 0.4)}><path d="M0,-14 L4,-4 L14,0 L4,4 L0,14 L-4,4 L-14,0 L-4,-4 Z" fill="#FF8A1E" /></g>; })}
      <Etiqueta x={280} y={250} txt="estrés oxidativo" color="#C25A00" p={estres} t={26} punta="no" /><Txt x={280} y={705} txt="y daño celular" t={24} p={dano} color={TXH.sangre} />
      {/* las señales de peligro viajan hacia la célula de Kupffer */}
      {[0, 1, 2, 3].map((i) => { const f = flota(i, 4); return <g key={i} transform={`translate(${lerp(420, 700, f)},${lerp(430, 470, f) - 26 * Math.sin(f * Math.PI)})`} opacity={tramo(senales, 0, 0.3) * Math.sin(f * Math.PI)}><path d="M0,-18 L16,12 L-16,12 Z" fill="#E5324C" /><rect x={-2.5} y={-6} width={5} height={10} rx={2} fill="#FFF" /><circle cy={9} r={2.5} fill="#FFF" /></g>; })}
      <Txt x={560} y={330} txt="los hepatocitos lesionados" t={24} p={lesionados} color={TXH.hep} /><Etiqueta x={560} y={385} txt="señales de peligro" color="#E5324C" p={Math.max(senales, peligro)} t={26} punta="no" />
      <Kupffer x={830} y={470} k={1.8} reloj={reloj} activa={easeOut(Math.max(activan, kupffer))} />
      <Etiqueta x={830} y={640} txt="célula de Kupffer" color="#B86A00" p={kupffer} t={26} punta="no" /><Txt x={830} y={250} txt="activan a las" t={24} p={activan} color={TXH.kupffer} />
      {/* libera TGF-β, PDGF, TNF-α e IL-1β */}
      {[['TGF-β', '#3AA7E0', tgf, 0], ['PDGF', '#14B870', pdgf, 1], ['TNF-α', '#E8841E', tnf, 2], ['IL-1β', '#8A4FE8', il1b, 3]].map(([t, c, q, i]) => {
        const k = i as number, f = flota(k, 4), y = 280 + k * 140;
        return (
          <g key={t as string}>
            <path d={`M${lerp(960, 1150, f)},${lerp(470, y, f)} m0,-22 c14,18 22,28 0,44 c-22,-16 -14,-26 0,-44 z`} fill={c as string} opacity={tramo(q as number, 0, 0.3) * Math.sin(f * Math.PI)} />
            <Etiqueta x={1330} y={y} txt={t as string} color={c as string} p={q as number} t={26} punta="no" />
          </g>
        );
      })}
      <Txt x={1330} y={175} txt="liberan" t={26} p={tgf} color={TXH.gris} /><Txt x={1440} y={280 + 36} txt="el principal mediador" t={20} p={mediador} color={TXH.colageno} /><Txt x={1440} y={280 + 62} txt="de la fibrosis" t={20} p={fibrosis} color={TXH.colageno} />
      <Txt x={800} y={900} txt="la cicatriz empieza con un aviso" t={38} p={Math.max(cicatriz, aviso)} color={TXH.hep} />
    </g>
  );
};

// ─── 4 · La célula estrellada despierta ─────────────────────────────────────
const Despierta: Lamina = ({ p, reloj }) => {
  const estrelladas = p('estrelladas'), dormian = p('dormian'), vitamina = p('vitamina'), fenotipo = p('fenotipo'), miofibroblasto = p('miofibroblasto'), proliferan = p('proliferan'), migran = p('migran'), pdgf = p('pdgf'), colageno = p('colageno'), fibronectina = p('fibronectina'), matriz = p('matriz'), septos = p('septos'), sinusoides = p('sinusoides'), lobulillos = p('lobulillos'), despierta = p('despierta'), cicatrizar = p('cicatrizar');
  const act = easeOut(Math.max(fenotipo, miofibroblasto));
  const dup = easeOut(proliferan), mig = easeOut(migran);
  return (
    <g>
      <Estrellada x={lerp(260, 340, mig)} y={430} k={1.6} reloj={reloj} activa={act} o={tramo(estrelladas, 0, 0.4)} />
      {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${lerp(260, 340, mig) - 30 + (i % 2) * 54},${430 - 16 + Math.floor(i / 2) * 40})`} opacity={tramo(vitamina, 0, 0.4) * (1 - act)}><circle r={14} fill="#F2C440" /><circle cx={-3} cy={-3} r={11} fill="#FFE98A" /></g>)}
      <Etiqueta x={230} y={250} txt="célula estrellada" color="#B09000" p={estrelladas} t={28} punta="no" />
      <Txt x={230} y={640} txt="dormía guardando vitamina A" t={24} p={Math.max(dormian, vitamina)} color={TXH.estrellada} />
      <Etiqueta x={380} y={705} txt="miofibroblasto" color="#8A4FE8" p={Math.max(fenotipo, miofibroblasto)} t={26} punta="no" />
      <Estrellada x={lerp(340, 560, mig)} y={570} k={1.25} reloj={reloj} fase={2} activa={1} o={dup * tramo(proliferan, 0, 0.5)} />
      <Txt x={560} y={650} txt="proliferan" t={24} p={proliferan} color={TXH.d} /><Flecha a={[420, 450]} b={[640, 450]} p={tramo(migran, 0, 1)} color="#8A4FE8" w={9} /><Txt x={540} y={400} txt="y migran" t={24} p={migran} color={TXH.d} />
      <Fact x={440} y={300} R={46} tono={H.estrellada} txt="PDGF" t={20} p={pdgf} />
      {/* fabrican colágeno 1 y 3 y fibronectina */}
      <Colageno x={1000} y={430} w={420} h={170} n={7} p={Math.max(colageno, fibronectina * 0.6)} reloj={reloj} sem={3} />
      <Etiqueta x={1000} y={300} txt="colágeno I y III" color="#1F6FB0" p={colageno} t={28} punta="no" /><Txt x={1000} y={560} txt="y fibronectina" t={24} p={fibronectina} color={TXH.colageno} />
      <Txt x={1000} y={640} txt="la matriz se acumula" t={28} p={matriz} color={TXH.colageno} />
      {/* septos que alteran los sinusoides y los lobulillos */}
      {[0, 1, 2].map((i) => <path key={i} d={`M${1180 + i * 60},700 C${1220 + i * 60},780 ${1140 + i * 60},850 ${1200 + i * 60},930`} fill="none" stroke="#3AA7E0" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${easeOut(tramo(septos, i * 0.2, i * 0.2 + 0.6)).toFixed(3)} 1`} />)}
      <Txt x={800} y={780} txt="forma septos" t={30} p={septos} color={TXH.colageno} />
      <Txt x={800} y={828} txt="y altera los sinusoides" t={24} p={sinusoides} color={TXH.hep} /><Txt x={800} y={868} txt="y los lobulillos" t={24} p={lobulillos} color={TXH.hep} />
      <Txt x={400} y={850} txt="una célula dormida" t={30} p={despierta} color={TXH.estrellada} /><Txt x={400} y={898} txt="que despierta a cicatrizar" t={30} p={cicatrizar} color={TXH.hep} />
    </g>
  );
};

// ─── 5 · La histología del VHC ──────────────────────────────────────────────
const HistoVHC: Lamina = ({ p, reloj }) => {
  const microscopio = p('microscopio'), porta = p('porta'), agregados = p('agregados'), linfocitos = p('linfocitos'), tcd4 = p('tcd4'), celulas = p('celulas'), caracteristicos = p('caracteristicos'), interfase = p('interfase'), councilman = p('councilman'), balonizacion = p('balonizacion'), esteatosis = p('esteatosis'), macro = p('macro'), genotipo = p('genotipo'), core = p('core'), foliculos = p('foliculos'), firma = p('firma');
  const CX = 480, CY = 500;
  const celda = (i: number) => { const a = (i / 11) * 6.283 + 0.4, d = 150 + 110 * hash(i, 7); return [CX + Math.cos(a) * d, CY + Math.sin(a) * d * 0.9] as P2; };
  return (
    <g>
      <Ocular x={CX} y={CY} R={310} id="hv-o20" reloj={reloj} o={tramo(microscopio, 0, 0.4)}>
        {Array.from({ length: 11 }, (_, i) => { const [x, y] = celda(i); return <Hepatocito key={i} x={x} y={y} k={0.52} reloj={reloj} sem={i + 3} balon={i % 4 === 1 ? easeOut(balonizacion) : 0} grasa={i % 3 === 2 ? easeOut(Math.max(esteatosis, macro)) : 0} apop={i === 4 ? 0.7 * easeOut(councilman) : 0} />; })}
        <Triada x={CX} y={CY - 10} k={0.9} reloj={reloj} p={tramo(porta, 0, 1)} />
        {/* el agregado linfoide: un racimo de linfocitos pequeños y oscuros */}
        {Array.from({ length: 22 }, (_, i) => { const a = hash(i, 21) * 6.283, d = 20 + 62 * hash(i, 22); return <circle key={i} cx={CX + 10 + Math.cos(a) * d} cy={CY - 70 + Math.sin(a) * d * 0.8} r={9 + 2 * hash(i, 23)} fill={i % 3 === 0 ? '#4F7FF0' : '#2A1A8C'} opacity={tramo(agregados, i / 30, i / 30 + 0.2)} />; })}
        {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * 6.283; return <circle key={i} cx={CX + Math.cos(a) * 130} cy={CY - 10 + Math.sin(a) * 100} r={7} fill="#2A1A8C" opacity={tramo(interfase, i / 14, i / 14 + 0.3)} />; })}
      </Ocular>
      <Etiqueta x={1160} y={170} txt="espacio porta" color="#8A4FE8" p={porta} t={26} punta="no" />
      <Txt x={1160} y={228} txt="agregados linfoides densos" t={24} p={agregados} color={TXH.b} /><Txt x={1160} y={270} txt="con linfocitos T CD4 y células B" t={22} p={Math.max(linfocitos, tcd4, celulas)} color={TXH.cd8} />
      <Txt x={1160} y={314} txt="muy característicos" t={24} p={caracteristicos} color={TXH.hep} />
      <Etiqueta x={1160} y={400} txt="hepatitis de interfase" color="#2A1A8C" p={interfase} t={24} punta="no" />
      <Etiqueta x={1160} y={470} txt="cuerpos de Councilman" color="#E5324C" p={councilman} t={24} punta="no" />
      <Etiqueta x={1160} y={540} txt="balonización" color="#14B870" p={balonizacion} t={24} punta="no" />
      <Etiqueta x={1160} y={610} txt="esteatosis macrovesicular" color="#C79A00" p={Math.max(esteatosis, macro)} t={24} punta="no" />
      <Txt x={1160} y={668} txt="sobre todo con el genotipo 3" t={22} p={genotipo} color={TXH.d} /><Txt x={1160} y={706} txt="o por la proteína core" t={22} p={core} color={TXH.d} />
      <Etiqueta x={1160} y={820} txt="folículos linfoides" color="#4F7FF0" p={foliculos} t={26} punta="no" /><Txt x={1160} y={880} txt="en el espacio porta: una firma" t={28} p={firma} color={TXH.hep} />
    </g>
  );
};

// ─── 6 · METAVIR: de F0 a F4 ────────────────────────────────────────────────
/** El tejido de cada estadio, centrado en (0,0) y dibujado dentro de un cuadro de 220 × 260. */
function Tejido({ f, reloj }: { f: number; reloj: number }) {
  const azul = '#3AA7E0';
  const cel = Array.from({ length: 22 }, (_, i) => { const x = -80 + (i % 6) * 32 + (Math.floor(i / 6) % 2) * 14, y = -90 + Math.floor(i / 6) * 40; return <circle key={i} cx={x} cy={y} r={13} fill="#F5A0A6" opacity={0.85} />; });
  const triada = <g><circle r={20} fill="#E3203F" opacity={0.8} /><circle cx={30} cy={-8} r={12} fill="#9C92A8" /></g>;
  return (
    <g>
      {cel}
      {f === 0 && triada}
      {f === 1 && <g>{triada}{[0, 1, 2, 3, 4, 5].map((i) => { const a = i * 1.05; return <line key={i} x1={Math.cos(a) * 24} y1={Math.sin(a) * 24} x2={Math.cos(a) * 52} y2={Math.sin(a) * 52} stroke={azul} strokeWidth={9} strokeLinecap="round" />; })}</g>}
      {f === 2 && <g>{triada}<path d="M0,0 L-90,-80 M0,0 L90,60 M0,0 L-70,100 M0,0 L80,-90" stroke={azul} strokeWidth={9} strokeLinecap="round" fill="none" /><circle cx={-100} cy={-90} r={14} fill="#E3203F" opacity={0.7} /><circle cx={100} cy={70} r={14} fill="#E3203F" opacity={0.7} /></g>}
      {f === 3 && <g><path d="M-100,-100 C-40,-40 40,40 100,100 M100,-100 C40,-40 -40,40 -100,100 M-100,0 L100,0 M0,-110 L0,110 M-100,-60 C-40,-20 40,-20 100,-60" stroke={azul} strokeWidth={9} strokeLinecap="round" fill="none" /></g>}
      {f === 4 && <g>{[[-50, -60], [50, -60], [-50, 50], [50, 50], [0, -5]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r={42} fill="#F5A0A6" /><circle cx={x} cy={y} r={42} fill="none" stroke={azul} strokeWidth={11} /></g>)}</g>}
    </g>
  );
}

const Metavir: Lamina = ({ p, reloj }) => {
  const metavir = p('metavir'), f0 = p('f0'), sinfib = p('sinfib'), f1 = p('f1'), portal = p('portal'), f2 = p('f2'), escasos = p('escasos'), f3 = p('f3'), numerosos = p('numerosos'), f4 = p('f4'), cirrosis = p('cirrosis'), cura = p('cura'), regresar = p('regresar'), cicatriz = p('cicatriz'), aflojar = p('aflojar');
  const niveles = [{ q: f0, n: 'F0', t: 'sin fibrosis', tq: sinfib }, { q: f1, n: 'F1', t: 'fibrosis portal', tq: portal }, { q: f2, n: 'F2', t: 'septos escasos', tq: escasos }, { q: f3, n: 'F3', t: 'septos numerosos', tq: numerosos }, { q: f4, n: 'F4', t: 'cirrosis', tq: cirrosis }];
  return (
    <g>
      <Etiqueta x={800} y={95} txt="METAVIR gradúa la fibrosis de F0 a F4" color="#8A4FE8" p={metavir} t={32} punta="no" />
      {niveles.map((nv, i) => {
        const x = 180 + i * 310, q = easeBack(tramo(nv.q, 0, 0.5));
        return (
          <g key={nv.n}>
            <g transform={`translate(${x},470) scale(${(0.6 + 0.4 * q).toFixed(3)})`} opacity={tramo(nv.q, 0, 0.4)}>
              <rect x={-128} y={-150} width={256} height={300} rx={28} fill="#000" opacity={0.12} transform="translate(6,10)" /><rect x={-128} y={-150} width={256} height={300} rx={28} fill="#FFF4F4" />
              <g transform="scale(0.95)"><Tejido f={i} reloj={reloj} /></g>
            </g>
            <Etiqueta x={x} y={270} txt={nv.n} color={['#1FA85A', '#8FBF1F', '#E8A81E', '#E8841E', '#E5324C'][i]} p={nv.q} t={34} punta="no" />
            <Txt x={x} y={690} txt={nv.t} t={26} p={nv.tq} color={TXH.hep} />
          </g>
        );
      })}
      <Flecha a={[1360, 750]} b={[560, 750]} p={tramo(regresar, 0, 1)} color="#1FA85A" w={12} />
      <Txt x={960} y={800} txt="si se cura el virus, la fibrosis puede regresar en parte" t={28} p={Math.max(cura, regresar)} color={TXH.c} />
      <Txt x={800} y={920} txt="una cicatriz que a veces se puede aflojar" t={38} p={Math.max(cicatriz, aflojar)} color={TXH.hep} />
    </g>
  );
};

// ─── 7 · Ecografía y elastografía ───────────────────────────────────────────
const KMAX = 20;
const kpaY = (k: number) => 880 - (k / KMAX) * 560;

const EcoElasto: Lamina = ({ p, reloj }) => {
  const formas = p('formas'), biopsia = p('biopsia'), ecografia = p('ecografia'), brillante = p('brillante'), hiper = p('hiper'), heter = p('heter'), grasa = p('grasa'), inflamacion = p('inflamacion'), fibrosis = p('fibrosis'), focales = p('focales'), elasto = p('elasto'), mide = p('mide'), rigidez = p('rigidez'), kpa = p('kpa'), siete = p('siete'), sugiere = p('sugiere'), signif = p('signif'), doce = p('doce'), cirrosis = p('cirrosis'), fibroscan = p('fibroscan'), pero = p('pero'), activa = p('activa'), eleva = p('eleva'), dos = p('dos'), historia = p('historia');
  const valor = 6 + 3 * easeOut(mide) + 4.5 * easeOut(eleva);
  const olas = (reloj / 1600) % 1;
  return (
    <g>
      <Etiqueta x={800} y={80} txt="dos formas de mirar el hígado sin biopsia" color="#8A4FE8" p={Math.max(formas, biopsia)} t={32} punta="no" />
      {/* la ecografía: brillante, heterogénea, sin lesiones focales */}
      <Eco x={400} y={440} w={520} h={360} k={0.95} reloj={reloj} brillo={easeOut(Math.max(brillante, hiper))} heter={easeOut(heter)} o={tramo(ecografia, 0, 0.4)} />
      <Etiqueta x={400} y={230} txt="ecografía" color="#4F7FF0" p={ecografia} t={28} punta="no" />
      <Txt x={400} y={715} txt="más brillante: hiperecogénico" t={24} p={Math.max(brillante, hiper)} color={TXH.b} /><Txt x={400} y={757} txt="y heterogéneo" t={24} p={heter} color={TXH.b} />
      <Etiqueta x={190} y={820} txt="grasa" color="#C79A00" p={grasa} t={22} punta="no" /><Etiqueta x={340} y={820} txt="inflamación" color="#E5324C" p={inflamacion} t={22} punta="no" /><Etiqueta x={500} y={820} txt="fibrosis" color="#3AA7E0" p={fibrosis} t={22} punta="no" />
      <Txt x={400} y={885} txt="sin lesiones focales" t={24} p={focales} color={TXH.c} /><Visto x={610} y={885} k={0.6} p={focales} />
      {/* la elastografía: una onda de corte y una escala en kilopascales */}
      <Etiqueta x={880} y={230} txt="elastografía" color="#B8237A" p={elasto} t={28} punta="no" />
      <g opacity={tramo(elasto, 0, 0.4)}>
        <rect x={730} y={520} width={300} height={170} rx={34} fill="#F5A0A6" /><rect x={730} y={520} width={300} height={36} rx={18} fill="#FFD8D8" opacity={0.7} />
        <rect x={840} y={300} width={80} height={150} rx={20} fill="#6E55D8" /><rect x={850} y={310} width={60} height={20} rx={10} fill="#E8E0FF" opacity={0.7} />
        {[0, 1, 2].map((i) => { const u = (olas + i / 3) % 1; return <path key={i} d={`M${880 - 160 * u},${530 + 12} Q880,${530 + 130 * u + 40} ${880 + 160 * u},${530 + 12}`} fill="none" stroke="#FFF" strokeWidth={6} opacity={(1 - u) * 0.9} />; })}
      </g>
      <Txt x={880} y={760} txt="mide la rigidez" t={24} p={Math.max(mide, rigidez)} color={TXH.hep} /><Txt x={880} y={800} txt="en kilopascales" t={24} p={kpa} color={TXH.hep} />
      <Txt x={880} y={860} txt="con FibroScan" t={26} p={fibroscan} color={TXH.d} />
      {/* la escala */}
      <g opacity={tramo(kpa, 0, 0.4)}>
        <rect x={1200} y={kpaY(KMAX)} width={46} height={560} rx={23} fill="#FFF" opacity={0.3} />
        <rect x={1200} y={kpaY(7)} width={46} height={kpaY(0) - kpaY(7)} rx={23} fill="#1FA85A" opacity={0.85} />
        <rect x={1200} y={kpaY(12.5)} width={46} height={kpaY(7) - kpaY(12.5)} fill="#E8A81E" opacity={0.9} />
        <rect x={1200} y={kpaY(KMAX)} width={46} height={kpaY(12.5) - kpaY(KMAX)} rx={23} fill="#E5324C" opacity={0.9} />
        <path d={`M1190,${kpaY(valor)} L1162,${kpaY(valor) - 16} L1162,${kpaY(valor) + 16} Z`} fill="#2A1A8C" />
      </g>
      <Txt x={1130} y={kpaY(7)} txt="7" t={26} p={siete} color={TXH.hep} /><Txt x={1118} y={kpaY(12.5)} txt="12,5" t={26} p={doce} color={TXH.hep} />
      <Etiqueta x={1420} y={kpaY(9.7)} txt="fibrosis significativa" color="#E8A81E" p={Math.max(sugiere, signif)} t={22} punta="no" /><Etiqueta x={1380} y={kpaY(16)} txt="cirrosis" color="#E5324C" p={cirrosis} t={24} punta="no" />
      <Txt x={1223} y={930} txt="kPa" t={26} p={kpa} color={TXH.gris} />
      <Txt x={1100} y={150} txt="pero la inflamación activa también la eleva" t={24} p={Math.max(pero, activa, eleva)} color={TXH.sangre} />
      <Txt x={800} y={965} txt="dos mediciones, una sola historia" t={34} p={Math.max(dos, historia)} color={TXH.hep} />
    </g>
  );
};

const LAMINAS: Lamina[] = [DosPruebas, Refleja, Numeros, Cicatriz, Despierta, HistoVHC, Metavir, EcoElasto];
export default LAMINAS;
