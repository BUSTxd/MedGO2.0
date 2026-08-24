'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C2 · Choque frontal de dos carros, con el coeficiente de restitución como
 * perilla continua.
 *
 * El punto pedagógico es que `e` no da dos casos sino un CONTINUO: en e = 1 la
 * energía cinética se conserva, en e = 0 los cuerpos salen pegados, y en medio
 * se pierde una fracción que la escena mide. Por eso e es un slider y no un
 * par de botones «elástico / inelástico».
 *
 * Las velocidades finales se calculan de una vez con la solución cerrada del
 * sistema {conservación de p, definición de e} en lugar de simular el contacto:
 * el detalle del contacto no se pregunta y meter un resorte de contacto sólo
 * añadiría un parámetro invisible.
 */

/** Claves de `preset`: `m1`, `m2`, `v1`, `v2`, `e`. */

export default function SimColision({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [m1, setM1] = useState(2);   // kg
  const [m2, setM2] = useState(1);   // kg
  const [v1, setV1] = useState(3);   // m/s
  const [v2, setV2] = useState(-1);  // m/s
  const [e, setE] = useState(1);
  const [verVectores, setVerVectores] = useState(true);

  const p = m1 * v1 + m2 * v2;
  const v1f = (p + m2 * e * (v2 - v1)) / (m1 + m2);
  const v2f = (p + m1 * e * (v1 - v2)) / (m1 + m2);
  const Ki = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const Kf = 0.5 * m1 * v1f * v1f + 0.5 * m2 * v2f * v2f;
  const perdida = Ki > 0 ? ((Ki - Kf) / Ki) * 100 : 0;
  const impulso = m1 * (v1f - v1);

  const est = useRef({ m1, m2, v1, v2, v1f, v2f });
  est.current = { m1, m2, v1, v2, v1f, v2f };

  const vivo = useRef<Record<string, number>>({});
  /** Posiciones de los dos carros, en metros sobre la vía. */
  const carros = useRef({ x1: -3, x2: 3, chocado: false, tPrev: 0 });

  const reiniciarCarros = () => { carros.current = { x1: -3, x2: 3, chocado: false, tPrev: 0 }; };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, t, paleta } = c;
    const s = est.current;

    let dt = t - carros.current.tPrev;
    carros.current.tPrev = t;
    if (dt > 0) {
      dt = Math.min(dt, 0.05);
      const va = carros.current.chocado ? s.v1f : s.v1;
      const vb = carros.current.chocado ? s.v2f : s.v2;
      carros.current.x1 += va * dt;
      carros.current.x2 += vb * dt;

      // El choque se detecta por contacto de los bordes; el radio de cada carro
      // depende de su masa, así que el punto de encuentro se mueve con ella.
      const r1 = 0.22 + s.m1 * 0.045;
      const r2 = 0.22 + s.m2 * 0.045;
      if (!carros.current.chocado && carros.current.x2 - carros.current.x1 <= r1 + r2) {
        carros.current.chocado = true;
        // Se separan lo justo para no volver a disparar la detección en el
        // frame siguiente si las velocidades finales aún los acercan (e = 0).
        const centro = (carros.current.x1 + carros.current.x2) / 2;
        carros.current.x1 = centro - (r1 + r2) / 2 - 0.01;
        carros.current.x2 = centro + (r1 + r2) / 2 + 0.01;
      }
    }

    rejilla(c, 28);

    const margen = 26;
    const viaY = 132;
    const pxPorM = (w - margen * 2) / 14;   // 14 m de vía visible
    const aX = (metros: number) => w / 2 + metros * pxPorM;

    /* ─── La vía ──────────────────────────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.22);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margen, viaY + 26);
    ctx.lineTo(w - margen, viaY + 26);
    ctx.stroke();
    ctx.restore();

    for (let metro = -6; metro <= 6; metro += 2) {
      texto(c, `${metro}`, aX(metro), viaY + 40, { align: 'center', size: 9.5 });
    }

    /* ─── Los carros ──────────────────────────────────────────────────── */
    const chocado = carros.current.chocado;
    const dibujarCarro = (
      x: number, masa: number, vel: number, color: string, nombre: string,
    ) => {
      const r = 0.22 + masa * 0.045;
      const ancho = r * 2 * pxPorM;
      const alto = 30 + masa * 3.4;
      const px = aX(x);

      ctx.save();
      ctx.fillStyle = color;
      ctx.shadowColor = alfa(color, 0.42);
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 3;
      ctx.beginPath();
      ctx.roundRect(px - ancho / 2, viaY + 24 - alto, ancho, alto, 7);
      ctx.fill();
      ctx.restore();

      texto(c, nombre, px, viaY + 24 - alto / 2 - 7, {
        align: 'center', size: 13, peso: 800, color: '#fff',
      });
      texto(c, `${masa.toFixed(1)} kg`, px, viaY + 24 - alto / 2 + 9, {
        align: 'center', size: 9.5, peso: 700, color: 'rgba(255,255,255,0.85)',
      });

      if (verVectores) {
        // La flecha mide la velocidad a escala fija: comparar las de antes con
        // las de después sólo dice algo si la regla no cambia.
        vector(c, px, viaY + 24 - alto - 16, vel * 26, 0, color,
          `${vel.toFixed(2)} m/s`, { grosor: 2.6 });
      }
    };

    dibujarCarro(carros.current.x1, s.m1, chocado ? s.v1f : s.v1, paleta.acento, 'A');
    dibujarCarro(carros.current.x2, s.m2, chocado ? s.v2f : s.v2, '#F5A623', 'B');

    texto(c, chocado ? 'después del choque' : 'antes del choque', w / 2, 20, {
      align: 'center', size: 11, peso: 800,
      color: chocado ? paleta.acento : paleta.muted,
    });

    /* ─── Barras: momento y energía, antes y después ──────────────────── */
    const panel = { x: margen, y: viaY + 62, w: w - margen * 2, h: h - viaY - 78 };
    const filas: { label: string; antes: number; despues: number; nota: string }[] = [
      {
        label: 'Momento  p',
        antes: Math.abs(m1 * v1) + Math.abs(m2 * v2),
        despues: Math.abs(m1 * v1f) + Math.abs(m2 * v2f),
        nota: `p total = ${p.toFixed(2)} kg·m/s · se conserva`,
      },
      {
        label: 'Energía  K',
        antes: Ki,
        despues: Kf,
        nota: perdida < 0.05 ? 'elástico: K se conserva' : `se pierde el ${perdida.toFixed(1)} %`,
      },
    ];

    filas.forEach((fila, i) => {
      const y = panel.y + i * (panel.h / 2);
      const maxV = Math.max(fila.antes, fila.despues, 0.001);
      texto(c, fila.label, panel.x, y + 8, { size: 10.5, peso: 800 });
      texto(c, fila.nota, panel.x + panel.w, y + 8, {
        align: 'right', size: 10, peso: 700,
        color: i === 1 && perdida > 0.05 ? '#E85B4A' : paleta.acento,
      });

      [
        { v: fila.antes, etiqueta: 'antes', color: alfa(paleta.ink, 0.3) },
        { v: fila.despues, etiqueta: 'después', color: paleta.acento },
      ].forEach((barra, j) => {
        const by = y + 20 + j * 20;
        const bx = panel.x + 52;
        const bw = panel.w - 62;
        ctx.save();
        ctx.fillStyle = alfa(paleta.ink, 0.07);
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, 14, 7);
        ctx.fill();
        ctx.fillStyle = barra.color;
        ctx.beginPath();
        ctx.roundRect(bx, by, Math.max((bw * barra.v) / maxV, 14), 14, 7);
        ctx.fill();
        ctx.restore();
        texto(c, barra.etiqueta, panel.x, by + 7, { size: 9.5, peso: 600 });
        texto(c, barra.v.toFixed(2), bx + bw - 8, by + 7, {
          align: 'right', size: 10, peso: 800,
          color: j === 1 ? '#fff' : paleta.muted,
        });
      });
    });

    vivo.current = { t };
  };

  const { canvasRef, reloj } = useSimCanvas(dibujar, { alto: 400, onReiniciar: reiniciarCarros });

  useEffect(() => {
    if (!preset) return;
    if (preset.m1 !== undefined) setM1(preset.m1);
    if (preset.m2 !== undefined) setM2(preset.m2);
    if (preset.v1 !== undefined) setV1(preset.v1);
    if (preset.v2 !== undefined) setV2(preset.v2);
    if (preset.e  !== undefined) setE(preset.e);
    reiniciarCarros();
    reloj.reanudar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  /** Cualquier cambio de datos invalida el choque que ya ocurrió. */
  const rehacer = (fn: () => void) => { fn(); reiniciarCarros(); };

  return (
    <LabShell
      titulo="Choque frontal: qué se conserva y qué se pierde"
      acento={acento}
      onAcento={setAcento}
      sim="colision"
      reloj={reloj}
      magnitudes={{ m1, m2, v1, v2, e, p, v1f, v2f, Ki, Kf, perdida, J: impulso }}
      vivoRef={vivo}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="6.5" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
          <path d="M10.5 12h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Masa A  m₁" magnitud="m1" valor={m1} display={`${m1.toFixed(1)} kg`}
            min={0.5} max={8} paso={0.5} onChange={(v) => rehacer(() => setM1(v))} />
          <LabSlider label="Masa B  m₂" magnitud="m2" valor={m2} display={`${m2.toFixed(1)} kg`}
            min={0.5} max={8} paso={0.5} onChange={(v) => rehacer(() => setM2(v))} />
          <LabSlider label="v inicial A" magnitud="v1" valor={v1} display={`${v1.toFixed(1)} m/s`}
            min={0} max={6} paso={0.1} onChange={(v) => rehacer(() => setV1(v))} />
          <LabSlider label="v inicial B" magnitud="v2" valor={v2} display={`${v2.toFixed(1)} m/s`}
            min={-6} max={0} paso={0.1} onChange={(v) => rehacer(() => setV2(v))} />
          <LabSlider label="Restitución  e" magnitud="e" valor={e} display={e.toFixed(2)}
            min={0} max={1} paso={0.01} onChange={(v) => rehacer(() => setE(v))} />

          <LabFila>
            <Btn activo={Math.abs(e - 1) < 0.01} onClick={() => rehacer(() => setE(1))}>
              Elástico
            </Btn>
            <Btn activo={e < 0.01} onClick={() => rehacer(() => setE(0))}>
              Perfectamente inelástico
            </Btn>
            <Btn activo={verVectores} onClick={() => setVerVectores((v) => !v)}>
              Vectores de velocidad
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Baja <strong>e</strong> de 1 a 0 sin tocar nada más: la barra del momento no se mueve ni
          un píxel y la de energía se hunde. Eso es lo que separa las dos conservaciones — y por qué
          un airbag no puede reducir el impulso, sólo repartirlo en más tiempo.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
