'use client';
// Escena 3D del tronco del encéfalo (React Three Fiber). La superficie sale del
// campo de distancias de engine/forma.ts y se pinta por vértice: color de
// tejido, oclusión ambiental (oscurece surcos y hendiduras) y el tinte de lo
// elegido o señalado. Las luces viajan con la cámara: se mire desde donde se
// mire, la luz es suave y llega a todas las caras sin quemar ninguna.

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { modeloTronco, geometriaCerebelo, geometriaInterior, geometriaNervio, geometriaPrimitivas, puntaNervio, type Lado } from './engine/geometria';
import { estructuraDe, GRUPOS, ESTRUCTURAS } from './engine/anatomia';
import { NERVIOS, NERVIO } from './engine/nervios';
import { INTERIOR, INTERIOR_LIST, type ParId } from './engine/interior';
import { calcularCorte, NIVEL, VENTANA } from './engine/cortes';
import type { Sindrome } from './engine/clinica';
import type { Elegido, Modo, EstadoCerebelo, Vista } from './TroncoSimulator';

export interface SceneProps {
  modo: Modo;
  cerebelo: EstadoCerebelo;
  vista: { cual: Vista; n: number };
  elegido: Elegido;
  senalado: Elegido;
  nivel: string;
  sindrome: Sindrome | null;
  /** Estructura de la ficha clínica bajo el puntero (se resalta). */
  signo: string | null;
  /** En la práctica: colores neutros y la corrección en verde (respuesta) y rojo (error). */
  practica: Marcas | null;
  mostrarNervios: boolean;
  mostrarVias: boolean;
  etiquetas: boolean;
  ligero: boolean;
  oscuro: boolean;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  onDeseleccionar: () => void;
  onListo: () => void;
}

// ── Colores ─────────────────────────────────────────────────────────────────

const TEJIDO = new THREE.Color('#e8d3c3');
const SUELO = '#ddc4bf';
const BASE_ETQ: Record<string, string> = {
  // Suelo del IV ventrículo: un solo tono. Sus campos (vago, hipogloso,
  // vestibular, locus coeruleus…) se distinguen al tocarlos, no por color:
  // con tonos propios salían bordes rectos y el locus parecía señalado.
  fosa_romboidea: SUELO, eminencia_medial: SUELO, coliculo_facial: SUELO, area_vestibular: SUELO,
  trigono_hipogloso: SUELO, trigono_vago: SUELO, area_postrema: SUELO, locus_coeruleus: SUELO,
  estrias_medulares: '#efe3d6', coliculo_superior: '#e2c9b8', coliculo_inferior: '#e2c9b8', pineal: '#d9a69c',
  mamilar: '#e6cbbb', cintilla_optica: '#efe3d2', oliva: '#e3cab8', corte_pcm: '#f3ebdf', corte_pci: '#f3ebdf',
  corte_pcs: '#f3ebdf', corte_inferior: '#efe6da', talamo: '#dfc7b8', pulvinar: '#dfc7b8',
};
const COLOR_GRUPO = Object.fromEntries(GRUPOS.map((g) => [g.id, new THREE.Color(g.color)]));
const AMBAR = new THREE.Color('#f2b631');

function idDe(e: Elegido): string | null {
  return e?.kind === 'estructura' ? (estructuraDe(e.id)?.id ?? null) : null;
}

/** Pinta el tronco: tejido × oclusión, y el tinte de lo elegido y lo señalado. */
export interface Marcas { ok: Set<string>; mal: Set<string>; objetivo?: Set<string> }
const VERDE = '#2f9e44';
const ROJO = '#e03131';

function colorear(geo: THREE.BufferGeometry, elegido: string | null, senalado: string | null, clinico: Set<string>, marcas: Marcas | null = null) {
  const etq = geo.userData.etq as Uint16Array;
  const etiquetas = geo.userData.etiquetas as string[];
  const ao = geo.getAttribute('ao') as THREE.BufferAttribute;
  const col = geo.getAttribute('color') as THREE.BufferAttribute;
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  // Por etiqueta: color base y tinte.
  const base = etiquetas.map((e) => new THREE.Color(BASE_ETQ[e] ?? TEJIDO));
  const tinte = etiquetas.map((e) => {
    const est = estructuraDe(e);
    if (!est) return null;
    if (marcas?.ok.has(est.id)) return { c: new THREE.Color(VERDE), f: 0.6 };
    if (marcas?.mal.has(est.id)) return { c: new THREE.Color(ROJO), f: 0.6 };
    if (clinico.has(est.id)) return { c: new THREE.Color('#7c5cd6'), f: 0.5 };
    if (est.id === elegido) return { c: COLOR_GRUPO[est.grupo], f: 0.5 };
    if (est.id === senalado) return { c: COLOR_GRUPO[est.grupo], f: 0.3 };
    return null;
  });
  const n = etq.length;
  // 1) Color de cada vértice según su zona (sin la sombra todavía).
  let rgb = new Float32Array(n * 3);
  const c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const k = etq[i];
    c.copy(base[k]);
    // Superficie de corte del diencéfalo: gris en los tálamos, blanca en los pedúnculos.
    if (etiquetas[k] === 'corte_superior') {
      const x = Math.abs(pos.getX(i)), z = pos.getZ(i);
      c.set(z < 0.05 && x > 0.12 ? '#d6bcad' : '#f1e8dc');
    }
    const t = tinte[k];
    if (t) c.lerp(t.c, t.f);
    rgb[i * 3] = c.r; rgb[i * 3 + 1] = c.g; rgb[i * 3 + 2] = c.b;
  }
  // 2) Fundido con los vecinos: el borde entre zonas sigue la rejilla del
  //    mallado y saldría en escalera; tres pasadas lo vuelven un degradado
  //    de ~1 mm sin emborronar el resto (dentro de una zona todo es igual).
  const { inicio, vecinos } = vecindad(geo);
  for (let pasada = 0; pasada < 3; pasada++) {
    const sig = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2], m = 1;
      for (let q = inicio[i]; q < inicio[i + 1]; q++) {
        const v = vecinos[q];
        r += rgb[v * 3]; g += rgb[v * 3 + 1]; b += rgb[v * 3 + 2]; m++;
      }
      sig[i * 3] = r / m; sig[i * 3 + 1] = g / m; sig[i * 3 + 2] = b / m;
    }
    rgb = sig;
  }
  // 3) Sombra de los surcos (oclusión), que no se funde: es el relieve.
  for (let i = 0; i < n; i++) {
    const a = ao.getX(i);
    const s = 0.3 + 0.7 * a * a;
    col.setXYZ(i, rgb[i * 3] * s, rgb[i * 3 + 1] * s, rgb[i * 3 + 2] * s);
  }
  col.needsUpdate = true;
}

/** Vecinos de cada vértice (en formato compacto), calculados una vez por malla. */
function vecindad(geo: THREE.BufferGeometry): { inicio: Uint32Array; vecinos: Uint32Array } {
  const hecho = geo.userData.vecindad as { inicio: Uint32Array; vecinos: Uint32Array } | undefined;
  if (hecho) return hecho;
  const n = (geo.getAttribute('position') as THREE.BufferAttribute).count;
  const idx = geo.getIndex()!.array as ArrayLike<number>;
  const grado = new Uint32Array(n + 1);
  for (let t = 0; t < idx.length; t += 3) {
    for (let e = 0; e < 3; e++) grado[idx[t + e]] += 2;
  }
  const inicio = new Uint32Array(n + 1);
  for (let i = 0; i < n; i++) inicio[i + 1] = inicio[i] + grado[i];
  const vecinos = new Uint32Array(inicio[n]);
  const lleno = inicio.slice(0, n);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], cc = idx[t + 2];
    vecinos[lleno[a]++] = b; vecinos[lleno[a]++] = cc;
    vecinos[lleno[b]++] = a; vecinos[lleno[b]++] = cc;
    vecinos[lleno[cc]++] = a; vecinos[lleno[cc]++] = b;
  }
  geo.userData.vecindad = { inicio, vecinos };
  return geo.userData.vecindad;
}

// ── Material fantasma (Fresnel): el tronco como una funda de cristal ────────

function useFantasma(color: string, fuerza: number, plano?: THREE.Plane) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    clipping: true,
    uniforms: { uColor: { value: new THREE.Color(color) }, uFuerza: { value: fuerza } },
    vertexShader: `
      #include <clipping_planes_pars_vertex>
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
        #include <clipping_planes_vertex>
      }`,
    fragmentShader: `
      #include <clipping_planes_pars_fragment>
      uniform vec3 uColor; uniform float uFuerza;
      varying vec3 vN; varying vec3 vV;
      void main() {
        #include <clipping_planes_fragment>
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        gl_FragColor = vec4(uColor, (0.05 + 0.55 * f) * uFuerza);
      }`,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    mat.uniforms.uColor.value.set(color);
    mat.uniforms.uFuerza.value = fuerza;
    mat.clippingPlanes = plano ? [plano] : null;
    mat.needsUpdate = true;
  }, [mat, color, fuerza, plano]);
  useEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

// ── Cámara: luces que la acompañan y encuadres ──────────────────────────────

function LucesDeCamara({ oscuro }: { oscuro: boolean }) {
  const { camera, scene } = useThree();
  useEffect(() => {
    scene.add(camera);
    const crear = (color: string, i: number, p: [number, number, number]) => {
      const l = new THREE.DirectionalLight(color, i);
      l.position.set(...p);
      l.target.position.set(0, 0, -30);
      camera.add(l);
      camera.add(l.target);
      return l;
    };
    // Principal suave desde arriba a la derecha, relleno frío y un contraluz
    // que separa el borde del fondo: ninguna cara queda en negro.
    const ls = [
      crear('#fff1e4', oscuro ? 1.05 : 0.95, [5, 6, 3]),
      crear('#dfe8ff', 0.32, [-6, -1, 2]),
      crear('#ffffff', 0.6, [0, 4, -9]),
    ];
    return () => { ls.forEach((l) => { camera.remove(l); camera.remove(l.target); l.dispose(); }); };
  }, [camera, scene, oscuro]);
  return (
    <>
      <hemisphereLight args={['#fff8f2', '#8a7268', oscuro ? 0.5 : 0.55]} />
      <ambientLight intensity={0.08} />
    </>
  );
}

const DIRECCION: Record<Vista, THREE.Vector3> = {
  anterior: new THREE.Vector3(0.18, 0.06, 1),
  lateral: new THREE.Vector3(1, 0.05, 0.12),
  posterior: new THREE.Vector3(-0.18, 0.2, -1),
  superior: new THREE.Vector3(0, 1, 0.75),
};

function Camara({ vista, modo, nivel, cerebelo, reducido }: { vista: { cual: Vista; n: number }; modo: Modo; nivel: string; cerebelo: EstadoCerebelo; reducido: boolean }) {
  const { camera, controls, size } = useThree();
  const anim = useRef<{ desde: THREE.Vector3; hasta: THREE.Vector3; tDesde: THREE.Vector3; tHasta: THREE.Vector3; t: number } | null>(null);
  const aspecto = size.width / Math.max(size.height, 1);
  const enCorte = modo === 'cortes';
  const conCerebelo = cerebelo !== 'retirado' && (modo === 'anatomia' || modo === 'nervios');
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const t = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    let objetivo: THREE.Vector3;
    let dir: THREE.Vector3;
    let medioAlto: number;
    let medioAncho: number;
    if (enCorte) {
      const y = NIVEL[nivel]?.y ?? 0;
      objetivo = new THREE.Vector3(0, y - 0.6, 0);
      dir = new THREE.Vector3(0.0, 1, 0.62);
      medioAlto = 1.9; medioAncho = 2.2;
    } else {
      objetivo = new THREE.Vector3(0, conCerebelo ? 0.6 : 0.25, conCerebelo ? -1.2 : 0);
      dir = DIRECCION[vista.cual].clone();
      // Holgura para la perspectiva y para la barra de vistas y el selector del cerebelo.
      medioAlto = conCerebelo ? 6.2 : 5.9;
      medioAncho = conCerebelo ? (vista.cual === 'lateral' ? 4.0 : 5.4) : 3.1;
    }
    const dist = Math.max(medioAlto / t, medioAncho / (t * aspecto)) * 1.06;
    const hasta = objetivo.clone().add(dir.normalize().multiplyScalar(dist));
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (reducido || !oc) {
      cam.position.copy(hasta);
      if (oc) { oc.target.copy(objetivo); oc.update(); } else cam.lookAt(objetivo);
      anim.current = null;
      return;
    }
    anim.current = { desde: cam.position.clone(), hasta, tDesde: oc.target.clone(), tHasta: objetivo, t: 0 };
  }, [vista, enCorte, nivel, conCerebelo, camera, controls, aspecto, reducido]);
  useFrame((_, dt) => {
    const a = anim.current;
    const oc = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!a || !oc) return;
    a.t = Math.min(1, a.t + dt / 0.7);
    const e = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.desde, a.hasta, e);
    oc.target.lerpVectors(a.tDesde, a.tHasta, e);
    oc.update();
    if (a.t >= 1) anim.current = null;
  });
  return null;
}

// ── Rótulos ─────────────────────────────────────────────────────────────────

const estiloRotulo: CSSProperties = {
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.02em',
  padding: '2px 8px',
  borderRadius: '999px',
  background: 'rgba(26, 26, 46, 0.8)',
  color: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
};

/** Rótulo que se oculta cuando su cara mira hacia el otro lado. */
function Rotulo({ p, n, texto, color }: { p: [number, number, number]; n: [number, number, number]; texto: string; color?: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const normal = useMemo(() => new THREE.Vector3(...n).normalize(), [n]);
  const pos = useMemo(() => new THREE.Vector3(...p), [p]);
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    if (!caja.current) return;
    v.copy(camera.position).sub(pos).normalize();
    caja.current.style.opacity = v.dot(normal) > 0.05 ? '1' : '0';
  });
  return (
    <Html position={p} center zIndexRange={[4, 0]}>
      <div ref={caja} style={{ ...estiloRotulo, background: color ?? estiloRotulo.background, transition: 'opacity .2s' }}>{texto}</div>
    </Html>
  );
}

const ROTULOS: Array<{ id: string; p: [number, number, number]; n: [number, number, number] }> = [
  { id: 'pedunculo_cerebral', p: [0.95, 3.7, 0.8], n: [0.4, 0, 1] },
  { id: 'fosa_interpeduncular', p: [0, 3.0, 0.75], n: [0, 0, 1] },
  { id: 'mamilar', p: [0, 4.75, 0.95], n: [0, 0.3, 1] },
  { id: 'puente', p: [0, 1.75, 1.25], n: [0, 0, 1] },
  { id: 'piramide', p: [0.3, -1.6, 0.8], n: [0, 0, 1] },
  { id: 'oliva', p: [0.82, -0.9, 0.5], n: [0.6, 0, 0.8] },
  { id: 'decusacion_piramidal', p: [0, -2.7, 0.6], n: [0, 0, 1] },
  { id: 'pcm', p: [1.7, 1.25, 0.2], n: [1, 0, 0.2] },
  { id: 'coliculo_superior', p: [0.42, 3.95, -1.05], n: [0, 0.2, -1] },
  { id: 'coliculo_inferior', p: [0.4, 3.18, -1.02], n: [0, 0, -1] },
  { id: 'pineal', p: [0, 4.45, -1.6], n: [0, 0.3, -1] },
  { id: 'pulvinar', p: [1.05, 4.7, -1.3], n: [0.3, 0.2, -1] },
  { id: 'pcs', p: [0.75, 2.25, -1.05], n: [0.2, 0, -1] },
  { id: 'coliculo_facial', p: [0.2, 1.1, -0.72], n: [0, 0, -1] },
  { id: 'estrias_medulares', p: [0.6, 0.38, -0.75], n: [0, 0, -1] },
  { id: 'trigono_hipogloso', p: [0.13, -0.45, -0.7], n: [0, 0, -1] },
  { id: 'area_postrema', p: [0, -1.12, -0.65], n: [0, 0, -1] },
  { id: 'tuberculo_gracil', p: [0.14, -1.75, -0.7], n: [0, 0, -1] },
  { id: 'tuberculo_cuneiforme', p: [0.48, -1.45, -0.68], n: [0.3, 0, -1] },
  { id: 'pci', p: [1.0, 0.1, -0.9], n: [0.5, 0, -1] },
];

// ── Piezas de la escena ─────────────────────────────────────────────────────

/**
 * Raycast que ignora lo recortado. El plano de corte solo quita lo de arriba
 * del dibujo: el rayo del ratón seguía chocando con esa parte invisible del
 * tronco, que se quedaba el clic antes de llegar a la tapa del corte. De cerca
 * no pasaba porque la cámara quedaba dentro de esa parte (sin cara delante).
 */
function useRayoRecortado(plano: THREE.Plane | null) {
  return useMemo(() => function (this: THREE.Mesh, rc: THREE.Raycaster, hits: THREE.Intersection[]) {
    const n = hits.length;
    THREE.Mesh.prototype.raycast.call(this, rc, hits);
    if (!plano) return;
    for (let i = hits.length - 1; i >= n; i--) if (plano.distanceToPoint(hits[i].point) < 0) hits.splice(i, 1);
  }, [plano]);
}

function Tronco({ geo, fantasma, elegido, senalado, clinico, marcas, plano, oscuro, onElegir, onSenalar }: {
  geo: THREE.BufferGeometry;
  /** Funda de cristal (para ver el interior). */
  fantasma: boolean;
  elegido: string | null;
  senalado: string | null;
  clinico: Set<string>;
  marcas: Marcas | null;
  plano: THREE.Plane | null;
  oscuro: boolean;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
}) {
  const ultimo = useRef<string | null>(null);
  const rayo = useRayoRecortado(plano);
  useEffect(() => { colorear(geo, elegido, senalado, clinico, marcas); }, [geo, elegido, senalado, clinico, marcas]);
  const ghost = useFantasma(oscuro ? '#b8c4ff' : '#7d6a8a', oscuro ? 0.75 : 0.85);
  const ghostArriba = useFantasma(oscuro ? '#b8c4ff' : '#7d6a8a', 0.5, plano ? new THREE.Plane(new THREE.Vector3(0, 1, 0), -plano.constant) : undefined);
  const solido = useMemo(() => new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.55, metalness: 0, clearcoat: 0.28, clearcoatRoughness: 0.5,
    sheen: 0.45, sheenRoughness: 0.6, sheenColor: new THREE.Color('#f6d9cf'), side: THREE.DoubleSide,
  }), []);
  useEffect(() => { solido.clippingPlanes = plano ? [plano] : null; solido.needsUpdate = true; }, [solido, plano]);
  useEffect(() => () => solido.dispose(), [solido]);

  const etiquetaDe = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const f = e.face;
    if (!f) return null;
    const etq = geo.userData.etq as Uint16Array;
    return (geo.userData.etiquetas as string[])[etq[f.a]] ?? null;
  };
  const mover = (e: ThreeEvent<PointerEvent>) => {
    if (fantasma) return;
    e.stopPropagation();
    const id = etiquetaDe(e);
    const valido = id && estructuraDe(id) ? id : null;
    if (valido !== ultimo.current) {
      ultimo.current = valido;
      onSenalar(valido ? { kind: 'estructura', id: valido } : null);
    }
    document.body.style.cursor = valido ? 'pointer' : 'auto';
  };
  const salir = () => {
    if (ultimo.current) { ultimo.current = null; onSenalar(null); }
    document.body.style.cursor = 'auto';
  };
  const tocar = (e: ThreeEvent<MouseEvent>) => {
    if (fantasma) return;
    e.stopPropagation();
    const id = etiquetaDe(e);
    if (id && estructuraDe(id)) onElegir({ kind: 'estructura', id });
  };

  if (fantasma) return <mesh geometry={geo} material={ghost} renderOrder={5} />;
  return (
    <>
      <mesh geometry={geo} material={solido} raycast={rayo} onPointerMove={mover} onPointerOut={salir} onClick={tocar} />
      {plano && <mesh geometry={geo} material={ghostArriba} renderOrder={5} />}
    </>
  );
}

/** Cerebelo: en su sitio, como funda de cristal o retirado (se aleja y se desvanece). */
function Cerebelo({ estado, ligero, oscuro, elegido, onElegir, onSenalar }: {
  estado: EstadoCerebelo;
  ligero: boolean;
  oscuro: boolean;
  elegido: string | null;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
}) {
  const grupo = useRef<THREE.Group>(null);
  const avance = useRef(estado === 'retirado' ? 1 : 0);
  const [visible, setVisible] = useState(estado !== 'retirado');
  // Solo se modela la primera vez que hace falta (≈ 0,5 s): quien nunca pone
  // el cerebelo no lo paga.
  const [usado, setUsado] = useState(estado !== 'retirado');
  useEffect(() => { if (estado !== 'retirado') setUsado(true); }, [estado]);
  const geo = useMemo(() => (usado ? geometriaCerebelo(ligero) : null), [usado, ligero]);
  const reducido = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  const solido = useMemo(() => new THREE.MeshPhysicalMaterial({
    vertexColors: true, roughness: 0.6, clearcoat: 0.2, clearcoatRoughness: 0.6, sheen: 0.4, sheenColor: new THREE.Color('#f6d9cf'), transparent: true,
  }), []);
  const ghost = useFantasma(oscuro ? '#c9b8ff' : '#8a7a5a', 0.9);
  useEffect(() => () => solido.dispose(), [solido]);
  useEffect(() => { if (geo) colorear(geo, elegido, null, new Set()); }, [geo, elegido]);
  useEffect(() => { if (estado !== 'retirado') setVisible(true); }, [estado]);
  useFrame((_, dt) => {
    const meta = estado === 'retirado' ? 1 : 0;
    const a = avance.current;
    const sig = reducido ? meta : a + Math.sign(meta - a) * Math.min(Math.abs(meta - a), dt / 0.75);
    avance.current = sig;
    const e = sig * sig * (3 - 2 * sig);
    if (grupo.current) grupo.current.position.set(0, 1.6 * e, -4.2 * e);
    solido.opacity = 1 - e;
    solido.depthWrite = e < 0.05;
    ghost.uniforms.uFuerza.value = 0.9 * (1 - e);
    if (sig >= 1 && visible) setVisible(false);
  });
  if (!visible || !geo) return null;
  const mover = (e: ThreeEvent<PointerEvent>) => {
    if (estado !== 'sitio') return;
    e.stopPropagation();
    const f = e.face;
    const id = f ? (geo.userData.etiquetas as string[])[(geo.userData.etq as Uint16Array)[f.a]] : null;
    onSenalar(id && ESTRUCTURAS[id] ? { kind: 'estructura', id } : null);
    document.body.style.cursor = id ? 'pointer' : 'auto';
  };
  const tocar = (e: ThreeEvent<MouseEvent>) => {
    if (estado !== 'sitio') return;
    e.stopPropagation();
    const f = e.face;
    const id = f ? (geo.userData.etiquetas as string[])[(geo.userData.etq as Uint16Array)[f.a]] : null;
    if (id && ESTRUCTURAS[id]) onElegir({ kind: 'estructura', id });
  };
  return (
    <group ref={grupo}>
      <mesh
        geometry={geo}
        material={estado === 'translucido' ? ghost : solido}
        renderOrder={estado === 'translucido' ? 6 : 0}
        onPointerMove={mover}
        onPointerOut={() => { onSenalar(null); document.body.style.cursor = 'auto'; }}
        onClick={tocar}
      />
    </group>
  );
}

/** Pares craneales (los dos lados). */
function Nervios({ campo, modo, elegido, senalado, apagado, resaltar, marcas, plano, onElegir, onSenalar, etiquetas }: {
  campo: ReturnType<typeof modeloTronco>['campo'];
  modo: Modo;
  elegido: Elegido;
  senalado: Elegido;
  apagado: boolean;
  /** Pares dañados por el síndrome (lado izquierdo): se ven aunque todo esté apagado. */
  resaltar: Set<string>;
  marcas: Marcas | null;
  plano: THREE.Plane | null;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  etiquetas: boolean;
}) {
  const geos = useMemo(() => NERVIOS.flatMap((n) => (['i', 'd'] as const).map((lado) => ({ n, lado, geo: geometriaNervio(n, lado, campo) }))), [campo]);
  // Las geometrías de los nervios se guardan en geometria.ts: no se liberan aquí.
  const rayo = useRayoRecortado(plano);
  // En la práctica van en color neutro: el color no debe delatar qué par es.
  const colorear = modo !== 'anatomia' && !marcas;
  return (
    <>
      {geos.map(({ n, lado, geo }) => {
        const esElegido = elegido?.kind === 'nervio' && elegido.id === n.id;
        const esSenalado = senalado?.kind === 'nervio' && senalado.id === n.id;
        const hayElegido = elegido?.kind === 'nervio';
        const base = marcas?.ok.has(n.id) ? VERDE : marcas?.mal.has(n.id) ? ROJO : colorear ? n.color : '#efe2cc';
        const danado = lado === 'i' && resaltar.has(n.id);
        const tenue = (apagado && !danado) || (hayElegido && !esElegido && modo === 'nervios');
        return (
          <mesh
            key={`${n.id}${lado}`}
            geometry={geo}
            raycast={rayo}
            onPointerMove={(e) => { if (apagado) return; e.stopPropagation(); onSenalar({ kind: 'nervio', id: n.id, lado }); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { onSenalar(null); document.body.style.cursor = 'auto'; }}
            onClick={(e) => { if (apagado) return; e.stopPropagation(); onElegir({ kind: 'nervio', id: n.id, lado }); }}
          >
            <meshPhysicalMaterial
              color={(esElegido || esSenalado) && !marcas?.ok.has(n.id) && !marcas?.mal.has(n.id) ? (colorear ? n.color : '#f2b631') : base}
              emissive={esElegido ? n.color : '#000000'}
              emissiveIntensity={esElegido ? 0.25 : 0}
              roughness={0.5}
              clearcoat={0.3}
              key={tenue ? 'tenue' : 'opaco'}
              transparent={tenue}
              opacity={tenue ? 0.28 : 1}
              depthWrite={!tenue}
              clippingPlanes={plano ? [plano] : null}
            />
          </mesh>
        );
      })}
      {etiquetas && !apagado && NERVIOS.map((n) => {
        const p = puntaNervio(n, 'i');
        return <Rotulo key={n.id} p={[p.x + 0.12, p.y + 0.12, p.z]} n={[0.6, 0, 1]} texto={n.id} color={colorear ? n.color : undefined} />;
      })}
    </>
  );
}

/** Núcleos y vías (o solo los de un par, o los de un síndrome). */
function Interior({ ids, elegido, senalado, clinico, marcas, signo, onElegir, onSenalar, interactivo }: {
  ids: string[];
  elegido: Elegido;
  senalado: Elegido;
  /** En la vista clínica: estructuras dañadas (el resto, apagado). */
  clinico: Map<string, Set<string>> | null;
  marcas: Marcas | null;
  signo: string | null;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
  interactivo: boolean;
}) {
  const piezas = useMemo(() => {
    const out: Array<{ id: string; lado: Lado; geo: THREE.BufferGeometry }> = [];
    for (const id of ids) {
      const x = INTERIOR[id];
      if (!x) continue;
      if (x.impar) out.push({ id, lado: 'm', geo: geometriaInterior(x, 'i') });
      else (['i', 'd'] as const).forEach((lado) => out.push({ id, lado, geo: geometriaInterior(x, lado) }));
    }
    return out;
  }, [ids]);
  // Las geometrías de núcleos y vías se guardan en geometria.ts: no se liberan aquí.
  return (
    <>
      {piezas.map(({ id, lado, geo }) => {
        const x = INTERIOR[id];
        const esEl = elegido?.kind === 'interior' && elegido.id === id && (elegido.lado === lado || lado === 'm');
        const esSe = senalado?.kind === 'interior' && senalado.id === id && (senalado.lado === lado || lado === 'm');
        // En la clínica la lesión es del lado izquierdo; lo dañado del derecho no se pinta.
        const danado = clinico ? !!clinico.get(id)?.has(lado) : true;
        const resaltado = signo === id;
        const color = marcas
          ? (marcas.ok.has(id) ? VERDE : marcas.mal.has(id) ? ROJO : '#a7b4c6')
          : clinico && !danado ? '#9aa0ab' : x.color;
        const op = x.velo ? 0.22 : clinico && !danado ? 0.16 : !clinico && x.tipo === 'via' && !esEl ? 0.7 : 1;
        return (
          <mesh
            key={`${id}${lado}`}
            geometry={geo}
            renderOrder={x.velo ? 4 : 1}
            onPointerMove={interactivo ? (e) => { e.stopPropagation(); onSenalar({ kind: 'interior', id, lado: lado === 'm' ? 'i' : lado }); document.body.style.cursor = 'pointer'; } : undefined}
            onPointerOut={interactivo ? () => { onSenalar(null); document.body.style.cursor = 'auto'; } : undefined}
            onClick={interactivo ? (e) => { e.stopPropagation(); onElegir({ kind: 'interior', id, lado: lado === 'm' ? 'i' : lado }); } : undefined}
          >
            <meshStandardMaterial
              key={op < 1 ? 't' : 'o'}
              color={esSe && !esEl ? '#f2b631' : color}
              emissive={esEl || resaltado ? color : '#000000'}
              emissiveIntensity={esEl || resaltado ? 0.45 : 0}
              roughness={0.55}
              transparent={op < 1}
              opacity={op}
              depthWrite={op === 1}
            />
          </mesh>
        );
      })}
    </>
  );
}

/**
 * Volumen de la lesión: una burbuja violeta con borde (Fresnel) que late
 * despacio y se ve a través de todo, sin tapar lo que daña por dentro.
 */
function Lesion({ s }: { s: Sindrome }) {
  const geo = useMemo(() => geometriaPrimitivas(s.lesion, 32), [s]);
  const mat = useFantasma('#7c5cd6', 1.6);
  const relleno = useRef<THREE.MeshBasicMaterial>(null);
  const reducido = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);
  useEffect(() => { mat.depthTest = false; }, [mat]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame(({ clock }) => {
    const l = reducido ? 0.5 : 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.2);
    mat.uniforms.uFuerza.value = 1.3 + 0.5 * l;
    if (relleno.current) relleno.current.opacity = 0.1 + 0.06 * l;
  });
  return (
    <>
      <mesh geometry={geo} material={mat} renderOrder={9} />
      <mesh geometry={geo} renderOrder={8}>
        <meshBasicMaterial ref={relleno} color="#7c5cd6" transparent opacity={0.12} depthWrite={false} depthTest={false} />
      </mesh>
    </>
  );
}

/** Tapa del corte: la imagen del corte en el plano, que se puede tocar. */
function TapaCorte({ nivel, oscuro, etiquetas, elegido, marcas, onElegir, onSenalar }: {
  nivel: string;
  oscuro: boolean;
  etiquetas: boolean;
  elegido: Elegido;
  marcas: Marcas | null;
  onElegir: (e: Elegido) => void;
  onSenalar: (e: Elegido) => void;
}) {
  const y = NIVEL[nivel].y;
  const corte = useMemo(() => calcularCorte(y), [y]);
  const tex = useMemo(() => {
    const t = new THREE.DataTexture(corte.rgba, corte.ancho, corte.alto, THREE.RGBAFormat);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [corte]);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const { x0, x1, z0, z1 } = VENTANA;
    const yy = y + 0.002;
    g.setAttribute('position', new THREE.Float32BufferAttribute([x0, yy, z0, x1, yy, z0, x1, yy, z1, x0, yy, z1], 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    g.setIndex([0, 2, 1, 0, 3, 2]);
    g.computeVertexNormals();
    return g;
  }, [y]);
  useEffect(() => () => { tex.dispose(); geo.dispose(); }, [tex, geo]);
  const ultimo = useRef<number>(-2);
  const alto = useThree((st) => st.size.height);
  const leer = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    if (!e.uv) return null;
    const i = Math.min(corte.ancho - 1, Math.floor(e.uv.x * corte.ancho));
    const j = Math.min(corte.alto - 1, Math.floor(e.uv.y * corte.alto));
    return corte.mapa[j * corte.ancho + i];
  };
  const mover = (e: ThreeEvent<PointerEvent>) => {
    const k = leer(e);
    if (k === null || k < 0) { if (ultimo.current !== -1) { ultimo.current = -1; onSenalar(null); } document.body.style.cursor = 'auto'; return; }
    e.stopPropagation();
    if (k !== ultimo.current) {
      ultimo.current = k;
      const it = corte.ids[k];
      onSenalar(it.id ? { kind: 'interior', id: it.id, lado: it.lado === 'm' ? 'i' : it.lado } : null);
    }
    document.body.style.cursor = k > 0 ? 'pointer' : 'auto';
  };
  /**
   * En la práctica, si el toque cae cerca de lo que se busca, se cuenta como
   * suyo: en el corte los núcleos miden 1-2 mm y van en racimo. «Cerca» es
   * ~0,5 mm o ~9 px de pantalla, lo que sea mayor (de lejos, 0,5 mm son un par
   * de píxeles), y nunca más de 2 mm.
   */
  const iman = (e: ThreeEvent<MouseEvent>): number | null => {
    const obj = marcas?.objetivo;
    if (!obj?.size || !e.uv) return null;
    const ci = Math.floor(e.uv.x * corte.ancho), cj = Math.floor(e.uv.y * corte.alto);
    const ppcm = corte.ancho / (VENTANA.x1 - VENTANA.x0);
    const cam = e.camera as THREE.PerspectiveCamera;
    const cmPorPx = cam.isPerspectiveCamera ? (2 * e.distance * Math.tan((cam.fov * Math.PI) / 360)) / Math.max(alto, 1) : 0;
    const radioCm = Math.min(0.2, Math.max(0.055, 9 * cmPorPx));
    const R = Math.max(3, Math.round(radioCm * ppcm));
    let mejor: number | null = null;
    let dMejor = Infinity;
    for (let dj = -R; dj <= R; dj++) for (let di = -R; di <= R; di++) {
      const i = ci + di, j = cj + dj;
      if (i < 0 || j < 0 || i >= corte.ancho || j >= corte.alto) continue;
      const k = corte.mapa[j * corte.ancho + i];
      const d = di * di + dj * dj;
      if (k > 0 && d <= R * R && d < dMejor && obj.has(corte.ids[k].id)) { mejor = k; dMejor = d; }
    }
    return mejor;
  };
  const tocar = (e: ThreeEvent<MouseEvent>) => {
    const k = iman(e) ?? leer(e);
    if (k === null || k <= 0) return;
    e.stopPropagation();
    const it = corte.ids[k];
    onElegir({ kind: 'interior', id: it.id, lado: it.lado === 'm' ? 'i' : it.lado });
  };
  const elegidoId = elegido?.kind === 'interior' ? elegido.id : null;
  return (
    <>
      <mesh geometry={geo} onPointerMove={mover} onPointerOut={() => { ultimo.current = -2; onSenalar(null); document.body.style.cursor = 'auto'; }} onClick={tocar} renderOrder={2}>
        <meshBasicMaterial map={tex} transparent alphaTest={0.02} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {corte.centros.filter((c) => {
        const it = corte.ids[c.k];
        // En la práctica solo se rotula la corrección (la respuesta y lo tocado por error).
        if (marcas) return (marcas.ok.has(it.id) || marcas.mal.has(it.id)) && it.lado !== 'd';
        return (etiquetas && c.area > 0.006 && it.lado !== 'd') || it.id === elegidoId;
      }).map((c) => {
        const it = corte.ids[c.k];
        const x = INTERIOR[it.id];
        const borde = marcas ? (marcas.ok.has(it.id) ? VERDE : ROJO) : x.color;
        return (
          <Html key={c.k} position={[c.x, y + 0.05, c.z]} center zIndexRange={[4, 0]}>
            <div style={{ ...estiloRotulo, background: marcas ? borde : oscuro ? 'rgba(13,11,40,0.88)' : 'rgba(26,26,46,0.82)', borderLeft: `3px solid ${borde}` }}>{x.nombre.replace(/^Núcleo (del |de la |de )?/, 'N. ')}</div>
          </Html>
        );
      })}
    </>
  );
}

// ── Escena ──────────────────────────────────────────────────────────────────

function Escena(p: SceneProps) {
  const { gl } = useThree();
  useEffect(() => { gl.localClippingEnabled = true; }, [gl]);
  const modelo = useMemo(() => modeloTronco(p.ligero), [p.ligero]);
  const { onListo } = p;
  useEffect(() => { onListo(); }, [onListo]);
  const reducido = useMemo(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, []);

  const enCorte = p.modo === 'cortes';
  const yCorte = NIVEL[p.nivel]?.y ?? 0;
  const plano = useMemo(() => (enCorte ? new THREE.Plane(new THREE.Vector3(0, -1, 0), yCorte) : null), [enCorte, yCorte]);

  // Nervio elegido en «Pares craneales»: el tronco pasa a cristal y se ven sus núcleos.
  const nervioEl = p.elegido?.kind === 'nervio' ? NERVIO[p.elegido.id as ParId] : null;
  const verNucleosNervio = p.modo === 'nervios' && !!nervioEl;

  const clinico = useMemo(() => {
    const s = new Set<string>();
    if (p.modo === 'clinico' && p.sindrome) {
      p.sindrome.signos.forEach((x) => s.add(x.id));
      if (p.sindrome.medial) s.add('*bilateral');
    }
    return s;
  }, [p.modo, p.sindrome]);
  const vacio = useMemo(() => new Set<string>(), []);
  // Qué copia (lado) de cada estructura daña el síndrome.
  const copias = useMemo(() => {
    const m = new Map<string, Set<string>>();
    if (p.modo !== 'clinico' || !p.sindrome) return m;
    for (const g of p.sindrome.signos) {
      const c = m.get(g.id) ?? new Set<string>(['m']);
      if (p.sindrome.medial) { c.add('i'); c.add('d'); } else c.add(g.copia ?? 'i');
      m.set(g.id, c);
    }
    return m;
  }, [p.modo, p.sindrome]);
  // Pares cuyo núcleo o fibras daña el síndrome.
  const paresDanados = useMemo(() => {
    const s = new Set<string>();
    // Par principal de cada núcleo (el ambiguo es sobre todo del X; el solitario no da un par visible).
    const principal: Record<string, string | null> = { n_ambiguo: 'X', n_solitario: null };
    clinico.forEach((id) => {
      const x = INTERIOR[id];
      if (!x?.pares) return;
      const par = id in principal ? principal[id] : x.pares[0];
      if (par) s.add(par);
    });
    return s;
  }, [clinico]);

  const idsInterior = useMemo(() => {
    if (p.modo === 'nucleos') return INTERIOR_LIST.filter((x) => p.mostrarVias || x.tipo === 'nucleo_par' || x.tipo === 'nucleo').filter((x) => x.tipo !== 'fibras').map((x) => x.id);
    if (verNucleosNervio && nervioEl) return nervioEl.nucleos;
    if (p.modo === 'clinico') return INTERIOR_LIST.filter((x) => x.tipo !== 'fibras' || clinico.has(x.id)).map((x) => x.id);
    return [];
  }, [p.modo, p.mostrarVias, verNucleosNervio, nervioEl, clinico]);

  const elegidoEst = idDe(p.elegido);
  const senaladoEst = idDe(p.senalado);
  const verCerebelo = p.modo === 'anatomia' || (p.modo === 'nervios' && !nervioEl);
  const nerviosVisibles = p.modo === 'nervios' || p.modo === 'clinico' || (p.modo === 'anatomia' && p.mostrarNervios) || enCorte;

  return (
    <>
      <LucesDeCamara oscuro={p.oscuro} />
      <Camara vista={p.vista} modo={p.modo} nivel={p.nivel} cerebelo={verCerebelo ? p.cerebelo : 'retirado'} reducido={reducido} />

      <Tronco
        geo={modelo.geo}
        fantasma={p.modo === 'nucleos' || p.modo === 'clinico' || verNucleosNervio}
        elegido={elegidoEst}
        senalado={senaladoEst}
        clinico={p.modo === 'clinico' ? clinico : vacio}
        marcas={p.practica}
        plano={plano}
        oscuro={p.oscuro}
        onElegir={p.onElegir}
        onSenalar={p.onSenalar}
      />

      {verCerebelo && (
        <Cerebelo
          estado={p.cerebelo}
          ligero={p.ligero}
          oscuro={p.oscuro}
          elegido={elegidoEst}
          onElegir={p.onElegir}
          onSenalar={p.onSenalar}
        />
      )}

      {nerviosVisibles && (
        <Nervios
          campo={modelo.campo}
          modo={p.modo}
          elegido={p.elegido}
          senalado={p.senalado}
          apagado={p.modo === 'clinico' || enCorte}
          resaltar={paresDanados}
          marcas={p.practica}
          plano={plano}
          onElegir={p.onElegir}
          onSenalar={p.onSenalar}
          etiquetas={p.etiquetas && (p.modo === 'nervios' || p.modo === 'anatomia')}
        />
      )}

      {idsInterior.length > 0 && (
        <Interior
          ids={idsInterior}
          elegido={p.elegido}
          senalado={p.senalado}
          clinico={p.modo === 'clinico' ? copias : null}
          marcas={p.practica}
          signo={p.signo}
          onElegir={p.onElegir}
          onSenalar={p.onSenalar}
          interactivo={p.modo === 'nucleos'}
        />
      )}

      {p.modo === 'clinico' && p.sindrome && <Lesion s={p.sindrome} />}

      {enCorte && (
        <TapaCorte nivel={p.nivel} oscuro={p.oscuro} etiquetas={p.etiquetas} elegido={p.elegido} marcas={p.practica} onElegir={p.onElegir} onSenalar={p.onSenalar} />
      )}

      {p.etiquetas && p.modo === 'anatomia' && ROTULOS.map((r) => {
        const e = ESTRUCTURAS[r.id];
        return <Rotulo key={r.id} p={r.p} n={r.n} texto={e.nombre.replace(/\s*\(.*\)$/, '')} />;
      })}

      {/* Marcas de orientación del corte */}
      {enCorte && (
        <>
          <Html position={[0, yCorte + 0.05, VENTANA.z1 + 0.2]} center zIndexRange={[4, 0]}><div style={estiloRotulo}>Anterior</div></Html>
          <Html position={[0, yCorte + 0.05, VENTANA.z0 - 0.1]} center zIndexRange={[4, 0]}><div style={estiloRotulo}>Posterior</div></Html>
        </>
      )}

      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={45} target={[0, 0.25, 0]} />
    </>
  );
}

export default function TroncoScene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [3, 0.6, 17], fov: 36, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
      onPointerMissed={props.onDeseleccionar}
    >
      <Escena {...props} />
    </Canvas>
  );
}

