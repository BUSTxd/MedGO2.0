// Abdomen 3D: lo que Z-Anatomy no trae y se modela sobre su propio hígado.
//
// - Venas hepáticas derecha, media e izquierda: Z-Anatomy solo trae su
//   desembocadura en la cava. Cada una se traza por la cisura que la aloja,
//   medida como la superficie de contacto entre dos segmentos de Couinaud:
//   derecha entre VII-VIII y VI-V (cisura portal derecha), media entre IV y
//   V-VIII (cisura principal, línea de Cantlie), izquierda entre II y III.
// - Ramas derecha e izquierda de la vena porta: Z-Anatomy la trae solo hasta el
//   hilio. La izquierda tiene su porción transversa en el hilio y la umbilical en
//   la fisura del ligamento redondo (donde este se une), con ramas a II, III y IV;
//   la derecha se divide en anterior (V-VIII) y posterior (VI-VII).
// - Conducto hepático común con los hepáticos derecho e izquierdo, para que el
//   colédoco empiece donde le corresponde (Z-Anatomy une cístico y colédoco).
// - Ligamento falciforme y ligamento redondo: el falciforme une la cara
//   diafragmática del hígado (por la fisura umbilical, entre IV y II-III) con el
//   diafragma y la pared abdominal anterior; en su borde libre inferior lleva el
//   redondo, del ombligo a la escotadura del hígado y por su fisura hasta la rama
//   izquierda de la porta.
//
// Es un esquema anatómico sobre el modelo, no una disección: va rotulado como
// modelado por MedGO. Las cifras salen de medir el modelo (ver los comentarios);
// `verificarModelados` comprueba que cada vaso quede dentro del hígado.

import * as G from './geometria.mjs';

const SEG = {
  I: 'Posterior_segment_of_liver_(I)', II: 'Left_posterior_lateral_segment_of_liver_(II)', III: 'Left_anterior_lateral_segment_of_liver_(III)',
  IV: 'Left_medial_segment_of_liver_(IV)', V: 'Anterior_medial_segment_of_liver_(V)', VI: 'Anterior_lateral_segment_of_liver_(VI)',
  VII: 'Posterior_lateral_segment_of_liver_(VII)', VIII: 'Posterior_medial_segment_of_liver_(VIII)',
};

// ─── Cisuras: superficie de contacto entre segmentos ─────────────────────────
const H = 0.002;
function rejilla(m) {
  const h = new Map();
  for (let i = 0; i < m.v.length; i += 3) {
    const k = `${Math.floor(m.v[i] / H)},${Math.floor(m.v[i + 1] / H)},${Math.floor(m.v[i + 2] / H)}`;
    (h.get(k) ?? h.set(k, []).get(k)).push([m.v[i], m.v[i + 1], m.v[i + 2]]);
  }
  return h;
}
/** Vértices de A que tocan (≤ 1,5 mm) alguno de los segmentos B. */
function cisura(c, a, bs) {
  return c.una(`cisura:${a}:${bs.join('+')}`, () => {
    const hs = bs.map((b) => c.una(`rej:${b}`, () => rejilla(c.fuente(SEG[b]))));
    const m = c.fuente(SEG[a]);
    const out = [];
    for (let i = 0; i < m.v.length; i += 3) {
      const p = [m.v[i], m.v[i + 1], m.v[i + 2]], k = p.map((x) => Math.floor(x / H));
      let toca = false;
      for (const h of hs) for (let x = -1; x <= 1 && !toca; x++) for (let y = -1; y <= 1 && !toca; y++) for (let z = -1; z <= 1 && !toca; z++)
        for (const q of h.get(`${k[0] + x},${k[1] + y},${k[2] + z}`) ?? []) if (G.dist(p, q) < 0.0015) { toca = true; break; }
      if (toca) out.push(p);
    }
    return out;
  });
}

/**
 * Eje de una cisura visto desde un punto: los puntos de contacto se agrupan por su
 * distancia a `desde` y cada grupo da su centro. Así la vena va por el medio de la
 * cisura, desde la cava hasta `hasta` (fracción de la cisura que recorre).
 */
function ejeDeCisura(puntos, desde, hasta = 0.82, grupos = 7) {
  const d = puntos.map((p) => G.dist(p, desde));
  const max = Math.max(...d);
  const eje = [desde];
  for (let g = 1; g <= grupos; g++) {
    const a = ((g - 0.5) / grupos) * max * hasta, b = ((g + 0.5) / grupos) * max * hasta;
    const sel = puntos.filter((_, i) => d[i] >= a && d[i] < b);
    if (sel.length < 4) continue;
    eje.push(G.por(sel.reduce(G.suma), 1 / sel.length));
  }
  return eje;
}

/** Punto más alto del tubo cístico-colédoco de Z-Anatomy: ahí se une el hepático común. */
export const codoBiliar = (c) => c.una('codo', () => { const m = c.fuente('Bile_duct'); let k = 0; for (let i = 1; i < m.v.length / 3; i++) if (m.v[i * 3 + 1] > m.v[k * 3 + 1]) k = i; return G.vert(m, k); });

const centroDe = (m) => { let s = [0, 0, 0]; for (let i = 0; i < m.v.length; i += 3) s = G.suma(s, [m.v[i], m.v[i + 1], m.v[i + 2]]); return G.por(s, 3 / m.v.length); };
/** Punto a una fracción `t` del camino de `a` a `b`. */
const hacia = (a, b, t) => G.mezcla(a, b, t);

// Desembocaduras en la cava (medida: a la altura y = 1,24 m su centro está en
// (−1,59; 124,0; 1,66) cm con radio 1,26 cm; los muñones de Z-Anatomy salen hacia
// la derecha-delante y hacia la izquierda).
const CAVA = [-0.0159, 1.243, 0.0166];
const DESEMBOCA = {
  derecha: [-0.0255, 1.243, 0.0185],
  media: [-0.0150, 1.244, 0.0275],
  izquierda: [-0.0055, 1.245, 0.0235],
};
// Bifurcación de la porta: la punta superior de su tronco (medida, y = 1,199 m).
const BIFURCACION = [-0.0058, 1.1965, 0.0305];

/** Vena: tronco por la cisura y, si se pide, ramas a los centros de sus segmentos. */
function vena(eje, rInicio, rFin, ramas = []) {
  const partes = [G.tubo(G.curva(eje, 8), (s) => rInicio + (rFin - rInicio) * s, 12)];
  for (const r of ramas) partes.push(G.tubo(G.curva(r.puntos, 8), (s) => r.r0 + (r.r1 - r.r0) * s, 10));
  return G.unir(...partes);
}

export const MODELADOS = {
  // ── Venas hepáticas ────────────────────────────────────────────────────────
  'hepatica-derecha': (c) => {
    const eje = ejeDeCisura([...cisura(c, 'VIII', ['VII']), ...cisura(c, 'V', ['VI'])], DESEMBOCA.derecha);
    return vena([CAVA, ...eje], 0.0062, 0.0018);
  },
  'hepatica-media': (c) => {
    const eje = ejeDeCisura(cisura(c, 'IV', ['V', 'VIII']), DESEMBOCA.media);
    return vena([CAVA, ...eje], 0.0052, 0.0016);
  },
  'hepatica-izquierda': (c) => {
    const eje = ejeDeCisura(cisura(c, 'II', ['III']), DESEMBOCA.izquierda);
    // Recibe también la vena de la cisura umbilical (del IV, entre IV y III).
    const umb = ejeDeCisura(cisura(c, 'III', ['IV']), eje[1], 0.7, 4);
    return vena([CAVA, ...eje], 0.0050, 0.0016, [{ puntos: umb, r0: 0.0028, r1: 0.0013 }]);
  },

  // ── Ramas de la porta ──────────────────────────────────────────────────────
  'porta-derecha': (c) => {
    const tronco = [BIFURCACION, [-0.016, 1.1935, 0.0300], [-0.030, 1.1885, 0.0285]];
    const fin = tronco.at(-1);
    const cV = centroDe(c.fuente(SEG.V)), cVIII = centroDe(c.fuente(SEG.VIII)), cVI = centroDe(c.fuente(SEG.VI)), cVII = centroDe(c.fuente(SEG.VII));
    const anterior = G.mezcla(cV, cVIII, 0.5), posterior = G.mezcla(cVI, cVII, 0.5);
    return vena(tronco, 0.0065, 0.0058, [
      { puntos: [fin, hacia(fin, anterior, 0.35), hacia(fin, anterior, 0.7)], r0: 0.0045, r1: 0.0022 },
      { puntos: [fin, hacia(fin, posterior, 0.35), hacia(fin, posterior, 0.7)], r0: 0.0045, r1: 0.0022 },
    ]);
  },
  'porta-izquierda': (c) => {
    // Transversa por el hilio hacia la izquierda y umbilical hacia delante por la
    // fisura del ligamento redondo, donde termina en fondo de saco.
    const eje = [BIFURCACION, [0.0, 1.1915, 0.0300], [0.0045, 1.1860, 0.0350], [0.0060, 1.1830, 0.0470], [0.0062, 1.1815, 0.0575]];
    const cII = centroDe(c.fuente(SEG.II)), cIII = centroDe(c.fuente(SEG.III)), cIV = centroDe(c.fuente(SEG.IV));
    const codo = eje[2], punta = eje.at(-1);
    return vena(eje, 0.0055, 0.0040, [
      { puntos: [codo, hacia(codo, cII, 0.35), hacia(codo, cII, 0.65)], r0: 0.0030, r1: 0.0016 },
      { puntos: [punta, hacia(punta, cIII, 0.35), hacia(punta, cIII, 0.65)], r0: 0.0030, r1: 0.0016 },
      { puntos: [eje[3], hacia(eje[3], cIV, 0.35), hacia(eje[3], cIV, 0.65)], r0: 0.0028, r1: 0.0015 },
    ]);
  },

  // ── Conducto hepático común ────────────────────────────────────────────────
  // Del codo de la vía biliar sube por delante de la porta hasta el hilio, donde
  // recibe los hepáticos derecho e izquierdo.
  'hepatico-comun': (c) => {
    const codo = codoBiliar(c);
    const union = [-0.0165, 1.1815, 0.0380];
    return G.unir(
      G.tubo(G.curva([codo, [-0.0205, 1.1720, 0.0390], union], 8), 0.0021, 10),
      G.tubo(G.curva([union, [-0.0240, 1.1855, 0.0365], [-0.0330, 1.1880, 0.0330]], 8), (s) => 0.0018 - 0.0004 * s, 10),
      G.tubo(G.curva([union, [-0.0080, 1.1860, 0.0390], [0.0010, 1.1880, 0.0380]], 8), (s) => 0.0018 - 0.0004 * s, 10),
    );
  },

  // ── Ligamentos ─────────────────────────────────────────────────────────────
  // Perfil sagital medido en x = 0,4 cm (la fisura umbilical): el borde inferior
  // del hígado está a y = 1,160 m, z = 8,6-9,2 cm; su cara anterior llega a z = 9,9
  // cm entre y = 1,20 y 1,22, y el diafragma lo cubre por arriba hasta y ≈ 1,25.
  // La pared anterior (que el modelo no trae) se pone a 0,9-1,2 cm por delante.
  falciforme: () => {
    const visceral = G.curva([[0.004, 1.160, 0.0905], [0.004, 1.170, 0.0945], [0.004, 1.185, 0.0975], [0.004, 1.200, 0.0995], [0.004, 1.215, 0.0995], [0.004, 1.230, 0.0950], [0.004, 1.240, 0.0855], [0.004, 1.2475, 0.0690]], 5);
    const parietal = G.curva([[0.000, 1.030, 0.1080], [0.001, 1.080, 0.1100], [0.002, 1.130, 0.1110], [0.003, 1.170, 0.1100], [0.004, 1.205, 0.1080], [0.004, 1.228, 0.1040], [0.004, 1.246, 0.0930], [0.004, 1.2565, 0.0720]], 5);
    return G.lamina(visceral, parietal, 0.0016, 8);
  },
  redondo: () => G.tubo(G.curva([[0.000, 1.031, 0.1075], [0.0015, 1.080, 0.1030], [0.003, 1.125, 0.0975], [0.004, 1.158, 0.0905], [0.0048, 1.1665, 0.0760], [0.0057, 1.1735, 0.0640], [0.0062, 1.1800, 0.0590]], 8), (s) => 0.0022 - 0.0006 * s, 10),
};

/** Comprueba que los vasos modelados del hígado queden dentro de él (muestras por rayo). */
export function dentro(m, p) {
  // Paridad de cortes de un rayo en +X con los triángulos.
  let n = 0;
  for (let t = 0; t < m.f.length; t += 3) {
    const a = G.vert(m, m.f[t]), b = G.vert(m, m.f[t + 1]), c = G.vert(m, m.f[t + 2]);
    if (Math.max(a[0], b[0], c[0]) < p[0]) continue;
    // Proyección en el plano YZ.
    const d = (b[1] - a[1]) * (c[2] - a[2]) - (c[1] - a[1]) * (b[2] - a[2]);
    if (Math.abs(d) < 1e-14) continue;
    const u = ((p[1] - a[1]) * (c[2] - a[2]) - (c[1] - a[1]) * (p[2] - a[2])) / d;
    const v = ((b[1] - a[1]) * (p[2] - a[2]) - (p[1] - a[1]) * (b[2] - a[2])) / d;
    if (u < 0 || v < 0 || u + v > 1) continue;
    const x = a[0] + u * (b[0] - a[0]) + v * (c[0] - a[0]);
    if (x > p[0]) n++;
  }
  return n % 2 === 1;
}
