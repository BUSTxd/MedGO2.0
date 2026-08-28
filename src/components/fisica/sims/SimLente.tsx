'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Segmented, Btn, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C13 · Lente delgada con los tres rayos principales, y el ojo como caso.
 *
 * Los rayos se trazan con la construcción geométrica de siempre —paralelo al
 * eje que sale por el foco, por el centro que no se desvía, por el foco que
 * sale paralelo— porque es lo que hay que saber DIBUJAR en el examen, no sólo
 * calcular. Que los tres se corten donde la ecuación dice es la comprobación,
 * y por eso el punto de corte se calcula con la fórmula y los rayos se dibujan
 * hacia él: si se dibujaran «a ojo» y coincidieran por casualidad no probaría
 * nada.
 *
 * ─── Encuadre ────────────────────────────────────────────────────────────────
 * La escala NO es fija: se recalcula en cada frame para que objeto, focos e
 * imagen quepan, y se suaviza con un lerp para que arrastrar no dé tirones. Con
 * una escala fija (lo que había) la sim se rompía sola en cuanto s se acercaba
 * a f: ahí s′ → ∞ y M → ∞, así que la flecha de la imagen se iba a kilómetros
 * del canvas y la del objeto —escalada por un factor 2,2 arbitrario— salía por
 * arriba con la altura al máximo. Cuando algo no cabe ni así, se recorta y se
 * rotula en el borde en vez de fingir que está: una imagen a 3 m de la lente
 * NO puede verse junto a un objeto a 9 cm, y encogerlo todo hasta que quepa
 * dejaría la escena en un punto.
 *
 * ─── Arrastre ────────────────────────────────────────────────────────────────
 * El objeto y los focos se agarran con el ratón. El mapeo puntero→magnitud usa
 * la escala CONGELADA al empezar el gesto, no la del frame actual: con la del
 * frame actual habría realimentación (alejo el objeto → el encuadre se encoge →
 * el objeto parece alejarse más → …) y el arrastre se dispararía solo.
 *
 * En modo `ojo` la focal ya no es libre: la pone el globo ocular (~17 mm de
 * longitud axial) y lo que se mueve es dónde cae la imagen respecto a la
 * retina. Esa distancia con signo ES el defecto de refracción, y la lente
 * correctora se calcula del punto remoto. El interior del ojo va a OTRA escala
 * que el lado del objeto —17 mm y 24 cm no caben juntos a la misma— y por eso
 * se rotula el factor: un esquema no a escala que no lo diga es un esquema
 * equivocado.
 */

/** Claves de `preset`: `focal`, `objeto`, `altura`. */

type Modo = 'lente' | 'ojo';

/** Longitud axial de un ojo emétrope, en metros. */
const OJO_AXIAL = 0.017;

const MARGEN = { izq: 38, der: 38, sup: 28, inf: 78 };
/** Cuántas veces max(s, f) puede alejarse la imagen antes de salirse del cuadro. */
const TOPE_ENCUADRE = 2.6;
/** Tope de exageración vertical frente a la escala horizontal. */
const TOPE_VERTICAL = 5;
/** Altura de referencia del encuadre vertical, en metros (el tope de la perilla). */
const ALTURA_REF = 0.1;
/** Suavizado de la cámara, por frame. */
const LERP = 0.2;

/**
 * Los rangos del mando. Los del ojo NO son los de la lente recortados: son los
 * del ojo humano real, y esa diferencia es lo que impide dibujar un imposible.
 *
 * · `sOjo` empieza en el **punto próximo** (~10 cm). Por debajo ningún ojo
 *   enfoca, y el dibujo lo delataba: a 4 cm la imagen cae 12,6 mm detrás de una
 *   retina que está a 17 mm, o sea casi otro globo ocular por detrás del globo.
 * · `fOjo` sale de la potencia real: ~59 D relajado y hasta ~70 D acomodando al
 *   máximo. Los 40 D que aceptaba antes no son un ojo humano —son una lupa— y
 *   con ellos la imagen se iba 16 mm por detrás de la retina.
 */
const LIM = {
  s:    [0.03, 1.2] as const,
  sOjo: [0.1, 1.2] as const,
  h:    [0.01, 0.1] as const,
  f:    [0.02, 0.3] as const,
  fOjo: [1 / 72, 1 / 54] as const,
};

/** Rango de la distancia del objeto, que depende de la escena. */
const limS = (modo: Modo) => (modo === 'ojo' ? LIM.sOjo : LIM.s);

/**
 * Tope de la MITAD del alto de la lente. La lente tiene que cubrir los rayos
 * (si no parecen doblarse en el aire), pero sin tope una lupa potente la deja
 * más alta que el objeto y la imagen juntos y el vidrio se come la escena. A
 * partir de aquí sigue el plano punteado, que es donde la construcción paraxial
 * refracta de verdad.
 */
const TOPE_LENTE = 88;

const clamp = (v: number, [lo, hi]: readonly [number, number]) =>
  Math.min(hi, Math.max(lo, v));

/* ─── Geometría de la escena ──────────────────────────────────────────────── */

/** Lo que el dibujo calcula y los manejadores de puntero necesitan releer. */
interface Geo {
  w: number;
  h: number;
  ejeY: number;
  lenteX: number;
  /** px/m del lado del objeto (izquierda de la lente). */
  px: number;
  /** px/m del lado de la imagen. Igual a `px` salvo en modo ojo. */
  pxD: number;
  /** px/m vertical. */
  py: number;
  objX: number;
  objTop: number;
  fIzqX: number;
  fDerX: number;
  imgX: number;
  imgVisible: boolean;
}

type Asa = 'objeto' | 'foco' | 'focoOjo';

interface Estado {
  modo: Modo;
  f: number;
  s: number;
  si: number;
  altura: number;
  hi: number;
}

/**
 * Encuadre objetivo. Se resuelve en dos pasos —primero el horizontal, y con él
 * ya se sabe si la imagen cae dentro para decidir el vertical— porque la altura
 * de una imagen que no se ve no debe robarle sitio a la que sí.
 */
function encuadrar(w: number, h: number, e: Estado) {
  const util = Math.max(w - MARGEN.izq - MARGEN.der, 120);
  const ejeY = MARGEN.sup + (h - MARGEN.sup - MARGEN.inf) / 2;
  const semi = Math.min(ejeY - MARGEN.sup, h - MARGEN.inf - ejeY);

  let px: number;
  let pxD: number;
  let lenteX: number;

  if (e.modo === 'ojo') {
    // El ojo se lleva una fracción fija del ancho: su tamaño no puede depender
    // de dónde esté el objeto, o el globo ocular latiría al arrastrarlo.
    const anchoOjo = Math.min(util * 0.44, 260);
    const anchoObj = util - anchoOjo;
    px = anchoObj / (e.s * 1.12);
    // 1,6 × la longitud axial = 27,2 mm de reserva. Con los topes del mando la
    // imagen más lejana cae a 22,7 mm (54 D mirando a 10 cm), o sea al 84 % —
    // cabe con margen para su flecha y su rótulo, y el globo se dibuja lo más
    // grande que ese peor caso permite.
    pxD = anchoOjo / (OJO_AXIAL * 1.6);
    lenteX = MARGEN.izq + anchoObj;
  } else {
    const base = Math.max(e.s, e.f);
    const tope = base * TOPE_ENCUADRE;
    const izqNec = Math.max(e.s, e.f, e.si < 0 ? -e.si : 0);
    const derNec = Math.max(e.f, Number.isFinite(e.si) && e.si > 0 ? e.si : 0);
    const izq = Math.min(izqNec, tope) * 1.12;
    // El lado de la imagen nunca baja de un quinto del cuadro: con el objeto a
    // 1,2 m la imagen cae casi sobre el foco y, sin este suelo, quedaba pegada
    // al borde derecho con F′ encima.
    const der = Math.max(Math.min(derNec, tope), base * 0.18) * 1.12;
    px = util / (izq + der);
    pxD = px;
    lenteX = MARGEN.izq + izq * px;
  }

  // ¿Cabe la imagen? Sólo entonces su altura entra en el encuadre vertical: la
  // de una imagen que está fuera del cuadro no debe robarle sitio a la que sí.
  // Cuando entra se respeta ENTERA, sin recortarla contra la del objeto: el
  // propio tope horizontal ya acota el aumento de lo que llega a verse (M ≤ 2,6
  // en las reales y ≤ 3,6 en las virtuales), así que el objeto nunca se aplasta
  // por debajo de un tercio, y un tope aquí sólo servía para dejar salirse la
  // punta de la flecha por arriba — que es justo el fallo que se estaba tapando.
  const imgX = Number.isFinite(e.si) ? lenteX + e.si * pxD : Number.POSITIVE_INFINITY;
  const imgVisible = imgX > 8 && imgX < w - 8;
  const altImg = imgVisible ? Math.abs(e.hi) : 0;
  // La referencia nunca baja del tope de la perilla: si se ajustara sólo a la
  // altura actual, la flecha llenaría el cuadro siempre y mover «h» no se vería.
  const altRef = Math.max(ALTURA_REF, e.altura, altImg);
  // Los 16 px que se descuentan son el rótulo que va bajo la punta de cada
  // flecha: sin reservarlos, «imagen real» caía sobre la cota de s′.
  const py = Math.min((semi - 16) / altRef, px * TOPE_VERTICAL);

  return { px, pxD, py, lenteX, ejeY, semi };
}

export default function SimLente({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [modo, setModo] = useState<Modo>('lente');
  const [f, setF] = useState(0.08);        // m
  const [s, setS] = useState(0.24);        // m — distancia del objeto
  const [altura, setAltura] = useState(0.04);
  const [remoto, setRemoto] = useState(0.5); // m — punto remoto del miope
  const [n1, setN1] = useState(1);
  const [n2, setN2] = useState(1.376);       // córnea
  const [th1, setTh1] = useState(30);

  // Ecuación de la lente delgada, despejada. Con s = f el denominador se anula:
  // los rayos salen paralelos y la imagen se va al infinito.
  const si = Math.abs(s - f) < 1e-6 ? Infinity : (f * s) / (s - f);
  const M = Number.isFinite(si) ? -si / s : -Infinity;
  const hi = Number.isFinite(M) ? M * altura : 0;
  const P = 1 / f;
  const Pc = -1 / remoto;
  const senRefr = (n1 * Math.sin((th1 * Math.PI) / 180)) / n2;
  const th2 = Math.abs(senRefr) <= 1 ? (Math.asin(senRefr) * 180) / Math.PI : NaN;

  const est = useRef<Estado>({ modo, f, s, si, altura, hi });
  est.current = { modo, f, s, si, altura, hi };

  /** Última geometría dibujada: es la que leen los manejadores de puntero. */
  const geoRef = useRef<Geo | null>(null);
  /** Cámara suavizada. `null` hasta el primer frame, que entra sin lerp. */
  const camRef = useRef<{ px: number; pxD: number; py: number; lenteX: number } | null>(null);
  const dragRef = useRef<
    | null
    | {
        asa: Asa; x0: number; y0: number;
        s0: number; h0: number; f0: number; si0: number;
        px0: number; py0: number; lenteX0: number;
      }
  >(null);
  const hoverRef = useRef<Asa | null>(null);
  /** Focal del modo lente, para restaurarla al volver del ojo. */
  const fLenteRef = useRef(0.08);

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, paleta } = c;
    const e = est.current;
    const esOjo = e.modo === 'ojo';

    rejilla(c, 28);

    /* ─── Cámara ──────────────────────────────────────────────────────────── */
    const meta = encuadrar(w, h, e);
    const cam = camRef.current;
    if (!cam) {
      camRef.current = { px: meta.px, pxD: meta.pxD, py: meta.py, lenteX: meta.lenteX };
    } else {
      cam.px += (meta.px - cam.px) * LERP;
      cam.pxD += (meta.pxD - cam.pxD) * LERP;
      cam.py += (meta.py - cam.py) * LERP;
      cam.lenteX += (meta.lenteX - cam.lenteX) * LERP;
    }
    const { px, pxD, py, lenteX } = camRef.current!;
    const ejeY = meta.ejeY;

    const objX = lenteX - e.s * px;
    const objTop = ejeY - e.altura * py;
    const hayImagen = Number.isFinite(e.si);
    const imgX = hayImagen ? lenteX + e.si * pxD : Number.POSITIVE_INFINITY;
    // Dentro del ojo la altura va con la escala DEL OJO: con la del lado del
    // objeto la imagen retiniana mide 4 px y no se ve que esté invertida. Se
    // acota para que un objeto muy cercano no la mande fuera del cuadro.
    const pyImg = esOjo
      ? Math.min(pxD, (Math.min(ejeY - MARGEN.sup, h - MARGEN.inf - ejeY) * 0.8) /
          Math.max(Math.abs(e.hi), 1e-4))
      : py;
    const imgTop = hayImagen ? ejeY - e.hi * pyImg : ejeY;
    const virtual = e.si < 0;
    const imgDentro = hayImagen && imgX > 10 && imgX < w - 10;
    const fIzqX = lenteX - e.f * px;
    const fDerX = lenteX + e.f * pxD;

    geoRef.current = {
      w, h, ejeY, lenteX, px, pxD, py, objX, objTop, fIzqX, fDerX, imgX, imgVisible: imgDentro,
    };

    /* ─── Eje óptico ──────────────────────────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.25);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(14, ejeY);
    ctx.lineTo(w - 14, ejeY);
    ctx.stroke();
    ctx.restore();

    /* ─── Hasta dónde llega la construcción, en vertical ──────────────────── */
    // El rayo 1 entra a la altura del objeto y el rayo 3 entra exactamente a la
    // altura de la imagen (por eso sale paralelo al eje): las dos flechas marcan
    // el alcance de los rayos sobre el plano de la lente.
    // El rayo por el foco sólo se dibuja si entra dentro de la zona útil, así
    // que sólo entonces cuenta para el alcance. Contándolo siempre, una imagen
    // a 99 cm —que ni se dibuja— estiraba la lente hasta ocupar el cuadro
    // entero, y el vidrio se comía la escena sin que hubiera rayo que cubrir.
    const usaTercero =
      !esOjo && hayImagen && Math.abs(imgTop - ejeY) <= meta.semi
      && Math.abs(objX - fIzqX) > 4;
    const alcanceRayos = Math.max(
      Math.abs(objTop - ejeY),
      usaTercero ? Math.abs(imgTop - ejeY) : 0,
    );
    // La lente se dibuja tan alta como haga falta para que TODOS los rayos la
    // atraviesen por el vidrio — es lo que hacen los diagramas de los libros—,
    // y se ensancha con la altura para no acabar siendo un fideo vertical.
    const semiLente = esOjo
      ? Math.min(74, Math.max(46, e.altura * py * 1.25 + 26))
      : Math.min(Math.max(alcanceRayos + 12, 44), meta.semi, TOPE_LENTE);
    const rxLente = Math.min(Math.max(semiLente * 0.15, 11), 21);

    if (esOjo) {
      dibujarOjo(c, { lenteX, ejeY, pxD, semiLente });
    } else {
      /* ─── Plano de la lente ─────────────────────────────────────────────── */
      // En la aproximación paraxial los rayos se refractan en el PLANO de la
      // lente, no en el vidrio, y el vidrio dibujado nunca es tan alto como el
      // rayo más externo. Sin esta línea, un rayo que entra por encima del borde
      // parece doblarse en el aire — que es justo lo que se veía al subir la
      // altura del objeto o al crecer la imagen invertida.
      const semiPlano = Math.min(alcanceRayos + 8, meta.semi);
      if (semiPlano > semiLente + 2) {
        ctx.save();
        ctx.strokeStyle = alfa(paleta.acento, 0.5);
        ctx.lineWidth = 1.6;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(lenteX, ejeY - semiPlano);
        ctx.lineTo(lenteX, ejeY + semiPlano);
        ctx.stroke();
        // Topes en los extremos: sin ellos la línea parece un rayo vertical más
        // en vez de la prolongación del plano donde la lente ya no llega.
        ctx.setLineDash([]);
        [-semiPlano, semiPlano].forEach((dy) => {
          ctx.beginPath();
          ctx.moveTo(lenteX - 5, ejeY + dy);
          ctx.lineTo(lenteX + 5, ejeY + dy);
          ctx.stroke();
        });
        ctx.restore();
      }

      /* ─── La lente ──────────────────────────────────────────────────────── */
      ctx.save();
      ctx.strokeStyle = paleta.acento;
      ctx.fillStyle = alfa(paleta.acento, 0.12);
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(lenteX, ejeY, rxLente, semiLente, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      /* ─── Focos (asas de arrastre) ──────────────────────────────────────── */
      ([['F', fIzqX], ["F′", fDerX]] as const).forEach(([rot, fx]) => {
        if (fx < 6 || fx > w - 6) return;
        const activo = hoverRef.current === 'foco' || dragRef.current?.asa === 'foco';
        ctx.save();
        ctx.strokeStyle = alfa(paleta.ink, activo ? 0.5 : 0.24);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(fx, ejeY, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = alfa(paleta.ink, 0.6);
        ctx.beginPath();
        ctx.arc(fx, ejeY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        texto(c, rot, fx, ejeY + 22, { align: 'center', size: 10.5, peso: 700 });
      });
    }

    /* ─── Objeto ──────────────────────────────────────────────────────────── */
    const asaObj = hoverRef.current === 'objeto' || dragRef.current?.asa === 'objeto';
    flecha(ctx, objX, ejeY, objTop, '#F5A623', false);
    if (asaObj) {
      ctx.save();
      ctx.strokeStyle = alfa('#F5A623', 0.75);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(objX, objTop, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    // El rótulo va pegado a la PUNTA, no al pie de la flecha: con la imagen
    // invertida, un rótulo anclado al eje quedaba a 150 px de la flecha que
    // nombra y parecía estar señalando otra cosa.
    texto(c, 'objeto', rotX(objX, w), objTop - 13,
      { align: 'center', size: 10, peso: 700, color: '#F5A623' });

    /* ─── Rayos y imagen ──────────────────────────────────────────────────── */
    const colorRayo = alfa('#E85B4A', 0.85);

    if (!hayImagen) {
      // Objeto en el foco: los dos rayos salen paralelos entre sí y no llegan a
      // cortarse. El paralelo al eje sale por F′ con la pendiente del central.
      const mCentral = (ejeY - objTop) / (lenteX - objX || 1);
      rayo(ctx, [[objX, objTop], [lenteX, objTop], [w - 14, objTop + mCentral * (w - 14 - lenteX)]],
        colorRayo);
      rayo(ctx, [[objX, objTop], [lenteX, ejeY], [w - 14, ejeY + mCentral * (w - 14 - lenteX)]],
        colorRayo);
      texto(c, 'objeto en el foco · los rayos salen paralelos, la imagen se va al infinito',
        w / 2, MARGEN.sup + 8, { align: 'center', size: 11, peso: 700, color: '#E85B4A' });
    } else if (esOjo) {
      // En el ojo lo que importa es DÓNDE converge el haz respecto a la retina,
      // no la construcción con los tres rayos: el lado del objeto y el interior
      // del globo van a escalas distintas y un «rayo por el centro» dibujado a
      // caballo entre las dos saldría quebrado, sugiriendo una desviación que
      // no existe. Se dibuja el cono marginal, que es el esquema clínico.
      const pupila = Math.min(semiLente * 0.62, 34);
      [-1, 1].forEach((lado) => {
        rayo(ctx, [
          [objX, objTop],
          [lenteX, ejeY + lado * pupila],
          [imgX, imgTop],
        ], colorRayo);
      });
      // Más allá del punto de corte el haz vuelve a abrirse.
      if (imgDentro) {
        [-1, 1].forEach((lado) => {
          const dx = imgX - lenteX;
          const dy = imgTop - (ejeY + lado * pupila);
          const k = Math.max(0, (Math.min(w - 14, imgX + 60) - imgX) / (dx || 1));
          rayo(ctx, [[imgX, imgTop], [imgX + dx * k, imgTop + dy * k]], alfa('#E85B4A', 0.4));
        });
      }
    } else {
      /* Los tres rayos principales, todos quebrando en x = lenteX. */
      const finX = w - 14;
      // Altura a la que cada rayo llega a la lente. Después de ella los tres
      // apuntan al mismo sitio, que es justo lo que la construcción demuestra.
      const entradas: number[] = [
        objTop, // 1 · paralelo al eje, sale por F′
        ejeY,   // 2 · por el centro de la lente, sin desviarse
      ];
      // 3 · el que pasa por el foco objeto y sale paralelo. Sin sentido cuando
      // el objeto está sobre F (la recta sería vertical).
      // `usaTercero` lo omite cuando entraría fuera del cuadro (imagen
      // lejísimos): ahí sólo se vería una diagonal cruzando la escena y
      // saliéndose, que confunde en vez de demostrar nada. Con dos rayos la
      // imagen ya queda determinada.
      if (usaTercero) {
        const pend = (ejeY - objTop) / (fIzqX - objX);
        entradas.push(objTop + pend * (lenteX - objX));
      }

      entradas.forEach((yEnt) => {
        // Antes de la lente: del objeto al punto de entrada.
        rayo(ctx, [[objX, objTop], [lenteX, yEnt]], colorRayo);
        // Después: la recta que une el punto de entrada con la imagen. Vale para
        // las dos: en la real pasa por ella, en la virtual diverge alejándose.
        const m = (imgTop - yEnt) / (imgX - lenteX || 1);
        rayo(ctx, [[lenteX, yEnt], [finX, yEnt + m * (finX - lenteX)]], colorRayo);
        // En una imagen virtual los rayos NO se cortan de verdad: se cortan sus
        // prolongaciones hacia atrás. Punteadas para decirlo.
        if (virtual) rayo(ctx, [[lenteX, yEnt], [imgX, imgTop]], colorRayo, true);
      });
    }

    /* ─── Imagen ──────────────────────────────────────────────────────────── */
    if (hayImagen && imgDentro && !esOjo) {
      const col = virtual ? alfa(paleta.acento, 0.65) : paleta.acento;
      flecha(ctx, imgX, ejeY, imgTop, col, virtual);
      const abajo = imgTop > ejeY;
      texto(c, virtual ? 'imagen virtual' : 'imagen real',
        rotX(imgX, w), imgTop + (abajo ? 15 : -13), {
          align: 'center', size: 10, peso: 700, color: paleta.acento,
        });
    } else if (hayImagen && !imgDentro && !esOjo) {
      // Fuera de encuadre: se dice dónde cayó en vez de dibujarla mal.
      const derecha = imgX >= w - 10;
      const bx = derecha ? w - 16 : 16;
      ctx.save();
      ctx.fillStyle = paleta.acento;
      ctx.beginPath();
      ctx.moveTo(bx, ejeY - 9);
      ctx.lineTo(bx, ejeY + 9);
      ctx.lineTo(bx + (derecha ? 11 : -11), ejeY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      texto(c, `imagen a ${Math.abs(e.si * 100).toFixed(0)} cm — fuera del cuadro`,
        derecha ? bx - 8 : bx + 8, ejeY - 22,
        { align: derecha ? 'right' : 'left', size: 10.5, peso: 700, color: paleta.acento });
    }

    if (esOjo && imgDentro) {
      flecha(ctx, imgX, ejeY, imgTop, paleta.acento, false, 2.6, 8);
    }

    /* ─── Cotas de distancia ──────────────────────────────────────────────── */
    const yCota = h - 54;
    cota(c, objX, lenteX, yCota, `s = ${(e.s * 100).toFixed(0)} cm`, alfa('#F5A623', 0.85));
    if (!esOjo && hayImagen && imgDentro) {
      cota(c, lenteX, imgX, yCota + 20, `s′ = ${(e.si * 100).toFixed(1)} cm`,
        alfa(paleta.acento, 0.85));
    }
    if (esOjo) {
      // Las dos cotas del ojo van en la MISMA línea —son contiguas, no se
      // solapan— porque en el segundo renglón chocaban con el veredicto, que
      // aquí ocupa dos líneas en vez de una.
      cota(c, lenteX, lenteX + OJO_AXIAL * pxD, yCota,
        `longitud axial = ${(OJO_AXIAL * 1000).toFixed(0)} mm`, alfa('#E85B4A', 0.8));
      // El aviso de escala sólo si la hay: con el objeto muy cerca las dos
      // escalas casi coinciden, y anunciar «ampliado ×1.2» hacía dudar de un
      // dibujo que en ese caso es prácticamente a escala.
      if (pxD / px >= 1.5) {
        texto(c, `el ojo, ampliado ×${(pxD / px).toFixed(1)} respecto al lado del objeto`,
          w - 14, MARGEN.sup - 6, { align: 'right', size: 9.5, peso: 600 });
      }
    }

    /* ─── Veredicto ───────────────────────────────────────────────────────── */
    if (esOjo) {
      const desenfoque = hayImagen ? (e.si - OJO_AXIAL) * 1000 : NaN;
      // El veredicto dice DÓNDE cae la imagen, no da un diagnóstico: un ojo sano
      // mirando de cerca también enfoca detrás de la retina y lo resuelve
      // acomodando. Llamar «hipermetropía» a eso sería un error médico.
      const diagnostico = !Number.isFinite(desenfoque)
        ? 'sin imagen'
        : Math.abs(desenfoque) < 0.05
        ? 'enfoca justo en la retina'
        : desenfoque > 0
        ? `enfoca ${desenfoque.toFixed(2)} mm DETRÁS · le falta potencia (acomoda, o es hipermétrope)`
        : `enfoca ${Math.abs(desenfoque).toFixed(2)} mm DELANTE · le sobra potencia (miopía)`;
      texto(c, diagnostico, w / 2, h - 26, {
        align: 'center', size: 11.5, peso: 800,
        color: Math.abs(desenfoque) < 0.05 ? paleta.acento : '#E85B4A',
      });
      texto(c, `un miope con punto remoto de ${remoto.toFixed(2)} m necesita ${Pc.toFixed(2)} D`,
        w / 2, h - 10, { align: 'center', size: 10 });
    } else {
      texto(
        c,
        hayImagen
          ? `s′ = ${(e.si * 100).toFixed(1)} cm · aumento ${M.toFixed(2)}× · ${
              M < 0 ? 'invertida' : 'derecha'
            } · ${virtual ? 'virtual' : 'real'}`
          : 'imagen en el infinito',
        w / 2, h - 14, { align: 'center', size: 11.5, peso: 800, color: paleta.acento },
      );
    }
  };

  // Escena estática: la construcción de rayos no evoluciona en el tiempo. El
  // bucle sigue corriendo porque la cámara se suaviza frame a frame.
  const { canvasRef } = useSimCanvas(dibujar, { alto: 380 });

  /* ─── Arrastre ────────────────────────────────────────────────────────────── */

  const asaEn = useCallback((x: number, y: number): Asa | null => {
    const g = geoRef.current;
    if (!g) return null;
    const e = est.current;

    // El objeto primero: es el que se agarra el 90 % de las veces.
    const yLo = Math.min(g.objTop, g.ejeY) - 12;
    const yHi = Math.max(g.objTop, g.ejeY) + 12;
    if (Math.abs(x - g.objX) < 15 && y > yLo && y < yHi) return 'objeto';

    if (Math.abs(y - g.ejeY) < 14) {
      if (e.modo === 'ojo') {
        if (g.imgVisible && Math.abs(x - g.imgX) < 16) return 'focoOjo';
      } else if (Math.abs(x - g.fIzqX) < 13 || Math.abs(x - g.fDerX) < 13) {
        return 'foco';
      }
    }
    return null;
  }, []);

  const puntero = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  };

  const onDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = puntero(ev);
    const asa = asaEn(x, y);
    if (!asa) return;
    const g = geoRef.current!;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    dragRef.current = {
      asa, x0: x, y0: y,
      s0: s, h0: altura, f0: f, si0: Number.isFinite(si) ? si : 0,
      // Escala y origen congelados: con los del frame en curso el gesto se
      // realimentaría (muevo → el encuadre se reajusta → parece que moví más).
      px0: asa === 'focoOjo' ? g.pxD : g.px,
      py0: g.py,
      lenteX0: g.lenteX,
    };
    hoverRef.current = asa;
  };

  const onMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = puntero(ev);
    const d = dragRef.current;

    if (!d) {
      const asa = asaEn(x, y);
      hoverRef.current = asa;
      ev.currentTarget.style.cursor = asa ? 'grab' : 'default';
      return;
    }

    ev.currentTarget.style.cursor = 'grabbing';
    const dx = (x - d.x0) / d.px0;
    const dy = (y - d.y0) / d.py0;

    if (d.asa === 'objeto') {
      // El mismo tope que la perilla: si el arrastre pudiera pasarse, el mando
      // dejaría de coincidir con el dibujo justo en los valores que rompen.
      setS(clamp(d.s0 - dx, limS(modo)));
      setAltura(clamp(d.h0 - dy, LIM.h));
    } else if (d.asa === 'foco') {
      // Da igual qué foco se agarre: los dos son f, uno a cada lado. El signo lo
      // pone el lado en el que empezó el gesto, para que la focal siga a la mano.
      const derecha = d.x0 >= d.lenteX0;
      setF(clamp(d.f0 + (derecha ? dx : -dx), LIM.f));
    } else {
      // Arrastrar el punto de convergencia dentro del ojo cambia su potencia:
      // con 1/f = 1/s + 1/s′ y s fijo, la focal sale de la nueva s′.
      const siNueva = Math.max(0.004, d.si0 + dx);
      setF(clamp(1 / (1 / s + 1 / siNueva), LIM.fOjo));
    }
  };

  const soltar = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      try { ev.currentTarget.releasePointerCapture(ev.pointerId); } catch { /* ya soltado */ }
      dragRef.current = null;
    }
    const { x, y } = puntero(ev);
    const asa = asaEn(x, y);
    hoverRef.current = asa;
    ev.currentTarget.style.cursor = asa ? 'grab' : 'default';
  };

  const onLeave = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current) return;
    hoverRef.current = null;
    ev.currentTarget.style.cursor = 'default';
  };

  // Los presets del sílabo también pasan por los topes: un valor de un archivo
  // de datos rompe el dibujo igual que uno arrastrado con el ratón.
  useEffect(() => {
    if (!preset) return;
    if (preset.focal !== undefined) {
      const v = clamp(preset.focal, LIM.f);
      setF(v);
      fLenteRef.current = v;
    }
    if (preset.objeto !== undefined) setS(clamp(preset.objeto, LIM.s));
    if (preset.altura !== undefined) setAltura(clamp(preset.altura, LIM.h));
  }, [preset]);

  const cambiarModo = (v: Modo) => {
    setModo(v);
    if (v === 'ojo') {
      fLenteRef.current = f;
      setF(OJO_AXIAL);
      // Un objeto a 3 cm del ojo no lo enfoca nadie: se lleva a la distancia de
      // lectura, que además es el caso que el alumno reconoce.
      if (s < LIM.sOjo[0]) setS(0.25);
    } else {
      // Sin restaurar, la focal del ojo (1,7 cm) queda por debajo del mínimo de
      // la perilla de la lente y el slider aparece desincronizado del dibujo.
      setF(clamp(fLenteRef.current, LIM.f));
    }
  };

  return (
    <LabShell
      titulo="Lente delgada: construir la imagen y diagnosticar el ojo"
      acento={acento}
      onAcento={setAcento}
      sim="lente"
      magnitudes={{
        f, s, si: Number.isFinite(si) ? si : 0, h: altura, hi,
        M: Number.isFinite(M) ? M : 0, P, n1, n2, th1,
        th2: Number.isNaN(th2) ? 0 : th2, pr: remoto, Pc,
      }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M12 3c4 4 4 14 0 18-4-4-4-14 0-18Z" stroke="currentColor" strokeWidth="2"
            strokeLinejoin="round" />
          <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          {modo === 'lente' ? (
            <LabSlider label="Focal  f" magnitud="f" valor={f * 100}
              display={`${(f * 100).toFixed(1)} cm`}
              min={LIM.f[0] * 100} max={LIM.f[1] * 100} paso={0.5}
              onChange={(v) => { setF(v / 100); fLenteRef.current = v / 100; }} />
          ) : (
            <LabSlider label="Potencia del ojo  P" magnitud="P" valor={1 / f}
              display={`${(1 / f).toFixed(1)} D`}
              min={1 / LIM.fOjo[1]} max={1 / LIM.fOjo[0]} paso={0.5}
              onChange={(v) => setF(1 / v)} />
          )}
          <LabSlider label="Distancia del objeto  s" magnitud="s" valor={s * 100}
            display={`${(s * 100).toFixed(0)} cm`}
            min={limS(modo)[0] * 100} max={limS(modo)[1] * 100} paso={1}
            onChange={(v) => setS(v / 100)} />
          <LabSlider label="Altura del objeto  h" magnitud="h" valor={altura * 100}
            display={`${(altura * 100).toFixed(1)} cm`}
            min={LIM.h[0] * 100} max={LIM.h[1] * 100} paso={0.5}
            onChange={(v) => setAltura(v / 100)} />
          <LabSlider label="Punto remoto del miope" magnitud="pr" valor={remoto}
            display={`${remoto.toFixed(2)} m`}
            min={0.1} max={4} paso={0.05} onChange={setRemoto} />
          <LabSlider label="Ángulo de incidencia  θ₁" magnitud="th1" valor={th1}
            display={`${th1}°`}
            min={0} max={89} paso={1} onChange={setTh1} />

          <LabFila label="Escena">
            <Segmented
              valor={modo}
              onChange={cambiarModo}
              opciones={[
                { id: 'lente', label: 'Lente delgada' },
                { id: 'ojo',   label: 'El ojo humano' },
              ]}
            />
            {/* Los dos presets son de la lente: en el ojo la focal la fija el
                globo, así que «objeto en el foco» pediría un objeto a 1,7 cm
                del ojo y «objeto dentro del foco» es sencillamente imposible. */}
            {modo === 'lente' && (
              <>
                <Btn activo={Math.abs(s - f) < 0.005} onClick={() => setS(f)}>
                  Objeto en el foco
                </Btn>
                <Btn activo={s < f} onClick={() => setS(Math.max(f * 0.5, LIM.s[0]))}>
                  Lupa · objeto dentro del foco
                </Btn>
              </>
            )}
          </LabFila>
        </>
      }
      nota={
        <>
          <strong>Arrastra el objeto</strong> por la escena —a los lados cambia <em>s</em>, arriba y
          abajo cambia <em>h</em>— y arrastra los focos <strong>F</strong> o <strong>F′</strong> para
          cambiar la focal. Acércalo hasta pasar del foco: la imagen real se va al infinito, cambia
          de lado y vuelve <strong>derecha y virtual</strong>. Eso es una lupa — y por eso una lupa
          no puede proyectar sobre una pared.
        </>
      }
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onPointerLeave={onLeave}
      />
    </LabShell>
  );
}

/* ─── Piezas de dibujo ────────────────────────────────────────────────────── */

/** Centro de un rótulo, apartado de los bordes para que no se corte a medias. */
const rotX = (x: number, w: number) => Math.min(Math.max(x, 42), w - 42);

/** Flecha vertical apoyada en el eje. La punta mira hacia donde crece. */
function flecha(
  ctx: CanvasRenderingContext2D,
  x: number,
  ejeY: number,
  top: number,
  color: string,
  punteada: boolean,
  grosor = 3.4,
  punta = 11,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = grosor;
  if (punteada) ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x, ejeY);
  ctx.lineTo(x, top);
  ctx.stroke();
  ctx.setLineDash([]);
  const dir = top > ejeY ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x - 6, top + dir * punta);
  ctx.lineTo(x + 6, top + dir * punta);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function rayo(
  ctx: CanvasRenderingContext2D,
  puntos: [number, number][],
  color: string,
  punteado = false,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  if (punteado) ctx.setLineDash([4, 5]);
  ctx.beginPath();
  puntos.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

/**
 * Cota entre dos abscisas. Existe porque la queja de fondo era «no se entiende
 * a qué distancia está nada»: con el encuadre auto la escala cambia sola, así
 * que el dibujo tiene que decir cuántos centímetros mide lo que se ve.
 */
function cota(c: CanvasCtx, x1: number, x2: number, y: number, rotulo: string, color: string) {
  const { ctx, w } = c;
  const a = Math.max(6, Math.min(x1, x2));
  const b = Math.min(w - 6, Math.max(x1, x2));
  if (b - a < 26) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(a, y);
  ctx.lineTo(b, y);
  ctx.moveTo(a, y - 4);
  ctx.lineTo(a, y + 4);
  ctx.moveTo(b, y - 4);
  ctx.lineTo(b, y + 4);
  ctx.stroke();
  ctx.restore();
  texto(c, rotulo, (a + b) / 2, y - 9, { align: 'center', size: 9.5, peso: 700, color });
}

/**
 * Globo ocular en corte. Va a su propia escala (`pxD`), y por eso la escena lo
 * rotula: 17 mm de ojo y 24 cm de distancia al objeto no caben juntos a la
 * misma escala, y dibujarlo «a escala» dejaría el ojo en tres píxeles.
 */
function dibujarOjo(
  c: CanvasCtx,
  { lenteX, ejeY, pxD, semiLente }: { lenteX: number; ejeY: number; pxD: number; semiLente: number },
) {
  const { ctx, paleta } = c;
  const axial = OJO_AXIAL * pxD;
  const rx = axial / 2;
  const ry = Math.min(axial * 0.47, semiLente + 16);
  const cx = lenteX + rx;

  // Esclera.
  ctx.save();
  ctx.fillStyle = alfa(paleta.ink, 0.05);
  ctx.strokeStyle = alfa(paleta.ink, 0.35);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, ejeY, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Retina: el arco del fondo, que es contra el que se mide todo.
  ctx.save();
  ctx.strokeStyle = '#E85B4A';
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.ellipse(cx, ejeY, rx, ry, 0, -0.95, 0.95);
  ctx.stroke();
  ctx.restore();
  // Fuera del globo: dentro se leía sobre la esclera y sobre los rayos.
  texto(c, 'retina', cx + rx + 6, ejeY - ry * 0.62, {
    align: 'left', size: 10, peso: 700, color: '#E85B4A',
  });

  // Córnea + cristalino: el plano donde se refracta todo en este modelo.
  ctx.save();
  ctx.strokeStyle = paleta.acento;
  ctx.fillStyle = alfa(paleta.acento, 0.14);
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(lenteX, ejeY, Math.max(9, axial * 0.09), Math.min(semiLente, ry * 0.85), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  texto(c, 'córnea + cristalino', lenteX, ejeY + Math.min(semiLente, ry * 0.85) + 14, {
    align: 'center', size: 9.5, peso: 700, color: paleta.acento,
  });
}
