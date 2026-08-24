'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Btn, useAcento, useSimCanvas, rejilla, texto, alfa, vector, type CanvasCtx,
} from './SimShell';
import { LabShell, LabSlider, LabFila } from './LabShell';
import styles from '@/styles/fisicaSim.module.css';

/**
 * C4 · La palanca de tercer género del codo.
 *
 * Es el ejemplo que el sílabo pide («palancas del cuerpo humano») y el que
 * mejor rompe la intuición: el cuerpo está lleno de palancas que PIERDEN
 * fuerza. Sostener 5 kg le cuesta al bíceps más de 350 N porque su inserción
 * está a 3,5 cm del codo y la mano a 35: diez veces más lejos, diez veces más
 * fuerza. El número grande de la escena es ése, y por eso `n = F_m / W` está en
 * el tablero: es la lectura que se recuerda.
 *
 * El antebrazo se dibuja con la carga colgando de verdad y el ángulo del codo
 * como perilla, pero los torques se toman con los brazos de palanca
 * HORIZONTALES (d·cos φ en los dos lados). Al aparecer el mismo coseno en los
 * dos miembros de la ecuación se cancela — que es justo por qué la fuerza del
 * bíceps apenas cambia con el ángulo, y es lo que la escena deja ver.
 */

/** Claves de `preset`: `carga`, `d1`, `d2`. */

const G = 9.81;
/** Peso del antebrazo + mano de un adulto: ~1,6 % del peso corporal. */
const PESO_ANTEBRAZO = 15;

export default function SimPalanca({
  acento: acentoBase,
  preset,
}: {
  acento: string;
  preset?: Record<string, number>;
}) {
  const [acento, setAcento] = useAcento(acentoBase);
  const [carga, setCarga] = useState(5);       // kg en la mano
  const [d1, setD1] = useState(0.035);         // m, inserción del bíceps
  const [d2, setD2] = useState(0.35);          // m, codo → mano
  const [angulo, setAngulo] = useState(30);    // ° del antebrazo sobre la horizontal
  const [verVectores, setVerVectores] = useState(true);

  // El centro de masa del antebrazo cae a ~43 % de su longitud desde el codo.
  const db = d2 * 0.43;
  const W = carga * G;
  const Fm = (W * d2 + PESO_ANTEBRAZO * db) / d1;
  const Fc = Fm - W - PESO_ANTEBRAZO;
  const VM = d1 / d2;
  const ratio = W > 0 ? Fm / W : 0;

  const est = useRef({ angulo, d1, d2, Fm, W });
  est.current = { angulo, d1, d2, Fm, W };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, paleta } = c;
    const phi = (est.current.angulo * Math.PI) / 180;

    rejilla(c, 28);

    const codo = { x: 92, y: h - 96 };
    const pxPorM = Math.min((w - codo.x - 100) / 0.42, 620);
    const punta = {
      x: codo.x + d2 * pxPorM * Math.cos(phi),
      y: codo.y - d2 * pxPorM * Math.sin(phi),
    };
    const insercion = {
      x: codo.x + d1 * pxPorM * Math.cos(phi),
      y: codo.y - d1 * pxPorM * Math.sin(phi),
    };

    /* ─── Húmero (vertical) ───────────────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.28);
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(codo.x, codo.y);
    ctx.lineTo(codo.x, codo.y - 150);
    ctx.stroke();
    ctx.restore();
    texto(c, 'húmero', codo.x - 12, codo.y - 150, { align: 'right', size: 10, peso: 700 });

    /* ─── Bíceps: del hombro a la inserción ───────────────────────────── */
    ctx.save();
    ctx.strokeStyle = alfa('#E85B4A', 0.45);
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(codo.x - 4, codo.y - 148);
    ctx.lineTo(insercion.x, insercion.y);
    ctx.stroke();
    ctx.restore();

    /* ─── Antebrazo ───────────────────────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(codo.x, codo.y);
    ctx.lineTo(punta.x, punta.y);
    ctx.stroke();
    ctx.restore();

    // Fulcro
    ctx.save();
    ctx.fillStyle = paleta.ink;
    ctx.beginPath();
    ctx.arc(codo.x, codo.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    texto(c, 'codo · fulcro', codo.x, codo.y + 24, { align: 'center', size: 10.5, peso: 700 });

    /* ─── La carga ────────────────────────────────────────────────────── */
    const lado = 20 + Math.min(carga, 20) * 1.5;
    ctx.save();
    ctx.fillStyle = '#F5A623';
    ctx.shadowColor = alfa('#F5A623', 0.4);
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(punta.x - lado / 2, punta.y + 12, lado, lado * 0.7, 5);
    ctx.fill();
    ctx.restore();
    texto(c, `${carga.toFixed(1)} kg`, punta.x, punta.y + 12 + lado * 0.35, {
      align: 'center', size: 10.5, peso: 800, color: '#fff',
    });

    /* ─── Vectores ────────────────────────────────────────────────────── */
    if (verVectores) {
      // Escala compartida por las tres fuerzas, saturada arriba: F_m puede ser
      // veinte veces W y a escala lineal pura se saldría del lienzo.
      const escala = 90 / Math.max(Fm, 1);
      vector(c, insercion.x, insercion.y, 0, -Fm * escala, '#E85B4A',
        `F_m ${Fm.toFixed(0)} N`);
      vector(c, punta.x, punta.y, 0, W * escala + 18, '#F5A623', `W ${W.toFixed(0)} N`);
      vector(c, codo.x, codo.y, 0, Fc * escala, '#8A8AA8', `F_c ${Fc.toFixed(0)} N`);
    }

    /* ─── Brazos de palanca, sobre la horizontal ──────────────────────── */
    const guiaY = codo.y + 46;
    [
      { x: insercion.x, label: `d₁ = ${(d1 * 100).toFixed(1)} cm`, color: '#E85B4A' },
      { x: punta.x,     label: `d₂ = ${(d2 * 100).toFixed(0)} cm`,  color: '#F5A623' },
    ].forEach((brazo, i) => {
      const y = guiaY + i * 17;
      ctx.save();
      ctx.strokeStyle = brazo.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(codo.x, y);
      ctx.lineTo(brazo.x, y);
      ctx.stroke();
      ctx.restore();
      texto(c, brazo.label, brazo.x + 8, y, { size: 10, peso: 700, color: brazo.color });
    });

    /* ─── El titular ──────────────────────────────────────────────────── */
    texto(c, `el bíceps hace ${ratio.toFixed(1)}× el peso que sostienes`, w / 2, 24, {
      align: 'center', size: 12.5, peso: 800, color: paleta.acento,
    });
    texto(c, `ventaja mecánica ${VM.toFixed(3)} · palanca de tercer género`, w / 2, 42, {
      align: 'center', size: 10.5,
    });
  };

  // Escena de estado estable: el brazo sostiene, no evoluciona. Igual que en la
  // sim térmica, un play/pausa aquí no pausaría nada.
  const { canvasRef } = useSimCanvas(dibujar, { alto: 360 });

  useEffect(() => {
    if (!preset) return;
    if (preset.carga !== undefined) setCarga(preset.carga);
    if (preset.d1    !== undefined) setD1(preset.d1);
    if (preset.d2    !== undefined) setD2(preset.d2);
  }, [preset]);

  return (
    <LabShell
      titulo="La palanca del codo: fuerza que se pierde a cambio de recorrido"
      acento={acento}
      onAcento={setAcento}
      sim="palanca"
      magnitudes={{
        mcarga: carga, W, d1, d2, Wb: PESO_ANTEBRAZO, db, Fm, Fc, VM, ratio,
      }}
      icono={
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M9 16 12 9l3 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      }
      mando={
        <>
          <LabSlider label="Carga en la mano" magnitud="mcarga" valor={carga}
            display={`${carga.toFixed(1)} kg`}
            min={0} max={25} paso={0.5} onChange={setCarga} />
          <LabSlider label="Inserción del bíceps  d₁" magnitud="d1" valor={d1 * 100}
            display={`${(d1 * 100).toFixed(1)} cm`}
            min={2} max={7} paso={0.1} onChange={(v) => setD1(v / 100)} />
          <LabSlider label="Codo → mano  d₂" magnitud="d2" valor={d2 * 100}
            display={`${(d2 * 100).toFixed(0)} cm`}
            min={20} max={42} paso={1} onChange={(v) => setD2(v / 100)} />
          <LabSlider label="Ángulo del codo" valor={angulo} display={`${angulo}°`}
            min={0} max={80} paso={1} onChange={setAngulo} />

          <LabFila>
            <Btn activo={verVectores} onClick={() => setVerVectores((v) => !v)}>
              Fuerzas sobre el antebrazo
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Mueve el <strong>ángulo del codo</strong> y mira F_m: casi no se inmuta. El coseno del
          ángulo aparece en los dos lados de la suma de torques y se cancela. Lo que sí la dispara
          es acercar la inserción del bíceps al codo — unos milímetros de anatomía.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
