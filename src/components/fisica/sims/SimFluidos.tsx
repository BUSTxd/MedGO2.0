'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C5 · Vaso con estenosis: continuidad y Bernoulli sobre la misma escena.
 *
 * Las dos ecuaciones tiran en sentidos opuestos y ése es el contenido: al
 * estrechar, la continuidad OBLIGA a la sangre a acelerar, y Bernoulli dice
 * que allí donde va más rápido la presión baja. El resultado —una zona de baja
 * presión justo en el punto ya enfermo— es el mecanismo del colapso y del
 * soplo, y no se ve leyendo las fórmulas por separado.
 *
 * Las partículas se transportan con la velocidad LOCAL calculada de la
 * continuidad tramo a tramo, no con una animación de velocidad fija: el
 * apelotonamiento a la entrada del estrechamiento y el disparo dentro son la
 * prueba visual de A₁v₁ = A₂v₂.
 */

/** Claves de `preset`: `diametro`, `estenosis`, `velocidad`. */

const RHO = 1060;             // kg/m³ — densidad de la sangre
const ETA = 0.0035;           // Pa·s — viscosidad de la sangre
const PA_POR_MMHG = 133.322;
const N_PARTICULAS = 46;

export default function SimFluidos({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [diametro, setDiametro] = useState(0.02);  // m — aorta ≈ 2 cm
  const [reduccion, setReduccion] = useState(50);  // % de reducción del diámetro
  const [v1, setV1] = useState(0.4);               // m/s
  const [p1mm, setP1mm] = useState(100);           // mmHg
  const [verPresion, setVerPresion] = useState(true);

  const d2 = diametro * (1 - reduccion / 100);
  const A1 = Math.PI * (diametro / 2) ** 2;
  const A2 = Math.PI * (d2 / 2) ** 2;
  const v2 = A2 > 0 ? (A1 * v1) / A2 : 0;
  const P1 = p1mm * PA_POR_MMHG;
  const P2 = P1 + 0.5 * RHO * (v1 * v1 - v2 * v2);
  const dP = P1 - P2;
  const Q = A1 * v1;                       // m³/s
  const Qlmin = Q * 1000 * 60;             // L/min
  const Re = (RHO * v2 * d2) / ETA;

  const est = useRef({ diametro, d2, v1, v2, P1, P2, Re });
  est.current = { diametro, d2, v1, v2, P1, P2, Re };

  /** Posición de cada partícula a lo largo del vaso, en fracción 0–1. */
  const trazas = useRef<number[]>(
    Array.from({ length: N_PARTICULAS }, (_, i) => i / N_PARTICULAS),
  );
  const tPrev = useRef(0);

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    const margen = 26;
    const largo = w - margen * 2;
    const ejeY = 118;
    // El tramo estrecho ocupa el tercio central; las transiciones son los
    // sextos a cada lado.
    const perfil = (frac: number) => {
      if (frac < 0.33) return 1;
      if (frac > 0.67) return 1;
      // Transición suave para que el dibujo no tenga esquinas imposibles.
      if (frac < 0.42) return 1 - (1 - s.d2 / s.diametro) * ((frac - 0.33) / 0.09);
      if (frac > 0.58) return 1 - (1 - s.d2 / s.diametro) * ((0.67 - frac) / 0.09);
      return s.d2 / s.diametro;
    };
    const radioPx = (frac: number) => (perfil(frac) * s.diametro * 2100) / 2;
    // Continuidad punto a punto: A(x)·v(x) = constante, con A ∝ radio².
    const velocidad = (frac: number) => s.v1 / perfil(frac) ** 2;

    let dt = t - tPrev.current;
    tPrev.current = t;
    if (dt > 0) {
      dt = Math.min(dt, 0.05);
      // 0,12 m de vaso representados: convierte m/s en fracción por segundo.
      trazas.current = trazas.current.map((frac) => {
        const nueva = frac + (velocidad(frac) * dt) / 0.12;
        return nueva > 1 ? nueva - 1 : nueva;
      });
    }

    rejilla(c, 28);

    /* ─── Pared del vaso ──────────────────────────────────────────────── */
    const puntos = 120;
    ctx.save();
    ctx.fillStyle = alfa('#E85B4A', 0.1);
    ctx.strokeStyle = alfa('#E85B4A', 0.55);
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= puntos; i++) {
      const frac = i / puntos;
      const x = margen + frac * largo;
      const y = ejeY - radioPx(frac);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = puntos; i >= 0; i--) {
      const frac = i / puntos;
      ctx.lineTo(margen + frac * largo, ejeY + radioPx(frac));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* ─── Partículas de sangre ────────────────────────────────────────── */
    trazas.current.forEach((frac, i) => {
      const x = margen + frac * largo;
      const r = radioPx(frac);
      // Reparto determinista dentro de la sección: usar el índice en vez de un
      // aleatorio mantiene cada partícula en su «carril» al reciclarse.
      const carril = ((i * 37) % 100) / 100 - 0.5;
      const y = ejeY + carril * r * 1.5;
      const rapidez = velocidad(frac);
      // La estela larga donde va rápido es la lectura inmediata de v.
      const estela = Math.min(rapidez * 26, 34);

      ctx.save();
      ctx.strokeStyle = alfa(paleta.acento, 0.75);
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - estela, y);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();
    });

    texto(c, `${(s.diametro * 100).toFixed(1)} cm`, margen + largo * 0.14, ejeY - radioPx(0.14) - 14, {
      align: 'center', size: 10.5, peso: 700,
    });
    texto(c, `${(s.d2 * 100).toFixed(2)} cm`, margen + largo * 0.5, ejeY - radioPx(0.5) - 14, {
      align: 'center', size: 10.5, peso: 800, color: '#E85B4A',
    });

    /* ─── Perfiles de velocidad y presión ─────────────────────────────── */
    const graf = { x: margen, y: 176, w: largo, h: h - 216 };
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.03);
    ctx.beginPath();
    ctx.roundRect(graf.x, graf.y, graf.w, graf.h, 10);
    ctx.fill();
    ctx.restore();

    const vMax = Math.max(s.v2, 0.1) * 1.15;
    const pMin = Math.min(s.P2, s.P1) - Math.abs(s.P1 - s.P2) * 0.3;
    const pMax = s.P1 + Math.abs(s.P1 - s.P2) * 0.3;

    const curva = (
      valor: (frac: number) => number,
      min: number,
      max: number,
      color: string,
      grosor: number,
    ) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = grosor;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i <= puntos; i++) {
        const frac = i / puntos;
        const x = graf.x + frac * graf.w;
        const norm = (valor(frac) - min) / (max - min || 1);
        const y = graf.y + graf.h - 14 - norm * (graf.h - 30);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };

    curva(velocidad, 0, vMax, paleta.acento, 2.8);
    if (verPresion) {
      // Bernoulli evaluado punto a punto con la velocidad local: la curva de
      // presión es el espejo de la de velocidad, no una segunda animación.
      curva(
        (frac) => s.P1 + 0.5 * RHO * (s.v1 ** 2 - velocidad(frac) ** 2),
        pMin, pMax, '#F5A623', 2.8,
      );
    }

    texto(c, 'velocidad', graf.x + 10, graf.y + 14, {
      size: 10.5, peso: 800, color: paleta.acento,
    });
    if (verPresion) {
      texto(c, 'presión', graf.x + 76, graf.y + 14, {
        size: 10.5, peso: 800, color: '#F5A623',
      });
    }

    /* ─── Veredicto ───────────────────────────────────────────────────── */
    const turbulento = s.Re > 2000;
    texto(
      c,
      turbulento
        ? `Re = ${s.Re.toFixed(0)} · flujo turbulento: esto es lo que se ausculta como soplo`
        : `Re = ${s.Re.toFixed(0)} · flujo laminar, silencioso`,
      w / 2, h - 18,
      { align: 'center', size: 11.5, peso: 800, color: turbulento ? '#E85B4A' : paleta.muted },
    );
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, {
    alto: 400,
    onReiniciar: () => {
      trazas.current = Array.from({ length: N_PARTICULAS }, (_, i) => i / N_PARTICULAS);
      tPrev.current = 0;
    },
  });

  useEffect(() => {
    if (!preset) return;
    if (preset.diametro  !== undefined) setDiametro(preset.diametro);
    if (preset.estenosis !== undefined) setReduccion(preset.estenosis);
    if (preset.velocidad !== undefined) setV1(preset.velocidad);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Estenosis: continuidad y Bernoulli sobre el mismo vaso"
      acento={acento}
      onAcento={setAcento}
      sim="fluidos"
      reloj={reloj}
      magnitudes={{
        d1: diametro, d2, A1, A2, v1, v2, rho: RHO, eta: ETA,
        P1, P2, dP, P1mm: p1mm, P2mm: P2 / PA_POR_MMHG, Q: Qlmin, Re,
      }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 7c4 0 5 5 9 5s5-5 9-5M3 17c4 0 5-5 9-5s5 5 9 5"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Diámetro del vaso" magnitud="d1" valor={diametro * 1000}
            display={`${(diametro * 1000).toFixed(0)} mm`}
            min={4} max={30} paso={1} onChange={(v) => setDiametro(v / 1000)} />
          <LabSlider label="Reducción de la estenosis" magnitud="d2" valor={reduccion}
            display={`${reduccion} %`}
            min={0} max={85} paso={1} onChange={setReduccion} />
          <LabSlider label="Velocidad de entrada  v₁" magnitud="v1" valor={v1}
            display={`${v1.toFixed(2)} m/s`}
            min={0.05} max={1.5} paso={0.05} onChange={setV1} />
          <LabSlider label="Presión de entrada  P₁" magnitud="P1mm" valor={p1mm}
            display={`${p1mm} mmHg`}
            min={20} max={180} paso={1} onChange={setP1mm} />

          <LabFila>
            <Btn activo={verPresion} onClick={() => setVerPresion((v) => !v)}>
              Curva de presión
            </Btn>
            <Btn activo={reduccion === 0} onClick={() => setReduccion(0)}>
              Vaso sano
            </Btn>
            <Btn activo={reduccion === 75} onClick={() => setReduccion(75)}>
              Estenosis severa
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Con un <strong>50 % de reducción de diámetro</strong> el área cae al 25 % y la sangre pasa
          cuatro veces más rápido. La curva de presión se hunde justo ahí: el vaso enfermo es
          además donde menos presión hay para mantenerlo abierto.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
