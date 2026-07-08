// ─────────────────────────────────────────────────────────────────────────────
// Modelo anatómico del polígono de Willis y su vascularización circundante.
//
// Este módulo NO usa coordenadas tomadas del SVG 2D de referencia (ese diagrama
// es una vista plana esquemática y su disposición no corresponde a una real).
// En su lugar, traduce las RELACIONES ESPACIALES de la sección 4 del brief
// (quién nace de quién, en qué dirección viaja, dónde anastomosa) a una
// disposición 3D coherente, respetando las proporciones relativas de la sección 3.
//
// Sistema de coordenadas (mano derecha):
//   +X = lateral derecho   |  -X = lateral izquierdo
//   +Y = superior          |  -Y = inferior
//   +Z = anterior (frente) |  -Z = posterior (nuca)
//
// El anillo está inclinado hacia adelante: su polo anterior (ACoA) es el punto
// más ALTO y más ANTERIOR; su polo posterior (ápex de la basilar) es el más BAJO
// y más POSTERIOR. Esa asimetría de altura/profundidad ES la inclinación real.
//
// Todas las arterias son pares (izq/der) salvo ACoA, basilar, espinal anterior y
// las perforantes centrales (línea media / grupos bilaterales fusionados). Los
// vasos pares se declaran solo del lado derecho con `pair: true` y el izquierdo
// se genera espejando la coordenada X.
// ─────────────────────────────────────────────────────────────────────────────

export type Category = 'thick' | 'medium' | 'thin';
export type GroupId = 'ring' | 'anteriorBranches' | 'centralPerforators' | 'vertebrobasilarSystem';

export type Pt = [number, number, number];

export interface Vessel {
  name: string;                // name exacto del mesh (para raycasting)
  label: string;              // nombre legible que se muestra al hacer clic
  group: GroupId;
  category: Category;          // determina el radio visual (grueso/medio/fino)
  points: Pt[];                // puntos de control de la curva (2–5)
  radius: number;              // radio visual ya calculado (mundo)
  opacity: number;             // 1 salvo perforantes (0.85)
  meta: {
    origen: string;
    destino: string;           // destino o anastomosis
    longitudRealMm: string;
    diametroRealMm: string;
  };
}

export const GROUP_ORDER: GroupId[] = [
  'ring',
  'anteriorBranches',
  'centralPerforators',
  'vertebrobasilarSystem',
];

export const GROUP_LABEL: Record<GroupId, string> = {
  ring: 'Anillo (polígono de Willis)',
  anteriorBranches: 'Ramas anteriores',
  centralPerforators: 'Perforantes centrales',
  vertebrobasilarSystem: 'Sistema vertebrobasilar',
};

// ── Radio visual por categoría ───────────────────────────────────────────────
// Exagera el grosor real (los vasos van de <0.5 mm a ~4 mm) para que se lean con
// claridad, conservando el ORDEN relativo entre categorías. El radio final se
// deriva del diámetro real con compresión, por lo que dentro de una categoría se
// mantiene también el orden fino (p. ej. ICA ~4 mm > A1 ~2.3 mm).
export const RADIUS_SCALE = 1;
function radiusFromMm(dMm: number): number {
  return (0.05 + dMm * 0.028) * RADIUS_SCALE;
}

// ── Especificación cruda (lado derecho + línea media) ─────────────────────────
// pair: true  → se genera además el homólogo izquierdo espejando X.
interface Spec {
  name: string;                // sin sufijo si es medio; con _R si es par
  label: string;              // nombre legible
  group: GroupId;
  category: Category;
  pair: boolean;
  points: Pt[];
  diametroMm: number;
  opacity?: number;
  origen: string;
  destino: string;
  longitud: string;            // texto legible (rango real)
}

// Nodos compartidos (polos del anillo y confluencias) — referenciados por varios
// vasos para que las anastomosis coincidan exactamente en el espacio.
const BIF_R: Pt = [2.6, 0.15, 1.05];       // bifurcación terminal ICA derecha (polo lateral)
const A1_ACoA_R: Pt = [0.55, 0.95, 3.3];   // unión A1–ACoA derecha
const ANT_POLE: Pt = [0, 1.05, 3.6];       // ápex ACoA (polo anterior-superior, línea media)
const P1_PCoA_R: Pt = [1.25, -0.45, -2.15];// unión PCoA–P1 derecha
const BAS_APEX: Pt = [0, -0.85, -2.95];    // ápex basilar (polo posterior-inferior, línea media)
const VB_JUNC: Pt = [0, -4.6, -2.55];      // unión vertebrobasilar (línea media)

const SPECS: Spec[] = [
  // ═══════════════ ANILLO (polígono de Willis propiamente dicho) ═══════════════
  {
    // Carótida interna terminal: no forma parte del anillo pero es el POLO LATERAL
    // del que nacen A1, MCA y las ramas anteriores; se modela su tramo terminal
    // corto para dar tronco de origen a esas ramas (dimensiones de la sección 3.1).
    name: 'ICA', label: 'Carótida interna', group: 'ring', category: 'thick', pair: true, diametroMm: 3.8,
    points: [[3.0, -1.0, 1.5], [2.75, -0.4, 1.2], BIF_R],
    origen: 'sifón carotídeo (asciende desde el cuello)',
    destino: 'bifurcación terminal → A1 + MCA',
    longitud: '~3.5–4 mm (tramo terminal)',
  },
  {
    // Camino anterior: ICA → A1 (medial, algo adelante y arriba) → ACoA.
    name: 'A1', label: 'A1 · cerebral anterior', group: 'ring', category: 'thick', pair: true, diametroMm: 2.3,
    points: [BIF_R, [1.7, 0.55, 2.1], [1.0, 0.85, 2.9], A1_ACoA_R],
    origen: 'bifurcación de la ICA',
    destino: 'anastomosis con A1 contralateral vía ACoA',
    longitud: '~13–14 mm',
  },
  {
    // ACoA: puente de línea media que une ambas A1 pasando por el polo anterior.
    name: 'ACoA', label: 'Comunicante anterior', group: 'ring', category: 'medium', pair: false, diametroMm: 1.7,
    points: [A1_ACoA_R, ANT_POLE, mirror(A1_ACoA_R)],
    origen: 'unión A1 derecha',
    destino: 'unión A1 izquierda (punto más anterior y elevado del anillo)',
    longitud: '~4 mm',
  },
  {
    // Camino posterior: ICA → PCoA (medial, hacia atrás y algo abajo) → P1.
    name: 'PCoA', label: 'Comunicante posterior', group: 'ring', category: 'medium', pair: true, diametroMm: 1.2,
    points: [BIF_R, [2.15, -0.05, -0.1], [1.75, -0.3, -1.2], P1_PCoA_R],
    origen: 'ICA distal',
    destino: 'anastomosis con P1 ipsilateral',
    longitud: '~12–14 mm',
  },
  {
    // P1: continúa medialmente desde la unión con la PCoA hasta el ápex basilar.
    name: 'P1', label: 'P1 · cerebral posterior', group: 'ring', category: 'thick', pair: true, diametroMm: 2.1,
    points: [P1_PCoA_R, [0.7, -0.65, -2.6], BAS_APEX],
    origen: 'ápex de la basilar',
    destino: 'anastomosis con PCoA y con P1 contralateral (polo posterior)',
    longitud: '~8 mm',
  },

  // ═══════════════ RAMAS ANTERIORES (nacen en/cerca de la bifurcación ICA) ═════
  {
    // MCA: nace en la bifurcación terminal de la ICA; sale lateral hacia la cisura
    // de Silvio. No pertenece al anillo → solo muñón de salida, sin anastomosis.
    name: 'MCA_stub', label: 'Cerebral media (muñón)', group: 'anteriorBranches', category: 'thick', pair: true, diametroMm: 2.5,
    points: [BIF_R, [3.4, 0.05, 1.4], [4.2, -0.05, 1.65]],
    origen: 'bifurcación terminal de la ICA',
    destino: 'cisura de Silvio (terminal, muñón)',
    longitud: 'muñón corto',
  },
  {
    // Oftálmica: nace de la ICA algo PROXIMAL a la bifurcación; viaja adelante y
    // abajo hacia la órbita. Terminal.
    name: 'Ophthalmic', label: 'Oftálmica', group: 'anteriorBranches', category: 'medium', pair: true, diametroMm: 1.2,
    points: [[2.75, -0.4, 1.2], [2.55, -1.1, 2.2], [2.3, -1.7, 3.2]],
    origen: 'ICA (proximal a la bifurcación)',
    destino: 'órbita (terminal)',
    longitud: '~10 mm (tramo intracraneal)',
  },
  {
    // Coroidal anterior: nace de la ICA distal, cerca del origen de la PCoA;
    // viaja hacia atrás y algo lateral acompañando la cintilla óptica. Terminal.
    name: 'Choroidal', label: 'Coroidal anterior', group: 'anteriorBranches', category: 'thin', pair: true, diametroMm: 0.8,
    points: [[2.5, 0.05, 0.75], [2.65, 0.2, -0.4], [2.5, 0.35, -1.6], [2.2, 0.4, -2.4]],
    origen: 'ICA distal (cerca del origen de la PCoA)',
    destino: 'plexo coroideo / cintilla óptica (terminal)',
    longitud: '~20–25 mm',
  },
  {
    // Recurrente de Heubner: nace cerca de la unión A1–ACoA; "recurre", viaja en
    // dirección OPUESTA a la A1 (hacia atrás), paralela y POR ENCIMA de ella,
    // hacia la sustancia perforada anterior. Terminal.
    name: 'Heubner', label: 'Recurrente de Heubner', group: 'anteriorBranches', category: 'thin', pair: true, diametroMm: 0.8,
    points: [A1_ACoA_R, [1.1, 1.15, 2.9], [1.7, 1.25, 2.0], [2.0, 1.2, 1.6]],
    origen: 'unión A1–ACoA (inicio de A2)',
    destino: 'sustancia perforada anterior (terminal)',
    longitud: '~23 mm (12–38 mm)',
  },

  // ═══════════════ PERFORANTES CENTRALES (grupos bilaterales, esquemáticos) ════
  // Se modelan como mini-tubos cortos que straddlean la línea media (no es preciso
  // reproducir el número real). Opacidad algo menor para diferenciarlos.
  ...perforatorGroup(
    'AnteromedialCentralArtery', 'Centrales anteromediales',
    // Nacen de la ACoA y del tramo proximal de A1; van hacia ARRIBA y ATRÁS,
    // perforando la sustancia perforada anterior.
    [[-0.5, 0.95, 3.3], [-0.15, 1.02, 3.5], [0.2, 1.02, 3.5], [0.55, 0.95, 3.3]],
    (o) => [o[0] * 1.15, o[1] + 0.7, o[2] - 0.5],
    'ACoA y A1 proximal', 'sustancia perforada anterior (terminal)',
  ),
  ...perforatorGroup(
    'PosteromedialCentralArtery', 'Centrales posteromediales (tálamo-perforantes)',
    // Tálamo-perforantes: nacen de P1 y del ápex basilar; van hacia ARRIBA y ATRÁS,
    // perforando la sustancia perforada posterior.
    [[-0.5, -0.7, -2.7], [-0.15, -0.82, -2.9], [0.2, -0.82, -2.9], [0.55, -0.7, -2.7]],
    (o) => [o[0] * 1.15, o[1] + 0.7, o[2] - 0.45],
    'P1 y ápex de la basilar', 'sustancia perforada posterior (terminal)',
  ),
  ...perforatorGroup(
    'PontineArtery', 'Pónticas',
    // Pónticas: nacen a lo largo del tronco basilar en varios puntos; van hacia
    // atrás, perforando la protuberancia.
    [[0.12, -1.6, -2.75], [-0.12, -2.3, -2.72], [0.12, -3.0, -2.7], [-0.12, -3.7, -2.65]],
    (o) => [o[0] + (o[0] >= 0 ? 0.45 : -0.45), o[1] - 0.1, o[2] - 0.7],
    'tronco de la basilar (varios puntos)', 'protuberancia (terminal)',
  ),

  // ═══════════════ SISTEMA VERTEBROBASILAR (caudal → craneal) ══════════════════
  {
    // Vertebral: entra por el agujero magno, asciende medialmente. Solo tramo
    // intracraneal. Las dos se fusionan en la unión vertebrobasilar.
    name: 'Vertebral', label: 'Vertebral', group: 'vertebrobasilarSystem', category: 'thick', pair: true, diametroMm: 3.1,
    points: [[1.3, -6.6, -2.1], [0.9, -5.8, -2.25], [0.4, -5.0, -2.4], VB_JUNC],
    origen: 'agujero magno (tramo intracraneal)',
    destino: 'unión vertebrobasilar (anastomosis con la contralateral)',
    longitud: '~20–30 mm (intracraneal)',
  },
  {
    // Espinal anterior: nace de ramas mediales de ambas vertebrales, se anastomosan
    // en la línea media por debajo de la unión VB y descienden juntas por la cara
    // anterior del bulbo/médula. Se modela el tramo descendente medial.
    name: 'AnteriorSpinal', label: 'Espinal anterior', group: 'vertebrobasilarSystem', category: 'thin', pair: false, diametroMm: 0.6,
    points: [[0, -4.9, -2.35], [0, -5.6, -2.25], [0, -6.6, -2.1]],
    origen: 'ramas mediales de ambas vertebrales (anastomosadas)',
    destino: 'cara anterior del bulbo/médula (tramo inicial)',
    longitud: 'tramo inicial',
  },
  {
    // PICA: nace del tramo distal de la vertebral, justo antes de la unión VB;
    // corre posterolateral rodeando el bulbo (trayecto tortuoso → punto de control
    // extra) hacia la cara inferior del cerebelo. La más larga y tortuosa.
    name: 'PICA', label: 'PICA · cerebelosa posteroinferior', group: 'vertebrobasilarSystem', category: 'medium', pair: true, diametroMm: 1.5,
    points: [[0.55, -4.95, -2.45], [1.4, -4.6, -2.9], [1.15, -4.15, -3.6], [2.0, -3.9, -3.8], [2.7, -4.1, -4.2]],
    origen: 'vertebral distal (antes de la unión VB)',
    destino: 'cara inferior del cerebelo (terminal)',
    longitud: 'la más larga y tortuosa de las cerebelosas',
  },
  {
    // Basilar: tronco de línea media formado por la fusión de las vertebrales;
    // asciende (leve arqueo anterior) hasta el ápex, donde se bifurca en las P1.
    name: 'Basilar', label: 'Basilar', group: 'vertebrobasilarSystem', category: 'thick', pair: false, diametroMm: 3.5,
    points: [VB_JUNC, [0.1, -3.6, -2.5], [0, -2.4, -2.6], [0.05, -1.5, -2.75], BAS_APEX],
    origen: 'unión vertebrobasilar',
    destino: 'bifurcación terminal en ambas P1 (ápex = polo posterior del anillo)',
    longitud: '~25–31 mm',
  },
  {
    // AICA: nace del tercio medio/inferior del tronco basilar; corre lateral hacia
    // el ángulo pontocerebeloso.
    name: 'AICA', label: 'AICA · cerebelosa anteroinferior', group: 'vertebrobasilarSystem', category: 'medium', pair: true, diametroMm: 1.0,
    points: [[0.1, -3.0, -2.68], [1.1, -2.95, -3.1], [2.1, -2.9, -3.6]],
    origen: 'tercio medio/inferior del tronco basilar',
    destino: 'ángulo pontocerebeloso (terminal)',
    longitud: '—',
  },
  {
    // Laberíntica: rama de la AICA (a veces directa de la basilar); corre lateral
    // hacia el meato auditivo interno. La más pequeña y distal del grupo.
    name: 'Labyrinthine', label: 'Laberíntica', group: 'vertebrobasilarSystem', category: 'thin', pair: true, diametroMm: 0.45,
    points: [[1.5, -2.93, -3.3], [1.9, -2.9, -3.45], [2.25, -2.88, -3.55]],
    origen: 'AICA (rama distal)',
    destino: 'meato auditivo interno (terminal)',
    longitud: 'muy corta',
  },
  {
    // SCA: nace del tronco basilar justo antes de la bifurcación terminal
    // (inmediatamente por debajo del origen de las P1); corre lateral y hacia atrás
    // rodeando el mesencéfalo, hacia la cara superior del cerebelo.
    name: 'SCA', label: 'SCA · cerebelosa superior', group: 'vertebrobasilarSystem', category: 'medium', pair: true, diametroMm: 1.3,
    points: [[0.1, -1.15, -2.85], [1.1, -1.05, -3.2], [2.1, -1.0, -3.8], [2.6, -1.05, -4.1]],
    origen: 'tronco basilar (justo bajo el origen de las P1)',
    destino: 'cara superior del cerebelo (terminal)',
    longitud: '—',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function mirror(p: Pt): Pt {
  return [-p[0], p[1], p[2]];
}

// Construye un grupo de perforantes: N mini-tubos cortos desde `origins` hacia el
// destino calculado por `tip`. Bilateral por diseño (los orígenes straddlean X=0),
// por eso el grupo es de línea media (no se espeja).
function perforatorGroup(
  memberName: string,
  label: string,
  origins: Pt[],
  tip: (o: Pt) => Pt,
  origen: string,
  destino: string,
): Spec[] {
  return origins.map((o, i) => ({
    name: `${memberName}_${i + 1}`,
    label,
    group: 'centralPerforators' as GroupId,
    category: 'thin' as Category,
    pair: false,
    points: [o, mid(o, tip(o)), tip(o)],
    diametroMm: 0.4,
    opacity: 0.85,
    origen,
    destino,
    longitud: '<0.5 mm de calibre (esquemático)',
  }));
}

function mid(a: Pt, b: Pt): Pt {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

// Convierte una Spec en uno o dos Vessel resueltos (derecho + izquierdo espejado).
function resolve(spec: Spec): Vessel[] {
  const base: Vessel = {
    name: spec.pair ? `${spec.name}_R` : spec.name,
    label: spec.pair ? `${spec.label} (der.)` : spec.label,
    group: spec.group,
    category: spec.category,
    points: spec.points,
    radius: radiusFromMm(spec.diametroMm),
    opacity: spec.opacity ?? 1,
    meta: {
      origen: spec.origen,
      destino: spec.destino,
      longitudRealMm: spec.longitud,
      diametroRealMm: `~${spec.diametroMm} mm`,
    },
  };
  if (!spec.pair) return [base];
  const left: Vessel = {
    ...base,
    name: `${spec.name}_L`,
    label: `${spec.label} (izq.)`,
    points: spec.points.map(mirror),
    meta: {
      ...base.meta,
      origen: base.meta.origen.replace('derecha', 'izquierda'),
      destino: base.meta.destino.replace('contralateral', 'contralateral'),
    },
  };
  return [base, left];
}

// Lista final de vasos (con izquierdos expandidos), ordenada por grupo.
export const VESSELS: Vessel[] = SPECS.flatMap(resolve);

// Metadatos por vaso, listos para el etiquetado futuro (fase siguiente). No se
// consume todavía en la escena; se exporta para tenerlo disponible.
export const vesselsData = VESSELS.map((v) => ({
  name: v.name,
  label: v.label,
  grupo: GROUP_LABEL[v.group],
  origen: v.meta.origen,
  destino: v.meta.destino,
  longitudRealMm: v.meta.longitudRealMm,
  diametroRealMm: v.meta.diametroRealMm,
}));

// Color arterial compartido.
export const ARTERY_COLOR = '#c22222';
