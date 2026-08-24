'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Segmented, useAcento, useSimCanvas, rejilla, texto, alfa, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C8 · Cilindro con pistón + diagrama PV, sincronizados.
 *
 * Los cuatro procesos no son cuatro animaciones: son cuatro CAMINOS distintos
 * entre los mismos dos volúmenes, y lo que cambia es qué se conserva por el
 * camino. Verlos sobre el mismo par de ejes es lo que hace evidente que el
 * trabajo —el área bajo la curva— depende del camino y no sólo de los extremos,
 * que es la idea que la primera ley necesita para tener sentido.
 *
 * El estado final se calcula con la ley del proceso (PV = cte, P = cte, V = cte,
 * PV^γ = cte) y de ahí salen W, ΔU y Q. γ = 5/3 por ser gas monoatómico ideal,
 * coherente con la U = 3/2·nRT que usa el panel: mezclar γ diatómico con U
 * monoatómica daría números que no cierran con la primera ley.
 */

/** Claves de `preset`: `moles`, `temperatura`, `volumen`, `proceso`. */

type Proceso = 'isotermo' | 'isobaro' | 'isocoro' | 'adiabatico';

const R = 8.314;
const GAMMA = 5 / 3;

const PROCESOS: { id: Proceso; label: string; nota: string }[] = [
  { id: 'isotermo',   label: 'Isotermo',   nota: 'T constante · ΔU = 0, todo el calor sale como trabajo' },
  { id: 'isobaro',    label: 'Isóbaro',    nota: 'P constante · el trabajo es un rectángulo' },
  { id: 'isocoro',    label: 'Isócoro',    nota: 'V constante · W = 0, todo el calor calienta el gas' },
  { id: 'adiabatico', label: 'Adiabático', nota: 'Q = 0 · el gas se enfría al expandirse por sí solo' },
];

export default function SimGas({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [proceso, setProceso] = useState<Proceso>('isotermo');
  const [n, setN] = useState(1);            // mol
  const [T1, setT1] = useState(300);        // K
  const [V1, setV1] = useState(0.02);       // m³
  const [V2, setV2] = useState(0.04);       // m³

  const P1 = (n * R * T1) / V1;

  // Estado final y trabajo, según el camino.
  let P2 = P1;
  let T2 = T1;
  let W = 0;
  if (proceso === 'isotermo') {
    P2 = (n * R * T1) / V2;
    W = n * R * T1 * Math.log(V2 / V1);
  } else if (proceso === 'isobaro') {
    T2 = (P1 * V2) / (n * R);
    W = P1 * (V2 - V1);
  } else if (proceso === 'isocoro') {
    // Sin cambio de volumen no hay trabajo; el proceso se recorre subiendo P.
    P2 = P1 * 1.6;
    T2 = (P2 * V1) / (n * R);
    W = 0;
  } else {
    P2 = P1 * Math.pow(V1 / V2, GAMMA);
    T2 = (P2 * V2) / (n * R);
    W = (P1 * V1 - P2 * V2) / (GAMMA - 1);
  }

  const U1 = 1.5 * n * R * T1;
  const U2 = 1.5 * n * R * T2;
  const dU = U2 - U1;
  const Q = dU + W;
  const dS = T1 > 0 ? Q / T1 : 0;
  // Carnot necesita saber cuál foco es el frío: con (1 − T₂/T₁) a secas, un
  // proceso que calienta el gas daba un rendimiento negativo, que no es un
  // resultado sino la fórmula mal aplicada.
  const Tfria = Math.min(T1, T2);
  const Tcal = Math.max(T1, T2);
  const eta = Tcal > 0 ? (1 - Tfria / Tcal) * 100 : 0;
  const Wiso = n * R * T1 * Math.log(V2 / V1);
  const Wisob = P1 * (V2 - V1);

  const est = useRef({ proceso, P1, P2, V1, V2, T1, T2, n });
  est.current = { proceso, P1, P2, V1, V2, T1, T2, n };

  const vivo = useRef<Record<string, number>>({});

  /** Recorrido del proceso, 0 → 1, en bucle: el pistón va y vuelve. */
  const avance = useRef(0);

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    // Ping-pong de 0 a 1: el proceso se recorre y se deshace, para poder mirar
    // el camino en los dos sentidos sin un salto al reiniciar.
    const ciclo = (t * 0.4) % 2;
    avance.current = ciclo > 1 ? 2 - ciclo : ciclo;
    const u = avance.current;

    /** Estado (V, P, T) en el punto `u` del camino. */
    const estado = (frac: number) => {
      if (s.proceso === 'isocoro') {
        const P = s.P1 + (s.P2 - s.P1) * frac;
        return { V: s.V1, P, T: (P * s.V1) / (s.n * R) };
      }
      const V = s.V1 + (s.V2 - s.V1) * frac;
      let P: number;
      if (s.proceso === 'isotermo')      P = (s.n * R * s.T1) / V;
      else if (s.proceso === 'isobaro')  P = s.P1;
      else                               P = s.P1 * Math.pow(s.V1 / V, GAMMA);
      return { V, P, T: (P * V) / (s.n * R) };
    };

    const ahora = estado(u);

    rejilla(c, 28);

    const compacto = w < 620;
    const cil = compacto
      ? { x: 24, y: 20, w: w - 48, h: 128 }
      : { x: 24, y: 26, w: w * 0.34, h: h - 78 };
    const graf = compacto
      ? { x: 30, y: 168, w: w - 60, h: h - 200 }
      : { x: w * 0.44, y: 26, w: w * 0.5, h: h - 78 };

    /* ─── Cilindro con pistón ─────────────────────────────────────────── */
    const vMaxCil = Math.max(s.V1, s.V2) * 1.12;
    const alturaGas = (ahora.V / vMaxCil) * cil.h;
    const gasY = cil.y + cil.h - alturaGas;

    // El gas se tiñe con la temperatura: es la tercera variable, y sin color
    // habría que leerla del texto en vez de verla.
    const calor = Math.min(Math.max((ahora.T - 200) / 500, 0), 1);
    const colGas = calor > 0.5 ? '#E85B4A' : paleta.acento;

    ctx.save();
    ctx.fillStyle = alfa(colGas, 0.16 + calor * 0.4);
    ctx.beginPath();
    ctx.roundRect(cil.x, gasY, cil.w, alturaGas, 4);
    ctx.fill();
    ctx.strokeStyle = alfa(paleta.ink, 0.32);
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cil.x, cil.y);
    ctx.lineTo(cil.x, cil.y + cil.h);
    ctx.lineTo(cil.x + cil.w, cil.y + cil.h);
    ctx.lineTo(cil.x + cil.w, cil.y);
    ctx.stroke();
    ctx.restore();

    // Moléculas: su número no cambia (n es fijo), sólo el volumen que ocupan.
    // Es la lectura visual de la presión: mismas partículas, menos sitio.
    const nMol = 26;
    for (let i = 0; i < nMol; i++) {
      const fx = ((i * 61) % 100) / 100;
      const fy = ((i * 37) % 100) / 100;
      const vibra = Math.sin(t * (3 + calor * 9) + i) * (1.5 + calor * 4);
      ctx.save();
      ctx.fillStyle = alfa(colGas, 0.85);
      ctx.beginPath();
      ctx.arc(
        cil.x + 10 + fx * (cil.w - 20) + vibra,
        gasY + 8 + fy * Math.max(alturaGas - 16, 4) + vibra,
        2.6, 0, Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    }

    // Pistón
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.5);
    ctx.beginPath();
    ctx.roundRect(cil.x - 4, gasY - 12, cil.w + 8, 12, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(cil.x + cil.w / 2 - 4, Math.max(gasY - 46, cil.y - 26), 8, 36, 3);
    ctx.fill();
    ctx.restore();

    texto(c, `${ahora.T.toFixed(0)} K`, cil.x + cil.w / 2, gasY + alturaGas / 2, {
      align: 'center', size: 14, peso: 800, color: calor > 0.5 ? '#fff' : paleta.ink,
    });

    /* ─── Diagrama PV ─────────────────────────────────────────────────── */
    ctx.save();
    ctx.fillStyle = alfa(paleta.ink, 0.03);
    ctx.beginPath();
    ctx.roundRect(graf.x - 10, graf.y - 8, graf.w + 20, graf.h + 26, 10);
    ctx.fill();
    ctx.restore();

    const vLo = Math.min(s.V1, s.V2) * 0.85;
    const vHi = Math.max(s.V1, s.V2) * 1.1;
    const pLo = 0;
    const pHi = Math.max(s.P1, s.P2) * 1.15;
    const aX = (V: number) => graf.x + ((V - vLo) / (vHi - vLo)) * graf.w;
    const aY = (P: number) => graf.y + graf.h - ((P - pLo) / (pHi - pLo)) * graf.h;

    // Ejes
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.28);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(graf.x, graf.y);
    ctx.lineTo(graf.x, graf.y + graf.h);
    ctx.lineTo(graf.x + graf.w, graf.y + graf.h);
    ctx.stroke();
    ctx.restore();
    texto(c, 'P', graf.x - 6, graf.y + 4, { align: 'right', size: 11, peso: 800 });
    texto(c, 'V', graf.x + graf.w, graf.y + graf.h + 16, { align: 'right', size: 11, peso: 800 });

    // Área bajo la curva: el trabajo, que es de lo que va todo el diagrama.
    ctx.save();
    ctx.fillStyle = alfa(paleta.acento, 0.16);
    ctx.beginPath();
    ctx.moveTo(aX(estado(0).V), graf.y + graf.h);
    for (let i = 0; i <= 60; i++) {
      const e = estado((i / 60) * u);
      ctx.lineTo(aX(e.V), aY(e.P));
    }
    ctx.lineTo(aX(ahora.V), graf.y + graf.h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Camino completo, tenue, y el ya recorrido, sólido.
    const camino = (hasta: number, color: string, grosor: number) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = grosor;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const e = estado((i / 60) * hasta);
        const x = aX(e.V);
        const y = aY(e.P);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    };
    camino(1, alfa(paleta.ink, 0.22), 2);
    camino(u, paleta.acento, 3);

    // Punto actual
    ctx.save();
    ctx.fillStyle = paleta.acento;
    ctx.shadowColor = alfa(paleta.acento, 0.6);
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(aX(ahora.V), aY(ahora.P), 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    texto(c, 'W = área bajo la curva', graf.x + 10, graf.y + 14, {
      size: 10.5, peso: 800, color: paleta.acento,
    });
    texto(c, PROCESOS.find((p) => p.id === s.proceso)?.nota ?? '', w / 2, h - 16, {
      align: 'center', size: 11, peso: 700,
    });

    vivo.current = { t };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 380 });

  useEffect(() => {
    if (!preset) return;
    if (preset.moles       !== undefined) setN(preset.moles);
    if (preset.temperatura !== undefined) setT1(preset.temperatura);
    if (preset.volumen     !== undefined) setV1(preset.volumen);
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <LabShell
      titulo="Procesos termodinámicos: el mismo gas por cuatro caminos"
      acento={acento}
      onAcento={setAcento}
      sim="gas"
      reloj={reloj}
      magnitudes={{ n, T1, T2, V1, V2, P1, P2, W, Wiso, Wisob, Q, dU, U2, dS, eta, Tfria, Tcal }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M5 11h14" stroke="currentColor" strokeWidth="2" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Moles  n" magnitud="n" valor={n} display={`${n.toFixed(2)} mol`}
            min={0.1} max={3} paso={0.05} onChange={setN} />
          <LabSlider label="Temperatura  T₁" magnitud="T1" valor={T1} display={`${T1} K`}
            min={200} max={700} paso={5} onChange={setT1} />
          <LabSlider label="Volumen inicial  V₁" magnitud="V1" valor={V1 * 1000}
            display={`${(V1 * 1000).toFixed(0)} L`}
            min={5} max={40} paso={1} onChange={(v) => setV1(v / 1000)} />
          <LabSlider label="Volumen final  V₂" magnitud="V2" valor={V2 * 1000}
            display={`${(V2 * 1000).toFixed(0)} L`}
            min={5} max={80} paso={1} onChange={(v) => setV2(v / 1000)} />

          <LabFila label="Proceso">
            <Segmented
              valor={proceso}
              onChange={setProceso}
              opciones={PROCESOS.map((p) => ({ id: p.id, label: p.label }))}
            />
          </LabFila>
        </>
      }
      nota={
        <>
          Pasa de <strong>isotermo</strong> a <strong>adiabático</strong> sin tocar los volúmenes:
          los extremos del camino son los mismos y el área bajo la curva cambia. El trabajo depende
          del camino — por eso no existe una «energía de trabajo» guardada en el gas.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
