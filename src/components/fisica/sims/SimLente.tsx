'use client';

import { useEffect, useRef, useState } from 'react';
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
 * En modo `ojo` la focal ya no es libre: la pone el globo ocular (~17 mm de
 * longitud axial) y lo que se mueve es dónde cae la imagen respecto a la
 * retina. Esa distancia con signo ES el defecto de refracción, y la lente
 * correctora se calcula del punto remoto.
 */

/** Claves de `preset`: `focal`, `objeto`, `altura`. */

type Modo = 'lente' | 'ojo';

/** Longitud axial de un ojo emétrope, en metros. */
const OJO_AXIAL = 0.017;

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

  const est = useRef({ modo, f, s, si, altura, hi });
  est.current = { modo, f, s, si, altura, hi };

  const dibujar = (c: CanvasCtx) => {
    const { ctx, w, h, paleta } = c;
    const e = est.current;

    rejilla(c, 28);

    const ejeY = e.modo === 'ojo' ? h * 0.44 : h * 0.46;
    // La lente va al 38 % para dejar sitio a la imagen real, que cae a su
    // derecha y suele quedar más lejos que el objeto.
    const lenteX = w * 0.38;
    const pxPorM = Math.min((lenteX - 42) / Math.max(e.s, 0.05), 1300);

    /* ─── Eje óptico ──────────────────────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = alfa(paleta.ink, 0.25);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(20, ejeY);
    ctx.lineTo(w - 20, ejeY);
    ctx.stroke();
    ctx.restore();

    /* ─── La lente (o la córnea del ojo) ──────────────────────────────── */
    const semiLente = 62;
    ctx.save();
    ctx.strokeStyle = paleta.acento;
    ctx.fillStyle = alfa(paleta.acento, 0.12);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(lenteX, ejeY, 15, semiLente, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* ─── Focos ───────────────────────────────────────────────────────── */
    [-1, 1].forEach((lado) => {
      const fx = lenteX + lado * e.f * pxPorM;
      ctx.save();
      ctx.fillStyle = alfa(paleta.ink, 0.55);
      ctx.beginPath();
      ctx.arc(fx, ejeY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      texto(c, lado < 0 ? 'F' : "F′", fx, ejeY + 16, { align: 'center', size: 10.5, peso: 700 });
    });

    /* ─── Objeto ──────────────────────────────────────────────────────── */
    const objX = lenteX - e.s * pxPorM;
    const objTop = ejeY - e.altura * pxPorM * 2.2;
    ctx.save();
    ctx.strokeStyle = '#F5A623';
    ctx.fillStyle = '#F5A623';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(objX, ejeY);
    ctx.lineTo(objX, objTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(objX, objTop);
    ctx.lineTo(objX - 6, objTop + 11);
    ctx.lineTo(objX + 6, objTop + 11);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    texto(c, 'objeto', objX, ejeY + 18, { align: 'center', size: 10, peso: 700, color: '#F5A623' });

    /* ─── Imagen ──────────────────────────────────────────────────────── */
    const hayImagen = Number.isFinite(e.si);
    const imgX = hayImagen ? lenteX + e.si * pxPorM : 0;
    const imgTop = hayImagen ? ejeY - e.hi * pxPorM * 2.2 : ejeY;
    const virtual = e.si < 0;

    if (hayImagen && Math.abs(imgX - lenteX) < w * 1.6) {
      ctx.save();
      ctx.strokeStyle = virtual ? alfa(paleta.acento, 0.6) : paleta.acento;
      ctx.fillStyle = virtual ? alfa(paleta.acento, 0.6) : paleta.acento;
      ctx.lineWidth = 3.4;
      if (virtual) ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(imgX, ejeY);
      ctx.lineTo(imgX, imgTop);
      ctx.stroke();
      ctx.setLineDash([]);
      const punta = imgTop > ejeY ? -11 : 11;
      ctx.beginPath();
      ctx.moveTo(imgX, imgTop);
      ctx.lineTo(imgX - 6, imgTop + punta);
      ctx.lineTo(imgX + 6, imgTop + punta);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      texto(c, virtual ? 'imagen virtual' : 'imagen real', imgX, ejeY + 18, {
        align: 'center', size: 10, peso: 700, color: paleta.acento,
      });
    }

    /* ─── Los tres rayos principales ──────────────────────────────────── */
    const rayo = (puntos: [number, number][], color: string, punteado = false) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      if (punteado) ctx.setLineDash([4, 5]);
      ctx.beginPath();
      puntos.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();
      ctx.restore();
    };

    if (hayImagen) {
      const colorRayo = alfa('#E85B4A', 0.85);
      const finX = virtual ? objX - 60 : Math.min(imgX + 40, w - 16);
      // 1 · Paralelo al eje, sale por el foco imagen.
      const pend1 = (imgTop - objTop) / (imgX - lenteX || 1);
      rayo([[objX, objTop], [lenteX, objTop], [finX, objTop + pend1 * (finX - lenteX)]], colorRayo);
      // 2 · Por el centro de la lente, sin desviarse.
      const pend2 = (imgTop - objTop) / (imgX - objX || 1);
      rayo([[objX, objTop], [finX, objTop + pend2 * (finX - objX)]], colorRayo);
      // Prolongaciones: en una imagen virtual los rayos NO se cortan de verdad,
      // se cortan sus prolongaciones hacia atrás. Punteadas para decirlo.
      if (virtual) {
        rayo([[lenteX, objTop], [imgX, imgTop]], colorRayo, true);
        rayo([[lenteX, ejeY + (objTop - ejeY) * 0.0], [imgX, imgTop]], colorRayo, true);
      }
    } else {
      texto(c, 'objeto en el foco · los rayos salen paralelos, la imagen se va al infinito',
        w / 2, ejeY - 92, { align: 'center', size: 11, peso: 700, color: '#E85B4A' });
    }

    /* ─── Modo ojo: la retina ─────────────────────────────────────────── */
    if (e.modo === 'ojo') {
      const retinaX = lenteX + OJO_AXIAL * pxPorM;
      ctx.save();
      ctx.strokeStyle = '#E85B4A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(lenteX, ejeY, OJO_AXIAL * pxPorM, -1.05, 1.05);
      ctx.stroke();
      ctx.restore();
      texto(c, 'retina', retinaX + 10, ejeY - 6, { size: 10, peso: 700, color: '#E85B4A' });

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
      texto(c, diagnostico, w / 2, h - 44, {
        align: 'center', size: 12, peso: 800,
        color: Math.abs(desenfoque) < 0.05 ? paleta.acento : '#E85B4A',
      });
      texto(c, `un miope con punto remoto de ${remoto.toFixed(2)} m necesita ${Pc.toFixed(2)} D`,
        w / 2, h - 24, { align: 'center', size: 10.5 });
    } else {
      texto(
        c,
        hayImagen
          ? `s′ = ${(e.si * 100).toFixed(1)} cm · aumento ${M.toFixed(2)}× · ${
              M < 0 ? 'invertida' : 'derecha'
            }`
          : 'imagen en el infinito',
        w / 2, h - 26, { align: 'center', size: 11.5, peso: 800, color: paleta.acento },
      );
    }
  };

  // Escena estática: la construcción de rayos no evoluciona en el tiempo.
  const { canvasRef } = useSimCanvas(dibujar, { alto: 380 });

  useEffect(() => {
    if (!preset) return;
    if (preset.focal   !== undefined) setF(preset.focal);
    if (preset.objeto  !== undefined) setS(preset.objeto);
    if (preset.altura  !== undefined) setAltura(preset.altura);
  }, [preset]);

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
              min={2} max={30} paso={0.5} onChange={(v) => setF(v / 100)} />
          ) : (
            <LabSlider label="Potencia del ojo  P" magnitud="P" valor={1 / f}
              display={`${(1 / f).toFixed(1)} D`}
              min={40} max={75} paso={0.5} onChange={(v) => setF(1 / v)} />
          )}
          <LabSlider label="Distancia del objeto  s" magnitud="s" valor={s * 100}
            display={`${(s * 100).toFixed(0)} cm`}
            min={3} max={120} paso={1} onChange={(v) => setS(v / 100)} />
          <LabSlider label="Altura del objeto  h" magnitud="h" valor={altura * 100}
            display={`${(altura * 100).toFixed(1)} cm`}
            min={1} max={10} paso={0.5} onChange={(v) => setAltura(v / 100)} />
          <LabSlider label="Punto remoto del miope" magnitud="pr" valor={remoto}
            display={`${remoto.toFixed(2)} m`}
            min={0.1} max={4} paso={0.05} onChange={setRemoto} />
          <LabSlider label="Ángulo de incidencia  θ₁" magnitud="th1" valor={th1}
            display={`${th1}°`}
            min={0} max={89} paso={1} onChange={setTh1} />

          <LabFila label="Escena">
            <Segmented
              valor={modo}
              onChange={(v) => { setModo(v); if (v === 'ojo') setF(OJO_AXIAL); }}
              opciones={[
                { id: 'lente', label: 'Lente delgada' },
                { id: 'ojo',   label: 'El ojo humano' },
              ]}
            />
            <Btn activo={Math.abs(s - f) < 0.005} onClick={() => setS(f)}>
              Objeto en el foco
            </Btn>
            <Btn activo={s < f} onClick={() => setS(Math.max(f * 0.5, 0.03))}>
              Lupa · objeto dentro del foco
            </Btn>
          </LabFila>
        </>
      }
      nota={
        <>
          Acerca el objeto hasta pasar del foco: la imagen real se va al infinito, cambia de lado y
          vuelve <strong>derecha y virtual</strong>. Eso es una lupa — y por eso una lupa no puede
          proyectar sobre una pared.
        </>
      }
    >
      <canvas ref={canvasRef} className={styles.canvas} />
    </LabShell>
  );
}
