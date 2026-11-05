/**
 * Tamaño con que una figura de Codex se manda a la web medgo-imgflow.
 *
 * Sale del ajuste a mano de BUST (2026-11-05, Hematopoyesis: 24 figuras → 645 KB
 * por la web, «todo se ve bien sin ningún truco») y se validó dejando cada figura
 * fuera del ajuste y prediciéndola (error mediano del ancho: 6 %).
 *
 * Lo que explica sus elecciones:
 *   · la PROPORCIÓN (r = 0,73 con el ancho): piensa en el alto, no en el ancho;
 *   · las LÍNEAS DE TEXTO (r = −0,51 con el área): más texto, algo más baja;
 *   · el tipo: las fotos van más pequeñas.
 * Lo que NO las explica (r ≈ 0): el tamaño de la imagen antes de Codex (son
 * capturas), el de la PNG de Codex, la altura de la letra y el ancho visible.
 *
 *   dibujo: alto = 573 · e^(−0,0044 · líneas), entre 480 y 600 px;
 *           ancho = alto × proporción, redondeado a la centena, entre 800 y 1700
 *           (apaisadas 800-1000, panorámicas 3:1 en 1600, verticales en 800).
 *   foto:   lado corto ≈ 460 px, ancho redondeado a la centena.
 *   nunca más grande que lo que entregó Codex.
 */

const centena = (x) => Math.round(x / 100) * 100;
const entre = (x, a, b) => Math.min(b, Math.max(a, x));

export const FONDO_FIGURAS = '#fbf7ee';   // = .lightboxImg en src/styles/resumenHtml.module.css

/** Método de reducción: «cubic» es el que más se parece al editor de BUST (a mismas medidas:
 *  0,84 de diferencia media por píxel y el mismo peso AVIF); lanczos3 pesaba un 4,4 % más. */
export const KERNEL = 'cubic';

export function altoDibujo(lineas = 0) {
  return entre(573 * Math.exp(-0.0044 * (lineas || 0)), 480, 600);
}

/** Ancho final en px. `tipo`: 'dibujo' | 'foto'; `lineas`: líneas de texto (analizar.py). */
export function anchoObjetivo({ W, H, tipo = 'dibujo', lineas = 0 }) {
  const proporcion = W / H;
  const ancho = tipo === 'foto'
    ? centena(460 * Math.max(1, proporcion))
    : entre(centena(altoDibujo(lineas) * proporcion), 800, 1700);
  return Math.min(W, ancho);
}
