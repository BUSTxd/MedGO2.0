'use client';
// Escena 3D del polígono de Willis (React Three Fiber). Misma arquitectura que
// la de Médula Espinal 3D: la geometría vive en engine/, aquí solo se pinta y
// se interactúa, y un CameraRig encuadra el modelo según el lienzo.
//
// Cada arteria par es dos piezas (izquierda y derecha) y las de línea media una;
// el color de cada pieza depende de la vista (Arterias, Territorios, Variantes,
// Clínico) y de lo elegido o señalado. Con «Posición real» el tronco, el
// cerebelo y el sistema vertebrobasilar se doblan (engine/doblez.ts) y aparecen
// los vasos del cuello.

import { useEffect, useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent, type ThreeElements } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  ARTERIAS, TERRITORIOS, enSistema,
  type ArteriaId, type SistemaId, type TerritorioId, type ReferenciaId,
} from './engine/anatomia';
import {
  PIEZAS, EXTRAS,
  CENTRO, SEMI_ALTO, SEMI_ANCHO, CENTRO_ENCEFALO, SEMI_ALTO_ENCEFALO, SEMI_ANCHO_ENCEFALO,
  CENTRO_REAL, SEMI_ALTO_REAL, SEMI_ANCHO_REAL, CENTRO_REAL_ENCEFALO, SEMI_ALTO_REAL_ENCEFALO, SEMI_ANCHO_REAL_ENCEFALO,
  geometriaTramos, geometriaTronco, geometriaOptico, geometriaHipofisis, geometriaOculomotor, anclaEtiqueta,
  geometriaCerebro, geometriaCerebelo, geometriaMedula, soloCuello,
  type Pieza, type Pt,
} from './engine/geometria';
import { DOBLEZ, aplicarDoblez, deformar, type ModoDoblez } from './engine/doblez';
import { efectoVariante, afectada, type Variante, type Sindrome, type Lado } from './engine/clinica';
import type { Elegido, ModoWillis, Postura } from './WillisSimulator';

export interface SceneProps {
  mode: ModoWillis;
  sistema: SistemaId;
  elegido: Elegido;
  senalado: Elegido;
  territorio: TerritorioId | null;
  variante: Variante | null;
  sindrome: Sindrome | null;
  refs: Record<ReferenciaId, boolean>;
  etiquetas: boolean;
  reinicio: number;
  /** Qué encuadra la cámara al restablecer: el polígono o el encéfalo entero. */
  encuadre: 'poligono' | 'encefalo';
  /** Vista de atlas (tronco tumbado) o posición real (tronco vertical, cuello). */
  postura: Postura;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  onDeseleccionar: () => void;
}

const ROJO = '#b3352e';
const AMBAR = '#f2b631';
const VIOLETA = '#7c5cd6';
const APAGADO = '#c7a5a0';
const DURACION_DOBLEZ = 1.6; // s

const labelStyle: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(26, 26, 46, 0.78)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
};

const elegidoStyle: CSSProperties = {
  ...labelStyle,
  fontSize: '12px',
  padding: '4px 11px',
  background: 'rgba(20, 24, 44, 0.92)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
};

const loboStyle: CSSProperties = {
  ...labelStyle,
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: 'rgba(120, 72, 64, 0.72)',
};

const prefiereQuieto = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ── Doblez: animación y deformación de las mallas ────────────────────────────

/** Avanza DOBLEZ hacia el objetivo (suavizado de entrada y salida). */
function AnimadorDoblez({ postura }: { postura: Postura }) {
  const quieto = useMemo(prefiereQuieto, []);
  useEffect(() => {
    DOBLEZ.objetivo = postura === 'real' ? 1 : 0;
    if (quieto) { DOBLEZ.avance = DOBLEZ.objetivo; DOBLEZ.actual = DOBLEZ.objetivo; }
  }, [postura, quieto]);
  // Al salir del lab, el modelo vuelve a la vista de atlas.
  useEffect(() => () => { DOBLEZ.actual = 0; DOBLEZ.avance = 0; DOBLEZ.objetivo = 0; }, []);
  useFrame((_, dt) => {
    const paso = Math.min(dt, 0.05) / DURACION_DOBLEZ;
    if (DOBLEZ.avance < DOBLEZ.objetivo) DOBLEZ.avance = Math.min(DOBLEZ.objetivo, DOBLEZ.avance + paso);
    else if (DOBLEZ.avance > DOBLEZ.objetivo) DOBLEZ.avance = Math.max(DOBLEZ.objetivo, DOBLEZ.avance - paso);
    const u = DOBLEZ.avance;
    DOBLEZ.actual = u * u * (3 - 2 * u);
  });
  return null;
}

/**
 * Guarda las posiciones de atlas de una geometría y, en cada fotograma en que
 * cambie el doblez, la lleva a su estado actual.
 */
function useDoblez(geo: THREE.BufferGeometry, modo: ModoDoblez) {
  const orig = useMemo(() => ({
    p: Float32Array.from((geo.attributes.position as THREE.BufferAttribute).array as Float32Array),
    n: geo.attributes.normal ? Float32Array.from((geo.attributes.normal as THREE.BufferAttribute).array as Float32Array) : null,
  }), [geo]);
  const aplicado = useRef(-1);
  useEffect(() => { aplicado.current = -1; }, [geo]);
  useFrame(() => {
    if (modo === 'fijo') return;
    const t = DOBLEZ.actual;
    if (Math.abs(t - aplicado.current) < 1e-5) return;
    aplicarDoblez(geo, orig, t, modo);
    aplicado.current = t;
    // Al terminar, el volumen de choque se recalcula para que el clic acierte.
    if (t === DOBLEZ.objetivo) { geo.computeBoundingSphere(); geo.computeBoundingBox(); }
  });
}

// ── Cámara ───────────────────────────────────────────────────────────────────

/**
 * Qué es «arriba» en la pantalla: en la vista de atlas, lo anterior (+y),
 * como en las láminas basales; en la posición real, lo superior (−z). Se fija
 * durante el render, antes de que OrbitControls se cree con ese eje.
 */
function Ejes({ postura }: { postura: Postura }) {
  const camera = useThree((s) => s.camera);
  if (postura === 'real') camera.up.set(0, 0, -1); else camera.up.set(0, 1, 0);
  return null;
}

// Reencuadra cámara y diana al montar, con «Restablecer vista», «Ver el
// encéfalo entero» y al cambiar de postura. La vista de atlas es la basal con
// una leve inclinación; la real, anterolateral izquierda, algo desde abajo.
function CameraRig({ reinicio, encuadre, postura }: { reinicio: number; encuadre: 'poligono' | 'encefalo'; postura: Postura }) {
  const { camera, controls, size } = useThree();
  const aspecto = size.width / Math.max(size.height, 1);
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const t = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const todo = encuadre === 'encefalo';
    const real = postura === 'real';
    const [alto, ancho, c]: [number, number, Pt] = real
      ? (todo ? [SEMI_ALTO_REAL_ENCEFALO, SEMI_ANCHO_REAL_ENCEFALO, CENTRO_REAL_ENCEFALO] : [SEMI_ALTO_REAL, SEMI_ANCHO_REAL, CENTRO_REAL])
      : (todo ? [SEMI_ALTO_ENCEFALO, SEMI_ANCHO_ENCEFALO, CENTRO_ENCEFALO] : [SEMI_ALTO, SEMI_ANCHO, CENTRO]);
    const dist = Math.max(alto / t, ancho / (t * aspecto)) * 1.02;
    const dir = real ? new THREE.Vector3(0.9, 0.36, 0.26).normalize() : new THREE.Vector3(0.1, -0.24, 1).normalize();
    cam.position.set(c[0] + dir.x * dist, c[1] + dir.y * dist, c[2] + dir.z * dist);
    cam.updateProjectionMatrix();
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (oc) {
      oc.target.set(...c);
      oc.update();
    } else {
      cam.lookAt(...c);
    }
  }, [reinicio, encuadre, postura, camera, controls, aspecto]);
  return null;
}

// ── Arterias ─────────────────────────────────────────────────────────────────

/** Color y brillo de una pieza según la vista y lo elegido. */
function aspectoPieza(p: Pieza, props: SceneProps) {
  const a = ARTERIAS[p.arteria];
  const { mode, sistema, elegido, senalado, territorio, variante, sindrome } = props;
  const efecto = mode === 'variantes' ? efectoVariante(variante, p.arteria, p.lado) : { escala: 1, oculta: false, cambia: false };
  const fantasma = !enSistema(a, sistema);
  const esElegida = elegido?.kind === 'arteria' && elegido.id === p.arteria;
  const esSenalada = senalado?.kind === 'arteria' && senalado.id === p.arteria;

  let color = ROJO;
  let brillo = 0;
  let tono = '#ff4d2e';
  if (mode === 'territorios') {
    const terr = TERRITORIOS[a.territorio];
    color = territorio && territorio !== a.territorio ? '#b9b3c4' : terr.color;
    tono = terr.color;
    if (territorio === a.territorio) brillo = 0.22;
  } else if (mode === 'variantes') {
    if (efecto.cambia) { color = AMBAR; tono = AMBAR; brillo = 0.35; }
  } else if (mode === 'clinico' && sindrome) {
    if (afectada(sindrome, p.arteria, p.lado)) { color = VIOLETA; tono = VIOLETA; brillo = 0.4; } else color = APAGADO;
  }
  if (esElegida) { brillo = Math.max(brillo, 0.55); if (mode === 'arterias') color = '#e04a35'; }
  else if (esSenalada) brillo = Math.max(brillo, 0.28);
  return { color, tono, brillo, fantasma, oculta: efecto.oculta, escala: efecto.escala };
}

function PiezaArteria({ pieza, props }: { pieza: Pieza; props: SceneProps }) {
  const asp = aspectoPieza(pieza, props);
  const geo = useMemo(() => geometriaTramos(pieza.tramos, asp.escala), [pieza, asp.escala]);
  useEffect(() => () => geo.dispose(), [geo]);
  useDoblez(geo, pieza.modo);
  if (asp.oculta || (pieza.cuello && props.postura !== 'real')) return null;

  const yo: Elegido = { kind: 'arteria', id: pieza.arteria, lado: pieza.lado };
  const eventos = asp.fantasma ? {} : {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      props.onSenalar(yo);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      props.onSenalar(null);
      document.body.style.cursor = 'auto';
    },
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      props.onElegir(yo);
    },
  };

  return (
    <mesh geometry={geo} userData={{ arteria: true }} {...eventos}>
      <meshPhysicalMaterial
        key={asp.fantasma ? 'fantasma' : 'solido'}
        color={asp.color}
        emissive={asp.tono}
        emissiveIntensity={asp.brillo}
        roughness={0.36}
        metalness={0}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
        transparent={asp.fantasma}
        opacity={asp.fantasma ? 0.12 : 1}
        depthWrite={!asp.fantasma}
      />
    </mesh>
  );
}

/** Vaso que solo existe en una variante (trigeminal persistente, Percheron). */
function Extra({ variante }: { variante: Variante }) {
  const geo = useMemo(() => geometriaTramos(EXTRAS[variante.extra!].tramos), [variante]);
  useEffect(() => () => geo.dispose(), [geo]);
  useDoblez(geo, 'tronco');
  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial color={AMBAR} emissive={AMBAR} emissiveIntensity={0.35} roughness={0.36} clearcoat={0.6} clearcoatRoughness={0.3} />
    </mesh>
  );
}

/** Saco aneurismático con un halo que late. */
function Saco({ centro, radio }: { centro: [number, number, number]; radio: number }) {
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const quieto = useMemo(prefiereQuieto, []);
  useFrame(({ clock }) => {
    if (halo.current) halo.current.opacity = quieto ? 0.22 : 0.12 + 0.16 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.6));
  });
  return (
    <group position={centro}>
      <mesh>
        <sphereGeometry args={[radio, 28, 20]} />
        <meshPhysicalMaterial color="#d8453a" emissive="#ff3b2a" emissiveIntensity={0.25} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
      <mesh renderOrder={2}>
        <sphereGeometry args={[radio * 1.7, 28, 20]} />
        <meshBasicMaterial ref={halo} color="#ff6a4d" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Cerebro y cerebelo ───────────────────────────────────────────────────────
//
// Sombreador propio: casi transparente de frente y marcado en el borde
// (Fresnel), con el color de cada lóbulo (o del territorio arterial en la vista
// Territorios), los surcos principales como líneas y un dibujo de
// circunvoluciones (ruido simplex) o de folias en el cerebelo. El dibujo se
// calcula sobre la posición de atlas (atributo p0) para que no «resbale» sobre
// el cerebelo cuando este se mueve.

const RUIDO = /* glsl */ `
  // Ruido simplex 3D de Ashima Arts / Stefan Gustavson (licencia MIT).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 q0 = vec3(a0.xy, h.x);
    vec3 q1 = vec3(a0.zw, h.y);
    vec3 q2 = vec3(a1.xy, h.z);
    vec3 q3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(q0, q0), dot(q1, q1), dot(q2, q2), dot(q3, q3)));
    q0 *= norm.x; q1 *= norm.y; q2 *= norm.z; q3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(q0, x0), dot(q1, x1), dot(q2, x2), dot(q3, x3)));
  }
`;

const ENCEFALO_VERT = /* glsl */ `
  attribute vec4 lobulo;
  attribute vec3 terr;
  attribute float surco;
  attribute vec3 p0;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP0;
  varying vec4 vL;
  varying vec3 vT;
  varying float vS;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vP0 = p0;
    vL = lobulo;
    vT = terr;
    vS = surco;
    gl_Position = projectionMatrix * mv;
  }
`;

const ENCEFALO_FRAG = /* glsl */ `
  uniform vec3 cLob[4];
  uniform vec3 cTer[3];
  uniform vec3 uPropioLob;
  uniform vec3 uPropioTer;
  uniform float uModo;
  uniform float uSel;
  uniform float uBase;
  uniform float uBorde;
  uniform float uFolia;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP0;
  varying vec4 vL;
  varying vec3 vT;
  varying float vS;
  ${RUIDO}
  void main() {
    float sumL = vL.x + vL.y + vL.z + vL.w;
    vec3 colL = cLob[0] * vL.x + cLob[1] * vL.y + cLob[2] * vL.z + cLob[3] * vL.w + uPropioLob * max(0.0, 1.0 - sumL);
    float propio = max(0.0, 1.0 - (vT.x + vT.y + vT.z));
    vec3 colT = cTer[0] * vT.x + cTer[1] * vT.y + cTer[2] * vT.z + uPropioTer * propio;
    vec3 col = mix(colL, colT, uModo);
    // Territorio elegido: lo demás se apaga.
    float sel = 1.0;
    if (uSel > -0.5) {
      vec4 w = vec4(vT, propio);
      sel = uSel < 0.5 ? w.x : (uSel < 1.5 ? w.y : (uSel < 2.5 ? w.z : w.w));
    }
    // Circunvoluciones (cerebro) o folias (cerebelo).
    float g;
    if (uFolia > 0.5) {
      float d = length(vP0.yz - vec2(-10.8, 0.7));
      g = 1.0 - smoothstep(0.06, 0.3, abs(sin(d * 5.4 + snoise(vP0 * 0.45) * 0.9)));
    } else {
      float nn = snoise(vP0 * 0.42) + 0.5 * snoise(vP0 * 0.9 + 7.3);
      g = 1.0 - smoothstep(0.03, 0.2, abs(nn));
    }
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    float a = uBase + uBorde * pow(f, 2.4) + g * 0.045 + vS * 0.38;
    col = mix(col, col * 0.55, max(g * 0.45, vS * 0.85));
    if (uSel > -0.5) {
      col = mix(vec3(0.78), col, sel);
      a *= mix(0.35, 1.3, sel);
    }
    gl_FragColor = vec4(col, clamp(a, 0.0, 0.85));
  }
`;

const LOBULOS = ['#e7a497', '#e3c27e', '#a9c77f', '#b9a0d6']; // frontal, parietal, temporal, occipital
const SEL_TERRITORIO: Partial<Record<TerritorioId, number>> = { aca: 0, acm: 1, acp: 2, vb: 3 };

function Encefalo({ geo, folia, modoDoblez, propioLob, territorios, sel }: {
  geo: THREE.BufferGeometry;
  folia: boolean;
  modoDoblez: ModoDoblez;
  propioLob: string;
  territorios: boolean;
  sel: number;
}) {
  useMemo(() => {
    if (!geo.attributes.p0) geo.setAttribute('p0', (geo.attributes.position as THREE.BufferAttribute).clone());
  }, [geo]);
  useDoblez(geo, modoDoblez);
  const uniforms = useMemo(() => ({
    cLob: { value: LOBULOS.map((c) => new THREE.Color(c)) },
    cTer: { value: [TERRITORIOS.aca.color, TERRITORIOS.acm.color, TERRITORIOS.acp.color].map((c) => new THREE.Color(c)) },
    uPropioLob: { value: new THREE.Color(propioLob) },
    uPropioTer: { value: new THREE.Color(TERRITORIOS.vb.color) },
    uModo: { value: 0 },
    uSel: { value: -1 },
    uBase: { value: folia ? 0.05 : 0.035 },
    uBorde: { value: 0.42 },
    uFolia: { value: folia ? 1 : 0 },
  }), [folia, propioLob]);
  uniforms.uModo.value = territorios ? 1 : 0;
  uniforms.uSel.value = sel;
  // Sin eventos: tocar «dentro» del cerebro debe seguir deseleccionando.
  return (
    <mesh geometry={geo} renderOrder={3}>
      <shaderMaterial
        vertexShader={ENCEFALO_VERT}
        fragmentShader={ENCEFALO_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Malla de referencia que se dobla con el tronco (tronco y médula). */
function Doblable({ geo, modo, children, ...rest }: {
  geo: THREE.BufferGeometry;
  modo: ModoDoblez;
  children: ReactNode;
} & Omit<ThreeElements['mesh'], 'geometry' | 'children'>) {
  useDoblez(geo, modo);
  return <mesh geometry={geo} {...rest}>{children}</mesh>;
}

/** Estructuras vecinas: encéfalo, tronco, médula, vía óptica, hipófisis y III par. */
function Referencias(props: SceneProps) {
  const cerebro = useMemo(() => geometriaCerebro(), []);
  const cerebelo = useMemo(() => geometriaCerebelo(), []);
  const tronco = useMemo(() => geometriaTronco(), []);
  const medula = useMemo(() => geometriaMedula(), []);
  const optico = useMemo(() => geometriaOptico(), []);
  const hipofisis = useMemo(() => geometriaHipofisis(), []);
  const nervio3i = useMemo(() => geometriaOculomotor('i'), []);
  const nervio3d = useMemo(() => geometriaOculomotor('d'), []);
  useEffect(() => () => {
    [cerebro, cerebelo, tronco, medula, optico, hipofisis, nervio3i, nervio3d].forEach((g) => g.dispose());
  }, [cerebro, cerebelo, tronco, medula, optico, hipofisis, nervio3i, nervio3d]);

  const { refs, elegido, senalado, sindrome, mode, territorio, postura } = props;
  const marca = (id: ReferenciaId) =>
    (elegido?.kind === 'ref' && elegido.id === id) ? 0.4 : (senalado?.kind === 'ref' && senalado.id === id) ? 0.2 : 0;
  // El síndrome que lesiona el III par lo enseña aunque esté oculto, y solo
  // pinta de violeta el del lado afectado.
  const iiiClinico = mode === 'clinico' && !!sindrome?.nervio3;
  const iiiAfectado = (lado: 'i' | 'd') => iiiClinico && (sindrome!.lado === 'ambos' || sindrome!.lado === lado);
  const enTerritorios = mode === 'territorios';
  const sel = enTerritorios && territorio ? SEL_TERRITORIO[territorio] ?? -1 : -1;

  const eventos = (id: ReferenciaId, translucido: boolean) => {
    // Lo translúcido no tapa: si detrás hay una arteria, manda la arteria.
    const tapaArteria = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
      translucido && e.intersections.some((h) => h.object.userData?.arteria);
    return {
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        if (tapaArteria(e)) return;
        e.stopPropagation();
        props.onSenalar({ kind: 'ref', id });
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        props.onSenalar(null);
        document.body.style.cursor = 'auto';
      },
      onClick: (e: ThreeEvent<MouseEvent>) => {
        if (tapaArteria(e)) return;
        e.stopPropagation();
        props.onElegir({ kind: 'ref', id });
      },
    };
  };

  const materialTronco = (
    <meshPhysicalMaterial
      color="#e2c3b6"
      emissive="#ffffff"
      emissiveIntensity={marca('tronco') * 0.3}
      transparent
      opacity={0.3}
      roughness={0.6}
      sheen={0.4}
      sheenColor="#fff0ea"
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );

  return (
    <group>
      {refs.cerebro && (
        <>
          <Encefalo geo={cerebro} folia={false} modoDoblez="fijo" propioLob="#d9a196" territorios={enTerritorios} sel={sel} />
          <Encefalo geo={cerebelo} folia modoDoblez="cerebelo" propioLob="#d3a08f" territorios={enTerritorios} sel={sel} />
        </>
      )}
      {refs.tronco && (
        <Doblable geo={tronco} modo="tronco" renderOrder={1} {...eventos('tronco', true)}>{materialTronco}</Doblable>
      )}
      {/* La médula cervical existe siempre, pero solo se ve en la posición real. */}
      {refs.tronco && postura === 'real' && (
        <Doblable geo={medula} modo="tronco" renderOrder={1} {...eventos('tronco', true)}>{materialTronco}</Doblable>
      )}
      {refs.optico && (
        <mesh geometry={optico} {...eventos('optico', false)}>
          <meshPhysicalMaterial color="#efe2cc" emissive="#fff6e0" emissiveIntensity={marca('optico')} roughness={0.5} clearcoat={0.25} sheen={0.3} sheenColor="#fff3e0" />
        </mesh>
      )}
      {refs.hipofisis && (
        <mesh geometry={hipofisis} {...eventos('hipofisis', false)}>
          <meshPhysicalMaterial color="#e3b39e" emissive="#ffd9c9" emissiveIntensity={marca('hipofisis')} roughness={0.45} clearcoat={0.3} />
        </mesh>
      )}
      {(refs.nervio3 || iiiClinico) && ([['i', nervio3i], ['d', nervio3d]] as const).map(([lado, geo]) => (
        <mesh key={lado} geometry={geo} {...eventos('nervio3', false)}>
          <meshPhysicalMaterial
            color={iiiAfectado(lado) ? VIOLETA : '#f1e3bd'}
            emissive={iiiAfectado(lado) ? VIOLETA : '#fff3c9'}
            emissiveIntensity={iiiAfectado(lado) ? 0.4 : marca('nervio3')}
            roughness={0.5}
            clearcoat={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Etiquetas ────────────────────────────────────────────────────────────────

const LOBULOS_ETIQUETA: Array<{ nombre: string; pos: Pt }> = [
  { nombre: 'Lóbulo frontal', pos: [7.2, 9.5, -5.5] },
  { nombre: 'Lóbulo temporal', pos: [10.6, -2.5, 0.8] },
  { nombre: 'Lóbulo parietal', pos: [8.8, -6.5, -12.5] },
  { nombre: 'Lóbulo occipital', pos: [6.0, -13.6, -6.0] },
];

function Etiquetas(props: SceneProps) {
  const { etiquetas, elegido, sistema, mode, variante, postura, refs } = props;
  const t = postura === 'real' ? 1 : 0;
  const ids = Object.keys(ARTERIAS) as ArteriaId[];
  const visibles = etiquetas
    ? ids.filter((id) => enSistema(ARTERIAS[id], sistema)
      && !(mode === 'variantes' && efectoVariante(variante, id, 'i').oculta)
      && (postura === 'real' || !soloCuello(id)))
    : [];
  const elegida = elegido?.kind === 'arteria' ? elegido : null;
  const cerebeloPos = useMemo(() => {
    const v = new THREE.Vector3(5.2, -11.2, -1.6);
    deformar(v, t, 'cerebelo');
    return v;
  }, [t]);
  return (
    <>
      {visibles.map((id) => {
        if (elegida?.id === id) return null; // la elegida lleva su propio rótulo
        const lado: Lado = ARTERIAS[id].par ? 'i' : 'm';
        return (
          <Html key={id} position={anclaEtiqueta(id, lado, t)} center style={labelStyle} zIndexRange={[10, 0]}>
            {ARTERIAS[id].corto}
          </Html>
        );
      })}
      {etiquetas && refs.cerebro && (
        <>
          {LOBULOS_ETIQUETA.map((l) => (
            <Html key={l.nombre} position={l.pos} center style={loboStyle} zIndexRange={[9, 0]}>{l.nombre}</Html>
          ))}
          <Html position={cerebeloPos} center style={loboStyle} zIndexRange={[9, 0]}>Cerebelo</Html>
        </>
      )}
      {etiquetas && postura === 'atlas' && (
        <>
          <Html position={[0, 5.9, -1.4]} center style={labelStyle}>Anterior</Html>
          <Html position={[0, -11.2, 2.9]} center style={labelStyle}>Posterior</Html>
          <Html position={[-6.9, 0.4, -0.8]} center style={labelStyle}>Derecha</Html>
          <Html position={[6.9, 0.4, -0.8]} center style={labelStyle}>Izquierda</Html>
        </>
      )}
      {etiquetas && postura === 'real' && (
        <>
          <Html position={[0, 6.5, -2]} center style={labelStyle}>Anterior</Html>
          <Html position={[0, -2, 21.5]} center style={labelStyle}>Cuello (inferior)</Html>
        </>
      )}
      {elegida && (
        <Html position={anclaEtiqueta(elegida.id, elegida.lado, t)} center style={elegidoStyle} zIndexRange={[20, 11]}>
          {ARTERIAS[elegida.id].corto}
          {ARTERIAS[elegida.id].par ? (elegida.lado === 'd' ? ' · der.' : ' · izq.') : ''}
        </Html>
      )}
    </>
  );
}

// ── Escena ───────────────────────────────────────────────────────────────────

function Scene(props: SceneProps) {
  const { mode, variante, sindrome, postura } = props;
  const saco = mode === 'clinico' ? sindrome?.saco : undefined;

  // Al salir del lienzo con el puntero encima de algo, el cursor vuelve a la normalidad.
  useEffect(() => () => { document.body.style.cursor = 'auto'; }, []);

  return (
    <>
      <AnimadorDoblez postura={postura} />

      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#ffffff', '#b9a397', 0.7]} />
      <directionalLight position={[5, -4, 11]} intensity={1.5} />
      <directionalLight position={[-7, 5, -6]} intensity={0.6} color="#dfe8ff" />
      <directionalLight position={[9, 4, 2]} intensity={0.5} />
      <directionalLight position={[0, 8, 4]} intensity={0.3} />

      <Ejes postura={postura} />
      <CameraRig reinicio={props.reinicio} encuadre={props.encuadre} postura={postura} />

      <group>
        {PIEZAS.map((p) => (
          <PiezaArteria key={`${p.arteria}-${p.lado}${p.cuello ? '-cuello' : ''}`} pieza={p} props={props} />
        ))}
        {mode === 'variantes' && variante?.extra && <Extra variante={variante} />}
        {saco && <Saco centro={saco.centro} radio={saco.radio} />}
      </group>

      <Referencias {...props} />
      <Etiquetas {...props} />

      {/* Clic izquierdo: girar · clic derecho: mover · rueda: acercar. Se
          vuelve a crear al cambiar de postura porque toma el eje «arriba» al
          nacer. */}
      <OrbitControls
        key={postura}
        enablePan
        screenSpacePanning
        minDistance={4}
        maxDistance={110}
        makeDefault
      />
    </>
  );
}

export default function WillisScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, -6, 20], fov: 42 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      onPointerMissed={props.onDeseleccionar}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Scene {...props} />
    </Canvas>
  );
}
