// Forma del tronco del encéfalo y del cerebelo como suma de primitivas suaves.
//
// Medidas en cm, de las proporciones habituales del atlas (Gray 1918, fig. 701,
// 709 y 710; Netter): bulbo ≈ 3 cm de alto y 1,2-2 cm de ancho, protuberancia
// ≈ 2,5 cm de alto y 3,3 de ancho, mesencéfalo ≈ 2 cm de alto. El eje se dibuja
// vertical (como en las láminas), con y = 0 en el surco bulboprotuberancial.
//
// Lo que en el cadáver se corta para ver la cara posterior se corta aquí igual:
// los tres pedúnculos cerebelosos terminan en una cara plana (su sección), el
// diencéfalo se corta por arriba y la médula por abajo. El cerebelo es otra
// pieza que encaja sobre esos cortes: se puede retirar sin dejar huecos.

import { par, crearCampo, type Primitiva, type Campo } from './sdf.ts';

/** Altura del corte superior (diencéfalo) e inferior (médula cervical, C1). */
export const Y_CORTE_SUP = 4.85;
export const Y_CORTE_INF = -4.4;

/** Óbex, ángulo lateral y vértice superior de la fosa romboidea. */
export const FOSA = { arriba: 2.75, lateral: 0.35, abajo: -1.3, ancho: 0.95, suelo: -0.5 };

export function primitivasTronco(): Primitiva[] {
  const P: Primitiva[] = [];

  // ── Columna central (tegmento) de la médula al mesencéfalo ──
  P.push({
    id: 'tegmento', tipo: 'barrido',
    tabla: [
      [Y_CORTE_INF - 0.3, 0.0, 0.55, 0.42],
      [-3.0, 0.0, 0.55, 0.44],
      [-2.0, -0.02, 0.6, 0.47],
      [-1.0, -0.06, 0.72, 0.52],
      [0.0, -0.12, 0.9, 0.56],
      [1.0, -0.15, 0.98, 0.58],
      [2.0, -0.18, 0.9, 0.58],
      [2.7, -0.22, 0.78, 0.6],
      [3.4, -0.25, 0.8, 0.66],
      [4.3, -0.25, 0.86, 0.7],
      [Y_CORTE_SUP + 0.4, -0.25, 0.9, 0.72],
    ],
  });

  // ── Bulbo, cara anterior ──
  P.push(...par<Primitiva>({
    id: 'piramide', tipo: 'tubo', k: 0.07,
    pts: [[0.19, -2.55, 0.4], [0.21, -1.6, 0.5], [0.24, -0.15, 0.52]],
    r: [0.13, 0.19, 0.21],
  }));
  // Decusación de las pirámides: haces que cruzan la fisura en la parte baja.
  for (const [y0, s] of [[-2.35, 1], [-2.55, -1], [-2.75, 1], [-2.95, -1]] as const) {
    P.push({ id: 'decusacion_piramidal', tipo: 'tubo', k: 0.1, pts: [[0.2 * s, y0, 0.38], [-0.18 * s, y0 - 0.28, 0.38]], r: [0.045, 0.04] });
  }
  P.push(...par<Primitiva>({ id: 'oliva', tipo: 'elipsoide', k: 0.09, c: [0.52, -0.95, 0.3], r: [0.2, 0.62, 0.25], giro: [0, 0, 0.08] }));
  // Fisura media anterior (se interrumpe en la decusación) y surco medio posterior.
  P.push({ id: '', op: 'restar', tipo: 'caja', k: 0.03, c: [0, -1.1, 0.75], h: [0.028, 1.2, 0.4] });
  P.push({ id: '', op: 'restar', tipo: 'caja', k: 0.03, c: [0, -4.0, 0.62], h: [0.03, 1.0, 0.3] });
  P.push({ id: '', op: 'restar', tipo: 'caja', k: 0.02, c: [0, -3.0, -0.55], h: [0.022, 1.75, 0.2] });

  // ── Bulbo, cara posterior (porción cerrada) ──
  P.push(...par<Primitiva>({ id: 'fasciculo_gracil', tipo: 'tubo', k: 0.1, pts: [[0.12, Y_CORTE_INF - 0.3, -0.33], [0.13, -2.0, -0.4]], r: [0.11, 0.12] }));
  P.push(...par<Primitiva>({ id: 'tuberculo_gracil', tipo: 'elipsoide', k: 0.08, c: [0.13, -1.62, -0.44], r: [0.13, 0.34, 0.12] }));
  P.push(...par<Primitiva>({ id: 'fasciculo_cuneiforme', tipo: 'tubo', k: 0.1, pts: [[0.33, Y_CORTE_INF - 0.3, -0.27], [0.36, -1.9, -0.36]], r: [0.12, 0.13] }));
  P.push(...par<Primitiva>({ id: 'tuberculo_cuneiforme', tipo: 'elipsoide', k: 0.08, c: [0.38, -1.45, -0.42], r: [0.16, 0.36, 0.13] }));
  P.push(...par<Primitiva>({ id: 'tuberculo_trigeminal', tipo: 'elipsoide', k: 0.07, c: [0.58, -1.4, -0.18], r: [0.13, 0.45, 0.13] }));

  // ── Pedúnculos cerebelosos (terminan en su cara de corte) ──
  P.push(...par<Primitiva>({
    id: 'pci', tipo: 'tubo', k: 0.12, cortado: true, idCorte: 'corte_pci',
    pts: [[0.5, -1.25, -0.28], [0.75, -0.4, -0.45], [0.93, 0.3, -0.66], [1.02, 0.66, -0.84]],
    r: [0.17, 0.23, 0.25, 0.26],
  }));

  // ── Protuberancia ──
  P.push({ id: 'puente', tipo: 'elipsoide', k: 0.12, c: [0, 1.22, 0.3], r: [1.62, 1.22, 0.78] });
  P.push(...par<Primitiva>({
    id: 'pcm', tipo: 'tubo', k: 0.18, cortado: true, idCorte: 'corte_pcm',
    pts: [[1.15, 1.25, 0.35], [1.48, 1.1, -0.28], [1.6, 1.0, -0.7]],
    r: [0.62, 0.6, 0.57],
    aplanar: { eje: [1, 0, 0.3], f: 0.8 },
  }));
  // Surco basilar, donde se apoya la arteria basilar.
  P.push({ id: '', op: 'restar', tipo: 'tubo', k: 0.12, pts: [[0, 0.05, 1.18], [0, 1.25, 1.24], [0, 2.45, 1.12]], r: [0.1, 0.13, 0.1] });

  P.push(...par<Primitiva>({
    id: 'pcs', tipo: 'tubo', k: 0.14, cortado: true, idCorte: 'corte_pcs',
    pts: [[0.3, 2.9, -0.64], [0.55, 2.35, -0.72], [0.7, 2.0, -0.78]],
    r: [0.15, 0.2, 0.22],
    aplanar: { eje: [-0.5, 0, -1], f: 0.7 },
  }));

  // ── Mesencéfalo ──
  P.push(...par<Primitiva>({
    id: 'pedunculo_cerebral', tipo: 'tubo', k: 0.2,
    pts: [[0.36, 2.35, 0.5], [0.56, 3.3, 0.56], [0.86, 4.3, 0.5], [1.0, Y_CORTE_SUP + 0.3, 0.46]],
    r: [0.36, 0.42, 0.48, 0.5],
    aplanar: { eje: [0.3, 0, 1], f: 0.55 },
  }));
  P.push(...par<Primitiva>({ id: 'coliculo_superior', tipo: 'elipsoide', k: 0.12, c: [0.3, 3.86, -0.84], r: [0.3, 0.27, 0.17] }));
  P.push(...par<Primitiva>({ id: 'coliculo_inferior', tipo: 'elipsoide', k: 0.12, c: [0.28, 3.22, -0.82], r: [0.25, 0.22, 0.16] }));
  P.push(...par<Primitiva>({ id: 'brazo_ci', tipo: 'tubo', k: 0.14, pts: [[0.45, 3.3, -0.7], [0.72, 3.66, -0.64], [0.9, 3.98, -0.5]], r: [0.07, 0.065, 0.06] }));
  P.push(...par<Primitiva>({ id: 'brazo_cs', tipo: 'tubo', k: 0.14, pts: [[0.52, 3.98, -0.72], [0.9, 4.2, -0.5], [1.1, 4.36, -0.2]], r: [0.065, 0.06, 0.06] }));

  // ── Diencéfalo (cortado por arriba) ──
  P.push(...par<Primitiva>({ id: 'talamo', tipo: 'elipsoide', k: 0.15, c: [0.68, 4.95, -0.45], r: [0.72, 0.62, 0.95] }));
  P.push(...par<Primitiva>({ id: 'pulvinar', tipo: 'elipsoide', k: 0.14, c: [0.74, 4.6, -1.0], r: [0.55, 0.4, 0.45] }));
  P.push(...par<Primitiva>({ id: 'cgl', tipo: 'elipsoide', k: 0.08, c: [1.2, 4.4, -0.18], r: [0.18, 0.13, 0.2] }));
  P.push(...par<Primitiva>({ id: 'cgm', tipo: 'elipsoide', k: 0.08, c: [0.98, 4.1, -0.56], r: [0.14, 0.11, 0.14] }));
  P.push(...par<Primitiva>({
    id: 'cintilla_optica', tipo: 'tubo', k: 0.06,
    pts: [[0.5, Y_CORTE_SUP + 0.2, 1.05], [0.95, 4.62, 0.86], [1.28, 4.46, 0.32], [1.2, 4.42, -0.15]],
    r: [0.13, 0.13, 0.12, 0.12],
    aplanar: { eje: [0, 1, 0], f: 0.6 },
  }));
  P.push(...par<Primitiva>({ id: 'mamilar', tipo: 'elipsoide', k: 0.05, c: [0.16, 4.52, 0.74], r: [0.15, 0.14, 0.16] }));
  P.push({ id: 'pineal', tipo: 'elipsoide', k: 0.05, c: [0, 4.3, -1.25], r: [0.17, 0.13, 0.27], giro: [-0.3, 0, 0] });
  // Tercer ventrículo: la hendidura entre los dos tálamos.
  P.push({ id: '', op: 'restar', tipo: 'caja', k: 0.03, c: [0, 5.0, -0.25], h: [0.06, 0.5, 0.95] });

  // ── IV ventrículo: fosa romboidea y su suelo ──
  P.push({ id: 'fosa_romboidea', op: 'restar', tipo: 'rombo', k: 0.08, yArriba: FOSA.arriba, yAbajo: FOSA.abajo, yLateral: FOSA.lateral, ancho: FOSA.ancho, zSuelo: FOSA.suelo });
  P.push(...par<Primitiva>({
    id: 'eminencia_medial', tipo: 'tubo', k: 0.05,
    pts: [[0.12, -0.95, -0.48], [0.15, 0.2, -0.5], [0.16, 1.5, -0.5], [0.14, 2.5, -0.5]],
    r: [0.06, 0.09, 0.09, 0.07],
    aplanar: { eje: [0, 0, 1], f: 0.45 },
  }));
  P.push(...par<Primitiva>({ id: 'coliculo_facial', tipo: 'elipsoide', k: 0.04, c: [0.2, 1.1, -0.52], r: [0.14, 0.22, 0.08] }));
  P.push(...par<Primitiva>({ id: 'area_vestibular', tipo: 'elipsoide', k: 0.12, c: [0.64, 0.4, -0.52], r: [0.26, 0.5, 0.05] }));
  for (const dy of [0, 0.11]) {
    P.push(...par<Primitiva>({ id: 'estrias_medulares', tipo: 'tubo', k: 0.02, pts: [[0.07, 0.24 + dy, -0.5], [0.5, 0.3 + dy, -0.53], [0.92, 0.38 + dy, -0.62]], r: [0.022, 0.024, 0.02] }));
  }
  // Surco medio del suelo.
  P.push({ id: '', op: 'restar', tipo: 'caja', k: 0.02, c: [0, 0.75, -0.55], h: [0.018, 1.95, 0.06] });

  // ── Acueducto (de la fosa al III ventrículo) ──
  P.push({ id: 'acueducto', op: 'restar', tipo: 'tubo', k: 0.02, pts: [[0, 2.7, -0.5], [0, 3.3, -0.55], [0, 4.0, -0.52], [0, Y_CORTE_SUP + 0.2, -0.4]], r: [0.06, 0.06, 0.07, 0.07] });

  // ── Cortes: arriba (diencéfalo) y abajo (médula) ──
  P.push({ id: 'corte_superior', op: 'recortar', tipo: 'plano', n: [0, 1, 0], p: [0, Y_CORTE_SUP, 0] });
  P.push({ id: 'corte_inferior', op: 'recortar', tipo: 'plano', n: [0, -1, 0], p: [0, Y_CORTE_INF, 0] });

  return P;
}

export function campoTronco(): Campo {
  return crearCampo(primitivasTronco());
}

/**
 * Nombre fino de la zona: la columna central se reparte entre bulbo, puente y
 * mesencéfalo, y la fosa romboidea en sus campos (Gray, fig. 710).
 */
export function refinarTronco(id: string, x: number, y: number, z: number): string {
  const ax = Math.abs(x);
  // Fondo y bordes mediales de la fosa interpeduncular.
  if ((id === 'tegmento' || id === 'pedunculo_cerebral') && y > 2.55 && y < 4.45 && z > 0.12 && ax < 0.3) return 'fosa_interpeduncular';
  if (id === 'tegmento') {
    if (y < Y_CORTE_INF + 0.9) return 'medula';
    if (y < 0) return 'bulbo';
    if (y < 2.55) return z > 0 ? 'puente' : 'tegmento_pontino';
    return 'mesencefalo';
  }
  // Cara anterior de la parte baja del bulbo: los haces que cruzan la fisura.
  if ((id === 'piramide' || id === 'tegmento' || id === 'decusacion_piramidal') && y < -2.3 && y > -3.1 && ax < 0.32 && z > 0.25) return 'decusacion_piramidal';
  if (id === 'fasciculo_gracil' && y < Y_CORTE_INF + 0.9) return 'medula';
  if (id === 'fasciculo_cuneiforme' && y < Y_CORTE_INF + 0.9) return 'medula';
  if (id === 'fosa_romboidea' || id === 'eminencia_medial') {
    if (y < FOSA.abajo + 0.35 && ax < 0.16) return 'area_postrema';
    if (y < 0.2) {
      if (ax < 0.22) return 'trigono_hipogloso';
      if (ax < 0.42) return 'trigono_vago';
      return 'area_vestibular';
    }
    if (y > 1.85 && ax > 0.22 && ax < 0.55) return 'locus_coeruleus';
    if (ax < 0.3) return 'eminencia_medial';
    if (y < 0.95) return 'area_vestibular';
    return 'fosa_romboidea';
  }
  return id;
}

// ── Cerebelo ─────────────────────────────────────────────────────────────────

export function primitivasCerebelo(): Primitiva[] {
  const P: Primitiva[] = [];
  // Hemisferios: ≈ 5 cm de ancho cada uno, más anchos que altos, con la cara
  // superior aplanada bajo la tienda y la inferior abombada.
  P.push(...par<Primitiva>({ id: 'hemisferio_cerebeloso', tipo: 'elipsoide', k: 0.7, c: [2.15, 0.5, -2.5], r: [2.5, 1.8, 2.2], giro: [0.12, 0.3, 0.05] }));
  P.push({ id: 'vermis', tipo: 'elipsoide', k: 0.5, c: [0, 0.75, -2.45], r: [0.9, 1.85, 1.95] });
  P.push(...par<Primitiva>({ id: 'amigdala_cerebelosa', tipo: 'elipsoide', k: 0.25, c: [0.55, -1.0, -1.65], r: [0.42, 0.6, 0.55] }));
  P.push(...par<Primitiva>({ id: 'floculo', tipo: 'elipsoide', k: 0.15, c: [1.78, 0.3, -0.72], r: [0.3, 0.22, 0.3] }));
  // Los pedúnculos siguen dentro del cerebelo desde sus cortes.
  P.push(...par<Primitiva>({ id: 'pcm', tipo: 'tubo', k: 0.3, pts: [[1.6, 1.0, -0.7], [2.0, 0.9, -1.6]], r: [0.56, 0.5] }));
  P.push(...par<Primitiva>({ id: 'pci', tipo: 'tubo', k: 0.2, pts: [[1.02, 0.66, -0.84], [1.35, 0.9, -1.6]], r: [0.26, 0.25] }));
  P.push(...par<Primitiva>({ id: 'pcs', tipo: 'tubo', k: 0.2, pts: [[0.7, 2.0, -0.78], [1.0, 1.4, -1.5]], r: [0.22, 0.2] }));
  // Techo del IV ventrículo: el cerebelo deja libre el hueco delante de él.
  P.push({ id: '', op: 'restar', tipo: 'elipsoide', k: 0.25, c: [0, 0.6, -0.5], r: [0.95, 1.85, 0.6] });
  P.push({ id: '', op: 'restar', tipo: 'barrido', k: 0.3, tabla: [[-5, 0.1, 0.75, 0.62], [-1, 0.0, 0.85, 0.62], [0.5, 0.25, 1.6, 0.95], [2.6, 0.2, 1.4, 0.9], [4, 0.0, 1.0, 0.9]] });
  // Escotadura cerebelosa posterior (donde entra la hoz del cerebelo).
  P.push({ id: '', op: 'restar', tipo: 'elipsoide', k: 0.35, c: [0, 0.2, -4.85], r: [0.55, 1.4, 0.7] });
  // Cara superior aplanada bajo la tienda del cerebelo, en tejado.
  P.push({ id: '', op: 'recortar', tipo: 'plano', k: 0.5, n: [0.22, 1, 0.12], p: [0, 2.3, 0] });
  P.push({ id: '', op: 'recortar', tipo: 'plano', k: 0.5, n: [-0.22, 1, 0.12], p: [0, 2.3, 0] });
  return P;
}

export function campoCerebelo(): Campo {
  return crearCampo(primitivasCerebelo(), 0.2);
}

/** Centro de las folias: arcos concéntricos alrededor de este eje transversal. */
export const CENTRO_FOLIAS: [number, number] = [0.75, -1.5]; // (y, z), eje transversal por el techo del IV ventrículo
